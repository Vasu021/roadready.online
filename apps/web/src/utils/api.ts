import type { ScenarioConfig } from "@roadready/shared";
import type { ProgressStatus } from "../store/userStore";

const BASE =
  (import.meta.env.VITE_API_URL as string | undefined) ??
  "http://localhost:3001";

const TOKEN_KEY = "rr_token";

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredToken(): void {
  localStorage.removeItem(TOKEN_KEY);
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
      if (data && typeof data.error === "string") {
        errorMsg = data.error;
      }
    } catch {
      // ignore JSON parsing errors for non-JSON responses
    }
    throw new Error(errorMsg);
  }
  return res.json() as Promise<T>;
}

export interface AuthPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: { id: string; email: string };
  error: string;
}

export interface AttemptRow {
  id: string;
  userId: string;
  scenarioId: string;
  passed: boolean;
  score: number;
  timeSeconds: number;
  completedAt: string;
}

export interface SaveAttemptPayload {
  scenarioId: string;
  passed: boolean;
  score?: number;
  timeSeconds?: number;
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

export interface ScenarioRow {
  id: string;
  slug: string;
  name: string;
  description: string;
  order: number;
  isActive: boolean;
  isPremium: boolean;
  type: "PRACTICE" | "TEST";
  videoUrl: string | null;
  questionCount: number;
}

export interface CountryScenariosResponse {
  country: { id: string; code: string; name: string; flagEmoji: string };
  categories: {
    id: string;
    name: string;
    order: number;
    scenarios: ScenarioRow[];
  }[];
}

export interface ScenarioProgressRow {
  scenarioId: string;
  status: ProgressStatus;
}

export interface QuestionOption {
  id: string;
  optionText: string;
  order: number;
}

/** From GET /api/scenarios/:slug/questions — `isCorrect` hidden (graded test). */
export interface ScenarioQuestion {
  id: string;
  questionText: string;
  order: number;
  options: QuestionOption[];
}

/** From GET /api/scenarios/:slug/questions/answers — includes the answer key. */
export interface ScenarioQuestionWithAnswer extends ScenarioQuestion {
  explanation: string;
  correctOptionId: string | null;
}

// ── Full Test (graded TestSession, server-scored) ─────────────────────────────

export interface TestSession {
  id: string;
  userId: string;
  countryId: string;
  startedAt: string;
  completedAt: string | null;
  totalScore: number;
  maxScore: number;
  passed: boolean | null;
  grade: string | null;
}

/** POST /api/test-sessions/:id/answers result. */
export interface TestAnswerResult {
  id: string;
  isCorrect: boolean;
  explanation: string;
}

/** GET /api/test-sessions/:id — full session with per-answer breakdown. */
export interface TestSessionDetail extends TestSession {
  country: { code: string; name: string; flagEmoji: string };
  answers: {
    id: string;
    isCorrect: boolean;
    question: { questionText: string; explanation: string; order: number };
    selectedOption: { optionText: string; isCorrect: boolean };
  }[];
}

/** GET /api/countries/:code/test-questions — sampled, `isCorrect` hidden. */
export interface FullTestQuestionsResponse {
  countryId: string;
  questions: {
    id: string;
    questionText: string;
    options: { id: string; optionText: string }[];
  }[];
}

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
      request<{ facts: string | null }>(`/api/countries/${code}/facts`),
    scenarios: (code: string) =>
      request<CountryScenariosResponse>(`/api/countries/${code}/scenarios`),
  },
  // Graded Full Test: sampled cross-scenario questions + a server-scored session.
  fullTest: {
    getQuestions: (code: string, limit?: number) =>
      request<FullTestQuestionsResponse>(
        `/api/countries/${code}/test-questions${limit ? `?limit=${limit}` : ""}`,
      ),
  },
  testSessions: {
    create: (payload: { countryId: string; maxScore?: number }) =>
      request<TestSession>("/api/test-sessions", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    answer: (
      id: string,
      payload: { questionId: string; selectedOptionId: string },
    ) =>
      request<TestAnswerResult>(`/api/test-sessions/${id}/answers`, {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    complete: (id: string) =>
      request<TestSession>(`/api/test-sessions/${id}/complete`, {
        method: "PATCH",
      }),
    get: (id: string) => request<TestSessionDetail>(`/api/test-sessions/${id}`),
  },
  scenarios: {
    list: () => request<ScenarioConfig[]>("/api/scenarios"),
    progress: (userId: string, countryCode: string) =>
      request<ScenarioProgressRow[]>(
        `/api/scenarios/progress/${userId}/${countryCode}`,
      ),
    // Options shuffled, `isCorrect` hidden — for the graded Full Test.
    getQuestions: (slug: string) =>
      request<ScenarioQuestion[]>(`/api/scenarios/${slug}/questions`),
    // Includes correctOptionId + explanation — for per-scenario practice/test.
    getQuestionsWithAnswers: (slug: string) =>
      request<ScenarioQuestionWithAnswer[]>(
        `/api/scenarios/${slug}/questions/answers`,
      ),
  },
  userCountryAccess: {
    record: (countryCode: string) =>
      request<{ alreadyExisted: boolean }>("/api/user-country-access", {
        method: "POST",
        body: JSON.stringify({ countryCode }),
      }),
  },
  progress: {
    save: (payload: SaveAttemptPayload) =>
      request<AttemptRow>("/api/progress", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    getByUser: (userId: string) =>
      request<AttemptRow[]>(`/api/progress/${userId}`),
  },
};
