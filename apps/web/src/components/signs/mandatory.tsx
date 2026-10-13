import { MandatoryShell, SIGN_COLORS as C, Glyphs } from "./primitives";
import type { SignProps } from "./primitives";

// ── Vorschriftzeichen (mandatory) — blue circle, white symbol ────────────────

/** Straight white arrow, rotatable for the prescribed-direction family. */
function Arrow({ rotate = 0 }: { rotate?: number }) {
  return (
    <path
      d="M44 76 V44 L32 44 L50 22 L68 44 L56 44 V76 Z"
      fill={C.white}
      transform={`rotate(${rotate} 50 50)`}
    />
  );
}

export function MandatoryStraight(p: SignProps) {
  return (
    <MandatoryShell {...p}>
      <Arrow />
    </MandatoryShell>
  );
}

export function MandatoryTurnRight(p: SignProps) {
  return (
    <MandatoryShell {...p}>
      <Arrow rotate={90} />
    </MandatoryShell>
  );
}

export function MandatoryTurnLeft(p: SignProps) {
  return (
    <MandatoryShell {...p}>
      <Arrow rotate={-90} />
    </MandatoryShell>
  );
}

/** Zeichen 209 — turn right HERE (arrow bends at the sign). */
export function MandatoryTurnRightHere(p: SignProps) {
  return (
    <MandatoryShell {...p}>
      <path
        d="M34 76 V54 Q34 46 44 46 H62"
        fill="none"
        stroke={C.white}
        strokeWidth={10}
        strokeLinecap="round"
      />
      <path d="M78 46 L58 34 V58 Z" fill={C.white} />
    </MandatoryShell>
  );
}

export function MandatoryTurnLeftHere(p: SignProps) {
  return (
    <MandatoryShell {...p}>
      <path
        d="M66 76 V54 Q66 46 56 46 H38"
        fill="none"
        stroke={C.white}
        strokeWidth={10}
        strokeLinecap="round"
      />
      <path d="M22 46 L42 34 V58 Z" fill={C.white} />
    </MandatoryShell>
  );
}

export function MandatoryStraightOrRight(p: SignProps) {
  return (
    <MandatoryShell {...p}>
      <path d="M44 80 V40 L34 40 L50 20 L66 40 L56 40 V80 Z" fill={C.white} />
      <path
        d="M50 58 H68"
        stroke={C.white}
        strokeWidth={9}
        strokeLinecap="round"
      />
      <path d="M82 58 L64 48 V68 Z" fill={C.white} />
    </MandatoryShell>
  );
}

export function MandatoryStraightOrLeft(p: SignProps) {
  return (
    <MandatoryShell {...p}>
      <path d="M44 80 V40 L34 40 L50 20 L66 40 L56 40 V80 Z" fill={C.white} />
      <path
        d="M50 58 H32"
        stroke={C.white}
        strokeWidth={9}
        strokeLinecap="round"
      />
      <path d="M18 58 L36 48 V68 Z" fill={C.white} />
    </MandatoryShell>
  );
}

export function MandatoryPassRight(p: SignProps) {
  return (
    <MandatoryShell {...p}>
      <path
        d="M34 80 V62 Q34 48 50 44 Q62 41 62 28"
        fill="none"
        stroke={C.white}
        strokeWidth={9}
        strokeLinecap="round"
      />
      <path d="M62 16 L72 34 H52 Z" fill={C.white} />
    </MandatoryShell>
  );
}

export function MandatoryPassLeft(p: SignProps) {
  return (
    <MandatoryShell {...p}>
      <path
        d="M66 80 V62 Q66 48 50 44 Q38 41 38 28"
        fill="none"
        stroke={C.white}
        strokeWidth={9}
        strokeLinecap="round"
      />
      <path d="M38 16 L48 34 H28 Z" fill={C.white} />
    </MandatoryShell>
  );
}

export function MandatoryRoundabout(p: SignProps) {
  return (
    <MandatoryShell {...p}>
      <g fill="none" stroke={C.white} strokeWidth={8} strokeLinecap="round">
        <path d="M50 24 A26 26 0 0 1 72 62" />
        <path d="M66 74 A26 26 0 0 1 28 62" />
        <path d="M34 38 A26 26 0 0 1 50 24" />
      </g>
      <g fill={C.white}>
        <path d="M78 58 L68 72 L62 56 Z" />
        <path d="M24 72 L18 56 L34 58 Z" />
        <path d="M34 26 L50 18 L46 34 Z" />
      </g>
    </MandatoryShell>
  );
}

export function MandatoryCyclePath(p: SignProps) {
  return (
    <MandatoryShell {...p}>
      {Glyphs.bicycle(50, 50, 1.45, C.white)}
    </MandatoryShell>
  );
}

export function MandatoryFootPath(p: SignProps) {
  return (
    <MandatoryShell {...p}>
      {Glyphs.pedestrian(50, 54, 1.5, C.white)}
    </MandatoryShell>
  );
}

/** Zeichen 240 — shared path for pedestrians and cyclists. */
export function MandatorySharedPath(p: SignProps) {
  return (
    <MandatoryShell {...p}>
      {Glyphs.bicycle(50, 32, 0.95, C.white)}
      <rect x={18} y={48} width={64} height={3} fill={C.white} />
      {Glyphs.pedestrian(50, 74, 1.0, C.white)}
    </MandatoryShell>
  );
}

/** Zeichen 241 — segregated path: cyclists one side, pedestrians the other. */
export function MandatorySegregatedPath(p: SignProps) {
  return (
    <MandatoryShell {...p}>
      {Glyphs.bicycle(28, 52, 0.85, C.white)}
      <rect x={48.5} y={16} width={3} height={68} fill={C.white} />
      {Glyphs.pedestrian(72, 56, 1.05, C.white)}
    </MandatoryShell>
  );
}

export function MandatoryMinimumSpeed(p: SignProps) {
  return (
    <MandatoryShell {...p}>
      <text
        x={50}
        y={65}
        textAnchor="middle"
        fontSize={44}
        fontWeight="700"
        fill={C.white}
        fontFamily="system-ui, sans-serif"
      >
        30
      </text>
    </MandatoryShell>
  );
}

/** Zeichen 245 — lane reserved for scheduled buses. */
export function MandatoryBusLane(p: SignProps) {
  return (
    <MandatoryShell {...p}>
      <g fill={C.white}>
        <rect x={28} y={32} width={44} height={36} rx={5} />
      </g>
      <g fill={C.blue}>
        <rect x={33} y={37} width={12} height={10} rx={2} />
        <rect x={49} y={37} width={12} height={10} rx={2} />
        <rect x={65} y={37} width={3} height={10} rx={1} />
        <circle cx={39} cy={66} r={4} />
        <circle cx={63} cy={66} r={4} />
      </g>
    </MandatoryShell>
  );
}
