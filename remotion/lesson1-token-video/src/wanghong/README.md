# Lesson1Wanghong

接入的是《大模型与 Token》**16 页版**，不是较新的 20 页版。

- Studio：<http://localhost:3000/Lesson1Wanghong>
- 目录：`Aliang-AI-Course / skill测试 / Lesson1Wanghong`
- 画布：1920 × 1080，30 fps，16 个有页名的时间轴片段。
- 保留原稿的文字、布局、HanziPen SC 字体、标记和 SVG 图示；没有重新设计或导出视频。

## 编辑

- `source.ts`：原网页的可编辑 DOM、CSS、文字、页名、备注及每页时长快照。
- `Lesson1Wanghong.tsx`：逐步出现、SVG 描边、荧光标记和翻页效果，全部由 Remotion 帧驱动。
- Composition 的 `texts` 参数可覆盖带有文字键的文本；`showAll: true` 可暂时显示当前页的全部内容以检查排版。
- 原 HTML 没有被移动或改写，仍在项目的 `output/第1课-大模型与Token-handwritten-ppt/`。

时间轴参考原网页自动模式：步骤间隔 1.3 秒，完成态停留 2.2 秒，翻页 0.33 秒。**这是预览节奏，不是与录音校准后的口播时间轴**，没有添加音频。每页时长会取整到帧。

需要从原稿重新导入时，在 Remotion 项目目录执行 `python3 scripts/import-wanghong.py`。该命令会覆盖 `source.ts` 的本地编辑，请先保留修改。

字体文件来自本机已安装的 HanziPen SC，用于本地预览；对外分发前须另行确认字体授权。
