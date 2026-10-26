import {AbsoluteFill, Audio, staticFile} from 'remotion';
import {Lesson1ChalkboardRevised} from '../v14/Lesson1ChalkboardRevised';
import {SceneLlmActionsRevised} from '../v14/RevisedScenes';
import {REVIEW_VOICEOVER_FILE} from '../v16/reviewVoiceoverTiming';
import type {Lesson1ChalkboardRevisedReviewBoldPacingV2Props} from '../v18/Lesson1ChalkboardRevisedReviewBoldPacingV2';
import {
  PACING_V2_SCENE_OVERRIDES,
  SceneTokenDefinitionPacingV2,
} from '../v18/Lesson1ChalkboardRevisedReviewBoldPacingV2';
import {PACING_V2_SCENE_TIMING_OVERRIDES} from '../v18/reviewPacingV2Timing';
import {SceneQuestion} from '../v9/Lesson1OpeningV9';

const SceneQuestionVerticalV4 = () => (
  <SceneQuestion
    showBrands
    brandFadeStart={130}
    brandFadeDuration={18}
    brandMinimumOpacity={0}
    dimContextOnQuestion={false}
    transformContextOnQuestion={false}
    showQuestionMark={false}
    showArrowQuestionMark
    showQuestionText={false}
    showUsageExamples
    questionStart={236}
    usageExitStart={236}
    usageExitDuration={2}
    contentOffsetY={-48}
  />
);

const SceneLlmActionsVerticalV4 = () => (
  <SceneLlmActionsRevised
    abbreviationMorph
    questionTop={350}
    identityOffsetY={-58}
    identityDockOffsetY={30}
    diagramOffsetY={-28}
  />
);

const SceneTokenDefinitionVerticalV4 = () => (
  <SceneTokenDefinitionPacingV2 lowerContentOffsetY={-24} />
);

export const VERTICAL_V4_SCENE_OVERRIDES = {
  ...PACING_V2_SCENE_OVERRIDES,
  question: SceneQuestionVerticalV4,
  'llm-actions': SceneLlmActionsVerticalV4,
  'token-definition': SceneTokenDefinitionVerticalV4,
};

export type Lesson1ChalkboardRevisedReviewBoldPacingCenteredVerticalV4Props =
  Omit<Lesson1ChalkboardRevisedReviewBoldPacingV2Props, 'canvasAlignment'>;

/**
 * Optical vertical-alignment pass built on Centered V3.
 *
 * V3 remains unchanged. Only the three reviewed scenes receive local offsets;
 * top-anchored process and diagram scenes retain their existing coordinates.
 */
export const Lesson1ChalkboardRevisedReviewBoldPacingCenteredVerticalV4 = ({
  fontWeight = 600,
  strokeWidth = 0.65,
}: Lesson1ChalkboardRevisedReviewBoldPacingCenteredVerticalV4Props) => {
  const smallStrokeWidth = Math.max(0.2, strokeWidth * 0.46);
  const largeStrokeWidth = strokeWidth * 1.23;

  return (
    <AbsoluteFill className="lesson1-review-bold-centered-vertical-v4">
      <style>{`
        .lesson1-review-bold-centered-vertical-v4 div,
        .lesson1-review-bold-centered-vertical-v4 span {
          font-weight: ${fontWeight} !important;
          -webkit-text-stroke: ${strokeWidth}px currentColor;
          paint-order: stroke fill;
        }

        .lesson1-review-bold-centered-vertical-v4 [style*="font-size: 2"] {
          font-weight: 500 !important;
          -webkit-text-stroke-width: ${smallStrokeWidth}px;
        }

        .lesson1-review-bold-centered-vertical-v4 [style*="font-size: 6"],
        .lesson1-review-bold-centered-vertical-v4 [style*="font-size: 7"],
        .lesson1-review-bold-centered-vertical-v4 [style*="font-size: 8"],
        .lesson1-review-bold-centered-vertical-v4 [style*="font-size: 9"] {
          -webkit-text-stroke-width: ${largeStrokeWidth}px;
        }
      `}</style>
      <Audio src={staticFile(REVIEW_VOICEOVER_FILE)} />
      <Lesson1ChalkboardRevised
        canvasAlignment="centered"
        sceneOverrides={VERTICAL_V4_SCENE_OVERRIDES}
        sceneTimingOverrides={PACING_V2_SCENE_TIMING_OVERRIDES}
        seamlessSceneIds={['generation-loop', 'streaming']}
      />
    </AbsoluteFill>
  );
};
