import type {ReactNode} from 'react';
import {Audio} from '@remotion/media';
import {Series, staticFile} from 'remotion';
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
import {FPS, SCENES} from './timeline';

const WithNarration = ({audio, children}: {audio: string; children: ReactNode}) => (
  <>
    <Audio src={staticFile(audio)} />
    {children}
  </>
);

export const Lesson1 = () => (
  <Series>
    <Series.Sequence durationInFrames={SCENES[0].durationInFrames} premountFor={FPS}>
      <WithNarration audio={SCENES[0].audio}>
        <ProductScene meta={SCENES[0]} index={1} />
      </WithNarration>
    </Series.Sequence>
    <Series.Sequence durationInFrames={SCENES[1].durationInFrames} premountFor={FPS}>
      <WithNarration audio={SCENES[1].audio}>
        <LlmScene meta={SCENES[1]} index={2} />
      </WithNarration>
    </Series.Sequence>
    <Series.Sequence durationInFrames={SCENES[2].durationInFrames} premountFor={FPS}>
      <WithNarration audio={SCENES[2].audio}>
        <PredictionScene meta={SCENES[2]} index={3} />
      </WithNarration>
    </Series.Sequence>
    <Series.Sequence durationInFrames={SCENES[3].durationInFrames} premountFor={FPS}>
      <WithNarration audio={SCENES[3].audio}>
        <StreamingScene meta={SCENES[3]} index={4} />
      </WithNarration>
    </Series.Sequence>
    <Series.Sequence durationInFrames={SCENES[4].durationInFrames} premountFor={FPS}>
      <WithNarration audio={SCENES[4].audio}>
        <TokenDefinitionScene meta={SCENES[4]} index={5} />
      </WithNarration>
    </Series.Sequence>
    <Series.Sequence durationInFrames={SCENES[5].durationInFrames} premountFor={FPS}>
      <WithNarration audio={SCENES[5].audio}>
        <TokenizerScene meta={SCENES[5]} index={6} />
      </WithNarration>
    </Series.Sequence>
    <Series.Sequence durationInFrames={SCENES[6].durationInFrames} premountFor={FPS}>
      <WithNarration audio={SCENES[6].audio}>
        <EncodeDecodeScene meta={SCENES[6]} index={7} />
      </WithNarration>
    </Series.Sequence>
    <Series.Sequence durationInFrames={SCENES[7].durationInFrames} premountFor={FPS}>
      <WithNarration audio={SCENES[7].audio}>
        <VariableTokenScene meta={SCENES[7]} index={8} />
      </WithNarration>
    </Series.Sequence>
    <Series.Sequence durationInFrames={SCENES[8].durationInFrames} premountFor={FPS}>
      <WithNarration audio={SCENES[8].audio}>
        <TokenizerDemoScene meta={SCENES[8]} index={9} />
      </WithNarration>
    </Series.Sequence>
    <Series.Sequence durationInFrames={SCENES[9].durationInFrames} premountFor={FPS}>
      <WithNarration audio={SCENES[9].audio}>
        <ImpactScene meta={SCENES[9]} index={10} />
      </WithNarration>
    </Series.Sequence>
  </Series>
);
