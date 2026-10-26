export const IAN_BLACKBOX_FPS = 30;

export type IanSceneKind =
  | 'daily-use'
  | 'tasks-question'
  | 'product-core'
  | 'training-use'
  | 'prediction'
  | 'probability'
  | 'generation-loop'
  | 'token-chain'
  | 'streaming'
  | 'token-unit'
  | 'variable-token'
  | 'tokenizer'
  | 'tokenizer-difference'
  | 'token-id'
  | 'codec'
  | 'zh-split'
  | 'mixed-split'
  | 'not-equal'
  | 'context-window'
  | 'output-limit'
  | 'token-cost'
  | 'summary';

export type IanBlackboxScene = {
  id: string;
  title: string;
  kind: IanSceneKind;
  durationInFrames: number;
  voice: string;
};

const seconds = (value: number) => Math.round(value * IAN_BLACKBOX_FPS);

export const IAN_BLACKBOX_SCENES: readonly IanBlackboxScene[] = [
  {
    id: '01',
    title: '每天，我们都在这样用 AI',
    kind: 'daily-use',
    durationInFrames: seconds(6),
    voice: '我们平时用 ChatGPT、DeepSeek、豆包的时候，操作其实都很简单。打开界面，输入一句话，它就会给我们回答。',
  },
  {
    id: '02',
    title: 'AI 能帮我们做很多事',
    kind: 'tasks-question',
    durationInFrames: seconds(6),
    voice: '不管是写文章、总结资料、修改文案，还是解释一个问题，它都能继续分析和处理。但从输入到回答，中间到底发生了什么？',
  },
  {
    id: '03',
    title: '产品是入口，核心能力来自大模型',
    kind: 'product-core',
    durationInFrames: seconds(7),
    voice: 'ChatGPT、DeepSeek、豆包都是完整的 AI 产品。聊天、文件、搜索和语音属于产品层，背后的核心能力来自大模型。',
  },
  {
    id: '04',
    title: '大模型：从海量数据中学会规律',
    kind: 'training-use',
    durationInFrames: seconds(8),
    voice: 'LLM 是大语言模型。在训练阶段，它从大量数据中学习规律；在使用阶段，它根据当前内容继续生成。',
  },
  {
    id: '05',
    title: '接下来，最可能出现什么？',
    kind: 'prediction',
    durationInFrames: seconds(6),
    voice: '手机只剩 1% 的电，我赶紧找……大模型会根据已有内容预测接下来最可能出现什么。',
  },
  {
    id: '06',
    title: '不是所有候选内容，都一样可能',
    kind: 'probability',
    durationInFrames: seconds(7),
    voice: '充电器、充电宝、插座和遥控器都可能出现，但在这个语境下，它们出现的可能性并不一样。',
  },
  {
    id: '07',
    title: '生成一个，接上去，再预测',
    kind: 'generation-loop',
    durationInFrames: seconds(7),
    voice: '模型生成一部分内容后，会把它接到已有内容后面，再继续预测。这个过程不断重复，逐渐形成完整回答。',
  },
  {
    id: '08',
    title: '真正接下去的，是 Token',
    kind: 'token-chain',
    durationInFrames: seconds(6),
    voice: '大模型真正往后接的，不是固定的汉字或词，而是一个个 Token。',
  },
  {
    id: '09',
    title: '为什么回答会一点一点出现？',
    kind: 'streaming',
    durationInFrames: seconds(7),
    voice: '回答本身就在逐步生成。产品把已经生成的 Token 持续显示出来，所以我们看到文字一点一点出现。',
  },
  {
    id: '10',
    title: 'Token，是模型处理文本的单位',
    kind: 'token-unit',
    durationInFrames: seconds(6),
    voice: 'Token 是大模型处理和生成文本时使用的基本单位。',
  },
  {
    id: '11',
    title: '一个 Token，没有固定大小',
    kind: 'variable-token',
    durationInFrames: seconds(6),
    voice: '一个 Token 不固定等于一个汉字、一个英文单词，甚至不固定等于一个字符。',
  },
  {
    id: '12',
    title: 'Tokenizer：把文字切成 Token',
    kind: 'tokenizer',
    durationInFrames: seconds(7),
    voice: '文本在交给大模型之前，会先经过 Tokenizer，根据词表和切分规则拆成一个个 Token。',
  },
  {
    id: '13',
    title: '同一句话，可以有不同切法',
    kind: 'tokenizer-difference',
    durationInFrames: seconds(7),
    voice: '不同模型使用的 Tokenizer 可能不同，因此同一段文字的切分结果和 Token 数量也可能不同。',
  },
  {
    id: '14',
    title: '每个 Token，都有一个数字编号',
    kind: 'token-id',
    durationInFrames: seconds(7),
    voice: '每一个 Token 在词表中都有对应的数字编号，这个编号就是 Token ID。',
  },
  {
    id: '15',
    title: '编码进去，解码出来',
    kind: 'codec',
    durationInFrames: seconds(7),
    voice: '文字转换成 Token 和 Token ID 是编码。模型生成后，再把 Token ID 转回人能看懂的文字，就是解码。',
  },
  {
    id: '16',
    title: '中文 Token：切分并非一字一个',
    kind: 'zh-split',
    durationInFrames: seconds(7),
    voice: '中文的 Token 切分并不严格按照一个汉字一个 Token 进行。画面是切分示意，具体结果会因 Tokenizer 而变化。',
  },
  {
    id: '17',
    title: '混合文本：切分结果更不固定',
    kind: 'mixed-split',
    durationInFrames: seconds(7),
    voice: '当中文、英文、空格和标点混在一起时，字符数和 Token 数之间更没有固定换算关系。',
  },
  {
    id: '18',
    title: '1M Token，不等于 100 万汉字',
    kind: 'not-equal',
    durationInFrames: seconds(6),
    voice: 'Token 和汉字、单词、字符之间没有固定的一一对应关系，所以 1M Token 不能直接理解成 100 万个汉字。',
  },
  {
    id: '19',
    title: 'AI 一次能处理多少内容？',
    kind: 'context-window',
    durationInFrames: seconds(7),
    voice: '模型用 Token 衡量一次能处理的上下文长度。128K Token 或 1M Token 表示上下文容量。',
  },
  {
    id: '20',
    title: 'AI 一次能输出多长？',
    kind: 'output-limit',
    durationInFrames: seconds(7),
    voice: '模型的回答同样由 Token 生成。允许生成的 Token 上限，决定了一次最多能输出多少内容。',
  },
  {
    id: '21',
    title: '为什么使用成本按 Token 计算？',
    kind: 'token-cost',
    durationInFrames: seconds(7),
    voice: '大模型 API 通常根据输入 Token 和输出 Token 的用量统计成本。',
  },
  {
    id: '22',
    title: '从输入文字，到生成回答',
    kind: 'summary',
    durationInFrames: seconds(8),
    voice: '文字先经过切分和编码，转成 Token 和 Token ID。模型不断预测和接续，最后再解码成我们能看懂的回答。',
  },
] as const;

export const IAN_BLACKBOX_TOTAL_FRAMES = IAN_BLACKBOX_SCENES.reduce(
  (total, scene) => total + scene.durationInFrames,
  0,
);
