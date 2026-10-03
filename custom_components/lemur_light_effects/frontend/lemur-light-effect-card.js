/*! Lemur Light Effect Card v1.5.0 | MIT */
(() => {
// Home Assistant's service worker keeps a copy of every page it served. A copy made before an update still
// points at the old card file, which the browser also keeps, so the old card can come back after an update.
// Drop those copies (and the old files) so the next load gets this version. If an older card got here first
// on this page, reload once so the new one takes over.
(() => {
  const V = '1.5.0';
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
  if (older) run(); else setTimeout(run, 8000);
})();

if (customElements.get('lemur-light-effect-card')) return;
const CSS = ":host{display:block}\n*{box-sizing:border-box}\nbutton{font-family:inherit}\nha-icon{--mdc-icon-size:100%;display:inline-flex;width:24px;height:24px;flex:none}\n.wrap{position:relative;display:flex;flex-direction:column;height:var(--lemur-height,80vh);min-height:var(--lemur-min,380px);background:var(--lemur-bg,#0B0C0F);border-radius:var(--lemur-radius,var(--ha-card-border-radius,26px));overflow:hidden;isolation:isolate;color:var(--tx);font-family:var(--lemur-font,inherit);\n--tx:#ECEDEF;--tx2:#C9CCD1;--acc:var(--lemur-accent,#F0A93B);--acc-tx:#1A1105;--card2:#1E2024;--btn:#2A2D33;--deep:#0C0D0F;--line:rgba(255,255,255,.06);--mut:#8A8F96;--sh:0 8px 24px rgba(0,0,0,.55);\n--glass:rgba(255,255,255,.06);--glass-b:rgba(255,255,255,.12);--well:rgba(0,0,0,.28)}\n.empty-card{height:auto;min-height:0;padding:24px}\n.empty{color:var(--mut);padding:24px 4px;grid-column:1/-1;line-height:1.45}\n.glow{position:absolute;inset:-10%;filter:blur(80px);opacity:.6;z-index:0;pointer-events:none;transition:opacity .4s;-webkit-mask:radial-gradient(ellipse 90% 90% at 60% 40%,#000 0,transparent 80%);mask:radial-gradient(ellipse 90% 90% at 60% 40%,#000 0,transparent 80%)}\n.glow.soft{opacity:.2}\n.wrap>.top,.wrap>.mid,.wrap>.cbar{position:relative;z-index:1}\n.top{display:grid;grid-template-columns:1fr auto;gap:12px;padding:16px 16px 12px;align-items:stretch;flex:none}\n.rooms{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:10px;background:var(--glass);border:1px solid var(--glass-b);border-radius:22px;padding:10px}\n.room{display:flex;align-items:center;justify-content:center;gap:10px;background:var(--well);border:0;color:var(--tx);border-radius:14px;padding:clamp(12px,1.6vh,18px) 10px;font-size:clamp(15px,1.35vw,20px);font-weight:600;cursor:pointer;min-width:0;-webkit-tap-highlight-color:transparent}\n.room span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n.room svg,.room ha-icon{width:clamp(22px,2vw,30px);height:clamp(22px,2vw,30px);flex:none;color:var(--acc)}\n.room.on{background:var(--acc);color:var(--acc-tx)}.room.on svg,.room.on ha-icon{color:var(--acc-tx)}\n.x{height:100%;aspect-ratio:1/1;min-width:44px;border-radius:22px;background:var(--glass);border:1px solid var(--glass-b);color:var(--mut);font-size:17px;cursor:pointer;flex:none}\n.mid{flex:1 1 auto;min-height:0;display:flex;gap:12px;padding:0 16px}\n.pn{background:var(--glass);border:1px solid var(--glass-b);border-radius:22px;padding:12px;display:flex;flex-direction:column;gap:10px;min-height:0;min-width:0}\n.pn.cp{width:clamp(220px,19vw,300px);flex:none}\n.pn.fxp{flex:1 1 auto}\n.crail{display:flex;flex-direction:column;gap:6px;flex:1;min-height:0;overflow-y:auto;scrollbar-width:none}.crail::-webkit-scrollbar{display:none}\n.ct{display:flex;align-items:center;justify-content:center;gap:6px;background:var(--card2);border:2px solid transparent;border-radius:16px;color:var(--tx2);cursor:pointer;font-size:13px;font-weight:500;text-align:center;line-height:1.15;-webkit-tap-highlight-color:transparent}\n.crail .ct{flex:1 1 0;min-height:44px;flex-direction:row;justify-content:flex-start;gap:clamp(12px,1.2vw,18px);padding:0 12px;font-size:clamp(14px,1.2vw,17px);border-radius:14px;text-align:left;background:var(--well);border-width:1.5px}\n.crail .ct span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n.ct.on{border-color:var(--acc);background:rgba(240,169,59,.14);color:var(--tx);font-weight:600}\n.ti{border-radius:50%;background:var(--btn);display:grid;place-items:center;color:var(--acc);font-style:normal;flex:none}\n.ti svg{width:58%;height:58%}\n.scroll{flex:1 1 auto;min-height:0;overflow-y:auto;padding:0 2px 2px 0;scrollbar-width:thin;touch-action:pan-y}\n.sub,.sec{margin:8px 0 6px;padding:0 2px;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:var(--mut)}\n.sub{font-size:13px;font-weight:600;color:var(--tx);letter-spacing:.02em;text-transform:none;margin-top:16px}.sub em{font-style:normal;font-weight:400;color:var(--mut);margin-left:8px}\n.scroll>.sub:first-child{margin-top:0}\n.bgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(clamp(132px,11.5vw,210px),1fr));gap:clamp(10px,1vw,14px)}\n.bx{position:relative;background:var(--well);border:1.5px solid transparent;border-radius:14px;padding:clamp(12px,1.6vh,20px) 8px clamp(15px,2vh,22px);display:flex;flex-direction:column;align-items:center;gap:clamp(8px,1vh,12px);cursor:pointer;font-size:clamp(13.5px,1.15vw,17px);transition:transform .12s;-webkit-tap-highlight-color:transparent;user-select:none;-webkit-user-select:none;-webkit-touch-callout:none}\n.bx:active{transform:scale(.95)}\n.bi{display:grid;place-items:center}\n.bx .nm{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}\n.bx::after{content:\"\";position:absolute;left:12px;right:12px;bottom:4px;height:4px;border-radius:3px;background:var(--l)}\n.bx.play{background:var(--g);color:#fff;font-weight:600;text-shadow:0 1px 3px rgba(0,0,0,.5)}\n.bx.play::after,.bx.part::after{display:none}\n.bx.part{padding-bottom:22px}\n.cov{position:absolute;left:0;right:0;bottom:8px;display:flex;justify-content:center;gap:4px;line-height:0}\n.cov i{width:5px;height:5px;border-radius:50%;background:rgba(255,255,255,.14)}.cov i.on{background:var(--l)}\n.cov.cn{line-height:1;font-size:10.5px;color:var(--mut);bottom:5px;font-variant-numeric:tabular-nums}\n.bx.play .cov i{background:rgba(255,255,255,.3)}.bx.play .cov i.on{background:#fff}.bx.play .cov.cn{color:#fff}\n.fv{position:absolute;left:10px;top:8px;font-size:12px;color:var(--acc);font-weight:400}\n.ic{display:grid;place-items:center;border-radius:30%;color:#fff;font-style:normal;box-shadow:inset 0 0 0 1px rgba(255,255,255,.12)}\n.ic svg{width:58%;height:58%;filter:drop-shadow(0 1px 1.5px rgba(0,0,0,.28))}\n.cimg{display:block;border-radius:30%;object-fit:cover;background:var(--btn)}\n.eq{position:absolute;right:11px;top:11px;display:flex;gap:2px;align-items:flex-end;height:14px}\n.eq i{width:3px;background:#fff;border-radius:2px;animation:eq .9s ease-in-out infinite}.eq i:nth-child(2){animation-delay:.2s}.eq i:nth-child(3){animation-delay:.4s}\n@keyframes eq{0%,100%{height:4px}50%{height:14px}}\n@media(prefers-reduced-motion:reduce){.eq i{animation:none;height:10px}.bx{transition:none}}\n.cbar{display:flex;gap:10px;align-items:center;margin:12px 16px 16px;padding:10px 12px;min-height:clamp(64px,8vh,84px);background:var(--glass);border:1px solid var(--glass-b);border-radius:22px;flex:none;flex-wrap:wrap}\n.cbar .flex{flex:1}\n.lstack{display:flex;align-items:center;background:transparent;border:0;color:var(--tx);cursor:pointer;padding:0 10px 0 0;border-right:1px solid var(--glass-b)}\n.lstack span{width:32px;height:32px;border-radius:50%;background:rgba(0,0,0,.3);color:var(--acc);display:grid;place-items:center;margin-left:-9px}\n.lstack span:first-child{margin-left:0}.lstack span svg,.lstack span ha-icon{width:16px;height:16px}.lstack .none{color:var(--mut)}\n.lstack b{font-size:13.5px;font-weight:500;margin-left:8px;white-space:nowrap}\n.now{display:flex;gap:10px;align-items:center;min-width:160px}\n.now small{display:block;font-size:11px;color:var(--mut)}.now b{font-size:15px}\n.nsw{width:34px;height:34px;border-radius:50%;flex:none;box-shadow:inset 0 0 0 2px rgba(255,255,255,.08)}\n.slider{flex:1;min-width:150px;display:flex;align-items:center;gap:8px;font-size:13px;color:var(--mut)}\n.slider input{flex:1;accent-color:var(--acc)}\n.act{background:var(--well);border:0;color:var(--tx);border-radius:12px;font-size:clamp(14px,1.1vw,16px);padding:clamp(9px,1.2vh,13px) clamp(14px,1.3vw,20px);cursor:pointer}\n.act:disabled{opacity:.35;cursor:default}\n.act.offb{color:#ff9a8a;display:inline-flex;align-items:center;gap:6px}.act.offb svg{flex:none}\n.isik2{display:grid;grid-template-rows:clamp(84px,14vh,140px) minmax(0,1fr);gap:clamp(10px,1vw,14px);height:100%;min-height:420px}\n.bigbar{position:relative;border-radius:16px;background:var(--well);overflow:hidden;display:flex;align-items:center;gap:14px;padding:0 clamp(16px,2vw,28px);cursor:ew-resize;touch-action:none;user-select:none}\n.bigbar .bf{position:absolute;left:0;top:0;bottom:0;opacity:.9;pointer-events:none}\n.bico{position:relative;background:rgba(0,0,0,.22);border:0;width:clamp(52px,6vh,72px);height:clamp(52px,6vh,72px);border-radius:16px;color:#fff;display:grid;place-items:center;cursor:pointer;flex:none}\n.bico svg{width:30px;height:30px}\n.bigbar.off .bico{color:rgba(255,255,255,.38);background:rgba(255,255,255,.05)}\n.btx{position:relative;display:flex;flex-direction:column;gap:2px;text-shadow:0 1px 4px rgba(0,0,0,.55);pointer-events:none}\n.btx b{font-size:clamp(16px,1.5vw,22px)}.btx span{font-size:clamp(15px,1.3vw,20px);font-weight:700;font-variant-numeric:tabular-nums}\n.bstd{position:relative;margin-left:auto;font-size:12px;color:rgba(236,237,239,.7);text-shadow:0 1px 3px rgba(0,0,0,.6);pointer-events:none}\n.ir{display:grid;grid-template-columns:1fr 1.3fr;gap:clamp(10px,1vw,14px);min-height:0}\n.isec{background:rgba(0,0,0,.18);border-radius:16px;padding:clamp(10px,1.2vw,16px);display:flex;flex-direction:column;gap:10px;min-height:0;min-width:0}\n.isec .sec{margin:0}\n.kg2{flex:1;display:grid;grid-template-columns:repeat(2,1fr);grid-auto-rows:1fr;gap:clamp(8px,.9vw,12px);min-height:0}\n.kbx{min-height:56px;border-radius:14px;border:1px solid rgba(255,255,255,.1);cursor:pointer;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:2px;padding:0;font-size:clamp(11px,.95vw,14px);font-weight:500;color:rgba(0,0,0,.6)}\n.kbx b{font-size:clamp(15px,1.35vw,20px);font-weight:600;color:rgba(0,0,0,.76)}\n.cb2{flex:1;display:grid;grid-template-columns:auto 1fr;gap:clamp(12px,1.4vw,20px);min-height:0;align-items:center}\n.wheel{position:relative;border-radius:50%;height:min(100%,21vw);max-height:340px;aspect-ratio:1/1;background:radial-gradient(circle,#fff 0,rgba(255,255,255,0) 68%),conic-gradient(from 90deg,red,yellow,lime,cyan,blue,magenta,red);cursor:crosshair;flex:none}\n.wk{position:absolute;width:24px;height:24px;border-radius:50%;border:3px solid #fff;transform:translate(-50%,-50%);box-shadow:0 2px 8px rgba(0,0,0,.6);pointer-events:none}\n.cg2{height:100%;display:grid;grid-template-columns:repeat(3,1fr);grid-auto-rows:1fr;gap:clamp(8px,.9vw,12px)}\n.swc{min-height:40px;border-radius:14px;border:2px solid transparent;cursor:pointer;padding:0}\n.swc.on,.kbx.on{border:2px solid #fff;box-shadow:0 0 0 2px rgba(240,169,59,.75)}\n.shade{position:absolute;inset:0;background:rgba(0,0,0,.5);z-index:3}\n.panel,.sheet{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);max-height:90%;overflow:auto;background:var(--card2);border:1px solid var(--line);border-radius:22px;z-index:4;box-shadow:0 20px 60px rgba(0,0,0,.6)}\n.panel{width:min(580px,92%)}\n.sheet{width:min(440px,92%);padding:18px;display:flex;flex-direction:column;gap:14px}\n.ph{display:flex;gap:12px;align-items:flex-start;padding:18px 20px 10px}.ph>div{flex:1}\n.pt{font-size:18px;font-weight:600}.ps{font-size:12.5px;color:var(--mut);margin-top:3px}.ps.warn{color:#e9b46a}\n.ok{background:var(--acc);color:var(--acc-tx);border:0;border-radius:12px;padding:10px 18px;font-size:15px;font-weight:600;cursor:pointer}\n.cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:8px;padding:6px 20px 8px}\n.lc{display:flex;align-items:center;gap:12px;background:var(--btn);border-radius:16px;padding:12px 14px;cursor:pointer;border:1.5px solid transparent}\n.lc.on{background:#2E2A22;border-color:rgba(240,169,59,.55)}\n.li{width:36px;height:36px;border-radius:50%;background:var(--deep);display:grid;place-items:center;color:var(--mut);flex:none}\n.li svg,.li ha-icon{width:20px;height:20px}.lc.on .li{color:var(--acc-tx);background:var(--acc)}\n.ln{flex:1;font-size:14.5px;line-height:1.25;min-width:0}.ln small{display:block;font-size:11.5px;color:var(--mut)}\n.sw{width:40px;height:24px;border-radius:12px;background:#3A3F47;position:relative;flex:none}\n.sw i{position:absolute;top:3px;left:3px;width:18px;height:18px;border-radius:50%;background:#fff;transition:left .15s}\n.lc.on .sw{background:var(--acc)}.lc.on .sw i{left:19px}\n.pf{display:flex;align-items:center;gap:10px;padding:10px 20px 16px;font-size:13px;color:var(--mut)}.pf b{color:var(--tx)}\n.lnk{background:transparent;border:0;color:var(--acc);font-size:14px;cursor:pointer}\n.shh{display:flex;gap:14px;align-items:center}.shh>div{flex:1;min-width:0}\n.shh b{display:block;font-size:19px}.shh small{display:block;font-size:12.5px;color:var(--mut);margin-top:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}\n.x2{width:38px;height:38px;border-radius:12px;background:var(--btn);border:0;color:var(--mut);cursor:pointer;flex:none}\n.shl small{display:block;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--mut);margin-bottom:8px}\n.shl div{display:flex;flex-wrap:wrap;gap:6px}.shl span{background:var(--btn);border-radius:999px;padding:5px 11px;font-size:12.5px}\n.shb{display:grid;gap:8px}\n.shb button{display:flex;align-items:center;gap:12px;background:var(--btn);border:0;border-radius:14px;color:var(--tx);padding:13px 14px;font-size:15px;cursor:pointer;text-align:left}\n.shb button svg{width:22px;height:22px;color:var(--acc);flex:none}\n.shb button.on{background:rgba(240,169,59,.16)}.shb button.on svg{fill:var(--acc)}\n.shb button.warn{color:#ff9a8a}.shb button.warn svg{color:#ff9a8a}\n.toast{position:absolute;left:50%;bottom:96px;transform:translateX(-50%);background:var(--btn);box-shadow:var(--sh);border:1px solid var(--line);padding:9px 16px;border-radius:12px;font-size:14px;opacity:0;transition:opacity .25s;pointer-events:none;z-index:5;white-space:nowrap;max-width:90%;overflow:hidden;text-overflow:ellipsis}\n.toast.show{opacity:1}\nbutton:focus-visible,.bx:focus-visible{outline:2px solid var(--acc);outline-offset:2px}\n@media (orientation:portrait){\n.wrap:not(.m) .mid{flex-direction:column}\n.wrap:not(.m) .pn.cp{width:auto;flex:none;padding:10px}\n.wrap:not(.m) .crail{flex-direction:row;overflow-x:auto;flex:none}\n.wrap:not(.m) .crail .ct{flex:none;min-width:150px;height:52px}\n.wrap:not(.m) .act .at{display:none}\n.wrap:not(.m) .now{min-width:0;flex:1}\n.ir{grid-template-columns:1fr;grid-template-rows:auto auto}.kg2{grid-template-columns:repeat(3,1fr)}.wheel{height:220px}.isik2{height:auto}\n}\n.m{height:var(--lemur-mh,80vh);min-height:0;background:var(--lemur-bg,#131416);padding-top:env(safe-area-inset-top,0px)}\n.m .x{height:auto;aspect-ratio:auto;width:44px;border-radius:14px;background:var(--btn);border:0;flex:none}\n.m .scroll{padding:2px 12px 14px;overscroll-behavior:contain;-webkit-overflow-scrolling:touch}\n.m .bgrid{grid-template-columns:repeat(3,1fr);gap:8px}\n.m .bx{font-size:12px;padding:10px 4px 12px;gap:6px;background:var(--card2)}\n.m .bx .nm{white-space:normal;line-height:1.2;text-align:center;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;min-height:2.4em}\n.m .bx.play{background:var(--g)}\n.m .bx.part{padding-bottom:18px}\n.m .sub em{display:block;margin:2px 0 0}\n.m .panel,.m .sheet{left:0;right:0;top:auto;bottom:0;transform:none;width:100%;max-height:82%;border-radius:22px 22px 0 0;border-width:1px 0 0}\n.m .sheet{padding-bottom:calc(18px + env(safe-area-inset-bottom,0px))}\n.m .cards{grid-template-columns:1fr;padding:6px 14px 8px}\n.m .ph{padding:16px 16px 8px}.m .pf{padding:10px 16px calc(16px + env(safe-area-inset-bottom,0px))}\n.m .toast{bottom:calc(150px + env(safe-area-inset-bottom,0px))}\n.m .isik2{height:auto;min-height:0;grid-template-rows:84px auto;gap:10px}\n.m .bigbar{padding:0 16px}.m .bico{width:48px;height:48px}\n.m .ir{grid-template-columns:1fr;gap:10px}\n.m .kg2{grid-template-columns:repeat(3,1fr)}.m .kbx{min-height:60px}\n.m .cb2{grid-template-columns:1fr;justify-items:center}.m .wheel{height:170px}\n.m .cg2{width:100%;grid-template-columns:repeat(6,1fr)}.m .swc{min-height:38px}\n.m .bstd{display:none}\n.m .nsw{width:30px;height:30px}\n.m .mst .nsw{width:36px;height:36px}\n.ico{border-radius:50%;background:radial-gradient(circle at 50% 30%,#2a2c32,#141518 78%);display:grid;place-items:center;flex:none;font-style:normal}\nsvg.q{width:100%;height:100%;fill:none;stroke-width:3.3;stroke-linecap:round;stroke-linejoin:round;overflow:visible}\nsvg.q *{stroke:var(--c)}\nsvg.q .q-w{fill:var(--c);stroke:none}\nsvg.q .q-t{stroke-width:2.4}\nsvg.q .q-g{fill:var(--c);fill-opacity:.16;stroke:none}\nsvg.q .q-f{fill:var(--c);stroke:color-mix(in srgb,var(--c) 60%,#fff)}\nsvg.q .q-h,svg.q .q-h *{stroke:#1a1b1f;stroke-width:5.1;fill:none}\n.ic.ico{box-shadow:none;border-radius:50%}\n.ic.ico svg.q{width:100%;height:100%}\n.ic.ico.dz svg.dz{width:100%!important;height:100%!important;filter:none}\n.ti svg.dz,.ct .ti svg.dz{width:86%;height:86%}\n.wrap.sa:not(.m){padding:env(safe-area-inset-top,0px) env(safe-area-inset-right,0px) env(safe-area-inset-bottom,0px) env(safe-area-inset-left,0px)}\n.wrap.m.sa{padding-left:env(safe-area-inset-left,0px);padding-right:env(safe-area-inset-right,0px)}\n.wrap.m.nosa{padding-top:0}.wrap.m.nosa .cbar{padding-bottom:8px}\n.ts-s .bgrid{grid-template-columns:repeat(auto-fill,minmax(100px,1fr));gap:8px}\n.ts-m .bgrid{grid-template-columns:repeat(auto-fill,minmax(160px,1fr))}\n.ts-l .bgrid{grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:16px}\n.m.ts-s .bgrid{grid-template-columns:repeat(4,1fr);gap:6px}\n.m.ts-m .bgrid{grid-template-columns:repeat(3,1fr)}\n.m.ts-l .bgrid{grid-template-columns:repeat(2,1fr)}\n.ts-s .bx{font-size:12px;gap:6px}\n.ts-l .bx{font-size:18px;gap:14px;padding-top:22px;padding-bottom:26px}\n.m.ts-l .bx{font-size:14px;gap:10px;padding-top:14px;padding-bottom:16px}\n.nonm .bx .nm{display:none}\n.nonm .bx{padding-top:14px;padding-bottom:16px}\n.nobar .bx::after{display:none}\n.nodots .cov{display:none}\n.nodots .bx.part{padding-bottom:clamp(15px,2vh,22px)}\n.bg-black{--lemur-bg:#000;--card2:#121214;--btn:#1C1D21;--deep:#000;--well:rgba(255,255,255,.04)}\n.bg-black .glow{opacity:.2}\n.bg-theme{--lemur-bg:var(--ha-card-background,var(--card-background-color,#0B0C0F));--tx:var(--primary-text-color,#ECEDEF);--tx2:var(--secondary-text-color,#C9CCD1);--mut:var(--secondary-text-color,#8A8F96);--card2:var(--secondary-background-color,#1E2024);--btn:var(--secondary-background-color,#2A2D33);--deep:var(--secondary-background-color,#0C0D0F);--line:var(--divider-color,rgba(255,255,255,.06));--well:rgba(127,127,127,.12)}\n.bg-theme .glow{opacity:.35}\n.ic.mono svg{width:56%;height:56%}\n.upd{display:flex;align-items:center;gap:12px;margin:0 0 10px;padding:9px 10px 9px 14px;border-radius:14px;background:rgba(240,169,59,.14);border:1px solid rgba(240,169,59,.5);color:var(--tx);font-size:14px;flex:none}\n.upd span{flex:1}\n.upd button{background:var(--acc);color:var(--acc-tx);border:0;border-radius:10px;padding:8px 14px;font:inherit;font-weight:600;cursor:pointer}\n.m .upd{margin:0 12px 10px}\n.flm{position:absolute;right:9px;top:8px;width:14px;height:14px;color:var(--mut);display:grid;line-height:0}\n.flm svg{width:100%;height:100%}\n.bx.play .flm{color:rgba(255,255,255,.85)}\n.nodots .flm{display:none}\n.mtop{display:flex;gap:8px;padding:10px 12px 8px;flex:none}\n.mroom{flex:1;min-width:0;display:flex;align-items:center;gap:10px;background:var(--card2);border:0;border-radius:16px;padding:9px 14px;color:var(--tx);cursor:pointer;text-align:left;font:inherit;-webkit-tap-highlight-color:transparent}\n.mroom .rl{flex:1;min-width:0;display:flex;flex-direction:column}\n.mroom small{font-size:11.5px;color:var(--mut);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n.mroom b{font-size:19px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n.mroom .rc{display:flex;align-items:center;gap:4px;color:var(--acc);font-weight:600;font-size:13px;flex:none}\n.mroom .rc svg{width:16px;height:16px}\n.mst{display:flex;align-items:center;gap:10px;margin:0 12px 8px;padding:8px 8px 8px 10px;border-radius:16px;background:var(--card2);flex:none;min-height:56px}\n.mst.on{background:var(--g)}\n.mst .mt{flex:1;min-width:0;display:flex;flex-direction:column;line-height:1.25}\n.mst .mt b{font-size:14.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n.mst .mt small{font-size:12px;opacity:.8}\n.mst.on .mt{text-shadow:0 1px 3px rgba(0,0,0,.45)}\n.mst.idle{color:var(--mut)}\n.mst .mi{width:36px;height:36px;border-radius:50%;background:var(--btn);display:grid;place-items:center;flex:none;color:var(--mut)}\n.mst .mi svg{width:20px;height:20px}\n.mbt{height:38px;padding:0 12px;border-radius:12px;background:var(--btn);border:1px solid rgba(255,255,255,.12);color:var(--tx);font:inherit;font-size:13.5px;font-weight:600;cursor:pointer;flex:none;white-space:nowrap}\n.mst.on .mbt{background:rgba(0,0,0,.3)}\n.mhd{display:flex;align-items:baseline;justify-content:space-between;gap:10px;padding:4px 16px 8px;flex:none}\n.mhd b{font-size:16px}.mhd small{font-size:12.5px;color:var(--mut)}\n.msr{display:flex;align-items:center;gap:8px;margin:0 12px 6px;height:42px;border-radius:13px;background:var(--card2);padding:0 12px;color:var(--mut);flex:none}\n.msr svg{width:18px;height:18px;flex:none}\n.msr input{flex:1;min-width:0;background:none;border:0;outline:none;color:var(--tx);font:inherit;font-size:16px;-webkit-appearance:none;appearance:none}\n.msr:focus-within{box-shadow:0 0 0 2px var(--acc)}\n.mchips{display:flex;gap:6px;overflow-x:auto;padding:0 12px 8px;flex:none;scrollbar-width:none}\n.mchips::-webkit-scrollbar{display:none}\n.mchip{flex:none;display:inline-flex;align-items:center;gap:6px;height:38px;padding:0 12px 0 6px;border-radius:999px;background:var(--card2);border:0;color:var(--tx2);font:inherit;font-size:13.5px;cursor:pointer;white-space:nowrap;-webkit-tap-highlight-color:transparent}\n.mchip .ti{background:transparent}\n.mchip em{font-style:normal;font-size:11.5px;opacity:.65}\n.mchip.on{background:var(--acc);color:var(--acc-tx);font-weight:600}\n.mfoot{display:flex;gap:8px;padding:8px 12px 0;flex:none}\n.m .mbb{flex:1;height:54px;border-radius:16px;background:var(--deep);border:1px solid var(--line);padding:0 16px;justify-content:space-between;gap:10px}\n.mbb .bf{opacity:.85}\n.mbb .btx{flex-direction:row;align-items:center;gap:8px;font-weight:600;font-size:14.5px}\n.mbb .btx svg{width:20px;height:20px}\n.mbv{position:relative;font-weight:700;font-variant-numeric:tabular-nums;font-size:15px;pointer-events:none;text-shadow:0 1px 3px rgba(0,0,0,.5)}\n.mbb.off .btx,.mbb.off .mbv{color:var(--mut)}\n.mpw{width:54px;height:54px;border-radius:16px;border:0;background:var(--btn);color:var(--mut);display:grid;place-items:center;cursor:pointer;flex:none}\n.mpw.on{color:#ff8a7a}\n.mpw svg{width:22px;height:22px}\n.mtabs{display:grid;padding:6px 4px calc(6px + env(safe-area-inset-bottom,0px));margin-top:8px;border-top:1px solid var(--line);background:var(--card2);flex:none}\n.mtabs button{display:flex;flex-direction:column;align-items:center;gap:3px;background:none;border:0;color:var(--mut);font:inherit;font-size:11.5px;padding:4px 2px;cursor:pointer;min-width:0;-webkit-tap-highlight-color:transparent}\n.mtabs button span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}\n.mtabs svg{width:24px;height:24px}\n.mtabs button.on{color:var(--acc);font-weight:600}\n.mtabs button.on[data-mtab=\"fav\"] svg{fill:currentColor}\n.m .sheet.rsh{padding:14px 12px calc(14px + env(safe-area-inset-bottom,0px));gap:8px}\n.rsh-h{display:flex;align-items:center;justify-content:space-between;padding:0 4px}.rsh-h b{font-size:17px}\n.rlist{display:flex;flex-direction:column;gap:2px;overflow:auto;min-height:0}\n.rrow{display:flex;align-items:center;gap:12px;width:100%;padding:11px 10px;border-radius:14px;background:none;border:0;color:var(--tx);font:inherit;text-align:left;cursor:pointer}\n.rrow.on{background:var(--btn)}\n.rrow .dot{width:10px;height:10px;border-radius:50%;background:rgba(255,255,255,.2);flex:none}\n.rrow .dot.lit{background:var(--acc);box-shadow:0 0 8px rgba(240,169,59,.6)}\n.rrow .rt{flex:1;min-width:0;display:flex;flex-direction:column}.rrow .rt b{font-size:15.5px;font-weight:600}.rrow .rt small{font-size:12px;color:var(--mut)}\n.rrow .ck svg{width:20px;height:20px;color:var(--acc);display:block}\n.racts{display:grid;grid-template-columns:1fr 1fr;gap:8px;padding-top:6px}\n.racts button{display:flex;align-items:center;justify-content:center;gap:8px;height:48px;border-radius:14px;border:0;background:var(--btn);color:var(--tx);font:inherit;font-size:14.5px;font-weight:600;cursor:pointer}\n.racts button svg{width:20px;height:20px;color:var(--acc)}\n.racts .warn svg{color:#ff8a7a}.racts button:disabled{opacity:.4;cursor:default}";
const PANEL_CSS = ":host{display:block;height:100vh;height:100dvh;font-family:var(--lemur-font,Archivo,var(--ha-font-family-body,system-ui),sans-serif)}\n*{box-sizing:border-box}\nbutton,input{font-family:inherit;color:inherit}\nbutton{cursor:pointer}\nsvg{flex:none}\nha-icon{--mdc-icon-size:100%;display:inline-flex;width:20px;height:20px}\n.s{width:18px;height:18px}.s14{width:14px;height:14px}.s16{width:16px;height:16px}.s20{width:20px;height:20px}\n.app{position:relative;height:100%;display:flex;flex-direction:column;gap:12px;padding:0 16px 16px;container-type:inline-size;background:#0B0C0E;color:#ECEDEE;overflow:hidden;font-size:14px;line-height:1.4;\n--bg:#0B0C0E;--s1:#131417;--s2:#18191D;--s3:#1F2125;--s4:#272A2F;--s5:#30333A;\n--ln:rgba(255,255,255,.06);--ln2:rgba(255,255,255,.10);--ln3:rgba(255,255,255,.18);\n--tx:#ECEDEE;--tx2:#B3B7BE;--mu:#7C818A;--mu2:#5A5E66;\n--ac:#F2A93B;--acs:rgba(242,169,59,.13);--acl:rgba(242,169,59,.55);--actx:#1B1206;\n--red:#EE6A5F;--reds:rgba(238,106,95,.12);--tint:#261C10;--tintr:#2A1513;\n--r1:22px;--r2:14px;--r3:10px;--card:#1E2024;\n--isz:clamp(64px,5.6vw,96px);--isz:clamp(64px,6.67cqw,96px);\n--fs:clamp(14px,1.2vw,17px);--pad:clamp(12px,1.6vh,18px)}\n.grow{flex:1}\n.top{display:flex;align-items:center;gap:10px;min-height:60px;flex:none}\n.mb{display:none}\n.narrow .mb{display:block;margin-left:-8px}\n.lg{width:30px;height:30px;border-radius:8px;background:linear-gradient(140deg,#F4B24A,#E2702C);display:grid;place-items:center;color:var(--actx);flex:none}\n.top h1{font-size:16px;font-weight:600;margin:0 6px 0 2px;letter-spacing:-.01em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n.btn{display:inline-flex;align-items:center;justify-content:center;gap:7px;height:34px;padding:0 12px;border-radius:var(--r3);border:1px solid var(--ln2);background:var(--s2);font-size:13px;font-weight:500;color:var(--tx)}\n.btn:hover{background:var(--s3)}\n.btn:disabled{opacity:.35;cursor:default}\n.btn.ic{width:34px;padding:0}\n.btn.gear{display:none}\n.warn{background:rgba(238,106,95,.12);border:1px solid rgba(238,106,95,.35);color:#F3B0A9;padding:10px 14px;border-radius:var(--r2);font-size:13px;flex:none}\n.rblock{flex:none;background:var(--s1);border:1px solid var(--ln);border-radius:var(--r1);padding:10px}\n.rooms{display:flex;gap:10px;overflow-x:auto;padding-bottom:1px;margin-bottom:-1px;position:relative;z-index:2;align-items:flex-start;scrollbar-width:none}\n.rooms::-webkit-scrollbar{display:none}\n.rb{display:flex;align-items:center;justify-content:center;gap:10px;min-width:clamp(120px,11vw,200px);padding:var(--pad) clamp(14px,1.4vw,24px);border-radius:var(--r2);background:var(--s2);border:1px solid transparent;font-weight:600;font-size:clamp(15px,1.35vw,20px);line-height:1.2;white-space:nowrap;color:var(--tx2);cursor:pointer;flex:none}\n.rb ha-icon,.rb svg{width:clamp(22px,2vw,30px);height:clamp(22px,2vw,30px)}\n.rb:hover{background:var(--s3);color:var(--tx)}\n.rb em{font-style:normal;font-weight:500;font-size:.75em;opacity:.6}\n.rb.off{opacity:.45}\n.rb.on{background:var(--tint);color:var(--ac);border:1px solid var(--acl);border-bottom-color:var(--tint);border-radius:var(--r2) var(--r2) 0 0;padding-bottom:calc(var(--pad) + 10px);margin-bottom:-1px;opacity:1}\n.rb.hid{background:none;border:1px dashed var(--ln2);color:var(--mu);font-weight:500}\n.rb.hid.on{background:var(--tintr);border:1px solid rgba(238,106,95,.45);border-bottom-color:var(--tintr);color:var(--red)}\n.rb.add{background:none;border:1px dashed var(--ln2);color:var(--mu);font-weight:500;min-width:0;padding:var(--pad) clamp(14px,1.4vw,22px);font-size:clamp(14px,1.1vw,16px)}\n.rb.add:hover{color:var(--tx);border-color:var(--ln3)}\n.rooms .sp{flex:1;min-width:8px}\n.strip{display:flex;align-items:center;gap:10px;background:var(--tint);border:1px solid var(--acl);border-radius:var(--r2);padding:10px;min-height:72px;flex-wrap:wrap;position:relative;z-index:1}\n.strip.first{border-top-left-radius:0}\n.strip.last{border-top-right-radius:0}\n.strip.hidl{background:var(--tintr);border-color:rgba(238,106,95,.45)}\n.lhd{display:flex;align-items:center;gap:12px;padding:0 16px 0 6px;margin-right:4px;border-right:1px solid var(--ln2);height:50px;color:var(--tx2);font-weight:600;font-size:clamp(14px,1.1vw,16px);white-space:nowrap}\n.lhd .ti{width:40px;height:40px;border-radius:50%;background:var(--s3);display:grid;place-items:center;color:var(--ac)}\n.strip.hidl .lhd .ti{color:var(--red)}\n.lhd em{font-style:normal;color:var(--mu);font-weight:500;font-size:.85em}\n.lnone{color:var(--mu);font-size:13.5px;padding:0 6px}\n.lt{display:flex;align-items:center;gap:10px;height:50px;padding:0 14px 0 7px;border-radius:30px;background:var(--card);border:1px solid var(--ln);cursor:grab;font-weight:500;font-size:clamp(13.5px,1vw,15px);max-width:320px}\n.lt:hover{border-color:var(--ln3)}\n.lt.mv{border-color:rgba(242,169,59,.35)}\n.lt.lo{border-style:dashed;background:transparent}\n.lt.lo .tx small{color:var(--tx2)}\n.pop .it.fxu{align-items:flex-start;padding:10px}\n.pop .it.fxu .fxt{display:flex;flex-direction:column;gap:2px;flex:1;min-width:0}\n.pop .it.fxu .fxt b{font-weight:600}\n.pop .it.fxu .fxt small{margin:0;padding:0;white-space:normal;line-height:1.35}\n.pop .it.fxu .swt{margin-top:2px}\n.lt .tx{display:flex;flex-direction:column;min-width:0;line-height:1.2}\n.lt .tx b{font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n.lt .tx small{font-size:.8em;color:var(--mu);white-space:nowrap}\n.lt{padding-right:6px;cursor:pointer}\n.lx{width:30px;height:30px;border-radius:50%;border:0;background:var(--s4);color:var(--tx2);display:grid;place-items:center;flex:none;margin-left:2px}\n.lx:hover{background:var(--red);color:#fff}\n.strip.hidl .lx:hover,.lt.mv .lx:hover{background:var(--ac);color:var(--actx)}\n.dot{width:36px;height:36px;border-radius:50%;display:grid;place-items:center;flex:none;color:rgba(0,0,0,.55)}\n.dot svg{width:16px;height:16px}\n.dot.off{filter:saturate(.25) brightness(.6)}\n.addl,.offb{display:flex;align-items:center;gap:8px;height:50px;padding:0 20px 0 16px;border-radius:30px;font-weight:600;font-size:clamp(13.5px,1vw,15px);flex:none}\n.addl{border:1px solid var(--acl);background:var(--acs);color:var(--ac)}\n.addl:hover{background:rgba(242,169,59,.22)}\n.offb{border:1px solid var(--ln3);background:var(--s2);color:var(--tx2)}\n.offb:hover{background:var(--s3);color:var(--tx)}\n.offb.is{border-color:var(--acl);background:var(--acs);color:var(--ac)}\n.body{flex:1;min-height:0;display:grid;grid-template-columns:clamp(240px,19vw,320px) 1fr;gap:12px}\n.lcol{display:flex;flex-direction:column;gap:12px;min-height:0}\n.tabs{flex:1;min-height:0;background:var(--s1);border:1px solid var(--ln);border-radius:var(--r1);padding:12px;display:flex;flex-direction:column;gap:6px;overflow:hidden}\n.tscroll{flex:1;min-height:0;overflow:auto;display:flex;flex-direction:column;gap:6px;margin:0 -4px;padding:0 4px 20px;-webkit-mask-image:linear-gradient(#000 calc(100% - 24px),transparent);mask-image:linear-gradient(#000 calc(100% - 24px),transparent)}\n.allb{display:flex;align-items:center;gap:clamp(12px,1.2vw,18px);min-height:clamp(70px,8vh,92px);padding:0 14px;border-radius:var(--r2);cursor:pointer;flex:none;background:linear-gradient(135deg,rgba(242,169,59,.20),rgba(226,112,44,.10));border:1px solid rgba(242,169,59,.35)}\n.allb:hover{background:linear-gradient(135deg,rgba(242,169,59,.28),rgba(226,112,44,.14))}\n.allb.on{background:var(--ac);border-color:var(--ac)}\n.allb .ai{width:clamp(44px,3.6vw,58px);height:clamp(44px,3.6vw,58px);border-radius:14px;background:var(--ac);color:var(--actx);display:grid;place-items:center;flex:none}\n.allb.on .ai{background:var(--actx);color:var(--ac)}\n.allb .at{display:flex;flex-direction:column;min-width:0}\n.allb b{font-size:clamp(15.5px,1.35vw,19px);font-weight:700;color:var(--tx)}\n.allb small{font-size:clamp(12px,.9vw,13.5px);color:var(--tx2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n.allb.on b{color:var(--actx)}.allb.on small{color:rgba(27,18,6,.7)}\n.tsep{height:1px;background:var(--ln2);margin:4px;flex:none}\n.tb{display:flex;align-items:center;gap:clamp(12px,1.2vw,18px);min-height:clamp(54px,6.4vh,74px);padding:0 8px 0 12px;border-radius:var(--r2);background:var(--card);font-size:var(--fs);border:1px solid transparent;cursor:pointer;color:var(--tx2);flex:none}\n.tb:hover{background:var(--s3);color:var(--tx)}\n.tb.on{background:var(--acs);border-color:var(--acl);color:var(--tx)}\n.tb .ti{width:clamp(38px,3.4vw,52px);height:clamp(38px,3.4vw,52px);border-radius:50%;background:var(--s4);display:grid;place-items:center;color:var(--ac);flex:none}\n.tb .ti svg{width:52%;height:52%}\n.tb b{font-weight:500;flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n.tb.on b{font-weight:600}\n.tb em{font-style:normal;font-size:.78em;color:var(--mu);font-variant-numeric:tabular-nums}\n.tb .ed{width:32px;height:32px;border:0;background:none;border-radius:6px;display:grid;place-items:center;color:var(--mu);opacity:0}\n.tb .ed:hover{background:var(--s4);color:var(--tx)}\n.tb:hover .ed,.tb.on .ed{opacity:1}\n.tb.lock{cursor:default;opacity:.7}\n.tb.lock .ti{color:var(--tx2)}\n.tb .lk{color:var(--mu2);display:grid;padding-right:6px}\n.tb.hidt{background:none;border:1px dashed var(--ln2)}\n.tb.hidt .ti{background:var(--reds);color:var(--red)}\n.tb.hidt.on{background:var(--reds);border-color:rgba(238,106,95,.4)}\n.addt{display:flex;align-items:center;justify-content:center;gap:8px;min-height:clamp(48px,5.4vh,60px);font-size:clamp(13.5px,1vw,15px);border-radius:var(--r2);border:1px dashed var(--ln2);background:none;color:var(--mu);font-weight:500;flex:none}\n.addt:hover{color:var(--tx);border-color:var(--ln3)}\n.setb{flex:none;background:var(--s1);border:1px solid var(--ln);border-radius:var(--r1);padding:12px}\n.setb button{display:flex;align-items:center;gap:clamp(12px,1.2vw,18px);width:100%;min-height:clamp(54px,6.4vh,74px);padding:0 10px 0 12px;border-radius:var(--r2);border:1px solid transparent;background:var(--card);text-align:left}\n.setb button:hover{background:var(--s3)}\n.setb .si{width:clamp(38px,3.4vw,52px);height:clamp(38px,3.4vw,52px);border-radius:50%;background:var(--s4);display:grid;place-items:center;color:var(--tx2);flex:none}\n.setb .at{display:flex;flex-direction:column;min-width:0}\n.setb b{font-weight:600;font-size:var(--fs)}\n.setb small{font-size:12px;color:var(--mu);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n.fxp{background:var(--s1);border:1px solid var(--ln);border-radius:var(--r1);display:flex;flex-direction:column;min-height:0;min-width:0}\n.fxh{display:flex;align-items:center;gap:10px;padding:14px 16px 6px;min-height:58px}\n.fxh b{font-size:clamp(15px,1.3vw,19px);font-weight:600}\n.fxh em{font-style:normal;color:var(--mu);font-size:clamp(13px,1vw,15px)}\n.fxh .hi{width:24px;height:24px;display:grid;color:var(--ac)}\n.fsearch{display:flex;align-items:center;gap:8px;height:42px;width:300px;max-width:50%;padding:0 10px;background:var(--s2);border:1px solid var(--ln2);border-radius:9px;color:var(--mu)}\n.fsearch input{border:0;outline:0;background:none;flex:1;min-width:0;color:var(--tx);font-size:15px}\n.grid{flex:1;overflow:auto;padding:8px 14px 16px;display:grid;grid-template-columns:repeat(auto-fill,minmax(clamp(132px,11.5vw,210px),1fr));grid-auto-rows:min-content;gap:clamp(10px,1vw,14px);align-content:start}\n.fx{display:flex;flex-direction:column;align-items:center;gap:clamp(8px,1vh,12px);padding:clamp(12px,1.6vh,20px) 8px clamp(15px,2vh,22px);border-radius:16px;background:var(--card);box-shadow:0 4px 14px rgba(0,0,0,.35);border:1.5px solid transparent;cursor:grab;position:relative;min-width:0}\n.fx::after{content:\"\";position:absolute;left:12px;right:12px;bottom:4px;height:4px;border-radius:3px;background:var(--l)}\n.fx .fi{display:grid;place-items:center}\n.fx .fi>.ic,.fx .fi>.cimg{width:var(--isz)!important;height:var(--isz)!important}\n.fx:hover{border-color:var(--ln3)}\n.fx>.nm{font-size:clamp(13.5px,1.15vw,17px);color:var(--tx);text-align:center;line-height:1.25;max-width:100%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n.fx .ic,.fx .cimg{border-radius:16px;display:grid;place-items:center;flex:none;color:#fff;box-shadow:inset 0 1px 0 rgba(255,255,255,.2);object-fit:cover}\n.fx .ic svg{width:56%;height:56%}\n.fx.hd .ic,.fx.hd .cimg{filter:grayscale(.8) brightness(.55)}\n.fx.hd>.nm{color:var(--mu)}\n.fx.hd::after{opacity:.35}\n.fx .st{position:absolute;top:10px;left:12px;color:var(--ac);display:grid}\n.fx .st svg{width:16px;height:16px}\n.fx .fm{position:absolute;top:8px;right:8px;width:30px;height:30px;border-radius:7px;border:0;background:var(--s4);color:var(--tx2);display:grid;place-items:center;opacity:0}\n.fx:hover .fm{opacity:1}\n.fx .fm:hover{color:var(--tx);background:var(--s5)}\n.where{display:flex;align-items:center;gap:5px;font-size:clamp(11.5px,.85vw,13px);color:var(--mu);margin-top:-4px;max-width:100%;white-space:nowrap;overflow:hidden}\n.where i{width:13px;height:13px;display:grid;color:var(--ac);flex:none}\n.where i svg{width:13px;height:13px}\n.where.h i{color:var(--red)}\n.emp{grid-column:1/-1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;color:var(--mu);padding:48px 16px;border:1.5px dashed var(--ln2);border-radius:var(--r1);text-align:center}\n.emp>svg{width:30px;height:30px;color:var(--mu2)}\n[data-d]{touch-action:none;user-select:none;-webkit-user-select:none}\n.tb[data-d],.rb[data-d]{touch-action:pan-y}\n.rb[data-d]{touch-action:pan-x}\n[data-d].sel{outline:2px solid var(--ac);outline-offset:-2px;background:var(--acs)!important}\n.dragsrc{opacity:.25}\n.ghost{position:fixed;left:0;top:0;pointer-events:none;z-index:100;display:flex;align-items:center;gap:10px;background:var(--s4);border:1px solid var(--ln3);border-radius:var(--r2);padding:7px 14px 7px 7px;font-weight:600;box-shadow:0 20px 44px rgba(0,0,0,.6);max-width:320px;white-space:nowrap}\n.ghost .n{background:var(--ac);color:var(--actx);font-size:12px;font-weight:700;border-radius:10px;padding:1px 8px}\n.ghost .ic,.ghost .cimg{border-radius:8px;display:grid;place-items:center;color:#fff}\n.ghost .ic svg{width:60%;height:60%}\n.app.drag-fx .tb:not(.lock),.app.drag-light .rb:not(.add),.app.drag-tab .tb:not(.lock):not(.hidt),.app.drag-tab .rb:not(.add):not(.hid),.app.drag-room .rb:not(.add):not(.hid){outline:1.5px dashed var(--ln3);outline-offset:2px}\n.over{outline:2px solid var(--ac)!important;outline-offset:2px!important;background:var(--acs)!important;color:var(--tx)!important}\n.rb.over{background:var(--ac)!important;color:var(--actx)!important}\n.ins{box-shadow:-3px 0 0 0 var(--ac)!important}\n.insv{box-shadow:0 -3px 0 0 var(--ac)!important}\n.toast{position:fixed;left:50%;bottom:28px;transform:translate(-50%,16px);opacity:0;background:var(--s5);border:1px solid var(--ln2);padding:9px 9px 9px 16px;border-radius:var(--r2);display:flex;gap:14px;align-items:center;transition:.2s;z-index:90;box-shadow:0 12px 32px rgba(0,0,0,.5);font-size:13.5px;pointer-events:none;max-width:calc(100% - 32px)}\n.toast.show{opacity:1;transform:translate(-50%,0);pointer-events:auto}\n.toast button{border:0;background:none;color:var(--ac);font-weight:600;padding:5px 9px;border-radius:6px;white-space:nowrap}\n.toast button:hover{background:var(--acs)}\n.toast button[hidden]{display:none}\n.selb{position:fixed;left:50%;bottom:28px;transform:translateX(-50%);display:flex;align-items:center;gap:6px;background:var(--s4);border:1px solid var(--ln2);border-radius:var(--r1);padding:6px 6px 6px 16px;box-shadow:0 12px 32px rgba(0,0,0,.5);z-index:80;font-size:13.5px;white-space:nowrap}\n.selb b{font-weight:600;margin-right:6px}\n.selb span{color:var(--mu)}\n.pop{position:fixed;z-index:95;background:var(--s3);border:1px solid var(--ln2);border-radius:var(--r2);padding:6px;box-shadow:0 20px 44px rgba(0,0,0,.6);min-width:260px;max-width:360px;overflow:auto}\n.pop .it{display:flex;width:100%;text-align:left;border:0;background:none;padding:8px 10px;border-radius:7px;gap:10px;align-items:center;font-size:13.5px}\n.pop .it:hover{background:var(--s4)}\n.pop .it small{margin-left:auto;color:var(--mu);font-size:12px;white-space:nowrap;padding-left:10px}\n.pop .it .ti{width:28px;height:28px;border-radius:50%;background:var(--s4);display:grid;place-items:center;color:var(--ac);flex:none}\n.pop .it .ti svg{width:15px;height:15px}\n.pop .it .dot{width:28px;height:28px}\n.pop .it.dis{opacity:.4;pointer-events:none}\n.pop .it.del{color:var(--red)}\n.pop hr{border:0;border-top:1px solid var(--ln2);margin:5px 4px}\n.pop .t{font-size:11px;color:var(--mu);padding:8px 10px 4px;text-transform:uppercase;letter-spacing:.06em;font-weight:600}\n.pop .pt{padding:8px 6px 4px;font-weight:600;font-size:14px}\n.pop input{width:100%;height:36px;background:var(--s2);border:1px solid var(--ln2);border-radius:7px;padding:0 10px;outline:0;margin:4px 0 8px;font-size:13.5px}\n.pop input:focus{border-color:var(--acl)}\n.igrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(42px,1fr));gap:4px;padding:2px 4px 4px}\n.igrid button{width:100%;aspect-ratio:1;padding:0;border:0;border-radius:8px;background:none;color:var(--tx2);display:grid;place-items:center;cursor:pointer}\n.igrid button:hover,.igrid button.on{background:var(--s4);color:var(--ac)}\n.igrid button.on{box-shadow:inset 0 0 0 2px var(--ac)}\n.igrid button svg{width:24px;height:24px}\n.igrid.ig3{grid-template-columns:repeat(auto-fill,minmax(52px,1fr));gap:6px}\n.igrid.ig3 button{border-radius:50%;background:var(--s2)}\n.igrid.ig3 button svg{width:84%;height:84%}\n.tb .ti svg.dz,.pop .it .ti svg.dz{width:86%;height:86%}\n.fxd{display:flex;gap:12px;align-items:center;padding:6px 6px 10px}\n.fxd .ic,.fxd .cimg{border-radius:14px;display:grid;place-items:center;color:#fff;flex:none}\n.fxd .ic svg{width:56%;height:56%}\n.fxd b{display:block;font-size:15px}\n.fxd small{color:var(--mu);font-size:12px}\n.names{display:flex;flex-direction:column;gap:4px;padding:0 6px 6px;font-size:12.5px;color:var(--tx2)}\n.names span b{font-weight:500;color:var(--tx)}\n.modal{position:fixed;inset:0;background:rgba(0,0,0,.6);backdrop-filter:blur(4px);z-index:70;display:grid;place-items:center;padding:24px}\n.dlg{width:min(900px,100%);max-height:100%;overflow:auto;background:var(--bg);border:1px solid var(--ln2);border-radius:18px;padding:18px 24px 18px;box-shadow:0 30px 80px rgba(0,0,0,.6)}\n.dh{display:flex;align-items:center;gap:12px;padding-bottom:6px}\n.dh b{font-size:18px;font-weight:600}\n.dh .si{width:38px;height:38px;border-radius:50%;background:var(--s3);display:grid;place-items:center;color:var(--ac)}\n.sh2{font-size:12px;color:var(--mu);text-transform:uppercase;letter-spacing:.07em;font-weight:600;padding:14px 4px 8px}\n.srow{display:flex;align-items:center;gap:20px;background:var(--s1);border:1px solid var(--ln);border-radius:var(--r1);padding:16px 20px;margin-bottom:10px;flex-wrap:wrap}\n.srow .t{flex:1;min-width:200px}\n.srow .t b{display:block;font-weight:600;font-size:14.5px}\n.srow .t small{color:var(--mu);font-size:13px}\n.kel{display:flex;gap:6px;flex-wrap:wrap}\n.kel button{width:74px;height:44px;border-radius:9px;border:2px solid transparent;font-size:11.5px;font-weight:600;color:#3a2a14;white-space:nowrap}\n.kel button.on{border-color:#fff;box-shadow:0 0 0 2px var(--ac)}\n.segs{display:flex;background:var(--s2);border:1px solid var(--ln);border-radius:10px;padding:3px;gap:2px;flex-wrap:wrap}\n.segs button{border:0;background:none;padding:7px 14px;border-radius:7px;color:var(--mu);font-weight:500}\n.segs button.on{background:var(--s4);color:var(--tx)}\n.rng{width:260px;max-width:100%;accent-color:var(--ac)}\n.swt{width:42px;height:24px;border-radius:12px;background:var(--s4);position:relative;flex:none;border:0}\n.swt::after{content:\"\";position:absolute;width:18px;height:18px;border-radius:50%;background:#C9CCD1;top:3px;left:3px;transition:.15s}\n.swt.on{background:var(--ac)}\n.swt.on::after{left:21px;background:#fff}\n@media (max-width: 860px){\n.app{padding:0 10px 10px;gap:10px}\n.btn.gear{display:inline-flex}\n.setb{display:none}\n.body{grid-template-columns:1fr;grid-template-rows:auto 1fr}\n.lcol{min-height:auto}\n.tabs{flex-direction:row;overflow-x:auto;padding:6px}\n.tscroll{flex-direction:row;overflow:visible;-webkit-mask-image:none;mask-image:none;padding:0;margin:0}\n.tsep{width:1px;height:auto;margin:4px 2px}\n.allb{min-height:50px;padding:0 12px 0 8px}\n.allb .ai{width:36px;height:36px}\n.allb small{display:none}\n.tb{min-width:150px}\n.addt{min-width:130px;min-height:50px}\n.app{--isz:54px}\n.grid{grid-template-columns:repeat(auto-fill,minmax(100px,1fr));gap:8px;padding:8px}\n.fx{padding:12px 6px 14px}\n.rb{min-width:0}\n.tb{min-height:50px}\n.fsearch{width:auto;flex:1;max-width:none}\n.lhd{border-right:0;width:100%;padding-left:2px}\n.strip{min-height:auto}\n}\n.ico{border-radius:50%;background:radial-gradient(circle at 50% 30%,#2a2c32,#141518 78%);display:grid;place-items:center;flex:none;font-style:normal}\nsvg.q{width:100%;height:100%;fill:none;stroke-width:3.3;stroke-linecap:round;stroke-linejoin:round;overflow:visible}\nsvg.q *{stroke:var(--c)}\nsvg.q .q-w{fill:var(--c);stroke:none}\nsvg.q .q-t{stroke-width:2.4}\nsvg.q .q-g{fill:var(--c);fill-opacity:.16;stroke:none}\nsvg.q .q-f{fill:var(--c);stroke:color-mix(in srgb,var(--c) 60%,#fff)}\nsvg.q .q-h,svg.q .q-h *{stroke:#1a1b1f;stroke-width:5.1;fill:none}\n.ic.ico,.fx .ic.ico,.ghost .ic.ico,.fxd .ic.ico{border-radius:50%;box-shadow:none;background:radial-gradient(circle at 50% 30%,#2a2c32,#141518 78%)}\n.ic.ico svg.q,.fx .ic.ico svg.q,.ghost .ic.ico svg.q,.fxd .ic.ico svg.q{width:100%;height:100%}\n.ic.ico.dz svg.dz{width:100%!important;height:100%!important;filter:none}\n.btn.sm{height:30px;padding:0 10px;font-size:12.5px}\n.btn.pri{background:var(--ac);border-color:var(--ac);color:#1A1105;font-weight:600}\n.btn.pri:hover{filter:brightness(1.08);background:var(--ac)}\n.btn.danger{border-color:rgba(238,106,95,.45);color:var(--red);background:var(--reds)}\n.btn.danger:hover{background:rgba(238,106,95,.22)}\n.tin,.dlg select{height:36px;background:var(--s2);border:1px solid var(--ln2);border-radius:8px;padding:0 10px;color:var(--tx);font:inherit;font-size:13.5px;outline:0;color-scheme:dark}\n.tin:focus,.dlg select:focus{border-color:var(--acl)}\n.tin.wide,select.wide{min-width:260px;flex:1;max-width:420px}\n.srow.col{flex-direction:column;align-items:stretch;gap:10px}\n.srow .t.row{display:flex;align-items:center;gap:12px}\n.mine{display:flex;flex-direction:column;gap:6px}\n.mine .mi{display:flex;align-items:center;gap:12px;background:var(--s2);border:1px solid var(--ln);border-radius:12px;padding:8px 10px}\n.mine .mi b{font-weight:600}\n.mnone{color:var(--mu);font-size:13px;padding:4px 2px}\n.dlg.sm{width:min(520px,100%)}\n.rw{color:var(--tx2);line-height:1.5;margin:8px 0 18px}\n.dbtns{display:flex;gap:10px;align-items:center;justify-content:flex-end;padding-top:14px;flex-wrap:wrap}\n.dh .si.warnc{color:var(--red);background:var(--reds)}\n.dlg .act{display:flex;align-items:center;gap:8px;flex-wrap:wrap}\n.dlg .act input[type=color]{width:42px;height:34px;padding:0 2px;border:1px solid var(--ln2);border-radius:8px;background:var(--s2);cursor:pointer}\n.cbr{display:inline-flex;align-items:center;gap:4px;color:var(--mu);font-size:13px}\n.cbr input{width:64px;height:34px;background:var(--s2);border:1px solid var(--ln2);border-radius:8px;padding:0 8px;color:var(--tx);font:inherit;outline:0}\n.crm{font-size:12.5px;font-weight:600;color:var(--mu);padding:12px 4px 6px}\n.clr{display:flex;align-items:center;gap:12px;background:var(--s1);border:1px solid var(--ln);border-radius:12px;padding:10px 12px;margin-bottom:6px;flex-wrap:wrap}\n.clr .tx{flex:1;min-width:180px;display:flex;flex-direction:column}\n.clr .tx b{font-weight:600;font-size:14px}\n.clr .tx small{color:var(--mu);font-size:12px}\n.cei{border:0;background:none;padding:0;cursor:pointer;border-radius:50%}\n.mut{color:var(--mu);text-transform:none;letter-spacing:0;font-weight:400}\n.igrid.ri{grid-template-columns:repeat(auto-fill,minmax(40px,1fr))}\n.igrid.ri ha-icon{--mdc-icon-size:22px}\n.rii{display:flex;gap:6px;padding:6px 4px 4px}\n.rii input{flex:1;margin:0}\n.fxh .btn.sm{flex:none}\n.mineb{display:flex;align-items:center;gap:12px;min-height:58px;padding:0 14px;border-radius:var(--r2);cursor:pointer;flex:none;background:var(--s2);border:1px solid var(--ln);margin-top:6px}\n.mineb:hover{background:var(--s3)}\n.mineb.on{border-color:var(--acl);background:var(--tint)}\n.mineb .ai{width:40px;height:40px;border-radius:12px;background:var(--s4);color:var(--ac);display:grid;place-items:center;flex:none}\n.mineb .at{display:flex;flex-direction:column;min-width:0}\n.mineb b{font-weight:600;font-size:clamp(14px,1.15vw,16.5px)}\n.mineb small{font-size:12.5px;color:var(--mu);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n.fx.mfx{cursor:pointer}\n.ceh{display:flex;align-items:center;gap:12px;padding:14px 16px 8px;flex-wrap:wrap}\n.ceh .tin{flex:1;min-width:180px;max-width:340px;height:42px;font-size:15px;font-weight:600}\n.cel{display:flex;flex-direction:column;gap:2px}\n.cel small{font-size:11.5px;color:var(--mu)}\n.cel select,.cefb select,.clr select{height:36px;background:var(--s2);border:1px solid var(--ln2);border-radius:8px;padding:0 10px;color:var(--tx);font:inherit;font-size:13.5px;outline:0;color-scheme:dark;max-width:260px}\n.cefb{display:flex;align-items:center;gap:12px;padding:0 16px 8px;flex-wrap:wrap}\n.cefb small{color:var(--mu);font-size:12.5px}\n.cefb .act,.clr .act{display:flex;align-items:center;gap:8px;flex-wrap:wrap}\n.cefb input[type=color],.clr input[type=color]{width:42px;height:34px;padding:0 2px;border:1px solid var(--ln2);border-radius:8px;background:var(--s2);cursor:pointer}\n.cecols{display:grid;grid-template-columns:minmax(240px,340px) minmax(0,1fr);gap:12px;flex:1;min-height:0;padding:4px 16px 16px}\n.cepool,.cezone{overflow:auto;min-height:0;background:var(--s2);border:1px solid var(--ln);border-radius:14px;padding:10px;display:flex;flex-direction:column;gap:6px}\n.cezone{border-style:dashed;border-color:var(--ln2)}\n.ceht{display:flex;align-items:baseline;gap:8px;flex-wrap:wrap;padding:2px 4px 6px}\n.ceht b{font-weight:600}\n.ceht em{font-style:normal;color:var(--mu)}\n.ceht small{color:var(--mu);font-size:12px;flex-basis:100%}\n.cepool .crm{display:flex;align-items:center;padding:8px 4px 2px}\n.clt{display:flex;align-items:center;gap:10px;padding:6px 6px 6px 7px;border-radius:30px;background:var(--card);border:1px solid var(--ln);cursor:grab;touch-action:none}\n.clt .tx{flex:1;display:flex;flex-direction:column;min-width:0;line-height:1.2}\n.clt .tx b{font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n.clt .tx small{font-size:.8em;color:var(--mu)}\n.cezone .clr{cursor:grab;margin:0;background:var(--s1)}\n.lnk{border:0;background:none;color:var(--ac);font:inherit;font-size:12.5px;cursor:pointer;padding:2px 4px}\n.emp.sm{padding:16px;font-size:13px}\n.app.drag-cl .cezone,.app.drag-cl .cepool{outline:1.5px dashed var(--ln3);outline-offset:-2px}\n@media (max-width:900px){.cecols{grid-template-columns:1fr}.cepool{max-height:40vh}}\n.warn.upd{display:flex;align-items:center;gap:12px;background:rgba(240,169,59,.12);border-color:rgba(240,169,59,.45);color:#F7D9A6}\n.warn.upd span{flex:1}\n.fh{display:flex;flex-direction:column;gap:2px;min-width:0;max-width:640px}\n.fh b{font-size:15px}\n.fh small{color:var(--mu);font-size:12.5px}\n.fsup{display:flex;align-items:center;gap:6px;flex-wrap:wrap;padding:0 16px 10px}\n.fsup>small{color:var(--mu);font-size:12.5px;margin-right:4px}\n.fchip{display:inline-flex;align-items:center;gap:6px;height:30px;padding:0 10px 0 4px;border-radius:999px;background:var(--s2);border:1px solid var(--ln);font-size:12.5px}\n.fchip .dot{width:22px;height:22px}\n.fall{background:var(--s1);border:1px solid var(--ln2);border-radius:12px;margin:0 16px 10px;padding:10px 12px}\n.fall .tx{display:flex;flex-direction:column;margin-right:auto}\n.fall .tx small{color:var(--mu);font-size:12px}\n.fmiss{padding:0 16px 16px;overflow:auto;min-height:0;flex:1}\n.fmiss .crm{margin:10px 2px 6px}\n.where.fl{color:var(--ac)}\n.where.fl svg{width:13px;height:13px}\n.pvb{display:inline-flex;align-items:center;gap:8px;height:34px;padding:0 9px 0 11px;border-radius:var(--r3);border:1px solid var(--ln2);background:var(--s2);font-size:13px;font-weight:500;color:var(--tx);white-space:nowrap}\n.pvb:hover{border-color:var(--ln3)}\n.pvb>svg{color:var(--ac)}\n.pvb .sw2{position:relative;width:30px;height:18px;border-radius:9px;background:var(--s5);flex:none;transition:background .15s}\n.pvb .sw2 i{position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;background:#fff;transition:left .15s}\n.pvb.on{background:var(--acs);border-color:var(--acl)}\n.pvb.on .sw2{background:var(--ac)}.pvb.on .sw2 i{left:14px}\n.narrow .pvb .l{display:none}\n.pvbar{display:flex;align-items:center;gap:10px;background:var(--acs);border:1px solid var(--acl);color:#F7D9A6;padding:7px 8px 7px 14px;border-radius:var(--r2);font-size:13px;flex:none;flex-wrap:wrap}\n.pvbar .tx{flex:1;min-width:200px}\n.pvbar b{color:var(--tx)}\n.pvbar .btn{height:30px}\n.pvd{width:9px;height:9px;border-radius:50%;background:var(--ac);flex:none;animation:pvp 1.6s ease-out infinite}\n@keyframes pvp{0%{box-shadow:0 0 0 0 rgba(242,169,59,.55)}100%{box-shadow:0 0 0 9px rgba(242,169,59,0)}}\n.app.pv .fx{cursor:pointer}\n.app.pv .fx:hover{box-shadow:0 0 0 1.5px var(--acl),0 4px 14px rgba(0,0,0,.35)}\n.fx.pvon{box-shadow:0 0 0 2px var(--ac),0 6px 22px rgba(242,169,59,.28)!important}\n.fx.pvon::before{content:\"\";position:absolute;top:9px;left:calc(50% - 4.5px);width:9px;height:9px;border-radius:50%;background:var(--ac);animation:pvp 1.6s ease-out infinite}\n@media (prefers-reduced-motion:reduce){.pvd,.fx.pvon::before{animation:none}}\n.srow.upd .t small a{color:var(--ac);text-decoration:none}.srow.upd .t small a:hover{text-decoration:underline}\n.srow.upd .t small b{display:inline;font-size:inherit}\n.srow.upd .uok{color:#7FD39B}.srow.upd .unew{color:var(--ac);font-weight:600}.srow.upd .uerr{color:var(--red)}\n.srow.upd a.btn{text-decoration:none}";
// Filled two-tone glyphs (original set). {s} = secondary tone, {l} = bold line, {t} = thin line.
const ICONS = {
  fire: '<path{s} d="M12 2.5c.6 3.2 3 4.6 4.6 7 1.4 2 1.9 3.9 1.9 5.4A6.5 6.5 0 0 1 12 21.5a6.5 6.5 0 0 1-6.5-6.6c0-2.6 1.3-4.7 3-6.2.2 1.5.9 2.6 2 3.3C10.3 9 10.6 5.3 12 2.5z"/><path d="M12 21.5a3.6 3.6 0 0 1-3.6-3.6c0-2.2 1.8-3.4 2.6-5.2.9 1.4 1.4 2.1 2.6 2.9 1.2.8 2 1.5 2 2.5a3.6 3.6 0 0 1-3.6 3.4z"/>',
  candle: '<path d="M12 1.8c1.4 1.7 2.2 3 2.2 4.1a2.2 2.2 0 0 1-4.4 0c0-1.1.8-2.4 2.2-4.1z"/><rect{s} x="7.5" y="10" width="9" height="12" rx="2.2"/><path d="M7.5 13.6c1.5.9 3 .9 4.5 0s3-.9 4.5 0v-1.4a2.2 2.2 0 0 0-2.2-2.2H9.7a2.2 2.2 0 0 0-2.2 2.2z"/>',
  wave: '<path{s} d="M2 15.5c2.2 0 3.3-1.5 5-1.5s2.8 1.5 5 1.5 3.3-1.5 5-1.5 2.8 1.5 5 1.5V21H2z"/><path d="M2 11.5C4 6 8.5 3 13 3c3.3 0 5.6 1.5 6.6 3.6-1.1-.6-2.2-.8-3.3-.6-2.3.4-3.6 2.6-2.8 4.6.6 1.6 2.2 2.4 3.9 2.2-1.4 1.1-3.3 1.4-5 .6-1-.5-1.7-.9-2.6-.9-1.6 0-2.6 1.3-4.6 1.3-1.3 0-2.3-.8-3.2-2.3z"/>',
  drop: '<path{s} d="M12 2s7 7.4 7 12.4a7 7 0 0 1-14 0C5 9.4 12 2 12 2z"/><path d="M12 8.5s4 4.3 4 7a4 4 0 0 1-8 0c0-2.7 4-7 4-7z"/>',
  tree: '<path d="M12 1.8l4.6 5.6h-2.4l3.9 4.6h-2.6l4.2 5.2H4.3l4.2-5.2H5.9l3.9-4.6H7.4z"/><rect{s} x="10.5" y="17.2" width="3" height="5" rx="1"/>',
  leaf: '<path{s} d="M4 20C4 10 9.5 4 21 3c-.6 11-6.5 17-17 17z"/><path{l} d="M4 20c4-5 8-8.5 12-11"/>',
  flower: '<g{s}><circle cx="12" cy="5.3" r="3.3"/><circle cx="16.8" cy="8.8" r="3.3"/><circle cx="15" cy="14.4" r="3.3"/><circle cx="9" cy="14.4" r="3.3"/><circle cx="7.2" cy="8.8" r="3.3"/></g><circle cx="12" cy="10.3" r="2.8"/>',
  snow: '<path{l} d="M12 2.5v19M3.8 7.25l16.4 9.5M3.8 16.75l16.4-9.5"/><path{l}{s} d="M9.4 3.8L12 6.2l2.6-2.4M9.4 20.2l2.6-2.4 2.6 2.4M3.5 10.6l3.4.9.8-3.5M20.5 13.4l-3.4-.9-.8 3.5M4.3 15.6l3.4-1-.9-3.4M19.7 8.4l-3.4 1 .9 3.4"/><circle cx="12" cy="12" r="2.4"/>',
  sun: '<circle cx="12" cy="12" r="5.2"/><path{l}{s} d="M12 1.8v2.4M12 19.8v2.4M1.8 12h2.4M19.8 12h2.4M4.8 4.8l1.7 1.7M17.5 17.5l1.7 1.7M4.8 19.2l1.7-1.7M17.5 6.5l1.7-1.7"/>',
  sunrise: '<path d="M5.8 17a6.2 6.2 0 0 1 12.4 0z"/><rect x="2" y="17.6" width="20" height="2.2" rx="1.1"/><path{l}{s} d="M12 7.4V3M9.8 5.1L12 2.9l2.2 2.2M3.6 11.6l1.8 1M20.4 11.6l-1.8 1M6.2 7.4l1.3 1.3M17.8 7.4l-1.3 1.3"/><rect{s} x="6" y="21" width="12" height="1.6" rx=".8"/>',
  sunset: '<path d="M5.8 17a6.2 6.2 0 0 1 12.4 0z"/><rect x="2" y="17.6" width="20" height="2.2" rx="1.1"/><path{l}{s} d="M12 2.9v4.4M9.8 5.2L12 7.4l2.2-2.2M3.6 11.6l1.8 1M20.4 11.6l-1.8 1M6.2 7.4l1.3 1.3M17.8 7.4l-1.3 1.3"/><rect{s} x="6" y="21" width="12" height="1.6" rx=".8"/>',
  moon: '<path d="M20.5 14.6A9 9 0 0 1 9.4 3.5a9 9 0 1 0 11.1 11.1z"/><path{s} d="M16.5 2.5l.9 2.4 2.4.9-2.4.9-.9 2.4-.9-2.4-2.4-.9 2.4-.9z"/>',
  star: '<path d="M11 3.2l2.5 5.1 5.6.8-4.1 4 1 5.6-5-2.7-5 2.7 1-5.6-4.1-4 5.6-.8z"/><path{s} d="M19.5 15l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z"/>',
  galaxy: '<ellipse{s} cx="12" cy="12" rx="10.2" ry="4.4" transform="rotate(-28 12 12)"/><ellipse cx="12" cy="12" rx="5.6" ry="2.2" transform="rotate(-28 12 12)"/><circle cx="12" cy="12" r="2.9"/><path d="M19 2.6l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z"/><circle{s} cx="4.6" cy="19.2" r="1.1"/>',
  planet: '<ellipse{l}{s} cx="12" cy="12" rx="10.4" ry="3.4" transform="rotate(-24 12 12)"/><circle cx="12" cy="12" r="6"/>',
  cloud: '<path{s} d="M17.5 5.5a4.5 4.5 0 0 1 4.3 5.8 3.8 3.8 0 0 0-2.3-.8h-.3a6.5 6.5 0 0 0-10.8-2.8 4.5 4.5 0 0 1 9.1-2.2z"/><path d="M6.5 20a4.5 4.5 0 0 1-.9-8.9 6 6 0 0 1 11.6.9h.3a4 4 0 0 1 0 8z"/>',
  rain: '<path d="M6.5 15a4.5 4.5 0 0 1-.9-8.9 6 6 0 0 1 11.6.9h.3a4 4 0 0 1 0 8z"/><path{l}{s} d="M8 18l-1 3M12.5 18l-1 3M17 18l-1 3"/>',
  storm: '<path{s} d="M6.5 15a4.5 4.5 0 0 1-.9-8.9 6 6 0 0 1 11.6.9h.3a4 4 0 0 1 0 8z"/><path d="M13.6 10.2L8.8 17h3.3l-1.8 5.6 5.8-7.8h-3.4l1.7-4.6z"/>',
  rainbow: '<path d="M2 18a10 10 0 0 1 20 0h-2.6a7.4 7.4 0 0 0-14.8 0z"/><path{s} d="M5.6 18a6.4 6.4 0 0 1 12.8 0h-2.6a3.8 3.8 0 0 0-7.6 0z"/><path d="M9.2 18a2.8 2.8 0 0 1 5.6 0z"/>',
  aurora: '<path{s} d="M2 20c2-1 3-7 6-9s4 4 6 4 3-7 8-10v15z"/><path d="M2 20c3-.5 4-4 6.5-4.5S12 19 15 19s4.5-3 7-4v5z"/><circle{s} cx="5" cy="5" r="1.1"/><circle{s} cx="10" cy="3.5" r=".9"/>',
  sparkle: '<path d="M10 2.5l1.9 5.6 5.6 1.9-5.6 1.9L10 17.5l-1.9-5.6L2.5 10l5.6-1.9z"/><path{s} d="M18 13.5l1.1 3.4 3.4 1.1-3.4 1.1L18 22.5l-1.1-3.4-3.4-1.1 3.4-1.1z"/>',
  heart: '<path d="M10.5 21S2 16.3 2 10.4a4.6 4.6 0 0 1 8.5-2.7 4.6 4.6 0 0 1 8.5 2.7c0 5.9-8.5 10.6-8.5 10.6z"/><path{s} d="M19 2.6c.9-1 2.6-.6 2.9.7.4 1.7-2.9 3.8-2.9 3.8s-3.3-2.1-2.9-3.8c.3-1.3 2-1.7 2.9-.7z"/>',
  music: '<path{s} d="M8.6 17.5V5.6a1 1 0 0 1 .8-1l10.4-2.1a1 1 0 0 1 1.2 1V15.5h-2.2V6.7l-8 1.6v9.2z"/><ellipse cx="6.3" cy="17.6" rx="3.4" ry="2.8"/><ellipse cx="17.6" cy="15.6" rx="3.4" ry="2.8"/>',
  party: '<path d="M2.8 21.5l4.9-13.7 8.8 8.8z"/><g{s}><circle cx="15" cy="4" r="1.3"/><circle cx="20.6" cy="9" r="1.3"/><rect x="18.3" y="2.4" width="2.2" height="2.2" rx=".5" transform="rotate(20 19.4 3.5)"/><rect x="10.6" y="5.6" width="2.2" height="2.2" rx=".5"/><rect x="19.4" y="13" width="2.2" height="2.2" rx=".5" transform="rotate(-20 20.5 14.1)"/></g><path{l}{s} d="M13 10.4c1-2 3-3 5-2.5"/>',
  disco: '<circle{s} cx="12" cy="13.5" r="8"/><path{t} d="M12 2v3.5M4.4 11h15.2M4.4 16h15.2M12 5.5c-2.3 2.2-3.4 4.9-3.4 8s1.1 5.8 3.4 8M12 5.5c2.3 2.2 3.4 4.9 3.4 8s-1.1 5.8-3.4 8"/><rect x="15.6" y="7.4" width="2.8" height="2.8" rx=".6"/>',
  movie: '<rect{s} x="3" y="9" width="18" height="12.5" rx="2.4"/><path d="M3.2 5.5l15.8-3.4a1.1 1.1 0 0 1 1.3.9l.5 2.5L4.5 9z"/><path d="M10 12.4v6.2l5.2-3.1z"/>',
  book: '<path{s} d="M11 5.8C9 4.4 6 3.8 3 4.2a1 1 0 0 0-.9 1V18a1 1 0 0 0 1.1 1c2.8-.3 5.6.2 7.8 1.6z"/><path d="M13 5.8c2-1.4 5-2 8-1.6a1 1 0 0 1 .9 1V18a1 1 0 0 1-1.1 1c-2.8-.3-5.6.2-7.8 1.6z"/>',
  bed: '<path d="M2 19.5V7a1 1 0 0 1 2 0v7h18v5.5a1 1 0 0 1-2 0V18H4v1.5a1 1 0 0 1-2 0z"/><path{s} d="M11 9.5h7.5a3.5 3.5 0 0 1 3.5 3.5v.5H11z"/><circle{s} cx="7.3" cy="11.2" r="2.3"/><path{s} d="M15 2.5h3.5L15 6h3.5"/>',
  lotus: '<path{s} d="M12 21c-5 0-9-2.2-10-7 3.4-.2 6.4 1.2 8.3 3.6z"/><path{s} d="M12 21c5 0 9-2.2 10-7-3.4-.2-6.4 1.2-8.3 3.6z"/><path d="M12 21c-2.6-2-4-5-4-8.4S9.6 6 12 3.5c2.4 2.5 4 5.7 4 9.1S14.6 19 12 21z"/>',
  game: '<path{s} d="M7 7h10a5.2 5.2 0 0 1 4.9 7l-.9 2.6a2.6 2.6 0 0 1-4.5.8L15 15.5H9l-1.5 1.9a2.6 2.6 0 0 1-4.5-.8L2.1 14A5.2 5.2 0 0 1 7 7z"/><path d="M6.2 9.4h1.6V11h1.6v1.6H7.8v1.6H6.2v-1.6H4.6V11h1.6z"/><circle cx="16" cy="10.6" r="1.25"/><circle cx="18.3" cy="12.9" r="1.25"/>',
  sport: '<circle{s} cx="12" cy="12" r="9.6"/><path d="M12 7.1l4.3 3.1-1.6 5.1H9.3l-1.6-5.1z"/><path{t} d="M12 7.1V2.6M16.3 10.2l4.4-1.4M14.7 15.3l2.7 3.8M9.3 15.3l-2.7 3.8M7.7 10.2L3.3 8.8"/>',
  mountain: '<path{s} d="M9 21l6.5-11 7 11z"/><path d="M1.5 21L9 7.5 16.5 21z"/><path{s} d="M9 7.5l2.4 4.3-1.2-.8-1.2 1-1.2-1-1.2.8z"/>',
  desert: '<circle{s} cx="18.6" cy="5.4" r="2.6"/><path d="M10.4 21V6.4a1.8 1.8 0 0 1 3.6 0V12h1.3a.7.7 0 0 0 .7-.7V9a1.5 1.5 0 0 1 3 0v2.3a3.7 3.7 0 0 1-3.7 3.7H14v6zM7 8.5A1.5 1.5 0 0 1 8.5 10v2.3c0 .4.3.7.7.7h1.2v3H9.2a3.7 3.7 0 0 1-3.7-3.7V10A1.5 1.5 0 0 1 7 8.5z"/><rect{s} x="2" y="20.4" width="20" height="2.1" rx="1"/>',
  city: '<path{s} d="M14 21V9.5l7 3.5V21z"/><path fill-rule="evenodd" d="M3 21V10l5-3v14zM9 21V4.2a1 1 0 0 1 1.3-.9L15 5v16zM11 7.5h2V9h-2zm0 3h2V12h-2zm0 3h2V15h-2z"/>',
  alarm: '<path d="M6 16.2a6 6 0 0 1 12 0v2H6z"/><rect{s} x="4" y="18.6" width="16" height="3" rx="1.3"/><path{l}{s} d="M12 3v3M4.5 6.5l2 2M19.5 6.5l-2 2"/>',
  palette: '<path fill-rule="evenodd" d="M12 2.5a9.5 9.5 0 1 0 0 19c1.2 0 1.9-.9 1.9-1.9 0-1.3-1.2-1.7-1.2-2.9 0-1 .8-1.7 1.8-1.7h2.3a5.6 5.6 0 0 0 5.6-5.6C22.4 5.4 17.6 2.5 12 2.5zM6.2 11.2a1.5 1.5 0 1 0 3 0 1.5 1.5 0 1 0-3 0zM8.7 6.9a1.5 1.5 0 1 0 3 0 1.5 1.5 0 1 0-3 0zm5 .4a1.5 1.5 0 1 0 3 0 1.5 1.5 0 1 0-3 0z"/>',
  gradient: '<rect x="3" y="3" width="5.4" height="18" rx="2"/><rect{s} x="9.3" y="3" width="5.4" height="18" rx="2"/><rect opacity=".28" x="15.6" y="3" width="5.4" height="18" rx="2"/>',
  coffee: '<path d="M4 9h13v5.2A5.8 5.8 0 0 1 11.2 20h-1.4A5.8 5.8 0 0 1 4 14.2zM17 10.2h1.3a3 3 0 0 1 0 6h-1.7l.4-2h1.3a1 1 0 0 0 0-2H17z"/><path{l}{s} d="M8.5 2.5c-.7 1.1.7 2.1 0 3.4M12.5 2.5c-.7 1.1.7 2.1 0 3.4"/><rect{s} x="3" y="21" width="15" height="1.6" rx=".8"/>',
  gift: '<path{s} d="M4.5 12h15v8a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 20z"/><rect x="3" y="7.5" width="18" height="4.5" rx="1.2"/><path d="M11 12h2v9.5h-2zM12 7.5c-1.2-2.8-4.8-4.4-5.6-2.3-.6 1.6 2.4 2.3 5.6 2.3zm0 0c1.2-2.8 4.8-4.4 5.6-2.3.6 1.6-2.4 2.3-5.6 2.3z"/>',
  pulse: '<circle{s} cx="12" cy="12" r="9.6"/><path{l} d="M2.5 12.5h4l2.3-5 3.8 10 2.6-6.5 1.3 1.5h5"/>',
  ghost: '<path fill-rule="evenodd" d="M5 21V11a7 7 0 0 1 14 0v10l-2.3-1.8-2.4 1.8-2.3-1.8-2.3 1.8-2.4-1.8zM9.5 9.8a1.3 1.3 0 1 0 0 2.6 1.3 1.3 0 0 0 0-2.6zm5 0a1.3 1.3 0 1 0 0 2.6 1.3 1.3 0 0 0 0-2.6z"/>',
  generic: '<circle{s} cx="12" cy="12" r="9.6"/><circle cx="12" cy="12" r="4.6"/>'
};
for (const k in ICONS) ICONS[k] = ICONS[k].split('{s}').join(' opacity=".5"').split('{l}').join(' fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"').split('{t}').join(' fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"');

// anahtar kelime -> [simge, grup, ton listesi]
const RULES = [
  [/^music[: ]|\bmusic\b|rhythm|beat|spectrum|piano|energic|ufo|hopping|rolling|separation|gridding|stippling|smudge|splash/, 'music', 'fun', [285, 320, 200]],
  [/police|alarm|siren|emergency|strobe epilepsy/, 'alarm', 'fun', [0, 230]],
  [/candle/, 'candle', 'home', [32, 45]],
  [/fire|flame|bonfire|campfire|lava|dracarys|burn|blaze/, 'fire', 'nature', [8, 30]],
  [/aurora|northern/, 'aurora', 'sky', [150, 200, 280]],
  [/rainbow|prism|colou?rful|\brgb\b|random|loop|kaleido/, 'rainbow', 'color', [0, 120, 240]],
  [/sunrise|dawn|daybreak|morning/, 'sunrise', 'sky', [30, 48]],
  [/sunset|dusk|twilight|evening|sunbeam/, 'sunset', 'sky', [15, 330]],
  [/moon|lunar|night/, 'moon', 'sky', [230, 255]],
  [/storm|thunder|lightning|flash|strobe/, 'storm', 'sky', [255, 50]],
  [/rain|drizzle|downpour|shower/, 'rain', 'sky', [205, 225]],
  [/snow|winter|glacier|\bice\b|frost|cold|cool/, 'snow', 'nature', [190, 205]],
  [/cloud|fog|mist|haze|nimbus|cumulus|stratus|cirr|vapou?r/, 'cloud', 'sky', [210, 225]],
  [/galaxy|milky|cosmos|cosmic|universe|space|nebula|meteor|comet|interstellar|star/, 'galaxy', 'sky', [255, 290]],
  [/planet|mars|venus|jupiter|saturn|uranus|neptune|mercury|earth|eclipse|solar/, 'planet', 'sky', [20, 200]],
  [/sun|sunny|sunshine|bright|noon|afternoon|summer|clear|\bday\b|daylight/, 'sun', 'sky', [42, 55]],
  [/ocean|\bsea\b|deep|wave|underwater|beach|river|lake|stream|waterfall|aquarium|fish|tide|seaside|coast|sail/, 'wave', 'nature', [190, 215]],
  [/water|drop|drip|ripple/, 'drop', 'nature', [195, 210]],
  [/leaf|leaves|autumn|\bfall\b|maple/, 'leaf', 'nature', [22, 40]],
  [/flower|blossom|spring|lotus|lil(y|ies)|bloom|lavender|sunflower|cherry|rose|peach|berry/, 'flower', 'nature', [320, 345]],
  [/forest|tree|grove|jungle|wood|grass|meadow|field|wheat|corn|hay|herb|mint|green|firefly/, 'tree', 'nature', [95, 135]],
  [/mountain|hill|cliff|cave|karst|canyon|rock/, 'mountain', 'nature', [30, 140]],
  [/desert|gobi|cactus|sand|oasis|pyramid/, 'desert', 'nature', [35, 45]],
  [/sparkle|glisten|twinkle|glitter|shin(e|y)|gleam|enchant|magic|dream|opal|glow|radian|illumin/, 'sparkle', 'color', [50, 300]],
  [/roman|love|valentine|heart|date|kiss|sweet|tender|passion/, 'heart', 'home', [340, 355]],
  [/party|disco|dance|carnival|funfair|celebrat|festival|birthday|new ?year/, 'party', 'fun', [300, 190]],
  [/movie|cinema|film|\btv\b/, 'movie', 'home', [230, 260]],
  [/read|work|study|focus|office/, 'book', 'home', [40, 45]],
  [/sleep|nap|night ?light|relax|rest|calm|sooth|peace|quiet|mild|leisure/, 'bed', 'home', [250, 270]],
  [/meditat|yoga|zen|breath|heal|spirit|bless|care/, 'lotus', 'home', [170, 280]],
  [/game|gaming|snake/, 'game', 'fun', [120, 280]],
  [/sport|football|basket|fight/, 'sport', 'fun', [100, 30]],
  [/city|neon|cyber|urban|graffiti/, 'city', 'color', [300, 190]],
  [/\bart\b|style|colors|mondrian|monet|mona|matisse|ukiyo|morandi|macaron|rococo|memphis|mucha|dunhuang|maillard|painting/, 'palette', 'color', [0, 60, 200]],
  [/gradient|blend|temp/, 'gradient', 'color', [30, 210]],
  [/tea|coffee|dinner|drink|sips|dine/, 'coffee', 'home', [25, 35]],
  [/mother|father|family|child|gift|holiday|easter|christmas|thanks/, 'gift', 'fun', [340, 40]],
  [/ghost|hallow|grave|pumpkin|lantern/, 'ghost', 'fun', [30, 280]],
  [/heartbeat|pulse|jump|rush|energ|excit|crazy|tension|fright/, 'pulse', 'home', [350, 20]]
];

// exact effect names -> icon (src/icons2.js). Unknown names use IRULES, then RULES.
const ICON_OF = {"fire":"fire","flame":"fire","bonfire":"fire","dracarys":"fire","fire & blood":"fire","music: flame":"fire","firefly":"firefly","candle flicker":"candle","candlelight":"candle","candle":"candle","aurora":"aurora","green reign":"aurora","rainbow":"rainbow","colorful":"rainbow","colorful clouds":"rainbow","rgb":"rainbow","random loop":"rainbow","fast random loop":"rainbow","prism":"rainbow","music: colorful":"rainbow","sunrise":"sunrise","sunrise b":"sunrise","sunrise at sea":"sunrise","dawn":"sunrise","daybreak":"sunrise","morning":"sunrise","sunset":"sunset","sunset b":"sunset","sunset glow":"sunset","sunset beach":"sunset","sunset tide":"sunset","dusk":"sunset","twilight":"sunset","evening":"sunset","sunbeam":"sunset","sunny":"sun","sunny-a":"sun","sunny-b":"sun","sunshine":"sun","clear sky":"sun","afternoon":"sun","bright":"sun","warm sun":"sun","solar flare":"sun","sky":"sky","sky b":"sky","music: sky":"sky","cloudy day":"sky","cloudy":"cloud","cloudy-a":"cloud","cloudy-b":"cloud","cumulus":"cloud","altocumulus":"cloud","cirrocumulus":"cloud","cirrostratus":"cloud","thick fog":"fog","misty":"fog","morning mist":"fog","floating mist":"fog","music: floating mist":"fog","rain":"rain","drizzle":"rain","downpour":"rain","heavy rain":"rain","sunny rain":"rain","sprinkle":"rain","nimbostratus":"rain","rainforest":"rain","thunderstorm":"storm","lightning":"storm","flash":"storm","cumulonimbus":"storm","strobe color":"storm","strobe epilepsy!":"storm","breeze":"wind","windy day":"wind","moon":"moon","moonlight":"moon","moonlit night":"moon","moonlight sprinkles":"moon","lunar eclipse":"moon","night":"moon","night mode":"moon","longing":"moon","music: dayandnight":"moon","star":"star","starry sky":"star","starry night":"star","universe":"galaxy","milky way":"galaxy","nebula":"galaxy","cosmic echoes":"galaxy","vast cosmos":"galaxy","cosmos":"galaxy","meteor":"comet","meteorite":"comet","music: meteor shower":"comet","space":"rocket","space walk":"rocket","interstellar voyage":"rocket","planet":"planet","music: orbit":"planet","mars":"mars","venus":"venus","jupiter":"jupiter","mercury":"mercury","saturn":"saturn","uranus":"uranus","neptune":"neptune","earth":"earth","music: ufo":"ufo","snow flake":"snow","snowing":"snow","accumulated snow":"snow","winter":"snow","glacier":"iceberg","cool":"iceberg","ocean":"wave","wave":"wave","seaside":"wave","orange sea":"wave","ripple":"ripple","fluctuate":"ripple","music: ripple":"ripple","music: fountain":"ripple","music: splash":"ripple","water drop":"drop","dripping":"drop","blue":"drop","river":"river","riverside":"river","stream":"river","lake":"lake","almond lake":"lake","waterfall":"waterfall","sailboat":"sailboat","fish tank":"fish","goldfish":"fish","underwater":"fish","jellyfish":"jellyfish","deep sea":"jellyfish","beach":"palm","sunny beach":"palm","oasis":"palm","summer":"palm","summer b":"palm","home":"cottage","going home":"cottage","beachside cottage":"cottage","winter cottage":"cottage","secluded":"cottage","family day":"cottage","forest":"tree","grove":"tree","mountain forest":"tree","tree shadow":"tree","fall":"maple","autumn colors":"maple","falling leaves":"maple","rustling leaves":"maple","maple tree forest":"maple","blossom":"blossom","cherry blossoms":"blossom","spring":"blossom","spring tour":"blossom","mother's bloom":"blossom","music: spring":"blossom","early spring":"sprout","tree planting day":"sprout","music: sprouting":"sprout","healing":"sprout","flower field":"flower","maiden":"flower","mother's day":"flower","lavender":"lavender","sunflower":"sunflower","water lilies":"lily","lotus pond":"lily","herbal":"herb","mint":"herb","grassland":"meadow","meadow breeze":"meadow","field":"meadow","green wheat field":"wheat","wheat wave":"wheat","cornfield":"corn","haystack":"hay","peach":"peach","mesocarp":"peach","lemon summer":"lemon","berry":"berry","watermelon":"watermelon","ice drinks":"icedrink","refreshing":"icedrink","mountains":"mountain","snowy mountain":"mountain","sunlit golden mountain":"mountain","hills":"hills","karst cave":"cave","delicate arch":"arch","desert":"desert","gobi desert":"desert","the pyramids":"pyramid","windmill":"windmill","butterfly":"butterfly","birdsong":"bird","gleam":"sparkle","glistening":"sparkle","twinkle":"sparkle","radiance":"sparkle","glisten":"sparkle","sparkle":"sparkle","enchant":"sparkle","opal":"sparkle","music: shiny":"sparkle","music: luminous":"sparkle","dreamland":"dream","dreamlike":"dream","light":"bulb","white light":"bulb","illumination":"bulb","marquee":"bulb","romance":"heart","romantic":"heart","passion":"heart","tenderness":"heart","unspoken love":"heart","valentine's day":"heart","accompany":"heart","heartbeat":"pulse","energetic":"pulse","rush":"pulse","tension":"pulse","jumping":"pulse","music: energic":"pulse","happy":"smile","joyful":"smile","cheerful":"smile","enthusiastic":"smile","excited":"smile","april fool's day":"smile","daze":"spiral","crazy":"spiral","lsd":"spiral","mysterious":"spiral","fascination":"spiral","music: spin":"spiral","music: disassociate":"spiral","candy":"candy","candy cane":"candy","sweet":"candy","date night":"wine","dating":"wine","night sips":"wine","dinner":"dinner","dine together":"dinner","thanksgiving":"dinner","tea time":"coffee","warm":"coffee","sleep":"bed","naps":"bed","night light":"bed","relax":"bed","leisure":"bed","mild":"bed","meditation":"lotus","yoga":"lotus","breathe":"lotus","blessing":"lotus","care":"lotus","spritual":"lotus","peaceful":"lotus","soothing":"lotus","quiet":"lotus","reading":"book","work":"laptop","movie":"movie","game":"game","greedy snake":"snakegame","sports":"sport","fight":"glove","alarm":"alarm","siren":"siren","police":"siren","police2":"siren","ghost":"ghost","ghost b":"ghost","graveyard":"ghost","fright":"ghost","halloween":"pumpkin","halloween b":"pumpkin","halloween c":"pumpkin","halloween d":"pumpkin","jack-o'-lantern":"pumpkin","pumpkin":"pumpkin","christmas":"xtree","christmas b":"xtree","christmas tree":"xtree","christmas bell":"bell","christmas wreath":"wreath","christmas gift":"gift","gift box":"gift","father's day":"gift","sled":"sleigh","dashing sleigh":"sleigh","driving santa":"sleigh","easter":"egg","easter egg":"egg","saint patrick's day":"clover","children's day":"balloon","labor day":"balloon","release":"balloon","birthday":"cake","happy birthday":"cake","fireworks":"fireworks","new years":"fireworks","party":"party","dance party":"party","disco":"disco","street dance":"disco","carnival":"mask","funfair":"ferris","rings":"rings","cyber":"city","cyber moments":"city","neon city":"city","graffiti":"spray","mona lisa":"frame","mucha style":"frame","matisse's colors":"frame","ukiyo-e colors":"frame","dunhuang colors":"palette","macaron colors":"palette","maillard style":"palette","memphis style":"palette","mondrian's colors":"palette","morandi colors":"palette","rococo style":"palette","music: color painting":"palette","gradient":"gradient","slow temp":"gradient","slow edge":"gradient","slowdown":"gradient","music: smudge":"gradient","the piano":"piano","music: pianokeys":"piano","facebook":"chat","twitter":"chat","whatsapp":"chat"};
const IRULES = [
  [/firefl/, 'firefly'], [/heart ?beat|\bpulse/, 'pulse'], [/night ?light|\bsleep|\bnaps?\b/, 'bed'],
  [/wheat/, 'wheat'], [/\bcorn|maize/, 'corn'], [/\bhay/, 'hay'], [/watermelon/, 'watermelon'], [/lemon|\blime\b|citrus/, 'lemon'], [/peach|apricot/, 'peach'], [/berry|grape/, 'berry'],
  [/autumn|\bfall\b|maple|leaves/, 'maple'], [/ripple|fluctuat/, 'ripple'], [/christmas ?bell|jingle|\bbells?\b/, 'bell'], [/wreath/, 'wreath'], [/sleigh|\bsled|santa/, 'sleigh'],
  [/christmas|xmas|noel/, 'xtree'], [/easter|\beggs?\b/, 'egg'], [/pumpkin|halloween|jack/, 'pumpkin'], [/butterfl/, 'butterfly'], [/\bbird|songbird/, 'bird'], [/jelly/, 'jellyfish'],
  [/\bfish|aquarium|koi\b/, 'fish'], [/\bsail|\bboat|yacht/, 'sailboat'], [/waterfall/, 'waterfall'], [/river|stream|creek/, 'river'], [/\blake|\bpond/, 'lake'], [/cottage|cabin|\bhome\b|house/, 'cottage'],
  [/beach|\bpalm|tropic|oasis|island/, 'palm'], [/pyramid/, 'pyramid'], [/windmill/, 'windmill'], [/candy|sweet|lollipop/, 'candy'], [/birthday|\bcake/, 'cake'], [/firework/, 'fireworks'], [/balloon/, 'balloon'],
  [/carnival|\bmask|masquerade/, 'mask'], [/police|siren|emergency/, 'siren'], [/piano/, 'piano'], [/snake/, 'snakegame'], [/rocket|space ?walk|spaceship|\bspace\b/, 'rocket'], [/comet|meteor/, 'comet'],
  [/\bearth\b|globe/, 'earth'], [/\bufo\b/, 'ufo'], [/\bfog|mist|haze/, 'fog'], [/drink|cocktail|juice|refresh/, 'icedrink'], [/wine|champagne|date ?night|dating/, 'wine'], [/dinner|\bdine|lunch|breakfast|\bmeal/, 'dinner'],
  [/\bwork\b|office|laptop|computer/, 'laptop'], [/happy|joy|cheer|smile/, 'smile'], [/spiral|hypno|psyche|trippy|daze|vortex|swirl|crazy|myster/, 'spiral'], [/\bwind|breeze/, 'wind'],
  [/bulb|\blamp\b|white light|^light$|illumin|marquee/, 'bulb'], [/\bchat|message|social/, 'chat'], [/\brings?\b|wedding/, 'rings'], [/\barch\b/, 'arch'], [/blossom|cherry|sakura|spring/, 'blossom'],
  [/lavender/, 'lavender'], [/sunflower/, 'sunflower'], [/lil(y|ies)|lotus pond/, 'lily'], [/herb|\bmint\b|basil/, 'herb'], [/meadow|grass|field|prairie/, 'meadow'], [/\bhills?\b/, 'hills'], [/\bcave/, 'cave'],
  [/glacier|iceberg|arctic|polar/, 'iceberg'], [/dream/, 'dream'], [/fight|boxing|punch/, 'glove'], [/clover|patrick|lucky/, 'clover'], [/sprout|seedling|\bgrow|planting/, 'sprout'],
  [/funfair|ferris|amusement/, 'ferris'], [/graffiti|spray/, 'spray'], [/mona|portrait|gallery|museum/, 'frame'], [/dance|disco/, 'disco'], [/\btrees?\b|forest|\bwoods?\b|grove|jungle/, 'tree'],
  [/valentine/, 'heart'], [/mother'?s? day/, 'flower'], [/father'?s? day/, 'gift'], [/holiday|(children|family|labor|labour|teacher|women|independence)'?s? day/, 'balloon']
];

// Effect icons: full-colour drawings on a dark disc (original set). Each part is drawn twice: a dark halo, then the coloured part.
// Generated by dev/icongen/gen2.py
const ICON2 = {
  "fire": "<path class=\"q-h\" d=\"M11 39l26-6M11 33l26 6\"/><path style=\"--c:#B5703F\" d=\"M11 39l26-6M11 33l26 6\"/><path class=\"q-h\" d=\"M24 7c3 6 9.5 9 9.5 17.5a9.5 9.5 0 0 1-19 0c0-4.5 2.2-7.5 4.4-9.6.1 3 1.2 5 3.1 6.2C21 16 22 11 24 7z\"/><path style=\"--c:#FF4A2B\" class=\"q-f\" d=\"M24 7c3 6 9.5 9 9.5 17.5a9.5 9.5 0 0 1-19 0c0-4.5 2.2-7.5 4.4-9.6.1 3 1.2 5 3.1 6.2C21 16 22 11 24 7z\"/><path class=\"q-h\" d=\"M24 31.5a4.3 4.3 0 0 1-4.3-4.3c0-3.2 2.6-4.6 3.7-7.2 1.6 2.6 4.9 4 4.9 7.3 0 2.3-1.9 4.2-4.3 4.2z\"/><path style=\"--c:#FFD84A\" class=\"q-w\" d=\"M24 31.5a4.3 4.3 0 0 1-4.3-4.3c0-3.2 2.6-4.6 3.7-7.2 1.6 2.6 4.9 4 4.9 7.3 0 2.3-1.9 4.2-4.3 4.2z\"/><circle class=\"q-h\" cx=\"13\" cy=\"14\" r=\"1.6\"/><circle style=\"--c:#FFB13B\" class=\"q-w\" cx=\"13\" cy=\"14\" r=\"1.6\"/><circle class=\"q-h\" cx=\"37\" cy=\"13\" r=\"1.4\"/><circle style=\"--c:#FF7A3D\" class=\"q-w\" cx=\"37\" cy=\"13\" r=\"1.4\"/>",
  "wave": "<circle class=\"q-h\" cx=\"35\" cy=\"12\" r=\"4.5\"/><circle style=\"--c:#FFD54A\" class=\"q-f\" cx=\"35\" cy=\"12\" r=\"4.5\"/><path class=\"q-h\" d=\"M5 33c3.5-11 11.5-17 20.5-17 4.8 0 8.2 2.4 9.4 5.8-4.4-1.9-9.4.2-9.4 5 0 3.2 2.4 5.4 5.8 5.4V35H5z\"/><path style=\"--c:#2E7CF6\" class=\"q-f\" d=\"M5 33c3.5-11 11.5-17 20.5-17 4.8 0 8.2 2.4 9.4 5.8-4.4-1.9-9.4.2-9.4 5 0 3.2 2.4 5.4 5.8 5.4V35H5z\"/><path class=\"q-h\" d=\"M6 37.5c3 0 4-2.2 6.6-2.2s3.6 2.2 6.6 2.2 4-2.2 6.6-2.2 3.6 2.2 6.6 2.2 4-2.2 6.6-2.2\"/><path style=\"--c:#45D3E8\" d=\"M6 37.5c3 0 4-2.2 6.6-2.2s3.6 2.2 6.6 2.2 4-2.2 6.6-2.2 3.6 2.2 6.6 2.2 4-2.2 6.6-2.2\"/><path class=\"q-h\" d=\"M10 43c2.6 0 3.4-1.8 5.6-1.8s3 1.8 5.6 1.8 3.4-1.8 5.6-1.8 3 1.8 5.6 1.8\"/><path style=\"--c:#7FB2FF\" d=\"M10 43c2.6 0 3.4-1.8 5.6-1.8s3 1.8 5.6 1.8 3.4-1.8 5.6-1.8 3 1.8 5.6 1.8\"/>",
  "tree": "<path class=\"q-h\" d=\"M9.5 16l6 8.5h-3l4.5 8H2.5l4.5-8H4z\"/><path style=\"--c:#A6E35A\" class=\"q-f\" d=\"M9.5 16l6 8.5h-3l4.5 8H2.5l4.5-8H4z\"/><path class=\"q-h\" d=\"M38.5 18l5.5 8h-3l4 7H33l4-7h-3z\"/><path style=\"--c:#2EC4D0\" class=\"q-f\" d=\"M38.5 18l5.5 8h-3l4 7H33l4-7h-3z\"/><path class=\"q-h\" d=\"M24 6l7.5 10.5H28l6 8.5h-4.5l5.5 8.5H13l5.5-8.5H14l6-8.5h-3.5z\"/><path style=\"--c:#1FA855\" class=\"q-f\" d=\"M24 6l7.5 10.5H28l6 8.5h-4.5l5.5 8.5H13l5.5-8.5H14l6-8.5h-3.5z\"/><path class=\"q-h\" d=\"M4 40h40M24 33.5v6.5M9.5 32.5V40M38.5 33v7\"/><path style=\"--c:#B98A5E\" d=\"M4 40h40M24 33.5v6.5M9.5 32.5V40M38.5 33v7\"/><path class=\"q-h\" d=\"M33 8.5l2 1.4 2-1.4\"/><path style=\"--c:#E9EEF5\" class=\"q-t\" d=\"M33 8.5l2 1.4 2-1.4\"/>",
  "moon": "<path class=\"q-h\" d=\"M29 7a16 16 0 1 0 12 25.5A13 13 0 0 1 29 7z\"/><path style=\"--c:#FFD24A\" class=\"q-f\" d=\"M29 7a16 16 0 1 0 12 25.5A13 13 0 0 1 29 7z\"/><path class=\"q-h\" d=\"M15.6 11.0 L13.1 12.1 L12.0 14.6 L10.9 12.1 L8.4 11.0 L10.9 9.9 L12.0 7.4 L13.1 9.9z\"/><path style=\"--c:#FFFFFF\" class=\"q-w\" d=\"M15.6 11.0 L13.1 12.1 L12.0 14.6 L10.9 12.1 L8.4 11.0 L10.9 9.9 L12.0 7.4 L13.1 9.9z\"/><path class=\"q-h\" d=\"M21.2 19.0 L19.6 19.6 L19.0 21.2 L18.4 19.6 L16.8 19.0 L18.4 18.4 L19.0 16.8 L19.6 18.4z\"/><path style=\"--c:#FFF3B0\" class=\"q-w\" d=\"M21.2 19.0 L19.6 19.6 L19.0 21.2 L18.4 19.6 L16.8 19.0 L18.4 18.4 L19.0 16.8 L19.6 18.4z\"/><circle class=\"q-h\" cx=\"9\" cy=\"23\" r=\"1.1\"/><circle style=\"--c:#C7D2FF\" class=\"q-w\" cx=\"9\" cy=\"23\" r=\"1.1\"/><path class=\"q-h\" d=\"M8 40a4.5 4.5 0 0 1 4.3-4.6 6.5 6.5 0 0 1 12.3 1 3.8 3.8 0 0 1 0 7.6H12.5A4.5 4.5 0 0 1 8 40z\"/><path style=\"--c:#8FA8FF\" class=\"q-f\" d=\"M8 40a4.5 4.5 0 0 1 4.3-4.6 6.5 6.5 0 0 1 12.3 1 3.8 3.8 0 0 1 0 7.6H12.5A4.5 4.5 0 0 1 8 40z\"/>",
  "star": "<path class=\"q-h\" d=\"M25.0 9.0 L27.4 14.8 L33.6 15.2 L28.8 19.2 L30.3 25.3 L25.0 22.0 L19.7 25.3 L21.2 19.2 L16.4 15.2 L22.6 14.8z\"/><path style=\"--c:#FFD54A\" class=\"q-f\" d=\"M25.0 9.0 L27.4 14.8 L33.6 15.2 L28.8 19.2 L30.3 25.3 L25.0 22.0 L19.7 25.3 L21.2 19.2 L16.4 15.2 L22.6 14.8z\"/><path class=\"q-h\" d=\"M4 41c6-6.5 12-6.5 18-2.5 6-6.5 14-7.5 22 0\"/><path style=\"--c:#7C6CFF\" d=\"M4 41c6-6.5 12-6.5 18-2.5 6-6.5 14-7.5 22 0\"/><path class=\"q-h\" d=\"M6 9l8 4.5\"/><path style=\"--c:#FF9AD5\" d=\"M6 9l8 4.5\"/><circle class=\"q-h\" cx=\"15.5\" cy=\"14.3\" r=\"1.6\"/><circle style=\"--c:#FFFFFF\" class=\"q-w\" cx=\"15.5\" cy=\"14.3\" r=\"1.6\"/><path class=\"q-h\" d=\"M39 5.8Q39 9 42.2 9Q39 9 39 12.2Q39 9 35.8 9Q39 9 39 5.8z\"/><path style=\"--c:#8FE3FF\" class=\"q-w\" d=\"M39 5.8Q39 9 42.2 9Q39 9 39 12.2Q39 9 35.8 9Q39 9 39 5.8z\"/><circle class=\"q-h\" cx=\"9\" cy=\"27\" r=\"1.1\"/><circle style=\"--c:#FFE27A\" class=\"q-w\" cx=\"9\" cy=\"27\" r=\"1.1\"/><circle class=\"q-h\" cx=\"40\" cy=\"26\" r=\"1.2\"/><circle style=\"--c:#B39CFF\" class=\"q-w\" cx=\"40\" cy=\"26\" r=\"1.2\"/><circle class=\"q-h\" cx=\"33\" cy=\"32\" r=\"0.9\"/><circle style=\"--c:#FFFFFF\" class=\"q-w\" cx=\"33\" cy=\"32\" r=\"0.9\"/>",
  "snow": "<path class=\"q-h\" d=\"M24 24L24.0 7.0M24.0 15.0L20.8 11.8M24.0 15.0L27.2 11.8M24.0 10.0L21.5 7.5M24.0 10.0L26.5 7.5M24 24L38.7 15.5M31.8 19.5L33.0 15.2M31.8 19.5L36.1 20.7M36.1 17.0L37.0 13.6M36.1 17.0L39.5 17.9M24 24L38.7 32.5M31.8 28.5L36.1 27.3M31.8 28.5L33.0 32.8M36.1 31.0L39.5 30.1M36.1 31.0L37.0 34.4M24 24L24.0 41.0M24.0 33.0L27.2 36.2M24.0 33.0L20.8 36.2M24.0 38.0L26.5 40.5M24.0 38.0L21.5 40.5M24 24L9.3 32.5M16.2 28.5L15.0 32.8M16.2 28.5L11.9 27.3M11.9 31.0L11.0 34.4M11.9 31.0L8.5 30.1M24 24L9.3 15.5M16.2 19.5L11.9 20.7M16.2 19.5L15.0 15.2M11.9 17.0L8.5 17.9M11.9 17.0L11.0 13.6\"/><path style=\"--c:#7FD8FF\" d=\"M24 24L24.0 7.0M24.0 15.0L20.8 11.8M24.0 15.0L27.2 11.8M24.0 10.0L21.5 7.5M24.0 10.0L26.5 7.5M24 24L38.7 15.5M31.8 19.5L33.0 15.2M31.8 19.5L36.1 20.7M36.1 17.0L37.0 13.6M36.1 17.0L39.5 17.9M24 24L38.7 32.5M31.8 28.5L36.1 27.3M31.8 28.5L33.0 32.8M36.1 31.0L39.5 30.1M36.1 31.0L37.0 34.4M24 24L24.0 41.0M24.0 33.0L27.2 36.2M24.0 33.0L20.8 36.2M24.0 38.0L26.5 40.5M24.0 38.0L21.5 40.5M24 24L9.3 32.5M16.2 28.5L15.0 32.8M16.2 28.5L11.9 27.3M11.9 31.0L11.0 34.4M11.9 31.0L8.5 30.1M24 24L9.3 15.5M16.2 19.5L11.9 20.7M16.2 19.5L15.0 15.2M11.9 17.0L8.5 17.9M11.9 17.0L11.0 13.6\"/><path class=\"q-h\" d=\"M24.0 19.5L27.9 21.8L27.9 26.2L24.0 28.5L20.1 26.2L20.1 21.8z\"/><path style=\"--c:#FFFFFF\" class=\"q-f\" d=\"M24.0 19.5L27.9 21.8L27.9 26.2L24.0 28.5L20.1 26.2L20.1 21.8z\"/><path class=\"q-h\" d=\"M41 5.4Q41 8 43.6 8Q41 8 41 10.6Q41 8 38.4 8Q41 8 41 5.4z\"/><path style=\"--c:#B8F0FF\" class=\"q-w\" d=\"M41 5.4Q41 8 43.6 8Q41 8 41 10.6Q41 8 38.4 8Q41 8 41 5.4z\"/><circle class=\"q-h\" cx=\"7\" cy=\"40\" r=\"1.2\"/><circle style=\"--c:#9AB8FF\" class=\"q-w\" cx=\"7\" cy=\"40\" r=\"1.2\"/>",
  "sunrise": "<path class=\"q-h\" d=\"M13 34a11 11 0 0 1 22 0z\"/><path style=\"--c:#FFB23F\" class=\"q-f\" d=\"M13 34a11 11 0 0 1 22 0z\"/><path class=\"q-h\" d=\"M4 34h40M10.8 29.2L6.1 27.5M15.0 23.3L11.8 19.4M21.6 20.2L20.7 15.3M26.4 20.2L27.3 15.3M33.0 23.3L36.2 19.4M37.2 29.2L41.9 27.5\"/><path style=\"--c:#FF7A45\" d=\"M4 34h40M10.8 29.2L6.1 27.5M15.0 23.3L11.8 19.4M21.6 20.2L20.7 15.3M26.4 20.2L27.3 15.3M33.0 23.3L36.2 19.4M37.2 29.2L41.9 27.5\"/><path class=\"q-h\" d=\"M9 39.5h9M22 39.5h13M15 44h17\"/><path style=\"--c:#FFD27A\" d=\"M9 39.5h9M22 39.5h13M15 44h17\"/><path class=\"q-h\" d=\"M33 10l2 1.4 2-1.4M38 14l1.5 1 1.5-1\"/><path style=\"--c:#E9EEF5\" class=\"q-t\" d=\"M33 10l2 1.4 2-1.4M38 14l1.5 1 1.5-1\"/>",
  "heart": "<path class=\"q-h\" d=\"M19 39S7 31.8 7 22.6A7 7 0 0 1 19 17.8a7 7 0 0 1 12 4.8C31 31.8 19 39 19 39z\"/><path style=\"--c:#FF3B5C\" class=\"q-f\" d=\"M19 39S7 31.8 7 22.6A7 7 0 0 1 19 17.8a7 7 0 0 1 12 4.8C31 31.8 19 39 19 39z\"/><path class=\"q-h\" d=\"M33 29s-6.5-3.9-6.5-8.8a3.8 3.8 0 0 1 6.5-2.6 3.8 3.8 0 0 1 6.5 2.6c0 4.9-6.5 8.8-6.5 8.8z\"/><path style=\"--c:#FFA3CF\" class=\"q-f\" d=\"M33 29s-6.5-3.9-6.5-8.8a3.8 3.8 0 0 1 6.5-2.6 3.8 3.8 0 0 1 6.5 2.6c0 4.9-6.5 8.8-6.5 8.8z\"/><path class=\"q-h\" d=\"M36 5.6Q36 9 39.4 9Q36 9 36 12.4Q36 9 32.6 9Q36 9 36 5.6z\"/><path style=\"--c:#FFD54A\" class=\"q-w\" d=\"M36 5.6Q36 9 39.4 9Q36 9 36 12.4Q36 9 32.6 9Q36 9 36 5.6z\"/><circle class=\"q-h\" cx=\"10\" cy=\"11\" r=\"1.2\"/><circle style=\"--c:#FFFFFF\" class=\"q-w\" cx=\"10\" cy=\"11\" r=\"1.2\"/>",
  "music": "<path class=\"q-h\" d=\"M17 34V12l18-4v22\"/><path style=\"--c:#B57BFF\" d=\"M17 34V12l18-4v22\"/><path class=\"q-h\" d=\"M17 17.5l18-4\"/><path style=\"--c:#B57BFF\" d=\"M17 17.5l18-4\"/><ellipse class=\"q-h\" cx=\"12.5\" cy=\"34.5\" rx=\"5\" ry=\"4\" transform=\"rotate(-18 12.5 34.5)\"/><ellipse style=\"--c:#FF6FD8\" class=\"q-f\" cx=\"12.5\" cy=\"34.5\" rx=\"5\" ry=\"4\" transform=\"rotate(-18 12.5 34.5)\"/><ellipse class=\"q-h\" cx=\"30.5\" cy=\"30.5\" rx=\"5\" ry=\"4\" transform=\"rotate(-18 30.5 30.5)\"/><ellipse style=\"--c:#5AC8FA\" class=\"q-f\" cx=\"30.5\" cy=\"30.5\" rx=\"5\" ry=\"4\" transform=\"rotate(-18 30.5 30.5)\"/><path class=\"q-h\" d=\"M40 16c2 1.6 2 5 0 6.6M43 13c3.6 3.2 3.6 9.4 0 12.6\"/><path style=\"--c:#FFD54A\" class=\"q-t\" d=\"M40 16c2 1.6 2 5 0 6.6M43 13c3.6 3.2 3.6 9.4 0 12.6\"/>",
  "aurora": "<path class=\"q-h\" d=\"M4 41l9-12 6 6.5 8-11.5 9 11 3-3 5 9z\"/><path style=\"--c:#4F63FF\" class=\"q-f\" d=\"M4 41l9-12 6 6.5 8-11.5 9 11 3-3 5 9z\"/><path class=\"q-h\" d=\"M5 20c5-6 9 2 15-3s9-6 14-2 7 1 9-1\"/><path style=\"--c:#3DF5A8\" d=\"M5 20c5-6 9 2 15-3s9-6 14-2 7 1 9-1\"/><path class=\"q-h\" d=\"M6 26c5-4 9 1 15-2.5s9-4 14-1 6 .5 8-1\"/><path style=\"--c:#D07DFF\" class=\"q-t\" d=\"M6 26c5-4 9 1 15-2.5s9-4 14-1 6 .5 8-1\"/><circle class=\"q-h\" cx=\"10\" cy=\"9\" r=\"1.3\"/><circle style=\"--c:#FFFFFF\" class=\"q-w\" cx=\"10\" cy=\"9\" r=\"1.3\"/><circle class=\"q-h\" cx=\"30\" cy=\"7\" r=\"1\"/><circle style=\"--c:#FFFFFF\" class=\"q-w\" cx=\"30\" cy=\"7\" r=\"1\"/><circle class=\"q-h\" cx=\"40\" cy=\"11\" r=\"1.2\"/><circle style=\"--c:#FFFFFF\" class=\"q-w\" cx=\"40\" cy=\"11\" r=\"1.2\"/>",
  "candle": "<circle class=\"q-h\" cx=\"17\" cy=\"14\" r=\"8\"/><circle style=\"--c:#FFC94A\" class=\"q-g\" cx=\"17\" cy=\"14\" r=\"8\"/><path class=\"q-h\" d=\"M17 6.5c2 2.4 3 4.2 3 5.8a3 3 0 0 1-6 0c0-1.6 1-3.4 3-5.8z\"/><path style=\"--c:#FF8A3D\" class=\"q-f\" d=\"M17 6.5c2 2.4 3 4.2 3 5.8a3 3 0 0 1-6 0c0-1.6 1-3.4 3-5.8z\"/><rect class=\"q-h\" x=\"12\" y=\"19\" width=\"10\" height=\"21\" rx=\"2.5\"/><rect style=\"--c:#FFE6C2\" class=\"q-f\" x=\"12\" y=\"19\" width=\"10\" height=\"21\" rx=\"2.5\"/><path class=\"q-h\" d=\"M12 24c1.7 1 3.3 1 5 0s3.3-1 5 0\"/><path style=\"--c:#E8B98A\" d=\"M12 24c1.7 1 3.3 1 5 0s3.3-1 5 0\"/><path class=\"q-h\" d=\"M32 16.5c1.5 1.8 2.3 3.2 2.3 4.4a2.3 2.3 0 0 1-4.6 0c0-1.2.8-2.6 2.3-4.4z\"/><path style=\"--c:#FFB13B\" class=\"q-w\" d=\"M32 16.5c1.5 1.8 2.3 3.2 2.3 4.4a2.3 2.3 0 0 1-4.6 0c0-1.2.8-2.6 2.3-4.4z\"/><rect class=\"q-h\" x=\"28\" y=\"26\" width=\"8\" height=\"14\" rx=\"2\"/><rect style=\"--c:#F5C9A6\" class=\"q-f\" x=\"28\" y=\"26\" width=\"8\" height=\"14\" rx=\"2\"/><path class=\"q-h\" d=\"M8 41.5h32\"/><path style=\"--c:#C79A6B\" d=\"M8 41.5h32\"/>",
  "rain": "<path class=\"q-h\" d=\"M13 27a7.5 7.5 0 0 1 .8-14.9A10.5 10.5 0 0 1 34 14.8 6.2 6.2 0 0 1 35.5 27z\"/><path style=\"--c:#9FB4FF\" class=\"q-f\" d=\"M13 27a7.5 7.5 0 0 1 .8-14.9A10.5 10.5 0 0 1 34 14.8 6.2 6.2 0 0 1 35.5 27z\"/><path class=\"q-h\" d=\"M14 32l-2 5M21 32l-2 5M28 32l-2 5M35 32l-2 5M17.5 39.5l-1.5 3.5M24.5 39.5l-1.5 3.5M31.5 39.5l-1.5 3.5\"/><path style=\"--c:#3FA9FF\" d=\"M14 32l-2 5M21 32l-2 5M28 32l-2 5M35 32l-2 5M17.5 39.5l-1.5 3.5M24.5 39.5l-1.5 3.5M31.5 39.5l-1.5 3.5\"/>",
  "galaxy": "<ellipse class=\"q-h\" cx=\"24\" cy=\"24\" rx=\"19\" ry=\"8\" transform=\"rotate(-25 24 24)\"/><ellipse style=\"--c:#8A5BFF\" class=\"q-f\" cx=\"24\" cy=\"24\" rx=\"19\" ry=\"8\" transform=\"rotate(-25 24 24)\"/><ellipse class=\"q-h\" cx=\"24\" cy=\"24\" rx=\"12\" ry=\"5\" transform=\"rotate(-25 24 24)\"/><ellipse style=\"--c:#FF7AD9\" class=\"q-f\" cx=\"24\" cy=\"24\" rx=\"12\" ry=\"5\" transform=\"rotate(-25 24 24)\"/><circle class=\"q-h\" cx=\"24\" cy=\"24\" r=\"5.5\"/><circle style=\"--c:#FFE066\" class=\"q-f\" cx=\"24\" cy=\"24\" r=\"5.5\"/><path class=\"q-h\" d=\"M40 6Q40 9 43 9Q40 9 40 12Q40 9 37 9Q40 9 40 6z\"/><path style=\"--c:#FFFFFF\" class=\"q-w\" d=\"M40 6Q40 9 43 9Q40 9 40 12Q40 9 37 9Q40 9 40 6z\"/><circle class=\"q-h\" cx=\"8\" cy=\"12\" r=\"1.1\"/><circle style=\"--c:#FF9AD5\" class=\"q-w\" cx=\"8\" cy=\"12\" r=\"1.1\"/><circle class=\"q-h\" cx=\"41\" cy=\"38\" r=\"1.2\"/><circle style=\"--c:#8FE3FF\" class=\"q-w\" cx=\"41\" cy=\"38\" r=\"1.2\"/><circle class=\"q-h\" cx=\"9\" cy=\"39\" r=\"0.9\"/><circle style=\"--c:#FFFFFF\" class=\"q-w\" cx=\"9\" cy=\"39\" r=\"0.9\"/>",
  "flower": "<g class=\"q-h\"><ellipse cx=\"24\" cy=\"10.5\" rx=\"4\" ry=\"5.5\"/><ellipse cx=\"24\" cy=\"10.5\" rx=\"4\" ry=\"5.5\" transform=\"rotate(72 24 17)\"/><ellipse cx=\"24\" cy=\"10.5\" rx=\"4\" ry=\"5.5\" transform=\"rotate(144 24 17)\"/><ellipse cx=\"24\" cy=\"10.5\" rx=\"4\" ry=\"5.5\" transform=\"rotate(216 24 17)\"/><ellipse cx=\"24\" cy=\"10.5\" rx=\"4\" ry=\"5.5\" transform=\"rotate(288 24 17)\"/></g><g style=\"--c:#FF5FA2\" class=\"q-f\"><ellipse cx=\"24\" cy=\"10.5\" rx=\"4\" ry=\"5.5\"/><ellipse cx=\"24\" cy=\"10.5\" rx=\"4\" ry=\"5.5\" transform=\"rotate(72 24 17)\"/><ellipse cx=\"24\" cy=\"10.5\" rx=\"4\" ry=\"5.5\" transform=\"rotate(144 24 17)\"/><ellipse cx=\"24\" cy=\"10.5\" rx=\"4\" ry=\"5.5\" transform=\"rotate(216 24 17)\"/><ellipse cx=\"24\" cy=\"10.5\" rx=\"4\" ry=\"5.5\" transform=\"rotate(288 24 17)\"/></g><circle class=\"q-h\" cx=\"24\" cy=\"17\" r=\"3.4\"/><circle style=\"--c:#FFD54A\" class=\"q-w\" cx=\"24\" cy=\"17\" r=\"3.4\"/><path class=\"q-h\" d=\"M24 24v18M24 35c-3-4-7.5-5-11-4 1.8 3.8 6.5 5.5 11 4zM24 31c3-4 7.5-5 11-4-1.8 3.8-6.5 5.5-11 4z\"/><path style=\"--c:#3DDC84\" class=\"q-f\" d=\"M24 24v18M24 35c-3-4-7.5-5-11-4 1.8 3.8 6.5 5.5 11 4zM24 31c3-4 7.5-5 11-4-1.8 3.8-6.5 5.5-11 4z\"/>",
  "coffee": "<path class=\"q-h\" d=\"M9 19h23v8.5A10.5 10.5 0 0 1 21.5 38h-2A10.5 10.5 0 0 1 9 27.5z\"/><path style=\"--c:#C9874A\" class=\"q-f\" d=\"M9 19h23v8.5A10.5 10.5 0 0 1 21.5 38h-2A10.5 10.5 0 0 1 9 27.5z\"/><path class=\"q-h\" d=\"M32 21.5h3a5 5 0 0 1 0 10h-4.2\"/><path style=\"--c:#C9874A\" d=\"M32 21.5h3a5 5 0 0 1 0 10h-4.2\"/><path class=\"q-h\" d=\"M5 41.5h31\"/><path style=\"--c:#E8D2B8\" d=\"M5 41.5h31\"/><path class=\"q-h\" d=\"M15 7c-1.6 2 1.6 4 0 6M21 5c-1.6 2 1.6 4 0 6M27 7c-1.6 2 1.6 4 0 6\"/><path style=\"--c:#E9EEF5\" class=\"q-t\" d=\"M15 7c-1.6 2 1.6 4 0 6M21 5c-1.6 2 1.6 4 0 6M27 7c-1.6 2 1.6 4 0 6\"/>",
  "movie": "<path class=\"q-h\" d=\"M6 20h36v18a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4z\"/><path style=\"--c:#6C5CFF\" class=\"q-f\" d=\"M6 20h36v18a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4z\"/><path class=\"q-h\" d=\"M5.5 12.5l33-7 1.4 6.8-33 7z\"/><path style=\"--c:#F2F4F8\" class=\"q-f\" d=\"M5.5 12.5l33-7 1.4 6.8-33 7z\"/><path class=\"q-h\" d=\"M20 25.5l10 5.5-10 5.5z\"/><path style=\"--c:#FFD54A\" class=\"q-w\" d=\"M20 25.5l10 5.5-10 5.5z\"/><circle class=\"q-h\" cx=\"12\" cy=\"31\" r=\"2\"/><circle style=\"--c:#FF6A88\" class=\"q-w\" cx=\"12\" cy=\"31\" r=\"2\"/><circle class=\"q-h\" cx=\"36\" cy=\"31\" r=\"2\"/><circle style=\"--c:#3FD0F0\" class=\"q-w\" cx=\"36\" cy=\"31\" r=\"2\"/><path class=\"q-h\" d=\"M14 10.5l3 6M22 8.8l3 6M30 7.1l3 6\"/><path style=\"--c:#1d1f23\" class=\"q-t\" d=\"M14 10.5l3 6M22 8.8l3 6M30 7.1l3 6\"/>",
  "drop": "<path class=\"q-h\" d=\"M24 5c6 8 13 15 13 23a13 13 0 0 1-26 0c0-8 7-15 13-23z\"/><path style=\"--c:#3FA9FF\" class=\"q-f\" d=\"M24 5c6 8 13 15 13 23a13 13 0 0 1-26 0c0-8 7-15 13-23z\"/><path class=\"q-h\" d=\"M17.5 29a7 7 0 0 0 5 6\"/><path style=\"--c:#E3F6FF\" class=\"q-t\" d=\"M17.5 29a7 7 0 0 0 5 6\"/><path class=\"q-h\" d=\"M39 6c2 2.6 3.3 4.4 3.3 6a3.3 3.3 0 0 1-6.6 0c0-1.6 1.3-3.4 3.3-6z\"/><path style=\"--c:#7FE3FF\" class=\"q-f\" d=\"M39 6c2 2.6 3.3 4.4 3.3 6a3.3 3.3 0 0 1-6.6 0c0-1.6 1.3-3.4 3.3-6z\"/>",
  "leaf": "<path class=\"q-h\" d=\"M7 41C7 23 17 9.5 41 7c-1 22-12.5 34-34 34z\"/><path style=\"--c:#3DDC84\" class=\"q-f\" d=\"M7 41C7 23 17 9.5 41 7c-1 22-12.5 34-34 34z\"/><path class=\"q-h\" d=\"M8 40C16 31 24 22.5 33 15\"/><path style=\"--c:#167A3E\" class=\"q-t\" d=\"M8 40C16 31 24 22.5 33 15\"/><path class=\"q-h\" d=\"M30 43c0-6.5 3.2-10.5 11-11.5 0 7.5-4.2 11.5-11 11.5z\"/><path style=\"--c:#FFB13B\" class=\"q-f\" d=\"M30 43c0-6.5 3.2-10.5 11-11.5 0 7.5-4.2 11.5-11 11.5z\"/>",
  "sun": "<path class=\"q-h\" d=\"M37.0 24.0L43.0 24.0M34.5 31.6L39.4 35.2M28.0 36.4L29.9 42.1M20.0 36.4L18.1 42.1M13.5 31.6L8.6 35.2M11.0 24.0L5.0 24.0M13.5 16.4L8.6 12.8M20.0 11.6L18.1 5.9M28.0 11.6L29.9 5.9M34.5 16.4L39.4 12.8\"/><path style=\"--c:#FF9F2E\" d=\"M37.0 24.0L43.0 24.0M34.5 31.6L39.4 35.2M28.0 36.4L29.9 42.1M20.0 36.4L18.1 42.1M13.5 31.6L8.6 35.2M11.0 24.0L5.0 24.0M13.5 16.4L8.6 12.8M20.0 11.6L18.1 5.9M28.0 11.6L29.9 5.9M34.5 16.4L39.4 12.8\"/><circle class=\"q-h\" cx=\"24\" cy=\"24\" r=\"9.5\"/><circle style=\"--c:#FFC83D\" class=\"q-f\" cx=\"24\" cy=\"24\" r=\"9.5\"/><circle class=\"q-h\" cx=\"21\" cy=\"21\" r=\"3\"/><circle style=\"--c:#FFF3B0\" class=\"q-w\" cx=\"21\" cy=\"21\" r=\"3\"/>",
  "sunset": "<path class=\"q-h\" d=\"M24 5v9M19.5 10l4.5 4.5 4.5-4.5\"/><path style=\"--c:#FFB13B\" d=\"M24 5v9M19.5 10l4.5 4.5 4.5-4.5\"/><path class=\"q-h\" d=\"M12 32a12 12 0 0 1 24 0z\"/><path style=\"--c:#FF6A3D\" class=\"q-f\" d=\"M12 32a12 12 0 0 1 24 0z\"/><path class=\"q-h\" d=\"M4 32h40\"/><path style=\"--c:#FF4F8F\" d=\"M4 32h40\"/><path class=\"q-h\" d=\"M10 38h10M24 38h14M16 43h16\"/><path style=\"--c:#C46BFF\" d=\"M10 38h10M24 38h14M16 43h16\"/><circle class=\"q-h\" cx=\"9\" cy=\"14\" r=\"1.5\"/><circle style=\"--c:#FFE27A\" class=\"q-w\" cx=\"9\" cy=\"14\" r=\"1.5\"/><circle class=\"q-h\" cx=\"39\" cy=\"12\" r=\"1.3\"/><circle style=\"--c:#FFFFFF\" class=\"q-w\" cx=\"39\" cy=\"12\" r=\"1.3\"/>",
  "planet": "<circle class=\"q-h\" cx=\"22\" cy=\"25\" r=\"11\"/><circle style=\"--c:#FF8A5A\" class=\"q-f\" cx=\"22\" cy=\"25\" r=\"11\"/><ellipse class=\"q-h\" cx=\"22\" cy=\"25\" rx=\"19\" ry=\"6\" transform=\"rotate(-20 22 25)\"/><ellipse style=\"--c:#FFD54A\" class=\"q-f\" cx=\"22\" cy=\"25\" rx=\"19\" ry=\"6\" transform=\"rotate(-20 22 25)\"/><circle class=\"q-h\" cx=\"40\" cy=\"9\" r=\"3.4\"/><circle style=\"--c:#C7D2FF\" class=\"q-f\" cx=\"40\" cy=\"9\" r=\"3.4\"/><path class=\"q-h\" d=\"M9 5.6Q9 9 12.4 9Q9 9 9 12.4Q9 9 5.6 9Q9 9 9 5.6z\"/><path style=\"--c:#FFFFFF\" class=\"q-w\" d=\"M9 5.6Q9 9 12.4 9Q9 9 9 12.4Q9 9 5.6 9Q9 9 9 5.6z\"/><circle class=\"q-h\" cx=\"40\" cy=\"38\" r=\"1.3\"/><circle style=\"--c:#8FE3FF\" class=\"q-w\" cx=\"40\" cy=\"38\" r=\"1.3\"/>",
  "cloud": "<path class=\"q-h\" d=\"M30 21a7 7 0 0 1 13 3.5A5.5 5.5 0 0 1 40 35H31\"/><path style=\"--c:#7E8CFF\" d=\"M30 21a7 7 0 0 1 13 3.5A5.5 5.5 0 0 1 40 35H31\"/><path class=\"q-h\" d=\"M12 38a8.5 8.5 0 0 1-.8-17A11 11 0 0 1 32.5 23 7.6 7.6 0 0 1 32 38z\"/><path style=\"--c:#E3ECFF\" class=\"q-f\" d=\"M12 38a8.5 8.5 0 0 1-.8-17A11 11 0 0 1 32.5 23 7.6 7.6 0 0 1 32 38z\"/>",
  "storm": "<path class=\"q-h\" d=\"M12 28a8.5 8.5 0 0 1-.8-17A11 11 0 0 1 32.5 13 7.6 7.6 0 0 1 33 28z\"/><path style=\"--c:#8E9BC7\" class=\"q-f\" d=\"M12 28a8.5 8.5 0 0 1-.8-17A11 11 0 0 1 32.5 13 7.6 7.6 0 0 1 33 28z\"/><path class=\"q-h\" d=\"M25 25l-7 10h6l-3 9 9-12h-6l3-7z\"/><path style=\"--c:#FFD23C\" class=\"q-f\" d=\"M25 25l-7 10h6l-3 9 9-12h-6l3-7z\"/><path class=\"q-h\" d=\"M12 33l-2 4M37 32l-2 4\"/><path style=\"--c:#3FA9FF\" d=\"M12 33l-2 4M37 32l-2 4\"/>",
  "rainbow": "<path class=\"q-h\" d=\"M5 36a19 19 0 0 1 38 0\"/><path style=\"--c:#FF4F5E\" d=\"M5 36a19 19 0 0 1 38 0\"/><path class=\"q-h\" d=\"M10 36a14 14 0 0 1 28 0\"/><path style=\"--c:#FFC83D\" d=\"M10 36a14 14 0 0 1 28 0\"/><path class=\"q-h\" d=\"M15 36a9 9 0 0 1 18 0\"/><path style=\"--c:#3DDC84\" d=\"M15 36a9 9 0 0 1 18 0\"/><path class=\"q-h\" d=\"M3 40a4.5 4.5 0 0 1 4.5-5.5 5 5 0 0 1 9 1.5 3 3 0 0 1 0 6H6a3 3 0 0 1-3-2z\"/><path style=\"--c:#FFFFFF\" class=\"q-f\" d=\"M3 40a4.5 4.5 0 0 1 4.5-5.5 5 5 0 0 1 9 1.5 3 3 0 0 1 0 6H6a3 3 0 0 1-3-2z\"/><path class=\"q-h\" d=\"M45 40a4.5 4.5 0 0 0-4.5-5.5 5 5 0 0 0-9 1.5 3 3 0 0 0 0 6H42a3 3 0 0 0 3-2z\"/><path style=\"--c:#FFFFFF\" class=\"q-f\" d=\"M45 40a4.5 4.5 0 0 0-4.5-5.5 5 5 0 0 0-9 1.5 3 3 0 0 0 0 6H42a3 3 0 0 0 3-2z\"/>",
  "sparkle": "<path class=\"q-h\" d=\"M20 11Q20 26 35 26Q20 26 20 41Q20 26 5 26Q20 26 20 11z\"/><path style=\"--c:#FFD54A\" class=\"q-f\" d=\"M20 11Q20 26 35 26Q20 26 20 41Q20 26 5 26Q20 26 20 11z\"/><path class=\"q-h\" d=\"M37 4Q37 11 44 11Q37 11 37 18Q37 11 30 11Q37 11 37 4z\"/><path style=\"--c:#FF7AD9\" class=\"q-f\" d=\"M37 4Q37 11 44 11Q37 11 37 18Q37 11 30 11Q37 11 37 4z\"/><path class=\"q-h\" d=\"M38 32.6Q38 36 41.4 36Q38 36 38 39.4Q38 36 34.6 36Q38 36 38 32.6z\"/><path style=\"--c:#7FE3FF\" class=\"q-w\" d=\"M38 32.6Q38 36 41.4 36Q38 36 38 39.4Q38 36 34.6 36Q38 36 38 32.6z\"/>",
  "party": "<path class=\"q-h\" d=\"M6 42l7-22 15 15z\"/><path style=\"--c:#FF4F8F\" class=\"q-f\" d=\"M6 42l7-22 15 15z\"/><path class=\"q-h\" d=\"M9 33l6 6M11.5 26.5l10 10\"/><path style=\"--c:#FFE066\" class=\"q-t\" d=\"M9 33l6 6M11.5 26.5l10 10\"/><path class=\"q-h\" d=\"M22 18c2-4.5 6.5-4.5 8.5-9\"/><path style=\"--c:#7FE3FF\" d=\"M22 18c2-4.5 6.5-4.5 8.5-9\"/><path class=\"q-h\" d=\"M29 27c4.5-2 7.5.2 11-3\"/><path style=\"--c:#B07CFF\" d=\"M29 27c4.5-2 7.5.2 11-3\"/><circle class=\"q-h\" cx=\"34\" cy=\"16\" r=\"2\"/><circle style=\"--c:#FFD23C\" class=\"q-w\" cx=\"34\" cy=\"16\" r=\"2\"/><circle class=\"q-h\" cx=\"40\" cy=\"11\" r=\"1.6\"/><circle style=\"--c:#3DDC84\" class=\"q-w\" cx=\"40\" cy=\"11\" r=\"1.6\"/><rect class=\"q-h\" x=\"23\" y=\"5\" width=\"3.4\" height=\"3.4\" rx=\"1\" transform=\"rotate(25 24.7 6.7)\"/><rect style=\"--c:#FF8A3D\" class=\"q-w\" x=\"23\" y=\"5\" width=\"3.4\" height=\"3.4\" rx=\"1\" transform=\"rotate(25 24.7 6.7)\"/><circle class=\"q-h\" cx=\"41\" cy=\"33\" r=\"1.8\"/><circle style=\"--c:#3FA9FF\" class=\"q-w\" cx=\"41\" cy=\"33\" r=\"1.8\"/><rect class=\"q-h\" x=\"37\" y=\"21\" width=\"3.2\" height=\"3.2\" rx=\"1\" transform=\"rotate(-20 38.6 22.6)\"/><rect style=\"--c:#FF6FD8\" class=\"q-w\" x=\"37\" y=\"21\" width=\"3.2\" height=\"3.2\" rx=\"1\" transform=\"rotate(-20 38.6 22.6)\"/>",
  "disco": "<path class=\"q-h\" d=\"M24 4v9\"/><path style=\"--c:#B8C2D9\" d=\"M24 4v9\"/><circle class=\"q-h\" cx=\"24\" cy=\"27\" r=\"13\"/><circle style=\"--c:#C9D2E8\" class=\"q-f\" cx=\"24\" cy=\"27\" r=\"13\"/><path class=\"q-h\" d=\"M11.5 27h25M13 21h22M13 33h22M24 14v26M18 15.5c-2 7-2 16 0 23M30 15.5c2 7 2 16 0 23\"/><path style=\"--c:#5A6480\" class=\"q-t\" d=\"M11.5 27h25M13 21h22M13 33h22M24 14v26M18 15.5c-2 7-2 16 0 23M30 15.5c2 7 2 16 0 23\"/><path class=\"q-h\" d=\"M40 6Q40 10 44 10Q40 10 40 14Q40 10 36 10Q40 10 40 6z\"/><path style=\"--c:#FF7AD9\" class=\"q-w\" d=\"M40 6Q40 10 44 10Q40 10 40 14Q40 10 36 10Q40 10 40 6z\"/><path class=\"q-h\" d=\"M8 10.2Q8 13 10.8 13Q8 13 8 15.8Q8 13 5.2 13Q8 13 8 10.2z\"/><path style=\"--c:#7FE3FF\" class=\"q-w\" d=\"M8 10.2Q8 13 10.8 13Q8 13 8 15.8Q8 13 5.2 13Q8 13 8 10.2z\"/>",
  "book": "<path class=\"q-h\" d=\"M4 14v25c8-1 14 0 20 3 6-3 12-4 20-3V14\"/><path style=\"--c:#C9874A\" d=\"M4 14v25c8-1 14 0 20 3 6-3 12-4 20-3V14\"/><path class=\"q-h\" d=\"M24 13c-4-3-10-4-17-3v26c7-1 13 0 17 3z\"/><path style=\"--c:#FFF1DC\" class=\"q-f\" d=\"M24 13c-4-3-10-4-17-3v26c7-1 13 0 17 3z\"/><path class=\"q-h\" d=\"M24 13c4-3 10-4 17-3v26c-7-1-13 0-17 3z\"/><path style=\"--c:#FFE2B8\" class=\"q-f\" d=\"M24 13c4-3 10-4 17-3v26c-7-1-13 0-17 3z\"/><path class=\"q-h\" d=\"M11 17c3-.4 6 0 9 1.4M11 22c3-.4 6 0 9 1.4M11 27c3-.4 6 0 9 1.4M28 18.4c3-1.4 6-1.8 9-1.4M28 23.4c3-1.4 6-1.8 9-1.4\"/><path style=\"--c:#E0C29A\" class=\"q-t\" d=\"M11 17c3-.4 6 0 9 1.4M11 22c3-.4 6 0 9 1.4M11 27c3-.4 6 0 9 1.4M28 18.4c3-1.4 6-1.8 9-1.4M28 23.4c3-1.4 6-1.8 9-1.4\"/><path class=\"q-h\" d=\"M31 9v10l2.5-2 2.5 2V9z\"/><path style=\"--c:#FF4F8F\" class=\"q-w\" d=\"M31 9v10l2.5-2 2.5 2V9z\"/>",
  "bed": "<path class=\"q-h\" d=\"M5 15v25M43 30v10M5 34h38\"/><path style=\"--c:#B07CFF\" d=\"M5 15v25M43 30v10M5 34h38\"/><rect class=\"q-h\" x=\"8\" y=\"22\" width=\"10\" height=\"7\" rx=\"3.5\"/><rect style=\"--c:#FFFFFF\" class=\"q-f\" x=\"8\" y=\"22\" width=\"10\" height=\"7\" rx=\"3.5\"/><path class=\"q-h\" d=\"M17 26h22a4 4 0 0 1 4 4v4H17z\"/><path style=\"--c:#6C8CFF\" class=\"q-f\" d=\"M17 26h22a4 4 0 0 1 4 4v4H17z\"/><path class=\"q-h\" d=\"M38 5a6.5 6.5 0 1 0 6.5 8.8A5.2 5.2 0 0 1 38 5z\"/><path style=\"--c:#FFD54A\" class=\"q-w\" d=\"M38 5a6.5 6.5 0 1 0 6.5 8.8A5.2 5.2 0 0 1 38 5z\"/><path class=\"q-h\" d=\"M22 8h4.5l-4.5 5.5h4.5M29.5 4h3.5l-3.5 4.2h3.5\"/><path style=\"--c:#C7D2FF\" class=\"q-t\" d=\"M22 8h4.5l-4.5 5.5h4.5M29.5 4h3.5l-3.5 4.2h3.5\"/>",
  "lotus": "<path class=\"q-h\" d=\"M24 31c-8 1.2-14.5-2-18.5-7.5 6.5-2.2 13.5 0 18.5 7.5z\"/><path style=\"--c:#C46BFF\" class=\"q-f\" d=\"M24 31c-8 1.2-14.5-2-18.5-7.5 6.5-2.2 13.5 0 18.5 7.5z\"/><path class=\"q-h\" d=\"M24 31c8 1.2 14.5-2 18.5-7.5-6.5-2.2-13.5 0-18.5 7.5z\"/><path style=\"--c:#C46BFF\" class=\"q-f\" d=\"M24 31c8 1.2 14.5-2 18.5-7.5-6.5-2.2-13.5 0-18.5 7.5z\"/><path class=\"q-h\" d=\"M24 30.5C17 29.5 12 24 11 16.5c6.5 1 11.5 5.5 13 14z\"/><path style=\"--c:#FF5FA2\" class=\"q-f\" d=\"M24 30.5C17 29.5 12 24 11 16.5c6.5 1 11.5 5.5 13 14z\"/><path class=\"q-h\" d=\"M24 30.5c7-1 12-6.5 13-14-6.5 1-11.5 5.5-13 14z\"/><path style=\"--c:#FF5FA2\" class=\"q-f\" d=\"M24 30.5c7-1 12-6.5 13-14-6.5 1-11.5 5.5-13 14z\"/><path class=\"q-h\" d=\"M24 10c4.5 5.5 5.5 11 0 20-5.5-9-4.5-14.5 0-20z\"/><path style=\"--c:#FF9AD0\" class=\"q-f\" d=\"M24 10c4.5 5.5 5.5 11 0 20-5.5-9-4.5-14.5 0-20z\"/><path class=\"q-h\" d=\"M7 39c3 0 4-2 6.5-2s3.5 2 6.5 2 4-2 6.5-2 3.5 2 6.5 2 4-2 6.5-2\"/><path style=\"--c:#3FD0F0\" class=\"q-t\" d=\"M7 39c3 0 4-2 6.5-2s3.5 2 6.5 2 4-2 6.5-2 3.5 2 6.5 2 4-2 6.5-2\"/>",
  "game": "<path class=\"q-h\" d=\"M14 14h20c6.5 0 9.5 5.5 10.5 12.5.9 8-2.2 12.5-6.2 12.5-3 0-5-2-7.2-5.5H16.9c-2.2 3.5-4.2 5.5-7.2 5.5-4 0-7.1-4.5-6.2-12.5C4.5 19.5 7.5 14 14 14z\"/><path style=\"--c:#7C6CFF\" class=\"q-f\" d=\"M14 14h20c6.5 0 9.5 5.5 10.5 12.5.9 8-2.2 12.5-6.2 12.5-3 0-5-2-7.2-5.5H16.9c-2.2 3.5-4.2 5.5-7.2 5.5-4 0-7.1-4.5-6.2-12.5C4.5 19.5 7.5 14 14 14z\"/><path class=\"q-h\" d=\"M13 21.5v8M9 25.5h8\"/><path style=\"--c:#FFFFFF\" d=\"M13 21.5v8M9 25.5h8\"/><circle class=\"q-h\" cx=\"34\" cy=\"22\" r=\"2.2\"/><circle style=\"--c:#FF4F8F\" class=\"q-w\" cx=\"34\" cy=\"22\" r=\"2.2\"/><circle class=\"q-h\" cx=\"38.2\" cy=\"26\" r=\"2.2\"/><circle style=\"--c:#FFD23C\" class=\"q-w\" cx=\"38.2\" cy=\"26\" r=\"2.2\"/><circle class=\"q-h\" cx=\"29.8\" cy=\"26\" r=\"2.2\"/><circle style=\"--c:#3FD0F0\" class=\"q-w\" cx=\"29.8\" cy=\"26\" r=\"2.2\"/><circle class=\"q-h\" cx=\"34\" cy=\"30\" r=\"2.2\"/><circle style=\"--c:#7CFF6B\" class=\"q-w\" cx=\"34\" cy=\"30\" r=\"2.2\"/>",
  "sport": "<path class=\"q-h\" d=\"M3 18h7M2 25h6M4 32h6\"/><path style=\"--c:#3FA9FF\" class=\"q-t\" d=\"M3 18h7M2 25h6M4 32h6\"/><circle class=\"q-h\" cx=\"27\" cy=\"25\" r=\"15\"/><circle style=\"--c:#F2F4F8\" class=\"q-f\" cx=\"27\" cy=\"25\" r=\"15\"/><path class=\"q-h\" d=\"M27.0 18.8 L31.9 22.4 L30.1 28.2 L23.9 28.2 L22.1 22.4z\"/><path style=\"--c:#23252B\" class=\"q-w\" d=\"M27.0 18.8 L31.9 22.4 L30.1 28.2 L23.9 28.2 L22.1 22.4z\"/><path class=\"q-h\" d=\"M27 18.8V11M32 22.4l7.5-2.6M30.1 28.2l4.6 6.4M23.9 28.2l-4.6 6.4M22 22.4l-7.5-2.6\"/><path style=\"--c:#23252B\" class=\"q-t\" d=\"M27 18.8V11M32 22.4l7.5-2.6M30.1 28.2l4.6 6.4M23.9 28.2l-4.6 6.4M22 22.4l-7.5-2.6\"/>",
  "mountain": "<path class=\"q-h\" d=\"M20 41l12-21 13 21z\"/><path style=\"--c:#7E8CFF\" class=\"q-f\" d=\"M20 41l12-21 13 21z\"/><path class=\"q-h\" d=\"M3 41l14-25 14 25z\"/><path style=\"--c:#3F62FF\" class=\"q-f\" d=\"M3 41l14-25 14 25z\"/><path class=\"q-h\" d=\"M17 16l4.7 8.4-2.7-1.6-2 2.6-2-2.6-2.7 1.6z\"/><path style=\"--c:#FFFFFF\" class=\"q-w\" d=\"M17 16l4.7 8.4-2.7-1.6-2 2.6-2-2.6-2.7 1.6z\"/><path class=\"q-h\" d=\"M32 20l3.4 6-1.9-1.1-1.5 1.9-1.5-1.9-1.9 1.1z\"/><path style=\"--c:#FFFFFF\" class=\"q-w\" d=\"M32 20l3.4 6-1.9-1.1-1.5 1.9-1.5-1.9-1.9 1.1z\"/><circle class=\"q-h\" cx=\"38\" cy=\"9\" r=\"4\"/><circle style=\"--c:#FFD54A\" class=\"q-w\" cx=\"38\" cy=\"9\" r=\"4\"/>",
  "desert": "<circle class=\"q-h\" cx=\"37\" cy=\"10\" r=\"5\"/><circle style=\"--c:#FFE066\" class=\"q-w\" cx=\"37\" cy=\"10\" r=\"5\"/><path class=\"q-h\" d=\"M2 36c8-6 16-6 24-2 6-3 13-3 20 0v8H2z\"/><path style=\"--c:#FFB13B\" class=\"q-f\" d=\"M2 36c8-6 16-6 24-2 6-3 13-3 20 0v8H2z\"/><path class=\"q-h\" d=\"M2 41c10-4 22-4 44 0v3H2z\"/><path style=\"--c:#FF8A3D\" class=\"q-f\" d=\"M2 41c10-4 22-4 44 0v3H2z\"/><path class=\"q-h\" d=\"M21 37V17a3 3 0 0 1 6 0v20\"/><path style=\"--c:#3DDC84\" d=\"M21 37V17a3 3 0 0 1 6 0v20\"/><path class=\"q-h\" d=\"M21 26h-3a2.2 2.2 0 0 1-2.2-2.2V19M27 23h3a2.2 2.2 0 0 0 2.2-2.2V17\"/><path style=\"--c:#3DDC84\" d=\"M21 26h-3a2.2 2.2 0 0 1-2.2-2.2V19M27 23h3a2.2 2.2 0 0 0 2.2-2.2V17\"/>",
  "city": "<circle class=\"q-h\" cx=\"40\" cy=\"8\" r=\"3.6\"/><circle style=\"--c:#FFE066\" class=\"q-w\" cx=\"40\" cy=\"8\" r=\"3.6\"/><rect class=\"q-h\" x=\"4\" y=\"22\" width=\"10\" height=\"20\" rx=\"1.5\"/><rect style=\"--c:#5B6CFF\" class=\"q-f\" x=\"4\" y=\"22\" width=\"10\" height=\"20\" rx=\"1.5\"/><rect class=\"q-h\" x=\"15\" y=\"11\" width=\"11\" height=\"31\" rx=\"1.5\"/><rect style=\"--c:#7C6CFF\" class=\"q-f\" x=\"15\" y=\"11\" width=\"11\" height=\"31\" rx=\"1.5\"/><rect class=\"q-h\" x=\"27\" y=\"18\" width=\"8\" height=\"24\" rx=\"1.5\"/><rect style=\"--c:#C46BFF\" class=\"q-f\" x=\"27\" y=\"18\" width=\"8\" height=\"24\" rx=\"1.5\"/><rect class=\"q-h\" x=\"36\" y=\"26\" width=\"8\" height=\"16\" rx=\"1.5\"/><rect style=\"--c:#3FB6FF\" class=\"q-f\" x=\"36\" y=\"26\" width=\"8\" height=\"16\" rx=\"1.5\"/><rect class=\"q-h\" x=\"7\" y=\"26\" width=\"2.6\" height=\"3\" rx=\".6\"/><rect style=\"--c:#FFE066\" class=\"q-w\" x=\"7\" y=\"26\" width=\"2.6\" height=\"3\" rx=\".6\"/><rect class=\"q-h\" x=\"7\" y=\"32\" width=\"2.6\" height=\"3\" rx=\".6\"/><rect style=\"--c:#FFE066\" class=\"q-w\" x=\"7\" y=\"32\" width=\"2.6\" height=\"3\" rx=\".6\"/><rect class=\"q-h\" x=\"18\" y=\"15\" width=\"2.6\" height=\"3\" rx=\".6\"/><rect style=\"--c:#FFE066\" class=\"q-w\" x=\"18\" y=\"15\" width=\"2.6\" height=\"3\" rx=\".6\"/><rect class=\"q-h\" x=\"21.5\" y=\"15\" width=\"2.6\" height=\"3\" rx=\".6\"/><rect style=\"--c:#FFE066\" class=\"q-w\" x=\"21.5\" y=\"15\" width=\"2.6\" height=\"3\" rx=\".6\"/><rect class=\"q-h\" x=\"18\" y=\"21\" width=\"2.6\" height=\"3\" rx=\".6\"/><rect style=\"--c:#FFE066\" class=\"q-w\" x=\"18\" y=\"21\" width=\"2.6\" height=\"3\" rx=\".6\"/><rect class=\"q-h\" x=\"21.5\" y=\"27\" width=\"2.6\" height=\"3\" rx=\".6\"/><rect style=\"--c:#FFE066\" class=\"q-w\" x=\"21.5\" y=\"27\" width=\"2.6\" height=\"3\" rx=\".6\"/><rect class=\"q-h\" x=\"18\" y=\"33\" width=\"2.6\" height=\"3\" rx=\".6\"/><rect style=\"--c:#FFE066\" class=\"q-w\" x=\"18\" y=\"33\" width=\"2.6\" height=\"3\" rx=\".6\"/><rect class=\"q-h\" x=\"29.5\" y=\"22\" width=\"2.6\" height=\"3\" rx=\".6\"/><rect style=\"--c:#FFE066\" class=\"q-w\" x=\"29.5\" y=\"22\" width=\"2.6\" height=\"3\" rx=\".6\"/><rect class=\"q-h\" x=\"29.5\" y=\"29\" width=\"2.6\" height=\"3\" rx=\".6\"/><rect style=\"--c:#FFE066\" class=\"q-w\" x=\"29.5\" y=\"29\" width=\"2.6\" height=\"3\" rx=\".6\"/><rect class=\"q-h\" x=\"38.5\" y=\"30\" width=\"2.6\" height=\"3\" rx=\".6\"/><rect style=\"--c:#FFE066\" class=\"q-w\" x=\"38.5\" y=\"30\" width=\"2.6\" height=\"3\" rx=\".6\"/>",
  "alarm": "<circle class=\"q-h\" cx=\"11\" cy=\"10\" r=\"5\"/><circle style=\"--c:#FFC83D\" class=\"q-f\" cx=\"11\" cy=\"10\" r=\"5\"/><circle class=\"q-h\" cx=\"37\" cy=\"10\" r=\"5\"/><circle style=\"--c:#FFC83D\" class=\"q-f\" cx=\"37\" cy=\"10\" r=\"5\"/><path class=\"q-h\" d=\"M14 41l3-4M34 41l-3-4\"/><path style=\"--c:#FF6A88\" d=\"M14 41l3-4M34 41l-3-4\"/><circle class=\"q-h\" cx=\"24\" cy=\"26\" r=\"14\"/><circle style=\"--c:#FF4F5E\" class=\"q-f\" cx=\"24\" cy=\"26\" r=\"14\"/><circle class=\"q-h\" cx=\"24\" cy=\"26\" r=\"10.5\"/><circle style=\"--c:#FFFFFF\" class=\"q-w\" cx=\"24\" cy=\"26\" r=\"10.5\"/><path class=\"q-h\" d=\"M24 19v7l5 3\"/><path style=\"--c:#2A2C32\" d=\"M24 19v7l5 3\"/>",
  "palette": "<path class=\"q-h\" d=\"M24 6C13 6 5 13.6 5 23.4c0 8.2 6 15.6 15 15.6 3 0 4.2-1.6 4.2-3.6 0-2.5 1.6-4.2 4-4.2h4.2C38.5 31.2 43 27 43 21 43 12.5 34.5 6 24 6z\"/><path style=\"--c:#E8C49A\" class=\"q-f\" d=\"M24 6C13 6 5 13.6 5 23.4c0 8.2 6 15.6 15 15.6 3 0 4.2-1.6 4.2-3.6 0-2.5 1.6-4.2 4-4.2h4.2C38.5 31.2 43 27 43 21 43 12.5 34.5 6 24 6z\"/><circle class=\"q-h\" cx=\"14\" cy=\"22\" r=\"3.2\"/><circle style=\"--c:#FF4F8F\" class=\"q-w\" cx=\"14\" cy=\"22\" r=\"3.2\"/><circle class=\"q-h\" cx=\"19\" cy=\"13.5\" r=\"3.2\"/><circle style=\"--c:#FFD23C\" class=\"q-w\" cx=\"19\" cy=\"13.5\" r=\"3.2\"/><circle class=\"q-h\" cx=\"28.5\" cy=\"12.5\" r=\"3.2\"/><circle style=\"--c:#3DDC84\" class=\"q-w\" cx=\"28.5\" cy=\"12.5\" r=\"3.2\"/><circle class=\"q-h\" cx=\"35.5\" cy=\"18.5\" r=\"3.2\"/><circle style=\"--c:#3FA9FF\" class=\"q-w\" cx=\"35.5\" cy=\"18.5\" r=\"3.2\"/><path class=\"q-h\" d=\"M37 46l-5-9\"/><path style=\"--c:#B07CFF\" d=\"M37 46l-5-9\"/>",
  "gradient": "<circle class=\"q-h\" cx=\"17\" cy=\"19\" r=\"11\"/><circle style=\"--c:#FF4F8F\" class=\"q-f\" cx=\"17\" cy=\"19\" r=\"11\"/><circle class=\"q-h\" cx=\"31\" cy=\"19\" r=\"11\"/><circle style=\"--c:#3FA9FF\" class=\"q-f\" cx=\"31\" cy=\"19\" r=\"11\"/><circle class=\"q-h\" cx=\"24\" cy=\"31\" r=\"11\"/><circle style=\"--c:#7CFF6B\" class=\"q-f\" cx=\"24\" cy=\"31\" r=\"11\"/>",
  "gift": "<rect class=\"q-h\" x=\"9\" y=\"22\" width=\"30\" height=\"20\" rx=\"2.5\"/><rect style=\"--c:#FF4F8F\" class=\"q-f\" x=\"9\" y=\"22\" width=\"30\" height=\"20\" rx=\"2.5\"/><rect class=\"q-h\" x=\"6\" y=\"15\" width=\"36\" height=\"8\" rx=\"2\"/><rect style=\"--c:#FF7AA8\" class=\"q-f\" x=\"6\" y=\"15\" width=\"36\" height=\"8\" rx=\"2\"/><rect class=\"q-h\" x=\"21.5\" y=\"15\" width=\"5\" height=\"27\"/><rect style=\"--c:#FFD23C\" class=\"q-w\" x=\"21.5\" y=\"15\" width=\"5\" height=\"27\"/><path class=\"q-h\" d=\"M24 15c-3.5-6.5-11-7.5-11-2.2s7.6 3.2 11 2.2zM24 15c3.5-6.5 11-7.5 11-2.2s-7.6 3.2-11 2.2z\"/><path style=\"--c:#FFD23C\" class=\"q-f\" d=\"M24 15c-3.5-6.5-11-7.5-11-2.2s7.6 3.2 11 2.2zM24 15c3.5-6.5 11-7.5 11-2.2s-7.6 3.2-11 2.2z\"/>",
  "pulse": "<path class=\"q-h\" d=\"M24 41S6 30.8 6 19.2A9 9 0 0 1 24 13.5a9 9 0 0 1 18 5.7C42 30.8 24 41 24 41z\"/><path style=\"--c:#FF3B5C\" class=\"q-f\" d=\"M24 41S6 30.8 6 19.2A9 9 0 0 1 24 13.5a9 9 0 0 1 18 5.7C42 30.8 24 41 24 41z\"/><path class=\"q-h\" d=\"M3 25h11l3.5-6 4.5 12 4.5-15 3.5 9h15\"/><path style=\"--c:#FFFFFF\" d=\"M3 25h11l3.5-6 4.5 12 4.5-15 3.5 9h15\"/>",
  "ghost": "<path class=\"q-h\" d=\"M24 5c-8.5 0-14 6.5-14 15v22l4.5-3.4 4.6 3.4 4.9-3.4 4.9 3.4 4.6-3.4L38 42V20c0-8.5-5.5-15-14-15z\"/><path style=\"--c:#F2F4F8\" class=\"q-f\" d=\"M24 5c-8.5 0-14 6.5-14 15v22l4.5-3.4 4.6 3.4 4.9-3.4 4.9 3.4 4.6-3.4L38 42V20c0-8.5-5.5-15-14-15z\"/><ellipse class=\"q-h\" cx=\"19\" cy=\"20\" rx=\"2.4\" ry=\"3.4\"/><ellipse style=\"--c:#23252B\" class=\"q-w\" cx=\"19\" cy=\"20\" rx=\"2.4\" ry=\"3.4\"/><ellipse class=\"q-h\" cx=\"29\" cy=\"20\" rx=\"2.4\" ry=\"3.4\"/><ellipse style=\"--c:#23252B\" class=\"q-w\" cx=\"29\" cy=\"20\" rx=\"2.4\" ry=\"3.4\"/><path class=\"q-h\" d=\"M21 28a3 3 0 0 1 6 0z\"/><path style=\"--c:#23252B\" class=\"q-w\" d=\"M21 28a3 3 0 0 1 6 0z\"/><path class=\"q-h\" d=\"M42 6.6Q42 10 45.4 10Q42 10 42 13.4Q42 10 38.6 10Q42 10 42 6.6z\"/><path style=\"--c:#B07CFF\" class=\"q-w\" d=\"M42 6.6Q42 10 45.4 10Q42 10 42 13.4Q42 10 38.6 10Q42 10 42 6.6z\"/>",
  "generic": "<path class=\"q-h\" d=\"M22 8Q22 24 38 24Q22 24 22 40Q22 24 6 24Q22 24 22 8z\"/><path style=\"--c:#B07CFF\" class=\"q-f\" d=\"M22 8Q22 24 38 24Q22 24 22 40Q22 24 6 24Q22 24 22 8z\"/><path class=\"q-h\" d=\"M38 5Q38 10 43 10Q38 10 38 15Q38 10 33 10Q38 10 38 5z\"/><path style=\"--c:#3FD0F0\" class=\"q-w\" d=\"M38 5Q38 10 43 10Q38 10 38 15Q38 10 33 10Q38 10 38 5z\"/><circle class=\"q-h\" cx=\"38\" cy=\"36\" r=\"2\"/><circle style=\"--c:#FF7AD9\" class=\"q-w\" cx=\"38\" cy=\"36\" r=\"2\"/>",
  "wheat": "<path class=\"q-h\" d=\"M24 45V8M24 45c-1-9-5-14-11-18M24 45c1-9 5-14 11-18\"/><path style=\"--c:#C8923E\" d=\"M24 45V8M24 45c-1-9-5-14-11-18M24 45c1-9 5-14 11-18\"/><g class=\"q-h\"><ellipse cx=\"21.4\" cy=\"13\" rx=\"1.9\" ry=\"3.4\" transform=\"rotate(-28 21.4 13)\"/><ellipse cx=\"26.6\" cy=\"13\" rx=\"1.9\" ry=\"3.4\" transform=\"rotate(28 26.6 13)\"/><ellipse cx=\"21.4\" cy=\"18.5\" rx=\"1.9\" ry=\"3.4\" transform=\"rotate(-28 21.4 18.5)\"/><ellipse cx=\"26.6\" cy=\"18.5\" rx=\"1.9\" ry=\"3.4\" transform=\"rotate(28 26.6 18.5)\"/><ellipse cx=\"21.4\" cy=\"24\" rx=\"1.9\" ry=\"3.4\" transform=\"rotate(-28 21.4 24)\"/><ellipse cx=\"26.6\" cy=\"24\" rx=\"1.9\" ry=\"3.4\" transform=\"rotate(28 26.6 24)\"/><ellipse cx=\"21.4\" cy=\"29.5\" rx=\"1.9\" ry=\"3.4\" transform=\"rotate(-28 21.4 29.5)\"/><ellipse cx=\"26.6\" cy=\"29.5\" rx=\"1.9\" ry=\"3.4\" transform=\"rotate(28 26.6 29.5)\"/><ellipse cx=\"24\" cy=\"8\" rx=\"1.8\" ry=\"3.4\"/></g><g style=\"--c:#FFC83D\" class=\"q-f\"><ellipse cx=\"21.4\" cy=\"13\" rx=\"1.9\" ry=\"3.4\" transform=\"rotate(-28 21.4 13)\"/><ellipse cx=\"26.6\" cy=\"13\" rx=\"1.9\" ry=\"3.4\" transform=\"rotate(28 26.6 13)\"/><ellipse cx=\"21.4\" cy=\"18.5\" rx=\"1.9\" ry=\"3.4\" transform=\"rotate(-28 21.4 18.5)\"/><ellipse cx=\"26.6\" cy=\"18.5\" rx=\"1.9\" ry=\"3.4\" transform=\"rotate(28 26.6 18.5)\"/><ellipse cx=\"21.4\" cy=\"24\" rx=\"1.9\" ry=\"3.4\" transform=\"rotate(-28 21.4 24)\"/><ellipse cx=\"26.6\" cy=\"24\" rx=\"1.9\" ry=\"3.4\" transform=\"rotate(28 26.6 24)\"/><ellipse cx=\"21.4\" cy=\"29.5\" rx=\"1.9\" ry=\"3.4\" transform=\"rotate(-28 21.4 29.5)\"/><ellipse cx=\"26.6\" cy=\"29.5\" rx=\"1.9\" ry=\"3.4\" transform=\"rotate(28 26.6 29.5)\"/><ellipse cx=\"24\" cy=\"8\" rx=\"1.8\" ry=\"3.4\"/></g><g class=\"q-h\"><ellipse cx=\"10.5\" cy=\"22.5\" rx=\"1.7\" ry=\"3.1\" transform=\"rotate(-50 10.5 22.5)\"/><ellipse cx=\"13\" cy=\"27.5\" rx=\"1.7\" ry=\"3.1\" transform=\"rotate(-42 13 27.5)\"/><ellipse cx=\"16.5\" cy=\"32\" rx=\"1.7\" ry=\"3.1\" transform=\"rotate(-36 16.5 32)\"/><ellipse cx=\"37.5\" cy=\"22.5\" rx=\"1.7\" ry=\"3.1\" transform=\"rotate(50 37.5 22.5)\"/><ellipse cx=\"35\" cy=\"27.5\" rx=\"1.7\" ry=\"3.1\" transform=\"rotate(42 35 27.5)\"/><ellipse cx=\"31.5\" cy=\"32\" rx=\"1.7\" ry=\"3.1\" transform=\"rotate(36 31.5 32)\"/></g><g style=\"--c:#FFA43B\" class=\"q-f\"><ellipse cx=\"10.5\" cy=\"22.5\" rx=\"1.7\" ry=\"3.1\" transform=\"rotate(-50 10.5 22.5)\"/><ellipse cx=\"13\" cy=\"27.5\" rx=\"1.7\" ry=\"3.1\" transform=\"rotate(-42 13 27.5)\"/><ellipse cx=\"16.5\" cy=\"32\" rx=\"1.7\" ry=\"3.1\" transform=\"rotate(-36 16.5 32)\"/><ellipse cx=\"37.5\" cy=\"22.5\" rx=\"1.7\" ry=\"3.1\" transform=\"rotate(50 37.5 22.5)\"/><ellipse cx=\"35\" cy=\"27.5\" rx=\"1.7\" ry=\"3.1\" transform=\"rotate(42 35 27.5)\"/><ellipse cx=\"31.5\" cy=\"32\" rx=\"1.7\" ry=\"3.1\" transform=\"rotate(36 31.5 32)\"/></g><path class=\"q-h\" d=\"M24 8V3M21.5 12l-2-5M26.5 12l2-5\"/><path style=\"--c:#FFE08A\" class=\"q-t\" d=\"M24 8V3M21.5 12l-2-5M26.5 12l2-5\"/>",
  "maple": "<path class=\"q-h\" d=\"M24 4L27.5 12L32 9.5L31 18L38 14.5L36.5 20L42 21L35 27L36.5 31L28 29.5L25.5 31L22.5 31L20 29.5L11.5 31L13 27L6 21L11.5 20L10 14.5L17 18L16 9.5L20.5 12z\"/><path style=\"--c:#FF6A2B\" class=\"q-f\" d=\"M24 4L27.5 12L32 9.5L31 18L38 14.5L36.5 20L42 21L35 27L36.5 31L28 29.5L25.5 31L22.5 31L20 29.5L11.5 31L13 27L6 21L11.5 20L10 14.5L17 18L16 9.5L20.5 12z\"/><path class=\"q-h\" d=\"M24 31V12M24 23l7-6M24 23l-7-6\"/><path style=\"--c:#FFB13B\" class=\"q-t\" d=\"M24 31V12M24 23l7-6M24 23l-7-6\"/><path class=\"q-h\" d=\"M24 31v12\"/><path style=\"--c:#B5703F\" d=\"M24 31v12\"/><path class=\"q-h\" d=\"M36 38c3-3 7-3 8 0-2 3-6 4-8 0z\"/><path style=\"--c:#FFC83D\" class=\"q-f\" d=\"M36 38c3-3 7-3 8 0-2 3-6 4-8 0z\"/><path class=\"q-h\" d=\"M5 37c2-3 6-3 7 0-2 3-5 3-7 0z\"/><path style=\"--c:#FF3B2E\" class=\"q-f\" d=\"M5 37c2-3 6-3 7 0-2 3-5 3-7 0z\"/>",
  "ripple": "<path class=\"q-h\" d=\"M24 3c3.5 5 5.5 8 5.5 10.5a5.5 5.5 0 0 1-11 0C18.5 11 20.5 8 24 3z\"/><path style=\"--c:#3FA9FF\" class=\"q-f\" d=\"M24 3c3.5 5 5.5 8 5.5 10.5a5.5 5.5 0 0 1-11 0C18.5 11 20.5 8 24 3z\"/><ellipse class=\"q-h\" cx=\"24\" cy=\"33\" rx=\"5\" ry=\"2\"/><ellipse style=\"--c:#E3F6FF\" class=\"q-f\" cx=\"24\" cy=\"33\" rx=\"5\" ry=\"2\"/><path class=\"q-h\" d=\"M12 33a12 5 0 1 0 24 0a12 5 0 1 0 -24 0\"/><path style=\"--c:#3FD0F0\" d=\"M12 33a12 5 0 1 0 24 0a12 5 0 1 0 -24 0\"/><path class=\"q-h\" d=\"M4 33a20 8.5 0 1 0 40 0a20 8.5 0 1 0 -40 0\"/><path style=\"--c:#2E7CF6\" class=\"q-t\" d=\"M4 33a20 8.5 0 1 0 40 0a20 8.5 0 1 0 -40 0\"/><circle class=\"q-h\" cx=\"15\" cy=\"22\" r=\"1.4\"/><circle style=\"--c:#7FE3FF\" class=\"q-w\" cx=\"15\" cy=\"22\" r=\"1.4\"/><circle class=\"q-h\" cx=\"33\" cy=\"21\" r=\"1.2\"/><circle style=\"--c:#7FE3FF\" class=\"q-w\" cx=\"33\" cy=\"21\" r=\"1.2\"/>",
  "xtree": "<path class=\"q-h\" d=\"M24 8l9 10h-5l8 10h-6l8 11H10l8-11h-6l8-10h-5z\"/><path style=\"--c:#2FBF5B\" class=\"q-f\" d=\"M24 8l9 10h-5l8 10h-6l8 11H10l8-11h-6l8-10h-5z\"/><rect class=\"q-h\" x=\"21\" y=\"39\" width=\"6\" height=\"5\" rx=\"1\"/><rect style=\"--c:#B5703F\" class=\"q-f\" x=\"21\" y=\"39\" width=\"6\" height=\"5\" rx=\"1\"/><path class=\"q-h\" d=\"M17 25c5 2 10 2 15-1M15 34c6 2 13 2 19-1\"/><path style=\"--c:#FFE066\" class=\"q-t\" d=\"M17 25c5 2 10 2 15-1M15 34c6 2 13 2 19-1\"/><path class=\"q-h\" d=\"M24.0 2.0 L25.3 5.2 L28.8 5.5 L26.1 7.7 L26.9 11.0 L24.0 9.2 L21.1 11.0 L21.9 7.7 L19.2 5.5 L22.7 5.2z\"/><path style=\"--c:#FFD23C\" class=\"q-w\" d=\"M24.0 2.0 L25.3 5.2 L28.8 5.5 L26.1 7.7 L26.9 11.0 L24.0 9.2 L21.1 11.0 L21.9 7.7 L19.2 5.5 L22.7 5.2z\"/><circle class=\"q-h\" cx=\"21\" cy=\"21\" r=\"1.7\"/><circle style=\"--c:#FF4F5E\" class=\"q-w\" cx=\"21\" cy=\"21\" r=\"1.7\"/><circle class=\"q-h\" cx=\"28\" cy=\"29\" r=\"1.8\"/><circle style=\"--c:#3FA9FF\" class=\"q-w\" cx=\"28\" cy=\"29\" r=\"1.8\"/><circle class=\"q-h\" cx=\"19\" cy=\"31\" r=\"1.8\"/><circle style=\"--c:#FFD23C\" class=\"q-w\" cx=\"19\" cy=\"31\" r=\"1.8\"/><circle class=\"q-h\" cx=\"30\" cy=\"37\" r=\"1.6\"/><circle style=\"--c:#FF7AD9\" class=\"q-w\" cx=\"30\" cy=\"37\" r=\"1.6\"/>",
  "bell": "<path class=\"q-h\" d=\"M24 6a2.5 2.5 0 0 1 2.5 2.5c6 1.5 8.5 6.5 8.5 13v6l4 6H9l4-6v-6c0-6.5 2.5-11.5 8.5-13A2.5 2.5 0 0 1 24 6z\"/><path style=\"--c:#FFC83D\" class=\"q-f\" d=\"M24 6a2.5 2.5 0 0 1 2.5 2.5c6 1.5 8.5 6.5 8.5 13v6l4 6H9l4-6v-6c0-6.5 2.5-11.5 8.5-13A2.5 2.5 0 0 1 24 6z\"/><path class=\"q-h\" d=\"M13 27.5h22\"/><path style=\"--c:#FF9F2E\" class=\"q-t\" d=\"M13 27.5h22\"/><circle class=\"q-h\" cx=\"24\" cy=\"37.5\" r=\"3.2\"/><circle style=\"--c:#FF8A3D\" class=\"q-f\" cx=\"24\" cy=\"37.5\" r=\"3.2\"/><path class=\"q-h\" d=\"M41 21c2 2 2 6 0 8M7 21c-2 2-2 6 0 8\"/><path style=\"--c:#FFE066\" d=\"M41 21c2 2 2 6 0 8M7 21c-2 2-2 6 0 8\"/><ellipse class=\"q-h\" cx=\"34\" cy=\"8\" rx=\"5\" ry=\"2.3\" transform=\"rotate(-25 34 8)\"/><ellipse style=\"--c:#2FBF5B\" class=\"q-f\" cx=\"34\" cy=\"8\" rx=\"5\" ry=\"2.3\" transform=\"rotate(-25 34 8)\"/><circle class=\"q-h\" cx=\"30\" cy=\"10\" r=\"2\"/><circle style=\"--c:#FF4F5E\" class=\"q-w\" cx=\"30\" cy=\"10\" r=\"2\"/>",
  "egg": "<path class=\"q-h\" d=\"M24 5c7.5 0 13.5 12 13.5 21a13.5 13.5 0 0 1-27 0C10.5 17 16.5 5 24 5z\"/><path style=\"--c:#FF9AD0\" class=\"q-f\" d=\"M24 5c7.5 0 13.5 12 13.5 21a13.5 13.5 0 0 1-27 0C10.5 17 16.5 5 24 5z\"/><path class=\"q-h\" d=\"M11 25l4.3-3.5 4.3 3.5 4.3-3.5 4.3 3.5 4.3-3.5 4.3 3.5\"/><path style=\"--c:#FFE066\" d=\"M11 25l4.3-3.5 4.3 3.5 4.3-3.5 4.3 3.5 4.3-3.5 4.3 3.5\"/><path class=\"q-h\" d=\"M12.5 33.5h23\"/><path style=\"--c:#7FE3FF\" d=\"M12.5 33.5h23\"/><circle class=\"q-h\" cx=\"19\" cy=\"15\" r=\"1.7\"/><circle style=\"--c:#B07CFF\" class=\"q-w\" cx=\"19\" cy=\"15\" r=\"1.7\"/><circle class=\"q-h\" cx=\"29\" cy=\"14\" r=\"1.7\"/><circle style=\"--c:#3FA9FF\" class=\"q-w\" cx=\"29\" cy=\"14\" r=\"1.7\"/><circle class=\"q-h\" cx=\"19\" cy=\"38\" r=\"1.5\"/><circle style=\"--c:#B07CFF\" class=\"q-w\" cx=\"19\" cy=\"38\" r=\"1.5\"/><circle class=\"q-h\" cx=\"29\" cy=\"38\" r=\"1.5\"/><circle style=\"--c:#B07CFF\" class=\"q-w\" cx=\"29\" cy=\"38\" r=\"1.5\"/><path class=\"q-h\" d=\"M41 5.5Q41 9 44.5 9Q41 9 41 12.5Q41 9 37.5 9Q41 9 41 5.5z\"/><path style=\"--c:#FFFFFF\" class=\"q-w\" d=\"M41 5.5Q41 9 44.5 9Q41 9 41 12.5Q41 9 37.5 9Q41 9 41 5.5z\"/>",
  "pumpkin": "<ellipse class=\"q-h\" cx=\"16\" cy=\"29\" rx=\"9.5\" ry=\"12\"/><ellipse style=\"--c:#FF7A1F\" class=\"q-f\" cx=\"16\" cy=\"29\" rx=\"9.5\" ry=\"12\"/><ellipse class=\"q-h\" cx=\"32\" cy=\"29\" rx=\"9.5\" ry=\"12\"/><ellipse style=\"--c:#FF7A1F\" class=\"q-f\" cx=\"32\" cy=\"29\" rx=\"9.5\" ry=\"12\"/><ellipse class=\"q-h\" cx=\"24\" cy=\"29\" rx=\"9\" ry=\"12.5\"/><ellipse style=\"--c:#FF9A2E\" class=\"q-f\" cx=\"24\" cy=\"29\" rx=\"9\" ry=\"12.5\"/><path class=\"q-h\" d=\"M24 17c0-4 1.2-7 4-9\"/><path style=\"--c:#3DDC84\" d=\"M24 17c0-4 1.2-7 4-9\"/><path class=\"q-h\" d=\"M27 11c3-3 8-3 10 0-3 3-7 3-10 0z\"/><path style=\"--c:#2FBF5B\" class=\"q-f\" d=\"M27 11c3-3 8-3 10 0-3 3-7 3-10 0z\"/><path class=\"q-h\" d=\"M14 26l4-5.5 3.5 5.5zM26.5 26l3.5-5.5 4 5.5z\"/><path style=\"--c:#FFE066\" class=\"q-w\" d=\"M14 26l4-5.5 3.5 5.5zM26.5 26l3.5-5.5 4 5.5z\"/><path class=\"q-h\" d=\"M14 31.5l3 2.5 3-2.5 3 2.5 3-2.5 3 2.5 3-2.5 2.5 1c-1 3.5-4.5 6-9.5 6s-9-2.5-10-6z\"/><path style=\"--c:#FFE066\" class=\"q-w\" d=\"M14 31.5l3 2.5 3-2.5 3 2.5 3-2.5 3 2.5 3-2.5 2.5 1c-1 3.5-4.5 6-9.5 6s-9-2.5-10-6z\"/>",
  "butterfly": "<path class=\"q-h\" d=\"M23 23C19 11 9 6 6 10c-3 5 3 13 17 13z\"/><path style=\"--c:#FF7AD9\" class=\"q-f\" d=\"M23 23C19 11 9 6 6 10c-3 5 3 13 17 13z\"/><path class=\"q-h\" d=\"M25 23c4-12 14-17 17-13 3 5-3 13-17 13z\"/><path style=\"--c:#FF7AD9\" class=\"q-f\" d=\"M25 23c4-12 14-17 17-13 3 5-3 13-17 13z\"/><path class=\"q-h\" d=\"M23 25c-9 0-14 3-13 8 1 5 8 6 13-6z\"/><path style=\"--c:#B07CFF\" class=\"q-f\" d=\"M23 25c-9 0-14 3-13 8 1 5 8 6 13-6z\"/><path class=\"q-h\" d=\"M25 25c9 0 14 3 13 8-1 5-8 6-13-6z\"/><path style=\"--c:#B07CFF\" class=\"q-f\" d=\"M25 25c9 0 14 3 13 8-1 5-8 6-13-6z\"/><rect class=\"q-h\" x=\"22.5\" y=\"14\" width=\"3\" height=\"20\" rx=\"1.5\"/><rect style=\"--c:#FFD54A\" class=\"q-w\" x=\"22.5\" y=\"14\" width=\"3\" height=\"20\" rx=\"1.5\"/><path class=\"q-h\" d=\"M23.5 15c-1-4-3-6-5-7M24.5 15c1-4 3-6 5-7\"/><path style=\"--c:#FFD54A\" class=\"q-t\" d=\"M23.5 15c-1-4-3-6-5-7M24.5 15c1-4 3-6 5-7\"/><circle class=\"q-h\" cx=\"12.5\" cy=\"13\" r=\"1.8\"/><circle style=\"--c:#FFFFFF\" class=\"q-w\" cx=\"12.5\" cy=\"13\" r=\"1.8\"/><circle class=\"q-h\" cx=\"35.5\" cy=\"13\" r=\"1.8\"/><circle style=\"--c:#FFFFFF\" class=\"q-w\" cx=\"35.5\" cy=\"13\" r=\"1.8\"/>",
  "bird": "<path class=\"q-h\" d=\"M4 43h36\"/><path style=\"--c:#C8923E\" d=\"M4 43h36\"/><path class=\"q-h\" d=\"M19 40v3M24 40v3\"/><path style=\"--c:#FFB13B\" class=\"q-t\" d=\"M19 40v3M24 40v3\"/><path class=\"q-h\" d=\"M10 31c0-9 7-16 16-16 3.5 0 6 1.2 7.5 3l6.5-1.5-4.5 5.5c.4 1.4.5 2.8.5 4.3C36 34 29 40 21 40c-6 0-11-3.5-11-9z\"/><path style=\"--c:#3FA9FF\" class=\"q-f\" d=\"M10 31c0-9 7-16 16-16 3.5 0 6 1.2 7.5 3l6.5-1.5-4.5 5.5c.4 1.4.5 2.8.5 4.3C36 34 29 40 21 40c-6 0-11-3.5-11-9z\"/><path class=\"q-h\" d=\"M15 29c5 .5 10-1.5 13-6-1 7-5.5 11.5-12 11z\"/><path style=\"--c:#7FE3FF\" class=\"q-f\" d=\"M15 29c5 .5 10-1.5 13-6-1 7-5.5 11.5-12 11z\"/><path class=\"q-h\" d=\"M38.5 17.5l5 1.5-5 2z\"/><path style=\"--c:#FFB13B\" class=\"q-w\" d=\"M38.5 17.5l5 1.5-5 2z\"/><circle class=\"q-h\" cx=\"29.5\" cy=\"21\" r=\"1.6\"/><circle style=\"--c:#FFFFFF\" class=\"q-w\" cx=\"29.5\" cy=\"21\" r=\"1.6\"/><path class=\"q-h\" d=\"M41 3h3v9.5a3 3 0 1 1-3-2.9z\"/><path style=\"--c:#FFD23C\" class=\"q-w\" d=\"M41 3h3v9.5a3 3 0 1 1-3-2.9z\"/>",
  "fish": "<path class=\"q-h\" d=\"M5 25c6-9 17-12 27-5l9-6v22l-9-6C22 37 11 34 5 25z\"/><path style=\"--c:#FF8A2E\" class=\"q-f\" d=\"M5 25c6-9 17-12 27-5l9-6v22l-9-6C22 37 11 34 5 25z\"/><path class=\"q-h\" d=\"M17 18c3-5 9-6 13-3\"/><path style=\"--c:#FFB13B\" d=\"M17 18c3-5 9-6 13-3\"/><path class=\"q-h\" d=\"M19 20c2 3 2 7 0 10\"/><path style=\"--c:#FFE066\" class=\"q-t\" d=\"M19 20c2 3 2 7 0 10\"/><circle class=\"q-h\" cx=\"12.5\" cy=\"23\" r=\"2\"/><circle style=\"--c:#FFFFFF\" class=\"q-w\" cx=\"12.5\" cy=\"23\" r=\"2\"/><path class=\"q-h\" d=\"M37.4 7a2.6 2.6 0 1 0 5.2 0a2.6 2.6 0 1 0 -5.2 0\"/><path style=\"--c:#7FE3FF\" class=\"q-t\" d=\"M37.4 7a2.6 2.6 0 1 0 5.2 0a2.6 2.6 0 1 0 -5.2 0\"/><path class=\"q-h\" d=\"M32.4 4.5a1.6 1.6 0 1 0 3.2 0a1.6 1.6 0 1 0 -3.2 0\"/><path style=\"--c:#7FE3FF\" class=\"q-t\" d=\"M32.4 4.5a1.6 1.6 0 1 0 3.2 0a1.6 1.6 0 1 0 -3.2 0\"/><path class=\"q-h\" d=\"M10 41c2 0 3-1.2 5-1.2s3 1.2 5 1.2 3-1.2 5-1.2 3 1.2 5 1.2\"/><path style=\"--c:#3FA9FF\" class=\"q-t\" d=\"M10 41c2 0 3-1.2 5-1.2s3 1.2 5 1.2 3-1.2 5-1.2 3 1.2 5 1.2\"/>",
  "jellyfish": "<path class=\"q-h\" d=\"M14 28c-2 4 2 7 0 11M20 29c-2 4 2 8 0 13M27 29c2 4-2 8 0 13M33 28c2 4-2 7 0 11\"/><path style=\"--c:#B07CFF\" class=\"q-t\" d=\"M14 28c-2 4 2 7 0 11M20 29c-2 4 2 8 0 13M27 29c2 4-2 8 0 13M33 28c2 4-2 7 0 11\"/><path class=\"q-h\" d=\"M9 25a15 14 0 0 1 30 0c-2.5 1.8-5 1.8-7.5 0-2.5 1.8-5 1.8-7.5 0-2.5 1.8-5 1.8-7.5 0-2.5 1.8-5 1.8-7.5 0z\"/><path style=\"--c:#FF7AD9\" class=\"q-f\" d=\"M9 25a15 14 0 0 1 30 0c-2.5 1.8-5 1.8-7.5 0-2.5 1.8-5 1.8-7.5 0-2.5 1.8-5 1.8-7.5 0-2.5 1.8-5 1.8-7.5 0z\"/><ellipse class=\"q-h\" cx=\"18\" cy=\"16\" rx=\"3\" ry=\"2\"/><ellipse style=\"--c:#FFC2EC\" class=\"q-w\" cx=\"18\" cy=\"16\" rx=\"3\" ry=\"2\"/><circle class=\"q-h\" cx=\"41\" cy=\"9\" r=\"1.7\"/><circle style=\"--c:#7FE3FF\" class=\"q-w\" cx=\"41\" cy=\"9\" r=\"1.7\"/><circle class=\"q-h\" cx=\"7\" cy=\"11\" r=\"1.3\"/><circle style=\"--c:#7FE3FF\" class=\"q-w\" cx=\"7\" cy=\"11\" r=\"1.3\"/><circle class=\"q-h\" cx=\"40\" cy=\"37\" r=\"1.3\"/><circle style=\"--c:#7FE3FF\" class=\"q-w\" cx=\"40\" cy=\"37\" r=\"1.3\"/>",
  "sailboat": "<path class=\"q-h\" d=\"M23 5v25H9z\"/><path style=\"--c:#FFFFFF\" class=\"q-f\" d=\"M23 5v25H9z\"/><path class=\"q-h\" d=\"M26 11v19h12z\"/><path style=\"--c:#FFD23C\" class=\"q-f\" d=\"M26 11v19h12z\"/><path class=\"q-h\" d=\"M24.5 4v28\"/><path style=\"--c:#C8923E\" class=\"q-t\" d=\"M24.5 4v28\"/><path class=\"q-h\" d=\"M24.5 4l5 2-5 2z\"/><path style=\"--c:#FF4F5E\" class=\"q-w\" d=\"M24.5 4l5 2-5 2z\"/><path class=\"q-h\" d=\"M7 32h34l-5 7H12z\"/><path style=\"--c:#FF6A3D\" class=\"q-f\" d=\"M7 32h34l-5 7H12z\"/><path class=\"q-h\" d=\"M4 43.5c3 0 4-2 6.5-2s3.5 2 6.5 2 4-2 6.5-2 3.5 2 6.5 2 4-2 6.5-2 3.5 2 6.5 2\"/><path style=\"--c:#3FA9FF\" d=\"M4 43.5c3 0 4-2 6.5-2s3.5 2 6.5 2 4-2 6.5-2 3.5 2 6.5 2 4-2 6.5-2 3.5 2 6.5 2\"/>",
  "waterfall": "<path class=\"q-h\" d=\"M4 10c4-2 8-2 12 0v34H4z\"/><path style=\"--c:#A07A55\" class=\"q-f\" d=\"M4 10c4-2 8-2 12 0v34H4z\"/><path class=\"q-h\" d=\"M32 10c4-2 8-2 12 0v34H32z\"/><path style=\"--c:#A07A55\" class=\"q-f\" d=\"M32 10c4-2 8-2 12 0v34H32z\"/><rect class=\"q-h\" x=\"16\" y=\"9\" width=\"16\" height=\"29\"/><rect style=\"--c:#3FA9FF\" class=\"q-f\" x=\"16\" y=\"9\" width=\"16\" height=\"29\"/><path class=\"q-h\" d=\"M20 12v21M24 12v23M28 12v21\"/><path style=\"--c:#E3F6FF\" class=\"q-t\" d=\"M20 12v21M24 12v23M28 12v21\"/><ellipse class=\"q-h\" cx=\"24\" cy=\"40\" rx=\"15\" ry=\"4\"/><ellipse style=\"--c:#7FE3FF\" class=\"q-f\" cx=\"24\" cy=\"40\" rx=\"15\" ry=\"4\"/><path class=\"q-h\" d=\"M4 10c4-2 8-2 12 0M32 10c4-2 8-2 12 0\"/><path style=\"--c:#3DDC84\" d=\"M4 10c4-2 8-2 12 0M32 10c4-2 8-2 12 0\"/><circle class=\"q-h\" cx=\"13.5\" cy=\"35\" r=\"1.6\"/><circle style=\"--c:#E3F6FF\" class=\"q-w\" cx=\"13.5\" cy=\"35\" r=\"1.6\"/><circle class=\"q-h\" cx=\"34.5\" cy=\"34\" r=\"1.4\"/><circle style=\"--c:#E3F6FF\" class=\"q-w\" cx=\"34.5\" cy=\"34\" r=\"1.4\"/>",
  "river": "<circle class=\"q-h\" cx=\"38\" cy=\"10\" r=\"4\"/><circle style=\"--c:#FFD54A\" class=\"q-w\" cx=\"38\" cy=\"10\" r=\"4\"/><path class=\"q-h\" d=\"M4 21l9-11 6 6 5-5 10 10z\"/><path style=\"--c:#7E8CFF\" class=\"q-f\" d=\"M4 21l9-11 6 6 5-5 10 10z\"/><path class=\"q-h\" d=\"M22 20h6c-3 5 7 9 1 15-4 4-6 6 0 9H16c-5-4-1-8 3-12 5-5-3-8 3-12z\"/><path style=\"--c:#3FA9FF\" class=\"q-f\" d=\"M22 20h6c-3 5 7 9 1 15-4 4-6 6 0 9H16c-5-4-1-8 3-12 5-5-3-8 3-12z\"/><path class=\"q-h\" d=\"M7 34l4-9 4 9zM33 31l4-9 4 9z\"/><path style=\"--c:#2FBF5B\" class=\"q-f\" d=\"M7 34l4-9 4 9zM33 31l4-9 4 9z\"/><path class=\"q-h\" d=\"M5 40h9M34 40h9\"/><path style=\"--c:#3DDC84\" class=\"q-t\" d=\"M5 40h9M34 40h9\"/>",
  "lake": "<circle class=\"q-h\" cx=\"38\" cy=\"9\" r=\"3.8\"/><circle style=\"--c:#FFD54A\" class=\"q-w\" cx=\"38\" cy=\"9\" r=\"3.8\"/><path class=\"q-h\" d=\"M5 31l10-15 6 8 6-11 15 18z\"/><path style=\"--c:#7E8CFF\" class=\"q-f\" d=\"M5 31l10-15 6 8 6-11 15 18z\"/><path class=\"q-h\" d=\"M15 16l3 4.3h-6zM27 13l3.4 5h-6.8z\"/><path style=\"--c:#FFFFFF\" class=\"q-w\" d=\"M15 16l3 4.3h-6zM27 13l3.4 5h-6.8z\"/><ellipse class=\"q-h\" cx=\"24\" cy=\"35\" rx=\"19\" ry=\"7\"/><ellipse style=\"--c:#3FA9FF\" class=\"q-f\" cx=\"24\" cy=\"35\" rx=\"19\" ry=\"7\"/><path class=\"q-h\" d=\"M15 34h9M28 37h7\"/><path style=\"--c:#E3F6FF\" class=\"q-t\" d=\"M15 34h9M28 37h7\"/><path class=\"q-h\" d=\"M5 39l3.5-8 3.5 8z\"/><path style=\"--c:#2FBF5B\" class=\"q-f\" d=\"M5 39l3.5-8 3.5 8z\"/>",
  "cottage": "<rect class=\"q-h\" x=\"31\" y=\"11\" width=\"4.5\" height=\"9\" rx=\"1\"/><rect style=\"--c:#C8923E\" class=\"q-f\" x=\"31\" y=\"11\" width=\"4.5\" height=\"9\" rx=\"1\"/><path class=\"q-h\" d=\"M33.5 8c-2-2 2-3 0-5.5\"/><path style=\"--c:#C7D2FF\" class=\"q-t\" d=\"M33.5 8c-2-2 2-3 0-5.5\"/><path class=\"q-h\" d=\"M7 24L24 10l17 14z\"/><path style=\"--c:#FF4F5E\" class=\"q-f\" d=\"M7 24L24 10l17 14z\"/><rect class=\"q-h\" x=\"11\" y=\"23\" width=\"26\" height=\"19\" rx=\"1.5\"/><rect style=\"--c:#FFB13B\" class=\"q-f\" x=\"11\" y=\"23\" width=\"26\" height=\"19\" rx=\"1.5\"/><rect class=\"q-h\" x=\"14.5\" y=\"27\" width=\"5.5\" height=\"5.5\" rx=\"1\"/><rect style=\"--c:#FFE066\" class=\"q-w\" x=\"14.5\" y=\"27\" width=\"5.5\" height=\"5.5\" rx=\"1\"/><rect class=\"q-h\" x=\"25\" y=\"30\" width=\"6.5\" height=\"12\" rx=\"1\"/><rect style=\"--c:#8B5A2B\" class=\"q-f\" x=\"25\" y=\"30\" width=\"6.5\" height=\"12\" rx=\"1\"/><path class=\"q-h\" d=\"M3 43h42\"/><path style=\"--c:#3DDC84\" d=\"M3 43h42\"/>",
  "palm": "<path class=\"q-h\" d=\"M3 40c8-5 18-6 26-4 6 1.5 10 3 16 4v4H3z\"/><path style=\"--c:#FFC83D\" class=\"q-f\" d=\"M3 40c8-5 18-6 26-4 6 1.5 10 3 16 4v4H3z\"/><path class=\"q-h\" d=\"M19.5 39c0-11 3-18.5 7.5-24.5l2.5 1.5c-3.5 6-5.5 13-5 23z\"/><path style=\"--c:#C8923E\" class=\"q-f\" d=\"M19.5 39c0-11 3-18.5 7.5-24.5l2.5 1.5c-3.5 6-5.5 13-5 23z\"/><path class=\"q-h\" d=\"M28 15c-5-6-13-7-19-3 7 0 13 1 19 3z\"/><path style=\"--c:#2FBF5B\" class=\"q-f\" d=\"M28 15c-5-6-13-7-19-3 7 0 13 1 19 3z\"/><path class=\"q-h\" d=\"M28 15c2-7 9-11 16-9-6 2-11 5-16 9z\"/><path style=\"--c:#3DDC84\" class=\"q-f\" d=\"M28 15c2-7 9-11 16-9-6 2-11 5-16 9z\"/><path class=\"q-h\" d=\"M28 15c-7 1-12 6-13 13 4-5 8-9 13-13z\"/><path style=\"--c:#3DDC84\" class=\"q-f\" d=\"M28 15c-7 1-12 6-13 13 4-5 8-9 13-13z\"/><path class=\"q-h\" d=\"M28 15c7 0 12 5 13 12-4-5-8-9-13-12z\"/><path style=\"--c:#2FBF5B\" class=\"q-f\" d=\"M28 15c7 0 12 5 13 12-4-5-8-9-13-12z\"/><circle class=\"q-h\" cx=\"27\" cy=\"17.5\" r=\"1.9\"/><circle style=\"--c:#8B5A2B\" class=\"q-w\" cx=\"27\" cy=\"17.5\" r=\"1.9\"/><path class=\"q-h\" d=\"M33 34c3 0 4-1.5 6.5-1.5S42 34 45 34\"/><path style=\"--c:#3FA9FF\" d=\"M33 34c3 0 4-1.5 6.5-1.5S42 34 45 34\"/>",
  "pyramid": "<circle class=\"q-h\" cx=\"37\" cy=\"11\" r=\"4\"/><circle style=\"--c:#FF6A3D\" class=\"q-w\" cx=\"37\" cy=\"11\" r=\"4\"/><path class=\"q-h\" d=\"M3 40L20 13l17 27z\"/><path style=\"--c:#FFC83D\" class=\"q-f\" d=\"M3 40L20 13l17 27z\"/><path class=\"q-h\" d=\"M20 13l17 27h-9z\"/><path style=\"--c:#E0952E\" class=\"q-f\" d=\"M20 13l17 27h-9z\"/><path class=\"q-h\" d=\"M29 40l8-12.5L45 40z\"/><path style=\"--c:#FFB13B\" class=\"q-f\" d=\"M29 40l8-12.5L45 40z\"/><path class=\"q-h\" d=\"M2 41.5h44\"/><path style=\"--c:#E0A94A\" d=\"M2 41.5h44\"/>",
  "windmill": "<path class=\"q-h\" d=\"M4 44c8-3 32-3 40 0\"/><path style=\"--c:#3DDC84\" d=\"M4 44c8-3 32-3 40 0\"/><path class=\"q-h\" d=\"M19 44l3-25h4l3 25z\"/><path style=\"--c:#E8C49A\" class=\"q-f\" d=\"M19 44l3-25h4l3 25z\"/><rect class=\"q-h\" x=\"22.5\" y=\"37\" width=\"3\" height=\"7\" rx=\"1\"/><rect style=\"--c:#8B5A2B\" class=\"q-w\" x=\"22.5\" y=\"37\" width=\"3\" height=\"7\" rx=\"1\"/><g class=\"q-h\"><rect x=\"22\" y=\"3.5\" width=\"4\" height=\"15\" rx=\"1.2\" transform=\"rotate(40 24 19)\"/><rect x=\"22\" y=\"3.5\" width=\"4\" height=\"15\" rx=\"1.2\" transform=\"rotate(130 24 19)\"/><rect x=\"22\" y=\"3.5\" width=\"4\" height=\"15\" rx=\"1.2\" transform=\"rotate(220 24 19)\"/><rect x=\"22\" y=\"3.5\" width=\"4\" height=\"15\" rx=\"1.2\" transform=\"rotate(310 24 19)\"/></g><g style=\"--c:#E3F6FF\" class=\"q-f\"><rect x=\"22\" y=\"3.5\" width=\"4\" height=\"15\" rx=\"1.2\" transform=\"rotate(40 24 19)\"/><rect x=\"22\" y=\"3.5\" width=\"4\" height=\"15\" rx=\"1.2\" transform=\"rotate(130 24 19)\"/><rect x=\"22\" y=\"3.5\" width=\"4\" height=\"15\" rx=\"1.2\" transform=\"rotate(220 24 19)\"/><rect x=\"22\" y=\"3.5\" width=\"4\" height=\"15\" rx=\"1.2\" transform=\"rotate(310 24 19)\"/></g><circle class=\"q-h\" cx=\"24\" cy=\"19\" r=\"2.6\"/><circle style=\"--c:#FF4F5E\" class=\"q-w\" cx=\"24\" cy=\"19\" r=\"2.6\"/>",
  "candy": "<path class=\"q-h\" d=\"M15.5 24L5 16v16zM32.5 24L43 16v16z\"/><path style=\"--c:#FFD23C\" class=\"q-f\" d=\"M15.5 24L5 16v16zM32.5 24L43 16v16z\"/><circle class=\"q-h\" cx=\"24\" cy=\"24\" r=\"9.5\"/><circle style=\"--c:#FF4F8F\" class=\"q-f\" cx=\"24\" cy=\"24\" r=\"9.5\"/><path class=\"q-h\" d=\"M17.5 24a6.5 6.5 0 0 1 13 0a4.3 4.3 0 0 1-8.6 0a2.1 2.1 0 0 1 4.2 0\"/><path style=\"--c:#FFFFFF\" class=\"q-t\" d=\"M17.5 24a6.5 6.5 0 0 1 13 0a4.3 4.3 0 0 1-8.6 0a2.1 2.1 0 0 1 4.2 0\"/><path class=\"q-h\" d=\"M39 4.8Q39 8 42.2 8Q39 8 39 11.2Q39 8 35.8 8Q39 8 39 4.8z\"/><path style=\"--c:#FFFFFF\" class=\"q-w\" d=\"M39 4.8Q39 8 42.2 8Q39 8 39 11.2Q39 8 35.8 8Q39 8 39 4.8z\"/><path class=\"q-h\" d=\"M10 37.4Q10 40 12.6 40Q10 40 10 42.6Q10 40 7.4 40Q10 40 10 37.4z\"/><path style=\"--c:#7FE3FF\" class=\"q-w\" d=\"M10 37.4Q10 40 12.6 40Q10 40 10 42.6Q10 40 7.4 40Q10 40 10 37.4z\"/>",
  "cake": "<path class=\"q-h\" d=\"M5 42.5h38\"/><path style=\"--c:#C7D2FF\" d=\"M5 42.5h38\"/><rect class=\"q-h\" x=\"9\" y=\"26\" width=\"30\" height=\"15\" rx=\"2.5\"/><rect style=\"--c:#FF7AA8\" class=\"q-f\" x=\"9\" y=\"26\" width=\"30\" height=\"15\" rx=\"2.5\"/><path class=\"q-h\" d=\"M9 29.5c0-2.5 1-3.5 3-3.5h24c2 0 3 1 3 3.5-1.7 1.8-3.3 1.8-5 0-1.7 1.8-3.3 1.8-5 0-1.7 1.8-3.3 1.8-5 0-1.7 1.8-3.3 1.8-5 0-1.7 1.8-3.3 1.8-5 0-1.7 1.8-3.3 1.8-5 0z\"/><path style=\"--c:#FFFFFF\" class=\"q-w\" d=\"M9 29.5c0-2.5 1-3.5 3-3.5h24c2 0 3 1 3 3.5-1.7 1.8-3.3 1.8-5 0-1.7 1.8-3.3 1.8-5 0-1.7 1.8-3.3 1.8-5 0-1.7 1.8-3.3 1.8-5 0-1.7 1.8-3.3 1.8-5 0-1.7 1.8-3.3 1.8-5 0z\"/><rect class=\"q-h\" x=\"15.5\" y=\"16\" width=\"3\" height=\"10\" rx=\"1\"/><rect style=\"--c:#7FE3FF\" class=\"q-w\" x=\"15.5\" y=\"16\" width=\"3\" height=\"10\" rx=\"1\"/><rect class=\"q-h\" x=\"22.5\" y=\"14\" width=\"3\" height=\"12\" rx=\"1\"/><rect style=\"--c:#FFD23C\" class=\"q-w\" x=\"22.5\" y=\"14\" width=\"3\" height=\"12\" rx=\"1\"/><rect class=\"q-h\" x=\"29.5\" y=\"16\" width=\"3\" height=\"10\" rx=\"1\"/><rect style=\"--c:#B07CFF\" class=\"q-w\" x=\"29.5\" y=\"16\" width=\"3\" height=\"10\" rx=\"1\"/><g class=\"q-h\"><path d=\"M17 9c1.5 2 2.3 3.3 2.3 4.3a2.3 2.3 0 0 1-4.6 0c0-1 .8-2.3 2.3-4.3z\"/><path d=\"M24 7c1.5 2 2.3 3.3 2.3 4.3a2.3 2.3 0 0 1-4.6 0c0-1 .8-2.3 2.3-4.3z\"/><path d=\"M31 9c1.5 2 2.3 3.3 2.3 4.3a2.3 2.3 0 0 1-4.6 0c0-1 .8-2.3 2.3-4.3z\"/></g><g style=\"--c:#FF9F2E\" class=\"q-w\"><path d=\"M17 9c1.5 2 2.3 3.3 2.3 4.3a2.3 2.3 0 0 1-4.6 0c0-1 .8-2.3 2.3-4.3z\"/><path d=\"M24 7c1.5 2 2.3 3.3 2.3 4.3a2.3 2.3 0 0 1-4.6 0c0-1 .8-2.3 2.3-4.3z\"/><path d=\"M31 9c1.5 2 2.3 3.3 2.3 4.3a2.3 2.3 0 0 1-4.6 0c0-1 .8-2.3 2.3-4.3z\"/></g><circle class=\"q-h\" cx=\"15\" cy=\"36\" r=\"1.3\"/><circle style=\"--c:#FFE066\" class=\"q-w\" cx=\"15\" cy=\"36\" r=\"1.3\"/><circle class=\"q-h\" cx=\"24\" cy=\"35\" r=\"1.3\"/><circle style=\"--c:#3FA9FF\" class=\"q-w\" cx=\"24\" cy=\"35\" r=\"1.3\"/><circle class=\"q-h\" cx=\"33\" cy=\"36\" r=\"1.3\"/><circle style=\"--c:#FFE066\" class=\"q-w\" cx=\"33\" cy=\"36\" r=\"1.3\"/>",
  "fireworks": "<path class=\"q-h\" d=\"M18 44V31M34 44v-6\"/><path style=\"--c:#B07CFF\" class=\"q-t\" d=\"M18 44V31M34 44v-6\"/><path class=\"q-h\" d=\"M22.0 18.0L31.0 18.0M21.2 20.4L28.5 25.6M19.2 21.8L22.0 30.4M16.8 21.8L14.0 30.4M14.8 20.4L7.5 25.6M14.0 18.0L5.0 18.0M14.8 15.6L7.5 10.4M16.8 14.2L14.0 5.6M19.2 14.2L22.0 5.6M21.2 15.6L28.5 10.4\"/><path style=\"--c:#FF4F8F\" d=\"M22.0 18.0L31.0 18.0M21.2 20.4L28.5 25.6M19.2 21.8L22.0 30.4M16.8 21.8L14.0 30.4M14.8 20.4L7.5 25.6M14.0 18.0L5.0 18.0M14.8 15.6L7.5 10.4M16.8 14.2L14.0 5.6M19.2 14.2L22.0 5.6M21.2 15.6L28.5 10.4\"/><path class=\"q-h\" d=\"M37.0 31.0L43.5 31.0M36.1 33.1L40.7 37.7M34.0 34.0L34.0 40.5M31.9 33.1L27.3 37.7M31.0 31.0L24.5 31.0M31.9 28.9L27.3 24.3M34.0 28.0L34.0 21.5M36.1 28.9L40.7 24.3\"/><path style=\"--c:#FFD23C\" d=\"M37.0 31.0L43.5 31.0M36.1 33.1L40.7 37.7M34.0 34.0L34.0 40.5M31.9 33.1L27.3 37.7M31.0 31.0L24.5 31.0M31.9 28.9L27.3 24.3M34.0 28.0L34.0 21.5M36.1 28.9L40.7 24.3\"/><path class=\"q-h\" d=\"M39.0 9.0L43.0 9.0M38.4 10.4L41.2 13.2M37.0 11.0L37.0 15.0M35.6 10.4L32.8 13.2M35.0 9.0L31.0 9.0M35.6 7.6L32.8 4.8M37.0 7.0L37.0 3.0M38.4 7.6L41.2 4.8\"/><path style=\"--c:#7FE3FF\" class=\"q-t\" d=\"M39.0 9.0L43.0 9.0M38.4 10.4L41.2 13.2M37.0 11.0L37.0 15.0M35.6 10.4L32.8 13.2M35.0 9.0L31.0 9.0M35.6 7.6L32.8 4.8M37.0 7.0L37.0 3.0M38.4 7.6L41.2 4.8\"/><circle class=\"q-h\" cx=\"18\" cy=\"18\" r=\"2.2\"/><circle style=\"--c:#FFE066\" class=\"q-w\" cx=\"18\" cy=\"18\" r=\"2.2\"/><circle class=\"q-h\" cx=\"34\" cy=\"31\" r=\"1.8\"/><circle style=\"--c:#FFFFFF\" class=\"q-w\" cx=\"34\" cy=\"31\" r=\"1.8\"/><path class=\"q-h\" d=\"M8 34Q8 37 11 37Q8 37 8 40Q8 37 5 37Q8 37 8 34z\"/><path style=\"--c:#3DDC84\" class=\"q-w\" d=\"M8 34Q8 37 11 37Q8 37 8 40Q8 37 5 37Q8 37 8 34z\"/>",
  "balloon": "<path class=\"q-h\" d=\"M16 24.5c0 7 6 10 8 19M32 22.5c0 7-6 11-8 21M24 31.5v12\"/><path style=\"--c:#E3ECFF\" class=\"q-t\" d=\"M16 24.5c0 7 6 10 8 19M32 22.5c0 7-6 11-8 21M24 31.5v12\"/><ellipse class=\"q-h\" cx=\"16\" cy=\"16\" rx=\"7.5\" ry=\"9\"/><ellipse style=\"--c:#FF4F5E\" class=\"q-f\" cx=\"16\" cy=\"16\" rx=\"7.5\" ry=\"9\"/><ellipse class=\"q-h\" cx=\"32\" cy=\"14\" rx=\"7.5\" ry=\"9\"/><ellipse style=\"--c:#3FA9FF\" class=\"q-f\" cx=\"32\" cy=\"14\" rx=\"7.5\" ry=\"9\"/><ellipse class=\"q-h\" cx=\"24\" cy=\"23\" rx=\"7.5\" ry=\"9\"/><ellipse style=\"--c:#FFD23C\" class=\"q-f\" cx=\"24\" cy=\"23\" rx=\"7.5\" ry=\"9\"/><ellipse class=\"q-h\" cx=\"13.5\" cy=\"12.5\" rx=\"1.6\" ry=\"2.6\"/><ellipse style=\"--c:#FFFFFF\" class=\"q-w\" cx=\"13.5\" cy=\"12.5\" rx=\"1.6\" ry=\"2.6\"/><ellipse class=\"q-h\" cx=\"29.5\" cy=\"10.5\" rx=\"1.6\" ry=\"2.6\"/><ellipse style=\"--c:#FFFFFF\" class=\"q-w\" cx=\"29.5\" cy=\"10.5\" rx=\"1.6\" ry=\"2.6\"/><ellipse class=\"q-h\" cx=\"21.5\" cy=\"19.5\" rx=\"1.6\" ry=\"2.6\"/><ellipse style=\"--c:#FFFFFF\" class=\"q-w\" cx=\"21.5\" cy=\"19.5\" rx=\"1.6\" ry=\"2.6\"/>",
  "mask": "<path class=\"q-h\" d=\"M33 18c0-6 2-11 6-13 0 5-2 10-6 13z\"/><path style=\"--c:#FFD23C\" class=\"q-f\" d=\"M33 18c0-6 2-11 6-13 0 5-2 10-6 13z\"/><path class=\"q-h\" d=\"M36 18c2-6 6-10 10-11-1 5-4 9-10 11z\"/><path style=\"--c:#FF4F8F\" class=\"q-f\" d=\"M36 18c2-6 6-10 10-11-1 5-4 9-10 11z\"/><path class=\"q-h\" d=\"M9 33l-4 10\"/><path style=\"--c:#C8923E\" class=\"q-t\" d=\"M9 33l-4 10\"/><path class=\"q-h\" d=\"M5 19c6-3 13-1 19 2 6-3 13-5 19-2 1 9-3 15-9.5 15-4 0-6.5-3-9.5-5.5-3 2.5-5.5 5.5-9.5 5.5C8 34 4 28 5 19z\"/><path style=\"--c:#B07CFF\" class=\"q-f\" d=\"M5 19c6-3 13-1 19 2 6-3 13-5 19-2 1 9-3 15-9.5 15-4 0-6.5-3-9.5-5.5-3 2.5-5.5 5.5-9.5 5.5C8 34 4 28 5 19z\"/><ellipse class=\"q-h\" cx=\"15\" cy=\"24\" rx=\"4.2\" ry=\"2.8\"/><ellipse style=\"--c:#1A1B1F\" class=\"q-w\" cx=\"15\" cy=\"24\" rx=\"4.2\" ry=\"2.8\"/><ellipse class=\"q-h\" cx=\"33\" cy=\"24\" rx=\"4.2\" ry=\"2.8\"/><ellipse style=\"--c:#1A1B1F\" class=\"q-w\" cx=\"33\" cy=\"24\" rx=\"4.2\" ry=\"2.8\"/><circle class=\"q-h\" cx=\"24\" cy=\"28.5\" r=\"1.9\"/><circle style=\"--c:#FFD23C\" class=\"q-w\" cx=\"24\" cy=\"28.5\" r=\"1.9\"/><circle class=\"q-h\" cx=\"10\" cy=\"20\" r=\"1.2\"/><circle style=\"--c:#7FE3FF\" class=\"q-w\" cx=\"10\" cy=\"20\" r=\"1.2\"/><circle class=\"q-h\" cx=\"38\" cy=\"20\" r=\"1.2\"/><circle style=\"--c:#7FE3FF\" class=\"q-w\" cx=\"38\" cy=\"20\" r=\"1.2\"/>",
  "siren": "<path class=\"q-h\" d=\"M11 9l3.5 3.5M5 21h5M17 5l1.5 4.5\"/><path style=\"--c:#FF4F5E\" d=\"M11 9l3.5 3.5M5 21h5M17 5l1.5 4.5\"/><path class=\"q-h\" d=\"M37 9l-3.5 3.5M38 21h5M31 5l-1.5 4.5\"/><path style=\"--c:#3FA9FF\" d=\"M37 9l-3.5 3.5M38 21h5M31 5l-1.5 4.5\"/><path class=\"q-h\" d=\"M13 32v-7a11 11 0 0 1 11-11v18z\"/><path style=\"--c:#FF4F5E\" class=\"q-f\" d=\"M13 32v-7a11 11 0 0 1 11-11v18z\"/><path class=\"q-h\" d=\"M24 14a11 11 0 0 1 11 11v7H24z\"/><path style=\"--c:#3FA9FF\" class=\"q-f\" d=\"M24 14a11 11 0 0 1 11 11v7H24z\"/><ellipse class=\"q-h\" cx=\"18.5\" cy=\"22\" rx=\"1.8\" ry=\"3.4\"/><ellipse style=\"--c:#FFFFFF\" class=\"q-w\" cx=\"18.5\" cy=\"22\" rx=\"1.8\" ry=\"3.4\"/><rect class=\"q-h\" x=\"9\" y=\"32\" width=\"30\" height=\"7\" rx=\"2\"/><rect style=\"--c:#C7D2FF\" class=\"q-f\" x=\"9\" y=\"32\" width=\"30\" height=\"7\" rx=\"2\"/>",
  "piano": "<rect class=\"q-h\" x=\"5\" y=\"19\" width=\"38\" height=\"21\" rx=\"2.5\"/><rect style=\"--c:#FFFFFF\" class=\"q-f\" x=\"5\" y=\"19\" width=\"38\" height=\"21\" rx=\"2.5\"/><path class=\"q-h\" d=\"M12.6 30v10M20.2 30v10M27.8 30v10M35.4 30v10\"/><path style=\"--c:#9AA3B5\" class=\"q-t\" d=\"M12.6 30v10M20.2 30v10M27.8 30v10M35.4 30v10\"/><g class=\"q-h\"><rect x=\"10.5\" y=\"19\" width=\"4.2\" height=\"11\" rx=\"1\"/><rect x=\"18.1\" y=\"19\" width=\"4.2\" height=\"11\" rx=\"1\"/><rect x=\"33.3\" y=\"19\" width=\"4.2\" height=\"11\" rx=\"1\"/></g><g style=\"--c:#23252B\" class=\"q-w\"><rect x=\"10.5\" y=\"19\" width=\"4.2\" height=\"11\" rx=\"1\"/><rect x=\"18.1\" y=\"19\" width=\"4.2\" height=\"11\" rx=\"1\"/><rect x=\"33.3\" y=\"19\" width=\"4.2\" height=\"11\" rx=\"1\"/></g><path class=\"q-h\" d=\"M27 4h3v9a3 3 0 1 1-3-2.8z\"/><path style=\"--c:#FF7AD9\" class=\"q-w\" d=\"M27 4h3v9a3 3 0 1 1-3-2.8z\"/><path class=\"q-h\" d=\"M36 7h2.6v7.5a2.6 2.6 0 1 1-2.6-2.4z\"/><path style=\"--c:#7FE3FF\" class=\"q-w\" d=\"M36 7h2.6v7.5a2.6 2.6 0 1 1-2.6-2.4z\"/>",
  "snakegame": "<g class=\"q-h\"><rect x=\"7\" y=\"33\" width=\"6\" height=\"6\" rx=\"1.6\"/><rect x=\"13.5\" y=\"33\" width=\"6\" height=\"6\" rx=\"1.6\"/><rect x=\"20\" y=\"33\" width=\"6\" height=\"6\" rx=\"1.6\"/><rect x=\"20\" y=\"26.5\" width=\"6\" height=\"6\" rx=\"1.6\"/><rect x=\"20\" y=\"20\" width=\"6\" height=\"6\" rx=\"1.6\"/><rect x=\"26.5\" y=\"20\" width=\"6\" height=\"6\" rx=\"1.6\"/><rect x=\"33\" y=\"20\" width=\"6\" height=\"6\" rx=\"1.6\"/></g><g style=\"--c:#3DDC84\" class=\"q-f\"><rect x=\"7\" y=\"33\" width=\"6\" height=\"6\" rx=\"1.6\"/><rect x=\"13.5\" y=\"33\" width=\"6\" height=\"6\" rx=\"1.6\"/><rect x=\"20\" y=\"33\" width=\"6\" height=\"6\" rx=\"1.6\"/><rect x=\"20\" y=\"26.5\" width=\"6\" height=\"6\" rx=\"1.6\"/><rect x=\"20\" y=\"20\" width=\"6\" height=\"6\" rx=\"1.6\"/><rect x=\"26.5\" y=\"20\" width=\"6\" height=\"6\" rx=\"1.6\"/><rect x=\"33\" y=\"20\" width=\"6\" height=\"6\" rx=\"1.6\"/></g><rect class=\"q-h\" x=\"33\" y=\"12\" width=\"7\" height=\"7\" rx=\"2\"/><rect style=\"--c:#2FBF5B\" class=\"q-f\" x=\"33\" y=\"12\" width=\"7\" height=\"7\" rx=\"2\"/><circle class=\"q-h\" cx=\"37.8\" cy=\"14.5\" r=\"1\"/><circle style=\"--c:#FFFFFF\" class=\"q-w\" cx=\"37.8\" cy=\"14.5\" r=\"1\"/><circle class=\"q-h\" cx=\"13\" cy=\"15\" r=\"5\"/><circle style=\"--c:#FF4F5E\" class=\"q-f\" cx=\"13\" cy=\"15\" r=\"5\"/><path class=\"q-h\" d=\"M13 10c1-3 3-4 5-4\"/><path style=\"--c:#7CFF6B\" d=\"M13 10c1-3 3-4 5-4\"/>",
  "rocket": "<path class=\"q-h\" d=\"M19 36c0 5 2.5 8 5 10 2.5-2 5-5 5-10z\"/><path style=\"--c:#FF8A3D\" class=\"q-f\" d=\"M19 36c0 5 2.5 8 5 10 2.5-2 5-5 5-10z\"/><path class=\"q-h\" d=\"M21.5 36c0 3 1 5 2.5 6.5 1.5-1.5 2.5-3.5 2.5-6.5z\"/><path style=\"--c:#FFE066\" class=\"q-w\" d=\"M21.5 36c0 3 1 5 2.5 6.5 1.5-1.5 2.5-3.5 2.5-6.5z\"/><path class=\"q-h\" d=\"M17 25l-6 9v4l7-4zM31 25l6 9v4l-7-4z\"/><path style=\"--c:#FF4F5E\" class=\"q-f\" d=\"M17 25l-6 9v4l7-4zM31 25l6 9v4l-7-4z\"/><path class=\"q-h\" d=\"M24 4c7 6 9 16 7 32H17c-2-16 0-26 7-32z\"/><path style=\"--c:#E3ECFF\" class=\"q-f\" d=\"M24 4c7 6 9 16 7 32H17c-2-16 0-26 7-32z\"/><circle class=\"q-h\" cx=\"24\" cy=\"19\" r=\"4\"/><circle style=\"--c:#3FA9FF\" class=\"q-f\" cx=\"24\" cy=\"19\" r=\"4\"/><path class=\"q-h\" d=\"M9 7.8Q9 11 12.2 11Q9 11 9 14.2Q9 11 5.8 11Q9 11 9 7.8z\"/><path style=\"--c:#FFD54A\" class=\"q-w\" d=\"M9 7.8Q9 11 12.2 11Q9 11 9 14.2Q9 11 5.8 11Q9 11 9 7.8z\"/><circle class=\"q-h\" cx=\"40\" cy=\"14\" r=\"1.4\"/><circle style=\"--c:#FFFFFF\" class=\"q-w\" cx=\"40\" cy=\"14\" r=\"1.4\"/><circle class=\"q-h\" cx=\"38\" cy=\"40\" r=\"1.2\"/><circle style=\"--c:#7FE3FF\" class=\"q-w\" cx=\"38\" cy=\"40\" r=\"1.2\"/>",
  "comet": "<path class=\"q-h\" d=\"M28 21L6 42\"/><path style=\"--c:#FFB13B\" d=\"M28 21L6 42\"/><path class=\"q-h\" d=\"M24 16L9 31\"/><path style=\"--c:#FF7A3D\" class=\"q-t\" d=\"M24 16L9 31\"/><path class=\"q-h\" d=\"M33 25L21 37\"/><path style=\"--c:#FFD23C\" class=\"q-t\" d=\"M33 25L21 37\"/><circle class=\"q-h\" cx=\"33\" cy=\"15\" r=\"7.5\"/><circle style=\"--c:#FF9F2E\" class=\"q-f\" cx=\"33\" cy=\"15\" r=\"7.5\"/><circle class=\"q-h\" cx=\"30.5\" cy=\"12.5\" r=\"2.5\"/><circle style=\"--c:#FFF3B0\" class=\"q-w\" cx=\"30.5\" cy=\"12.5\" r=\"2.5\"/><path class=\"q-h\" d=\"M41 34Q41 37 44 37Q41 37 41 40Q41 37 38 37Q41 37 41 34z\"/><path style=\"--c:#7FE3FF\" class=\"q-w\" d=\"M41 34Q41 37 44 37Q41 37 41 40Q41 37 38 37Q41 37 41 34z\"/><circle class=\"q-h\" cx=\"12\" cy=\"9\" r=\"1.4\"/><circle style=\"--c:#FFFFFF\" class=\"q-w\" cx=\"12\" cy=\"9\" r=\"1.4\"/><circle class=\"q-h\" cx=\"43\" cy=\"6\" r=\"1.1\"/><circle style=\"--c:#FFFFFF\" class=\"q-w\" cx=\"43\" cy=\"6\" r=\"1.1\"/>",
  "earth": "<circle class=\"q-h\" cx=\"24\" cy=\"25\" r=\"17\"/><circle style=\"--c:#3FA9FF\" class=\"q-f\" cx=\"24\" cy=\"25\" r=\"17\"/><g class=\"q-h\"><path d=\"M13 15c4-2 8 0 9 3s-3 4-3 7-4 3-6 1-3-5-2-7 0-3 2-4z\"/><path d=\"M27 28c3-1 7 0 8 3s-2 7-5 7-4-3-4-5 0-4 1-5z\"/><path d=\"M29 11c3 0 6 2 7 4-2 1-5 0-7-1z\"/></g><g style=\"--c:#3DDC84\" class=\"q-w\"><path d=\"M13 15c4-2 8 0 9 3s-3 4-3 7-4 3-6 1-3-5-2-7 0-3 2-4z\"/><path d=\"M27 28c3-1 7 0 8 3s-2 7-5 7-4-3-4-5 0-4 1-5z\"/><path d=\"M29 11c3 0 6 2 7 4-2 1-5 0-7-1z\"/></g><path class=\"q-h\" d=\"M8 31c3-1 5 0 7 1M30 20c2-1 5-1 7 0\"/><path style=\"--c:#FFFFFF\" class=\"q-t\" d=\"M8 31c3-1 5 0 7 1M30 20c2-1 5-1 7 0\"/><circle class=\"q-h\" cx=\"41\" cy=\"7\" r=\"2.6\"/><circle style=\"--c:#E3ECFF\" class=\"q-f\" cx=\"41\" cy=\"7\" r=\"2.6\"/>",
  "ufo": "<path class=\"q-h\" d=\"M17 30l-7 14h28l-7-14z\"/><path style=\"--c:#7CFF6B\" class=\"q-g\" d=\"M17 30l-7 14h28l-7-14z\"/><ellipse class=\"q-h\" cx=\"24\" cy=\"28\" rx=\"17\" ry=\"6\"/><ellipse style=\"--c:#7FE3FF\" class=\"q-f\" cx=\"24\" cy=\"28\" rx=\"17\" ry=\"6\"/><path class=\"q-h\" d=\"M15 25a9 9 0 0 1 18 0z\"/><path style=\"--c:#B07CFF\" class=\"q-f\" d=\"M15 25a9 9 0 0 1 18 0z\"/><circle class=\"q-h\" cx=\"13\" cy=\"28\" r=\"1.5\"/><circle style=\"--c:#FFD23C\" class=\"q-w\" cx=\"13\" cy=\"28\" r=\"1.5\"/><circle class=\"q-h\" cx=\"24\" cy=\"30.5\" r=\"1.5\"/><circle style=\"--c:#FF4F8F\" class=\"q-w\" cx=\"24\" cy=\"30.5\" r=\"1.5\"/><circle class=\"q-h\" cx=\"35\" cy=\"28\" r=\"1.5\"/><circle style=\"--c:#FFD23C\" class=\"q-w\" cx=\"35\" cy=\"28\" r=\"1.5\"/><path class=\"q-h\" d=\"M39 5.8Q39 9 42.2 9Q39 9 39 12.2Q39 9 35.8 9Q39 9 39 5.8z\"/><path style=\"--c:#FFFFFF\" class=\"q-w\" d=\"M39 5.8Q39 9 42.2 9Q39 9 39 12.2Q39 9 35.8 9Q39 9 39 5.8z\"/><circle class=\"q-h\" cx=\"9\" cy=\"12\" r=\"1.2\"/><circle style=\"--c:#FFFFFF\" class=\"q-w\" cx=\"9\" cy=\"12\" r=\"1.2\"/>",
  "fog": "<circle class=\"q-h\" cx=\"35\" cy=\"13\" r=\"5.5\"/><circle style=\"--c:#FFD54A\" class=\"q-w\" cx=\"35\" cy=\"13\" r=\"5.5\"/><path class=\"q-h\" d=\"M14 27a7 7 0 0 1-.6-14A9.5 9.5 0 0 1 31.5 14a6.5 6.5 0 0 1 2 13z\"/><path style=\"--c:#C7D2FF\" class=\"q-f\" d=\"M14 27a7 7 0 0 1-.6-14A9.5 9.5 0 0 1 31.5 14a6.5 6.5 0 0 1 2 13z\"/><path class=\"q-h\" d=\"M5 33h27\"/><path style=\"--c:#9AA8C7\" d=\"M5 33h27\"/><path class=\"q-h\" d=\"M14 38.5h29\"/><path style=\"--c:#E3ECFF\" d=\"M14 38.5h29\"/><path class=\"q-h\" d=\"M9 43.5h22\"/><path style=\"--c:#9AA8C7\" class=\"q-t\" d=\"M9 43.5h22\"/>",
  "icedrink": "<path class=\"q-h\" d=\"M13 20h22l-2.3 23H15.3z\"/><path style=\"--c:#FF9F2E\" class=\"q-f\" d=\"M13 20h22l-2.3 23H15.3z\"/><g class=\"q-h\"><rect x=\"16\" y=\"15\" width=\"7\" height=\"7\" rx=\"1.5\" transform=\"rotate(-12 19.5 18.5)\"/><rect x=\"24\" y=\"19\" width=\"6.5\" height=\"6.5\" rx=\"1.5\" transform=\"rotate(14 27 22)\"/></g><g style=\"--c:#E3F6FF\" class=\"q-w\"><rect x=\"16\" y=\"15\" width=\"7\" height=\"7\" rx=\"1.5\" transform=\"rotate(-12 19.5 18.5)\"/><rect x=\"24\" y=\"19\" width=\"6.5\" height=\"6.5\" rx=\"1.5\" transform=\"rotate(14 27 22)\"/></g><path class=\"q-h\" d=\"M11 10l3.5 33h19L37 10\"/><path style=\"--c:#E3F6FF\" d=\"M11 10l3.5 33h19L37 10\"/><path class=\"q-h\" d=\"M29 3l-3 26\"/><path style=\"--c:#FF4F8F\" d=\"M29 3l-3 26\"/><circle class=\"q-h\" cx=\"35.5\" cy=\"10.5\" r=\"5\"/><circle style=\"--c:#FFE066\" class=\"q-f\" cx=\"35.5\" cy=\"10.5\" r=\"5\"/><path class=\"q-h\" d=\"M35.5 10.5L39.1 10.5M35.5 10.5L37.3 13.6M35.5 10.5L33.7 13.6M35.5 10.5L31.9 10.5M35.5 10.5L33.7 7.4M35.5 10.5L37.3 7.4\"/><path style=\"--c:#FFF3B0\" class=\"q-t\" d=\"M35.5 10.5L39.1 10.5M35.5 10.5L37.3 13.6M35.5 10.5L33.7 13.6M35.5 10.5L31.9 10.5M35.5 10.5L33.7 7.4M35.5 10.5L37.3 7.4\"/>",
  "wine": "<path class=\"q-h\" d=\"M15 11h18c-.8 7-4.3 11-9 11s-8.2-4-9-11z\"/><path style=\"--c:#FF3B5C\" class=\"q-f\" d=\"M15 11h18c-.8 7-4.3 11-9 11s-8.2-4-9-11z\"/><path class=\"q-h\" d=\"M14 5h20c0 11-4 18-10 18S14 16 14 5\"/><path style=\"--c:#E3ECFF\" d=\"M14 5h20c0 11-4 18-10 18S14 16 14 5\"/><path class=\"q-h\" d=\"M24 23v15M17 41h14\"/><path style=\"--c:#E3ECFF\" d=\"M24 23v15M17 41h14\"/><path class=\"q-h\" d=\"M40 4a6 6 0 1 0 5 9 5 5 0 0 1-5-9z\"/><path style=\"--c:#FFD54A\" class=\"q-w\" d=\"M40 4a6 6 0 1 0 5 9 5 5 0 0 1-5-9z\"/><path class=\"q-h\" d=\"M8 10Q8 13 11 13Q8 13 8 16Q8 13 5 13Q8 13 8 10z\"/><path style=\"--c:#FFFFFF\" class=\"q-w\" d=\"M8 10Q8 13 11 13Q8 13 8 16Q8 13 5 13Q8 13 8 10z\"/><circle class=\"q-h\" cx=\"38\" cy=\"26\" r=\"1.3\"/><circle style=\"--c:#FFFFFF\" class=\"q-w\" cx=\"38\" cy=\"26\" r=\"1.3\"/>",
  "dinner": "<circle class=\"q-h\" cx=\"24\" cy=\"26\" r=\"14.5\"/><circle style=\"--c:#E3ECFF\" class=\"q-f\" cx=\"24\" cy=\"26\" r=\"14.5\"/><circle class=\"q-h\" cx=\"24\" cy=\"26\" r=\"9.5\"/><circle style=\"--c:#9FB2E0\" class=\"q-f\" cx=\"24\" cy=\"26\" r=\"9.5\"/><path class=\"q-h\" d=\"M5 9v8a3 3 0 0 0 6 0V9M8 9v31\"/><path style=\"--c:#FFD23C\" d=\"M5 9v8a3 3 0 0 0 6 0V9M8 9v31\"/><path class=\"q-h\" d=\"M42 9c-3 3-4 9-4 14h4v17\"/><path style=\"--c:#FFD23C\" d=\"M42 9c-3 3-4 9-4 14h4v17\"/><path class=\"q-h\" d=\"M19 25c0-3 2-5 5-5s5 2 5 5c0 1.5-1 2.5-2.5 2.5h-5C20 27.5 19 26.5 19 25z\"/><path style=\"--c:#FF8A3D\" class=\"q-w\" d=\"M19 25c0-3 2-5 5-5s5 2 5 5c0 1.5-1 2.5-2.5 2.5h-5C20 27.5 19 26.5 19 25z\"/><path class=\"q-h\" d=\"M22 15c-1-2 1-3 0-5M26 15c-1-2 1-3 0-5\"/><path style=\"--c:#E3ECFF\" class=\"q-t\" d=\"M22 15c-1-2 1-3 0-5M26 15c-1-2 1-3 0-5\"/>",
  "laptop": "<rect class=\"q-h\" x=\"8\" y=\"9\" width=\"32\" height=\"22\" rx=\"2.5\"/><rect style=\"--c:#5B6CFF\" class=\"q-f\" x=\"8\" y=\"9\" width=\"32\" height=\"22\" rx=\"2.5\"/><rect class=\"q-h\" x=\"11\" y=\"12\" width=\"26\" height=\"16\" rx=\"1\"/><rect style=\"--c:#1A1B1F\" class=\"q-w\" x=\"11\" y=\"12\" width=\"26\" height=\"16\" rx=\"1\"/><path class=\"q-h\" d=\"M14.5 16h10M14.5 20h16M14.5 24h8\"/><path style=\"--c:#7FE3FF\" class=\"q-t\" d=\"M14.5 16h10M14.5 20h16M14.5 24h8\"/><path class=\"q-h\" d=\"M4 33h40l-3.5 5h-33z\"/><path style=\"--c:#C7D2FF\" class=\"q-f\" d=\"M4 33h40l-3.5 5h-33z\"/><circle class=\"q-h\" cx=\"33\" cy=\"16\" r=\"1.8\"/><circle style=\"--c:#FFD23C\" class=\"q-w\" cx=\"33\" cy=\"16\" r=\"1.8\"/>",
  "smile": "<circle class=\"q-h\" cx=\"24\" cy=\"24\" r=\"17\"/><circle style=\"--c:#FFD23C\" class=\"q-f\" cx=\"24\" cy=\"24\" r=\"17\"/><ellipse class=\"q-h\" cx=\"18\" cy=\"20\" rx=\"2\" ry=\"3\"/><ellipse style=\"--c:#3A2A14\" class=\"q-w\" cx=\"18\" cy=\"20\" rx=\"2\" ry=\"3\"/><ellipse class=\"q-h\" cx=\"30\" cy=\"20\" rx=\"2\" ry=\"3\"/><ellipse style=\"--c:#3A2A14\" class=\"q-w\" cx=\"30\" cy=\"20\" rx=\"2\" ry=\"3\"/><path class=\"q-h\" d=\"M16 28c4 6 12 6 16 0\"/><path style=\"--c:#3A2A14\" d=\"M16 28c4 6 12 6 16 0\"/><circle class=\"q-h\" cx=\"12.5\" cy=\"28\" r=\"2.5\"/><circle style=\"--c:#FF7A9A\" class=\"q-w\" cx=\"12.5\" cy=\"28\" r=\"2.5\"/><circle class=\"q-h\" cx=\"35.5\" cy=\"28\" r=\"2.5\"/><circle style=\"--c:#FF7A9A\" class=\"q-w\" cx=\"35.5\" cy=\"28\" r=\"2.5\"/>",
  "spiral": "<path class=\"q-h\" d=\"M24 24a2.5 2.5 0 0 1 5 0a5.5 5.5 0 0 1-11 0\"/><path style=\"--c:#FF4F8F\" d=\"M24 24a2.5 2.5 0 0 1 5 0a5.5 5.5 0 0 1-11 0\"/><path class=\"q-h\" d=\"M18 24a8.5 8.5 0 0 1 17 0\"/><path style=\"--c:#FFD23C\" d=\"M18 24a8.5 8.5 0 0 1 17 0\"/><path class=\"q-h\" d=\"M35 24a11.5 11.5 0 0 1-23 0\"/><path style=\"--c:#3DDC84\" d=\"M35 24a11.5 11.5 0 0 1-23 0\"/><path class=\"q-h\" d=\"M12 24a14.5 14.5 0 0 1 29 0\"/><path style=\"--c:#3FA9FF\" d=\"M12 24a14.5 14.5 0 0 1 29 0\"/><path class=\"q-h\" d=\"M41 24a17.5 17.5 0 0 1-17.5 17.5\"/><path style=\"--c:#B07CFF\" d=\"M41 24a17.5 17.5 0 0 1-17.5 17.5\"/><path class=\"q-h\" d=\"M40 4.8Q40 8 43.2 8Q40 8 40 11.2Q40 8 36.8 8Q40 8 40 4.8z\"/><path style=\"--c:#FFFFFF\" class=\"q-w\" d=\"M40 4.8Q40 8 43.2 8Q40 8 40 11.2Q40 8 36.8 8Q40 8 40 4.8z\"/>",
  "wind": "<path class=\"q-h\" d=\"M4 17h24a5 5 0 1 0-5-5\"/><path style=\"--c:#7FE3FF\" d=\"M4 17h24a5 5 0 1 0-5-5\"/><path class=\"q-h\" d=\"M4 25h33a5 5 0 1 1-5 5\"/><path style=\"--c:#E3F6FF\" d=\"M4 25h33a5 5 0 1 1-5 5\"/><path class=\"q-h\" d=\"M8 33h13a4 4 0 1 1-4 4\"/><path style=\"--c:#3FD0F0\" d=\"M8 33h13a4 4 0 1 1-4 4\"/><path class=\"q-h\" d=\"M36 9c3-3 7-3 8 0-2 3-5 3-8 0z\"/><path style=\"--c:#3DDC84\" class=\"q-f\" d=\"M36 9c3-3 7-3 8 0-2 3-5 3-8 0z\"/><path class=\"q-h\" d=\"M38 40c2-2 5-2 6 0-1.5 2-4 2-6 0z\"/><path style=\"--c:#FFB13B\" class=\"q-f\" d=\"M38 40c2-2 5-2 6 0-1.5 2-4 2-6 0z\"/>",
  "bulb": "<circle class=\"q-h\" cx=\"24\" cy=\"18\" r=\"15\"/><circle style=\"--c:#FFE066\" class=\"q-g\" cx=\"24\" cy=\"18\" r=\"15\"/><path class=\"q-h\" d=\"M24 6a11 11 0 0 1 6.5 19.9c-1.5 1.1-2.5 2.6-2.5 4.4V32h-8v-1.7c0-1.8-1-3.3-2.5-4.4A11 11 0 0 1 24 6z\"/><path style=\"--c:#FFD23C\" class=\"q-f\" d=\"M24 6a11 11 0 0 1 6.5 19.9c-1.5 1.1-2.5 2.6-2.5 4.4V32h-8v-1.7c0-1.8-1-3.3-2.5-4.4A11 11 0 0 1 24 6z\"/><rect class=\"q-h\" x=\"19.5\" y=\"33\" width=\"9\" height=\"7\" rx=\"2\"/><rect style=\"--c:#C7D2FF\" class=\"q-f\" x=\"19.5\" y=\"33\" width=\"9\" height=\"7\" rx=\"2\"/><path class=\"q-h\" d=\"M21 23l3 3 3-3M24 26v6\"/><path style=\"--c:#FF8A3D\" class=\"q-t\" d=\"M21 23l3 3 3-3M24 26v6\"/><path class=\"q-h\" d=\"M5 18H2M46 18h-3M8 5l2.2 2.2M40 5l-2.2 2.2\"/><path style=\"--c:#FFE066\" d=\"M5 18H2M46 18h-3M8 5l2.2 2.2M40 5l-2.2 2.2\"/>",
  "chat": "<path class=\"q-h\" d=\"M6 9h24a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H15l-6 5v-5H6a3 3 0 0 1-3-3V12a3 3 0 0 1 3-3z\"/><path style=\"--c:#3FA9FF\" class=\"q-f\" d=\"M6 9h24a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H15l-6 5v-5H6a3 3 0 0 1-3-3V12a3 3 0 0 1 3-3z\"/><path class=\"q-h\" d=\"M36 20h6a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3h-3v4l-5-4H23a3 3 0 0 1-3-3v-4h11a5 5 0 0 0 5-5z\"/><path style=\"--c:#3DDC84\" class=\"q-f\" d=\"M36 20h6a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3h-3v4l-5-4H23a3 3 0 0 1-3-3v-4h11a5 5 0 0 0 5-5z\"/><g class=\"q-h\"><circle cx=\"11\" cy=\"18\" r=\"1.9\"/><circle cx=\"18\" cy=\"18\" r=\"1.9\"/><circle cx=\"25\" cy=\"18\" r=\"1.9\"/></g><g style=\"--c:#FFFFFF\" class=\"q-w\"><circle cx=\"11\" cy=\"18\" r=\"1.9\"/><circle cx=\"18\" cy=\"18\" r=\"1.9\"/><circle cx=\"25\" cy=\"18\" r=\"1.9\"/></g>",
  "rings": "<path class=\"q-h\" d=\"M7 30a10 10 0 1 0 20 0a10 10 0 1 0 -20 0\"/><path style=\"--c:#FFD23C\" d=\"M7 30a10 10 0 1 0 20 0a10 10 0 1 0 -20 0\"/><path class=\"q-h\" d=\"M21 30a10 10 0 1 0 20 0a10 10 0 1 0 -20 0\"/><path style=\"--c:#E3ECFF\" d=\"M21 30a10 10 0 1 0 20 0a10 10 0 1 0 -20 0\"/><path class=\"q-h\" d=\"M13 14h8l2.5 3-6.5 5.5-6.5-5.5z\"/><path style=\"--c:#7FE3FF\" class=\"q-f\" d=\"M13 14h8l2.5 3-6.5 5.5-6.5-5.5z\"/><path class=\"q-h\" d=\"M39 6.5Q39 10 42.5 10Q39 10 39 13.5Q39 10 35.5 10Q39 10 39 6.5z\"/><path style=\"--c:#FFFFFF\" class=\"q-w\" d=\"M39 6.5Q39 10 42.5 10Q39 10 39 13.5Q39 10 35.5 10Q39 10 39 6.5z\"/><circle class=\"q-h\" cx=\"8\" cy=\"10\" r=\"1.3\"/><circle style=\"--c:#FF7AD9\" class=\"q-w\" cx=\"8\" cy=\"10\" r=\"1.3\"/>",
  "arch": "<circle class=\"q-h\" cx=\"24\" cy=\"30\" r=\"4.5\"/><circle style=\"--c:#FFD54A\" class=\"q-w\" cx=\"24\" cy=\"30\" r=\"4.5\"/><path class=\"q-h\" d=\"M5 43V26C5 15 13 9 24 9s19 6 19 17v17h-8V27c0-6-4.5-10-11-10s-11 4-11 10v16z\"/><path style=\"--c:#FF7A3D\" class=\"q-f\" d=\"M5 43V26C5 15 13 9 24 9s19 6 19 17v17h-8V27c0-6-4.5-10-11-10s-11 4-11 10v16z\"/><path class=\"q-h\" d=\"M2 43.5h44\"/><path style=\"--c:#E0A94A\" d=\"M2 43.5h44\"/><path class=\"q-h\" d=\"M8 22h4M36 22h4M8 33h4M36 34h4\"/><path style=\"--c:#FFB13B\" class=\"q-t\" d=\"M8 22h4M36 22h4M8 33h4M36 34h4\"/>",
  "sleigh": "<rect class=\"q-h\" x=\"18\" y=\"14\" width=\"10\" height=\"10\" rx=\"1.5\"/><rect style=\"--c:#3DDC84\" class=\"q-f\" x=\"18\" y=\"14\" width=\"10\" height=\"10\" rx=\"1.5\"/><rect class=\"q-h\" x=\"22\" y=\"14\" width=\"2\" height=\"10\"/><rect style=\"--c:#FFD23C\" class=\"q-w\" x=\"22\" y=\"14\" width=\"2\" height=\"10\"/><path class=\"q-h\" d=\"M7 21h6c2 0 3 2 3 4v2h14c2.5 0 4-1.5 4-4h4c0 7-4 11-10 11H13c-4 0-6-3-6-6z\"/><path style=\"--c:#FF4F5E\" class=\"q-f\" d=\"M7 21h6c2 0 3 2 3 4v2h14c2.5 0 4-1.5 4-4h4c0 7-4 11-10 11H13c-4 0-6-3-6-6z\"/><path class=\"q-h\" d=\"M5 39h30c4 0 6-2 7-5\"/><path style=\"--c:#FFD23C\" d=\"M5 39h30c4 0 6-2 7-5\"/><path class=\"q-h\" d=\"M14 34v5M28 34v5\"/><path style=\"--c:#FFD23C\" class=\"q-t\" d=\"M14 34v5M28 34v5\"/><g class=\"q-h\"><circle cx=\"40\" cy=\"10\" r=\"1.5\"/><circle cx=\"8\" cy=\"9\" r=\"1.3\"/><circle cx=\"31\" cy=\"7\" r=\"1.2\"/><circle cx=\"44\" cy=\"22\" r=\"1.1\"/></g><g style=\"--c:#FFFFFF\" class=\"q-w\"><circle cx=\"40\" cy=\"10\" r=\"1.5\"/><circle cx=\"8\" cy=\"9\" r=\"1.3\"/><circle cx=\"31\" cy=\"7\" r=\"1.2\"/><circle cx=\"44\" cy=\"22\" r=\"1.1\"/></g>",
  "firefly": "<circle class=\"q-h\" cx=\"24\" cy=\"32\" r=\"13\"/><circle style=\"--c:#E8FF5A\" class=\"q-g\" cx=\"24\" cy=\"32\" r=\"13\"/><circle class=\"q-h\" cx=\"9\" cy=\"13\" r=\"5\"/><circle style=\"--c:#E8FF5A\" class=\"q-g\" cx=\"9\" cy=\"13\" r=\"5\"/><circle class=\"q-h\" cx=\"40\" cy=\"38\" r=\"4.5\"/><circle style=\"--c:#E8FF5A\" class=\"q-g\" cx=\"40\" cy=\"38\" r=\"4.5\"/><ellipse class=\"q-h\" cx=\"17.5\" cy=\"17\" rx=\"4\" ry=\"8\" transform=\"rotate(-35 17.5 17)\"/><ellipse style=\"--c:#C7E3FF\" class=\"q-f\" cx=\"17.5\" cy=\"17\" rx=\"4\" ry=\"8\" transform=\"rotate(-35 17.5 17)\"/><ellipse class=\"q-h\" cx=\"30.5\" cy=\"17\" rx=\"4\" ry=\"8\" transform=\"rotate(35 30.5 17)\"/><ellipse style=\"--c:#C7E3FF\" class=\"q-f\" cx=\"30.5\" cy=\"17\" rx=\"4\" ry=\"8\" transform=\"rotate(35 30.5 17)\"/><circle class=\"q-h\" cx=\"24\" cy=\"31\" r=\"6\"/><circle style=\"--c:#F4FF6A\" class=\"q-w\" cx=\"24\" cy=\"31\" r=\"6\"/><ellipse class=\"q-h\" cx=\"24\" cy=\"20\" rx=\"3.6\" ry=\"6\"/><ellipse style=\"--c:#FF8A3D\" class=\"q-w\" cx=\"24\" cy=\"20\" rx=\"3.6\" ry=\"6\"/><circle class=\"q-h\" cx=\"24\" cy=\"12\" r=\"3.2\"/><circle style=\"--c:#FF5F3D\" class=\"q-w\" cx=\"24\" cy=\"12\" r=\"3.2\"/><path class=\"q-h\" d=\"M22.5 9.5l-3-5M25.5 9.5l3-5\"/><path style=\"--c:#FF8A3D\" class=\"q-t\" d=\"M22.5 9.5l-3-5M25.5 9.5l3-5\"/><circle class=\"q-h\" cx=\"9\" cy=\"13\" r=\"1.7\"/><circle style=\"--c:#F4FF6A\" class=\"q-w\" cx=\"9\" cy=\"13\" r=\"1.7\"/><circle class=\"q-h\" cx=\"40\" cy=\"38\" r=\"1.6\"/><circle style=\"--c:#F4FF6A\" class=\"q-w\" cx=\"40\" cy=\"38\" r=\"1.6\"/>",
  "blossom": "<path class=\"q-h\" d=\"M4 41c10-4 18-12 22-24M16 34c4 0 9 1 12 4\"/><path style=\"--c:#B5703F\" d=\"M4 41c10-4 18-12 22-24M16 34c4 0 9 1 12 4\"/><g class=\"q-h\"><ellipse cx=\"29.0\" cy=\"9.2\" rx=\"3.6\" ry=\"4.4\" transform=\"rotate(0 29.0 9.2)\"/><ellipse cx=\"33.6\" cy=\"12.5\" rx=\"3.6\" ry=\"4.4\" transform=\"rotate(72 33.6 12.5)\"/><ellipse cx=\"31.8\" cy=\"17.9\" rx=\"3.6\" ry=\"4.4\" transform=\"rotate(144 31.8 17.9)\"/><ellipse cx=\"26.2\" cy=\"17.9\" rx=\"3.6\" ry=\"4.4\" transform=\"rotate(216 26.2 17.9)\"/><ellipse cx=\"24.4\" cy=\"12.5\" rx=\"3.6\" ry=\"4.4\" transform=\"rotate(288 24.4 12.5)\"/></g><g style=\"--c:#FFB3D1\" class=\"q-f\"><ellipse cx=\"29.0\" cy=\"9.2\" rx=\"3.6\" ry=\"4.4\" transform=\"rotate(0 29.0 9.2)\"/><ellipse cx=\"33.6\" cy=\"12.5\" rx=\"3.6\" ry=\"4.4\" transform=\"rotate(72 33.6 12.5)\"/><ellipse cx=\"31.8\" cy=\"17.9\" rx=\"3.6\" ry=\"4.4\" transform=\"rotate(144 31.8 17.9)\"/><ellipse cx=\"26.2\" cy=\"17.9\" rx=\"3.6\" ry=\"4.4\" transform=\"rotate(216 26.2 17.9)\"/><ellipse cx=\"24.4\" cy=\"12.5\" rx=\"3.6\" ry=\"4.4\" transform=\"rotate(288 24.4 12.5)\"/></g><circle class=\"q-h\" cx=\"29\" cy=\"14\" r=\"2.2\"/><circle style=\"--c:#FFD23C\" class=\"q-w\" cx=\"29\" cy=\"14\" r=\"2.2\"/><g class=\"q-h\"><ellipse cx=\"13.3\" cy=\"23.4\" rx=\"2.8\" ry=\"3.4\" transform=\"rotate(20 13.3 23.4)\"/><ellipse cx=\"15.8\" cy=\"27.1\" rx=\"2.8\" ry=\"3.4\" transform=\"rotate(92 15.8 27.1)\"/><ellipse cx=\"13.0\" cy=\"30.7\" rx=\"2.8\" ry=\"3.4\" transform=\"rotate(164 13.0 30.7)\"/><ellipse cx=\"8.8\" cy=\"29.1\" rx=\"2.8\" ry=\"3.4\" transform=\"rotate(236 8.8 29.1)\"/><ellipse cx=\"9.0\" cy=\"24.7\" rx=\"2.8\" ry=\"3.4\" transform=\"rotate(308 9.0 24.7)\"/></g><g style=\"--c:#FF7AA8\" class=\"q-f\"><ellipse cx=\"13.3\" cy=\"23.4\" rx=\"2.8\" ry=\"3.4\" transform=\"rotate(20 13.3 23.4)\"/><ellipse cx=\"15.8\" cy=\"27.1\" rx=\"2.8\" ry=\"3.4\" transform=\"rotate(92 15.8 27.1)\"/><ellipse cx=\"13.0\" cy=\"30.7\" rx=\"2.8\" ry=\"3.4\" transform=\"rotate(164 13.0 30.7)\"/><ellipse cx=\"8.8\" cy=\"29.1\" rx=\"2.8\" ry=\"3.4\" transform=\"rotate(236 8.8 29.1)\"/><ellipse cx=\"9.0\" cy=\"24.7\" rx=\"2.8\" ry=\"3.4\" transform=\"rotate(308 9.0 24.7)\"/></g><circle class=\"q-h\" cx=\"12\" cy=\"27\" r=\"1.8\"/><circle style=\"--c:#FFD23C\" class=\"q-w\" cx=\"12\" cy=\"27\" r=\"1.8\"/><ellipse class=\"q-h\" cx=\"39\" cy=\"32\" rx=\"2.2\" ry=\"1.3\" transform=\"rotate(30 39 32)\"/><ellipse style=\"--c:#FFB3D1\" class=\"q-w\" cx=\"39\" cy=\"32\" rx=\"2.2\" ry=\"1.3\" transform=\"rotate(30 39 32)\"/><circle class=\"q-h\" cx=\"35\" cy=\"41\" r=\"2\"/><circle style=\"--c:#FF7AA8\" class=\"q-w\" cx=\"35\" cy=\"41\" r=\"2\"/>",
  "lavender": "<path class=\"q-h\" d=\"M24 44c-3-10-6-18-9-26M24 44V12M24 44c3-10 6-18 9-26\"/><path style=\"--c:#3DDC84\" d=\"M24 44c-3-10-6-18-9-26M24 44V12M24 44c3-10 6-18 9-26\"/><g class=\"q-h\"><ellipse cx=\"22.5\" cy=\"6.0\" rx=\"1.4\" ry=\"1.9\"/><ellipse cx=\"25.5\" cy=\"8.6\" rx=\"1.4\" ry=\"1.9\"/><ellipse cx=\"22.5\" cy=\"11.2\" rx=\"1.4\" ry=\"1.9\"/><ellipse cx=\"25.5\" cy=\"13.8\" rx=\"1.4\" ry=\"1.9\"/><ellipse cx=\"22.5\" cy=\"16.4\" rx=\"1.4\" ry=\"1.9\"/><ellipse cx=\"25.5\" cy=\"19.0\" rx=\"1.4\" ry=\"1.9\"/></g><g style=\"--c:#9A6BFF\" class=\"q-f\"><ellipse cx=\"22.5\" cy=\"6.0\" rx=\"1.4\" ry=\"1.9\"/><ellipse cx=\"25.5\" cy=\"8.6\" rx=\"1.4\" ry=\"1.9\"/><ellipse cx=\"22.5\" cy=\"11.2\" rx=\"1.4\" ry=\"1.9\"/><ellipse cx=\"25.5\" cy=\"13.8\" rx=\"1.4\" ry=\"1.9\"/><ellipse cx=\"22.5\" cy=\"16.4\" rx=\"1.4\" ry=\"1.9\"/><ellipse cx=\"25.5\" cy=\"19.0\" rx=\"1.4\" ry=\"1.9\"/></g><g class=\"q-h\"><ellipse cx=\"12.7\" cy=\"12.0\" rx=\"1.3\" ry=\"1.8\"/><ellipse cx=\"15.8\" cy=\"14.5\" rx=\"1.3\" ry=\"1.8\"/><ellipse cx=\"13.7\" cy=\"17.0\" rx=\"1.3\" ry=\"1.8\"/><ellipse cx=\"16.8\" cy=\"19.5\" rx=\"1.3\" ry=\"1.8\"/><ellipse cx=\"14.7\" cy=\"22.0\" rx=\"1.3\" ry=\"1.8\"/><ellipse cx=\"32.7\" cy=\"12.0\" rx=\"1.3\" ry=\"1.8\"/><ellipse cx=\"34.8\" cy=\"14.5\" rx=\"1.3\" ry=\"1.8\"/><ellipse cx=\"31.7\" cy=\"17.0\" rx=\"1.3\" ry=\"1.8\"/><ellipse cx=\"33.8\" cy=\"19.5\" rx=\"1.3\" ry=\"1.8\"/><ellipse cx=\"30.7\" cy=\"22.0\" rx=\"1.3\" ry=\"1.8\"/></g><g style=\"--c:#C9A0FF\" class=\"q-f\"><ellipse cx=\"12.7\" cy=\"12.0\" rx=\"1.3\" ry=\"1.8\"/><ellipse cx=\"15.8\" cy=\"14.5\" rx=\"1.3\" ry=\"1.8\"/><ellipse cx=\"13.7\" cy=\"17.0\" rx=\"1.3\" ry=\"1.8\"/><ellipse cx=\"16.8\" cy=\"19.5\" rx=\"1.3\" ry=\"1.8\"/><ellipse cx=\"14.7\" cy=\"22.0\" rx=\"1.3\" ry=\"1.8\"/><ellipse cx=\"32.7\" cy=\"12.0\" rx=\"1.3\" ry=\"1.8\"/><ellipse cx=\"34.8\" cy=\"14.5\" rx=\"1.3\" ry=\"1.8\"/><ellipse cx=\"31.7\" cy=\"17.0\" rx=\"1.3\" ry=\"1.8\"/><ellipse cx=\"33.8\" cy=\"19.5\" rx=\"1.3\" ry=\"1.8\"/><ellipse cx=\"30.7\" cy=\"22.0\" rx=\"1.3\" ry=\"1.8\"/></g><path class=\"q-h\" d=\"M17.5 36h13l-1.8 3.5h-9.4z\"/><path style=\"--c:#FF7AD9\" class=\"q-w\" d=\"M17.5 36h13l-1.8 3.5h-9.4z\"/>",
  "sunflower": "<path class=\"q-h\" d=\"M24 28v16\"/><path style=\"--c:#3DDC84\" d=\"M24 28v16\"/><path class=\"q-h\" d=\"M24 38c-5-6-11-5-13-2 4 3 9 4 13 2zM24 36c5-5 10-5 12-2-3 3-8 4-12 2z\"/><path style=\"--c:#2FBF5B\" class=\"q-f\" d=\"M24 38c-5-6-11-5-13-2 4 3 9 4 13 2zM24 36c5-5 10-5 12-2-3 3-8 4-12 2z\"/><g class=\"q-h\"><ellipse cx=\"24.0\" cy=\"9.0\" rx=\"3\" ry=\"5.5\" transform=\"rotate(0 24.0 9.0)\"/><ellipse cx=\"29.0\" cy=\"10.3\" rx=\"3\" ry=\"5.5\" transform=\"rotate(30 29.0 10.3)\"/><ellipse cx=\"32.7\" cy=\"14.0\" rx=\"3\" ry=\"5.5\" transform=\"rotate(60 32.7 14.0)\"/><ellipse cx=\"34.0\" cy=\"19.0\" rx=\"3\" ry=\"5.5\" transform=\"rotate(90 34.0 19.0)\"/><ellipse cx=\"32.7\" cy=\"24.0\" rx=\"3\" ry=\"5.5\" transform=\"rotate(120 32.7 24.0)\"/><ellipse cx=\"29.0\" cy=\"27.7\" rx=\"3\" ry=\"5.5\" transform=\"rotate(150 29.0 27.7)\"/><ellipse cx=\"24.0\" cy=\"29.0\" rx=\"3\" ry=\"5.5\" transform=\"rotate(180 24.0 29.0)\"/><ellipse cx=\"19.0\" cy=\"27.7\" rx=\"3\" ry=\"5.5\" transform=\"rotate(210 19.0 27.7)\"/><ellipse cx=\"15.3\" cy=\"24.0\" rx=\"3\" ry=\"5.5\" transform=\"rotate(240 15.3 24.0)\"/><ellipse cx=\"14.0\" cy=\"19.0\" rx=\"3\" ry=\"5.5\" transform=\"rotate(270 14.0 19.0)\"/><ellipse cx=\"15.3\" cy=\"14.0\" rx=\"3\" ry=\"5.5\" transform=\"rotate(300 15.3 14.0)\"/><ellipse cx=\"19.0\" cy=\"10.3\" rx=\"3\" ry=\"5.5\" transform=\"rotate(330 19.0 10.3)\"/></g><g style=\"--c:#FFD23C\" class=\"q-f\"><ellipse cx=\"24.0\" cy=\"9.0\" rx=\"3\" ry=\"5.5\" transform=\"rotate(0 24.0 9.0)\"/><ellipse cx=\"29.0\" cy=\"10.3\" rx=\"3\" ry=\"5.5\" transform=\"rotate(30 29.0 10.3)\"/><ellipse cx=\"32.7\" cy=\"14.0\" rx=\"3\" ry=\"5.5\" transform=\"rotate(60 32.7 14.0)\"/><ellipse cx=\"34.0\" cy=\"19.0\" rx=\"3\" ry=\"5.5\" transform=\"rotate(90 34.0 19.0)\"/><ellipse cx=\"32.7\" cy=\"24.0\" rx=\"3\" ry=\"5.5\" transform=\"rotate(120 32.7 24.0)\"/><ellipse cx=\"29.0\" cy=\"27.7\" rx=\"3\" ry=\"5.5\" transform=\"rotate(150 29.0 27.7)\"/><ellipse cx=\"24.0\" cy=\"29.0\" rx=\"3\" ry=\"5.5\" transform=\"rotate(180 24.0 29.0)\"/><ellipse cx=\"19.0\" cy=\"27.7\" rx=\"3\" ry=\"5.5\" transform=\"rotate(210 19.0 27.7)\"/><ellipse cx=\"15.3\" cy=\"24.0\" rx=\"3\" ry=\"5.5\" transform=\"rotate(240 15.3 24.0)\"/><ellipse cx=\"14.0\" cy=\"19.0\" rx=\"3\" ry=\"5.5\" transform=\"rotate(270 14.0 19.0)\"/><ellipse cx=\"15.3\" cy=\"14.0\" rx=\"3\" ry=\"5.5\" transform=\"rotate(300 15.3 14.0)\"/><ellipse cx=\"19.0\" cy=\"10.3\" rx=\"3\" ry=\"5.5\" transform=\"rotate(330 19.0 10.3)\"/></g><circle class=\"q-h\" cx=\"24\" cy=\"19\" r=\"7\"/><circle style=\"--c:#8B5A2B\" class=\"q-f\" cx=\"24\" cy=\"19\" r=\"7\"/><g class=\"q-h\"><circle cx=\"21.5\" cy=\"17\" r=\".9\"/><circle cx=\"24\" cy=\"16\" r=\".9\"/><circle cx=\"26.5\" cy=\"17\" r=\".9\"/><circle cx=\"21\" cy=\"20\" r=\".9\"/><circle cx=\"24\" cy=\"19\" r=\".9\"/><circle cx=\"27\" cy=\"20\" r=\".9\"/><circle cx=\"22.5\" cy=\"22\" r=\".9\"/><circle cx=\"25.5\" cy=\"22\" r=\".9\"/></g><g style=\"--c:#5A3A1E\" class=\"q-w\"><circle cx=\"21.5\" cy=\"17\" r=\".9\"/><circle cx=\"24\" cy=\"16\" r=\".9\"/><circle cx=\"26.5\" cy=\"17\" r=\".9\"/><circle cx=\"21\" cy=\"20\" r=\".9\"/><circle cx=\"24\" cy=\"19\" r=\".9\"/><circle cx=\"27\" cy=\"20\" r=\".9\"/><circle cx=\"22.5\" cy=\"22\" r=\".9\"/><circle cx=\"25.5\" cy=\"22\" r=\".9\"/></g>",
  "lily": "<ellipse class=\"q-h\" cx=\"24\" cy=\"35\" rx=\"19\" ry=\"8\"/><ellipse style=\"--c:#2FBF5B\" class=\"q-f\" cx=\"24\" cy=\"35\" rx=\"19\" ry=\"8\"/><path class=\"q-h\" d=\"M24 35l10-7.5h-3.5z\"/><path style=\"--c:#1A1B1F\" class=\"q-w\" d=\"M24 35l10-7.5h-3.5z\"/><ellipse class=\"q-h\" cx=\"7\" cy=\"42\" rx=\"5\" ry=\"2.2\"/><ellipse style=\"--c:#3DDC84\" class=\"q-f\" cx=\"7\" cy=\"42\" rx=\"5\" ry=\"2.2\"/><path class=\"q-h\" d=\"M24 30c-6 0-10-3-12-8 5-1 9 2 12 8z\"/><path style=\"--c:#FF9AD0\" class=\"q-f\" d=\"M24 30c-6 0-10-3-12-8 5-1 9 2 12 8z\"/><path class=\"q-h\" d=\"M24 30c6 0 10-3 12-8-5-1-9 2-12 8z\"/><path style=\"--c:#FF9AD0\" class=\"q-f\" d=\"M24 30c6 0 10-3 12-8-5-1-9 2-12 8z\"/><path class=\"q-h\" d=\"M24 30c-4-3-5-9-3-14 3 3 4 9 3 14z\"/><path style=\"--c:#FF5FA2\" class=\"q-f\" d=\"M24 30c-4-3-5-9-3-14 3 3 4 9 3 14z\"/><path class=\"q-h\" d=\"M24 30c4-3 5-9 3-14-3 3-4 9-3 14z\"/><path style=\"--c:#FF5FA2\" class=\"q-f\" d=\"M24 30c4-3 5-9 3-14-3 3-4 9-3 14z\"/><path class=\"q-h\" d=\"M33 45h9\"/><path style=\"--c:#3FA9FF\" class=\"q-t\" d=\"M33 45h9\"/>",
  "peach": "<path class=\"q-h\" d=\"M24 13c9-4 17 2 17 12 0 9-7 16-17 16S7 34 7 25c0-10 8-16 17-12z\"/><path style=\"--c:#FF9A7A\" class=\"q-f\" d=\"M24 13c9-4 17 2 17 12 0 9-7 16-17 16S7 34 7 25c0-10 8-16 17-12z\"/><path class=\"q-h\" d=\"M24 14c-4 6-4 17 0 26\"/><path style=\"--c:#FF6A5A\" class=\"q-t\" d=\"M24 14c-4 6-4 17 0 26\"/><ellipse class=\"q-h\" cx=\"15\" cy=\"22\" rx=\"2.6\" ry=\"4.5\" transform=\"rotate(20 15 22)\"/><ellipse style=\"--c:#FFD0C0\" class=\"q-w\" cx=\"15\" cy=\"22\" rx=\"2.6\" ry=\"4.5\" transform=\"rotate(20 15 22)\"/><path class=\"q-h\" d=\"M24 13c0-3 1-5 2-7\"/><path style=\"--c:#8B5A2B\" d=\"M24 13c0-3 1-5 2-7\"/><path class=\"q-h\" d=\"M25 12c2-6 8-8 13-7-2 5-7 8-13 7z\"/><path style=\"--c:#3DDC84\" class=\"q-f\" d=\"M25 12c2-6 8-8 13-7-2 5-7 8-13 7z\"/>",
  "berry": "<path class=\"q-h\" d=\"M24 14V8\"/><path style=\"--c:#8B5A2B\" d=\"M24 14V8\"/><path class=\"q-h\" d=\"M24 13c-3-6-9-7-13-5 3 4 8 6 13 5zM24 13c3-6 9-7 13-5-3 4-8 6-13 5z\"/><path style=\"--c:#3DDC84\" class=\"q-f\" d=\"M24 13c-3-6-9-7-13-5 3 4 8 6 13 5zM24 13c3-6 9-7 13-5-3 4-8 6-13 5z\"/><circle class=\"q-h\" cx=\"17\" cy=\"23\" r=\"7.5\"/><circle style=\"--c:#6C5CFF\" class=\"q-f\" cx=\"17\" cy=\"23\" r=\"7.5\"/><circle class=\"q-h\" cx=\"31\" cy=\"23\" r=\"7.5\"/><circle style=\"--c:#8E5BFF\" class=\"q-f\" cx=\"31\" cy=\"23\" r=\"7.5\"/><circle class=\"q-h\" cx=\"24\" cy=\"34\" r=\"7.5\"/><circle style=\"--c:#B07CFF\" class=\"q-f\" cx=\"24\" cy=\"34\" r=\"7.5\"/><g class=\"q-h\"><circle cx=\"14.5\" cy=\"20.5\" r=\"1.6\"/><circle cx=\"28.5\" cy=\"20.5\" r=\"1.6\"/><circle cx=\"21.5\" cy=\"31.5\" r=\"1.6\"/></g><g style=\"--c:#E3DCFF\" class=\"q-w\"><circle cx=\"14.5\" cy=\"20.5\" r=\"1.6\"/><circle cx=\"28.5\" cy=\"20.5\" r=\"1.6\"/><circle cx=\"21.5\" cy=\"31.5\" r=\"1.6\"/></g>",
  "watermelon": "<path class=\"q-h\" d=\"M4 15h40a20 20 0 0 1-40 0z\"/><path style=\"--c:#2FBF5B\" class=\"q-f\" d=\"M4 15h40a20 20 0 0 1-40 0z\"/><path class=\"q-h\" d=\"M8 15h32a16 16 0 0 1-32 0z\"/><path style=\"--c:#FF4F5E\" class=\"q-f\" d=\"M8 15h32a16 16 0 0 1-32 0z\"/><g class=\"q-h\"><ellipse cx=\"16\" cy=\"21\" rx=\"1.1\" ry=\"1.9\"/><ellipse cx=\"24\" cy=\"24\" rx=\"1.1\" ry=\"1.9\"/><ellipse cx=\"32\" cy=\"21\" rx=\"1.1\" ry=\"1.9\"/><ellipse cx=\"20\" cy=\"28\" rx=\"1.1\" ry=\"1.9\"/><ellipse cx=\"28\" cy=\"28\" rx=\"1.1\" ry=\"1.9\"/></g><g style=\"--c:#1A1B1F\" class=\"q-w\"><ellipse cx=\"16\" cy=\"21\" rx=\"1.1\" ry=\"1.9\"/><ellipse cx=\"24\" cy=\"24\" rx=\"1.1\" ry=\"1.9\"/><ellipse cx=\"32\" cy=\"21\" rx=\"1.1\" ry=\"1.9\"/><ellipse cx=\"20\" cy=\"28\" rx=\"1.1\" ry=\"1.9\"/><ellipse cx=\"28\" cy=\"28\" rx=\"1.1\" ry=\"1.9\"/></g><circle class=\"q-h\" cx=\"11\" cy=\"41\" r=\"1.5\"/><circle style=\"--c:#FF8A9A\" class=\"q-w\" cx=\"11\" cy=\"41\" r=\"1.5\"/><circle class=\"q-h\" cx=\"38\" cy=\"42\" r=\"1.2\"/><circle style=\"--c:#FF8A9A\" class=\"q-w\" cx=\"38\" cy=\"42\" r=\"1.2\"/>",
  "lemon": "<ellipse class=\"q-h\" cx=\"20\" cy=\"20\" rx=\"14\" ry=\"10\" transform=\"rotate(-25 20 20)\"/><ellipse style=\"--c:#FFE066\" class=\"q-f\" cx=\"20\" cy=\"20\" rx=\"14\" ry=\"10\" transform=\"rotate(-25 20 20)\"/><path class=\"q-h\" d=\"M22 9c2-5 7-6 11-5-2 4-6 6-11 5z\"/><path style=\"--c:#3DDC84\" class=\"q-f\" d=\"M22 9c2-5 7-6 11-5-2 4-6 6-11 5z\"/><circle class=\"q-h\" cx=\"33\" cy=\"32\" r=\"10\"/><circle style=\"--c:#FFE066\" class=\"q-f\" cx=\"33\" cy=\"32\" r=\"10\"/><circle class=\"q-h\" cx=\"33\" cy=\"32\" r=\"7.5\"/><circle style=\"--c:#FFF3B0\" class=\"q-f\" cx=\"33\" cy=\"32\" r=\"7.5\"/><path class=\"q-h\" d=\"M33.0 32.0L40.5 32.0M33.0 32.0L36.8 38.5M33.0 32.0L29.2 38.5M33.0 32.0L25.5 32.0M33.0 32.0L29.2 25.5M33.0 32.0L36.8 25.5\"/><path style=\"--c:#FFC83D\" class=\"q-t\" d=\"M33.0 32.0L40.5 32.0M33.0 32.0L36.8 38.5M33.0 32.0L29.2 38.5M33.0 32.0L25.5 32.0M33.0 32.0L29.2 25.5M33.0 32.0L36.8 25.5\"/>",
  "herb": "<path class=\"q-h\" d=\"M24 44V9\"/><path style=\"--c:#2FBF5B\" d=\"M24 44V9\"/><path class=\"q-h\" d=\"M24 35c-6 0-10-3-11-8 6 0 10 3 11 8zM24 35c6 0 10-3 11-8-6 0-10 3-11 8z\"/><path style=\"--c:#2FBF5B\" class=\"q-f\" d=\"M24 35c-6 0-10-3-11-8 6 0 10 3 11 8zM24 35c6 0 10-3 11-8-6 0-10 3-11 8z\"/><path class=\"q-h\" d=\"M24 25c-5 0-8-3-9-7 5 0 8 3 9 7zM24 25c5 0 8-3 9-7-5 0-8 3-9 7z\"/><path style=\"--c:#3DDC84\" class=\"q-f\" d=\"M24 25c-5 0-8-3-9-7 5 0 8 3 9 7zM24 25c5 0 8-3 9-7-5 0-8 3-9 7z\"/><path class=\"q-h\" d=\"M24 15c-3-1-4-4-4-7 3 1 4 4 4 7zM24 15c3-1 4-4 4-7-3 1-4 4-4 7z\"/><path style=\"--c:#7CFF6B\" class=\"q-f\" d=\"M24 15c-3-1-4-4-4-7 3 1 4 4 4 7zM24 15c3-1 4-4 4-7-3 1-4 4-4 7z\"/><circle class=\"q-h\" cx=\"38\" cy=\"38\" r=\"1.6\"/><circle style=\"--c:#7FE3FF\" class=\"q-w\" cx=\"38\" cy=\"38\" r=\"1.6\"/><circle class=\"q-h\" cx=\"10\" cy=\"40\" r=\"1.4\"/><circle style=\"--c:#7FE3FF\" class=\"q-w\" cx=\"10\" cy=\"40\" r=\"1.4\"/>",
  "meadow": "<circle class=\"q-h\" cx=\"37\" cy=\"11\" r=\"5\"/><circle style=\"--c:#FFD54A\" class=\"q-w\" cx=\"37\" cy=\"11\" r=\"5\"/><path class=\"q-h\" d=\"M3 32c10-6 22-7 42-2-2 7-10 14-21 14S5 39 3 32z\"/><path style=\"--c:#3DDC84\" class=\"q-f\" d=\"M3 32c10-6 22-7 42-2-2 7-10 14-21 14S5 39 3 32z\"/><path class=\"q-h\" d=\"M19 27v6M28 25v7\"/><path style=\"--c:#2FBF5B\" class=\"q-t\" d=\"M19 27v6M28 25v7\"/><path class=\"q-h\" d=\"M8 33c0-5-2-8-4-10M13 33c0-6 1-9 3-12M34 32c0-5 2-8 4-10M40 32c0-5-1-8-3-11\"/><path style=\"--c:#7CFF6B\" d=\"M8 33c0-5-2-8-4-10M13 33c0-6 1-9 3-12M34 32c0-5 2-8 4-10M40 32c0-5-1-8-3-11\"/><circle class=\"q-h\" cx=\"19\" cy=\"25\" r=\"2.5\"/><circle style=\"--c:#FF7AD9\" class=\"q-w\" cx=\"19\" cy=\"25\" r=\"2.5\"/><circle class=\"q-h\" cx=\"28\" cy=\"23\" r=\"2.5\"/><circle style=\"--c:#FFD23C\" class=\"q-w\" cx=\"28\" cy=\"23\" r=\"2.5\"/><circle class=\"q-h\" cx=\"23.5\" cy=\"30\" r=\"2\"/><circle style=\"--c:#FFFFFF\" class=\"q-w\" cx=\"23.5\" cy=\"30\" r=\"2\"/>",
  "corn": "<ellipse class=\"q-h\" cx=\"24\" cy=\"21\" rx=\"7.5\" ry=\"14\"/><ellipse style=\"--c:#FFD23C\" class=\"q-f\" cx=\"24\" cy=\"21\" rx=\"7.5\" ry=\"14\"/><path class=\"q-h\" d=\"M17.5 13h13M16.8 18h14.4M16.8 23h14.4M17.5 28h13M24 8v26\"/><path style=\"--c:#FFA43B\" class=\"q-t\" d=\"M17.5 13h13M16.8 18h14.4M16.8 23h14.4M17.5 28h13M24 8v26\"/><path class=\"q-h\" d=\"M24 44c-8-4-11-12-10-22 4 6 7 12 10 22zM24 44c8-4 11-12 10-22-4 6-7 12-10 22z\"/><path style=\"--c:#3DDC84\" class=\"q-f\" d=\"M24 44c-8-4-11-12-10-22 4 6 7 12 10 22zM24 44c8-4 11-12 10-22-4 6-7 12-10 22z\"/>",
  "hay": "<circle class=\"q-h\" cx=\"39\" cy=\"10\" r=\"4.5\"/><circle style=\"--c:#FF9F2E\" class=\"q-w\" cx=\"39\" cy=\"10\" r=\"4.5\"/><path class=\"q-h\" d=\"M4 40c2-14 10-24 20-24s18 10 20 24z\"/><path style=\"--c:#FFC83D\" class=\"q-f\" d=\"M4 40c2-14 10-24 20-24s18 10 20 24z\"/><path class=\"q-h\" d=\"M10 36c3-8 6-13 10-16M18 38c1-9 3-15 6-19M30 38c-1-9-3-15-6-19M38 36c-3-8-6-13-10-16\"/><path style=\"--c:#E0A94A\" class=\"q-t\" d=\"M10 36c3-8 6-13 10-16M18 38c1-9 3-15 6-19M30 38c-1-9-3-15-6-19M38 36c-3-8-6-13-10-16\"/><path class=\"q-h\" d=\"M2 41.5h44\"/><path style=\"--c:#C8923E\" d=\"M2 41.5h44\"/>",
  "cave": "<path class=\"q-h\" d=\"M3 43c0-20 9-32 21-32s21 12 21 32z\"/><path style=\"--c:#A07A55\" class=\"q-f\" d=\"M3 43c0-20 9-32 21-32s21 12 21 32z\"/><path class=\"q-h\" d=\"M12 43c0-12 5-20 12-20s12 8 12 20z\"/><path style=\"--c:#1A1B1F\" class=\"q-w\" d=\"M12 43c0-12 5-20 12-20s12 8 12 20z\"/><path class=\"q-h\" d=\"M14 43c1-6 5-10 10-10s9 4 10 10z\"/><path style=\"--c:#FF8A3D\" class=\"q-g\" d=\"M14 43c1-6 5-10 10-10s9 4 10 10z\"/><path class=\"q-h\" d=\"M18 23.5l1.6 5 1.6-5zM26 23l1.4 4 1.4-4z\"/><path style=\"--c:#E3ECFF\" class=\"q-w\" d=\"M18 23.5l1.6 5 1.6-5zM26 23l1.4 4 1.4-4z\"/><path class=\"q-h\" d=\"M15 43l2-6 2 6zM29 43l2.2-8 2.2 8z\"/><path style=\"--c:#7FE3FF\" class=\"q-w\" d=\"M15 43l2-6 2 6zM29 43l2.2-8 2.2 8z\"/><path class=\"q-h\" d=\"M9 18c3-3 6-5 9-6M33 13c2 1 4 3 6 5\"/><path style=\"--c:#3DDC84\" class=\"q-t\" d=\"M9 18c3-3 6-5 9-6M33 13c2 1 4 3 6 5\"/>",
  "hills": "<circle class=\"q-h\" cx=\"33\" cy=\"13\" r=\"6\"/><circle style=\"--c:#FFD54A\" class=\"q-w\" cx=\"33\" cy=\"13\" r=\"6\"/><path class=\"q-h\" d=\"M3 31c8-9 17-11 25-7 6-6 12-6 17 1-1 10-10 19-21 19S4 38 3 31z\"/><path style=\"--c:#2FBF5B\" class=\"q-f\" d=\"M3 31c8-9 17-11 25-7 6-6 12-6 17 1-1 10-10 19-21 19S4 38 3 31z\"/><path class=\"q-h\" d=\"M4 36c10-6 22-7 40-2-3 6-10 10-20 10-9 0-16-3-20-8z\"/><path style=\"--c:#3DDC84\" class=\"q-f\" d=\"M4 36c10-6 22-7 40-2-3 6-10 10-20 10-9 0-16-3-20-8z\"/><path class=\"q-h\" d=\"M37 28l3-7 3 7z\"/><path style=\"--c:#1F9E4A\" class=\"q-f\" d=\"M37 28l3-7 3 7z\"/>",
  "iceberg": "<path class=\"q-h\" d=\"M8 33l5 9h20l7-9z\"/><path style=\"--c:#7FE3FF\" class=\"q-g\" d=\"M8 33l5 9h20l7-9z\"/><path class=\"q-h\" d=\"M8 33l6-14 5 4 6-12 7 10 4-3 6 15z\"/><path style=\"--c:#E3F6FF\" class=\"q-f\" d=\"M8 33l6-14 5 4 6-12 7 10 4-3 6 15z\"/><path class=\"q-h\" d=\"M25 11l-3 13 5 9h5l-2-12z\"/><path style=\"--c:#A8DDFF\" class=\"q-w\" d=\"M25 11l-3 13 5 9h5l-2-12z\"/><path class=\"q-h\" d=\"M3 33h42\"/><path style=\"--c:#3FA9FF\" d=\"M3 33h42\"/><path class=\"q-h\" d=\"M40 5.8Q40 9 43.2 9Q40 9 40 12.2Q40 9 36.8 9Q40 9 40 5.8z\"/><path style=\"--c:#FFFFFF\" class=\"q-w\" d=\"M40 5.8Q40 9 43.2 9Q40 9 40 12.2Q40 9 36.8 9Q40 9 40 5.8z\"/>",
  "dream": "<path class=\"q-h\" d=\"M30 5a9 9 0 1 0 9 13 7 7 0 0 1-9-13z\"/><path style=\"--c:#FFD54A\" class=\"q-w\" d=\"M30 5a9 9 0 1 0 9 13 7 7 0 0 1-9-13z\"/><path class=\"q-h\" d=\"M12 37a7 7 0 0 1-.6-14A9.5 9.5 0 0 1 29.5 24a6.5 6.5 0 0 1 2 13z\"/><path style=\"--c:#B07CFF\" class=\"q-f\" d=\"M12 37a7 7 0 0 1-.6-14A9.5 9.5 0 0 1 29.5 24a6.5 6.5 0 0 1 2 13z\"/><path class=\"q-h\" d=\"M10 6.4Q10 10 13.6 10Q10 10 10 13.6Q10 10 6.4 10Q10 10 10 6.4z\"/><path style=\"--c:#FFFFFF\" class=\"q-w\" d=\"M10 6.4Q10 10 13.6 10Q10 10 10 13.6Q10 10 6.4 10Q10 10 10 6.4z\"/><path class=\"q-h\" d=\"M41 30Q41 33 44 33Q41 33 41 36Q41 33 38 33Q41 33 41 30z\"/><path style=\"--c:#7FE3FF\" class=\"q-w\" d=\"M41 30Q41 33 44 33Q41 33 41 36Q41 33 38 33Q41 33 41 30z\"/><circle class=\"q-h\" cx=\"20\" cy=\"9\" r=\"1.3\"/><circle style=\"--c:#FFFFFF\" class=\"q-w\" cx=\"20\" cy=\"9\" r=\"1.3\"/>",
  "glove": "<path class=\"q-h\" d=\"M12 22c0-8 5-13 13-13h4c7 0 11 5 11 12v6c0 5-3 8-7 9v1H17v-2c-3-2-5-6-5-9z\"/><path style=\"--c:#FF4F5E\" class=\"q-f\" d=\"M12 22c0-8 5-13 13-13h4c7 0 11 5 11 12v6c0 5-3 8-7 9v1H17v-2c-3-2-5-6-5-9z\"/><path class=\"q-h\" d=\"M13 23c-4-1-7 2-6 5.5 1 3 4 4 7 3z\"/><path style=\"--c:#FF6A6A\" class=\"q-f\" d=\"M13 23c-4-1-7 2-6 5.5 1 3 4 4 7 3z\"/><rect class=\"q-h\" x=\"16\" y=\"36\" width=\"18\" height=\"7\" rx=\"2\"/><rect style=\"--c:#FFFFFF\" class=\"q-f\" x=\"16\" y=\"36\" width=\"18\" height=\"7\" rx=\"2\"/><ellipse class=\"q-h\" cx=\"23\" cy=\"15\" rx=\"4\" ry=\"2\" transform=\"rotate(-15 23 15)\"/><ellipse style=\"--c:#FF9A9A\" class=\"q-w\" cx=\"23\" cy=\"15\" rx=\"4\" ry=\"2\" transform=\"rotate(-15 23 15)\"/><path class=\"q-h\" d=\"M41 4Q41 8 45 8Q41 8 41 12Q41 8 37 8Q41 8 41 4z\"/><path style=\"--c:#FFD23C\" class=\"q-w\" d=\"M41 4Q41 8 45 8Q41 8 41 12Q41 8 37 8Q41 8 41 4z\"/>",
  "clover": "<path class=\"q-h\" d=\"M24 26c1 7 4 12 9 16\"/><path style=\"--c:#2FBF5B\" d=\"M24 26c1 7 4 12 9 16\"/><g class=\"q-h\"><path d=\"M0 3c-3-3-8-5-8-10 0-3 2-5 4.5-5 1.8 0 3 1 3.5 2.5.5-1.5 1.7-2.5 3.5-2.5 2.5 0 4.5 2 4.5 5 0 5-5 7-8 10z\" transform=\"rotate(0 24 24) translate(24 21)\"/><path d=\"M0 3c-3-3-8-5-8-10 0-3 2-5 4.5-5 1.8 0 3 1 3.5 2.5.5-1.5 1.7-2.5 3.5-2.5 2.5 0 4.5 2 4.5 5 0 5-5 7-8 10z\" transform=\"rotate(120 24 24) translate(24 21)\"/><path d=\"M0 3c-3-3-8-5-8-10 0-3 2-5 4.5-5 1.8 0 3 1 3.5 2.5.5-1.5 1.7-2.5 3.5-2.5 2.5 0 4.5 2 4.5 5 0 5-5 7-8 10z\" transform=\"rotate(240 24 24) translate(24 21)\"/></g><g style=\"--c:#3DDC84\" class=\"q-f\"><path d=\"M0 3c-3-3-8-5-8-10 0-3 2-5 4.5-5 1.8 0 3 1 3.5 2.5.5-1.5 1.7-2.5 3.5-2.5 2.5 0 4.5 2 4.5 5 0 5-5 7-8 10z\" transform=\"rotate(0 24 24) translate(24 21)\"/><path d=\"M0 3c-3-3-8-5-8-10 0-3 2-5 4.5-5 1.8 0 3 1 3.5 2.5.5-1.5 1.7-2.5 3.5-2.5 2.5 0 4.5 2 4.5 5 0 5-5 7-8 10z\" transform=\"rotate(120 24 24) translate(24 21)\"/><path d=\"M0 3c-3-3-8-5-8-10 0-3 2-5 4.5-5 1.8 0 3 1 3.5 2.5.5-1.5 1.7-2.5 3.5-2.5 2.5 0 4.5 2 4.5 5 0 5-5 7-8 10z\" transform=\"rotate(240 24 24) translate(24 21)\"/></g><circle class=\"q-h\" cx=\"24\" cy=\"24\" r=\"1.8\"/><circle style=\"--c:#2FBF5B\" class=\"q-w\" cx=\"24\" cy=\"24\" r=\"1.8\"/><circle class=\"q-h\" cx=\"39\" cy=\"9\" r=\"3.5\"/><circle style=\"--c:#FFD23C\" class=\"q-w\" cx=\"39\" cy=\"9\" r=\"3.5\"/>",
  "sprout": "<path class=\"q-h\" d=\"M8 40c4-5 28-5 32 0v4H8z\"/><path style=\"--c:#A07A55\" class=\"q-f\" d=\"M8 40c4-5 28-5 32 0v4H8z\"/><path class=\"q-h\" d=\"M24 40V24\"/><path style=\"--c:#3DDC84\" d=\"M24 40V24\"/><path class=\"q-h\" d=\"M24 29c-7 1-12-3-13-10 7-1 12 3 13 10z\"/><path style=\"--c:#3DDC84\" class=\"q-f\" d=\"M24 29c-7 1-12-3-13-10 7-1 12 3 13 10z\"/><path class=\"q-h\" d=\"M24 25c1-7 6-11 13-11 0 7-5 11-13 11z\"/><path style=\"--c:#7CFF6B\" class=\"q-f\" d=\"M24 25c1-7 6-11 13-11 0 7-5 11-13 11z\"/><circle class=\"q-h\" cx=\"12\" cy=\"9\" r=\"1.6\"/><circle style=\"--c:#3FA9FF\" class=\"q-w\" cx=\"12\" cy=\"9\" r=\"1.6\"/><circle class=\"q-h\" cx=\"17\" cy=\"5\" r=\"1.3\"/><circle style=\"--c:#3FA9FF\" class=\"q-w\" cx=\"17\" cy=\"5\" r=\"1.3\"/>",
  "wreath": "<path class=\"q-h\" fill-rule=\"evenodd\" d=\"M24 7a17 17 0 1 1 0 34a17 17 0 1 1 0-34zM24 14a10 10 0 1 0 0 20a10 10 0 1 0 0-20z\"/><path style=\"--c:#2FBF5B\" class=\"q-f\" fill-rule=\"evenodd\" d=\"M24 7a17 17 0 1 1 0 34a17 17 0 1 1 0-34zM24 14a10 10 0 1 0 0 20a10 10 0 1 0 0-20z\"/><g class=\"q-h\"><circle cx=\"29.7\" cy=\"11.8\" r=\"1.7\"/><circle cx=\"37.1\" cy=\"20.8\" r=\"1.7\"/><circle cx=\"34.7\" cy=\"32.3\" r=\"1.7\"/><circle cx=\"24.2\" cy=\"37.5\" r=\"1.7\"/><circle cx=\"13.6\" cy=\"32.5\" r=\"1.7\"/><circle cx=\"10.8\" cy=\"21.2\" r=\"1.7\"/><circle cx=\"18.0\" cy=\"11.9\" r=\"1.7\"/></g><g style=\"--c:#FF4F5E\" class=\"q-w\"><circle cx=\"29.7\" cy=\"11.8\" r=\"1.7\"/><circle cx=\"37.1\" cy=\"20.8\" r=\"1.7\"/><circle cx=\"34.7\" cy=\"32.3\" r=\"1.7\"/><circle cx=\"24.2\" cy=\"37.5\" r=\"1.7\"/><circle cx=\"13.6\" cy=\"32.5\" r=\"1.7\"/><circle cx=\"10.8\" cy=\"21.2\" r=\"1.7\"/><circle cx=\"18.0\" cy=\"11.9\" r=\"1.7\"/></g><path class=\"q-h\" d=\"M24 37l-6 6v-9zM24 37l6 6v-9z\"/><path style=\"--c:#FF4F5E\" class=\"q-f\" d=\"M24 37l-6 6v-9zM24 37l6 6v-9z\"/><circle class=\"q-h\" cx=\"24\" cy=\"37\" r=\"2.4\"/><circle style=\"--c:#FFD23C\" class=\"q-w\" cx=\"24\" cy=\"37\" r=\"2.4\"/>",
  "ferris": "<path class=\"q-h\" d=\"M24.0 21.0L39.0 21.0M24.0 21.0L34.6 31.6M24.0 21.0L24.0 36.0M24.0 21.0L13.4 31.6M24.0 21.0L9.0 21.0M24.0 21.0L13.4 10.4M24.0 21.0L24.0 6.0M24.0 21.0L34.6 10.4\"/><path style=\"--c:#E3ECFF\" class=\"q-t\" d=\"M24.0 21.0L39.0 21.0M24.0 21.0L34.6 31.6M24.0 21.0L24.0 36.0M24.0 21.0L13.4 31.6M24.0 21.0L9.0 21.0M24.0 21.0L13.4 10.4M24.0 21.0L24.0 6.0M24.0 21.0L34.6 10.4\"/><path class=\"q-h\" d=\"M9 21a15 15 0 1 0 30 0a15 15 0 1 0 -30 0\"/><path style=\"--c:#FF7AD9\" d=\"M9 21a15 15 0 1 0 30 0a15 15 0 1 0 -30 0\"/><path class=\"q-h\" d=\"M24 21l-9 22M24 21l9 22M11 43h26\"/><path style=\"--c:#C7D2FF\" d=\"M24 21l-9 22M24 21l9 22M11 43h26\"/><g class=\"q-h\"><circle cx=\"29.7\" cy=\"7.1\" r=\"2.8\"/><circle cx=\"37.9\" cy=\"15.3\" r=\"2.8\"/><circle cx=\"37.9\" cy=\"26.7\" r=\"2.8\"/><circle cx=\"29.7\" cy=\"34.9\" r=\"2.8\"/><circle cx=\"18.3\" cy=\"34.9\" r=\"2.8\"/><circle cx=\"10.1\" cy=\"26.7\" r=\"2.8\"/><circle cx=\"10.1\" cy=\"15.3\" r=\"2.8\"/><circle cx=\"18.3\" cy=\"7.1\" r=\"2.8\"/></g><g style=\"--c:#FFD23C\" class=\"q-f\"><circle cx=\"29.7\" cy=\"7.1\" r=\"2.8\"/><circle cx=\"37.9\" cy=\"15.3\" r=\"2.8\"/><circle cx=\"37.9\" cy=\"26.7\" r=\"2.8\"/><circle cx=\"29.7\" cy=\"34.9\" r=\"2.8\"/><circle cx=\"18.3\" cy=\"34.9\" r=\"2.8\"/><circle cx=\"10.1\" cy=\"26.7\" r=\"2.8\"/><circle cx=\"10.1\" cy=\"15.3\" r=\"2.8\"/><circle cx=\"18.3\" cy=\"7.1\" r=\"2.8\"/></g><circle class=\"q-h\" cx=\"24\" cy=\"21\" r=\"2.6\"/><circle style=\"--c:#FF4F8F\" class=\"q-w\" cx=\"24\" cy=\"21\" r=\"2.6\"/>",
  "spray": "<rect class=\"q-h\" x=\"16\" y=\"11\" width=\"10\" height=\"6\" rx=\"1.5\"/><rect style=\"--c:#C7D2FF\" class=\"q-f\" x=\"16\" y=\"11\" width=\"10\" height=\"6\" rx=\"1.5\"/><rect class=\"q-h\" x=\"19\" y=\"7\" width=\"4\" height=\"4\" rx=\"1\"/><rect style=\"--c:#E3ECFF\" class=\"q-w\" x=\"19\" y=\"7\" width=\"4\" height=\"4\" rx=\"1\"/><rect class=\"q-h\" x=\"14\" y=\"17\" width=\"14\" height=\"26\" rx=\"3\"/><rect style=\"--c:#3FA9FF\" class=\"q-f\" x=\"14\" y=\"17\" width=\"14\" height=\"26\" rx=\"3\"/><rect class=\"q-h\" x=\"14\" y=\"25\" width=\"14\" height=\"8\"/><rect style=\"--c:#FF4F8F\" class=\"q-w\" x=\"14\" y=\"25\" width=\"14\" height=\"8\"/><g class=\"q-h\"><circle cx=\"30\" cy=\"8\" r=\"1.4\"/><circle cx=\"34\" cy=\"5\" r=\"1.6\"/><circle cx=\"35\" cy=\"10\" r=\"1.3\"/><circle cx=\"39\" cy=\"7\" r=\"1.7\"/><circle cx=\"40\" cy=\"13\" r=\"1.4\"/></g><g style=\"--c:#FFD23C\" class=\"q-w\"><circle cx=\"30\" cy=\"8\" r=\"1.4\"/><circle cx=\"34\" cy=\"5\" r=\"1.6\"/><circle cx=\"35\" cy=\"10\" r=\"1.3\"/><circle cx=\"39\" cy=\"7\" r=\"1.7\"/><circle cx=\"40\" cy=\"13\" r=\"1.4\"/></g><g class=\"q-h\"><circle cx=\"44\" cy=\"9\" r=\"1.3\"/><circle cx=\"38\" cy=\"3\" r=\"1.1\"/><circle cx=\"43\" cy=\"16\" r=\"1.2\"/></g><g style=\"--c:#7CFF6B\" class=\"q-w\"><circle cx=\"44\" cy=\"9\" r=\"1.3\"/><circle cx=\"38\" cy=\"3\" r=\"1.1\"/><circle cx=\"43\" cy=\"16\" r=\"1.2\"/></g>",
  "frame": "<rect class=\"q-h\" x=\"7\" y=\"5\" width=\"34\" height=\"38\" rx=\"2.5\"/><rect style=\"--c:#FFB13B\" class=\"q-f\" x=\"7\" y=\"5\" width=\"34\" height=\"38\" rx=\"2.5\"/><rect class=\"q-h\" x=\"11\" y=\"9\" width=\"26\" height=\"30\" rx=\"1\"/><rect style=\"--c:#2E4A3A\" class=\"q-w\" x=\"11\" y=\"9\" width=\"26\" height=\"30\" rx=\"1\"/><path class=\"q-h\" d=\"M11 30c5-4 10-4 14-2 4-2 8-2 12 1v10H11z\"/><path style=\"--c:#4E7A5A\" class=\"q-w\" d=\"M11 30c5-4 10-4 14-2 4-2 8-2 12 1v10H11z\"/><path class=\"q-h\" d=\"M15 39c0-7 4-11 9-11s9 4 9 11z\"/><path style=\"--c:#8B5A2B\" class=\"q-f\" d=\"M15 39c0-7 4-11 9-11s9 4 9 11z\"/><circle class=\"q-h\" cx=\"24\" cy=\"21\" r=\"5.5\"/><circle style=\"--c:#E8C49A\" class=\"q-f\" cx=\"24\" cy=\"21\" r=\"5.5\"/><path class=\"q-h\" d=\"M18.5 20c0-5 2.5-7.5 5.5-7.5s5.5 2.5 5.5 7.5c-1-2-3-3-5.5-3s-4.5 1-5.5 3z\"/><path style=\"--c:#5A3A1E\" class=\"q-w\" d=\"M18.5 20c0-5 2.5-7.5 5.5-7.5s5.5 2.5 5.5 7.5c-1-2-3-3-5.5-3s-4.5 1-5.5 3z\"/>",
  "mars": "<circle class=\"q-h\" cx=\"24\" cy=\"25\" r=\"15\"/><circle style=\"--c:#E2552B\" class=\"q-f\" cx=\"24\" cy=\"25\" r=\"15\"/><path class=\"q-h\" d=\"M17 12.5c4-2 10-2 14 0-4 2-10 2-14 0z\"/><path style=\"--c:#FFFFFF\" class=\"q-w\" d=\"M17 12.5c4-2 10-2 14 0-4 2-10 2-14 0z\"/><g class=\"q-h\"><circle cx=\"18\" cy=\"24\" r=\"3\"/><circle cx=\"29\" cy=\"31\" r=\"2.4\"/><circle cx=\"30\" cy=\"19\" r=\"1.6\"/><circle cx=\"19\" cy=\"33\" r=\"1.4\"/></g><g style=\"--c:#B23A1E\" class=\"q-w\"><circle cx=\"18\" cy=\"24\" r=\"3\"/><circle cx=\"29\" cy=\"31\" r=\"2.4\"/><circle cx=\"30\" cy=\"19\" r=\"1.6\"/><circle cx=\"19\" cy=\"33\" r=\"1.4\"/></g><path class=\"q-h\" d=\"M12 27c4 1 7-1 10 0\"/><path style=\"--c:#F07A4A\" class=\"q-t\" d=\"M12 27c4 1 7-1 10 0\"/><circle class=\"q-h\" cx=\"42\" cy=\"9\" r=\"2.2\"/><circle style=\"--c:#C7A890\" class=\"q-w\" cx=\"42\" cy=\"9\" r=\"2.2\"/><circle class=\"q-h\" cx=\"37\" cy=\"5\" r=\"1.3\"/><circle style=\"--c:#C7A890\" class=\"q-w\" cx=\"37\" cy=\"5\" r=\"1.3\"/>",
  "venus": "<circle class=\"q-h\" cx=\"24\" cy=\"25\" r=\"19\"/><circle style=\"--c:#FFE3A3\" class=\"q-g\" cx=\"24\" cy=\"25\" r=\"19\"/><circle class=\"q-h\" cx=\"24\" cy=\"25\" r=\"15\"/><circle style=\"--c:#F2B84B\" class=\"q-f\" cx=\"24\" cy=\"25\" r=\"15\"/><path class=\"q-h\" d=\"M12 22c3-5 11-6 15-2 3 3 0 7-4 6\"/><path style=\"--c:#FFE3A3\" d=\"M12 22c3-5 11-6 15-2 3 3 0 7-4 6\"/><path class=\"q-h\" d=\"M24 34c4 1 9-1 11-5\"/><path style=\"--c:#FFF1CC\" class=\"q-t\" d=\"M24 34c4 1 9-1 11-5\"/><path class=\"q-h\" d=\"M12.5 29c2 2.5 5 3.5 8 2.5\"/><path style=\"--c:#E8963A\" class=\"q-t\" d=\"M12.5 29c2 2.5 5 3.5 8 2.5\"/><path class=\"q-h\" d=\"M41 5Q41 8 44 8Q41 8 41 11Q41 8 38 8Q41 8 41 5z\"/><path style=\"--c:#FFFFFF\" class=\"q-w\" d=\"M41 5Q41 8 44 8Q41 8 41 11Q41 8 38 8Q41 8 41 5z\"/>",
  "jupiter": "<circle class=\"q-h\" cx=\"24\" cy=\"25\" r=\"16\"/><circle style=\"--c:#E8B07A\" class=\"q-f\" cx=\"24\" cy=\"25\" r=\"16\"/><path class=\"q-h\" d=\"M9.5 18.5h29\"/><path style=\"--c:#C97A4A\" d=\"M9.5 18.5h29\"/><path class=\"q-h\" d=\"M8.2 25h31.6\"/><path style=\"--c:#FFE2C2\" d=\"M8.2 25h31.6\"/><path class=\"q-h\" d=\"M9.5 31.5h29\"/><path style=\"--c:#C97A4A\" d=\"M9.5 31.5h29\"/><ellipse class=\"q-h\" cx=\"30\" cy=\"28.2\" rx=\"4\" ry=\"2.3\"/><ellipse style=\"--c:#D9502F\" class=\"q-w\" cx=\"30\" cy=\"28.2\" rx=\"4\" ry=\"2.3\"/><circle class=\"q-h\" cx=\"42\" cy=\"8\" r=\"2.4\"/><circle style=\"--c:#E3ECFF\" class=\"q-w\" cx=\"42\" cy=\"8\" r=\"2.4\"/><circle class=\"q-h\" cx=\"6\" cy=\"9\" r=\"1.6\"/><circle style=\"--c:#FFD54A\" class=\"q-w\" cx=\"6\" cy=\"9\" r=\"1.6\"/>",
  "mercury": "<circle class=\"q-h\" cx=\"40\" cy=\"9\" r=\"5\"/><circle style=\"--c:#FFB13B\" class=\"q-w\" cx=\"40\" cy=\"9\" r=\"5\"/><circle class=\"q-h\" cx=\"22\" cy=\"27\" r=\"14\"/><circle style=\"--c:#B8B0AC\" class=\"q-f\" cx=\"22\" cy=\"27\" r=\"14\"/><g class=\"q-h\"><circle cx=\"17\" cy=\"22\" r=\"2.6\"/><circle cx=\"27\" cy=\"30\" r=\"3\"/><circle cx=\"25\" cy=\"19\" r=\"1.5\"/><circle cx=\"16\" cy=\"32\" r=\"1.8\"/><circle cx=\"30\" cy=\"23\" r=\"1.2\"/></g><g style=\"--c:#7D7775\" class=\"q-w\"><circle cx=\"17\" cy=\"22\" r=\"2.6\"/><circle cx=\"27\" cy=\"30\" r=\"3\"/><circle cx=\"25\" cy=\"19\" r=\"1.5\"/><circle cx=\"16\" cy=\"32\" r=\"1.8\"/><circle cx=\"30\" cy=\"23\" r=\"1.2\"/></g>",
  "saturn": "<ellipse class=\"q-h\" cx=\"24\" cy=\"25\" rx=\"20\" ry=\"6.5\" transform=\"rotate(-18 24 25)\"/><ellipse style=\"--c:#E8D5A0\" class=\"q-f\" cx=\"24\" cy=\"25\" rx=\"20\" ry=\"6.5\" transform=\"rotate(-18 24 25)\"/><circle class=\"q-h\" cx=\"24\" cy=\"25\" r=\"10.5\"/><circle style=\"--c:#F2C46B\" class=\"q-f\" cx=\"24\" cy=\"25\" r=\"10.5\"/><path class=\"q-h\" d=\"M14.5 22h19M14 27.5h20\"/><path style=\"--c:#D9A050\" class=\"q-t\" d=\"M14.5 22h19M14 27.5h20\"/><path class=\"q-h\" d=\"M4.98 31.18A20 6.5 -18 0 0 43.02 18.82\"/><path style=\"--c:#E8D5A0\" d=\"M4.98 31.18A20 6.5 -18 0 0 43.02 18.82\"/><path class=\"q-h\" d=\"M9 6Q9 9 12 9Q9 9 9 12Q9 9 6 9Q9 9 9 6z\"/><path style=\"--c:#FFFFFF\" class=\"q-w\" d=\"M9 6Q9 9 12 9Q9 9 9 12Q9 9 6 9Q9 9 9 6z\"/><circle class=\"q-h\" cx=\"41\" cy=\"38\" r=\"1.4\"/><circle style=\"--c:#FFFFFF\" class=\"q-w\" cx=\"41\" cy=\"38\" r=\"1.4\"/>",
  "uranus": "<circle class=\"q-h\" cx=\"24\" cy=\"24\" r=\"13\"/><circle style=\"--c:#7FE0E8\" class=\"q-f\" cx=\"24\" cy=\"24\" r=\"13\"/><ellipse class=\"q-h\" cx=\"19.5\" cy=\"19\" rx=\"4\" ry=\"2.5\"/><ellipse style=\"--c:#C9F5F8\" class=\"q-w\" cx=\"19.5\" cy=\"19\" rx=\"4\" ry=\"2.5\"/><path class=\"q-h\" d=\"M28.5 4.8a4 19.6 15 1 0 -9 38.4a4 19.6 15 1 0 9 -38.4\"/><path style=\"--c:#E3FAFF\" d=\"M28.5 4.8a4 19.6 15 1 0 -9 38.4a4 19.6 15 1 0 9 -38.4\"/><circle class=\"q-h\" cx=\"41\" cy=\"36\" r=\"2\"/><circle style=\"--c:#C7D2FF\" class=\"q-w\" cx=\"41\" cy=\"36\" r=\"2\"/><path class=\"q-h\" d=\"M9 7Q9 10 12 10Q9 10 9 13Q9 10 6 10Q9 10 9 7z\"/><path style=\"--c:#FFFFFF\" class=\"q-w\" d=\"M9 7Q9 10 12 10Q9 10 9 13Q9 10 6 10Q9 10 9 7z\"/>",
  "neptune": "<circle class=\"q-h\" cx=\"24\" cy=\"25\" r=\"15\"/><circle style=\"--c:#3A6FF0\" class=\"q-f\" cx=\"24\" cy=\"25\" r=\"15\"/><path class=\"q-h\" d=\"M10 21c8-2 20-2 28 0M10.5 30c8 2 19 2 27 0\"/><path style=\"--c:#7FA6FF\" class=\"q-t\" d=\"M10 21c8-2 20-2 28 0M10.5 30c8 2 19 2 27 0\"/><ellipse class=\"q-h\" cx=\"29\" cy=\"25\" rx=\"4\" ry=\"2.4\"/><ellipse style=\"--c:#1F3FAA\" class=\"q-w\" cx=\"29\" cy=\"25\" rx=\"4\" ry=\"2.4\"/><ellipse class=\"q-h\" cx=\"18\" cy=\"17\" rx=\"3.5\" ry=\"2\"/><ellipse style=\"--c:#A9C4FF\" class=\"q-w\" cx=\"18\" cy=\"17\" rx=\"3.5\" ry=\"2\"/><circle class=\"q-h\" cx=\"7\" cy=\"10\" r=\"2\"/><circle style=\"--c:#C7D2FF\" class=\"q-w\" cx=\"7\" cy=\"10\" r=\"2\"/><path class=\"q-h\" d=\"M41 6Q41 9 44 9Q41 9 41 12Q41 9 38 9Q41 9 41 6z\"/><path style=\"--c:#FFFFFF\" class=\"q-w\" d=\"M41 6Q41 9 44 9Q41 9 41 12Q41 9 38 9Q41 9 41 6z\"/>",
  "sky": "<path class=\"q-h\" d=\"M40.0 17.0L44.0 17.0M37.1 24.1L39.9 26.9M30.0 27.0L30.0 31.0M22.9 24.1L20.1 26.9M20.0 17.0L16.0 17.0M22.9 9.9L20.1 7.1M30.0 7.0L30.0 3.0M37.1 9.9L39.9 7.1\"/><path style=\"--c:#FFC83D\" d=\"M40.0 17.0L44.0 17.0M37.1 24.1L39.9 26.9M30.0 27.0L30.0 31.0M22.9 24.1L20.1 26.9M20.0 17.0L16.0 17.0M22.9 9.9L20.1 7.1M30.0 7.0L30.0 3.0M37.1 9.9L39.9 7.1\"/><circle class=\"q-h\" cx=\"30\" cy=\"17\" r=\"7\"/><circle style=\"--c:#FFB13B\" class=\"q-f\" cx=\"30\" cy=\"17\" r=\"7\"/><path class=\"q-h\" d=\"M12 38a7.5 7.5 0 0 1-.6-15A10 10 0 0 1 30.5 25a6.8 6.8 0 0 1 2 13z\"/><path style=\"--c:#E3ECFF\" class=\"q-f\" d=\"M12 38a7.5 7.5 0 0 1-.6-15A10 10 0 0 1 30.5 25a6.8 6.8 0 0 1 2 13z\"/>"
  };
const ico2 = n => `<svg class="q" viewBox="0 0 48 48">${ICON2[n] || ICON2.generic}</svg>`;

// Govee efektleri: Türkçe ad, grup, renk tonları (uygulamadaki palete göre)
const GOVEE = {"Moonlit Night":["Mehtaplı Gece","color",[217]],"Herbal":["Bitkisel","color",[80,121]],"Dusk":["Alacakaranlık","color",[197,238,261,306]],"Berry":["Dut","color",[190,213]],"Tenderness":["Hassaslık","color",[2,322]],"Clear Sky":["Açık Hava","color",[43]],"Blessing":["Nimet","color",[22,338]],"Refreshing":["Canlandırıcı","color",[58,93,129]],"Beach":["Sahil","color",[26,137,195]],"Passion":["Tutku","color",[12,33]],"Radiance":["Parlak","color",[37,131,158,188]],"Peach":["Şeftali","color",[311]],"Blue":["Mavi","color",[215]],"Gleam":["Parıldama","color",[29]],"Care":["Bakım","color",[34,355]],"White Light":["Beyaz Işık","home",[44,209]],"Illumination":["Aydınlatma","home",[21,203]],"Sleep":["Uyku","home",[200,281,320]],"Work":["Çalışma","home",[203]],"Reading":["Okuma","home",[2,50,221]],"Meditation":["Meditasyon","home",[24,185,265]],"Siren":["Siren","home",[3,202]],"Leisure":["Dinlenme","home",[28]],"Dreamland":["Rüyalar Alemi","home",[201,322,351]],"Gradient":["Gradyan","home",[200,311]],"Fight":["Kavga","home",[21,203]],"Daze":["Sersemlik","home",[29,185,291,340]],"Movie":["Film","home",[28,234,273]],"Sports":["Spor","home",[203,230,263,292]],"Street Dance":["Sokak Dansı","home",[25,198,334]],"Game":["Oyun","home",[28,202]],"Universe":["Evren","sky",[203,296]],"Meteor":["Meteor","sky",[34,199,352]],"Milky Way":["Samanyolu","sky",[215,254]],"Starry Sky":["Yıldızlı Gökyüzü","sky",[27,202]],"Mars":["Mars","sky",[20]],"Venus":["Venüs","sky",[41]],"Earth":["Dünya","sky",[110,211]],"Jupiter":["Jüpiter","sky",[38]],"Mercury":["Merkür","sky",[219]],"Saturn":["Satürn","sky",[37]],"Uranus":["Uranüs","sky",[208]],"Neptune":["Neptün","sky",[188,218]],"Mondrian's Colors":["Mondrian Renkleri","color",[17]],"Memphis Style":["Memphis Tarzı","color",[23,226]],"Macaron Colors":["Makaron Renkleri","color",[25]],"Dunhuang Colors":["Dunhuang Renkleri","color",[26]],"Rococo Style":["Rococo Tarzı","color",[24]],"Morandi Colors":["Morandi Renkleri","color",[]],"Matisse's Colors":["Matisse Renkleri","color",[15,226]],"Ukiyo-e Colors":["Ukiyo-e Renkleri","color",[8,219]],"Maillard Style":["Maillard Tarzı","color",[25]],"Mucha Style":["Mucha Tarzı","color",[13,41]],"Water Lilies":["Nilüferler","color",[19,104]],"Sunrise at Sea":["Denizde Gün Doğumu","color",[23,50]],"Meadow Breeze":["Çayır Esintisi","color",[101,203]],"Haystack":["Saman Yığını","color",[37]],"Riverside":["Nehir Kenarı","color",[39,98]],"Spring Tour":["Bahar Turu","color",[29,104,201]],"Starry Night":["Yıldızlı Gece","color",[40,219,279]],"Sunflower":["Ayçiçeği","color",[36,95]],"Green Wheat Field":["Yeşil Buğday Tarlası","color",[31,80,109]],"Mountains":["Dağlar","color",[38]],"Maiden":["Genç Kız","color",[37]],"Dance Party":["Dans Partisi","fun",[190,215,263,295]],"Christmas Tree":["Noel Ağacı","fun",[38,104]],"Christmas Gift":["Noel Hediyesi","fun",[6,144]],"Sled":["Kızak","fun",[4,35]],"Candlelight":["Mum Işığı","fun",[28,49,200,309]],"Birthday":["Doğum Günü","fun",[203,231,262,288]],"Fireworks":["Havai Fişekler","fun",[7,38,142,199,265,307]],"Party":["Parti","fun",[198,281,308,356]],"Quiet":["Sessiz","home",[113,159,187]],"Heartbeat":["Kalp Atışı","home",[1,200,291,339]],"Rush":["Acele","home",[204]],"Light":["Işık","home",[200,310]],"Happy":["Mutlu","home",[25,350]],"Energetic":["Enerjik","home",[7,38,117,140,176,277]],"Warm":["Ilık","home",[24]],"Soothing":["Yatıştırıcı","home",[199,312]],"Romantic":["Romantik","home",[5,205]],"Mild":["Hafif","home",[44,324,353]],"Tension":["Gerginlik","home",[20]],"Unspoken Love":["Söylenmemiş Aşk","home",[]],"Crazy":["Çılgın","home",[202,311]],"Fascination":["Hayranlık","home",[249,277,313]],"Cheerful":["Keyifli","home",[22,133,157,200,249,353]],"Release":["Serbest Bırakma","home",[20,204,354]],"Excited":["Heyecanlı","home",[4,31,258,319]],"Enthusiastic":["Hevesli","home",[7,202]],"Fright":["Korku","home",[202]],"Sweet":["Tatlı","home",[337]],"Easter":["Paskalya","fun",[23,187,215,343]],"Carnival":["Karnaval","fun",[24,191,219,261,306,352]],"Mother's Day":["Anneler Günü","fun",[33,312]],"Father's Day":["Babalar Günü","fun",[24,205]],"Halloween":["Cadılar Bayramı","fun",[25]],"Christmas":["Noel","fun",[4,34,99,259]],"New Years":["Yeni Yıl","fun",[219,247,277,310,336]],"Valentine's Day":["Sevgililer Günü","fun",[8]],"Saint Patrick's Day":["Aziz Patrick Günü","fun",[129]],"April Fool's Day":["1 Nisan","fun",[33,228,280]],"Tree Planting Day":["Ağaç Dikme Günü","fun",[114,200]],"Labor Day":["İşçi Bayramı","fun",[9,34,316]],"Thanksgiving":["Şükran Günü","fun",[23,217]],"Sunrise":["Gün Doğumu","sky",[37,201]],"Sunset":["Gün Batımı","sky",[23,288,338]],"Morning":["Sabah","sky",[205]],"Afternoon":["Öğleden Sonra","sky",[24]],"Night":["Gece","sky",[244]],"Sunshine":["Güneş Işığı","sky",[23,47]],"Sky":["Gökyüzü","sky",[188,214]],"Sunny-A":["Güneşli-A","sky",[23]],"Sunny-B":["Güneşli-B","sky",[23]],"Breeze":["Esinti","sky",[310,338]],"Downpour":["Sağanak","sky",[201,310]],"Twilight":["Alacakaranlık","sky",[21]],"Moonlight":["Ay Işığı","sky",[6,37]],"Drizzle":["Hafif Yağmur","sky",[191,311]],"Thunderstorm":["Fırtına","sky",[201,231,264]],"Cloudy-A":["Bulutlu-A","sky",[196]],"Windy Day":["Rüzgarlı Gün","sky",[]],"Forest":["Orman","nature",[48,82,116]],"Firefly":["Ateş Böceği","nature",[47,127,158,188]],"Mountain Forest":["Dağ Ormanı","nature",[32,141]],"River":["Nehir","nature",[32,117,199]],"Grassland":["Çayır","nature",[126,172]],"Flower Field":["Çiçek Tarlası","nature",[24,133,160,188,335]],"Desert":["Çöl","nature",[9,36,82]],"Aurora":["Kuzey Işıkları","nature",[23,192,217,264,290]],"Rustling leaves":["Yaprak Hışırtısı","nature",[99,187]],"Cornfield":["Mısır Tarlası","nature",[37,281,352]],"Bonfire":["Şenlik Ateşi","nature",[5,200]],"Fire":["Ateş","nature",[4]],"Deep sea":["Denizin Derinlikleri","nature",[25,203,231,310]],"Karst Cave":["Karstik Mağara","nature",[25,233,324,352]],"Glacier":["Buzul","nature",[200]],"Wave":["Dalga","nature",[169,204]],"Tree shadow":["Ağaç Gölgesi","nature",[9,126,159,189]],"Sky B":["Gökyüzü B","nature",[188,214,242]],"Sailboat":["Yelkenli","nature",[41,199]],"Peaceful":["Barışçıl","home",[152]],"Going Home":["Eve Gidiş","home",[3,40]],"Healing":["İyileşme","home",[3,37]],"Mesocarp":["Mezokarp","home",[37,107]],"Colorful Clouds":["Renkli Bulutlar","home",[26,96,203,320]],"Ice Drinks":["Buzlu İçecekler","home",[201]],"Relax":["Rahat","home",[6,239,265]],"Yoga":["Yoga","home",[164]],"Dreamlike":["Rüya Gibi","home",[205,280]],"Stream":["Dere","home",[199]],"Fluctuate":["Dalgalanma","home",[20,126,188,215,261,321]],"Christmas B":["Noel B","fun",[27,99,260]],"Halloween B":["Cadılar Bayramı B","fun",[25]],"Rainbow":["Gökkuşağı","nature",[5,204,279]],"Cherry blossoms":["Kiraz Çiçekleri","nature",[35,344]],"Ghost":["Hayalet","nature",[222]],"Lotus Pond":["Lotus Göleti","nature",[25,101,212]],"Maple Tree Forest":["Akçaağaç Ormanı","nature",[13]],"Almond Lake":["Badem Gölü","nature",[41,213]],"Grove":["Koru","nature",[68,96]],"Wheat Wave":["Buğday Tarlası","nature",[37]],"Field":["Alan","nature",[43,107]],"Birdsong":["Kuş Ötüşü","nature",[27]],"Spring":["İlkbahar","nature",[101,189]],"Summer":["Yaz","nature",[101,159,186]],"Fall":["Sonbahar","nature",[38]],"Winter":["Kış","nature",[8,202,263]],"Breathe":["Nefes Alma","fun",[28,202,294,339]],"Jumping":["Atlama","fun",[23,203]],"Twinkle":["Pırıltı","fun",[28]],"Marquee":["Kayan Yazı","fun",[199,306]],"Graffiti":["Grafiti","fun",[32,163,216,268]],"Dripping":["Damlama","fun",[159,187]],"Longing":["Özlem","home",[262]],"Mysterious":["Gizemli","home",[189,217,280,307]],"Joyful":["Neşeli","home",[49,174,199,291]],"Spritual":["Ruhsal","home",[51,102,235,267,324]],"Cyber Moments":["Siber Anlar","home",[205,232,275]],"Secluded":["Tenha","home",[2,335]],"Bright":["Parlak","home",[54]],"Fish tank":["Akvaryum","home",[34,143,186,217,347]],"Evening":["Akşam","home",[28,235]],"Naps":["Öğle Uykuları","home",[24,110]],"Night Sips":["Gece Yudumları","home",[11,303]],"Misty":["Sisli","home",[218]],"Orange Sea":["Turuncu Deniz","home",[31]],"Candy Cane":["Şeker Kamışı","fun",[2]],"Christmas Bell":["Noel Zili","fun",[3,32,110]],"Graveyard":["Mezarlık","fun",[39]],"Sunrise B":["Gün Doğumu B","nature",[27,46,174]],"Sunset B":["Gün Batımı B","nature",[13,49]],"Sunset Glow":["Gün Batımı Parıltısı","nature",[4]],"Star":["Yıldız","nature",[28,201,260]],"Water Drop":["Su Damlası","nature",[204]],"Lightning":["Yıldırım","nature",[200,308]],"Gobi Desert":["Gobi Çölü","nature",[21,190]],"Slow Edge":["Yavaş Kenar","home",[38,216,319]],"Early Spring":["İlkbaharın Başı","color",[70]],"Autumn Colors":["Sonbahar Renkleri","color",[13,41]],"Warm Sun":["Sıcak Güneş","color",[32,110]],"Lavender":["Lavanta Rengi","color",[274]],"Mint":["Nane","color",[104]],"Colorful":["Renkli","color",[36,203,313]],"Lemon Summer":["Limon Yazı","color",[46]],"Cool":["Serin","color",[203]],"Watermelon":["Karpuz","color",[13,151]],"Ghost B":["Hayalet B","fun",[222]],"Children's Day":["Dünya Çocuk Günü","fun",[6,37]],"Family Day":["Aile Günü","fun",[310,335]],"Ripple":["Dalgalanma","nature",[161,214]],"Snow flake":["Kar Tanesi","nature",[202,310]],"Oasis":["Vaha","nature",[53,97,218]],"Seaside":["Deniz Kenarı","nature",[25,201]],"Lake":["Göl","nature",[40,106,201]],"Cloudy-B":["Bulutlu-B","sky",[201]],"Daybreak":["Şafak","sky",[34,211]],"Cloudy Day":["Bulutlu Gün","sky",[]],"Rain":["Yağmur","sky",[216,251,275]],"Snowing":["Karlı","sky",[175,206]],"Thick Fog":["Yoğun Sis","sky",[197]],"Candy":["Şekerleme","home",[5,38,234,261,336]],"The Piano":["Piyano","home",[24,202,237,276]],"Flash":["Flaş","home",[28,200,261]],"Blossom":["Çiçek","home",[27,84,246,274]],"Windmill":["Yel Değirmeni","home",[6,38,184,219,274]],"Dracarys":["Dracarys","fun",[22]],"Green Reign":["Yeşil Saltanat","fun",[42]],"Fire & Blood":["Ateş ve Kan","fun",[4]],"Accompany":["Eşlik Etme","home",[35]],"Neon City":["Neon Şehir","home",[232,280]],"The Pyramids":["Piramitler","color",[39]],"Sunlit Golden Mountain":["Güneşli Altın Dağ","color",[36,235]],"Mona Lisa":["Mona Lisa","color",[2,237]],"Flame":["Alev","home",[23]],"Goldfish":["Japon Balığı","home",[25,46]],"Butterfly":["Kelebek","home",[35,110,202,295]],"Jellyfish":["Denizanası","home",[28,158,191,215,303]],"Driving Santa":["Sürüş Yapan Noel Baba","fun",[3]],"Christmas Wreath":["Noel Çelengi","fun",[2,94,333]],"Gift Box":["Hediye Kutusu","fun",[4,32]],"Easter Egg":["Paskalya Yumurtası","fun",[3,40]],"Pumpkin":["Balkabağı","fun",[26]],"Mother's Bloom":["Annenin Çiçeği","fun",[10]],"Cyber":["Siber","fun",[34,216,249,334]],"Delicate Arch":["Narin Kemer","fun",[6,203]],"Rings":["Yüzükler","fun",[23,337]],"Greedy Snake":["Açgözlü Yılan","fun",[26,204]],"Solar flare":["Güneş Patlaması","sky",[6]],"Planet":["Gezegen","sky",[209]],"Nebula":["Nebula","sky",[217,262,292]],"Space":["Uzay","sky",[38,212]],"Interstellar Voyage":["Yıldızlararası Yolculuk","sky",[3,37,235]],"Meteorite":["Meteorit","sky",[354]],"Space Walk":["Uzay Yürüyüşü","sky",[32,204,231]],"Cosmic Echoes":["Kozmik Yankılar","sky",[218,252]],"Vast Cosmos":["Geniş Kozmos","sky",[31,216,254]],"Floating Mist":["Yüzen Buhar","sky",[4,219,245,275]],"Cumulus":["Kümülüs","sky",[198]],"Cumulonimbus":["Kümülonimbus","sky",[158,203]],"Nimbostratus":["Nimbostratüs","sky",[202,231]],"Cirrocumulus":["Sirrokümülüs","sky",[204]],"Cirrostratus":["Sirrostratüs","sky",[203]],"Altocumulus":["Altokümülüs","sky",[222]],"Morning Mist":["Sabah Sisi","sky",[18,168]],"Sunny Rain":["Güneşli Yağmur","sky",[41,103,174]],"Heavy Rain":["Şiddetli Yağmur","sky",[38,157,187,218,242]],"Sprinkle":["Çise","sky",[112,158,188]],"Sunny":["Güneşli","sky",[23]],"Accumulated Snow":["Birikmiş Kar","sky",[175,203]],"Ocean":["Okyanus","nature",[202,234]],"Sunset Beach":["Gün Batımı Plajı","nature",[35,262,292]],"Lunar Eclipse":["Ay Tutulması","nature",[36]],"Snowy Mountain":["Karlı Dağ","nature",[201]],"Falling Leaves":["Dökülen Yapraklar","nature",[38]],"Sunset Tide":["Gün Batımı Gelgiti","nature",[54]],"Waterfall":["Şelale","nature",[228]],"Sunny Beach":["Güneşli Plaj","nature",[26,137,195]],"Hills":["Tepeler","nature",[50,97]],"Moonlight Sprinkles":["Ay Işığı Serpintileri","nature",[42,128,234]],"Winter Cottage":["Kış Kulübesi","nature",[233]],"Beachside Cottage":["Sahil Kenarı Kulübesi","nature",[4,33,138,202]],"Halloween C":["Cadılar Bayramı C","fun",[25]],"Halloween D":["Cadılar Bayramı D","fun",[25]],"Jack-o'-lantern":["Kabak Fener","fun",[25]],"Dashing Sleigh":["Hareketli Kızak","fun",[2,37]],"Dine Together":["Beraber Akşam Yemeği","fun",[35,117,195,247,277]],"Glistening":["Pırıl Pırıl","nature",[37,196]],"Summer B":["Yaz B","nature",[125,157,185]],"Rainforest":["Yağmur Ormanı","nature",[5,38,340]],"Dating":["Randevu","home",[201,293]],"Dinner":["Akşam Yemeği","home",[202,292]],"Night Light":["Gece Lambası","home",[28,244,272]],"Funfair":["Eğlence Fuarı","fun",[52,200,307,334]],"Dawn":["Şafak","sky",[50,158]],"Cloudy":["Bulutlu","sky",[202]],"Music: Stippling":["Noktalama","fun",[2,37,78,182,299]],"Music: Rhythm":["Ahenk","fun",[35,211]],"Music: Hopping":["Atlamalı","fun",[36,126,204,323]],"Music: Colorful":["Renkli","fun",[37,201,311]],"Music: Luminous":["Aydınlık","fun",[23,127,155,247,306]],"Music: Rolling":["Yuvarlanma","fun",[28,49,203]],"Music: Sprouting":["Parlama","fun",[23,203]],"Music: Energic":["Enerjik","fun",[8]],"Music: Spectrum":["Spektrum","fun",[28,213,297]],"Music: Separation":["Ayrılma","fun",[22,64,139,204,234,355]],"Music: PianoKeys":["Piyano Tuşları","fun",[25,203,237,277]],"Music: Fountain":["Çeşme","fun",[112,202]],"Music: DayAndNight":["Gündüz ve Gece","fun",[7,35,216]],"Music: Shiny":["Parlak","fun",[23,203,321,353]],"Music: Splash":["Sıçratma","fun",[201,276]],"Music: Orbit":["Yörünge","fun",[23]],"Music: UFO":["UFO","fun",[35,162,215]],"Music: Spring":["İlkbahar","fun",[25,52,83,324,353]],"Music: Ripple":["Dalga","fun",[161,214]],"Music: Gridding":["Izgara","fun",[4,36,162,221,334]],"Music: Flame":["Ateş","fun",[6]],"Music: Sky":["Gökyüzü","fun",[175,196]],"Music: Color Painting":["Renkli Resim","fun",[24,218,260]],"Music: Disassociate":["Sürüklenme","fun",[43,83,328]],"Music: Floating Mist":["Yüzen Buhar","fun",[22,218,244,275]],"Music: Meteor shower":["Meteor Yağmuru","fun",[28,201]],"Music: Flexing":["Esneme","fun",[254]],"Music: Smudge":["Leke","fun",[253,275,354]],"Music: Spin":["Dönme","fun",[24,103,175,231,276,309]]};

// ---- Lemur Light Effect Card: card ----
const CARD_VERSION = '1.5.0';
// colour effect icons (ICON3) come from lemur-icons.json next to this file, so the card shows up before they arrive
let ICON3 = {}, ICON3_OK = false;
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
  _l() { const h = this._h; return pickLang((h && ((h.locale && h.locale.language) || h.language)) || 'en'); }
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
        { name: 'language', selector: { select: { mode: 'dropdown', options: [{ value: 'auto', label: T.auto }, ...LANGS.map(l => ({ value: l, label: LANG_NAMES[l] }))] } } },
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
const uiColor = v => { const s = String(v || '').trim(); if (!s) return ''; return /^[a-z-]+$/.test(s) && !/^(white|black|transparent)$/.test(s) ? `var(--${s}-color, ${s})` : s; };
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


// ---- Lemur Light Effect Card: control panel ("Lemur Işık Efekt Kartı") ----
// The panel is the card in edit mode: rooms on top with the selected room's lights joined below,
// tabs on the left, effects on the right. Everything moves by drag and drop.
const P_TXT = {
  tr: {
    title: 'Lemur Işık Efekt Kartı', undo: 'Geri al', undoK: 'Geri al (Ctrl+Z)', more: 'Diğer işlemler', settings: 'Ayarlar', settingsS: 'Görünüm, davranış, gece modu, kendi efektlerin',
    allHome: 'Tüm Ev', none: 'Diğer', hiddenRoom: 'Kartta gizli', addRoom: 'Oda', addRoomT: 'Işığı olmayan alanlar', addRoomNone: 'Işığı olmayan alan yok',
    lightsOf: '{r} ışıkları', allLights: 'Bütün ışıklar', hiddenLights: 'Kartta gizli ışıklar', noLight: 'Bu odada ışık yok', noHidden: 'Gizli ışık yok',
    allUses: 'Tüm Ev sekmesi evdeki bütün ışıkları kullanır', allOff: 'Tüm Ev kartta kapalı', allOffB: 'Tüm Ev’i kapat', offShort: 'kapalı', allOnB: 'Tüm Ev’i aç',
    addLight: 'Işık ekle', lHide: 'Kartta gizle', lBack: 'Asıl odasına geri al · {r}', lMove: 'Başka odaya taşı', addLightT: 'Işık ekle → {r}', searchL: 'Işık ara', fxN: '{n} efekt', noFxL: 'efektsiz', lOnly: 'Sadece ışık', fxUse: 'Efektlerde kullan', fxUseS: 'Kapalıyken yalnızca ton, renk ve parlaklık için kullanılır; efekt listesini etkilemez.', fxNone: 'Efekt desteklemiyor, sadece ışık', fxCnt: '{n} ışık · {f} efektte',
    why: { manual: 'elle gizlendi', segment: 'segment', indicator: 'gösterge LED’i', screen: 'tarayıcı ekranı', device: 'cihaz ışığı' },
    allFx: 'Tüm efektler', allFxS: '{n} efekt · ara, seç, sürükle', light: 'Işık', lightE: 'Beyaz ton, renk ve parlaklık. Bu sekme sabit, hep ilk sırada.',
    fav: 'Favoriler', hid: 'Gizli', addTab: 'Sekme ekle', emptyTab: 'Boş sekme', newTab: 'Yeni sekme', ready: 'Hazır', fromRooms: 'Diğer odalardan',
    edit: 'Düzenle', delTab: 'Sekmeyi sil', search: 'Efekt ara', dropHere: 'Efektleri buraya sürükle', noHidFx: 'Gizli efekt yok',
    hiddenRoomE: 'Buradaki ışıklar kartta hiç görünmez. Geri getirmek için üstteki bir odaya sürükle.', noLightE: 'Bu odada henüz ışık yok',
    noFxRoom: 'Bu odadaki ışıkların efekti yok. Işık sekmesi yine de çalışır.', selN: '{n} seçili', selHint: 'sürükleyip bir sekmeye bırak', clear: 'Seçimi bırak',
    reset: '{r}: otomatik düzene dön', roomOff: 'Odayı kartta gizle', roomOn: 'Odayı kartta göster', copyT: '{r} sekmelerini kopyala', copyAll: 'Bütün odalara',
    moved: '{x} → {r}', nLights: '{n} ışık', nFx: '{n} efekt', hiddenFx: '{x} bu odada gizlendi', shownFx: '{x} tekrar görünüyor', favAdd: '{x} favorilere eklendi',
    tabDel: '“{t}” silindi, efektleri Gizli’ye geçti', tabCopied: '“{t}” sekmesi kopyalandı → {r}', tabAdded: '“{t}” sekmesi eklendi', copied: 'Sekmeler kopyalandı → {r}',
    toRoom: '{r}', toAll: 'bütün odalar', resetDone: 'Otomatik düzene dönüldü', roomOffT: 'Oda kartta gizlendi', roomOnT: 'Oda kartta gösteriliyor',
    allOffT: 'Tüm Ev kartta kapalı', allOnT: 'Tüm Ev kartta açık', order: 'Sıra güncellendi', saved: 'Kaydedildi', undone: 'Geri alındı',
    fxMenu: 'Efekt ayrıntıları', namesOn: 'Işıklardaki adı', upIcon: 'Simge yükle', rmIcon: 'Varsayılan simge', hideFx: 'Bu odada gizle', showFx: 'Bu odada göster',
    addFav: 'Favorilere ekle', remFav: 'Favorilerden çıkar', iconSaved: 'Simge kaydedildi', iconErr: 'Simge yüklenemedi', close: 'Kapat',
    sCard: 'Kart', icColor: 'Renkli', icMono: 'Sade', defIcon: 'Varsayılan simge', searchI: 'Simge ara', lang: 'Dil', auto: 'Otomatik',
    sStop: 'Efekt durdurulunca', white: 'Beyaz ton', bright: 'Parlaklık', sAdv: 'Gelişmiş', thr: 'Efektli ışık sayılması için en az', thrS: 'Daha az efekti olan ışıklar sadece Işık sekmesinde görünür', thrN: '{n} efekt',
    local: 'Entegrasyon yüklenmemiş görünüyor; değişiklikler kaydedilemez.',
    sLook: 'Görünüm', tileSize: 'Karo boyutu', tsAuto: 'Otomatik', tsS: 'Küçük', tsM: 'Orta', tsL: 'Büyük',
    icStyle: 'Efekt simgeleri', icColorS: 'Renkli', icMonoS: 'Sade (tek renk)', showNames: 'Efekt adları', showNamesS: 'Kapalıyken karolarda sadece simge görünür',
    bg: 'Arka plan', bgDark: 'Koyu', bgBlack: 'Siyah (OLED)', bgTheme: 'Home Assistant teması', bgThemeS: 'Tema seçilirse kartın zemini ve yazıları Home Assistant temasını izler',
    showBar: 'Renk çizgisi', showBarS: 'Karoların altındaki renkli çizgi', showDots: 'Destek noktaları', showDotsS: 'Efekti kaç ışığın desteklediğini gösteren noktalar',
    sButtons: 'Alt çubuk', showStop: 'Durdur düğmesi', showRandom: 'Rastgele düğmesi', showRandomS: 'Geniş düzende görünür',
    sBehave: 'Davranış', fxOn: 'Kapalı ışıkta efekt seçilince', fxOnS: 'Işık bu parlaklıkta açılır', fxOnOff: 'Işığın kendi ayarı',
    startTab: 'Kart açılınca', startTabS: '“Son kullanılan”: o cihazda en son açtığın oda ve sekme', stAuto: 'Otomatik', stFav: 'Favoriler', stLast: 'Son kullanılan', stLight: 'Işık',
    lp: 'Uzun basma süresi', lpS: 'Efekt menüsünü açmak için basılı tutma süresi', haptic: 'Titreşim', hapticS: 'Dokununca ve basılı tutunca (destekleyen telefonlarda)',
    sRooms: 'Odalar ve ışıklar', groups: 'Işık gruplarını da göster', groupsS: 'Home Assistant’taki ışık grupları ayrı bir ışık gibi listelenir',
    sNight: 'Gece modu', night: 'Gece modu', nightS: 'Bu saatler arasında parlaklık üst sınırı uygulanır (efektler, Durdur, parlaklık)', from: 'Başlangıç', to: 'Bitiş', nightMax: 'En fazla parlaklık',
    sMine: 'Kendi efektlerin', mineS: 'Bir efekt seç, onu desteklemeyen ışıklarda ne olacağını belirle; kartta normal bir efekt gibi görünür.', mineNew: 'Yeni efekt', mineNone: 'Henüz kendi efektin yok',
    sReset: 'Sıfırla', resetAll: 'Her şeyi sıfırla', resetAllS: 'Ayarlar, oda ve ışık düzeni, sekmeler, favoriler, gizlenenler, yüklenen simgeler ve kendi efektlerin silinir',
    resetQ: 'Her şey sıfırlansın mı?', resetW: 'Bu işlem ayarları, oda ve ışık düzenini, bütün sekmeleri, favorileri, gizlenen efektleri, yüklenen simgeleri ve kendi efektlerini siler. Evdeki bütün kartlar ilk kurulumdaki haline döner. Bu işlem geri alınamaz.',
    resetYes: 'Evet, her şeyi sıfırla', cancel: 'Vazgeç', resetOk: 'Her şey sıfırlandı',
    roomIcon: 'Oda simgesi', roomIconT: '{r} simgesi', mdiPh: 'mdi:simge-adi', apply: 'Uygula',
    script: 'Script olarak kaydet', scriptFav: 'Favorilerden script oluştur', scriptOk: '{n} script kaydedildi (Ayarlar → Otomasyonlar ve sahneler → Scriptler)', scriptErr: 'Script kaydedilemedi: {e}',
    editMine: 'Düzenle', delMine: 'Sil', mineDel: '“{x}” silindi',
    notHere: 'Bu efektin {r} odasında ışığı yok; önce efekte bu odadan bir ışık ekle', mineDrag: 'Sekmeye taşımak için sola, bir sekmenin üstüne sürükle',
    mineTab: 'Efekt oluştur', mineTabS: '{n} efektin · ışıkları sürükle', mineList: 'Kendi efektlerin', mineEmpty: 'Henüz kendi efektin yok. “Yeni efekt” ile başla: ışıkları sağa sürükle, her birinin ne yapacağını seç.', back: 'Geri',
    allL: 'Bütün ışıklar', allLS: 'Sürükle ya da + ile ekle', inFx: 'Bu efektteki ışıklar', inFxS: 'Buraya sürükle; her ışığın ne açacağını seç', dropL: 'Işıkları buraya sürükle', addAllR: 'Hepsini ekle', remL: 'Çıkar', allIn: 'Bütün ışıklar eklendi', fbDef: 'Otomatik ışıklar efekti desteklemiyorsa', nLin: '{n} ışık',
    ceTitle: 'Kendi efektin', ceName: 'Ad', ceIcon: 'Simge', ceBase: 'Temel efekt', ceBaseS: 'Destekleyen ışıklarda bu efekt oynar', ceNoBase: 'Yok, her ışık için kendim seçeceğim',
    ceFb: 'Desteklemeyen ışıklarda', ceFbS: 'Temel efekti olmayan ya da sadece ışık olarak kullanılan ışıklar', ceLights: 'Işık ışık', ceLightsS: 'İstersen tek tek değiştir',
    save: 'Kaydet', del: 'Sil', bri: 'Parlaklık', ceNameErr: 'Bir ad yaz', ceSaved: '“{x}” kaydedildi', ceHint: 'Kartta “Efektlerim” sekmesinde görünür.',
    m_auto: 'Otomatik', m_fx: 'Efekt', m_color: 'Renk', m_white: 'Beyaz', m_off: 'Kapat', m_skip: 'Dokunma', supBase: 'temel efekti oynatır', noBase: 'temel efekt yok', autoIs: 'otomatik: {x}',
    upd: 'Yeni sürüm yüklendi ({v}). Ekranı yenile.', reload: 'Yenile',
    sVer: 'Sürüm ve güncelleme', updT: 'Sürüm', updInst: 'Yüklü: v{v}', updCheck: 'Güncellemeleri denetle', updChecking: 'Denetleniyor…', updOk: 'güncel', updAt: 'son kontrol {t}', updNew: 'v{v} hazır', updNotes: 'Yenilikler', updGo: 'Güncelle', updGh: 'GitHub’da aç', updIng: 'v{v} indiriliyor…', updDone: 'v{v} indirildi. Home Assistant yeniden başlayınca devreye girer.', updRestart: 'Yeniden başlat', updAsk: 'Home Assistant yeniden başlasın mı? Bir iki dakika ışık kontrolü ve otomasyonlar durur.', updYes: 'Evet, yeniden başlat', updRest: 'Yeniden başlatılıyor… Açılınca sayfa kendiliğinden yenilenir.', updErr: 'Denetlenemedi: {e}', updAgain: 'Tekrar denetle', updNoHacs: 'HACS ile kurulmadığı için buradan yüklenemiyor',
    pvB: 'Önizleme', pvT: 'Açıkken tıkladığın efekt ışıklarda hemen çalar', pvOn: 'Önizleme açık', pvWhere: 'tıkladığın efekt şu odanın ışıklarında çalar:', pvNow: 'şu an: {x}', pvBack: 'Eski haline dön', pvKeep: 'Böyle bırak', pvBackT: 'Işıklar önizlemeden önceki haline döndü', pvKeepT: 'Son efekt çalmaya devam ediyor', pvErr: 'Önizleme çalışmadı: {e}', pvNoRoom: 'Önizleme için bir oda seç',
    fade: 'Geçiş süresi', fadeS: 'Renk, beyaz, parlaklık ve kapatma yumuşak geçsin (destekleyen ışıklarda)', fadeNo: 'Yok',
    showRecent: 'Son kullanılanlar sekmesi', showRecentS: 'Odada son oynatılan efektler, Favoriler’in yanında',
    sBackup: 'Yedek', bkDown: 'Yedeği indir', bkDownS: 'Odalar, sekmeler, favoriler, kendi efektlerin, ayarlar ve simgeler tek dosyada',
    bkUp: 'Yedekten geri yükle', bkUpS: 'Bir yedek dosyası seç; şu anki düzenin yerine geçer', bkQ: 'Yedek geri yüklensin mi?',
    bkW: '{d} tarihli yedek. Şu anki odalar, sekmeler, favoriler, kendi efektlerin, ayarlar ve simgeler bu yedekle değiştirilir.',
    bkYes: 'Geri yükle', bkOk: 'Yedek geri yüklendi', bkErr: 'Bu dosya bir Lemur yedeği değil', bkSaved: 'Yedek indirildi', bkBusy: 'Yedek hazırlanıyor…',
    fillT: 'Eksik ışıkları tamamla', fillHead: '{x} · eksikleri tamamla', fillS: 'Bu efekti desteklemeyen ışıklar ne yapsın? Seçtiklerin efektle birlikte açılır, efekt böylece bütün odayı kaplar.',
    fillSup: 'Destekleyen ışıklar', fillMiss: 'Desteklemeyen ışıklar', fillAll: 'Hepsi için', fillAllS: 'Ayrıca seçmediğin her ışık bunu yapar',
    fillNone: 'Bu efekti evdeki bütün ışıklar destekliyor; tamamlanacak ışık yok.', fillSaved: '“{x}” tamamlandı', fillDel: 'Tamamlamayı kaldır', fillDeleted: '“{x}” için tamamlama kaldırıldı',
    m_def: 'Hepsi için seçilen', fillOn: 'Tamamlanmış', fillTag: 'tamamlandı', fillNoEff: 'efekti var ama efektlerde kullanılmıyor'
  },
  en: {
    title: 'Lemur Light Effect Card', undo: 'Undo', undoK: 'Undo (Ctrl+Z)', more: 'More', settings: 'Settings', settingsS: 'Appearance, behaviour, night mode, your own effects',
    allHome: 'Whole home', none: 'Unassigned', hiddenRoom: 'Hidden in card', addRoom: 'Room', addRoomT: 'Areas without lights', addRoomNone: 'No areas without lights',
    lightsOf: '{r} lights', allLights: 'All lights', hiddenLights: 'Lights hidden in the card', noLight: 'No lights in this room', noHidden: 'No hidden lights',
    allUses: 'The Whole home tab uses every light at home', allOff: 'Whole home is off in the card', allOffB: 'Turn Whole home off', offShort: 'off', allOnB: 'Turn Whole home on',
    addLight: 'Add light', lHide: 'Hide in the card', lBack: 'Back to its own room · {r}', lMove: 'Move to another room', addLightT: 'Add light → {r}', searchL: 'Search lights', fxN: '{n} effects', noFxL: 'no effects', lOnly: 'Light only', fxUse: 'Use for effects', fxUseS: 'When off it is used only for tone, colour and brightness and does not affect the effect list.', fxNone: 'No effect support, light only', fxCnt: '{n} lights · {f} for effects',
    why: { manual: 'hidden by you', segment: 'segment', indicator: 'indicator LED', screen: 'browser screen', device: 'device light' },
    allFx: 'All effects', allFxS: '{n} effects · drag onto tabs', light: 'Light', lightE: 'White tone, color and brightness. This tab is fixed and always first.',
    fav: 'Favorites', hid: 'Hidden', addTab: 'Add tab', emptyTab: 'Empty tab', newTab: 'New tab', ready: 'Ready-made', fromRooms: 'From other rooms',
    edit: 'Edit', delTab: 'Delete tab', search: 'Search effects', dropHere: 'Drag effects here', noHidFx: 'No hidden effects',
    hiddenRoomE: 'These lights never show in the card. Drag one onto a room above to bring it back.', noLightE: 'No lights in this room yet',
    noFxRoom: 'The lights in this room have no effects. The Light tab still works.', selN: '{n} selected', selHint: 'drag them onto a tab', clear: 'Clear selection',
    reset: '{r}: back to automatic layout', roomOff: 'Hide room in the card', roomOn: 'Show room in the card', copyT: 'Copy {r} tabs to', copyAll: 'Every room',
    moved: '{x} → {r}', nLights: '{n} lights', nFx: '{n} effects', hiddenFx: '{x} hidden in this room', shownFx: '{x} is shown again', favAdd: '{x} added to favorites',
    tabDel: '“{t}” deleted, its effects moved to Hidden', tabCopied: '“{t}” tab copied → {r}', tabAdded: '“{t}” tab added', copied: 'Tabs copied → {r}',
    toRoom: '{r}', toAll: 'every room', resetDone: 'Back to the automatic layout', roomOffT: 'Room hidden in the card', roomOnT: 'Room shown in the card',
    allOffT: 'Whole home is off in the card', allOnT: 'Whole home is on in the card', order: 'Order updated', saved: 'Saved', undone: 'Undone',
    fxMenu: 'Effect details', namesOn: 'Name on each light', upIcon: 'Upload icon', rmIcon: 'Default icon', hideFx: 'Hide in this room', showFx: 'Show in this room',
    addFav: 'Add to favorites', remFav: 'Remove from favorites', iconSaved: 'Icon saved', iconErr: 'Could not upload icon', close: 'Close',
    sCard: 'Card', icColor: 'Colour', icMono: 'Simple', defIcon: 'Default icon', searchI: 'Search icons', lang: 'Language', auto: 'Automatic',
    sStop: 'When an effect is stopped', white: 'White tone', bright: 'Brightness', sAdv: 'Advanced', thr: 'Minimum effects to count as an effect light', thrS: 'Lights with fewer effects only appear in the Light tab', thrN: '{n} effects',
    local: 'The integration does not seem to be loaded; changes cannot be saved.',
    sLook: 'Appearance', tileSize: 'Tile size', tsAuto: 'Automatic', tsS: 'Small', tsM: 'Medium', tsL: 'Large',
    icStyle: 'Effect icons', icColorS: 'Colour', icMonoS: 'Simple (one colour)', showNames: 'Effect names', showNamesS: 'When off, tiles show only the icon',
    bg: 'Background', bgDark: 'Dark', bgBlack: 'Black (OLED)', bgTheme: 'Home Assistant theme', bgThemeS: 'With theme, the card background and text follow your Home Assistant theme',
    showBar: 'Colour line', showBarS: 'The coloured line under tiles', showDots: 'Support dots', showDotsS: 'Dots showing how many lights support an effect',
    sButtons: 'Bottom bar', showStop: 'Stop button', showRandom: 'Random button', showRandomS: 'Shown in the wide layout',
    sBehave: 'Behaviour', fxOn: 'When an effect is picked for a light that is off', fxOnS: 'The light comes on at this brightness', fxOnOff: 'Light’s own setting',
    startTab: 'When the card opens', startTabS: '“Last used”: the room and tab you last had open on that device', stAuto: 'Automatic', stFav: 'Favorites', stLast: 'Last used', stLight: 'Light',
    lp: 'Long press time', lpS: 'How long to hold to open the effect menu', haptic: 'Vibration', hapticS: 'On tap and long press (on phones that support it)',
    sRooms: 'Rooms and lights', groups: 'Also show light groups', groupsS: 'Light groups from Home Assistant are listed like a light',
    sNight: 'Night mode', night: 'Night mode', nightS: 'Between these times brightness is capped (effects, Stop, brightness)', from: 'From', to: 'To', nightMax: 'Maximum brightness',
    sMine: 'Your own effects', mineS: 'Pick an effect, choose what lights without it do, and it shows in the card like any other effect.', mineNew: 'New effect', mineNone: 'No effects of your own yet',
    sReset: 'Reset', resetAll: 'Reset everything', resetAllS: 'Settings, room and light layout, tabs, favorites, hidden effects, uploaded icons and your own effects are deleted',
    resetQ: 'Reset everything?', resetW: 'This deletes the settings, the room and light layout, every tab, favorites, hidden effects, uploaded icons and your own effects. Every card at home goes back to how it was after installing. This cannot be undone.',
    resetYes: 'Yes, reset everything', cancel: 'Cancel', resetOk: 'Everything was reset',
    roomIcon: 'Room icon', roomIconT: '{r} icon', mdiPh: 'mdi:icon-name', apply: 'Apply',
    script: 'Save as script', scriptFav: 'Make scripts from favorites', scriptOk: '{n} scripts saved (Settings → Automations & scenes → Scripts)', scriptErr: 'Could not save the script: {e}',
    editMine: 'Edit', delMine: 'Delete', mineDel: '“{x}” deleted',
    notHere: 'This effect has no light in {r}; add a light from this room to the effect first', mineDrag: 'Drag onto a tab on the left to move it there',
    mineTab: 'Create effect', mineTabS: '{n} effects · drag lights', mineList: 'Your own effects', mineEmpty: 'No effects of your own yet. Start with “New effect”: drag lights to the right and choose what each one does.', back: 'Back',
    allL: 'All lights', allLS: 'Drag, or add with +', inFx: 'Lights in this effect', inFxS: 'Drag here, then choose what each light does', dropL: 'Drag lights here', addAllR: 'Add all', remL: 'Remove', allIn: 'Every light is in', fbDef: 'If an automatic light lacks the base effect', nLin: '{n} lights',
    ceTitle: 'Your own effect', ceName: 'Name', ceIcon: 'Icon', ceBase: 'Base effect', ceBaseS: 'Lights that have it play this effect', ceNoBase: 'None, I will choose for each light',
    ceFb: 'Lights without it', ceFbS: 'Lights without the base effect, or used for light only', ceLights: 'Light by light', ceLightsS: 'Change any light if you like',
    save: 'Save', del: 'Delete', bri: 'Brightness', ceNameErr: 'Type a name', ceSaved: '“{x}” saved', ceHint: 'It shows in the card under “My effects”.',
    m_auto: 'Automatic', m_fx: 'Effect', m_color: 'Colour', m_white: 'White', m_off: 'Turn off', m_skip: 'Leave as is', supBase: 'plays the base effect', noBase: 'no base effect', autoIs: 'automatic: {x}',
    upd: 'A new version is installed ({v}). Reload the page.', reload: 'Reload',
    sVer: 'Version and updates', updT: 'Version', updInst: 'Installed: v{v}', updCheck: 'Check for updates', updChecking: 'Checking…', updOk: 'up to date', updAt: 'checked {t}', updNew: 'v{v} is ready', updNotes: 'What’s new', updGo: 'Update', updGh: 'Open on GitHub', updIng: 'Downloading v{v}…', updDone: 'v{v} is downloaded. It takes effect when Home Assistant restarts.', updRestart: 'Restart', updAsk: 'Restart Home Assistant? Light control and automations stop for a minute or two.', updYes: 'Yes, restart', updRest: 'Restarting… The page reloads by itself when it is back.', updErr: 'Could not check: {e}', updAgain: 'Check again', updNoHacs: 'Not installed with HACS, so it cannot be installed from here',
    pvB: 'Preview', pvT: 'While it is on, the effect you click plays on the lights right away', pvOn: 'Preview on', pvWhere: 'the effect you click plays on the lights of:', pvNow: 'now: {x}', pvBack: 'Put lights back', pvKeep: 'Keep it', pvBackT: 'The lights are back as they were before the preview', pvKeepT: 'The last effect keeps playing', pvErr: 'Preview did not work: {e}', pvNoRoom: 'Pick a room for the preview',
    fade: 'Transition', fadeS: 'Colour, white, brightness and turning off change softly (lights that support it)', fadeNo: 'None',
    showRecent: 'Recently used tab', showRecentS: 'Effects played lately in the room, next to Favorites',
    sBackup: 'Backup', bkDown: 'Download backup', bkDownS: 'Rooms, tabs, favorites, your own effects, settings and icons in one file',
    bkUp: 'Restore a backup', bkUpS: 'Pick a backup file; it replaces the current setup', bkQ: 'Restore this backup?',
    bkW: 'Backup from {d}. The current rooms, tabs, favorites, your own effects, settings and icons are replaced by it.',
    bkYes: 'Restore', bkOk: 'Backup restored', bkErr: 'This file is not a Lemur backup', bkSaved: 'Backup downloaded', bkBusy: 'Preparing the backup…',
    fillT: 'Fill in the missing lights', fillHead: '{x} · fill in the missing lights', fillS: 'What should lights without this effect do? What you pick comes on together with the effect, so it covers the whole room.',
    fillSup: 'Lights with it', fillMiss: 'Lights without it', fillAll: 'For all', fillAllS: 'Every light you do not set on its own does this',
    fillNone: 'Every light at home has this effect; nothing to fill in.', fillSaved: '“{x}” filled in', fillDel: 'Remove filling in', fillDeleted: 'Filling in removed for “{x}”',
    m_def: 'What “For all” says', fillOn: 'Filled in', fillTag: 'filled in', fillNoEff: 'has it but is not used for effects'
  }
};
const PI = {
  home: '<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/>',
  homes: '<path d="M2 11l7-5.5 7 5.5"/><path d="M4 10v9h10v-9"/><path d="M13 6.5l3-2.5 6 5v10h-5"/>',
  inbox: '<path d="M3 13l3-8h12l3 8v6H3z"/><path d="M3 13h5l1 2h6l1-2h5"/>',
  sparkles: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/>',
  cog: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1L7 17M17 7l2.1-2.1"/>',
  eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  eyeoff: '<path d="M3 3l18 18"/><path d="M10.6 5.1A10 10 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.2 4.2M6.6 6.6C3.8 8.4 2 12 2 12s3.5 7 10 7c1.8 0 3.4-.5 4.7-1.3"/>',
  bulb: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3z"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  star: '<path fill="currentColor" d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
  more: '<circle cx="5" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="19" cy="12" r="1.5" fill="currentColor"/>',
  reset: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>',
  undo: '<path d="M9 14L4 9l5-5"/><path d="M4 9h11a5 5 0 0 1 0 10h-3"/>',
  copy: '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a1 1 0 0 1 1-1h10"/>',
  pen: '<path d="M4 20h4L19 9l-4-4L4 16z"/>',
  lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
  drag: '<path d="M12 3v18M3 12h18M12 3l-3 3M12 3l3 3M12 21l-3-3M12 21l3-3M3 12l3-3M3 12l3 3M21 12l-3-3M21 12l-3 3"/>',
  upload: '<path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3"/>',
  script: '<path d="M8 4h9a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H7"/><path d="M8 4a2 2 0 0 0-2 2v12a2 2 0 0 1-2 2"/><path d="M10 9h6M10 13h6"/>',
  wand: '<path d="M4 20L15 9"/><path d="M15 4v3M19 8h-3M18.5 4.5l-2 2"/>',
  download: '<path d="M12 4v12M7 11l5 5 5-5"/><path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3"/>',
  play: '<path fill="currentColor" stroke="none" d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z"/>'
};
// room icons offered in the panel (any mdi: name can be typed too)
const ROOM_ICONS = ['mdi:sofa', 'mdi:sofa-outline', 'mdi:bed', 'mdi:bed-king', 'mdi:bed-single', 'mdi:desk', 'mdi:laptop', 'mdi:monitor', 'mdi:silverware-fork-knife', 'mdi:stove', 'mdi:fridge', 'mdi:coffee', 'mdi:shower', 'mdi:bathtub', 'mdi:toilet', 'mdi:television', 'mdi:gamepad-variant', 'mdi:teddy-bear', 'mdi:baby-carriage', 'mdi:wardrobe', 'mdi:washing-machine', 'mdi:garage', 'mdi:car', 'mdi:tree', 'mdi:flower', 'mdi:balcony', 'mdi:door', 'mdi:stairs', 'mdi:home', 'mdi:home-floor-1', 'mdi:home-floor-2', 'mdi:home-roof', 'mdi:dumbbell', 'mdi:book-open-variant', 'mdi:music', 'mdi:lamp', 'mdi:ceiling-light', 'mdi:led-strip-variant', 'mdi:lightbulb-group', 'mdi:fireplace', 'mdi:pool', 'mdi:paw'];
const rgbHex = a => '#' + (Array.isArray(a) ? a : [255, 140, 60]).map(v => Math.max(0, Math.min(255, +v || 0)).toString(16).padStart(2, '0')).join('');
const hsl2rgb = (h, s, l) => { s /= 100; l /= 100; const k = n => (n + h / 30) % 12, a = s * Math.min(l, 1 - l), f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1))); return [f(0), f(8), f(4)].map(v => Math.round(v * 255)); };
const hexRgb = h => [1, 3, 5].map(i => parseInt(String(h).slice(i, i + 2), 16) || 0);
const slug = s => String(s).toLocaleLowerCase('tr').replace(/ç/g, 'c').replace(/ğ/g, 'g').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ş/g, 's').replace(/ü/g, 'u').normalize('NFKD').replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '') || 'x';
const pi = (n, c = 's') => `<svg class="${c}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${PI[n]}</svg>`;
// what a dragged item may be dropped on
const DND_ACCEPT = { light: ['room', 'strip'], fx: ['tab'], tab: ['tab', 'room'], room: ['room'], cl: ['cz'] };
const newId = () => 't' + Date.now().toString(36) + Math.floor(Math.random() * 1296).toString(36);
const clone = o => JSON.parse(JSON.stringify(o == null ? null : o));

class LemurLightEffectsPanel extends HTMLElement {
  constructor() {
    super();
    this._room = null; this._tab = {}; this._pick = new Set(); this._last = null; this._view = 'edit'; this._undo = []; this._q = '';
    // the server echoes every save back; only re-render when something really changed, and never under an open popover or a drag
    this._onStore = () => { if (this._dataSig() !== this._lastData) this._later(); };
    this._pm = e => this._dmove(e); this._pu = () => this._dup();
    this._tm = e => { if (this._dd && this._dd.on) e.preventDefault(); };
    this._kd = e => this._key(e);
  }
  _fillFromUrl() {
    let k = null, r = null; try { const q = new URLSearchParams(location.search); k = q.get('fill'); r = q.get('room'); } catch (e) {}
    if (!k || !this._hass) return;
    try { history.replaceState(history.state, '', location.pathname); } catch (e) {}
    this._fillOpen(k, r);
  }
  connectedCallback() {
    this._lc = this._lc || (() => setTimeout(() => this._fillFromUrl(), 50)); window.addEventListener('location-changed', this._lc);
    setTimeout(() => this._fillFromUrl(), 200);
    STORE.L.add(this._onStore);
    window.addEventListener('pointermove', this._pm, { passive: false });
    window.addEventListener('pointerup', this._pu); window.addEventListener('pointercancel', this._pu);
    window.addEventListener('touchmove', this._tm, { passive: false });
    window.addEventListener('keydown', this._kd);
    this._render();
  }
  disconnectedCallback() {
    if (this._pv) this._pvEnd(true, true);
    window.removeEventListener('location-changed', this._lc);
    STORE.L.delete(this._onStore);
    window.removeEventListener('pointermove', this._pm); window.removeEventListener('pointerup', this._pu);
    window.removeEventListener('pointercancel', this._pu); window.removeEventListener('touchmove', this._tm);
    window.removeEventListener('keydown', this._kd);
  }
  set narrow(v) { const c = this._narrow !== v; this._narrow = v; if (this._mb) this._mb.narrow = v; if (c && this._hass) this._render(); }
  set panel(v) { this._panel = v; }
  set route(v) { this._route = v; }
  set hass(h) {
    const first = !this._hass; this._hass = h; STORE.attach(h);
    if (this._mb) this._mb.hass = h;
    const sig = this._sig();
    if (first) this._render(); else if (sig !== this._lastSig) this._later();
  }
  _dataSig() { const d = STORE.d; return JSON.stringify([d.settings, d.tabs, d.icons, d.favorites, d.hidden, STORE.mode, ICON3_OK]); }
  _later() {
    if (this._dd || this._ce || (this.shadowRoot && this.shadowRoot.querySelector('.pop'))) { this._pend = true; return; }
    this._render();
  }
  _l() { const s = this._set().language; if (s && I18N[s]) return s; const h = this._hass; return pickLang((h && ((h.locale && h.locale.language) || h.language)) || 'en'); }
  _t(k, v) { const T = P_TXT[this._l()]; let s = T[k] != null ? T[k] : P_TXT.en[k]; if (typeof s === 'string' && v) for (const x in v) s = s.split('{' + x + '}').join(v[x]); return s; }
  _hi(icon, fb) { return customElements.get('ha-icon') && icon ? `<ha-icon icon="${esc(icon)}"></ha-icon>` : fb; }
  _set() { const s = STORE.d.settings; return s && typeof s === 'object' ? s : {}; }
  _sig() {
    const H = this._hass; if (!H) return '';
    let s = (H.entities ? Object.keys(H.entities).length : 0) + '|' + (H.areas ? Object.keys(H.areas).length : 0) + '|';
    for (const id in H.states) if (id.startsWith('light.')) { const x = H.states[id], l = x.attributes.effect_list; s += id + x.state + (l ? l.length : 0) + ','; }
    return s;
  }

  // ---- undo: every change keeps a copy of settings and tabs from before ----
  _snap() { this._undo.push({ settings: clone(this._set()), tabs: clone(STORE.d.tabs || {}) }); if (this._undo.length > 40) this._undo.shift(); }
  _undoIt() {
    const u = this._undo.pop(); if (!u) return;
    STORE.set('settings', u.settings); STORE.set('tabs', u.tabs); this._pick.clear(); this._toast(this._t('undone'), false);
  }
  _save(patch, msg) {
    this._snap();
    const n = Object.assign({}, this._set(), patch);
    Object.keys(n).forEach(k => { if (n[k] == null) delete n[k]; });
    STORE.set('settings', n); if (msg !== false) this._toast(msg || this._t('saved'));
  }

  // ---- lights and rooms ----
  _minFx() { return +(this._set().min_effects || 3); }
  _fxOn(id) { return fxOn(this._set(), id, this._fxCount(id)); }
  _fxCount(id) { const l = this._hass.states[id] && this._hass.states[id].attributes.effect_list; return Array.isArray(l) ? parseList(l).m.size : 0; }
  _name(id) { const s = this._hass.states[id]; return (s && s.attributes.friendly_name) || id; }
  _roomName(id) {
    if (id === '_all') return this._t('allHome'); if (id === '_none') return this._t('none'); if (id === '_hidden') return this._t('hiddenRoom');
    const a = (this._hass.areas || {})[id]; return a ? a.name : id;
  }
  _model() {
    const H = this._hass, A = H.areas || {}, S = this._set(), lang = this._l(), by = {}, hidden = [];
    for (const id of lightPool(H, !!S.include_groups)) {
      const p = lightPlace(H, S, id);
      if (!p.room) hidden.push({ id, why: p.why }); else (by[p.room] = by[p.room] || []).push(id);
    }
    const cmp = (a, b) => this._name(a).localeCompare(this._name(b), lang);
    Object.values(by).forEach(l => l.sort(cmp)); hidden.sort((a, b) => cmp(a.id, b.id));
    const ok = a => a === '_all' || (a === '_none' ? !!by._none : !!by[a] || (this._extra && this._extra === a && !!A[a]));
    const pref = (S.order || []).filter(ok);
    const rest = Object.keys(by).filter(a => a !== '_none' && !pref.includes(a)).sort((a, b) => A[a].name.localeCompare(A[b].name, lang));
    let order = [...pref, ...rest];
    if (by._none && !order.includes('_none')) order.push('_none');
    if (this._extra && A[this._extra] && !order.includes(this._extra)) order.push(this._extra);
    if (!order.includes('_all')) order.unshift('_all');
    const real = order.filter(a => a !== '_all');
    if (real.length < 2) order = real;
    const why = {}; hidden.forEach(h => { why[h.id] = h.why; });
    const empty = Object.values(A).filter(a => !by[a.area_id] && a.area_id !== this._extra).sort((a, b) => a.name.localeCompare(b.name, lang));
    return { by, hidden: hidden.map(h => h.id), why, order, empty };
  }
  _lightsOf(M, rid) {
    if (rid === '_all') return M.order.filter(a => a !== '_all').flatMap(a => M.by[a] || []);
    if (rid === '_hidden') return M.hidden;
    return M.by[rid] || [];
  }
  _roomOf(M, id) { if (M.hidden.includes(id)) return '_hidden'; return Object.keys(M.by).find(r => M.by[r].includes(id)) || null; }
  _homeOf(id) { return lightPlace(this._hass, { layout: {}, exclude: [], include: [] }, id).room || '_none'; }

  // effects of a room: key → { k, names: { light: name }, c, rep }
  _effects(L) {
    const U = new Map();
    for (const id of L) {
      if (!this._fxOn(id)) continue;
      for (const [k, n] of parseList(this._hass.states[id].attributes.effect_list).m) {
        let u = U.get(k); if (!u) { u = { k, names: {}, c: 0, rep: n }; U.set(k, u); }
        u.names[id] = n; u.c++; if (GOVL.has(n) && !GOVL.has(u.rep)) u.rep = n;
      }
    }
    customUnits(this._set(), this._hass, L, id => this._fxOn(id)).forEach(u => U.set(u.k, u));
    return U;
  }
  _grp(U) { return k => grpOfKey(k, (U.get(k) || { rep: k }).rep); }
  _resolve(rid, U) { return resolveTabs(roomCfg(this._set(), rid), [...U.keys()], this._grp(U)); }
  _label(u) { if (u.label) return u.label; const i = fxInfo(u.rep); return this._l() === 'tr' && i.tr ? i.tr : pretty(u.rep); }
  _ico(u, px) { return fxArt(u, px, this._set()); }
  _tabName(t) { return t.name || (t.fav ? this._t('fav') : GNAME[this._l()][t.auto] || t.id); }
  _tabIcon(t) { return tabArt(t); }
  _lightIcon(rid) { return (roomCfg(this._set(), rid || this._room) || {}).light_icon || ''; }
  _lightDot(id) {
    const s = this._hass.states[id], a = (s && s.attributes) || {}, on = s && s.state === 'on';
    const bg = on && a.rgb_color ? `rgb(${a.rgb_color.join(',')})` : on && a.color_mode === 'color_temp' ? 'linear-gradient(140deg,#FFD9A8,#FFB86E)' : grad([hashHue(id), (hashHue(id) + 50) % 360], 70, 62, '135deg');
    return `<span class="dot ${on ? '' : 'off'}" style="background:${bg}">${pi('bulb')}</span>`;
  }
  _toast(x, undo = true) {
    this._tst = { x, undo, until: Date.now() + 4200 }; this._showToast();
  }
  _showToast() {
    const el = this.shadowRoot && this.shadowRoot.querySelector('.toast'), T = this._tst; if (!el || !T) return;
    const left = T.until - Date.now(); if (left <= 0) { this._tst = null; return; }
    el.querySelector('span').textContent = T.x; el.querySelector('button').hidden = !T.undo || !this._undo.length;
    el.classList.add('show'); clearTimeout(this._tt); this._tt = setTimeout(() => { const e2 = this.shadowRoot.querySelector('.toast'); if (e2) e2.classList.remove('show'); this._tst = null; }, left);
  }

  // ---- edits of a room's tabs ----
  _edit(rid, fn, msg) {
    const M = this._M, U = this._effects(this._lightsOf(M, rid));
    const cfg = materialize(this._set(), rid, [...U.keys()], this._grp(U));
    cfg.tabs.forEach(t => { t.fx = t.fx || []; }); cfg.hid = cfg.hid || [];
    if (fn(cfg, U) === false) return;
    this._snap(); saveRoomCfg(rid, cfg); this._pick.clear();
    if (msg) this._toast(msg);
  }
  _nameFx(U, ids) { return ids.length > 1 ? this._t('nFx', { n: ids.length }) : this._label(U.get(ids[0]) || { rep: ids[0] }); }
  _moveFx(ids, to, before, src) {
    const rid = this._room;
    this._edit(rid, (cfg, U) => {
      const fav = cfg.tabs.find(t => t.fav), ins = (arr, keys) => { const L = arr.filter(k => !keys.includes(k)); let i = before ? L.indexOf(before) : -1; if (i < 0) i = L.length; L.splice(i, 0, ...keys); return L; };
      if (to === '_hid') {
        cfg.tabs.forEach(t => { t.fx = t.fx.filter(k => !ids.includes(k)); }); cfg.hid = [...cfg.hid.filter(k => !ids.includes(k)), ...ids];
        this._msg = this._t('hiddenFx', { x: this._nameFx(U, ids) }); return;
      }
      const t = cfg.tabs.find(x => x.id === to); if (!t) return false;
      cfg.hid = cfg.hid.filter(k => !ids.includes(k));
      if (t.fav) {
        t.fx = ins(t.fx, ids);
        // an effect that was hidden needs a tab of its own too
        const grp = this._grp(U);
        ids.forEach(k => { if (!cfg.tabs.some(x => !x.fav && x.fx.includes(k))) { const g = cfg.tabs.find(x => !x.fav && x.auto === grp(k)) || cfg.tabs.find(x => !x.fav); if (g) g.fx.push(k); } });
      } else {
        cfg.tabs.forEach(x => { if (!x.fav) x.fx = x.fx.filter(k => !ids.includes(k)); });
        if (src && fav && src === fav.id) fav.fx = fav.fx.filter(k => !ids.includes(k));
        t.fx = ins(t.fx, ids);
      }
      this._msg = this._t('moved', { x: this._nameFx(U, ids), r: this._tabName(t) });
    });
    if (this._msg) { this._toast(this._msg); this._msg = null; }
  }
  _moveLights(ids, to) {
    const M = this._M; ids = ids.filter(id => this._roomOf(M, id) !== to); if (!ids.length || to === '_all') return this._render();
    const S = this._set(), L = Object.assign({}, S.layout || {}), X = new Set(S.exclude || []), I = new Set(S.include || []);
    for (const id of ids) {
      X.delete(id); I.delete(id); delete L[id];
      const def = lightPlace(this._hass, { layout: {}, exclude: [...X], include: [...I] }, id).room || '_hidden';
      if (def !== to) L[id] = to;
    }
    this._pick.clear();
    if (this._extra === to) this._extra = null;
    this._save({ layout: L, exclude: X.size ? [...X] : null, include: I.size ? [...I] : null, layout_v2: true }, this._t('moved', { x: ids.length > 1 ? this._t('nLights', { n: ids.length }) : this._name(ids[0]), r: this._roomName(to) }));
  }
  _copyTab(src, rid, U) {
    // src is a resolved tab of another room; only the effects this room has come along
    this._edit(rid, (cfg, U2) => {
      const add = src.fx.filter(k => U2.has(k));
      if (src.fav) { let f = cfg.tabs.find(t => t.fav); if (!f) { f = { id: 'fav', fav: 1, fx: [] }; cfg.tabs.unshift(f); } add.forEach(k => { if (!f.fx.includes(k)) f.fx.push(k); }); cfg.hid = cfg.hid.filter(k => !add.includes(k)); return; }
      const nm = this._tabName(src).toLocaleLowerCase(this._l());
      let t = cfg.tabs.find(x => !x.fav && this._tabName(x).toLocaleLowerCase(this._l()) === nm);
      cfg.tabs.forEach(x => { if (!x.fav && x !== t) x.fx = x.fx.filter(k => !add.includes(k)); });
      cfg.hid = cfg.hid.filter(k => !add.includes(k));
      if (!t) { t = { id: newId(), fx: [] }; ['name', 'icon', 'auto'].forEach(f => { if (src[f] != null) t[f] = src[f]; }); if (!t.name) t.name = this._tabName(src); cfg.tabs.push(t); }
      add.forEach(k => { if (!t.fx.includes(k)) t.fx.push(k); });
      cfg.tabs = cfg.tabs.filter(x => x.fav || x.fx.length || x === t);
      this._newTab = t.id;
    });
  }
  _drop(type, ids, kind, to, before, src) {
    const M = this._M;
    if (type === 'light') return this._moveLights(ids, kind === 'strip' ? (to === '_all' ? null : to) || this._room : to);
    if (type === 'fx') {
      // an own effect can only sit in a tab of a room that has one of its lights
      const ok = ids.filter(k => this._U && this._U.has(k));
      if (!ok.length) { this._render(); return this._toast(this._t('notHere', { r: this._roomName(this._room) }), false); }
      return this._moveFx(ok, to, before, src);
    }
    if (type === 'cl') return this._ceMove(ids, to === 'in');
    if (type === 'tab' && kind === 'tab') {
      if (to === '_hid' || to === ids[0]) return this._render();
      return this._edit(this._room, cfg => { const T = cfg.tabs, a = T.findIndex(t => t.id === ids[0]); if (a < 0) return false; const [m] = T.splice(a, 1); let i = T.findIndex(t => t.id === to); if (i < 0) i = T.length; T.splice(i, 0, m); }, this._t('order'));
    }
    if (type === 'tab' && kind === 'room') {
      if (to === this._room || to === '_hidden') return this._render();
      const U = this._effects(this._lightsOf(M, this._room)), src = this._resolve(this._room, U).tabs.find(t => t.id === ids[0]); if (!src) return;
      this._copyTab(src, to); return this._toast(this._t('tabCopied', { t: this._tabName(src), r: this._roomName(to) }));
    }
    if (type === 'room' && kind === 'room') {
      if (to === ids[0] || to === '_hidden') return this._render();
      const O = M.order.filter(a => a !== ids[0]); let i = O.indexOf(to); if (i < 0) i = O.length; O.splice(i, 0, ids[0]);
      return this._save({ order: O }, this._t('order'));
    }
  }
  _roomVis(rid) {
    const S = this._set(), H = new Set(S.hidden_areas || []);
    if (rid === '_all') {
      const on = allHomeOn(S);
      if (on) H.add('_all'); else H.delete('_all');
      return this._save({ hidden_areas: [...H], all_home: null }, this._t(on ? 'allOffT' : 'allOnT'));
    }
    const was = H.has(rid); was ? H.delete(rid) : H.add(rid);
    this._save({ hidden_areas: [...H] }, this._t(was ? 'roomOnT' : 'roomOffT'));
  }

  // ---- preview: tapped effects play on the room's lights; the integration remembers and restores them ----
  _pvWs(m) { return this._hass.connection.sendMessagePromise(Object.assign({ type: 'lemur_light_effects/preview' }, m)); }
  async _pvRoom(room) {
    if (!room || room === '_hidden') { if (this._pv) await this._pvEnd(true); else this._toast(this._t('pvNoRoom'), false); return; }
    const was = this._pv;
    this._pv = { room, key: null }; this._render();
    try { await this._pvWs({ action: 'start', room }); }
    catch (e) { this._pv = was && was.room !== room ? null : was; this._render(); this._toast(this._t('pvErr', { e: (e && e.message) || e }), false); }
  }
  _pvPlay(k) {
    if (!this._pv) return;
    this._pv.key = k; this._render();
    // quick clicks in a row: only the last one goes to the lights
    clearTimeout(this._pvT);
    this._pvT = setTimeout(async () => {
      const pv = this._pv; if (!pv || pv.key !== k) return;
      try { await this._pvWs({ action: 'play', room: pv.room, effect: k }); }
      catch (e) { this._toast(this._t('pvErr', { e: (e && e.message) || e }), false); }
    }, 250);
  }
  async _pvEnd(restore, quiet) {
    if (!this._pv) return;
    clearTimeout(this._pvT); this._pv = null;
    if (!quiet) this._render();
    try { await this._pvWs({ action: 'end', restore: !!restore }); if (!quiet) this._toast(this._t(restore ? 'pvBackT' : 'pvKeepT'), false); }
    catch (e) { if (!quiet) this._toast(this._t('pvErr', { e: (e && e.message) || e }), false); }
  }

  // ---- render ----
  _render() {
    if (!this._hass) return;
    if (!this.shadowRoot) this.attachShadow({ mode: 'open' });
    const R = this.shadowRoot, t = (k, v) => this._t(k, v), S = this._set();
    this._lastSig = this._sig(); this._lastData = this._dataSig(); this._pend = false;
    const keep = [...R.querySelectorAll('.grid,.tscroll,.rooms')].map(el => [el.scrollTop, el.scrollLeft]), od = R.querySelector('.dlg'), dlgTop = od ? od.scrollTop : 0, dlgView = this._dlgView;
    const ae = R.activeElement, af = ae && ae.id, ss = ae && ae.selectionStart;
    const M = this._model(); this._M = M;
    const ids = [...M.order, '_hidden'];
    if (!ids.includes(this._room)) this._room = M.order.find(a => a !== '_all') || M.order[0] || '_hidden';
    const rid = this._room, hidR = rid === '_hidden', offR = new Set(S.hidden_areas || []);
    const L = this._lightsOf(M, rid), U = hidR ? new Map() : this._effects(L), RES = hidR ? { tabs: [], hid: [] } : this._resolve(rid, U);
    this._U = U; this._RES = RES;
    let tid = this._tab[rid];
    if (tid !== '_light' && tid !== '_hid' && tid !== '_allfx' && tid !== '_mine' && !RES.tabs.some(x => x.id === tid)) tid = this._tab[rid] = U.size ? '_allfx' : (RES.tabs[0] || { id: '_light' }).id;
    if (this._newTab && RES.tabs.some(x => x.id === this._newTab)) { tid = this._tab[rid] = this._newTab; }
    this._newTab = null;
    const isOff = id => id === '_all' ? !allHomeOn(S) : offR.has(id);

    // rooms + attached light strip
    const rb = id => {
      const ord = id !== '_hidden', RI = S.room_icons || {}, ic = id === '_hidden' ? pi('eyeoff', 's20') : RI[id] ? this._hi(RI[id], pi('home', 's20')) : id === '_all' ? pi('homes', 's20') : id === '_none' ? pi('inbox', 's20') : this._hi(((this._hass.areas || {})[id] || {}).icon, pi('home', 's20'));
      const n = id === '_all' ? null : this._lightsOf(M, id).length;
      return `<div class="rb ${rid === id ? 'on' : ''} ${isOff(id) ? 'off' : ''} ${id === '_hidden' ? 'hid' : ''}" data-room="${esc(id)}" ${ord ? `data-d="room|${esc(id)}" data-label="${esc(this._roomName(id))}"` : ''} data-z="room|${esc(id)}">
        ${ic}${esc(this._roomName(id))}${n != null ? `<em>${n}</em>` : isOff(id) ? `<em>${esc(t('offShort'))}</em>` : ''}</div>`;
    };
    const rooms = `<div class="rooms">${M.order.map(rb).join('')}<button class="rb add" data-addroom title="${esc(t('addRoomT'))}">${pi('plus', 's16')}${esc(t('addRoom'))}</button><span class="sp"></span>${rb('_hidden')}</div>`;
    const chip = id => {
      const home = this._homeOf(id), cur = this._roomOf(M, id), mv = cur !== '_hidden' && home !== cur && !(home === '_none' && cur === '_none'), n = this._fxCount(id);
      const on = this._fxOn(id), sub = cur === '_hidden' ? (t('why')[M.why[id]] || '') : on ? t('fxN', { n }) : t('lOnly');
      const out = cur === '_hidden' ? t('lBack', { r: this._roomName(home) }) : mv ? t('lBack', { r: this._roomName(home) }) : t('lHide');
      return `<div class="lt ${mv ? 'mv' : ''} ${on || cur === '_hidden' ? '' : 'lo'}" data-d="light|${esc(id)}" data-lmenu="${esc(id)}" data-label="${esc(this._name(id))}" title="${esc(id)}">${this._lightDot(id)}<span class="tx"><b>${esc(this._name(id))}</b><small>${esc(sub)}</small></span>
        <button class="lx" data-lout="${esc(id)}" title="${esc(out)}" aria-label="${esc(out)}">${pi(cur === '_hidden' || mv ? 'undo' : 'x', 's14')}</button></div>`;
    };
    const first = M.order[0] === rid;
    const head = rid === '_all' ? t('allLights') : hidR ? t('hiddenLights') : t('lightsOf', { r: this._roomName(rid) });
    let stripBody;
    if (rid === '_all') stripBody = `<span class="lnone">${esc(isOff('_all') ? t('allOff') : t('allUses'))}</span><span class="grow"></span><button class="offb ${isOff('_all') ? 'is' : ''}" data-roff>${pi(isOff('_all') ? 'eye' : 'eyeoff', 's16')}${esc(isOff('_all') ? t('allOnB') : t('allOffB'))}</button>`;
    else stripBody = (L.map(chip).join('') || `<span class="lnone">${esc(hidR ? t('noHidden') : t('noLight'))}</span>`) + (hidR ? '' : `<button class="addl" data-addlight>${pi('plus', 's16')}${esc(t('addLight'))}</button>`);
    const strip = `<div class="strip ${first ? 'first' : ''} ${hidR ? 'hidl last' : ''}" data-z="strip|${esc(rid)}"><div class="lhd"><span class="ti">${pi(hidR ? 'eyeoff' : 'bulb', 's16')}</span>${esc(head)}<em>${hidR || rid === '_all' ? L.length : esc(t('fxCnt', { n: L.length, f: L.filter(id => this._fxOn(id)).length }))}</em></div>${stripBody}</div>`;

    // tabs column
    const setb = `<div class="setb"><button data-settings><span class="si">${pi('cog', 's20')}</span><span class="at"><b>${esc(t('settings'))}</b><small>${esc(t('settingsS'))}</small></span></button></div>`;
    let body;
    if (hidR) body = `<div class="lcol"><div class="tabs"></div>${setb}</div><div class="fxp"><div class="grid"><div class="emp">${pi('eyeoff')}<span>${esc(t('hiddenRoomE'))}</span></div></div></div>`;
    else {
      const tb = x => `<div class="tb ${tid === x.id ? 'on' : ''}" data-tabsel="${esc(x.id)}" data-d="tab|${esc(x.id)}" data-label="${esc(this._tabName(x))}" data-z="tab|${esc(x.id)}">
        <span class="ti">${this._tabIcon(x)}</span><b>${esc(this._tabName(x))}</b><em>${x.fx.length}</em><button class="ed" data-edtab="${esc(x.id)}" title="${esc(t('edit'))}">${pi('pen', 's14')}</button></div>`;
      const tabs = `<div class="tabs">
        <div class="allb ${tid === '_allfx' ? 'on' : ''}" data-tabsel="_allfx"><span class="ai">${pi('grid', 's20')}</span><span class="at"><b>${esc(t('allFx'))}</b><small>${esc(t('allFxS', { n: U.size }))}</small></span></div>
        <div class="mineb ${tid === '_mine' ? 'on' : ''}" data-tabsel="_mine"><span class="ai">${pi('wand', 's20')}</span><span class="at"><b>${esc(t('mineTab'))}</b><small>${esc(t('mineTabS', { n: customList(S).length }))}</small></span></div>
        <div class="tsep"></div>
        <div class="tscroll"><div class="tb lock ${tid === '_light' ? 'on' : ''}" data-tabsel="_light"><span class="ti">${tabArt({ icon: this._lightIcon(rid) }, 'light')}</span><b>${esc(t('light'))}</b><button class="ed" data-edtab="_light" title="${esc(t('edit'))}">${pi('pen', 's14')}</button><span class="lk">${pi('lock', 's14')}</span></div>
        ${RES.tabs.map(tb).join('')}<button class="addt" data-addtab>${pi('plus', 's16')}${esc(t('addTab'))}</button></div>
        <div class="tb hidt ${tid === '_hid' ? 'on' : ''}" data-tabsel="_hid" data-z="tab|_hid"><span class="ti">${pi('eyeoff')}</span><b>${esc(t('hid'))}</b><em>${RES.hid.length}</em></div></div>`;
      const favT = RES.tabs.find(x => x.fav), favS = new Set(favT ? favT.fx : []);
      const FILL = S.fill || {}, pvK = this._pv && this._pv.room === rid ? this._pv.key : null;
      const tileH = (k, o) => {
        const u = U.get(k); if (!u) return '';
        if (FILL[k] && !(o && o.where)) o = Object.assign({}, o, { where: `<small class="where fl">${pi('sparkles')}${esc(t('fillTag'))}</small>` });
        return `<div class="fx ${this._pick.has(k) ? 'sel' : ''} ${o && o.hd ? 'hd' : ''} ${pvK === k ? 'pvon' : ''}" style="--l:${grad(fxInfo(u.rep).hues, 80, 60, '90deg')}" data-d="fx|${esc(k)}" data-label="${esc(this._label(u))}" ${o && o.n ? `data-n="${esc(o.n)}"` : ''}>
          ${favS.has(k) && !(o && o.inFav) ? `<span class="st">${pi('star')}</span>` : ''}<span class="fi">${this._ico(u, 96)}</span><span class="nm">${esc(this._label(u))}</span>${o && o.where || ''}
          <button class="fm" data-fxm="${esc(k)}" title="${esc(t('fxMenu'))}">${pi('more', 's16')}</button></div>`;
      };
      let grid;
      if (this._fill) grid = this._fillHtml();
      else if (tid === '_mine') grid = this._mineHtml();
      else if (!L.length && rid !== '_all') grid = `<div class="grid"><div class="emp">${pi('bulb')}<span>${esc(t('noLightE'))}</span><button class="addl" data-addlight>${pi('plus', 's16')}${esc(t('addLight'))}</button></div></div>`;
      else if (tid === '_light') grid = `<div class="fxh"><b>${esc(t('light'))}</b></div><div class="grid"><div class="emp">${pi('bulb')}<span>${esc(t('lightE'))}</span></div></div>`;
      else if (!U.size) grid = `<div class="grid"><div class="emp">${pi('sparkles')}<span>${esc(t('noFxRoom'))}</span></div></div>`;
      else if (tid === '_allfx') {
        const where = {}; RES.tabs.forEach(x => { if (!x.fav) x.fx.forEach(k => { where[k] = x; }); });
        const lang = this._l(), all = [...U.values()].sort((a, b) => this._label(a).localeCompare(this._label(b), lang));
        grid = `<div class="fxh"><b>${esc(t('allFx'))}</b><em>${U.size}</em><span class="grow"></span><label class="fsearch">${pi('search', 's16')}<input id="aq" placeholder="${esc(t('search'))}" value="${esc(this._q)}" autocomplete="off"></label></div>
          <div class="grid" id="allg">${all.map(u => { const w = where[u.k], n = (this._label(u) + ' ' + Object.values(u.names).join(' ')).toLocaleLowerCase(lang);
            return tileH(u.k, { hd: !w, n, where: `<small class="where ${w ? '' : 'h'}"><i>${w ? this._tabIcon(w) : pi('eyeoff')}</i>${esc(w ? this._tabName(w) : t('hid'))}</small>` }); }).join('')}</div>`;
      } else if (tid === '_hid') grid = `<div class="fxh"><b>${esc(t('hid'))}</b><em>${RES.hid.length}</em></div><div class="grid">${RES.hid.map(k => tileH(k, { hd: true })).join('') || `<div class="emp">${pi('eyeoff')}<span>${esc(t('noHidFx'))}</span></div>`}</div>`;
      else {
        const x = RES.tabs.find(q => q.id === tid);
        const hb = x.fav && x.fx.length ? `<span class="grow"></span><button class="btn sm" data-scriptfav>${pi('script', 's16')}${esc(t('scriptFav'))}</button>` : x.auto === 'mine' ? `<span class="grow"></span><button class="btn sm" data-cenew>${pi('plus', 's16')}${esc(t('mineNew'))}</button>` : '';
        grid = `<div class="fxh"><span class="hi">${this._tabIcon(x)}</span><b>${esc(this._tabName(x))}</b><em>${x.fx.length}</em>${hb}</div>
          <div class="grid" data-z="tab|${esc(x.id)}" data-ins data-src="${esc(x.id)}">${x.fx.map(k => tileH(k, { inFav: x.fav })).join('') || `<div class="emp">${pi('drag')}<span>${esc(t('dropHere'))}</span></div>`}</div>`;
      }
      body = `<div class="lcol">${tabs}${setb}</div><div class="fxp">${grid}</div>`;
    }
    const pv = this._pv, pvU = pv && pv.key ? U.get(pv.key) : null;
    const top = `<div class="top"><span class="mb"></span><span class="lg">${pi('sparkles', 's16')}</span><h1>${esc(t('title'))}</h1><span class="grow"></span>
      <button class="pvb ${pv ? 'on' : ''}" data-pv title="${esc(t('pvT'))}" aria-pressed="${pv ? 'true' : 'false'}">${pi('play', 's16')}<span class="l">${esc(t('pvB'))}</span><i class="sw2"><i></i></i></button>
      <button class="btn ic" data-undo title="${esc(t('undoK'))}" ${this._undo.length ? '' : 'disabled'}>${pi('undo', 's16')}</button>
      ${hidR ? '' : `<button class="btn ic" data-more title="${esc(t('more'))}">${pi('more', 's16')}</button>`}
      <button class="btn ic gear" data-settings title="${esc(t('settings'))}">${pi('cog', 's16')}</button></div>`;
    const pk = [...this._pick].filter(k => U.has(k));
    const selb = pk.length ? `<div class="selb"><b>${esc(t('selN', { n: pk.length }))}</b><span>${esc(t('selHint'))}</span><button class="btn ic" style="border:0;background:none" data-clr title="${esc(t('clear'))}">${pi('x', 's16')}</button></div>` : '';
    R.innerHTML = `<style>${PANEL_CSS}</style><div class="app ${this._narrow ? 'narrow' : ''} ${pv ? 'pv' : ''}">${top}
      ${pv ? `<div class="pvbar"><span class="pvd"></span><span class="tx"><b>${esc(t('pvOn'))}</b> · ${esc(t('pvWhere'))} <b>${esc(this._roomName(pv.room))}</b>${pvU ? ` · ${esc(t('pvNow', { x: this._label(pvU) }))}` : ''}</span><button class="btn sm" data-pvend="1">${pi('undo', 's16')}${esc(t('pvBack'))}</button><button class="btn sm" data-pvend="0">${esc(t('pvKeep'))}</button></div>` : ''}
      ${STORE.mode === 'local' ? `<div class="warn">${esc(t('local'))}</div>` : ''}${STORE.stale ? `<div class="warn upd"><span>${esc(t('upd', { v: STORE.stale }))}</span><button class="btn sm pri" data-reload>${esc(t('reload'))}</button></div>` : ''}
      <div class="rblock">${rooms}${strip}</div><div class="body">${body}</div>${selb}
      ${this._view === 'settings' ? this._settingsHtml() : this._view === 'reset' ? this._resetHtml() : this._view === 'restore' ? this._restoreHtml() : ''}
      <input type="file" id="icf" accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml" hidden><input type="file" id="bkf" accept="application/json,.json" hidden>
      <div class="toast"><span></span><button data-undo>${esc(t('undo'))}</button></div></div>`;
    if (customElements.get('ha-menu-button')) {
      this._mb = document.createElement('ha-menu-button'); this._mb.hass = this._hass; this._mb.narrow = this._narrow;
      R.querySelector('.mb').appendChild(this._mb);
    }
    [...R.querySelectorAll('.grid,.tscroll,.rooms')].forEach((el, i) => { if (keep[i]) { el.scrollTop = keep[i][0]; el.scrollLeft = keep[i][1]; } });
    if (af === 'aq') { const q = R.getElementById('aq'); if (q) { q.focus(); try { q.setSelectionRange(ss, ss); } catch (e) {} } }
    this._filterAll();
    const nd = R.querySelector('.dlg'); if (nd && dlgView === this._view) nd.scrollTop = dlgTop; this._dlgView = this._view;
    this._bind();
    if (this._tst) { const el = R.querySelector('.toast'); if (el) { el.style.transition = 'none'; this._showToast(); el.offsetWidth; el.style.transition = ''; } }
  }
  _filterAll() {
    const v = (this._q || '').toLocaleLowerCase(this._l()).trim();
    this.shadowRoot.querySelectorAll('#allg [data-n]').forEach(x => { x.style.display = !v || x.dataset.n.includes(v) ? '' : 'none'; });
  }
  _settingsHtml() {
    const t = (k, v) => this._t(k, v), S = this._set(), k = +(S.kelvin || 3200), b = +(S.brightness || 40), names = I18N[this._l()].kel, min = this._minFx(), lang = S.language || 'auto';
    // a row of choices bound to one setting; null means "default" and is not stored
    const seg = (key, cur, opts) => `<div class="segs">${opts.map(([v, n]) => `<button class="${String(cur) === String(v) ? 'on' : ''}" data-sv="${esc(key)}|${esc(v)}">${esc(n)}</button>`).join('')}</div>`;
    const sw = (key, def) => { const on = S[key] == null ? def : !!S[key]; return `<button class="swt ${on ? 'on' : ''}" data-sw="${esc(key)}|${def ? 1 : 0}" role="switch" aria-checked="${on}"></button>`; };
    const row = (title, sub, ctl) => `<div class="srow"><div class="t"><b>${esc(title)}</b>${sub ? `<small>${esc(sub)}</small>` : ''}</div>${ctl}</div>`;
    const mine = customList(S);
    return `<div class="modal" data-closeset><div class="dlg">
      <div class="dh"><span class="si">${pi('cog', 's20')}</span><b>${esc(t('settings'))}</b><span class="grow"></span><button class="btn ic" data-closeset title="${esc(t('close'))}">${pi('x', 's16')}</button></div>
      <div class="sh2">${esc(t('sVer'))}</div>
      ${this._updRow()}
      <div class="sh2">${esc(t('sCard'))}</div>
      ${row(t('lang'), '', `<div class="segs">${[['auto', t('auto')], ...LANGS.map(l => [l, LANG_NAMES[l]])].map(([v, n]) => `<button class="${lang === v ? 'on' : ''}" data-lang="${v}">${esc(n)}</button>`).join('')}</div>`)}
      <div class="sh2">${esc(t('sLook'))}</div>
      ${row(t('tileSize'), '', seg('tile_size', S.tile_size || 'auto', [['auto', t('tsAuto')], ['s', t('tsS')], ['m', t('tsM')], ['l', t('tsL')]]))}
      ${row(t('icStyle'), '', seg('icon_style', S.icon_style || 'color', [['color', t('icColorS')], ['mono', t('icMonoS')]]))}
      ${row(t('bg'), t('bgThemeS'), seg('bg', S.bg || 'dark', [['dark', t('bgDark')], ['black', t('bgBlack')], ['theme', t('bgTheme')]]))}
      ${row(t('showNames'), t('showNamesS'), sw('show_names', true))}
      ${row(t('showBar'), t('showBarS'), sw('show_bar', true))}
      ${row(t('showDots'), t('showDotsS'), sw('show_dots', true))}
      <div class="sh2">${esc(t('sButtons'))}</div>
      ${row(t('showStop'), '', sw('show_stop', true))}
      ${row(t('showRandom'), t('showRandomS'), sw('show_random', true))}
      <div class="sh2">${esc(t('sBehave'))}</div>
      ${row(t('fxOn'), t('fxOnS'), seg('fx_on_brightness', S.fx_on_brightness || 0, [[0, t('fxOnOff')], [30, '%30'], [50, '%50'], [80, '%80'], [100, '%100']]))}
      ${row(t('startTab'), t('startTabS'), seg('start_tab', S.start_tab || 'last', [['auto', t('stAuto')], ['fav', t('stFav')], ['last', t('stLast')], ['light', t('stLight')]]))}
      ${row(t('lp'), t('lpS'), seg('long_press', S.long_press || 550, [[300, '0,3 sn'], [450, '0,45 sn'], [550, '0,55 sn'], [800, '0,8 sn']]))}
      ${row(t('haptic'), t('hapticS'), sw('haptics', true))}
      ${row(t('fade'), t('fadeS'), seg('transition', S.transition || 0, [[0, t('fadeNo')], ['0.5', '0,5 ' + t('sec')], [1, '1 ' + t('sec')], [2, '2 ' + t('sec')], [5, '5 ' + t('sec')]]))}
      ${row(t('showRecent'), t('showRecentS'), sw('show_recent', true))}
      <div class="sh2">${esc(t('sStop'))}</div>
      ${row(t('white'), k + 'K', `<div class="kel">${KELV.map(([kv, c], i) => `<button class="${kv === k ? 'on' : ''}" data-k="${kv}" style="background:${c}">${esc(names[i])}</button>`).join('')}</div>`)}
      <div class="srow"><div class="t"><b>${esc(t('bright'))}</b><small id="bv">%${b}</small></div><input class="rng" id="gb" type="range" min="1" max="100" value="${b}"></div>
      <div class="sh2">${esc(t('sNight'))}</div>
      ${row(t('night'), t('nightS'), sw('night_on', false))}
      ${S.night_on ? `<div class="srow"><div class="t"><b>${esc(t('from'))} · ${esc(t('to'))}</b></div><input class="tin" type="time" id="nf" value="${esc(S.night_from || '23:00')}"><input class="tin" type="time" id="nt" value="${esc(S.night_to || '07:00')}"></div>
      ${row(t('nightMax'), '', seg('night_max', S.night_max || 30, [[10, '%10'], [20, '%20'], [30, '%30'], [50, '%50'], [70, '%70']]))}` : ''}
      <div class="sh2">${esc(t('sRooms'))}</div>
      ${row(t('groups'), t('groupsS'), sw('include_groups', false))}
      <div class="srow"><div class="t"><b>${esc(t('thr'))}</b><small>${esc(t('thrS'))}</small></div><div class="segs">${[1, 2, 3, 5, 10].map(n => `<button class="${min === n ? 'on' : ''}" data-min="${n}">${esc(t('thrN', { n }))}</button>`).join('')}</div></div>
      <div class="sh2">${esc(t('sBackup'))}</div>
      ${row(t('bkDown'), t('bkDownS'), `<button class="btn" data-bkdown>${pi('download', 's16')}${esc(t('bkDown'))}</button>`)}
      ${row(t('bkUp'), t('bkUpS'), `<button class="btn" data-bkup>${pi('upload', 's16')}${esc(t('bkUp'))}</button>`)}
      <div class="sh2">${esc(t('sReset'))}</div>
      ${row(t('resetAll'), t('resetAllS'), `<button class="btn danger" data-resetask>${pi('trash', 's16')}${esc(t('resetAll'))}</button>`)}
    </div></div>`;
  }
  // ---- version and updates: HACS (refresh, install) when it is there, GitHub otherwise ----
  _updRow() {
    const t = (k, v) => this._t(k, v), U = this._upd || { st: 'idle' }, cur = U.cur || CARD_VERSION;
    const notes = U.url ? ` · <a href="${esc(U.url)}" target="_blank" rel="noopener">${esc(t('updNotes'))}</a>` : '';
    let sub = esc(t('updInst', { v: cur })), ctl = `<button class="btn" data-updcheck>${pi('reset', 's16')}${esc(t('updCheck'))}</button>`;
    if (U.st === 'checking') ctl = `<button class="btn" disabled>${esc(t('updChecking'))}</button>`;
    else if (U.st === 'ok') { sub += ` · <span class="uok">✓ ${esc(t('updOk'))}</span> · ${esc(t('updAt', { t: U.at }))}`; ctl = `<button class="btn" data-updcheck>${pi('reset', 's16')}${esc(t('updAgain'))}</button>`; }
    else if (U.st === 'new') { sub += ` · <b class="unew">${esc(t('updNew', { v: U.latest }))}</b>${notes}${U.ent ? '' : `<br>${esc(t('updNoHacs'))}`}`; ctl = U.ent ? `<button class="btn pri" data-updgo>${pi('download', 's16')}${esc(t('updGo'))}</button>` : (U.url ? `<a class="btn" href="${esc(U.url)}" target="_blank" rel="noopener">${esc(t('updGh'))}</a>` : ''); }
    else if (U.st === 'installing') { sub = `<b class="unew">${esc(t('updIng', { v: U.latest }))}</b>${U.pct != null ? ` %${U.pct}` : ''}`; ctl = ''; }
    else if (U.st === 'installed') { sub = `<b class="unew">${esc(t('updDone', { v: U.latest }))}</b>${notes}`; ctl = `<button class="btn pri" data-updrs>${pi('reset', 's16')}${esc(t('updRestart'))}</button>`; }
    else if (U.st === 'ask') { sub = `<b>${esc(t('updAsk'))}</b>`; ctl = `<div class="dbtns" style="margin:0"><button class="btn" data-updno>${esc(t('cancel'))}</button><button class="btn danger" data-updyes>${esc(t('updYes'))}</button></div>`; }
    else if (U.st === 'restarting') { sub = `<b class="unew">${esc(t('updRest'))}</b>`; ctl = ''; }
    else if (U.st === 'err') { sub += ` · <span class="uerr">${esc(t('updErr', { e: U.err }))}</span>`; ctl = `<button class="btn" data-updcheck>${pi('reset', 's16')}${esc(t('updAgain'))}</button>`; }
    return `<div class="srow upd"><div class="t"><b>${esc(t('updT'))}</b><small>${sub}</small></div>${ctl}</div>`;
  }
  _updSet(o) { this._upd = Object.assign({}, this._upd, o); if (this._view === 'settings') this._render(); }
  _updEnt() {
    const S = this._hass.states;
    return Object.values(S).find(s => s.entity_id.startsWith('update.') && /mendebur-lemur\/lemur-light-effect-card/.test(String(s.attributes.release_url || ''))) || S['update.lemur_light_effect_card_update'] || null;
  }
  async _updCheck() {
    const c = this._hass.connection, vnum = v => String(v || '').replace(/^v/i, '').split('.').map(n => parseInt(n, 10) || 0);
    const newer = (a, b) => { const x = vnum(a), y = vnum(b); for (let i = 0; i < 3; i++) if ((x[i] || 0) !== (y[i] || 0)) return (x[i] || 0) > (y[i] || 0); return false; };
    this._updSet({ st: 'checking', err: null });
    try {
      let cur = CARD_VERSION; try { cur = (await c.sendMessagePromise({ type: 'lemur_light_effects/info' })).version || cur; } catch (e) {}
      // HACS: same as "Update information" in its menu, so its update entity knows about the newest release
      try { const L = await c.sendMessagePromise({ type: 'hacs/repositories/list' }); const r = (L || []).find(x => /\/lemur-light-effect-card$/i.test(x.full_name || '')); if (r) { await c.sendMessagePromise({ type: 'hacs/repository/refresh', repository: String(r.id) }); await new Promise(z => setTimeout(z, 900)); } } catch (e) {}
      const ent = this._updEnt();
      let latest = ent && ent.attributes.latest_version, url = ent && ent.attributes.release_url;
      if (!latest) { const g = await c.sendMessagePromise({ type: 'lemur_light_effects/latest' }); latest = g.version; url = g.url; }
      latest = String(latest || '').replace(/^v/i, '');
      const at = new Date().toLocaleTimeString(this._l(), { hour: '2-digit', minute: '2-digit' });
      this._updSet(newer(latest, cur) ? { st: 'new', cur, latest, url, ent: ent ? ent.entity_id : null, at } : { st: 'ok', cur, latest, url, at });
    } catch (e) { this._updSet({ st: 'err', err: (e && (e.message || e.code)) || String(e) }); }
  }
  // restart, then reload the page once the new version answers (the old code is still in memory until then)
  _updRestart() {
    const want = (this._upd || {}).latest; this._updSet({ st: 'restarting' });
    this._hass.callService('homeassistant', 'restart').catch(() => {});
    const t0 = Date.now(); let down = false;
    const poll = async () => {
      if (Date.now() - t0 > 600000) return;
      try {
        const v = (await this._hass.connection.sendMessagePromise({ type: 'lemur_light_effects/info' })).version;
        if (v === want || (down && v)) { await Promise.resolve(window.__LEMUR_HEAL && window.__LEMUR_HEAL()); return location.reload(); }
      } catch (e) { down = true; }
      setTimeout(poll, 3000);
    };
    setTimeout(poll, 8000);
  }
  async _updInstall() {
    const U = this._upd || {}; if (!U.ent) return;
    this._updSet({ st: 'installing', pct: null });
    try { await this._hass.callService('update', 'install', { entity_id: U.ent }); }
    catch (e) { return this._updSet({ st: 'err', err: (e && e.message) || String(e) }); }
    const t0 = Date.now();
    const tick = () => {
      const s = this._hass.states[U.ent], a = (s && s.attributes) || {};
      const done = s && !a.in_progress && String(a.installed_version || '').replace(/^v/i, '') === U.latest;
      if (done) return this._updSet({ st: 'installed', pct: null });
      if (Date.now() - t0 > 300000) return this._updSet({ st: 'err', err: 'timeout' });
      if (typeof a.update_percentage === 'number' || typeof a.in_progress === 'number') this._updSet({ pct: Math.round(a.update_percentage != null ? a.update_percentage : a.in_progress) });
      this._updT = setTimeout(tick, 1000);
    };
    tick();
  }

  _restoreHtml() {
    const t = (k, v) => esc(this._t(k, v)), b = this._bk || {}; let d = ''; try { d = new Date(b.date).toLocaleString(this._l()); } catch (e) {}
    return `<div class="modal" data-closerestore><div class="dlg sm">
      <div class="dh"><span class="si">${pi('upload', 's20')}</span><b>${t('bkQ')}</b></div>
      <p class="rw">${t('bkW', { d: d || '?' })}</p>
      <div class="dbtns"><button class="btn" data-closerestore>${t('cancel')}</button><button class="btn pri" data-bkyes>${t('bkYes')}</button></div>
    </div></div>`;
  }
  async _backupDown() {
    const d = STORE.d, icons = {}, t = (k, v) => this._t(k, v); this._toast(t('bkBusy'), false);
    for (const [k, url] of Object.entries(d.icons || {})) {
      try { const b = await (await fetch(url)).blob(); icons[k] = await new Promise((res, rej) => { const fr = new FileReader(); fr.onload = () => res(fr.result); fr.onerror = rej; fr.readAsDataURL(b); }); } catch (e) {}
    }
    const out = { format: 'lemur-light-effects-backup', version: CARD_VERSION, date: new Date().toISOString(), data: { settings: d.settings || {}, tabs: d.tabs || {}, favorites: d.favorites || [], hidden: d.hidden || [], rooms: d.rooms || {} }, icons };
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(out, null, 1)], { type: 'application/json' }));
    a.download = 'lemur-backup-' + new Date().toISOString().slice(0, 10) + '.json'; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
    this._toast(t('bkSaved'), false);
  }
  async _backupApply() {
    const b = this._bk, t = k => this._t(k); if (!b) return;
    this._snap();
    const D = b.data || {};
    STORE.set('settings', D.settings && typeof D.settings === 'object' ? D.settings : {});
    STORE.set('tabs', D.tabs && typeof D.tabs === 'object' ? D.tabs : {});
    STORE.set('favorites', Array.isArray(D.favorites) ? D.favorites : []); STORE.set('hidden', Array.isArray(D.hidden) ? D.hidden : []);
    STORE.set('rooms', D.rooms && typeof D.rooms === 'object' ? D.rooms : {});
    const keep = b.icons || {};
    for (const k of Object.keys(STORE.d.icons || {})) if (!keep[k]) await STORE.iconDel(k);
    for (const [k, url] of Object.entries(keep)) { const m = String(url).match(/^data:(image\/(png|jpeg|webp|gif));base64,(.+)$/); if (m) try { await STORE.icon(k, m[1], m[3]); } catch (e) {} }
    this._bk = null; this._view = 'edit'; this._ce = null; this._tab = {}; this._render(); this._toast(t('bkOk'), false);
  }
  _resetHtml() {
    const t = k => esc(this._t(k));
    return `<div class="modal" data-closereset><div class="dlg sm">
      <div class="dh"><span class="si warnc">${pi('trash', 's20')}</span><b>${t('resetQ')}</b></div>
      <p class="rw">${t('resetW')}</p>
      <div class="dbtns"><button class="btn" data-closereset>${t('cancel')}</button><button class="btn danger" data-resetyes>${t('resetYes')}</button></div>
    </div></div>`;
  }
  // every effect any light at home has: key → representative name (for the base effect list)
  _allFx() {
    const H = this._hass, A = new Map();
    for (const id of lightPool(H, false)) { const l = H.states[id].attributes.effect_list; if (!Array.isArray(l)) continue; for (const [k, n] of parseList(l).m) if (!A.has(k) || (GOVL.has(n) && !GOVL.has(A.get(k)))) A.set(k, n); }
    return A;
  }
  _actTxt(a) {
    const t = k => this._t(k);
    if (typeof a === 'string') return a;
    if (!a) return '';
    if (a.mode === 'fx') return a.fx;
    if (a.mode === 'color') return t('m_color') + (a.br ? ' · %' + a.br : '');
    if (a.mode === 'white') return (a.k || 3000) + 'K' + (a.br ? ' · %' + a.br : '');
    return t('m_' + a.mode);
  }
  // "Create effect": the list of own effects, or the editor of one (this._ce is the working copy)
  _mineHtml() {
    const t = (k, v) => this._t(k, v), S = this._set(), c = this._ce, H = this._hass, M = this._M, lang = this._l();
    if (!c) {
      const L = customList(S);
      return `<div class="fxh"><span class="hi">${pi('wand', 's20')}</span><b>${esc(t('mineList'))}</b><em>${L.length}</em>${L.length ? `<small class="mut" style="margin-left:6px">${esc(t('mineDrag'))}</small>` : ''}<span class="grow"></span><button class="btn sm pri" data-cenew>${pi('plus', 's16')}${esc(t('mineNew'))}</button></div>
        <div class="grid">${L.map(x => { const u = { k: 'u:' + x.id, rep: x.base_name || x.name, label: x.name, custom: x }, n = x.v === 2 ? Object.keys(x.lights || {}).length : null;
          return `<div class="fx mfx" data-ceedit="${esc(x.id)}" data-d="fx|${esc(u.k)}" data-label="${esc(x.name)}" style="--l:${grad(fxInfo(u.rep).hues, 80, 60, '90deg')}"><span class="fi">${this._ico(u, 96)}</span><span class="nm">${esc(x.name)}</span>${n != null ? `<small class="where">${esc(t('nLin', { n }))}</small>` : ''}</div>`; }).join('') || `<div class="emp">${pi('wand')}<span>${esc(t('mineEmpty'))}</span><button class="btn pri" data-cenew>${pi('plus', 's16')}${esc(t('mineNew'))}</button></div>`}</div>`;
    }
    const A = this._allFx(), base = [...A].map(([k, rep]) => [k, this._label({ rep })]).sort((a, b) => a[1].localeCompare(b[1], lang));
    const fxOf = id => { const l = H.states[id] && H.states[id].attributes.effect_list; return Array.isArray(l) ? [...parseList(l).m.values()].sort((a, b) => a.localeCompare(b, lang)) : []; };
    const act = (who, a, light) => {
      const m = (a && a.mode) || (who === '_fb' ? 'color' : 'auto'), hasFx = light && fxOf(light).length;
      const modes = [...(who === '_fb' ? [] : ['auto']), ...(hasFx ? ['fx'] : []), 'color', 'white', 'off', ...(who === '_fb' ? ['skip'] : [])];
      let h = `<select data-cm="${esc(who)}">${modes.map(x => `<option value="${x}" ${x === m ? 'selected' : ''}>${esc(t('m_' + x))}</option>`).join('')}</select>`;
      if (m === 'fx' && hasFx) h += `<select data-cfx="${esc(who)}">${fxOf(light).map(n => `<option ${a.fx === n ? 'selected' : ''}>${esc(n)}</option>`).join('')}</select>`;
      if (m === 'color') h += `<input type="color" data-crgb="${esc(who)}" value="${rgbHex(a.rgb)}">`;
      if (m === 'white') h += `<select data-ck="${esc(who)}">${KELV.map(([k]) => `<option value="${k}" ${+(a.k || 2700) === k ? 'selected' : ''}>${k}K</option>`).join('')}</select>`;
      if (m === 'color' || m === 'white') h += `<label class="cbr" title="${esc(t('bri'))}">☀<input type="number" min="1" max="100" data-cbr="${esc(who)}" value="${esc(a.br || '')}">%</label>`;
      return `<div class="act">${h}</div>`;
    };
    const roomOf = id => this._roomOf(M, id);
    const inIds = Object.keys(c.lights || {}).filter(id => H.states[id]);
    const rooms = M.order.filter(r => r !== '_all' && (M.by[r] || []).length);
    const chip = id => `<div class="clt" data-d="cl|${esc(id)}" data-label="${esc(this._name(id))}">${this._lightDot(id)}<span class="tx"><b>${esc(this._name(id))}</b><small>${esc(this._fxOn(id) ? t('fxN', { n: this._fxCount(id) }) : t('lOnly'))}</small></span><button class="btn ic sm" data-ceadd="${esc(id)}" title="${esc(t('addLight'))}">${pi('plus', 's16')}</button></div>`;
    const pool = rooms.map(r => { const L = M.by[r].filter(id => !inIds.includes(id)); return L.length ? `<div class="crm">${esc(this._roomName(r))}<span class="grow"></span><button class="lnk" data-ceaddr="${esc(r)}">${esc(t('addAllR'))}</button></div>${L.map(chip).join('')}` : ''; }).join('') || `<div class="emp sm">${esc(t('allIn'))}</div>`;
    const row = id => {
      const l = H.states[id].attributes.effect_list, has = !!(c.base && Array.isArray(l) && parseList(l).m.has(c.base) && this._fxOn(id));
      const ex = c.lights[id] || { mode: 'auto' }, eff = customAction(c, H, id, this._fxOn(id));
      const note = ex.mode === 'auto' ? t('autoIs', { x: eff ? this._actTxt(eff) : t('m_skip') }) : '';
      return `<div class="clr" data-d="cl|${esc(id)}" data-label="${esc(this._name(id))}">${this._lightDot(id)}<span class="tx"><b>${esc(this._name(id))}</b><small>${esc(this._roomName(roomOf(id) || '_none'))}${c.base ? ' · ' + esc(has ? t('supBase') : t('noBase')) : ''}${note ? ' · ' + esc(note) : ''}</small></span>${act(id, ex, id)}<button class="btn ic sm" data-cerem="${esc(id)}" title="${esc(t('remL'))}">${pi('x', 's14')}</button></div>`;
    };
    const cur = { k: 'u:' + c.id, rep: c.base_name || c.name || 'x', label: c.name, custom: c };
    const saved = customList(S).some(x => x.id === c.id);
    return `<div class="ceh">
        <button class="btn ic" data-closece title="${esc(t('back'))}">${pi('undo', 's16')}</button>
        <button class="cei" data-ceicons title="${esc(t('ceIcon'))}">${this._ico(cur, 46)}</button>
        <input class="tin" id="cename" value="${esc(c.name || '')}" placeholder="${esc(t('ceName'))}" autocomplete="off">
        <label class="cel"><small>${esc(t('ceBase'))}</small><select id="cebase"><option value="">${esc(t('ceNoBase'))}</option>${base.map(([k, n]) => `<option value="${esc(k)}" ${c.base === k ? 'selected' : ''}>${esc(n)}</option>`).join('')}</select></label>
        <span class="grow"></span>
        ${saved ? `<button class="btn danger sm" data-cedel>${pi('trash', 's16')}${esc(t('del'))}</button>` : ''}
        <button class="btn pri" data-cesave>${esc(t('save'))}</button>
      </div>
      ${c.base ? `<div class="cefb"><small>${esc(t('fbDef'))}</small>${act('_fb', c.fallback || { mode: 'color', rgb: [255, 140, 60], br: 60 }, null)}</div>` : ''}
      <div class="cecols">
        <div class="cepool" data-z="cz|out"><div class="ceht"><b>${esc(t('allL'))}</b><small>${esc(t('allLS'))}</small></div>${pool}</div>
        <div class="cezone" data-z="cz|in"><div class="ceht"><b>${esc(t('inFx'))}</b><em>${inIds.length}</em><small>${esc(t('inFxS'))}</small></div>${inIds.map(row).join('') || `<div class="emp">${pi('drag')}<span>${esc(t('dropL'))}</span></div>`}</div>
      </div>`;
  }
  // ---- fill in an effect: what lights without it do (settings.fill[key]) ----
  _fillOpen(k, room) {
    const M = this._model(); this._M = M;
    const has = r => this._effects(this._lightsOf(M, r)).has(k);
    if (room && M.order.includes(room) && has(room)) this._room = room;
    if (!this._room || !has(this._room)) { const r = M.order.find(x => x !== '_all' && has(x)) || (has('_all') ? '_all' : null); if (r) this._room = r; }
    const cur = (this._set().fill || {})[k];
    const hue = (fxInfo((this._allFx().get(k)) || k).hues || [30])[0], rgb = hsl2rgb(hue, 85, 58);
    this._fill = { k, cfg: cur ? clone(cur) : { all: { mode: 'color', rgb, br: 60 }, lights: {} } };
    this._ce = null; this._view = 'edit'; this._closePop(); this._render();
  }
  _fillHtml() {
    const t = (x, v) => this._t(x, v), F = this._fill, k = F.k, c = F.cfg, H = this._hass, M = this._M, A = this._allFx(), rep = A.get(k) || k;
    const u = { k, rep, names: {} }, lname = this._label(u), saved = !!(this._set().fill || {})[k];
    const rooms = M.order.filter(r => r !== '_all' && (M.by[r] || []).length);
    const hasIt = id => { const l = H.states[id] && H.states[id].attributes.effect_list; return Array.isArray(l) && parseList(l).m.has(k); };
    const sup = [], miss = [];
    rooms.forEach(r => M.by[r].forEach(id => { (hasIt(id) && this._fxOn(id) ? sup : miss).push([r, id]); }));
    const fxOf = id => { const l = H.states[id] && H.states[id].attributes.effect_list; return Array.isArray(l) ? [...parseList(l).m.values()].sort((a, b) => a.localeCompare(b, this._l())) : []; };
    const act = (who, a, light) => {
      const all = who === '_all', m = (a && a.mode) || (all ? 'skip' : 'auto'), hasFx = light && fxOf(light).length;
      const modes = [...(all ? [] : ['auto']), ...(hasFx ? ['fx'] : []), 'color', 'white', 'off', 'skip'];
      let h = `<select data-fm="${esc(who)}">${modes.map(x => `<option value="${x}" ${x === m ? 'selected' : ''}>${esc(x === 'auto' ? t('m_def') : t('m_' + x))}</option>`).join('')}</select>`;
      if (m === 'fx' && hasFx) h += `<select data-ffx="${esc(who)}">${fxOf(light).map(n => `<option ${a.fx === n ? 'selected' : ''}>${esc(n)}</option>`).join('')}</select>`;
      if (m === 'color') h += `<input type="color" data-frgb="${esc(who)}" value="${rgbHex(a.rgb)}">`;
      if (m === 'white') h += `<select data-fk="${esc(who)}">${KELV.map(([kk]) => `<option value="${kk}" ${+(a.k || 2700) === kk ? 'selected' : ''}>${kk}K</option>`).join('')}</select>`;
      if (m === 'color' || m === 'white') h += `<label class="cbr" title="${esc(t('bri'))}">☀<input type="number" min="1" max="100" data-fbr="${esc(who)}" value="${esc(a.br || '')}">%</label>`;
      return `<div class="act">${h}</div>`;
    };
    const row = ([r, id]) => { const a = (c.lights || {})[id] || { mode: 'auto' }; return `<div class="clr">${this._lightDot(id)}<span class="tx"><b>${esc(this._name(id))}</b><small>${esc(this._roomName(r))}${hasIt(id) ? ' · ' + esc(t('fillNoEff')) : this._fxOn(id) ? '' : ' · ' + esc(t('lOnly'))}</small></span>${act(id, a, id)}</div>`; };
    const byRoom = {}; miss.forEach(x => (byRoom[x[0]] = byRoom[x[0]] || []).push(x));
    return `<div class="ceh">
        <button class="btn ic" data-fillclose title="${esc(t('back'))}">${pi('undo', 's16')}</button>
        <span class="cei">${this._ico(u, 46)}</span>
        <div class="fh"><b>${esc(t('fillHead', { x: lname }))}</b><small>${esc(t('fillS'))}</small></div>
        <span class="grow"></span>
        ${saved ? `<button class="btn danger sm" data-filldel>${pi('trash', 's16')}${esc(t('fillDel'))}</button>` : ''}
        <button class="btn pri" data-fillsave ${miss.length ? '' : 'disabled'}>${esc(t('save'))}</button>
      </div>
      <div class="fsup"><small>${esc(t('fillSup'))}</small>${sup.map(([r, id]) => `<span class="fchip">${this._lightDot(id)}${esc(this._name(id))}</span>`).join('') || '–'}</div>
      ${miss.length ? `<div class="cefb fall"><span class="tx"><b>${esc(t('fillAll'))}</b><small>${esc(t('fillAllS'))}</small></span>${act('_all', c.all || { mode: 'skip' }, null)}</div>
      <div class="fmiss"><div class="ceht"><b>${esc(t('fillMiss'))}</b><em>${miss.length}</em></div>${Object.keys(byRoom).map(r => `<div class="crm">${esc(this._roomName(r))}</div>${byRoom[r].map(row).join('')}`).join('')}</div>`
        : `<div class="grid"><div class="emp">${pi('sparkles')}<span>${esc(t('fillNone'))}</span></div></div>`}`;
  }
  _fillSlot(who) { const c = this._fill.cfg; if (who === '_all') return c.all || (c.all = { mode: 'skip' }); c.lights = c.lights || {}; return c.lights[who] || (c.lights[who] = { mode: 'auto' }); }
  _fillSave() {
    const F = this._fill, c = clone(F.cfg), L = {};
    Object.entries(c.lights || {}).forEach(([id, a]) => { if (a && a.mode && a.mode !== 'auto') L[id] = a; });
    const out = { all: c.all && c.all.mode !== 'skip' ? c.all : null, lights: L };
    const FL = Object.assign({}, this._set().fill || {}), nm = this._label({ rep: this._allFx().get(F.k) || F.k });
    if (!out.all && !Object.keys(L).length) delete FL[F.k]; else FL[F.k] = out;
    this._fill = null; this._snap(); this._save({ fill: Object.keys(FL).length ? FL : null }, this._t('fillSaved', { x: nm }));
  }
  _fillDelete() {
    const F = this._fill, FL = Object.assign({}, this._set().fill || {}), nm = this._label({ rep: this._allFx().get(F.k) || F.k }); delete FL[F.k];
    this._fill = null; this._snap(); this._save({ fill: Object.keys(FL).length ? FL : null }, this._t('fillDeleted', { x: nm }));
  }
  _ceMove(ids, into) {
    const c = this._ce; if (!c) return this._render(); c.lights = c.lights || {};
    ids.forEach(id => { if (into) { if (!c.lights[id]) c.lights[id] = { mode: 'auto' }; } else delete c.lights[id]; });
    this._render();
  }
  _ceIconPop(el) {
    const t = (k, v) => this._t(k, v), lang = this._l(), c = this._ce;
    const p = this._popAt(el, `<div style="padding:0 4px"><input id="ceiq" placeholder="${esc(t('searchI'))}" autocomplete="off"></div><div class="igrid ig3" id="ceig">${Object.keys(ICON3).map(k => [k, icName(k, lang)]).sort((a, b) => a[1].localeCompare(b[1], lang)).map(([k, n]) => `<button class="${c.icon === 'c:' + k ? 'on' : ''}" data-ceic="${esc(k)}" data-n="${esc((n + ' ' + k).toLocaleLowerCase(lang))}" title="${esc(n)}">${ICON3[k]}</button>`).join('')}</div>`, { w: 470 });
    const q = p.querySelector('#ceiq'); if (q) q.focus();
  }
  _ceDefault(mode, light) {
    if (mode === 'color') return { mode, rgb: [255, 140, 60], br: 60 };
    if (mode === 'white') return { mode, k: 2700, br: 50 };
    if (mode === 'fx') { const l = this._hass.states[light] && this._hass.states[light].attributes.effect_list; const n = Array.isArray(l) ? [...parseList(l).m.values()].sort()[0] : ''; return { mode, fx: n }; }
    return { mode };
  }
  _ceSlot(who) { const c = this._ce; if (who === '_fb') return c.fallback || (c.fallback = { mode: 'color', rgb: [255, 140, 60], br: 60 }); c.lights = c.lights || {}; return c.lights[who] || (c.lights[who] = { mode: 'auto' }); }
  _ceOpen(id) {
    const S = this._set(), ex = customList(S).find(x => x.id === id);
    this._ce = ex ? clone(ex) : { id: newId(), v: 2, name: '', icon: '', base: '', base_name: '', fallback: { mode: 'color', rgb: [255, 140, 60], br: 60 }, lights: {} };
    // older own effects (every light took part) become "only these lights", with the lights that took part
    if (this._ce.v !== 2) { const H = this._hass, c = this._ce, L = {}; lightPool(H, false).forEach(id => { const a = customAction(c, H, id, this._fxOn(id)); if (a) L[id] = c.lights && c.lights[id] ? c.lights[id] : { mode: 'auto' }; }); c.lights = L; c.v = 2; }
    this._view = 'edit'; this._tab[this._room] = '_mine'; this._closePop(); this._render();
  }
  _ceSave() {
    const c = this._ce, t = (k, v) => this._t(k, v), nm = (c.name || '').trim();
    if (!nm) { this._toast(t('ceNameErr'), false); const i = this.shadowRoot.getElementById('cename'); if (i) i.focus(); return; }
    c.name = nm;
    c.v = 2; c.lights = c.lights || {};
    const L = customList(this._set()).filter(x => x.id !== c.id); L.push(c);
    this._ce = null; this._save({ custom: L }, t('ceSaved', { x: nm }));
  }
  _ceDelete(id) {
    const S = this._set(), c = customList(S).find(x => x.id === id); if (!c) return;
    this._ce = null; this._save({ custom: customList(S).filter(x => x.id !== id) }, this._t('mineDel', { x: c.name }));
  }
  async _scripts(rid, keys) {
    const H = this._hass, t = (k, v) => this._t(k, v), U = this._effects(this._lightsOf(this._M, rid)); let n = 0;
    try {
      for (const k of keys) {
        const u = U.get(k); if (!u) continue;
        const id = ('lemur_' + slug(this._roomName(rid)) + '_' + slug(this._label(u))).slice(0, 64);
        await H.callApi('POST', 'config/script/config/' + id, { alias: this._roomName(rid) + ' · ' + this._label(u), icon: 'mdi:lightbulb-auto', mode: 'single', sequence: scriptSteps(u) });
        n++;
      }
      this._toast(t('scriptOk', { n }), false);
    } catch (e) { this._toast(t('scriptErr', { e: (e && (e.body && e.body.message || e.message)) || e }), false); }
  }
  _resetAll() {
    const keys = Object.keys(STORE.d.icons || {});
    STORE.set('settings', {}); STORE.set('tabs', {}); STORE.set('favorites', []); STORE.set('hidden', []); STORE.set('rooms', {});
    keys.forEach(k => STORE.iconDel(k));
    this._undo = []; this._view = 'edit'; this._tab = {}; this._pick.clear(); this._toast(this._t('resetOk'), false);
  }
  _roomIconPop(el) {
    const t = (k, v) => this._t(k, v), rid = this._room, cur = (this._set().room_icons || {})[rid] || '';
    const p = this._popAt(el, `<div class="pt">${esc(t('roomIconT', { r: this._roomName(rid) }))}</div>
      <button class="it ${cur ? '' : 'on'}" data-ricon="">${pi('reset', 's16')}${esc(t('defIcon'))}</button>
      <div class="igrid ri">${ROOM_ICONS.map(ic => `<button class="${cur === ic ? 'on' : ''}" data-ricon="${esc(ic)}" title="${esc(ic)}">${this._hi(ic, pi('home', 's16'))}</button>`).join('')}</div>
      <div class="rii"><input id="riq" placeholder="${esc(t('mdiPh'))}" value="${esc(cur)}" autocomplete="off"><button class="btn sm" data-riapply>${esc(t('apply'))}</button></div>`, { right: true, w: 340 });
    return p;
  }
  _setRoomIcon(ic) {
    const RI = Object.assign({}, this._set().room_icons || {}), rid = this._room;
    if (ic) RI[rid] = ic; else delete RI[rid];
    this._closePop(); this._save({ room_icons: Object.keys(RI).length ? RI : null });
  }

  // ---- popovers ----
  _closePop() {
    const had = this.shadowRoot.querySelectorAll('.pop'); had.forEach(p => { if (p.parentNode) try { p.parentNode.removeChild(p); } catch (e) {} });
    if (had.length && this._pend) Promise.resolve().then(() => { if (this._pend && !this.shadowRoot.querySelector('.pop')) { this._pend = false; this._render(); } });
  }
  _popAt(el, html, o = {}) {
    this._closePop();
    const R = this.shadowRoot, r = el.getBoundingClientRect(), p = document.createElement('div'); p.className = 'pop'; p.innerHTML = html;
    R.querySelector('.app').appendChild(p);
    if (o.w) { p.style.width = o.w + 'px'; p.style.maxWidth = 'calc(100vw - 24px)'; }
    const w = p.offsetWidth, room = innerHeight - r.bottom - 18, above = r.top - 18;
    let left = o.right ? r.right - w : r.left; left = Math.max(12, Math.min(left, innerWidth - w - 12)); p.style.left = left + 'px';
    if (o.up || (p.offsetHeight > room && above > room)) { p.style.bottom = (innerHeight - r.top + 6) + 'px'; p.style.maxHeight = above + 'px'; }
    else { p.style.top = (r.bottom + 6) + 'px'; p.style.maxHeight = room + 'px'; }
    return p;
  }
  _addTabPop(el) {
    const t = (k, v) => this._t(k, v), U = this._U, RES = this._RES, M = this._M, have = new Set(RES.tabs.map(x => this._tabName(x)));
    const row = (key, name, icon, n, from) => `<button class="it ${n ? '' : 'dis'}" data-addt="${esc(key)}"><span class="ti">${icon}</span>${esc(name)}<small>${from ? esc(from) + ' · ' : ''}${esc(t('nFx', { n }))}</small></button>`;
    let h = `<button class="it" data-addt="_empty"><span class="ti">${pi('plus', 's16')}</span>${esc(t('emptyTab'))}</button>`, hz = '', o = '';
    const grp = this._grp(U);
    for (const g of GROUPS) { const nm = GNAME[this._l()][g]; if (!have.has(nm)) hz += row('g:' + g, nm, tabArt({ auto: g }), [...U.keys()].filter(k => grp(k) === g).length); }
    if (hz) h += `<div class="t">${esc(t('ready'))}</div>` + hz;
    for (const r of M.order) {
      if (r === this._room) continue;
      const U2 = this._effects(this._lightsOf(M, r)), R2 = this._resolve(r, U2);
      R2.tabs.forEach(x => { if (!x.fav && !x.auto && x.fx.length) o += row('r:' + r + ':' + x.id, this._tabName(x), this._tabIcon(x), x.fx.filter(k => U.has(k)).length, this._roomName(r)); });
    }
    if (o) h += `<div class="t">${esc(t('fromRooms'))}</div>` + o;
    this._popAt(el, h);
  }
  _editTabPop(el, id) {
    const t = (k, v) => this._t(k, v), lt = id === '_light', x = lt ? { id, icon: this._lightIcon(), lock: 1 } : this._RES.tabs.find(q => q.id === id); if (!x) return;
    const fixed = x.fav || lt, lang = this._l(), def = !x.icon || x.icon === 'sparkle' || (!lt && x.icon === GICON[x.fav ? 'fav' : x.auto]), cur = def ? '' : x.icon, low = s => String(s).toLocaleLowerCase(lang);
    const btn = (v, ic, n, f) => `<button class="${cur === v ? 'on' : ''}" data-ticon="${esc(id)}|${esc(v)}" data-n="${esc(low(n + ' ' + f))}" title="${esc(n)}">${ic}</button>`;
    const col = Object.keys(ICON3).map(k => [k, icName(k, lang)]).sort((a, b) => a[1].localeCompare(b[1], lang)).map(([k, n]) => btn('c:' + k, ICON3[k], n, k.replace(/_/g, ' '))).join('');
    const mono = Object.keys(ICONS).filter(n => n !== 'generic').map(n => btn(n, svg(n), n, '')).join('');
    const dflt = `<button class="it ${cur ? '' : 'on'}" data-ticon="${esc(id)}|"><span class="ti">${tabArt(lt ? {} : { fav: x.fav, auto: x.auto }, lt ? 'light' : null)}</span>${esc(t('defIcon'))}</button>`;
    const p = this._popAt(el, `<div style="padding:4px 4px 0"><input data-tname="${esc(id)}" value="${esc(lt ? t('light') : this._tabName(x))}" ${fixed ? 'disabled' : ''}></div>
      <div style="padding:0 4px"><input id="iq" placeholder="${esc(t('searchI'))}" autocomplete="off"></div>
      ${dflt}
      <div class="t">${esc(t('icColor'))}</div><div class="igrid ig3">${col}</div>
      <div class="t">${esc(t('icMono'))}</div><div class="igrid">${mono}</div>
      ${fixed ? '' : `<hr><button class="it del" data-tdel="${esc(id)}">${pi('trash', 's16')}${esc(t('delTab'))}</button>`}`, { w: 470 });
    const i = p.querySelector('input'); if (i && !fixed) { i.focus(); i.select(); }
    const q = p.querySelector('#iq'); if (!q) return;
    q.oninput = () => {
      const v = low(q.value).trim();
      p.querySelectorAll('.igrid').forEach(g => {
        let any = false;
        g.querySelectorAll('button').forEach(b => { const ok = !v || b.dataset.n.includes(v); b.style.display = ok ? '' : 'none'; if (ok) any = true; });
        g.style.display = any ? '' : 'none'; if (g.previousElementSibling) g.previousElementSibling.style.display = any ? '' : 'none';
      });
    };
  }
  _addLightPop(el) {
    const t = (k, v) => this._t(k, v), M = this._M, cur = this._lightsOf(M, this._room), by = {}, lang = this._l();
    [...M.order.filter(a => a !== '_all'), '_hidden'].forEach(r => { this._lightsOf(M, r).forEach(id => { if (!cur.includes(id)) (by[r] = by[r] || []).push(id); }); });
    const p = this._popAt(el, `<div class="pt">${esc(t('addLightT', { r: this._roomName(this._room) }))}</div><div style="padding:0 4px"><input id="lq" placeholder="${esc(t('searchL'))}" autocomplete="off"></div>
      <div id="lql">${Object.keys(by).map(r => `<div class="t">${esc(this._roomName(r))}</div>${by[r].map(id => { const n = this._fxCount(id); return `<button class="it" data-takel="${esc(id)}" data-n="${esc((this._name(id) + ' ' + id).toLocaleLowerCase(lang))}">${this._lightDot(id)}${esc(this._name(id))}<small>${esc(this._fxOn(id) ? t('fxN', { n }) : t('lOnly'))}</small></button>`; }).join('')}`).join('')}</div>`, { w: 360 });
    const q = p.querySelector('#lq'); q.focus();
    q.oninput = () => {
      const v = q.value.toLocaleLowerCase(lang);
      p.querySelectorAll('[data-takel]').forEach(b => { b.style.display = b.dataset.n.includes(v) ? '' : 'none'; });
      p.querySelectorAll('#lql .t').forEach(h => { let n = h.nextElementSibling, any = false; while (n && !n.classList.contains('t')) { if (n.style.display !== 'none') any = true; n = n.nextElementSibling; } h.style.display = any ? '' : 'none'; });
    };
  }
  // where a light goes when it is taken out of the room it is shown in
  _outTarget(id) {
    const M = this._M, cur = this._roomOf(M, id), home = this._homeOf(id);
    if (cur === '_hidden' || (home !== cur && !(home === '_none' && cur === '_none'))) return home;
    return '_hidden';
  }
  _lightOut(id) { return this._moveLights([id], this._outTarget(id)); }
  _lightPop(el, id) {
    const t = (k, v) => this._t(k, v), M = this._M, cur = this._roomOf(M, id), home = this._homeOf(id), out = this._outTarget(id), n = this._fxCount(id);
    const rooms = [...M.order.filter(r => r !== '_all' && r !== cur && r !== out), ...M.empty.map(a => a.area_id).filter(r => r !== cur && r !== out)];
    const on = this._fxOn(id);
    this._popAt(el, `<div class="fxd">${this._lightDot(id)}<div><b>${esc(this._name(id))}</b><small>${esc(id)} · ${esc(n ? t('fxN', { n }) : t('noFxL'))}</small></div></div>
      ${cur === '_hidden' ? '' : n ? `<button class="it fxu" data-lfx="${esc(id)}">${pi('sparkles', 's16')}<span class="fxt"><b>${esc(t('fxUse'))}</b><small>${esc(t('fxUseS'))}</small></span><span class="swt ${on ? 'on' : ''}"></span></button><hr>` : `<div class="it dis">${pi('bulb', 's16')}${esc(t('fxNone'))}</div><hr>`}
      ${out === '_hidden' ? `<button class="it del" data-lout="${esc(id)}">${pi('eyeoff', 's16')}${esc(t('lHide'))}</button>` : `<button class="it" data-lout="${esc(id)}">${pi('undo', 's16')}${esc(t('lBack', { r: this._roomName(home) }))}</button>`}
      ${cur !== '_hidden' && out !== '_hidden' ? `<button class="it del" data-lto="${esc(id)}|_hidden">${pi('eyeoff', 's16')}${esc(t('lHide'))}</button>` : ''}
      ${rooms.length ? `<hr><div class="t">${esc(t('lMove'))}</div>${rooms.map(r => `<button class="it" data-lto="${esc(id)}|${esc(r)}">${pi('home', 's16')}${esc(this._roomName(r))}</button>`).join('')}` : ''}`, { w: 320 });
  }
  _addRoomPop(el) {
    const t = (k, v) => this._t(k, v), E = this._M.empty;
    this._popAt(el, `<div class="t">${esc(t('addRoomT'))}</div>${E.map(a => `<button class="it" data-pickroom="${esc(a.area_id)}"><span class="ti">${this._hi(a.icon, pi('home', 's16'))}</span>${esc(a.name)}</button>`).join('') || `<div class="it dis">${esc(t('addRoomNone'))}</div>`}`);
  }
  _morePop(el) {
    const t = (k, v) => this._t(k, v), rid = this._room, M = this._M, others = M.order.filter(r => r !== rid && r !== '_all'), S = this._set();
    const off = rid === '_all' ? !allHomeOn(S) : (S.hidden_areas || []).includes(rid);
    this._popAt(el, `<button class="it" data-riconpop>${this._hi((S.room_icons || {})[rid] || ((this._hass.areas || {})[rid] || {}).icon || 'mdi:home', pi('home', 's16'))}${esc(t('roomIcon'))}</button>
      <button class="it" data-reset>${pi('reset', 's16')}${esc(t('reset', { r: this._roomName(rid) }))}</button>
      <button class="it" data-roff>${pi(off ? 'eye' : 'eyeoff', 's16')}${esc(rid === '_all' ? (off ? t('allOnB') : t('allOffB')) : off ? t('roomOn') : t('roomOff'))}</button>
      ${others.length ? `<hr><div class="t">${esc(t('copyT', { r: this._roomName(rid) }))}</div>${others.map(r => `<button class="it" data-copyto="${esc(r)}">${pi('copy', 's16')}${esc(this._roomName(r))}</button>`).join('')}<button class="it" data-copyto="*">${pi('copy', 's16')}${esc(t('copyAll'))}</button>` : ''}`, { right: true });
  }
  _fxPop(el, k) {
    const t = (x, v) => this._t(x, v), u = this._U.get(k); if (!u) return;
    const favT = this._RES.tabs.find(x => x.fav), isFav = !!(favT && favT.fx.includes(k)), hid = this._RES.hid.includes(k), cust = STORE.d.icons && STORE.d.icons[k];
    this._iconFor = k;
    this._popAt(el, `<div class="fxd">${this._ico(u, 52)}<div><b>${esc(this._label(u))}</b><small>${esc(u.rep)}</small></div></div>
      <div class="t">${esc(t('namesOn'))}</div><div class="names">${Object.entries(u.names).map(([id, n]) => `<span><b>${esc(this._name(id))}</b> · ${esc(this._actTxt(n))}</span>`).join('')}</div><hr>
      ${u.custom ? `<button class="it" data-ceedit="${esc(u.custom.id)}">${pi('pen', 's16')}${esc(t('editMine'))}</button>` : ''}
      ${u.custom ? '' : `<button class="it" data-fillopen="${esc(k)}">${pi('sparkles', 's16')}${esc(t('fillT'))}${(this._set().fill || {})[k] ? ` <small>· ${esc(t('fillOn'))}</small>` : ''}</button>`}
      <button class="it" data-script="${esc(k)}">${pi('script', 's16')}${esc(t('script'))}</button>
      ${favT ? `<button class="it" data-fxfav="${esc(k)}">${pi('star', 's16')}${esc(isFav ? t('remFav') : t('addFav'))}</button>` : ''}
      <button class="it" data-fxhide="${esc(k)}">${pi(hid ? 'eye' : 'eyeoff', 's16')}${esc(hid ? t('showFx') : t('hideFx'))}</button>
      <button class="it" data-icup>${pi('upload', 's16')}${esc(t('upIcon'))}</button>
      ${cust ? `<button class="it" data-icrm>${pi('reset', 's16')}${esc(t('rmIcon'))}</button>` : ''}`, { right: true, w: 300 });
  }

  // ---- pointer drag & drop (mouse, pen; touch after a short hold) ----
  _ddown(e) {
    if (e.button > 0) return;
    const it = e.target.closest('[data-d]'); if (!it || e.target.closest('input,button,select,label,.pop,.modal')) return;
    const v = it.dataset.d, i = v.indexOf('|'), zs = it.closest('[data-src]');
    this._dd = { it, type: v.slice(0, i), id: v.slice(i + 1), x: e.clientX, y: e.clientY, on: false, touch: e.pointerType === 'touch', src: zs ? zs.dataset.src : null };
    if (this._dd.touch) { const d = this._dd; d.timer = setTimeout(() => { if (this._dd === d && !d.on) this._dstart(); }, 280); }
  }
  _dstart() {
    const d = this._dd, R = this.shadowRoot; d.on = true; this._closePop();
    d.ids = this._pick.has(d.id) && (d.type === 'fx' || d.type === 'light') ? [...this._pick].filter(k => d.type === 'light' ? k.startsWith('light.') : !k.startsWith('light.')) : [d.id];
    const g = document.createElement('div'); g.className = 'ghost';
    const lbl = d.it.dataset.label || d.it.textContent.trim(), u = d.type === 'fx' && this._U.get(d.id);
    g.innerHTML = (u ? this._ico(u, 30) : d.type === 'light' || d.type === 'cl' ? this._lightDot(d.id) : '') + (d.ids.length > 1 ? `<span class="n">${d.ids.length}</span>` : '') + esc(d.ids.length > 1 ? `${lbl} +${d.ids.length - 1}` : lbl);
    const app = R.querySelector('.app'); app.appendChild(g); d.ghost = g; g.style.transform = `translate(${d.x + 14}px,${d.y + 10}px)`;
    app.classList.add('drag-' + d.type);
    R.querySelectorAll('[data-d]').forEach(el => { const v = el.dataset.d, i = v.indexOf('|'); if (v.slice(0, i) === d.type && d.ids.includes(v.slice(i + 1))) el.classList.add('dragsrc'); });
    if (d.touch && navigator.vibrate) try { navigator.vibrate(10); } catch (e) {}
  }
  _zoneAt(x, y, type) {
    const acc = DND_ACCEPT[type]; let el = this.shadowRoot.elementFromPoint(x, y);
    while (el && el !== this.shadowRoot) {
      const zs = el.dataset && el.dataset.z;
      if (zs) for (const z of zs.split(' ')) { const i = z.indexOf('|'), k = z.slice(0, i); if (acc.includes(k)) return { el, id: z.slice(i + 1), kind: k }; }
      el = el.parentNode;
    }
    return null;
  }
  _insertPoint(z, x, y) {
    if (!z.el.hasAttribute('data-ins')) return null;
    const kids = [...z.el.querySelectorAll(':scope > [data-d]')].filter(k => !this._dd.ids.includes(k.dataset.d.slice(k.dataset.d.indexOf('|') + 1)));
    for (const k of kids) { const r = k.getBoundingClientRect(); if (y < r.top - 5) return k; if (y <= r.bottom + 5 && x < r.left + r.width / 2) return k; }
    return 'end';
  }
  _dmove(e) {
    const d = this._dd; if (!d) return;
    if (!d.on) {
      const dist = Math.hypot(e.clientX - d.x, e.clientY - d.y);
      if (d.touch) { if (dist > 10) { clearTimeout(d.timer); this._dd = null; } return; }
      if (dist < 6) return;
      this._dstart();
    }
    e.preventDefault();
    d.ghost.style.transform = `translate(${e.clientX + 14}px,${e.clientY + 10}px)`;
    this.shadowRoot.querySelectorAll('.over,.ins,.insv').forEach(el => el.classList.remove('over', 'ins', 'insv'));
    const z = this._zoneAt(e.clientX, e.clientY, d.type); d.z = z; d.before = null;
    if (z) {
      const ip = this._insertPoint(z, e.clientX, e.clientY);
      if (ip && ip !== 'end') { ip.classList.add('ins'); d.before = ip.dataset.d.slice(ip.dataset.d.indexOf('|') + 1); }
      else if (ip === 'end') { /* end of the open tab: no extra mark */ }
      else if (z.kind === 'tab' && d.type === 'tab') z.el.classList.add('insv');
      else if (z.kind === 'room' && d.type === 'room') z.el.classList.add('ins');
      else z.el.classList.add('over');
    }
    clearInterval(this._asc);
    const sc = [...this.shadowRoot.querySelectorAll('.grid,.tscroll')].find(el => { const r = el.getBoundingClientRect(); return e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top - 30 && e.clientY <= r.bottom + 30; });
    if (sc) { const r = sc.getBoundingClientRect(), sp = e.clientY < r.top + 40 ? -12 : e.clientY > r.bottom - 40 ? 12 : 0; if (sp) this._asc = setInterval(() => { sc.scrollTop += sp; }, 16); }
  }
  _dup() {
    const d = this._dd; if (!d) return; clearTimeout(d.timer); clearInterval(this._asc); this._dd = null;
    if (!d.on) return;
    d.ghost.remove(); const app = this.shadowRoot.querySelector('.app'); app.classList.remove('drag-' + d.type);
    this.shadowRoot.querySelectorAll('.over,.ins,.insv,.dragsrc').forEach(el => el.classList.remove('over', 'ins', 'insv', 'dragsrc'));
    this._noClick = Date.now();
    if (d.z) this._drop(d.type, d.ids, d.z.kind, d.z.id, d.before, d.src); else this._render();
  }
  _key(e) {
    if (!this.isConnected || !this.shadowRoot) return;
    const tg = e.composedPath()[0], typing = tg && /INPUT|TEXTAREA/.test(tg.tagName);
    if (e.key === 'Escape') { if (this.shadowRoot.querySelector('.pop')) return this._closePop(); if (this._view === 'reset' || this._view === 'restore') { this._bk = null; this._view = 'settings'; return this._render(); } if (this._view === 'settings') { this._view = 'edit'; return this._render(); } if (this._pick.size) { this._pick.clear(); return this._render(); } }
    if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === 'z' && !typing && this._undo.length) { e.preventDefault(); this._undoIt(); }
  }

  _bind() {
    const R = this.shadowRoot, t = (k, v) => this._t(k, v), app = R.querySelector('.app');
    app.addEventListener('pointerdown', e => this._ddown(e));
    app.addEventListener('click', ev => {
      if (this._noClick && Date.now() - this._noClick < 350) return;
      const g = s => ev.target.closest(s); let x;
      const inPop = g('.pop'); if (!inPop) this._closePop();
      if (g('[data-pv]')) return this._pv ? this._pvEnd(true) : this._pvRoom(this._room);
      if ((x = g('[data-pvend]'))) return this._pvEnd(x.dataset.pvend === '1');
      if (g('[data-undo]')) return this._undoIt();
      if (g('[data-settings]')) { this._view = 'settings'; return this._render(); }
      // own effects editor
      if (g('[data-closece]')) { this._ce = null; return this._render(); }
      if (g('[data-cesave]')) return this._ceSave();
      if (g('[data-cedel]')) return this._ceDelete(this._ce && this._ce.id);
      if ((x = g('[data-ceicons]'))) return this._ceIconPop(x);
      if ((x = g('[data-ceic]'))) { this._closePop(); this._ce.icon = 'c:' + x.dataset.ceic; return this._render(); }
      if ((x = g('[data-ceadd]'))) return this._ceMove([x.dataset.ceadd], true);
      if ((x = g('[data-cerem]'))) return this._ceMove([x.dataset.cerem], false);
      if ((x = g('[data-ceaddr]'))) return this._ceMove((this._M.by[x.dataset.ceaddr] || []).slice(), true);
      if ((x = g('[data-cenew]'))) return this._ceOpen(null);
      if ((x = g('[data-fillopen]'))) return this._fillOpen(x.dataset.fillopen);
      if (g('[data-fillclose]')) { this._fill = null; return this._render(); }
      if (g('[data-fillsave]')) return this._fillSave();
      if (g('[data-filldel]')) return this._fillDelete();
      if ((x = g('[data-ceedit]'))) return this._ceOpen(x.dataset.ceedit);
      // reset
      if (g('[data-resetask]')) { this._view = 'reset'; return this._render(); }
      if ((x = g('[data-closereset]')) && (x.classList.contains('btn') || !g('.dlg'))) { this._view = 'settings'; return this._render(); }
      if (g('[data-resetyes]')) return this._resetAll();
      if (g('[data-reload]')) { try { if (navigator.serviceWorker) navigator.serviceWorker.getRegistrations().then(rs => rs.forEach(r => r.update())); } catch (e) {} Promise.resolve(window.__LEMUR_HEAL && window.__LEMUR_HEAL()).finally(() => setTimeout(() => location.reload(), 150)); return; }
      if (g('[data-updcheck]')) return this._updCheck();
      if (g('[data-updgo]')) return this._updInstall();
      if (g('[data-updrs]')) return this._updSet({ st: 'ask' });
      if (g('[data-updno]')) return this._updSet({ st: 'installed' });
      if (g('[data-updyes]')) return this._updRestart();
      if (g('[data-bkdown]')) return this._backupDown();
      if (g('[data-bkup]')) { const f = R.getElementById('bkf'); if (f) f.click(); return; }
      if ((x = g('[data-closerestore]')) && (x.classList.contains('btn') || !g('.dlg'))) { this._bk = null; this._view = 'settings'; return this._render(); }
      if (g('[data-bkyes]')) return this._backupApply();
      if (this._view === 'restore' && g('.dlg')) return;
      if (this._view === 'reset' && g('.dlg')) return;
      if ((x = g('[data-closeset]')) && (x.classList.contains('btn') || !g('.dlg'))) { this._view = 'edit'; return this._render(); }
      // settings
      if ((x = g('[data-k]'))) return this._save({ kelvin: +x.dataset.k });
      if ((x = g('[data-lang]'))) return this._save({ language: x.dataset.lang === 'auto' ? null : x.dataset.lang });
      if ((x = g('[data-min]'))) return this._save({ min_effects: +x.dataset.min });
      if ((x = g('[data-sv]'))) { const v = x.dataset.sv, i = v.indexOf('|'), key = v.slice(0, i), raw = v.slice(i + 1), num = /^\d+(\.\d+)?$/.test(raw) ? +raw : raw; const def = { tile_size: 'auto', icon_style: 'color', bg: 'dark', start_tab: 'last', long_press: 550, fx_on_brightness: 0, night_max: 30, transition: 0 }[key]; return this._save({ [key]: num === def ? null : num }); }
      if ((x = g('[data-sw]'))) { const [key, d] = x.dataset.sw.split('|'), def = d === '1', S = this._set(), cur = S[key] == null ? def : !!S[key], nv = !cur; return this._save({ [key]: nv === def ? null : nv }); }
      if ((x = g('[data-roff]'))) { this._closePop(); return this._roomVis(x.dataset.roff || this._room); }
      if (g('.dlg')) return;
      // rooms and lights
      if ((x = g('[data-room]')) && !g('button')) { this._ce = null; this._fill = null; this._room = x.dataset.room; this._tab[this._room] = '_allfx'; this._pick.clear(); this._q = ''; if (this._pv) this._pvRoom(this._room); return this._render(); }
      if ((x = g('[data-addroom]'))) return this._addRoomPop(x);
      if ((x = g('[data-pickroom]'))) { this._extra = x.dataset.pickroom; this._room = this._extra; this._closePop(); return this._render(); }
      if ((x = g('[data-addlight]'))) return this._addLightPop(x);
      if ((x = g('[data-takel]'))) { this._closePop(); return this._moveLights([x.dataset.takel], this._room); }
      if ((x = g('[data-more]'))) return this._morePop(x);
      if ((x = g('[data-riconpop]'))) return this._roomIconPop(R.querySelector('[data-more]') || x);
      if ((x = g('[data-ricon]'))) return this._setRoomIcon(x.dataset.ricon);
      if (g('[data-riapply]')) { const q = R.getElementById('riq'), v = q && q.value.trim(); return this._setRoomIcon(/^[a-z]+:[\w-]+$/.test(v || '') ? v : ''); }
      if ((x = g('[data-script]'))) { this._closePop(); return this._scripts(this._room, [x.dataset.script]); }
      if (g('[data-scriptfav]')) { const f = this._RES.tabs.find(q => q.fav); return f && this._scripts(this._room, f.fx.slice()); }
      if (g('[data-reset]')) { this._closePop(); this._snap(); saveRoomCfg(this._room, null); return this._toast(t('resetDone')); }
      if ((x = g('[data-copyto]'))) {
        this._closePop();
        const M = this._M, src = this._RES, to = x.dataset.copyto === '*' ? M.order.filter(r => r !== this._room && r !== '_all') : [x.dataset.copyto];
        this._snap();
        const T = Object.assign({}, STORE.d.tabs || {});
        to.forEach(r => {
          const U2 = this._effects(this._lightsOf(M, r));
          T[r] = { tabs: src.tabs.map(q => { const o = { id: q.id, fx: q.fx.filter(k => U2.has(k)) }; ['name', 'icon', 'fav', 'auto'].forEach(f => { if (q[f] != null) o[f] = q[f]; }); if (!o.name && !o.fav && !o.auto) o.name = this._tabName(q); return o; }), hid: src.hid.filter(k => U2.has(k)) };
          if (this._lightIcon()) T[r].light_icon = this._lightIcon();
        });
        STORE.set('tabs', T);
        return this._toast(t('copied', { r: to.length > 1 ? t('toAll') : t('toRoom', { r: this._roomName(to[0]) }) }));
      }
      // tabs
      if ((x = g('[data-edtab]'))) { ev.stopPropagation(); return this._editTabPop(x.closest('.tb'), x.dataset.edtab); }
      if ((x = g('[data-ticon]'))) {
        const [id, ic] = x.dataset.ticon.split('|'); this._closePop();
        return this._edit(this._room, cfg => {
          if (id === '_light') { if (ic) cfg.light_icon = ic; else delete cfg.light_icon; return; }
          const q = cfg.tabs.find(y => y.id === id); if (!q) return false; if (ic) q.icon = ic; else delete q.icon;
        });
      }
      if ((x = g('[data-tdel]'))) {
        const id = x.dataset.tdel, nm = this._tabName(this._RES.tabs.find(q => q.id === id) || { id }); this._closePop();
        return this._edit(this._room, cfg => { const q = cfg.tabs.find(y => y.id === id); if (!q || q.fav) return false; cfg.hid = [...cfg.hid, ...q.fx.filter(k => !cfg.hid.includes(k))]; cfg.tabs = cfg.tabs.filter(y => y !== q); }, t('tabDel', { t: nm }));
      }
      if ((x = g('[data-addtab]'))) return this._addTabPop(x);
      if ((x = g('[data-addt]'))) {
        const v = x.dataset.addt, U = this._U, grp = this._grp(U); this._closePop();
        if (v === '_empty') { const id = newId(); this._edit(this._room, cfg => { cfg.tabs.push({ id, name: t('newTab'), fx: [] }); }); this._tab[this._room] = id; this._render(); const el = this.shadowRoot.querySelector(`[data-tabsel="${id}"]`); if (el) this._editTabPop(el, id); return; }
        if (v.startsWith('g:')) { const gk = v.slice(2); this._copyTab({ id: 'g_' + gk, auto: gk, name: GNAME[this._l()][gk], fx: [...U.keys()].filter(k => grp(k) === gk) }, this._room); return this._toast(t('tabAdded', { t: GNAME[this._l()][gk] })); }
        const p = v.split(':'), r = p[1], id = p.slice(2).join(':'), M = this._M, src = this._resolve(r, this._effects(this._lightsOf(M, r))).tabs.find(q => q.id === id);
        if (src) { this._copyTab(src, this._room); this._toast(t('tabAdded', { t: this._tabName(src) })); }
        return;
      }
      if ((x = g('[data-tabsel]')) && !g('button')) { this._fill = null; if (x.dataset.tabsel !== '_mine') this._ce = null; this._tab[this._room] = x.dataset.tabsel; this._pick.clear(); this._q = ''; return this._render(); }
      // effects
      if ((x = g('[data-fxm]'))) { ev.stopPropagation(); return this._fxPop(x, x.dataset.fxm); }
      if ((x = g('[data-fxfav]'))) {
        const k = x.dataset.fxfav, favT = this._RES.tabs.find(q => q.fav); this._closePop(); if (!favT) return;
        if (favT.fx.includes(k)) return this._edit(this._room, cfg => { const f = cfg.tabs.find(q => q.fav); f.fx = f.fx.filter(q => q !== k); }, t('saved'));
        return this._moveFx([k], favT.id);
      }
      if ((x = g('[data-fxhide]'))) {
        const k = x.dataset.fxhide, U = this._U; this._closePop();
        if (!this._RES.hid.includes(k)) return this._moveFx([k], '_hid');
        return this._edit(this._room, cfg => { cfg.hid = cfg.hid.filter(q => q !== k); }, t('shownFx', { x: this._label(U.get(k)) }));
      }
      if (g('[data-icup]')) { this._closePop(); const f = R.getElementById('icf'); if (f) f.click(); return; }
      if (g('[data-icrm]')) { this._closePop(); STORE.iconDel(this._iconFor); return; }
      if (g('[data-clr]')) { this._pick.clear(); return this._render(); }
      // lights: × takes a light out of the room, a click opens what can be done with it
      if ((x = g('[data-lout]'))) { ev.stopPropagation(); this._closePop(); return this._lightOut(x.dataset.lout); }
      if ((x = g('[data-lfx]'))) { const id = x.dataset.lfx, S = this._set(), U = Object.assign({}, S.fx_use), want = !this._fxOn(id); delete U[id]; if (fxOn(Object.assign({}, S, { fx_use: U }), id, this._fxCount(id)) !== want) U[id] = want; this._closePop(); return this._save({ fx_use: Object.keys(U).length ? U : null }, want ? null : null); }
      if ((x = g('[data-lto]'))) { const [id, to] = x.dataset.lto.split('|'); this._closePop(); return this._moveLights([id], to); }
      if ((x = g('[data-lmenu]')) && !inPop) return this._lightPop(x, x.dataset.lmenu);
      if ((x = g('[data-d]')) && !g('button,input') && !inPop) {
        const v = x.dataset.d, i = v.indexOf('|'), type = v.slice(0, i), id = v.slice(i + 1); if (type !== 'fx') return;
        // preview on: a click plays the effect instead of selecting it
        if (this._pv) return this._pvPlay(id);
        const vis = [...x.parentElement.querySelectorAll(':scope > [data-d]')].filter(el => el.style.display !== 'none' && el.dataset.d.startsWith(type + '|')).map(el => el.dataset.d.slice(i + 1));
        [...this._pick].forEach(k => { if ((type === 'light') !== k.startsWith('light.')) this._pick.delete(k); });
        if (ev.shiftKey && this._last && vis.includes(this._last)) { const a = vis.indexOf(this._last), b = vis.indexOf(id); vis.slice(Math.min(a, b), Math.max(a, b) + 1).forEach(q => this._pick.add(q)); }
        else this._pick.has(id) ? this._pick.delete(id) : this._pick.add(id);
        this._last = id; return this._render();
      }
    });
    app.addEventListener('contextmenu', e => { const tl = e.target.closest('.fx[data-d]'); if (!tl) return; e.preventDefault(); const v = tl.dataset.d; this._fxPop(tl, v.slice(v.indexOf('|') + 1)); });
    app.addEventListener('input', e => {
      if (e.target.id === 'aq') { this._q = e.target.value; this._filterAll(); }
      if (e.target.id === 'gb') { const bv = R.getElementById('bv'); if (bv) bv.textContent = '%' + e.target.value; }
      if (e.target.id === 'cename' && this._ce) this._ce.name = e.target.value;
      if (e.target.id === 'ceiq') { const v = e.target.value.toLocaleLowerCase(this._l()).trim(); R.querySelectorAll('#ceig button').forEach(b => { b.style.display = !v || b.dataset.n.includes(v) ? '' : 'none'; }); }
    });
    app.addEventListener('change', e => {
      const x = e.target;
      if (x.id === 'gb') return this._save({ brightness: +x.value });
      if (x.id === 'nf' || x.id === 'nt') return this._save({ [x.id === 'nf' ? 'night_from' : 'night_to']: x.value || null });
      if (x.id === 'bkf') {
        const f = x.files && x.files[0]; x.value = ''; if (!f) return;
        const rd = new FileReader(); rd.onload = () => { let b = null; try { b = JSON.parse(rd.result); } catch (e) {} if (!b || b.format !== 'lemur-light-effects-backup' || !b.data) return this._toast(this._t('bkErr'), false); this._bk = b; this._view = 'restore'; this._render(); }; rd.readAsText(f); return;
      }
      if (this._fill) {
        const d = x.dataset, F = this._fill;
        if (d.fm) { const nv = x.value, light = d.fm === '_all' ? null : d.fm; const v = nv === 'auto' || nv === 'skip' || nv === 'off' ? { mode: nv } : this._ceDefault(nv, light); if (nv === 'color' && d.fm !== '_all' && F.cfg.all && F.cfg.all.rgb) v.rgb = F.cfg.all.rgb.slice(); if (d.fm === '_all') F.cfg.all = v; else { F.cfg.lights = F.cfg.lights || {}; F.cfg.lights[d.fm] = v; } return this._render(); }
        if (d.ffx) { this._fillSlot(d.ffx).fx = x.value; return; }
        if (d.frgb) { this._fillSlot(d.frgb).rgb = hexRgb(x.value); return; }
        if (d.fk) { this._fillSlot(d.fk).k = +x.value; return; }
        if (d.fbr) { const v = Math.max(1, Math.min(100, Math.round(+x.value || 0))); const sl = this._fillSlot(d.fbr); if (x.value === '' || !v) delete sl.br; else sl.br = v; return; }
      }
      if (this._ce) {
        const c = this._ce, d = x.dataset;
        if (x.id === 'cebase') { const A = this._allFx(); c.base = x.value; c.base_name = x.value ? A.get(x.value) || '' : ''; return this._render(); }
        if (d.cm) { const nv = x.value; if (d.cm === '_fb') c.fallback = this._ceDefault(nv); else { c.lights = c.lights || {}; c.lights[d.cm] = this._ceDefault(nv, d.cm); } return this._render(); }
        if (d.cfx) { this._ceSlot(d.cfx).fx = x.value; return; }
        if (d.crgb) { this._ceSlot(d.crgb).rgb = hexRgb(x.value); return; }
        if (d.ck) { this._ceSlot(d.ck).k = +x.value; return; }
        if (d.cbr) { const v = Math.max(1, Math.min(100, Math.round(+x.value || 0))); const sl = this._ceSlot(d.cbr); if (x.value === '' || !v) delete sl.br; else sl.br = v; return; }
      }
      if (x.dataset.tname) {
        if (x.dataset.done) return; x.dataset.done = '1';
        const id = x.dataset.tname, v = x.value.trim(), cur = this._RES.tabs.find(q => q.id === id);
        if (!cur || !v || v === this._tabName(cur)) return;
        this._closePop(); this._edit(this._room, cfg => { const q = cfg.tabs.find(y => y.id === id); if (!q) return false; q.name = v; }, t('saved'));
      }
    });
    app.addEventListener('keydown', e => { if (e.target.dataset && e.target.dataset.tname && e.key === 'Enter') { e.preventDefault(); e.target.dispatchEvent(new Event('change', { bubbles: true })); this._closePop(); } });
    const icf = R.getElementById('icf');
    if (icf) icf.onchange = async () => {
      const f = icf.files && icf.files[0], k = this._iconFor; if (!f || !k) return;
      try { await STORE.icon(k, 'image/png', await toPngB64(f)); this._toast(t('iconSaved'), false); } catch (e) { this._toast(t('iconErr'), false); }
    };
  }
}

// ---- German, Spanish and French (generated by dev/i18n_more.py) ----
const LANG_NAMES = {"tr": "Türkçe", "en": "English", "de": "Deutsch", "es": "Español", "fr": "Français"};
Object.assign(I18N, {"de": {"light": "Licht", "fav": "Favoriten", "allHome": "Ganzes Zuhause", "unassigned": "Ohne Raum", "lights": "{n} Lichter", "off": "Aus", "playing": "Läuft", "mixed": "Gemischt", "none": "Keine", "color": "Farbe", "random": "Zufall", "stop": "Stopp", "turnOff": "Ausschalten", "selectFirst": "Zuerst Lichter wählen (Lichtsymbole unten)", "noFx": "Keine Effekte in dieser Gruppe", "noCap": "Die gewählten Lichter haben keine Effekte", "some": "Bei einigen Lichtern", "someNote": "nur an Lichter, die ihn können", "panelSub": "An welche Lichter sollen Effekte gehen? Gilt für alle im Haushalt.", "done": "Fertig", "selectAll": "Alle wählen", "common": "gemeinsame Effekte", "fx": "Effekte", "isOn": "an", "isOff": "aus", "white": "Weißton", "stopTo": "Stopp →", "favEmpty": "Noch keine Favoriten. Einen Effekt lange drücken (am Computer Rechtsklick) und „Zu Favoriten“ wählen.", "addFav": "Zu Favoriten", "remFav": "Aus Favoriten entfernen", "setIcon": "Symbol hochladen", "resetIcon": "Standardsymbol", "hide": "Effekt ausblenden", "hidden": "{x} ausgeblendet", "turnedOff": "{r} ausgeschaltet", "turnedOn": "{r} eingeschaltet", "stopped": "Effekt gestoppt · {k}K {b} %", "support": "Unterstützt von", "noLights": "Keine Lichter in diesem Raum", "applied": "{r} → {x}", "partial": "{x} → {a}/{b} Lichter", "iconSaved": "Symbol gespeichert", "iconErr": "Symbol konnte nicht hochgeladen werden", "err": "Fehler: {e}", "toColor": "{r} → Farbe", "localMode": "Integration installieren, um zu teilen (nur auf diesem Gerät gespeichert)", "close": "Schließen", "upd": "Eine neue Version ist installiert ({v}). Seite neu laden.", "reload": "Neu laden", "recent": "Zuletzt verwendet", "fillB": "Fehlende Lichter ergänzen", "fillE": "Ergänzung bearbeiten", "filled": "Lichter ohne diesen Effekt tun, was du gewählt hast", "fillLbl": "ergänzt", "mRoom": "Raum", "mChange": "Wechseln", "mLit": "{a} von {b} Lichtern an", "mAllOff": "Lichter aus", "mPick": "Raum wählen", "mLights": "Lichter wählen", "mPlaying": "läuft · auf {n} Lichtern", "mMixed": "Verschiedene Effekte laufen", "mIdle": "Kein Effekt · tippe einen an", "mLight": "Licht: {x}", "mOff": "Lichter sind aus", "mBright": "Helligkeit", "mRecent": "Zuletzt gespielt", "mAll": "Alle Effekte", "mLightTab": "Weiß & Farbe", "mSearch": "Effekte suchen", "mCount": "{n} Effekte", "mNoRes": "Keine Treffer", "recEmpty": "In diesem Raum lief noch kein Effekt. Gespielte Effekte erscheinen hier.", "mSelFirst": "Wähle zuerst Lichter: Raumfeld oben → Lichter wählen", "kel": ["Glühlampe", "Warm", "Sanft", "Neutral", "Tageslicht", "Kalt"]}, "es": {"light": "Luz", "fav": "Favoritos", "allHome": "Toda la casa", "unassigned": "Sin estancia", "lights": "{n} luces", "off": "Apagada", "playing": "Sonando", "mixed": "Mezclado", "none": "Ninguna", "color": "Color", "random": "Aleatorio", "stop": "Detener", "turnOff": "Apagar", "selectFirst": "Elige primero las luces (iconos de luz abajo)", "noFx": "No hay efectos en este grupo", "noCap": "Las luces elegidas no tienen efectos", "some": "En algunas luces", "someNote": "solo va a las luces que lo tienen", "panelSub": "¿A qué luces van los efectos? Se guarda para todos en casa.", "done": "Listo", "selectAll": "Elegir todas", "common": "efectos comunes", "fx": "efectos", "isOn": "encendida", "isOff": "apagada", "white": "Tono blanco", "stopTo": "Detener →", "favEmpty": "Aún no hay favoritos. Mantén pulsado un efecto (clic derecho en el ordenador) y elige «Añadir a favoritos».", "addFav": "Añadir a favoritos", "remFav": "Quitar de favoritos", "setIcon": "Subir icono", "resetIcon": "Icono por defecto", "hide": "Ocultar efecto", "hidden": "{x} oculto", "turnedOff": "{r} apagada", "turnedOn": "{r} encendida", "stopped": "Efecto detenido · {k}K {b} %", "support": "Lo tienen", "noLights": "No hay luces en esta estancia", "applied": "{r} → {x}", "partial": "{x} → {a}/{b} luces", "iconSaved": "Icono guardado", "iconErr": "No se pudo subir el icono", "err": "Error: {e}", "toColor": "{r} → color", "localMode": "Instala la integración para compartir (ahora solo se guarda en este dispositivo)", "close": "Cerrar", "upd": "Hay una versión nueva instalada ({v}). Recarga la página.", "reload": "Recargar", "recent": "Usados hace poco", "fillB": "Completar las luces que faltan", "fillE": "Editar cómo se completa", "filled": "Las luces sin este efecto hacen lo que elegiste", "fillLbl": "completado", "mRoom": "Habitación", "mChange": "Cambiar", "mLit": "{a} de {b} luces encendidas", "mAllOff": "luces apagadas", "mPick": "Elige una habitación", "mLights": "Elegir luces", "mPlaying": "sonando · en {n} luces", "mMixed": "Suenan efectos distintos", "mIdle": "Ningún efecto · toca uno", "mLight": "Luz: {x}", "mOff": "Las luces están apagadas", "mBright": "Brillo", "mRecent": "Recientes", "mAll": "Todos los efectos", "mLightTab": "Blanco y color", "mSearch": "Buscar efectos", "mCount": "{n} efectos", "mNoRes": "Sin resultados", "recEmpty": "Aún no se ha puesto ningún efecto en esta habitación. Los que pongas aparecerán aquí.", "mSelFirst": "Primero elige luces: cuadro de la habitación arriba → Elegir luces", "kel": ["Incandescente", "Cálida", "Suave", "Neutra", "Luz de día", "Fría"]}, "fr": {"light": "Lumière", "fav": "Favoris", "allHome": "Toute la maison", "unassigned": "Sans pièce", "lights": "{n} lumières", "off": "Éteinte", "playing": "En cours", "mixed": "Mixte", "none": "Aucune", "color": "Couleur", "random": "Aléatoire", "stop": "Arrêter", "turnOff": "Éteindre", "selectFirst": "Choisissez d’abord les lumières (icônes en bas)", "noFx": "Aucun effet dans ce groupe", "noCap": "Les lumières choisies n’ont pas d’effets", "some": "Sur certaines lumières", "someNote": "envoyé seulement aux lumières qui l’ont", "panelSub": "Vers quelles lumières vont les effets ? Enregistré pour toute la maison.", "done": "OK", "selectAll": "Tout choisir", "common": "effets communs", "fx": "effets", "isOn": "allumée", "isOff": "éteinte", "white": "Ton blanc", "stopTo": "Arrêter →", "favEmpty": "Pas encore de favoris. Appuyez longuement sur un effet (clic droit sur ordinateur) et choisissez « Ajouter aux favoris ».", "addFav": "Ajouter aux favoris", "remFav": "Retirer des favoris", "setIcon": "Envoyer une icône", "resetIcon": "Icône par défaut", "hide": "Masquer l’effet", "hidden": "{x} masqué", "turnedOff": "{r} éteinte", "turnedOn": "{r} allumée", "stopped": "Effet arrêté · {k}K {b} %", "support": "Disponible sur", "noLights": "Aucune lumière dans cette pièce", "applied": "{r} → {x}", "partial": "{x} → {a}/{b} lumières", "iconSaved": "Icône enregistrée", "iconErr": "Impossible d’envoyer l’icône", "err": "Erreur : {e}", "toColor": "{r} → couleur", "localMode": "Installez l’intégration pour partager (enregistré sur cet appareil seulement)", "close": "Fermer", "upd": "Une nouvelle version est installée ({v}). Rechargez la page.", "reload": "Recharger", "recent": "Utilisés récemment", "fillB": "Compléter les lumières manquantes", "fillE": "Modifier le complément", "filled": "Les lumières sans cet effet font ce que vous avez choisi", "fillLbl": "complété", "mRoom": "Pièce", "mChange": "Changer", "mLit": "{a} sur {b} lumières allumées", "mAllOff": "lumières éteintes", "mPick": "Choisir une pièce", "mLights": "Choisir les lumières", "mPlaying": "en cours · sur {n} lumières", "mMixed": "Plusieurs effets en cours", "mIdle": "Aucun effet · touchez-en un", "mLight": "Lumière : {x}", "mOff": "Les lumières sont éteintes", "mBright": "Luminosité", "mRecent": "Joués récemment", "mAll": "Tous les effets", "mLightTab": "Blanc et couleur", "mSearch": "Rechercher un effet", "mCount": "{n} effets", "mNoRes": "Aucun résultat", "recEmpty": "Aucun effet joué dans cette pièce pour l’instant. Ceux que vous jouez apparaîtront ici.", "mSelFirst": "Choisissez d’abord les lumières : bloc de la pièce en haut → Choisir les lumières", "kel": ["Incandescent", "Chaud", "Doux", "Neutre", "Lumière du jour", "Froid"]}});
Object.assign(GNAME, {"de": {"all": "Effekte", "mine": "Meine Effekte", "nature": "Natur", "sky": "Himmel & All", "home": "Zuhause", "color": "Farbe & Kunst", "fun": "Spaß", "other": "Sonstige"}, "es": {"all": "Efectos", "mine": "Mis efectos", "nature": "Naturaleza", "sky": "Cielo y espacio", "home": "Hogar", "color": "Color y arte", "fun": "Diversión", "other": "Otros"}, "fr": {"all": "Effets", "mine": "Mes effets", "nature": "Nature", "sky": "Ciel & espace", "home": "Maison", "color": "Couleur & art", "fun": "Fête", "other": "Autres"}});
Object.assign(P_TXT, {"de": {"title": "Lemur Light Effect Card", "undo": "Rückgängig", "undoK": "Rückgängig (Strg+Z)", "more": "Mehr", "settings": "Einstellungen", "settingsS": "Aussehen, Verhalten, Nachtmodus, eigene Effekte", "allHome": "Ganzes Zuhause", "none": "Ohne Raum", "hiddenRoom": "In der Karte ausgeblendet", "addRoom": "Raum", "addRoomT": "Bereiche ohne Lichter", "addRoomNone": "Keine Bereiche ohne Lichter", "lightsOf": "Lichter in {r}", "allLights": "Alle Lichter", "hiddenLights": "In der Karte ausgeblendete Lichter", "noLight": "Keine Lichter in diesem Raum", "noHidden": "Keine ausgeblendeten Lichter", "allUses": "Der Tab „Ganzes Zuhause“ nutzt alle Lichter im Haus", "allOff": "„Ganzes Zuhause“ ist in der Karte aus", "allOffB": "„Ganzes Zuhause“ ausschalten", "offShort": "aus", "allOnB": "„Ganzes Zuhause“ einschalten", "addLight": "Licht hinzufügen", "lHide": "In der Karte ausblenden", "lBack": "Zurück in den eigenen Raum · {r}", "lMove": "In einen anderen Raum verschieben", "addLightT": "Licht hinzufügen → {r}", "searchL": "Lichter suchen", "fxN": "{n} Effekte", "noFxL": "keine Effekte", "lOnly": "Nur Licht", "fxUse": "Für Effekte nutzen", "fxUseS": "Wenn aus, nur für Weißton, Farbe und Helligkeit; ändert die Effektliste nicht.", "fxNone": "Keine Effekte, nur Licht", "fxCnt": "{n} Lichter · {f} für Effekte", "why": {"manual": "von dir ausgeblendet", "segment": "Segment", "indicator": "Anzeige-LED", "screen": "Browser-Bildschirm", "device": "Geräteleuchte"}, "allFx": "Alle Effekte", "allFxS": "{n} Effekte · auf Tabs ziehen", "light": "Licht", "lightE": "Weißton, Farbe und Helligkeit. Dieser Tab ist fest und immer zuerst.", "fav": "Favoriten", "hid": "Ausgeblendet", "addTab": "Tab hinzufügen", "emptyTab": "Leerer Tab", "newTab": "Neuer Tab", "ready": "Vorlagen", "fromRooms": "Aus anderen Räumen", "edit": "Bearbeiten", "delTab": "Tab löschen", "search": "Effekte suchen", "dropHere": "Effekte hierher ziehen", "noHidFx": "Keine ausgeblendeten Effekte", "hiddenRoomE": "Diese Lichter erscheinen nie in der Karte. Zum Zurückholen auf einen Raum oben ziehen.", "noLightE": "Noch keine Lichter in diesem Raum", "noFxRoom": "Die Lichter in diesem Raum haben keine Effekte. Der Tab „Licht“ funktioniert trotzdem.", "selN": "{n} ausgewählt", "selHint": "auf einen Tab ziehen", "clear": "Auswahl aufheben", "reset": "{r}: zurück zum automatischen Aufbau", "roomOff": "Raum in der Karte ausblenden", "roomOn": "Raum in der Karte zeigen", "copyT": "Tabs von {r} kopieren nach", "copyAll": "Alle Räume", "moved": "{x} → {r}", "nLights": "{n} Lichter", "nFx": "{n} Effekte", "hiddenFx": "{x} in diesem Raum ausgeblendet", "shownFx": "{x} wird wieder gezeigt", "favAdd": "{x} zu Favoriten hinzugefügt", "tabDel": "„{t}“ gelöscht, seine Effekte sind jetzt ausgeblendet", "tabCopied": "Tab „{t}“ kopiert → {r}", "tabAdded": "Tab „{t}“ hinzugefügt", "copied": "Tabs kopiert → {r}", "toRoom": "{r}", "toAll": "alle Räume", "resetDone": "Zurück zum automatischen Aufbau", "roomOffT": "Raum in der Karte ausgeblendet", "roomOnT": "Raum in der Karte gezeigt", "allOffT": "„Ganzes Zuhause“ ist in der Karte aus", "allOnT": "„Ganzes Zuhause“ ist in der Karte an", "order": "Reihenfolge geändert", "saved": "Gespeichert", "undone": "Rückgängig gemacht", "fxMenu": "Effektdetails", "namesOn": "Name auf jedem Licht", "upIcon": "Symbol hochladen", "rmIcon": "Standardsymbol", "hideFx": "In diesem Raum ausblenden", "showFx": "In diesem Raum zeigen", "addFav": "Zu Favoriten", "remFav": "Aus Favoriten entfernen", "iconSaved": "Symbol gespeichert", "iconErr": "Symbol konnte nicht hochgeladen werden", "close": "Schließen", "sCard": "Karte", "icColor": "Farbig", "icMono": "Schlicht", "defIcon": "Standardsymbol", "searchI": "Symbole suchen", "lang": "Sprache", "auto": "Automatisch", "sStop": "Wenn ein Effekt gestoppt wird", "white": "Weißton", "bright": "Helligkeit", "sAdv": "Erweitert", "thr": "Mindestanzahl Effekte für ein Effektlicht", "thrS": "Lichter mit weniger Effekten erscheinen nur im Tab „Licht“", "thrN": "{n} Effekte", "local": "Die Integration scheint nicht geladen zu sein; Änderungen können nicht gespeichert werden.", "sLook": "Aussehen", "tileSize": "Kachelgröße", "tsAuto": "Automatisch", "tsS": "Klein", "tsM": "Mittel", "tsL": "Groß", "icStyle": "Effektsymbole", "icColorS": "Farbig", "icMonoS": "Schlicht (einfarbig)", "showNames": "Effektnamen", "showNamesS": "Wenn aus, zeigen Kacheln nur das Symbol", "bg": "Hintergrund", "bgDark": "Dunkel", "bgBlack": "Schwarz (OLED)", "bgTheme": "Home-Assistant-Design", "bgThemeS": "Mit Design folgen Hintergrund und Text deinem Home-Assistant-Design", "showBar": "Farblinie", "showBarS": "Die farbige Linie unter den Kacheln", "showDots": "Unterstützungspunkte", "showDotsS": "Punkte, wie viele Lichter einen Effekt können", "sButtons": "Untere Leiste", "showStop": "Stopp-Taste", "showRandom": "Zufall-Taste", "showRandomS": "In der breiten Ansicht", "sBehave": "Verhalten", "fxOn": "Wenn ein Effekt für ein ausgeschaltetes Licht gewählt wird", "fxOnS": "Das Licht geht mit dieser Helligkeit an", "fxOnOff": "Eigene Einstellung des Lichts", "startTab": "Beim Öffnen der Karte", "stAuto": "Automatisch", "stFav": "Favoriten", "stLast": "Zuletzt verwendet", "stLight": "Licht", "lp": "Dauer für langes Drücken", "lpS": "Wie lange halten, bis das Effektmenü aufgeht", "haptic": "Vibration", "hapticS": "Bei Tippen und langem Drücken (auf Telefonen, die es können)", "sRooms": "Räume und Lichter", "groups": "Auch Lichtgruppen zeigen", "groupsS": "Lichtgruppen aus Home Assistant erscheinen wie ein Licht", "sNight": "Nachtmodus", "night": "Nachtmodus", "nightS": "Zwischen diesen Zeiten ist die Helligkeit begrenzt (Effekte, Stopp, Helligkeit)", "from": "Von", "to": "Bis", "nightMax": "Höchste Helligkeit", "sMine": "Eigene Effekte", "mineS": "Effekt wählen, festlegen was Lichter ohne ihn tun, und er erscheint in der Karte wie jeder andere.", "mineNew": "Neuer Effekt", "mineNone": "Noch keine eigenen Effekte", "sReset": "Zurücksetzen", "resetAll": "Alles zurücksetzen", "resetAllS": "Einstellungen, Raum- und Lichtaufteilung, Tabs, Favoriten, ausgeblendete Effekte, hochgeladene Symbole und eigene Effekte werden gelöscht", "resetQ": "Alles zurücksetzen?", "resetW": "Gelöscht werden die Einstellungen, die Raum- und Lichtaufteilung, alle Tabs, Favoriten, ausgeblendete Effekte, hochgeladene Symbole und deine eigenen Effekte. Jede Karte im Haus ist danach wie nach der Installation. Das lässt sich nicht rückgängig machen.", "resetYes": "Ja, alles zurücksetzen", "cancel": "Abbrechen", "resetOk": "Alles wurde zurückgesetzt", "roomIcon": "Raumsymbol", "roomIconT": "Symbol für {r}", "mdiPh": "mdi:symbol-name", "apply": "Übernehmen", "script": "Als Skript speichern", "scriptFav": "Skripte aus Favoriten erstellen", "scriptOk": "{n} Skripte gespeichert (Einstellungen → Automationen & Szenen → Skripte)", "scriptErr": "Skript konnte nicht gespeichert werden: {e}", "editMine": "Bearbeiten", "delMine": "Löschen", "mineDel": "„{x}“ gelöscht", "notHere": "Dieser Effekt hat kein Licht in {r}; zuerst ein Licht aus diesem Raum zum Effekt hinzufügen", "mineDrag": "Auf einen Tab links ziehen, um ihn dorthin zu verschieben", "mineTab": "Effekt erstellen", "mineTabS": "{n} Effekte · Lichter ziehen", "mineList": "Eigene Effekte", "mineEmpty": "Noch keine eigenen Effekte. Mit „Neuer Effekt“ beginnen: Lichter nach rechts ziehen und für jedes festlegen, was es tut.", "back": "Zurück", "allL": "Alle Lichter", "allLS": "Ziehen oder mit + hinzufügen", "inFx": "Lichter in diesem Effekt", "inFxS": "Hierher ziehen und für jedes Licht festlegen, was es tut", "dropL": "Lichter hierher ziehen", "addAllR": "Alle hinzufügen", "remL": "Entfernen", "allIn": "Alle Lichter sind drin", "fbDef": "Wenn einem automatischen Licht der Basiseffekt fehlt", "nLin": "{n} Lichter", "ceTitle": "Eigener Effekt", "ceName": "Name", "ceIcon": "Symbol", "ceBase": "Basiseffekt", "ceBaseS": "Lichter, die ihn haben, spielen diesen Effekt", "ceNoBase": "Keiner, ich wähle für jedes Licht", "ceFb": "Lichter ohne ihn", "ceFbS": "Lichter ohne den Basiseffekt oder nur als Licht genutzt", "ceLights": "Licht für Licht", "ceLightsS": "Jedes Licht nach Wunsch ändern", "save": "Speichern", "del": "Löschen", "bri": "Helligkeit", "ceNameErr": "Einen Namen eingeben", "ceSaved": "„{x}“ gespeichert", "ceHint": "Erscheint in der Karte unter „Meine Effekte“.", "m_auto": "Automatisch", "m_fx": "Effekt", "m_color": "Farbe", "m_white": "Weiß", "m_off": "Ausschalten", "m_skip": "Unverändert lassen", "supBase": "spielt den Basiseffekt", "noBase": "kein Basiseffekt", "autoIs": "automatisch: {x}", "upd": "Eine neue Version ist installiert ({v}). Seite neu laden.", "reload": "Neu laden", "fade": "Übergang", "fadeS": "Farbe, Weiß, Helligkeit und Ausschalten wechseln sanft (bei Lichtern, die es können)", "fadeNo": "Keiner", "showRecent": "Tab „Zuletzt verwendet“", "showRecentS": "Zuletzt gespielte Effekte im Raum, neben den Favoriten", "sBackup": "Sicherung", "bkDown": "Sicherung herunterladen", "bkDownS": "Räume, Tabs, Favoriten, eigene Effekte, Einstellungen und Symbole in einer Datei", "bkUp": "Sicherung wiederherstellen", "bkUpS": "Eine Sicherungsdatei wählen; sie ersetzt den aktuellen Aufbau", "bkQ": "Diese Sicherung wiederherstellen?", "bkW": "Sicherung vom {d}. Die aktuellen Räume, Tabs, Favoriten, eigenen Effekte, Einstellungen und Symbole werden dadurch ersetzt.", "bkYes": "Wiederherstellen", "bkOk": "Sicherung wiederhergestellt", "bkErr": "Diese Datei ist keine Lemur-Sicherung", "bkSaved": "Sicherung heruntergeladen", "bkBusy": "Sicherung wird vorbereitet…", "fillT": "Fehlende Lichter ergänzen", "fillHead": "{x} · Fehlende ergänzen", "fillS": "Was sollen Lichter ohne diesen Effekt tun? Deine Wahl geht zusammen mit dem Effekt an, so füllt er den ganzen Raum.", "fillSup": "Lichter mit diesem Effekt", "fillMiss": "Lichter ohne diesen Effekt", "fillAll": "Für alle", "fillAllS": "Jedes Licht, das du nicht einzeln einstellst, tut das", "fillNone": "Alle Lichter im Haus haben diesen Effekt; nichts zu ergänzen.", "fillSaved": "„{x}“ ergänzt", "fillDel": "Ergänzung entfernen", "fillDeleted": "Ergänzung für „{x}“ entfernt", "m_def": "Wie bei „Für alle“", "fillOn": "Ergänzt", "fillTag": "ergänzt", "fillNoEff": "hat ihn, wird aber nicht für Effekte genutzt", "pvB": "Vorschau", "pvT": "Solange sie an ist, läuft der angeklickte Effekt sofort auf den Lichtern", "pvOn": "Vorschau an", "pvWhere": "der angeklickte Effekt läuft auf den Lichtern von:", "pvNow": "jetzt: {x}", "pvBack": "Lichter zurücksetzen", "pvKeep": "So lassen", "pvBackT": "Die Lichter sind wieder wie vor der Vorschau", "pvKeepT": "Der letzte Effekt läuft weiter", "pvErr": "Vorschau hat nicht funktioniert: {e}", "pvNoRoom": "Wähle einen Raum für die Vorschau", "startTabS": "„Zuletzt verwendet“: der Raum und Tab, die du auf diesem Gerät zuletzt offen hattest", "sVer": "Version und Updates", "updT": "Version", "updInst": "Installiert: v{v}", "updCheck": "Nach Updates suchen", "updChecking": "Wird geprüft…", "updOk": "aktuell", "updAt": "geprüft {t}", "updNew": "v{v} ist verfügbar", "updNotes": "Neuerungen", "updGo": "Aktualisieren", "updGh": "Auf GitHub öffnen", "updIng": "v{v} wird geladen…", "updDone": "v{v} ist geladen. Es gilt nach einem Neustart von Home Assistant.", "updRestart": "Neu starten", "updAsk": "Home Assistant neu starten? Lichtsteuerung und Automationen pausieren ein bis zwei Minuten.", "updYes": "Ja, neu starten", "updRest": "Neustart läuft… Die Seite lädt sich danach selbst neu.", "updErr": "Prüfung fehlgeschlagen: {e}", "updAgain": "Erneut prüfen", "updNoHacs": "Nicht über HACS installiert, daher hier nicht installierbar"}, "es": {"title": "Lemur Light Effect Card", "undo": "Deshacer", "undoK": "Deshacer (Ctrl+Z)", "more": "Más", "settings": "Ajustes", "settingsS": "Aspecto, comportamiento, modo noche, tus efectos", "allHome": "Toda la casa", "none": "Sin estancia", "hiddenRoom": "Ocultas en la tarjeta", "addRoom": "Estancia", "addRoomT": "Áreas sin luces", "addRoomNone": "No hay áreas sin luces", "lightsOf": "Luces de {r}", "allLights": "Todas las luces", "hiddenLights": "Luces ocultas en la tarjeta", "noLight": "No hay luces en esta estancia", "noHidden": "No hay luces ocultas", "allUses": "La pestaña Toda la casa usa todas las luces", "allOff": "Toda la casa está desactivada en la tarjeta", "allOffB": "Desactivar Toda la casa", "offShort": "no", "allOnB": "Activar Toda la casa", "addLight": "Añadir luz", "lHide": "Ocultar en la tarjeta", "lBack": "Volver a su estancia · {r}", "lMove": "Mover a otra estancia", "addLightT": "Añadir luz → {r}", "searchL": "Buscar luces", "fxN": "{n} efectos", "noFxL": "sin efectos", "lOnly": "Solo luz", "fxUse": "Usar para efectos", "fxUseS": "Si está apagado, solo se usa para tono, color y brillo y no cambia la lista de efectos.", "fxNone": "Sin efectos, solo luz", "fxCnt": "{n} luces · {f} para efectos", "why": {"manual": "ocultada por ti", "segment": "segmento", "indicator": "LED indicador", "screen": "pantalla del navegador", "device": "luz de aparato"}, "allFx": "Todos los efectos", "allFxS": "{n} efectos · arrástralos a pestañas", "light": "Luz", "lightE": "Tono blanco, color y brillo. Esta pestaña es fija y va siempre primero.", "fav": "Favoritos", "hid": "Ocultos", "addTab": "Añadir pestaña", "emptyTab": "Pestaña vacía", "newTab": "Pestaña nueva", "ready": "Ya preparadas", "fromRooms": "De otras estancias", "edit": "Editar", "delTab": "Borrar pestaña", "search": "Buscar efectos", "dropHere": "Arrastra efectos aquí", "noHidFx": "No hay efectos ocultos", "hiddenRoomE": "Estas luces nunca aparecen en la tarjeta. Arrastra una a una estancia de arriba para recuperarla.", "noLightE": "Aún no hay luces en esta estancia", "noFxRoom": "Las luces de esta estancia no tienen efectos. La pestaña Luz sigue funcionando.", "selN": "{n} elegidos", "selHint": "arrástralos a una pestaña", "clear": "Quitar selección", "reset": "{r}: volver a la disposición automática", "roomOff": "Ocultar estancia en la tarjeta", "roomOn": "Mostrar estancia en la tarjeta", "copyT": "Copiar pestañas de {r} a", "copyAll": "Todas las estancias", "moved": "{x} → {r}", "nLights": "{n} luces", "nFx": "{n} efectos", "hiddenFx": "{x} oculto en esta estancia", "shownFx": "{x} vuelve a mostrarse", "favAdd": "{x} añadido a favoritos", "tabDel": "«{t}» borrada, sus efectos pasan a Ocultos", "tabCopied": "Pestaña «{t}» copiada → {r}", "tabAdded": "Pestaña «{t}» añadida", "copied": "Pestañas copiadas → {r}", "toRoom": "{r}", "toAll": "todas las estancias", "resetDone": "De vuelta a la disposición automática", "roomOffT": "Estancia oculta en la tarjeta", "roomOnT": "Estancia visible en la tarjeta", "allOffT": "Toda la casa está desactivada en la tarjeta", "allOnT": "Toda la casa está activada en la tarjeta", "order": "Orden cambiado", "saved": "Guardado", "undone": "Deshecho", "fxMenu": "Detalles del efecto", "namesOn": "Nombre en cada luz", "upIcon": "Subir icono", "rmIcon": "Icono por defecto", "hideFx": "Ocultar en esta estancia", "showFx": "Mostrar en esta estancia", "addFav": "Añadir a favoritos", "remFav": "Quitar de favoritos", "iconSaved": "Icono guardado", "iconErr": "No se pudo subir el icono", "close": "Cerrar", "sCard": "Tarjeta", "icColor": "De color", "icMono": "Sencillo", "defIcon": "Icono por defecto", "searchI": "Buscar iconos", "lang": "Idioma", "auto": "Automático", "sStop": "Al detener un efecto", "white": "Tono blanco", "bright": "Brillo", "sAdv": "Avanzado", "thr": "Efectos mínimos para contar como luz de efectos", "thrS": "Las luces con menos efectos solo aparecen en la pestaña Luz", "thrN": "{n} efectos", "local": "La integración no parece cargada; los cambios no se pueden guardar.", "sLook": "Aspecto", "tileSize": "Tamaño de las casillas", "tsAuto": "Automático", "tsS": "Pequeño", "tsM": "Mediano", "tsL": "Grande", "icStyle": "Iconos de efectos", "icColorS": "De color", "icMonoS": "Sencillos (un color)", "showNames": "Nombres de efectos", "showNamesS": "Si está apagado, las casillas solo muestran el icono", "bg": "Fondo", "bgDark": "Oscuro", "bgBlack": "Negro (OLED)", "bgTheme": "Tema de Home Assistant", "bgThemeS": "Con el tema, el fondo y el texto siguen tu tema de Home Assistant", "showBar": "Línea de color", "showBarS": "La línea de color bajo las casillas", "showDots": "Puntos de compatibilidad", "showDotsS": "Puntos que muestran cuántas luces tienen un efecto", "sButtons": "Barra inferior", "showStop": "Botón Detener", "showRandom": "Botón Aleatorio", "showRandomS": "Se ve en la vista ancha", "sBehave": "Comportamiento", "fxOn": "Al elegir un efecto para una luz apagada", "fxOnS": "La luz se enciende con este brillo", "fxOnOff": "Ajuste propio de la luz", "startTab": "Al abrir la tarjeta", "stAuto": "Automático", "stFav": "Favoritos", "stLast": "El último usado", "stLight": "Luz", "lp": "Tiempo de pulsación larga", "lpS": "Cuánto mantener pulsado para abrir el menú del efecto", "haptic": "Vibración", "hapticS": "Al tocar y mantener pulsado (en teléfonos que lo admiten)", "sRooms": "Estancias y luces", "groups": "Mostrar también grupos de luces", "groupsS": "Los grupos de luces de Home Assistant aparecen como una luz", "sNight": "Modo noche", "night": "Modo noche", "nightS": "Entre estas horas el brillo tiene un tope (efectos, Detener, brillo)", "from": "Desde", "to": "Hasta", "nightMax": "Brillo máximo", "sMine": "Tus efectos", "mineS": "Elige un efecto, decide qué hacen las luces que no lo tienen y aparece en la tarjeta como cualquier otro.", "mineNew": "Efecto nuevo", "mineNone": "Aún no tienes efectos propios", "sReset": "Restablecer", "resetAll": "Restablecer todo", "resetAllS": "Se borran los ajustes, la disposición de estancias y luces, las pestañas, los favoritos, los efectos ocultos, los iconos subidos y tus efectos", "resetQ": "¿Restablecer todo?", "resetW": "Se borran los ajustes, la disposición de estancias y luces, todas las pestañas, los favoritos, los efectos ocultos, los iconos subidos y tus efectos. Todas las tarjetas de casa vuelven a estar como tras la instalación. No se puede deshacer.", "resetYes": "Sí, restablecer todo", "cancel": "Cancelar", "resetOk": "Se restableció todo", "roomIcon": "Icono de la estancia", "roomIconT": "Icono de {r}", "mdiPh": "mdi:nombre-del-icono", "apply": "Aplicar", "script": "Guardar como script", "scriptFav": "Crear scripts de los favoritos", "scriptOk": "{n} scripts guardados (Ajustes → Automatizaciones y escenas → Scripts)", "scriptErr": "No se pudo guardar el script: {e}", "editMine": "Editar", "delMine": "Borrar", "mineDel": "«{x}» borrado", "notHere": "Este efecto no tiene ninguna luz en {r}; añade primero una luz de esta estancia al efecto", "mineDrag": "Arrástralo a una pestaña de la izquierda para moverlo allí", "mineTab": "Crear efecto", "mineTabS": "{n} efectos · arrastra luces", "mineList": "Tus efectos", "mineEmpty": "Aún no tienes efectos propios. Empieza con «Efecto nuevo»: arrastra luces a la derecha y elige qué hace cada una.", "back": "Volver", "allL": "Todas las luces", "allLS": "Arrastra o añade con +", "inFx": "Luces de este efecto", "inFxS": "Arrástralas aquí y elige qué hace cada una", "dropL": "Arrastra luces aquí", "addAllR": "Añadir todas", "remL": "Quitar", "allIn": "Ya están todas las luces", "fbDef": "Si a una luz automática le falta el efecto base", "nLin": "{n} luces", "ceTitle": "Tu efecto", "ceName": "Nombre", "ceIcon": "Icono", "ceBase": "Efecto base", "ceBaseS": "Las luces que lo tienen reproducen este efecto", "ceNoBase": "Ninguno, elijo para cada luz", "ceFb": "Luces que no lo tienen", "ceFbS": "Luces sin el efecto base o usadas solo como luz", "ceLights": "Luz por luz", "ceLightsS": "Cambia la luz que quieras", "save": "Guardar", "del": "Borrar", "bri": "Brillo", "ceNameErr": "Escribe un nombre", "ceSaved": "«{x}» guardado", "ceHint": "Aparece en la tarjeta en «Mis efectos».", "m_auto": "Automático", "m_fx": "Efecto", "m_color": "Color", "m_white": "Blanco", "m_off": "Apagar", "m_skip": "Dejar como está", "supBase": "reproduce el efecto base", "noBase": "sin efecto base", "autoIs": "automático: {x}", "upd": "Hay una versión nueva instalada ({v}). Recarga la página.", "reload": "Recargar", "fade": "Transición", "fadeS": "El color, el blanco, el brillo y el apagado cambian suavemente (en luces que lo admiten)", "fadeNo": "Ninguna", "showRecent": "Pestaña Usados hace poco", "showRecentS": "Efectos reproducidos hace poco en la estancia, junto a Favoritos", "sBackup": "Copia de seguridad", "bkDown": "Descargar copia", "bkDownS": "Estancias, pestañas, favoritos, tus efectos, ajustes e iconos en un solo archivo", "bkUp": "Restaurar una copia", "bkUpS": "Elige un archivo de copia; sustituye la configuración actual", "bkQ": "¿Restaurar esta copia?", "bkW": "Copia del {d}. Las estancias, pestañas, favoritos, tus efectos, ajustes e iconos actuales se sustituyen por ella.", "bkYes": "Restaurar", "bkOk": "Copia restaurada", "bkErr": "Este archivo no es una copia de Lemur", "bkSaved": "Copia descargada", "bkBusy": "Preparando la copia…", "fillT": "Completar las luces que faltan", "fillHead": "{x} · completar las que faltan", "fillS": "¿Qué deben hacer las luces sin este efecto? Lo que elijas se enciende junto con el efecto, así cubre toda la habitación.", "fillSup": "Luces con este efecto", "fillMiss": "Luces sin este efecto", "fillAll": "Para todas", "fillAllS": "Cada luz que no ajustes por separado hace esto", "fillNone": "Todas las luces de la casa tienen este efecto; no hay nada que completar.", "fillSaved": "«{x}» completado", "fillDel": "Quitar el completado", "fillDeleted": "Completado quitado para «{x}»", "m_def": "Como «Para todas»", "fillOn": "Completado", "fillTag": "completado", "fillNoEff": "lo tiene, pero no se usa para efectos", "pvB": "Vista previa", "pvT": "Mientras está activa, el efecto que pulses suena al momento en las luces", "pvOn": "Vista previa activa", "pvWhere": "el efecto que pulses suena en las luces de:", "pvNow": "ahora: {x}", "pvBack": "Volver como estaba", "pvKeep": "Dejarlo así", "pvBackT": "Las luces volvieron a como estaban antes de la vista previa", "pvKeepT": "El último efecto sigue sonando", "pvErr": "La vista previa no funcionó: {e}", "pvNoRoom": "Elige una habitación para la vista previa", "startTabS": "«Último usado»: la habitación y la pestaña que tenías abiertas por última vez en ese dispositivo", "sVer": "Versión y actualizaciones", "updT": "Versión", "updInst": "Instalada: v{v}", "updCheck": "Buscar actualizaciones", "updChecking": "Comprobando…", "updOk": "al día", "updAt": "comprobado {t}", "updNew": "v{v} disponible", "updNotes": "Novedades", "updGo": "Actualizar", "updGh": "Abrir en GitHub", "updIng": "Descargando v{v}…", "updDone": "v{v} descargada. Se aplica cuando Home Assistant se reinicie.", "updRestart": "Reiniciar", "updAsk": "¿Reiniciar Home Assistant? El control de luces y las automatizaciones se detienen uno o dos minutos.", "updYes": "Sí, reiniciar", "updRest": "Reiniciando… La página se recarga sola cuando vuelva.", "updErr": "No se pudo comprobar: {e}", "updAgain": "Comprobar de nuevo", "updNoHacs": "No se instaló con HACS, así que no se puede instalar desde aquí"}, "fr": {"title": "Lemur Light Effect Card", "undo": "Annuler", "undoK": "Annuler (Ctrl+Z)", "more": "Plus", "settings": "Réglages", "settingsS": "Apparence, comportement, mode nuit, vos effets", "allHome": "Toute la maison", "none": "Sans pièce", "hiddenRoom": "Masquées dans la carte", "addRoom": "Pièce", "addRoomT": "Zones sans lumières", "addRoomNone": "Aucune zone sans lumières", "lightsOf": "Lumières de {r}", "allLights": "Toutes les lumières", "hiddenLights": "Lumières masquées dans la carte", "noLight": "Aucune lumière dans cette pièce", "noHidden": "Aucune lumière masquée", "allUses": "L’onglet Toute la maison utilise toutes les lumières", "allOff": "Toute la maison est désactivée dans la carte", "allOffB": "Désactiver Toute la maison", "offShort": "non", "allOnB": "Activer Toute la maison", "addLight": "Ajouter une lumière", "lHide": "Masquer dans la carte", "lBack": "Retour dans sa pièce · {r}", "lMove": "Déplacer vers une autre pièce", "addLightT": "Ajouter une lumière → {r}", "searchL": "Chercher des lumières", "fxN": "{n} effets", "noFxL": "sans effets", "lOnly": "Lumière seule", "fxUse": "Utiliser pour les effets", "fxUseS": "Désactivé, elle ne sert qu’au ton blanc, à la couleur et à la luminosité et ne change pas la liste des effets.", "fxNone": "Pas d’effets, lumière seule", "fxCnt": "{n} lumières · {f} pour les effets", "why": {"manual": "masquée par vous", "segment": "segment", "indicator": "LED témoin", "screen": "écran du navigateur", "device": "lumière d’appareil"}, "allFx": "Tous les effets", "allFxS": "{n} effets · glissez-les sur des onglets", "light": "Lumière", "lightE": "Ton blanc, couleur et luminosité. Cet onglet est fixe et toujours en premier.", "fav": "Favoris", "hid": "Masqués", "addTab": "Ajouter un onglet", "emptyTab": "Onglet vide", "newTab": "Nouvel onglet", "ready": "Prêts à l’emploi", "fromRooms": "D’autres pièces", "edit": "Modifier", "delTab": "Supprimer l’onglet", "search": "Chercher des effets", "dropHere": "Glissez des effets ici", "noHidFx": "Aucun effet masqué", "hiddenRoomE": "Ces lumières n’apparaissent jamais dans la carte. Glissez-en une sur une pièce en haut pour la récupérer.", "noLightE": "Pas encore de lumières dans cette pièce", "noFxRoom": "Les lumières de cette pièce n’ont pas d’effets. L’onglet Lumière fonctionne quand même.", "selN": "{n} choisis", "selHint": "glissez-les sur un onglet", "clear": "Effacer la sélection", "reset": "{r} : retour à la disposition automatique", "roomOff": "Masquer la pièce dans la carte", "roomOn": "Afficher la pièce dans la carte", "copyT": "Copier les onglets de {r} vers", "copyAll": "Toutes les pièces", "moved": "{x} → {r}", "nLights": "{n} lumières", "nFx": "{n} effets", "hiddenFx": "{x} masqué dans cette pièce", "shownFx": "{x} est de nouveau affiché", "favAdd": "{x} ajouté aux favoris", "tabDel": "« {t} » supprimé, ses effets passent dans Masqués", "tabCopied": "Onglet « {t} » copié → {r}", "tabAdded": "Onglet « {t} » ajouté", "copied": "Onglets copiés → {r}", "toRoom": "{r}", "toAll": "toutes les pièces", "resetDone": "Retour à la disposition automatique", "roomOffT": "Pièce masquée dans la carte", "roomOnT": "Pièce affichée dans la carte", "allOffT": "Toute la maison est désactivée dans la carte", "allOnT": "Toute la maison est activée dans la carte", "order": "Ordre modifié", "saved": "Enregistré", "undone": "Annulé", "fxMenu": "Détails de l’effet", "namesOn": "Nom sur chaque lumière", "upIcon": "Envoyer une icône", "rmIcon": "Icône par défaut", "hideFx": "Masquer dans cette pièce", "showFx": "Afficher dans cette pièce", "addFav": "Ajouter aux favoris", "remFav": "Retirer des favoris", "iconSaved": "Icône enregistrée", "iconErr": "Impossible d’envoyer l’icône", "close": "Fermer", "sCard": "Carte", "icColor": "En couleur", "icMono": "Simple", "defIcon": "Icône par défaut", "searchI": "Chercher des icônes", "lang": "Langue", "auto": "Automatique", "sStop": "Quand un effet est arrêté", "white": "Ton blanc", "bright": "Luminosité", "sAdv": "Avancé", "thr": "Nombre minimal d’effets pour une lumière à effets", "thrS": "Les lumières avec moins d’effets n’apparaissent que dans l’onglet Lumière", "thrN": "{n} effets", "local": "L’intégration ne semble pas chargée ; les changements ne peuvent pas être enregistrés.", "sLook": "Apparence", "tileSize": "Taille des tuiles", "tsAuto": "Automatique", "tsS": "Petite", "tsM": "Moyenne", "tsL": "Grande", "icStyle": "Icônes des effets", "icColorS": "En couleur", "icMonoS": "Simples (une couleur)", "showNames": "Noms des effets", "showNamesS": "Désactivé, les tuiles ne montrent que l’icône", "bg": "Fond", "bgDark": "Sombre", "bgBlack": "Noir (OLED)", "bgTheme": "Thème Home Assistant", "bgThemeS": "Avec le thème, le fond et le texte suivent votre thème Home Assistant", "showBar": "Ligne de couleur", "showBarS": "La ligne colorée sous les tuiles", "showDots": "Points de prise en charge", "showDotsS": "Points indiquant combien de lumières ont un effet", "sButtons": "Barre du bas", "showStop": "Bouton Arrêter", "showRandom": "Bouton Aléatoire", "showRandomS": "Visible dans l’affichage large", "sBehave": "Comportement", "fxOn": "Quand un effet est choisi pour une lumière éteinte", "fxOnS": "La lumière s’allume à cette luminosité", "fxOnOff": "Réglage propre de la lumière", "startTab": "À l’ouverture de la carte", "stAuto": "Automatique", "stFav": "Favoris", "stLast": "Le dernier utilisé", "stLight": "Lumière", "lp": "Durée de l’appui long", "lpS": "Durée d’appui pour ouvrir le menu de l’effet", "haptic": "Vibration", "hapticS": "Au toucher et à l’appui long (sur les téléphones compatibles)", "sRooms": "Pièces et lumières", "groups": "Afficher aussi les groupes de lumières", "groupsS": "Les groupes de lumières de Home Assistant apparaissent comme une lumière", "sNight": "Mode nuit", "night": "Mode nuit", "nightS": "Entre ces heures, la luminosité est plafonnée (effets, Arrêter, luminosité)", "from": "De", "to": "À", "nightMax": "Luminosité maximale", "sMine": "Vos effets", "mineS": "Choisissez un effet, décidez ce que font les lumières qui ne l’ont pas, et il apparaît dans la carte comme les autres.", "mineNew": "Nouvel effet", "mineNone": "Pas encore d’effets à vous", "sReset": "Réinitialiser", "resetAll": "Tout réinitialiser", "resetAllS": "Les réglages, la disposition des pièces et lumières, les onglets, les favoris, les effets masqués, les icônes envoyées et vos effets sont supprimés", "resetQ": "Tout réinitialiser ?", "resetW": "Cela supprime les réglages, la disposition des pièces et des lumières, tous les onglets, les favoris, les effets masqués, les icônes envoyées et vos effets. Toutes les cartes de la maison reviennent à l’état d’après l’installation. Impossible d’annuler.", "resetYes": "Oui, tout réinitialiser", "cancel": "Annuler", "resetOk": "Tout a été réinitialisé", "roomIcon": "Icône de la pièce", "roomIconT": "Icône de {r}", "mdiPh": "mdi:nom-de-l-icone", "apply": "Appliquer", "script": "Enregistrer comme script", "scriptFav": "Créer des scripts à partir des favoris", "scriptOk": "{n} scripts enregistrés (Paramètres → Automatisations et scènes → Scripts)", "scriptErr": "Impossible d’enregistrer le script : {e}", "editMine": "Modifier", "delMine": "Supprimer", "mineDel": "« {x} » supprimé", "notHere": "Cet effet n’a aucune lumière dans {r} ; ajoutez d’abord une lumière de cette pièce à l’effet", "mineDrag": "Glissez-le sur un onglet à gauche pour l’y mettre", "mineTab": "Créer un effet", "mineTabS": "{n} effets · glisser des lumières", "mineList": "Vos effets", "mineEmpty": "Pas encore d’effets à vous. Commencez par « Nouvel effet » : glissez des lumières à droite et choisissez ce que fait chacune.", "back": "Retour", "allL": "Toutes les lumières", "allLS": "Glissez ou ajoutez avec +", "inFx": "Lumières de cet effet", "inFxS": "Glissez-les ici, puis choisissez ce que fait chacune", "dropL": "Glissez des lumières ici", "addAllR": "Tout ajouter", "remL": "Retirer", "allIn": "Toutes les lumières y sont", "fbDef": "Si une lumière automatique n’a pas l’effet de base", "nLin": "{n} lumières", "ceTitle": "Votre effet", "ceName": "Nom", "ceIcon": "Icône", "ceBase": "Effet de base", "ceBaseS": "Les lumières qui l’ont jouent cet effet", "ceNoBase": "Aucun, je choisis pour chaque lumière", "ceFb": "Lumières qui ne l’ont pas", "ceFbS": "Lumières sans l’effet de base, ou utilisées comme simple lumière", "ceLights": "Lumière par lumière", "ceLightsS": "Modifiez la lumière de votre choix", "save": "Enregistrer", "del": "Supprimer", "bri": "Luminosité", "ceNameErr": "Saisissez un nom", "ceSaved": "« {x} » enregistré", "ceHint": "Il apparaît dans la carte sous « Mes effets ».", "m_auto": "Automatique", "m_fx": "Effet", "m_color": "Couleur", "m_white": "Blanc", "m_off": "Éteindre", "m_skip": "Ne pas toucher", "supBase": "joue l’effet de base", "noBase": "pas d’effet de base", "autoIs": "automatique : {x}", "upd": "Une nouvelle version est installée ({v}). Rechargez la page.", "reload": "Recharger", "fade": "Transition", "fadeS": "La couleur, le blanc, la luminosité et l’extinction changent en douceur (lumières compatibles)", "fadeNo": "Aucune", "showRecent": "Onglet Utilisés récemment", "showRecentS": "Effets joués récemment dans la pièce, à côté des Favoris", "sBackup": "Sauvegarde", "bkDown": "Télécharger la sauvegarde", "bkDownS": "Pièces, onglets, favoris, vos effets, réglages et icônes dans un seul fichier", "bkUp": "Restaurer une sauvegarde", "bkUpS": "Choisissez un fichier de sauvegarde ; il remplace la configuration actuelle", "bkQ": "Restaurer cette sauvegarde ?", "bkW": "Sauvegarde du {d}. Les pièces, onglets, favoris, vos effets, réglages et icônes actuels sont remplacés par elle.", "bkYes": "Restaurer", "bkOk": "Sauvegarde restaurée", "bkErr": "Ce fichier n’est pas une sauvegarde Lemur", "bkSaved": "Sauvegarde téléchargée", "bkBusy": "Préparation de la sauvegarde…", "fillT": "Compléter les lumières manquantes", "fillHead": "{x} · compléter les manquantes", "fillS": "Que doivent faire les lumières sans cet effet ? Votre choix s’allume avec l’effet, qui couvre ainsi toute la pièce.", "fillSup": "Lumières avec cet effet", "fillMiss": "Lumières sans cet effet", "fillAll": "Pour toutes", "fillAllS": "Chaque lumière que vous ne réglez pas à part fait cela", "fillNone": "Toutes les lumières de la maison ont cet effet ; rien à compléter.", "fillSaved": "« {x} » complété", "fillDel": "Retirer le complément", "fillDeleted": "Complément retiré pour « {x} »", "m_def": "Comme « Pour toutes »", "fillOn": "Complété", "fillTag": "complété", "fillNoEff": "l’a, mais n’est pas utilisée pour les effets", "pvB": "Aperçu", "pvT": "Tant qu’il est actif, l’effet cliqué joue tout de suite sur les lumières", "pvOn": "Aperçu actif", "pvWhere": "l’effet cliqué joue sur les lumières de :", "pvNow": "maintenant : {x}", "pvBack": "Remettre les lumières", "pvKeep": "Laisser ainsi", "pvBackT": "Les lumières sont revenues comme avant l’aperçu", "pvKeepT": "Le dernier effet continue", "pvErr": "L’aperçu n’a pas fonctionné : {e}", "pvNoRoom": "Choisissez une pièce pour l’aperçu", "startTabS": "« Dernier utilisé » : la pièce et l’onglet ouverts en dernier sur cet appareil", "sVer": "Version et mises à jour", "updT": "Version", "updInst": "Installée : v{v}", "updCheck": "Rechercher des mises à jour", "updChecking": "Vérification…", "updOk": "à jour", "updAt": "vérifié {t}", "updNew": "v{v} disponible", "updNotes": "Nouveautés", "updGo": "Mettre à jour", "updGh": "Ouvrir sur GitHub", "updIng": "Téléchargement de v{v}…", "updDone": "v{v} est téléchargée. Elle s’applique au redémarrage de Home Assistant.", "updRestart": "Redémarrer", "updAsk": "Redémarrer Home Assistant ? Le contrôle des lumières et les automatisations s’arrêtent une ou deux minutes.", "updYes": "Oui, redémarrer", "updRest": "Redémarrage… La page se recharge d’elle-même au retour.", "updErr": "Vérification impossible : {e}", "updAgain": "Vérifier à nouveau", "updNoHacs": "Non installé avec HACS, donc impossible à installer d’ici"}});
Object.assign(ED_TXT, {"de": {"areas": "Räume (leer = alle Bereiche mit Lichtern, Reihenfolge bleibt)", "exclude": "Auszuschließende Lichter", "kelvin": "Weißton nach Stopp", "brightness": "Helligkeit nach Stopp", "language": "Sprache", "all_home": "Tab „Ganzes Zuhause“ zeigen", "min_effects": "Mindestanzahl Effekte für ein Effektlicht", "height": "Kartenhöhe (z. B. 80vh, 700px)", "mobile_height": "Höhe auf Telefonen", "close": "Schließen-Taste (für Pop-ups)", "accent": "Akzentfarbe (#hex)", "shared": "Räume, Tabs, Favoriten, ausgeblendete Effekte und Symbole werden im Seitenleisten-Panel „Lemur Light Effect Card“ geordnet und mit allen im Haushalt geteilt.", "local": "Integration nicht gefunden: Daten werden nur auf diesem Gerät gespeichert. Zum Teilen die Integration „Lemur Light Effect Card“ über HACS installieren und hinzufügen.", "auto": "Automatisch", "name": "Tastentitel", "browser_fullscreen": "Auch den Browser im Vollbild öffnen (blendet Adress- und Systemleisten aus)", "hash": "Öffnungslink (jede Taste, die zu dieser Adresse führt, z. B. „#isik-efektleri“, öffnet ihn)", "aspect": "Seitenverhältnis (z. B. 16/10, 4/3)", "subtitle": "Untertitel (leer = Anzahl eingeschalteter Lichter)", "popup_width": "Fensterbreite (z. B. 90vw, 1100px)", "popup_height": "Fensterhöhe (z. B. 85vh, 700px)", "popup_position": "Position", "popup_scale": "Inhalt an das Fenster anpassen", "popup_radius": "Eckenradius (px)", "popup_blur": "Hintergrund weichzeichnen", "center": "Mitte", "bottom": "Unten", "look": "Aussehen", "style": "Tastenstil", "s_row": "Zeile (Symbol, Titel, Untertitel)", "s_tile": "Kachel (großes Symbol, Titel darunter)", "s_icon": "Nur Symbol", "color": "Tastenfarbe", "icon": "Symbol (Home-Assistant-Symbol)", "color_icon": "Farbsymbol (aus den Effektsymbolen)", "none": "Keins"}, "es": {"areas": "Estancias (vacío = todas las áreas con luces, se mantiene el orden)", "exclude": "Luces que excluir", "kelvin": "Tono blanco tras Detener", "brightness": "Brillo tras Detener", "language": "Idioma", "all_home": "Mostrar la pestaña «Toda la casa»", "min_effects": "Efectos mínimos para contar como luz de efectos", "height": "Altura de la tarjeta (p. ej. 80vh, 700px)", "mobile_height": "Altura en teléfonos", "close": "Botón de cerrar (para ventanas emergentes)", "accent": "Color de acento (#hex)", "shared": "Las estancias, pestañas, favoritos, efectos ocultos e iconos se ordenan en el panel «Lemur Light Effect Card» de la barra lateral y se comparten con toda la casa.", "local": "Integración no encontrada: los datos solo se guardan en este dispositivo. Para compartirlos, instala y añade la integración «Lemur Light Effect Card» desde HACS.", "auto": "Automático", "name": "Título del botón", "browser_fullscreen": "Poner también el navegador a pantalla completa (oculta la barra de direcciones y las del sistema)", "hash": "Enlace de apertura (cualquier botón que vaya a esta dirección, p. ej. «#isik-efektleri», lo abre)", "aspect": "Proporción (p. ej. 16/10, 4/3)", "subtitle": "Subtítulo (vacío = número de luces encendidas)", "popup_width": "Ancho de la ventana (p. ej. 90vw, 1100px)", "popup_height": "Alto de la ventana (p. ej. 85vh, 700px)", "popup_position": "Posición", "popup_scale": "Ajustar el contenido a la ventana", "popup_radius": "Radio de las esquinas (px)", "popup_blur": "Difuminar el fondo", "center": "Centro", "bottom": "Abajo", "look": "Aspecto", "style": "Estilo del botón", "s_row": "Fila (icono, título, subtítulo)", "s_tile": "Casilla (icono grande, título debajo)", "s_icon": "Solo icono", "color": "Color del botón", "icon": "Icono (icono de Home Assistant)", "color_icon": "Icono de color (de los iconos de efectos)", "none": "Ninguno"}, "fr": {"areas": "Pièces (vide = toutes les zones avec lumières, l’ordre est gardé)", "exclude": "Lumières à exclure", "kelvin": "Ton blanc après Arrêter", "brightness": "Luminosité après Arrêter", "language": "Langue", "all_home": "Afficher l’onglet « Toute la maison »", "min_effects": "Nombre minimal d’effets pour une lumière à effets", "height": "Hauteur de la carte (ex. 80vh, 700px)", "mobile_height": "Hauteur sur téléphone", "close": "Bouton Fermer (pour les fenêtres)", "accent": "Couleur d’accent (#hex)", "shared": "Les pièces, onglets, favoris, effets masqués et icônes se règlent dans le panneau « Lemur Light Effect Card » de la barre latérale et sont partagés avec toute la maison.", "local": "Intégration introuvable : les données ne sont enregistrées que sur cet appareil. Pour les partager, installez et ajoutez l’intégration « Lemur Light Effect Card » depuis HACS.", "auto": "Automatique", "name": "Titre du bouton", "browser_fullscreen": "Mettre aussi le navigateur en plein écran (masque la barre d’adresse et les barres système)", "hash": "Lien d’ouverture (tout bouton menant à cette adresse, ex. « #isik-efektleri », l’ouvre)", "aspect": "Proportions (ex. 16/10, 4/3)", "subtitle": "Sous-titre (vide = nombre de lumières allumées)", "popup_width": "Largeur de la fenêtre (ex. 90vw, 1100px)", "popup_height": "Hauteur de la fenêtre (ex. 85vh, 700px)", "popup_position": "Position", "popup_scale": "Adapter le contenu à la fenêtre", "popup_radius": "Rayon des coins (px)", "popup_blur": "Flouter l’arrière-plan", "center": "Centre", "bottom": "Bas", "look": "Apparence", "style": "Style du bouton", "s_row": "Ligne (icône, titre, sous-titre)", "s_tile": "Tuile (grande icône, titre dessous)", "s_icon": "Icône seule", "color": "Couleur du bouton", "icon": "Icône (icône Home Assistant)", "color_icon": "Icône en couleur (parmi les icônes d’effets)", "none": "Aucune"}});
{ const P = {"de": {"title": "Lemur Light Effect Card", "off": "Alle Lichter aus", "open": "Öffnen", "close": "Schließen", "on1": " Licht an", "onN": " Lichter an", "card": ["Lemur Light Effect Card", "Lichter nach Raum mit Effekten, Weißtönen und Farben. Die Karte selbst, direkt auf dem Dashboard."], "mobile": ["Lemur Light Effect Card · Telefon-Taste", "Eine Taste, die den für Telefone angeordneten Effektbildschirm öffnet."], "mfull": ["Lemur Light Effect Card · Telefon-Vollbild-Taste", "Der für Telefone angeordnete Effektbildschirm. Auf dem Telefon im Vollbild (mit Browser), auf breiten Bildschirmen als Fenster in Telefongröße. Kein browser_mod nötig."], "full": ["Lemur Light Effect Card · Vollbild-Taste", "Eine Taste, die den Effektbildschirm über die ganze Anzeige öffnet. Für Tablets und Telefone. Kein browser_mod nötig."], "popup": ["Lemur Light Effect Card · Fenster-Taste", "Eine Taste, die ein Fenster öffnet, dessen Größe und Lage du bestimmst; der Inhalt passt sich an."], "scale": ["Lemur Light Effect Card · Skalierbar", "Breite Ansicht, die mit der Größe ihres Kastens skaliert."]}, "es": {"title": "Lemur Light Effect Card", "off": "Todas las luces apagadas", "open": "Abrir", "close": "Cerrar", "on1": " luz encendida", "onN": " luces encendidas", "card": ["Lemur Light Effect Card", "Luces por estancia con efectos, tonos blancos y colores. La propia tarjeta, directamente en el panel."], "mobile": ["Lemur Light Effect Card · Botón de teléfono", "Un botón que abre la pantalla de efectos pensada para teléfonos."], "mfull": ["Lemur Light Effect Card · Botón de teléfono a pantalla completa", "La pantalla de efectos pensada para teléfonos. En el teléfono se abre a pantalla completa (navegador incluido) y en pantallas anchas como ventana del tamaño de un teléfono. No hace falta browser_mod."], "full": ["Lemur Light Effect Card · Botón de pantalla completa", "Un botón que abre la pantalla de efectos sobre toda la pantalla. Para tabletas y teléfonos. No hace falta browser_mod."], "popup": ["Lemur Light Effect Card · Botón de ventana", "Un botón que abre una ventana de tamaño y posición ajustables; el contenido se adapta a la ventana."], "scale": ["Lemur Light Effect Card · Escalable", "Vista ancha que se adapta al tamaño de su caja."]}, "fr": {"title": "Lemur Light Effect Card", "off": "Toutes les lumières éteintes", "open": "Ouvrir", "close": "Fermer", "on1": " lumière allumée", "onN": " lumières allumées", "card": ["Lemur Light Effect Card", "Les lumières par pièce avec effets, tons blancs et couleurs. La carte elle-même, directement sur le tableau de bord."], "mobile": ["Lemur Light Effect Card · Bouton téléphone", "Un bouton qui ouvre l’écran des effets prévu pour les téléphones."], "mfull": ["Lemur Light Effect Card · Bouton téléphone plein écran", "L’écran des effets prévu pour les téléphones. Sur un téléphone il s’ouvre en plein écran (navigateur compris), sur grand écran en fenêtre de la taille d’un téléphone. browser_mod n’est pas nécessaire."], "full": ["Lemur Light Effect Card · Bouton plein écran", "Un bouton qui ouvre l’écran des effets sur tout l’affichage. Pour tablettes et téléphones. browser_mod n’est pas nécessaire."], "popup": ["Lemur Light Effect Card · Bouton fenêtre", "Un bouton qui ouvre une fenêtre dont vous réglez la taille et la place ; le contenu s’y adapte."], "scale": ["Lemur Light Effect Card · Ajustable", "Affichage large qui s’adapte à la taille de son cadre."]}};
  for (const k in P) { const p = P[k], a = p.on1, b = p.onN; delete p.on1; delete p.onN; p.on = n => n + (n === 1 ? a : b); PRE_TXT[k] = p; } }

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
{ const doc = 'https://github.com/mendebur-lemur/lemur-light-effect-card';
  const T = () => PRE_TXT[preLang(document.querySelector('home-assistant') && document.querySelector('home-assistant').hass)];
  [['lemur-light-effect-card', 'card'], ['lemur-phone-button', 'mobile'], ['lemur-phone-fullscreen-button', 'mfull'], ['lemur-fullscreen-button', 'full'], ['lemur-window-button', 'popup']].forEach(([type, k]) => {
    if (window.customCards.some(c => c.type === type)) return;
    window.customCards.push({ type, preview: false, documentationURL: doc,
      get name() { return T()[k][0]; },
      get description() { return T()[k][1]; } });
  }); }
console.info('%c LEMUR LIGHT EFFECT CARD %c v' + CARD_VERSION + ' ', 'background:#F0A93B;color:#1A1105;font-weight:700', 'background:#1E2024;color:#ECEDEF');
})();
