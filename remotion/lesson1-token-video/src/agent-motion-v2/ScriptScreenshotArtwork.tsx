import React from 'react';
import shots from './script-screenshots.timeline.json';
const blend=(t:number,start:number,d=.45)=>{const q=Math.max(0,Math.min(1,(t-start)/d));return q*q*(3-2*q);};
export const activeScriptScreenshot=(seconds:number)=>shots.find(s=>seconds>=s.start&&seconds<s.end);
export const ScriptScreenshotArtwork:React.FC<{seconds:number;assetUrl:(path:string)=>string;backgroundUrl?:string}>=({seconds:t,assetUrl,backgroundUrl})=>{
 const shot=activeScriptScreenshot(t);
 if(!shot)return null;
 // Fit the full original image into the page, without clipping or panning.
 const maxW=1800,maxH=720,scale=Math.min(maxW/shot.width,maxH/shot.height);
 const w=shot.width*scale,h=shot.height*scale,x=(1920-w)/2,y=140+(maxH-h)/2;
 return <svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0,fontFamily:'AgentFullHanzi, HanziPen SC, cursive'}} data-shot={shot.id}>
  {backgroundUrl&&<image href={backgroundUrl} width="1920" height="1080"/>}
  <g opacity={blend(t,shot.start)}>
   <text x="960" y="100" textAnchor="middle" fontSize="66" fill="#7CC8EA">{shot.label}</text>
   <defs><clipPath id={`screenshot-rounded-${shot.id}`}><rect x={x} y={y} width={w} height={h} rx="24" ry="24"/></clipPath></defs>
   <image href={assetUrl(shot.asset)} x={x} y={y} width={w} height={h} preserveAspectRatio="xMidYMid meet" clipPath={`url(#screenshot-rounded-${shot.id})`}/>
  </g>
 </svg>;
};
