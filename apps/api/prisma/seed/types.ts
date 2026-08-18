/**
 * Shapes for the seed content files.
 *
 * The seed is the single source of truth for the question bank — there is no
 * admin CMS yet. Keeping the content declarative like this means a new topic is
 * a data edit, not a code change.
 */

export type Difficulty = "EASY" | "MEDIUM" | "HARD";

export interface OptionSeed {
  text: string;
  correct?: boolean;
}

export interface QuestionSeed {
  prompt: string;
  /** Basename of a file in apps/web/public/images/scenarios (no extension). */
  image: string;
  imageAlt: string;
  explanation: string;
  difficulty?: Difficulty;
  /** Exactly four, exactly one marked `correct`. Validated at seed time. */
  options: OptionSeed[];
}

export interface TopicSeed {
  slug: string;
  name: string;
  description: string;
  iconEmoji: string;
  /** Must match a CategorySeed slug in the same country. */
  category: string;
  questions: QuestionSeed[];
}

export interface CategorySeed {
  slug: string;
  name: string;
  description: string;
}

export interface CountrySeed {
  code: string;
  name: string;
  flagEmoji: string;
  order: number;
  facts: string;
  examQuestionCount: number;
  examPassPercent: number;
  categories: CategorySeed[];
  topics: TopicSeed[];
}

/** Resolves a seed image name to the public path the frontend serves. */
export const img = (name: string) => `/images/scenarios/${name}.svg`;
