import {AbsoluteFill, Audio, staticFile} from 'remotion';
import {Lesson1ChalkboardRevised} from '../v14/Lesson1ChalkboardRevised';
import {SceneTokenizerMergedRevised} from '../v14/RevisedScenes';
import {
  SceneProductModelReviewPacingV2VoiceSynced,
  SceneStreamingReviewPacingV2NoHighlights,
  SceneTokenizerReviewWithComma,
  SceneTokenImpactReviewPacingV2SequentialCardsNoSummary,
} from '../v16/Lesson1ChalkboardRevisedReview';
import {SceneTokenDefinitionPacingV2} from '../v18/Lesson1ChalkboardRevisedReviewBoldPacingV2';
import {REVIEW_VOICEOVER_FILE} from '../v16/reviewVoiceoverTiming';
import {PACING_V2_SCENE_TIMING_OVERRIDES} from '../v18/reviewPacingV2Timing';
import type {Lesson1ChalkboardRevisedReviewBoldPacingCenteredVerticalV4Props} from '../v20/Lesson1ChalkboardRevisedReviewBoldPacingCenteredVerticalV4';
import {VERTICAL_V4_SCENE_OVERRIDES} from '../v20/Lesson1ChalkboardRevisedReviewBoldPacingCenteredVerticalV4';

const SceneTokenizerMergedAppleMotionV5 = () => (
  <SceneTokenizerMergedRevised motionPreset="apple" />
);

const SceneTokenDefinitionWithoutFooterV5 = () => (
  <SceneTokenDefinitionPacingV2
    lowerContentOffsetY={-24}
    showNextQuestion={false}
    showOutputTokenExample={false}
  />
);

const APPLE_MOTION_V5_SCENE_OVERRIDES = {
  ...VERTICAL_V4_SCENE_OVERRIDES,
  'product-model': SceneProductModelReviewPacingV2VoiceSynced,
  streaming: SceneStreamingReviewPacingV2NoHighlights,
  'token-definition': SceneTokenDefinitionWithoutFooterV5,
  tokenizer: SceneTokenizerReviewWithComma,
  'tokenizer-merged': SceneTokenizerMergedAppleMotionV5,
  'token-impact': SceneTokenImpactReviewPacingV2SequentialCardsNoSummary,
};

/**
 * Apple Motion experiment built on V4.
 *
 * V4 remains unchanged. Only the real Tokenizer screenshot scene opts into a
 * critically damped, synchronized scale-and-dock transition.
 */
export const Lesson1ChalkboardRevisedReviewBoldPacingCenteredAppleMotionV5 = ({
  fontWeight = 600,
  strokeWidth = 0.65,
}: Lesson1ChalkboardRevisedReviewBoldPacingCenteredVerticalV4Props) => {
  const smallStrokeWidth = Math.max(0.2, strokeWidth * 0.46);
  const largeStrokeWidth = strokeWidth * 1.23;

  return (
    <AbsoluteFill className="lesson1-review-bold-apple-motion-v5">
      <style>{`
        .lesson1-review-bold-apple-motion-v5 div,
        .lesson1-review-bold-apple-motion-v5 span {
          font-weight: ${fontWeight} !important;
          -webkit-text-stroke: ${strokeWidth}px currentColor;
          paint-order: stroke fill;
        }

        .lesson1-review-bold-apple-motion-v5 [style*="font-size: 2"] {
          font-weight: 500 !important;
          -webkit-text-stroke-width: ${smallStrokeWidth}px;
        }

        .lesson1-review-bold-apple-motion-v5 [style*="font-size: 6"],
        .lesson1-review-bold-apple-motion-v5 [style*="font-size: 7"],
        .lesson1-review-bold-apple-motion-v5 [style*="font-size: 8"],
        .lesson1-review-bold-apple-motion-v5 [style*="font-size: 9"] {
          -webkit-text-stroke-width: ${largeStrokeWidth}px;
        }
      `}</style>
      <Audio src={staticFile(REVIEW_VOICEOVER_FILE)} />
      <Lesson1ChalkboardRevised
        canvasAlignment="centered"
        sceneOverrides={APPLE_MOTION_V5_SCENE_OVERRIDES}
        sceneTimingOverrides={PACING_V2_SCENE_TIMING_OVERRIDES}
        seamlessSceneIds={['generation-loop', 'streaming']}
      />
    </AbsoluteFill>
  );
};
