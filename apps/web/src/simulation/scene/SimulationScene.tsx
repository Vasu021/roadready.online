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
import StopZone from "../scenarios/StopZone";
import { getScenario } from "../scenarios";
import { useGameStore } from "../../store/gameStore";

interface SimulationSceneProps {
  scenarioId?: string;
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

export default function SimulationScene({ scenarioId }: SimulationSceneProps) {
  const def = scenarioId ? getScenario(scenarioId) : undefined;
  const isTrafficLights = scenarioId === "traffic-lights";

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

        <CarController
          waypoints={def?.waypoints}
          challenges={def?.challenges}
        />

        {def?.stopZone && (
          <StopZone
            cx={def.stopZone.cx}
            cz={def.stopZone.cz}
            hw={def.stopZone.hw}
            hd={def.stopZone.hd}
          />
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
