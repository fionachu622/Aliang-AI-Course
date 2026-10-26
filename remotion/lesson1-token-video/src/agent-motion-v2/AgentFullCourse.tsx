import {OpeningPresenterReturn} from './OpeningPresenterReturn';
import {ChapterTransition} from './ChapterTransition';
import {DiagramPageTransition} from './DiagramPageTransition';
import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Sequence, Img, staticFile, interpolate, Easing, useCurrentFrame, delayRender, continueRender, cancelRender} from 'remotion';
import {loadFont} from '@remotion/fonts';
import data from './course.storyboard.json';
import {CourseAudio as Audio} from './PreviewMedia';
import {SyncedOpening} from './SyncedOpening';
import {RecordingSequence} from './RecordingSequence';
import recordings from './recordings.timeline.json';
import opening from './opening.timeline.json';
import narrationEdit from './narration-edit.json';
import syncOverrides from './sync-overrides.json';
import {SyncedToolMap, TOOL_MAP_START, TOOL_MAP_END} from './SyncedToolMap';
import {v9Colors as C} from '../v9/VisualV9';
export const AGENT_FULL_DURATION=narrationEdit.durationInFrames;
export const fullScenes=data.scenes;
type Scene=typeof fullScenes[number];
const colors:Record<string,string>={white:C.ink,blue:C.blue,pink:C.magenta,green:C.green,yellow:C.yellow};
const lineSeconds:Record<string,number[]>=syncOverrides.lineSeconds;
const textParts=syncOverrides.textParts as unknown as Record<string,[string,number][][]>;
const leadInSeconds=syncOverrides.leadInSeconds as Record<string,number>;
const progress=(f:number,t:number,d=22)=>interpolate(f,[t,t+d],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:Easing.bezier(.22,1,.36,1)});
type Pos={x:number;y:number;w:number;size:number};
function positions(s:Scene):Pos[]{
 const n=s.nodes.length;
 if(s.layout==='flow')return n<=3?s.nodes.map((_,i)=>({x:n===2?550+i*820:340+i*620,y:540,w:n===2?670:495,size:96})):s.nodes.map((_,i)=>({x:[550,1370,1370,550][i],y:[350,350,730,730][i],w:650,size:92}));
 if(s.layout==='grid')return s.nodes.map((_,i)=>({x:550+(i%2)*820,y:340+Math.floor(i/2)*380,w:720,size:92}));
 if(s.layout==='cycle')return [{x:400,y:390,w:430,size:108},{x:960,y:270,w:430,size:108},{x:1520,y:390,w:430,size:108},{x:960,y:780,w:540,size:110}];
 if(s.layout==='parallel')return [{x:960,y:230,w:800,size:134},{x:430,y:540,w:450,size:92},{x:960,y:540,w:450,size:92},{x:1490,y:540,w:450,size:92},{x:1490,y:800,w:660,size:55}];
 if(s.layout==='tool')return s.nodes.map((_,i)=>i===0?{x:960,y:215,w:1600,size:118}:i===n-1?{x:960,y:850,w:1580,size:70}:{x:960,y:350+(i-1)*(360/Math.max(1,n-2)),w:1620,size:70});
 if(s.layout==='compare')return n===4?[{x:520,y:365,w:790,size:96},{x:520,y:655,w:790,size:72},{x:1400,y:365,w:790,size:96},{x:1400,y:655,w:790,size:68}]:n===2?[{x:520,y:520,w:780,size:100},{x:1400,y:520,w:780,size:100}]:[{x:510,y:395,w:780,size:96},{x:1410,y:395,w:780,size:96},{x:960,y:760,w:1500,size:85}];
 return s.nodes.map((_,i)=>({x:960,y:540+(i-(n-1)/2)*(n>3?160:205),w:1640,size:s.layout==='rows'?92:110}));
}
function fit(text:string,width:number,size:number){const units=[...text].reduce((a,c)=>a+(/[\u0000-\u007f]/.test(c)?.53:1),0);return Math.min(size,width/Math.max(units,1));}
function Connection({a,b,amount,curve=false}:{a:Pos;b:Pos;amount:number;curve?:boolean}){
 const dx=b.x-a.x,dy=b.y-a.y,len=Math.hypot(dx,dy),ux=dx/len,uy=dy/len;
 const reach=(p:Pos)=>Math.min(Math.abs(ux)>.1?(p.w/2+22)/Math.abs(ux):1e9,Math.abs(uy)>.1?105/Math.abs(uy):1e9);
 const ra=reach(a),rb=reach(b);const x1=a.x+ux*ra,y1=a.y+uy*ra,x2=b.x-ux*rb,y2=b.y-uy*rb;
 const nx=-uy,ny=ux;
 const d=curve?`M${x1} ${y1} Q${(x1+x2)/2-100} ${(y1+y2)/2+90} ${x2} ${y2}`:`M${x1} ${y1} Q${(x1+x2)/2+ny*5} ${(y1+y2)/2+nx*5} ${x2} ${y2}`;
 return <g opacity={amount>0?1:0}><path d={d} stroke={C.blue} fill="none" strokeWidth={5} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1-amount}/><path d={`M${x2-ux*22+nx*13} ${y2-uy*22+ny*13} L${x2} ${y2} L${x2-ux*22-nx*13} ${y2-uy*22-ny*13}`} opacity={progress(amount,0.8,.2)} stroke={C.blue} fill="none" strokeWidth={5} strokeLinejoin="round" strokeLinecap="round"/></g>;
}
export const FullScene:React.FC<{scene:Scene;showAll?:boolean}>=({scene:s,showAll=false})=>{
 const f=useCurrentFrame();const pos=positions(s);
 const leadOpacity=s.leadIn&&!showAll?progress(f,Math.ceil((leadInSeconds[s.id]??s.leadIn.seconds)*30)-s.startFrame,10)*(1-progress(f,s.nodes[0].at,12)):0;
 const fade=showAll?1:1-progress(f,s.durationInFrames,12);
 return <AbsoluteFill style={{opacity:fade}}>
 {s.leadIn&&leadOpacity>0&&<AbsoluteFill style={{opacity:leadOpacity,justifyContent:'center',alignItems:'center',fontSize:138,fontWeight:600,WebkitTextStroke:'.65px currentColor',color:C.blue}}>{s.leadIn.text}</AbsoluteFill>}
 <svg width={1920} height={1080} style={{position:'absolute',inset:0}} aria-label={s.visual_thesis}>
 {s.edges.map((edge,i)=>{const a=Number(edge[0]),b=Number(edge[1]);const at=Math.max(s.nodes[a].at,s.nodes[b].at)+18;return <Connection key={i} a={pos[a]} b={pos[b]} amount={showAll?1:progress(f,at,28)} curve={s.layout==='cycle'&&i===3}/>})}
 {s.layout==='compare'&&<path d="M960 310 Q954 500 960 630" stroke={C.muted} strokeWidth="2" strokeDasharray="8 14" opacity={showAll?1:progress(f,s.nodes[1].at)}/>}
 </svg>
 {s.nodes.map((node,i)=>{const q=pos[i],a=showAll?1:progress(f,node.at),lines=node.text.split('\n');const latest=showAll||i===s.nodes.length-1;
 return <div key={node.id} data-node={node.id} style={{position:'absolute',left:q.x-q.w/2,top:q.y,width:q.w,textAlign:'center',transform:`translateY(calc(-50% + ${(1-a)*20}px))`,opacity:a,color:colors[node.color],lineHeight:1.35,whiteSpace:'pre',fontWeight:600,WebkitTextStroke:'.65px currentColor'}}>
 {lines.map((line,j)=>{const parts=textParts[node.id]?.[j];const second=lineSeconds[node.id]?.[j];const opacity=showAll||parts||second===undefined?1:progress(f,Math.ceil(second*30)-s.startFrame,8);return <div key={j} style={{opacity,fontSize:fit(line,q.w,j===0?q.size:Math.min(60,q.size*.68)),color:j===0?undefined:C.ink,marginTop:j?25:0}}>{parts?parts.map(([text,at],k)=><span key={k} style={{opacity:showAll?1:progress(f,Math.ceil(at*30)-s.startFrame,8)}}>{text}</span>):line}</div>})}
 {latest&&s.layout==='stack'&&i===s.nodes.length-1&&<svg width={Math.min(850,q.w)} height="24" style={{display:'block',margin:'16px auto -40px'}}><path d={`M8 12 Q400 7 ${Math.min(842,q.w-8)} 12`} fill="none" stroke={C.yellow} strokeWidth="5" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1-(showAll?1:progress(f,node.at+22,28))}/></svg>}
 </div>})}
 </AbsoluteFill>
};
const SummaryScene:React.FC<{scene:Scene;showAll:boolean}>=({scene,showAll})=>{
 const first= Math.round(1237.12*30)-scene.startFrame;
 const second=Math.round(1241.72*30)-scene.startFrame;
 const capabilities=fullScenes.find(s=>s.id==='s10')!;
 const cycle=fullScenes.find(s=>s.id==='s11')!;
 const retime=(source:Scene,start:number,end:number,seconds:number[]):Scene=>({...source,startFrame:start,durationInFrames:end-start,leadIn:null,nodes:source.nodes.map((node,i)=>({...node,id:`summary-${node.id}`,text:node.text.split('\n')[0],at:Math.ceil(seconds[i]*30)-start}))});
 return <>
  <Sequence durationInFrames={first+12}><FullScene scene={{...scene,durationInFrames:first}} showAll={showAll}/></Sequence>
  <Sequence from={first} durationInFrames={second-first+12}><FullScene scene={retime(capabilities,scene.startFrame+first,scene.startFrame+second,[1237.55,1238.01,1238.20,1238.96])} showAll={showAll}/></Sequence>
  <Sequence from={second} durationInFrames={scene.durationInFrames-second+12}><FullScene scene={retime(cycle,scene.startFrame+second,scene.startFrame+scene.durationInFrames,[1241.97,1242.72,1243.72,1244.36])} showAll={showAll}/></Sequence>
 </>;
};
const DiagramTimeline=React.memo(()=>{
 const frame=useCurrentFrame();
 // These clips cover the entire composition. Do not redraw hidden diagrams.
 if(frame<1113||recordings.some(c=>frame>=c.from&&frame<c.from+c.durationInFrames))return null;
 return <DiagramPageTransition seconds={frame/30} assetUrl={staticFile}/>;
});
export const AgentFullVisual=React.memo(({showAll=false,illustratedHook=false}:{showAll?:boolean;illustratedHook?:boolean})=>{
 const [handle]=useState(()=>delayRender('HanziPen SC'));
 useEffect(()=>{loadFont({family:'AgentFullHanzi',url:staticFile('fonts/AgentFullHanzi.woff2'),weight:'400'}).then(()=>continueRender(handle)).catch(cancelRender)},[handle]);
 return <AbsoluteFill style={{background:C.paper,color:C.ink,fontFamily:'AgentFullHanzi',textShadow:'0 0 .5px rgba(255,255,255,.45)'}}>
 <Img src={staticFile('shared-visual/backgrounds/chalkboard/chalkboard.png')} style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover'}}/>
 <AbsoluteFill
   style={{
     background:
       'radial-gradient(circle at 50% 48%, rgba(0,0,0,0) 30%, rgba(0,0,0,.11) 100%)',
   }}
 />
 <Sequence name="开场 · 真实口播对齐" durationInFrames={995}><SyncedOpening illustratedHook={illustratedHook}/></Sequence>
 <DiagramTimeline/>
 <Sequence name="工具地图 · 七类同页" from={TOOL_MAP_START} durationInFrames={TOOL_MAP_END-TOOL_MAP_START}><SyncedToolMap showAll={showAll}/></Sequence>
 {recordings.map(cut=><Sequence key={cut.id} name={`录屏 · ${cut.label}`} from={cut.from} durationInFrames={cut.durationInFrames}><RecordingSequence cut={cut}/></Sequence>)}
 <Sequence from={969} durationInFrames={220} name="真人 · 学完之后与进入正题"><OpeningPresenterReturn/></Sequence>
 <ChapterTransition/>
 </AbsoluteFill>
});

// Keep the reviewed editorial clock; advance it over the deleted spoken title.
export const AgentFullCourse:React.FC<{showAll?:boolean}>=({showAll=false})=>{
 const frame=useCurrentFrame();
 const shift=frame>=narrationEdit.cutAtFrame?narrationEdit.removedFrames:0;
 return <AbsoluteFill>
  <Audio src={staticFile(narrationEdit.audio)}/>
  <Sequence from={-shift} name="口播删标题 · 画面同步"><AgentFullVisual showAll={showAll}/></Sequence>
 </AbsoluteFill>;
};
