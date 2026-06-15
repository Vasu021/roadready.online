import { useMemo } from "react";
import Tree from "./Tree";
import Building from "./Building";
import type { BuildingStyle } from "./Building";
import RoadSign from "./RoadSign";
import StreetLamp from "./StreetLamp";
import Bench from "./Bench";
import Bollard from "./Bollard";
import BusStop from "./BusStop";

function seededRand(seed: number) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

/** Deterministically pick a German facade style from a [0,1) value. */
function pickStyle(r: number): BuildingStyle {
  if (r < 0.45) return "altbau";
  if (r < 0.7) return "shop";
  if (r < 0.9) return "fachwerk";
  return "modern";
}

// ─── Layout constants ──────────────────────────────────────────────────────────
//
// Road 1 (N-S): centred at x=0, z from 45 to -9
// Road 2 (E-W): centred at z=-5, x from 0 to -62
//
// The car's left-turn arc sweeps through roughly:
//   x ∈ [0, -14],  z ∈ [-2, -6]
//
// All objects must stay clear of that corridor.
// Hard safety margins we enforce:
//   Road 1 LEFT side (x<0): only place buildings/trees for  z ≥ 8   (above junction)
//   Road 1 RIGHT side (x>0): stop at z ≥ -6
//   Road 2 NORTH side (z<-8.5): only place from x ≤ -16   (west of junction)
//   Road 2 SOUTH side (z>-1.5): only place from x ≤ -12   (west of junction)

const R1_LEFT_TREE_X = -7.5; // just outside left curb of Road 1
const R1_RIGHT_TREE_X = 7.5;
const R2_NORTH_TREE_Z = -13.5; // just outside north curb of Road 2
const R2_SOUTH_TREE_Z = 3.5;

// ─── Trees ────────────────────────────────────────────────────────────────────

function Road1Trees() {
  // LEFT side — only north of the junction (z ≥ 8) so the turn arc is clear
  const left = useMemo(() => {
    const items: { z: number; s: number; v: 0 | 1 | 2 }[] = [];
    for (let z = 40; z >= 8; z -= 7) {
      const r = seededRand(z * 3.1 + 1);
      items.push({
        z: z + (r - 0.5) * 2,
        s: 0.8 + r * 0.45,
        v: Math.floor(r * 3) as 0 | 1 | 2,
      });
    }
    return items;
  }, []);

  // RIGHT side — safe all the way down
  const right = useMemo(() => {
    const items: { z: number; s: number; v: 0 | 1 | 2 }[] = [];
    for (let z = 40; z >= -6; z -= 7) {
      const r = seededRand(z * 7.3 + 55);
      items.push({
        z: z + (r - 0.5) * 2,
        s: 0.8 + r * 0.45,
        v: Math.floor(r * 3) as 0 | 1 | 2,
      });
    }
    return items;
  }, []);

  return (
    <>
      {left.map((t, i) => (
        <Tree
          key={`l${i}`}
          position={[R1_LEFT_TREE_X, 0, t.z]}
          scale={t.s}
          variant={t.v}
        />
      ))}
      {right.map((t, i) => (
        <Tree
          key={`r${i}`}
          position={[R1_RIGHT_TREE_X, 0, t.z]}
          scale={t.s}
          variant={t.v}
        />
      ))}
    </>
  );
}

function Road2Trees() {
  // NORTH side — start west of junction (x ≤ -16)
  const north = useMemo(() => {
    const items: { x: number; s: number; v: 0 | 1 | 2 }[] = [];
    for (let x = -16; x >= -58; x -= 7) {
      const r = seededRand(x * 4.7 + 22);
      items.push({
        x: x + (r - 0.5) * 2,
        s: 0.8 + r * 0.45,
        v: Math.floor(r * 3) as 0 | 1 | 2,
      });
    }
    return items;
  }, []);

  // SOUTH side — start west of junction (x ≤ -12)
  const south = useMemo(() => {
    const items: { x: number; s: number; v: 0 | 1 | 2 }[] = [];
    for (let x = -12; x >= -58; x -= 7) {
      const r = seededRand(x * 2.9 + 99);
      items.push({
        x: x + (r - 0.5) * 2,
        s: 0.8 + r * 0.45,
        v: Math.floor(r * 3) as 0 | 1 | 2,
      });
    }
    return items;
  }, []);

  return (
    <>
      {north.map((t, i) => (
        <Tree
          key={`n${i}`}
          position={[t.x, 0, R2_NORTH_TREE_Z]}
          scale={t.s}
          variant={t.v}
        />
      ))}
      {south.map((t, i) => (
        <Tree
          key={`s${i}`}
          position={[t.x, 0, R2_SOUTH_TREE_Z]}
          scale={t.s}
          variant={t.v}
        />
      ))}
    </>
  );
}

// ─── Buildings ────────────────────────────────────────────────────────────────

const CONFIGS = [
  { w: 8, d: 6, h: 6, color: "#c8b89a", roof: "#7a6a5a" },
  { w: 6, d: 5, h: 10, color: "#a8b8c8", roof: "#5a6a7a" },
  { w: 10, d: 7, h: 5, color: "#d4c4a0", roof: "#887766" },
  { w: 7, d: 6, h: 12, color: "#b0c0b0", roof: "#5a705a" },
  { w: 9, d: 5, h: 7, color: "#c0a890", roof: "#806858" },
  { w: 5, d: 8, h: 14, color: "#9ab0c8", roof: "#4a6070" },
  { w: 11, d: 6, h: 8, color: "#c8a0a0", roof: "#786060" },
];

function Road1Buildings() {
  // LEFT side: buildings only above junction (z ≥ 8).
  // Keep at x ≤ -17 so they're well clear of the turn arc.
  const left = useMemo(() => {
    const items: { z: number; x: number; cfg: (typeof CONFIGS)[0] }[] = [];
    let z = 38;
    let i = 0;
    while (z >= 8) {
      const r = seededRand(z * 5.3 + i * 17);
      const cfg = CONFIGS[Math.floor(r * CONFIGS.length)];
      items.push({ z: z - cfg.d / 2, x: -(17 + r * 5), cfg });
      z -= cfg.d + 1 + r * 2;
      i++;
    }
    return items;
  }, []);

  // RIGHT side: safe — the car turns LEFT so the right side is never entered
  const right = useMemo(() => {
    const items: { z: number; x: number; cfg: (typeof CONFIGS)[0] }[] = [];
    let z = 38;
    let i = 0;
    while (z >= -6) {
      const r = seededRand(z * 3.7 + i * 23 + 200);
      const cfg = CONFIGS[Math.floor(r * CONFIGS.length)];
      items.push({ z: z - cfg.d / 2, x: 14 + r * 5, cfg });
      z -= cfg.d + 1 + r * 2;
      i++;
    }
    return items;
  }, []);

  return (
    <>
      {left.map((b, i) => (
        <Building
          key={`bl${i}`}
          position={[b.x, 0, b.z]}
          width={b.cfg.w}
          depth={b.cfg.d}
          height={b.cfg.h}
          color={b.cfg.color}
          roofColor={b.cfg.roof}
          style={pickStyle(seededRand(b.x * 1.7 + b.z * 0.9))}
        />
      ))}
      {right.map((b, i) => (
        <Building
          key={`br${i}`}
          position={[b.x, 0, b.z]}
          width={b.cfg.w}
          depth={b.cfg.d}
          height={b.cfg.h}
          color={b.cfg.color}
          roofColor={b.cfg.roof}
          style={pickStyle(seededRand(b.x * 1.7 + b.z * 0.9))}
        />
      ))}
    </>
  );
}

function Road2Buildings() {
  // NORTH side: x ≤ -16, z at -(17 + r*5) so inner face starts around z=-17
  const north = useMemo(() => {
    const items: { x: number; z: number; cfg: (typeof CONFIGS)[0] }[] = [];
    let x = -16;
    let i = 0;
    while (x > -64) {
      const r = seededRand(x * 6.1 + i * 13);
      const cfg = CONFIGS[Math.floor(r * CONFIGS.length)];
      // Centre building so inner face is at z≈-17 (Road 2 north curb is at z≈-8.8)
      items.push({ x: x - cfg.w / 2, z: -(17 + r * 4), cfg });
      x -= cfg.w + 1 + r * 2;
      i++;
    }
    return items;
  }, []);

  // SOUTH side: x ≤ -12, z at (10 + r*4) so inner face starts around z=10
  const south = useMemo(() => {
    const items: { x: number; z: number; cfg: (typeof CONFIGS)[0] }[] = [];
    let x = -12;
    let i = 0;
    while (x > -64) {
      const r = seededRand(x * 4.3 + i * 19 + 300);
      const cfg = CONFIGS[Math.floor(r * CONFIGS.length)];
      items.push({ x: x - cfg.w / 2, z: 10 + r * 4, cfg });
      x -= cfg.w + 1 + r * 2;
      i++;
    }
    return items;
  }, []);

  return (
    <>
      {north.map((b, i) => (
        <Building
          key={`rn${i}`}
          position={[b.x, 0, b.z]}
          width={b.cfg.w}
          depth={b.cfg.d}
          height={b.cfg.h}
          color={b.cfg.color}
          roofColor={b.cfg.roof}
          style={pickStyle(seededRand(b.x * 1.7 + b.z * 0.9))}
        />
      ))}
      {south.map((b, i) => (
        <Building
          key={`rs${i}`}
          position={[b.x, 0, b.z]}
          width={b.cfg.w}
          depth={b.cfg.d}
          height={b.cfg.h}
          color={b.cfg.color}
          roofColor={b.cfg.roof}
          style={pickStyle(seededRand(b.x * 1.7 + b.z * 0.9))}
        />
      ))}
    </>
  );
}

// ─── Sidewalks ────────────────────────────────────────────────────────────────

function Sidewalks() {
  return (
    <>
      {/* Road 1 left sidewalk — stops above junction */}
      <mesh
        position={[-5.5, 0.005, 27]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[3, 36]} />
        <meshStandardMaterial color="#b0a898" roughness={0.95} />
      </mesh>
      {/* Road 1 right sidewalk — full length */}
      <mesh
        position={[5.5, 0.005, 18]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[3, 54]} />
        <meshStandardMaterial color="#b0a898" roughness={0.95} />
      </mesh>

      {/* Road 2 north sidewalk — starts west of junction */}
      <mesh
        position={[-38, 0.005, -11]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[52, 3]} />
        <meshStandardMaterial color="#b0a898" roughness={0.95} />
      </mesh>
      {/* Road 2 south sidewalk — starts west of junction */}
      <mesh
        position={[-36, 0.005, 1]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[56, 3]} />
        <meshStandardMaterial color="#b0a898" roughness={0.95} />
      </mesh>
    </>
  );
}

// ─── Street furniture + a demonstrative sign set ───────────────────────────────
// Static props only (Step 4). Everything sits in the documented safe zones —
// the turn arc (x∈[0,-14], z∈[-2,-6]) and building margins stay clear.
// Step 6 will place signs/props declaratively per scenario.

function StreetFurniture() {
  return (
    <group>
      {/* Lamps — Road 1 right kerb (arm reaches the road) */}
      {[36, 25, 14].map((z, i) => (
        <StreetLamp key={`lr${i}`} position={[5.6, 0, z]} rotationY={Math.PI} />
      ))}
      {/* Lamps — Road 1 left kerb, north of the junction */}
      {[36, 25, 14].map((z, i) => (
        <StreetLamp key={`ll${i}`} position={[-5.6, 0, z]} rotationY={0} />
      ))}
      {/* Lamps — Road 2 south kerb (west of the junction) */}
      {[-20, -34, -48].map((x, i) => (
        <StreetLamp
          key={`ls${i}`}
          position={[x, 0, 1.4]}
          rotationY={Math.PI / 2}
        />
      ))}

      {/* Bench + bollards on Road 1 right sidewalk */}
      <Bench position={[6.4, 0, 30.5]} rotationY={Math.PI} />
      <Bollard position={[4.1, 0, 16]} />
      <Bollard position={[4.1, 0, 13.5]} />

      {/* Bus stop on Road 2 south sidewalk */}
      <BusStop position={[-30, 0, 2.2]} rotationY={Math.PI} />

      {/* Sign gallery on Road 1 right kerb, facing approaching (southbound) traffic */}
      <RoadSign position={[6.4, 0, 33]} kind="give-way" />
      <RoadSign position={[6.4, 0, 28]} kind="stop" />
      <RoadSign position={[6.4, 0, 23]} kind="priority-road" />
      <RoadSign position={[6.4, 0, 18]} kind="speed-limit" number={30} />
      <RoadSign position={[6.4, 0, 13]} kind="roundabout" />
      <RoadSign position={[6.4, 0, 8]} kind="pedestrian-crossing" />

      {/* Pedestrian-crossing sign by the actual zebra (faces the westbound car) */}
      <RoadSign
        position={[-46.5, 0, -9.5]}
        kind="pedestrian-crossing"
        rotationY={Math.PI / 2}
      />
    </group>
  );
}

export default function CityEnvironment() {
  return (
    <group>
      <Sidewalks />
      <Road1Trees />
      <Road2Trees />
      <Road1Buildings />
      <Road2Buildings />
      <StreetFurniture />
    </group>
  );
}
