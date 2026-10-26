import {FPS} from '../timeline';
import type {RevisedSceneTimingOverride} from '../v14/Lesson1ChalkboardRevised';

export const REVIEW_VOICEOVER_FILE = 'audio/lesson1-v2-2026-08-31.mp3';
export const REVIEW_VOICEOVER_DURATION_SECONDS = 525.24;

// Boundaries are taken from the recorded narration, not estimated text length.
// The last boundary uses ceil so the composition never cuts off the MP3 tail.
const absoluteFrame = (seconds: number) => Math.round(seconds * FPS);
const REVIEW_SCENE_BOUNDARIES = [
  0,
  absoluteFrame(26.83),
  absoluteFrame(58.92),
  absoluteFrame(89.38),
  absoluteFrame(122.69),
  absoluteFrame(156.99),
  absoluteFrame(197.84),
  absoluteFrame(243.18),
  absoluteFrame(295.79),
  absoluteFrame(360.65),
  absoluteFrame(424.17),
  absoluteFrame(502.09),
  Math.ceil(REVIEW_VOICEOVER_DURATION_SECONDS * FPS),
] as const;

export const REVIEW_VOICEOVER_TOTAL_FRAMES =
  REVIEW_SCENE_BOUNDARIES[REVIEW_SCENE_BOUNDARIES.length - 1];

type CueAnchor = readonly [absoluteSeconds: number, designFrame: number];

const sceneTiming = (
  sceneIndex: number,
  finalDesignFrame: number,
  cues: readonly CueAnchor[],
): RevisedSceneTimingOverride => {
  const start = REVIEW_SCENE_BOUNDARIES[sceneIndex];
  const end = REVIEW_SCENE_BOUNDARIES[sceneIndex + 1];
  const durationInFrames = end - start;

  return {
    durationInFrames,
    timingAnchors: [
      {frame: 0, designFrame: 0},
      ...cues.map(([seconds, designFrame]) => ({
        frame: absoluteFrame(seconds) - start,
        designFrame,
      })),
      {frame: durationInFrames - 1, designFrame: finalDesignFrame},
    ],
  };
};

export const REVIEW_SCENE_TIMING_OVERRIDES = {
  question: sceneTiming(0, 254, [
    [0.07, 8], // ChatGPT
    [0.9, 27], // DeepSeek
    [1.7, 46], // 豆包
    [4.71, 72], // 打开聊天框，输入一句话
    [7.0, 98], // AI 很快就会给我们回答
    [7.3, 120],
    [8.52, 160], // 写文章
    [9.35, 174], // 总结资料
    [10.15, 188], // 修改文案
    [11.0, 202], // 解释问题
    [12.42, 216], // 比较复杂的任务
    [17.16, 236], // 再往里面追问一步
    [24.08, 250], // 这一课要解决的问题
  ]),
  'product-model': sceneTiming(1, 314, [
    [32.27, 42], // 聊天窗口
    [34.2, 72], // 文件上传
    [36.0, 102], // 联网搜索
    [37.3, 132], // 语音对话
    [42.78, 174], // 背后的核心能力就是大模型
    [46.32, 204], // 建立产品与模型关系
    [49.06, 222], // 我们直接使用 AI 产品
    [51.18, 230], // 大模型是背后的核心能力
  ]),
  'llm-actions': sceneTiming(2, 344, [
    [59.1, 4], // LLM
    [63.64, 28], // Large Language Model
    [65.86, 52], // 大语言模型
    [68.2, 76], // 简称大模型
    [68.22, 100],
    [68.26, 112],
    [68.3, 124], // 海量数据训练
    [68.34, 126],
    [70.56, 140], // 海量数据
    [74.36, 160], // 通过大量数据学习
    [76.84, 176], // 复杂规律
    [79.1, 202], // 根据已有内容
    [79.2, 216],
    [80.0, 234],
    [80.84, 250], // 继续生成内容
    [80.9, 266],
    [83.7, 292], // 它到底是怎么生成的
  ]),
  'predict-next': sceneTiming(3, 329, [
    [93.14, 4], // 手机只剩 1%……
    [98.76, 48], // 充电器
    [99.34, 68], // 充电宝
    [99.92, 88], // 插座
    [100.5, 108], // 遥控器
    [105.67, 176], // 可能性并不一样
    [111.03, 212], // 大模型也会做类似的事情
    [114.01, 218], // 根据前面已有内容
  ]),
  'generation-loop': sceneTiming(4, 299, [
    [125.08, 8], // 生成了一部分内容
    [126.84, 28], // 不会停下来
    [131.33, 42], // 再继续预测
    [132.57, 62], // 接下来可能出现什么
    [133.97, 76], // 生成一个
    [135.0, 98],
    [135.39, 112], // 接上去
    [137.39, 140], // 不断重复
    [138.89, 170], // 形成一整段回答
    [141.82, 178],
    [144.84, 188], // 文字接龙
    [146.44, 208],
    [148.46, 258], // 但真正接的不是汉字
    [154.26, 268], // 接的是 Token
  ]),
  streaming: sceneTiming(5, 254, [
    [158.69, 8], // 刚才这个过程
    [162.11, 18], // 为什么一点一点出现
    [167.07, 32], // 回答本身逐步生成
    [170.33, 38], // 先生成一个 Token
    [173.79, 52], // 再生成下一个 Token
    [176.67, 66], // 继续往后
    [177.14, 88], // AI 产品
    [178.04, 104], // 持续显示到界面
    [179.72, 120],
    [181.44, 168],
    [183.16, 200], // 回答一点一点出现
    [185.1, 228],
    [190.61, 238], // 答案本身持续生成
  ]),
  'token-definition': sceneTiming(6, 269, [
    [201.64, 5], // Token 这个词
    [211.06, 40], // 模型处理和生成文本的基本单位
    [223.89, 92], // 不等于一个汉字
    [229.98, 122], // 不等于一个英文单词
    [232.04, 152], // 不等于一个字符
  ]),
  tokenizer: sceneTiming(7, 299, [
    [244.18, 4], // 正常文字怎么变成 Token
    [251.16, 20], // 输入示例句
    [258.71, 44], // 交给模型之前
    [260.77, 58], // 经过 Tokenizer
    [262.89, 72], // 词表和切分规则
    [266.01, 88], // 拆分输入内容
    [268.81, 108], // 变成一个个 Token
    [279.71, 194], // 不同模型的 Tokenizer 可能不同
    [281.45, 236],
    [285.19, 284], // 切分和数量也可能不同
  ]),
  'encode-decode': sceneTiming(8, 299, [
    [298.41, 24], // 已经切成 Token
    [303.77, 43], // 每个 Token
    [304.5, 58],
    [306.53, 77], // 数字编号
    [308.85, 92], // Token ID
    [320.69, 145], // 进入模型计算之前
    [321.0, 160],
    [323.99, 170], // Encoding / 编码
    [330.37, 188], // 模型生成完以后
    [332.74, 218], // Token ID 转换回 Token
    [337.15, 242], // Decoding / 解码
    [352.45, 270], // 变成我们看到的回答
  ]),
  'tokenizer-merged': sceneTiming(9, 479, [
    [362.75, 12], // 没有固定答案
    [370.21, 70], // 打开真实 Tokenizer
    [372.66, 86], // 输入中文示例
    [391.67, 230], // 换一句日常聊天内容
    [394.86, 245], // 中英混合示例
    [400.21, 285], // 查看实际切分
    [402.01, 310], // 字符数和 Token 数没有固定换算
    [414.71, 370], // 100 万 Token
    [421.93, 440], // 不能直接画等号
  ]),
  'token-impact': sceneTiming(10, 299, [
    [424.3, 4], // 为什么要懂 Token
    [436.59, 34], // 第一个：处理多少内容
    [440.79, 52],
    [450.89, 74], // 128K / 1M Token
    [459.7, 106], // 第二点：输出长度
    [461.92, 124],
    [473.57, 146], // 输出 Token 上限
    [477.25, 176], // 第三点：使用成本
    [478.85, 194],
    [485.05, 216], // 每百万 Token 计费
  ]),
  'full-chain': sceneTiming(11, 359, [
    [504.23, 18], // 输入文字
    [504.6, 38],
    [505.3, 66], // Tokenizer
    [506.91, 96], // Token 和 Token ID
    [508.89, 128], // 交给大模型
    [509.1, 132],
    [511.34, 156], // 预测下一个 Token
    [513.0, 184], // 生成
    [513.56, 212], // 一个接一个持续生成
    [516.17, 244], // 解码
    [516.5, 252],
    [518.07, 292], // 变成人能看懂的文字
    [519.95, 324], // 完整回答
  ]),
} as const satisfies Readonly<Record<string, RevisedSceneTimingOverride>>;

for (const [sceneId, timing] of Object.entries(REVIEW_SCENE_TIMING_OVERRIDES)) {
  const anchors = timing.timingAnchors;
  if (!anchors) continue;
  for (let index = 1; index < anchors.length; index++) {
    const previous = anchors[index - 1];
    const current = anchors[index];
    if (
      current.frame <= previous.frame ||
      current.designFrame <= previous.designFrame
    ) {
      throw new Error(`Invalid review timing anchors in ${sceneId} at index ${index}`);
    }
  }
}
