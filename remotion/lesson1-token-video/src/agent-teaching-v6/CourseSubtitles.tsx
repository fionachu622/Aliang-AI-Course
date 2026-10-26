import type {Caption} from '@remotion/captions';
import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import captions from './course-subtitles.json';

// Subtitles use a neutral sans serif, independently of the chalkboard lettering.
const subtitleFont = '"PingFang SC", "Microsoft YaHei", "Noto Sans CJK SC", sans-serif';

const lines: (Caption & {bakedInMaster: boolean})[] = captions;

/** Subtitles follow the edited narration master, independently of legacy visual cues. */
export const CourseSubtitles: React.FC<{presenterVisible: boolean}> = ({presenterVisible}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  // Compare on the frame grid to avoid a rounded millisecond delaying an entry.
  let low = 0;
  let high = lines.length - 1;
  let index = -1;
  while (low <= high) {
    const mid = (low + high) >>> 1;
    if (Math.round(lines[mid].startMs * fps / 1000) <= frame) {
      index = mid;
      low = mid + 1;
    } else high = mid - 1;
  }
  const line = lines[index];
  if (!line || (presenterVisible && line.bakedInMaster) || frame >= Math.round(line.endMs * fps / 1000)) return null;
  return <svg width={1920} height={1080} viewBox="0 0 1920 1080"
    data-course-subtitle={line.text} aria-label={line.text}
    style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
    {/* Match native caption styling; lesson pages retain their reserved subtitle strip. */}
    <text x={960} y={presenterVisible ? 954 : 1022} textAnchor="middle" fontFamily={subtitleFont}
      fontWeight={400} fontSize={56} fill="#FFFFFF"
      style={{filter: 'drop-shadow(0 2px 2px rgba(0,0,0,.45))'}}>
      {line.text}
    </text>
  </svg>;
};
