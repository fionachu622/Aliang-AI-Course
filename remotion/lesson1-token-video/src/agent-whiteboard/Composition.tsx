import React, {useLayoutEffect, useRef, useState} from 'react';
import {AbsoluteFill, IFrame, Sequence, staticFile, useCurrentFrame, useVideoConfig, delayRender, continueRender, cancelRender} from 'remotion';
import course from './course.json';
export type TimelineProps = {clipIds: string[]};
type Scene = typeof course.scenes[number];
type Renderer = Window & {setPen: (pen: typeof course.pen) => void; setBrand: (v: null) => void; setCaptions: (v: never[]) => void; loadScene: (elements: Scene['elements'], beatOf: number[], beats: number[][], files: Scene['files'], end: number) => void; seek: (t: number) => void};
export const getClips = (ids: string[]) => ids.map(id => {
  const scene = course.scenes.find(item => item.id === id);
  if (!scene) throw Error(`Unknown scene ${id}`);
  return scene;
});
export const getDuration = (ids: string[]) => getClips(ids).reduce((n,s)=>n+s.durationInFrames,0);
const Whiteboard: React.FC<{scene: Scene}> = ({scene}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const ref = useRef<HTMLIFrameElement>(null);
  const current = useRef(frame);
  current.current = frame;
  const [handle] = useState(()=>delayRender('白板字体与矢量场景'));
  const [loaded,setLoaded] = useState(false);
  const onLoad = async () => {
    try {
      await ref.current?.contentDocument?.fonts.ready;
      const w = ref.current?.contentWindow as Renderer;
      w.setPen(course.pen); w.setBrand(null); w.setCaptions([]);
      w.loadScene(scene.elements,scene.beatOf,scene.beats,scene.files,scene.durationInFrames/fps);
      w.seek(Math.max(0,current.current)/fps);
      setLoaded(true); continueRender(handle);
    } catch (e) {cancelRender(e as Error);}
  };
  useLayoutEffect(()=>{
    if(!loaded)return;
    const w = ref.current?.contentWindow as Renderer;
    w.loadScene(scene.elements,scene.beatOf,scene.beats,scene.files,scene.durationInFrames/fps);
    w.seek(Math.max(0,current.current)/fps);
  },[scene,fps,loaded]);
  useLayoutEffect(()=>{
    if(loaded)(ref.current?.contentWindow as Renderer).seek(Math.max(0,frame)/fps);
  },[frame,fps,loaded]);
  return <IFrame ref={ref} title={scene.name} src={staticFile('agent-whiteboard/whiteboard-renderer.html')} onLoad={onLoad}
    style={{width:1920,height:1080,border:0,pointerEvents:'none'}}/>;
};
export const CourseTimeline: React.FC<TimelineProps> = ({clipIds}) => {
  let from=0;
  return <AbsoluteFill style={{backgroundColor:'#fffdf7'}}>{getClips(clipIds).map(scene=>{
    const start=from; from+=scene.durationInFrames;
    return <Sequence key={scene.id} from={start} durationInFrames={scene.durationInFrames} name={scene.name} premountFor={30}><Whiteboard scene={scene}/></Sequence>;
  })}</AbsoluteFill>;
};
