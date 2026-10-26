# Lesson1GeometricLight｜暗色精密示意图

## 主题与任务

- 主题：面向普通用户的 AI 基础课。
- 观众：第一次系统理解大模型、Token 与 Tokenizer 的学习者。
- 单一任务：让抽象关系像系统图一样被看懂，而不是像笔记一样被阅读。

## Token System

### Color

- Graphite `#24272A`：主背景
- Ivory `#F5F1E8`：主信息
- Signal Blue `#7CC8EA`：输入、路径、编码
- Model Green `#A4D486`：模型能力与正确结论
- Question Coral `#F18D9E`：疑问、反例与认知转折
- Data Yellow `#F0D26A`：数字、概率与关键单位

### Type

- Display / Chinese：`Songti SC`，中高字重；用编辑感缓和精密线框的工具感。
- Fallback：`STSong` / `SimSun`，保证中文宋体语气一致。
- Utility / English：`IBM Plex Mono`，仅用于 Token、ID、LLM 与编号。
- 不使用楷体、手写体或模拟粉笔字。

### Layout

```text
┌─ scene question ───────────────────────────────┐
│                                               │
│      OBJECT ───────── RELATION ───── RESULT    │
│                                               │
└───────────────────────────────────────────────┘
```

视觉中心继续位于画面中央；标题、对象、关系、结果按时间依次取得视觉优先级。

## Signature

“信号轨道”：所有框线使用精确单线和加强角标，所有关系线以小方点起笔、菱形端点收束。它既像模型的数据路径，也能贯穿 Token、编码和生成流程。

## Removed

- 抖动双描边
- 弯曲手绘箭头
- 双线手绘下划线
- 不规则荧光笔遮罩
- 随机旋转和手写字体
