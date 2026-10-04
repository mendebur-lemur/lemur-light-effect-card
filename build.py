#!/usr/bin/env python3
"""Bundle src/ into the single card file served by the integration."""
import json, pathlib, re
root = pathlib.Path(__file__).parent
src = root / "src"
version = json.loads((root / "custom_components/lemur_light_effects/manifest.json").read_text())["version"]
def mincss(name):
    c = re.sub(r"/\*.*?\*/", "", (src / name).read_text(), flags=re.S)
    return "\n".join(l.strip() for l in c.splitlines() if l.strip())
css = mincss("card.css")
pcss = mincss("panel.css")
parts = [(src / f).read_text() for f in ("icons.js", "icons2.js", "govee.js", "changes.js", "card.js", "editor.js", "presets.js", "panel.js", "i18n_more.js")]
body = "\n".join(parts).replace("const CARD_VERSION = '0.1.0';", f"const CARD_VERSION = '{version}';")
heal = (src / "heal.js").read_text().replace("__VERSION__", version)
out = f"""/*! Lemur Light Effect Card v{version} | GPL-3.0 */
(() => {{
{heal}
if (customElements.get('lemur-light-effect-card')) return;
const CSS = {json.dumps(css, ensure_ascii=False)};
const PANEL_CSS = {json.dumps(pcss, ensure_ascii=False)};
{body}
customElements.define('lemur-light-effect-card', LemurLightEffectCard);
customElements.define('lemur-light-effect-card-editor', LemurLightEffectCardEditor);
customElements.define('lemur-light-effects-panel', LemurLightEffectsPanel);
customElements.define('lemur-fullscreen-button', LemurFullscreenButton);
customElements.define('lemur-phone-button', LemurPhoneButton);
customElements.define('lemur-window-button', LemurWindowButton);
customElements.define('lemur-phone-fullscreen-button', LemurPhoneFullButton);
window.__LEMUR_CARD_VER = CARD_VERSION;
window.customCards = window.customCards || [];
// names are read when the card picker opens, so they follow the user's Home Assistant language (not the browser's)
{{ const doc = 'https://github.com/mendebur-lemur/lemur-light-effect-card';
  const T = () => PRE_TXT[preLang(document.querySelector('home-assistant') && document.querySelector('home-assistant').hass)];
  [['lemur-light-effect-card', 'card'], ['lemur-phone-button', 'mobile'], ['lemur-phone-fullscreen-button', 'mfull'], ['lemur-fullscreen-button', 'full'], ['lemur-window-button', 'popup']].forEach(([type, k]) => {{
    if (window.customCards.some(c => c.type === type)) return;
    window.customCards.push({{ type, preview: false, documentationURL: doc,
      get name() {{ return T()[k][0]; }},
      get description() {{ return T()[k][1]; }} }});
  }}); }}
console.info('%c LEMUR LIGHT EFFECT CARD %c v' + CARD_VERSION + ' ', 'background:#F0A93B;color:#1A1105;font-weight:700', 'background:#1E2024;color:#ECEDEF');
}})();
"""
dst = root / "custom_components/lemur_light_effects/frontend/lemur-light-effect-card.js"
dst.write_text(out)
# ---- colour icons ----
# The master copy of every Lemur colour icon lives in ../lemur-icons (Hakan's computer, not in git).
# When that folder is there, its files replace the copies kept in src/; without it the src/ copies are used.
ICONS = root.parent / "lemur-icons"
I3_HEAD = "// Effect icons drawn with Claude Design (dev/icongen/design). Key = effect key with spaces as _.\nconst ICON3 = "
i3_src = src / "icons3.js"
i3_txt = i3_src.read_text(encoding="utf-8")
i3 = json.loads(i3_txt[i3_txt.index("{"): i3_txt.rindex("}") + 1])
if (ICONS / "efektler.json").exists():
    master = json.loads((ICONS / "efektler.json").read_text(encoding="utf-8"))
    gone = sorted(set(i3) - set(master))
    if gone:
        raise SystemExit("lemur-icons/efektler.json bazı simgeleri silmiş (adlar değişmemeli): " + ", ".join(gone[:10]))
    if master != i3:
        i3 = master
        i3_src.write_text(I3_HEAD + json.dumps(dict(sorted(i3.items())), ensure_ascii=False, separators=(",", ":")) + ";\n", encoding="utf-8")
        print("icons3.js lemur-icons'tan güncellendi:", len(i3))
mdi_src = src / "icons_mdi.json"
mdi = json.loads(mdi_src.read_text(encoding="utf-8")) if mdi_src.exists() else {}
if (ICONS / "mdi.json").exists():
    master = json.loads((ICONS / "mdi.json").read_text(encoding="utf-8"))
    gone = sorted(set(mdi) - set(master))
    if gone:
        raise SystemExit("lemur-icons/mdi.json bazı simgeleri silmiş (adlar değişmemeli): " + ", ".join(gone[:10]))
    if master != mdi:
        mdi = master
        mdi_src.write_text(json.dumps(dict(sorted(mdi.items())), ensure_ascii=False, indent=0), encoding="utf-8")
        print("icons_mdi.json lemur-icons'tan güncellendi:", len(mdi))
# both sets load on their own, after the card is already on screen
(dst.parent / "lemur-icons.json").write_text(json.dumps(i3, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
(dst.parent / "lemur-mdi.json").write_text(json.dumps(mdi, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")

# ---- effect names for voice commands (voice.py): normalised light name -> Turkish card name ----
def norm(n):
    s = re.sub(r"^music\s*:\s*", "music ", str(n).lower())
    return re.sub(r"[^a-z0-9\u00c0-\u024f]+", " ", s).strip()
gov = (src / "govee.js").read_text(encoding="utf-8")
gov = json.loads(gov[gov.index("{"): gov.rindex("}") + 1])
card = (src / "card.js").read_text(encoding="utf-8")
trn_js = card[card.index("const TRN = {") + len("const TRN = "):]
trn_js = trn_js[: trn_js.index("};") + 1]
trn = json.loads(re.sub(r"'", '"', trn_js).replace(",\n}", "\n}").replace(", }", "}"))
# "trn": general names; "gov": names the card uses for lights whose list is the big scene catalogue (same rule as GOVL in card.js)
names = {"trn": dict(sorted(trn.items())), "gov": dict(sorted((norm(en), row[0]) for en, row in gov.items() if row and row[0]))}
(root / "custom_components/lemur_light_effects/fx_names.json").write_text(json.dumps(names, ensure_ascii=False, indent=0), encoding="utf-8")
print(dst, len(out.encode()))
