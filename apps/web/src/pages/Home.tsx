import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type {
  CountryDetail,
  CountrySummary,
  CountryTopicsResponse,
  CreateQuizPayload,
} from "@roadready/shared";
import { api, errorMessage } from "../utils/api";
import { useUserStore } from "../store/userStore";
import {
  AppHeader,
  ErrorBanner,
  LoadingPanel,
  PageShell,
  Spinner,
} from "../components/layout";
import { CountryFacts, TopicCard } from "../components/home";
import { t } from "../i18n";

/**
 * Home has three states, chosen by session and country rather than by route:
 *   A — logged out: the marketing page
 *   B — logged in, no country: the country picker
 *   C — logged in, country chosen: the topic list
 */
export default function Home() {
  const user = useUserStore((s) => s.user);
  const isBootstrapping = useUserStore((s) => s.isBootstrapping);
  const selectedCountry = useUserStore((s) => s.selectedCountry);

  if (isBootstrapping) {
    return (
      <div className="min-h-full bg-slate-950">
        <LoadingPanel />
      </div>
    );
  }
  if (!user) return <LandingPage />;
  if (!selectedCountry) return <CountrySelect />;
  return <TopicList />;
}

// ── State A ─────────────────────────────────────────────────────────────────

function LandingPage() {
  const setShowAuthModal = useUserStore((s) => s.setShowAuthModal);

  return (
    <div className="min-h-full bg-slate-950 text-white">
      <AppHeader />

      <main>
        <section className="mx-auto flex max-w-3xl flex-col items-center px-5 py-20 text-center sm:px-8 sm:py-28">
          <span className="mb-5 rounded-full border border-slate-800 bg-slate-900/60 px-3.5 py-1.5 text-xs font-medium text-slate-400">
            {t("Germany 🇩🇪 and France 🇫🇷 · 90 scenario questions")}
          </span>
          <h1 className="max-w-2xl text-4xl font-bold leading-[1.15] tracking-tight sm:text-5xl">
            {t("Learn to read the road, not just the rulebook.")}
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-400">
            {t(
              "Every question puts you in a real situation — a junction, a sign, a hazard — and asks what you would do. Answer, see why, and remember it.",
            )}
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setShowAuthModal(true, "register")}
              className="rounded-xl bg-blue-600 px-6 py-3 text-base font-semibold transition hover:bg-blue-500"
            >
              {t("Start practising — free")}
            </button>
            <button
              onClick={() => setShowAuthModal(true, "login")}
              className="rounded-xl border border-slate-700 px-6 py-3 text-base text-slate-300 transition hover:bg-slate-900"
            >
              {t("Sign in")}
            </button>
          </div>
        </section>

        <section className="border-y border-slate-800/70 bg-slate-900/25 px-5 py-16 sm:px-8">
          <div className="mx-auto grid max-w-4xl gap-5 sm:grid-cols-3">
            {[
              {
                icon: "🖼️",
                title: t("Scenario questions"),
                desc: t(
                  "Each question is built around an illustrated road situation, so you practise reading the scene — not memorising answer letters.",
                ),
              },
              {
                icon: "💡",
                title: t("An explanation every time"),
                desc: t(
                  "Right or wrong, you get the rule behind the answer with the article it comes from, in plain language.",
                ),
              },
              {
                icon: "📈",
                title: t("Your weak spots, tracked"),
                desc: t(
                  "Questions you get wrong come back. Bookmark anything you want to revisit, and take a mock exam when you feel ready.",
                ),
              },
            ].map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-slate-800 bg-slate-900/50 px-6 py-7"
              >
                <div className="mb-3 text-3xl" aria-hidden="true">
                  {f.icon}
                </div>
                <h3 className="mb-2 font-semibold">{f.title}</h3>
                <p className="text-sm leading-relaxed text-slate-400">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
          <h2 className="mb-9 text-center text-2xl font-bold">
            {t("How it works")}
          </h2>
          <ol className="grid gap-6 sm:grid-cols-3">
            {[
              {
                n: "1",
                title: t("Pick your country"),
                desc: t("Germany or France."),
              },
              {
                n: "2",
                title: t("Work through topics"),
                desc: t("Priority rules, signs, motorway, hazards."),
              },
              {
                n: "3",
                title: t("Sit the mock exam"),
                desc: t("Graded at the end, with a full review."),
              },
            ].map((s) => (
              <li key={s.n} className="flex flex-col items-center text-center">
                <span className="mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-bold">
                  {s.n}
                </span>
                <h3 className="mb-1 font-semibold">{s.title}</h3>
                <p className="text-sm text-slate-400">{s.desc}</p>
              </li>
            ))}
          </ol>
        </section>
      </main>

      <footer className="border-t border-slate-800/70 px-5 py-7 text-center text-sm text-slate-500 sm:px-8">
        roadready.online — {t("Built in Aachen 🇩🇪")}
      </footer>
    </div>
  );
}

// ── State B ─────────────────────────────────────────────────────────────────

function CountrySelect() {
  const setSelectedCountry = useUserStore((s) => s.setSelectedCountry);

  const [countries, setCountries] = useState<CountrySummary[]>([]);
  const [chosen, setChosen] = useState<CountrySummary | null>(null);
  const [detail, setDetail] = useState<CountryDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.countries
      .list()
      .then((list) => {
        setCountries(list);
        setChosen(list[0] ?? null);
      })
      .catch((err) => setError(errorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!chosen) return;
    setDetail(null);
    api.countries
      .detail(chosen.code)
      .then(setDetail)
      .catch(() => setDetail(null));
  }, [chosen]);

  async function handleContinue() {
    if (!chosen) return;
    setSaving(true);
    setError(null);
    try {
      await api.auth.updateProfile({ countryCode: chosen.code });
      // Set last — this is what flips the page over to state C.
      setSelectedCountry(chosen);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <PageShell>
      <h1 className="mb-2 text-center text-3xl font-bold">
        {t("Where are you learning to drive?")}
      </h1>
      <p className="mb-9 text-center text-slate-400">
        {t("You can switch country at any time.")}
      </p>

      {loading ? (
        <LoadingPanel />
      ) : (
        <div className="mx-auto max-w-lg space-y-5">
          <div className="grid gap-3 sm:grid-cols-2">
            {countries.map((c) => {
              const active = chosen?.code === c.code;
              return (
                <button
                  key={c.code}
                  onClick={() => setChosen(c)}
                  aria-pressed={active}
                  className={`rounded-xl border px-5 py-4 text-left transition ${
                    active
                      ? "border-blue-500 bg-blue-950/40 ring-1 ring-blue-500/40"
                      : "border-slate-800 bg-slate-900/50 hover:border-slate-600"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl" aria-hidden="true">
                      {c.flagEmoji}
                    </span>
                    <span className="font-semibold">{c.name}</span>
                  </div>
                  <p className="mt-1.5 text-xs text-slate-400">
                    {t("{topics} topics · {questions} questions", {
                      topics: c.topicCount,
                      questions: c.questionCount,
                    })}
                  </p>
                </button>
              );
            })}
          </div>

          <div className="min-h-[132px] rounded-2xl border border-slate-800 bg-slate-900/40 px-6 py-5">
            {detail ? (
              <CountryFacts html={detail.facts} />
            ) : (
              <div className="flex h-20 items-center justify-center">
                <Spinner />
              </div>
            )}
          </div>

          {error && <ErrorBanner message={error} />}

          <button
            onClick={handleContinue}
            disabled={!chosen || saving}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold transition hover:bg-blue-500 disabled:opacity-50"
          >
            {saving && <Spinner size="sm" />}
            {t("Continue")}
          </button>
        </div>
      )}
    </PageShell>
  );
}

// ── State C ─────────────────────────────────────────────────────────────────

function TopicList() {
  const navigate = useNavigate();
  const user = useUserStore((s) => s.user);
  const selectedCountry = useUserStore((s) => s.selectedCountry)!;
  const setSelectedCountry = useUserStore((s) => s.setSelectedCountry);

  const [data, setData] = useState<CountryTopicsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [starting, setStarting] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    api.countries
      .topics(selectedCountry.code)
      .then(setData)
      .catch((err) => setError(errorMessage(err)))
      .finally(() => setLoading(false));
  }, [selectedCountry.code]);

  useEffect(load, [load]);

  const startQuiz = useCallback(
    async (payload: CreateQuizPayload, key: string) => {
      setStarting(key);
      setError(null);
      try {
        const quiz = await api.quizzes.create(payload);
        navigate(`/quiz/${quiz.id}`);
      } catch (err) {
        setError(errorMessage(err));
        setStarting(null);
      }
    },
    [navigate],
  );

  const isPremium = user?.isPremium ?? false;

  return (
    <PageShell>
      <div className="mb-8 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">
            {selectedCountry.flagEmoji} {selectedCountry.name}
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            {t("{topics} topics · {questions} scenario questions", {
              topics: selectedCountry.topicCount,
              questions: selectedCountry.questionCount,
            })}
          </p>
        </div>
        <button
          onClick={() => setSelectedCountry(null)}
          className="text-sm text-blue-400 transition hover:text-blue-300"
        >
          {t("Change country")}
        </button>
      </div>

      {!isPremium && (
        <p className="mb-6 rounded-xl border border-amber-900/50 bg-amber-950/25 px-5 py-3 text-sm text-amber-200">
          {t("Free plan — the first 3 topics are unlocked.")}{" "}
          <span className="font-semibold">{t("Upgrade to Premium")}</span>{" "}
          {t("for the full question bank.")}
        </p>
      )}

      <button
        onClick={() =>
          startQuiz(
            {
              countryCode: selectedCountry.code,
              mode: "EXAM",
              source: "EXAM",
            },
            "exam",
          )
        }
        disabled={starting !== null}
        className="mb-9 flex w-full items-center gap-4 rounded-2xl border border-amber-700/50 bg-gradient-to-br from-amber-950/40 to-slate-900/40 px-6 py-5 text-left transition hover:border-amber-600 disabled:opacity-60"
      >
        <span className="text-3xl" aria-hidden="true">
          🎓
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-semibold text-amber-200">
            {t("Mock exam")}
          </span>
          <span className="mt-0.5 block text-sm text-amber-100/60">
            {t(
              "{n} random questions, graded at the end. Answers stay hidden until you finish.",
              { n: selectedCountry.examQuestionCount },
            )}
          </span>
        </span>
        <span className="shrink-0 rounded-lg bg-amber-500/20 px-3.5 py-1.5 text-sm font-semibold text-amber-300">
          {starting === "exam" ? <Spinner size="sm" /> : t("Start")}
        </span>
      </button>

      {error && (
        <div className="mb-6">
          <ErrorBanner message={error} onRetry={load} />
        </div>
      )}

      {loading ? (
        <LoadingPanel />
      ) : (
        <div className="space-y-9">
          {data?.categories.map((category) => (
            <section key={category.id}>
              <h2 className="mb-1 text-xs font-semibold uppercase tracking-widest text-slate-500">
                {category.name}
              </h2>
              {category.description && (
                <p className="mb-3 text-sm text-slate-500">
                  {category.description}
                </p>
              )}
              <ul className="space-y-2.5">
                {category.topics.map((topic) => (
                  <TopicCard
                    key={topic.id}
                    topic={topic}
                    locked={topic.isPremium && !isPremium}
                    onStart={() =>
                      startQuiz(
                        {
                          countryCode: selectedCountry.code,
                          mode: "PRACTICE",
                          source: "TOPIC",
                          topicSlug: topic.slug,
                        },
                        topic.slug,
                      )
                    }
                  />
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </PageShell>
  );
}
