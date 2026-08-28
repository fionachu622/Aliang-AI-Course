import type {CSSProperties, ReactNode} from 'react';
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
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
  v9Colors,
  v9Fonts,
  type V9MotionStyle,
} from './VisualV9';

const clamp = {
  extrapolateLeft: 'clamp' as const,
  extrapolateRight: 'clamp' as const,
};

const APPLE_TRANSITION_FRAMES = Math.round(FPS * 0.4);

const AppleSceneMotion = ({
  durationInFrames,
  children,
}: {
  durationInFrames: number;
  children: ReactNode;
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const springConfig = {
    damping: 30,
    stiffness: 180,
    mass: 1,
    overshootClamping: true,
  };
  const enter = spring({
    frame,
    fps,
    durationInFrames: APPLE_TRANSITION_FRAMES,
    config: springConfig,
  });
  const exit =
    frame < durationInFrames
      ? 0
      : spring({
          frame: frame - durationInFrames,
          fps,
          durationInFrames: APPLE_TRANSITION_FRAMES,
          config: springConfig,
        });
  const visibility = enter * (1 - exit);
  const y = (1 - visibility) * 8;
  const scale = 0.996 + visibility * 0.004;

  return (
    <AbsoluteFill
      style={{
        opacity: visibility,
        transform: `translate3d(0, ${y}px, 0) scale(${scale})`,
        transformOrigin: '50% 50%',
        willChange: 'transform, opacity',
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

const SceneMotion = ({
  motionStyle,
  durationInFrames,
  children,
}: {
  motionStyle: V9MotionStyle;
  durationInFrames: number;
  children: ReactNode;
}) =>
  motionStyle === 'apple' ? (
    <AppleSceneMotion durationInFrames={durationInFrames}>
      {children}
    </AppleSceneMotion>
  ) : (
    <>{children}</>
  );

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

const SceneQuestion = () => {
  const frame = useV9SceneFrame();
  const brandFade = fadeOut(frame, 75, 28);
  const input = ease(frame, 72, 20);
  const arrow = ease(frame, 98, 30);
  const answer = ease(frame, 120, 20);
  const question = ease(frame, 182, 24);
  const contextOpacity = interpolate(question, [0, 1], [1, 0.22], clamp);
  const questionMarkScale = interpolate(question, [0, 1], [0.5, 1], clamp);

  return (
    <Paper>
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 320,
          display: 'flex',
          gap: 82,
          alignItems: 'center',
          transform: `translateX(-50%) translateY(${-question * 76}px) scale(${1 - question * 0.12})`,
          opacity: Math.max(0.13, brandFade),
        }}
      >
        <Brand text="ChatGPT" amount={ease(frame, 8, 18)} color={v9Colors.blue} />
        <Brand text="DeepSeek" amount={ease(frame, 27, 18)} color={v9Colors.green} />
        <Brand text="豆包" amount={ease(frame, 46, 18)} color={v9Colors.magenta} />
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

      <Layer
        amount={question}
        fromScale={0.84}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 600,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <div
          style={{
            fontSize: 120,
            lineHeight: 0.72,
            color: v9Colors.magenta,
            transform: `scale(${questionMarkScale}) rotate(-5deg)`,
          }}
        >
          ？
        </div>
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
      </Layer>
      <SceneNumber current={1} />
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
}) => (
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
        transform: 'rotate(-.4deg)',
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

const CurvedAnnotationArrow = ({progress}: {progress: number}) => (
  <svg width="360" height="130" viewBox="0 0 360 130" style={{overflow: 'visible'}}>
    <path
      d="M 336 25 C 300 17, 276 34, 246 49 C 216 65, 201 76, 174 82 C 139 91, 112 103, 82 91 C 63 84, 50 75, 32 79"
      fill="none"
      stroke={v9Colors.green}
      strokeWidth={3.4}
      strokeLinecap="round"
      pathLength={1}
      strokeDasharray={1}
      strokeDashoffset={1 - progress}
    />
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
    <path
      d="M 58 61 Q 46 68 31 79 Q 44 85 61 89"
      fill="none"
      stroke={v9Colors.green}
      strokeWidth={3.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={ease(progress, 0.72, 0.2)}
    />
  </svg>
);

const SceneProductModel = () => {
  const frame = useV9SceneFrame();
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
              <div style={{fontSize: 54, color: v9Colors.green, transform: 'rotate(-3deg)'}}>
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

const SceneLlmActions = () => {
  const frame = useV9SceneFrame();
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
        <div style={{fontSize: 160, lineHeight: 0.8, color: v9Colors.magenta, transform: 'rotate(-5deg)'}}>？</div>
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
  motionStyle = 'legacy',
}: {
  timingMode?: 'preview' | 'voiceover';
  motionStyle?: V9MotionStyle;
}) => {
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
  fontFamily: v9Fonts.hand,
  }}>
      <Sequence
        from={start1}
        durationInFrames={scene1.durationInFrames + (motionStyle === 'apple' ? APPLE_TRANSITION_FRAMES : 0)}
        premountFor={FPS}
      >
        <V9SceneTimingProvider
          designDurationInFrames={V9_SCENES[0].durationInFrames}
          durationInFrames={scene1.durationInFrames}
        >
          <SceneMotion motionStyle={motionStyle} durationInFrames={scene1.durationInFrames}>
            <SceneQuestion />
          </SceneMotion>
        </V9SceneTimingProvider>
      </Sequence>
      <Sequence
        from={start2}
        durationInFrames={scene2.durationInFrames + (motionStyle === 'apple' ? APPLE_TRANSITION_FRAMES : 0)}
        premountFor={FPS}
      >
        <V9SceneTimingProvider
          designDurationInFrames={V9_SCENES[1].durationInFrames}
          durationInFrames={scene2.durationInFrames}
        >
          <SceneMotion motionStyle={motionStyle} durationInFrames={scene2.durationInFrames}>
            <SceneProductModel />
          </SceneMotion>
        </V9SceneTimingProvider>
      </Sequence>
      <Sequence
        from={start3}
        durationInFrames={scene3.durationInFrames + (motionStyle === 'apple' ? APPLE_TRANSITION_FRAMES : 0)}
        premountFor={FPS}
      >
        <V9SceneTimingProvider
          designDurationInFrames={V9_SCENES[2].durationInFrames}
          durationInFrames={scene3.durationInFrames}
        >
          <SceneMotion motionStyle={motionStyle} durationInFrames={scene3.durationInFrames}>
            <SceneLlmActions />
          </SceneMotion>
        </V9SceneTimingProvider>
      </Sequence>
      {remaining.map((Scene, index) => {
        const sceneIndex = index + 3;
        const scene = scenes[sceneIndex];
        const start = sceneStarts[sceneIndex];
        return (
          <Sequence
            key={scene.id}
            from={start}
            durationInFrames={
              scene.durationInFrames +
              (motionStyle === 'apple' && sceneIndex < scenes.length - 1
                ? APPLE_TRANSITION_FRAMES
                : 0)
            }
            premountFor={FPS}
          >
            <V9SceneTimingProvider
              designDurationInFrames={V9_SCENES[sceneIndex].durationInFrames}
              durationInFrames={scene.durationInFrames}
            >
              <SceneMotion motionStyle={motionStyle} durationInFrames={scene.durationInFrames}>
                <Scene />
              </SceneMotion>
            </V9SceneTimingProvider>
          </Sequence>
        );
      })}

      {motionStyle === 'legacy'
        ? sceneStarts.slice(1).map((start, index) => (
            <Sequence key={`wipe-${index + 2}`} from={start - 12} durationInFrames={24} premountFor={FPS}>
              <PaperWipe />
            </Sequence>
          ))
        : null}
    </AbsoluteFill>
  );
};
