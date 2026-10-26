import {AgentDefinition} from './AgentDefinition';
import {OpeningScene} from './OpeningScene';
import {ToolMap} from './ToolMap';
import React from 'react';
import {AbsoluteFill, Sequence, Img, staticFile, useCurrentFrame, interpolate, Easing} from 'remotion';
import {loadFont} from '@remotion/fonts';
import raw from './plan.json';
import recordingSegments from './recording-segments.json';
import nodeCues from './visual-node-cues.json';
import {v9Colors} from '../v9/VisualV9';

export const agentScenes=raw;
export const AGENT_FPS=30;
export const AGENT_DURATION=agentScenes.reduce((a,s)=>a+s.duration*30,0);
export type AgentProps={sceneIndex:number;showAll:boolean;recordingPlaceholders?:boolean;absoluteSeconds?:number};
const C:Record<string,string>={white:v9Colors.ink,blue:v9Colors.blue,pink:v9Colors.magenta,green:v9Colors.green,yellow:v9Colors.yellow};
let loaded=false;
function fonts(){if(loaded)return;loaded=true;loadFont({family:'AgentChalk',url:staticFile('fonts/HanziPenSC-Bold.otf'),weight:'600',format:'opentype'});}
const clamp={extrapolateLeft:'clamp',extrapolateRight:'clamp'} as const;
const prog=(f:number,start:number,d=22)=>interpolate(f,[start,start+d],[0,1],{...clamp,easing:Easing.bezier(.2,.7,.25,1)});

function Icon({kind,color}:{kind:string;color:string}){
 if(kind==='agent-pet')return <Img src={staticFile('agent-course/agent-pet-cream-v8.png')} style={{width:230,height:230,marginTop:-45,objectFit:'contain'}}/>;
 const common={fill:'none',stroke:color,strokeWidth:3.5,strokeLinecap:'round' as const,strokeLinejoin:'round' as const};
 const doc=<><path d="M-49 -60 L20 -60 L49 -31 L49 62 L-49 62 Z M20 -60 L20 -31 L49 -31"/><path d="M-28 -9 H26 M-28 10 H26 M-28 29 H12"/></>;
 let art:React.ReactNode=doc;
 if(kind==='folder')art=<><path d="M-72 -32 L-72 -52 L-17 -52 L-1 -32 L73 -32 L66 57 L-67 57 Z"/><path d="M-67 -18 L66 -18"/></>;
 if(kind==='stack')art=<><path d="M-69 41 V-73 H21 M-59 50 V-66 H31"/>{doc}</>;
 if(kind==='core')art=<><path d="M-52 -50 Q-8 -78 50 -48 Q80 -4 48 48 Q3 78 -49 48 Q-79 1 -52 -50Z"/><path d="M-17 -30 Q-34 -27 -27 -10 Q-45 6 -24 19 Q-29 40 -4 33 M17 -30 Q34 -27 27 -10 Q45 6 24 19 Q29 40 4 33 M0 -37 V38 M-24 -7 L-4 2 M24 -7 L4 2"/></>;
 if(['browser','terminal','video','slide','chart'].includes(kind))art=<><path d="M-83 -54 L83 -54 L83 54 L-83 54 Z M-82 -32 H81"/><circle cx="-67" cy="-43" r="2"/><circle cx="-53" cy="-43" r="2"/>{kind==='video'?<path d="M-13 -14 L23 9 L-13 32Z"/>:kind==='terminal'?<path d="M-51 -9 L-34 5 L-51 19 M-20 23 H12"/>:kind==='chart'?<><path d="M-57 35 H58 M-57 35 V-17 M-30 33 V8 H-11 V33 M7 33 V-6 H26 V33 M41 33 V-20 H59 V33"/></>:kind==='slide'?<><path d="M-59 -8 H50 M-59 8 H12 M-59 24 H31"/></>:<><path d="M-61 -11 H48 M-61 9 H9 M-61 29 H35"/></>}</>;
 if(kind==='calendar')art=<><path d="M-66 -49 H66 V64 H-66Z M-66 -19 H66 M-37 -65 V-35 M37 -65 V-35"/>{[-32,0,32].map(x=>[-1,28].map(y=><path key={`${x}-${y}`} d={`M${x-7} ${y} h14 v12 h-14z`}/>))}</>;
 if(kind==='phone')art=<><path d="M-36 -73 H36 Q45 -73 45 -63 V65 Q45 76 35 76 H-35 Q-45 76 -45 65 V-63Q-45 -73 -36 -73Z M-15 -57 H15 M-10 59 H10"/><path d="M-25 -25 H25 M-25 -4 H25 M-25 17 H5"/></>;
 if(kind==='tool')art=<><path d="M24 -59 Q66 -67 67 -23 L41 -36 L19 -20 L21 7 L47 21 Q7 38 -12 9 L-57 60 Q-76 71 -77 50 L-30 -3 Q-44 -34 -13 -57 L-10 -24 L10 -18 L28 -30 Z"/></>;
 if(kind==='eye')art=<><path d="M-85 0 Q0 -83 85 0 Q0 83 -85 0Z"/><circle r="25"/><circle r="7"/></>;
 if(kind==='check')art=<><path d="M-57 -38 Q-85 22 -37 54 Q35 88 66 9 Q77 -21 54 -46"/><path d="M-36 0 L-8 28 L64 -52"/></>;
 if(kind==='butterfly')art=<><path d="M0 -36 V55 M-2 -24 Q-81 -98 -92 -26 Q-101 25 -8 21 Q-81 1 -72 55 Q-55 93 -1 37 M2 -24 Q81 -98 92 -26 Q101 25 8 21 Q81 1 72 55 Q55 93 1 37 M-1 -34 Q-16 -66 -28 -60 M1 -34 Q16 -66 28 -60"/></>;
 if(kind==='caterpillar')art=<>{[-60,-35,-10,15,40].map((x,i)=><React.Fragment key={x}><circle cx={x} cy={8-Math.sin(i)*5} r="20"/><path d={`M${x-5} 27 l-6 13`}/></React.Fragment>)}<circle cx="63" cy="-9" r="24"/><path d="M57 -31 l-9 -16 M72 -31 l8 -17"/><circle cx="71" cy="-12" r="2"/></>;
 if(kind==='pupa')art=<><path d="M-79 -62 Q0 -70 78 -56 M0 -62 V-28 Q-49 22 -10 72 Q53 23 0 -28 M-17 -7 Q22 21 15 50"/></>;
 if(kind==='gear')art=<><path d="M-16 -71 H16 L22 -48 L40 -41 L60 -51 L77 -23 L59 -5 V13 L77 25 L60 54 L36 46 L19 54 L15 76 H-16 L-22 52 L-41 41 L-61 51 L-78 23 L-58 6 V-13 L-76 -25 L-59 -53 L-36 -45 L-20 -52Z"/><circle r="29"/><circle r="10"/></>;
 if(kind==='poster')art=<><path d="M-51 -74 H51 V74 H-51Z M-35 -54 H35 M-35 -39 H18 M-35 49 H30 M-35 60 H8"/><path d="M-34 31 L-5 -9 L9 11 L23 -4 L38 31Z"/><circle cx="22" cy="-21" r="8"/></>;
 if(kind==='wallet')art=<><path d="M-68 -35 Q-71 -54 -48 -54 H50 V-36 M-68 -35 H67 V57 H-68 Z M67 -9 H21 V29 H67"/><circle cx="34" cy="10" r="3"/></>;
 if(kind==='upload')art=<><path d="M-58 17 V61 H58 V17 M0 38 V-63 M-29 -32 L0 -63 L29 -32"/></>;
 if(kind==='search')art=<><circle cx="-12" cy="-10" r="46"/><path d="M20 24 L68 74 M-36 -22 H9 M-36 -3 H15 M-36 16 H-3"/></>;
 if(kind==='meter-empty')art=<><path d="M-72 -28 H72 V29 H-72Z M77 -9 H87 V11 H77"/></>;
 if(kind==='meter')art=<><path d="M-72 -28 H72 V29 H-72Z M-62 -18 H-42 V19 H-62Z M-31 -18 H-11 V19 H-31Z M0 -18 H20 V19 H0Z M77 -9 H87 V11 H77"/></>;
 if(kind==='loop')art=<><path d="M-55 18 A60 60 0 1 1 36 46 M-55 18 L-76 -6 M-55 18 L-31 -3 M36 46 L64 49 M36 46 L45 18"/></>;
 return <svg viewBox="-110 -100 220 200" width="170" height="150" style={{overflow:'visible'}}><g {...common}>{art}</g></svg>;
}
type Node=typeof raw[number]['nodes'][number];
function ObjectNode({node,frame,index,showAll,at,subAt}:{node:Node;frame:number;index:number;showAll:boolean;at?:number;subAt?:number}){
 const a=showAll?1:prog(frame,at??(20+node.stage*85+index*9));
 const width=node.shape==='text'?Math.min(1700,Math.max(420,node.text.length*node.size*1.04+30)):Math.max(420,Math.min(650,node.text.length*node.size+20));
 return <div style={{position:'absolute',left:node.x-width/2,top:node.y-(node.shape==='text'?38:115),width,textAlign:'center',opacity:a,transform:`translateY(${(1-a)*12}px)`,color:C[node.color]}}>
 {node.shape!=='text'&&<div style={{height:152}}><Icon kind={node.shape==='core'&&node.text.includes('Agent')?'agent-pet':node.shape==='meter'&&node.text==='额度用完'?'meter-empty':node.shape} color={C[node.color]}/></div>}
 <div style={{fontSize:node.size,lineHeight:1.2,whiteSpace:'pre-line'}}>{node.text}</div>
 {node.sub&&<div style={{fontSize:29,lineHeight:1.55,whiteSpace:'pre-line',marginTop:18,color:C.white,opacity:.76*(showAll||subAt===undefined?1:prog(frame,subAt)),WebkitTextStroke:'.2px currentColor'}}>{node.sub}</div>}
 </div>;
}
function Edge({scene,edge,index,frame,showAll,at}:{at?:number;scene:typeof raw[number];edge:typeof raw[number]['edges'][number];index:number;frame:number;showAll:boolean}){
 const a=scene.nodes[edge.a],b=scene.nodes[edge.b];
 const bounds=(n:Node)=>{
   const textWidth=n.text.length*n.size*.98;
   const subWidth=Math.max(0,...n.sub.split('\n').map(x=>x.length*27));
   const width=Math.min(1700,Math.max(n.shape==='text'?50:180,textWidth,subWidth));
   const top=n.y-(n.shape==='text'?38:115);
   const height=(n.shape==='text'?0:152)+n.size*1.2+(n.sub?18+n.sub.split('\n').length*45:0);
   return {x:n.x,y:top+height/2,hw:width/2+22,hh:height/2+22};
 };
 const A=bounds(a),B=bounds(b),dx=B.x-A.x,dy=B.y-A.y,dist=Math.hypot(dx,dy),ux=dx/dist,uy=dy/dist;
 const inset=(r:ReturnType<typeof bounds>)=>Math.min(r.hw/Math.max(.001,Math.abs(ux)),r.hh/Math.max(.001,Math.abs(uy)));
 const ia=inset(A),ib=inset(B);
 if(dist-ia-ib<12)return null;
 const x1=A.x+ux*ia,y1=A.y+uy*ia,x2=B.x-ux*ib,y2=B.y-uy*ib;
 const horiz=Math.abs(dx)>Math.abs(dy);
 const p=showAll?1:prog(frame,at??(42+edge.stage*85+Math.max(edge.a,edge.b)*9),32);
 const color=C[b.color];const midx=(x1+x2)/2,midy=(y1+y2)/2;
 const path=`M${x1} ${y1} Q${midx+uy*8} ${midy-ux*8} ${x2} ${y2}`;
 const angle=Math.atan2(y2-y1,x2-x1)*180/Math.PI;
 return <g opacity={p}><path d={path} pathLength="1" stroke={color} strokeWidth="3.5" fill="none" strokeDasharray="1" strokeDashoffset={1-p}/><path d={path} stroke={color} strokeWidth="1" opacity=".24" transform="translate(1.7 1.4)" fill="none"/><path d="M-15 -8 L0 0 L-15 8" transform={`translate(${x2} ${y2}) rotate(${angle})`} fill="none" stroke={color} strokeWidth="3.5" opacity={p>.9?1:0}/>{edge.label&&<text x={midx+(horiz?0:100)} y={midy+(horiz?-25:10)} fill={C.white} fontSize="27" textAnchor="middle" stroke="none" opacity=".75">{edge.label}</text>}</g>;
}
export function AgentPage({sceneIndex=0,showAll=false,recordingPlaceholders=true,absoluteSeconds}:AgentProps){
 fonts();const localFrame=useCurrentFrame();const f=absoluteSeconds===undefined?localFrame+22:absoluteSeconds*30;const s=raw[sceneIndex]??raw[0];
 const timing=absoluteSeconds===undefined?undefined:(nodeCues as Record<string,{nodes:number[];subtitles:number[]}>)[s.id];
 const spans=(recordingSegments as Record<string,{from:number;to:number}[]>)[s.id]??[];
 const isRecording=recordingPlaceholders&&spans.some(span=>localFrame>=span.from&&localFrame<span.to);
 return <AbsoluteFill style={{backgroundColor:v9Colors.paper,color:C.white,fontFamily:'AgentChalk,"HanziPen SC","Kaiti SC",serif',fontWeight:600,WebkitTextStroke:'.65px currentColor'}}>
 <Img src={staticFile('shared-visual/backgrounds/chalkboard/chalkboard.png')} style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover'}}/>
 <AbsoluteFill style={{background:'radial-gradient(ellipse at 50% 48%,transparent 35%,rgba(0,0,0,.13))'}}/>
 {isRecording?<AbsoluteFill style={{alignItems:'center',justifyContent:'center',fontSize:88}}>【案例展示】</AbsoluteFill>:s.id==='Agent02'?<AgentDefinition seconds={absoluteSeconds??41+localFrame/30} showAll={showAll}/>:s.id==='Agent20'?<ToolMap seconds={absoluteSeconds}/>:sceneIndex===0?<OpeningScene frame={f} showAll={showAll}/>:<><svg width="1920" height="1080" style={{position:'absolute',inset:0,overflow:'visible'}}>{s.edges.map((e,i)=><Edge key={e.id} scene={s} edge={e} index={i} at={timing?Math.max(timing.nodes[e.a],timing.nodes[e.b])*30+10:undefined} frame={f} showAll={showAll}/>)}</svg>
 {s.nodes.map((n,i)=><ObjectNode key={n.id} node={n} index={i} at={timing?timing.nodes[i]*30:undefined} subAt={timing?timing.subtitles[i]*30:undefined} frame={f} showAll={showAll}/>)}</>}
 </AbsoluteFill>;
}
export function AgentCourse(){let start=0;return <AbsoluteFill>{raw.map((s,i)=>{const from=start;start+=s.duration*30;return <Sequence key={s.id} from={from} durationInFrames={s.duration*30} name={`${s.chapter} · ${s.title}`}><AgentPage sceneIndex={i} showAll={false}/></Sequence>;})}</AbsoluteFill>;}
