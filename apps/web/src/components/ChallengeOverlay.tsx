import { useEffect } from "react";
import { useGameStore } from "../store/gameStore";

// Maps KeyboardEvent.code to a readable label
function keyLabel(code: string): string {
  const map: Record<string, string> = {
    Space: "SPACE",
    ArrowLeft: "← LEFT",
    ArrowRight: "→ RIGHT",
    ArrowUp: "↑ UP",
    ArrowDown: "↓ DOWN",
    KeyW: "W",
    KeyA: "A",
    KeyS: "S",
    KeyD: "D",
  };
  return map[code] ?? code;
}

export default function ChallengeOverlay() {
  const activeChallenge = useGameStore((s) => s.activeChallenge);
  const resolveChallenge = useGameStore((s) => s.resolveChallenge);
  const clearChallenge = useGameStore((s) => s.clearChallenge);
  const setScenarioPhase = useGameStore((s) => s.setScenarioPhase);

  // Listen for key presses while challenge is pending
  useEffect(() => {
    if (activeChallenge?.result !== "pending") return;

    const handler = (e: KeyboardEvent) => {
      e.preventDefault();
      if (e.code === activeChallenge.correctKey) {
        resolveChallenge("correct");
      } else {
        resolveChallenge("wrong", keyLabel(e.code));
      }
    };

    window.addEventListener("keydown", handler, { once: true });
    return () => window.removeEventListener("keydown", handler);
  }, [activeChallenge?.id, activeChallenge?.result, resolveChallenge]);

  // Auto-clear after showing correct result; fail after showing wrong result
  useEffect(() => {
    if (!activeChallenge) return;

    if (activeChallenge.result === "correct") {
      const t = setTimeout(() => clearChallenge(), 1600);
      return () => clearTimeout(t);
    }

    if (activeChallenge.result === "wrong") {
      const t = setTimeout(() => setScenarioPhase("failed"), 1600);
      return () => clearTimeout(t);
    }
  }, [activeChallenge?.result, clearChallenge, setScenarioPhase]);

  if (!activeChallenge) return null;

  const isPending = activeChallenge.result === "pending";
  const isCorrect = activeChallenge.result === "correct";
  const isWrong = activeChallenge.result === "wrong";

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <div
        className={`pointer-events-auto w-full max-w-sm rounded-2xl p-6 text-center shadow-2xl backdrop-blur-md transition-all ${
          isCorrect
            ? "border border-green-500/50 bg-green-950/90"
            : isWrong
              ? "border border-red-500/50 bg-red-950/90"
              : "border border-yellow-500/40 bg-black/85"
        }`}
      >
        {/* Situation prompt */}
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-yellow-400">
          Situation
        </p>
        <h2 className="mb-4 text-xl font-bold text-white">
          {activeChallenge.prompt}
        </h2>

        {/* Pending: show instruction + key hint */}
        {isPending && (
          <div className="space-y-3">
            <p className="text-sm text-gray-300">
              {activeChallenge.instruction}
            </p>
            <div className="flex items-center justify-center gap-2">
              <span className="rounded-lg border border-white/20 bg-white/10 px-4 py-2 font-mono text-lg font-bold text-white">
                {activeChallenge.correctKeyLabel}
              </span>
            </div>
            <p className="text-xs text-gray-500">Press the correct key now</p>
          </div>
        )}

        {/* Correct */}
        {isCorrect && (
          <div className="space-y-2">
            <div className="text-4xl">✅</div>
            <p className="text-lg font-bold text-green-400">Correct!</p>
            <p className="text-sm text-green-300/80">
              Good decision — resuming…
            </p>
          </div>
        )}

        {/* Wrong */}
        {isWrong && (
          <div className="space-y-2">
            <div className="text-4xl">❌</div>
            <p className="text-lg font-bold text-red-400">Wrong!</p>
            {activeChallenge.wrongKeyLabel && (
              <p className="text-sm text-red-300/80">
                You pressed{" "}
                <span className="font-mono font-bold">
                  {activeChallenge.wrongKeyLabel}
                </span>
                {" — "}you should have pressed{" "}
                <span className="font-mono font-bold">
                  {activeChallenge.correctKeyLabel}
                </span>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
