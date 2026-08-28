import type {CSSProperties, ReactNode} from 'react';
import {interpolate} from 'remotion';
import {
  BoxFinePrint,
  HandArrow,
  HandUnderline,
  Highlight,
  Layer,
  Paper,
  RoughBox,
  SceneNumber,
  ease,
  easeInOut,
  useV9SceneFrame,
  useVisualOptions,
  v9Colors,
} from './VisualV9';

const clamp = {
  extrapolateLeft: 'clamp' as const,
  extrapolateRight: 'clamp' as const,
};

const Title = ({children, amount = 1}: {children: ReactNode; amount?: number}) => (
  <Layer
    amount={amount}
    fromY={-18}
    style={{
      position: 'absolute',
      left: 120,
      right: 120,
      top: 70,
      textAlign: 'center',
      fontSize: 78,
      lineHeight: 1.1,
      letterSpacing: 2,
    }}
  >
    {children}
  </Layer>
);

const ChalkUnderline = ({
  width,
  amount,
  color,
  style,
}: {
  width: number;
  amount: number;
  color: string;
  style?: CSSProperties;
}) => <HandUnderline width={width} progress={amount} color={color} style={style} />;

const Box = ({
  text,
  amount,
  color = v9Colors.ink,
  width = 280,
  height = 132,
  fontSize = 54,
  sub,
}: {
  text: string;
  amount: number;
  color?: string;
  width?: number;
  height?: number;
  fontSize?: number;
  sub?: string;
}) => (
  <Layer amount={amount} fromY={20} fromScale={0.92}>
    <RoughBox width={width} height={height} color={color} progress={amount} seedKey={`box-${text}`}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          fontSize,
          lineHeight: 1,
        }}
      >
        {text}
        {sub ? (
          <BoxFinePrint>
            <span style={{fontSize: 28, color, marginTop: 14}}>{sub}</span>
          </BoxFinePrint>
        ) : null}
      </div>
    </RoughBox>
  </Layer>
);

const DownArrow = ({amount, color = v9Colors.blue}: {amount: number; color?: string}) => (
  <svg width="70" height="100" viewBox="0 0 70 100" style={{overflow: 'visible'}}>
    <path
      d="M 35 7 C 32 28 38 49 34 75 M 19 62 L 34 79 L 52 61"
      fill="none"
      stroke={color}
      strokeWidth={4}
      strokeLinecap="round"
      strokeLinejoin="round"
      pathLength={1}
      strokeDasharray={1}
      strokeDashoffset={1 - amount}
    />
    <path
      d="M 38 10 C 35 31 40 51 37 72"
      fill="none"
      stroke={color}
      strokeWidth={1.2}
      strokeLinecap="round"
      opacity={0.3}
      pathLength={1}
      strokeDasharray={1}
      strokeDashoffset={1 - amount}
    />
  </svg>
);

const TokenPiece = ({
  children,
  amount,
  color = v9Colors.blue,
}: {
  children: ReactNode;
  amount: number;
  color?: string;
}) => (
  <Layer amount={amount} fromY={14} fromScale={0.88}>
    <div
      style={{
        position: 'relative',
        minWidth: 84,
        padding: '13px 18px 17px',
        textAlign: 'center',
        fontSize: 42,
        lineHeight: 1,
        background: `${color}1F`,
      }}
    >
      {children}
      <HandUnderline
        width={82}
        progress={amount}
        color={color}
        style={{position: 'absolute', left: '50%', bottom: 0, transform: 'translateX(-50%)'}}
      />
    </div>
  </Layer>
);

const LoopArrow = ({amount}: {amount: number}) => (
  <svg width="1280" height="230" viewBox="0 0 1280 230" style={{overflow: 'visible'}}>
    <path
      d="M 1170 28 C 1162 164 970 205 690 203 C 402 201 151 188 112 78"
      fill="none"
      stroke={v9Colors.blue}
      strokeWidth={3.5}
      strokeLinecap="round"
      pathLength={1}
      strokeDasharray={1}
      strokeDashoffset={1 - amount}
    />
    <path
      d="M 125 101 L 108 76 L 137 70"
      fill="none"
      stroke={v9Colors.blue}
      strokeWidth={3.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={ease(amount, 0.72, 0.2)}
    />
  </svg>
);

export const ScenePredictNext = () => {
  const frame = useV9SceneFrame();
  const prompt = ease(frame, 4, 22);
  const candidates = [
    ['充电器', 1, v9Colors.green],
    ['充电宝', 0.82, v9Colors.green],
    ['插座', 0.52, v9Colors.blue],
    ['遥控器', 0.16, v9Colors.magenta],
  ] as const;
  const insight = ease(frame, 190, 24);
  return (
    <Paper>
      <Title amount={prompt}>手机只剩 <span style={{color: v9Colors.yellow}}>1%</span> 的电，我赶紧找……</Title>
      <div style={{position: 'absolute', left: 300, top: 285, width: 760, display: 'grid', gap: 35}}>
        {candidates.map(([label, value, color], index) => {
          const amount = ease(frame, 52 + index * 26, 18);
          return (
            <Layer key={label} amount={amount} fromX={-28}>
              <div style={{display: 'grid', gridTemplateColumns: '190px 1fr', alignItems: 'center', gap: 28}}>
                <div style={{fontSize: 52}}>{label}</div>
                <div style={{height: 16, position: 'relative'}}>
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 4,
                      width: `${value * amount * 100}%`,
                      height: 7,
                      background: color,
                      borderRadius: '45% 55% 42% 58%',
                      transform: `rotate(${index % 2 ? 0.4 : -0.35}deg)`,
                    }}
                  />
                </div>
              </div>
            </Layer>
          );
        })}
      </div>
      <Layer amount={ease(frame, 150, 22)} fromX={32} style={{position: 'absolute', right: 250, top: 350}}>
        <RoughBox width={510} height={300} color={v9Colors.green} progress={ease(frame, 150, 22)} seedKey="predict-context-rules">
          <div style={{position: 'absolute', inset: 36, textAlign: 'center', fontSize: 42, lineHeight: 1.55}}>
            已有内容
            <div style={{color: v9Colors.green}}>＋ 学到的规律</div>
            <BoxFinePrint>
              <div style={{fontSize: 34, marginTop: 22}}>判断接下来更可能出现什么</div>
            </BoxFinePrint>
          </div>
        </RoughBox>
      </Layer>
      <Layer amount={insight} fromScale={0.9} style={{position: 'absolute', left: 0, right: 0, bottom: 100, textAlign: 'center'}}>
        <div style={{display: 'inline-block', position: 'relative', fontSize: 84}}>
          预测下一个 Token
          <ChalkUnderline width={720} amount={insight} color={v9Colors.yellow} style={{position: 'absolute', left: 0, bottom: -24}} />
        </div>
      </Layer>
      <SceneNumber current={4} />
    </Paper>
  );
};

export const SceneGenerationLoop = () => {
  const frame = useV9SceneFrame();
  const nodeStarts = [16, 66, 116, 166] as const;
  const nodes = [
    ['已有内容', v9Colors.ink],
    ['预测下一个', v9Colors.blue],
    ['生成一个', v9Colors.green],
    ['接回后面', v9Colors.magenta],
  ] as const;
  const loop = ease(frame, 195, 42);
  return (
    <Paper>
      <Title amount={ease(frame, 0, 20)}>生成一个以后，为什么还能继续？</Title>
      <div style={{position: 'absolute', left: '50%', top: 365, transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: 24}}>
        {nodes.map(([text, color], index) => (
          <div key={text} style={{display: 'flex', alignItems: 'center', gap: 24}}>
            <Box text={text} amount={ease(frame, nodeStarts[index], 20)} color={color} width={300} height={150} fontSize={52} />
            {index < nodes.length - 1 ? <HandArrow width={145} progress={ease(frame, nodeStarts[index] + 25, 22)} color={v9Colors.blue} bend={index % 2 ? -2 : 2} /> : null}
          </div>
        ))}
      </div>
      <div style={{position: 'absolute', left: 320, top: 520}}><LoopArrow amount={loop} /></div>
      <Layer amount={ease(frame, 225, 22)} style={{position: 'absolute', left: 0, right: 0, bottom: 120}}>
        <div style={{display: 'flex', justifyContent: 'center', gap: 14}}>
          {['手机', '快', '没电', '了', '，', '我', '赶紧', '找', '充电器', '……'].map((token, index) => (
            <TokenPiece key={`${token}-${index}`} amount={ease(frame, 225 + index * 5, 13)} color={index === 8 ? v9Colors.yellow : v9Colors.blue}>
              {token}
            </TokenPiece>
          ))}
        </div>
      </Layer>
      <SceneNumber current={5} />
    </Paper>
  );
};

export const SceneStreaming = () => {
  const frame = useV9SceneFrame();
  const shell = ease(frame, 5, 24);
  const tokens = ['大模型', '会', '一个', 'Token', '接一个', 'Token', '生成', '回答'];
  const takeaway = ease(frame, 185, 24);
  return (
    <Paper>
      <Title amount={ease(frame, 0, 18)}>为什么回答会一点一点出现？</Title>
      <Layer amount={shell} fromScale={0.96} style={{position: 'absolute', left: 260, top: 285}}>
        <RoughBox width={1400} height={360} color={v9Colors.ink} progress={shell} seedKey="streaming-shell">
          <div style={{position: 'absolute', left: 90, right: 90, top: 105, display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap'}}>
            {tokens.map((token, index) => (
              <TokenPiece key={`${token}-${index}`} amount={ease(frame, 42 + index * 15, 12)} color={index >= 6 ? v9Colors.green : v9Colors.blue}>
                {token}
              </TokenPiece>
            ))}
            <Layer amount={ease(frame, 160, 12)}><span style={{fontSize: 70, color: v9Colors.green}}>▌</span></Layer>
          </div>
        </RoughBox>
      </Layer>
      <Layer amount={ease(frame, 150, 22)} style={{position: 'absolute', left: 0, right: 0, top: 700, textAlign: 'center', fontSize: 43, color: v9Colors.muted}}>
        不是先写完，再模拟打字
      </Layer>
      <Layer amount={takeaway} fromScale={0.9} style={{position: 'absolute', left: 0, right: 0, bottom: 105, textAlign: 'center'}}>
        <div style={{position: 'relative', display: 'inline-block', fontSize: 88}}>
          正在生成 = 正在显示
          <ChalkUnderline width={820} amount={takeaway} color={v9Colors.green} style={{position: 'absolute', left: 0, bottom: -25}} />
        </div>
      </Layer>
      <SceneNumber current={6} />
    </Paper>
  );
};

export const SceneTokenDefinition = () => {
  const frame = useV9SceneFrame();
  const token = ease(frame, 5, 24);
  const unit = ease(frame, 40, 22);
  const neq = [ease(frame, 92, 18), ease(frame, 122, 18), ease(frame, 152, 18)];
  return (
    <Paper>
      <Title amount={ease(frame, 0, 18)}>Token 到底是什么？</Title>
      <div style={{position: 'absolute', left: 0, right: 0, top: 260, textAlign: 'center'}}>
        <Layer amount={token} fromScale={0.82}>
          <span style={{fontSize: 190, color: v9Colors.blue}}>Token</span>
        </Layer>
        <Layer amount={unit} fromY={20}>
          <div style={{fontSize: 82, marginTop: 20}}>模型处理和生成文本的 <span style={{position: 'relative', color: v9Colors.yellow}}>基本单位<Highlight progress={unit} color={v9Colors.yellow} /></span></div>
        </Layer>
      </div>
      <div style={{position: 'absolute', left: 275, right: 275, top: 650, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 55}}>
        {['≠ 一个汉字', '≠ 一个单词', '≠ 一个字符'].map((text, index) => (
          <Box key={text} text={text} amount={neq[index]} color={[v9Colors.magenta, v9Colors.green, v9Colors.coral][index]} width={410} height={150} fontSize={52} />
        ))}
      </div>
      <Layer amount={ease(frame, 205, 20)} style={{position: 'absolute', left: 0, right: 0, bottom: 92, textAlign: 'center', color: v9Colors.muted, fontSize: 34}}>
        输入 Token　·　输出 Token　·　128K Token
      </Layer>
      <SceneNumber current={7} />
    </Paper>
  );
};

export const SceneTokenizer = () => {
  const frame = useV9SceneFrame();
  const pieces = ['手机', '快', '没电', '了', '，', '我', '得', '赶紧', '找', '充电器', '。'];
  return (
    <Paper>
      <Title amount={ease(frame, 0, 18)}>正常文字，怎么变成 Token？</Title>
      <Layer amount={ease(frame, 18, 20)} style={{position: 'absolute', left: 0, right: 0, top: 240, textAlign: 'center', fontSize: 58}}>
        手机快没电了，我得赶紧找充电器。
      </Layer>
      <div style={{position: 'absolute', left: '50%', top: 335, transform: 'translateX(-50%)'}}><DownArrow amount={ease(frame, 48, 20)} /></div>
      <div style={{position: 'absolute', left: '50%', top: 430, transform: 'translateX(-50%)'}}>
        <Box text="Tokenizer" sub="词表 + 切分规则" amount={ease(frame, 66, 22)} color={v9Colors.green} width={600} height={180} fontSize={70} />
      </div>
      <div style={{position: 'absolute', left: '50%', top: 600, transform: 'translateX(-50%)'}}><DownArrow amount={ease(frame, 104, 20)} color={v9Colors.green} /></div>
      <div style={{position: 'absolute', left: 155, right: 155, top: 720, display: 'flex', justifyContent: 'center', gap: 12}}>
        {pieces.map((piece, index) => (
          <TokenPiece key={`${piece}-${index}`} amount={ease(frame, 125 + index * 8, 12)} color={index % 3 === 0 ? v9Colors.green : v9Colors.blue}>{piece}</TokenPiece>
        ))}
      </div>
      <Layer amount={ease(frame, 232, 20)} style={{position: 'absolute', left: 0, right: 0, bottom: 75, textAlign: 'center', fontSize: 40, color: v9Colors.yellow}}>
        不同模型 → 切法可能不同
      </Layer>
      <SceneNumber current={8} />
    </Paper>
  );
};

export const SceneEncodeDecode = () => {
  const frame = useV9SceneFrame();
  const steps = [
    ['文字', v9Colors.ink],
    ['Token', v9Colors.green],
    ['Token ID', v9Colors.blue],
    ['模型计算', v9Colors.magenta],
  ] as const;
  return (
    <Paper>
      <Title amount={ease(frame, 0, 18)}>文字，怎样进入模型计算？</Title>
      <Layer amount={ease(frame, 22, 18)} style={{position: 'absolute', left: 235, top: 245, fontSize: 42, color: v9Colors.yellow}}>Encoding · 编码</Layer>
      <div style={{position: 'absolute', left: '50%', top: 370, transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: 24}}>
        {steps.map(([text, color], index) => (
          <div key={text} style={{display: 'flex', alignItems: 'center', gap: 24}}>
            <Box text={text} amount={ease(frame, 40 + index * 42, 20)} color={color} width={300} height={150} fontSize={text === 'Token ID' ? 48 : 55} />
            {index < steps.length - 1 ? <HandArrow width={135} progress={ease(frame, 62 + index * 42, 18)} color={v9Colors.blue} bend={index % 2 ? -2 : 2} /> : null}
          </div>
        ))}
      </div>
      <Layer amount={ease(frame, 195, 22)} style={{position: 'absolute', left: 300, right: 300, top: 665}}>
        <RoughBox width={1320} height={180} color={v9Colors.green} progress={ease(frame, 195, 22)} seedKey="decoding-result">
          <div style={{position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 35, fontSize: 49}}>
            <span>生成的 ID</span><span style={{color: v9Colors.green}}>→</span><span>Token</span><span style={{color: v9Colors.green}}>→</span><span>最终回答</span>
          </div>
        </RoughBox>
      </Layer>
      <Layer amount={ease(frame, 225, 18)} style={{position: 'absolute', right: 260, top: 860, fontSize: 40, color: v9Colors.green}}>Decoding · 解码</Layer>
      <SceneNumber current={9} />
    </Paper>
  );
};

export const SceneVariableToken = () => {
  const frame = useV9SceneFrame();
  const q = ease(frame, 3, 20);
  const examples = [
    ['中文', ['手机', '快', '没电', '了'], v9Colors.blue],
    ['English', ['present', 'ation', ' check'], v9Colors.green],
    ['混合', ['帮我', ' check', '一下', '😂'], v9Colors.magenta],
  ] as const;
  const answer = ease(frame, 220, 24);
  return (
    <Paper>
      <Title amount={q}>一个 Token 到底对应多少文字？</Title>
      <Layer amount={ease(frame, 30, 20)} fromScale={0.8} style={{position: 'absolute', left: 0, right: 0, top: 190, textAlign: 'center', fontSize: 122, color: v9Colors.yellow}}>
        1 Token = ？
      </Layer>
      <div style={{position: 'absolute', left: 180, right: 180, top: 430, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 55}}>
        {examples.map(([label, pieces, color], index) => {
          const amount = ease(frame, 75 + index * 45, 22);
          return (
            <Layer key={label} amount={amount} fromY={25}>
              <RoughBox width={480} height={280} color={color} progress={amount} seedKey={`variable-token-${label}`}>
                <div style={{position: 'absolute', inset: 35, textAlign: 'center'}}>
                  <div style={{fontSize: 48, color}}>{label}</div>
                  <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10, marginTop: 42}}>
                    {pieces.map((piece, pieceIndex) => <span key={`${piece}-${pieceIndex}`} style={{fontSize: 36, padding: '7px 11px', background: `${color}22`}}>{piece}</span>)}
                  </div>
                </div>
              </RoughBox>
            </Layer>
          );
        })}
      </div>
      <Layer amount={answer} fromScale={0.88} style={{position: 'absolute', left: 0, right: 0, bottom: 105, textAlign: 'center'}}>
        <div style={{display: 'inline-block', position: 'relative', fontSize: 86}}>
          没有固定换算
          <ChalkUnderline width={620} amount={answer} color={v9Colors.magenta} style={{position: 'absolute', left: 0, bottom: -24}} />
        </div>
      </Layer>
      <SceneNumber current={10} />
    </Paper>
  );
};

export const SceneTokenizerObserve = () => {
  const frame = useV9SceneFrame();
  const left = ease(frame, 15, 22);
  const right = ease(frame, 85, 22);
  const takeaway = ease(frame, 220, 22);
  return (
    <Paper>
      <Title amount={ease(frame, 0, 18)}>打开真实 Tokenizer，要看什么？</Title>
      <Layer amount={left} fromX={-30} style={{position: 'absolute', left: 180, top: 290}}>
        <RoughBox width={730} height={330} color={v9Colors.blue} progress={left} seedKey="tokenizer-observe-chinese">
          <div style={{position: 'absolute', inset: 50}}>
            <div style={{fontSize: 34, color: v9Colors.blue}}>样例 01 · 纯中文</div>
            <div style={{fontSize: 48, lineHeight: 1.45, marginTop: 30}}>手机快没电了，<br />我得赶紧找充电器。</div>
            <BoxFinePrint>
              <div style={{fontSize: 30, color: v9Colors.muted, marginTop: 35}}>观察：汉字数 = Token 数？</div>
            </BoxFinePrint>
          </div>
        </RoughBox>
      </Layer>
      <Layer amount={right} fromX={30} style={{position: 'absolute', right: 180, top: 290}}>
        <RoughBox width={730} height={330} color={v9Colors.green} progress={right} seedKey="tokenizer-observe-mixed">
          <div style={{position: 'absolute', inset: 50}}>
            <div style={{fontSize: 34, color: v9Colors.green}}>样例 02 · 混合文本</div>
            <div style={{fontSize: 46, lineHeight: 1.45, marginTop: 30}}>这个 PPT 明天要交，<br />帮我 check 一下 😂</div>
            <BoxFinePrint>
              <div style={{fontSize: 30, color: v9Colors.muted, marginTop: 35}}>观察：中英、标点、emoji 怎么切？</div>
            </BoxFinePrint>
          </div>
        </RoughBox>
      </Layer>
      <Layer amount={ease(frame, 165, 20)} style={{position: 'absolute', left: 0, right: 0, top: 690, textAlign: 'center', fontSize: 43, color: v9Colors.muted}}>
        换一个 Tokenizer，切分与 ID 都可能不同
      </Layer>
      <Layer amount={takeaway} fromScale={0.9} style={{position: 'absolute', left: 0, right: 0, bottom: 100, textAlign: 'center'}}>
        <div style={{position: 'relative', display: 'inline-block', fontSize: 88}}>
          看规则，不背数字
          <ChalkUnderline width={700} amount={takeaway} color={v9Colors.yellow} style={{position: 'absolute', left: 0, bottom: -24}} />
        </div>
      </Layer>
      <SceneNumber current={11} />
    </Paper>
  );
};

export const SceneTokenImpact = () => {
  const frame = useV9SceneFrame();
  const items = [
    ['容量', '一次能处理多少', '128K / 1M Token', v9Colors.blue],
    ['长度', '一次能生成多少', '输出 Token', v9Colors.green],
    ['成本', '一次调用多少钱', '输入 + 输出 Token', v9Colors.magenta],
  ] as const;
  const takeaway = ease(frame, 225, 22);
  return (
    <Paper>
      <Title amount={ease(frame, 0, 18)}>普通用户，为什么也要懂 Token？</Title>
      <div style={{position: 'absolute', left: 165, right: 165, top: 300, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 55}}>
        {items.map(([title, body, detail, color], index) => {
          const amount = ease(frame, 42 + index * 52, 24);
          return (
            <Layer key={title} amount={amount} fromY={28}>
              <RoughBox width={490} height={370} color={color} progress={amount} seedKey={`token-impact-${title}`}>
                <div style={{position: 'absolute', inset: 45, textAlign: 'center'}}>
                  <div style={{fontSize: 84, color}}>{title}</div>
                  <div style={{fontSize: 43, marginTop: 42}}>{body}</div>
                  <BoxFinePrint>
                    <div style={{fontSize: 31, marginTop: 38, color}}>{detail}</div>
                  </BoxFinePrint>
                </div>
              </RoughBox>
            </Layer>
          );
        })}
      </div>
      <Layer amount={takeaway} fromScale={0.9} style={{position: 'absolute', left: 0, right: 0, bottom: 105, textAlign: 'center'}}>
        <div style={{position: 'relative', display: 'inline-block', fontSize: 78}}>
          Token 连接：容量 · 长度 · 成本
          <ChalkUnderline width={1050} amount={takeaway} color={v9Colors.yellow} style={{position: 'absolute', left: 0, bottom: -24}} />
        </div>
      </Layer>
      <SceneNumber current={12} />
    </Paper>
  );
};

export const SceneFullChain = () => {
  const frame = useV9SceneFrame();
  const nodes = [
    ['文字', v9Colors.ink],
    ['Tokenizer', v9Colors.green],
    ['Token / ID', v9Colors.blue],
    ['预测生成', v9Colors.magenta],
    ['回答', v9Colors.yellow],
  ] as const;
  return (
    <Paper>
      <Title amount={ease(frame, 0, 18)}>最后，把整个过程串起来</Title>
      <div style={{position: 'absolute', left: '50%', top: 410, transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: 18}}>
        {nodes.map(([text, color], index) => (
          <div key={text} style={{display: 'flex', alignItems: 'center', gap: 18}}>
            <Box text={text} amount={ease(frame, 38 + index * 42, 20)} color={color} width={265} height={150} fontSize={text === 'Tokenizer' || text === 'Token / ID' ? 43 : 52} />
            {index < nodes.length - 1 ? <HandArrow width={105} progress={ease(frame, 58 + index * 42, 18)} color={v9Colors.blue} bend={index % 2 ? -2 : 2} /> : null}
          </div>
        ))}
      </div>
      <Layer amount={ease(frame, 235, 22)} style={{position: 'absolute', left: 0, right: 0, top: 650, textAlign: 'center'}}>
        <div style={{fontSize: 52, color: v9Colors.muted}}>预测一个　→　接回去　→　再预测</div>
      </Layer>
      <Layer amount={ease(frame, 265, 24)} fromScale={0.9} style={{position: 'absolute', left: 0, right: 0, bottom: 110, textAlign: 'center'}}>
        <div style={{position: 'relative', display: 'inline-block', fontSize: 84}}>
          一个 Token 接一个 Token
          <ChalkUnderline width={870} amount={ease(frame, 265, 24)} color={v9Colors.green} style={{position: 'absolute', left: 0, bottom: -24}} />
        </div>
      </Layer>
      <SceneNumber current={13} />
    </Paper>
  );
};

export const SceneContextOutro = () => {
  const frame = useV9SceneFrame();
  const {showContextRecap} = useVisualOptions();
  const context = ease(frame, 5, 22);
  const windowBox = ease(frame, 62, 24);
  const fade = showContextRecap ? easeInOut(frame, 245, 30) : 0;
  const tags = ['系统设定', '你的问题', '历史对话', '上传资料', '正在生成'];
  return (
    <Paper>
      <div style={{opacity: 1 - fade}}>
        <Title amount={context}>为什么 AI 有时会像“忘记”了？</Title>
        <Layer amount={ease(frame, 35, 20)} style={{position: 'absolute', left: 0, right: 0, top: 230, textAlign: 'center', fontSize: 52, color: v9Colors.muted}}>
          因为它一次能看到的内容有限
        </Layer>
        <Layer amount={windowBox} fromScale={0.94} style={{position: 'absolute', left: 280, top: 370}}>
          <RoughBox width={1360} height={350} color={v9Colors.yellow} progress={windowBox} seedKey="context-window">
            <div style={{position: 'absolute', inset: 45}}>
              <div style={{fontSize: 62, color: v9Colors.yellow, textAlign: 'center'}}>Context Window</div>
              <div style={{display: 'flex', justifyContent: 'center', gap: 18, marginTop: 65}}>
                {tags.map((tag, index) => (
                  <TokenPiece key={tag} amount={ease(frame, 92 + index * 18, 14)} color={[v9Colors.blue, v9Colors.green, v9Colors.magenta, v9Colors.coral, v9Colors.yellow][index]}>{tag}</TokenPiece>
                ))}
              </div>
            </div>
          </RoughBox>
        </Layer>
        <Layer amount={ease(frame, 190, 20)} style={{position: 'absolute', left: 0, right: 0, bottom: 120, textAlign: 'center', fontSize: 52, color: v9Colors.yellow}}>
          下一课：Context 与 Context Window
        </Layer>
      </div>

      {showContextRecap ? (
        <Layer amount={fade} fromScale={0.9} style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{fontSize: 48, color: v9Colors.muted}}>今天只记住一句话</div>
          <div style={{fontSize: 92, lineHeight: 1.35, textAlign: 'center', marginTop: 42}}>
            大模型不是一次写完答案
            <br />
            而是一个 <span style={{color: v9Colors.green}}>Token</span> 接一个 <span style={{color: v9Colors.green}}>Token</span>
            <br />
            持续生成
          </div>
          <ChalkUnderline width={980} amount={fade} color={v9Colors.magenta} style={{marginTop: 18}} />
        </Layer>
      ) : null}
      <SceneNumber current={14} />
    </Paper>
  );
};
