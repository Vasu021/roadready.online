import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import Lighting from "./Lighting";
import Ground from "./Ground";
import GermanCityRoad from "./GermanCityRoad";
import FollowCamera from "./FollowCamera";
import CityEnvironment from "./CityEnvironment";
import TrafficLight from "./TrafficLight";
import RoadSign, { type SignKind } from "./RoadSign";
import CarController from "../vehicles/CarController";
import ScenarioRunner from "../scenarios/ScenarioRunner";
import TriggerWatcher from "../scenarios/TriggerWatcher";
import StopZone from "../scenarios/StopZone";
import TrafficManager from "../traffic/TrafficManager";
import { getScenario } from "../scenarios";
import { useGameStore } from "../../store/gameStore";
import type { McqQuestion } from "../../store/gameStore";

interface SimulationSceneProps {
  scenarioId?: string;
  /** Scenario MCQ bank (with answers), used by TriggerWatcher in test mode. */
  questions?: McqQuestion[];
}

/** A traffic light whose phase follows a challenge: red until it resolves, then green. */
function ChallengeLight({
  position,
  resolvedId,
}: {
  position: [number, number, number];
  resolvedId: string;
}) {
  const resolved = useGameStore((s) => s.resolvedChallengeIds);
  return (
    <TrafficLight
      position={position}
      phase={resolved[resolvedId] ? "green" : "red"}
    />
  );
}

export default function SimulationScene({
  scenarioId,
  questions = [],
}: SimulationSceneProps) {
  const def = scenarioId ? getScenario(scenarioId) : undefined;

  return (
    <Canvas
      shadows
      camera={{ position: [0, 5, 28], fov: 60, near: 0.1, far: 800 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      style={{ width: "100%", height: "100%" }}
    >
      <color attach="background" args={["#87ceeb"]} />
      <fog attach="fog" args={["#b8d4ec", 90, 320]} />

      <Suspense fallback={null}>
        <Lighting />
        <Ground />
        <GermanCityRoad />
        <CityEnvironment />

        {/* ── Declarative scene props from the ScenarioDef ───────────────── */}
        {def?.lights?.map((l, i) =>
          l.goWhenResolvedId ? (
            <ChallengeLight
              key={`light-${i}`}
              position={l.position}
              resolvedId={l.goWhenResolvedId}
            />
          ) : (
            <TrafficLight
              key={`light-${i}`}
              position={l.position}
              autoCycle={l.autoCycle}
              cycle={l.cycle}
              startPhase={l.startPhase}
            />
          ),
        )}

        {def?.signs?.map((s, i) => (
          <RoadSign
            key={`sign-${i}`}
            position={s.position}
            kind={s.kind as SignKind}
            rotationY={s.rotationY}
            number={s.number}
            label={s.label}
          />
        ))}

        {def?.npcs && def.npcs.length > 0 && (
          <TrafficManager spawns={def.npcs} />
        )}

        <CarController waypoints={def?.waypoints} />

        {def?.stopZone && (
          <StopZone
            cx={def.stopZone.cx}
            cz={def.stopZone.cz}
            hw={def.stopZone.hw}
            hd={def.stopZone.hd}
          />
        )}

        {def?.challenges && def.challenges.length > 0 && (
          <TriggerWatcher decisions={def.challenges} questions={questions} />
        )}

        {def && (
          <ScenarioRunner
            checker={def.check}
            timeLimit={def.config.timeLimit}
          />
        )}

        <FollowCamera />
      </Suspense>
    </Canvas>
  );
}
