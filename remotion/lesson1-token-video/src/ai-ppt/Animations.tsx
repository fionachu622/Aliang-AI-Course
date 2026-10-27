import React from 'react';
import {AbsoluteFill, Freeze, OffthreadVideo, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {Scene, FPS, frameToSource, sourceToFrame} from './timeline';
import {Arrow, C, Card, FONT, KeyCard, MarkBox, Stage, Tag, ease, easeInOut, lerp, pop} from './design';

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


// ---------------- Shared helpers for the diagram scenes ----------------
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
        const len = Math.round(b.len * FPS);
        return (
          <Sequence key={i} from={from} durationInFrames={Math.max(1, until - from)} premountFor={30}>
            <PlayThenHold file={file} crop={crop} start={b.start} len={len} />
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

/** Simple flat person icon. */
const PersonIcon: React.FC<{size: number}> = ({size}) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <circle cx="50" cy="32" r="19" fill="#E9E6E1" />
    <path d="M14 96 C14 66 30 56 50 56 C70 56 86 66 86 96 Z" fill="#BDB9B3" />
  </svg>
);
/** Flat AI icon: dark tile with a four-point spark. */
const AiIcon: React.FC<{size: number}> = ({size}) => (
  <div style={{width: size, height: size, borderRadius: size * 0.22, background: C.deep, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
    <svg width={size * 0.56} height={size * 0.56} viewBox="-50 -50 100 100"><path d="M0 -46 C6 -10 10 -6 46 0 C10 6 6 10 0 46 C-6 10 -10 6 -46 0 C-10 -6 -6 -10 0 -46Z" fill={C.accent} /></svg>
  </div>
);

// ---------------- Two-version comparison (s44, s52) ----------------
const PANE = {w: 860, h: 484, y: 300, lx: 70, rx: 990};
const ONE_LINE_CROP = [0.585, 0.35, 0.4, 0.435]; // the slide inside recording 02
const PHOTO = [0.62, 0.11, 0.33, 0.72]; // phone photo on that slide, relative to the pane

const Pane: React.FC<{x: number; enter: number; focus: number; dim: number; tag: string; tagColor: string; children: React.ReactNode}> = ({x, enter, focus, dim, tag, tagColor, children}) => (
  <div style={{position: 'absolute', left: x, top: PANE.y, width: PANE.w, opacity: enter * (1 - 0.62 * dim), transform: `translateY(${(1 - enter) * 30}px) scale(${1 + 0.03 * focus - 0.02 * dim})`, transformOrigin: '50% 50%'}}>
    <div style={{position: 'absolute', left: 0, top: -76}}><Tag text={tag} color={tagColor} size={32} /></div>
    <div style={{position: 'relative', width: PANE.w, height: PANE.h, borderRadius: 12, overflow: 'hidden', background: '#000'}}>{children}</div>
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
  const sw = (on: boolean, a: number) => (on ? ease(t, a, a + 0.4) : 0);
  const leftFocus = sw(leftOn, cue.left), rightFocus = sw(rightOn, cue.right);
  const leftDim = rightOn ? ease(t, cue.right, cue.right + 0.4) : 0;
  const rightDim = leftOn ? ease(t, cue.left, cue.left + 0.4) : 0;
  const mark = t >= cue.mark && t < cue.right ? ease(t, cue.mark + 0.1, cue.mark + 0.5) : 0;
  const beats: Beat[] = power
    ? [{at: 723.33, start: 15.0, len: 4.0}, {at: 726.37, start: 43.0, len: 1.9}, {at: 728.29, start: 35.0, len: 3.6}, {at: 731.9, start: 47.0, len: 2.6}]
    : [{at: 646.63, start: 22.45, len: 1.15}, {at: 649.05, start: 63.25, len: 1.35}, {at: 650.55, start: 69.7, len: 2.0}];
  return (
    <Stage>
      <Pane x={PANE.lx} enter={ease(t, cue.leftIn, cue.leftIn + 0.5)} focus={leftFocus} dim={leftDim} tag="一句话" tagColor="#6E6C70">
        <CropVideo file="02" start={25} crop={ONE_LINE_CROP} still />
        <MarkBox x={PHOTO[0] * PANE.w} y={PHOTO[1] * PANE.h} w={PHOTO[2] * PANE.w} h={PHOTO[3] * PANE.h} progress={mark} />
      </Pane>
      <Pane x={PANE.rx} enter={ease(t, cue.rightIn, cue.rightIn + 0.5)} focus={rightFocus} dim={rightDim} tag={power ? '一句话 + Skill' : '一步步提要求'} tagColor={C.green}>
        <ClipTrack scene={scene} file={power ? '17' : '15'} beats={beats} poster={power ? 19 : 24.5} />
      </Pane>
    </Stage>
  );
};

// ---------------- Skill = a work handbook (s16) ----------------
export const Handbook: React.FC<{scene: Scene}> = ({scene}) => {
  const t = frameToSource(scene, useCurrentFrame());
  const P = {x: 600, y: 170, w: 1200, h: 640};
  const keyIn = pop(t, 260.9, 261.4);
  const dock = easeInOut(t, 262.66, 263.3); // "Skill" card docks onto the handbook
  const panel = ease(t, 262.75, 263.3);
  const who = pop(t, 262.9, 263.5);
  const row = (a: number, i: number) => ease(t, a + i * 0.25, a + i * 0.25 + 0.4);
  const flash = t >= 267.32 && t < 268.6 ? Math.sin(Math.PI * ease(t, 267.32, 268.4)) : 0;
  const tpl = (i: number) => pop(t, 268.7 + i * 0.22, 269.2 + i * 0.22);
  const toAi = easeInOut(t, 270.24, 270.8);
  const read = ease(t, 272.4, 273.0);
  const tick = (i: number) => pop(t, 273.98 + i * 0.18, 274.3 + i * 0.18);
  const kx = lerp(dock, 960, P.x + 40), ky = lerp(dock, 470, P.y + 40), ks = lerp(dock, 1.4, 0.62);
  const col = (x: number, title: string, items: string[], at: number, base: number) => (
    <div style={{position: 'absolute', left: x, top: P.y + 170}}>
      <div style={{opacity: ease(t, at, at + 0.35)}}><Tag text={title} size={34} /></div>
      {items.map((s, i) => (
        <div key={s} style={{display: 'flex', alignItems: 'center', gap: 18, marginTop: 30, fontSize: 38, fontWeight: 700, opacity: row(at + 0.2, i), transform: `translateX(${(1 - row(at + 0.2, i)) * -14}px)`}}>
          <span style={{position: 'relative', width: 40, height: 40, borderRadius: 20, border: `3px solid ${C.inkDim}`, display: 'inline-block'}}>
            <span style={{position: 'absolute', inset: -3, borderRadius: 20, background: C.accent, transform: `scale(${tick(base + i)})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.dark, fontSize: 26, fontWeight: 900}}>✓</span>
          </span>
          {s}
        </div>
      ))}
    </div>
  );
  return (
    <Stage>
      {/* the handbook */}
      <div style={{position: 'absolute', left: P.x, top: P.y, width: P.w, height: P.h, borderRadius: 20, background: C.panel, opacity: panel, outline: flash > 0 ? `4px solid rgba(210,224,26,${flash})` : 'none', outlineOffset: 6}} />
      {panel > 0 && col(P.x + 60, '活儿怎么干', ['先定大纲', '再套模板、调版式', '最后加动画'], 265.02, 0)}
      {panel > 0 && col(P.x + 640, '按什么要求干', ['数字以资料为准', '图要大，字要少', '重点用动画演出来'], 266.26, 3)}
      {/* templates that come with it */}
      {[0, 1, 2].map((i) => {
        const p = tpl(i);
        return (
          <div key={i} style={{position: 'absolute', left: P.x + 60 + i * 200, top: P.y + P.h - 130, width: 176, height: 99, borderRadius: 8, background: C.panelHi, border: `2px solid ${C.line}`, opacity: p, transform: `translateY(${(1 - p) * 20}px)`}}>
            <div style={{margin: '16px 14px 0', width: 70, height: 12, borderRadius: 3, background: C.inkDim}} />
            <div style={{margin: '10px 14px 0', width: 120, height: 8, borderRadius: 3, background: C.line}} />
            <div style={{margin: '8px 14px 0', width: 100, height: 8, borderRadius: 3, background: C.line}} />
          </div>
        );
      })}
      <div style={{position: 'absolute', left: P.x + 660, top: P.y + P.h - 104, fontSize: 32, fontWeight: 700, color: C.inkSoft, opacity: tpl(2)}}>模板</div>
      {/* keyword card: "Skill" first on its own, then it becomes the handbook's title */}
      <div style={{position: 'absolute', left: kx, top: ky, transform: `translate(${-50 * (1 - dock)}%, ${-50 * (1 - dock)}%) scale(${ks * (0.8 + 0.2 * keyIn)})`, transformOrigin: dock > 0.5 ? '0 0' : '50% 50%', opacity: keyIn}}>
        <KeyCard text="Skill" size={96} />
      </div>
      {/* who reads it: a new colleague, then the AI */}
      <div style={{position: 'absolute', left: 240, top: 360, width: 220, textAlign: 'center', opacity: who, transform: `scale(${0.85 + 0.15 * who})`}}>
        <div style={{position: 'relative', width: 180, height: 180, margin: '0 auto'}}>
          <div style={{position: 'absolute', inset: 0, opacity: 1 - toAi}}><PersonIcon size={180} /></div>
          <div style={{position: 'absolute', inset: 0, opacity: toAi, transform: `scale(${0.8 + 0.2 * toAi})`}}><AiIcon size={180} /></div>
        </div>
        <div style={{marginTop: 20, fontSize: 38, fontWeight: 800}}>{toAi > 0.5 ? 'AI' : '新同事'}</div>
      </div>
      <Arrow x1={470} y1={450} x2={P.x - 24} y2={450} progress={read} />
    </Stage>
  );
};

// ---------------- Five steps (s06 intro, s53 recap) ----------------
const STEP_NAMES = ['定大纲', '套模板', '调版式', '加动画', '做 Skill'];
const STEP_DESC = ['先把内容理清楚', '把风格统一起来', '提升设计感', '把重点突出出来', '把要求存下来'];
const NODE = {w: 270, h: 150, gap: 90, y: 400};
const nodeX = (i: number) => (1920 - (NODE.w * 5 + NODE.gap * 4)) / 2 + i * (NODE.w + NODE.gap);

const StepsFlow: React.FC<{t: number; ghostAt: number; triggers: number[]; descs?: boolean; loopAt?: number}> = ({t, ghostAt, triggers, descs, loopAt}) => {
  const cur = triggers.filter((x) => t >= x).length - 1;
  const loop = loopAt != null ? easeInOut(t, loopAt, loopAt + 0.8) : 0;
  const L = {x1: nodeX(4) + NODE.w / 2, x2: nodeX(0) + NODE.w / 2, top: NODE.y - 90};
  const loopLen = 90 + (L.x1 - L.x2) + 90;
  return (
    <Stage>
      {STEP_NAMES.map((n, i) => {
        const ghost = ease(t, ghostAt + i * 0.12, ghostAt + i * 0.12 + 0.4);
        const lit = ease(t, triggers[i], triggers[i] + 0.35);
        const isCur = i === cur && loop === 0;
        const x = nodeX(i);
        return (
          <React.Fragment key={n}>
            <div style={{position: 'absolute', left: x, top: NODE.y, width: NODE.w, height: NODE.h, borderRadius: 16, background: C.panel, opacity: ghost * (0.35 + 0.65 * lit), outline: isCur ? `4px solid ${C.accent}` : 'none', outlineOffset: 0, transform: `scale(${1 + 0.04 * (isCur ? lit : 0)})`}}>
              <div style={{position: 'absolute', left: 20, top: 16, fontFamily: FONT.num, fontSize: 28, fontWeight: 800, color: lit > 0.5 ? C.accent : C.inkDim}}>0{i + 1}</div>
              <div style={{position: 'absolute', left: 0, right: 0, top: 58, textAlign: 'center', fontSize: 50, fontWeight: 900}}>{n}</div>
            </div>
            {i < 4 && <Arrow x1={x + NODE.w + 14} y1={NODE.y + NODE.h / 2} x2={x + NODE.w + NODE.gap - 14} y2={NODE.y + NODE.h / 2} progress={ease(t, triggers[i + 1] - 0.15, triggers[i + 1] + 0.2)} />}
            {descs && <div style={{position: 'absolute', left: x - 20, width: NODE.w + 40, top: NODE.y + NODE.h + 34, textAlign: 'center', fontSize: 36, fontWeight: 700, color: C.inkSoft, opacity: ease(t, triggers[i] + 0.9, triggers[i] + 1.3)}}>{STEP_DESC[i]}</div>}
          </React.Fragment>
        );
      })}
      {loop > 0 && (
        <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1} height={1}>
          <path d={`M${L.x1} ${NODE.y - 14} V${L.top} H${L.x2} V${NODE.y - 18}`} stroke={C.accent} strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={`${loopLen * loop} 9999`} />
          {loop > 0.97 && <path d={`M${L.x2 - 14} ${NODE.y - 34} L${L.x2} ${NODE.y - 18} L${L.x2 + 14} ${NODE.y - 34}`} stroke={C.accent} strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round" />}
        </svg>
      )}
    </Stage>
  );
};

/** s06: the five steps named one after another. */
export const StepsIntro: React.FC<{scene: Scene}> = ({scene}) => {
  const t = frameToSource(scene, useCurrentFrame());
  return <StepsFlow t={t} ghostAt={160.4} triggers={[161.99, 162.8, 163.75, 164.5, 165.21]} />;
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
  const P = {x: 260, y: 90, w: 1400, h: 790};
  const command = '安装这个 skill：guizang-ppt-skill';
  const count = Math.floor(ease(t, 297.25, 300.4) * command.length);
  const panel = ease(t, 293.1, 293.5);
  const card = pop(t, 293.15, 293.7);
  const up = easeInOut(t, 295.92, 296.6);
  const input = ease(t, 296.3, 296.8);
  const sent = t >= 300.7;
  const bubble = pop(t, 300.7, 301.1);
  const reply = pop(t, 301.5, 301.9);
  const cx = P.x + P.w / 2;
  return (
    <Stage>
      <div style={{position: 'absolute', left: P.x, top: P.y, width: P.w, height: P.h, borderRadius: 22, background: C.panel, opacity: panel}} />
      {/* the skill being recommended */}
      <div style={{position: 'absolute', left: cx, top: lerp(up, 430, P.y + 70), transform: `translate(-50%, 0) scale(${lerp(up, 1, 0.62) * (0.85 + 0.15 * card)})`, transformOrigin: '50% 0', opacity: card, display: 'flex', alignItems: 'center', gap: 24}}>
        <Tag text="Skill" size={44} />
        <KeyCard text="guizang-ppt-skill" size={76} />
        <div style={{width: 64, height: 64, borderRadius: 32, background: C.green, color: '#fff', fontSize: 40, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${reply})`}}>✓</div>
      </div>
      {/* message sent */}
      <div style={{position: 'absolute', right: 1920 - (P.x + P.w - 50), top: 330, display: 'flex', alignItems: 'center', gap: 22, opacity: bubble, transform: `translateY(${(1 - bubble) * 60}px)`}}>
        <div style={{padding: '22px 34px', borderRadius: 10, background: C.blue, fontSize: 40, fontWeight: 800}}>{command}</div>
        <div style={{width: 76, height: 76, borderRadius: 38, overflow: 'hidden', background: '#E9E6E1'}}><PersonIcon size={76} /></div>
      </div>
      {/* reply */}
      <div style={{position: 'absolute', left: P.x + 50, top: 470, display: 'flex', alignItems: 'center', gap: 22, opacity: reply, transform: `translateY(${(1 - reply) * 30}px)`}}>
        <AiIcon size={76} />
        <div style={{padding: '22px 34px', borderRadius: 10, background: C.green, fontSize: 40, fontWeight: 800}}>已安装 guizang-ppt-skill</div>
      </div>
      {/* input box */}
      <div style={{position: 'absolute', left: P.x + 50, top: P.y + P.h - 150, width: P.w - 100, height: 104, borderRadius: 14, background: C.deep, opacity: input, border: `2px solid ${count > 0 && !sent ? C.accent : C.line}`, display: 'flex', alignItems: 'center', padding: '0 34px', fontSize: 40, fontWeight: 700}}>
        {sent || count === 0 ? <span style={{color: C.inkDim}}>发消息或创建任务…</span> : command.slice(0, count)}
        {!sent && <span style={{opacity: Math.floor(f / 14) % 2 ? 0 : 1, color: C.accent, marginLeft: 4}}>|</span>}
        <div style={{marginLeft: 'auto', width: 60, height: 60, borderRadius: 30, background: count > 0 && !sent ? C.accent : C.panelHi, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <svg width="30" height="30" viewBox="0 0 34 34"><path d="M17 28 V6 M7 15 L17 5 L27 15" stroke={count > 0 && !sent ? C.dark : '#fff'} strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
      </div>
    </Stage>
  );
};
