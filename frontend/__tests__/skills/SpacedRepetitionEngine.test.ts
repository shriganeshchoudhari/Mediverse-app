import {
  initializeCard,
  processReview,
  getDueCards,
  computeSessionStats,
  getIntervalHistogramData,
} from '../../.gemini/skills/SpacedRepetitionEngine';

describe('SM-2 SpacedRepetitionEngine', () => {
  it('initializes card with correct defaults', () => {
    const card = initializeCard('test-001');
    expect(card.cardId).toBe('test-001');
    expect(card.easinessFactor).toBe(2.5);
    expect(card.intervalDays).toBe(1);
    expect(card.repetitions).toBe(0);
    expect(card.totalReviews).toBe(0);
  });

  it('resets interval on quality < 3', () => {
    let card = initializeCard('test-002');
    card = processReview(card, 1); // wrong
    expect(card.intervalDays).toBe(1);
    expect(card.repetitions).toBe(0);
    expect(card.totalReviews).toBe(1);
  });

  it('progresses through SM-2 intervals correctly on successive high scores', () => {
    let card = initializeCard('test-003');
    card = processReview(card, 5); // rep 0 -> interval 1
    expect(card.intervalDays).toBe(1);
    expect(card.repetitions).toBe(1);

    card = processReview(card, 5); // rep 1 -> interval 6
    expect(card.intervalDays).toBe(6);
    expect(card.repetitions).toBe(2);

    card = processReview(card, 5); // rep 2 -> interval 6 * EF (~16)
    expect(card.intervalDays).toBeGreaterThan(6);
    expect(card.repetitions).toBe(3);
  });

  it('easiness factor decreases on difficult recall', () => {
    let card = initializeCard('test-004');
    card = processReview(card, 5);
    const highEF = card.easinessFactor;

    card = processReview(card, 3);
    expect(card.easinessFactor).toBeLessThanOrEqual(highEF);
  });

  it('enforces minimum easiness factor of 1.3', () => {
    let card = initializeCard('test-005');
    // Repeatedly grade with 0 to try and tank the EF
    for (let i = 0; i < 15; i++) {
      card = processReview(card, 0);
    }
    expect(card.easinessFactor).toBeGreaterThanOrEqual(1.3);
  });

  it('getDueCards returns only overdue cards sorted by earliest due', () => {
    const now = new Date();
    const past = new Date(now.getTime() - 86400000);
    const future = new Date(now.getTime() + 86400000);

    const card1 = { ...initializeCard('c1'), nextReviewDate: past };
    const card2 = { ...initializeCard('c2'), nextReviewDate: future };

    const due = getDueCards([card1, card2]);
    expect(due).toHaveLength(1);
    expect(due[0].cardId).toBe('c1');
  });

  it('computes session stats accurately', () => {
    const records = [initializeCard('c1'), initializeCard('c2')];
    const sessionResults = [
      { cardId: 'c1', quality: 5 as const },
      { cardId: 'c2', quality: 2 as const },
    ];

    const stats = computeSessionStats(records, sessionResults);
    expect(stats.cardsReviewed).toBe(2);
    expect(stats.correctCount).toBe(1);
    expect(stats.retentionRate).toBe(50.0);
    expect(stats.averageQuality).toBe(3.5);
  });

  it('generates correct histogram buckets', () => {
    const records = [
      { ...initializeCard('c1'), intervalDays: 1 },
      { ...initializeCard('c2'), intervalDays: 5 },
      { ...initializeCard('c3'), intervalDays: 20 },
    ];
    const hist = getIntervalHistogramData(records);
    expect(hist.find((h) => h.interval === '1d')?.count).toBe(1);
    expect(hist.find((h) => h.interval === '4-7d')?.count).toBe(1);
    expect(hist.find((h) => h.interval === '2-4w')?.count).toBe(1);
  });
});
