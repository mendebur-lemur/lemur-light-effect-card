"""Lemur Light Effect Card.

Serves the dashboard card, registers it automatically and keeps the shared
household data (per-room tabs, favorites, light selection, hidden effects, last
played effect per light and custom effect icons) in Home Assistant storage.
"""
from __future__ import annotations

import base64
import json
import secrets
import logging
import os
import shutil
import time
from typing import Any

import voluptuous as vol

from homeassistant.components import panel_custom, websocket_api
from homeassistant.components.frontend import add_extra_js_url, async_remove_panel
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import Platform
from homeassistant.core import HomeAssistant, ServiceCall, SupportsResponse, callback
from homeassistant.exceptions import ServiceValidationError
import homeassistant.helpers.config_validation as cv
from homeassistant.helpers import area_registry as ar
from homeassistant.helpers.dispatcher import async_dispatcher_connect, async_dispatcher_send
from homeassistant.helpers.storage import Store

from . import engine
from .runtime import Runtime
from .voice import async_setup_voice
from .const import (
    LOADER_FILE,
    DOMAIN,
    ICON_DIR,
    MAX_ICON_BYTES,
    MAX_SETTINGS_BYTES,
    MAX_TABS_BYTES,
    OLD_ICON_DIR,
    OLD_STORAGE_KEY,
    OLD_URL_ICONS,
    PANEL_ELEMENT,
    PANEL_URL,
    SIGNAL_UPDATE,
    STORAGE_KEY,
    STORAGE_VERSION,
    URL_BASE,
    URL_ICONS,
    VERSION,
)

_LOGGER = logging.getLogger(__name__)

# "preview" is not in DEFAULT_DATA on purpose: it is only in the file while a control panel preview is open, so a
# restart in the middle can still put the lights back (runtime.py); cards never see it.
DEFAULT_DATA: dict[str, Any] = {
    "favorites": [],
    "hidden": [],
    "rooms": {},
    "last": {},
    "icons": {},
    "settings": {},
    "tabs": {},
    "recent": {},
}
PLATFORMS = [Platform.SELECT]
MIME_EXT = {"image/png": "png", "image/jpeg": "jpg", "image/webp": "webp", "image/gif": "gif"}
MAX_KEY = 200          # longest effect key, room id or tab id kept from the browser
MAX_ROOMS = 500        # most rooms in tabs / rooms
MAX_ICONS = 500        # most uploaded effect pictures


def _looks_like(raw: bytes, ext: str) -> bool:
    """The uploaded bytes really are the image type claimed (magic number), so nothing else is stored under an image name."""
    if ext == "png":
        return raw.startswith(b"\x89PNG\r\n\x1a\n")
    if ext == "jpg":
        return raw.startswith(b"\xff\xd8\xff")
    if ext == "gif":
        return raw[:6] in (b"GIF87a", b"GIF89a")
    if ext == "webp":
        return raw[:4] == b"RIFF" and raw[8:12] == b"WEBP"
    return False


def _clean_tabs(v: dict) -> dict:
    """One room's tab layout in the shape the card reads; written by any user, so types are enforced here."""
    out: dict[str, Any] = {}
    tabs = []
    for t in v.get("tabs") if isinstance(v.get("tabs"), list) else []:
        if not isinstance(t, dict) or not isinstance(t.get("id"), str):
            continue
        c: dict[str, Any] = {"id": t["id"][:80]}
        for k in ("name", "icon", "auto"):
            if isinstance(t.get(k), str):
                c[k] = t[k][:MAX_KEY]
        for k in ("fav", "recent"):
            if t.get(k):
                c[k] = 1
        c["fx"] = [str(x)[:MAX_KEY] for x in (t.get("fx") if isinstance(t.get("fx"), list) else []) if isinstance(x, str)][:2000]
        tabs.append(c)
        if len(tabs) >= 100:
            break
    if "tabs" in v:
        out["tabs"] = tabs
    if isinstance(v.get("hid"), list):
        out["hid"] = [str(x)[:MAX_KEY] for x in v["hid"] if isinstance(x, str)][:2000]
    if isinstance(v.get("light_icon"), str):
        out["light_icon"] = v["light_icon"][:MAX_KEY]
    for k, val in v.items():   # other small flags the card may add later (grow...), only plain values
        if k not in out and k not in ("tabs", "hid", "light_icon") and isinstance(val, (bool, int, float)) and len(out) < 20:
            out[k] = val
    return out


class LemurData:
    """Shared, persisted card data."""

    def __init__(self, hass: HomeAssistant) -> None:
        self.hass = hass
        self.store: Store = Store(hass, STORAGE_VERSION, STORAGE_KEY)
        self.data: dict[str, Any] = {k: (v.copy() if hasattr(v, "copy") else v) for k, v in DEFAULT_DATA.items()}
        self.icon_dir = hass.config.path(ICON_DIR)
        self.pending_preview: dict[str, Any] | None = None   # lights to put back after a restart during a preview
        self.preview_save: dict[str, Any] | None = None       # the same while a preview is open

    async def async_load(self) -> None:
        stored = await self.store.async_load()
        if stored is None:
            stored = await self._import_old()
        if isinstance(stored, dict):
            for key, default in DEFAULT_DATA.items():
                val = stored.get(key)
                if isinstance(val, type(default)):
                    self.data[key] = val
            if isinstance(stored.get("preview"), dict) and stored["preview"]:
                self.pending_preview = stored["preview"]
            try:   # a file from an older version or an edit by hand: same shape rules as a write
                self.data["settings"] = _clean_settings(self.data["settings"])
            except Exception:  # noqa: BLE001
                _LOGGER.exception("Stored settings could not be checked; starting with empty settings")
                self.data["settings"] = {}

    async def _import_old(self) -> dict[str, Any] | None:
        """First start: take over the data of the earlier "Ultimate Light Effect Card" if it is there."""
        try:
            old = await Store(self.hass, STORAGE_VERSION, OLD_STORAGE_KEY).async_load()
        except Exception:  # noqa: BLE001  (unknown or broken old file: start fresh)
            _LOGGER.warning("Could not read the earlier Ultimate Light Effect Card data; starting fresh")
            return None
        if not isinstance(old, dict):
            return None
        old_dir = self.hass.config.path(OLD_ICON_DIR)

        def _copy_icons() -> None:
            if not os.path.isdir(old_dir):
                return
            os.makedirs(self.icon_dir, exist_ok=True)
            for name in os.listdir(old_dir):
                src, dst = os.path.join(old_dir, name), os.path.join(self.icon_dir, name)
                if os.path.isfile(src) and not os.path.exists(dst):
                    shutil.copy2(src, dst)

        await self.hass.async_add_executor_job(_copy_icons)
        icons = old.get("icons")
        if isinstance(icons, dict):
            old["icons"] = {k: str(v).replace(OLD_URL_ICONS + "/", URL_ICONS + "/") for k, v in icons.items()}
        await self.store.async_save(old)
        _LOGGER.info("Imported the data of the earlier Ultimate Light Effect Card")
        return old

    def for_file(self) -> dict[str, Any]:
        return {**self.data, "preview": self.preview_save} if self.preview_save else self.data

    @callback
    def changed(self, keys: list[str] | None = None) -> None:
        """Save soon and tell open cards. With keys, only those parts are sent (cards merge per key)."""
        self.store.async_delay_save(self.for_file, 1.0)
        if keys is not None and not keys:
            return   # only the file changes (preview snapshot)
        payload = self.data if keys is None else {k: self.data.get(k) for k in keys}
        async_dispatcher_send(self.hass, SIGNAL_UPDATE, payload)


async def _register_static(hass: HomeAssistant, icon_dir: str) -> None:
    frontend_dir = os.path.join(os.path.dirname(__file__), "frontend")
    try:
        from homeassistant.components.http import StaticPathConfig  # 2024.6+

        await hass.http.async_register_static_paths(
            [
                StaticPathConfig(URL_BASE, frontend_dir, True),  # files carry ?v=<version>
                StaticPathConfig(URL_ICONS, icon_dir, False),
            ]
        )
    except ImportError:  # older cores
        hass.http.register_static_path(URL_BASE, frontend_dir, False)
        hass.http.register_static_path(URL_ICONS, icon_dir, False)


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    data = LemurData(hass)
    await hass.async_add_executor_job(lambda: os.makedirs(data.icon_dir, exist_ok=True))
    # The files come first: a page opened while Home Assistant is still starting only gets our file once this ran.
    # Every page loads the small loader; it loads the card file and tries again when that download fails.
    # The second address is a spare copy for the case that the first download of the loader itself fails.
    loader = f"{URL_BASE}/{LOADER_FILE}?v={VERSION}"
    first = not hass.data.get(f"{DOMAIN}_static")
    if not hass.data.get(f"{DOMAIN}_files"):
        await _register_static(hass, data.icon_dir)
        add_extra_js_url(hass, loader)
        add_extra_js_url(hass, loader + "&b=1")
        hass.data[f"{DOMAIN}_files"] = True
    await data.async_load()
    hass.data[DOMAIN] = data
    data.runtime = Runtime(hass, data)
    data.runtime.start()

    if first:
        for handler in (ws_get, ws_set, ws_patch, ws_last, ws_icon_upload, ws_icon_delete, ws_subscribe, ws_info, ws_preview, ws_latest):
            websocket_api.async_register_command(hass, handler)
        _register_services(hass)
        hass.data[f"{DOMAIN}_static"] = True
    if PANEL_URL not in hass.data.get("frontend_panels", {}):
        turkish = (hass.config.language or "").lower().startswith("tr")
        await panel_custom.async_register_panel(
            hass,
            frontend_url_path=PANEL_URL,
            webcomponent_name=PANEL_ELEMENT,
            sidebar_title="Lemur Işık Efekt Kartı" if turkish else "Lemur Light Effect Card",
            sidebar_icon="mdi:lightbulb-auto",
            module_url=loader,  # the panel element is filled in when the card file arrives
            require_admin=True,
            config={},
        )
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    data.voice = await async_setup_voice(hass, data)
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    ok = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    data = hass.data.pop(DOMAIN, None)
    if data is not None:
        # a change made just before a reload is still waiting in async_delay_save; write it now
        try:
            data.runtime.stop()
            await data.runtime.preview_end(True)
            await data.store.async_save(data.for_file())
        except Exception:  # noqa: BLE001
            _LOGGER.exception("Could not save before unloading")
        if getattr(data, "voice", None) is not None:
            data.voice.stop()
    async_remove_panel(hass, PANEL_URL)
    return ok


def _data(hass: HomeAssistant) -> LemurData | None:
    return hass.data.get(DOMAIN)


@websocket_api.websocket_command({vol.Required("type"): "lemur_light_effects/get"})
@callback
def ws_get(hass, connection, msg):
    data = _data(hass)
    if data is None:
        connection.send_error(msg["id"], "not_loaded", "Integration not loaded")
        return
    connection.send_result(msg["id"], data.data)


# settings keys whose shape the card, the panel and engine.py rely on; a wrong shape (e.g. from a hand-edited backup) is dropped
_SET_STR_LISTS = ("order", "hidden_areas", "exclude", "include")
_SET_DICTS = ("layout", "fx_use", "fill", "room_icons")


def _num(v: Any) -> float | None:
    if isinstance(v, bool) or not isinstance(v, (int, float, str)):
        return None
    try:
        f = float(v)
    except ValueError:
        return None
    return f if f == f and abs(f) < 1e9 else None


def _clean_action(a: Any) -> dict | None:
    """What one light does in an own effect or a fill rule: only the fields engine.py and the card read, in their types."""
    if not isinstance(a, dict):
        return None
    out: dict[str, Any] = {}
    if isinstance(a.get("mode"), str):
        out["mode"] = a["mode"][:20]
    if isinstance(a.get("fx"), str):
        out["fx"] = a["fx"][:MAX_KEY]
    rgb = a.get("rgb")
    if isinstance(rgb, list) and len(rgb) == 3 and all(_num(x) is not None for x in rgb):
        out["rgb"] = [max(0, min(255, int(_num(x)))) for x in rgb]
    for k in ("k", "br"):
        n = _num(a.get(k))
        if n is not None:
            out[k] = n
    return out


def _clean_actions(v: Any) -> dict:
    """light -> action"""
    out = {}
    if isinstance(v, dict):
        for eid, a in list(v.items())[:1000]:
            c = _clean_action(a)
            if isinstance(eid, str) and c is not None:
                out[eid[:MAX_KEY]] = c
    return out


def _clean_settings(value: dict) -> dict:
    """Settings in the shape the card, the panel and engine.py rely on.

    A wrong shape (a hand-edited backup, another client) is dropped here, so it cannot stop playing, the room
    selects or voice commands later. Unknown keys with plain values pass through for newer cards."""
    out = dict(value)
    for k in _SET_STR_LISTS:
        if k in out:
            v = out[k]
            if isinstance(v, list):
                out[k] = [x for x in v if isinstance(x, str)]
            else:
                out.pop(k)
    for k in _SET_DICTS:
        if k in out and not isinstance(out[k], dict):
            out.pop(k)
    for k in ("layout", "room_icons"):   # light -> room, room -> icon
        if k in out:
            out[k] = {a: b for a, b in out[k].items() if isinstance(a, str) and isinstance(b, str)}
    if "fx_use" in out:                   # light -> on/off
        out["fx_use"] = {a: b for a, b in out["fx_use"].items() if isinstance(a, str) and isinstance(b, (bool, int, str))}
    if "fill" in out:                     # effect -> {all: action, lights: {light: action}}
        fill = {}
        for key, f in list(out["fill"].items())[:2000]:
            if not isinstance(key, str) or not isinstance(f, dict):
                continue
            c: dict[str, Any] = {"lights": _clean_actions(f.get("lights"))}
            a = _clean_action(f.get("all"))
            if a is not None:
                c["all"] = a
            fill[key[:MAX_KEY]] = c
        out["fill"] = fill
    if "custom" in out:
        v = out["custom"]
        custom = []
        for c in v if isinstance(v, list) else []:
            if not (isinstance(c, dict) and isinstance(c.get("id"), str) and isinstance(c.get("name"), str)):
                continue
            c = dict(c)
            c["lights"] = _clean_actions(c.get("lights"))
            if "fallback" in c:
                fb = _clean_action(c["fallback"])
                if fb is None:
                    c.pop("fallback")
                else:
                    c["fallback"] = fb
            if "base" in c and not isinstance(c["base"], str):
                c.pop("base")
            custom.append(c)
            if len(custom) >= 500:
                break
        out["custom"] = custom
    return out


def _tabs_shape(cfg: Any) -> dict[str, tuple]:
    """Tab id -> what a visitor may not change (name, icon, kind)."""
    out = {}
    for t in (cfg or {}).get("tabs") or [] if isinstance(cfg, dict) else []:
        if isinstance(t, dict) and isinstance(t.get("id"), str):
            out[t["id"]] = (t.get("name"), t.get("icon"), t.get("auto"), bool(t.get("fav")), bool(t.get("recent")))
    return out


@websocket_api.websocket_command(
    {
        vol.Required("type"): "lemur_light_effects/set",
        vol.Required("key"): vol.In(["favorites", "hidden", "rooms", "settings", "tabs"]),
        vol.Required("value"): vol.Any(list, dict),
    }
)
@callback
def ws_set(hass, connection, msg):
    data = _data(hass)
    if data is None:
        connection.send_error(msg["id"], "not_loaded", "Integration not loaded")
        return
    key, value = msg["key"], msg["value"]
    # replacing a whole key is for administrators (restore, reset, older panels); cards change one room with .../patch
    if not connection.user.is_admin:
        connection.send_error(msg["id"], "unauthorized", "Only administrators can replace " + key)
        return
    if key == "settings":
        if not isinstance(value, dict) or len(json.dumps(value)) > MAX_SETTINGS_BYTES:
            connection.send_error(msg["id"], "invalid", "settings must be a small object")
            return
        data.data[key] = _clean_settings(value)
    elif key == "tabs":
        # per-room tab layout of the card; anyone may star or hide an effect from the card
        if not isinstance(value, dict) or len(json.dumps(value)) > MAX_TABS_BYTES:
            connection.send_error(msg["id"], "invalid", "tabs must be a small object")
            return
        data.data[key] = {str(k)[:MAX_KEY]: _clean_tabs(v) for k, v in list(value.items())[:MAX_ROOMS] if isinstance(v, dict)}
    elif key in ("favorites", "hidden"):
        if not isinstance(value, list):
            connection.send_error(msg["id"], "invalid", "list expected")
            return
        data.data[key] = [str(v)[:MAX_KEY] for v in value][:2000]
    else:
        if not isinstance(value, dict) or len(json.dumps(value)) > MAX_TABS_BYTES:
            connection.send_error(msg["id"], "invalid", "rooms must be a small object")
            return
        data.data[key] = {str(k)[:MAX_KEY]: [str(e)[:MAX_KEY] for e in v][:500] for k, v in list(value.items())[:MAX_ROOMS] if isinstance(v, list)}
    data.changed([key])
    connection.send_result(msg["id"], {key: data.data[key]})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "lemur_light_effects/patch",
        vol.Required("key"): vol.In(["rooms", "settings", "tabs"]),
        vol.Optional("set", default=dict): dict,
        vol.Optional("remove", default=list): [str],
    }
)
@callback
def ws_patch(hass, connection, msg):
    """Change parts of one key: single rooms of tabs / rooms, single settings.

    Two screens that edit different rooms or different settings no longer overwrite each other. Anyone may star or
    hide an effect and pick a room's lights from the card, so one room's tabs and lights can be written by any user,
    but only an administrator may remove a room's layout, rename or delete its tabs, or change settings."""
    data = _data(hass)
    if data is None:
        connection.send_error(msg["id"], "not_loaded", "Integration not loaded")
        return
    key, sets, remove = msg["key"], msg["set"], msg["remove"]
    admin = connection.user.is_admin
    if len(sets) > MAX_ROOMS or len(remove) > MAX_ROOMS:
        connection.send_error(msg["id"], "invalid", "too many parts")
        return
    if key == "settings" or remove:
        if not admin:
            connection.send_error(msg["id"], "unauthorized", "Only administrators can change this")
            return
    cur = data.data[key] if isinstance(data.data.get(key), dict) else {}
    new = dict(cur)
    if key == "settings":
        new.update(sets)
        for k in remove:
            new.pop(k, None)
        if len(json.dumps(new)) > MAX_SETTINGS_BYTES:
            connection.send_error(msg["id"], "invalid", "settings must be a small object")
            return
        new = _clean_settings(new)
    else:
        for rid, v in sets.items():
            rid = str(rid)[:MAX_KEY]
            if not admin and rid not in ("_all", "_none") and not ar.async_get(hass).async_get_area(rid):
                connection.send_error(msg["id"], "invalid", "unknown room")
                return
            if key == "tabs":
                if not isinstance(v, dict):
                    connection.send_error(msg["id"], "invalid", "a room's tabs must be an object")
                    return
                v = _clean_tabs(v)
                if not admin:
                    # a visitor's card may move effects between tabs (star, hide) and add tabs the first time a
                    # room is saved, but every tab that exists keeps its name, icon and kind
                    old_shape, new_shape = _tabs_shape(cur.get(rid)), _tabs_shape(v)
                    if any(new_shape.get(i) != sh for i, sh in old_shape.items()):
                        connection.send_error(msg["id"], "unauthorized", "Only administrators can rename or remove tabs")
                        return
                new[rid] = v
            else:
                if not isinstance(v, list):
                    connection.send_error(msg["id"], "invalid", "a room's lights must be a list")
                    return
                new[rid] = [str(e)[:MAX_KEY] for e in v][:500]
        for rid in remove:
            new.pop(rid, None)
        if len(new) > MAX_ROOMS or len(json.dumps(new)) > MAX_TABS_BYTES:
            connection.send_error(msg["id"], "invalid", key + " must be a small object")
            return
    data.data[key] = new
    data.changed([key])
    connection.send_result(msg["id"], {key: new})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "lemur_light_effects/last",
        vol.Required("entities"): [str],
        vol.Optional("effect"): vol.Any(str, None),
        vol.Optional("room"): vol.Any(str, None),
    }
)
@callback
def ws_last(hass, connection, msg):
    data = _data(hass)
    if data is None:
        connection.send_error(msg["id"], "not_loaded", "Integration not loaded")
        return
    # anyone may record what they played, but only for real lights and real rooms, so the store can't be filled with junk
    ents = [e for e in dict.fromkeys(msg["entities"]) if isinstance(e, str) and e.startswith("light.") and hass.states.get(e)][:300]
    room = msg.get("room")
    if room is not None and room not in ("_all", "_none") and not ar.async_get(hass).async_get_area(str(room)):
        room = None
    effect = msg.get("effect")
    data.runtime.remember(room, ents, str(effect)[:MAX_KEY] if effect else None)
    connection.send_result(msg["id"], {"ok": True})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "lemur_light_effects/icon_upload",
        vol.Required("key"): str,
        vol.Required("mime"): str,
        vol.Required("data"): str,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_icon_upload(hass, connection, msg):
    data = _data(hass)
    if data is None:
        connection.send_error(msg["id"], "not_loaded", "Integration not loaded")
        return
    ext = MIME_EXT.get(msg["mime"])
    if not ext:
        connection.send_error(msg["id"], "invalid_type", "Unsupported image type")
        return
    try:
        raw = base64.b64decode(msg["data"], validate=True)
    except (ValueError, TypeError):
        connection.send_error(msg["id"], "invalid_data", "Invalid base64")
        return
    if len(raw) > MAX_ICON_BYTES:
        connection.send_error(msg["id"], "too_large", "Icon is larger than 512 KB")
        return
    if not _looks_like(raw, ext):
        connection.send_error(msg["id"], "invalid_type", "The file is not the image type it claims to be")
        return
    key = msg["key"][:MAX_KEY]
    if key not in data.data["icons"] and len(data.data["icons"]) >= MAX_ICONS:
        connection.send_error(msg["id"], "too_many", f"At most {MAX_ICONS} uploaded icons")
        return
    name = secrets.token_hex(8) + "." + ext   # not derived from the effect name: the folder is served without login
    path = os.path.join(data.icon_dir, name)
    old = data.data["icons"].get(key)

    def _write():
        if old:
            old_path = os.path.join(data.icon_dir, os.path.basename(old.split("?")[0]))
            if old_path != path and os.path.exists(old_path):
                os.remove(old_path)
        with open(path, "wb") as fh:
            fh.write(raw)

    await hass.async_add_executor_job(_write)
    url = f"{URL_ICONS}/{name}?v={int(time.time())}"
    data.data["icons"][key] = url
    data.changed(["icons"])
    connection.send_result(msg["id"], {"url": url})


@websocket_api.websocket_command(
    {vol.Required("type"): "lemur_light_effects/icon_delete", vol.Required("key"): str}
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_icon_delete(hass, connection, msg):
    data = _data(hass)
    if data is None:
        connection.send_error(msg["id"], "not_loaded", "Integration not loaded")
        return
    url = data.data["icons"].pop(msg["key"], None)
    if url:
        path = os.path.join(data.icon_dir, os.path.basename(str(url).split("?")[0]))

        def _rm():
            if os.path.exists(path):
                os.remove(path)

        await hass.async_add_executor_job(_rm)
        data.changed(["icons"])
    connection.send_result(msg["id"], {"ok": True})


@websocket_api.websocket_command({vol.Required("type"): "lemur_light_effects/subscribe"})
@callback
def ws_subscribe(hass, connection, msg):
    @callback
    def _forward(payload):
        connection.send_message(websocket_api.event_message(msg["id"], payload))

    connection.subscriptions[msg["id"]] = async_dispatcher_connect(hass, SIGNAL_UPDATE, _forward)
    connection.send_result(msg["id"])


@websocket_api.websocket_command({vol.Required("type"): "lemur_light_effects/info"})
@callback
def ws_info(hass, connection, msg):
    """Version of the integration, so an outdated card in a browser cache can ask for a reload."""
    connection.send_result(msg["id"], {"version": VERSION})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "lemur_light_effects/preview",
        vol.Required("action"): vol.In(["start", "play", "end"]),
        vol.Optional("room"): cv.string,
        vol.Optional("effect"): cv.string,
        vol.Optional("restore", default=True): bool,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_preview(hass, connection, msg):
    """Control panel preview: start (remember the lights), play (an effect right away), end (put them back or keep)."""
    data = _data(hass)
    if data is None:
        connection.send_error(msg["id"], "not_loaded", "Lemur Light Effect Card is not loaded")
        return
    rt = data.runtime
    try:
        if msg["action"] == "end":
            await rt.preview_end(msg["restore"])
            connection.send_result(msg["id"], {"room": None})
            return
        room = engine.find_room(hass, data.data.get("settings") or {}, msg.get("room") or "")
        if not room:
            connection.send_error(msg["id"], "unknown_room", f"Unknown room: {msg.get('room')}")
            return
        if msg["action"] == "start":
            await rt.preview_start(room)
            connection.send_result(msg["id"], {"room": room["id"]})
            return
        u = await rt.preview_play(room, msg.get("effect") or "")
        connection.send_result(msg["id"], {"room": room["id"], "effect": u["key"], "lights": list(u["names"])})
    except ValueError as err:
        connection.send_error(msg["id"], "preview_failed", str(err))


REPO_API = "https://api.github.com/repos/mendebur-lemur/lemur-light-effect-card/releases/latest"
REPO_WEB = "https://github.com/mendebur-lemur/lemur-light-effect-card/"
MAX_RELEASE_BYTES = 1_000_000


@websocket_api.websocket_command({vol.Required("type"): "lemur_light_effects/latest"})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_latest(hass, connection, msg):
    """Newest release on GitHub, for installs without HACS or Marketplace (the panel's "check for updates")."""
    from homeassistant.helpers.aiohttp_client import async_get_clientsession
    import aiohttp

    try:
        async with async_get_clientsession(hass).get(
            REPO_API, headers={"Accept": "application/vnd.github+json"}, timeout=aiohttp.ClientTimeout(total=10)
        ) as resp:
            if resp.status != 200:
                connection.send_error(msg["id"], "github", f"GitHub answered {resp.status}")
                return
            raw = b""
            async for chunk in resp.content.iter_chunked(65536):
                raw += chunk
                if len(raw) > MAX_RELEASE_BYTES:
                    connection.send_error(msg["id"], "github", "The answer from GitHub is too large")
                    return
        d = json.loads(raw)
    except Exception as err:  # noqa: BLE001 - network errors of any kind end up in the panel as text
        connection.send_error(msg["id"], "github", (str(err) or type(err).__name__)[:200])
        return
    if not isinstance(d, dict):
        connection.send_error(msg["id"], "github", "Unexpected answer from GitHub")
        return
    url = d.get("html_url")
    if not (isinstance(url, str) and url.startswith(REPO_WEB) and ".." not in url and len(url) < 300):
        url = REPO_WEB + "releases"
    connection.send_result(msg["id"], {"version": str(d.get("tag_name") or "").lstrip("v")[:40], "url": url, "installed": VERSION})


PLAY_SCHEMA = vol.Schema(
    {
        vol.Required("room"): cv.string,
        vol.Required("effect"): cv.string,
        vol.Optional("brightness"): vol.All(vol.Coerce(int), vol.Range(min=1, max=100)),
        vol.Optional("transition"): vol.All(vol.Coerce(float), vol.Range(min=0, max=60)),
    }
)
STOP_SCHEMA = vol.Schema(
    {vol.Required("room"): cv.string, vol.Optional("transition"): vol.All(vol.Coerce(float), vol.Range(min=0, max=60))}
)
ROOM_SCHEMA = vol.Schema({vol.Required("room"): cv.string})


def _register_services(hass: HomeAssistant) -> None:
    def room_of(call: ServiceCall) -> tuple[LemurData, dict[str, Any]]:
        data = _data(hass)
        if data is None:
            raise ServiceValidationError("Lemur Light Effect Card is not loaded")
        room = engine.find_room(hass, data.data.get("settings") or {}, call.data["room"])
        if not room:
            raise ServiceValidationError(f"Unknown room: {call.data['room']}")
        return data, room

    async def play(call: ServiceCall) -> None:
        data, room = room_of(call)
        try:
            await data.runtime.play(room, call.data["effect"], call.data.get("brightness"), call.data.get("transition"))
        except ValueError as err:
            raise ServiceValidationError(str(err)) from err

    async def stop(call: ServiceCall) -> None:
        data, room = room_of(call)
        await data.runtime.stop_room(room, call.data.get("transition"))

    async def list_effects(call: ServiceCall) -> dict[str, Any]:
        data, room = room_of(call)
        us = engine.units(hass, data.data, room)
        return {
            "room": room["id"],
            "name": room["name"],
            "playing": engine.playing(hass, data.data, room, us),
            "effects": sorted((u["label"] for u in us.values()), key=str.lower),
        }

    hass.services.async_register(DOMAIN, "play", play, schema=PLAY_SCHEMA)
    hass.services.async_register(DOMAIN, "stop", stop, schema=STOP_SCHEMA)
    hass.services.async_register(DOMAIN, "list_effects", list_effects, schema=ROOM_SCHEMA, supports_response=SupportsResponse.ONLY)
