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
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${sign.nameDE} — ${sign.nameEN}`}
    >
      <div
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-2xl border border-line bg-ground shadow-2xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-4">
          <div className="min-w-0">
            <Badge tone="info">{CATEGORY_LABELS[sign.category]}</Badge>
            <h2 className="mt-2 text-lg font-bold leading-tight text-ink">
              {sign.nameDE}
            </h2>
            <p className="text-sm text-muted">{sign.nameEN}</p>
          </div>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 rounded-lg border border-line px-2.5 py-1 text-sm text-muted transition hover:bg-raised hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
          >
            ✕
          </button>
        </div>

        <div className="flex items-center justify-center bg-gradient-to-b from-raised to-transparent px-6 py-8">
          <Sign size={168} />
        </div>

        <div className="space-y-5 px-6 pb-6">
          <section>
            <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-faint">
              What it means
            </h3>
            <p className="text-sm leading-relaxed text-muted">
              {sign.description}
            </p>
          </section>

          <section>
            <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-faint">
              What to do
            </h3>
            <p className="text-sm leading-relaxed text-muted">
              {sign.explanation}
            </p>
          </section>

          {sign.legalBasis && (
            <section className="rounded-lg border border-line bg-surface px-4 py-3">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-faint">
                Legal basis
              </h3>
              <p className="mt-1 font-mono text-sm text-muted">
                {sign.legalBasis}
              </p>
            </section>
          )}

          {(onPrev || onNext) && (
            <div className="flex gap-3 pt-1">
              <button
                onClick={onPrev}
                disabled={!onPrev}
                className="flex-1 rounded-lg border border-line py-2 text-sm font-medium text-muted transition hover:bg-surface disabled:opacity-40"
              >
                ← Previous
              </button>
              <button
                onClick={onNext}
                disabled={!onNext}
                className="flex-1 rounded-lg border border-line py-2 text-sm font-medium text-muted transition hover:bg-surface disabled:opacity-40"
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
