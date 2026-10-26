import {remainingPresenterAt, remainingSceneAt} from './RemainingEditorial';
import React from 'react';
import stages from './visual-stages.json';
import editorial from './remaining-editorial.storyboard.json';
import shots from './script-screenshots.timeline.json';
import recordings from './recordings.timeline.json';
import presenter from './case-intro-presenter.json';
import calendar from './calendar-preview.json';
import storyboard from './continuous-diagrams.storyboard.json';
import {VisualStageArtwork} from './VisualStageArtwork';
import {ScriptScreenshotArtwork, activeScriptScreenshot} from './ScriptScreenshotArtwork';

// Lesson1ChalkboardV3: 24 frames, cubic in/out, outgoing right / incoming left.
// Start at the spoken cue rather than pre-rolling the incoming page.
export const PAGE_TRANSITION_SECONDS = 24 / 30;
// Match Lesson 1's 24 visible frames: endpoints occur on frames 0 and 23.
const slideProgress = (t:number, start:number) => {
  const q = Math.max(0, Math.min(1, (t-start)*30/23));
  return q < .5 ? 4*q*q*q : 1-Math.pow(-2*q+2,3)/2;
};
const forms = new Set(['web', 'mobile', 'desktop', 'terminal']);
const modernPageAt = (t:number) => {
  if (remainingPresenterAt(t) || recordings.some(c => t*30 >= c.from && t*30 < c.from+c.durationInFrames)) return null;
  const scene = remainingSceneAt(t);
  if (scene) return `editorial:${scene.id}`;
  const shot = activeScriptScreenshot(t);
  return shot ? (forms.has(shot.id) ? 'usage-forms' : `screenshot:${shot.id}`) : null;
};
const modernBoundaries = [...new Set([
  ...editorial.scenes.flatMap(s => [s.start, s.end]),
  ...shots.flatMap(s => [s.start, s.end]),
])].filter(t => t >= 480.88).sort((a,b) => a-b)
  .filter(start => {
    const before = modernPageAt(start-1/30), after = modernPageAt(start);
    return before !== null && after !== null && before !== after;
  });
export const MODERN_PAGE_TRANSITIONS = modernBoundaries.map(start => ({
  start, before: modernPageAt(start-1/30), after: modernPageAt(start),
}));
const stageAt = (t:number) => stages.filter(s => t >= Math.max(s.start,
  Math.min(...s.nodes.filter(n => !('hidden' in n && n.hidden)).map(n => n.at)))).at(-1);
const pageAt = (t:number) => t>=111.16666666666667&&t<166.53
  ? 'Agent-entry-one-page'
  : activeScriptScreenshot(t)?.id ?? stageAt(t)?.id;
const boundaries = [...new Set([
  ...stages.map(s => Math.max(s.start, Math.min(...s.nodes.filter(n => !('hidden' in n && n.hidden)).map(n => n.at)))),
  ...shots.flatMap(s => [s.start, s.end]),
])].sort((a,b) => a-b);
const unavailable = (t:number) => remainingPresenterAt(t) || Boolean(remainingSceneAt(t)) || (t>=storyboard.mechanism_page.end+43/30&&t<481.93) || (t*30>=storyboard.parallel_work_intro.presenterReturn.from&&t*30<storyboard.parallel_work_intro.presenterReturn.to) || (t*30-43>=calendar.reviewHoldFrom&&t*30-43<calendar.reviewHoldEnd) || (t*30 >= presenter.from && t*30 < presenter.from+presenter.durationInFrames) || t < 995/30 || (t >= 958.97 && t < 1080.3) ||
  recordings.some(c => t*30 >= c.from && t*30 < c.from+c.durationInFrames);
export const pageTransitionAt = (t:number) => {
  // Retired pages must not re-enter as outgoing transition layers.
  if(t>=480.88){
    const start = modernBoundaries.filter(b => b <= t).at(-1);
    if(start === undefined || t >= start+PAGE_TRANSITION_SECONDS) return null;
    // A recording/presenter interrupt must never drag an obsolete page across it.
    if(modernPageAt(t) !== modernPageAt(start)) return null;
    return {start, progress: slideProgress(t,start)};
  }
  if(remainingSceneAt(t)||remainingPresenterAt(t))return null;
  if(t>=storyboard.mechanism_page.start+43/30&&t<storyboard.mechanism_page.end+43/30)return null;
  // The parallel-work title starts immediately after the recording, before legacy node cues.
  const parallel=storyboard.parallel_work_intro;
  if(t>=parallel.start+parallel.legacyOffsetSeconds&&t<parallel.end+parallel.legacyOffsetSeconds)return null;
  const start = boundaries.filter(b => b <= t).at(-1);
  if(start === undefined || t >= start+PAGE_TRANSITION_SECONDS ||
    unavailable(start-.001) || unavailable(t) || pageAt(start-.001) === pageAt(start)) return null;
  const before = stageAt(start-.001), after = stageAt(start);
  // Keep the existing object-to-object move when a known anchor survives.
  if(!activeScriptScreenshot(start-.001) && !activeScriptScreenshot(start) && before && after &&
    after.nodes.some(n => n.at <= start && !('hidden' in n && n.hidden) && before.nodes.some(p =>
      p.at < start && p.text === n.text && p.shape === n.shape && !('hidden' in p && p.hidden)))) return null;
  return {start, progress: slideProgress(t,start)};
};
export const DiagramPageTransition:React.FC<{seconds:number;assetUrl:(path:string)=>string}> = ({seconds,assetUrl}) => {
  const draw = (t:number) => !remainingSceneAt(t)&&activeScriptScreenshot(t)
    ? <ScriptScreenshotArtwork seconds={t} assetUrl={assetUrl}/>
    : <VisualStageArtwork seconds={t} assetUrl={assetUrl('agent-course/agent-pet-cream-v8.png')} reviewStillUrl={assetUrl('agent-course/media/butterfly-review-still.jpg')}/>;
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
