import {ChalkText} from './CourseTypography';
import {RemainingEditorial, remainingSceneAt} from './RemainingEditorial';
import {MechanismPage} from './MechanismPage';
import React from 'react';
import {ContinuousDiagram, diagramLayouts} from './ContinuousDiagram';
import {TeachingScene, teachingIds} from './TeachingScenes';
import {AgentIdentity} from './AgentIdentity';
import {AgentEntryEvolution} from './AgentEntryEvolution';
import stages from './visual-stages.json';
import {ComputerOperationIntro} from './ComputerOperationIntro';
import {ContinuousWorkIntro} from './ContinuousWorkIntro';
import {ParallelWorkIntro} from './ParallelWorkIntro';
import storyboard from './continuous-diagrams.storyboard.json';
import {DiagramIcon} from './DiagramIcon';
const colors:Record<string,string>={white:'#F5F1E8',blue:'#7CC8EA',pink:'#F18D9E',green:'#A4D486',yellow:'#F0D26A'};
const ease=(t:number,start:number,d=.4)=>{const a=Math.max(0,Math.min(1,(t-start)/d));return a*a*(3-2*a);};
type Stage=typeof stages[number];
export const VisualStageArtwork:React.FC<{seconds:number;stageId?:string;still?:boolean;assetUrl:string;reviewStillUrl?:string;backgroundUrl?:string}>=({seconds:t,stageId,still=false,assetUrl,reviewStillUrl,backgroundUrl})=>{
 if(!stageId&&remainingSceneAt(t))return <RemainingEditorial seconds={t}/>;
 if(!stageId&&t>=storyboard.mechanism_page.start+43/30&&t<storyboard.mechanism_page.end+43/30)return <MechanismPage seconds={t}/>;
 if(!stageId&&t>=111.16666666666667&&t<166.53)return <AgentEntryEvolution seconds={t}/>;
 const parallel=storyboard.parallel_work_intro;
 if(!stageId&&t>=parallel.start+parallel.legacyOffsetSeconds&&t<parallel.end+parallel.legacyOffsetSeconds)return <ParallelWorkIntro seconds={t} still={still} backgroundUrl={backgroundUrl}/>;
 // Only the explicitly retained audience/tool comparison may use legacy artwork here.
 if(!stageId&&t>=480.88){
  if(t>=1080.3&&t<1129.92)return <VisualStageArtwork seconds={t} stageId="Agent22" assetUrl={assetUrl} reviewStillUrl={reviewStillUrl} backgroundUrl={backgroundUrl}/>;
  return null;
 }
 const allowed=stages.filter(s=>t>=Math.max(s.start,Math.min(...s.nodes.filter(n=>!('hidden' in n&&n.hidden)).map(n=>n.at))));
 let stage=(stageId?stages.find(s=>s.id===stageId):allowed.at(-1)) as Stage|undefined;
 if(!stage||(!stageId&&t>=958.97&&t<1080.3))return null;
 if(stage.id==='Agent07'&&t<311.6333333334)return <ParallelWorkIntro seconds={t} still={still} backgroundUrl={backgroundUrl}/>;
 if(stage.id==='Agent06-intro')return <ContinuousWorkIntro seconds={t} still={still} backgroundUrl={backgroundUrl}/>;
 if(stage.id==='Agent05-intro')return <ComputerOperationIntro seconds={t} still={still} backgroundUrl={backgroundUrl}/>;
 // One persistent diagram for the definition; no second layout fades in early.
 if(stage.id==='Agent02'&&t>=41.0666667&&t<61.7666667)return <svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0,fontFamily:'AgentFullHanzi, HanziPen SC, cursive'}}>{backgroundUrl&&<image href={backgroundUrl} width="1920" height="1080"/>}<AgentIdentity seconds={t}/></svg>;
 const recap='recap' in stage&&stage.recap?.find(r=>t>=r.start&&t<r.end);
 if(recap&&!still){const source=stages.find(s=>s.id===recap.stageId)!;stage={...source,nodes:source.nodes.map((n,i)=>({...n,at:recap.nodeTimes[i],sub:'',hidden:('hideNodes' in recap&&recap.hideNodes?.includes(i))||('hidden' in n&&n.hidden)||false})),edges:source.edges.filter(e=>!('hideNodes' in recap&&recap.hideNodes?.some(i=>i===e.a||i===e.b))).map(e=>({...e,label:'',at:Math.max(recap.nodeTimes[e.a],recap.nodeTimes[e.b])+.2}))} as Stage;}
 if(diagramLayouts[stage.id])return <svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:"absolute",inset:0,fontFamily:"AgentFullHanzi, HanziPen SC, cursive"}}>{backgroundUrl&&<image href={backgroundUrl} width="1920" height="1080"/>}<ContinuousDiagram stage={stage} seconds={t} still={still} assetUrl={assetUrl} reviewStillUrl={reviewStillUrl}/></svg>;
 if(!recap&&teachingIds.includes(stage.id))return <svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0,fontFamily:'AgentFullHanzi, HanziPen SC, cursive'}}>{backgroundUrl&&<image href={backgroundUrl} width="1920" height="1080"/>}<TeachingScene id={stage.id} seconds={t} still={still}/></svg>;
 const amount=(at:number)=>still?1:ease(t,at);
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
  {stage.edges.map((e,i)=>{const a=nodes[e.a],b=nodes[e.b];const dx=b.x-a.x,dy=b.y-a.y,len=Math.hypot(dx,dy),ux=dx/len,uy=dy/len;const gap=Math.abs(ux)>.8?190:135;const x1=a.x+ux*gap,y1=a.y+uy*gap,x2=b.x-ux*gap,y2=b.y-uy*gap;const v=amount(Math.max(e.at,a.at,b.at));return <g key={e.id} data-edge={e.id} opacity={v}>
   <path d={`M${x1} ${y1} L${x2} ${y2}`} fill="none" stroke={colors.blue} strokeWidth="4" pathLength="1" strokeDasharray="1" strokeDashoffset={1-v} markerEnd={v>.95&&e.type==='sequence'?'url(#visual-arrow)':undefined}/>
   {e.label&&<ChalkText x={(x1+x2)/2+(Math.abs(uy)>.8?110:0)} y={(y1+y2)/2-(Math.abs(uy)>.8?0:25)} textAnchor="middle" fontSize="36" fill={colors.blue}>{e.label}</ChalkText>}
  </g>})}
  {nodes.map((n,i)=>{if('hidden' in n&&n.hidden)return null;const shape=folder&&i===0?'folder':n.shape;const label=folder&&i===0?'文件夹':n.text;const color=colors[n.color]??colors.white;const lines=label.split('\n');const size=Math.min(n.size,650/Math.max(...lines.map(s=>[...s].reduce((v,c)=>v+(/[\x00-\x7F]/.test(c)?.55:1),0))));const isAgent=shape==='agent';const width=stage.id==='Agent02'&&i===1?(still?570:430+140*ease(t,51.72,1.1)):390;return <g key={n.id??i} data-node={n.id} opacity={(stage.id==='Agent02'&&i===1)||carried.has(i)?1:amount(n.at)} transform={`translate(${n.x} ${n.y})`}>
   {isAgent?<image href={assetUrl} x={-width/2} y={-width*.516} width={width} height={width}/>:shape!=='text'?<g transform="translate(-110 -130) scale(1.3)"><DiagramIcon kind={shape} color={color}/></g>:null}
   {lines.map((line,j)=><ChalkText key={j} opacity={'lineAts' in n?amount(n.lineAts?.[j]??n.at):1} x="0" y={(shape==='text'?0:isAgent?(stage.id==='Agent02'?235:width*.49):105)+j*(size*1.25)} textAnchor="middle" fontSize={size} fill={color}>{line}</ChalkText>)}
   {n.sub&&<g opacity={amount(n.subAt)}>{n.sub.split('\n').map((line,j)=><ChalkText key={j} x="0" y={(isAgent?(stage.id==='Agent02'?235:width*.49):105)+lines.length*size*1.25+(stage.id==='Agent02'?-30:30)+j*55} textAnchor="middle" fontSize="39" fill={colors.white}>{line}</ChalkText>)}</g>}
  </g>})}
  {stage.id==='Agent02'&&'definition' in stage&&stage.definition&&t<51.72&&<g>{stage.definition.map((p,i)=><ChalkText key={p.text} x="1210" y={420+i*95} textAnchor="middle" fontSize={i===0?68:54} fill={i===0?colors.blue:colors.white} opacity={amount(p.at)}>{p.text}</ChalkText>)}</g>}
 </g>
 {stage.id==='Agent02'&&!still&&t<52.12&&<AgentIdentity seconds={t}/>}
 </svg>;
};
