"""Server side helpers used by the services and the select entities."""
from __future__ import annotations

import asyncio
import logging
import time
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers.event import async_call_later
from homeassistant.helpers.start import async_at_started

from . import engine

_LOGGER = logging.getLogger(__name__)

RECENT_MAX = 12
PREVIEW_SCENE = "lemur_light_effects_preview"
PREVIEW_IDLE = 600  # seconds without a tap before a forgotten preview puts the lights back


class Runtime:
    """Per-installation helpers, kept in hass.data[DOMAIN].runtime."""

    def __init__(self, hass: HomeAssistant, store: Any) -> None:
        self.hass = hass
        self.store = store  # LemurData
        self._pv: dict[str, Any] | None = None  # control panel preview: room, lights, idle timer
        self._pv_lock = asyncio.Lock()          # start, play and end never overlap

    def start(self) -> None:
        """A preview that was open when Home Assistant stopped: put those lights back once it has started."""
        saved = self.store.pending_preview
        self.store.pending_preview = None
        if not saved:
            return

        async def _restore(_hass: HomeAssistant) -> None:
            try:
                await self._restore_saved(saved)
            except Exception:  # noqa: BLE001
                _LOGGER.exception("Could not put the lights back after the interrupted preview")
            self.store.changed([])   # write the file without the preview

        async_at_started(self.hass, _restore)

    def stop(self) -> None:
        """Called on unload; __init__ then ends an open preview (lights go back) before the last save."""

    @property
    def data(self) -> dict[str, Any]:
        return self.store.data

    @property
    def settings(self) -> dict[str, Any]:
        return self.data.get("settings") or {}

    def remember(self, room_id: str | None, ids: list[str], key: str | None) -> None:
        """Last effect per light and the room's recently used list, like the card does."""
        ts = time.time()
        for e in ids:
            if key:
                self.data["last"][e] = {"effect": key, "ts": ts}
            else:
                self.data["last"].pop(e, None)
        if room_id and key:
            rec = self.data.setdefault("recent", {})
            lst = [k for k in rec.get(room_id, []) if k != key]
            rec[room_id] = [key, *lst][:RECENT_MAX]
        self.store.changed(["last", "recent"])

    async def play(self, room: dict[str, Any], effect: str, brightness: int | None = None, transition: float | None = None) -> dict[str, Any]:
        us = engine.units(self.hass, self.data, room)
        u = engine.find_unit(us, effect)
        if not u:
            if not us and room["lights"] and not any((st := self.hass.states.get(x)) and st.state != "unavailable" for x in engine.selected(self.data, room)):
                raise ValueError(f"The lights of {room['name']} are not reachable right now")
            raise ValueError(f"'{effect}' is not an effect of {room['name']}")
        await engine.apply_unit(self.hass, self.settings, u, brightness, transition)
        self.remember(room["id"], list(u["names"]), u["key"])
        return u

    async def stop_room(self, room: dict[str, Any], transition: float | None = None) -> None:
        ids = engine.selected(self.data, room)
        await engine.stop_room(self.hass, self.settings, ids, transition)
        self.remember(None, ids, None)

    # ---- control panel preview: tapped effects play right away, the lights go back afterwards ----
    @property
    def preview_room(self) -> str | None:
        return self._pv["room"] if self._pv else None

    def _touch(self) -> None:
        pv = self._pv
        if not pv:
            return
        if pv.get("cancel"):
            pv["cancel"]()

        async def _idle(_now: Any) -> None:
            await self.preview_end(True)

        pv["cancel"] = async_call_later(self.hass, PREVIEW_IDLE, _idle)

    def _snapshot(self, ids: list[str]) -> dict[str, Any]:
        """What is needed to put the lights back by hand after a restart (the temporary scene does not survive one)."""
        out: dict[str, Any] = {}
        for eid in ids:
            st = self.hass.states.get(eid)
            if not st or st.state not in ("on", "off"):
                continue
            a = st.attributes
            d: dict[str, Any] = {"on": st.state == "on"}
            if st.state == "on":
                if a.get("brightness") is not None:
                    d["brightness"] = a["brightness"]
                eff = a.get("effect")
                if isinstance(eff, str) and eff.strip() and not engine.OFF_RE.match(eff.strip()):
                    d["effect"] = eff
                elif a.get("color_mode") == "color_temp" and a.get("color_temp_kelvin"):
                    d["color_temp_kelvin"] = a["color_temp_kelvin"]
                elif isinstance(a.get("rgb_color"), (list, tuple)) and a.get("color_mode") not in (None, "brightness", "onoff", "white"):
                    d["rgb_color"] = list(a["rgb_color"])[:3]
            out[eid] = d
        return out

    async def _restore_saved(self, saved: dict[str, Any]) -> None:
        for eid, d in (saved.get("lights") or {}).items():
            st = self.hass.states.get(eid)
            if not isinstance(d, dict) or not isinstance(eid, str) or not eid.startswith("light.") or not st or st.state == "unavailable":
                continue
            if not d.get("on"):
                await self.hass.services.async_call("light", "turn_off", {"entity_id": eid}, blocking=False)
                continue
            call = {k: d[k] for k in ("brightness", "effect", "color_temp_kelvin", "rgb_color") if k in d}
            await self.hass.services.async_call("light", "turn_on", {"entity_id": eid, **call}, blocking=False)

    async def preview_start(self, room: dict[str, Any]) -> None:
        """Remember how the room's lights look now (a temporary scene) before anything plays."""
        async with self._pv_lock:
            await self._preview_start(room)

    async def _preview_start(self, room: dict[str, Any]) -> None:
        if self._pv and self._pv["room"] == room["id"]:
            self._touch()
            return
        if self._pv:
            await self._preview_end(True)
        if not self.hass.services.has_service("scene", "create"):
            raise ValueError("The scene integration is needed for the preview")
        ids = [x for x in room["lights"] if self.hass.states.get(x)]
        snap = self._snapshot(ids)
        if ids:
            await self.hass.services.async_call("scene", "create", {"scene_id": PREVIEW_SCENE, "snapshot_entities": ids}, blocking=True)
        self._pv = {"room": room["id"], "ids": ids, "cancel": None, "key": None}
        self.store.preview_save = {"room": room["id"], "lights": snap}
        self.store.changed([])
        self._touch()

    async def preview_play(self, room: dict[str, Any], effect: str) -> dict[str, Any]:
        """Play an effect without touching last/recent (it is only a try)."""
        async with self._pv_lock:
            if not self._pv or self._pv["room"] != room["id"]:
                await self._preview_start(room)
            us = engine.units(self.hass, self.data, room)
            u = engine.find_unit(us, effect)
            if not u:
                raise ValueError(f"'{effect}' is not an effect of {room['name']}")
            await engine.apply_unit(self.hass, self.settings, u)
            if self._pv:
                self._pv["key"] = u["key"]
                self._pv["lights"] = list(u["names"])
                self._touch()
            return u

    async def preview_end(self, restore: bool = True) -> None:
        """Put the lights back as they were (restore) or leave the last effect playing."""
        async with self._pv_lock:
            await self._preview_end(restore)

    async def _preview_end(self, restore: bool = True) -> None:
        pv, self._pv = self._pv, None
        if not pv:
            return
        if pv.get("cancel"):
            pv["cancel"]()
        self.store.preview_save = None
        try:
            if restore and pv["ids"]:
                await self.hass.services.async_call("scene", "turn_on", {"entity_id": f"scene.{PREVIEW_SCENE}"}, blocking=True)
            elif not restore and pv.get("key"):
                self.remember(pv["room"], pv.get("lights") or [], pv["key"])
        finally:
            self.store.changed([])   # the file no longer needs the snapshot
