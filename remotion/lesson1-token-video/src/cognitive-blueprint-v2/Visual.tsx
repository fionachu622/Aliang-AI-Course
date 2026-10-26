import {createContext, useContext} from 'react';
import type {CSSProperties, ReactNode} from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {BLUEPRINT_V2_SCENES} from './storyboard';

export const bp = {
  canvas: '#F5F9FE',
  white: '#FFFFFF',
  ink: '#15223F',
  muted: '#667590',
  blue: '#3478F6',
  blueBright: '#75B8FF',
  blueSoft: '#E6F0FF',
  green: '#20AA76',
  greenSoft: '#DFF5EC',
  coral: '#FF7467',
  coralSoft: '#FFF0EC',
  yellow: '#E8A92E',
  yellowSoft: '#FFF4D7',
  line: '#C9D8E9',
  grid: '#DCE8F5',
};

export const bpFonts = {
  display:
    '"Alibaba PuHuiTi 2.0", "Hiragino Sans GB", "PingFang SC", sans-serif',
  utility: '"IBM Plex Mono", "SFMono-Regular", monospace',
};

const ease = Easing.bezier(0.16, 1, 0.3, 1);

const BlueprintFrameContext = createContext<number | null>(null);

export const BlueprintTimingProvider = ({
  designDuration,
  actualDuration,
  children,
}: {
  designDuration: number;
  actualDuration: number;
  children: ReactNode;
}) => {
  const frame = useCurrentFrame();
  return (
    <BlueprintFrameContext.Provider
      value={(frame / Math.max(1, actualDuration - 1)) * (designDuration - 1)}
    >
      {children}
    </BlueprintFrameContext.Provider>
  );
};

export const useBlueprintFrame = () => {
  const rawFrame = useCurrentFrame();
  const synchronizedFrame = useContext(BlueprintFrameContext);
  return synchronizedFrame ?? rawFrame;
};

export const reveal = (frame: number, start: number, duration = 22) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: ease,
  });

export const enter = (
  frame: number,
  start: number,
  distance = 26,
  scaleFrom = 0.96,
): CSSProperties => {
  const p = reveal(frame, start);
  return {
    opacity: p,
    transform: `translateY(${(1 - p) * distance}px) scale(${interpolate(
      p,
      [0, 1],
      [scaleFrom, 1],
    )})`,
  };
};

export const BlueprintBackground = () => {
  const frame = useCurrentFrame();
  const drift = interpolate(frame, [0, 300], [0, 12], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{overflow: 'hidden', backgroundColor: bp.canvas}}>
      <div
        style={{
          position: 'absolute',
          inset: -40,
          backgroundImage: `radial-gradient(${bp.grid} 1.6px, transparent 1.6px)`,
          backgroundSize: '36px 36px',
          opacity: 0.72,
          transform: `translate(${drift}px, ${drift * 0.45}px)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 520,
          height: 520,
          borderRadius: '50%',
          right: -160,
          top: -330,
          background: bp.blueSoft,
          opacity: 0.92,
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 410,
          height: 410,
          borderRadius: '50%',
          left: -145,
          bottom: -275,
          background: bp.coralSoft,
          opacity: 0.92,
        }}
      />
      <svg
        width="1920"
        height="1080"
        viewBox="0 0 1920 1080"
        style={{position: 'absolute', inset: 0, opacity: 0.38}}
      >
        {Array.from({length: 15}, (_, i) => (
          <line
            key={`v-${i}`}
            x1={120 + i * 120}
            x2={120 + i * 120}
            y1={118}
            y2={962}
            stroke={bp.grid}
            strokeWidth="1"
          />
        ))}
        {Array.from({length: 7}, (_, i) => (
          <line
            key={`h-${i}`}
            x1="82"
            x2="1838"
            y1={180 + i * 120}
            y2={180 + i * 120}
            stroke={bp.grid}
            strokeWidth="1"
          />
        ))}
      </svg>
    </AbsoluteFill>
  );
};

export const SceneShell = ({
  index,
  eyebrow,
  title,
  duration,
  children,
}: {
  index: number;
  eyebrow: string;
  title: string;
  duration: number;
  children: ReactNode;
}) => {
  const frame = useBlueprintFrame();
  const intro = reveal(frame, 0, 10);
  const outro = interpolate(frame, [duration - 14, duration], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.in(Easing.cubic),
  });

  return (
    <AbsoluteFill
      style={{
        fontFamily: bpFonts.display,
        color: bp.ink,
        opacity: intro * outro,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 72,
          right: 72,
          top: 46,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            fontSize: 23,
            fontWeight: 800,
          }}
        >
          <span
            style={{width: 12, height: 12, borderRadius: '50%', background: bp.blue}}
          />
          第 1 课 · AI 工作原理
        </div>
        <div
          style={{
            fontFamily: bpFonts.utility,
            color: bp.muted,
            fontSize: 20,
            letterSpacing: 2,
          }}
        >
          {String(index + 1).padStart(2, '0')} / {BLUEPRINT_V2_SCENES.length}
        </div>
      </div>

      <div style={{position: 'absolute', left: 80, right: 80, top: 96}}>
        <div style={{...enter(frame, 4, 12), textAlign: 'center'}}>
          <div
            style={{
              fontSize: 24,
              lineHeight: 1,
              color: bp.blue,
              fontWeight: 800,
              letterSpacing: 2,
              marginBottom: 13,
            }}
          >
            {eyebrow}
          </div>
          <div
            style={{
              fontSize: 62,
              lineHeight: 1.12,
              fontWeight: 850,
              letterSpacing: -2,
            }}
          >
            {title}
          </div>
        </div>
      </div>

      <div style={{position: 'absolute', inset: '250px 72px 84px'}}>{children}</div>

      <div
        style={{
          position: 'absolute',
          left: 72,
          right: 72,
          bottom: 46,
          height: 5,
          borderRadius: 999,
          background: '#DDE7F2',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${((index + 1) / BLUEPRINT_V2_SCENES.length) * 100}%`,
            height: '100%',
            borderRadius: 999,
            background: bp.blue,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

export const BlueprintLabel = ({
  children,
  color = bp.blue,
  background = bp.blueSoft,
  style,
}: {
  children: ReactNode;
  color?: string;
  background?: string;
  style?: CSSProperties;
}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 999,
      padding: '10px 20px',
      background,
      color,
      fontSize: 22,
      lineHeight: 1,
      fontWeight: 800,
      ...style,
    }}
  >
    {children}
  </div>
);

export const TokenBox = ({
  children,
  color,
  width,
  start,
  style,
}: {
  children: ReactNode;
  color: string;
  width: number;
  start: number;
  style?: CSSProperties;
}) => {
  const frame = useBlueprintFrame();
  return (
    <div
      style={{
        ...enter(frame, start, 18, 0.92),
        width,
        height: 100,
        borderRadius: 18,
        border: `3px solid ${color}`,
        background: bp.white,
        display: 'grid',
        placeItems: 'center',
        color,
        fontSize: 36,
        fontWeight: 850,
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const DrawArrow = ({
  start,
  color = bp.blue,
  width = 190,
}: {
  start: number;
  color?: string;
  width?: number;
}) => {
  const frame = useBlueprintFrame();
  const p = reveal(frame, start, 20);
  return (
    <svg width={width} height="80" viewBox={`0 0 ${width} 80`} aria-hidden="true">
      <path
        d={`M 8 40 H ${width - 22}`}
        fill="none"
        stroke={bp.line}
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d={`M 8 40 H ${width - 22}`}
        fill="none"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
        pathLength="1"
        strokeDasharray="1"
        strokeDashoffset={1 - p}
      />
      <path
        d={`M ${width - 42} 22 L ${width - 20} 40 L ${width - 42} 58`}
        fill="none"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={p}
      />
    </svg>
  );
};

export const Conclusion = ({
  start,
  children,
  color = bp.ink,
  background = bp.white,
  fontSize = 28,
}: {
  start: number;
  children: ReactNode;
  color?: string;
  background?: string;
  fontSize?: number;
}) => {
  const frame = useBlueprintFrame();
  return (
    <div
      style={{
        ...enter(frame, start, 18, 0.96),
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 66,
        borderRadius: 999,
        padding: '0 38px',
        background,
        color,
        fontSize,
        fontWeight: 850,
        boxShadow: '0 16px 42px rgba(66, 101, 145, 0.12)',
      }}
    >
      {children}
    </div>
  );
};
