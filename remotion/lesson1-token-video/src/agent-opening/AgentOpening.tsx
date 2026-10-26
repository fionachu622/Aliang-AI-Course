import React, {useEffect, useState} from 'react';
import {loadFont} from '@remotion/fonts';
import {AbsoluteFill, Img, Sequence, interpolate, Easing, useCurrentFrame, staticFile, delayRender, continueRender, cancelRender} from 'remotion';
import {v9Colors} from '../v9/VisualV9';
const ink=v9Colors.ink, blue=v9Colors.blue, pink=v9Colors.magenta;
export const OPENING_DURATION=2460;
const p=(f:number,start:number,duration=20)=>interpolate(f,[start,start+duration],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:Easing.bezier(.22,1,.36,1)});
const Reveal:React.FC<{at?:number;children:React.ReactNode;style?:React.CSSProperties}>=({at=0,children,style})=>{const f=useCurrentFrame();const v=p(f,at);return <div style={{opacity:v,transform:`translateY(${(1-v)*24}px)`,...style}}>{children}</div>};
const Group:React.FC<{from:number;to:number;children:React.ReactNode}>=({from,to,children})=>{const f=useCurrentFrame();return <AbsoluteFill style={{alignItems:'center',justifyContent:'center',opacity:p(f,from)* (1-p(f,to-14,14)),pointerEvents:'none'}}>{children}</AbsoluteFill>};
const Line:React.FC<{at:number;width?:number;color?:string}>=({at,width=600,color=blue})=>{const f=useCurrentFrame();return <svg width={width} height={24} viewBox={`0 0 ${width} 24`} style={{overflow:'visible',marginTop:14}}><path d={`M 4 15 Q ${width*.46} 11 ${width-4} 14`} fill="none" stroke={color} strokeWidth={5} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1-p(f,at,26)}/></svg>};
const Arrow:React.FC<{at:number}>=({at})=>{const f=useCurrentFrame();return <svg width="170" height="70" viewBox="0 0 170 70"><path d="M8 36 Q80 30 157 35 M139 18 L157 35 L137 51" fill="none" stroke={blue} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1-p(f,at,24)}/></svg>};
const Mark:React.FC<{at:number;children:React.ReactNode}>=({at,children})=>{const f=useCurrentFrame();return <span style={{position:'relative',display:'inline-block'}}><span style={{position:'absolute',left:-14,right:-14,top:'89%',bottom:'1%',background:v9Colors.yellow,transform:`scaleX(${p(f,at,26)}) rotate(-1deg)`,transformOrigin:'left center'}}/><span style={{position:'relative'}}>{children}</span></span>};
const Flow:React.FC<{words:string[];ats:number[];size?:number}>=({words,ats,size=100})=><div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:38}}>{words.map((w,i)=><React.Fragment key={i}>{i>0&&<Arrow at={ats[i]-20}/>}<Reveal at={ats[i]} style={{fontSize:size,whiteSpace:'nowrap'}}>{w}</Reveal></React.Fragment>)}</div>;
export const OpeningOne=()=>{const f=useCurrentFrame();return <>
<Group from={0} to={195}><div style={{textAlign:'center'}}><Reveal at={5} style={{fontSize:interpolate(p(f,64,26),[0,1],[132,86]),color:f>64?v9Colors.muted:ink,marginBottom:35}}>不是做不了</Reveal>{f>=64&&<Reveal at={64} style={{fontSize:144}}>只是<Mark at={93}>嫌麻烦</Mark></Reveal>}</div></Group>
<Group from={200} to={390}><Flow words={['你说一句','AI 来做']} ats={[205,268]} size={138}/></Group>
</>};
export const OpeningTwo=()=> <>
<Group from={0} to={190}><Reveal at={8} style={{fontSize:210,lineHeight:1.1}}>Agent</Reveal><Line at={34} width={540}/><Reveal at={65} style={{fontSize:84,marginTop:50}}>能替你办事的 AI</Reveal></Group>
<Group from={194} to={670}><Reveal at={200} style={{fontSize:100,marginBottom:90,color:blue}}>Agent</Reveal><Flow words={['认识 Agent','完整实战','工具上手']} ats={[225,350,515]} size={86}/></Group>
<Group from={675} to={840}><Reveal at={681} style={{fontSize:130}}>不会编程，<span style={{color:pink}}>也能用</span></Reveal><Line at={716} width={1080} color={pink}/></Group>
</>;
export const OpeningThree=()=> <>
<Group from={0} to={230}><Reveal at={8} style={{fontSize:128}}>把麻烦事，交给 Agent</Reveal><Line at={48} width={1230}/></Group>
<Group from={235} to={810}><Reveal at={240} style={{fontSize:146}}>Agent <span style={{color:blue}}>=</span> 智能体</Reveal><Reveal at={350} style={{fontSize:100,marginTop:65}}>能办事的 <Mark at={385}>AI 系统</Mark></Reveal><div style={{display:'flex',gap:110,marginTop:90,fontSize:64,color:v9Colors.muted}}><Reveal at={540}>≠ 某个软件名</Reveal><Reveal at={655}>≠ 新的大模型</Reveal></div></Group>
<Group from={815} to={1050}><Flow words={['提需求','去执行','交结果']} ats={[820,876,932]} size={118}/><Line at={974} width={1330} color={v9Colors.green}/></Group>
<Group from={1055} to={1230}><Reveal at={1060} style={{fontSize:132}}>让它整理文件夹</Reveal><Line at={1095} width={1050} color={pink}/></Group>
</>;
export const AgentOpening:React.FC<{shot?:number}>=({shot=0})=>{const [handle]=useState(()=>delayRender('Loading HanziPen'));useEffect(()=>{loadFont({family:'AgentHanzi',url:staticFile('fonts/HanziPenSC-Regular.otf'),weight:'400'}).then(()=>continueRender(handle)).catch(cancelRender)},[handle]);return <AbsoluteFill style={{background:v9Colors.paper,color:ink,fontFamily:'AgentHanzi',textShadow:'0 0 .5px rgba(255,255,255,.45)'}}><Img src={staticFile('shared-visual/backgrounds/chalkboard/chalkboard.png')} style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover'}}/><AbsoluteFill style={{background:'radial-gradient(circle at 50% 48%, rgba(0,0,0,0) 30%, rgba(0,0,0,.11) 100%)'}}/><AbsoluteFill className="agent-chalkboard-v3" style={{fontWeight:600}}><style>{`.agent-chalkboard-v3 div,.agent-chalkboard-v3 span{font-weight:600;-webkit-text-stroke:.65px currentColor;paint-order:stroke fill}`}</style>{shot===0?<><Sequence name="01 嫌麻烦 → AI来做" durationInFrames={390}><OpeningOne/></Sequence><Sequence name="02 Agent与课程路径" from={390} durationInFrames={840}><OpeningTwo/></Sequence><Sequence name="03 定义 → 执行 → 演示" from={1230} durationInFrames={1230}><OpeningThree/></Sequence></>:shot===1?<OpeningOne/>:shot===2?<OpeningTwo/>:<OpeningThree/>}</AbsoluteFill></AbsoluteFill>};
