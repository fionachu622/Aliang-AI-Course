import React from 'react';
const ease=(t:number,at:number,d:number)=>{const q=Math.max(0,Math.min(1,(t-at)/d));return q*q*(3-2*q);};
/** Naming correspondence first, then dock the same line above the definition. */
export const AgentIdentity:React.FC<{seconds:number}>=({seconds:t})=>{
 const move=ease(t,41.5,.65),equal=ease(t,42.15,.22),chinese=ease(t,42.53,.3);
 const dock=ease(t,43.35,.8),exit=ease(t,51.72,.4);
 const definition=ease(t,46.34,.3);
 return <g opacity={(1-exit)*ease(t,41.0666667,.2)} data-agent-identity="naming-then-dock">
  <g transform={`translate(960 ${540-285*dock}) scale(${1-.22*dock})`}>
   <text x={-325*move} y="0" dominantBaseline="central" textAnchor="middle" fill="#F5F1E8" fontSize="152">Agent</text>
   <text x="-15" y="0" dominantBaseline="central" textAnchor="middle" fill="#F5F1E8" fontSize="100" opacity={equal}>=</text>
   <text x="310" y="0" dominantBaseline="central" textAnchor="middle" fill="#7CC8EA" fontSize="152" opacity={chinese}>智能体</text>
  </g>
  <g opacity={definition}>
   <text x="960" y="495" textAnchor="middle" fill="#F5F1E8" fontSize="78">能替你办事的 AI</text>
   <path d="M817 517 Q925 522 1040 517" stroke="#F0D26A" strokeWidth="5" strokeLinecap="round" fill="none" opacity={ease(t,46.64,.3)}/>
  </g>
  <g opacity={1-ease(t,51,.3)}>
   <text x="670" y="705" textAnchor="middle" fill="#F5F1E8" fontSize="52" opacity={ease(t,47.68,.3)}>≠ 软件名</text>
   <text x="1220" y="705" textAnchor="middle" fill="#F5F1E8" fontSize="52" opacity={ease(t,49.71,.3)}>≠ 新的大模型</text>
  </g>
  <text x="960" y="705" textAnchor="middle" fill="#A4D486" fontSize="62" opacity={ease(t,51.3,.3)}>AI 系统</text>
 </g>;
};
