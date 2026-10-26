import {ChalkText} from './CourseTypography';
import React from 'react';
import {DiagramIcon} from './DiagramIcon';
import {ChalkCard} from './ChalkCard';
import data from './safety-checkpoints.json';
const p=(t:number,at:number)=>{const q=Math.max(0,Math.min(1,(t-at)/.4));return q*q*(3-2*q);};
export const SafetyCheckpoints:React.FC<{seconds:number}>=({seconds:t})=><svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0,fontFamily:'AgentFullHanzi'}}>
 <ChalkText x="960" y="150" textAnchor="middle" fontSize="76" fill="#F5F1E8">{data.title}</ChalkText>
 {data.items.map((item,i)=>{const x=[340,960,1580][i],color=['#F0D26A','#A4D486','#F18D9E'][i];const cv=p(t,item.at);return <g key={item.number} opacity={cv}>
  <ChalkCard x={x-242} y={196} w={484} h={712} color={color} progress={cv} doubleLine/>
  <circle cx={x} cy={272} r={38} fill={color} fillOpacity={.1} stroke={color} strokeWidth="4" strokeDasharray="1" strokeDashoffset={1-cv} pathLength={1}/>
  <ChalkText x={x} y={296} textAnchor="middle" fontSize="52" fill={color}>{item.number}</ChalkText>
  <ChalkText x={x} y={386} textAnchor="middle" fontSize={item.label.length>4?58:64} fill={color}>{item.label}</ChalkText>
  <g transform={`translate(${x-102} 452) scale(1.2)`}><DiagramIcon kind={item.icon} color={color} progress={cv}/></g>
  <g opacity={p(t,item.detailAt)}>
   <ChalkText x={x} y={708} textAnchor="middle" fontSize="42" fill="#F5F1E8">{item.lines[0]}</ChalkText>
   <ChalkText x={x} y={812} textAnchor="middle" fontSize="72" fill={color}>{item.lines[1]}</ChalkText>
   <path d={`M${x-110} 856 Q${x} 850 ${x+110} 856`} fill="none" stroke={color} strokeWidth="4" pathLength="1" strokeDasharray="1" strokeDashoffset={1-p(t,item.detailAt+.2)}/>
  </g>
 </g>})}
</svg>;
