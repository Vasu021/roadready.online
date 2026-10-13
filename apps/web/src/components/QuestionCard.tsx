import type { ReactNode } from "react";
import type { QuizQuestion } from "@roadready/shared";
import { useT } from "../i18n";

const LETTERS = ["A", "B", "C", "D", "E", "F"];

export interface QuestionCardProps {
  question: QuizQuestion;
  selectedOptionId: string | null;
  /** Set once the answer has been revealed. */
  correctOptionId?: string | null;
  revealed: boolean;
  onSelect: (optionId: string) => void;
  explanation?: string;
  /** Optional illustration shown above the question text. */
  illustration?: ReactNode;
  /** Hides the correct/incorrect colouring (used by the timed final test). */
  hideFeedback?: boolean;
}

export default function QuestionCard({
  question,
  selectedOptionId,
  correctOptionId,
  revealed,
  onSelect,
  explanation,
  illustration,
  hideFeedback = false,
}: QuestionCardProps) {
  const t = useT();
  const feedback = revealed && !hideFeedback;
  const answeredCorrectly =
    feedback &&
    selectedOptionId !== null &&
    selectedOptionId === correctOptionId;

  function optionClasses(optionId: string): string {
    const base =
      "group flex w-full items-start gap-3 rounded-xl border px-4 py-3.5 text-left transition duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/70";

    if (feedback) {
      if (optionId === correctOptionId) {
        return `${base} border-correct/60 bg-correct/10`;
      }
      if (optionId === selectedOptionId) {
        return `${base} border-wrong/60 bg-wrong/10`;
      }
      return `${base} border-line/60 bg-surface/40 opacity-55`;
    }

    if (optionId === selectedOptionId) {
      return `${base} border-accent bg-accent/10 shadow-lg shadow-accent/10`;
    }

    return `${base} border-line bg-surface hover:border-line-strong hover:bg-raised`;
  }

  function letterClasses(optionId: string): string {
    const base =
      "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-bold";

    if (feedback) {
      if (optionId === correctOptionId) return `${base} bg-correct text-ink`;
      if (optionId === selectedOptionId) return `${base} bg-wrong text-ink`;
      return `${base} bg-raised text-faint`;
    }
    if (optionId === selectedOptionId) return `${base} bg-accent text-ink`;
    return `${base} bg-raised text-muted group-hover:bg-line-strong group-hover:text-muted`;
  }

  return (
    <div>
      {illustration}

      <h2 className="mt-1 text-lg font-semibold leading-snug text-ink sm:text-xl">
        {question.questionText}
      </h2>

      <div className="mt-5 space-y-2.5">
        {question.options.map((option, i) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onSelect(option.id)}
            disabled={revealed}
            aria-pressed={selectedOptionId === option.id}
            className={optionClasses(option.id)}
          >
            <span className={letterClasses(option.id)}>{LETTERS[i]}</span>
            <span className="text-sm leading-relaxed text-ink">
              {option.optionText}
            </span>
            {feedback && option.id === correctOptionId && (
              <span className="ml-auto mt-0.5 shrink-0 text-correct">✓</span>
            )}
            {feedback &&
              option.id === selectedOptionId &&
              option.id !== correctOptionId && (
                <span className="ml-auto mt-0.5 shrink-0 text-wrong">✕</span>
              )}
          </button>
        ))}
      </div>

      {feedback && explanation && (
        <div
          className={`mt-5 rounded-xl border px-5 py-4 ${
            answeredCorrectly
              ? "border-correct/30 bg-correct/10"
              : "border-wrong/30 bg-wrong/10"
          }`}
        >
          <p
            className={`mb-1.5 text-sm font-semibold ${
              answeredCorrectly ? "text-correct" : "text-wrong"
            }`}
          >
            {answeredCorrectly ? t("status.correct") : t("status.incorrect")}
          </p>
          <p className="text-sm leading-relaxed text-muted">{explanation}</p>
        </div>
      )}
    </div>
  );
}
