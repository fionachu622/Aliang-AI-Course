import {ChalkText} from './CourseTypography';
import React from 'react';
import stages from './visual-stages.json';
import {DiagramIcon} from './DiagramIcon';
const C:Record<string,string>={white:'#F5F1E8',blue:'#7CC8EA',pink:'#F18D9E',green:'#A4D486',yellow:'#F0D26A'};
const q=(t:number,a:number,d=.5)=>{const x=Math.max(0,Math.min(1,(t-a)/d));return x*x*(3-2*x)};
export const teachingIds=['Agent08','Agent09','Agent11','Agent17','Agent22'];
export function TeachingScene({id,seconds:t,still=false}:{id:string;seconds:number;still?:boolean}){
 const stage=stages.find(s=>s.id===id)!;const a=(at:number)=>still?1:q(t,at);
 const text=(label:string,x:number,y:number,size=54,color=C.white)=><ChalkText x={x} y={y} textAnchor="middle" fill={color} fontSize={size}>{label}</ChalkText>;
 const icon=(shape:string,x:number,y:number,color:string)=><g transform={`translate(${x-85} ${y-75})`}><DiagramIcon kind={shape} color={color}/></g>;
 const line=(d:string,at:number,color=C.blue)=><path d={d} fill="none" stroke={color} strokeWidth={5} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1-a(at)} opacity={a(at)}/>;
 const card=(x:number,y:number,w:number,h:number,color:string)=><path d={`M${x+22} ${y} Q${x+w*.5} ${y-3} ${x+w-22} ${y} Q${x+w} ${y} ${x+w} ${y+22} L${x+w+1} ${y+h-22} Q${x+w} ${y+h} ${x+w-22} ${y+h} Q${x+w*.5} ${y+h+3} ${x+22} ${y+h} Q${x} ${y+h} ${x} ${y+h-22} L${x-1} ${y+22} Q${x} ${y} ${x+22} ${y}Z`} fill={color} fillOpacity={.045} stroke={color} strokeOpacity={.65} strokeWidth={3}/>;
 if(id==='Agent08'){
  const pos=[[960,430],[420,430],[1500,430],[960,735]];
  return <g data-teaching="whole-part-whole">
   {stage.edges.map(e=>{const [x,y]=pos[e.a];const [xx,yy]=pos[e.b];return <g key={e.id}>{line(e.a===3?'M960 615 Q960 590 960 570':`M${x+(xx-x)*.25} ${y} L${x+(xx-x)*.75} ${yy}`,e.at,C[stage.nodes[e.a].color])}<g opacity={a(e.at)}>{text(e.label,(x+xx)/2+(e.a===3?105:0),(y+yy)/2-25,32,C.blue)}</g></g>})}
   {stage.nodes.map((n,i)=><g key={i} opacity={a(n.at)}>{icon(n.shape,pos[i][0],pos[i][1]-40,C[n.color])}{text(n.text,pos[i][0],pos[i][1]+90,60,C[n.color])}</g>)}
  </g>;
 }
 if(id==='Agent09'){
  const pos=[[570,320],[1350,320],[1350,700],[570,700]];
  const paths=['M710 300 L1200 300','M1350 460 L1350 540','M1200 690 L710 690','M450 665 Q290 480 450 285'];
  const cues=stage.edges.map(e=>e.at);
  const feedbackAt=cues[3];
  const travel=q(t,feedbackAt,1.2);
  return <g data-teaching="result-becomes-next-input">
   {paths.map((d,i)=><g key={i}>{line(d,cues[i],i===3?C.yellow:C.blue)}<g opacity={a(cues[i]+.35)}><path d={['M1180 286 L1200 300 L1180 314','M1336 520 L1350 540 L1364 520','M730 676 L710 690 L730 704','M427 294 L450 285 L450 309'][i]} fill="none" stroke={i===3?C.yellow:C.blue} strokeWidth={5}/></g></g>)}
   {stage.nodes.map((n,i)=><g key={i} opacity={a(n.at)}>{icon(n.shape,pos[i][0],pos[i][1]-35,C[n.color])}{text(n.text,pos[i][0],pos[i][1]+85,60,C[n.color])}</g>)}
   {!still&&t>=feedbackAt&&t<feedbackAt+1.2&&<g transform={`translate(${450-80*Math.sin(Math.PI*travel)} ${665-380*travel})`}><circle r={12} fill={C.yellow}/></g>}
   <g opacity={a(feedbackAt)}>{text('反馈',365,465,38,C.yellow)}</g>
  </g>;
 }
 if(id==='Agent11'){
  const rows=[{text:'三维动画',at:546.53},{text:'1—2分钟',at:552.57},{text:'中文讲解·字幕',at:554.43},{text:'成长感悟',at:560.2},{text:'知识准确',at:576.76},{text:'先看预览',at:580.29},{text:'发布确认',at:584.95}];
  return <g data-teaching="one-brief-progressively-specified" opacity={a(534.73)}>
   {icon('video',475,390,C.blue)}{text('化茧成蝶',475,540,70,C.blue)}
   {line('M680 455 Q760 448 820 455',546.53)}
   <g opacity={a(546.53)}>{card(850,185,650,650,C.blue)}</g>
   {rows.map((r,i)=><g key={r.text} opacity={a(r.at)}><circle cx={920} cy={255+i*78} r={5} fill={i>3?C.yellow:C.blue}/>{text(r.text,1180,272+i*78,46,i>3?C.yellow:C.white)}</g>)}
  </g>;
 }
 if(id==='Agent17')return <g data-teaching="actions-with-confirmation-gates">
  {stage.nodes.filter(n=>!('hidden'in n&&n.hidden)).map((n,i)=>{const x=450+i*510;return <g key={i} opacity={a(n.at)}>{icon(n.shape,x,350,C[n.color])}{text(n.text,x,475,58,C[n.color])}<g opacity={a(n.subAt)}>{line(`M${x} 505 L${x} 565`,n.subAt,C.yellow)}{card(x-205,590,410,125,C.yellow)}<path d={`M${x-157} 630 V675 M${x-140} 630 V675`} stroke={C.yellow} strokeWidth={7}/>{text(n.sub,x+30,667,36,C.yellow)}</g></g>})}
 </g>;
 if(id==='Agent22'){
  return <g data-teaching="who-need-tool">
   {[0,1,2,3].map(row=>{const ns=stage.nodes.slice(row*3,row*3+3);const y=240+row*185;return <g key={row} opacity={a(ns[0].at)}>
    <g opacity={a(ns[0].at)}>{card(320,y-75,1280,135,C[ns[0].color])}</g>
    {ns.map((n,i)=><g key={i} opacity={a(n.at)}>{text(n.text.replace('\n',' · '),[490,925,1390][i],y+12,i===2?40:46,C[n.color])}</g>)}
    {[0,1].map(i=><g key={i}>{line(`M${[640,1090][i]} ${y-5} L${[715,1165][i]} ${y-5}`,Math.max(ns[i].at,ns[i+1].at),C[ns[0].color])}</g>)}
   </g>})}
  </g>;
 }
 return null;
}
