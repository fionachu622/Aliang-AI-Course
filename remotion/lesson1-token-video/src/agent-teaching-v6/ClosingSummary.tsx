import React from 'react';
import {staticFile} from 'remotion';
import {ChalkText} from './CourseTypography';
import {CourseGlyph} from './CourseGlyphs';
import {MarkerStroke} from './CourseMotion';
import data from './closing-summary.json';
const C={white:'#F5F1E8',yellow:'#F0D26A',blue:'#7CC8EA',green:'#A4D486',pink:'#F18D9E'};
const p=(t:number,at:number,d=.32)=>{const q=Math.max(0,Math.min(1,(t-at)/d));return q*q*(3-2*q);};
const Text=({x,y,text,size=48,color=C.white,opacity=1}:{x:number;y:number;text:string;size?:number;color?:string;opacity?:number})=><ChalkText x={x} y={y} textAnchor="middle" fontSize={size} fill={color} opacity={opacity}>{text}</ChalkText>;
const Arrow=({x,to,y,color,amount=1}:{x:number;to:number;y:number;color:string;amount?:number})=><g fill="none" stroke={color} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" opacity={amount}><path d={`M${x} ${y} Q${(x+to)/2} ${y-3} ${to} ${y}`} pathLength="1" strokeDasharray="1" strokeDashoffset={1-amount}/><path d={`M${to-17} ${y-12} L${to} ${y} L${to-17} ${y+12}`} opacity={amount>.95?1:0}/></g>;
export const ClosingSummary:React.FC<{seconds:number}>=({seconds:t})=>{
 const section=data.sections.find(s=>t>=s.start&&t<s.end)??data.sections[0],L=data.labels;
 const at=(k:keyof typeof data.cues)=>p(t,data.cues[k]);
 return <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0,fontFamily:'AgentFullHanzi'}}>
 <g transform="translate(76.8 0) scale(.92)" data-layout="summary-above-subtitles">
 <Text x={960} y={150} text={section.title} size={68}/>
 {section.id==='mechanism'&&<>
  <g opacity={at('demand')}><Text x={235} y={362} text={L.demand} size={68} color={C.yellow}/><CourseGlyph kind="document" x={235} y={508} color={C.yellow} scale={.86} t={t} at={data.cues.demand}/></g>
  <Arrow x={370} to={530} y={410} color={C.yellow} amount={at('agent')}/>
  <Text x={960} y={350} text={L.agent} size={114} color={C.pink} opacity={at('agent')}/>
  {(['brain','memory','tools','plan'] as const).map((k,i)=>{const x=[630,850,1070,1310][i],color=[C.yellow,C.green,C.blue,C.pink][i];return <g key={k} opacity={at(k)}><CourseGlyph kind={['brain','memory','tool','plan'][i]} x={x} y={510} color={color} scale={.75} t={t} at={data.cues[k]}/><Text x={x} y={655} text={L[k]} size={k==='plan'?38:48} color={color}/></g>})}
  <Arrow x={1390} to={1550} y={410} color={C.blue} amount={at('result')}/>
  <g opacity={at('result')}><Text x={1690} y={362} text={L.result} size={68} color={C.green}/><CourseGlyph kind="plan" x={1690} y={508} color={C.green} scale={.86} t={t} at={data.cues.result}/></g>
  {(['observe','think','act'] as const).map((k,i)=><Text key={k} x={600+i*360} y={820} text={L[k]} color={[C.yellow,C.blue,C.green][i]} size={54} opacity={at(k)}/>)}
  <Arrow x={705} to={855} y={801} color={C.blue} amount={at('think')}/><Arrow x={1065} to={1215} y={801} color={C.green} amount={at('act')}/>
  <g opacity={at('loop')}><path d="M1320 860 V900 Q1320 925 1294 925 H626 Q600 925 600 899 V855" fill="none" stroke={C.pink} strokeWidth="3.5" pathLength="1" strokeDasharray="1" strokeDashoffset={1-at('loop')}/><path d="M587 872 L600 855 L613 872" fill="none" stroke={C.pink} strokeWidth="3.5" opacity={at('loop')>.95?1:0}/><Text x={960} y={992} text={L.loop} size={36} color={C.pink}/></g>
 </>}
 {section.id==='principles'&&<>
  {(['clear','release','gate'] as const).map((k,i)=>{const x=[340,960,1580][i],color=[C.yellow,C.blue,C.pink][i],object=(['demand','agent','critical'] as const)[i],detail=(['limits','autonomy','approval'] as const)[i];return <g key={k} opacity={at(k)}>
   <Text x={x} y={330} text={L[k]} size={64} color={color}/>
   <>{i===1?<image href={staticFile('agent-course/agent-pet-cream-v8.png')} x={x-120} y={370} width={240} height={240}/>:<CourseGlyph kind={['goal','tool','hand'][i]} x={x} y={480} color={color} scale={.93} t={t} at={data.cues[k]}/>}</>
   <Text x={x} y={655} text={L[object]} size={object==='agent'?76:57} color={color}/>
   <Text x={x} y={750} text={L[detail]} size={i===2?41:45} opacity={at(detail)}/>
  </g>})}
  <g opacity={at('compare')}><Text x={640} y={918} text={L.criteria} size={52} color={C.yellow}/><Text x={1270} y={918} text={L.result} size={52} color={C.green}/><Text x={950} y={862} text={L.compare} size={34}/><path d="M756 901 Q950 897 1148 901 M773 887 L756 901 L773 915 M1131 887 L1148 901 L1131 915" fill="none" stroke={C.yellow} strokeWidth="3.5"/></g>
  <g opacity={at('accept')}><path d="M813 975 L835 996 L873 950" fill="none" stroke={C.green} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round"/><Text x={1065} y={988} text={L.accept} size={43} color={C.green}/></g>
 </>}
 {section.id==='choice'&&<>
  <Text x={960} y={255} text={L.choose} size={50} color={C.yellow} opacity={at('choose')}/>
  {data.needs.map((n,i)=>{const x=[300,740,1180,1620][i],k=n.role as 'student'|'office'|'creator'|'developer';return <g key={k} opacity={at(k)}><Text x={x} y={360} text={L[k]} size={52} color={n.color}/><CourseGlyph kind={['memory','document','image','code'][i]} x={x} y={458} color={n.color} scale={.6} t={t} at={data.cues[k]}/><Text x={x} y={594} text={n.text} size={47}/></g>})}
  <g opacity={at('trial')}><Text x={960} y={825} text={L.trial} size={96} color={C.yellow}/><MarkerStroke t={t} at={data.cues.trial+.50} x={672} y={857} width={576} color={C.yellow}/></g>
  <Text x={960} y={972} text={L.pay} size={64} color={C.green} opacity={at('pay')}/>
 </>}
 </g>
 </svg>;
};
