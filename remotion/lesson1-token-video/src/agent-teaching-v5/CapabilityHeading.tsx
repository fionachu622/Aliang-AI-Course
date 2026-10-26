import React from 'react';
import {ChalkText} from './CourseTypography';
import design from './capability-heading.layout.json';
/** One shared dock position; rules follow the measured bold-font ink bounds. */
export const CapabilityHeading:React.FC<{title:string;dock:number;opacity:number}>=({title,dock,opacity})=>{
 const L=design.layout;
 const metrics=(design.titleMetrics as Record<string,{leftEm:number;rightEm:number;advanceEm:number}>)[title];
 const fallback=[...title].reduce((sum,c)=>sum+(/[\x00-\x7f]/.test(c)?.53:1),0);
 const advance=metrics?.advanceEm??fallback;
 const size=88+(L.size-88)*dock;
 const x=(960-advance*88/2)*(1-dock)+L.left*dock;
 const left=L.left+(metrics?.leftEm??0)*L.size-L.rulePadding;
 const right=L.left+(metrics?.rightEm??fallback)*L.size+L.rulePadding;
 return <g opacity={opacity}>
  <ChalkText x={x} y={550+(L.baseline-550)*dock} fontSize={size} fill="#F5F1E8">{title}</ChalkText>
  <path d={`M${left} ${L.ruleY} Q${(left+right)/2} ${L.ruleY-3} ${right} ${L.ruleY}`} fill="none" stroke="#7CC8EA" strokeWidth={3.5} strokeLinecap="round" opacity={dock>=.999?1:0}/>
 </g>;
};
