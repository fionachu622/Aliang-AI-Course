import type {CSSProperties, ReactNode} from 'react';
import {
  AbsoluteFill,
  Easing,
  Sequence,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {
  INFOGRAPHIC_SCENE_FRAMES,
  INFOGRAPHIC_SCENES,
} from './storyboard';

const colors = {
  ink: '#17223B',
  muted: '#64718B',
  blue: '#3377F5',
  blueSoft: '#E7F0FF',
  cyan: '#10A9C7',
  cyanSoft: '#E1F8FC',
  orange: '#FF8A3D',
  orangeSoft: '#FFF0E6',
  green: '#29A879',
  greenSoft: '#E5F8F0',
  purple: '#7868E6',
  purpleSoft: '#EFEDFF',
  white: '#FFFFFF',
  line: '#DCE4F0',
  canvas: '#F7F9FC',
};

const fontFamily = '"PingFang SC", "Microsoft YaHei", "Noto Sans CJK SC", sans-serif';
const ease = Easing.bezier(0.16, 1, 0.3, 1);

const progress = (frame: number, start: number, duration = 18) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    easing: ease,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

const enterStyle = (
  frame: number,
  start: number,
  options?: {distance?: number; scaleFrom?: number},
): CSSProperties => {
  const p = progress(frame, start);
  const distance = options?.distance ?? 30;
  return {
    opacity: p,
    transform: `translateY(${(1 - p) * distance}px) scale(${interpolate(
      p,
      [0, 1],
      [options?.scaleFrom ?? 0.96, 1],
    )})`,
  };
};

const Icon = ({type, color}: {type: 'chat' | 'spark' | 'bean' | 'file' | 'web' | 'voice'; color: string}) => {
  if (type === 'chat') {
    return (
      <svg viewBox="0 0 64 64" width="44" height="44" aria-hidden="true">
        <path d="M12 14h40v28H29L18 51v-9h-6z" fill="none" stroke={color} strokeWidth="5" strokeLinejoin="round" />
        <circle cx="24" cy="28" r="3" fill={color} />
        <circle cx="32" cy="28" r="3" fill={color} />
        <circle cx="40" cy="28" r="3" fill={color} />
      </svg>
    );
  }
  if (type === 'spark') {
    return (
      <svg viewBox="0 0 64 64" width="44" height="44" aria-hidden="true">
        <path d="M32 7c2 13 10 21 23 25-13 3-21 11-23 25-3-14-11-22-24-25 13-4 21-12 24-25Z" fill={color} />
      </svg>
    );
  }
  if (type === 'bean') {
    return (
      <svg viewBox="0 0 64 64" width="44" height="44" aria-hidden="true">
        <path d="M47 13c10 10 6 29-5 38-10 8-27 6-30-6-3-13 7-31 20-36 6-2 11 0 15 4Z" fill={color} />
        <path d="M24 19c-3 11 3 23 16 27" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" opacity="0.85" />
      </svg>
    );
  }
  const paths = {
    file: <path d="M19 10h19l10 10v34H19zM38 10v11h10M26 32h15M26 41h15" fill="none" stroke={color} strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" />,
    web: <><circle cx="32" cy="32" r="22" fill="none" stroke={color} strokeWidth="4" /><path d="M10 32h44M32 10c8 7 10 35 0 44M32 10c-8 7-10 35 0 44" fill="none" stroke={color} strokeWidth="3" /></>,
    voice: <><rect x="24" y="9" width="16" height="31" rx="8" fill="none" stroke={color} strokeWidth="4" /><path d="M17 31c0 10 6 16 15 16s15-6 15-16M32 47v9M24 56h16" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" /></>,
  };
  return <svg viewBox="0 0 64 64" width="44" height="44" aria-hidden="true">{paths[type]}</svg>;
};

const Background = () => {
  const frame = useCurrentFrame();
  const drift = interpolate(frame, [0, 540], [0, 28], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{backgroundColor: colors.canvas, overflow: 'hidden'}}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.42,
          backgroundImage: `radial-gradient(${colors.line} 1.8px, transparent 1.8px)`,
          backgroundSize: '34px 34px',
          transform: `translate(${drift}px, ${drift * 0.45}px)`,
        }}
      />
      <div style={{position: 'absolute', width: 560, height: 560, borderRadius: 999, background: colors.blueSoft, top: -330, right: -130, opacity: 0.85}} />
      <div style={{position: 'absolute', width: 420, height: 420, borderRadius: 999, background: colors.orangeSoft, bottom: -270, left: -120, opacity: 0.75}} />
    </AbsoluteFill>
  );
};

const Shell = ({scene, children}: {scene: number; children: ReactNode}) => {
  const frame = useCurrentFrame();
  const exit = interpolate(frame, [INFOGRAPHIC_SCENE_FRAMES - 14, INFOGRAPHIC_SCENE_FRAMES], [1, 0], {
    easing: Easing.in(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const enter = progress(frame, 0, 10);
  return (
    <AbsoluteFill style={{fontFamily, color: colors.ink, opacity: enter * exit}}>
      <div style={{position: 'absolute', top: 46, left: 70, right: 70, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, fontSize: 23, fontWeight: 700, letterSpacing: 1}}>
          <span style={{width: 12, height: 12, borderRadius: 99, background: colors.blue}} />
          第 1 课 · 认识大模型
        </div>
        <div style={{fontSize: 21, color: colors.muted, fontVariantNumeric: 'tabular-nums'}}>0{scene} / 03</div>
      </div>
      <div style={{position: 'absolute', inset: '102px 70px 84px'}}>{children}</div>
      <div style={{position: 'absolute', left: 70, right: 70, bottom: 48, height: 5, borderRadius: 99, background: '#E5EAF2', overflow: 'hidden'}}>
        <div style={{height: '100%', width: `${(scene / INFOGRAPHIC_SCENES.length) * 100}%`, borderRadius: 99, background: colors.blue}} />
      </div>
    </AbsoluteFill>
  );
};

const SceneTitle = ({kicker, children, start = 6}: {kicker: string; children: ReactNode; start?: number}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{...enterStyle(frame, start, {distance: 20}), textAlign: 'center'}}>
      <div style={{fontSize: 25, fontWeight: 700, color: colors.blue, letterSpacing: 2, marginBottom: 10}}>{kicker}</div>
      <div style={{fontSize: 66, lineHeight: 1.12, fontWeight: 850, letterSpacing: -2}}>{children}</div>
    </div>
  );
};

const ProductCard = ({name, caption, type, color, soft, start}: {name: string; caption: string; type: 'chat' | 'spark' | 'bean'; color: string; soft: string; start: number}) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        ...enterStyle(frame, start, {distance: 34, scaleFrom: 0.92}),
        width: 350,
        height: 205,
        background: colors.white,
        border: `2px solid ${colors.line}`,
        borderRadius: 30,
        boxShadow: '0 18px 50px rgba(35, 54, 92, 0.09)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
      }}
    >
      <div style={{width: 78, height: 78, borderRadius: 25, background: soft, display: 'grid', placeItems: 'center'}}><Icon type={type} color={color} /></div>
      <div style={{fontSize: 34, fontWeight: 850}}>{name}</div>
      <div style={{fontSize: 22, color: colors.muted}}>{caption}</div>
    </div>
  );
};

const AbilityChip = ({children, color, soft, start}: {children: ReactNode; color: string; soft: string; start: number}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{...enterStyle(frame, start, {distance: 18}), fontSize: 26, fontWeight: 750, color, background: soft, border: `2px solid ${color}22`, borderRadius: 99, padding: '14px 28px'}}>
      {children}
    </div>
  );
};

const QuestionBanner = ({children, start}: {children: ReactNode; start: number}) => {
  const frame = useCurrentFrame();
  const p = progress(frame, start, 20);
  return (
    <div
      style={{
        opacity: p,
        transform: `translateY(${(1 - p) * 24}px) scale(${0.94 + p * 0.06})`,
        background: colors.ink,
        color: colors.white,
        borderRadius: 28,
        padding: '21px 48px 24px',
        fontSize: 38,
        fontWeight: 800,
        boxShadow: '0 20px 45px rgba(23, 34, 59, 0.18)',
      }}
    >
      <span style={{color: '#78C7FF', marginRight: 16}}>?</span>{children}
    </div>
  );
};

const SceneOne = () => (
  <Shell scene={1}>
    <SceneTitle kicker="每天都在使用">你已经很熟悉 AI 产品</SceneTitle>
    <div style={{position: 'absolute', top: 190, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 32}}>
      <ProductCard name="ChatGPT" caption="对话式 AI" type="chat" color={colors.green} soft={colors.greenSoft} start={28} />
      <ProductCard name="DeepSeek" caption="推理与问答" type="spark" color={colors.blue} soft={colors.blueSoft} start={38} />
      <ProductCard name="豆包" caption="日常智能助手" type="bean" color={colors.orange} soft={colors.orangeSoft} start={48} />
    </div>
    <div style={{position: 'absolute', top: 430, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 18}}>
      <AbilityChip color={colors.blue} soft={colors.blueSoft} start={70}>写作</AbilityChip>
      <AbilityChip color={colors.green} soft={colors.greenSoft} start={77}>总结</AbilityChip>
      <AbilityChip color={colors.orange} soft={colors.orangeSoft} start={84}>改文案</AbilityChip>
      <AbilityChip color={colors.purple} soft={colors.purpleSoft} start={91}>解问题</AbilityChip>
    </div>
    <div style={{position: 'absolute', top: 550, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
      <QuestionBanner start={112}>它们背后，到底是什么？</QuestionBanner>
    </div>
  </Shell>
);

const FlowCard = ({label, text, color, soft, start, align}: {label: string; text: string; color: string; soft: string; start: number; align: 'left' | 'right'}) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        ...enterStyle(frame, start, {distance: 24}),
        width: 430,
        minHeight: 205,
        boxSizing: 'border-box',
        background: colors.white,
        border: `3px solid ${color}`,
        borderRadius: 32,
        padding: 30,
        boxShadow: '0 18px 50px rgba(35, 54, 92, 0.08)',
        textAlign: align,
      }}
    >
      <div style={{display: 'inline-block', padding: '8px 16px', borderRadius: 99, background: soft, color, fontSize: 21, fontWeight: 800, marginBottom: 22}}>{label}</div>
      <div style={{fontSize: 32, lineHeight: 1.35, fontWeight: 750}}>{text}</div>
    </div>
  );
};

const Arrow = ({start, color = colors.blue}: {start: number; color?: string}) => {
  const frame = useCurrentFrame();
  const p = progress(frame, start, 20);
  return (
    <svg width="220" height="80" viewBox="0 0 220 80" style={{overflow: 'visible'}} aria-hidden="true">
      <path d="M8 40H198" stroke={colors.line} strokeWidth="8" strokeLinecap="round" />
      <path d="M8 40H198" stroke={color} strokeWidth="8" strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - p} />
      <path d="m183 20 24 20-24 20" fill="none" stroke={color} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" opacity={p} />
    </svg>
  );
};

const ProcessingCore = () => {
  const frame = useCurrentFrame();
  const p = progress(frame, 61, 22);
  const pulse = interpolate(Math.sin((frame - 61) / 8), [-1, 1], [0.96, 1.03]);
  return (
    <div style={{opacity: p, transform: `scale(${p * pulse})`, width: 230, height: 230, borderRadius: 999, background: colors.ink, color: colors.white, display: 'grid', placeItems: 'center', boxShadow: '0 20px 60px rgba(23, 34, 59, 0.22)', position: 'relative'}}>
      <div style={{position: 'absolute', inset: -18, border: `3px dashed ${colors.blue}`, borderRadius: 999, opacity: 0.45, transform: `rotate(${frame * 0.7}deg)`}} />
      <div style={{textAlign: 'center'}}>
        <div style={{fontSize: 25, color: '#A9C9FF', fontWeight: 700, marginBottom: 7}}>AI 黑盒</div>
        <div style={{fontSize: 38, fontWeight: 850}}>处理中</div>
        <div style={{fontSize: 30, letterSpacing: 7, color: '#79C7FF'}}>•••</div>
      </div>
    </div>
  );
};

const SceneTwo = () => (
  <Shell scene={2}>
    <SceneTitle kicker="从输入到输出">一句话，如何变成回答？</SceneTitle>
    <div style={{position: 'absolute', top: 260, left: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 30}}>
      <FlowCard label="你的输入" text="帮我总结这份资料" color={colors.blue} soft={colors.blueSoft} start={28} align="left" />
      <div style={{display: 'flex', alignItems: 'center', margin: '0 -12px'}}><Arrow start={48} /></div>
      <ProcessingCore />
      <div style={{display: 'flex', alignItems: 'center', margin: '0 -12px'}}><Arrow start={82} color={colors.green} /></div>
      <FlowCard label="AI 的输出" text="当然可以……" color={colors.green} soft={colors.greenSoft} start={98} align="right" />
    </div>
    <div style={{position: 'absolute', top: 610, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
      <QuestionBanner start={126}>中间，到底发生了什么？</QuestionBanner>
    </div>
  </Shell>
);

const Feature = ({type, label, color, soft, start}: {type: 'chat' | 'file' | 'web' | 'voice'; label: string; color: string; soft: string; start: number}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{...enterStyle(frame, start, {distance: 22}), width: 240, height: 110, borderRadius: 24, background: colors.white, border: `2px solid ${colors.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, boxShadow: '0 12px 36px rgba(35, 54, 92, 0.07)'}}>
      <div style={{width: 58, height: 58, borderRadius: 18, background: soft, display: 'grid', placeItems: 'center'}}><Icon type={type} color={color} /></div>
      <div style={{fontSize: 25, fontWeight: 800}}>{label}</div>
    </div>
  );
};

const ModelCore = () => {
  const frame = useCurrentFrame();
  const p = progress(frame, 92, 24);
  return (
    <div style={{opacity: p, transform: `scale(${0.86 + p * 0.14})`, width: 510, height: 205, borderRadius: 36, background: colors.ink, color: colors.white, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', boxShadow: '0 24px 70px rgba(23, 34, 59, 0.22)'}}>
      <div style={{position: 'absolute', top: 18, left: 22, padding: '7px 13px', borderRadius: 99, background: '#2C3A5A', color: '#AECBFF', fontSize: 18, fontWeight: 700}}>核心能力</div>
      <div style={{fontSize: 38, fontWeight: 850, marginBottom: 20}}>大模型</div>
      <div style={{display: 'flex', alignItems: 'center', gap: 18, fontSize: 26, fontWeight: 750}}>
        <span style={{padding: '10px 18px', borderRadius: 14, background: '#304467'}}>理解内容</span>
        <span style={{color: '#7EC8FF'}}>→</span>
        <span style={{padding: '10px 18px', borderRadius: 14, background: '#304467'}}>生成回答</span>
      </div>
    </div>
  );
};

const SceneThree = () => {
  const frame = useCurrentFrame();
  const shell = progress(frame, 66, 20);
  return (
    <Shell scene={3}>
      <SceneTitle kicker="先分清两个概念">你用的是产品，背后是大模型</SceneTitle>
      <div style={{position: 'absolute', top: 175, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 18}}>
        <Feature type="chat" label="聊天窗口" color={colors.blue} soft={colors.blueSoft} start={26} />
        <Feature type="file" label="文件上传" color={colors.orange} soft={colors.orangeSoft} start={34} />
        <Feature type="web" label="联网搜索" color={colors.green} soft={colors.greenSoft} start={42} />
        <Feature type="voice" label="语音对话" color={colors.purple} soft={colors.purpleSoft} start={50} />
      </div>
      <div style={{position: 'absolute', top: 320, left: '50%', width: 730, height: 310, transform: `translateX(-50%) scale(${0.96 + shell * 0.04})`, opacity: shell, border: `3px solid ${colors.blue}`, borderRadius: 46, background: 'rgba(255,255,255,0.82)', boxShadow: '0 18px 55px rgba(35, 54, 92, 0.08)', display: 'grid', placeItems: 'center'}}>
        <div style={{position: 'absolute', top: 18, left: 24, color: colors.blue, fontSize: 22, fontWeight: 850}}>AI 产品 · 入口</div>
        <ModelCore />
      </div>
      <div style={{position: 'absolute', top: 665, left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 18, ...enterStyle(frame, 126, {distance: 20})}}>
        <div style={{padding: '15px 28px', borderRadius: 99, background: colors.blueSoft, color: colors.blue, fontSize: 29, fontWeight: 850}}>产品 = 入口</div>
        <div style={{fontSize: 30, color: colors.muted}}>·</div>
        <div style={{padding: '15px 28px', borderRadius: 99, background: colors.orangeSoft, color: colors.orange, fontSize: 29, fontWeight: 850}}>大模型 = 核心能力</div>
      </div>
    </Shell>
  );
};

export const Lesson1Infographic = () => {
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill>
      <Background />
      <Sequence from={0} durationInFrames={INFOGRAPHIC_SCENE_FRAMES} premountFor={fps}>
        <SceneOne />
      </Sequence>
      <Sequence from={INFOGRAPHIC_SCENE_FRAMES} durationInFrames={INFOGRAPHIC_SCENE_FRAMES} premountFor={fps}>
        <SceneTwo />
      </Sequence>
      <Sequence from={INFOGRAPHIC_SCENE_FRAMES * 2} durationInFrames={INFOGRAPHIC_SCENE_FRAMES} premountFor={fps}>
        <SceneThree />
      </Sequence>
    </AbsoluteFill>
  );
};

