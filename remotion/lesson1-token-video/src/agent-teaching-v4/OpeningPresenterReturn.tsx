import React from 'react';
import {AbsoluteFill,Html5Video,getRemotionEnvironment,staticFile} from 'remotion';
import {CourseVideo} from './PreviewMedia';
export const OpeningPresenterReturn=()=> <AbsoluteFill style={{background:'#24272A'}}>
 {getRemotionEnvironment().isRendering
  ? <CourseVideo src={staticFile('agent-course/recorded/presenter.mp4')} trimBefore={969} trimAfter={1189} muted objectFit="contain" style={{width:'100%',height:'100%'}}/>
  : <Html5Video src={staticFile('agent-course/media/presenter-opening-return.mp4')} muted style={{width:'100%',height:'100%',objectFit:'contain'}}/>}
</AbsoluteFill>;
