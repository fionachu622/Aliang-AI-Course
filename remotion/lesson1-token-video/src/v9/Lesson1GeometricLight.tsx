import {Lesson1OpeningV9} from './Lesson1OpeningV9';
import {VisualBackgroundProvider} from './VisualV9';

export const Lesson1GeometricLight = () => (
  <VisualBackgroundProvider
    backgroundFile="shared-visual/backgrounds/geometric/geometric-grid-light.png"
    contentScale={0.86}
    showBoxFinePrint={false}
    showContextRecap={false}
    showSceneNumbers={false}
  >
    <Lesson1OpeningV9 timingMode="voiceover" />
  </VisualBackgroundProvider>
);
