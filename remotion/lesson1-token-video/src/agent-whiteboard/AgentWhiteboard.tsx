import React, {useEffect, useLayoutEffect, useRef} from 'react';
import {AbsoluteFill, IFrame, getRemotionEnvironment, useCurrentFrame, useVideoConfig} from 'remotion';
import {CourseTimeline, getDuration} from './Composition';
import course from './course.json';
const clipIds = course.scenes.map(scene => scene.id);
const EDITOR_ORIGIN = 'http://localhost:3175';
export const AGENT_WHITEBOARD_DURATION = getDuration(clipIds);
const StudioEditor: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const iframe = useRef<HTMLIFrameElement>(null);
  const latest = useRef({frame, fps});
  latest.current = {frame, fps};
  const sync = () => iframe.current?.contentWindow?.postMessage({
    type: 'agent-whiteboard:seek', seconds: latest.current.frame / latest.current.fps,
  }, EDITOR_ORIGIN);
  useLayoutEffect(sync, [frame, fps]);
  useEffect(() => {
    const onReady = (event: MessageEvent) => {
      if (event.origin === EDITOR_ORIGIN && event.source === iframe.current?.contentWindow && event.data?.type === 'agent-whiteboard:ready') sync();
    };
    window.addEventListener('message', onReady);
    return () => window.removeEventListener('message', onReady);
  }, []);
  return <AbsoluteFill style={{background: '#f2f1ec'}}>
    <IFrame ref={iframe} onLoad={sync} title="Agent 专题课整课编辑预览" src={`${EDITOR_ORIGIN}/`} style={{width: '100%',height: '100%',border: 0}}/>
  </AbsoluteFill>;
};
export const AgentWhiteboard: React.FC = () => getRemotionEnvironment().isStudio
  ? <StudioEditor/>
  : <CourseTimeline clipIds={clipIds}/>;
