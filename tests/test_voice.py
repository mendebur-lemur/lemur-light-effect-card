"""Voice commands: room and effect are found in the spoken words (Turkish and English)."""
from custom_components.lemur_light_effects.voice import Voice, fold, load_names

ROOMS = [
    {"id": "_all", "name": "Tüm Ev", "lights": ["light.a", "light.b"]},
    {"id": "salon", "name": "Salon", "lights": ["light.a"]},
    {"id": "yatak_odasi", "name": "Yatak Odası", "lights": ["light.b"]},
    {"id": "living", "name": "Living Room", "lights": []},
]


def unit(key, label, names, custom=None):
    return {"key": key, "label": label, "names": names, "custom": custom}


class FakeStates:
    def get(self, eid):
        return None


class FakeHass:
    states = FakeStates()


def voice():
    return Voice(FakeHass(), None, load_names())


def test_fold():
    assert fold("Kuzey IŞIKLARI") == "kuzey isiklari"
    assert fold("İç Mekân") == "ic mekan"
    assert fold("Music: Spin") == "spin"


def test_room_alone():
    v = voice()
    assert v.room_of("salonda", ROOMS)["id"] == "salon"
    assert v.room_of("Yatak odasındaki", ROOMS)["id"] == "yatak_odasi"
    assert v.room_of("the living room", ROOMS)["id"] == "living"
    assert v.room_of("tüm ev", ROOMS)["id"] == "_all"
    assert v.room_of("garaj", ROOMS) is None
    assert v.room_of("salonlar", ROOMS) is None


def test_split():
    v = voice()
    r, q = v.split("salonda kuzey ışıkları", ROOMS)
    assert r["id"] == "salon" and q == "kuzey ışıkları"
    r, q = v.split("Yatak odasında Mum Işığı", ROOMS)
    assert r["id"] == "yatak_odasi" and q == "Mum Işığı"
    r, q = v.split("aurora in the living room", ROOMS)
    assert r["id"] == "living" and q == "aurora"
    r, q = v.split("kuzey ışıkları", ROOMS)
    assert r is None and q == "kuzey ışıkları"


def test_find():
    v = voice()
    us = {
        "aurora": unit("aurora", "Aurora", {"light.a": "Aurora"}),
        "candle": unit("candle", "Candle", {"light.a": "candle"}),
        "u:1": unit("u:1", "Akşam Keyfi", {"light.a": {"mode": "color"}}, {"id": 1, "name": "Akşam Keyfi"}),
    }
    assert v.find(us, "aurora")["key"] == "aurora"
    assert v.find(us, "Kutup ışığı")["key"] == "aurora"      # card's general Turkish name
    assert v.find(us, "kuzey ışıkları")["key"] == "aurora"   # scene catalogue Turkish name
    assert v.find(us, "mum")["key"] == "candle"
    assert v.find(us, "akşam keyfi")["key"] == "u:1"
    assert v.find(us, "kuzey ışığı")["key"] == "aurora"      # close enough
    assert v.find(us, "yok böyle bir şey") is None
    assert v.spoken(us["candle"], "tr") == "Mum"
    assert v.spoken(us["candle"], "en") == "Candle"
