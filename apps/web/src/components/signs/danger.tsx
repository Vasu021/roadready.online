import { DangerShell, SignSvg, SIGN_COLORS as C, Glyphs } from "./primitives";
import type { SignProps } from "./primitives";

// ── Gefahrzeichen (danger signs) — red triangle, white field, black symbol ────

export function DangerGeneral(p: SignProps) {
  return (
    <DangerShell {...p}>
      <rect x={46.5} y={38} width={7} height={24} rx={3} fill={C.black} />
      <circle cx={50} cy={70} r={4} fill={C.black} />
    </DangerShell>
  );
}

export function DangerCrossroads(p: SignProps) {
  return (
    <DangerShell {...p}>
      <rect x={46} y={36} width={8} height={44} fill={C.black} />
      <rect x={28} y={54} width={44} height={8} fill={C.black} />
    </DangerShell>
  );
}

export function DangerJunctionRight(p: SignProps) {
  return (
    <DangerShell {...p}>
      <rect x={46} y={36} width={8} height={44} fill={C.black} />
      <rect x={50} y={54} width={22} height={8} fill={C.black} />
    </DangerShell>
  );
}

export function DangerJunctionLeft(p: SignProps) {
  return (
    <DangerShell {...p}>
      <rect x={46} y={36} width={8} height={44} fill={C.black} />
      <rect x={28} y={54} width={22} height={8} fill={C.black} />
    </DangerShell>
  );
}

export function DangerCurveRight(p: SignProps) {
  return (
    <DangerShell {...p}>
      <path
        d="M42 80 V62 Q42 48 56 48 Q68 48 68 40"
        fill="none"
        stroke={C.black}
        strokeWidth={8}
        strokeLinecap="round"
      />
      <path d="M68 32 L76 46 H60 Z" fill={C.black} />
    </DangerShell>
  );
}

export function DangerCurveLeft(p: SignProps) {
  return (
    <DangerShell {...p}>
      <path
        d="M58 80 V62 Q58 48 44 48 Q32 48 32 40"
        fill="none"
        stroke={C.black}
        strokeWidth={8}
        strokeLinecap="round"
      />
      <path d="M32 32 L40 46 H24 Z" fill={C.black} />
    </DangerShell>
  );
}

export function DangerDoubleCurve(p: SignProps) {
  return (
    <DangerShell {...p}>
      <path
        d="M42 82 Q42 68 56 64 Q68 60 62 46 Q58 38 50 36"
        fill="none"
        stroke={C.black}
        strokeWidth={8}
        strokeLinecap="round"
      />
      <path d="M52 28 L58 42 H42 Z" fill={C.black} />
    </DangerShell>
  );
}

export function DangerSteepDescent(p: SignProps) {
  return (
    <DangerShell {...p}>
      <path d="M26 78 L76 54 V78 Z" fill={C.black} />
      <text
        x={50}
        y={46}
        textAnchor="middle"
        fontSize={14}
        fontWeight="700"
        fill={C.black}
        fontFamily="system-ui, sans-serif"
      >
        10%
      </text>
    </DangerShell>
  );
}

export function DangerSteepAscent(p: SignProps) {
  return (
    <DangerShell {...p}>
      <path d="M76 78 L26 54 V78 Z" fill={C.black} />
      <text
        x={50}
        y={46}
        textAnchor="middle"
        fontSize={14}
        fontWeight="700"
        fill={C.black}
        fontFamily="system-ui, sans-serif"
      >
        12%
      </text>
    </DangerShell>
  );
}

export function DangerUnevenRoad(p: SignProps) {
  return (
    <DangerShell {...p}>
      <path
        d="M24 70 Q32 52 40 70 Q48 52 56 70 Q64 52 72 70"
        fill="none"
        stroke={C.black}
        strokeWidth={7}
        strokeLinecap="round"
      />
    </DangerShell>
  );
}

export function DangerSlipperyRoad(p: SignProps) {
  return (
    <DangerShell {...p}>
      {Glyphs.car(50, 54, 1.15, C.black)}
      <path
        d="M26 74 Q34 68 30 78 M70 74 Q78 68 74 78"
        fill="none"
        stroke={C.black}
        strokeWidth={4.5}
        strokeLinecap="round"
      />
      <path
        d="M34 78 H66"
        stroke={C.black}
        strokeWidth={4.5}
        strokeLinecap="round"
      />
    </DangerShell>
  );
}

export function DangerPedestrians(p: SignProps) {
  return (
    <DangerShell {...p}>{Glyphs.pedestrian(50, 62, 1.15, C.black)}</DangerShell>
  );
}

export function DangerChildren(p: SignProps) {
  return (
    <DangerShell {...p}>
      <g>{Glyphs.pedestrian(40, 62, 0.95, C.black)}</g>
      <g transform="translate(18 0)">
        {Glyphs.pedestrian(40, 66, 0.72, C.black)}
      </g>
    </DangerShell>
  );
}

export function DangerCyclists(p: SignProps) {
  return (
    <DangerShell {...p}>{Glyphs.bicycle(50, 60, 1.15, C.black)}</DangerShell>
  );
}

export function DangerAnimals(p: SignProps) {
  return (
    <DangerShell {...p}>
      <g fill={C.black} transform="translate(50 60) scale(1.05)">
        <path d="M-18 10 L-14 -2 Q-8 -10 2 -10 Q12 -10 16 -2 L18 10 H13 L11 2 H-9 L-11 10 Z" />
        <path d="M14 -8 L20 -16 L22 -10 L28 -14 L24 -4 Q20 -2 16 -4 Z" />
        <path d="M-16 10 L-18 18 H-14 L-11 10 M12 10 L15 18 H19 L16 10" />
      </g>
    </DangerShell>
  );
}

export function DangerRailwayWithBarrier(p: SignProps) {
  return (
    <DangerShell {...p}>
      <rect x={28} y={46} width={6} height={32} fill={C.black} />
      <rect x={28} y={50} width={46} height={6} fill={C.black} />
      <rect x={40} y={60} width={34} height={5} fill={C.black} />
      <circle cx={31} cy={44} r={4} fill={C.black} />
    </DangerShell>
  );
}

export function DangerRailwayNoBarrier(p: SignProps) {
  return (
    <DangerShell {...p}>
      <g
        stroke={C.black}
        strokeWidth={6}
        strokeLinecap="round"
        transform="translate(50 60)"
      >
        <path d="M-16 -8 L2 6 M-4 -10 L10 2" />
        <path d="M-18 8 H16" />
        <path d="M-10 -14 L14 -14" />
      </g>
    </DangerShell>
  );
}

export function DangerTrafficLights(p: SignProps) {
  return (
    <DangerShell {...p}>
      <rect
        x={40}
        y={32}
        width={20}
        height={48}
        rx={5}
        fill="none"
        stroke={C.black}
        strokeWidth={4}
      />
      <circle cx={50} cy={43} r={5.4} fill={C.signalRed} />
      <circle cx={50} cy={56} r={5.4} fill={C.signalYellow} />
      <circle cx={50} cy={69} r={5.4} fill={C.signalGreen} />
    </DangerShell>
  );
}

export function DangerRoadNarrows(p: SignProps) {
  return (
    <DangerShell {...p}>
      <path
        d="M30 80 L38 48 M70 80 L62 48"
        stroke={C.black}
        strokeWidth={7}
        strokeLinecap="round"
      />
      <path d="M38 48 L34 36 L44 42 Z M62 48 L66 36 L56 42 Z" fill={C.black} />
    </DangerShell>
  );
}

export function DangerRoadNarrowsRight(p: SignProps) {
  return (
    <DangerShell {...p}>
      <path
        d="M36 80 V44 M68 80 L58 46"
        stroke={C.black}
        strokeWidth={7}
        strokeLinecap="round"
      />
      <path d="M58 46 L60 34 L50 40 Z" fill={C.black} />
    </DangerShell>
  );
}

export function DangerConstruction(p: SignProps) {
  return (
    <DangerShell {...p}>
      <g fill={C.black} transform="translate(50 58)">
        <circle cx={-2} cy={-16} r={4.4} />
        <path d="M-6 -10 L-10 2 L-6 2 L-5 -4 L-4 14 H0 L2 2 L6 14 H10 L8 -8 L14 -2 L17 -5 L8 -12 Z" />
        <path d="M-16 -2 L-6 -14 L-2 -11 L-12 1 Z" />
        <rect x={-20} y={0} width={10} height={4} rx={1} />
      </g>
    </DangerShell>
  );
}

export function DangerTwoWayTraffic(p: SignProps) {
  return (
    <DangerShell {...p}>
      <g fill={C.black}>
        <path d="M38 78 V48 L30 48 L42 32 L54 48 L46 48 V78 Z" />
        <path d="M62 36 V66 L70 66 L58 82 L46 66 L54 66 V36 Z" opacity={0.95} />
      </g>
    </DangerShell>
  );
}

export function DangerTrafficQueues(p: SignProps) {
  return (
    <DangerShell {...p}>
      {Glyphs.car(50, 48, 0.78, C.black)}
      {Glyphs.car(50, 64, 0.78, C.black)}
      {Glyphs.car(50, 80, 0.78, C.black)}
    </DangerShell>
  );
}

export function DangerFallingRocks(p: SignProps) {
  return (
    <DangerShell {...p}>
      <path d="M30 34 V74 H24 L36 80 V34 Z" fill={C.black} />
      <g fill={C.black}>
        <circle cx={52} cy={56} r={5} />
        <circle cx={64} cy={68} r={6.5} />
        <circle cx={48} cy={74} r={4} />
      </g>
    </DangerShell>
  );
}

export function DangerCrosswind(p: SignProps) {
  return (
    <DangerShell {...p}>
      <g
        stroke={C.black}
        strokeWidth={5}
        fill="none"
        strokeLinecap="round"
        transform="translate(50 60)"
      >
        <path d="M-20 -8 Q-4 -16 6 -8 Q14 -2 8 4" />
        <path d="M-18 6 Q-2 -2 8 6" />
        <path d="M6 -14 L14 -8 L4 -2" />
      </g>
    </DangerShell>
  );
}

export function DangerAndreaskreuz(p: SignProps) {
  return (
    <SignSvg {...p}>
      <g stroke={C.red} strokeWidth={14} strokeLinecap="round">
        <line x1={16} y1={16} x2={84} y2={84} />
        <line x1={84} y1={16} x2={16} y2={84} />
      </g>
      <g stroke={C.white} strokeWidth={4} strokeLinecap="round">
        <line x1={16} y1={16} x2={84} y2={84} />
        <line x1={84} y1={16} x2={16} y2={84} />
      </g>
    </SignSvg>
  );
}

export function DangerPriorityAhead(p: SignProps) {
  return (
    <DangerShell {...p}>
      <rect x={45} y={32} width={10} height={48} fill={C.black} />
      <rect x={28} y={52} width={44} height={5} fill={C.black} />
    </DangerShell>
  );
}
