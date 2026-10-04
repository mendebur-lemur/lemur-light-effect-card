"""Voice commands (Assist): "salonda kuzey ışıkları efektini aç", "play the aurora effect in the bedroom".

The sentences are registered as sentence triggers on Home Assistant's own conversation agent,
the same way an automation with a "Sentence" trigger does. They need no setup and no YAML.
The word "efekt" / "effect" has to be in the sentence, so ordinary light commands keep working.
Without a room the command goes to the room of the voice satellite, or else to the whole home.
"""
from __future__ import annotations

import difflib
import json
import logging
import os
import re
from typing import Any

from homeassistant.core import CALLBACK_TYPE, HomeAssistant, callback
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er

from . import engine
from .const import DOMAIN

_LOGGER = logging.getLogger(__name__)

PLAY_VERBS_TR = "(aç|başlat|oynat|çal|yak|çalıştır)"
SENTENCES_PLAY = [
    "{q} efektini " + PLAY_VERBS_TR,
    "{q} efekti " + PLAY_VERBS_TR,
    "{q} efektine geç",
    "{q} efektini {r} " + PLAY_VERBS_TR,
    "(play|start|turn on|run) [the] {q} effect",
    "(play|start|turn on|run) [the] {q} effect (in|on) [the] {r}",
    "(play|start|turn on|run) [the] effect {q}",
]
SENTENCES_STOP = [
    "(efekti|efektleri|efekt) (durdur|kapat|bitir)",
    "{r} (efekti|efektleri|efekt) (durdur|kapat|bitir)",
    "(efekti|efektleri) {r} (durdur|kapat|bitir)",
    "stop [the] (effect|effects)",
    "(stop|turn off) [the] (effect|effects) (in|on) [the] {r}",
    "(stop|turn off) [the] {r} (effect|effects)",
]

# Turkish case endings a room name can carry: "salonda", "mutfaktaki", "yatak odasında"
ROOM_SUFFIX = re.compile(r"^(n?(da|de|ta|te)(ki)?|ki|n?in|n?ın|n?un|n?ün|ya|ye|a|e)?$")
ALL_WORDS = ("tum ev", "butun ev", "evin tamami", "her yer", "her yerde", "evde", "whole home", "whole house", "everywhere", "all rooms", "the house", "home")
FOLD = str.maketrans("çğıöşüâîûİI", "cgiosuaiuii")


def fold(s: Any) -> str:
    t = str(s or "").replace("İ", "i").replace("I", "ı").lower().translate(FOLD)
    t = re.sub(r"^music\s*:\s*", "", t)
    return re.sub(r"[^a-z0-9]+", " ", t).strip()


def load_names() -> dict[str, dict[str, str]]:
    """Turkish names of known effects, built from the card's tables (build.py).

    "trn": general names (normalised light name -> Turkish); "gov": names the card uses when a light's
    list is the big scene catalogue. Both are accepted when listening; the reply uses the card's choice.
    """
    p = os.path.join(os.path.dirname(__file__), "fx_names.json")
    try:
        with open(p, encoding="utf-8") as f:
            d = json.load(f)
    except (OSError, ValueError):
        return {"trn": {}, "gov": {}}
    return {k: {str(a): str(b) for a, b in (d.get(k) or {}).items()} for k in ("trn", "gov")} if isinstance(d, dict) else {"trn": {}, "gov": {}}


class Voice:
    """Parses the spoken words and plays or stops effects through the runtime."""

    def __init__(self, hass: HomeAssistant, store: Any, names: dict[str, dict[str, str]]) -> None:
        self.hass = hass
        self.store = store
        self.trn = names.get("trn") or {}
        self.gov = names.get("gov") or {}
        self._govl: dict[str, bool] = {}
        self._unsub: list[CALLBACK_TYPE] = []

    # ---------------------------------------------------------------- registration
    @callback
    def start(self) -> bool:
        try:
            from homeassistant.components.conversation.agent_manager import get_agent_manager
            from homeassistant.components.conversation.trigger import TriggerDetails
        except ImportError:
            _LOGGER.debug("Assist is not available, voice commands are off")
            return False
        try:
            mgr = get_agent_manager(self.hass)
            self._unsub.append(mgr.register_trigger(TriggerDetails(sentences=list(SENTENCES_PLAY), callback=self._on_play)))
            self._unsub.append(mgr.register_trigger(TriggerDetails(sentences=list(SENTENCES_STOP), callback=self._on_stop)))
        except Exception:  # noqa: BLE001 - Assist internals changed: the card keeps working without voice
            _LOGGER.warning("Could not register the voice commands", exc_info=True)
            return False
        return True

    @callback
    def stop(self) -> None:
        while self._unsub:
            try:
                self._unsub.pop()()
            except Exception:  # noqa: BLE001
                pass

    # ---------------------------------------------------------------- helpers
    def _lang(self, user_input: Any) -> str:
        lang = str(getattr(user_input, "language", None) or self.hass.config.language or "en").lower()
        return "tr" if lang.startswith("tr") else "en"

    def _settings(self) -> dict[str, Any]:
        return self.store.data.get("settings") or {}

    def _rooms(self) -> list[dict[str, Any]]:
        return engine.rooms(self.hass, self._settings())

    def _home(self, rooms: list[dict[str, Any]]) -> dict[str, Any] | None:
        return next((r for r in rooms if r["id"] == "_all"), None) or (rooms[0] if len(rooms) == 1 else None)

    def _here(self, user_input: Any, rooms: list[dict[str, Any]]) -> dict[str, Any] | None:
        """Room of the voice satellite or device that heard the command."""
        dev_id = getattr(user_input, "device_id", None)
        sat = getattr(user_input, "satellite_id", None)
        if sat:
            ent = er.async_get(self.hass).async_get(sat)
            if ent and ent.area_id:
                return next((r for r in rooms if r["id"] == ent.area_id), None)
            if ent and ent.device_id:
                dev_id = ent.device_id
        if dev_id:
            dev = dr.async_get(self.hass).async_get(dev_id)
            if dev and dev.area_id:
                return next((r for r in rooms if r["id"] == dev.area_id), None)
        return None

    def room_of(self, text: str, rooms: list[dict[str, Any]]) -> dict[str, Any] | None:
        """A room said on its own ("salonda", "the bedroom")."""
        t = fold(text)
        t = re.sub(r"^the ", "", t)
        if not t:
            return None
        if t in ALL_WORDS:
            return next((r for r in rooms if r["id"] == "_all"), None)
        for r in sorted(rooms, key=lambda x: -len(fold(x["name"]))):
            n = fold(r["name"])
            if t == n or (t.startswith(n) and ROOM_SUFFIX.match(t[len(n):])) or t == fold(r["id"]):
                return r
        return None

    def split(self, text: str, rooms: list[dict[str, Any]]) -> tuple[dict[str, Any] | None, str]:
        """'salonda kuzey ışıkları' -> (Salon, 'kuzey ışıkları'). The room may also come last (English).

        The effect part is returned in the words as spoken (not folded), for the reply.
        """
        t = fold(text)
        words = str(text or "").split()
        best: tuple[int, dict[str, Any] | None, str] = (0, None, text)
        home = next((r for r in rooms if r["id"] == "_all"), None)
        cands = [(fold(r["name"]), r) for r in rooms] + [(w, home) for w in ALL_WORDS]
        for n, r in cands:
            if not n or r is None:
                continue
            k = len(n.split())
            if t.startswith(n):
                word, _, after = t[len(n):].partition(" ")
                if ROOM_SUFFIX.match(word) and after.strip() and len(n) > best[0]:
                    best = (len(n), r, " ".join(words[k:]))
            m = re.match(r"^(.*) (in|on) (the )?" + re.escape(n) + "$", t)
            if m and len(n) > best[0]:
                best = (len(n), r, " ".join(words[: len(m.group(1).split())]))
        return best[1], best[2]

    def _catalogue(self, eid: str) -> bool:
        """Same rule as the card: 15+ effects and at least 40% of them in the scene catalogue."""
        st = self.hass.states.get(eid)
        lst = st.attributes.get("effect_list") if st else None
        sig = f"{eid}:{len(lst) if isinstance(lst, list) else 0}"
        if sig not in self._govl:
            m = engine.parse_list(lst)[0]
            hit = sum(1 for n in m.values() if engine.norm(n) in self.gov)
            self._govl = {k: v for k, v in self._govl.items() if not k.startswith(eid + ":")}
            self._govl[sig] = len(m) >= 15 and hit / max(len(m), 1) >= 0.4
        return self._govl[sig]

    def tr_names(self, u: dict[str, Any]) -> list[str]:
        """Turkish names of a unit, the one the card shows first."""
        out: list[str] = []
        for eid, nm in u["names"].items():
            if not isinstance(nm, str):
                continue
            n = engine.norm(nm)
            g, t = self.gov.get(n), self.trn.get(re.sub(r"^music ", "", n)) or self.trn.get(engine.effect_key(nm))
            for x in ([g, t] if self._catalogue(eid) else [t, g]):
                if x and x not in out:
                    out.append(x)
        return out

    def spoken(self, u: dict[str, Any], lang: str) -> str:
        if u["custom"]:
            return str(u["custom"].get("name") or u["label"])
        tr = self.tr_names(u) if lang == "tr" else []
        return tr[0] if tr else u["label"]

    def find(self, us: dict[str, dict[str, Any]], said: str) -> dict[str, Any] | None:
        """Best effect for the spoken words: exact name in any language first, then a close match."""
        q = fold(said)
        q = re.sub(r"^(the )", "", q)
        if not q:
            return None
        table: list[tuple[str, dict[str, Any]]] = []
        for u in us.values():
            forms = {u["label"], u["key"]}
            if u["custom"]:
                forms.add(str(u["custom"].get("name") or ""))
            forms.update(self.tr_names(u))
            for nm in u["names"].values():
                if isinstance(nm, str):
                    forms.add(nm)
            for f in forms:
                ff = fold(f)
                if ff:
                    table.append((ff, u))
        for ff, u in table:
            if ff == q:
                return u
        # "kuzey isiklari" vs "kuzey isigi", speech-to-text slips
        best, score = None, 0.0
        for ff, u in table:
            s = difflib.SequenceMatcher(None, q, ff).ratio()
            if s > score:
                best, score = u, s
        return best if score >= 0.8 else None

    # ---------------------------------------------------------------- commands
    async def _on_play(self, user_input: Any, result: Any) -> str | None:
        slots = {k: getattr(v, "text", None) or str(getattr(v, "value", "")) for k, v in (getattr(result, "entities", None) or {}).items()}
        return await self.play_text(slots.get("q", ""), slots.get("r"), user_input)

    async def _on_stop(self, user_input: Any, result: Any) -> str | None:
        slots = {k: getattr(v, "text", None) or str(getattr(v, "value", "")) for k, v in (getattr(result, "entities", None) or {}).items()}
        return await self.stop_text(slots.get("r"), user_input)

    async def play_text(self, q: str, r: str | None, user_input: Any = None) -> str:
        lang = self._lang(user_input)
        rooms = self._rooms()
        room = None
        if r:
            room = self.room_of(r, rooms)
            if room is None:
                return f"{r.strip()} adında bir oda bulamadım." if lang == "tr" else f"I couldn't find a room called {r.strip()}."
        else:
            room, rest = self.split(q, rooms)
            if room is not None:
                q = rest
        room = room or self._here(user_input, rooms) or self._home(rooms)
        if room is None:
            return "Hangi odada? Komutta odanın adını söyle." if lang == "tr" else "Which room? Say the room's name in the command."
        us = engine.units(self.hass, self.store.data, room)
        u = self.find(us, q)
        if u is None:
            return (f"{room['name']} için {q.strip()} adında bir efekt bulamadım." if lang == "tr"
                    else f"I couldn't find an effect called {q.strip()} in {room['name']}.")
        await self.store.runtime.play(room, u["key"])
        name = self.spoken(u, lang)
        return f"{room['name']}, {name} başladı." if lang == "tr" else f"{name} is playing in {room['name']}."

    async def stop_text(self, r: str | None, user_input: Any = None) -> str:
        lang = self._lang(user_input)
        rooms = self._rooms()
        room = None
        if r:
            room = self.room_of(r, rooms)
            if room is None:
                return f"{r.strip()} adında bir oda bulamadım." if lang == "tr" else f"I couldn't find a room called {r.strip()}."
        room = room or self._here(user_input, rooms) or self._home(rooms)
        if room is None:
            return "Hangi odada? Komutta odanın adını söyle." if lang == "tr" else "Which room? Say the room's name in the command."
        await self.store.runtime.stop_room(room)
        return f"{room['name']}, efekt durduruldu." if lang == "tr" else f"Effects stopped in {room['name']}."


async def async_setup_voice(hass: HomeAssistant, store: Any) -> Voice:
    names = await hass.async_add_executor_job(load_names)
    v = Voice(hass, store, names)

    @callback
    def go(_: Any = None) -> None:
        if DOMAIN in hass.data and "conversation" in hass.config.components:
            v.start()

    from homeassistant.helpers.start import async_at_started

    v._unsub.append(async_at_started(hass, go))
    return v
