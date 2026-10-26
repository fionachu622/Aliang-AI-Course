import React from 'react';
import {AgentIdentity} from './AgentIdentity';
import stages from './visual-stages.json';
import {DiagramIcon} from './DiagramIcon';
const colors:Record<string,string>={white:'#F5F1E8',blue:'#7CC8EA',pink:'#F18D9E',green:'#A4D486',yellow:'#F0D26A'};
const ease=(t:number,start:number,d=.4)=>{const a=Math.max(0,Math.min(1,(t-start)/d));return a*a*(3-2*a);};
type Stage=typeof stages[number];
export const VisualStageArtwork:React.FC<{seconds:number;stageId?:string;still?:boolean;assetUrl:string;backgroundUrl?:string}>=({seconds:t,stageId,still=false,assetUrl,backgroundUrl})=>{
 const allowed=stages.filter(s=>t>=Math.max(s.start,Math.min(...s.nodes.filter(n=>!('hidden' in n&&n.hidden)).map(n=>n.at))));
 let stage=(stageId?stages.find(s=>s.id===stageId):allowed.at(-1)) as Stage|undefined;
 if(!stage||(!stageId&&t>=958.97&&t<1080.3))return null;
 const recap='recap' in stage&&stage.recap?.find(r=>t>=r.start&&t<r.end);
 if(recap&&!still){const source=stages.find(s=>s.id===recap.stageId)!;stage={...source,nodes:source.nodes.map((n,i)=>({...n,at:recap.nodeTimes[i],sub:'',hidden:('hideNodes' in recap&&recap.hideNodes?.includes(i))||('hidden' in n&&n.hidden)||false})),edges:source.edges.filter(e=>!('hideNodes' in recap&&recap.hideNodes?.some(i=>i===e.a||i===e.b))).map(e=>({...e,label:'',at:Math.max(recap.nodeTimes[e.a],recap.nodeTimes[e.b])+.2}))} as Stage;}
 const amount=(at:number)=>still?1:ease(t,at);
 // Only the first explanation gets motion; the shorter recap retains its own cues.
 const cycle=stage.id==='Agent09'&&!recap&&!still;
 const feedbackAt=453.4;
 const cycleFocus=(i:number)=>{
  if(!cycle)return 1;
  const starts=[443.5,445.73,449,450.63];
  const next=i<3?starts[i+1]:feedbackAt;
  const leave=ease(t,next,.3);
  const returnFocus=i===0?ease(t,feedbackAt+.8,.3):0;
  return 1-.36*leave*(1-returnFocus)*(1-ease(t,feedbackAt+1.6,.4));
 };
 const nodes=stage.nodes.map(n=>({...n}));
 if('motion' in stage&&stage.motion){const m=stage.motion;const q=still?1:ease(t,m.at,m.duration);nodes[m.node].x=m.from[0]+(m.to[0]-m.from[0])*q;nodes[m.node].y=m.from[1]+(m.to[1]-m.from[1])*q;}
 const previous=stages[stages.findIndex(s=>s.id===stage.id)-1];
 const entry=Math.max(stage.start,Math.min(...stage.nodes.filter(n=>!('hidden' in n&&n.hidden)).map(n=>n.at)));
 const carried=new Set<number>();
 if(previous&&!still&&t>=entry&&t<entry+1.1){nodes.forEach((n,i)=>{const old=previous.nodes.find(p=>p.text===n.text&&p.shape===n.shape&&!('hidden' in p&&p.hidden));if(old&&n.at<=entry){const q=ease(t,entry,1.1);n.x=old.x+(n.x-old.x)*q;n.y=old.y+(n.y-old.y)*q;carried.add(i);}});}
 // Focus around y=465; reserve y=900..1080 for subtitles.
 // Preserve the opening anchor exactly, then settle the whole diagram together.
 const layoutProgress=stage.id==='Agent02'&&!still?ease(t,51.72,1.1):1;
 const layoutScale=1-.12*layoutProgress;
 const bounds=stage.nodes.filter(n=>!('hidden' in n&&n.hidden)).map(n=>{
  const y=stage.id==='Agent02'&&n.shape==='agent'?440:n.y;
  const agent=n.shape==='agent',text=n.shape==='text';
  const base=text?0:agent?(stage.id==='Agent02'?235:191):105;
  const lines=n.text.split('\n').length;
  const top=y-(text?n.size:agent?(stage.id==='Agent02'?180:125):170);
  const bottom=n.sub?y+base+lines*n.size*1.25+(stage.id==='Agent02'?-30:30)+(n.sub.split('\n').length-1)*55+15:y+base+(lines-1)*n.size*1.25+n.size*.25;
  return {top,bottom};
 });
 const contentTop=Math.min(...bounds.map(b=>b.top)),contentBottom=Math.max(...bounds.map(b=>b.bottom));
 const layoutY=Math.min(465-.88*(contentTop+contentBottom)/2,875-.88*contentBottom);
 const folder='folderCue' in stage&&stage.folderCue&&(still||t>=stage.folderCue);
 return <svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0,fontFamily:'AgentFullHanzi, HanziPen SC, cursive'}}>
  {backgroundUrl&&<image href={backgroundUrl} width="1920" height="1080"/>}
  <g opacity={stage.id==='Agent02'&&!still?ease(t,51.72,.4):1} transform={`translate(${115.2*layoutProgress} ${layoutY*layoutProgress}) scale(${layoutScale})`} data-layout="upper-focus-subtitle-safe">
  <defs><marker id="visual-arrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto"><path d="M1 1 L8 5 L1 9" fill="none" stroke={colors.blue} strokeWidth="1.4"/></marker></defs>
  {stage.edges.map((e,i)=>{const a=nodes[e.a],b=nodes[e.b];const dx=b.x-a.x,dy=b.y-a.y,len=Math.hypot(dx,dy),ux=dx/len,uy=dy/len;const gap=Math.abs(ux)>.8?190:135;const x1=a.x+ux*gap,y1=a.y+uy*gap,x2=b.x-ux*gap,y2=b.y-uy*gap;const edgeAt=cycle&&i===3?feedbackAt:Math.max(e.at,a.at,b.at);const v=cycle&&i===3?ease(t,edgeAt,.8):amount(edgeAt);return <g key={e.id} data-edge={e.id} opacity={v}>
   <path d={`M${x1} ${y1} L${x2} ${y2}`} fill="none" stroke={colors.blue} strokeWidth="4" pathLength="1" strokeDasharray="1" strokeDashoffset={1-v} markerEnd={v>.95&&e.type==='sequence'?'url(#visual-arrow)':undefined}/>
   {e.label&&<text x={(x1+x2)/2+(Math.abs(uy)>.8?110:0)} y={(y1+y2)/2-(Math.abs(uy)>.8?0:25)} textAnchor="middle" fontSize="36" fill={colors.blue}>{e.label}</text>}
  </g>})}
  {nodes.map((n,i)=>{if('hidden' in n&&n.hidden)return null;const shape=folder&&i===0?'folder':n.shape;const label=folder&&i===0?'文件夹':n.text;const color=colors[n.color]??colors.white;const lines=label.split('\n');const size=Math.min(n.size,650/Math.max(...lines.map(s=>[...s].reduce((v,c)=>v+(/[\x00-\x7F]/.test(c)?.55:1),0))));const isAgent=shape==='agent';const width=stage.id==='Agent02'&&i===1?(still?570:430+140*ease(t,51.72,1.1)):390;return <g key={n.id??i} data-node={n.id} opacity={((stage.id==='Agent02'&&i===1)||carried.has(i)?1:amount(n.at))*cycleFocus(i)} transform={`translate(${n.x} ${n.y})`}>
   {cycle&&<path d="M-90 139 Q0 145 90 139" fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" opacity={amount(n.at)*(cycleFocus(i)-.64)/.36*(1-ease(t,feedbackAt+1.6,.4))}/>}
   {isAgent?<image href={assetUrl} x={-width/2} y={-width*.516} width={width} height={width}/>:shape!=='text'?<g transform="translate(-110 -130) scale(1.3)"><DiagramIcon kind={shape} color={color}/></g>:null}
   {lines.map((line,j)=><text key={j} opacity={'lineAts' in n?amount(n.lineAts?.[j]??n.at):1} x="0" y={(shape==='text'?0:isAgent?(stage.id==='Agent02'?235:width*.49):105)+j*(size*1.25)} textAnchor="middle" fontSize={size} fill={color}>{line}</text>)}
   {n.sub&&<g opacity={amount(n.subAt)}>{n.sub.split('\n').map((line,j)=><text key={j} x="0" y={(isAgent?(stage.id==='Agent02'?235:width*.49):105)+lines.length*size*1.25+(stage.id==='Agent02'?-30:30)+j*55} textAnchor="middle" fontSize="39" fill={colors.white}>{line}</text>)}</g>}
  </g>})}
  {stage.id==='Agent02'&&'definition' in stage&&stage.definition&&t<51.72&&<g>{stage.definition.map((p,i)=><text key={p.text} x="1210" y={420+i*95} textAnchor="middle" fontSize={i===0?68:54} fill={i===0?colors.blue:colors.white} opacity={amount(p.at)}>{p.text}</text>)}</g>}
 </g>
 {stage.id==='Agent02'&&!still&&t<52.12&&<AgentIdentity seconds={t}/>}
 </svg>;
};
