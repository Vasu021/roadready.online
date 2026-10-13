import { useEffect, useRef } from "react";
import type { SignMeta } from "./signs";
import { CATEGORY_LABELS } from "./signs";
import { Badge } from "./ui";

/** Full detail for one sign: large rendering, both names, meaning and action. */
export default function SignDetailModal({
  sign,
  onClose,
  onPrev,
  onNext,
}: {
  sign: SignMeta;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
}) {
  const Sign = sign.component;
  const closeRef = useRef<HTMLButtonElement>(null);

  // Escape closes; arrows step through the filtered list.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev?.();
      if (e.key === "ArrowRight") onNext?.();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onPrev, onNext]);

  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${sign.nameDE} — ${sign.nameEN}`}
    >
      <div
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-2xl border border-white/10 bg-gray-950 shadow-2xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-white/10 px-6 py-4">
          <div className="min-w-0">
            <Badge tone="info">{CATEGORY_LABELS[sign.category]}</Badge>
            <h2 className="mt-2 text-lg font-bold leading-tight text-white">
              {sign.nameDE}
            </h2>
            <p className="text-sm text-gray-400">{sign.nameEN}</p>
          </div>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 rounded-lg border border-white/10 px-2.5 py-1 text-sm text-gray-400 transition hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70"
          >
            ✕
          </button>
        </div>

        <div className="flex items-center justify-center bg-gradient-to-b from-white/[0.06] to-transparent px-6 py-8">
          <Sign size={168} />
        </div>

        <div className="space-y-5 px-6 pb-6">
          <section>
            <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-gray-500">
              What it means
            </h3>
            <p className="text-sm leading-relaxed text-gray-300">
              {sign.description}
            </p>
          </section>

          <section>
            <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-gray-500">
              What to do
            </h3>
            <p className="text-sm leading-relaxed text-gray-300">
              {sign.explanation}
            </p>
          </section>

          {sign.legalBasis && (
            <section className="rounded-lg border border-white/10 bg-white/5 px-4 py-3">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                Legal basis
              </h3>
              <p className="mt-1 font-mono text-sm text-gray-300">
                {sign.legalBasis}
              </p>
            </section>
          )}

          {(onPrev || onNext) && (
            <div className="flex gap-3 pt-1">
              <button
                onClick={onPrev}
                disabled={!onPrev}
                className="flex-1 rounded-lg border border-white/10 py-2 text-sm font-medium text-gray-300 transition hover:bg-white/5 disabled:opacity-40"
              >
                ← Previous
              </button>
              <button
                onClick={onNext}
                disabled={!onNext}
                className="flex-1 rounded-lg border border-white/10 py-2 text-sm font-medium text-gray-300 transition hover:bg-white/5 disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
