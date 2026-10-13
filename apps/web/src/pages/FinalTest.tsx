import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import type { QuizQuestion } from "@roadready/shared";
import { api } from "../utils/api";
import type { TestSessionDetail } from "../utils/api";
import { useGameStore } from "../store/gameStore";
import { useUserStore } from "../store/userStore";
import { useT } from "../i18n";
import AppShell from "../components/AppShell";
import QuestionCard from "../components/QuestionCard";
import SpeakButton from "../components/SpeakButton";
import ScenarioIllustration from "../components/ScenarioIllustration";
import SceneRenderer, { asScene } from "../components/scene/SceneRenderer";
import {
  Badge,
  Card,
  ErrorNote,
  ProgressBar,
  ScoreRing,
  Spinner,
} from "../components/ui";

type Phase = "intro" | "loading" | "running" | "submitting" | "results";

const GRADE_TONE: Record<string, "success" | "info" | "warning" | "danger"> = {
  A: "success",
  B: "success",
  C: "warning",
  F: "danger",
};

function formatClock(seconds: number): string {
  const safe = Math.max(0, seconds);
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function FinalTest() {
  const t = useT();
  const selectedCountry = useUserStore((s) => s.selectedCountry);
  const code = selectedCountry?.code ?? null;

  const startQuiz = useGameStore((s) => s.startQuiz);
  const goToQuestion = useGameStore((s) => s.goToQuestion);
  const resetQuiz = useGameStore((s) => s.resetQuiz);
  const questions = useGameStore((s) => s.questions);
  const currentQuestion = useGameStore((s) => s.currentQuestion);
  const questionIndex = useGameStore((s) => s.questionIndex);

  const [phase, setPhase] = useState<Phase>("intro");
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [result, setResult] = useState<TestSessionDetail | null>(null);
  const [picked, setPicked] = useState<Record<string, string>>({});
  const [meta, setMeta] = useState({
    total: 30,
    timeLimitSeconds: 45 * 60,
    maxErrorPoints: 10,
  });
  const [secondsLeft, setSecondsLeft] = useState(0);

  const submittingRef = useRef(false);

  useEffect(() => () => resetQuiz(), [resetQuiz]);

  const submit = useCallback(
    async (id: string) => {
      if (submittingRef.current) return;
      submittingRef.current = true;
      setPhase("submitting");
      try {
        await api.testSessions.complete(id);
        setResult(await api.testSessions.get(id));
        setPhase("results");
      } catch (err) {
        setError(err instanceof Error ? err.message : t("error.generic"));
        setPhase("running");
      } finally {
        submittingRef.current = false;
      }
    },
    [t],
  );

  // Countdown; running out submits whatever has been answered.
  useEffect(() => {
    if (phase !== "running" || !sessionId) return;

    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          void submit(sessionId);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [phase, sessionId, submit]);

  async function begin() {
    if (!code) return;
    setPhase("loading");
    setError(null);
    setPicked({});
    setResult(null);

    try {
      const test = await api.finalTest.questions(code);
      if (test.questions.length === 0) {
        setError(t("error.loadFailed"));
        setPhase("intro");
        return;
      }

      const session = await api.testSessions.start(code, test.questions.length);

      setMeta({
        total: test.questions.length,
        timeLimitSeconds: test.timeLimitSeconds,
        maxErrorPoints: test.maxErrorPoints,
      });
      setSecondsLeft(test.timeLimitSeconds);
      setSessionId(session.id);
      startQuiz("final", test.questions, {
        slug: "final-test",
        name: `${t("test.heading")} — ${test.country.name}`,
      });
      setPhase("running");
    } catch (err) {
      setError(err instanceof Error ? err.message : t("error.generic"));
      setPhase("intro");
    }
  }

  async function choose(question: QuizQuestion, optionId: string) {
    if (!sessionId) return;
    setPicked((prev) => ({ ...prev, [question.id]: optionId }));
    try {
      await api.testSessions.answer(sessionId, question.id, optionId);
    } catch {
      // The selection stays locally; the final submit surfaces real problems.
    }
  }

  const answeredCount = useMemo(
    () => questions.filter((q) => picked[q.id]).length,
    [questions, picked],
  );

  if (!selectedCountry) return <Navigate to="/" replace />;

  // ── Intro ─────────────────────────────────────────────────────────────────
  if (phase === "intro" || phase === "loading") {
    const rules = [
      t("test.rule1"),
      t("test.rule2"),
      t("test.rule3"),
      t("test.rule4"),
      t("test.rule5"),
      t("test.rule6"),
    ];

    return (
      <AppShell maxWidth="max-w-3xl">
        <Card className="overflow-hidden">
          <div className="border-b border-line bg-gradient-to-r from-premium/10 to-transparent px-7 py-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-4xl">🎓</span>
                <h1 className="mt-3 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                  {t("test.heading")}
                </h1>
                <p className="mt-2 text-sm text-muted">
                  {selectedCountry.flagEmoji} {selectedCountry.name} ·{" "}
                  {t("test.subheading")}
                </p>
              </div>
              <SpeakButton text={[t("test.heading"), ...rules]} />
            </div>
          </div>

          <div className="px-7 py-7">
            <dl className="grid grid-cols-3 gap-4 text-center">
              {[
                { k: t("test.questions"), v: "30" },
                { k: t("test.timeLimit"), v: "45 min" },
                { k: t("test.toPass"), v: "≤ 10" },
              ].map((item) => (
                <div
                  key={item.k}
                  className="rounded-xl border border-line bg-surface px-3 py-4"
                >
                  <dd className="text-xl font-bold text-ink">{item.v}</dd>
                  <dt className="mt-0.5 text-xs uppercase tracking-wider text-faint">
                    {item.k}
                  </dt>
                </div>
              ))}
            </dl>

            <ul className="mt-6 space-y-2.5 text-sm text-muted">
              {rules.map((line) => (
                <li key={line} className="flex gap-2.5">
                  <span className="mt-0.5 text-accent">•</span>
                  <span className="leading-relaxed">{line}</span>
                </li>
              ))}
            </ul>

            {error && (
              <div className="mt-6">
                <ErrorNote message={error} />
              </div>
            )}

            <div className="mt-7 flex flex-wrap gap-3">
              <button
                onClick={begin}
                disabled={phase === "loading"}
                className="rounded-lg bg-premium px-5 py-2.5 text-sm font-semibold text-ground transition hover:opacity-90 disabled:opacity-60"
              >
                {phase === "loading" ? t("test.preparing") : t("test.start")}
              </button>
              <Link
                to="/dashboard"
                className="rounded-lg border border-line px-5 py-2.5 text-sm font-medium text-muted transition hover:bg-surface"
              >
                {t("action.backToDashboard")}
              </Link>
            </div>
          </div>
        </Card>
      </AppShell>
    );
  }

  // ── Results ───────────────────────────────────────────────────────────────
  if (phase === "results" && result) {
    const grade = result.grade ?? "F";
    const passed = Boolean(result.passed);

    return (
      <AppShell maxWidth="max-w-3xl">
        <div className="space-y-6">
          <Card className="flex flex-col items-center gap-6 px-6 py-8 sm:flex-row sm:px-8">
            <ScoreRing
              value={result.totalScore}
              max={result.maxScore}
              passed={passed}
            />
            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center justify-center gap-2 sm:justify-start">
                <span className="text-5xl font-black tracking-tight text-ink">
                  {grade}
                </span>
                <Badge tone={GRADE_TONE[grade] ?? "neutral"}>
                  {passed ? t("status.passed") : t("status.notPassed")}
                </Badge>
              </div>
              <h1 className="mt-2 text-xl font-bold text-ink">
                {t("test.heading")} — {result.country.name}
              </h1>

              <p className="mt-2 text-sm text-muted">
                <span className="font-semibold text-ink">
                  {result.errorPoints}
                </span>{" "}
                / {result.maxErrorPoints ?? meta.maxErrorPoints}{" "}
                {t("test.errorPoints").toLowerCase()}
              </p>

              <p className="mt-2 text-sm leading-relaxed text-muted">
                {passed ? t("test.resultPassed") : t("test.resultFailed")}
              </p>

              {result.failedByFivePointRule && (
                <p className="mt-2 text-sm font-medium text-wrong">
                  {t("test.failedFivePoint")}
                </p>
              )}

              <div className="mt-5 flex flex-wrap justify-center gap-3 sm:justify-start">
                <button
                  onClick={() => {
                    setPhase("intro");
                    setResult(null);
                    setSessionId(null);
                    resetQuiz();
                  }}
                  className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-ink transition hover:opacity-90"
                >
                  {t("action.tryAgain")}
                </button>
                <Link
                  to="/dashboard"
                  className="rounded-lg border border-line px-4 py-2 text-sm font-medium text-muted transition hover:bg-surface"
                >
                  {t("action.backToDashboard")}
                </Link>
              </div>
            </div>
          </Card>

          <section>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-faint">
              {t("practice.breakdown")}
            </h2>
            <ol className="space-y-3">
              {result.breakdown.map((row, i) => (
                <Card as="li" key={row.questionId} className="px-5 py-4">
                  <div className="flex items-start gap-3">
                    <span
                      className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-bold ${
                        row.isCorrect
                          ? "bg-correct/20 text-correct"
                          : "bg-wrong/20 text-wrong"
                      }`}
                    >
                      {row.isCorrect ? "✓" : "✕"}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-sm font-medium leading-snug text-ink">
                          <span className="text-faint">{i + 1}. </span>
                          {row.questionText}
                        </p>
                        {!row.isCorrect && (
                          <span className="shrink-0 rounded bg-wrong/20 px-1.5 py-0.5 text-[11px] font-semibold text-wrong">
                            −{row.errorPoints}
                          </span>
                        )}
                      </div>
                      <dl className="mt-2.5 space-y-1 text-sm">
                        <div className="flex gap-2">
                          <dt className="shrink-0 text-faint">
                            {t("practice.yourAnswer")}
                          </dt>
                          <dd
                            className={
                              row.isCorrect ? "text-correct" : "text-wrong"
                            }
                          >
                            {row.selectedOptionText}
                          </dd>
                        </div>
                        {!row.isCorrect && (
                          <div className="flex gap-2">
                            <dt className="shrink-0 text-faint">
                              {t("practice.correctAnswer")}
                            </dt>
                            <dd className="text-correct">
                              {row.correctOptionText}
                            </dd>
                          </div>
                        )}
                      </dl>
                      <p className="mt-2.5 border-l-2 border-line pl-3 text-sm leading-relaxed text-muted">
                        {row.explanation}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </ol>

            {result.answeredCount < result.maxScore && (
              <p className="mt-4 text-sm text-faint">
                {t("test.unanswered", {
                  count: result.maxScore - result.answeredCount,
                })}
              </p>
            )}
          </section>
        </div>
      </AppShell>
    );
  }

  // ── Running ───────────────────────────────────────────────────────────────
  if (phase === "submitting") {
    return (
      <AppShell maxWidth="max-w-3xl" showNav={false}>
        <Spinner label={t("test.grading")} />
      </AppShell>
    );
  }

  if (!currentQuestion) {
    return (
      <AppShell maxWidth="max-w-3xl">
        <ErrorNote message={t("error.loadFailed")} />
      </AppShell>
    );
  }

  const isLast = questionIndex + 1 >= questions.length;
  const lowTime = secondsLeft <= 300;
  const scene = asScene(currentQuestion.sceneJson);

  return (
    <AppShell maxWidth="max-w-3xl" showNav={false}>
      <div className="mb-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-faint">
              {t("test.heading")}
            </p>
            <p className="mt-1 font-mono text-lg tabular-nums text-ink">
              {t("test.questionNumber", {
                current: questionIndex + 1,
                total: questions.length,
              })}
            </p>
          </div>
          <div className="text-right">
            <p
              className={`font-mono text-2xl font-bold tabular-nums ${
                lowTime ? "text-wrong" : "text-ink"
              }`}
              aria-live="polite"
            >
              {formatClock(secondsLeft)}
            </p>
            <p className="text-xs text-faint">
              {t("test.answeredCount", {
                answered: answeredCount,
                total: questions.length,
              })}
            </p>
          </div>
        </div>
        <ProgressBar
          value={secondsLeft}
          max={meta.timeLimitSeconds}
          tone={lowTime ? "danger" : "info"}
          className="mt-3"
        />
      </div>

      <Card className="px-5 py-6 sm:px-7">
        <div className="mb-4 flex items-center justify-between gap-3">
          {currentQuestion.errorPoints ? (
            <Badge tone={currentQuestion.errorPoints >= 5 ? "danger" : "info"}>
              {currentQuestion.errorPoints} {t("test.errorPoints")}
            </Badge>
          ) : (
            <span />
          )}
          <SpeakButton
            text={[
              currentQuestion.questionText,
              ...currentQuestion.options.map((o) => o.optionText),
            ]}
          />
        </div>

        <QuestionCard
          question={currentQuestion}
          selectedOptionId={picked[currentQuestion.id] ?? null}
          revealed={false}
          hideFeedback
          onSelect={(optionId) => void choose(currentQuestion, optionId)}
          illustration={
            scene ? (
              <div className="mb-5">
                <SceneRenderer
                  scene={scene}
                  width={440}
                  className="mx-auto block"
                />
              </div>
            ) : currentQuestion.imagePrompt ? (
              <div className="mb-5">
                <ScenarioIllustration
                  imagePrompt={currentQuestion.imagePrompt}
                  imageUrl={currentQuestion.imageUrl}
                  compact
                />
              </div>
            ) : undefined
          }
        />

        {error && (
          <div className="mt-5">
            <ErrorNote message={error} />
          </div>
        )}

        <div className="mt-6 flex items-center justify-between gap-3 border-t border-line pt-5">
          <button
            onClick={() => goToQuestion(questionIndex - 1)}
            disabled={questionIndex === 0}
            className="rounded-lg border border-line px-4 py-2 text-sm font-medium text-muted transition hover:bg-surface disabled:opacity-30"
          >
            ← {t("action.back")}
          </button>

          {isLast ? (
            <button
              onClick={() => sessionId && void submit(sessionId)}
              className="rounded-lg bg-premium px-5 py-2.5 text-sm font-semibold text-ground transition hover:opacity-90"
            >
              {t("test.finish")} →
            </button>
          ) : (
            <button
              onClick={() => goToQuestion(questionIndex + 1)}
              className="rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-accent-ink transition hover:opacity-90"
            >
              {t("action.next")} →
            </button>
          )}
        </div>
      </Card>

      <div className="mt-5">
        <p className="mb-2 text-xs uppercase tracking-widest text-faint">
          {t("test.jumpTo")}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {questions.map((q, i) => {
            const answered = Boolean(picked[q.id]);
            const active = i === questionIndex;
            return (
              <button
                key={q.id}
                onClick={() => goToQuestion(i)}
                aria-label={`${i + 1}`}
                className={`h-8 w-8 rounded-md text-xs font-medium tabular-nums transition ${
                  active
                    ? "bg-accent text-accent-ink"
                    : answered
                      ? "bg-line-strong text-ink"
                      : "border border-line text-faint hover:border-line-strong hover:text-muted"
                }`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
