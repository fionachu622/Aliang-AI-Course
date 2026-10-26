import React from 'react';
import {AbsoluteFill, Img, interpolate, useCurrentFrame, staticFile, Html5Video, getRemotionEnvironment} from 'remotion';
import {OpeningText} from './OpeningText';
import {OpeningCoursePath} from './OpeningCoursePath';
import {OPENING_SCENE_SCALE, OPENING_SCENE_X, OPENING_SCENE_Y} from './opening-layout';
import timing from './opening.timeline.json';
import {CourseVideo as Video} from '../PreviewMedia';
export const SyncedOpening:React.FC<{illustratedHook?:boolean}>=({illustratedHook=false})=>{
 const frame=useCurrentFrame();
 const rendering=getRemotionEnvironment().isRendering;
 if(!illustratedHook&&frame<Math.round(timing.hookEnd*30))return <AbsoluteFill style={{background:'#000'}}>
 {rendering ? <Video src={staticFile(timing.presenterSource)} muted objectFit="contain" style={{width:'100%',height:'100%'}} /> : <Html5Video src={staticFile('agent-course/media/presenter-opening-preview.mp4')} muted style={{width:'100%',height:'100%',objectFit:'contain'}} />}
 </AbsoluteFill>;
 const shrink=interpolate(frame,[585,639],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
 const reaction=interpolate(frame,[523,541],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
 const imageStyle:React.CSSProperties={position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'contain'};
 return <>{frame<639&&<AbsoluteFill style={{transform:`translate3d(${OPENING_SCENE_X+(115-OPENING_SCENE_X)*shrink}px,${OPENING_SCENE_Y+(365-OPENING_SCENE_Y)*shrink}px,0) scale(${OPENING_SCENE_SCALE+(.19-OPENING_SCENE_SCALE)*shrink})`,transformOrigin:'0 0',opacity:interpolate(frame,[608,639],[1,0],{extrapolateLeft:'clamp',extrapolateRight:'clamp'}),willChange:'transform, opacity',pointerEvents:'none'}}>
  {reaction<1&&<Img src={staticFile('agent-course/media/opening-foreground-v2.png')} style={{...imageStyle,opacity:1-reaction}}/>}
  {reaction>0&&<Img src={staticFile('agent-course/media/opening-relieved-foreground-v2.png')} style={{...imageStyle,opacity:reaction}}/>}
 </AbsoluteFill>}
 {frame<1045&&<OpeningCoursePath/>}
 {frame>=995&&<OpeningText/>}</>;
};
