import React from 'react';
import {CueDraw} from './CourseMotion';
export function DiagramIcon({kind,color,progress=1}:{kind:string;color:string;progress?:number}){
 const common={fill:'none',stroke:color,strokeWidth:3.5,strokeLinecap:'round' as const,strokeLinejoin:'round' as const};
 const doc=<><path d="M-49 -60 L20 -60 L49 -31 L49 62 L-49 62 Z M20 -60 L20 -31 L49 -31"/><path d="M-28 -9 H26 M-28 10 H26 M-28 29 H12"/></>;
 let art:React.ReactNode=doc;
 if(kind==='folder')art=<><path d="M-72 -32 L-72 -52 L-17 -52 L-1 -32 L73 -32 L66 57 L-67 57 Z"/><path d="M-67 -18 L66 -18"/></>;
 if(kind==='stack')art=<><path d="M-69 41 V-73 H21 M-59 50 V-66 H31"/>{doc}</>;
 if(kind==='core')art=<><path d="M-52 -50 Q-8 -78 50 -48 Q80 -4 48 48 Q3 78 -49 48 Q-79 1 -52 -50Z"/><path d="M-17 -30 Q-34 -27 -27 -10 Q-45 6 -24 19 Q-29 40 -4 33 M17 -30 Q34 -27 27 -10 Q45 6 24 19 Q29 40 4 33 M0 -37 V38 M-24 -7 L-4 2 M24 -7 L4 2"/></>;
 if(['browser','terminal','video','slide','chart'].includes(kind))art=<><path d="M-83 -54 L83 -54 L83 54 L-83 54 Z M-82 -32 H81"/><circle cx="-67" cy="-43" r="2"/><circle cx="-53" cy="-43" r="2"/>{kind==='video'?<path d="M-13 -14 L23 9 L-13 32Z"/>:kind==='terminal'?<path d="M-51 -9 L-34 5 L-51 19 M-20 23 H12"/>:kind==='chart'?<><path d="M-57 35 H58 M-57 35 V-17 M-30 33 V8 H-11 V33 M7 33 V-6 H26 V33 M41 33 V-20 H59 V33"/></>:kind==='slide'?<><path d="M-59 -8 H50 M-59 8 H12 M-59 24 H31"/></>:<><path d="M-61 -11 H48 M-61 9 H9 M-61 29 H35"/></>}</>;
 if(kind==='calendar')art=<><path d="M-66 -49 H66 V64 H-66Z M-66 -19 H66 M-37 -65 V-35 M37 -65 V-35"/>{[-32,0,32].map(x=>[-1,28].map(y=><path key={`${x}-${y}`} d={`M${x-7} ${y} h14 v12 h-14z`}/>))}</>;
 if(kind==='phone')art=<><path d="M-36 -73 H36 Q45 -73 45 -63 V65 Q45 76 35 76 H-35 Q-45 76 -45 65 V-63Q-45 -73 -36 -73Z M-15 -57 H15 M-10 59 H10"/><path d="M-25 -25 H25 M-25 -4 H25 M-25 17 H5"/></>;
 if(kind==='tool')art=<><path d="M24 -59 Q66 -67 67 -23 L41 -36 L19 -20 L21 7 L47 21 Q7 38 -12 9 L-57 60 Q-76 71 -77 50 L-30 -3 Q-44 -34 -13 -57 L-10 -24 L10 -18 L28 -30 Z"/></>;
 if(kind==='eye')art=<><path d="M-85 0 Q0 -83 85 0 Q0 83 -85 0Z"/><circle r="25"/><circle r="7"/></>;
 if(kind==='check')art=<><path d="M-57 -38 Q-85 22 -37 54 Q35 88 66 9 Q77 -21 54 -46"/><path d="M-36 0 L-8 28 L64 -52"/></>;
 if(kind==='butterfly')art=<><path d="M0 -36 V55 M-2 -24 Q-81 -98 -92 -26 Q-101 25 -8 21 Q-81 1 -72 55 Q-55 93 -1 37 M2 -24 Q81 -98 92 -26 Q101 25 8 21 Q81 1 72 55 Q55 93 1 37 M-1 -34 Q-16 -66 -28 -60 M1 -34 Q16 -66 28 -60"/></>;
 if(kind==='caterpillar')art=<>{[-60,-35,-10,15,40].map((x,i)=><React.Fragment key={x}><circle cx={x} cy={8-Math.sin(i)*5} r="20"/><path d={`M${x-5} 27 l-6 13`}/></React.Fragment>)}<circle cx="63" cy="-9" r="24"/><path d="M57 -31 l-9 -16 M72 -31 l8 -17"/><circle cx="71" cy="-12" r="2"/></>;
 if(kind==='pupa')art=<><path d="M-79 -62 Q0 -70 78 -56 M0 -62 V-28 Q-49 22 -10 72 Q53 23 0 -28 M-17 -7 Q22 21 15 50"/></>;
 if(kind==='gear')art=<><path d="M-16 -71 H16 L22 -48 L40 -41 L60 -51 L77 -23 L59 -5 V13 L77 25 L60 54 L36 46 L19 54 L15 76 H-16 L-22 52 L-41 41 L-61 51 L-78 23 L-58 6 V-13 L-76 -25 L-59 -53 L-36 -45 L-20 -52Z"/><circle r="29"/><circle r="10"/></>;
 if(kind==='poster')art=<><path d="M-51 -74 H51 V74 H-51Z M-35 -54 H35 M-35 -39 H18 M-35 49 H30 M-35 60 H8"/><path d="M-34 31 L-5 -9 L9 11 L23 -4 L38 31Z"/><circle cx="22" cy="-21" r="8"/></>;
 if(kind==='wallet')art=<><path d="M-68 -35 Q-71 -54 -48 -54 H50 V-36 M-68 -35 H67 V57 H-68 Z M67 -9 H21 V29 H67"/><circle cx="34" cy="10" r="3"/></>;
 if(kind==='upload')art=<><path d="M-58 17 V61 H58 V17 M0 38 V-63 M-29 -32 L0 -63 L29 -32"/></>;
 if(kind==='search')art=<><circle cx="-12" cy="-10" r="46"/><path d="M20 24 L68 74 M-36 -22 H9 M-36 -3 H15 M-36 16 H-3"/></>;
 if(kind==='meter-empty')art=<><path d="M-72 -28 H72 V29 H-72Z M77 -9 H87 V11 H77"/></>;
 if(kind==='meter')art=<><path d="M-72 -28 H72 V29 H-72Z M-62 -18 H-42 V19 H-62Z M-31 -18 H-11 V19 H-31Z M0 -18 H20 V19 H0Z M77 -9 H87 V11 H77"/></>;
 if(kind==='loop')art=<><path d="M-55 18 A60 60 0 1 1 36 46 M-55 18 L-76 -6 M-55 18 L-31 -3 M36 46 L64 49 M36 46 L45 18"/></>;
 return <svg viewBox="-110 -100 220 200" width="170" height="150" style={{overflow:'visible'}}><CueDraw t={0} at={0} progress={progress}><g {...common}>{art}</g></CueDraw></svg>;
}
