import type {ComponentType} from 'react';
import {
  AbsoluteFill,
  Easing,
  Freeze,
  interpolate,
  Sequence,
  useCurrentFrame,
} from 'remotion';
import {FPS} from '../timeline';
import {
  SceneProductModel,
} from '../v9/Lesson1OpeningV9';
import {
  SceneEncodeDecode,
  SceneStreaming,
  SceneTokenImpact,
} from '../v9/Lesson1RemainingV9';
import {
  V9SceneTimingProvider,
  VisualBackgroundProvider,
  useVisualOptions,
  v9Colors,
} from '../v9/VisualV9';
import type {V9SceneTimingAnchor} from '../v9/VisualV9';
import {
  SceneFullChainRevised,
  SceneGenerationLoopRevised,
  SceneLlmActionsRevised,
  ScenePredictNextRevised,
  SceneQuestionRevised,
  SceneTokenDefinitionRevised,
  SceneTokenizerMergedRevised,
  SceneTokenizerRevised,
} from './RevisedScenes';
import {
  V14_REVISED_SCENES,
} from './storyboard';

const sceneComponents: readonly ComponentType[] = [
  SceneQuestionRevised,
  SceneProductModel,
  SceneLlmActionsRevised,
  ScenePredictNextRevised,
  SceneGenerationLoopRevised,
  SceneStreaming,
  SceneTokenDefinitionRevised,
  SceneTokenizerRevised,
  SceneEncodeDecode,
  SceneTokenizerMergedRevised,
  SceneTokenImpact,
  SceneFullChainRevised,
];

const SLIDE_TRANSITION_FRAMES = 24;

export type RevisedSceneTimingOverride = {
  durationInFrames: number;
  timingAnchors?: readonly V9SceneTimingAnchor[];
};

export type ChalkboardCanvasAlignment = 'legacy-offset' | 'centered';

const SlidingScene = ({
  Scene,
  designDurationInFrames,
  durationInFrames,
  timingAnchors,
  slideIn,
  slideOut,
  frameOffset = 0,
  sceneTranslate = '-217.5px 0px',
}: {
  Scene: ComponentType;
  designDurationInFrames: number;
  durationInFrames: number;
  timingAnchors?: readonly V9SceneTimingAnchor[];
  slideIn: boolean;
  slideOut: boolean;
  frameOffset?: number;
  sceneTranslate?: string;
}) => {
  const frame = useCurrentFrame();
  const contentStart = slideIn ? SLIDE_TRANSITION_FRAMES : 0;
  const transitionEnd = SLIDE_TRANSITION_FRAMES - 1;
  const slideInProgress = slideIn
    ? interpolate(frame, [0, transitionEnd], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.inOut(Easing.cubic),
      })
    : 1;
  const slideOutProgress = slideOut
    ? interpolate(
        frame,
        [
          contentStart + durationInFrames - SLIDE_TRANSITION_FRAMES,
          contentStart + durationInFrames - 1,
        ],
        [0, 1],
        {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.inOut(Easing.cubic),
        },
      )
    : 0;
  const translateX = (slideInProgress - 1 + slideOutProgress) * 100;

  const sceneContent = (
    <V9SceneTimingProvider
      designDurationInFrames={designDurationInFrames}
      durationInFrames={durationInFrames}
      timingAnchors={timingAnchors}
    >
      <Scene />
    </V9SceneTimingProvider>
  );

  return (
    <AbsoluteFill
  style={{
    overflow: 'hidden',
    transform: `translateX(${translateX}%)`,
    translate: sceneTranslate
  }}
 >
      {slideIn ? (
        <Sequence durationInFrames={SLIDE_TRANSITION_FRAMES}>
          <Freeze frame={0}>{sceneContent}</Freeze>
        </Sequence>
      ) : null}
      <Sequence
        from={contentStart - frameOffset}
        durationInFrames={durationInFrames + frameOffset}
      >
        {sceneContent}
      </Sequence>
    </AbsoluteFill>
  );
};

const RevisedTimeline = ({
  openingFrameOffset = 0,
  sceneOverrides,
  sceneTimingOverrides,
  seamlessSceneIds = [],
  canvasAlignment = 'legacy-offset',
}: {
  openingFrameOffset?: number;
  sceneOverrides?: Readonly<Record<string, ComponentType>>;
  sceneTimingOverrides?: Readonly<Record<string, RevisedSceneTimingOverride>>;
  seamlessSceneIds?: readonly string[];
  canvasAlignment?: ChalkboardCanvasAlignment;
}) => {
  const {handFontFamily} = useVisualOptions();
  const scenes = V14_REVISED_SCENES.map((scene) => ({
    ...scene,
    ...sceneTimingOverrides?.[scene.id],
  }));
  const sceneStarts = scenes.map((_, index) =>
    scenes.slice(0, index).reduce((sum, scene) => sum + scene.durationInFrames, 0),
  );

  return (
    <AbsoluteFill
  style={{
  background: v9Colors.paper,
  fontFamily: handFontFamily,
  translate: canvasAlignment === 'centered' ? '0px 0px' : '1px 0px'
  }}>
      {scenes.map((scene, index) => {
        const Scene = sceneOverrides?.[scene.id] ?? sceneComponents[index];
        const slideIn = index > 0 && !seamlessSceneIds.includes(scene.id);
        const nextScene = scenes[index + 1];
        const slideOut =
          index < V14_REVISED_SCENES.length - 1 &&
          !seamlessSceneIds.includes(nextScene.id);
        return (
          <Sequence
            key={scene.id}
            from={
              sceneStarts[index] -
              (slideIn ? SLIDE_TRANSITION_FRAMES : 0)
            }
            durationInFrames={
              scene.durationInFrames + (slideIn ? SLIDE_TRANSITION_FRAMES : 0)
            }
            premountFor={FPS}
          >
            <SlidingScene
              Scene={Scene}
              designDurationInFrames={scene.designDurationInFrames}
              durationInFrames={scene.durationInFrames}
              timingAnchors={scene.timingAnchors}
              slideIn={slideIn}
              slideOut={slideOut}
              frameOffset={index === 0 ? openingFrameOffset : 0}
              sceneTranslate={
                canvasAlignment === 'centered' ? '0px 0px' : '-217.5px 0px'
              }
            />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

export const Lesson1ChalkboardRevised = ({
  handFontFamily,
  openingFrameOffset,
  sceneOverrides,
  sceneTimingOverrides,
  seamlessSceneIds,
  canvasAlignment = 'legacy-offset',
}: {
  handFontFamily?: string;
  openingFrameOffset?: number;
  sceneOverrides?: Readonly<Record<string, ComponentType>>;
  sceneTimingOverrides?: Readonly<Record<string, RevisedSceneTimingOverride>>;
  seamlessSceneIds?: readonly string[];
  canvasAlignment?: ChalkboardCanvasAlignment;
} = {}) => (
  <VisualBackgroundProvider
    backgroundFile="shared-visual/backgrounds/chalkboard/chalkboard.png"
    contentScale={0.86}
    contentTransformOrigin={
      canvasAlignment === 'centered' ? 'center center' : 'top center'
    }
    contentTranslate={
      canvasAlignment === 'centered' ? '0px 0px' : '116.8px 75.6px'
    }
    suppressZeroProgressStrokes={canvasAlignment === 'centered'}
    handFontFamily={handFontFamily}
    showBoxFinePrint={false}
    showContextRecap={false}
    showSceneNumbers={false}
  >
    <RevisedTimeline
      openingFrameOffset={openingFrameOffset}
      sceneOverrides={sceneOverrides}
      sceneTimingOverrides={sceneTimingOverrides}
      seamlessSceneIds={seamlessSceneIds}
      canvasAlignment={canvasAlignment}
    />
  </VisualBackgroundProvider>
);
