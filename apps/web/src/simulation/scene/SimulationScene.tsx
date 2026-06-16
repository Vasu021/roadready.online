import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import Lighting from "./Lighting";
import Ground from "./Ground";
import GermanCityRoad from "./GermanCityRoad";
import FollowCamera from "./FollowCamera";
import CityEnvironment from "./CityEnvironment";
import TrafficLight from "./TrafficLight";
import CarController from "../vehicles/CarController";
import ScenarioRunner from "../scenarios/ScenarioRunner";
import TriggerWatcher from "../scenarios/TriggerWatcher";
import StopZone from "../scenarios/StopZone";
import TrafficDemo from "../traffic/TrafficDemo";
import { getScenario } from "../scenarios";
import { useGameStore } from "../../store/gameStore";
import type { McqQuestion } from "../../store/gameStore";

interface SimulationSceneProps {
  scenarioId?: string;
  /** Scenario MCQ bank (with answers), used by TriggerWatcher in test mode. */
  questions?: McqQuestion[];
}

/** Traffic lights for the traffic-lights scenario — phase follows challenge state */
function TrafficLightSet() {
  const resolved = useGameStore((s) => s.resolvedChallengeIds);
  const phase = resolved["red-light-stop"] ? "green" : "red";
  return (
    <>
      <TrafficLight position={[5, 0, -5]} phase={phase} />
      <TrafficLight position={[-5, 0, -5]} phase={phase} />
    </>
  );
}

export default function SimulationScene({
  scenarioId,
  questions = [],
}: SimulationSceneProps) {
  const def = scenarioId ? getScenario(scenarioId) : undefined;
  const isTrafficLights = scenarioId === "traffic-lights";
  // Temporary Step-5 smoke test for the NPC traffic system; opt-in via the URL
  // (?trafficDemo=1) so it never shows in normal play. Removed once Step 6 wires
  // NPCs declaratively per scenario.
  const showTrafficDemo =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("trafficDemo") === "1";

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

        {isTrafficLights && <TrafficLightSet />}

        {showTrafficDemo && <TrafficDemo />}

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
