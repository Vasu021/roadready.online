import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGameStore } from "../../store/gameStore";
import type { McqQuestion } from "../../store/gameStore";
import type { ChallengePoint } from "./types";

interface Props {
  decisions: ChallengePoint[];
  /** The scenario's full MCQ bank (with answers), from useScenarioQuestions. */
  questions: McqQuestion[];
  /**
   * Full Test: spread `questions` evenly across the decision zones (chunk by zone
   * index) instead of filtering each decision by its `questionOrders`.
   */
  fullTest?: boolean;
}

/** Pick the questions a decision asks; empty `orders` / undefined = all. */
function selectQuestions(all: McqQuestion[], orders?: number[]): McqQuestion[] {
  if (!orders || orders.length === 0) return all;
  const wanted = new Set(orders);
  return all.filter((q) => wanted.has(q.order));
}

/**
 * Full Test: each scene (decision) shows the ONE question that belongs to it.
 * Simulation.tsx builds the full-test bank with `order` = scene index, in the
 * same order as the scenario's decisions, so a scene's question is the one whose
 * `order` equals that decision's index. This keeps the visible scene and the
 * question in sync (no random spread). A missing question → empty → teaching.
 */
function questionForZone(
  all: McqQuestion[],
  decisions: ChallengePoint[],
  zoneId: string,
): McqQuestion[] {
  const idx = decisions.findIndex((d) => d.id === zoneId);
  if (idx < 0) return [];
  return all.filter((q) => q.order === idx);
}

/**
 * Invisible R3F component that watches the car against each decision point and,
 * on first crossing, opens the right overlay for the current attempt mode:
 * practice → teaching panel, test → MCQ sequence. Uses getState() so it never
 * re-renders. The car brakes while an overlay is open (handled in CarController).
 */
export default function TriggerWatcher({
  decisions,
  questions,
  fullTest,
}: Props) {
  const firedRef = useRef(new Set<string>());
  const runIdRef = useRef(useGameStore.getState().runId);

  // Re-arm all decisions when the scenario's decisions change.
  useEffect(() => {
    firedRef.current = new Set();
  }, [decisions]);

  useFrame(() => {
    const store = useGameStore.getState();
    if (store.scenarioPhase !== "running" || store.isPaused) return;

    // New run (mount / Retry): re-arm decisions and skip a frame so the car
    // (repositioned by CarController) is back at spawn before we test triggers.
    if (runIdRef.current !== store.runId) {
      runIdRef.current = store.runId;
      firedRef.current = new Set();
      return;
    }

    // Only one decision overlay at a time
    if (store.activeMcq || store.activeTeaching) return;
    const car = store.carState;
    if (!car) return;

    const [x, , z] = car.position;

    for (const d of decisions) {
      if (firedRef.current.has(d.id)) continue;
      const fireZ = d.triggerZ !== undefined && z <= d.triggerZ;
      const fireX = d.triggerX !== undefined && x <= d.triggerX;
      if (!fireZ && !fireX) continue;

      if (store.attemptMode === "test") {
        // Wait for the question bank to load before consuming the trigger.
        if (questions.length === 0) return;
        const queue = fullTest
          ? questionForZone(questions, decisions, d.id)
          : selectQuestions(questions, d.questionOrders);
        firedRef.current.add(d.id);
        if (queue.length > 0) {
          store.startMcqSequence(d.id, queue);
        } else {
          // No questions mapped → teach so the objective still completes.
          store.triggerTeaching({
            id: d.id,
            prompt: d.prompt,
            teaching: d.teaching,
          });
        }
      } else {
        firedRef.current.add(d.id);
        store.triggerTeaching({
          id: d.id,
          prompt: d.prompt,
          teaching: d.teaching,
        });
      }
      break;
    }
  });

  return null;
}
