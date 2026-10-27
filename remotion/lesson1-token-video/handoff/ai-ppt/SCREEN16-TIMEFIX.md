# 录屏 16 时间修复交接

- 修改版把录屏中的凌晨时间改成对应的上午 10 点多，保留分钟数、原时长（271.2 秒）、30 fps 和原音轨。原录屏及此前代理保留。
- 已新增 720P 预览代理 `screen-16-v4.mp4`，位于项目既有的素材 Release：
  https://github.com/fionachu622/Aliang-AI-Course/releases/tag/ai-ppt-materials-2026-10-27
- 下载该素材到 `remotion/lesson1-token-video/public/ai-ppt/screen-16-v4.mp4`，课程及 `AIPpt-Screen16-Review` 使用该文件。课程里的录屏仍保持静音；单独预览入口保留原声。
- 本机另有相同时长和帧率的 2596×1440 修改版文件，以相同文件名放在 `public/ai-ppt/`；交接用代理只用于预览。不要用原来的 `screen-16.mp4` 覆盖修改版。
- 已针对此前 03:02–03:08、03:28–03:33 的错位和漏改重新跟踪并抽帧检查；修复片段按每秒 6 帧做过文字识别，未识别到凌晨时间。抽帧检查不能排除所有瞬间闪动。
- 当前课程时间线使用录屏 16 的其他片段，若要查看改过时间的画面，请在 Studio 中打开 `AIPpt-Screen16-Review`。
