import {ChalkText} from './CourseTypography';
import {CueDraw, CueUnderline, cueProgress} from './CourseMotion';
import React from 'react';
import {ChalkCard} from './ChalkCard';
import storyboard from './continuous-diagrams.storyboard.json';
const scene=storyboard.computer_operation_intro;
const ease=(t:number,at:number,d=.45)=>{const q=Math.max(0,Math.min(1,(t-at)/d));return q*q*(3-2*q);};
export const ComputerOperationIntro:React.FC<{seconds:number;still?:boolean;backgroundUrl?:string}>=({seconds,still=false,backgroundUrl})=>{
 const t=seconds-scene.legacyOffsetSeconds;
 const dock=still?1:ease(t,scene.dockAt,.8);
 const show=(at:number)=>still?1:ease(t,at,.3);
 return <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0,fontFamily:'AgentFullHanzi, HanziPen SC, cursive'}} data-computer-operation="progressive">
 <defs><filter id="computer-chalk"><feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="2" seed="7"/><feDisplacementMap in="SourceGraphic" scale="1.6"/></filter></defs>
 {backgroundUrl&&<image href={backgroundUrl} width="1920" height="1080"/>}
 <ChalkText x={960-480*dock} y={550-355*dock} textAnchor="middle" fontSize={88-26*dock} fill="#F5F1E8" opacity={show(scene.start)}>{scene.title}</ChalkText>
 <path d="M160 232 Q450 228 800 232" fill="none" stroke="#7CC8EA" strokeWidth="3" opacity={dock} pathLength="1" strokeDasharray="1" strokeDashoffset={1-dock}/>
 {scene.actions.map((action,i)=>{const a=show(action.at),color=['#F0D26A','#7CC8EA','#F18D9E','#A4D486'][i];return <g key={action.id} transform={`translate(${360+i*400} ${20*(1-a)})`} opacity={a}>
 <ChalkCard x={-178} y={318} w={356} h={486} color={color} progress={a} radius={28}/>
 <CueDraw t={t} at={action.at} still={still}><g stroke={color} strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" filter="url(#computer-chalk)">
 {i===0&&<><path d="M-123 425 Q-128 410 -110 410 L110 410 Q126 410 125 428 L125 558 L-125 558 Z M-125 533 L125 534 M0 558 L0 600 M-54 603 Q0 599 54 603"/><path d="M-57 473 Q0 422 57 473 Q0 522 -57 473Z"/><circle cy="473" r="17"/></>}
 {i===1&&<><path d="M-114 428 L113 428 L113 561 L-114 561Z M-114 453 L113 453 M-50 481 L52 481 L52 522 L-50 522Z"/><path transform={`translate(${-18*(1-cueProgress(t,action.at,.28))} ${-18*(1-cueProgress(t,action.at,.28))})`} d="M15 500 L22 595 L45 569 L68 600 L87 585 L64 553 L97 548 Z" fill="#24272A"/><path d="M0 480 L-11 461 M-11 496 L-36 491 M33 478 L42 460"/></>}
 {i===2&&<><path d="M-125 435 L125 435 L125 550 L-125 550Z M-107 572 L105 572 L133 613 L-133 613Z M-75 592 L-30 592 M-10 592 L30 592 M50 592 L90 592"/><path d="M-92 485 L-15 485 M-92 514 L36 514"/><path d="M59 473 L59 523" opacity={t-action.at<1.2?.65+.35*Math.sin((t-action.at)*12):1}/></>}
 {i===3&&<><path d="M-125 410 L45 410 L45 518 L-125 518Z M-125 435 L45 435 M-45 512 L125 512 L125 620 L-45 620Z M-45 537 L125 537"/><path d="M65 438 Q122 444 122 482 M111 469 L122 482 L134 468 M-69 592 Q-127 587 -127 546 M-139 560 L-127 546 L-116 560"/></>}
 </g></CueDraw>
 <ChalkText y="720" textAnchor="middle" fontSize={48} fill={color}>{action.label}</ChalkText>
 <CueUnderline t={t} at={action.at+.3} x={-86} y={742} width={172} color={color} still={still}/>
 {i===3&&<ChalkText y="795" textAnchor="middle" fontSize="36" fill="#A4D486">网页 ↔ 软件</ChalkText>}
 </g>})}
 </svg>;
};
