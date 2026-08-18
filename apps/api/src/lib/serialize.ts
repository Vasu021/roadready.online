import type {
  AuthUser,
  CountryDetail,
  CountrySummary,
  Grade,
  QuizDetail,
  QuizQuestion,
  QuizSummary,
} from "@roadready/shared";
import type {
  Country,
  Option,
  Question,
  Quiz,
  QuizItem,
  Topic,
  User,
} from "@prisma/client";

/**
 * Everything the API sends to the client is built here rather than by spreading
 * Prisma rows into responses. That is what keeps `Option.isCorrect` and
 * `User.password` from ever reaching the wire by accident.
 */

export function toAuthUser(
  user: User & { selectedCountry?: { code: string } | null },
): AuthUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    isPremium: user.isPremium,
    selectedCountryCode: user.selectedCountry?.code ?? null,
  };
}

export function toCountrySummary(
  country: Country,
  counts: { topics: number; questions: number },
): CountrySummary {
  return {
    id: country.id,
    code: country.code,
    name: country.name,
    flagEmoji: country.flagEmoji,
    order: country.order,
    topicCount: counts.topics,
    questionCount: counts.questions,
    examQuestionCount: country.examQuestionCount,
    examPassPercent: country.examPassPercent,
  };
}

export function toCountryDetail(
  country: Country,
  counts: { topics: number; questions: number },
): CountryDetail {
  return { ...toCountrySummary(country, counts), facts: country.facts };
}

/**
 * Builds one question payload.
 *
 * `reveal` is the single switch that decides whether the correct answer and the
 * explanation are included. Callers derive it from quiz mode and status — never
 * from anything the client sends.
 */
export function toQuizQuestion(
  item: QuizItem,
  question: Question & { options: Option[]; topic: Topic },
  opts: { reveal: boolean; isBookmarked: boolean },
): QuizQuestion {
  const correct = question.options.find((o) => o.isCorrect);

  return {
    id: question.id,
    order: item.order,
    prompt: question.prompt,
    imageUrl: question.imageUrl,
    imageAlt: question.imageAlt,
    difficulty: question.difficulty,
    topic: {
      slug: question.topic.slug,
      name: question.topic.name,
      iconEmoji: question.topic.iconEmoji,
    },
    options: question.options
      .slice()
      .sort((a, b) => a.order - b.order)
      .map((o) => ({
        id: o.id,
        label: o.label,
        text: o.text,
        order: o.order,
      })),
    isBookmarked: opts.isBookmarked,
    selectedOptionId: item.selectedOptionId,
    isCorrect: opts.reveal ? item.isCorrect : null,
    correctOptionId: opts.reveal ? (correct?.id ?? null) : null,
    explanation: opts.reveal ? question.explanation : null,
  };
}

export function toQuizSummary(
  quiz: Quiz & {
    country: Country;
    topic: Topic | null;
    items?: Pick<QuizItem, "answeredAt">[];
  },
): QuizSummary {
  return {
    id: quiz.id,
    mode: quiz.mode,
    source: quiz.source,
    status: quiz.status,
    countryCode: quiz.country.code,
    countryName: quiz.country.name,
    countryFlag: quiz.country.flagEmoji,
    topicSlug: quiz.topic?.slug ?? null,
    topicName: quiz.topic?.name ?? null,
    totalQuestions: quiz.totalQuestions,
    answeredCount:
      quiz.items?.filter((i) => i.answeredAt !== null).length ??
      quiz.totalQuestions,
    correctCount: quiz.correctCount,
    scorePercent: quiz.scorePercent,
    passed: quiz.passed,
    grade: (quiz.grade as Grade | null) ?? null,
    passPercent: quiz.country.examPassPercent,
    startedAt: quiz.startedAt.toISOString(),
    completedAt: quiz.completedAt?.toISOString() ?? null,
  };
}

export function toQuizDetail(
  quiz: Parameters<typeof toQuizSummary>[0],
  questions: QuizQuestion[],
): QuizDetail {
  return { ...toQuizSummary(quiz), questions };
}
