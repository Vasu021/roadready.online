import type { RoadLayout, SceneSlot } from "@roadready/shared";

/** Scenes are drawn in a fixed 400 x 300 top-down frame. */
export const W = 400;
export const H = 300;

export interface Placement {
  x: number;
  y: number;
  /** Degrees; 0 points north (up the frame). */
  rot: number;
}

type SlotMap = Partial<Record<SceneSlot, Placement>>;

const VERTICAL_ROAD: SlotMap = {
  south: { x: 185, y: 250, rot: 0 },
  "south-far": { x: 185, y: 285, rot: 0 },
  ahead: { x: 185, y: 120, rot: 0 },
  behind: { x: 185, y: 282, rot: 0 },
  oncoming: { x: 222, y: 95, rot: 180 },
  north: { x: 222, y: 55, rot: 180 },
  "north-far": { x: 222, y: 20, rot: 180 },
  centre: { x: 200, y: 150, rot: 0 },
  "kerb-right": { x: 272, y: 170, rot: 0 },
  "kerb-left": { x: 128, y: 170, rot: 180 },
  "right-verge": { x: 300, y: 196, rot: 0 },
  "left-verge": { x: 100, y: 196, rot: 0 },
  crossing: { x: 200, y: 132, rot: 90 },
  shoulder: { x: 268, y: 210, rot: 0 },
};

const CROSS: SlotMap = {
  south: { x: 185, y: 250, rot: 0 },
  "south-far": { x: 185, y: 288, rot: 0 },
  north: { x: 222, y: 52, rot: 180 },
  "north-far": { x: 222, y: 16, rot: 180 },
  east: { x: 348, y: 132, rot: 270 },
  "east-far": { x: 388, y: 132, rot: 270 },
  west: { x: 56, y: 170, rot: 90 },
  "west-far": { x: 16, y: 170, rot: 90 },
  centre: { x: 200, y: 150, rot: 0 },
  ahead: { x: 185, y: 60, rot: 0 },
  behind: { x: 185, y: 290, rot: 0 },
  oncoming: { x: 222, y: 70, rot: 180 },
  crossing: { x: 200, y: 222, rot: 90 },
  "right-verge": { x: 300, y: 232, rot: 0 },
  "left-verge": { x: 96, y: 232, rot: 0 },
  "kerb-right": { x: 280, y: 238, rot: 0 },
  "kerb-left": { x: 120, y: 238, rot: 0 },
  "exit-north": { x: 185, y: 60, rot: 0 },
  "exit-east": { x: 340, y: 170, rot: 270 },
  "exit-west": { x: 60, y: 132, rot: 90 },
};

const ROUNDABOUT: SlotMap = {
  south: { x: 185, y: 262, rot: 0 },
  north: { x: 222, y: 40, rot: 180 },
  east: { x: 358, y: 132, rot: 270 },
  west: { x: 46, y: 170, rot: 90 },
  centre: { x: 200, y: 150, rot: 0 },
  "right-verge": { x: 300, y: 246, rot: 0 },
  "left-verge": { x: 96, y: 246, rot: 0 },
  ahead: { x: 150, y: 110, rot: 315 },
  behind: { x: 185, y: 290, rot: 0 },
};

const MOTORWAY: SlotMap = {
  "left-lane": { x: 158, y: 150, rot: 0 },
  "right-lane": { x: 242, y: 150, rot: 0 },
  ahead: { x: 242, y: 70, rot: 0 },
  behind: { x: 242, y: 265, rot: 0 },
  south: { x: 242, y: 230, rot: 0 },
  north: { x: 158, y: 60, rot: 0 },
  centre: { x: 200, y: 150, rot: 0 },
  shoulder: { x: 300, y: 180, rot: 0 },
  "right-verge": { x: 332, y: 196, rot: 0 },
  "left-verge": { x: 68, y: 196, rot: 0 },
};

/** Every layout falls back to the plain vertical road for unmapped slots. */
const LAYOUTS: Record<RoadLayout, SlotMap> = {
  straight: VERTICAL_ROAD,
  curve: VERTICAL_ROAD,
  "t-junction": {
    ...CROSS,
    north: { x: 222, y: 90, rot: 180 },
    ahead: { x: 185, y: 150, rot: 0 },
  },
  crossroads: CROSS,
  roundabout: ROUNDABOUT,
  motorway: MOTORWAY,
  "one-way": VERTICAL_ROAD,
  narrowing: {
    ...VERTICAL_ROAD,
    oncoming: { x: 210, y: 92, rot: 180 },
    ahead: { x: 190, y: 130, rot: 0 },
  },
  "level-crossing": VERTICAL_ROAD,
  tram: CROSS,
  parking: VERTICAL_ROAD,
  zebra: VERTICAL_ROAD,
  "bus-stop": {
    ...VERTICAL_ROAD,
    ahead: { x: 196, y: 118, rot: 0 },
    "kerb-right": { x: 268, y: 150, rot: 0 },
  },
};

export function place(road: RoadLayout, slot: SceneSlot): Placement {
  return (
    LAYOUTS[road]?.[slot] ?? VERTICAL_ROAD[slot] ?? { x: 200, y: 150, rot: 0 }
  );
}

/** Realistic surface colours — a road looks like a road in every theme. */
export const SURFACE = {
  asphalt: "#4A4F55",
  asphaltDark: "#3C4046",
  verge: "#5C6B4F",
  vergeAlt: "#4E5C43",
  line: "#F2F2F0",
  lineYellow: "#F5C800",
  kerb: "#8A8F96",
  rail: "#9AA0A6",
} as const;
