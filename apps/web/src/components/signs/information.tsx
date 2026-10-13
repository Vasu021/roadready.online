import { InfoShell, SignSvg, SIGN_COLORS as C, Glyphs } from "./primitives";
import type { SignProps } from "./primitives";

// ── Richtzeichen (information signs) ─────────────────────────────────────────

export function InfoAutobahn(p: SignProps) {
  return (
    <InfoShell {...p} fill={C.autobahnBlue}>
      <g fill={C.white}>
        <path d="M22 78 L34 34 H44 L36 78 Z" />
        <path d="M78 78 L66 34 H56 L64 78 Z" />
        <rect x={44} y={34} width={12} height={10} />
        <rect x={30} y={24} width={40} height={7} rx={2} />
        <rect x={26} y={24} width={6} height={14} />
        <rect x={68} y={24} width={6} height={14} />
      </g>
    </InfoShell>
  );
}

export function InfoAutobahnEnd(p: SignProps) {
  return (
    <InfoShell {...p} fill={C.autobahnBlue}>
      <g fill={C.white} opacity={0.75}>
        <path d="M22 78 L34 34 H44 L36 78 Z" />
        <path d="M78 78 L66 34 H56 L64 78 Z" />
        <rect x={44} y={34} width={12} height={10} />
        <rect x={30} y={24} width={40} height={7} rx={2} />
        <rect x={26} y={24} width={6} height={14} />
        <rect x={68} y={24} width={6} height={14} />
      </g>
      <g stroke={C.red} strokeWidth={6} strokeLinecap="round">
        <line x1={14} y1={82} x2={86} y2={18} />
      </g>
    </InfoShell>
  );
}

export function InfoExpressway(p: SignProps) {
  return <InfoShell {...p}>{Glyphs.car(50, 54, 1.7, C.white)}</InfoShell>;
}

export function InfoBundesstrasse(p: SignProps) {
  return (
    <InfoShell {...p} fill={C.yellow} rx={3}>
      <text
        x={50}
        y={60}
        textAnchor="middle"
        fontSize={26}
        fontWeight="700"
        fill={C.black}
        fontFamily="system-ui, sans-serif"
      >
        B 264
      </text>
    </InfoShell>
  );
}

export function InfoOneWay(p: SignProps) {
  return (
    <SignSvg {...p}>
      <rect x={4} y={28} width={92} height={44} rx={4} fill={C.blue} />
      <path
        d="M24 50 H68"
        stroke={C.white}
        strokeWidth={10}
        strokeLinecap="round"
      />
      <path d="M84 50 L62 38 V62 Z" fill={C.white} />
    </SignSvg>
  );
}

export function InfoDeadEnd(p: SignProps) {
  return (
    <InfoShell {...p}>
      <rect x={44} y={48} width={12} height={34} fill={C.white} />
      <rect x={26} y={34} width={48} height={11} fill={C.red} />
    </InfoShell>
  );
}

export function InfoPedestrianZone(p: SignProps) {
  return (
    <InfoShell {...p}>
      {Glyphs.pedestrian(40, 60, 1.25, C.white)}
      <g transform="translate(22 6)">
        {Glyphs.pedestrian(40, 60, 0.85, C.white)}
      </g>
    </InfoShell>
  );
}

export function InfoPedestrianZoneEnd(p: SignProps) {
  return (
    <InfoShell {...p}>
      <g opacity={0.7}>
        {Glyphs.pedestrian(40, 60, 1.25, C.white)}
        <g transform="translate(22 6)">
          {Glyphs.pedestrian(40, 60, 0.85, C.white)}
        </g>
      </g>
      <line
        x1={12}
        y1={82}
        x2={88}
        y2={18}
        stroke={C.red}
        strokeWidth={6}
        strokeLinecap="round"
      />
    </InfoShell>
  );
}

export function InfoResidentialZone(p: SignProps) {
  return (
    <InfoShell {...p}>
      <g fill={C.white}>
        <path d="M14 48 L30 32 L46 48 V74 H14 Z" />
        <rect x={24} y={56} width={12} height={18} fill={C.blue} />
      </g>
      {Glyphs.pedestrian(62, 56, 0.95, C.white)}
      <g transform="translate(14 10)">
        {Glyphs.pedestrian(62, 56, 0.6, C.white)}
      </g>
      <circle cx={88} cy={72} r={5} fill={C.white} />
    </InfoShell>
  );
}

export function InfoResidentialZoneEnd(p: SignProps) {
  return (
    <InfoShell {...p}>
      <g opacity={0.7}>
        <g fill={C.white}>
          <path d="M14 48 L30 32 L46 48 V74 H14 Z" />
          <rect x={24} y={56} width={12} height={18} fill={C.blue} />
        </g>
        {Glyphs.pedestrian(62, 56, 0.95, C.white)}
        <circle cx={88} cy={72} r={5} fill={C.white} />
      </g>
      <line
        x1={12}
        y1={82}
        x2={88}
        y2={18}
        stroke={C.red}
        strokeWidth={6}
        strokeLinecap="round"
      />
    </InfoShell>
  );
}

export function InfoParking(p: SignProps) {
  return (
    <InfoShell {...p}>
      <text
        x={50}
        y={72}
        textAnchor="middle"
        fontSize={56}
        fontWeight="700"
        fill={C.white}
        fontFamily="system-ui, sans-serif"
      >
        P
      </text>
    </InfoShell>
  );
}

export function InfoHospital(p: SignProps) {
  return (
    <InfoShell {...p}>
      <g fill={C.white}>
        <rect x={20} y={54} width={52} height={10} rx={2} />
        <rect x={20} y={44} width={10} height={24} rx={2} />
        <path d="M58 30 h8 v7 h7 v8 h-7 v7 h-8 v-7 h-7 v-8 h7 z" />
        <circle cx={40} cy={48} r={5} />
      </g>
    </InfoShell>
  );
}

export function InfoFirstAid(p: SignProps) {
  return (
    <InfoShell {...p}>
      <rect x={28} y={30} width={44} height={40} rx={4} fill={C.white} />
      <path
        d="M46 36 h8 v10 h10 v8 h-10 v10 h-8 v-10 h-10 v-8 h10 z"
        fill={C.red}
      />
    </InfoShell>
  );
}

export function InfoFuelStation(p: SignProps) {
  return (
    <InfoShell {...p}>
      <g fill={C.white}>
        <path d="M34 28 H58 Q62 28 62 32 V74 H34 Z" />
        <rect x={38} y={34} width={16} height={12} fill={C.blue} />
        <path
          d="M64 40 H72 Q76 40 76 44 V62 Q76 66 72 66 Q68 66 68 62 V50 H62"
          fill="none"
          stroke={C.white}
          strokeWidth={5}
        />
      </g>
    </InfoShell>
  );
}

export function InfoPedestrianCrossingSign(p: SignProps) {
  return (
    <InfoShell {...p}>
      {Glyphs.pedestrian(50, 48, 1.15, C.white)}
      <g fill={C.white}>
        <rect x={22} y={70} width={8} height={10} />
        <rect x={36} y={70} width={8} height={10} />
        <rect x={50} y={70} width={8} height={10} />
        <rect x={64} y={70} width={8} height={10} />
      </g>
    </InfoShell>
  );
}

export function InfoBusStop(p: SignProps) {
  return (
    <SignSvg {...p}>
      <rect
        x={10}
        y={20}
        width={80}
        height={60}
        rx={5}
        fill={C.yellow}
        stroke={C.black}
        strokeWidth={3}
      />
      <circle cx={50} cy={50} r={22} fill={C.white} />
      <text
        x={50}
        y={62}
        textAnchor="middle"
        fontSize={30}
        fontWeight="800"
        fill={C.green}
        fontFamily="system-ui, sans-serif"
      >
        H
      </text>
    </SignSvg>
  );
}

export function InfoTownEntry(p: SignProps) {
  return (
    <SignSvg {...p}>
      <rect
        x={4}
        y={26}
        width={92}
        height={48}
        rx={3}
        fill={C.yellow}
        stroke={C.black}
        strokeWidth={3}
      />
      <text
        x={50}
        y={57}
        textAnchor="middle"
        fontSize={19}
        fontWeight="700"
        fill={C.black}
        fontFamily="system-ui, sans-serif"
      >
        Aachen
      </text>
    </SignSvg>
  );
}

export function InfoTownExit(p: SignProps) {
  return (
    <SignSvg {...p}>
      <rect
        x={4}
        y={26}
        width={92}
        height={48}
        rx={3}
        fill={C.yellow}
        stroke={C.black}
        strokeWidth={3}
      />
      <text
        x={50}
        y={57}
        textAnchor="middle"
        fontSize={19}
        fontWeight="700"
        fill={C.grey}
        fontFamily="system-ui, sans-serif"
      >
        Aachen
      </text>
      <line
        x1={10}
        y1={70}
        x2={90}
        y2={30}
        stroke={C.red}
        strokeWidth={5}
        strokeLinecap="round"
      />
    </SignSvg>
  );
}

export function InfoDistanceIndicator(p: SignProps) {
  return (
    <SignSvg {...p}>
      <rect x={4} y={20} width={92} height={60} rx={4} fill={C.autobahnBlue} />
      <g fill={C.white} fontFamily="system-ui, sans-serif">
        <text x={14} y={42} fontSize={15} fontWeight="600">
          Köln
        </text>
        <text x={82} y={42} fontSize={15} fontWeight="700" textAnchor="end">
          70
        </text>
        <rect x={12} y={50} width={76} height={2} opacity={0.6} />
        <text x={14} y={70} fontSize={15} fontWeight="600">
          Düren
        </text>
        <text x={82} y={70} fontSize={15} fontWeight="700" textAnchor="end">
          28
        </text>
      </g>
    </SignSvg>
  );
}
