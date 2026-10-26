import React, {useEffect, useState} from 'react';
import {AbsoluteFill, cancelRender, continueRender, delayRender, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {loadCourseFonts} from './CourseTypography';
import intro from './practice-intro-presenter.json';
import {DiagramIcon} from './DiagramIcon';

/** Source-frame cues: this introduction precedes the edited production case. */
export const PracticeIntroKeywords:React.FC=()=>{
 const frame=useCurrentFrame()+intro.fromFrame;
 const [handle]=useState(()=>delayRender('Presenter keyword handwriting'));
 useEffect(()=>{loadCourseFonts().then(()=>continueRender(handle)).catch(cancelRender)},[handle]);
 const group=intro.keywordOverlay.groups.find(g=>frame>=g.items[0].fromFrame&&frame<g.endFrame);
 if(!group)return null;
 const principles=group.id==='principles';
 const exit=interpolate(frame,[group.endFrame-10,group.endFrame],[1,0],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
 const entrance=interpolate(frame,[group.items[0].fromFrame,group.items[0].fromFrame+10],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
 if(!principles){
  const index=group.items.reduce((active,item,i)=>frame>=item.fromFrame?i:active,0);
  const item=group.items[index];
  const p=interpolate(frame,[item.fromFrame,item.fromFrame+6],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  return <AbsoluteFill style={{pointerEvents:'none',opacity:exit,fontFamily:'AgentFullHanzi',color:'#F5F1E8'}}>
   <div style={{position:'absolute',right:0,top:0,width:630,height:'100%',opacity:entrance,background:'linear-gradient(90deg, transparent, rgba(15,20,23,.6) 55%, rgba(15,20,23,.76))'}}/>
   <div key={item.text} style={{position:'absolute',left:1365,top:300,width:410,textAlign:'center',opacity:p,transform:`translateY(${(1-p)*7}px)`,clipPath:`inset(0 ${(1-p)*100}% 0 0)`}}>
    <div style={{height:195,display:'flex',justifyContent:'center',alignItems:'center'}}><div style={{transform:'scale(1.25)'}}><DiagramIcon kind={['video','search','document','poster','upload'][index]} color="#F0D26A" progress={p}/></div></div>
    <div style={{marginTop:45,fontSize:78,lineHeight:1.2,whiteSpace:'nowrap'}}>{item.text}</div>
   </div>
  </AbsoluteFill>;
 }
 return <AbsoluteFill style={{pointerEvents:'none',opacity:exit,fontFamily:'AgentFullHanzi',color:'#F5F1E8'}}>
  <div style={{position:'absolute',right:0,top:0,width:670,height:'100%',opacity:entrance,background:'linear-gradient(90deg, transparent 0%, rgba(15,20,23,.35) 24%, rgba(15,20,23,.78) 64%, rgba(15,20,23,.84) 100%)'}}/>
  {group.items.map((item,i)=>{
   const p=interpolate(frame,[item.fromFrame,item.fromFrame+7],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
   const latest=i===group.items.length-1||frame<group.items[i+1].fromFrame;
   const rule=interpolate(frame,[item.fromFrame+3,item.fromFrame+15],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
   const accent=latest?'#F0D26A':'#F5F1E8';
   return <div key={item.text} style={{position:'absolute',left:1345,top:255+i*165,width:420,height:120,opacity:p,transform:`translateX(${(1-p)*8}px)`}}>
    <div style={{position:'absolute',left:0,top:32,fontSize:28,lineHeight:1,color:'#B6B4AA'}}>{String(i+1).padStart(2,'0')}</div>
    <div style={{position:'absolute',left:65,top:25,fontSize:54,lineHeight:1,whiteSpace:'nowrap'}}>{item.text.slice(0,2)}</div>
    <div style={{position:'absolute',left:220,top:5,fontSize:82,lineHeight:1,color:accent,whiteSpace:'nowrap'}}>{item.text.slice(2)}</div>
    <svg width="360" height="8" style={{position:'absolute',left:65,top:108,overflow:'visible'}}>
     <path d="M0 3 Q175 0 355 3" fill="none" stroke="#F5F1E8" strokeOpacity=".18" strokeWidth="1.5"/>
     <path d="M155 3 Q232 0 318 3" fill="none" stroke={accent} strokeWidth="2.5" strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1-rule}/>
    </svg>
   </div>;
  })}
 </AbsoluteFill>;
};
