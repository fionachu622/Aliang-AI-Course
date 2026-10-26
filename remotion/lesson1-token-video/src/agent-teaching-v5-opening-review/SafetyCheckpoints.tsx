import {ChalkText} from './CourseTypography';
import React from 'react';
import {DiagramIcon} from './DiagramIcon';
import data from './safety-checkpoints.json';
const p=(t:number,at:number)=>{const q=Math.max(0,Math.min(1,(t-at)/.4));return q*q*(3-2*q);};
export const SafetyCheckpoints:React.FC<{seconds:number}>=({seconds:t})=><svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0,fontFamily:'AgentFullHanzi'}}>
 <ChalkText x="960" y="165" textAnchor="middle" fontSize="76" fill="#F5F1E8">{data.title}</ChalkText>
 {data.items.map((item,i)=>{const x=[340,960,1580][i],color=['#F0D26A','#A4D486','#F18D9E'][i];return <g key={item.number} opacity={p(t,item.at)}>
  <ChalkText x={x} y="322" textAnchor="middle" fontSize={item.label.length>4?60:66} fill={color}>{item.label}</ChalkText>
  <g transform={`translate(${x-102} 418) scale(1.2)`}><DiagramIcon kind={item.icon} color={color} progress={p(t,item.at)}/></g>
  <g opacity={p(t,item.detailAt)}>
   <ChalkText x={x} y="675" textAnchor="middle" fontSize="40" fill="#F5F1E8">{item.lines[0]}</ChalkText>
   <ChalkText x={x} y="790" textAnchor="middle" fontSize="73" fill={color}>{item.lines[1]}</ChalkText>
   <path d={`M${x-105} 839 Q${x} 835 ${x+105} 839`} fill="none" stroke={color} strokeWidth="4" pathLength="1" strokeDasharray="1" strokeDashoffset={1-p(t,item.detailAt+.2)}/>
  </g>
 </g>})}
</svg>;
