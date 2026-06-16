import { useGameStore } from "../../store/gameStore";
import NPCVehicle from "./NPCVehicle";
import Pedestrian from "./Pedestrian";
import type { NpcSpawn } from "../scenarios/types";

export type TrafficPhase = "red" | "yellow" | "green";

interface Props {
  /** The declarative NPC set (Step 6 sources this from `ScenarioDef.npcs`). */
  spawns: NpcSpawn[];
  /**
   * Current junction-light phase. Spawns with behaviour 'stop-at-red' (and no
   * `goWhenResolvedId`) hold unless this is 'green'.
   */
  lightPhase?: TrafficPhase;
  /** Spawn ids the scenario currently wants held (behaviour 'yield'). */
  heldIds?: string[];
}

/**
 * Renders a declarative list of NPCs and coordinates simple, non-AI rules:
 * stop at a red light, yield/give-way hold, and emergency pass-through. Holding
 * is just a per-spawn `paused` flag computed each render — collision handling is
 * left to sensible path spacing, not a solver.
 */
export default function TrafficManager({ spawns, lightPhase, heldIds }: Props) {
  // Re-render when a challenge resolves so 'stop-at-red' spawns release on cue.
  const resolved = useGameStore((s) => s.resolvedChallengeIds);

  return (
    <>
      {spawns.map((spawn) => {
        const paused = isHeld(spawn, lightPhase, heldIds, resolved);
        if (spawn.variant === "pedestrian") {
          return (
            <Pedestrian
              key={spawn.id}
              path={spawn.path}
              speed={spawn.speed}
              loop={spawn.loop}
              startDelay={spawn.startDelay}
              paused={paused}
            />
          );
        }
        return (
          <NPCVehicle
            key={spawn.id}
            variant={spawn.variant}
            path={spawn.path}
            speed={spawn.speed}
            loop={spawn.loop}
            startDelay={spawn.startDelay}
            paused={paused}
          />
        );
      })}
    </>
  );
}

/** Whether a spawn should be frozen this frame, per its coordinated behaviour. */
function isHeld(
  spawn: NpcSpawn,
  lightPhase: TrafficPhase | undefined,
  heldIds: string[] | undefined,
  resolved: Record<string, boolean>,
): boolean {
  switch (spawn.behavior) {
    case "stop-at-red":
      if (spawn.goWhenResolvedId) return !resolved[spawn.goWhenResolvedId];
      return lightPhase ? lightPhase !== "green" : false;
    case "yield":
      return heldIds?.includes(spawn.id) ?? false;
    case "emergency":
    case "free":
    default:
      return false;
  }
}
