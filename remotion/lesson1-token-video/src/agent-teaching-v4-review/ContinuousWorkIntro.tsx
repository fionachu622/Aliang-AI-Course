import {ChalkText} from './CourseTypography';
import {CueDraw, cueProgress} from './CourseMotion';
import React from 'react';
import storyboard from './continuous-diagrams.storyboard.json';
const scene=storyboard.continuous_work_intro;
const ease=(t:number,at:number,d=.4)=>{const q=Math.max(0,Math.min(1,(t-at)/d));return q*q*(3-2*q);};
export const ContinuousWorkIntro:React.FC<{seconds:number;still?:boolean;backgroundUrl?:string}>=({seconds,still=false,backgroundUrl})=>{
 const t=seconds-scene.legacyOffsetSeconds;
 const show=(at:number)=>still?1:ease(t,at);
 const dock=still?1:ease(t,scene.dockAt,.8);
 return <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0,fontFamily:'AgentFullHanzi, HanziPen SC, cursive'}} data-continuous-work="progressive">
 <defs><filter id="work-chalk"><feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="2" seed="8"/><feDisplacementMap in="SourceGraphic" scale="1.5"/></filter></defs>
 {backgroundUrl&&<image href={backgroundUrl} width="1920" height="1080"/>}
 <ChalkText x={960-250*dock} y={550-355*dock} textAnchor="middle" fontSize={76-24*dock} fill="#F5F1E8" opacity={show(scene.start)}>{scene.title}</ChalkText>
 <path d="M160 232 Q700 228 1270 232" stroke="#7CC8EA" fill="none" strokeWidth="3" opacity={dock} pathLength="1" strokeDasharray="1" strokeDashoffset={1-dock}/>
 <g opacity={show(scene.materialsAt)}>
  <CueDraw t={t} at={scene.materialsAt} still={still}><g fill="none" stroke="#F0D26A" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" filter="url(#work-chalk)">
   <path d="M239 418 L344 418 L344 561 L239 561Z M260 400 L366 400 L366 539 M282 382 L388 382 L388 519 M257 451 L321 451 M257 478 L321 478 M257 506 L299 506"/>
   <circle cx="372" cy="536" r="34"/><path d="M397 562 L428 593"/>
  </g></CueDraw>
  <ChalkText x="330" y="666" textAnchor="middle" fontSize="46" fill="#F0D26A">{scene.materialsLabel}</ChalkText>
 </g>
 <g opacity={show(scene.planAt)}>
  <ChalkText x="1140" y="373" textAnchor="middle" fontSize="46" fill="#7CC8EA">{scene.planLabel}</ChalkText>
  <g fill="none" stroke="#7CC8EA" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" filter="url(#work-chalk)">
   <CueDraw t={t} at={scene.planAt} still={still}><path d="M489 521 Q550 516 627 520"/></CueDraw><path d="M612 508 L627 520 L611 532" opacity={show(scene.planAt+.32)}/>
   {[760,1140,1520].map((x,i)=><g key={x}><CueDraw t={t} at={scene.planAt} still={still}><rect x={x-104} y="444" width="208" height="150" rx="15"/></CueDraw>{i<2&&<g><path d={`M${x+130} 520 Q${x+190} 515 ${x+250} 520`} pathLength="1" strokeDasharray="1" strokeDashoffset={1-(still?1:cueProgress(t,scene.steps[i+1].at))}/><path d={`M${x+235} 508 L${x+250} 520 L${x+235} 532`} opacity={show(scene.steps[i+1].at+.3)}/></g>}</g>)}
  </g>
  {scene.steps.map((step,i)=>{const x=760+i*380;const active=show(step.at);return <g key={step.label}>
   <ChalkText x={x} y="540" textAnchor="middle" fontSize="55" fill="#7CC8EA" opacity={1-active}>{i+1}</ChalkText>
   <path d={`M${x-36} 522 L${x-8} 549 L${x+44} 489`} stroke="#A4D486" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={active} pathLength="1" strokeDasharray="1" strokeDashoffset={1-active}/>
  </g>})}
 </g>
 <g opacity={show(scene.wholeAt)} fill="none" stroke="#A4D486" strokeWidth="3" strokeLinecap="round" filter="url(#work-chalk)"><path d="M655 680 L655 706 Q1135 713 1624 706 L1624 680" pathLength="1" strokeDasharray="1" strokeDashoffset={1-(still?1:cueProgress(t,scene.wholeAt,.65))}/></g>
 <ChalkText x="1140" y="793" textAnchor="middle" fontSize="46" fill="#A4D486" opacity={show(scene.wholeAt)}>{scene.wholeLabel}</ChalkText>
 </svg>;
};
