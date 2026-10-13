import type { RoadLayout } from "@roadready/shared";
import { SURFACE as S, W, H } from "./geometry";

const DASH = { stroke: S.line, strokeWidth: 2.5, strokeDasharray: "12 14" };

function Verge() {
  return <rect x={0} y={0} width={W} height={H} fill={S.verge} />;
}

function VerticalRoad({
  x = 150,
  width = 100,
}: {
  x?: number;
  width?: number;
}) {
  return (
    <g>
      <rect x={x} y={0} width={width} height={H} fill={S.asphalt} />
      <rect x={x - 3} y={0} width={3} height={H} fill={S.kerb} />
      <rect x={x + width} y={0} width={3} height={H} fill={S.kerb} />
      <line
        x1={x + 6}
        y1={0}
        x2={x + 6}
        y2={H}
        stroke={S.line}
        strokeWidth={2}
      />
      <line
        x1={x + width - 6}
        y1={0}
        x2={x + width - 6}
        y2={H}
        stroke={S.line}
        strokeWidth={2}
      />
    </g>
  );
}

function HorizontalRoad({
  y = 110,
  height = 80,
}: {
  y?: number;
  height?: number;
}) {
  return (
    <g>
      <rect x={0} y={y} width={W} height={height} fill={S.asphalt} />
      <line
        x1={0}
        y1={y + 6}
        x2={W}
        y2={y + 6}
        stroke={S.line}
        strokeWidth={2}
      />
      <line
        x1={0}
        y1={y + height - 6}
        x2={W}
        y2={y + height - 6}
        stroke={S.line}
        strokeWidth={2}
      />
    </g>
  );
}

/** The road surface for one layout, drawn before anything else. */
export function Road({ layout }: { layout: RoadLayout }) {
  switch (layout) {
    case "crossroads":
    case "tram":
      return (
        <g>
          <Verge />
          <VerticalRoad />
          <HorizontalRoad />
          <line x1={200} y1={0} x2={200} y2={110} {...DASH} />
          <line x1={200} y1={190} x2={200} y2={H} {...DASH} />
          <line x1={0} y1={150} x2={150} y2={150} {...DASH} />
          <line x1={250} y1={150} x2={W} y2={150} {...DASH} />
          {layout === "tram" && (
            <g stroke={S.rail} strokeWidth={2.5}>
              <line x1={0} y1={140} x2={W} y2={140} />
              <line x1={0} y1={160} x2={W} y2={160} />
            </g>
          )}
        </g>
      );

    case "t-junction":
      return (
        <g>
          <Verge />
          <rect x={150} y={110} width={100} height={H - 110} fill={S.asphalt} />
          <HorizontalRoad />
          <rect x={147} y={110} width={3} height={H - 110} fill={S.kerb} />
          <rect x={250} y={110} width={3} height={H - 110} fill={S.kerb} />
          <line x1={200} y1={190} x2={200} y2={H} {...DASH} />
          <line x1={0} y1={150} x2={W} y2={150} {...DASH} />
        </g>
      );

    case "roundabout":
      return (
        <g>
          <Verge />
          <VerticalRoad />
          <HorizontalRoad />
          <circle cx={200} cy={150} r={92} fill={S.asphalt} />
          <circle
            cx={200}
            cy={150}
            r={92}
            fill="none"
            stroke={S.line}
            strokeWidth={2}
          />
          <circle cx={200} cy={150} r={46} fill={S.verge} />
          <circle
            cx={200}
            cy={150}
            r={46}
            fill="none"
            stroke={S.line}
            strokeWidth={2.5}
          />
        </g>
      );

    case "motorway":
      return (
        <g>
          <Verge />
          <rect x={110} y={0} width={180} height={H} fill={S.asphalt} />
          <rect x={290} y={0} width={22} height={H} fill={S.asphaltDark} />
          <line
            x1={112}
            y1={0}
            x2={112}
            y2={H}
            stroke={S.line}
            strokeWidth={2}
          />
          <line
            x1={288}
            y1={0}
            x2={288}
            y2={H}
            stroke={S.line}
            strokeWidth={3}
          />
          <line x1={200} y1={0} x2={200} y2={H} {...DASH} />
        </g>
      );

    case "zebra":
      return (
        <g>
          <Verge />
          <VerticalRoad />
          <line x1={200} y1={0} x2={200} y2={H} {...DASH} />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <rect
              key={i}
              x={154 + i * 16}
              y={118}
              width={9}
              height={34}
              fill={S.line}
            />
          ))}
        </g>
      );

    case "narrowing":
      return (
        <g>
          <Verge />
          <VerticalRoad />
          <path
            d={`M150 0 L150 110 L178 150 L178 ${H} L150 ${H} L150 0 Z`}
            fill={S.verge}
          />
          <path
            d={`M250 0 L250 100 L226 140 L226 ${H} L250 ${H} L250 0 Z`}
            fill={S.verge}
          />
          <line x1={202} y1={190} x2={202} y2={H} {...DASH} />
        </g>
      );

    case "level-crossing":
      return (
        <g>
          <Verge />
          <VerticalRoad />
          <rect x={0} y={120} width={W} height={34} fill={S.asphaltDark} />
          <g stroke={S.rail} strokeWidth={3}>
            <line x1={0} y1={130} x2={W} y2={130} />
            <line x1={0} y1={146} x2={W} y2={146} />
          </g>
          <rect x={150} y={168} width={100} height={5} fill={S.line} />
        </g>
      );

    case "parking":
      return (
        <g>
          <Verge />
          <VerticalRoad />
          <line x1={200} y1={0} x2={200} y2={H} {...DASH} />
          <g stroke={S.line} strokeWidth={2}>
            {[40, 90, 140, 190, 240].map((y) => (
              <line key={y} x1={253} y1={y} x2={290} y2={y} />
            ))}
            <line x1={290} y1={40} x2={290} y2={240} />
          </g>
        </g>
      );

    case "bus-stop":
      return (
        <g>
          <Verge />
          <VerticalRoad />
          <line x1={200} y1={0} x2={200} y2={H} {...DASH} />
          <rect x={250} y={90} width={38} height={80} fill={S.asphaltDark} />
          <rect x={288} y={90} width={3} height={80} fill={S.kerb} />
        </g>
      );

    case "one-way":
      return (
        <g>
          <Verge />
          <VerticalRoad />
          <g fill={S.line}>
            <path d="M196 70 L204 70 L204 50 L210 50 L200 34 L190 50 L196 50 Z" />
          </g>
        </g>
      );

    case "curve":
      return (
        <g>
          <Verge />
          <path
            d={`M150 ${H} L150 170 Q150 90 250 70 L${W} 70 L${W} 150 L250 150 Q230 155 230 180 L230 ${H} Z`}
            fill={S.asphalt}
          />
          <path
            d={`M190 ${H} L190 175 Q190 118 250 110`}
            fill="none"
            {...DASH}
          />
        </g>
      );

    case "straight":
    default:
      return (
        <g>
          <Verge />
          <VerticalRoad />
          <line x1={200} y1={0} x2={200} y2={H} {...DASH} />
        </g>
      );
  }
}

/** Optional markings layered on top of the road surface. */
export function Markings({ kinds }: { kinds: string[] }) {
  return (
    <g>
      {kinds.includes("zebra") &&
        [0, 1, 2, 3, 4, 5].map((i) => (
          <rect
            key={`z${i}`}
            x={154 + i * 16}
            y={118}
            width={9}
            height={34}
            fill={S.line}
          />
        ))}
      {kinds.includes("stop-line") && (
        <rect x={152} y={196} width={46} height={6} fill={S.line} />
      )}
      {kinds.includes("give-way-line") &&
        [0, 1, 2, 3].map((i) => (
          <rect
            key={`g${i}`}
            x={154 + i * 13}
            y={196}
            width={8}
            height={5}
            fill={S.line}
          />
        ))}
      {kinds.includes("solid-centre") && (
        <line x1={200} y1={0} x2={200} y2={H} stroke={S.line} strokeWidth={3} />
      )}
      {kinds.includes("cycle-lane") && (
        <g>
          <line
            x1={258}
            y1={0}
            x2={258}
            y2={H}
            stroke={S.line}
            strokeWidth={2.5}
          />
          <circle
            cx={272}
            cy={150}
            r={6}
            fill="none"
            stroke={S.line}
            strokeWidth={1.6}
          />
        </g>
      )}
      {kinds.includes("hatching") && (
        <g stroke={S.line} strokeWidth={1.6}>
          <rect
            x={206}
            y={100}
            width={40}
            height={90}
            fill="none"
            strokeWidth={2}
          />
          {[0, 1, 2, 3, 4].map((i) => (
            <line
              key={`h${i}`}
              x1={206}
              y1={190 - i * 22}
              x2={246}
              y2={150 - i * 22}
            />
          ))}
        </g>
      )}
      {kinds.includes("bays") && (
        <g stroke={S.line} strokeWidth={2}>
          {[60, 110, 160, 210].map((y) => (
            <line key={`b${y}`} x1={253} y1={y} x2={288} y2={y} />
          ))}
        </g>
      )}
    </g>
  );
}
