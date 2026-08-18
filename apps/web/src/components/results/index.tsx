import { useState } from "react";
import type { Grade, QuizQuestion } from "@roadready/shared";
import { ScenarioImage } from "../quiz";
import { t } from "../../i18n";

const GRADE_TONE: Record<Grade, string> = {
  A: "text-emerald-400",
  B: "text-emerald-400",
  C: "text-amber-400",
  D: "text-amber-400",
  F: "text-red-400",
};

export function ScoreRing({
  percent,
  passed,
  grade,
}: {
  percent: number;
  passed: boolean | null;
  grade: Grade | null;
}) {
  const radius = 62;
  const circumference = 2 * Math.PI * radius;
  const stroke = passed ? "#10b981" : "#f43f5e";

  return (
    <div className="relative h-40 w-40 shrink-0">
      <svg viewBox="0 0 150 150" className="h-full w-full -rotate-90">
        <circle
          cx="75"
          cy="75"
          r={radius}
          fill="none"
          stroke="#1e293b"
          strokeWidth="11"
        />
        <circle
          cx="75"
          cy="75"
          r={radius}
          fill="none"
          stroke={stroke}
          strokeWidth="11"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - percent / 100)}
          className="transition-[stroke-dashoffset] duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-white">{percent}%</span>
        {grade && (
          <span className={`text-sm font-semibold ${GRADE_TONE[grade]}`}>
            {t("Grade {grade}", { grade })}
          </span>
        )}
      </div>
    </div>
  );
}

export function StatTile({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-3">
      <div className="text-xl font-semibold text-white">{value}</div>
      <div className="mt-0.5 text-xs text-slate-400">{label}</div>
    </div>
  );
}

/** One row of the post-quiz review; the explanation expands on demand. */
export function QuestionReviewRow({
  question,
  index,
}: {
  question: QuizQuestion;
  index: number;
}) {
  const [open, setOpen] = useState(false);
  const chosen = question.options.find(
    (o) => o.id === question.selectedOptionId,
  );
  const answer = question.options.find(
    (o) => o.id === question.correctOptionId,
  );
  // `null` means the question was never answered in this context — a bookmark
  // list, for instance — so it must not be marked as a wrong answer.
  const correct = question.isCorrect;

  return (
    <li className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/40">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-start gap-4 px-4 py-4 text-left transition hover:bg-slate-900"
      >
        <ScenarioImage
          src={question.imageUrl}
          alt={question.imageAlt}
          size="thumb"
        />
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2">
            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded text-[11px] font-bold ${
                correct === null
                  ? "bg-slate-700 text-slate-300"
                  : correct
                    ? "bg-emerald-500 text-white"
                    : "bg-red-500 text-white"
              }`}
              aria-hidden="true"
            >
              {correct === null ? "★" : correct ? "✓" : "✕"}
            </span>
            <span className="text-xs text-slate-500">
              {t("Question {n}", { n: index + 1 })} · {question.topic.name}
            </span>
          </span>
          <span className="mt-1.5 block text-sm leading-snug text-slate-200">
            {question.prompt}
          </span>
        </span>
        <span aria-hidden="true" className="mt-1 shrink-0 text-slate-500">
          {open ? "▴" : "▾"}
        </span>
      </button>

      {open && (
        <div className="space-y-3 border-t border-slate-800 px-4 py-4">
          <div className="grid gap-2 sm:grid-cols-2">
            {correct !== null && (
              <AnswerLine
                label={t("Your answer")}
                text={chosen?.text ?? t("Not answered")}
                tone={correct ? "good" : "bad"}
              />
            )}
            {correct !== true && (
              <AnswerLine
                label={t("Correct answer")}
                text={answer?.text ?? "—"}
                tone="good"
              />
            )}
          </div>
          {question.explanation && (
            <p className="rounded-lg bg-slate-950/60 px-4 py-3 text-sm leading-relaxed text-slate-300">
              {question.explanation}
            </p>
          )}
        </div>
      )}
    </li>
  );
}

function AnswerLine({
  label,
  text,
  tone,
}: {
  label: string;
  text: string;
  tone: "good" | "bad";
}) {
  return (
    <div
      className={`rounded-lg border px-3.5 py-2.5 ${
        tone === "good"
          ? "border-emerald-900/70 bg-emerald-950/25"
          : "border-red-900/70 bg-red-950/25"
      }`}
    >
      <div className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
        {label}
      </div>
      <div className="mt-0.5 text-sm text-slate-200">{text}</div>
    </div>
  );
}
