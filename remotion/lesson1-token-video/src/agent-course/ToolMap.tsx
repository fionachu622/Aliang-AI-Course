import React from 'react';
import {interpolate} from 'remotion';
import cues from './tool-map-cues.json';

export const toolMapRows = [
 ['通用任务','豆包工作 · 腾讯 WorkBuddy · 千问办公','ChatGPT Work'],
 ['搜索调研','Kimi 深度研究','Gemini Deep Research\nPerplexity Deep Research'],
 ['办公文档','WPS 灵犀 · 千问办公','Microsoft 365 Copilot Agents'],
 ['数据分析','Kimi Work','ChatGPT Work · 微软 Copilot'],
 ['图片创作','Lovart 中文版 · 豆包 · 即梦','Midjourney · ChatGPT Image2\nNanoBanana'],
 ['影视创作','小云雀 · LibTV · 即梦','Runway Agent'],
 ['编程开发','TRAE · Qcoder','Codex · Claude Code · Cursor'],
];

export function ToolMap({seconds}:{seconds?:number}){
 const amount=(at:number)=>seconds===undefined?1:interpolate(seconds,[at,at+.35],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
 const items=(entries:{text:string;at:number}[])=>entries.map((entry,i)=><span key={entry.text} style={{opacity:amount(entry.at)}}>{i>0?' · ':''}{entry.text}</span>);
 return <div style={{position:'absolute',inset:0,padding:'70px 110px',WebkitTextStroke:'.35px currentColor'}}>
  <div style={{fontSize:72,textAlign:'center',marginBottom:38}}>Agent 工具地图</div>
  <div style={{display:'grid',gridTemplateColumns:'270px 710px 1fr',fontSize:37,color:'#7CC8EA',padding:'0 20px 20px',borderBottom:'2px solid rgba(245,241,232,.5)'}}>
   <span>使用场景</span><span>国内工具</span><span>海外工具</span>
  </div>
  {toolMapRows.map(([scene,domestic,overseas],i)=><div key={scene} style={{display:'grid',gridTemplateColumns:'270px 710px 1fr',alignItems:'center',minHeight:91,padding:'10px 20px',borderBottom:'1px solid rgba(245,241,232,.18)',fontSize:35,lineHeight:1.35,opacity:amount(cues[i].at),background:seconds!==undefined&&seconds>=cues[i].at&&(i===6||seconds<cues[i+1].at)?'rgba(124,200,234,.06)':'transparent'}}>
   <span style={{color:['#7CC8EA','#A4D486','#F0D26A','#F18D9E'][i%4]}}>{scene}</span>
   <span>{seconds===undefined?domestic:items(cues[i].domestic)}</span><span style={{fontSize:31,whiteSpace:'pre-line'}}>{seconds===undefined?overseas:items(cues[i].overseas)}</span>
  </div>)}
  <div style={{fontSize:30,textAlign:'center',color:'#F0D26A',marginTop:26,opacity:amount(1070.72)}}>先看任务，再选工具；同一个工具可以用于多种场景</div>
 </div>;
}
