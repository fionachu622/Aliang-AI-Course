import React from 'react';
import {AbsoluteFill, Img, interpolate, Easing, useCurrentFrame, staticFile, Html5Video, getRemotionEnvironment} from 'remotion';
import {OpeningText} from './OpeningText';
import {OpeningCoursePath} from './OpeningCoursePath';
import timing from './opening.timeline.json';
import {CourseVideo as Video} from './PreviewMedia';
export const SyncedOpening:React.FC<{illustratedHook?:boolean}>=({illustratedHook=false})=>{
 const frame=useCurrentFrame();
 const rendering=getRemotionEnvironment().isRendering;
 if(!illustratedHook&&frame<Math.round(timing.hookEnd*30))return <AbsoluteFill style={{background:'#000'}}>
 {rendering ? <Video src={staticFile(timing.presenterSource)} muted objectFit="contain" style={{width:'100%',height:'100%'}} /> : <Html5Video src={staticFile('agent-course/media/presenter-opening-preview.mp4')} muted style={{width:'100%',height:'100%',objectFit:'contain'}} />}
 </AbsoluteFill>;
 const reaction=interpolate(frame,[timing.handoffVisual.reaction.startFrame,timing.handoffVisual.reaction.endFrame],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:Easing.inOut(Easing.quad)});
 const agentReveal=interpolate(frame,[507,519],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
 const illustrationExit=interpolate(frame,[585,603],[1,0],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
 const handoff=interpolate(frame,[594,603],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
 const reactionEdge=1980-2040*reaction;
 const reactionMask=`linear-gradient(to right, transparent ${reactionEdge-60}px, black ${reactionEdge+60}px)`;
 const imageStyle:React.CSSProperties={position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'contain'};
 return <>{frame<603&&<AbsoluteFill style={{opacity:illustrationExit,pointerEvents:'none'}}>
  <Img src={staticFile(timing.handoffVisual.agentReveal.plate)} style={{...imageStyle,opacity:1-agentReveal}}/>
  {agentReveal>0&&<Img src={staticFile(timing.handoffVisual.asset)} style={{...imageStyle,opacity:agentReveal}}/>}
  {reaction>0&&<Img src={staticFile(timing.handoffVisual.reaction.asset)} style={{...imageStyle,maskImage:reactionMask,WebkitMaskImage:reactionMask}}/>}
 </AbsoluteFill>}
 {frame>=585&&frame<1045&&<AbsoluteFill style={{opacity:handoff}}><OpeningCoursePath/></AbsoluteFill>}
 {frame>=995&&<OpeningText/>}</>;
};
