export interface PrakritiQuestion {
  id: string;
  category: 'physical' | 'physiological' | 'psychological';
  questionText: string;
  options: {
    vata: string;
    pitta: string;
    kapha: string;
  };
}

export const PRAKRITI_QUESTIONS: PrakritiQuestion[] = [
  {
    id: 'pq_01',
    category: 'physical',
    questionText: 'How would you describe your body frame and build?',
    options: {
      vata: 'Thin, slender, prominent joints, hard to gain weight',
      pitta: 'Medium, well-proportioned, moderate muscle development',
      kapha: 'Broad, large, solid, gains weight easily'
    }
  },
  {
    id: 'pq_02',
    category: 'physical',
    questionText: 'What is your natural skin texture?',
    options: {
      vata: 'Dry, rough, cool to touch, prone to cracking',
      pitta: 'Warm, oily, sensitive, prone to acne, freckles, or rashes',
      kapha: 'Thick, moist, smooth, cool, pale'
    }
  },
  {
    id: 'pq_03',
    category: 'physical',
    questionText: 'Describe your hair.',
    options: {
      vata: 'Dry, frizzy, thin, sparse, prone to split ends',
      pitta: 'Fine, soft, prone to early graying or thinning',
      kapha: 'Thick, lustrous, wavy, abundant, oily'
    }
  },
  {
    id: 'pq_04',
    category: 'physiological',
    questionText: 'How is your appetite?',
    options: {
      vata: 'Irregular, variable, skips meals easily',
      pitta: 'Strong, sharp, cannot skip meals without getting irritable',
      kapha: 'Steady but slow, can easily skip a meal without distress'
    }
  },
  {
    id: 'pq_05',
    category: 'physiological',
    questionText: 'Describe your digestion speed.',
    options: {
      vata: 'Variable, prone to bloating and gas',
      pitta: 'Rapid, rarely experiences indigestion or heaviness',
      kapha: 'Slow, feels heavy after eating'
    }
  },
  {
    id: 'pq_06',
    category: 'physiological',
    questionText: 'How is your natural thirst?',
    options: {
      vata: 'Variable, often forgets to drink water',
      pitta: 'High, drinks large quantities of water',
      kapha: 'Low to moderate, rarely feels excessively thirsty'
    }
  },
  {
    id: 'pq_07',
    category: 'physiological',
    questionText: 'What is your tolerance to environmental temperatures?',
    options: {
      vata: 'Dislikes cold, wind, and dryness; loves warmth',
      pitta: 'Dislikes heat and intense sun; prefers cool environments',
      kapha: 'Dislikes cold and dampness; tolerates varying temperatures well'
    }
  },
  {
    id: 'pq_08',
    category: 'physiological',
    questionText: 'Describe your sweating pattern.',
    options: {
      vata: 'Scanty, hardly sweats',
      pitta: 'Profuse, easily sweats, strong body odor',
      kapha: 'Moderate, occurs mostly with intense exertion'
    }
  },
  {
    id: 'pq_09',
    category: 'physiological',
    questionText: 'How would you characterize your sleep quality?',
    options: {
      vata: 'Light, interrupted, difficulty falling asleep',
      pitta: 'Sound, moderate duration, wakes up alert',
      kapha: 'Deep, heavy, prolonged, hard to wake up'
    }
  },
  {
    id: 'pq_10',
    category: 'physiological',
    questionText: 'What are your typical bowel habits?',
    options: {
      vata: 'Irregular, hard, dry, prone to constipation',
      pitta: 'Regular, frequent (2+ times a day), soft, prone to looseness',
      kapha: 'Regular (once a day), well-formed, heavy'
    }
  },
  {
    id: 'pq_11',
    category: 'physical',
    questionText: 'What is your natural walking speed?',
    options: {
      vata: 'Fast, hurried, restless',
      pitta: 'Moderate, purposeful, determined',
      kapha: 'Slow, steady, graceful'
    }
  },
  {
    id: 'pq_12',
    category: 'psychological',
    questionText: 'Describe your speech pattern.',
    options: {
      vata: 'Fast, talkative, jumps between topics, sometimes unclear',
      pitta: 'Articulate, sharp, convincing, argumentive',
      kapha: 'Slow, melodious, thoughtful, calm'
    }
  },
  {
    id: 'pq_13',
    category: 'psychological',
    questionText: 'How does your memory function?',
    options: {
      vata: 'Quick to learn, quick to forget',
      pitta: 'Sharp, distinct, good at remembering details',
      kapha: 'Slow to learn, but never forgets'
    }
  },
  {
    id: 'pq_14',
    category: 'psychological',
    questionText: 'How do you approach decision making?',
    options: {
      vata: 'Indecisive, frequently changes mind',
      pitta: 'Quick, confident, logical',
      kapha: 'Deliberate, slow, considers all options carefully'
    }
  },
  {
    id: 'pq_15',
    category: 'psychological',
    questionText: 'What triggers your anger most easily?',
    options: {
      vata: 'Unpredictability or feeling overwhelmed',
      pitta: 'Incompetence, delays, or challenges to authority',
      kapha: 'Rarely gets angry, but holds grudges if pushed too far'
    }
  },
  {
    id: 'pq_16',
    category: 'psychological',
    questionText: 'How do you react to sudden stress?',
    options: {
      vata: 'Fear, anxiety, worry, panic',
      pitta: 'Anger, frustration, taking control',
      kapha: 'Withdrawal, stubborness, indifference'
    }
  },
  {
    id: 'pq_17',
    category: 'psychological',
    questionText: 'What are your financial habits?',
    options: {
      vata: 'Spends quickly, impulsive buyer',
      pitta: 'Spends on luxury or quality, good at managing money',
      kapha: 'Saves carefully, conservative spender'
    }
  },
  {
    id: 'pq_18',
    category: 'psychological',
    questionText: 'What themes commonly appear in your dreams?',
    options: {
      vata: 'Flying, running, falling, fear, movement',
      pitta: 'Fire, light, studying, fighting, arguments',
      kapha: 'Water, snow, romance, slow emotional scenes'
    }
  },
  {
    id: 'pq_19',
    category: 'physical',
    questionText: 'Do your joints make sounds?',
    options: {
      vata: 'Frequently crack or pop, feel stiff',
      pitta: 'Occasional cracking, generally flexible',
      kapha: 'Rarely crack, well lubricated, sturdy'
    }
  },
  {
    id: 'pq_20',
    category: 'physiological',
    questionText: 'What is your pulse character like?',
    options: {
      vata: 'Fast, erratic, feels like a crawling snake',
      pitta: 'Moderate, strong, jumping, feels like a leaping frog',
      kapha: 'Slow, steady, broad, feels like a swimming swan'
    }
  }
];

export interface PrakritiResult {
  vataPercent: number;
  pittaPercent: number;
  kaphaPercent: number;
  dominantPrakriti: string;
  constitutionType: 'Ekadoshaja' | 'Dvandvaja' | 'Tridoshaja' | 'Sama';
  dietGuidance: string[];
  lifestyleGuidance: string[];
  herbRecommendations: string[];
}

export function calculatePrakritiScore(answers: Record<string, 'vata'|'pitta'|'kapha'>): PrakritiResult {
  let vataCount = 0;
  let pittaCount = 0;
  let kaphaCount = 0;
  let totalAnswers = 0;

  for (const answer of Object.values(answers)) {
    if (answer === 'vata') vataCount++;
    if (answer === 'pitta') pittaCount++;
    if (answer === 'kapha') kaphaCount++;
    totalAnswers++;
  }

  if (totalAnswers === 0) {
    return {
      vataPercent: 0, pittaPercent: 0, kaphaPercent: 0,
      dominantPrakriti: 'Unknown', constitutionType: 'Sama',
      dietGuidance: [], lifestyleGuidance: [], herbRecommendations: []
    };
  }

  const vataPercent = Math.round((vataCount / totalAnswers) * 100);
  const pittaPercent = Math.round((pittaCount / totalAnswers) * 100);
  const kaphaPercent = Math.round((kaphaCount / totalAnswers) * 100);

  const scores = [
    { dosha: 'Vata', percent: vataPercent },
    { dosha: 'Pitta', percent: pittaPercent },
    { dosha: 'Kapha', percent: kaphaPercent }
  ].sort((a, b) => b.percent - a.percent);

  let dominantPrakriti = '';
  let constitutionType: 'Ekadoshaja' | 'Dvandvaja' | 'Tridoshaja' | 'Sama' = 'Ekadoshaja';

  if (scores[0].percent - scores[1].percent < 10 && scores[1].percent - scores[2].percent < 10) {
    dominantPrakriti = 'Vata-Pitta-Kapha (Sama)';
    constitutionType = 'Tridoshaja';
  } else if (scores[0].percent - scores[1].percent < 15) {
    dominantPrakriti = `${scores[0].dosha}-${scores[1].dosha}`;
    constitutionType = 'Dvandvaja';
  } else {
    dominantPrakriti = scores[0].dosha;
    constitutionType = 'Ekadoshaja';
  }

  let dietGuidance: string[] = [];
  let lifestyleGuidance: string[] = [];
  let herbRecommendations: string[] = [];

  const mainDosha = scores[0].dosha;

  if (mainDosha === 'Vata') {
    dietGuidance = ['Favor warm, cooked, grounding foods', 'Include healthy fats (Ghee, olive oil)', 'Avoid dry, raw, and cold foods'];
    lifestyleGuidance = ['Maintain a strict daily routine (Dinacharya)', 'Practice gentle, grounding yoga and meditation', 'Avoid overstimulation and excessive travel'];
    herbRecommendations = ['Ashwagandha', 'Brahmi', 'Shatavari', 'Haritaki'];
  } else if (mainDosha === 'Pitta') {
    dietGuidance = ['Favor cooling, slightly dry, heavy foods', 'Reduce spicy, sour, and salty tastes', 'Avoid alcohol and excessive caffeine'];
    lifestyleGuidance = ['Avoid excessive heat and direct sun', 'Practice cooling Pranayama (Sheetali)', 'Engage in moderate, non-competitive exercise'];
    herbRecommendations = ['Brahmi', 'Amalaki', 'Shatavari', 'Guduchi'];
  } else {
    dietGuidance = ['Favor warm, light, spicy foods', 'Reduce sweet, sour, and salty tastes', 'Minimize dairy and cold foods'];
    lifestyleGuidance = ['Engage in vigorous daily exercise', 'Wake up early, avoid daytime napping', 'Seek new experiences and stimulation'];
    herbRecommendations = ['Guggulu', 'Triphala', 'Tulsi', 'Pippali'];
  }

  return {
    vataPercent,
    pittaPercent,
    kaphaPercent,
    dominantPrakriti,
    constitutionType,
    dietGuidance,
    lifestyleGuidance,
    herbRecommendations
  };
}

export const PRAKRITI_PROFILES: Record<string, { title: string; description: string; doshaBalanceStrategy: string; bestSeason: string; vulnerableDiseases: string[] }> = {
  'Vata': {
    title: 'Vata Prakriti',
    description: 'Characterized by movement, creativity, and lightness. Vata individuals are energetic but prone to fatigue.',
    doshaBalanceStrategy: 'Routine, warmth, grounding foods, and adequate rest.',
    bestSeason: 'Summer',
    vulnerableDiseases: ['Anxiety', 'Arthritis', 'Constipation', 'Insomnia']
  },
  'Pitta': {
    title: 'Pitta Prakriti',
    description: 'Characterized by intensity, intellect, and transformation. Pitta individuals are driven and passionate.',
    doshaBalanceStrategy: 'Cooling foods, moderation, relaxation, and avoiding conflict.',
    bestSeason: 'Winter',
    vulnerableDiseases: ['Hyperacidity', 'Inflammatory diseases', 'Hypertension', 'Skin rashes']
  },
  'Kapha': {
    title: 'Kapha Prakriti',
    description: 'Characterized by stability, compassion, and structure. Kapha individuals are grounded and enduring.',
    doshaBalanceStrategy: 'Stimulation, light foods, vigorous exercise, and variety.',
    bestSeason: 'Spring (Late)',
    vulnerableDiseases: ['Obesity', 'Diabetes', 'Depression', 'Congestion']
  },
  'Vata-Pitta': {
    title: 'Vata-Pitta Prakriti',
    description: 'A blend of air and fire. Creative and driven, but prone to burnout.',
    doshaBalanceStrategy: 'Cooling and grounding practices. Avoiding both extreme heat and extreme cold.',
    bestSeason: 'Autumn',
    vulnerableDiseases: ['Digestive disorders', 'Burnout', 'Migraines']
  },
  'Pitta-Kapha': {
    title: 'Pitta-Kapha Prakriti',
    description: 'A blend of fire and water/earth. Strong, muscular, and focused.',
    doshaBalanceStrategy: 'Moderation, light but nourishing diet, avoiding excessive heavy foods.',
    bestSeason: 'Winter',
    vulnerableDiseases: ['Metabolic syndrome', 'Joint inflammation', 'Liver disorders']
  },
  'Vata-Kapha': {
    title: 'Vata-Kapha Prakriti',
    description: 'A blend of air and water/earth. Often experience conflicting tendencies of hyperactivity and lethargy.',
    doshaBalanceStrategy: 'Warmth and mild stimulation. Regular routine without becoming stagnant.',
    bestSeason: 'Summer',
    vulnerableDiseases: ['Respiratory issues', 'Digestive irregularity', 'Mood swings']
  },
  'Vata-Pitta-Kapha (Sama)': {
    title: 'Sama Prakriti',
    description: 'Rare balance of all three doshas. Adaptable, healthy, and resilient.',
    doshaBalanceStrategy: 'Maintain balance by adapting diet and lifestyle to seasons and current environment.',
    bestSeason: 'All Seasons',
    vulnerableDiseases: ['Generally highly resistant to disease, imbalances occur based on extreme environmental factors']
  }
};
