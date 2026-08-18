/**
 * NMC CBME (National Medical Commission Competency-Based Medical Education)
 * MBBS Physiology Competency Taxonomy (PY1.1 to PY11.14)
 */

export interface NMCCompetency {
  code: string;
  system: string;
  topic: string;
  description: string;
  domain: 'Cognitive' | 'Psychomotor' | 'Affective';
  coreLevel: 'Must Know' | 'Desirable to Know' | 'Nice to Know';
}

export const NMC_COMPETENCIES: Record<string, NMCCompetency> = {
  'PY1.1': {
    code: 'PY1.1',
    system: 'General Physiology',
    topic: 'Cellular Structure & Function',
    description: 'Describe the structure and functions of a mammalian cell and cell organelles.',
    domain: 'Cognitive',
    coreLevel: 'Must Know',
  },
  'PY1.2': {
    code: 'PY1.2',
    system: 'General Physiology',
    topic: 'Transport Mechanisms',
    description: 'Describe the molecular mechanisms of transport across cell membranes (active, passive, secondary active).',
    domain: 'Cognitive',
    coreLevel: 'Must Know',
  },
  'PY1.3': {
    code: 'PY1.3',
    system: 'General Physiology',
    topic: 'Resting Membrane Potential',
    description: 'Explain the ionic basis and calculation of Resting Membrane Potential (RMP) using Nernst and GHK equations.',
    domain: 'Cognitive',
    coreLevel: 'Must Know',
  },
  'PY3.1': {
    code: 'PY3.1',
    system: 'Nerve-Muscle Physiology',
    topic: 'Action Potential Mechanics',
    description: 'Describe the generation and propagation of action potentials in nerve and muscle fibers.',
    domain: 'Cognitive',
    coreLevel: 'Must Know',
  },
  'PY5.1': {
    code: 'PY5.1',
    system: 'Cardiovascular Physiology',
    topic: 'Properties of Cardiac Muscle',
    description: 'Describe the physiological properties of cardiac muscle including automaticity, rhythmicity, and conductivity.',
    domain: 'Cognitive',
    coreLevel: 'Must Know',
  },
  'PY5.2': {
    code: 'PY5.2',
    system: 'Cardiovascular Physiology',
    topic: 'Cardiac Cycle & Hemodynamics',
    description: 'Describe the mechanical events of the cardiac cycle, Wiggers diagram, and Left Ventricular Pressure-Volume loops.',
    domain: 'Cognitive',
    coreLevel: 'Must Know',
  },
  'PY6.1': {
    code: 'PY6.1',
    system: 'Respiratory Physiology',
    topic: 'Mechanics of Breathing',
    description: 'Explain the mechanics of respiration, compliance, surfactant, intrapleural pressure, and airway resistance.',
    domain: 'Cognitive',
    coreLevel: 'Must Know',
  },
  'PY6.2': {
    code: 'PY6.2',
    system: 'Respiratory Physiology',
    topic: 'Alveolar Gas Exchange & V/Q',
    description: 'Describe alveolar gas exchange, the alveolar gas equation, and ventilation-perfusion (V/Q) relationships.',
    domain: 'Cognitive',
    coreLevel: 'Must Know',
  },
  'PY7.1': {
    code: 'PY7.1',
    system: 'Renal Physiology',
    topic: 'Glomerular Filtration Rate',
    description: 'Describe the structure of the nephron, Starling forces in glomerular capillaries, and regulation of GFR.',
    domain: 'Cognitive',
    coreLevel: 'Must Know',
  },
};

export function getCompetencyByCode(code: string): NMCCompetency | undefined {
  return NMC_COMPETENCIES[code];
}

export function calculateCompetencyScores(
  answers: { competencyCode: string; isCorrect: boolean }[]
): Record<string, { total: number; correct: number; percentage: number }> {
  const result: Record<string, { total: number; correct: number; percentage: number }> = {};

  for (const ans of answers) {
    if (!result[ans.competencyCode]) {
      result[ans.competencyCode] = { total: 0, correct: 0, percentage: 0 };
    }
    result[ans.competencyCode].total += 1;
    if (ans.isCorrect) {
      result[ans.competencyCode].correct += 1;
    }
  }

  for (const code in result) {
    const item = result[code];
    item.percentage = Math.round((item.correct / item.total) * 100);
  }

  return result;
}
