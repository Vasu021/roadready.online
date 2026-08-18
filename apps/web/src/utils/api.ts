import type {
  AnswerQuestionPayload,
  AnswerQuestionResponse,
  AuthCredentials,
  AuthResponse,
  AuthUser,
  BookmarkToggleResponse,
  CountryDetail,
  CountrySummary,
  CountryTopicsResponse,
  CreateQuizPayload,
  ProgressOverview,
  QuizDetail,
  QuizQuestion,
  QuizResult,
  QuizSummary,
  TopicSummary,
  UpdateProfilePayload,
} from "@roadready/shared";

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

/** Carries the HTTP status so callers can distinguish 401/403/404 from a 500. */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(
  path: string,
  init?: Omit<RequestInit, "body"> & { body?: unknown },
): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers,
    body: init?.body === undefined ? undefined : JSON.stringify(init.body),
  });

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const data = (await res.json()) as { error?: string };
      if (typeof data?.error === "string") message = data.error;
    } catch {
      // Non-JSON error response — keep the generic message.
    }
    throw new ApiError(res.status, message);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

const get = <T>(path: string) => request<T>(path);
const post = <T>(path: string, body?: unknown) =>
  request<T>(path, { method: "POST", body });
const patch = <T>(path: string, body?: unknown) =>
  request<T>(path, { method: "PATCH", body });

export const api = {
  auth: {
    register: (payload: AuthCredentials) =>
      post<AuthResponse>("/api/auth/register", payload),
    login: (payload: AuthCredentials) =>
      post<AuthResponse>("/api/auth/login", payload),
    me: () => get<AuthUser>("/api/auth/me"),
    updateProfile: (payload: UpdateProfilePayload) =>
      patch<AuthUser>("/api/auth/me", payload),
  },

  countries: {
    list: () => get<CountrySummary[]>("/api/countries"),
    detail: (code: string) => get<CountryDetail>(`/api/countries/${code}`),
    topics: (code: string) =>
      get<CountryTopicsResponse>(`/api/countries/${code}/topics`),
  },

  topics: {
    detail: (slug: string) => get<TopicSummary>(`/api/topics/${slug}`),
  },

  quizzes: {
    create: (payload: CreateQuizPayload) =>
      post<QuizDetail>("/api/quizzes", payload),
    history: () => get<QuizSummary[]>("/api/quizzes"),
    detail: (id: string) => get<QuizDetail>(`/api/quizzes/${id}`),
    answer: (id: string, payload: AnswerQuestionPayload) =>
      post<AnswerQuestionResponse>(`/api/quizzes/${id}/answer`, payload),
    complete: (id: string) => post<QuizResult>(`/api/quizzes/${id}/complete`),
  },

  questions: {
    bookmarks: () => get<QuizQuestion[]>("/api/questions/bookmarks"),
    toggleBookmark: (id: string) =>
      post<BookmarkToggleResponse>(`/api/questions/${id}/bookmark`),
  },

  progress: {
    overview: (countryCode?: string) =>
      get<ProgressOverview>(
        `/api/progress/overview${countryCode ? `?country=${countryCode}` : ""}`,
      ),
  },
};

/** Normalises anything thrown by a fetch call into a message safe to render. */
export function errorMessage(err: unknown): string {
  if (err instanceof ApiError) return err.message;
  if (err instanceof Error) return err.message;
  return "Something went wrong";
}
