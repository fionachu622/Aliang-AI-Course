import React from 'react';
import {AbsoluteFill, Freeze, OffthreadVideo, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {Scene, FPS, frameToSource, sourceToFrame} from './timeline';
import {Arrow, C, Card, ChalkRect, FONT, Frame, KeyCard, MarkBox, Stage, Tag, ease, easeInOut, lerp, pop, textW} from './design';

const screen = (id: string) => staticFile(`ai-ppt/screen-${id === '16' ? '16-v4' : id}.mp4`);

/** A recording cropped to a normalized region [x, y, w, h]. */
export const CropVideo: React.FC<{file: string; start: number; crop?: number[]; still?: boolean; rate?: number}> = ({file, start, crop = [0, 0, 1, 1], still = false, rate = 1}) => {
  const [x, y, w, h] = crop;
  const v = <OffthreadVideo pauseWhenBuffering src={screen(file)} startFrom={Math.round(start * FPS)} muted volume={0} playbackRate={rate} style={{position: 'absolute', width: `${100 / w}%`, height: `${100 / h}%`, left: `${(-x / w) * 100}%`, top: `${(-y / h) * 100}%`, objectFit: 'fill'}} />;
  return <AbsoluteFill style={{overflow: 'hidden', background: '#000'}}>{still ? <Freeze frame={0}>{v}</Freeze> : v}</AbsoluteFill>;
};

// ---------------- Opening: presenter full screen, two frosted-glass "phones" browsing both decks ----------------
// The frame being talked about is highlighted and turns its pages; the other one waits.
type FeedPage = {file: string; start: number; crop?: number[]; live?: boolean; frames: number; poster?: number};
// One-sentence deck: static pages.
const LEFT_PAGES: FeedPage[] = [22, 9.5, 8, 11, 14].map((s) => ({file: '02', start: s, crop: [0.585, 0.35, 0.4, 0.435], frames: 33}));
// Finished deck: the pages whose animation sells the difference (recording 15, source seconds).
const RIGHT_PAGES: FeedPage[] = [
  {file: '15', start: 22.45, live: true, frames: 34, poster: 24.5}, // cover: product pulls back from close-up
  {file: '15', start: 63.25, live: true, frames: 40}, // three stacked boxes slide apart
  {file: '15', start: 69.7, live: true, frames: 60}, // original price struck out, new price lands
];
const FLIP = 14;

/**
 * Stack of slides; only the top one is "open". At each page turn the top slide flips up
 * and away like a page, and the rest move up. Runs only between runFrom and runTo.
 */
const SlideFeed: React.FC<{pages: FeedPage[]; width: number; runFrom: number; runTo: number}> = ({pages, width, runFrom, runTo}) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, Math.min(frame, runTo) - runFrom);
  const running = frame >= runFrom && frame < runTo;
  const h = Math.round((width * 9) / 16), gap = 18;
  const starts = pages.reduce<number[]>((acc, p, i) => [...acc, i === 0 ? 0 : acc[i - 1] + pages[i - 1].frames], []);
  let k = 0;
  while (k + 1 < pages.length && f >= starts[k + 1]) k++;
  const turn = k === 0 ? 1 : easeInOut(f - starts[k], 0, FLIP);
  return (
    <div style={{position: 'absolute', inset: 0, perspective: 1100}}>
      {pages.map((p, i) => {
        const slot = i - k + (1 - turn); // 0 = top
        if (i < k - 1 || slot > 3) return null;
        const leaving = i === k - 1;
        const top = slot * (h + gap);
        const focus = i === k;
        return (
          <div key={i} style={{position: 'absolute', left: 0, top: leaving ? 0 : top, width, height: h, borderRadius: 16, overflow: 'hidden', boxShadow: '0 10px 26px rgba(0,0,0,.25)', transformOrigin: '50% 0%',
            transform: leaving ? `rotateX(${turn * 100}deg) translateY(${-turn * 30}px)` : `scale(${focus ? 1 : 0.95})`,
            opacity: leaving ? 1 - ease(turn, 0.5, 1) : focus ? 1 : 0.7, zIndex: leaving ? 5 : 4 - Math.round(slot)}}>
            {p.live && focus && running ? (
              <Sequence from={runFrom + starts[i]} premountFor={20}><CropVideo file={p.file} start={p.start} crop={p.crop} /></Sequence>
            ) : (
              <CropVideo file={p.file} start={p.live && focus && frame >= runTo ? p.start + Math.min(p.frames, f - starts[i]) / FPS : p.poster ?? p.start} crop={p.crop} still />
            )}
          </div>
        );
      })}
    </div>
  );
};

const GlassPhone: React.FC<{x: number; enter: number; state: 'active' | 'waiting' | 'done'; tone: 'grey' | 'blue'; pages: FeedPage[]; runFrom: number; runTo: number; switchAt: number}> = ({x, enter, state, tone, pages, runFrom, runTo, switchAt}) => {
  const f = useCurrentFrame();
  const w = 470, h = 860, pad = 24;
  // Emphasis is size only: the frame being talked about grows, the other one stays smaller.
  const on = state === 'active' ? ease(f, switchAt, switchAt + 12) : state === 'done' ? 1 - ease(f, switchAt, switchAt + 12) : 0;
  return (
    <div style={{position: 'absolute', left: x, top: 110, width: w, height: h, opacity: Math.min(1, enter * 1.4), transform: `translateY(${(1 - enter) * 120}px) scale(${0.94 + 0.12 * on})`, transformOrigin: '50% 50%'}}>
      <div style={{position: 'absolute', inset: 0, borderRadius: 52, background: 'linear-gradient(160deg, rgba(255,255,255,.34), rgba(255,255,255,.12))', backdropFilter: 'blur(28px) saturate(1.6)', WebkitBackdropFilter: 'blur(28px) saturate(1.6)', border: '1.5px solid rgba(255,255,255,.6)', boxShadow: '0 30px 80px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.7)'}} />
      <div style={{position: 'absolute', left: w / 2 - 60, top: 16, width: 120, height: 10, borderRadius: 5, background: 'rgba(255,255,255,.7)'}} />
      <div style={{position: 'absolute', left: pad, top: 44, width: w - pad * 2, bottom: pad, borderRadius: 26, overflow: 'hidden'}}>
        <SlideFeed pages={pages} width={w - pad * 2} runFrom={runFrom} runTo={runTo} />
      </div>
    </div>
  );
};

export const Opening: React.FC<{scene: Scene}> = ({scene}) => {
  const f = useCurrentFrame();
  const t = frameToSource(scene, f);
  const at = (s: number) => sourceToFrame(scene, s);
  const reveal = at(63.1);
  const leftTalk = at(63.3); // 很多人用 AI 做的 PPT 是这个样子的
  const sameData = at(66.56); // 但是同一份的资料
  const rightTalk = at(67.64); // 换一个方法已经能做成这样子了
  const leftEnter = pop(f, reveal, reveal + 20);
  const rightEnter = pop(f, reveal + 6, reveal + 26);
  const dim = ease(f, reveal, reveal + 14);
  const leftState = t < 66.56 ? 'active' : 'done';
  const rightState = t >= 67.64 ? 'active' : 'waiting';
  return (
    <AbsoluteFill style={{background: C.dark}}>
      <OffthreadVideo pauseWhenBuffering src={staticFile('ai-ppt/presenter-opening.mp4')} muted volume={0} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      <AbsoluteFill style={{background: `rgba(10,12,16,${0.18 * dim})`}} />
      <GlassPhone x={110} enter={leftEnter} state={leftState} tone="grey" pages={LEFT_PAGES} runFrom={leftTalk} runTo={sameData} switchAt={leftState === 'active' ? leftTalk : sameData} />
      <GlassPhone x={1340} enter={rightEnter} state={rightState} tone="blue" pages={RIGHT_PAGES} runFrom={sameData} runTo={scene.durationInFrames} switchAt={rightTalk} />
    </AbsoluteFill>
  );
};


// ---------------- Shared helpers for the board scenes ----------------
// Organisation follows the reference explainer: one idea per board, parts drawn on in the
// order they are spoken, relations shown by position and arrows, the other side steps back.
type Beat = {at: number; start: number; len: number};
/** Plays short pieces of a recording on spoken cues; between cues it holds the last frame. */
const ClipTrack: React.FC<{scene: Scene; file: string; crop?: number[]; beats: Beat[]; poster: number}> = ({scene, file, crop, beats, poster}) => {
  const froms = beats.map((b) => sourceToFrame(scene, b.at));
  return (
    <AbsoluteFill>
      <CropVideo file={file} start={poster} crop={crop} still />
      {beats.map((b, i) => {
        const from = froms[i];
        const until = i + 1 < beats.length ? froms[i + 1] : scene.durationInFrames;
        return (
          <Sequence key={i} from={from} durationInFrames={Math.max(1, until - from)} premountFor={30}>
            <PlayThenHold file={file} crop={crop} start={b.start} len={Math.round(b.len * FPS)} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
const PlayThenHold: React.FC<{file: string; crop?: number[]; start: number; len: number}> = ({file, crop, start, len}) => {
  const f = useCurrentFrame();
  if (f < len) return <CropVideo file={file} start={start} crop={crop} />;
  return <CropVideo file={file} start={start + (len - 1) / FPS} crop={crop} still />;
};

/** Chalk stroke path that draws itself. */
const Stroke: React.FC<{d: string; progress: number; color?: string; width?: number}> = ({d, progress, color = C.ink, width = 3.4}) => (
  <path d={d} stroke={color} strokeWidth={width} fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - progress} />
);

/** Chalk line drawing of a person. */
const PersonIcon: React.FC<{size: number; progress?: number; color?: string}> = ({size, progress = 1, color = C.blue}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{overflow: 'visible'}}>
    <Stroke d="M50 14 C61 14 68 22 68 32 C68 43 60 50 50 50 C39 50 32 43 32 32 C32 21 40 14 51 15" progress={ease(progress, 0, 0.6)} color={color} />
    <Stroke d="M16 94 C17 70 31 58 50 58 C69 58 83 70 84 94" progress={ease(progress, 0.4, 1)} color={color} />
  </svg>
);
/** Chalk AI mark: a framed four-point spark. */
const AiIcon: React.FC<{size: number; progress?: number; color?: string}> = ({size, progress = 1, color = C.pink}) => (
  <div style={{position: 'relative', width: size, height: size}}>
    <ChalkRect w={size} h={size} k="ai-icon" color={color} progress={progress} />
    <svg width={size} height={size} viewBox="-50 -50 100 100" style={{position: 'absolute', inset: 0}}>
      <Stroke d="M0 -30 C4 -7 7 -4 30 0 C7 4 4 7 0 30 C-4 7 -7 4 -30 0 C-7 -4 -4 -7 0 -30Z" progress={ease(progress, 0.3, 1)} color={color} width={4} />
    </svg>
  </div>
);
/** Chalk tick in a chalk circle. */
const Tick: React.FC<{progress: number; size?: number}> = ({progress, size = 40}) => (
  <svg width={size} height={size} viewBox="0 0 40 40" style={{overflow: 'visible', flex: 'none'}}>
    <circle cx="20" cy="20" r="16" stroke={C.muted} strokeWidth={2.6} fill="none" />
    <Stroke d="M10 21 L17 28 L31 11" progress={progress} color={C.green} width={4.5} />
  </svg>
);

// ---------------- Two-version comparison (s44, s52) ----------------
const PANE = {w: 860, h: 484, y: 320, lx: 70, rx: 990};
const ONE_LINE_CROP = [0.585, 0.35, 0.4, 0.435]; // the slide inside recording 02
const PHOTO = [0.62, 0.11, 0.33, 0.72]; // phone photo on that slide, relative to the pane

const Pane: React.FC<{x: number; enter: number; focus: number; dim: number; tag: string; tagColor: string; k: string; children: React.ReactNode}> = ({x, enter, focus, dim, tag, tagColor, k, children}) => (
  <div style={{position: 'absolute', left: x, top: PANE.y, width: PANE.w, height: PANE.h, transform: `scale(${1 + 0.03 * focus - 0.02 * dim})`, transformOrigin: '50% 50%'}}>
    <div style={{position: 'absolute', left: 0, right: 0, top: -92, textAlign: 'center', fontSize: 50, color: tagColor, opacity: ease(enter, 0.3, 1) * (1 - 0.55 * dim)}}>{tag}</div>
    <Card k={k} color={tagColor} progress={enter} style={{left: 0, top: 0, width: PANE.w, height: PANE.h}}>
      <div style={{position: 'absolute', inset: 0, opacity: ease(enter, 0.4, 1)}}>{children}</div>
      <div style={{position: 'absolute', inset: 0, background: `rgba(22,24,26,${0.62 * dim})`}} />
    </Card>
  </div>
);

export const Compare: React.FC<{scene: Scene; mode: string}> = ({scene, mode}) => {
  const f = useCurrentFrame();
  const t = frameToSource(scene, f);
  const power = mode === 'compare-power';
  // Spoken cues (source seconds).
  const cue = power
    ? {leftIn: 714.3, rightIn: 715.63, left: 717.47, mark: 718.27, right: 723.33, both: 734.65}
    : {leftIn: 638.9, rightIn: 641.65, left: 644.07, mark: 644.07, right: 646.63, both: 652.41};
  const leftOn = t >= cue.left && t < cue.right;
  const rightOn = t >= cue.right && t < cue.both;
  const leftFocus = leftOn ? ease(t, cue.left, cue.left + 0.4) : 0;
  const rightFocus = rightOn ? ease(t, cue.right, cue.right + 0.4) : 0;
  const leftDim = rightOn ? ease(t, cue.right, cue.right + 0.4) : 0;
  const rightDim = leftOn ? ease(t, cue.left, cue.left + 0.4) : 0;
  const mark = t >= cue.mark && t < cue.right ? ease(t, cue.mark + 0.1, cue.mark + 0.7) : 0;
  const beats: Beat[] = power
    ? [{at: 723.33, start: 15.0, len: 4.0}, {at: 726.37, start: 43.0, len: 1.9}, {at: 728.29, start: 35.0, len: 3.6}, {at: 731.9, start: 47.0, len: 2.6}]
    : [{at: 646.63, start: 22.45, len: 1.15}, {at: 649.05, start: 63.25, len: 1.35}, {at: 650.55, start: 69.7, len: 2.0}];
  return (
    <Stage>
      <Pane k="cmp-left" x={PANE.lx} enter={ease(t, cue.leftIn, cue.leftIn + 0.7)} focus={leftFocus} dim={leftDim} tag="① 一句话" tagColor={C.pink}>
        <CropVideo file="02" start={25} crop={ONE_LINE_CROP} still />
        <MarkBox x={PHOTO[0] * PANE.w} y={PHOTO[1] * PANE.h} w={PHOTO[2] * PANE.w} h={PHOTO[3] * PANE.h} progress={mark} stroke={5} />
      </Pane>
      <Pane k="cmp-right" x={PANE.rx} enter={ease(t, cue.rightIn, cue.rightIn + 0.7)} focus={rightFocus} dim={rightDim} tag={power ? '② 一句话 + Skill' : '② 一步步提要求'} tagColor={C.green}>
        <ClipTrack scene={scene} file={power ? '17' : '15'} beats={beats} poster={power ? 19 : 24.5} />
      </Pane>
    </Stage>
  );
};

// ---------------- Skill = a work handbook (s16) ----------------
export const Handbook: React.FC<{scene: Scene}> = ({scene}) => {
  const t = frameToSource(scene, useCurrentFrame());
  const P = {x: 600, y: 140, w: 1210, h: 720};
  const keyIn = ease(t, 260.9, 261.6);
  const dock = easeInOut(t, 262.66, 263.3); // "Skill" moves onto the handbook as its title
  const panel = ease(t, 262.75, 263.6);
  const who = ease(t, 262.9, 263.8);
  const row = (a: number, i: number) => ease(t, a + i * 0.25, a + i * 0.25 + 0.4);
  const ring = t >= 267.32 ? ease(t, 267.32, 268.2) : 0; // "都写在里面"
  const tpl = (i: number) => ease(t, 268.7 + i * 0.22, 269.3 + i * 0.22);
  const toAi = easeInOut(t, 270.24, 270.8);
  const read = ease(t, 272.4, 273.0);
  const tick = (i: number) => ease(t, 273.98 + i * 0.16, 274.35 + i * 0.16);
  const kx = lerp(dock, 960, P.x + 36), ky = lerp(dock, 470, P.y + 22), ks = lerp(dock, 1.3, 0.62);
  // Each part has its own colour, as in the token lesson: the handbook (Skill) green,
  // "how to do it" yellow, "to what standard" blue, the reader blue, the AI pink.
  const col = (x: number, title: string, color: string, items: string[], at: number, base: number) => {
    const box = ease(t, at - 0.1, at + 0.5);
    return (
      <div style={{position: 'absolute', left: x, top: P.y + 140, width: 520, height: 330}}>
        <ChalkRect w={520} h={330} k={`col-${title}`} color={color} progress={box} />
        <div style={{position: 'absolute', left: 0, right: 0, top: 26, textAlign: 'center', fontSize: 46, color, opacity: ease(box, 0.3, 1)}}>{title}</div>
        <div style={{position: 'absolute', left: 44, top: 100}}>
          {items.map((s, i) => (
            <div key={s} style={{display: 'flex', alignItems: 'center', gap: 18, marginTop: i ? 22 : 0, fontSize: 40, opacity: row(at + 0.3, i), transform: `translateX(${(1 - row(at + 0.3, i)) * -14}px)`}}>
              <Tick progress={tick(base + i)} />
              {s}
            </div>
          ))}
        </div>
      </div>
    );
  };
  return (
    <Stage>
      <Frame k="handbook" color={C.green} x={P.x} y={P.y} w={P.w} h={P.h} progress={panel} fill="none" />
      {ring > 0 && <ChalkRect w={P.w + 40} h={P.h + 40} k="handbook-ring" color={C.green} progress={ring} width={2.6} style={{left: P.x - 20, top: P.y - 20, opacity: 0.8 * (1 - ease(t, 268.6, 269.2))}} />}
      {panel > 0 && col(P.x + 50, '活儿怎么干', C.yellow, ['先定大纲', '再套模板、调版式', '最后加动画'], 265.02, 0)}
      {panel > 0 && col(P.x + 630, '按什么要求干', C.blue, ['数字以资料为准', '图要大，字要少', '重点用动画演出来'], 266.26, 3)}
      {/* templates that come with it */}
      {[0, 1, 2].map((i) => (
        <div key={i} style={{position: 'absolute', left: P.x + 50 + i * 200, top: P.y + P.h - 165, width: 176, height: 110}}>
          <ChalkRect w={176} h={110} k={`tpl-${i}`} color={C.coral} progress={tpl(i)} width={3} />
          <svg width={176} height={110} style={{position: 'absolute', inset: 0}}>
            <Stroke d="M26 34 H90" progress={ease(tpl(i), 0.5, 1)} color={C.coral} width={4} />
            <Stroke d="M26 60 H148 M26 80 H122" progress={ease(tpl(i), 0.6, 1)} color={C.muted} width={3} />
          </svg>
        </div>
      ))}
      <div style={{position: 'absolute', left: P.x + 660, top: P.y + P.h - 132, fontSize: 44, color: C.coral, opacity: tpl(2)}}>模板</div>
      {/* key word first on its own, then it becomes the handbook's title */}
      <div style={{position: 'absolute', left: kx, top: ky, transform: `translate(${-50 * (1 - dock)}%, ${-50 * (1 - dock)}%) scale(${ks})`, transformOrigin: '0 0'}}>
        <KeyCard text="Skill" size={96} progress={keyIn} />
      </div>
      <div style={{position: 'absolute', left: P.x + 300, top: P.y + 44, fontSize: 48, color: C.green, opacity: dock}}>工作手册</div>
      {/* who reads it: a new colleague, then the AI */}
      <div style={{position: 'absolute', left: 230, top: 330, width: 240, textAlign: 'center'}}>
        <div style={{position: 'relative', width: 180, height: 180, margin: '0 auto'}}>
          <div style={{position: 'absolute', inset: 0, opacity: 1 - toAi}}><PersonIcon size={180} progress={who} /></div>
          {toAi > 0 && <div style={{position: 'absolute', inset: 0}}><AiIcon size={180} progress={toAi} /></div>}
        </div>
        <div style={{marginTop: 22, fontSize: 48, opacity: who, color: toAi > 0.5 ? C.pink : C.blue}}>{toAi > 0.5 ? 'AI' : '新同事'}</div>
      </div>
      <Arrow x1={482} y1={420} x2={P.x - 28} y2={420} progress={read} color={toAi > 0.5 ? C.pink : C.blue} />
    </Stage>
  );
};

// ---------------- Five steps (s06 intro, s53 recap) ----------------
const STEP_NAMES = ['定大纲', '套模板', '调版式', '加动画', '做 Skill'];
const STEP_DESC = ['先把内容理清楚', '把风格统一起来', '提升设计感', '把重点突出出来', '把要求存下来'];
const NODE = {w: 270, h: 160, gap: 90, y: 400};
const nodeX = (i: number) => (1920 - (NODE.w * 5 + NODE.gap * 4)) / 2 + i * (NODE.w + NODE.gap);

const StepsFlow: React.FC<{t: number; ghostAt: number; triggers: number[]; descs?: boolean; loopAt?: number}> = ({t, ghostAt, triggers, descs, loopAt}) => {
  const cur = triggers.filter((x) => t >= x).length - 1;
  const loop = loopAt != null ? easeInOut(t, loopAt, loopAt + 0.9) : 0;
  const L = {x1: nodeX(4) + NODE.w / 2, x2: nodeX(0) + NODE.w / 2, top: NODE.y - 96};
  return (
    <Stage>
      {STEP_NAMES.map((n, i) => {
        const ghost = ease(t, ghostAt + i * 0.12, ghostAt + i * 0.12 + 0.5);
        const lit = ease(t, triggers[i], triggers[i] + 0.4);
        const isCur = i === cur && loop === 0;
        const x = nodeX(i);
        return (
          <React.Fragment key={n}>
            <div style={{position: 'absolute', left: x, top: NODE.y, width: NODE.w, height: NODE.h, opacity: 0.45 + 0.55 * lit, transform: `scale(${1 + 0.08 * (isCur ? lit : 0)})`}}>
              <ChalkRect w={NODE.w} h={NODE.h} k={`node-${i}`} color={lit > 0.01 ? STEP_COLORS[i] : C.muted} progress={ghost} />
              <div style={{position: 'absolute', left: 0, right: 0, top: 22, textAlign: 'center', fontSize: 30, color: lit > 0.01 ? STEP_COLORS[i] : C.muted, opacity: ghost}}>{'①②③④⑤'[i]}</div>
              <div style={{position: 'absolute', left: 0, right: 0, top: 66, textAlign: 'center', fontSize: 54, color: lit > 0.01 ? STEP_COLORS[i] : C.muted, opacity: ghost}}>{n}</div>
            </div>
            {i < 4 && <Arrow x1={x + NODE.w + 14} y1={NODE.y + NODE.h / 2} x2={x + NODE.w + NODE.gap - 12} y2={NODE.y + NODE.h / 2} progress={ease(t, triggers[i + 1] - 0.2, triggers[i + 1] + 0.25)} />}
            {descs && <div style={{position: 'absolute', left: x - 30, width: NODE.w + 60, top: NODE.y + NODE.h + 36, textAlign: 'center', fontSize: 40, color: C.ink, opacity: ease(t, triggers[i] + 0.9, triggers[i] + 1.4)}}>{STEP_DESC[i]}</div>}
          </React.Fragment>
        );
      })}
      {loop > 0 && (
        <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1} height={1}>
          <Stroke d={`M${L.x1} ${NODE.y - 18} C${L.x1} ${L.top} ${L.x1 - 40} ${L.top} ${L.x1 - 90} ${L.top} L${L.x2 + 90} ${L.top} C${L.x2 + 40} ${L.top} ${L.x2} ${L.top} ${L.x2} ${NODE.y - 22}`} progress={loop} color={C.yellow} width={3.6} />
          {loop > 0.95 && <Stroke d={`M${L.x2 - 14} ${NODE.y - 38} L${L.x2} ${NODE.y - 22} L${L.x2 + 14} ${NODE.y - 38}`} progress={1} color={C.yellow} width={3.6} />}
        </svg>
      )}
    </Stage>
  );
};

/** s53: recap, each step lights up with what it does; the Skill loops back for next time. */
export const Steps: React.FC<{scene: Scene}> = ({scene}) => {
  const t = frameToSource(scene, useCurrentFrame());
  return <StepsFlow t={t} ghostAt={737.5} triggers={[742.39, 744.69, 747.25, 750.25, 753.27]} descs loopAt={756.23} />;
};

// ---------------- Install a Skill by sending one line (s18) ----------------
export const InstallCard: React.FC<{scene: Scene}> = ({scene}) => {
  const f = useCurrentFrame();
  const t = frameToSource(scene, f);
  const P = {x: 230, y: 80, w: 1460, h: 800};
  const command = '安装这个 skill：guizang-ppt-skill';
  const count = Math.floor(ease(t, 297.25, 300.4) * command.length);
  const panel = ease(t, 293.1, 293.8);
  const card = ease(t, 293.2, 294.0);
  const up = easeInOut(t, 295.92, 296.6);
  const input = ease(t, 296.2, 296.9);
  const sent = t >= 300.7;
  const bubble = ease(t, 300.7, 301.2);
  const reply = ease(t, 301.5, 302.0);
  const cx = P.x + P.w / 2;
  const cmdW = textW(command, 42) + 70, replyText = '已安装 guizang-ppt-skill', replyW = textW(replyText, 42) + 70;
  return (
    <Stage>
      <Frame k="install-panel" x={P.x} y={P.y} w={P.w} h={P.h} progress={panel} fill="none" />
      {/* the skill being recommended */}
      <div style={{position: 'absolute', left: cx, top: lerp(up, 380, P.y + 50), transform: `translate(-50%, 0) scale(${lerp(up, 1, 0.62)})`, transformOrigin: '50% 0', display: 'flex', alignItems: 'center', gap: 28}}>
        <Tag text="Skill" color={C.green} size={52} progress={card} />
        <KeyCard text="guizang-ppt-skill" size={76} progress={card} />
        <svg width={64} height={64} viewBox="0 0 40 40" style={{overflow: 'visible'}}><Stroke d="M8 21 L17 30 L33 9" progress={reply} color={C.green} width={5} /></svg>
      </div>
      {/* message sent */}
      <div style={{position: 'absolute', left: P.x + P.w - 50 - 100 - cmdW, top: 330, width: cmdW, height: 96, opacity: bubble, transform: `translateY(${(1 - bubble) * 50}px)`}}>
        <ChalkRect w={cmdW} h={96} k="bubble-me" color={C.blue} progress={bubble} />
        <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 42, whiteSpace: 'nowrap', color: C.blue}}>{command}</div>
      </div>
      <div style={{position: 'absolute', left: P.x + P.w - 50 - 76, top: 338, opacity: bubble}}><PersonIcon size={76} progress={bubble} /></div>
      {/* reply */}
      <div style={{position: 'absolute', left: P.x + 50, top: 474, opacity: reply}}><AiIcon size={76} progress={reply} /></div>
      <div style={{position: 'absolute', left: P.x + 50 + 100, top: 464, width: replyW, height: 96, opacity: reply, transform: `translateY(${(1 - reply) * 30}px)`}}>
        <ChalkRect w={replyW} h={96} k="bubble-ai" color={C.pink} progress={reply} />
        <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 42, whiteSpace: 'nowrap', color: C.pink}}>{replyText}</div>
      </div>
      {/* input box */}
      <div style={{position: 'absolute', left: P.x + 50, top: P.y + P.h - 160, width: P.w - 100, height: 110}}>
        <ChalkRect w={P.w - 100} h={110} k="input" color={count > 0 && !sent ? C.yellow : C.muted} progress={input} />
        <div style={{position: 'absolute', left: 40, top: 0, bottom: 0, display: 'flex', alignItems: 'center', fontSize: 44, opacity: input, whiteSpace: 'nowrap'}}>
          {sent || count === 0 ? <span style={{color: C.inkDim}}>发消息或创建任务…</span> : command.slice(0, count)}
          {!sent && <span style={{opacity: Math.floor(f / 14) % 2 ? 0 : 1, color: C.yellow, marginLeft: 4}}>|</span>}
        </div>
        <svg width={60} height={60} viewBox="0 0 34 34" style={{position: 'absolute', right: 34, top: 25, opacity: input}}>
          <Stroke d="M17 28 V6 M7 15 L17 5 L27 15" progress={1} color={count > 0 && !sent ? C.yellow : C.inkSoft} width={3.4} />
        </svg>
      </div>
    </Stage>
  );
};

// ---------------- The course's main diagram: the five-step pipeline ----------------
// Organised the way the reference explainer keeps one diagram for the whole lesson:
// the same map comes back at every chapter, the step being started lights up, and what
// that step produces (a real frame of the result) drops into the row below it. Earlier
// results stay, so the map fills up as the deck evolves from 资料 to a finished PPT.
const MAP = {y: 330, h: 140, w: 250, gap: 66, x0: 330, outY: 590};
const stepX = (i: number) => MAP.x0 + i * (MAP.w + MAP.gap);
const STEP_COLORS = [C.blue, C.green, C.yellow, C.pink, C.coral];
const MAP_STEPS = ['定大纲', '套模板', '调版式', '加动画', '做 Skill'];
const OUTPUTS: {label: string; file: string; start: number; crop: number[]}[] = [
  {label: '文字稿', file: '03', start: 112, crop: [0.12, 0.06, 0.6, 0.6]},
  {label: '第一版', file: '03', start: 286, crop: [0.22, 0.14, 0.74, 0.74]},
  {label: '图大字少', file: '12', start: 160, crop: [0.2, 0.14, 0.76, 0.76]},
  {label: '能直接讲', file: '15', start: 24.5, crop: [0, 0, 1, 1]},
  {label: '自己的 Skill', file: '16-x', start: 44, crop: [0, 0.45, 0.55, 0.55]},
];
// When each chapter says "我们会得到……" (source seconds).
const OUT_AT: Record<number, number> = {1: 174.49, 2: 236.6, 3: 395.38, 4: 573.38, 5: 673.65};

const MapStep: React.FC<{i: number; enter: number; lit: number; focus: number}> = ({i, enter, lit, focus}) => (
  <div style={{position: 'absolute', left: stepX(i), top: MAP.y, width: MAP.w, height: MAP.h, opacity: 0.4 + 0.6 * lit, transform: `scale(${1 + 0.1 * focus})`, transformOrigin: '50% 50%'}}>
    <ChalkRect w={MAP.w} h={MAP.h} k={`map-step-${i}`} color={lit > 0.5 ? STEP_COLORS[i] : C.muted} progress={enter} />
    <div style={{position: 'absolute', left: 0, right: 0, top: 18, textAlign: 'center', fontSize: 30, color: lit > 0.5 ? STEP_COLORS[i] : C.muted, opacity: enter}}>{'①②③④⑤'[i]}</div>
    <div style={{position: 'absolute', left: 0, right: 0, top: 58, textAlign: 'center', fontSize: 52, color: lit > 0.5 ? STEP_COLORS[i] : C.muted, opacity: enter}}>{MAP_STEPS[i]}</div>
  </div>
);

const MapOutput: React.FC<{i: number; progress: number; focus: number}> = ({i, progress, focus}) => {
  if (progress <= 0) return null;
  const o = OUTPUTS[i];
  const w = MAP.w, h = Math.round((w * 9) / 16);
  const file = o.file === '16-x' ? '16' : o.file;
  return (
    <>
      <Arrow x1={stepX(i) + w / 2} y1={MAP.y + MAP.h + 14} x2={stepX(i) + w / 2} y2={MAP.outY - 16} progress={ease(progress, 0, 0.5)} color={STEP_COLORS[i]} bend={0} />
      <div style={{position: 'absolute', left: stepX(i), top: MAP.outY, width: w, opacity: ease(progress, 0.35, 0.9), transform: `translateY(${(1 - ease(progress, 0.35, 1)) * -16}px) scale(${1 + 0.1 * focus})`, transformOrigin: '50% 0'}}>
        <div style={{position: 'relative', width: w, height: h, borderRadius: 10, overflow: 'hidden', boxShadow: '0 12px 30px rgba(0,0,0,.45)'}}>
          <CropVideo file={file} start={o.start} crop={o.crop} still />
        </div>
        <div style={{marginTop: 16, textAlign: 'center', fontSize: 40, color: STEP_COLORS[i]}}>{o.label}</div>
      </div>
    </>
  );
};

/** The 资料 the whole pipeline starts from. */
const MapSource: React.FC<{enter: number}> = ({enter}) => (
  <>
    <div style={{position: 'absolute', left: 70, top: MAP.y, width: 190, height: MAP.h}}>
      <ChalkRect w={190} h={MAP.h} k="map-source" color={C.ink} progress={enter} />
      <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 52, opacity: enter}}>资料</div>
    </div>
    <Arrow x1={272} y1={MAP.y + MAP.h / 2} x2={MAP.x0 - 12} y2={MAP.y + MAP.h / 2} progress={ease(enter, 0.4, 1)} />
  </>
);

/** s06: the map is first drawn — 资料 on the left, then the five steps as they are named. */
export const StepsIntro: React.FC<{scene: Scene}> = ({scene}) => {
  const t = frameToSource(scene, useCurrentFrame());
  const triggers = [161.99, 162.8, 163.75, 164.5, 165.21];
  return (
    <Stage>
      <MapSource enter={ease(t, 160.4, 161.2)} />
      {MAP_STEPS.map((_, i) => {
        const p = ease(t, triggers[i], triggers[i] + 0.45);
        return (
          <React.Fragment key={i}>
            <MapStep i={i} enter={p} lit={p} focus={0} />
            {i < 4 && <Arrow x1={stepX(i) + MAP.w + 10} y1={MAP.y + MAP.h / 2} x2={stepX(i + 1) - 10} y2={MAP.y + MAP.h / 2} progress={ease(t, triggers[i + 1] - 0.2, triggers[i + 1] + 0.2)} />}
          </React.Fragment>
        );
      })}
    </Stage>
  );
};

/** Chapter start: the same map, step `step` lights up and its result drops in below it. */
export const PipelineMap: React.FC<{scene: Scene; step: number}> = ({scene, step}) => {
  const t = frameToSource(scene, useCurrentFrame());
  const n = step - 1;
  const shotStart = scene.shots.find((s) => s.kind === 'map')?.at ?? scene.sourceStart;
  const focus = easeInOut(t, shotStart + 0.1, shotStart + 0.5);
  const out = ease(t, OUT_AT[step], OUT_AT[step] + 0.8);
  return (
    <Stage>
      <MapSource enter={1} />
      {MAP_STEPS.map((_, i) => (
        <React.Fragment key={i}>
          <MapStep i={i} enter={1} lit={i < n ? 0.75 : i === n ? focus : 0} focus={i === n ? focus : 0} />
          {i < 4 && <Arrow x1={stepX(i) + MAP.w + 10} y1={MAP.y + MAP.h / 2} x2={stepX(i + 1) - 10} y2={MAP.y + MAP.h / 2} progress={1} color={i < n ? C.blue : C.muted} />}
          {i < n && <div style={{opacity: 0.75}}><MapOutput i={i} progress={1} focus={0} /></div>}
        </React.Fragment>
      ))}
      <MapOutput i={n} progress={out} focus={out * 0.6} />
    </Stage>
  );
};
