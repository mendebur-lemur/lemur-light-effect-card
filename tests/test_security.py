"""Store input from any user is shaped and limited; uploaded files must really be images."""
from custom_components.lemur_light_effects import _clean_tabs, _looks_like


def test_looks_like():
    assert _looks_like(b"\x89PNG\r\n\x1a\n0000", "png")
    assert _looks_like(b"\xff\xd8\xff\xe0", "jpg")
    assert _looks_like(b"GIF89a....", "gif")
    assert _looks_like(b"RIFF\x00\x00\x00\x00WEBPVP8 ", "webp")
    assert not _looks_like(b"<html><script>", "png")
    assert not _looks_like(b"<svg onload=x>", "gif")


def test_clean_tabs():
    out = _clean_tabs({
        "tabs": [{"id": "x", "fx": "a"}, {"id": "y", "fx": ["a", 1], "name": "Film", "fav": True, "junk": {"a": 1}}, 5, {"no_id": 1}],
        "hid": "z", "light_icon": 1, "grow": True, "evil": {"x": 1},
    })
    assert out["tabs"] == [{"id": "x", "fx": []}, {"id": "y", "name": "Film", "fav": 1, "fx": ["a"]}]
    assert "hid" not in out and "light_icon" not in out and "evil" not in out
    assert out["grow"] is True


def test_clean_tabs_limits():
    out = _clean_tabs({"tabs": [{"id": "t" * 500, "fx": ["k" * 500] * 3000}] * 300})
    assert len(out["tabs"]) == 100
    assert len(out["tabs"][0]["id"]) == 80
    assert len(out["tabs"][0]["fx"]) == 2000 and len(out["tabs"][0]["fx"][0]) == 200
