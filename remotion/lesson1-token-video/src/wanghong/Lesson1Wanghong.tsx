import {loadFont} from '@remotion/fonts';
import {
  createElement,
  useEffect,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Series,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {wanghongSource, type WanghongNode, type WanghongScene} from './source';

export const WANGHONG_FPS = 30;
export const WANGHONG_TOTAL_FRAMES = wanghongSource.scenes.reduce(
  (sum, scene) => sum + Math.round(scene.duration * WANGHONG_FPS),
  0,
);
export type Lesson1WanghongProps = {
  texts: Record<string, string>;
  showAll: boolean;
};
export const WANGHONG_DEFAULT_PROPS: Lesson1WanghongProps = {
  texts: wanghongSource.texts,
  showAll: false,
};

let fontsReady: Promise<void[]> | undefined;
const ensureFonts = () => {
  fontsReady ??= Promise.all(
    [
      ['400', 'HanziPenSC-Regular.otf'],
      ['700', 'HanziPenSC-Bold.otf'],
    ].map(([weight, file]) =>
      loadFont({
        family: 'HanziPen SC',
        url: staticFile(`fonts/${file}`),
        weight,
        format: 'opentype',
      }),
    ),
  );
  return fontsReady;
};

const progress = (seconds: number, start: number, duration: number) =>
  interpolate(seconds, [start, start + duration], [0, 1], {
    easing: Easing.bezier(0.4, 0, 0.2, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

const attributeNames: Record<string, string> = {
  class: 'className',
  viewbox: 'viewBox',
  'font-size': 'fontSize',
  'text-anchor': 'textAnchor',
  'stroke-width': 'strokeWidth',
  'stroke-linecap': 'strokeLinecap',
  'stroke-linejoin': 'strokeLinejoin',
  'stroke-dasharray': 'strokeDasharray',
  'fill-rule': 'fillRule',
  basefrequency: 'baseFrequency',
  numoctaves: 'numOctaves',
  xchannelselector: 'xChannelSelector',
  ychannelselector: 'yChannelSelector',
};
const tagNames: Record<string, string> = {
  feturbulence: 'feTurbulence',
  fedisplacementmap: 'feDisplacementMap',
};

// Keep the original DOM and typography. Browser timers/CSS transitions are
// replaced with deterministic frame values, so seeking and replay are identical.
const renderNode = (
  node: WanghongNode,
  key: string,
  seconds: number,
  page: number,
  texts: Record<string, string>,
  showAll: boolean,
): ReactNode => {
  if (typeof node === 'string') return node;
  const attrs: Record<string, unknown> = {key};
  let style: CSSProperties = {};
  for (const [name, value] of Object.entries(node.attrs)) {
    if (name === 'style') {
      style = Object.fromEntries(
        (value ?? '')
          .split(';')
          .filter((part) => part.trim())
          .map((part) => {
            const [property, ...rest] = part.split(':');
            const trimmed = property.trim();
            return [
              trimmed.startsWith('--')
                ? trimmed
                : trimmed.replace(/-([a-z])/g, (_, letter: string) =>
                    letter.toUpperCase(),
                  ),
              rest.join(':').trim(),
            ];
          }),
      );
    } else if (name === 'id') {
      attrs.id = `wanghong-${page}-${value}`;
    } else {
      attrs[attributeNames[name] ?? name] = value?.replace(
        /url\(#([^)]*)\)/g,
        `url(#wanghong-${page}-$1)`,
      );
    }
  }
  if (node.step !== undefined) {
    const amount = showAll
      ? 1
      : progress(seconds, node.step * 1.3, node.step === 0 ? 0.52 : 0.45);
    style.opacity = amount;
    // Individual translate preserves the original hand-drawn rotations.
    style.translate = `0 ${(1 - amount) * 24}px`;
    style.visibility = amount === 0 ? 'hidden' : 'visible';
  }
  if (node.draw) {
    const {kind, at} = node.draw;
    const duration = kind === 'stroke' ? 1.3 : kind === 'clip' ? 0.7 : 0.55;
    const amount = showAll ? 1 : progress(seconds, at, duration);
    if (kind === 'stroke') {
      attrs.pathLength = 1;
      style.strokeDasharray = 1;
      style.strokeDashoffset = 1 - amount;
    } else if (kind === 'fill') {
      style.opacity = amount;
    } else {
      style.clipPath = `inset(0 ${(1 - amount) * 100}% 0 0)`;
    }
  }
  attrs.style = style;
  const content =
    node.textKey && Object.hasOwn(texts, node.textKey)
      ? [texts[node.textKey]]
      : node.children.map((child, index) =>
          renderNode(child, `${key}-${index}`, seconds, page, texts, showAll),
        );
  return createElement(tagNames[node.tag] ?? node.tag, attrs, ...content);
};

const WanghongPage = ({
  scene,
  page,
  texts,
  showAll,
}: {
  scene: WanghongScene;
  page: number;
} & Lesson1WanghongProps) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const seconds = frame / fps;
  // The original paper wipe is retained without using a CSS animation clock.
  const wipe =
    page < wanghongSource.scenes.length - 1 && !showAll
      ? progress(seconds, durationInFrames / fps - 0.33, 0.33)
      : 0;
  const opening = page > 0 && !showAll ? 1 - progress(seconds, 0, 0.33) : 0;
  return (
    <>
      {renderNode(scene.tree, `page-${page}`, seconds, page, texts, showAll)}
      <AbsoluteFill
        style={{
          background: 'var(--paper)',
          transform: `scaleX(${Math.max(wipe, opening)})`,
          transformOrigin: 'right center',
          pointerEvents: 'none',
          zIndex: 10,
        }}
      />
    </>
  );
};

export const Lesson1Wanghong = ({
  texts = wanghongSource.texts,
  showAll = false,
}: Lesson1WanghongProps) => {
  const {fps} = useVideoConfig();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let active = true;
    ensureFonts().then(() => {
      if (active) setReady(true);
    });
    return () => {
      active = false;
    };
  }, []);
  return (
    <AbsoluteFill className="lesson1-wanghong">
      <style>{wanghongSource.css}</style>
      {ready ? (
        <main className="deck">
          <Series>
            {wanghongSource.scenes.map((scene, page) => (
              <Series.Sequence
                key={scene.name}
                name={`${String(page + 1).padStart(2, '0')} · ${scene.name}`}
                durationInFrames={Math.round(scene.duration * fps)}
                premountFor={fps}
              >
                <WanghongPage
                  scene={scene}
                  page={page}
                  texts={texts}
                  showAll={showAll}
                />
              </Series.Sequence>
            ))}
          </Series>
        </main>
      ) : null}
    </AbsoluteFill>
  );
};
