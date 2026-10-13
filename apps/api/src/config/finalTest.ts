/**
 * The shape of the full theory test, mirroring the official class-B exam:
 * 30 questions split 20 Grundstoff / 10 class-B Zusatzstoff, weighted 2 to 5
 * error points, with at most 10 error points allowed to pass and never two
 * 5-point questions wrong.
 */
export const FINAL_TEST = {
  questionCount: 30,
  timeLimitMinutes: 45,
  /** Maximum error points that still pass. */
  maxErrorPoints: 10,
  /** Failing two 5-point questions fails the exam regardless of the total. */
  maxFivePointMistakes: 1,
  /** How the 30 questions are composed, as the official exam splits them. */
  mix: {
    grundstoff: 20,
    zusatzstoff: 10,
  },
} as const;

export interface GradeResult {
  errorPoints: number;
  failedByFivePointRule: boolean;
  passed: boolean;
  grade: "A" | "B" | "C" | "F";
}

/**
 * Grades a finished session. The grade letter is derived from error points so
 * learners still see a familiar scale, but pass/fail follows the official rule.
 */
export function gradeSession(
  wrongAnswers: { errorPoints: number }[],
  unansweredErrorPoints: number[] = [],
): GradeResult {
  const all = [
    ...wrongAnswers.map((a) => a.errorPoints),
    ...unansweredErrorPoints,
  ];

  const errorPoints = all.reduce((sum, p) => sum + p, 0);
  const fivePointMistakes = all.filter((p) => p === 5).length;
  const failedByFivePointRule =
    fivePointMistakes > FINAL_TEST.maxFivePointMistakes;

  const passed =
    errorPoints <= FINAL_TEST.maxErrorPoints && !failedByFivePointRule;

  let grade: GradeResult["grade"];
  if (failedByFivePointRule || errorPoints > FINAL_TEST.maxErrorPoints)
    grade = "F";
  else if (errorPoints <= 2) grade = "A";
  else if (errorPoints <= 6) grade = "B";
  else grade = "C";

  return { errorPoints, failedByFivePointRule, passed, grade };
}

/** Kept for the topic-practice routes, which score by percentage. */
export function computeGrade(ratio: number): "A" | "B" | "C" | "F" {
  if (ratio >= 0.9) return "A";
  if (ratio >= 0.75) return "B";
  if (ratio >= 0.6) return "C";
  return "F";
}
