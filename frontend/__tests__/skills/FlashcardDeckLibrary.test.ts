import { FLASHCARD_DOMAINS, FLASHCARD_DECK_LIBRARY } from '../../.gemini/skills/FlashcardDeckLibrary';

describe('FlashcardDeckLibrary Suite', () => {
  it('contains valid predefined domains list', () => {
    expect(FLASHCARD_DOMAINS).toBeDefined();
    expect(FLASHCARD_DOMAINS.length).toBeGreaterThan(5);
    expect(FLASHCARD_DOMAINS).toContain('Cardiovascular');
    expect(FLASHCARD_DOMAINS).toContain('Renal');
    expect(FLASHCARD_DOMAINS).toContain('Pharmacology');
  });

  it('contains valid flashcards with required fields', () => {
    expect(FLASHCARD_DECK_LIBRARY.length).toBeGreaterThan(20);
    for (const card of FLASHCARD_DECK_LIBRARY) {
      expect(card.id).toBeDefined();
      expect(typeof card.id).toBe('number');
      expect(card.deck).toBeTruthy();
      expect(card.front).toBeTruthy();
      expect(card.back).toBeTruthy();
      expect(card.interval).toBeGreaterThanOrEqual(1);
      expect(card.ef).toBeGreaterThanOrEqual(1.3);
    }
  });

  it('has unique card IDs throughout the library', () => {
    const ids = FLASHCARD_DECK_LIBRARY.map(c => c.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('covers major medical disciplines', () => {
    const decks = new Set(FLASHCARD_DECK_LIBRARY.map(c => c.deck));
    expect(decks.has('Cardiovascular')).toBe(true);
    expect(decks.has('Renal')).toBe(true);
  });
});
