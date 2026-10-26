import {ChalkText} from './CourseTypography';
import React from 'react';
import {AbsoluteFill,Img,staticFile,interpolate,interpolateColors,useCurrentFrame,Easing} from 'remotion';
import {v9Colors as C} from '../v9/VisualV9';
const p=(f:number,s:number,d=12)=>interpolate(f,[s,s+d],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:Easing.bezier(.22,.7,.25,1)});
const neutral='#AEB5B4',neutralIcon='#CED1CB';
const cardOutline='M22 4 Q170 0 310 4 Q455 1 552 6 Q570 7 568 25 L570 100 Q568 115 547 117 Q350 121 190 119 L23 120 Q4 116 5 100 L3 25 Q3 8 22 4 Z';
export const OpeningCoursePath:React.FC=()=>{
 const f=useCurrentFrame();const move=p(f,603,54),exit=p(f,969,18);
 if(f<507)return null;
 const x=1580+(440-1580)*move,y=295+(445-295)*move,size=330+(430-330)*move;
 const rows=[{y:230,at:663,label:'认识 Agent',color:C.blue},{y:450,at:718,label:'Agent 使用实战',color:C.magenta},{y:670,at:897,label:'Agent 工具介绍',color:C.green}];
 const overview=p(f,639,18);
 return <AbsoluteFill style={{opacity:1-exit,transform:`translateX(${90*move}px)`}}>
  <Img src={staticFile('agent-course/agent-pet-cream-v8.png')} style={{position:'absolute',left:x-size/2,top:y-size*.516,width:size,height:size,opacity:f>=969?0:p(f,507,12)}}/>
  <svg width="1920" height="1080" style={{position:'absolute',inset:0}}>
   <ChalkText x={x} y={y+235} textAnchor="middle" fill={C.ink} fontSize="78" opacity={f>=969?0:p(f,603,8)}>Agent</ChalkText>
   {rows.map((r,i)=>{
    const line=`M640 445 C740 444 750 ${r.y+5} 840 ${r.y}`;
    const lineDraw=p(f,r.at,13),cardDraw=p(f,r.at+4,20),colorOn=p(f,r.at+6,14);
    const nextAt=rows[i+1]?.at;
    const focus=colorOn*(nextAt===undefined?1:1-p(f,nextAt,12));
    const breath=0;
    const lift=-8*Math.sin(Math.PI*cardDraw);
    const accent=interpolateColors(colorOn,[0,1],[neutral,r.color]);
    const iconColor=interpolateColors(colorOn,[0,1],[neutralIcon,C.ink]);
    return <g key={r.label} opacity={overview}>
    <path d={line} fill="none" stroke={neutral} strokeWidth="5" strokeLinecap="round" opacity={.62*p(f,r.at,13)}/>
    <path d={line} fill="none" stroke={r.color} strokeWidth="5" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1-lineDraw} opacity=".95"/>
    <g opacity={p(f,r.at,8)} transform={`translate(0 ${lift})`}>
     <g transform={`translate(865 ${r.y-60})`}>
      <path d={cardOutline} fill="none" stroke={r.color} strokeOpacity={(.1*focus+.11*breath)*cardDraw} strokeWidth={12+2*breath} strokeLinecap="round" strokeLinejoin="round"/>
      <path d={cardOutline} fill={accent} fillOpacity={.05+.07*colorOn+.07*breath} stroke={neutral} strokeOpacity=".62" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d={cardOutline} fill="none" stroke={r.color} strokeOpacity={.9+.1*focus} strokeWidth={3.5+1.2*breath} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1-cardDraw}/>
      <path d="M28 10 Q230 6 421 9 M11 32 Q8 67 12 93 M29 112 Q265 116 475 111" fill="none" stroke={accent} strokeOpacity=".25" strokeWidth="1.4" strokeLinecap="round"/>
     </g>
     <g transform={`translate(935 ${r.y})`} fill="none" stroke={iconColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      {i===0?<><path d="M-28 -37 H12 L30 -19 V35 H-28 Z M12 -37 V-19 H30"/><circle cx="20" cy="10" r="20"/><path d="M35 25 L49 40"/></>:i===1?<><rect x="-38" y="-28" width="76" height="56" rx="5"/><path d="M-9 -15 L16 0 L-9 15 Z"/></>:<><rect x="-38" y="-24" width="76" height="56" rx="5"/><path d="M-17 -24 V-36 H17 V-24 M-38 -4 H38 M-6 -10 V6 H6 V-10"/></>}
     </g>
     <ChalkText x="1010" y={r.y+17} fill={accent} fontSize="48">{r.label}</ChalkText>
    </g>
   </g>})}
  </svg>
 </AbsoluteFill>;
};
