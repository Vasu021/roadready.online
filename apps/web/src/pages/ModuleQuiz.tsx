import { useCallback, useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import type { QuestionAnswerKey } from "@roadready/shared";
import { api } from "../utils/api";
import { useGameStore } from "../store/gameStore";
import { useUserStore } from "../store/userStore";
import { useT } from "../i18n";
import AppShell from "../components/AppShell";
import QuestionCard from "../components/QuestionCard";
import ResultsScreen from "../components/ResultsScreen";
import SpeakButton from "../components/SpeakButton";
import { Card, ErrorNote, ProgressBar, Spinner } from "../components/ui";

const PASS_RATIO = 0.75;

/**
 * The "check yourself" step at the end of a learning module, drawing on that
 * module's own question pool rather than the topic tests.
 */
export default function ModuleQuiz() {
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

  const [answerKey, setAnswerKey] = useState<Map<string, QuestionAnswerKey>>(
    new Map(),
  );
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!code || !slug) return;
    let cancelled = false;

    setLoading(true);
    setError(null);

    Promise.all([
      api.modules.questions(code, slug),
      api.modules.answers(code, slug),
    ])
      .then(([{ module: mod, questions: rows }, keys]) => {
        if (cancelled) return;
        setAnswerKey(new Map(keys.map((k) => [k.questionId, k])));
        startQuiz("topic", rows, { slug: mod.slug, name: mod.title });
        setSelected(null);
        setRevealed(false);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : t("error.loadFailed"));
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [code, slug, startQuiz, reloadKey, t]);

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

  // Same keyboard contract as the topic quiz: A–D to pick, Enter to advance.
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
          to={`/learn/${slug}`}
          className="mt-5 inline-block text-sm text-accent hover:underline"
        >
          ← {t("learn.backToModules")}
        </Link>
      </AppShell>
    );
  }

  if (quizPhase === "completed") {
    return (
      <AppShell maxWidth="max-w-3xl">
        <ResultsScreen
          title={activeQuiz?.name ?? t("learn.testYourself")}
          passRatio={PASS_RATIO}
          questions={questions}
          answers={answers}
          answerKey={answerKey}
          onRetry={() => setReloadKey((k) => k + 1)}
          backTo={`/learn/${slug}`}
          backLabel={t("learn.backToModules")}
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
      <div className="mb-5">
        <div className="flex items-end justify-between gap-4">
          <div className="min-w-0">
            <Link
              to={`/learn/${slug}`}
              className="text-xs text-faint transition hover:text-muted"
            >
              ← {t("learn.backToModules")}
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
              className="ml-auto rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-accent-ink transition hover:opacity-90"
            >
              {questionIndex + 1 >= totalQuestions
                ? `${t("action.seeResults")} →`
                : `${t("action.next")} →`}
            </button>
          ) : (
            <button
              onClick={confirm}
              disabled={!selected}
              className="ml-auto rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-accent-ink transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {t("action.confirm")}
            </button>
          )}
        </div>
      </Card>
    </AppShell>
  );
}
