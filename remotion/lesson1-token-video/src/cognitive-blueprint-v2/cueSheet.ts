export type SemanticCue = {
  id: string;
  sceneId: string;
  sourceText: string;
  firstAllowedAt: string;
  designFrame: number;
  visibleElements: readonly string[];
  forbiddenUntil: readonly string[];
  provenance: '逐字稿原文' | '忠实视觉化';
};

// This is a semantic-order cue sheet. The V2 voice-over has not been recorded,
// so designFrame controls the preview rhythm only. It must be recalibrated to
// real audio or subtitle timestamps before the composition is called strictly
// synchronized.
export const OPENING_CUES = [
  {
    id: 'L1-S01-C00',
    sceneId: 'opening-question',
    sourceText: '我们每天使用的 AI 产品，背后的核心能力来自哪里？',
    firstAllowedAt: '说到“AI 产品”',
    designFrame: 4,
    visibleElements: ['AI 产品外壳'],
    forbiddenUntil: ['ChatGPT', 'DeepSeek', '豆包', '大模型', 'Token', 'Tokenizer'],
    provenance: '逐字稿原文',
  },
  {
    id: 'L1-S01-C01',
    sceneId: 'opening-question',
    sourceText: '我们平时用 ChatGPT、DeepSeek、豆包的时候，操作其实都很简单。',
    firstAllowedAt: '说到“ChatGPT、DeepSeek、豆包”',
    designFrame: 18,
    visibleElements: ['ChatGPT', 'DeepSeek', '豆包', 'AI 产品外壳'],
    forbiddenUntil: ['大模型', 'Token', 'Tokenizer'],
    provenance: '逐字稿原文',
  },
  {
    id: 'L1-S01-C02',
    sceneId: 'opening-question',
    sourceText: '打开聊天框，输入一句话，AI 很快就会给我们回答。',
    firstAllowedAt: '说到“打开聊天框”',
    designFrame: 52,
    visibleElements: ['聊天窗口', '输入消息', '回答消息'],
    forbiddenUntil: ['大模型', 'Token', 'Tokenizer'],
    provenance: '忠实视觉化',
  },
  {
    id: 'L1-S01-C03',
    sceneId: 'opening-question',
    sourceText: '它可以帮我们写文章、总结资料、修改文案、解释问题。',
    firstAllowedAt: '说到“写文章”',
    designFrame: 118,
    visibleElements: ['写文章', '总结资料', '修改文案', '解释问题'],
    forbiddenUntil: ['大模型', 'Token', 'Tokenizer'],
    provenance: '逐字稿原文',
  },
  {
    id: 'L1-S01-C04',
    sceneId: 'opening-question',
    sourceText: '有时候你给它一个比较复杂的任务，它也能继续往下分析和处理。',
    firstAllowedAt: '说到“复杂的任务”',
    designFrame: 188,
    visibleElements: ['分析任务'],
    forbiddenUntil: ['大模型', 'Token', 'Tokenizer'],
    provenance: '忠实视觉化',
  },
  {
    id: 'L1-S01-C05',
    sceneId: 'opening-question',
    sourceText: '你输入这句话以后，到 AI 给出回答之前，中间到底发生了什么？',
    firstAllowedAt: '说到“再往里面追问一步”',
    designFrame: 222,
    visibleElements: ['输入', '未知过程', '回答'],
    forbiddenUntil: ['大模型', 'Token', 'Tokenizer'],
    provenance: '忠实视觉化',
  },
  {
    id: 'L1-S02-C01',
    sceneId: 'product-model',
    sourceText: 'ChatGPT、DeepSeek、豆包，这些都是一个个完整的 AI 产品。',
    firstAllowedAt: '说到“完整的 AI 产品”',
    designFrame: 14,
    visibleElements: ['AI 产品外壳'],
    forbiddenUntil: ['大模型核心'],
    provenance: '忠实视觉化',
  },
  {
    id: 'L1-S02-C02',
    sceneId: 'product-model',
    sourceText: '聊天窗口、文件上传、联网搜索、语音对话，以及各种功能和按钮，都属于产品的一部分。',
    firstAllowedAt: '依次说到各项产品功能',
    designFrame: 42,
    visibleElements: ['聊天', '文件', '搜索', '语音', '产品包含关系'],
    forbiddenUntil: ['大模型核心'],
    provenance: '忠实视觉化',
  },
  {
    id: 'L1-S02-C03',
    sceneId: 'product-model',
    sourceText: '这些产品能理解我们的内容、生成回答，背后的核心能力，就是大模型。',
    firstAllowedAt: '说到“背后的核心能力”',
    designFrame: 126,
    visibleElements: ['大模型', '核心能力', '产品包含模型'],
    forbiddenUntil: ['Token', 'Tokenizer'],
    provenance: '逐字稿原文',
  },
  {
    id: 'L1-S03-C01',
    sceneId: 'llm-patterns',
    sourceText: 'LLM 的全称是 Large Language Model，大语言模型，简称大模型。',
    firstAllowedAt: '说到“LLM”',
    designFrame: 16,
    visibleElements: ['LLM', '大模型'],
    forbiddenUntil: ['预测下一个', 'Token'],
    provenance: '逐字稿原文',
  },
  {
    id: 'L1-S03-C02',
    sceneId: 'llm-patterns',
    sourceText: '它是靠海量数据训练出来的。',
    firstAllowedAt: '说到“海量数据”',
    designFrame: 54,
    visibleElements: ['海量数据', '数据进入模型'],
    forbiddenUntil: ['预测下一个', 'Token'],
    provenance: '忠实视觉化',
  },
  {
    id: 'L1-S03-C03',
    sceneId: 'llm-patterns',
    sourceText: '通过大量数据学习了语言、知识和内容之间复杂规律。',
    firstAllowedAt: '说到“学习了……复杂规律”',
    designFrame: 94,
    visibleElements: ['规律', '模型内部连接'],
    forbiddenUntil: ['预测下一个', 'Token'],
    provenance: '忠实视觉化',
  },
  {
    id: 'L1-S03-C04',
    sceneId: 'llm-patterns',
    sourceText: '能够根据已有内容继续生成内容的模型。',
    firstAllowedAt: '说到“继续生成内容”',
    designFrame: 138,
    visibleElements: ['已有内容', '继续生成'],
    forbiddenUntil: ['Token'],
    provenance: '逐字稿原文',
  },
  {
    id: 'L1-S03-C05',
    sceneId: 'llm-patterns',
    sourceText: '它到底是怎么生成的？',
    firstAllowedAt: '说到“怎么生成”',
    designFrame: 182,
    visibleElements: ['生成路径上的未知位置'],
    forbiddenUntil: ['手机只剩 1% 的电'],
    provenance: '忠实视觉化',
  },
] as const satisfies readonly SemanticCue[];

export const cueFrame = (id: (typeof OPENING_CUES)[number]['id']) => {
  const cue = OPENING_CUES.find((item) => item.id === id);
  if (!cue) {
    throw new Error(`Unknown cue: ${id}`);
  }
  return cue.designFrame;
};
