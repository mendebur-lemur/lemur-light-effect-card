"""Regressions found in the October 2026 pre-launch sweep (v1.6.4)."""
from datetime import timedelta
import logging
from unittest.mock import patch

import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry, async_fire_time_changed, async_mock_service
from homeassistant.setup import async_setup_component
from homeassistant.helpers import area_registry as ar, entity_registry as er
from homeassistant.util import dt as dt_util

from custom_components.lemur_light_effects.const import DOMAIN

FX = ["Aurora", "Candle", "Fire", "Rainbow", "Off"]


@pytest.fixture(autouse=True)
def no_frontend():
    with patch("custom_components.lemur_light_effects.add_extra_js_url"), \
         patch("custom_components.lemur_light_effects.panel_custom.async_register_panel"), \
         patch("custom_components.lemur_light_effects.async_remove_panel"):
        yield


def add_light(hass, eid, area=None, attrs=None):
    reg = er.async_get(hass)
    e = reg.async_get_or_create("light", "test", eid, suggested_object_id=eid.split(".")[1])
    if area:
        reg.async_update_entity(e.entity_id, area_id=area)
    hass.states.async_set(e.entity_id, "on", attrs if attrs is not None else {"effect_list": FX, "supported_color_modes": ["hs", "color_temp"], "effect": None})
    return e.entity_id


async def _setup(hass):
    assert await async_setup_component(hass, "http", {})
    assert await async_setup_component(hass, "websocket_api", {})
    hass.config.components.update({"frontend", "panel_custom"})
    entry = MockConfigEntry(domain=DOMAIN, title="Lemur")
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    return entry


async def test_disabled_select_does_not_break_platform(hass):
    """Disabling one room select must not stop the others from being created and updated."""
    area = ar.async_get(hass).async_create("Salon")
    area2 = ar.async_get(hass).async_create("Mutfak")
    add_light(hass, "light.a", area.id)
    add_light(hass, "light.b", area2.id)
    entry = await _setup(hass)
    er.async_get(hass).async_update_entity("select.lemur_home_effect", disabled_by=er.RegistryEntryDisabler.USER)
    await hass.async_block_till_done()
    assert await hass.config_entries.async_reload(entry.entry_id)
    await hass.async_block_till_done()
    assert hass.states.get(f"select.lemur_{area.id}_effect") is not None
    assert hass.states.get("select.lemur_home_effect") is None


async def test_change_survives_immediate_reload(hass, hass_ws_client):
    entry = await _setup(hass)
    ws = await hass_ws_client(hass)
    await ws.send_json({"id": 1, "type": "lemur_light_effects/set", "key": "favorites", "value": ["x"]})
    await ws.receive_json()
    assert await hass.config_entries.async_reload(entry.entry_id)
    await hass.async_block_till_done()
    assert hass.data[DOMAIN].data["favorites"] == ["x"]


async def test_area_rename_updates_select_name(hass):
    areg = ar.async_get(hass)
    area = areg.async_create("Salon")
    add_light(hass, "light.a", area.id)
    await _setup(hass)
    areg.async_update(area.id, name="Oturma")
    await hass.async_block_till_done()
    async_fire_time_changed(hass, dt_util.utcnow() + timedelta(seconds=3))
    await hass.async_block_till_done()
    assert "Oturma" in hass.states.get(f"select.lemur_{area.id}_effect").name


async def test_preview_keep_remembers_only_playing_lights(hass, hass_ws_client):
    async_mock_service(hass, "light", "turn_on")
    async_mock_service(hass, "scene", "create")
    area = ar.async_get(hass).async_create("Salon")
    add_light(hass, "light.a", area.id)
    add_light(hass, "light.c", area.id, {"supported_color_modes": ["onoff"]})
    await _setup(hass)
    ws = await hass_ws_client(hass)
    await ws.send_json({"id": 1, "type": "lemur_light_effects/preview", "action": "play", "room": area.id, "effect": "aurora"})
    await ws.receive_json()
    await ws.send_json({"id": 2, "type": "lemur_light_effects/preview", "action": "end", "restore": False})
    await ws.receive_json()
    last = hass.data[DOMAIN].data["last"]
    assert "light.a" in last and "light.c" not in last


@pytest.mark.parametrize("bad", [{"layout": []}, {"fx_use": []}, {"fill": []}, {"custom": [{"id": 1, "name": "X"}]}, {"order": [["x"]]}, {"order": "salon"}])
async def test_bad_settings_shapes_are_cleaned(hass, hass_ws_client, caplog, bad):
    area = ar.async_get(hass).async_create("Salon")
    add_light(hass, "light.a", area.id)
    await _setup(hass)
    ws = await hass_ws_client(hass)
    await ws.send_json({"id": 1, "type": "lemur_light_effects/set", "key": "settings", "value": bad})
    assert (await ws.receive_json())["success"]
    caplog.clear()
    async_fire_time_changed(hass, dt_util.utcnow() + timedelta(seconds=5))
    await hass.async_block_till_done()
    assert not [r for r in caplog.records if r.levelno >= logging.ERROR]
