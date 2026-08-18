import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api, errorMessage } from "../utils/api";
import { useQuizStore } from "../store/quizStore";
import { ErrorBanner, LoadingPanel, Spinner } from "../components/layout";
import {
  BookmarkButton,
  ExplanationPanel,
  ModeBadge,
  OptionButton,
  QuizProgressBar,
  ScenarioImage,
  optionState,
} from "../components/quiz";
import { t } from "../i18n";

export default function Quiz() {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();

  const quiz = useQuizStore((s) => s.quiz);
  const index = useQuizStore((s) => s.index);
  const selections = useQuizStore((s) => s.selections);
  const submitting = useQuizStore((s) => s.submitting);
  const storeError = useQuizStore((s) => s.error);
  const load = useQuizStore((s) => s.load);
  const clear = useQuizStore((s) => s.clear);
  const select = useQuizStore((s) => s.select);
  const next = useQuizStore((s) => s.next);
  const previous = useQuizStore((s) => s.previous);
  const submitAnswer = useQuizStore((s) => s.submitAnswer);
  const toggleBookmark = useQuizStore((s) => s.toggleBookmark);

  const [loadError, setLoadError] = useState<string | null>(null);
  const [finishing, setFinishing] = useState(false);
  const explanationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!quizId) return;
    setLoadError(null);
    api.quizzes
      .detail(quizId)
      .then((detail) => {
        // A quiz that is already graded belongs on the results page.
        if (detail.status === "COMPLETED") {
          navigate(`/results/${detail.id}`, { replace: true });
          return;
        }
        load(detail);
      })
      .catch((err) => setLoadError(errorMessage(err)));

    return clear;
  }, [quizId, load, clear, navigate]);

  const question = quiz?.questions[index];
  const isLast = quiz ? index === quiz.questions.length - 1 : false;
  const revealed = question?.correctOptionId !== null;
  const pending = question ? selections[question.id] : undefined;
  const isPractice = quiz?.mode === "PRACTICE";

  const finish = useCallback(async () => {
    if (!quiz || finishing) return;
    setFinishing(true);
    try {
      await api.quizzes.complete(quiz.id);
      navigate(`/results/${quiz.id}`, { replace: true });
    } catch (err) {
      setLoadError(errorMessage(err));
      setFinishing(false);
    }
  }, [quiz, finishing, navigate]);

  /**
   * The primary button does three different jobs depending on mode and phase,
   * so its label and action are derived in one place rather than scattered
   * through the JSX.
   */
  const advance = useCallback(async () => {
    if (!quiz || !question) return;

    // Practice: commit the answer first so the explanation can be shown.
    if (isPractice && !revealed) {
      if (!pending) return;
      await submitAnswer().catch(() => undefined);
      return;
    }

    // Exam: record silently, then move on.
    if (!isPractice && pending && question.selectedOptionId !== pending) {
      await submitAnswer().catch(() => undefined);
      if (useQuizStore.getState().error) return;
    }

    if (isLast) {
      await finish();
    } else {
      next();
    }
  }, [
    quiz,
    question,
    isPractice,
    revealed,
    pending,
    isLast,
    submitAnswer,
    next,
    finish,
  ]);

  // The explanation appears below the fold on shorter viewports, where the
  // sticky footer would otherwise cover it entirely.
  useEffect(() => {
    if (revealed && explanationRef.current) {
      explanationRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [revealed, question?.id]);

  // Keyboard: 1–4 or A–D pick an option, Enter runs the primary action.
  useEffect(() => {
    if (!question) return;
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA"].includes(target.tagName)) return;

      if (e.key === "Enter") {
        e.preventDefault();
        void advance();
        return;
      }
      if (revealed) return;

      const key = e.key.toUpperCase();
      const byNumber = "1234".indexOf(e.key);
      const byLetter = "ABCD".indexOf(key);
      const position = byNumber !== -1 ? byNumber : byLetter;
      const option = position !== -1 ? question.options[position] : undefined;
      if (option) {
        e.preventDefault();
        select(question.id, option.id);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [question, revealed, advance, select]);

  if (loadError) {
    return (
      <div className="min-h-full bg-slate-950 px-5 py-16">
        <div className="mx-auto max-w-lg space-y-4">
          <ErrorBanner message={loadError} />
          <Link
            to="/"
            className="block text-center text-sm text-blue-400 hover:underline"
          >
            {t("Back to topics")}
          </Link>
        </div>
      </div>
    );
  }

  if (!quiz || !question) {
    return (
      <div className="min-h-full bg-slate-950">
        <LoadingPanel label={t("Loading your questions…")} />
      </div>
    );
  }

  const correctSoFar = quiz.questions.filter(
    (q) => q.isCorrect === true,
  ).length;
  const primaryLabel =
    isPractice && !revealed
      ? t("Check answer")
      : isLast
        ? t("Finish")
        : t("Next question");
  const primaryDisabled = submitting || finishing || (!revealed && !pending);

  return (
    <div className="flex min-h-full flex-col bg-slate-950 text-white">
      <header className="border-b border-slate-800/80 bg-slate-950/85 px-5 py-3.5 backdrop-blur sm:px-8">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <ModeBadge mode={quiz.mode} />
            <span className="truncate text-sm font-medium text-slate-300">
              {quiz.topicName ?? quiz.countryName}
            </span>
          </div>
          <Link
            to="/"
            className="shrink-0 rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            {t("Exit")}
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-5 pb-10 pt-6 sm:px-8 sm:pt-8">
        <QuizProgressBar
          current={index + 1}
          total={quiz.questions.length}
          correctSoFar={correctSoFar}
          showScore={isPractice}
        />

        <article className="mt-6 space-y-5">
          <ScenarioImage src={question.imageUrl} alt={question.imageAlt} />

          <div className="flex items-start justify-between gap-4">
            <h1 className="text-lg font-semibold leading-snug">
              {question.prompt}
            </h1>
            <BookmarkButton
              active={question.isBookmarked}
              onToggle={() => void toggleBookmark(question.id)}
            />
          </div>

          <div className="space-y-2.5">
            {question.options.map((option) => (
              <OptionButton
                key={option.id}
                label={option.label}
                text={option.text}
                state={optionState(question, option.id, pending)}
                disabled={revealed || submitting}
                onClick={() => select(question.id, option.id)}
              />
            ))}
          </div>

          <div ref={explanationRef}>
            {revealed && isPractice && <ExplanationPanel question={question} />}
          </div>
          {storeError && <ErrorBanner message={storeError} />}
        </article>
      </main>

      <footer className="sticky bottom-0 border-t border-slate-800/80 bg-slate-950/90 px-5 py-4 backdrop-blur sm:px-8">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
          <button
            onClick={previous}
            disabled={index === 0}
            className="rounded-xl border border-slate-700 px-4 py-2.5 text-sm text-slate-300 transition hover:bg-slate-800 disabled:invisible"
          >
            {t("Back")}
          </button>

          <span className="hidden text-xs text-slate-600 sm:block">
            {t("Press 1–4 to choose · Enter to continue")}
          </span>

          <button
            onClick={() => void advance()}
            disabled={primaryDisabled}
            className="flex min-w-[9rem] items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {(submitting || finishing) && <Spinner size="sm" />}
            {primaryLabel}
          </button>
        </div>
      </footer>
    </div>
  );
}
