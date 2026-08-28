import type {LessonScene} from './timeline';
import {FPS} from './timeline';

const originals = [
  78.975692,
  39.522494,
  92.165533,
  52.423175,
  67.681043,
  53.69102,
  74.385079,
  40.453288,
  63.173651,
  136.354059,
] as const;

const silentDurations = [26, 20, 34, 24, 34, 28, 34, 24, 32, 48] as const;

const labels = [
  ['AI 产品背后的核心能力', '从聊天窗口追到大模型'],
  ['什么是大模型 / LLM', '先建立一个够用的理解'],
  ['大模型为什么能生成回答', '从一句话开始看概率'],
  ['为什么回答会一点点出现', '答案本身正在生成'],
  ['Token 到底是什么', '基本单位，不等于字词字符'],
  ['Tokenizer 如何切分文字', '进入模型前的第一道转换'],
  ['Token ID、编码与解码', '人类文字与模型计算之间的桥'],
  ['为什么 Token 不固定', '词表与切分规则决定结果'],
  ['用真实 Tokenizer 看切分', '观察关系，不背具体数字'],
  ['Token 为什么影响实际使用', '容量、长度与成本'],
] as const;

export const SILENT_SCENES: readonly LessonScene[] = labels.map(
  ([title, eyebrow], index) => {
    const id = String(index + 1).padStart(2, '0');
    const durationSeconds = silentDurations[index];
    return {
      id,
      title,
      eyebrow,
      audio: '',
      originalDurationSeconds: originals[index],
      durationSeconds,
      durationInFrames: Math.ceil(durationSeconds * FPS),
    };
  },
);

export const SILENT_COVER_FRAMES = 5 * FPS;
export const SILENT_TOTAL_FRAMES =
  SILENT_COVER_FRAMES +
  SILENT_SCENES.reduce((sum, item) => sum + item.durationInFrames, 0);
