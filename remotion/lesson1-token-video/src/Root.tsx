import {AIPptCourse} from './ai-ppt/AIPptCourse';
import {TOTAL_FRAMES as AI_PPT_DURATION} from './ai-ppt/timeline';
import {AgentHuashuWhiteboard} from './skill-tests/huashu-art-motion/AgentHuashuWhiteboard';
import {
  AgentFullCourse as AgentTeachingV3,
  AGENT_FULL_DURATION as AGENT_TEACHING_V3_DURATION,
} from './agent-teaching-v3/AgentFullCourse';
import {
  AgentFullCourse as AgentTeachingV4,
  AGENT_FULL_DURATION as AGENT_TEACHING_V4_DURATION,
} from './agent-teaching-v4/AgentFullCourse';
import {
  AgentFullCourse as AgentTeachingV5,
  AGENT_FULL_DURATION as AGENT_TEACHING_V5_DURATION,
} from './agent-teaching-v5/AgentFullCourse';
import {
  AgentFullCourse as AgentTeachingV6,
  AGENT_FULL_DURATION as AGENT_TEACHING_V6_DURATION,
} from './agent-teaching-v6/AgentFullCourse';
import {
  AgentFullCourse as AgentMotionV2,
  AGENT_FULL_DURATION as AGENT_MOTION_V2_DURATION,
} from './agent-motion-v2/AgentFullCourse';
import {
  AgentMixedCourse,
  AGENT_MIXED_DURATION,
} from './agent-course/AgentMixedCourse';
import {
  AgentFullCourse,
  AGENT_FULL_DURATION,
} from './agent-full/AgentFullCourse';
import {
  AgentHtmlExplainer,
  AGENT_HTML_EXPLAINER_DURATION,
} from './skill-tests/html-explainer/AgentHtmlExplainer';
import {AgentOpening, OPENING_DURATION} from './agent-opening/AgentOpening';
import {AgentCourse, AGENT_DURATION} from './agent-course/AgentCourse';
import {
  AgentWhiteboard,
  AGENT_WHITEBOARD_DURATION,
} from './agent-whiteboard/AgentWhiteboard';
import {Composition, Folder, OffthreadVideo, staticFile} from 'remotion';
import {Lesson1ChalkboardShotcraft} from './shotcraft/Lesson1ChalkboardShotcraft';
import {Lesson1} from './Lesson1';
import {Lesson1Silent} from './Lesson1Silent';
import {SILENT_TOTAL_FRAMES} from './silentTimeline';
import {FPS, TOTAL_FRAMES} from './timeline';
import {Lesson1VisualV2} from './v2/Lesson1VisualV2';
import {V2_TOTAL_FRAMES} from './v2/storyboard';
import {Lesson1ChalkboardFull} from './v9/Lesson1ChalkboardFull';
import {Lesson1GeometricLight} from './v9/Lesson1GeometricLight';
import {Lesson1FontPreview} from './v9/Lesson1FontPreview';
import {V9_VOICEOVER_TOTAL_FRAMES} from './v9/storyboard';
import {Lesson1ChalkboardRevised} from './v14/Lesson1ChalkboardRevised';
import {V14_REVISED_TOTAL_FRAMES} from './v14/storyboard';
import {Lesson1ChalkboardJasonHandwriting} from './v15/Lesson1ChalkboardJasonHandwriting';
import {Lesson1ChalkboardRevisedReview} from './v16/Lesson1ChalkboardRevisedReview';
import {REVIEW_VOICEOVER_TOTAL_FRAMES} from './v16/reviewVoiceoverTiming';
import {Lesson1ChalkboardRevisedReviewBold} from './v17/Lesson1ChalkboardRevisedReviewBold';
import {Lesson1ChalkboardRevisedReviewBoldPacingV2} from './v18/Lesson1ChalkboardRevisedReviewBoldPacingV2';
import {Lesson1ChalkboardRevisedReviewBoldPacingCenteredV3} from './v19/Lesson1ChalkboardRevisedReviewBoldPacingCenteredV3';
import {Lesson1ChalkboardRevisedReviewBoldPacingCenteredVerticalV4} from './v20/Lesson1ChalkboardRevisedReviewBoldPacingCenteredVerticalV4';
import {Lesson1ChalkboardRevisedReviewBoldPacingCenteredAppleMotionV5} from './v21/Lesson1ChalkboardRevisedReviewBoldPacingCenteredAppleMotionV5';
import {Lesson1Infographic} from './infographic/Lesson1Infographic';
import {
  INFOGRAPHIC_FPS,
  INFOGRAPHIC_TOTAL_FRAMES,
} from './infographic/storyboard';
import {Lesson1CognitiveBlueprintV2} from './cognitive-blueprint-v2/Lesson1CognitiveBlueprintV2';
import {
  BLUEPRINT_V2_FPS,
  BLUEPRINT_V2_TOTAL_FRAMES,
} from './cognitive-blueprint-v2/storyboard';
import {Lesson1IanBlackboxWeb} from './ian-blackbox/Lesson1IanBlackboxWeb';
import {
  Lesson1ShowMe,
  SHOW_ME_DEFAULT_PROPS,
  SHOW_ME_FPS,
  SHOW_ME_TOTAL_FRAMES,
} from './show-me/Lesson1ShowMe';
import {
  Lesson1Wanghong,
  WANGHONG_DEFAULT_PROPS,
  WANGHONG_FPS,
  WANGHONG_TOTAL_FRAMES,
} from './wanghong/Lesson1Wanghong';
import {
  IAN_BLACKBOX_FPS,
  IAN_BLACKBOX_TOTAL_FRAMES,
} from './ian-blackbox/storyboard';

const Screen16Review = () => <OffthreadVideo src={staticFile('ai-ppt/screen-16-v4.mp4')} pauseWhenBuffering style={{width: '100%', height: '100%'}} />;

export const RemotionRoot = () => {
  return (
    <>
      <Folder name="Aliang-AI-Course">
        <Folder name="AI生成PPT">
          <Composition id="AIPptCourse" component={AIPptCourse} durationInFrames={AI_PPT_DURATION} fps={30} width={1920} height={1080} />
          <Composition id="AIPpt-Screen16-Review" component={Screen16Review} durationInFrames={8136} fps={30} width={2596} height={1440} />
        </Folder>

        <Folder name="大模型与Token">
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
            id="Lesson1ChalkboardV2"
            component={Lesson1ChalkboardRevisedReview}
            durationInFrames={REVIEW_VOICEOVER_TOTAL_FRAMES}
            fps={FPS}
            width={1920}
            height={1080}
          />
          <Composition
            id="Lesson1ChalkboardV3"
            component={
              Lesson1ChalkboardRevisedReviewBoldPacingCenteredAppleMotionV5
            }
            durationInFrames={REVIEW_VOICEOVER_TOTAL_FRAMES}
            fps={FPS}
            width={1920}
            height={1080}
            defaultProps={{fontWeight: 600, strokeWidth: 0.65}}
          />
          <Composition
            id="Lesson1GeometricLight"
            component={Lesson1GeometricLight}
            durationInFrames={V9_VOICEOVER_TOTAL_FRAMES}
            fps={FPS}
            width={1920}
            height={1080}
          />
        </Folder>
        <Folder name="Agent专题课">
          <Composition
            id="AgentTeachingV3"
            component={AgentTeachingV3}
            durationInFrames={AGENT_TEACHING_V3_DURATION}
            fps={30}
            width={1920}
            height={1080}
          />

          <Composition
            id="AgentTeachingV4"
            component={AgentTeachingV4}
            durationInFrames={AGENT_TEACHING_V4_DURATION}
            fps={30}
            width={1920}
            height={1080}
          />

          <Composition
            id="AgentTeachingV5"
            component={AgentTeachingV5}
            durationInFrames={AGENT_TEACHING_V5_DURATION}
            fps={30}
            width={1920}
            height={1080}
          />

          <Composition
            id="AgentOpening-First3"
            component={AgentFullCourse}
            durationInFrames={AGENT_FULL_DURATION}
            fps={30}
            width={1920}
            height={1080}
          />
        </Folder>
        <Folder name="skill测试">
          <Composition
            id="huashu-art-motion"
            component={AgentHuashuWhiteboard}
            durationInFrames={1290}
            fps={30}
            width={1920}
            height={1080}
          />
          <Composition
            id="HTMLExplainer"
            component={AgentHtmlExplainer}
            durationInFrames={AGENT_HTML_EXPLAINER_DURATION}
            fps={30}
            width={1920}
            height={1080}
          />
          <Composition
            id="ChalkboardShotcraft"
            component={Lesson1ChalkboardShotcraft}
            durationInFrames={REVIEW_VOICEOVER_TOTAL_FRAMES}
            fps={FPS}
            width={1920}
            height={1080}
            defaultProps={{fontWeight: 600, strokeWidth: 0.65}}
          />

          <Composition
            id="CanvasDesign"
            component={Lesson1Infographic}
            durationInFrames={INFOGRAPHIC_TOTAL_FRAMES}
            fps={INFOGRAPHIC_FPS}
            width={1920}
            height={1080}
          />
          <Composition
            id="ShowMe"
            component={Lesson1ShowMe}
            durationInFrames={SHOW_ME_TOTAL_FRAMES}
            fps={SHOW_ME_FPS}
            width={1920}
            height={1080}
            defaultProps={SHOW_ME_DEFAULT_PROPS}
          />
          <Composition
            id="Wanghong"
            component={Lesson1Wanghong}
            durationInFrames={WANGHONG_TOTAL_FRAMES}
            fps={WANGHONG_FPS}
            width={1920}
            height={1080}
            defaultProps={WANGHONG_DEFAULT_PROPS}
          />
          <Composition
            id="WhiteboardVideo"
            component={AgentWhiteboard}
            durationInFrames={AGENT_WHITEBOARD_DURATION}
            fps={30}
            width={1920}
            height={1080}
          />
        </Folder>
      </Folder>
    </>
  );
};
