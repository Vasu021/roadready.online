import type { ReactNode } from "react";
import type { QuizQuestion } from "@roadready/shared";

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
  const feedback = revealed && !hideFeedback;
  const answeredCorrectly =
    feedback &&
    selectedOptionId !== null &&
    selectedOptionId === correctOptionId;

  function optionClasses(optionId: string): string {
    const base =
      "group flex w-full items-start gap-3 rounded-xl border px-4 py-3.5 text-left transition duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70";

    if (feedback) {
      if (optionId === correctOptionId) {
        return `${base} border-green-500/60 bg-green-500/10`;
      }
      if (optionId === selectedOptionId) {
        return `${base} border-red-500/60 bg-red-500/10`;
      }
      return `${base} border-white/5 bg-white/[0.02] opacity-55`;
    }

    if (optionId === selectedOptionId) {
      return `${base} border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-600/10`;
    }

    return `${base} border-white/10 bg-white/5 hover:border-white/25 hover:bg-white/[0.08]`;
  }

  function letterClasses(optionId: string): string {
    const base =
      "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-bold";

    if (feedback) {
      if (optionId === correctOptionId)
        return `${base} bg-green-500 text-white`;
      if (optionId === selectedOptionId) return `${base} bg-red-500 text-white`;
      return `${base} bg-white/10 text-gray-500`;
    }
    if (optionId === selectedOptionId) return `${base} bg-blue-500 text-white`;
    return `${base} bg-white/10 text-gray-400 group-hover:bg-white/20 group-hover:text-gray-200`;
  }

  return (
    <div>
      {illustration}

      <h2 className="mt-1 text-lg font-semibold leading-snug text-white sm:text-xl">
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
            <span className="text-sm leading-relaxed text-gray-100">
              {option.optionText}
            </span>
            {feedback && option.id === correctOptionId && (
              <span className="ml-auto mt-0.5 shrink-0 text-green-400">✓</span>
            )}
            {feedback &&
              option.id === selectedOptionId &&
              option.id !== correctOptionId && (
                <span className="ml-auto mt-0.5 shrink-0 text-red-400">✕</span>
              )}
          </button>
        ))}
      </div>

      {feedback && explanation && (
        <div
          className={`mt-5 rounded-xl border px-5 py-4 ${
            answeredCorrectly
              ? "border-green-500/30 bg-green-500/10"
              : "border-red-500/30 bg-red-500/10"
          }`}
        >
          <p
            className={`mb-1.5 text-sm font-semibold ${
              answeredCorrectly ? "text-green-300" : "text-red-300"
            }`}
          >
            {answeredCorrectly ? "Correct" : "Not quite"}
          </p>
          <p className="text-sm leading-relaxed text-gray-300">{explanation}</p>
        </div>
      )}
    </div>
  );
}
