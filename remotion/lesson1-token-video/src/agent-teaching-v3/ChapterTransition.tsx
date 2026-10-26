import {ChalkText} from './CourseTypography';
import React from 'react';
import {useCurrentFrame, staticFile} from 'remotion';
import chapters from './chapters.timeline.json';
import {DiagramIcon} from './DiagramIcon';
const smooth=(x:number)=>{const q=Math.max(0,Math.min(1,x));return q*q*(3-2*q);};
export const activeChapter=(seconds:number)=>chapters.find(c=>seconds>=c.start&&seconds<c.end);
export const ChapterArtwork:React.FC<{seconds:number;assetUrl:(path:string)=>string}>=({seconds,assetUrl})=>{
 // Keep the naming explanation as the only central focus.
 if(seconds>=chapters[0].start&&seconds<52.12)return <svg width="1920" height="1080" style={{position:'absolute',inset:0,pointerEvents:'none',fontFamily:'AgentFullHanzi, HanziPen SC, cursive'}}>
  <g opacity={smooth((seconds-chapters[0].start)/.3)*(1-smooth((seconds-51.72)/.4))} transform="translate(260 76) scale(.24)">
   <ChalkText x="80" y="-150" textAnchor="middle" fill="#7CC8EA" fontSize="43" letterSpacing="8">第 01 章</ChalkText>
   <ChalkText x="80" y="5" textAnchor="middle" fill="#F5F1E8" fontSize="112">认识 Agent</ChalkText>
   <path d="M-130 67 H290" stroke="#7CC8EA" strokeWidth="4"/>
  </g>
 </svg>;
 const c=activeChapter(seconds);if(!c)return null;
 const enter=smooth((seconds-c.start)/.3),dock=smooth((seconds-(c.end-.65))/.65);
 const alpha=enter*(1-smooth((seconds-(c.end-.22))/.22));
 return <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0,pointerEvents:'none',fontFamily:'AgentFullHanzi, HanziPen SC, cursive'}} data-chapter={c.id}>
  <image href={assetUrl('shared-visual/backgrounds/chalkboard/chalkboard.png')} width="1920" height="1080" preserveAspectRatio="xMidYMid slice" opacity={enter*(1-dock)}/>
  <g opacity={alpha} transform={`translate(${960-570*dock} ${445-330*dock+20*(1-enter)}) scale(${1-.55*dock})`}>
   {c.id==='concept'?<image href={assetUrl('agent-course/agent-pet-cream-v8.png')} x="-580" y="-190" width="330" height="330"/>:<g transform="translate(-490 -105) scale(1.25)"><DiagramIcon kind={c.id==='practice'?'video':'tool'} color={c.color}/></g>}
   <ChalkText x="80" y="-150" textAnchor="middle" fill={c.color} fontSize="43" letterSpacing="8">第 {c.number} 章</ChalkText>
   <ChalkText x="80" y="5" textAnchor="middle" fill="#F5F1E8" fontSize="112">{c.title}</ChalkText>
   <path d="M-130 67 H290" stroke={c.color} strokeWidth="4" pathLength="1" strokeDasharray="1" strokeDashoffset={1-enter}/>
  </g>
 </svg>;
};
export const ChapterTransition=()=> <ChapterArtwork seconds={useCurrentFrame()/30} assetUrl={staticFile}/>;
