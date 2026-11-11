// The loader (src/loader.js): a failed download of the card file is tried again, a healthy page is left alone,
// and every kind of retry stops after a fixed number of tries.  Run: node --test tests/
const test = require('node:test'); const assert = require('node:assert'); const fs = require('fs'); const path = require('path'); const vm = require('vm');
const SRC = fs.readFileSync(path.join(__dirname, '..', 'src', 'loader.js'), 'utf8').replace(/__VERSION__/g, '9.9.9');

// a tiny page: timers run by hand, every <script> added to <head> is answered by `answer(url, nth)`
function page(answer, opt) {
  opt = opt || {};
  let now = 1000; const timers = []; const scripts = []; const defined = {}; const listeners = { window: {}, document: {} };
  const errorCards = opt.errorCards || [];           // what the page shows as error cards
  const rebuilt = [];
  const mkCard = (tag) => ({ localName: 'hui-error-card', _config: { type: 'error', message: "Custom element doesn't exist: " + tag + '.' }, shadowRoot: null,
    dispatchEvent(ev) { rebuilt.push(tag + ':' + ev.type); if (opt.rebuildWorks) errorCards.splice(errorCards.indexOf(this), 1); return true; } });
  errorCards.forEach((t, i) => { errorCards[i] = mkCard(t); });
  const haRoot = { querySelectorAll: () => errorCards.slice() };
  const document = { visibilityState: 'visible',
    createElement: () => ({ remove() {} }),
    head: { appendChild(s) { scripts.push(s.src); const ok = answer(s.src, scripts.length);
      Promise.resolve().then(() => { if (ok === 'define') defined['lemur-light-effect-card'] = 1; if (ok) s.onload(); else s.onerror(); }); } },
    querySelector: (q) => (q === 'home-assistant' ? { shadowRoot: haRoot } : null),
    addEventListener: (n, f) => { (listeners.document[n] = listeners.document[n] || []).push(f); } };
  const window = { customElements: { get: (n) => defined[n] }, addEventListener: (n, f) => { (listeners.window[n] = listeners.window[n] || []).push(f); },
    location: { reload() { window.reloads = (window.reloads || 0) + 1; } }, reloads: 0 };
  const ctx = { window, document, console: { warn() {} }, HTMLScriptElement: function () {}, CustomEvent: function (type, init) { this.type = type; Object.assign(this, init); },
    setTimeout: (f, ms) => { timers.push({ at: now + ms, f }); }, Date: { now: () => now }, Promise, Error, String, RegExp };
  ctx.HTMLScriptElement.prototype = { noModule: true };
  vm.createContext(ctx); vm.runInContext(SRC, ctx);
  const flush = async () => { for (let i = 0; i < 20; i++) await Promise.resolve(); };
  const run = async (ms) => { const end = now + ms; await flush();
    for (;;) { const due = timers.filter(t => t.at <= end).sort((a, b) => a.at - b.at)[0]; if (!due) break; timers.splice(timers.indexOf(due), 1); now = due.at; due.f(); await flush(); }
    now = end; };
  const fire = async (where, name) => { (listeners[where][name] || []).forEach(f => f()); await flush(); };
  return { scripts, run, fire, st: () => window.__LEMUR_LEC_LOADER, rebuilt, window, document, errorCards, rerun: () => vm.runInContext(SRC, ctx) };
}

test('a healthy page: one request for the plain address, nothing scanned, nothing rebuilt', async () => {
  const p = page(() => 'define', { errorCards: ['lemur-light-effect-card'] });   // even if an error card were there, a healthy load does not look
  await p.run(120000);
  assert.deepStrictEqual(p.scripts, ['/lemur_light_effects/lemur-light-effect-card.js?v=9.9.9']);
  assert.strictEqual(p.st().late, false); assert.strictEqual(p.st().heals, 0); assert.deepStrictEqual(p.rebuilt, []); assert.strictEqual(p.window.reloads, 0);
});

test('a failed download is tried again with another address and then stops asking', async () => {
  const p = page((url, n) => (n >= 3 ? 'define' : false));
  await p.run(120000);
  assert.deepStrictEqual(p.scripts.map(u => u.split('?v=9.9.9')[1]), ['', '&r=1', '&r=2']);
  assert.strictEqual(p.st().fails, 2);
  await p.fire('window', 'online'); await p.fire('window', 'location-changed'); await p.run(600000);
  assert.strictEqual(p.scripts.length, 3);
});

test('error cards of our cards that stayed after a late file are rebuilt; cards of others are not touched', async () => {
  const p = page((url, n) => (n >= 2 ? 'define' : false), { errorCards: ['lemur-phone-button', 'some-other-card', 'lemur-unknown-thing'], rebuildWorks: true });
  await p.run(60000);
  assert.deepStrictEqual(p.rebuilt, ['lemur-phone-button:ll-rebuild']);
  assert.strictEqual(p.st().heals, 1); assert.strictEqual(p.errorCards.length, 2); assert.strictEqual(p.window.reloads, 0);
});

test('error cards that do not go away: three rebuilds at most, and the page is never reloaded', async () => {
  const p = page((url, n) => (n >= 2 ? 'define' : false), { errorCards: ['lemur-light-effect-card'] });
  await p.run(60000);
  for (let i = 0; i < 20; i++) { await p.fire('window', 'location-changed'); await p.run(5000); }
  assert.strictEqual(p.rebuilt.length, 3); assert.strictEqual(p.st().heals, 3); assert.strictEqual(p.window.reloads, 0);
});

test('a file that never comes: a fixed number of requests, also with network and page events', async () => {
  const p = page(() => false);
  await p.run(10 * 60000);
  assert.strictEqual(p.scripts.length, 12);                       // 3 rounds by timer, 4 requests each
  for (let i = 0; i < 100; i++) { await p.fire('window', 'online'); await p.fire('document', 'visibilitychange'); await p.fire('window', 'location-changed'); await p.run(30000); }
  assert.strictEqual(p.scripts.length, 40);                       // 10 rounds in all
  assert.strictEqual(p.st().rounds, 10); assert.strictEqual(p.window.reloads, 0);
  assert.strictEqual(new Set(p.scripts).size, p.scripts.length);  // a browser never asks twice for a failed module address
});

test('the spare copy of the loader does nothing when the first one is at work', async () => {
  const p = page(() => 'define'); await p.run(1000); const st = p.st();
  p.rerun(); await p.run(60000);
  assert.strictEqual(p.st(), st); assert.strictEqual(p.scripts.length, 1);
});

test('the built loader is the source with the version filled in', () => {
  const ver = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'custom_components', 'lemur_light_effects', 'manifest.json'), 'utf8')).version;
  const built = fs.readFileSync(path.join(__dirname, '..', 'custom_components', 'lemur_light_effects', 'frontend', 'lemur-light-effect-loader.js'), 'utf8');
  assert.strictEqual(built, fs.readFileSync(path.join(__dirname, '..', 'src', 'loader.js'), 'utf8').replace(/__VERSION__/g, ver));
});
