// ---- Lemur Light Effect Card: visual editor ----
const ED_TXT = {
  tr: {
    areas: 'Odalar (boş = ışığı olan tüm alanlar, sıra burada belirlenir)', exclude: 'Hariç tutulacak ışıklar', kelvin: 'Durdur sonrası beyaz ton',
    brightness: 'Durdur sonrası parlaklık', language: 'Dil', all_home: '“Tüm Ev” sekmesini göster', min_effects: 'Efekt ışığı sayılması için en az efekt',
    height: 'Kart yüksekliği (örn. 80vh, 700px)', mobile_height: 'Telefonda yükseklik', close: 'Kapat düğmesi (popup için)', accent: 'Vurgu rengi (#hex)',
    shared: 'Odalar, sekmeler, favoriler, gizlenen efektler ve simgeler sol menüdeki “Lemur Işık Efekt Kartı” panelinden düzenlenir ve evdeki herkes için ortaktır.',
    local: 'Entegrasyon bulunamadı: veriler yalnızca bu cihazda saklanıyor. Ortak kullanım için HACS’tan “Lemur Light Effect Card” entegrasyonunu kur ve ekle.',
    auto: 'Otomatik', name: 'Buton başlığı', browser_fullscreen: 'Tarayıcıyı da tam ekran yap (adres çubuğu ve sistem çubukları gizlenir)',
    hash: 'Açma bağlantısı (bu adrese, örn. “#isik-efektleri”, giden her buton açar)', aspect: 'En-boy oranı (örn. 16/10, 4/3)', subtitle: 'Alt yazı (boş = açık ışık sayısı)',
    popup_width: 'Pencere genişliği (örn. 90vw, 1100px)', popup_height: 'Pencere yüksekliği (örn. 85vh, 700px)', popup_position: 'Konum', popup_scale: 'İçeriği pencereye göre ölçekle', popup_radius: 'Köşe yuvarlaklığı (px)', popup_blur: 'Arka planı bulanıklaştır', center: 'Ortada', bottom: 'Altta',
    look: 'Görünüm', style: 'Buton biçimi', s_row: 'Yatay (simge, başlık, alt yazı)', s_tile: 'Kutu (büyük simge, altında başlık)', s_icon: 'Sadece simge', color: 'Buton rengi', icon: 'Simge (Home Assistant simgesi)', color_icon: 'Renkli simge (efekt simgelerinden)', none: 'Yok'
  },
  en: {
    areas: 'Rooms (empty = every area with lights, order is kept)', exclude: 'Lights to exclude', kelvin: 'White tone after Stop',
    brightness: 'Brightness after Stop', language: 'Language', all_home: 'Show “Whole home” tab', min_effects: 'Minimum effects to count as an effect light',
    height: 'Card height (e.g. 80vh, 700px)', mobile_height: 'Height on phones', close: 'Close button (for popups)', accent: 'Accent color (#hex)',
    shared: 'Rooms, tabs, favorites, hidden effects and icons are arranged in the “Lemur Light Effect Card” panel in the sidebar and shared with everyone at home.',
    local: 'Integration not found: data is stored on this device only. Install and add the “Lemur Light Effect Card” integration from HACS to share it.',
    auto: 'Automatic', name: 'Button title', browser_fullscreen: 'Also make the browser full screen (hides address and system bars)',
    hash: 'Open link (any button going to this address, e.g. “#isik-efektleri”, opens it)', aspect: 'Aspect ratio (e.g. 16/10, 4/3)', subtitle: 'Subtitle (empty = number of lights on)',
    popup_width: 'Window width (e.g. 90vw, 1100px)', popup_height: 'Window height (e.g. 85vh, 700px)', popup_position: 'Position', popup_scale: 'Scale the content to the window', popup_radius: 'Corner radius (px)', popup_blur: 'Blur the background', center: 'Centre', bottom: 'Bottom',
    look: 'Appearance', style: 'Button style', s_row: 'Row (icon, title, subtitle)', s_tile: 'Tile (big icon, title below)', s_icon: 'Icon only', color: 'Button colour', icon: 'Icon (Home Assistant icon)', color_icon: 'Colour icon (from the effect icons)', none: 'None'
  }
};
class LemurLightEffectCardEditor extends HTMLElement {
  constructor() { super(); this._u = () => this._extra(); }
  connectedCallback() { STORE.L.add(this._u); }
  disconnectedCallback() { STORE.L.delete(this._u); }
  setConfig(c) { this._c = Object.assign({}, c); this._r(); }
  set hass(h) { this._h = h; STORE.attach(h); if (this._f) this._f.hass = h; else this._r(); }
  _l() { const h = this._h, x = (h && ((h.locale && h.locale.language) || h.language)) || 'en'; return /^tr/i.test(x) ? 'tr' : 'en'; }
  _kind() { const t = String((this._c && this._c.type) || ''); return /lemur-fullscreen-button/.test(t) ? 'full' : /lemur-window/.test(t) ? 'popup' : /lemur-phone-fullscreen/.test(t) ? 'mfull' : /lemur-phone-button/.test(t) ? 'mbtn' : /lemur-scalable/.test(t) ? 'scale' : /lemur-mobile-card/.test(t) ? 'mobile' : 'classic'; }
  _schema() {
    const T = ED_TXT[this._l()], k = this._kind();
    const lang = this._l(), icons = Object.keys(ICON3).map(x => ({ value: x, label: icName(x, lang) })).sort((a, b) => a.label.localeCompare(b.label, lang));
    const btn = [{ type: 'grid', name: '', schema: [{ name: 'name', selector: { text: {} } }, { name: 'subtitle', selector: { text: {} } }] },
      { type: 'expandable', name: '', title: T.look, icon: 'mdi:palette-outline', schema: [
        { type: 'grid', name: '', schema: [
          { name: 'style', selector: { select: { mode: 'dropdown', options: [{ value: 'row', label: T.s_row }, { value: 'tile', label: T.s_tile }, { value: 'icon', label: T.s_icon }] } } },
          { name: 'color', selector: { ui_color: {} } }
        ] },
        { type: 'grid', name: '', schema: [
          { name: 'color_icon', selector: { select: { mode: 'dropdown', options: [{ value: '', label: T.none }, ...icons] } } },
          { name: 'icon', selector: { icon: {} } }
        ] }
      ] }];
    const head = k === 'full' || k === 'mfull' ? [...btn,
      { type: 'grid', name: '', schema: [{ name: 'browser_fullscreen', selector: { boolean: {} } }, { name: 'hash', selector: { text: {} } }] }
    ] : k === 'mbtn' ? [...btn, { name: 'hash', selector: { text: {} } }
    ] : k === 'popup' ? [...btn,
      { type: 'grid', name: '', schema: [{ name: 'popup_width', selector: { text: {} } }, { name: 'popup_height', selector: { text: {} } }] },
      { type: 'grid', name: '', schema: [
        { name: 'popup_position', selector: { select: { mode: 'dropdown', options: [{ value: 'center', label: T.center }, { value: 'bottom', label: T.bottom }] } } },
        { name: 'popup_radius', selector: { number: { min: 0, max: 48, mode: 'box', unit_of_measurement: 'px' } } }
      ] },
      { type: 'grid', name: '', schema: [{ name: 'popup_scale', selector: { boolean: {} } }, { name: 'aspect', selector: { text: {} } }] },
      { type: 'grid', name: '', schema: [{ name: 'popup_blur', selector: { boolean: {} } }, { name: 'hash', selector: { text: {} } }] }
    ] : k === 'scale' ? [{ name: 'aspect', selector: { text: {} } }] : [];
    const size = k === 'classic' ? [
      { type: 'grid', name: '', schema: [{ name: 'height', selector: { text: {} } }, { name: 'mobile_height', selector: { text: {} } }] },
      { type: 'grid', name: '', schema: [{ name: 'all_home', selector: { boolean: {} } }, { name: 'close', selector: { boolean: {} } }] }
    ] : k === 'mobile' ? [
      { type: 'grid', name: '', schema: [{ name: 'mobile_height', selector: { text: {} } }, { name: 'all_home', selector: { boolean: {} } }] }
    ] : [{ name: 'all_home', selector: { boolean: {} } }];
    return [...head,
      { name: 'areas', selector: { area: { multiple: true, entity: { domain: 'light' } } } },
      { name: 'exclude', selector: { entity: { multiple: true, filter: { domain: 'light' } } } },
      { type: 'grid', name: '', schema: [
        { name: 'kelvin', selector: { number: { min: 2000, max: 6500, step: 100, mode: 'box', unit_of_measurement: 'K' } } },
        { name: 'brightness', selector: { number: { min: 1, max: 100, mode: 'slider', unit_of_measurement: '%' } } }
      ] },
      { type: 'grid', name: '', schema: [
        { name: 'language', selector: { select: { mode: 'dropdown', options: [{ value: 'auto', label: T.auto }, { value: 'tr', label: 'Türkçe' }, { value: 'en', label: 'English' }] } } },
        { name: 'min_effects', selector: { number: { min: 1, max: 20, mode: 'box' } } }
      ] },
      ...size,
      { name: 'accent', selector: { text: {} } }
    ];
  }
  _r() {
    if (!this._h || !this._c) return;
    if (!this._f) {
      this.innerHTML = `<style>.lemur-x{margin-top:18px;font-size:14px;line-height:1.45}.lemur-x h4{margin:0 0 8px;font-size:15px}.lemur-x .n{color:var(--secondary-text-color)}.lemur-x .chips{display:flex;flex-wrap:wrap;gap:8px}.lemur-x button{display:inline-flex;gap:6px;align-items:center;border:1px solid var(--divider-color);background:var(--secondary-background-color);color:var(--primary-text-color);border-radius:999px;padding:6px 12px;font:inherit;font-size:13px;cursor:pointer}.lemur-x button b{color:var(--primary-color);font-weight:500}.lemur-x .info{margin:14px 0 0;padding:10px 12px;border-radius:10px;background:var(--secondary-background-color);color:var(--secondary-text-color);font-size:13px}</style><div class="lemur-f"></div><div class="lemur-x"></div>`;
      const f = document.createElement('ha-form');
      f.computeLabel = s => ED_TXT[this._l()][s.name] || s.name;
      f.addEventListener('value-changed', e => {
        const c = Object.assign({}, e.detail.value);
        Object.keys(c).forEach(k => { if (c[k] === '' || c[k] == null || (Array.isArray(c[k]) && !c[k].length)) delete c[k]; });
        this._c = c;
        this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: c }, bubbles: true, composed: true }));
      });
      this.querySelector('.lemur-f').appendChild(f); this._f = f;
    }
    this._f.hass = this._h;
    this._f.data = Object.assign({ kelvin: 3200, brightness: 40, language: 'auto', all_home: true, min_effects: 3, close: false }, ({ full: { style: 'row', browser_fullscreen: true, hash: 'isik-efektleri' }, mfull: { style: 'row', browser_fullscreen: true, hash: 'isik-mobil' }, mbtn: { style: 'row', hash: 'isik-telefon' }, popup: { style: 'row', hash: 'isik-pencere', popup_position: 'center', popup_scale: true, popup_blur: true, popup_radius: 24, aspect: '16/10' } })[this._kind()] || {}, this._c);
    this._f.schema = this._schema();
    this._extra();
  }
  _extra() {
    const x = this.querySelector('.lemur-x'); if (!x || !this._h) return;
    const T = ED_TXT[this._l()];
    x.innerHTML = `<div class="info">${esc(STORE.mode === 'local' ? T.local : T.shared)}</div>`;
  }

}
