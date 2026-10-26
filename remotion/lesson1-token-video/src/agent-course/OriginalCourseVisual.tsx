import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Img, Sequence, staticFile, useCurrentFrame, delayRender, continueRender, cancelRender} from 'remotion';
import {loadFont} from '@remotion/fonts';
import {NarrationProcessVisual, processScenes} from './NarrationProcessVisual';
import {AgentPage} from './AgentCourse';
import decisions from './editorial-choices.json';
import plan from './plan.json';
import {SyncedOpening} from './preserved-opening/SyncedOpening';
import recordings from './recordings.timeline.json';
import {RecordingSequence} from './RecordingSequence';

// Restore plan.json's original 26-page composition and artwork. Shared recording
// cuts are media edits only; no AgentFullVisual or reorganized diagrams are used.
export const OriginalCourseVisual: React.FC = () => {
  const [fontHandle] = useState(() => delayRender('Preview opening font'));
  useEffect(() => {
    loadFont({family: 'AgentFullHanzi', url: staticFile('fonts/AgentFullHanzi.woff2'), weight: '400'})
      .then(() => continueRender(fontHandle)).catch(cancelRender);
  }, [fontHandle]);
  const frame = useCurrentFrame();
  const cut = recordings.find((c) => frame >= c.from && frame < c.from + c.durationInFrames);
  const visual = decisions.visuals.find((s) => frame >= Math.round(s.start * 30) && frame < Math.round(s.end * 30));
  const sceneIndex = plan.findIndex((s) => s.id === visual?.scene);
  return <AbsoluteFill style={{backgroundColor: '#24272A', color: '#F5F1E8', fontFamily: 'AgentFullHanzi'}}>
    {frame < 995 ? <>
      <Img src={staticFile('shared-visual/backgrounds/chalkboard/chalkboard.png')}
        style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      <SyncedOpening illustratedHook />
    </> : visual && processScenes.has(visual.scene) ? <NarrationProcessVisual scene={visual.scene} seconds={frame/30}/> : sceneIndex >= 0 && (
      <AgentPage sceneIndex={sceneIndex} showAll={false} recordingPlaceholders={false}
        absoluteSeconds={frame / 30} />
    )}
    {cut && <Sequence from={cut.from} durationInFrames={cut.durationInFrames} name={cut.label}>
      <RecordingSequence cut={cut} />
    </Sequence>}
  </AbsoluteFill>;
};
