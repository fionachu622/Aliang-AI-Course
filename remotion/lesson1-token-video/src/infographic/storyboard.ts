export const INFOGRAPHIC_FPS = 30;
export const INFOGRAPHIC_SCENE_FRAMES = 180;

export const INFOGRAPHIC_SCENES = [
  {id: 'familiar-ai', label: '熟悉的 AI', durationInFrames: INFOGRAPHIC_SCENE_FRAMES},
  {id: 'input-output', label: '中间发生了什么', durationInFrames: INFOGRAPHIC_SCENE_FRAMES},
  {id: 'product-model', label: '产品与大模型', durationInFrames: INFOGRAPHIC_SCENE_FRAMES},
] as const;

export const INFOGRAPHIC_TOTAL_FRAMES = INFOGRAPHIC_SCENES.reduce(
  (sum, scene) => sum + scene.durationInFrames,
  0,
);

