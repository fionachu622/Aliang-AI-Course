import React from 'react';
import {AbsoluteFill, Img, Sequence, staticFile, useCurrentFrame, Html5Video, getRemotionEnvironment} from 'remotion';
import overrides from './sync-overrides.json';
import {CourseVideo as Video} from './PreviewMedia';

export type RecordingCut = {
  id: string;
  label: string;
  from: number;
  durationInFrames: number;
  source: string;
  sourceStart: number;
  sourceEnd: number;
  playbackRate: number;
  playFrames: number;
  holdImage: string;
  caption?: string;
};

// The narration is never stretched. Each recording excerpt has its own
// measured source interval, then holds its end frame when explanation continues.
export const RecordingSequence: React.FC<{cut: RecordingCut}> = ({cut}) => {
 const frame=useCurrentFrame();
 const rendering=getRemotionEnvironment().isRendering;
 const captionAt=(overrides.recordingCaptionSeconds as Record<string,number>)[cut.id];
 return (
  <AbsoluteFill style={{background: '#24272A', justifyContent: 'center'}}>
    <Sequence durationInFrames={cut.playFrames} name={cut.label}>
      {rendering ? <Video
        src={staticFile(cut.source)}
        trimBefore={Math.round(cut.sourceStart * 30)}
        trimAfter={Math.round(cut.sourceEnd * 30)}
        playbackRate={cut.playbackRate}
        muted
        objectFit="contain"
        style={{width: '100%', height: '100%'}}
      /> : <Html5Video src={staticFile(`agent-course/preview-proxies/${cut.id}.mp4`)} muted style={{width:'100%',height:'100%',objectFit:'contain'}}/>}
    </Sequence>
    {cut.playFrames < cut.durationInFrames && (
      <Sequence from={cut.playFrames} name="保留操作结果">
        <Img src={staticFile(cut.holdImage)} style={{width: '100%', height: '100%', objectFit: 'contain'}} />
      </Sequence>
    )}
    {cut.caption && (captionAt===undefined||frame+cut.from>=Math.ceil(captionAt*30)) && <div style={{position:'absolute',left:36,top:28,padding:'12px 24px',fontSize:36,lineHeight:1.25,color:'#f5f1e8',background:'rgba(25,28,30,.9)',borderRadius:8}}>{cut.caption}</div>}
  </AbsoluteFill>
);
};
