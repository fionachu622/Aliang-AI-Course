import {Lesson1OpeningV9} from './Lesson1OpeningV9';
import {VisualBackgroundProvider} from './VisualV9';

export const Lesson1ChalkboardFull = () => (
  <VisualBackgroundProvider
    backgroundFile="shared-visual/backgrounds/chalkboard/chalkboard.png"
    contentScale={0.86}
    showBoxFinePrint={false}
    showContextRecap={false}
    showSceneNumbers={false}
  >
    <Lesson1OpeningV9 timingMode="voiceover" />
  </VisualBackgroundProvider>
);
