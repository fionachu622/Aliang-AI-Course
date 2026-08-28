import {Lesson1OpeningV9} from '../v9/Lesson1OpeningV9';
import {
  VisualBackgroundProvider,
  VisualMotionProvider,
} from '../v9/VisualV9';

export const Lesson1ChalkboardAppleMotionV13 = () => (
  <VisualBackgroundProvider
    backgroundFile="shared-visual/backgrounds/chalkboard/chalkboard.png"
    contentScale={0.86}
    showBoxFinePrint={false}
    showContextRecap={false}
    showSceneNumbers={false}
  >
    <VisualMotionProvider style="apple">
      <Lesson1OpeningV9 timingMode="voiceover" motionStyle="apple" />
    </VisualMotionProvider>
  </VisualBackgroundProvider>
);
