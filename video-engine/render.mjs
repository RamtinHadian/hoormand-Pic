#!/usr/bin/env node
// Hoormand clip renderer.
// usage: node render.mjs scripts/<name>.json [--out out.mp4] [--fps 30] [--stills 1,5,9] [--audio voice_or_music.mp3] [--no-music]
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
const out = opt('out', path.join(HERE, '..', 'clips', name + '.mp4'));

// ---- rule check: talking about what Hoormand does => app screens must be on screen ----
const SHOWS_SCREENS = new Set(['feature', 'modules']);
const problems = [];
script.scenes.forEach((sc, i) => {
  if (sc.type === 'feature' && !catalog.features[sc.feature]) problems.push(`scene ${i + 1}: unknown feature "${sc.feature}"`);
  if (sc.type === 'modules') sc.items.forEach(k => { if (!catalog.features[k]) problems.push(`scene ${i + 1}: unknown module "${k}"`); });
  if (SHOWS_SCREENS.has(sc.type) || sc.type === 'end' || sc.noScreensOk) return;
  const text = (sc.captions || []).map(c => typeof c === 'string' ? c : c.text).join(' ') + ' ' + (sc.big || '') + ' ' + (sc.sub || '');
  for (const [k, f] of Object.entries(catalog.features))
    for (const kw of f.keywords) if (text.includes(kw)) problems.push(`scene ${i + 1} (${sc.type}) talks about "${kw}" (${k}) but shows no app screens -> use a "feature" scene with feature "${k}"`);
});
if (problems.length) { console.error('Script check failed:\n - ' + problems.join('\n - ')); process.exit(2); }

const data = {
  scenes: script.scenes,
  features: catalog.features,
  brand: { ...brand, ...(script.brand || {}) },
  imgRoot: catalog.imageRoot.replace(/\/?$/, '/'),
  logoColor: '../logo/hoormand-logo.png',
  logoFullWhite: '../logo/hoormand-logo-full-white.png',
  logoMark: 'assets/logo-mark.png',
};
for (const f of Object.values(catalog.features)) for (const s of f.screens)
  if (!fs.existsSync(path.join(HERE, data.imgRoot, s.file))) console.warn('missing image', s.file);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
await page.goto(pathToFileURL(path.join(HERE, 'template.html')).href);
const total = await page.evaluate(d => window.build(d), data);
await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map(i => i.decode().catch(() => {}))); });
console.log(`timeline ${total.toFixed(2)}s, ${Math.round(total * fps)} frames`);

const stills = opt('stills');
if (stills) {
  const dir = path.join(HERE, '..', 'clips', 'stills'); fs.mkdirSync(dir, { recursive: true });
  for (const s of String(stills).split(',')) {
    await page.evaluate(t => window.renderAt(t), +s);
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
  await page.evaluate(t => window.renderAt(t), f / fps);
  const buf = await page.screenshot({ type: 'jpeg', quality: 92 });
  if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
  if (f % 150 === 0) console.log(`frame ${f}/${N}`);
}
ff.stdin.end(); await new Promise(r => ff.on('close', r)); await browser.close();

// ---- audio: synthesized soft music bed + whooshes at scene cuts, optional user audio on top ----
const cuts = []; let acc = 0; for (const s of script.scenes.slice(0, -1)) { acc += s.dur; cuts.push(acc); }
const bed = out.replace(/\.mp4$/, '.music.wav');
const userAudio = opt('audio');
if (opt('no-music') && !userAudio) { fs.renameSync(silent, out); }
else {
  if (!opt('no-music')) execFileSync('python3', [path.join(HERE, 'music.py'), bed, String(total), cuts.join(',')], { stdio: 'inherit' });
  const inputs = ['-i', silent]; const parts = []; let k = 1;
  if (!opt('no-music')) { inputs.push('-i', bed); parts.push(`[${k}:a]volume=${userAudio ? 0.35 : 1}[m${k}]`); k++; }
  if (userAudio) { inputs.push('-i', userAudio); parts.push(`[${k}:a]volume=1[m${k}]`); k++; }
  const labels = parts.map((_, i) => `[m${i + 1}]`).join('');
  const fc = parts.join(';') + `;${labels}amix=inputs=${parts.length}:normalize=0,afade=t=out:st=${(total - 1.2).toFixed(2)}:d=1.2[a]`;
  execFileSync('ffmpeg', ['-y', '-v', 'error', ...inputs, '-filter_complex', fc, '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '160k', '-t', String(total), out], { stdio: 'inherit' });
  fs.rmSync(silent); fs.rmSync(bed, { force: true });
}
console.log('done ->', out);
