import { useCallback, useEffect, useRef, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import type { QuestionAnswerKey } from "@roadready/shared";
import { api } from "../utils/api";
import { useGameStore } from "../store/gameStore";
import { useUserStore } from "../store/userStore";
import AppShell from "../components/AppShell";
import QuestionCard from "../components/QuestionCard";
import ResultsScreen from "../components/ResultsScreen";
import SpeakButton from "../components/SpeakButton";
import { Card, ErrorNote, ProgressBar, Spinner } from "../components/ui";
import { useT } from "../i18n";

const PASS_RATIO = 0.75;

export default function TopicQuiz() {
  const { slug = "" } = useParams();
  const t = useT();
  const selectedCountry = useUserStore((s) => s.selectedCountry);
  const code = selectedCountry?.code ?? null;

  const startQuiz = useGameStore((s) => s.startQuiz);
  const answerQuestion = useGameStore((s) => s.answerQuestion);
  const nextQuestion = useGameStore((s) => s.nextQuestion);
  const resetQuiz = useGameStore((s) => s.resetQuiz);
  const quizPhase = useGameStore((s) => s.quizPhase);
  const questions = useGameStore((s) => s.questions);
  const currentQuestion = useGameStore((s) => s.currentQuestion);
  const questionIndex = useGameStore((s) => s.questionIndex);
  const totalQuestions = useGameStore((s) => s.totalQuestions);
  const answers = useGameStore((s) => s.answers);
  const activeQuiz = useGameStore((s) => s.activeQuiz);
  const startedAt = useGameStore((s) => s.startedAt);

  const [answerKey, setAnswerKey] = useState<Map<string, QuestionAnswerKey>>(
    new Map(),
  );
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const savedRef = useRef(false);

  // Load the topic's questions and its answer key together.
  useEffect(() => {
    if (!code || !slug) return;
    let cancelled = false;

    setLoading(true);
    setError(null);
    savedRef.current = false;

    Promise.all([
      api.topicTests.questions(code, slug),
      api.topicTests.answers(code, slug),
    ])
      .then(([{ topic, questions: rows }, keys]) => {
        if (cancelled) return;
        setAnswerKey(new Map(keys.map((k) => [k.questionId, k])));
        startQuiz("topic", rows, { slug: topic.slug, name: topic.nameEN });
        setSelected(null);
        setRevealed(false);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(
          err instanceof Error ? err.message : "Could not load this topic.",
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [code, slug, startQuiz, reloadKey]);

  // Leaving the page should not leave a half-finished run in the store.
  useEffect(() => () => resetQuiz(), [resetQuiz]);

  const confirm = useCallback(() => {
    if (!currentQuestion || !selected || revealed) return;
    const key = answerKey.get(currentQuestion.id);
    answerQuestion(selected, key?.correctOptionId === selected);
    setRevealed(true);
  }, [currentQuestion, selected, revealed, answerKey, answerQuestion]);

  const advance = useCallback(() => {
    setSelected(null);
    setRevealed(false);
    nextQuestion();
  }, [nextQuestion]);

  // Keyboard: A–D or 1–4 to pick, Enter to confirm, then Enter to continue.
  useEffect(() => {
    if (quizPhase !== "running" || !currentQuestion) return;

    const question = currentQuestion;

    function onKey(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      if (e.key === "Enter") {
        e.preventDefault();
        if (revealed) advance();
        else confirm();
        return;
      }

      const byNumber = Number(e.key);
      const index = Number.isInteger(byNumber)
        ? byNumber - 1
        : "abcd".indexOf(e.key.toLowerCase());

      if (index >= 0 && index < question.options.length) {
        e.preventDefault();
        if (!revealed) setSelected(question.options[index].id);
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [quizPhase, currentQuestion, revealed, confirm, advance]);

  // Record the finished run once.
  useEffect(() => {
    if (quizPhase !== "completed" || savedRef.current || !code || !slug) return;
    if (questions.length === 0) return;

    savedRef.current = true;
    const score = answers.filter((a) => a.isCorrect).length;

    api.topicTests
      .saveAttempt({
        topicSlug: slug,
        countryCode: code,
        score,
        totalQuestions: questions.length,
        passed: score / questions.length >= PASS_RATIO,
        timeSeconds: startedAt
          ? Math.round((Date.now() - startedAt) / 1000)
          : 0,
      })
      .catch(() => {
        // A failed save must not block the results screen — the user still
        // sees the score for this run.
      });
  }, [quizPhase, code, slug, answers, questions.length, startedAt]);

  if (!selectedCountry) return <Navigate to="/" replace />;

  if (loading) {
    return (
      <AppShell maxWidth="max-w-3xl">
        <Spinner label={t("status.loading")} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell maxWidth="max-w-3xl">
        <ErrorNote message={error} onRetry={() => setReloadKey((k) => k + 1)} />
        <Link
          to="/practice"
          className="mt-5 inline-block text-sm text-accent hover:underline"
        >
          ← {t("practice.backToTopics")}
        </Link>
      </AppShell>
    );
  }

  if (quizPhase === "completed") {
    return (
      <AppShell maxWidth="max-w-3xl">
        <ResultsScreen
          title={activeQuiz?.name ?? "Topic practice"}
          passRatio={PASS_RATIO}
          questions={questions}
          answers={answers}
          answerKey={answerKey}
          onRetry={() => {
            savedRef.current = false;
            setReloadKey((k) => k + 1);
          }}
          backTo="/practice"
          backLabel={t("practice.backToTopics")}
        />
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

  const key = answerKey.get(currentQuestion.id);
  const score = answers.filter((a) => a.isCorrect).length;

  return (
    <AppShell maxWidth="max-w-3xl">
      {/* Run header */}
      <div className="mb-5">
        <div className="flex items-end justify-between gap-4">
          <div className="min-w-0">
            <Link
              to="/practice"
              className="text-xs text-faint transition hover:text-muted"
            >
              ← {t("practice.backToTopics")}
            </Link>
            <h1 className="mt-1 truncate text-xl font-bold tracking-tight text-ink">
              {activeQuiz?.name}
            </h1>
          </div>
          <div className="shrink-0 text-right">
            <p className="font-mono text-sm tabular-nums text-muted">
              {questionIndex + 1}{" "}
              <span className="text-faint">/ {totalQuestions}</span>
            </p>
            <p className="text-xs text-faint">
              {t("practice.correctCount", { count: score })}
            </p>
          </div>
        </div>
        <ProgressBar
          value={questionIndex + (revealed ? 1 : 0)}
          max={totalQuestions}
          className="mt-3"
        />
      </div>

      <Card className="px-5 py-6 sm:px-7">
        <div className="mb-3 flex justify-end">
          <SpeakButton
            text={[
              currentQuestion.questionText,
              ...currentQuestion.options.map((o) => o.optionText),
              ...(revealed && key?.explanation ? [key.explanation] : []),
            ]}
          />
        </div>

        <QuestionCard
          question={currentQuestion}
          selectedOptionId={selected}
          correctOptionId={key?.correctOptionId ?? null}
          revealed={revealed}
          onSelect={setSelected}
          explanation={key?.explanation}
        />

        <div className="mt-6 flex items-center justify-between gap-4 border-t border-line pt-5">
          <p className="hidden text-xs text-faint sm:block">
            {t("practice.keyHint", {
              action: revealed ? t("action.continue") : t("action.confirm"),
            })}
          </p>

          {revealed ? (
            <button
              onClick={advance}
              className="ml-auto rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-ink transition hover:bg-accent/85"
            >
              {questionIndex + 1 >= totalQuestions
                ? `${t("action.seeResults")} →`
                : `${t("action.next")} →`}
            </button>
          ) : (
            <button
              onClick={confirm}
              disabled={!selected}
              className="ml-auto rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-ink transition hover:bg-accent/85 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {t("action.confirm")}
            </button>
          )}
        </div>
      </Card>
    </AppShell>
  );
}
