import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import type { TopicAttemptSummary, TopicTestSummary } from "@roadready/shared";
import { api } from "../utils/api";
import { useUserStore } from "../store/userStore";
import AppShell from "../components/AppShell";
import { Card, ErrorNote, ProgressBar, Spinner, Badge } from "../components/ui";
import { getSignsForCountry } from "../components/signs";

interface SectionDef {
  to: string;
  icon: string;
  title: string;
  body: string;
  meta: string;
  accent: string;
}

export default function Dashboard() {
  const selectedCountry = useUserStore((s) => s.selectedCountry);

  const [topics, setTopics] = useState<TopicTestSummary[] | null>(null);
  const [attempts, setAttempts] = useState<TopicAttemptSummary[]>([]);
  const [scenarioCount, setScenarioCount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const code = selectedCountry?.code ?? null;

  useEffect(() => {
    if (!code) return;
    let cancelled = false;
    setError(null);

    Promise.all([
      api.topicTests.list(code),
      api.topicTests.attempts(code).catch(() => [] as TopicAttemptSummary[]),
      api.scenarios.list(code).catch(() => []),
    ])
      .then(([topicRows, attemptRows, scenarioRows]) => {
        if (cancelled) return;
        setTopics(topicRows);
        setAttempts(attemptRows);
        setScenarioCount(scenarioRows.length);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setTopics([]);
        setError(
          err instanceof Error ? err.message : "Could not load your dashboard.",
        );
      });

    return () => {
      cancelled = true;
    };
  }, [code, reloadKey]);

  if (!selectedCountry) return <Navigate to="/" replace />;

  const signCount = getSignsForCountry(selectedCountry.code).length;
  const completed = attempts.filter((a) => a.passed).length;
  const totalTopics = topics?.length ?? 0;
  const lastAttempt = [...attempts].sort((a, b) =>
    b.lastAttemptAt.localeCompare(a.lastAttemptAt),
  )[0];

  const hasContent =
    totalTopics > 0 || (scenarioCount ?? 0) > 0 || signCount > 0;

  const sections: SectionDef[] = [
    {
      to: "/signs",
      icon: "📚",
      title: "Signs Library",
      body: "Every German sign, signal, road marking and plate combination — with what it means and what to do.",
      meta: `${signCount} entries`,
      accent: "from-blue-500/20 to-blue-600/5",
    },
    {
      to: "/practice",
      icon: "📝",
      title: "Practice Tests",
      body: "Topic-by-topic question sets with an explanation after every answer. Wrong answers never end the run.",
      meta: `${totalTopics} topics`,
      accent: "from-indigo-500/20 to-indigo-600/5",
    },
    {
      to: "/scenarios",
      icon: "🎬",
      title: "Scenario Practice",
      body: "Illustrated driving situations that test judgement, not just recall of the sign catalogue.",
      meta: `${scenarioCount ?? 0} situations`,
      accent: "from-violet-500/20 to-violet-600/5",
    },
  ];

  return (
    <AppShell>
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-400">
          {selectedCountry.flagEmoji} {selectedCountry.name}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Let&apos;s get you ready for the road
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-gray-400">
          Learn the signs, drill each topic until the answers are automatic,
          then sit the full theory test under exam conditions.
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

      {!hasContent && topics !== null && (
        <div className="mb-8 rounded-xl border border-amber-400/30 bg-amber-400/10 px-6 py-5">
          <h2 className="text-sm font-semibold text-amber-200">
            Content for {selectedCountry.name} is still being written
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-amber-100/70">
            The German course is complete:{" "}
            <strong className="font-semibold">136 signs</strong>, twelve topic
            tests and eighteen driving situations. Switch country from the badge
            in the header to start there.
          </p>
        </div>
      )}

      {/* Progress summary */}
      {hasContent && (
        <Card className="mb-8 px-6 py-5">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                Your progress
              </h2>
              <p className="mt-1.5 text-2xl font-bold tabular-nums text-white">
                {completed}
                <span className="text-base font-medium text-gray-500">
                  {" "}
                  / {totalTopics || "—"} topics passed
                </span>
              </p>
            </div>

            {lastAttempt ? (
              <div className="text-right">
                <p className="text-xs uppercase tracking-widest text-gray-500">
                  Last attempt
                </p>
                <p className="mt-1 text-sm text-gray-300">
                  {lastAttempt.lastScore} / {lastAttempt.totalQuestions}{" "}
                  <Badge tone={lastAttempt.passed ? "success" : "danger"}>
                    {lastAttempt.passed ? "passed" : "retry"}
                  </Badge>
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No attempts yet.</p>
            )}
          </div>
          <ProgressBar
            value={completed}
            max={totalTopics || 1}
            tone={
              completed === totalTopics && totalTopics > 0 ? "success" : "info"
            }
            className="mt-4"
          />
        </Card>
      )}

      {topics === null ? (
        <Spinner label="Loading your country content…" />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sections.map((s) => (
              <Link
                key={s.to}
                to={s.to}
                className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition duration-200 hover:-translate-y-0.5 hover:border-white/25 hover:shadow-xl hover:shadow-black/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70"
              >
                <div
                  aria-hidden="true"
                  className={`absolute inset-0 bg-gradient-to-br ${s.accent} opacity-0 transition group-hover:opacity-100`}
                />
                <div className="relative">
                  <span className="text-3xl">{s.icon}</span>
                  <h3 className="mt-3 text-base font-semibold text-white">
                    {s.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-gray-400">
                    {s.body}
                  </p>
                  <p className="mt-4 flex items-center justify-between text-xs">
                    <span className="text-gray-500">{s.meta}</span>
                    <span className="font-medium text-blue-400 transition group-hover:translate-x-0.5">
                      Open →
                    </span>
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Final test */}
          {totalTopics > 0 && (
            <Link
              to="/final-test"
              className="group mt-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-amber-400/30 bg-gradient-to-r from-amber-400/10 to-transparent px-6 py-5 transition hover:border-amber-400/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/70"
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl">🎓</span>
                <div>
                  <h3 className="text-base font-semibold text-amber-200">
                    Take the Final Theory Test
                  </h3>
                  <p className="mt-0.5 text-sm text-amber-100/60">
                    30 mixed questions · 45 minutes · 75% to pass
                  </p>
                </div>
              </div>
              <span className="rounded-lg bg-amber-400/20 px-4 py-2 text-sm font-semibold text-amber-200 transition group-hover:bg-amber-400/30">
                Start →
              </span>
            </Link>
          )}
        </>
      )}
    </AppShell>
  );
}
