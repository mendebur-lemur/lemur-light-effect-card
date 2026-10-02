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
parts = [(src / f).read_text() for f in ("icons.js", "icons2.js", "icons3.js", "govee.js", "card.js", "editor.js", "presets.js", "panel.js")]
body = "\n".join(parts).replace("const CARD_VERSION = '0.1.0';", f"const CARD_VERSION = '{version}';")
out = f"""/*! Lemur Light Effect Card v{version} | MIT */
(() => {{
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
print(dst, len(out.encode()))
