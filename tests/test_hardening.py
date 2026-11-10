"""November 2026 review (v1.8.0): who may write what, changes by parts, shapes, preview and start-up."""
import asyncio
from unittest.mock import patch

import pytest
from datetime import timedelta
from pytest_homeassistant_custom_component.common import MockConfigEntry, async_fire_time_changed, async_mock_service
from homeassistant.util import dt as dt_util
from homeassistant.core import CoreState
from homeassistant.setup import async_setup_component
from homeassistant.helpers import area_registry as ar, entity_registry as er

from custom_components.lemur_light_effects import _clean_settings
from custom_components.lemur_light_effects.const import DOMAIN

FX = ["Aurora", "Candle", "Fire", "Rainbow", "Off"]


@pytest.fixture(autouse=True)
def no_frontend():
    with patch("custom_components.lemur_light_effects.add_extra_js_url"), \
         patch("custom_components.lemur_light_effects.panel_custom.async_register_panel"), \
         patch("custom_components.lemur_light_effects.async_remove_panel"):
        yield


def add_light(hass, eid, area=None, state="on"):
    reg = er.async_get(hass)
    e = reg.async_get_or_create("light", "test", eid, suggested_object_id=eid.split(".")[1])
    if area:
        reg.async_update_entity(e.entity_id, area_id=area)
    hass.states.async_set(e.entity_id, state, {"effect_list": FX, "supported_color_modes": ["hs", "color_temp"], "effect": None} if state != "unavailable" else {})
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


async def _call(ws, i, **msg):
    await ws.send_json({"id": i, **msg})
    while True:
        r = await ws.receive_json()
        if r.get("id") == i and r.get("type") == "result":
            return r


ROOM = {"tabs": [{"id": "fav", "fav": 1, "fx": ["aurora"]}, {"id": "t1", "name": "Akşam", "icon": "c:fire", "fx": ["fire", "candle"]}], "hid": []}


async def test_visitor_cannot_replace_or_delete_layout(hass, hass_ws_client, hass_read_only_access_token):
    """A wall tablet account stars and hides effects, but cannot wipe the layout, rename tabs or change settings."""
    area = ar.async_get(hass).async_create("Salon")
    add_light(hass, "light.a", area.id)
    await _setup(hass)
    admin = await hass_ws_client(hass)
    assert (await _call(admin, 1, type="lemur_light_effects/patch", key="tabs", set={area.id: ROOM}))["success"]
    assert (await _call(admin, 2, type="lemur_light_effects/patch", key="settings", set={"kelvin": 2700}))["success"]
    ws = await hass_ws_client(hass, hass_read_only_access_token)
    # whole keys: refused for every key
    for i, (key, value) in enumerate([("tabs", {}), ("rooms", {}), ("favorites", []), ("hidden", []), ("settings", {})], 10):
        r = await _call(ws, i, type="lemur_light_effects/set", key=key, value=value)
        assert not r["success"] and r["error"]["code"] == "unauthorized", key
    # parts: no settings, no removing a room, no renaming or dropping a tab
    assert (await _call(ws, 20, type="lemur_light_effects/patch", key="settings", set={"kelvin": 6500}))["error"]["code"] == "unauthorized"
    assert (await _call(ws, 21, type="lemur_light_effects/patch", key="tabs", remove=[area.id]))["error"]["code"] == "unauthorized"
    renamed = {"tabs": [ROOM["tabs"][0], {**ROOM["tabs"][1], "name": "X"}], "hid": []}
    assert (await _call(ws, 22, type="lemur_light_effects/patch", key="tabs", set={area.id: renamed}))["error"]["code"] == "unauthorized"
    dropped = {"tabs": [ROOM["tabs"][0]], "hid": []}
    assert (await _call(ws, 23, type="lemur_light_effects/patch", key="tabs", set={area.id: dropped}))["error"]["code"] == "unauthorized"
    assert (await _call(ws, 24, type="lemur_light_effects/patch", key="tabs", set={"no_such_room": ROOM}))["error"]["code"] == "invalid"
    d = hass.data[DOMAIN].data
    assert d["tabs"][area.id]["tabs"][1]["name"] == "Akşam" and d["settings"]["kelvin"] == 2700
    # what the card does for a visitor: star, hide, pick the room's lights, a new tab added by the first save
    starred = {"tabs": [{"id": "fav", "fav": 1, "fx": ["aurora", "fire"]}, {**ROOM["tabs"][1], "fx": ["fire"]}, {"id": "g_other", "auto": "other", "fx": []}], "hid": ["candle"]}
    assert (await _call(ws, 30, type="lemur_light_effects/patch", key="tabs", set={area.id: starred}))["success"]
    assert (await _call(ws, 31, type="lemur_light_effects/patch", key="rooms", set={area.id: ["light.a"]}))["success"]
    assert d["tabs"][area.id]["hid"] == ["candle"] and d["rooms"][area.id] == ["light.a"]
    # only an administrator gets at the other commands
    for i, msg in enumerate([{"type": "lemur_light_effects/icon_delete", "key": "x"}, {"type": "lemur_light_effects/preview", "action": "end"}, {"type": "lemur_light_effects/latest"}], 40):
        assert (await _call(ws, i, **msg))["error"]["code"] == "unauthorized"


async def test_patch_keeps_the_other_rooms_and_settings(hass, hass_ws_client):
    """Two screens that change different rooms or settings no longer overwrite each other."""
    a1 = ar.async_get(hass).async_create("Salon")
    a2 = ar.async_get(hass).async_create("Mutfak")
    await _setup(hass)
    one, two = await hass_ws_client(hass), await hass_ws_client(hass)
    assert (await _call(one, 1, type="lemur_light_effects/patch", key="tabs", set={a1.id: ROOM}))["success"]
    # the second screen never saw the first change and writes its own room
    r = await _call(two, 1, type="lemur_light_effects/patch", key="tabs", set={a2.id: {"tabs": [], "hid": ["x"]}})
    assert set(r["result"]["tabs"]) == {a1.id, a2.id}
    await _call(one, 2, type="lemur_light_effects/patch", key="settings", set={"kelvin": 2700, "layout": {"light.a": a1.id}})
    r = await _call(two, 2, type="lemur_light_effects/patch", key="settings", set={"brightness": 55}, remove=["nothing"])
    assert r["result"]["settings"] == {"kelvin": 2700, "layout": {"light.a": a1.id}, "brightness": 55}
    r = await _call(one, 3, type="lemur_light_effects/patch", key="settings", remove=["kelvin"])
    assert "kelvin" not in r["result"]["settings"]
    r = await _call(one, 4, type="lemur_light_effects/patch", key="tabs", remove=[a1.id])
    assert set(r["result"]["tabs"]) == {a2.id}
    # limits still hold
    big = {"x": "y" * 300_000}
    assert not (await _call(one, 5, type="lemur_light_effects/patch", key="settings", set=big))["success"]


def test_clean_settings_nested():
    bad = {
        "layout": {"light.a": ["salon"], "light.b": "salon", 3: "x"},
        "room_icons": {"salon": 5, "_all": "mdi:home"},
        "fx_use": {"light.a": False, "light.b": {"x": 1}},
        "fill": {"aurora": {"all": {"mode": "color", "rgb": ["x", 1, 2], "br": "50", "k": "warm"}, "lights": ["light.a"]}, "fire": "x",
                 "candle": {"lights": {"light.a": {"mode": "white", "k": 2700, "junk": {"a": 1}}, "light.b": "off"}}},
        "custom": [{"id": "x1", "name": "A", "lights": ["light.a"], "fallback": "off", "base": 5},
                   {"id": "x2", "name": "B", "lights": {"light.a": "candle", "light.b": {"mode": "color", "rgb": [300, -5, 12.7], "br": 80}}, "fallback": {"mode": "off"}}],
        "kelvin": 3000,
    }
    c = _clean_settings(bad)
    assert c["layout"] == {"light.b": "salon"} and c["room_icons"] == {"_all": "mdi:home"} and c["fx_use"] == {"light.a": False}
    assert c["fill"]["aurora"] == {"lights": {}, "all": {"mode": "color", "br": 50.0}} and "fire" not in c["fill"]
    assert c["fill"]["candle"]["lights"] == {"light.a": {"mode": "white", "k": 2700.0}}
    assert c["custom"][0]["lights"] == {} and "fallback" not in c["custom"][0] and "base" not in c["custom"][0]
    assert c["custom"][1]["lights"] == {"light.b": {"mode": "color", "rgb": [255, 0, 12], "br": 80.0}} and c["custom"][1]["fallback"] == {"mode": "off"}
    assert c["kelvin"] == 3000


async def test_broken_nested_settings_do_not_stop_playing(hass, hass_ws_client):
    """A hand-edited backup with wrong inner shapes used to raise in every consumer (play, selects, voice)."""
    area = ar.async_get(hass).async_create("Salon")
    add_light(hass, "light.a", area.id)
    await _setup(hass)
    ws = await hass_ws_client(hass)
    bad = {"custom": [{"id": "x1", "name": "A", "lights": ["light.a"]}, {"id": "x2", "name": "B", "lights": {"light.a": "candle"}}], "layout": {"light.a": [area.id]}, "fill": {"aurora": {"lights": ["x"], "all": "off"}}}
    assert (await _call(ws, 1, type="lemur_light_effects/set", key="settings", value=bad))["success"]
    calls = async_mock_service(hass, "light", "turn_on")
    await hass.services.async_call(DOMAIN, "play", {"room": area.id, "effect": "aurora"}, blocking=True)
    assert calls and calls[0].data["effect"] == "Aurora"
    r = await hass.services.async_call(DOMAIN, "list_effects", {"room": area.id}, blocking=True, return_response=True)
    assert "Aurora" in r["effects"]


async def test_stored_settings_are_cleaned_at_start(hass, hass_storage):
    hass_storage[DOMAIN] = {"version": 1, "key": DOMAIN, "data": {"settings": {"layout": {"light.a": ["x"]}, "custom": [{"id": "a", "name": "A", "lights": [1]}]}, "tabs": {}}}
    area = ar.async_get(hass).async_create("Salon")
    add_light(hass, "light.a", area.id)
    await _setup(hass)
    s = hass.data[DOMAIN].data["settings"]
    assert s["layout"] == {} and s["custom"][0]["lights"] == {}
    assert hass.states.get("select.lemur_salon_effect") is not None


async def test_preview_end_during_play_puts_lights_back(hass, hass_ws_client):
    """End (or the idle timer) arriving while an effect is being sent used to raise and leave the lights in the effect."""
    area = ar.async_get(hass).async_create("Salon")
    add_light(hass, "light.a", area.id)
    assert await async_setup_component(hass, "scene", {})
    await _setup(hass)
    rt = hass.data[DOMAIN].runtime
    room = {"id": area.id, "name": "Salon", "lights": ["light.a"]}
    gate = asyncio.Event()
    scenes = []

    async def slow_apply(*a, **k):
        await gate.wait()
        return ["light.a"]

    async def scene_call(domain, service, data=None, **k):
        scenes.append(service)

    with patch("custom_components.lemur_light_effects.runtime.engine.apply_unit", side_effect=slow_apply), \
         patch.object(type(hass.services), "async_call", side_effect=scene_call):
        play = hass.async_create_task(rt.preview_play(room, "aurora"))
        await asyncio.sleep(0)
        end = hass.async_create_task(rt.preview_end(True))
        await asyncio.sleep(0.01)
        gate.set()
        await play
        await end
    assert rt.preview_room is None
    assert scenes == ["create", "turn_on"]          # snapshot, then put back: nothing raised, nothing left over
    assert hass.data[DOMAIN].preview_save is None


async def test_preview_interrupted_by_restart_is_restored(hass, hass_storage):
    """A preview that was open when Home Assistant stopped: the lights go back at the next start."""
    hass_storage[DOMAIN] = {"version": 1, "key": DOMAIN, "data": {"settings": {}, "preview": {"room": "salon", "lights": {
        "light.a": {"on": True, "brightness": 120, "rgb_color": [255, 0, 0]}, "light.b": {"on": False}, "switch.x": {"on": True}, "light.gone": {"on": True}}}}}
    add_light(hass, "light.a")
    add_light(hass, "light.b")
    on = async_mock_service(hass, "light", "turn_on")
    off = async_mock_service(hass, "light", "turn_off")
    await _setup(hass)
    await hass.async_block_till_done()
    assert hass.state is CoreState.running
    assert [c.data for c in on] == [{"entity_id": "light.a", "brightness": 120, "rgb_color": [255, 0, 0]}]
    assert [c.data for c in off] == [{"entity_id": "light.b"}]
    assert "preview" not in hass.data[DOMAIN].data          # never part of what the cards read
    assert hass.data[DOMAIN].for_file().get("preview") is None


async def test_select_appears_when_light_arrives_after_start(hass):
    """Lights are often unreachable for a moment while Home Assistant starts; the room still gets its entity."""
    area = ar.async_get(hass).async_create("Salon")
    add_light(hass, "light.a", area.id, state="unavailable")
    await _setup(hass)
    assert hass.states.get("select.lemur_salon_effect") is None
    hass.states.async_set("light.a", "on", {"effect_list": FX, "supported_color_modes": ["hs"], "effect": None})
    await hass.async_block_till_done()
    async_fire_time_changed(hass, dt_util.utcnow() + timedelta(seconds=3))
    await hass.async_block_till_done()
    st = hass.states.get("select.lemur_salon_effect")
    assert st is not None and "Aurora" in st.attributes["options"]


async def test_latest_handles_odd_answers(hass, hass_ws_client, aioclient_mock):
    await _setup(hass)
    ws = await hass_ws_client(hass)
    url = "https://api.github.com/repos/mendebur-lemur/lemur-light-effect-card/releases/latest"
    aioclient_mock.get(url, json=["not", "a", "dict"])
    r = await _call(ws, 1, type="lemur_light_effects/latest")
    assert not r["success"] and r["error"]["code"] == "github"
    aioclient_mock.clear_requests()
    aioclient_mock.get(url, json={"tag_name": "v9.9.9", "html_url": "https://github.com/mendebur-lemur/lemur-light-effect-card/../../evil/repo"})
    r = await _call(ws, 2, type="lemur_light_effects/latest")
    assert r["result"]["version"] == "9.9.9" and r["result"]["url"] == "https://github.com/mendebur-lemur/lemur-light-effect-card/releases"
    aioclient_mock.clear_requests()
    aioclient_mock.get(url, text="x" * 1_200_000)
    r = await _call(ws, 3, type="lemur_light_effects/latest")
    assert not r["success"]


async def test_uploaded_picture_name_is_not_derived_from_the_key(hass, hass_ws_client):
    import base64, hashlib
    await _setup(hass)
    ws = await hass_ws_client(hass)
    png = base64.b64encode(b"\x89PNG\r\n\x1a\n" + b"0" * 20).decode()
    r = await _call(ws, 1, type="lemur_light_effects/icon_upload", key="aurora", mime="image/png", data=png)
    name = r["result"]["url"].split("/")[-1].split("?")[0]
    assert name != hashlib.sha1(b"aurora").hexdigest()[:16] + ".png" and len(name) == 20
    import os
    folder = hass.data[DOMAIN].icon_dir
    assert name in os.listdir(folder)
    r2 = await _call(ws, 2, type="lemur_light_effects/icon_upload", key="aurora", mime="image/png", data=png)
    assert r2["result"]["url"] != r["result"]["url"]
    name2 = r2["result"]["url"].split("/")[-1].split("?")[0]
    left = os.listdir(folder)
    assert name not in left and name2 in left     # the earlier file is removed
    os.remove(os.path.join(folder, name2))
