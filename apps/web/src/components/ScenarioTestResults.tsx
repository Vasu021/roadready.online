import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useGameStore } from "../store/gameStore";
import { useUserStore } from "../store/userStore";
import { api } from "../utils/api";

// i18n placeholder (Step 8 swaps in utils/i18n.ts)
const t = (s: string): string => s;

const PASS_THRESHOLD = 0.6; // ≥ 60% correct passes the per-scenario test

/**
 * Per-scenario TEST results: shown instead of ResultsScreen when attemptMode is
 * 'test'. Scores the MCQs answered across the scenario's decision points, shows
 * a per-question recap, and saves the attempt once via POST /api/progress.
 */
export default function ScenarioTestResults() {
  const phase = useGameStore((s) => s.scenarioPhase);
  const scenario = useGameStore((s) => s.activeScenario);
  const elapsed = useGameStore((s) => s.elapsedSeconds);
  const answers = useGameStore((s) => s.mcqAnswers);
  const asked = useGameStore((s) => s.mcqAsked);
  const correct = useGameStore((s) => s.mcqCorrect);
  const resetScenario = useGameStore((s) => s.resetScenario);
  const user = useUserStore((s) => s.user);
  const navigate = useNavigate();

  const ended = phase === "passed" || phase === "failed";
  const scorePct = asked > 0 ? Math.round((correct / asked) * 100) : 0;
  const passed = asked > 0 && correct / asked >= PASS_THRESHOLD;

  // Save the attempt once when the run ends, if the user is signed in
  const hasSaved = useRef(false);
  useEffect(() => {
    if (phase === "running") hasSaved.current = false;
  }, [phase]);

  useEffect(() => {
    if (!ended || !user || !scenario || hasSaved.current) return;
    hasSaved.current = true;
    api.progress
      .save({
        scenarioId: scenario.id,
        passed,
        score: scorePct,
        timeSeconds: Math.floor(elapsed),
      })
      .catch(console.error);
  }, [ended, user, scenario, passed, scorePct, elapsed]);

  if (!ended) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-lg flex-col rounded-2xl border border-gray-800 bg-gray-950 shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-gray-800 p-6">
          <span
            className={[
              "flex h-11 w-11 items-center justify-center rounded-full text-xl",
              passed
                ? "bg-emerald-500/20 text-emerald-400"
                : "bg-red-500/20 text-red-400",
            ].join(" ")}
          >
            {passed ? "✓" : "✕"}
          </span>
          <div>
            <p className="text-lg font-bold text-white">
              {passed ? t("Test Passed") : t("Keep Practising")}
            </p>
            <p className="text-sm text-gray-400">{scenario?.name}</p>
          </div>
          <div className="ml-auto text-right">
            <p className="font-mono text-2xl font-bold text-white">
              {correct}/{asked}
            </p>
            <p className="text-xs text-gray-500">
              {scorePct}% {t("correct")}
            </p>
          </div>
        </div>

        {/* Per-question recap */}
        <div className="flex-1 space-y-3 overflow-y-auto p-6">
          {answers.length === 0 ? (
            <p className="text-center text-sm text-gray-500">
              {t("No questions were answered.")}
            </p>
          ) : (
            answers.map((a, i) => (
              <div
                key={`${a.questionId}-${i}`}
                className="rounded-xl border border-gray-800 bg-gray-900/60 p-4"
              >
                <div className="mb-2 flex items-start gap-2">
                  <span
                    className={
                      a.isCorrect ? "text-emerald-400" : "text-red-400"
                    }
                  >
                    {a.isCorrect ? "✓" : "✕"}
                  </span>
                  <p className="text-sm font-medium text-gray-100">
                    {a.questionText}
                  </p>
                </div>
                <p className="text-xs text-gray-400">
                  {t("Your answer:")}{" "}
                  <span
                    className={
                      a.isCorrect ? "text-emerald-300" : "text-red-300"
                    }
                  >
                    {a.selectedOptionText}
                  </span>
                </p>
                {!a.isCorrect && a.correctOptionText && (
                  <p className="text-xs text-gray-400">
                    {t("Correct answer:")}{" "}
                    <span className="text-emerald-300">
                      {a.correctOptionText}
                    </span>
                  </p>
                )}
                {a.explanation && (
                  <p className="mt-1.5 text-xs leading-relaxed text-gray-500">
                    {a.explanation}
                  </p>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer actions */}
        <div className="border-t border-gray-800 p-6">
          {!user && (
            <p className="mb-3 text-center text-xs text-gray-500">
              {t("Sign in to save your results across sessions.")}
            </p>
          )}
          <div className="flex gap-3">
            <button
              onClick={resetScenario}
              className="flex-1 rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500"
            >
              {t("Retry")}
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
    </div>
  );
}
