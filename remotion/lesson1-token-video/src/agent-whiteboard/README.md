# Agent 专题课整课页面

白板整课入口：http://localhost:3000/AgentCourse-WhiteboardVideo 。位于 Remotion 的 Aliang-AI-Course → skill测试 文件夹，仅注册这一个白板主入口，没有章节或分镜子合成。原 AgentCoursePreview 保持原课程内容。

运行 npm start 即同时启动 Remotion 和本机编辑服务。页面内使用“播放整课”连续预览，直接修改文字、位置、颜色、节拍，并保存到工程。

本目录 course.json 为当前内容源，public/agent-whiteboard 为编辑 HTML 和逐笔渲染器。内部编辑服务使用本机 3175 端口。视频渲染时自动使用同一份数据输出整课画面，不包含编辑控件。

原 src/agent-course 的内容保留在磁盘，原 AgentCoursePreview 已恢复使用原组件。已有演示录屏尚未导入白板时间轴。

使用的 skill：whiteboard-video（trustfuture/simon-skills）。

Remotion 内嵌预览已同步宿主当前帧，直接使用 Remotion 播放、暂停和拖动时间轴即可控制白板动画。网页独立打开时仍可使用内部播放按钮。
