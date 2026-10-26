import {ChalkText} from './CourseTypography';
import React from 'react';
import {AbsoluteFill,Img,staticFile,interpolate,interpolateColors,useCurrentFrame,Easing} from 'remotion';
import {v9Colors as C} from '../v9/VisualV9';
import {openingHandoffProgress} from './opening-layout';
const p=(f:number,s:number,d=12)=>interpolate(f,[s,s+d],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:Easing.bezier(.22,.7,.25,1)});
const neutral='#AEB5B4';
export const OpeningCoursePath:React.FC=()=>{
 const f=useCurrentFrame();const move=openingHandoffProgress(f),exit=p(f,969,18);
 if(f<507)return null;
 const x=1560+(530-1560)*move,y=260+(445-260)*move,size=420+(430-420)*move;
 // Greeting settles as the shared person/pet handoff begins.
 const greeting=p(f,507,12)*(1-move);
 const elapsed=Math.max(0,f-507);
 const bob=-6*Math.sin(elapsed*Math.PI*2/72)*greeting;
 const tilt=1.15*Math.sin(elapsed*Math.PI*2/54)*greeting;
 const signal=p(f,515,4)*(1-p(f,579,12));
 const rows=[{y:230,at:663,label:'认识 Agent',color:C.blue},{y:450,at:718,label:'Agent 使用实战',color:C.magenta},{y:670,at:897,label:'Agent 工具介绍',color:C.yellow}];
 const overview=p(f,639,18);
 return <AbsoluteFill data-opening-path="fixed-canvas" style={{opacity:1-exit}}>
  <Img src={staticFile('agent-course/agent-pet-cream-v8.png')} style={{position:'absolute',left:x-size/2,top:y-size*.516,width:size,height:size,transform:`translateY(${bob}px) rotate(${tilt}deg)`,transformOrigin:'50% 50%',opacity:f>=969?0:p(f,507,12)}}/>
  <svg width="1920" height="1080" style={{position:'absolute',inset:0}}>
   {f>=515&&f<591&&<g aria-label="Agent 发出信号" fill="none" stroke="#ffbd70" strokeWidth="3.2" strokeLinecap="round" opacity={signal}>
    {[0,1,2].map(i=>{
     const q=((f-515+i*10)%32)/32;
     const sourceX=x-size*.31,cy=y-12+bob;
     const spread=12+68*q,halfHeight=12+30*q;
     return <path key={i} opacity={Math.sin(Math.PI*q)*.88} d={`M${sourceX-spread+8} ${cy-halfHeight} Q${sourceX-spread-9} ${cy-3} ${sourceX-spread+7} ${cy+halfHeight}`}/>;
    })}
   </g>}
   <ChalkText x={x} y={y+235} textAnchor="middle" fill={C.ink} fontSize="78" opacity={f>=969?0:p(f,639,8)}>Agent</ChalkText>
   {rows.map((r,i)=>{
    const line=`M640 445 C740 444 750 ${r.y+5} 870 ${r.y}`;
    const lineDraw=p(f,r.at,13),colorOn=p(f,r.at+6,14);
    const accent=interpolateColors(colorOn,[0,1],[neutral,r.color]);
    // Short, uneven strokes keep the silhouette hand drawn without a second outline.
    const panel=`M894 -80 Q916 -81 940 -79 L980 -81 1020 -79 1060 -80 1100 -79 1140 -81 1180 -79 1220 -80 1260 -79 1300 -81 1340 -79 1380 -80 1420 -79 1460 -81 1500 -79 1535 -80 Q1556 -79 1560 -58 L1559 -23 1561 11 1560 50 Q1561 76 1537 79 L1490 80 1450 78 1410 80 1370 79 1330 81 1290 79 1250 80 1210 79 1170 81 1130 79 1090 80 1050 79 1010 81 970 79 930 80 894 79 Q869 79 870 54 L871 18 869 -17 870 -51 Q869 -74 894 -80 Z`;
    return <g key={r.label} opacity={overview} transform={`translate(${90*move} 0)`}>
    <path d={line} fill="none" stroke={neutral} strokeWidth="5" strokeLinecap="round" opacity=".62"/>
    <path d={line} fill="none" stroke={r.color} strokeWidth="5" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1-lineDraw} opacity=".95"/>
    <g>
     <path d={panel} transform={`translate(0 ${r.y})`} fill={accent} fillOpacity={.025+.115*colorOn} stroke={accent} strokeWidth="3.8" strokeLinecap="round" strokeLinejoin="round"/>
     <circle cx="870" cy={r.y} r="8.5" fill={accent}/>
     <g transform={`translate(950 ${r.y})`} fill="none" stroke={accent} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M50 -1 C51 26 29 50 1 50 C-27 51 -50 30 -50 2 C-51 -25 -29 -49 -2 -50 C25 -51 49 -29 50 -1 Z"/>
      {i===0?<><path d="M-17 -8 C-28 -29 -11 -34 0 -34 C19 -34 26 -15 15 -2 Q7 7 7 13 H-7 Q-7 5 -17 -8 Z"/><path d="M-8 20 H8 M-5 27 H5"/></>:i===1?<><path d="M-27 -23 Q-29 -23 -29 -19 V12 Q-29 17 -24 17 H24 Q29 17 29 12 V-18 Q29 -23 24 -23 Z"/><path d="M-7 -13 L13 -2 L-7 9 Z" fill={accent} strokeWidth="2"/><path d="M-12 26 H12"/></>:<><path d="M-27 -16 Q-29 -16 -29 -11 V16 Q-29 21 -24 21 H25 Q30 21 30 16 V-11 Q30 -16 25 -16 Z"/><path d="M-11 -16 V-24 Q-11 -27 -7 -27 H8 Q12 -27 12 -23 V-16 M-28 -2 H29"/><rect x="-7" y="-7" width="14" height="12" rx="3" fill={accent}/></>}
     </g>
     <ChalkText x="1045" y={r.y+22} fill={accent} fontSize="62">{r.label}</ChalkText>
    </g>
   </g>})}
  </svg>
 </AbsoluteFill>;
};
