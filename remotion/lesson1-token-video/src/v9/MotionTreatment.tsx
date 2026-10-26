import {createContext, useContext} from 'react';
import type {CSSProperties} from 'react';

export type LayerMotionInput = {
  amount: number;
  fromX: number;
  fromY: number;
  fromScale: number;
};

/** Opt-in presentation only. A null provider preserves the historical pixels. */
export const MotionTreatmentContext = createContext<{
  layerStyle: (input: LayerMotionInput) => CSSProperties;
  strokeProgress: (progress: number) => number;
  tracePen: boolean;
  externalBackground: boolean;
} | null>(null);

export const useMotionTreatment = () => useContext(MotionTreatmentContext);
