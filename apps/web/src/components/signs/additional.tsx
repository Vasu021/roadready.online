import { PlateShell, SignSvg, SIGN_COLORS as C, Glyphs } from "./primitives";
import type { SignProps } from "./primitives";

// ── Zusatzzeichen (supplementary plates) ─────────────────────────────────────
// These never stand alone: they narrow or extend the sign directly above them.

function PlateText({
  children,
  fontSize = 17,
}: {
  children: string;
  fontSize?: number;
}) {
  return (
    <text
      x={50}
      y={56}
      textAnchor="middle"
      fontSize={fontSize}
      fontWeight="600"
      fill={C.black}
      fontFamily="system-ui, sans-serif"
    >
      {children}
    </text>
  );
}

export function PlateWhenWet(p: SignProps) {
  return (
    <PlateShell {...p}>
      <g fill={C.black} transform="translate(26 50) scale(0.9)">
        <path d="M0 -10 Q7 -2 7 3 Q7 9 0 9 Q-7 9 -7 3 Q-7 -2 0 -10 Z" />
      </g>
      <text
        x={60}
        y={56}
        textAnchor="middle"
        fontSize={15}
        fontWeight="600"
        fill={C.black}
        fontFamily="system-ui, sans-serif"
      >
        bei Nässe
      </text>
    </PlateShell>
  );
}

export function PlateResidentsExcepted(p: SignProps) {
  return (
    <PlateShell {...p}>
      <PlateText fontSize={15}>Anlieger frei</PlateText>
    </PlateShell>
  );
}

export function PlateTimeRestriction(p: SignProps) {
  return (
    <PlateShell {...p}>
      <text
        x={50}
        y={47}
        textAnchor="middle"
        fontSize={13}
        fontWeight="600"
        fill={C.black}
        fontFamily="system-ui, sans-serif"
      >
        Mo–Fr
      </text>
      <text
        x={50}
        y={63}
        textAnchor="middle"
        fontSize={13}
        fontWeight="600"
        fill={C.black}
        fontFamily="system-ui, sans-serif"
      >
        8–18 h
      </text>
    </PlateShell>
  );
}

export function PlateDistance(p: SignProps) {
  return (
    <PlateShell {...p}>
      <PlateText>100 m</PlateText>
    </PlateShell>
  );
}

export function PlateLength(p: SignProps) {
  return (
    <PlateShell {...p}>
      <PlateText fontSize={15}>auf 2 km</PlateText>
    </PlateShell>
  );
}

export function PlateTrucksOnly(p: SignProps) {
  return <PlateShell {...p}>{Glyphs.truck(50, 48, 1.15, C.black)}</PlateShell>;
}

export function PlateExceptCyclists(p: SignProps) {
  return (
    <PlateShell {...p}>
      {Glyphs.bicycle(28, 50, 0.72, C.black)}
      <text
        x={62}
        y={56}
        textAnchor="middle"
        fontSize={14}
        fontWeight="600"
        fill={C.black}
        fontFamily="system-ui, sans-serif"
      >
        frei
      </text>
    </PlateShell>
  );
}

/** Course of the priority road through the next junction (Zeichen 1002). */
export function PlatePriorityCourse(p: SignProps) {
  return (
    <PlateShell {...p}>
      <path
        d="M24 64 H50 V40"
        fill="none"
        stroke={C.black}
        strokeWidth={7}
        strokeLinecap="square"
      />
      <path d="M50 32 L58 46 H42 Z" fill={C.black} />
      <path
        d="M66 50 H78"
        stroke={C.black}
        strokeWidth={4}
        strokeLinecap="round"
      />
    </PlateShell>
  );
}

export function PlateParkingDisc(p: SignProps) {
  return (
    <PlateShell {...p}>
      <circle
        cx={34}
        cy={50}
        r={13}
        fill={C.blue}
        stroke={C.black}
        strokeWidth={2}
      />
      <g stroke={C.white} strokeWidth={2.5} strokeLinecap="round">
        <line x1={34} y1={50} x2={34} y2={42} />
        <line x1={34} y1={50} x2={40} y2={53} />
      </g>
      <text
        x={66}
        y={56}
        textAnchor="middle"
        fontSize={15}
        fontWeight="600"
        fill={C.black}
        fontFamily="system-ui, sans-serif"
      >
        2 Std
      </text>
    </PlateShell>
  );
}

/** Zeichen 720 — the green arrow that permits a right turn on red. */
export function PlateGreenArrow(p: SignProps) {
  return (
    <SignSvg {...p}>
      <rect
        x={18}
        y={18}
        width={64}
        height={64}
        rx={4}
        fill={C.black}
        stroke={C.grey}
        strokeWidth={2}
      />
      <g fill={C.signalGreen}>
        <path d="M34 60 H52 V44 L70 58 L52 72 V60 H34 Z" />
      </g>
    </SignSvg>
  );
}

export function PlateSnowChains(p: SignProps) {
  return (
    <PlateShell {...p}>
      <g
        fill="none"
        stroke={C.black}
        strokeWidth={3}
        transform="translate(50 50)"
      >
        <circle cx={0} cy={0} r={14} />
        <circle cx={0} cy={0} r={5} />
        <path d="M-14 -6 L14 6 M-14 6 L14 -6" strokeWidth={2.4} />
      </g>
    </PlateShell>
  );
}
