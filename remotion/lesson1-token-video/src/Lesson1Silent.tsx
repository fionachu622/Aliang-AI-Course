import {Series} from 'remotion';
import {
  EncodeDecodeScene,
  ImpactScene,
  LlmScene,
  PredictionScene,
  ProductScene,
  StreamingScene,
  TokenDefinitionScene,
  TokenizerDemoScene,
  TokenizerScene,
  VariableTokenScene,
} from './Scenes';
import {PaperBackground, RevealAt} from './components/VisualKit';
import {colors, fonts} from './theme';
import {FPS} from './timeline';
import {SILENT_COVER_FRAMES, SILENT_SCENES} from './silentTimeline';

const SilentCover = () => (
  <PaperBackground>
    <RevealAt at={0.25} style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{textAlign: 'center'}}>
        <div style={{fontSize: 24, letterSpacing: 6, color: colors.muted}}>AI 通识课 · 第 1 课</div>
        <div style={{fontFamily: fonts.hand, fontSize: 108, fontWeight: 850, marginTop: 28}}>
          从大模型到 Token
        </div>
        <div style={{fontSize: 34, color: colors.green, marginTop: 28}}>
          看懂 AI 如何一步步生成回答
        </div>
        <div style={{fontSize: 22, color: colors.muted, marginTop: 56}}>静音阅读版 · 约 5 分钟</div>
      </div>
    </RevealAt>
  </PaperBackground>
);

export const Lesson1Silent = () => (
  <Series>
    <Series.Sequence durationInFrames={SILENT_COVER_FRAMES} premountFor={FPS}>
      <SilentCover />
    </Series.Sequence>
    <Series.Sequence durationInFrames={SILENT_SCENES[0].durationInFrames} premountFor={FPS}>
      <ProductScene meta={SILENT_SCENES[0]} index={1} />
    </Series.Sequence>
    <Series.Sequence durationInFrames={SILENT_SCENES[1].durationInFrames} premountFor={FPS}>
      <LlmScene meta={SILENT_SCENES[1]} index={2} />
    </Series.Sequence>
    <Series.Sequence durationInFrames={SILENT_SCENES[2].durationInFrames} premountFor={FPS}>
      <PredictionScene meta={SILENT_SCENES[2]} index={3} />
    </Series.Sequence>
    <Series.Sequence durationInFrames={SILENT_SCENES[3].durationInFrames} premountFor={FPS}>
      <StreamingScene meta={SILENT_SCENES[3]} index={4} />
    </Series.Sequence>
    <Series.Sequence durationInFrames={SILENT_SCENES[4].durationInFrames} premountFor={FPS}>
      <TokenDefinitionScene meta={SILENT_SCENES[4]} index={5} />
    </Series.Sequence>
    <Series.Sequence durationInFrames={SILENT_SCENES[5].durationInFrames} premountFor={FPS}>
      <TokenizerScene meta={SILENT_SCENES[5]} index={6} />
    </Series.Sequence>
    <Series.Sequence durationInFrames={SILENT_SCENES[6].durationInFrames} premountFor={FPS}>
      <EncodeDecodeScene meta={SILENT_SCENES[6]} index={7} />
    </Series.Sequence>
    <Series.Sequence durationInFrames={SILENT_SCENES[7].durationInFrames} premountFor={FPS}>
      <VariableTokenScene meta={SILENT_SCENES[7]} index={8} />
    </Series.Sequence>
    <Series.Sequence durationInFrames={SILENT_SCENES[8].durationInFrames} premountFor={FPS}>
      <TokenizerDemoScene meta={SILENT_SCENES[8]} index={9} />
    </Series.Sequence>
    <Series.Sequence durationInFrames={SILENT_SCENES[9].durationInFrames} premountFor={FPS}>
      <ImpactScene meta={SILENT_SCENES[9]} index={10} />
    </Series.Sequence>
  </Series>
);
