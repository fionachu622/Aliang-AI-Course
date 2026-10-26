import {FPS} from '../timeline';

// Estimated from V2 transcript length using the V1 narration pace.
// Replace these durations with measured V2 audio before final synchronization.
const definitions = [
  ['question', '中间发生了什么', 8.5, 40],
  ['product-model', 'AI 产品与大模型', 10.5, 34],
  ['llm-actions', 'LLM 如何继续生成', 11.5, 37],
  ['predict-next', '预测接下来更可能出现什么', 11, 42],
  ['generation-loop', '生成循环', 10, 40],
  ['streaming', '为什么逐步显示', 8.5, 47],
  ['token-definition', 'Token 是基本单位', 9, 67],
  ['tokenizer', 'Tokenizer 如何切分', 10, 61],
  ['encode-decode', 'Token ID、编码与解码', 10, 89],
  ['tokenizer-merged', '真实 Tokenizer 切分示例', 16, 81],
  ['token-impact', '容量、输出长度与成本', 10, 106],
  ['full-chain', '完整生成链', 12, 25],
] as const;

export const V14_REVISED_SCENES = definitions.map(
  ([id, title, designSeconds, estimatedVoiceoverSeconds]) => ({
    id,
    title,
    designDurationInFrames: Math.round(designSeconds * FPS),
    durationInFrames: Math.round(estimatedVoiceoverSeconds * FPS),
    estimatedVoiceoverSeconds,
  }),
);

export const V14_REVISED_SCENE_STARTS = V14_REVISED_SCENES.map(
  (_, index) =>
    V14_REVISED_SCENES.slice(0, index).reduce(
      (sum, scene) => sum + scene.durationInFrames,
      0,
    ),
);

export const V14_REVISED_TOTAL_FRAMES = V14_REVISED_SCENES.reduce(
  (sum, scene) => sum + scene.durationInFrames,
  0,
);
