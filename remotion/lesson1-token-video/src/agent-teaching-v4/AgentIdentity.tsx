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

export const AgentIdentity: React.FC<{seconds: number}> = ({seconds: t}) => {
  // First teach the name as an equation, then settle into the existing system diagram.
  const nameMove = appear(t, 42.06, 0.47);
  const settle = appear(t, 47.1, 0.7);
  const titleX = 960 - 200 * nameMove * (1 - settle);
  // Lift before the two names converge horizontally, so their glyphs never touch.
  const titleLift = appear(t, 47.1, 0.3);
  const titleY = (580 - 100 * nameMove) * (1 - titleLift) + 382 * titleLift;
  const chineseX = 1140 + (960 - 1140) * settle;
  const chineseY = 480 + (479 - 480) * settle;
  const definitionY = 625 + (591 - 625) * settle;
  const definitionHighlight = appear(t, 45.67, 0.52);
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
        fontSize={132 - 20 * titleLift}
        letterSpacing="0"
      >
        Agent
      </ChalkText>
      <ChalkText
        x="965"
        y="480"
        textAnchor="middle"
        fontFamily={titleFont}
        fontSize="76"
        fill={C.blue}
        opacity={appear(t, 42.53) * (1 - settle)}
      >
        =
      </ChalkText>
      <ChalkText
        x={chineseX}
        y={chineseY}
        textAnchor="middle"
        fill={C.blue}
        fontSize={88 + (52 - 88) * settle}
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
          d="M777 571 Q919 565 1053 574"
          fill="none"
          stroke="#F0D26A"
          strokeWidth="56"
          strokeLinecap="round"
          pathLength="1"
          strokeDasharray="1"
          strokeDashoffset={1 - definitionHighlight}
          opacity=".46"
        />
        <ChalkText x="960" y="591" textAnchor="middle" fill={C.ink} fontSize="50">
          能替你办事<tspan opacity={appear(t, 46.22)}>的 AI</tspan>
        </ChalkText>
      </g>
      {/* Clarifications clear before either endpoint of the workflow is revealed. */}
      <g opacity={appear(t, 48.09) * clarification}>
        <g
          stroke={C.muted}
          fill="none"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <ChalkPath d="M257 369 Q252 354 270 356 L429 353 Q447 354 445 371 L449 475 Q448 490 430 488 L270 490 Q254 488 256 473 Z" />
          <ChalkPath d="M256 387Q350 390 445 385 M277 371L280 370 M291 371L294 372 M305 371L308 370 M281 414Q325 412 370 415 M281 431Q340 433 399 429 M281 448Q310 450 337 447" />
        </g>
        <circle cx="442" cy="477" r="24" fill={C.panel} />
        <ChalkPath
          d="M432 467L452 487M452 467L432 487"
          stroke={C.pink}
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <ChalkText x="350" y="563" textAnchor="middle" fill={C.muted} fontSize="37">
          不是某个软件的名字
        </ChalkText>
      </g>
      <g opacity={appear(t, 49.71) * clarification}>
        <g
          stroke={C.muted}
          fill="none"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <ChalkPath d="M1504 373 Q1500 355 1520 357 L1620 354 Q1639 355 1636 374 L1640 470 Q1639 490 1619 487 L1520 490 Q1501 488 1504 471 Z" />
          <ChalkPath
            d="M1538 392 Q1570 389 1603 391 L1601 453 Q1567 455 1536 451 Z"
            strokeOpacity=".6"
          />
          {[0, 1, 2, 3].map((i) => (
            <ChalkPath
              key={i}
              d={`M${1525 + i * 30} 340V355 M${1525 + i * 30} 488V503 M1487 ${378 + i * 28}H1502 M1638 ${378 + i * 28}H1653`}
            />
          ))}
        </g>
        <circle cx="1637" cy="484" r="24" fill={C.panel} />
        <ChalkPath
          d="M1627 474L1647 494M1647 474L1627 494"
          stroke={C.pink}
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <ChalkText x="1570" y="563" textAnchor="middle" fill={C.muted} fontSize="37">
          不是新的大模型
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
