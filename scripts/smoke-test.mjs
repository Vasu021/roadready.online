/**
 * End-to-end API smoke test. No dependencies — run it against a seeded dev
 * server: `npm run dev` in one terminal, `npm run smoke` in another.
 *
 * Covers the things TypeScript cannot: content counts, exam composition,
 * error-point grading in both directions, i18n fallback and the auth guards.
 */

const API = process.env.API_URL ?? "http://localhost:3001";

let passed = 0;
let failed = 0;

function ok(label, condition) {
  if (condition) {
    passed += 1;
    console.log(`  PASS  ${label}`);
  } else {
    failed += 1;
    console.log(`  FAIL  ${label}`);
  }
}

async function call(path, { method = "GET", body, token } = {}) {
  const res = await fetch(API + path, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!res.ok) {
    const error = new Error(`${method} ${path} → ${res.status}`);
    error.status = res.status;
    throw error;
  }
  return res.json();
}

async function status(path, opts) {
  try {
    await call(path, opts);
    return 200;
  } catch (err) {
    return err.status ?? 0;
  }
}

const section = (name) => console.log(`\n=== ${name} ===`);

// ── Auth ─────────────────────────────────────────────────────────────────────
section("auth");
const { token } = await call("/api/auth/register", {
  method: "POST",
  body: { email: `smoke${Date.now()}@test.local`, password: "StrongPass123" },
});
ok("register returns a token", typeof token === "string" && token.length > 100);

// ── Learning modules ─────────────────────────────────────────────────────────
section("learning modules");
const modules = await call("/api/modules/DE");
ok("14 modules", modules.length === 14);
ok("92 lessons", modules.reduce((n, m) => n + m.lessonCount, 0) === 92);
ok(
  "184 module questions",
  modules.reduce((n, m) => n + m.questionCount, 0) === 184,
);
ok(
  "2 Zusatzstoff modules",
  modules.filter((m) => m.isZusatzstoff).length === 2,
);
ok(
  "official German titles present",
  modules.every((m) => m.officialTitle.length > 3),
);

const detail = await call(`/api/modules/DE/${modules[4].slug}`, { token });
ok(
  "detail carries every lesson",
  detail.lessons.length === modules[4].lessonCount,
);
ok(
  "lessons have body and key points",
  detail.lessons.every((l) => l.body.length > 80 && l.keyPoints.length > 0),
);
ok(
  "some lessons carry a scene",
  detail.lessons.some((l) => l.sceneJson),
);
ok(
  "some lessons carry sign ids",
  detail.lessons.some((l) => l.signIds),
);

// ── Lesson progress ──────────────────────────────────────────────────────────
section("lesson progress");
const lesson = detail.lessons[0];
const first = await call("/api/modules/progress", {
  method: "POST",
  token,
  body: { moduleId: detail.id, lessonId: lesson.id },
});
ok("marks a lesson read", first.completedLessons === 1);
const again = await call("/api/modules/progress", {
  method: "POST",
  token,
  body: { moduleId: detail.id, lessonId: lesson.id },
});
ok("re-reading does not double count", again.completedLessons === 1);
ok(
  "a lesson from another module is rejected",
  (await status("/api/modules/progress", {
    method: "POST",
    token,
    body: { moduleId: detail.id, lessonId: modules[0].id },
  })) === 404,
);

// ── i18n ─────────────────────────────────────────────────────────────────────
section("i18n");
ok(
  "locale parameter accepted",
  (await call("/api/modules/DE?locale=de")).length === 14,
);
ok(
  "unknown locale falls back",
  (await call("/api/modules/DE?locale=zz")).length === 14,
);
ok(
  "untranslated fields fall back to the base text",
  (await call("/api/modules/DE?locale=tr"))[0].title === modules[0].title,
);

// ── Final test ───────────────────────────────────────────────────────────────
section("final test");
const test = await call("/api/final-test/DE/questions", { token });
ok("30 questions", test.total === 30);
ok("45 minutes", test.timeLimitSeconds === 2700);
ok("max 10 error points", test.maxErrorPoints === 10);
ok(
  "every question weighted 2-5",
  test.questions.every((q) => q.errorPoints >= 2 && q.errorPoints <= 5),
);
ok("no answer key leaked", !JSON.stringify(test).includes("isCorrect"));
ok(
  "four options per question",
  test.questions.every((q) => q.options.length === 4),
);

// ── Grading ──────────────────────────────────────────────────────────────────
section("error-point grading");
const keys = new Map();
for (const m of modules) {
  for (const k of await call(`/api/modules/DE/${m.slug}/questions/answers`, {
    token,
  })) {
    keys.set(k.questionId, k.correctOptionId);
  }
}
for (const t of await call("/api/topic-tests/DE")) {
  for (const k of await call(
    `/api/topic-tests/DE/${t.slug}/questions/answers`,
    { token },
  )) {
    keys.set(k.questionId, k.correctOptionId);
  }
}
for (const s of await call("/api/scenarios/DE")) {
  const k = await call(`/api/scenarios/DE/${s.id}/answer`, { token });
  keys.set(k.questionId, k.correctOptionId);
}
ok("answer key covers the whole catalogue", keys.size >= 280);

async function runExam(wrongTarget) {
  const paper = await call("/api/final-test/DE/questions", { token });
  const session = await call("/api/test-sessions", {
    method: "POST",
    token,
    body: { countryCode: "DE", maxScore: paper.questions.length },
  });
  let wrong = 0;
  for (const q of paper.questions) {
    const right = keys.get(q.id);
    const ids = q.options.map((o) => o.id);
    let pick = right && ids.includes(right) ? right : ids[0];
    if (wrong < wrongTarget && right && ids.includes(right)) {
      pick = ids.find((id) => id !== right);
      wrong += 1;
    }
    await call(`/api/test-sessions/${session.id}/answers`, {
      method: "POST",
      token,
      body: { questionId: q.id, selectedOptionId: pick },
    });
  }
  return call(`/api/test-sessions/${session.id}/complete`, {
    method: "PATCH",
    token,
  });
}

const perfect = await runExam(0);
ok(
  `all correct → 0 points, grade A, passed (got ${perfect.grade})`,
  perfect.errorPoints === 0 && perfect.grade === "A" && perfect.passed,
);

const poor = await runExam(6);
ok(
  `six wrong → over 10 points, failed (got ${poor.errorPoints} points)`,
  poor.errorPoints > 10 && !poor.passed,
);

const breakdown = await call(`/api/test-sessions/${poor.id}`, { token });
ok(
  "breakdown carries error points per question",
  breakdown.breakdown.every((row) => typeof row.errorPoints === "number"),
);
ok("breakdown is complete", breakdown.breakdown.length === 30);

// ── Module quiz ──────────────────────────────────────────────────────────────
section("module quiz");
const quiz = await call("/api/modules/DE/de-m05-right-of-way/questions");
ok("module serves its own pool", quiz.questions.length === 16);
ok("no answer key in the payload", !JSON.stringify(quiz).includes("isCorrect"));
ok(
  "answer key is auth-guarded",
  (await status("/api/modules/DE/de-m05-right-of-way/questions/answers")) ===
    401,
);

// ── Preferences ──────────────────────────────────────────────────────────────
section("preferences");
const prefs = await call("/api/users/me/preferences", {
  method: "PATCH",
  token,
  body: { locale: "tr", theme: "wood" },
});
ok("saves locale and theme", prefs.locale === "tr" && prefs.theme === "wood");
ok(
  "rejects an unknown locale",
  (await status("/api/users/me/preferences", {
    method: "PATCH",
    token,
    body: { locale: "xx" },
  })) === 400,
);
ok(
  "rejects an unknown theme",
  (await status("/api/users/me/preferences", {
    method: "PATCH",
    token,
    body: { theme: "neon" },
  })) === 400,
);

// ── Security guards ──────────────────────────────────────────────────────────
section("security guards");
ok(
  "module progress needs auth",
  (await status("/api/modules/progress", {
    method: "POST",
    body: { moduleId: "a", lessonId: "b" },
  })) === 401,
);
ok(
  "final test needs auth",
  (await status("/api/final-test/DE/questions")) === 401,
);
ok(
  "preferences need auth",
  (await status("/api/users/me/preferences", {
    method: "PATCH",
    body: { theme: "wood" },
  })) === 401,
);
ok(
  "malformed country code rejected",
  (await status("/api/modules/XXX")) === 400,
);
ok(
  "path traversal in a slug rejected",
  [400, 404].includes(await status("/api/modules/DE/../../etc")),
);

console.log(`\n${passed} passed, ${failed} failed\n`);
process.exit(failed === 0 ? 0 : 1);
