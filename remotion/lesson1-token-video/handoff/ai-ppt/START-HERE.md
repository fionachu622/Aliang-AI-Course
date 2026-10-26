# 给 Claude 的交接：用 AI 做 PPT 课程

## 当前真实状态
用户认为当前视觉效果太丑，要求交给 Claude 继续剪辑。当前版本是待重做的审片草稿，不是已批准成品。55个审片单元，共18035帧/30fps，10:01.17，1920×1080。未导出最终MP4。

现有Remotion工程：`remotion/lesson1-token-video`。入口 `src/Root.tsx` → `AI生成PPT` → `AIPptCourse`。逐段入口 `AIPpt-s01`～`AIPpt-s55`。不要新建工程，不改其他课程。

## 优先级与已确认决定
1. 先完整读 `original-editing-instructions.md`，但以下用户后续决定覆盖冲突项。
2. 最终依据是单条 `02 2k-口播.mp4` 的实际口播。它包含原定45段相关内容，也有guizang教程、复录和旧稿差异。用户已明确采用实际录音，不再强行按原说明45段逐字对齐。
3. 完整教学内容优先，允许超过9分钟。已剔除部分复录和长停顿；详见时间线，不自行删改教学内容。
4. 文件15可以用于原说明28、29、31、32段，并非只限开头；04-1、04-2、05、16均已补齐。
5. 录屏原声一律不用，全部静音；不加音乐。字幕依据真实口播，不照抄屏幕文字。
6. 开头用户要求真人出镜、左右展示两版实际效果，不能只在黑板放静态图。现版是真人全屏开口后缩小窗，两边播放；此实现没有得到用户认可，不能当作视觉定稿。
7. 无真人且无演示录屏时，用户指定 `Lesson1ChalkboardV3` 的风格。该ID实际挂载v21→v14→VisualV9，而不是名称相近的v19。炭灰黑板纹理、粉笔手写、白线框、少量蓝黄粉强调。参考截图 `style-reference.png`，准确组件注册见Root。用户后来否定整体效果，仍应遵守这项风格方向并重新做好设计。
8. 等待生成的过程剪掉/加速；3–5秒应有一次有意义的画面变化，单画面不超过20秒；无口播画面单次不超过5秒，总计不超过30秒。
9. Skill工作手册动画、输入框安装卡、五步亮起总结要做到成片标准，不能占位。安装卡依据实际口播为guizang-ppt-skill。
10. 有实质不确定的问题先列出来问用户；用户检查Studio，确认后才能最终渲染。

## 重点文件
- `src/ai-ppt/timeline.ts`：正式口播剪切与录屏选点，单位见文件类型定义。
- `src/ai-ppt/AIPptCourse.tsx`：媒体、字幕、真人、分屏和各段组装。
- `src/ai-ppt/Animations.tsx`：工作手册、五步总结、安装卡、设计页背景。
- `src/ai-ppt/captions.json`：原口播时间戳字幕。ASR纠错版本，尚未全片逐字听校，不保证所有专名准确。
- `actual-narration-transcript.md` / `transcript.json`：原语音识别内容及词级时间戳，可能有同音错字。
- `actual-edit-scenes.json` / `review-guide.md`：55段审片索引。
- `screen-source-audit.md` / `production-review.md`：历史制作过程，早期“待授权/缺素材”已被后续用户决定覆盖。
- `sheet-*` / `dense-*`：录屏时间轴抽帧证据。抽帧不代表完整播放审看。
- `v3-*.png` / `opening-revised-150.png`：被用户否定的当前设计，只用于了解问题，不能作为满意标准。
- `assets.json`：720P代理视频及原始图片/PPT压缩包，含SHA256、原始文件名与Release文件名映射。
- `build-course.py` 是历史生成器，依赖原先work目录，不要未经适配直接运行覆盖最新timeline；正式修改以src/ai-ppt为准。

## 普通 Claude 聊天 / Project 接入方式
用户明确选择普通聊天/Project的GitHub连接。先选本目录的文本文件及src/ai-ppt，再按需选参考组件；不要一次导入所有历史课程占满上下文。GitHub连接提供代码上下文，不能假定它可下载、观看Release视频或运行Remotion。需要看画面时，明确告诉用户要上传哪张抽帧/哪段原视频；不要凭ASR臆造画面。输出具体代码修改/完整替换文件，用户可放回本地工程预览。不要声称已提交或已渲染，除非实际执行且核验。

## 在可执行环境还原
需要Node、npm、Python3、ffmpeg及已获授权的GitHub CLI。私有素材需使用拥有此仓库读取权限的登录。不要把token写入代码。

```bash
cd remotion/lesson1-token-video
npm ci
python3 handoff/ai-ppt/restore-assets.py
npx remotion studio src/index.ts --no-open
```

恢复脚本下载720P代理并验证SHA256，按相同文件名构造public/ai-ppt引用。录屏代理无音轨，口播代理保留真实口播。原始PPT与图片解压在handoff/ai-ppt/originals。2K原视频仍保留在用户本地，不要求传入Claude。

完整src和依赖清单用于保留原工程注册与设计参考。此次未复制其他课程的大型视频素材；旧课程部分组合可能缺媒体，这不意味着可删除旧课程。当前AI生成PPT所需素材可以完整恢复。

## 720P 代理剪辑规则（用户最新决定）

GitHub提供720P代理，本地Codex工程保留2K原视频。代理与原片必须保持相同帧数、帧率、时间起点及内容；仅降低空间分辨率。所有素材文件名与staticFile路径相同。screen-opening-*为已有开头衍生片段，其时间线规则与本地对应文件完全一致。

Claude只修改代码、字幕和timeline，不改代理播放速度来掩盖同步问题、不重新裁切视频文件。位置、圈注、裁切使用1920×1080合成坐标或归一化比例，不能依赖视频720像素的原生尺寸。

带回本地时仅同步`src/ai-ppt`等明确修改的代码/时间线，不覆盖本地`public/ai-ppt`。这样本地预览直接使用2K原视频，用户验收后再渲染。若以后换源，验证文件名、帧率、帧数、首尾画面及音画同步。不要对低清代理做最终成片导出。
