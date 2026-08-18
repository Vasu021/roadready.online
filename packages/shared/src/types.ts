/**
 * The RoadReady API contract.
 *
 * Every shape the Express API returns and every payload it accepts lives here,
 * so `apps/web` and `apps/api` cannot drift apart silently.
 */

// ── Enums (mirror prisma/schema.prisma) ─────────────────────────────────────

export type Role = "USER" | "ADMIN";
export type Difficulty = "EASY" | "MEDIUM" | "HARD";
export type QuizMode = "PRACTICE" | "EXAM";
export type QuizSource = "TOPIC" | "EXAM" | "MISTAKES" | "BOOKMARKS";
export type QuizStatus = "IN_PROGRESS" | "COMPLETED" | "ABANDONED";
export type ProgressStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
export type Grade = "A" | "B" | "C" | "D" | "F";

// ── Auth ────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  role: Role;
  isPremium: boolean;
  selectedCountryCode: string | null;
}

export interface AuthCredentials {
  email: string;
  password: string;
  name?: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export interface UpdateProfilePayload {
  name?: string;
  countryCode?: string | null;
}

// ── Countries, categories, topics ───────────────────────────────────────────

export interface CountrySummary {
  id: string;
  code: string;
  name: string;
  flagEmoji: string;
  order: number;
  topicCount: number;
  questionCount: number;
  examQuestionCount: number;
  examPassPercent: number;
}

export interface CountryDetail extends CountrySummary {
  facts: string | null;
}

export interface TopicSummary {
  id: string;
  slug: string;
  name: string;
  description: string;
  iconEmoji: string;
  order: number;
  isPremium: boolean;
  questionCount: number;
  /** Present only when the request is authenticated. */
  progress: TopicProgressSummary | null;
}

export interface TopicProgressSummary {
  status: ProgressStatus;
  bestScorePercent: number;
  attemptCount: number;
  passCount: number;
  lastAttemptAt: string | null;
}

export interface CategoryWithTopics {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  order: number;
  topics: TopicSummary[];
}

export interface CountryTopicsResponse {
  country: CountryDetail;
  categories: CategoryWithTopics[];
}

// ── Questions ───────────────────────────────────────────────────────────────

/** An option as served to the client — `isCorrect` is deliberately absent. */
export interface QuestionOption {
  id: string;
  label: string;
  text: string;
  order: number;
}

export interface QuizQuestion {
  id: string;
  order: number;
  prompt: string;
  imageUrl: string | null;
  imageAlt: string | null;
  difficulty: Difficulty;
  topic: { slug: string; name: string; iconEmoji: string };
  options: QuestionOption[];
  isBookmarked: boolean;
  /** Set once this question has been answered in the current quiz. */
  selectedOptionId: string | null;
  isCorrect: boolean | null;
  /** Revealed after answering in PRACTICE mode, or after the quiz completes. */
  correctOptionId: string | null;
  explanation: string | null;
}

// ── Quizzes ─────────────────────────────────────────────────────────────────

export interface CreateQuizPayload {
  countryCode: string;
  mode: QuizMode;
  source: QuizSource;
  /** Required when source is "TOPIC". */
  topicSlug?: string;
  /** Caps the question count; ignored when it exceeds what is available. */
  limit?: number;
}

export interface QuizSummary {
  id: string;
  mode: QuizMode;
  source: QuizSource;
  status: QuizStatus;
  countryCode: string;
  countryName: string;
  countryFlag: string;
  topicSlug: string | null;
  topicName: string | null;
  totalQuestions: number;
  answeredCount: number;
  correctCount: number;
  scorePercent: number;
  passed: boolean | null;
  grade: Grade | null;
  passPercent: number;
  startedAt: string;
  completedAt: string | null;
}

export interface QuizDetail extends QuizSummary {
  questions: QuizQuestion[];
}

export interface AnswerQuestionPayload {
  questionId: string;
  optionId: string;
}

export interface AnswerQuestionResponse {
  recorded: true;
  answeredCount: number;
  /** Null in EXAM mode — feedback is withheld until the quiz completes. */
  isCorrect: boolean | null;
  correctOptionId: string | null;
  explanation: string | null;
}

export interface QuizResult extends QuizSummary {
  questions: QuizQuestion[];
  wrongQuestionIds: string[];
}

// ── Progress & dashboard ────────────────────────────────────────────────────

export interface TopicMastery {
  topicSlug: string;
  topicName: string;
  iconEmoji: string;
  categoryName: string | null;
  questionCount: number;
  status: ProgressStatus;
  bestScorePercent: number;
  attemptCount: number;
}

export interface ProgressOverview {
  country: CountrySummary | null;
  totals: {
    quizzesCompleted: number;
    questionsAnswered: number;
    questionsCorrect: number;
    accuracyPercent: number;
    topicsCompleted: number;
    topicsTotal: number;
    bookmarkCount: number;
    mistakeCount: number;
  };
  topics: TopicMastery[];
  recentQuizzes: QuizSummary[];
}

// ── Bookmarks ───────────────────────────────────────────────────────────────

export interface BookmarkToggleResponse {
  questionId: string;
  isBookmarked: boolean;
}

export interface ApiError {
  error: string;
}
