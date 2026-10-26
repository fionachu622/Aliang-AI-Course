import React from 'react';
import stages from './visual-stages.json';
import shots from './script-screenshots.timeline.json';
import recordings from './recordings.timeline.json';
import {VisualStageArtwork} from './VisualStageArtwork';
import {ScriptScreenshotArtwork, activeScriptScreenshot} from './ScriptScreenshotArtwork';

// Lesson1ChalkboardV3: 24 frames, cubic in/out, outgoing right / incoming left.
// Start at the spoken cue rather than pre-rolling the incoming page.
export const PAGE_TRANSITION_SECONDS = 24 / 30;
const stageAt = (t:number) => stages.filter(s => t >= Math.max(s.start,
  Math.min(...s.nodes.filter(n => !('hidden' in n && n.hidden)).map(n => n.at)))).at(-1);
const pageAt = (t:number) => activeScriptScreenshot(t)?.id ?? stageAt(t)?.id;
const boundaries = [...new Set([
  ...stages.map(s => Math.max(s.start, Math.min(...s.nodes.filter(n => !('hidden' in n && n.hidden)).map(n => n.at)))),
  ...shots.flatMap(s => [s.start, s.end]),
])].sort((a,b) => a-b);
const unavailable = (t:number) => t < 995/30 || (t >= 958.97 && t < 1080.3) ||
  recordings.some(c => t*30 >= c.from && t*30 < c.from+c.durationInFrames);
export const pageTransitionAt = (t:number) => {
  const start = boundaries.filter(b => b <= t).at(-1);
  if(start === undefined || t >= start+PAGE_TRANSITION_SECONDS ||
    unavailable(start-.001) || unavailable(t) || pageAt(start-.001) === pageAt(start)) return null;
  const before = stageAt(start-.001), after = stageAt(start);
  // Keep the existing object-to-object move when a known anchor survives.
  if(!activeScriptScreenshot(start-.001) && !activeScriptScreenshot(start) && before && after &&
    after.nodes.some(n => n.at <= start && !('hidden' in n && n.hidden) && before.nodes.some(p =>
      p.at < start && p.text === n.text && p.shape === n.shape && !('hidden' in p && p.hidden)))) return null;
  const q = Math.max(0, Math.min(1, (t-start)/PAGE_TRANSITION_SECONDS));
  const progress = q < .5 ? 4*q*q*q : 1-Math.pow(-2*q+2,3)/2;
  return {start, progress};
};
export const DiagramPageTransition:React.FC<{seconds:number;assetUrl:(path:string)=>string}> = ({seconds,assetUrl}) => {
  const draw = (t:number) => activeScriptScreenshot(t)
    ? <ScriptScreenshotArtwork seconds={t} assetUrl={assetUrl}/>
    : <VisualStageArtwork seconds={t} assetUrl={assetUrl('agent-course/agent-pet-cream-v8.png')}/>;
  const transition = pageTransitionAt(seconds);
  if(!transition) return draw(seconds);
  return <div style={{position:'absolute',inset:0,overflow:'hidden'}} data-page-transition="lesson1-v3">
    <div style={{position:'absolute',inset:0,transform:`translateX(${transition.progress*100}%)`}}>
      {draw(transition.start-.001)}
    </div>
    <div style={{position:'absolute',inset:0,transform:`translateX(${(transition.progress-1)*100}%)`}}>
      {draw(seconds)}
    </div>
  </div>;
};
