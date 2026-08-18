import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { ProgressOverview } from "@roadready/shared";
import { api, errorMessage } from "../utils/api";
import { useUserStore } from "../store/userStore";
import {
  EmptyState,
  ErrorBanner,
  LoadingPanel,
  PageShell,
} from "../components/layout";
import { t, tn } from "../i18n";

export default function Dashboard() {
  const selectedCountry = useUserStore((s) => s.selectedCountry);

  const [data, setData] = useState<ProgressOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    api.progress
      .overview(selectedCountry?.code)
      .then(setData)
      .catch((err) => setError(errorMessage(err)))
      .finally(() => setLoading(false));
  }, [selectedCountry?.code]);

  useEffect(load, [load]);

  return (
    <PageShell width="wide">
      <h1 className="mb-1 text-2xl font-bold">{t("Your progress")}</h1>
      <p className="mb-8 text-sm text-slate-400">
        {data?.country
          ? `${data.country.flagEmoji} ${data.country.name}`
          : t("Pick a country to start tracking topics.")}
      </p>

      {error && <ErrorBanner message={error} onRetry={load} />}

      {loading ? (
        <LoadingPanel />
      ) : data ? (
        <div className="space-y-10">
          <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Metric
              label={t("Quizzes completed")}
              value={data.totals.quizzesCompleted}
            />
            <Metric
              label={t("Questions answered")}
              value={data.totals.questionsAnswered}
            />
            <Metric
              label={t("Accuracy")}
              value={`${data.totals.accuracyPercent}%`}
              tone={
                data.totals.questionsAnswered === 0
                  ? "neutral"
                  : data.totals.accuracyPercent >= 75
                    ? "good"
                    : "warn"
              }
            />
            <Metric
              label={t("Topics completed")}
              value={`${data.totals.topicsCompleted}/${data.totals.topicsTotal}`}
            />
          </section>

          <section>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-slate-500">
              {t("Topic mastery")}
            </h2>
            {data.topics.length === 0 ? (
              <EmptyState
                icon="🗺️"
                title={t("No country selected")}
                description={t(
                  "Choose a country on the home page and your topics will appear here.",
                )}
                action={
                  <Link
                    to="/"
                    className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold transition hover:bg-blue-500"
                  >
                    {t("Choose a country")}
                  </Link>
                }
              />
            ) : (
              <ul className="space-y-2">
                {data.topics.map((topic) => (
                  <li
                    key={topic.topicSlug}
                    className="flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-900/40 px-5 py-3.5"
                  >
                    <span className="text-xl" aria-hidden="true">
                      {topic.iconEmoji}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline gap-2">
                        <span className="text-sm font-medium text-white">
                          {topic.topicName}
                        </span>
                        <span className="text-xs text-slate-500">
                          {topic.categoryName}
                        </span>
                      </div>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-800">
                        <div
                          className={`h-full rounded-full transition-[width] duration-500 ${
                            topic.status === "COMPLETED"
                              ? "bg-emerald-500"
                              : "bg-blue-500"
                          }`}
                          style={{ width: `${topic.bestScorePercent}%` }}
                        />
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="text-sm font-semibold text-white">
                        {topic.attemptCount === 0
                          ? "—"
                          : `${topic.bestScorePercent}%`}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {topic.attemptCount === 0
                          ? t("not started")
                          : tn(
                              topic.attemptCount,
                              "{n} attempt",
                              "{n} attempts",
                            )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-slate-500">
              {t("Recent quizzes")}
            </h2>
            {data.recentQuizzes.length === 0 ? (
              <EmptyState
                icon="📝"
                title={t("Nothing here yet")}
                description={t(
                  "Finish a topic and your results will show up here.",
                )}
                action={
                  <Link
                    to="/"
                    className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold transition hover:bg-blue-500"
                  >
                    {t("Start a topic")}
                  </Link>
                }
              />
            ) : (
              <ul className="space-y-2">
                {data.recentQuizzes.map((quiz) => (
                  <li key={quiz.id}>
                    <Link
                      to={`/results/${quiz.id}`}
                      className="flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-900/40 px-5 py-3.5 transition hover:border-slate-600"
                    >
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                          quiz.passed
                            ? "bg-emerald-500/15 text-emerald-400"
                            : "bg-red-500/15 text-red-400"
                        }`}
                      >
                        {quiz.grade ?? "—"}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-white">
                          {quiz.topicName ??
                            t("{country} mock exam", {
                              country: quiz.countryName,
                            })}
                        </span>
                        <span className="text-xs text-slate-500">
                          {quiz.completedAt
                            ? new Date(quiz.completedAt).toLocaleDateString()
                            : ""}{" "}
                          · {quiz.correctCount}/{quiz.totalQuestions}
                        </span>
                      </span>
                      <span className="shrink-0 text-sm font-semibold text-slate-300">
                        {quiz.scorePercent}%
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      ) : null}
    </PageShell>
  );
}

function Metric({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string | number;
  tone?: "neutral" | "good" | "warn";
}) {
  const color = {
    neutral: "text-white",
    good: "text-emerald-400",
    warn: "text-amber-400",
  }[tone];

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/40 px-5 py-4">
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <div className="mt-1 text-xs text-slate-400">{label}</div>
    </div>
  );
}
