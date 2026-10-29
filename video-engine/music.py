#!/usr/bin/env python3
"""Royalty-free music bed made from scratch: soft pad + pluck arpeggio + light beat, whooshes at scene cuts.
usage: music.py out.wav seconds cut1,cut2,..."""
import sys, numpy as np
from scipy.io import wavfile
from scipy.signal import butter, lfilter

SR = 44100
out, total = sys.argv[1], float(sys.argv[2])
cuts = [float(c) for c in sys.argv[3].split(',') if c] if len(sys.argv) > 3 else []
n = int(SR * (total + 0.5))
t = np.arange(n) / SR
bpm = 100; beat = 60 / bpm; bar = beat * 4
rng = np.random.default_rng(7)

def midi(m): return 440 * 2 ** ((m - 69) / 12)
def lp(x, fc, order=2): b, a = butter(order, fc / (SR / 2)); return lfilter(b, a, x)
def hp(x, fc, order=2): b, a = butter(order, fc / (SR / 2), 'high'); return lfilter(b, a, x)

# A minor - F - C - G  (calm, hopeful)
chords = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]]
pad = np.zeros(n); arp = np.zeros(n); bass = np.zeros(n)
nb = int(np.ceil(total / bar)) + 1
for b in range(nb):
    ch = chords[b % 4]; s0 = int(b * bar * SR); s1 = min(n, int((b + 1) * bar * SR))
    if s0 >= n: break
    tt = t[s0:s1] - b * bar
    env = np.minimum(1, tt / 0.4) * np.minimum(1, (bar - tt) / 0.3 + 0.2)
    for m in ch:
        for det in (-0.08, 0.08):
            f = midi(m + 12) * (1 + det / 100)
            pad[s0:s1] += env * (2 * ((tt * f) % 1) - 1) * 0.05
    bass[s0:s1] += np.sin(2 * np.pi * midi(ch[0] - 12) * tt) * 0.22 * np.exp(-tt * 0.6)
    pattern = [0, 1, 2, 1, 0, 2, 1, 2]
    for k in range(8):
        a0 = s0 + int(k * beat / 2 * SR); a1 = min(n, a0 + int(0.6 * SR))
        if a0 >= n: break
        u = t[a0:a1] - t[a0]; f = midi(ch[pattern[k]] + 24)
        arp[a0:a1] += (np.sin(2 * np.pi * f * u) + 0.3 * np.sin(4 * np.pi * f * u)) * np.exp(-u * 7) * 0.09
pad = lp(pad, 1800)

beatline = np.zeros(n)
for k in range(int(total / beat) + 1):
    a0 = int(k * beat * SR)
    if a0 >= n: break
    if k % 2 == 0:  # soft kick
        a1 = min(n, a0 + int(0.3 * SR)); u = t[a0:a1] - t[a0]
        beatline[a0:a1] += np.sin(2 * np.pi * (50 + 90 * np.exp(-u * 30)) * u) * np.exp(-u * 12) * 0.35
    h0 = a0 + int(beat / 2 * SR); h1 = min(n, h0 + int(0.06 * SR))  # hat
    if h0 < n: beatline[h0:h1] += hp(rng.standard_normal(h1 - h0), 7000) * np.exp(-np.arange(h1 - h0) / SR * 60) * 0.06

# intro: no beat for first bar, fade in
intro = np.clip(t / bar, 0, 1)
mix = pad + arp + bass + beatline * intro

# whooshes into each cut
for c in cuts:
    a0 = int(max(0, c - 0.45) * SR); a1 = min(n, int((c + 0.15) * SR))
    u = np.linspace(0, 1, a1 - a0)
    w = rng.standard_normal(a1 - a0)
    w = lp(hp(w, 400), 4000) * np.sin(np.pi * u) ** 2 * 0.18
    mix[a0:a1] += w

mix *= np.minimum(1, t / 0.8)
mix = mix / (np.max(np.abs(mix)) + 1e-9) * 0.55
st = np.stack([mix, np.roll(mix, int(0.012 * SR))], axis=1)
wavfile.write(out, SR, (st * 32767).astype(np.int16))
