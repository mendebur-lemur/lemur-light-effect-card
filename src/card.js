// ---- Lemur Light Effect Card: card ----
const CARD_VERSION = '0.1.0';
// colour effect icons (ICON3) come from lemur-icons.json next to this file, so the card shows up before they arrive
let ICON3 = {}, ICON3_OK = false;
// the last few errors from this card, for Settings → Help → Report a problem (they stay in the browser unless the user sends the report)
const LERR = window.__LEMUR_ERR || (window.__LEMUR_ERR = []);
if (!window.__LEMUR_ERRH) {
  window.__LEMUR_ERRH = 1;
  const addErr = (m, where) => { if (!/lemur/i.test(String(where || '') + String(m || ''))) return; LERR.push(new Date().toTimeString().slice(0, 8) + ' ' + String(m || '?').split('\n')[0].slice(0, 160)); if (LERR.length > 5) LERR.shift(); };
  window.addEventListener('error', e => addErr(e.message + (e.lineno ? ' @' + e.lineno : ''), e.filename));
  window.addEventListener('unhandledrejection', e => { const r = e.reason; addErr((r && r.message) || r, r && r.stack); });
}
const ICON_URL = (() => { try { const el = document.currentScript || [...document.querySelectorAll('script[src*="lemur-light-effect-card"]')].pop(), s = el && el.src; if (s) return s.replace(/[^/?#]*([?#].*)?$/, '') + 'lemur-icons.json?v=' + CARD_VERSION; } catch (e) {} return '/lemur_light_effects/lemur-icons.json?v=' + CARD_VERSION; })();
const ICON3_READY = (window.__LEMUR_ICON3 ? Promise.resolve(window.__LEMUR_ICON3) : fetch(ICON_URL).then(r => r.ok ? r.json() : {})).catch(() => ({})).then(d => {
  ICON3 = d && typeof d === 'object' ? d : {}; ICON3_OK = true;
  try { STORE.v++; STORE._emit(); } catch (e) {}
  window.dispatchEvent(new Event('lemur-icons'));
});
const ICON_PH = '<svg viewBox="0 0 48 48" class="dz ph"><circle cx="24" cy="24" r="22" fill="rgba(255,255,255,.05)"/></svg>';
// languages of the card; effect names have their own Turkish table, the others show the light's own names
const LANGS = ['tr', 'en', 'de', 'es', 'fr'];
const pickLang = x => { const m = String(x || '').toLowerCase().slice(0, 2); return LANGS.includes(m) ? m : 'en'; };
const OFF_RE = /^(off|none|stop|solid|no effect|static|normal|default)$/i;
const norm = s => String(s).toLowerCase().replace(/^music\s*:\s*/, 'music ').replace(/[^a-z0-9À-ɏ]+/g, ' ').trim();
const SYN = {
  'candlelight': 'candle', 'candle light': 'candle', 'candle flicker': 'candle', 'candleflicker': 'candle',
  'fireplace': 'fire', 'fire place': 'fire', 'fire flicker': 'fire',
  'colorloop': 'color loop', 'colour loop': 'color loop', 'colourloop': 'color loop',
  'romance': 'romantic', 'sun rise': 'sunrise', 'sun set': 'sunset', 'rain bow': 'rainbow',
  'nightlight': 'night light', 'breathing': 'breathe', 'strobe light': 'strobe'
};
const TRN = {
  'candle': 'Mum', 'fire': 'Ateş', 'prism': 'Prizma', 'sparkle': 'Işıltı', 'opal': 'Opal', 'glisten': 'Parıltı',
  'underwater': 'Su Altı', 'cosmos': 'Kozmos', 'sunbeam': 'Güneş Işını', 'enchant': 'Büyü', 'sunrise': 'Gün Doğumu',
  'sunset': 'Gün Batımı', 'color loop': 'Renk Döngüsü', 'rainbow': 'Gökkuşağı', 'breathe': 'Nefes', 'blink': 'Yanıp Sönme',
  'slow temp': 'Yavaş Sıcaklık', 'disco': 'Disko', 'police': 'Polis', 'police2': 'Polis 2', 'romantic': 'Romantik',
  'happy birthday': 'Doğum Günü', 'birthday': 'Doğum Günü', 'night light': 'Gece Lambası', 'night mode': 'Gece Modu',
  'date night': 'Randevu Gecesi', 'movie': 'Film', 'sleep': 'Uyku', 'reading': 'Okuma', 'read': 'Okuma',
  'strobe': 'Flaş', 'strobe color': 'Renkli Flaş', 'alarm': 'Alarm', 'aurora': 'Kutup Işığı', 'ocean': 'Okyanus',
  'forest': 'Orman', 'lava': 'Lav', 'twinkle': 'Pırıltı', 'twinkles': 'Pırıltılar', 'chase': 'Kovalamaca', 'fade': 'Geçiş',
  'pulse': 'Nabız', 'wave': 'Dalga', 'waves': 'Dalgalar', 'meteor': 'Meteor', 'fireworks': 'Havai Fişek', 'ripple': 'Dalgacık',
  'scan': 'Tarama', 'flow': 'Akış', 'gradient': 'Geçişli', 'random': 'Rastgele', 'random colors': 'Rastgele Renkler',
  'stars': 'Yıldızlar', 'lightning': 'Şimşek', 'tv': 'TV', 'party': 'Parti', 'christmas': 'Noel', 'halloween': 'Cadılar Bayramı',
  'relax': 'Rahatla', 'concentrate': 'Odaklan', 'energize': 'Enerji', 'nightlight': 'Gece Lambası', 'temp': 'Sıcaklık',
  'whatsapp': 'WhatsApp', 'home': 'Ev', 'rgb': 'RGB', 'lake': 'Göl', 'sakura': 'Sakura', 'heartbeat': 'Kalp Atışı',
  'colorful': 'Renkli', 'flash': 'Flaş', 'flicker': 'Titreme', 'dance': 'Dans', 'music': 'Müzik', 'snow': 'Kar',
  'rain': 'Yağmur', 'storm': 'Fırtına', 'sunny': 'Güneşli', 'cloudy': 'Bulutlu', 'morning': 'Sabah', 'evening': 'Akşam',
  'game': 'Oyun', 'work': 'Çalışma', 'study': 'Ders', 'dinner': 'Akşam Yemeği', 'meditation': 'Meditasyon', 'spring': 'İlkbahar',
  'summer': 'Yaz', 'autumn': 'Sonbahar', 'winter': 'Kış', 'fire flicker': 'Ateş', 'deep sea': 'Derin Deniz'
};
const I18N = {
  tr: {
    light: 'Işık', fav: 'Favoriler', allHome: 'Tüm Ev', unassigned: 'Diğer', lights: '{n} ışık', off: 'Kapalı', playing: 'Çalıyor',
    mixed: 'Karışık', none: 'Seçilmedi', color: 'Renk', random: 'Rastgele', stop: 'Durdur', turnOff: 'Kapat',
    selectFirst: 'Önce ışık seç (alttaki ışık simgeleri)', noFx: 'Bu grupta efekt yok', noCap: 'Seçili ışıklar efekt desteklemiyor',
    some: 'Bazı ışıklarda', someNote: 'sadece destekleyen ışıklara gider',
    panelSub: 'Efektler hangi ışıklara gitsin? Seçim evdeki herkes için kaydedilir.', done: 'Tamam', selectAll: 'Tümünü seç',
    common: 'ortak efekt', fx: 'efekt', isOn: 'açık', isOff: 'kapalı', white: 'Beyaz ton', stopTo: 'Durdur →',
    favEmpty: 'Henüz favori yok. Bir efekte basılı tut (masaüstünde sağ tık) ve “Favorilere ekle”yi seç.',
    addFav: 'Favorilere ekle', remFav: 'Favorilerden çıkar', setIcon: 'Simge yükle', resetIcon: 'Varsayılan simge',
    hide: 'Efekti gizle', hidden: '{x} gizlendi', turnedOff: '{r} kapatıldı', turnedOn: '{r} açıldı',
    stopped: 'Efekt durduruldu · {k}K %{b}', support: 'Destekleyen ışıklar', noLights: 'Bu odada ışık bulunamadı',
    applied: '{r} → {x}', partial: '{x} → {a}/{b} ışık', iconSaved: 'Simge kaydedildi', iconErr: 'Simge yüklenemedi',
    err: 'Hata: {e}', toColor: '{r} → renk', localMode: 'Paylaşım için entegrasyonu kur (şu an sadece bu cihaza kaydediliyor)',
    close: 'Kapat', kel: ['Akkor', 'Sıcak', 'Yumuşak', 'Nötr', 'Gün ışığı', 'Soğuk'],
    upd: 'Yeni sürüm yüklendi ({v}). Ekranı yenile.', reload: 'Yenile', recent: 'Son kullanılanlar',
    fillB: 'Eksik ışıkları tamamla', fillE: 'Tamamlamayı düzenle', filled: 'Desteklemeyen ışıklar senin seçtiğin gibi tamamlanıyor', fillLbl: 'tamamlandı',
    mRoom: 'Oda', mChange: 'Değiştir', mLit: '{a}/{b} ışık açık', mAllOff: 'ışıklar kapalı', mPick: 'Oda seç', mLights: 'Işıkları seç',
    mPlaying: 'çalıyor · {n} ışıkta', mMixed: 'Farklı efektler çalıyor', mIdle: 'Efekt çalmıyor · bir efekte dokun', mLight: 'Işık: {x}', mOff: 'Işıklar kapalı',
    mBright: 'Parlaklık', mRecent: 'Son çalınan', mAll: 'Tüm efektler', mLightTab: 'Beyaz & renk', mSearch: 'Efekt ara', mCount: '{n} efekt',
    mNoRes: 'Sonuç yok', recEmpty: 'Bu odada henüz efekt çalınmadı. Çaldığın efektler burada sıralanır.', mSelFirst: 'Önce ışık seç: üstteki oda kutusu → Işıkları seç'
  },
  en: {
    light: 'Light', fav: 'Favorites', allHome: 'Whole home', unassigned: 'Unassigned', lights: '{n} lights', off: 'Off', playing: 'Playing',
    mixed: 'Mixed', none: 'None', color: 'Color', random: 'Random', stop: 'Stop', turnOff: 'Turn off',
    selectFirst: 'Select lights first (light icons below)', noFx: 'No effects in this group', noCap: 'Selected lights have no effects',
    some: 'On some lights', someNote: 'only sent to lights that support it',
    panelSub: 'Which lights should effects go to? Saved for everyone at home.', done: 'Done', selectAll: 'Select all',
    common: 'shared effects', fx: 'effects', isOn: 'on', isOff: 'off', white: 'White', stopTo: 'Stop →',
    favEmpty: 'No favorites yet. Long-press an effect (right-click on desktop) and choose “Add to favorites”.',
    addFav: 'Add to favorites', remFav: 'Remove from favorites', setIcon: 'Upload icon', resetIcon: 'Default icon',
    hide: 'Hide effect', hidden: '{x} hidden', turnedOff: '{r} turned off', turnedOn: '{r} turned on',
    stopped: 'Effect stopped · {k}K {b}%', support: 'Supported by', noLights: 'No lights in this room',
    applied: '{r} → {x}', partial: '{x} → {a}/{b} lights', iconSaved: 'Icon saved', iconErr: 'Could not upload icon',
    err: 'Error: {e}', toColor: '{r} → color', localMode: 'Install the integration to share (saved on this device only)',
    close: 'Close', kel: ['Incandescent', 'Warm', 'Soft', 'Neutral', 'Daylight', 'Cool'],
    upd: 'A new version is installed ({v}). Reload the page.', reload: 'Reload', recent: 'Recently used',
    fillB: 'Fill in the missing lights', fillE: 'Edit how it is filled in', filled: 'Lights without it do what you chose', fillLbl: 'filled in',
    mRoom: 'Room', mChange: 'Change', mLit: '{a} of {b} lights on', mAllOff: 'lights off', mPick: 'Choose a room', mLights: 'Choose lights',
    mPlaying: 'playing · on {n} lights', mMixed: 'Different effects playing', mIdle: 'No effect playing · tap one', mLight: 'Light: {x}', mOff: 'Lights are off',
    mBright: 'Brightness', mRecent: 'Recently played', mAll: 'All effects', mLightTab: 'White & colour', mSearch: 'Search effects', mCount: '{n} effects',
    mNoRes: 'No results', recEmpty: 'Nothing played in this room yet. Effects you play show up here.', mSelFirst: 'Choose lights first: room box at the top → Choose lights'
  }
};
const GROUPS = ['mine', 'nature', 'sky', 'home', 'color', 'fun', 'other'];
const FEW_FX = 18; // below this, categories add nothing: show one list
const GNAME = {
  tr: { all: 'Efektler', mine: 'Efektlerim', nature: 'Doğa', sky: 'Gök & Uzay', home: 'Ev Hali', color: 'Renk & Sanat', fun: 'Eğlence', other: 'Diğer' },
  en: { all: 'Effects', mine: 'My effects', nature: 'Nature', sky: 'Sky & Space', home: 'Home', color: 'Color & Art', fun: 'Fun', other: 'Other' }
};
const GICON = { all: 'sparkle', mine: 'sparkle', nature: 'tree', sky: 'galaxy', home: 'lotus', color: 'palette', fun: 'party', other: 'sparkle' };
const RENK = ['#FF3B30', '#FF9500', '#FFD60A', '#A3E635', '#30D158', '#40E0D0', '#32ADE6', '#0A84FF', '#5E5CE6', '#BF5AF2', '#FF6FB5', '#FF2D95'];
const KELV = [[2700, '#FFA757'], [3000, '#FFB16E'], [3200, '#FFB87B'], [4000, '#FFCEA6'], [5000, '#FFE4CE'], [6500, '#FFFEFA']];
const hex2rgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const esc = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const svg = n => `<svg viewBox="0 0 24 24" fill="currentColor">${ICONS[n] || ICONS.generic}</svg>`;
// tab icon: a mono ICONS name, or 'c:<key>' for one of the colour effect icons (ICON3)
const tabSvg = (ic, fb) => ic && ic.slice(0, 2) === 'c:' && ICON3[ic.slice(2)] ? ICON3[ic.slice(2)] : svg(ic && ICONS[ic] ? ic : fb);
// default colour icons of tabs: Light tab, Favorites and the automatic groups
const GICON3 = { light: 'illumination', fav: 'star', all: 'gleam', mine: 'enchant', nature: 'forest', sky: 'starry_sky', home: 'home', color: 'colorful', fun: 'party', other: 'sparkle' };
// the icon a tab shows: the one the user picked, otherwise its colour default.
// Older mono defaults ('sparkle' or the group's own mono icon) count as "not picked".
const tabArt = (tb, kind) => {
  const ic = tb && tb.icon, k = kind || (tb && tb.fav ? 'fav' : tb && tb.auto) || 'other';
  if (ic && ic.slice(0, 2) === 'c:' && ICON3[ic.slice(2)]) return ICON3[ic.slice(2)];
  if (ic && ICONS[ic] && ic !== 'sparkle' && ic !== GICON[k]) return svg(ic);
  return ICON3[GICON3[k]] || (ICON3_OK ? svg(GICON[k] || 'sparkle') : ICON_PH);
};
// effect tile: saturated gradient + soft top light, white two-tone glyph
const RECENT_ART = '<svg class="dz" aria-hidden="true" viewBox="0 0 48 48" fill="none" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><defs><linearGradient id="lm-rec-g" gradientUnits="userSpaceOnUse" x1="0" y1="8" x2="0" y2="40"><stop offset="0" stop-color="#9FE4FF"/><stop offset="1" stop-color="#7C8BFF"/></linearGradient></defs><circle cx="25" cy="25" r="14.5" fill="#8FB8FF" fill-opacity="0.2" stroke="url(#lm-rec-g)" stroke-width="2.4"/><path d="M25 17 V25 L30.5 28.5" stroke="#FFD27A" stroke-width="2.4"/><path d="M8.6 19.5 A17 17 0 0 1 13.5 11.5" stroke="#9FE4FF" stroke-opacity="0.75"/><path d="M6.5 12.5 L8.6 19.5 L15.3 17" stroke="#9FE4FF" stroke-opacity="0.75"/></svg>';
const tile = h => `radial-gradient(120% 90% at 28% 18%,rgba(255,255,255,.34),rgba(255,255,255,0) 55%),${grad(h, 82, 50, '145deg')}`;
const STAR = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/></svg>';
const BULB = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3z"/></svg>';
const HOME = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/></svg>';
const PW = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 4v8"/><path d="M6.6 7.2a8 8 0 1 0 10.8 0"/></svg>';
const EQ = '<b class="eq"><i></i><i></i><i></i></b>';
// phone layout: bottom tab bar icons
const M_CLOCK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>';
const M_GRID = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="4" width="6.5" height="6.5" rx="2"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="2"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="2"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="2"/></svg>';
const M_SEARCH = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4 4"/></svg>';
const M_DOWN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9.5l6 6 6-6"/></svg>';
const M_CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
const M_SUN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/></svg>';
const grad = (p, S, L, d) => {
  p = p && p.length ? p.slice() : null;
  if (!p) return `linear-gradient(${d},hsl(220 10% ${L - 4}%),hsl(220 10% ${L - 12}%))`;
  if (p.length === 1) p = [p[0], (p[0] + 22) % 360];
  return `linear-gradient(${d},${p.map((h, i) => `hsl(${h} ${S}% ${L}%) ${Math.round(i / (p.length - 1) * 100)}%`).join(',')})`;
};
const hashHue = s => { let h = 0; for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return h % 360; };
const k2rgb = k => {
  const t = k / 100; let r, g, b;
  if (t <= 66) { r = 255; g = 99.47 * Math.log(t) - 161.12; b = t <= 19 ? 0 : 138.52 * Math.log(t - 10) - 305.04; }
  else { r = 329.7 * Math.pow(t - 60, -0.1332); g = 288.12 * Math.pow(t - 60, -0.0755); b = 255; }
  return [r, g, b].map(v => Math.max(0, Math.min(255, Math.round(v))));
};
const pretty = n => { const s = String(n).replace(/^music\s*:\s*/i, '').trim(); return s.charAt(0).toUpperCase() + s.slice(1); };
// display name of a colour icon key (ICON3), used by the tab icon picker
let ICN = null;
const icName = (k, lang) => {
  if (!ICN) { ICN = {}; for (const n in GOVEE) ICN[norm(n).replace(/ /g, '_')] = n; }
  const n = ICN[k]; if (!n) return pretty(k.replace(/_/g, ' '));
  return lang === 'tr' && GOVEE[n][0] ? GOVEE[n][0] : n;
};

const STRONG = new Set(['candle', 'fire', 'sunrise', 'sunset', 'aurora', 'rainbow', 'music', 'snow', 'rain', 'storm', 'heart']);
const INFO = new Map();
// names that came from a scene-heavy list matching the curated table (Turkish names, colors, groups)
const GOVL = new Set();
function fxInfo(name) {
  let r = INFO.get(name); if (r) return r;
  const low = String(name).toLowerCase(), g = GOVL.has(name) ? GOVEE[name] : null, music = /^music\s*:/.test(low);
  const rule = RULES.find(x => x[0].test(low));
  const ir = ICON_OF[low] ? null : IRULES.find(x => x[0].test(low));
  const icon = ICON_OF[low] || (ir ? ir[1] : rule ? rule[1] : 'generic');
  const grp = music ? 'fun' : rule && STRONG.has(rule[1]) ? rule[2] : g ? g[1] : rule ? rule[2] : 'other';
  const hues = g && g[2] && g[2].length ? g[2] : rule ? rule[3] : [hashHue(low)];
  const tr = g ? g[0] : TRN[norm(name).replace(/^music /, '')] || null;
  r = { icon, grp, hues, tr, music, mono: rule && ICONS[rule[1]] ? rule[1] : 'generic' }; INFO.set(name, r); return r;
}
const PARSED = new WeakMap();
function parseList(list) {
  let r = PARSED.get(list); if (r) return r;
  const m = new Map(); let off = null;
  for (const nm of list) {
    if (typeof nm !== 'string' || !nm.trim()) continue;
    if (OFF_RE.test(nm.trim())) { off = off || nm; continue; }
    const k = norm(nm); if (k && !m.has(k)) m.set(k, nm);
  }
  let hit = 0; for (const nm of m.values()) if (GOVEE[nm]) hit++;
  if (m.size >= 15 && hit / m.size >= 0.4) { for (const nm of m.values()) if (GOVEE[nm] && !GOVL.has(nm)) { GOVL.add(nm); INFO.delete(nm); } }
  for (const [k, nm] of [...m]) { const s = SYN[k]; if (s && !m.has(s)) { m.delete(k); m.set(s, nm); } }
  r = { m, off }; PARSED.set(list, r); return r;
}
const EMPTY_P = { m: new Map(), off: null };
// lights that technically are lights but make no sense in an effect card
const NOISE_PLATFORMS = new Set(['browser_mod', 'bambu_lab', 'octoprint', 'prusalink', 'moonraker']);
function noiseKind(H, id) {
  const e = (H.entities || {})[id], s = H.states[id], n = String((s && s.attributes.friendly_name) || id);
  const p = e && e.platform;
  if (p === 'browser_mod' || / screen$/i.test(n) && p === 'browser_mod') return 'screen';
  if (/\bsegment[ _]?\d+$/i.test(n) || /_segment_\d+$/.test(id)) return 'segment';
  if (/(\bleds$|switch state$|status led|indicator)/i.test(n)) return 'indicator';
  if (NOISE_PLATFORMS.has(p) || /(chamber|heatbed|printer|nozzle) light$/i.test(n)) return 'device';
  return null;
}
// lights that may appear at all (HA-hidden, config entities and groups never do)
function lightPool(H, groups) {
  const E = H.entities || {};
  return Object.keys(H.states).filter(id => {
    if (!id.startsWith('light.')) return false;
    const e = E[id], s = H.states[id];
    if (e && (e.hidden || e.hidden_by || e.entity_category)) return false;
    return !(Array.isArray(s.attributes.entity_id) && !groups);
  });
}
function homeArea(H, id) {
  const E = H.entities || {}, D = H.devices || {}, A = H.areas || {}, e = E[id];
  const aid = (e && (e.area_id || (e.device_id && D[e.device_id] && D[e.device_id].area_id))) || null;
  return aid && A[aid] ? aid : '_none';
}
// where a light shows up: its HA area unless the panel moved it (settings.layout) or it is hidden
function lightPlace(H, S, id) {
  const A = H.areas || {}, L = (S.layout || {})[id], nk = noiseKind(H, id);
  if (L === '_hidden') return { room: null, why: nk || 'manual' };
  if (L && (L === '_none' || A[L])) return { room: L };
  if ((S.exclude || []).includes(id)) return { room: null, why: 'manual' };
  if (nk && !(S.include || []).includes(id)) return { room: null, why: nk, auto: true };
  return { room: homeArea(H, id) };
}
// user-defined effect categories of v0.4-0.6 (settings.cats); null = automatic groups
function catsOf(S) { const c = S && Array.isArray(S.cats) ? S.cats.filter(x => x && x.id) : []; return c.length ? c : null; }

// ---- per-room tabs (STORE.d.tabs[room] = { tabs: [{ id, name?, icon?, fav?, auto?, fx: [] }], hid: [] }) ----
// A room nobody arranged yet follows the older household-wide setup (favorites, categories, hidden effects)
// and grows automatic group tabs. Effects that are in no tab and not hidden find a home by their group.
function baseTabs(S) {
  const CS = catsOf(S), of = (S && S.cat_of) || {};
  const tabs = [{ id: 'fav', fav: 1, fx: (STORE.d.favorites || []).slice() }];
  if (CS) CS.forEach(c => tabs.push({ id: c.id, name: c.name, icon: c.icon, fx: Object.keys(of).filter(k => of[k] === c.id) }));
  return { tabs, hid: (STORE.d.hidden || []).slice(), grow: !CS };
}
function roomCfg(S, rid) { const c = STORE.d.tabs && STORE.d.tabs[rid]; return c && Array.isArray(c.tabs) ? c : baseTabs(S); }
function resolveTabs(cfg, keys, grpOf) {
  // favorites are a star on top of the effect's own tab; every other tab owns its effects
  const P = new Set(keys), hid = [...new Set((cfg.hid || []).filter(k => P.has(k)))], seen = new Set(hid), take = k => P.has(k) && !seen.has(k) && (seen.add(k), true);
  const tabs = cfg.tabs.filter(t => t && t.id).map(t => Object.assign({}, t, { fx: t.fav ? [...new Set((t.fx || []).filter(k => P.has(k) && !hid.includes(k)))] : (t.fx || []).filter(take) }));
  if (!tabs.some(t => t.fav)) tabs.unshift({ id: 'fav', fav: 1, fx: [] });
  const rest = keys.filter(k => !seen.has(k));
  if (cfg.grow && keys.length <= FEW_FX && !tabs.some(t => !t.fav && t.fx.length)) {
    if (rest.length) tabs.push({ id: 'g_all', auto: 'all', fx: rest });
    return { tabs, hid };
  }
  for (const k of rest) {
    const g = grpOf(k);
    let t = tabs.find(x => x.auto === g);
    if (!t && (cfg.grow || g === 'mine')) { t = { id: 'g_' + g, auto: g, fx: [] }; tabs.push(t); }
    if (!t) t = tabs.find(x => x.auto === 'other');
    if (!t) { t = { id: 'g_other', auto: 'other', fx: [] }; tabs.push(t); }
    t.fx.push(k);
  }
  if (cfg.grow) { const gi = t => t.auto ? GROUPS.indexOf(t.auto) : -1, fixed = tabs.filter(t => !t.auto), auto = tabs.filter(t => t.auto).sort((a, b) => gi(a) - gi(b)); return { tabs: [...fixed, ...auto], hid }; }
  return { tabs, hid };
}
// a stored copy of what a room shows right now, so it can be edited
function materialize(S, rid, keys, grpOf) {
  const c = STORE.d.tabs && STORE.d.tabs[rid];
  if (c && Array.isArray(c.tabs)) return JSON.parse(JSON.stringify(c));
  const r = resolveTabs(baseTabs(S), keys, grpOf);
  return { tabs: r.tabs.map(t => { const x = { id: t.id, fx: t.fx.slice() }; ['name', 'icon', 'fav', 'auto'].forEach(f => { if (t[f] != null) x[f] = t[f]; }); return x; }), hid: r.hid.slice() };
}
function saveRoomCfg(rid, cfg) { const T = Object.assign({}, STORE.d.tabs || {}); if (cfg) T[rid] = cfg; else delete T[rid]; return STORE.set('tabs', T); }
// is a light used for effects? settings.fx_use[id]: false = light only, true = always; otherwise it needs min_effects effects
function fxOn(S, id, n) { const u = S && S.fx_use && S.fx_use[id]; return u === false ? false : u === true ? n > 0 : n >= (+(S && S.min_effects) || 3); }
function allHomeOn(S) { return S.all_home !== false && !(S.hidden_areas || []).includes('_all'); }
// group of an effect key; own effects ('u:<id>') have a group of their own
const grpOfKey = (k, rep) => String(k).startsWith('u:') ? 'mine' : fxInfo(rep || k).grp;

// ---- own effects (settings.custom): a name, an icon, an optional base effect, and what each light does ----
// action: { mode: 'fx', fx } | { mode: 'color', rgb, br } | { mode: 'white', k, br } | { mode: 'off' } | { mode: 'skip' }
function customList(S) { return Array.isArray(S && S.custom) ? S.custom.filter(c => c && c.id && c.name) : []; }
function customAction(c, H, id, capOk) {
  const ex = c.lights && c.lights[id];
  if (c.v === 2 && !ex) return null; // v2: only the lights dragged into the effect take part
  if (ex && ex.mode && ex.mode !== 'auto') return ex.mode === 'skip' ? null : ex;
  const s = H.states[id], l = s && s.attributes.effect_list;
  if (c.base && capOk && Array.isArray(l)) { const nm = parseList(l).m.get(c.base); if (nm) return { mode: 'fx', fx: nm }; }
  const fb = c.fallback; return fb && fb.mode && fb.mode !== 'skip' && fb.mode !== 'auto' ? fb : null;
}
function customUnits(S, H, ids, capFn) {
  const out = [];
  for (const c of customList(S)) {
    const names = {}; let n = 0;
    ids.forEach(id => { if (!H.states[id]) return; const a = customAction(c, H, id, capFn(id)); if (a) { names[id] = a; n++; } });
    if (n) out.push({ k: 'u:' + c.id, names, c: n, rep: c.base_name || c.name, label: c.name, custom: c });
  }
  return out;
}
// ---- filling in an effect (settings.fill[key] = { all: action, lights: { light: action } }) ----
// lights that do not have an effect do what was chosen for them instead, so a favourite effect covers the whole room
function fillAction(S, k, id) {
  const f = S && S.fill && S.fill[k]; if (!f) return null;
  const a = (f.lights && f.lights[id]) || f.all;
  return a && a.mode && a.mode !== 'skip' && a.mode !== 'auto' ? a : null;
}
// Home Assistant script steps that do what an effect tile does (used by the panel's "save as script")
function scriptSteps(u) {
  const g = new Map(), offs = [];
  const add = (d, id) => { const k = JSON.stringify(d); if (!g.has(k)) g.set(k, { d, ids: [] }); g.get(k).ids.push(id); };
  Object.entries(u.names).forEach(([id, a]) => {
    if (typeof a === 'string') return add({ effect: a }, id);
    if (a.mode === 'off') return offs.push(id);
    if (a.mode === 'fx') return add({ effect: a.fx }, id);
    const d = {};
    if (a.mode === 'color' && Array.isArray(a.rgb)) d.rgb_color = a.rgb.map(Number);
    if (a.mode === 'white') d.color_temp_kelvin = +a.k || 3000;
    if (a.br) d.brightness_pct = +a.br;
    add(d, id);
  });
  const steps = [...g.values()].map(({ d, ids }) => ({ service: 'light.turn_on', target: { entity_id: ids }, data: d }));
  if (offs.length) steps.push({ service: 'light.turn_off', target: { entity_id: offs } });
  return steps;
}
// night mode: brightness ceiling between two times (settings.night_on / night_from / night_to / night_max)
function nightMax(S) {
  if (!S || !S.night_on) return null;
  const m = v => { const x = String(v || '').match(/^(\d{1,2}):(\d{2})/); return x ? +x[1] * 60 + +x[2] : null; };
  const f = m(S.night_from || '23:00'), t = m(S.night_to || '07:00'); if (f == null || t == null) return null;
  const d = new Date(), now = d.getHours() * 60 + d.getMinutes();
  const inWin = f <= t ? now >= f && now < t : now >= f || now < t;
  return inWin ? Math.max(1, Math.min(100, +S.night_max || 30)) : null;
}
// the picture of an effect tile: uploaded image, own effect icon, colour icon or the plain one-colour style
function fxArt(u, px, S) {
  const url = STORE.d.icons && STORE.d.icons[u.k];
  if (url) return `<img class="cimg" src="${esc(url)}" alt="" style="width:${px}px;height:${px}px">`;
  const i = fxInfo(u.rep), cu = u.custom;
  if (S && S.icon_style === 'mono') return `<i class="ic mono" style="width:${px}px;height:${px}px;background:${tile(i.hues)}">${svg(cu && !cu.base ? 'sparkle' : i.mono)}</i>`;
  const key = cu ? String(cu.icon || '').replace(/^c:/, '') || String(cu.base || '').replace(/ /g, '_') : String(u.k).replace(/ /g, '_');
  const d = ICON3[key] || (cu && !cu.base ? ICON3.enchant : null) || (ICON3_OK ? null : ICON_PH);
  if (d) return `<i class="ic ico dz" style="width:${px}px;height:${px}px">${d}</i>`;
  return `<i class="ic ico" style="width:${px}px;height:${px}px">${ico2(i.icon)}</i>`;
}

// ---- shared store (integration websocket, localStorage fallback) ----
const LS_KEY = 'lemur-light-effects';
const STORE = {
  d: { favorites: [], hidden: [], rooms: {}, last: {}, icons: {}, settings: {}, tabs: {}, recent: {} }, v: 0, mode: null, conn: null, L: new Set(), stale: null,
  attach(hass) { const c = hass && hass.connection; if (!c || c === this.conn) return; this.conn = c; this._init(); },
  async _init() {
    try {
      const d = await this.conn.sendMessagePromise({ type: 'lemur_light_effects/get' });
      this.mode = 'ha'; this._put(d);
      this.conn.subscribeMessage(m => this._put(m), { type: 'lemur_light_effects/subscribe' }).catch(() => {});
      // a browser or app can keep an older card in its cache after an update: offer a reload
      this.conn.sendMessagePromise({ type: 'lemur_light_effects/info' }).then(r => { if (r && r.version && r.version !== CARD_VERSION) { this.stale = r.version; this.v++; this._emit(); } }).catch(() => {});
    } catch (e) {
      this.mode = 'local';
      let d = {}; try { d = JSON.parse(localStorage.getItem(LS_KEY) || '{}'); } catch (_) {}
      this._put(d);
    }
  },
  _put(d) { if (!d || typeof d !== 'object') return; for (const k of Object.keys(this.d)) if (d[k] != null) this.d[k] = d[k]; this.v++; this._emit(); },
  _emit() { this.L.forEach(f => { try { f(); } catch (e) { console.error(e); } }); },
  _local() { if (this.mode !== 'ha') try { localStorage.setItem(LS_KEY, JSON.stringify(this.d)); } catch (e) {} },
  _send(m) { return this.mode === 'ha' ? this.conn.sendMessagePromise(m) : Promise.resolve(); },
  set(key, val) { this.d[key] = val; this.v++; this._emit(); this._local(); return this._send({ type: 'lemur_light_effects/set', key, value: val }).catch(e => console.warn('LEMUR', e)); },
  last(ents, effect, room) {
    if (!ents.length) return; const ts = Date.now() / 1000;
    ents.forEach(e => { if (effect) this.d.last[e] = { effect, ts }; else delete this.d.last[e]; });
    if (effect && room) { const R = Object.assign({}, this.d.recent || {}); R[room] = [effect, ...(R[room] || []).filter(k => k !== effect)].slice(0, 12); this.d.recent = R; }
    this.v++; this._local(); this._send({ type: 'lemur_light_effects/last', entities: ents, effect: effect || null, room: room || null }).catch(() => {});
  },

  async icon(key, mime, b64) {
    if (this.mode === 'ha') { const r = await this.conn.sendMessagePromise({ type: 'lemur_light_effects/icon_upload', key, mime, data: b64 }); this.d.icons[key] = r.url; }
    else { this.d.icons[key] = `data:${mime};base64,${b64}`; this._local(); }
    this.v++; this._emit();
  },
  async iconDel(key) { delete this.d.icons[key]; this.v++; this._emit(); this._local(); await this._send({ type: 'lemur_light_effects/icon_delete', key }).catch(() => {}); }
};
window.__LEMUR_STORE = STORE;

const toPngB64 = file => new Promise((res, rej) => {
  const url = URL.createObjectURL(file), img = new Image();
  img.onload = () => {
    const S = 128, c = document.createElement('canvas'); c.width = c.height = S;
    const w = img.naturalWidth || S, h = img.naturalHeight || S, k = Math.min(S / w, S / h);
    c.getContext('2d').drawImage(img, (S - w * k) / 2, (S - h * k) / 2, w * k, h * k);
    URL.revokeObjectURL(url); res(c.toDataURL('image/png').split(',')[1]);
  };
  img.onerror = () => { URL.revokeObjectURL(url); rej(new Error('image')); };
  img.src = url;
});

class LemurLightEffectCard extends HTMLElement {
  constructor() { super(); this._onStore = () => { this._mergeCfg(); this._kick(); }; this._lastFx = {}; }
  connectedCallback() { STORE.L.add(this._onStore); if (this._hass) this._render(true); }
  disconnectedCallback() { STORE.L.delete(this._onStore); }
  static getConfigElement() { return document.createElement('lemur-light-effect-card-editor'); }
  static getStubConfig() { return {}; }
  getCardSize() { return 12; }
  getGridOptions() { return { columns: 'full', rows: 10, min_rows: 6 }; }

  setConfig(c) {
    this._raw = c || {};
    this._mergeCfg();
    this._st = this._st || { room: this._c.room || null, cat: null, panel: false, sheet: null };
    this._rm = null;
    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
      const R0 = this.shadowRoot;
      const dn = () => { this._touch = true; this._touchT = Date.now(); clearTimeout(this._tt2); };
      const up = () => { clearTimeout(this._tt2); this._tt2 = setTimeout(() => { this._touch = false; if (this._pend && !this._drag) { this._pend = false; this._render(true); } }, 450); };
      R0.addEventListener('pointerdown', dn, true); R0.addEventListener('touchstart', dn, { capture: true, passive: true });
      R0.addEventListener('pointerup', up, true); R0.addEventListener('pointercancel', up, true);
      R0.addEventListener('touchend', up, { capture: true, passive: true }); R0.addEventListener('touchcancel', up, { capture: true, passive: true });
    }
    if (!this._ro && window.ResizeObserver) {
      this._ro = new ResizeObserver(() => {
        const w = this.offsetWidth || this.getBoundingClientRect().width; if (!w) return;
        const m = this._c.mobile === true || (this._c.mobile !== false && w < 640), bk = Math.round(w / 80); this._w = w;
        if (m !== this._mob || bk !== this._bk) { this._mob = m; this._bk = bk; this._render(true); }
      });
      this._ro.observe(this);
    }
    this._render();
  }
  _mergeCfg() {
    const s = (STORE.d.settings && typeof STORE.d.settings === 'object') ? STORE.d.settings : {}, r = this._raw || {};
    this._c = Object.assign({ kelvin: 3200, brightness: 40, language: 'auto', all_home: true, min_effects: 3, close: false, lan: [] }, s, r);
    this._c.exclude = [...(s.exclude || []), ...(r.exclude || [])];
    if (!(r.areas && r.areas.length)) this._c.areas = null;
  }
  set hass(h) {
    const first = !this._hass; this._hass = h; STORE.attach(h);
    if (first) { this._render(); this._loadRoutes(); return; }
    if (this._sig() !== this._lastSig) this._kick();
  }
  _kick() {
    // while someone types in the phone search field, background updates wait (a re-render would close the keyboard)
    const ae = this.shadowRoot && this.shadowRoot.activeElement;
    if (this._drag || (this._touch && Date.now() - this._touchT < 3000) || (ae && ae.id === 'mq')) this._pend = true; else this._render(true);
  }
  _lang() { const l = this._c.language; if (l && l !== 'auto') return I18N[l] ? l : 'en'; const h = this._hass; return pickLang((h && ((h.locale && h.locale.language) || h.language)) || navigator.language); }
  _t(k, v) { let s = (I18N[this._lang()] || I18N.en)[k]; if (s == null) s = I18N.en[k] || k; if (v) for (const x in v) s = s.split('{' + x + '}').join(v[x]); return s; }
  _pc(v) { return this._lang() === 'tr' ? '%' + v : v + '%'; }
  _hi(icon, fb) { return customElements.get('ha-icon') && icon ? `<ha-icon icon="${esc(icon)}"></ha-icon>` : fb; }
  _lname(id, room) {
    const s = this._hass.states[id], n = (s && s.attributes.friendly_name) || id.split('.')[1];
    if (room && room.name && n.toLowerCase().startsWith(room.name.toLowerCase() + ' ') && n.length > room.name.length + 2) return n.slice(room.name.length + 1);
    return n;
  }
  _licon(id) { const e = (this._hass.entities || {})[id], s = this._hass.states[id]; return (e && e.icon) || (s && s.attributes.icon) || 'mdi:lightbulb'; }

  // ---- rooms from Home Assistant areas ----
  _rooms() {
    const H = this._hass, c = this._c, E = H.entities || {}, D = H.devices || {}, A = H.areas || {};
    const ids = Object.keys(H.states).filter(x => x.startsWith('light.'));
    const rm = this._rm;
    if (rm && rm.E === E && rm.A === A && rm.D === D && rm.n === ids.length && rm.c === c && rm.l === this._lang()) return rm.list;
    const inc = c.entities && c.entities.length ? new Set(c.entities) : null;
    const by = {}, none = [];
    for (const id of inc ? ids.filter(x => inc.has(x)) : lightPool(H, c.include_groups)) {
      const p = lightPlace(H, c, id), room = p.room || (inc ? homeArea(H, id) : null);
      if (!room) continue;
      if (room === '_none') none.push(id); else (by[room] = by[room] || []).push(id);
    }
    const lang = this._lang();
    const hid = new Set(c.hidden_areas || []), sortL = l => l.sort((a, b) => this._lname(a).localeCompare(this._lname(b), lang));
    const RI = c.room_icons || {}, mk = a => a === '_none' ? { id: '_none', name: this._t('unassigned'), icon: RI._none || 'mdi:lightbulb-group-outline', lights: sortL(none) } : { id: a, name: A[a].name, icon: RI[a] || A[a].icon || 'mdi:texture-box', lights: sortL(by[a]) };
    let rids;
    if (c.areas && c.areas.length) rids = c.areas.filter(a => by[a]);
    else {
      const ok = a => a === '_all' || (a === '_none' ? none.length > 0 : !!by[a]), pref = (c.order || []).filter(ok);
      const rest = Object.keys(by).filter(a => !pref.includes(a)).sort((a, b) => A[a].name.localeCompare(A[b].name, lang));
      rids = [...pref, ...rest];
      if (none.length && !rids.includes('_none')) rids.push('_none');
      rids = rids.filter(a => !hid.has(a));
    }
    const list = rids.filter(a => a !== '_all').map(mk);
    if (allHomeOn(c) && list.length > 1) {
      const all = { id: '_all', name: this._t('allHome'), icon: RI._all || 'mdi:home', lights: list.flatMap(r => r.lights) }, i = rids.indexOf('_all');
      if (i < 0) list.unshift(all); else list.splice(i, 0, all);
    }
    this._rm = { E, A, D, n: ids.length, c, l: lang, list };
    return list;
  }
  _room() { const L = this._rooms(); return L.find(r => r.id === this._st.room) || L[0] || { id: '_none', name: '', lights: [] }; }
  _sel(room) {
    room = room || this._room(); const v = STORE.d.rooms && STORE.d.rooms[room.id];
    return Array.isArray(v) ? room.lights.filter(id => v.includes(id)) : room.lights.slice();
  }
  _saveSel(ids) { const r = this._room(); STORE.set('rooms', Object.assign({}, STORE.d.rooms, { [r.id]: ids })); }

  // ---- tabs of a room ----
  _roomKeys(room) {
    const M = new Map();
    room.lights.filter(id => this._cap(id)).forEach(id => { for (const [k, nm] of this._parsed(id).m) if (!M.has(k) || (GOVL.has(nm) && !GOVL.has(M.get(k)))) M.set(k, nm); });
    customUnits(this._c, this._hass, room.lights, id => this._cap(id)).forEach(u => M.set(u.k, u.rep));
    return M;
  }
  _resolve(room) {
    const M = this._roomKeys(room); this._rk = M;
    return resolveTabs(roomCfg(this._c, room.id), [...M.keys()], k => grpOfKey(k, M.get(k)));
  }
  _editRoom(fn) {
    const room = this._room(), M = this._roomKeys(room);
    const cfg = materialize(this._c, room.id, [...M.keys()], k => grpOfKey(k, M.get(k)));
    fn(cfg); saveRoomCfg(room.id, cfg);
  }

  // ---- effects ----
  _parsed(id) { const s = this._hass.states[id], l = s && s.attributes.effect_list; return Array.isArray(l) ? parseList(l) : EMPTY_P; }
  _fx(id) { const p = this._parsed(id), H = this._hid; if (!H || !H.size) return p.m; const m = new Map(); for (const [k, n] of p.m) if (!H.has(k)) m.set(k, n); return m; }
  _cap(id) { return fxOn(this._c, id, this._parsed(id).m.size); }
  _keyOf(id, name) { for (const [k, n] of this._parsed(id).m) if (n === name) return k; return norm(name); }
  _now(id) {
    const o = this._optFx; if (o && Date.now() < o.until && o.ids.includes(id)) return o.k;
    const s = this._hass.states[id]; if (!s || s.state !== 'on') return null;
    const L0 = STORE.d.last && STORE.d.last[id];
    if (L0 && String(L0.effect).startsWith('u:') && (Date.parse(s.last_changed) || 0) <= L0.ts * 1000 + 15000) return L0.effect;
    const e = s.attributes.effect;
    if (typeof e === 'string' && e.trim()) return OFF_RE.test(e.trim()) ? null : this._keyOf(id, e);
    const L = STORE.d.last && STORE.d.last[id];
    if (L && L.effect) { const lc = Date.parse(s.last_changed) || 0; if (lc <= L.ts * 1000 + 15000) return L.effect; }
    return null;
  }
  _label(u) { if (u.label) return u.label; const nm = u.rep, i = fxInfo(nm); return this._lang() === 'tr' && i.tr ? i.tr : pretty(nm); }
  _part(u, IF) { return !u.custom && IF.some(id => !u.names[id] && !(u.fill && u.fill[id])); }
  _playing(u) { const S = Object.keys(u.names); return S.length && S.every(id => this._now(id) === u.k); }
  _caps(id) {
    const s = this._hass.states[id], m = (s && s.attributes.supported_color_modes) || [];
    if (!m.length) return { ct: true, color: true, dim: true };
    const ct = m.includes('color_temp'), color = m.some(x => ['hs', 'rgb', 'rgbw', 'rgbww', 'xy'].includes(x));
    return { ct, color, dim: ct || color || m.some(x => ['brightness', 'white'].includes(x)) };
  }
  _sig() {
    const H = this._hass; let s = STORE.v + '|' + (this._rm ? this._rm.n : '') + '|' + (H.entities ? 'e' : '') ;
    for (const id of this._room().lights) { const x = H.states[id]; if (!x) continue; const a = x.attributes; s += x.state + (a.brightness || '') + (a.color_temp_kelvin || '') + String(a.rgb_color || '') + (a.effect || '') + (a.effect_list ? a.effect_list.length : '') + '|'; }
    return s + this._rooms().length;
  }
  _std() { return { k: +this._c.kelvin || 3200, b: this._brCap(+this._c.brightness || 40) }; }
  _brCap(b) { const m = nightMax(this._c); return m && b > m ? m : b; }

  // ---- light state (optimistic) ----
  _light(I) {
    const raw = this._lightRaw(I), o = this._opt;
    if (!o || Date.now() > o.until || o.room !== this._st.room) { this._opt = null; return raw; }
    if (this._optDone(I)) { this._opt = null; return raw; }
    if (o.off) return { on: false };
    const L = raw.on ? Object.assign({}, raw) : { on: true, k: null, ct: true, rgb: null, hs: null, fill: '#F0A93B', br: 100 };
    if (o.br != null) L.br = o.br;
    if (o.k != null) { L.k = o.k; L.ct = true; L.rgb = null; L.hs = null; L.fill = KELV.reduce((a, b) => Math.abs(b[0] - o.k) < Math.abs(a[0] - o.k) ? b : a)[1]; }
    if (o.rgb) { L.k = null; L.ct = false; L.rgb = o.rgb; L.hs = null; L.fill = `rgb(${o.rgb.join(',')})`; }
    if (o.hs) { L.k = null; L.ct = false; L.rgb = null; L.hs = o.hs; L.fill = `hsl(${o.hs[0]} ${o.hs[1]}% 55%)`; }
    return L;
  }
  _optDone(I) {
    const o = this._opt, H = this._hass;
    return (o.ids || I).every(id => {
      const s = H.states[id]; if (!s) return true; if (o.off) return s.state === 'off'; if (s.state !== 'on') return false;
      const a = s.attributes, c = this._caps(id);
      if (o.br != null && c.dim && (!a.brightness || Math.abs(a.brightness / 2.55 - o.br) > 3)) return false;
      if (o.k != null && c.ct && (a.color_mode !== 'color_temp' || !a.color_temp_kelvin || Math.abs(a.color_temp_kelvin - o.k) > 150)) return false;
      if (o.rgb && c.color && (!a.rgb_color || a.rgb_color.some((v, i) => Math.abs(v - o.rgb[i]) > 30))) return false;
      if (o.hs && c.color && (!a.hs_color || Math.abs(a.hs_color[0] - o.hs[0]) > 12)) return false;
      return true;
    });
  }
  _setOpt(x, ids) {
    x = Object.fromEntries(Object.entries(x).filter(([, v]) => v != null));
    const keep = this._opt && !this._opt.off && Date.now() < this._opt.until && this._opt.room === this._st.room ? this._opt : {};
    const n = Object.assign({}, keep, x);
    if (x.k != null || x.rgb || x.hs) { delete n.k; delete n.rgb; delete n.hs; Object.assign(n, x); }
    if (!x.off) delete n.off; n.until = Date.now() + 15000; n.room = this._st.room; if (ids) n.ids = ids; this._opt = n;
  }
  _lightRaw(I) {
    const H = this._hass, on = I.map(id => H.states[id]).filter(s => s && s.state === 'on');
    if (!on.length) return { on: false };
    const cl = on.filter(s => !['onoff', 'brightness', 'white', undefined, null].includes(s.attributes.color_mode));
    const a = (cl[0] || on[0]).attributes, ct = cl.length > 0 && cl.every(s => s.attributes.color_mode === 'color_temp');
    const ks = cl.map(s => s.attributes.color_temp_kelvin).filter(Boolean);
    const k = ct && ks.length && ks.every(x => Math.abs(x - ks[0]) < 150) ? ks[0] : null;
    const rgb = !ct && a.rgb_color && cl.every(s => s.attributes.rgb_color && s.attributes.rgb_color.every((v, i) => Math.abs(v - a.rgb_color[i]) < 24)) ? a.rgb_color : null;
    const brs = on.filter(s => s.attributes.brightness).map(s => s.attributes.brightness);
    return { on: true, k, ct, rgb, hs: !ct && a.hs_color, fill: a.rgb_color ? `rgb(${a.rgb_color.join(',')})` : '#F0A93B', br: brs.length ? Math.round(brs.reduce((x, y) => x + y, 0) / brs.length / 2.55) : 100 };
  }

  // ---- service calls ----
  _call(data) {
    const err = e => this._toast(this._t('err', { e: e.message || e.code || e }));
    const fade = +this._c.transition || 0;
    if (fade > 0 && data.effect == null) {
      // a soft change, on the lights that can fade (Ayarlar → geçiş süresi)
      const ids = [].concat(data.entity_id), slow = ids.filter(id => ((this._hass.states[id] || {}).attributes || {}).supported_features & 32), fast = ids.filter(id => !slow.includes(id));
      const P = [];
      if (slow.length) P.push(this._hass.callService('light', 'turn_on', Object.assign({}, data, { entity_id: slow, transition: fade })).catch(err));
      if (fast.length) P.push(this._hass.callService('light', 'turn_on', Object.assign({}, data, { entity_id: fast })).catch(err));
      return Promise.all(P);
    }
    return this._hass.callService('light', 'turn_on', data).catch(err);
  }

  _set(I, data, msg, keepFx) {
    if (!I.length) return;
    if (!keepFx) this._optFx = null;
    const g = new Map();
    I.forEach(id => {
      const c = this._caps(id), d = {}, s = this._hass.states[id], a = (s && s.attributes) || {};
      if (data.brightness_pct != null && c.dim) d.brightness_pct = this._brCap(data.brightness_pct);
      if (data.color_temp_kelvin) {
        if (c.ct) d.color_temp_kelvin = Math.max(a.min_color_temp_kelvin || 1000, Math.min(a.max_color_temp_kelvin || 12000, data.color_temp_kelvin));
        else if (c.color) d.rgb_color = k2rgb(data.color_temp_kelvin);
      }
      if (data.rgb_color && c.color) d.rgb_color = data.rgb_color;
      if (data.hs_color && c.color) d.hs_color = data.hs_color;
      if (!Object.keys(d).length && !data._power) return;
      const key = JSON.stringify(d); if (!g.has(key)) g.set(key, { d, ids: [] }); g.get(key).ids.push(id);
    });
    g.forEach(({ d, ids }) => this._call(Object.assign({ entity_id: ids }, d)));
    this._setOpt({ br: data.brightness_pct, k: data.color_temp_kelvin, rgb: data.rgb_color, hs: data.hs_color });
    if (!keepFx) STORE.last(I.filter(id => STORE.d.last[id]), null);
    this._render(true);
    if (msg) this._toast(msg);
  }
  _off(I) {
    if (!I.length) return; this._optFx = null;
    const fade = +this._c.transition || 0, slow = fade > 0 ? I.filter(id => ((this._hass.states[id] || {}).attributes || {}).supported_features & 32) : [];
    if (slow.length) this._hass.callService('light', 'turn_off', { entity_id: slow, transition: fade }).catch(e => this._toast(this._t('err', { e: e.message || e })));
    const rest = I.filter(id => !slow.includes(id));
    if (rest.length) this._hass.callService('light', 'turn_off', { entity_id: rest }).catch(e => this._toast(this._t('err', { e: e.message || e })));
    this._opt = null; this._setOpt({ off: true }); STORE.last(I.filter(id => STORE.d.last[id]), null);
    this._render(true); this._toast(this._t('turnedOff', { r: this._room().name }));
  }
  _apply(k, I, IA) {
    const u = this._U && this._U.get(k); if (!u) return;
    const S = Object.keys(u.names).filter(id => I.includes(id)), FL = u.fill ? Object.keys(u.fill).filter(id => (IA || I).includes(id)) : [];
    if (!S.length && !FL.length) return;
    this._lastFx[this._st.room] = k; this._opt = null;
    const H = this._hass, grp = {}, ob = +this._c.fx_on_brightness || 0, nm0 = nightMax(this._c);
    S.forEach(id => {
      const nm = u.names[id], loc = this._routes && this._routes[id];
      if ((this._c.lan || []).includes(id) && loc && loc.has(nm.toLowerCase())) {
        H.callService('govee_lan_fx', 'play_scene', { entity_id: id, scene: nm }).catch(() => this._call({ entity_id: id, effect: nm }));
        return;
      }
      // a light that is off can come on at a set brightness; at night nothing goes above the ceiling
      const s = H.states[id], off = !s || s.state !== 'on', cur = s && s.attributes.brightness ? Math.round(s.attributes.brightness / 2.55) : null;
      let b = off && ob ? this._brCap(ob) : null;
      if (nm0 && this._caps(id).dim && (off ? true : cur == null || cur > nm0)) b = Math.min(b || nm0, nm0);
      const key = nm + '\u0000' + (b || ''); (grp[key] = grp[key] || { nm, b, ids: [] }).ids.push(id);
    });
    Object.values(grp).forEach(({ nm, b, ids }) => this._call(Object.assign({ entity_id: ids, effect: nm }, b ? { brightness_pct: b } : {})));
    if (FL.length) this._actions(Object.fromEntries(FL.map(id => [id, u.fill[id]])));
    const all = [...S, ...FL];
    STORE.last(all, k, this._st.room);
    this._optFx = { k, ids: all, until: Date.now() + 6000 };
    this._render(true);
    const lb = this._label(u), miss = I.filter(id => !all.includes(id)).length;
    this._toast(miss ? this._t('partial', { x: lb, a: I.length - miss, b: I.length }) : this._t('applied', { r: this._room().name, x: lb }));
  }
  _applyCustom(u, I) {
    const ids = Object.keys(u.names).filter(id => I.includes(id)); if (!ids.length) return;
    this._actions(Object.fromEntries(ids.map(id => [id, u.names[id]])));
    this._lastFx[this._st.room] = u.k; this._opt = null;
    STORE.last(ids, u.k, this._st.room);
    this._optFx = { k: u.k, ids: ids.slice(), until: Date.now() + 6000 };
    this._render(true);
    this._toast(this._t('applied', { r: this._room().name, x: this._label(u) }));
  }
  // what own effects and filled-in lights do: { light: { mode: fx | color | white | off, ... } }
  _actions(M) {
    const ids = Object.keys(M); if (!ids.length) return;
    const H = this._hass, ob = +this._c.fx_on_brightness || 0, g = new Map(), offs = [];
    const add = (d, id) => { const key = JSON.stringify(d); if (!g.has(key)) g.set(key, { d, ids: [] }); g.get(key).ids.push(id); };
    ids.forEach(id => {
      const a = M[id], c = this._caps(id), s = H.states[id], off = !s || s.state !== 'on', at = (s && s.attributes) || {};
      if (a.mode === 'off') { offs.push(id); return; }
      if (a.mode === 'fx') { const d = { effect: a.fx }; const b = off && ob ? this._brCap(ob) : nightMax(this._c); if (b && c.dim) d.brightness_pct = this._brCap(b); add(d, id); return; }
      const d = {};
      if (a.mode === 'color' && Array.isArray(a.rgb) && c.color) d.rgb_color = a.rgb.map(Number);
      if (a.mode === 'white') { const k = +a.k || 3000; if (c.ct) d.color_temp_kelvin = Math.max(at.min_color_temp_kelvin || 1000, Math.min(at.max_color_temp_kelvin || 12000, k)); else if (c.color) d.rgb_color = k2rgb(k); }
      if (a.br && c.dim) d.brightness_pct = this._brCap(+a.br);
      add(d, id);
    });
    g.forEach(({ d, ids: x }) => this._call(Object.assign({ entity_id: x }, d)));
    if (offs.length) H.callService('light', 'turn_off', { entity_id: offs }).catch(e => this._toast(this._t('err', { e: e.message || e })));
  }
  // one entry point for a tap and for Random
  _play(k, IA, IF) {
    const u = this._U && this._U.get(k); if (!u) return;
    if (this._c.haptics !== false && navigator.vibrate) try { navigator.vibrate(8); } catch (e) {}
    if (u.custom) return this._applyCustom(u, IA);
    if (IF.length || u.fill) return this._apply(k, IF, IA);
  }
  _stop(I) {
    this._optFx = null;
    const H = this._hass, on = I.filter(id => (H.states[id] || {}).state === 'on'), st = this._std();
    const offs = new Map();
    on.forEach(id => {
      const p = this._parsed(id), e = H.states[id].attributes.effect;
      if (p.off && !(typeof e === 'string' && OFF_RE.test(e.trim()))) { if (!offs.has(p.off)) offs.set(p.off, []); offs.get(p.off).push(id); }
    });
    offs.forEach((ids, nm) => this._call({ entity_id: ids, effect: nm }));
    STORE.last(I.filter(id => STORE.d.last[id]), null);
    this._opt = null;
    if (on.length) {
      const go = () => this._set(on, { color_temp_kelvin: st.k, brightness_pct: st.b }, null, false);
      if (offs.size) { this._setOpt({ k: st.k, br: st.b }, on); this._render(true); setTimeout(go, 350); } else go();
    } else this._render(true);
    this._toast(this._t('stopped', { k: st.k, b: st.b }));
  }
  async _loadRoutes() {
    this._routes = {};
    if (!(this._c.lan || []).length || !this._hass.services || !this._hass.services.govee_lan_fx) return;
    for (const id of this._c.lan) {
      try {
        const r = await this._hass.connection.sendMessagePromise({ type: 'call_service', domain: 'govee_lan_fx', service: 'effect_routes', service_data: { entity_id: id }, return_response: true });
        const x = (r && r.response) || {}; this._routes[id] = new Set((x.local || []).map(q => String(q).toLowerCase()));
      } catch (e) { this._routes[id] = new Set(); }
    }
  }

  // ---- icons ----
  _ico(u, px) { return fxArt(u, px, this._c); }
  _tabIco(k, px) {
    const tb = this._tb && this._tb[k];
    if (k === 'recent') return `<i class="ti" style="width:${px}px;height:${px}px">${RECENT_ART}</i>`;
    const ic = k === 'light' ? tabArt({ icon: (roomCfg(this._c, this._room().id) || {}).light_icon }, 'light') : tabArt(tb);
    return `<i class="ti" style="width:${px}px;height:${px}px">${ic}</i>`;
  }

  // ---- render ----
  _render(keep) {
    if (!this._hass || !this._c || !this.shadowRoot) return;
    const R = this.shadowRoot, st = this._st, rooms = this._rooms();
    // "start where I left off": the last room on this device too, once the shared settings have loaded
    if (!this._roomInit && STORE.mode) {
      this._roomInit = true;
      if (!this._raw.room && (this._c.start_tab || 'last') === 'last') { let r = null; try { r = localStorage.getItem('lemur-room'); } catch (e) {} if (r && rooms.some(x => x.id === r)) st.room = r; }
    }
    const room = this._room();
    if (!rooms.length) { R.innerHTML = `<style>${CSS}</style><div class="wrap empty-card"><div class="empty">${esc(this._t('noLights'))}</div></div>`; this._lastSig = this._sig(); return; }
    st.room = room.id;
    if (this._roomInit) try { localStorage.setItem('lemur-room', room.id); } catch (e) {}
    this._lastSig = this._sig();
    const lang = this._lang(), t = (k, v) => this._t(k, v);
    const RES = this._resolve(room);
    this._hid = new Set(RES.hid);
    const IA = this._sel(room), IF = IA.filter(id => this._cap(id)), n = IF.length;
    const U = new Map();
    IF.forEach(id => { for (const [k, nm] of this._fx(id)) { let u = U.get(k); if (!u) { u = { k, names: {}, c: 0, rep: nm }; U.set(k, u); } u.names[id] = nm; u.c++; if (GOVL.has(nm) && !GOVL.has(u.rep)) u.rep = nm; } });
    // lights without the effect that were given something to do (filled in) take part too
    U.forEach(u => { IA.forEach(id => { if (u.names[id]) return; const a = fillAction(this._c, u.k, id); if (a) (u.fill = u.fill || {})[id] = a; }); });
    customUnits(this._c, this._hass, IA, id => this._cap(id)).forEach(u => { if (!this._hid.has(u.k)) U.set(u.k, u); });
    const hasCu = [...U.values()].some(u => u.custom);
    this._U = U;
    const all = [...U.values()], lab = u => this._label(u);
    const cmp = (a, b) => (b.c - a.c) || lab(a).localeCompare(lab(b), lang);
    const by = {}, TB = {};
    RES.tabs.forEach(tb => { TB[tb.id] = tb; by[tb.id] = tb.fx.map(k => U.get(k)).filter(Boolean); });
    this._tb = TB;
    const favT = RES.tabs.find(tb => tb.fav), fav = favT ? by[favT.id] : [], favSet = new Set(favT ? favT.fx : []);
    const tabs = ['light', ...RES.tabs.filter(tb => tb.fav || by[tb.id].length).map(tb => tb.id)];
    // recently used: what was played in this room lately, newest first
    const rec = this._c.show_recent === false ? [] : ((STORE.d.recent || {})[room.id] || []).map(k => U.get(k)).filter(Boolean).slice(0, 12);
    // on a phone the tab stays put (bottom bar) even before anything was played in the room
    if (rec.length || (this._mob && this._c.show_recent !== false)) { TB.recent = { id: 'recent', recent: 1, fx: rec.map(u => u.k) }; by.recent = rec; tabs.splice(favT ? tabs.indexOf(favT.id) + 1 : 1, 0, 'recent'); }
    if (!st.cat || !tabs.includes(st.cat) || st.catAuto) {
      const sv = this._c.start_tab || 'last', firstFx = tabs.find(k => k !== 'light' && !(TB[k] && TB[k].fav)) || 'light';
      let lt = null; if (sv === 'last') try { lt = localStorage.getItem('lemur-tab-' + room.id); } catch (e) {}
      st.cat = sv === 'light' ? 'light' : sv === 'fav' && favT ? favT.id : sv === 'last' && lt && tabs.includes(lt) ? lt : fav.length && favT ? favT.id : firstFx;
      st.catAuto = true;
    }
    this._tabs = tabs;
    const mob = !!this._mob, tsz = this._c.tile_size, iszA = mob ? 54 : Math.max(64, Math.min(96, Math.round((this._w || 1080) / 15))), isz = tsz === 's' ? Math.round(iszA * .72) : tsz === 'm' ? (mob ? 54 : 80) : tsz === 'l' ? (mob ? 84 : Math.min(150, Math.round(iszA * 1.5))) : iszA;
    const box = u => {
      const p = this._playing(u), part = this._part(u, IF), h = fxInfo(u.rep).hues;
      const dots = u.fill && !part ? `<i class="flm" title="${esc(t('filled'))}" aria-label="${esc(t('fillLbl'))}"><svg viewBox="0 0 16 16"><circle cx="8" cy="8" r="6.2" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M5.2 8.2l1.9 1.9 3.7-3.9" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg></i>` : part ? (n <= 6 ? `<span class="cov">${Array.from({ length: n }, (_, i) => `<i class="${i < u.c ? 'on' : ''}"></i>`).join('')}</span>` : `<span class="cov cn">${u.c}/${n}</span>`) : '';
      return `<div class="bx ${p ? 'play' : ''} ${part ? 'part' : ''}" data-fx="${esc(u.k)}" style="--g:${grad(h, 58, 36, '135deg')};--l:${grad(h, 80, 60, '90deg')}"><div class="bi">${this._ico(u, isz)}</div><span class="nm">${esc(lab(u))}</span>${p ? EQ : ''}${favSet.has(u.k) && !(TB[st.cat] && TB[st.cat].fav) ? '<b class="fv">★</b>' : ''}${dots}</div>`;
    };
    const nows = IA.map(id => this._now(id)).filter(Boolean);
    const cur = nows.length && new Set(nows).size === 1 ? nows[0] : null, any = nows.length > 0;
    const curU = cur && U.get(cur);
    const LL = this._light(IA), br = LL.on ? LL.br : (this._br || 70);
    const fxc = {}; nows.forEach(e => fxc[e] = (fxc[e] || 0) + 1);
    const lf = this._lastFx[st.room];
    const gfx = cur || (lf && fxc[lf] ? lf : Object.keys(fxc).sort((a, b) => fxc[b] - fxc[a])[0]) || null;
    const gu = gfx && U.get(gfx), gh = gu ? fxInfo(gu.rep).hues : null;
    const glowBg = gh ? grad(gh, 75, 45, '120deg') : LL.on ? `linear-gradient(120deg,${LL.fill},${LL.fill})` : 'linear-gradient(120deg,#2b3a5a,#3a2c4a)';
    const glowSoft = !!gfx && IA.some(id => (this._hass.states[id] || {}).state === 'on' && this._now(id) !== gfx);
    const anyOn = IA.some(id => (this._hass.states[id] || {}).state === 'on');
    const tname = k => { if (k === 'light') return t('light'); if (k === 'recent') return t('recent'); const tb = TB[k]; return !tb ? k : tb.name || (tb.fav ? t('fav') : GNAME[lang][tb.auto] || k); };
    const tabBtn = tabs.map(k => `<button class="ct ${st.cat === k ? 'on' : ''}" data-cat="${esc(k)}">${this._tabIco(k, mob ? 32 : Math.round(iszA * .62))}<span>${esc(tname(k))}</span></button>`).join('');
    let body;
    if (st.cat === 'light') body = this._isik(IA);
    else if (!IA.length) body = `<div class="empty">${esc(t(mob ? 'mSelFirst' : 'selectFirst'))}</div>`;
    else if (!n && !hasCu) body = `<div class="empty">${esc(t('noCap'))}</div>`;
    else if (st.cat === 'recent') body = rec.length ? `<div class="bgrid">${rec.map(box).join('')}</div>` : `<div class="empty">${esc(t('recEmpty'))}</div>`;
    else if (TB[st.cat] && TB[st.cat].fav) body = fav.length ? `<div class="bgrid">${fav.map(box).join('')}</div>` : `<div class="empty">${esc(t('favEmpty'))}</div>`;
    else {
      const L0 = (by[st.cat] || []).slice(), L = TB[st.cat] && TB[st.cat].auto ? L0.sort(cmp) : L0, full = L.filter(u => !this._part(u, IF)),
        // "on some lights": the effects most lights can play first (the tab's own order breaks ties)
        cov = u => IF.filter(id => u.names[id] || (u.fill && u.fill[id])).length, part = L.filter(u => this._part(u, IF)).sort((a, b) => cov(b) - cov(a));
      body = !L.length ? `<div class="empty">${esc(t('noFx'))}</div>` :
        (full.length ? `<div class="bgrid">${full.map(box).join('')}</div>` : '') +
        (part.length ? `<div class="sub">${esc(t('some'))}<em>${esc(t('someNote'))}</em></div><div class="bgrid">${part.map(box).join('')}</div>` : '');
    }
    const roomBtn = (r, short) => `<button class="room ${r.id === st.room ? 'on' : ''}" data-room="${esc(r.id)}">${this._hi(r.icon, HOME)}<span>${esc(short && r.short ? r.short : r.name)}</span></button>`;
    const lstack = k => IA.slice(0, k).map(id => `<span>${this._hi(this._licon(id), BULB)}</span>`).join('') || '<span class="none">–</span>';
    const nowTx = `<i class="nsw" style="background:${LL.on ? LL.fill : 'var(--deep)'}"></i><div><small>${esc(t('light'))}</small><b>${!IA.length ? esc(t('none')) : !LL.on ? esc(t('off')) : (LL.k ? LL.k + 'K' : (LL.rgb || LL.hs) ? esc(t('color')) : esc(t('mixed'))) + ' · ' + this._pc(LL.br)}</b></div>`;
    const nowHtml = sz => curU ? `${this._ico(curU, sz)}<div><small>${esc(t('playing'))}</small><b>${esc(lab(curU))}</b></div>` : any ? `<div><small>${esc(t('playing'))}</small><b>${esc(t('mixed'))}</b></div>` : nowTx;
    const upd = STORE.stale ? `<div class="upd"><span>${esc(t('upd', { v: STORE.stale }))}</span><button data-reload>${esc(t('reload'))}</button></div>` : '';
    const isik = st.cat === 'light', X = this._c.close ? `<button class="x" data-close aria-label="${esc(t('close'))}">✕</button>` : '';
    // ---- phone layout: room box, what is playing, tab title or search, effects, brightness, tabs at the bottom ----
    let M = null;
    if (mob) {
      const favId = favT ? favT.id : null, fxTabs = tabs.filter(k => k !== 'light' && k !== 'recent' && k !== favId);
      if (fxTabs.includes(st.cat)) st.mfx = st.cat;
      const mtab = st.cat === 'light' ? 'light' : st.cat === 'recent' ? 'recent' : st.cat === favId ? 'fav' : 'fx';
      if (mtab !== 'fx') st.q = '';
      const litOf = r => { const on = r.lights.filter(id => (this._hass.states[id] || {}).state === 'on').length; return on ? t('mLit', { a: on, b: r.lights.length }) : t('mAllOff'); };
      const top = `<div class="mtop"><button class="mroom" data-rpick><span class="rl"><small>${esc(t('mRoom'))} · ${esc(litOf(room))}</small><b>${esc(room.name)}</b></span><span class="rc">${esc(t('mChange'))}${M_DOWN}</span></button>${X}</div>`;
      // what the room is doing right now
      const stopB = this._c.show_stop === false ? '' : `<button class="mbt" data-stop>■ ${esc(t('stop'))}</button>`;
      const randB = this._c.show_random === false || !all.length ? '' : `<button class="mbt" data-rand>⤨ ${esc(t('random'))}</button>`;
      let stat;
      if (curU) { const on = IA.filter(id => this._now(id) === cur).length, h = fxInfo(curU.rep).hues; stat = `<div class="mst on" style="--g:${grad(h, 50, 26, '90deg')}">${this._ico(curU, 36)}<div class="mt"><b>${esc(lab(curU))}</b><small>${esc(t('mPlaying', { n: on }))}</small></div>${stopB}</div>`; }
      else if (any) stat = `<div class="mst"><span class="mi">${M_GRID}</span><div class="mt"><b>${esc(t('mMixed'))}</b></div>${stopB}</div>`;
      else if (LL.on) stat = `<div class="mst"><i class="nsw" style="background:${LL.fill}"></i><div class="mt"><b>${esc(t('mLight', { x: (LL.k ? LL.k + 'K' : (LL.rgb || LL.hs) ? t('color') : t('mixed')) + ' · ' + this._pc(LL.br) }))}</b></div>${randB}</div>`;
      else stat = `<div class="mst idle"><span class="mi">${BULB}</span><div class="mt"><b>${esc(IA.length && !anyOn ? t('mOff') : t('mIdle'))}</b></div>${randB}</div>`;
      // tab title, or search + groups on the "all effects" tab
      const cnt = k => (k === 'recent' ? rec : by[k] || []).length;
      let head;
      if (mtab === 'fx') {
        head = `<label class="msr">${M_SEARCH}<input id="mq" type="search" placeholder="${esc(t('mSearch'))}" value="${esc(st.q || '')}" autocomplete="off" enterkeyhint="search"></label>
          <div class="mchips">${fxTabs.map(k => `<button class="mchip ${!st.q && st.cat === k ? 'on' : ''}" data-cat="${esc(k)}">${this._tabIco(k, 22)}<span>${esc(tname(k))}</span><em>${cnt(k)}</em></button>`).join('')}</div>`;
      } else head = `<div class="mhd"><b>${esc(mtab === 'light' ? t('mLightTab') : mtab === 'recent' ? t('mRecent') : tname(st.cat))}</b>${mtab === 'light' ? '' : `<small>${esc(t('mCount', { n: cnt(st.cat) }))}</small>`}</div>`;
      // search over every effect of the room
      const find = q => {
        q = String(q || '').trim().toLocaleLowerCase(lang); if (!q) return null;
        const L = all.filter(u => (lab(u) + ' ' + (u.rep || '') + ' ' + Object.values(u.names).filter(x => typeof x === 'string').join(' ')).toLocaleLowerCase(lang).includes(q)).sort(cmp);
        return L.length ? `<div class="bgrid">${L.map(box).join('')}</div>` : `<div class="empty">${esc(t('mNoRes'))}</div>`;
      };
      this._mFind = find;
      // bottom: a wide brightness bar and the tabs
      const mt = [favId ? ['fav', favId, t('fav'), STAR] : null, tabs.includes('recent') ? ['recent', 'recent', t('mRecent'), M_CLOCK] : null, fxTabs.length ? ['fx', null, t('mAll'), M_GRID] : null, ['light', 'light', t('mLightTab'), BULB]].filter(Boolean);
      const foot = `${isik ? '' : `<div class="mfoot"><div class="bigbar mbb ${LL.on ? '' : 'off'}" data-hbar><i class="bf" style="width:${LL.on ? LL.br : 0}%;background:${LL.on ? 'var(--acc)' : 'transparent'}"></i><span class="btx">${M_SUN}${esc(t('mBright'))}</span><span class="mbv" id="bbv">${LL.on ? this._pc(LL.br) : esc(t('off'))}</span></div><button class="mpw ${anyOn ? 'on' : ''}" data-pw aria-label="${esc(anyOn ? t('turnOff') : t('light'))}">${PW}</button></div>`}
        <nav class="mtabs" style="grid-template-columns:repeat(${mt.length},1fr)">${mt.map(([id, cat, nm, ic]) => `<button class="${mtab === id ? 'on' : ''}" data-mtab="${id}" ${cat ? `data-tcat="${esc(cat)}"` : ''}>${ic}<span>${esc(nm)}</span></button>`).join('')}</nav>`;
      const roomsSheet = `<div class="shade" data-rclose></div><div class="sheet rsh" role="dialog"><div class="rsh-h"><b>${esc(t('mPick'))}</b><button class="x2" data-rclose>✕</button></div>
        <div class="rlist">${rooms.map(r => { const lit = r.lights.some(id => (this._hass.states[id] || {}).state === 'on'); return `<button class="rrow ${r.id === room.id ? 'on' : ''}" data-room="${esc(r.id)}"><span class="dot ${lit ? 'lit' : ''}"></span><span class="rt"><b>${esc(r.name)}</b><small>${esc(t('lights', { n: r.lights.length }))} · ${esc(litOf(r))}</small></span>${r.id === room.id ? `<span class="ck">${M_CHECK}</span>` : ''}</button>`; }).join('')}</div>
        <div class="racts"><button data-panel>${BULB}<span>${esc(t('mLights'))}</span></button><button class="warn" data-off ${anyOn ? '' : 'disabled'}>${PW}<span>${esc(t('turnOff'))}</span></button></div></div>`;
      this._mBody = body;
      M = { top: top, head: stat + head, search: mtab === 'fx' ? find(st.q) : null, foot, rooms: roomsSheet };
    }
    const sc = R.querySelector('.scroll'), y = sc ? sc.scrollTop : 0, rl = R.querySelector('.crail'), ry = rl ? rl.scrollTop : 0;
    const vars = (this._c.height ? `--lemur-height:${this._c.height};` : '') + (this._c.mobile_height ? `--lemur-mh:${this._c.mobile_height};` : '') + (this._c.accent ? `--lemur-accent:${this._c.accent};` : '');
    R.innerHTML = `<style>${CSS}</style><div class="wrap ${mob ? 'm' : ''} ${this._c.safe_area ? 'sa' : this._c.safe_area === false ? 'nosa' : ''} ${this._look()}" style="${esc(vars)}">${mob ? '' : `<div class="glow ${glowSoft ? 'soft' : ''}" style="background:${glowBg}"></div>`}
      ${mob ? M.top : `<div class="top"><div class="rooms">${rooms.map(r => roomBtn(r)).join('')}</div>${X}</div>`}
      ${upd}${mob ? M.head : `<div class="mid"><section class="pn cp"><nav class="crail">${tabBtn}</nav></section><section class="pn fxp">`}
      <div class="scroll">${mob && M.search ? M.search : body}</div>${mob ? '' : '</section></div>'}
      ${mob ? `${M.foot}` : `<div class="cbar">
        <button class="lstack" data-panel>${lstack(4)}<b>${esc(t('lights', { n: IA.length }))}</b></button>
        <div class="now">${nowHtml(40)}</div>
        ${isik ? '<span class="flex"></span>' : `<div class="slider"><span>☀</span><input type="range" id="br" min="1" max="100" value="${br}"><span id="brv">${br}%</span></div>`}
        ${this._c.show_random === false ? '' : `<button class="act" data-rand ${all.length ? '' : 'disabled'}>⤨<span class="at"> ${esc(t('random'))}</span></button>`}
        ${this._c.show_stop === false ? '' : `<button class="act" data-stop ${any ? '' : 'disabled'}>■<span class="at"> ${esc(t('stop'))}</span></button>`}
        <button class="act offb" data-off ${anyOn ? '' : 'disabled'}>${PW}<span class="at"> ${esc(t('turnOff'))}</span></button>
      </div>`}
      ${st.panel ? this._panel(room, IA) : ''}${st.sheet ? this._sheet(st.sheet, IF) : ''}${mob && st.rpick ? M.rooms : ''}
      <div class="toast"></div></div>`;
    if (keep) { const n2 = R.querySelector('.scroll'); if (n2) n2.scrollTop = y; }
    const mc = R.querySelector('.mchips'), mca = mc && mc.querySelector('.on'); if (mc) mc.scrollLeft = mca ? mca.offsetLeft - 12 : (this._mcx || 0);
    const rl2 = R.querySelector('.crail'); if (rl2) rl2.scrollTop = ry;
    this._bind(all);
  }
  // appearance chosen in the control panel (settings) or on the card
  _look() {
    const c = this._c, x = [];
    if (['s', 'm', 'l'].includes(c.tile_size)) x.push('ts-' + c.tile_size);
    if (c.show_names === false) x.push('nonm');
    if (c.show_bar === false) x.push('nobar');
    if (c.show_dots === false) x.push('nodots');
    if (c.bg === 'black' || c.bg === 'theme') x.push('bg-' + c.bg);
    return x.join(' ');
  }
  _panel(room, IA) {
    const t = (k, v) => this._t(k, v), common = this._U ? [...this._U.values()].filter(u => u.c === IA.filter(id => this._cap(id)).length).length : 0;
    return `<div class="shade" data-pclose></div><div class="panel"><div class="ph"><div><div class="pt">${esc(room.name)}</div><div class="ps">${esc(t('panelSub'))}</div>${STORE.mode === 'local' ? `<div class="ps warn">${esc(t('localMode'))}</div>` : ''}</div><button class="ok" data-pclose>${esc(t('done'))}</button></div>
      <div class="cards">${room.lights.map(id => { const o = IA.includes(id), s = this._hass.states[id], k = this._parsed(id).m.size; return `<div class="lc ${o ? 'on' : ''}" data-id="${esc(id)}"><span class="li">${this._hi(this._licon(id), BULB)}</span><span class="ln">${esc(this._lname(id, room.id.startsWith('_') ? null : room))}<small>${k ? k + ' ' + esc(t('fx')) + ' · ' : ''}${s && s.state === 'on' ? esc(t('isOn')) : esc(t('isOff'))}</small></span><span class="sw"><i></i></span></div>`; }).join('')}</div>
      <div class="pf"><span><b>${common}</b> ${esc(t('common'))}</span><span style="flex:1"></span><button class="lnk" data-all>${esc(t('selectAll'))}</button></div></div>`;
  }
  _sheet(k, IF) {
    const u = this._U && this._U.get(k); if (!u) { this._st.sheet = null; return ''; }
    const ft = this._tb && Object.values(this._tb).find(x => x.fav), fav = !!(ft && ft.fx.includes(k)), t = x => esc(this._t(x)), cust = STORE.d.icons && STORE.d.icons[k];
    const sup = Object.keys(u.names), room = this._room();
    return `<div class="shade" data-sclose></div><div class="sheet" role="dialog">
      <div class="shh">${this._ico(u, 64)}<div><b>${esc(this._label(u))}</b><small>${esc(u.rep)} · ${u.c}/${IF.length}</small></div><button class="x2" data-sclose>✕</button></div>
      <div class="shl"><small>${t('support')}</small><div>${sup.map(id => `<span>${esc(this._lname(id, room.id.startsWith('_') ? null : room))}</span>`).join('')}</div></div>
      <div class="shb">
        <button data-favt class="${fav ? 'on' : ''}">${STAR}<span>${fav ? t('remFav') : t('addFav')}</span></button>
        ${!u.custom && this._hass.user && this._hass.user.is_admin && (u.fill || this._part(u, IF)) ? `<button data-fill>${svg('gradient')}<span>${u.fill ? t('fillE') : t('fillB')}</span></button>` : ''}
        <button data-icup>${svg('palette')}<span>${t('setIcon')}</span></button>
        ${cust ? `<button data-icrm>${svg('generic')}<span>${t('resetIcon')}</span></button>` : ''}
        <button data-hide class="warn">${svg('ghost')}<span>${t('hide')}</span></button>
      </div><input type="file" id="icf" accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml" hidden></div>`;
  }
  _isik(I) {
    const L = this._light(I), n = I.length, st = this._std(), t = (k, v) => this._t(k, v), kn = t('kel');
    if (!n) return `<div class="empty">${esc(t('selectFirst'))}</div>`;
    const fx = I.some(id => this._now(id));
    const knob = L.on && L.hs && !fx ? `<i class="wk" style="left:${50 + Math.cos(L.hs[0] * Math.PI / 180) * L.hs[1] * .46}%;top:${50 + Math.sin(L.hs[0] * Math.PI / 180) * L.hs[1] * .46}%;background:${L.fill}"></i>` : '';
    return `<div class="isik2">
      <div class="bigbar ${L.on ? '' : 'off'}" data-hbar><i class="bf" style="width:${L.on ? L.br : 0}%;background:${L.on ? L.fill : 'transparent'}"></i><button class="bico" data-pw>${BULB}</button><div class="btx"><b>${esc(this._room().name)} · ${esc(t('lights', { n }))}</b><span id="bbv">${L.on ? this._pc(L.br) : esc(t('off'))}</span></div><small class="bstd">${esc(t('stopTo'))} ${st.k}K · ${this._pc(st.b)}</small></div>
      <div class="ir">
        <div class="isec"><div class="sec">${esc(t('white'))}</div><div class="kg2">${KELV.map(([k, c], i) => `<button class="kbx ${L.on && !fx && L.k && Math.abs(L.k - k) < 150 ? 'on' : ''}" data-wk="${k}" style="background:${c}"><b>${esc(kn[i])}</b>${k}K</button>`).join('')}</div></div>
        <div class="isec"><div class="sec">${esc(t('color'))}</div><div class="cb2"><div class="wheel" data-wheel>${knob}</div><div class="cg2">${RENK.map(c => { const r = hex2rgb(c); const on = L.on && !fx && L.rgb && L.rgb.every((v, i) => Math.abs(v - r[i]) < 24); return `<button class="swc ${on ? 'on' : ''}" data-rgb="${r.join(',')}" style="background:${c}"></button>`; }).join('')}</div></div></div>
      </div></div>`;
  }
  _toast(x) { const el = this.shadowRoot && this.shadowRoot.querySelector('.toast'); if (!el) return; el.textContent = x; el.classList.add('show'); clearTimeout(this._tt); this._tt = setTimeout(() => el.classList.remove('show'), 2200); }
  _bind(all) {
    const R = this.shadowRoot, t = (k, v) => this._t(k, v);
    R.querySelector('.wrap').onclick = ev => {
      if (this._swiped && Date.now() - this._swiped < 400) { this._swiped = 0; return; }
      if (this._lpAt && Date.now() - this._lpAt < 700) { this._lpAt = 0; return; }
      const g = s => ev.target.closest(s), room = this._room(), I = this._sel(room), IF = I.filter(id => this._cap(id));
      if (g('[data-close]')) return this._close();
      if (g('[data-sclose]')) { this._st.sheet = null; return this._render(true); }
      if (g('[data-pclose]')) { this._st.panel = false; return this._render(true); }
      if (g('[data-panel]')) { this._st.panel = true; this._st.rpick = false; return this._render(true); }
      if (g('[data-rpick]')) { this._st.rpick = true; return this._render(true); }
      if (g('[data-rclose]')) { this._st.rpick = false; return this._render(true); }
      const mtb = g('[data-mtab]');
      if (mtb) {
        const id = mtb.dataset.mtab, T = this._tabs || [];
        let c = mtb.dataset.tcat || null;
        if (id === 'fx') c = T.includes(this._st.mfx) ? this._st.mfx : T.find(k => k !== 'light' && k !== 'recent' && !(this._tb[k] && this._tb[k].fav));
        if (!c) return;
        this._st.q = ''; this._st.cat = c; this._st.catAuto = false; try { localStorage.setItem('lemur-tab-' + room.id, c); } catch (e) {}
        this._render(); const s = R.querySelector('.scroll'); if (s) s.scrollTop = 0; return;
      }
      const k = this._st.sheet;
      if (k && g('[data-favt]')) { this._st.sheet = null; this._editRoom(cfg => { let f = cfg.tabs.find(x => x.fav); if (!f) { f = { id: 'fav', fav: 1, fx: [] }; cfg.tabs.unshift(f); } const i = f.fx.indexOf(k); if (i >= 0) f.fx.splice(i, 1); else f.fx.push(k); }); return; }
      if (k && g('[data-hide]')) { const u = this._U.get(k); this._st.sheet = null; this._editRoom(cfg => { cfg.tabs.forEach(x => { x.fx = x.fx.filter(q => q !== k); }); cfg.hid = [...(cfg.hid || []).filter(q => q !== k), k]; }); if (u) this._toast(t('hidden', { x: this._label(u) })); return; }
      if (k && g('[data-icrm]')) { STORE.iconDel(k); return; }
      if (k && g('[data-fill]')) {
        // the editor lives in the control panel; leave any full-screen layer and go there
        this._st.sheet = null; this._render(true);
        const url = '/lemur-light?fill=' + encodeURIComponent(k) + '&room=' + encodeURIComponent(this._st.room || '');
        if (typeof this._onClose === 'function') try { this._onClose(); } catch (e) {}
        try { history.pushState(null, '', url); } catch (e) {} window.dispatchEvent(new CustomEvent('location-changed', { detail: { replace: false } }));
        return;
      }
      if (k && g('[data-icup]')) { const f = R.getElementById('icf'); if (f) f.click(); return; }
      const lc = g('[data-id]'); if (lc) { const id = lc.dataset.id, nx = I.includes(id) ? I.filter(x => x !== id) : [...I, id]; this._saveSel(room.lights.filter(x => nx.includes(x))); return; }
      if (g('[data-all]')) { this._saveSel(room.lights.slice()); return; }
      if (g('[data-reload]')) { try { if (navigator.serviceWorker) navigator.serviceWorker.getRegistrations().then(rs => rs.forEach(r => r.update())); } catch (e) {} Promise.resolve(window.__LEMUR_HEAL && window.__LEMUR_HEAL()).finally(() => setTimeout(() => location.reload(), 150)); return; }
      const rm = g('[data-room]'); if (rm) { this._st.room = rm.dataset.room; this._st.rpick = false; this._st.q = ''; return this._render(); }
      const ct = g('[data-cat]'); if (ct) { const mc = R.querySelector('.mchips'); this._mcx = mc ? mc.scrollLeft : 0; this._st.q = ''; this._st.cat = ct.dataset.cat; this._st.catAuto = false; try { localStorage.setItem('lemur-tab-' + room.id, ct.dataset.cat); } catch (e) {} this._render(); const s = R.querySelector('.scroll'); if (s) s.scrollTop = 0; return; }
      if (g('[data-rand]')) { if (!all.length) return; const full = all.filter(u => !this._part(u, IF)), P = full.length ? full : all; return this._play(P[Math.floor(Math.random() * P.length)].k, I, IF); }
      if (g('[data-stop]')) return this._stop(I);
      if (g('[data-off]')) return this._off(I);
      if (g('[data-pw]')) { if (I.some(id => (this._hass.states[id] || {}).state === 'on')) return this._off(I); const s = this._std(); return this._set(I, { color_temp_kelvin: s.k, brightness_pct: s.b, _power: true }, t('turnedOn', { r: room.name })); }
      const wk = g('[data-wk]'); if (wk) { const kk = +wk.dataset.wk; return this._set(I, { color_temp_kelvin: kk }, `${room.name} → ${kk}K`); }
      const rg = g('[data-rgb]'); if (rg) return this._set(I, { rgb_color: rg.dataset.rgb.split(',').map(Number) }, t('toColor', { r: room.name }));
      const wh = g('[data-wheel]'); if (wh) { const r = wh.getBoundingClientRect(), dx = ev.clientX - r.left - r.width / 2, dy = ev.clientY - r.top - r.height / 2; const h = Math.round((Math.atan2(dy, dx) * 180 / Math.PI + 360) % 360), sat = Math.round(Math.min(1, Math.hypot(dx, dy) / (r.width / 2)) * 100); return this._set(I, { hs_color: [h, Math.max(15, sat)] }, t('toColor', { r: room.name })); }
      const fx = g('[data-fx]'); if (fx) return this._play(fx.dataset.fx, I, IF);
    };
    const mq = R.getElementById('mq');
    if (mq) {
      // typing only swaps the results, so the keyboard stays up
      mq.oninput = () => {
        this._st.q = mq.value; const html = this._mFind && this._mFind(mq.value), sc = R.querySelector('.scroll');
        R.querySelectorAll('.mchip').forEach(b => b.classList.toggle('on', !mq.value.trim() && b.dataset.cat === this._st.cat));
        if (sc) { sc.innerHTML = html || this._mBody || ''; sc.scrollTop = 0; }
      };
      mq.onblur = () => setTimeout(() => { if (this._pend && !this._drag) { this._pend = false; this._render(true); } }, 300);
    }
    const icf = R.getElementById('icf');
    if (icf) icf.onchange = async () => {
      const f = icf.files && icf.files[0], k = this._st.sheet; if (!f || !k) return;
      try { const b = await toPngB64(f); await STORE.icon(k, 'image/png', b); this._toast(t('iconSaved')); }
      catch (e) { this._toast(t('iconErr')); }
    };
    const scr = R.querySelector('.scroll');
    if (scr) {
      // long-press / right-click on an effect opens its sheet
      let lp = null;
      const lpStart = (x, y, tg) => { const b = tg && tg.closest && tg.closest('[data-fx]'); clearTimeout(this._lpT); if (!b) return; lp = [x, y]; this._lpT = setTimeout(() => { this._lpAt = Date.now(); this._st.sheet = b.dataset.fx; if (this._c.haptics !== false && navigator.vibrate) try { navigator.vibrate(12); } catch (e) {} this._render(true); }, Math.max(250, Math.min(1500, +this._c.long_press || 550))); };
      const lpMove = (x, y) => { if (lp && Math.hypot(x - lp[0], y - lp[1]) > 10) clearTimeout(this._lpT); };
      const lpEnd = () => { clearTimeout(this._lpT); lp = null; };
      scr.addEventListener('contextmenu', e => { const b = e.target.closest('[data-fx]'); if (!b) return; e.preventDefault(); clearTimeout(this._lpT); this._st.sheet = b.dataset.fx; this._render(true); });
      // swipes: horizontal = rooms, vertical at scroll edges = categories
      let sw = null;
      const start = (x, y, tg) => { if (tg && tg.closest && tg.closest('[data-hbar],[data-wheel],input')) { sw = null; return; } sw = { x, y, top: scr.scrollTop <= 2, bot: scr.scrollTop + scr.clientHeight >= scr.scrollHeight - 2 }; };
      const end = (x, y) => {
        if (!sw) return; const dx = x - sw.x, dy = y - sw.y, s0 = sw; sw = null;
        const ax = Math.abs(dx), ay = Math.abs(dy);
        if (ax >= 60 && ax > ay * 1.5) {
          const RM = this._rooms(), i = RM.findIndex(r => r.id === this._st.room), j = i + (dx < 0 ? 1 : -1);
          if (i < 0 || j < 0 || j >= RM.length) return;
          this._swiped = Date.now(); this._st.room = RM[j].id; this._st.q = ''; this._render();
          const s2 = R.querySelector('.mid') || R.querySelector('.scroll'); if (s2 && s2.animate) s2.animate([{ transform: `translateX(${dx < 0 ? 40 : -40}px)`, opacity: .35 }, { transform: 'none', opacity: 1 }], { duration: 220, easing: 'ease-out' });
          return;
        }
        if (ay >= 70 && ay > ax * 1.5) {
          const top = scr.scrollTop <= 2, bot = scr.scrollTop + scr.clientHeight >= scr.scrollHeight - 2;
          let d = 0; if (dy > 0 && s0.top && top) d = -1; else if (dy < 0 && s0.bot && bot) d = 1; if (!d) return;
          const T = this._tabs || [], i = T.indexOf(this._st.cat), j = i + d;
          if (i < 0 || j < 0 || j >= T.length) return;
          this._swiped = Date.now(); this._st.cat = T[j]; this._st.catAuto = false; this._render();
          const s2 = R.querySelector('.scroll'); if (s2) { s2.scrollTop = 0; if (s2.animate) s2.animate([{ transform: `translateY(${d > 0 ? 40 : -40}px)`, opacity: .35 }, { transform: 'none', opacity: 1 }], { duration: 220, easing: 'ease-out' }); }
        }
      };
      scr.addEventListener('touchstart', e => { const p = e.touches[0]; start(p.clientX, p.clientY, e.target); lpStart(p.clientX, p.clientY, e.target); }, { passive: true });
      scr.addEventListener('touchmove', e => { const p = e.touches[0]; lpMove(p.clientX, p.clientY); }, { passive: true });
      scr.addEventListener('touchend', e => { const p = e.changedTouches[0]; lpEnd(); end(p.clientX, p.clientY); }, { passive: true });
      scr.addEventListener('touchcancel', lpEnd, { passive: true });
      scr.addEventListener('scroll', lpEnd, { passive: true });
      scr.onpointerdown = e => { if (e.pointerType === 'mouse' && e.button === 0) { start(e.clientX, e.clientY, e.target); lpStart(e.clientX, e.clientY, e.target); } };
      scr.onpointermove = e => { if (e.pointerType === 'mouse') lpMove(e.clientX, e.clientY); };
      scr.onpointerup = e => { if (e.pointerType === 'mouse') { lpEnd(); end(e.clientX, e.clientY); } };
    }
    const hb = R.querySelector('[data-hbar]');
    if (hb) {
      let v = null;
      const set = e => { const r = hb.getBoundingClientRect(); v = Math.max(1, Math.round(Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)) * 100)); hb.querySelector('.bf').style.width = v + '%'; if (hb.classList.contains('off')) hb.querySelector('.bf').style.background = '#F0A93B'; R.getElementById('bbv').textContent = this._pc(v); };
      hb.onpointerdown = e => { if (e.target.closest('[data-pw]')) return; this._drag = true; hb.setPointerCapture(e.pointerId); set(e); };
      hb.onpointermove = e => { if (this._drag) set(e); };
      const fin = () => { if (!this._drag) return; this._drag = false; const I = this._sel(); if (v != null && I.length) this._set(I, { brightness_pct: v, _power: true }, null, true); this._pend = false; this._render(true); };
      hb.onpointerup = fin; hb.onpointercancel = fin;
    }
    const br = R.getElementById('br');
    if (br) {
      br.onpointerdown = () => { this._drag = true; };
      br.ontouchstart = () => { this._drag = true; };
      br.oninput = () => { this._drag = true; R.getElementById('brv').textContent = br.value + '%'; };
      br.onchange = () => { this._drag = false; this._br = +br.value; const on = this._sel().filter(id => (this._hass.states[id] || {}).state === 'on'); if (on.length) this._set(on, { brightness_pct: +br.value }, null, true); this._pend = false; this._render(true); };
      br.onpointerup = br.onpointercancel = () => { setTimeout(() => { if (this._drag) { this._drag = false; if (this._pend) { this._pend = false; this._render(true); } } }, 400); };
    }
  }
  _close() {
    if (typeof this._onClose === 'function') return this._onClose();
    if (this._c.close_hash !== false && location.hash) { history.replaceState(null, '', location.href.split('#')[0]); window.dispatchEvent(new Event('location-changed')); }
    this.dispatchEvent(new CustomEvent('ll-custom', { bubbles: true, composed: true, detail: { type: 'close' } }));
    const up = n => n.parentNode || n.host || null;
    let n = this, bm = null, dlg = null;
    while (n) { const t = n.localName || ''; if (t === 'browser-mod-popup') { bm = n; break; } if (!dlg && /^(ha-dialog|ha-md-dialog|ha-wa-dialog|ha-adaptive-dialog|mwc-dialog)$/.test(t)) dlg = n; n = up(n); }
    try { if (bm) { if (typeof bm.closeDialog === 'function') return bm.closeDialog(); if (typeof bm.close === 'function') return bm.close(); } } catch (e) {}
    try { if (dlg) { if (typeof dlg.close === 'function') return dlg.close(); dlg.open = false; return; } } catch (e) {}
    const h = this._hass;
    if (h && h.services && h.services.browser_mod) { let id = null; try { id = localStorage.getItem('browser_mod-browser-id'); } catch (e) {} if (id) h.callService('browser_mod', 'close_popup', { browser_id: [id] }); }
  }
}
