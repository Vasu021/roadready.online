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

type Status = "not-started" | "in-progress" | "completed";

function statusOf(attempt: TopicAttemptSummary | undefined): Status {
  if (!attempt) return "not-started";
  return attempt.passed ? "completed" : "in-progress";
}

const STATUS_LABEL: Record<Status, string> = {
  "not-started": "Not started",
  "in-progress": "In progress",
  completed: "Completed",
};

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
        setError(
          err instanceof Error ? err.message : "Could not load the topics.",
        );
      });

    return () => {
      cancelled = true;
    };
  }, [code, reloadKey]);

  if (!selectedCountry) return <Navigate to="/" replace />;

  const passedCount = topics
    ? topics.filter((t) => attempts.get(t.slug)?.passed).length
    : 0;

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
        <Spinner label="Loading topics…" />
      ) : topics.length === 0 ? (
        <EmptyState
          icon="🧭"
          title={t("practice.noTopics", { country: selectedCountry.name })}
          body={t("dashboard.comingSoonBody")}
          action={
            <Link
              to="/dashboard"
              className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-ink transition hover:bg-accent/85"
            >
              {t("action.backToDashboard")}
            </Link>
          }
        />
      ) : (
        <>
          <Card className="mb-6 px-6 py-4">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-muted">
                <span className="font-semibold text-ink">{passedCount}</span> /{" "}
                {topics.length} {t("dashboard.topicsPassed")}
              </p>
            </div>
            <ProgressBar
              value={passedCount}
              max={topics.length}
              tone={passedCount === topics.length ? "success" : "info"}
              className="mt-3"
            />
          </Card>

          <ul className="space-y-3">
            {topics.map((topic) => {
              const attempt = attempts.get(topic.slug);
              const status = statusOf(attempt);

              return (
                <Card
                  as="li"
                  key={topic.slug}
                  className="px-5 py-4 transition hover:border-line-strong hover:bg-raised"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs text-faint">
                          {String(topic.order).padStart(2, "0")}
                        </span>
                        <h2 className="text-base font-semibold text-ink">
                          {topic.nameEN}
                        </h2>
                        <Badge
                          tone={
                            status === "completed"
                              ? "success"
                              : status === "in-progress"
                                ? "warning"
                                : "neutral"
                          }
                        >
                          {STATUS_LABEL[status]}
                        </Badge>
                      </div>
                      <p className="mt-0.5 text-sm text-faint">{topic.name}</p>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted">
                        {topic.description}
                      </p>
                      <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-faint">
                        <span>
                          {topic.questionCount} {t("learn.questions")}
                        </span>
                        {attempt && (
                          <>
                            <span>
                              {t("practice.lastScore")}:{" "}
                              <span className="text-muted">
                                {attempt.lastScore}/{attempt.totalQuestions}
                              </span>
                            </span>
                            <span>
                              {t("practice.bestScore")}:{" "}
                              <span className="text-muted">
                                {attempt.bestScore}/{attempt.totalQuestions}
                              </span>
                            </span>
                            <span>
                              {attempt.attemptCount} {t("practice.attempts")}
                            </span>
                          </>
                        )}
                      </p>
                    </div>

                    <Link
                      to={`/practice/${topic.slug}`}
                      className={`shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition ${
                        attempt
                          ? "border border-line-strong text-muted hover:bg-raised"
                          : "bg-accent text-ink hover:bg-accent/85"
                      }`}
                    >
                      {attempt
                        ? `${t("action.retry")} →`
                        : `${t("action.start")} →`}
                    </Link>
                  </div>
                </Card>
              );
            })}
          </ul>
        </>
      )}
    </AppShell>
  );
}
