import { makeScenario, L_ROUTE } from "./makeScenario";
import type { ScenarioDef } from "./types";

// Aggregate graded test (PROMPT Step 8). The car drives the shared L-route and
// pauses at three checkpoints; each presents a chunk of questions sampled across
// all Germany scenarios (fetched + scored server-side via a TestSession — see
// Simulation.tsx + TriggerWatcher's full-test branch). `fullTest: true` switches
// the whole flow to server scoring + the graded TestResultsScreen.
const fullTestGermany: ScenarioDef = {
  ...makeScenario({
    slug: "full-test-germany",
    name: "Full Test — Germany",
    description:
      "The graded theory test — questions drawn from across every scenario, scored at the end.",
    difficulty: "medium",
    timeLimit: 900,
    waypoints: L_ROUTE,
    decisions: [
      {
        id: "ft-zone-1",
        triggerZ: 22,
        prompt: "Test checkpoint 1",
        teaching: "Answer each question, then drive on to the next checkpoint.",
      },
      {
        id: "ft-zone-2",
        triggerX: -18,
        prompt: "Test checkpoint 2",
        teaching: "Answer each question, then drive on to the next checkpoint.",
      },
      {
        id: "ft-zone-3",
        triggerX: -36,
        prompt: "Test checkpoint 3",
        teaching: "Answer the final questions to finish the test.",
      },
    ],
    objectiveText: {
      "ft-zone-1": "Checkpoint 1",
      "ft-zone-2": "Checkpoint 2",
      "ft-zone-3": "Checkpoint 3",
    },
  }),
  fullTest: true,
};

export default fullTestGermany;
