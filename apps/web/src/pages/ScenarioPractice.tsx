import { useCallback, useEffect, useRef, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import type { QuestionAnswerKey, ScenarioQuestionRow } from "@roadready/shared";
import { api } from "../utils/api";
import { useUserStore } from "../store/userStore";
import AppShell from "../components/AppShell";
import QuestionCard from "../components/QuestionCard";
import ScenarioIllustration from "../components/ScenarioIllustration";
import { Badge, Card, EmptyState, ErrorNote, Spinner } from "../components/ui";

export default function ScenarioPractice() {
  const selectedCountry = useUserStore((s) => s.selectedCountry);
  const code = selectedCountry?.code ?? null;

  const [scenarios, setScenarios] = useState<ScenarioQuestionRow[] | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  /** Index of the scenario open in the modal. */
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [answerKey, setAnswerKey] = useState<QuestionAnswerKey | null>(null);
  const [answerError, setAnswerError] = useState<string | null>(null);
  /** Which scenarios the user has answered correctly this session. */
  const [solved, setSolved] = useState<Record<string, boolean>>({});
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!code) return;
    let cancelled = false;
    setError(null);

    api.scenarios
      .list(code)
      .then((rows) => {
        if (!cancelled) setScenarios(rows);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setScenarios([]);
        setError(
          err instanceof Error
            ? err.message
            : "Could not load the driving situations.",
        );
      });

    return () => {
      cancelled = true;
    };
  }, [code, reloadKey]);

  const open = openIndex !== null ? (scenarios?.[openIndex] ?? null) : null;

  const close = useCallback(() => {
    setOpenIndex(null);
    setSelected(null);
    setRevealed(false);
    setAnswerKey(null);
    setAnswerError(null);
  }, []);

  function openScenario(index: number) {
    setOpenIndex(index);
    setSelected(null);
    setRevealed(false);
    setAnswerKey(null);
    setAnswerError(null);
  }

  async function confirm() {
    if (!open || !selected || !code || revealed) return;
    try {
      const key = await api.scenarios.answer(code, open.id);
      setAnswerKey(key);
      setRevealed(true);
      setSolved((prev) => ({
        ...prev,
        [open.id]: key.correctOptionId === selected,
      }));
    } catch (err) {
      setAnswerError(
        err instanceof Error ? err.message : "Could not check that answer.",
      );
    }
  }

  function goToNext() {
    if (openIndex === null || !scenarios) return;
    const next = openIndex + 1;
    if (next < scenarios.length) openScenario(next);
    else close();
  }

  useEffect(() => {
    if (openIndex === null) return;
    closeRef.current?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openIndex, close]);

  if (!selectedCountry) return <Navigate to="/" replace />;

  const solvedCount = Object.values(solved).filter(Boolean).length;

  return (
    <AppShell maxWidth="max-w-6xl">
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Scenario Practice
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-400">
          Real situations rather than isolated signs: a junction, a crossing, a
          jam on the Autobahn. Read the scene, decide what you would do, then
          check it against the rule.
        </p>
      </header>

      {error && (
        <div className="mb-6">
          <ErrorNote
            message={error}
            onRetry={() => setReloadKey((k) => k + 1)}
          />
        </div>
      )}

      {scenarios === null ? (
        <Spinner label="Loading situations…" />
      ) : scenarios.length === 0 ? (
        <EmptyState
          icon="🎬"
          title={`No situations for ${selectedCountry.name} yet`}
          body="Illustrated driving situations are available for Germany today; more countries are being written."
          action={
            <Link
              to="/dashboard"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
            >
              Back to dashboard
            </Link>
          }
        />
      ) : (
        <>
          <p className="mb-4 text-xs text-gray-500">
            {scenarios.length} situations
            {solvedCount > 0 && ` · ${solvedCount} answered correctly`}
          </p>

          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {scenarios.map((scenario, i) => (
              <li key={scenario.id}>
                <button
                  onClick={() => openScenario(i)}
                  className="group h-full w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950"
                >
                  <Card className="flex h-full flex-col overflow-hidden transition duration-200 group-hover:-translate-y-0.5 group-hover:border-white/25 group-hover:shadow-xl group-hover:shadow-black/30">
                    <ScenarioIllustration
                      imagePrompt={scenario.imagePrompt}
                      imageUrl={scenario.imageUrl}
                      compact
                    />
                    <div className="flex flex-1 flex-col px-5 py-4">
                      <div className="flex items-start justify-between gap-2">
                        <h2 className="text-sm font-semibold text-white">
                          {scenario.name}
                        </h2>
                        {solved[scenario.id] && <Badge tone="success">✓</Badge>}
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-gray-400">
                        {scenario.description}
                      </p>
                      <p className="mt-3 text-xs font-medium text-blue-400">
                        Open situation →
                      </p>
                    </div>
                  </Card>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Situation modal */}
      {open && open.question && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 backdrop-blur-sm sm:items-center sm:p-6"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label={open.name}
        >
          <div
            className="max-h-[94vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl border border-white/10 bg-gray-950 shadow-2xl sm:rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4 border-b border-white/10 px-6 py-3.5">
              <p className="text-xs uppercase tracking-widest text-gray-500">
                Situation {(openIndex ?? 0) + 1} of {scenarios?.length ?? 0}
              </p>
              <button
                ref={closeRef}
                onClick={close}
                aria-label="Close"
                className="rounded-lg border border-white/10 px-2.5 py-1 text-sm text-gray-400 transition hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70"
              >
                ✕
              </button>
            </div>

            <div className="px-6 py-5">
              <QuestionCard
                question={open.question}
                selectedOptionId={selected}
                correctOptionId={answerKey?.correctOptionId ?? null}
                revealed={revealed}
                onSelect={setSelected}
                explanation={answerKey?.explanation}
                illustration={
                  <div className="mb-5">
                    <ScenarioIllustration
                      imagePrompt={open.imagePrompt}
                      imageUrl={open.imageUrl}
                      name={open.name}
                    />
                  </div>
                }
              />

              {answerError && (
                <div className="mt-4">
                  <ErrorNote message={answerError} />
                </div>
              )}

              <div className="mt-6 flex items-center justify-end gap-3 border-t border-white/10 pt-5">
                {revealed ? (
                  <>
                    <button
                      onClick={close}
                      className="rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-gray-300 transition hover:bg-white/5"
                    >
                      Close
                    </button>
                    <button
                      onClick={goToNext}
                      className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-500"
                    >
                      Next situation →
                    </button>
                  </>
                ) : (
                  <button
                    onClick={confirm}
                    disabled={!selected}
                    className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Confirm
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
