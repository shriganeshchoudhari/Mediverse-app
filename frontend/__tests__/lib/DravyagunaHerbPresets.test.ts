import {
  DRAVYAGUNA_HERBS,
  getHerbById,
  checkHerbDrugInteraction
} from '../../lib/ayush/DravyagunaHerbPresets';

describe('DravyagunaHerbPresets', () => {
  it('DRAVYAGUNA_HERBS contains at least 20 herbs', () => {
    expect(DRAVYAGUNA_HERBS.length).toBeGreaterThanOrEqual(20);
  });

  it('each herb has valid botanicalName, sanskritName, rasa, virya, vipaka, activePhytochemicals', () => {
    DRAVYAGUNA_HERBS.forEach(herb => {
      expect(herb.botanicalName).toBeDefined();
      expect(herb.sanskritName).toBeDefined();
      expect(herb.rasa).toBeDefined();
      expect(herb.virya).toBeDefined();
      expect(herb.vipaka).toBeDefined();
      expect(herb.activePhytochemicals).toBeDefined();
    });
  });

  it('getHerbById returns Ashwagandha', () => {
    const herb = getHerbById('ashwagandha');
    expect(herb).toBeDefined();
    expect(herb?.sanskritName).toBe('Ashwagandha');
  });

  it('checkHerbDrugInteraction identifies drug interactions with high-risk drugs', () => {
    const interaction = checkHerbDrugInteraction('herb_ashwagandha', 'Sedatives');
    expect(interaction.risk).toBe(true);
    expect(interaction.details?.severity).toBe('moderate');
  });
});
