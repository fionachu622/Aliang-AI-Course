import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import rows from './tool-map.timeline.json';
import {v9Colors as C} from '../v9/VisualV9';
import data from './course.storyboard.json';

const scenes = data.scenes.filter((scene) => /^s3[1-7]$/.test(scene.id));
const summary = data.scenes.find((scene) => scene.id === 's38')!;
export const TOOL_MAP_START = scenes[0].startFrame;
export const TOOL_MAP_END = summary.startFrame + summary.durationInFrames;
const colors=['#F0D26A','#7CC8EA','#A4D486','#F18D9E','#EFA884','#EFA884','#7CC8EA'];
const toolCues=rows.flatMap(row=>[...row.domestic,...row.overseas]).sort((a,b)=>a.at-b.at);
const heights=[112,112,96,96,112,96,96];
// Keep the original word-level cues; completed content remains fully legible.
export const SyncedToolMap: React.FC<{showAll?: boolean}> = ({showAll = false}) => {
 const frame=useCurrentFrame(),absoluteFrame=frame+TOOL_MAP_START;
 const active=scenes.findIndex(s=>absoluteFrame>=s.startFrame&&absoluteFrame<s.startFrame+s.durationInFrames);
 const reveal=(seconds:number)=>showAll?1:interpolate(absoluteFrame,[Math.ceil(seconds*30),Math.ceil(seconds*30)+8],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
 return <AbsoluteFill style={{padding:'54px 90px',WebkitTextStroke:'.4px currentColor',color:C.ink}}>
  <div style={{fontSize:72,textAlign:'center',height:112}}>Agent 工具地图</div>
  <div style={{display:'grid',gridTemplateColumns:'260px 640px 1fr',gap:30,fontSize:40,height:76,color:C.ink,paddingLeft:20}}><span>使用场景</span><span>国内工具</span><span>海外工具</span></div>
  {rows.map((row,index)=>{const color=colors[index],visible=reveal(row.at);return <div key={row.label} style={{position:'relative',height:heights[index],display:'grid',gridTemplateColumns:'260px 640px 1fr',gap:30,alignItems:'center',paddingLeft:20,flexShrink:0}}>
   <div style={{position:'relative',width:224,height:66,opacity:visible,display:'flex',alignItems:'center',justifyContent:'center',color,fontSize:39}}>
    <svg width="224" height="66" style={{position:'absolute',inset:0}}><path d="M14 2 Q100 -1 210 2 Q223 1 222 15 L223 51 Q222 65 210 64 Q100 67 14 64 Q1 65 2 51 L1 15 Q1 1 14 2Z" fill="none" stroke={color} strokeWidth={index===active?3.5:2.5} pathLength="1" strokeDasharray="1" strokeDashoffset={showAll?0:1-Math.min(1,Math.max(0,(absoluteFrame-Math.ceil(row.at*30))/12))}/></svg>{row.label}
   </div>
   {(['domestic','overseas'] as const).map(key=><div key={key} style={{fontSize:34,lineHeight:1.2,whiteSpace:'pre-line'}}>{row[key].map((part,i)=>{
    const cue=toolCues.indexOf(part),end=Math.min(part.at+2.5,toolCues[cue+1]?.at??Infinity);
    const speaking=!showAll&&absoluteFrame>=Math.ceil(part.at*30)&&absoluteFrame<Math.ceil(end*30);
    const sweep=speaking?Math.min(1,(absoluteFrame-Math.ceil(part.at*30))/12):0;
    const prefix=part.text.match(/^[\s·/]+/)?.[0]??'';
    return <span key={i} style={{opacity:reveal(part.at),color:i===0?color:C.ink}}>{prefix}<span style={{position:'relative',color:speaking?'#F0D26A':undefined,backgroundImage:speaking?'linear-gradient(rgba(240,210,106,.3),rgba(240,210,106,.3))':undefined,backgroundPosition:'left 86%',backgroundRepeat:'no-repeat',backgroundSize:`${sweep*100}% 30%`}}>{part.text.slice(prefix.length)}</span></span>;
   })}</div>)}
   {index<6&&<svg width="1450" height="8" style={{position:'absolute',left:300,bottom:0,opacity:visible}}><path d="M0 4 Q710 1 1430 4" stroke={color} strokeWidth="1.3" opacity=".4" fill="none"/></svg>}
  </div>})}
 </AbsoluteFill>;
};
