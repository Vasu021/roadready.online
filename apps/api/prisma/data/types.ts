// Shared shapes for the seed content modules.

export interface SeedOption {
  text: string;
  isCorrect: boolean;
}

export interface SeedQuestion {
  questionText: string;
  explanation: string;
  /**
   * Official weighting: 2 to 5 error points when answered wrong. Use 5 only for
   * questions where a wrong answer would endanger someone.
   */
  errorPoints?: 2 | 3 | 4 | 5;
  options: SeedOption[];
}

export interface SeedTopic {
  slug: string;
  /** German topic name shown as the primary label. */
  name: string;
  /** English topic name shown as the secondary label. */
  nameEN: string;
  description: string;
  order: number;
  /** Sign-recognition topics feed the sign block of the final theory test. */
  isSignTopic: boolean;
  questions: SeedQuestion[];
}

export interface SeedScenario {
  slug: string;
  name: string;
  description: string;
  order: number;
  /** Describes the driving situation; rendered as an illustrated placeholder. */
  imagePrompt: string;
  questionText: string;
  explanation: string;
  options: SeedOption[];
}

export interface SeedCountry {
  code: string;
  name: string;
  flagEmoji: string;
  isActive: boolean;
  facts: string;
}

// ── Learning modules ─────────────────────────────────────────────────────────

export interface SeedLesson {
  slug: string;
  title: string;
  /** Restricted markdown: paragraphs, "- " bullets, **bold**. */
  body: string;
  keyPoints: string[];
  /** Sign ids rendered as a strip under the body. */
  signIds?: string[];
  /** Scene rendered beside the text; typed as SceneSpec in the shared package. */
  scene?: unknown;
}

export interface SeedModule {
  slug: string;
  order: number;
  /** Official German lesson title from the FahrschAusbO. */
  officialTitle: string;
  title: string;
  summary: string;
  intro: string;
  estimatedMinutes: number;
  /** True for lessons 13 and 14, the class-B Zusatzstoff. */
  isZusatzstoff?: boolean;
  lessons: SeedLesson[];
  questions: SeedQuestion[];
}
