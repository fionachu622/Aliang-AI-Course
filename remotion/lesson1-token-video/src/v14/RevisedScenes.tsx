import {Img, interpolateColors, spring, staticFile} from 'remotion';
import {BoxFinePrint, HandArrow, Layer, Paper, RoughBox, ease, easeInOut, useV9SceneFrame, v9Colors} from '../v9/VisualV9';
import {SceneQuestion} from '../v9/Lesson1OpeningV9';
import {
  Box,
  ChalkUnderline,
  SceneGenerationLoop,
  ScenePredictNext,
  SceneTokenDefinition,
  SceneTokenizer,
  Title,
} from '../v9/Lesson1RemainingV9';

export const SceneGenerationLoopRevised = () => (
  <SceneGenerationLoop
    tokens={['手机', '只剩', '1%', '的电', '，', '我', '赶紧', '找', '充电器', '……']}
  />
);

export const SceneQuestionRevised = () => (
  <SceneQuestion
    showBrands
    brandFadeStart={150}
    brandFadeDuration={26}
    brandMinimumOpacity={0}
    dimContextOnQuestion={false}
    transformContextOnQuestion={false}
    showQuestionMark={false}
    showArrowQuestionMark
    showQuestionText={false}
  />
);

export const ScenePredictNextRevised = () => (
  <ScenePredictNext
    insightText="预测接下来更可能出现什么"
    insightUnderlineWidth={1100}
  />
);

export const SceneTokenDefinitionRevised = () => (
  <SceneTokenDefinition showTitle={false} comparisonTop={720} />
);

export const SceneTokenizerRevised = () => (
  <SceneTokenizer
    sentence="手机只剩 1% 的电，我赶紧找充电器。"
    pieces={['手机', '只剩', '1%', '的电', '，', '我', '赶紧', '找', '充电器', '。']}
    note="示意切分 · 正式结果待 Tokenizer 校准"
  />
);

export const SceneLlmActionsRevised = ({
  abbreviationMorph = false,
  questionTop = 510,
  identityOffsetY = 0,
  identityDockOffsetY = 0,
  diagramOffsetY = 0,
}: {
  abbreviationMorph?: boolean;
  questionTop?: number;
  identityOffsetY?: number;
  identityDockOffsetY?: number;
  diagramOffsetY?: number;
} = {}) => {
  const frame = useV9SceneFrame();
  const llm = ease(frame, 4, 18);
  const fullName = ease(frame, 28, 20);
  const chineseName = ease(frame, 52, 20);
  const shortName = ease(frame, 76, 18);
  const namingDetailsExit = easeInOut(frame, 100, 12);
  const dock = easeInOut(frame, 112, 24);
  const modelUnderline = ease(frame, 136, 12);
  const modelFrame = ease(frame, 124, 22);
  const trainingLabel = ease(frame, 126, 18);
  const data = ease(frame, 140, 20);
  const trainingArrow = ease(frame, 160, 20);
  const rules = ease(frame, 176, 22);
  const usageLabel = ease(frame, 202, 18);
  const context = ease(frame, 216, 20);
  const contextArrow = ease(frame, 234, 20);
  const outputArrow = ease(frame, 250, 20);
  const generate = ease(frame, 266, 20);
  const question = ease(frame, 292, 22);
  const diagramOpacity = 1 - question * 0.94;
  const trainingOpacity = diagramOpacity * (1 - usageLabel * 0.45);
  const identityTop =
    (abbreviationMorph ? 470 : 105 + dock * 210) +
    identityOffsetY +
    dock * identityDockOffsetY;
  const identityScale = abbreviationMorph ? 1 : 1 - dock * 0.42;
  const namingDetailOpacity = 1 - namingDetailsExit;
  const abbreviationColor = interpolateColors(
    shortName,
    [0, 1],
    [v9Colors.magenta, v9Colors.green],
  );

  return (
    <Paper>
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: identityTop,
          width: abbreviationMorph ? 1380 : 1220,
          textAlign: 'center',
          transform: `translateX(-50%) scale(${identityScale})`,
          transformOrigin: 'top center',
          opacity: diagramOpacity,
          zIndex: 2,
        }}
      >
        {abbreviationMorph ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '320px 90px 640px',
              columnGap: 18,
              alignItems: 'center',
              justifyContent: 'center',
              height: 220,
            }}
          >
            <Layer amount={llm} fromScale={0.84}>
              <div
                style={{
                  position: 'relative',
                  display: 'inline-block',
                  padding: '0 14px',
                  transform: `translate(${383 * dock}px, ${-235 * dock}px)`,
                  transformOrigin: 'center center',
                }}
              >
                <div
                  style={{
                    fontSize: 132 - 52 * dock,
                    lineHeight: 1,
                    letterSpacing: 7 - 3 * dock,
                  }}
                >
                  LLM
                </div>
                <ChalkUnderline
                  width={290 - 114 * dock}
                  amount={modelUnderline}
                  color={v9Colors.magenta}
                  style={{position: 'absolute', left: 2, bottom: -18}}
                />
              </div>
            </Layer>

            <Layer
              amount={fullName}
              fromScale={0.72}
              motionVisibility={dock > 0 ? 0 : 1}
              style={{opacity: dock > 0 ? 0 : fullName}}
            >
              <div
                style={{
                  color: v9Colors.muted,
                  fontSize: 86,
                  lineHeight: 1,
                  transform: `translateY(${-12 * dock}px) rotate(-2deg)`,
                }}
              >
                =
              </div>
            </Layer>

            <div
              style={{
                position: 'relative',
                width: 640,
                height: 156,
                overflow: 'visible',
                textAlign: 'left',
              }}
            >
              <Layer
                amount={fullName}
                fromY={16}
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: 35,
                }}
              >
                <div
                  style={{
                    opacity: 1 - chineseName,
                    whiteSpace: 'nowrap',
                    fontSize: 72,
                    lineHeight: 1.2,
                    transform: `translateY(${-14 * chineseName}px)`,
                  }}
                >
                  <span style={{color: v9Colors.yellow}}>L</span>arge{' '}
                  <span style={{color: v9Colors.yellow}}>L</span>anguage{' '}
                  <span style={{color: v9Colors.yellow}}>M</span>odel
                </div>
              </Layer>

              <Layer
                amount={chineseName}
                fromY={16}
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: 27,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'baseline',
                    whiteSpace: 'nowrap',
                    fontSize: 102 - 56 * dock,
                    lineHeight: 1,
                    color: abbreviationColor,
                    transform: `translate(${28 * dock}px, ${-98 * dock}px)`,
                    transformOrigin: 'center center',
                  }}
                >
                  <span>大</span>
                  <span
                    style={{
                      display: 'inline-block',
                      width: 204 * (1 - shortName),
                      overflow: 'hidden',
                      opacity: 1 - shortName,
                      filter: `blur(${shortName * 2.4}px)`,
                      transform: `scaleX(${1 - shortName * 0.72})`,
                      transformOrigin: 'center center',
                    }}
                  >
                    语言
                  </span>
                  <span>模型</span>
                </div>
              </Layer>
            </div>
          </div>
        ) : (
          <>
            <Layer amount={llm} fromScale={0.84}>
              <div style={{position: 'relative', display: 'inline-block', padding: '0 28px 22px'}}>
                <div style={{fontSize: 184, lineHeight: 1, letterSpacing: 8}}>LLM</div>
                <ChalkUnderline
                  width={410}
                  amount={llm}
                  color={v9Colors.magenta}
                  style={{position: 'absolute', left: 12, bottom: 0}}
                />
              </div>
            </Layer>

            <div style={{position: 'relative', height: 255, marginTop: 20}}>
              <Layer
                amount={fullName}
                fromY={16}
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: 0,
                }}
              >
                <div
                  style={{
                    opacity: namingDetailOpacity,
                    whiteSpace: 'nowrap',
                    fontSize: 58,
                    lineHeight: 1.2,
                  }}
                >
                  <span style={{color: v9Colors.yellow}}>L</span>arge{' '}
                  <span style={{color: v9Colors.yellow}}>L</span>anguage{' '}
                  <span style={{color: v9Colors.yellow}}>M</span>odel
                </div>
              </Layer>

              <Layer
                amount={chineseName}
                fromY={16}
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: 78,
                }}
              >
                <div
                  style={{
                    opacity: namingDetailOpacity,
                    whiteSpace: 'nowrap',
                    fontSize: 68,
                    lineHeight: 1,
                    color: v9Colors.magenta,
                  }}
                >
                  大语言模型
                </div>
              </Layer>

              <Layer
                amount={shortName}
                fromY={16}
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: 158 - dock * 104,
                }}
              >
                <div
                  style={{
                    whiteSpace: 'nowrap',
                    fontSize: 72,
                    lineHeight: 1,
                    color: v9Colors.green,
                  }}
                >
                  大模型
                </div>
              </Layer>
            </div>
          </>
        )}
      </div>

      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `translateY(${diagramOffsetY}px)`,
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 700,
            top: 280,
            opacity: diagramOpacity,
          }}
        >
        <RoughBox
          width={520}
          height={600}
          color={v9Colors.magenta}
          progress={modelFrame}
          strokeWidth={5}
          radius={24}
          seedKey="llm-central-model"
          style={{background: `rgba(29,32,35,${modelFrame * 0.36})`}}
        >
          <Layer
            amount={rules}
            fromY={18}
            style={{
              position: 'absolute',
              left: 30,
              right: 30,
              top: 330,
              textAlign: 'center',
            }}
          >
            <div style={{fontSize: 62, lineHeight: 1.1, color: v9Colors.yellow}}>
              学会复杂规律
            </div>
            <div style={{fontSize: 32, marginTop: 22, color: v9Colors.muted}}>
              语言 · 知识 · 内容之间
            </div>
          </Layer>
        </RoughBox>
        </div>

        <div style={{opacity: trainingOpacity}}>
        <Layer
          amount={trainingLabel}
          fromX={-18}
          style={{position: 'absolute', left: 110, top: 322, fontSize: 38, color: v9Colors.blue}}
        >
          ① 训练时
        </Layer>
        <div style={{position: 'absolute', left: 100, top: 385}}>
          <Box text="海量内容" amount={data} color={v9Colors.blue} width={420} height={165} fontSize={60} />
        </div>
        <Layer
          amount={data}
          style={{position: 'absolute', left: 100, top: 565, width: 420, textAlign: 'center', fontSize: 30, color: v9Colors.muted}}
        >
          语言 · 知识 · 内容
        </Layer>
        <HandArrow
          width={160}
          progress={trainingArrow}
          color={v9Colors.blue}
          bend={-4}
          style={{position: 'absolute', left: 530, top: 418}}
        />
        </div>

        <div style={{opacity: diagramOpacity}}>
        <Layer
          amount={usageLabel}
          fromX={-18}
          style={{position: 'absolute', left: 110, top: 640, fontSize: 38, color: v9Colors.green}}
        >
          ② 使用时
        </Layer>
        <div style={{position: 'absolute', left: 100, top: 700}}>
          <Box text="已有内容" amount={context} color={v9Colors.green} width={420} height={165} fontSize={60} />
        </div>
        <HandArrow
          width={160}
          progress={contextArrow}
          color={v9Colors.green}
          bend={4}
          style={{position: 'absolute', left: 530, top: 733}}
        />
        <HandArrow
          width={160}
          progress={outputArrow}
          color={v9Colors.magenta}
          bend={-4}
          style={{position: 'absolute', left: 1230, top: 733}}
        />
        <div style={{position: 'absolute', left: 1400, top: 700}}>
          <Box text="继续生成" amount={generate} color={v9Colors.green} width={420} height={165} fontSize={60} />
        </div>
        </div>
      </div>

      <Layer
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
          gap: 22,
        }}
      >
        <div style={{fontSize: 150, lineHeight: 0.8, color: v9Colors.magenta}}>？</div>
        <div style={{position: 'relative', fontSize: 116, lineHeight: 1.1, padding: '0 18px 25px'}}>
          它怎么做到的？
          <ChalkUnderline
            width={760}
            amount={question}
            color={v9Colors.green}
            style={{position: 'absolute', left: 8, bottom: -6}}
          />
        </div>
      </Layer>
    </Paper>
  );
};

const TokenizerScreenshot = ({
  src,
  amount,
  color,
  retreat,
  dock,
  side,
  dim = 0,
  enhancedDepth = false,
}: {
  src: string;
  amount: number;
  color: string;
  retreat: number;
  dock: number;
  side: 'left' | 'right';
  dim?: number;
  enhancedDepth?: boolean;
}) => {
  const finalScale = 0.75;
  const finalX = side === 'left' ? -475 : 475;
  const finalY = -62.5;
  const motionBlur =
    Math.sin(Math.PI * dock) * (enhancedDepth ? 0.9 : 0.65);
  const shadowY = (enhancedDepth ? 22 : 18) - (enhancedDepth ? 14 : 10) * retreat;
  const shadowBlur =
    (enhancedDepth ? 54 : 46) - (enhancedDepth ? 30 : 24) * retreat;
  const shadowAlpha =
    (enhancedDepth ? 0.38 : 0.34) - (enhancedDepth ? 0.2 : 0.16) * retreat;

  return (
    <div
      style={{
        position: 'absolute',
        left: 340,
        top: 205,
        width: 1240,
        height: 780,
        boxSizing: 'border-box',
        padding: 7,
        overflow: 'hidden',
        border: `3px solid ${color}`,
        borderRadius: 18,
        background: '#fff',
        boxShadow: `0 ${shadowY}px ${shadowBlur}px rgba(0,0,0,${shadowAlpha})`,
        opacity: amount * (1 - (enhancedDepth ? 0.64 : 0.58) * dim),
        filter: `blur(${motionBlur}px)`,
        transform: `translate3d(${finalX * dock}px, ${finalY * dock}px, 0) scale(${1 - (1 - finalScale) * retreat})`,
        transformOrigin: 'center center',
        willChange: 'transform, opacity, filter, box-shadow',
      }}
    >
      <Img
        src={staticFile(src)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          display: 'block',
          borderRadius: 10,
        }}
      />
    </div>
  );
};

export const SceneTokenizerMergedRevised = ({
  motionPreset = 'legacy',
}: {
  motionPreset?: 'legacy' | 'apple';
} = {}) => {
  const frame = useV9SceneFrame();
  const appleMotion = motionPreset === 'apple';
  const title = ease(frame, 0, 24);
  const chinese = ease(frame, 70, 24);
  const firstAppleDock = spring({
    frame: Math.max(0, frame - 230),
    fps: 30,
    durationInFrames: 15,
    durationRestThreshold: 0.0001,
    config: {mass: 1, stiffness: 170, damping: 26},
  });
  const firstRetreat = appleMotion
    ? firstAppleDock
    : easeInOut(frame, 230, 6);
  const firstDock = appleMotion ? firstAppleDock : easeInOut(frame, 233, 7);
  const mixed = ease(frame, 245, 24);
  const secondAppleDock = spring({
    frame: Math.max(0, frame - 310),
    fps: 30,
    durationInFrames: 15,
    durationRestThreshold: 0.0001,
    config: {mass: 1, stiffness: 170, damping: 26},
  });
  const secondRetreat = appleMotion
    ? secondAppleDock
    : easeInOut(frame, 310, 6);
  const secondDock = appleMotion
    ? secondAppleDock
    : easeInOut(frame, 313, 7);
  const secondFocus = mixed * (1 - secondDock);

  return (
    <Paper>
      <Title amount={title}>一个 Token 到底对应多少文字？</Title>

      <TokenizerScreenshot
        src="lesson1-v2/tokenizer-examples/chinese.png"
        amount={chinese}
        color={v9Colors.blue}
        retreat={firstRetreat}
        dock={firstDock}
        side="left"
        dim={secondFocus}
        enhancedDepth={appleMotion}
      />
      <TokenizerScreenshot
        src="lesson1-v2/tokenizer-examples/mixed.png"
        amount={mixed}
        color={v9Colors.green}
        retreat={secondRetreat}
        dock={secondDock}
        side="right"
        enhancedDepth={appleMotion}
      />
    </Paper>
  );
};

export const SceneFullChainRevised = () => {
  const frame = useV9SceneFrame();
  const nodes = [
    ['文字', v9Colors.ink],
    ['Tokenizer', v9Colors.green],
    ['Token / ID', v9Colors.blue],
    ['大模型', v9Colors.magenta],
    ['解码', v9Colors.green],
    ['回答', v9Colors.yellow],
  ] as const;

  return (
    <Paper>
      <Title amount={ease(frame, 0, 18)}>最后，把整个过程串起来</Title>
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 385,
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        {nodes.map(([text, color], index) => (
          <div key={text} style={{display: 'flex', alignItems: 'center', gap: 12}}>
            <Box
              text={text}
              amount={ease(frame, 34 + index * 38, 18)}
              color={color}
              width={220}
              height={145}
              fontSize={text === 'Tokenizer' || text === 'Token / ID' ? 38 : 48}
            />
            {index < nodes.length - 1 ? (
              <HandArrow
                width={72}
                progress={ease(frame, 52 + index * 38, 16)}
                color={v9Colors.blue}
                bend={index % 2 ? -2 : 2}
              />
            ) : null}
          </div>
        ))}
      </div>

      <BoxFinePrint>
        <Layer
          amount={ease(frame, 255, 22)}
          style={{position: 'absolute', left: 0, right: 0, top: 635, textAlign: 'center'}}
        >
          <div style={{fontSize: 50, color: v9Colors.muted}}>
            预测一个　→　接回去　→　再预测
          </div>
        </Layer>
      </BoxFinePrint>

      <Layer
        amount={ease(frame, 300, 24)}
        fromScale={0.92}
        style={{position: 'absolute', left: 0, right: 0, bottom: 115, textAlign: 'center'}}
      >
        <div style={{position: 'relative', display: 'inline-block', fontSize: 82}}>
          从输入文字到完整回答
          <ChalkUnderline
            width={820}
            amount={ease(frame, 300, 24)}
            color={v9Colors.green}
            style={{position: 'absolute', left: 0, bottom: -24}}
          />
        </div>
      </Layer>
    </Paper>
  );
};
