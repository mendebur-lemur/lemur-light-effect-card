// ---- Ready-made cards: three launcher buttons (phone sheet, full screen, scalable pop-up) ----
// All three open our own layer over the Home Assistant UI; none of them needs browser_mod.
const PRE_TXT = {
  tr: { title: 'Lemur Işık Efekt Kartı', on: n => n + ' ışık açık', off: 'Tüm ışıklar kapalı', open: 'Aç', close: 'Kapat',
    card: ['Lemur Işık Efekt Kartı', 'Odalara göre ışıklar, efektler, beyaz tonlar ve renkler. Panoda doğrudan görünen kart.'],
    mobile: ['Lemur Işık Efekt Kartı · Telefon butonu', 'Dokununca telefona göre düzenlenmiş efekt ekranını açan buton.'],
    mfull: ['Lemur Işık Efekt Kartı · Telefon tam ekran butonu', 'Telefona göre düzenlenmiş efekt ekranı. Telefonda tarayıcıyla birlikte tam ekran açılır, geniş ekranda ortada telefon boyutunda pencere olur. browser_mod gerekmez.'],
    full: ['Lemur Işık Efekt Kartı · Tam ekran butonu', 'Dokununca bütün ekranı kaplayan efekt ekranını açan buton. Tablet ve telefon için. browser_mod gerekmez.'],
    popup: ['Lemur Işık Efekt Kartı · Pencere butonu', 'Dokununca boyutu ve konumu ayarlanabilen, içeriği pencereye göre ölçeklenen bir pencere açan buton.'],
    scale: ['Lemur Işık Efekt Kartı · Ölçeklenebilir', 'Geniş düzen; kutuyu büyütüp küçülttükçe orantılı ölçeklenir.'] },
  en: { title: 'Lemur Light Effect Card', on: n => n + (n === 1 ? ' light on' : ' lights on'), off: 'All lights off', open: 'Open', close: 'Close',
    card: ['Lemur Light Effect Card', 'Lights by room with effects, white tones and colors. The card itself, shown right on the dashboard.'],
    mobile: ['Lemur Light Effect Card · Phone button', 'A button that opens the effects screen laid out for phones.'],
    mfull: ['Lemur Light Effect Card · Phone full screen button', 'The effects screen laid out for phones. Opens full screen (browser included) on a phone, and as a phone-sized window on wider screens. No browser_mod needed.'],
    full: ['Lemur Light Effect Card · Full screen button', 'A button that opens the effects screen over the whole display. For tablets and phones. No browser_mod needed.'],
    popup: ['Lemur Light Effect Card · Window button', 'A button that opens a window you can size and place; its content scales to the window.'],
    scale: ['Lemur Light Effect Card · Scalable', 'Wide layout that scales with the size of its box.'] }
};
const preLang = h => {
  let x = h && ((h.locale && h.locale.language) || h.language);
  if (!x) try { x = JSON.parse(localStorage.getItem('selectedLanguage') || 'null'); } catch (e) {}
  x = x || document.documentElement.lang || navigator.language || 'en';
  return pickLang(x);
};
const LAUNCH_KEYS = ['type', 'name', 'subtitle', 'browser_fullscreen', 'hash', 'aspect', 'view_layout', 'grid_options', 'layout_options', 'visibility',
  'popup_width', 'popup_height', 'popup_position', 'popup_scale', 'popup_blur', 'popup_radius', 'button_style', 'style', 'icon', 'color_icon', 'color'];
const innerCfg = (c, extra) => { const o = {}; Object.keys(c || {}).forEach(k => { if (!LAUNCH_KEYS.includes(k)) o[k] = c[k]; }); return Object.assign(o, extra); };
const cssLen = (v, d) => { const s = String(v == null ? '' : v).trim(); if (!s) return d; if (/^\d+(\.\d+)?$/.test(s)) return s + 'px'; return /^[\d.]+(px|vw|vh|dvh|svh|%|rem|em)$/.test(s) ? s : d; };
const ratio = (v, d) => { const m = String(v || '').trim().match(/^(\d+(?:\.\d+)?)\s*[/:x]\s*(\d+(?:\.\d+)?)$/); return m && +m[2] ? +m[1] / +m[2] : d; };
// phone-sized screen (layout viewport can be wider than the device on pages without a viewport tag)
const narrow = () => Math.min(innerWidth, (window.screen && screen.width) || innerWidth) < 640;
const reducedMotion = () => { try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } };

// Scaled stage: renders the wide card on a virtual stage and scales it to its box (used by the window button and the inline scalable card)
function mountStage(box, cfg, aspect) {
  const stage = document.createElement('div'); stage.className = 'stage';
  stage.style.cssText = 'position:absolute;left:0;top:0;transform-origin:0 0';
  const card = document.createElement('lemur-light-effect-card');
  card.style.cssText = 'display:block;height:100%';
  stage.appendChild(card); box.appendChild(stage);
  const W0 = 1280, H0 = Math.round(1280 / (aspect || 1.6));
  const fit = () => {
    const W = box.clientWidth, H = box.clientHeight; if (!W || !H) return;
    const s = Math.min(W / W0, H / H0);
    Object.assign(stage.style, { width: W / s + 'px', height: H / s + 'px', transform: `scale(${s})` });
  };
  const ro = new ResizeObserver(fit); ro.observe(box);
  card.setConfig(cfg);
  return { card, fit, stop: () => ro.disconnect() };
}

// One overlay at a time, shared by all launchers
let LEMUR_OV = null;
const ICON_BTN = {
  mobile: '<path d="M8 2.5h8a2 2 0 0 1 2 2v15a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-15a2 2 0 0 1 2-2z"/><path d="M11 18.5h2"/>',
  full: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
  mfull: '<path d="M9 3.5h6a1.8 1.8 0 0 1 1.8 1.8v13.4a1.8 1.8 0 0 1-1.8 1.8H9a1.8 1.8 0 0 1-1.8-1.8V5.3A1.8 1.8 0 0 1 9 3.5z"/><path d="M2.5 7V3.5H5M21.5 7V3.5H19M2.5 17v3.5H5M21.5 17v3.5H19"/>',
  popup: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3 9h18M6.5 7h.01M9 7h.01"/>'
};

// button colour: a Home Assistant colour name (red, primary, ...) or any CSS colour
// button colour from the card config: an HA colour name, or a plain CSS colour (#hex, rgb(), hsl()); anything else is ignored
const uiColor = v => { const s = String(v || '').trim(); if (!s) return ''; if (/^[a-z-]{1,30}$/.test(s)) return !/^(white|black|transparent)$/.test(s) ? `var(--${s}-color, ${s})` : s; return /^(#[0-9a-f]{3,8}|(rgb|rgba|hsl|hsla)\([\d\s.,%]{1,40}\))$/i.test(s) ? s : ''; };
const BTN_STYLES = ['row', 'tile', 'icon'];
class LemurLauncher extends HTMLElement {
  static get mode() { return 'full'; }
  static getConfigElement() { return document.createElement('lemur-light-effect-card-editor'); }
  static getStubConfig() { return {}; }
  getCardSize() { return 2; }
  getGridOptions() {
    const st = this._style();
    return st === 'icon' ? { columns: 3, rows: 2, min_rows: 1, min_columns: 2 } : st === 'tile' ? { columns: 4, rows: 2, min_rows: 2, min_columns: 3 } : { columns: 12, rows: 2, min_rows: 1, min_columns: 4 };
  }
  _style() { const v = this._cfg && this._cfg.style; return BTN_STYLES.includes(v) ? v : 'row'; }
  get _mode() { return this.constructor.mode; }
  constructor() { super(); this._nav = () => this._hashCheck(); }
  connectedCallback() { ['location-changed', 'popstate', 'hashchange'].forEach(e => window.addEventListener(e, this._nav)); this._ic = this._ic || (() => this._draw()); window.addEventListener('lemur-icons', this._ic); setTimeout(this._nav, 0); }
  disconnectedCallback() { ['location-changed', 'popstate', 'hashchange'].forEach(e => window.removeEventListener(e, this._nav)); window.removeEventListener('lemur-icons', this._ic); }
  setConfig(c) {
    this._cfg = Object.assign({}, c || {});
    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.addEventListener('click', () => this.open(false));
    }
    this._sig = null; this._draw();
  }
  set hass(h) {
    this._hass = h; STORE.attach(h);
    if (LEMUR_OV && LEMUR_OV.owner === this) LEMUR_OV.card.hass = h;
    this._draw();
  }
  _defHash() { return { mobile: 'isik-telefon', mfull: 'isik-mobil', full: 'isik-efektleri', popup: 'isik-pencere' }[this._mode]; }
  _hash() { return String(this._cfg.hash == null ? this._defHash() : this._cfg.hash).replace(/^#/, '').trim(); }
  _hashCheck() {
    const x = this._hash(); if (!x) return;
    if (location.hash === '#' + x) { if (!LEMUR_OV) this.open(true); }
    else if (LEMUR_OV && LEMUR_OV.owner === this && LEMUR_OV.byHash) this.close(true);
  }
  _draw() {
    const R = this.shadowRoot; if (!R) return;
    const H = this._hass, T = PRE_TXT[preLang(H)], c = this._cfg;
    const n = H ? lightPool(H).filter(id => (H.states[id] || {}).state === 'on').length : 0;
    const title = c.name || T.title, sub = c.subtitle != null && c.subtitle !== '' ? c.subtitle : H ? (n ? T.on(n) : T.off) : '';
    const st = this._style(), col = uiColor(c.color), ck = String(c.color_icon || '').replace(/^c:/, '');
    const art = ck && ICON3[ck] ? ICON3[ck] : '', mdi = !art && /^[a-z]+:[\w-]+$/.test(String(c.icon || '')) ? c.icon : '';
    const sig = [title, sub, st, col, ck, mdi, ICON3_OK].join('|'); if (sig === this._sig) return; this._sig = sig;
    const glow = col ? `color-mix(in srgb, ${col} 26%, transparent)` : 'rgba(240,169,59,.18)';
    const tileBg = art ? 'rgba(255,255,255,.06)' : col ? `linear-gradient(145deg, color-mix(in srgb, ${col} 80%, white), ${col})` : tile([30, 320, 260]);
    const ico = art || (mdi ? `<ha-icon icon="${esc(mdi)}"></ha-icon>` : svg('sparkle'));
    R.innerHTML = `<style>:host{display:block;height:100%}
      button{all:unset;box-sizing:border-box;display:flex;align-items:center;gap:14px;width:100%;height:100%;min-height:64px;padding:10px 14px;border-radius:var(--ha-card-border-radius,18px);background:var(--lemur-bg,#131416);color:#ECEDEF;cursor:pointer;font-family:inherit;-webkit-tap-highlight-color:transparent;position:relative;overflow:hidden;transition:transform .12s}
      button:active{transform:scale(.98)}
      button:focus-visible{outline:2px solid #F0A93B;outline-offset:2px}
      button::before{content:"";position:absolute;inset:0;background:radial-gradient(60% 120% at 0% 50%,${glow},transparent 70%);pointer-events:none}
      .t{width:44px;height:44px;flex:none;border-radius:30%;display:grid;place-items:center;color:#fff;background:${tileBg};--mdc-icon-size:26px}
      .t svg{width:58%;height:58%}
      .t svg.dz{width:92%;height:92%}
      .t.c{border-radius:50%}
      .tx{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}
      b{font-weight:600;font-size:15px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      small{font-size:12.5px;color:#9BA0A8;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .fs{flex:none;width:34px;height:34px;border-radius:50%;display:grid;place-items:center;background:rgba(255,255,255,.07);color:#C9CCD1}
      .fs svg{width:18px;height:18px}
      button.tile{flex-direction:column;justify-content:center;gap:8px;padding:14px 10px;text-align:center;min-height:120px}
      button.tile::before{background:radial-gradient(90% 70% at 50% 0%,${glow},transparent 75%)}
      button.tile .t{width:58px;height:58px;--mdc-icon-size:32px}
      button.tile .tx{flex:none;width:100%;align-items:center}
      button.tile .fs{position:absolute;top:8px;right:8px;width:28px;height:28px}
      button.tile .fs svg{width:15px;height:15px}
      button.icon{justify-content:center;padding:8px;min-height:64px}
      button.icon::before{background:radial-gradient(70% 70% at 50% 50%,${glow},transparent 75%)}
      button.icon .t{width:min(64px,80%);height:auto;aspect-ratio:1;--mdc-icon-size:34px}
      button.icon .tx,button.icon .fs{display:none}
      @media (prefers-reduced-motion:reduce){button{transition:none}}</style>
      <button class="${st}" aria-label="${esc(title + ' · ' + T.open)}" title="${esc(st === 'icon' ? title : '')}"><i class="t ${art ? 'c' : ''}">${ico}</i><span class="tx"><b>${esc(title)}</b><small>${esc(sub)}</small></span><span class="fs"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${ICON_BTN[this._mode]}</svg></span></button>`;
  }
  // builds the layer for each mode; returns { ov, card, stop? }
  _build() {
    const c = this._cfg, mode = this._mode, anim = !reducedMotion();
    const ov = document.createElement('div');
    ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true');
    ov.style.cssText = 'position:fixed;inset:0;z-index:2147483000;display:flex;overscroll-behavior:contain;-webkit-tap-highlight-color:transparent';
    if (mode === 'full') {
      ov.style.cssText += ';flex-direction:column;background:#0B0C0F;--lemur-radius:0';
      const card = document.createElement('lemur-light-effect-card');
      card.style.cssText = 'display:block;flex:1;min-height:0;height:100%';
      card.setConfig(innerCfg(c, { close: true, close_hash: false, safe_area: true, height: '100%', mobile_height: '100%' }));
      ov.appendChild(card);
      return { ov, card };
    }
    const blur = c.popup_blur === false ? '' : 'backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);';
    const back = document.createElement('div');
    back.style.cssText = `position:absolute;inset:0;background:rgba(0,0,0,.55);${blur}${anim ? 'animation:lemurFade .2s ease-out' : ''}`;
    back.addEventListener('click', () => this.close(false));
    const box = document.createElement('div');
    const sty = document.createElement('style');
    sty.textContent = '@keyframes lemurFade{from{opacity:0}}@keyframes lemurUp{from{transform:translateY(40px);opacity:0}}@keyframes lemurPop{from{transform:scale(.96);opacity:0}}';
    ov.append(sty, back, box);
    if (mode === 'mobile' || mode === 'mfull') {
      // phones: full-height sheet (mfull: also browser full screen); wider screens: a phone-sized panel in the middle
      const wide = !narrow();
      ov.style.cssText += ';align-items:' + (wide ? 'center' : 'stretch') + ';justify-content:center';
      box.style.cssText = `position:relative;display:flex;flex-direction:column;background:#0B0C0F;overflow:hidden;box-shadow:0 30px 80px rgba(0,0,0,.6);${anim ? 'animation:lemurUp .24s cubic-bezier(.2,.8,.2,1)' : ''};` +
        (wide ? 'width:min(440px,100vw);height:min(900px,94vh);border-radius:28px' : 'width:100%;height:100%;box-sizing:border-box;--lemur-radius:0');
      const card = document.createElement('lemur-light-effect-card');
      card.style.cssText = 'display:block;flex:1;min-height:0;height:100%';
      card.setConfig(innerCfg(c, { mobile: true, close: true, close_hash: false, safe_area: !wide, height: '100%', mobile_height: '100%' }));
      box.appendChild(card);
      return { ov, card };
    }
    // popup: size, position and scaling come from the card settings
    const pos = c.popup_position === 'bottom' ? 'bottom' : 'center';
    ov.style.cssText += ';align-items:' + (pos === 'bottom' ? 'flex-end' : 'center') + ';justify-content:center';
    const w = cssLen(c.popup_width, 'min(1280px,94vw)'), h = cssLen(c.popup_height, 'min(800px,88vh)'), r = c.popup_radius == null || c.popup_radius === '' ? 24 : Math.max(0, +c.popup_radius || 0);
    box.style.cssText = `position:relative;width:${w};height:${h};max-width:100vw;max-height:100dvh;border-radius:${pos === 'bottom' ? `${r}px ${r}px 0 0` : r + 'px'};overflow:hidden;background:#0B0C0F;box-shadow:0 30px 80px rgba(0,0,0,.6);margin-bottom:${pos === 'bottom' ? 'env(safe-area-inset-bottom,0px)' : '0'};${anim ? (pos === 'bottom' ? 'animation:lemurUp .24s cubic-bezier(.2,.8,.2,1)' : 'animation:lemurPop .2s ease-out') : ''}`;
    if (c.popup_scale === false) {
      const card = document.createElement('lemur-light-effect-card');
      card.style.cssText = 'display:block;height:100%';
      card.setConfig(innerCfg(c, { close: true, close_hash: false, height: '100%', mobile_height: '100%' }));
      box.appendChild(card);
      return { ov, card };
    }
    const st = mountStage(box, innerCfg(c, { mobile: false, close: true, close_hash: false, height: '100%' }), ratio(c.aspect, 1.6));
    return { ov, card: st.card, stop: st.stop, fit: st.fit };
  }
  open(byHash) {
    if (LEMUR_OV || !this._hass) return;
    const b = this._build();
    b.card._onClose = () => this.close(false);
    b.card.hass = this._hass;
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    document.body.appendChild(b.ov);
    if (b.fit) requestAnimationFrame(b.fit);
    const st = { owner: this, ov: b.ov, card: b.card, stop: b.stop, byHash: !!byHash, prevOverflow, pushed: false, fs: false };
    st.key = e => { if (e.key === 'Escape') { e.stopPropagation(); this.close(false); } };
    st.pop = () => { if (LEMUR_OV === st && !st.byHash) this.close(true); };
    st.fsc = () => { const fe = document.fullscreenElement || document.webkitFullscreenElement; if (st.fs && !fe) this.close(false); };
    window.addEventListener('keydown', st.key, true);
    if (!byHash) { history.pushState(Object.assign({}, history.state, { lemurOv: 1 }), ''); st.pushed = true; window.addEventListener('popstate', st.pop); }
    document.addEventListener('fullscreenchange', st.fsc); document.addEventListener('webkitfullscreenchange', st.fsc);
    LEMUR_OV = st;
    if ((this._mode === 'full' || (this._mode === 'mfull' && narrow())) && this._cfg.browser_fullscreen !== false) {
      try {
        const rq = b.ov.requestFullscreen || b.ov.webkitRequestFullscreen;
        const p = rq && rq.call(b.ov, { navigationUI: 'hide' });
        if (p && p.then) p.then(() => { st.fs = true; }).catch(() => {}); else if (rq) st.fs = true;
      } catch (e) {}
    }
  }
  close(fromNav) {
    const st = LEMUR_OV; if (!st) return; LEMUR_OV = null;
    window.removeEventListener('keydown', st.key, true); window.removeEventListener('popstate', st.pop);
    document.removeEventListener('fullscreenchange', st.fsc); document.removeEventListener('webkitfullscreenchange', st.fsc);
    try { const fe = document.fullscreenElement || document.webkitFullscreenElement; if (fe === st.ov) (document.exitFullscreen || document.webkitExitFullscreen).call(document); } catch (e) {}
    if (st.stop) st.stop();
    st.ov.remove();
    document.documentElement.style.overflow = st.prevOverflow;
    if (fromNav) return;
    if (st.byHash) { history.replaceState(history.state, '', location.href.split('#')[0]); window.dispatchEvent(new Event('location-changed')); }
    else if (st.pushed && history.state && history.state.lemurOv) history.back();
  }
}
// 1) phone sheet  2) full screen  3) scalable window
class LemurPhoneButton extends LemurLauncher { static get mode() { return 'mobile'; } }
class LemurPhoneFullButton extends LemurLauncher { static get mode() { return 'mfull'; } }
class LemurFullscreenButton extends LemurLauncher { static get mode() { return 'full'; } }
class LemurWindowButton extends LemurLauncher { static get mode() { return 'popup'; } }

