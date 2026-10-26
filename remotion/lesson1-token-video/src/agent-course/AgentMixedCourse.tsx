import React from 'react';
import {Video} from '@remotion/media';
import {AbsoluteFill, Sequence, staticFile, useCurrentFrame, getRemotionEnvironment, Html5Video, interpolate, Easing} from 'remotion';
import {CourseAudio} from './PreviewMedia';
import {OriginalCourseVisual} from './OriginalCourseVisual';
import edit from './narration-edit.json';
import opening from './preserved-opening/opening.timeline.json';
import recordings from './recordings.timeline.json';
import assets from './recorded-assets.json';
import decisions from './editorial-choices.json';
import {PresenterAccent, presenterCameraScale} from './PresenterAccent';
import introTransition from './intro-transition.json';

export const AGENT_MIXED_DURATION = Math.ceil(assets[0].durationSeconds * 30);

// Editorial cues use the original narration clock. The supplied presenter
// already omits the spoken title, so only the visual clock skips those frames.
export const AgentMixedCourse: React.FC = () => {
  const frame = useCurrentFrame();
  const shift = frame >= edit.cutAtFrame ? edit.removedFrames : 0;
  const editorialFrame = frame + shift;
  const recording = recordings.find(
    (cut) => editorialFrame >= cut.from && editorialFrame < cut.from + cut.durationInFrames,
  );
  const isRecordedIntro = frame < Math.round(opening.hookEnd * 30);
  const isOpeningReturn = frame >= 969 && frame < 1189;
  const visual = (isRecordedIntro || isOpeningReturn) ? undefined : decisions.visuals.find(
    (cue) => editorialFrame >= Math.round(cue.start * 30) && editorialFrame < Math.round(cue.end * 30),
  );
  const rendering = getRemotionEnvironment().isRendering;
  const PresenterVideo = rendering ? Video : Html5Video;
  const cutFrame = Math.round(opening.hookEnd * 30);
  const shrinkEnd = cutFrame + introTransition.shrinkFrames;
  const exitStart = shrinkEnd - introTransition.exitOverlapFrames;
  const transitionEnd = exitStart + introTransition.exitFrames;
  const preloadIllustration = frame >= cutFrame - introTransition.preloadFrames && frame < cutFrame;
  const introTransitionActive = frame >= cutFrame && frame < transitionEnd;
  const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
  const shrink = interpolate(frame, [cutFrame, shrinkEnd], [0, 1], {
    ...clamp, easing: Easing.bezier(0.32, 0, 0.2, 1),
  });
  const exit = interpolate(frame, [exitStart, transitionEnd], [0, 1], {
    ...clamp, easing: Easing.bezier(0.42, 0, 0.8, 1),
  });
  const scale = introTransitionActive ? 1 + (introTransition.windowScale - 1) * shrink : 1;
  const x = introTransitionActive
    ? introTransition.margin * shrink - (1920 * introTransition.windowScale + introTransition.margin + 24) * exit : 0;
  const y = introTransitionActive
    ? (1080 * (1 - introTransition.windowScale) - introTransition.margin) * shrink
      + (1080 * introTransition.windowScale + introTransition.margin) * exit : 0;

  const accentAllowed = !recording && !visual && !introTransitionActive && !isRecordedIntro;
  const activeAccent = accentAllowed && editorialFrame / 30;

  return (
    <AbsoluteFill style={{backgroundColor: '#24272A', overflow: 'hidden'}}>
      <CourseAudio src={staticFile('agent-course/recorded/preview/narration.m4a')} />
      {(recording || visual || preloadIllustration) && (
        <Sequence from={-shift} name={recording ? `案例 · ${recording.label}` : `可视化 · ${visual?.scene ?? '课程开场'}`}>
          <OriginalCourseVisual />
        </Sequence>
      )}
      {/* Keep the same moving presenter mounted above the illustration until exit. */}
      {((!recording && !visual) || introTransitionActive) && (
        <AbsoluteFill style={{
          transform: `translate(${x}px, ${y}px) scale(${scale})`,
          transformOrigin: 'top left',
          overflow: 'hidden',
          borderRadius: introTransitionActive ? 24 * shrink : 0,
          willChange: introTransitionActive || preloadIllustration ? 'transform' : undefined,
        }}>
          <AbsoluteFill style={{transform: `scale(${accentAllowed ? presenterCameraScale(editorialFrame / 30) : 1})`, transformOrigin: '58% 42%'}}>
          <PresenterVideo
            src={staticFile(rendering ? assets[0].file : 'agent-course/recorded/preview/presenter.mp4')}
            muted
            style={{width: '100%', height: '100%', objectFit: 'contain'}}
          />
          </AbsoluteFill>
          {activeAccent !== false && <PresenterAccent seconds={activeAccent} />}
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
