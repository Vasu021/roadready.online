import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import type { QuizQuestion } from "@roadready/shared";
import { api } from "../utils/api";
import type { TestSessionDetail } from "../utils/api";
import { useGameStore } from "../store/gameStore";
import { useUserStore } from "../store/userStore";
import AppShell from "../components/AppShell";
import QuestionCard from "../components/QuestionCard";
import ScenarioIllustration from "../components/ScenarioIllustration";
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

const SOURCE_LABEL: Record<string, string> = {
  topic: "Traffic rules",
  sign: "Sign recognition",
  scenario: "Driving situation",
};

export default function FinalTest() {
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

  /** questionId → selected optionId, kept locally so answers can be revised. */
  const [picked, setPicked] = useState<Record<string, string>>({});
  const [meta, setMeta] = useState({
    total: 30,
    timeLimitSeconds: 45 * 60,
    passPercent: 75,
  });
  const [secondsLeft, setSecondsLeft] = useState(0);

  const submittingRef = useRef(false);

  useEffect(() => () => resetQuiz(), [resetQuiz]);

  const submit = useCallback(async (id: string) => {
    if (submittingRef.current) return;
    submittingRef.current = true;
    setPhase("submitting");
    try {
      await api.testSessions.complete(id);
      const detail = await api.testSessions.get(id);
      setResult(detail);
      setPhase("results");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not submit the test.",
      );
      setPhase("running");
    } finally {
      submittingRef.current = false;
    }
  }, []);

  // Countdown. Running out of time submits whatever has been answered.
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
        setError("There are no questions available for this country yet.");
        setPhase("intro");
        return;
      }

      const session = await api.testSessions.start(code, test.questions.length);

      setMeta({
        total: test.questions.length,
        timeLimitSeconds: test.timeLimitSeconds,
        passPercent: test.passPercent,
      });
      setSecondsLeft(test.timeLimitSeconds);
      setSessionId(session.id);
      startQuiz("final", test.questions, {
        slug: "final-test",
        name: `Final Theory Test — ${test.country.name}`,
      });
      setPhase("running");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not start the test.",
      );
      setPhase("intro");
    }
  }

  async function choose(question: QuizQuestion, optionId: string) {
    if (!sessionId) return;
    setPicked((prev) => ({ ...prev, [question.id]: optionId }));
    try {
      await api.testSessions.answer(sessionId, question.id, optionId);
    } catch {
      // The answer stays selected locally; a later retry or the final submit
      // will surface any real problem.
    }
  }

  const answeredCount = useMemo(
    () => questions.filter((q) => picked[q.id]).length,
    [questions, picked],
  );

  if (!selectedCountry) return <Navigate to="/" replace />;

  // ── Intro ─────────────────────────────────────────────────────────────────
  if (phase === "intro" || phase === "loading") {
    return (
      <AppShell maxWidth="max-w-3xl">
        <Card className="overflow-hidden">
          <div className="border-b border-white/10 bg-gradient-to-r from-amber-400/10 to-transparent px-7 py-8">
            <span className="text-4xl">🎓</span>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Final Theory Test
            </h1>
            <p className="mt-2 text-sm text-gray-400">
              {selectedCountry.flagEmoji} {selectedCountry.name} · mixed
              questions from every topic
            </p>
          </div>

          <div className="px-7 py-7">
            <dl className="grid grid-cols-3 gap-4 text-center">
              {[
                { k: "Questions", v: "30" },
                { k: "Time limit", v: "45 min" },
                { k: "To pass", v: "75%" },
              ].map((item) => (
                <div
                  key={item.k}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-4"
                >
                  <dd className="text-xl font-bold text-white">{item.v}</dd>
                  <dt className="mt-0.5 text-xs uppercase tracking-wider text-gray-500">
                    {item.k}
                  </dt>
                </div>
              ))}
            </dl>

            <ul className="mt-6 space-y-2.5 text-sm text-gray-300">
              {[
                "Sign recognition, traffic rules and driving situations, mixed and shuffled.",
                "No feedback during the test — you see the full breakdown at the end.",
                "You can move back and change an answer while the clock runs.",
                "Grades: A from 90%, B from 75%, C from 60%. B or above passes.",
                "Running out of time submits the answers you have given.",
              ].map((line) => (
                <li key={line} className="flex gap-2.5">
                  <span className="mt-0.5 text-blue-400">•</span>
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
                className="rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-gray-950 transition hover:bg-amber-400 disabled:opacity-60"
              >
                {phase === "loading" ? "Preparing test…" : "Start test"}
              </button>
              <Link
                to="/dashboard"
                className="rounded-lg border border-white/10 px-5 py-2.5 text-sm font-medium text-gray-300 transition hover:bg-white/5"
              >
                Back to dashboard
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
                <span className="text-5xl font-black tracking-tight text-white">
                  {grade}
                </span>
                <Badge tone={GRADE_TONE[grade] ?? "neutral"}>
                  {passed ? "Passed" : "Not passed"}
                </Badge>
              </div>
              <h1 className="mt-2 text-xl font-bold text-white">
                Final Theory Test — {result.country.name}
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-gray-400">
                {passed
                  ? "That is a pass. Keep drilling the topics where you lost marks so the answers stay automatic on test day."
                  : `You needed ${meta.passPercent}% to pass. Work through the explanations below, then run the topics that cost you the most marks.`}
              </p>

              <div className="mt-5 flex flex-wrap justify-center gap-3 sm:justify-start">
                <button
                  onClick={() => {
                    setPhase("intro");
                    setResult(null);
                    setSessionId(null);
                    resetQuiz();
                  }}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
                >
                  Try again
                </button>
                <Link
                  to="/dashboard"
                  className="rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-gray-300 transition hover:bg-white/5"
                >
                  Back to dashboard
                </Link>
              </div>
            </div>
          </Card>

          <section>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-500">
              Question breakdown
            </h2>
            <ol className="space-y-3">
              {result.breakdown.map((row, i) => (
                <Card as="li" key={row.questionId} className="px-5 py-4">
                  <div className="flex items-start gap-3">
                    <span
                      className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-bold ${
                        row.isCorrect
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {row.isCorrect ? "✓" : "✕"}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium leading-snug text-white">
                        <span className="text-gray-500">{i + 1}. </span>
                        {row.questionText}
                      </p>
                      <dl className="mt-2.5 space-y-1 text-sm">
                        <div className="flex gap-2">
                          <dt className="shrink-0 text-gray-500">
                            Your answer:
                          </dt>
                          <dd
                            className={
                              row.isCorrect ? "text-green-300" : "text-red-300"
                            }
                          >
                            {row.selectedOptionText}
                          </dd>
                        </div>
                        {!row.isCorrect && (
                          <div className="flex gap-2">
                            <dt className="shrink-0 text-gray-500">Correct:</dt>
                            <dd className="text-green-300">
                              {row.correctOptionText}
                            </dd>
                          </div>
                        )}
                      </dl>
                      <p className="mt-2.5 border-l-2 border-white/10 pl-3 text-sm leading-relaxed text-gray-400">
                        {row.explanation}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </ol>

            {result.answeredCount < result.maxScore && (
              <p className="mt-4 text-sm text-gray-500">
                {result.maxScore - result.answeredCount} question(s) were left
                unanswered and counted as incorrect.
              </p>
            )}
          </section>
        </div>
      </AppShell>
    );
  }

  // ── Running / submitting ──────────────────────────────────────────────────
  if (phase === "submitting") {
    return (
      <AppShell maxWidth="max-w-3xl" showNav={false}>
        <Spinner label="Grading your test…" />
      </AppShell>
    );
  }

  if (!currentQuestion) {
    return (
      <AppShell maxWidth="max-w-3xl">
        <ErrorNote message="The test could not be loaded." />
      </AppShell>
    );
  }

  const isLast = questionIndex + 1 >= questions.length;
  const lowTime = secondsLeft <= 300;

  return (
    <AppShell maxWidth="max-w-3xl" showNav={false}>
      {/* Exam header */}
      <div className="mb-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-500">
              Final theory test
            </p>
            <p className="mt-1 font-mono text-lg tabular-nums text-white">
              Question {questionIndex + 1}{" "}
              <span className="text-gray-600">/ {questions.length}</span>
            </p>
          </div>
          <div className="text-right">
            <p
              className={`font-mono text-2xl font-bold tabular-nums ${
                lowTime ? "text-red-400" : "text-white"
              }`}
              aria-live="polite"
            >
              {formatClock(secondsLeft)}
            </p>
            <p className="text-xs text-gray-500">
              {answeredCount} of {questions.length} answered
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
        {currentQuestion.source && (
          <Badge tone="info" className="mb-4">
            {SOURCE_LABEL[currentQuestion.source] ?? currentQuestion.source}
          </Badge>
        )}

        <QuestionCard
          question={currentQuestion}
          selectedOptionId={picked[currentQuestion.id] ?? null}
          revealed={false}
          hideFeedback
          onSelect={(optionId) => void choose(currentQuestion, optionId)}
          illustration={
            currentQuestion.imagePrompt ? (
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

        <div className="mt-6 flex items-center justify-between gap-3 border-t border-white/10 pt-5">
          <button
            onClick={() => goToQuestion(questionIndex - 1)}
            disabled={questionIndex === 0}
            className="rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-gray-300 transition hover:bg-white/5 disabled:opacity-30"
          >
            ← Back
          </button>

          {isLast ? (
            <button
              onClick={() => sessionId && void submit(sessionId)}
              className="rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-gray-950 transition hover:bg-amber-400"
            >
              Finish and grade →
            </button>
          ) : (
            <button
              onClick={() => goToQuestion(questionIndex + 1)}
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-500"
            >
              Next →
            </button>
          )}
        </div>
      </Card>

      {/* Question navigator */}
      <div className="mt-5">
        <p className="mb-2 text-xs uppercase tracking-widest text-gray-500">
          Jump to question
        </p>
        <div className="flex flex-wrap gap-1.5">
          {questions.map((q, i) => {
            const answered = Boolean(picked[q.id]);
            const active = i === questionIndex;
            return (
              <button
                key={q.id}
                onClick={() => goToQuestion(i)}
                aria-label={`Question ${i + 1}${answered ? ", answered" : ""}`}
                className={`h-8 w-8 rounded-md text-xs font-medium tabular-nums transition ${
                  active
                    ? "bg-blue-600 text-white"
                    : answered
                      ? "bg-white/15 text-white hover:bg-white/25"
                      : "border border-white/10 text-gray-500 hover:border-white/25 hover:text-gray-300"
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
