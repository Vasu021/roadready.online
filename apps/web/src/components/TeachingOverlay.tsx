import { useGameStore } from "../store/gameStore";
import { t } from "../utils/i18n";

/**
 * PRACTICE-mode teaching panel. The car pauses at a decision point, this panel
 * explains the situation + the rule, and on Continue the objective completes and
 * the car performs the correct action automatically. No keyboard required.
 */
export default function TeachingOverlay() {
  const activeTeaching = useGameStore((s) => s.activeTeaching);
  const resolveTeaching = useGameStore((s) => s.resolveTeaching);

  if (!activeTeaching) return null;

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center px-4">
      <div className="pointer-events-auto w-full max-w-lg rounded-2xl border border-blue-500/40 bg-slate-900/95 p-6 shadow-2xl">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-blue-300">
          {t("Learn")}
        </p>
        <h2 className="mb-3 text-lg font-bold text-white">
          {activeTeaching.prompt}
        </h2>
        <p className="mb-5 text-sm leading-relaxed text-gray-200">
          {activeTeaching.teaching}
        </p>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={resolveTeaching}
            className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            {t("Continue →")}
          </button>
        </div>
      </div>
    </div>
  );
}
