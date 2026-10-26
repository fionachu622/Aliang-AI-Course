import type {CSSProperties, ReactNode} from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Series,
  useCurrentFrame,
} from 'remotion';
import {
  IAN_BLACKBOX_SCENES,
  type IanBlackboxScene,
  type IanSceneKind,
} from './storyboard';

const C = {
  ink: '#111111',
  red: '#ec3d2f',
  orange: '#f29a2e',
  blue: '#3478e5',
  paleBlue: '#eaf2ff',
  paper: '#ffffff',
  muted: '#77736e',
};

const FONT = '"Kaiti SC", "STKaiti", "KaiTi", "PingFang SC", sans-serif';
const BODY_FONT = '-apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const progressAt = (frame: number, at: number, duration = 18) =>
  interpolate(frame, [at, at + duration], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

const revealStyle = (frame: number, at: number, y = 24): CSSProperties => {
  const p = progressAt(frame, at);
  return {
    opacity: p,
    transform: `translateY(${(1 - p) * y}px) scale(${0.97 + p * 0.03})`,
  };
};

const Reveal = ({at, children, style}: {at: number; children: ReactNode; style?: CSSProperties}) => {
  const frame = useCurrentFrame();
  return <div style={{...style, ...revealStyle(frame, at)}}>{children}</div>;
};

const InkText = ({children, color = C.ink, style}: {children: ReactNode; color?: string; style?: CSSProperties}) => (
  <div style={{fontFamily: FONT, fontWeight: 800, color, ...style}}>{children}</div>
);

const HandArrow = ({x, y, width = 230, at = 0, color = C.orange}: {x: number; y: number; width?: number; at?: number; color?: string}) => {
  const frame = useCurrentFrame();
  const p = progressAt(frame, at, 24);
  return (
    <svg style={{position: 'absolute', left: x, top: y, width, height: 72, overflow: 'visible'}} viewBox={`0 0 ${width} 72`}>
      <path
        d={`M8 36 C${width * 0.28} 23 ${width * 0.61} 48 ${width - 28} 34 M${width - 57} 11 L${width - 25} 34 L${width - 55} 59`}
        fill="none"
        stroke={color}
        strokeWidth={8}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - p}
      />
    </svg>
  );
};

const SketchBox = ({x, y, w, h, children, color = C.ink, at = 0, fill = C.paper, style}: {
  x: number;
  y: number;
  w: number;
  h: number;
  children?: ReactNode;
  color?: string;
  at?: number;
  fill?: string;
  style?: CSSProperties;
}) => {
  const frame = useCurrentFrame();
  const p = progressAt(frame, at, 22);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, ...style}}>
      <svg style={{position: 'absolute', inset: 0, width: '100%', height: '100%'}} viewBox={`0 0 ${w} ${h}`}>
        <path
          d={`M18 12 C${w * 0.3} 2 ${w * 0.72} 7 ${w - 16} 17 L${w - 10} ${h - 20} C${w * 0.72} ${h - 4} ${w * 0.29} ${h - 8} 14 ${h - 17} Z`}
          fill={fill}
          stroke={color}
          strokeWidth={5}
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - p}
        />
      </svg>
      <div style={{position: 'absolute', inset: 18, display: 'grid', placeItems: 'center'}}>{children}</div>
    </div>
  );
};

const TokenBlock = ({x, y, w, label, color = C.blue, at = 0, h = 82, fontSize = 34}: {
  x: number;
  y: number;
  w: number;
  label: string;
  color?: string;
  at?: number;
  h?: number;
  fontSize?: number;
}) => (
  <Reveal at={at} style={{position: 'absolute', left: x, top: y}}>
    <div
      style={{
        width: w,
        height: h,
        display: 'grid',
        placeItems: 'center',
        border: `5px solid ${color}`,
        borderRadius: '47% 53% 48% 52% / 51% 45% 55% 49%',
        background: C.paper,
        color,
        fontFamily: FONT,
        fontWeight: 800,
        fontSize,
      }}
    >
      {label}
    </div>
  </Reveal>
);

const Operator = ({x, y, at = 0, action = 0}: {x: number; y: number; at?: number; action?: number}) => {
  const frame = useCurrentFrame();
  const p = progressAt(frame, at);
  const active = progressAt(frame, at + 10);
  const bob = Math.sin((frame - at) * 0.16) * 3 * active;
  return (
    <div
      aria-label="黑盒操作员"
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 120,
        height: 180,
        opacity: p,
        transform: `translateY(${(1 - p) * 24 + bob}px) rotate(-2deg)`,
        transformOrigin: '50% 100%',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 8,
          top: 4,
          width: 98,
          height: 112,
          background: C.ink,
          clipPath: 'polygon(9% 0, 87% 5%, 100% 76%, 82% 100%, 13% 92%, 0 21%)',
        }}
      />
      <div style={{position: 'absolute', left: 36, top: 44, width: 42, height: 8, borderRadius: 20, background: C.blue, opacity: 0.65 + active * 0.35}} />
      {[0, 1].map((leg) => (
        <div
          key={leg}
          style={{
            position: 'absolute',
            left: leg === 0 ? 38 : 78,
            top: 108,
            width: 5,
            height: 62,
            borderRadius: 10,
            background: C.ink,
            transform: `rotate(${leg === 0 ? 7 : -8}deg)`,
            transformOrigin: 'top',
          }}
        />
      ))}
      {[0, 1].map((arm) => {
        const base = arm === 0 ? 50 : -48;
        const movement = arm === action ? Math.sin((frame - at) * 0.2) * 16 * active : 0;
        return (
          <div
            key={arm}
            style={{
              position: 'absolute',
              left: arm === 0 ? 8 : 104,
              top: 66,
              width: 5,
              height: 78,
              borderRadius: 10,
              background: C.ink,
              transform: `rotate(${base + movement}deg)`,
              transformOrigin: 'top',
            }}
          />
        );
      })}
    </div>
  );
};

const Cross = ({x, y, size = 150, at = 0}: {x: number; y: number; size?: number; at?: number}) => {
  const frame = useCurrentFrame();
  const p = progressAt(frame, at, 22);
  return (
    <svg style={{position: 'absolute', left: x, top: y, width: size, height: size}} viewBox="0 0 100 100">
      <path d="M10 12 L91 89 M88 12 L9 91" fill="none" stroke={C.red} strokeWidth={7} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
    </svg>
  );
};

const SceneShell = ({scene, index, children}: {scene: IanBlackboxScene; index: number; children: ReactNode}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: C.paper, color: C.ink, fontFamily: BODY_FONT, overflow: 'hidden'}}>
      <div style={{position: 'absolute', right: 54, top: 42, color: C.muted, fontSize: 22, fontWeight: 800, letterSpacing: '0.16em'}}>
        {String(index + 1).padStart(2, '0')} / {String(IAN_BLACKBOX_SCENES.length).padStart(2, '0')}
      </div>
      <div
        style={{
          position: 'absolute',
          left: 160,
          right: 160,
          top: 60,
          textAlign: 'center',
          fontSize: scene.title.length > 19 ? 61 : 70,
          lineHeight: 1.08,
          letterSpacing: '-0.045em',
          fontWeight: 900,
          ...revealStyle(frame, 3),
        }}
      >
        {scene.title}
      </div>
      <div style={{position: 'absolute', left: 90, right: 90, top: 190, bottom: 52}}>{children}</div>
    </AbsoluteFill>
  );
};

const TaskQuestion = () => (
  <>
    {['写文章', '总结资料', '修改文案', '解释问题'].map((task, index) => (
      <Reveal key={task} at={24 + index * 13} style={{position: 'absolute', left: 140 + index * 330, top: 120 + (index % 2) * 34}}>
        <InkText color={C.blue} style={{fontSize: 38, transform: `rotate(${index % 2 ? 2 : -2}deg)`}}>{task}</InkText>
      </Reveal>
    ))}
    <Reveal at={84} style={{position: 'absolute', left: 0, right: 0, top: 330, textAlign: 'center'}}>
      <InkText color={C.blue} style={{fontSize: 34}}>再往里面追问一步</InkText>
    </Reveal>
    <SketchBox x={240} y={420} w={940} h={130} color={C.red} at={104}>
      <InkText color={C.red} style={{fontSize: 53}}>从输入到回答，中间发生了什么？</InkText>
    </SketchBox>
  </>
);

const DailyUse = () => (
  <>
    <Reveal at={20} style={{position: 'absolute', left: 0, right: 0, top: 5, display: 'flex', justifyContent: 'center', gap: 70}}>
      {['ChatGPT', 'DeepSeek', '豆包'].map((name) => <InkText key={name} color={C.blue} style={{fontSize: 34}}>{name}</InkText>)}
    </Reveal>
    <SketchBox x={55} y={205} w={300} h={150} color={C.blue} at={45}>
      <InkText color={C.blue} style={{fontSize: 38}}>输入一句话</InkText>
    </SketchBox>
    <HandArrow x={360} y={245} width={240} at={62} />
    <SketchBox x={610} y={130} w={300} h={305} at={78}>
      <InkText style={{fontSize: 54}}>AI 产品</InkText>
    </SketchBox>
    <Operator x={785} y={350} at={92} action={1} />
    <HandArrow x={920} y={245} width={220} at={105} />
    <SketchBox x={1140} y={205} w={250} h={150} color={C.red} at={120}>
      <InkText color={C.red} style={{fontSize: 40}}>得到回答</InkText>
    </SketchBox>
  </>
);

const ProductCore = () => (
  <>
    <SketchBox x={170} y={65} w={1080} h={500} at={18}>
      <>
        {[
          ['聊天', 55, 100], ['文件', 850, 90], ['搜索', 55, 330], ['语音', 850, 335],
        ].map(([label, x, y], i) => (
          <Reveal key={String(label)} at={36 + i * 10} style={{position: 'absolute', left: Number(x), top: Number(y)}}>
            <div style={{border: `4px solid ${C.blue}`, borderRadius: '50%', padding: '14px 36px', color: C.blue, fontFamily: FONT, fontSize: 31, fontWeight: 800}}>{label}</div>
          </Reveal>
        ))}
        <Reveal at={82} style={{position: 'absolute', left: 355, top: 96}}>
          <div style={{width: 330, height: 280, display: 'grid', placeItems: 'center', borderRadius: '49% 51% 45% 55%', background: C.ink, color: '#fff', fontFamily: FONT, fontSize: 58, fontWeight: 800}}>大模型</div>
        </Reveal>
      </>
    </SketchBox>
    <Operator x={790} y={420} at={96} action={0} />
    <Reveal at={132} style={{position: 'absolute', left: 0, right: 0, bottom: 5, textAlign: 'center'}}>
      <InkText style={{fontSize: 40}}><span style={{color: C.orange}}>我们使用产品</span>　→　<span style={{color: C.red}}>大模型提供核心能力</span></InkText>
    </Reveal>
  </>
);

const TrainingUse = () => (
  <>
    <Reveal at={18} style={{position: 'absolute', left: 120, top: 10}}><InkText color={C.blue} style={{fontSize: 32, border: `4px solid ${C.blue}`, borderRadius: '50%', padding: '9px 24px'}}>训练阶段</InkText></Reveal>
    <Reveal at={30} style={{position: 'absolute', right: 90, top: 10}}><InkText color={C.red} style={{fontSize: 32, border: `4px solid ${C.red}`, borderRadius: '50%', padding: '9px 24px'}}>使用阶段</InkText></Reveal>
    {['语言数据', '知识资料', '内容样本'].map((label, i) => (
      <SketchBox key={label} x={65 + i * 52} y={170 + i * 70} w={210} h={105} color={C.blue} at={42 + i * 12}><InkText style={{fontSize: 29}}>{label}</InkText></SketchBox>
    ))}
    <HandArrow x={350} y={265} width={210} at={70} />
    <Reveal at={85} style={{position: 'absolute', left: 570, top: 135}}>
      <div style={{width: 320, height: 320, borderRadius: '48% 52% 45% 55%', background: C.ink, display: 'grid', placeItems: 'center', color: '#fff'}}>
        <InkText color="#fff" style={{fontSize: 48, textAlign: 'center'}}>大模型<br /><span style={{fontSize: 35}}>学习规律</span></InkText>
      </div>
    </Reveal>
    <HandArrow x={905} y={265} width={190} at={112} />
    <SketchBox x={1090} y={185} w={270} h={220} color={C.red} at={130}><InkText color={C.red} style={{fontSize: 44}}>继续生成</InkText></SketchBox>
  </>
);

const Prediction = () => (
  <>
    <SketchBox x={130} y={145} w={1140} h={160} at={20}><InkText style={{fontSize: 52}}>手机只剩 1% 的电，我赶紧找……</InkText></SketchBox>
    <Reveal at={70} style={{position: 'absolute', left: 1100, top: 10}}><InkText color={C.red} style={{fontSize: 130}}>？</InkText></Reveal>
    <Reveal at={100} style={{position: 'absolute', left: 0, right: 0, top: 390, textAlign: 'center'}}><InkText color={C.red} style={{fontSize: 52}}>预测下一个</InkText></Reveal>
  </>
);

const Probability = () => {
  const frame = useCurrentFrame();
  const tilt = interpolate(frame, [70, 120], [0, -7], {...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1)});
  return (
    <>
      <div style={{position: 'absolute', left: 360, top: 275, width: 700, height: 8, borderRadius: 20, background: C.ink, transform: `rotate(${tilt}deg)`}} />
      <div style={{position: 'absolute', left: 705, top: 282, width: 7, height: 220, background: C.ink}} />
      <div style={{position: 'absolute', left: 610, top: 495, width: 205, height: 7, background: C.ink}} />
      <TokenBlock x={250} y={160} w={180} label="充电器" color={C.red} at={30} />
      <TokenBlock x={445} y={125} w={190} label="充电宝" color={C.red} at={48} />
      <TokenBlock x={840} y={155} w={160} label="插座" at={66} />
      <TokenBlock x={1020} y={118} w={180} label="遥控器" at={84} />
      <Operator x={620} y={345} at={92} action={0} />
      <Reveal at={125} style={{position: 'absolute', left: 0, right: 0, bottom: 10, textAlign: 'center'}}><InkText color={C.orange} style={{fontSize: 46}}>出现的可能性不同</InkText></Reveal>
    </>
  );
};

const GenerationLoop = () => (
  <>
    {['已有内容', '生成', '接上', '再预测', '再接上'].map((label, i) => (
      <TokenBlock key={label} x={85 + i * 260} y={215 + (i % 2) * 18} w={205} label={label} color={i % 2 ? C.blue : C.red} at={22 + i * 18} />
    ))}
    <Operator x={610} y={350} at={104} action={1} />
    <HandArrow x={960} y={420} width={260} at={116} color={C.red} />
    <Reveal at={135} style={{position: 'absolute', right: 110, bottom: 25}}><InkText color={C.red} style={{fontSize: 45}}>逐渐形成完整回答</InkText></Reveal>
  </>
);

const TokenChain = () => (
  <>
    {[
      ['我', 100, 110], ['赶紧', 245, 190], ['找', 485, 120], ['充电器', 660, 260], ['……', 970, 180],
    ].map(([label, x, w], i) => <TokenBlock key={String(label)} x={Number(x)} y={230 + (i % 2) * 18} w={Number(w)} label={String(label)} color={i % 2 ? C.blue : C.ink} at={20 + i * 16} />)}
    <Reveal at={90} style={{position: 'absolute', left: 185, top: 60}}><InkText color={C.red} style={{fontSize: 36}}>不是固定的字或词</InkText></Reveal>
    <Cross x={210} y={100} size={165} at={105} />
    <Reveal at={125} style={{position: 'absolute', left: 0, right: 0, bottom: 22, textAlign: 'center'}}><InkText color={C.red} style={{fontSize: 56, border: `4px solid ${C.red}`, borderRadius: '50%', display: 'inline-block', padding: '10px 45px'}}>Token 接龙</InkText></Reveal>
  </>
);

const Streaming = () => (
  <>
    <SketchBox x={180} y={80} w={285} h={300} at={20} fill={C.ink}><InkText color="#fff" style={{fontSize: 43}}>模型<br />正在生成</InkText></SketchBox>
    <Operator x={430} y={215} at={55} action={0} />
    <HandArrow x={485} y={220} width={250} at={60} />
    {['Token', 'Token', 'Token'].map((token, i) => <TokenBlock key={i} x={720 + i * 165} y={235 + i * 20} w={135} label={token} color={i === 2 ? C.red : C.blue} at={74 + i * 18} fontSize={29} />)}
    <Reveal at={128} style={{position: 'absolute', right: 85, bottom: 80}}><InkText color={C.red} style={{fontSize: 44}}>回答持续出现</InkText></Reveal>
    <Reveal at={150} style={{position: 'absolute', left: 0, right: 0, bottom: 5, textAlign: 'center'}}><InkText style={{fontSize: 31}}>不是预先写好的“打字效果”</InkText></Reveal>
  </>
);

const TokenUnit = () => (
  <>
    <SketchBox x={130} y={140} w={1140} h={135} at={22}><InkText style={{fontSize: 46}}>输入文本　→　处理　→　生成文本</InkText></SketchBox>
    <Reveal at={60} style={{position: 'absolute', left: 250, right: 250, top: 340}}>
      <div style={{height: 9, background: C.orange, position: 'relative'}}>{Array.from({length: 8}).map((_, i) => <div key={i} style={{position: 'absolute', left: `${i * 14.2}%`, top: -16, width: 5, height: i % 2 ? 32 : 46, background: C.orange}} />)}</div>
    </Reveal>
    <Reveal at={95} style={{position: 'absolute', left: 0, right: 0, bottom: 65, textAlign: 'center'}}><InkText color={C.red} style={{fontSize: 58}}>Token = 基本单位</InkText></Reveal>
  </>
);

const VariableToken = () => (
  <>
    <TokenBlock x={185} y={225} w={135} h={115} label="字" color={C.ink} at={22} fontSize={49} />
    <TokenBlock x={465} y={170} w={320} h={170} label="English word" color={C.blue} at={45} fontSize={40} />
    <TokenBlock x={950} y={240} w={105} h={95} label="%" color={C.red} at={68} fontSize={50} />
    <Reveal at={95} style={{position: 'absolute', left: 165, right: 165, top: 410, display: 'flex', justifyContent: 'space-between'}}><InkText color={C.red} style={{fontSize: 35}}>不一定</InkText><InkText color={C.red} style={{fontSize: 35}}>不固定</InkText></Reveal>
    <Reveal at={120} style={{position: 'absolute', left: 0, right: 0, bottom: 20, textAlign: 'center'}}><InkText color={C.red} style={{fontSize: 50}}>Token ≠ 固定字符</InkText></Reveal>
  </>
);

const Tokenizer = () => (
  <>
    <SketchBox x={50} y={215} w={410} h={125} color={C.blue} at={20}><InkText style={{fontSize: 38}}>手机只剩 1% 的电</InkText></SketchBox>
    <HandArrow x={460} y={235} width={190} at={45} />
    <SketchBox x={650} y={130} w={260} h={300} at={64} fill={C.ink}><InkText color="#fff" style={{fontSize: 40}}>Tokenizer<br />切分器</InkText></SketchBox>
    <Operator x={770} y={390} at={78} action={0} />
    <HandArrow x={910} y={235} width={170} at={94} />
    <TokenBlock x={1080} y={190} w={105} label="手机" at={110} />
    <TokenBlock x={1195} y={230} w={95} label="只剩" color={C.red} at={125} />
    <TokenBlock x={1297} y={184} w={105} label="1%" at={140} />
    <Reveal at={155} style={{position: 'absolute', left: 0, right: 0, bottom: 5, textAlign: 'center'}}><InkText color={C.red} style={{fontSize: 42}}>按词表与规则切分</InkText></Reveal>
  </>
);

const TokenizerDifference = () => (
  <>
    <SketchBox x={300} y={20} w={820} h={105} at={18}><InkText style={{fontSize: 40}}>手机只剩 1% 的电</InkText></SketchBox>
    <HandArrow x={620} y={125} width={170} at={42} />
    <SketchBox x={170} y={250} w={480} h={230} color={C.blue} at={62}><InkText color={C.blue} style={{fontSize: 35}}>手｜机｜只剩<br /><span style={{fontSize: 27}}>切法 A（示意）</span></InkText></SketchBox>
    <SketchBox x={770} y={250} w={480} h={230} color={C.red} at={82}><InkText color={C.red} style={{fontSize: 35}}>手机｜只剩<br /><span style={{fontSize: 27}}>切法 B（示意）</span></InkText></SketchBox>
    <Reveal at={125} style={{position: 'absolute', left: 0, right: 0, bottom: 10, textAlign: 'center'}}><InkText color={C.orange} style={{fontSize: 43}}>Tokenizer 不同，结果可能不同</InkText></Reveal>
  </>
);

const TokenId = () => (
  <>
    {[
      ['手机', 'ID ①'], ['只剩', 'ID ②'], ['1%', 'ID ③'], ['电', 'ID ④'],
    ].map(([token, id], i) => (
      <div key={token}>
        <TokenBlock x={150 + i * 290} y={210} w={190} label={token} color={i % 2 ? C.ink : C.blue} at={20 + i * 15} />
        <Reveal at={88 + i * 10} style={{position: 'absolute', left: 190 + i * 290, top: 340}}><InkText color={C.red} style={{fontSize: 34}}>{id}</InkText></Reveal>
      </div>
    ))}
    <Operator x={610} y={355} at={72} action={0} />
    <Reveal at={140} style={{position: 'absolute', left: 0, right: 0, bottom: 10, textAlign: 'center'}}><InkText color={C.red} style={{fontSize: 46}}>Token ID · 编号示意</InkText></Reveal>
  </>
);

const Codec = () => (
  <>
    <Reveal at={18} style={{position: 'absolute', left: 35, top: 250}}><InkText style={{fontSize: 41}}>人类文字</InkText></Reveal>
    <HandArrow x={200} y={255} width={160} at={35} />
    <SketchBox x={355} y={145} w={250} h={300} color={C.blue} at={48}><InkText color={C.blue} style={{fontSize: 43}}>编码<br /><span style={{fontSize: 31}}>ID ① · ID ②</span></InkText></SketchBox>
    <HandArrow x={600} y={255} width={145} at={72} />
    <Reveal at={84} style={{position: 'absolute', left: 745, top: 165}}><div style={{width: 250, height: 270, borderRadius: '50%', background: C.ink, display: 'grid', placeItems: 'center'}}><InkText color="#fff" style={{fontSize: 45}}>大模型</InkText></div></Reveal>
    <HandArrow x={990} y={255} width={130} at={104} />
    <SketchBox x={1115} y={145} w={250} h={300} color={C.red} at={118}><InkText color={C.red} style={{fontSize: 43}}>解码<br /><span style={{fontSize: 31}}>回答文字</span></InkText></SketchBox>
  </>
);

const SplitDemo = ({mixed}: {mixed?: boolean}) => {
  const blocks = mixed
    ? [['这个', 150], ['PPT', 140], ['明天要交', 220], ['帮我', 135], ['check', 170], ['。', 75]]
    : [['手机', 155], ['只剩', 150], ['1% 的电', 220], ['我', 110], ['赶紧找', 220], ['充电器', 190]];
  let x = mixed ? 95 : 70;
  return (
    <>
      {blocks.map(([label, width], i) => {
        const currentX = x;
        x += Number(width) + 22;
        return <TokenBlock key={`${label}-${i}`} x={currentX} y={225 + (i % 2) * 20} w={Number(width)} label={String(label)} color={i % 3 === 1 ? C.blue : i % 3 === 2 ? C.red : C.ink} at={20 + i * 16} fontSize={mixed && String(label) === 'PPT' ? 38 : 32} />;
      })}
      <Reveal at={125} style={{position: 'absolute', left: 0, right: 0, bottom: 34, textAlign: 'center'}}><InkText color={mixed ? C.orange : C.red} style={{fontSize: 44}}>切分示意 · {mixed ? '字符数 ≠ Token 数' : '不是一字一个'}</InkText></Reveal>
    </>
  );
};

const NotEqual = () => (
  <>
    <Reveal at={20} style={{position: 'absolute', left: 145, top: 180}}><InkText color={C.blue} style={{fontSize: 78}}>1M Token</InkText></Reveal>
    <Reveal at={44} style={{position: 'absolute', left: 655, top: 155}}><InkText style={{fontSize: 130}}>=</InkText></Reveal>
    <Reveal at={62} style={{position: 'absolute', right: 115, top: 180}}><InkText color={C.red} style={{fontSize: 72}}>100 万汉字</InkText></Reveal>
    <Operator x={640} y={345} at={76} action={1} />
    <Cross x={625} y={125} size={230} at={92} />
    <Reveal at={125} style={{position: 'absolute', left: 0, right: 0, bottom: 25, textAlign: 'center'}}><InkText color={C.red} style={{fontSize: 46}}>不能直接画等号</InkText></Reveal>
  </>
);

const ContextWindow = () => (
  <>
    <SketchBox x={80} y={125} w={300} h={105} color={C.blue} at={20}><InkText style={{fontSize: 34}}>PDF · 50 页</InkText></SketchBox>
    <SketchBox x={100} y={305} w={300} h={105} color={C.blue} at={42}><InkText style={{fontSize: 34}}>文章 · 2 万字</InkText></SketchBox>
    <HandArrow x={390} y={240} width={190} at={62} />
    <SketchBox x={570} y={80} w={570} h={430} at={80}><InkText style={{fontSize: 50, textAlign: 'center'}}>上下文窗口<br /><span style={{color: C.red}}>128K · 1M Token</span></InkText></SketchBox>
    <Reveal at={125} style={{position: 'absolute', right: 70, top: 230}}><InkText color={C.red} style={{fontSize: 40}}>容量用 Token 计算</InkText></Reveal>
  </>
);

const OutputLimit = () => (
  <>
    <SketchBox x={80} y={145} w={270} h={300} at={20} fill={C.ink}><InkText color="#fff" style={{fontSize: 48}}>模型</InkText></SketchBox>
    <HandArrow x={350} y={255} width={190} at={42} />
    {['Token', 'Token', 'Token', 'Token'].map((label, i) => <TokenBlock key={i} x={525 + i * 180} y={235 + (i % 2) * 15} w={145} label={label} color={i % 2 ? C.ink : C.blue} at={58 + i * 18} fontSize={28} />)}
    <Reveal at={128} style={{position: 'absolute', left: 1245, top: 120}}><div style={{width: 8, height: 390, background: C.red}} /></Reveal>
    <Reveal at={140} style={{position: 'absolute', right: 20, top: 250}}><InkText color={C.red} style={{fontSize: 39}}>输出上限</InkText></Reveal>
  </>
);

const TokenCost = () => (
  <>
    <TokenBlock x={190} y={180} w={230} h={120} label="输入 Token" color={C.blue} at={25} />
    <TokenBlock x={190} y={350} w={230} h={120} label="输出 Token" color={C.orange} at={50} />
    <HandArrow x={430} y={280} width={210} at={68} />
    <SketchBox x={650} y={80} w={460} h={450} at={84}>
      <InkText style={{fontSize: 46, textAlign: 'center'}}>API 用量表<br /><span style={{fontSize: 76, color: C.red}}>按量计费</span></InkText>
    </SketchBox>
    <Operator x={520} y={370} at={95} action={0} />
    <Reveal at={130} style={{position: 'absolute', right: 45, top: 245}}><InkText color={C.red} style={{fontSize: 38}}>输入 + 输出</InkText></Reveal>
  </>
);

const Summary = () => (
  <>
    {[
      ['输入文字', C.blue], ['切分 / 编码', C.orange], ['Token ID', C.red], ['预测 / 接续', C.blue], ['解码', C.orange], ['回答文字', C.red],
    ].map(([label, color], i) => (
      <div key={label}>
        <TokenBlock x={30 + i * 235} y={220 + (i % 2) * 16} w={190} label={label} color={color} at={18 + i * 17} fontSize={i === 1 || i === 3 ? 27 : 31} />
        {i < 5 ? <HandArrow x={216 + i * 235} y={240 + (i % 2) * 16} width={62} at={30 + i * 17} color={C.orange} /> : null}
      </div>
    ))}
    <Reveal at={135} style={{position: 'absolute', left: 0, right: 0, bottom: 25, textAlign: 'center'}}><InkText color={C.red} style={{fontSize: 48}}>切分/编码 → 预测/接续 → 解码</InkText></Reveal>
  </>
);

const SceneVisual = ({kind}: {kind: IanSceneKind}) => {
  switch (kind) {
    case 'daily-use': return <DailyUse />;
    case 'tasks-question': return <TaskQuestion />;
    case 'product-core': return <ProductCore />;
    case 'training-use': return <TrainingUse />;
    case 'prediction': return <Prediction />;
    case 'probability': return <Probability />;
    case 'generation-loop': return <GenerationLoop />;
    case 'token-chain': return <TokenChain />;
    case 'streaming': return <Streaming />;
    case 'token-unit': return <TokenUnit />;
    case 'variable-token': return <VariableToken />;
    case 'tokenizer': return <Tokenizer />;
    case 'tokenizer-difference': return <TokenizerDifference />;
    case 'token-id': return <TokenId />;
    case 'codec': return <Codec />;
    case 'zh-split': return <SplitDemo />;
    case 'mixed-split': return <SplitDemo mixed />;
    case 'not-equal': return <NotEqual />;
    case 'context-window': return <ContextWindow />;
    case 'output-limit': return <OutputLimit />;
    case 'token-cost': return <TokenCost />;
    case 'summary': return <Summary />;
  }
};

const IanScene = ({scene, index}: {scene: IanBlackboxScene; index: number}) => (
  <SceneShell scene={scene} index={index}>
    <SceneVisual kind={scene.kind} />
  </SceneShell>
);

export const Lesson1IanBlackboxWeb = () => (
  <Series>
    {IAN_BLACKBOX_SCENES.map((scene, index) => (
      <Series.Sequence key={scene.id} durationInFrames={scene.durationInFrames} premountFor={30}>
        <IanScene scene={scene} index={index} />
      </Series.Sequence>
    ))}
  </Series>
);
