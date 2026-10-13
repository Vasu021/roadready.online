import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import type { TopicAttemptSummary, TopicTestSummary } from "@roadready/shared";
import { api } from "../utils/api";
import { useUserStore } from "../store/userStore";
import AppShell from "../components/AppShell";
import SpeakButton from "../components/SpeakButton";
import {
  Badge,
  Card,
  EmptyState,
  ErrorNote,
  ProgressBar,
  Spinner,
} from "../components/ui";
import { useT } from "../i18n";

/** Topic practice passes at the same mark as a module quiz. */
const PASS_RATIO = 0.75;

const percent = (score: number, total: number) =>
  total > 0 ? Math.round((score / total) * 100) : 0;

export default function PracticeTests() {
  const t = useT();
  const selectedCountry = useUserStore((s) => s.selectedCountry);
  const code = selectedCountry?.code ?? null;

  const [topics, setTopics] = useState<TopicTestSummary[] | null>(null);
  const [attempts, setAttempts] = useState<Map<string, TopicAttemptSummary>>(
    new Map(),
  );
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!code) return;
    let cancelled = false;
    setError(null);

    Promise.all([
      api.topicTests.list(code),
      api.topicTests.attempts(code).catch(() => [] as TopicAttemptSummary[]),
    ])
      .then(([topicRows, attemptRows]) => {
        if (cancelled) return;
        setTopics(topicRows);
        setAttempts(new Map(attemptRows.map((a) => [a.topicSlug, a])));
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setTopics([]);
        setError(err instanceof Error ? err.message : t("error.loadFailed"));
      });

    return () => {
      cancelled = true;
    };
  }, [code, reloadKey, t]);

  if (!selectedCountry) return <Navigate to="/" replace />;

  const attempted = topics
    ? topics.filter((topic) => attempts.has(topic.slug))
    : [];
  const passedCount = attempted.filter(
    (topic) => attempts.get(topic.slug)?.passed,
  ).length;

  // Average of each attempted topic's best run, which is the honest measure of
  // where a learner currently stands.
  const averageBest =
    attempted.length > 0
      ? Math.round(
          attempted.reduce((sum, topic) => {
            const a = attempts.get(topic.slug)!;
            return sum + percent(a.bestScore, a.totalQuestions);
          }, 0) / attempted.length,
        )
      : null;

  return (
    <AppShell>
      <header className="mb-6">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            {t("practice.heading")}
          </h1>
          <SpeakButton text={[t("practice.heading"), t("practice.intro")]} />
        </div>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          {t("practice.intro")}
        </p>
      </header>

      {error && (
        <div className="mb-6">
          <ErrorNote
            message={error}
            onRetry={() => setReloadKey((k) => k + 1)}
          />
        </div>
      )}

      {topics === null ? (
        <Spinner label={t("status.loading")} />
      ) : topics.length === 0 ? (
        <EmptyState
          icon="🧭"
          title={t("practice.noTopics", { country: selectedCountry.name })}
          body={t("dashboard.comingSoonBody")}
          action={
            <Link
              to="/dashboard"
              className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-ink transition hover:bg-accent/85"
            >
              {t("action.backToDashboard")}
            </Link>
          }
        />
      ) : (
        <>
          {/* Overall standing */}
          <Card className="mb-6 px-6 py-5">
            <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-faint">
                  {t("dashboard.progress")}
                </p>
                <p className="mt-1.5 text-2xl font-bold tabular-nums text-ink">
                  {passedCount}
                  <span className="text-base font-medium text-faint">
                    {" "}
                    / {topics.length} {t("dashboard.topicsPassed")}
                  </span>
                </p>
                <p className="mt-0.5 text-xs text-faint">
                  {t("practice.topicsAttempted", {
                    count: attempted.length,
                    total: topics.length,
                  })}
                </p>
              </div>

              <dl className="flex gap-6 text-right">
                {averageBest !== null && (
                  <div>
                    <dt className="text-[11px] uppercase tracking-wider text-faint">
                      {t("practice.averageBest")}
                    </dt>
                    <dd
                      className={`mt-0.5 text-xl font-bold tabular-nums ${
                        averageBest >= PASS_RATIO * 100
                          ? "text-correct"
                          : "text-ink"
                      }`}
                    >
                      {averageBest}%
                    </dd>
                  </div>
                )}
                <div>
                  <dt className="text-[11px] uppercase tracking-wider text-faint">
                    {t("practice.passMark")}
                  </dt>
                  <dd className="mt-0.5 text-xl font-bold tabular-nums text-muted">
                    {PASS_RATIO * 100}%
                  </dd>
                </div>
              </dl>
            </div>

            <ProgressBar
              value={passedCount}
              max={topics.length}
              tone={passedCount === topics.length ? "success" : "info"}
              className="mt-4"
            />
          </Card>

          <ul className="space-y-3">
            {topics.map((topic) => (
              <TopicRow
                key={topic.slug}
                topic={topic}
                attempt={attempts.get(topic.slug)}
              />
            ))}
          </ul>
        </>
      )}
    </AppShell>
  );
}

function TopicRow({
  topic,
  attempt,
}: {
  topic: TopicTestSummary;
  attempt: TopicAttemptSummary | undefined;
}) {
  const t = useT();

  const lastPercent = attempt
    ? percent(attempt.lastScore, attempt.totalQuestions)
    : 0;
  const bestPercent = attempt
    ? percent(attempt.bestScore, attempt.totalQuestions)
    : 0;
  // The badge reflects the best result ever; the bar reflects the latest run.
  const lastRunPassed = lastPercent >= PASS_RATIO * 100;

  return (
    <Card
      as="li"
      className="px-5 py-4 transition hover:border-line-strong hover:bg-raised"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs text-faint">
              {String(topic.order).padStart(2, "0")}
            </span>
            <h2 className="text-base font-semibold text-ink">{topic.nameEN}</h2>
            {!attempt ? (
              <Badge tone="neutral">{t("status.notStarted")}</Badge>
            ) : attempt.passed ? (
              <Badge tone="success">
                {t("status.passed")} · {bestPercent}%
              </Badge>
            ) : (
              <Badge tone="danger">
                {t("status.notPassed")} · {bestPercent}%
              </Badge>
            )}
          </div>
          <p className="mt-0.5 text-sm text-faint">{topic.name}</p>
          <p className="mt-1.5 text-sm leading-relaxed text-muted">
            {topic.description}
          </p>
        </div>

        <Link
          to={`/practice/${topic.slug}`}
          className={`shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition ${
            attempt
              ? "border border-line-strong text-ink hover:bg-raised"
              : "bg-accent text-accent-ink hover:bg-accent/85"
          }`}
        >
          {attempt ? `${t("action.retry")} →` : `${t("action.start")} →`}
        </Link>
      </div>

      {attempt ? (
        <div className="mt-4">
          {/* The latest run, so a learner sees where they actually stand now. */}
          <ProgressBar
            value={attempt.lastScore}
            max={attempt.totalQuestions}
            tone={lastRunPassed ? "success" : "danger"}
          />
          <dl className="mt-2.5 flex flex-wrap gap-x-6 gap-y-1 text-xs">
            <div className="flex gap-1.5">
              <dt className="text-faint">{t("practice.lastScore")}</dt>
              <dd
                className={`font-medium tabular-nums ${
                  lastRunPassed ? "text-correct" : "text-wrong"
                }`}
              >
                {attempt.lastScore}/{attempt.totalQuestions} · {lastPercent}%
              </dd>
            </div>
            <div className="flex gap-1.5">
              <dt className="text-faint">{t("practice.bestScore")}</dt>
              <dd className="font-medium tabular-nums text-muted">
                {attempt.bestScore}/{attempt.totalQuestions} · {bestPercent}%
              </dd>
            </div>
            <div className="flex gap-1.5">
              <dt className="text-faint">{t("practice.attemptsLabel")}</dt>
              <dd className="font-medium tabular-nums text-muted">
                {attempt.attemptCount}
              </dd>
            </div>
            <div className="flex gap-1.5">
              <dt className="text-faint">{t("practice.passMark")}</dt>
              <dd className="font-medium tabular-nums text-muted">
                {PASS_RATIO * 100}%
              </dd>
            </div>
          </dl>
        </div>
      ) : (
        <p className="mt-3 text-xs text-faint">
          {topic.questionCount} {t("learn.questions")} ·{" "}
          {t("practice.passMark")} {PASS_RATIO * 100}%
        </p>
      )}
    </Card>
  );
}
