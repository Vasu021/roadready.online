import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import type {
  ModuleSummary,
  TopicAttemptSummary,
  TopicTestSummary,
} from "@roadready/shared";
import { api } from "../utils/api";
import { useUserStore } from "../store/userStore";
import { useT } from "../i18n";
import type { TranslationKey } from "../i18n";
import AppShell from "../components/AppShell";
import SpeakButton from "../components/SpeakButton";
import { Badge, Card, ErrorNote, ProgressBar, Spinner } from "../components/ui";
import { getSignsForCountry } from "../components/signs";

interface SectionDef {
  to: string;
  icon: string;
  titleKey: TranslationKey;
  bodyKey: TranslationKey;
  meta: string;
}

export default function Dashboard() {
  const t = useT();
  const selectedCountry = useUserStore((s) => s.selectedCountry);
  const code = selectedCountry?.code ?? null;

  const [modules, setModules] = useState<ModuleSummary[] | null>(null);
  const [topics, setTopics] = useState<TopicTestSummary[]>([]);
  const [attempts, setAttempts] = useState<TopicAttemptSummary[]>([]);
  const [scenarioCount, setScenarioCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!code) return;
    let cancelled = false;
    setError(null);

    Promise.all([
      api.modules.list(code).catch(() => [] as ModuleSummary[]),
      api.topicTests.list(code),
      api.topicTests.attempts(code).catch(() => [] as TopicAttemptSummary[]),
      api.scenarios.list(code).catch(() => []),
    ])
      .then(([moduleRows, topicRows, attemptRows, scenarioRows]) => {
        if (cancelled) return;
        setModules(moduleRows);
        setTopics(topicRows);
        setAttempts(attemptRows);
        setScenarioCount(scenarioRows.length);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setModules([]);
        setError(err instanceof Error ? err.message : t("error.loadFailed"));
      });

    return () => {
      cancelled = true;
    };
  }, [code, reloadKey, t]);

  if (!selectedCountry) return <Navigate to="/" replace />;

  const signCount = getSignsForCountry(selectedCountry.code).length;
  const modulesDone = modules?.filter((m) => m.completedAt).length ?? 0;
  const totalModules = modules?.length ?? 0;
  const topicsPassed = attempts.filter((a) => a.passed).length;
  const lastAttempt = [...attempts].sort((a, b) =>
    b.lastAttemptAt.localeCompare(a.lastAttemptAt),
  )[0];

  const hasContent = totalModules > 0 || topics.length > 0 || signCount > 0;

  const sections: SectionDef[] = [
    {
      to: "/learn",
      icon: "📘",
      titleKey: "dashboard.learn.title",
      bodyKey: "dashboard.learn.body",
      meta: `${totalModules} · ${t("nav.learn")}`,
    },
    {
      to: "/signs",
      icon: "📚",
      titleKey: "dashboard.signs.title",
      bodyKey: "dashboard.signs.body",
      meta: t("signs.count", { count: signCount }),
    },
    {
      to: "/practice",
      icon: "📝",
      titleKey: "dashboard.practice.title",
      bodyKey: "dashboard.practice.body",
      meta: `${topics.length} · ${t("nav.practice")}`,
    },
    {
      to: "/scenarios",
      icon: "🎬",
      titleKey: "dashboard.scenarios.title",
      bodyKey: "dashboard.scenarios.body",
      meta: t("scenarios.count", { count: scenarioCount }),
    },
  ];

  return (
    <AppShell>
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent">
          {selectedCountry.flagEmoji} {selectedCountry.name}
        </p>
        <div className="mt-2 flex items-start justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            {t("dashboard.heading")}
          </h1>
          <SpeakButton text={[t("dashboard.heading"), t("dashboard.intro")]} />
        </div>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
          {t("dashboard.intro")}
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

      {!hasContent && modules !== null && (
        <div className="mb-8 rounded-xl border border-premium/30 bg-premium/10 px-6 py-5">
          <h2 className="text-sm font-semibold text-premium">
            {t("dashboard.comingSoon", { country: selectedCountry.name })}
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-premium/70">
            {t("dashboard.comingSoonBody")}
          </p>
        </div>
      )}

      {hasContent && (
        <Card className="mb-8 px-6 py-5">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-faint">
                {t("dashboard.progress")}
              </h2>
              <p className="mt-1.5 text-2xl font-bold tabular-nums text-ink">
                {modulesDone}
                <span className="text-base font-medium text-faint">
                  {" "}
                  / {totalModules || "—"} {t("dashboard.modulesDone")}
                </span>
              </p>
              <p className="mt-1 text-sm text-muted">
                {topicsPassed} / {topics.length} {t("dashboard.topicsPassed")}
              </p>
            </div>

            {lastAttempt ? (
              <div className="text-right">
                <p className="text-xs uppercase tracking-widest text-faint">
                  {t("dashboard.lastAttempt")}
                </p>
                <p className="mt-1 text-sm text-muted">
                  {lastAttempt.lastScore} / {lastAttempt.totalQuestions}{" "}
                  <Badge tone={lastAttempt.passed ? "success" : "danger"}>
                    {lastAttempt.passed
                      ? t("status.passed")
                      : t("action.retry")}
                  </Badge>
                </p>
              </div>
            ) : (
              <p className="text-sm text-faint">{t("dashboard.noAttempts")}</p>
            )}
          </div>
          <ProgressBar
            value={modulesDone}
            max={totalModules || 1}
            tone={
              modulesDone === totalModules && totalModules > 0
                ? "success"
                : "info"
            }
            className="mt-4"
          />
        </Card>
      )}

      {modules === null ? (
        <Spinner label={t("status.loading")} />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            {sections.map((s) => (
              <Link
                key={s.to}
                to={s.to}
                className="group relative overflow-hidden rounded-xl border border-line bg-surface p-6 backdrop-blur-sm transition duration-200 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
              >
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0 transition group-hover:opacity-100"
                />
                <div className="relative">
                  <span className="text-3xl">{s.icon}</span>
                  <h3 className="mt-3 text-base font-semibold text-ink">
                    {t(s.titleKey)}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">
                    {t(s.bodyKey)}
                  </p>
                  <p className="mt-4 flex items-center justify-between text-xs">
                    <span className="text-faint">{s.meta}</span>
                    <span className="font-medium text-accent transition group-hover:translate-x-0.5">
                      {t("action.open")} →
                    </span>
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {totalModules > 0 && (
            <Link
              to="/final-test"
              className="group mt-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-premium/30 bg-gradient-to-r from-premium/10 to-transparent px-6 py-5 transition hover:border-premium/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-premium/70"
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl">🎓</span>
                <div>
                  <h3 className="text-base font-semibold text-premium">
                    {t("dashboard.finalTest.title")}
                  </h3>
                  <p className="mt-0.5 text-sm text-premium/70">
                    {t("dashboard.finalTest.body")}
                  </p>
                </div>
              </div>
              <span className="rounded-lg bg-premium/20 px-4 py-2 text-sm font-semibold text-premium transition group-hover:bg-premium/30">
                {t("action.start")} →
              </span>
            </Link>
          )}
        </>
      )}
    </AppShell>
  );
}
