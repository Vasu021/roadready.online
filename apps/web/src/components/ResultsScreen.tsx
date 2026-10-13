import { Link } from "react-router-dom";
import type { QuizAnswer, QuizQuestion } from "@roadready/shared";
import type { QuestionAnswerKey } from "@roadready/shared";
import { Card, ScoreRing } from "./ui";
import { useT } from "../i18n";

export interface ResultsScreenProps {
  title: string;
  /** Pass mark as a ratio, e.g. 0.75. */
  passRatio?: number;
  questions: QuizQuestion[];
  answers: QuizAnswer[];
  answerKey: Map<string, QuestionAnswerKey>;
  onRetry: () => void;
  backTo: string;
  backLabel: string;
}

/**
 * Shared result screen for topic practice and scenario practice: score ring,
 * a short verdict, and a per-question breakdown with explanations.
 */
export default function ResultsScreen({
  title,
  passRatio = 0.75,
  questions,
  answers,
  answerKey,
  onRetry,
  backTo,
  backLabel,
}: ResultsScreenProps) {
  const t = useT();
  const score = answers.filter((a) => a.isCorrect).length;
  const total = questions.length;
  const ratio = total > 0 ? score / total : 0;
  const passed = ratio >= passRatio;

  const verdict = passed
    ? ratio === 1
      ? "Perfect run — every answer correct."
      : "Solid work. You are above the pass mark for this topic."
    : "Below the pass mark. Review the explanations and run it again — repetition is what makes these automatic.";

  const answerFor = (questionId: string) =>
    answers.find((a) => a.questionId === questionId);

  return (
    <div className="space-y-6">
      <Card className="flex flex-col items-center gap-6 px-6 py-8 sm:flex-row sm:px-8">
        <ScoreRing value={score} max={total} passed={passed} />
        <div className="min-w-0 flex-1 text-center sm:text-left">
          <p
            className={`text-xs font-semibold uppercase tracking-widest ${
              passed ? "text-correct" : "text-wrong"
            }`}
          >
            {passed ? t("status.passed") : t("status.notPassed")}
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-ink">
            {title}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted">{verdict}</p>

          <div className="mt-5 flex flex-wrap justify-center gap-3 sm:justify-start">
            <button
              onClick={onRetry}
              className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-ink transition hover:bg-accent/85"
            >
              {t("action.retry")}
            </button>
            <Link
              to={backTo}
              className="rounded-lg border border-line px-4 py-2 text-sm font-medium text-muted transition hover:bg-surface hover:text-ink"
            >
              {backLabel}
            </Link>
          </div>
        </div>
      </Card>

      <section>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-faint">
          {t("practice.breakdown")}
        </h2>
        <ol className="space-y-3">
          {questions.map((q, i) => {
            const given = answerFor(q.id);
            const key = answerKey.get(q.id);
            const correct = given?.isCorrect ?? false;
            const chosen = q.options.find(
              (o) => o.id === given?.selectedOptionId,
            );
            const right = q.options.find((o) => o.id === key?.correctOptionId);

            return (
              <Card as="li" key={q.id} className="px-5 py-4">
                <div className="flex items-start gap-3">
                  <span
                    className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-bold ${
                      correct
                        ? "bg-correct/20 text-correct"
                        : "bg-wrong/20 text-wrong"
                    }`}
                  >
                    {correct ? "✓" : "✕"}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium leading-snug text-ink">
                      <span className="text-faint">{i + 1}. </span>
                      {q.questionText}
                    </p>

                    <dl className="mt-2.5 space-y-1 text-sm">
                      <div className="flex gap-2">
                        <dt className="shrink-0 text-faint">
                          {t("practice.yourAnswer")}
                        </dt>
                        <dd className={correct ? "text-correct" : "text-wrong"}>
                          {chosen?.optionText ?? t("practice.notAnswered")}
                        </dd>
                      </div>
                      {!correct && right && (
                        <div className="flex gap-2">
                          <dt className="shrink-0 text-faint">
                            {t("practice.correctAnswer")}
                          </dt>
                          <dd className="text-correct">{right.optionText}</dd>
                        </div>
                      )}
                    </dl>

                    {key?.explanation && (
                      <p className="mt-2.5 border-l-2 border-line pl-3 text-sm leading-relaxed text-muted">
                        {key.explanation}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </ol>
      </section>
    </div>
  );
}
