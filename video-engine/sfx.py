#!/usr/bin/env python3
"""Sound effects for the motion graphics, synthesised from scratch (royalty-free).
usage: sfx.py events.json out.wav seconds
events.json: [{"t": 1.2, "type": "pop", "g": 0.6}, ...]
types: whoosh, whooshOut, swish, pop, soft, click, ding, riser, coin, ring, buzz, type, down, thud, scratch, zoom
"""
import sys, json, numpy as np
from scipy.io import wavfile
from scipy.signal import butter, lfilter

SR = 48000
rng = np.random.default_rng(3)
def env(n, a, d):  # attack/decay in samples
    e = np.ones(n); a = max(1, int(a)); e[:a] = np.linspace(0, 1, a)
    return e * np.exp(-np.arange(n) / max(1, d))
def bp(x, lo, hi): b, a = butter(2, [lo / (SR / 2), hi / (SR / 2)], 'band'); return lfilter(b, a, x)
def lp(x, f): b, a = butter(2, f / (SR / 2)); return lfilter(b, a, x)
def hp(x, f): b, a = butter(2, f / (SR / 2), 'high'); return lfilter(b, a, x)
def sweep_noise(dur, f0, f1, shape):
    n = int(dur * SR); x = rng.standard_normal(n); out = np.zeros(n); seg = 256
    for i in range(0, n, seg):
        u = i / n; f = f0 + (f1 - f0) * u; out[i:i + seg] = bp(x[i:i + seg] if i == 0 else x[max(0, i - 512):i + seg], max(60, f * .6), min(SR / 2 - 100, f * 1.6))[-len(x[i:i + seg]):]
    return out * shape(np.linspace(0, 1, n))
def add(*xs):
    n = max(len(x) for x in xs); o = np.zeros(n)
    for x in xs: o[:len(x)] += x
    return o
def tone(freq, dur, decay, partials=((1, 1),)):
    n = int(dur * SR); t = np.arange(n) / SR; y = np.zeros(n)
    for m, g in partials: y += g * np.sin(2 * np.pi * freq * m * t)
    return y * np.exp(-t / decay)
def chirp(f0, f1, dur, decay):
    n = int(dur * SR); t = np.arange(n) / SR; f = f0 + (f1 - f0) * t / dur
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / decay)

LIB = {
    'whoosh': lambda: sweep_noise(.5, 300, 3500, lambda u: np.sin(np.pi * np.clip(u * 1.1, 0, 1)) ** 2) * .8,
    'whooshOut': lambda: sweep_noise(.4, 2500, 300, lambda u: np.sin(np.pi * u) ** 2) * .5,
    'swish': lambda: sweep_noise(.25, 1200, 6000, lambda u: np.sin(np.pi * u) ** 3) * .7,
    'zoom': lambda: sweep_noise(.35, 500, 2200, lambda u: np.sin(np.pi * u) ** 2) * .35,
    'pop': lambda: add(chirp(900, 380, .09, .03) * .9, tone(1800, .03, .006) * .2),
    'soft': lambda: lp(rng.standard_normal(int(.14 * SR)), 1800) * env(int(.14 * SR), .01 * SR, .04 * SR) * .35,
    'click': lambda: np.concatenate([hp(rng.standard_normal(int(.004 * SR)), 2000) * .9, tone(3200, .03, .006) * .5]),
    'ding': lambda: tone(1318, 1.2, .45, ((1, 1), (2, .35), (3, .15), (4.2, .08))) * .55,
    'riser': lambda: add(sweep_noise(.8, 300, 5000, lambda u: u ** 2) * .5, chirp(220, 880, .8, 5) * np.linspace(0, .25, int(.8 * SR))),
    'coin': lambda: np.concatenate([tone(1976, .09, .05, ((1, 1), (2, .3))), tone(2637, .35, .12, ((1, 1), (2, .3)))]) * .45,
    'ring': lambda: (np.sin(2 * np.pi * 440 * np.arange(int(.55 * SR)) / SR) + np.sin(2 * np.pi * 480 * np.arange(int(.55 * SR)) / SR))
                    * (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 20 * np.arange(int(.55 * SR)) / SR))) * env(int(.55 * SR), .01 * SR, .4 * SR) * .22,
    'buzz': lambda: lp(np.sign(np.sin(2 * np.pi * 140 * np.arange(int(.32 * SR)) / SR)), 1200) * env(int(.32 * SR), .005 * SR, .2 * SR) * .35,
    'type': lambda: hp(rng.standard_normal(int(.012 * SR)), 2500) * env(int(.012 * SR), 1, .003 * SR) * .5,
    'down': lambda: chirp(700, 180, .55, .4) * .5,
    'thud': lambda: add(chirp(160, 45, .35, .12) * .9, lp(rng.standard_normal(int(.35 * SR)), 400) * env(int(.35 * SR), 1, .03 * SR) * .4),
    'scratch': lambda: bp(rng.standard_normal(int(.35 * SR)), 900, 4000) * (np.abs(np.sin(np.linspace(0, 9 * np.pi, int(.35 * SR)))) ** .5) * env(int(.35 * SR), .01 * SR, .25 * SR) * .5,
}

events = json.load(open(sys.argv[1])); out = sys.argv[2]; total = float(sys.argv[3])
mix = np.zeros(int((total + 2) * SR))
cache = {}
last = {}
for e in sorted(events, key=lambda e: e['t']):
    ty = e['type']
    if ty not in LIB or e['t'] < 0: continue
    if ty in last and e['t'] - last[ty] < (.09 if ty in ('type', 'swish', 'coin') else .14): continue  # de-clutter
    last[ty] = e['t']
    if ty not in cache: cache[ty] = LIB[ty]()
    s = cache[ty] * e.get('g', 1)
    i = int(e['t'] * SR); j = min(len(mix), i + len(s)); mix[i:j] += s[:j - i]
peak = np.max(np.abs(mix)) or 1
mix = np.tanh(mix / max(1, peak * .9) * 1.2) * .8
st = np.stack([mix, mix], axis=1)
wavfile.write(out, SR, (st * 32767).astype(np.int16))
print(f'sfx -> {out}: {len(events)} events')
