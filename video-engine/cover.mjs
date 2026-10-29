#!/usr/bin/env node
// Reels cover (1080x1920) from a frame of Ramtin's recording.
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
let photo = c.photo;
if (!photo && script.presenter) {
  const dir = path.resolve(path.dirname(scriptPath), script.presenter.prep);
  photo = path.join(dir, 'frames', String(c.frame).padStart(5, '0') + '.jpg');
}
const out = path.join(HERE, '..', 'clips', name + '-cover.jpg');
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
await page.goto(pathToFileURL(path.join(HERE, 'cover.html')).href);
await page.evaluate(d => window.buildCover(d), { ...c, photo: pathToFileURL(path.resolve(photo)).href, instagram: brand.instagram });
await page.screenshot({ path: out, type: 'jpeg', quality: 93 });
await browser.close();
console.log('cover ->', out);
