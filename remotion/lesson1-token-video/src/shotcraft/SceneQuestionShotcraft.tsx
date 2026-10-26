import {
  Easing,
  interpolate,
  interpolateColors,
  useCurrentFrame,
} from 'remotion';
import {PACING_V2_SCENE_TIMING_OVERRIDES} from '../v18/reviewPacingV2Timing';
import {
  HandArrow,
  HandUnderline,
  Layer,
  Paper,
  RoughBox,
  ease,
  fadeOut,
  useV9SceneFrame,
  v9Colors,
} from '../v9/VisualV9';

const USES = [
  ['写文章', 160],
  ['总结资料', 174],
  ['修改文案', 188],
  ['解释问题', 202],
  ['复杂任务', 216],
] as const;
// The existing question's cue, resolved from the same recorded-narration table.
const QUESTION_CUE =
  PACING_V2_SCENE_TIMING_OVERRIDES.question.timingAnchors!.find(
    (anchor) => anchor.designFrame === 236,
  )!.frame;
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const Phrase = ({
  text,
  color,
  progress,
  width,
}: {
  text: string;
  color: string;
  progress: number;
  width: number;
}) => (
  <RoughBox
    width={width}
    height={190}
    color={color}
    progress={progress}
    seedKey={`question-${text}`}
  >
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 92,
        lineHeight: 1,
      }}
    >
      {text}
    </div>
  </RoughBox>
);

/** Same words, anchors and resting layout as V3; only the focus movement differs. */
export const SceneQuestionShotcraft = () => {
  const frame = useV9SceneFrame();
  const realFrame = useCurrentFrame();
  const input = ease(frame, 72, 20);
  const arrow = ease(frame, 98, 30);
  const answer = ease(frame, 120, 20);
  const question = ease(realFrame, QUESTION_CUE, 24);
  const focus = interpolate(
    realFrame,
    [QUESTION_CUE, QUESTION_CUE + 36],
    [0, 1],
    {
      ...clamp,
      easing: Easing.inOut(Easing.cubic),
    },
  );
  return (
    <Paper>
      <div
        style={{position: 'absolute', inset: 0, transform: 'translateY(-48px)'}}
      >
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 320,
            display: 'flex',
            gap: 82,
            alignItems: 'center',
            transform: 'translateX(-50%)',
            opacity: fadeOut(frame, 130, 18),
          }}
        >
          {(
            [
              ['ChatGPT', 8, v9Colors.blue],
              ['DeepSeek', 27, v9Colors.green],
              ['豆包', 46, v9Colors.magenta],
            ] as const
          ).map(([text, start, color]) => {
            const p = ease(frame, start, 18);
            return (
              <Layer key={text} amount={p} fromY={34} fromScale={0.9}>
                <div style={{position: 'relative', padding: '0 8px 13px'}}>
                  <div
                    style={{
                      fontSize: 88,
                      lineHeight: 1,
                      color: v9Colors.ink,
                      whiteSpace: 'nowrap',
                      letterSpacing: 2,
                    }}
                  >
                    {text}
                  </div>
                  <HandUnderline
                    width={text === '豆包' ? 180 : 330}
                    progress={p}
                    color={color}
                    style={{position: 'absolute', left: 0, bottom: -10}}
                  />
                </div>
              </Layer>
            );
          })}
        </div>

        <div
          style={{
            position: 'absolute',
            left: 240,
            right: 240,
            top: 470,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 65,
            transform: `translateY(${focus * 22}px) scale(${1 + focus * 0.035})`,
            transformOrigin: 'center center',
          }}
        >
          <Layer amount={input} fromX={-36}>
            <Phrase
              text="一句话"
              color={v9Colors.ink}
              progress={input}
              width={390}
            />
          </Layer>
          <HandArrow
            width={480}
            progress={arrow}
            color={v9Colors.blue}
            bend={8}
          />
          <Layer amount={answer} fromX={36}>
            <Phrase
              text="一段回答"
              color={v9Colors.magenta}
              progress={answer}
              width={430}
            />
          </Layer>
        </div>

        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 750,
            width: 1540,
            textAlign: 'center',
            transform: 'translateX(-50%)',
            display: 'grid',
            gridTemplateColumns: 'repeat(5,1fr)',
            alignItems: 'center',
          }}
        >
          {USES.map(([label, start], index) => {
            // A semantic word group leaves as a whole; outside pairs yield first.
            const strip = interpolate(
              realFrame,
              [
                QUESTION_CUE + (2 - Math.abs(index - 2)) * 4,
                QUESTION_CUE + (2 - Math.abs(index - 2)) * 4 + 14,
              ],
              [0, 1],
              {
                ...clamp,
                easing: Easing.in(Easing.quad),
              },
            );
            const settle = ease(frame, start + 10, 12);
            return (
              <div
                key={label}
                style={{
                  opacity: 1 - strip,
                  transform: `translate(${(index - 2) * 25 * strip}px,${50 * strip}px)`,
                }}
              >
                <Layer amount={ease(frame, start, 10)} fromY={14}>
                  <div
                    style={{
                      color: interpolateColors(
                        settle,
                        [0, 1],
                        [v9Colors.yellow, v9Colors.ink],
                      ),
                      fontSize: 54,
                      lineHeight: 1,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {label}
                  </div>
                </Layer>
              </div>
            );
          })}
        </div>

        <Layer
          amount={question}
          fromY={22}
          fromScale={1}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 365,
            textAlign: 'center',
            color: v9Colors.magenta,
            fontSize: 156,
            lineHeight: 1,
          }}
        >
          ？
        </Layer>
      </div>
    </Paper>
  );
};
