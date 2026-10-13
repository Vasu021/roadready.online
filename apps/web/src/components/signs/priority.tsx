import {
  YieldShell,
  DiamondShell,
  WhiteSquareShell,
  MandatoryShell,
  SignSvg,
  DangerShell,
  SIGN_COLORS as C,
} from "./primitives";
import type { SignProps } from "./primitives";

// ── Vorfahrtzeichen (priority signs) ─────────────────────────────────────────

export function PriorityGiveWay(p: SignProps) {
  return <YieldShell {...p} />;
}

export function PriorityStop(p: SignProps) {
  return (
    <SignSvg {...p}>
      <path
        d="M31 6 H69 L94 31 V69 L69 94 H31 L6 69 V31 Z"
        fill={C.red}
        stroke={C.white}
        strokeWidth={4}
      />
      <text
        x={50}
        y={61}
        textAnchor="middle"
        fontSize={25}
        fontWeight="800"
        fill={C.white}
        fontFamily="system-ui, sans-serif"
        letterSpacing="1"
      >
        STOP
      </text>
    </SignSvg>
  );
}

export function PriorityAtNextIntersection(p: SignProps) {
  return (
    <DangerShell {...p}>
      <rect x={45} y={32} width={10} height={48} fill={C.black} />
      <rect x={28} y={52} width={44} height={5} fill={C.black} />
    </DangerShell>
  );
}

export function PriorityRoad(p: SignProps) {
  return <DiamondShell {...p} />;
}

export function PriorityRoadEnd(p: SignProps) {
  return (
    <DiamondShell {...p}>
      <g stroke={C.grey} strokeWidth={5} strokeLinecap="round">
        <line x1={28} y1={72} x2={72} y2={28} />
        <line x1={22} y1={66} x2={66} y2={22} />
        <line x1={34} y1={78} x2={78} y2={34} />
      </g>
    </DiamondShell>
  );
}

/** Zeichen 308 — you have priority through the narrow section. */
export function PriorityOverOncoming(p: SignProps) {
  return (
    <WhiteSquareShell {...p}>
      <path d="M44 84 V34 L34 34 L50 14 L66 34 L56 34 V84 Z" fill={C.black} />
      <path
        d="M74 18 V62 L80 62 L71 76 L62 62 L68 62 V18 Z"
        fill={C.red}
        transform="scale(0.8) translate(22 12)"
      />
    </WhiteSquareShell>
  );
}

/** Zeichen 208 — oncoming traffic has priority; you must wait. */
export function PriorityOncomingHasRight(p: SignProps) {
  return (
    <MandatoryShell {...p}>
      <path d="M36 80 V36 L28 36 L42 18 L56 36 L48 36 V80 Z" fill={C.red} />
      <path d="M70 20 V64 L78 64 L64 82 L50 64 L58 64 V20 Z" fill={C.white} />
    </MandatoryShell>
  );
}

/** Zeichen 102 — crossroads where right-before-left applies. */
export function PriorityRightBeforeLeft(p: SignProps) {
  return (
    <DangerShell {...p}>
      <rect x={46} y={36} width={8} height={44} fill={C.black} />
      <rect x={28} y={54} width={44} height={8} fill={C.black} />
    </DangerShell>
  );
}
