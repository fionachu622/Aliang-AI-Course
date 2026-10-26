import React from 'react';
import data from './audience-scenes.json';
const clamp=(v:number)=>Math.max(0,Math.min(1,v));
const reveal=(t:number,at:number)=>clamp((t-at)/.25);
const smooth=(v:number)=>{const q=clamp(v);return q*q*(3-2*q);};
/** Role -> typical tasks -> suitable tool, using the course's legacy narration clock. */
export const AudienceRecommendations:React.FC<{seconds:number}>=({seconds:t})=>{
 const dock=smooth((t-data.scenes[1].start)/.7);
 return <div style={{position:'absolute',inset:0,fontFamily:'AgentFullHanzi',color:'#F5F1E8',WebkitTextStroke:'.35px currentColor'}}>
  <div style={{position:'absolute',top:65,width:'100%',textAlign:'center',fontSize:68}}>{data.title}</div>
  {data.scenes.map((s,i)=>{
   if(t<s.start)return null;
   const x=120+(i%2)*890,y=235+Math.floor(i/2)*410;
   const left=i===0?350+(x-350)*dock:x,top=i===0?335+(y-335)*dock:y;
   const scale=i===0?1.45-.45*dock:1;
   const role=reveal(t,s.start),tool=reveal(t,s.toolAt),link=tool;
   return <div key={s.id} style={{position:'absolute',left,top,width:790,height:300,transform:`scale(${scale})`,transformOrigin:'top left',opacity:reveal(t,s.start)}}>
    <div style={{position:'absolute',left:0,top:0,fontSize:54,color:s.color}}>{s.who}</div>
    <svg width="790" height="300" style={{position:'absolute',inset:0,overflow:'visible'}}>
     <path d={`M2 77 Q${s.who.length*15} 73 ${s.who.length*54} 77`} stroke={s.color} strokeWidth="3" fill="none" pathLength="1" strokeDasharray="1" strokeDashoffset={1-role}/>
     <g fill="none" stroke={s.color} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M434 127 Q447 129 447 149 L447 244 Q447 263 434 266" pathLength="1" strokeDasharray="1" strokeDashoffset={1-link}/>
      <path d="M468 197 Q494 195 525 197" pathLength="1" strokeDasharray="1" strokeDashoffset={1-link}/>
      <path d="M509 184 L526 197 L509 210" opacity={link>.95?1:0}/>
     </g>
     <path d="M559 122 Q660 119 769 123 Q782 124 781 139 L780 257 Q779 271 766 270 L560 269 Q548 268 549 254 L548 138 Q548 123 559 122Z" fill="none" stroke={s.color} strokeWidth="3" pathLength="1" strokeDasharray="1" strokeDashoffset={1-tool}/>
    </svg>
    <div style={{position:'absolute',top:112,left:2,width:413,fontSize:39,lineHeight:1.55}}>{s.tasks.map((task,j)=><div key={task} style={{opacity:reveal(t,s.taskAts[j]),transform:`translateX(${10*(1-reveal(t,s.taskAts[j]))}px)`}}>{task}</div>)}</div>
    <div style={{position:'absolute',left:561,top:133,width:205,height:125,display:'flex',alignItems:'center',justifyContent:'center',textAlign:'center',fontSize:s.id==='creator'?41:48,lineHeight:1.4,whiteSpace:'pre-line',color:s.color,opacity:tool}}>{s.tool.replace(' 中文版','\n中文版')}</div>
   </div>;
  })}
 </div>;
};
