import React from 'react';
import {Easing, interpolate, spring} from 'remotion';
import accents from './presenter-accents.json';

export const presenterCameraScale = (seconds: number) => {
  const cue = accents.find((item) => seconds >= item.start && seconds < item.end);
  if (!cue) return 1;
  const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)} as const;
  const enter = interpolate(seconds, [cue.start, cue.start + 0.45], [0, 1], clamp);
  const leave = interpolate(seconds, [cue.end - 0.4, cue.end], [0, 1], clamp);
  return 1 + 0.035 * enter * (1 - leave);
};

// Keep the presenter and burned-in subtitles unobstructed: accents occupy the
// empty monitor-side area and disappear after the spoken emphasis.
export const PresenterAccent: React.FC<{seconds: number}> = ({seconds}) => {
  const cue = accents.find((item) => seconds >= item.start && seconds < item.end);
  if (!cue) return null;
  const frame = (seconds - cue.start) * 30;
  const amount = spring({frame, fps: 30, config: {damping: 22, stiffness: 170, mass: 0.8}});
  const out = interpolate(seconds, [cue.end - 0.18, cue.end], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const color = {blue: '#9AD6EC', green: '#C4E4A1', yellow: '#F4D184'}[cue.color] ?? '#F4D184';
  const width = Math.min(620, Math.max(360, cue.text.length * 51 + 56));
  return <svg width="1920" height="1080" viewBox="0 0 1920 1080"
    style={{position: 'absolute', inset: 0, pointerEvents: 'none'}} aria-label={cue.text}>
    <g transform={`translate(84 ${255 + (1 - amount) * 26})`} opacity={amount * out}>
      <rect width={width} height="104" rx="10" fill="#1F292D" fillOpacity="0.9" />
      <path d="M0 14 V90" stroke={color} strokeWidth="7" strokeLinecap="round" />
      <text x="28" y="68" fill="#FFF8E9" fontSize="48" fontWeight="700"
        fontFamily="PingFang SC, sans-serif">{cue.text}</text>
      <path d={`M29 91 Q${width / 2} 83 ${width - 30} 90`} fill="none" stroke={color}
        strokeWidth="4" strokeLinecap="round" pathLength="1" strokeDasharray="1"
        strokeDashoffset={1 - Math.min(1, Math.max(0, (frame - 7) / 15))} />
    </g>
  </svg>;
};
