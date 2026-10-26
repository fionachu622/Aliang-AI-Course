import React from 'react';
/** Opaque chalk with irregular edges and fine dry-grain gaps, stable across frames. */
export const ChalkDrawingDefs: React.FC<{id: string}> = ({id}) => <filter id={id} x="-8%" y="-8%" width="116%" height="116%">
  <feTurbulence type="fractalNoise" baseFrequency=".62" numOctaves="3" seed="17" result="grain" />
  <feColorMatrix in="grain" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 2.8 -.65" result="dry" />
  <feComposite in="SourceGraphic" in2="dry" operator="in" result="chalk" />
  <feTurbulence type="fractalNoise" baseFrequency=".045" numOctaves="2" seed="7" result="wobble" />
  <feDisplacementMap in="chalk" in2="wobble" scale="2.2" xChannelSelector="R" yChannelSelector="G" />
</filter>;
