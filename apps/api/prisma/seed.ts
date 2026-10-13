import { PrismaClient } from "@prisma/client";
import { SEED_COUNTRIES } from "./data/countries";
import { GERMANY_TOPICS } from "./data/germanyTopics";
import { GERMANY_SCENARIOS } from "./data/germanyScenarios";
import { GERMANY_MODULES } from "./data/modules";
import { SCENES } from "./data/scenes";

const prisma = new PrismaClient();

/** Category that holds the illustrated driving-situation questions. */
const SCENARIO_CATEGORY = "Driving Situations";

async function seedCountries() {
  const byCode: Record<string, string> = {};

  for (const c of SEED_COUNTRIES) {
    const country = await prisma.country.upsert({
      where: { code: c.code },
      update: {
        name: c.name,
        flagEmoji: c.flagEmoji,
        isActive: c.isActive,
        facts: c.facts.trim(),
      },
      create: {
        code: c.code,
        name: c.name,
        flagEmoji: c.flagEmoji,
        isActive: c.isActive,
        facts: c.facts.trim(),
      },
    });
    byCode[c.code] = country.id;
    console.log(`  ${c.flagEmoji} ${c.name} (${c.code})`);
  }

  return byCode;
}

/** Content is rebuilt from the seed files on every run; cascades clean up. */
async function clearOldContent() {
  const scenarios = await prisma.scenario.deleteMany({});
  const categories = await prisma.scenarioCategory.deleteMany({});
  const topics = await prisma.topicTest.deleteMany({});
  const modules = await prisma.module.deleteMany({});
  console.log(
    `  removed ${scenarios.count} scenarios, ${categories.count} categories, ${topics.count} topic tests, ${modules.count} modules`,
  );
}

async function seedTopicTests(countryCode: string) {
  let questionCount = 0;

  for (const topic of GERMANY_TOPICS) {
    const created = await prisma.topicTest.create({
      data: {
        countryCode,
        slug: topic.slug,
        name: topic.name,
        nameEN: topic.nameEN,
        description: topic.description,
        order: topic.order,
        isActive: true,
        isSignTopic: topic.isSignTopic,
        questions: {
          create: topic.questions.map((q, qi) => ({
            questionText: q.questionText,
            explanation: q.explanation,
            errorPoints: q.errorPoints ?? 3,
            order: qi + 1,
            options: {
              create: q.options.map((o, oi) => ({
                optionText: o.text,
                isCorrect: o.isCorrect,
                order: oi + 1,
              })),
            },
          })),
        },
      },
      include: { _count: { select: { questions: true } } },
    });

    questionCount += created._count.questions;
  }

  console.log(`  ${GERMANY_TOPICS.length} topics, ${questionCount} questions`);
  return questionCount;
}

/**
 * Learning modules: one per official lesson of the FahrschAusbO curriculum,
 * each with its lessons and its own question pool.
 */
async function seedModules(countryCode: string) {
  let lessonCount = 0;
  let questionCount = 0;

  for (const mod of GERMANY_MODULES) {
    const created = await prisma.module.create({
      data: {
        countryCode,
        slug: mod.slug,
        order: mod.order,
        officialTitle: mod.officialTitle,
        title: mod.title,
        summary: mod.summary,
        intro: mod.intro,
        estimatedMinutes: mod.estimatedMinutes,
        isZusatzstoff: mod.isZusatzstoff ?? false,
        isActive: true,
        lessons: {
          create: mod.lessons.map((lesson, li) => ({
            slug: lesson.slug,
            order: li + 1,
            title: lesson.title,
            body: lesson.body,
            keyPoints: lesson.keyPoints,
            signIds: lesson.signIds ?? undefined,
            sceneJson: (lesson.scene as object | undefined) ?? undefined,
          })),
        },
        questions: {
          create: mod.questions.map((q, qi) => ({
            questionText: q.questionText,
            explanation: q.explanation,
            errorPoints: q.errorPoints ?? 3,
            order: qi + 1,
            options: {
              create: q.options.map((o, oi) => ({
                optionText: o.text,
                isCorrect: o.isCorrect,
                order: oi + 1,
              })),
            },
          })),
        },
      },
      include: { _count: { select: { lessons: true, questions: true } } },
    });

    lessonCount += created._count.lessons;
    questionCount += created._count.questions;
    console.log(
      `  ${String(mod.order).padStart(2)}. ${mod.title} — ${created._count.lessons} lessons, ${created._count.questions} questions`,
    );
  }

  return { lessonCount, questionCount };
}

async function seedScenarios(countryId: string) {
  const category = await prisma.scenarioCategory.create({
    data: { countryId, name: SCENARIO_CATEGORY, order: 1 },
  });

  let withScene = 0;

  for (const s of GERMANY_SCENARIOS) {
    const scene = SCENES[s.slug];
    if (scene) withScene += 1;

    await prisma.scenario.create({
      data: {
        countryId,
        categoryId: category.id,
        slug: s.slug,
        name: s.name,
        description: s.description,
        order: s.order,
        isActive: true,
        isPremium: false,
        type: "PRACTICE",
        imagePrompt: s.imagePrompt,
        imageUrl: null,
        sceneJson: (scene as object | undefined) ?? undefined,
        questions: {
          create: [
            {
              questionText: s.questionText,
              explanation: s.explanation,
              errorPoints: 4,
              order: 1,
              options: {
                create: s.options.map((o, oi) => ({
                  optionText: o.text,
                  isCorrect: o.isCorrect,
                  order: oi + 1,
                })),
              },
            },
          ],
        },
      },
    });
  }

  console.log(
    `  ${GERMANY_SCENARIOS.length} driving situations, ${withScene} with a rendered scene`,
  );
  return GERMANY_SCENARIOS.length;
}

async function validateContent() {
  const problems: string[] = [];

  const questions = await prisma.question.findMany({
    select: {
      questionText: true,
      errorPoints: true,
      options: { select: { isCorrect: true } },
    },
  });

  for (const q of questions) {
    const label = `"${q.questionText.slice(0, 48)}…"`;
    const correct = q.options.filter((o) => o.isCorrect).length;

    if (q.options.length !== 4) {
      problems.push(`${label} has ${q.options.length} options (expected 4)`);
    }
    if (correct !== 1) {
      problems.push(`${label} has ${correct} correct options (expected 1)`);
    }
    if (q.errorPoints < 2 || q.errorPoints > 5) {
      problems.push(`${label} has errorPoints ${q.errorPoints} (expected 2–5)`);
    }
  }

  // Every lesson must belong to a module and carry at least one key point.
  const lessons = await prisma.lesson.findMany({
    select: { title: true, keyPoints: true, body: true },
  });
  for (const l of lessons) {
    if (!Array.isArray(l.keyPoints) || l.keyPoints.length === 0) {
      problems.push(`Lesson "${l.title}" has no key points`);
    }
    if (l.body.trim().length < 80) {
      problems.push(`Lesson "${l.title}" has a suspiciously short body`);
    }
  }

  if (problems.length > 0) {
    for (const p of problems) console.error(`  ✖ ${p}`);
    throw new Error(
      `Seed validation failed with ${problems.length} problem(s)`,
    );
  }

  console.log(
    `  ✓ ${questions.length} questions valid (4 options, 1 correct, 2–5 error points)`,
  );
  console.log(`  ✓ ${lessons.length} lessons have body text and key points`);
}

async function main() {
  console.log("\nSeeding RoadReady theory content\n");

  console.log("Countries:");
  const countryIds = await seedCountries();

  console.log("\nClearing previous content:");
  await clearOldContent();

  console.log("\nLearning modules (Germany):");
  const { lessonCount, questionCount: moduleQuestions } =
    await seedModules("DE");

  console.log("\nTopic tests (Germany):");
  const topicQuestions = await seedTopicTests("DE");

  console.log("\nDriving situations (Germany):");
  const scenarioCount = await seedScenarios(countryIds["DE"]);

  console.log("\nValidating:");
  await validateContent();

  console.log(
    `\nDone — ${GERMANY_MODULES.length} modules, ${lessonCount} lessons, ` +
      `${moduleQuestions + topicQuestions + scenarioCount} questions, ` +
      `${scenarioCount} driving situations.\n`,
  );
}

main()
  .catch((e) => {
    console.error("\nSeed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
