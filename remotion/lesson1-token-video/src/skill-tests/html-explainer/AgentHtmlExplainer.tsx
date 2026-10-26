import React, {createElement, type CSSProperties} from 'react';
import {Audio} from '@remotion/media';
import {AbsoluteFill, Easing, Img, Sequence, interpolate, interpolateColors, staticFile, useCurrentFrame} from 'remotion';
import {scenes, DURATION} from './data';

export const AGENT_HTML_EXPLAINER_DURATION = DURATION;
type Value = string | number;
type Values = Record<string, Value>;
type Track = {kind: string; from: Values; to: Values; at: number; duration: number; ease: string};
type Node = string | {tag: string; attrs: Record<string, string>; children: Node[]; tracks: Track[]};
type Scene = {id: string; start: number; duration: number; startSeconds: number; css: string; nodes: Node[]; blocks: {text: string; global_start_sec: number; global_end_sec: number}[]};
const ASSETS = 'skill-tests/html-explainer/';
const colors: Record<string, string> = {'var(--accent)':'#2563EB', 'var(--text)':'#202833', 'var(--text-dim)':'#67717E', 'var(--line)':'#D8DCE1'};
const metadata = new Set(['duration', 'ease', 'transformOrigin']);
const defaults = (key: string): Value => key === 'opacity' || key.startsWith('scale') ? 1 : key === 'color' ? '#202833' : key === 'borderColor' ? '#D8DCE1' : 0;
const resolveColor = (v: Value) => colors[String(v)] ?? String(v);
const ease = (name: string) => {
  if(name === 'none') return Easing.linear;
  if(name === 'sine.inOut') return Easing.inOut(Easing.sin);
  const power = name.match(/power(\d)\.out/);
  return power ? Easing.out(Easing.poly(Number(power[1])+1)) : Easing.out(Easing.quad);
};

// The imported GSAP declarations are data only. Every transform is evaluated
// from the Remotion frame, with no browser clock, iframe, or GSAP runtime.
const motionStyle = (tracks: Track[], time: number): CSSProperties => {
  const initial: Values = {};
  for(const track of tracks){
    const props = track.kind === 'fromTo' ? track.to : track.from;
    for(const key of Object.keys(props)){
      if(metadata.has(key) || key in initial) continue;
      initial[key] = track.kind === 'from' || track.kind === 'fromTo' ? track.from[key] ?? defaults(key) : defaults(key);
    }
  }
  const value = {...initial};
  let origin: Value | undefined;
  for(const track of [...tracks].sort((a,b)=>a.at-b.at)){
    if(time < track.at) continue;
    const props = track.kind === 'fromTo' ? track.to : track.from;
    origin = props.transformOrigin ?? origin;
    for(const key of Object.keys(props)){
      if(metadata.has(key)) continue;
      const from = track.kind === 'from' || track.kind === 'fromTo' ? track.from[key] ?? defaults(key) : value[key] ?? defaults(key);
      const to = track.kind === 'from' ? defaults(key) : props[key];
      const p = track.duration === 0 ? 1 : interpolate(time,[track.at,track.at+track.duration],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:ease(track.ease)});
      value[key] = typeof from === 'number' && typeof to === 'number' ? interpolate(p,[0,1],[from,to]) : interpolateColors(p,[0,1],[resolveColor(from),resolveColor(to)]);
    }
  }
  const style: CSSProperties = {};
  if('opacity' in value) style.opacity = Number(value.opacity);
  if('color' in value) style.color = String(value.color);
  if('borderColor' in value) style.borderColor = String(value.borderColor);
  if(['x','y','scale','scaleX'].some(k=>k in value)){
    style.transform = `translate(${value.x ?? 0}px, ${value.y ?? 0}px) scale(${value.scale ?? 1}) scaleX(${value.scaleX ?? 1})`;
    style.transformOrigin = String(origin ?? '50% 50%');
    style.transformBox = 'fill-box';
  }
  return style;
};
const camel = (key: string) => key.replace(/-([a-z])/g,(_,c:string)=>c.toUpperCase());
const aliases: Record<string,string> = {class:'className',viewbox:'viewBox',markerwidth:'markerWidth',markerheight:'markerHeight',refx:'refX',refy:'refY',preserveaspectratio:'preserveAspectRatio',tabindex:'tabIndex'};
const renderNode = (node: Node, time: number, key: string): React.ReactNode => {
  if(typeof node === 'string') return node;
  const props: Record<string,unknown> = {key};
  let inline: CSSProperties = {};
  for(const [name,val] of Object.entries(node.attrs)){
    if(name === 'style'){
      inline = Object.fromEntries(val.split(';').filter(s=>s.includes(':')).map(s=>{const i=s.indexOf(':');return [camel(s.slice(0,i).trim()),s.slice(i+1).trim()]}));
    } else props[aliases[name] ?? (name.startsWith('data-') || name.startsWith('aria-') ? name : camel(name))] = val;
  }
  props.style = {...inline,...motionStyle(node.tracks,time)};
  if(node.tag === 'img') return <Img {...props} key={key} src={staticFile(ASSETS+node.attrs.src)} />;
  return createElement(node.tag, props, ...node.children.map((c,i)=>renderNode(c,time,`${key}-${i}`)));
};

const HtmlExplainerScene = ({scene}: {scene: Scene}) => {
  const frame = useCurrentFrame();
  const globalTime = (frame+scene.start)/30;
  const time = Math.max(0,globalTime-scene.startSeconds);
  const block = scene.blocks.find(b=>globalTime>=b.global_start_sec && globalTime<=b.global_end_sec);
  return <AbsoluteFill className="agent-html-scene" style={{overflow:'hidden'}}>
    <style>{scene.css}</style>
    {scene.nodes.map((node,i)=>renderNode(node,time,String(i)))}
    {block ? <div style={{position:'absolute',left:0,right:0,bottom:96,textAlign:'center',fontSize:44,fontWeight:700,lineHeight:1.2,color:'#202833',fontFamily:'"PingFang SC", "Microsoft YaHei", sans-serif',textShadow:'3px 0 #F5F2EF,-3px 0 #F5F2EF,0 3px #F5F2EF,0 -3px #F5F2EF',zIndex:900}}>{block.text}</div> : null}
  </AbsoluteFill>;
};

export const AgentHtmlExplainer = () => {
  const frame = useCurrentFrame();
  return <AbsoluteFill style={{background:'#F5F2EF'}}>
    <Audio src={staticFile(ASSETS+'narration.mp3')} />
    {(scenes as Scene[]).map(scene=><Sequence key={scene.id} from={scene.start} durationInFrames={scene.duration} name={`${Number(scene.id.slice(1))<32?'第1章':'第2章'} · ${scene.id}`}>
      <HtmlExplainerScene scene={scene}/>
    </Sequence>)}
    <div style={{position:'absolute',bottom:0,left:0,right:0,height:12,background:'#D8DCE1',zIndex:901}}><div style={{height:'100%',width:`${interpolate(frame,[0,DURATION-1],[0,100])}%`,background:'#2563EB'}}/></div>
  </AbsoluteFill>;
};
