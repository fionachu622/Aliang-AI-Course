import type {CSSProperties, ReactNode} from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

export const v2Colors = {
  bg: '#02031A',
  bg2: '#070923',
  text: '#F6F4F7',
  muted: '#999BB3',
  faint: '#555A78',
  blue: '#10A9D2',
  cyan: '#19B4D7',
  coral: '#EF70A9',
  violet: '#7C8BE3',
  yellow: '#F4B21A',
  red: '#D95A6F',
  surface: 'rgba(7,9,35,.9)',
  line: 'rgba(112,122,178,.34)',
};

export const v2Fonts = {
  sans: '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
};

const clamp = {
  extrapolateLeft: 'clamp' as const,
  extrapolateRight: 'clamp' as const,
};

export const useEnter = (atSeconds: number, durationFrames = 18) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return interpolate(frame, [atSeconds * fps, atSeconds * fps + durationFrames], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
};

export const useExit = (durationSeconds: number) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return interpolate(frame, [(durationSeconds - 0.35) * fps, durationSeconds * fps], [1, 0], {
    ...clamp,
    easing: Easing.in(Easing.cubic),
  });
};

export const V2Background = ({children}: {children: ReactNode}) => (
  <AbsoluteFill
    style={{
      overflow: 'hidden',
      color: v2Colors.text,
      fontFamily: v2Fonts.sans,
      backgroundColor: v2Colors.bg,
      backgroundImage:
        'radial-gradient(circle at 50% 45%, rgba(32,43,96,.26), transparent 42%), linear-gradient(180deg, #02031A 0%, #03051E 100%)',
    }}
  >
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: '28%',
        opacity: 0.28,
        backgroundImage: 'radial-gradient(circle, rgba(120,132,194,.42) 1.3px, transparent 1.6px)',
        backgroundSize: '15px 15px',
        maskImage: 'linear-gradient(90deg, #000 0%, rgba(0,0,0,.8) 36%, transparent 100%)',
      }}
    />
    <div
      style={{
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        width: '28%',
        opacity: 0.28,
        backgroundImage: 'radial-gradient(circle, rgba(120,132,194,.42) 1.3px, transparent 1.6px)',
        backgroundSize: '15px 15px',
        maskImage: 'linear-gradient(270deg, #000 0%, rgba(0,0,0,.8) 36%, transparent 100%)',
      }}
    />
    {children}
  </AbsoluteFill>
);

export const ShotShell = ({
  index,
  total,
  chapter,
  durationSeconds,
  children,
}: {
  index: number;
  total: number;
  chapter: string;
  durationSeconds: number;
  children: ReactNode;
}) => {
  const exit = useExit(durationSeconds);
  return (
    <V2Background>
      <AbsoluteFill style={{opacity: exit}}>
        <div
          style={{
            position: 'absolute',
            top: 42,
            left: 72,
            fontSize: 20,
            fontWeight: 650,
            letterSpacing: 3,
            color: v2Colors.muted,
          }}
        >
          第 1 课 · {chapter}
        </div>
        <div
          style={{
            position: 'absolute',
            top: 42,
            right: 72,
            fontSize: 19,
            letterSpacing: 2,
            color: v2Colors.faint,
          }}
        >
          {String(index).padStart(2, '0')} / {total}
        </div>
        <AbsoluteFill
          style={{
            left: 92,
            right: 92,
            top: 100,
            bottom: 72,
            width: 'auto',
            height: 'auto',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {children}
        </AbsoluteFill>
        <div
          style={{
            position: 'absolute',
            left: 72,
            right: 72,
            bottom: 36,
            height: 4,
            borderRadius: 10,
            background: 'rgba(255,255,255,.08)',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${(index / total) * 100}%`,
              borderRadius: 10,
            background: `linear-gradient(90deg, ${v2Colors.blue}, ${v2Colors.coral})`,
            }}
          />
        </div>
      </AbsoluteFill>
    </V2Background>
  );
};

export const Appear = ({
  at,
  children,
  style,
  fromY = 24,
  scaleFrom = 0.98,
}: {
  at: number;
  children: ReactNode;
  style?: CSSProperties;
  fromY?: number;
  scaleFrom?: number;
}) => {
  const p = useEnter(at);
  return (
    <div
      style={{
        opacity: p,
        transform: `translateY(${(1 - p) * fromY}px) scale(${scaleFrom + (1 - scaleFrom) * p})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const FocusWord = ({
  children,
  color = v2Colors.text,
  size = 118,
  style,
}: {
  children: ReactNode;
  color?: string;
  size?: number;
  style?: CSSProperties;
}) => (
  <div
    style={{
      fontSize: size,
      lineHeight: 1.08,
      fontWeight: 850,
      letterSpacing: -2,
      color,
      textAlign: 'center',
      ...style,
    }}
  >
    {children}
  </div>
);

export const Subline = ({children, style}: {children: ReactNode; style?: CSSProperties}) => (
  <div
    style={{
      fontSize: 34,
      lineHeight: 1.35,
      fontWeight: 620,
      color: v2Colors.muted,
      textAlign: 'center',
      ...style,
    }}
  >
    {children}
  </div>
);

export const Bubble = ({
  children,
  color = v2Colors.blue,
  style,
}: {
  children: ReactNode;
  color?: string;
  style?: CSSProperties;
}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 72,
      padding: '10px 28px',
      borderRadius: 8,
      border: `2px solid ${color}`,
      backgroundColor: v2Colors.bg2,
      backgroundImage: `repeating-linear-gradient(135deg, ${color}24 0, ${color}24 2px, transparent 2px, transparent 8px)`,
      color: v2Colors.text,
      fontSize: 34,
      fontWeight: 750,
      whiteSpace: 'nowrap',
      ...style,
    }}
  >
    {children}
  </div>
);

export const BigNode = ({
  children,
  color,
  style,
}: {
  children: ReactNode;
  color: string;
  style?: CSSProperties;
}) => (
  <div
    style={{
      minWidth: 230,
      minHeight: 132,
      padding: '22px 34px',
      borderRadius: 10,
      border: `3px solid ${color}`,
      backgroundColor: v2Colors.bg2,
      backgroundImage: `repeating-linear-gradient(135deg, ${color}20 0, ${color}20 2px, transparent 2px, transparent 9px)`,
      boxShadow: `0 18px 54px rgba(0,0,0,.26), 0 0 28px ${color}12`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      fontSize: 40,
      lineHeight: 1.2,
      fontWeight: 800,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Arrow = ({color = v2Colors.yellow, width = 110}: {color?: string; width?: number}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, 16], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  return (
    <svg width={width} height="60" viewBox={`0 0 ${width} 60`} style={{overflow: 'visible'}}>
      <path
        d={`M 4 30 L ${width - 22} 30`}
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={width}
        strokeDashoffset={width * (1 - progress)}
      />
      <path
        d={`M ${width - 38} 14 L ${width - 18} 30 L ${width - 38} 46`}
        fill="none"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={progress}
      />
    </svg>
  );
};

export const TokenPiece = ({
  text,
  id,
  color = v2Colors.blue,
  large = false,
}: {
  text: string;
  id?: string;
  color?: string;
  large?: boolean;
}) => (
  <div
    style={{
      minWidth: large ? 102 : 74,
      minHeight: large ? 92 : 68,
      padding: large ? '12px 20px' : '8px 14px',
      borderRadius: large ? 9 : 7,
      border: `2px solid ${color}`,
      backgroundColor: v2Colors.bg2,
      backgroundImage: `repeating-linear-gradient(135deg, ${color}20 0, ${color}20 2px, transparent 2px, transparent 8px)`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      lineHeight: 1.05,
    }}
  >
    <span style={{fontSize: large ? 36 : 27, fontWeight: 800, color}}>{text}</span>
    {id ? <span style={{fontSize: large ? 16 : 13, color: v2Colors.muted, marginTop: 8}}>{id}</span> : null}
  </div>
);

export const CenterStack = ({children, gap = 30, style}: {children: ReactNode; gap?: number; style?: CSSProperties}) => (
  <div
    style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap,
      ...style,
    }}
  >
    {children}
  </div>
);
