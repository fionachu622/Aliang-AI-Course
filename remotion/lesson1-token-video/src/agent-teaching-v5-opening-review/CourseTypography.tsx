import React from 'react';
import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

// Match Lesson1ChalkboardV3 (v21): 600, .65px, lighter small labels.
export const courseFont = 'AgentFullHanzi, "HanziPen SC", cursive';
export const loadCourseFonts = () => Promise.all([
  loadFont({family: 'AgentFullHanzi', url: staticFile('fonts/AgentFullHanzi.woff2'), weight: '400'}),
  loadFont({family: 'AgentFullHanzi', url: staticFile('fonts/AgentTeachingHanzi-Bold.woff2'), weight: '600'}),
]);

export const ChalkText: React.FC<React.SVGProps<SVGTextElement>> = ({
  fill = '#F5F1E8', fontSize, style, ...props
}) => {
  const size = Number(fontSize);
  const small = size > 0 && size < 30;
  return <text {...props} fill={fill} fontSize={fontSize}
    fontFamily={courseFont} fontWeight={small ? 500 : 600}
    // SVG currentColor is independent of fill. Match the outline to each label.
    stroke={fill} strokeWidth={small ? .299 : size >= 60 ? .7995 : .65}
    strokeLinejoin="round"
    style={{...style, WebkitTextStroke: '0px', paintOrder: 'stroke fill'}} />;
};

export const CourseTypography: React.FC = () => <style>{`
  .agent-course-typography div, .agent-course-typography span {
    font-weight: 600 !important;
    -webkit-text-stroke: .65px currentColor !important;
    paint-order: stroke fill;
  }
  .agent-course-typography [style*="font-size: 2"] {
    font-weight: 500 !important;
    -webkit-text-stroke-width: .299px !important;
  }
  .agent-course-typography [style*="font-size: 6"],
  .agent-course-typography [style*="font-size: 7"],
  .agent-course-typography [style*="font-size: 8"],
  .agent-course-typography [style*="font-size: 9"] {
    -webkit-text-stroke-width: .7995px !important;
  }
`}</style>;
