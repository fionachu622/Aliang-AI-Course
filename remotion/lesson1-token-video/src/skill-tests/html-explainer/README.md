# Agent HTML Explainer · Remotion 迁移版

Studio: http://localhost:3000/Agent-HTMLExplainer-Chapters01-02

位置：Aliang-AI-Course / skill测试 / Agent-HTMLExplainer-Chapters01-02。

- 原版：`outputs/agent-html-explainer`，P005–P039。
- 35 场，1920×1080，30fps，14713 帧（约 8 分 10 秒）。
- React 创建真实 HTML/SVG 元素，动画轨道通过 `useCurrentFrame()` 与 `interpolate()` 计算；不嵌套 iframe、不依赖 GSAP 播放时钟、不嵌入样片视频。
- 配音由 Remotion Audio 驱动；字幕按同一全局时间轴显示；图片通过 Remotion Img 加载。
- `scenes/*.json` 保存各场独立的画面树、样式、动画轨道和字幕，可直接编辑。
- `AgentHtmlExplainer.tsx` 为帧驱动渲染器，`data.ts` 为顺序和时长。
- 素材在 `public/skill-tests/html-explainer`，包含原云希配音、34张高清录屏摘帧及SRT/VTT。

重建迁移数据：先 `node extract-tracks.cjs`，再 `python3 migrate.py`（需要 BeautifulSoup）。源HTML仅在迁移脚本中读取，运行时不执行源脚本。

验证：工程 TypeScript 检查通过；Studio 已检查第 2100 帧与第 14080 帧及反向跳转；Remotion CLI 第 14080 帧渲染成功。
