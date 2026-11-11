"""v1.8.2: the loader as a dashboard resource, for pages opened while Home Assistant is still starting."""
from unittest.mock import patch

import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry
from homeassistant.setup import async_setup_component

from custom_components.lemur_light_effects.const import DOMAIN, VERSION
from custom_components.lemur_light_effects.resources import _local_served as REAL_LOCAL_SERVED

URL = f"/local/lemur_light_effects/lemur-light-effect-loader.js?v={VERSION}"
OTHERS = [
    {"id": "a", "type": "module", "url": "/hacsfiles/some-card/some-card.js"},
    {"id": "b", "type": "module", "url": "/local/lemur_home_dashboard/lemur-home-dashboard-loader.js?v=0.34.0"},
    {"id": "c", "type": "css", "url": "/local/lemur_light_effects.css"},      # looks alike, is not ours
]


@pytest.fixture(autouse=True)
def local_route(www):
    """/local is served when www was there before the test set things up (as Home Assistant does at start)."""
    state = {}
    with patch("custom_components.lemur_light_effects.resources._local_served", side_effect=lambda hass: state.setdefault("v", www.is_dir())):
        yield state


@pytest.fixture(autouse=True)
def no_frontend():
    with patch("custom_components.lemur_light_effects.add_extra_js_url"), \
         patch("custom_components.lemur_light_effects.panel_custom.async_register_panel"), \
         patch("custom_components.lemur_light_effects.async_remove_panel"):
        yield


class FakeResources:
    """The stored list, as Home Assistant keeps it (storage mode)."""

    def __init__(self, items=(), loaded=True):
        self.items = [dict(i) for i in items]
        self.loaded = loaded
        self.writes = []
        self.n = 0

    async def async_load(self):
        self.writes.append("load")

    def async_items(self):
        return [dict(i) for i in self.items]

    async def async_create_item(self, data):
        self.n += 1
        self.items.append({"id": f"new{self.n}", "type": data["res_type"], "url": data["url"]})
        self.writes.append("create")

    async def async_update_item(self, item_id, data):
        for i in self.items:
            if i["id"] == item_id:
                i.update({"type": data["res_type"], "url": data["url"]})
        self.writes.append("update")

    async def async_delete_item(self, item_id):
        self.items = [i for i in self.items if i["id"] != item_id]
        self.writes.append("delete")

    def urls(self):
        return [i["url"] for i in self.items]


class Lovelace:
    def __init__(self, resources):
        self.resources = resources


async def _setup(hass, resources=None):
    assert await async_setup_component(hass, "http", {})
    assert await async_setup_component(hass, "websocket_api", {})
    hass.config.components.update({"frontend", "panel_custom"})
    if resources is not None:
        hass.data["lovelace"] = Lovelace(resources)
    entry = MockConfigEntry(domain=DOMAIN, title="Lemur")
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    return entry


async def test_row_is_added_once_and_the_copy_is_in_www(hass, www):
    www.mkdir()
    res = FakeResources(OTHERS, loaded=False)
    entry = await _setup(hass, res)
    assert res.urls() == [o["url"] for o in OTHERS] + [URL]
    assert res.writes == ["load", "create"]
    copy = www / "lemur_light_effects" / "lemur-light-effect-loader.js"
    assert copy.read_text(encoding="utf-8").startswith("/*! Lemur Light Effect Card loader v" + VERSION)
    # a reload of the integration changes nothing and writes nothing
    stamp = copy.stat().st_mtime_ns
    assert await hass.config_entries.async_reload(entry.entry_id)
    await hass.async_block_till_done()
    assert res.writes == ["load", "create"] and res.urls().count(URL) == 1
    assert copy.stat().st_mtime_ns == stamp


async def test_a_new_version_updates_our_row_and_leaves_the_others(hass, www):
    www.mkdir()
    (www / "lemur_light_effects").mkdir()
    (www / "lemur_light_effects" / "lemur-light-effect-loader.js").write_text("old", encoding="utf-8")
    res = FakeResources(OTHERS[:1] + [{"id": "x", "type": "module", "url": "/local/lemur_light_effects/lemur-light-effect-loader.js?v=1.0.0"}]
                        + OTHERS[1:] + [{"id": "y", "type": "module", "url": "/lemur_light_effects/lemur-light-effect-card.js?v=1.7.0"}])
    await _setup(hass, res)
    assert res.urls() == [OTHERS[0]["url"], URL, OTHERS[1]["url"], OTHERS[2]["url"]]     # same place, one row, the rest as it was
    assert [i for i in res.items if i["id"] in "abc"] == OTHERS
    assert (www / "lemur_light_effects" / "lemur-light-effect-loader.js").read_text(encoding="utf-8") != "old"


async def test_yaml_dashboards_are_left_alone(hass, www):
    www.mkdir()

    class Yaml:
        loaded = True
        data = [{"type": "module", "url": "/local/x.js"}]

        def async_items(self):
            return self.data

    y = Yaml()
    await _setup(hass, y)
    assert y.data == [{"type": "module", "url": "/local/x.js"}]


async def test_no_row_while_www_is_new(hass, www, local_route):
    """Home Assistant serves /local only when www was there at start; a row now would be a 404 on every page."""
    res = FakeResources(OTHERS)
    entry = await _setup(hass, res)
    assert (www / "lemur_light_effects" / "lemur-light-effect-loader.js").is_file()
    assert res.writes == [] and URL not in res.urls()
    assert await hass.config_entries.async_reload(entry.entry_id)      # www is there now, but this run still does not serve it
    await hass.async_block_till_done()
    assert res.writes == []
    local_route["v"] = True                                            # the next start
    assert await hass.config_entries.async_reload(entry.entry_id)
    await hass.async_block_till_done()
    assert res.urls()[-1] == URL


async def test_removing_the_integration_takes_row_and_copy_away(hass, www):
    www.mkdir()
    (www / "keep.txt").write_text("x", encoding="utf-8")
    res = FakeResources(OTHERS)
    entry = await _setup(hass, res)
    assert URL in res.urls()
    assert await hass.config_entries.async_unload(entry.entry_id)      # unloading alone keeps everything
    assert URL in res.urls() and (www / "lemur_light_effects").is_dir()
    assert await hass.config_entries.async_remove(entry.entry_id)
    await hass.async_block_till_done()
    assert res.items == OTHERS
    assert not (www / "lemur_light_effects").exists() and (www / "keep.txt").is_file()


async def test_someone_elses_file_in_our_folder_stays(hass, www):
    www.mkdir()
    res = FakeResources()
    entry = await _setup(hass, res)
    (www / "lemur_light_effects" / "mine.png").write_bytes(b"x")
    assert await hass.config_entries.async_remove(entry.entry_id)
    await hass.async_block_till_done()
    assert (www / "lemur_light_effects" / "mine.png").is_file()
    assert not (www / "lemur_light_effects" / "lemur-light-effect-loader.js").exists()


async def test_a_surprise_in_the_list_does_not_stop_the_set_up(hass, www):
    www.mkdir()

    class Broken(FakeResources):
        async def async_create_item(self, data):
            raise RuntimeError("no")

    await _setup(hass, Broken())
    assert DOMAIN in hass.data
    hass.data["lovelace"] = object()                                   # another shape altogether
    entry = hass.config_entries.async_entries(DOMAIN)[0]
    assert await hass.config_entries.async_reload(entry.entry_id)


async def test_with_the_real_dashboard_component(hass, www):
    www.mkdir()
    assert await async_setup_component(hass, "lovelace", {})
    entry = await _setup(hass)
    res = hass.data["lovelace"].resources
    rows = [i for i in res.async_items() if i["url"] == URL]
    assert len(rows) == 1 and rows[0]["type"] == "module"
    assert await hass.config_entries.async_remove(entry.entry_id)
    await hass.async_block_till_done()
    assert [i for i in res.async_items() if "lemur_light_effects" in i["url"]] == []


async def test_www_made_by_someone_else_in_this_run_is_not_served_yet(hass, www, local_route):
    """The other Lemur integration created www a moment ago: the folder is there, /local is not served yet."""
    local_route["v"] = False
    www.mkdir()
    res = FakeResources(OTHERS)
    await _setup(hass, res)
    assert res.writes == [] and URL not in res.urls()
    assert (www / "lemur_light_effects" / "lemur-light-effect-loader.js").is_file()



@pytest.mark.parametrize("had_www", [True, False])
async def test_served_is_read_from_home_assistant_routes(hass, had_www):
    """The real check (not the stand-in): /local is there only when www existed when the frontend started."""
    import os
    folder = hass.config.path("www")
    if had_www:
        os.makedirs(folder, exist_ok=True)
    elif os.path.isdir(folder):
        os.rmdir(folder)
    assert await async_setup_component(hass, "http", {})
    assert await async_setup_component(hass, "frontend", {})
    await hass.async_block_till_done()
    os.makedirs(folder, exist_ok=True)                                 # created later in the run: changes nothing
    assert REAL_LOCAL_SERVED(hass) is had_www
