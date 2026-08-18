import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { CreateQuizPayload, QuizResult } from "@roadready/shared";
import { api, errorMessage } from "../utils/api";
import {
  ErrorBanner,
  LoadingPanel,
  PageShell,
  Spinner,
} from "../components/layout";
import { QuestionReviewRow, ScoreRing, StatTile } from "../components/results";
import { t } from "../i18n";

export default function Results() {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();

  const [result, setResult] = useState<QuizResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [starting, setStarting] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "wrong">("all");

  useEffect(() => {
    if (!quizId) return;
    // `complete` is idempotent on the server, so it doubles as the fetch — a
    // user landing here from a shared link or a refresh gets the same result.
    api.quizzes
      .complete(quizId)
      .then(setResult)
      .catch((err) => setError(errorMessage(err)));
  }, [quizId]);

  async function start(payload: CreateQuizPayload, key: string) {
    setStarting(key);
    setError(null);
    try {
      const quiz = await api.quizzes.create(payload);
      navigate(`/quiz/${quiz.id}`);
    } catch (err) {
      setError(errorMessage(err));
      setStarting(null);
    }
  }

  if (error && !result) {
    return (
      <PageShell>
        <ErrorBanner message={error} />
        <Link
          to="/"
          className="mt-4 block text-center text-sm text-blue-400 hover:underline"
        >
          {t("Back to topics")}
        </Link>
      </PageShell>
    );
  }

  if (!result) {
    return (
      <PageShell>
        <LoadingPanel label={t("Marking your answers…")} />
      </PageShell>
    );
  }

  const wrongCount = result.wrongQuestionIds.length;
  const minutes = result.completedAt
    ? Math.max(
        1,
        Math.round(
          (new Date(result.completedAt).getTime() -
            new Date(result.startedAt).getTime()) /
            60000,
        ),
      )
    : null;

  const shown =
    filter === "wrong"
      ? result.questions.filter((q) => q.isCorrect !== true)
      : result.questions;

  return (
    <PageShell>
      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 px-6 py-7 sm:px-8">
        <div className="flex flex-col items-center gap-7 sm:flex-row sm:items-center">
          <ScoreRing
            percent={result.scorePercent}
            passed={result.passed}
            grade={result.grade}
          />
          <div className="min-w-0 flex-1 text-center sm:text-left">
            <h1 className="text-2xl font-bold">
              {result.passed ? t("You passed") : t("Not passed yet")}
            </h1>
            <p className="mt-1.5 text-sm text-slate-400">
              {result.topicName
                ? t("{topic} · {mode}", {
                    topic: result.topicName,
                    mode: result.mode === "EXAM" ? t("Exam") : t("Practice"),
                  })
                : t("{country} mock exam", { country: result.countryName })}
              {" · "}
              {t("pass mark {n}%", { n: result.passPercent })}
            </p>

            <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              <StatTile
                label={t("Correct")}
                value={`${result.correctCount}/${result.totalQuestions}`}
              />
              <StatTile label={t("Wrong")} value={wrongCount} />
              {minutes !== null && (
                <StatTile label={t("Minutes")} value={minutes} />
              )}
            </div>
          </div>
        </div>

        <div className="mt-7 flex flex-wrap gap-2.5">
          {result.topicSlug && (
            <button
              onClick={() =>
                start(
                  {
                    countryCode: result.countryCode,
                    mode: result.mode,
                    source: "TOPIC",
                    topicSlug: result.topicSlug!,
                  },
                  "retry",
                )
              }
              disabled={starting !== null}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold transition hover:bg-blue-500 disabled:opacity-60"
            >
              {starting === "retry" && <Spinner size="sm" />}
              {t("Try this topic again")}
            </button>
          )}
          {wrongCount > 0 && (
            <button
              onClick={() =>
                start(
                  {
                    countryCode: result.countryCode,
                    mode: "PRACTICE",
                    source: "MISTAKES",
                  },
                  "mistakes",
                )
              }
              disabled={starting !== null}
              className="flex items-center gap-2 rounded-xl border border-slate-700 px-5 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-slate-800 disabled:opacity-60"
            >
              {starting === "mistakes" && <Spinner size="sm" />}
              {t("Drill my mistakes")}
            </button>
          )}
          <Link
            to="/"
            className="rounded-xl border border-slate-700 px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800"
          >
            {t("Back to topics")}
          </Link>
        </div>

        {error && (
          <div className="mt-4">
            <ErrorBanner message={error} />
          </div>
        )}
      </section>

      <section className="mt-10">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-500">
            {t("Review")}
          </h2>
          <div className="flex gap-1 rounded-lg border border-slate-800 bg-slate-900/60 p-1">
            {(
              [
                ["all", t("All ({n})", { n: result.questions.length })],
                ["wrong", t("Wrong ({n})", { n: wrongCount })],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                onClick={() => setFilter(value)}
                className={`rounded-md px-3 py-1 text-xs font-medium transition ${
                  filter === value
                    ? "bg-slate-700 text-white"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {shown.length === 0 ? (
          <p className="rounded-xl border border-emerald-900/60 bg-emerald-950/25 px-5 py-6 text-center text-sm text-emerald-300">
            {t("Nothing wrong to review — every answer was correct.")}
          </p>
        ) : (
          <ul className="space-y-2.5">
            {shown.map((question) => (
              <QuestionReviewRow
                key={question.id}
                question={question}
                index={result.questions.indexOf(question)}
              />
            ))}
          </ul>
        )}
      </section>
    </PageShell>
  );
}
