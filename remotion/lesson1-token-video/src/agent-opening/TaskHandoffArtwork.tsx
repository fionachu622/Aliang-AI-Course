import React from 'react';

const C={ink:'#F5F1E8',blue:'#7CC8EA',paper:'#24272A',yellow:'#F0D26A'};
const ease=(t:number,start:number,duration:number)=>{const p=Math.max(0,Math.min(1,(t-start)/duration));return p*p*(3-2*p);};

// A held tableau, followed by one slow handoff. No cuts or explanatory labels.
export const TaskHandoffArtwork:React.FC<{seconds:number;backgroundUrl?:string}>=({seconds:t,backgroundUrl})=>{
 const handoff=ease(t,14.33,1.25);
 const stroke={fill:'none',stroke:C.ink,strokeWidth:6,strokeLinecap:'round' as const,strokeLinejoin:'round' as const};
 return <svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0,fontFamily:'AgentFullHanzi, HanziPen SC, cursive'}}>
  {backgroundUrl&&<image href={backgroundUrl} width="1920" height="1080" preserveAspectRatio="xMidYMid slice"/>}
  <g {...stroke}>
   {/* Chair and table anchor the entire shot. */}
   <path d="M496 514 L521 817 Q522 837 548 837 H714 M551 839 L532 946 M682 839 L710 946" opacity=".6"/>
   <path d="M737 682 H1453 M771 683 L757 947 M1417 683 L1430 947"/>
   {/* The same neat, substantial workload stays in the same place. */}
   {[...Array(12)].map((_,i)=><g key={i} transform={`translate(${i%2?3:0} ${-i*13})`}>
    <path d="M975 659 L1211 659 L1234 678 H997 Z" fill={C.paper} strokeWidth="3"/>
   </g>)}
   <path d="M997 509 H1177 M1014 524 H1192" strokeWidth="3" opacity=".35"/>
   <path d="M1080 516 L1112 516 L1112 544 L1096 535 L1080 544 Z" fill={C.yellow} stroke="none"/>
   {/* Head and torso lean back together, slowly, as the work is taken over. */}
   <g transform={`rotate(${-13*handoff} 620 802)`}>
    <path d="M565 568 Q534 621 548 704 L559 797 Q618 818 697 797 L688 660" fill={C.paper}/>
    <path d="M588 538 L584 572 M632 538 L636 572"/>
    <path d="M552 436 Q551 386 596 377 Q651 367 676 413 L676 471 Q674 516 637 539 Q601 552 574 521 Q554 500 552 436 Z" fill={C.paper}/>
    <path d="M555 434 Q577 431 591 406 Q627 429 673 418 M554 431 Q539 456 555 475"/>
    <path d="M613 458 l15 2 M650 456 l14 -1 M640 464 l8 23 -12 2" strokeWidth="4"/>
    <path d={`M618 509 Q634 ${510+handoff*12} 649 504`} strokeWidth="4"/>
    {/* Forearm props the cheek before the handoff; settles on desk afterwards. */}
    <path d={`M576 604 Q609 647 727 665 L${696-35*handoff} ${527+118*handoff} Q${689-31*handoff} ${510+130*handoff} ${678-28*handoff} ${517+130*handoff}`} />
    <path d={`M${696-35*handoff} ${530+118*handoff} L${689-30*handoff} ${496+151*handoff} M${681-26*handoff} ${522+126*handoff} L${677-24*handoff} ${500+147*handoff}`} strokeWidth="4"/>
    <path d="M565 800 Q631 817 717 803 L773 921 M697 803 L701 929 M773 921 L807 941 M701 929 L739 945"/>
   </g>
   {/* Only new actor: AI quietly starts lifting the top sheet. */}
   <g opacity={handoff} stroke={C.blue}>
    <rect x="1310" y="435" width="144" height="117" rx="28" fill={C.paper}/>
    <path d="M1382 435 V411"/><circle cx="1382" cy="402" r="8" fill={C.blue} stroke="none"/>
    <circle cx="1352" cy="479" r="7" fill={C.blue} stroke="none"/><circle cx="1412" cy="479" r="7" fill={C.blue} stroke="none"/>
    <path d="M1359 516 Q1382 529 1405 516" strokeWidth="4"/>
    <path d="M1339 564 Q1378 552 1420 565 L1441 665 H1301 Z" fill={C.paper}/>
    <text x="1373" y="627" fill={C.blue} stroke="none" fontSize="37" textAnchor="middle">AI</text>
    <path d={`M1320 582 Q1256 620 1205 ${536-20*handoff}`}/>
    <g transform={`translate(${18*handoff} ${-28*handoff}) rotate(${-6*handoff} 1100 518)`}>
     <path d="M979 516 H1207 L1230 535 H1001 Z" fill={C.paper} strokeWidth="3"/>
     <path d="M1011 524 H1180" strokeWidth="2" opacity=".5"/>
    </g>
   </g>
  </g>
 </svg>;
};
