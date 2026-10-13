import { SignSvg, SIGN_COLORS as C } from "./primitives";
import type { SignProps } from "./primitives";

// ── Lichtzeichen (traffic light signals) ─────────────────────────────────────
// A three-lamp head where only the lit lamps are saturated; the rest stay dark.

const DARK = "#2A2A2A";

function LightHead({
  red = false,
  yellow = false,
  green = false,
  size,
  className,
}: SignProps & { red?: boolean; yellow?: boolean; green?: boolean }) {
  return (
    <SignSvg size={size} className={className}>
      <rect x={30} y={6} width={40} height={88} rx={8} fill="#111" />
      <rect
        x={33}
        y={9}
        width={34}
        height={82}
        rx={6}
        fill="none"
        stroke="#333"
        strokeWidth={2}
      />
      <circle cx={50} cy={26} r={11} fill={red ? C.signalRed : DARK} />
      <circle cx={50} cy={50} r={11} fill={yellow ? C.signalYellow : DARK} />
      <circle cx={50} cy={74} r={11} fill={green ? C.signalGreen : DARK} />
    </SignSvg>
  );
}

export function SignalRed(p: SignProps) {
  return <LightHead {...p} red />;
}

export function SignalRedYellow(p: SignProps) {
  return <LightHead {...p} red yellow />;
}

export function SignalYellow(p: SignProps) {
  return <LightHead {...p} yellow />;
}

export function SignalGreen(p: SignProps) {
  return <LightHead {...p} green />;
}

export function SignalGreenArrowLeft(p: SignProps) {
  return (
    <SignSvg {...p}>
      <rect x={30} y={6} width={40} height={88} rx={8} fill="#111" />
      <circle cx={50} cy={26} r={11} fill={DARK} />
      <circle cx={50} cy={50} r={11} fill={DARK} />
      <circle cx={50} cy={74} r={11} fill="#0d2a18" />
      <path
        d="M58 68 H48 V62 L38 74 L48 86 V80 H58 Z"
        fill={C.signalGreen}
        transform="translate(0 -6)"
      />
    </SignSvg>
  );
}

export function SignalFlashingYellow(p: SignProps) {
  return (
    <SignSvg {...p}>
      <rect x={28} y={26} width={44} height={48} rx={8} fill="#111" />
      <circle cx={50} cy={50} r={14} fill={C.signalYellow} />
      <g
        stroke={C.signalYellow}
        strokeWidth={3}
        strokeLinecap="round"
        opacity={0.55}
      >
        <line x1={50} y1={18} x2={50} y2={10} />
        <line x1={78} y1={50} x2={88} y2={50} />
        <line x1={22} y1={50} x2={12} y2={50} />
        <line x1={50} y1={82} x2={50} y2={90} />
      </g>
    </SignSvg>
  );
}

export function SignalPedestrianRed(p: SignProps) {
  return (
    <SignSvg {...p}>
      <rect x={28} y={10} width={44} height={80} rx={7} fill="#111" />
      <circle cx={50} cy={32} r={13} fill={C.signalRed} />
      <g fill="#3a0a0a" transform="translate(50 32) scale(0.42)">
        <circle cx={0} cy={-16} r={6} />
        <path d="M-12 -8 H12 V-2 H6 L8 16 H2 L0 2 L-2 16 H-8 L-6 -2 H-12 Z" />
      </g>
      <circle cx={50} cy={68} r={13} fill="#1a1a1a" />
    </SignSvg>
  );
}

export function SignalPedestrianGreen(p: SignProps) {
  return (
    <SignSvg {...p}>
      <rect x={28} y={10} width={44} height={80} rx={7} fill="#111" />
      <circle cx={50} cy={32} r={13} fill="#1a1a1a" />
      <circle cx={50} cy={68} r={13} fill={C.signalGreen} />
      <g fill="#07260f" transform="translate(50 68) scale(0.42)">
        <circle cx={0} cy={-16} r={6} />
        <path d="M-2 -10 Q-10 -6 -12 4 L-7 6 L-4 -1 L-4 6 L-11 18 H-5 L0 8 L6 18 H12 L4 4 V-3 L8 2 L12 0 Q9 -8 2 -10 Z" />
      </g>
    </SignSvg>
  );
}

export function SignalCyclist(p: SignProps) {
  return (
    <SignSvg {...p}>
      <rect x={28} y={10} width={44} height={80} rx={7} fill="#111" />
      <circle cx={50} cy={32} r={13} fill={C.signalRed} />
      <circle cx={50} cy={68} r={13} fill="#1a1a1a" />
      <g
        transform="translate(50 32) scale(0.5)"
        stroke="#3a0a0a"
        strokeWidth={4}
        fill="none"
      >
        <circle cx={-9} cy={5} r={6} />
        <circle cx={9} cy={5} r={6} />
        <path d="M-9 5 L-1 -5 H6 L9 5" />
      </g>
    </SignSvg>
  );
}

/** Tram / bus signal — bar lights, never coloured lamps. */
export function SignalTram(p: SignProps) {
  return (
    <SignSvg {...p}>
      <rect x={20} y={14} width={60} height={72} rx={7} fill="#111" />
      <g fill="#E8E8E8">
        <rect x={32} y={28} width={36} height={7} rx={3} />
      </g>
      <g fill="#2A2A2A">
        <rect x={46} y={44} width={8} height={26} rx={3} />
        <rect x={34} y={58} width={32} height={8} rx={3} />
      </g>
    </SignSvg>
  );
}

/** Overhead gantry: a lane closed with a red cross. */
export function SignalLaneClosed(p: SignProps) {
  return (
    <SignSvg {...p}>
      <rect x={10} y={20} width={80} height={60} rx={6} fill="#111" />
      <g stroke={C.signalRed} strokeWidth={11} strokeLinecap="round">
        <line x1={30} y1={34} x2={70} y2={66} />
        <line x1={70} y1={34} x2={30} y2={66} />
      </g>
    </SignSvg>
  );
}

/** Overhead gantry: diversion arrow into the next lane. */
export function SignalLaneDivert(p: SignProps) {
  return (
    <SignSvg {...p}>
      <rect x={10} y={20} width={80} height={60} rx={6} fill="#111" />
      <path
        d="M34 68 V54 Q34 44 50 44 H62"
        fill="none"
        stroke={C.signalYellow}
        strokeWidth={8}
        strokeLinecap="round"
      />
      <path d="M76 44 L58 34 V54 Z" fill={C.signalYellow} />
    </SignSvg>
  );
}
