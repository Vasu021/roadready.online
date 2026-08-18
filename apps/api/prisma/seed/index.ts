import { PrismaClient } from "@prisma/client";
import { germany } from "./germany";
import { france } from "./france";
import { img, type CountrySeed } from "./types";

const prisma = new PrismaClient();

const COUNTRIES: CountrySeed[] = [germany, france];

/** Topics with order 1–3 are free; the rest need Premium. */
const FREE_TOPICS_PER_COUNTRY = 3;

const LABELS = ["A", "B", "C", "D"];

/** FNV-1a — small, dependency-free, and stable across Node versions. */
function hash(seed: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h;
}

/**
 * Shuffles a question's options.
 *
 * The content files list the correct answer first because that is far easier to
 * write and review — but serving them that way would make every answer "A".
 * The shuffle is keyed off the question's identity rather than Math.random, so
 * re-running the seed leaves existing option order (and any quiz history that
 * references it) untouched.
 */
function shuffleOptions<T>(items: T[], seed: string): T[] {
  const out = [...items];
  let state = hash(seed) || 1;
  const next = () => {
    // xorshift32
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 0x100000000;
  };
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * Fails loudly before touching the database. A question bank with two correct
 * answers, or a dangling image reference, is the kind of bug that only surfaces
 * as a confused user weeks later.
 */
function validate(): void {
  const errors: string[] = [];
  const seenTopicSlugs = new Set<string>();

  for (const country of COUNTRIES) {
    const categorySlugs = new Set(country.categories.map((c) => c.slug));

    for (const topic of country.topics) {
      const where = `${country.code}/${topic.slug}`;

      if (seenTopicSlugs.has(topic.slug)) {
        errors.push(`${where}: duplicate topic slug`);
      }
      seenTopicSlugs.add(topic.slug);

      if (!categorySlugs.has(topic.category)) {
        errors.push(`${where}: unknown category "${topic.category}"`);
      }
      if (topic.questions.length === 0) {
        errors.push(`${where}: has no questions`);
      }

      topic.questions.forEach((q, i) => {
        const correct = q.options.filter((o) => o.correct).length;
        if (q.options.length !== LABELS.length) {
          errors.push(
            `${where}#${i + 1}: expected ${LABELS.length} options, got ${q.options.length}`,
          );
        }
        if (correct !== 1) {
          errors.push(
            `${where}#${i + 1}: expected 1 correct option, got ${correct}`,
          );
        }
        if (!q.imageAlt?.trim()) {
          errors.push(`${where}#${i + 1}: missing imageAlt`);
        }
        if (!q.explanation?.trim()) {
          errors.push(`${where}#${i + 1}: missing explanation`);
        }
      });
    }
  }

  if (errors.length > 0) {
    throw new Error(`Seed validation failed:\n  - ${errors.join("\n  - ")}`);
  }
}

async function seedCountry(seed: CountrySeed): Promise<void> {
  const country = await prisma.country.upsert({
    where: { code: seed.code },
    update: {
      name: seed.name,
      flagEmoji: seed.flagEmoji,
      isActive: true,
      order: seed.order,
      facts: seed.facts,
      examQuestionCount: seed.examQuestionCount,
      examPassPercent: seed.examPassPercent,
    },
    create: {
      code: seed.code,
      name: seed.name,
      flagEmoji: seed.flagEmoji,
      isActive: true,
      order: seed.order,
      facts: seed.facts,
      examQuestionCount: seed.examQuestionCount,
      examPassPercent: seed.examPassPercent,
    },
  });

  const categoryIdBySlug = new Map<string, string>();
  for (const [i, cat] of seed.categories.entries()) {
    const row = await prisma.category.upsert({
      where: { countryId_slug: { countryId: country.id, slug: cat.slug } },
      update: { name: cat.name, description: cat.description, order: i + 1 },
      create: {
        countryId: country.id,
        slug: cat.slug,
        name: cat.name,
        description: cat.description,
        order: i + 1,
      },
    });
    categoryIdBySlug.set(cat.slug, row.id);
  }

  for (const [t, topicSeed] of seed.topics.entries()) {
    const order = t + 1;
    const topic = await prisma.topic.upsert({
      where: { slug: topicSeed.slug },
      update: {
        countryId: country.id,
        categoryId: categoryIdBySlug.get(topicSeed.category)!,
        name: topicSeed.name,
        description: topicSeed.description,
        iconEmoji: topicSeed.iconEmoji,
        order,
        isActive: true,
        isPremium: order > FREE_TOPICS_PER_COUNTRY,
      },
      create: {
        countryId: country.id,
        categoryId: categoryIdBySlug.get(topicSeed.category)!,
        slug: topicSeed.slug,
        name: topicSeed.name,
        description: topicSeed.description,
        iconEmoji: topicSeed.iconEmoji,
        order,
        isActive: true,
        isPremium: order > FREE_TOPICS_PER_COUNTRY,
      },
    });

    // Questions are keyed by (topic, order) so re-running the seed edits the
    // existing rows rather than orphaning quiz history that references them.
    for (const [q, questionSeed] of topicSeed.questions.entries()) {
      const questionOrder = q + 1;
      const existing = await prisma.question.findFirst({
        where: { topicId: topic.id, order: questionOrder },
      });

      const data = {
        topicId: topic.id,
        order: questionOrder,
        prompt: questionSeed.prompt,
        imageUrl: img(questionSeed.image),
        imageAlt: questionSeed.imageAlt,
        explanation: questionSeed.explanation,
        difficulty: questionSeed.difficulty ?? "MEDIUM",
        isActive: true,
      } as const;

      const question = existing
        ? await prisma.question.update({ where: { id: existing.id }, data })
        : await prisma.question.create({ data });

      // Replacing options wholesale keeps them consistent with the seed; any
      // QuizItem that pointed at an old option is nulled by onDelete: SetNull.
      await prisma.option.deleteMany({ where: { questionId: question.id } });
      await prisma.option.createMany({
        data: shuffleOptions(
          questionSeed.options,
          `${topicSeed.slug}#${questionOrder}`,
        ).map((o, i) => ({
          questionId: question.id,
          label: LABELS[i],
          text: o.text,
          isCorrect: Boolean(o.correct),
          order: i + 1,
        })),
      });
    }

    // Drop questions the seed no longer defines for this topic.
    await prisma.question.deleteMany({
      where: { topicId: topic.id, order: { gt: topicSeed.questions.length } },
    });
  }

  const questionCount = await prisma.question.count({
    where: { topic: { countryId: country.id } },
  });
  console.log(
    `  ${country.flagEmoji} ${country.name}: ${seed.categories.length} categories, ${seed.topics.length} topics, ${questionCount} questions`,
  );
}

async function main(): Promise<void> {
  console.log("Validating seed content...");
  validate();

  console.log("Seeding database...");
  for (const country of COUNTRIES) {
    await seedCountry(country);
  }
  console.log("Done.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
