# 独立版本边界

本目录对应 AgentCoursePreview。src/agent-full 对应另一个独立版本 AgentOpening-First3。

- 修改本版本，不得顺带修改 agent-full，反之亦然，除非用户明确要求两版同步。
- 本版本使用本目录自己的分镜、时间轴、转场、开场、音视频播放组件；禁止引入 agent-full 的组件或编辑配置。
- 共用原始视频、字体、背景等静态素材时视为只读。需要修改素材或共用基础样式时，先为当前版本复制独立文件并只更新当前版本引用。
- 不要将两个 Composition 注册到同一套课程可视化入口。

## 画面选择

- 优先级：既定案例录屏 > 有解释价值的信息可视化 > 真人讲述。
- 不为提高可视化占比做文字堆砌；个人观点、感受、提醒和过渡可在任意章节使用真人。
- 当前编排入口是 editorial-choices.json；原 plan.json 的版式独立保留，visual-node-cues.json 管理口播揭示。不要恢复旧 mixed-visual-cues.json 的全图解调度。
- 已认可的前 9.43 秒真人引入、人物情境和 intro-transition.json 的左下缩退转场需保留。
- SeeCut 依赖 agy / faster-whisper 已安装，agy 已登录，但服务返回当前账号所在地区不支持，仅参考编排原则的 Remotion 增强不得宣称通过其自动质检。
