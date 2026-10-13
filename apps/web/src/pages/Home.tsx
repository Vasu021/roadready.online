import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import type { ProgressStatus } from "@roadready/shared";
import { api } from "../utils/api";
import { sanitizeHtml } from "../utils/sanitizeHtml";
import type { CountryRow } from "../utils/api";
import { useUserStore } from "../store/userStore";
import { useT } from "../i18n";
import { Logo } from "../components/AppShell";
import SettingsMenu from "../components/SettingsMenu";
import { Card, ErrorNote, PageBackdrop } from "../components/ui";
import {
  PriorityGiveWay,
  PriorityStop,
  PriorityRoad,
} from "../components/signs/priority";
import {
  ProhibitSpeed30,
  ProhibitNoEntry,
  ProhibitNoOvertaking,
} from "../components/signs/prohibition";
import {
  MandatoryRoundabout,
  MandatoryCyclePath,
} from "../components/signs/mandatory";
import {
  DangerChildren,
  DangerCrossroads,
  DangerSlipperyRoad,
} from "../components/signs/danger";
import { InfoAutobahn } from "../components/signs/information";
import { getSignsForCountry } from "../components/signs";

// ── State A: landing page (logged out) ───────────────────────────────────────

const HERO_SIGNS = [
  PriorityGiveWay,
  PriorityStop,
  DangerCrossroads,
  PriorityRoad,
  ProhibitSpeed30,
  MandatoryRoundabout,
  DangerChildren,
  InfoAutobahn,
  ProhibitNoEntry,
  DangerSlipperyRoad,
  MandatoryCyclePath,
  ProhibitNoOvertaking,
];

function LandingPage() {
  const t = useT();
  const setShowAuthModal = useUserStore((s) => s.setShowAuthModal);
  const signCount = getSignsForCountry("DE").length;

  return (
    <div className="relative min-h-full bg-ground text-ink">
      <PageBackdrop />

      <header className="relative flex items-center justify-between px-5 py-4 sm:px-8">
        <Logo />
        <div className="flex items-center gap-2 sm:gap-3">
          <SettingsMenu />
          <button
            onClick={() => setShowAuthModal(true, "login")}
            className="rounded-lg border border-line px-3.5 py-2 text-sm font-medium text-muted transition hover:border-line-strong hover:text-ink sm:px-4"
          >
            {t("nav.signIn")}
          </button>
          <button
            onClick={() => setShowAuthModal(true, "register")}
            className="rounded-lg bg-accent px-3.5 py-2 text-sm font-semibold text-ink transition hover:bg-accent/85 sm:px-4"
          >
            {t("nav.getStarted")}
          </button>
        </div>
      </header>

      <main className="relative">
        {/* Hero */}
        <section className="mx-auto max-w-5xl px-5 pb-10 pt-14 text-center sm:px-8 sm:pt-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-1.5 text-xs font-medium text-muted">
            🇩🇪 {t("test.subheading")}
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-bold leading-[1.1] tracking-tight sm:text-6xl">
            {t("app.tagline").split(".")[0]}.
            <span className="block bg-gradient-to-r from-accent to-accent bg-clip-text text-transparent">
              {t("app.tagline").split(".").slice(1).join(".").trim()}
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            {signCount} German signs, signals and road markings, twelve topic
            tests and illustrated driving situations — then the full 30-question
            exam under real conditions. Free to start, in your browser.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              onClick={() => setShowAuthModal(true, "register")}
              className="rounded-xl bg-accent px-6 py-3.5 text-base font-semibold text-ink shadow-lg shadow-accent/20 transition hover:bg-accent/85"
            >
              {t("nav.getStarted")}
            </button>
            <button
              onClick={() => setShowAuthModal(true, "login")}
              className="rounded-xl border border-line-strong px-6 py-3.5 text-base font-medium text-muted transition hover:bg-surface"
            >
              {t("nav.signIn")}
            </button>
          </div>

          {/* Live sign wall — the real components used in the app */}
          <div className="mx-auto mt-14 grid max-w-3xl grid-cols-4 gap-4 sm:grid-cols-6">
            {HERO_SIGNS.map((Sign, i) => (
              <div
                key={i}
                className="flex items-center justify-center rounded-xl border border-line bg-surface p-3 transition hover:-translate-y-0.5 hover:border-line-strong"
              >
                <Sign size={48} />
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                icon: "📚",
                title: "The whole sign catalogue",
                desc: "Danger, priority, prohibition, mandatory and information signs — plus light signals, road markings and the plate combinations that change a sign's meaning.",
              },
              {
                icon: "📝",
                title: "Topic-by-topic drilling",
                desc: "Twelve focused tests, from Rechts vor Links to Autobahn rules. An explanation after every answer, and a wrong answer never ends the run.",
              },
              {
                icon: "🎓",
                title: "A real exam rehearsal",
                desc: "30 mixed questions, 45 minutes on the clock, graded A to F with a per-question breakdown so you know exactly what to revise.",
              },
            ].map((f) => (
              <Card key={f.title} className="px-6 py-7">
                <div className="text-3xl">{f.icon}</div>
                <h3 className="mt-3.5 text-base font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {f.desc}
                </p>
              </Card>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="mx-auto max-w-4xl px-5 py-12 sm:px-8">
          <h2 className="text-center text-2xl font-bold tracking-tight">
            How it works
          </h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {[
              {
                step: "1",
                title: "Pick your country",
                desc: "Germany is complete today; more countries are being written.",
              },
              {
                step: "2",
                title: "Learn, then drill",
                desc: "Browse the sign library, then practise topic by topic until it is automatic.",
              },
              {
                step: "3",
                title: "Sit the full test",
                desc: "30 questions against the clock, with a grade and a detailed breakdown.",
              },
            ].map((h) => (
              <div key={h.step} className="text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-accent text-base font-bold">
                  {h.step}
                </div>
                <h3 className="mt-4 font-semibold">{h.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">
                  {h.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-14 text-center">
            <button
              onClick={() => setShowAuthModal(true, "register")}
              className="rounded-xl bg-accent px-6 py-3.5 text-base font-semibold text-ink shadow-lg shadow-accent/20 transition hover:bg-accent/85"
            >
              {t("nav.getStarted")}
            </button>
          </div>
        </section>
      </main>

      <footer className="relative border-t border-line px-5 py-8 text-center text-sm text-faint sm:px-8">
        roadready.online — made in Aachen 🇩🇪 · Study material based on the StVO,
        not legal advice.
      </footer>
    </div>
  );
}

// ── State B: country selection (logged in, no country chosen) ────────────────

function CountrySelect() {
  const t = useT();
  const user = useUserStore((s) => s.user);
  const setSelectedCountry = useUserStore((s) => s.setSelectedCountry);
  const setScenarioProgress = useUserStore((s) => s.setScenarioProgress);
  const logout = useUserStore((s) => s.logout);

  const [countries, setCountries] = useState<CountryRow[]>([]);
  const [chosenCountry, setChosenCountry] = useState<CountryRow | null>(null);
  const [facts, setFacts] = useState<string | null>(null);
  const [loadingFacts, setLoadingFacts] = useState(false);
  const [continuing, setContinuing] = useState(false);
  const [continueError, setContinueError] = useState<string | null>(null);

  useEffect(() => {
    api.countries
      .list()
      .then((list) => {
        setCountries(list);
        const germany = list.find((c) => c.code === "DE");
        setChosenCountry(germany ?? list[0] ?? null);
      })
      .catch(() => setContinueError("Could not load the country list."));
  }, []);

  useEffect(() => {
    if (!chosenCountry) return;
    setLoadingFacts(true);
    setFacts(null);
    api.countries
      .facts(chosenCountry.code)
      .then((r) => setFacts(r.facts))
      .catch(() => setFacts(null))
      .finally(() => setLoadingFacts(false));
  }, [chosenCountry]);

  async function handleContinue() {
    if (!chosenCountry || !user) return;
    setContinuing(true);
    setContinueError(null);
    try {
      await api.userCountryAccess.record(chosenCountry.code);

      const progressRows = await api.scenarios
        .progress(user.id, chosenCountry.code)
        .catch(() => []);

      const progressMap: Record<string, ProgressStatus> = {};
      for (const row of progressRows) progressMap[row.scenarioId] = row.status;
      setScenarioProgress(progressMap);

      // Last: this switches the app into the country-selected state.
      setSelectedCountry({
        id: chosenCountry.id,
        code: chosenCountry.code,
        name: chosenCountry.name,
        flagEmoji: chosenCountry.flagEmoji,
      });
    } catch (err) {
      setContinueError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setContinuing(false);
    }
  }

  return (
    <div className="relative flex min-h-full flex-col bg-ground text-ink">
      <PageBackdrop />

      <header className="relative flex items-center justify-between border-b border-line px-5 py-3.5 sm:px-8">
        <Logo />
        <div className="flex items-center gap-3">
          <SettingsMenu />
          <span className="hidden max-w-[12rem] truncate text-xs text-faint sm:block">
            {user?.email}
          </span>
          <button
            onClick={logout}
            className="rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-muted transition hover:bg-surface hover:text-ink"
          >
            {t("nav.signOut")}
          </button>
        </div>
      </header>

      <main className="relative flex flex-1 flex-col items-center px-5 py-14 sm:px-8 sm:py-20">
        <div className="w-full max-w-lg">
          <h1 className="text-center text-3xl font-bold tracking-tight">
            {t("country.heading")}
          </h1>
          <p className="mt-2.5 text-center text-sm text-muted">
            {t("country.intro")}
          </p>

          <label
            className="mb-1.5 mt-8 block text-sm font-medium text-muted"
            htmlFor="country-select"
          >
            {t("country.select")}
          </label>
          <select
            id="country-select"
            value={chosenCountry?.code ?? ""}
            onChange={(e) => {
              const found = countries.find((c) => c.code === e.target.value);
              if (found) setChosenCountry(found);
            }}
            className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-base text-ink focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/40"
          >
            {countries.length === 0 && (
              <option value="">{t("status.loading")}</option>
            )}
            {countries.map((c) => (
              <option key={c.code} value={c.code} className="bg-surface">
                {c.flagEmoji} {c.name}
              </option>
            ))}
          </select>

          <Card className="mt-5 min-h-[120px] px-6 py-5">
            {loadingFacts ? (
              <div className="flex h-20 items-center justify-center">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-line-strong border-t-accent" />
              </div>
            ) : facts ? (
              <div
                className="max-w-none text-sm leading-relaxed text-muted [&_li]:mt-1 [&_p]:mt-0 [&_p+ul]:mt-2 [&_strong]:text-ink [&_ul]:list-disc [&_ul]:pl-5"
                // Sanitised above: allowlisted tags only, every attribute stripped.
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(facts) }}
              />
            ) : (
              <p className="text-sm text-faint">{t("country.noInfo")}</p>
            )}
          </Card>

          {continueError && (
            <div className="mt-4">
              <ErrorNote message={continueError} />
            </div>
          )}

          <button
            onClick={handleContinue}
            disabled={!chosenCountry || continuing}
            className="mt-5 w-full rounded-xl bg-accent px-6 py-3.5 text-base font-semibold text-ink transition hover:bg-accent/85 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {continuing ? t("country.settingUp") : `${t("country.continue")} →`}
          </button>
        </div>
      </main>
    </div>
  );
}

// ── Root: picks the state ────────────────────────────────────────────────────

export default function Home() {
  const user = useUserStore((s) => s.user);
  const selectedCountry = useUserStore((s) => s.selectedCountry);

  if (!user) return <LandingPage />;
  if (!selectedCountry) return <CountrySelect />;
  // Country chosen — the dashboard is the home screen from here on.
  return <Navigate to="/dashboard" replace />;
}
