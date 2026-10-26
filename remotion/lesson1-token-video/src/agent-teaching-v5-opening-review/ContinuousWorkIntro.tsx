import {ChalkText} from './CourseTypography';
import {CueDraw, cueProgress} from './CourseMotion';
import React from 'react';
import storyboard from './continuous-diagrams.storyboard.json';
const scene=storyboard.continuous_work_intro;
const ease=(t:number,at:number,d=.4)=>{const q=Math.max(0,Math.min(1,(t-at)/d));return q*q*(3-2*q);};
export const ContinuousWorkIntro:React.FC<{seconds:number;still?:boolean;backgroundUrl?:string}>=({seconds,still=false,backgroundUrl})=>{
 const t=seconds-scene.legacyOffsetSeconds,show=(at:number)=>still?1:ease(t,at),dock=still?1:ease(t,scene.dockAt,.8);
 return <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0,fontFamily:'AgentFullHanzi'}}>
 {backgroundUrl&&<image href={backgroundUrl} width="1920" height="1080"/>}
 <ChalkText x={960-250*dock} y={550-355*dock} textAnchor="middle" fontSize={76-24*dock} fill="#F5F1E8" opacity={show(scene.start)}>{scene.title}</ChalkText>
 <g opacity={show(scene.materialsAt)}>
  <CueDraw t={t} at={scene.materialsAt} still={still}><g fill="none" stroke="#F0D26A" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M239 418 L344 418 L344 561 L239 561Z M260 400 L366 400 L366 539 M282 382 L388 382 L388 519 M257 451 L321 451 M257 478 L321 478 M257 506 L299 506"/><circle cx="372" cy="536" r="34"/><path d="M397 562 L428 593"/></g></CueDraw>
  <ChalkText x="330" y="680" textAnchor="middle" fontSize="46" fill="#F0D26A">{scene.materialsLabel}</ChalkText>
 </g>
 <g opacity={show(scene.planAt)}>
  <ChalkText x="1140" y="365" textAnchor="middle" fontSize="50" fill="#7CC8EA">{scene.planLabel}</ChalkText>
  <path d="M550 535 Q595 531 640 535 M623 524 L640 535 L623 546" fill="none" stroke="#7CC8EA" strokeWidth="3" opacity={show(scene.planAt)}/>
  {scene.steps.map((step,i)=>{const x=760+i*380,done=show(step.at);return <g key={step.label}>
   <ChalkText x={x} y="515" textAnchor="middle" fontSize="82" fill="#7CC8EA">{i+1}</ChalkText>
   <circle cx={x} cy="568" r="7" fill="#7CC8EA"/>
   {i<2&&<path d={`M${x+19} 568 Q${x+190} 565 ${x+361} 568`} fill="none" stroke="#7CC8EA" strokeWidth="3.5" pathLength="1" strokeDasharray="1" strokeDashoffset={1-(still?1:cueProgress(t,scene.steps[i+1].at))}/>}
   <path d={`M${x-22} 628 L${x-3} 647 L${x+30} 608`} fill="none" stroke="#A4D486" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" opacity={done} pathLength="1" strokeDasharray="1" strokeDashoffset={1-done}/>
  </g>})}
 </g>
 <g opacity={show(scene.wholeAt)}><path d="M713 735 Q1140 728 1570 735" fill="none" stroke="#A4D486" strokeWidth="3" pathLength="1" strokeDasharray="1" strokeDashoffset={1-(still?1:cueProgress(t,scene.wholeAt,.65))}/><ChalkText x="1140" y="824" textAnchor="middle" fontSize="48" fill="#A4D486">{scene.wholeLabel}</ChalkText></g>
 </svg>;
};
