// ── Content ──────────────────────────────────────────────────────────────────

export type ScenarioType = "PRACTICE" | "TEST";

export interface TopicTestSummary {
  id: string;
  slug: string;
  /** German topic name (primary label). */
  name: string;
  /** English topic name (secondary label). */
  nameEN: string;
  description: string;
  order: number;
  questionCount: number;
}

export interface QuizOption {
  id: string;
  optionText: string;
  order: number;
}

/** A question as served to the client: the correct option is not included. */
export interface QuizQuestion {
  id: string;
  questionText: string;
  order: number;
  options: QuizOption[];
  /** Where the question came from — used to label mixed final-test questions. */
  source?: QuestionSource;
  /** Scenario situation text, present on scenario questions. */
  imagePrompt?: string | null;
  imageUrl?: string | null;
  /** Scene description for questions that come with an illustration. */
  sceneJson?: unknown;
  /** Official weighting, 2 to 5 error points. */
  errorPoints?: number;
  /** Human-readable topic or scenario name. */
  sourceName?: string;
}

export type QuestionSource = "topic" | "scenario" | "sign";

/** The answer key, fetched separately so scoring can happen client-side. */
export interface QuestionAnswerKey {
  questionId: string;
  correctOptionId: string;
  explanation: string;
}

export interface ScenarioQuestionRow {
  id: string;
  slug: string;
  name: string;
  description: string;
  order: number;
  imagePrompt: string | null;
  imageUrl: string | null;
  /** Composable scene description, rendered to SVG by the client. */
  sceneJson?: unknown;
  question: QuizQuestion | null;
}

// ── Quiz runtime ─────────────────────────────────────────────────────────────

export type QuizMode = "topic" | "scenario" | "final";

export interface QuizAnswer {
  questionId: string;
  selectedOptionId: string;
  isCorrect: boolean;
}

export type Grade = "A" | "B" | "C" | "F";

export interface QuizResult {
  score: number;
  total: number;
  percent: number;
  grade: Grade;
  passed: boolean;
}

// ── Learning modules ─────────────────────────────────────────────────────────

export interface ModuleSummary {
  id: string;
  slug: string;
  order: number;
  /** The official German lesson title from the FahrschAusbO. */
  officialTitle: string;
  title: string;
  summary: string;
  estimatedMinutes: number;
  isZusatzstoff: boolean;
  lessonCount: number;
  questionCount: number;
  /** Present when the user is signed in. */
  completedLessons?: number;
  completedAt?: string | null;
}

export interface LessonRow {
  id: string;
  slug: string;
  order: number;
  title: string;
  body: string;
  keyPoints: string[];
  sceneJson?: unknown;
  signIds?: string[];
}

export interface ModuleDetail extends ModuleSummary {
  intro: string;
  lessons: LessonRow[];
}

// ── Locales ──────────────────────────────────────────────────────────────────

/** The 13 languages the official German theory exam is offered in. */
export const LOCALES = [
  "en",
  "de",
  "tr",
  "ar",
  "ru",
  "ro",
  "pl",
  "fr",
  "it",
  "es",
  "pt",
  "hr",
  "el",
] as const;

export type Locale = (typeof LOCALES)[number];

// ── Progress ─────────────────────────────────────────────────────────────────

export type ProgressStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";

export interface TopicAttemptSummary {
  topicSlug: string;
  bestScore: number;
  lastScore: number;
  totalQuestions: number;
  attemptCount: number;
  passed: boolean;
  lastAttemptAt: string;
}

export interface UserProgress {
  userId: string;
  scenarioId: string;
  completedAt: string;
  score: number;
  passed: boolean;
}
