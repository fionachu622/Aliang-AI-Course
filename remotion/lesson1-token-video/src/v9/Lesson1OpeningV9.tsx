import type {CSSProperties, ReactNode} from 'react';
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  interpolateColors,
} from 'remotion';
import {FPS} from '../timeline';
import {
  V9_SCENES,
  V9_SCENE_STARTS,
  V9_VOICEOVER_SCENES,
  V9_VOICEOVER_SCENE_STARTS,
} from './storyboard';
import {
  SceneContextOutro,
  SceneEncodeDecode,
  SceneFullChain,
  SceneGenerationLoop,
  ScenePredictNext,
  SceneStreaming,
  SceneTokenDefinition,
  SceneTokenImpact,
  SceneTokenizer,
  SceneTokenizerObserve,
  SceneVariableToken,
} from './Lesson1RemainingV9';
import {
  BoxFinePrint,
  HandArrow,
  HandUnderline,
  Highlight,
  Layer,
  Paper,
  PaperWipe,
  RoughBox,
  SceneNumber,
  V9SceneTimingProvider,
  ease,
  easeInOut,
  fadeOut,
  useV9SceneFrame,
  useVisualOptions,
  v9Colors,
  v9Fonts,
} from './VisualV9';

const clamp = {
  extrapolateLeft: 'clamp' as const,
  extrapolateRight: 'clamp' as const,
};

const Center = ({children, style}: {children: ReactNode; style?: CSSProperties}) => (
  <div
    style={{
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%,-50%)',
      ...style,
    }}
  >
    {children}
  </div>
);

const Brand = ({
  text,
  amount,
  color,
}: {
  text: string;
  amount: number;
  color: string;
}) => (
  <Layer amount={amount} fromY={34} fromScale={0.9}>
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
      <HandUnderline width={text === '豆包' ? 180 : 330} progress={amount} color={color} style={{position: 'absolute', left: 0, bottom: -10}} />
    </div>
  </Layer>
);

const SimpleBox = ({
  text,
  color,
  progress,
  width,
  opacity = 1,
}: {
  text: string;
  color: string;
  progress: number;
  width: number;
  opacity?: number;
}) => (
  <RoughBox
    width={width}
    height={190}
    color={color}
    progress={progress}
    seedKey={`question-${text}`}
    style={{opacity}}
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

const USAGE_EXAMPLES = [
  ['写文章', 160],
  ['总结资料', 174],
  ['修改文案', 188],
  ['解释问题', 202],
  ['复杂任务', 216],
] as const;

const UsageExampleList = ({
  frame,
  exitProgress,
}: {
  frame: number;
  exitProgress: number;
}) => (
  <div
    style={{
      position: 'absolute',
      left: '50%',
      top: 750,
      width: 1540,
      textAlign: 'center',
      opacity: 1 - exitProgress,
      transform: 'translateX(-50%)',
    }}
  >
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        alignItems: 'center',
      }}
    >
      {USAGE_EXAMPLES.map(([label, start]) => {
        const amount = ease(frame, start, 10);
        const settle = ease(frame, start + 10, 12);
        return (
          <Layer key={label} amount={amount} fromY={14}>
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
        );
      })}
    </div>
  </div>
);

export const SceneQuestion = ({
  showBrands = true,
  brandFadeStart = 75,
  brandFadeDuration = 28,
  brandMinimumOpacity = 0.13,
  dimContextOnQuestion = true,
  transformContextOnQuestion = true,
  showQuestionMark = true,
  showArrowQuestionMark = false,
  showQuestionText = true,
  questionTop = 600,
  showUsageExamples = false,
  questionStart = 182,
  usageExitStart,
  usageExitDuration,
  contentOffsetY = 0,
}: {
  showBrands?: boolean;
  brandFadeStart?: number;
  brandFadeDuration?: number;
  brandMinimumOpacity?: number;
  dimContextOnQuestion?: boolean;
  transformContextOnQuestion?: boolean;
  showQuestionMark?: boolean;
  showArrowQuestionMark?: boolean;
  showQuestionText?: boolean;
  questionTop?: number;
  showUsageExamples?: boolean;
  questionStart?: number;
  usageExitStart?: number;
  usageExitDuration?: number;
  contentOffsetY?: number;
} = {}) => {
  const frame = useV9SceneFrame();
  const {visualStyle} = useVisualOptions();
  const brandFade = fadeOut(frame, brandFadeStart, brandFadeDuration);
  const input = ease(frame, 72, 20);
  const arrow = ease(frame, 98, 30);
  const answer = ease(frame, 120, 20);
  const question = ease(frame, questionStart, 24);
  const usageExit =
    usageExitStart === undefined || usageExitDuration === undefined
      ? question
      : ease(frame, usageExitStart, usageExitDuration);
  const contextOpacity = dimContextOnQuestion
    ? interpolate(question, [0, 1], [1, 0.22], clamp)
    : 1;
  const questionMarkScale = interpolate(question, [0, 1], [0.5, 1], clamp);

  return (
    <Paper>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `translateY(${contentOffsetY}px)`,
        }}
      >
      {showBrands ? (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 320,
            display: 'flex',
            gap: 82,
            alignItems: 'center',
            transform: transformContextOnQuestion
              ? `translateX(-50%) translateY(${-question * 76}px) scale(${1 - question * 0.12})`
              : 'translateX(-50%)',
            opacity: Math.max(brandMinimumOpacity, brandFade),
          }}
        >
          <Brand text="ChatGPT" amount={ease(frame, 8, 18)} color={v9Colors.blue} />
          <Brand text="DeepSeek" amount={ease(frame, 27, 18)} color={v9Colors.green} />
          <Brand text="豆包" amount={ease(frame, 46, 18)} color={v9Colors.magenta} />
        </div>
      ) : null}

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
          opacity: contextOpacity,
        }}
      >
        <Layer amount={input} fromX={-36}>
          <SimpleBox text="一句话" color={v9Colors.ink} progress={input} width={390} />
        </Layer>
        <HandArrow width={480} progress={arrow} color={v9Colors.blue} bend={8} />
        <Layer amount={answer} fromX={36}>
          <SimpleBox text="一段回答" color={v9Colors.magenta} progress={answer} width={430} />
        </Layer>
      </div>

      {showUsageExamples ? (
        <UsageExampleList frame={frame} exitProgress={usageExit} />
      ) : null}

      {showArrowQuestionMark ? (
        <Layer
          amount={question}
          fromScale={0.72}
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
      ) : null}

      {showQuestionText ? <Layer
        amount={question}
        fromScale={0.84}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: questionTop,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 12,
        }}
      >
        {showQuestionMark ? (
          <div
            style={{
              fontSize: 120,
              lineHeight: 0.72,
              color: v9Colors.magenta,
              transform:
                visualStyle === 'geometric'
                  ? `scale(${questionMarkScale})`
                  : `scale(${questionMarkScale}) rotate(-5deg)`,
            }}
          >
            ？
          </div>
        ) : null}
        <div
          style={{
            position: 'relative',
            padding: '0 24px 20px',
            fontSize: 118,
            lineHeight: 1.08,
            whiteSpace: 'nowrap',
            color: v9Colors.ink,
          }}
        >
          中间发生了什么？
          <HandUnderline width={960} progress={question} color={v9Colors.magenta} style={{position: 'absolute', left: 16, bottom: -8}} />
        </div>
      </Layer> : null}
      <SceneNumber current={1} />
      </div>
    </Paper>
  );
};

const FeatureWord = ({
  text,
  amount,
  color,
}: {
  text: string;
  amount: number;
  color: string;
}) => {
  const {visualStyle} = useVisualOptions();
  return (
    <Layer amount={amount} fromY={26} fromScale={0.9}>
    <div
      style={{
        position: 'relative',
        minWidth: 190,
        padding: '13px 22px 24px',
        color: v9Colors.ink,
        fontSize: 62,
        lineHeight: 1,
        textAlign: 'center',
        transform: visualStyle === 'geometric' ? undefined : 'rotate(-.4deg)',
      }}
    >
      {text}
      <HandUnderline
        width={170}
        progress={amount}
        color={color}
        style={{position: 'absolute', left: 32, bottom: -2}}
      />
    </div>
    </Layer>
  );
};

const CurvedAnnotationArrow = ({progress}: {progress: number}) => {
  const {visualStyle} = useVisualOptions();
  const primaryPath =
    visualStyle === 'geometric'
      ? 'M 336 25 H 238 V 80 H 32'
      : 'M 336 25 C 300 17, 276 34, 246 49 C 216 65, 201 76, 174 82 C 139 91, 112 103, 82 91 C 63 84, 50 75, 32 79';
  const arrowPath =
    visualStyle === 'geometric'
      ? 'M 54 62 L 32 80 L 54 98'
      : 'M 58 61 Q 46 68 31 79 Q 44 85 61 89';
  return (
    <svg width="360" height="130" viewBox="0 0 360 130" style={{overflow: 'visible'}}>
    <path
      d={primaryPath}
      fill="none"
      stroke={v9Colors.green}
      strokeWidth={visualStyle === 'geometric' ? 3 : 3.4}
      strokeLinecap={visualStyle === 'geometric' ? 'square' : 'round'}
      strokeLinejoin={visualStyle === 'geometric' ? 'miter' : 'round'}
      pathLength={1}
      strokeDasharray={1}
      strokeDashoffset={1 - progress}
    />
    {visualStyle === 'hand' ? (
      <path
        d="M 332 29 C 284 24, 252 52, 217 68 C 168 90, 112 101, 38 82"
        fill="none"
        stroke={v9Colors.green}
        strokeWidth={1.2}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - progress}
        opacity={0.28}
      />
    ) : null}
    <path
      d={arrowPath}
      fill="none"
      stroke={v9Colors.green}
      strokeWidth={visualStyle === 'geometric' ? 3 : 3.4}
      strokeLinecap={visualStyle === 'geometric' ? 'square' : 'round'}
      strokeLinejoin={visualStyle === 'geometric' ? 'miter' : 'round'}
      opacity={ease(progress, 0.72, 0.2)}
    />
  </svg>
  );
};

export const SceneProductModel = () => {
  const frame = useV9SceneFrame();
  const {visualStyle} = useVisualOptions();
  const shell = ease(frame, 0, 34);
  const title = ease(frame, 20, 20);
  const features = ['聊天', '文件', '搜索', '语音'] as const;
  const featureStarts = [62, 88, 114, 140] as const;
  const shift = easeInOut(frame, 165, 28);
  const core = ease(frame, 184, 26);
  const annotation = ease(frame, 238, 24);

  return (
    <Paper>
      <Center style={{width: 1480, height: 760}}>
        <RoughBox width={1480} height={710} color={v9Colors.ink} progress={shell} radius={22} seedKey="product-shell">
          <Layer
            amount={title}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 56,
              textAlign: 'center',
              fontSize: 126,
              lineHeight: 1,
              color: v9Colors.ink,
              letterSpacing: 8,
            }}
          >
            AI 产品
          </Layer>

          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: 310 - shift * 72,
              display: 'flex',
              alignItems: 'center',
              gap: 54,
              transform: `translateX(-50%) scale(${1 - shift * 0.1})`,
            }}
          >
            {features.map((feature, index) => (
              <FeatureWord
                key={feature}
                text={feature}
                amount={ease(frame, featureStarts[index], 18)}
                color={[v9Colors.blue, v9Colors.magenta, v9Colors.green, v9Colors.coral][index]}
              />
            ))}
          </div>

          <Layer
            amount={core}
            fromScale={0.78}
            style={{position: 'absolute', left: 485, top: 425}}
          >
            <RoughBox width={510} height={200} color={v9Colors.green} progress={core} strokeWidth={4} radius={18} seedKey="product-model-core">
              <Highlight progress={ease(frame, 208, 24)} color={v9Colors.green} style={{left: 86, top: 99, width: `${ease(frame, 208, 24) * 66}%`, opacity: 0.22}} />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 106,
                  lineHeight: 1,
                }}
              >
                大模型
              </div>
            </RoughBox>
          </Layer>

          <BoxFinePrint>
            <Layer
              amount={annotation}
              fromX={36}
              style={{position: 'absolute', right: 82, bottom: 15}}
            >
              <div style={{fontSize: 54, color: v9Colors.green, transform: visualStyle === 'geometric' ? undefined : 'rotate(-3deg)'}}>
                核心能力之一
              </div>
              <CurvedAnnotationArrow progress={annotation} />
            </Layer>
          </BoxFinePrint>
        </RoughBox>
      </Center>
      <SceneNumber current={2} />
    </Paper>
  );
};

const FlowWord = ({
  text,
  color,
  amount,
  highlight = false,
}: {
  text: string;
  color: string;
  amount: number;
  highlight?: boolean;
}) => (
  <Layer amount={amount} fromY={28} fromScale={0.9}>
    <div
      style={{
        position: 'relative',
        width: 350,
        flexShrink: 0,
        boxSizing: 'border-box',
        padding: '27px 8px 31px',
        textAlign: 'center',
        fontSize: 76,
        lineHeight: 1,
        color: v9Colors.ink,
      }}
    >
      {highlight ? <Highlight progress={amount} color={color} /> : null}
      <span style={{position: 'relative'}}>{text}</span>
      <HandUnderline width={320} progress={amount} color={color} style={{position: 'absolute', left: 15, bottom: 0}} />
    </div>
  </Layer>
);

export const SceneLlmActions = () => {
  const frame = useV9SceneFrame();
  const {visualStyle} = useVisualOptions();
  const name = ease(frame, 4, 20);
  const subtitle = ease(frame, 42, 20);
  const move = easeInOut(frame, 88, 30);
  const data = ease(frame, 122, 22);
  const arrow1 = ease(frame, 156, 24);
  const rules = ease(frame, 174, 22);
  const arrow2 = ease(frame, 214, 24);
  const generate = ease(frame, 232, 22);
  const question = ease(frame, 292, 24);
  const flowOpacity = 1 - question * 0.94;
  const llmY = interpolate(move, [0, 1], [360, 150], clamp);
  const llmScale = interpolate(move, [0, 1], [1, 0.56], clamp);

  return (
    <Paper>
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: llmY,
          transform: `translateX(-50%) scale(${llmScale})`,
          transformOrigin: 'top center',
          textAlign: 'center',
        }}
      >
        <Layer amount={name} fromScale={0.82}>
          <div style={{position: 'relative', display: 'inline-block', padding: '0 30px 25px'}}>
            <div style={{fontSize: 194, lineHeight: 1, color: v9Colors.ink, letterSpacing: 8}}>LLM</div>
            <HandUnderline width={420} progress={name} color={v9Colors.magenta} style={{position: 'absolute', left: 15, bottom: 0}} />
          </div>
        </Layer>
        <Layer amount={subtitle} fromY={18}>
          <div style={{marginTop: 22, fontSize: 72, lineHeight: 1, color: v9Colors.magenta}}>
            大语言模型
          </div>
        </Layer>
      </div>

      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 590,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 28,
          transform: 'translate(-50%,-50%)',
          opacity: flowOpacity,
        }}
      >
        <FlowWord text="大量数据" color={v9Colors.blue} amount={data} />
        <HandArrow width={200} progress={arrow1} color={v9Colors.blue} bend={5} />
        <FlowWord text="学习规律" color={v9Colors.yellow} amount={rules} highlight />
        <HandArrow width={200} progress={arrow2} color={v9Colors.magenta} bend={-5} />
        <FlowWord text="继续生成" color={v9Colors.green} amount={generate} />
      </div>

      <Layer
        amount={question}
        fromScale={0.84}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 510,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 22,
        }}
      >
        <div style={{fontSize: 160, lineHeight: 0.8, color: v9Colors.magenta, transform: visualStyle === 'geometric' ? undefined : 'rotate(-5deg)'}}>？</div>
        <div style={{position: 'relative', fontSize: 118, lineHeight: 1.1, padding: '0 18px 25px'}}>
          它怎么做到的？
          <HandUnderline width={760} progress={question} color={v9Colors.green} style={{position: 'absolute', left: 8, bottom: -6}} />
        </div>
      </Layer>
      <SceneNumber current={3} />
    </Paper>
  );
};

export const Lesson1OpeningV9 = ({
  timingMode = 'preview',
}: {
  timingMode?: 'preview' | 'voiceover';
}) => {
  const {handFontFamily, visualStyle} = useVisualOptions();
  const scenes = timingMode === 'voiceover' ? V9_VOICEOVER_SCENES : V9_SCENES;
  const sceneStarts =
    timingMode === 'voiceover' ? V9_VOICEOVER_SCENE_STARTS : V9_SCENE_STARTS;
  const [scene1, scene2, scene3] = scenes;
  const [start1, start2, start3] = sceneStarts;
  const remaining = [
    ScenePredictNext,
    SceneGenerationLoop,
    SceneStreaming,
    SceneTokenDefinition,
    SceneTokenizer,
    SceneEncodeDecode,
    SceneVariableToken,
    SceneTokenizerObserve,
    SceneTokenImpact,
    SceneFullChain,
    SceneContextOutro,
  ] as const;
  return (
    <AbsoluteFill
  style={{
  background: v9Colors.paper,
  fontFamily: visualStyle === 'geometric' ? v9Fonts.geometric : handFontFamily,
  fontWeight: visualStyle === 'geometric' ? 600 : undefined,
  }}>
      <Sequence from={start1} durationInFrames={scene1.durationInFrames} premountFor={FPS}>
        <V9SceneTimingProvider
          designDurationInFrames={V9_SCENES[0].durationInFrames}
          durationInFrames={scene1.durationInFrames}
        >
          <SceneQuestion />
        </V9SceneTimingProvider>
      </Sequence>
      <Sequence from={start2} durationInFrames={scene2.durationInFrames} premountFor={FPS}>
        <V9SceneTimingProvider
          designDurationInFrames={V9_SCENES[1].durationInFrames}
          durationInFrames={scene2.durationInFrames}
        >
          <SceneProductModel />
        </V9SceneTimingProvider>
      </Sequence>
      <Sequence from={start3} durationInFrames={scene3.durationInFrames} premountFor={FPS}>
        <V9SceneTimingProvider
          designDurationInFrames={V9_SCENES[2].durationInFrames}
          durationInFrames={scene3.durationInFrames}
        >
          <SceneLlmActions />
        </V9SceneTimingProvider>
      </Sequence>
      {remaining.map((Scene, index) => {
        const sceneIndex = index + 3;
        const scene = scenes[sceneIndex];
        const start = sceneStarts[sceneIndex];
        return (
          <Sequence key={scene.id} from={start} durationInFrames={scene.durationInFrames} premountFor={FPS}>
            <V9SceneTimingProvider
              designDurationInFrames={V9_SCENES[sceneIndex].durationInFrames}
              durationInFrames={scene.durationInFrames}
            >
              <Scene />
            </V9SceneTimingProvider>
          </Sequence>
        );
      })}

      {sceneStarts.slice(1).map((start, index) => (
        <Sequence key={`wipe-${index + 2}`} from={start - 12} durationInFrames={24} premountFor={FPS}>
          <PaperWipe />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
