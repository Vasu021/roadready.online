import { SignSvg, SIGN_COLORS as C } from "./primitives";
import type { ReactNode } from "react";
import type { SignProps } from "./primitives";

// ── Kombinationen — a sign with the supplementary plate that modifies it ─────
// Real posts almost never carry a single plate, and the combination changes the
// meaning. Each component stacks the main sign over its plate on one post.

function Stack({
  size = 80,
  className,
  children,
}: SignProps & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 140"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      focusable="false"
      style={{ overflow: "visible" }}
    >
      {children}
      <rect x={47} y={126} width={6} height={14} fill={C.grey} rx={2} />
    </svg>
  );
}

function Plate({
  y,
  label,
  fontSize = 15,
}: {
  y: number;
  label: string;
  fontSize?: number;
}) {
  return (
    <g transform={`translate(0 ${y})`}>
      <rect
        x={8}
        y={0}
        width={84}
        height={30}
        rx={3}
        fill={C.white}
        stroke={C.black}
        strokeWidth={3}
      />
      <text
        x={50}
        y={21}
        textAnchor="middle"
        fontSize={fontSize}
        fontWeight="600"
        fill={C.black}
        fontFamily="system-ui, sans-serif"
      >
        {label}
      </text>
    </g>
  );
}

/** Speed limit 30 that only applies on a wet road surface. */
export function ComboSpeed30WhenWet(p: SignProps) {
  return (
    <Stack {...p}>
      <g transform="translate(5 0) scale(0.9)">
        <circle cx={50} cy={50} r={45} fill={C.white} />
        <circle
          cx={50}
          cy={50}
          r={40}
          fill="none"
          stroke={C.red}
          strokeWidth={10}
        />
        <text
          x={50}
          y={64}
          textAnchor="middle"
          fontSize={40}
          fontWeight="700"
          fill={C.black}
          fontFamily="system-ui, sans-serif"
        >
          30
        </text>
      </g>
      <Plate y={94} label="bei Nässe" />
    </Stack>
  );
}

/** No parking, but residents may still park. */
export function ComboNoParkingResidents(p: SignProps) {
  return (
    <Stack {...p}>
      <g transform="translate(5 0) scale(0.9)">
        <circle cx={50} cy={50} r={45} fill={C.blue} />
        <circle
          cx={50}
          cy={50}
          r={40}
          fill="none"
          stroke={C.red}
          strokeWidth={9}
        />
        <line
          x1={24}
          y1={76}
          x2={76}
          y2={24}
          stroke={C.red}
          strokeWidth={9}
          strokeLinecap="round"
        />
      </g>
      <Plate y={94} label="Anlieger frei" />
    </Stack>
  );
}

/** Priority road with the plate showing how the priority road bends. */
export function ComboPriorityRoadCourse(p: SignProps) {
  return (
    <Stack {...p}>
      <g transform="translate(5 0) scale(0.9)">
        <path d="M50 3 L97 50 L50 97 L3 50 Z" fill={C.white} />
        <path d="M50 14 L86 50 L50 86 L14 50 Z" fill={C.yellow} />
      </g>
      <g transform="translate(0 94)">
        <rect
          x={8}
          y={0}
          width={84}
          height={30}
          rx={3}
          fill={C.white}
          stroke={C.black}
          strokeWidth={3}
        />
        <path
          d="M24 22 H50 V10"
          fill="none"
          stroke={C.black}
          strokeWidth={6}
          strokeLinecap="square"
        />
        <path d="M50 4 L57 15 H43 Z" fill={C.black} />
        <path
          d="M62 16 H76"
          stroke={C.black}
          strokeWidth={3}
          strokeLinecap="round"
        />
      </g>
    </Stack>
  );
}

/** Give way, announced 100 m in advance. */
export function ComboGiveWayIn100m(p: SignProps) {
  return (
    <Stack {...p}>
      <g transform="translate(5 0) scale(0.9)">
        <path
          d="M4 12 H96 L50 93 Z"
          fill={C.white}
          stroke={C.red}
          strokeWidth={9}
          strokeLinejoin="round"
        />
      </g>
      <Plate y={94} label="100 m" />
    </Stack>
  );
}

/** Children warning that applies for the next 2 km. */
export function ComboChildrenNext2km(p: SignProps) {
  return (
    <Stack {...p}>
      <g transform="translate(5 0) scale(0.9)">
        <path
          d="M50 7 L96 88 H4 Z"
          fill={C.white}
          stroke={C.red}
          strokeWidth={9}
          strokeLinejoin="round"
        />
        <g fill={C.black} transform="translate(40 62) scale(0.95)">
          <circle cx={0} cy={-15} r={4.4} />
          <path d="M-1.5 -10 Q-7 -8 -8 -1 L-5 0 L-3.5 -5 V3 L-8 15 H-4 L0 5 L4 15 H8 L4 2 V-4 L7 0 L9 -2 Q7 -9 1.5 -10 Z" />
        </g>
        <g fill={C.black} transform="translate(60 66) scale(0.7)">
          <circle cx={0} cy={-15} r={4.4} />
          <path d="M-1.5 -10 Q-7 -8 -8 -1 L-5 0 L-3.5 -5 V3 L-8 15 H-4 L0 5 L4 15 H8 L4 2 V-4 L7 0 L9 -2 Q7 -9 1.5 -10 Z" />
        </g>
      </g>
      <Plate y={94} label="auf 2 km" />
    </Stack>
  );
}

/** No entry for trucks only — the plate narrows the prohibition. */
export function ComboNoEntryTrucksOnly(p: SignProps) {
  return (
    <Stack {...p}>
      <g transform="translate(5 0) scale(0.9)">
        <circle cx={50} cy={50} r={45} fill={C.red} />
        <rect x={18} y={43} width={64} height={14} rx={2} fill={C.white} />
      </g>
      <g transform="translate(0 94)">
        <rect
          x={8}
          y={0}
          width={84}
          height={30}
          rx={3}
          fill={C.white}
          stroke={C.black}
          strokeWidth={3}
        />
        <g fill={C.black} transform="translate(50 15) scale(0.72)">
          <rect x={-22} y={-10} width={24} height={16} rx={1.5} />
          <path d="M4 -4 H14 L20 2 V6 H4 Z" />
          <circle cx={-14} cy={8} r={3.6} />
          <circle cx={13} cy={8} r={3.6} />
        </g>
      </g>
    </Stack>
  );
}

/** Red light with the green-arrow plate beside it. */
export function ComboRedLightGreenArrow(p: SignProps) {
  return (
    <SignSvg {...p}>
      <rect x={14} y={6} width={40} height={88} rx={8} fill="#111" />
      <circle cx={34} cy={26} r={11} fill={C.signalRed} />
      <circle cx={34} cy={50} r={11} fill="#2A2A2A" />
      <circle cx={34} cy={74} r={11} fill="#2A2A2A" />
      <rect
        x={58}
        y={14}
        width={32}
        height={32}
        rx={3}
        fill={C.black}
        stroke={C.grey}
        strokeWidth={2}
      />
      <path d="M64 34 H74 V26 L84 32 L74 38 V34 H64 Z" fill={C.signalGreen} />
    </SignSvg>
  );
}

/** Pedestrian zone open to delivery traffic at set hours. */
export function ComboPedestrianZoneDelivery(p: SignProps) {
  return (
    <Stack {...p}>
      <g transform="translate(5 0) scale(0.9)">
        <rect x={6} y={14} width={88} height={72} rx={6} fill={C.blue} />
        <g fill={C.white} transform="translate(40 60) scale(1.15)">
          <circle cx={0} cy={-15} r={4.4} />
          <path d="M-1.5 -10 Q-7 -8 -8 -1 L-5 0 L-3.5 -5 V3 L-8 15 H-4 L0 5 L4 15 H8 L4 2 V-4 L7 0 L9 -2 Q7 -9 1.5 -10 Z" />
        </g>
        <g fill={C.white} transform="translate(62 66) scale(0.8)">
          <circle cx={0} cy={-15} r={4.4} />
          <path d="M-1.5 -10 Q-7 -8 -8 -1 L-5 0 L-3.5 -5 V3 L-8 15 H-4 L0 5 L4 15 H8 L4 2 V-4 L7 0 L9 -2 Q7 -9 1.5 -10 Z" />
        </g>
      </g>
      <Plate y={94} label="Lieferverkehr frei" fontSize={11} />
    </Stack>
  );
}
