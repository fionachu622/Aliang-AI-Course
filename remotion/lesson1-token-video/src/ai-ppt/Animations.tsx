import React from 'react';
import {AbsoluteFill, Freeze, OffthreadVideo, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {Scene, FPS, frameToSource, sourceToFrame} from './timeline';
import {C, Card, FONT, Stage, ease, easeInOut, lerp, pop} from './design';

const screen = (id: string) => staticFile(`ai-ppt/screen-${id}.mp4`);

/** A recording cropped to a normalized region [x, y, w, h]. */
export const CropVideo: React.FC<{file: string; start: number; crop?: number[]; still?: boolean; rate?: number}> = ({file, start, crop = [0, 0, 1, 1], still = false, rate = 1}) => {
  const [x, y, w, h] = crop;
  const v = <OffthreadVideo pauseWhenBuffering src={screen(file)} startFrom={Math.round(start * FPS)} muted volume={0} playbackRate={rate} style={{position: 'absolute', width: `${100 / w}%`, height: `${100 / h}%`, left: `${(-x / w) * 100}%`, top: `${(-y / h) * 100}%`, objectFit: 'fill'}} />;
  return <AbsoluteFill style={{overflow: 'hidden', background: '#000'}}>{still ? <Freeze frame={0}>{v}</Freeze> : v}</AbsoluteFill>;
};

/** Pill caption under a card. */
const Pill: React.FC<{text: string; tone: 'grey' | 'blue' | 'dark'; style?: React.CSSProperties}> = ({text, tone, style}) => {
  const t = {grey: {bg: '#E6E3DC', fg: C.inkSoft}, blue: {bg: C.blue, fg: '#fff'}, dark: {bg: C.dark, fg: '#fff'}}[tone];
  return <div style={{display: 'inline-block', padding: '12px 30px', borderRadius: 999, background: t.bg, color: t.fg, fontSize: 36, fontWeight: 800, whiteSpace: 'nowrap', ...style}}>{text}</div>;
};

/** Media card with label pill; inactive cards fade back. */
const MediaCard: React.FC<{x: number; y: number; w: number; h: number; active: boolean; dimmed: boolean; enter: number; title: string; sub?: string; tone: 'grey' | 'blue'; children: React.ReactNode}> = ({x, y, w, h, active, dimmed, enter, title, sub, tone, children}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, opacity: enter * (dimmed ? 0.5 : 1), transform: `translateY(${(1 - enter) * 40}px) scale(${active ? 1.03 : 1})`, transformOrigin: '50% 40%', filter: dimmed ? 'saturate(.4)' : undefined}}>
    <Card radius={20} style={{position: 'relative', width: w, height: h, outline: active ? `5px solid ${tone === 'blue' ? C.blue : C.ink}` : 'none', outlineOffset: 6}}>{children}</Card>
    <div style={{marginTop: 34, textAlign: 'center'}}><Pill text={title} tone={active ? (tone === 'blue' ? 'blue' : 'dark') : 'grey'} /></div>
    {sub && <div style={{marginTop: 14, textAlign: 'center', fontSize: 28, fontWeight: 600, color: C.inkSoft}}>{sub}</div>}
  </div>
);

// ---------------- Opening: presenter in a centre card, both real results either side ----------------
export const Opening: React.FC<{scene: Scene}> = ({scene}) => {
  const f = useCurrentFrame();
  const t = frameToSource(scene, f);
  const reveal = sourceToFrame(scene, 63.1);
  const p = easeInOut(f, reveal, reveal + 20);
  const rightOn = t >= 67.5;
  const leftEnter = pop(f, reveal + 8, reveal + 26);
  const rightEnter = pop(f, reveal + 14, reveal + 32);
  // presenter frame: full screen → tall centre card
  const box = {x: lerp(p, 0, 700), y: lerp(p, 0, 150), w: lerp(p, 1920, 520), h: lerp(p, 1080, 780)};
  const s = box.h / 1080;
  const personX = lerp(p, 0.5, 0.58);
  const remain = (scene.durationInFrames - reveal) / FPS;
  return (
    <Stage>
      <Sequence from={reveal} premountFor={30}>
        <MediaCard x={70} y={300} w={580} h={326} tone="grey" active={!rightOn} dimmed={rightOn} enter={leftEnter} title="只发一句话" sub="手机原图 · 没有动画">
          <CropVideo file="opening-left" start={0} crop={[0.585, 0.35, 0.4, 0.435]} rate={Math.min(1, 6.4 / remain)} />
        </MediaCard>
        <MediaCard x={1270} y={300} w={580} h={326} tone="blue" active={rightOn} dimmed={!rightOn && t < 66.4 && rightEnter > 0.99} enter={rightEnter} title="一步步提要求" sub="产品大图 · 动画演出重点">
          <CropVideo file="opening-right" start={0} rate={Math.min(1, 6.35 / remain)} />
        </MediaCard>
      </Sequence>
      <div style={{position: 'absolute', left: box.x, top: box.y, width: box.w, height: box.h, overflow: 'hidden', borderRadius: p * 32, boxShadow: p > 0 ? '0 30px 80px rgba(20,24,40,.25)' : undefined}}>
        <div style={{position: 'absolute', left: box.w / 2 - personX * 1920 * s, top: 0, width: 1920 * s, height: 1080 * s}}>
          <OffthreadVideo pauseWhenBuffering src={staticFile('ai-ppt/presenter-opening.mp4')} muted volume={0} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        </div>
      </div>
    </Stage>
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
  const title = power ? '同样一句话，要求存在 Skill 里' : '同一份资料，两种做法';
  return (
    <Stage>
      <div style={{position: 'absolute', left: 0, right: 0, top: 86, textAlign: 'center', fontSize: 64, fontWeight: 900, letterSpacing: 1, opacity: ease(f, 0, 12), transform: `translateY(${(1 - ease(f, 0, 12)) * 16}px)`}}>{title}</div>
      <MediaCard x={130} y={250} w={760} h={428} tone="grey" active={both || leftActive} dimmed={!both && rightActive} enter={pop(f, 4, 22)} title="只发一句话" sub="耳机 · 手机原图 · 没有动画">
        <CropVideo file="02" start={25} crop={[0.585, 0.35, 0.4, 0.435]} still />
      </MediaCard>
      <MediaCard x={1030} y={250} w={760} h={428} tone="blue" active={both || rightActive} dimmed={!both && leftActive} enter={pop(f, 10, 28)} title={power ? '调用自己的 Skill' : '一步步提要求'} sub={power ? '充电宝 · 版式和动画跟着新产品变' : '耳机 · 产品大图 · 动画演出重点'}>
        <Sequence key={step} from={step * 120} durationInFrames={120}><CropVideo file={power ? '17' : '15'} start={rightStart} /></Sequence>
      </MediaCard>
      <div style={{position: 'absolute', left: 960 - 46, top: 418, width: 92, height: 92, borderRadius: 46, background: C.dark, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.num, fontSize: 34, fontWeight: 800, boxShadow: '0 14px 30px rgba(20,24,40,.3)', transform: `scale(${pop(f, 16, 30)})`}}>VS</div>
    </Stage>
  );
};

// ---------------- Skill = a work handbook ----------------
const Sparkle: React.FC<{size: number; color: string}> = ({size, color}) => (
  <svg width={size} height={size} viewBox="-50 -50 100 100"><path d="M0 -46 C6 -10 10 -6 46 0 C10 6 6 10 0 46 C-6 10 -10 6 -46 0 C-10 -6 -6 -10 0 -46Z" fill={color} /></svg>
);

const Avatar: React.FC<{ai: number; enter: number}> = ({ai, enter}) => (
  <div style={{position: 'absolute', left: 150, top: 380, width: 300, transform: `scale(${enter})`, transformOrigin: '50% 50%'}}>
    <div style={{position: 'relative', width: 240, height: 240, margin: '0 auto'}}>
      {/* new colleague */}
      <div style={{position: 'absolute', inset: 0, borderRadius: 120, background: '#FFE3D3', opacity: 1 - ai, overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: 80, top: 46, width: 80, height: 80, borderRadius: 40, background: C.orange}} />
        <div style={{position: 'absolute', left: 40, top: 140, width: 160, height: 140, borderRadius: '80px 80px 0 0', background: C.orange}} />
      </div>
      {/* AI */}
      <div style={{position: 'absolute', inset: 0, borderRadius: 120, background: `linear-gradient(135deg, ${C.blue}, #8B5CFF)`, opacity: ai, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${0.7 + 0.3 * ai}) rotate(${(1 - ai) * -40}deg)`}}>
        <Sparkle size={120} color="#fff" />
      </div>
    </div>
    <div style={{marginTop: 26, textAlign: 'center'}}><Pill text={ai > 0.5 ? 'AI' : '新同事'} tone={ai > 0.5 ? 'blue' : 'dark'} /></div>
  </div>
);

export const Handbook: React.FC<{scene: Scene}> = ({scene}) => {
  const f = useCurrentFrame();
  const t = frameToSource(scene, f);
  const title = ease(t, 260.84, 261.5);
  const mark = ease(t, 261.9, 262.6);
  const who = pop(t, 262.7, 263.4);
  const bookIn = pop(t, 262.9, 263.6);
  const open = easeInOut(t, 263.7, 264.6);
  const row = (a: number, i: number) => ease(t, a + i * 0.3, a + i * 0.3 + 0.45);
  const tpl = (i: number) => pop(t, 268.7 + i * 0.2, 269.3 + i * 0.2);
  const toAi = easeInOut(t, 270.24, 270.9);
  const reading = ease(t, 272.4, 273.1);
  const done = pop(t, 273.98, 274.5);
  const bx = 640, by = 300, bw = 1000, bh = 500;
  return (
    <Stage>
      <div style={{position: 'absolute', left: 150, top: 110, fontSize: 70, fontWeight: 900, opacity: title, transform: `translateY(${(1 - title) * 16}px)`}}>
        Skill，就像一本
        <span style={{position: 'relative', display: 'inline-block', marginLeft: 12}}>
          <span style={{position: 'absolute', left: -6, right: -6, bottom: 4, height: 30, background: C.yellow, borderRadius: 6, transform: `scaleX(${mark})`, transformOrigin: '0 50%'}} />
          <span style={{position: 'relative'}}>工作手册</span>
        </span>
      </div>
      <Avatar ai={toAi} enter={who} />
      {/* reading arrow */}
      <svg style={{position: 'absolute', left: 470, top: 470, overflow: 'visible'}} width={150} height={60}>
        <path d="M0 30 H130" stroke={C.blue} strokeWidth={5} strokeDasharray="10 10" strokeLinecap="round" fill="none" opacity={reading} />
        <path d="M118 16 L136 30 L118 44" stroke={C.blue} strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={reading} />
      </svg>
      {/* the book */}
      <div style={{position: 'absolute', left: bx, top: by, width: bw, height: bh, transform: `scale(${0.85 + 0.15 * bookIn})`, opacity: Math.min(1, bookIn * 1.5), perspective: 2000}}>
        <Card radius={26} style={{inset: 0, opacity: open}}>
          <div style={{height: 70, background: C.blueSoft, display: 'flex', alignItems: 'center', padding: '0 36px', gap: 14}}>
            <div style={{width: 14, height: 14, borderRadius: 7, background: C.blue}} />
            <div style={{fontSize: 28, fontWeight: 800, color: C.blue, letterSpacing: 2}}>SKILL · 工作手册</div>
          </div>
          <div style={{display: 'flex', padding: '30px 40px'}}>
            <div style={{flex: 1}}>
              <div style={{fontSize: 38, fontWeight: 900}}>活儿怎么干</div>
              {['先定大纲', '再套模板、调版式', '最后加动画'].map((s, i) => (
                <div key={s} style={{display: 'flex', alignItems: 'center', gap: 16, marginTop: 26, fontSize: 32, fontWeight: 600, opacity: row(265.02, i), transform: `translateX(${(1 - row(265.02, i)) * -16}px)`}}>
                  <span style={{width: 44, height: 44, borderRadius: 22, background: C.blue, color: '#fff', fontFamily: FONT.num, fontWeight: 800, fontSize: 24, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{i + 1}</span>{s}
                </div>
              ))}
            </div>
            <div style={{width: 2, background: C.inkFaint, margin: '0 36px'}} />
            <div style={{flex: 1}}>
              <div style={{fontSize: 38, fontWeight: 900}}>按什么要求干</div>
              {['数字以资料为准', '图要大，字要少', '重点用动画演出来'].map((s, i) => (
                <div key={s} style={{display: 'flex', alignItems: 'center', gap: 16, marginTop: 26, fontSize: 32, fontWeight: 600, opacity: row(266.26, i), transform: `translateX(${(1 - row(266.26, i)) * -16}px)`}}>
                  <span style={{width: 44, height: 44, borderRadius: 22, background: C.green, color: '#fff', fontWeight: 900, fontSize: 26, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>✓</span>{s}
                </div>
              ))}
            </div>
          </div>
        </Card>
        {/* cover flips open */}
        <div style={{position: 'absolute', inset: 0, transformOrigin: '0 50%', transform: `rotateY(${-open * 100}deg)`, opacity: 1 - ease(open, 0.5, 0.75), borderRadius: 26, background: `linear-gradient(135deg, ${C.blue}, #5B8CFF)`, boxShadow: '0 28px 70px rgba(20,24,40,.25)', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{fontSize: 30, fontWeight: 800, letterSpacing: 8, opacity: 0.8}}>SKILL</div>
          <div style={{fontSize: 96, fontWeight: 900, marginTop: 10}}>工作手册</div>
          <div style={{fontSize: 30, fontWeight: 600, marginTop: 16, opacity: 0.85}}>做法 · 要求 · 模板</div>
        </div>
        {/* templates fan out from the book */}
        {[0, 1, 2].map((i) => {
          const p = tpl(i);
          const col = [C.orange, C.blue, C.green][i];
          return (
            <Card key={i} radius={14} style={{width: 200, height: 124, left: bw - 250 + i * 70, top: bh - 70 + p * (30 - i * 6), opacity: Math.min(1, p * 1.5), transform: `rotate(${(i - 1) * 8 * p}deg) translateY(${(1 - p) * 30}px)`, zIndex: 3}}>
              <div style={{height: 34, background: col, color: '#fff', fontSize: 20, fontWeight: 800, padding: '5px 14px'}}>模板 {i + 1}</div>
              <div style={{margin: '16px 14px 0', height: 10, borderRadius: 5, background: C.inkFaint}} />
              <div style={{margin: '10px 14px 0', width: 100, height: 10, borderRadius: 5, background: C.inkFaint}} />
            </Card>
          );
        })}
      </div>
      <div style={{position: 'absolute', left: bx, top: by + bh + 70, transform: `scale(${done})`, transformOrigin: '0 50%'}}>
        <div style={{display: 'inline-flex', alignItems: 'center', gap: 14, padding: '16px 30px', borderRadius: 999, background: C.green, color: '#fff', fontSize: 36, fontWeight: 800, boxShadow: '0 14px 30px rgba(22,178,122,.35)'}}>✓ 照着手册做，就行了</div>
      </div>
    </Stage>
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
    <div style={{position: 'absolute', left: 0, right: 0, top: 44, display: 'flex', justifyContent: 'center', gap: 16, fontFamily: FONT.sans}}>
      {STEP_NAMES.map((n, i) => {
        const p = pop(t, triggers[i], triggers[i] + 0.4);
        return (
          <div key={n} style={{display: 'flex', alignItems: 'center', gap: 12, padding: '12px 26px 12px 12px', borderRadius: 999, background: '#fff', boxShadow: '0 12px 30px rgba(20,24,40,.22)', fontSize: 36, fontWeight: 800, color: C.ink, opacity: Math.min(1, p * 1.5), transform: `scale(${0.6 + 0.4 * p})`}}>
            <span style={{width: 48, height: 48, borderRadius: 24, background: C.blue, color: '#fff', fontFamily: FONT.num, fontSize: 26, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{i + 1}</span>{n}
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
  const w = 292, h = 330, gap = 36, x0 = (1920 - (w * 5 + gap * 4)) / 2, y0 = 360;
  const title = ease(t, 737.4, 738.2);
  const ghost = ease(t, 739.85, 740.8);
  const cur = triggers.filter((x) => t >= x).length;
  const bar = cur === 0 ? 0 : Math.min(1, (cur - 1) / 4 + 0.25 * ease(t, triggers[cur - 1], triggers[cur - 1] + 0.6) / 1);
  return (
    <Stage>
      <div style={{position: 'absolute', left: 0, right: 0, top: 150, textAlign: 'center', fontSize: 68, fontWeight: 900, opacity: title, transform: `translateY(${(1 - title) * 16}px)`}}>五步，做一份新品宣传 PPT</div>
      {/* progress rail */}
      <div style={{position: 'absolute', left: x0, top: y0 + h + 60, width: w * 5 + gap * 4, height: 10, borderRadius: 5, background: C.inkFaint, opacity: ghost}}>
        <div style={{width: `${bar * 100}%`, height: '100%', borderRadius: 5, background: C.blue}} />
      </div>
      {STEP_NAMES.map((n, i) => {
        const on = pop(t, triggers[i], triggers[i] + 0.45);
        const lit = t >= triggers[i];
        const desc = ease(t, triggers[i] + 0.4, triggers[i] + 0.9);
        return (
          <Card key={n} radius={24} style={{left: x0 + i * (w + gap), top: y0 - on * 14, width: w, height: h, opacity: Math.max(ghost * 0.55, lit ? 1 : 0), transform: `scale(${lit ? 0.92 + 0.08 * on : 0.96})`, boxShadow: lit ? undefined : 'none', border: lit ? '1px solid rgba(20,22,26,.06)' : `2px dashed ${C.inkFaint}`, background: lit ? '#fff' : 'rgba(255,255,255,.4)'}}>
            {lit && <div style={{height: 8, background: i === 4 ? C.orange : C.blue}} />}
            <div style={{padding: '30px 30px 0'}}>
              <div style={{fontFamily: FONT.num, fontSize: 96, fontWeight: 900, lineHeight: 1, color: lit ? (i === 4 ? C.orange : C.blue) : 'rgba(20,22,26,.18)'}}>0{i + 1}</div>
              <div style={{fontSize: 50, fontWeight: 900, marginTop: 26, color: lit ? C.ink : 'rgba(20,22,26,.3)'}}>{n}</div>
              <div style={{fontSize: 28, fontWeight: 600, marginTop: 14, color: C.inkSoft, opacity: desc}}>{STEP_DESC[i]}</div>
            </div>
          </Card>
        );
      })}
    </Stage>
  );
};

// ---------------- Install a Skill by typing one line ----------------
export const InstallCard: React.FC<{scene: Scene}> = ({scene}) => {
  const f = useCurrentFrame();
  const t = frameToSource(scene, f);
  const command = '安装这个 skill：guizang-ppt-skill';
  const count = Math.floor(ease(t, 297.3, 300.4) * command.length);
  const enter = pop(f, 0, 18);
  const sent = ease(t, 300.7, 301.0);
  const toast = pop(t, 301.5, 302.1);
  const bx = 260, by = 430, bw = 1400, bh = 200;
  return (
    <Stage>
      <div style={{position: 'absolute', left: bx, top: 210, fontSize: 68, fontWeight: 900, opacity: ease(f, 0, 12)}}>安装别人做好的 Skill</div>
      <div style={{position: 'absolute', left: bx, top: 316, opacity: ease(t, 294, 294.6)}}><Pill text="推荐：guizang-ppt-skill" tone="blue" style={{fontSize: 30, padding: '10px 26px'}} /></div>
      <Card radius={30} style={{left: bx, top: by, width: bw, height: bh, transform: `scale(${0.9 + 0.1 * enter})`, opacity: Math.min(1, enter * 1.5), outline: sent > 0 ? `4px solid ${C.blue}` : 'none', outlineOffset: 4}}>
        <div style={{position: 'absolute', left: 50, top: 0, height: bh - 50, display: 'flex', alignItems: 'center', fontSize: 50, fontWeight: 600, color: C.ink, opacity: 1 - sent * 0.6}}>
          {count === 0 ? <span style={{color: 'rgba(20,22,26,.35)'}}>发消息或创建任务…</span> : command.slice(0, count)}
          <span style={{opacity: sent > 0 ? 0 : Math.floor(f / 14) % 2 ? 0 : 1, color: C.blue, marginLeft: 4}}>|</span>
        </div>
        <div style={{position: 'absolute', left: 50, bottom: 30, display: 'flex', gap: 14}}>
          {['本地电脑', '项目', '更多技能'].map((x) => <div key={x} style={{padding: '6px 18px', borderRadius: 999, background: '#F1F0EC', color: C.inkSoft, fontSize: 22, fontWeight: 600}}>{x}</div>)}
        </div>
        <div style={{position: 'absolute', right: 36, bottom: 28, width: 72, height: 72, borderRadius: 36, background: sent > 0 ? C.blue : C.dark, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${1 + 0.15 * Math.sin(Math.PI * sent)})`}}>
          <svg width="34" height="34" viewBox="0 0 34 34"><path d="M17 28 V6 M7 15 L17 5 L27 15" stroke="#fff" strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
      </Card>
      <div style={{position: 'absolute', left: bx, top: by + bh + 60, transform: `scale(${toast}) translateY(${(1 - toast) * 20}px)`, transformOrigin: '0 50%'}}>
        <div style={{display: 'inline-flex', alignItems: 'center', gap: 14, padding: '16px 30px', borderRadius: 999, background: C.green, color: '#fff', fontSize: 36, fontWeight: 800, boxShadow: '0 14px 30px rgba(22,178,122,.35)'}}>✓ 发出去，它就能自己安装好</div>
      </div>
    </Stage>
  );
};
