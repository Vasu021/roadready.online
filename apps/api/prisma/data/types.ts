// Shared shapes for the seed content modules.

export interface SeedOption {
  text: string;
  isCorrect: boolean;
}

export interface SeedQuestion {
  questionText: string;
  explanation: string;
  options: SeedOption[];
}

export interface SeedTopic {
  slug: string;
  /** German topic name shown as the primary label. */
  name: string;
  /** English topic name shown as the secondary label. */
  nameEN: string;
  description: string;
  order: number;
  /** Sign-recognition topics feed the sign block of the final theory test. */
  isSignTopic: boolean;
  questions: SeedQuestion[];
}

export interface SeedScenario {
  slug: string;
  name: string;
  description: string;
  order: number;
  /** Describes the driving situation; rendered as an illustrated placeholder. */
  imagePrompt: string;
  questionText: string;
  explanation: string;
  options: SeedOption[];
}

export interface SeedCountry {
  code: string;
  name: string;
  flagEmoji: string;
  isActive: boolean;
  facts: string;
}
