/**
 * SpacedRepetitionEngine.ts
 * SuperMemo SM-2 Adaptive Algorithm for Medical Spaced Repetition Flashcards
 * Location: frontend/.gemini/skills/SpacedRepetitionEngine.ts
 *
 * Implements:
 * 1. SM-2 Easiness Factor (EF) dynamic adjustment based on 0-5 user recall score.
 * 2. Interval scheduling: I(1) = 1 day, I(2) = 6 days, I(n) = I(n-1) * EF.
 * 3. Overdue queue sorting and retention metrics calculation.
 * 4. Interval histogram clustering for student knowledge retention analytics.
 */

export type ReviewQuality = 0 | 1 | 2 | 3 | 4 | 5;
/**
 * 0 - Complete blackout
 * 1 - Incorrect response; the correct one remembered upon display
 * 2 - Incorrect response; where the correct one seemed easy to recall
 * 3 - Correct response recalled with serious difficulty
 * 4 - Correct response after a hesitation
 * 5 - Perfect response with immediate recall
 */

export interface FlashcardReviewRecord {
  cardId: string;
  easinessFactor: number; // default 2.5, minimum 1.3
  intervalDays: number; // days until next review
  repetitions: number; // consecutive correct reviews (quality >= 3)
  nextReviewDate: Date;
  lastReviewDate: Date | null;
  totalReviews: number;
  retentionHistory: ReviewQuality[];
}

export interface SessionStats {
  cardsReviewed: number;
  correctCount: number;
  averageQuality: number;
  retentionRate: number; // percentage 0-100
  nextSessionDueCount: number;
}

/**
 * Initializes a new flashcard with standard SM-2 baseline parameters
 */
export function initializeCard(cardId: string): FlashcardReviewRecord {
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  return {
    cardId,
    easinessFactor: 2.5,
    intervalDays: 1,
    repetitions: 0,
    nextReviewDate: tomorrow,
    lastReviewDate: null,
    totalReviews: 0,
    retentionHistory: [],
  };
}

/**
 * Processes a review grade according to the SuperMemo SM-2 algorithm
 */
export function processReview(
  record: FlashcardReviewRecord,
  quality: ReviewQuality
): FlashcardReviewRecord {
  const now = new Date();
  let nextRepetitions = record.repetitions;
  let nextInterval = record.intervalDays;
  let nextEF = record.easinessFactor;

  if (quality < 3) {
    // Incorrect response: lapse -> reset repetition counter to 0, review again tomorrow
    nextRepetitions = 0;
    nextInterval = 1;
  } else {
    // Correct response: increment streak and expand interval
    if (nextRepetitions === 0) {
      nextInterval = 1;
    } else if (nextRepetitions === 1) {
      nextInterval = 6;
    } else {
      nextInterval = Math.round(nextInterval * nextEF);
    }
    nextRepetitions += 1;
  }

  // Update Easiness Factor: EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  nextEF = nextEF + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  // Bound EF to minimum of 1.3 per standard SM-2 specification
  if (nextEF < 1.3) {
    nextEF = 1.3;
  }

  const nextReviewTime = now.getTime() + nextInterval * 24 * 60 * 60 * 1000;

  return {
    ...record,
    easinessFactor: Number(nextEF.toFixed(3)),
    intervalDays: nextInterval,
    repetitions: nextRepetitions,
    nextReviewDate: new Date(nextReviewTime),
    lastReviewDate: now,
    totalReviews: record.totalReviews + 1,
    retentionHistory: [...record.retentionHistory, quality],
  };
}

/**
 * Filters and sorts flashcards that are due for review (nextReviewDate <= current time)
 */
export function getDueCards(records: FlashcardReviewRecord[]): FlashcardReviewRecord[] {
  const now = new Date();
  return records
    .filter((r) => new Date(r.nextReviewDate).getTime() <= now.getTime())
    .sort(
      (a, b) =>
        new Date(a.nextReviewDate).getTime() - new Date(b.nextReviewDate).getTime()
    );
}

/**
 * Computes performance analytics from a completed flashcard review session
 */
export function computeSessionStats(
  records: FlashcardReviewRecord[],
  sessionResults: { cardId: string; quality: ReviewQuality }[]
): SessionStats {
  if (sessionResults.length === 0) {
    return {
      cardsReviewed: 0,
      correctCount: 0,
      averageQuality: 0,
      retentionRate: 0,
      nextSessionDueCount: getDueCards(records).length,
    };
  }

  const correctCount = sessionResults.filter((r) => r.quality >= 3).length;
  const totalQuality = sessionResults.reduce((acc, curr) => acc + curr.quality, 0);

  return {
    cardsReviewed: sessionResults.length,
    correctCount,
    averageQuality: Number((totalQuality / sessionResults.length).toFixed(2)),
    retentionRate: Number(((correctCount / sessionResults.length) * 100).toFixed(1)),
    nextSessionDueCount: getDueCards(records).length,
  };
}

/**
 * Categorizes flashcard intervals into histogram buckets for student retention visualization
 */
export function getIntervalHistogramData(
  records: FlashcardReviewRecord[]
): { interval: string; count: number }[] {
  const buckets: Record<string, number> = {
    '1d': 0,
    '2-3d': 0,
    '4-7d': 0,
    '1-2w': 0,
    '2-4w': 0,
    '1-3m': 0,
    '3m+': 0,
  };

  records.forEach((r) => {
    const days = r.intervalDays;
    if (days <= 1) buckets['1d']++;
    else if (days <= 3) buckets['2-3d']++;
    else if (days <= 7) buckets['4-7d']++;
    else if (days <= 14) buckets['1-2w']++;
    else if (days <= 28) buckets['2-4w']++;
    else if (days <= 90) buckets['1-3m']++;
    else buckets['3m+']++;
  });

  return Object.entries(buckets).map(([interval, count]) => ({ interval, count }));
}
