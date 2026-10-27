// Visual language for the AI生成PPT course (v6), modelled on the reference explainer
// "从 LLM 到 Agent Skill": a flat warm-grey stage with a faint grain, flat dark panels,
// white bold type, yellow-green subtitles and arrows, green tags, red call-out boxes.
// No drop shadows, no glass, no gradients. Elements build up in step with the narration.
import React from 'react';
import {AbsoluteFill, Easing, interpolate} from 'remotion';

export const C = {
  bg: '#535154', // stage
  panel: '#3F3E41', // flat panels on the stage
  panelHi: '#4A494C',
  deep: '#2C2B2E', // keyword cards
  line: 'rgba(255,255,255,.16)',
  ink: '#FFFFFF',
  inkSoft: 'rgba(255,255,255,.66)',
  inkDim: 'rgba(255,255,255,.3)',
  accent: '#D2E01A', // subtitles, arrows, emphasis
  green: '#2E7A45', // tags
  blue: '#2D5E8C', // user message bubble
  red: '#E8473F', // call-out boxes
  dark: '#1C1B1D',
};

export const FONT = {
  sans: '"PingFang SC", "Noto Sans CJK SC", "Source Han Sans SC", "Microsoft YaHei", sans-serif',
  num: '"SF Pro Display", "Inter", "Helvetica Neue", "PingFang SC", sans-serif',
};

const clampOpt = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
/** Smooth ease-out (0 → 1). */
export const ease = (v: number, a: number, b: number) =>
  interpolate(v, [a, b], [0, 1], {...clampOpt, easing: Easing.bezier(0.22, 1, 0.36, 1)});
export const easeInOut = (v: number, a: number, b: number) =>
  interpolate(v, [a, b], [0, 1], {...clampOpt, easing: Easing.bezier(0.65, 0, 0.35, 1)});
/** Gentle settle with a very small overshoot. */
export const pop = (v: number, a: number, b: number) =>
  interpolate(v, [a, b], [0, 1], {...clampOpt, easing: Easing.bezier(0.3, 1.25, 0.6, 1)});
export const lerp = (p: number, a: number, b: number) => a + (b - a) * p;

const GRAIN = `url("data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.09 0"/></filter><rect width="240" height="240" filter="url(#n)"/></svg>',
)}")`;

/** Flat grey stage with a faint grain, behind every diagram. */
export const Stage: React.FC<{children?: React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{background: C.bg, color: C.ink, fontFamily: FONT.sans}}>
    <AbsoluteFill style={{backgroundImage: GRAIN, opacity: 0.9}} />
    {children}
  </AbsoluteFill>
);

/** Flat panel. */
export const Card: React.FC<{style?: React.CSSProperties; children?: React.ReactNode; radius?: number}> = ({style, children, radius = 18}) => (
  <div style={{position: 'absolute', background: C.panel, borderRadius: radius, overflow: 'hidden', ...style}}>{children}</div>
);

/** Small green (or other) label tag, as used on the reference diagrams. */
export const Tag: React.FC<{text: string; color?: string; size?: number; style?: React.CSSProperties}> = ({text, color = C.green, size = 30, style}) => (
  <div style={{display: 'inline-block', padding: `${size * 0.28}px ${size * 0.6}px`, borderRadius: 6, background: color, color: '#fff', fontSize: size, fontWeight: 800, whiteSpace: 'nowrap', lineHeight: 1.2, ...style}}>{text}</div>
);

/** Big keyword card: dark rounded block, white bold word. */
export const KeyCard: React.FC<{text: string; size?: number; style?: React.CSSProperties}> = ({text, size = 88, style}) => (
  <div style={{display: 'inline-block', padding: `${size * 0.32}px ${size * 0.62}px`, borderRadius: size * 0.26, background: C.deep, color: '#fff', fontSize: size, fontWeight: 900, lineHeight: 1.1, whiteSpace: 'nowrap', ...style}}>{text}</div>
);

/** Thin arrow that draws from (x1,y1) to (x2,y2). */
export const Arrow: React.FC<{x1: number; y1: number; x2: number; y2: number; progress: number; color?: string; width?: number; dashed?: boolean}> = ({x1, y1, x2, y2, progress, color = C.accent, width = 4, dashed}) => {
  if (progress < 0.01) return null;
  const len = Math.hypot(x2 - x1, y2 - y1);
  const ex = x1 + (x2 - x1) * progress, ey = y1 + (y2 - y1) * progress;
  const ang = Math.atan2(y2 - y1, x2 - x1);
  const h = 16;
  const p1 = [ex - h * Math.cos(ang - 0.45), ey - h * Math.sin(ang - 0.45)];
  const p2 = [ex - h * Math.cos(ang + 0.45), ey - h * Math.sin(ang + 0.45)];
  return (
    <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none'}} width={1} height={1}>
      <line x1={x1} y1={y1} x2={ex} y2={ey} stroke={color} strokeWidth={width} strokeLinecap="round" strokeDasharray={dashed ? '10 10' : undefined} />
      {len * progress > h && <path d={`M${p1[0]} ${p1[1]} L${ex} ${ey} L${p2[0]} ${p2[1]}`} stroke={color} strokeWidth={width} fill="none" strokeLinecap="round" strokeLinejoin="round" />}
    </svg>
  );
};

/** Red call-out box on top of media. Coordinates in px. */
export const MarkBox: React.FC<{x: number; y: number; w: number; h: number; progress: number; stroke?: number}> = ({x, y, w, h, progress, stroke = 5}) => (
  <div style={{position: 'absolute', left: x - 8, top: y - 6, width: w + 16, height: h + 12, borderRadius: 10, border: `${stroke}px solid ${C.red}`, opacity: Math.min(1, progress * 1.4), transform: `scale(${1.06 - 0.06 * progress})`}} />
);
