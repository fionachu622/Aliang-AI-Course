import {useEffect, useLayoutEffect, useMemo, useRef, useState} from 'react';
import {AbsoluteFill, cancelRender, continueRender, delayRender, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {createWhiteboardRuntime} from './runtime';

let fontReady: Promise<void> | undefined;
function loadFont() {
  if (!fontReady) {
    fontReady = new FontFace('LXGWWenKai-500', `url("${staticFile('skill-tests/huashu-art-motion/LXGWWenKai-500.woff')}")`)
      .load().then((font) => {
        (document.fonts as FontFaceSet & {add(face: FontFace): void}).add(font);
      });
  }
  return fontReady;
}

/** The approved HTML's draw function, with time controlled exclusively by Remotion. */
export const AgentHuashuWhiteboard = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const canvas = useRef<HTMLCanvasElement>(null);
  const runtime = useMemo(() => createWhiteboardRuntime(), []);
  const [handle] = useState(() => delayRender('Loading whiteboard handwriting font'));
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    loadFont().then(() => {if (active) setReady(true);}).catch(cancelRender);
    return () => {active = false; continueRender(handle);};
  }, [handle]);

  useLayoutEffect(() => {
    if (!ready) return;
    const ctx = canvas.current?.getContext('2d');
    if (!ctx) {cancelRender(new Error('Whiteboard canvas is unavailable')); return;}
    runtime.draw(ctx, frame / fps);
    continueRender(handle);
  }, [frame, fps, handle, ready, runtime]);

  return <AbsoluteFill style={{backgroundColor: '#FBFBFB'}}>
    <canvas ref={canvas} width={1920} height={1080} style={{width: '100%', height: '100%'}} />
  </AbsoluteFill>;
};
