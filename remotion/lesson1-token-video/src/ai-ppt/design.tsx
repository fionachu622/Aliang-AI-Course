// Shared visual language for the AI生成PPT course.
// Follows the Lesson1ChalkboardV3 direction: charcoal chalkboard texture,
// hand-written chalk type, white line frames, a few blue / yellow / pink accents.
import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, staticFile} from 'remotion';

export const C = {
  board: '#24272A',
  boardDeep: '#1A1C1E',
  ink: '#F5F1E8',
  inkSoft: 'rgba(245,241,232,.62)',
  inkFaint: 'rgba(245,241,232,.28)',
  blue: '#7CC8EA',
  yellow: '#F0D26A',
  pink: '#F18D9E',
  green: '#A4D486',
};

export const FONT = {
  chalk: '"PPT Chalk", "HanziPen SC", "Kaiti SC", "STKaiti", serif',
  ui: '"PingFang SC", "Noto Sans CJK SC", "Microsoft YaHei", sans-serif',
};

const clampOpt = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const ease = (v: number, a: number, b: number) =>
  interpolate(v, [a, b], [0, 1], {...clampOpt, easing: Easing.bezier(0.22, 1, 0.36, 1)});
export const easeInOut = (v: number, a: number, b: number) =>
  interpolate(v, [a, b], [0, 1], {...clampOpt, easing: Easing.bezier(0.65, 0, 0.35, 1)});
export const lerp = (p: number, a: number, b: number) => a + (b - a) * p;

/** Chalkboard page. Same texture file as Lesson1ChalkboardV3. */
export const Board: React.FC<{children?: React.ReactNode; dim?: number}> = ({children, dim = 0}) => (
  <AbsoluteFill className="aippt-chalk" style={{background: C.board, color: C.ink, fontFamily: FONT.chalk}}>
    <Img src={staticFile('shared-visual/backgrounds/chalkboard/chalkboard.png')} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover'}} />
    <AbsoluteFill style={{background: `radial-gradient(circle at 50% 46%, rgba(0,0,0,0) 32%, rgba(0,0,0,${0.16 + dim}) 100%)`}} />
    {children}
  </AbsoluteFill>
);

/** Global CSS: chalk text gets the same faint stroke as V3. */
export const ChalkStyles: React.FC = () => (
  <style>{`
    .aippt-chalk .chalk{font-family:${FONT.chalk};font-weight:600;-webkit-text-stroke:.6px currentColor;paint-order:stroke fill;text-shadow:0 0 .6px rgba(255,255,255,.45)}
    *{box-sizing:border-box}
  `}</style>
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

/** Rough ellipse that overshoots its start, like a quick chalk circle. */
export const roughEllipsePath = (cx: number, cy: number, rx: number, ry: number, key: string) => {
  const s = seedOf(key);
  const n = 40;
  let d = '';
  for (let i = 0; i <= n + 6; i++) {
    const a = -Math.PI * 0.62 + (i / n) * Math.PI * 2;
    const wob = 1 + noise(i, s) * 0.035 + (i > n ? 0.07 : 0);
    d += `${i ? 'L' : 'M'}${(cx + Math.cos(a) * rx * wob).toFixed(1)} ${(cy + Math.sin(a) * ry * wob).toFixed(1)} `;
  }
  return d;
};

export const ChalkRect: React.FC<{w: number; h: number; color?: string; progress?: number; k?: string; width?: number; style?: React.CSSProperties; fill?: string}> = ({w, h, color = C.ink, progress = 1, k = 'r', width = 3.4, style, fill = 'none'}) => (
  <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{position: 'absolute', overflow: 'visible', ...style}}>
    {fill !== 'none' && <rect x={4} y={4} width={w - 8} height={h - 8} rx={10} fill={fill} opacity={progress > 0 ? 1 : 0} />}
    <path d={roughRectPath(w, h, k)} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - progress} />
    <path d={roughRectPath(w, h, k + 'b', 1.6, 9)} fill="none" stroke={color} strokeWidth={width * 0.34} opacity={0.26} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - progress} />
  </svg>
);

export const ChalkArrow: React.FC<{x: number; y: number; len: number; color?: string; progress?: number; vertical?: boolean}> = ({x, y, len, color = C.blue, progress = 1, vertical = false}) => (
  <svg style={{position: 'absolute', left: x, top: y, overflow: 'visible', transform: vertical ? 'rotate(90deg)' : undefined, transformOrigin: '0 0'}} width={len} height={40}>
    <path d={`M2 20 Q ${len / 2} ${16} ${len - 6} 20`} stroke={color} strokeWidth={3.2} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - progress} />
    <path d={`M${len - 22} 9 L${len - 5} 20 L${len - 23} 31`} stroke={color} strokeWidth={3.2} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={progress > 0.85 ? 1 : 0} />
  </svg>
);

export const ChalkUnderline: React.FC<{w: number; color?: string; progress?: number; style?: React.CSSProperties}> = ({w, color = C.yellow, progress = 1, style}) => (
  <svg width={w} height={18} style={{position: 'absolute', overflow: 'visible', ...style}}>
    <path d={`M3 10 Q ${w * 0.4} 4 ${w - 3} 9`} stroke={color} strokeWidth={4} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - progress} />
  </svg>
);

/** Small chalk label pinned to a frame corner. */
export const Tag: React.FC<{text: string; progress: number; x: number; y: number; color?: string}> = ({text, progress, x, y, color = C.yellow}) => {
  if (!text) return null;
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translateY(${(1 - progress) * 14}px) rotate(-1.2deg)`, opacity: progress}}>
      <div className="chalk" style={{position: 'relative', padding: '12px 26px 16px', fontSize: 38, color: C.ink, background: 'rgba(29,32,35,.94)', borderRadius: 10, boxShadow: '0 10px 26px rgba(0,0,0,.35)', whiteSpace: 'nowrap', fontFamily: FONT.chalk}}>
        {text}
        <ChalkUnderline w={Math.min(70 + text.length * 30, 420)} color={color} progress={ease(progress, 0.4, 1)} style={{left: 22, bottom: 6}} />
      </div>
    </div>
  );
};
