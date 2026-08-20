"""
Prep pass for the timeline step art: just a straight resize to web
resolution, no cropping or masking — the artwork is used exactly as
drawn, at its native 3:2 frame. Each source PNG renders on its own
black canvas; the component that places these sits each one on a
matching near-black card so the PNG's black field disappears into the
card background with no visible seam.
"""
from pathlib import Path

from PIL import Image

SRC_DIR = Path("/Users/prateekdwivedi__/Development/megacloudworks/TEST/assets/timeline")
OUT_DIR = Path("/Users/prateekdwivedi__/Development/megacloudworks/TEST/public/timeline")
WIDTH = 900

if __name__ == "__main__":
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for name in ["step1", "step2", "step3", "step4"]:
        img = Image.open(SRC_DIR / f"{name}.png").convert("RGB")
        height = round(img.height * WIDTH / img.width)
        resized = img.resize((WIDTH, height), Image.LANCZOS)
        out_path = OUT_DIR / f"{name}.webp"
        resized.save(out_path, "WEBP", quality=90)
        print(f"{name}.png -> {out_path} ({resized.width}x{resized.height}, {out_path.stat().st_size // 1024}KB)")
