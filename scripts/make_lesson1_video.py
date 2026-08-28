#!/usr/bin/env python3
import argparse
import math
import re
import subprocess
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[1]
DOCX = ROOT / "course" / "第 1 课 逐字稿.docx"
OUT = ROOT / "build" / "lesson1_video"
W, H = 1280, 720
FPS = 30

BG = (245, 240, 240)
TEXT = (28, 31, 36)
MUTED = (92, 98, 110)
BLUE = (0, 122, 255)
GREEN = (52, 199, 89)
TEAL = (0, 190, 190)
DARK_BLUE = (17, 54, 132)
WHITE = (255, 255, 255)

FONT_REG = "/System/Library/Fonts/Hiragino Sans GB.ttc"
FONT_BOLD = "/System/Library/Fonts/Hiragino Sans GB.ttc"


def run(cmd):
    print("+", " ".join(str(c) for c in cmd), flush=True)
    subprocess.run([str(c) for c in cmd], check=True)


def font(size):
    return ImageFont.truetype(FONT_REG, size)


def bold(size):
    return ImageFont.truetype(FONT_BOLD, size)


def text_size(draw, text, fnt):
    box = draw.textbbox((0, 0), text, font=fnt)
    return box[2] - box[0], box[3] - box[1]


def wrap(draw, text, fnt, max_width):
    lines = []
    for para in text.split("\n"):
        para = para.strip()
        if not para:
            lines.append("")
            continue
        current = ""
        for ch in para:
            trial = current + ch
            if text_size(draw, trial, fnt)[0] <= max_width:
                current = trial
            else:
                if current:
                    lines.append(current)
                current = ch
        if current:
            lines.append(current)
    return lines


def draw_wrapped(draw, xy, text, fnt, fill, max_width, line_gap=8):
    x, y = xy
    for line in wrap(draw, text, fnt, max_width):
        draw.text((x, y), line, font=fnt, fill=fill)
        y += fnt.size + line_gap
    return y


def rounded(draw, box, radius=24, fill=WHITE, outline=None, width=1):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def arrow(draw, start, end, color=BLUE, width=5):
    draw.line([start, end], fill=color, width=width)
    ang = math.atan2(end[1] - start[1], end[0] - start[0])
    size = 16
    p1 = (end[0] - size * math.cos(ang - 0.45), end[1] - size * math.sin(ang - 0.45))
    p2 = (end[0] - size * math.cos(ang + 0.45), end[1] - size * math.sin(ang + 0.45))
    draw.polygon([end, p1, p2], fill=color)


def base():
    img = Image.new("RGB", (W, H), BG)
    noise = Image.effect_noise((W, H), 22).convert("L")
    tint = Image.new("RGB", (W, H), BG)
    tint.putalpha(noise.point(lambda p: int(p * 0.08)))
    img = Image.alpha_composite(img.convert("RGBA"), tint).convert("RGBA")
    draw = ImageDraw.Draw(img)
    draw.ellipse((-190, -260, 710, 530), outline=(BLUE[0], BLUE[1], BLUE[2], 90), width=7)
    draw.ellipse((650, -210, 1510, 650), outline=(GREEN[0], GREEN[1], GREEN[2], 85), width=7)
    draw.line((0, 612, 1280, 410), fill=(0, 122, 255, 68), width=3)
    return img


def header(draw, scene_no, title, eyebrow):
    draw.text((72, 44), f"第 1 课  ·  {eyebrow}", font=font(24), fill=MUTED)
    draw.text((72, 82), title, font=bold(52), fill=TEXT)
    draw.rounded_rectangle((72, 662, 1208, 674), radius=6, fill=(215, 221, 229))
    progress = 72 + int((1208 - 72) * scene_no / 10)
    draw.rounded_rectangle((72, 662, progress, 674), radius=6, fill=BLUE)


def pill(draw, xy, text, fill, fg=WHITE, pad_x=22, pad_y=12, fnt=None):
    fnt = fnt or bold(28)
    x, y = xy
    tw, th = text_size(draw, text, fnt)
    box = (x, y, x + tw + pad_x * 2, y + th + pad_y * 2)
    rounded(draw, box, radius=22, fill=fill)
    draw.text((x + pad_x, y + pad_y - 2), text, font=fnt, fill=fg)
    return box


def card(draw, box, title, body, accent=BLUE):
    rounded(draw, box, radius=24, fill=(255, 255, 255, 232), outline=(223, 226, 233), width=2)
    x1, y1, x2, _ = box
    draw.rounded_rectangle((x1 + 22, y1 + 24, x1 + 30, y1 + 72), radius=4, fill=accent)
    draw.text((x1 + 46, y1 + 20), title, font=bold(28), fill=TEXT)
    draw_wrapped(draw, (x1 + 46, y1 + 66), body, font(22), MUTED, x2 - x1 - 78, 8)


def scene_common_flow(draw, y=388, active=0):
    items = [("输入", BLUE), ("AI 产品", TEAL), ("Tokenizer", GREEN), ("大模型", DARK_BLUE), ("回答", BLUE)]
    xs = [112, 318, 548, 798, 1030]
    boxes = []
    for i, ((label, color), x) in enumerate(zip(items, xs)):
        fill = color if i == active else (255, 255, 255, 236)
        fg = WHITE if i == active else TEXT
        outline = None if i == active else (221, 224, 230)
        rounded(draw, (x, y, x + 138, y + 72), radius=22, fill=fill, outline=outline, width=2)
        tw, th = text_size(draw, label, bold(24))
        draw.text((x + 69 - tw / 2, y + 36 - th / 2 - 2), label, font=bold(24), fill=fg)
        boxes.append((x, y, x + 138, y + 72))
    for b1, b2 in zip(boxes, boxes[1:]):
        arrow(draw, (b1[2] + 10, y + 36), (b2[0] - 10, y + 36), color=(95, 107, 124), width=4)


def slide_1(draw):
    header(draw, 1, "AI 产品背后的核心能力", "从聊天窗口追到大模型")
    draw.text((92, 178), "我们直接使用的是产品界面，真正负责理解和生成的核心能力之一，是大模型。", font=font(30), fill=TEXT)
    scene_common_flow(draw, 354, active=1)
    card(draw, (86, 504, 386, 614), "产品层", "聊天框、上传、联网、语音、按钮", BLUE)
    card(draw, (776, 504, 1118, 614), "能力层", "理解输入，并生成可读回答", GREEN)


def slide_2(draw):
    header(draw, 2, "LLM 是什么", "先建立可用的普通用户理解")
    card(draw, (90, 172, 580, 532), "Large Language Model", "通过大量数据学习语言、知识和内容之间的复杂规律。", BLUE)
    card(draw, (690, 172, 1170, 532), "继续生成内容", "根据已有内容，判断后面更可能出现什么，再一步步生成。", GREEN)
    pill(draw, (410, 584), "暂时不用先研究 Transformer、参数量、训练细节", (32, 42, 56), fnt=bold(24))


def slide_3(draw):
    header(draw, 3, "为什么能生成回答", "从一句话开始看概率")
    draw.text((96, 180), "手机只剩 1% 的电，我赶紧找……", font=bold(40), fill=TEXT)
    choices = [("充电器", 0.92, GREEN), ("充电宝", 0.82, GREEN), ("插座", 0.60, BLUE), ("数据线", 0.54, BLUE), ("遥控器", 0.12, (150, 156, 168))]
    y = 270
    for label, pct, color in choices:
        draw.text((130, y), label, font=bold(30), fill=TEXT)
        rounded(draw, (290, y + 8, 990, y + 32), radius=12, fill=(221, 226, 233))
        rounded(draw, (290, y + 8, 290 + int(700 * pct), y + 32), radius=12, fill=color)
        draw.text((1018, y - 2), f"{int(pct * 100)}%", font=font(24), fill=MUTED)
        y += 70
    pill(draw, (322, 606), "生成 = 根据上下文预测下一个 Token", BLUE, fnt=bold(28))


def slide_4(draw):
    header(draw, 4, "为什么回答会一点点出现", "答案本身在持续生成")
    tokens = ["手机", "快", "没电", "了", "，", "我", "得", "找", "充电器"]
    x, y = 142, 260
    for i, t in enumerate(tokens):
        color = GREEN if i == len(tokens) - 1 else BLUE if i >= 5 else (255, 255, 255)
        fg = WHITE if color in (BLUE, GREEN) else TEXT
        box = pill(draw, (x, y), t, color, fg=fg, fnt=bold(28))
        x = box[2] + 14
    arrow(draw, (320, 410), (965, 410), BLUE, 6)
    draw.text((350, 444), "生成一个 → 接上去 → 再预测下一个 → 再接上去", font=bold(30), fill=TEXT)
    card(draw, (174, 532, 1106, 622), "关键判断", "不是先完整写好再模拟打字效果，而是输出内容正在一个 Token 接一个 Token 地形成。", GREEN)


def slide_5(draw):
    header(draw, 5, "Token 是什么", "基本单位，但不是固定的字/词/字符")
    card(draw, (86, 172, 454, 552), "Token", "大模型处理和生成文本时使用的基本单位。", BLUE)
    for i, txt in enumerate(["不固定等于汉字", "不固定等于英文单词", "不固定等于字符"]):
        card(draw, (538, 178 + i * 126, 1146, 276 + i * 126), txt, "同一段文字会被 Tokenizer 按词表和规则切分。", GREEN if i == 0 else BLUE)
    pill(draw, (412, 604), "更准确地说：大模型在做 Token 接龙", (32, 42, 56), fnt=bold(28))


def slide_6(draw):
    header(draw, 6, "Tokenizer 如何切分文字", "文字进入模型前的第一道转换")
    draw.text((112, 172), "手机快没电了，我得赶紧找充电器。", font=bold(34), fill=TEXT)
    scene_common_flow(draw, 330, active=2)
    draw.text((340, 540), "Tokenizer 决定一段文字最终怎样被切成 Token。", font=bold(32), fill=TEXT)
    draw.text((340, 590), "不同模型的 Tokenizer 可能不同，Token 数量也可能不同。", font=font(26), fill=MUTED)


def slide_7(draw):
    header(draw, 7, "Token ID、编码与解码", "人类文字和模型计算之间的桥")
    steps = [("人类文字", BLUE), ("Encoding 编码", GREEN), ("Token / Token ID", DARK_BLUE), ("大模型处理", GREEN), ("Decoding 解码", BLUE), ("最终回答", TEAL)]
    x = 84
    y = 326
    last = None
    for label, color in steps:
        rounded(draw, (x, y, x + 166, y + 78), radius=22, fill=color)
        lines = label.split(" ")
        ty = y + 16 if len(lines) == 1 else y + 8
        for line in lines:
            tw, th = text_size(draw, line, bold(21))
            draw.text((x + 83 - tw / 2, ty), line, font=bold(21), fill=WHITE)
            ty += 28
        if last:
            arrow(draw, (last + 10, y + 39), (x - 10, y + 39), (102, 112, 126), 4)
        last = x + 166
        x += 198
    card(draw, (164, 502, 1116, 612), "这一课真正要记住的关系", "我们输入的是人能看懂的文字；进入模型计算前，它会变成 Token 和对应的数字编号。", GREEN)


def slide_8(draw):
    header(draw, 8, "为什么 Token 不等于字、词、字符", "词表和切分规则决定结果")
    examples = [("中文词", "可能一个 Token，也可能拆开"), ("English", "可能整体，也可能分片"), ("12345", "数字也有自己的切法"), ("😂", "emoji 不一定按一个字符处理")]
    x0, y0 = 110, 202
    for i, (a, b) in enumerate(examples):
        x = x0 + (i % 2) * 560
        y = y0 + (i // 2) * 170
        card(draw, (x, y, x + 470, y + 126), a, b, GREEN if i % 2 else BLUE)
    pill(draw, (292, 596), "不要把 100 万 Token 直接理解成 100 万个汉字", (32, 42, 56), fnt=bold(28))


def slide_9(draw):
    header(draw, 9, "真实 Tokenizer 演示要看什么", "重点不是记数字，而是看切分方式")
    left = "手机快没电了，我得赶紧找充电器。"
    right = "这个 PPT 明天要交，帮我 check 一下 😂"
    card(draw, (80, 180, 590, 548), "纯中文句子", left, BLUE)
    card(draw, (690, 180, 1200, 548), "混合文本", right, GREEN)
    draw.text((166, 475), "观察：不是严格一个汉字一个 Token", font=bold(24), fill=TEXT)
    draw.text((748, 475), "观察：中文、英文、标点、emoji 会混合切分", font=bold(24), fill=TEXT)
    pill(draw, (368, 606), "正式录制时以最终 Tokenizer 真实结果为准", DARK_BLUE, fnt=bold(25))


def slide_10(draw):
    header(draw, 10, "Token 为什么影响实际使用", "上下文、输出长度、成本")
    card(draw, (90, 168, 402, 514), "一次能处理多少", "128K Token、1M Token 等数字，和上下文窗口有关。", BLUE)
    card(draw, (484, 168, 796, 514), "最多能生成多少", "回答本身也是一个个输出 Token 生成出来的。", GREEN)
    card(draw, (878, 168, 1190, 514), "使用成本", "API 常按输入 Token 和输出 Token 计费。", TEAL)
    draw.text((144, 582), "文字 → Tokenizer → Token ID → 大模型生成 → 解码 → 回答", font=bold(34), fill=TEXT)


SLIDES = [slide_1, slide_2, slide_3, slide_4, slide_5, slide_6, slide_7, slide_8, slide_9, slide_10]


def extract_segments():
    txt = subprocess.check_output(["textutil", "-convert", "txt", "-stdout", str(DOCX)], text=True)
    txt = txt.replace("\u2028", "\n").replace("\xa0", " ")
    parts = re.split(r"\n?（(\d+)）", txt)
    segments = []
    for i in range(1, len(parts), 2):
        no = int(parts[i])
        body = parts[i + 1].strip()
        body = re.sub(r"\n{3,}", "\n\n", body)
        body = body.replace("【正式录制时，这里的具体 Token 切分和 Token ID，以最终选定 Tokenizer 的真实结果为准。】", "")
        segments.append((no, body))
    return segments


def make_slides():
    OUT.mkdir(parents=True, exist_ok=True)
    slide_paths = []
    for i, fn in enumerate(SLIDES, start=1):
        img = base()
        draw = ImageDraw.Draw(img)
        fn(draw)
        img = img.filter(ImageFilter.UnsharpMask(radius=1.2, percent=105, threshold=3))
        path = OUT / f"slide_{i:02d}.png"
        img.convert("RGB").save(path, quality=95)
        slide_paths.append(path)
    return slide_paths


def make_audio(segments):
    audio_paths = []
    for no, text in segments:
        text_path = OUT / f"narration_{no:02d}.txt"
        text_path.write_text(text, encoding="utf-8")
        path = OUT / f"audio_{no:02d}.aiff"
        if not has_audio(path):
            run(["say", "-v", "Tingting", "-r", "185", "-o", path, "-f", text_path])
        audio_paths.append(path)
    return audio_paths


def has_audio(path):
    if not path.exists() or path.stat().st_size < 8192:
        return False
    try:
        return duration(path) > 0.1
    except Exception:
        return False


def duration(path):
    if path.suffix.lower() in {".aiff", ".aif", ".aifc"}:
        out = subprocess.check_output(["afinfo", str(path)], text=True)
        match = re.search(r"estimated duration:\s+([0-9.]+)\s+sec", out)
        if match:
            return float(match.group(1))
    out = subprocess.check_output([
        "ffprobe", "-v", "error", "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1", str(path)
    ], text=True).strip()
    return float(out)


def make_segments(slides, audios):
    video_paths = []
    for i, (slide, audio) in enumerate(zip(slides, audios), start=1):
        dur = duration(audio)
        frames = max(1, int(math.ceil(dur * FPS)))
        vf = (
            f"zoompan=z='min(zoom+0.00018,1.035)':d={frames}:"
            f"x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s={W}x{H}:fps={FPS},"
            f"fade=t=in:st=0:d=0.35,fade=t=out:st={max(dur-0.35,0)}:d=0.35,"
            "format=yuv420p"
        )
        out = OUT / f"segment_{i:02d}.mp4"
        run([
            "ffmpeg", "-y", "-hide_banner", "-loglevel", "error",
            "-loop", "1", "-i", slide, "-i", audio,
            "-t", f"{dur:.3f}", "-vf", vf,
            "-c:v", "libx264", "-preset", "veryfast", "-crf", "20",
            "-c:a", "aac", "-b:a", "160k", "-shortest", out
        ])
        video_paths.append(out)
    return video_paths


def concat(videos):
    concat_file = OUT / "concat.txt"
    concat_file.write_text("".join(f"file '{v}'\n" for v in videos), encoding="utf-8")
    out = OUT / "lesson1_ai_general_course.mp4"
    run([
        "ffmpeg", "-y", "-hide_banner", "-loglevel", "error",
        "-f", "concat", "-safe", "0", "-i", concat_file,
        "-c", "copy", out
    ])
    return out


def prepare():
    segments = extract_segments()
    if len(segments) != 10:
        raise RuntimeError(f"Expected 10 transcript sections, got {len(segments)}")
    make_slides()
    for no, text in segments:
        (OUT / f"narration_{no:02d}.txt").write_text(text, encoding="utf-8")


def render():
    slides = [OUT / f"slide_{i:02d}.png" for i in range(1, 11)]
    audios = [OUT / f"audio_{i:02d}.aiff" for i in range(1, 11)]
    missing = [str(p) for p in audios if not has_audio(p)]
    if missing:
        raise RuntimeError("Missing or empty audio files:\n" + "\n".join(missing))
    videos = make_segments(slides, audios)
    final = concat(videos)
    print(final)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("stage", nargs="?", choices=["all", "prepare", "audio", "render"], default="all")
    args = parser.parse_args()
    if args.stage == "prepare":
        prepare()
        return
    if args.stage == "render":
        render()
        return
    segments = extract_segments()
    if len(segments) != 10:
        raise RuntimeError(f"Expected 10 transcript sections, got {len(segments)}")
    make_slides()
    make_audio(segments)
    render()


if __name__ == "__main__":
    main()
