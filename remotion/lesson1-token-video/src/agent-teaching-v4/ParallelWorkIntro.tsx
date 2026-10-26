import {ChalkText} from './CourseTypography';
import {CueDraw, cueProgress} from './CourseMotion';
import React from 'react';
import storyboard from './continuous-diagrams.storyboard.json';
const scene=storyboard.parallel_work_intro;
const ease=(t:number,at:number,d=.4)=>{const q=Math.max(0,Math.min(1,(t-at)/d));return q*q*(3-2*q);};
export const ParallelWorkIntro:React.FC<{seconds:number;still?:boolean;backgroundUrl?:string}>=({seconds,still=false,backgroundUrl})=>{
 const t=seconds-scene.legacyOffsetSeconds,show=(at:number)=>still?1:ease(t,at);
 const dock=still?1:ease(t,scene.dockAt,.8),split=show(scene.splitAt);
 const pulse=still?1:cueProgress(t,scene.parallelAt,1.25);
 return <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0,fontFamily:'AgentFullHanzi, HanziPen SC, cursive'}} data-parallel-work="progressive">
 <defs><filter id="parallel-chalk"><feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="2" seed="9"/><feDisplacementMap in="SourceGraphic" scale="1.5"/></filter></defs>
 {backgroundUrl&&<image href={backgroundUrl} width="1920" height="1080"/>}
 <ChalkText x={960-340*dock} y={550-355*dock} textAnchor="middle" fontSize={80-24*dock} fill="#F5F1E8" opacity={show(scene.start)}>{scene.title}</ChalkText>
 <path d="M160 232 Q570 228 1090 232" fill="none" stroke="#7CC8EA" strokeWidth="3" opacity={dock} pathLength="1" strokeDasharray="1" strokeDashoffset={1-dock}/>
 <g opacity={show(scene.agentAt)}>
 <CueDraw t={t} at={scene.agentAt} still={still}><rect x="235" y="525" width="280" height="155" rx="18" fill="none" stroke="#7CC8EA" strokeWidth="4" filter="url(#parallel-chalk)"/></CueDraw>
 <ChalkText x="375" y="622" textAnchor="middle" fill="#F5F1E8" fontSize="62">Agent</ChalkText>
 </g>
 {scene.tasks.map((task,i)=>{const y=410+i*205;const color=['#7CC8EA','#F18D9E','#A4D486'][i];return <g key={task.label}>
 <g opacity={split} stroke={color} fill="none" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" filter="url(#parallel-chalk)">
 <path d={`M535 602 L640 602 Q665 602 665 ${y} L770 ${y}`} pathLength="1" strokeDasharray="1" strokeDashoffset={1-split}/><path d={`M754 ${y-12} L770 ${y} L754 ${y+12}`} opacity={split>.95?1:0}/>
 <CueDraw t={t} at={scene.splitAt} still={still}><rect x="795" y={y-60} width="300" height="120" rx="14"/></CueDraw>
 <path d={`M1118 ${y} Q1180 ${y-4} 1250 ${y}`} pathLength="1" strokeDasharray="1" strokeDashoffset={1-(still?1:cueProgress(t,task.at))}/><path d={`M1234 ${y-12} L1250 ${y} L1234 ${y+12}`} opacity={show(task.at+.3)}/>
 </g>
 <ChalkText x="945" y={y+18} fontSize="46" textAnchor="middle" fill={color} opacity={split}>子 Agent {['A','B','C'][i]}</ChalkText>
 <g opacity={show(scene.parallelAt)*(pulse<1?1:0)}><circle cx={815+260*pulse} cy={y+43} r="4" fill={color}/></g>
 <g opacity={show(task.at)}>
 <CueDraw t={t} at={task.at} still={still}><g transform={`translate(1330 ${y})`} stroke={color} fill="none" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" filter="url(#parallel-chalk)">
 {i===0&&<><path d="M-57 -49 L57 -49 L57 36 L-57 36Z M0 36 L0 66 M-28 66 L28 66"/><path d="M-32 16 L-32 -5 M-6 16 L-6 -22 M20 16 L20 -34"/></>}
 {i===1&&<><path d="M-48 -64 L48 -64 L48 64 L-48 64Z"/><circle cx="18" cy="-30" r="11"/><path d="M-31 22 L-9 -5 L15 22 L28 8 M-28 43 L28 43"/></>}
 {i===2&&<><path d="M-46 -62 L24 -62 L48 -37 L48 62 L-46 62Z M24 -62 L24 -37 L48 -37 M-25 -15 L27 -15 M-25 9 L27 9 M-25 33 L12 33"/></>}
 </g></CueDraw>
 <ChalkText x="1600" y={y+18} textAnchor="middle" fontSize="46" fill={color}>{task.label}</ChalkText>
 </g>
 </g>})}
 </svg>;
};
