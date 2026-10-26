import React from 'react';
import {AbsoluteFill, Html5Video, getRemotionEnvironment, staticFile} from 'remotion';
import {CourseVideo} from './PreviewMedia';
import clip from './case-intro-presenter.json';
export const CaseIntroPresenter = () => <AbsoluteFill style={{background:'#24272A'}}>
  {getRemotionEnvironment().isRendering
    ? <CourseVideo src={staticFile(clip.source)} trimBefore={clip.sourceFrom} trimAfter={clip.sourceFrom + clip.durationInFrames} muted objectFit="contain" style={{width:'100%',height:'100%'}} />
    : <Html5Video src={staticFile(clip.preview)} pauseWhenBuffering muted style={{width:'100%',height:'100%',objectFit:'contain'}} />}
</AbsoluteFill>;
