import React from 'react';
import {ChalkText} from './CourseTypography';
import {ChalkDrawingDefs} from './ChalkDrawing';
import data from './closing-summary.json';
const ease=(t:number,at:number)=>{const q=Math.max(0,Math.min(1,(t-at)/.4));return q*q*(3-2*q);};
/** Three bounded takeaways share one baseline and one type hierarchy. */
export const ClosingSummary:React.FC<{seconds:number}>=({seconds:t})=> <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0,fontFamily:'AgentFullHanzi'}}>
 <defs><ChalkDrawingDefs id="closing-panel-chalk"/></defs>
 <ChalkText x={960} y={220} textAnchor="middle" fontSize={96} fill="#F5F1E8">{data.focus.title}</ChalkText>
 {data.focus.items.map((item,i)=>{
  const x=232+i*504,center=x+224,amount=ease(t,item.at);
  const outline=`M${x+28} 350 Q${x+224} 347 ${x+419} 352 Q${x+448} 351 ${x+448} 380 L${x+446} 710 Q${x+448} 739 ${x+417} 740 Q${x+225} 744 ${x+28} 740 Q${x} 741 ${x+1} 711 L${x-1} 381 Q${x} 350 ${x+28} 350 Z`;
  return <g key={item.id} opacity={amount}>
   <path d={outline} fill={item.color} fillOpacity={.075}/>
   <path d={outline} fill="none" stroke={item.color} strokeWidth={3.5} filter="url(#closing-panel-chalk)"/>
   <ChalkText x={center} y={478} textAnchor="middle" fontSize={60} fill={item.color}>{item.subject}</ChalkText>
   <ChalkText x={center} y={625} textAnchor="middle" fontSize={86} fill="#F5F1E8">{item.text}</ChalkText>
  </g>;
 })}
</svg>;
