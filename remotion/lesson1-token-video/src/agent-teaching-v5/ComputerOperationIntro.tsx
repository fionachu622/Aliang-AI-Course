import {CapabilityHeading} from './CapabilityHeading';
import {ChalkDrawingDefs} from './ChalkDrawing';
import {ChalkText} from './CourseTypography';
import {CueDraw, CueUnderline, cueProgress} from './CourseMotion';
import React from 'react';
import storyboard from './continuous-diagrams.storyboard.json';
const scene=storyboard.computer_operation_intro;
const ease=(t:number,at:number,d=.45)=>{const q=Math.max(0,Math.min(1,(t-at)/d));return q*q*(3-2*q);};
export const ComputerOperationIntro:React.FC<{seconds:number;still?:boolean;backgroundUrl?:string}>=({seconds,still=false,backgroundUrl})=>{
 const t=seconds-scene.legacyOffsetSeconds;
 const dock=still?1:ease(t,scene.dockAt,.8);
 const show=(at:number)=>still?1:ease(t,at,.3);
 return <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0,fontFamily:'AgentFullHanzi, HanziPen SC, cursive'}} data-computer-operation="progressive">
 <defs><ChalkDrawingDefs id="computer-chalk"/></defs>
 {backgroundUrl&&<image href={backgroundUrl} width="1920" height="1080"/>}
 <CapabilityHeading title={scene.title} dock={dock} opacity={show(scene.start)}/>
 {scene.actions.map((action,i)=>{const a=show(action.at);return <g key={action.id} transform={`translate(${360+i*400} ${20*(1-a)})`} opacity={a}>
 <CueDraw t={t} at={action.at} still={still}><g stroke={['#F0D26A','#7CC8EA','#F18D9E','#A4D486'][i]} strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" filter="url(#computer-chalk)">
 {i===0&&<><path d="M-123 425 Q-128 410 -110 410 Q0 407 110 411 Q127 413 125 428 Q122 486 125 558 Q-4 561 -125 557 Q-128 490 -123 425 M-125 533 Q0 530 125 534 M0 558 Q-2 582 0 600 M-54 603 Q0 599 54 603"/><path d="M-57 473 Q0 422 57 473 Q0 522 -57 473Z"/><circle cy="473" r="17"/></>}
 {i===1&&<><path d="M-114 428 Q-5 425 113 429 Q115 492 112 561 Q0 558 -114 562 Q-116 500 -114 428 M-114 453 Q0 456 113 452 M-50 481 Q0 479 52 482 L51 523 Q0 520 -50 522 Z"/><path transform={`translate(${-18*(1-cueProgress(t,action.at,.28))} ${-18*(1-cueProgress(t,action.at,.28))})`} d="M15 500 L22 595 L45 569 L68 600 L87 585 L64 553 L97 548 Z" fill="#24272A"/><path d="M0 480 L-11 461 M-11 496 L-36 491 M33 478 L42 460"/></>}
 {i===2&&<><path d="M-125 435 Q0 432 125 436 Q123 490 125 550 Q0 553 -125 549 Q-127 492 -125 435 M-107 572 Q0 569 105 573 L133 613 Q0 616 -133 612 Z M-75 592 L-30 592 M-10 592 L30 592 M50 592 L90 592"/><path d="M-92 485 L-15 485 M-92 514 L36 514"/><path d="M59 473 L59 523" opacity={t-action.at<1.2?.65+.35*Math.sin((t-action.at)*12):1}/></>}
 {i===3&&<><path d="M-125 410 Q-40 407 45 411 L44 518 Q-40 521 -125 517 Z M-125 435 Q-40 433 45 436 M-45 512 Q40 509 125 513 L124 620 Q40 623 -45 619 Z M-45 537 Q40 540 125 537"/><path d="M65 438 Q122 444 122 482 M111 469 L122 482 L134 468 M-69 592 Q-127 587 -127 546 M-139 560 L-127 546 L-116 560"/></>}
 </g></CueDraw>
 <ChalkText y="720" textAnchor="middle" fontSize={48} fill={['#F0D26A','#7CC8EA','#F18D9E','#A4D486'][i]}>{action.label}</ChalkText>
 <CueUnderline t={t} at={action.at+.3} x={-86} y={742} width={172} color={['#F0D26A','#7CC8EA','#F18D9E','#A4D486'][i]} still={still}/>
 {i===3&&<ChalkText y="795" textAnchor="middle" fontSize="36" fill="#A4D486">网页 ↔ 软件</ChalkText>}
 </g>})}
 </svg>;
};
