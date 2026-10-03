"""Server side helpers used by the services and the select entities."""
from __future__ import annotations

import time
from typing import Any

from homeassistant.core import HomeAssistant

from . import engine

RECENT_MAX = 12


class Runtime:
    """Per-installation helpers, kept in hass.data[DOMAIN].runtime."""

    def __init__(self, hass: HomeAssistant, store: Any) -> None:
        self.hass = hass
        self.store = store  # LemurData

    def start(self) -> None:
        """Nothing runs in the background (kept for symmetry with stop)."""

    def stop(self) -> None:
        """Nothing to clean up."""

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
        self.store.changed()

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
