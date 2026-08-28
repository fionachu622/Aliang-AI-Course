#!/usr/bin/env python3
import math
import shutil
import subprocess
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "build" / "lesson1_motion_preview_v2"
FRAMES = OUT / "frames"
VIDEO = OUT / "第1课_可视化动效样片_v2_简洁版.mp4"

W, H = 1280, 720
FPS = 24
BG = (245, 240, 240)
TEXT = (29, 29, 31)
MUTED = (116, 116, 122)
BLUE = (0, 122, 255)
GREEN = (52, 199, 89)
DARK = (18, 54, 127)
TEAL = (0, 184, 184)
WHITE = (255, 255, 255)
YELLOW = (214, 196, 38)
FONT = "/System/Library/Fonts/Hiragino Sans GB.ttc"


def font(size):
    return ImageFont.truetype(FONT, size)


def clamp(x):
    return max(0, min(1, x))


def ease(x):
    x = clamp(x)
    return 0.5 - 0.5 * math.cos(math.pi * x)


def out(x):
    x = clamp(x)
    return 1 - (1 - x) ** 3


def lerp(a, b, t):
    return a + (b - a) * t


def rgba(c, a=255):
    return (*c, int(a))


def ctext(d, txt, x, y, size, fill=TEXT, a=255, anchor="mm"):
    d.text((x, y), txt, font=font(size), fill=rgba(fill, a), anchor=anchor)


def rect(d, box, r, fill, a=255, outline=None, width=1):
    d.rounded_rectangle(
        box,
        radius=r,
        fill=rgba(fill, a),
        outline=rgba(outline, a) if outline else None,
        width=width,
    )


def line_arrow(d, x1, y1, x2, y2, fill=MUTED, a=255, w=4):
    d.line((x1, y1, x2, y2), fill=rgba(fill, a), width=w)
    ang = math.atan2(y2 - y1, x2 - x1)
    s = 14
    p1 = (x2 - s * math.cos(ang - 0.46), y2 - s * math.sin(ang - 0.46))
    p2 = (x2 - s * math.cos(ang + 0.46), y2 - s * math.sin(ang + 0.46))
    d.polygon([(x2, y2), p1, p2], fill=rgba(fill, a))


def token(d, txt, x, y, fill=BLUE, a=255, scale=1.0):
    w = max(72, 34 + len(txt) * 28) * scale
    h = 48 * scale
    rect(d, (x - w / 2, y - h / 2, x + w / 2, y + h / 2), int(17 * scale), fill, a)
    ctext(d, txt, x, y - 2 * scale, int(24 * scale), WHITE, a)


def gate(d, x, y, t, a=255):
    gap = 18 + 46 * t
    rect(d, (x - 76 - gap / 2, y - 104, x - gap / 2, y + 104), 24, GREEN, a)
    rect(d, (x + gap / 2, y - 104, x + 76 + gap / 2, y + 104), 24, GREEN, a)
    ctext(d, "Tokenizer", x, y - 144, 28, TEXT, a)


def model(d, x, y, scale=1.0, a=255):
    w, h = 255 * scale, 150 * scale
    rect(d, (x - w / 2, y - h / 2, x + w / 2, y + h / 2), int(28 * scale), DARK, a)
    ctext(d, "大模型", x, y - 8 * scale, int(42 * scale), WHITE, a)


def scene_llm(d, t):
    if t < 0.18:
        ctext(d, "LLM", 640, 340, 92, TEXT, int(255 * out(t / 0.18)))
    elif t < 0.34:
        p = ease((t - 0.18) / 0.16)
        for ch, sx, ex in [("L", 640, 430), ("L", 640, 640), ("M", 640, 850)]:
            ctext(d, ch, lerp(sx, ex, p), 340, 92, TEXT)
    elif t < 0.58:
        p = out((t - 0.34) / 0.24)
        for ch, rest, x in [("L", "arge", 270), ("L", "anguage", 555), ("M", "odel", 900)]:
            ctext(d, ch, x, 340, 80, YELLOW)
            ctext(d, rest, x + 34, 340, 62, TEXT, int(255 * p), "lm")
    elif t < 0.78:
        p = ease((t - 0.58) / 0.20)
        ctext(d, "Large Language Model", 640, lerp(340, 410, p), int(62 - 25 * p), TEXT)
        ctext(d, "大语言模型", 640, lerp(300, 270, p), 70, TEXT, int(255 * p))
    else:
        p = ease((t - 0.78) / 0.22)
        ctext(d, "Large Language Model", 640, 410, 36, MUTED)
        ctext(d, "大", lerp(486, 548, p), 270, 72, TEXT)
        ctext(d, "语言", 640, 270, 72, TEXT, int(255 * (1 - p)))
        ctext(d, "模型", lerp(794, 724, p), 270, 72, TEXT)


def scene_product_model(d, t):
    if t < 0.42:
        q = ease(t / 0.42)
        for name, x in [("ChatGPT", 250), ("DeepSeek", 640), ("豆包", 1030)]:
            ctext(d, name, lerp(x, 640, q), 330, int(42 - 4 * q), TEXT, int(255 * (1 - q)))
        ctext(d, "AI 产品", 640, 330, 58, BLUE, int(255 * q))
    elif t < 0.68:
        q = ease((t - 0.42) / 0.26)
        ctext(d, "AI 产品", 640, lerp(330, 246, q), int(58 - 20 * q), BLUE, int(255 * (1 - 0.3 * q)))
        model(d, 640, lerp(500, 366, q), 0.7 + 0.35 * q, int(255 * q))
    else:
        q = ease((t - 0.68) / 0.32)
        model(d, lerp(640, 960, q), 366, 1.05, 255)
        ctext(d, "手机只剩 1% 的电，我赶紧找……", 122, 306, 40, TEXT, int(255 * q), "la")


def scene_predict(d, t):
    model(d, 960, 366, 1.05, 255)
    sentence = "手机只剩 1% 的电，我赶紧找……"
    ctext(d, sentence, 122, 270, 40, TEXT, 255, "la")
    if t < 0.44:
        q = out(t / 0.44)
        for word, x, y, col, size in [
            ("充电器", 372, 386, GREEN, 50),
            ("充电宝", 540, 450, GREEN, 42),
            ("插座", 348, 512, BLUE, 34),
            ("遥控器", 606, 530, MUTED, 28),
        ]:
            ctext(d, word, lerp(576, x, q), lerp(286, y, q), size, col, int(255 * q))
    elif t < 0.72:
        q = ease((t - 0.44) / 0.28)
        ctext(d, "充电器", lerp(372, 708, q), lerp(386, 270, q), int(50 - 8 * q), GREEN)
        for word, x, y, col, size in [("充电宝", 540, 450, GREEN, 42), ("插座", 348, 512, BLUE, 34), ("遥控器", 606, 530, MUTED, 28)]:
            ctext(d, word, x, y, size, col, int(255 * (1 - q)))
    else:
        q = ease((t - 0.72) / 0.28)
        ctext(d, "手机只剩 1% 的电，我赶紧找充电器", lerp(122, 80, q), 270, 40, TEXT, 255, "la")
        ctext(d, "|", 875 + 14 * math.sin(t * 38), 270, 46, GREEN)


def scene_tokenizer(d, t):
    sentence = "手机快没电了，我得赶紧找充电器。"
    ctext(d, sentence, 118, 238, 40, TEXT, 255, "la")
    gate(d, 640, 360, ease(min(t * 1.8, 1)))
    if t < 0.40:
        q = ease(t / 0.40)
        rect(d, (lerp(118, 470, q), 278, lerp(610, 680, q), 334), 23, BLUE, 230)
        ctext(d, sentence[:14], lerp(362, 574, q), 305, 28, WHITE, 235)
    else:
        parts = ["手机", "快", "没电", "了", "我", "得", "找", "充电器"]
        q = out((t - 0.40) / 0.44)
        for i, part in enumerate(parts):
            a = clamp(q * len(parts) - i)
            if a <= 0:
                continue
            token(d, part, lerp(640, 300 + i * 95, out(a)), lerp(360, 510, out(a)), GREEN, int(255 * a), 0.9)
    if t > 0.82:
        ctext(d, "不是按字数切，而是按 Tokenizer 的规则切。", 640, 608, 32, TEXT, int(255 * out((t - 0.82) / 0.18)))


def scene_id(d, t):
    for i, (front, back) in enumerate([("手机", "9854"), ("快", "124"), ("没电", "7741"), ("了", "43"), ("充电器", "58231")]):
        x = 310 + i * 165
        flip = ease(clamp(t * 3.5 - i * 0.42))
        token(d, front if flip < 0.5 else back, x, 328, GREEN if flip < 0.5 else DARK, 255, 1.0)
    if t > 0.58:
        q = out((t - 0.58) / 0.42)
        line_arrow(d, 296, 488, 984, 488, GREEN, int(255 * q), 5)
        ctext(d, "Encoding", 640, 540, 34, GREEN, int(255 * q))


def scene_answer(d, t):
    model(d, 640, 216, 0.95, 255)
    parts = ["它", "会", "根据", "上下文", "预测", "下一个", "Token"]
    q = out(t * 0.86)
    for i, part in enumerate(parts):
        a = clamp(q * len(parts) - i)
        if a > 0:
            token(d, part, 256 + i * 126, 422, BLUE if i < 5 else GREEN, int(255 * a), 0.92)
    if t > 0.72:
        ctext(d, "一个 Token 接一个 Token，回答才会一点点出现。", 640, 570, 34, TEXT, int(255 * out((t - 0.72) / 0.28)))


def scene_chain(d, t):
    items = [("文字", BLUE), ("Tokenizer", GREEN), ("Token ID", DARK), ("大模型", GREEN), ("回答", TEAL)]
    xs = [150, 390, 630, 850, 1080]
    q = out(t)
    for i, (txt, col) in enumerate(items):
        a = clamp(q * len(items) - i)
        if a <= 0:
            continue
        if i > 0:
            line_arrow(d, xs[i - 1] + 76, 350, xs[i] - 86, 350, MUTED, int(220 * a), 4)
        token(d, txt, xs[i], 350, col, int(255 * a), 1.0)


PHASES = [
    (0, 9, scene_llm),
    (9, 16, scene_product_model),
    (16, 25, scene_predict),
    (25, 34, scene_tokenizer),
    (34, 41, scene_id),
    (41, 48, scene_answer),
    (48, 53, scene_chain),
]


def render(t):
    img = Image.new("RGBA", (W, H), (*BG, 255))
    d = ImageDraw.Draw(img)
    for start, end, fn in PHASES:
        if start <= t < end:
            fn(d, (t - start) / (end - start))
            break
    return img.convert("RGB")


def main():
    if FRAMES.exists():
        shutil.rmtree(FRAMES)
    FRAMES.mkdir(parents=True, exist_ok=True)
    OUT.mkdir(parents=True, exist_ok=True)
    total = int(PHASES[-1][1] * FPS)
    for i in range(total):
        render(i / FPS).save(FRAMES / f"frame_{i:05d}.jpg", quality=93)
        if i % 160 == 0:
            print(f"frame {i}/{total}", flush=True)
    subprocess.run([
        "ffmpeg", "-y", "-hide_banner", "-loglevel", "error",
        "-framerate", str(FPS), "-i", str(FRAMES / "frame_%05d.jpg"),
        "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "18",
        "-preset", "veryfast", str(VIDEO),
    ], check=True)
    subprocess.run([
        "ffmpeg", "-y", "-hide_banner", "-loglevel", "error",
        "-i", str(VIDEO), "-vf", "fps=1/4,scale=320:-1,tile=4x4",
        str(OUT / "preview_montage_v2.jpg"),
    ], check=True)
    print(VIDEO)


if __name__ == "__main__":
    main()
