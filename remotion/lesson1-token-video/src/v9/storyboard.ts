import {FPS} from '../timeline';

const sceneDefinitions = [
  ['question', '中间发生了什么？', 8.5, 41.268465],
  ['product-model', 'AI 产品与大模型', 10.5, 37.707227],
  ['llm-actions', 'LLM 的两个动作', 11.5, 39.522494],
  ['predict-next', '预测下一个 Token', 11, 44.748522],
  ['generation-loop', '生成循环', 10, 47.417011],
  ['streaming', '为什么逐步显示', 8.5, 52.423175],
  ['token-definition', 'Token 是基本单位', 9, 67.681043],
  ['tokenizer', 'Tokenizer 如何切分', 10, 53.69102],
  ['encode-decode', 'Token ID 与编解码', 10, 74.385079],
  ['variable-token', 'Token 没有固定换算', 9.5, 40.453288],
  ['tokenizer-observe', '真实 Tokenizer 看什么', 10, 63.173651],
  ['token-impact', '容量、长度与成本', 10, 100.511337],
  ['full-chain', '完整生成链', 11, 21.050488],
  ['context-outro', 'Context 与本课总结', 12, 14.792234],
] as const;

const makeScenes = (mode: 'preview' | 'voiceover') =>
  sceneDefinitions.map(([id, title, previewSeconds, voiceoverSeconds]) => {
    const durationSeconds = mode === 'voiceover' ? voiceoverSeconds : previewSeconds;
    return {
      id,
      title,
      durationSeconds,
      durationInFrames: Math.round(durationSeconds * FPS),
    };
  });

const startsFor = (scenes: ReadonlyArray<{durationInFrames: number}>) =>
  scenes.map((_, index) =>
    scenes
      .slice(0, index)
      .reduce((sum, scene) => sum + scene.durationInFrames, 0),
  );

const totalFor = (scenes: ReadonlyArray<{durationInFrames: number}>) =>
  scenes.reduce((sum, scene) => sum + scene.durationInFrames, 0);

// Keeps the original 2:21 review composition intact.
export const V9_SCENES = makeScenes('preview');
export const V9_SCENE_STARTS = startsFor(V9_SCENES);
export const V9_TOTAL_FRAMES = totalFor(V9_SCENES);

// Uses the previous transcript's ten measured narration sections (11:39 total),
// split across the fourteen visual scenes by matching transcript text length.
export const V9_VOICEOVER_SCENES = makeScenes('voiceover');
export const V9_VOICEOVER_SCENE_STARTS = startsFor(V9_VOICEOVER_SCENES);
export const V9_VOICEOVER_TOTAL_FRAMES = totalFor(V9_VOICEOVER_SCENES);
