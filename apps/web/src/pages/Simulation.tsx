import { useEffect, useRef, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useGameStore } from "../store/gameStore";
import type { AttemptMode, McqQuestion } from "../store/gameStore";
import { useUserStore } from "../store/userStore";
import SimulationScene from "../simulation/scene";
import ScenarioHUD from "../components/ScenarioHUD";
import ResultsScreen from "../components/ResultsScreen";
import ScenarioTestResults from "../components/ScenarioTestResults";
import TestResultsScreen from "../components/TestResultsScreen";
import ChallengeOverlay from "../components/ChallengeOverlay";
import MCQOverlay from "../components/MCQOverlay";
import TeachingOverlay from "../components/TeachingOverlay";
import { getScenario } from "../simulation/scenarios";
import { FT_SCENE_SLUGS } from "../simulation/scenarios/fullTestGermany";
import { useScenarioQuestions } from "../hooks/useScenarioQuestions";
import { api } from "../utils/api";
import { t } from "../utils/i18n";

// The graded Full Test is scene-based: one question per scene, in scene order
// (see fullTestGermany.ts). maxScore is the number of scenes so the grade is out
// of what's actually asked.
const FULL_TEST_COUNTRY = "DE";

export default function Simulation() {
  const { scenarioId } = useParams<{ scenarioId: string }>();
  const [searchParams] = useSearchParams();
  const carState = useGameStore((s) => s.carState);
  const isPaused = useGameStore((s) => s.isPaused);
  const setPaused = useGameStore((s) => s.setPaused);
  const startScenario = useGameStore((s) => s.startScenario);
  const setDriveMode = useGameStore((s) => s.setDriveMode);
  const setAttemptMode = useGameStore((s) => s.setAttemptMode);
  const resetScenario = useGameStore((s) => s.resetScenario);
  const setFtSession = useGameStore((s) => s.setFtSession);
  const user = useUserStore((s) => s.user);

  const def = scenarioId ? getScenario(scenarioId) : undefined;
  const isFullTest = def?.fullTest ?? false;

  // ?mode=test launches the scored MCQ flow; anything else defaults to practice.
  const attemptMode: AttemptMode =
    searchParams.get("mode") === "test" ? "test" : "practice";

  // Per-scenario bank (with answers, client-scored). Skipped for the Full Test,
  // which fetches its own cross-scenario bank below.
  const { questions: scenarioQuestions } = useScenarioQuestions(
    isFullTest ? undefined : scenarioId,
  );

  // ── Full Test state ─────────────────────────────────────────────────────────
  const [ftQuestions, setFtQuestions] = useState<McqQuestion[]>([]);
  const [reinit, setReinit] = useState(0); // bumped on Retake to re-run setup
  const ftInitRef = useRef(-1);

  // Load scenario config + drive/attempt mode into the store on mount.
  useEffect(() => {
    if (!scenarioId || !def) return;
    setAttemptMode(attemptMode);
    startScenario(def.config);
    setDriveMode(def.driveMode ?? "manual");
  }, [
    scenarioId,
    attemptMode,
    def,
    startScenario,
    setDriveMode,
    setAttemptMode,
  ]);

  // Full Test setup: sample questions across scenarios + open a server-scored
  // TestSession. Re-runs on Retake (reinit). The ref guard stops the runId-driven
  // re-render (from startScenario) from creating a second session.
  useEffect(() => {
    if (!isFullTest || !user) return;
    if (ftInitRef.current === reinit) return;
    ftInitRef.current = reinit;

    let cancelled = false;
    setFtSession(null);
    setFtQuestions([]);
    (async () => {
      try {
        const countries = await api.countries.list();
        const country = countries.find((c) => c.code === FULL_TEST_COUNTRY);
        if (cancelled || !country) return;

        // One question per scene, fetched in scene order. `order` is the scene
        // index (NOT compacted) so TriggerWatcher can match each scene to its
        // question even if a scene's bank happens to be empty.
        const banks = await Promise.all(
          FT_SCENE_SLUGS.map((slug) =>
            api.scenarios.getQuestions(slug).catch(() => []),
          ),
        );
        if (cancelled) return;

        const built: McqQuestion[] = [];
        banks.forEach((bank, i) => {
          const q = bank[0];
          if (!q) return;
          built.push({
            id: q.id,
            questionText: q.questionText,
            order: i,
            options: q.options.map((o) => ({ id: o.id, text: o.optionText })),
          });
        });
        if (cancelled || built.length === 0) return;

        const session = await api.testSessions.create({
          countryId: country.id,
          maxScore: built.length,
        });
        if (cancelled) return;
        setFtQuestions(built);
        setFtSession(session.id);
      } catch (err) {
        console.error("Failed to start full test:", err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isFullTest, user, reinit, setFtSession]);

  function handleRetake() {
    setReinit((n) => n + 1); // re-run full-test setup (new session + questions)
    resetScenario(); // re-arm the route, car and checkpoints
  }

  const questions = isFullTest ? ftQuestions : scenarioQuestions;

  return (
    <div className="relative h-full w-full overflow-hidden bg-gray-900">
      <SimulationScene
        scenarioId={scenarioId}
        questions={questions}
        fullTest={isFullTest}
      />

      {/* Objectives + timer */}
      <ScenarioHUD />

      {/* Results — graded session for the Full Test, scored recap for a per-
          scenario test, pass/fail for practice. */}
      {isFullTest ? (
        <TestResultsScreen onRetake={handleRetake} />
      ) : attemptMode === "test" ? (
        <ScenarioTestResults />
      ) : (
        <ResultsScreen />
      )}

      {/* Decision overlays — only one is active at a time (store-driven) */}
      <ChallengeOverlay />
      <TeachingOverlay />
      <MCQOverlay />

      {/* Full Test needs a signed-in user for the server-scored session */}
      {isFullTest && !user && (
        <div className="absolute inset-x-0 top-1/2 mx-auto w-fit -translate-y-1/2 rounded-xl bg-black/70 px-6 py-4 text-center text-sm text-white backdrop-blur">
          {t("Please sign in to take the graded test.")}
        </div>
      )}

      {/* Top-left controls */}
      <div className="absolute left-4 top-4 flex items-center gap-2">
        <Link
          to="/"
          className="rounded bg-black/50 px-3 py-1.5 text-sm font-medium text-white backdrop-blur transition hover:bg-black/70"
        >
          {t("← Exit")}
        </Link>
        <button
          onClick={() => setPaused(!isPaused)}
          className="rounded bg-black/50 px-3 py-1.5 text-sm font-medium text-white backdrop-blur transition hover:bg-black/70"
        >
          {isPaused ? t("Resume") : t("Pause")}
        </button>
      </div>

      {/* Speed — bottom centre */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
        <div className="rounded-xl bg-black/50 px-6 py-3 text-center backdrop-blur">
          <span className="font-mono text-3xl font-bold text-white">
            {carState?.velocity ?? 0}
          </span>
          <span className="ml-1 text-sm text-gray-400">km/h</span>
        </div>
      </div>

      {/* Controls hint — bottom right (hidden on small screens) */}
      <div className="absolute bottom-6 right-4 hidden rounded-xl bg-black/50 px-4 py-3 text-xs text-gray-400 backdrop-blur sm:block">
        <p>W / ↑ &nbsp; Accelerate</p>
        <p>S / ↓ &nbsp; Brake</p>
        <p>A D / ← → &nbsp; Steer</p>
        <p>Space &nbsp; Handbrake</p>
        <p>R &nbsp; Reset</p>
      </div>
    </div>
  );
}
