import type { SeedCountry } from "./types";

export const SEED_COUNTRIES: SeedCountry[] = [
  {
    code: "DE",
    name: "Germany",
    flagEmoji: "🇩🇪",
    isActive: true,
    facts: `
      <p><strong>The German theory test (Theoretische Fahrprüfung)</strong> is taken on a computer at a TÜV or DEKRA centre. Questions are drawn from an official national catalogue.</p>
      <ul>
        <li><strong>30 questions</strong> for category B (car), each worth 2–5 error points</li>
        <li>You pass with <strong>no more than 10 error points</strong> — and never with two 5-point questions wrong</li>
        <li>Available in <strong>11 languages</strong>, including English, Turkish, Arabic and French</li>
        <li>General limits: <strong>50 km/h</strong> in town, <strong>100 km/h</strong> on country roads, <strong>no general limit</strong> on much of the Autobahn</li>
        <li>Core rule to master: <strong>Rechts vor Links</strong> — right before left at unmarked junctions</li>
      </ul>
      <p>RoadReady covers the full sign catalogue, twelve topic areas and illustrated driving situations.</p>
    `,
  },
  {
    code: "FR",
    name: "France",
    flagEmoji: "🇫🇷",
    isActive: true,
    facts: `
      <p><strong>The French theory test (Code de la route)</strong> is a 40-question exam taken at an approved centre.</p>
      <ul>
        <li><strong>40 questions</strong>, of which at least <strong>35 must be correct</strong></li>
        <li>General limits: <strong>50 km/h</strong> in town, <strong>80 km/h</strong> on two-way roads without a central divider, <strong>130 km/h</strong> on the autoroute (110 in rain)</li>
        <li>Core rule to master: <strong>Priorité à droite</strong></li>
      </ul>
      <p><em>French content is being written — the full topic set is coming soon.</em></p>
    `,
  },
];
