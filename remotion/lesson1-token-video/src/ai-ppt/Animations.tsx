import React from 'react';
import {AbsoluteFill, Freeze, OffthreadVideo, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {Scene, FPS, frameToSource, sourceToFrame} from './timeline';
import {Board, C, ChalkArrow, ChalkRect, ChalkUnderline, FONT, ease, easeInOut, lerp, roughEllipsePath} from './design';

const screen = (id: string) => staticFile(`ai-ppt/screen-${id}.mp4`);

/** A recording cropped to a normalized region [x, y, w, h]. */
export const CropVideo: React.FC<{file: string; start: number; crop?: number[]; still?: boolean; rate?: number}> = ({file, start, crop = [0, 0, 1, 1], still = false, rate = 1}) => {
  const [x, y, w, h] = crop;
  const v = <OffthreadVideo src={screen(file)} startFrom={Math.round(start * FPS)} muted volume={0} playbackRate={rate} style={{position: 'absolute', width: `${100 / w}%`, height: `${100 / h}%`, left: `${(-x / w) * 100}%`, top: `${(-y / h) * 100}%`, objectFit: 'fill'}} />;
  return <AbsoluteFill style={{overflow: 'hidden', background: '#000'}}>{still ? <Freeze frame={0}>{v}</Freeze> : v}</AbsoluteFill>;
};

/** Framed media card on the board: white chalk frame, label underneath. */
const MediaCard: React.FC<{x: number; y: number; w: number; h: number; active: boolean; dimmed: boolean; title: string; sub?: string; k: string; color: string; children: React.ReactNode; enter: number}> = ({x, y, w, h, active, dimmed, title, sub, k, color, children, enter}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, opacity: enter * (dimmed ? 0.42 : 1), transform: `translateY(${(1 - enter) * 26}px) scale(${active ? 1.02 : 1})`, transition: 'none', transformOrigin: '50% 40%'}}>
    <div style={{position: 'relative', width: w, height: h, borderRadius: 8, overflow: 'hidden', boxShadow: '0 18px 40px rgba(0,0,0,.45)'}}>{children}</div>
    <ChalkRect w={w + 28} h={h + 28} k={k} color={active ? color : C.inkFaint} width={active ? 4 : 2.6} progress={enter} style={{left: -14, top: -14}} />
    <div className="chalk" style={{marginTop: 36, textAlign: 'center', fontSize: 44, color: active ? color : C.ink}}>{title}</div>
    {sub && <div className="chalk" style={{marginTop: 8, textAlign: 'center', fontSize: 28, color: C.inkSoft}}>{sub}</div>}
  </div>
);

// ---------------- Opening: presenter in the middle, both real results beside him ----------------
export const Opening: React.FC<{scene: Scene}> = ({scene}) => {
  const f = useCurrentFrame();
  const t = frameToSource(scene, f);
  const reveal = sourceToFrame(scene, 63.1);
  const split = easeInOut(f, reveal, reveal + 18);
  const rightOn = t >= 67.5;
  const leftEnter = ease(f, reveal + 6, reveal + 22);
  const rightEnter = ease(f, reveal + 12, reveal + 28);
  // Presenter strip: full frame → centre column 460 px wide.
  const stripW = lerp(split, 1920, 440);
  const stripX = (1920 - stripW) / 2;
  const shift = lerp(split, 0, -170); // keeps his face centred in the strip
  return (
    <Board>
      <Sequence from={reveal} premountFor={30}>
        <MediaCard x={40} y={250} w={660} h={371} k="op-l" color={C.ink} active={!rightOn} dimmed={rightOn} enter={leftEnter} title="只发一句话" sub="手机原图 · 没有动画">
          <CropVideo file="opening-left" start={0} crop={[0.585, 0.35, 0.4, 0.435]} rate={Math.min(1, 6.4 / ((scene.durationInFrames - reveal) / FPS))} />
        </MediaCard>
        <MediaCard x={1220} y={250} w={660} h={371} k="op-r" color={C.yellow} active={rightOn} dimmed={!rightOn && rightEnter > 0.99 && f < sourceToFrame(scene, 66.4)} enter={rightEnter} title="一步步提要求" sub="产品大图 · 动画演出重点">
          <CropVideo file="opening-right" start={0} rate={Math.min(1, 6.35 / ((scene.durationInFrames - reveal) / FPS))} />
        </MediaCard>
      </Sequence>
      <div style={{position: 'absolute', left: stripX, top: 0, width: stripW, height: 1080, overflow: 'hidden', borderRadius: split * 6, boxShadow: split > 0 ? '0 0 50px rgba(0,0,0,.55)' : undefined}}>
        <div style={{position: 'absolute', left: -stripX + shift, top: 0, width: 1920, height: 1080}}>
          <OffthreadVideo src={staticFile('ai-ppt/presenter-opening.mp4')} muted volume={0} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        </div>
      </div>
    </Board>
  );
};

// ---------------- Two-version comparison ----------------
export const Compare: React.FC<{scene: Scene; mode: string}> = ({scene, mode}) => {
  const f = useCurrentFrame();
  const t = frameToSource(scene, f);
  const power = mode === 'compare-power';
  const rightActive = power ? t >= 723.33 : t >= 646.63;
  const leftActive = power ? t >= 717.4 && t < 723.33 : t >= 643.2 && t < 646.63;
  const both = power ? t >= 734.65 : t >= 652.4;
  const step = Math.floor(f / 120);
  const rightStart = power ? [17, 27, 32, 37, 47][step % 5] : [22, 62.5, 69.5][step % 3];
  const enter = ease(f, 4, 22);
  const title = power ? '同样一句话，要求存在 Skill 里' : '同一份资料，两种做法';
  return (
    <Board>
      <div className="chalk" style={{position: 'absolute', left: 0, right: 0, top: 78, textAlign: 'center', fontSize: 62, opacity: ease(f, 0, 14)}}>{title}</div>
      <ChalkUnderline w={420} color={C.blue} progress={ease(f, 8, 26)} style={{left: 750, top: 160}} />
      <MediaCard x={110} y={250} w={800} h={450} k="cmp-l" color={C.ink} active={both || leftActive} dimmed={!both && rightActive} enter={enter} title="只发一句话" sub="耳机 · 手机原图 · 没有动画">
        <CropVideo file="02" start={25} crop={[0.585, 0.35, 0.4, 0.435]} still />
      </MediaCard>
      <MediaCard x={1010} y={250} w={800} h={450} k="cmp-r" color={C.yellow} active={both || rightActive} dimmed={!both && leftActive} enter={ease(f, 10, 28)} title={power ? '调用自己的 Skill' : '一步步提要求'} sub={power ? '充电宝 · 版式和动画跟着新产品变' : '耳机 · 产品大图 · 动画演出重点'}>
        <Sequence key={step} from={step * 120} durationInFrames={120}><CropVideo file={power ? '17' : '15'} start={rightStart} /></Sequence>
      </MediaCard>
      <div className="chalk" style={{position: 'absolute', left: 925, top: 445, width: 70, textAlign: 'center', fontSize: 40, color: C.inkSoft, opacity: enter}}>vs</div>
    </Board>
  );
};

// ---------------- Skill = a work handbook ----------------
const Person: React.FC<{color: string; progress: number}> = ({color, progress}) => (
  <svg width="220" height="300" viewBox="-110 -160 220 300" style={{overflow: 'visible'}}>
    <g fill="none" stroke={color} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" pathLength={1}>
      <circle cx="0" cy="-92" r="46" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - progress} />
      <path d="M-88 120 Q-88 -10 0 -18 Q88 -10 88 120" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - progress} />
      <path d="M-16 -80 Q0 -70 16 -80" strokeWidth={4} opacity={progress} />
    </g>
  </svg>
);
const Robot: React.FC<{color: string; progress: number}> = ({color, progress}) => (
  <svg width="220" height="300" viewBox="-110 -160 220 300" style={{overflow: 'visible'}}>
    <g fill="none" stroke={color} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round">
      <rect x="-56" y="-140" width="112" height="96" rx="26" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - progress} />
      <path d="M0 -140 V-160" opacity={progress} /><circle cx="0" cy="-166" r="7" opacity={progress} />
      <circle cx="-22" cy="-94" r="8" fill={color} opacity={progress} /><circle cx="22" cy="-94" r="8" fill={color} opacity={progress} />
      <path d="M-88 120 Q-88 -10 0 -18 Q88 -10 88 120" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - progress} />
    </g>
  </svg>
);

export const Handbook: React.FC<{scene: Scene}> = ({scene}) => {
  const f = useCurrentFrame();
  const t = frameToSource(scene, f);
  const title = ease(t, 260.84, 261.5);
  const bookIn = ease(t, 262.66, 263.4);
  const open = easeInOut(t, 263.6, 264.6);
  const howRow = (i: number) => ease(t, 265.02 + i * 0.3, 265.5 + i * 0.3);
  const reqRow = (i: number) => ease(t, 266.26 + i * 0.3, 266.76 + i * 0.3);
  const tpl = (i: number) => ease(t, 268.7 + i * 0.22, 269.4 + i * 0.22);
  const toAi = easeInOut(t, 270.24, 270.9);
  const reading = ease(t, 272.4, 273.2);
  const done = ease(t, 273.98, 274.6);
  const bookX = 700, bookY = 300, pageW = 470, pageH = 470;
  return (
    <Board>
      <div className="chalk" style={{position: 'absolute', left: 120, top: 92, fontSize: 70, opacity: title, transform: `translateY(${(1 - title) * 12}px)`}}>Skill，就像一本工作手册</div>
      <ChalkUnderline w={360} color={C.yellow} progress={ease(t, 261.8, 262.6)} style={{left: 520, top: 184}} />
      {/* who reads the handbook */}
      <div style={{position: 'absolute', left: 190, top: 400}}>
        <div style={{position: 'absolute', opacity: 1 - toAi}}><Person color={C.ink} progress={ease(t, 262.8, 263.8)} /></div>
        <div style={{position: 'absolute', opacity: toAi}}><Robot color={C.blue} progress={toAi} /></div>
        <div className="chalk" style={{position: 'absolute', top: 310, width: 220, textAlign: 'center', fontSize: 44, color: toAi > 0.5 ? C.blue : C.ink, opacity: ease(t, 263, 263.8)}}>{toAi > 0.5 ? 'AI' : '新同事'}</div>
      </div>
      <ChalkArrow x={440} y={540} len={220} color={C.yellow} progress={reading} />
      <div className="chalk" style={{position: 'absolute', left: 452, top: 488, fontSize: 30, color: C.yellow, opacity: reading}}>翻开手册</div>
      {/* the book */}
      <div style={{position: 'absolute', left: bookX, top: bookY, width: pageW * 2, height: pageH, opacity: bookIn, transform: `translateY(${(1 - bookIn) * 30}px)`, perspective: 1800}}>
        {/* inside pages */}
        <div style={{position: 'absolute', inset: 0, opacity: open}}>
          <ChalkRect w={pageW * 2} h={pageH} k="book" color={C.ink} progress={open} />
          <svg style={{position: 'absolute', left: pageW - 2, top: 18}} width={6} height={pageH - 36}><path d={`M3 0 Q1 ${pageH / 2} 3 ${pageH - 36}`} stroke={C.inkSoft} strokeWidth={3} fill="none" /></svg>
          <div style={{position: 'absolute', left: 50, top: 46, width: pageW - 90}}>
            <div className="chalk" style={{fontSize: 44, color: C.yellow}}>活儿怎么干</div>
            {['先定大纲', '再套模板、调版式', '最后加动画'].map((s, i) => <div key={s} className="chalk" style={{fontSize: 34, marginTop: 30, opacity: howRow(i), transform: `translateX(${(1 - howRow(i)) * -12}px)`}}><span style={{color: C.yellow}}>{i + 1}.</span> {s}</div>)}
          </div>
          <div style={{position: 'absolute', left: pageW + 50, top: 46, width: pageW - 90}}>
            <div className="chalk" style={{fontSize: 44, color: C.blue}}>按什么要求干</div>
            {['数字以资料为准', '图要大，字要少', '重点用动画演出来'].map((s, i) => <div key={s} className="chalk" style={{fontSize: 34, marginTop: 30, opacity: reqRow(i), transform: `translateX(${(1 - reqRow(i)) * -12}px)`}}><span style={{color: C.blue}}>✓</span> {s}</div>)}
          </div>
        </div>
        {/* cover, flips open to the left */}
        <div style={{position: 'absolute', left: pageW, top: 0, width: pageW, height: pageH, transformOrigin: '0 50%', transform: `rotateY(${-open * 180}deg)`, backfaceVisibility: 'hidden', opacity: 1 - ease(open, 0.55, 0.62)}}>
          <AbsoluteFill style={{background: 'rgba(36,39,42,.96)', borderRadius: 10}} />
          <ChalkRect w={pageW} h={pageH} k="cover" color={C.blue} progress={bookIn} />
          <div className="chalk" style={{position: 'absolute', top: 120, width: '100%', textAlign: 'center', fontSize: 30, letterSpacing: 8, color: C.blue}}>SKILL</div>
          <div className="chalk" style={{position: 'absolute', top: 180, width: '100%', textAlign: 'center', fontSize: 76}}>工作手册</div>
          <div className="chalk" style={{position: 'absolute', top: 300, width: '100%', textAlign: 'center', fontSize: 30, color: C.inkSoft}}>做法 · 要求 · 模板</div>
        </div>
        {/* templates tucked in the book */}
        {[0, 1, 2].map((i) => {
          const p = tpl(i);
          const col = [C.yellow, C.blue, C.pink][i];
          return (
            <div key={i} style={{position: 'absolute', left: pageW * 2 - 130 + i * 18, top: 60 + i * 120, width: 190, height: 112, opacity: p, transform: `translateX(${p * (90 + i * 10)}px) rotate(${(i - 1) * 5}deg)`}}>
              <AbsoluteFill style={{background: 'rgba(29,32,35,.97)', borderRadius: 6}} />
              <ChalkRect w={190} h={112} k={`tpl${i}`} color={col} progress={p} width={3} />
              <div className="chalk" style={{position: 'absolute', left: 18, top: 12, fontSize: 26, color: col}}>模板 {i + 1}</div>
              <div style={{position: 'absolute', left: 18, right: 18, top: 56, height: 3, background: C.inkFaint}} />
              <div style={{position: 'absolute', left: 18, width: 90, top: 74, height: 3, background: C.inkFaint}} />
            </div>
          );
        })}
      </div>
      <div className="chalk" style={{position: 'absolute', left: bookX, top: bookY + pageH + 60, fontSize: 42, color: C.green, opacity: done}}>✓ 照着手册做，就行了</div>
    </Board>
  );
};

// ---------------- Five steps ----------------
const STEP_NAMES = ['定大纲', '套模板', '调版式', '加动画', '做 Skill'];
const STEP_DESC = ['先把内容理清楚', '把风格统一起来', '提升设计感', '把重点突出出来', '把要求存下来'];

/** Five chips over the presenter (s06). */
export const StepsStrip: React.FC<{scene: Scene}> = ({scene}) => {
  const t = frameToSource(scene, useCurrentFrame());
  const triggers = [161.99, 162.8, 163.75, 164.5, 165.21];
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 46, display: 'flex', justifyContent: 'center', gap: 18}}>
      {STEP_NAMES.map((n, i) => {
        const p = ease(t, triggers[i], triggers[i] + 0.35);
        return (
          <div key={n} className="chalk" style={{opacity: p, transform: `translateY(${(1 - p) * -16}px)`, padding: '14px 30px 18px', borderRadius: 12, background: 'rgba(29,32,35,.93)', boxShadow: '0 10px 24px rgba(0,0,0,.3)', fontSize: 40, color: C.ink, position: 'relative'}}>
            <span style={{color: C.yellow, marginRight: 12}}>{i + 1}</span>{n}
          </div>
        );
      })}
    </div>
  );
};

export const Steps: React.FC<{scene: Scene}> = ({scene}) => {
  const f = useCurrentFrame();
  const t = frameToSource(scene, f);
  const triggers = [742.39, 744.69, 747.25, 750.25, 753.27];
  const boxW = 278, boxH = 150, gap = 74, x0 = (1920 - (boxW * 5 + gap * 4)) / 2, y0 = 420;
  const title = ease(t, 737.4, 738.2);
  const ghost = ease(t, 739.85, 740.8);
  return (
    <Board>
      <div className="chalk" style={{position: 'absolute', left: 0, right: 0, top: 150, textAlign: 'center', fontSize: 66, opacity: title}}>五步，做一份新品宣传 PPT</div>
      <ChalkUnderline w={300} color={C.yellow} progress={ease(t, 740.2, 741.2)} style={{left: 810, top: 236}} />
      {STEP_NAMES.map((n, i) => {
        const on = ease(t, triggers[i], triggers[i] + 0.45);
        const desc = ease(t, triggers[i] + 0.6, triggers[i] + 1.1);
        const x = x0 + i * (boxW + gap);
        const col = i === 4 ? C.yellow : C.ink;
        return (
          <React.Fragment key={n}>
            <div style={{position: 'absolute', left: x, top: y0, width: boxW, height: boxH, opacity: Math.max(ghost * 0.32, on), transform: `scale(${1 + 0.06 * Math.sin(Math.PI * Math.min(1, on))})`}}>
              <ChalkRect w={boxW} h={boxH} k={`step${i}`} color={on > 0 ? col : C.inkSoft} progress={on > 0 ? on : ghost} width={on > 0 ? 3.8 : 2.2} />
              <div className="chalk" style={{position: 'absolute', top: -58, width: '100%', textAlign: 'center', fontSize: 34, color: C.yellow}}>0{i + 1}</div>
              <div className="chalk" style={{position: 'absolute', top: 0, height: boxH, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 54, color: col}}>{n}</div>
            </div>
            <div className="chalk" style={{position: 'absolute', left: x - 20, top: y0 + boxH + 34, width: boxW + 40, textAlign: 'center', fontSize: 31, color: C.inkSoft, opacity: desc, transform: `translateY(${(1 - desc) * 10}px)`}}>{STEP_DESC[i]}</div>
            {i < 4 && <ChalkArrow x={x + boxW + 10} y={y0 + boxH / 2 - 20} len={gap - 20} color={C.blue} progress={ease(t, triggers[i] + 0.3, triggers[i] + 0.8) * ghost} />}
          </React.Fragment>
        );
      })}
      <div className="chalk" style={{position: 'absolute', left: 0, right: 0, top: 790, textAlign: 'center', fontSize: 38, color: C.yellow, opacity: ease(t, 755.6, 756.4)}}>下次直接调用</div>
    </Board>
  );
};

// ---------------- Install a Skill by typing one line ----------------
export const InstallCard: React.FC<{scene: Scene}> = ({scene}) => {
  const f = useCurrentFrame();
  const t = frameToSource(scene, f);
  const command = '安装这个 skill：guizang-ppt-skill';
  const count = Math.floor(ease(t, 297.3, 300.4) * command.length);
  const enter = ease(f, 0, 16);
  const sent = ease(t, 300.7, 301.1);
  const installed = ease(t, 301.5, 302.2);
  const boxW = 1400, boxH = 190, bx = 260, by = 500;
  return (
    <Board>
      <div className="chalk" style={{position: 'absolute', left: bx, top: 250, fontSize: 64, opacity: enter}}>安装别人做好的 Skill</div>
      <div className="chalk" style={{position: 'absolute', left: bx, top: 350, fontSize: 36, color: C.blue, opacity: ease(t, 294, 294.8)}}>推荐：guizang-ppt-skill</div>
      <div style={{position: 'absolute', left: bx, top: by, width: boxW, height: boxH, opacity: enter}}>
        <AbsoluteFill style={{background: 'rgba(16,18,20,.55)', borderRadius: 18}} />
        <ChalkRect w={boxW} h={boxH} k="input" color={sent > 0 ? C.blue : C.ink} progress={enter} />
        <div style={{position: 'absolute', left: 56, top: 0, height: boxH, display: 'flex', alignItems: 'center', fontFamily: FONT.ui, fontSize: 52, color: C.ink, opacity: 1 - sent * 0.5}}>
          {count === 0 ? <span style={{color: C.inkFaint}}>发消息或创建任务…</span> : command.slice(0, count)}
          <span style={{opacity: sent > 0 ? 0 : Math.floor(f / 14) % 2 ? 0 : 1, color: C.yellow, marginLeft: 4}}>|</span>
        </div>
        <div style={{position: 'absolute', right: 34, top: boxH / 2 - 44, width: 88, height: 88}}>
          <svg width="88" height="88" style={{position: 'absolute', overflow: 'visible'}}>
            <circle cx="44" cy="44" r="38" fill={sent > 0 ? C.blue : 'none'} opacity={sent > 0 ? 0.9 : 1} />
            <path d={roughEllipsePath(44, 44, 38, 38, 'send')} stroke={C.blue} strokeWidth={3.4} fill="none" />
            <path d="M44 62 V28 M30 41 L44 27 L58 41" stroke={sent > 0 ? C.board : C.blue} strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      <div className="chalk" style={{position: 'absolute', left: bx, top: by + boxH + 70, fontSize: 44, color: C.green, opacity: installed, transform: `translateY(${(1 - installed) * 10}px)`}}>✓ 发出去，它就能自己安装好</div>
    </Board>
  );
};
