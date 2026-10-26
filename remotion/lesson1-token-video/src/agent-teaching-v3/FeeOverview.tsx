import React from 'react';
import editorial from './remaining-editorial.storyboard.json';
const scene=editorial.scenes.find(s=>s.id==='fee-overview')!;
const reveal=(t:number,at:number)=>Math.max(0,Math.min(1,(t-at)/.25));
export const FeeOverview:React.FC<{seconds:number}>=({seconds:t})=><div style={{position:'absolute',inset:0,fontFamily:'AgentFullHanzi',color:'#F5F1E8'}}>
 <div style={{position:'absolute',top:92,width:'100%',textAlign:'center',fontSize:70}}>{scene.title}</div>
 {scene.nodes.map((n,i)=><div key={n.text} style={{position:'absolute',left:n.x,top:n.y,width:440,height:175,opacity:reveal(t,n.at),color:n.color}}>
  <svg width="440" height="175" style={{position:'absolute',inset:0}}><path d="M18 6 Q210 0 422 6 Q438 7 435 25 L434 150 Q435 167 418 166 Q220 171 20 167 Q4 165 5 148 L4 24 Q3 7 18 6Z" stroke={n.color} fill="none" strokeWidth="3"/></svg>
  <div style={{position:'absolute',top:-63,left:5,fontSize:42}}>{String(i+1).padStart(2,'0')}</div>
  <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:i===2?43:50,WebkitTextStroke:'.35px currentColor'}}>{n.text}</div>
 </div>)}
 <div style={{position:'absolute',top:860,width:'100%',textAlign:'center',fontSize:38,opacity:reveal(t,1156.12)}}>同一个工具，可能同时采用多种收费方式</div>
 </div>;
