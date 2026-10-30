#!/usr/bin/env node
// Reels cover (1080x1920) from a frame of Ramtin's recording.
// style "note": dark textured backdrop, yellow handwritten kicker, big serif headline, outlined cut-out photo, white CTA bar;
// style "agency" (default): no photo; black/off-white with lime accents, big bold headline, a 3D-looking topic object, icon chips, glowing sweep;
// style "noir": dark black-and-white photo with neon teal Nastaliq headline (Ramtin's Pinterest reference);
// style "hero": Ramtin's own relit, cut-out photo (relight.py) on a blue studio layout with a headline box;
// style "card": illustrated sky cover; style "photo": a frame of the recording.
// usage: node cover.mjs scripts/<name>.json   (uses the script's "cover" block) -> ../clips/<name>-cover.jpg
// Keep text inside y 240..1680: Instagram's profile grid shows only the middle 3:4.
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const scriptPath = process.argv[2];
const script = JSON.parse(fs.readFileSync(scriptPath, 'utf8'));
const brand = JSON.parse(fs.readFileSync(path.join(HERE, 'brand.json'), 'utf8'));
const c = script.cover; if (!c) { console.error('script has no "cover" block'); process.exit(1); }
const name = path.basename(scriptPath, '.json');
const style = c.style || 'agency';
const card = style === 'card';
let photo = c.photo;
if (style === 'photo' && !photo && script.presenter) {
  const dir = path.resolve(path.dirname(scriptPath), script.presenter.prep);
  photo = path.join(dir, 'frames', String(c.frame).padStart(5, '0') + '.jpg');
}
const out = path.join(HERE, '..', 'clips', name + '-cover.jpg');
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
await page.goto(pathToFileURL(path.join(HERE, { card: 'cover-card.html', photo: 'cover.html', hero: 'cover-hero.html', noir: 'cover-noir.html', note: 'cover-note.html', agency: 'cover-agency.html' }[style])).href);
await page.evaluate(d => window.buildCover(d), { ...c, photo: photo ? pathToFileURL(path.resolve(photo)).href : null, instagram: brand.instagram });
await page.screenshot({ path: out, type: 'jpeg', quality: 93 });
await browser.close();
console.log('cover ->', out);
