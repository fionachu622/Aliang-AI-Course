import React from 'react';
import {ChalkText} from './CourseTypography';
import storyboard from './continuous-diagrams.storyboard.json';

const s=storyboard.mechanism_page;
const ease=(t:number,a:number,d=.5)=>{const p=Math.max(0,Math.min(1,(t-a)/d));return p*p*(3-2*p);};
const ink='#F5F1E8',blue='#7CC8EA',gold='#F0D26A',green='#A4D486',pink='#F18D9E';
const centers=[270,730,1190,1650];

export const MechanismPage:React.FC<{seconds:number}>=({seconds})=>{
 const t=seconds-43/30,dock=ease(t,s.dockAt,.9);
 const show=(at:number)=>ease(t,at);
 const brain=show(s.parts[0].at),memory=show(s.parts[1].at),tools=show(s.parts[2].at),plan=show(s.parts[3].at);
 const loop=show(s.loopAt),feedback=show(s.feedbackAt);
 const feedbackTravel=ease(t,s.diagramCues.feedbackTravel,1.2);
 const brainX=960+(centers[0]-960)*ease(t,386.5,1.5);
 return <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0,fontFamily:'AgentFullHanzi, HanziPen SC, cursive'}}>
  <defs>
   <marker id="mechanism-arrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto"><path d="M1 1 L8 5 L1 9" fill="none" stroke={blue} strokeWidth="1.4"/></marker>
   <marker id="mechanism-pink-arrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto"><path d="M1 1 L8 5 L1 9" fill="none" stroke={pink} strokeWidth="1.4"/></marker>
  </defs>
  <ChalkText x="960" y={530-365*dock} textAnchor="middle" fontSize={88-24*dock} fill={ink} opacity={show(s.start)}>{s.question}</ChalkText>
  <ChalkText x="960" y="258" textAnchor="middle" fontSize="48" fill={gold} opacity={show(s.subtitleAt)}>{s.subtitle}</ChalkText>

  <g opacity={brain}>
   <g transform={`translate(${brainX} 445)`} stroke={blue} strokeWidth="4" fill="none" strokeLinecap="round">
    <path d="M-5 -91 C-45 -117 -94 -75 -80 -43 C-125 -19 -103 43 -76 45 C-86 89 -30 111 -5 84 M5 -91 C45 -117 94 -75 80 -43 C125 -19 103 43 76 45 C86 89 30 111 5 84 M0 -88 L0 91"/>
    <path d="M-45 -70 Q-70 -45 -35 -25 Q-10 -10 -35 10 M-75 35 Q-29 25 -33 65 M45 -70 Q70 -45 35 -25 Q10 -10 35 10 M75 35 Q29 25 33 65"/>
   </g>
   <ChalkText x={brainX} y="650" textAnchor="middle" fontSize="60" fill={blue}>大模型</ChalkText>
  </g>

  <g opacity={memory}>
   <g transform={`translate(${centers[1]} 445)`} fill="none" stroke={gold} strokeWidth="4" strokeLinecap="round">
    <path d="M-87 -104 Q-9 -117 0 -90 Q18 -116 90 -101 L90 81 Q26 66 0 95 Q-28 68 -87 83Z M0 -89 L0 94"/>
    <path d="M-64 -55 L-22 -51 M-64 -20 L-22 -16 M-64 15 L-22 19 M24 -52 L67 -59 M24 -17 L67 -24 M24 18 L67 11"/>
   </g>
   <ChalkText x={centers[1]} y="650" textAnchor="middle" fontSize="60" fill={gold}>记忆</ChalkText>
  </g>

  <g opacity={tools}>
   <g transform={`translate(${centers[2]} 445)`} stroke={green} strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <g opacity={show(407.5)}><circle cx="-70" cy="-55" r="25"/><path d="M-51 -36 L-26 -11 M40 -86 L78 -86 L99 -63 L99 -8 L40 -8Z M78 -86 L78 -63 L99 -63"/></g>
    <g opacity={show(409)}><path d="M-86 28 L-106 48 L-86 68 M-51 28 L-31 48 L-51 68 M-62 22 L-75 74 M31 14 L113 14 L113 77 L31 77Z M31 32 L113 32 M41 23 L44 23 M52 23 L55 23"/></g>
   </g>
   <ChalkText x={centers[2]} y="650" textAnchor="middle" fontSize="60" fill={green}>工具</ChalkText>
  </g>

  <g opacity={plan}>
   <g transform={`translate(${centers[3]} 445)`} fill="none" stroke={pink} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
    <rect x="-90" y="-91" width="180" height="188" rx="14"/>
    <path d="M-34 -101 H34 Q42 -101 42 -91 V-78 H-42 V-91 Q-42 -101 -34 -101Z"/>
    <g opacity={show(424)}><path d="M-60 -43 l9 9 15 -19 M-19 -43 H57"/></g>
    <g opacity={show(424.6)}><path d="M-60 -2 l9 9 15 -19 M-19 -2 H44"/></g>
    <g opacity={show(425.2)}><rect x="-61" y="36" width="26" height="26" rx="3"/><path d="M-19 49 H34"/></g>
    <g opacity={show(435)}><path d="M61 26 Q91 54 55 76 Q34 87 12 70" markerEnd="url(#mechanism-pink-arrow)"/></g>
   </g>
   <ChalkText x={centers[3]} y="650" textAnchor="middle" fontSize="54" fill={pink}>规划和调整</ChalkText>
  </g>

  <g opacity={loop}>
   <ChalkText x="340" y="840" textAnchor="middle" fontSize="42" fill={gold} opacity={show(441.5)}>观察</ChalkText>
   <ChalkText x="750" y="840" textAnchor="middle" fontSize="42" fill={blue} opacity={show(443.8)}>思考</ChalkText>
   <ChalkText x="1160" y="840" textAnchor="middle" fontSize="42" fill={green} opacity={show(446)}>行动</ChalkText>
   <ChalkText x="1570" y="840" textAnchor="middle" fontSize="42" fill={pink} opacity={show(448)}>新结果</ChalkText>
   <g fill="none" stroke={blue} strokeWidth="3" strokeLinecap="round">
    {[
     {d:'M455 825 H630',at:443.8},
     {d:'M865 825 H1040',at:446},
     {d:'M1275 825 H1435',at:448},
    ].map(({d,at})=>{const draw=show(at);return <path key={at} d={d} pathLength={1} strokeDasharray={1} strokeDashoffset={1-draw} markerEnd={draw>.95?'url(#mechanism-arrow)':undefined}/>})}
    <path d="M1665 875 V975 Q1665 995 1645 995 H300 Q280 995 280 975 V870" pathLength={1} strokeDasharray={1} strokeDashoffset={1-feedbackTravel} markerEnd={feedbackTravel>.95?'url(#mechanism-arrow)':undefined}/>
   </g>
   <ChalkText x="960" y="955" textAnchor="middle" fontSize="40" fill={blue} opacity={feedback}>反馈</ChalkText>
  </g>
 </svg>;
};
