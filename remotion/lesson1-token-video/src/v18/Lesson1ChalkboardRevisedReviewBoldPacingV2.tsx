import {AbsoluteFill, Audio, staticFile} from 'remotion';
import {Lesson1ChalkboardRevised} from '../v14/Lesson1ChalkboardRevised';
import type {ChalkboardCanvasAlignment} from '../v14/Lesson1ChalkboardRevised';
import {
  REVIEW_SCENE_OVERRIDES,
  SceneLlmActionsReviewPacingV2,
  SceneProductModelReviewPacingV2,
  SceneQuestionReviewPacingV2,
  SceneStreamingReviewPacingV2,
  SceneTokenImpactReviewPacingV2,
} from '../v16/Lesson1ChalkboardRevisedReview';
import {REVIEW_VOICEOVER_FILE} from '../v16/reviewVoiceoverTiming';
import type {Lesson1ChalkboardRevisedReviewBoldProps} from '../v17/Lesson1ChalkboardRevisedReviewBold';
import {Box} from '../v9/Lesson1RemainingV9';
import {
  Highlight,
  Layer,
  Paper,
  ease,
  useV9SceneFrame,
  v9Colors,
} from '../v9/VisualV9';
import {PACING_V2_SCENE_TIMING_OVERRIDES} from './reviewPacingV2Timing';

const TOKEN_USAGE_EXAMPLES = [
  ['100 万 Token 上下文', v9Colors.blue],
  ['输入 Token', v9Colors.green],
  ['输出 Token', v9Colors.magenta],
  ['每百万 Token 多少钱', v9Colors.yellow],
] as const;

export const SceneTokenDefinitionPacingV2 = ({
  lowerContentOffsetY = 0,
  showNextQuestion = true,
  showOutputTokenExample = true,
}: {
  lowerContentOffsetY?: number;
  showNextQuestion?: boolean;
  showOutputTokenExample?: boolean;
} = {}) => {
  const frame = useV9SceneFrame();
  const token = ease(frame, 5, 24);
  const usageExit = ease(frame, 35, 9);
  const unit = ease(frame, 40, 22);
  const neq = [ease(frame, 92, 18), ease(frame, 122, 18), ease(frame, 152, 18)];
  const nextQuestion = ease(frame, 220, 14);

  return (
    <Paper>
      <div
        style={{
          position: 'absolute',
          left: 130,
          right: 130,
          top: 130,
          display: 'flex',
          justifyContent: 'center',
          gap: 22,
          opacity: 1 - usageExit,
        }}
      >
        {TOKEN_USAGE_EXAMPLES.map(([label, color], index) =>
          label === '输出 Token' && !showOutputTokenExample ? null : (
            <Layer
              key={label}
              amount={ease(frame, 13 + index * 4, 10)}
              fromY={8}
              style={{
                padding: '10px 20px 12px',
                color,
                fontSize: 31,
                lineHeight: 1,
                border: `2px solid ${color}`,
                borderRadius: '46% 54% 48% 52%',
                background: 'rgba(30, 32, 34, 0.38)',
                whiteSpace: 'nowrap',
              }}
            >
              {label}
            </Layer>
          ),
        )}
      </div>

      <div style={{position: 'absolute', left: 0, right: 0, top: 260, textAlign: 'center'}}>
        <Layer amount={token} fromScale={0.82}>
          <span style={{fontSize: 190, color: v9Colors.blue}}>Token</span>
        </Layer>
        <Layer amount={unit} fromY={20}>
          <div style={{fontSize: 82, marginTop: 20}}>
            模型处理和生成文本的{' '}
            <span style={{position: 'relative', color: v9Colors.yellow}}>
              基本单位
              <Highlight progress={unit} color={v9Colors.yellow} />
            </span>
          </div>
        </Layer>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 275,
          right: 275,
          top: 720 + lowerContentOffsetY,
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 55,
        }}
      >
        {['≠ 一个汉字', '≠ 一个单词', '≠ 一个字符'].map((text, index) => (
          <Box
            key={text}
            text={text}
            amount={neq[index]}
            color={[v9Colors.magenta, v9Colors.green, v9Colors.coral][index]}
            width={410}
            height={150}
            fontSize={52}
          />
        ))}
      </div>

      {showNextQuestion ? (
        <Layer
          amount={nextQuestion}
          fromY={8}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 64 - lowerContentOffsetY,
            textAlign: 'center',
            color: v9Colors.muted,
            fontSize: 38,
          }}
        >
          正常文字　→　？　→　Token
        </Layer>
      ) : null}
    </Paper>
  );
};

export const PACING_V2_SCENE_OVERRIDES = {
  ...REVIEW_SCENE_OVERRIDES,
  question: SceneQuestionReviewPacingV2,
  'product-model': SceneProductModelReviewPacingV2,
  'llm-actions': SceneLlmActionsReviewPacingV2,
  streaming: SceneStreamingReviewPacingV2,
  'token-definition': SceneTokenDefinitionPacingV2,
  'token-impact': SceneTokenImpactReviewPacingV2,
};

export type Lesson1ChalkboardRevisedReviewBoldPacingV2Props =
  Lesson1ChalkboardRevisedReviewBoldProps & {
    canvasAlignment?: ChalkboardCanvasAlignment;
  };

export const Lesson1ChalkboardRevisedReviewBoldPacingV2 = ({
  fontWeight = 600,
  strokeWidth = 0.65,
  canvasAlignment = 'legacy-offset',
}: Lesson1ChalkboardRevisedReviewBoldPacingV2Props) => {
  const smallStrokeWidth = Math.max(0.2, strokeWidth * 0.46);
  const largeStrokeWidth = strokeWidth * 1.23;

  return (
    <AbsoluteFill className="lesson1-review-bold-pacing-v2">
      <style>{`
        .lesson1-review-bold-pacing-v2 div,
        .lesson1-review-bold-pacing-v2 span {
          font-weight: ${fontWeight} !important;
          -webkit-text-stroke: ${strokeWidth}px currentColor;
          paint-order: stroke fill;
        }

        .lesson1-review-bold-pacing-v2 [style*="font-size: 2"] {
          font-weight: 500 !important;
          -webkit-text-stroke-width: ${smallStrokeWidth}px;
        }

        .lesson1-review-bold-pacing-v2 [style*="font-size: 6"],
        .lesson1-review-bold-pacing-v2 [style*="font-size: 7"],
        .lesson1-review-bold-pacing-v2 [style*="font-size: 8"],
        .lesson1-review-bold-pacing-v2 [style*="font-size: 9"] {
          -webkit-text-stroke-width: ${largeStrokeWidth}px;
        }
      `}</style>
      <Audio src={staticFile(REVIEW_VOICEOVER_FILE)} />
      <Lesson1ChalkboardRevised
        canvasAlignment={canvasAlignment}
        sceneOverrides={PACING_V2_SCENE_OVERRIDES}
        sceneTimingOverrides={PACING_V2_SCENE_TIMING_OVERRIDES}
        seamlessSceneIds={['generation-loop', 'streaming']}
      />
    </AbsoluteFill>
  );
};
