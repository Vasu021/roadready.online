import type {
  QuestionAnswerKey,
  QuizQuestion,
  ScenarioQuestionRow,
  TopicAttemptSummary,
  TopicTestSummary,
  ProgressStatus,
} from "@roadready/shared";

const BASE =
  (import.meta.env.VITE_API_URL as string | undefined) ??
  "http://localhost:3001";

const TOKEN_KEY = "rr_token";

export function getStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setStoredToken(token: string): void {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // Private browsing or blocked storage — the session simply won't persist.
  }
}

export function clearStoredToken(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // Nothing to clean up if storage is unavailable.
  }
}

let onUnauthorized: (() => void) | null = null;

/**
 * Registered once by App: called when the API rejects our token, so the UI can
 * drop back to a signed-out state instead of showing errors on every panel.
 */
export function setUnauthorizedHandler(handler: (() => void) | null): void {
  onUnauthorized = handler;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, { ...init, headers });

  if (!res.ok) {
    let errorMsg = `API ${res.status}: ${res.statusText}`;
    try {
      const data = (await res.json()) as { error?: string };
      if (data && typeof data.error === "string") errorMsg = data.error;
    } catch {
      // Non-JSON error response — keep the status text.
    }
    // An expired or rejected token should not leave a stale session behind.
    if (res.status === 401) {
      clearStoredToken();
      onUnauthorized?.();
    }
    throw new Error(errorMsg);
  }

  return res.json() as Promise<T>;
}

// ── Payloads ─────────────────────────────────────────────────────────────────

export interface AuthPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: { id: string; email: string };
}

export interface CountryRow {
  id: string;
  code: string;
  name: string;
  flagEmoji: string;
  isActive: boolean;
  scenarioCount: number;
  categories: {
    id: string;
    name: string;
    order: number;
    scenarioCount: number;
  }[];
}

export interface ScenarioProgressRow {
  scenarioId: string;
  status: ProgressStatus;
}

export interface TopicQuestionsResponse {
  topic: {
    id: string;
    slug: string;
    name: string;
    nameEN: string;
    description: string;
  };
  questions: QuizQuestion[];
}

export interface FinalTestResponse {
  country: { id: string; code: string; name: string; flagEmoji: string };
  total: number;
  timeLimitSeconds: number;
  passPercent: number;
  questions: QuizQuestion[];
}

export interface TestSessionRow {
  id: string;
  startedAt: string;
  maxScore: number;
  countryId: string;
}

export interface TestSessionResult {
  id: string;
  totalScore: number;
  maxScore: number;
  passed: boolean | null;
  grade: string | null;
  completedAt: string | null;
}

export interface TestSessionBreakdownRow {
  questionId: string;
  questionText: string;
  explanation: string;
  isCorrect: boolean;
  selectedOptionId: string;
  selectedOptionText: string;
  correctOptionText: string;
  options: { id: string; optionText: string; isCorrect: boolean }[];
}

export interface TestSessionDetail extends TestSessionResult {
  country: { code: string; name: string; flagEmoji: string };
  answeredCount: number;
  breakdown: TestSessionBreakdownRow[];
}

export interface TopicAttemptPayload {
  topicSlug: string;
  countryCode: string;
  score: number;
  totalQuestions: number;
  passed: boolean;
  timeSeconds?: number;
}

export interface AttemptRow {
  id: string;
  score: number;
  totalQuestions: number | null;
  passed: boolean;
  completedAt: string;
}

// ── Client ───────────────────────────────────────────────────────────────────

export const api = {
  auth: {
    register: (payload: AuthPayload) =>
      request<AuthResponse>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    login: (payload: AuthPayload) =>
      request<AuthResponse>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
  },

  countries: {
    list: () => request<CountryRow[]>("/api/countries"),
    facts: (code: string) =>
      request<{ facts: string | null }>(
        `/api/countries/${encodeURIComponent(code)}/facts`,
      ),
  },

  topicTests: {
    list: (countryCode: string) =>
      request<TopicTestSummary[]>(
        `/api/topic-tests/${encodeURIComponent(countryCode)}`,
      ),
    questions: (countryCode: string, slug: string) =>
      request<TopicQuestionsResponse>(
        `/api/topic-tests/${encodeURIComponent(countryCode)}/${encodeURIComponent(slug)}/questions`,
      ),
    answers: (countryCode: string, slug: string) =>
      request<QuestionAnswerKey[]>(
        `/api/topic-tests/${encodeURIComponent(countryCode)}/${encodeURIComponent(slug)}/questions/answers`,
      ),
    attempts: (countryCode: string) =>
      request<TopicAttemptSummary[]>(
        `/api/topic-tests/${encodeURIComponent(countryCode)}/attempts`,
      ),
    saveAttempt: (payload: TopicAttemptPayload) =>
      request<AttemptRow>("/api/topic-tests/attempts", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
  },

  scenarios: {
    list: (countryCode: string) =>
      request<ScenarioQuestionRow[]>(
        `/api/scenarios/${encodeURIComponent(countryCode)}`,
      ),
    answer: (countryCode: string, scenarioId: string) =>
      request<QuestionAnswerKey>(
        `/api/scenarios/${encodeURIComponent(countryCode)}/${encodeURIComponent(scenarioId)}/answer`,
      ),
    progress: (userId: string, countryCode: string) =>
      request<ScenarioProgressRow[]>(
        `/api/scenarios/progress/${encodeURIComponent(userId)}/${encodeURIComponent(countryCode)}`,
      ),
  },

  finalTest: {
    questions: (countryCode: string) =>
      request<FinalTestResponse>(
        `/api/final-test/${encodeURIComponent(countryCode)}/questions`,
      ),
  },

  testSessions: {
    start: (countryCode: string, maxScore: number) =>
      request<TestSessionRow>("/api/test-sessions", {
        method: "POST",
        body: JSON.stringify({ countryCode, maxScore }),
      }),
    answer: (sessionId: string, questionId: string, selectedOptionId: string) =>
      request<{ id: string; recorded: boolean }>(
        `/api/test-sessions/${encodeURIComponent(sessionId)}/answers`,
        {
          method: "POST",
          body: JSON.stringify({ questionId, selectedOptionId }),
        },
      ),
    complete: (sessionId: string) =>
      request<TestSessionResult>(
        `/api/test-sessions/${encodeURIComponent(sessionId)}/complete`,
        { method: "PATCH" },
      ),
    get: (sessionId: string) =>
      request<TestSessionDetail>(
        `/api/test-sessions/${encodeURIComponent(sessionId)}`,
      ),
  },

  userCountryAccess: {
    record: (countryCode: string) =>
      request<{ alreadyExisted: boolean }>("/api/user-country-access", {
        method: "POST",
        body: JSON.stringify({ countryCode }),
      }),
  },
};
