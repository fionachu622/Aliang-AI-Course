import {CUSTOM_AUDIO_DURATIONS} from './generatedVoiceover';

export const FPS = 30;

export type LessonScene = {
  id: string;
  title: string;
  eyebrow: string;
  audio: string;
  originalDurationSeconds: number;
  durationSeconds: number;
  durationInFrames: number;
};

const scene = (
  index: number,
  id: string,
  title: string,
  eyebrow: string,
  originalDurationSeconds: number,
): LessonScene => {
  const durationSeconds =
    CUSTOM_AUDIO_DURATIONS?.[index] ?? originalDurationSeconds;

  return {
    id,
    title,
    eyebrow,
    audio: `audio/${id}.mp3`,
    originalDurationSeconds,
    durationSeconds,
    durationInFrames: Math.ceil(durationSeconds * FPS),
  };
};

export const SCENES = [
  scene(0, '01', 'AI 产品背后的核心能力', '从聊天窗口追到大模型', 78.975692),
  scene(1, '02', '什么是大模型 / LLM', '先建立一个够用的理解', 39.522494),
  scene(2, '03', '大模型为什么能生成回答', '从一句话开始看概率', 92.165533),
  scene(3, '04', '为什么回答会一点点出现', '答案本身正在生成', 52.423175),
  scene(4, '05', 'Token 到底是什么', '基本单位，不等于字词字符', 67.681043),
  scene(5, '06', 'Tokenizer 如何切分文字', '进入模型前的第一道转换', 53.69102),
  scene(6, '07', 'Token ID、编码与解码', '人类文字与模型计算之间的桥', 74.385079),
  scene(7, '08', '为什么 Token 不固定', '词表与切分规则决定结果', 40.453288),
  scene(8, '09', '用真实 Tokenizer 看切分', '观察关系，不背具体数字', 63.173651),
  scene(9, '10', 'Token 为什么影响实际使用', '容量、长度与成本', 136.354059),
] as const;

export const TOTAL_FRAMES = SCENES.reduce(
  (sum, item) => sum + item.durationInFrames,
  0,
);

export const frameAt = (seconds: number) => Math.round(seconds * FPS);
