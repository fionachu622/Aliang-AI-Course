import {ChalkText} from './CourseTypography';
import {CueDraw, cueProgress} from './CourseMotion';
import React from 'react';
import {ChalkCard} from './ChalkCard';
import storyboard from './continuous-diagrams.storyboard.json';
const scene=storyboard.continuous_work_intro;
const ease=(t:number,at:number,d=.4)=>{const q=Math.max(0,Math.min(1,(t-at)/d));return q*q*(3-2*q);};
export const ContinuousWorkIntro:React.FC<{seconds:number;still?:boolean;backgroundUrl?:string}>=({seconds,still=false,backgroundUrl})=>{
 const t=seconds-scene.legacyOffsetSeconds,show=(at:number)=>still?1:ease(t,at),dock=still?1:ease(t,scene.dockAt,.8);
 return <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0,fontFamily:'AgentFullHanzi'}}>
 {backgroundUrl&&<image href={backgroundUrl} width="1920" height="1080"/>}
 <ChalkText x={960} y={170} textAnchor="middle" fontSize={78-16*dock} fill="#F5F1E8" opacity={show(scene.start)}>{scene.title}</ChalkText>
 <g opacity={show(scene.materialsAt)}>
  <ChalkCard x={310} y={440} w={340} h={320} color="#F0D26A" progress={show(scene.materialsAt)}/>
  <CueDraw t={t} at={scene.materialsAt} still={still}><g fill="none" stroke="#F0D26A" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M392 486 L568 486 L568 638 L392 638Z M408 466 L628 466 L628 618 M424 446 L644 446 L644 598"/><circle cx="614" cy="610" r="36"/><path d="M640 637 L672 669"/></g></CueDraw>
  <ChalkText x="480" y="722" textAnchor="middle" fontSize="46" fill="#F0D26A">{scene.materialsLabel}</ChalkText>
 </g>
 <g opacity={show(scene.planAt)}>
  <ChalkText x="960" y="285" textAnchor="middle" fontSize="46" fill="#7CC8EA">{scene.planLabel}</ChalkText>
  <path d="M650 600 Q685 596 720 600 M703 589 L720 600 L703 611" fill="none" stroke="#7CC8EA" strokeWidth="3" opacity={show(scene.planAt)}/>
  {scene.steps.map((step,i)=>{const x=830+i*270,done=show(step.at);return <g key={step.label}>
   <ChalkCard x={x-110} y={440} w={220} h={320} color="#7CC8EA" progress={done}/>
   <ChalkText x={x} y="580" textAnchor="middle" fontSize="82" fill="#7CC8EA">{i+1}</ChalkText>
   <circle cx={x} cy="600" r="7" fill="#7CC8EA"/>
   {i<2&&<path d={`M${x+110} 600 Q${x+205} 597 ${x+300} 600`} fill="none" stroke="#7CC8EA" strokeWidth="3.5" pathLength="1" strokeDasharray="1" strokeDashoffset={1-(still?1:cueProgress(t,scene.steps[i+1].at))}/>}
   <path d={`M${x-26} 646 L${x-4} 668 L${x+34} 626`} fill="none" stroke="#A4D486" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" opacity={done} pathLength="1" strokeDasharray="1" strokeDashoffset={1-done}/>
  </g>})}
 </g>
 <g opacity={show(scene.wholeAt)}><path d="M740 830 Q960 818 1180 830" fill="none" stroke="#A4D486" strokeWidth="3" pathLength="1" strokeDasharray="1" strokeDashoffset={1-(still?1:cueProgress(t,scene.wholeAt,.65))}/><ChalkText x="960" y="898" textAnchor="middle" fontSize="50" fill="#A4D486">{scene.wholeLabel}</ChalkText></g>
 </svg>;
};
