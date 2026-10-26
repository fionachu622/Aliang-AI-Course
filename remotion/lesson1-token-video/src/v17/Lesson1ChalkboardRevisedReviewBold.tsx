import {AbsoluteFill} from 'remotion';
import {Lesson1ChalkboardRevisedReview} from '../v16/Lesson1ChalkboardRevisedReview';

export type Lesson1ChalkboardRevisedReviewBoldProps = {
  fontWeight?: 500 | 600 | 700;
  strokeWidth?: number;
};

/**
 * Readability pass for the review composition.
 *
 * The original v16 composition is rendered unchanged underneath. HanziPen SC
 * does not provide a dedicated semibold face, so this version combines a
 * browser-synthesized semibold with a restrained same-color stroke. The stroke
 * increases perceived chalk weight without changing glyph metrics or layout.
 */
export const Lesson1ChalkboardRevisedReviewBold = ({
  fontWeight = 600,
  strokeWidth = 0.65,
}: Lesson1ChalkboardRevisedReviewBoldProps) => {
  const smallStrokeWidth = Math.max(0.2, strokeWidth * 0.46);
  const largeStrokeWidth = strokeWidth * 1.23;

  return (
    <AbsoluteFill className="lesson1-review-bold">
      <style>{`
        .lesson1-review-bold div,
        .lesson1-review-bold span {
          font-weight: ${fontWeight} !important;
          -webkit-text-stroke: ${strokeWidth}px currentColor;
          paint-order: stroke fill;
        }

        .lesson1-review-bold [style*="font-size: 2"] {
          font-weight: 500 !important;
          -webkit-text-stroke-width: ${smallStrokeWidth}px;
        }

        .lesson1-review-bold [style*="font-size: 6"],
        .lesson1-review-bold [style*="font-size: 7"],
        .lesson1-review-bold [style*="font-size: 8"],
        .lesson1-review-bold [style*="font-size: 9"] {
          -webkit-text-stroke-width: ${largeStrokeWidth}px;
        }
      `}</style>
      <Lesson1ChalkboardRevisedReview />
    </AbsoluteFill>
  );
};
