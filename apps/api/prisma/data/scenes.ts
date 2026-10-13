import type { SceneSpec } from "@roadready/shared";

/**
 * Scene data for the seeded driving situations, keyed by scenario slug.
 * The client renders these to SVG; `imagePrompt` remains as the written
 * description and accessible fallback.
 */
export const SCENES: Record<string, SceneSpec> = {
  "de-sc-yield-t-junction": {
    road: "t-junction",
    view: "top",
    actors: [
      { kind: "car", at: "south", you: true, heading: "north" },
      { kind: "car", at: "west", heading: "east", tone: "accent" },
    ],
    signs: [{ id: "de-priority-give-way", at: "right-verge" }],
    markings: ["give-way-line"],
    annotations: [{ kind: "order", at: "west", text: "has priority" }],
    caption: "A T-junction with a give-way sign; a car crosses from the left",
  },
  "de-sc-rechts-vor-links": {
    road: "crossroads",
    view: "top",
    actors: [
      { kind: "car", at: "south", you: true, heading: "north" },
      { kind: "car", at: "east", heading: "west", tone: "accent" },
    ],
    annotations: [{ kind: "order", at: "east", text: "from the right" }],
    caption: "An unmarked crossroads with a car approaching from the right",
  },
  "de-sc-roundabout-entry": {
    road: "roundabout",
    view: "top",
    actors: [
      { kind: "car", at: "south", you: true, heading: "north" },
      { kind: "car", at: "west", heading: "east", tone: "accent" },
    ],
    signs: [{ id: "de-mandatory-roundabout", at: "right-verge" }],
    annotations: [{ kind: "order", at: "west", text: "already circulating" }],
    caption: "Entering a roundabout while another vehicle circulates",
  },
  "de-sc-zebra-pedestrian": {
    road: "zebra",
    view: "top",
    actors: [
      { kind: "car", at: "south", you: true, heading: "north" },
      { kind: "pedestrian", at: "kerb-right", tone: "accent" },
    ],
    signs: [{ id: "de-information-pedestrian-crossing", at: "right-verge" }],
    markings: ["zebra"],
    annotations: [{ kind: "arrow", from: "kerb-right", to: "kerb-left" }],
    caption: "A pedestrian waiting at the kerb of a zebra crossing",
  },
  "de-sc-autobahn-recommended-speed": {
    road: "motorway",
    view: "top",
    actors: [
      { kind: "car", at: "right-lane", you: true, heading: "north" },
      { kind: "car", at: "left-lane", heading: "north" },
    ],
    signs: [{ id: "de-prohibition-all-end", at: "right-verge" }],
    annotations: [{ kind: "note", at: "centre", text: "150 km/h" }],
    caption: "An unrestricted Autobahn section in dry daylight",
  },
  "de-sc-tram-crossing": {
    road: "tram",
    view: "top",
    actors: [
      { kind: "car", at: "south", you: true, heading: "north" },
      { kind: "tram", at: "west", heading: "east", tone: "accent" },
    ],
    annotations: [{ kind: "order", at: "west", text: "rail has priority" }],
    caption: "A tram approaching an unregulated junction from the left",
  },
  "de-sc-bus-hazard-lights": {
    road: "bus-stop",
    view: "top",
    actors: [
      { kind: "car", at: "south", you: true, heading: "north" },
      { kind: "bus", at: "ahead", tone: "warn" },
      { kind: "pedestrian", at: "kerb-right" },
    ],
    annotations: [{ kind: "note", at: "ahead", text: "hazard lights on" }],
    caption: "A bus at a stop with hazard lights and passengers alighting",
  },
  "de-sc-emergency-vehicle-behind": {
    road: "straight",
    view: "top",
    actors: [
      { kind: "car", at: "ahead", you: true, heading: "north" },
      { kind: "emergency", at: "behind", tone: "danger", heading: "north" },
    ],
    annotations: [{ kind: "note", at: "behind", text: "blue light and siren" }],
    caption: "An ambulance approaching from behind in city traffic",
  },
  "de-sc-rettungsgasse": {
    road: "motorway",
    view: "top",
    actors: [
      { kind: "car", at: "left-lane", you: true, heading: "north" },
      { kind: "car", at: "right-lane", heading: "north" },
      { kind: "emergency", at: "behind", tone: "danger", heading: "north" },
    ],
    annotations: [{ kind: "gap", at: "centre", text: "Rettungsgasse" }],
    caption: "Standstill on a two-lane Autobahn with an emergency corridor",
  },
  "de-sc-priority-road-bend": {
    road: "crossroads",
    view: "top",
    actors: [{ kind: "car", at: "south", you: true, heading: "north" }],
    signs: [{ id: "de-combo-priority-road-course", at: "right-verge" }],
    annotations: [{ kind: "arrow", from: "south", to: "west" }],
    caption: "A priority road that bends left at the junction",
  },
  "de-sc-stop-sign-empty": {
    road: "t-junction",
    view: "top",
    actors: [{ kind: "car", at: "south", you: true, heading: "north" }],
    signs: [{ id: "de-priority-stop", at: "right-verge" }],
    markings: ["stop-line"],
    annotations: [{ kind: "stop", at: "south", text: "full standstill" }],
    caption: "A STOP sign and stop line on an empty road",
  },
  "de-sc-cyclist-overtake": {
    road: "straight",
    view: "top",
    actors: [
      { kind: "car", at: "south", you: true, heading: "north" },
      { kind: "bicycle", at: "ahead", tone: "accent", heading: "north" },
      { kind: "truck", at: "oncoming", heading: "south" },
    ],
    annotations: [{ kind: "note", at: "ahead", text: "1.5 m needed" }],
    caption: "Overtaking a cyclist on a narrow street with oncoming traffic",
  },
  "de-sc-green-arrow-red-light": {
    road: "crossroads",
    view: "top",
    actors: [
      { kind: "car", at: "south", you: true, heading: "north" },
      { kind: "pedestrian", at: "crossing", tone: "accent" },
    ],
    signs: [{ id: "de-combo-red-light-green-arrow", at: "right-verge" }],
    markings: ["zebra", "stop-line"],
    annotations: [{ kind: "arrow", from: "south", to: "east" }],
    caption: "A red light with a green arrow plate and pedestrians crossing",
  },
  "de-sc-school-children": {
    road: "straight",
    view: "top",
    actors: [
      { kind: "car", at: "south", you: true, heading: "north" },
      { kind: "child", at: "kerb-right", tone: "accent" },
      { kind: "child", at: "kerb-right" },
    ],
    signs: [{ id: "de-danger-children", at: "right-verge" }],
    caption: "Children on the pavement beside a warning sign",
  },
  "de-sc-narrow-road-priority": {
    road: "narrowing",
    view: "top",
    actors: [
      { kind: "car", at: "south", you: true, heading: "north" },
      { kind: "car", at: "oncoming", heading: "south", tone: "accent" },
    ],
    signs: [{ id: "de-priority-over-oncoming", at: "right-verge" }],
    caption: "A narrow passage where you have priority over oncoming traffic",
  },
  "de-sc-parking-corner": {
    road: "parking",
    view: "top",
    actors: [
      { kind: "car", at: "south", you: true, heading: "north" },
      { kind: "car", at: "kerb-right" },
    ],
    markings: ["bays"],
    annotations: [
      { kind: "note", at: "kerb-right", text: "3 m to the corner" },
    ],
    caption: "A parking gap three metres from a junction corner",
  },
  "de-sc-fog-visibility": {
    road: "straight",
    view: "top",
    conditions: "fog",
    actors: [
      { kind: "car", at: "south", you: true, heading: "north" },
      { kind: "car", at: "ahead", heading: "north" },
    ],
    annotations: [{ kind: "note", at: "centre", text: "visibility 40 m" }],
    caption: "A country road in dense fog with visibility about 40 metres",
  },
  "de-sc-turning-left-oncoming": {
    road: "crossroads",
    view: "top",
    actors: [
      { kind: "car", at: "south", you: true, heading: "north" },
      { kind: "car", at: "north", heading: "south", tone: "accent" },
    ],
    annotations: [
      { kind: "arrow", from: "south", to: "west" },
      { kind: "order", at: "north", text: "turning right" },
    ],
    caption: "Waiting to turn left while an oncoming car turns right",
  },
};
