import React from 'react';
import {Easing, interpolate, spring} from 'remotion';
import editorial from './remaining-editorial.storyboard.json';
import motion from './fee-orbit.storyboard.json';
import {ChalkText} from './CourseTypography';
import {FeeIllustration} from './FeeIllustrations';

const scene = editorial.scenes.find((s) => s.id === 'fee-overview')!;
const clamp = (v: number) => Math.max(0, Math.min(1, v));
const progress = (f: number, at: number, duration: number) => 1 - Math.pow(1 - clamp((f - at) / duration), 3);
export const FeeOverview: React.FC<{seconds: number}> = ({seconds: t}) => {
  const frame = (t - scene.start) * 30;
  const ring = motion.ring;
  const ringScale = .62 + .38 * progress(frame, 0, ring.expandFrames);
  const playFrame = Math.max(0, frame - ring.playStartFrame);
  const exit = progress(frame, (scene.end - scene.start) * 30 - motion.title.exitFrames, motion.title.exitFrames);
  const marker = clamp(spring({frame: Math.max(0, frame - motion.title.markerFrame), fps: 30, config: {damping: 14}}));
  const letters = (text: string, offset: number) => [...text].map((char, i) => {
    const at = motion.title.leadFrame + (i + offset) * motion.title.letterStaggerFrames;
    const channel = (duration: number) => interpolate(frame, [at, at + duration], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(.22, 1, .36, 1)});
    return <span key={i} style={{display: 'inline-block', opacity: progress(frame, at, 9), filter: `blur(${channel(motion.title.blurFrames) * motion.title.fontSize / 6}px)`, transform: `translateY(${-channel(motion.title.slideFrames) * motion.title.fontSize * .22}px)`}}>{char}</span>;
  });
  return <div style={{position: 'absolute', inset: 0, fontFamily: 'AgentFullHanzi', color: '#F5F1E8'}} data-fee-motion="orbit-ring-title-open">
    {scene.nodes.map((node, i) => {
      const theta = -Math.PI / 2 + i * 2 * Math.PI / scene.nodes.length + frame / 30 * ring.speed;
      const depth = Math.sin(theta), scale = 1 + ring.depthScale * depth;
      const x = ring.cx + Math.cos(theta) * ring.rx * ringScale;
      const y = ring.cy + Math.sin(theta) * ring.ry * ringScale;
      const cueFrame = (node.at - scene.start) * 30;
      const shown = progress(frame, cueFrame, 10);
      const miniFrame = Math.max(0, playFrame - Math.max(0, cueFrame - ring.playStartFrame));
      return <div key={node.text} style={{position: 'absolute', left: x - ring.width / 2, top: y - ring.height / 2, width: ring.width, height: ring.height, transform: `scale(${scale})`, transformOrigin: 'center', zIndex: 10 + Math.round(depth * 5), boxShadow: '0 10px 22px rgba(0,0,0,.22)', borderRadius: 18, opacity: progress(frame, 1.8 + 1.5 * i, 10.8)}}>
        <svg width={ring.width} height={ring.height} viewBox={`0 0 ${ring.width} ${ring.height}`}>
          <defs>
            <linearGradient id={`fee-paper-${i}`} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#353A3B"/><stop offset="1" stopColor="#252A2B"/></linearGradient>
            <pattern id={`fee-grain-${i}`} width="32" height="24" patternUnits="userSpaceOnUse"><path d="M3 6 L9 5 M20 18 L27 17" stroke="#F5F1E8" strokeOpacity={.035} strokeWidth={1}/></pattern>
          </defs>
          <path d="M18 5 Q173 0 333 5 Q348 6 347 22 L347 174 Q347 191 331 190 Q175 196 18 191 Q3 190 4 175 L3 22 Q3 6 18 5Z" fill={`url(#fee-paper-${i})`} stroke={node.color} strokeOpacity={.65} strokeWidth={2}/>
          <path d="M18 5 Q173 0 333 5 Q348 6 347 22 L347 174 Q347 191 331 190 Q175 196 18 191 Q3 190 4 175 L3 22 Q3 6 18 5Z" fill={`url(#fee-grain-${i})`}/>
          <path d="M18 16 Q173 11 331 16" fill="none" stroke="#F5F1E8" strokeOpacity={.08} strokeWidth={1.5}/>
          <path d="M25 46 Q35 44 47 46" fill="none" stroke={node.color} strokeOpacity={.55} strokeWidth={2} strokeLinecap="round"/>
          <ChalkText x={25} y={36} fontSize={26} fill={node.color}>{String(i + 1).padStart(2, '0')}</ChalkText>
          <g opacity={1 - shown} stroke="#F5F1E8" strokeOpacity={.15} strokeWidth={6} strokeLinecap="round"><path d="M78 72 H273 M97 146 H252"/></g>
          <g opacity={shown}>
            <FeeIllustration index={i} frame={miniFrame} color={node.color}/>
            <ChalkText x={175} y={157} textAnchor="middle" fontSize={i === 2 ? 36 : i === 4 ? 39 : 44} fill={node.color}>{node.text}</ChalkText>
          </g>
        </svg>
      </div>;
    })}
    <div style={{position: 'absolute', left: 540, top: 400, width: 840, height: 92, textAlign: 'center', zIndex: 30, fontSize: motion.title.fontSize, whiteSpace: 'nowrap', opacity: 1 - exit, filter: `blur(${6.5 * exit}px)`}}>
      {letters('五种常见', 0)}<span style={{position: 'relative', display: 'inline-block'}}>
        <span style={{position: 'absolute', inset: '.1em -.05em .06em', background: 'rgba(240,210,106,.46)', transform: `scaleX(${marker})`, transformOrigin: 'left center', zIndex: 0}}/>
        <span style={{position: 'relative', zIndex: 1}}>{letters('收费方式', 4)}</span>
      </span>
    </div>
    <div style={{position: 'absolute', top: 864, width: '100%', textAlign: 'center', fontSize: 38, opacity: progress(frame, (motion.footer.at - scene.start) * 30, 15)}}>{motion.footer.text}</div>
  </div>;
};
