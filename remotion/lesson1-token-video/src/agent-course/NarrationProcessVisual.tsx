import React from 'react';
import {AbsoluteFill, Img, staticFile, interpolate, Easing} from 'remotion';

const ink='#F5F1E8',blue='#7CC8EA',green='#A4D486',yellow='#F0D26A';
const clamp={extrapolateLeft:'clamp',extrapolateRight:'clamp'} as const;
const text=(x:number,y:number,value:string,color=ink,size=48)=><text x={x} y={y} fill={color} fontSize={size} textAnchor="middle">{value}</text>;
function Symbol({kind,x,y,color=ink}:{kind:string;x:number;y:number;color?:string}) {
 return <g transform={`translate(${x} ${y})`} fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
  {kind==='files'?<><path d="M-65 -45 V-75 H25 L60 -40 V65 H-65 Z M25 -75 V-40 H60 M-40 -10 H30 M-40 15 H30 M-40 40 H10"/><path d="M-85 -50 V85 H40"/></>:kind==='check'?<><circle r="70"/><path d="M-38 0 L-8 30 L43 -33"/></>:kind==='person'?<><circle cy="-45" r="30"/><path d="M-65 75 V45 Q-60 0 0 0 Q60 0 65 45 V75"/></>:kind==='search'?<><circle cx="-12" cy="-12" r="53"/><path d="M27 27 L75 75 M-40 -23 H14 M-40 0 H5"/></>:kind==='video'?<><rect x="-90" y="-65" width="180" height="130" rx="10"/><path d="M-20 -33 L37 0 L-20 33 Z"/></>:kind==='upload'?<><path d="M0 35 V-75 M-35 -40 L0 -75 L35 -40 M-70 15 V70 H70 V15"/></>:kind==='trash'?<><path d="M-55 -40 L-45 75 H45 L55 -40 M-70 -40 H70 M-25 -40 V-65 H25 V-40 M-18 -15 V45 M18 -15 V45"/></>:kind==='wallet'?<><rect x="-80" y="-50" width="160" height="110" rx="10"/><path d="M80 -15 H20 V30 H80 M-65 -50 V-70 H55 V-50"/><circle cx="40" cy="7" r="4"/></>:<><path d="M-70 -60 H70 V60 H-70Z M-45 -25 H45 M-45 0 H45 M-45 25 H15"/></>}
 </g>;
}
export function NarrationProcessVisual({scene,seconds}:{scene:string;seconds:number}) {
 const p=(at:number,d=.6)=>interpolate(seconds,[at,at+d],[0,1],{...clamp,easing:Easing.bezier(.22,.7,.25,1)});
 const arrow=(x1:number,x2:number,y:number,at:number,color=blue)=> <g opacity={p(at)} fill="none" stroke={color} strokeWidth="6" strokeLinecap="round"><path d={`M${x1} ${y} H${x2}`} pathLength="1" strokeDasharray="1" strokeDashoffset={1-p(at)}/><path d={`M${x2-20} ${y-14} L${x2} ${y} L${x2-20} ${y+14}`}/></g>;
 const node=(kind:string,x:number,label:string,at:number,color=ink)=><g opacity={p(at)}><Symbol kind={kind} x={x} y={490} color={color}/>{text(x,660,label,color)}</g>;
 let art:React.ReactNode;
 if(scene==='ProcessChain') {
  const step=seconds<232.6?0:seconds<235?1:2;
  art=<>{text(960,190,'围绕一个目标，连续推进',ink,64)}
   {node('search',400,'查资料',224.4,blue)}{node('files',960,'处理文件',228,blue)}{node('check',1520,'交付完整工作',235,green)}
   {arrow(540,800,490,232.6)}{arrow(1120,1380,490,235,green)}
   <path d="M360 780 H1560" stroke={ink} strokeOpacity=".2" strokeWidth="8"/>
   <path d={`M360 780 H${360+1200*p(232.6,6)}`} stroke={green} strokeWidth="8"/>
   <circle cx={360+1200*p(232.6,6)} cy="780" r="13" fill={green}/>
   {text(960,875,step===0?'一个目标，往往不止一步':step===1?'做完一部分，接着下一部分':'把整段工作交给它',step===2?green:ink,42)}
  </>;
 } else if(scene==='ApprovalGates') {
  art=<>{text(960,190,'先预览，再成片',ink,64)}
   {node('video',400,'预览',578.76,blue)}{node('video',960,'成片',581.92,green)}{node('upload',1520,'发布',584.04,green)}
   {arrow(530,815,490,581.92)}{arrow(1095,1380,490,584.04)}
   <g opacity={p(581.92)}><Symbol kind="person" x={680} y={790} color={yellow}/>{text(680,920,'我确认效果',yellow,40)}<path d="M680 680 V530" stroke={yellow} strokeWidth="5"/></g>
   <g opacity={p(584.04)}><Symbol kind="person" x={1240} y={790} color={yellow}/>{text(1240,920,'我确认发布',yellow,40)}<path d="M1240 680 V530" stroke={yellow} strokeWidth="5"/></g>
  </>;
 } else if(scene==='ResearchToStory') {
  const detail=seconds<607.32?'让 Agent 安排具体步骤':seconds<614.2?'选择每个阶段要展示的内容':seconds<618.04?'决定哪里放慢、哪里补充解释':'把知识变成看得懂的画面与讲解';
  art=<>{text(960,190,'从资料到讲解',ink,64)}
   {node('search',350,'查资料',600.84,blue)}{node('files',960,'组织内容',603.08,blue)}{node('video',1570,'画面与讲解',618.04,green)}
   {arrow(485,810,490,603.08)}{arrow(1110,1435,490,618.04,green)}
   <g opacity={p(610.36)}>{text(960,785,'毛毛虫  →  化蛹  →  羽化',yellow,42)}</g>
   {text(960,925,detail,ink,40)}
  </>;
 } else if(scene==='PreviewRevision') {
  const late=seconds>=694.76;
  art=<>{text(960,190,late?'等全部做完，再改就要返工':'在预览阶段发现问题',ink,60)}
   {node('video',390,'动画预览',686.52,blue)}{node('files',960,'配音与字幕',694.76,yellow)}{node('video',1530,'完整视频',694.76,green)}
   {arrow(535,810,490,694.76)}{arrow(1110,1385,490,694.76)}
   <g opacity={p(691.56)}><path d={late?'M1530 710 C1530 900 390 900 390 710':'M485 440 C690 210 90 210 300 440'} fill="none" stroke={yellow} strokeWidth="6" pathLength="1" strokeDasharray="1" strokeDashoffset={1-p(late?697.56:691.56)}/>{text(960,940,late?'一处内容变化，多个环节重做':'现在就改画面和讲解',yellow,44)}</g>
  </>;
 } else if(scene==='SafetyBoundary') {
  const phase=seconds<844.68?'publish':seconds<856.44?'files':'payment';
  const start=phase==='publish'?829.8:phase==='files'?844.68:856.44;
  const gate=phase==='publish'?831:phase==='files'?852.12:860.68;
  const kind=phase==='publish'?'upload':phase==='files'?'trash':'wallet';
  const title=phase==='publish'?'公开发布':phase==='files'?'删除与覆盖':'下单付款';
  art=<>{text(960,190,title,ink,64)}
   {node(kind,420,title,start,blue)}
   <path d="M590 490 H820" stroke={blue} strokeWidth="6"/>
   <g opacity={p(gate)}><path d="M900 345 V620 M930 345 V620" stroke={yellow} strokeWidth="9"/>{text(915,710,phase==='files'?'先检查备份':'等你确认',yellow,48)}</g>
   {node(phase==='files'?'files':'person',1440,phase==='files'?'保留可恢复的副本':'由你把关',gate,green)}
   {phase==='payment'&&<g opacity={p(860.68)}>{text(960,910,'金额  ·  地址  ·  账号',yellow,48)}</g>}
   {phase==='publish'&&<g opacity={p(839.56)}>{text(960,910,'视频  ·  消息  ·  邮件',ink,42)}</g>}
  </>;
 } else {
  const extra=seconds>=1190.12;
  const spent=p(1181.24,1.8);
  art=<>{text(960,190,extra?'额度用完，可以加购':'运行任务，消耗额度',ink,64)}
   <g transform="translate(300 400)"><rect width="560" height="150" rx="14" fill="none" stroke={blue} strokeWidth="6"/>{Array.from({length:8},(_,i)=><rect key={i} x={20+i*66} y="20" width="54" height="110" rx="5" fill={blue} opacity={extra?.08:i<8-Math.floor(spent*4)?1:.1}/>)}</g>
   {text(580,660,extra?'剩余额度不足':'可用额度',blue)}
   <Symbol kind={extra?'wallet':'check'} x={1370} y={480} color={green}/>{text(1370,660,extra?'单独购买额度':'执行任务',green)}
   {arrow(920,1210,480,extra?1192.2:1181.24,green)}
   {text(960,850,seconds>=1197.92?'自动加购 → 设置消费上限':seconds>=1194.68?'先看有效期，区分订阅自带额度':seconds>=1187?'用自己的常用任务实测消耗':seconds>=1183.04?'平台规则不同，不能只比积分数量':'',yellow,44)}
  </>;
 }
 return <AbsoluteFill style={{background:'#24272A',fontFamily:'AgentFullHanzi',color:ink}}>
  <Img src={staticFile('shared-visual/backgrounds/chalkboard/chalkboard.png')} style={{position:'absolute',width:'100%',height:'100%',objectFit:'cover'}}/>
  <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}}>{art}</svg>
 </AbsoluteFill>;
}
export const processScenes=new Set(['ProcessChain','ApprovalGates','ResearchToStory','PreviewRevision','SafetyBoundary','UsageCredits']);
