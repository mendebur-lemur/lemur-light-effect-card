"""Server side of the card: rooms, effects and playing them.

The card decides most things in the browser. The same rules live here so a
service call or a select entity can do what a tap on the
card does, without a browser.
"""
from __future__ import annotations

import asyncio
import math
import re
from typing import Any

from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import area_registry as ar
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er
from homeassistant.util import dt as dt_util

OFF_RE = re.compile(r"^(off|none|stop|solid|no effect|static|normal|default)$", re.I)
SYN = {
    "candlelight": "candle", "candle light": "candle", "candle flicker": "candle", "candleflicker": "candle",
    "fireplace": "fire", "fire place": "fire", "fire flicker": "fire",
    "colorloop": "color loop", "colour loop": "color loop", "colourloop": "color loop",
    "romance": "romantic", "sun rise": "sunrise", "sun set": "sunset", "rain bow": "rainbow",
    "nightlight": "night light", "breathing": "breathe", "strobe light": "strobe",
}
NOISE_PLATFORMS = {"browser_mod", "bambu_lab", "octoprint", "prusalink", "moonraker"}
NONE_OPTION = "—"
TRANSITION_FEATURE = 32  # LightEntityFeature.TRANSITION


def norm(name: Any) -> str:
    s = str(name).lower()
    s = re.sub(r"^music\s*:\s*", "music ", s)
    s = re.sub(r"[^a-z0-9À-ɏ]+", " ", s)
    return s.strip()


def pretty(name: Any) -> str:
    s = re.sub(r"^music\s*:\s*", "", str(name), flags=re.I).strip()
    return s[:1].upper() + s[1:]


def parse_list(effects: Any) -> tuple[dict[str, str], str | None]:
    """Effect key -> name as the light calls it, plus the light's own 'off' effect."""
    m: dict[str, str] = {}
    off = None
    for nm in effects if isinstance(effects, list) else []:
        if not isinstance(nm, str) or not nm.strip():
            continue
        if OFF_RE.match(nm.strip()):
            off = off or nm
            continue
        k = norm(nm)
        if k and k not in m:
            m[k] = nm
    for k in list(m):
        s = SYN.get(k)
        if s and s not in m:
            m[s] = m.pop(k)
    return m, off


def effect_key(name: str) -> str:
    k = norm(name)
    return SYN.get(k, k)


# ---------------------------------------------------------------- rooms
def _noise(hass: HomeAssistant, ent: er.RegistryEntry | None, eid: str) -> str | None:
    st = hass.states.get(eid)
    n = str((st and st.attributes.get("friendly_name")) or eid)
    p = ent.platform if ent else None
    if p == "browser_mod":
        return "screen"
    if re.search(r"\bsegment[ _]?\d+$", n, re.I) or re.search(r"_segment_\d+$", eid):
        return "segment"
    if re.search(r"(\bleds$|switch state$|status led|indicator)", n, re.I):
        return "indicator"
    if p in NOISE_PLATFORMS or re.search(r"(chamber|heatbed|printer|nozzle) light$", n, re.I):
        return "device"
    return None


def rooms(hass: HomeAssistant, settings: dict[str, Any]) -> list[dict[str, Any]]:
    """Rooms the card shows, in the same order: [{id, name, lights}]. '_all' is the whole home."""
    ereg, dreg, areg = er.async_get(hass), dr.async_get(hass), ar.async_get(hass)
    layout = settings.get("layout") or {}
    exclude, include = set(settings.get("exclude") or []), set(settings.get("include") or [])
    groups_ok = bool(settings.get("include_groups"))
    by: dict[str, list[str]] = {}
    none: list[str] = []
    for st in hass.states.async_all("light"):
        eid = st.entity_id
        ent = ereg.async_get(eid)
        if ent and (ent.hidden_by or ent.entity_category):
            continue
        if isinstance(st.attributes.get("entity_id"), list) and not groups_ok:
            continue
        place = layout.get(eid)
        if place == "_hidden":
            continue
        if place and (place == "_none" or areg.async_get_area(place)):
            room = place
        elif eid in exclude:
            continue
        elif _noise(hass, ent, eid) and eid not in include:
            continue
        else:
            aid = ent.area_id if ent else None
            if not aid and ent and ent.device_id:
                dev = dreg.async_get(ent.device_id)
                aid = dev.area_id if dev else None
            room = aid if aid and areg.async_get_area(aid) else "_none"
        (none if room == "_none" else by.setdefault(room, [])).append(eid)

    hidden = set(settings.get("hidden_areas") or [])
    order = [a for a in (settings.get("order") or []) if a == "_all" or (a == "_none" and none) or a in by]
    rest = sorted((a for a in by if a not in order), key=lambda a: areg.async_get_area(a).name.lower())
    rids = order + rest
    if none and "_none" not in rids:
        rids.append("_none")
    rids = [a for a in rids if a not in hidden]
    lang = str(hass.config.language or "en").lower()[:2]
    home_n, other_n = {"tr": ("Tüm Ev", "Diğer"), "de": ("Ganzes Zuhause", "Ohne Raum"), "es": ("Toda la casa", "Sin estancia"),
                       "fr": ("Toute la maison", "Sans pièce")}.get(lang, ("Whole home", "Other"))
    out = []
    for a in rids:
        if a == "_all":
            continue
        if a == "_none":
            out.append({"id": "_none", "name": other_n, "lights": sorted(none)})
        else:
            out.append({"id": a, "name": areg.async_get_area(a).name, "lights": sorted(by[a])})
    all_on = settings.get("all_home") is not False and "_all" not in hidden
    if all_on and len(out) > 1:
        out.insert(0, {"id": "_all", "name": home_n, "lights": sorted({x for r in out for x in r["lights"]})})
    return out


def find_room(hass: HomeAssistant, settings: dict[str, Any], room: str) -> dict[str, Any] | None:
    q = str(room or "").strip()
    rs = rooms(hass, settings)
    for r in rs:
        if r["id"] == q:
            return r
    low = q.lower()
    for r in rs:
        if r["name"].lower() == low:
            return r
    if low in ("all", "home", "tüm ev", "tum ev", "whole home"):
        return next((r for r in rs if r["id"] == "_all"), None)
    return None


# ---------------------------------------------------------------- effects
def fx_on(settings: dict[str, Any], eid: str, n: int) -> bool:
    u = (settings.get("fx_use") or {}).get(eid)
    if u is False:
        return False
    if u is True:
        return n > 0
    try:
        need = int(settings.get("min_effects") or 3)
    except (TypeError, ValueError):
        need = 3
    return n >= need


def selected(data: dict[str, Any], room: dict[str, Any]) -> list[str]:
    v = (data.get("rooms") or {}).get(room["id"])
    return [x for x in room["lights"] if x in v] if isinstance(v, list) else list(room["lights"])


def hidden_keys(data: dict[str, Any], rid: str) -> set[str]:
    cfg = (data.get("tabs") or {}).get(rid)
    if isinstance(cfg, dict) and isinstance(cfg.get("tabs"), list):
        return set(cfg.get("hid") or [])
    return set(data.get("hidden") or [])


def custom_list(settings: dict[str, Any]) -> list[dict[str, Any]]:
    return [c for c in settings.get("custom") or [] if isinstance(c, dict) and c.get("id") and c.get("name")]


def custom_action(c: dict[str, Any], hass: HomeAssistant, eid: str, cap_ok: bool) -> dict[str, Any] | None:
    ex = (c.get("lights") or {}).get(eid)
    if c.get("v") == 2 and not ex:
        return None
    if ex and ex.get("mode") and ex["mode"] != "auto":
        return None if ex["mode"] == "skip" else ex
    st = hass.states.get(eid)
    lst = st.attributes.get("effect_list") if st else None
    if c.get("base") and cap_ok and isinstance(lst, list):
        nm = parse_list(lst)[0].get(c["base"])
        if nm:
            return {"mode": "fx", "fx": nm}
    fb = c.get("fallback")
    return fb if isinstance(fb, dict) and fb.get("mode") not in (None, "skip", "auto") else None


def units(hass: HomeAssistant, data: dict[str, Any], room: dict[str, Any]) -> dict[str, dict[str, Any]]:
    """Everything a room can play: key -> {label, names: {light: name or action}, custom}."""
    settings = data.get("settings") or {}
    ids = [x for x in selected(data, room) if hass.states.get(x)]
    hid = hidden_keys(data, room["id"])
    out: dict[str, dict[str, Any]] = {}
    for eid in ids:
        m = parse_list(hass.states.get(eid).attributes.get("effect_list"))[0]
        if not fx_on(settings, eid, len(m)):
            continue
        for k, nm in m.items():
            if k in hid:
                continue
            u = out.setdefault(k, {"key": k, "label": pretty(nm), "names": {}, "custom": None})
            u["names"][eid] = nm
    for c in custom_list(settings):
        k = "u:" + str(c["id"])
        if k in hid:
            continue
        names = {}
        for eid in ids:
            n = len(parse_list(hass.states.get(eid).attributes.get("effect_list"))[0])
            a = custom_action(c, hass, eid, fx_on(settings, eid, n))
            if a:
                names[eid] = a
        if names:
            out[k] = {"key": k, "label": str(c["name"]), "names": names, "custom": c}
    # labels must be unique for a select
    seen: dict[str, int] = {}
    for u in out.values():
        seen[u["label"].lower()] = seen.get(u["label"].lower(), 0) + 1
    for u in out.values():
        if seen[u["label"].lower()] > 1 and not u["custom"]:
            u["label"] = f'{u["label"]} ({u["key"]})'
    return out


def find_unit(us: dict[str, dict[str, Any]], effect: str) -> dict[str, Any] | None:
    q = str(effect or "").strip()
    if not q:
        return None
    if q in us:
        return us[q]
    low = q.lower()
    for u in us.values():
        if u["label"].lower() == low:
            return u
    for u in us.values():
        if u["custom"] and str(u["custom"].get("name", "")).lower() == low:
            return u
    k = effect_key(q)
    if k in us:
        return us[k]
    for u in us.values():
        if any(isinstance(n, str) and n.lower() == low for n in u["names"].values()):
            return u
    return None


def playing(hass: HomeAssistant, data: dict[str, Any], room: dict[str, Any], us: dict[str, dict[str, Any]] | None = None) -> str | None:
    """Key of the effect every selected, effect-capable light that is on plays right now, if they agree."""
    us = us if us is not None else units(hass, data, room)
    last = data.get("last") or {}
    keys = set()
    for eid in selected(data, room):
        st = hass.states.get(eid)
        if not st or st.state != "on":
            continue
        lk = (last.get(eid) or {}).get("effect")
        if isinstance(lk, str) and lk.startswith("u:") and lk in us:
            keys.add(lk)
            continue
        e = st.attributes.get("effect")
        if isinstance(e, str) and e.strip() and not OFF_RE.match(e.strip()):
            m = parse_list(st.attributes.get("effect_list"))[0]
            keys.add(next((k for k, n in m.items() if n == e), effect_key(e)))
    if len(keys) != 1:
        return None
    k = next(iter(keys))
    return k if k in us else None


# ---------------------------------------------------------------- limits and light details
def night_max(settings: dict[str, Any]) -> int | None:
    if not settings.get("night_on"):
        return None

    def mins(v: Any) -> int | None:
        x = re.match(r"^(\d{1,2}):(\d{2})", str(v or ""))
        return int(x.group(1)) * 60 + int(x.group(2)) if x else None

    f, t = mins(settings.get("night_from") or "23:00"), mins(settings.get("night_to") or "07:00")
    if f is None or t is None:
        return None
    now = dt_util.now()
    m = now.hour * 60 + now.minute
    inside = f <= m < t if f <= t else (m >= f or m < t)
    if not inside:
        return None
    try:
        return max(1, min(100, int(settings.get("night_max") or 30)))
    except (TypeError, ValueError):
        return 30


def caps(hass: HomeAssistant, eid: str) -> dict[str, bool]:
    st = hass.states.get(eid)
    modes = list((st and st.attributes.get("supported_color_modes")) or [])
    if not modes:
        return {"ct": True, "color": True, "dim": True}
    ct = "color_temp" in modes
    color = any(m in modes for m in ("hs", "rgb", "rgbw", "rgbww", "xy"))
    return {"ct": ct, "color": color, "dim": ct or color or any(m in modes for m in ("brightness", "white"))}


def can_fade(hass: HomeAssistant, eid: str) -> bool:
    st = hass.states.get(eid)
    return bool(st and int(st.attributes.get("supported_features") or 0) & TRANSITION_FEATURE)


def k2rgb(k: float) -> list[int]:
    t = k / 100
    r = 255 if t <= 66 else max(0, min(255, 329.698727446 * (t - 60) ** -0.1332047592))
    g = max(0, min(255, 99.4708025861 * math.log(t) - 161.1195681661 if t <= 66 else 288.1221695283 * (t - 60) ** -0.0755148492))
    b = 255 if t >= 66 else 0 if t <= 19 else max(0, min(255, 138.5177312231 * math.log(t - 10) - 305.0447927307))
    return [round(r), round(g), round(b)]


def clamp_k(hass: HomeAssistant, eid: str, k: float) -> int:
    st = hass.states.get(eid)
    a = st.attributes if st else {}
    return int(max(a.get("min_color_temp_kelvin") or 1000, min(a.get("max_color_temp_kelvin") or 12000, k)))


def transition_of(settings: dict[str, Any], value: Any = None) -> float:
    v = value if value is not None else settings.get("transition")
    try:
        return max(0.0, min(60.0, float(v or 0)))
    except (TypeError, ValueError):
        return 0.0


# ---------------------------------------------------------------- service calls
async def _turn_on(hass: HomeAssistant, groups: dict[str, dict[str, Any]], fade: float) -> None:
    calls = []
    for g in groups.values():
        d = dict(g["d"])
        ids = g["ids"]
        if fade and "effect" not in d:
            slow = [x for x in ids if can_fade(hass, x)]
            fast = [x for x in ids if x not in slow]
            if slow:
                calls.append(hass.services.async_call("light", "turn_on", {**d, "entity_id": slow, "transition": fade}, blocking=False))
            if fast:
                calls.append(hass.services.async_call("light", "turn_on", {**d, "entity_id": fast}, blocking=False))
        else:
            calls.append(hass.services.async_call("light", "turn_on", {**d, "entity_id": ids}, blocking=False))
    if calls:
        await asyncio.gather(*calls)


def _add(groups: dict[str, dict[str, Any]], d: dict[str, Any], eid: str) -> None:
    key = repr(sorted(d.items()))
    groups.setdefault(key, {"d": d, "ids": []})["ids"].append(eid)


async def apply_unit(hass: HomeAssistant, settings: dict[str, Any], u: dict[str, Any], brightness: int | None = None,
                     transition: float | None = None) -> list[str]:
    """Play one effect (or own effect) on its lights. Returns the lights it touched."""
    cap = night_max(settings)
    ob = settings.get("fx_on_brightness")
    fade = transition_of(settings, transition)
    groups: dict[str, dict[str, Any]] = {}
    offs: list[str] = []

    def bright(eid: str, wanted: Any) -> int | None:
        st = hass.states.get(eid)
        off = not st or st.state != "on"
        b = brightness if brightness is not None else (wanted if wanted else (ob if off and ob else None))
        if cap and caps(hass, eid)["dim"]:
            cur = round(st.attributes["brightness"] / 2.55) if st and st.attributes.get("brightness") else None
            if b is None and (off or cur is None or cur > cap):
                b = cap
            elif b is not None:
                b = min(int(b), cap)
        return int(b) if b else None

    for eid, a in u["names"].items():
        if isinstance(a, str):
            d = {"effect": a}
            b = bright(eid, None)
            if b and caps(hass, eid)["dim"]:
                d["brightness_pct"] = b
            _add(groups, d, eid)
            continue
        mode = a.get("mode")
        if mode == "off":
            offs.append(eid)
            continue
        if mode == "fx":
            d = {"effect": a.get("fx")}
            b = bright(eid, None)
            if b and caps(hass, eid)["dim"]:
                d["brightness_pct"] = b
            _add(groups, d, eid)
            continue
        c = caps(hass, eid)
        d = {}
        if mode == "color" and isinstance(a.get("rgb"), list) and c["color"]:
            d["rgb_color"] = [int(x) for x in a["rgb"]]
        if mode == "white":
            k = float(a.get("k") or 3000)
            if c["ct"]:
                d["color_temp_kelvin"] = clamp_k(hass, eid, k)
            elif c["color"]:
                d["rgb_color"] = k2rgb(k)
        b = bright(eid, a.get("br"))
        if b and c["dim"]:
            d["brightness_pct"] = b
        _add(groups, d, eid)
    await _turn_on(hass, groups, fade)
    if offs:
        await hass.services.async_call("light", "turn_off", {"entity_id": offs, **({"transition": fade} if fade else {})}, blocking=False)
    return list(u["names"])


async def stop_room(hass: HomeAssistant, settings: dict[str, Any], ids: list[str], transition: float | None = None) -> None:
    """What the Stop button does: each light's own 'off' effect, then a calm white."""
    on = [x for x in ids if (s := hass.states.get(x)) and s.state == "on"]
    offs: dict[str, list[str]] = {}
    for eid in on:
        st = hass.states.get(eid)
        _, off = parse_list(st.attributes.get("effect_list"))
        e = st.attributes.get("effect")
        if off and not (isinstance(e, str) and OFF_RE.match(e.strip())):
            offs.setdefault(off, []).append(eid)
    for nm, x in offs.items():
        await hass.services.async_call("light", "turn_on", {"entity_id": x, "effect": nm}, blocking=False)
    if offs:
        await asyncio.sleep(0.35)
    try:
        k = float(settings.get("kelvin") or 3200)
        b = int(settings.get("brightness") or 40)
    except (TypeError, ValueError):
        k, b = 3200.0, 40
    cap = night_max(settings)
    if cap:
        b = min(b, cap)
    groups: dict[str, dict[str, Any]] = {}
    for eid in on:
        c, d = caps(hass, eid), {}
        if c["ct"]:
            d["color_temp_kelvin"] = clamp_k(hass, eid, k)
        elif c["color"]:
            d["rgb_color"] = k2rgb(k)
        if c["dim"]:
            d["brightness_pct"] = b
        _add(groups, d, eid)
    await _turn_on(hass, groups, transition_of(settings, transition))
