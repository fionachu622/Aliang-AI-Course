import {createContext, useContext} from 'react';
import type {CSSProperties, ReactNode} from 'react';
import {useMotionTreatment} from './MotionTreatment';
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
  geometric: '"Songti SC", "STSong", "SimSun", serif',
  utility: '"IBM Plex Mono", "SFMono-Regular", monospace',
};

export type V9VisualStyle = 'hand' | 'geometric';

const VisualBackgroundContext = createContext({
  backgroundFile: 'shared-visual/backgrounds/chalkboard/chalkboard.png',
  contentScale: 1,
  contentTransformOrigin: 'top center',
  contentTranslate: '116.8px 75.6px',
  suppressZeroProgressStrokes: false,
  handFontFamily: v9Fonts.hand,
  showBoxFinePrint: true,
  showContextRecap: true,
  showSceneNumbers: true,
  visualStyle: 'hand' as V9VisualStyle,
});

export const VisualBackgroundProvider = ({
  backgroundFile,
  contentScale = 1,
  contentTransformOrigin = 'top center',
  contentTranslate = '116.8px 75.6px',
  suppressZeroProgressStrokes = false,
  handFontFamily = v9Fonts.hand,
  showBoxFinePrint = true,
  showContextRecap = true,
  showSceneNumbers = true,
  visualStyle = 'hand',
  children,
}: {
  backgroundFile: string;
  contentScale?: number;
  contentTransformOrigin?: string;
  contentTranslate?: string;
  suppressZeroProgressStrokes?: boolean;
  handFontFamily?: string;
  showBoxFinePrint?: boolean;
  showContextRecap?: boolean;
  showSceneNumbers?: boolean;
  visualStyle?: V9VisualStyle;
  children: ReactNode;
}) => (
  <VisualBackgroundContext.Provider
    value={{
      backgroundFile,
      contentScale,
      contentTransformOrigin,
      contentTranslate,
      suppressZeroProgressStrokes,
      handFontFamily,
      showBoxFinePrint,
      showContextRecap,
      showSceneNumbers,
      visualStyle,
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

export type V9SceneTimingAnchor = {
  frame: number;
  designFrame: number;
};

const SceneTimingContext = createContext<{
  designDurationInFrames: number;
  durationInFrames: number;
  timingAnchors?: readonly V9SceneTimingAnchor[];
} | null>(null);

export const V9SceneTimingProvider = ({
  designDurationInFrames,
  durationInFrames,
  timingAnchors,
  children,
}: {
  designDurationInFrames: number;
  durationInFrames: number;
  timingAnchors?: readonly V9SceneTimingAnchor[];
  children: ReactNode;
}) => (
  <SceneTimingContext.Provider
    value={{designDurationInFrames, durationInFrames, timingAnchors}}
  >
    {children}
  </SceneTimingContext.Provider>
);

export const useV9SceneFrame = () => {
  const frame = useCurrentFrame();
  const timing = useContext(SceneTimingContext);

  if (!timing) return frame;

  if (timing.timingAnchors && timing.timingAnchors.length >= 2) {
    const anchors = timing.timingAnchors;
    const first = anchors[0];
    const last = anchors[anchors.length - 1];

    if (frame <= first.frame) return first.designFrame;
    if (frame >= last.frame) return last.designFrame;

    const nextIndex = anchors.findIndex((anchor) => frame <= anchor.frame);
    const previous = anchors[Math.max(0, nextIndex - 1)];
    const next = anchors[nextIndex];

    return interpolate(
      frame,
      [previous.frame, next.frame],
      [previous.designFrame, next.designFrame],
      clamp,
    );
  }

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
  const motion = useMotionTreatment();
  const {
    backgroundFile,
    contentScale,
    contentTransformOrigin,
    contentTranslate,
    handFontFamily,
    visualStyle,
  } = useContext(VisualBackgroundContext);

  return (
    <AbsoluteFill
  style={{
    overflow: 'hidden',
    color: v9Colors.ink,
    fontFamily:
      visualStyle === 'geometric' ? v9Fonts.geometric : handFontFamily,
    fontWeight: visualStyle === 'geometric' ? 600 : undefined,
    backgroundColor: motion?.externalBackground ? 'transparent' : v9Colors.paper,
    textShadow:
      visualStyle === 'geometric'
        ? '0 1px 16px rgba(0,0,0,.16)'
        : '0 0 .5px rgba(255,255,255,.45)',
  }}
  from={-730}>
      {!motion?.externalBackground ? <Img
        src={staticFile(backgroundFile)}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      /> : null}
      {!motion?.externalBackground ? <AbsoluteFill
  style={{
    background:
      'radial-gradient(circle at 50% 48%, rgba(0,0,0,0) 30%, rgba(0,0,0,.11) 100%)',
  }}
  from={-1140} /> : null}
      <AbsoluteFill
style={{
transform: `scale(${contentScale})`,
transformOrigin: contentTransformOrigin,
translate: contentTranslate
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
  motionVisibility,
  fromX = 0,
  fromY = 22,
  fromScale = 0.96,
}: {
  amount: number;
  children: ReactNode;
  style?: CSSProperties;
  /** Independent dim/exit multiplier; used only by an opt-in motion treatment. */
  motionVisibility?: number;
  fromX?: number;
  fromY?: number;
  fromScale?: number;
}) => {
  const motion = useMotionTreatment();
  const motionStyle = motion?.layerStyle({amount, fromX, fromY, fromScale});
  return <div
    style={{
      opacity: amount,
      transform: `translate(${(1 - amount) * fromX}px, ${(1 - amount) * fromY}px) scale(${fromScale + amount * (1 - fromScale)})`,
      ...motionStyle,
      ...style,
      ...(motion && motionVisibility !== undefined
        ? {opacity: Number(motionStyle?.opacity ?? amount) * motionVisibility}
        : {}),
    }}
  >
    {children}
  </div>;
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
  const {visualStyle, suppressZeroProgressStrokes} = useContext(
    VisualBackgroundContext,
  );
  const strokeVisible = !suppressZeroProgressStrokes || progress > 0.001;

  if (visualStyle === 'geometric') {
    const inset = 12;
    const corner = 38;
    const frameStroke = Math.max(2.4, strokeWidth * 0.76);
    return (
      <div style={{position: 'relative', width, height, ...style}}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          width={width}
          height={height}
          style={{position: 'absolute', inset: 0, overflow: 'visible'}}
        >
          <rect
            x={inset}
            y={inset}
            width={width - inset * 2}
            height={height - inset * 2}
            rx={Math.max(8, radius)}
            fill="rgba(245,241,232,.018)"
            stroke={color}
            strokeWidth={frameStroke}
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - progress}
          />
          <path
            d={`M ${inset} ${inset + corner} V ${inset} H ${inset + corner} M ${width - inset - corner} ${inset} H ${width - inset} V ${inset + corner} M ${width - inset} ${height - inset - corner} V ${height - inset} H ${width - inset - corner} M ${inset + corner} ${height - inset} H ${inset} V ${height - inset - corner}`}
            fill="none"
            stroke={color}
            strokeWidth={frameStroke + 1.8}
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - progress}
            opacity={0.72}
          />
        </svg>
        {children}
      </div>
    );
  }

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
          opacity={strokeVisible ? 1 : 0}
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
          opacity={strokeVisible ? 0.24 + (seed % 4) * 0.02 : 0}
        />
      </svg>
      {children}
    </div>
  );
};

export const HandArrow = ({
  width,
  progress: originalProgress,
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
  const motion = useMotionTreatment();
  const progress = motion?.strokeProgress(originalProgress) ?? originalProgress;
  const {visualStyle, suppressZeroProgressStrokes} = useContext(
    VisualBackgroundContext,
  );
  const strokeVisible = !suppressZeroProgressStrokes || progress > 0.001;
  const h = 100;
  const mid = h / 2;

  if (visualStyle === 'geometric') {
    const end = width - 30;
    const controlY = mid + bend * 0.45;
    return (
      <svg
        width={width}
        height={h}
        viewBox={`0 0 ${width} ${h}`}
        style={{overflow: 'visible', ...style}}
      >
        <rect
          x="7"
          y={mid - 4}
          width="8"
          height="8"
          fill={color}
          opacity={progress}
        />
        <path
          d={`M 15 ${mid} Q ${width / 2} ${controlY} ${end} ${mid}`}
          fill="none"
          stroke={color}
          strokeWidth={3.2}
          strokeLinecap="square"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - progress}
        />
        <path
          d={`M ${end - 17} ${mid - 13} L ${end} ${mid} L ${end - 17} ${mid + 13}`}
          fill="none"
          stroke={color}
          strokeWidth={3.2}
          strokeLinecap="square"
          strokeLinejoin="miter"
          opacity={ease(progress, 0.72, 0.2)}
        />
      </svg>
    );
  }

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
        opacity={strokeVisible ? 1 : 0}
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
        opacity={strokeVisible ? 0.28 : 0}
      />
      {motion?.tracePen && progress > 0.03 && progress < 0.97 ? (
        <path
          d={roughArrowPath(width, bend, 17, 1.65)}
          fill="none"
          stroke={color}
          strokeWidth={7}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray="0.09 0.91"
          strokeDashoffset={0.09 - progress}
        />
      ) : null}
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
  progress: originalProgress,
  color = v9Colors.magenta,
  style,
}: {
  width: number;
  progress: number;
  color?: string;
  style?: CSSProperties;
}) => {
  const motion = useMotionTreatment();
  const progress = motion?.strokeProgress(originalProgress) ?? originalProgress;
  const {visualStyle, suppressZeroProgressStrokes} = useContext(
    VisualBackgroundContext,
  );
  const strokeVisible = !suppressZeroProgressStrokes || progress > 0.001;

  if (visualStyle === 'geometric') {
    const end = width - 15;
    return (
      <svg width={width} height={30} viewBox={`0 0 ${width} 30`} style={style}>
        <rect x="4" y="12" width="8" height="8" fill={color} opacity={progress} />
        <path
          d={`M 12 16 H ${end}`}
          fill="none"
          stroke={color}
          strokeWidth={6}
          strokeLinecap="butt"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - progress}
        />
        <rect
          x={end - 5}
          y="11"
          width="10"
          height="10"
          fill={color}
          opacity={ease(progress, 0.76, 0.18)}
          transform={`rotate(45 ${end} 16)`}
        />
      </svg>
    );
  }

  return (
    <svg width={width} height={30} viewBox={`0 0 ${width} 30`} style={style}>
      {motion?.tracePen && progress > 0.03 && progress < 0.97 ? (
        <path
          d={roughUnderlinePath(width, 23, 1.85, 16)}
          fill="none"
          stroke={color}
          strokeWidth={7}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray="0.09 0.91"
          strokeDashoffset={0.09 - progress}
        />
      ) : null}
      <path
      d={roughUnderlinePath(width, 23, 1.85, 16)}
      fill="none"
      stroke={color}
      strokeWidth={4}
      strokeLinecap="round"
      pathLength={1}
      strokeDasharray={1}
      strokeDashoffset={1 - progress}
      opacity={strokeVisible ? 1 : 0}
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
      opacity={strokeVisible ? 0.28 : 0}
    />
    </svg>
  );
};

export const Highlight = ({
  progress,
  color = v9Colors.yellow,
  style,
}: {
  progress: number;
  color?: string;
  style?: CSSProperties;
}) => {
  const {visualStyle} = useContext(VisualBackgroundContext);
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: '50%',
        width: `${progress * 100}%`,
        height: visualStyle === 'geometric' ? '58%' : '64%',
        borderRadius: visualStyle === 'geometric' ? 4 : '45% 54% 43% 51%',
        background: color,
        opacity: visualStyle === 'geometric' ? 0.18 : 0.26,
        transform:
          visualStyle === 'geometric'
            ? 'translateY(-42%)'
            : 'translateY(-42%) rotate(-1deg)',
        transformOrigin: 'left center',
        filter: visualStyle === 'geometric' ? undefined : 'blur(1px)',
        clipPath:
          visualStyle === 'geometric'
            ? 'polygon(0 0, 96% 0, 100% 50%, 96% 100%, 0 100%)'
            : 'polygon(0 19%, 7% 8%, 19% 15%, 31% 4%, 44% 13%, 57% 7%, 70% 16%, 84% 5%, 100% 18%, 98% 84%, 85% 91%, 72% 83%, 58% 94%, 43% 86%, 29% 95%, 14% 84%, 2% 91%)',
        ...style,
      }}
    />
  );
};

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
  const {visualStyle} = useContext(VisualBackgroundContext);
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
          background:
            visualStyle === 'geometric'
              ? 'linear-gradient(90deg, #1D2023 0%, #24272A 52%, #1D2023 100%)'
              : v9Colors.paperDeep,
          transform:
            visualStyle === 'geometric'
              ? `translateX(${x}px)`
              : `translateX(${x}px) rotate(-4deg)`,
          boxShadow:
            visualStyle === 'geometric'
              ? '-28px 0 58px rgba(124,200,234,.08), 28px 0 58px rgba(0,0,0,.42)'
              : '-28px 0 42px rgba(235,235,225,.08), 28px 0 54px rgba(0,0,0,.38)',
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
            visualStyle === 'geometric'
              ? v9Colors.blue
              : 'repeating-linear-gradient(90deg, rgba(245,241,232,.04) 0 2px, rgba(245,241,232,.22) 3px 5px, transparent 6px 10px)',
          opacity: 0.8,
          filter: visualStyle === 'geometric' ? 'blur(.5px)' : 'blur(2px)',
          transform: visualStyle === 'geometric' ? undefined : 'rotate(-4deg)',
        }}
      />
    </AbsoluteFill>
  );
};
