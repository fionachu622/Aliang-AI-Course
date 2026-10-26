import React from 'react';
import {staticFile} from 'remotion';
import {CueDraw} from './CourseMotion';
import {ChalkText} from './CourseTypography';
import storyboard from './continuous-diagrams.storyboard.json';
const s=storyboard.mechanism_page;
const ease=(t:number,a:number,d=.5)=>{const p=Math.max(0,Math.min(1,(t-a)/d));return p*p*(3-2*p);};
const ink='#F5F1E8',blue='#7CC8EA',gold='#F0D26A',green='#A4D486',pink='#F18D9E';
// Fixed, gently uneven contours: a single hand-drawn outline per ability.
const framePath=(x:number,y:number,w:number,h:number)=>`M${x+19} ${y+2} Q${x+w*.25} ${y-2} ${x+w*.48} ${y+1} T${x+w-19} ${y} Q${x+w-3} ${y-1} ${x+w-1} ${y+18} L${x+w+1} ${y+h*.53} L${x+w-2} ${y+h-19} Q${x+w-1} ${y+h} ${x+w-20} ${y+h+1} Q${x+w*.55} ${y+h-2} ${x+w*.3} ${y+h+1} L${x+20} ${y+h} Q${x-2} ${y+h} ${x} ${y+h-20} L${x-2} ${y+h*.45} L${x+1} ${y+20} Q${x} ${y+3} ${x+19} ${y+2} Z`;
export const MechanismPage:React.FC<{seconds:number}>=({seconds})=>{
 const t=seconds-43/30,show=(at:number)=>ease(t,at),dock=ease(t,s.dockAt,.9);
 const abilityOpacity=1-ease(t,s.loopAt,.3);
 if(t>=s.loopAt+.3)return <WorkCycle t={t}/>;
 const nodes=[
  {name:'model',title:'大模型',note:'理解与判断',x:710,y:360,w:500,h:230,color:gold,at:s.parts[0].at,noteAt:383.4,iconOffset:132},
  {name:'memory',title:'记忆',note:'信息与进度',x:100,y:360,w:500,h:230,color:blue,at:s.parts[1].at,noteAt:392,iconOffset:108},
  {name:'tools',title:'工具',note:'执行操作',x:1320,y:360,w:500,h:230,color:green,at:s.parts[2].at,noteAt:413,iconOffset:108},
  {name:'planning',title:'规划与调整',note:'分步推进 · 及时调整',x:660,y:720,w:600,h:200,color:pink,at:s.parts[3].at,noteAt:435,iconOffset:186},
 ];
 return <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}}> 
  <defs><marker id="mechanism-reference-arrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto"><path d="M1 1 L8 5 L1 9" fill="none" stroke="context-stroke" strokeWidth="1.2"/></marker></defs>
  <ChalkText x={960} y={530-365*dock} textAnchor="middle" fontSize={88-24*dock} fill={ink} opacity={show(s.start)}>{s.question}</ChalkText>
  <g opacity={abilityOpacity}>
  <ChalkText x={960} y={258} textAnchor="middle" fontSize={46} fill={gold} opacity={show(s.subtitleAt)}>{s.subtitle}</ChalkText>
  {nodes.map(n=>{const center=n.x+n.w/2;return <g key={n.name} opacity={show(n.at)}>
   <CueDraw t={t} at={n.at} duration={.6}><path d={framePath(n.x,n.y,n.w,n.h)} fill="none" stroke={n.color} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round"/></CueDraw>
   <image href={staticFile(`agent-course/mechanism-illustrations/${n.name}.png`)} x={center-n.iconOffset-34} y={n.y+34} width={68} height={68} preserveAspectRatio="xMidYMid meet" style={{filter:'saturate(.65)'}}/>
   <ChalkText x={center+36} y={n.y+91} textAnchor="middle" fontSize={56} fill={n.color}>{n.title}</ChalkText>
   <ChalkText x={center} y={n.y+n.h-40} textAnchor="middle" fontSize={38} fill={n.color} opacity={show(n.noteAt)}>{n.note}</ChalkText>
  </g>})}
  {[
   {d:'M696 475 Q657 473 614 475',color:blue,at:s.parts[1].at+.4},
   {d:'M1224 475 Q1266 473 1306 475',color:green,at:s.parts[2].at+.4},
   {d:'M960 605 Q963 652 960 703',color:pink,at:s.parts[3].at+.4},
  ].map(a=><g key={a.d} opacity={show(a.at)}><CueDraw t={t} at={a.at} duration={.5}><path d={a.d} fill="none" stroke={a.color} strokeWidth={3.5} strokeLinecap="round" markerEnd={show(a.at)>.95?'url(#mechanism-reference-arrow)':undefined}/></CueDraw></g>)}
 </g>
 </svg>;
};

// A separate page expresses the chronological loop, rather than equating
// supporting capabilities with observation or feedback.
const WorkCycle:React.FC<{t:number}>=({t})=>{
 const show=(at:number)=>ease(t,at);
 const nodes=[
  {title:'观察',note:'当前信息',x:280,y:500,w:350,color:blue,at:441.5,noteAt:441.5},
  {title:'思考',note:'下一步做什么',x:785,y:335,w:350,color:green,at:443.8,noteAt:443.8},
  {title:'行动',note:'调用工具',x:1290,y:500,w:350,color:pink,at:446,noteAt:446},
  {title:'新结果',note:'下一轮的依据',x:765,y:740,w:390,color:gold,at:448,noteAt:450},
 ];
 const arrows=[
  {d:'M575 482 Q655 415 763 415',at:443.8},
  {d:'M1155 415 Q1325 425 1370 482',at:446},
  {d:'M1390 680 Q1310 748 1175 790',at:448},
  {d:'M745 790 Q535 755 450 680',at:450},
 ];
 return <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}}>
  <defs><marker id="work-cycle-arrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto"><path d="M1 1 L8 5 L1 9" fill="none" stroke={ink} strokeWidth="1.2"/></marker></defs>
  <ChalkText x={960} y={165} textAnchor="middle" fontSize={64} fill={ink}>{s.question}</ChalkText>
  <ChalkText x={960} y={258} textAnchor="middle" fontSize={46} fill={gold} opacity={show(s.loopAt+.3)}>核心工作循环</ChalkText>
  {nodes.map(n=><g key={n.title} opacity={show(n.at)}>
   <CueDraw t={t} at={n.at} duration={.5}><path d={framePath(n.x,n.y,n.w,160)} fill="none" stroke={n.color} strokeWidth={3.5}/></CueDraw>
   <ChalkText x={n.x+n.w/2} y={n.y+65} textAnchor="middle" fontSize={56} fill={n.color}>{n.title}</ChalkText>
   <ChalkText x={n.x+n.w/2} y={n.y+124} textAnchor="middle" fontSize={36} fill={n.color} opacity={show(n.noteAt)}>{n.note}</ChalkText>
  </g>)}
  {arrows.map(a=><g key={a.d} opacity={show(a.at)}><CueDraw t={t} at={a.at} duration={.6}><path d={a.d} fill="none" stroke={ink} strokeWidth={3.5} strokeLinecap="round" markerEnd={ease(t,a.at,.6)>.95?'url(#work-cycle-arrow)':undefined}/></CueDraw></g>)}
  <ChalkText x={960} y={595} textAnchor="middle" fontSize={54} fill={gold} opacity={show(s.goalAt)}>循环往复</ChalkText>
  <ChalkText x={960} y={670} textAnchor="middle" fontSize={54} fill={gold} opacity={show(s.goalAt+.4)}>直到完成目标</ChalkText>
 </svg>;
};
