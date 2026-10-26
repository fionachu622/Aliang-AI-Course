import {ChalkText} from './CourseTypography';
import React from 'react';
import data from './safety-checkpoints.json';
const reveal=(t:number,at:number)=>{const p=Math.max(0,Math.min(1,(t-at)/.45));return p*p*(3-2*p);};
// Fixed, slightly irregular outlines: no frame-to-frame jitter.
const outline=(x:number,y:number,w:number,h:number)=>`M${x+19} ${y+2} Q${x+w*.45} ${y-3} ${x+w-17} ${y+2} Q${x+w+1} ${y+1} ${x+w-1} ${y+19} L${x+w+2} ${y+h-18} Q${x+w} ${y+h+2} ${x+w-18} ${y+h-1} Q${x+w*.5} ${y+h+3} ${x+18} ${y+h} Q${x-2} ${y+h+1} ${x+1} ${y+h-19} L${x-1} ${y+19} Q${x+1} ${y+1} ${x+19} ${y+2} Z`;
export const SafetyCheckpoints:React.FC<{seconds:number}>=({seconds:t})=>(
 <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0,fontFamily:'AgentFullHanzi, HanziPen SC, cursive',fontWeight:600}}>
  <ChalkText x="960" y="186" textAnchor="middle" fontSize="80" fill="#F5F1E8" stroke="#F5F1E8" strokeWidth=".6">{data.title}</ChalkText>
  {data.items.map((item,i)=>{
   const y=300+i*225,p=reveal(t,item.at),detail=reveal(t,item.detailAt),color=['#F0D26A','#A4D486','#F18D9E'][i];
   return <g key={item.number} opacity={p}>
    <ChalkText x="232" y={y+117} textAnchor="middle" fontSize="84" fill={color}>{item.number}</ChalkText>
    <path d={outline(320,y+32,480,122)} fill="none" stroke="#F5F1E8" strokeWidth="3.6" strokeLinejoin="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1-p}/>
    <ChalkText x="560" y={y+117} textAnchor="middle" fontSize="66" fill="#F5F1E8" stroke="#F5F1E8" strokeWidth=".55">{item.label}</ChalkText>
    <g opacity={detail}>
     <path d={`M830 ${y+93} Q890 ${y+90} 942 ${y+93}`} fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1-detail}/>
     <path d={`M923 ${y+77} L947 ${y+93} L923 ${y+109}`} fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity={detail>.95?1:0}/>
     <path d={outline(978,y,665,185)} fill="none" stroke={color} strokeWidth="3.6" strokeLinejoin="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1-detail}/>
     <ChalkText x="1310" y={y+61} textAnchor="middle" fontSize="40" fill="#F5F1E8">{item.lines[0]}</ChalkText>
     <ChalkText x="1310" y={y+150} textAnchor="middle" fontSize="65" fill={color} stroke={color} strokeWidth=".55">{item.lines[1]}</ChalkText>
    </g>
   </g>;
  })}
 </svg>
);
