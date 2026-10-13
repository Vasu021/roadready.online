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
const modules = await call("/api/modules/DE", { token });
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
  (await call("/api/modules/DE?locale=de", { token })).length === 14,
);
ok(
  "unknown locale falls back",
  (await call("/api/modules/DE?locale=zz", { token })).length === 14,
);
ok(
  "untranslated fields fall back to the base text",
  (await call("/api/modules/DE?locale=tr", { token }))[0].title ===
    modules[0].title,
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
for (const t of await call("/api/topic-tests/DE", { token })) {
  for (const k of await call(
    `/api/topic-tests/DE/${t.slug}/questions/answers`,
    { token },
  )) {
    keys.set(k.questionId, k.correctOptionId);
  }
}
for (const s of await call("/api/scenarios/DE", { token })) {
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
const quiz = await call("/api/modules/DE/de-m05-right-of-way/questions", {
  token,
});
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

// ── Access control ───────────────────────────────────────────────────────────
section("access control");

// The public surface is deliberately tiny. Everything else is the product.
const PUBLIC = ["/api/health", "/api/countries", "/api/countries/DE/facts"];
for (const path of PUBLIC) {
  ok(`public: ${path}`, (await status(path)) === 200);
}

// Changing the URL must not be a way in. Each of these serves course content
// or user data and must refuse a request that carries no session.
const PROTECTED = [
  "/api/countries/DE/scenarios",
  "/api/modules/DE",
  `/api/modules/DE/${modules[0].slug}`,
  `/api/modules/DE/${modules[0].slug}/questions`,
  `/api/modules/DE/${modules[0].slug}/questions/answers`,
  "/api/topic-tests/DE",
  "/api/topic-tests/DE/attempts",
  "/api/scenarios/DE",
  "/api/final-test/DE/questions",
  "/api/users/me",
];
for (const path of PROTECTED) {
  ok(`needs auth: ${path}`, (await status(path)) === 401);
}

ok(
  "module progress needs auth",
  (await status("/api/modules/progress", {
    method: "POST",
    body: { moduleId: "a", lessonId: "b" },
  })) === 401,
);
ok(
  "preferences need auth",
  (await status("/api/users/me/preferences", {
    method: "PATCH",
    body: { theme: "wood" },
  })) === 401,
);

// ── Forged tokens ────────────────────────────────────────────────────────────
section("forged tokens");

const b64 = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
const claims = {
  sub: "caaaaaaaaaaaaaaaaaaaaaaa",
  email: "attacker@test.local",
  exp: Math.floor(Date.now() / 1000) + 86_400,
};

// Right shape, far-future expiry, signature made up. Decoding the payload
// would accept this; verifying the signature must not.
const unsigned = `${b64({ alg: "HS256", typ: "JWT" })}.${b64(claims)}.bm90LWEtc2lnbmF0dXJl`;
ok(
  "forged signature rejected",
  (await status("/api/users/me", { token: unsigned })) === 401,
);

// The classic downgrade: claim the token needs no signature at all.
const algNone = `${b64({ alg: "none", typ: "JWT" })}.${b64(claims)}.`;
ok(
  "alg:none rejected",
  (await status("/api/users/me", { token: algNone })) === 401,
);
ok(
  "forged token cannot read content",
  (await status("/api/modules/DE", { token: unsigned })) === 401,
);
ok(
  "garbage token rejected",
  (await status("/api/users/me", { token: "x.y.z" })) === 401,
);

// ── One user, one account ────────────────────────────────────────────────────
section("cross-user access");

const victim = await call("/api/auth/register", {
  method: "POST",
  body: { email: `victim${Date.now()}@test.local`, password: "StrongPass123" },
});
const attacker = await call("/api/auth/register", {
  method: "POST",
  body: { email: `rogue${Date.now()}@test.local`, password: "StrongPass123" },
});

const victimSession = await call("/api/test-sessions", {
  method: "POST",
  token: victim.token,
  body: { countryCode: "DE", maxScore: 30 },
});

ok(
  "cannot read another user's test session",
  (await status(`/api/test-sessions/${victimSession.id}`, {
    token: attacker.token,
  })) === 403,
);
ok(
  "cannot answer in another user's test session",
  (await status(`/api/test-sessions/${victimSession.id}/answers`, {
    method: "POST",
    token: attacker.token,
    body: { questionId: "a".repeat(25), selectedOptionId: "b".repeat(25) },
  })) === 403,
);
ok(
  "cannot complete another user's test session",
  (await status(`/api/test-sessions/${victimSession.id}/complete`, {
    method: "PATCH",
    token: attacker.token,
  })) === 403,
);
ok(
  "cannot read another user's progress",
  (await status(`/api/progress/${victim.user.id}`, {
    token: attacker.token,
  })) === 403,
);
ok(
  "cannot read another user's scenario progress",
  (await status(`/api/scenarios/progress/${victim.user.id}/DE`, {
    token: attacker.token,
  })) === 403,
);
ok(
  "can read own progress",
  (await status(`/api/progress/${victim.user.id}`, {
    token: victim.token,
  })) === 200,
);

// ── Input validation ─────────────────────────────────────────────────────────
section("input validation");
ok(
  "malformed country code rejected",
  (await status("/api/modules/XXX", { token })) === 400,
);
ok(
  "path traversal in a slug rejected",
  [400, 404].includes(await status("/api/modules/DE/../../etc", { token })),
);
ok(
  "progress for an unknown scenario rejected",
  [400, 404].includes(
    await status("/api/progress", {
      method: "POST",
      token,
      body: { scenarioId: "no-such-scenario", passed: true, score: 1 },
    }),
  ),
);
ok(
  "progress with a non-boolean result rejected",
  (await status("/api/progress", {
    method: "POST",
    token,
    body: { scenarioId: "rechts-vor-links", passed: "yes" },
  })) === 400,
);
ok(
  "progress with an out-of-range score rejected",
  (await status("/api/progress", {
    method: "POST",
    token,
    body: { scenarioId: "rechts-vor-links", passed: true, score: 999999 },
  })) === 400,
);
ok(
  "progress with an unknown mode rejected",
  (await status("/api/progress", {
    method: "POST",
    token,
    body: { scenarioId: "rechts-vor-links", passed: true, mode: "ADMIN" },
  })) === 400,
);

console.log(`\n${passed} passed, ${failed} failed\n`);
process.exit(failed === 0 ? 0 : 1);
