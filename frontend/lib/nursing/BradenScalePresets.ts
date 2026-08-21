export interface BradenSubscale {
  id: string;
  name: string;
  maxScore: number;
  options: Array<{ score: number; label: string; description: string }>;
}

export const BRADEN_SUBSCALES: BradenSubscale[] = [
  {
    id: 'sensory', name: 'Sensory Perception', maxScore: 4, options: [
      { score: 1, label: 'Completely Limited', description: 'Unresponsive to painful stimuli' },
      { score: 2, label: 'Very Limited', description: 'Responds only to painful stimuli' },
      { score: 3, label: 'Slightly Limited', description: 'Responds to verbal commands but cannot always communicate discomfort' },
      { score: 4, label: 'No Impairment', description: 'Responds to verbal commands and has no sensory deficit' }
    ]
  },
  {
    id: 'moisture', name: 'Moisture', maxScore: 4, options: [
      { score: 1, label: 'Constantly Moist', description: 'Skin is kept moist almost constantly by perspiration, urine, etc.' },
      { score: 2, label: 'Very Moist', description: 'Skin is often, but not always moist' },
      { score: 3, label: 'Occasionally Moist', description: 'Skin is occasionally moist' },
      { score: 4, label: 'Rarely Moist', description: 'Skin is usually dry' }
    ]
  },
  {
    id: 'activity', name: 'Activity', maxScore: 4, options: [
      { score: 1, label: 'Bedfast', description: 'Confined to bed' },
      { score: 2, label: 'Chairfast', description: 'Ability to walk severely limited or non-existent' },
      { score: 3, label: 'Walks Occasionally', description: 'Walks occasionally during day, but for very short distances' },
      { score: 4, label: 'Walks Frequently', description: 'Walks outside room at least twice a day and inside room at least once every two hours' }
    ]
  },
  {
    id: 'mobility', name: 'Mobility', maxScore: 4, options: [
      { score: 1, label: 'Completely Immobile', description: 'Does not make even slight changes in body or extremity position' },
      { score: 2, label: 'Very Limited', description: 'Makes occasional slight changes in body or extremity position' },
      { score: 3, label: 'Slightly Limited', description: 'Makes frequent though slight changes in body or extremity position' },
      { score: 4, label: 'No Limitation', description: 'Makes major and frequent changes in position' }
    ]
  },
  {
    id: 'nutrition', name: 'Nutrition', maxScore: 4, options: [
      { score: 1, label: 'Very Poor', description: 'Never eats a complete meal' },
      { score: 2, label: 'Probably Inadequate', description: 'Rarely eats a complete meal' },
      { score: 3, label: 'Adequate', description: 'Eats over half of most meals' },
      { score: 4, label: 'Excellent', description: 'Eats most of every meal' }
    ]
  },
  {
    id: 'friction', name: 'Friction & Shear', maxScore: 3, options: [
      { score: 1, label: 'Problem', description: 'Requires moderate to maximum assistance in moving' },
      { score: 2, label: 'Potential Problem', description: 'Moves feebly or requires minimum assistance' },
      { score: 3, label: 'No Apparent Problem', description: 'Moves in bed and in chair independently' }
    ]
  }
];

export function calculateBradenScore(scores: Record<string, number>): { totalScore: number; riskCategory: 'Severe Risk' | 'High Risk' | 'Moderate Risk' | 'Mild Risk' | 'No Risk'; recommendedInterventions: string[] } {
  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
  let riskCategory: 'Severe Risk' | 'High Risk' | 'Moderate Risk' | 'Mild Risk' | 'No Risk';
  let recommendedInterventions: string[] = [];

  if (totalScore <= 9) {
    riskCategory = 'Severe Risk';
    recommendedInterventions = ['Intensive turning schedule', 'Pressure redistribution surface', 'Nutritional consultation'];
  } else if (totalScore <= 12) {
    riskCategory = 'High Risk';
    recommendedInterventions = ['Frequent turning', 'Protect heels', 'Manage moisture'];
  } else if (totalScore <= 14) {
    riskCategory = 'Moderate Risk';
    recommendedInterventions = ['Regular turning', 'Barrier creams', 'Check skin daily'];
  } else if (totalScore <= 18) {
    riskCategory = 'Mild Risk';
    recommendedInterventions = ['Encourage mobility', 'Routine skin care'];
  } else {
    riskCategory = 'No Risk';
    recommendedInterventions = ['Routine care'];
  }

  return { totalScore, riskCategory, recommendedInterventions };
}

export interface WoundStage {
  stage: string;
  name: string;
  description: string;
  visualCharacteristics: string;
  dressingRecommendations: string[];
}

export const WOUND_STAGES: WoundStage[] = [
  { stage: 'I', name: 'Stage I', description: 'Non-blanchable erythema of intact skin', visualCharacteristics: 'Redness that does not turn white when pressed', dressingRecommendations: ['Transparent film', 'Hydrocolloid'] },
  { stage: 'II', name: 'Stage II', description: 'Partial thickness loss of dermis', visualCharacteristics: 'Shallow open ulcer with red pink wound bed', dressingRecommendations: ['Hydrocolloid', 'Hydrogel'] },
  { stage: 'III', name: 'Stage III', description: 'Full thickness tissue loss', visualCharacteristics: 'Subcutaneous fat may be visible but bone, tendon or muscle are not exposed', dressingRecommendations: ['Alginate', 'Foam dressing'] },
  { stage: 'IV', name: 'Stage IV', description: 'Full thickness tissue loss with exposed bone, tendon or muscle', visualCharacteristics: 'Exposed structures', dressingRecommendations: ['Alginate', 'Negative pressure wound therapy'] },
  { stage: 'Unstageable', name: 'Unstageable', description: 'Full thickness tissue loss in which base of ulcer is covered by slough or eschar', visualCharacteristics: 'Yellow, tan, gray, green or brown slough or eschar', dressingRecommendations: ['Enzymatic debridement', 'Hydrogel'] },
  { stage: 'DTI', name: 'Deep Tissue Injury', description: 'Purple or maroon localized area of discolored intact skin or blood-filled blister', visualCharacteristics: 'Darkly pigmented skin, painful, firm, mushy, boggy', dressingRecommendations: ['Protect from pressure', 'Monitor closely'] }
];
