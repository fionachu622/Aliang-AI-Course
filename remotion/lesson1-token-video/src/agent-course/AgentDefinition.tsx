import React from 'react';
import {Img, staticFile, interpolate, Easing} from 'remotion';
import {v9Colors as C} from '../v9/VisualV9';

// Original narration clock: Agent → acts for you → category → delivery.
export function AgentDefinition({seconds, showAll}: {seconds:number; showAll:boolean}) {
  const p=(at:number,d=.45)=>showAll?1:interpolate(seconds,[at,at+d],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:Easing.bezier(.22,.7,.25,1)});
  const phase=showAll||seconds>=51.68?'delivery':seconds>=46.56?'category':'definition';
  const categoryAt=seconds>=50?50:seconds>=48?48:46.56;
  const categoryText=seconds>=50?'一类 AI 系统':seconds>=48?'不是一种新的大模型':'不是某一个软件的名字';
  const label=(x:number,y:number,text:string,color:string,size=48)=><text x={x} y={y} textAnchor="middle" fill={color} fontSize={size}>{text}</text>;
  return <>
    <div style={{position:'absolute',left:660,top:170,width:600,textAlign:'center',fontSize:70,color:C.ink}}>Agent <span style={{fontSize:48,opacity:p(42)}}>· 智能体</span></div>
    <Img src={staticFile('agent-course/agent-pet-cream-v8.png')} style={{position:'absolute',left:685,top:285-65*p(51.68,.35),width:550,height:550,transform:`translateY(${-12*Math.sin(p(43.5,1)*Math.PI)}px)`}}/>
    <svg width="1920" height="1080" style={{position:'absolute',inset:0,overflow:'visible'}}>
      {phase==='definition'&&<g opacity={p(43.5)}>
        {label(960,850,'能替你办事的 AI',C.yellow,58)}
        <g fill="none" stroke={C.blue} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M330 430 H420 L450 460 V600 H330 Z M420 430 V460 H450 M355 500 H420 M355 530 H420 M355 560 H400"/>
          <path d="M490 510 Q610 420 735 490 M712 470 L735 490 L709 501" pathLength="1" strokeDasharray="1" strokeDashoffset={1-p(44)}/>
        </g>
        <g opacity={p(44.5)} fill="none" stroke={C.green} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1470" y="425" width="150" height="165" rx="8"/>
          <path d="M1500 465 L1512 477 L1533 450 M1548 466 H1590 M1500 515 L1512 527 L1533 500 M1548 516 H1590 M1500 565 L1512 577 L1533 550 M1548 566 H1590"/>
          <path d="M1185 490 Q1320 420 1430 510 M1412 484 L1430 510 L1400 510" pathLength="1" strokeDasharray="1" strokeDashoffset={1-p(45)}/>
        </g>
        {label(390,675,'交给它的事',C.blue,42)}
        <g opacity={p(44.5)}>{label(1545,675,'它来执行',C.green,42)}</g>
      </g>}
      {phase==='category'&&<g opacity={p(categoryAt,.22)}>
        {label(960,850,categoryText,seconds>=50?C.yellow:C.ink,58)}
      </g>}
      {phase==='delivery'&&<g opacity={p(51.68,.35)}>
        <g fill="none" stroke={C.blue} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M295 410 H465 V590 H295 Z M325 450 H435 M325 485 H435 M325 520 H410"/>
          <path d="M510 510 H725 M703 493 L725 510 L703 527" pathLength="1" strokeDasharray="1" strokeDashoffset={1-p(52.02)}/>
        </g>
        {label(380,700,'你提需求',C.blue,58)}
        <g opacity={p(52.5)}>{label(960,700,'它干活',C.yellow,58)}</g>
        <g opacity={p(53.45)}>
          <g fill="none" stroke={C.green} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"><path d="M1455 410 H1625 V590 H1455 Z M1490 495 L1520 525 L1585 460"/><path d="M1195 510 H1410 M1388 493 L1410 510 L1388 527" pathLength="1" strokeDasharray="1" strokeDashoffset={1-p(53.45)}/></g>
          {label(1540,700,'交付结果',C.green,58)}
        </g>
      </g>}
    </svg>
  </>;
}
