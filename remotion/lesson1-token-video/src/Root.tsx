import {AIPptCourse} from './ai-ppt/AIPptCourse';
import {TOTAL_FRAMES as AI_PPT_DURATION, scenes as aiPptScenes} from './ai-ppt/timeline';
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
import {Composition, Folder} from 'remotion';
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

export const RemotionRoot = () => {
  return (
    <>
      <Folder name="Aliang-AI-Course">
        <Folder name="AI生成PPT">
          <Composition id="AIPptCourse" component={AIPptCourse} durationInFrames={AI_PPT_DURATION} fps={30} width={1920} height={1080} />
          <Folder name="逐段检查">
            <Composition id="AIPpt-s01" component={AIPptCourse} durationInFrames={aiPptScenes[0].durationInFrames} fps={30} width={1920} height={1080} defaultProps={{sceneId: 's01', debug: true}} />
            <Composition id="AIPpt-s02" component={AIPptCourse} durationInFrames={aiPptScenes[1].durationInFrames} fps={30} width={1920} height={1080} defaultProps={{sceneId: 's02', debug: true}} />
            <Composition id="AIPpt-s03" component={AIPptCourse} durationInFrames={aiPptScenes[2].durationInFrames} fps={30} width={1920} height={1080} defaultProps={{sceneId: 's03', debug: true}} />
            <Composition id="AIPpt-s04" component={AIPptCourse} durationInFrames={aiPptScenes[3].durationInFrames} fps={30} width={1920} height={1080} defaultProps={{sceneId: 's04', debug: true}} />
            <Composition id="AIPpt-s05" component={AIPptCourse} durationInFrames={aiPptScenes[4].durationInFrames} fps={30} width={1920} height={1080} defaultProps={{sceneId: 's05', debug: true}} />
            <Composition id="AIPpt-s06" component={AIPptCourse} durationInFrames={aiPptScenes[5].durationInFrames} fps={30} width={1920} height={1080} defaultProps={{sceneId: 's06', debug: true}} />
            <Composition id="AIPpt-s07" component={AIPptCourse} durationInFrames={aiPptScenes[6].durationInFrames} fps={30} width={1920} height={1080} defaultProps={{sceneId: 's07', debug: true}} />
            <Composition id="AIPpt-s08" component={AIPptCourse} durationInFrames={aiPptScenes[7].durationInFrames} fps={30} width={1920} height={1080} defaultProps={{sceneId: 's08', debug: true}} />
            <Composition id="AIPpt-s09" component={AIPptCourse} durationInFrames={aiPptScenes[8].durationInFrames} fps={30} width={1920} height={1080} defaultProps={{sceneId: 's09', debug: true}} />
            <Composition id="AIPpt-s10" component={AIPptCourse} durationInFrames={aiPptScenes[9].durationInFrames} fps={30} width={1920} height={1080} defaultProps={{sceneId: 's10', debug: true}} />
            <Composition id="AIPpt-s11" component={AIPptCourse} durationInFrames={aiPptScenes[10].durationInFrames} fps={30} width={1920} height={1080} defaultProps={{sceneId: 's11', debug: true}} />
            <Composition id="AIPpt-s12" component={AIPptCourse} durationInFrames={aiPptScenes[11].durationInFrames} fps={30} width={1920} height={1080} defaultProps={{sceneId: 's12', debug: true}} />
            <Composition id="AIPpt-s13" component={AIPptCourse} durationInFrames={aiPptScenes[12].durationInFrames} fps={30} width={1920} height={1080} defaultProps={{sceneId: 's13', debug: true}} />
            <Composition id="AIPpt-s14" component={AIPptCourse} durationInFrames={aiPptScenes[13].durationInFrames} fps={30} width={1920} height={1080} defaultProps={{sceneId: 's14', debug: true}} />
            <Composition id="AIPpt-s15" component={AIPptCourse} durationInFrames={aiPptScenes[14].durationInFrames} fps={30} width={1920} height={1080} defaultProps={{sceneId: 's15', debug: true}} />
            <Composition id="AIPpt-s16" component={AIPptCourse} durationInFrames={aiPptScenes[15].durationInFrames} fps={30} width={1920} height={1080} defaultProps={{sceneId: 's16', debug: true}} />
            <Composition id="AIPpt-s17" component={AIPptCourse} durationInFrames={aiPptScenes[16].durationInFrames} fps={30} width={1920} height={1080} defaultProps={{sceneId: 's17', debug: true}} />
            <Composition id="AIPpt-s18" component={AIPptCourse} durationInFrames={aiPptScenes[17].durationInFrames} fps={30} width={1920} height={1080} defaultProps={{sceneId: 's18', debug: true}} />
            <Composition id="AIPpt-s19" component={AIPptCourse} durationInFrames={aiPptScenes[18].durationInFrames} fps={30} width={1920} height={1080} defaultProps={{sceneId: 's19', debug: true}} />
            <Composition id="AIPpt-s20" component={AIPptCourse} durationInFrames={aiPptScenes[19].durationInFrames} fps={30} width={1920} height={1080} defaultProps={{sceneId: 's20', debug: true}} />
            <Composition id="AIPpt-s21" component={AIPptCourse} durationInFrames={aiPptScenes[20].durationInFrames} fps={30} width={1920} height={1080} defaultProps={{sceneId: 's21', debug: true}} />
            <Composition id="AIPpt-s22" component={AIPptCourse} durationInFrames={aiPptScenes[21].durationInFrames} fps={30} width={1920} height={1080} defaultProps={{sceneId: 's22', debug: true}} />
            <Composition id="AIPpt-s23" component={AIPptCourse} durationInFrames={aiPptScenes[22].durationInFrames} fps={30} width={1920} height={1080} defaultProps={{sceneId: 's23', debug: true}} />
            <Composition id="AIPpt-s24" component={AIPptCourse} durationInFrames={aiPptScenes[23].durationInFrames} fps={30} width={1920} height={1080} defaultProps={{sceneId: 's24', debug: true}} />
            <Composition id="AIPpt-s25" component={AIPptCourse} durationInFrames={aiPptScenes[24].durationInFrames} fps={30} width={1920} height={1080} defaultProps={{sceneId: 's25', debug: true}} />
            <Composition id="AIPpt-s26" component={AIPptCourse} durationInFrames={aiPptScenes[25].durationInFrames} fps={30} width={1920} height={1080} defaultProps={{sceneId: 's26', debug: true}} />
            <Composition id="AIPpt-s27" component={AIPptCourse} durationInFrames={aiPptScenes[26].durationInFrames} fps={30} width={1920} height={1080} defaultProps={{sceneId: 's27', debug: true}} />
            <Composition id="AIPpt-s28" component={AIPptCourse} durationInFrames={aiPptScenes[27].durationInFrames} fps={30} width={1920} height={1080} defaultProps={{sceneId: 's28', debug: true}} />
            <Composition id="AIPpt-s29" component={AIPptCourse} durationInFrames={aiPptScenes[28].durationInFrames} fps={30} width={1920} height={1080} defaultProps={{sceneId: 's29', debug: true}} />
            <Composition id="AIPpt-s30" component={AIPptCourse} durationInFrames={aiPptScenes[29].durationInFrames} fps={30} width={1920} height={1080} defaultProps={{sceneId: 's30', debug: true}} />
            <Composition id="AIPpt-s31" component={AIPptCourse} durationInFrames={aiPptScenes[30].durationInFrames} fps={30} width={1920} height={1080} defaultProps={{sceneId: 's31', debug: true}} />
            <Composition id="AIPpt-s32" component={AIPptCourse} durationInFrames={aiPptScenes[31].durationInFrames} fps={30} width={1920} height={1080} defaultProps={{sceneId: 's32', debug: true}} />
            <Composition id="AIPpt-s33" component={AIPptCourse} durationInFrames={aiPptScenes[32].durationInFrames} fps={30} width={1920} height={1080} defaultProps={{sceneId: 's33', debug: true}} />
            <Composition id="AIPpt-s34" component={AIPptCourse} durationInFrames={aiPptScenes[33].durationInFrames} fps={30} width={1920} height={1080} defaultProps={{sceneId: 's34', debug: true}} />
            <Composition id="AIPpt-s35" component={AIPptCourse} durationInFrames={aiPptScenes[34].durationInFrames} fps={30} width={1920} height={1080} defaultProps={{sceneId: 's35', debug: true}} />
            <Composition id="AIPpt-s36" component={AIPptCourse} durationInFrames={aiPptScenes[35].durationInFrames} fps={30} width={1920} height={1080} defaultProps={{sceneId: 's36', debug: true}} />
            <Composition id="AIPpt-s37" component={AIPptCourse} durationInFrames={aiPptScenes[36].durationInFrames} fps={30} width={1920} height={1080} defaultProps={{sceneId: 's37', debug: true}} />
            <Composition id="AIPpt-s38" component={AIPptCourse} durationInFrames={aiPptScenes[37].durationInFrames} fps={30} width={1920} height={1080} defaultProps={{sceneId: 's38', debug: true}} />
            <Composition id="AIPpt-s39" component={AIPptCourse} durationInFrames={aiPptScenes[38].durationInFrames} fps={30} width={1920} height={1080} defaultProps={{sceneId: 's39', debug: true}} />
            <Composition id="AIPpt-s40" component={AIPptCourse} durationInFrames={aiPptScenes[39].durationInFrames} fps={30} width={1920} height={1080} defaultProps={{sceneId: 's40', debug: true}} />
            <Composition id="AIPpt-s41" component={AIPptCourse} durationInFrames={aiPptScenes[40].durationInFrames} fps={30} width={1920} height={1080} defaultProps={{sceneId: 's41', debug: true}} />
            <Composition id="AIPpt-s42" component={AIPptCourse} durationInFrames={aiPptScenes[41].durationInFrames} fps={30} width={1920} height={1080} defaultProps={{sceneId: 's42', debug: true}} />
            <Composition id="AIPpt-s43" component={AIPptCourse} durationInFrames={aiPptScenes[42].durationInFrames} fps={30} width={1920} height={1080} defaultProps={{sceneId: 's43', debug: true}} />
            <Composition id="AIPpt-s44" component={AIPptCourse} durationInFrames={aiPptScenes[43].durationInFrames} fps={30} width={1920} height={1080} defaultProps={{sceneId: 's44', debug: true}} />
            <Composition id="AIPpt-s45" component={AIPptCourse} durationInFrames={aiPptScenes[44].durationInFrames} fps={30} width={1920} height={1080} defaultProps={{sceneId: 's45', debug: true}} />
            <Composition id="AIPpt-s46" component={AIPptCourse} durationInFrames={aiPptScenes[45].durationInFrames} fps={30} width={1920} height={1080} defaultProps={{sceneId: 's46', debug: true}} />
            <Composition id="AIPpt-s47" component={AIPptCourse} durationInFrames={aiPptScenes[46].durationInFrames} fps={30} width={1920} height={1080} defaultProps={{sceneId: 's47', debug: true}} />
            <Composition id="AIPpt-s48" component={AIPptCourse} durationInFrames={aiPptScenes[47].durationInFrames} fps={30} width={1920} height={1080} defaultProps={{sceneId: 's48', debug: true}} />
            <Composition id="AIPpt-s49" component={AIPptCourse} durationInFrames={aiPptScenes[48].durationInFrames} fps={30} width={1920} height={1080} defaultProps={{sceneId: 's49', debug: true}} />
            <Composition id="AIPpt-s50" component={AIPptCourse} durationInFrames={aiPptScenes[49].durationInFrames} fps={30} width={1920} height={1080} defaultProps={{sceneId: 's50', debug: true}} />
            <Composition id="AIPpt-s51" component={AIPptCourse} durationInFrames={aiPptScenes[50].durationInFrames} fps={30} width={1920} height={1080} defaultProps={{sceneId: 's51', debug: true}} />
            <Composition id="AIPpt-s52" component={AIPptCourse} durationInFrames={aiPptScenes[51].durationInFrames} fps={30} width={1920} height={1080} defaultProps={{sceneId: 's52', debug: true}} />
            <Composition id="AIPpt-s53" component={AIPptCourse} durationInFrames={aiPptScenes[52].durationInFrames} fps={30} width={1920} height={1080} defaultProps={{sceneId: 's53', debug: true}} />
            <Composition id="AIPpt-s54" component={AIPptCourse} durationInFrames={aiPptScenes[53].durationInFrames} fps={30} width={1920} height={1080} defaultProps={{sceneId: 's54', debug: true}} />
            <Composition id="AIPpt-s55" component={AIPptCourse} durationInFrames={aiPptScenes[54].durationInFrames} fps={30} width={1920} height={1080} defaultProps={{sceneId: 's55', debug: true}} />
          </Folder>
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
