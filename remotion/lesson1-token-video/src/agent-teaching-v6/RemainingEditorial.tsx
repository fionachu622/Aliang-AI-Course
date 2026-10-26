import {ChalkText} from './CourseTypography';
import {ClosingSummary} from './ClosingSummary';
import {FeeOverview} from './FeeOverview';
import {AudienceRecommendations} from './AudienceRecommendations';
import React from 'react';
import {SafetyCheckpoints} from './SafetyCheckpoints';
import editorial from './remaining-editorial.storyboard.json';
import recordings from './recordings.timeline.json';
import shots from './script-screenshots.timeline.json';
import {DiagramIcon} from './DiagramIcon';
// After the redesigned section begins, uncovered narration belongs to the presenter.
// Never fall back to an unrelated legacy diagram in a gap between semantic cues.
export const remainingPresenterAt=(seconds:number)=>editorial.presenters.some(p=>seconds>=p.start&&seconds<p.end)||(
 seconds>=480.88 &&
 !editorial.scenes.some(p=>seconds>=p.start&&seconds<p.end) && !(seconds>=1083.5&&seconds<1129.92) &&
 !recordings.some(c=>seconds*30>=c.from&&seconds*30<c.from+c.durationInFrames) &&
 !shots.some(s=>seconds>=s.start&&seconds<s.end) &&
 !(seconds>=958.97&&seconds<1080.3)
);
export const remainingSceneAt=(seconds:number)=>seconds>=1083.5&&seconds<1129.92 ? {id:'audience',start:1083.5,end:1129.92,title:'',nodes:[],edges:[]} : editorial.scenes.find(p=>seconds>=p.start&&seconds<p.end);
const reveal=(t:number,at:number)=>{const q=Math.max(0,Math.min(1,(t-at)/.45));return q*q*(3-2*q);};
/** All cues use the legacy visual clock; the root keeps the original narration untouched. */
export const RemainingEditorial:React.FC<{seconds:number}>=({seconds:t})=>{
 const s=remainingSceneAt(t);if(!s)return null;
 if(s.id==='audience')return <AudienceRecommendations seconds={t}/>;
 if(s.id==='closing-loop')return <ClosingSummary seconds={t}/>;
 if(s.id==='fee-overview')return <FeeOverview seconds={t}/>;
 if(s.id==='safety')return <SafetyCheckpoints seconds={t}/>;
 return <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0,fontFamily:'AgentFullHanzi, HanziPen SC, cursive'}} data-editorial-scene={s.id}>
  <ChalkText x="180" y="205" fontSize="62" fill="#F5F1E8">{s.title}</ChalkText>
  {s.edges.map(([a,b,at],i)=>{const first=s.nodes[a],last=s.nodes[b],p=reveal(t,at);const y=first.y-30;const x1=first.x+(first.icon?140:first.text.length*25+24),x2=last.x-(last.icon?150:last.text.length*25+24);return <g key={i} opacity={p} fill="none" stroke="#7CC8EA" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d={`M${x1} ${y} Q${(x1+x2)/2} ${y-4} ${x2} ${y}`} pathLength="1" strokeDasharray="1" strokeDashoffset={1-p}/><path d={`M${x2-17} ${y-13} L${x2} ${y} L${x2-17} ${y+13}`} opacity={p>.95?1:0}/></g>})}
  {s.nodes.map((n,i)=><g key={i} opacity={reveal(t,n.at)}>
   {n.icon&&<g transform={`translate(${n.x-85} ${n.y-115})`}><DiagramIcon kind={n.icon} color={n.color}/></g>}
   <ChalkText x={n.x} y={n.y+(n.icon?104:0)} textAnchor="middle" fontSize={n.text.length>14?42:49} fill={n.color}>{n.text}</ChalkText>
  </g>)}
 </svg>;
};
