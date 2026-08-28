import {createContext, useContext} from 'react';
import type {CSSProperties, ReactNode} from 'react';
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from 'remotion';

export const v9Colors = {
  paper: '#24272A',
  paperDeep: '#1D2023',
  ink: '#F5F1E8',
  blue: '#7CC8EA',
  magenta: '#F18D9E',
  green: '#A4D486',
  yellow: '#F0D26A',
  coral: '#EFA884',
  muted: 'rgba(245, 241, 232, 0.56)',
  paleBlue: '#B9DDEA',
};

export const v9Fonts = {
  hand: '"HanziPen SC", "Kaiti SC", "STKaiti", serif',
};

const VisualBackgroundContext = createContext({
  backgroundFile: 'shared-visual/backgrounds/chalkboard/chalkboard.png',
  contentScale: 1,
  showBoxFinePrint: true,
  showContextRecap: true,
  showSceneNumbers: true,
});

export type V9MotionStyle = 'legacy' | 'apple';

const VisualMotionContext = createContext<V9MotionStyle>('legacy');

export const VisualMotionProvider = ({
  style,
  children,
}: {
  style: V9MotionStyle;
  children: ReactNode;
}) => (
  <VisualMotionContext.Provider value={style}>
    {children}
  </VisualMotionContext.Provider>
);

export const VisualBackgroundProvider = ({
  backgroundFile,
  contentScale = 1,
  showBoxFinePrint = true,
  showContextRecap = true,
  showSceneNumbers = true,
  children,
}: {
  backgroundFile: string;
  contentScale?: number;
  showBoxFinePrint?: boolean;
  showContextRecap?: boolean;
  showSceneNumbers?: boolean;
  children: ReactNode;
}) => (
  <VisualBackgroundContext.Provider
    value={{
      backgroundFile,
      contentScale,
      showBoxFinePrint,
      showContextRecap,
      showSceneNumbers,
    }}
  >
    {children}
  </VisualBackgroundContext.Provider>
);

export const BoxFinePrint = ({children}: {children: ReactNode}) => {
  const {showBoxFinePrint} = useContext(VisualBackgroundContext);
  return showBoxFinePrint ? <>{children}</> : null;
};

export const useVisualOptions = () => useContext(VisualBackgroundContext);

const clamp = {
  extrapolateLeft: 'clamp' as const,
  extrapolateRight: 'clamp' as const,
};

const SceneTimingContext = createContext<{
  designDurationInFrames: number;
  durationInFrames: number;
} | null>(null);

export const V9SceneTimingProvider = ({
  designDurationInFrames,
  durationInFrames,
  children,
}: {
  designDurationInFrames: number;
  durationInFrames: number;
  children: ReactNode;
}) => (
  <SceneTimingContext.Provider
    value={{designDurationInFrames, durationInFrames}}
  >
    {children}
  </SceneTimingContext.Provider>
);

export const useV9SceneFrame = () => {
  const frame = useCurrentFrame();
  const timing = useContext(SceneTimingContext);

  if (!timing) return frame;

  return interpolate(
    frame,
    [0, Math.max(1, timing.durationInFrames - 1)],
    [0, Math.max(1, timing.designDurationInFrames - 1)],
    clamp,
  );
};

type Point = {x: number; y: number};

const seededNoise = (index: number, seed: number) => {
  const value = Math.sin(index * 12.9898 + seed * 78.233) * 43758.5453;
  return (value - Math.floor(value)) * 2 - 1;
};

const stableSeed = (key: string) =>
  Array.from(key).reduce(
    (hash, character) => (hash * 31 + (character.codePointAt(0) ?? 0)) % 10007,
    17,
  );

const pointsToPath = (points: Point[], close = false) =>
  `${points
    .map((point, index) =>
      `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`,
    )
    .join(' ')}${close ? ' Z' : ''}`;

const pointsToSmoothPath = (points: Point[], close = false) => {
  if (points.length < 3) return pointsToPath(points, close);
  if (close) {
    const last = points[points.length - 1];
    const first = points[0];
    let path = `M ${((last.x + first.x) / 2).toFixed(2)} ${((last.y + first.y) / 2).toFixed(2)}`;
    points.forEach((point, index) => {
      const next = points[(index + 1) % points.length];
      path += ` Q ${point.x.toFixed(2)} ${point.y.toFixed(2)} ${((point.x + next.x) / 2).toFixed(2)} ${((point.y + next.y) / 2).toFixed(2)}`;
    });
    return `${path} Z`;
  }
  let path = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;
  for (let index = 1; index < points.length - 1; index++) {
    const point = points[index];
    const next = points[index + 1];
    path += ` Q ${point.x.toFixed(2)} ${point.y.toFixed(2)} ${((point.x + next.x) / 2).toFixed(2)} ${((point.y + next.y) / 2).toFixed(2)}`;
  }
  const last = points[points.length - 1];
  return `${path} L ${last.x.toFixed(2)} ${last.y.toFixed(2)}`;
};

const linePoints = (from: Point, to: Point, spacing: number) => {
  const distance = Math.hypot(to.x - from.x, to.y - from.y);
  const count = Math.max(2, Math.ceil(distance / spacing));
  return Array.from({length: count}, (_, index) => {
    const t = index / count;
    return {
      x: from.x + (to.x - from.x) * t,
      y: from.y + (to.y - from.y) * t,
    };
  });
};

const arcPoints = (
  center: Point,
  radius: number,
  fromAngle: number,
  toAngle: number,
) =>
  Array.from({length: 6}, (_, index) => {
    const t = index / 6;
    const angle = fromAngle + (toAngle - fromAngle) * t;
    return {
      x: center.x + Math.cos(angle) * radius,
      y: center.y + Math.sin(angle) * radius,
    };
  });

const roughRectPath = (
  width: number,
  height: number,
  radius: number,
  seed: number,
  amplitude: number,
  inset = 12,
) => {
  const left = inset;
  const top = inset;
  const right = width - inset;
  const bottom = height - inset;
  const r = Math.min(radius + 4, (right - left) / 3, (bottom - top) / 3);
  const base = [
    ...linePoints({x: left + r, y: top}, {x: right - r, y: top}, 42),
    ...arcPoints({x: right - r, y: top + r}, r, -Math.PI / 2, 0),
    ...linePoints({x: right, y: top + r}, {x: right, y: bottom - r}, 36),
    ...arcPoints({x: right - r, y: bottom - r}, r, 0, Math.PI / 2),
    ...linePoints({x: right - r, y: bottom}, {x: left + r, y: bottom}, 42),
    ...arcPoints({x: left + r, y: bottom - r}, r, Math.PI / 2, Math.PI),
    ...linePoints({x: left, y: bottom - r}, {x: left, y: top + r}, 36),
    ...arcPoints({x: left + r, y: top + r}, r, Math.PI, Math.PI * 1.5),
  ];
  const jittered = base.map((point, index) => ({
    x: point.x + seededNoise(index * 2, seed) * amplitude,
    y: point.y + seededNoise(index * 2 + 1, seed) * amplitude,
  }));
  return pointsToSmoothPath(jittered, true);
};

const roughUnderlinePath = (
  width: number,
  seed: number,
  amplitude: number,
  baseY: number,
) => {
  const count = Math.max(5, Math.ceil((width - 10) / 34));
  const points = Array.from({length: count + 1}, (_, index) => {
    const t = index / count;
    return {
      x: 5 + (width - 10) * t,
      y:
        baseY +
        Math.sin(t * Math.PI * 1.35) * 1.15 +
        seededNoise(index, seed) * amplitude,
    };
  });
  return pointsToSmoothPath(points);
};

const roughArrowPath = (
  width: number,
  bend: number,
  seed: number,
  amplitude: number,
) => {
  const startX = 10;
  const endX = width - 29;
  const count = Math.max(6, Math.ceil((endX - startX) / 32));
  const points = Array.from({length: count + 1}, (_, index) => {
    const t = index / count;
    return {
      x: startX + (endX - startX) * t,
      y:
        50 +
        bend * Math.cos(t * Math.PI) * 0.62 +
        Math.sin(t * Math.PI * 1.7) * 1.35 +
        seededNoise(index, seed) * amplitude,
    };
  });
  return pointsToSmoothPath(points);
};

export const ease = (
  frame: number,
  from: number,
  duration = 18,
) =>
  interpolate(frame, [from, from + duration], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

export const easeInOut = (
  frame: number,
  from: number,
  duration = 24,
) =>
  interpolate(frame, [from, from + duration], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.45, 0, 0.55, 1),
  });

export const fadeOut = (frame: number, from: number, duration = 16) =>
  1 - ease(frame, from, duration);

export const Paper = ({children}: {children: ReactNode}) => {
  const {backgroundFile, contentScale} = useContext(VisualBackgroundContext);

  return (
    <AbsoluteFill
      style={{
        overflow: 'hidden',
        color: v9Colors.ink,
        fontFamily: v9Fonts.hand,
        backgroundColor: v9Colors.paper,
        textShadow: '0 0 .5px rgba(255,255,255,.45)',
      }}
    >
      <Img
        src={staticFile(backgroundFile)}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(circle at 50% 48%, rgba(0,0,0,0) 30%, rgba(0,0,0,.11) 100%)',
        }}
      />
      <AbsoluteFill
        style={{
          transform: `scale(${contentScale})`,
          transformOrigin: 'top center',
        }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const Layer = ({
  amount,
  children,
  style,
  fromX = 0,
  fromY = 22,
  fromScale = 0.96,
}: {
  amount: number;
  children: ReactNode;
  style?: CSSProperties;
  fromX?: number;
  fromY?: number;
  fromScale?: number;
}) => {
  const motionStyle = useContext(VisualMotionContext);
  const motionRestraint = motionStyle === 'apple' ? 0.46 : 1;
  const restrainedFromScale =
    1 - (1 - fromScale) * motionRestraint;

  return (
    <div
      style={{
        opacity: amount,
        transform: `translate(${(1 - amount) * fromX * motionRestraint}px, ${(1 - amount) * fromY * motionRestraint}px) scale(${restrainedFromScale + amount * (1 - restrainedFromScale)})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const RoughBox = ({
  width,
  height,
  color = v9Colors.ink,
  progress,
  strokeWidth = 3.6,
  radius = 16,
  seedKey = 'default-box',
  style,
  children,
}: {
  width: number;
  height: number;
  color?: string;
  progress: number;
  strokeWidth?: number;
  radius?: number;
  seedKey?: string;
  style?: CSSProperties;
  children?: ReactNode;
}) => {
  const seed = stableSeed(seedKey);
  const primaryAmplitude = 2.62 + (seed % 7) * 0.13;
  const returnAmplitude = 1.76 + (seed % 5) * 0.12;
  const returnInset = 13 + (seed % 3);
  const primary = roughRectPath(
    width,
    height,
    radius,
    seed,
    primaryAmplitude,
  );
  const returnStroke = roughRectPath(
    width,
    height,
    radius,
    seed + 43,
    returnAmplitude,
    returnInset,
  );
  return (
    <div style={{position: 'relative', width, height, ...style}}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        style={{position: 'absolute', inset: 0, overflow: 'visible'}}
      >
        <path
          d={primary}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - progress}
        />
        <path
          d={returnStroke}
          fill="none"
          stroke={color}
          strokeWidth={Math.max(1.05, strokeWidth * 0.33)}
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - progress}
          opacity={0.24 + (seed % 4) * 0.02}
        />
      </svg>
      {children}
    </div>
  );
};

export const HandArrow = ({
  width,
  progress,
  color = v9Colors.blue,
  style,
  bend = 0,
}: {
  width: number;
  progress: number;
  color?: string;
  style?: CSSProperties;
  bend?: number;
}) => {
  const h = 100;
  const mid = h / 2;
  return (
    <svg
      width={width}
      height={h}
      viewBox={`0 0 ${width} ${h}`}
      style={{overflow: 'visible', ...style}}
    >
      <path
        d={roughArrowPath(width, bend, 17, 1.65)}
        fill="none"
        stroke={color}
        strokeWidth={4}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - progress}
      />
      <path
        d={roughArrowPath(width - 8, bend + 2, 43, 1.15)}
        fill="none"
        stroke={color}
        strokeWidth={1.3}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - progress}
        opacity={0.28}
      />
      <path
        d={`M ${width - 58 + seededNoise(1, 61) * 2} ${mid - 18 + seededNoise(2, 61) * 2} L ${width - 27} ${mid + 1} L ${width - 57 + seededNoise(3, 61) * 2} ${mid + 19 + seededNoise(4, 61) * 2}`}
        fill="none"
        stroke={color}
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={ease(progress, 0.72, 0.2)}
      />
    </svg>
  );
};

export const HandUnderline = ({
  width,
  progress,
  color = v9Colors.magenta,
  style,
}: {
  width: number;
  progress: number;
  color?: string;
  style?: CSSProperties;
}) => (
  <svg width={width} height={30} viewBox={`0 0 ${width} 30`} style={style}>
      <path
      d={roughUnderlinePath(width, 23, 1.85, 16)}
      fill="none"
      stroke={color}
      strokeWidth={4}
      strokeLinecap="round"
      pathLength={1}
      strokeDasharray={1}
      strokeDashoffset={1 - progress}
    />
    <path
      d={roughUnderlinePath(width, 47, 1.25, 19)}
      fill="none"
      stroke={color}
      strokeWidth={1.25}
      strokeLinecap="round"
      pathLength={1}
      strokeDasharray={1}
      strokeDashoffset={1 - progress}
      opacity={0.28}
    />
  </svg>
);

export const Highlight = ({
  progress,
  color = v9Colors.yellow,
  style,
}: {
  progress: number;
  color?: string;
  style?: CSSProperties;
}) => (
  <div
    style={{
      position: 'absolute',
      left: 0,
      top: '50%',
      width: `${progress * 100}%`,
      height: '64%',
      borderRadius: '45% 54% 43% 51%',
      background: color,
      opacity: 0.26,
      transform: 'translateY(-42%) rotate(-1deg)',
      transformOrigin: 'left center',
      filter: 'blur(1px)',
      clipPath:
        'polygon(0 19%, 7% 8%, 19% 15%, 31% 4%, 44% 13%, 57% 7%, 70% 16%, 84% 5%, 100% 18%, 98% 84%, 85% 91%, 72% 83%, 58% 94%, 43% 86%, 29% 95%, 14% 84%, 2% 91%)',
      ...style,
    }}
  />
);

export const SceneNumber = ({current, total = 14}: {current: number; total?: number}) => {
  const {showSceneNumbers} = useContext(VisualBackgroundContext);

  if (!showSceneNumbers) return null;

  return (
    <div
      style={{
        position: 'absolute',
        right: 76,
        bottom: 48,
        color: v9Colors.muted,
        fontSize: 28,
        letterSpacing: 3,
        opacity: 0.72,
      }}
    >
      {String(current).padStart(2, '0')} / {String(total).padStart(2, '0')}
    </div>
  );
};

export const PaperWipe = () => {
  const frame = useCurrentFrame();
  const x = interpolate(frame, [0, 11, 23], [-2100, 0, 2100], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  return (
    <AbsoluteFill style={{pointerEvents: 'none', overflow: 'hidden'}}>
      <div
        style={{
          position: 'absolute',
          left: -240,
          top: -180,
          width: 2400,
          height: 1440,
          background: v9Colors.paperDeep,
          transform: `translateX(${x}px) rotate(-4deg)`,
          boxShadow:
            '-28px 0 42px rgba(235,235,225,.08), 28px 0 54px rgba(0,0,0,.38)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: x - 38,
          top: 0,
          width: 24,
          height: '100%',
          background:
            'repeating-linear-gradient(90deg, rgba(245,241,232,.04) 0 2px, rgba(245,241,232,.22) 3px 5px, transparent 6px 10px)',
          opacity: 0.8,
          filter: 'blur(2px)',
          transform: 'rotate(-4deg)',
        }}
      />
    </AbsoluteFill>
  );
};
