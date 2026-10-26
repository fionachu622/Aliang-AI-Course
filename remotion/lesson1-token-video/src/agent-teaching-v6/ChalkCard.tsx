import React from 'react';

// 粉笔手绘卡片容器：圆角手绘边框 + 同色淡填充，带粉笔式轻微不规则感。
// progress 用于"粉笔画出"渐显动画（pathLength=1 + dasharray）。
export function ChalkCard({
  x,
  y,
  w,
  h,
  color,
  fillOpacity = 0.055,
  strokeOpacity = 0.75,
  strokeWidth = 4,
  radius = 30,
  wobble = 3,
  progress = 1,
  doubleLine = false,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  fillOpacity?: number;
  strokeOpacity?: number;
  strokeWidth?: number;
  radius?: number;
  wobble?: number;
  progress?: number;
  doubleLine?: boolean;
}) {
  const p = Math.max(0, Math.min(1, progress));
  const d = `M${x + radius} ${y} Q${x + w * 0.5} ${y - wobble} ${x + w - radius} ${y} Q${x + w} ${y} ${x + w} ${y + radius} Q${x + w + wobble} ${y + h * 0.5} ${x + w} ${y + h - radius} Q${x + w} ${y + h} ${x + w - radius} ${y + h} Q${x + w * 0.5} ${y + h + wobble} ${x + radius} ${y + h} Q${x} ${y + h} ${x} ${y + h - radius} Q${x - wobble} ${y + h * 0.5} ${x} ${y + radius} Q${x} ${y} ${x + radius} ${y} Z`;
  return (
    <g opacity={p > 0 ? 1 : 0}>
      <path
        d={d}
        fill={color}
        fillOpacity={fillOpacity}
        stroke={color}
        strokeOpacity={strokeOpacity}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - p}
      />
      {doubleLine && (
        <path
          d={d}
          fill="none"
          stroke={color}
          strokeOpacity={strokeOpacity * 0.35}
          strokeWidth={1.2}
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - p}
          transform="translate(0 3)"
        />
      )}
    </g>
  );
}

// 估算粉笔文字宽度（与 ChalkText 同口径：全角=1，半角≈0.55）
export function textUnits(text: string): number {
  return [...text].reduce((acc, c) => acc + (/[\u0000-\u007f]/.test(c) ? 0.55 : 1), 0);
}

// 自适应文字字号：在宽度内放下
export function fitSize(text: string, maxWidth: number, maxSize: number): number {
  return Math.min(maxSize, Math.floor(maxWidth / Math.max(textUnits(text), 1)));
}
