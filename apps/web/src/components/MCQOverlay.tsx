import { useRef, useState } from "react";
import { useGameStore } from "../store/gameStore";

// i18n placeholder (Step 8 swaps in utils/i18n.ts)
const t = (s: string): string => s;

const LETTERS = ["A", "B", "C", "D", "E", "F"];

/**
 * Transparent, draggable MCQ popup shown in TEST mode while the car is stopped
 * at a decision point. The user can drag it aside (header bar) to see the road.
 * Per-scenario test is SCORED, never instant-fail: a wrong answer still shows
 * the correct option + explanation and the run continues.
 */
export default function MCQOverlay() {
  const activeMcq = useGameStore((s) => s.activeMcq);
  const mcqResult = useGameStore((s) => s.mcqResult);
  const selectedId = useGameStore((s) => s.mcqSelectedOptionId);
  const queueLength = useGameStore((s) => s.mcqQueue.length);
  const selectMcqOption = useGameStore((s) => s.selectMcqOption);
  const submitMcq = useGameStore((s) => s.submitMcq);
  const advanceMcq = useGameStore((s) => s.advanceMcq);
  const finishMcq = useGameStore((s) => s.finishMcq);

  // ── Dragging ────────────────────────────────────────────────────────────────
  const panelRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ dx: number; dy: number } | null>(null);
  const [pos, setPos] = useState(() => ({
    x:
      typeof window !== "undefined"
        ? Math.max(16, window.innerWidth / 2 - 220)
        : 80,
    y: 72,
  }));

  function onPointerDown(e: React.PointerEvent) {
    dragRef.current = { dx: e.clientX - pos.x, dy: e.clientY - pos.y };
    e.currentTarget.setPointerCapture(e.pointerId);
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!dragRef.current) return;
    const w = panelRef.current?.offsetWidth ?? 440;
    const h = panelRef.current?.offsetHeight ?? 320;
    const maxX = Math.max(0, window.innerWidth - w);
    const maxY = Math.max(0, window.innerHeight - h);
    setPos({
      x: Math.min(Math.max(0, e.clientX - dragRef.current.dx), maxX),
      y: Math.min(Math.max(0, e.clientY - dragRef.current.dy), maxY),
    });
  }
  function onPointerUp(e: React.PointerEvent) {
    dragRef.current = null;
    e.currentTarget.releasePointerCapture(e.pointerId);
  }

  if (!activeMcq) return null;

  const isPending = mcqResult === "pending";
  const answered = mcqResult === "correct" || mcqResult === "wrong";
  const hasNext = queueLength > 0;

  return (
    <div
      ref={panelRef}
      className="fixed z-50 w-[440px] max-w-[92vw] overflow-hidden rounded-2xl border border-white/15 bg-slate-950/75 shadow-2xl backdrop-blur-md"
      style={{ left: pos.x, top: pos.y }}
    >
      {/* Drag handle */}
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        className="flex cursor-grab items-center justify-between bg-white/10 px-4 py-2 active:cursor-grabbing"
      >
        <span className="text-xs font-semibold uppercase tracking-widest text-amber-300">
          {t("Test Question")}
        </span>
        <span className="select-none text-xs text-gray-400">⠿ {t("drag")}</span>
      </div>

      <div className="p-5">
        <h2 className="mb-4 text-base font-bold leading-snug text-white">
          {activeMcq.questionText}
        </h2>

        {/* Options */}
        <div className="space-y-2">
          {activeMcq.options.map((opt, i) => {
            const isSelected = selectedId === opt.id;
            const isCorrectOpt =
              answered && opt.id === activeMcq.correctOptionId;
            const isWrongPick =
              answered && isSelected && opt.id !== activeMcq.correctOptionId;

            const base =
              "flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition";
            const stateClass = isCorrectOpt
              ? "border-emerald-500/60 bg-emerald-500/15 text-emerald-100"
              : isWrongPick
                ? "border-red-500/60 bg-red-500/15 text-red-100"
                : isSelected
                  ? "border-amber-400/70 bg-amber-400/15 text-white"
                  : "border-white/15 bg-white/5 text-gray-200 hover:border-white/30 hover:bg-white/10";

            return (
              <button
                key={opt.id}
                type="button"
                disabled={!isPending}
                onClick={() => selectMcqOption(opt.id)}
                className={`${base} ${stateClass} disabled:cursor-default`}
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-black/30 font-mono text-xs font-bold">
                  {LETTERS[i] ?? i + 1}
                </span>
                <span className="flex-1">{opt.text}</span>
                {isCorrectOpt && <span>✓</span>}
                {isWrongPick && <span>✕</span>}
              </button>
            );
          })}
        </div>

        {/* Result + explanation */}
        {answered && (
          <div
            className={`mt-4 rounded-lg border p-3 text-sm ${
              mcqResult === "correct"
                ? "border-emerald-500/40 bg-emerald-950/40 text-emerald-200"
                : "border-red-500/40 bg-red-950/40 text-red-200"
            }`}
          >
            <p className="mb-1 font-semibold">
              {mcqResult === "correct" ? t("✅ Correct") : t("❌ Not quite")}
            </p>
            {activeMcq.explanation && (
              <p className="leading-relaxed text-gray-200">
                {activeMcq.explanation}
              </p>
            )}
          </div>
        )}

        {/* Action */}
        <div className="mt-5 flex justify-end">
          {isPending ? (
            <button
              type="button"
              disabled={!selectedId}
              onClick={submitMcq}
              className="rounded-lg bg-amber-500 px-5 py-2 text-sm font-semibold text-black transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {t("Confirm")}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => (hasNext ? advanceMcq() : finishMcq())}
              className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
            >
              {hasNext ? t("Next Question →") : t("Continue →")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
