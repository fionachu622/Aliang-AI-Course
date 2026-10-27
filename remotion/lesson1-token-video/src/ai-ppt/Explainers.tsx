// Explainer boards for s16, s18, s44, s52, s53 (shot list: handoff/ai-ppt/huashu/镜头表-讲解段.md).
// Objects with volume — a hard-cover handbook that stands for a Skill, stacks of real PPT pages —
// on the course chalkboard, moved by a camera that follows the narration.
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Scene, frameToSource} from './timeline';
import {Arrow, C, ChalkUnderline, Stage, ease, easeInOut, lerp, pop, textW} from './design';
import {Beat, ClipTrack, CropVideo, FIRST_CROP, SHEETS, SH, STACK, SW, SheetView, Stroke, chalkEllipse, sheetY} from './Animations';

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const PAPER = '#EFE7D6';
const INK = '#2E2B27';
const ONE_LINE_CROP = [0.585, 0.35, 0.4, 0.435]; // the one-sentence deck inside recording 02
const PRICE_CROP = [0.2173, 0.2056, 0.6849, 0.6944];

/** Camera over the board: centre (cx, cy) in board px and zoom. */
const Camera: React.FC<{cx: number; cy: number; z: number; children: React.ReactNode}> = ({cx, cy, z, children}) => (
  <AbsoluteFill style={{transform: `translate(${960 - cx * z}px, ${540 - cy * z}px) scale(${z})`, transformOrigin: '0 0'}}>{children}</AbsoluteFill>
);
/** Keyframed camera: list of [sourceTime, cx, cy, z]; eased between keys. */
const camAt = (t: number, keys: [number, number, number, number][]) => {
  let k = 0;
  while (k + 1 < keys.length && t >= keys[k + 1][0]) k++;
  if (k + 1 >= keys.length) return keys[k].slice(1) as [number, number, number];
  const [t0, ...a] = keys[k];
  const [t1, ...b] = keys[k + 1];
  const p = easeInOut(t, Math.max(t0, t1 - 0.9), t1); // move in the 0.9 s before each key
  return [lerp(p, a[0], b[0]), lerp(p, a[1], b[1]), lerp(p, a[2], b[2])] as [number, number, number];
};

/** Chalk handwriting that writes itself left to right. */
const Write: React.FC<{text: string; size: number; progress: number; color?: string; style?: React.CSSProperties; underline?: string}> = ({text, size, progress, color = C.ink, style, underline}) => (
  <div style={{position: 'absolute', fontSize: size, color, whiteSpace: 'nowrap', lineHeight: 1.15, ...style}}>
    <span style={{clipPath: `inset(-20% ${(1 - progress) * 100}% -20% 0)`, display: 'inline-block'}}>{text}</span>
    {underline && <ChalkUnderline w={textW(text, size) + 8} color={underline} progress={ease(progress, 0.6, 1)} style={{left: -4, bottom: -size * 0.12}} />}
  </div>
);

/** A real PPT page as a card with a soft shadow. */
const PageCard: React.FC<{file: string; start: number; crop: number[]; w: number; style?: React.CSSProperties; still?: boolean; children?: React.ReactNode; dim?: number}> = ({file, start, crop, w, style, still = true, children, dim = 0}) => (
  <div style={{position: 'absolute', width: w, height: Math.round((w * 9) / 16), borderRadius: 8, overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,.55), 0 3px 10px rgba(0,0,0,.35)', ...style}}>
    {children ?? <CropVideo file={file} start={start} crop={crop} still={still} />}
    {dim > 0 && <div style={{position: 'absolute', inset: 0, background: `rgba(20,22,24,${dim})`}} />}
  </div>
);

// ---------------- The handbook: a hard-cover book that opens ----------------
type BookProps = {
  w?: number; h?: number; cover: string; title: React.ReactNode; open?: number; flip?: number;
  left?: React.ReactNode; right?: React.ReactNode; yaw?: number; tilt?: number;
};
/** Hard-cover book centred on its own box (w × h, closed). `open` swings the cover to the left. */
export const Book: React.FC<BookProps> = ({w = 380, h = 500, cover, title, open = 0, flip = 0, left, right, yaw = 0, tilt = 0}) => {
  const page: React.CSSProperties = {position: 'absolute', inset: 0, background: PAPER, borderRadius: '2px 8px 8px 2px', color: INK, overflow: 'hidden', boxShadow: 'inset 14px 0 18px -10px rgba(0,0,0,.28)'};
  const face: React.CSSProperties = {position: 'absolute', inset: 0, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden'};
  return (
    <div style={{position: 'relative', width: w, height: h, perspective: 2200, transform: `translateX(${(w / 2) * open}px)`}}>
      <div style={{position: 'absolute', inset: 0, transformStyle: 'preserve-3d', transform: `rotateY(${yaw}deg) rotateX(${tilt}deg)`}}>
        {/* shadow on the board */}
        <div style={{position: 'absolute', left: -w * open - 10, right: -10, top: 14, bottom: -18, borderRadius: 14, background: 'rgba(0,0,0,.45)', filter: 'blur(18px)', transform: 'translateZ(-2px)'}} />
        {/* back cover edge and page block */}
        <div style={{position: 'absolute', inset: 0, borderRadius: '4px 10px 10px 4px', background: cover, transform: 'translateZ(-1px)'}} />
        <div style={{position: 'absolute', left: 4, top: 7, right: 8, bottom: 7}}>
          <div style={page}>{right}</div>
          <div style={{position: 'absolute', top: 2, bottom: 2, right: -5, width: 5, background: 'repeating-linear-gradient(90deg, #E2D8C3 0 1px, #CFC3AA 1px 2px)', borderRadius: '0 3px 3px 0'}} />
        </div>
        {/* a leaf being turned */}
        {flip > 0 && flip < 1 && (
          <div style={{position: 'absolute', left: 4, top: 7, right: 8, bottom: 7, transformOrigin: '0 50%', transform: `rotateY(${-180 * flip}deg)`, transformStyle: 'preserve-3d'}}>
            <div style={{...face, ...page, background: `linear-gradient(90deg, ${PAPER}, #E6DCC6)`}} />
            <div style={{...face, ...page, transform: 'rotateY(180deg)'}} />
          </div>
        )}
        {/* front cover: outside shows the title, inside is the left page */}
        <div style={{position: 'absolute', inset: 0, transformOrigin: '0 50%', transform: `rotateY(${-178 * open}deg)`, transformStyle: 'preserve-3d'}}>
          <div style={{...face, borderRadius: '4px 10px 10px 4px', background: cover, boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.06)'}}>
            <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 26, background: 'linear-gradient(90deg, rgba(0,0,0,.35), rgba(0,0,0,0))', borderRadius: '4px 0 0 4px'}} />
            <div style={{position: 'absolute', left: 30, right: 22, top: 22, bottom: 22, border: '2px solid rgba(245,241,232,.35)', borderRadius: 6}} />
            <div style={{position: 'absolute', left: 30, right: 22, top: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: C.ink}}>{title}</div>
          </div>
          <div style={{...face, transform: 'rotateY(180deg)'}}>
            <div style={{position: 'absolute', left: 8, top: 7, right: 4, bottom: 7, ...page, borderRadius: '8px 2px 2px 8px', boxShadow: 'inset -14px 0 18px -10px rgba(0,0,0,.28)'}}>{left}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
const GREEN_COVER = 'linear-gradient(140deg, #3A5A45, #253B2E)';
const CORAL_COVER = 'linear-gradient(140deg, #7A4A3B, #4E2E25)';

/** A book standing on a shelf, seen from its spine. */
const Spine: React.FC<{w: number; h: number; cover: string; label: string; style?: React.CSSProperties}> = ({w, h, cover, label, style}) => (
  <div style={{position: 'absolute', width: w, height: h, borderRadius: 4, background: cover, boxShadow: '0 10px 24px rgba(0,0,0,.45), inset 0 0 0 1px rgba(255,255,255,.06)', ...style}}>
    <div style={{position: 'absolute', left: 6, right: 6, top: 14, height: 3, background: 'rgba(245,241,232,.35)'}} />
    <div style={{position: 'absolute', left: 6, right: 6, bottom: 14, height: 3, background: 'rgba(245,241,232,.35)'}} />
    <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', writingMode: 'vertical-rl', fontSize: Math.min(34, w * 0.42), color: C.ink, letterSpacing: 2}}>{label}</div>
  </div>
);

// ================= s16 · Skill is a handbook for a new colleague =================
export const HandbookBoard: React.FC<{scene: Scene}> = ({scene}) => {
  const t = frameToSource(scene, useCurrentFrame());
  const word = ease(t, 260.9, 261.6);
  const qm = pop(t, 261.65, 261.95);
  const drop = interpolate(t, [262.66, 263.25], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const dropE = drop === 0 ? 0 : 1 - Math.pow(1 - drop, 3) + Math.sin(drop * Math.PI) * 0.04;
  const toCover = easeInOut(t, 262.75, 263.35); // "Skill" flies onto the cover
  const sub = ease(t, 263.3, 263.9);
  const open = easeInOut(t, 265.0, 265.75);
  const lw = (i: number) => ease(t, 265.35 + i * 0.32, 265.75 + i * 0.32);
  const rw = (i: number) => ease(t, 266.35 + i * 0.32, 266.75 + i * 0.32);
  const tpl = (i: number) => easeInOut(t, 268.7 + i * 0.25, 269.4 + i * 0.25);
  const ai = easeInOut(t, 270.3, 271.2);
  const flip = (k: number) => clamp01(interpolate(t, [272.45 + k * 0.45, 272.95 + k * 0.45], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  const make = easeInOut(t, 274.0, 274.8);
  const [cx, cy, z] = camAt(t, [[260.8, 960, 470, 1], [263.4, 960, 470, 1], [265.2, 900, 500, 1.18], [268.6, 900, 500, 1.18], [269.6, 1130, 500, 1.05], [271.2, 960, 520, 0.92], [275.2, 960, 520, 0.92]]);
  const BX = 760, BY = 520; // book centre (closed)
  const bookTop = BY - 250 - (1 - dropE) * 800;
  const lines = (items: string[], prog: (i: number) => number, mark: (i: number) => string) => items.map((s, i) => (
    <div key={s} style={{position: 'relative', height: 60, fontSize: 33}}>
      <Write text={`${mark(i)} ${s}`} size={33} progress={prog(i)} color={INK} style={{left: 0, top: 0}} />
    </div>
  ));
  const pageTitle = (s: string, color: string, p: number) => (
    <div style={{position: 'relative', height: 92}}><Write text={s} size={46} progress={p} color={INK} underline={color} style={{left: 0, top: 6}} /></div>
  );
  return (
    <Stage>
      <Camera cx={cx} cy={cy} z={z}>
        {/* "Skill?" written on the board, then the word becomes the book's title */}
        {toCover < 1 && (
          <div style={{position: 'absolute', left: lerp(toCover, 960, BX + 10), top: lerp(toCover, 470, bookTop + 175), transform: `translate(-50%, -50%) scale(${lerp(toCover, 1, 0.42)})`, opacity: 1 - ease(toCover, 0.85, 1)}}>
            <div style={{position: 'relative', fontSize: 170, color: C.ink, whiteSpace: 'nowrap'}}>
              <span style={{clipPath: `inset(-20% ${(1 - word) * 100}% -20% 0)`, display: 'inline-block'}}>Skill</span>
              <span style={{display: 'inline-block', marginLeft: 18, color: C.yellow, transform: `scale(${qm})`, opacity: 1 - toCover}}>？</span>
            </div>
          </div>
        )}
        {/* template cards slide out from the back of the book */}
        {[{s: 263, r: 4, dx: 520, dy: -110}, {s: 284, r: -3, dx: 610, dy: 120}].map((c, i) => {
          const p = tpl(i);
          const made = i === 0 ? make : 0;
          if (p <= 0) return null;
          return (
            <PageCard key={i} file="03" start={c.s} crop={FIRST_CROP} w={lerp(made, 460, 660)}
              style={{left: lerp(made, BX + c.dx * p - 230, 1180), top: lerp(made, BY + c.dy - 130, 330), transform: `rotate(${lerp(made, c.r * p, 0)}deg)`, zIndex: i === 0 ? 3 : 1, opacity: Math.min(1, p * 2)}} />
          );
        })}
        {/* the book */}
        {drop > 0 && (
          <div style={{position: 'absolute', left: BX - 190 - (190 * open), top: bookTop, zIndex: 2, transform: `rotate(${lerp(dropE, -9, -2)}deg)`}}>
            <Book cover={GREEN_COVER} open={open} flip={Math.max(flip(0) < 1 ? flip(0) : 0, flip(1))}
              title={<>
                <div style={{fontSize: 74, lineHeight: 1, opacity: toCover > 0.9 ? 1 : 0}}>Skill</div>
                <div style={{fontSize: 40, marginTop: 26, color: C.green, opacity: sub, clipPath: `inset(0 ${(1 - sub) * 100}% 0 0)`}}>工作手册</div>
              </>}
              left={<div style={{position: 'absolute', left: 34, top: 38, right: 20}}>{pageTitle('活儿怎么干', C.yellow, ease(t, 265.1, 265.5))}{lines(['先定大纲', '再套模板、调版式', '最后加动画'], lw, (i) => '①②③'[i])}</div>}
              right={<div style={{position: 'absolute', left: 34, top: 38, right: 20}}>{pageTitle('按什么要求干', C.green, ease(t, 266.26, 266.66))}{lines(['数字以资料为准', '图要大，字要少', '重点用动画演出来'], rw, () => '·')}</div>}
            />
          </div>
        )}
        {/* the AI: a spark of chalk that flies in and reads the book */}
        {ai > 0 && (() => {
          // flies in, lands on the open pages while they turn, then carries the work over to the slide
          const read = easeInOut(t, 272.3, 272.8);
          const go = make;
          let x = lerp(ai, 120, BX - 40), y = lerp(ai, 160, BY - 330) + Math.sin(ai * Math.PI) * -60;
          x = lerp(read, x, BX + 40); y = lerp(read, y, BY - 40);
          x = lerp(go, x, 1180 + 330); y = lerp(go, y, 330 - 40) - Math.sin(go * Math.PI) * 120;
          const trail = 1 - ease(t, 271.3, 271.9);
          return (
            <>
              <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', zIndex: 4}} width={1} height={1}>
                {trail > 0 && <g opacity={trail}><Stroke d={`M 120 160 Q ${(120 + BX - 40) / 2} ${BY - 520} ${BX - 40} ${BY - 330}`} progress={ai} color={C.yellow} width={3} /></g>}
                <path d="M0 -30 C3 -7 7 -3 30 0 C7 3 3 7 0 30 C-3 7 -7 3 -30 0 C-7 -3 -3 -7 0 -30Z" transform={`translate(${x} ${y}) scale(${1 + 0.15 * Math.sin(t * 9)})`} fill={C.yellow} />
              </svg>
              <Write text="AI" size={44} progress={ease(ai, 0.6, 1)} color={C.yellow} style={{left: x + 34, top: y - 62, zIndex: 4, opacity: 1 - read}} />
            </>
          );
        })()}
      </Camera>
    </Stage>
  );
};

// ================= s18 · Install someone else's Skill =================
export const InstallBoard: React.FC<{scene: Scene}> = ({scene}) => {
  const f = useCurrentFrame();
  const t = frameToSource(scene, f);
  const command = '安装这个 skill：guizang-ppt-skill';
  const turn = easeInOut(t, 293.1, 294.0); // the book turns from its spine to its cover
  const name = ease(t, 294.0, 294.7);
  const away = easeInOut(t, 295.9, 296.6); // book steps aside, the input box comes up
  const bar = easeInOut(t, 296.1, 296.8);
  const count = Math.floor(clamp01((t - 297.25) / (300.4 - 297.25)) * command.length);
  const send = easeInOut(t, 300.7, 301.15);
  const shelf = ease(t, 300.75, 301.2);
  const fly = easeInOut(t, 301.0, 301.7);
  const tick = ease(t, 301.75, 302.2);
  const [cx, cy, z] = camAt(t, [[293.0, 960, 480, 1.1], [295.8, 960, 480, 1.1], [296.7, 960, 540, 1], [300.9, 960, 540, 1], [301.8, 1380, 470, 1.18], [303.3, 1380, 470, 1.18]]);
  // book position: centre → upper left → onto the shelf
  const SHELF = {x0: 1180, x1: 1600, y: 600};
  const bx = fly > 0 ? lerp(fly, 470, 1430) : lerp(away, 960, 470);
  const by = fly > 0 ? lerp(fly, 330, SHELF.y - 190) - Math.sin(fly * Math.PI) * 140 : lerp(away, 470, 330);
  const bs = fly > 0 ? lerp(fly, 0.55, 0.5) : lerp(away, 1, 0.55);
  const asSpine = fly; // closes to a spine as it lands
  const BAR = {w: 1180, h: 118, x: 960 - 590, y: lerp(bar, 1150, 700)};
  return (
    <Stage>
      <Camera cx={cx} cy={cy} z={z}>
        {/* the shelf with the built-in PPT Skill already on it */}
        {shelf > 0 && (
          <div style={{opacity: shelf}}>
            <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1} height={1}>
              <Stroke d={`M ${SHELF.x0} ${SHELF.y} L ${SHELF.x1} ${SHELF.y}`} progress={shelf} color={C.ink} width={5} />
              <Stroke d={`M ${SHELF.x0 + 20} ${SHELF.y} L ${SHELF.x0 + 20} ${SHELF.y + 50} M ${SHELF.x1 - 20} ${SHELF.y} L ${SHELF.x1 - 20} ${SHELF.y + 50}`} progress={ease(shelf, 0.5, 1)} color={C.ink} width={4} />
            </svg>
            <Spine w={92} h={380} cover={GREEN_COVER} label="PPT · 自带" style={{left: 1290, top: SHELF.y - 380, transform: `translateY(${(1 - shelf) * -20}px)`}} />
          </div>
        )}
        {/* the guizang handbook */}
        {asSpine < 1 && (
          <div style={{position: 'absolute', left: bx - 190, top: by - 250, transform: `scale(${bs * (1 - 0.7 * asSpine)}) rotate(${-3 + 6 * asSpine}deg)`, opacity: 1 - ease(asSpine, 0.7, 1)}}>
            <Book cover={CORAL_COVER} yaw={lerp(turn, 75, -8)}
              title={<>
                <div style={{fontSize: 30, color: C.coral, opacity: name}}>做 PPT 的 Skill</div>
                <div style={{fontSize: 44, marginTop: 22, lineHeight: 1.15, textAlign: 'center', clipPath: `inset(0 ${(1 - name) * 100}% 0 0)`}}>guizang<br />ppt-skill</div>
              </>} />
          </div>
        )}
        {asSpine > 0.6 && <Spine w={92} h={380} cover={CORAL_COVER} label="guizang" style={{left: 1386, top: SHELF.y - 380, opacity: ease(asSpine, 0.6, 0.9)}} />}
        {tick > 0 && (
          <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1} height={1}>
            <Stroke d={`M 1410 ${SHELF.y - 440} l 30 34 l 62 -74`} progress={tick} color={C.green} width={8} />
          </svg>
        )}
        {/* the input box */}
        {bar > 0 && (
          <div style={{position: 'absolute', left: BAR.x, top: BAR.y, width: BAR.w, height: BAR.h, borderRadius: 26, background: '#1C1F22', border: `2px solid ${count > 0 && send === 0 ? 'rgba(240,210,106,.7)' : 'rgba(245,241,232,.18)'}`, boxShadow: '0 22px 60px rgba(0,0,0,.5)', opacity: 1 - send}}>
            <div style={{position: 'absolute', left: 44, top: 0, bottom: 0, display: 'flex', alignItems: 'center', fontSize: 46, whiteSpace: 'nowrap', color: C.ink, fontFamily: 'inherit'}}>
              {count === 0 || send > 0 ? <span style={{color: 'rgba(245,241,232,.35)'}}>发消息或创建任务…</span> : command.slice(0, count)}
              {send === 0 && <span style={{opacity: Math.floor(f / 14) % 2 ? 0 : 1, color: C.yellow, marginLeft: 4}}>|</span>}
            </div>
            <div style={{position: 'absolute', right: 26, top: 26, width: 66, height: 66, borderRadius: 33, background: count > 0 ? C.yellow : 'rgba(245,241,232,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${1 + 0.25 * Math.sin(Math.PI * send)})`}}>
              <svg width={30} height={30} viewBox="0 0 34 34"><path d="M17 28 V6 M7 15 L17 5 L27 15" stroke="#1C1F22" strokeWidth={4.5} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
          </div>
        )}
        {/* the sent message flies to the book */}
        {send > 0 && send < 1 && (
          <div style={{position: 'absolute', left: lerp(send, BAR.x + 44, 640), top: lerp(send, BAR.y + 30, 300), fontSize: 46 * (1 - 0.5 * send), color: C.ink, opacity: 1 - send, whiteSpace: 'nowrap'}}>{command}</div>
        )}
      </Camera>
    </Stage>
  );
};

// ================= s44 · Next to the one-sentence version =================
const STACK_ONE = [{s: 22}, {s: 9.5}, {s: 8}];
export const CompareStacks: React.FC<{scene: Scene}> = ({scene}) => {
  const t = frameToSource(scene, useCurrentFrame());
  const L = {x: 510, y: 480}, R = {x: 1410, y: 480}, W = 760;
  const leftIn = (i: number) => ease(t, 638.9 + i * 0.12, 639.5 + i * 0.12);
  const rightIn = (i: number) => ease(t, 641.65 + i * 0.12, 642.25 + i * 0.12);
  const ring = ease(t, 644.3, 645.0);
  const tick = ease(t, 652.6, 653.2);
  const [cx, cy, z] = camAt(t, [[638.8, 960, 520, 1], [643.3, 960, 520, 1], [644.4, 620, 470, 1.5], [646.0, 620, 470, 1.5], [647.2, 1410, 480, 1.3], [651.9, 1410, 480, 1.3], [653.0, 960, 520, 1], [655, 960, 520, 1]]);
  // the right stack: the top page leaves as the next one plays
  const beats: Beat[] = [{at: 646.63, start: 22.45, len: 1.15}, {at: 649.05, start: 63.25, len: 1.35}, {at: 650.55, start: 69.7, len: 2.0}];
  const leave = (k: number) => easeInOut(t, beats[k + 1].at - 0.25, beats[k + 1].at + 0.2);
  const H = Math.round((W * 9) / 16);
  return (
    <Stage>
      <Camera cx={cx} cy={cy} z={z}>
        {STACK_ONE.map((p, i) => {
          const k = STACK_ONE.length - 1 - i; // draw bottom first
          const q = leftIn(k);
          if (q <= 0) return null;
          return <PageCard key={k} file="02" start={STACK_ONE[k].s} crop={ONE_LINE_CROP} w={W} style={{left: L.x - W / 2 + k * 14, top: L.y - H / 2 + k * 16 + (1 - q) * -60, transform: `rotate(${[-2, 2.5, -4][k]}deg)`, opacity: q}} />;
        })}
        {[2, 1, 0].map((k) => {
          const q = rightIn(k);
          if (q <= 0) return null;
          const gone = k < 2 ? leave(k) : 0;
          const live = t >= (k === 0 ? 646.5 : beats[k].at - 0.3);
          return (
            <PageCard key={k} file="15" start={beats[k].start} crop={[0, 0, 1, 1]} w={W}
              style={{left: R.x - W / 2 + k * 14 + gone * 120, top: R.y - H / 2 + k * 16 + (1 - q) * -60 - gone * 520, transform: `rotate(${[2, -2.5, 3.5][k] + gone * 12}deg)`, opacity: q * (1 - ease(gone, 0.6, 1))}}>
              {live ? <ClipTrack scene={scene} file="15" beats={[beats[k]]} poster={beats[k].start} /> : undefined}
            </PageCard>
          );
        })}
        <Write text="一句话" size={52} progress={ease(t, 639.4, 640.2)} color={C.coral} style={{left: L.x - 80, top: L.y + H / 2 + 40, opacity: 1 - clamp01((z - 1.05) / 0.15)}} />
        <Write text="一步步提要求" size={52} progress={ease(t, 642.2, 643.0)} color={C.green} style={{left: R.x - 160, top: R.y + H / 2 + 40, opacity: 1 - clamp01((z - 1.05) / 0.15)}} />
        {ring > 0 && (
          <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1} height={1}>
            <Stroke d={chalkEllipse(L.x - W / 2 + W * 0.79, L.y - H / 2 + H * 0.44, W * 0.2, H * 0.42)} progress={ring} color={C.coral} width={5} />
          </svg>
        )}
        <Write text="手机照片" size={40} progress={ease(t, 644.8, 645.4)} color={C.coral} style={{left: L.x + W / 2 - 150, top: L.y - H / 2 - 66}} />
        {tick > 0 && (
          <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1} height={1}>
            <Stroke d={`M ${R.x - 150} ${R.y - H / 2 - 50} l 26 30 l 56 -70`} progress={tick} color={C.yellow} width={8} />
          </svg>
        )}
        <Write text="拿得出手" size={52} progress={ease(t, 653.0, 653.7)} color={C.yellow} style={{left: R.x - 50, top: R.y - H / 2 - 112}} />
      </Camera>
    </Stage>
  );
};

// ================= s52 · Same sentence, with and without a Skill =================
export const CompareSkillPaths: React.FC<{scene: Scene}> = ({scene}) => {
  const t = frameToSource(scene, useCurrentFrame());
  const SENT = {x: 960, y: 190};
  const LR = {x: 480, y: 660}, RR = {x: 1440, y: 660}, W = 680;
  const H = Math.round((W * 9) / 16);
  const note = ease(t, 714.3, 715.1);
  const paths = ease(t, 716.31, 717.2);
  const leftRes = ease(t, 717.5, 718.2);
  const wobble = t > 717.5 ? Math.sin((t - 717.5) * 7) * 2 * Math.max(0, 1 - (t - 717.5) / 3) : 0;
  const q = ease(t, 718.3, 718.8);
  const book = easeInOut(t, 723.33, 724.2);
  const slide = easeInOut(t, 724.9, 725.9);
  const rightRes = ease(t, 725.6, 726.3);
  const beats: Beat[] = [{at: 726.37, start: 43.0, len: 1.9}, {at: 728.29, start: 35.0, len: 3.6}, {at: 731.9, start: 47.0, len: 2.6}];
  const [cx, cy, z] = camAt(t, [[714.2, 960, 420, 1.05], [716.9, 960, 420, 1.05], [718.0, 760, 500, 1.08], [722.9, 760, 500, 1.08], [724.2, 1100, 460, 1.04], [726.3, 1320, 600, 1.28], [733.8, 1320, 600, 1.28], [734.9, 960, 520, 0.98], [737, 960, 520, 0.98]]);
  const bookX = slide > 0 ? lerp(slide, SENT.x + 330, RR.x + W / 2 - 40) : lerp(book, 1500, SENT.x + 330);
  const bookY = slide > 0 ? lerp(slide, SENT.y - 10, RR.y - H / 2 - 120) : lerp(book, -200, SENT.y - 10);
  return (
    <Stage>
      <Camera cx={cx} cy={cy} z={z}>
        {/* the sentence, as a note pinned to the board */}
        <div style={{position: 'absolute', left: SENT.x - 300, top: SENT.y - 60, width: 600, height: 120, background: PAPER, borderRadius: 10, transform: `rotate(-1.5deg) translateY(${(1 - note) * -30}px)`, opacity: note, boxShadow: '0 14px 34px rgba(0,0,0,.45)'}}>
          <Write text="帮我做个产品宣传 PPT" size={48} progress={ease(note, 0.2, 1)} color={INK} style={{left: 48, top: 30}} />
        </div>
        <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1} height={1}>
          <Stroke d={`M ${SENT.x - 120} ${SENT.y + 70} C ${SENT.x - 260} ${SENT.y + 200} ${LR.x + 60} ${LR.y - H / 2 - 160} ${LR.x} ${LR.y - H / 2 - 30}`} progress={paths} color={C.coral} width={4} />
          <Stroke d={`M ${SENT.x + 120} ${SENT.y + 70} C ${SENT.x + 260} ${SENT.y + 200} ${RR.x - 60} ${RR.y - H / 2 - 160} ${RR.x} ${RR.y - H / 2 - 30}`} progress={paths} color={C.green} width={4} />
        </svg>
        {/* left: AI with only the sentence */}
        {leftRes > 0 && (
          <PageCard file="02" start={22} crop={ONE_LINE_CROP} w={W} dim={0.12} style={{left: LR.x - W / 2, top: LR.y - H / 2 + (1 - leftRes) * -80, transform: `rotate(${-3 + wobble}deg)`, opacity: leftRes}} />
        )}
        <div style={{position: 'absolute', left: LR.x - 230, top: LR.y - H / 2 - 150, fontSize: 96, color: C.coral, opacity: q, transform: `rotate(-10deg) scale(${0.6 + 0.4 * q})`}}>?</div>
        <Write text="随意发挥" size={46} progress={ease(t, 719.5, 720.3)} color={C.coral} style={{left: LR.x - 100, top: LR.y + H / 2 + 30}} />
        {/* right: the same sentence with the Skill handbook */}
        {book > 0 && (
          <div style={{position: 'absolute', left: bookX - 95, top: bookY - 125, transform: `scale(.5) rotate(${lerp(book, 25, 6)}deg)`, transformOrigin: '0 0'}}>
            <Book cover={GREEN_COVER} title={<><div style={{fontSize: 80}}>Skill</div><div style={{fontSize: 40, marginTop: 20, color: C.green}}>要求都在里面</div></>} />
          </div>
        )}
        {rightRes > 0 && (
          <PageCard file="17" start={43} crop={[0, 0, 1, 1]} w={W} style={{left: RR.x - W / 2, top: RR.y - H / 2 + (1 - rightRes) * -80, opacity: rightRes}}>
            <ClipTrack scene={scene} file="17" beats={beats} poster={19} />
          </PageCard>
        )}
        <Write text="照着做" size={46} progress={ease(t, 725.43, 726.1)} color={C.green} style={{left: RR.x - 70, top: RR.y + H / 2 + 30}} />
      </Camera>
    </Stage>
  );
};

// ================= s53 · Recap: the five layers once more =================
const RECAP = [
  {at: 742.39, desc: 743.43, text: '先把内容理清楚'},
  {at: 744.69, desc: 745.6, text: '把风格统一起来'},
  {at: 747.25, desc: 748.19, text: '提升设计感'},
  {at: 750.25, desc: 751.45, text: '把重点突出出来'},
  {at: 753.27, desc: 754.87, text: '把要求存下来'},
];
export const RecapLayers: React.FC<{scene: Scene}> = ({scene}) => {
  const t = frameToSource(scene, useCurrentFrame());
  const build = (i: number) => ease(t, 737.5 + i * 0.35, 738.0 + i * 0.35);
  const cur = RECAP.filter((r) => t >= r.at).length - 1;
  const next = easeInOut(t, 756.23, 757.0);
  const open = [1, 1, 1, 1];
  // right-hand focus panel
  const FX = 1360, FY = 430, FW = 780, FH = Math.round((FW * 9) / 16);
  const CLEAN = [null, {file: '03', start: 263, crop: FIRST_CROP}, {file: '12', start: 160, crop: PRICE_CROP}, null, null];
  const sheetCrop = (i: number) => ({...SHEETS[i], ...(CLEAN[i] ?? {})});
  return (
    <Stage>
      {/* the stack, pushed to the left */}
      <div style={{position: 'absolute', left: -60, top: 10, width: 1920, height: 1080, transform: 'scale(.86)', transformOrigin: '0 0'}}>
        <div style={{position: 'absolute', left: STACK.left, top: STACK.top, width: SW, height: SH, perspective: 2400}}>
          {SHEETS.map((_, i) => {
            const b = build(i);
            if (b <= 0) return null;
            const on = i === cur && next === 0;
            return <SheetView key={i} i={i} y={sheetY(i, open) - (1 - b) * 260 - (on ? 30 : 0)} flat={0} dx={on ? 60 : 0} dim={cur >= 0 && !on ? 0.55 : 0} opacity={b} outline={on ? SHEETS[i].color : undefined} />;
          })}
        </div>
      </div>
      <Write text="5 步" size={110} progress={ease(t, 739.9, 740.6)} color={C.yellow} underline={C.yellow} style={{left: 1200, top: 380, opacity: 1 - ease(t, 742.1, 742.5)}} />
      {/* the step being named, large on the right */}
      {RECAP.map((r, i) => {
        const inP = easeInOut(t, r.at, r.at + 0.5);
        const outP = i < RECAP.length - 1 ? easeInOut(t, RECAP[i + 1].at - 0.1, RECAP[i + 1].at + 0.35) : next;
        if (inP <= 0 || outP >= 1) return null;
        const sh = sheetCrop(i);
        const x = FX - FW / 2 + (1 - inP) * -260 + outP * 120;
        return (
          <div key={i} style={{opacity: inP * (1 - outP)}}>
            <Write text={`${'①②③④⑤'[i]} ${sh.name}`} size={64} progress={ease(t, r.at + 0.1, r.at + 0.6)} color={sh.color} style={{left: FX - FW / 2, top: FY - FH / 2 - 120}} />
            {sh.file ? (
              <PageCard file={sh.file} start={sh.start!} crop={sh.crop!} w={FW} style={{left: x, top: FY - FH / 2, transform: `rotate(${(1 - inP) * -4}deg)`}} />
            ) : (
              <div style={{position: 'absolute', left: x + FW / 2 - 190, top: FY - 250}}>
                <Book cover={GREEN_COVER} title={<><div style={{fontSize: 74}}>Skill</div><div style={{fontSize: 36, marginTop: 20, color: C.green}}>做法都在里面</div></>} />
              </div>
            )}
            <Write text={r.text} size={52} progress={ease(t, r.desc, r.desc + 0.7)} color={C.ink} style={{left: FX - FW / 2, top: FY + FH / 2 + 40}} />
          </div>
        );
      })}
      {/* "下次直接调用": the Skill makes the power bank deck */}
      {next > 0 && (
        <>
          <div style={{position: 'absolute', left: FX - FW / 2 - 150 + (1 - next) * 200, top: FY - 170, transform: 'scale(.6)', transformOrigin: '0 0', opacity: next}}>
            <Book cover={GREEN_COVER} title={<div style={{fontSize: 74}}>Skill</div>} />
          </div>
          <Arrow x1={FX - FW / 2 + 92} y1={FY + 20} x2={FX - FW / 2 + 152} y2={FY + 20} progress={ease(next, 0.3, 1)} color={C.yellow} bend={-6} />
          <PageCard file="17" start={19} crop={[0, 0, 1, 1]} w={FW * 0.78} style={{left: FX - FW / 2 + 175, top: FY - (FH * 0.78) / 2, opacity: ease(next, 0.4, 1), transform: `translateX(${(1 - next) * 60}px)`}} />
        </>
      )}
    </Stage>
  );
};
