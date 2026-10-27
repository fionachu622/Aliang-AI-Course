// Visual language for the AI生成PPT course (v7).
// Look: the course's own chalkboard (same texture as Lesson1ChalkboardV3), hand-written chalk type,
// wobbly chalk frames and arrows, a few blue / yellow / pink / green accents.
// Organisation and motion follow the reference explainer "从 LLM 到 Agent Skill": one idea per
// board, elements drawn on one by one as they are spoken, relations shown by position and arrows,
// the part not being talked about steps back.
import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, staticFile} from 'remotion';

export const C = {
  board: '#24272A',
  ink: '#F5F1E8',
  inkSoft: 'rgba(245,241,232,.66)',
  inkDim: 'rgba(245,241,232,.3)',
  line: 'rgba(245,241,232,.22)',
  panel: 'rgba(245,241,232,.035)', // faint chalk wash inside frames
  blue: '#7CC8EA',
  yellow: '#F0D26A',
  pink: '#F18D9E',
  green: '#A4D486',
  dark: '#141617',
  accent: '#F0D26A',
};

export const FONT = {
  chalk: '"PPT Chalk", "HanziPen SC", "Kaiti SC", "STKaiti", serif',
  ui: '"PingFang SC", "Noto Sans CJK SC", "Microsoft YaHei", sans-serif',
  num: '"PPT Chalk", "HanziPen SC", "Kaiti SC", serif',
  sans: '"PingFang SC", "Noto Sans CJK SC", "Microsoft YaHei", sans-serif',
};

/** Font faces, loaded once at the root of the course. */
export const ChalkFonts: React.FC = () => (
  <style>{`
    @font-face{font-family:"PPT Chalk";font-weight:400;src:url("${staticFile('fonts/HanziPenSC-Regular.otf')}")}
    @font-face{font-family:"PPT Chalk";font-weight:700;src:url("${staticFile('fonts/HanziPenSC-Bold.otf')}")}
    *{box-sizing:border-box}
  `}</style>
);

const clampOpt = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const ease = (v: number, a: number, b: number) =>
  interpolate(v, [a, b], [0, 1], {...clampOpt, easing: Easing.bezier(0.22, 1, 0.36, 1)});
export const easeInOut = (v: number, a: number, b: number) =>
  interpolate(v, [a, b], [0, 1], {...clampOpt, easing: Easing.bezier(0.65, 0, 0.35, 1)});
export const pop = (v: number, a: number, b: number) =>
  interpolate(v, [a, b], [0, 1], {...clampOpt, easing: Easing.bezier(0.3, 1.25, 0.6, 1)});
export const lerp = (p: number, a: number, b: number) => a + (b - a) * p;

/** Chalkboard page; text inside inherits the chalk lettering. */
export const Stage: React.FC<{children?: React.ReactNode; dim?: number}> = ({children, dim = 0}) => (
  <AbsoluteFill style={{background: C.board, color: C.ink, fontFamily: FONT.chalk, WebkitTextStroke: '.6px currentColor', paintOrder: 'stroke fill', textShadow: '0 0 .6px rgba(255,255,255,.45)'} as React.CSSProperties}>
    <Img src={staticFile('shared-visual/backgrounds/chalkboard/chalkboard.png')} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover'}} />
    <AbsoluteFill style={{background: `radial-gradient(circle at 50% 46%, rgba(0,0,0,0) 32%, rgba(0,0,0,${0.16 + dim}) 100%)`}} />
    {children}
  </AbsoluteFill>
);

// ---------- hand-drawn strokes ----------
const noise = (i: number, seed: number) => {
  const v = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453;
  return (v - Math.floor(v)) * 2 - 1;
};
const seedOf = (key: string) => Array.from(key).reduce((h, c) => (h * 31 + (c.codePointAt(0) ?? 0)) % 10007, 17);

/** Rough rectangle path in a w×h box (slightly wobbly, like chalk). */
export const roughRectPath = (w: number, h: number, key: string, amp = 2.4, inset = 0) => {
  const s = seedOf(key);
  const pts: [number, number][] = [];
  const steps = 6;
  const corners: [number, number][] = [[inset, inset], [w - inset, inset], [w - inset, h - inset], [inset, h - inset]];
  corners.forEach(([x0, y0], k) => {
    const [x1, y1] = corners[(k + 1) % 4];
    for (let i = 0; i < steps; i++) {
      const t = i / steps;
      pts.push([x0 + (x1 - x0) * t + noise(k * 10 + i, s) * amp, y0 + (y1 - y0) * t + noise(k * 10 + i + 5, s) * amp]);
    }
  });
  pts.push([pts[0][0] + 6, pts[0][1] + noise(99, s) * amp]);
  return pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
};

/** Chalk frame that draws itself as progress goes 0 → 1. */
export const ChalkRect: React.FC<{w: number; h: number; color?: string; progress?: number; k?: string; width?: number; style?: React.CSSProperties; fill?: string}> = ({w, h, color = C.ink, progress = 1, k = 'r', width = 3.4, style, fill = 'none'}) => (
  <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none', ...style}}>
    {fill !== 'none' && <rect x={4} y={4} width={w - 8} height={h - 8} rx={10} fill={fill} opacity={Math.min(1, progress * 2)} />}
    <path d={roughRectPath(w, h, k)} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - progress} />
    <path d={roughRectPath(w, h, k + 'b', 1.6, 9)} fill="none" stroke={color} strokeWidth={width * 0.34} opacity={0.26} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - progress} />
  </svg>
);

/** Frame at an absolute position. */
export const Frame: React.FC<{x: number; y: number; w: number; h: number; progress: number; color?: string; k: string; width?: number; fill?: string}> = ({x, y, w, h, progress, color, k, width, fill = C.panel}) => (
  <ChalkRect w={w} h={h} k={k} color={color} progress={progress} width={width} fill={fill} style={{left: x, top: y}} />
);

/** Media in a chalk frame (used for recordings shown on the board). */
export const Card: React.FC<{style?: React.CSSProperties; children?: React.ReactNode; radius?: number; k?: string; progress?: number}> = ({style, children, radius = 8, k = 'card', progress = 1}) => {
  const w = Number(style?.width ?? 0), h = Number(style?.height ?? 0);
  return (
    <div style={{position: 'absolute', ...style}}>
      <div style={{position: 'absolute', inset: 0, borderRadius: radius, overflow: 'hidden', background: '#000'}}>{children}</div>
      {w > 0 && h > 0 && <ChalkRect w={w + 24} h={h + 24} k={k} progress={progress} width={3} style={{left: -12, top: -12}} />}
    </div>
  );
};

/** Chalk curve from (x1,y1) to (x2,y2) with an arrow head; draws with progress. */
export const Arrow: React.FC<{x1: number; y1: number; x2: number; y2: number; progress: number; color?: string; width?: number; bend?: number}> = ({x1, y1, x2, y2, progress, color = C.blue, width = 3.4, bend = 6}) => {
  if (progress < 0.01) return null;
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
  const len = Math.hypot(x2 - x1, y2 - y1) || 1;
  const nx = -(y2 - y1) / len, ny = (x2 - x1) / len;
  const qx = mx + nx * bend, qy = my + ny * bend;
  const ang = Math.atan2(y2 - qy, x2 - qx);
  const h = 17;
  return (
    <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none'}} width={1} height={1}>
      <path d={`M${x1} ${y1} Q ${qx} ${qy} ${x2} ${y2}`} stroke={color} strokeWidth={width} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - progress} />
      {progress > 0.85 && <path d={`M${x2 - h * Math.cos(ang - 0.5)} ${y2 - h * Math.sin(ang - 0.5)} L${x2} ${y2} L${x2 - h * Math.cos(ang + 0.5)} ${y2 - h * Math.sin(ang + 0.5)}`} stroke={color} strokeWidth={width} fill="none" strokeLinecap="round" strokeLinejoin="round" />}
    </svg>
  );
};

export const ChalkUnderline: React.FC<{w: number; color?: string; progress?: number; style?: React.CSSProperties}> = ({w, color = C.yellow, progress = 1, style}) => (
  <svg width={w} height={18} style={{position: 'absolute', overflow: 'visible', ...style}}>
    <path d={`M3 10 Q ${w * 0.4} 4 ${w - 3} 9`} stroke={color} strokeWidth={4} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - progress} />
  </svg>
);

/** Rough width of a line of chalk text. */
export const textW = (s: string, size: number) => Array.from(s).reduce((n, ch) => n + (/[　-鿿＀-￯]/.test(ch) ? size : ch === ' ' ? size * 0.3 : size * 0.56), 0);

/** Coloured chalk label with an underline, for naming a column or a side. */
export const Tag: React.FC<{text: string; color?: string; size?: number; progress?: number; style?: React.CSSProperties}> = ({text, color = C.yellow, size = 40, progress = 1, style}) => (
  <div style={{position: 'relative', display: 'inline-block', fontSize: size, fontWeight: 700, color, whiteSpace: 'nowrap', lineHeight: 1.2, paddingBottom: 10, opacity: Math.min(1, progress * 2), ...style}}>
    {text}
    <ChalkUnderline w={textW(text, size) + 8} color={color} progress={ease(progress, 0.3, 1)} style={{left: -4, bottom: -2}} />
  </div>
);

/** Key word written large inside a chalk frame. */
export const KeyCard: React.FC<{text: string; size?: number; progress?: number; color?: string; style?: React.CSSProperties}> = ({text, size = 88, progress = 1, color = C.ink, style}) => {
  const w = textW(text, size) + size * 1.1, h = size * 1.75;
  return (
    <div style={{position: 'relative', width: w, height: h, ...style}}>
      <ChalkRect w={w} h={h} k={`key-${text}`} color={C.yellow} progress={progress} width={3.6} />
      <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size, fontWeight: 700, color, whiteSpace: 'nowrap', opacity: ease(progress, 0.2, 0.7)}}>{text}</div>
    </div>
  );
};

/** Pink chalk box drawn around the thing being talked about. Coordinates in px. */
export const MarkBox: React.FC<{x: number; y: number; w: number; h: number; progress: number; stroke?: number}> = ({x, y, w, h, progress, stroke = 4}) => (
  <ChalkRect w={w + 20} h={h + 16} k={`mark-${Math.round(x)}-${Math.round(y)}`} color={C.pink} progress={progress} width={stroke} style={{left: x - 10, top: y - 8}} />
);
