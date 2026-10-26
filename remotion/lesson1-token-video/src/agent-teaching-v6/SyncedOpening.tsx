import React from 'react';
import {AbsoluteFill, Img, interpolate, Easing, useCurrentFrame, staticFile, Html5Video, getRemotionEnvironment} from 'remotion';
import {OpeningText} from './OpeningText';
import {OpeningCoursePath} from './OpeningCoursePath';
import {OPENING_SCENE_WIDTH, OPENING_SCENE_HEIGHT, OPENING_SCENE_TOP, openingHandoffProgress} from './opening-layout';
import timing from './opening.timeline.json';
import {CourseVideo as Video} from './PreviewMedia';
export const SyncedOpening:React.FC<{illustratedHook?:boolean}>=({illustratedHook=false})=>{
 const frame=useCurrentFrame();
 const rendering=getRemotionEnvironment().isRendering;
 if(!illustratedHook&&frame<Math.round(timing.hookEnd*30))return <AbsoluteFill style={{background:'#000'}}>
 {rendering ? <Video src={staticFile(timing.presenterSource)} muted objectFit="contain" style={{width:'100%',height:'100%'}} /> : <Html5Video src={staticFile('agent-course/media/presenter-opening-preview.mp4')} muted style={{width:'100%',height:'100%',objectFit:'contain'}} />}
 </AbsoluteFill>;
 const cue=timing.handoffVisual.reaction;
 const notice=interpolate(frame,[cue.startFrame,cue.startFrame+3],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:Easing.inOut(Easing.quad)});
 const lookBack=interpolate(frame,[cue.startFrame+8,cue.endFrame-6],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:Easing.inOut(Easing.quad)});
 const handoff=openingHandoffProgress(frame);
 const sceneScale=1+(.19/.64-1)*handoff;
 const illustrationExit=interpolate(frame,[608,639],[1,0],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
 const sceneX=(300-(1920-OPENING_SCENE_WIDTH)/2)*handoff;
 const sceneY=(365-OPENING_SCENE_TOP)*handoff;
 // End the scene behind the pet so its silhouette covers the person before fading.
 const personRegion='M725 0 H1420 V670 H1300 L1030 665 L1000 708 L880 703 L725 650 Z';
 // Additive mixing inside an isolated group avoids the dark dip of two fading alpha layers.
 const pose=(src:string)=><foreignObject x="0" y="0" width="1655" height="950"><Img src={staticFile(src)} style={{width:1655,height:950}}/></foreignObject>;
 // Center the foreground at rest; animate its size and position only during the handoff. Background stays full canvas.
 return <>{frame<639&&<AbsoluteFill style={{alignItems:'center',justifyContent:'flex-start',paddingTop:OPENING_SCENE_TOP,boxSizing:'border-box',opacity:illustrationExit,pointerEvents:'none'}}>
  <div data-opening-scene="centered" style={{position:'relative',width:OPENING_SCENE_WIDTH,height:OPENING_SCENE_HEIGHT,flexShrink:0,transform:handoff===0?undefined:`translate3d(${sceneX}px,${sceneY}px,0) scale(${sceneScale})`,transformOrigin:'top left'}}>
  <svg viewBox="0 0 1655 950" width="100%" height="100%" aria-label="人物听见信号后抬头回望">
   <defs>
    <clipPath id="opening-person-reaction"><path d={personRegion}/></clipPath>
    <mask id="opening-person-base" maskUnits="userSpaceOnUse" x="0" y="0" width="1655" height="950">
     <rect width="1655" height="950" fill="white"/>
     <path d={personRegion} fill="black" opacity={notice}/>
    </mask>
   </defs>
   <g style={{isolation:'isolate'}}>
    <g mask="url(#opening-person-base)">{pose(timing.handoffVisual.foreground)}</g>
    {notice>0&&<g clipPath="url(#opening-person-reaction)" opacity={notice*(1-lookBack)} style={{mixBlendMode:'plus-lighter'}}>{pose(cue.intermediateForeground)}</g>}
    {lookBack>0&&<g clipPath="url(#opening-person-reaction)" opacity={lookBack} style={{mixBlendMode:'plus-lighter'}}>{pose(cue.foreground)}</g>}
   </g>
  </svg>
  </div>
 </AbsoluteFill>}
 {frame>=timing.handoffVisual.agentReveal.startFrame&&frame<1045&&<OpeningCoursePath/>}
 {frame>=995&&<OpeningText/>}</>;
};
