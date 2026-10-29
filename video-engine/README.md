# Hoormand video engine

Makes vertical Instagram clips (1080×1920, 30 fps) for Hoormand in one fixed style, so every clip looks like part of the same series.

The style is taken from a reference reel (frames: `style/reference-frames.jpg`):

- the top half is a light panel with rounded bottom corners, and the bottom half is an ocean-blue gradient
- graphics enter with rise, fade and pop motion
- captions show 2–4 words at a time on a navy pill on the panel's edge, with key words in yellow (`*word*`)
- the clip ends on a dark card with the logo, the website and the Instagram handle

## The rule

**Whenever a clip says what Hoormand does, the real app screens from this repo must be on screen.**

- `catalog.json` maps every feature (letters, files, tasks, CRM, AI, reports …) to its screenshots in `../v1.53.2/ocean/`, with a zoom point for each one.
- A `feature` scene shows the whole screen in a browser card, with a yellow box marking the zoomed part. Below that, a large zoom lens moves slowly across the same part.
- `render.mjs` checks every script before rendering. If a non-screen scene mentions a feature keyword (نامه، فایل، وظیفه، مشتری، گزارش، هوش مصنوعی …), the render stops and names the feature scene to use instead.

## Run

```bash
node render.mjs scripts/hoormand-intro.json                 # -> ../clips/hoormand-intro.mp4
node render.mjs scripts/x.json --stills 2,8,15               # quick preview frames -> ../clips/stills/
node render.mjs scripts/x.json --audio voice.mp3             # add a voice-over (music drops to 35%)
node render.mjs scripts/x.json --no-music
```

Needs Node, Playwright with Chromium, ffmpeg, and Python with numpy and scipy (used for the music).

## Script format (`scripts/*.json`)

```json
{ "scenes": [
  {"type":"hook","dur":3.6,"big":"۱ سامانه","sub":"به جای *ده نرم‌افزار* جدا","captions":["…","فقط *یک سامانه*"]},
  {"type":"modules","dur":5,"title":"هورمند چه می‌کند؟","items":["letters","files","tasks","crm"],"captions":["…"]},
  {"type":"feature","dur":4.6,"feature":"letters","screens":[0,1],"tags":["سربرگ رسمی"],"zoomLabel":"از داخل برنامه","captions":["…"]},
  {"type":"stat","dur":4,"count":75,"suffix":"٪","sub":"…","captions":["…"]},
  {"type":"end","dur":4,"line":"اتوماسیون اداری *هوشمند*","captions":["…"]}
]}
```

Each scene type works like this:

- `hook`: a big text with a sub line, and the logo on a white card below.
- `modules`: switches turn on one after another, while each module's screenshot slides in below.
- `feature`: the app screens with zoom. `screens` takes indexes or file names from the catalog, split evenly over the scene. Set `focus` to override the zoom point: `{"x":0.5,"y":0.4,"s":1.8}`.
- `stat`: a number counts up, with growing bars. It cannot be used to describe features.
- `end`: the brand card. Website and Instagram handle come from `brand.json`.

Captions are spread evenly over the scene. You can also give a caption its own timing: `{"text":"…","at":1.2,"dur":1.5}`.

## Adding new app pictures

1. Put new screenshots in a new version folder.
2. Point `imageRoot` in `catalog.json` at that folder.
3. Add or adjust the entries in `catalog.json`.

The music is generated from scratch by `music.py`, so it is royalty-free. The font is Vazirmatn (OFL licence, in `fonts/`).

## Presenter clips (Ramtin on camera)

The recording fills the frame. When a graphic is due, a light panel drops from the top, Ramtin's video slides down so his face stays in view, and the captions move up to the edge of the panel.

1. **Prepare the recording.** `python3 presenter_prep.py raw.mp4 <prep_dir>`
   - cuts long pauses into jump cuts
   - applies a light colour grade and normalises the voice
   - writes JPEG frames, `voice.wav` and `cuts.json`
2. **Get word timings.** `python3 -I transcribe.py <whisper-small-dir> audio16k.wav words.json` uses faster-whisper.
   - The Whisper-small CTranslate2 model can be downloaded from npm: `@skillninja/shortmovie-telop-model-p0`…`p3`. Join the four `model.bin.part*` files and check the result against `model.sha256`.
   - Correct the wording against the teleprompter text.
3. **Write the script.** Write `scripts/epNN-*.json`, using times from the original recording; the renderer maps them across the cuts.
   - `presenter.prep`: the prep folder.
   - `captions`: `[start, "text with *keyword*", optional end]`.
   - `overlays`: graphics on the panel, each with `t0` and `t1`. The types are:
     - `word`: a big word that gets erased.
     - `list`: a call list, with an optional `questionAt`.
     - `thermo`: a "still warm" lead.
     - `steps`: three cards, with dates, owners and a struck-through note.
     - `feature`: real app screens with a zoom `focus` sequence.
     - `teaser`: the next episode, with a hidden number and its title.
     - `follow`: the Instagram follow button being tapped.
     - `share`: sending to friends.
   - `endCard`: the closing brand card.
4. **Render.** `node render.mjs scripts/epNN-*.json` puts the clip in `../clips/`. Voice and music are mixed, with the music kept low under the voice.

The check still applies: a caption that mentions «هورمند» must be covered by a `feature` overlay, so the app screens are always on screen there.

## Reels cover

`node cover.mjs scripts/epNN-*.json` makes `../clips/epNN-*-cover.jpg` from the script's `cover` block. The block takes these settings:

- `frame`: a frame number from the prep frames, or use `photo` to give a picture's path instead
- `dy` and `scale`: where the photo sits
- `badge`, for example «قسمت ۱»
- `title`: may contain `*keyword*` and `<br>`
- `chip`, `chipTop`
- `sticker`, `stickerX`, `stickerY`

Keep the title inside y 240–1680, because the Instagram grid shows only that middle 3:4.
