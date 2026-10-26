import React from 'react';
import {ChalkText} from './CourseTypography';
import {cueProgress} from './CourseMotion';
import {CapabilityHeading} from './CapabilityHeading';
import {ChalkDrawingDefs} from './ChalkDrawing';
import storyboard from './continuous-diagrams.storyboard.json';
const scene=storyboard.continuous_work_intro;
const C={white:'#F5F1E8',yellow:'#F0D26A',blue:'#7CC8EA',green:'#A4D486'};
const ease=(t:number,at:number,d=.4)=>{const q=Math.max(0,Math.min(1,(t-at)/d));return q*q*(3-2*q);};
/** One task, then one continuous path. No document pictograms or decorative status marks. */
export const ContinuousWorkIntro:React.FC<{seconds:number;still?:boolean;backgroundUrl?:string}>=({seconds,still=false,backgroundUrl})=>{
 const t=seconds-scene.legacyOffsetSeconds;
 const show=(at:number,d=.4)=>still?1:ease(t,at,d);
 const draw=(at:number,d=.5)=>still?1:cueProgress(t,at,d);
 const plan=show(scene.planAt),done=show(scene.steps[0].at),next=show(scene.steps[1].at);
 const advance=show(scene.steps[2].at);
 const line=(d:string,color:string,progress=1,width=4)=><path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" filter="url(#work-chalk)" pathLength="1" strokeDasharray="1" strokeDashoffset={1-progress}/>;
 return <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0,fontFamily:'AgentFullHanzi'}} data-continuous-work="one-task-continuous-path">
  <defs><ChalkDrawingDefs id="work-chalk"/></defs>
  {backgroundUrl&&<image href={backgroundUrl} width="1920" height="1080"/>}
  <CapabilityHeading title={scene.title} dock={show(scene.dockAt,.8)} opacity={show(scene.start)}/>
  {/* Stable left edge and a single container bind goal and inputs into one task. */}
  <g opacity={show(226.75)}>
   <path d="M235 355 Q430 351 625 355 L626 755 Q431 759 235 755 Z" fill="#F0D26A" fillOpacity=".035" stroke={C.yellow} strokeWidth="3.5" strokeLinejoin="round" filter="url(#work-chalk)"/>
   <ChalkText x="430" y="435" textAnchor="middle" fontSize="54" fill={C.yellow}>同一个目标</ChalkText>
   {line('M282 475 Q430 472 578 475',C.yellow,1,2)}
   <g opacity={show(scene.materialsAt)}>
    <circle cx="300" cy="547" r="5" fill={C.yellow}/>
    <ChalkText x="352" y="563" fontSize="46" fill={C.white}>查资料</ChalkText>
   </g>
   <g opacity={show(scene.filesAt)}>
    <circle cx="300" cy="648" r="5" fill={C.yellow}/>
    <ChalkText x="352" y="664" fontSize="46" fill={C.white}>处理文件</ChalkText>
   </g>
  </g>
  <g opacity={plan}>
   {line('M677 555 L790 555 M771 540 L790 555 L771 570',C.blue,draw(scene.planAt,.45))}
   <ChalkText x="1240" y="422" textAnchor="middle" fontSize="54" fill={C.blue}>Agent 自己安排步骤</ChalkText>
   {/* The completed part and current part are the only two states the narration names. */}
   <g opacity={show(scene.planAt+.2)}>
    <circle cx="1000" cy="555" r="52" fill={done>0?C.green:C.blue} fillOpacity=".07" stroke={done>0?C.green:C.blue} strokeWidth="4" filter="url(#work-chalk)"/>
    <g opacity={1-done}>{line('M983 555 L1017 555',C.blue,draw(scene.planAt+.4))}</g>
    {line('M976 555 L994 573 L1028 534',C.green,done,6)}
    <ChalkText x="1000" y="680" textAnchor="middle" fontSize="54" fill={done>0?C.green:C.white}>一部分</ChalkText>
   </g>
   <g opacity={next}>
    {line('M1084 555 L1306 555 M1287 540 L1306 555 L1287 570',C.blue,draw(scene.steps[1].at,.45))}
    <g opacity={show(scene.steps[1].at+.35)}>
     <circle cx="1390" cy="555" r="52" fill={C.blue} fillOpacity=".07" stroke={C.blue} strokeWidth="4" filter="url(#work-chalk)"/>
     {[1371,1390,1409].map((x,i)=><circle key={x} cx={x} cy="555" r="4.5" fill={C.blue} opacity={show(scene.steps[1].at+.4+i*.1)}/>)}
     <ChalkText x="1390" y="680" textAnchor="middle" fontSize="54" fill={C.blue}>下一部分</ChalkText>
    </g>
   </g>
   <g opacity={advance}>
    {line('M1474 555 L1612 555 M1593 540 L1612 555 L1593 570',C.blue,draw(scene.steps[2].at,.55))}
    {[1640,1660,1680].map(x=><circle key={x} cx={x} cy="555" r="3.5" fill={C.blue}/>)}
   </g>
  </g>
 </svg>;
};
