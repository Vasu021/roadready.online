import { PrismaClient } from "@prisma/client";
import { SEED_COUNTRIES } from "./data/countries";
import { GERMANY_TOPICS } from "./data/germanyTopics";
import { GERMANY_SCENARIOS } from "./data/germanyScenarios";

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

/**
 * The platform moved from 3D simulation scenarios to theory content, so old
 * rows are cleared before seeding. Cascades remove their questions and options.
 */
async function clearOldContent() {
  const scenarios = await prisma.scenario.deleteMany({});
  const categories = await prisma.scenarioCategory.deleteMany({});
  const topics = await prisma.topicTest.deleteMany({});
  console.log(
    `  removed ${scenarios.count} scenarios, ${categories.count} categories, ${topics.count} topic tests`,
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
    console.log(
      `  ${topic.order.toString().padStart(2)}. ${topic.nameEN} — ${created._count.questions} questions`,
    );
  }

  return questionCount;
}

async function seedScenarios(countryId: string) {
  const category = await prisma.scenarioCategory.create({
    data: { countryId, name: SCENARIO_CATEGORY, order: 1 },
  });

  for (const s of GERMANY_SCENARIOS) {
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
        questions: {
          create: [
            {
              questionText: s.questionText,
              explanation: s.explanation,
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

  console.log(`  ${GERMANY_SCENARIOS.length} driving situations`);
  return GERMANY_SCENARIOS.length;
}

async function validateContent() {
  const problems: string[] = [];

  const questions = await prisma.question.findMany({
    select: {
      id: true,
      questionText: true,
      options: { select: { isCorrect: true } },
    },
  });

  for (const q of questions) {
    const correct = q.options.filter((o) => o.isCorrect).length;
    if (q.options.length !== 4) {
      problems.push(
        `"${q.questionText.slice(0, 50)}…" has ${q.options.length} options (expected 4)`,
      );
    }
    if (correct !== 1) {
      problems.push(
        `"${q.questionText.slice(0, 50)}…" has ${correct} correct options (expected 1)`,
      );
    }
  }

  if (problems.length > 0) {
    for (const p of problems) console.error(`  ✖ ${p}`);
    throw new Error(
      `Seed validation failed with ${problems.length} problem(s)`,
    );
  }

  console.log(
    `  ✓ ${questions.length} questions each have exactly 1 of 4 correct options`,
  );
}

async function main() {
  console.log("\nSeeding RoadReady theory content\n");

  console.log("Countries:");
  const countryIds = await seedCountries();

  console.log("\nClearing previous content:");
  await clearOldContent();

  console.log("\nTopic tests (Germany):");
  const questionCount = await seedTopicTests("DE");

  console.log("\nDriving situations (Germany):");
  const scenarioCount = await seedScenarios(countryIds["DE"]);

  console.log("\nValidating:");
  await validateContent();

  console.log(
    `\nDone — ${GERMANY_TOPICS.length} topics, ${questionCount} topic questions, ${scenarioCount} driving situations.\n`,
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
