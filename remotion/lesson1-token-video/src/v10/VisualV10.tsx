import type {CSSProperties, ReactNode} from 'react';
import {interpolate} from 'remotion';
import {
  HandUnderline,
  Layer,
  Paper,
  ease,
  useV9SceneFrame,
  v9Colors,
} from '../v9/VisualV9';

const clamp = {
  extrapolateLeft: 'clamp' as const,
  extrapolateRight: 'clamp' as const,
};

export const VisualScene = ({
  title,
  children,
}: {
  title: ReactNode;
  children: ReactNode;
}) => {
  const frame = useV9SceneFrame();
  return (
    <Paper>
      <Layer
        amount={ease(frame, 0, 18)}
        fromY={-16}
        style={{
          position: 'absolute',
          left: 120,
          right: 120,
          top: 62,
          textAlign: 'center',
          fontSize: 78,
          lineHeight: 1.12,
          letterSpacing: 2,
        }}
      >
        {title}
      </Layer>
      {children}
    </Paper>
  );
};

export const DrawPath = ({
  d,
  progress,
  color = v9Colors.ink,
  strokeWidth = 4,
  opacity = 1,
  fill = 'none',
  style,
}: {
  d: string;
  progress: number;
  color?: string;
  strokeWidth?: number;
  opacity?: number;
  fill?: string;
  style?: CSSProperties;
}) => (
  <path
    d={d}
    fill={fill}
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    pathLength={1}
    strokeDasharray={1}
    strokeDashoffset={1 - progress}
    opacity={opacity}
    style={style}
  />
);

export const ChalkArrow = ({
  d,
  head,
  progress,
  color = v9Colors.blue,
  strokeWidth = 4,
}: {
  d: string;
  head: string;
  progress: number;
  color?: string;
  strokeWidth?: number;
}) => (
  <>
    <DrawPath d={d} progress={progress} color={color} strokeWidth={strokeWidth} />
    <DrawPath
      d={head}
      progress={ease(progress, 0.72, 0.2)}
      color={color}
      strokeWidth={strokeWidth}
    />
  </>
);

export const TokenPiece = ({
  children,
  amount,
  color = v9Colors.blue,
  style,
  fontSize = 42,
}: {
  children: ReactNode;
  amount: number;
  color?: string;
  style?: CSSProperties;
  fontSize?: number;
}) => (
  <Layer amount={amount} fromY={12} fromScale={0.86} style={style}>
    <div
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 62,
        padding: '9px 14px 14px',
        fontSize,
        lineHeight: 1,
        color: v9Colors.ink,
        background: `${color}20`,
        borderRadius: '45% 55% 48% 52% / 58% 45% 55% 42%',
      }}
    >
      {children}
      <HandUnderline
        width={Math.max(54, String(children).length * fontSize * 0.86)}
        progress={amount}
        color={color}
        style={{position: 'absolute', left: '50%', bottom: -6, transform: 'translateX(-50%)'}}
      />
    </div>
  </Layer>
);

export const BigTakeaway = ({
  children,
  amount,
  color = v9Colors.yellow,
  width = 760,
  fontSize = 76,
}: {
  children: ReactNode;
  amount: number;
  color?: string;
  width?: number;
  fontSize?: number;
}) => (
  <Layer
    amount={amount}
    fromScale={0.9}
    style={{position: 'absolute', left: 0, right: 0, top: 800, textAlign: 'center'}}
  >
    <div style={{position: 'relative', display: 'inline-block', fontSize, lineHeight: 1.1}}>
      {children}
      <HandUnderline
        width={width}
        progress={amount}
        color={color}
        style={{position: 'absolute', left: '50%', bottom: -30, transform: 'translateX(-50%)'}}
      />
    </div>
  </Layer>
);

export const ChalkLabel = ({
  children,
  amount,
  color = v9Colors.ink,
  style,
  fontSize = 42,
}: {
  children: ReactNode;
  amount: number;
  color?: string;
  style?: CSSProperties;
  fontSize?: number;
}) => (
  <Layer amount={amount} fromY={14} style={style}>
    <div style={{fontSize, lineHeight: 1.2, color}}>{children}</div>
  </Layer>
);

export const moving = (
  frame: number,
  input: [number, number],
  output: [number, number],
) => interpolate(frame, input, output, clamp);

export const pulse = (frame: number, from: number, duration: number) => {
  const phase = moving(frame, [from, from + duration], [0, Math.PI * 2]);
  return Math.sin(phase) * 0.5 + 0.5;
};

export {ease, useV9SceneFrame, v9Colors};
