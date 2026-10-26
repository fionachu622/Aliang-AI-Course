import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {v9Colors as C} from '../v9/VisualV9';
import cues from './opening-text.timeline.json';

// Absolute narration cues, not a stretched animation timeline.
export const OpeningText:React.FC=()=>{
 const frame=useCurrentFrame();
 const groups=cues.filter(g=>frame>=Math.ceil(g.start*30)&&frame<Math.ceil(g.end*30)+12);
 return <>{groups.map(group=><AbsoluteFill key={group.start} style={{opacity:interpolate(frame,[Math.ceil(group.end*30),Math.ceil(group.end*30)+12],[1,0],{extrapolateLeft:'clamp',extrapolateRight:'clamp'}),justifyContent:'center',alignItems:'center',gap:48,fontWeight:600,WebkitTextStroke:'.65px currentColor'}}>
  {group.lines.map((line,i)=><div key={`${group.start}-${i}`} style={{fontSize:line.size,textAlign:'center',lineHeight:1.35,color:i===0?C.ink:C.blue}}>
   {line.parts.map((part,j)=><span key={j} style={{opacity:interpolate(frame,[Math.ceil(part.at*30),Math.ceil(part.at*30)+8],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'})}}>{part.text}</span>)}
  </div>)}
 </AbsoluteFill>)}</>;
};
