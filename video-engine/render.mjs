#!/usr/bin/env node
// Hoormand clip renderer.
// usage: node render.mjs scripts/<name>.json [--out out.mp4] [--fps 30] [--stills 1,5,9] [--audio voice_or_music.mp3] [--no-music]
// Two kinds of script:
//   scenes mode    : { "scenes": [...] }                      graphics-only clip
//   presenter mode : { "presenter": {"prep": "<dir from presenter_prep.py>"}, "captions": [...], "overlays": [...], "endCard": {...} }
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
import { spawn, execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf('--' + k); return i < 0 ? d : (args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : true); };
const scriptPath = args.find(a => a.endsWith('.json'));
if (!scriptPath) { console.error('give a script .json'); process.exit(1); }
const script = JSON.parse(fs.readFileSync(scriptPath, 'utf8'));
const catalog = JSON.parse(fs.readFileSync(path.join(HERE, 'catalog.json'), 'utf8'));
const brand = JSON.parse(fs.readFileSync(path.join(HERE, 'brand.json'), 'utf8'));
const fps = +opt('fps', 30);
const name = path.basename(scriptPath, '.json');
const out = path.resolve(opt('out', path.join(HERE, '..', 'clips', name + '.mp4')));
const PRESENTER = !!script.presenter;

const base = {
  features: catalog.features,
  brand: { ...brand, ...(script.brand || {}) },
  imgRoot: catalog.imageRoot.replace(/\/?$/, '/'),
  logoColor: '../logo/hoormand-logo.png',
  logoFullWhite: '../logo/hoormand-logo-full-white.png',
  logoMark: 'assets/logo-mark.png',
};
for (const f of Object.values(catalog.features)) for (const s of f.screens)
  if (!fs.existsSync(path.join(HERE, base.imgRoot, s.file))) console.warn('missing image', s.file);

// ---- rule check: talking about what Hoormand does => app screens must be on screen ----
const problems = [];
let data, prep, cutTimes = [], voice = null, whooshes = [];
if (!PRESENTER) {
  const SHOWS_SCREENS = new Set(['feature', 'modules']);
  script.scenes.forEach((sc, i) => {
    if (sc.type === 'feature' && !catalog.features[sc.feature]) problems.push(`scene ${i + 1}: unknown feature "${sc.feature}"`);
    if (sc.type === 'modules') sc.items.forEach(k => { if (!catalog.features[k]) problems.push(`scene ${i + 1}: unknown module "${k}"`); });
    if (SHOWS_SCREENS.has(sc.type) || sc.type === 'end' || sc.noScreensOk) return;
    const text = (sc.captions || []).map(c => typeof c === 'string' ? c : c.text).join(' ') + ' ' + (sc.big || '') + ' ' + (sc.sub || '');
    for (const [k, f] of Object.entries(catalog.features))
      for (const kw of f.keywords) if (text.includes(kw)) problems.push(`scene ${i + 1} (${sc.type}) talks about "${kw}" (${k}) but shows no app screens -> use a "feature" scene with feature "${k}"`);
  });
  data = { ...base, scenes: script.scenes };
  let acc = 0; for (const s of script.scenes.slice(0, -1)) { acc += s.dur; whooshes.push(acc); }
} else {
  const dir = path.resolve(path.dirname(scriptPath), script.presenter.prep);
  prep = { dir, ...JSON.parse(fs.readFileSync(path.join(dir, 'cuts.json'), 'utf8')) };
  voice = path.join(dir, 'voice.wav');
  // original recording time -> time after pause removal
  const map = t => { let acc = 0; for (const [a, b] of prep.keep) { if (t < a) return acc; if (t <= b) return acc + t - a; acc += b - a; } return acc; };
  { let acc = 0; for (const [a, b] of prep.keep.slice(0, -1)) { acc += b - a; cutTimes.push(acc); } }
  const caps = script.captions.map((c, i) => {
    const [t, text, end] = c; const nxt = script.captions[i + 1];
    return { at: map(t), end: map(end ?? (nxt ? nxt[0] : prep.original)), text };
  });
  const overlays = script.overlays.map(o => {
    const m = { ...o };
    for (const k of Object.keys(o)) if (/^(t0|t1|.*At)$/.test(k) && typeof o[k] === 'number') m[k] = map(o[k]);
    if (o.cards) m.cards = o.cards.map(c => ({ ...c, at: map(c.at) }));
    if (o.focus) m.focus = o.focus.map(f => ({ ...f, at: map(f.at) }));
    if (o.chips) m.chips = o.chips.map(c => ({ ...c, at: map(c.at) }));
    if (o.type === 'feature' && !catalog.features[o.feature]) problems.push(`overlay: unknown feature "${o.feature}"`);
    return m;
  });
  // every sentence that says what Hoormand does must sit under a feature overlay (real app screens)
  caps.forEach(c => {
    const hit = Object.entries(catalog.features).find(([, f]) => f.keywords.some(k => c.text.replace(/\*/g, '').includes(k)));
    const mentionsHoormand = c.text.includes('هورمند');
    if (!hit && !mentionsHoormand) return;
    const covered = overlays.some(o => o.type === 'feature' && o.t0 <= c.at + .3 && o.t1 >= c.at);
    if (mentionsHoormand && !covered) problems.push(`caption "${c.text}" (${c.at.toFixed(1)}s) talks about Hoormand but no feature overlay shows app screens there`);
  });
  const end = script.endCard ? { ...script.endCard, t0: prep.duration } : null;
  const total = prep.duration + (end ? end.dur : 0);
  data = { ...base, captions: caps, overlays, cutTimes, endCard: end, total };
  whooshes = overlays.map(o => o.t0);
}
if (problems.length) { console.error('Script check failed:\n - ' + problems.join('\n - ')); process.exit(2); }

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
page.on('pageerror', e => console.error('page error:', e.message));
await page.goto(pathToFileURL(path.join(HERE, 'template.html')).href);
const total = await page.evaluate(([d, p]) => p ? window.buildPresenter(d) : window.build(d), [data, PRESENTER]);
await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map(i => i.decode().catch(() => {}))); });
console.log(`timeline ${total.toFixed(2)}s, ${Math.round(total * fps)} frames`);

const frameSrc = f => PRESENTER ? pathToFileURL(path.join(prep.dir, 'frames', String(Math.min(prep.frames, f + 1)).padStart(5, '0') + '.jpg')).href : null;
async function draw(t) {
  if (PRESENTER) await page.evaluate(s => window.setFrame(s), frameSrc(Math.floor(t * fps + 1e-6)));
  await page.evaluate(t => window.renderAt(t), t);
}

const stills = opt('stills');
if (stills) {
  const dir = path.join(HERE, '..', 'clips', 'stills'); fs.mkdirSync(dir, { recursive: true });
  for (const s of String(stills).split(',')) {
    await draw(+s);
    await page.screenshot({ path: path.join(dir, `${name}-${s}.jpg`), type: 'jpeg', quality: 85 });
  }
  await browser.close(); console.log('stills in', dir); process.exit(0);
}

fs.mkdirSync(path.dirname(out), { recursive: true });
const silent = out.replace(/\.mp4$/, '.video.mp4');
const ff = spawn('ffmpeg', ['-y', '-v', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-',
  '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', silent], { stdio: ['pipe', 'inherit', 'inherit'] });
const N = Math.round(total * fps);
for (let f = 0; f < N; f++) {
  await draw(f / fps);
  const buf = await page.screenshot({ type: 'jpeg', quality: 92 });
  if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
  if (f % 300 === 0) console.log(`frame ${f}/${N}`);
}
ff.stdin.end(); await new Promise(r => ff.on('close', r)); await browser.close();

// ---- audio: generated music bed (+ whooshes); voice on top in presenter mode ----
const bed = out.replace(/\.mp4$/, '.music.wav');
const userAudio = opt('audio') || voice;
if (opt('no-music') && !userAudio) { fs.renameSync(silent, out); }
else {
  if (!opt('no-music')) execFileSync('python3', [path.join(HERE, 'music.py'), bed, String(total), whooshes.join(',')], { stdio: 'inherit' });
  const inputs = ['-i', silent]; const parts = []; let k = 1;
  if (!opt('no-music')) {
    inputs.push('-i', bed);
    const endT = PRESENTER && data.endCard ? data.endCard.t0 : total;
    const vol = userAudio ? `volume='if(lt(t,${endT.toFixed(2)}),0.14,0.55)':eval=frame` : 'volume=1';
    parts.push(`[${k}:a]${vol}[m${k}]`); k++;
  }
  if (userAudio) { inputs.push('-i', userAudio); parts.push(`[${k}:a]volume=1[m${k}]`); k++; }
  const labels = parts.map((_, i) => `[m${i + 1}]`).join('');
  const fc = parts.join(';') + `;${labels}amix=inputs=${parts.length}:normalize=0:duration=longest,afade=t=out:st=${(total - 1.2).toFixed(2)}:d=1.2,alimiter=limit=0.95[a]`;
  execFileSync('ffmpeg', ['-y', '-v', 'error', ...inputs, '-filter_complex', fc, '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '160k', '-t', String(total), out], { stdio: 'inherit' });
  fs.rmSync(silent); fs.rmSync(bed, { force: true });
}
console.log('done ->', out);
