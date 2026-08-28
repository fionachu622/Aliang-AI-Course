#!/usr/bin/env python3
import math
import shutil
import subprocess
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "build" / "lesson1_motion_preview"
FRAMES = OUT / "frames"
VIDEO = OUT / "第1课_可视化动效样片.mp4"

W, H = 1280, 720
FPS = 24
BG = (245, 240, 240)
TEXT = (29, 29, 31)
MUTED = (110, 110, 115)
BLUE = (0, 122, 255)
GREEN = (52, 199, 89)
TEAL = (0, 184, 184)
DARK = (18, 54, 127)
WHITE = (255, 255, 255)
SOFT = (229, 229, 234)

FONT = "/System/Library/Fonts/Hiragino Sans GB.ttc"


def f(size):
    return ImageFont.truetype(FONT, size)


def ease(x):
    x = max(0, min(1, x))
    return 1 - (1 - x) ** 3


def ease_in_out(x):
    x = max(0, min(1, x))
    return 0.5 - 0.5 * math.cos(math.pi * x)


def lerp(a, b, t):
    return a + (b - a) * t


def color(c, a=255):
    return (*c, int(a))


def text_size(draw, text, font):
    box = draw.textbbox((0, 0), text, font=font)
    return box[2] - box[0], box[3] - box[1]


def center_text(draw, text, xy, font, fill=TEXT, anchor="mm", alpha=255):
    draw.text(xy, text, font=font, fill=color(fill, alpha), anchor=anchor)


def round_rect(draw, box, r, fill, outline=None, width=1, alpha=255):
    fill_rgba = color(fill, alpha) if fill else None
    outline_rgba = color(outline, alpha) if outline else None
    draw.rounded_rectangle(box, radius=r, fill=fill_rgba, outline=outline_rgba, width=width)


def arrow(draw, start, end, fill=MUTED, width=4, alpha=255):
    fill_rgba = color(fill, alpha)
    draw.line([start, end], fill=fill_rgba, width=width)
    ang = math.atan2(end[1] - start[1], end[0] - start[0])
    size = 15
    p1 = (end[0] - size * math.cos(ang - 0.45), end[1] - size * math.sin(ang - 0.45))
    p2 = (end[0] - size * math.cos(ang + 0.45), end[1] - size * math.sin(ang + 0.45))
    draw.polygon([end, p1, p2], fill=fill_rgba)


def token(draw, text, x, y, w=None, fill=BLUE, alpha=255, scale=1.0):
    font = f(int(25 * scale))
    tw, th = text_size(draw, text, font)
    w = w or tw + 34 * scale
    h = 48 * scale
    box = (x - w / 2, y - h / 2, x + w / 2, y + h / 2)
    round_rect(draw, box, int(18 * scale), fill, alpha=alpha)
    center_text(draw, text, (x, y - 2 * scale), font, WHITE, alpha=alpha)


def product_name(draw, text, x, y, a=255):
    center_text(draw, text, (x, y), f(44), TEXT, alpha=a)


def draw_chat_shell(draw, cx, cy, scale=1.0, alpha=255):
    w, h = 320 * scale, 188 * scale
    x1, y1 = cx - w / 2, cy - h / 2
    round_rect(draw, (x1, y1, x1 + w, y1 + h), int(26 * scale), WHITE, SOFT, 2, alpha)
    round_rect(draw, (x1 + 28 * scale, y1 + 38 * scale, x1 + 218 * scale, y1 + 78 * scale), int(16 * scale), (238, 246, 255), alpha=alpha)
    round_rect(draw, (x1 + 74 * scale, y1 + 94 * scale, x1 + 292 * scale, y1 + 134 * scale), int(16 * scale), (231, 249, 237), alpha=alpha)
    round_rect(draw, (x1 + 30 * scale, y1 + 148 * scale, x1 + 290 * scale, y1 + 174 * scale), int(13 * scale), (242, 242, 247), alpha=alpha)


def draw_model(draw, cx, cy, scale=1.0, alpha=255, label="大模型", active=False):
    w, h = 330 * scale, 210 * scale
    x1, y1 = cx - w / 2, cy - h / 2
    fill = DARK if active else (255, 255, 255)
    txt = WHITE if active else TEXT
    round_rect(draw, (x1, y1, x1 + w, y1 + h), int(34 * scale), fill, (203, 214, 232), 2, alpha)
    center_text(draw, label, (cx, cy - 16 * scale), f(int(44 * scale)), txt, alpha=alpha)
    center_text(draw, "predict next token", (cx, cy + 42 * scale), f(int(18 * scale)), (185, 215, 255) if active else MUTED, alpha=alpha)


def draw_tokenizer(draw, cx, cy, scale=1.0, alpha=255, open_amt=0):
    w, h = 150 * scale, 190 * scale
    gap = 20 * scale + 32 * scale * open_amt
    left = cx - gap / 2 - w / 2
    right = cx + gap / 2
    round_rect(draw, (left, cy - h / 2, left + w / 2, cy + h / 2), int(20 * scale), GREEN, alpha=alpha)
    round_rect(draw, (right, cy - h / 2, right + w / 2, cy + h / 2), int(20 * scale), GREEN, alpha=alpha)
    center_text(draw, "Tokenizer", (cx, cy - h / 2 - 30 * scale), f(int(24 * scale)), TEXT, alpha=alpha)
    center_text(draw, "切分", (cx, cy + 4 * scale), f(int(28 * scale)), WHITE, alpha=alpha)


def title(draw, text, t, top=64):
    center_text(draw, text, (72, top), f(24), MUTED, anchor="la", alpha=210)


def phase_products(draw, t):
    title(draw, "产品外壳退后，背后浮出大模型", t)
    names = [("ChatGPT", -260, 320, 260), ("DeepSeek", 1540, 320, 640), ("豆包", 640, 820, 1020)]
    if t < 0.52:
        for name, sx, sy, ex in names:
            p = ease_in_out(t / 0.52)
            product_name(draw, name, lerp(sx, ex, p), lerp(sy, 320, p))
    elif t < 0.72:
        p = ease_in_out((t - 0.52) / 0.20)
        for name, _, _, ex in names:
            product_name(draw, name, lerp(ex, 640, p), 320, int(255 * (1 - p)))
        center_text(draw, "AI 产品", (640, 320), f(int(44 + 10 * p)), BLUE, alpha=int(255 * p))
    else:
        p = ease_in_out((t - 0.72) / 0.28)
        draw_chat_shell(draw, 640, lerp(320, 284, p), lerp(0.2, 1.0, p), 255)
        center_text(draw, "AI 产品", (640, 190), f(34), BLUE, alpha=255)


def phase_model(draw, t):
    title(draw, "聊天窗口只是外壳，核心能力在背后", t)
    p = ease_in_out(t)
    draw_chat_shell(draw, 640, lerp(284, 226, p), lerp(1.0, 0.68, p), int(255 * (1 - 0.52 * p)))
    draw_model(draw, 640, lerp(500, 390, p), lerp(0.55, 1.05, p), int(255 * p), active=True)
    center_text(draw, "理解输入，并生成回答", (640, 560), f(30), TEXT, alpha=int(255 * p))


def phase_llm(draw, t):
    title(draw, "像参考视频一样：从缩写拆开概念", t)
    if t < 0.18:
        center_text(draw, "LLM", (640, 344), f(82), TEXT, alpha=int(255 * ease(t / 0.18)))
    elif t < 0.36:
        p = ease_in_out((t - 0.18) / 0.18)
        for ch, start_x, end_x in [("L", 640, 440), ("L", 640, 640), ("M", 640, 840)]:
            center_text(draw, ch, (lerp(start_x, end_x, p), 344), f(82), TEXT)
    elif t < 0.62:
        p = ease_in_out((t - 0.36) / 0.26)
        for ch, x in [("L", 268, ), ("L", 568), ("M", 902)]:
            center_text(draw, ch[0], (x, 344), f(82), (226, 210, 32))
        words = [("arge", 316, 344), ("anguage", 616, 344), ("odel", 950, 344)]
        for word, x, y in words:
            center_text(draw, word, (x + 70 * (1 - p), y), f(56), TEXT, anchor="lm", alpha=int(255 * p))
    elif t < 0.80:
        p = ease_in_out((t - 0.62) / 0.18)
        center_text(draw, "Large Language Model", (640, lerp(344, 412, p)), f(int(58 - 20 * p)), TEXT)
        center_text(draw, "大语言模型", (640, lerp(300, 270, p)), f(64), TEXT, alpha=int(255 * p))
    else:
        p = ease_in_out((t - 0.80) / 0.20)
        center_text(draw, "Large Language Model", (640, 412), f(38), MUTED, alpha=255)
        center_text(draw, "大", (lerp(492, 548, p), 270), f(64), TEXT)
        center_text(draw, "语言", (640, 270), f(64), TEXT, alpha=int(255 * (1 - p)))
        center_text(draw, "模型", (lerp(788, 716, p), 270), f(64), TEXT)
        center_text(draw, "基本上现在所有的大模型，都属于 LLM。", (640, 556), f(28), GREEN, alpha=int(255 * p))


def phase_prediction(draw, t):
    title(draw, "大模型不是背定义，而是在预测下一个 Token", t)
    p = ease_in_out(min(1, t / 0.22))
    center_text(draw, "大模型", (lerp(640, 1010, p), 198), f(60), TEXT)
    draw_model(draw, lerp(640, 1010, p), 386, 0.88, 245, active=True)
    sent = "手机只剩 1% 的电，我赶紧找……"
    reveal = int(len(sent) * ease((t - 0.15) / 0.28)) if t > 0.15 else 0
    center_text(draw, sent[:reveal], (108, 256), f(42), TEXT, anchor="la")
    if t > 0.42:
        q = ease((t - 0.42) / 0.22)
        choices = [("充电器", GREEN, 1.18, 370, 374), ("充电宝", GREEN, 1.0, 538, 446), ("插座", BLUE, 0.82, 336, 500), ("遥控器", (150, 150, 155), 0.58, 606, 532)]
        for label, col, sc, x, y in choices:
            center_text(draw, label, (lerp(560, x, q), lerp(276, y, q)), f(int(34 * sc)), col, alpha=int(255 * q))
    if t > 0.70:
        q = ease_in_out((t - 0.70) / 0.30)
        token(draw, "充电器", lerp(370, 684, q), lerp(374, 256, q), 122, GREEN, 255, 1.0 + 0.12 * (1 - q))
        center_text(draw, "选中概率更高的候选，接回上下文", (640, 590), f(28), GREEN, alpha=int(255 * q))


def phase_tokenizer(draw, t):
    title(draw, "文字穿过 Tokenizer，才变成模型处理的 Token", t)
    sentence = "手机快没电了，我得赶紧找充电器。"
    center_text(draw, sentence, (146, 192), f(38), TEXT, anchor="la")
    p = ease_in_out(min(1, t / 0.25))
    draw_tokenizer(draw, 640, 344, 1.0, 255, open_amt=p)
    if t < 0.42:
        q = ease_in_out(t / 0.42)
        round_rect(draw, (lerp(146, 482, q), 245, lerp(602, 676, q), 300), 22, BLUE, alpha=220)
        center_text(draw, sentence[:12], (lerp(374, 579, q), 270), f(28), WHITE, alpha=230)
    else:
        parts = ["手机", "快", "没电", "了", "，", "我", "得", "赶紧", "找", "充电器"]
        q = ease((t - 0.42) / 0.38)
        start_x = 330
        for i, part in enumerate(parts):
            appear = max(0, min(1, q * len(parts) - i))
            if appear <= 0:
                continue
            x = start_x + i * 72
            token(draw, part, lerp(640, x, ease(appear)), lerp(344, 500, ease(appear)), None, GREEN, int(255 * appear), 0.86)
    if t > 0.78:
        q = ease((t - 0.78) / 0.22)
        center_text(draw, "Token 的切分不是固定按字数换算", (640, 604), f(30), TEXT, alpha=int(255 * q))


def phase_token_id(draw, t):
    title(draw, "Token 再翻面，变成模型真正计算的 Token ID", t)
    parts = [("手机", "9854"), ("快", "124"), ("没电", "7741"), ("了", "43"), ("充电器", "58231")]
    start_x = 326
    for i, (front, back) in enumerate(parts):
        local = max(0, min(1, t * 4 - i * 0.55))
        flip = ease_in_out(local)
        w = abs(math.cos(math.pi * flip)) * 98 + 6
        label = front if flip < 0.5 else back
        fill = GREEN if flip < 0.5 else DARK
        token(draw, label, start_x + i * 156, 320, w, fill, 255, 1.0)
    if t > 0.55:
        q = ease((t - 0.55) / 0.45)
        arrow(draw, (246, 488), (1014, 488), GREEN, 5, int(255 * q))
        center_text(draw, "Encoding 编码：人类文字 → Token / Token ID", (640, 540), f(30), GREEN, alpha=int(255 * q))


def phase_summary(draw, t):
    title(draw, "最后收回成一条能记住的主链路", t)
    labels = [("文字", BLUE), ("Tokenizer", GREEN), ("Token / ID", DARK), ("大模型预测", GREEN), ("逐步回答", TEAL)]
    xs = [160, 382, 608, 850, 1080]
    q = ease(t)
    for i, ((label, col), x) in enumerate(zip(labels, xs)):
        local = max(0, min(1, q * len(labels) - i))
        if local <= 0:
            continue
        if i > 0:
            arrow(draw, (xs[i - 1] + 70, 338), (x - 82, 338), MUTED, 4, int(255 * local))
        token(draw, label, x, 338, 150 if i != 1 else 176, col, int(255 * local), 1.0)
    if t > 0.70:
        a = int(255 * ease((t - 0.70) / 0.30))
        center_text(draw, "下一课继续放大：Context Window 到底能装多少 Token？", (640, 542), f(32), TEXT, alpha=a)


PHASES = [
    (0, 5.0, phase_products),
    (5.0, 9.0, phase_model),
    (9.0, 20.0, phase_llm),
    (20.0, 32.0, phase_prediction),
    (32.0, 44.0, phase_tokenizer),
    (44.0, 53.0, phase_token_id),
    (53.0, 60.0, phase_summary),
]


def render_frame(t):
    img = Image.new("RGBA", (W, H), (*BG, 255))
    draw = ImageDraw.Draw(img)
    for start, end, fn in PHASES:
        if start <= t < end:
            fn(draw, (t - start) / (end - start))
            break
    return img.convert("RGB")


def main():
    if FRAMES.exists():
        shutil.rmtree(FRAMES)
    FRAMES.mkdir(parents=True, exist_ok=True)
    total = int(PHASES[-1][1] * FPS)
    for i in range(total):
        img = render_frame(i / FPS)
        img.save(FRAMES / f"frame_{i:05d}.jpg", quality=92)
        if i % 120 == 0:
            print(f"frame {i}/{total}", flush=True)
    subprocess.run([
        "ffmpeg", "-y", "-hide_banner", "-loglevel", "error",
        "-framerate", str(FPS),
        "-i", str(FRAMES / "frame_%05d.jpg"),
        "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "18",
        "-preset", "veryfast", str(VIDEO),
    ], check=True)
    subprocess.run([
        "ffmpeg", "-y", "-hide_banner", "-loglevel", "error",
        "-ss", "0", "-i", str(VIDEO), "-vf", "fps=1/5,scale=320:-1,tile=4x3",
        str(OUT / "preview_montage.jpg"),
    ], check=True)
    print(VIDEO)


if __name__ == "__main__":
    main()
