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
  .fbrowser .shot img{transform-origin:0 0;width:1000px}
  .fbrowser .shot{background:#eef3fb}
  .badge{position:absolute;top:70px;left:0;right:0;display:flex;justify-content:center}
  .badge span{background:var(--navy);color:#fff;font:900 44px V;border-radius:999px;padding:12px 40px}
  .lockcard{position:absolute;left:240px;right:240px;top:190px;height:300px;display:flex;align-items:center;justify-content:center;gap:30px}
  .lockcard b{font:900 170px V;color:var(--navy);filter:blur(16px);white-space:nowrap}
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

  .vs{position:absolute;top:150px;width:420px;height:560px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:22px;border-radius:40px}
  .vs .vbig{width:170px;height:170px;border-radius:50%;display:flex;align-items:center;justify-content:center}
  .vs .vbig svg{width:96px;height:96px;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
  .vs .lb{font:900 46px V;color:var(--navy);white-space:nowrap}
  .vs .sb{font:800 32px V;border-radius:999px;padding:8px 24px}
  .vsx{position:absolute;top:385px;left:485px;width:110px;height:110px;border-radius:50%;background:var(--navy);color:#fff;display:flex;align-items:center;justify-content:center;font:900 30px V;box-shadow:0 10px 24px rgba(0,0,0,.25)}
  .coin{position:absolute;width:74px;height:74px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff3b0,#ffcf3a 55%,#e0a400);display:flex;align-items:center;justify-content:center;font:900 30px V;color:#8a5a00;box-shadow:0 6px 14px rgba(0,0,0,.2)}
  .src{position:absolute;top:80px;left:0;right:0;display:flex;justify-content:center}
  .src span{display:flex;gap:12px;align-items:center;background:#fff;border-radius:999px;padding:10px 30px;font:800 34px V;color:var(--navy2);box-shadow:0 8px 20px rgba(20,50,110,.14)}
  .statnum{position:absolute;top:190px;left:0;right:0;text-align:center;font:900 160px/1 V;color:var(--navy)}
  .statnum em{font-style:normal;color:#e0354f}
  .statsub{position:absolute;top:400px;left:0;right:0;text-align:center;font:800 46px V;color:var(--navy2)}
  .sbar{position:absolute;left:90px;height:96px;border-radius:24px;display:flex;align-items:center;padding:0 30px;font:900 38px V;color:#fff;transform-origin:right;white-space:nowrap}
  .sbar.r{right:90px;left:auto;background:linear-gradient(270deg,#ff6b6b,#e0354f)}
  .sbar.g{right:90px;left:auto;background:linear-gradient(270deg,#3ee39a,#1fbf7a)}
  .chips{position:absolute;top:670px;left:40px;right:40px;display:flex;justify-content:center;gap:18px;flex-wrap:wrap}
  .chips span{background:#fff;border-radius:999px;padding:12px 30px;font:800 38px V;color:var(--navy);box-shadow:0 10px 24px rgba(20,50,110,.16);border:3px solid #ffd34d}

  .phone{position:absolute;left:330px;top:110px;width:420px;height:760px;border-radius:64px;background:linear-gradient(160deg,#1d2a48,#0b1326);border:10px solid #2a3a5e;box-shadow:0 30px 70px rgba(10,30,80,.35);display:flex;flex-direction:column;align-items:center;padding-top:90px;gap:16px}
  .phone .cav{width:150px;height:150px;border-radius:50%;background:#33466f;display:flex;align-items:center;justify-content:center}
  .phone .cav svg{width:84px;height:84px;stroke:#cfe0ff;stroke-width:1.8;fill:none}
  .phone .cn{font:800 40px V;color:#fff;direction:ltr}
  .phone .cs{font:500 30px V;color:#9fb3da}
  .phone .btns{position:absolute;bottom:70px;left:0;right:0;display:flex;justify-content:space-around}
  .phone .btns i{width:100px;height:100px;border-radius:50%;display:flex;align-items:center;justify-content:center}
  .phone .btns svg{width:50px;height:50px;fill:#fff}
  .bubble{position:absolute;right:60px;top:170px;background:#fff;border-radius:36px 36px 8px 36px;padding:24px 36px;font:900 58px V;color:var(--navy);box-shadow:0 18px 40px rgba(20,50,110,.2)}
  .trust{position:absolute;left:50px;top:560px;width:270px}
  .trust .tl{font:800 32px V;color:var(--navy);margin-bottom:12px}
  .trust .tb{height:40px;border-radius:20px;background:#e3e9f4;overflow:hidden}
  .trust .tb i{display:block;height:100%;border-radius:20px;background:linear-gradient(90deg,#1fbf7a,#3ee39a);transform-origin:right}
  .trust .tp{font:900 70px V;color:#e0354f;margin-top:8px}
  .sbox{position:absolute;left:70px;right:70px;top:120px;height:120px;border-radius:60px;background:#fff;box-shadow:0 14px 34px rgba(20,50,110,.16);display:flex;align-items:center;gap:20px;padding:0 40px;font:700 40px V;color:var(--navy)}
  .sbox svg{width:50px;height:50px;stroke:#7d8bab;stroke-width:2.4;fill:none}
  .sbox .cur{width:4px;height:48px;background:var(--blue)}
  .skel{position:absolute;left:70px;right:70px;height:96px;border-radius:24px;background:linear-gradient(90deg,#eef2f8 0%,#f8faff 50%,#eef2f8 100%);background-size:200% 100%}
  .ringbadge{position:absolute;left:70px;top:640px;display:flex;align-items:center;gap:20px;background:#fff;border-radius:999px;padding:16px 36px 16px 20px;box-shadow:0 14px 34px rgba(20,50,110,.18);font:800 40px V;color:var(--navy)}
  .ringbadge i{width:80px;height:80px;border-radius:50%;background:#1fbf7a;display:flex;align-items:center;justify-content:center}
  .ringbadge svg{width:44px;height:44px;fill:#fff}
  .stamp{position:absolute;right:80px;top:600px;border:8px solid #e0354f;color:#e0354f;font:900 60px V;border-radius:24px;padding:10px 30px;transform:rotate(-8deg);background:rgba(255,255,255,.9)}
  .goodtoast{position:absolute;left:70px;right:70px;top:780px;display:flex;align-items:center;gap:20px;background:#eafbf2;border:3px solid #1fbf7a;border-radius:28px;padding:18px 30px;font:800 40px V;color:#137a4d}
  .tpc{position:absolute;top:110px;width:440px;height:400px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px}
  .tpc .av{width:120px;height:120px;font-size:50px}
  .tpc .nm{font:900 44px V;color:var(--navy)}
  .tpc .day{font:800 30px V;border-radius:999px;padding:6px 24px;background:#eef2f8;color:#5a6a8a}
  .tpc .pr{font:900 64px V;color:var(--navy);white-space:nowrap}
  .tpc .pr small{font:800 30px V;color:var(--muted)}
  .neq{position:absolute;left:470px;top:240px;width:140px;height:140px;border-radius:50%;background:#e0354f;color:#fff;display:flex;align-items:center;justify-content:center;font:900 96px/1 V;box-shadow:0 14px 34px rgba(224,53,79,.4)}
  .cust{position:absolute;left:70px;right:70px;top:580px;height:230px;display:flex;align-items:center;gap:30px;padding:0 44px}
  .cust .av{width:130px;height:130px;font-size:56px}
  .cust .q{font:900 50px V;color:var(--navy)}
  .cust .tw{flex:1}
  .cust .tb{height:34px;border-radius:17px;background:#e3e9f4;overflow:hidden;margin-top:18px}
  .cust .tb i{display:block;height:100%;border-radius:17px;background:linear-gradient(90deg,#1fbf7a,#3ee39a);transform-origin:right}
  .cust .tp{font:900 60px V;color:#1fbf7a;white-space:nowrap}

  /* voice-only episodes: an animated ocean stage with Ramtin's voice visualised */
  #vs{position:absolute;left:0;top:0;width:1080px;height:1920px;overflow:hidden;
    background:radial-gradient(120% 70% at 50% 35%,#1e5fc4 0%,#0f3e8f 38%,#0a2459 70%,#071636 100%)}
  #vs .blob{position:absolute;border-radius:50%;filter:blur(70px);opacity:.55}
  #vs .grid{position:absolute;inset:0;background-image:radial-gradient(rgba(255,255,255,.13) 2px,transparent 2.5px);background-size:44px 44px;
    -webkit-mask-image:radial-gradient(70% 55% at 50% 45%,#000 30%,transparent 80%)}
  #vs .pt{position:absolute;width:8px;height:8px;border-radius:50%;background:#bfe3ff;box-shadow:0 0 14px #8fd0ff}
  #vs .ring{position:absolute;left:390px;top:610px;width:300px;height:300px;border-radius:50%;border:4px solid rgba(140,210,255,.55)}
  #vs .host{position:absolute;left:390px;top:610px;width:300px;height:300px;border-radius:50%;padding:12px;
    background:conic-gradient(from 0deg,#3ee0ff,#2f7fe0,#8b6bff,#ffd23f,#3ee0ff);box-shadow:0 0 70px rgba(80,180,255,.55)}
  #vs .host div{width:100%;height:100%;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center}
  #vs .host img{width:150px}
  #vs .mic{position:absolute;left:600px;top:820px;width:96px;height:96px;border-radius:50%;background:#ffd23f;display:flex;align-items:center;justify-content:center;box-shadow:0 10px 26px rgba(0,0,0,.3)}
  #vs .mic svg{width:52px;height:52px;fill:none;stroke:#0f1f3d;stroke-width:2.2;stroke-linecap:round}
  #vs .wave{position:absolute;left:90px;right:90px;top:1000px;height:160px;display:flex;align-items:center;justify-content:space-between}
  #vs .wave i{display:block;width:11px;border-radius:6px;background:linear-gradient(180deg,#9fe6ff,#3ea0ff 50%,#9fe6ff)}
  #vs .hn{position:absolute;left:0;right:0;top:1190px;text-align:center;font:900 54px V;color:#fff;text-shadow:0 6px 20px rgba(0,0,0,.35)}
  #vs .hr{position:absolute;left:0;right:0;top:1272px;display:flex;justify-content:center}
  #vs .hr span{font:800 32px V;color:#0f1f3d;background:#ffd23f;border-radius:999px;padding:6px 26px}

  .dcard{left:110px;right:110px;top:110px;height:600px;padding:40px 50px}
  .dtop{display:flex;align-items:center;gap:22px;justify-content:flex-start}
  .dtop b{font:900 54px V;color:var(--navy)}
  .damt{font:900 64px V;color:var(--blue);margin-top:26px}
  .ecg{position:absolute;left:50px;right:50px;top:250px;width:760px;height:170px}
  .ecg path{fill:none;stroke:#1fbf7a;stroke-width:7;stroke-linejoin:round;stroke-linecap:round}
  .dday{position:absolute;right:50px;bottom:40px;font:800 40px V;border-radius:999px;padding:10px 30px}
  .flat{position:absolute;left:0;right:0;top:760px;text-align:center;font:900 70px V;color:#e0354f}
  .dtile{position:absolute;top:210px;width:120px;height:170px;border-radius:28px;background:#fff;box-shadow:0 14px 34px rgba(20,50,110,.16);display:flex;flex-direction:column;align-items:center;justify-content:center;color:var(--navy)}
  .dtile small{font:700 26px V;opacity:.8}
  .dtile b{font:900 70px/1.1 V}
  .wbig{position:absolute;top:420px;left:0;right:0;text-align:center;font:900 220px/1 V;color:#e0354f;text-shadow:0 14px 40px rgba(224,53,79,.25)}
  .wsub2{position:absolute;top:690px;left:0;right:0;text-align:center;font:800 50px V;color:var(--navy2)}
  .fline{position:absolute;left:150px;right:150px;top:262px;height:12px;border-radius:6px;background:#dbe5f5}
  .fline i{display:block;height:100%;border-radius:6px;background:linear-gradient(270deg,#2f7fe0,#7b6bff);transform-origin:right}
  .fnode{position:absolute;top:200px;width:120px;display:flex;flex-direction:column;align-items:center;gap:18px}
  .fdot{width:120px;height:120px;border-radius:50%;background:#fff;border:6px solid #dbe5f5;display:flex;align-items:center;justify-content:center;font:900 52px V;color:#9aa8c2;box-shadow:0 12px 30px rgba(20,50,110,.14)}
  .fnode.on .fdot{background:var(--blue);border-color:#cfe1fb;color:#fff}
  .flb{font:900 34px/1.25 V;color:var(--navy);text-align:center;width:220px}
  .ftok{position:absolute;left:0;top:0;width:140px;height:64px;border-radius:32px;background:var(--yellow);font:900 32px V;color:var(--navy);display:flex;align-items:center;justify-content:center;box-shadow:0 10px 24px rgba(0,0,0,.18)}
  .fend{position:absolute;top:640px;border-radius:30px;padding:22px 40px;font:900 48px V;color:#fff;box-shadow:0 14px 34px rgba(0,0,0,.15)}
  .fend.g{background:linear-gradient(90deg,#1fbf7a,#3ee39a)} .fend.r{background:linear-gradient(90deg,#e0354f,#ff6b6b)}
  .farr{position:absolute;left:0;top:360px;width:1080px;height:300px}
  .farr path{fill:none;stroke:#b9c8e2;stroke-width:8;stroke-dasharray:18 14;stroke-linecap:round}
  .fring{position:absolute;top:186px;width:180px;height:180px;border-radius:50%;box-shadow:0 0 0 10px #e0354f,0 0 50px 20px rgba(224,53,79,.45)}
  .fcount{position:absolute;top:24px;width:200px;text-align:center;font:900 44px V;color:#fff;border-radius:999px;padding:8px 0}
  .nobody{position:absolute;left:0;right:0;top:520px;text-align:center;font:900 96px V;color:var(--navy)}
  .nobody em{font-style:normal;color:#e0354f}
  .nochip{position:absolute;top:700px;display:flex;align-items:center;gap:18px;background:#fff;border-radius:999px;padding:16px 34px;font:900 44px V;color:var(--navy);box-shadow:0 12px 30px rgba(20,50,110,.16)}
  .nochip b{color:#fff;background:#e0354f;border-radius:50%;width:54px;height:54px;display:flex;align-items:center;justify-content:center;font:900 34px V}
  .tm{position:absolute;top:200px;width:280px;display:flex;flex-direction:column;align-items:center;gap:14px}
  .tm .av{width:150px;height:150px;font-size:64px}
  .tm .fn{font:900 40px V;color:var(--navy)}
  .tbub{background:#fff;border-radius:30px 30px 30px 8px;padding:16px 26px;font:800 32px V;color:var(--navy2);box-shadow:0 12px 30px rgba(20,50,110,.16);white-space:nowrap;margin-bottom:10px}
  .custw{left:110px;right:110px;top:420px;height:230px;display:flex;align-items:center;gap:34px;padding:0 50px}
  .custw .av{width:140px;height:140px;font-size:60px}
  .custw .q{font:900 54px V;color:var(--navy)}
  .custw .w{display:flex;align-items:center;gap:12px;font:800 38px V;color:#e07a10;margin-top:10px}
  .custw .hg{margin-right:auto;font-size:90px}
  .cchip{position:absolute;top:720px;background:#fff;border-radius:999px;padding:16px 34px;font:900 44px V;color:var(--navy);box-shadow:0 12px 30px rgba(20,50,110,.16)}
  .cchip.r{background:#e0354f;color:#fff}
  .sw{position:absolute;left:380px;top:60px;width:320px;height:320px}
  .sw svg{width:320px;height:320px}
  .sw .bg{fill:#fff;stroke:#e3ebf8;stroke-width:16} .sw .fg{fill:none;stroke:var(--blue);stroke-width:16;stroke-linecap:round;transform:rotate(-90deg);transform-origin:100px 108px}
  .sw rect{fill:var(--navy)}
  .swt{position:absolute;left:0;right:0;top:110px;text-align:center;line-height:1}
  .swt b{display:block;font:900 120px/1 V;color:var(--navy)} .swt small{font:800 36px V;color:var(--muted)}
  .swsub{position:absolute;left:0;right:0;top:410px;text-align:center;font:900 60px V;color:var(--navy)}
  .swsub em{font-style:normal;color:var(--blue)}
  .wd{position:absolute;top:530px;width:180px;height:96px;border-radius:24px;background:#fff;box-shadow:0 10px 24px rgba(20,50,110,.12);display:flex;align-items:center;justify-content:center;font:800 32px V;color:var(--navy2)}
  .wd.on{background:var(--blue);color:#fff}
  .slot{position:absolute;right:50px;top:650px;background:var(--yellow);color:var(--navy);font:900 40px V;border-radius:999px;padding:12px 32px;box-shadow:0 10px 24px rgba(0,0,0,.15)}
  .fpill{position:absolute;left:70px;top:650px;display:flex;align-items:center;gap:16px;background:linear-gradient(90deg,#6a5cff,#b14cff);color:#fff;font:900 42px V;border-radius:999px;padding:16px 36px;box-shadow:0 12px 30px rgba(90,60,200,.35)}
  .dmini{left:200px;right:200px;top:70px;height:150px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px}
  .dmini b{font:900 44px V;color:var(--navy)}
  .oneof{position:absolute;left:0;right:0;top:250px;text-align:center;font:900 46px V;color:var(--muted)}
  .opt{top:340px;width:440px;height:440px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:24px}
  .opt.g{right:70px;background:#eafbf2} .opt.r{left:70px;background:#fff1f3}
  .opt .oi{width:150px;height:150px;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center}
  .opt b{font:900 66px V;color:var(--navy)}
  .opt .od{font:900 38px V;border-radius:999px;padding:10px 30px;color:#fff}
  .opt.g .od{background:#1fbf7a} .opt.r .od{background:#e0354f}
  .funnel{position:absolute;left:140px;top:150px;width:800px;height:640px}
  .funnel path{fill:#e8eef9;stroke:#c9d6ee;stroke-width:6;stroke-linejoin:round}
  .ghost{position:absolute;width:150px;height:62px;margin-left:-75px;border-radius:16px;background:#cfd6e2;color:#6b7690;font:800 26px V;display:flex;align-items:center;justify-content:center;border:3px dashed #a9b4c8}
  .fake{position:absolute;right:90px;top:430px;display:flex;align-items:center;gap:16px;border:9px solid #e0354f;background:rgba(255,255,255,.95);color:#e0354f;font:900 70px V;border-radius:30px;padding:16px 36px}
  `;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  const AV = ['#5b8def', '#ff8a5b', '#33c49b', '#b06cff', '#f5b62e', '#e85d8a'];
  const S = (n, cls = 'ic') => svg(n, `class="${cls}"`);
  window.SFX = [];
  const sfx = (t, type, g = 1) => { if (window.__sfxOn) window.SFX.push({ t, type, g }); };
  const fadeIn = (el, t, d = .35, dy = 30) => { sfx(t, 'soft', .5); anim(el, [{ t: t - .001, o: 0, y: dy }, { t: t + d, o: 1, y: 0 }]); };
  const _pop = window.pop; window.pop = (el, t, d) => { sfx(t, 'pop', .6); _pop(el, t, d); };

  const P = {};
  P.word = (o, root) => {
    if (o.sub) { const s = h(`<div class="wordsub">${o.sub}</div>`); root.appendChild(s); fadeIn(s, o.c0); }
    const w = h(`<div class="wordbig">${o.text}</div>`); root.appendChild(w); if (o.size) w.style.fontSize = o.size + 'px'; if (o.top) w.style.top = o.top + 'px';
    sfx(o.c0, 'thud', .8);
    anim(w, [{ t: o.c0, o: 0, s: .7, b: 14 }, { t: o.c0 + .5, o: 1, s: 1, b: 0, e: 'back' }, { t: o.eraseAt || o.t1, s: 1 }, { t: (o.eraseAt || o.t1) + 1.2, s: 1, b: 6 }]);
    if (o.eraseAt) { sfx(o.eraseAt, 'scratch', .7); const wp = h(`<div class="wiper"></div>`); root.appendChild(wp);
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
    if (o.chips) {
      const cw = h(`<div class="chips"></div>`); root.appendChild(cw);
      o.chips.forEach(c => { const e = h(`<span>${c.text}</span>`); cw.appendChild(e); pop(e, c.at, .35); });
      if (o.chipsOutAt) hook(t => { cw.style.opacity = 1 - clamp((t - o.chipsOutAt) / .4, 0, 1); });
    }
    if (o.strikeAt) { sfx(o.strikeAt + .35, 'scratch', .8);
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
    img.style.height = 'auto';
    const ihOf = () => img.naturalWidth ? 1000 * img.naturalHeight / img.naturalWidth : 625;
    const seq = [{ at: o.c0, x: .5, y: .5, s: null }, ...(o.focus || [])];
    (o.focus || []).forEach(f => sfx(f.at, 'zoom', .5));
    hook(t => {
      const ih = ihOf(), s0 = ih >= H ? 1 : (H / ih <= 1.6 ? H / ih : 1);   // fill the window unless the picture is a small card
      const S = f => f.s ?? s0;
      let cur = seq[0];
      for (let i = 0; i < seq.length; i++) if (seq[i].at <= t) cur = seq[i];
      const prev = seq[Math.max(0, seq.indexOf(cur) - 1)];
      const v = EASE.io(clamp((t - cur.at) / .9, 0, 1));
      const k = lerp(S(prev), S(cur), v), x = lerp(prev.x, cur.x, v), y = lerp(prev.y, cur.y, v);
      let tx = W / 2 - x * 1000 * k, ty = H / 2 - y * ih * k;
      tx = 1000 * k <= W ? (W - 1000 * k) / 2 : clamp(tx, W - 1000 * k, 0);
      ty = ih * k <= H ? (H - ih * k) / 2 : clamp(ty, H - ih * k, 0);
      img.style.transform = `translate(${tx}px,${ty}px) scale(${k})`;
    });
  };
  P.versus = (o, root) => {
    const R = h(`<div class="card vs" style="right:60px;background:#eafbf2"><div class="vbig" style="background:#c9f2d8"><svg viewBox="0 0 24 24" stroke="#1a9a5e">${ICONS.users}</svg></div>
      <div class="lb">${o.right || 'مشتری‌های قبلی'}</div><div class="sb" style="background:#fff;color:#1a9a5e">${o.rightSub || 'منتظر یه تماس'}</div></div>`);
    const L = h(`<div class="card vs" style="left:60px;background:#fff3f3"><div class="vbig" style="background:#ffd9d9"><svg viewBox="0 0 24 24" stroke="#e0354f"><circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01"/></svg></div>
      <div class="lb">${o.left || 'غریبه‌ها'}</div><div class="sb" style="background:#fff;color:#e0354f">${o.leftSub || 'بودجهٔ تبلیغات'}</div></div>`);
    root.append(R, L); pop(L, o.c0, .4); pop(R, o.c0 + .15, .4);
    const x = h(`<div class="vsx">در برابر</div>`); root.appendChild(x); pop(x, o.c0 + .3, .35);
    for (let i = 0; i < (o.noCoins ? 0 : 6); i++) { sfx(o.c0 + .6 + i * .35, 'coin', .45);
      const c = h(`<div class="coin">تومان</div>`); root.appendChild(c);
      const t = o.c0 + .6 + i * .35;
      anim(c, [{ t: t - .001, o: 0, x: 503, y: 40, s: .6 }, { t: t + .1, o: 1, s: 1 }, { t: t + .7, x: 200 + (i % 3) * 40, y: 300 + (i % 2) * 50, s: .7, e: 'in' }, { t: t + .8, o: 0 }]);
      c.style.left = '0px'; c.style.top = '0px';
    }
    if (o.waitAt) sfx(o.waitAt, 'ring', .7);
    if (o.waitAt) anim(R, [{ t: o.waitAt, s: 1 }, { t: o.waitAt + .2, s: 1.06 }, { t: o.waitAt + .4, s: 1 }, { t: o.waitAt + .6, s: 1.06 }, { t: o.waitAt + .8, s: 1 }]);
  };
  P.stat = (o, root) => {
    const sr = h(`<div class="src"><span>${S('chart', 'ic" style="width:36px;height:36px')}${o.source}</span></div>`); root.appendChild(sr); pop(sr, o.c0, .4);
    const n = h(`<div class="statnum">${richSub(o.number).replace('<em>', '<em>')}</div>`); root.appendChild(n);
    const ra = o.revealAt || o.c0 + .5; sfx(ra - .7, 'riser', .7); sfx(ra, 'ding', .9);
    anim(n, [{ t: o.c0 + .2, o: 0, s: .8, b: 22 }, { t: o.c0 + .6, o: 1, s: 1, b: 22 }, { t: ra, b: 22 }, { t: ra + .5, b: 0, s: 1.06, e: 'out' }, { t: ra + .8, s: 1 }]);
    const sb = h(`<div class="statsub">${o.sub}</div>`); root.appendChild(sb); fadeIn(sb, ra + .3);
    const ba = o.barsAt || ra + .8;
    const b1 = h(`<div class="sbar r" style="top:540px;width:900px">${o.bar1 || 'جذب مشتری جدید'}</div>`), b2 = h(`<div class="sbar g" style="top:680px;width:500px">${o.bar2 || 'نگه داشتن مشتری'}</div>`);
    root.append(b1, b2);
    [[b1, ba], [b2, ba + .5]].forEach(([b, t]) => anim(b, [{ t: t - .001, o: 0 }, { t: t + .05, o: 1, e: 'lin' }]));
    hook(t => { b1.style.transform = `scaleX(${EASE.out(clamp((t - ba) / .8, 0, 1))})`; b2.style.transform = `scaleX(${EASE.out(clamp((t - ba - .5) / .8, 0, 1))})`; });
    if (o.labelsAt) { const l1 = h(`<div class="pill r" style="position:absolute;left:90px;top:840px;font-size:40px">${o.label1 || 'گرون'}</div>`), l2 = h(`<div class="pill" style="position:absolute;right:90px;top:840px;font-size:40px;background:#dcf7e7;color:#1a9a5e">${o.label2 || 'ارزون'}</div>`); root.append(l1, l2); pop(l1, o.labelsAt); pop(l2, o.labelsAt + .2); }
  };
  // incoming call -> «ببخشید، شما؟» -> trust drops
  P.call = (o, root) => {
    const ph = h(`<div class="phone"><div class="cav"><svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/></svg></div>
      <div class="cn">${o.number || '۰۹۱۲ ••• ۴۵۶۷'}</div><div class="cs">${o.status || 'تماس ورودی…'}</div>
      <div class="btns"><i style="background:#e0354f"><svg viewBox="0 0 24 24" style="transform:rotate(135deg)"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/></svg></i><i style="background:#1fbf7a"><svg viewBox="0 0 24 24"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/></svg></i></div></div>`);
    root.appendChild(ph); fadeIn(ph, o.c0, .4, 80);
    const ringEnd = o.askAt || o.c0 + 2;
    for (let t = o.c0 + .3; t < ringEnd - .2; t += 1.1) sfx(t, 'ring', .55);
    hook(t => { const on = t > o.c0 + .3 && t < ringEnd; ph.style.rotate = on ? (Math.sin(t * 60) * 2.2) + 'deg' : '0deg'; });
    if (o.askAt) { const b = h(`<div class="bubble">${o.ask || '«ببخشید، شما؟»'}</div>`); root.appendChild(b); pop(b, o.askAt, .4); }
    if (o.dropAt) {
      const tr = h(`<div class="trust"><div class="tl">اعتماد مشتری</div><div class="tb"><i></i></div><div class="tp">۱۰۰٪</div></div>`); root.appendChild(tr); fadeIn(tr, o.askAt || o.c0 + 1);
      const bar = tr.querySelector('i'), tp = tr.querySelector('.tp'); sfx(o.dropAt, 'down', .9);
      const fa = n => String(n).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);
      hook(t => { const u = EASE.io(clamp((t - o.dropAt) / .9, 0, 1)); const v = Math.round(100 - 50 * u); bar.style.transform = `scaleX(${v / 100})`; bar.style.background = u > .5 ? 'linear-gradient(90deg,#ff6b6b,#e0354f)' : ''; tp.textContent = fa(v) + '٪'; tp.style.color = u > .2 ? '#e0354f' : '#1fbf7a'; });
    }
  };
  // searching the history by hand while the phone rings
  P.search = (o, root) => {
    const sb = h(`<div class="sbox"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg><span></span><i class="cur"></i></div>`); root.appendChild(sb); fadeIn(sb, o.c0);
    const span = sb.querySelector('span'), cur = sb.querySelector('.cur'), txt = o.typing || 'سابقهٔ مشتری…', t0 = o.c0 + .4;
    for (let i = 0; i < txt.length; i += 2) sfx(t0 + i * .08, 'type', .35);
    hook(t => { span.textContent = txt.slice(0, Math.max(0, Math.floor((t - t0) / .08))); cur.style.opacity = (Math.floor(t * 3) % 2) ? 1 : 0; });
    [280, 400, 520].forEach((y, i) => { const k = h(`<div class="skel" style="top:${y}px"></div>`); root.appendChild(k); fadeIn(k, o.c0 + .2 + i * .1, .3, 20);
      hook(t => { k.style.backgroundPosition = `${(-t * 120) % 200}% 0`; }); });
    if (o.ringAt) { const rb = h(`<div class="ringbadge"><i><svg viewBox="0 0 24 24"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/></svg></i>${o.ringText || 'تلفن زنگ می‌زنه!'}</div>`); root.appendChild(rb); pop(rb, o.ringAt, .35);
      for (let t = o.ringAt; t < (o.noTimeAt || o.ringAt + 2); t += 1.1) sfx(t, 'ring', .5);
      hook(t => { rb.style.rotate = (t > o.ringAt && t < (o.noTimeAt || 1e9)) ? (Math.sin(t * 55) * 3) + 'deg' : '0deg'; }); }
    if (o.noTimeAt) { const st = h(`<div class="stamp">${o.noTimeText || 'وقت گشتن نیست!'}</div>`); root.appendChild(st); sfx(o.noTimeAt, 'buzz', .7);
      anim(st, [{ t: o.noTimeAt - .001, o: 0, s: 1.8 }, { t: o.noTimeAt + .25, o: 1, s: 1, e: 'out' }]); }
    if (o.autoAt) { const g = h(`<div class="goodtoast">✓ ${o.autoText || 'سابقه باید خودش بیاد جلوی چشم'}</div>`); root.appendChild(g); fadeIn(g, o.autoAt); sfx(o.autoAt, 'ding', .7); }
  };
  // two colleagues quote the same customer two different prices -> trust gone
  P.twoprice = (o, root) => {
    const card = (c, x, bg) => h(`<div class="card tpc" style="${x};background:${bg}"><div class="av" style="background:${c.color}">${c.name[0]}</div>
      <div class="nm">${c.name}</div><div class="day">${c.day}</div><div class="pr">${c.price} <small>تومان</small></div></div>`);
    const a = o.a || { name: 'همکارتون', day: 'دیروز', price: '۴۲ میلیون', color: '#5b8def' };
    const b = o.b || { name: 'شما', day: 'امروز', price: '۴۸ میلیون', color: '#ff8a5b' };
    const A = card(a, 'right:60px', '#fff'), B = card(b, 'left:60px', '#fff');
    root.append(A, B); pop(A, o.aAt || o.c0, .45); pop(B, o.bAt || o.c0 + 1, .45);
    sfx((o.aAt || o.c0) + .1, 'coin', .5); sfx((o.bAt || o.c0 + 1) + .1, 'coin', .5);
    if (o.neqAt) { const n = h(`<div class="neq">≠</div>`); root.appendChild(n); pop(n, o.neqAt, .4); sfx(o.neqAt, 'buzz', .7);
      hook(t => { const on = t > o.neqAt; [A, B].forEach(c => c.style.boxShadow = on ? '0 0 0 6px #ffb3bf,0 18px 50px rgba(224,53,79,.18)' : ''); }); }
    if (o.custAt) {
      const c = h(`<div class="card cust"><div class="av" style="background:#33c49b">م</div><div class="tw"><div class="q">${o.ask || 'مشتری: «کدومش راسته؟»'}</div><div class="tb"><i></i></div></div><div class="tp">۱۰۰٪</div></div>`);
      root.appendChild(c); fadeIn(c, o.custAt, .4, 60);
      const bar = c.querySelector('.tb i'), tp = c.querySelector('.tp'), fa = n => String(n).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);
      if (o.dropAt) { sfx(o.dropAt, 'down', .9);
        hook(t => { const u = EASE.io(clamp((t - o.dropAt) / 1.1, 0, 1)); const v = Math.round(100 * (1 - u)); bar.style.transform = `scaleX(${Math.max(v, 2) / 100})`;
          bar.style.background = u > .3 ? 'linear-gradient(90deg,#ff6b6b,#e0354f)' : ''; tp.textContent = fa(v) + '٪'; tp.style.color = u > .2 ? '#e0354f' : '#1fbf7a'; }); }
    }
  };
  P.teaser = (o, root) => {
    const b = h(`<div class="badge"><span>${o.badge || 'قسمت بعد'}</span></div>`); root.appendChild(b); pop(b, o.c0, .4);
    sfx(o.numberAt || o.c0 + .4, 'thud', .8); if (o.titleAt) sfx(o.titleAt, 'riser', .5);
    const lc = h(`<div class="card lockcard"><b style="${(o.secret || '').length > 4 ? 'font-size:120px' : ''}">${o.secret || '×۲۵'}</b>${S('key')}</div>`); root.appendChild(lc); pop(lc, o.numberAt || o.c0 + .4, .45);
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
    const ca = o.clickAt || o.c0 + 1.6; sfx(ca, 'click', 1); sfx(ca + .05, 'ding', .6);
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
    const sa = o.sendAt || o.c0 + 1.5; sfx(sa - .1, 'whoosh', .9); fr.forEach((_, i) => sfx(sa + i * .45, 'swish', .7));
    anim(pl, [{ t: sa - .2, s: 1 }, ...fr.flatMap((_, i) => [{ t: sa + i * .45, s: .9, e: 'out' }, { t: sa + i * .45 + .15, s: 1.08, e: 'out' }]), { t: sa + fr.length * .45 + .3, s: 1 }]);
    fr.forEach((_, i) => {
      const m = h(`<div class="plane" style="width:70px;height:70px;left:510px;top:270px;box-shadow:none">${svg('send', 'style="width:38px;height:38px"')}</div>`);
      root.appendChild(m);
      const dx = xs[i] + 100 - 545, dy = 635 - 305, t1 = sa + i * .45;
      anim(m, [{ t: t1 - .001, o: 0, x: 0, y: 0, s: .5 }, { t: t1 + .05, o: 1, s: .9 }, { t: t1 + .2, x: dx * .5, y: dy * .5 - 90, s: 1, e: 'lin' },
               { t: t1 + .4, x: dx, y: dy, s: .6, o: 1, e: 'in' }, { t: t1 + .5, o: 0, s: .3 }]);
    });
  };


  // ---- episode 5 (voice-only) overlays ----
  const fa = n => String(n).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);
  // a deal card whose heartbeat fades to a flat line while the "days untouched" counter climbs
  P.dying = (o, root) => {
    const c = h(`<div class="card dcard"><div class="dtop"><span class="pill o">${o.stage || 'مذاکره'}</span><b>${o.title || 'قرارداد پشتیبانی سالانه'}</b></div>
      <div class="damt">${o.amount || '۴۲۰ میلیون تومان'}</div><svg class="ecg" viewBox="0 0 800 170"><path/></svg><div class="dday">روز <b>۱</b> بدون تغییر</div></div>`);
    root.appendChild(c); fadeIn(c, o.c0, .45, 60);
    const path = c.querySelector('path'), day = c.querySelector('.dday b'), dd = c.querySelector('.dday'), inner = c;
    const d0 = o.dayAt || o.c0 + .4, d1 = o.dayEnd || (o.dieAt - .5), die = o.dieAt;
    for (let k = 1; k <= 7; k++) sfx(d0 + (d1 - d0) * (k - 1) / 6, 'click', .45);
    for (let t = o.c0 + .6; t < die - .3; t += .95) sfx(t, 'thud', .18 * (1 - (t - o.c0) / (die - o.c0)) + .05);
    sfx(die, 'down', .9);
    const beat = x => { const p = ((x % 260) + 260) % 260; return p < 90 ? 0 : p < 100 ? -(p - 90) * 3 : p < 112 ? -30 + (p - 100) * 9 : p < 124 ? 78 - (p - 112) * 8 : p < 130 ? -18 + (p - 124) * 3 : 0; };
    hook(t => {
      const amp = 1 - EASE.io(clamp((t - o.c0 - .5) / (die - o.c0 - .5), 0, 1));
      let d = ''; for (let x = 0; x <= 800; x += 5) d += (x ? 'L' : 'M') + x + ' ' + (85 + beat(x + t * 260) * amp).toFixed(1);
      path.setAttribute('d', d);
      const dead = t >= die; path.style.stroke = dead ? '#e0354f' : amp < .5 ? '#f5a524' : '#1fbf7a';
      inner.style.filter = dead ? `grayscale(${clamp((t - die) / .6, 0, 1)})` : '';
      day.textContent = fa(Math.max(1, Math.min(7, 1 + Math.floor((t - d0) / ((d1 - d0) / 6)))));
      dd.style.background = t > d1 ? '#ffe9ec' : '#eef2f8'; dd.style.color = t > d1 ? '#e0354f' : '#5a6a8a';
    });
    if (o.dieText) { const s = h(`<div class="flat">${o.dieText}</div>`); root.appendChild(s); anim(s, [{ t: die - .001, o: 0, s: 1.6 }, { t: die + .25, o: 1, s: 1, e: 'out' }]); }
  };
  // seven day tiles fill one by one, then the answer stamps in
  P.week = (o, root) => {
    const q = h(`<div class="wordsub" style="top:70px">${o.question || 'چند روز طول می‌کشه؟'}</div>`); root.appendChild(q); fadeIn(q, o.c0);
    const tiles = []; const f0 = o.fillAt || o.c0 + .6, fd = o.fillDur || 2.4;
    for (let i = 0; i < 7; i++) {
      const el = h(`<div class="dtile" style="right:${70 + i * 136}px"><small>روز</small><b>${fa(i + 1)}</b></div>`); root.appendChild(el); pop(el, o.c0 + .2 + i * .06, .3); tiles.push(el);
      const ta = f0 + fd * i / 6; sfx(ta, 'click', .55);
      hook(t => { const on = t >= ta, u = i / 6; el.style.background = on ? `hsl(${lerp(210, 352, u)},80%,${lerp(56, 55, u)}%)` : '#fff'; el.style.color = on ? '#fff' : 'var(--navy)'; });
    }
    const ra = o.revealAt; sfx(ra - .6, 'riser', .5); sfx(ra, 'thud', 1); sfx(ra + .05, 'ding', .7);
    const big = h(`<div class="wbig">${o.answer || '۷ روز'}</div>`); root.appendChild(big);
    anim(big, [{ t: ra - .001, o: 0, s: 2.2, b: 10 }, { t: ra + .3, o: 1, s: 1, b: 0, e: 'out' }]);
    if (o.sub) { const s = h(`<div class="wsub2">${o.sub}</div>`); root.appendChild(s); fadeIn(s, ra + .4); }
  };
  // sales stages light up in order, a deal token travels along; optional fork, or it gets stuck while days pile up
  P.flow = (o, root) => {
    const st = o.stages || ['جدید', 'تماس گرفته شد', 'پیشنهاد ارسال شد', 'مذاکره'];
    const X = i => 830 - i * 250;
    const line = h(`<div class="fline"><i></i></div>`); root.appendChild(line); fadeIn(line, o.c0, .3, 0);
    const fill = line.querySelector('i');
    const nodes = st.map((s, i) => { const at = (o.at || [])[i] ?? o.c0 + .1 + i * .08;
      const el = h(`<div class="fnode" style="left:${X(i)}px"><div class="fdot">${fa(i + 1)}</div><div class="flb">${s}</div></div>`); root.appendChild(el); pop(el, at, .35); return { el, at }; });
    const tok = h(`<div class="ftok">فرصت</div>`); root.appendChild(tok);
    const stopI = o.stuck ? st.length - 1 : null;
    const keys = nodes.map((n, i) => ({ t: n.at + .05, x: X(i) - 10 }));
    anim(tok, [{ t: nodes[0].at - .001, o: 0, x: X(0) - 10, y: 116, s: .6 }, { t: nodes[0].at + .2, o: 1, s: 1 }, ...keys.slice(1).map(k => ({ ...k, e: 'io' }))]);
    keys.slice(1).forEach(k => sfx(k.t - .05, 'swish', .45));
    hook(t => { let k = 0; nodes.forEach((n, i) => { if (t >= n.at) k = i; n.el.classList.toggle('on', t >= n.at); }); fill.style.transform = `scaleX(${clamp(k / (st.length - 1), 0, 1)})`; });
    if (o.forkAt) {
      const win = h(`<div class="fend g" style="right:120px">✓ ${o.win || 'فروش موفق'}</div>`), lose = h(`<div class="fend r" style="left:120px">✕ ${o.lose || 'از دست رفته'}</div>`);
      root.append(win, lose); pop(win, o.forkAt, .4); pop(lose, o.loseAt || o.forkAt + .8, .4); sfx(o.forkAt, 'ding', .7); sfx(o.loseAt || o.forkAt + .8, 'buzz', .5);
      const ar = h(`<svg class="farr" viewBox="0 0 1080 300"><path d="M${X(st.length - 1) + 60} 20 C ${X(st.length - 1) + 60} 160, 760 120, 780 240" /><path d="M${X(st.length - 1) + 60} 20 C ${X(st.length - 1) + 60} 160, 320 120, 300 240"/></svg>`);
      root.appendChild(ar); fadeIn(ar, o.forkAt - .1, .4, 0);
    }
    if (o.stuck) {
      const ring = h(`<div class="fring"></div>`); root.appendChild(ring); ring.style.left = (X(st.length - 1) - 30) + 'px';
      const cnt = h(`<div class="fcount">${'۰'} روز</div>`); root.appendChild(cnt); cnt.style.left = (X(st.length - 1) - 40) + 'px';
      const ca = o.countAt || o.c0 + .5, ce = o.countEnd || ca + 2; for (let k = 1; k <= 8; k++) sfx(ca + (ce - ca) * (k - 1) / 7, 'click', .45); sfx(ce, 'buzz', .6);
      pop(cnt, ca, .3);
      hook(t => { const n = clamp(1 + Math.floor((t - ca) / ((ce - ca) / 7)), 1, 8); cnt.textContent = fa(n) + ' روز'; const red = n >= 7;
        cnt.style.background = red ? '#e0354f' : 'var(--navy)'; ring.style.opacity = t > ca ? (red ? .9 : .4) * (.6 + .4 * Math.sin(t * 8)) : 0; });
      if (o.nobodyAt) { const nb = h(`<div class="nobody">${richSub(o.nobody || '*هیچ‌کس*، هیچ کاری')}</div>`); root.appendChild(nb); sfx(o.nobodyAt, 'thud', .8);
        anim(nb, [{ t: o.nobodyAt - .001, o: 0, s: 1.5 }, { t: o.nobodyAt + .3, o: 1, s: 1, e: 'out' }]); }
      (o.nos || []).forEach((n, i) => { const el = h(`<div class="nochip" style="${i ? 'left:140px' : 'right:140px'}">${S(n.icon || 'phone', 'ic" style="width:46px;height:46px;stroke:#e0354f')}<span>${n.text}</span><b>✕</b></div>`);
        root.appendChild(el); pop(el, n.at, .35); sfx(n.at + .15, 'buzz', .55); });
    }
  };
  // everyone thinks someone else is on it; meanwhile the customer waits, forgets, and buys from a competitor
  P.team = (o, root) => {
    const ppl = o.people || ['علی', 'سارا', 'رضا'], xs = [720, 400, 80];
    const els = ppl.map((n, i) => { const el = h(`<div class="tm" style="left:${xs[i]}px"><div class="tbub">${o.think || 'اون پیگیری می‌کنه…'}</div><div class="av" style="background:${AV[i]}">${n[0]}</div><div class="fn">${n}</div></div>`);
      root.appendChild(el); const t0 = o.c0 + i * .12; sfx(t0, 'soft', .5);
      anim(el, [{ t: t0 - .001, o: 0, y: 30, s: 1 }, { t: t0 + .35, o: 1, y: 0 }, ...(o.custAt ? [{ t: o.custAt - .2, y: 0, s: 1, o: 1 }, { t: o.custAt + .3, y: -40, s: .82, o: .45 }] : [])]);
      const b = el.querySelector('.tbub'); pop(b, o.c0 + .6 + i * .45, .35); return el; });
    if (o.custAt) {
      const ca = o.custAt;
      const cu = h(`<div class="card custw"><div class="av" style="background:#33c49b">م</div><div><div class="q">مشتری</div><div class="w">${S('calendar', 'ic" style="width:40px;height:40px')}<span>${o.wait || 'یه هفته بی‌خبری…'}</span></div></div><div class="hg">⌛</div></div>`);
      root.appendChild(cu); sfx(ca, 'soft', .5);
      anim(cu, [{ t: ca - .001, o: 0, y: 60, x: 0 }, { t: ca + .4, o: 1, y: 0 }, ...(o.leftAt ? [{ t: o.leftAt + .3, x: 0, o: 1 }, { t: o.leftAt + 1.1, x: -900, o: 0, e: 'in' }] : [])]); const hg = cu.querySelector('.hg');
      hook(t => { hg.style.transform = `rotate(${Math.floor(Math.max(0, t - ca) / .8) * 180 + 180 * EASE.io(clamp(((t - ca) % .8) / .3, 0, 1))}deg)`; });
      if (o.forgotAt) { const f = h(`<div class="cchip" style="right:120px">💭 ${o.forgot || 'یادش رفت'}</div>`); root.appendChild(f); pop(f, o.forgotAt, .35); sfx(o.forgotAt, 'soft', .6); }
      if (o.leftAt) { const l = h(`<div class="cchip r" style="left:120px">🏃 ${o.left || 'از رقیب خرید کرد'}</div>`); root.appendChild(l); pop(l, o.leftAt, .35); sfx(o.leftAt, 'swish', .8); sfx(o.leftAt + .4, 'coin', .6);}
    }
  };
  // ten minutes a week: stopwatch fills, a fixed weekly slot, then the "untouched only" filter
  P.timer = (o, root) => {
    const sw = h(`<div class="sw"><svg viewBox="0 0 200 200"><circle cx="100" cy="108" r="78" class="bg"/><circle cx="100" cy="108" r="78" class="fg"/><rect x="88" y="6" width="24" height="18" rx="5"/></svg><div class="swt"><b>۱۰</b><small>دقیقه</small></div></div>`);
    root.appendChild(sw); sfx(o.c0, 'pop', .6);
    anim(sw, [{ t: o.c0, o: 0, s: .6 }, { t: o.c0 + .45, o: 1, s: 1, e: 'back' }, ...(o.filterAt ? [{ t: o.filterAt - .2, o: 1, s: 1 }, { t: o.filterAt + .3, o: .2, s: .8 }] : [])]);
    const fg = sw.querySelector('.fg'), L = 2 * Math.PI * 78; fg.style.strokeDasharray = L;
    const r0 = o.c0 + .3, r1 = o.fillEnd || r0 + 2; for (let t = r0; t < r1; t += .25) sfx(t, 'type', .25); sfx(r1, 'ding', .7);
    hook(t => { fg.style.strokeDashoffset = L * (1 - EASE.io(clamp((t - r0) / (r1 - r0), 0, 1))); });
    if (o.weekAt) { const w = h(`<div class="swsub">${o.weekText || 'فقط ده دقیقه *در هفته*'}</div>`); w.innerHTML = richSub(w.innerHTML); root.appendChild(w); fadeIn(w, o.weekAt); }
    if (o.slotAt) {
      const days = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه'];
      days.forEach((d, i) => { const el = h(`<div class="wd" style="right:${60 + i * 196}px">${d}</div>`); root.appendChild(el); pop(el, o.slotAt + i * .07, .3);
        if (i === 0) { const s = h(`<div class="slot">${o.slot || 'هر شنبه ساعت ۹'}</div>`); root.appendChild(s); pop(s, o.slotAt + .7, .4); sfx(o.slotAt + .7, 'ding', .6);
          hook(t => el.classList.toggle('on', t > o.slotAt + .7)); } });
    }
    if (o.filterAt) { const f = h(`<div class="fpill">${S('chart', 'ic" style="width:42px;height:42px;stroke:#fff')}${o.filter || 'فقط فرصت‌های بی‌حرکت'}</div>`); root.appendChild(f); pop(f, o.filterAt, .4); sfx(o.filterAt, 'click', .8);}
  };
  // one stale deal, exactly two choices: a next step with a date, or close it with a reason
  P.decide = (o, root) => {
    const d = h(`<div class="card dmini"><span class="pill r">${o.age || '۹ روز بی‌حرکت'}</span><b>${o.title || 'خرید لایسنس سازمانی'}</b></div>`); root.appendChild(d); pop(d, o.c0, .4);
    const tag = h(`<div class="oneof">${o.label || 'فقط یکی از این دو:'}</div>`); root.appendChild(tag); fadeIn(tag, o.c0 + .3);
    const A = h(`<div class="card opt g"><div class="oi">${S('calendar', 'ic" style="width:70px;height:70px;stroke:#1a9a5e')}</div><b>${o.a || 'قدم بعدی'}</b><span class="od">${o.date || 'تماس · ۲۰ آبان'}</span></div>`);
    const B = h(`<div class="card opt r"><div class="oi">${S('key', 'ic" style="width:70px;height:70px;stroke:#e0354f')}</div><b>${o.b || 'ببندش'}</b><span class="od">${o.reason || 'دلیل: قیمت'}</span></div>`);
    root.append(A, B); pop(A, o.nextAt, .45); pop(B, o.closeAt, .45); sfx(o.nextAt, 'whoosh', .4); sfx(o.closeAt, 'whoosh', .4);
    if (o.dateAt) { pop(A.querySelector('.od'), o.dateAt, .35); sfx(o.dateAt, 'ding', .6); } else A.querySelector('.od').style.display = 'none';
    if (o.lockAt) { pop(B.querySelector('.od'), o.lockAt, .35); sfx(o.lockAt, 'thud', .8); } else B.querySelector('.od').style.display = 'none';
  };
  // the funnel looks full… of dead deals; "false sense of safety" stamp

  P.reasons = (o, root) => {
    // mode 'pick': a lost customer card + reason chips; mode 'tally': end-of-month count, one reason wins
    const R = o.items || [['قیمت','tag'],['زمان تحویل','calendar'],['رقیب','users'],['پیگیری نکردیم','phone']];
    if ((o.mode || 'pick') === 'pick') {
      const c = h(`<div class="card" style="right:90px;left:90px;top:60px;height:190px;padding:30px 40px;display:flex;align-items:center;gap:26px">
        <div style="width:110px;height:110px;border-radius:50%;background:#ffe3e3;display:flex;align-items:center;justify-content:center">${S('users','ic" style="width:60px;height:60px;stroke:#e0354f')}</div>
        <div style="flex:1"><div style="font:900 44px V;color:var(--navy)">${o.name || 'رضا حیدری'}</div><div style="font:700 30px V;color:#e0354f;margin-top:6px">✕ نخرید</div></div></div>`);
      root.appendChild(c); pop(c, o.c0, .4); sfx(o.c0 + .1, 'buzz', .5);
      const line = h(`<div class="card" style="right:90px;left:90px;top:290px;height:120px;padding:0 40px;display:flex;align-items:center;gap:20px;font:800 40px V;color:var(--navy)">دلیل: <span class="rsv" style="flex:1;border-bottom:5px dashed #b8c6e0;height:56px;color:#1a9a5e"></span></div>`);
      root.appendChild(line); pop(line, o.lineAt || o.c0 + .8, .4);
      const pos = [[470,560],[470,120],[600,560],[600,120]];
      R.forEach(([t, ic], i) => { const at = (o.at || [])[i] ?? o.c0 + 1.5 + i * .6;
        const el = h(`<div class="card" style="left:${pos[i][1]}px;top:${pos[i][0]}px;width:400px;height:100px;display:flex;align-items:center;justify-content:center;gap:16px;font:800 38px V;color:var(--navy)">${S(ic,'ic" style="width:44px;height:44px;stroke:#1d5fd1')}${t}</div>`);
        root.appendChild(el); pop(el, at, .35); sfx(at, 'pop', .6); });
      if (o.oneAt) { const sp = line.querySelector('.rsv'); hook(t => { sp.textContent = t >= o.oneAt ? (o.one || 'پیگیری نکردیم') : ''; }); sfx(o.oneAt, 'ding', .6);
        const w = h(`<div class="pill" style="position:absolute;left:90px;top:330px;background:#1a9a5e;color:#fff;font-size:30px">${o.oneText || 'فقط یه کلمه'}</div>`); root.appendChild(w); pop(w, o.oneAt + .2, .35); }
    } else {
      const ttl = h(`<div class="wordsub" style="top:56px;color:var(--navy)">${richSub(o.title || 'آخر ماه: *بشمار*')}</div>`); root.appendChild(ttl); fadeIn(ttl, o.c0);
      const n = o.counts || [3, 2, 2, 9]; const mx = Math.max(...n); const ba = o.barsAt || o.c0 + .6;
      R.forEach(([t], i) => { const top = 190 + i * 130, win = n[i] === mx, at = ba + i * .35, w = 140 + 420 * n[i] / mx;
        const lb = h(`<div style="position:absolute;right:90px;top:${top}px;width:250px;height:100px;display:flex;align-items:center;font:800 36px V;color:var(--navy)">${t}</div>`);
        const bar = h(`<div style="position:absolute;right:350px;top:${top + 18}px;height:64px;width:${w}px;border-radius:20px;background:${win ? '#e0354f' : '#9fb3d6'};transform-origin:right center;display:flex;align-items:center;padding-left:18px;font:900 34px V;color:#fff">${fa(n[i])}</div>`);
        root.append(lb, bar); fadeIn(lb, at, .3, 10); sfx(at, 'swish', .35);
        hook(t2 => { bar.style.transform = `scaleX(${EASE.out(clamp((t2 - at) / .7, 0, 1))})`; });
        if (win && o.winAt) hook(t2 => { bar.style.boxShadow = t2 > o.winAt ? `0 0 ${30 + 14 * Math.sin(t2 * 7)}px rgba(224,53,79,.7)` : 'none'; }); });
      if (o.winAt) sfx(o.winAt, 'thud', .7);
      if (o.stampAt) { const st = h(`<div class="fake" style="top:auto;bottom:150px">${S('key','ic" style="width:70px;height:70px;stroke:#e0354f')}<span>${o.stamp || 'مشکل از کار خودمونه'}</span></div>`); root.appendChild(st);
        sfx(o.stampAt, 'thud', .8); anim(st, [{ t: o.stampAt - .001, o: 0, s: 1.8, r: -12 }, { t: o.stampAt + .25, o: 1, s: 1, r: -6, e: 'out' }]); }
    }
  };
  P.crowd = (o, root) => {
    const ttl = h(`<div class="wordsub" style="top:56px;color:var(--navy)">${richSub(o.title || 'قیف *پر*… از فرصت‌های مرده')}</div>`); root.appendChild(ttl); fadeIn(ttl, o.c0);
    const fn = h(`<svg class="funnel" viewBox="0 0 800 640"><path d="M20 10 H780 L520 420 V620 H280 V420 Z"/></svg>`); root.appendChild(fn); fadeIn(fn, o.c0 + .1, .4, 30);
    const spots = [[380, 210], [520, 220], [660, 210], [240, 220], [450, 300], [600, 300], [310, 300], [520, 380], [390, 380], [450, 460], [455, 540], [455, 610]];
    spots.forEach(([x, y], i) => { const c = h(`<div class="ghost" style="left:${x + 40}px;top:${y + 20}px">${i % 3 ? '۱۴ روز' : '۲۱ روز'}</div>`); root.appendChild(c); pop(c, o.c0 + .4 + i * .14, .25); });
    if (o.fakeAt) { const s = h(`<div class="fake">${S('shield', 'ic" style="width:80px;height:80px;stroke:#e0354f')}<span>${o.fake || 'امنیتِ دروغ'}</span></div>`); root.appendChild(s); sfx(o.fakeAt, 'buzz', .8); sfx(o.fakeAt + .02, 'thud', .7);
      anim(s, [{ t: o.fakeAt - .001, o: 0, s: 1.8, r: -14 }, { t: o.fakeAt + .25, o: 1, s: 1, r: -8, e: 'out' }]); }
  };

  // voice-only stage: drifting light blobs, dot grid, floating particles, the Hoormand host badge with
  // rings that breathe with the voice, a live waveform
  function buildVoiceStage(data) {
    const H = data.host || {};
    const vs = h(`<div id="vs"><div class="grid"></div></div>`);
    const blobs = [['#3ee0ff', 520, 120, 260], ['#8b6bff', 460, 640, 900], ['#2f7fe0', 600, -120, 1300], ['#1fd0a0', 380, 760, 300]].map(([c, r, x, y]) => {
      const b = h(`<div class="blob" style="background:${c};width:${r}px;height:${r}px;left:${x}px;top:${y}px"></div>`); vs.appendChild(b); return b; });
    const pts = Array.from({ length: 26 }, (_, i) => { const p = h(`<div class="pt"></div>`); vs.appendChild(p);
      return { p, x: (i * 397) % 1080, y: (i * 733) % 1920, sp: 18 + (i * 7) % 30, ph: i * 1.7, sz: .5 + (i % 4) * .3 }; });
    const rings = [0, 1, 2].map(() => { const r = h(`<div class="ring"></div>`); vs.appendChild(r); return r; });
    const host = h(`<div class="host"><div><img src="${data.logoMark}"></div></div>`); vs.appendChild(host);
    const mic = h(`<div class="mic"><svg viewBox="0 0 24 24"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg></div>`); vs.appendChild(mic);
    const wave = h(`<div class="wave"></div>`); vs.appendChild(wave);
    const NB = 44, bars = Array.from({ length: NB }, () => { const i = h('<i></i>'); wave.appendChild(i); return i; });
    // no presenter name/title on screen (Ramtin's rule); only shown if a script explicitly sets host.name/role
    if (H.name) vs.appendChild(h(`<div class="hn">${H.name}</div>`));
    if (H.role) vs.appendChild(h(`<div class="hr"><span>${H.role}</span></div>`));
    const env = data.env, fps = data.fps || 30;
    const E = t => { const f = t * fps, i = Math.floor(f); const a = env[Math.min(env.length - 1, Math.max(0, i))] || 0, b = env[Math.min(env.length - 1, i + 1)] || 0; return lerp(a, b, f - i); };
    hook(t => {
      const v = E(t);
      blobs.forEach((b, i) => b.style.transform = `translate(${Math.sin(t * .23 + i * 2) * 90}px,${Math.cos(t * .19 + i) * 70}px) scale(${1 + .08 * Math.sin(t * .4 + i)})`);
      pts.forEach(o => { const y = ((o.y - t * o.sp) % 1920 + 1920) % 1920; o.p.style.transform = `translate(${o.x + Math.sin(t * .6 + o.ph) * 30}px,${y}px) scale(${o.sz})`; o.p.style.opacity = .25 + .35 * (.5 + .5 * Math.sin(t * 1.3 + o.ph)); });
      rings.forEach((r, i) => { const ph = ((t * .55 + i / 3) % 1); r.style.transform = `scale(${1 + ph * (.7 + v * .9)})`; r.style.opacity = (1 - ph) * (.25 + v * .75); });
      host.style.transform = `scale(${1 + v * .07}) rotate(${Math.sin(t * .5) * 3}deg)`;
      host.style.background = `conic-gradient(from ${t * 50}deg,#3ee0ff,#2f7fe0,#8b6bff,#ffd23f,#3ee0ff)`;
      mic.style.transform = `scale(${1 + v * .12})`;
      bars.forEach((b, i) => { const c = Math.abs(i - (NB - 1) / 2) / (NB / 2), lag = E(t - c * .12);
        const n = .55 + .45 * Math.sin(i * 1.9 + t * 9.3) * Math.sin(i * .7 + t * 5.1);
        b.style.height = (10 + 150 * lag * (1 - c * .55) * (.45 + .55 * Math.abs(n))) + 'px'; b.style.opacity = .55 + .45 * lag; });
    });
    return vs;
  }
  window.buildPresenter = function (data) {
    DATA = data;
    const stage = document.getElementById('stage');
    document.getElementById('streak').style.display = 'none';
    const wrap = h(`<div id="pvwrap"><img id="pv"><div id="pvshade"></div></div>`); stage.insertBefore(wrap, stage.firstChild);
    let pv = wrap.querySelector('#pv');
    if (data.voiceOnly) { pv.remove(); wrap.querySelector('#pvshade').remove(); pv = buildVoiceStage(data); wrap.appendChild(pv); }
    const panel = document.getElementById('panel'); panel.style.height = '1000px';
    const scenes = document.getElementById('scenes'), caps = document.getElementById('caps');
    document.getElementById('wm').innerHTML = `<i><img src="${data.logoMark}"></i><span>${data.brand.website}</span>`;

    // merge overlays into panel-down intervals
    const ovs = data.overlays.slice().sort((a, b) => a.t0 - b.t0);
    const iv = [];
    ovs.forEach(o => { const l = iv[iv.length - 1]; if (l && o.t0 - l[1] < .8) l[1] = Math.max(l[1], o.t1); else iv.push([o.t0, o.t1]); });
    window.__sfxOn = true;
    iv.forEach(([a, b]) => { sfx(a, 'whoosh', 1); sfx(b - .35, 'whooshOut', .45); });
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
      const punch = data.voiceOnly ? 1.0 : (k % 2) ? 1.075 : 1.0;
      const z = lerp(punch, 1, p), dy = (data.voiceOnly ? 470 : 520) * p;
      pv.style.transform = `translateY(${dy}px) scale(${z})`;
      caps.style.transform = `translateY(${-440 * p}px)`;
    });
    data.captions.forEach(c => {
      const el = h(`<div class="cap" style="top:1400px"><div>${richText(c.text)}</div></div>`); caps.appendChild(el);
      anim(el, [{ t: c.at - .001, o: 0, s: .85, y: 14 }, { t: c.at + .12, o: 1, s: 1, y: 0, e: 'back' }, { t: c.end - .05, o: 1 }, { t: c.end, o: 0, e: 'lin' }]);
    });
    // end card
    if (data.endCard) {
      sfx(data.endCard.t0, 'riser', .6); sfx(data.endCard.t0 + .7, 'ding', .8);
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
