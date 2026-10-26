import React from 'react';
import {AbsoluteFill,Img,staticFile,interpolate,useCurrentFrame,Easing} from 'remotion';
import {v9Colors as C} from '../v9/VisualV9';
const p=(f:number,s:number,d=12)=>interpolate(f,[s,s+d],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:Easing.bezier(.22,.7,.25,1)});
export const OpeningCoursePath:React.FC=()=>{
 const f=useCurrentFrame();const move=p(f,585,54),exit=p(f,969,18);
 if(f<507)return null;
 const x=1560+(440-1560)*move,y=260+(445-260)*move,size=420+(430-420)*move;
 const rows=[{y:230,at:663,label:'认识 Agent',detail:'从基础概念讲起',detailAt:672,color:C.blue},{y:450,at:718,label:'Agent 使用实战',detail:'从提出需求到把事情做成',detailAt:831,color:C.magenta},{y:670,at:897,label:'Agent 工具介绍',detail:'认识实用工具，上手使用',detailAt:918,color:C.green}];
 return <AbsoluteFill style={{opacity:1-exit,transform:`translateX(${90*move}px)`}}>
  <Img src={staticFile('agent-course/agent-pet-cream-v8.png')} style={{position:'absolute',left:x-size/2,top:y-size*.516,width:size,height:size,opacity:f>=969?0:p(f,507,12)}}/>
  <svg width="1920" height="1080" style={{position:'absolute',inset:0}}>
   <text x={x} y={y+235} textAnchor="middle" fill={C.ink} fontSize="78" opacity={f>=969?0:p(f,585,8)}>Agent</text>
   {rows.map((r,i)=><g key={r.label}>
    <path d={`M640 445 C740 444 750 ${r.y+5} 840 ${r.y}`} fill="none" stroke={r.color} strokeWidth="5" strokeLinecap="round" opacity={f>r.at?.9:0} pathLength={1} strokeDasharray={1} strokeDashoffset={1-p(f,r.at,14)}/>
    <g opacity={p(f,r.at+10,12)} transform={`translate(${8*(1-p(f,r.at+10,12))} 0)`}>
     <g transform={`translate(865 ${r.y-72})`}>
      <path d="M22 5 Q170 0 310 4 Q455 1 552 6 Q570 8 568 29 L570 115 Q568 137 547 139 Q350 144 190 140 L23 142 Q4 139 5 120 L3 28 Q3 9 22 5 Z" fill={r.color} fillOpacity=".13" stroke={r.color} strokeOpacity=".78" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M28 10 Q230 6 421 9 M11 32 Q8 79 12 114 M29 135 Q265 138 475 133" fill="none" stroke={r.color} strokeOpacity=".22" strokeWidth="1.4" strokeLinecap="round"/>
     </g>
     <g transform={`translate(935 ${r.y})`} fill="none" stroke={C.ink} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      {i===0?<><path d="M-28 -37 H12 L30 -19 V35 H-28 Z M12 -37 V-19 H30"/><circle cx="20" cy="10" r="20"/><path d="M35 25 L49 40"/></>:i===1?<><rect x="-38" y="-28" width="76" height="56" rx="5"/><path d="M-9 -15 L16 0 L-9 15 Z"/></>:<><rect x="-38" y="-24" width="76" height="56" rx="5"/><path d="M-17 -24 V-36 H17 V-24 M-38 -4 H38 M-6 -10 V6 H6 V-10"/></>}
     </g>
     <text x="1010" y={r.y-7} fill={r.color} fontSize="48" opacity={1}>{r.label}</text>
     <text x="1010" y={r.y+42} fill={C.ink} fontSize="29" opacity={p(f,Math.max(r.detailAt,r.at+22),10)}>{r.detail}</text>
    </g>
   </g>)}
  </svg>
 </AbsoluteFill>;
};
