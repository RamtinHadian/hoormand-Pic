#!/usr/bin/env python3
"""Add a thick sticker-style outline around a cut-out (RGBA) photo.
usage: outline.py in.png out.png [--px 22] [--color ffd400] [--bottom-open]
"""
import argparse, numpy as np, cv2
ap = argparse.ArgumentParser()
ap.add_argument('inp'); ap.add_argument('out')
ap.add_argument('--px', type=int, default=22)
ap.add_argument('--color', default='ffd400')
a = ap.parse_args()
im = cv2.imread(a.inp, cv2.IMREAD_UNCHANGED)
pad = a.px * 2
im = cv2.copyMakeBorder(im, pad, pad, pad, pad, cv2.BORDER_CONSTANT, value=(0, 0, 0, 0))
al = im[..., 3]
k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * a.px + 1, 2 * a.px + 1))
ring = cv2.dilate((al > 110).astype(np.uint8) * 255, k)
ring = cv2.GaussianBlur(ring, (0, 0), 1.5)
r, g, b = (int(a.color[i:i + 2], 16) for i in (0, 2, 4))
out = np.zeros_like(im)
out[..., 0], out[..., 1], out[..., 2], out[..., 3] = b, g, r, ring
fa = im[..., 3:4].astype(np.float32) / 255
out[..., :3] = (im[..., :3] * fa + out[..., :3] * (1 - fa)).astype(np.uint8)
out[..., 3] = np.maximum(ring, im[..., 3])
cv2.imwrite(a.out, out)
print('outlined ->', a.out)
