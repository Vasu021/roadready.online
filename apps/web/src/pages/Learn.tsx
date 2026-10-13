import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import type { ModuleSummary } from "@roadready/shared";
import { api } from "../utils/api";
import { useUserStore } from "../store/userStore";
import { useT } from "../i18n";
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

export default function Learn() {
  const t = useT();
  const selectedCountry = useUserStore((s) => s.selectedCountry);
  const code = selectedCountry?.code ?? null;

  const [modules, setModules] = useState<ModuleSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!code) return;
    let cancelled = false;
    setError(null);

    api.modules
      .list(code)
      .then((rows) => {
        if (!cancelled) setModules(rows);
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

  const grundstoff = modules?.filter((m) => !m.isZusatzstoff) ?? [];
  const zusatzstoff = modules?.filter((m) => m.isZusatzstoff) ?? [];
  const done = modules?.filter((m) => m.completedAt).length ?? 0;

  return (
    <AppShell>
      <header className="mb-6">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            {t("learn.heading")}
          </h1>
          <SpeakButton text={[t("learn.heading"), t("learn.intro")]} />
        </div>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          {t("learn.intro")}
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

      {modules === null ? (
        <Spinner label={t("status.loading")} />
      ) : modules.length === 0 ? (
        <EmptyState
          icon="📘"
          title={t("dashboard.comingSoon", { country: selectedCountry.name })}
          body={t("dashboard.comingSoonBody")}
          action={
            <Link
              to="/dashboard"
              className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-ink transition hover:opacity-90"
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
                <span className="font-semibold text-ink">{done}</span> /{" "}
                {modules.length} {t("dashboard.modulesDone")}
              </p>
            </div>
            <ProgressBar
              value={done}
              max={modules.length}
              tone={done === modules.length ? "success" : "info"}
              className="mt-3"
            />
          </Card>

          <ModuleGroup title={t("learn.grundstoff")} modules={grundstoff} />
          {zusatzstoff.length > 0 && (
            <div className="mt-8">
              <ModuleGroup
                title={t("learn.zusatzstoff")}
                modules={zusatzstoff}
              />
            </div>
          )}
        </>
      )}
    </AppShell>
  );
}

function ModuleGroup({
  title,
  modules,
}: {
  title: string;
  modules: ModuleSummary[];
}) {
  const t = useT();

  return (
    <section>
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-faint">
        {title}
      </h2>
      <ul className="space-y-3">
        {modules.map((m) => {
          const complete = Boolean(m.completedAt);
          const started = (m.completedLessons ?? 0) > 0 && !complete;

          return (
            <li key={m.slug}>
              <Link
                to={`/learn/${m.slug}`}
                className="group block rounded-xl border border-line bg-surface px-5 py-4 backdrop-blur-sm transition hover:border-line-strong hover:bg-raised focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs text-faint">
                        {String(m.order).padStart(2, "0")}
                      </span>
                      <h3 className="text-base font-semibold text-ink">
                        {m.title}
                      </h3>
                      {complete && (
                        <Badge tone="success">{t("status.completed")}</Badge>
                      )}
                      {started && (
                        <Badge tone="warning">{t("status.inProgress")}</Badge>
                      )}
                    </div>
                    <p className="mt-0.5 text-sm italic text-faint">
                      {m.officialTitle}
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">
                      {m.summary}
                    </p>
                    <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-faint">
                      <span>
                        {m.lessonCount} {t("learn.lessons")}
                      </span>
                      <span>
                        {m.questionCount} {t("learn.questions")}
                      </span>
                      <span>
                        {m.estimatedMinutes} {t("learn.minutes")}
                      </span>
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-medium text-accent transition group-hover:translate-x-0.5">
                    {t("action.open")} →
                  </span>
                </div>

                {(m.completedLessons ?? 0) > 0 && (
                  <ProgressBar
                    value={m.completedLessons ?? 0}
                    max={m.lessonCount}
                    tone={complete ? "success" : "info"}
                    className="mt-3"
                  />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
