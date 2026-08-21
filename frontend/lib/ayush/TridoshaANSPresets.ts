export interface TridoshaANSElement {
  id: string;
  name: string;
  dosha: 'vata' | 'pitta' | 'kapha';
  ansDominance: 'sympathetic' | 'parasympathetic' | 'metabolic_endocrine';
  neurotransmitterCorrelation: string[];
  hrvParameter: string;
  physiologicalFunction: string;
  clinicalHyperactivitySymptoms: string[];
  clinicalHypoactivitySymptoms: string[];
  balancingTherapies: string[];
}

export const TRIDOSHA_ANS_PROFILES: TridoshaANSElement[] = [
  {
    id: 'vata-ans',
    name: 'Vata Dosha (Somatic-Neural Axis)',
    dosha: 'vata',
    ansDominance: 'sympathetic',
    neurotransmitterCorrelation: ['Norepinephrine', 'Dopamine', 'Glutamate'],
    hrvParameter: 'Low LF/HF ratio, high overall variability with frequent erratic shifts, low parasympathetic tone (RMSSD)',
    physiologicalFunction: 'Regulates movement, respiration, circulation, neural impulses, and elimination.',
    clinicalHyperactivitySymptoms: ['Tachycardia', 'Insomnia', 'Anxiety', 'Tremors', 'Irritable Bowel Syndrome', 'Hypertension (labile)', 'Hyperventilation'],
    clinicalHypoactivitySymptoms: ['Bradykinesia', 'Constipation', 'Lethargy', 'Poor circulation', 'Neuralgia', 'Cognitive fog'],
    balancingTherapies: ['Abhyanga (warm oil massage)', 'Shirodhara', 'Ashwagandha supplementation', 'Pranayama (Nadi Shodhana)', 'Grounding diet (warm, oily, sweet)']
  },
  {
    id: 'pitta-ans',
    name: 'Pitta Dosha (Metabolic-Endocrine Axis)',
    dosha: 'pitta',
    ansDominance: 'metabolic_endocrine',
    neurotransmitterCorrelation: ['Serotonin', 'Histamine', 'Acetylcholine (nicotinic)'],
    hrvParameter: 'Moderate LF/HF ratio, distinct sympathetic dominance under stress (high LF), moderate baseline variability',
    physiologicalFunction: 'Regulates metabolism, digestion, thermoregulation, cellular energy production, and visual processing.',
    clinicalHyperactivitySymptoms: ['Hyperacidity', 'Inflammatory conditions', 'Fever', 'Hives/Rashes', 'Anger/Irritability', 'Diarrhea', 'Migraines'],
    clinicalHypoactivitySymptoms: ['Sluggish digestion (Agnimandya)', 'Cold intolerance', 'Poor absorption', 'Dull complexion', 'Apathy'],
    balancingTherapies: ['Sheetali Pranayama', 'Virechana (purgation therapy)', 'Shatavari & Brahmi supplementation', 'Cooling diet (sweet, bitter, astringent)', 'Moonlight exposure']
  },
  {
    id: 'kapha-ans',
    name: 'Kapha Dosha (Rest-and-Digest Axis)',
    dosha: 'kapha',
    ansDominance: 'parasympathetic',
    neurotransmitterCorrelation: ['GABA', 'Acetylcholine (muscarinic)', 'Endorphins', 'Oxytocin'],
    hrvParameter: 'High parasympathetic tone (High HF), low sympathetic tone (Low LF), slow and stable heart rate baseline',
    physiologicalFunction: 'Provides structural integrity, lubrication, immunity, fluid balance, and tissue growth.',
    clinicalHyperactivitySymptoms: ['Obesity', 'Excessive mucus production', 'Edema', 'Hypersomnia', 'Depression (lethargic)', 'Bradycardia', 'Asthma (mucus-dominant)'],
    clinicalHypoactivitySymptoms: ['Joint crepitus', 'Dry respiratory passages', 'Weak immunity', 'Osteoporosis', 'Emaciation'],
    balancingTherapies: ['Vamana (emesis therapy)', 'Udvartana (dry powder massage)', 'Vigorous exercise', 'Triphala & Guggulu supplementation', 'Stimulating diet (pungent, bitter, astringent)']
  }
];

export function calculateSympathovagalBalance(vata: number, pitta: number, kapha: number): { lfHfRatio: number; sympatheticTone: number; parasympatheticTone: number; metabolicRate: number; stateDescription: string; dominantState: 'vata_hyper'|'pitta_hyper'|'kapha_hyper'|'balanced' } {
  const total = vata + pitta + kapha;
  if (total === 0) return { lfHfRatio: 1, sympatheticTone: 50, parasympatheticTone: 50, metabolicRate: 50, stateDescription: 'Unknown', dominantState: 'balanced' };
  
  const vataPercent = (vata / total) * 100;
  const pittaPercent = (pitta / total) * 100;
  const kaphaPercent = (kapha / total) * 100;
  
  // Simulated HRV parameters based on doshic dominance
  const sympatheticTone = Math.min(100, vataPercent * 1.2 + pittaPercent * 0.5);
  const parasympatheticTone = Math.min(100, kaphaPercent * 1.5 + vataPercent * 0.2);
  const metabolicRate = Math.min(100, pittaPercent * 1.4 + vataPercent * 0.3);
  
  const lfHfRatio = parasympatheticTone > 0 ? (sympatheticTone / parasympatheticTone) : 1;
  
  let dominantState: 'vata_hyper' | 'pitta_hyper' | 'kapha_hyper' | 'balanced' = 'balanced';
  let stateDescription = 'Balanced Autonomic Tone';
  
  if (vataPercent > pittaPercent && vataPercent > kaphaPercent && vataPercent > 40) {
    dominantState = 'vata_hyper';
    stateDescription = 'Sympathetic Hyperarousal (Vata Dominance)';
  } else if (pittaPercent > vataPercent && pittaPercent > kaphaPercent && pittaPercent > 40) {
    dominantState = 'pitta_hyper';
    stateDescription = 'Metabolic Hyperactivity with Sympathetic Surge (Pitta Dominance)';
  } else if (kaphaPercent > vataPercent && kaphaPercent > pittaPercent && kaphaPercent > 40) {
    dominantState = 'kapha_hyper';
    stateDescription = 'Parasympathetic Dominance / Vagal Hypertonia (Kapha Dominance)';
  }
  
  return {
    lfHfRatio,
    sympatheticTone,
    parasympatheticTone,
    metabolicRate,
    stateDescription,
    dominantState
  };
}

export const CIRCADIAN_DOSHA_CLOCK: Array<{ timeRange: string; dosha: 'Vata'|'Pitta'|'Kapha'; peakActivity: string; physiologicalAdvice: string }> = [
  {
    timeRange: '02:00 - 06:00',
    dosha: 'Vata',
    peakActivity: 'Neural signaling, elimination, dreaming, spiritual receptivity',
    physiologicalAdvice: 'Ideal time to wake up (Brahma Muhurta). Best for meditation, light stretching, and natural elimination.'
  },
  {
    timeRange: '06:00 - 10:00',
    dosha: 'Kapha',
    peakActivity: 'Physical strength, structural repair, fluid accumulation, sluggishness',
    physiologicalAdvice: 'Ideal time for vigorous exercise to counter heaviness. Eat a light, warm breakfast.'
  },
  {
    timeRange: '10:00 - 14:00',
    dosha: 'Pitta',
    peakActivity: 'Digestive fire (Agni), metabolism, cognitive processing, body temperature peak',
    physiologicalAdvice: 'Consume the largest meal of the day. Best time for analytical work and complex problem-solving.'
  },
  {
    timeRange: '14:00 - 18:00',
    dosha: 'Vata',
    peakActivity: 'Nervous system activity, communication, movement, creativity',
    physiologicalAdvice: 'Creative tasks, meetings, socializing. Avoid heavy foods. Risk of energy crash.'
  },
  {
    timeRange: '18:00 - 22:00',
    dosha: 'Kapha',
    peakActivity: 'Winding down, parasympathetic activation, melatonin onset, heaviness',
    physiologicalAdvice: 'Light dinner. Disconnect from screens. Relaxing activities to prepare for sleep.'
  },
  {
    timeRange: '22:00 - 02:00',
    dosha: 'Pitta',
    peakActivity: 'Internal organ cleansing (liver), tissue repair, consolidation of memories',
    physiologicalAdvice: 'Crucial to be asleep during this time for proper cellular repair and metabolic reset.'
  }
];
