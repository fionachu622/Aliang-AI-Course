import {ChalkText} from './CourseTypography';
import React from 'react';
import storyboard from './continuous-diagrams.storyboard.json';
import stages from './visual-stages.json';
import {DiagramIcon} from './DiagramIcon';
type Node = {
  id: string;
  text: string;
  shape: string;
  color: string;
  at: number;
  sub: string;
  subAt: number;
  hidden?: boolean;
  lineAts?: number[];
};
type Stage = {
  id: string;
  nodes: Node[];
  edges: (typeof stages)[number]['edges'];
};
type Placement = {
  x: number;
  y: number;
  size: number;
  text_only: boolean;
  symbol?: string;
  icon_scale?: number;
  label_offset?: number;
};
type Layout = {
  kind: string;
  visual_thesis: string;
  nodes: Record<string, Placement>;
  edge_paths: Record<string, string>;
  line_times?: Record<string, number[]>;
  feedback_at?: number;
  rest_after: number;
  quantity_animation?: {start: number; end: number; node_id: string};
  closing_flow?: {at: number; source_paragraph: string; source_excerpt: string};
};
export const diagramLayouts = storyboard.stage_layouts as Record<
  string,
  Layout
>;
const C: Record<string, string> = {
  white: '#F5F1E8',
  blue: '#7CC8EA',
  pink: '#F18D9E',
  green: '#A4D486',
  yellow: '#F0D26A',
};
const ease = (t: number, at: number, d = 0.38) => {
  const v = Math.max(0, Math.min(1, (t - at) / d));
  return v * v * (3 - 2 * v);
};
const hidden = (n: Node) => 'hidden' in n && n.hidden;
const fit = (s: string, size: number, w: number) =>
  Math.min(
    size,
    w /
      Math.max(
        1,
        [...s].reduce((a, c) => a + (/[\x00-\x7f]/.test(c) ? 0.54 : 1), 0),
      ),
  );
export function ContinuousDiagram({
  stage,
  seconds: t,
  still = false,
  assetUrl,
  reviewStillUrl,
}: {
  stage: Stage;
  seconds: number;
  still?: boolean;
  assetUrl: string;
  reviewStillUrl?: string;
}) {
  const cfg = diagramLayouts[stage.id];
  if (!cfg) return null;
  const amount = (at: number) => (still ? 1 : ease(t, at));
  const visible = stage.nodes.filter((n) => !hidden(n));
  const symbol = (n: Node, p: Placement) => {
    const c = C[n.color],
      kind = p.symbol ?? n.shape;
    if (cfg.kind === 'inspection' && n.id === 's14-n0' && reviewStillUrl)
      return (
        <g>
          <image
            href={reviewStillUrl}
            x={-290}
            y={-185}
            width={580}
            height={369}
            preserveAspectRatio="xMidYMid meet"
          />
          <path
            d="M-302 -196 Q-9 -202 302 -194 L302 195 Q-8 201 -301 194 Z"
            fill="none"
            stroke={c}
            strokeWidth={3}
            strokeOpacity={0.85}
          />
        </g>
      );
    if (kind === 'agent')
      return (
        <g>
          <rect
            x={-148}
            y={-93}
            width={296}
            height={185}
            rx={25}
            stroke={c}
            strokeWidth={3}
            fill={c}
            fillOpacity={0.035}
          />
          <ChalkText
            x={0}
            y={22}
            textAnchor="middle"
            fill={c}
            fontSize={fit(n.text, 76, 266)}
          >
            {n.text}
          </ChalkText>
        </g>
      );
    if (kind === 'pause')
      return (
        <g fill="none" stroke={c} strokeWidth={6}>
          <circle r={69} />
          <path d="M-19 -29V29 M19 -29V29" />
        </g>
      );
    const scale = p.icon_scale ?? 1.4;
    if (cfg.quantity_animation?.node_id === n.id) {
      const motion = cfg.quantity_animation;
      const used = still ? 1 : ease(t, motion.start, motion.end - motion.start);
      return (
        <g stroke={c} strokeWidth={3} fill="none">
          <rect x={-125} y={-40} width={250} height={80} />
          <rect
            x={-115}
            y={-30}
            width={220 - 90 * used}
            height={60}
            fill={c}
            fillOpacity={0.45}
            stroke="none"
          />
        </g>
      );
    }
    return (
      <g transform={`translate(${-85 * scale} ${-75 * scale}) scale(${scale})`}>
        <DiagramIcon kind={kind} color={c} />
      </g>
    );
  };
  const text = (
    s: string,
    x: number,
    y: number,
    size: number,
    c: string,
    w = 480,
  ) => (
    <ChalkText x={x} y={y} textAnchor="middle" fontSize={fit(s, size, w)} fill={c}>
      {s}
    </ChalkText>
  );
  const connector = (e: Stage['edges'][number]) => {
    const na = stage.nodes[e.a],
      nb = stage.nodes[e.b];
    if (hidden(na) || hidden(nb)) return null;
    const pa = cfg.nodes[na.id],
      pb = cfg.nodes[nb.id];
    if (!pa || !pb || ['brief', 'delivery'].includes(cfg.kind)) return null;
    const at = Math.max(e.at, na.at, nb.at),
      v = amount(at),
      dx = pb.x - pa.x,
      dy = pb.y - pa.y;
    let x1: number, y1: number, x2: number, y2: number;
    if (Math.abs(dx) > Math.abs(dy)) {
      const sign = Math.sign(dx);
      x1 = pa.x + sign * (cfg.kind === 'inspection' && na.id === 's14-n0' && reviewStillUrl ? 305 : pa.text_only ? 190 : 175);
      x2 = pb.x - sign * (pb.text_only ? 190 : 175);
      y1 = pa.y - (pa.text_only ? 18 : 0);
      y2 = pb.y - (pb.text_only ? 18 : 0);
    } else {
      const sign = Math.sign(dy);
      x1 = pa.x;
      x2 = pb.x;
      y1 = pa.y + sign * (sign > 0 ? 170 : 105);
      y2 = pb.y - sign * (sign > 0 ? 110 : 175);
    }
    const d = cfg.edge_paths[e.id] ?? `M${x1} ${y1} L${x2} ${y2}`;
    const arrow = e.type === 'sequence' && cfg.kind !== 'comparison',
      feedback = cfg.kind === 'cycle' && e.a === 3,
      c = feedback ? C.yellow : C.blue;
    return (
      <g key={e.id} data-relation={e.id} data-at={at} opacity={v}>
        <path
          d={d}
          fill="none"
          stroke={c}
          strokeWidth={3.5}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={
            e.type === 'correspondence' && cfg.kind === 'revision'
              ? '.015 .014'
              : 1
          }
          strokeDashoffset={e.type === 'correspondence' ? 0 : 1 - v}
          markerEnd={
            arrow && v > 0.95
              ? `url(#${stage.id}-${feedback ? 'feedback' : 'arrow'})`
              : undefined
          }
        />
        {e.label &&
          cfg.kind !== 'revision' &&
          text(
            e.label,
            (x1 + x2) / 2 + (Math.abs(dx) < 100 ? 95 : 0),
            (y1 + y2) / 2 - 22,
            34,
            c,
            300,
          )}
      </g>
    );
  };
  const closing = cfg.kind === 'recap' ? cfg.closing_flow?.at : undefined;
  const closingFirst = closing === undefined ? 0 : still ? 1 : ease(t, closing + 0.35, 1.15);
  const closingSecond = closing === undefined ? 0 : still ? 1 : ease(t, closing + 2.55, 1.15);
  return (
    <g data-continuous-diagram={stage.id} aria-label={cfg.visual_thesis}>
      <defs>
        {[
          ['arrow', C.blue],
          ['feedback', C.yellow],
        ].map(([id, c]) => (
          <marker
            key={id}
            id={`${stage.id}-${id}`}
            viewBox="0 0 12 12"
            markerWidth={12}
            markerHeight={12}
            refX={10}
            refY={6}
            orient="auto"
            markerUnits="userSpaceOnUse"
          >
            <path d="M1 1L10 6L1 11" fill="none" stroke={c} strokeWidth={2.5} />
          </marker>
        ))}
      </defs>
      {cfg.kind === 'brief' && (
        <g opacity={amount(stage.nodes[1].at)}>
          <path
            d="M820 155H1535L1610 230V850H820Z M1535 155V230H1610"
            fill="#F5F1E8"
            fillOpacity={0.025}
            stroke={C.blue}
            strokeWidth={3}
          />
          <path
            d="M650 420H790"
            stroke={C.blue}
            strokeWidth={3}
            markerEnd={`url(#${stage.id}-arrow)`}
          />
        </g>
      )}
      {cfg.kind === 'delivery' && (
        <g opacity={amount(stage.nodes[0].at)}>
          <rect
            x={490}
            y={190}
            width={940}
            height={610}
            rx={20}
            stroke={C.blue}
            strokeWidth={3}
            fill="none"
          />
          <path d="M490 310H1430" stroke={C.blue} strokeWidth={2} />
        </g>
      )}
      {stage.edges.map(connector)}
      {closing !== undefined && (closingFirst > 0 || closingSecond > 0) && (
        <g data-closing-flow="one-small-task" fill="none" stroke={C.yellow} strokeWidth={5} strokeLinecap="round">
          <path d="M555 415H785" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - closingFirst} opacity={closingFirst} />
          <path d="M1135 415H1365" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - closingSecond} opacity={closingSecond} />
        </g>
      )}
      {visible.map((n) => {
        const p = cfg.nodes[n.id];
        if (!p) return null;
        const i = stage.nodes.indexOf(n),
          isAgent = n.shape === 'agent',
          isBrief = cfg.kind === 'brief' && i > 0,
          labelY = p.text_only ? 0 : (p.label_offset ?? 145);
        const times =
          cfg.line_times?.[n.id] ?? ('lineAts' in n ? n.lineAts : undefined);
        return (
          <g
            key={n.id}
            data-node={n.id}
            data-at={n.at}
            opacity={amount(n.at)}
            transform={`translate(${p.x} ${p.y})`}
          >
            {!p.text_only &&
              !(cfg.kind === 'delivery' && i === 0) &&
              symbol(n, p)}
            {!(isAgent && !p.text_only) &&
              n.text.split('\n').map((line, j) => (
                <g
                  key={j}
                  data-line={j}
                  data-at={times?.[j] ?? n.at}
                  opacity={amount(times?.[j] ?? n.at)}
                >
                  {text(
                    line,
                    0,
                    (cfg.kind === 'delivery' && i === 0 ? 0 : labelY) +
                      j * (isBrief ? 66 : 60),
                    cfg.kind === 'delivery' && i === 0 ? 64 : p.size,
                    C[n.color],
                    cfg.kind === 'matrix'
                      ? 460
                      : isBrief
                        ? 600
                        : cfg.kind === 'comparison'
                          ? 650
                          : 480,
                  )}
                </g>
              ))}
            {n.sub && (
              <g data-sub={n.id} data-at={n.subAt} opacity={amount(n.subAt)}>
                {n.sub.split('\n').map((line, j) => (
                  <React.Fragment key={j}>
                    {text(
                      line,
                      0,
                      (cfg.kind === 'gates' ? 335 : labelY + 78) + j * 55,
                      cfg.kind === 'comparison' ? 43 : 38,
                      C.white,
                      cfg.kind === 'comparison' ? 700 : 475,
                    )}
                  </React.Fragment>
                ))}
              </g>
            )}
            {cfg.kind === 'gates' && (
              <g opacity={amount(n.subAt)}>
                <path
                  d="M0 180V235 M-12 251V286 M12 251V286"
                  fill="none"
                  stroke={C.yellow}
                  strokeWidth={4}
                />
              </g>
            )}
          </g>
        );
      })}
    </g>
  );
}
