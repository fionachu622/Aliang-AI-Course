import React from 'react';

const clamp = (v: number) => Math.max(0, Math.min(1, v));
const enter = (frame: number, at = 0, duration = 24) => 1 - Math.pow(1 - clamp((frame - at) / duration), 3);

// The parent freezes this clock during expansion and gates each original cue.
export const FeeIllustration: React.FC<{index: number; frame: number; color: string}> = ({index, frame, color}) => {
  const p = enter(frame);
  const ink = {fill: 'none', stroke: '#F5F1E8', strokeWidth: 2.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
  const accent = {...ink, stroke: color};
  const draw = {pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - p};
  return <g transform="translate(77 27) scale(1 .87)">
    <path d="M28 62 Q100 65 174 61" {...accent} opacity={.15}/>
    {index === 0 && <>
      <path {...accent} d="M57 29 Q97 26 139 29 L137 62 Q96 66 59 62Z" fill={color} fillOpacity={.18}/>
      <path {...accent} d="M51 20 Q96 17 145 20 L144 31 Q94 33 52 31Z" fill={color} fillOpacity={.35}/>
      <path d="M92 20 L92 62 M105 20 L105 62" {...ink} opacity={.85}/>
      <path d="M98 19 C78 18 73 5 84 5 Q96 5 98 19 C101 3 116 1 119 9 Q123 19 98 19" {...accent}/>
      <g opacity={enter(frame, 8)} transform={`translate(158 13) scale(${.65 + .35 * p})`}>
        <path d="M0 -8 L3 -2 L9 0 L3 3 L0 9 L-3 3 L-9 0 L-3 -2Z" fill={color} fillOpacity={.7}/>
      </g>
      <path d="M38 38 L30 34 M154 47 L164 44" {...accent} {...draw}/>
    </>}
    {index === 1 && <>
      <path {...accent} d="M42 12 Q99 9 155 12 Q163 12 162 21 L160 55 Q159 63 151 62 L45 63 Q36 62 37 54 L38 21 Q38 13 42 12Z" fill={color} fillOpacity={.16}/>
      <path d="M38 28 Q99 25 161 28" {...accent} opacity={.55}/>
      <path d="M66 20 L61 10 L72 15 L80 6 L87 15 L98 10 L94 21Z" fill={color} fillOpacity={.8} stroke={color} strokeWidth={1.5} strokeLinejoin="round"/>
      <path d="M53 43 H90 M53 51 H77" {...ink} opacity={.65}/>
      <path d="M115 48 Q113 34 126 33 Q138 33 139 44 M132 39 L139 45 L144 38 M139 48 Q139 61 126 60 Q114 60 114 51 M108 56 L114 50 L120 56" {...accent} {...draw}/>
    </>}
    {index === 2 && <>
      {[0, 1, 2].map((i) => <g key={i} opacity={.35 + .65 * enter(frame, i * 5, 14)}>
        <path {...accent} d={`M${43 + i * 35} ${37 - i * 9} v18 c0 11 34 11 34 0 v-18`} fill={color} fillOpacity={.2}/>
        <ellipse {...accent} cx={60 + i * 35} cy={37 - i * 9} rx={17} ry={7} fill="#303536"/>
        <path d={`M${46 + i * 35} ${46 - i * 9} q14 7 28 0`} {...accent} opacity={.4}/>
      </g>)}
      <path d="M153 21 L164 21 L164 60 L153 60Z" fill={color} fillOpacity={.1} stroke={color} strokeOpacity={.4} strokeWidth={2}/>
      <path d={`M156 57 V${29 + p * 15} H161 V57Z`} fill={color} fillOpacity={.85}/>
    </>}
    {index === 3 && <>
      <path {...accent} d="M51 26 Q83 23 116 26 L126 61 Q89 68 42 61Z" fill={color} fillOpacity={.18}/>
      <path d="M51 26 L59 10 Q82 15 108 10 L116 26 M61 26 Q84 31 109 26" {...accent}/>
      <path d="M77 40 V56 M69 48 H85" {...ink} opacity={.9}/>
      <g transform={`translate(151 ${24 - 5 * p})`} opacity={.35 + .65 * p}>
        <circle {...accent} r={14} fill="#303536"/>
        <path d="M0 -6 V6 M-6 0 H6" {...accent}/>
      </g>
      <path d="M151 38 Q148 57 133 59 M140 50 L132 59 L143 62" {...accent} {...draw}/>
    </>}
    {index === 4 && <>
      <path {...accent} d="M32 10 Q72 7 109 10 L109 56 Q69 60 32 57Z" fill={color} fillOpacity={.13}/>
      <path d="M33 22 H109" {...accent} opacity={.45}/>
      {[40, 48, 56].map((x) => <circle key={x} cx={x} cy={16} r={1.8} fill={color} opacity={.7}/>)}
      <path d="M54 31 L43 40 L54 49 M85 31 L96 40 L85 49 M75 29 L66 51" {...ink}/>
      <path d="M110 39 H123 Q130 39 130 47 V53 H141" {...accent} {...draw}/>
      <path {...accent} d="M143 61 Q137 48 146 38 Q158 24 172 37 Q183 46 176 61Z" fill={color} fillOpacity={.12}/>
      <path d="M159 38 V41 M146 46 L149 48 M171 46 L168 48 M159 57 L166 45" {...accent}/>
      <circle cx={159} cy={57} r={3} fill={color}/>
    </>}
  </g>;
};
