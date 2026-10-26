import React, {Children, cloneElement, isValidElement, useId} from 'react';
export const cueProgress = (t:number, at:number, duration=.45) => {
 const q=Math.max(0,Math.min(1,(t-at)/duration));return 1-Math.pow(1-q,3);
};
// Draw only native SVG contours, never glyphs, images or existing dashed paths.
const trace=(children:React.ReactNode,p:number):React.ReactNode=>Children.map(children,child=>{
 if(!isValidElement<Record<string,unknown>>(child))return child;
 const props=child.props;
 const native=typeof child.type==='string';
 const contour=native&&['path','rect','circle','ellipse','line','polyline','polygon'].includes(child.type as string);
 const fill=props.fill;
 const draw=contour&&(fill===undefined||fill==='none')&&props.strokeDasharray===undefined;
 const extra=draw?{pathLength:1,strokeDasharray:1,strokeDashoffset:1-p}:{};
 return cloneElement(child,{...extra,...(props.children!==undefined&&(native||child.type===React.Fragment)?{children:trace(props.children as React.ReactNode,p)}:{})});
});
export const CueDraw:React.FC<{t:number;at:number;duration?:number;still?:boolean;progress?:number;children:React.ReactNode}>=({t,at,duration=.45,still=false,progress,children})=><g data-motion="cue-contour">{trace(children,progress??(still?1:cueProgress(t,at,duration)))}</g>;
export const CueUnderline:React.FC<{t:number;at:number;x:number;y:number;width:number;color:string;still?:boolean}>=({t,at,x,y,width,color,still=false})=>{
 const p=still?1:cueProgress(t,at,.36);
 return <path d={`M${x} ${y} Q${x+width*.55} ${y-2} ${x+width} ${y}`} fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" opacity={.65} pathLength={1} strokeDasharray={1} strokeDashoffset={1-p}/>;
};
// Adapted from marker-underline-title's variable-width silhouette and 10-frame reveal.
export const MarkerStroke:React.FC<{t:number;at:number;x:number;y:number;width:number;color:string}>=({t,at,x,y,width,color})=>{
 const id='marker-'+useId().replace(/[^a-zA-Z0-9]/g,'');const p=cueProgress(t,at,10/30);
 const top:string[]=[],bottom:string[]=[];
 for(let i=0;i<=40;i++){const q=i/40;const wob=Math.sin(i*2.7+77)*.5;const mid=Math.sin(q*Math.PI*1.6+.4)*1.2+wob*.6;const w=Math.max(1.6,5+Math.sin(q*Math.PI)*3-Math.max(0,q-.86)*18);top.push(`${x+q*width},${y+mid-w/2}`);bottom.push(`${x+q*width},${y+mid+w/2}`)}
 return <g><defs><clipPath id={id}><rect x={x-1} y={y-12} width={p*(width+3)} height={24}/></clipPath></defs><path d={`M${top.join('L')}L${bottom.reverse().join('L')}Z`} fill={color} clipPath={`url(#${id})`} opacity={.65}/></g>;
};
