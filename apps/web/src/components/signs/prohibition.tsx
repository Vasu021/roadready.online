import {
  ProhibitionShell,
  EndSlash,
  SignSvg,
  SIGN_COLORS as C,
  Glyphs,
} from "./primitives";
import type { SignProps } from "./primitives";

// ── Verbotszeichen (prohibition) — red ring, white field ─────────────────────

export function ProhibitNoEntry(p: SignProps) {
  return (
    <SignSvg {...p}>
      <circle cx={50} cy={50} r={45} fill={C.red} />
      <rect x={18} y={43} width={64} height={14} rx={2} fill={C.white} />
    </SignSvg>
  );
}

/** Zeichen 250 — closed to vehicles of every kind. */
export function ProhibitAllVehicles(p: SignProps) {
  return <ProhibitionShell {...p} />;
}

/** Zeichen 251 — no cars. */
export function ProhibitCars(p: SignProps) {
  return (
    <ProhibitionShell {...p}>
      {Glyphs.car(50, 48, 1.5, C.black)}
    </ProhibitionShell>
  );
}

/** Zeichen 260 — no motor vehicles of any kind. */
export function ProhibitMotorVehicles(p: SignProps) {
  return (
    <ProhibitionShell {...p}>
      {Glyphs.motorcycle(44, 36, 0.78, C.black)}
      {Glyphs.car(56, 64, 1.1, C.black)}
    </ProhibitionShell>
  );
}

export function ProhibitMotorcycles(p: SignProps) {
  return (
    <ProhibitionShell {...p}>
      {Glyphs.motorcycle(50, 48, 1.25, C.black)}
    </ProhibitionShell>
  );
}

export function ProhibitTrucks(p: SignProps) {
  return (
    <ProhibitionShell {...p}>
      {Glyphs.truck(52, 48, 1.3, C.black)}
    </ProhibitionShell>
  );
}

export function ProhibitCyclists(p: SignProps) {
  return (
    <ProhibitionShell {...p}>
      {Glyphs.bicycle(50, 50, 1.25, C.black)}
    </ProhibitionShell>
  );
}

export function ProhibitPedestrians(p: SignProps) {
  return (
    <ProhibitionShell {...p}>
      {Glyphs.pedestrian(50, 54, 1.3, C.black)}
    </ProhibitionShell>
  );
}

/** Speed limit — the number is the only variable part. */
export function SpeedLimit({ value, ...p }: SignProps & { value: number }) {
  return (
    <ProhibitionShell {...p}>
      <text
        x={50}
        y={64}
        textAnchor="middle"
        fontSize={value >= 100 ? 33 : 40}
        fontWeight="700"
        fill={C.black}
        fontFamily="system-ui, sans-serif"
      >
        {value}
      </text>
    </ProhibitionShell>
  );
}

export const ProhibitSpeed30 = (p: SignProps) => (
  <SpeedLimit {...p} value={30} />
);
export const ProhibitSpeed50 = (p: SignProps) => (
  <SpeedLimit {...p} value={50} />
);
export const ProhibitSpeed70 = (p: SignProps) => (
  <SpeedLimit {...p} value={70} />
);
export const ProhibitSpeed100 = (p: SignProps) => (
  <SpeedLimit {...p} value={100} />
);
export const ProhibitSpeed130 = (p: SignProps) => (
  <SpeedLimit {...p} value={130} />
);

/** Zeichen 274.1 — start of a 30 km/h zone. */
export function ProhibitZone30(p: SignProps) {
  return (
    <SignSvg {...p}>
      <rect
        x={10}
        y={10}
        width={80}
        height={80}
        rx={4}
        fill={C.white}
        stroke={C.black}
        strokeWidth={3}
      />
      <text
        x={50}
        y={30}
        textAnchor="middle"
        fontSize={15}
        fontWeight="600"
        fill={C.black}
        fontFamily="system-ui, sans-serif"
      >
        ZONE
      </text>
      <circle cx={50} cy={60} r={24} fill={C.white} />
      <circle
        cx={50}
        cy={60}
        r={21}
        fill="none"
        stroke={C.red}
        strokeWidth={6}
      />
      <text
        x={50}
        y={70}
        textAnchor="middle"
        fontSize={22}
        fontWeight="700"
        fill={C.black}
        fontFamily="system-ui, sans-serif"
      >
        30
      </text>
    </SignSvg>
  );
}

export function ProhibitSpeedLimitEnd(p: SignProps) {
  return (
    <SignSvg {...p}>
      <circle cx={50} cy={50} r={45} fill={C.white} />
      <circle
        cx={50}
        cy={50}
        r={40}
        fill="none"
        stroke={C.lightGrey}
        strokeWidth={6}
      />
      <text
        x={50}
        y={64}
        textAnchor="middle"
        fontSize={40}
        fontWeight="700"
        fill={C.grey}
        fontFamily="system-ui, sans-serif"
      >
        50
      </text>
      <EndSlash count={3} />
    </SignSvg>
  );
}

export function ProhibitNoOvertaking(p: SignProps) {
  return (
    <ProhibitionShell {...p}>
      {Glyphs.car(36, 56, 1.0, C.black)}
      {Glyphs.car(64, 48, 1.0, C.red)}
    </ProhibitionShell>
  );
}

export function ProhibitNoOvertakingTrucks(p: SignProps) {
  return (
    <ProhibitionShell {...p}>
      {Glyphs.car(34, 58, 0.9, C.black)}
      {Glyphs.truck(64, 46, 0.95, C.red)}
    </ProhibitionShell>
  );
}

export function ProhibitOvertakingEnd(p: SignProps) {
  return (
    <SignSvg {...p}>
      <circle cx={50} cy={50} r={45} fill={C.white} />
      <circle
        cx={50}
        cy={50}
        r={40}
        fill="none"
        stroke={C.lightGrey}
        strokeWidth={6}
      />
      {Glyphs.car(36, 56, 1.0, C.grey)}
      {Glyphs.car(64, 48, 1.0, C.grey)}
      <EndSlash count={3} />
    </SignSvg>
  );
}

/** Zeichen 286 — no parking (one bar): short stops are still allowed. */
export function ProhibitNoParking(p: SignProps) {
  return (
    <SignSvg {...p}>
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
    </SignSvg>
  );
}

/** Zeichen 283 — no stopping at all (two crossed bars). */
export function ProhibitNoStopping(p: SignProps) {
  return (
    <SignSvg {...p}>
      <circle cx={50} cy={50} r={45} fill={C.blue} />
      <circle
        cx={50}
        cy={50}
        r={40}
        fill="none"
        stroke={C.red}
        strokeWidth={9}
      />
      <g stroke={C.red} strokeWidth={9} strokeLinecap="round">
        <line x1={24} y1={76} x2={76} y2={24} />
        <line x1={24} y1={24} x2={76} y2={76} />
      </g>
    </SignSvg>
  );
}

export function ProhibitNoUTurn(p: SignProps) {
  return (
    <ProhibitionShell {...p}>
      <path
        d="M62 74 V48 Q62 32 50 32 Q38 32 38 48 V58"
        fill="none"
        stroke={C.black}
        strokeWidth={8}
        strokeLinecap="round"
      />
      <path d="M38 72 L29 54 H47 Z" fill={C.black} />
    </ProhibitionShell>
  );
}

export function ProhibitWeightLimit(p: SignProps) {
  return (
    <ProhibitionShell {...p}>
      <text
        x={50}
        y={62}
        textAnchor="middle"
        fontSize={27}
        fontWeight="700"
        fill={C.black}
        fontFamily="system-ui, sans-serif"
      >
        5,5t
      </text>
    </ProhibitionShell>
  );
}

export function ProhibitHeightLimit(p: SignProps) {
  return (
    <ProhibitionShell {...p}>
      <g stroke={C.black} strokeWidth={4} fill={C.black}>
        <path d="M22 34 H78 M22 66 H78" />
        <path d="M50 38 L45 46 H55 Z M50 62 L45 54 H55 Z" />
        <line x1={50} y1={40} x2={50} y2={60} strokeWidth={3} />
      </g>
      <text
        x={50}
        y={82}
        textAnchor="middle"
        fontSize={17}
        fontWeight="700"
        fill={C.black}
        fontFamily="system-ui, sans-serif"
      >
        3,8m
      </text>
    </ProhibitionShell>
  );
}

export function ProhibitAllRestrictionsEnd(p: SignProps) {
  return (
    <SignSvg {...p}>
      <circle cx={50} cy={50} r={45} fill={C.white} />
      <circle
        cx={50}
        cy={50}
        r={40}
        fill="none"
        stroke={C.lightGrey}
        strokeWidth={5}
      />
      <EndSlash count={3} />
    </SignSvg>
  );
}
