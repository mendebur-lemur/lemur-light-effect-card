"""The loader as a dashboard resource (Settings → Dashboards → Resources), v1.8.2.

Why: Home Assistant adds an integration's file to a page only once the integration is set up. For some seconds
after a restart the interface already answers but we are not set up yet; a page opened in that gap has none of our
code, so the cards stay as "Custom element doesn't exist" until the page is reloaded and nothing in the page can
repair that. The list of dashboard resources is there from the start. Our own address (/lemur_light_effects/...)
is not: it is also registered by this integration, so a resource pointing at it gets a 404 in the gap. What is
served from the start is the www folder (/local/...). So a copy of the small loader is kept in
config/www/lemur_light_effects/ and one resource row points at it; the loader then keeps asking for the card file
until the integration is ready.

Rules shared with Lemur Home Dashboard (lemur-ortak/ORTAK.md), which writes to the same list:
- only our own rows are touched: those whose address starts with /local/lemur_light_effects/ or /lemur_light_effects/
- one row; a new version updates it instead of adding one; nothing is written when nothing changed
- dashboards kept in YAML are left alone
- Home Assistant serves /local only when the www folder was there at start: if we had to create it, the row is
  added at the next start (otherwise every page would get a 404)
- removed only when the integration is removed (not on reload), together with the copy and our own folder
- nothing here may stop the set-up: on any surprise it logs one line and goes on
"""
from __future__ import annotations

import logging
import os
from typing import Any

from homeassistant.core import HomeAssistant

from .const import DOMAIN, LOADER_FILE, URL_BASE, VERSION

_LOGGER = logging.getLogger(__name__)

LOCAL_BASE = f"/local/{DOMAIN}"
RESOURCE_URL = f"{LOCAL_BASE}/{LOADER_FILE}?v={VERSION}"
OWN = (f"{LOCAL_BASE}/", f"{URL_BASE}/")


def _www(hass: HomeAssistant) -> str:
    return hass.config.path("www")


def _copy(hass: HomeAssistant) -> bool:
    """Keep the copy of the loader in www up to date. True when Home Assistant serves it (www was there at start)."""
    www = _www(hass)
    if not os.path.isdir(www):
        hass.data[f"{DOMAIN}_www_new"] = True   # for the rest of this run, also after a reload of the integration
    served = not hass.data.get(f"{DOMAIN}_www_new")
    folder = os.path.join(www, DOMAIN)
    os.makedirs(folder, exist_ok=True)
    with open(os.path.join(os.path.dirname(__file__), "frontend", LOADER_FILE), "rb") as f:
        new = f.read()
    dst = os.path.join(folder, LOADER_FILE)
    old = None
    if os.path.isfile(dst):
        with open(dst, "rb") as f:
            old = f.read()
    if old != new:
        with open(dst, "wb") as f:
            f.write(new)
    return served


def _uncopy(hass: HomeAssistant) -> None:
    folder = os.path.join(_www(hass), DOMAIN)
    dst = os.path.join(folder, LOADER_FILE)
    if os.path.isfile(dst):
        os.remove(dst)
    if os.path.isdir(folder) and not os.listdir(folder):
        os.rmdir(folder)  # our own folder only when it is empty; www itself stays


async def _collection(hass: HomeAssistant) -> Any | None:
    """The stored list of resources, or None (YAML mode, no dashboards, a Home Assistant that keeps it elsewhere)."""
    ll = hass.data.get("lovelace")
    res = getattr(ll, "resources", None)
    if res is None and isinstance(ll, dict):
        res = ll.get("resources")
    if res is None or not all(hasattr(res, n) for n in ("async_items", "async_create_item", "async_update_item", "async_delete_item")):
        return None
    if getattr(res, "loaded", True) is False and hasattr(res, "async_load"):
        await res.async_load()
        res.loaded = True
    return res


def _mine(res: Any) -> list[dict]:
    return [i for i in (res.async_items() or []) if isinstance(i, dict) and str(i.get("url", "")).startswith(OWN)]


async def async_register(hass: HomeAssistant) -> str:
    """Copy the loader to www and keep our one resource row. Returns what happened (for the log and the tests)."""
    try:
        served = await hass.async_add_executor_job(_copy, hass)
        res = await _collection(hass)
        if res is None:
            return "yaml"
        mine = _mine(res)
        if not served:
            # www is new: /local is not served until the next start, and a row would only produce a 404 on every page
            return "next_start" if not mine else "kept"
        if not mine:
            await res.async_create_item({"res_type": "module", "url": RESOURCE_URL})
            return "created"
        first, did = mine[0], "same"
        if first.get("url") != RESOURCE_URL or first.get("type") != "module":
            await res.async_update_item(first["id"], {"res_type": "module", "url": RESOURCE_URL})
            did = "updated"
        for extra in mine[1:]:
            await res.async_delete_item(extra["id"])
            did = "updated"
        return did
    except Exception:  # noqa: BLE001 - never in the way of the set-up
        _LOGGER.warning("Could not register the loader as a dashboard resource", exc_info=True)
        return "error"


async def async_remove(hass: HomeAssistant) -> None:
    """The integration is being removed: take our row and our copy away."""
    try:
        res = await _collection(hass)
        if res is not None:
            for item in _mine(res):
                await res.async_delete_item(item["id"])
        await hass.async_add_executor_job(_uncopy, hass)
    except Exception:  # noqa: BLE001
        _LOGGER.warning("Could not remove the dashboard resource", exc_info=True)
