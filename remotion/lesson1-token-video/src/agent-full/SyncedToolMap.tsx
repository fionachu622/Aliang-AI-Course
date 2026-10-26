import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import rows from './tool-map.timeline.json';
import {v9Colors as C} from '../v9/VisualV9';
import data from './course.storyboard.json';

const scenes = data.scenes.filter((scene) => /^s3[1-7]$/.test(scene.id));
const summary = data.scenes.find((scene) => scene.id === 's38')!;
export const TOOL_MAP_START = scenes[0].startFrame;
export const TOOL_MAP_END = summary.startFrame + summary.durationInFrames;
const columns = '250px 690px minmax(0, 1fr)';

// Reveal spoken items progressively; retain completed rows on the same page.
export const SyncedToolMap: React.FC<{showAll?: boolean}> = ({showAll = false}) => {
  const frame = useCurrentFrame();
  const absoluteFrame = frame + TOOL_MAP_START;
  const active = scenes.findIndex((scene) => absoluteFrame >= scene.startFrame && absoluteFrame < scene.startFrame + scene.durationInFrames);
  const fade = showAll ? 1 : interpolate(frame, [0, 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const reveal=(seconds:number)=>showAll?1:interpolate(absoluteFrame,[Math.ceil(seconds*30),Math.ceil(seconds*30)+8],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  const summaryVisible = absoluteFrame >= Math.ceil(1060*30);
  const activeNote=active>=0?scenes[active].nodes.at(-1):undefined;
  const noteAt=[975.56,991.16,1002.92,1014.52,1026.69,1040.25,1054.32][active];
  return <AbsoluteFill style={{padding: '52px 80px', opacity: fade, WebkitTextStroke: '.35px currentColor'}}>
    <div style={{fontSize: 68, textAlign: 'center', height: 100}}>Agent 工具地图</div>
    <div style={{display: 'grid', gridTemplateColumns: columns, padding: '0 26px 18px', fontSize: 42, color: C.blue, borderBottom: '2px solid rgba(245,241,232,.5)'}}>
      <span>使用场景</span><span>国内工具</span><span>海外工具</span>
    </div>
    {rows.map((row, index) => {
      const selected = !showAll && index === active;
      const amount = selected ? interpolate(absoluteFrame - scenes[index].startFrame, [0, 12], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 0;
      return <div key={row.label} data-tool-row={index} style={{display: 'grid', gridTemplateColumns: columns, alignItems: 'center', height: 88, flexShrink: 0, padding: '0 22px', borderLeft: `4px solid ${selected ? C.yellow : 'transparent'}`, borderBottom: '1px solid rgba(245,241,232,.18)', background: `rgba(240,210,106,${amount * .10})`, lineHeight: 1.28, fontSize: 36, whiteSpace: 'pre-line'}}>
        <span style={{opacity:reveal(row.at),fontSize:40,color:selected?C.yellow:C.blue}}>{row.label}</span>
        <span>{row.domestic.map((part,i)=><span key={i} style={{opacity:reveal(part.at)}}>{part.text}</span>)}</span>
        <span>{row.overseas.map((part,i)=><span key={i} style={{opacity:reveal(part.at)}}>{part.text}</span>)}</span>
      </div>;
    })}

  </AbsoluteFill>;
};
