#!/usr/bin/env python3
"""Prepare a talking-head recording for presenter clips.
- removes long pauses (jump cuts), keeping a short breath around each cut
- light colour grade, voice loudness normalised
- writes JPEG frames + voice.wav + cuts.json (maps original times -> cut times)
usage: presenter_prep.py raw.mp4 out_dir [--keep-gap 0.22] [--min-silence 0.3] [--noise -32]
"""
import sys, os, re, json, subprocess, argparse

ap = argparse.ArgumentParser()
ap.add_argument('raw'); ap.add_argument('out')
ap.add_argument('--keep-gap', type=float, default=0.22, help='seconds of pause left at each cut')
ap.add_argument('--min-silence', type=float, default=0.3)
ap.add_argument('--noise', default='-32dB')
ap.add_argument('--fps', type=int, default=30)
a = ap.parse_args()
os.makedirs(os.path.join(a.out, 'frames'), exist_ok=True)

dur = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', a.raw]).decode())
log = subprocess.run(['ffmpeg', '-i', a.raw, '-af', f'silencedetect=noise={a.noise}:d={a.min_silence}', '-f', 'null', '-'],
                     capture_output=True, text=True).stderr
starts = [float(x) for x in re.findall(r'silence_start: ([\d.]+)', log)]
ends = [float(x) for x in re.findall(r'silence_end: ([\d.]+)', log)]
half = a.keep_gap / 2
keep, cur = [], 0.0
for s, e in zip(starts, ends):
    if e - s <= a.keep_gap + 0.05: continue
    if s + half > cur: keep.append([cur, s + half])
    cur = max(cur, e - half)
keep.append([cur, dur])
keep = [[round(x, 3), round(y, 3)] for x, y in keep if y - x > 0.05]

sel = '+'.join(f'between(t,{x},{y})' for x, y in keep)
cut = os.path.join(a.out, 'cut.mp4')
subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', a.raw,
                '-vf', f"select='{sel}',setpts=N/{a.fps}/TB,fps={a.fps},scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,eq=contrast=1.06:saturation=1.12:brightness=0.01",
                '-af', f"aselect='{sel}',asetpts=N/SR/TB,highpass=f=80,afftdn=nf=-25,loudnorm=I=-15:TP=-1.5:LRA=9",
                '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '16', '-c:a', 'pcm_s16le', cut.replace('.mp4', '.mkv')], check=True)
cutmkv = cut.replace('.mp4', '.mkv')
subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', cutmkv, '-vn', '-ar', '48000', '-ac', '2', os.path.join(a.out, 'voice.wav')], check=True)
subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', cutmkv, '-q:v', '3', os.path.join(a.out, 'frames', '%05d.jpg')], check=True)
nframes = len(os.listdir(os.path.join(a.out, 'frames')))
newdur = sum(y - x for x, y in keep)
json.dump({'keep': keep, 'fps': a.fps, 'frames': nframes, 'duration': newdur, 'original': dur}, open(os.path.join(a.out, 'cuts.json'), 'w'), indent=1)
print(f'original {dur:.2f}s -> {newdur:.2f}s, {len(keep)} parts, {nframes} frames')
