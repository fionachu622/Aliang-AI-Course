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
  coral: '#EFA884',
  muted: 'rgba(245,241,232,.56)',
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
// Snap to exact 0 / 1 outside the range, so "not started" really is 0 (bezier easing leaves ~1e-17).
const snap = (v: number, a: number, b: number, r: number) => (v <= a ? 0 : v >= b ? 1 : r);
export const ease = (v: number, a: number, b: number) =>
  snap(v, a, b, interpolate(v, [a, b], [0, 1], {...clampOpt, easing: Easing.bezier(0.22, 1, 0.36, 1)}));
export const easeInOut = (v: number, a: number, b: number) =>
  snap(v, a, b, interpolate(v, [a, b], [0, 1], {...clampOpt, easing: Easing.bezier(0.65, 0, 0.35, 1)}));
export const pop = (v: number, a: number, b: number) =>
  snap(v, a, b, interpolate(v, [a, b], [0, 1], {...clampOpt, easing: Easing.bezier(0.3, 1.25, 0.6, 1)}));
export const lerp = (p: number, a: number, b: number) => a + (b - a) * p;

/** Chalkboard page; text inside inherits the chalk lettering. */
export const Stage: React.FC<{children?: React.ReactNode; dim?: number}> = ({children, dim = 0}) => (
  <AbsoluteFill style={{background: C.board, color: C.ink, fontFamily: FONT.chalk, WebkitTextStroke: '.4px currentColor', textShadow: '0 0 .5px rgba(255,255,255,.45)'} as React.CSSProperties}>
    <Img src={staticFile('shared-visual/backgrounds/chalkboard/chalkboard.png')} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover'}} />
    <AbsoluteFill style={{background: `radial-gradient(circle at 50% 46%, rgba(0,0,0,0) 32%, rgba(0,0,0,${0.11 + dim}) 100%)`}} />
    {children}
  </AbsoluteFill>
);

// ---------- hand-drawn strokes ----------
const noise = (i: number, seed: number) => {
  const v = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453;
  return (v - Math.floor(v)) * 2 - 1;
};
const seedOf = (key: string) => Array.from(key).reduce((h, c) => (h * 31 + (c.codePointAt(0) ?? 0)) % 10007, 17);

// Same hand-drawn geometry as the token lesson (v9/VisualV9.tsx), copied so this course stays independent.
type Pt = {x: number; y: number};
const smooth = (pts: Pt[], close = false) => {
  if (close) {
    const last = pts[pts.length - 1], first = pts[0];
    let d = `M ${((last.x + first.x) / 2).toFixed(2)} ${((last.y + first.y) / 2).toFixed(2)}`;
    pts.forEach((p, i) => { const n = pts[(i + 1) % pts.length]; d += ` Q ${p.x.toFixed(2)} ${p.y.toFixed(2)} ${((p.x + n.x) / 2).toFixed(2)} ${((p.y + n.y) / 2).toFixed(2)}`; });
    return d + ' Z';
  }
  let d = `M ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)}`;
  for (let i = 1; i < pts.length - 1; i++) { const p = pts[i], n = pts[i + 1]; d += ` Q ${p.x.toFixed(2)} ${p.y.toFixed(2)} ${((p.x + n.x) / 2).toFixed(2)} ${((p.y + n.y) / 2).toFixed(2)}`; }
  const l = pts[pts.length - 1];
  return `${d} L ${l.x.toFixed(2)} ${l.y.toFixed(2)}`;
};
const linePts = (a: Pt, b: Pt, spacing: number) => {
  const n = Math.max(2, Math.ceil(Math.hypot(b.x - a.x, b.y - a.y) / spacing));
  return Array.from({length: n}, (_, i) => ({x: a.x + ((b.x - a.x) * i) / n, y: a.y + ((b.y - a.y) * i) / n}));
};
const arcPts = (c: Pt, r: number, a0: number, a1: number) => Array.from({length: 6}, (_, i) => { const a = a0 + ((a1 - a0) * i) / 6; return {x: c.x + Math.cos(a) * r, y: c.y + Math.sin(a) * r}; });

/** Rounded, slightly wobbly rectangle (radius 16), drawn `inset` px inside a w×h box. */
export const roughRectPath = (w: number, h: number, key: string, amp = 2.8, inset = 0, radius = 16) => {
  const seed = seedOf(key);
  const L = inset, T = inset, R = w - inset, B = h - inset;
  const r = Math.min(radius + 4, (R - L) / 3, (B - T) / 3);
  const base = [
    ...linePts({x: L + r, y: T}, {x: R - r, y: T}, 42), ...arcPts({x: R - r, y: T + r}, r, -Math.PI / 2, 0),
    ...linePts({x: R, y: T + r}, {x: R, y: B - r}, 36), ...arcPts({x: R - r, y: B - r}, r, 0, Math.PI / 2),
    ...linePts({x: R - r, y: B}, {x: L + r, y: B}, 42), ...arcPts({x: L + r, y: B - r}, r, Math.PI / 2, Math.PI),
    ...linePts({x: L, y: B - r}, {x: L, y: T + r}, 36), ...arcPts({x: L + r, y: T + r}, r, Math.PI, Math.PI * 1.5),
  ];
  return smooth(base.map((p, i) => ({x: p.x + noise(i * 2, seed) * amp, y: p.y + noise(i * 2 + 1, seed) * amp})), true);
};

/** Chalk frame that draws itself as progress goes 0 → 1. */
export const ChalkRect: React.FC<{w: number; h: number; color?: string; progress?: number; k?: string; width?: number; style?: React.CSSProperties; fill?: string}> = ({w, h, color = C.ink, progress = 1, k = 'r', width = 3.6, style, fill = 'none'}) => (
  <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none', ...style}}>
    {fill !== 'none' && <rect x={4} y={4} width={w - 8} height={h - 8} rx={18} fill={fill} opacity={Math.min(1, progress * 2)} />}
    <path d={roughRectPath(w, h, k)} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - progress} />
    <path d={roughRectPath(w, h, k + 'b', 1.9, 2)} fill="none" stroke={color} strokeWidth={Math.max(1.05, width * 0.33)} strokeLinecap="round" strokeLinejoin="round" opacity={0.26} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - progress} />
  </svg>
);

/** Frame at an absolute position. */
export const Frame: React.FC<{x: number; y: number; w: number; h: number; progress: number; color?: string; k: string; width?: number; fill?: string}> = ({x, y, w, h, progress, color, k, width, fill = C.panel}) => (
  <ChalkRect w={w} h={h} k={k} color={color} progress={progress} width={width} fill={fill} style={{left: x, top: y}} />
);

/** Media in a chalk frame (used for recordings shown on the board). */
export const Card: React.FC<{style?: React.CSSProperties; children?: React.ReactNode; radius?: number; k?: string; progress?: number; color?: string}> = ({style, children, radius = 10, k = 'card', progress = 1, color = C.ink}) => {
  const w = Number(style?.width ?? 0), h = Number(style?.height ?? 0);
  return (
    <div style={{position: 'absolute', ...style}}>
      <div style={{position: 'absolute', inset: 0, borderRadius: radius, overflow: 'hidden', background: '#000'}}>{children}</div>
      {w > 0 && h > 0 && <ChalkRect w={w + 28} h={h + 28} k={k} color={color} progress={progress} style={{left: -14, top: -14}} />}
    </div>
  );
};

/** Hand-drawn arrow from (x1,y1) to (x2,y2), same stroke as the token lesson's HandArrow. */
export const Arrow: React.FC<{x1: number; y1: number; x2: number; y2: number; progress: number; color?: string; width?: number; bend?: number}> = ({x1, y1, x2, y2, progress, color = C.blue, width = 4, bend = 4}) => {
  if (progress < 0.01) return null;
  const len = Math.hypot(x2 - x1, y2 - y1) || 1;
  const ux = (x2 - x1) / len, uy = (y2 - y1) / len, nx = -uy, ny = ux;
  const line = (seed: number, amp: number, b: number) => {
    const n = Math.max(6, Math.ceil(len / 32));
    return smooth(Array.from({length: n + 1}, (_, i) => {
      const t = i / n;
      const off = b * Math.sin(t * Math.PI) + Math.sin(t * Math.PI * 1.7) * 1.35 + (i === 0 || i === n ? 0 : noise(i, seed) * amp);
      return {x: x1 + (x2 - x1) * t + nx * off, y: y1 + (y2 - y1) * t + ny * off};
    }));
  };
  const h = 22, hw = 18;
  const head = `M ${x2 - ux * h + nx * hw + noise(1, 61) * 2} ${y2 - uy * h + ny * hw + noise(2, 61) * 2} L ${x2} ${y2} L ${x2 - ux * h - nx * hw + noise(3, 61) * 2} ${y2 - uy * h - ny * hw + noise(4, 61) * 2}`;
  return (
    <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none'}} width={1} height={1}>
      <path d={line(17, 1.65, bend)} stroke={color} strokeWidth={width} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - progress} />
      <path d={line(43, 1.15, bend + 2)} stroke={color} strokeWidth={1.3} fill="none" strokeLinecap="round" opacity={0.28} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - progress} />
      <path d={head} stroke={color} strokeWidth={width} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={ease(progress, 0.72, 0.92)} />
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
  <div style={{position: 'relative', display: 'inline-block', fontSize: size, color, whiteSpace: 'nowrap', lineHeight: 1.2, paddingBottom: 10, opacity: Math.min(1, progress * 2), ...style}}>
    {text}
    <ChalkUnderline w={textW(text, size) + 8} color={color} progress={ease(progress, 0.3, 1)} style={{left: -4, bottom: -2}} />
  </div>
);

/** Key word written large inside a chalk frame. */
export const KeyCard: React.FC<{text: string; size?: number; progress?: number; color?: string; style?: React.CSSProperties}> = ({text, size = 88, progress = 1, color = C.green, style}) => {
  const w = textW(text, size) + size * 1.1, h = size * 1.75;
  return (
    <div style={{position: 'relative', width: w, height: h, ...style}}>
      <ChalkRect w={w} h={h} k={`key-${text}`} color={color} progress={progress} />
      <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size, color, whiteSpace: 'nowrap', opacity: ease(progress, 0.2, 0.7)}}>{text}</div>
    </div>
  );
};

/** Pink chalk box drawn around the thing being talked about. Coordinates in px. */
export const MarkBox: React.FC<{x: number; y: number; w: number; h: number; progress: number; stroke?: number}> = ({x, y, w, h, progress, stroke = 4}) => (
  <ChalkRect w={w + 20} h={h + 16} k={`mark-${Math.round(x)}-${Math.round(y)}`} color={C.pink} progress={progress} width={stroke} style={{left: x - 10, top: y - 8}} />
);
