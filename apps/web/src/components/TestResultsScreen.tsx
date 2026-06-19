import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGameStore } from "../store/gameStore";
import { api } from "../utils/api";
import type { TestSessionDetail } from "../utils/api";
import { t } from "../utils/i18n";

function gradeClasses(grade: string | null): string {
  switch (grade) {
    case "A":
    case "B":
      return "bg-emerald-500/20 text-emerald-300";
    case "C":
      return "bg-amber-500/20 text-amber-300";
    default:
      return "bg-red-500/20 text-red-300";
  }
}

/**
 * Graded Full Test results (PROMPT Step 8). Shown for the full-test scenario when
 * the run ends: completes the server-side TestSession once, then fetches the
 * breakdown (GET /api/test-sessions/:id) and renders the grade, score and a
 * per-question recap. Retake re-runs the test via `onRetake`.
 */
export default function TestResultsScreen({
  onRetake,
}: {
  onRetake: () => void;
}) {
  const phase = useGameStore((s) => s.scenarioPhase);
  const ftSessionId = useGameStore((s) => s.ftSessionId);
  const navigate = useNavigate();

  const [detail, setDetail] = useState<TestSessionDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const completedRef = useRef<string | null>(null);

  const ended = phase === "passed" || phase === "failed";

  // Re-arm whenever a fresh run starts (Retake).
  useEffect(() => {
    if (phase === "running") {
      completedRef.current = null;
      setDetail(null);
      setError(null);
    }
  }, [phase]);

  // On end: complete the session (idempotent — ignore "already completed"), then
  // fetch the full breakdown to display.
  useEffect(() => {
    if (!ended || !ftSessionId) return;
    if (completedRef.current === ftSessionId) return;
    completedRef.current = ftSessionId;

    let cancelled = false;
    setLoading(true);
    setError(null);
    (async () => {
      try {
        await api.testSessions.complete(ftSessionId).catch(() => {
          // Already completed (e.g. a re-render) — fall through to fetch it.
        });
        const d = await api.testSessions.get(ftSessionId);
        if (!cancelled) setDetail(d);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load results",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [ended, ftSessionId]);

  if (!ended) return null;

  const pct =
    detail && detail.maxScore > 0
      ? Math.round((detail.totalScore / detail.maxScore) * 100)
      : 0;
  const passed = detail?.passed ?? false;

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-lg flex-col rounded-2xl border border-gray-800 bg-gray-950 shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-gray-800 p-5 sm:p-6">
          <span
            className={[
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-2xl font-bold",
              gradeClasses(detail?.grade ?? null),
            ].join(" ")}
          >
            {detail?.grade ?? "–"}
          </span>
          <div className="min-w-0">
            <p className="text-lg font-bold text-white">
              {loading
                ? t("Scoring your test…")
                : passed
                  ? t("Test Passed 🎉")
                  : t("Test Not Passed")}
            </p>
            <p className="truncate text-sm text-gray-400">
              {detail?.country?.name
                ? t("Full Test — ") + detail.country.name
                : t("Full Test")}
            </p>
          </div>
          {detail && (
            <div className="ml-auto text-right">
              <p className="font-mono text-2xl font-bold text-white">
                {detail.totalScore}/{detail.maxScore}
              </p>
              <p className="text-xs text-gray-500">
                {pct}% · {t("pass ≥ 75%")}
              </p>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 space-y-3 overflow-y-auto p-5 sm:p-6">
          {error && <p className="text-sm text-red-400">{error}</p>}
          {loading && !detail && (
            <div className="flex justify-center py-8">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
            </div>
          )}
          {detail?.answers.map((a, i) => (
            <div
              key={a.id}
              className="rounded-xl border border-gray-800 bg-gray-900/60 p-4"
            >
              <div className="mb-2 flex items-start gap-2">
                <span
                  className={a.isCorrect ? "text-emerald-400" : "text-red-400"}
                >
                  {a.isCorrect ? "✓" : "✕"}
                </span>
                <p className="text-sm font-medium text-gray-100">
                  <span className="text-gray-500">{i + 1}. </span>
                  {a.question.questionText}
                </p>
              </div>
              <p className="text-xs text-gray-400">
                {t("Your answer:")}{" "}
                <span
                  className={a.isCorrect ? "text-emerald-300" : "text-red-300"}
                >
                  {a.selectedOption.optionText}
                </span>
              </p>
              {a.question.explanation && (
                <p className="mt-1.5 text-xs leading-relaxed text-gray-500">
                  {a.question.explanation}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Footer actions */}
        <div className="flex gap-3 border-t border-gray-800 p-5 sm:p-6">
          <button
            onClick={onRetake}
            className="flex-1 rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            {t("Retake Test")}
          </button>
          <button
            onClick={() => navigate("/")}
            className="flex-1 rounded-lg border border-gray-700 py-2.5 text-sm font-semibold text-gray-300 transition hover:bg-gray-800"
          >
            {t("Back to Scenarios")}
          </button>
        </div>
      </div>
    </div>
  );
}
