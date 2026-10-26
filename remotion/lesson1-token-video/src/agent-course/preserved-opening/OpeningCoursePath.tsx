import React from 'react';
import {AbsoluteFill,Img,staticFile,interpolate,useCurrentFrame,Easing} from 'remotion';
import {v9Colors as C} from '../../v9/VisualV9';
const p=(f:number,s:number,d=12)=>interpolate(f,[s,s+d],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:Easing.bezier(.22,.7,.25,1)});
export const OpeningCoursePath:React.FC=()=>{
 const f=useCurrentFrame();const move=p(f,585,54),exit=p(f,1033,12);
 if(f<507)return null;
 // The incoming Agent remains the parent of all three course topics.
 const startX=1560;
 const startY=260;
 const startSize=420;
 const x=startX+(440-startX)*move,y=startY+(445-startY)*move,size=startSize+(570-startSize)*move;
 const branches=[{y:265,at:654,label:'认识 Agent',color:C.blue},{y:510,at:697,label:'使用实战',color:C.magenta},{y:755,at:888,label:'工具上手',color:C.green}];
 return <AbsoluteFill style={{opacity:1-exit}}>
  <Img src={staticFile('agent-course/agent-pet-cream-v8.png')} style={{position:'absolute',left:x-size/2,top:y-size*.516,width:size,height:size,opacity:p(f,507,12)}}/>
  <svg width="1920" height="1080" style={{position:'absolute',inset:0,overflow:'visible'}}>
   <text x={x} y={y+235} textAnchor="middle" fill={C.ink} fontSize="78" opacity={p(f,585,8)}>Agent</text>
   {branches.map((branch,i)=>{
    const amount=p(f,branch.at,16);
    return <g key={branch.label}>
     <path d={`M660 445 C800 445 810 ${branch.y} 980 ${branch.y}`} fill="none" stroke={branch.color} strokeWidth="6" strokeLinecap="round" opacity={amount*.7} pathLength="1" strokeDasharray="1" strokeDashoffset={1-amount}/>
     <g opacity={p(f,branch.at+4,12)}>
      <g transform={`translate(1110 ${branch.y}) scale(.72)`} fill="none" stroke={C.ink} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round">
       {i===0?<><path d="M-75 -56 H14 L42 -28 V59 H-75 Z M14 -56 V-28 H42 M-52 -25 H-13 M-52 -4 H-23"/><circle cx="34" cy="17" r="31"/><path d="M56 39 L80 63"/></>:i===1?<><rect x="-85" y="-57" width="170" height="114" rx="8"/><path d="M-16 -29 L30 0 L-16 29 Z M-60 78 H60"/></>:<><rect x="-80" y="-44" width="160" height="111" rx="8"/><path d="M-80 -3 H80 M-35 -44 V-67 H35 V-44 M-13 -15 V15 H13 V-15"/></>}
      </g>
      <text x="1260" y={branch.y+22} textAnchor="start" fill={branch.color} fontSize="62">{branch.label}</text>
     </g>
    </g>;
   })}
  </svg>
 </AbsoluteFill>;
};
