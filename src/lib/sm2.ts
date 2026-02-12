export interface SM2State {
  easinessFactor: number;
  intervalDays: number;
  repetitions: number;
}

export interface SM2Result extends SM2State {
  nextReview: string; // YYYY-MM-DD
}

/**
 * SM-2 spaced repetition algorithm
 * @param quality - Rating from 0-5 (0=blackout, 5=perfect)
 * @param current - Current card state
 * @returns Updated state with next review date
 */
export function calculateSM2(
  quality: number,
  current: SM2State
): SM2Result {
  if (quality < 0 || quality > 5) {
    throw new Error("Quality must be between 0 and 5");
  }

  let { easinessFactor, intervalDays, repetitions } = current;

  // Update easiness factor
  const newEF =
    easinessFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  easinessFactor = Math.max(1.3, newEF);

  if (quality < 3) {
    // Failed review: reset to beginning
    repetitions = 0;
    intervalDays = 1;
  } else {
    // Successful review
    repetitions += 1;
    if (repetitions === 1) {
      intervalDays = 1;
    } else if (repetitions === 2) {
      intervalDays = 6;
    } else {
      intervalDays = Math.round(intervalDays * easinessFactor);
    }
  }

  // Calculate next review date
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + intervalDays);
  const nextReview = nextDate.toISOString().split("T")[0];

  return {
    easinessFactor: Math.round(easinessFactor * 100) / 100,
    intervalDays,
    repetitions,
    nextReview,
  };
}

/** Default state for a new (never reviewed) flashcard */
export const DEFAULT_SM2_STATE: SM2State = {
  easinessFactor: 2.5,
  intervalDays: 0,
  repetitions: 0,
};

/** Rating labels for UI */
export const RATING_LABELS: Record<number, { label: string; color: string }> = {
  0: { label: "Blackout", color: "text-red-500" },
  1: { label: "Wrong", color: "text-red-400" },
  2: { label: "Hard", color: "text-yellow-500" },
  3: { label: "Okay", color: "text-yellow-400" },
  4: { label: "Good", color: "text-green-400" },
  5: { label: "Perfect", color: "text-green-500" },
};
