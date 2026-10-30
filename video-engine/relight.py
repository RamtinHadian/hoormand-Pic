#!/usr/bin/env python3
"""Cinematic relight of a cut-out portrait (RGBA png from the background remover).
Three-point look: warm soft key from one side, gentle fill, cool rim light on the edges,
filmic S-curve, teal/orange split toning, light skin smoothing and micro-contrast.
usage: relight.py in_cut.png out.png [--key left|right] [--rim 0.9] [--alpha-fix]
"""
import sys, argparse
import numpy as np, cv2

ap = argparse.ArgumentParser()
ap.add_argument('inp'); ap.add_argument('out')
ap.add_argument('--key', default='left', help='side the key light comes from (viewer side)')
ap.add_argument('--rim', type=float, default=0.45)
ap.add_argument('--alpha-fix', action='store_true', help='harden semi-transparent limbs')
ap.add_argument('--erase', action='append', default=[], help='x0,y0,x1,y1 box (output coords) to make transparent, e.g. a stray window frame')
a = ap.parse_args()

im = cv2.imread(a.inp, cv2.IMREAD_UNCHANGED)
if im.shape[2] == 3: im = np.dstack([im, np.full(im.shape[:2], 255, np.uint8)])
bgr = im[..., :3].astype(np.float32) / 255
al = im[..., 3].astype(np.float32) / 255
if a.alpha_fix:
    al = np.clip((al - 0.06) / 0.22, 0, 1)
    al = cv2.morphologyEx(al, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (25, 25)))
    al = cv2.morphologyEx(al, cv2.MORPH_OPEN, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (9, 9)))
# keep only the largest blob (drops chair bits etc.)
n, lab, stats, _ = cv2.connectedComponentsWithStats((al > 0.5).astype(np.uint8))
if n > 2:
    big = 1 + np.argmax(stats[1:, cv2.CC_STAT_AREA])
    keep = cv2.dilate((lab == big).astype(np.uint8), np.ones((9, 9), np.uint8))
    al = al * keep
al = cv2.GaussianBlur(al, (0, 0), 1.2)
h, w = al.shape
m = al > 0.5
ys, xs = np.where(m)
top, bot, left, right = ys.min(), ys.max(), xs.min(), xs.max()

# 1. exposure: subject mid-tones to a healthy level
lum = (0.114 * bgr[..., 0] + 0.587 * bgr[..., 1] + 0.299 * bgr[..., 2])
mean = lum[m].mean()
bgr = np.clip(bgr * (0.46 / max(mean, 1e-3)) ** 0.8, 0, 1)

# 2. skin smoothing (edge-preserving), blended lightly
u8 = (bgr * 255).astype(np.uint8)
smooth = cv2.bilateralFilter(u8, 9, 40, 9).astype(np.float32) / 255
bgr = bgr * 0.6 + smooth * 0.4

# 3. key + fill: soft directional falloff across the subject, brighter near the head
yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
cx = left + (right - left) * (0.28 if a.key == 'left' else 0.72)
cy = top + (bot - top) * 0.22
d = np.sqrt(((xx - cx) / (w * 0.55)) ** 2 + ((yy - cy) / (h * 0.5)) ** 2)
key = 1.15 - 0.33 * np.clip(d, 0, 1.4) / 1.4          # 1.22 near key, ~0.8 on the far side
warm = np.array([0.94, 1.0, 1.06], np.float32)          # BGR: a touch of warmth in the key
bgr = bgr * key[..., None] * (1 + (key[..., None] - 1) * (warm - 1) * 1.5)

# 4. rim light: cool glow on the outline, stronger on the side opposite the key and on top
er = cv2.erode((al * 255).astype(np.uint8), np.ones((3, 3), np.uint8), iterations=7).astype(np.float32) / 255
edge = np.clip(al - er, 0, 1)
edge = cv2.GaussianBlur(edge, (0, 0), 3.5) * al
side = (xx - left) / max(1, right - left)
side = side if a.key == 'left' else 1 - side
rimw = (0.35 + 0.65 * side) * (0.6 + 0.4 * np.clip(1 - (yy - top) / (0.6 * (bot - top)), 0, 1))
rim_col = np.array([1.0, 0.78, 0.5], np.float32)       # BGR: cool cyan-blue
bgr = bgr + (edge * rimw * a.rim)[..., None] * rim_col * 0.9

# 5. filmic S-curve + teal/orange split toning
def s_curve(x, k=1.12):
    return 0.5 + np.tanh((x - 0.5) * 2 * k) / (2 * np.tanh(k))
bgr = np.clip(bgr, 0, 1.2)
bgr = s_curve(np.clip(bgr, 0, 1))
l = (0.114 * bgr[..., 0] + 0.587 * bgr[..., 1] + 0.299 * bgr[..., 2])[..., None]
shadows = np.clip(1 - l * 2, 0, 1); highs = np.clip(l * 2 - 1, 0, 1)
bgr = bgr + shadows * np.array([0.035, 0.018, -0.012], np.float32) + highs * np.array([-0.02, 0.0, 0.018], np.float32)
# gentle saturation boost on mids
gray = l
bgr = gray + (bgr - gray) * 1.02

# 6. micro-contrast (unsharp)
blur = cv2.GaussianBlur(bgr, (0, 0), 3)
bgr = bgr + (bgr - blur) * 0.35
bgr = np.clip(bgr, 0, 1)

out = np.dstack([(bgr * 255).astype(np.uint8), (np.clip(al, 0, 1) * 255).astype(np.uint8)])
# crop to the subject with a margin
pad = 20
out = out[max(0, top - pad):bot + 1, max(0, left - pad):min(w, right + pad)]
for box in a.erase:
    x0, y0, x1, y1 = map(int, box.split(','))
    out[y0:y1, x0:x1, 3] = 0
cv2.imwrite(a.out, out)
print('relit ->', a.out, out.shape)
