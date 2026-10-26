import {Easing, interpolate} from 'remotion';
import type {CSSProperties} from 'react';
import type {LayerMotionInput} from '../v9/MotionTreatment';

export const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
export const outCubic = (value: number) => 1 - (1 - clamp01(value)) ** 3;

/** Some design windows span several narration seconds. Use their envelope
 * directly: clear blur early without moving cue onsets or using playback history.
 */
export const readingProgress = (amount: number) => outCubic(amount);

// Adapted from BlurSlide.tsx: a shared p closes all three channels together.
export const readingLayerStyle = ({
  amount,
  fromX,
  fromY,
}: LayerMotionInput): CSSProperties => {
  const p = readingProgress(amount);
  return {
    opacity: p,
    transform: `translate(${(1 - p) * fromX}px, ${(1 - p) * fromY}px)`,
    filter: p >= 1 ? undefined : `blur(${(1 - p) * 10}px)`,
  };
};

export const SHOTCRAFT_TREATMENT = {
  layerStyle: readingLayerStyle,
  strokeProgress: readingProgress,
  tracePen: true,
  externalBackground: true,
};

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// C-variant curves: 16f / 2f stagger. The outgoing final state holds after
// the boundary; the next scene's true cue clock starts at the original boundary.
export const focusHandoff = (
  frame: number,
  duration: number,
  enter: boolean,
  exit: boolean,
) => {
  const a = exit
    ? interpolate(
        frame,
        [duration, duration + 16],
        [0, 1],
        {
          ...clamp,
          easing: Easing.bezier(0.45, 0, 0.3, 1),
        },
      )
    : 0;
  const b = enter
    ? interpolate(frame, [2, 18], [0, 1], {
        ...clamp,
        easing: Easing.bezier(0.3, 0, 0.2, 1),
      })
    : 1;
  return {
    opacity: (1 - a) * b,
    filter: a === 0 && b === 1 ? undefined : `blur(${8 * (a + 1 - b)}px)`,
    transform: `translateX(${-a * 60 - (1 - b) * 50}px)`,
  } satisfies CSSProperties;
};
