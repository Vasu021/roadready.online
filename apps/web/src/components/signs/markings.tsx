import type { ReactNode } from "react";
import { SignSvg, SIGN_COLORS as C } from "./primitives";
import type { SignProps } from "./primitives";

// ── Fahrbahnmarkierungen (road markings) ─────────────────────────────────────
// Drawn as a short top-down slice of carriageway so the marking reads clearly.

function Road({
  children,
  size,
  className,
}: SignProps & { children: ReactNode }) {
  return (
    <SignSvg size={size} className={className}>
      <rect x={0} y={0} width={100} height={100} rx={6} fill={C.asphalt} />
      <g>{children}</g>
    </SignSvg>
  );
}

/** Zeichen 340 — Leitlinie: a broken lane line, crossable. */
export function MarkingBrokenLine(p: SignProps) {
  return (
    <Road {...p}>
      {[6, 32, 58, 84].map((y) => (
        <rect key={y} x={46} y={y} width={8} height={16} fill={C.white} />
      ))}
    </Road>
  );
}

/** Zeichen 295 — Fahrstreifenbegrenzung: a solid line you may not cross. */
export function MarkingSolidLine(p: SignProps) {
  return (
    <Road {...p}>
      <rect x={46} y={4} width={8} height={92} fill={C.white} />
    </Road>
  );
}

/** Double solid line — overtaking and crossing prohibited both ways. */
export function MarkingDoubleSolidLine(p: SignProps) {
  return (
    <Road {...p}>
      <rect x={38} y={4} width={7} height={92} fill={C.white} />
      <rect x={55} y={4} width={7} height={92} fill={C.white} />
    </Road>
  );
}

/** Solid beside broken — only the side with the broken line may cross. */
export function MarkingSolidAndBrokenLine(p: SignProps) {
  return (
    <Road {...p}>
      <rect x={38} y={4} width={7} height={92} fill={C.white} />
      {[6, 32, 58, 84].map((y) => (
        <rect key={y} x={55} y={y} width={7} height={16} fill={C.white} />
      ))}
    </Road>
  );
}

/** Zeichen 294 — Haltlinie: stop here at lights or a STOP sign. */
export function MarkingStopLine(p: SignProps) {
  return (
    <Road {...p}>
      <rect x={8} y={46} width={84} height={10} fill={C.white} />
      <rect x={48} y={62} width={5} height={34} fill={C.white} opacity={0.65} />
    </Road>
  );
}

/** Zeichen 341 — Wartelinie: the dashed give-way line ("shark teeth"). */
export function MarkingGiveWayLine(p: SignProps) {
  return (
    <Road {...p}>
      {[10, 30, 50, 70].map((x) => (
        <rect key={x} x={x} y={46} width={14} height={9} fill={C.white} />
      ))}
    </Road>
  );
}

/** Zeichen 293 — Zebrastreifen: pedestrian crossing. */
export function MarkingCrosswalk(p: SignProps) {
  return (
    <Road {...p}>
      {[10, 28, 46, 64, 82].map((x) => (
        <rect key={x} x={x} y={14} width={10} height={72} fill={C.white} />
      ))}
    </Road>
  );
}

/** Zeichen 298 — Sperrfläche: hatched area that must stay clear. */
export function MarkingHatchedArea(p: SignProps) {
  return (
    <Road {...p}>
      <g stroke={C.white} strokeWidth={5}>
        <rect
          x={22}
          y={10}
          width={56}
          height={80}
          fill="none"
          strokeWidth={6}
        />
        {[-40, -20, 0, 20, 40, 60].map((o) => (
          <line key={o} x1={22} y1={50 + o} x2={78} y2={10 + o} />
        ))}
      </g>
    </Road>
  );
}

/** Radfahrstreifen — a cycle lane marked with a solid line and a bike symbol. */
export function MarkingCycleLane(p: SignProps) {
  return (
    <Road {...p}>
      <rect x={32} y={4} width={7} height={92} fill={C.white} />
      <g
        transform="translate(68 50) scale(1.5)"
        stroke={C.white}
        strokeWidth={2}
        fill="none"
      >
        <circle cx={-8} cy={6} r={5} />
        <circle cx={8} cy={6} r={5} />
        <path d="M-8 6 L-1 -4 H5 L8 6 M-1 -4 L2 6 M4 -4 H8" />
      </g>
    </Road>
  );
}

/** Schutzstreifen — advisory cycle strip with a broken line. */
export function MarkingCycleProtectiveStrip(p: SignProps) {
  return (
    <Road {...p}>
      {[6, 28, 50, 72].map((y) => (
        <rect key={y} x={32} y={y} width={6} height={14} fill={C.white} />
      ))}
      <g
        transform="translate(68 50) scale(1.4)"
        stroke={C.white}
        strokeWidth={2}
        fill="none"
      >
        <circle cx={-8} cy={6} r={5} />
        <circle cx={8} cy={6} r={5} />
        <path d="M-8 6 L-1 -4 H5 L8 6 M-1 -4 L2 6 M4 -4 H8" />
      </g>
    </Road>
  );
}

/** Zeichen 297 — Pfeilmarkierung: lane-direction arrows. */
export function MarkingDirectionArrows(p: SignProps) {
  return (
    <Road {...p}>
      <g fill={C.white}>
        <path d="M28 86 V46 L20 46 L32 28 L44 46 L36 46 V86 Z" />
        <path d="M62 86 V54 Q62 44 74 44 L70 38 L86 46 L70 54 L74 50 Q68 50 68 56 V86 Z" />
      </g>
    </Road>
  );
}

/** BUS lane marking. */
export function MarkingBusLane(p: SignProps) {
  return (
    <Road {...p}>
      <rect x={14} y={4} width={7} height={92} fill={C.white} />
      <text
        x={60}
        y={60}
        textAnchor="middle"
        fontSize={24}
        fontWeight="800"
        fill={C.white}
        fontFamily="system-ui, sans-serif"
        letterSpacing="1"
      >
        BUS
      </text>
    </Road>
  );
}

/** Parking bay markings. */
export function MarkingParkingBay(p: SignProps) {
  return (
    <Road {...p}>
      <g stroke={C.white} strokeWidth={5} fill="none">
        <path d="M14 20 H86 M14 50 H86 M14 80 H86" />
        <path d="M14 14 V86" />
      </g>
    </Road>
  );
}
