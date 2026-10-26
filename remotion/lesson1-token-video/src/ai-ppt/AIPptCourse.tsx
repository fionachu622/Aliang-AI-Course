import React from 'react';
import {AbsoluteFill, Audio, Freeze, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Scene, Shot, scenes, FPS, frameToSource, sourceToFrame} from './timeline';
import captions from './captions.json';
import {Compare, CropVideo, Handbook, InstallCard, Opening, Steps, StepsStrip} from './Animations';
import {Board, C, ChalkRect, FONT, Tag, ease, easeInOut, lerp, roughRectPath} from './design';

const screen = (id: string) => staticFile(`ai-ppt/screen-${id}.mp4`);
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Every recording and product image sits in the same "monitor" on the board,
// so the eye never has to re-find the content. Subtitles live in the strip below it.
export const WIN = {x: 160, y: 40, w: 1600, h: 888};
const TAG_POS = {x: WIN.x - 28, y: WIN.y + 36};

/** Keep the zoomed view inside the picture (no empty borders). */
const clampCentre = (c: number, zoom: number) => {
  const half = 0.5 / zoom;
  return Math.min(1 - half, Math.max(half, c));
};

const MAX_RATE = 2.5; // above this the browser preview stutters / goes black, and the action is unreadable
const MIN_RATE = 0.9; // never play a recording in slow motion
const videoStyle: React.CSSProperties = {width: '100%', height: '100%', objectFit: 'fill'};
/**
 * Plays [start, end] of a recording inside `duration` frames.
 * - Too much action for the time: show the beginning and the end at ≤2.5×, joined by a cut.
 * - Too little action: play at 1× and hold the last frame.
 * - end === null: a still frame.
 */
const ScreenMedia: React.FC<{file: string; start: number; end: number | null; duration: number}> = ({file, start, end, duration}) => {
  const src = screen(file);
  if (end == null) return <Freeze frame={0}><OffthreadVideo src={src} muted volume={0} startFrom={Math.round(start * FPS)} style={videoStyle} /></Freeze>;
  const secs = duration / FPS;
  const natural = (end - start) / secs;
  if (natural > MAX_RATE) {
    const half = Math.floor(duration / 2);
    const tailStart = end - ((duration - half) / FPS) * MAX_RATE;
    return (
      <>
        <Sequence durationInFrames={half} premountFor={FPS}><OffthreadVideo src={src} muted volume={0} startFrom={Math.round(start * FPS)} playbackRate={MAX_RATE} style={videoStyle} /></Sequence>
        <Sequence from={half} premountFor={FPS}><OffthreadVideo src={src} muted volume={0} startFrom={Math.round(tailStart * FPS)} playbackRate={MAX_RATE} style={videoStyle} /></Sequence>
      </>
    );
  }
  if (natural < MIN_RATE) {
    const play = Math.round((end - start) * FPS);
    return (
      <>
        <Sequence durationInFrames={play} premountFor={FPS}><OffthreadVideo src={src} muted volume={0} startFrom={Math.round(start * FPS)} style={videoStyle} /></Sequence>
        <Sequence from={play}><Freeze frame={0}><OffthreadVideo src={src} muted volume={0} startFrom={Math.round(end * FPS) - 1} style={videoStyle} /></Freeze></Sequence>
      </>
    );
  }
  return <OffthreadVideo src={src} muted volume={0} startFrom={Math.round(start * FPS)} playbackRate={natural} style={videoStyle} />;
};

const ScreenShot: React.FC<{shot: Shot; duration: number; prev?: Shot}> = ({shot, duration, prev}) => {
  const f = useCurrentFrame();
  const sourceStart = shot.sourceStart ?? 0;
  const moving = shot.sourceEnd != null;
  const target = Math.max(1, shot.zoom ?? 1);
  // Camera: settle in from slightly wider, then a slow push for the rest of the shot.
  // Same recording as the previous shot: glide the camera over instead of cutting.
  const glide = prev?.kind === 'screen' && prev.file === shot.file;
  const settle = easeInOut(f, 0, glide ? 16 : 20);
  const drift = interpolate(f, [20, Math.max(21, duration)], [0, 1], clamp);
  const fromZoom = glide ? Math.max(1, prev!.zoom ?? 1) * 1.035 : Math.max(1, target * 0.9);
  const zoom = lerp(settle, fromZoom, target) * (1 + 0.035 * drift);
  const cx = clampCentre(lerp(settle, glide ? prev!.cx ?? 0.5 : shot.cx ?? 0.5, shot.cx ?? 0.5), zoom);
  const cy = clampCentre(lerp(settle, glide ? prev!.cy ?? 0.5 : shot.cy ?? 0.5, shot.cy ?? 0.5), zoom);
  const tx = (0.5 - cx) * WIN.w * zoom;
  const ty = (0.5 - cy) * WIN.h * zoom;
  const enter = glide ? 1 : ease(f, 0, 8);
  const m = shot.mark;
  // Short shots (e.g. the three quick page cuts in s34) still finish their highlight.
  const circle = ease(f, Math.min(8, duration * 0.1), Math.min(24, Math.max(6, duration * 0.55)));
  return (
    <Board>
      <div style={{position: 'absolute', left: WIN.x, top: WIN.y, width: WIN.w, height: WIN.h, borderRadius: 14, overflow: 'hidden', background: '#fff', boxShadow: '0 24px 60px rgba(0,0,0,.5)'}}>
        <div style={{position: 'absolute', inset: 0, transform: `translate(${tx}px, ${ty}px) scale(${zoom})`, transformOrigin: '50% 50%'}}>
          <ScreenMedia file={shot.file!} start={sourceStart} end={moving ? shot.sourceEnd! : null} duration={duration} />
          {m && (
            <svg viewBox={`0 0 ${WIN.w} ${WIN.h}`} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
              <rect x={m[0] * WIN.w - 8} y={m[1] * WIN.h - 6} width={m[2] * WIN.w + 16} height={m[3] * WIN.h + 12} rx={8} fill="#F0C85A" opacity={0.2 * circle} />
              <path transform={`translate(${m[0] * WIN.w - 12} ${m[1] * WIN.h - 10})`} d={roughRectPath(m[2] * WIN.w + 24, m[3] * WIN.h + 20, `${shot.file}-${shot.at}`, 1.6)} fill="none" stroke="#E8A93A" strokeWidth={4.5 / zoom} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - circle} />
            </svg>
          )}
        </div>
        <AbsoluteFill style={{background: C.board, opacity: 1 - enter}} />
      </div>
      <Tag text={shot.label ?? ''} progress={ease(f, Math.min(6, duration * 0.08), Math.min(20, Math.max(5, duration * 0.4)))} x={TAG_POS.x} y={TAG_POS.y} color={m ? '#E8A93A' : C.yellow} />
    </Board>
  );
};

/** Several pages side by side (s34: three pages that still use phone photos). */
const ScreenTrio: React.FC<{shot: Shot; duration: number}> = ({shot, duration}) => {
  const f = useCurrentFrame();
  const items = shot.items ?? [];
  const w = 560, h = 315, gap = 60, x0 = (1920 - (w * items.length + gap * (items.length - 1))) / 2, y0 = 370;
  const step = Math.min(8, duration / (items.length + 2));
  return (
    <Board>
      <div className="chalk" style={{position: 'absolute', left: 0, right: 0, top: 210, textAlign: 'center', fontSize: 58, opacity: ease(f, 0, 8)}}>{shot.label}</div>
      {items.map((it, i) => {
        const p = ease(f, i * step, i * step + 8);
        const [cx, cy, cw, ch] = it.crop;
        const [mx, my, mw, mh] = it.mark;
        const hl = ease(f, i * step + 5, i * step + 14);
        return (
          <div key={i} style={{position: 'absolute', left: x0 + i * (w + gap), top: y0, width: w, opacity: p, transform: `translateY(${(1 - p) * 20}px)`}}>
            <div style={{position: 'relative', width: w, height: h, borderRadius: 8, overflow: 'hidden', boxShadow: '0 18px 40px rgba(0,0,0,.45)'}}>
              <CropVideo file={it.file} start={it.sourceStart} crop={it.crop} still />
              <svg viewBox={`0 0 ${w} ${h}`} style={{position: 'absolute', inset: 0}}>
                <rect x={((mx - cx) / cw) * w - 4} y={((my - cy) / ch) * h - 4} width={(mw / cw) * w + 8} height={(mh / ch) * h + 8} rx={6} fill="#F0C85A" opacity={0.2 * hl} />
                <path transform={`translate(${((mx - cx) / cw) * w - 6} ${((my - cy) / ch) * h - 6})`} d={roughRectPath((mw / cw) * w + 12, (mh / ch) * h + 12, `trio${i}`, 1.4)} fill="none" stroke="#E8A93A" strokeWidth={3.5} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - hl} />
              </svg>
            </div>
            <div className="chalk" style={{marginTop: 30, textAlign: 'center', fontSize: 42, color: C.yellow}}>{it.label}</div>
          </div>
        );
      })}
    </Board>
  );
};

const ProductImage: React.FC<{shot: Shot; duration: number}> = ({shot, duration}) => {
  const f = useCurrentFrame();
  const enter = ease(f, 0, 14);
  const scale = interpolate(f, [0, Math.max(1, duration)], [1.0, 1.05], clamp);
  return (
    <Board>
      <div style={{position: 'absolute', left: WIN.x, top: WIN.y, width: WIN.w, height: WIN.h, borderRadius: 10, overflow: 'hidden', background: '#0b0c0d', opacity: enter, boxShadow: '0 24px 60px rgba(0,0,0,.5)'}}>
        <Img src={staticFile(shot.file!)} style={{width: '100%', height: '100%', objectFit: 'contain', transform: `scale(${scale})`}} />
      </div>
      <ChalkRect w={WIN.w + 32} h={WIN.h + 32} k={`img-${shot.at}`} color={C.ink} progress={ease(f, 2, 22)} width={3} style={{left: WIN.x - 16, top: WIN.y - 16}} />
      <Tag text={shot.label ?? ''} progress={ease(f, 8, 22)} x={TAG_POS.x} y={TAG_POS.y} />
    </Board>
  );
};

/** Chapter card for the first presenter shot of each step. */
const ChapterCard: React.FC<{title: string}> = ({title}) => {
  const f = useCurrentFrame();
  const m = title.match(/^(第.步)：(.+)$/);
  if (!m) return null;
  const inP = ease(f, 6, 22);
  const outP = 1 - ease(f, 108, 124);
  const p = inP * outP;
  return (
    <div style={{position: 'absolute', left: 90, top: 300, width: 460, height: 300, opacity: p, transform: `translateX(${(1 - inP) * -40}px)`}}>
      <div style={{position: 'absolute', inset: 0, borderRadius: 16, overflow: 'hidden', boxShadow: '0 18px 44px rgba(0,0,0,.4)'}}><Board /></div>
      <ChalkRect w={460} h={300} k={title} color={C.ink} progress={inP} width={3.4} />
      <div className="chalk" style={{position: 'absolute', left: 48, top: 54, fontSize: 40, color: C.yellow}}>{m[1]}</div>
      <div className="chalk" style={{position: 'absolute', left: 46, top: 118, fontSize: 92, color: C.ink}}>{m[2]}</div>
    </div>
  );
};

/** Split a long take at sentence starts (≥5.5 s apart) so the framing can change. */
const takeSegments = (start: number, end: number) => {
  const cuts = [start];
  const starts = captions.map((c) => Math.round((c.startMs / 1000) * FPS)).filter((fr) => fr > start && fr < end).sort((x, y) => x - y);
  for (const fr of starts) {
    if (fr - cuts[cuts.length - 1] >= 5.5 * FPS && end - fr >= 3 * FPS) cuts.push(fr);
  }
  return cuts.map((s, i) => [s, i + 1 < cuts.length ? cuts[i + 1] : end] as const);
};

const PresenterVideo: React.FC<{scene: Scene; sceneIndex: number; forceWide?: boolean}> = ({scene, sceneIndex, forceWide}) => {
  let offset = 0;
  let n = sceneIndex;
  return (
    <AbsoluteFill style={{background: '#101917'}}>
      {scene.audio.flatMap((c, i) =>
        takeSegments(c.sourceStart, c.sourceEnd).map(([s, e], k) => {
          const from = offset;
          const d = e - s;
          offset += d;
          // Alternate wide / close at every cut, so removed retakes and long talks read as deliberate edits.
          const close = !forceWide && n++ % 2 === 1;
          return (
            <Sequence key={`${i}-${k}`} from={from} durationInFrames={d} premountFor={FPS} name={`真人 ${i + 1}.${k + 1}`}>
              <PresenterTake start={s} duration={d} close={close} />
            </Sequence>
          );
        }),
      )}
    </AbsoluteFill>
  );
};

const PresenterTake: React.FC<{start: number; duration: number; close: boolean}> = ({start, duration, close}) => {
  const f = useCurrentFrame();
  const push = interpolate(f, [0, Math.max(1, duration)], [1, 1.03], clamp);
  const base = close ? 1.24 : 1.0;
  return (
    <AbsoluteFill style={{transform: `scale(${base * push})`, transformOrigin: close ? '57% 30%' : '55% 45%'}}>
      <OffthreadVideo muted volume={0} src={staticFile('ai-ppt/presenter.mp4')} startFrom={start} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
    </AbsoluteFill>
  );
};

const Subtitle: React.FC<{sourceTime: number}> = ({sourceTime}) => {
  // Timestamps stay relative to the original narration, even across removed retakes.
  const c = captions.find((x) => sourceTime * 1000 >= x.startMs && sourceTime * 1000 < x.endMs - 150);
  if (!c) return null;
  return (
    <div style={{position: 'absolute', bottom: 34, left: 120, right: 120, display: 'flex', justifyContent: 'center', pointerEvents: 'none'}}>
      <div style={{fontFamily: FONT.ui, color: '#FFFDF7', fontSize: 46, lineHeight: 1.35, fontWeight: 600, letterSpacing: 1, textAlign: 'center', WebkitTextStroke: '6px rgba(12,14,15,.72)', paintOrder: 'stroke fill', textShadow: '0 3px 14px rgba(0,0,0,.55)'}}>{c.text}</div>
    </div>
  );
};

const sceneIndexOf = (scene: Scene) => scenes.findIndex((s) => s.id === scene.id);

export const CourseScene: React.FC<{scene: Scene; debug?: boolean}> = ({scene, debug = false}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sourceTime = frameToSource(scene, frame);
  const idx = sceneIndexOf(scene);
  let offset = 0;
  return (
    <AbsoluteFill className="aippt-chalk" style={{fontFamily: FONT.ui, background: C.board}}>
      {scene.shots.map((shot, i) => {
        const from = sourceToFrame(scene, shot.at);
        const end = i + 1 < scene.shots.length ? sourceToFrame(scene, scene.shots[i + 1].at) : scene.durationInFrames;
        const dur = end - from;
        if (dur <= 0) return null;
        let visual: React.ReactNode;
        if (shot.kind === 'screen') visual = <ScreenShot shot={shot} duration={dur} prev={i > 0 ? scene.shots[i - 1] : undefined} />;
        else if (shot.kind === 'image') visual = <ProductImage shot={shot} duration={dur} />;
        else if (shot.kind === 'screen-trio') visual = <ScreenTrio shot={shot} duration={dur} />;
        else {
          // These use the scene's own clock so spoken cue anchors survive cuts.
          const inner =
            shot.kind === 'opening' ? <Opening scene={scene} /> :
            shot.kind === 'presenter' || shot.kind === 'presenter-steps' ? (
              <AbsoluteFill>
                <PresenterVideo scene={scene} sceneIndex={idx} forceWide={shot.kind === 'presenter-steps'} />
                {shot.kind === 'presenter-steps' && <StepsStrip scene={scene} />}
                {i === 0 && <ChapterCard title={scene.title} />}
              </AbsoluteFill>
            ) :
            shot.kind === 'handbook' ? <Handbook scene={scene} /> :
            shot.kind === 'steps' ? <Steps scene={scene} /> :
            shot.kind === 'install' ? <InstallCard scene={scene} /> :
            <Compare scene={scene} mode={shot.kind} />;
          visual = <Sequence from={-from} durationInFrames={scene.durationInFrames + from}>{inner}</Sequence>;
        }
        return <Sequence key={i} from={from} durationInFrames={dur} premountFor={fps} name={`${scene.id} · ${shot.label || shot.kind}`}>{visual}</Sequence>;
      })}
      {scene.audio.map((c, i) => {
        const from = offset;
        const d = c.sourceEnd - c.sourceStart;
        offset += d;
        return <Sequence key={`voice-${i}`} from={from} durationInFrames={d} premountFor={fps} name={`口播 ${c.sourceStart / fps}s`}><Audio src={staticFile('ai-ppt/presenter.mp4')} startFrom={c.sourceStart} endAt={c.sourceEnd} volume={1} /></Sequence>;
      })}
      <Subtitle sourceTime={sourceTime} />
      {debug && <div style={{position: 'absolute', right: 24, top: 18, background: '#000a', color: 'white', fontSize: 20, padding: 8, fontFamily: FONT.ui}}>{scene.id} / 源 {sourceTime.toFixed(2)}s</div>}
    </AbsoluteFill>
  );
};

export const AIPptCourse: React.FC<{sceneId?: string; debug?: boolean}> = ({sceneId, debug = false}) => {
  let at = 0;
  const selected = sceneId ? scenes.filter((s) => s.id === sceneId) : scenes;
  return (
    <AbsoluteFill className="aippt-chalk">
      <style>{`@font-face{font-family:"PPT Chalk";src:url("${staticFile('fonts/HanziPenSC-Regular.otf')}")}
        *{box-sizing:border-box}
        .aippt-chalk .chalk{font-family:${FONT.chalk};font-weight:600;-webkit-text-stroke:.6px currentColor;paint-order:stroke fill;text-shadow:0 0 .6px rgba(255,255,255,.45)}`}</style>
      {selected.map((scene) => {
        const from = at;
        at += scene.durationInFrames;
        return <Sequence key={scene.id} from={from} durationInFrames={scene.durationInFrames} premountFor={FPS} name={`${scene.id} ${scene.title}`}><CourseScene scene={scene} debug={debug} /></Sequence>;
      })}
    </AbsoluteFill>
  );
};
