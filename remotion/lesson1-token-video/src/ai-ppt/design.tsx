// Visual language for the AI生成PPT course (v5): a clean, light "studio" look
// used by current tutorial channels — warm off-white stage, floating white cards with
// soft shadows, bold sans type, one blue accent plus highlighter yellow, springy pop-ins.
import React from 'react';
import {AbsoluteFill, Easing, interpolate} from 'remotion';

export const C = {
  bg: '#F4F2EC',
  ink: '#14161A',
  inkSoft: '#5E636B',
  inkFaint: 'rgba(20,22,26,.12)',
  card: '#FFFFFF',
  blue: '#2F6BFF',
  blueSoft: '#E6EDFF',
  orange: '#FF6B3D',
  yellow: '#FFD84D',
  green: '#16B27A',
  dark: '#15171B',
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
/** Springy pop with a small overshoot, for chips and cards. */
export const pop = (v: number, a: number, b: number) =>
  interpolate(v, [a, b], [0, 1], {...clampOpt, easing: Easing.bezier(0.34, 1.56, 0.64, 1)});
export const lerp = (p: number, a: number, b: number) => a + (b - a) * p;

/** The stage behind every non-presenter shot: warm paper, soft colour glows, faint dot grid. */
export const Stage: React.FC<{children?: React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{background: C.bg, color: C.ink, fontFamily: FONT.sans}}>
    <AbsoluteFill style={{background: 'radial-gradient(900px 600px at 8% 0%, rgba(47,107,255,.10), transparent 70%), radial-gradient(900px 700px at 100% 100%, rgba(255,107,61,.09), transparent 70%)'}} />
    <AbsoluteFill style={{backgroundImage: 'radial-gradient(rgba(20,22,26,.07) 1.4px, transparent 1.5px)', backgroundSize: '30px 30px'}} />
    {children}
  </AbsoluteFill>
);

/** Floating white card with a soft shadow. */
export const Card: React.FC<{style?: React.CSSProperties; children?: React.ReactNode; radius?: number}> = ({style, children, radius = 24}) => (
  <div style={{position: 'absolute', background: C.card, borderRadius: radius, boxShadow: '0 2px 6px rgba(20,24,40,.06), 0 28px 70px rgba(20,24,40,.16)', border: '1px solid rgba(20,22,26,.06)', overflow: 'hidden', ...style}}>{children}</div>
);

/** Dark pill label with a coloured dot. Pops in. */
export const Chip: React.FC<{text: string; progress: number; x: number; y: number; color?: string; anchor?: 'left' | 'right'}> = ({text, progress, x, y, color = C.blue, anchor = 'left'}) => {
  if (!text) return null;
  return (
    <div style={{position: 'absolute', [anchor]: x, top: y, transform: `scale(${0.6 + 0.4 * progress})`, transformOrigin: anchor === 'left' ? '0 50%' : '100% 50%', opacity: Math.min(1, progress * 1.6)}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '14px 26px 14px 20px', borderRadius: 999, background: C.dark, color: '#fff', fontSize: 34, fontWeight: 700, letterSpacing: 0.5, whiteSpace: 'nowrap', boxShadow: '0 12px 30px rgba(20,24,40,.28)'}}>
        <span style={{width: 14, height: 14, borderRadius: 7, background: color, boxShadow: `0 0 0 5px ${color}33`}} />
        {text}
      </div>
    </div>
  );
};

/** Small step navigator: 5 segments, the current one filled. */
export const StepNav: React.FC<{chapter: string; progress: number}> = ({chapter, progress}) => {
  const m = chapter.match(/^0(\d) (.+)$/);
  if (!m) return null;
  const cur = Number(m[1]);
  return (
    <div style={{position: 'absolute', right: 70, top: 26, display: 'flex', alignItems: 'center', gap: 14, opacity: progress, fontFamily: FONT.sans}}>
      <div style={{fontSize: 24, fontWeight: 700, color: C.inkSoft, letterSpacing: 1}}>STEP {cur}/5</div>
      <div style={{display: 'flex', gap: 6}}>
        {[1, 2, 3, 4, 5].map((i) => <div key={i} style={{width: i === cur ? 40 : 18, height: 8, borderRadius: 4, background: i < cur ? 'rgba(47,107,255,.35)' : i === cur ? C.blue : C.inkFaint}} />)}
      </div>
      <div style={{fontSize: 26, fontWeight: 800, color: C.ink}}>{m[2]}</div>
    </div>
  );
};

/** Highlight on top of media: translucent yellow marker plus a rounded blue outline. Coordinates in px. */
export const MarkBox: React.FC<{x: number; y: number; w: number; h: number; progress: number; stroke?: number}> = ({x, y, w, h, progress, stroke = 4}) => (
  <div style={{position: 'absolute', left: x - 8, top: y - 6, width: w + 16, height: h + 12, borderRadius: 12, background: `rgba(255,216,77,${0.32 * progress})`, mixBlendMode: 'multiply'}}>
    <div style={{position: 'absolute', inset: -stroke, borderRadius: 14, border: `${stroke}px solid ${C.orange}`, opacity: progress, transform: `scale(${1.08 - 0.08 * progress})`}} />
  </div>
);
