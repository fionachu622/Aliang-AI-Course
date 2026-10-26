import {createElement, type CSSProperties, type ReactNode} from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Series,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {showMeSource, type ShowMeNode, type ShowMeScene} from './source';

export const SHOW_ME_FPS = 30;
export const SHOW_ME_TOTAL_FRAMES = showMeSource.scenes.reduce(
  (total, scene) => total + Math.round(scene.duration * SHOW_ME_FPS),
  0,
);

export type Lesson1ShowMeProps = {texts: Record<string, string>};
export const SHOW_ME_DEFAULT_PROPS: Lesson1ShowMeProps = {
  texts: showMeSource.texts,
};

const fade = (frame: number, start: number, duration: number) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

const attributeNames: Record<string, string> = {
  class: 'className',
  viewbox: 'viewBox',
};

// Static HTML/SVG structure is reused, but every reveal is driven by the frame.
// No iframe, browser animation clock, localStorage or source-page controls run here.
const renderNode = (
  node: ShowMeNode,
  key: string,
  frame: number,
  fps: number,
  scene: ShowMeScene | null,
  sceneIndex: number,
  texts: Record<string, string>,
): ReactNode => {
  if (typeof node === 'string') return node;
  const attrs: Record<string, unknown> = {key};
  let style: CSSProperties = {};
  for (const [name, value] of Object.entries(node.attrs)) {
    if (name === 'style') {
      style = Object.fromEntries(
        (value ?? '')
          .split(';')
          .filter(Boolean)
          .map((entry) => {
            const [property, ...rest] = entry.split(':');
            return [
              property
                .trim()
                .replace(/-([a-z])/g, (_, letter: string) =>
                  letter.toUpperCase(),
                ),
              rest.join(':').trim(),
            ];
          }),
      );
    } else if (name === 'id') {
      attrs.id = `show-me-${value}`;
    } else if (name === 'href' && value?.startsWith('#')) {
      attrs.href = `#show-me-${value.slice(1)}`;
    } else {
      attrs[attributeNames[name] ?? name] = value;
    }
  }
  if (scene && node.attrs['data-beat'] != null) {
    const at = scene.beats[Number(node.attrs['data-beat'])].at;
    const amount = at === 0 ? 1 : fade(frame, at * fps, 0.65 * fps);
    style = {
      ...style,
      opacity: amount,
      transform: `translateY(${(1 - amount) * 22}px)`,
      visibility: amount > 0 ? 'visible' : 'hidden',
    };
  }
  if (node.tag === 'section') {
    attrs.className = `${node.attrs.class ?? ''} active`;
    attrs['aria-hidden'] = false;
    style.opacity = sceneIndex === 0 ? 1 : fade(frame, 0, 0.45 * fps);
  }
  attrs.style = style;
  const editKey = node.attrs['data-edit'];
  const children =
    editKey && Object.hasOwn(texts, editKey)
      ? [texts[editKey]]
      : node.children.map((child, index) =>
          renderNode(
            child,
            `${key}-${index}`,
            frame,
            fps,
            scene,
            sceneIndex,
            texts,
          ),
        );
  return createElement(node.tag, attrs, ...children);
};

const ShowMeScene = ({
  scene,
  index,
  texts,
}: {
  scene: ShowMeScene;
  index: number;
  texts: Record<string, string>;
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return renderNode(
    scene.tree,
    `scene-${index}`,
    frame,
    fps,
    scene,
    index,
    texts,
  );
};

export const Lesson1ShowMe = ({
  texts = showMeSource.texts,
}: Lesson1ShowMeProps) => {
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill className="lesson1-show-me">
      <style>{showMeSource.css}</style>
      <div className="stage">
        {renderNode(showMeSource.icons, 'icons', 0, fps, null, 0, texts)}
        <Series>
          {showMeSource.scenes.map((scene, index) => (
            <Series.Sequence
              key={scene.name}
              name={`${String(index + 1).padStart(2, '0')} · ${scene.name}`}
              durationInFrames={Math.round(scene.duration * fps)}
              premountFor={fps}
            >
              <ShowMeScene scene={scene} index={index} texts={texts} />
            </Series.Sequence>
          ))}
        </Series>
      </div>
    </AbsoluteFill>
  );
};
