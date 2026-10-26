import {ChalkText} from './CourseTypography';
import React from 'react';
import {staticFile} from 'remotion';

// Original narration clock. Preserve every approved cue; the composition maps the edit once.
const appear = (t: number, at: number, d = 0.24) => {
  const q = Math.max(0, Math.min(1, (t - at) / d));
  return q * q * (3 - 2 * q);
};
const C = {
  ink: '#F5F1E8',
  blue: '#7CC8EA',
  green: '#A4D486',
  muted: '#B1B4AD',
  pink: '#F18D9E',
  panel: '#192526',
};
// Course-wide visual identity: English and Chinese both use the chalk handwriting font.
const titleFont = 'AgentFullHanzi, HanziPen SC, cursive';

// Fixed-seed texture: chalk stays still when the timeline is scrubbed.
const ChalkPath: React.FC<React.SVGProps<SVGPathElement>> = (props) => (
  <path {...props} filter="url(#identity-chalk-stroke)" />
);

const RejectBadge: React.FC<{x: number; y: number}> = ({x, y}) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r="28" fill={C.panel} />
    <g fill="none" stroke="#E56255" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
      <ChalkPath d="M0 -28 C16 -29 29 -17 28 0 C29 16 16 29 -1 28 C-18 28 -29 15 -28 -2 C-28 -18 -15 -29 0 -28 Z" />
      <ChalkPath d="M-10 -11 Q0 0 11 11 M11 -11 Q1 1 -11 11" strokeWidth="5" />
    </g>
  </g>
);

export const AgentIdentity: React.FC<{seconds: number}> = ({seconds: t}) => {
  // First teach the name as an equation, then settle into the existing system diagram.
  const nameMove = appear(t, 42.06, 0.47);
  const settle = appear(t, 47.1, 0.7);
  const titleX = 960 - 242 * nameMove * (1 - settle);
  // Lift before the two names converge horizontally, so their glyphs never touch.
  const titleLift = appear(t, 47.1, 0.3);
  const titleY = (580 - 100 * nameMove) * (1 - titleLift) + 382 * titleLift;
  const chineseX = 1194 + (960 - 1194) * settle;
  // At 112px, the font's visible centers need +8px for Chinese and -8.5px for '='.
  // Align the glyphs optically rather than giving unlike scripts a shared baseline.
  const chineseY = 488 + (479 - 488) * settle;
  const definitionY = 625 + (591 - 625) * settle;
  const definitionSuffixAt = 46.22;
  const definitionTextFade = .24;
  // Let the last words settle, leave a short reading beat, then emphasize once.
  const definitionHighlightAt = definitionSuffixAt + definitionTextFade + .16;
  const definitionHighlight = appear(t, definitionHighlightAt, .38);
  // Keep the opening statement prominent, then match the settled Chinese label.
  const definitionSize = 68 + (52 - 68) * settle;
  // Advance widths and ink bounds from the course font keep the marker on the keyword.
  const keywordX = 960 - 7.522 * definitionSize / 2 + 1.03 * definitionSize;
  const markerX = keywordX + .139 * definitionSize - 5;
  const markerWidth = (4.038 - .139) * definitionSize + 10;
  const markerTop = 591 - .84 * definitionSize - 3;
  const markerBottom = 591 + .196 * definitionSize + 3;
  const markerMid = (markerTop + markerBottom) / 2;
  const workflow = appear(t, 51.72, 0.3);
  const clarification = 1 - appear(t, 50.5, 0.35);
  const input = appear(t, 52.19, 0.32),
    output = appear(t, 53.45, 0.35);
  return (
    <g
      data-agent-identity="persistent-system-diagram"
      opacity={appear(t, 41.0666667, 0.2)}
    >
      <defs>
        <clipPath id="identity-definition-marker">
          <rect x={markerX} y={markerTop - 4} width={markerWidth * definitionHighlight} height={markerBottom - markerTop + 8} />
        </clipPath>
        <filter
          id="identity-chalk-stroke"
          x="-20%"
          y="-100%"
          width="140%"
          height="300%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency=".42"
            numOctaves="3"
            seed="17"
            result="grain"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="grain"
            scale="1.4"
            xChannelSelector="R"
            yChannelSelector="G"
            result="edge"
          />
          <feColorMatrix
            in="grain"
            type="matrix"
            values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  .3 .3 .3 0 0"
            result="dust"
          />
          <feComponentTransfer in="dust" result="chalkDensity">
            <feFuncA type="linear" slope=".7" intercept=".3" />
          </feComponentTransfer>
          <feComposite in="edge" in2="chalkDensity" operator="in" />
        </filter>
      </defs>
      {/* The system boundary is drawn onto the blackboard, with no UI card fill. */}
      <g
        opacity={appear(t, 47.1, 0.7)}
        fill="none"
        stroke={C.blue}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <ChalkPath
          d="M654 283 Q647 254 678 256 Q948 250 1241 255 Q1269 255 1267 282 L1271 607 Q1274 639 1244 638 Q953 644 678 639 Q649 642 652 614 Q648 446 654 283"
          strokeWidth="4.5"
        />
        <ChalkPath
          d="M675 261 Q903 255 1112 260 M1262 297 Q1267 432 1264 550 M1225 633 Q1027 639 826 634 M659 578 Q654 472 658 381"
          strokeWidth="1.6"
          opacity=".28"
        />
      </g>
      <ChalkText
        x={titleX}
        y={titleY}
        textAnchor="middle"
        fill={C.ink}
        fontFamily={titleFont}
        fontWeight="400"
        fontSize={132 - 20 * nameMove}
        letterSpacing="0"
      >
        Agent
      </ChalkText>
      <ChalkText
        x="948"
        y="471.5"
        textAnchor="middle"
        fontFamily={titleFont}
        fontSize="112"
        fill={C.blue}
        opacity={appear(t, 42.53) * (1 - titleLift)}
      >
        =
      </ChalkText>
      <ChalkText
        x={chineseX}
        y={chineseY}
        textAnchor="middle"
        fill={C.blue}
        fontSize={112 + (52 - 112) * titleLift}
        letterSpacing={6 * settle}
        opacity={appear(t, 42.53)}
      >
        智能体
      </ChalkText>
      <g
        opacity={(1 - workflow) * appear(t, 45.67)}
        transform={`translate(0 ${definitionY - 591 + 10 * (1 - appear(t, 45.67, 0.3))})`}
      >
        <path
          d={`M${markerX+8} ${markerTop+5} Q${markerX+markerWidth*.46} ${markerTop-3} ${markerX+markerWidth-8} ${markerTop+4} Q${markerX+markerWidth+5} ${markerMid} ${markerX+markerWidth-3} ${markerBottom-2} Q${markerX+markerWidth*.53} ${markerBottom+2} ${markerX+6} ${markerBottom-3} Q${markerX-3} ${markerMid} ${markerX+8} ${markerTop+5}Z`}
          fill="#FFEA00"
          opacity=".52"
          clipPath="url(#identity-definition-marker)"
          data-highlight-phrase="替你办事"
        />
        <path
          d={`M${markerX+5} ${markerBottom-1} Q${markerX+markerWidth*.52} ${markerBottom+4} ${markerX+markerWidth-5} ${markerBottom-2}`}
          fill="none" stroke="#FFE83A" strokeWidth="2.5" strokeLinecap="round" opacity=".9"
          clipPath="url(#identity-definition-marker)"
        />
        <ChalkText x="960" y="591" textAnchor="middle" fill={C.ink} fontSize={definitionSize}>
          能替你办事<tspan opacity={appear(t, definitionSuffixAt, definitionTextFade)}>的 AI</tspan>
        </ChalkText>
      </g>
      {/* Clarifications clear before either endpoint of the workflow is revealed. */}
      <g opacity={appear(t, 48.09) * clarification}>
        <g
          stroke={C.ink}
          fill="none"
          strokeWidth="3.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <ChalkPath d="M230 349 Q229 330 249 331 Q350 328 452 332 Q472 332 470 352 L472 505 Q473 525 451 524 Q351 527 248 524 Q228 524 230 503 Z" />
          <ChalkPath d="M231 375 Q350 378 470 374" />
          <ChalkPath d="M260 347 C270 347 270 361 260 361 C250 361 250 347 260 347 Z" stroke={C.pink} strokeWidth="3" />
          <ChalkPath d="M284 347 C294 347 294 361 284 361 C274 361 274 347 284 347 Z" stroke="#F0D26A" strokeWidth="3" />
          <ChalkPath d="M308 347 C318 347 318 361 308 361 C298 361 298 347 308 347 Z" stroke={C.green} strokeWidth="3" />
          <ChalkPath d="M311 413 Q310 397 326 397 L374 398 Q390 397 389 413 L390 456 Q389 474 374 473 L326 474 Q310 474 311 457 Z" stroke={C.blue} strokeWidth="4" />
          <ChalkPath d="M350 413 Q352 435 350 451 M336 438 L350 452 L365 436" strokeWidth="4.5" />
          <ChalkPath d="M273 490 Q350 488 426 490 Q438 492 435 502 Q434 510 424 509 L274 510 Q263 509 265 499 Q264 491 273 490 Z" strokeWidth="3" />
          <ChalkPath d="M276 500 Q319 498 360 500" stroke={C.green} strokeWidth="7" />
        </g>
        <RejectBadge x={475} y={335} />
        <ChalkText x="350" y="616" textAnchor="middle" fill={C.ink} fontSize="44">
          软件
        </ChalkText>
      </g>
      <g opacity={appear(t, 49.71) * clarification}>
        <g
          stroke={C.blue}
          fill="none"
          strokeWidth="3.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <ChalkPath d="M1478 351 Q1477 331 1499 331 Q1571 328 1643 332 Q1663 332 1661 351 L1663 491 Q1664 512 1643 511 Q1570 514 1498 512 Q1477 512 1479 491 Z" />
          <ChalkPath
            d="M1505 366 Q1504 355 1518 355 L1625 356 Q1636 356 1635 369 L1636 475 Q1637 488 1623 487 L1518 489 Q1504 489 1506 475 Z"
            stroke="#F0D26A" strokeWidth="3.2"
          />
          {[0, 1, 2, 3].map((i) => (
            <ChalkPath
              key={i}
              d={`M${1501 + i * 45} 311V329 M${1501 + i * 45} 514V534 M1458 ${357 + i * 43}H1476 M1665 ${357 + i * 43}H1684`}
            />
          ))}
        </g>
        <ChalkText x="1570" y="441" textAnchor="middle" fill={C.ink} fontSize="54">
          LLM
        </ChalkText>
        <RejectBadge x={1691} y={335} />
        <ChalkText x="1570" y="616" textAnchor="middle" fill={C.ink} fontSize="44">
          大模型
        </ChalkText>
      </g>
      {/* Category sits outside the system boundary, aligned to the name below. */}
      <g opacity={appear(t, 51.19)}>
        <ChalkText x="960" y="210" textAnchor="middle" fill={C.blue} fontSize="52">
          一类 AI 系统
        </ChalkText>
      </g>
      <g opacity={appear(t, 51.72)}>
        <image
          href={staticFile(
            'agent-course/identity-illustrations/requester-v1.png',
          )}
          x="207"
          y="210"
          width="286"
          height="290"
          preserveAspectRatio="xMidYMax meet"
        />
      </g>
      <ChalkText
        x="350"
        y="574"
        textAnchor="middle"
        fontSize="52"
        fill={C.ink}
        opacity={appear(t, 52.02)}
      >
        你提需求
      </ChalkText>
      <g
        opacity={input}
        stroke={C.blue}
        fill="none"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <ChalkPath
          d="M488 440Q546 435 614 439"
          pathLength="1"
          strokeDasharray="1"
          strokeDashoffset={1 - input}
        />
        <ChalkPath
          d="M600 429Q607 435 614 439L600 449"
          opacity={input > 0.95 ? 1 : 0}
        />
      </g>
      <g opacity={appear(t, 52.67)}>
        <ChalkText x="960" y="574" textAnchor="middle" fontSize="52" fill={C.ink}>
          它干活
        </ChalkText>
      </g>
      <g
        opacity={output}
        stroke={C.green}
        fill="none"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <ChalkPath
          d="M1306 439Q1368 444 1432 438"
          pathLength="1"
          strokeDasharray="1"
          strokeDashoffset={1 - output}
        />
        <ChalkPath
          d="M1418 428L1432 438Q1425 444 1418 449"
          opacity={output > 0.95 ? 1 : 0}
        />
      </g>
      <g opacity={appear(t, 53.45)}>
        <image
          href={staticFile(
            'agent-course/identity-illustrations/deliverable-v1.png',
          )}
          x="1450"
          y="232"
          width="240"
          height="268"
          preserveAspectRatio="xMidYMax meet"
        />
      </g>
      <ChalkText
        x="1570"
        y="574"
        textAnchor="middle"
        fontSize="52"
        fill={C.ink}
        opacity={appear(t, 53.94)}
      >
        交付结果
      </ChalkText>
    </g>
  );
};
