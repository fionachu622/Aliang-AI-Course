import {ChalkText} from './CourseTypography';
import React from 'react';
import {staticFile} from 'remotion';
import storyboard from './continuous-diagrams.storyboard.json';

const scene = storyboard.agent_entry_evolution;
const time = Object.fromEntries(scene.states.map((state) => [state.id, state.at]));
const words = scene.screen_text;
const C = {
  white: '#F5F1E8',
  blue: '#7CC8EA',
  green: '#A4D486',
  muted: '#B1B4AD',
  pink: '#F18D9E',
  dark: '#151D20',
};
const ease = (t: number, at: number, duration = 0.38) => {
  const q = Math.max(0, Math.min(1, (t - at) / duration));
  return q * q * (3 - 2 * q);
};

const Label: React.FC<{
  id: keyof typeof words;
  x: number;
  y: number;
  size: number;
  color?: string;
  opacity?: number;
}> = ({id, x, y, size, color = C.white, opacity = 1}) => (
  <ChalkText data-knowledge={id} x={x} y={y} textAnchor="middle" fontSize={size} fill={color} opacity={opacity}>
    {words[id].text}
  </ChalkText>
);

const Arrow: React.FC<{
  d: string;
  head: string;
  color: string;
  relation: string;
  opacity?: number;
  progress?: number;
}> = ({d, head, color, relation, opacity = 1, progress = 1}) => (
  <g data-relation={relation} opacity={opacity} fill="none" stroke={color} strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} pathLength={1} strokeDasharray="1" strokeDashoffset={1 - progress} />
    <path d={head} opacity={progress > 0.95 ? 1 : 0} />
  </g>
);

const Chalk: React.FC<React.SVGProps<SVGPathElement>> = (props) => (
  <path {...props} fill={props.fill ?? 'none'} strokeLinecap="round" strokeLinejoin="round" filter="url(#entry-chalk)" />
);

// The file-sorting demonstration becomes a small new sketch; the two access modes own the frame.
export const AgentEntryEvolution: React.FC<{seconds: number}> = ({seconds: t}) => {
  const check = ease(t, time.check);
  const shrink = ease(t, time.compress, 0.85);
  const scale = 1 - 0.28 * shrink;
  const programmer = ease(t, time.programmer);
  const terminal = ease(t, time.terminal, 0.58);
  const coding = ease(t, time['coding-agent']);
  const barrier = ease(t, time['terminal-barrier']);
  const desktop = ease(t, time.desktop, 0.7);
  const wrap = ease(t, time.desktop, scene.shell_transition.duration);
  const cover = ease(t, time.desktop + 0.65, 0.95);
  const shellWidth = 658 + (902 - 658) * wrap;
  const message = ease(t, time['plain-language']);
  const everyone = ease(t, time.everyone, 0.5);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1920"
      height="1080"
      viewBox="0 0 1920 1080"
      style={{position: 'absolute', inset: 0, fontFamily: 'AgentFullHanzi, HanziPen SC, cursive'}}
      data-one-page="agent-entry-evolution"
    >
      <defs>
        <filter id="entry-chalk" x="-10%" y="-30%" width="120%" height="160%">
          <feTurbulence type="fractalNoise" baseFrequency=".38" numOctaves="2" seed="11" result="grain" />
          <feDisplacementMap in="SourceGraphic" in2="grain" scale="1.1" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <clipPath id="entry-shell-clip">
          <rect x={960 - shellWidth / 2} y="439" width={shellWidth} height="456" rx="14" />
        </clipPath>
        <mask id="entry-shell-reveal">
          <rect x="509" y="439" width="902" height="456" fill="white" />
          <rect x={631 + 329 * cover} y={439 + 228 * cover} width={658 * (1 - cover)} height={456 * (1 - cover)} rx="14" fill="black" />
        </mask>
      </defs>

      {/* A fresh chalk sketch recalls the just-seen folder task, then moves above the access comparison. */}
      <g
        data-visual-anchor="task-agent-review"
        opacity={ease(t, time.task, 0.32)}
        transform={`translate(${960 * (1 - scale)} ${-170 * shrink}) scale(${scale})`}
      >
        <g stroke={C.blue} strokeWidth="4">
          <Chalk d="M210 370 Q210 346 235 344 L490 344 Q516 345 516 372 L518 469 Q518 490 491 491 L342 490 L310 517 L312 490 L235 491 Q210 490 210 466 Z" />
          <Chalk d="M288 397 L340 397 L359 410 L432 410 Q442 411 442 422 L442 457 L288 457 Z" strokeWidth="3.5" />
        </g>
        <Label id="request" x={362} y={630} size={54} />
        <Arrow d="M555 430 Q656 424 765 429" head="M748 417L765 429L748 441" color={C.blue} relation="request-to-agent" progress={ease(t,time.task,.45)} />

        <g stroke={C.white} strokeWidth="3.8">
          <Chalk d="M916 342 L987 342 L1008 364 L1008 432 L916 432 Z" />
          <Chalk d="M987 342 L987 364 L1008 364 M933 380 L987 379 M933 397 L976 397" strokeWidth="2.5" />
          <Chalk d="M957 440 Q959 466 918 477 M969 440 Q972 464 1013 477" stroke={C.blue} strokeWidth="3" />
          <Chalk d="M835 482 L876 482 L889 493 L928 493 L928 523 L835 523 Z M996 482 L1036 482 L1049 493 L1088 493 L1088 523 L996 523 Z" stroke={C.blue} />
        </g>
        <Label id="agent-work" x={960} y={630} size={54} />

        <g opacity={check}>
          <Arrow d="M1154 429 Q1255 424 1363 429" head="M1346 417L1363 429L1346 441" color={C.green} progress={check} relation="agent-to-result" />
          <g stroke={C.green} strokeWidth="3.7">
            <Chalk d="M1474 359 Q1474 342 1492 342 L1601 342 Q1620 342 1620 361 L1620 484 Q1620 499 1602 500 L1492 500 Q1473 499 1474 483 Z" />
            <Chalk d="M1502 386 L1514 398 L1534 373 M1547 386 L1591 385 M1502 439 L1514 450 L1534 425 M1547 437 L1591 436" strokeWidth="3" />
            <Chalk d="M1600 482 Q1617 464 1637 458 M1626 456 L1637 458 L1632 471" strokeWidth="3" />
          </g>
          <Label id="checked-result" x={1550} y={630} size={54} />
        </g>
      </g>

      {/* Both supplied screenshots share a center: the desktop shell grows around the terminal. */}
      <g opacity={programmer * (1 - terminal)}>
        <Label id="programmer" x={960} y={355} size={48} color={C.muted} />
      </g>
      <g opacity={terminal * (1 - desktop)}>
        <Label id="terminal" x={960} y={355} size={48} color={C.muted} />
        <Label id="terminal-command" x={320} y={570} size={38} />
        <Label id="terminal-barrier" x={320} y={655} size={38} color={C.pink} opacity={barrier} />
        <ChalkText x="1570" y="580" textAnchor="middle" fontSize="40" fill={C.blue} opacity={coding}>Coding Agent</ChalkText>
      </g>
      <g opacity={terminal * (1 - cover)} data-visual-anchor="real-terminal">
        <image href={staticFile(scene.screenshots.terminal)} x="631" y="439" width="658" height="456" preserveAspectRatio="xMidYMid meet" />
      </g>
      <g opacity={desktop} data-visual-anchor="desktop-shell">
        <Label id="desktop" x={960} y={355} size={48} color={C.blue} opacity={1 - everyone} />
        <Label id="everyone" x={960} y={355} size={48} color={C.green} opacity={everyone} />
        <g clipPath="url(#entry-shell-clip)" mask="url(#entry-shell-reveal)">
          <image href={staticFile(scene.screenshots.desktop)} x="509" y="439" width="902" height="456" preserveAspectRatio="xMidYMid meet" />
        </g>
        <rect x={960 - shellWidth / 2 - 7} y="432" width={shellWidth + 14} height="470" rx="18" fill="none" stroke={C.blue} strokeWidth="3.5" filter="url(#entry-chalk)" opacity={1 - message} />
        <g opacity={message}>
          <Chalk d="M760 826 Q753 822 750 838 L750 875 Q750 885 765 885 L1326 885 Q1343 884 1343 870 L1343 840 Q1342 825 1326 825 Z" stroke={C.blue} strokeWidth="4" />
          <Label id="desktop-message" x={1630} y={745} size={42} color={C.blue} />
          <Arrow d="M1590 778 Q1505 828 1372 848" head="M1388 835L1372 848L1392 856" color={C.blue} relation="plain-language-input" progress={message} />
        </g>
      </g>

      <g data-knowledge="unchanged-agent-core">
        <Label id="core-1" x={660} y={995} size={43} color={C.blue} opacity={ease(t, scene.core_step_times[0])} />
        <Arrow d="M764 978 Q810 974 853 978" head="M837 968L853 978L837 988" color={C.blue} relation="core-demand-to-tool" progress={ease(t, scene.core_step_times[1],.45)} opacity={ease(t, scene.core_step_times[1])} />
        <Label id="core-2" x={960} y={995} size={43} color={C.blue} opacity={ease(t, scene.core_step_times[1])} />
        <Arrow d="M1065 978 Q1117 972 1152 978" head="M1136 968L1152 978L1136 988" color={C.blue} relation="core-tool-to-result" progress={ease(t, scene.core_step_times[2],.45)} opacity={ease(t, scene.core_step_times[2])} />
        <Label id="core-3" x={1260} y={995} size={43} color={C.green} opacity={ease(t, scene.core_step_times[2])} />
      </g>
    </svg>
  );
};
