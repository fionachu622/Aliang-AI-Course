import React from 'react';
import {Img, staticFile, interpolate, Easing, Sequence} from 'remotion';
import {Audio} from '@remotion/media';
const W='#F5F1E8', B='#7CC8EA', P='#F18D9E', G='#A4D486', Y='#F0D26A';
const r=(f:number,a:number,d=30)=>interpolate(f,[a,a+d],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:Easing.bezier(.22,.7,.25,1)});
const mix=(a:number,b:number,p:number)=>a+(b-a)*p;
const label=(x:number,y:number,text:string,size=40,color=W)=><text x={x} y={y} textAnchor="middle" fill={color} stroke="none" fontSize={size}>{text}</text>;
function Bot({x,y,scale=1,frame}:{x:number;y:number;scale?:number;frame:number}) {
 const t=Math.max(0,frame-360);
 const greeting=r(frame,390,8)*(1-r(frame,438,12));
 const bob=Math.sin(t/19)*4;
 const nod=Math.sin((frame-390)/5)*2*greeting;
 return <g transform={`translate(${x} ${y+bob}) scale(${scale}) rotate(${nod})`}>
  <foreignObject x="-240" y="-250" width="480" height="480">
   <Img src={staticFile('agent-course/agent-pet-cream-v8.png')} style={{width:480,height:480,objectFit:'contain'}} />
  </foreignObject>
  {[0,1].map(i=><path key={i} d={`M${-153-i*12} -36 Q${-168-i*12} -20 ${-153-i*12} -4`} fill="none" stroke="#ffbd70" strokeWidth="3" strokeLinecap="round" opacity={greeting*(.5+.25*Math.sin(t/3+i))}/>)}
 </g>;
}
function Paper({x,y,kind,progress=1}:{x:number;y:number;kind:number;progress?:number}) {return <g transform={`translate(${x} ${y})`} stroke={kind===3?G:W} strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="-70" y="-82" width="140" height="164" rx="9"/>{kind===0?<>{[0,1,2].map(i=><g key={i}><rect x="-46" y={-51+i*43} width="16" height="16" rx="2"/><path d={`M-15 ${-43+i*43} H45`}/></g>)}</>:kind===1?<><rect x="-47" y="-50" width="94" height="70" rx="4"/><path d="M-47 -29 H47 M-20 47 L-3 30 L18 47 L42 21"/></>:kind===2?<><circle cx="-4" cy="-9" r="33"/><path d="M19 16 L47 48 M-20 -10 L-7 3 L16 -23"/></>:<><path d="M-44 -43 H27 M-44 -20 H14" opacity=".5"/><path d="M-42 24 L-12 51 L47 -10" pathLength="1" strokeDasharray="1" strokeDashoffset={1-progress} strokeWidth="7"/></>}</g>;}
function Bubble({x,y,text,width=360}:{x:number;y:number;text:string;width?:number}) {return <g transform={`translate(${x} ${y})`}><path d={`M-${width/2} -48 Q-${width/2} -65 -${width/2-20} -65 H${width/2-20} Q${width/2} -65 ${width/2} -45 V32 Q${width/2} 52 ${width/2-20} 52 H-70 L-101 80 L-96 52 H-${width/2-20} Q-${width/2} 52 -${width/2} 32Z`} fill="#25282b" stroke={B} strokeWidth="3"/>{label(0,8,text,32)}</g>;}
// 30fps draft cues, pending final voiceover alignment.
export function OpeningScene({frame,showAll}:{frame:number;showAll:boolean}){
 const f=showAll?1410:Math.max(0,frame-22);
 const shrink=r(f,510,65), ending=r(f,1230,45);
 // Eyes lead the turn; the hand follows, then the expression settles.
 const notice=r(f,406,12), turn=r(f,423,16), relieved=r(f,445,18);
 const reactionMask='polygon(46% 2%, 81% 2%, 81% 64%, 70% 64%, 70% 76%, 59% 76%, 59% 65%, 46% 65%)';
 const sceneScale=mix(1,.19,shrink), sceneX=mix(0,115,shrink),sceneY=mix(0,365,shrink);
 
 return <>
  {!showAll&&<Sequence from={418} durationInFrames={20}><Audio src={staticFile('agent-course/agent-hello.wav')} volume={0.7}/></Sequence>}
  <div style={{position:'absolute',left:sceneX,top:sceneY,width:1920,height:1080,transform:`scale(${sceneScale})`,transformOrigin:'0 0',opacity:1-r(f,557,25)}}>
   <Img src={staticFile('agent-course/opening-simple-white-v10.png')} style={{position:'absolute',width:'100%',height:'100%'}}/>
   <Img src={staticFile('agent-course/opening-notice-white-v10.png')} style={{position:'absolute',width:'100%',height:'100%',clipPath:reactionMask,opacity:notice}}/>
   <Img src={staticFile('agent-course/opening-turn-mid-white-v10.png')} style={{position:'absolute',width:'100%',height:'100%',clipPath:reactionMask,opacity:turn}}/>
   <Img src={staticFile('agent-course/opening-relieved-white-v10.png')} style={{position:'absolute',width:'100%',height:'100%',clipPath:reactionMask,opacity:relieved}}/>
  </div>
  <svg width="1920" height="1080" style={{position:'absolute',inset:0,overflow:'hidden'}}>
   <g opacity={r(f,360)}><Bot frame={f} x={mix(1640+75*(1-r(f,360,35)),350,shrink)} y={mix(295,445,shrink)} scale={mix(1.12,.95,shrink)}/></g>
   <g opacity={r(f,555)}>{label(350,635,'认识 Agent',49,B)}{label(350,694,'从最基础的概念开始',29)}</g>
   <path d="M505 470 C640 425 727 425 810 470" stroke={W} strokeWidth="3" fill="none" pathLength="1" strokeDasharray="1" strokeDashoffset={1-r(f,620,40)} opacity={.6}/>
   <g opacity={r(f,655)}><Paper x={960} y={460} kind={3} progress={r(f,735,30)}/>{label(960,635,'完整实战',49,P)}{label(960,694,'跟着做成一件事',29)}</g>
   <g opacity={r(f,1090)}>
    <path d="M1110 470 Q1240 425 1350 470" fill="none" stroke={W} strokeWidth="3" pathLength="1" strokeDasharray="1" strokeDashoffset={1-r(f,1080,35)} opacity=".6"/>
    {[0,1,2].map(i=><g key={i} opacity={r(f,1100+i*22)} transform={`translate(${1470+i*60} ${450-Math.sin(i)*25}) rotate(${(i-1)*9}) scale(.62)`}><Paper x={0} y={0} kind={i}/></g>)}
    {label(1560,635,'工具上手',49,G)}{label(1560,694,'找到可以上手的工具',29)}
   </g>
  </svg>
  <div style={{position:'absolute',left:190,top:755,width:190,height:230,overflow:'hidden',borderRadius:'50%',opacity:ending}}>
   <Img src={staticFile('agent-course/opening-relieved-white-v10.png')} style={{position:'absolute',width:1000,maxWidth:'none',left:-540,top:-62}}/>
  </div>
  <svg width="1920" height="1080" style={{position:'absolute',inset:0}}>
   <g opacity={ending}><Bubble x={790} y={860} text="用自然语言，说清楚你想做什么" width={690}/>{label(1390,857,'不会编程',44,G)}{label(1390,918,'也能跟着学',44,G)}</g>
  </svg>
 </>;
}
