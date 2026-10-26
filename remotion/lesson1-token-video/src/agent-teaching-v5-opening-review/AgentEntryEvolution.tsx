import {ChalkText} from './CourseTypography';
import React from 'react';
import {staticFile} from 'remotion';
import storyboard from './continuous-diagrams.storyboard.json';

const scene = storyboard.agent_entry_evolution;
const time = Object.fromEntries(scene.states.map((state) => [state.id, state.at]));
const words = scene.screen_text;
const design = scene.ui_revision;
const L = design.layout;
const C = {white: '#F5F1E8', blue: '#7CC8EA', green: '#A4D486'};
const ease = (t: number, at: number, duration = .38) => {
  const q = Math.max(0, Math.min(1, (t - at) / duration));
  return q * q * (3 - 2 * q);
};
const mix = (a: number, b: number, q: number) => a + (b - a) * q;

const Label: React.FC<{
  id: keyof typeof words; x: number; y: number; size: number;
  color?: string; opacity?: number; anchor?: 'start' | 'middle';
}> = ({id, x, y, size, color = C.white, opacity = 1, anchor = 'middle'}) => (
  <ChalkText data-knowledge={id} x={x} y={y} textAnchor={anchor} fontSize={size} fill={color} opacity={opacity}>
    {words[id].text}
  </ChalkText>
);
const Chalk: React.FC<React.SVGProps<SVGPathElement>> = (props) => (
  <path {...props} fill={props.fill ?? 'none'} strokeLinecap="round" strokeLinejoin="round" filter="url(#entry-chalk)" />
);
const Arrow: React.FC<{d: string; head: string; color: string; relation: string; progress?: number; opacity?: number}> =
  ({d, head, color, relation, progress = 1, opacity = 1}) => (
    <g data-relation={relation} opacity={opacity} stroke={color} strokeWidth="3.6" fill="none">
      <Chalk d={d} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - progress} />
      <Chalk d={head} opacity={progress > .95 ? 1 : 0} />
    </g>
  );

// Crop only transparent margins in SVG; the approved source illustrations remain intact.
const Illustration: React.FC<{kind: keyof typeof design.assets; cx: number; top: number; height: number}> =
  ({kind, cx, top, height}) => {
    const asset = design.assets[kind];
    const [, , inkW, inkH] = asset.inkViewBox;
    const width = height * inkW / inkH;
    return <svg x={cx - width / 2} y={top} width={width} height={height} viewBox={asset.inkViewBox.join(' ')} overflow="hidden">
      <image href={staticFile(asset.path)} width={asset.sourceSize[0]} height={asset.sourceSize[1]} />
    </svg>;
  };

/** Establish the task relation, then give the real interfaces the full reading area. */
export const AgentEntryEvolution: React.FC<{seconds: number}> = ({seconds: t}) => {
  const dock = ease(t, time.compress, L.compressTravelDuration);
  // Establish the horizontal icon/label clearance before they meet vertically.
  const shapeDock = ease(t, time.compress, L.compressShapeDuration);
  const check = ease(t, time.check);
  const programmer = ease(t, time.programmer);
  const terminal = ease(t, time.terminal, .58);
  const desktop = ease(t, time.desktop + .18, .55);
  const wrap = ease(t, time.desktop, scene.shell_transition.duration);
  const cover = ease(t, time.desktop + .55, .55);
  const terminalScale = mix(1, .88, ease(t, time.desktop + .18, .85));
  const message = ease(t, time['plain-language'], .45);
  const panelWidth = mix(L.terminalWidth, L.desktopWidth, wrap);
  const panelHeight = mix(L.terminalHeight, L.desktopHeight, wrap);
  const panelX = L.screenshotCenterX - panelWidth / 2;
  const panelY = L.screenshotCenterY - panelHeight / 2;
  const terminalX = L.screenshotCenterX - L.terminalWidth / 2;
  const desktopX = L.screenshotCenterX - L.desktopWidth / 2;
  const artHeight = mix(L.mainArtHeight, L.dockArtHeight, shapeDock);
  const artTop = mix(L.mainArtTop, L.dockArtTop, dock);
  const labelY = mix(L.mainLabelY, L.dockLabelY, dock);
  const labelSize = mix(L.mainLabelSize, L.dockLabelSize, shapeDock);
  // These bounds are in the original 3072x1704 desktop image, not a guessed UI rectangle.
  const inputX = desktopX + L.desktopWidth * 800 / 3072;
  const inputY = L.screenshotY + L.desktopWidth * 1460 / 3072;
  const inputW = L.desktopWidth * 2040 / 3072;
  const inputH = L.desktopWidth * 225 / 3072;

  return <svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080"
    style={{position: 'absolute', inset: 0, fontFamily: 'AgentFullHanzi, HanziPen SC, cursive'}}
    data-one-page="agent-entry-evolution">
    <defs>
      <filter id="entry-chalk" x="-10%" y="-30%" width="120%" height="160%">
        <feTurbulence type="fractalNoise" baseFrequency=".38" numOctaves="2" seed="11" result="grain" />
        <feDisplacementMap in="SourceGraphic" in2="grain" scale="1.5" xChannelSelector="R" yChannelSelector="G" />
      </filter>
      <clipPath id="entry-shell-clip"><rect x={panelX} y={panelY} width={panelWidth} height={panelHeight} rx="14" /></clipPath>
      <clipPath id="entry-terminal-clip"><rect x={terminalX} y={L.screenshotY}
        width={L.terminalWidth * (1 - cover)} height={L.terminalHeight} /></clipPath>
    </defs>

    <g data-visual-anchor="task-agent-review" opacity={ease(t, time.task, .32) * (1 - ease(t, time.terminal - L.routeExitDuration, L.routeExitDuration))}>
      {(['request', 'agent', 'result'] as const).map((kind, i) => {
        const alpha = i === 2 ? check : 1;
        const cx = mix(L.mainCenters[i], L.dockArtCenters[i], shapeDock);
        return <g key={kind} opacity={alpha}>
          <Illustration kind={kind} cx={cx} top={artTop} height={artHeight} />
          <Label id={(['request', 'agent-work', 'checked-result'] as const)[i]}
            x={mix(L.mainCenters[i], L.dockLabelCenters[i], shapeDock)} y={labelY} size={labelSize}
            color={i === 0 ? C.blue : i === 2 ? C.green : C.white} />
        </g>;
      })}
      <Arrow d={`M${mix(575, 575, dock)} ${mix(470, 130, dock)} Q${mix(647, 625, dock)} ${mix(458, 125, dock)} ${mix(720, 675, dock)} ${mix(470, 130, dock)}`}
        head={`M${mix(701, 656, dock)} ${mix(457, 117, dock)} L${mix(720, 675, dock)} ${mix(470, 130, dock)} L${mix(700, 655, dock)} ${mix(483, 143, dock)}`}
        color={C.blue} relation="request-to-agent" progress={ease(t, time.task, .45)} />
      <Arrow d={`M${mix(1200, 1175, dock)} ${mix(470, 130, dock)} Q${mix(1270, 1225, dock)} ${mix(458, 125, dock)} ${mix(1340, 1275, dock)} ${mix(470, 130, dock)}`}
        head={`M${mix(1321, 1256, dock)} ${mix(457, 117, dock)} L${mix(1340, 1275, dock)} ${mix(470, 130, dock)} L${mix(1320, 1255, dock)} ${mix(483, 143, dock)}`}
        color={C.green} relation="agent-to-result" progress={check} opacity={check} />
    </g>

    <g opacity={programmer * (1 - ease(t, time.terminal - .25, .25))}>
      <Label id="programmer" x={960} y={560} size={88} color={C.white} />
    </g>
    <g opacity={desktop} data-visual-anchor="desktop-shell">
      <g clipPath="url(#entry-shell-clip)">
        <image href={staticFile(scene.screenshots.desktop)} x={desktopX} y={L.screenshotY}
          width={L.desktopWidth} height={L.desktopHeight} preserveAspectRatio="xMidYMid meet" />
      </g>
      <rect x={panelX - 6} y={panelY - 6} width={panelWidth + 12} height={panelHeight + 12}
        rx="18" fill="none" stroke={C.blue} strokeWidth="3" filter="url(#entry-chalk)" opacity={1 - wrap} />
      <g opacity={message}>
        <Chalk d={`M${inputX + 18} ${inputY} Q${inputX - 3} ${inputY - 3} ${inputX} ${inputY + 18} L${inputX} ${inputY + inputH - 16} Q${inputX - 2} ${inputY + inputH + 2} ${inputX + 18} ${inputY + inputH} L${inputX + inputW - 18} ${inputY + inputH} Q${inputX + inputW + 3} ${inputY + inputH + 2} ${inputX + inputW} ${inputY + inputH - 16} L${inputX + inputW} ${inputY + 18} Q${inputX + inputW + 2} ${inputY - 2} ${inputX + inputW - 18} ${inputY} Z`}
          stroke={C.blue} strokeWidth="4" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - message} />
      </g>
    </g>

    <g opacity={terminal} data-visual-anchor="real-terminal"
      transform={`translate(${L.screenshotCenterX} ${L.screenshotCenterY}) scale(${terminalScale}) translate(${-L.screenshotCenterX} ${-L.screenshotCenterY})`}>
      <g clipPath="url(#entry-terminal-clip)">
        <image href={staticFile(scene.screenshots.terminal)} x={terminalX} y={L.screenshotY}
          width={L.terminalWidth} height={L.terminalHeight} preserveAspectRatio="xMidYMid meet" />
      </g>
    </g>
  </svg>;
};
