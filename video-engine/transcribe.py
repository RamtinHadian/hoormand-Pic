import sys, json
from faster_whisper import WhisperModel
model_dir, wav, out = sys.argv[1:4]
m = WhisperModel(model_dir, device='cpu', compute_type='int8')
prompt = "بیشتر فروش‌هایی که از دست می‌دید رو به رقیب نمی‌بازید، به فراموشی می‌بازید. پیگیری، هورمند، امروز من، اکسپلور، فالو."
from scipy.io import wavfile
sr, a = wavfile.read(wav)
import numpy as np
a = a.astype(np.float32)/32768
segs, info = m.transcribe(a, language='fa', word_timestamps=True, initial_prompt=prompt, beam_size=5, vad_filter=False)
res = []
for s in segs:
    res.append({'start': s.start, 'end': s.end, 'text': s.text, 'words': [{'w': w.word, 's': w.start, 'e': w.end} for w in s.words]})
    print(f"{s.start:6.2f}-{s.end:6.2f} {s.text}", flush=True)
json.dump(res, open(out, 'w'), ensure_ascii=False, indent=1)
