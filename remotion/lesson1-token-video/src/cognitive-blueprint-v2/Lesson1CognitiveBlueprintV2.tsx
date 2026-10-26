import type {CSSProperties, ReactNode} from 'react';
import {
  AbsoluteFill,
  Img,
  Sequence,
  interpolate,
  staticFile,
} from 'remotion';
import {
  BLUEPRINT_V2_SCENES,
  BLUEPRINT_V2_SCENE_STARTS,
} from './storyboard';
import {cueFrame} from './cueSheet';
import {
  BlueprintBackground,
  BlueprintTimingProvider,
  Conclusion,
  DrawArrow,
  SceneShell,
  TokenBox,
  bp,
  bpFonts,
  enter,
  reveal,
  useBlueprintFrame,
} from './Visual';

const shadow = '0 20px 58px rgba(66, 101, 145, 0.12)';

const Body = ({children, style}: {children: ReactNode; style?: CSSProperties}) => (
  <div style={{position: 'absolute', inset: 0, ...style}}>{children}</div>
);

const BlueprintNode = ({
  children,
  start,
  color = bp.blue,
  width = 300,
  height = 180,
  dark = false,
  style,
}: {
  children: ReactNode;
  start: number;
  color?: string;
  width?: number;
  height?: number;
  dark?: boolean;
  style?: CSSProperties;
}) => {
  const frame = useBlueprintFrame();
  return (
    <div
      style={{
        ...enter(frame, start),
        width,
        height,
        borderRadius: 28,
        border: `3px solid ${dark ? bp.ink : color}`,
        background: dark ? bp.ink : bp.white,
        color: dark ? bp.white : bp.ink,
        boxShadow: shadow,
        display: 'grid',
        placeItems: 'center',
        textAlign: 'center',
        boxSizing: 'border-box',
        padding: 24,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

const Core = ({start = 50, label = 'MODEL'}: {start?: number; label?: string}) => {
  const frame = useBlueprintFrame();
  const p = reveal(frame, start, 24);
  return (
    <div
      style={{
        opacity: p,
        transform: `scale(${interpolate(p, [0, 1], [0.82, 1])})`,
        width: 250,
        height: 250,
        borderRadius: '50%',
        background: bp.ink,
        border: `4px solid ${bp.blueBright}`,
        boxShadow: shadow,
        color: bp.white,
        display: 'grid',
        placeItems: 'center',
        position: 'relative',
      }}
    >
      <div style={{textAlign: 'center'}}>
        <div
          style={{
            color: bp.blueBright,
            fontFamily: bpFonts.utility,
            fontSize: 20,
            letterSpacing: 3,
            marginBottom: 8,
          }}
        >
          AI CORE
        </div>
        <div style={{fontSize: 46, fontWeight: 850}}>{label}</div>
      </div>
    </div>
  );
};

const StageShell = ({
  index,
  chapter,
  duration,
  children,
}: {
  index: number;
  chapter: string;
  duration: number;
  children: ReactNode;
}) => {
  const frame = useBlueprintFrame();
  const opacity =
    reveal(frame, 0, 10) *
    interpolate(frame, [duration - 12, duration], [1, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
  return (
    <AbsoluteFill style={{fontFamily: bpFonts.display, color: bp.ink, opacity}}>
      <div
        style={{
          position: 'absolute',
          top: 48,
          left: 74,
          right: 74,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 24,
          fontWeight: 850,
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
          <span style={{width: 12, height: 12, borderRadius: '50%', background: bp.blue}} />
          第 1 课 · AI 工作原理
        </div>
        <div style={{color: bp.blue, letterSpacing: 2}}>{chapter}</div>
      </div>
      <div style={{position: 'absolute', inset: '118px 80px 88px'}}>{children}</div>
      <div
        style={{
          position: 'absolute',
          left: 74,
          right: 74,
          bottom: 48,
          height: 4,
          background: bp.line,
        }}
      >
        <div
          style={{
            width: `${((index + 1) / BLUEPRINT_V2_SCENES.length) * 100}%`,
            height: '100%',
            background: bp.blue,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

const ChatBubble = ({
  start,
  color,
  label,
  children,
  align = 'left',
  exitAt,
  style,
}: {
  start: number;
  color: string;
  label: string;
  children: ReactNode;
  align?: 'left' | 'right';
  exitAt?: number;
  style?: CSSProperties;
}) => {
  const frame = useBlueprintFrame();
  const p = reveal(frame, start, 22);
  const exit = exitAt === undefined ? 1 : 1 - reveal(frame, exitAt, 16);
  return (
    <div
      style={{
        opacity: p * exit,
        transform: `translateY(${(1 - p) * 18}px) scale(${interpolate(p, [0, 1], [0.96, 1])})`,
        position: 'absolute',
        width: 410,
        minHeight: 190,
        border: `3px solid ${color}`,
        borderRadius: align === 'left' ? '30px 30px 30px 8px' : '30px 30px 8px 30px',
        background: bp.white,
        boxShadow: shadow,
        padding: 28,
        boxSizing: 'border-box',
        textAlign: align,
        ...style,
      }}
    >
      <div style={{fontSize: 24, fontWeight: 850, color, marginBottom: 26}}>{label}</div>
      {children}
    </div>
  );
};

const ProductStage = ({
  start,
  namesStart,
  question = false,
}: {
  start: number;
  namesStart: number;
  question?: boolean;
}) => {
  const frame = useBlueprintFrame();
  const p = reveal(frame, start, 20);
  const names = reveal(frame, namesStart, 14);
  const q = question ? reveal(frame, cueFrame('L1-S01-C05'), 18) : 0;
  return (
    <div
      style={{
        opacity: p,
        transform: `translateY(${(1 - p) * 18}px) scale(${interpolate(p, [0, 1], [0.96, 1])})`,
        position: 'absolute',
        left: 620,
        top: 96,
        width: 520,
        height: 520,
        border: `4px solid ${bp.blue}`,
        background: bp.white,
        borderRadius: 38,
        boxShadow: shadow,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          height: 82,
          borderBottom: `2px solid ${bp.line}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: bpFonts.utility,
          fontSize: 28,
          fontWeight: 800,
          color: bp.blue,
          letterSpacing: 1,
        }}
      >
        <div
          style={{
            position: 'absolute',
            opacity: Math.min(1, 1 - names + q),
            fontFamily: bpFonts.display,
          }}
        >
          AI 产品
        </div>
        <div style={{opacity: names * (1 - q)}}>
          ChatGPT&nbsp;&nbsp;·&nbsp;&nbsp;DeepSeek&nbsp;&nbsp;·&nbsp;&nbsp;豆包
        </div>
      </div>
      <div style={{position: 'absolute', inset: '82px 0 0', opacity: 1 - q * 0.82}}>
        <div style={{position: 'absolute', left: 46, top: 58, width: 260, height: 26, borderRadius: 20, background: bp.blueSoft}} />
        <div style={{position: 'absolute', left: 46, top: 104, width: 360, height: 20, borderRadius: 20, background: bp.blueSoft}} />
        {[0, 1, 2, 3].map((item) => (
          <div
            key={item}
            style={{
              position: 'absolute',
              right: 46,
              top: 190 + item * 42,
              width: 310 - item * 34,
              height: 18,
              borderRadius: 20,
              background: item === 0 ? bp.greenSoft : bp.line,
            }}
          />
        ))}
      </div>
      {question ? (
        <div
          style={{
            opacity: q,
            transform: `scale(${interpolate(q, [0, 1], [0.72, 1])})`,
            position: 'absolute',
            inset: 82,
            display: 'grid',
            placeItems: 'center',
            color: bp.ink,
            fontFamily: bpFonts.utility,
            fontSize: 132,
            fontWeight: 850,
          }}
        >
          ?
        </div>
      ) : null}
    </div>
  );
};

const OpeningQuestionScene = () => {
  const frame = useBlueprintFrame();
  const inputAt = cueFrame('L1-S01-C02');
  const tasksAt = cueFrame('L1-S01-C03');
  const complexAt = cueFrame('L1-S01-C04');
  const questionAt = cueFrame('L1-S01-C05');
  const tasks = [
    {label: '写文章', start: tasksAt},
    {label: '总结资料', start: tasksAt + 18},
    {label: '修改文案', start: tasksAt + 36},
    {label: '解释问题', start: tasksAt + 54},
    {label: '分析任务', start: complexAt},
  ];

  return (
    <StageShell index={0} chapter="01 · 建立问题" duration={300}>
      <ProductStage
        start={cueFrame('L1-S01-C00')}
        namesStart={cueFrame('L1-S01-C01')}
        question
      />

      <ChatBubble
        start={inputAt}
        color={bp.blue}
        label="输入"
        exitAt={questionAt + 48}
        style={{left: 88, top: 250}}
      >
        <div style={{position: 'relative', height: 74}}>
          <div
            style={{
              opacity: 1 - reveal(frame, tasksAt, 10),
              position: 'absolute',
              inset: 0,
              fontSize: 46,
              fontWeight: 850,
            }}
          >
            一句话
          </div>
          {tasks.map((task, index) => {
            const next = tasks[index + 1]?.start ?? questionAt;
            const taskOpacity =
              reveal(frame, task.start, 7) *
              (1 - reveal(frame, next, 7));
            return (
              <div
                key={task.label}
                style={{
                  opacity: taskOpacity,
                  position: 'absolute',
                  inset: 0,
                  fontSize: 46,
                  fontWeight: 850,
                  color: index === tasks.length - 1 ? bp.coral : bp.ink,
                }}
              >
                {task.label}
              </div>
            );
          })}
        </div>
      </ChatBubble>

      <ChatBubble
        start={inputAt + 34}
        color={bp.green}
        label="回答"
        align="right"
        style={{right: 88, top: 250}}
      >
        <div style={{display: 'grid', gap: 15, justifyItems: 'end'}}>
          {[290, 330, 250].map((width, index) => (
            <div
              key={width}
              style={{
                opacity: reveal(frame, inputAt + 42 + index * 7, 8),
                width,
                height: 15,
                borderRadius: 20,
                background: index === 0 ? bp.green : bp.line,
              }}
            />
          ))}
        </div>
      </ChatBubble>

      <svg width="1760" height="874" viewBox="0 0 1760 874" style={{position: 'absolute', inset: 0}}>
        <path d="M 500 350 H 620" fill="none" stroke={bp.blue} strokeWidth="5" opacity={reveal(frame, inputAt + 8, 12)} />
        <path d="M 1140 350 H 1260" fill="none" stroke={bp.green} strokeWidth="5" opacity={reveal(frame, inputAt + 30, 12)} />
      </svg>
    </StageShell>
  );
};

const ToolMarker = ({label, start, left}: {label: string; start: number; left: number}) => {
  const frame = useBlueprintFrame();
  const p = reveal(frame, start, 14);
  return (
    <div
      style={{
        opacity: p,
        position: 'absolute',
        left,
        top: 122,
        width: 190,
        textAlign: 'center',
        fontSize: 34,
        fontWeight: 850,
        color: bp.ink,
      }}
    >
      <div style={{width: 22, height: 22, margin: '0 auto 18px', borderRadius: '50%', border: `5px solid ${bp.blue}`, background: bp.white}} />
      {label}
      <div style={{height: 4, marginTop: 18, background: bp.line}} />
    </div>
  );
};

const ProductModelScene = () => {
  const frame = useBlueprintFrame();
  const featuresAt = cueFrame('L1-S02-C02');
  const coreAt = cueFrame('L1-S02-C03');
  const core = reveal(frame, coreAt, 22);
  const toolLabels = ['聊天', '文件', '搜索', '语音'];
  return (
    <StageShell index={1} chapter="01 · 建立问题" duration={210}>
      <div
        style={{
          ...enter(frame, cueFrame('L1-S02-C01'), 12),
          position: 'absolute',
          left: 250,
          top: 36,
          width: 1260,
          height: 690,
          border: `4px solid ${bp.blue}`,
          borderRadius: 42,
          background: 'rgba(255,255,255,0.78)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: 86,
            borderBottom: `2px solid ${bp.line}`,
            display: 'grid',
            placeItems: 'center',
            fontSize: 34,
            fontWeight: 850,
            color: bp.blue,
          }}
        >
          AI 产品
        </div>
        <div style={{opacity: 1 - core * 0.72}}>
          {toolLabels.map((label, index) => (
            <ToolMarker key={label} label={label} start={featuresAt + index * 17} left={120 + index * 270} />
          ))}
          <div style={{position: 'absolute', left: 166, right: 166, top: 320, height: 230, border: `2px solid ${bp.line}`, background: bp.canvas}}>
            <div style={{position: 'absolute', left: 42, top: 42, width: 360, height: 28, background: bp.blueSoft}} />
            {[0, 1, 2].map((item) => (
              <div key={item} style={{position: 'absolute', right: 42, top: 100 + item * 38, width: 420 - item * 45, height: 16, background: bp.line}} />
            ))}
          </div>
        </div>
        <svg width="1260" height="690" viewBox="0 0 1260 690" style={{position: 'absolute', inset: 0}}>
          {[215, 485, 755, 1025].map((x, index) => (
            <path
              key={x}
              d={`M ${x} 260 V 330 H 630 V 395`}
              fill="none"
              stroke={[bp.blue, bp.coral, bp.green, bp.yellow][index]}
              strokeWidth="3"
              opacity={core}
            />
          ))}
        </svg>
        <div
          style={{
            opacity: core,
            transform: `translate(-50%, -50%) scale(${interpolate(core, [0, 1], [0.72, 1])})`,
            position: 'absolute',
            left: '50%',
            top: 452,
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: bp.ink,
            border: `5px solid ${bp.blueBright}`,
            color: bp.white,
            display: 'grid',
            placeItems: 'center',
            textAlign: 'center',
            boxShadow: shadow,
          }}
        >
          <div>
            <div style={{fontSize: 54, fontWeight: 850}}>大模型</div>
            <div style={{fontSize: 25, color: bp.blueBright, fontWeight: 850, marginTop: 18}}>核心能力</div>
          </div>
        </div>
      </div>
    </StageShell>
  );
};

const LlmPatternsScene = () => {
  const frame = useBlueprintFrame();
  const llmAt = cueFrame('L1-S03-C01');
  const dataAt = cueFrame('L1-S03-C02');
  const patternsAt = cueFrame('L1-S03-C03');
  const generateAt = cueFrame('L1-S03-C04');
  const questionAt = cueFrame('L1-S03-C05');
  const patternP = reveal(frame, patternsAt, 26);
  return (
    <StageShell index={2} chapter="02 · 认识模型" duration={210}>
      <div
        style={{
          opacity: reveal(frame, llmAt, 18) * 0.28,
          position: 'absolute',
          left: 250,
          top: 36,
          width: 1260,
          height: 690,
          border: `4px solid ${bp.blue}`,
          borderRadius: 42,
        }}
      />

      <div style={{position: 'absolute', left: 105, top: 204, width: 430, height: 360}}>
        <div style={{...enter(frame, dataAt), fontSize: 38, fontWeight: 850, color: bp.blue, textAlign: 'center', marginBottom: 34}}>海量数据</div>
        {[0, 1, 2, 3, 4].map((item) => (
          <div
            key={item}
            style={{
              ...enter(frame, dataAt + 8 + item * 8, 12),
              width: 350 - item * 24,
              height: 30,
              margin: '0 auto 20px',
              borderLeft: `10px solid ${[bp.blue, bp.green, bp.coral, bp.yellow, bp.blue][item]}`,
              background: bp.white,
              boxShadow: `0 8px 20px rgba(66,101,145,0.08)`,
            }}
          />
        ))}
      </div>

      <svg width="1760" height="874" viewBox="0 0 1760 874" style={{position: 'absolute', inset: 0}}>
        <path d="M 520 390 H 715" fill="none" stroke={bp.blue} strokeWidth="5" opacity={reveal(frame, dataAt + 18, 18)} />
        <path d="M 1045 390 H 1240" fill="none" stroke={bp.green} strokeWidth="5" opacity={reveal(frame, generateAt, 18)} />
      </svg>

      <div
        style={{
          ...enter(frame, llmAt, 12),
          position: 'absolute',
          left: 715,
          top: 210,
          width: 330,
          height: 330,
          borderRadius: '50%',
          background: bp.ink,
          border: `5px solid ${bp.blueBright}`,
          boxShadow: shadow,
          color: bp.white,
          display: 'grid',
          placeItems: 'center',
          overflow: 'hidden',
        }}
      >
        <svg width="330" height="330" viewBox="0 0 330 330" style={{position: 'absolute', inset: 0, opacity: patternP * 0.7}}>
          {[[78,100],[166,70],[245,112],[102,205],[214,225],[165,165]].map(([x,y], index) => (
            <g key={`${x}-${y}`}>
              {index < 5 ? <line x1={x} y1={y} x2={[166,245,214,165,165][index]} y2={[70,112,225,165,165][index]} stroke={bp.blueBright} strokeWidth="3" /> : null}
              <circle cx={x} cy={y} r="9" fill={index % 2 ? bp.green : bp.blueBright} />
            </g>
          ))}
        </svg>
        <div style={{position: 'relative', textAlign: 'center', textShadow: `0 2px 10px ${bp.ink}`}}>
          <div style={{fontFamily: bpFonts.utility, fontSize: 34, fontWeight: 850, color: bp.blueBright}}>LLM</div>
          <div style={{fontSize: 54, fontWeight: 850, marginTop: 12}}>大模型</div>
          <div style={{opacity: patternP, fontSize: 25, fontWeight: 850, color: bp.yellow, marginTop: 18}}>规律</div>
        </div>
      </div>

      <div style={{position: 'absolute', left: 1240, top: 275, width: 420}}>
        <div style={{opacity: reveal(frame, generateAt, 14), fontSize: 30, fontWeight: 850, color: bp.muted, marginBottom: 26}}>已有内容</div>
        <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
          {[112, 92, 72].map((width, index) => (
            <div
              key={width}
              style={{
                opacity: reveal(frame, generateAt + 8 + index * 10, 10),
                width,
                height: 34,
                background: index < 2 ? bp.line : bp.green,
                borderRadius: 6,
              }}
            />
          ))}
          <div
            style={{
              opacity: reveal(frame, questionAt, 12),
              fontFamily: bpFonts.utility,
              fontSize: 72,
              fontWeight: 850,
              color: bp.coral,
              marginLeft: 8,
            }}
          >
            ?
          </div>
        </div>
        <div style={{opacity: reveal(frame, generateAt + 24, 12), fontSize: 34, fontWeight: 850, color: bp.green, marginTop: 34}}>继续生成</div>
      </div>
    </StageShell>
  );
};

const PredictNextScene = () => {
  return (
    <SceneShell index={3} eyebrow="03 · 生成机制" title="接下来，最可能出现什么？" duration={210}>
      <Body style={{display:'flex',alignItems:'center',justifyContent:'center',gap:34}}>
        <BlueprintNode start={24} color={bp.blue} width={610} height={250}>
          <div><div style={{fontSize:30,color:bp.blue,fontWeight:850,marginBottom:24}}>已有内容</div><div style={{fontSize:48,fontWeight:850}}>手机只剩 <span style={{color:bp.coral}}>1%</span> 的电，<br/>我赶紧找……</div></div>
        </BlueprintNode>
        <DrawArrow start={62} width={150}/>
        <Core start={78} label="预测"/>
        <DrawArrow start={108} color={bp.green} width={150}/>
        <BlueprintNode start={126} color={bp.green} width={330} height={210}>
          <div style={{fontSize:48,fontWeight:850,color:bp.green}}>下一个？</div>
        </BlueprintNode>
      </Body>
    </SceneShell>
  );
};

const ProbabilityScene = () => {
  const frame = useBlueprintFrame();
  const items = [
    {label: '充电器', likelihood: '更可能', color: bp.green},
    {label: '充电宝', likelihood: '更可能', color: bp.green},
    {label: '插座', likelihood: '有可能', color: bp.blue},
    {label: '遥控器', likelihood: '不太可能', color: bp.muted},
  ];
  return (
    <SceneShell index={4} eyebrow="03 · 生成机制" title="不是所有答案，都一样可能" duration={240}>
      <Body style={{display:'flex',alignItems:'center',justifyContent:'center',gap:50}}>
        <BlueprintNode start={24} color={bp.blue} width={500} height={260}>
          <div><div style={{fontSize:30,color:bp.blue,fontWeight:850,marginBottom:24}}>已有内容</div><div style={{fontSize:44,fontWeight:850}}>手机只剩 1% 的电，<br/>我赶紧找……</div></div>
        </BlueprintNode>
        <DrawArrow start={58} width={150}/>
        <BlueprintNode start={76} width={420} height={390} dark>
          <div><div style={{fontSize:30,color:bp.blueBright,fontWeight:850}}>大模型</div><div style={{fontSize:52,fontWeight:850,marginTop:24}}>判断什么<br/>更可能出现</div></div>
        </BlueprintNode>
        <DrawArrow start={104} color={bp.green} width={130}/>
        <div style={{display:'grid',gridTemplateColumns:'repeat(2,240px)',gap:18}}>{items.map((item,i)=><div key={item.label} style={{...enter(frame,122+i*12),height:145,borderRadius:24,border:`3px solid ${item.color}`,background:bp.white,display:'grid',placeItems:'center',textAlign:'center',boxShadow:shadow}}><div><div style={{fontSize:38,fontWeight:850}}>{item.label}</div><div style={{fontSize:28,fontWeight:850,color:item.color,marginTop:12}}>{item.likelihood}</div></div></div>)}</div>
      </Body>
    </SceneShell>
  );
};

const GenerationLoopScene = () => {
  return (
    <SceneShell index={5} eyebrow="03 · 生成机制" title="预测 → 接上 → 再预测" duration={210}>
      <Body style={{display:'flex',alignItems:'center',justifyContent:'center',gap:22}}>
        <BlueprintNode start={24} color={bp.blue} width={290}><div><div style={{fontSize:28,color:bp.blue,fontWeight:850}}>第 1 步</div><div style={{fontSize:46,fontWeight:850,marginTop:18}}>预测</div></div></BlueprintNode>
        <DrawArrow start={48} width={110}/>
        <BlueprintNode start={65} color={bp.green} width={290}><div><div style={{fontSize:28,color:bp.green,fontWeight:850}}>第 2 步</div><div style={{fontSize:46,fontWeight:850,marginTop:18}}>接上</div></div></BlueprintNode>
        <DrawArrow start={82} color={bp.green} width={110}/>
        <BlueprintNode start={98} color={bp.blue} width={290}><div><div style={{fontSize:28,color:bp.blue,fontWeight:850}}>第 3 步</div><div style={{fontSize:46,fontWeight:850,marginTop:18}}>再预测</div></div></BlueprintNode>
        <DrawArrow start={116} color={bp.green} width={110}/>
        <BlueprintNode start={132} color={bp.green} width={330} height={220}><div style={{fontSize:46,fontWeight:850,color:bp.green}}>逐渐形成<br/>完整回答</div></BlueprintNode>
      </Body>
    </SceneShell>
  );
};

const TokenChainScene = () => {
  return (
    <SceneShell index={6} eyebrow="03 · 生成机制" title="它接的，不是一个个汉字" duration={210}>
      <Body style={{display:'flex',alignItems:'center',justifyContent:'center',gap:56}}>
        <BlueprintNode start={24} color={bp.muted} width={430} height={280}><div><div style={{fontSize:34,color:bp.muted,fontWeight:850}}>不是固定的</div><div style={{fontSize:58,fontWeight:850,marginTop:26}}>汉字 · 词</div></div></BlueprintNode>
        <BlueprintNode start={64} color={bp.coral} width={170} height={170} dark><div style={{fontSize:84,fontWeight:850,color:bp.coral}}>≠</div></BlueprintNode>
        <BlueprintNode start={94} color={bp.blue} width={500} height={320} dark><div><div style={{fontFamily:bpFonts.utility,fontSize:76,fontWeight:850,color:bp.blueBright,letterSpacing:6}}>TOKEN</div><div style={{fontSize:46,fontWeight:850,marginTop:26}}>真正接续的单位</div></div></BlueprintNode>
      </Body>
    </SceneShell>
  );
};

const StreamingScene = () => {
  const frame = useBlueprintFrame();
  const items = [
    {label: '我', color: bp.blue},
    {label: '来', color: bp.green},
    {label: '帮你', color: bp.coral},
    {label: '整理', color: bp.yellow},
    {label: '……', color: bp.muted},
  ];
  return (
    <SceneShell index={7} eyebrow="03 · 生成机制" title="为什么回答一点一点出现？" duration={210}>
      <Body>
        <div style={{position: 'absolute', left: 210, right: 210, top: 120, height: 5, background: bp.line}} />
        <div style={{position: 'absolute', left: 210, right: 210, top: 500, height: 5, background: bp.line}} />
        <div style={{position: 'absolute', left: 90, top: 105, color: bp.blue, fontFamily: bpFonts.utility, letterSpacing: 3}}>MODEL</div>
        <div style={{position: 'absolute', left: 90, top: 485, color: bp.green, fontFamily: bpFonts.utility, letterSpacing: 3}}>SCREEN</div>
        {items.map((item, i) => {
          const p = reveal(frame, 28 + i * 20, 20);
          const x = 350 + i * 260;
          return (
            <div key={item.label} style={{opacity: p}}>
              <div style={{position: 'absolute', left: x-20, top: 80, width: 122, height: 82, borderRadius: 18, background: bp.white, border: `3px solid ${item.color}`, display: 'grid', placeItems: 'center', color: item.color, fontSize: 28, fontWeight: 850}}>{item.label}</div>
              <div style={{position: 'absolute', left: x + 39, top: 164, height: 330 * p, borderLeft: `3px solid ${item.color}`}} />
              <div style={{position: 'absolute', left: x-20, top: 520, width: 122, height:70,borderRadius:16,border:`3px solid ${item.color}`,background:bp.white,display:'grid',placeItems:'center',textAlign: 'center', color: item.color, fontSize: 30, fontWeight: 850}}>{item.label}</div>
            </div>
          );
        })}
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 24, textAlign: 'center'}}>
          <Conclusion start={135} color={bp.green} background={bp.greenSoft} fontSize={40}>答案本身，正在持续生成</Conclusion>
        </div>
      </Body>
    </SceneShell>
  );
};

const TokenDefinitionScene = () => {
  return (
    <SceneShell index={8} eyebrow="04 · Token 流程" title="Token，是模型处理文本的单位" duration={210}>
      <Body style={{display:'flex',alignItems:'center',justifyContent:'center',gap:38}}>
        <BlueprintNode start={24} color={bp.blue} width={360} height={220}><div style={{fontSize:46,fontWeight:850}}>输入文字</div></BlueprintNode>
        <DrawArrow start={52} width={150}/>
        <BlueprintNode start={70} width={480} height={320} dark><div><div style={{fontFamily:bpFonts.utility,fontSize:70,fontWeight:850,color:bp.blueBright,letterSpacing:6}}>TOKEN</div><div style={{fontSize:38,fontWeight:850,marginTop:24}}>模型使用的基本单位</div></div></BlueprintNode>
        <DrawArrow start={105} color={bp.green} width={150}/>
        <BlueprintNode start={122} color={bp.green} width={400} height={220}><div style={{fontSize:46,fontWeight:850,color:bp.green}}>处理 · 生成</div></BlueprintNode>
      </Body>
    </SceneShell>
  );
};

const TokenSizeScene = () => {
  const rows = [
    {label: '汉字', color: bp.blue},
    {label: '单词', color: bp.green},
    {label: '字符', color: bp.yellow},
  ];
  return (
    <SceneShell index={9} eyebrow="04 · Token 流程" title="Token，没有固定大小" duration={210}>
      <Body style={{display:'grid',placeItems:'center'}}>
        <div style={{display:'grid',gap:22}}>{rows.map((row,i)=><div key={row.label} style={{display:'flex',alignItems:'center',gap:34}}><BlueprintNode start={26+i*20} color={row.color} width={330} height={125}><div style={{fontSize:42,fontWeight:850,color:row.color}}>{row.label}</div></BlueprintNode><div style={{fontSize:58,fontWeight:850,color:bp.coral}}>≠</div><BlueprintNode start={48+i*20} color={bp.blue} width={470} height={125}><div style={{fontFamily:bpFonts.utility,fontSize:44,fontWeight:850,letterSpacing:5}}>TOKEN</div></BlueprintNode></div>)}</div>
      </Body>
    </SceneShell>
  );
};

const TokenizerScene = () => {
  const frame = useBlueprintFrame();
  return (
    <SceneShell index={10} eyebrow="04 · Token 流程" title="Tokenizer：把文字切成 Token" duration={240}>
      <Body style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24}}>
        <div style={{...enter(frame, 22), width: 470, fontSize: 39, lineHeight: 1.45, fontWeight: 850}}>手机只剩 1% 的电，<br />我赶紧找充电器。</div>
        <DrawArrow start={48} width={120} />
        <div style={{...enter(frame, 65), width: 280, height: 360, borderRadius: 24, border: `4px solid ${bp.coral}`, background: bp.white, boxShadow: shadow, position: 'relative', display: 'grid', placeItems: 'center'}}>
          {Array.from({length: 7}, (_, i) => <div key={i} style={{position: 'absolute', left: 30 + i * 38, top: 30, width: 2, height: 300, background: bp.grid}} />)}
          <div style={{position: 'relative', color: bp.coral, fontFamily: bpFonts.utility, fontSize: 34, fontWeight: 850, lineHeight: 1.45, letterSpacing: 3, textAlign: 'center'}}>TOKEN<br />IZER</div>
        </div>
        <DrawArrow start={92} color={bp.green} width={120} />
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, auto)', gap: 16}}>
          <TokenBox start={110} color={bp.blue} width={170}>手机</TokenBox>
          <TokenBox start={122} color={bp.green} width={170}>只剩</TokenBox>
          <TokenBox start={134} color={bp.coral} width={170}>1%</TokenBox>
          <TokenBox start={146} color={bp.yellow} width={170}>的电…</TokenBox>
        </div>
      </Body>
    </SceneShell>
  );
};

const TokenizerDifferenceScene = () => {
  const frame = useBlueprintFrame();
  return (
    <SceneShell index={11} eyebrow="04 · Token 流程" title="同一句话，可以有不同切法" duration={240}>
      <Body style={{display:'grid',placeItems:'center'}}>
        <div style={{display:'grid',gap:34}}>
          <div style={{display:'flex',alignItems:'center',gap:28}}><BlueprintNode start={20} color={bp.blue} width={260} height={120}><div style={{fontFamily:bpFonts.utility,fontSize:30,fontWeight:850,color:bp.blue}}>TOKENIZER A</div></BlueprintNode><DrawArrow start={42} width={120}/><div style={{display:'flex',gap:12}}><TokenBox start={62} color={bp.blue} width={160}>手机</TokenBox><TokenBox start={72} color={bp.blue} width={100}>只</TokenBox><TokenBox start={82} color={bp.blue} width={100}>剩</TokenBox><TokenBox start={92} color={bp.blue} width={130}>1%</TokenBox><TokenBox start={102} color={bp.blue} width={170}>的电</TokenBox></div></div>
          <div style={{height:3,background:bp.line,marginLeft:300}} />
          <div style={{display:'flex',alignItems:'center',gap:28}}><BlueprintNode start={78} color={bp.coral} width={260} height={120}><div style={{fontFamily:bpFonts.utility,fontSize:30,fontWeight:850,color:bp.coral}}>TOKENIZER B</div></BlueprintNode><DrawArrow start={100} color={bp.coral} width={120}/><div style={{display:'flex',gap:12}}><TokenBox start={120} color={bp.coral} width={220}>手机只</TokenBox><TokenBox start={130} color={bp.coral} width={220}>剩 1%</TokenBox><TokenBox start={140} color={bp.coral} width={100}>的</TokenBox><TokenBox start={150} color={bp.coral} width={100}>电</TokenBox></div></div>
        </div>
      </Body>
    </SceneShell>
  );
};

const TokenIdScene = () => {
  const frame = useBlueprintFrame();
  const items = [
    {word: '手机', id: '3812', color: bp.blue},
    {word: '只剩', id: '9407', color: bp.green},
    {word: '1%', id: '126', color: bp.coral},
    {word: '的电', id: '5501', color: bp.yellow},
  ];
  return (
    <SceneShell index={12} eyebrow="04 · Token 流程" title="每个 Token，都有一个数字编号" duration={240}>
      <Body style={{display: 'flex', justifyContent: 'center', gap: 58, paddingTop: 90}}>
        {items.map((item, i) => {
          const p = reveal(frame, 28 + i * 18, 22);
          return (
            <div key={item.word} style={{opacity: p, transform: `translateY(${(1 - p) * 24}px)`, width: 310, textAlign: 'center'}}>
              <div style={{height: 190, borderRadius: 28, background: bp.white, border: `3px solid ${item.color}`, boxShadow: shadow, padding: 30, boxSizing: 'border-box'}}>
                <div style={{fontSize: 46, fontWeight: 850}}>{item.word}</div>
                <div style={{height: 2, background: item.color, opacity: 0.35, margin: '24px 0 18px'}} />
                <div style={{fontFamily: bpFonts.utility, fontSize: 28, fontWeight: 800, color: item.color, letterSpacing: 2}}>ID {item.id}</div>
              </div>
              <div style={{height: 125, width: 3, background: item.color, margin: '0 auto', transformOrigin: 'top', transform: `scaleY(${reveal(frame, 95 + i * 8, 22)})`}} />
              <div style={{width: 110, height: 92, borderRadius: 20, border: `3px solid ${item.color}`, background: bp.white, margin: '0 auto', display: 'grid', placeItems: 'center', color: item.color, fontFamily: bpFonts.utility, fontSize: 22, fontWeight: 850}}>{item.id}</div>
            </div>
          );
        })}
      </Body>
    </SceneShell>
  );
};

const EncodingScene = () => {
  return (
    <SceneShell index={13} eyebrow="04 · Token 流程" title="Encoding → Model → Decoding" duration={240}>
      <Body style={{display:'flex',alignItems:'center',justifyContent:'center',gap:9}}>
        <BlueprintNode start={18} color={bp.ink} width={180} height={145}><div style={{fontSize:34,fontWeight:850}}>人类文字</div></BlueprintNode>
        <DrawArrow start={34} width={64}/>
        <BlueprintNode start={48} color={bp.blue} width={170} height={165}><div><div style={{fontFamily:bpFonts.utility,fontSize:23,fontWeight:850,color:bp.blue}}>ENCODING</div><div style={{fontSize:34,fontWeight:850,marginTop:15}}>编码</div></div></BlueprintNode>
        <DrawArrow start={64} width={64}/>
        <BlueprintNode start={78} color={bp.yellow} width={200} height={165}><div><div style={{fontFamily:bpFonts.utility,fontSize:28,fontWeight:850,color:bp.yellow}}>TOKEN</div><div style={{fontSize:32,fontWeight:850,marginTop:12}}>+ ID</div></div></BlueprintNode>
        <DrawArrow start={94} color={bp.yellow} width={64}/>
        <BlueprintNode start={108} color={bp.green} width={210} height={200} dark><div><div style={{fontFamily:bpFonts.utility,fontSize:30,fontWeight:850,color:bp.blueBright}}>MODEL</div><div style={{fontSize:34,fontWeight:850,marginTop:16}}>处理 · 生成</div></div></BlueprintNode>
        <DrawArrow start={124} color={bp.green} width={64}/>
        <BlueprintNode start={138} color={bp.yellow} width={200} height={165}><div><div style={{fontFamily:bpFonts.utility,fontSize:28,fontWeight:850,color:bp.yellow}}>TOKEN</div><div style={{fontSize:32,fontWeight:850,marginTop:12}}>+ ID</div></div></BlueprintNode>
        <DrawArrow start={154} color={bp.coral} width={64}/>
        <BlueprintNode start={168} color={bp.coral} width={170} height={165}><div><div style={{fontFamily:bpFonts.utility,fontSize:23,fontWeight:850,color:bp.coral}}>DECODING</div><div style={{fontSize:34,fontWeight:850,marginTop:15}}>解码</div></div></BlueprintNode>
        <DrawArrow start={184} color={bp.green} width={64}/>
        <BlueprintNode start={198} color={bp.green} width={180} height={145}><div style={{fontSize:34,fontWeight:850,color:bp.green}}>可读回答</div></BlueprintNode>
      </Body>
    </SceneShell>
  );
};

const RealChineseScene = () => {
  const frame = useBlueprintFrame();
  return (
    <SceneShell index={14} eyebrow="05 · 真实验证" title="中文并非一字一 Token" duration={240}>
      <Body style={{textAlign:'center'}}>
        <div style={{...enter(frame,20),fontSize:46,fontWeight:850,marginTop:18}}>手机只剩1%的电，我赶紧找充电器</div>
        <div style={{display:'flex',justifyContent:'center',gap:34,marginTop:38}}>
          <div style={{...enter(frame,62),width:270,height:136,borderRadius:24,background:bp.white,border:`3px solid ${bp.blue}`,display:'grid',placeItems:'center',boxShadow:shadow}}><div><strong style={{fontFamily:bpFonts.utility,fontSize:60,color:bp.blue}}>16</strong><div style={{fontSize:30,fontWeight:800,color:bp.muted}}>Characters</div></div></div>
          <div style={{...enter(frame,82),width:270,height:136,borderRadius:24,background:bp.white,border:`3px solid ${bp.green}`,display:'grid',placeItems:'center',boxShadow:shadow}}><div><strong style={{fontFamily:bpFonts.utility,fontSize:60,color:bp.green}}>13</strong><div style={{fontSize:30,fontWeight:800,color:bp.muted}}>Tokens</div></div></div>
        </div>
        <div style={{...enter(frame,112),position:'relative',width:1250,height:118,overflow:'hidden',margin:'42px auto 0',borderRadius:18,border:`2px solid ${bp.line}`,background:bp.white,boxShadow:shadow}}>
          <Img src={staticFile('lesson1-v2/tokenizer-examples/chinese.png')} style={{position:'absolute',width:1250,height:'auto',left:0,top:-694}} />
        </div>
      </Body>
    </SceneShell>
  );
};

const MixedTextScene = () => {
  const frame = useBlueprintFrame();
  return (
    <SceneShell index={15} eyebrow="05 · 真实验证" title="中文、英文、空格、标点" duration={240}>
      <Body style={{textAlign:'center'}}>
        <div style={{...enter(frame,20),fontSize:46,fontWeight:850,marginTop:18}}>这个 PPT 明天要交，帮我 check 一下</div>
        <div style={{display:'flex',justifyContent:'center',gap:34,marginTop:38}}>
          <div style={{...enter(frame,58),width:270,height:136,borderRadius:24,background:bp.white,border:`3px solid ${bp.blue}`,display:'grid',placeItems:'center',boxShadow:shadow}}><div><strong style={{fontFamily:bpFonts.utility,fontSize:60,color:bp.blue}}>23</strong><div style={{fontSize:30,fontWeight:800,color:bp.muted}}>Characters</div></div></div>
          <div style={{...enter(frame,78),width:270,height:136,borderRadius:24,background:bp.white,border:`3px solid ${bp.coral}`,display:'grid',placeItems:'center',boxShadow:shadow}}><div><strong style={{fontFamily:bpFonts.utility,fontSize:60,color:bp.coral}}>12</strong><div style={{fontSize:30,fontWeight:800,color:bp.muted}}>Tokens</div></div></div>
        </div>
        <div style={{...enter(frame,108),position:'relative',width:1250,height:118,overflow:'hidden',margin:'42px auto 0',borderRadius:18,border:`2px solid ${bp.line}`,background:bp.white,boxShadow:shadow}}>
          <Img src={staticFile('lesson1-v2/tokenizer-examples/mixed.png')} style={{position:'absolute',width:1250,height:'auto',left:0,top:-694}} />
        </div>
      </Body>
    </SceneShell>
  );
};

const NotEqualScene = () => {
  return (
    <SceneShell index={16} eyebrow="05 · 真实验证" title="1M Token，不等于 100 万汉字" duration={210}>
      <Body style={{display:'flex',alignItems:'center',justifyContent:'center',gap:100}}>
        <BlueprintNode start={24} color={bp.blue} width={480} height={300}><div><div style={{fontFamily:bpFonts.utility,color:bp.blue,fontSize:112,fontWeight:850}}>1M</div><div style={{fontFamily:bpFonts.utility,color:bp.blue,fontSize:34,fontWeight:850,letterSpacing:5}}>TOKEN</div></div></BlueprintNode>
        <BlueprintNode start={58} color={bp.coral} width={180} height={180} dark><div style={{fontSize:92,fontWeight:850,color:bp.coral}}>≠</div></BlueprintNode>
        <BlueprintNode start={88} color={bp.yellow} width={480} height={300}><div><div style={{color:bp.yellow,fontSize:94,fontWeight:850}}>100 万</div><div style={{color:bp.yellow,fontSize:36,fontWeight:850,letterSpacing:5}}>汉字</div></div></BlueprintNode>
      </Body>
    </SceneShell>
  );
};

const ContextImpactScene = () => {
  const frame=useBlueprintFrame();
  return <SceneShell index={17} eyebrow="06 · 实际影响" title="AI 一次能处理多少内容？" duration={240}><Body>
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:40,paddingTop:78}}>
      <BlueprintNode start={24} color={bp.blue} width={420} height={280}><div><div style={{fontSize:46,fontWeight:850}}>50 页 PDF</div><div style={{height:3,background:bp.line,margin:'24px 0'}}/><div style={{fontSize:46,fontWeight:850}}>2 万字文章</div></div></BlueprintNode>
      <DrawArrow start={62} width={160}/>
      <BlueprintNode start={82} color={bp.blue} width={760} height={350}>
        <div style={{width:'100%'}}><div style={{fontFamily:bpFonts.utility,fontSize:76,fontWeight:850,color:bp.blue}}>128K · 1M</div><div style={{fontSize:40,fontWeight:850,marginTop:18}}>TOKEN 上下文长度</div><div style={{display:'grid',gridTemplateColumns:'repeat(8,1fr)',gap:10,marginTop:38}}>{Array.from({length:8},(_,i)=><div key={i} style={{...enter(frame,106+i*7),height:38,borderRadius:8,background:i<6?bp.blue:bp.blueSoft,border:`2px solid ${bp.blue}`}} />)}</div></div>
      </BlueprintNode>
    </div>
  </Body></SceneShell>;
};

const OutputImpactScene = () => {
  const frame=useBlueprintFrame();
  const tokens=['我','来','帮你','整理','这份','资料','……'];
  return <SceneShell index={18} eyebrow="06 · 实际影响" title="AI 一次能输出多长？" duration={240}><Body>
    <div style={{position:'absolute',left:120,right:120,top:120,height:5,background:bp.line}} />
    <div style={{display:'flex',justifyContent:'center',gap:22,paddingTop:92}}>{tokens.map((token,i)=><TokenBox key={token} start={28+i*19} color={[bp.blue,bp.green,bp.coral,bp.yellow,bp.blue,bp.green,bp.muted][i]} width={i===2||i===3?180:125}>{token}</TokenBox>)}</div>
    <div style={{...enter(frame,150),textAlign:'center',fontSize:40,fontWeight:850,color:bp.coral,marginTop:32}}>输出上限</div>
    <div style={{...enter(frame,164),width:16,height:190,margin:'18px auto 0',background:bp.coral,transform:`${enter(frame,164).transform} rotate(8deg)`,borderRadius:99}} />
  </Body></SceneShell>;
};

const CostImpactScene = () => {
  const frame=useBlueprintFrame();
  return <SceneShell index={19} eyebrow="06 · 实际影响" title="为什么使用成本按 Token 计算？" duration={240}><Body>
    <div style={{position:'absolute',left:240,top:58}}><BlueprintNode start={26} color={bp.blue} width={430} height={220}><div><div style={{fontSize:42,fontWeight:850}}>输入 Token</div><div style={{fontFamily:bpFonts.utility,color:bp.blue,fontSize:32,fontWeight:850,marginTop:22}}>¥ / 1M</div></div></BlueprintNode></div>
    <div style={{position:'absolute',right:240,top:58}}><BlueprintNode start={54} color={bp.green} width={430} height={220}><div><div style={{fontSize:42,fontWeight:850}}>输出 Token</div><div style={{fontFamily:bpFonts.utility,color:bp.green,fontSize:32,fontWeight:850,marginTop:22}}>¥ / 1M</div></div></BlueprintNode></div>
    <svg width="1776" height="746" viewBox="0 0 1776 746" style={{position:'absolute',inset:0}}><path d="M 455 278 V 330 H 888 V 385" fill="none" stroke={bp.blue} strokeWidth="4" opacity={reveal(frame,78,24)}/><path d="M 1321 278 V 330 H 888" fill="none" stroke={bp.green} strokeWidth="4" opacity={reveal(frame,98,24)}/></svg>
    <div style={{position:'absolute',left:668,top:385}}><BlueprintNode start={118} color={bp.yellow} width={440} height={260} dark><div><div style={{fontFamily:bpFonts.utility,fontSize:66,fontWeight:850,color:bp.yellow}}>TOKEN</div><div style={{fontSize:40,fontWeight:850,marginTop:20}}>分别统计用量<br/>计算费用</div></div></BlueprintNode></div>
  </Body></SceneShell>;
};

const FullChainScene = () => {
  const frame=useBlueprintFrame();
  const nodes=[
    {label:'文字',sub:'输入',color:bp.ink,width:125},
    {label:'TOKENIZER',sub:'切分',color:bp.blue,width:190},
    {label:'TOKEN / ID',sub:'编码后',color:bp.yellow,width:190},
    {label:'MODEL',sub:'预测生成',color:bp.green,width:190,dark:true},
    {label:'TOKEN / ID',sub:'模型输出',color:bp.yellow,width:190},
    {label:'解码',sub:'DECODING',color:bp.coral,width:155},
    {label:'回答',sub:'可读文字',color:bp.ink,width:125},
  ];
  return <SceneShell index={20} eyebrow="07 · 完整链路" title="从输入文字，到生成回答" duration={240}><Body style={{display:'flex',alignItems:'center',justifyContent:'center',gap:7}}>{nodes.map((node,i)=><div key={`${node.label}-${i}`} style={{display:'flex',alignItems:'center',gap:7}}><div style={{...enter(frame,20+i*17,16,.9),width:node.width,height:node.dark?200:170,borderRadius:22,background:node.dark?bp.ink:bp.white,border:`${node.dark?4:3}px solid ${node.color}`,boxShadow:node.dark?shadow:undefined,display:'grid',placeItems:'center',textAlign:'center',color:node.dark?bp.white:node.color,padding:'10px',boxSizing:'border-box'}}><div><div style={{fontFamily:/[A-Z]/.test(node.label)?bpFonts.utility:bpFonts.display,fontSize:node.label.length>8?23:31,fontWeight:850,letterSpacing:/[A-Z]/.test(node.label)?1:0}}>{node.label}</div><div style={{fontSize:23,fontWeight:850,marginTop:14,opacity:.78}}>{node.sub}</div></div></div>{i<nodes.length-1?<DrawArrow start={32+i*17} color={[bp.blue,bp.yellow,bp.green,bp.green,bp.coral,bp.ink][i]} width={62}/>:null}</div>)}</Body></SceneShell>;
};

const sceneComponents = [
  OpeningQuestionScene, ProductModelScene, LlmPatternsScene, PredictNextScene,
  ProbabilityScene, GenerationLoopScene, TokenChainScene, StreamingScene,
  TokenDefinitionScene, TokenSizeScene, TokenizerScene,
  TokenizerDifferenceScene, TokenIdScene, EncodingScene, RealChineseScene,
  MixedTextScene, NotEqualScene, ContextImpactScene, OutputImpactScene,
  CostImpactScene, FullChainScene,
] as const;

export const Lesson1CognitiveBlueprintV2 = () => (
  <AbsoluteFill>
    <BlueprintBackground />
    {BLUEPRINT_V2_SCENES.map((scene, index) => {
      const Component = sceneComponents[index];
      return (
        <Sequence
          key={scene.id}
          from={BLUEPRINT_V2_SCENE_STARTS[index]}
          durationInFrames={scene.frames}
          premountFor={30}
        >
          <BlueprintTimingProvider
            designDuration={scene.designFrames}
            actualDuration={scene.frames}
          >
            <Component />
          </BlueprintTimingProvider>
        </Sequence>
      );
    })}
  </AbsoluteFill>
);
