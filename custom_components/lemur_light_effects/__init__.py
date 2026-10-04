"""Lemur Light Effect Card.

Serves the dashboard card, registers it automatically and keeps the shared
household data (per-room tabs, favorites, light selection, hidden effects, last
played effect per light and custom effect icons) in Home Assistant storage.
"""
from __future__ import annotations

import base64
import json
import hashlib
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
from homeassistant.helpers.dispatcher import async_dispatcher_connect, async_dispatcher_send
from homeassistant.helpers.storage import Store

from . import engine
from .runtime import Runtime
from .voice import async_setup_voice
from .const import (
    CARD_FILE,
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


class LemurData:
    """Shared, persisted card data."""

    def __init__(self, hass: HomeAssistant) -> None:
        self.hass = hass
        self.store: Store = Store(hass, STORAGE_VERSION, STORAGE_KEY)
        self.data: dict[str, Any] = {k: (v.copy() if hasattr(v, "copy") else v) for k, v in DEFAULT_DATA.items()}
        self.icon_dir = hass.config.path(ICON_DIR)

    async def async_load(self) -> None:
        stored = await self.store.async_load()
        if stored is None:
            stored = await self._import_old()
        if isinstance(stored, dict):
            for key, default in DEFAULT_DATA.items():
                val = stored.get(key)
                if isinstance(val, type(default)):
                    self.data[key] = val

    async def _import_old(self) -> dict[str, Any] | None:
        """First start: take over the data of the earlier "Ultimate Light Effect Card" if it is there."""
        old = await Store(self.hass, STORAGE_VERSION, OLD_STORAGE_KEY).async_load()
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

    @callback
    def changed(self) -> None:
        self.store.async_delay_save(lambda: self.data, 1.0)
        async_dispatcher_send(self.hass, SIGNAL_UPDATE, self.data)


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
    await data.async_load()
    await hass.async_add_executor_job(lambda: os.makedirs(data.icon_dir, exist_ok=True))
    hass.data[DOMAIN] = data
    data.runtime = Runtime(hass, data)
    data.runtime.start()

    if not hass.data.get(f"{DOMAIN}_static"):
        await _register_static(hass, data.icon_dir)
        add_extra_js_url(hass, f"{URL_BASE}/{CARD_FILE}?v={VERSION}")
        for handler in (ws_get, ws_set, ws_last, ws_icon_upload, ws_icon_delete, ws_subscribe, ws_info, ws_preview, ws_latest):
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
            module_url=f"{URL_BASE}/{CARD_FILE}?v={VERSION}",
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
        data.runtime.stop()
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
    if key == "settings":
        if not connection.user.is_admin:
            connection.send_error(msg["id"], "unauthorized", "Only administrators can change settings")
            return
        if not isinstance(value, dict) or len(json.dumps(value)) > MAX_SETTINGS_BYTES:
            connection.send_error(msg["id"], "invalid", "settings must be a small object")
            return
        data.data[key] = value
    elif key == "tabs":
        # per-room tab layout of the card; anyone may star or hide an effect from the card
        if not isinstance(value, dict) or len(json.dumps(value)) > MAX_TABS_BYTES:
            connection.send_error(msg["id"], "invalid", "tabs must be a small object")
            return
        data.data[key] = {str(k): v for k, v in value.items() if isinstance(v, dict)}
    elif key in ("favorites", "hidden"):
        if not isinstance(value, list):
            connection.send_error(msg["id"], "invalid", "list expected")
            return
        data.data[key] = [str(v) for v in value][:2000]
    else:
        if not isinstance(value, dict):
            connection.send_error(msg["id"], "invalid", "dict expected")
            return
        data.data[key] = {str(k): [str(e) for e in v] for k, v in value.items() if isinstance(v, list)}
    data.changed()
    connection.send_result(msg["id"], data.data)


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
    data.runtime.remember(msg.get("room"), msg["entities"], msg.get("effect"))
    connection.send_result(msg["id"], {"ok": True})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "lemur_light_effects/icon_upload",
        vol.Required("key"): str,
        vol.Required("mime"): str,
        vol.Required("data"): str,
    }
)
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
    key = msg["key"][:200]
    name = hashlib.sha1(key.encode()).hexdigest()[:16] + "." + ext
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
    data.changed()
    connection.send_result(msg["id"], {"url": url})


@websocket_api.websocket_command(
    {vol.Required("type"): "lemur_light_effects/icon_delete", vol.Required("key"): str}
)
@websocket_api.async_response
async def ws_icon_delete(hass, connection, msg):
    data = _data(hass)
    if data is None:
        connection.send_error(msg["id"], "not_loaded", "Integration not loaded")
        return
    url = data.data["icons"].pop(msg["key"], None)
    if url:
        path = os.path.join(data.icon_dir, os.path.basename(url.split("?")[0]))

        def _rm():
            if os.path.exists(path):
                os.remove(path)

        await hass.async_add_executor_job(_rm)
        data.changed()
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


@websocket_api.websocket_command({vol.Required("type"): "lemur_light_effects/latest"})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_latest(hass, connection, msg):
    """Newest release on GitHub, for installs without HACS (the panel's "check for updates")."""
    from homeassistant.helpers.aiohttp_client import async_get_clientsession
    import aiohttp

    try:
        async with async_get_clientsession(hass).get(
            REPO_API, headers={"Accept": "application/vnd.github+json"}, timeout=aiohttp.ClientTimeout(total=10)
        ) as resp:
            if resp.status != 200:
                connection.send_error(msg["id"], "github", f"GitHub answered {resp.status}")
                return
            d = await resp.json()
    except Exception as err:  # noqa: BLE001 - network errors of any kind end up in the panel as text
        connection.send_error(msg["id"], "github", str(err) or type(err).__name__)
        return
    connection.send_result(msg["id"], {"version": str(d.get("tag_name") or "").lstrip("v"), "url": d.get("html_url"), "installed": VERSION})


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
