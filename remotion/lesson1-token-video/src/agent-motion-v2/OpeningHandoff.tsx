import React from 'react';
import {staticFile,useCurrentFrame} from 'remotion';
const q=(f:number,start:number,duration:number)=>{const v=Math.max(0,Math.min(1,(f-start)/duration));return v*v*(3-2*v);};
export const OpeningHandoffArtwork:React.FC<{frame:number;assetUrl:(p:string)=>string}>=({frame:f,assetUrl})=>{
 if(f<969||f>=1113)return null;
 const scene=q(f,975,18),handoff=q(f,1046,26),relief=q(f,1073,18),out=1-q(f,1104,9);
 const px=1290+(700-1290)*handoff,py=555+(465-555)*handoff-90*Math.sin(handoff*Math.PI);
 return <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0,fontFamily:'AgentFullHanzi, HanziPen SC, cursive'}}>
  <g opacity={out}>
   <g transform={`translate(530 445) rotate(${-5*relief})`}>
    <image href={assetUrl('agent-course/agent-pet-cream-v8.png')} x="-215" y="-221.88" width="430" height="430"/>
   </g>
   <text x="530" y="680" textAnchor="middle" fill="#F5F1E8" fontSize="78">Agent</text>
   <g opacity={scene} transform="translate(790 155)">
    {relief<1&&<image href={assetUrl('agent-course/media/opening-paperwork-v4.png')} width="900" height="517" opacity={1-relief}/>}
    {relief>0&&<image href={assetUrl('agent-course/media/opening-paperwork-relieved-v4.png')} width="900" height="517" opacity={relief}/>}
   </g>
   <g opacity={q(f,1034,10)} transform={`translate(${px} ${py}) rotate(${-8*handoff})`}>
    <path d="M-46 -58 Q-2 -61 25 -58 L46 -36 L45 57 Q0 60 -46 57 Z M25 -58 V-36 H46" fill="#F5F1E8" stroke="#C4BDAE" strokeWidth="2.5"/>
    <path d="M-28 -17 Q0 -19 28 -17 M-28 0 H27 M-28 17 H20 M-28 34 H8" fill="none" stroke="#657078" strokeWidth="3"/>
   </g>
  </g>
 </svg>;
};
export const OpeningHandoff=()=> <OpeningHandoffArtwork frame={useCurrentFrame()} assetUrl={staticFile}/>;
