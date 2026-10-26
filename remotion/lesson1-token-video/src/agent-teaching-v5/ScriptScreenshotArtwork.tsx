import {ChalkText} from './CourseTypography';
import React from 'react';
import {CueUnderline, cueProgress} from './CourseMotion';
import shots from './script-screenshots.timeline.json';
const blend=(t:number,start:number,d=.45)=>{const q=Math.max(0,Math.min(1,(t-start)/d));return q*q*(3-2*q);};
export const activeScriptScreenshot=(seconds:number)=>shots.find(s=>seconds>=s.start&&seconds<s.end);
export const ScriptScreenshotArtwork:React.FC<{seconds:number;assetUrl:(path:string)=>string;backgroundUrl?:string}>=({seconds:t,assetUrl,backgroundUrl})=>{
 const shot=activeScriptScreenshot(t);
 if(!shot)return null;
 const ids=['web','mobile','desktop','terminal'];
 if(ids.includes(shot.id))return <AccumulatingForms seconds={t} assetUrl={assetUrl} backgroundUrl={backgroundUrl}/>;
 const index=shots.findIndex(s=>s.id===shot.id);
 const previous=index>0?shots[index-1]:undefined;
 const replacing=ids.includes(shot.id)&&previous&&ids.includes(previous.id)&&Math.abs(previous.end-shot.start)<.001&&t<shot.start+.4;
 // Critically damped response, normalized to settle exactly at 12 frames.
 const q=Math.max(0,Math.min(1,(t-shot.start)/.4));
 const response=(v:number)=>1-(1+7*v)*Math.exp(-7*v);
 const progress=response(q)/response(1);
 const draw=(page:typeof shot,opacity:number,dx:number)=>{
  const scale=Math.min(1760/page.width,720/page.height);
  const w=page.width*scale,h=page.height*scale,x=(1920-w)/2,y=250+(720-h)/2;
  return <g key={page.id} opacity={opacity} transform={`translate(${dx} 0)`}>
   <CueUnderline t={t} at={page.start+.28} x={960-Math.min(440,page.label.length*28)/2} y={180} width={Math.min(440,page.label.length*28)} color={({free:'#F0D26A',subscription:'#7CC8EA',credits:'#A4D486',topup:'#F18D9E',api:'#EFA884'} as Record<string,string>)[page.id]??'#7CC8EA'}/><ChalkText x="960" y="150" textAnchor="middle" fontSize="66" fill={({free:'#F0D26A',subscription:'#7CC8EA',credits:'#A4D486',topup:'#F18D9E',api:'#EFA884'} as Record<string,string>)[page.id]??'#7CC8EA'}>{page.label}</ChalkText>
   <defs><clipPath id={`screenshot-rounded-${page.id}`}><rect x={x} y={y} width={w} height={h} rx="24" ry="24"/></clipPath></defs>
   <image opacity={cueProgress(t,page.start+.12,.38)} transform={`translate(0 ${18*(1-cueProgress(t,page.start+.12,.38))})`} href={assetUrl(page.asset)} x={x} y={y} width={w} height={h} preserveAspectRatio="xMidYMid meet" clipPath={`url(#screenshot-rounded-${page.id})`}/>
  </g>;
 };
 return <svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0,fontFamily:'AgentFullHanzi, HanziPen SC, cursive'}} data-shot={shot.id}>
  {backgroundUrl&&<image href={backgroundUrl} width="1920" height="1080"/>}
  {replacing? <>{draw(previous,1-progress,-32*progress)}{draw(shot,progress,32*(1-progress))}</>:draw(shot,ids.includes(shot.id)&&index>0?1:blend(t,shot.start),0)}
 </svg>;
};

// Critically damped response with a zero-velocity endpoint correction.
// One shared progress drives translation and scale; deterministic under seeking.
const DOCK_SECONDS=.8;
const settle=(t:number,start:number,d=DOCK_SECONDS)=>{
 const q=Math.max(0,Math.min(1,(t-start)/d));
 const norm=1-9*Math.exp(-8);
 const response=(1-(1+8*q)*Math.exp(-8*q))/norm;
 const endSlope=64*Math.exp(-8)/norm;
 return response-endSlope*(q*q*q-q*q);
};
const AccumulatingForms:React.FC<{seconds:number;assetUrl:(path:string)=>string;backgroundUrl?:string}>=({seconds:t,assetUrl,backgroundUrl})=>{
 const pages=shots.slice(0,4);
 const finalAt=pages[3].end-2.6;

 return <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0,fontFamily:'AgentFullHanzi, HanziPen SC, cursive'}}>
 {backgroundUrl&&<image href={backgroundUrl} width="1920" height="1080"/>}
 <ChalkText x="960" y="120" textAnchor="middle" fontSize="66" fill="#F5F1E8">Agent 的使用方式</ChalkText>
 {pages.map((page,i)=>{
  if(t<page.start)return null;
  const dockAt=i<3?pages[i+1].start:finalAt;
  const dock=settle(t,dockAt);
  const enter=blend(t,page.start+(i? DOCK_SECONDS:0),.3);
  const slot=[0,2,1,3][i];
  const column=slot%2,row=Math.floor(slot/2);
  const targetX=column===0?570:1350;
  const cx=960+(targetX-960)*dock;
  const targetTop=300+row*370;
  const imageTop=300+(targetTop-300)*dock;
  const maxW=1500+(580-1500)*dock,maxH=600+(210-600)*dock;
  const scale=Math.min(maxW/page.width,maxH/page.height),w=page.width*scale,h=page.height*scale;
  const y=imageTop+(maxH-h)/2+16*(1-enter);
  const labelY=210+(250+row*370-210)*dock;
  const color=['#7CC8EA','#F18D9E','#A4D486','#F0D26A'][i];
  const grouped=blend(t,dockAt+.4,.4);
  return <g key={page.id} opacity={enter}>
   {dock<1&&<g opacity={1-blend(t,dockAt+.35,.35)}><image href={assetUrl('shared-visual/backgrounds/chalkboard/chalkboard.png')} x="0" y="0" width="1920" height="1080"/><ChalkText x="960" y="120" textAnchor="middle" fontSize="66" fill="#F5F1E8">Agent 的使用方式</ChalkText></g>}
   <g opacity={grouped}>
    <rect x={targetX-330} y={194+row*370} width={660} height={340} rx={18} fill="#15191C" fillOpacity={.16} stroke={color} strokeOpacity={.3} strokeWidth={2}/>
   </g>
   <ChalkText x={cx} y={labelY} textAnchor="middle" fontSize={60-16*dock} fill={color}>{page.label}</ChalkText>
   <defs><clipPath id={`form-${page.id}`}><rect x={cx-w/2} y={y} width={w} height={h} rx={18-8*dock}/></clipPath></defs>
   <image href={assetUrl(page.asset)} x={cx-w/2} y={y} width={w} height={page.height*scale} preserveAspectRatio="xMidYMid meet" clipPath={`url(#form-${page.id})`}/>
  </g>;
 })}
 </svg>;
};
