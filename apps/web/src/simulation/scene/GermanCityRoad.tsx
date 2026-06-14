import { useMemo } from "react";

// ─── Road geometry constants ───────────────────────────────────────────────────
const ROAD_Y = 0.002;
const MARK_Y = 0.004;
const ASPHALT = "#1c1c1c";
const WHITE = "#f0f0f0";
const YELLOW = "#f5c842";

// Road 1 runs south (−Z): car enters from z=45, exits at z=−9
const R1_Z_START = 45;
const R1_Z_END = -9;
const R1_CENTER_Z = (R1_Z_START + R1_Z_END) / 2; //  18
const R1_LENGTH = R1_Z_START - R1_Z_END; //  54
const R1_WIDTH = 7;

// Road 2 runs west (−X): starts at x=0, ends at x=−62, centred at z=−5
const R2_X_START = 3.5; // slight overlap so corner fills flush
const R2_X_END = -62;
const R2_CENTER_X = (R2_X_START + R2_X_END) / 2; // −29.25
const R2_LENGTH = R2_X_START - R2_X_END; //  65.5
const R2_WIDTH = 7;
const R2_CENTER_Z = -5;

// Derived edges
const HALF_W = R1_WIDTH / 2; // 3.5
const EDGE_W = 0.15;
const CENTER_W = 0.12;
const DASH_ON = 3;
const DASH_GAP = 3;

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Solid white edge stripe (runs along Z for Road 1) */
function EdgeZ({
  x,
  zStart,
  zEnd,
}: {
  x: number;
  zStart: number;
  zEnd: number;
}) {
  const len = Math.abs(zEnd - zStart);
  const cz = (zStart + zEnd) / 2;
  return (
    <mesh position={[x, MARK_Y, cz]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[EDGE_W, len]} />
      <meshBasicMaterial color={WHITE} />
    </mesh>
  );
}

/** Solid white edge stripe (runs along X for Road 2) */
function EdgeX({
  z,
  xStart,
  xEnd,
}: {
  z: number;
  xStart: number;
  xEnd: number;
}) {
  const len = Math.abs(xEnd - xStart);
  const cx = (xStart + xEnd) / 2;
  return (
    <mesh position={[cx, MARK_Y, z]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[len, EDGE_W]} />
      <meshBasicMaterial color={WHITE} />
    </mesh>
  );
}

/** Dashed centre line along Z */
function DashesZ({
  x,
  zStart,
  zEnd,
}: {
  x: number;
  zStart: number;
  zEnd: number;
}) {
  const positions = useMemo(() => {
    const cycle = DASH_ON + DASH_GAP;
    const len = Math.abs(zEnd - zStart);
    const count = Math.floor(len / cycle);
    const topZ = Math.max(zStart, zEnd);
    return Array.from(
      { length: count },
      (_, i) => topZ - DASH_ON / 2 - i * cycle,
    );
  }, [zStart, zEnd]);

  return (
    <>
      {positions.map((z, i) => (
        <mesh key={i} position={[x, MARK_Y, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[CENTER_W, DASH_ON]} />
          <meshBasicMaterial color={WHITE} />
        </mesh>
      ))}
    </>
  );
}

/** Dashed centre line along X */
function DashesX({
  z,
  xStart,
  xEnd,
}: {
  z: number;
  xStart: number;
  xEnd: number;
}) {
  const positions = useMemo(() => {
    const cycle = DASH_ON + DASH_GAP;
    const len = Math.abs(xEnd - xStart);
    const count = Math.floor(len / cycle);
    const leftX = Math.min(xStart, xEnd);
    return Array.from(
      { length: count },
      (_, i) => leftX + DASH_ON / 2 + i * cycle,
    );
  }, [xStart, xEnd]);

  return (
    <>
      {positions.map((x, i) => (
        <mesh key={i} position={[x, MARK_Y, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[DASH_ON, CENTER_W]} />
          <meshBasicMaterial color={WHITE} />
        </mesh>
      ))}
    </>
  );
}

/** Zebra crossing (pedestrian, 5 stripes) */
function Crosswalk({
  cx,
  cz,
  width,
  depth,
}: {
  cx: number;
  cz: number;
  width: number;
  depth: number;
}) {
  const stripes = 5;
  const stripeW = depth / (stripes * 2 - 1);
  return (
    <>
      {Array.from({ length: stripes }, (_, i) => {
        const offset = -depth / 2 + stripeW / 2 + i * stripeW * 2;
        return (
          <mesh
            key={i}
            position={[cx, MARK_Y + 0.001, cz + offset]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <planeGeometry args={[width, stripeW * 0.85]} />
            <meshBasicMaterial color={WHITE} />
          </mesh>
        );
      })}
    </>
  );
}

/** Stop line — thick solid yellow stripe across the road */
function StopLine({
  cx,
  cz,
  width,
}: {
  cx: number;
  cz: number;
  width: number;
}) {
  return (
    <mesh position={[cx, MARK_Y + 0.001, cz]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[0.3, width]} />
      <meshBasicMaterial color={YELLOW} />
    </mesh>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function GermanCityRoad() {
  return (
    <group>
      {/* ── Road 1: North-South segment ────────────────────────────────── */}
      <mesh
        position={[0, ROAD_Y, R1_CENTER_Z]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[R1_WIDTH, R1_LENGTH]} />
        <meshStandardMaterial color={ASPHALT} roughness={0.88} />
      </mesh>

      {/* Road 1 edge lines */}
      <EdgeZ x={-HALF_W + EDGE_W / 2} zStart={R1_Z_START} zEnd={-HALF_W} />
      <EdgeZ x={HALF_W - EDGE_W / 2} zStart={R1_Z_START} zEnd={-HALF_W} />

      {/* Road 1 centre dashes */}
      <DashesZ x={0} zStart={R1_Z_START} zEnd={-HALF_W} />

      {/* ── Road 2: East-West segment ──────────────────────────────────── */}
      <mesh
        position={[R2_CENTER_X, ROAD_Y, R2_CENTER_Z]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[R2_LENGTH, R2_WIDTH]} />
        <meshStandardMaterial color={ASPHALT} roughness={0.88} />
      </mesh>

      {/* Road 2 edge lines (north + south of road) */}
      <EdgeX
        z={R2_CENTER_Z - HALF_W + EDGE_W / 2}
        xStart={R2_X_START}
        xEnd={R2_X_END}
      />
      <EdgeX
        z={R2_CENTER_Z + HALF_W - EDGE_W / 2}
        xStart={R2_X_START}
        xEnd={R2_X_END}
      />

      {/* Road 2 centre dashes */}
      <DashesX z={R2_CENTER_Z} xStart={-4} xEnd={R2_X_END + 2} />

      {/* ── Intersection corner fill ───────────────────────────────────── */}
      {/* Slight tint difference to hint at intersection */}
      <mesh
        position={[0, ROAD_Y + 0.001, R2_CENTER_Z]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[R1_WIDTH, R2_WIDTH]} />
        <meshStandardMaterial color="#222" roughness={0.85} />
      </mesh>

      {/* ── Stop line at the end of Road 2 ─────────────────────────────── */}
      <StopLine cx={-44.8} cz={-5} width={R2_WIDTH - 0.3} />

      {/* ── Crosswalk just past the stop line ──────────────────────────── */}
      <Crosswalk cx={-46.5} cz={-5} width={R2_WIDTH - 0.3} depth={3.5} />

      {/* ── Curb edges (low grey strips) ──────────────────────────────── */}
      {/* Road 1 curbs */}
      <mesh
        position={[-HALF_W - 0.15, 0.06, R1_CENTER_Z]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[0.3, 0.12, R1_LENGTH]} />
        <meshStandardMaterial color="#888" roughness={0.95} />
      </mesh>
      <mesh
        position={[HALF_W + 0.15, 0.06, R1_CENTER_Z]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[0.3, 0.12, R1_LENGTH]} />
        <meshStandardMaterial color="#888" roughness={0.95} />
      </mesh>

      {/* Road 2 curbs (north + south sides) */}
      <mesh
        position={[R2_CENTER_X, 0.06, R2_CENTER_Z - HALF_W - 0.15]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[R2_LENGTH, 0.12, 0.3]} />
        <meshStandardMaterial color="#888" roughness={0.95} />
      </mesh>
      <mesh
        position={[R2_CENTER_X, 0.06, R2_CENTER_Z + HALF_W + 0.15]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[R2_LENGTH, 0.12, 0.3]} />
        <meshStandardMaterial color="#888" roughness={0.95} />
      </mesh>
    </group>
  );
}
