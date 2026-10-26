import React, {useEffect, useRef} from 'react';
import {getRemotionEnvironment, Html5Audio} from 'remotion';
import {Audio, Video} from '@remotion/media';

// Audio can use native playback. Video must retain source-frame trim semantics
// at non-unit playback rates in both Studio and export.
const PreviewNarration: React.FC<React.ComponentProps<typeof Audio>> = (props) => {
  const ref=useRef<HTMLAudioElement>(null);
  useEffect(()=>{
    const element=ref.current;
    // Explicitly stop the old narration on source changes, unmount and Fast Refresh.
    return ()=>{element?.pause();};
  },[props.src]);
  return <Html5Audio {...props} ref={ref}/>;
};
export const CourseAudio: React.FC<React.ComponentProps<typeof Audio>> = React.memo((props) =>
  getRemotionEnvironment().isRendering ? <Audio {...props}/> : <PreviewNarration key={props.src} {...props}/>);
export const CourseVideo: React.FC<Pick<React.ComponentProps<typeof Video>, 'src' | 'trimBefore' | 'trimAfter' | 'playbackRate' | 'muted' | 'objectFit' | 'style'>> = ({objectFit, style, ...props}) =>
  <Video {...props} objectFit={objectFit} style={style}/>;
