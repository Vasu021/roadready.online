import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import type { LessonRow, ModuleDetail } from "@roadready/shared";
import { api } from "../utils/api";
import { useUserStore } from "../store/userStore";
import { useT } from "../i18n";
import AppShell from "../components/AppShell";
import SpeakButton from "../components/SpeakButton";
import LessonBody, { bodyToSpeech } from "../components/LessonBody";
import SceneRenderer, { asScene } from "../components/scene/SceneRenderer";
import { getSignById } from "../components/signs";
import { Badge, Card, ErrorNote, ProgressBar, Spinner } from "../components/ui";

type Detail = ModuleDetail & { completedLessonIds: string[] };

export default function ModuleView() {
  const { slug = "" } = useParams();
  const t = useT();
  const selectedCountry = useUserStore((s) => s.selectedCountry);
  const code = selectedCountry?.code ?? null;

  const [mod, setMod] = useState<Detail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const [read, setRead] = useState<string[]>([]);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!code || !slug) return;
    let cancelled = false;
    setError(null);

    api.modules
      .get(code, slug)
      .then((row) => {
        if (cancelled) return;
        setMod(row);
        setRead(row.completedLessonIds ?? []);
        // Resume where the reader left off.
        const firstUnread = row.lessons.findIndex(
          (l) => !(row.completedLessonIds ?? []).includes(l.id),
        );
        setIndex(firstUnread === -1 ? 0 : firstUnread);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : t("error.loadFailed"));
        }
      });

    return () => {
      cancelled = true;
    };
  }, [code, slug, reloadKey, t]);

  const lesson: LessonRow | undefined = mod?.lessons[index];

  const markRead = useCallback(async () => {
    if (!mod || !lesson || read.includes(lesson.id)) return;
    setRead((prev) => [...prev, lesson.id]);
    try {
      await api.modules.markLessonRead(mod.id, lesson.id);
    } catch {
      // Progress is a convenience; a failed save must not block reading.
    }
  }, [mod, lesson, read]);

  const goNext = useCallback(() => {
    void markRead();
    setIndex((i) => Math.min(i + 1, (mod?.lessons.length ?? 1) - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [markRead, mod?.lessons.length]);

  const speech = useMemo(
    () =>
      lesson
        ? [lesson.title, bodyToSpeech(lesson.body), ...(lesson.keyPoints ?? [])]
        : [],
    [lesson],
  );

  if (!selectedCountry) return <Navigate to="/" replace />;

  if (error) {
    return (
      <AppShell maxWidth="max-w-4xl">
        <ErrorNote message={error} onRetry={() => setReloadKey((k) => k + 1)} />
        <Link
          to="/learn"
          className="mt-5 inline-block text-sm text-accent hover:underline"
        >
          ← {t("learn.backToModules")}
        </Link>
      </AppShell>
    );
  }

  if (!mod || !lesson) {
    return (
      <AppShell maxWidth="max-w-4xl">
        <Spinner label={t("status.loading")} />
      </AppShell>
    );
  }

  const scene = asScene(lesson.sceneJson);
  const signs = (lesson.signIds ?? [])
    .map((id) => getSignById(id))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));
  const isLast = index === mod.lessons.length - 1;
  const allRead = read.length >= mod.lessons.length;

  return (
    <AppShell maxWidth="max-w-5xl">
      {/* Module header */}
      <header className="mb-5">
        <Link
          to="/learn"
          className="text-xs text-faint transition hover:text-muted"
        >
          ← {t("learn.backToModules")}
        </Link>
        <div className="mt-1 flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
              {mod.title}
            </h1>
            <p className="mt-0.5 text-sm italic text-faint">
              {t("learn.officialTitle")}: {mod.officialTitle}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge tone="info">
              {t("learn.lessonOf", {
                current: index + 1,
                total: mod.lessons.length,
              })}
            </Badge>
            <Link
              to={`/learn/${slug}/quiz`}
              className="rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-muted transition hover:border-line-strong hover:text-ink"
            >
              {t("learn.testYourself")} →
            </Link>
          </div>
        </div>
        <ProgressBar
          value={read.length}
          max={mod.lessons.length}
          tone={allRead ? "success" : "info"}
          className="mt-3"
        />
      </header>

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        {/* Lesson rail */}
        <nav
          aria-label={t("learn.heading")}
          className="lg:sticky lg:top-32 lg:self-start"
        >
          <ol className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:gap-1 lg:overflow-visible lg:pb-0">
            {mod.lessons.map((l, i) => {
              const done = read.includes(l.id);
              const active = i === index;
              return (
                <li key={l.id} className="shrink-0 lg:shrink">
                  <button
                    onClick={() => {
                      setIndex(i);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs transition ${
                      active
                        ? "bg-accent text-accent-ink"
                        : "text-muted hover:bg-surface hover:text-ink"
                    }`}
                  >
                    <span
                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded text-[10px] ${
                        done && !active
                          ? "bg-correct/20 text-correct"
                          : active
                            ? "bg-line-strong"
                            : "border border-line-strong text-muted"
                      }`}
                    >
                      {done ? "✓" : i + 1}
                    </span>
                    <span className="whitespace-nowrap lg:whitespace-normal">
                      {l.title}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>

        {/* Lesson body */}
        <article>
          <Card className="px-5 py-6 sm:px-7">
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-lg font-semibold text-ink sm:text-xl">
                {lesson.title}
              </h2>
              <SpeakButton text={speech} />
            </div>

            {scene && (
              <figure className="mt-5">
                <SceneRenderer
                  scene={scene}
                  width={440}
                  className="mx-auto block"
                />
                {scene.caption && (
                  <figcaption className="mt-2 text-xs text-faint">
                    {scene.caption}
                  </figcaption>
                )}
              </figure>
            )}

            <div className="mt-5">
              <LessonBody body={lesson.body} />
            </div>

            {signs.length > 0 && (
              <section className="mt-6 rounded-xl border border-line bg-raised px-4 py-4">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-faint">
                  {t("learn.relatedSigns")}
                </h3>
                <ul className="flex flex-wrap gap-4">
                  {signs.map((sign) => {
                    const Glyph = sign.component;
                    return (
                      <li key={sign.id} className="w-24 text-center">
                        <span className="flex h-16 items-center justify-center rounded-lg bg-sign-card p-1.5">
                          <Glyph size={52} />
                        </span>
                        <span className="mt-1.5 block text-[11px] leading-tight text-muted">
                          {sign.nameDE}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </section>
            )}

            {lesson.keyPoints.length > 0 && (
              <section className="mt-6 rounded-xl border border-accent/30 bg-accent/10 px-5 py-4">
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-accent">
                  {t("learn.keyPoints")}
                </h3>
                <ul className="space-y-1.5">
                  {lesson.keyPoints.map((point) => (
                    <li key={point} className="flex gap-2.5 text-sm text-ink">
                      <span className="mt-[0.4rem] h-1 w-1 shrink-0 rounded-full bg-accent" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <div className="mt-6 flex items-center justify-between gap-3 border-t border-line pt-5">
              <button
                onClick={() => setIndex((i) => Math.max(0, i - 1))}
                disabled={index === 0}
                className="rounded-lg border border-line px-4 py-2 text-sm font-medium text-muted transition hover:bg-surface disabled:opacity-30"
              >
                ← {t("action.previous")}
              </button>

              {isLast ? (
                <button
                  onClick={() => void markRead()}
                  className="rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-accent-ink transition hover:opacity-90"
                >
                  {read.includes(lesson.id)
                    ? t("action.markedRead")
                    : t("action.markRead")}
                </button>
              ) : (
                <button
                  onClick={goNext}
                  className="rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-accent-ink transition hover:opacity-90"
                >
                  {t("learn.nextLesson")} →
                </button>
              )}
            </div>
          </Card>

          {allRead && (
            <Card className="mt-5 border-correct/30 bg-correct/10 px-6 py-5">
              <h3 className="text-sm font-semibold text-correct">
                {t("learn.moduleComplete")}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">
                {t("learn.moduleCompleteBody")}
              </p>
              <Link
                to={`/learn/${slug}/quiz`}
                className="mt-4 inline-block rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-ink transition hover:opacity-90"
              >
                {t("learn.testYourself")} →
              </Link>
            </Card>
          )}
        </article>
      </div>
    </AppShell>
  );
}
