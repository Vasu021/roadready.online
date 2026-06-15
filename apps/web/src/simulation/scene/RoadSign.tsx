import { useMemo } from "react";
import * as THREE from "three";

export type SignKind =
  | "give-way" // Vorfahrt gewähren (inverted triangle)
  | "stop" // Stoppschild (octagon)
  | "priority-road" // Vorfahrtstraße (yellow diamond)
  | "crossing" // Kreuzung — rechts vor links (cross in triangle)
  | "pedestrian-crossing" // Zebrastreifen (blue square + walker)
  | "speed-limit" // Zeichen 274 (red ring + number)
  | "roundabout" // Kreisverkehr (blue circle + arrows)
  | "no-entry" // Verbot der Einfahrt (red + white bar)
  | "no-overtaking" // Überholverbot (two cars)
  | "autobahn" // Autobahn (blue)
  | "tram" // Straßenbahn (triangle + tram)
  | "children"; // Kinder / school zone (triangle + figures)

interface Props {
  position: [number, number, number];
  kind: SignKind;
  /** Yaw so the face points at oncoming traffic. */
  rotationY?: number;
  /** Number for speed-limit (and similar) signs. */
  number?: number;
  label?: string;
  poleHeight?: number;
  /** Sign face size in metres. */
  size?: number;
}

const PX = 256;
const C = PX / 2;
const RED = "#c1121f";
const BLUE = "#1b4fa0";
const YELLOW = "#f5c842";
const BLACK = "#1a1a1a";
const WHITE = "#ffffff";

type Pt = [number, number];

function fillPoly(ctx: CanvasRenderingContext2D, pts: Pt[], color: string) {
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

/** Scale polygon points toward their centroid by factor f (0..1). */
function inset(pts: Pt[], f: number): Pt[] {
  const gx = pts.reduce((a, p) => a + p[0], 0) / pts.length;
  const gy = pts.reduce((a, p) => a + p[1], 0) / pts.length;
  return pts.map(([x, y]) => [gx + (x - gx) * f, gy + (y - gy) * f] as Pt);
}

function disc(ctx: CanvasRenderingContext2D, r: number, color: string) {
  ctx.beginPath();
  ctx.arc(C, C, r, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}

function diamondPts(half: number): Pt[] {
  return [
    [C, C - half],
    [C + half, C],
    [C, C + half],
    [C - half, C],
  ];
}

const TRI_UP: Pt[] = [
  [C, 22],
  [232, 214],
  [24, 214],
];
const TRI_DOWN: Pt[] = [
  [24, 42],
  [232, 42],
  [C, 234],
];

function triangleSign(
  ctx: CanvasRenderingContext2D,
  up: boolean,
  draw?: (ctx: CanvasRenderingContext2D) => void,
) {
  const outer = up ? TRI_UP : TRI_DOWN;
  fillPoly(ctx, outer, RED);
  fillPoly(ctx, inset(outer, 0.74), WHITE);
  draw?.(ctx);
}

function personGlyph(ctx: CanvasRenderingContext2D, cx: number, cy: number) {
  ctx.fillStyle = BLACK;
  ctx.beginPath();
  ctx.arc(cx, cy - 26, 9, 0, Math.PI * 2); // head
  ctx.fill();
  ctx.fillRect(cx - 6, cy - 16, 12, 24); // torso
  ctx.save();
  ctx.strokeStyle = BLACK;
  ctx.lineWidth = 6;
  ctx.beginPath(); // legs
  ctx.moveTo(cx, cy + 6);
  ctx.lineTo(cx - 9, cy + 26);
  ctx.moveTo(cx, cy + 6);
  ctx.lineTo(cx + 9, cy + 26);
  ctx.stroke();
  ctx.restore();
}

function carGlyph(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  color: string,
) {
  ctx.fillStyle = color;
  ctx.fillRect(cx - 26, cy - 6, 52, 18); // body
  ctx.fillRect(cx - 14, cy - 18, 28, 14); // cabin
  ctx.fillStyle = BLACK;
  ctx.beginPath();
  ctx.arc(cx - 15, cy + 12, 6, 0, Math.PI * 2);
  ctx.arc(cx + 15, cy + 12, 6, 0, Math.PI * 2);
  ctx.fill();
}

function drawSign(
  ctx: CanvasRenderingContext2D,
  kind: SignKind,
  num?: number,
  label?: string,
) {
  ctx.clearRect(0, 0, PX, PX);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  switch (kind) {
    case "give-way":
      triangleSign(ctx, false);
      break;

    case "stop": {
      const r = 120;
      const oct: Pt[] = Array.from({ length: 8 }, (_, i) => {
        const a = Math.PI / 8 + (i * Math.PI) / 4;
        return [C + r * Math.cos(a), C + r * Math.sin(a)] as Pt;
      });
      fillPoly(ctx, oct, RED);
      fillPoly(ctx, inset(oct, 0.9), RED);
      ctx.fillStyle = WHITE;
      ctx.font = "bold 64px Arial";
      ctx.fillText("STOP", C, C + 4);
      break;
    }

    case "priority-road":
      fillPoly(ctx, diamondPts(118), WHITE);
      fillPoly(ctx, diamondPts(100), BLACK);
      fillPoly(ctx, diamondPts(86), YELLOW);
      break;

    case "crossing":
      triangleSign(ctx, true, (c) => {
        c.fillStyle = BLACK;
        c.fillRect(C - 8, 96, 16, 96); // vertical
        c.fillRect(C - 48, 136, 96, 16); // horizontal
      });
      break;

    case "pedestrian-crossing": {
      ctx.fillStyle = BLUE;
      ctx.fillRect(18, 18, PX - 36, PX - 36);
      fillPoly(
        ctx,
        [
          [C, 70],
          [206, 210],
          [50, 210],
        ],
        WHITE,
      );
      personGlyph(ctx, C + 4, 168);
      break;
    }

    case "speed-limit":
      disc(ctx, 120, RED);
      disc(ctx, 92, WHITE);
      ctx.fillStyle = BLACK;
      ctx.font = "bold 110px Arial";
      ctx.fillText(String(num ?? 50), C, C + 6);
      break;

    case "roundabout": {
      disc(ctx, 120, BLUE);
      ctx.strokeStyle = WHITE;
      ctx.lineWidth = 18;
      ctx.beginPath();
      ctx.arc(C, C, 58, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = WHITE;
      for (let k = 0; k < 3; k++) {
        const a = -Math.PI / 2 + (k * 2 * Math.PI) / 3;
        const ax = C + 58 * Math.cos(a);
        const ay = C + 58 * Math.sin(a);
        ctx.save();
        ctx.translate(ax, ay);
        ctx.rotate(a + Math.PI / 2); // tangent (clockwise)
        ctx.beginPath();
        ctx.moveTo(0, -20);
        ctx.lineTo(16, 6);
        ctx.lineTo(-16, 6);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
      break;
    }

    case "no-entry":
      disc(ctx, 120, RED);
      ctx.fillStyle = WHITE;
      ctx.fillRect(C - 76, C - 18, 152, 36);
      break;

    case "no-overtaking":
      disc(ctx, 120, RED);
      disc(ctx, 96, WHITE);
      carGlyph(ctx, C - 28, C + 2, RED);
      carGlyph(ctx, C + 28, C + 2, BLACK);
      break;

    case "autobahn": {
      ctx.fillStyle = BLUE;
      ctx.fillRect(20, 20, PX - 40, PX - 40);
      ctx.fillStyle = WHITE; // simplified motorway glyph
      fillPoly(
        ctx,
        [
          [C - 10, 70],
          [C + 10, 70],
          [C + 52, 200],
          [C + 28, 200],
          [C, 110],
          [C - 28, 200],
          [C - 52, 200],
        ],
        WHITE,
      );
      ctx.fillRect(C - 64, 196, 128, 12);
      break;
    }

    case "tram":
      triangleSign(ctx, true, (c) => {
        c.fillStyle = BLACK;
        c.fillRect(C - 34, 110, 68, 70); // body
        c.fillStyle = WHITE;
        c.fillRect(C - 26, 120, 52, 22); // window
        c.fillStyle = BLACK;
        c.fillRect(C - 2, 70, 4, 42); // pole
        c.beginPath();
        c.arc(C - 20, 186, 7, 0, Math.PI * 2);
        c.arc(C + 20, 186, 7, 0, Math.PI * 2);
        c.fill();
      });
      break;

    case "children":
      triangleSign(ctx, true, (c) => {
        personGlyph(c, C - 22, 168);
        personGlyph(c, C + 18, 172);
      });
      break;
  }

  if (label) {
    ctx.fillStyle = BLACK;
    ctx.font = "bold 40px Arial";
    ctx.fillText(label, C, C + 4);
  }
}

export default function RoadSign({
  position,
  kind,
  rotationY = 0,
  number,
  label,
  poleHeight = 2.2,
  size = 0.78,
}: Props) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = PX;
    canvas.height = PX;
    const ctx = canvas.getContext("2d");
    if (ctx) drawSign(ctx, kind, number, label);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    tex.needsUpdate = true;
    return tex;
  }, [kind, number, label]);

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Pole */}
      <mesh position={[0, poleHeight / 2, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.05, poleHeight, 8]} />
        <meshStandardMaterial color="#9aa0a6" metalness={0.6} roughness={0.5} />
      </mesh>
      {/* Sign face (double-sided so it reads from both directions) */}
      <mesh position={[0, poleHeight + size / 2 - 0.1, 0]}>
        <planeGeometry args={[size, size]} />
        <meshBasicMaterial
          map={texture}
          transparent
          alphaTest={0.4}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}
