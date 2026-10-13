// A driving situation described as data, rendered to SVG by the client.
// Authoring a situation is editing this object — no illustration needed.

export type RoadLayout =
  | "straight"
  | "curve"
  | "t-junction"
  | "crossroads"
  | "roundabout"
  | "motorway"
  | "one-way"
  | "narrowing"
  | "level-crossing"
  | "tram"
  | "parking"
  | "zebra"
  | "bus-stop";

export type ActorKind =
  | "car"
  | "truck"
  | "bus"
  | "tram"
  | "motorcycle"
  | "bicycle"
  | "pedestrian"
  | "child"
  | "animal"
  | "emergency"
  | "tractor";

/**
 * Named positions on a layout. The renderer maps each slot to coordinates and
 * a heading, so a scene never carries raw pixels.
 */
export type SceneSlot =
  | "south"
  | "south-far"
  | "north"
  | "north-far"
  | "east"
  | "east-far"
  | "west"
  | "west-far"
  | "centre"
  | "left-verge"
  | "right-verge"
  | "left-lane"
  | "right-lane"
  | "oncoming"
  | "ahead"
  | "behind"
  | "kerb-left"
  | "kerb-right"
  | "crossing"
  | "shoulder"
  | "exit-north"
  | "exit-east"
  | "exit-west";

export interface SceneActor {
  kind: ActorKind;
  at: SceneSlot;
  /** Direction of travel; defaults to the slot's natural heading. */
  heading?: "north" | "south" | "east" | "west";
  /** The learner's own vehicle. Exactly one actor should carry this. */
  you?: boolean;
  /** Accent colour key, not a raw hex value. */
  tone?: "neutral" | "accent" | "warn" | "danger";
  label?: string;
}

export interface SceneSign {
  /** An id from the sign catalogue, e.g. "de-priority-give-way". */
  id: string;
  at: SceneSlot;
}

export interface SceneAnnotation {
  kind: "arrow" | "order" | "stop" | "question" | "note" | "gap";
  from?: SceneSlot;
  to?: SceneSlot;
  at?: SceneSlot;
  text?: string;
}

export type SceneCondition = "day" | "dusk" | "night" | "rain" | "fog" | "snow";

export interface SceneSpec {
  road: RoadLayout;
  view?: "top" | "driver";
  actors?: SceneActor[];
  signs?: SceneSign[];
  /** Extra surface markings beyond the layout's defaults. */
  markings?: (
    | "zebra"
    | "stop-line"
    | "give-way-line"
    | "centre-dashes"
    | "solid-centre"
    | "cycle-lane"
    | "hatching"
    | "arrows"
    | "bays"
  )[];
  annotations?: SceneAnnotation[];
  conditions?: SceneCondition;
  /** One line describing the scene, used as the accessible label. */
  caption?: string;
}
