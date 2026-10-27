import React from 'react';
import {AbsoluteFill, Freeze, OffthreadVideo, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {Scene, FPS, frameToSource, sourceToFrame} from './timeline';
import {Arrow, C, Card, ChalkRect, ChalkUnderline, FONT, MarkBox, Stage, ease, easeInOut, lerp, pop, textW} from './design';

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

// The boards below follow the reference explainer's way of organising a point:
// few elements, big icons with a short label each, plain arrows for the relation,
// one key word at a time, parts added in the order they are spoken. No boxes around text.

/** Chalk stroke path that draws itself. */
const Stroke: React.FC<{d: string; progress: number; color?: string; width?: number}> = ({d, progress, color = C.ink, width = 4}) => progress <= 0 ? null : (
  <path d={d} stroke={color} strokeWidth={width} fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - progress} />
);
const Icon: React.FC<{size: number; children: React.ReactNode}> = ({size, children}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{overflow: 'visible', display: 'block'}}>{children}</svg>
);
/** A person. */
const PersonIcon: React.FC<{size: number; progress?: number; color?: string}> = ({size, progress = 1, color = C.blue}) => (
  <Icon size={size}>
    <Stroke d="M50 12 C62 12 69 21 69 32 C69 44 61 51 50 51 C38 51 31 43 31 32 C31 21 39 12 50 12" progress={ease(progress, 0, 0.6)} color={color} />
    <Stroke d="M14 94 C15 70 30 58 50 58 C70 58 85 70 86 94" progress={ease(progress, 0.4, 1)} color={color} />
  </Icon>
);
/** The AI: a small robot head. */
const AiIcon: React.FC<{size: number; progress?: number; color?: string}> = ({size, progress = 1, color = C.pink}) => (
  <Icon size={size}>
    <Stroke d="M22 36 C22 30 26 27 32 27 H68 C74 27 78 30 78 36 V74 C78 80 74 83 68 83 H32 C26 83 22 80 22 74 Z" progress={ease(progress, 0, 0.6)} color={color} />
    <Stroke d="M50 27 V14 M44 10 C44 7 47 5 50 5 C53 5 56 7 56 10 C56 13 53 15 50 15 C47 15 44 13 44 10" progress={ease(progress, 0.4, 0.8)} color={color} />
    <Stroke d="M38 50 V56 M62 50 V56 M40 69 C46 73 54 73 60 69" progress={ease(progress, 0.55, 1)} color={color} width={5} />
    <Stroke d="M22 50 H14 V62 H22 M78 50 H86 V62 H78" progress={ease(progress, 0.6, 1)} color={color} width={3.4} />
  </Icon>
);
/** A closed book, which opens as `open` goes 0 → 1. */
const BookIcon: React.FC<{size: number; progress?: number; open?: number; color?: string}> = ({size, progress = 1, open = 0, color = C.green}) => (
  <Icon size={size}>
    <g opacity={1 - open}>
      <Stroke d="M26 14 H76 C79 14 80 16 80 19 V86 H30 C27 86 24 83 24 80 V18 C24 16 25 14 26 14 Z" progress={ease(progress, 0, 0.7)} color={color} />
      <Stroke d="M34 14 V86 M44 32 H70 M44 42 H64" progress={ease(progress, 0.5, 1)} color={color} width={3.4} />
    </g>
    <g opacity={open}>
      <Stroke d="M50 28 C40 20 24 20 10 25 V82 C24 77 40 77 50 85 C60 77 76 77 90 82 V25 C76 20 60 20 50 28 Z M50 28 V85" progress={1} color={color} />
      <Stroke d="M20 38 H40 M20 48 H40 M20 58 H36 M60 38 H80 M60 48 H80 M60 58 H76" progress={open} color={color} width={3} />
    </g>
  </Icon>
);
/** Two stacked sheets: a template. */
const TemplateIcon: React.FC<{size: number; progress?: number; color?: string}> = ({size, progress = 1, color = C.coral}) => (
  <Icon size={size}>
    <Stroke d="M30 12 H82 V70" progress={ease(progress, 0, 0.4)} color={color} width={3.4} />
    <Stroke d="M18 24 H70 V88 H18 Z" progress={ease(progress, 0.2, 0.8)} color={color} />
    <Stroke d="M28 40 H58 M28 54 H60 M28 66 H50" progress={ease(progress, 0.6, 1)} color={color} width={3.4} />
  </Icon>
);
const TickMark: React.FC<{size: number; progress: number; color?: string}> = ({size, progress, color = C.green}) => (
  <Icon size={size}><Stroke d="M14 54 L38 78 L86 20" progress={progress} color={color} width={9} /></Icon>
);

/** Big hand-written word with an underline that draws in. */
const KeyWord: React.FC<{text: string; size: number; progress: number; color?: string; line?: string}> = ({text, size, progress, color = C.ink, line = C.yellow}) => (
  <div style={{position: 'relative', display: 'inline-block', fontSize: size, color, whiteSpace: 'nowrap', lineHeight: 1.15, opacity: ease(progress, 0, 0.5)}}>
    {text}
    <ChalkUnderline w={textW(text, size) + 10} color={line} progress={ease(progress, 0.35, 1)} style={{left: -5, bottom: -size * 0.12}} />
  </div>
);
/** Icon with a label underneath, centred on (x, y). */
const Figure: React.FC<{x: number; y: number; size: number; label: React.ReactNode; color: string; progress: number; children: React.ReactNode}> = ({x, y, size, label, color, progress, children}) => (
  <div style={{position: 'absolute', left: x - size / 2 - 60, top: y - size / 2, width: size + 120, textAlign: 'center'}}>
    <div style={{width: size, margin: '0 auto'}}>{children}</div>
    <div style={{marginTop: 18, fontSize: 48, color, opacity: ease(progress, 0.3, 1), whiteSpace: 'nowrap'}}>{label}</div>
  </div>
);

// ---------------- Two-version comparison (s44, s52) ----------------
const PANE = {w: 860, h: 484, y: 300, lx: 70, rx: 990};
const ONE_LINE_CROP = [0.585, 0.35, 0.4, 0.435]; // the slide inside recording 02
const PHOTO = [0.62, 0.11, 0.33, 0.72]; // phone photo on that slide, relative to the pane

const Pane: React.FC<{x: number; enter: number; focus: number; dim: number; tag: string; tagColor: string; children: React.ReactNode}> = ({x, enter, focus, dim, tag, tagColor, children}) => (
  <div style={{position: 'absolute', left: x, top: PANE.y, width: PANE.w, height: PANE.h, opacity: ease(enter, 0, 1), transform: `translateY(${(1 - enter) * 24}px) scale(${1 + 0.03 * focus - 0.03 * dim})`, transformOrigin: '50% 50%'}}>
    <div style={{position: 'absolute', left: 0, right: 0, top: -96, textAlign: 'center', opacity: 1 - 0.55 * dim}}><KeyWord text={tag} size={54} color={tagColor} line={tagColor} progress={enter} /></div>
    <Card style={{left: 0, top: 0, width: PANE.w, height: PANE.h}}>
      {children}
      <div style={{position: 'absolute', inset: 0, background: `rgba(22,24,26,${0.62 * dim})`}} />
    </Card>
  </div>
);

export const Compare: React.FC<{scene: Scene; mode: string}> = ({scene, mode}) => {
  const t = frameToSource(scene, useCurrentFrame());
  const power = mode === 'compare-power';
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
      <Pane x={PANE.lx} enter={ease(t, cue.leftIn, cue.leftIn + 0.7)} focus={leftFocus} dim={leftDim} tag="一句话" tagColor={C.pink}>
        <CropVideo file="02" start={25} crop={ONE_LINE_CROP} still />
        <MarkBox x={PHOTO[0] * PANE.w} y={PHOTO[1] * PANE.h} w={PHOTO[2] * PANE.w} h={PHOTO[3] * PANE.h} progress={mark} stroke={5} />
      </Pane>
      <Pane x={PANE.rx} enter={ease(t, cue.rightIn, cue.rightIn + 0.7)} focus={rightFocus} dim={rightDim} tag={power ? '一句话 + Skill' : '一步步提要求'} tagColor={C.green}>
        <ClipTrack scene={scene} file={power ? '17' : '15'} beats={beats} poster={power ? 19 : 24.5} />
      </Pane>
    </Stage>
  );
};

// ---------------- Skill = a handbook for a new colleague (s16) ----------------
// Key word first; then the analogy as two figures and one arrow; the handbook's two
// contents and the template are short notes beside the book; then the colleague becomes the AI.
export const Handbook: React.FC<{scene: Scene}> = ({scene}) => {
  const t = frameToSource(scene, useCurrentFrame());
  const word = ease(t, 260.9, 261.6);
  const lift = easeInOut(t, 262.5, 263.2); // key word moves up to become the board's topic
  const book = ease(t, 262.9, 263.7);
  const person = ease(t, 263.2, 264.0);
  const give = ease(t, 263.8, 264.4);
  const note = (a: number) => ease(t, a, a + 0.5);
  const toAi = easeInOut(t, 270.24, 270.8);
  const open = easeInOut(t, 272.4, 273.0);
  const done = ease(t, 273.98, 274.5);
  const BOOK = {x: 1060, y: 470}, WHO = {x: 520, y: 470};
  return (
    <Stage>
      {/* topic word */}
      <div style={{position: 'absolute', left: 960, top: lerp(lift, 430, 120), transform: `translate(-50%, -50%) scale(${lerp(lift, 1.6, 1)})`, opacity: 1 - 0.4 * toAi}}>
        <KeyWord text="Skill" size={90} progress={word} color={C.green} />
      </div>
      {/* the book */}
      <Figure x={BOOK.x} y={BOOK.y} size={240} color={C.green} progress={book} label={<span>{toAi > 0.5 ? 'Skill' : '工作手册'}</span>}>
        <BookIcon size={240} progress={book} open={open} />
      </Figure>
      {/* what is written in it */}
      <div style={{position: 'absolute', left: 1280, top: 330, fontSize: 50, lineHeight: 1.3}}>
        <div style={{color: C.yellow, opacity: note(265.02), transform: `translateX(${(1 - note(265.02)) * -16}px)`}}>活儿怎么干</div>
        <div style={{color: C.blue, marginTop: 34, opacity: note(266.26), transform: `translateX(${(1 - note(266.26)) * -16}px)`}}>按什么要求干</div>
        <div style={{display: 'flex', alignItems: 'center', gap: 18, marginTop: 30, color: C.coral, opacity: note(268.7)}}>
          <TemplateIcon size={70} progress={note(268.7)} />模板
        </div>
      </div>
      {/* who reads it */}
      <Figure x={WHO.x} y={WHO.y} size={220} color={toAi > 0.5 ? C.pink : C.blue} progress={person} label={toAi > 0.5 ? 'AI' : '新同事'}>
        <div style={{position: 'relative', width: 220, height: 220}}>
          <div style={{position: 'absolute', inset: 0, opacity: 1 - toAi}}><PersonIcon size={220} progress={person} /></div>
          {toAi > 0 && <div style={{position: 'absolute', inset: 0}}><AiIcon size={220} progress={toAi} /></div>}
        </div>
      </Figure>
      <Arrow x1={BOOK.x - 150} y1={BOOK.y - 10} x2={WHO.x + 150} y2={WHO.y - 10} progress={give} color={C.green} />
      <div style={{position: 'absolute', left: WHO.x + 70, top: WHO.y - 200}}><TickMark size={90} progress={done} /></div>
    </Stage>
  );
};

// ---------------- Five steps ----------------
const STEP_NAMES = ['定大纲', '套模板', '调版式', '加动画', '做 Skill'];
const STEP_DESC = ['先把内容理清楚', '把风格统一起来', '提升设计感', '把重点突出出来', '把要求存下来'];

/** s06: the five steps written in one line, joined by arrows, as they are named. */
export const StepsIntro: React.FC<{scene: Scene}> = ({scene}) => {
  const t = frameToSource(scene, useCurrentFrame());
  const triggers = [161.99, 162.8, 163.75, 164.5, 165.21];
  const size = 74, gap = 104;
  const widths = STEP_NAMES.map((n) => textW(n, size));
  const total = widths.reduce((a, b) => a + b, 0) + gap * 4;
  let x = (1920 - total) / 2;
  const cur = triggers.filter((v) => t >= v).length - 1;
  const lead = ease(t, 160.4, 161.0);
  return (
    <Stage>
      <div style={{position: 'absolute', left: 0, right: 0, top: 330, textAlign: 'center', fontSize: 58, color: C.inkSoft, opacity: lead}}>一共 <span style={{color: C.yellow, fontSize: 84}}>5</span> 步</div>
      {STEP_NAMES.map((n, i) => {
        const p = ease(t, triggers[i], triggers[i] + 0.45);
        const left = x;
        x += widths[i] + gap;
        return (
          <React.Fragment key={n}>
            <div style={{position: 'absolute', left, top: 500, opacity: p, transform: `translateY(${(1 - p) * 20}px)`}}>
              <div style={{fontSize: 34, color: i === cur ? C.yellow : C.muted, textAlign: 'center', marginBottom: 6}}>{'①②③④⑤'[i]}</div>
              <KeyWord text={n} size={size} progress={p} color={i === cur ? C.yellow : C.ink} line={i === cur ? C.yellow : 'rgba(0,0,0,0)'} />
            </div>
            {i < 4 && <Arrow x1={left + widths[i] + 24} y1={600} x2={left + widths[i] + gap - 24} y2={600} progress={ease(t, triggers[i + 1] - 0.2, triggers[i + 1] + 0.2)} />}
          </React.Fragment>
        );
      })}
    </Stage>
  );
};

/** s53: recap as a two-column list — step on the left, what it does on the right; the Skill loops back. */
export const Steps: React.FC<{scene: Scene}> = ({scene}) => {
  const t = frameToSource(scene, useCurrentFrame());
  const triggers = [742.39, 744.69, 747.25, 750.25, 753.27];
  const descAt = [743.43, 745.5, 748.19, 751.45, 754.87];
  const five = ease(t, 739.9, 740.5);
  const listIn = easeInOut(t, 742.0, 742.5);
  const cur = triggers.filter((v) => t >= v).length - 1;
  const loop = easeInOut(t, 756.23, 757.0);
  const rowY = (i: number) => 175 + i * 132;
  return (
    <Stage>
      {/* "5 步" first, then it gives way to the list */}
      <div style={{position: 'absolute', left: 960, top: 470, transform: 'translate(-50%, -50%)', opacity: 1 - listIn}}>
        <KeyWord text="5 步" size={150} progress={five} color={C.yellow} />
      </div>
      {STEP_NAMES.map((n, i) => {
        const p = ease(t, triggers[i], triggers[i] + 0.45);
        const d = ease(t, descAt[i], descAt[i] + 0.5);
        const isCur = i === cur && loop === 0;
        return (
          <div key={n} style={{position: 'absolute', left: 0, right: 0, top: rowY(i), height: 110, opacity: p * (isCur || loop > 0 ? 1 : 0.6)}}>
            <div style={{position: 'absolute', right: 1920 - 860, top: 8, display: 'flex', alignItems: 'baseline', gap: 22, transform: `translateX(${(1 - p) * -20}px)`}}>
              <span style={{fontSize: 36, color: isCur ? C.yellow : C.muted}}>{'①②③④⑤'[i]}</span>
              <span style={{fontSize: 76, color: isCur ? C.yellow : C.ink}}>{n}</span>
            </div>
            <div style={{position: 'absolute', left: 940, top: 22, fontSize: 56, color: C.ink, opacity: d, transform: `translateX(${(1 - d) * 16}px)`}}>{STEP_DESC[i]}</div>
          </div>
        );
      })}
      {/* "下次直接调用": from the last step back up to the first */}
      <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1} height={1}>
        <Stroke d={`M 560 ${rowY(4) + 58} C 440 ${rowY(4) + 40} 430 ${rowY(0) + 70} 548 ${rowY(0) + 52}`} progress={loop} color={C.pink} width={4.5} />
        {loop > 0.95 && <Stroke d={`M 522 ${rowY(0) + 34} L 550 ${rowY(0) + 52} L 526 ${rowY(0) + 76}`} progress={1} color={C.pink} width={4.5} />}
      </svg>
    </Stage>
  );
};

// ---------------- Install a Skill by sending one line (s18) ----------------
// Key word (the Skill's name) first; then a chat between you (right) and the AI (left).
export const InstallCard: React.FC<{scene: Scene}> = ({scene}) => {
  const f = useCurrentFrame();
  const t = frameToSource(scene, f);
  const command = '安装这个 skill：guizang-ppt-skill';
  const name = ease(t, 293.2, 294.2);
  const up = easeInOut(t, 295.92, 296.6);
  const me = ease(t, 297.0, 297.5);
  const count = Math.floor(ease(t, 297.25, 300.4) * command.length);
  const send = ease(t, 300.7, 301.2);
  const ai = ease(t, 300.9, 301.5);
  const reply = ease(t, 301.5, 302.0);
  const cmdW = textW(command, 48) + 90;
  const ME = {x: 1600, y: 450}, AI = {x: 330, y: 700};
  return (
    <Stage>
      <div style={{position: 'absolute', left: 960, top: lerp(up, 440, 150), transform: `translate(-50%, -50%) scale(${lerp(up, 1.5, 0.95)})`, display: 'flex', alignItems: 'center', gap: 22}}>
        <KeyWord text="guizang-ppt-skill" size={70} progress={name} color={C.green} />
        <div style={{width: 70, height: 70}}><TickMark size={70} progress={reply} /></div>
      </div>
      {/* you */}
      <Figure x={ME.x} y={ME.y} size={150} color={C.blue} progress={me} label="我"><PersonIcon size={150} progress={me} /></Figure>
      <div style={{position: 'absolute', left: ME.x - 130 - cmdW, top: ME.y - 40, width: cmdW, height: 110, opacity: me}}>
        <ChalkRect w={cmdW} h={110} k="bubble-me" color={C.blue} progress={me} />
        <div style={{position: 'absolute', left: 45, top: 0, bottom: 0, display: 'flex', alignItems: 'center', fontSize: 48, color: C.blue, whiteSpace: 'nowrap'}}>
          {command.slice(0, count)}{send === 0 && <span style={{opacity: Math.floor(f / 14) % 2 ? 0 : 1, marginLeft: 4}}>|</span>}
        </div>
      </div>
      {/* the AI answers */}
      <Figure x={AI.x} y={AI.y} size={150} color={C.pink} progress={ai} label="AI"><AiIcon size={150} progress={ai} /></Figure>
      <div style={{position: 'absolute', left: AI.x + 130, top: AI.y - 40, width: 340, height: 110, opacity: reply}}>
        <ChalkRect w={340} h={110} k="bubble-ai" color={C.pink} progress={reply} />
        <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, color: C.pink}}>已安装好</div>
      </div>
    </Stage>
  );
};
