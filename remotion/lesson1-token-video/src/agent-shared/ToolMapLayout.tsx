import React from 'react';
import {AbsoluteFill} from 'remotion';

type Part = {text:string; at:number};
type Row = {label:string; at:number; domestic:Part[]; overseas:Part[]};
const ink = '#F5F1E8';
const sceneColors = ['#F0D26A', '#7CC8EA', '#A4D486', '#F18D9E', '#EFA884', '#C4AEEC', '#7ED8C4'];
const chalkFont = 'AgentFullHanzi, "HanziPen SC", cursive';
const columns = '250px 650px 780px';
const clean = (text:string) => text.replace(/^[\s·/|│]+/, '').replace(/\s+Agents$/, '').trim();

// Keep the course chalk typography and original word-level highlight timing.
export const ToolMapLayout: React.FC<{rows:Row[]; reveal?:(at:number)=>number; seconds?:number}> = ({rows,reveal=()=>1,seconds}) => {
 const toolCues=rows.flatMap(row=>[...row.domestic,...row.overseas]).sort((a,b)=>a.at-b.at);
 return (
 <AbsoluteFill className="tool-map-layout" style={{padding:'62px 80px',color:ink,fontFamily:chalkFont,fontWeight:600,WebkitTextStroke:'.65px currentColor',textShadow:'none'}}>
  <div style={{position:'absolute' ,inset:0,background:'rgba(10,13,14,.28)',pointerEvents:'none'}} />
  <div style={{position:'relative',fontFamily:chalkFont,fontSize:58,lineHeight:1.2,height:128}}>Agent 工具地图</div>
  <div style={{position:'relative',display:'grid',gridTemplateColumns:columns,gap:40,height:72,alignItems:'center',fontFamily:chalkFont,fontSize:36,color:ink,marginInline:-24,paddingInline:24,background:'rgba(124,170,190,.16)',borderRadius:8,borderBottom:'1px solid rgba(170,201,213,.3)'}}>
   <span>使用场景</span><span>国内工具</span><span>海外工具</span>
  </div>
  {rows.map((row,index)=><div key={row.label} style={{position:'relative',display:'grid',gridTemplateColumns:columns,gap:40,height:rows.length>6?98:110,alignItems:'center',borderBottom:index<rows.length-1?'1px solid rgba(245,241,232,.1)':undefined}}>
   <div style={{display:'flex',alignItems:'center',gap:18,whiteSpace:'nowrap',opacity:reveal(row.at)}}>
    <span style={{fontFamily:chalkFont,fontSize:24,color:sceneColors[index % sceneColors.length],fontVariantNumeric:'tabular-nums'}}>{String(index+1).padStart(2,'0')}</span>
    <span style={{fontFamily:chalkFont,fontSize:37,color:sceneColors[index % sceneColors.length]}}>{row.label}</span>
   </div>
   {(['domestic','overseas'] as const).map(key=><div key={key} data-tool-cell style={{display:'flex',alignItems:'center',whiteSpace:'nowrap',fontFamily:chalkFont,fontSize:30,lineHeight:1.4}}>
    {row[key].map((part,i)=>{
     const cue=toolCues.indexOf(part);
     const end=Math.min(part.at+2.5,toolCues[cue+1]?.at??Infinity);
     const speaking=seconds!==undefined&&seconds>=Math.ceil(part.at*30)/30&&seconds<Math.ceil(end*30)/30;
     const sweep=speaking?Math.min(1,(seconds!-Math.ceil(part.at*30)/30)/.4):0;
     return <span key={i} style={{display:'inline-flex',alignItems:'center',opacity:reveal(part.at)}}>
     {i>0&&<span aria-hidden style={{width:3,height:28,background:sceneColors[index % sceneColors.length],borderRadius:2,marginInline:16,flexShrink:0}}/>}
     <span data-speaking={speaking||undefined} style={{color:speaking?'#F0D26A':ink,backgroundImage:speaking?'linear-gradient(rgba(240,210,106,.3),rgba(240,210,106,.3))':undefined,backgroundPosition:'left 86%',backgroundRepeat:'no-repeat',backgroundSize:`${sweep*100}% 30%`}}>{clean(part.text)}</span>
    </span>;})}
   </div>)}
  </div>)}
 </AbsoluteFill>
);
};
