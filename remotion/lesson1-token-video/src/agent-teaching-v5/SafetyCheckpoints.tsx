import {ChalkText} from './CourseTypography';
import React from 'react';
import data from './safety-checkpoints.json';
const p=(t:number,at:number)=>{const q=Math.max(0,Math.min(1,(t-at)/.4));return q*q*(3-2*q);};
const ink='#F5F1E8';
// Custom chalk illustrations: filled silhouettes provide weight without warning frames.
const SafetyArt:React.FC<{index:number;color:string}>=({index,color})=><g fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} stroke={color}>
 {index===0?<>
  <path d="M-83 -34 L-29 -34 L79 -91 L79 61 L-29 11 L-83 11 Q-99 -9 -83 -34Z" fill={color} fillOpacity={.16}/>
  <path d="M-29 -33 L-29 11 M-72 14 L-53 83 L-18 80 L-35 17" fill={color} fillOpacity={.3}/>
  <path d="M78 -91 Q109 -10 78 61 Q55 -12 78 -91Z" fill="#282C30"/>
  <path d="M116 -38 L143 -51 M121 -10 L155 -9 M115 18 L142 34" stroke={ink} strokeWidth={3}/>
  <path d="M-69 -20 L-42 -20 M-13 -28 L44 -57 M-13 -15 L41 -40" opacity={.55}/>
 </>:index===1?<>
  <path d="M-91 -86 L-7 -101 L30 -70 L47 34 L-63 50Z" fill={ink} fillOpacity={.12} stroke={ink} transform="rotate(-10)"/>
  <path d="M-66 -65 L-24 -72 M-63 -47 L-7 -55" stroke={ink} opacity={.7}/>
  <path d="M-65 -20 L85 -20 L67 104 L-47 104Z" fill={color} fillOpacity={.2}/>
  <path d="M-76 -25 Q5 -33 96 -25 M-18 -41 L-15 -54 L35 -54 L39 -41 M-20 3 L-14 76 M13 2 L13 77 M48 3 L42 76"/>
 </>:<>
  <path d="M-120 -54 Q-120 -69 -105 -69 L103 -69 Q119 -69 119 -53 L119 75 Q119 88 103 88 L-104 88 Q-120 88 -120 73Z" fill={color} fillOpacity={.18}/>
  <path d="M-117 -33 L117 -32 L117 -6 L-117 -7Z" fill={color} fillOpacity={.55} stroke="none"/>
  <path d="M-88 19 L-46 19 L-46 49 L-89 49Z M-67 20 V48" stroke={ink} fill={ink} fillOpacity={.1}/>
  <path d="M-88 67 L-19 67 M7 67 L45 67" stroke={ink} strokeWidth={3}/>
  <circle cx="85" cy="-74" r="35" fill="#303336" stroke="#F0D26A"/><path d="M71 -75 L81 -63 L102 -87" stroke="#F0D26A"/>
 </>}
</g>;
export const SafetyCheckpoints:React.FC<{seconds:number}>=({seconds:t})=><svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}}>
 <ChalkText x={960} y={165} textAnchor="middle" fontSize={64} fill={ink}>{data.title}</ChalkText>
 {data.items.map((item,i)=>{const x=[440,960,1480][i];return <g key={item.number} opacity={p(t,item.at)}>
  <g transform={`translate(${x} 370) scale(.55)`}><SafetyArt index={i} color="#F0D26A"/></g>
  <ChalkText x={x} y={525} textAnchor="middle" fontSize={62} fill="#F18D9E">{item.label}</ChalkText>
  <g opacity={p(t,item.detailAt)}>
   <ChalkText x={x} y={635} textAnchor="middle" fontSize={44} fill={ink}>{item.lines[0]}</ChalkText>
  </g>
 </g>})}
</svg>;
