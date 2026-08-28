import {Composition} from 'remotion';
import {Lesson1} from './Lesson1';
import {Lesson1Silent} from './Lesson1Silent';
import {SILENT_TOTAL_FRAMES} from './silentTimeline';
import {FPS, TOTAL_FRAMES} from './timeline';
import {Lesson1VisualV2} from './v2/Lesson1VisualV2';
import {V2_TOTAL_FRAMES} from './v2/storyboard';
import {Lesson1ChalkboardFull} from './v9/Lesson1ChalkboardFull';
import {Lesson1GeometricLight} from './v9/Lesson1GeometricLight';
import {V9_VOICEOVER_TOTAL_FRAMES} from './v9/storyboard';
import {Lesson1ChalkboardAppleMotionV13} from './v13/Lesson1ChalkboardAppleMotionV13';
import {Lesson1Infographic} from './infographic/Lesson1Infographic';
import {
  INFOGRAPHIC_FPS,
  INFOGRAPHIC_TOTAL_FRAMES,
} from './infographic/storyboard';

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="Lesson1Token"
        component={Lesson1}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="Lesson1Silent"
        component={Lesson1Silent}
        durationInFrames={SILENT_TOTAL_FRAMES}
        fps={FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="Lesson1VisualV2"
        component={Lesson1VisualV2}
        durationInFrames={V2_TOTAL_FRAMES}
        fps={FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="Lesson1Chalkboard"
        component={Lesson1ChalkboardFull}
        durationInFrames={V9_VOICEOVER_TOTAL_FRAMES}
        fps={FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="Lesson1ChalkboardAppleMotionV13"
        component={Lesson1ChalkboardAppleMotionV13}
        durationInFrames={V9_VOICEOVER_TOTAL_FRAMES}
        fps={FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="Lesson1GeometricLight"
        component={Lesson1GeometricLight}
        durationInFrames={V9_VOICEOVER_TOTAL_FRAMES}
        fps={FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="Lesson1InfographicFirst3"
        component={Lesson1Infographic}
        durationInFrames={INFOGRAPHIC_TOTAL_FRAMES}
        fps={INFOGRAPHIC_FPS}
        width={1920}
        height={1080}
      />
    </>
  );
};
