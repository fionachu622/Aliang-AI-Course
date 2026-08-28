import {FPS} from '../timeline';

export type V2Shot = {
  id: string;
  chapter: string;
  durationSeconds: number;
  purpose: string;
};

export const V2_SHOTS: readonly V2Shot[] = [
  {id: 'hook', chapter: '开场', durationSeconds: 7, purpose: '建立输入与回答之间的未知过程'},
  {id: 'product', chapter: '产品与模型', durationSeconds: 11, purpose: '区分 AI 产品与大模型'},
  {id: 'llm', chapter: '什么是 LLM', durationSeconds: 10, purpose: '给出普通用户够用的工作定义'},
  {id: 'candidates', chapter: '预测下一个', durationSeconds: 13, purpose: '说明上下文对应多个候选'},
  {id: 'loop', chapter: '生成循环', durationSeconds: 12, purpose: '建立预测、生成、接回、再预测'},
  {id: 'stream', chapter: '逐步生成', durationSeconds: 10, purpose: '解释回答为什么一点点出现'},
  {id: 'token', chapter: 'Token', durationSeconds: 10, purpose: '建立 Token 的基本单位定义'},
  {id: 'not-equal', chapter: 'Token', durationSeconds: 10, purpose: '拆除一字一 Token 的误解'},
  {id: 'tokenizer', chapter: 'Tokenizer', durationSeconds: 11, purpose: '文字经 Tokenizer 变成 Token'},
  {id: 'different', chapter: 'Tokenizer', durationSeconds: 9, purpose: '不同 Tokenizer 可能有不同切法'},
  {id: 'token-id', chapter: 'Token ID', durationSeconds: 10, purpose: 'Token 对应数字编号'},
  {id: 'codec', chapter: '编码与解码', durationSeconds: 12, purpose: '建立人类文字与模型计算的双向转换'},
  {id: 'variable', chapter: '切分规则', durationSeconds: 10, purpose: '说明 Token 长度不固定'},
  {id: 'demo-cn', chapter: '真实切分', durationSeconds: 11, purpose: '用中文样例观察切分边界'},
  {id: 'demo-mixed', chapter: '真实切分', durationSeconds: 12, purpose: '用混合文本观察不同字符类型'},
  {id: 'million', chapter: '避免误读', durationSeconds: 10, purpose: '100 万 Token 不等于 100 万汉字'},
  {id: 'capacity', chapter: '实际影响', durationSeconds: 9, purpose: 'Token 影响一次可处理内容'},
  {id: 'output', chapter: '实际影响', durationSeconds: 9, purpose: 'Token 影响一次可生成内容'},
  {id: 'cost', chapter: '实际影响', durationSeconds: 10, purpose: 'Token 是常见计费单位'},
  {id: 'summary', chapter: '总结', durationSeconds: 12, purpose: '复现完整链路并引出 Context'},
] as const;

export const V2_TOTAL_FRAMES = V2_SHOTS.reduce(
  (total, shot) => total + Math.ceil(shot.durationSeconds * FPS),
  0,
);

