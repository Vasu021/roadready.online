/**
 * Generates the scenario illustration library into public/images/scenarios/.
 *
 * Every question in the seed references one of these files by name. They are
 * generated rather than hand-drawn so the whole set shares one visual language
 * (same road colour, same car glyph, same sign proportions) and so a tweak to
 * that language is a one-line change rather than 30 file edits.
 *
 * Run: npm run gen:images --workspace=apps/web
 */

import { mkdirSync, writeFileSync, readdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT_DIR = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "public",
  "images",
  "scenarios",
);

// ── Palette ─────────────────────────────────────────────────────────────────

const C = {
  ground: "#c9d6c2",
  groundAlt: "#b9c9b2",
  road: "#4b525c",
  roadEdge: "#3a404a",
  line: "#f2f4f7",
  lineWarm: "#ffd23f",
  ego: "#2563eb",
  egoGlass: "#bfdbfe",
  other: "#e5484d",
  otherGlass: "#fecdd3",
  third: "#f5a524",
  thirdGlass: "#fde68a",
  pedestrian: "#1f2933",
  sky: "#dbe7f3",
  building: "#9aa5b1",
  buildingRoof: "#7b8794",
  signRed: "#d32f2f",
  signYellow: "#ffcc00",
  signBlue: "#0b4da2",
  signWhite: "#ffffff",
  ink: "#16191d",
  focus: "#0f766e",
};

const W = 400;
const H = 300;

// ── Primitives ──────────────────────────────────────────────────────────────

const svg = (body, { bg = C.ground } = {}) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img">
  <rect width="${W}" height="${H}" fill="${bg}"/>
${body}
</svg>
`;

/** Horizontal road band. */
const roadH = (y, h) => `
  <rect x="0" y="${y}" width="${W}" height="${h}" fill="${C.road}"/>
  <rect x="0" y="${y}" width="${W}" height="2" fill="${C.roadEdge}"/>
  <rect x="0" y="${y + h - 2}" width="${W}" height="2" fill="${C.roadEdge}"/>`;

/** Vertical road band. */
const roadV = (x, w) => `
  <rect x="${x}" y="0" width="${w}" height="${H}" fill="${C.road}"/>
  <rect x="${x}" y="0" width="2" height="${H}" fill="${C.roadEdge}"/>
  <rect x="${x + w - 2}" y="0" width="2" height="${H}" fill="${C.roadEdge}"/>`;

/** Dashed centre line along a horizontal road. */
const dashH = (y, { from = 0, to = W, color = C.line } = {}) => {
  let out = "";
  for (let x = from; x < to; x += 28) {
    out += `\n  <rect x="${x}" y="${y - 2}" width="16" height="4" rx="2" fill="${color}"/>`;
  }
  return out;
};

const dashV = (x, { from = 0, to = H, color = C.line } = {}) => {
  let out = "";
  for (let y = from; y < to; y += 28) {
    out += `\n  <rect x="${x - 2}" y="${y}" width="4" height="16" rx="2" fill="${color}"/>`;
  }
  return out;
};

/**
 * Top-down car glyph, 28 x 46 centred on (x, y).
 * `dir` is the heading in degrees: 0 = pointing up (north).
 */
const car = (x, y, dir, body, glass, { label = "" } = {}) => `
  <g transform="translate(${x} ${y}) rotate(${dir})">
    <rect x="-14" y="-23" width="28" height="46" rx="7" fill="${body}"/>
    <rect x="-11" y="-16" width="22" height="12" rx="3" fill="${glass}"/>
    <rect x="-11" y="6" width="22" height="9" rx="3" fill="${glass}" opacity="0.65"/>
    <rect x="-15" y="-14" width="4" height="10" rx="2" fill="${C.ink}" opacity="0.55"/>
    <rect x="11" y="-14" width="4" height="10" rx="2" fill="${C.ink}" opacity="0.55"/>
    <rect x="-15" y="8" width="4" height="10" rx="2" fill="${C.ink}" opacity="0.55"/>
    <rect x="11" y="8" width="4" height="10" rx="2" fill="${C.ink}" opacity="0.55"/>
    ${label ? `<text x="0" y="4" text-anchor="middle" font-family="system-ui, sans-serif" font-size="13" font-weight="700" fill="#fff" transform="rotate(${-dir})">${label}</text>` : ""}
  </g>`;

/** The user's own vehicle, marked so it is unambiguous which car is "you". */
const egoCar = (x, y, dir) => `${car(x, y, dir, C.ego, C.egoGlass)}
  <g transform="translate(${x} ${y})">
    <circle cx="0" cy="0" r="31" fill="none" stroke="${C.ego}" stroke-width="2.5" stroke-dasharray="6 5" opacity="0.9"/>
  </g>`;

const pedestrian = (x, y) => `
  <g transform="translate(${x} ${y})">
    <circle cx="0" cy="-8" r="5" fill="${C.pedestrian}"/>
    <rect x="-4.5" y="-2" width="9" height="13" rx="4" fill="${C.pedestrian}"/>
    <rect x="-4" y="10" width="3" height="8" rx="1.5" fill="${C.pedestrian}"/>
    <rect x="1" y="10" width="3" height="8" rx="1.5" fill="${C.pedestrian}"/>
  </g>`;

/** Top-down cyclist glyph, facing up. */
const cyclist = (x, y) => `
  <g transform="translate(${x} ${y})">
    <circle cx="0" cy="-16" r="8" fill="none" stroke="${C.pedestrian}" stroke-width="3"/>
    <circle cx="0" cy="16" r="8" fill="none" stroke="${C.pedestrian}" stroke-width="3"/>
    <rect x="-1.5" y="-16" width="3" height="32" fill="${C.pedestrian}"/>
    <rect x="-11" y="-8" width="22" height="4" rx="2" fill="${C.pedestrian}"/>
    <circle cx="0" cy="2" r="7" fill="#f59e0b"/>
  </g>`;

/** Zebra stripes across a horizontal road. */
const zebraH = (x, y, h) => {
  let out = "";
  for (let i = 0; i < 6; i++) {
    out += `\n  <rect x="${x + i * 12}" y="${y}" width="7" height="${h}" fill="${C.line}"/>`;
  }
  return out;
};

/** Zebra stripes across a vertical road. */
const zebraV = (x, y, w) => {
  let out = "";
  for (let i = 0; i < 6; i++) {
    out += `\n  <rect x="${x}" y="${y + i * 12}" width="${w}" height="7" fill="${C.line}"/>`;
  }
  return out;
};

const building = (x, y, w, h) => `
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="${C.building}"/>
  <rect x="${x}" y="${y}" width="${w}" height="7" rx="3" fill="${C.buildingRoof}"/>
  <rect x="${x + 8}" y="${y + 16}" width="10" height="12" rx="2" fill="${C.sky}" opacity="0.8"/>
  <rect x="${x + w - 18}" y="${y + 16}" width="10" height="12" rx="2" fill="${C.sky}" opacity="0.8"/>`;

const caption = (text, { y = 24 } = {}) => `
  <rect x="12" y="${y - 17}" width="${Math.min(text.length * 7.2 + 20, W - 24)}" height="24" rx="6" fill="${C.ink}" opacity="0.78"/>
  <text x="22" y="${y}" font-family="system-ui, sans-serif" font-size="13" font-weight="600" fill="#fff">${text}</text>`;

const arrow = (x1, y1, x2, y2, color = C.focus) => `
  <defs><marker id="ah${Math.round(x1 + y1 + x2 + y2)}" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
    <path d="M0,0 L7,3.5 L0,7 z" fill="${color}"/></marker></defs>
  <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="4" stroke-linecap="round"
        marker-end="url(#ah${Math.round(x1 + y1 + x2 + y2)})"/>`;

// ── Sign primitives ─────────────────────────────────────────────────────────

const signCircle = (fill, stroke, inner) => `
  <circle cx="200" cy="150" r="96" fill="${stroke}"/>
  <circle cx="200" cy="150" r="80" fill="${fill}"/>
${inner}`;

const signText = (text, size = 62, fill = C.ink) =>
  `  <text x="200" y="150" text-anchor="middle" dominant-baseline="central" font-family="system-ui, Arial, sans-serif" font-size="${size}" font-weight="800" fill="${fill}">${text}</text>`;

// ── Scene definitions ───────────────────────────────────────────────────────

const scenes = {
  // ── Junctions ────────────────────────────────────────────────────────────
  "unmarked-crossroads": svg(`
  ${building(10, 10, 120, 78)}
  ${building(270, 10, 120, 78)}
  ${building(10, 212, 120, 78)}
  ${building(270, 212, 120, 78)}
  ${roadV(155, 90)}
  ${roadH(105, 90)}
  ${dashV(200, { from: 0, to: 96 })}
  ${dashV(200, { from: 204, to: H })}
  ${dashH(150, { from: 0, to: 150 })}
  ${dashH(150, { from: 250, to: W })}
  ${egoCar(200, 250, 0)}
  ${car(320, 128, 270, C.other, C.otherGlass)}
  ${caption("No signs, no markings — who goes first?")}`),

  "unmarked-crossroads-three-cars": svg(`
  ${roadV(155, 90)}
  ${roadH(105, 90)}
  ${dashV(200, { from: 0, to: 96 })}
  ${dashV(200, { from: 204, to: H })}
  ${dashH(150, { from: 0, to: 150 })}
  ${dashH(150, { from: 250, to: W })}
  ${egoCar(200, 252, 0)}
  ${car(322, 128, 270, C.other, C.otherGlass)}
  ${car(78, 172, 90, C.third, C.thirdGlass)}
  ${caption("Three cars arrive at the same moment")}`),

  "t-junction-from-right": svg(`
  ${building(20, 190, 130, 90)}
  ${building(250, 190, 130, 90)}
  ${roadH(70, 90)}
  ${roadV(155, 90)}
  ${dashH(115, { from: 0, to: 150 })}
  ${dashH(115, { from: 250, to: W })}
  ${dashV(200, { from: 165, to: H })}
  ${egoCar(200, 240, 0)}
  ${car(320, 92, 270, C.other, C.otherGlass)}
  ${caption("You are joining from the side road")}`),

  "turning-left-oncoming": svg(`
  ${roadV(155, 90)}
  ${roadH(105, 90)}
  ${dashV(200, { from: 0, to: 96 })}
  ${dashV(200, { from: 204, to: H })}
  ${dashH(150, { from: 0, to: 150 })}
  ${dashH(150, { from: 250, to: W })}
  ${egoCar(200, 250, 0)}
  ${car(200, 60, 180, C.other, C.otherGlass)}
  ${arrow(228, 236, 268, 176)}
  ${caption("You are turning left; a car is coming towards you")}`),

  // ── Roundabouts ──────────────────────────────────────────────────────────
  "roundabout-approach": svg(`
  ${roadV(160, 80)}
  ${roadH(110, 80)}
  <circle cx="200" cy="150" r="86" fill="${C.road}"/>
  <circle cx="200" cy="150" r="86" fill="none" stroke="${C.roadEdge}" stroke-width="3"/>
  <circle cx="200" cy="150" r="34" fill="${C.groundAlt}" stroke="${C.line}" stroke-width="3"/>
  <circle cx="200" cy="150" r="60" fill="none" stroke="${C.line}" stroke-width="2" stroke-dasharray="10 9"/>
  ${egoCar(200, 268, 0)}
  ${car(200, 76, 90, C.other, C.otherGlass)}
  ${arrow(150, 118, 176, 96)}
  ${caption("A car is already circulating")}`),

  "roundabout-third-exit": svg(`
  ${roadV(160, 80)}
  ${roadH(110, 80)}
  <circle cx="200" cy="150" r="86" fill="${C.road}"/>
  <circle cx="200" cy="150" r="34" fill="${C.groundAlt}" stroke="${C.line}" stroke-width="3"/>
  <circle cx="200" cy="150" r="60" fill="none" stroke="${C.line}" stroke-width="2" stroke-dasharray="10 9"/>
  <text x="352" y="104" font-family="system-ui, sans-serif" font-size="13" font-weight="700" fill="${C.ink}">1st</text>
  <text x="186" y="26" font-family="system-ui, sans-serif" font-size="13" font-weight="700" fill="${C.ink}">2nd</text>
  <text x="14" y="104" font-family="system-ui, sans-serif" font-size="13" font-weight="700" fill="${C.ink}">3rd</text>
  ${egoCar(200, 268, 0)}
  ${arrow(150, 130, 96, 130)}
  ${caption("You are taking the third exit")}`),

  // ── Traffic lights ───────────────────────────────────────────────────────
  ...Object.fromEntries(
    [
      ["red", [1, 0, 0], "The light ahead is red"],
      ["amber", [0, 1, 0], "The light turns amber as you approach"],
      ["green", [0, 0, 1], "The light ahead is green"],
      ["red-amber", [1, 1, 0], "Red and amber are lit together"],
    ].map(([name, [r, a, g], text]) => [
      `traffic-light-${name}`,
      svg(
        `
  ${roadV(150, 100)}
  ${dashV(200, { from: 0, to: H })}
  ${building(6, 18, 110, 120)}
  ${building(288, 18, 106, 120)}
  <rect x="0" y="196" width="${W}" height="6" fill="${C.line}"/>
  <rect x="262" y="150" width="9" height="130" rx="4" fill="#33393f"/>
  <rect x="238" y="52" width="58" height="132" rx="12" fill="#23282d"/>
  <circle cx="267" cy="84" r="19" fill="${r ? "#ff3b30" : "#4a4f55"}"/>
  <circle cx="267" cy="120" r="19" fill="${a ? "#ffcc00" : "#4a4f55"}"/>
  <circle cx="267" cy="156" r="19" fill="${g ? "#34c759" : "#4a4f55"}"/>
  ${egoCar(175, 250, 0)}
  ${caption(text)}`,
        { bg: C.groundAlt },
      ),
    ]),
  ),

  "traffic-light-green-arrow": svg(
    `
  ${roadV(150, 100)}
  ${dashV(200, { from: 0, to: H })}
  <rect x="0" y="196" width="${W}" height="6" fill="${C.line}"/>
  <rect x="262" y="150" width="9" height="130" rx="4" fill="#33393f"/>
  <rect x="238" y="52" width="58" height="132" rx="12" fill="#23282d"/>
  <circle cx="267" cy="84" r="19" fill="#ff3b30"/>
  <circle cx="267" cy="120" r="19" fill="#4a4f55"/>
  <circle cx="267" cy="156" r="19" fill="#4a4f55"/>
  <rect x="300" y="138" width="46" height="40" rx="6" fill="#23282d"/>
  <path d="M310 158 L332 158 M326 150 L336 158 L326 166" stroke="#34c759" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  ${egoCar(175, 250, 0)}
  ${caption("Red light, with a green arrow to the right")}`,
    { bg: C.groundAlt },
  ),

  // ── Pedestrians ──────────────────────────────────────────────────────────
  "zebra-pedestrian-crossing": svg(`
  ${roadH(90, 120)}
  ${dashH(150, { from: 0, to: 150 })}
  ${dashH(150, { from: 262, to: W })}
  ${zebraH(178, 92, 116)}
  ${pedestrian(206, 148)}
  ${egoCar(80, 180, 90)}
  ${caption("A pedestrian is already on the crossing")}`),

  "zebra-pedestrian-waiting": svg(`
  ${roadH(90, 120)}
  ${dashH(150, { from: 0, to: 150 })}
  ${dashH(150, { from: 262, to: W })}
  ${zebraH(178, 92, 116)}
  ${pedestrian(206, 236)}
  ${egoCar(80, 180, 90)}
  ${caption("A pedestrian is waiting at the kerb")}`),

  "school-children-crossing": svg(`
  ${roadH(110, 90)}
  ${dashH(155, { from: 0, to: 140 })}
  ${dashH(155, { from: 268, to: W })}
  ${zebraH(168, 112, 86)}
  ${building(20, 6, 150, 90)}
  <text x="42" y="58" font-family="system-ui, sans-serif" font-size="15" font-weight="700" fill="#fff">SCHOOL</text>
  ${pedestrian(184, 232)}
  ${pedestrian(206, 236)}
  ${egoCar(78, 178, 90)}
  ${caption("Children near a school crossing")}`),

  "bus-stop-pedestrians": svg(`
  ${roadH(100, 100)}
  ${dashH(150, { from: 0, to: W })}
  <rect x="212" y="118" width="150" height="64" rx="8" fill="${C.third}"/>
  <rect x="222" y="128" width="120" height="26" rx="4" fill="${C.thirdGlass}"/>
  ${pedestrian(196, 232)}
  ${pedestrian(216, 236)}
  ${egoCar(80, 176, 90)}
  ${caption("A bus is signalling to pull out from the stop")}`),

  // ── Motorway ─────────────────────────────────────────────────────────────
  "motorway-three-lanes": svg(`
  ${roadH(50, 200)}
  <rect x="0" y="50" width="${W}" height="5" fill="${C.line}"/>
  <rect x="0" y="245" width="${W}" height="5" fill="${C.line}"/>
  ${dashH(117, {})}
  ${dashH(183, {})}
  ${egoCar(120, 214, 90)}
  ${car(250, 150, 90, C.other, C.otherGlass)}
  ${car(60, 84, 90, C.third, C.thirdGlass)}
  ${caption("Three-lane motorway, traffic flowing left to right")}`),

  "motorway-rescue-lane": svg(`
  ${roadH(50, 200)}
  <rect x="0" y="50" width="${W}" height="5" fill="${C.line}"/>
  <rect x="0" y="245" width="${W}" height="5" fill="${C.line}"/>
  ${dashH(117, {})}
  ${dashH(183, {})}
  ${car(70, 80, 90, C.third, C.thirdGlass)}
  ${car(150, 80, 90, C.third, C.thirdGlass)}
  ${car(230, 80, 90, C.other, C.otherGlass)}
  ${car(90, 220, 90, C.other, C.otherGlass)}
  ${car(180, 220, 90, C.third, C.thirdGlass)}
  ${egoCar(280, 220, 90)}
  ${arrow(120, 150, 300, 150, "#e5484d")}
  ${caption("Stationary traffic on the motorway")}`),

  "motorway-merge-zipper": svg(`
  ${roadH(70, 130)}
  <rect x="0" y="70" width="${W}" height="5" fill="${C.line}"/>
  <rect x="0" y="195" width="${W}" height="5" fill="${C.line}"/>
  ${dashH(135, {})}
  <path d="M0 250 L250 210 L400 210" fill="${C.road}" opacity="0"/>
  <path d="M0 262 L232 205 L232 195 L0 244 Z" fill="${C.road}"/>
  ${egoCar(110, 236, 78)}
  ${car(150, 105, 90, C.other, C.otherGlass)}
  ${car(40, 165, 90, C.third, C.thirdGlass)}
  ${caption("Your lane ends ahead")}`),

  "emergency-vehicle-behind": svg(`
  ${roadV(140, 120)}
  ${dashV(200, { from: 0, to: H })}
  ${egoCar(200, 110, 0)}
  <g transform="translate(200 240)">
    <rect x="-16" y="-30" width="32" height="60" rx="7" fill="#e5484d"/>
    <rect x="-13" y="-22" width="26" height="14" rx="3" fill="${C.otherGlass}"/>
    <rect x="-13" y="-4" width="26" height="26" rx="3" fill="#fff"/>
    <rect x="-9" y="6" width="18" height="5" rx="2" fill="#e5484d"/>
    <rect x="-4" y="1" width="8" height="15" rx="2" fill="#e5484d"/>
    <circle cx="-9" cy="-33" r="5" fill="#3b82f6"/>
    <circle cx="9" cy="-33" r="5" fill="#3b82f6"/>
  </g>
  ${caption("An ambulance is behind you with lights and siren on")}`),

  // ── Urban ────────────────────────────────────────────────────────────────
  "narrow-street-parked-cars": svg(`
  ${building(6, 6, 90, 288)}
  ${building(304, 6, 90, 288)}
  ${roadV(100, 200)}
  ${dashV(200, { from: 0, to: H })}
  ${car(122, 60, 0, C.third, C.thirdGlass)}
  ${car(122, 150, 0, C.third, C.thirdGlass)}
  ${car(122, 240, 0, C.third, C.thirdGlass)}
  ${egoCar(240, 226, 0)}
  ${car(240, 70, 180, C.other, C.otherGlass)}
  ${caption("Parked cars narrow the road to one usable lane")}`),

  "residential-30-zone": svg(`
  ${building(10, 6, 110, 76)}
  ${building(280, 6, 110, 76)}
  ${roadV(150, 100)}
  ${dashV(200, { from: 0, to: H })}
  <rect x="94" y="150" width="9" height="120" rx="4" fill="#5b6570"/>
  <circle cx="98" cy="120" r="34" fill="${C.signRed}"/>
  <circle cx="98" cy="120" r="27" fill="#fff"/>
  <text x="98" y="120" text-anchor="middle" dominant-baseline="central" font-family="system-ui, Arial, sans-serif" font-size="24" font-weight="800" fill="${C.ink}">30</text>
  ${egoCar(226, 226, 0)}
  ${caption("Entering a residential street")}`),

  "level-crossing": svg(`
  ${roadV(150, 100)}
  ${dashV(200, { from: 0, to: 110 })}
  ${dashV(200, { from: 190, to: H })}
  <rect x="0" y="128" width="${W}" height="44" fill="#8b7355"/>
  <rect x="0" y="136" width="${W}" height="5" fill="#6b7280"/>
  <rect x="0" y="160" width="${W}" height="5" fill="#6b7280"/>
  <rect x="0" y="188" width="${W}" height="6" fill="${C.line}"/>
  <rect x="118" y="150" width="8" height="110" rx="4" fill="#5b6570"/>
  <g transform="translate(122 122)">
    <circle cx="-14" cy="0" r="11" fill="#ff3b30"/>
    <circle cx="14" cy="0" r="11" fill="#4a4f55"/>
  </g>
  ${egoCar(226, 244, 0)}
  ${caption("Approaching a level crossing")}`),

  "roadworks-lane-closed": svg(`
  ${roadV(120, 160)}
  ${dashV(200, { from: 0, to: H, color: C.lineWarm })}
  <g fill="${C.third}">
    <polygon points="222,80 232,110 212,110"/>
    <polygon points="228,130 238,160 218,160"/>
    <polygon points="234,180 244,210 224,210"/>
  </g>
  ${egoCar(160, 246, 0)}
  ${caption("Roadworks close the lane ahead")}`),

  "blind-spot-moving-off": svg(`
  ${building(4, 4, 92, 292)}
  ${roadV(100, 220)}
  ${dashV(210, { from: 0, to: H })}
  ${car(124, 74, 0, C.third, C.thirdGlass)}
  ${egoCar(124, 174, 0)}
  <g transform="translate(214 250) scale(1.5)">${cyclist(0, 0)}</g>
  ${arrow(152, 164, 200, 112)}
  ${caption("You are parked and about to pull out")}`),

  "dashboard-controls": svg(
    `
  <rect x="0" y="0" width="${W}" height="${H}" fill="#20262e"/>
  <rect x="24" y="30" width="352" height="150" rx="14" fill="#2c333c"/>
  <circle cx="118" cy="105" r="52" fill="#1a1f26" stroke="#3d454f" stroke-width="4"/>
  <text x="118" y="98" text-anchor="middle" font-family="system-ui, sans-serif" font-size="26" font-weight="800" fill="#e8eaed">50</text>
  <text x="118" y="122" text-anchor="middle" font-family="system-ui, sans-serif" font-size="11" fill="#9aa5b1">km/h</text>
  <circle cx="282" cy="105" r="52" fill="#1a1f26" stroke="#3d454f" stroke-width="4"/>
  <text x="282" y="98" text-anchor="middle" font-family="system-ui, sans-serif" font-size="26" font-weight="800" fill="#e8eaed">2.5</text>
  <text x="282" y="122" text-anchor="middle" font-family="system-ui, sans-serif" font-size="11" fill="#9aa5b1">x1000 rpm</text>
  <g transform="translate(200 218)">
    <circle cx="-60" cy="0" r="18" fill="#1a1f26"/>
    <path d="M-68 0 L-52 0 M-60 -8 L-60 8" stroke="#34c759" stroke-width="3" stroke-linecap="round"/>
    <circle cx="0" cy="0" r="18" fill="#1a1f26"/>
    <path d="M-7 4 L0 -7 L7 4 Z" fill="#ffcc00"/>
    <circle cx="60" cy="0" r="18" fill="#1a1f26"/>
    <circle cx="60" cy="0" r="8" fill="none" stroke="#ff3b30" stroke-width="3"/>
    <path d="M52 0 L68 0" stroke="#ff3b30" stroke-width="3"/>
  </g>
  ${caption("Instrument cluster warning lights")}`,
    { bg: "#20262e" },
  ),

  "radar-speed-camera": svg(`
  ${roadH(120, 120)}
  ${dashH(180, {})}
  <rect x="290" y="70" width="16" height="60" rx="4" fill="#5b6570"/>
  <rect x="272" y="34" width="54" height="42" rx="6" fill="#3d454f"/>
  <circle cx="299" cy="55" r="12" fill="#1a1f26"/>
  <circle cx="299" cy="55" r="5" fill="#9aa5b1"/>
  ${egoCar(120, 210, 90)}
  ${caption("A fixed speed camera ahead")}`),

  "toll-plaza": svg(`
  ${roadH(80, 170)}
  <rect x="0" y="80" width="${W}" height="4" fill="${C.line}"/>
  <rect x="0" y="246" width="${W}" height="4" fill="${C.line}"/>
  <rect x="240" y="146" width="56" height="38" rx="5" fill="${C.building}"/>
  <rect x="240" y="146" width="56" height="10" rx="5" fill="${C.buildingRoof}"/>
  <rect x="252" y="160" width="32" height="16" rx="3" fill="${C.sky}"/>
  <g>
    <rect x="296" y="108" width="90" height="9" rx="4" fill="${C.signRed}"/>
    <rect x="311" y="108" width="15" height="9" fill="#fff"/>
    <rect x="341" y="108" width="15" height="9" fill="#fff"/>
    <rect x="371" y="108" width="15" height="9" fill="#fff"/>
  </g>
  <g>
    <rect x="296" y="212" width="90" height="9" rx="4" fill="${C.signRed}"/>
    <rect x="311" y="212" width="15" height="9" fill="#fff"/>
    <rect x="341" y="212" width="15" height="9" fill="#fff"/>
    <rect x="371" y="212" width="15" height="9" fill="#fff"/>
  </g>
  <text x="200" y="52" text-anchor="middle" font-family="system-ui, sans-serif" font-size="20" font-weight="800" fill="${C.ink}">PÉAGE</text>
  ${egoCar(140, 212, 90)}
  ${caption("Approaching a toll plaza", { y: 288 })}`),

  "country-road-overtake": svg(`
  ${roadH(105, 90)}
  <rect x="0" y="105" width="${W}" height="4" fill="${C.line}"/>
  <rect x="0" y="191" width="${W}" height="4" fill="${C.line}"/>
  ${dashH(150, {})}
  ${egoCar(80, 172, 90)}
  ${car(190, 172, 90, C.third, C.thirdGlass)}
  ${car(350, 128, 270, C.other, C.otherGlass)}
  ${arrow(112, 158, 168, 132)}
  ${caption("A slow vehicle ahead, oncoming traffic in the distance")}`),

  "fog-poor-visibility": svg(
    `
  ${roadV(140, 120)}
  ${dashV(200, { from: 0, to: H })}
  ${egoCar(200, 236, 0)}
  ${car(200, 96, 0, C.other, C.otherGlass)}
  <rect x="0" y="0" width="${W}" height="${H}" fill="#dfe4e8" opacity="0.62"/>
  <rect x="0" y="0" width="${W}" height="120" fill="#dfe4e8" opacity="0.5"/>
  ${caption("Visibility is under 50 metres")}`,
    { bg: "#c8cfd4" },
  ),

  "parking-space-kerb": svg(`
  ${building(6, 6, 388, 70)}
  ${roadH(150, 110)}
  ${dashH(205, {})}
  <rect x="40" y="86" width="320" height="60" fill="${C.road}"/>
  <g stroke="${C.line}" stroke-width="3">
    <line x1="60" y1="86" x2="60" y2="146"/>
    <line x1="152" y1="86" x2="152" y2="146"/>
    <line x1="244" y1="86" x2="244" y2="146"/>
    <line x1="336" y1="86" x2="336" y2="146"/>
  </g>
  ${car(106, 116, 180, C.third, C.thirdGlass)}
  ${car(290, 116, 180, C.other, C.otherGlass)}
  ${egoCar(198, 200, 90)}
  ${caption("Reversing into the space between two cars")}`),
};

// ── Road signs ──────────────────────────────────────────────────────────────

const signs = {
  "sign-yield": svg(
    `
  <polygon points="200,42 344,266 56,266" fill="${C.signRed}"/>
  <polygon points="200,80 312,254 88,254" fill="#fff"/>`,
    { bg: C.sky },
  ),

  "sign-stop": svg(
    `
  <polygon points="145,44 255,44 300,110 300,190 255,256 145,256 100,190 100,110" fill="${C.signRed}"/>
  <polygon points="153,58 247,58 286,116 286,184 247,242 153,242 114,184 114,116" fill="none" stroke="#fff" stroke-width="6"/>
  <text x="200" y="152" text-anchor="middle" dominant-baseline="central" font-family="system-ui, Arial, sans-serif" font-size="56" font-weight="800" fill="#fff">STOP</text>`,
    { bg: C.sky },
  ),

  "sign-priority-road": svg(
    `
  <polygon points="200,38 312,150 200,262 88,150" fill="${C.ink}"/>
  <polygon points="200,54 296,150 200,246 104,150" fill="#fff"/>
  <polygon points="200,74 276,150 200,226 124,150" fill="${C.signYellow}"/>`,
    { bg: C.sky },
  ),

  "sign-priority-road-end": svg(
    `
  <polygon points="200,38 312,150 200,262 88,150" fill="${C.ink}"/>
  <polygon points="200,54 296,150 200,246 104,150" fill="#fff"/>
  <polygon points="200,74 276,150 200,226 124,150" fill="${C.signYellow}"/>
  <line x1="120" y1="230" x2="280" y2="70" stroke="${C.ink}" stroke-width="12"/>`,
    { bg: C.sky },
  ),

  "sign-priority-next-junction": svg(
    `
  <polygon points="200,42 344,266 56,266" fill="${C.ink}"/>
  <polygon points="200,72 320,258 80,258" fill="#fff"/>
  <rect x="190" y="126" width="20" height="112" fill="${C.ink}"/>
  <rect x="140" y="164" width="120" height="12" fill="${C.ink}"/>`,
    { bg: C.sky },
  ),

  "sign-speed-50": svg(signCircle("#fff", C.signRed, signText("50")), {
    bg: C.sky,
  }),
  "sign-speed-30": svg(signCircle("#fff", C.signRed, signText("30")), {
    bg: C.sky,
  }),
  "sign-speed-100": svg(signCircle("#fff", C.signRed, signText("100", 52)), {
    bg: C.sky,
  }),

  "sign-derestriction": svg(
    `
  <circle cx="200" cy="150" r="96" fill="${C.ink}"/>
  <circle cx="200" cy="150" r="88" fill="#fff"/>
  <g stroke="${C.ink}" stroke-width="9" stroke-linecap="round">
    <line x1="136" y1="214" x2="264" y2="86"/>
    <line x1="112" y1="190" x2="240" y2="62"/>
    <line x1="160" y1="238" x2="288" y2="110"/>
  </g>`,
    { bg: C.sky },
  ),

  "sign-advisory-130": svg(
    `
  <rect x="76" y="26" width="248" height="248" rx="14" fill="${C.signBlue}"/>
  <rect x="94" y="44" width="212" height="212" rx="8" fill="#fff"/>
  <text x="200" y="150" text-anchor="middle" dominant-baseline="central" font-family="system-ui, Arial, sans-serif" font-size="72" font-weight="800" fill="${C.ink}">130</text>`,
    { bg: C.sky },
  ),

  "sign-no-overtaking": svg(
    signCircle(
      "#fff",
      C.signRed,
      `
  <g transform="translate(-26 0)">${car(200, 150, 0, C.ink, "#5b6570")}</g>
  <g transform="translate(26 0)">${car(200, 150, 0, C.signRed, "#f8b4b4")}</g>`,
    ),
    { bg: C.sky },
  ),

  "sign-motorway": svg(
    `
  <rect x="52" y="56" width="296" height="188" rx="14" fill="${C.signBlue}"/>
  <path d="M116 214 L162 96 L200 96 L238 96 L284 214" stroke="#fff" stroke-width="12" fill="none" stroke-linejoin="round"/>
  <line x1="200" y1="96" x2="200" y2="214" stroke="#fff" stroke-width="9"/>
  <rect x="108" y="200" width="184" height="14" fill="#fff"/>`,
    { bg: C.sky },
  ),

  "sign-roundabout": svg(
    `
  <circle cx="200" cy="150" r="96" fill="${C.signBlue}"/>
  <g fill="#fff">
    <path d="M200 76 A74 74 0 0 1 258 190 L238 176 A50 50 0 0 0 200 100 Z"/>
    <path d="M144 106 A74 74 0 0 0 162 216 L176 198 A50 50 0 0 1 162 122 Z"/>
    <polygon points="196,64 224,84 196,104"/>
    <polygon points="176,224 148,204 176,184"/>
  </g>`,
    { bg: C.sky },
  ),

  "sign-pedestrian-crossing": svg(
    `
  <rect x="76" y="26" width="248" height="248" rx="10" fill="${C.signBlue}"/>
  <polygon points="120,240 200,72 280,240" fill="#fff"/>
  <g fill="${C.ink}" transform="translate(200 168) scale(1.5)">
    <circle cx="0" cy="-22" r="6"/>
    <rect x="-4" y="-15" width="8" height="16" rx="3"/>
    <rect x="-8" y="1" width="5" height="14" rx="2" transform="rotate(14 -5 1)"/>
    <rect x="3" y="1" width="5" height="14" rx="2" transform="rotate(-14 5 1)"/>
  </g>
  <g fill="${C.ink}">
    <rect x="130" y="228" width="140" height="6"/>
    <rect x="130" y="240" width="140" height="6"/>
  </g>`,
    { bg: C.sky },
  ),

  "sign-no-entry": svg(
    `
  <circle cx="200" cy="150" r="96" fill="${C.signRed}"/>
  <rect x="122" y="132" width="156" height="36" rx="4" fill="#fff"/>`,
    { bg: C.sky },
  ),

  "sign-one-way": svg(
    `
  <rect x="46" y="96" width="308" height="108" rx="10" fill="${C.signBlue}"/>
  <path d="M110 150 L280 150" stroke="#fff" stroke-width="16" stroke-linecap="round"/>
  <polygon points="270,116 320,150 270,184" fill="#fff"/>`,
    { bg: C.sky },
  ),

  "sign-children": svg(
    `
  <polygon points="200,42 344,266 56,266" fill="${C.signRed}"/>
  <polygon points="200,80 312,254 88,254" fill="#fff"/>
  <g fill="${C.ink}" transform="translate(178 196) scale(1.35)">
    <circle cx="0" cy="-30" r="7"/>
    <rect x="-5" y="-22" width="10" height="18" rx="4"/>
    <rect x="-9" y="-4" width="6" height="16" rx="2.5" transform="rotate(12 -6 -4)"/>
    <rect x="3" y="-4" width="6" height="16" rx="2.5" transform="rotate(-12 6 -4)"/>
  </g>
  <g fill="${C.ink}" transform="translate(222 200) scale(1.1)">
    <circle cx="0" cy="-30" r="7"/>
    <rect x="-5" y="-22" width="10" height="18" rx="4"/>
    <rect x="-9" y="-4" width="6" height="16" rx="2.5" transform="rotate(-16 -6 -4)"/>
    <rect x="3" y="-4" width="6" height="16" rx="2.5" transform="rotate(16 6 -4)"/>
  </g>`,
    { bg: C.sky },
  ),

  "sign-parking-restricted": svg(
    `
  <circle cx="200" cy="150" r="96" fill="${C.signRed}"/>
  <circle cx="200" cy="150" r="82" fill="${C.signBlue}"/>
  <line x1="140" y1="210" x2="260" y2="90" stroke="${C.signRed}" stroke-width="14"/>`,
    { bg: C.sky },
  ),

  "sign-priority-oncoming": svg(
    signCircle(
      "#fff",
      C.signRed,
      `
  <g transform="translate(200 150)">
    <path d="M-16 34 L-16 -20 M-26 -10 L-16 -22 L-6 -10" stroke="${C.signRed}" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M18 -34 L18 20 M8 10 L18 22 L28 10" stroke="${C.ink}" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  </g>`,
    ),
    { bg: C.sky },
  ),
};

// ── Write ───────────────────────────────────────────────────────────────────

mkdirSync(OUT_DIR, { recursive: true });
for (const stale of readdirSync(OUT_DIR).filter((f) => f.endsWith(".svg"))) {
  rmSync(join(OUT_DIR, stale));
}

const all = { ...scenes, ...signs };
for (const [name, content] of Object.entries(all)) {
  writeFileSync(join(OUT_DIR, `${name}.svg`), content, "utf8");
}

console.log(`Wrote ${Object.keys(all).length} scenario images to ${OUT_DIR}`);
