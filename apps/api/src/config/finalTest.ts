/** Shape of the full theory test. Change here, not in the routes. */
export const FINAL_TEST = {
  /** Total questions served per test. */
  questionCount: 30,
  timeLimitMinutes: 45,
  /** Fraction of correct answers needed to pass (grade B or better). */
  passRatio: 0.75,
  /** How the 30 questions are composed. Must sum to questionCount. */
  mix: {
    topic: 15,
    scenario: 10,
    sign: 5,
  },
} as const;

export function computeGrade(ratio: number): "A" | "B" | "C" | "F" {
  if (ratio >= 0.9) return "A";
  if (ratio >= 0.75) return "B";
  if (ratio >= 0.6) return "C";
  return "F";
}
