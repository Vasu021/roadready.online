import type { TopicSummary } from "@roadready/shared";
import { t, tn } from "../../i18n";

export function TopicCard({
  topic,
  locked,
  onStart,
}: {
  topic: TopicSummary;
  locked: boolean;
  onStart: () => void;
}) {
  const progress = topic.progress;
  const completed = progress?.status === "COMPLETED";
  const started = progress?.status === "IN_PROGRESS";

  if (locked) {
    return (
      <li className="flex items-center gap-4 rounded-xl border border-slate-800/50 bg-slate-900/25 px-5 py-4 opacity-70">
        <span className="text-2xl grayscale" aria-hidden="true">
          {topic.iconEmoji}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium text-slate-300">{topic.name}</span>
            <span className="rounded bg-amber-900/40 px-1.5 py-0.5 text-[11px] font-semibold text-amber-400">
              {t("Premium")}
            </span>
          </div>
          <p className="mt-0.5 text-sm text-slate-500">{topic.description}</p>
        </div>
        <span aria-hidden="true" className="shrink-0 text-slate-600">
          🔒
        </span>
      </li>
    );
  }

  return (
    <li>
      <button
        onClick={onStart}
        className="flex w-full items-center gap-4 rounded-xl border border-slate-800 bg-slate-900/50 px-5 py-4 text-left transition hover:border-slate-600 hover:bg-slate-900"
      >
        <span className="text-2xl" aria-hidden="true">
          {topic.iconEmoji}
        </span>

        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2">
            <span className="font-medium text-white">{topic.name}</span>
            {completed && (
              <span className="rounded bg-emerald-500/15 px-1.5 py-0.5 text-[11px] font-semibold text-emerald-400">
                {t("Completed")}
              </span>
            )}
            {started && !completed && (
              <span className="rounded bg-slate-700/60 px-1.5 py-0.5 text-[11px] font-semibold text-slate-300">
                {t("In progress")}
              </span>
            )}
          </span>
          <span className="mt-0.5 block text-sm text-slate-400">
            {topic.description}
          </span>
          <span className="mt-1.5 block text-xs text-slate-500">
            {tn(topic.questionCount, "{n} question", "{n} questions")}
            {progress && progress.attemptCount > 0 && (
              <> · {t("best {n}%", { n: progress.bestScorePercent })}</>
            )}
          </span>
        </span>

        <span className="shrink-0 rounded-lg bg-blue-600/15 px-3 py-1.5 text-sm font-medium text-blue-300">
          {progress && progress.attemptCount > 0 ? t("Retry") : t("Start")}
        </span>
      </button>
    </li>
  );
}

export function CountryFacts({ html }: { html: string | null }) {
  if (!html) {
    return (
      <p className="text-sm text-slate-500">
        {t("No information available for this country yet.")}
      </p>
    );
  }
  // Country facts are authored in the seed file, not user input.
  return (
    <div
      className="space-y-3 text-sm leading-relaxed text-slate-300 [&_strong]:font-semibold [&_strong]:text-white"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
