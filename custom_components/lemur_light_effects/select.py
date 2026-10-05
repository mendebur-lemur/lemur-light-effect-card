"""One select entity per room: shows the effect playing there and plays the one you pick.

Usable from automations, scripts, voice assistants and any other card.
"""
from __future__ import annotations

import logging
import re
from typing import Any

from homeassistant.components.select import SelectEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import EVENT_STATE_CHANGED
from homeassistant.core import Event, HomeAssistant, callback
from homeassistant.helpers import area_registry as ar
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.debounce import Debouncer
from homeassistant.helpers.device_registry import DeviceEntryType, DeviceInfo
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from . import engine
from .const import DOMAIN, SIGNAL_UPDATE

_LOGGER = logging.getLogger(__name__)


def _slug(s: str) -> str:
    t = str(s).lower().translate(str.maketrans("çğıöşüâîû", "cgiosuaiu"))
    return re.sub(r"[^a-z0-9]+", "_", t).strip("_") or "room"


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry, add: AddEntitiesCallback) -> None:
    store = hass.data[DOMAIN]
    ents: dict[str, RoomEffectSelect] = {}
    device = DeviceInfo(identifiers={(DOMAIN, entry.entry_id)}, name="Lemur",
                        manufacturer="mendebur-lemur", entry_type=DeviceEntryType.SERVICE)

    @callback
    def sync(*_: Any) -> None:
        rs = {r["id"]: r for r in engine.rooms(hass, store.data.get("settings") or {})
              if r["id"] in ents or engine.units(hass, store.data, r)}
        new = [RoomEffectSelect(hass, store, entry, rid, r["name"], device) for rid, r in rs.items() if rid not in ents]
        for e in new:
            ents[e.room_id] = e
        if new:
            add(new)
        reg = er.async_get(hass)
        for rid in [x for x in ents if x not in rs]:
            e = ents.pop(rid)
            if e.entity_id and reg.async_get(e.entity_id):
                reg.async_remove(e.entity_id)
        for rid, e in ents.items():
            e.room_name = rs[rid]["name"]
        refresh()

    @callback
    def refresh(*_: Any) -> None:
        for e in ents.values():
            e.refresh()

    deb = Debouncer(hass, _LOGGER, cooldown=1.0, immediate=False, function=sync)

    @callback
    def later(*_: Any) -> None:
        hass.async_create_task(deb.async_call())

    sync()
    entry.async_on_unload(async_dispatcher_connect(hass, SIGNAL_UPDATE, later))
    entry.async_on_unload(hass.bus.async_listen(ar.EVENT_AREA_REGISTRY_UPDATED, later))
    entry.async_on_unload(hass.bus.async_listen(er.EVENT_ENTITY_REGISTRY_UPDATED, later))
    entry.async_on_unload(deb.async_shutdown)

    @callback
    def is_light(data: Any) -> bool:
        return str(data.get("entity_id", "")).startswith("light.")

    @callback
    def light_changed(ev: Event) -> None:
        eid = ev.data.get("entity_id", "")
        old, new = ev.data.get("old_state"), ev.data.get("new_state")
        if old is None or new is None:
            later()  # a light came or went: rooms may change
        else:
            a, b = old.attributes, new.attributes
            # brightness and colour changes don't change the options or what is playing
            if old.state == new.state and a.get("effect") == b.get("effect") and a.get("effect_list") == b.get("effect_list"):
                return
        for e in ents.values():
            if eid in e.lights:
                e.refresh()

    entry.async_on_unload(hass.bus.async_listen(EVENT_STATE_CHANGED, light_changed, event_filter=is_light))

class RoomEffectSelect(SelectEntity):
    """The effect of one room."""

    _attr_has_entity_name = True
    _attr_translation_key = "room_effect"
    _attr_icon = "mdi:lightbulb-auto"
    _attr_should_poll = False

    def __init__(self, hass: HomeAssistant, store: Any, entry: ConfigEntry, room_id: str, room_name: str, device: DeviceInfo) -> None:
        self.hass = hass
        self.store = store
        self.room_id = room_id
        self.room_name = room_name
        self.lights: set[str] = set()
        self._attr_unique_id = f"{entry.entry_id}_{room_id}_effect"
        self._attr_device_info = device
        self._attr_translation_placeholders = {"room": room_name}
        slug = "home" if room_id == "_all" else "other" if room_id == "_none" else _slug(room_id)
        self.entity_id = f"select.lemur_{slug}_effect"
        self._units: dict[str, dict[str, Any]] = {}
        self._compute()

    def _room(self) -> dict[str, Any] | None:
        return next((r for r in engine.rooms(self.hass, self.store.data.get("settings") or {}) if r["id"] == self.room_id), None)

    def _compute(self) -> None:
        room = self._room()
        if not room:
            self._attr_available = False
            self._attr_options = [engine.NONE_OPTION]
            self._attr_current_option = None
            return
        self._attr_available = True
        self.lights = set(room["lights"])
        us = engine.units(self.hass, self.store.data, room)
        self._units = us
        mine = sorted((u for u in us.values() if u["custom"]), key=lambda u: u["label"].lower())
        rest = sorted((u for u in us.values() if not u["custom"]), key=lambda u: u["label"].lower())
        self._attr_options = [engine.NONE_OPTION, *[u["label"] for u in mine + rest]]
        k = engine.playing(self.hass, self.store.data, room, us)
        self._attr_current_option = us[k]["label"] if k and k in us else engine.NONE_OPTION
        self._attr_translation_placeholders = {"room": room["name"]}
        self._attr_extra_state_attributes = {"room_id": room["id"], "lights": engine.selected(self.store.data, room), "effect_key": k}

    @callback
    def refresh(self) -> None:
        def snap() -> tuple:
            return (self._attr_options, self._attr_current_option, self._attr_available,
                    getattr(self, "_attr_extra_state_attributes", None), self._attr_translation_placeholders)
        before = snap()
        self._compute()
        if self.hass and self.entity_id and before != snap():
            self.async_write_ha_state()

    async def async_select_option(self, option: str) -> None:
        room = self._room()
        if not room:
            return
        rt = self.store.runtime
        if option == engine.NONE_OPTION:
            await rt.stop_room(room)
        else:
            await rt.play(room, option)
        self.refresh()
