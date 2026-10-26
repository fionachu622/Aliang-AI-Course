import React from 'react';
import {AbsoluteFill,Audio,Freeze,Img,OffthreadVideo,Sequence,interpolate,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import {Scene,Shot,scenes,FPS,frameToSource,sourceToFrame} from './timeline';
import captions from './captions.json';
import {MediaBoard as Board,Board as ChalkBoard,Handbook,InstallCard,Steps} from './Animations';
const fill:React.CSSProperties={width:'100%',height:'100%',objectFit:'contain'};
const screen=(id:string)=>staticFile(`ai-ppt/screen-${id}.mp4`);
const clamp={extrapolateLeft:'clamp',extrapolateRight:'clamp'} as const;
const Label:React.FC<{text:string}>=({text})=><div style={{position:'absolute',left:90,top:120,padding:'14px 24px',fontSize:31,fontWeight:600,background:'#18332deb',color:'#f4f0e5',borderLeft:'5px solid #b3e0bf',borderRadius:'0 8px 8px 0',maxWidth:1250}}>{text}</div>;
const ScreenShot:React.FC<{shot:Shot;duration:number}>=({shot,duration})=>{
 const f=useCurrentFrame();const {fps}=useVideoConfig();const sourceStart=shot.sourceStart??0;const moving=shot.sourceEnd!=null;
 const rate=moving?Math.max(.5,Math.min(6,((shot.sourceEnd??sourceStart)-sourceStart)/(duration/fps))):1;
 // A small focus change every four seconds keeps long inspection shots active without inventing UI actions.
 const beat=Math.floor(f/(4*fps));const push=interpolate(f%(4*fps),[0,12],[0,1],clamp);const zoom=(shot.zoom??1)+(beat%2?.07*push:0);
 const cx=shot.cx??.5,cy=shot.cy??.5;
 const video=<OffthreadVideo src={screen(shot.file!)} muted volume={0} startFrom={Math.round(sourceStart*fps)} playbackRate={rate} style={fill}/>;
 return <AbsoluteFill style={{background:'#101817',overflow:'hidden'}}><AbsoluteFill style={{transform:`translate(${(0.5-cx)*1920*zoom}px,${(0.5-cy)*1080*zoom}px) scale(${zoom})`}}>{moving?video:<Freeze frame={0}>{video}</Freeze>}{shot.mark&&<svg viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}}><rect x={shot.mark[0]*1920} y={shot.mark[1]*1080} width={shot.mark[2]*1920} height={shot.mark[3]*1080} rx="9" stroke="#efb33e" strokeWidth={4/zoom} fill="#ffbf4020" pathLength={1} strokeDasharray="1" strokeDashoffset={1-interpolate(f,[0,10],[0,1],clamp)}/></svg>}</AbsoluteFill>{shot.label&&<Label text={shot.label}/>}</AbsoluteFill>;
};
const ProductImage:React.FC<{shot:Shot}>=({shot})=>{const f=useCurrentFrame();return <ChalkBoard><AbsoluteFill style={{alignItems:'center',justifyContent:'center',padding:'190px 140px 125px'}}><Img src={staticFile(shot.file!)} style={{width:'100%',height:'100%',objectFit:'contain',transform:`scale(${interpolate(f,[0,120],[1,1.04],clamp)})`}}/></AbsoluteFill>{shot.label&&<div style={{position:'absolute',left:140,top:105,fontSize:48,color:'#F0D26A'}}>{shot.label}</div>}</ChalkBoard>};
const Presenter:React.FC<{scene:Scene;compact?:boolean}>=({scene,compact})=>{
 const f=useCurrentFrame();let offset=0;const zoom=Math.floor(f/135)%2?1.09:1;
 return <AbsoluteFill style={{background:'#101917'}}><AbsoluteFill style={{transform:`scale(${zoom})`,transformOrigin:'56% 44%'}}>{scene.audio.map((c,i)=>{const from=offset;offset+=c.sourceEnd-c.sourceStart;return <Sequence key={i} from={from} durationInFrames={c.sourceEnd-c.sourceStart} premountFor={FPS} name={`真人 ${i+1}`}><OffthreadVideo muted volume={0} src={staticFile('ai-ppt/presenter.mp4')} startFrom={c.sourceStart} style={{...fill,objectFit:'cover'}}/></Sequence>})}</AbsoluteFill>{compact&&<Steps scene={scene} compact/>}</AbsoluteFill>;
};
const CropPpt:React.FC<{file:string;start:number;crop?:number[];still?:boolean;rate?:number}>=({file,start,crop=[0,0,1,1],still=false,rate=1})=>{
 const [x,y,w,h]=crop;const v=<OffthreadVideo src={screen(file)} startFrom={Math.round(start*FPS)} muted volume={0} playbackRate={rate} style={{position:'absolute',width:`${100/w}%`,height:`${100/h}%`,left:`${-x/w*100}%`,top:`${-y/h*100}%`,objectFit:'fill'}}/>;return <AbsoluteFill style={{overflow:'hidden'}}>{still?<Freeze frame={0}>{v}</Freeze>:v}</AbsoluteFill>;
};
// Real presenter introduces the comparison; both examples then play beside each other.
// The final cover animation runs continuously, without the previous four-second jumps.
const Opening:React.FC<{scene:Scene}>=({scene})=>{
 const f=useCurrentFrame();const reveal=sourceToFrame(scene,63.3);
 const progress=interpolate(f,[reveal,reveal+10],[0,1],clamp);
 const rightFocus=frameToSource(scene,f)>=67.64;
 return <AbsoluteFill style={{background:'#15191b'}}>
  {f>=reveal&&<Sequence from={reveal} durationInFrames={scene.durationInFrames-reveal} premountFor={30}>
   {[0,1].map(side=><div key={side} style={{position:'absolute',left:side?990:60,top:156,width:870,height:490,opacity:progress,transform:`translateY(${(1-progress)*18}px)`,border:`3px solid ${side===Number(rightFocus)?'#e7d89b':'#596368'}`,borderRadius:10,overflow:'hidden'}}>
    <CropPpt file={side?'opening-right':'opening-left'} start={0} crop={side?[0,0,1,1]:[.585,.35,.4,.435]}/>
   </div>)}
   {[0,1].map(side=><div key={side} style={{position:'absolute',left:side?990:60,top:675,width:870,textAlign:'center',fontSize:36,fontWeight:600,color:side===Number(rightFocus)?'#e7d89b':'#e1e4e5',opacity:progress}}>{side?'一步步提出要求 · 动画成品':'只发一句话 · 原始效果'}</div>)}
  </Sequence>}
  <div style={{position:'absolute',left:interpolate(progress,[0,1],[0,750]),top:interpolate(progress,[0,1],[0,730]),width:interpolate(progress,[0,1],[1920,420]),height:interpolate(progress,[0,1],[1080,220]),overflow:'hidden',borderRadius:progress*12,boxShadow:progress?'0 8px 24px #0005':undefined}}><OffthreadVideo src={staticFile('ai-ppt/presenter-opening.mp4')} muted volume={0} pauseWhenBuffering style={fill}/></div>
 </AbsoluteFill>;
};
const Compare:React.FC<{scene:Scene;mode:string}>=({scene,mode})=>{
 const f=useCurrentFrame(),t=frameToSource(scene,f),power=mode==='compare-power';
 const rightActive=mode==='opening'?t>=67.64:power?t>=723.33:t>=646.63;
 const restored=power&&t>=734.65;
 const focus=restored?0:rightActive?1:-1;
 const step=Math.floor(f/120);
 const rightStart=power?[17,27,32,37,47][step%5]:[24,59,67][step%3];
 return <Board><div style={{position:'absolute',left:100,top:135,fontSize:58}}>{power?'同样一句话，要求存在 Skill 里':'同一份资料，不同的做法'}</div>{[0,1].map((side)=>{const active=focus===0||focus===(side?1:-1);return <div key={side} style={{position:'absolute',left:side?990:90,top:320,width:840,height:474,outline:`${active?5:2}px solid ${active?'#b3e0bf':'#748c80'}`,borderRadius:5,transform:`scale(${active&&focus!==0?1.025:1})`,boxShadow:active?'0 15px 40px #0005':'none'}}>{side?<Sequence key={step} from={step*120} durationInFrames={120}><CropPpt file={power?'17':'15'} start={rightStart}/></Sequence>:<CropPpt file="02" start={25} crop={[.585,.35,.4,.435]} still/>}<div style={{position:'absolute',top:505,left:0,width:'100%',fontSize:38,color:active?'#b3e0bf':'#f3eee2'}}>{side?(power?'调用自己的 Skill':'一步步提出要求'):'只发一句话'}</div><div style={{position:'absolute',top:567,left:0,width:'100%',fontSize:28,color:'#f3eee2'}}>{side?(power?'充电宝 · 版式与动画':'耳机 · 产品图与动画'):'耳机 · 手机原图 · 无动画'}</div></div>})}</Board>;
};
const Subtitle:React.FC<{sourceTime:number}>=({sourceTime})=>{
 // Keep timestamps relative to the original narration, even across removed retakes.
 const c=captions.find(c=>sourceTime*1000>=c.startMs&&sourceTime*1000<c.endMs);
 if(!c)return null;
 return <div style={{position:'absolute',bottom:34,left:90,right:90,display:'flex',justifyContent:'center',pointerEvents:'none'}}><div style={{background:'#101816df',padding:'12px 27px',borderRadius:8,color:'#fffdf7',fontSize:43,lineHeight:1.42,fontWeight:550,letterSpacing:.4,textAlign:'center',maxWidth:1720,textShadow:'0 2px 3px #000'}}>{c.text}</div></div>;
};
export const CourseScene:React.FC<{scene:Scene;debug?:boolean}>=({scene,debug=false})=>{
 const frame=useCurrentFrame(),{fps}=useVideoConfig();const sourceTime=frameToSource(scene,frame);let offset=0;const activeShot=[...scene.shots].reverse().find(s=>sourceToFrame(scene,s.at)<=frame);const chalkPage=['handbook','steps','install','image'].includes(activeShot?.kind??'');
 return <AbsoluteFill style={{fontFamily:'"PingFang SC","Microsoft YaHei",sans-serif',background:'#182a28'}}>
 {scene.shots.map((shot,i)=>{const from=sourceToFrame(scene,shot.at);const end=i+1<scene.shots.length?sourceToFrame(scene,scene.shots[i+1].at):scene.durationInFrames;const dur=end-from;if(dur<=0)return null;
 let visual:React.ReactNode;
 if(shot.kind==='screen')visual=<ScreenShot shot={shot} duration={dur}/>;
 else if(shot.kind==='image')visual=<ProductImage shot={shot}/>;
 else { // These actors use the scene's own clock so spoken cue anchors survive cuts.
  const scoped=<Sequence from={-from} durationInFrames={scene.durationInFrames+from}>
   {shot.kind==='opening'?<Opening scene={scene}/>:shot.kind==='presenter'||shot.kind==='presenter-steps'?<Presenter scene={scene} compact={shot.kind==='presenter-steps'}/>:shot.kind==='handbook'?<Handbook scene={scene}/>:shot.kind==='steps'?<Steps scene={scene}/>:shot.kind==='install'?<InstallCard scene={scene}/>:<Compare scene={scene} mode={shot.kind}/>}
  </Sequence>;visual=scoped;
 }
 return <Sequence key={i} from={from} durationInFrames={dur} premountFor={fps} name={`${scene.id} · ${shot.label||shot.kind}`}>{visual}</Sequence>
 })}
 {scene.audio.map((c,i)=>{const from=offset,d=c.sourceEnd-c.sourceStart;offset+=d;return <Sequence key={`voice-${i}`} from={from} durationInFrames={d} premountFor={fps} name={`口播 ${c.sourceStart/fps}s`}><Audio src={staticFile('ai-ppt/presenter.mp4')} startFrom={c.sourceStart} endAt={c.sourceEnd} volume={1}/></Sequence>})}
 <div style={{position:'absolute',left:90,top:40,padding:'9px 18px',background:chalkPage?'transparent':'#142a25e8',color:chalkPage?'#F5F1E8':'#eaeade',borderRadius:7,fontSize:25,letterSpacing:2}}>用 AI 做 PPT <span style={{color:chalkPage?'#F0D26A':'#b3e0bf',marginLeft:24}}>{scene.chapter}</span></div>
 <Subtitle sourceTime={sourceTime}/>
 {debug&&<div style={{position:'absolute',right:30,top:35,background:'#000a',color:'white',fontSize:20,padding:8}}>{scene.id} / 源 {sourceTime.toFixed(2)}s</div>}
 </AbsoluteFill>;
};
export const AIPptCourse:React.FC<{sceneId?:string;debug?:boolean}>=({sceneId,debug=false})=>{
 let at=0;const selected=sceneId?scenes.filter(s=>s.id===sceneId):scenes;
 return <AbsoluteFill><style>{`@font-face{font-family:"PPT Chalk";src:url("${staticFile('fonts/HanziPenSC-Regular.otf')}")} *{box-sizing:border-box}`}</style>{selected.map(scene=>{const from=at;at+=scene.durationInFrames;return <Sequence key={scene.id} from={from} durationInFrames={scene.durationInFrames} premountFor={FPS} name={`${scene.id} ${scene.title}`}><CourseScene scene={scene} debug={debug}/></Sequence>})}</AbsoluteFill>;
};
