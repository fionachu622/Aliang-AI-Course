import {
  Lesson1ChalkboardRevisedReviewBoldPacingV2,
  type Lesson1ChalkboardRevisedReviewBoldPacingV2Props,
} from '../v18/Lesson1ChalkboardRevisedReviewBoldPacingV2';

/**
 * Centered canvas experiment.
 *
 * V2 remains on the legacy Studio-authored offsets. This composition opts in
 * to a centered scale origin and removes root-level translation compensation.
 */
export const Lesson1ChalkboardRevisedReviewBoldPacingCenteredV3 = (
  props: Omit<
    Lesson1ChalkboardRevisedReviewBoldPacingV2Props,
    'canvasAlignment'
  >,
) => (
  <Lesson1ChalkboardRevisedReviewBoldPacingV2
    {...props}
    canvasAlignment="centered"
  />
);
