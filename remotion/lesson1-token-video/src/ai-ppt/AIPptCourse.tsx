import React from 'react';
import {AbsoluteFill, Audio, Freeze, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Scene, Shot, scenes, FPS, chunkFrames, dubAt, frameToSource, sourceToFrame} from './timeline';
import captions from './captions.json';
import {Compare, CropVideo, Handbook, InstallCard, Opening, Steps, StepsStrip} from './Animations';
import {C, Card, FONT, MarkBox, Stage, ease, easeInOut, lerp, pop} from './design';

const screen = (id: string) => staticFile(`ai-ppt/screen-${id === '16' ? '16-v4' : id}.mp4`);
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Recordings fill the whole 1920×1080 frame. They are 1298×720 (a touch wider than 16:9),
// so the media box keeps that aspect at full height and loses ~13 px on each side (cover fit).
const VH = 1080;
const VW = Math.round(VH * (1298 / 720));
const VX = (1920 - VW) / 2;

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
  if (end == null) return <Freeze frame={0}><OffthreadVideo pauseWhenBuffering src={src} muted volume={0} startFrom={Math.round(start * FPS)} style={videoStyle} /></Freeze>;
  const secs = duration / FPS;
  const natural = (end - start) / secs;
  if (natural > MAX_RATE) {
    const half = Math.floor(duration / 2);
    const tailStart = end - ((duration - half) / FPS) * MAX_RATE;
    return (
      <>
        <Sequence durationInFrames={half} premountFor={FPS}><OffthreadVideo pauseWhenBuffering src={src} muted volume={0} startFrom={Math.round(start * FPS)} playbackRate={MAX_RATE} style={videoStyle} /></Sequence>
        <Sequence from={half} premountFor={FPS}><OffthreadVideo pauseWhenBuffering src={src} muted volume={0} startFrom={Math.round(tailStart * FPS)} playbackRate={MAX_RATE} style={videoStyle} /></Sequence>
      </>
    );
  }
  if (natural < MIN_RATE) {
    const play = Math.round((end - start) * FPS);
    return (
      <>
        <Sequence durationInFrames={play} premountFor={FPS}><OffthreadVideo pauseWhenBuffering src={src} muted volume={0} startFrom={Math.round(start * FPS)} style={videoStyle} /></Sequence>
        <Sequence from={play}><Freeze frame={0}><OffthreadVideo pauseWhenBuffering src={src} muted volume={0} startFrom={Math.round(end * FPS) - 1} style={videoStyle} /></Freeze></Sequence>
      </>
    );
  }
  return <OffthreadVideo pauseWhenBuffering src={src} muted volume={0} startFrom={Math.round(start * FPS)} playbackRate={natural} style={videoStyle} />;
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
  const tx = (0.5 - cx) * VW * zoom;
  const ty = (0.5 - cy) * VH * zoom;
  const m = shot.mark;
  // Short shots (e.g. quick page cuts) still finish their highlight.
  const hl = ease(f, Math.min(8, duration * 0.1), Math.min(22, Math.max(6, duration * 0.5)));
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: VX, top: 0, width: VW, height: VH, transform: `translate(${tx}px, ${ty}px) scale(${zoom})`, transformOrigin: '50% 50%'}}>
        <ScreenMedia file={shot.file!} start={sourceStart} end={moving ? shot.sourceEnd! : null} duration={duration} />
        {m && <MarkBox x={m[0] * VW} y={m[1] * VH} w={m[2] * VW} h={m[3] * VH} progress={hl} stroke={4 / zoom} />}
      </div>
    </AbsoluteFill>
  );
};

/** Several pages side by side (s34: three pages that still use phone photos). */
const ScreenTrio: React.FC<{shot: Shot; duration: number}> = ({shot, duration}) => {
  const f = useCurrentFrame();
  const items = shot.items ?? [];
  const w = 580, h = 322, gap = 40, x0 = (1920 - (w * items.length + gap * (items.length - 1))) / 2, y0 = (1080 - h) / 2 - 40;
  const step = Math.min(8, duration / (items.length + 2));
  return (
    <Stage>
      {items.map((it, i) => {
        const p = pop(f, i * step, i * step + 10);
        const [cx, cy, cw, ch] = it.crop;
        const [mx, my, mw, mh] = it.mark;
        const hl = ease(f, i * step + 5, i * step + 14);
        return (
          <div key={i} style={{position: 'absolute', left: x0 + i * (w + gap), top: y0, width: w, opacity: Math.min(1, p * 1.5), transform: `translateY(${(1 - p) * 30}px)`}}>
            <Card radius={18} style={{position: 'relative', width: w, height: h}}>
              <CropVideo file={it.file} start={it.sourceStart} crop={it.crop} still />
              <MarkBox x={((mx - cx) / cw) * w} y={((my - cy) / ch) * h} w={(mw / cw) * w} h={(mh / ch) * h} progress={hl} stroke={3} />
            </Card>
          </div>
        );
      })}
    </Stage>
  );
};

const ProductImage: React.FC<{shot: Shot; duration: number}> = ({shot, duration}) => {
  const f = useCurrentFrame();
  const scale = interpolate(f, [0, Math.max(1, duration)], [1.0, 1.05], clamp);
  return (
    <AbsoluteFill style={{background: '#0B0C0E', overflow: 'hidden'}}>
      <Img src={staticFile(shot.file!)} style={{width: '100%', height: '100%', objectFit: 'contain', transform: `scale(${scale})`}} />
    </AbsoluteFill>
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
    <AbsoluteFill style={{background: C.dark}}>
      {scene.audio.flatMap((c, i) => {
        // Re-voiced lines are covered by a title card, so the presenter is not shown there.
        if (c.dub) { offset += chunkFrames(c); return []; }
        return (
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
        }));
      })}
    </AbsoluteFill>
  );
};

const PresenterTake: React.FC<{start: number; duration: number; close: boolean}> = ({start, duration, close}) => {
  const f = useCurrentFrame();
  const push = interpolate(f, [0, Math.max(1, duration)], [1, 1.03], clamp);
  const base = close ? 1.24 : 1.0;
  return (
    <AbsoluteFill style={{transform: `scale(${base * push})`, transformOrigin: close ? '57% 30%' : '55% 45%'}}>
      <OffthreadVideo pauseWhenBuffering muted volume={0} src={staticFile('ai-ppt/presenter.mp4')} startFrom={start} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
    </AbsoluteFill>
  );
};

const Subtitle: React.FC<{sourceTime: number}> = ({sourceTime}) => {
  // Timestamps stay relative to the original narration, even across removed retakes.
  const c = captions.find((x) => sourceTime * 1000 >= x.startMs && sourceTime * 1000 < x.endMs - 150);
  if (!c) return null;
  return (
    <div style={{position: 'absolute', bottom: 40, left: 120, right: 120, display: 'flex', justifyContent: 'center', pointerEvents: 'none'}}>
      <div style={{fontFamily: FONT.sans, color: '#fff', fontSize: 42, lineHeight: 1.35, fontWeight: 700, letterSpacing: 1, textAlign: 'center', background: 'rgba(20,22,26,.82)', padding: '10px 28px', borderRadius: 14}}>{c.text}</div>
    </div>
  );
};

/** Full-screen title card shown while a re-voiced line plays (currently unused). */
const DubCard: React.FC<{dub: NonNullable<ReturnType<typeof dubAt>>['dub']; offset: number; length: number}> = ({dub, offset, length}) => (
  <AbsoluteFill style={{opacity: ease(offset, 0, 10)}}>
    <Stage>
      <div style={{position: 'absolute', left: 260, top: 300, fontSize: 34, fontWeight: 800, color: C.blue}}>{dub.card.kicker}</div>
      <div style={{position: 'absolute', left: 260, top: 370}}>
        {dub.card.lines.map((l, i) => {
          const q = ease(offset, l.at * length, l.at * length + 10);
          return <div key={i} style={{fontSize: l.big ? 84 : 50, fontWeight: l.big ? 900 : 700, marginTop: l.big ? 40 : 18, color: l.big ? C.ink : C.inkSoft, opacity: q, transform: `translateY(${(1 - q) * 14}px)`}}>{l.text}</div>;
        })}
      </div>
    </Stage>
  </AbsoluteFill>
);

/** Subtitles for a re-voiced line: its clauses in turn, paced by character count. */
const DubSubtitle: React.FC<{text: string; progress: number}> = ({text, progress}) => {
  const parts = text.split(/(?<=[，。、；])/).map((s) => s.replace(/[，。；]$/, '')).filter(Boolean);
  const total = parts.reduce((n, s) => n + s.length, 0);
  let acc = 0;
  const current = parts.find((s) => (acc += s.length) / total > progress) ?? parts[parts.length - 1];
  return (
    <div style={{position: 'absolute', bottom: 40, left: 120, right: 120, display: 'flex', justifyContent: 'center', pointerEvents: 'none'}}>
      <div style={{fontFamily: FONT.sans, color: '#fff', fontSize: 42, lineHeight: 1.35, fontWeight: 700, letterSpacing: 1, textAlign: 'center', background: 'rgba(20,22,26,.82)', padding: '10px 28px', borderRadius: 14}}>{current}</div>
    </div>
  );
};

const sceneIndexOf = (scene: Scene) => scenes.findIndex((s) => s.id === scene.id);

export const CourseScene: React.FC<{scene: Scene; debug?: boolean}> = ({scene, debug = false}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sourceTime = frameToSource(scene, frame);
  const idx = sceneIndexOf(scene);
  const dub = dubAt(scene, frame);
  const activeKind = [...scene.shots].reverse().find((s) => sourceToFrame(scene, s.at) <= frame)?.kind;
  let offset = 0;
  return (
    <AbsoluteFill style={{fontFamily: FONT.sans, background: C.bg}}>
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
        const d = chunkFrames(c);
        offset += d;
        if (c.dub?.file && c.dub.frames) return <Sequence key={`voice-${i}`} from={from} durationInFrames={d} premountFor={fps} name="补配口播"><Audio src={staticFile(c.dub.file)} volume={1} /></Sequence>;
        return <Sequence key={`voice-${i}`} from={from} durationInFrames={d} premountFor={fps} name={`口播 ${c.sourceStart / fps}s`}><Audio src={staticFile('ai-ppt/presenter.mp4')} startFrom={c.sourceStart} endAt={c.sourceEnd} volume={1} /></Sequence>;
      })}
      {dub && <DubCard dub={dub.dub} offset={dub.offset} length={dub.length} />}
      {dub?.dub.file ? <DubSubtitle text={dub.dub.text} progress={dub.offset / dub.length} /> : <Subtitle sourceTime={sourceTime} />}
      {debug && <div style={{position: 'absolute', left: 24, bottom: 18, background: '#000a', color: 'white', fontSize: 20, padding: 8, fontFamily: FONT.sans}}>{scene.id} / 源 {sourceTime.toFixed(2)}s</div>}
    </AbsoluteFill>
  );
};

export const AIPptCourse: React.FC<{sceneId?: string; debug?: boolean}> = ({sceneId, debug = false}) => {
  let at = 0;
  const selected = sceneId ? scenes.filter((s) => s.id === sceneId) : scenes;
  return (
    <AbsoluteFill>
      <style>{`*{box-sizing:border-box}`}</style>
      {selected.map((scene) => {
        const from = at;
        at += scene.durationInFrames;
        return <Sequence key={scene.id} from={from} durationInFrames={scene.durationInFrames} premountFor={FPS} name={`${scene.id} ${scene.title}`}><CourseScene scene={scene} debug={debug} /></Sequence>;
      })}
    </AbsoluteFill>
  );
};
