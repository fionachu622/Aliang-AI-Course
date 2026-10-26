import {ChalkText} from './CourseTypography';
import React from 'react';
import data from './closing-summary.json';
const C={white:'#F5F1E8',yellow:'#F0D26A',blue:'#7CC8EA',green:'#A4D486',pink:'#F18D9E'};
const progress=(t:number,at:number,d=.32)=>Math.max(0,Math.min(1,(t-at)/d));
const Box=({x,y,w,h,color,opacity=1}:{x:number;y:number;w:number;h:number;color:string;opacity?:number})=><path d={`M${x+18} ${y+3} Q${x+w/2} ${y-2} ${x+w-18} ${y+3} Q${x+w+2} ${y+4} ${x+w-1} ${y+21} L${x+w} ${y+h-18} Q${x+w-1} ${y+h+2} ${x+w-20} ${y+h} Q${x+w/2} ${y+h-4} ${x+18} ${y+h} Q${x-3} ${y+h} ${x+1} ${y+h-18} L${x} ${y+20} Q${x-1} ${y+3} ${x+18} ${y+3}Z`} fill="none" stroke={color} strokeWidth={3} opacity={opacity}/>;
const Arrow=({x,y,to,color,amount=1}:{x:number;y:number;to:number;color:string;amount?:number})=><g opacity={amount} stroke={color} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" fill="none"><path d={`M${x} ${y} Q${(x+to)/2} ${y-4} ${to} ${y}`} pathLength="1" strokeDasharray="1" strokeDashoffset={1-amount}/><path d={`M${to-17} ${y-13} L${to} ${y} L${to-17} ${y+13}`}/></g>;
const Text=({x,y,text,size=48,color=C.white,opacity=1,anchor='middle'}:{x:number;y:number;text:string;size?:number;color?:string;opacity?:number;anchor?:'middle'|'start'})=><ChalkText x={x} y={y} textAnchor={anchor} fontSize={size} fill={color} opacity={opacity}>{text}</ChalkText>;
export const ClosingSummary:React.FC<{seconds:number}>=({seconds:t})=>{
 const section=data.sections.find(s=>t>=s.start&&t<s.end)??data.sections[0];
 const at=(k:keyof typeof data.cues)=>progress(t,data.cues[k]);const L=data.labels;
 return <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0,fontFamily:'AgentFullHanzi',WebkitTextStroke:'.3px currentColor'}}>
 <Text x={960} y={143} text={section.title} size={66}/>
 {section.id==='mechanism'&&<>
  <Box x={105} y={385} w={285} h={135} color={C.yellow}/><Text x={247} y={470} text={L.demand} color={C.yellow} size={62}/>
  <Arrow x={425} y={450} to={545} color={C.yellow} amount={at('agent')}/>
  <Box x={585} y={245} w={750} h={405} color={C.pink} opacity={at('agent')}/><Text x={960} y={327} text={L.agent} color={C.pink} size={74} opacity={at('agent')}/>
  {(['brain','memory','tools','plan'] as const).map((k,i)=>{const x=630+i%2*350,y=381+Math.floor(i/2)*128;const color=[C.yellow,C.green,C.blue,C.pink][i];return <g key={k} opacity={at(k)}><Box x={x} y={y} w={310} h={86} color={color}/><Text x={x+155} y={y+58} text={L[k]} color={color} size={k==='plan'?44:50}/></g>})}
  <Arrow x={1375} y={450} to={1495} color={C.blue} amount={at('result')}/><Box x={1530} y={385} w={285} h={135} color={C.green} opacity={at('result')}/><Text x={1672} y={470} text={L.result} color={C.green} size={62} opacity={at('result')}/>
  {(['observe','think','act'] as const).map((k,i)=><Text key={k} x={600+i*360} y={812} text={L[k]} color={[C.yellow,C.blue,C.green][i]} size={56} opacity={at(k)}/>)}
  <Arrow x={700} y={792} to={855} color={C.blue} amount={at('think')}/><Arrow x={1060} y={792} to={1215} color={C.green} amount={at('act')}/>
  <g opacity={at('loop')}><path d="M1320 851 L1320 891 Q1320 922 1288 922 L633 922 Q600 922 600 889 L600 854 M587 870 L600 852 L613 870" stroke={C.pink} strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/><Text x={960} y={992} text={L.loop} color={C.pink} size={37}/></g>
 </>}
 {section.id==='principles'&&<>
  <Text x={315} y={315} text={L.clear} color={C.yellow} size={61} opacity={at('clear')}/><Text x={960} y={315} text={L.release} color={C.blue} size={61} opacity={at('release')}/><Text x={1580} y={315} text={L.gate} color={C.pink} size={61} opacity={at('gate')}/>
  <Box x={125} y={400} w={380} h={235} color={C.yellow}/><Text x={315} y={484} text={L.demand} size={60} color={C.yellow}/><Text x={315} y={574} text={L.limits} size={43} opacity={at('limits')}/>
  <Arrow x={540} y={507} to={695} color={C.yellow}/>
  <Box x={730} y={400} w={460} h={235} color={C.blue}/><Text x={960} y={484} text={L.agent} size={70} color={C.blue}/><Text x={960} y={574} text={L.autonomy} size={46} opacity={at('autonomy')}/>
  <Arrow x={1225} y={507} to={1350} color={C.blue}/>
  <Box x={1385} y={400} w={390} h={235} color={C.pink}/><Text x={1580} y={484} text={L.critical} size={60} color={C.pink}/><Text x={1580} y={574} text={L.approval} size={34} opacity={at('approval')}/>
  <g opacity={at('compare')}><Text x={640} y={817} text={L.criteria} size={54} color={C.yellow}/><Text x={1250} y={817} text={L.result} size={54} color={C.green}/><Text x={945} y={758} text={L.compare} size={35}/><path d="M758 802 Q947 798 1132 802 M775 789 L758 802 L775 815 M1115 789 L1132 802 L1115 815" stroke={C.yellow} fill="none" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/></g>
  <g opacity={at('accept')}><path d="M848 917 L878 944 L928 888" fill="none" stroke={C.green} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/><Text x={1082} y={939} text={L.accept} size={54} color={C.green}/></g>
 </>}
 {section.id==='choice'&&<>
  <Text x={960} y={255} text={L.choose} size={54} color={C.yellow} opacity={at('choose')}/>
  {data.needs.map((n,i)=>{const x=145+i%2*900,y=383+Math.floor(i/2)*170;const k=n.role as 'student'|'office'|'creator'|'developer';return <g key={k} opacity={at(k)}><Text x={x} y={y} text={L[k]} size={48} color={n.color} anchor="start"/><Arrow x={x+185} y={y-17} to={x+285} color={n.color}/><Text x={x+480} y={y} text={n.text} size={51} color={n.color}/></g>})}
  <g opacity={at('trial')}><Box x={390} y={738} w={480} h={135} color={C.yellow}/><Text x={630} y={822} text={L.trial} size={52} color={C.yellow}/></g>
  <Arrow x={910} y={805} to={1060} color={C.green} amount={at('pay')}/><g opacity={at('pay')}><Box x={1100} y={738} w={430} h={135} color={C.green}/><Text x={1315} y={822} text={L.pay} size={52} color={C.green}/></g>
 </>}
 </svg>;
};
