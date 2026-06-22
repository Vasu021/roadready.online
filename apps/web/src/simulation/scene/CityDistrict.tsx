import { useMemo } from "react";
import Building from "./Building";
import type { BuildingStyle } from "./Building";

// A purely-visual surrounding skyline. The two playable streets (Road 1 N-S and
// Road 2 E-W) and their immediate building rows live inside a "core" box; this
// component fills the area AROUND that box with a deterministic grid of houses
// so the world reads as a real city receding into the fog, instead of two roads
// on an empty field.
//
// Nothing here is drivable and nothing collides — the player car never leaves
// the L-route — so this is clearance-safe by construction as long as we never
// place a building inside the core box.

function seededRand(seed: number) {
  const x = Math.sin(seed * 91.73 + 47.21) * 43758.5453;
  return x - Math.floor(x);
}

// The roads + their existing first building rows + sidewalks all sit inside this
// box. District buildings are only placed strictly OUTSIDE it (plus a margin),
// so they can never intrude on the drivable corridor or the turn arc.
const CORE_MIN_X = -74;
const CORE_MAX_X = 28;
const CORE_MIN_Z = -30;
const CORE_MAX_Z = 50;
const MARGIN = 6;

// Lattice that the skyline is sampled on.
const STEP = 19;
const X_FROM = -140;
const X_TO = 96;
const Z_FROM = -140;
const Z_TO = 104;

const PALETTE: { color: string; roof: string }[] = [
  { color: "#c8b89a", roof: "#7a6a5a" },
  { color: "#a8b8c8", roof: "#5a6a7a" },
  { color: "#d4c4a0", roof: "#887766" },
  { color: "#b0c0b0", roof: "#5a705a" },
  { color: "#c0a890", roof: "#806858" },
  { color: "#9ab0c8", roof: "#4a6070" },
  { color: "#c8a0a0", roof: "#786060" },
  { color: "#b8a8b0", roof: "#605058" },
];

function pickStyle(r: number): BuildingStyle {
  if (r < 0.5) return "modern";
  if (r < 0.8) return "altbau";
  if (r < 0.92) return "shop";
  return "fachwerk";
}

interface Block {
  x: number;
  z: number;
  w: number;
  d: number;
  h: number;
  color: string;
  roof: string;
  style: BuildingStyle;
}

function outsideCore(x: number, z: number, half: number): boolean {
  // The building's footprint must clear the core box entirely.
  return (
    x + half < CORE_MIN_X - MARGIN ||
    x - half > CORE_MAX_X + MARGIN ||
    z + half < CORE_MIN_Z - MARGIN ||
    z - half > CORE_MAX_Z + MARGIN
  );
}

export default function CityDistrict() {
  const blocks = useMemo(() => {
    const out: Block[] = [];
    let i = 0;
    for (let gx = X_FROM; gx <= X_TO; gx += STEP) {
      for (let gz = Z_FROM; gz <= Z_TO; gz += STEP) {
        const r = seededRand(gx * 1.37 + gz * 2.91 + i * 0.13);
        i++;
        if (r < 0.42) continue; // gaps so it isn't a solid wall

        const r2 = seededRand(gx * 3.7 + gz * 1.1 + 17);
        const r3 = seededRand(gx * 0.9 + gz * 4.3 + 91);
        const w = 7 + r2 * 8; // 7–15
        const d = 7 + r3 * 8;
        const half = Math.max(w, d) / 2 + 1;

        const x = gx + (r2 - 0.5) * 5;
        const z = gz + (r3 - 0.5) * 5;
        if (!outsideCore(x, z, half)) continue;

        // Taller on average than the road-side houses so there's a skyline; the
        // odd tower further out adds depth.
        const dist = Math.hypot(x, z);
        const tall = seededRand(gx * 5.1 + gz * 0.7) > 0.78;
        const h = 7 + r * 12 + (tall ? 8 + dist * 0.05 : 0);

        const pal =
          PALETTE[Math.floor(seededRand(x * 1.9 + z * 0.6) * PALETTE.length)];
        out.push({
          x,
          z,
          w,
          d,
          h,
          color: pal.color,
          roof: pal.roof,
          style: pickStyle(seededRand(x * 0.7 + z * 1.3)),
        });
      }
    }
    return out;
  }, []);

  return (
    <group>
      {blocks.map((b, i) => (
        <Building
          key={`district-${i}`}
          position={[b.x, 0, b.z]}
          width={b.w}
          depth={b.d}
          height={b.h}
          color={b.color}
          roofColor={b.roof}
          style={b.style}
        />
      ))}
    </group>
  );
}
