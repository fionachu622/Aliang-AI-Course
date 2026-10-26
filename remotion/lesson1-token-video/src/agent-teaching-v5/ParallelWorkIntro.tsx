import React from 'react';
import {staticFile} from 'remotion';
import {ChalkText} from './CourseTypography';
import {CapabilityHeading} from './CapabilityHeading';
import {ChalkDrawingDefs} from './ChalkDrawing';
import storyboard from './parallel-work.storyboard.json';
const P=storyboard.presentation;
const cues=Object.fromEntries(storyboard.scenes[0].states.map(s=>[s.id,s.at]));
const ease=(t:number,at:number,d=.45)=>{const q=Math.max(0,Math.min(1,(t-at)/d));return q*q*(3-2*q);};
const AgentFigure:React.FC<{x:number;top:number;height:number}>=({x,top,height})=>{
 const a=P.agentForm;const width=height*a.inkViewBox[2]/a.inkViewBox[3];
 return <svg x={x-width/2} y={top} width={width} height={height} viewBox={a.inkViewBox.join(' ')}><image href={staticFile(a.asset)} width={a.sourceSize[0]} height={a.sourceSize[1]}/></svg>;
};
// Chunky outline siblings retain the mascot silhouette and terminal face.
const SubAgentFigure:React.FC<{x:number;y:number;color:string}>=({x,y,color})=><g transform={`translate(${x-58} ${y-64})`} fill="none" stroke={color} strokeWidth={5.5} strokeLinecap="round" strokeLinejoin="round">
 <path d="M25 80 Q16 83 10 98 Q8 105 14 106 L26 95 M91 80 Q100 83 106 98 Q108 105 102 106 L90 95"/>
 <path d="M32 105 L32 121 L45 121 L48 110 M68 110 L71 121 L84 121 L84 105"/>
 <path d="M30 78 L27 99 Q28 111 58 111 Q88 111 89 99 L86 78"/>
 <path d="M16 71 Q3 66 6 53 Q-1 40 12 31 Q11 17 26 17 Q33 3 47 10 Q58 0 69 10 Q84 3 91 18 Q105 18 105 32 Q118 40 110 54 Q114 68 100 73 Q84 83 58 82 Q30 83 16 71Z"/>
 <rect x={23} y={29} width={70} height={40} rx={10}/>
 <path d="M39 41 L47 49 L39 57 M62 57 L75 57" strokeWidth={6}/>
 <path d="M53 94 L63 94" strokeWidth={5}/>
</g>;
// All lanes share a start clock; different monotonic curves show concurrent work.
// Values are illustrative and deliberately stay below completion before the real demo.
const workProgress=(t:number,i:number,still:boolean)=>{
 const q=still?1:Math.max(0,Math.min(1,(t-P.progress.start)/(P.progress.end-P.progress.start)));
 return P.progress.initial+P.progress.gains[i]*Math.pow(q,P.progress.exponents[i]);
};
// These are recognizable task illustrations, not claims about the eventual real files.
const Deliverable:React.FC<{index:number;color:string}>=({index,color})=><g stroke={color} strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round" fill="none" filter="url(#parallel-dry-chalk)">
 {index===0&&<>
  <path d="M-153 -94 Q0 -98 153 -94 L154 78 Q0 82 -153 78Z" fill={color} fillOpacity={.065}/>
  <path d="M-163 -102 Q0 -106 165 -101 M0 82 L0 111 M-45 113 Q0 109 45 113"/>
  <path d="M-118 -61 L-32 -61 M-118 -44 L-67 -44" strokeWidth={7}/>
  <path d="M-116 45 L-116 5 L-87 5 L-87 45Z M-65 45 L-65 -12 L-36 -12 L-36 45Z M-14 45 L-14 -38 L15 -38 L15 45Z" fill={color} fillOpacity={.26}/>
  <path d="M60 -30 L118 -30 M60 -8 L107 -8 M60 14 L119 14 M60 37 L94 37" strokeWidth={3.5}/>
 </>}
 {index===1&&<>
  <path d="M-106 -119 Q0 -123 108 -117 L111 113 Q0 117 -108 111Z" fill={color} fillOpacity={.055}/>
  <path d="M-77 -81 Q0 -60 78 -81 M-69 -78 L-53 -53 L-40 -71 M-15 -67 L0 -45 L15 -67 M41 -72 L54 -54 L70 -78" fill={color} fillOpacity={.18}/>
  <circle cx={52} cy={-22} r={15} fill={color} fillOpacity={.22}/>
  <path d="M-83 48 L-34 -11 L8 36 L28 10 L84 66 M-82 69 Q0 62 83 71"/>
  <circle cx={-20} cy={43} r={10} fill="#24272A"/><circle cx={16} cy={46} r={10} fill="#24272A"/>
  <path d="M-20 55 L-20 83 M-37 69 L-20 58 L-3 70 M16 58 L16 86 M0 74 L16 60 L34 73 M-20 83 L-30 98 M-20 83 L-10 98 M16 86 L7 99 M16 86 L27 99"/>
 </>}
 {index===2&&<>
  <path d="M-105 -119 L60 -118 L109 -68 L109 111 Q0 116 -106 111Z" fill={color} fillOpacity={.055}/>
  <path d="M60 -118 L59 -68 L109 -68 M-69 -79 L17 -79" strokeWidth={5}/>
  {[-30,14,58].map((y,i)=><g key={y}><path d={`M-70 ${y} l8 9 l17 -20`} strokeWidth={5}/><path d={`M-24 ${y-3} L${i===2?42:74} ${y-3} M-24 ${y+12} L${i===0?47:64} ${y+12}`} strokeWidth={3.5}/></g>)}
 </>}

</g>;
export const ParallelWorkIntro:React.FC<{seconds:number;still?:boolean;backgroundUrl?:string}>=({seconds,still=false,backgroundUrl})=>{
 const t=seconds-P.legacyOffsetSeconds;
 const show=(at:number,d=.45)=>still?1:ease(t,at,d);
 const dock=show(P.dockAt,.8),split=show(cues['state-split'],.65);
 return <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}} data-parallel-work="horizontal-branches">
 <defs><ChalkDrawingDefs id="parallel-dry-chalk"/>
 {P.tasks.map((_,i)=><clipPath id={`parallel-task-reveal-${i}`} key={i}><rect x={-180} y={-135} width={360} height={285*show(P.tasks[i].at,.55)}/></clipPath>)}
 </defs>
 {backgroundUrl&&<image href={backgroundUrl} width={1920} height={1080}/>}
 <CapabilityHeading title={P.title} dock={dock} opacity={show(P.start)}/>
 <g opacity={show(cues['state-agent'])}>
  <AgentFigure x={P.agentForm.main.x} top={P.agentForm.main.top} height={P.agentForm.main.height}/>
  <ChalkText x={P.agentForm.main.x} y={P.agentForm.main.labelY} textAnchor="middle" fontSize={P.agentForm.main.fontSize}>{P.labels[0]}</ChalkText>
 </g>
 <path d="M519 610 Q560 608 605 610" stroke="#F5F1E8" strokeWidth={7} fill="none" strokeLinecap="round" opacity={split} filter="url(#parallel-dry-chalk)"/>
 {P.rows.map((y,i)=>{const color=P.colors[i],reveal=show(P.tasks[i].at,.55);
 const path=i===1?`M605 610 L775 610`:`M605 610 Q625 610 625 ${610+(y-610)*.18} L625 ${y+(610-y)*.09} Q625 ${y} 647 ${y} L775 ${y}`;
 return <g key={y}>
  <g stroke={color} strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round" filter="url(#parallel-dry-chalk)" opacity={split}>
   <path d={path} pathLength={1} strokeDasharray={1} strokeDashoffset={1-split}/>
   <path d={`M762 ${y-11} L776 ${y} L762 ${y+11}`} opacity={split>.94?1:0}/>
  </g>
  <g opacity={split}><SubAgentFigure x={P.agentForm.sub.x} y={y} color={color}/></g>
  <g opacity={show(cues['state-parallel'])} data-parallel-progress={i}>
   <path d={`M980 ${y-15} Q964 ${y-15} 964 ${y} Q964 ${y+15} 980 ${y+15} L1228 ${y+15} Q1244 ${y+15} 1244 ${y} Q1244 ${y-15} 1228 ${y-15}Z`} fill="#F5F1E8" fillOpacity={.035} stroke="#F5F1E8" strokeOpacity={.8} strokeWidth={3.5}/>
   <rect x={970} y={y-9} width={268*workProgress(t,i,still)} height={18} rx={9} fill={color}/>
  </g>
  <g opacity={reveal}>
   <g transform={`translate(1420 ${y}) scale(.48)`} clipPath={`url(#parallel-task-reveal-${i})`}><Deliverable index={i} color={color}/></g>
   <ChalkText x={1550} y={y+20} fontSize={52} fill={color}>{P.tasks[i].label}</ChalkText>
  </g>
 </g>})}
 </svg>;
};
