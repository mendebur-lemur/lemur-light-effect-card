"""Server side helpers used by the services and the select entities."""
from __future__ import annotations

import time
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers.event import async_call_later

from . import engine

RECENT_MAX = 12
PREVIEW_SCENE = "lemur_light_effects_preview"
PREVIEW_IDLE = 600  # seconds without a tap before a forgotten preview puts the lights back


class Runtime:
    """Per-installation helpers, kept in hass.data[DOMAIN].runtime."""

    def __init__(self, hass: HomeAssistant, store: Any) -> None:
        self.hass = hass
        self.store = store  # LemurData
        self._pv: dict[str, Any] | None = None  # control panel preview: room, lights, idle timer

    def start(self) -> None:
        """Nothing runs in the background (kept for symmetry with stop)."""

    def stop(self) -> None:
        """An open preview puts the lights back when the integration unloads."""
        if self._pv:
            self.hass.async_create_task(self.preview_end(True))

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

    async def preview_start(self, room: dict[str, Any]) -> None:
        """Remember how the room's lights look now (a temporary scene) before anything plays."""
        if self._pv and self._pv["room"] == room["id"]:
            self._touch()
            return
        if self._pv:
            await self.preview_end(True)
        if not self.hass.services.has_service("scene", "create"):
            raise ValueError("The scene integration is needed for the preview")
        ids = [x for x in room["lights"] if self.hass.states.get(x)]
        if ids:
            await self.hass.services.async_call("scene", "create", {"scene_id": PREVIEW_SCENE, "snapshot_entities": ids}, blocking=True)
        self._pv = {"room": room["id"], "ids": ids, "cancel": None, "key": None}
        self._touch()

    async def preview_play(self, room: dict[str, Any], effect: str) -> dict[str, Any]:
        """Play an effect without touching last/recent (it is only a try)."""
        if not self._pv or self._pv["room"] != room["id"]:
            await self.preview_start(room)
        us = engine.units(self.hass, self.data, room)
        u = engine.find_unit(us, effect)
        if not u:
            raise ValueError(f"'{effect}' is not an effect of {room['name']}")
        await engine.apply_unit(self.hass, self.settings, u)
        self._pv["key"] = u["key"]
        self._touch()
        return u

    async def preview_end(self, restore: bool = True) -> None:
        """Put the lights back as they were (restore) or leave the last effect playing."""
        pv, self._pv = self._pv, None
        if not pv:
            return
        if pv.get("cancel"):
            pv["cancel"]()
        if restore and pv["ids"]:
            await self.hass.services.async_call("scene", "turn_on", {"entity_id": f"scene.{PREVIEW_SCENE}"}, blocking=True)
        elif not restore and pv.get("key"):
            self.remember(pv["room"], pv["ids"], pv["key"])
