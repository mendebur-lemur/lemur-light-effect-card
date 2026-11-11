/*! Lemur Light Effect Card loader v1.8.3 | GPL-3.0 */
// The small file Home Assistant loads on every page (v1.8.1). A copy is also kept in config/www as a dashboard
// resource (v1.8.2, resources.py), so it may run from two addresses: the second one does nothing. It loads the card file and, when that fails, tries again.
//
// Why: Home Assistant imports an integration's file once. If that one download fails (slow network, a tablet waking up,
// right after a restart) the cards stay as "Custom element doesn't exist" and the panel stays empty until the user
// reloads the page. A browser also remembers a failed module address for the life of the page, so a later try has to
// use another address (&r=1, &r=2 ...).
//
// What it does:
// - loads the card file; a failed download is tried again 3 times (after 1.5, 3 and 4.5 s). That is one round.
// - later rounds start by themselves 10, 20 and then every 30 s after a failed round (6 rounds by timer, about 3
//   minutes: long enough for a Home Assistant that is still starting, v1.8.2), and when the network comes back, the
//   tab is shown again or the page changes (never more often than one such round per 20 s). 10 rounds, 40 requests
//   in all, then it stops.
// - once the card file is there Home Assistant replaces its error cards by itself. Only when the file came late or
//   needed another try, this file looks for error cards of our own cards that are still shown and asks Home Assistant
//   to build them again (the public "ll-rebuild" event), at most 3 times. It never reloads the page (the rule since
//   v1.6.6: the card does not reload the page on its own) and uses no private Home Assistant function.
// - a page that loaded normally is not touched: nothing is scanned and nothing is rebuilt.
(function () {
  var W = window;
  if (W.__LEMUR_LEC_LOADER) return;   // the spare copy of this file: the first one is already at work
  var MAIN = '/lemur_light_effects/lemur-light-effect-card.js?v=1.8.3';
  var TAG = 'lemur-light-effect-card';
  var OURS = { 'lemur-light-effect-card': 1, 'lemur-phone-button': 1, 'lemur-phone-fullscreen-button': 1, 'lemur-fullscreen-button': 1, 'lemur-window-button': 1 };
  var TRIES = 3, WAIT = 1500, TIMER_ROUNDS = 6, ALL_ROUNDS = 10, ROUND_GAP = 20000, AGAIN = [10000, 20000, 30000], LATE = 1500, HEALS = 3;
  var st = W.__LEMUR_LEC_LOADER = { t0: Date.now(), requests: 0, fails: 0, rounds: 0, heals: 0, late: false, loading: null, lastRound: 0, done: false };

  function ready() { try { return !!W.customElements.get(TAG); } catch (e) { return false; } }

  function round() {
    if (ready()) return Promise.resolve();
    if (st.loading) return st.loading;
    st.rounds += 1; st.lastRound = Date.now();
    st.loading = new Promise(function (resolve, reject) {
      var n = 0;
      function attempt() {
        if (ready()) { resolve(); return; }
        var s = document.createElement('script');
        // as a module, the way Home Assistant loaded it before; an old browser without modules gets a classic script
        if ('noModule' in HTMLScriptElement.prototype) s.type = 'module'; else s.charset = 'utf-8';
        s.src = MAIN + (st.requests ? '&r=' + st.requests : '');
        st.requests += 1;
        s.async = true;
        s.onload = function () { if (ready()) resolve(); else again(s); };
        s.onerror = function () { again(s); };
        document.head.appendChild(s);
      }
      function again(s) {
        st.fails += 1; n += 1;
        try { s.remove(); } catch (e) { /* old browser */ }
        if (n > TRIES) { reject(new Error('Lemur Light Effect Card could not be downloaded')); return; }
        setTimeout(attempt, WAIT * n);
      }
      attempt();
    });
    st.loading.then(function () { st.loading = null; loaded(); }, function (e) {
      st.loading = null;
      try { console.warn('LEMUR', e && e.message); } catch (x) { /* no console */ }
      if (st.rounds < TIMER_ROUNDS) setTimeout(function () { more(true); }, AGAIN[Math.min(st.rounds - 1, AGAIN.length - 1)]);
    });
    return st.loading;
  }

  // another round: by the timer (the first few) or because something changed (network back, tab shown, page changed)
  function more(timer) {
    if (ready() || st.loading) return;
    if (st.rounds >= (timer ? TIMER_ROUNDS : ALL_ROUNDS)) return;
    if (!timer && Date.now() - st.lastRound < ROUND_GAP) return;
    round();
  }

  // ---- error cards of our own cards that stayed on the page ----
  function message(el) {
    try {
      var c = el._config || el.config;
      if (c && typeof c.message === 'string') return c.message;
      if (c && typeof c.error === 'string') return c.error;
      return String((el.shadowRoot && el.shadowRoot.textContent) || el.textContent || '');
    } catch (e) { return ''; }
  }
  function ourError(el) {
    var m = /Custom element doesn't exist: ([a-z0-9-]+)/.exec(message(el));
    return !!(m && OURS[m[1]]);
  }
  function stuck() {
    var out = [], seen = 0;
    function walk(root) {
      if (!root || seen > 30000) return;
      var all = root.querySelectorAll('*');
      for (var i = 0; i < all.length; i++) {
        var el = all[i]; seen += 1;
        if (el.localName === 'hui-error-card' && ourError(el)) out.push(el);
        if (el.shadowRoot) walk(el.shadowRoot);
      }
    }
    try { var ha = document.querySelector('home-assistant'); walk(ha && ha.shadowRoot); } catch (e) { /* page not ready */ }
    return out;
  }
  function heal() {
    if (!ready() || !st.late || st.done) return;
    var cards = stuck();
    if (!cards.length) return;
    if (st.heals >= HEALS) { st.done = true; return; }
    st.heals += 1;
    for (var i = 0; i < cards.length; i++) {
      try { cards[i].dispatchEvent(new CustomEvent('ll-rebuild', { bubbles: true, composed: true, detail: {} })); } catch (e) { /* next one */ }
    }
  }
  function loaded() {
    // Home Assistant shows its error card about 2 s after it asked for a card: only a late file can leave one behind
    st.late = st.fails > 0 || Date.now() - st.t0 > LATE;
    if (!st.late) return;
    [2500, 6000, 12000, 20000].forEach(function (ms) { setTimeout(heal, ms); });
  }

  W.addEventListener('online', function () { more(false); });
  W.addEventListener('location-changed', function () { more(false); if (st.late) setTimeout(heal, 2500); });
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'visible') more(false); });
  round().catch(function () { /* said in the console; later rounds follow */ });
})();
