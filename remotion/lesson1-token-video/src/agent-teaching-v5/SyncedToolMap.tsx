import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import rows from './tool-map.timeline.json';
import {ToolMapLayout} from '../agent-shared/ToolMapLayout';
import data from './course.storyboard.json';

const scenes = data.scenes.filter((scene) => /^s3[1-7]$/.test(scene.id));
const summary = data.scenes.find((scene) => scene.id === 's38')!;
export const TOOL_MAP_START = scenes[0].startFrame;
export const TOOL_MAP_END = summary.startFrame + summary.durationInFrames;
// Preserve the existing word-level narration timing.
export const SyncedToolMap: React.FC<{showAll?: boolean}> = ({showAll = false}) => {
 const frame=useCurrentFrame(),absoluteFrame=frame+TOOL_MAP_START;
 const reveal=(seconds:number)=>showAll?1:interpolate(absoluteFrame,[Math.ceil(seconds*30),Math.ceil(seconds*30)+8],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
 return <ToolMapLayout rows={rows} reveal={reveal} seconds={showAll?undefined:absoluteFrame/30}/>;
};
