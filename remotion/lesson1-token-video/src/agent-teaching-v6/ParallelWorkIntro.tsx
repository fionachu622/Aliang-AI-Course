import {ChalkText} from './CourseTypography';
import {CueDraw, cueProgress} from './CourseMotion';
import React from 'react';
import {ChalkCard} from './ChalkCard';
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
 <ChalkText x={960} y={165} textAnchor="middle" fontSize={78-16*dock} fill="#F5F1E8" opacity={show(scene.start)}>{scene.title}</ChalkText>
 <path d="M640 225 Q960 221 1280 225" fill="none" stroke="#7CC8EA" strokeWidth="3" opacity={dock} pathLength="1" strokeDasharray="1" strokeDashoffset={1-dock}/>
 <ChalkText x="960" y="292" textAnchor="middle" fontSize="38" fill="#7CC8EA" opacity={show(scene.parallelAt)}>三个子 Agent · {scene.parallelLabel}</ChalkText>
 <g opacity={show(scene.agentAt)}>
  <ChalkCard x={130} y={400} w={300} h={300} color="#F5F1E8" progress={show(scene.agentAt)} doubleLine/>
  <ChalkText x="280" y="552" textAnchor="middle" fill="#F5F1E8" fontSize="72">Agent</ChalkText>
  <ChalkText x="280" y="612" textAnchor="middle" fill="#F5F1E8" fontSize="28" opacity=".75">主 Agent</ChalkText>
 </g>
 {scene.tasks.map((task,i)=>{const ys=[380,550,720][i];const color=['#7CC8EA','#F18D9E','#A4D486'][i];const done=show(task.at);return <g key={task.label}>
  <g opacity={split} stroke={color} fill="none" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" filter="url(#parallel-chalk)">
   {i===0&&<path d="M430 550 L478 550 Q522 550 522 380 L612 380" pathLength="1" strokeDasharray="1" strokeDashoffset={1-split}/>}
   {i===1&&<path d="M430 550 L612 550" pathLength="1" strokeDasharray="1" strokeDashoffset={1-split}/>}
   {i===2&&<path d="M430 550 L478 550 Q522 550 522 720 L612 720" pathLength="1" strokeDasharray="1" strokeDashoffset={1-split}/>}
   <path d={`M600 ${ys-11} L612 ${ys} L600 ${ys+11}`} opacity={split>.95?1:0}/>
   <path d={`M734 ${ys} L1068 ${ys}`} pathLength="1" strokeDasharray="1" strokeDashoffset={1-split}/>
   <path d={`M1056 ${ys-11} L1068 ${ys} L1056 ${ys+11}`} opacity={split>.95?1:0}/>
  </g>
  <g opacity={split}>
   <ChalkCard x={626} y={ys-54} w={108} h={108} color={color} progress={split} radius={54}/>
   <ChalkText x={680} y={ys+20} fontSize="52" textAnchor="middle" fill={color}>{['A','B','C'][i]}</ChalkText>
   <ChalkText x={680} y={ys+92} fontSize="24" textAnchor="middle" fill={color} opacity=".85">子 Agent</ChalkText>
  </g>
  <g opacity={show(scene.parallelAt)*(pulse<1?1:0)}><circle cx={734+334*pulse} cy={ys} r="7" fill={color}/></g>
  <g opacity={done}>
   <ChalkCard x={1080} y={ys-82} w={600} h={164} color={color} progress={done} radius={26}/>
   <CueDraw t={t} at={task.at} still={still}><g transform={`translate(1185 ${ys})`} stroke={color} fill="none" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
    {i===0&&<><path d="M-40 -30 L40 -30 L40 22 L-40 22Z M0 22 L0 40 M-18 40 L18 40"/><path d="M-22 8 L-22 -8 M-4 8 L-4 -18 M14 8 L14 -26"/></>}
    {i===1&&<><path d="M-34 -42 L34 -42 L34 42 L-34 42Z"/><circle cx="12" cy="-20" r="8"/><path d="M-22 14 L-6 -4 L10 14 L18 6 M-20 28 L20 28"/></>}
    {i===2&&<><path d="M-32 -40 L16 -40 L32 -24 L32 40 L-32 40Z M16 -40 L16 -24 L32 -24 M-16 -10 L18 -10 M-16 6 L18 6 M-16 22 L6 22"/></>}
   </g></CueDraw>
   <ChalkText x="1450" y={ys+14} textAnchor="middle" fontSize="46" fill={color}>{task.label}</ChalkText>
  </g>
 </g>})}
 </svg>;
};
