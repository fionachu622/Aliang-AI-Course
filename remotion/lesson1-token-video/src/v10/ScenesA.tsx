import {interpolate} from 'remotion';
import {Layer, Highlight} from '../v9/VisualV9';
import {
  BigTakeaway,
  ChalkArrow,
  ChalkLabel,
  DrawPath,
  TokenPiece,
  VisualScene,
  ease,
  moving,
  pulse,
  useV9SceneFrame,
  v9Colors,
} from './VisualV10';

const clamp = {
  extrapolateLeft: 'clamp' as const,
  extrapolateRight: 'clamp' as const,
};

const Phone = ({amount}: {amount: number}) => (
  <svg width="240" height="390" viewBox="0 0 240 390">
    <DrawPath d="M 52 15 Q 28 20 28 50 L 28 334 Q 30 370 63 374 L 180 374 Q 213 369 213 338 L 213 50 Q 211 17 180 15 Z" progress={amount} strokeWidth={5} />
    <DrawPath d="M 96 38 Q 120 34 146 38" progress={amount} strokeWidth={3} opacity={0.65} />
    <DrawPath d="M 106 349 Q 121 355 136 349" progress={amount} strokeWidth={3} opacity={0.65} />
    <DrawPath d="M 57 82 L 178 82 L 178 135 L 57 135 Z" progress={amount} color={v9Colors.magenta} strokeWidth={4} />
    <DrawPath d="M 69 108 L 151 108" progress={amount} color={v9Colors.magenta} strokeWidth={12} />
    <DrawPath d="M 151 108 L 165 108" progress={amount} color={v9Colors.muted} strokeWidth={12} />
  </svg>
);

const Network = ({amount, color = v9Colors.green}: {amount: number; color?: string}) => {
  const nodes = [
    [42, 60], [42, 145], [42, 230],
    [150, 90], [150, 190],
    [260, 60], [260, 145], [260, 230],
  ];
  const edges = [
    [0, 3], [0, 4], [1, 3], [1, 4], [2, 3], [2, 4],
    [3, 5], [3, 6], [3, 7], [4, 5], [4, 6], [4, 7],
  ];
  return (
    <svg width="310" height="290" viewBox="0 0 310 290">
      {edges.map(([a, b], index) => (
        <DrawPath
          key={`${a}-${b}`}
          d={`M ${nodes[a][0]} ${nodes[a][1]} Q 150 ${145 + (index % 3 - 1) * 8} ${nodes[b][0]} ${nodes[b][1]}`}
          progress={ease(amount, index * 0.025, 0.32)}
          color={color}
          strokeWidth={2.4}
          opacity={0.52}
        />
      ))}
      {nodes.map(([x, y], index) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={8 + (index % 3)} fill={color} opacity={ease(amount, index * 0.04, 0.25)} />
      ))}
    </svg>
  );
};

export const SceneQuestionV10 = () => {
  const frame = useV9SceneFrame();
  const input = ease(frame, 14, 22);
  const engine = ease(frame, 64, 28);
  const inside = ease(frame, 104, 28);
  const answer = ease(frame, 155, 24);
  const insight = ease(frame, 210, 24);
  const answerWords = ['我', '赶紧', '去找', '充电器'];
  return (
    <VisualScene title="一句话，怎么变成一段回答？">
      <ChalkLabel amount={input} style={{position: 'absolute', left: 150, top: 330, width: 430}} fontSize={58}>
        手机只剩 <span style={{color: v9Colors.yellow}}>1%</span> 的电……
      </ChalkLabel>
      <svg width="1320" height="470" viewBox="0 0 1320 470" style={{position: 'absolute', left: 300, top: 220, overflow: 'visible'}}>
        <ChalkArrow d="M 190 210 C 285 205 330 207 395 210" head="M 370 191 L 399 210 L 369 229" progress={ease(frame, 42, 22)} color={v9Colors.blue} />
        <DrawPath d="M 425 210 C 426 83 525 36 647 42 C 770 48 838 112 832 217 C 827 324 743 381 627 374 C 506 367 427 321 425 210 Z" progress={engine} color={v9Colors.green} strokeWidth={5} />
        <DrawPath d="M 438 216 C 451 102 536 54 647 58 C 754 62 819 125 816 218 C 813 306 739 359 632 354 C 523 349 451 312 438 216" progress={engine} color={v9Colors.green} strokeWidth={1.4} opacity={0.28} />
        <ChalkArrow d="M 851 210 C 930 208 990 208 1065 210" head="M 1037 190 L 1068 210 L 1038 230" progress={ease(frame, 142, 22)} color={v9Colors.magenta} />
        {[0, 1, 2, 3, 4, 5].map((index) => {
          const angle = index * Math.PI / 3 + inside * 0.55;
          return <circle key={index} cx={630 + Math.cos(angle) * 112} cy={210 + Math.sin(angle) * 82} r={8 + index % 2 * 3} fill={[v9Colors.blue, v9Colors.magenta, v9Colors.yellow][index % 3]} opacity={inside} />;
        })}
      </svg>
      <Layer amount={engine} fromScale={0.8} style={{position: 'absolute', left: 806, top: 385, width: 300, textAlign: 'center'}}>
        <div style={{fontSize: 66, color: v9Colors.green}}>大模型</div>
        <div style={{fontSize: 96, lineHeight: 0.8, color: v9Colors.yellow}}>？</div>
      </Layer>
      <div style={{position: 'absolute', right: 140, top: 350, width: 510, display: 'flex', flexWrap: 'wrap', gap: 14}}>
        {answerWords.map((word, index) => (
          <TokenPiece key={word} amount={ease(frame, 160 + index * 13, 15)} color={index === 3 ? v9Colors.yellow : v9Colors.magenta} fontSize={44}>{word}</TokenPiece>
        ))}
      </div>
      <BigTakeaway amount={insight} color={v9Colors.yellow} width={760}>中间发生的是一连串预测</BigTakeaway>
    </VisualScene>
  );
};

export const SceneProductModelV10 = () => {
  const frame = useV9SceneFrame();
  const shell = ease(frame, 18, 36);
  const features = ['聊天', '文件', '搜索', '语音'];
  const positions = [[960, 232], [1380, 445], [960, 672], [540, 445]];
  const core = ease(frame, 176, 28);
  return (
    <VisualScene title="AI 产品，是一层外壳">
      <svg width="1920" height="780" viewBox="0 0 1920 780" style={{position: 'absolute', left: 0, top: 140}}>
        <DrawPath d="M 515 390 C 535 163 725 84 963 91 C 1210 98 1395 207 1403 390 C 1411 586 1216 687 964 686 C 710 685 502 588 515 390 Z" progress={shell} color={v9Colors.ink} strokeWidth={4.2} />
        <DrawPath d="M 632 391 C 644 238 785 176 960 178 C 1143 180 1285 255 1287 394 C 1289 538 1141 600 959 599 C 777 598 621 535 632 391 Z" progress={ease(frame, 102, 32)} color={v9Colors.blue} strokeWidth={2.7} opacity={0.62} />
        {positions.map(([x, y], index) => (
          <g key={features[index]} opacity={ease(frame, 58 + index * 24, 20)}>
            <circle cx={x} cy={y} r={11} fill={[v9Colors.blue, v9Colors.green, v9Colors.magenta, v9Colors.coral][index]} />
            <text x={x} y={y - 28} fill={v9Colors.ink} fontSize="52" textAnchor="middle">{features[index]}</text>
          </g>
        ))}
        <circle cx="960" cy="394" r={122 * core} fill={`${v9Colors.green}17`} stroke={v9Colors.green} strokeWidth="5" opacity={core} />
        <circle cx="960" cy="394" r={92 * core} fill="none" stroke={v9Colors.green} strokeWidth="1.5" opacity={core * 0.35} />
        <text x="960" y="415" fill={v9Colors.ink} fontSize="78" textAnchor="middle" opacity={core}>大模型</text>
        <ChalkArrow d="M 960 260 C 960 302 960 322 960 352" head="M 943 333 L 960 355 L 977 333" progress={ease(frame, 148, 24)} color={v9Colors.yellow} />
      </svg>
      <BigTakeaway amount={ease(frame, 236, 24)} color={v9Colors.green} width={790}>功能在外层，能力来自模型核心</BigTakeaway>
    </VisualScene>
  );
};

export const SceneLlmActionsV10 = () => {
  const frame = useV9SceneFrame();
  const learn = ease(frame, 20, 26);
  const network = ease(frame, 98, 36);
  const generate = ease(frame, 196, 28);
  return (
    <VisualScene title="大模型，本质上做两件事">
      <div style={{position: 'absolute', left: 210, top: 225, width: 650, height: 520}}>
        <ChalkLabel amount={learn} color={v9Colors.blue} style={{position: 'absolute', left: 150, top: 0}} fontSize={62}>① 学习规律</ChalkLabel>
        <svg width="650" height="430" viewBox="0 0 650 430" style={{position: 'absolute', top: 85, overflow: 'visible'}}>
          {[0, 1, 2, 3].map((index) => (
            <g key={index} opacity={ease(frame, 45 + index * 16, 18)} transform={`translate(${42 + index * 88} ${240 - index * 35}) rotate(${index % 2 ? 3 : -3})`}>
              <DrawPath d="M 0 0 L 112 0 L 112 74 L 0 74 Z M 14 18 L 92 18 M 14 36 L 83 36 M 14 54 L 94 54" progress={1} color={[v9Colors.blue, v9Colors.green, v9Colors.magenta, v9Colors.coral][index]} strokeWidth={3} />
            </g>
          ))}
          <ChalkArrow d="M 360 205 C 425 192 456 173 496 150" head="M 469 144 L 501 148 L 483 175" progress={ease(frame, 82, 24)} color={v9Colors.yellow} />
        </svg>
        <div style={{position: 'absolute', right: 0, top: 135}}><Network amount={network} /></div>
      </div>
      <svg width="120" height="560" viewBox="0 0 120 560" style={{position: 'absolute', left: 900, top: 215}}>
        <DrawPath d="M 60 0 C 48 116 73 218 56 324 C 47 383 67 454 59 560" progress={ease(frame, 160, 30)} color={v9Colors.muted} strokeWidth={2.5} opacity={0.6} />
      </svg>
      <div style={{position: 'absolute', right: 220, top: 225, width: 650, height: 520}}>
        <ChalkLabel amount={generate} color={v9Colors.magenta} style={{position: 'absolute', left: 145, top: 0}} fontSize={62}>② 继续生成</ChalkLabel>
        <div style={{position: 'absolute', left: 0, top: 150}}><Network amount={generate} color={v9Colors.magenta} /></div>
        <svg width="650" height="330" viewBox="0 0 650 330" style={{position: 'absolute', top: 120, overflow: 'visible'}}>
          <ChalkArrow d="M 290 145 C 355 145 402 145 455 145" head="M 430 126 L 458 145 L 430 164" progress={ease(frame, 228, 22)} color={v9Colors.green} />
        </svg>
        <TokenPiece amount={ease(frame, 258, 20)} color={v9Colors.yellow} fontSize={58} style={{position: 'absolute', right: 10, top: 215}}>充电器</TokenPiece>
      </div>
      <BigTakeaway amount={ease(frame, 300, 24)} color={v9Colors.yellow} width={850}>先学规律，再预测下一个 Token</BigTakeaway>
    </VisualScene>
  );
};

export const ScenePredictNextV10 = () => {
  const frame = useV9SceneFrame();
  const candidates = [
    ['充电器', 1, v9Colors.green],
    ['充电宝', 0.82, v9Colors.green],
    ['插座', 0.52, v9Colors.blue],
    ['遥控器', 0.16, v9Colors.magenta],
  ] as const;
  const winner = ease(frame, 225, 22);
  return (
    <VisualScene title={<>手机只剩 <span style={{color: v9Colors.yellow}}>1%</span> 的电，我赶紧找……</>}>
      <div style={{position: 'absolute', left: 260, top: 245}}><Phone amount={ease(frame, 18, 26)} /></div>
      <div style={{position: 'absolute', left: 610, top: 250, width: 920}}>
        {candidates.map(([label, value, color], index) => {
          const amount = ease(frame, 50 + index * 34, 22);
          return (
            <Layer key={label} amount={amount} fromX={-25} style={{display: 'grid', gridTemplateColumns: '180px 1fr 80px', alignItems: 'center', gap: 24, marginBottom: 46}}>
              <div style={{fontSize: 52, color: index === 0 ? v9Colors.yellow : v9Colors.ink}}>{label}</div>
              <svg width="600" height="34" viewBox="0 0 600 34">
                <DrawPath d={`M 4 18 C ${120 * value} ${16 + index} ${420 * value} ${18 - index} ${570 * value} 18`} progress={amount} color={color} strokeWidth={9} />
              </svg>
              <div style={{fontSize: 36, color}}>{Math.round(value * 100)}</div>
            </Layer>
          );
        })}
      </div>
      <svg width="800" height="220" viewBox="0 0 800 220" style={{position: 'absolute', left: 740, top: 625, overflow: 'visible'}}>
        <ChalkArrow d="M 550 10 C 530 88 410 122 268 120" head="M 293 101 L 263 121 L 294 137" progress={ease(frame, 190, 30)} color={v9Colors.yellow} />
      </svg>
      <TokenPiece amount={winner} color={v9Colors.yellow} fontSize={56} style={{position: 'absolute', left: 720, top: 708}}>充电器</TokenPiece>
      <BigTakeaway amount={ease(frame, 252, 22)} color={v9Colors.green} width={720}>选择更可能出现的那一个</BigTakeaway>
    </VisualScene>
  );
};

export const SceneGenerationLoopV10 = () => {
  const frame = useV9SceneFrame();
  const tokens = ['手机', '只剩', '1%', '的电', '，', '我', '赶紧', '找', '充电器'];
  const loop = ease(frame, 70, 36);
  const orbit = moving(frame, [80, 270], [0, 1]);
  const x = 455 + Math.cos(orbit * Math.PI * 2) * 250;
  const y = 470 + Math.sin(orbit * Math.PI * 2) * 145;
  return (
    <VisualScene title="生成一个以后，再把它接回去">
      <svg width="900" height="540" viewBox="0 0 900 540" style={{position: 'absolute', left: 510, top: 190, overflow: 'visible'}}>
        <DrawPath d="M 195 275 C 195 104 353 52 521 70 C 692 88 770 181 722 324 C 675 463 500 488 337 450 C 193 416 143 350 195 275 Z" progress={loop} color={v9Colors.blue} strokeWidth={4} />
        <DrawPath d="M 206 279 C 222 132 359 84 514 92 C 658 101 736 192 700 314" progress={loop} color={v9Colors.blue} strokeWidth={1.3} opacity={0.3} />
        <DrawPath d="M 164 244 L 191 280 L 227 257" progress={ease(frame, 110, 22)} color={v9Colors.blue} strokeWidth={4} />
        <circle cx={x} cy={y} r={18} fill={v9Colors.yellow} opacity={loop} />
        <text x="455" y="260" fill={v9Colors.ink} textAnchor="middle" fontSize="62">预测</text>
        <text x="455" y="335" fill={v9Colors.green} textAnchor="middle" fontSize="50" opacity={ease(frame, 125, 20)}>接回原句</text>
      </svg>
      <div style={{position: 'absolute', left: 140, right: 140, top: 675, display: 'flex', justifyContent: 'center', gap: 12}}>
        {tokens.map((token, index) => (
          <TokenPiece key={`${token}-${index}`} amount={ease(frame, 145 + index * 11, 14)} color={index === tokens.length - 1 ? v9Colors.yellow : v9Colors.blue} fontSize={40}>{token}</TokenPiece>
        ))}
      </div>
      <BigTakeaway amount={ease(frame, 255, 22)} color={v9Colors.magenta} width={900}>预测 → 接回 → 再预测</BigTakeaway>
    </VisualScene>
  );
};

export const SceneStreamingV10 = () => {
  const frame = useV9SceneFrame();
  const tokens = ['大模型', '不是', '一次', '写完', '答案', '，', '而是', '一个', 'Token', '接一个', 'Token', '生成'];
  const shown = interpolate(frame, [35, 190], [0, tokens.length], clamp);
  const cursorPulse = pulse(frame, 40, 160);
  return (
    <VisualScene title="为什么回答会一点一点出现？">
      <div style={{position: 'absolute', left: 245, right: 245, top: 300, minHeight: 300, display: 'flex', alignContent: 'flex-start', flexWrap: 'wrap', gap: '24px 15px'}}>
        {tokens.map((token, index) => (
          <TokenPiece key={`${token}-${index}`} amount={ease(shown, index, 0.75)} color={index >= 7 ? v9Colors.green : v9Colors.blue} fontSize={54}>{token}</TokenPiece>
        ))}
        <Layer amount={ease(frame, 42, 12)} style={{fontSize: 78, lineHeight: 0.8, color: v9Colors.green, opacity: 0.35 + cursorPulse * 0.65}}>▌</Layer>
      </div>
      <svg width="1420" height="160" viewBox="0 0 1420 160" style={{position: 'absolute', left: 250, top: 650}}>
        <DrawPath d="M 12 80 C 170 77 318 82 476 79 C 640 76 820 83 1002 79 C 1150 76 1270 82 1405 79" progress={ease(frame, 35, 155)} color={v9Colors.muted} strokeWidth={2.2} opacity={0.5} />
        {tokens.map((_, index) => <circle key={index} cx={36 + index * 118} cy={80} r={7} fill={index < shown ? v9Colors.green : v9Colors.muted} opacity={0.8} />)}
      </svg>
      <BigTakeaway amount={ease(frame, 212, 22)} color={v9Colors.green} width={760}>正在生成，也正在显示</BigTakeaway>
    </VisualScene>
  );
};

export const SceneTokenDefinitionV10 = () => {
  const frame = useV9SceneFrame();
  const text = ['手机', '快', '没电', '了', '，', '我', '赶紧', '找', '充电器'];
  const cut = ease(frame, 62, 36);
  const scatter = ease(frame, 125, 34);
  return (
    <VisualScene title="Token 到底是什么？">
      <Layer amount={ease(frame, 18, 20)} style={{position: 'absolute', left: 0, right: 0, top: 235, textAlign: 'center', fontSize: 66}}>
        手机快没电了，我赶紧找充电器
      </Layer>
      <svg width="1320" height="180" viewBox="0 0 1320 180" style={{position: 'absolute', left: 300, top: 320}}>
        <DrawPath d="M 10 90 C 280 88 525 92 802 89 C 1002 87 1145 92 1310 89" progress={ease(frame, 35, 24)} color={v9Colors.blue} strokeWidth={3} />
        {[122, 250, 410, 526, 610, 758, 918, 1045].map((x, index) => (
          <DrawPath key={x} d={`M ${x} 48 L ${x + (index % 2 ? 5 : -4)} 132`} progress={ease(cut, index * 0.06, 0.45)} color={index % 3 === 0 ? v9Colors.magenta : v9Colors.green} strokeWidth={3.5} />
        ))}
      </svg>
      <div style={{position: 'absolute', left: 210, right: 210, top: 520, display: 'flex', justifyContent: 'center', gap: 17, transform: `translateY(${scatter * 28}px)`}}>
        {text.map((token, index) => (
          <TokenPiece key={`${token}-${index}`} amount={ease(frame, 92 + index * 9, 13)} color={[v9Colors.blue, v9Colors.green, v9Colors.magenta][index % 3]} fontSize={46}>{token}</TokenPiece>
        ))}
      </div>
      <Layer amount={ease(frame, 175, 22)} style={{position: 'absolute', left: 250, right: 250, top: 690, display: 'flex', justifyContent: 'space-around', fontSize: 42, color: v9Colors.muted}}>
        <span><s>一个汉字</s></span><span><s>一个单词</s></span><span><s>固定长度</s></span>
      </Layer>
      <BigTakeaway amount={ease(frame, 215, 22)} color={v9Colors.yellow} width={850}>Token = 模型处理的文本块</BigTakeaway>
    </VisualScene>
  );
};
