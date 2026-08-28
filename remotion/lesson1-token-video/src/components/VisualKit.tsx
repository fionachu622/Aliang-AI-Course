import {createContext, useContext, type CSSProperties, type ReactNode} from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {colors, fonts} from '../theme';
import {frameAt} from '../timeline';

const TimingScaleContext = createContext(1);

export const PaperBackground = ({children}: {children: ReactNode}) => {
  return (
    <AbsoluteFill
      style={{
        overflow: 'hidden',
        color: colors.ink,
        fontFamily: fonts.body,
        backgroundColor: colors.paper,
        backgroundImage:
          'radial-gradient(ellipse at 78% 12%, rgba(62,68,80,.16), transparent 38%), radial-gradient(ellipse at 24% 88%, rgba(40,44,52,.13), transparent 35%), linear-gradient(rgba(255,255,255,.034) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.030) 1px, transparent 1px)',
        backgroundSize: 'auto, auto, 118px 118px, 118px 118px',
        backgroundPosition: '0 0, 0 0, 0 0, 0 0',
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

const MotionIn = ({children, style}: {children: ReactNode; style?: CSSProperties}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, 14], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        opacity: progress,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const RevealAt = ({
  at,
  children,
  style,
}: {
  at: number;
  children: ReactNode;
  style?: CSSProperties;
}) => {
  const timingScale = useContext(TimingScaleContext);
  return (
    <Sequence from={frameAt(at * timingScale)} layout="none">
      <MotionIn style={style}>{children}</MotionIn>
    </Sequence>
  );
};

export const SceneHeader = ({
  index,
  title,
  eyebrow,
}: {
  index: number;
  title: string;
  eyebrow: string;
}) => (
  <div style={{position: 'absolute', left: 92, top: 58, right: 92}}>
    <div
      style={{
        fontSize: 23,
        letterSpacing: 3,
        color: colors.muted,
        fontWeight: 650,
      }}
    >
      第 1 课 · {String(index).padStart(2, '0')} / 10 · {eyebrow}
    </div>
    <div
      style={{
        marginTop: 14,
        fontFamily: fonts.hand,
        fontSize: 64,
        fontWeight: 700,
        lineHeight: 1.08,
      }}
    >
      {title}
    </div>
  </div>
);

export const SceneProgress = ({index}: {index: number}) => (
  <div
    style={{
      position: 'absolute',
      left: 92,
      right: 92,
      bottom: 48,
      height: 8,
      borderRadius: 20,
      overflow: 'hidden',
      background: 'rgba(255,255,255,.10)',
    }}
  >
    <div
      style={{
        width: `${index * 10}%`,
        height: '100%',
        borderRadius: 20,
        background: colors.blue,
      }}
    />
  </div>
);

export const Card = ({
  children,
  accent = colors.blue,
  style,
}: {
  children: ReactNode;
  accent?: string;
  style?: CSSProperties;
}) => (
  <div
    style={{
      position: 'relative',
      border: `2px solid ${colors.line}`,
      borderRadius: 30,
      background: 'rgba(31,33,37,.92)',
      boxShadow: '0 20px 55px rgba(0,0,0,.28)',
      padding: '34px 38px 34px 48px',
      ...style,
    }}
  >
    <div
      style={{
        position: 'absolute',
        left: 18,
        top: 28,
        bottom: 28,
        width: 8,
        borderRadius: 8,
        background: accent,
      }}
    />
    {children}
  </div>
);

export const Pill = ({
  children,
  color = colors.blue,
  ghost = false,
  style,
}: {
  children: ReactNode;
  color?: string;
  ghost?: boolean;
  style?: CSSProperties;
}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 52,
      padding: '8px 22px',
      borderRadius: 18,
      border: `2px solid ${color}`,
      background: ghost ? colors.surface : color,
      color: ghost ? colors.ink : colors.surfaceStrong,
      fontWeight: 750,
      fontSize: 28,
      lineHeight: 1.2,
      ...style,
    }}
  >
    {children}
  </div>
);

export const MarkerText = ({
  children,
  color = colors.yellowSoft,
}: {
  children: ReactNode;
  color?: string;
}) => {
  const frame = useCurrentFrame();
  const width = interpolate(frame, [3, 18], [0, 100], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <span style={{position: 'relative', display: 'inline-block', zIndex: 0}}>
      <span
        style={{
          position: 'absolute',
          zIndex: -1,
          left: -6,
          bottom: 2,
          width: `${width}%`,
          height: '42%',
          background: color,
          transform: 'rotate(-1.2deg)',
          borderRadius: 5,
        }}
      />
      {children}
    </span>
  );
};

export const FlowArrow = ({width = 110}: {width?: number}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, 18], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <svg width={width} height="48" viewBox={`0 0 ${width} 48`}>
      <path
        d={`M 4 24 L ${width - 16} 24`}
        stroke={colors.muted}
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray={width}
        strokeDashoffset={width * (1 - progress)}
      />
      <path
        d={`M ${width - 31} 11 L ${width - 13} 24 L ${width - 31} 37`}
        fill="none"
        stroke={colors.muted}
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={progress}
      />
    </svg>
  );
};

export const BigTakeaway = ({children, style}: {children: ReactNode; style?: CSSProperties}) => (
  <div
    style={{
      position: 'absolute',
      left: 190,
      right: 190,
      bottom: 115,
      textAlign: 'center',
      fontFamily: fonts.hand,
      fontSize: 43,
      fontWeight: 700,
      lineHeight: 1.3,
      color: colors.ink,
      ...style,
    }}
  >
    {children}
  </div>
);

export const SceneShell = ({
  index,
  title,
  eyebrow,
  timingScale = 1,
  children,
}: {
  index: number;
  title: string;
  eyebrow: string;
  timingScale?: number;
  children: ReactNode;
}) => (
  <TimingScaleContext.Provider value={timingScale}>
    <PaperBackground>
      <SceneHeader index={index} title={title} eyebrow={eyebrow} />
      {children}
      <SceneProgress index={index} />
    </PaperBackground>
  </TimingScaleContext.Provider>
);
