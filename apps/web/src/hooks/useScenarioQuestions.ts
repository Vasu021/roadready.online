import { useEffect, useRef, useState } from "react";
import { api } from "../utils/api";
import type { McqQuestion } from "../store/gameStore";

interface UseScenarioQuestionsResult {
  questions: McqQuestion[];
  loading: boolean;
  error: string | null;
}

/**
 * Fetches a scenario's MCQ bank (with the answer key) once per slug and caches
 * it for the session. Backed by the auth-guarded answers endpoint so practice
 * teaching and per-scenario test scoring can run client-side. Step 3 consumes
 * `questions` to build the MCQ queue for a decision point.
 */
export function useScenarioQuestions(
  slug: string | undefined,
): UseScenarioQuestionsResult {
  const [questions, setQuestions] = useState<McqQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cache = useRef<Record<string, McqQuestion[]>>({});

  useEffect(() => {
    if (!slug) {
      setQuestions([]);
      setError(null);
      setLoading(false);
      return;
    }

    const cached = cache.current[slug];
    if (cached) {
      setQuestions(cached);
      setError(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    api.scenarios
      .getQuestionsWithAnswers(slug)
      .then((rows) => {
        if (cancelled) return;
        const mapped: McqQuestion[] = rows.map((q) => ({
          id: q.id,
          questionText: q.questionText,
          order: q.order,
          explanation: q.explanation,
          correctOptionId: q.correctOptionId ?? undefined,
          options: q.options.map((o) => ({ id: o.id, text: o.optionText })),
        }));
        cache.current[slug] = mapped;
        setQuestions(mapped);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(
          err instanceof Error ? err.message : "Failed to load questions",
        );
        setQuestions([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  return { questions, loading, error };
}
