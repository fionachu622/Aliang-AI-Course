import React from 'react';
import {ChalkText} from './CourseTypography';
import data from './audience-scenes.json';
const reveal=(t:number,at:number,d=.3)=>{const q=Math.max(0,Math.min(1,(t-at)/d));return q*q*(3-2*q);};
const card='M-179 786 Q-105 783 -40 785 T78 784 Q132 783 177 786 Q199 784 198 805 L200 836 Q197 868 199 899 L198 915 Q199 935 178 934 Q119 937 68 935 Q10 937 -48 935 Q-119 938 -180 934 Q-200 934 -199 914 L-201 869 Q-198 836 -199 806 Q-200 786 -179 786Z';
/** Four fixed axes: role -> selection criterion -> recommended tool. */
export const AudienceRecommendations:React.FC<{seconds:number}>=({seconds:t})=><svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0,fontFamily:'AgentFullHanzi'}} data-audience-layout="reference-four-columns">
 <ChalkText x="960" y="150" textAnchor="middle" fontSize="70" fill="#F5F1E8">{data.title}</ChalkText>
 {data.scenes.map((s,i)=>{
  if(t<s.start)return null;
  const arrowAt=Math.max(s.criterionAt,s.toolAt-.45),arrow=reveal(t,arrowAt,.4);
  return <g key={s.id} transform={`translate(${data.layoutMetrics.columnCenters[i]} 0)`}>
   <g opacity={reveal(t,s.start)}>
    <foreignObject x="-74" y="250" width="148" height="148">
     <div style={{width:148,height:148,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Apple Color Emoji',fontSize:132,lineHeight:1}}>{s.icon}</div>
    </foreignObject>
    <ChalkText y="478" textAnchor="middle" fontSize="64" fill={s.color}>{s.displayWho}</ChalkText>
   </g>
   <ChalkText y="574" textAnchor="middle" fontSize="44" fill="#F5F1E8" opacity={reveal(t,s.criterionAt)}>{s.criterion}</ChalkText>
   <g fill="none" stroke={s.color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity={arrow}>
    <path d="M0 627 Q-3 676 0 731" pathLength="1" strokeDasharray="1" strokeDashoffset={1-arrow}/>
    <path d="M-16 710 L0 733 L17 709" opacity={reveal(t,arrowAt+.25,.15)}/>
   </g>
   <g opacity={reveal(t,s.toolAt)}>
    <path d={card} fill="none" stroke={s.color} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1-reveal(t,s.toolAt,.4)}/>
    <ChalkText y="879" textAnchor="middle" fontSize="56" fill={s.color}>{s.tool}</ChalkText>
   </g>
  </g>;
 })}
</svg>;
