import base64
from unittest.mock import patch
import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry
from homeassistant.setup import async_setup_component
from custom_components.lemur_light_effects.const import DOMAIN

@pytest.fixture(autouse=True)
def js_url():
    with patch("custom_components.lemur_light_effects.add_extra_js_url") as m, \
         patch("custom_components.lemur_light_effects.panel_custom.async_register_panel") as panel, \
         patch("custom_components.lemur_light_effects.async_remove_panel"):
        m.panel = panel
        yield m

PNG = base64.b64encode(bytes.fromhex("89504e470d0a1a0a0000000d4948445200000001000000010806000000"
                                     "1f15c4890000000d49444154789c6360000002000154a24f5d0000000049454e44ae426082")).decode()

async def _setup(hass):
    assert await async_setup_component(hass, "http", {})
    assert await async_setup_component(hass, "websocket_api", {})
    hass.config.components.update({"frontend", "panel_custom"})  # full frontend not needed in tests
    entry = MockConfigEntry(domain=DOMAIN, title="Lemur Light Effect Card")
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    return entry

async def test_ws_roundtrip(hass, hass_ws_client, js_url):
    await _setup(hass)
    assert js_url.call_args[0][1].startswith("/lemur_light_effects/lemur-light-effect-card.js?v=")
    ws = await hass_ws_client(hass)
    await ws.send_json({"id": 1, "type": "lemur_light_effects/subscribe"})
    assert (await ws.receive_json())["success"]
    await ws.send_json({"id": 2, "type": "lemur_light_effects/get"})
    r = await ws.receive_json()
    assert r["result"] == {"favorites": [], "hidden": [], "rooms": {}, "last": {}, "icons": {}, "settings": {}, "tabs": {}}
    await ws.send_json({"id": 3, "type": "lemur_light_effects/set", "key": "favorites", "value": ["aurora", "fire"]})
    msgs = [await ws.receive_json(), await ws.receive_json()]
    ev = next(m for m in msgs if m["type"] == "event")
    assert ev["event"]["favorites"] == ["aurora", "fire"]
    res = next(m for m in msgs if m["type"] == "result")
    assert res["success"]
    await ws.send_json({"id": 4, "type": "lemur_light_effects/set", "key": "rooms", "value": {"salon": ["light.a"]}})
    msgs = [await ws.receive_json(), await ws.receive_json()]
    await ws.send_json({"id": 5, "type": "lemur_light_effects/last", "entities": ["light.a"], "effect": "candle"})
    msgs = [await ws.receive_json(), await ws.receive_json()]
    assert hass.data[DOMAIN].data["last"]["light.a"]["effect"] == "candle"
    await ws.send_json({"id": 6, "type": "lemur_light_effects/last", "entities": ["light.a"], "effect": None})
    msgs = [await ws.receive_json(), await ws.receive_json()]
    assert "light.a" not in hass.data[DOMAIN].data["last"]
    tabs = {"salon": {"tabs": [{"id": "fav", "fav": 1, "fx": ["fire"]}], "hid": ["alarm"]}}
    await ws.send_json({"id": 8, "type": "lemur_light_effects/set", "key": "tabs", "value": tabs})
    msgs = [await ws.receive_json(), await ws.receive_json()]
    assert hass.data[DOMAIN].data["tabs"] == tabs
    await ws.send_json({"id": 9, "type": "lemur_light_effects/set", "key": "tabs", "value": ["x"]})
    assert not (await ws.receive_json())["success"]
    await ws.send_json({"id": 7, "type": "lemur_light_effects/set", "key": "bogus", "value": []})
    assert not (await ws.receive_json())["success"]

async def test_icons(hass, hass_ws_client, hass_client):
    await _setup(hass)
    ws = await hass_ws_client(hass)
    await ws.send_json({"id": 1, "type": "lemur_light_effects/icon_upload", "key": "candle", "mime": "image/svg+xml", "data": PNG})
    assert (await ws.receive_json())["error"]["code"] == "invalid_type"
    await ws.send_json({"id": 2, "type": "lemur_light_effects/icon_upload", "key": "candle", "mime": "image/png", "data": PNG})
    r = await ws.receive_json()
    url = r["result"]["url"]
    assert url.startswith("/lemur_light_effects_icons/")
    client = await hass_client()
    resp = await client.get(url)
    assert resp.status == 200
    resp = await client.get("/lemur_light_effects/lemur-light-effect-card.js")
    assert resp.status == 200
    assert "lemur-light-effect-card" in await resp.text()
    await ws.send_json({"id": 3, "type": "lemur_light_effects/icon_delete", "key": "candle"})
    assert (await ws.receive_json())["success"]
    assert "candle" not in hass.data[DOMAIN].data["icons"]

async def test_config_flow_single(hass):
    assert await async_setup_component(hass, "http", {})
    assert await async_setup_component(hass, "websocket_api", {})
    hass.config.components.update({"frontend", "panel_custom"})
    r = await hass.config_entries.flow.async_init(DOMAIN, context={"source": "user"})
    assert r["type"] == "form"
    r = await hass.config_entries.flow.async_configure(r["flow_id"], {})
    assert r["type"] == "create_entry"
    await hass.async_block_till_done()
    r = await hass.config_entries.flow.async_init(DOMAIN, context={"source": "user"})
    assert r["type"] == "abort"


async def test_settings_and_panel(hass, hass_ws_client, js_url):
    await _setup(hass)
    kw = js_url.panel.call_args.kwargs
    assert kw["frontend_url_path"] == "lemur-light" and kw["require_admin"] is True
    assert kw["module_url"].startswith("/lemur_light_effects/lemur-light-effect-card.js?v=")
    ws = await hass_ws_client(hass)
    await ws.send_json({"id": 1, "type": "lemur_light_effects/set", "key": "settings",
                        "value": {"kelvin": 2700, "order": ["salon"], "exclude": ["light.x"]}})
    r = await ws.receive_json()
    assert r["success"] and r["result"]["settings"]["kelvin"] == 2700
    await ws.send_json({"id": 2, "type": "lemur_light_effects/set", "key": "settings", "value": {"x": "y" * 300000}})
    assert not (await ws.receive_json())["success"]
