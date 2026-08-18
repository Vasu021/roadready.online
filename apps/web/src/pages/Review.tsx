import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type {
  CreateQuizPayload,
  ProgressOverview,
  QuizQuestion,
} from "@roadready/shared";
import { api, errorMessage } from "../utils/api";
import { useUserStore } from "../store/userStore";
import {
  EmptyState,
  ErrorBanner,
  LoadingPanel,
  PageShell,
  Spinner,
} from "../components/layout";
import { QuestionReviewRow } from "../components/results";
import { t, tn } from "../i18n";

/**
 * The revision hub: drill the questions you got wrong, or re-read the ones you
 * saved. Both launch an ordinary practice quiz, so they share all the quiz
 * machinery rather than needing a mode of their own.
 */
export default function Review() {
  const navigate = useNavigate();
  const selectedCountry = useUserStore((s) => s.selectedCountry);

  const [overview, setOverview] = useState<ProgressOverview | null>(null);
  const [bookmarks, setBookmarks] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [starting, setStarting] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      api.progress.overview(selectedCountry?.code),
      api.questions.bookmarks(),
    ])
      .then(([o, b]) => {
        setOverview(o);
        setBookmarks(b);
      })
      .catch((err) => setError(errorMessage(err)))
      .finally(() => setLoading(false));
  }, [selectedCountry?.code]);

  useEffect(load, [load]);

  async function start(source: CreateQuizPayload["source"], key: string) {
    if (!selectedCountry) return;
    setStarting(key);
    setError(null);
    try {
      const quiz = await api.quizzes.create({
        countryCode: selectedCountry.code,
        mode: "PRACTICE",
        source,
      });
      navigate(`/quiz/${quiz.id}`);
    } catch (err) {
      setError(errorMessage(err));
      setStarting(null);
    }
  }

  if (!selectedCountry) {
    return (
      <PageShell>
        <EmptyState
          icon="🗺️"
          title={t("No country selected")}
          description={t(
            "Choose a country first — review material is per country.",
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
      </PageShell>
    );
  }

  const mistakeCount = overview?.totals.mistakeCount ?? 0;

  return (
    <PageShell>
      <h1 className="mb-1 text-2xl font-bold">{t("Review")}</h1>
      <p className="mb-8 text-sm text-slate-400">
        {t("Come back to what you got wrong and what you saved.")}
      </p>

      {error && (
        <div className="mb-6">
          <ErrorBanner message={error} onRetry={load} />
        </div>
      )}

      {loading ? (
        <LoadingPanel />
      ) : (
        <div className="space-y-10">
          <div className="grid gap-3 sm:grid-cols-2">
            <ReviewCard
              icon="🎯"
              title={t("Drill my mistakes")}
              description={tn(
                mistakeCount,
                "{n} question you have answered incorrectly.",
                "{n} questions you have answered incorrectly, hardest first.",
              )}
              disabled={mistakeCount === 0 || starting !== null}
              busy={starting === "mistakes"}
              cta={t("Start drill")}
              onStart={() => start("MISTAKES", "mistakes")}
            />
            <ReviewCard
              icon="★"
              title={t("Bookmarked questions")}
              description={tn(
                bookmarks.length,
                "{n} question you saved for later.",
                "{n} questions you saved for later.",
              )}
              disabled={bookmarks.length === 0 || starting !== null}
              busy={starting === "bookmarks"}
              cta={t("Practise these")}
              onStart={() => start("BOOKMARKS", "bookmarks")}
            />
          </div>

          <section>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-slate-500">
              {t("Your bookmarks")}
            </h2>
            {bookmarks.length === 0 ? (
              <EmptyState
                icon="☆"
                title={t("Nothing saved yet")}
                description={t(
                  "Tap Save on any question while practising and it will show up here with its explanation.",
                )}
              />
            ) : (
              <ul className="space-y-2.5">
                {bookmarks.map((question, i) => (
                  <QuestionReviewRow
                    key={question.id}
                    question={question}
                    index={i}
                  />
                ))}
              </ul>
            )}
          </section>
        </div>
      )}
    </PageShell>
  );
}

function ReviewCard({
  icon,
  title,
  description,
  cta,
  disabled,
  busy,
  onStart,
}: {
  icon: string;
  title: string;
  description: string;
  cta: string;
  disabled: boolean;
  busy: boolean;
  onStart: () => void;
}) {
  return (
    <div className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/40 px-6 py-5">
      <div className="mb-2.5 text-2xl" aria-hidden="true">
        {icon}
      </div>
      <h3 className="font-semibold text-white">{title}</h3>
      <p className="mt-1 flex-1 text-sm text-slate-400">{description}</p>
      <button
        onClick={onStart}
        disabled={disabled}
        className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {busy && <Spinner size="sm" />}
        {cta}
      </button>
    </div>
  );
}
