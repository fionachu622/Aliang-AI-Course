# 第 1 课 · Remotion 重设计版

这不是把 PPT 页面逐张做转场，而是把整课重构成一条稳定的视觉路径：

`输入文字 → Tokenizer → Token / Token ID → 大模型 → 回答`

画面中的概念、流程节点和结论都按内容节拍逐步出现。所有时间点集中在 `src/Scenes.tsx` 的 `RevealAt at={秒数}` 中，修改内容或口播后可直接微调，不需要改动画底层。

## 运行

```bash
npm install
npm run start
```

## 导出

### 完整静音阅读版（约 5 分 09 秒）

当前用于审片的推荐版本不带语音，10 个章节都已完整保留：

```bash
npm run render:silent-review
```

输出 960×540 审片文件：`out/第1课-大模型与Token-完整静音审片版.mp4`

确认后导出 1920×1080 正式文件：

```bash
npm run render:silent
```

正式输出：`out/第1课-大模型与Token-完整静音版.mp4`

### 带口播版

```bash
npm run render
```

默认输出：`out/第1课-大模型与Token-Remotion版.mp4`

快速重导 60 秒审片版：

```bash
npm run preview60
```

## 结构

- `src/timeline.ts`：10 段音频、场景时长、总帧数。
- `src/silentTimeline.ts`：静音阅读版的 10 章时长与总帧数。
- `src/Lesson1Silent.tsx`：不加载任何音频的完整静音合成。
- `src/Scenes.tsx`：分镜与口播节拍。
- `src/components/VisualKit.tsx`：纸张背景、手写标题、标记笔、卡片、逐步出现等通用组件。
- `src/components/FlowMap.tsx`：贯穿全课的流程视觉锚点。
- `public/audio/`：10 段口播音频。

第 9 段使用 `o200k_base（GPT-4o）` 的真实切分结果，展示 Token 文本片段与 Token ID。切换模型或 Tokenizer 后，切分方式和 ID 可能不同。

## 使用自己的音色

已经准备好 2 分钟音色样本：

`public/voice-samples/voice-reference-2min.mp3`

1. 打开 `.env`，只在本机填写 `ELEVENLABS_API_KEY`。
2. 检查配置：

```bash
npm run voice:status
```

3. 确认录音属于你本人后，创建 ElevenLabs 即时克隆音色：

```bash
npm run voice:create
```

命令结束会返回 `voice_id`。把它写进 `.env` 的 `ELEVENLABS_VOICE_ID`。

4. 确认账户字符额度后，生成并启用 10 段口播：

```bash
npm run voice:generate
```

生成前会保留原来的系统音色到 `public/audio-system-tingting/`；你的音色会输出到 `public/audio-custom/` 并启用到 `public/audio/`。脚本会测量每段新音频的真实时长，更新 Remotion 总时长，并按比例调整所有 `RevealAt` 节拍。最后仍应在 Studio 中试听一次，人工微调个别句子的停顿位置。
