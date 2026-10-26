# Huashu Art Motion · 白板手绘

正式入口：Remotion Studio → skill测试 → `HuashuArtMotionWhiteboard`。

- 组件：`AgentHuashuWhiteboard.tsx`
- 参数：1920 × 1080，30 fps，1290 帧（43 秒）
- 已确认来源：仓库根目录 `outputs/agent-whiteboard/index.html`，源绘制文件为该目录下 `代码工程/scenes/whiteboard.js`。
- `runtime.js` 保留原版 util / paint / kit / motion / camera / diagram 与白板绘制实现；仅将 window 注册改为实例内 scope，避免与其他 composition 冲突。
- 时间仅由 `useCurrentFrame() / fps` 驱动，支持暂停、跳帧和离线渲染。字体加载完成并绘制后才释放渲染等待。
- 字体位于 `public/skill-tests/huashu-art-motion/`，随附原字体许可记录。
- 保留原稿的估计口播时序；原版未带配音，本次没有新增音轨。

验收见 `production-review.md`。本次不导出视频。
