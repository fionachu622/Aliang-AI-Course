import React from 'react';
const rand = (n: number) => {const v = Math.sin(n * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v);};

// A patch painted by overlapping broad chalk passes, with no polygon fill.
// Fixed seeds keep the material stable throughout the orbit.
export const HandDrawnFeeSurface: React.FC<{index: number; color: string}> = ({index, color}) => <>
  <defs>
    <filter id={`fee-paint-${index}`} x="-4%" y="-6%" width="108%" height="112%" colorInterpolationFilters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency=".55" numOctaves="3" seed={71 + index} result="grain"/>
      <feDisplacementMap in="SourceGraphic" in2="grain" scale="1.2" xChannelSelector="R" yChannelSelector="G" result="edge"/>
      <feColorMatrix in="grain" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  .1 .1 .1 0 .78" result="density"/>
      <feComposite in="edge" in2="density" operator="in"/>
    </filter>
    <filter id={`fee-ink-${index}`} x="-8%" y="-12%" width="116%" height="124%">
      <feTurbulence type="fractalNoise" baseFrequency=".25" numOctaves="2" seed={11 + index} result="grain"/>
      <feDisplacementMap in="SourceGraphic" in2="grain" scale="1" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
  </defs>
  <g filter={`url(#fee-paint-${index})`} fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" data-fee-surface="overlapping-chalk-passes">
    {Array.from({length: 21}, (_, row) => {
      const n = row + index * 157;
      const y = 10 + row * 8.65;
      const start = 9 + rand(n + 9) * 12;
      const end = 331 + rand(n + 13) * 12;
      const bend = (rand(n + 32) - .5) * 7;
      const tilt = (rand(n + 91) - .5) * 4;
      const d = `M${start} ${y + tilt} C83 ${y - bend} 146 ${y + bend} 177 ${y} S270 ${y - bend} ${end} ${y - tilt}`;
      const rgb = [1, 3, 5].map((offset) => parseInt(color.slice(offset, offset + 2), 16));
      const shade = (rand(Math.floor(row / 2) + index * 41) - .5) * 16;
      const passColor = `rgb(${rgb.map(v => Math.round(Math.max(0, Math.min(255, v + shade)))).join(',')})`;
      return <path key={row} d={d} stroke={passColor} strokeWidth={row === 0 || row === 20 ? 11 : 15 + rand(n + 46) * 4}/>;
    })}
  </g>
</>;
