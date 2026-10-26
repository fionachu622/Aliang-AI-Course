import type {ComponentType} from 'react';
import {
  AbsoluteFill,
  Audio,
  Freeze,
  Img,
  Sequence,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import {SceneTokenizerMergedRevised} from '../v14/RevisedScenes';
import {V14_REVISED_SCENES} from '../v14/storyboard';
import {
  SceneProductModelReviewPacingV2VoiceSynced,
  SceneStreamingReviewPacingV2NoHighlights,
  SceneTokenizerReviewWithComma,
  SceneTokenImpactReviewPacingV2SequentialCardsNoSummary,
} from '../v16/Lesson1ChalkboardRevisedReview';
import {REVIEW_VOICEOVER_FILE} from '../v16/reviewVoiceoverTiming';
import {SceneTokenDefinitionPacingV2} from '../v18/Lesson1ChalkboardRevisedReviewBoldPacingV2';
import {
  PACING_V2_SCENE_TIMING_OVERRIDES,
  PACING_V2_SCENE_BOUNDARIES,
} from '../v18/reviewPacingV2Timing';
import {VERTICAL_V4_SCENE_OVERRIDES} from '../v20/Lesson1ChalkboardRevisedReviewBoldPacingCenteredVerticalV4';
import {
  V9SceneTimingProvider,
  VisualBackgroundProvider,
  v9Colors,
} from '../v9/VisualV9';
import {MotionTreatmentContext} from '../v9/MotionTreatment';
import {focusHandoff, SHOTCRAFT_TREATMENT} from './motion';
import {SceneQuestionShotcraft} from './SceneQuestionShotcraft';

const TokenizerScreenshot = () => (
  <SceneTokenizerMergedRevised motionPreset="apple" />
);
const TokenDefinition = () => (
  <SceneTokenDefinitionPacingV2
    lowerContentOffsetY={-24}
    showNextQuestion={false}
    showOutputTokenExample={false}
  />
);

// Deliberately matches V3's override table. No audio / content / design clock fork.
export const SHOTCRAFT_SCENES: Readonly<Record<string, ComponentType>> = {
  ...VERTICAL_V4_SCENE_OVERRIDES,
  question: SceneQuestionShotcraft,
  'product-model': SceneProductModelReviewPacingV2VoiceSynced,
  streaming: SceneStreamingReviewPacingV2NoHighlights,
  'token-definition': TokenDefinition,
  tokenizer: SceneTokenizerReviewWithComma,
  'tokenizer-merged': TokenizerScreenshot,
  'token-impact': SceneTokenImpactReviewPacingV2SequentialCardsNoSummary,
};

export const SHOTCRAFT_SHOTS = V14_REVISED_SCENES.map((scene, index) => ({
  ...scene,
  ...PACING_V2_SCENE_TIMING_OVERRIDES[
    scene.id as keyof typeof PACING_V2_SCENE_TIMING_OVERRIDES
  ],
  from: PACING_V2_SCENE_BOUNDARIES[index],
  component: SHOTCRAFT_SCENES[scene.id],
}));

const SEAMLESS = new Set(['generation-loop', 'streaming']);
const HandoffScene = ({
  shot,
  enter,
  exit,
}: {
  shot: (typeof SHOTCRAFT_SHOTS)[number];
  enter: boolean;
  exit: boolean;
}) => {
  const frame = useCurrentFrame();
  const Scene = shot.component;
  const content = (
    <V9SceneTimingProvider
      designDurationInFrames={shot.designDurationInFrames}
      durationInFrames={shot.durationInFrames}
      timingAnchors={shot.timingAnchors}
    >
      <Scene />
    </V9SceneTimingProvider>
  );
  return (
    <AbsoluteFill
      style={focusHandoff(frame, shot.durationInFrames, enter, exit)}
    >
      <Sequence durationInFrames={shot.durationInFrames}>
        {content}
      </Sequence>
      {exit ? (
        <Sequence from={shot.durationInFrames} durationInFrames={24}>
          <Freeze frame={shot.durationInFrames - 1}>{content}</Freeze>
        </Sequence>
      ) : null}
    </AbsoluteFill>
  );
};

export const Lesson1ChalkboardShotcraft = ({
  fontWeight = 600,
  strokeWidth = 0.65,
}: {
  fontWeight?: number;
  strokeWidth?: number;
}) => (
  <AbsoluteFill
    className="lesson1-shotcraft"
    style={{backgroundColor: v9Colors.paper}}
  >
    <style>{`
      .lesson1-shotcraft div,.lesson1-shotcraft span {font-weight:${fontWeight} !important;-webkit-text-stroke:${strokeWidth}px currentColor;paint-order:stroke fill;}
      .lesson1-shotcraft [style*="font-size: 2"] {font-weight:500 !important;-webkit-text-stroke-width:${Math.max(0.2, strokeWidth * 0.46)}px;}
      .lesson1-shotcraft [style*="font-size: 6"],.lesson1-shotcraft [style*="font-size: 7"],.lesson1-shotcraft [style*="font-size: 8"],.lesson1-shotcraft [style*="font-size: 9"] {-webkit-text-stroke-width:${strokeWidth * 1.23}px;}
    `}</style>
    <Audio src={staticFile(REVIEW_VOICEOVER_FILE)} />
    <Img
      src={staticFile('shared-visual/backgrounds/chalkboard/chalkboard.png')}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
      }}
    />
    <AbsoluteFill
      style={{
        background:
          'radial-gradient(circle at 50% 48%, rgba(0,0,0,0) 30%, rgba(0,0,0,.11) 100%)',
      }}
    />
    <MotionTreatmentContext.Provider value={SHOTCRAFT_TREATMENT}>
      <VisualBackgroundProvider
        backgroundFile="shared-visual/backgrounds/chalkboard/chalkboard.png"
        contentScale={0.86}
        contentTransformOrigin="center center"
        contentTranslate="0px 0px"
        suppressZeroProgressStrokes
        showBoxFinePrint={false}
        showContextRecap={false}
        showSceneNumbers={false}
      >
        {SHOTCRAFT_SHOTS.map((shot, index) => {
          const enter = index > 0 && !SEAMLESS.has(shot.id);
          const next = SHOTCRAFT_SHOTS[index + 1];
          const exit = Boolean(next) && !SEAMLESS.has(next.id);
          return (
            <Sequence
              key={shot.id}
              name={shot.title}
              from={shot.from}
              durationInFrames={shot.durationInFrames + (exit ? 24 : 0)}
              premountFor={30}
            >
              <HandoffScene shot={shot} enter={enter} exit={exit} />
            </Sequence>
          );
        })}
      </VisualBackgroundProvider>
    </MotionTreatmentContext.Provider>
  </AbsoluteFill>
);
