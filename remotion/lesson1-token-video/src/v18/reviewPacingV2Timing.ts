import {FPS} from '../timeline';
import type {RevisedSceneTimingOverride} from '../v14/Lesson1ChalkboardRevised';
import {REVIEW_SCENE_TIMING_OVERRIDES} from '../v16/reviewVoiceoverTiming';

const SCENE_IDS = [
  'question',
  'product-model',
  'llm-actions',
  'predict-next',
  'generation-loop',
  'streaming',
  'token-definition',
  'tokenizer',
  'encode-decode',
  'tokenizer-merged',
  'token-impact',
  'full-chain',
] as const;

type SceneId = (typeof SCENE_IDS)[number];

const absoluteFrame = (seconds: number) => Math.round(seconds * FPS);

// Keep the narration and every cue at their original absolute time. Only two
// cuts move later so a completed visual remains on screen until the next page
// has something meaningful to reveal.
export const PACING_V2_SCENE_BOUNDARIES = [
  0,
  absoluteFrame(26.83),
  absoluteFrame(58.92),
  absoluteFrame(92.8), // Hold “它怎么做到的？” until the example is ready.
  absoluteFrame(122.69),
  absoluteFrame(156.99),
  absoluteFrame(201.3), // Hold the completed streaming map until Token appears.
  absoluteFrame(243.18),
  absoluteFrame(295.79),
  absoluteFrame(360.65),
  absoluteFrame(424.17),
  absoluteFrame(502.09),
  Math.ceil(525.24 * FPS),
] as const;

const ORIGINAL_SCENE_STARTS = SCENE_IDS.map((_, index) =>
  SCENE_IDS.slice(0, index).reduce(
    (total, sceneId) =>
      total + REVIEW_SCENE_TIMING_OVERRIDES[sceneId].durationInFrames,
    0,
  ),
);

const retimeScene = (sceneId: SceneId, index: number): RevisedSceneTimingOverride => {
  const original = REVIEW_SCENE_TIMING_OVERRIDES[sceneId];
  const originalAnchors = original.timingAnchors;
  if (!originalAnchors || originalAnchors.length < 2) return original;

  const start = PACING_V2_SCENE_BOUNDARIES[index];
  const end = PACING_V2_SCENE_BOUNDARIES[index + 1];
  const durationInFrames = end - start;
  const originalStart = ORIGINAL_SCENE_STARTS[index];
  const finalDesignFrame = originalAnchors[originalAnchors.length - 1].designFrame;
  const cueAnchors = originalAnchors.slice(1, -1).map((anchor) => ({
    frame: originalStart + anchor.frame - start,
    designFrame: anchor.designFrame,
  }));

  return {
    durationInFrames,
    timingAnchors: [
      {frame: 0, designFrame: 0},
      ...cueAnchors,
      {frame: durationInFrames - 1, designFrame: finalDesignFrame},
    ],
  };
};

export const PACING_V2_SCENE_TIMING_OVERRIDES = Object.fromEntries(
  SCENE_IDS.map((sceneId, index) => [sceneId, retimeScene(sceneId, index)]),
) as Readonly<Record<SceneId, RevisedSceneTimingOverride>>;

for (const [sceneId, timing] of Object.entries(PACING_V2_SCENE_TIMING_OVERRIDES)) {
  const anchors = timing.timingAnchors;
  if (!anchors) continue;
  for (let index = 1; index < anchors.length; index++) {
    const previous = anchors[index - 1];
    const current = anchors[index];
    if (
      current.frame <= previous.frame ||
      current.designFrame <= previous.designFrame
    ) {
      throw new Error(`Invalid pacing V2 timing anchors in ${sceneId} at index ${index}`);
    }
  }
}
