// Home Assistant's service worker keeps a copy of every page it served. A copy made before an update still
// points at the old card file, which the browser also keeps, so the old card can come back after an update.
// Drop those copies (and the old files) so the next load gets this version. If an older card got here first
// on this page, reload once so the new one takes over.
(() => {
  const V = '__VERSION__';
  const older = !!customElements.get('lemur-light-effect-card') && window.__LEMUR_CARD_VER !== V;
  const heal = async () => {
    if (!window.caches) return 0;
    let n = 0;
    for (const k of await caches.keys()) {
      const c = await caches.open(k);
      for (const r of await c.keys()) {
        const u = r.url;
        if (/\/lemur_light_effects\/lemur-(light-effect-card\.js|icons\.json)\?v=/.test(u)) { if (!u.includes('v=' + V)) { await c.delete(r); n++; } continue; }
        let p; try { p = new URL(u).pathname; } catch (e) { continue; }
        if (/\.[a-z0-9]{1,5}$/i.test(p)) continue; // pages only
        const res = await c.match(r); if (!res) continue;
        const m = (await res.clone().text()).match(/lemur-light-effect-card\.js\?v=([0-9.]+)/);
        if (m && m[1] !== V) { await c.delete(r); n++; }
      }
    }
    return n;
  };
  window.__LEMUR_HEAL = () => heal().catch(() => 0);
  const run = () => window.__LEMUR_HEAL().then(() => {
    if (!older) return;
    try { const f = 'lemur-heal-' + V; if (!sessionStorage.getItem(f)) { sessionStorage.setItem(f, '1'); location.reload(); } } catch (e) {}
  });
  // once a version has cleaned up on this browser, later page loads skip the scan (it reads every cached page)
  let done = false; try { done = localStorage.getItem('lemur-healed') === V; } catch (e) {}
  if (older) run(); else if (!done) setTimeout(() => run().then(() => { try { localStorage.setItem('lemur-healed', V); } catch (e) {} }), 8000);
})();
