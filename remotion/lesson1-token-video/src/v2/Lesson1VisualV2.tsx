import type {CSSProperties, ReactNode} from 'react';
import {Series, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {FPS} from '../timeline';
import {V2_SHOTS} from './storyboard';
import {
  Appear,
  Arrow,
  BigNode,
  Bubble,
  CenterStack,
  FocusWord,
  ShotShell,
  Subline,
  TokenPiece,
  useEnter,
  v2Colors,
} from './VisualV2';

const total = V2_SHOTS.length;

const Row = ({children, gap = 28, style}: {children: ReactNode; gap?: number; style?: CSSProperties}) => (
  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap, ...style}}>{children}</div>
);

const Hook = () => (
  <CenterStack gap={34}>
    <Appear at={0.3}>
      <Bubble color={v2Colors.blue} style={{fontSize: 42, padding: '18px 42px'}}>一句话进去</Bubble>
    </Appear>
    <Appear at={1.7}>
      <Arrow color={v2Colors.faint} width={180} />
    </Appear>
    <Appear at={2.8}>
      <Bubble color={v2Colors.cyan} style={{fontSize: 42, padding: '18px 42px'}}>一段回答出来</Bubble>
    </Appear>
    <Appear at={4.4}>
      <FocusWord size={82}>中间发生了什么？</FocusWord>
    </Appear>
  </CenterStack>
);

const Product = () => {
  const core = useEnter(5.5, 24);
  return (
    <CenterStack gap={34}>
      <Appear at={0.3}><Subline>我们直接使用的是</Subline></Appear>
      <Appear at={1}>
        <div
          style={{
            width: 1050,
            height: 430,
            border: `3px solid ${v2Colors.violet}`,
            borderRadius: 14,
            backgroundColor: v2Colors.bg2,
            backgroundImage: `radial-gradient(circle, ${v2Colors.violet}24 1.2px, transparent 1.5px)`,
            backgroundSize: '16px 16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 46,
            position: 'relative',
          }}
        >
          <FocusWord
            size={88}
            color={v2Colors.coral}
            style={{position: 'absolute', top: 46, left: 0, right: 0}}
          >
            AI 产品
          </FocusWord>
          <Row gap={22} style={{position: 'absolute', top: 170, left: 0, right: 0}}>
            {['聊天', '文件', '搜索', '语音'].map((x, i) => (
              <Appear key={x} at={2 + i * 0.55}>
                <Bubble color={v2Colors.faint} style={{fontSize: 29, minHeight: 58}}>{x}</Bubble>
              </Appear>
            ))}
          </Row>
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: 264,
              width: 250 + core * 38,
              height: 118 + core * 14,
              borderRadius: 8,
              border: `3px solid ${v2Colors.cyan}`,
              background: v2Colors.cyan,
              opacity: core,
              transform: `translateX(-50%) scale(${0.88 + core * 0.12})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 44,
              fontWeight: 850,
              color: v2Colors.bg,
              boxShadow: `0 0 ${55 * core}px ${v2Colors.cyan}22`,
            }}
          >
            大模型
          </div>
        </div>
      </Appear>
      <Appear at={7.4}><Subline>产品背后的核心能力之一</Subline></Appear>
    </CenterStack>
  );
};

const Llm = () => (
  <CenterStack gap={32}>
    <Appear at={0.3}><FocusWord size={156} color={v2Colors.violet}>LLM</FocusWord></Appear>
    <Appear at={1.6}><Subline style={{fontSize: 39}}>Large Language Model · 大语言模型</Subline></Appear>
    <Row gap={42} style={{marginTop: 40}}>
      <Appear at={3.3}>
        <BigNode color={v2Colors.blue} style={{width: 430, minHeight: 160}}>学过大量规律</BigNode>
      </Appear>
      <Appear at={5.2}><Arrow width={120} /></Appear>
      <Appear at={6.1}>
        <BigNode color={v2Colors.cyan} style={{width: 430, minHeight: 160}}>继续生成内容</BigNode>
      </Appear>
    </Row>
  </CenterStack>
);

const Candidates = () => (
  <CenterStack gap={38}>
    <Appear at={0.2}>
      <FocusWord size={65} style={{letterSpacing: -2}}>手机只剩 1% 的电，我赶紧找<span style={{color: v2Colors.coral}}>……</span></FocusWord>
    </Appear>
    <Row gap={24} style={{height: 105}}>
      {[
        ['充电器', v2Colors.cyan, 1.7],
        ['充电宝', v2Colors.cyan, 2.5],
        ['插座', v2Colors.blue, 3.3],
        ['数据线', v2Colors.blue, 4.1],
        ['遥控器', v2Colors.faint, 5.9],
      ].map(([x, color, at]) => (
        <Appear key={String(x)} at={Number(at)}>
          <Bubble color={String(color)} style={{fontSize: 36}}>{x}</Bubble>
        </Appear>
      ))}
    </Row>
    <Appear at={7.2}>
      <Row gap={34}>
        <BigNode color={v2Colors.blue} style={{minWidth: 360}}>已有内容</BigNode>
        <span style={{fontSize: 62, color: v2Colors.muted}}>+</span>
        <BigNode color={v2Colors.violet} style={{minWidth: 360}}>学到的规律</BigNode>
      </Row>
    </Appear>
    <Appear at={9.1}>
      <Subline style={{fontSize: 42, color: v2Colors.cyan}}>判断：下一个更可能是什么</Subline>
    </Appear>
  </CenterStack>
);

const GenerationLoop = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const active = Math.max(0, Math.min(3, Math.floor((frame / fps - 1.2) / 1.75)));
  const labels = ['预测', '生成一个', '接回去', '再预测'];
  return (
    <CenterStack gap={54}>
      <Appear at={0.2}><Subline>答案不是一次写完</Subline></Appear>
      <Row gap={18}>
        {labels.map((label, i) => (
          <div key={label} style={{display: 'flex', alignItems: 'center', gap: 18}}>
            <Appear at={1.2 + i * 1.75}>
              <BigNode
                color={i <= active ? (i === active ? v2Colors.cyan : v2Colors.blue) : v2Colors.faint}
                style={{minWidth: 260, minHeight: 140, fontSize: 38, opacity: i === active ? 1 : 0.58}}
              >
                {label}
              </BigNode>
            </Appear>
            {i < 3 ? <Appear at={2.1 + i * 1.75}><Arrow width={75} /></Appear> : null}
          </div>
        ))}
      </Row>
      <Appear at={8.5}><FocusWord size={92} color={v2Colors.cyan}>Token 接龙</FocusWord></Appear>
    </CenterStack>
  );
};

const Stream = () => (
  <CenterStack gap={52}>
    <Appear at={0.3}><Subline>模型每生成一个 Token</Subline></Appear>
    <div
      style={{
        width: 1250,
        minHeight: 180,
        borderRadius: 38,
        border: `2px solid ${v2Colors.line}`,
        background: v2Colors.surface,
        padding: 42,
        display: 'flex',
        gap: 14,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {['手机', '快', '没电', '了', '，', '我', '得', '找', '充电器'].map((x, i) => (
        <Appear key={`${x}-${i}`} at={1.3 + i * 0.55} fromY={0} scaleFrom={0.75}>
          <TokenPiece text={x} color={i === 8 ? v2Colors.cyan : v2Colors.blue} />
        </Appear>
      ))}
    </div>
    <Appear at={6.9}><FocusWord size={78}>界面就显示一点</FocusWord></Appear>
    <Appear at={8}><Subline style={{color: v2Colors.coral}}>不是预先写完后的打字动画</Subline></Appear>
  </CenterStack>
);

const TokenIntro = () => (
  <CenterStack gap={36}>
    <Appear at={0.3}><FocusWord size={170} color={v2Colors.coral}>Token</FocusWord></Appear>
    <Appear at={1.7}><Subline style={{fontSize: 42}}>模型处理与生成文本的</Subline></Appear>
    <Appear at={3}><FocusWord size={86}>基本单位</FocusWord></Appear>
    <Row gap={24} style={{marginTop: 30}}>
      {['128K', '输入', '输出', '计费'].map((x, i) => (
        <Appear key={x} at={4.6 + i * 0.7}>
          <Bubble color={[v2Colors.blue, v2Colors.violet, v2Colors.cyan, v2Colors.yellow][i]} style={{fontSize: 31}}>{x} Token</Bubble>
        </Appear>
      ))}
    </Row>
  </CenterStack>
);

const NotEqual = () => (
  <CenterStack gap={40}>
    <Appear at={0.2}><FocusWord size={108}>一个 Token</FocusWord></Appear>
    <Appear at={1.5}>
      <FocusWord size={120} color={v2Colors.coral}>≠</FocusWord>
    </Appear>
    <Row gap={36}>
      {[
        ['一个汉字', 2.5],
        ['一个单词', 4.4],
        ['一个字符', 6.3],
      ].map(([x, at]) => (
        <Appear key={String(x)} at={Number(at)}>
          <BigNode color={v2Colors.faint} style={{width: 350, minHeight: 140}}>{x}</BigNode>
        </Appear>
      ))}
    </Row>
    <Appear at={8}><Subline style={{color: v2Colors.yellow}}>没有固定的一一对应关系</Subline></Appear>
  </CenterStack>
);

const Tokenizer = () => (
  <CenterStack gap={48}>
    <Appear at={0.2}>
      <FocusWord size={62} style={{letterSpacing: -2}}>手机快没电了，我得赶紧找充电器。</FocusWord>
    </Appear>
    <Row gap={34}>
      <Appear at={1.8}><BigNode color={v2Colors.blue}>文字</BigNode></Appear>
      <Appear at={3}><Arrow width={120} /></Appear>
      <Appear at={3.8}><BigNode color={v2Colors.cyan} style={{minWidth: 360}}>Tokenizer</BigNode></Appear>
      <Appear at={5.2}><Arrow width={120} /></Appear>
      <Appear at={6}>
        <Row gap={10}>
          {['手机', '快', '没电', '了', '…'].map((x) => <TokenPiece key={x} text={x} color={v2Colors.coral} large />)}
        </Row>
      </Appear>
    </Row>
    <Appear at={8.2}><Subline>按词表与规则切成 Token</Subline></Appear>
  </CenterStack>
);

const Different = () => (
  <CenterStack gap={34}>
    <Appear at={0.2}><Subline style={{fontSize: 42}}>同一句文字</Subline></Appear>
    <Appear at={1}><FocusWord size={68}>「手机快没电了」</FocusWord></Appear>
    <Row gap={70} style={{marginTop: 28}}>
      <Appear at={2.4}>
        <BigNode color={v2Colors.blue} style={{width: 520, height: 220}}>
          <div><div style={{fontSize: 29, color: v2Colors.muted}}>Tokenizer A</div><div style={{marginTop: 25}}>手｜机｜快｜没电</div></div>
        </BigNode>
      </Appear>
      <Appear at={4.4}>
        <BigNode color={v2Colors.cyan} style={{width: 520, height: 220}}>
          <div><div style={{fontSize: 29, color: v2Colors.muted}}>Tokenizer B</div><div style={{marginTop: 25}}>手机｜快｜没｜电</div></div>
        </BigNode>
      </Appear>
    </Row>
    <Appear at={6.6}><Subline style={{color: v2Colors.yellow}}>切法和数量都可能不同</Subline></Appear>
  </CenterStack>
);

const TokenId = () => {
  const flip = useEnter(4, 24);
  return (
    <CenterStack gap={46}>
      <Appear at={0.2}><Subline>每个 Token 在词表里还有</Subline></Appear>
      <Row gap={30}>
        {[
          ['手机', '#10485'],
          ['快', '#3377'],
          ['没', '#14612'],
        ].map(([text, id], i) => (
          <Appear key={text} at={1.4 + i * 0.7}>
            <div style={{transform: `rotateY(${flip * 180}deg)`, transformStyle: 'preserve-3d'}}>
              <BigNode color={v2Colors.coral} style={{width: 270, height: 190}}>
                <span style={{transform: flip > 0.5 ? 'rotateY(180deg)' : undefined}}>{flip > 0.5 ? id : text}</span>
              </BigNode>
            </div>
          </Appear>
        ))}
      </Row>
      <Appear at={5.6}><FocusWord size={94} color={v2Colors.violet}>Token ID</FocusWord></Appear>
      <Appear at={7.1}><Subline>数字编号，不需要背</Subline></Appear>
    </CenterStack>
  );
};

const Codec = () => (
  <CenterStack gap={48}>
    <Row gap={22}>
      <Appear at={0.4}><BigNode color={v2Colors.blue}>人类文字</BigNode></Appear>
      <Appear at={1.6}><Arrow width={90} /></Appear>
      <Appear at={2.2}><BigNode color={v2Colors.violet}>编码</BigNode></Appear>
      <Appear at={3.2}><Arrow width={90} /></Appear>
      <Appear at={3.8}><BigNode color={v2Colors.coral} style={{minWidth: 310}}>Token / ID</BigNode></Appear>
      <Appear at={5}><Arrow width={90} /></Appear>
      <Appear at={5.6}><BigNode color={v2Colors.cyan}>大模型</BigNode></Appear>
    </Row>
    <Appear at={6.9}><FocusWord size={72}>处理与生成</FocusWord></Appear>
    <Row gap={26}>
      <Appear at={8}><BigNode color={v2Colors.coral} style={{minWidth: 310}}>Token / ID</BigNode></Appear>
      <Appear at={8.6}><Arrow width={100} /></Appear>
      <Appear at={9.1}><BigNode color={v2Colors.violet}>解码</BigNode></Appear>
      <Appear at={9.7}><Arrow width={100} /></Appear>
      <Appear at={10.2}><BigNode color={v2Colors.cyan}>最终回答</BigNode></Appear>
    </Row>
  </CenterStack>
);

const Variable = () => (
  <CenterStack gap={42}>
    <Appear at={0.2}><FocusWord size={78}>一个 Token 有多长？</FocusWord></Appear>
    <Appear at={1.7}><FocusWord size={102} color={v2Colors.coral}>没有固定答案</FocusWord></Appear>
    <Row gap={42} style={{marginTop: 30}}>
      {[
        ['多个字符', '一个 Token', v2Colors.blue, 3.3],
        ['一个词', '多个 Token', v2Colors.cyan, 5],
        ['英文 / 数字 / 😂', '各有切法', v2Colors.violet, 6.7],
      ].map(([top, bottom, color, at]) => (
        <Appear key={String(top)} at={Number(at)}>
          <BigNode color={String(color)} style={{width: 430, height: 210}}>
            <div><div>{top}</div><div style={{fontSize: 28, color: v2Colors.muted, marginTop: 20}}>→ {bottom}</div></div>
          </BigNode>
        </Appear>
      ))}
    </Row>
  </CenterStack>
);

const chineseTokens = [
  ['手机', '#10485'], ['快', '#3377'], ['没', '#14612'], ['电', '#5719'], ['了', '#4531'],
  ['，我', '#40824'], ['得', '#11789'], ['赶', '#127062'], ['紧', '#50391'], ['找', '#33943'],
  ['充', '#21478'], ['电', '#5719'], ['器', '#13837'], ['。', '#788'],
] as const;

const mixedTokens = [
  ['这个', '#41713'], ['␠PPT', '#140534'], ['␠明', '#70117'], ['天', '#867'], ['要', '#7724'],
  ['交', '#10130'], ['，', '#979'], ['帮', '#58626'], ['我', '#7522'], ['␠check', '#2371'],
  ['␠一', '#16304'], ['下', '#3771'], ['␠😂', '#163123'],
] as const;

const Demo = ({mixed = false}: {mixed?: boolean}) => {
  const tokens = mixed ? mixedTokens : chineseTokens;
  return (
    <CenterStack gap={44}>
      <Appear at={0.2}><Subline>{mixed ? '样例 B · 中英混合' : '样例 A · 纯中文'}</Subline></Appear>
      <Appear at={1}>
        <FocusWord size={mixed ? 58 : 64} style={{letterSpacing: -2}}>
          {mixed ? '这个 PPT 明天要交，帮我 check 一下 😂' : '手机快没电了，我得赶紧找充电器。'}
        </FocusWord>
      </Appear>
      <div style={{width: 1500, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12}}>
        {tokens.map(([text, id], i) => (
          <Appear key={`${text}-${i}`} at={2.5 + i * 0.3} fromY={12} scaleFrom={0.85}>
            <TokenPiece text={text} id={id} color={mixed ? v2Colors.cyan : v2Colors.blue} />
          </Appear>
        ))}
      </div>
      <Appear at={mixed ? 7.7 : 7.1}>
        <Subline style={{color: v2Colors.yellow}}>{mixed ? '中文、英文、标点、emoji：没有固定换算' : '观察切分边界，不背数字'}</Subline>
      </Appear>
    </CenterStack>
  );
};

const Million = () => (
  <CenterStack gap={40}>
    <Appear at={0.2}><FocusWord size={126} color={v2Colors.blue}>100 万 Token</FocusWord></Appear>
    <Appear at={2.3}><FocusWord size={126} color={v2Colors.coral}>≠</FocusWord></Appear>
    <Appear at={3.6}><FocusWord size={108}>100 万个汉字</FocusWord></Appear>
    <Appear at={6}><Subline style={{fontSize: 42}}>两件事不能直接画等号</Subline></Appear>
  </CenterStack>
);

const Impact = ({kind}: {kind: 'capacity' | 'output' | 'cost'}) => {
  const map = {
    capacity: ['01', '一次能处理多少', '128K / 1M Token', v2Colors.blue],
    output: ['02', '一次能生成多少', '输出 Token', v2Colors.cyan],
    cost: ['03', '一次调用多少钱', '输入 + 输出 Token', v2Colors.coral],
  } as const;
  const [number, title, focus, color] = map[kind];
  return (
    <CenterStack gap={38}>
      <Appear at={0.2}><FocusWord size={88} color={color}>{number}</FocusWord></Appear>
      <Appear at={1.2}><FocusWord size={105}>{title}</FocusWord></Appear>
      <Appear at={3.8}>
        <BigNode color={color} style={{width: 760, minHeight: 190, fontSize: 60}}>{focus}</BigNode>
      </Appear>
      <Appear at={6.3}>
        <Subline>{kind === 'capacity' ? '模型用 Token 衡量上下文容量' : kind === 'output' ? '生成上限影响回答长度' : 'Token 数量常用于计算费用'}</Subline>
      </Appear>
    </CenterStack>
  );
};

const Summary = () => (
  <CenterStack gap={46}>
    <Appear at={0.2}><Subline>一句话的完整旅程</Subline></Appear>
    <Row gap={14}>
      {[
        ['文字', v2Colors.blue, 0.8],
        ['Tokenizer', v2Colors.cyan, 2],
        ['Token / ID', v2Colors.coral, 3.2],
        ['大模型', v2Colors.violet, 4.4],
        ['解码', v2Colors.cyan, 5.6],
        ['回答', v2Colors.blue, 6.8],
      ].map(([text, color, at], i) => (
        <div key={String(text)} style={{display: 'flex', alignItems: 'center', gap: 14}}>
          <Appear at={Number(at)}><BigNode color={String(color)} style={{minWidth: i === 1 || i === 2 ? 245 : 190, minHeight: 130, fontSize: 34}}>{text}</BigNode></Appear>
          {i < 5 ? <Appear at={Number(at) + 0.5}><Arrow width={64} /></Appear> : null}
        </div>
      ))}
    </Row>
    <Appear at={8.6}><FocusWord size={92}>下一个问题：Context</FocusWord></Appear>
    <Appear at={10}><Subline>AI 一次到底能“看到”多少？</Subline></Appear>
  </CenterStack>
);

const ShotContent = ({id}: {id: string}) => {
  switch (id) {
    case 'hook': return <Hook />;
    case 'product': return <Product />;
    case 'llm': return <Llm />;
    case 'candidates': return <Candidates />;
    case 'loop': return <GenerationLoop />;
    case 'stream': return <Stream />;
    case 'token': return <TokenIntro />;
    case 'not-equal': return <NotEqual />;
    case 'tokenizer': return <Tokenizer />;
    case 'different': return <Different />;
    case 'token-id': return <TokenId />;
    case 'codec': return <Codec />;
    case 'variable': return <Variable />;
    case 'demo-cn': return <Demo />;
    case 'demo-mixed': return <Demo mixed />;
    case 'million': return <Million />;
    case 'capacity': return <Impact kind="capacity" />;
    case 'output': return <Impact kind="output" />;
    case 'cost': return <Impact kind="cost" />;
    case 'summary': return <Summary />;
    default: return null;
  }
};

export const Lesson1VisualV2 = () => (
  <Series>
    {V2_SHOTS.map((shot, i) => (
      <Series.Sequence
        key={shot.id}
        durationInFrames={Math.ceil(shot.durationSeconds * FPS)}
        premountFor={FPS}
      >
        <ShotShell
          index={i + 1}
          total={total}
          chapter={shot.chapter}
          durationSeconds={shot.durationSeconds}
        >
          <ShotContent id={shot.id} />
        </ShotShell>
      </Series.Sequence>
    ))}
  </Series>
);
