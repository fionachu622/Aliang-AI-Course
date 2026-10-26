import {Audio, interpolate, interpolateColors, spring, staticFile} from 'remotion';
import {Fragment} from 'react';
import {Lesson1ChalkboardRevised} from '../v14/Lesson1ChalkboardRevised';
import {SceneLlmActionsRevised} from '../v14/RevisedScenes';
import {SceneQuestion} from '../v9/Lesson1OpeningV9';
import {
  HandArrow,
  Layer,
  Paper,
  RoughBox,
  ease,
  useV9SceneFrame,
  v9Colors,
} from '../v9/VisualV9';
import {
  REVIEW_SCENE_TIMING_OVERRIDES,
  REVIEW_VOICEOVER_FILE,
} from './reviewVoiceoverTiming';

const SceneQuestionReview = ({pacingV2 = false}: {pacingV2?: boolean} = {}) => (
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
    usageExitStart={pacingV2 ? 236 : undefined}
    usageExitDuration={pacingV2 ? 2 : undefined}
  />
);

export const SceneQuestionReviewPacingV2 = () => (
  <SceneQuestionReview pacingV2 />
);

const SceneLlmActionsReview = ({pacingV2 = false}: {pacingV2?: boolean} = {}) => (
  <SceneLlmActionsRevised
    abbreviationMorph
    questionTop={pacingV2 ? 450 : undefined}
  />
);

export const SceneLlmActionsReviewPacingV2 = () => (
  <SceneLlmActionsReview pacingV2 />
);

const CodecNode = ({
  label,
  color,
  amount,
  left,
  top,
  width = 280,
  sublabel,
}: {
  label: string;
  color: string;
  amount: number;
  left: number;
  top: number;
  width?: number;
  sublabel?: string;
}) => (
  <Layer
    amount={amount}
    fromY={12}
    fromScale={0.96}
    style={{position: 'absolute', left, top}}
  >
    <RoughBox
      width={width}
      height={132}
      color={color}
      progress={amount}
      seedKey={`encode-decode-review-${label}-${top}`}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 7,
          color,
          textAlign: 'center',
          whiteSpace: 'nowrap',
        }}
      >
        <div style={{fontSize: label === 'Token ID' ? 48 : 52, lineHeight: 1}}>
          {label}
        </div>
        {sublabel ? (
          <div style={{fontSize: 27, color: v9Colors.muted, lineHeight: 1}}>
            {sublabel}
          </div>
        ) : null}
      </div>
    </RoughBox>
  </Layer>
);

const CodecState = ({
  label,
  color,
  amount,
  left,
}: {
  label: string;
  color: string;
  amount: number;
  left: number;
}) => (
  <Layer
    amount={amount}
    fromY={7}
    fromScale={0.96}
    style={{position: 'absolute', left, top: 108}}
  >
    <RoughBox
      width={230}
      height={82}
      color={color}
      progress={amount}
      seedKey={`codec-process-state-${label}-${left}`}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color,
          fontSize: label === 'Token ID' ? 42 : 46,
          lineHeight: 1,
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </div>
    </RoughBox>
  </Layer>
);

const CodecProcess = ({
  label,
  color,
  amount,
  left,
  top,
  direction,
  tokenAmount,
  idAmount,
  arrowAmount,
  labelAmount = amount,
}: {
  label: string;
  color: string;
  amount: number;
  left: number;
  top: number;
  direction: 'right' | 'left';
  tokenAmount: number;
  idAmount: number;
  arrowAmount: number;
  labelAmount?: number;
}) => (
  <Layer
    amount={amount}
    fromY={10}
    fromScale={0.98}
    style={{position: 'absolute', left, top}}
  >
    <RoughBox
      width={730}
      height={230}
      color={color}
      progress={amount}
      seedKey={`codec-process-${label}`}
    >
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 24,
          color,
          fontSize: 42,
          lineHeight: 1,
          textAlign: 'center',
          letterSpacing: 1,
          opacity: labelAmount,
        }}
      >
        {label}
      </div>

      <CodecState label="Token" color={v9Colors.green} amount={tokenAmount} left={65} />
      <div
        style={{
          position: 'absolute',
          left: 310,
          top: 115,
          transform: direction === 'left' ? 'rotate(180deg)' : undefined,
        }}
      >
        <HandArrow width={110} progress={arrowAmount} color={color} bend={direction === 'right' ? 2 : -2} />
      </div>
      <CodecState label="Token ID" color={v9Colors.blue} amount={idAmount} left={435} />
    </RoughBox>
  </Layer>
);

const SceneEncodeDecodeReview = () => {
  const frame = useV9SceneFrame();
  const title = ease(frame, 0, 18);
  const inputText = ease(frame, 24, 16);
  const encodeProcess = ease(frame, 43, 15);
  const inputToken = ease(frame, 58, 16);
  const encodeArrowTwo = ease(frame, 77, 15);
  const inputId = ease(frame, 92, 16);
  const encodeLabel = ease(frame, 170, 12);
  const modelArrow = ease(frame, 145, 16);
  const model = ease(frame, 160, 18);
  const generatedId = ease(frame, 188, 16);
  const outputToken = ease(frame, 218, 16);
  const decodeLabel = ease(frame, 242, 12);
  const finalAnswer = ease(frame, 270, 16);

  return (
    <Paper>
      <Layer
        amount={title}
        fromY={-12}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 54,
          color: v9Colors.ink,
          fontSize: 70,
          textAlign: 'center',
          letterSpacing: 3,
        }}
      >
        文字，怎样进入模型计算？
      </Layer>

      <CodecNode label="输入文字" color={v9Colors.ink} amount={inputText} left={100} top={284} width={270} />
      <div style={{position: 'absolute', left: 370, top: 300}}>
        <HandArrow width={130} progress={encodeProcess} color={v9Colors.yellow} bend={2} />
      </div>
      <CodecProcess
        label="Encoding · 编码"
        color={v9Colors.yellow}
        amount={encodeProcess}
        left={500}
        top={235}
        direction="right"
        tokenAmount={inputToken}
        idAmount={inputId}
        arrowAmount={encodeArrowTwo}
        labelAmount={encodeLabel}
      />

      <div style={{position: 'absolute', left: 1230, top: 300}}>
        <HandArrow width={170} progress={modelArrow} color={v9Colors.blue} bend={2} />
      </div>

      <Layer
        amount={model}
        fromX={12}
        fromY={0}
        fromScale={0.97}
        style={{position: 'absolute', left: 1400, top: 235}}
      >
        <RoughBox
          width={360}
          height={585}
          color={v9Colors.magenta}
          progress={model}
          seedKey="encode-decode-review-model"
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: v9Colors.magenta,
            }}
          >
            <div style={{fontSize: 58, lineHeight: 1}}>大模型</div>
            <svg width={76} height={112} viewBox="0 0 76 112" style={{margin: '22px 0 14px'}}>
              <path
                d="M 38 5 C 35 31 42 53 38 82"
                fill="none"
                stroke={v9Colors.blue}
                strokeWidth={4}
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - ease(frame, 172, 18)}
              />
              <path
                d="M 24 73 L 38 91 L 53 72"
                fill="none"
                stroke={v9Colors.blue}
                strokeWidth={4}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={ease(frame, 184, 8)}
              />
            </svg>
            <div style={{fontSize: 37, lineHeight: 1}}>计算 · 生成</div>
          </div>
        </RoughBox>
      </Layer>

      <div style={{position: 'absolute', left: 1230, top: 655, transform: 'rotate(180deg)'}}>
        <HandArrow width={170} progress={generatedId} color={v9Colors.blue} bend={-2} />
      </div>
      <CodecProcess
        label="Decoding · 解码"
        color={v9Colors.green}
        amount={generatedId}
        left={500}
        top={590}
        direction="left"
        tokenAmount={outputToken}
        idAmount={generatedId}
        arrowAmount={outputToken}
        labelAmount={decodeLabel}
      />
      <div style={{position: 'absolute', left: 370, top: 655, transform: 'rotate(180deg)'}}>
        <HandArrow width={130} progress={finalAnswer} color={v9Colors.green} bend={-2} />
      </div>
      <CodecNode label="最终回答" color={v9Colors.ink} amount={finalAnswer} left={100} top={639} width={270} />
    </Paper>
  );
};

const ImpactCard = ({
  title,
  body,
  detail,
  color,
  amount,
  bodyAmount,
  detailAmount,
  left,
}: {
  title: string;
  body: string;
  detail: string;
  color: string;
  amount: number;
  bodyAmount: number;
  detailAmount: number;
  left: number;
}) => (
  <Layer
    amount={amount}
    fromY={26}
    fromScale={0.98}
    style={{position: 'absolute', left, top: 285}}
  >
    <RoughBox
      width={490}
      height={500}
      color={color}
      progress={amount}
      seedKey={`token-impact-review-${title}`}
    >
      <div
        style={{
          position: 'absolute',
          left: 48,
          right: 48,
          top: 43,
          height: 112,
          borderRadius: 20,
          backgroundColor: color,
          opacity: 0.18,
          transform: 'rotate(-0.6deg)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 35,
          right: 35,
          top: 66,
          color: v9Colors.ink,
          fontSize: 70,
          lineHeight: 1,
          textAlign: 'center',
          whiteSpace: 'nowrap',
        }}
      >
        {title}
      </div>
      <Layer
        amount={bodyAmount}
        fromY={10}
        style={{
          position: 'absolute',
          left: 25,
          right: 25,
          top: 218,
          color: v9Colors.ink,
          fontSize: 48,
          lineHeight: 1.2,
          textAlign: 'center',
          whiteSpace: 'nowrap',
        }}
      >
        {body}
      </Layer>
      <Layer
        amount={detailAmount}
        fromY={10}
        style={{
          position: 'absolute',
          left: 25,
          right: 25,
          top: 350,
          color,
          fontSize: 37,
          lineHeight: 1.2,
          textAlign: 'center',
          whiteSpace: 'nowrap',
        }}
      >
        {detail}
      </Layer>
    </RoughBox>
  </Layer>
);

const SceneTokenImpactReview = ({
  pacingV2 = false,
  sequentialCards = false,
  showBillingSummary = true,
}: {
  pacingV2?: boolean;
  sequentialCards?: boolean;
  showBillingSummary?: boolean;
} = {}) => {
  const frame = useV9SceneFrame();
  const showCardsEarly = pacingV2 && !sequentialCards;
  const title = ease(frame, 0, 18);
  const contextCard = ease(frame, showCardsEarly ? 8 : 34, 20);
  const contextBody = ease(frame, 52, 16);
  const contextDetail = ease(frame, 74, 16);
  const outputCard = ease(frame, showCardsEarly ? 12 : 106, 20);
  const outputBody = ease(frame, 124, 16);
  const outputDetail = ease(frame, 146, 16);
  const costCard = ease(frame, showCardsEarly ? 16 : 176, 20);
  const costBody = ease(frame, 194, 16);
  const costDetail = ease(frame, 216, 16);
  const inputUsage = ease(frame, 238, 12);
  const outputUsage = ease(frame, 254, 12);
  const billing = ease(frame, 270, 12);

  return (
    <Paper>
      <Layer
        amount={title}
        fromY={-14}
        style={{
          position: 'absolute',
          left: 120,
          right: 120,
          top: 62,
          color: v9Colors.ink,
          fontSize: 76,
          lineHeight: 1.1,
          textAlign: 'center',
          letterSpacing: 2,
        }}
      >
        普通用户，为什么也要懂 Token？
      </Layer>

      <ImpactCard
        title="上下文长度"
        body="一次能处理多少"
        detail="128K / 1M Token"
        color={v9Colors.blue}
        amount={contextCard}
        bodyAmount={contextBody}
        detailAmount={contextDetail}
        left={165}
      />

      <ImpactCard
        title="输出长度"
        body="一次能生成多少"
        detail="最大输出 Token 数"
        color={v9Colors.green}
        amount={outputCard}
        bodyAmount={outputBody}
        detailAmount={outputDetail}
        left={715}
      />

      <ImpactCard
        title="使用成本"
        body="输入 + 输出 Token"
        detail="每百万 Token 计费"
        color={v9Colors.magenta}
        amount={costCard}
        bodyAmount={costBody}
        detailAmount={costDetail}
        left={1265}
      />

      {pacingV2 && showBillingSummary ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 855,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 24,
            fontSize: 42,
            lineHeight: 1,
          }}
        >
          <Layer amount={inputUsage} fromY={8} style={{color: v9Colors.blue}}>
            输入 Token
          </Layer>
          <Layer amount={outputUsage} fromY={8} style={{color: v9Colors.ink}}>
            ＋
          </Layer>
          <Layer amount={outputUsage} fromY={8} style={{color: v9Colors.green}}>
            输出 Token
          </Layer>
          <Layer amount={billing} fromX={-8} style={{color: v9Colors.ink}}>
            →
          </Layer>
          <Layer amount={billing} fromY={8} style={{color: v9Colors.yellow}}>
            统计用量并计算费用
          </Layer>
        </div>
      ) : null}
    </Paper>
  );
};

export const SceneTokenImpactReviewPacingV2 = () => (
  <SceneTokenImpactReview pacingV2 />
);

export const SceneTokenImpactReviewPacingV2SequentialCards = () => (
  <SceneTokenImpactReview pacingV2 sequentialCards />
);

export const SceneTokenImpactReviewPacingV2SequentialCardsNoSummary = () => (
  <SceneTokenImpactReview
    pacingV2
    sequentialCards
    showBillingSummary={false}
  />
);

type ProductFeatureKind = 'chat' | 'file' | 'search' | 'voice';

const PRODUCT_FEATURES: readonly {
  kind: ProductFeatureKind;
  label: string;
  start: number;
  position: {x: number; y: number};
  rotation: number;
}[] = [
  {
    kind: 'chat',
    label: '聊天窗口',
    start: 42,
    position: {x: 132, y: 252},
    rotation: -2,
  },
  {
    kind: 'file',
    label: '文件上传',
    start: 72,
    position: {x: 272, y: 512},
    rotation: 1.5,
  },
  {
    kind: 'search',
    label: '联网搜索',
    start: 102,
    position: {x: 1028, y: 512},
    rotation: -1.5,
  },
  {
    kind: 'voice',
    label: '语音对话',
    start: 132,
    position: {x: 1168, y: 252},
    rotation: 2,
  },
] as const;

const svgStroke = (color: string, amount: number) => ({
  fill: 'none',
  stroke: color,
  strokeWidth: 6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  pathLength: 1,
  strokeDasharray: 1,
  strokeDashoffset: 1 - amount,
});

const ProductFeatureIcon = ({
  kind,
  color,
  amount,
}: {
  kind: ProductFeatureKind;
  color: string;
  amount: number;
}) => {
  const stroke = svgStroke(color, amount);

  return (
    <svg width={132} height={132} viewBox="0 0 132 132">
      {kind === 'chat' ? (
        <>
          <path
            d="M 15 18 Q 15 10 24 10 H 92 Q 103 10 103 20 V 67 Q 103 77 92 77 H 48 L 27 93 L 30 77 H 24 Q 15 77 15 68 Z"
            {...stroke}
          />
          <path d="M 33 34 H 82 M 33 51 H 69" {...stroke} opacity={0.72} />
        </>
      ) : null}

      {kind === 'file' ? (
        <>
          <path d="M 33 10 H 78 L 104 36 V 119 H 33 Z" {...stroke} />
          <path d="M 78 10 V 36 H 104" {...stroke} />
          <path d="M 49 58 H 88 M 49 76 H 88 M 49 94 H 76" {...stroke} opacity={0.72} />
        </>
      ) : null}

      {kind === 'search' ? (
        <>
          <circle cx="55" cy="53" r="36" {...stroke} />
          <path d="M 81 79 L 116 115" {...stroke} />
          <path d="M 41 43 Q 53 32 67 39" {...stroke} strokeWidth={4} opacity={0.55} />
        </>
      ) : null}

      {kind === 'voice' ? (
        <>
          <rect x="45" y="10" width="42" height="75" rx="21" {...stroke} />
          <path d="M 27 62 Q 27 101 66 101 Q 105 101 105 62" {...stroke} />
          <path d="M 66 101 V 121 M 45 121 H 87" {...stroke} />
          <path d="M 17 42 Q 9 58 17 74 M 115 42 Q 123 58 115 74" {...stroke} strokeWidth={4} opacity={0.58} />
        </>
      ) : null}
    </svg>
  );
};

const ProductFeature = ({
  feature,
  amount,
  dimAmount,
  recovery,
}: {
  feature: (typeof PRODUCT_FEATURES)[number];
  amount: number;
  dimAmount: number;
  recovery: number;
}) => {
  const opacity = 1 - dimAmount * 0.62 + recovery * 0.62;
  const scale = 0.9 + amount * 0.1;

  return (
    <div
      style={{
        position: 'absolute',
        left: feature.position.x,
        top: feature.position.y,
        width: 180,
        height: 190,
        opacity,
        visibility: amount > 0 ? 'visible' : 'hidden',
        textAlign: 'center',
        transform: `translateY(${(1 - amount) * 24}px) scale(${scale}) rotate(${feature.rotation}deg)`,
        transformOrigin: 'center center',
        zIndex: 3,
      }}
    >
      <div style={{height: 132, display: 'flex', justifyContent: 'center'}}>
        <ProductFeatureIcon
          kind={feature.kind}
          color={v9Colors.ink}
          amount={amount}
        />
      </div>
      <div
        style={{
          marginTop: feature.kind === 'chat' ? 12 : 4,
          marginLeft: -30,
          width: 240,
          color: v9Colors.ink,
          fontSize: 44,
          lineHeight: 1,
          whiteSpace: 'nowrap',
        }}
      >
        {feature.label}
      </div>
    </div>
  );
};

const CoreConnections = ({
  progresses,
}: {
  progresses: readonly number[];
}) => {
  const paths = [
    'M 512 359 C 440 318 352 300 222 323',
    'M 536 474 C 486 530 430 570 362 583',
    'M 944 474 C 994 530 1050 570 1118 583',
    'M 968 359 C 1040 318 1128 300 1258 323',
  ] as const;

  return (
    <svg
      width={1480}
      height={760}
      viewBox="0 0 1480 760"
      style={{position: 'absolute', inset: 0, zIndex: 1, overflow: 'visible'}}
    >
      {paths.map((path, index) => (
        <g key={path}>
          <path
            d={path}
            fill="none"
            stroke={v9Colors.green}
            strokeWidth={4}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - progresses[index]}
            opacity={0.62}
          />
          <path
            d={path}
            fill="none"
            stroke={v9Colors.ink}
            strokeWidth={1.5}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - progresses[index]}
            opacity={0.14}
            transform={`translate(${index % 2 === 0 ? 2 : -2} ${index < 2 ? 2 : -2})`}
          />
        </g>
      ))}
    </svg>
  );
};

const CoreLabel = ({
  textAmount,
  coatingAmount,
}: {
  textAmount: number;
  coatingAmount: number;
}) => (
  <div
    style={{
      position: 'absolute',
      left: 460,
      top: 278,
      width: 560,
      height: 220,
      zIndex: 2,
    }}
  >
    <div
      style={{
        position: 'absolute',
        left: 30,
        top: 30,
        width: coatingAmount * 500,
        height: 166,
        overflow: 'hidden',
      }}
    >
      <svg width={500} height={166} viewBox="0 0 500 166">
        <path
          d="M 14 24 C 100 7 191 17 271 11 C 354 5 434 11 486 23 L 477 145 C 386 157 299 143 210 153 C 129 162 58 153 20 139 Z"
          fill="rgba(164,212,134,.3)"
        />
        <path
          d="M 34 42 C 127 25 205 35 291 27 C 370 19 432 27 468 40 L 461 127 C 375 139 298 128 216 137 C 139 147 73 140 39 128 Z"
          fill="rgba(164,212,134,.09)"
        />
        <path
          d="M 52 61 C 132 48 205 58 269 51 M 315 42 C 370 37 419 43 452 54 M 70 112 C 151 126 238 106 302 114 M 347 101 C 394 96 430 103 454 113"
          fill="none"
          stroke="rgba(29,32,35,.2)"
          strokeWidth={10}
          strokeLinecap="round"
        />
      </svg>
    </div>

    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 50,
        textAlign: 'center',
        color: v9Colors.ink,
        fontSize: 148,
        lineHeight: 1,
        letterSpacing: 2,
        opacity: textAmount,
        textShadow: '2px 3px 0 rgba(29,32,35,.24), 0 0 16px rgba(29,32,35,.3)',
      }}
    >
      大模型
    </div>
  </div>
);

const SceneProductModelReview = ({
  pacingV2 = false,
  featureLeadFrames = {},
}: {
  pacingV2?: boolean;
  featureLeadFrames?: Partial<Record<ProductFeatureKind, number>>;
} = {}) => {
  const frame = useV9SceneFrame();
  const product = ease(frame, 0, 20);
  const brandIntro = pacingV2
    ? ease(frame, 10, 12) * (1 - ease(frame, 36, 10))
    : 0;
  const modelText = ease(frame, 174, 12);
  const featureDim = ease(frame, 174, 8);
  const coatingReveal = ease(frame, 204, 14);
  const connectionReveal = interpolate(frame, [222, 230], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const featureRecovery = frame >= 230 ? 1 : 0;
  const connectionProgresses = [
    connectionReveal,
    connectionReveal,
    connectionReveal,
    connectionReveal,
  ] as const;

  return (
    <Paper>
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: 1480,
          height: 760,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 30,
            textAlign: 'center',
            fontSize: 118,
            lineHeight: 1,
            color: v9Colors.ink,
            letterSpacing: 8,
            opacity: product,
            transform: `translateY(${(1 - product) * 24}px)`,
            transformOrigin: 'center top',
            zIndex: 4,
          }}
        >
          AI 产品
        </div>

        <svg
          width={230}
          height={20}
          viewBox="0 0 230 20"
          style={{
            position: 'absolute',
            left: '50%',
            top: 166,
            transform: 'translateX(-50%)',
            zIndex: 4,
            overflow: 'visible',
          }}
        >
          <path
            d="M 10 7 C 62 11 126 4 220 8"
            fill="none"
            stroke={v9Colors.ink}
            strokeWidth={3}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - product}
            opacity={0.3}
          />
          <path
            d="M 18 13 C 78 8 145 15 212 11"
            fill="none"
            stroke={v9Colors.ink}
            strokeWidth={1.4}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - product}
            opacity={0.13}
          />
        </svg>

        {pacingV2 ? (
          <Layer
            amount={brandIntro}
            fromY={8}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 192,
              zIndex: 4,
              display: 'flex',
              justifyContent: 'center',
              gap: 44,
              color: v9Colors.muted,
              fontSize: 35,
              letterSpacing: 1,
            }}
          >
            <span>ChatGPT</span>
            <span>DeepSeek</span>
            <span>豆包</span>
          </Layer>
        ) : null}

        <CoreConnections progresses={connectionProgresses} />
        <CoreLabel textAmount={modelText} coatingAmount={coatingReveal} />

        {PRODUCT_FEATURES.map((feature) => {
          const featureStart =
            feature.start - (featureLeadFrames[feature.kind] ?? 0);

          return (
            <ProductFeature
              key={feature.kind}
              feature={feature}
              amount={ease(frame, featureStart, 18)}
              dimAmount={featureDim}
              recovery={featureRecovery}
            />
          );
        })}
      </div>
    </Paper>
  );
};

export const SceneProductModelReviewPacingV2 = () => (
  <SceneProductModelReview pacingV2 />
);

export const SceneProductModelReviewPacingV2VoiceSynced = () => (
  <SceneProductModelReview
    pacingV2
    featureLeadFrames={{file: 4, search: 10, voice: 12}}
  />
);

const cubicMotionValue = (
  progress: number,
  start: number,
  control1: number,
  control2: number,
  end: number,
) => {
  const remaining = 1 - progress;
  return (
    remaining ** 3 * start +
    3 * remaining ** 2 * progress * control1 +
    3 * remaining * progress ** 2 * control2 +
    progress ** 3 * end
  );
};

const ExampleSentence = ({
  amount,
  answerAmount,
  moveAnswer = false,
  opacity = 1,
  ellipsisDots = 6,
}: {
  amount: number;
  answerAmount: number;
  moveAnswer?: boolean;
  opacity?: number;
  ellipsisDots?: number;
}) => {
  const landing = ease(answerAmount, 0.84, 0.16);
  const motionProgress = Math.max(0, Math.min(1, answerAmount));
  const motionX = cubicMotionValue(
    motionProgress,
    -980,
    -920,
    -320,
    0,
  );
  const motionY = cubicMotionValue(motionProgress, 230, 150, 22, 0);
  const motionScale = interpolate(motionProgress, [0, 1], [0.75, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <Layer
    amount={amount}
    fromY={-16}
    motionVisibility={opacity}
    style={{
      position: 'absolute',
      left: 0,
      right: 0,
      top: 108,
      height: 130,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'baseline',
      color: v9Colors.ink,
      fontSize: 76,
      lineHeight: 1,
      letterSpacing: 1,
      whiteSpace: 'nowrap',
      opacity: amount * opacity,
    }}
  >
    <span>手机只剩 1% 的电，我赶紧找</span>
    <span
      style={{
        position: 'relative',
        display: 'inline-block',
        width: 342,
      }}
    >
      <span style={{visibility: 'hidden'}}>......</span>
      <span
        style={{
          position: 'absolute',
          left: 10,
          top: 0,
          color: v9Colors.yellow,
          opacity: 1 - landing,
        }}
      >
        {'.'.repeat(ellipsisDots)}
      </span>
      <span
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          color: v9Colors.green,
          opacity: answerAmount,
          transform: moveAnswer
            ? `translate(${motionX}px, ${motionY}px) scale(${motionScale})`
            : undefined,
          transformOrigin: 'left center',
          willChange: moveAnswer ? 'transform, opacity' : undefined,
        }}
      >
        充电器
      </span>
      <span
        style={{
          position: 'absolute',
          left: 225,
          top: 0,
          color: v9Colors.yellow,
          opacity: landing,
        }}
      >
        {'.'.repeat(ellipsisDots)}
      </span>
      </span>
    </Layer>
  );
};

const PREDICTION_CANDIDATES = [
  {label: '充电器', value: 1, color: v9Colors.green},
  {label: '充电宝', value: 0.82, color: v9Colors.blue},
  {label: '插座', value: 0.52, color: v9Colors.coral},
  {label: '遥控器', value: 0.16, color: v9Colors.magenta},
] as const;

const loopingEllipsisDots = (frame: number, start: number) => {
  if (frame < start) return 1;

  const cycleFrame = (frame - start) % 24;
  return Math.min(6, Math.floor(cycleFrame / 3) + 1);
};

const ScenePredictNextReview = () => {
  const frame = useV9SceneFrame();
  const sentence = ease(frame, 4, 20);
  const selection = ease(frame, 176, 20);
  const appendSpring = spring({
    frame: Math.max(0, frame - 212),
    fps: 30,
    durationInFrames: 14,
    durationRestThreshold: 0.0001,
    config: {
      mass: 1,
      stiffness: 170,
      damping: 26,
    },
  });
  const append = frame >= 226 ? 1 : appendSpring;
  const chartExit = ease(frame, 218, 20);

  return (
    <Paper>
      <ExampleSentence
        amount={sentence}
        answerAmount={append}
        moveAnswer
        ellipsisDots={loopingEllipsisDots(frame, 0)}
      />

      <div
        style={{
          position: 'absolute',
          left: 350,
          top: 340,
          width: 820,
          display: 'grid',
          gap: 48,
          opacity: 1 - chartExit,
        }}
      >
        {PREDICTION_CANDIDATES.map((candidate, index) => {
          const candidateAmount = ease(frame, 48 + index * 20, 16);
          const isSelected = index === 0;
          const deEmphasis = isSelected ? 1 : 1 - selection * 0.72;
          const selectedLabelOpacity = isSelected ? 1 - append : 1;

          return (
            <Layer
              key={candidate.label}
              amount={candidateAmount}
              fromX={-24}
              motionVisibility={deEmphasis * selectedLabelOpacity}
              style={{
                display: 'grid',
                gridTemplateColumns: '220px 1fr',
                alignItems: 'center',
                gap: 34,
                opacity:
                  candidateAmount * deEmphasis * selectedLabelOpacity,
              }}
            >
              <div
                style={{
                  color: candidate.color,
                  fontSize: 54,
                  transform: `scale(${1 + (isSelected ? selection * 0.06 : 0)})`,
                  transformOrigin: 'left center',
                }}
              >
                {candidate.label}
              </div>
              <div style={{position: 'relative', height: 22}}>
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 7,
                    width: `${candidate.value * candidateAmount * 100}%`,
                    height: isSelected ? 9 + selection * 4 : 8,
                    borderRadius: '48% 52% 44% 56%',
                    background: candidate.color,
                    opacity: 0.78 + (isSelected ? selection * 0.22 : 0),
                    transform: `rotate(${index % 2 ? 0.35 : -0.3}deg)`,
                    transformOrigin: 'left center',
                  }}
                />
              </div>
            </Layer>
          );
        })}
      </div>
    </Paper>
  );
};

const ProcessBox = ({
  label,
  color,
  amount,
  left,
  top = 330,
  width = 300,
  fontSize = 46,
  emphasis = 0,
}: {
  label: string;
  color: string;
  amount: number;
  left: number;
  top?: number;
  width?: number;
  fontSize?: number;
  emphasis?: number;
}) => (
  <Layer
    amount={amount}
    fromY={14}
    fromScale={0.96}
    style={{
      position: 'absolute',
      left,
      top,
    }}
  >
    <RoughBox
      width={width}
      height={120}
      color={color}
      progress={amount}
      strokeWidth={4}
      radius={14}
      seedKey={`generation-process-${label}`}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color,
          fontSize,
          lineHeight: 1,
          whiteSpace: 'nowrap',
          transform: `scale(${1 + emphasis * 0.05})`,
          transformOrigin: 'center center',
          textShadow: emphasis > 0 ? `0 0 ${14 * emphasis}px ${color}` : undefined,
        }}
      >
        {label}
      </div>
    </RoughBox>
  </Layer>
);

const SceneGenerationLoopReview = () => {
  const frame = useV9SceneFrame();
  const currentContent = ease(frame, 8, 16);
  const firstArrow = ease(frame, 28, 12);
  const predict = ease(frame, 42, 16);
  const secondArrow = ease(frame, 62, 12);
  const generate = ease(frame, 76, 18);
  const thirdArrow = ease(frame, 98, 12);
  const append = ease(frame, 112, 18);
  const loop = ease(frame, 140, 30);
  const loopArrow = ease(frame, 170, 8);
  const repeatPulse = ease(frame, 178, 8) * (1 - ease(frame, 188, 8));
  const analogy = ease(frame, 188, 20);
  const textErase = ease(frame, 258, 10);
  const tokenWrite = ease(frame, 268, 14);
  const tokenSlotWidth = 190 + tokenWrite * 95;
  const processOpacity = 1 - analogy * 0.44;

  return (
    <Paper>
      <ExampleSentence
        amount={1}
        answerAmount={1}
        opacity={1 - analogy * 0.38}
        ellipsisDots={loopingEllipsisDots(frame, 0)}
      />

      <div style={{opacity: processOpacity}}>
        <ProcessBox
          label="已有内容"
          color={v9Colors.ink}
          amount={currentContent}
          left={135}
          width={300}
          emphasis={repeatPulse}
        />
        <ProcessBox
          label="预测下一个"
          color={v9Colors.blue}
          amount={predict}
          left={585}
          width={300}
        />
        <ProcessBox
          label="生成一个"
          color={v9Colors.green}
          amount={generate}
          left={1035}
          width={330}
        />
        <ProcessBox
          label="接回后面"
          color={v9Colors.magenta}
          amount={append}
          left={1515}
          width={270}
        />

        <svg
          width={1920}
          height={620}
          viewBox="0 0 1920 620"
          style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}
        >
          <path
            d="M 435 390 C 485 384 530 384 580 390"
            fill="none"
            stroke={v9Colors.blue}
            strokeWidth={4}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - firstArrow}
          />
          <path
            d="M 558 376 L 584 390 L 559 406"
            fill="none"
            stroke={v9Colors.blue}
            strokeWidth={4}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={firstArrow}
          />
          <path
            d="M 885 390 C 935 384 980 384 1030 390"
            fill="none"
            stroke={v9Colors.blue}
            strokeWidth={4}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - secondArrow}
          />
          <path
            d="M 1008 376 L 1034 390 L 1009 406"
            fill="none"
            stroke={v9Colors.blue}
            strokeWidth={4}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={secondArrow}
          />
          <path
            d="M 1365 390 C 1415 384 1460 384 1510 390"
            fill="none"
            stroke={v9Colors.blue}
            strokeWidth={4}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - thirdArrow}
          />
          <path
            d="M 1488 376 L 1514 390 L 1489 406"
            fill="none"
            stroke={v9Colors.blue}
            strokeWidth={4}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={thirdArrow}
          />
          <path
            d="M 1650 450 C 1650 565 285 565 285 444"
            fill="none"
            stroke={v9Colors.blue}
            strokeWidth={4}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - loop}
          />
          <path
            d="M 1647 452 C 1644 560 292 570 285 444"
            fill="none"
            stroke={v9Colors.blue}
            strokeWidth={1.3}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - loop}
            opacity={0.26}
          />
          <path
            d="M 285 444 C 281 451 277 459 271 466"
            fill="none"
            stroke={v9Colors.blue}
            strokeWidth={4}
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - loopArrow}
          />
          <path
            d="M 285 444 C 290 451 296 459 302 466"
            fill="none"
            stroke={v9Colors.blue}
            strokeWidth={4}
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - loopArrow}
          />
        </svg>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 675,
          height: 145,
          textAlign: 'center',
        }}
      >
        <Layer amount={analogy} fromY={12}>
          <div
            style={{
              position: 'relative',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: v9Colors.ink,
              fontSize: 86,
              lineHeight: 1,
              letterSpacing: 3,
            }}
          >
            <span
              style={{
                position: 'relative',
                display: 'inline-block',
                width: 370,
                height: 100,
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 0,
                  bottom: 0,
                  width: tokenSlotWidth,
                  height: 100,
                  overflow: 'hidden',
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    color: v9Colors.ink,
                    clipPath: `inset(0 0 0 ${textErase * 100}%)`,
                    opacity: 1 - textErase * 0.45,
                  }}
                >
                  文字
                </span>
                <span
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    color: v9Colors.blue,
                    clipPath: `inset(0 ${(1 - tokenWrite) * 100}% 0 0)`,
                    opacity: tokenWrite,
                  }}
                >
                  Token
                </span>
              </span>
              <span
                style={{
                  position: 'absolute',
                  right: 208,
                  top: 0,
                  height: 100,
                  display: 'flex',
                  alignItems: 'center',
                  color: v9Colors.yellow,
                }}
              >
                「
              </span>
            </span>
            <span>接龙</span>
            <span
              style={{
                color: v9Colors.yellow,
                marginLeft: 2,
                marginRight: 20,
              }}
            >
              」
            </span>
            <span>游戏</span>
          </div>
        </Layer>
      </div>
    </Paper>
  );
};

const STREAMING_PARTS = ['手机', '只剩', ' 1% ', '的电了，', '我', '赶紧', '找', '充电器'] as const;
const MODEL_LOOP_PULSES = [38, 52, 66] as const;
const STREAMING_ARRIVALS = [120, 136, 152, 168, 184, 200, 216, 228] as const;

const pulseAt = (frame: number, center: number) =>
  ease(frame, center - 5, 5) * (1 - ease(frame, center + 3, 6));

const SceneStreamingReview = ({
  pacingV2 = false,
  showProcessHighlights = true,
}: {
  pacingV2?: boolean;
  showProcessHighlights?: boolean;
} = {}) => {
  const frame = useV9SceneFrame();
  const reframe = ease(frame, 8, 22);
  const question = ease(frame, 18, 18);
  const shell = ease(frame, 88, 18);
  const productLink = ease(frame, 104, 16);
  const takeaway = ease(frame, 238, 12);
  const priorOpacity = 1 - reframe;
  const diagramOpacity = 0.56 + reframe * 0.44;
  const combinePulses = (offset: number) => {
    if (!showProcessHighlights) return 0;
    const pulses = MODEL_LOOP_PULSES.map((arrival) =>
      pulseAt(frame, arrival + offset),
    );
    return pacingV2 ? Math.max(0, ...pulses) : Math.min(1, ...pulses);
  };
  const predictPulse = combinePulses(0);
  const generatePulse = combinePulses(4);
  const appendPulse = combinePulses(8);
  const contextPulse = combinePulses(12);
  const cursorOpacity = shell * (Math.floor(frame / 8) % 2 === 0 ? 1 : 0.28);

  return (
    <Paper>
      <ExampleSentence
        amount={1}
        answerAmount={1}
        opacity={0.62 * priorOpacity}
        ellipsisDots={3}
      />

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 675,
          textAlign: 'center',
          fontSize: 86,
          lineHeight: 1,
          letterSpacing: 3,
          opacity: priorOpacity,
        }}
      >
        <span style={{color: v9Colors.yellow, marginRight: 18}}>「</span>
        <span style={{color: v9Colors.blue}}>Token</span>
        <span>接龙</span>
        <span style={{color: v9Colors.yellow, marginRight: 20}}>」</span>
        <span>游戏</span>
      </div>

      <Layer
        amount={question}
        fromY={-12}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 58,
          textAlign: 'center',
          fontSize: 68,
          color: v9Colors.ink,
          letterSpacing: 3,
        }}
      >
        为什么回答会一点一点出现？
      </Layer>

      <Layer
        amount={reframe}
        fromX={-12}
        style={{
          position: 'absolute',
          left: 10,
          top: 248,
          width: 230,
          textAlign: 'right',
          whiteSpace: 'nowrap',
          fontSize: 38,
          color: v9Colors.blue,
        }}
      >
        模型内部
      </Layer>

      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: diagramOpacity,
          transform: `translateY(${-120 * reframe}px) scale(${1 - 0.18 * reframe})`,
          transformOrigin: '960px 390px',
        }}
      >
        <ProcessBox
          label="已有内容"
          color={v9Colors.ink}
          amount={1}
          left={135}
          width={300}
          emphasis={contextPulse}
        />
        <ProcessBox
          label="预测下一个"
          color={v9Colors.blue}
          amount={1}
          left={585}
          width={300}
          emphasis={predictPulse}
        />
        <ProcessBox
          label="生成 Token"
          color={v9Colors.green}
          amount={1}
          left={1035}
          width={330}
          fontSize={42}
          emphasis={generatePulse}
        />
        <ProcessBox
          label="接回后面"
          color={v9Colors.magenta}
          amount={1}
          left={1515}
          width={270}
          emphasis={appendPulse}
        />

        <svg
          width={1920}
          height={620}
          viewBox="0 0 1920 620"
          style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}
        >
          <path d="M 435 390 C 485 384 530 384 580 390" fill="none" stroke={v9Colors.blue} strokeWidth={4} strokeLinecap="round" />
          <path d="M 558 376 L 584 390 L 559 406" fill="none" stroke={v9Colors.blue} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 885 390 C 935 384 980 384 1030 390" fill="none" stroke={v9Colors.blue} strokeWidth={4} strokeLinecap="round" />
          <path d="M 1008 376 L 1034 390 L 1009 406" fill="none" stroke={v9Colors.blue} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 1365 390 C 1415 384 1460 384 1510 390" fill="none" stroke={v9Colors.blue} strokeWidth={4} strokeLinecap="round" />
          <path d="M 1488 376 L 1514 390 L 1489 406" fill="none" stroke={v9Colors.blue} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 1650 450 C 1650 565 285 565 285 444" fill="none" stroke={v9Colors.blue} strokeWidth={4} strokeLinecap="round" />
          <path d="M 1647 452 C 1644 560 292 570 285 444" fill="none" stroke={v9Colors.blue} strokeWidth={1.3} strokeLinecap="round" opacity={0.26} />
          <path d="M 285 444 C 281 451 277 459 271 466" fill="none" stroke={v9Colors.blue} strokeWidth={4} strokeLinecap="round" />
          <path d="M 285 444 C 290 451 296 459 302 466" fill="none" stroke={v9Colors.blue} strokeWidth={4} strokeLinecap="round" />
        </svg>
      </div>

      <svg
        width={1920}
        height={1080}
        viewBox="0 0 1920 1080"
        style={{position: 'absolute', inset: 0, overflow: 'visible'}}
      >
        <path
          d="M 1155 421 C 1155 472 1035 486 1035 548"
          fill="none"
          stroke={v9Colors.green}
          strokeWidth={4}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - productLink}
        />
        <path
          d="M 1022 526 L 1035 550 L 1048 526"
          fill="none"
          stroke={v9Colors.green}
          strokeWidth={4}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={ease(frame, 110, 6)}
        />
      </svg>

      <Layer
        amount={productLink}
        fromX={10}
        style={{position: 'absolute', left: 1185, top: 474, fontSize: 29, color: v9Colors.green}}
      >
        生成后立即显示
      </Layer>

      <Layer amount={shell} fromY={18} style={{position: 'absolute', left: 260, top: 555}}>
        <RoughBox
          width={1400}
          height={260}
          color={v9Colors.ink}
          progress={shell}
          seedKey="streaming-review-product-shell"
        >
          <div
            style={{
              position: 'absolute',
              left: 65,
              right: 45,
              top: 108,
              display: 'flex',
              alignItems: 'center',
              fontSize: 48,
              lineHeight: 1,
              color: v9Colors.ink,
            }}
          >
            <span style={{color: v9Colors.green, marginRight: 16}}>AI：</span>
            {STREAMING_PARTS.map((part, index) => {
              const amount = ease(frame, STREAMING_ARRIVALS[index], 7);
              const fresh = amount * (1 - ease(frame, STREAMING_ARRIVALS[index] + 7, 9));
              return (
                <span
                  key={`${part}-${index}`}
                  style={{
                    display: 'inline-block',
                    whiteSpace: 'pre',
                    opacity: amount,
                    transform: `translateY(${(1 - amount) * 8}px)`,
                    textShadow: fresh > 0 ? `0 0 ${12 * fresh}px ${v9Colors.green}` : undefined,
                  }}
                >
                  {part}
                </span>
              );
            })}
            <span style={{marginLeft: 5, color: v9Colors.green, opacity: cursorOpacity}}>▌</span>
          </div>
        </RoughBox>
      </Layer>

      <Layer
        amount={shell}
        fromX={-12}
        style={{
          position: 'absolute',
          left: 10,
          top: 665,
          width: 230,
          textAlign: 'right',
          whiteSpace: 'nowrap',
          fontSize: 38,
          color: v9Colors.magenta,
        }}
      >
        AI 回答界面
      </Layer>

      {STREAMING_PARTS.map((part, index) => {
        const arrival = STREAMING_ARRIVALS[index];
        const travel = ease(frame, arrival - 12, 10);
        const opacity = ease(frame, arrival - 12, 3) * (1 - ease(frame, arrival - 1, 4));
        const top = interpolate(travel, [0, 1], [430, 570]);
        return (
          <div
            key={`flying-${part}-${index}`}
            style={{
              position: 'absolute',
              left: 1086,
              top,
              minWidth: 130,
              padding: '10px 18px',
              border: `3px solid ${v9Colors.blue}`,
              borderRadius: '46% 54% 48% 52%',
              background: 'rgba(38, 40, 38, 0.88)',
              color: v9Colors.blue,
              textAlign: 'center',
              fontSize: 34,
              lineHeight: 1,
              opacity,
              transform: `scale(${0.94 + travel * 0.06})`,
              transformOrigin: 'center center',
            }}
          >
            {part}
          </div>
        );
      })}

      <Layer
        amount={takeaway}
        fromY={12}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 895,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 28,
          fontSize: 48,
          lineHeight: 1,
        }}
      >
        <span style={{color: v9Colors.blue}}>逐步生成 Token</span>
        <span style={{color: v9Colors.muted}}>→</span>
        <span style={{color: v9Colors.green}}>持续显示</span>
        <span style={{color: v9Colors.muted}}>→</span>
        <span style={{color: v9Colors.yellow}}>回答逐步出现</span>
      </Layer>
    </Paper>
  );
};

export const SceneStreamingReviewPacingV2 = () => (
  <SceneStreamingReview pacingV2 />
);

export const SceneStreamingReviewPacingV2NoHighlights = () => (
  <SceneStreamingReview pacingV2 showProcessHighlights={false} />
);

const TOKENIZER_SENTENCE = '手机只剩 1% 的电，我赶紧找充电器。';
const TOKENIZER_A = ['手机', '只剩', '1%', '的电', '，', '我', '赶紧', '找', '充电器', '。'] as const;
const TOKENIZER_B = ['手机', '只', '剩', '1', '%', '的', '电', '，', '我', '赶紧', '找', '充电器', '。'] as const;

const TokenizerSplitRow = ({
  pieces,
  color,
  boundaryColor,
  amount,
  boundaryStart,
  compact = false,
  justifyContent = 'center',
  boundaryStep,
  boundaryDuration,
  highlightedBoundaryIndexes = [],
  highlightAmount = 0,
}: {
  pieces: readonly string[];
  color: string;
  boundaryColor: string;
  amount: number;
  boundaryStart: number;
  compact?: boolean;
  justifyContent?: 'center' | 'flex-start';
  boundaryStep?: number;
  boundaryDuration?: number;
  highlightedBoundaryIndexes?: readonly number[];
  highlightAmount?: number;
}) => {
  const frame = useV9SceneFrame();
  const step = boundaryStep ?? (compact ? 3 : 5);
  const duration = boundaryDuration ?? (compact ? 7 : 9);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent,
        color,
        fontSize: compact ? 39 : 43,
        lineHeight: 1,
        whiteSpace: 'nowrap',
        opacity: amount,
      }}
    >
      {pieces.map((piece, index) => {
        const boundary = ease(frame, boundaryStart + index * step, duration);
        const highlight = highlightedBoundaryIndexes.includes(index)
          ? highlightAmount
          : 0;
        const activeBoundaryColor = interpolateColors(
          highlight,
          [0, 1],
          [boundaryColor, v9Colors.magenta],
        );
        return (
          <Fragment key={`${piece}-${index}`}>
            <span style={{padding: compact ? '0 8px' : '0 15px'}}>{piece}</span>
            {index < pieces.length - 1 ? (
              <span
                style={{
                  width: compact ? 2 : 3,
                  height: compact ? 50 : 55,
                  borderRadius: 4,
                  background: activeBoundaryColor,
                  opacity: boundary,
                  transform: `scaleY(${boundary}) scaleX(${1 + highlight * 1.1})`,
                  transformOrigin: 'top center',
                  boxShadow: compact
                    ? highlight > 0
                      ? `0 0 ${16 * highlight}px ${activeBoundaryColor}`
                      : 'none'
                    : `0 0 ${9 + 18 * highlight}px ${activeBoundaryColor}`,
                  zIndex: highlight > 0 ? 1 : 0,
                }}
              />
            ) : null}
          </Fragment>
        );
      })}
    </div>
  );
};

const SceneTokenizerReview = ({
  titleText = '文字怎么被切分成 Token？',
}: {
  titleText?: string;
} = {}) => {
  const frame = useV9SceneFrame();
  const title = ease(frame, 0, 18);
  const sentence = ease(frame, 20, 18);
  const inputArrow = ease(frame, 44, 16);
  const tokenizer = ease(frame, 58, 18);
  const tokenizerCore = ease(frame, 72, 18);
  const outputArrow = ease(frame, 88, 16);
  const outputGuide = ease(frame, 108, 14);
  const compare = ease(frame, 194, 18);
  const rowB = ease(frame, 236, 18);
  const differenceHighlight = ease(frame, 284, 12);
  const rowAColor = interpolateColors(
    compare,
    [0, 1],
    [v9Colors.ink, v9Colors.blue],
  );

  return (
    <Paper>
      <Layer
        amount={title}
        fromY={-12}
        motionVisibility={1 - compare * 0.22}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 54,
          textAlign: 'center',
          fontSize: 70,
          color: v9Colors.ink,
          letterSpacing: 3,
          opacity: title * (1 - compare * 0.22),
        }}
      >
        {titleText}
      </Layer>

      <Layer
        amount={sentence}
        fromY={10}
        motionVisibility={1 - compare * 0.28}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 190,
          textAlign: 'center',
          fontSize: 54,
          color: v9Colors.ink,
          letterSpacing: 2,
          opacity: sentence * (1 - compare * 0.28),
        }}
      >
        {TOKENIZER_SENTENCE}
      </Layer>

      <div>
        <svg
          width={120}
          height={90}
          viewBox="0 0 120 90"
          style={{position: 'absolute', left: 900, top: 260, overflow: 'visible'}}
        >
          <path
            d="M 60 4 C 57 24 62 43 60 68"
            fill="none"
            stroke={v9Colors.blue}
            strokeWidth={4}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - inputArrow}
          />
          <path
            d="M 45 55 L 60 72 L 75 54"
            fill="none"
            stroke={v9Colors.blue}
            strokeWidth={4}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={ease(frame, 56, 5)}
          />
        </svg>

        <Layer amount={tokenizer} fromScale={0.96} style={{position: 'absolute', left: 600, top: 326}}>
          <RoughBox
            width={720}
            height={220}
            color={v9Colors.green}
            progress={tokenizer}
            seedKey="tokenizer-review-rules"
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 16,
              }}
            >
              <div style={{fontSize: 54, color: v9Colors.ink, letterSpacing: 3}}>
                Tokenizer
              </div>
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 22,
                  padding: '8px 26px 11px',
                  fontSize: 66,
                  lineHeight: 1,
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: 1,
                    bottom: 0,
                    borderRadius: '42% 48% 44% 51%',
                    background: 'rgba(130, 181, 105, 0.16)',
                    borderBottom: `4px solid ${v9Colors.yellow}`,
                    opacity: tokenizerCore,
                    transform: `scaleX(${tokenizerCore})`,
                    transformOrigin: 'left center',
                  }}
                />
                <span style={{position: 'relative', color: v9Colors.blue}}>词表</span>
                <span style={{position: 'relative', color: v9Colors.ink}}>＋</span>
                <span style={{position: 'relative', color: v9Colors.green}}>切分规则</span>
              </div>
            </div>
          </RoughBox>
        </Layer>

        <svg
          width={120}
          height={100}
          viewBox="0 0 120 100"
          style={{
            position: 'absolute',
            left: 900,
            top: 550,
            overflow: 'visible',
            opacity: 1 - compare,
          }}
        >
          <path
            d="M 60 4 C 62 28 57 51 60 76"
            fill="none"
            stroke={v9Colors.green}
            strokeWidth={4}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - outputArrow}
          />
          <path
            d="M 45 64 L 60 82 L 75 63"
            fill="none"
            stroke={v9Colors.green}
            strokeWidth={4}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={ease(frame, 100, 5)}
          />
        </svg>

        <Layer
          amount={compare}
          fromScale={0.985}
          fromY={0}
          style={{position: 'absolute', left: 70, top: 620}}
        >
          <RoughBox
            width={1780}
            height={280}
            color="rgba(245, 241, 232, 0.26)"
            progress={compare}
            seedKey="tokenizer-review-comparison-group"
          >
            <svg
              width={1780}
              height={280}
              viewBox="0 0 1780 280"
              style={{position: 'absolute', inset: 0, overflow: 'visible'}}
            >
              <path
                d="M 38 140 C 410 137 820 144 1180 139 C 1390 136 1580 142 1742 140"
                fill="none"
                stroke="rgba(245, 241, 232, 0.22)"
                strokeWidth={3}
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - compare}
              />
            </svg>
          </RoughBox>
        </Layer>

        <div
          style={{
            position: 'absolute',
            left: 420,
            right: 80,
            top: 660,
            height: 80,
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center',
            }}
          >
            <TokenizerSplitRow
              pieces={TOKENIZER_A}
              color={rowAColor}
              boundaryColor={v9Colors.yellow}
              amount={outputGuide}
              boundaryStart={124}
              justifyContent="flex-start"
            />
          </div>
        </div>

        <Layer
          amount={compare}
          fromScale={0.9}
          fromY={0}
          style={{position: 'absolute', left: 110, top: 647}}
        >
          <RoughBox
            width={270}
            height={82}
            color={v9Colors.blue}
            progress={compare}
            seedKey="tokenizer-review-output-a"
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'grid',
                placeItems: 'center',
                color: v9Colors.blue,
                fontSize: 40,
                lineHeight: 1,
              }}
            >
              Tokenizer A
            </div>
          </RoughBox>
        </Layer>

        <Layer
          amount={rowB}
          fromScale={0.9}
          fromY={0}
          style={{position: 'absolute', left: 110, top: 787}}
        >
          <RoughBox
            width={270}
            height={82}
            color={v9Colors.green}
            progress={rowB}
            seedKey="tokenizer-review-output-b"
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'grid',
                placeItems: 'center',
                color: v9Colors.green,
                fontSize: 40,
                lineHeight: 1,
              }}
            >
              Tokenizer B
            </div>
          </RoughBox>
        </Layer>

        <div
          style={{
            position: 'absolute',
            left: 420,
            right: 80,
            top: 800,
            height: 80,
            display: 'flex',
            alignItems: 'flex-start',
          }}
        >
          <TokenizerSplitRow
            pieces={TOKENIZER_B}
            color={v9Colors.green}
            boundaryColor={v9Colors.yellow}
            amount={rowB}
            boundaryStart={242}
            boundaryStep={3}
            boundaryDuration={7}
            highlightedBoundaryIndexes={[1, 3, 5]}
            highlightAmount={differenceHighlight}
            justifyContent="flex-start"
          />
        </div>
      </div>
    </Paper>
  );
};

export const SceneTokenizerReviewWithComma = () => (
  <SceneTokenizerReview titleText="文字，怎么被切分成Token？" />
);

const FullChainNode = ({
  label,
  color,
  amount,
  left,
  top,
  width,
  height,
  fontSize = 40,
  seedKey,
}: {
  label: string;
  color: string;
  amount: number;
  left: number;
  top: number;
  width: number;
  height: number;
  fontSize?: number;
  seedKey: string;
}) => (
  <Layer
    amount={amount}
    fromY={10}
    fromScale={0.94}
    style={{position: 'absolute', left, top}}
  >
    <RoughBox
      width={width}
      height={height}
      color={color}
      progress={amount}
      seedKey={seedKey}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'grid',
          placeItems: 'center',
          color,
          fontSize,
          lineHeight: 1.15,
          textAlign: 'center',
          whiteSpace: 'pre-line',
        }}
      >
        {label}
      </div>
    </RoughBox>
  </Layer>
);

const TokenIdStacks = ({
  tokens,
  color,
  left,
  top,
  start,
  seedPrefix,
  frame,
}: {
  tokens: readonly string[];
  color: string;
  left: number;
  top: number;
  start: number;
  seedPrefix: string;
  frame: number;
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        left,
        top,
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
      }}
    >
      {tokens.map((token, index) => {
        const amount = ease(frame, start + index * 10, 12);
        return (
          <Layer
            key={`${seedPrefix}-${token}-${index}`}
            amount={amount}
            fromY={12}
            fromScale={0.92}
          >
            <div style={{width: 100, textAlign: 'center'}}>
              <div
                style={{
                  minHeight: 58,
                  padding: '7px 8px',
                  display: 'grid',
                  placeItems: 'center',
                  border: `3px solid ${color}`,
                  borderRadius: '42% 52% 45% 50%',
                  color,
                  fontSize: token.length > 3 ? 25 : 30,
                  lineHeight: 1,
                  background: 'rgba(30, 32, 34, 0.38)',
                }}
              >
                {token}
              </div>
              <div
                style={{
                  marginTop: 8,
                  color: v9Colors.muted,
                  fontSize: 24,
                  lineHeight: 1,
                  letterSpacing: 1,
                }}
              >
                ID
              </div>
            </div>
          </Layer>
        );
      })}
    </div>
  );
};

const SceneFullChainReview = () => {
  const frame = useV9SceneFrame();
  const title = ease(frame, 0, 18);
  const leftPanel = ease(frame, 18, 18);
  const input = ease(frame, 38, 16);
  const tokenizer = ease(frame, 66, 16);
  const encoded = ease(frame, 96, 18);
  const enterModel = ease(frame, 128, 16);
  const modelPanel = ease(frame, 132, 18);
  const predict = ease(frame, 156, 16);
  const generate = ease(frame, 184, 16);
  const append = ease(frame, 212, 16);
  const rightPanel = ease(frame, 244, 18);
  const exitModel = ease(frame, 252, 16);
  const decode = ease(frame, 292, 18);
  const answer = ease(frame, 324, 20);
  const connectorTop = 503;

  return (
    <Paper>
      <Layer
        amount={title}
        fromY={-10}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 48,
          textAlign: 'center',
          color: v9Colors.ink,
          fontSize: 72,
          letterSpacing: 3,
        }}
      >
        从输入文字，到生成回答
      </Layer>

      <Layer
        amount={leftPanel}
        fromScale={0.985}
        fromY={0}
        style={{position: 'absolute', left: 70, top: 210}}
      >
        <RoughBox
          width={450}
          height={700}
          color={v9Colors.blue}
          progress={leftPanel}
          seedKey="full-chain-input-panel"
        >
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 30,
              textAlign: 'center',
              color: v9Colors.blue,
              fontSize: 38,
            }}
          >
            ① 输入与编码
          </div>
        </RoughBox>
      </Layer>

      <Layer
        amount={modelPanel}
        fromScale={0.985}
        fromY={0}
        style={{position: 'absolute', left: 560, top: 180}}
      >
        <RoughBox
          width={800}
          height={730}
          color={v9Colors.magenta}
          progress={modelPanel}
          seedKey="full-chain-model-panel"
        >
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 30,
              textAlign: 'center',
            }}
          >
            <div style={{color: v9Colors.magenta, fontSize: 58}}>② 大模型持续生成</div>
            <div style={{color: v9Colors.muted, fontSize: 29, marginTop: 12}}>根据已有内容</div>
          </div>
        </RoughBox>
      </Layer>

      <Layer
        amount={rightPanel}
        fromScale={0.985}
        fromY={0}
        style={{position: 'absolute', left: 1400, top: 210}}
      >
        <RoughBox
          width={450}
          height={700}
          color={v9Colors.green}
          progress={rightPanel}
          seedKey="full-chain-output-panel"
        >
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 30,
              textAlign: 'center',
              color: v9Colors.green,
              fontSize: 38,
            }}
          >
            ③ 解码与回答
          </div>
        </RoughBox>
      </Layer>

      <FullChainNode
        label={'输入文字\n手机只剩 1%……'}
        color={v9Colors.ink}
        amount={input}
        left={120}
        top={315}
        width={350}
        height={105}
        fontSize={34}
        seedKey="full-chain-input-text"
      />

      <Layer
        amount={tokenizer}
        fromY={8}
        style={{position: 'absolute', left: 273, top: 420, color: v9Colors.blue, fontSize: 54}}
      >
        ↓
      </Layer>
      <FullChainNode
        label="Tokenizer"
        color={v9Colors.green}
        amount={tokenizer}
        left={120}
        top={475}
        width={350}
        height={105}
        fontSize={43}
        seedKey="full-chain-tokenizer"
      />
      <Layer
        amount={encoded}
        fromY={8}
        style={{position: 'absolute', left: 273, top: 578, color: v9Colors.blue, fontSize: 54}}
      >
        ↓
      </Layer>
      <TokenIdStacks
        tokens={['手机', '只剩', '1%']}
        color={v9Colors.blue}
        left={125}
        top={650}
        start={96}
        seedPrefix="full-chain-input-token"
        frame={frame}
      />

      <div style={{position: 'absolute', left: 506, top: connectorTop}}>
        <HandArrow width={82} progress={enterModel} color={v9Colors.blue} bend={2} />
      </div>

      <FullChainNode
        label="预测下一个"
        color={v9Colors.blue}
        amount={predict}
        left={620}
        top={385}
        width={280}
        height={120}
        fontSize={39}
        seedKey="full-chain-predict"
      />
      <FullChainNode
        label="生成 Token"
        color={v9Colors.green}
        amount={generate}
        left={1020}
        top={385}
        width={280}
        height={120}
        fontSize={39}
        seedKey="full-chain-generate"
      />
      <FullChainNode
        label="接回已有内容"
        color={v9Colors.yellow}
        amount={append}
        left={820}
        top={620}
        width={280}
        height={110}
        fontSize={35}
        seedKey="full-chain-append"
      />

      <svg
        width={1920}
        height={1080}
        viewBox="0 0 1920 1080"
        style={{position: 'absolute', inset: 0, overflow: 'visible'}}
      >
        <path
          d="M 900 445 C 942 439 980 439 1020 445"
          fill="none"
          stroke={v9Colors.blue}
          strokeWidth={4}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - generate}
        />
        <path
          d="M 995 430 L 1020 445 L 995 460"
          fill="none"
          stroke={v9Colors.blue}
          strokeWidth={4}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={generate}
        />
        <path
          d="M 1160 505 C 1160 555 1142 590 1100 620"
          fill="none"
          stroke={v9Colors.green}
          strokeWidth={4}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - append}
        />
        <path
          d="M 1127 607 L 1100 620 L 1110 592"
          fill="none"
          stroke={v9Colors.green}
          strokeWidth={4}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={append}
        />
        <path
          d="M 820 675 C 690 675 654 580 690 505"
          fill="none"
          stroke={v9Colors.yellow}
          strokeWidth={4}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - append}
        />
        <path
          d="M 675 532 L 690 505 L 705 532"
          fill="none"
          stroke={v9Colors.yellow}
          strokeWidth={4}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={append}
        />
      </svg>

      <div style={{position: 'absolute', left: 1346, top: connectorTop}}>
        <HandArrow width={82} progress={exitModel} color={v9Colors.blue} bend={-2} />
      </div>

      <TokenIdStacks
        tokens={['充电器', '。', '…']}
        color={v9Colors.green}
        left={1445}
        top={345}
        start={254}
        seedPrefix="full-chain-output-token"
        frame={frame}
      />
      <Layer
        amount={decode}
        fromY={8}
        style={{position: 'absolute', left: 1603, top: 458, color: v9Colors.blue, fontSize: 54}}
      >
        ↓
      </Layer>
      <FullChainNode
        label="解码"
        color={v9Colors.green}
        amount={decode}
        left={1450}
        top={520}
        width={350}
        height={105}
        fontSize={46}
        seedKey="full-chain-decode"
      />
      <Layer
        amount={answer}
        fromY={8}
        style={{position: 'absolute', left: 1603, top: 625, color: v9Colors.blue, fontSize: 54}}
      >
        ↓
      </Layer>
      <FullChainNode
        label={'完整回答\n我赶紧找充电器。'}
        color={v9Colors.yellow}
        amount={answer}
        left={1450}
        top={690}
        width={350}
        height={125}
        fontSize={35}
        seedKey="full-chain-answer"
      />
    </Paper>
  );
};

export const REVIEW_SCENE_OVERRIDES = {
  question: SceneQuestionReview,
  'product-model': SceneProductModelReview,
  'llm-actions': SceneLlmActionsReview,
  'predict-next': ScenePredictNextReview,
  'generation-loop': SceneGenerationLoopReview,
  streaming: SceneStreamingReview,
  tokenizer: SceneTokenizerReview,
  'encode-decode': SceneEncodeDecodeReview,
  'token-impact': SceneTokenImpactReview,
  'full-chain': SceneFullChainReview,
};

/**
 * Review copy of Lesson1ChalkboardRevised.
 * Keep the source composition unchanged while page-specific review edits land here.
 */
export const Lesson1ChalkboardRevisedReview = () => (
  <>
    <Audio src={staticFile(REVIEW_VOICEOVER_FILE)} />
    <Lesson1ChalkboardRevised
      sceneOverrides={REVIEW_SCENE_OVERRIDES}
      sceneTimingOverrides={REVIEW_SCENE_TIMING_OVERRIDES}
      seamlessSceneIds={['generation-loop', 'streaming']}
    />
  </>
);
