// Size the foreground directly; the full-canvas wrapper centers it without translation.
export const OPENING_SCENE_SCALE = 0.64;
export const OPENING_SCENE_WIDTH = 1920 * OPENING_SCENE_SCALE;
export const OPENING_SCENE_HEIGHT = 1080 * OPENING_SCENE_SCALE;

// Keep horizontal centering; lift the scene slightly toward the optical focus.
export const OPENING_SCENE_FOCUS_Y = 490;
export const OPENING_SCENE_TOP = OPENING_SCENE_FOCUS_Y - OPENING_SCENE_HEIGHT / 2;

// Share one handoff clock for the person and pet, as in AgentOpening-First3.
import {interpolate, Easing} from 'remotion';
export const openingHandoffProgress = (frame: number) => interpolate(frame, [585, 639], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(.22, .7, .25, 1)});
