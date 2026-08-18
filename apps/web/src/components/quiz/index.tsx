import { useState } from "react";
import type { QuizQuestion } from "@roadready/shared";
import { t } from "../../i18n";

/**
 * Renders the scenario illustration for a question.
 *
 * The alt text is content, not decoration — a question that asks "what do you
 * do here?" is unanswerable without it, so a missing image degrades to a
 * labelled placeholder rather than a broken icon.
 */
export function ScenarioImage({
  src,
  alt,
  size = "full",
}: {
  src: string | null;
  alt: string | null;
  size?: "full" | "thumb";
}) {
  const [failed, setFailed] = useState(false);
  const thumb = size === "thumb";
  const frame = thumb
    ? "h-20 w-28 shrink-0 rounded-lg"
    : "w-full rounded-xl p-2 min-h-[180px]";

  if (!src || failed) {
    return (
      <div
        className={`${frame} flex items-center justify-center border border-slate-800 bg-slate-900 text-slate-600`}
      >
        <span className="px-3 text-center text-xs">{alt ?? t("No image")}</span>
      </div>
    );
  }

  return (
    <div
      className={`${frame} flex items-center justify-center overflow-hidden border border-slate-800 bg-slate-900`}
    >
      <img
        src={src}
        alt={alt ?? ""}
        onError={() => setFailed(true)}
        className={
          thumb
            ? "h-full w-full object-cover"
            : "max-h-[200px] w-auto max-w-full rounded-lg object-contain sm:max-h-[300px]"
        }
      />
    </div>
  );
}

export function QuizProgressBar({
  current,
  total,
  correctSoFar,
  showScore,
}: {
  current: number;
  total: number;
  correctSoFar: number;
  showScore: boolean;
}) {
  const percent = Math.round((current / total) * 100);
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between text-xs text-slate-400">
        <span className="font-medium">
          {t("Question {current} of {total}", { current, total })}
        </span>
        {showScore && <span>{t("{n} correct", { n: correctSoFar })}</span>}
      </div>
      <div
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={1}
        aria-valuemax={total}
        className="h-1.5 overflow-hidden rounded-full bg-slate-800"
      >
        <div
          className="h-full rounded-full bg-blue-500 transition-[width] duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

type OptionState = "idle" | "selected" | "correct" | "wrong" | "missed";

const OPTION_STYLES: Record<OptionState, string> = {
  idle: "border-slate-800 bg-slate-900/60 hover:border-slate-600 hover:bg-slate-900",
  selected: "border-blue-500 bg-blue-950/50 ring-1 ring-blue-500/40",
  correct: "border-emerald-600 bg-emerald-950/50",
  wrong: "border-red-600 bg-red-950/40",
  missed: "border-emerald-700/60 bg-emerald-950/25",
};

const BADGE_STYLES: Record<OptionState, string> = {
  idle: "border-slate-700 text-slate-400",
  selected: "border-blue-400 bg-blue-500 text-white",
  correct: "border-emerald-400 bg-emerald-500 text-white",
  wrong: "border-red-400 bg-red-500 text-white",
  missed: "border-emerald-600 text-emerald-400",
};

export function OptionButton({
  label,
  text,
  state,
  disabled,
  onClick,
}: {
  label: string;
  text: string;
  state: OptionState;
  disabled: boolean;
  onClick: () => void;
}) {
  const mark =
    state === "correct" || state === "missed"
      ? "✓"
      : state === "wrong"
        ? "✕"
        : null;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={state === "selected"}
      className={`flex w-full items-start gap-3.5 rounded-xl border px-4 py-3.5 text-left transition disabled:cursor-default ${OPTION_STYLES[state]}`}
    >
      <span
        aria-hidden="true"
        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border text-xs font-bold ${BADGE_STYLES[state]}`}
      >
        {mark ?? label}
      </span>
      <span className="text-sm leading-relaxed text-slate-100">{text}</span>
    </button>
  );
}

/** Decides how each option should look, given what the server has revealed. */
export function optionState(
  question: QuizQuestion,
  optionId: string,
  pendingSelection: string | undefined,
): OptionState {
  const revealed = question.correctOptionId !== null;

  if (!revealed) {
    return pendingSelection === optionId ? "selected" : "idle";
  }
  if (optionId === question.correctOptionId) {
    return question.selectedOptionId === optionId ? "correct" : "missed";
  }
  return question.selectedOptionId === optionId ? "wrong" : "idle";
}

export function ExplanationPanel({ question }: { question: QuizQuestion }) {
  if (!question.explanation) return null;
  const correct = question.isCorrect === true;

  return (
    <div
      className={`rounded-xl border px-5 py-4 ${
        correct
          ? "border-emerald-800/70 bg-emerald-950/30"
          : "border-amber-800/60 bg-amber-950/25"
      }`}
    >
      <p
        className={`mb-1.5 text-sm font-semibold ${
          correct ? "text-emerald-300" : "text-amber-300"
        }`}
      >
        {correct ? t("Correct") : t("Not quite")}
      </p>
      <p className="text-sm leading-relaxed text-slate-300">
        {question.explanation}
      </p>
    </div>
  );
}

export function BookmarkButton({
  active,
  onToggle,
}: {
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={active}
      title={active ? t("Remove bookmark") : t("Save for later")}
      className={`flex shrink-0 items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition ${
        active
          ? "border-amber-600/70 bg-amber-950/40 text-amber-300"
          : "border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-200"
      }`}
    >
      <span aria-hidden="true">{active ? "★" : "☆"}</span>
      {active ? t("Saved") : t("Save")}
    </button>
  );
}

export function ModeBadge({ mode }: { mode: "PRACTICE" | "EXAM" }) {
  return (
    <span
      className={`rounded-md px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${
        mode === "EXAM"
          ? "bg-amber-500/15 text-amber-300"
          : "bg-blue-500/15 text-blue-300"
      }`}
    >
      {mode === "EXAM" ? t("Exam") : t("Practice")}
    </span>
  );
}
