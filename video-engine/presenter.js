// Presenter mode: Ramtin's recording fills the frame; a light panel drops from the top
// with motion graphics (and real app screens for Hoormand features); captions follow his words.
(function () {
  const css = `
  #pvwrap{position:absolute;inset:0;overflow:hidden;background:#0b1630}
  #pv{position:absolute;left:0;top:0;width:1080px;height:1920px;transform-origin:50% 0}
  #pvshade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(10,30,70,.0) 55%,rgba(10,25,60,.35) 100%)}
  .pp{position:absolute;left:0;right:0;top:0;height:1000px}
  .card{position:absolute;background:#fff;border-radius:34px;box-shadow:0 18px 50px rgba(20,50,110,.16)}
  .ic{width:44px;height:44px;stroke:var(--blue);stroke-width:2;fill:none;stroke-linecap:round;stroke-linejoin:round}
  .wordbig{position:absolute;top:250px;left:0;right:0;text-align:center;font:900 220px V;color:var(--navy)}
  .wordsub{position:absolute;top:110px;left:0;right:0;text-align:center;font:800 56px V;color:var(--muted)}
  .wordsub s{text-decoration:none;position:relative}
  .wiper{position:absolute;top:240px;height:300px;right:60px;background:linear-gradient(90deg,#e6eefb,#eaf1fd);width:0}
  .row{display:flex;align-items:center;gap:22px;height:104px;padding:0 34px;border-top:2px solid #eef2f8}
  .av{width:66px;height:66px;border-radius:50%;display:flex;align-items:center;justify-content:center;font:900 30px V;color:#fff}
  .nm2{font:800 36px V;color:var(--navy);flex:1}
  .pill{border-radius:999px;padding:6px 20px;font:800 26px V}
  .pill.o{background:#fff1e3;color:#e07a10}
  .pill.g{background:#eef2f8;color:#8090ad}
  .pill.r{background:#ffe9ec;color:#e0354f}
  .hdr{display:flex;align-items:center;gap:16px;height:100px;padding:0 34px;font:900 40px V;color:var(--navy)}
  .qbub{position:absolute;width:200px;height:200px;border-radius:50%;background:var(--yellow);display:flex;align-items:center;justify-content:center;
    font:900 150px V;color:var(--navy);box-shadow:0 18px 40px rgba(0,0,0,.2)}
  .thermo{position:absolute;left:150px;top:150px;width:110px;height:640px;border-radius:55px;background:#eef2f8;overflow:hidden;box-shadow:inset 0 0 0 6px #fff}
  .thermo i{position:absolute;left:18px;right:18px;bottom:18px;border-radius:40px;background:linear-gradient(0deg,#ff4d4d,#ffb547);transform-origin:bottom;height:520px;display:block}
  .tlbl{position:absolute;right:80px;font:900 64px V;color:var(--navy);text-align:right}
  .tlbl em{font-style:normal;color:#ff5a3c}
  .step{position:absolute;top:180px;width:300px;height:460px;display:flex;flex-direction:column;align-items:center;padding-top:50px;gap:22px}
  .step .num{font-size:150px!important}
  .step .num{font:900 120px V;color:var(--blue);line-height:1}
  .step .lb{font:900 44px V;color:var(--navy)}
  .step .dt{font:800 30px V;color:#fff;background:var(--blue);border-radius:999px;padding:6px 22px}
  .step .ow{font:800 28px V;color:var(--navy2);background:#eaf2ff;border-radius:999px;padding:6px 22px;display:flex;gap:10px;align-items:center}
  .note{position:absolute;left:190px;right:190px;top:700px;height:150px;border-radius:30px;background:#fffbe6;display:flex;align-items:center;justify-content:center;font:900 60px V;color:#7a6a2a;
    box-shadow:0 14px 34px rgba(0,0,0,.12)}
  .strike{position:absolute;left:150px;right:150px;top:770px;height:12px;border-radius:6px;background:#e0354f;transform-origin:right}
  .fchip{position:absolute;top:56px;left:0;right:0;display:flex;justify-content:center}
  .fchip>div{display:flex;align-items:center;gap:16px;background:linear-gradient(90deg,#6a5cff,#b14cff);color:#fff;border-radius:999px;padding:14px 36px;font:900 46px V;
    box-shadow:0 12px 30px rgba(90,60,200,.35)}
  .fchip svg{width:48px;height:48px;stroke:#fff;stroke-width:2;fill:none}
  .fbrowser{position:absolute;left:40px;top:160px;width:1000px;border-radius:30px;background:#fff;overflow:hidden;box-shadow:0 26px 60px rgba(20,50,110,.25)}
  .fbrowser .shot{height:700px}
  .fbrowser .shot img{transform-origin:0 0;width:1000px;height:625px}
  .badge{position:absolute;top:70px;left:0;right:0;display:flex;justify-content:center}
  .badge span{background:var(--navy);color:#fff;font:900 44px V;border-radius:999px;padding:12px 40px}
  .lockcard{position:absolute;left:240px;right:240px;top:190px;height:300px;display:flex;align-items:center;justify-content:center;gap:30px}
  .lockcard b{font:900 170px V;color:var(--navy);filter:blur(16px)}
  .lockcard svg{width:110px;height:110px;stroke:var(--navy);stroke-width:2;fill:none}
  .ttl{position:absolute;top:540px;left:40px;right:40px;text-align:center;font:900 84px V;color:var(--navy);line-height:1.35}
  .ttl em{font-style:normal;color:var(--blue)}
  .igc{position:absolute;left:90px;right:90px;top:170px;height:560px}
  .igava{position:absolute;right:60px;top:60px;width:190px;height:190px;border-radius:50%;padding:8px;background:linear-gradient(45deg,#feda75,#fa7e1e,#d62976,#962fbf,#4f5bd5)}
  .igava div{width:100%;height:100%;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center;border:6px solid #fff}
  .igava img{width:120px}
  .ignm{position:absolute;right:290px;top:90px;font:900 60px V;color:var(--navy)}
  .igsub{position:absolute;right:290px;top:175px;font:700 34px V;color:var(--muted)}
  .igbtn{position:absolute;left:60px;right:60px;top:330px;height:120px;border-radius:28px;background:#0095f6;color:#fff;display:flex;align-items:center;justify-content:center;font:900 52px V}
  .igbtn.done{background:#eef2f8;color:var(--navy)}
  .hand{position:absolute;width:120px;height:120px}
  .xp{position:absolute;top:60px;left:0;right:0;display:flex;justify-content:center}
  .xp span{display:flex;gap:14px;align-items:center;background:#fff;border-radius:999px;padding:10px 30px;font:900 40px V;color:var(--navy);box-shadow:0 10px 24px rgba(20,50,110,.14)}
  .friend{position:absolute;top:560px;width:200px;display:flex;flex-direction:column;align-items:center;gap:14px}
  .friend .av{width:150px;height:150px;font-size:60px}
  .friend .ok{width:56px;height:56px;border-radius:50%;background:var(--green);display:flex;align-items:center;justify-content:center;margin-top:-50px;margin-right:-90px;border:5px solid #fff}
  .friend .ok svg{width:30px;height:30px;stroke:#fff;stroke-width:3;fill:none}
  .friend .fn{font:800 32px V;color:var(--navy)}
  .plane{position:absolute;left:470px;top:230px;width:150px;height:150px;border-radius:50%;background:var(--blue);display:flex;align-items:center;justify-content:center;box-shadow:0 18px 40px rgba(47,127,224,.45)}
  .plane svg{width:80px;height:80px;stroke:#fff;stroke-width:2;fill:none;stroke-linejoin:round}
  .sharettl{position:absolute;top:80px;left:60px;right:60px;text-align:center;font:900 54px V;color:var(--navy)}
  `;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  const AV = ['#5b8def', '#ff8a5b', '#33c49b', '#b06cff', '#f5b62e', '#e85d8a'];
  const S = (n, cls = 'ic') => svg(n, `class="${cls}"`);
  const fadeIn = (el, t, d = .35, dy = 30) => anim(el, [{ t: t - .001, o: 0, y: dy }, { t: t + d, o: 1, y: 0 }]);

  const P = {};
  P.word = (o, root) => {
    if (o.sub) { const s = h(`<div class="wordsub">${o.sub}</div>`); root.appendChild(s); fadeIn(s, o.c0); }
    const w = h(`<div class="wordbig">${o.text}</div>`); root.appendChild(w);
    anim(w, [{ t: o.c0, o: 0, s: .7, b: 14 }, { t: o.c0 + .5, o: 1, s: 1, b: 0, e: 'back' }, { t: o.eraseAt || o.t1, s: 1 }, { t: (o.eraseAt || o.t1) + 1.2, s: 1, b: 6 }]);
    if (o.eraseAt) { const wp = h(`<div class="wiper"></div>`); root.appendChild(wp);
      hook(t => { const u = EASE.io(clamp((t - o.eraseAt) / 1.1, 0, 1)); wp.style.width = (960 * u) + 'px'; }); }
  };
  P.list = (o, root) => {
    const names = o.rows || ['علی رضایی', 'مریم احمدی', 'سارا محمدی', 'حسین نوری', 'نگین حیدری'];
    const card = h(`<div class="card" style="left:70px;right:70px;top:110px;overflow:hidden">
      <div class="hdr">${S('phone')}<span>${o.title || 'تماس‌های ماه پیش'}</span></div></div>`); root.appendChild(card); fadeIn(card, o.c0, .4, 60);
    names.forEach((n, i) => {
      const r = h(`<div class="row"><div class="av" style="background:${AV[i % 6]}">${n[0]}</div><div class="nm2">${n}</div>
        <span class="pill o">قیمت پرسید</span><span class="pill g st">پیگیری؟</span></div>`); card.appendChild(r);
      fadeIn(r, o.c0 + .3 + i * .18, .3, 20);
      if (o.questionAt) { const p = r.querySelector('.st'); hook(t => { const on = t > o.questionAt + i * .12; p.className = 'pill ' + (on ? 'r st' : 'g st'); p.textContent = on ? 'نامعلوم' : 'پیگیری؟'; }); }
    });
    if (o.questionAt) { const q = h(`<div class="qbub" style="left:440px;top:755px">؟</div>`); root.appendChild(q); pop(q, o.questionAt + .3, .45); }
  };
  P.thermo = (o, root) => {
    const th = h(`<div class="thermo"><i></i></div>`); root.appendChild(th); fadeIn(th, o.c0, .4, 40);
    const bar = th.querySelector('i');
    hook(t => { const u = EASE.out(clamp((t - o.c0 - .3) / 1.4, 0, 1)); bar.style.transform = `scaleY(${.05 + .7 * u})`; });
    const l1 = h(`<div class="tlbl" style="top:200px">مشتریِ <em>قیمت‌گرفته</em></div>`); root.appendChild(l1); fadeIn(l1, o.c0 + .2);
    const l2 = h(`<div class="tlbl" style="top:330px;font-size:120px">هنوز <em>گرمه</em></div>`); root.appendChild(l2); pop(l2, o.warmAt || o.c0 + 1);
    if (o.coldAt) { const l3 = h(`<div class="tlbl" style="top:560px"><span class="pill g" style="font-size:44px;padding:12px 34px">کسی سراغش نرفته</span></div>`); root.appendChild(l3); pop(l3, o.coldAt); }
  };
  P.steps = (o, root) => {
    const xs = [740, 390, 40];
    if (o.title) { const b = h(`<div class="badge"><span>${o.title}</span></div>`); root.appendChild(b); pop(b, o.c0, .4); }
    (o.cards || []).forEach((c, i) => {
      const el = h(`<div class="card step" style="left:${xs[i]}px"><div class="num">${c.num}</div><div class="lb">${c.label}</div></div>`); root.appendChild(el);
      pop(el, c.at, .4);
      if (o.dateAt) { const d = h(`<div class="dt">${c.date}</div>`); el.appendChild(d); pop(d, o.dateAt + i * .15, .35); }
      if (o.ownerAt) { const w = h(`<div class="ow">${S('users', 'ic" style="width:30px;height:30px')}${c.owner}</div>`); el.appendChild(w); pop(w, o.ownerAt + i * .15, .35); }
    });
    if (o.strikeAt) {
      const n = h(`<div class="note">«${o.strikeText || 'یادم می‌مونه'}»</div>`); root.appendChild(n); pop(n, o.strikeAt - .2, .35);
      const sk = h(`<div class="strike"></div>`); root.appendChild(sk);
      hook(t => { const u = EASE.out(clamp((t - o.strikeAt - .35) / .4, 0, 1)); sk.style.transform = `scaleX(${u})`; sk.style.opacity = u > 0 ? 1 : 0; });
    }
  };
  P.feature = (o, root) => {
    const f = DATA.features[o.feature];
    const chip = h(`<div class="fchip"><div>${svg(f.icon)}<span>${o.title || f.title}</span></div></div>`); root.appendChild(chip); fadeIn(chip, o.c0, .4, -30);
    const scr = (o.screen !== undefined && typeof o.screen === 'string') ? o.screen : f.screens[o.screen || 0].file;
    const br = h(`<div class="fbrowser"><div class="bar" style="height:46px;background:#eef2f9;display:flex;align-items:center;gap:10px;padding:0 20px;direction:ltr">
      <i style="width:14px;height:14px;border-radius:50%;background:#ff5f57;display:block"></i><i style="width:14px;height:14px;border-radius:50%;background:#febc2e;display:block"></i>
      <i style="width:14px;height:14px;border-radius:50%;background:#28c840;display:block"></i><span style="margin-left:16px;font:600 18px V;color:#7d8bab">hoormandapp.ir</span></div>
      <div class="shot" style="position:relative;overflow:hidden"><img src="${DATA.imgRoot + scr}" style="position:absolute;left:0;top:0"></div></div>`);
    root.appendChild(br); anim(br, [{ t: o.c0 + .1, o: 0, y: 80, s: .94 }, { t: o.c0 + .6, o: 1, y: 0, s: 1 }]);
    const img = br.querySelector('img'); const W = 1000, H = 700;
    const seq = [{ at: o.c0, x: .5, y: .5, s: H / 625 }, ...(o.focus || [])];
    hook(t => {
      let a = seq[0], b = seq[0];
      for (let i = 0; i < seq.length; i++) { if (seq[i].at <= t) { a = seq[i]; b = seq[i + 1] || seq[i]; } }
      const u = b === a ? 0 : EASE.io(clamp((t - b.at) / .9 + 1, 0, 1));
      const blend = (b !== a && t >= b.at) ? 1 : 0; // seq entries switch at their 'at'
      const cur = a; // a is the latest focus reached
      const prev = seq[Math.max(0, seq.indexOf(cur) - 1)];
      const v = EASE.io(clamp((t - cur.at) / .9, 0, 1));
      const k = lerp(prev.s, cur.s, v), x = lerp(prev.x, cur.x, v), y = lerp(prev.y, cur.y, v);
      let tx = W / 2 - x * 1000 * k, ty = H / 2 - y * 625 * k;
      tx = clamp(tx, W - 1000 * k, 0); ty = clamp(ty, H - 625 * k, 0);
      img.style.transform = `translate(${tx}px,${ty}px) scale(${k})`;
    });
  };
  P.teaser = (o, root) => {
    const b = h(`<div class="badge"><span>${o.badge || 'قسمت بعد'}</span></div>`); root.appendChild(b); pop(b, o.c0, .4);
    const lc = h(`<div class="card lockcard"><b>${o.secret || '×۲۵'}</b>${S('key')}</div>`); root.appendChild(lc); pop(lc, o.numberAt || o.c0 + .4, .45);
    if (o.titleAt) { const tt = h(`<div class="ttl">${richSub(o.title)}</div>`); root.appendChild(tt); fadeIn(tt, o.titleAt, .45, 40); }
  };
  P.follow = (o, root) => {
    const x = h(`<div class="xp"><span>${S('sparkle')}از اکسپلور اومدی؟</span></div>`); root.appendChild(x); pop(x, o.c0, .4);
    const c = h(`<div class="card igc"><div class="igava"><div><img src="${DATA.logoMark}"></div></div>
      <div class="ignm" dir="ltr">${o.name || DATA.brand.instagram || 'هورمند'}</div><div class="igsub">${o.sub || 'هورمند | اتوماسیون اداری هوشمند'}</div>
      <div class="igbtn">دنبال کردن</div></div>`); root.appendChild(c); fadeIn(c, o.c0 + .25, .45, 60);
    const btn = c.querySelector('.igbtn');
    const hand = h(`<svg class="hand" viewBox="0 0 24 24"><path d="M9 11V5a1.5 1.5 0 0 1 3 0v5h.5V8.5a1.5 1.5 0 0 1 3 0V11h.5v-1a1.5 1.5 0 0 1 3 0v4.5c0 3.6-2.4 6.5-6 6.5h-1.2c-2 0-3.4-.8-4.6-2.4L4 15.2a1.5 1.5 0 0 1 2.2-2L9 15z" fill="#fff" stroke="#0f1f3d" stroke-width="1.3" stroke-linejoin="round"/></svg>`);
    root.appendChild(hand);
    const ca = o.clickAt || o.c0 + 1.6;
    anim(hand, [{ t: ca - 1.0, o: 0, x: 700, y: 900 }, { t: ca - .2, o: 1, x: 520, y: 600, e: 'io' }, { t: ca, s: .85 }, { t: ca + .15, s: 1 }, { t: ca + 1, o: 0, x: 600, y: 700 }]);
    hook(t => { const on = t >= ca; btn.className = 'igbtn' + (on ? ' done' : ''); btn.textContent = on ? 'دنبال می‌کنید ✓' : 'دنبال کردن'; });
  };
  P.share = (o, root) => {
    const tt = h(`<div class="sharettl">${richSub(o.title || 'بفرست برای دوستت که *کسب‌وکار* داره')}</div>`); root.appendChild(tt); fadeIn(tt, o.c0);
    const pl = h(`<div class="plane">${svg('send')}</div>`); root.appendChild(pl); pop(pl, o.c0 + .3, .45);
    const fr = o.friends || ['امیر', 'نیلوفر', 'رضا'];
    const xs = [760, 440, 120];
    fr.forEach((n, i) => {
      const el = h(`<div class="friend" style="left:${xs[i]}px"><div class="av" style="background:${AV[(i + 2) % 6]}">${n[0]}</div><div class="ok">${svg('task')}</div><div class="fn">${n}</div></div>`);
      root.appendChild(el); fadeIn(el, o.c0 + .5 + i * .15, .35);
      const okk = el.querySelector('.ok'); pop(okk, (o.sendAt || o.c0 + 1.5) + i * .45 + .4, .3);
    });
    // one small plane per friend flies out of the big plane, lands on the avatar and disappears
    const sa = o.sendAt || o.c0 + 1.5;
    anim(pl, [{ t: sa - .2, s: 1 }, ...fr.flatMap((_, i) => [{ t: sa + i * .45, s: .9, e: 'out' }, { t: sa + i * .45 + .15, s: 1.08, e: 'out' }]), { t: sa + fr.length * .45 + .3, s: 1 }]);
    fr.forEach((_, i) => {
      const m = h(`<div class="plane" style="width:70px;height:70px;left:510px;top:270px;box-shadow:none">${svg('send', 'style="width:38px;height:38px"')}</div>`);
      root.appendChild(m);
      const dx = xs[i] + 100 - 545, dy = 635 - 305, t1 = sa + i * .45;
      anim(m, [{ t: t1 - .001, o: 0, x: 0, y: 0, s: .5 }, { t: t1 + .05, o: 1, s: .9 }, { t: t1 + .2, x: dx * .5, y: dy * .5 - 90, s: 1, e: 'lin' },
               { t: t1 + .4, x: dx, y: dy, s: .6, o: 1, e: 'in' }, { t: t1 + .5, o: 0, s: .3 }]);
    });
  };

  window.buildPresenter = function (data) {
    DATA = data;
    const stage = document.getElementById('stage');
    document.getElementById('streak').style.display = 'none';
    const wrap = h(`<div id="pvwrap"><img id="pv"><div id="pvshade"></div></div>`); stage.insertBefore(wrap, stage.firstChild);
    const pv = wrap.querySelector('#pv');
    const panel = document.getElementById('panel'); panel.style.height = '1000px';
    const scenes = document.getElementById('scenes'), caps = document.getElementById('caps');
    document.getElementById('wm').innerHTML = `<i><img src="${data.logoMark}"></i><span>${data.brand.website}</span>`;

    // merge overlays into panel-down intervals
    const ovs = data.overlays.slice().sort((a, b) => a.t0 - b.t0);
    const iv = [];
    ovs.forEach(o => { const l = iv[iv.length - 1]; if (l && o.t0 - l[1] < .8) l[1] = Math.max(l[1], o.t1); else iv.push([o.t0, o.t1]); });
    const pAt = t => { let p = 0; for (const [a, b] of iv) { const u = Math.min(EASE.out(clamp((t - a) / .45, 0, 1)), 1 - EASE.in(clamp((t - (b - .35)) / .35, 0, 1))); p = Math.max(p, u); } return p; };
    ovs.forEach(o => {
      const panelAlready = iv.some(([a, b]) => a < o.t0 - .01 && b >= o.t0);
      o.c0 = panelAlready ? o.t0 + .05 : o.t0 + .3;
      const root = h(`<div class="pp"></div>`); scenes.appendChild(root);
      anim(root, [{ t: o.t0 - .001, o: 0 }, { t: o.t0 + .05, o: 1, e: 'lin' }, { t: o.t1 - .25, o: 1 }, { t: o.t1 - .02, o: 0, e: 'in' }]);
      P[o.type](o, root);
    });
    const cutsAt = data.cutTimes;
    hook(t => {
      const p = pAt(t);
      panel.style.transform = `translateY(${-1060 * (1 - p)}px)`;
      let k = 0; for (const c of cutsAt) if (c <= t) k++;
      const punch = (k % 2) ? 1.075 : 1.0;
      const z = lerp(punch, 1, p), dy = 520 * p;
      pv.style.transform = `translateY(${dy}px) scale(${z})`;
      caps.style.transform = `translateY(${-440 * p}px)`;
    });
    data.captions.forEach(c => {
      const el = h(`<div class="cap" style="top:1400px"><div>${richText(c.text)}</div></div>`); caps.appendChild(el);
      anim(el, [{ t: c.at - .001, o: 0, s: .85, y: 14 }, { t: c.at + .12, o: 1, s: 1, y: 0, e: 'back' }, { t: c.end - .05, o: 1 }, { t: c.end, o: 0, e: 'lin' }]);
    });
    // end card
    if (data.endCard) {
      const e = data.endCard, root = h(`<section class="scene"></section>`); stage.appendChild(root);
      anim(root, [{ t: e.t0 - .001, o: 0 }, { t: e.t0 + .4, o: 1 }]);
      B.end({ line: e.line }, root, e.t0, e.t0 + e.dur);
      if (e.sub) { const s = h(`<div class="endline" style="top:1640px;font-size:44px;color:#cfe0ff">${e.sub}</div>`); root.appendChild(s); enter(s, e.t0 + 1.0); }
      const wm = document.getElementById('wm'); anim(wm, [{ t: 0, o: .85 }, { t: e.t0, o: .85 }, { t: e.t0 + .3, o: 0 }]);
    }
    window.__pv = pv;
    return data.total;
  };
  window.setFrame = function (src) {
    const pv = window.__pv; if (pv.getAttribute('src') === src) return Promise.resolve();
    pv.setAttribute('src', src); return pv.decode().catch(() => {});
  };
})();
