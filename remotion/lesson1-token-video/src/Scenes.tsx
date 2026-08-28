import type {ReactNode} from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {colors, fonts} from './theme';
import type {LessonScene} from './timeline';
import {FlowMap} from './components/FlowMap';
import {
  BigTakeaway,
  Card,
  FlowArrow,
  MarkerText,
  Pill,
  RevealAt,
  SceneShell,
} from './components/VisualKit';

type SceneProps = {meta: LessonScene; index: number};

const Content = ({children}: {children: ReactNode}) => (
  <div style={{position: 'absolute', left: 92, right: 92, top: 220, bottom: 88}}>
    {children}
  </div>
);

const PromptLine = ({children}: {children: ReactNode}) => (
  <div
    style={{
      fontFamily: fonts.hand,
      fontSize: 50,
      fontWeight: 700,
      lineHeight: 1.35,
      textAlign: 'center',
    }}
  >
    {children}
  </div>
);

const ProbabilityRow = ({label, value, color}: {label: string; value: number; color: string}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, 18], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <div style={{display: 'grid', gridTemplateColumns: '150px 1fr 90px', alignItems: 'center', gap: 22}}>
      <div style={{fontSize: 30, fontWeight: 750}}>{label}</div>
      <div style={{height: 22, borderRadius: 20, background: '#30333A', overflow: 'hidden'}}>
        <div
          style={{
            height: '100%',
            width: `${value * progress}%`,
            borderRadius: 20,
            background: color,
          }}
        />
      </div>
      <div style={{fontSize: 26, color: colors.muted}}>{Math.round(value)}%</div>
    </div>
  );
};

const TokenChip = ({children, color = colors.blue}: {children: ReactNode; color?: string}) => (
  <Pill color={color} style={{fontSize: 26, minWidth: 68, minHeight: 58, padding: '6px 18px'}}>
    {children}
  </Pill>
);

export const ProductScene = ({meta, index}: SceneProps) => (
  <SceneShell index={index} title={meta.title} eyebrow={meta.eyebrow} timingScale={meta.durationSeconds / meta.originalDurationSeconds}>
    <Content>
      <RevealAt at={0.8}>
        <PromptLine>我们输入一句话，到 AI 给出回答，中间发生了什么？</PromptLine>
      </RevealAt>

      <RevealAt at={7.5} style={{position: 'absolute', left: 90, top: 120, width: 630}}>
        <Card accent={colors.blue} style={{height: 350}}>
          <div style={{fontSize: 25, color: colors.muted, marginBottom: 24}}>我们直接使用的产品</div>
          <div style={{display: 'flex', flexWrap: 'wrap', gap: 14}}>
            {['ChatGPT', 'DeepSeek', '豆包'].map((name) => (
              <Pill key={name} ghost color={colors.blue} style={{fontSize: 27}}>
                {name}
              </Pill>
            ))}
          </div>
          <div style={{fontSize: 27, lineHeight: 1.7, marginTop: 28}}>
            聊天窗口 · 文件上传 · 联网搜索 · 语音 · 各种功能按钮
          </div>
        </Card>
      </RevealAt>

      <RevealAt at={41} style={{position: 'absolute', left: 790, top: 120, width: 790}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 26}}>
          <FlowArrow width={150} />
          <Card accent={colors.green} style={{width: 560, height: 350}}>
            <div style={{fontSize: 25, color: colors.muted}}>产品背后的核心能力之一</div>
            <RevealAt at={19}>
              <div
                style={{
                  fontFamily: fonts.hand,
                  fontSize: 92,
                  fontWeight: 800,
                  color: colors.green,
                  marginTop: 48,
                }}
              >
                大模型
              </div>
            </RevealAt>
            <div style={{fontSize: 29, lineHeight: 1.55, marginTop: 24}}>理解输入，并持续生成回答</div>
          </Card>
        </div>
      </RevealAt>

      <RevealAt at={70}>
        <BigTakeaway>
          AI 产品 ≠ 大模型；<MarkerText>大模型是产品背后的核心能力之一</MarkerText>
        </BigTakeaway>
      </RevealAt>
    </Content>
  </SceneShell>
);

export const LlmScene = ({meta, index}: SceneProps) => (
  <SceneShell index={index} title={meta.title} eyebrow={meta.eyebrow} timingScale={meta.durationSeconds / meta.originalDurationSeconds}>
    <Content>
      <RevealAt at={4.5} style={{position: 'absolute', left: 120, top: 40, width: 500}}>
        <div
          style={{
            fontFamily: fonts.hand,
            fontSize: 170,
            fontWeight: 900,
            color: colors.blue,
            lineHeight: 1,
          }}
        >
          LLM
        </div>
      </RevealAt>
      <RevealAt at={9} style={{position: 'absolute', left: 120, top: 235, width: 570}}>
        <div style={{fontSize: 32, fontWeight: 750}}>Large Language Model</div>
        <div style={{fontSize: 30, color: colors.muted, marginTop: 12}}>大语言模型</div>
      </RevealAt>

      <RevealAt at={22} style={{position: 'absolute', left: 700, top: 25, width: 880}}>
        <Card accent={colors.green} style={{height: 420}}>
          <div style={{fontSize: 27, color: colors.muted, marginBottom: 22}}>普通用户先记住这一句</div>
          <div style={{fontFamily: fonts.hand, fontSize: 43, lineHeight: 1.55, fontWeight: 700}}>
            通过大量数据学习语言、知识和内容之间的复杂规律，
            <MarkerText color={colors.greenSoft}>再根据已有内容继续生成。</MarkerText>
          </div>
        </Card>
      </RevealAt>

      <RevealAt at={15} style={{position: 'absolute', left: 160, right: 160, bottom: 150}}>
        <div
          style={{
            padding: '20px 30px',
            borderRadius: 24,
            background: colors.surfaceStrong,
            color: colors.white,
            fontSize: 27,
            textAlign: 'center',
          }}
        >
          这一课先不钻进 Transformer、参数量和训练细节
        </div>
      </RevealAt>
      <RevealAt at={34}>
        <BigTakeaway>它到底怎样一步步写出一整段回答？</BigTakeaway>
      </RevealAt>
    </Content>
  </SceneShell>
);

export const PredictionScene = ({meta, index}: SceneProps) => (
  <SceneShell index={index} title={meta.title} eyebrow={meta.eyebrow} timingScale={meta.durationSeconds / meta.originalDurationSeconds}>
    <Content>
      <RevealAt at={7}>
        <PromptLine>
          手机只剩 1% 的电，我赶紧找 <span style={{color: colors.coral}}>……</span>
        </PromptLine>
      </RevealAt>
      <div style={{position: 'absolute', left: 170, top: 130, width: 650, display: 'grid', gap: 19}}>
        {[
          ['充电器', 92, colors.green, 17],
          ['充电宝', 82, colors.green, 20],
          ['插座', 60, colors.blue, 23],
          ['数据线', 54, colors.blue, 26],
          ['遥控器', 12, colors.muted, 31],
        ].map(([label, value, color, at]) => (
          <RevealAt key={String(label)} at={Number(at)}>
            <ProbabilityRow label={String(label)} value={Number(value)} color={String(color)} />
          </RevealAt>
        ))}
      </div>

      <RevealAt at={40} style={{position: 'absolute', right: 110, top: 145, width: 680}}>
        <Card accent={colors.green} style={{height: 305}}>
          <div style={{fontSize: 28, color: colors.muted}}>模型根据</div>
          <div style={{fontSize: 37, fontWeight: 800, lineHeight: 1.6, marginTop: 14}}>
            已有内容 + 学到的规律
            <br />
            <span style={{color: colors.green}}>判断下一个 Token</span>
          </div>
        </Card>
      </RevealAt>

      <RevealAt at={56} style={{position: 'absolute', right: 100, top: 500, width: 720}}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16}}>
          {['预测', '生成', '接回上下文', '再预测'].map((item, i) => (
            <div key={item} style={{display: 'flex', alignItems: 'center', gap: 16}}>
              <Pill ghost={i !== 1} color={i === 1 ? colors.coral : colors.blue} style={{fontSize: 24}}>
                {item}
              </Pill>
              {i < 3 ? <span style={{fontSize: 38, color: colors.muted}}>→</span> : null}
            </div>
          ))}
        </div>
      </RevealAt>
      <RevealAt at={82}>
        <BigTakeaway>
          生成文本 ≈ 一场极其复杂的 <MarkerText>Token 接龙</MarkerText>
        </BigTakeaway>
      </RevealAt>
    </Content>
  </SceneShell>
);

export const StreamingScene = ({meta, index}: SceneProps) => (
  <SceneShell index={index} title={meta.title} eyebrow={meta.eyebrow} timingScale={meta.durationSeconds / meta.originalDurationSeconds}>
    <Content>
      <RevealAt at={8} style={{position: 'absolute', left: 150, right: 150, top: 40}}>
        <Card accent={colors.blue}>
          <div style={{fontSize: 27, color: colors.muted, marginBottom: 22}}>聊天窗口里，你看到的回答</div>
          <div style={{display: 'flex', flexWrap: 'wrap', gap: 14, minHeight: 82}}>
            {['手机', '快', '没电', '了', '，', '我', '得', '找', '充电器'].map((token, i) => (
              <RevealAt key={`${token}-${i}`} at={10 + i * 1.05}>
                <TokenChip color={i === 8 ? colors.green : colors.blue}>{token}</TokenChip>
              </RevealAt>
            ))}
          </div>
        </Card>
      </RevealAt>

      <RevealAt at={22} style={{position: 'absolute', left: 215, right: 215, top: 330}}>
        <FlowMap active={3} at={0} compact />
      </RevealAt>

      <RevealAt at={39} style={{position: 'absolute', left: 270, right: 270, top: 500}}>
        <Card accent={colors.coral}>
          <div style={{fontFamily: fonts.hand, fontSize: 41, fontWeight: 750, textAlign: 'center'}}>
            不是先写完整答案，再模拟打字
          </div>
        </Card>
      </RevealAt>
      <RevealAt at={44}>
        <BigTakeaway>
          <MarkerText color={colors.greenSoft}>答案本身就在持续生成</MarkerText>
        </BigTakeaway>
      </RevealAt>
    </Content>
  </SceneShell>
);

export const TokenDefinitionScene = ({meta, index}: SceneProps) => (
  <SceneShell index={index} title={meta.title} eyebrow={meta.eyebrow} timingScale={meta.durationSeconds / meta.originalDurationSeconds}>
    <Content>
      <div style={{position: 'absolute', left: 70, top: 35, width: 430}}>
        {[
          ['128K Token', 7],
          ['100 万 Token 上下文', 10],
          ['输入 Token', 13],
          ['输出 Token', 16],
          ['每百万 Token 价格', 19],
        ].map(([label, at]) => (
          <RevealAt key={String(label)} at={Number(at)} style={{marginBottom: 12}}>
            <Pill ghost color={colors.blue} style={{fontSize: 23}}>
              {label}
            </Pill>
          </RevealAt>
        ))}
      </div>

      <RevealAt at={24} style={{position: 'absolute', left: 535, right: 50, top: 30}}>
        <Card accent={colors.green} style={{height: 210}}>
          <div style={{fontFamily: fonts.hand, fontSize: 49, fontWeight: 800, lineHeight: 1.45}}>
            Token = 大模型处理和生成文本时使用的
            <MarkerText>基本单位</MarkerText>
          </div>
        </Card>
      </RevealAt>

      <div style={{position: 'absolute', left: 535, right: 50, top: 290, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 18}}>
        {[
          ['≠ 一个汉字', 43],
          ['≠ 一个英文单词', 49],
          ['≠ 一个字符', 54],
        ].map(([label, at]) => (
          <RevealAt key={String(label)} at={Number(at)}>
            <Card accent={colors.coral} style={{height: 125, padding: '32px 24px 24px 42px'}}>
              <div style={{fontSize: 31, fontWeight: 800, textAlign: 'center'}}>{label}</div>
            </Card>
          </RevealAt>
        ))}
      </div>

      <RevealAt at={59} style={{position: 'absolute', left: 660, right: 180, top: 500}}>
        <div style={{fontFamily: fonts.hand, fontSize: 44, fontWeight: 750, color: colors.ink}}>
          更准确地说：大模型在做 Token 接龙
        </div>
      </RevealAt>
      <RevealAt at={64}>
        <BigTakeaway>正常文字怎样变成 Token？中间要经过 Tokenizer。</BigTakeaway>
      </RevealAt>
    </Content>
  </SceneShell>
);

export const TokenizerScene = ({meta, index}: SceneProps) => (
  <SceneShell index={index} title={meta.title} eyebrow={meta.eyebrow} timingScale={meta.durationSeconds / meta.originalDurationSeconds}>
    <Content>
      <RevealAt at={5}>
        <PromptLine>手机快没电了，我得赶紧找充电器。</PromptLine>
      </RevealAt>

      <RevealAt at={12} style={{position: 'absolute', left: 250, right: 250, top: 140}}>
        <FlowMap active={1} at={0} />
      </RevealAt>

      <div style={{position: 'absolute', left: 220, right: 220, top: 350}}>
        <RevealAt at={24}>
          <Card accent={colors.green}>
            <div style={{display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap'}}>
              {['文本', '按词表', '按规则', '切成', 'Token'].map((item, i) => (
                <div key={item} style={{display: 'flex', alignItems: 'center', gap: 14}}>
                  <Pill ghost={i < 4} color={i === 4 ? colors.coral : colors.green} style={{fontSize: 27}}>
                    {item}
                  </Pill>
                  {i < 4 ? <span style={{fontSize: 34, color: colors.muted}}>→</span> : null}
                </div>
              ))}
            </div>
          </Card>
        </RevealAt>
      </div>

      <RevealAt at={42} style={{position: 'absolute', left: 370, right: 370, top: 535}}>
        <div style={{fontSize: 31, lineHeight: 1.55, textAlign: 'center', color: colors.muted}}>
          不同模型的 Tokenizer 可能不同
          <br />
          <strong style={{color: colors.ink}}>同一段文字的切法和 Token 数也可能不同</strong>
        </div>
      </RevealAt>
      <RevealAt at={50}>
        <BigTakeaway style={{bottom: 15, fontSize: 40}}>
          模型真正处理的，还不是“手机”“充电器”这些文字。
        </BigTakeaway>
      </RevealAt>
    </Content>
  </SceneShell>
);

const PipelineNode = ({
  title,
  sub,
  color,
}: {
  title: string;
  sub?: string;
  color: string;
}) => (
  <div
    style={{
      width: 220,
      minHeight: 128,
      borderRadius: 28,
      border: `3px solid ${color}`,
      background: colors.surface,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: `0 14px 35px ${color}18`,
      padding: 16,
      textAlign: 'center',
    }}
  >
    <div style={{fontSize: 31, fontWeight: 800, color}}>{title}</div>
    {sub ? <div style={{fontSize: 21, color: colors.muted, marginTop: 8}}>{sub}</div> : null}
  </div>
);

export const EncodeDecodeScene = ({meta, index}: SceneProps) => (
  <SceneShell index={index} title={meta.title} eyebrow={meta.eyebrow} timingScale={meta.durationSeconds / meta.originalDurationSeconds}>
    <Content>
      <div style={{position: 'absolute', left: 45, right: 45, top: 70, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18}}>
        {[
          ['文字', '人能看懂', colors.blue, 2],
          ['Tokenizer', '切分', colors.green, 9],
          ['Token', '基本单位', colors.coral, 13],
          ['Token ID', '数字编号', colors.dark, 20],
          ['大模型', '计算与生成', colors.green, 31],
        ].map(([title, sub, color, at], i) => (
          <div key={String(title)} style={{display: 'flex', alignItems: 'center', gap: 18}}>
            <RevealAt at={Number(at)}>
              <PipelineNode title={String(title)} sub={String(sub)} color={String(color)} />
            </RevealAt>
            {i < 4 ? (
              <RevealAt at={Number(at) + 0.35}>
                <FlowArrow width={74} />
              </RevealAt>
            ) : null}
          </div>
        ))}
      </div>

      <RevealAt at={39} style={{position: 'absolute', left: 180, top: 315, width: 620}}>
        <Card accent={colors.blue}>
          <div style={{fontSize: 27, color: colors.muted}}>Encoding · 编码</div>
          <div style={{fontSize: 35, fontWeight: 800, marginTop: 14}}>文字 → Token / Token ID</div>
        </Card>
      </RevealAt>
      <RevealAt at={49} style={{position: 'absolute', right: 180, top: 315, width: 620}}>
        <Card accent={colors.green}>
          <div style={{fontSize: 27, color: colors.muted}}>Decoding · 解码</div>
          <div style={{fontSize: 35, fontWeight: 800, marginTop: 14}}>Token / Token ID → 回答</div>
        </Card>
      </RevealAt>

      <RevealAt at={60} style={{position: 'absolute', left: 260, right: 260, top: 530}}>
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 20}}>
          {['人类文字', '编码', '模型处理', '解码', '最终回答'].map((item, i) => (
            <div key={item} style={{display: 'flex', alignItems: 'center', gap: 20}}>
              <Pill ghost={i !== 2} color={i === 2 ? colors.dark : colors.blue} style={{fontSize: 23}}>
                {item}
              </Pill>
              {i < 4 ? <span style={{fontSize: 34, color: colors.muted}}>→</span> : null}
            </div>
          ))}
        </div>
      </RevealAt>
      <RevealAt at={69}>
        <BigTakeaway>具体 Token ID 不重要，重要的是“文字 ↔ 数字表示”的转换关系。</BigTakeaway>
      </RevealAt>
    </Content>
  </SceneShell>
);

export const VariableTokenScene = ({meta, index}: SceneProps) => (
  <SceneShell index={index} title={meta.title} eyebrow={meta.eyebrow} timingScale={meta.durationSeconds / meta.originalDurationSeconds}>
    <Content>
      <RevealAt at={5}>
        <PromptLine>一个 Token 到底对应多少文字？</PromptLine>
      </RevealAt>
      <RevealAt at={8} style={{position: 'absolute', left: 650, right: 650, top: 95}}>
        <Pill color={colors.coral} style={{fontSize: 36, width: 360}}>没有固定答案</Pill>
      </RevealAt>

      <div style={{position: 'absolute', left: 105, right: 105, top: 225, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 20}}>
        {[
          ['中文词', '可能合成，也可能拆开', colors.blue, 19],
          ['English', '可能是整词，也可能是词片', colors.green, 23],
          ['12345', '数字也有自己的切法', colors.coral, 27],
          ['emoji 😂', '字符不一定等于 Token', colors.dark, 31],
        ].map(([title, body, color, at]) => (
          <RevealAt key={String(title)} at={Number(at)}>
            <Card accent={String(color)} style={{height: 245}}>
              <div style={{fontSize: 36, fontWeight: 850, color: String(color)}}>{title}</div>
              <div style={{fontSize: 25, lineHeight: 1.55, marginTop: 20, color: colors.muted}}>{body}</div>
            </Card>
          </RevealAt>
        ))}
      </div>
      <RevealAt at={34}>
        <BigTakeaway>Token 与汉字、单词、字符之间，没有固定的一一对应关系。</BigTakeaway>
      </RevealAt>
      <RevealAt at={38} style={{position: 'absolute', right: 150, bottom: 28}}>
        <Pill color={colors.green} style={{fontSize: 23}}>下一步：打开真实 Tokenizer</Pill>
      </RevealAt>
    </Content>
  </SceneShell>
);

const Specimen = ({
  title,
  text,
  color,
  characterCount,
  tokens,
}: {
  title: string;
  text: string;
  color: string;
  characterCount: number;
  tokens: readonly {piece: string; id: number}[];
}) => (
  <Card accent={color} style={{height: 440}}>
    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20}}>
      <div style={{fontSize: 25, color: colors.muted}}>{title}</div>
      <Pill ghost color={color} style={{fontSize: 20, minHeight: 40, padding: '3px 13px'}}>
        {characterCount} 字符 → {tokens.length} Token
      </Pill>
    </div>
    <div style={{fontFamily: fonts.hand, fontSize: 34, fontWeight: 750, lineHeight: 1.45, marginTop: 18}}>
      {text}
    </div>
    <div style={{marginTop: 22, borderTop: `2px dashed ${colors.line}`, paddingTop: 17}}>
      <div style={{fontSize: 21, color: colors.muted}}>Token 切分结果 · ␠ 表示前导空格</div>
      <div style={{display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap'}}>
        {tokens.map((token, i) => (
          <div
            key={`${token.piece}-${token.id}-${i}`}
            style={{
              minHeight: 52,
              padding: '5px 11px 4px',
              border: `2px solid ${color}`,
              borderRadius: 13,
              background: colors.paper,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              lineHeight: 1.05,
            }}
          >
            <span style={{fontSize: 19, fontWeight: 800, color}}>{token.piece}</span>
            <span style={{fontSize: 12, color: colors.muted, marginTop: 5}}>#{token.id}</span>
          </div>
        ))}
      </div>
    </div>
  </Card>
);

const chineseTokens = [
  {piece: '手机', id: 10485},
  {piece: '快', id: 3377},
  {piece: '没', id: 14612},
  {piece: '电', id: 5719},
  {piece: '了', id: 4531},
  {piece: '，我', id: 40824},
  {piece: '得', id: 11789},
  {piece: '赶', id: 127062},
  {piece: '紧', id: 50391},
  {piece: '找', id: 33943},
  {piece: '充', id: 21478},
  {piece: '电', id: 5719},
  {piece: '器', id: 13837},
  {piece: '。', id: 788},
] as const;

const mixedTokens = [
  {piece: '这个', id: 41713},
  {piece: '␠PPT', id: 140534},
  {piece: '␠明', id: 70117},
  {piece: '天', id: 867},
  {piece: '要', id: 7724},
  {piece: '交', id: 10130},
  {piece: '，', id: 979},
  {piece: '帮', id: 58626},
  {piece: '我', id: 7522},
  {piece: '␠check', id: 2371},
  {piece: '␠一', id: 16304},
  {piece: '下', id: 3771},
  {piece: '␠😂', id: 163123},
] as const;

export const TokenizerDemoScene = ({meta, index}: SceneProps) => (
  <SceneShell index={index} title={meta.title} eyebrow={meta.eyebrow} timingScale={meta.durationSeconds / meta.originalDurationSeconds}>
    <Content>
      <div style={{position: 'absolute', left: 95, right: 95, top: 35, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 35}}>
        <RevealAt at={3}>
          <Specimen
            title="样例 A · 纯中文"
            text="手机快没电了，我得赶紧找充电器。"
            color={colors.blue}
            characterCount={16}
            tokens={chineseTokens}
          />
        </RevealAt>
        <RevealAt at={31}>
          <Specimen
            title="样例 B · 混合文本"
            text="这个 PPT 明天要交，帮我 check 一下 😂"
            color={colors.green}
            characterCount={25}
            tokens={mixedTokens}
          />
        </RevealAt>
      </div>

      <RevealAt at={24} style={{position: 'absolute', left: 150, bottom: 105}}>
        <Pill color={colors.blue} style={{fontSize: 23}}>观察：汉字数是否等于 Token 数？</Pill>
      </RevealAt>
      <RevealAt at={47} style={{position: 'absolute', right: 150, bottom: 105}}>
        <Pill color={colors.green} style={{fontSize: 23}}>观察：中文、英文、标点、emoji 如何混合切分？</Pill>
      </RevealAt>
      <RevealAt at={52} style={{position: 'absolute', left: 0, right: 0, bottom: 50, textAlign: 'center'}}>
        <span style={{fontSize: 19, color: colors.muted}}>示例编码：o200k_base（GPT-4o）· 换一个 Tokenizer，切分与 ID 可能不同</span>
      </RevealAt>
      <RevealAt at={58}>
        <BigTakeaway style={{bottom: 215, fontSize: 40}}>
          100 万 Token <span style={{color: colors.coral}}>≠</span> 100 万个汉字
        </BigTakeaway>
      </RevealAt>
    </Content>
  </SceneShell>
);

export const ImpactScene = ({meta, index}: SceneProps) => (
  <SceneShell index={index} title={meta.title} eyebrow={meta.eyebrow} timingScale={meta.durationSeconds / meta.originalDurationSeconds}>
    <Content>
      <RevealAt at={3}>
        <PromptLine>普通用户为什么也需要理解 Token？</PromptLine>
      </RevealAt>

      <div style={{position: 'absolute', left: 75, right: 75, top: 130, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 28}}>
        <RevealAt at={15}>
          <Card accent={colors.blue} style={{height: 310}}>
            <div style={{fontSize: 26, color: colors.muted}}>01 · 容量</div>
            <div style={{fontFamily: fonts.hand, fontSize: 42, fontWeight: 800, marginTop: 20}}>一次能处理多少</div>
            <div style={{fontSize: 31, marginTop: 30, color: colors.blue}}>128K / 1M Token</div>
          </Card>
        </RevealAt>
        <RevealAt at={53}>
          <Card accent={colors.green} style={{height: 310}}>
            <div style={{fontSize: 26, color: colors.muted}}>02 · 长度</div>
            <div style={{fontFamily: fonts.hand, fontSize: 42, fontWeight: 800, marginTop: 20}}>最多能生成多少</div>
            <div style={{fontSize: 31, marginTop: 30, color: colors.green}}>输出 Token</div>
          </Card>
        </RevealAt>
        <RevealAt at={76}>
          <Card accent={colors.coral} style={{height: 310}}>
            <div style={{fontSize: 26, color: colors.muted}}>03 · 成本</div>
            <div style={{fontFamily: fonts.hand, fontSize: 42, fontWeight: 800, marginTop: 20}}>一次调用多少钱</div>
            <div style={{fontSize: 31, marginTop: 30, color: colors.coral}}>输入 + 输出 Token</div>
          </Card>
        </RevealAt>
      </div>

      <RevealAt at={101} style={{position: 'absolute', left: 150, right: 150, top: 500}}>
        <FlowMap active={-1} at={0} compact />
      </RevealAt>

      <RevealAt at={118} style={{position: 'absolute', left: 230, right: 230, top: 620}}>
        <div style={{fontFamily: fonts.hand, fontSize: 38, fontWeight: 750, textAlign: 'center'}}>
          文字 → Token → 预测 → 持续生成 → 解码成回答
        </div>
      </RevealAt>

      <RevealAt at={128}>
        <BigTakeaway style={{bottom: 8, fontSize: 38}}>
          下一课：AI 一次到底能看到多少？<MarkerText color={colors.greenSoft}>Context</MarkerText>
        </BigTakeaway>
      </RevealAt>
    </Content>
  </SceneShell>
);
