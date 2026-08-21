export interface ZoonosisRecord {
  id: string;
  pathogenName: string;
  type: 'Viral' | 'Bacterial' | 'Parasitic' | 'Prion';
  reservoirHosts: string[];
  transmissionVectors: string[];
  animalManifestation: string;
  humanManifestation: string;
  baselineR0: number;
  oneHealthInterventions: string[];
  fatalityRate: string;
}

export const ZOONOTIC_RECORDS: ZoonosisRecord[] = [
  {
    id: 'rabies',
    pathogenName: 'Rabies Lyssavirus',
    type: 'Viral',
    reservoirHosts: ['Dogs', 'Bats', 'Raccoons', 'Foxes', 'Skunks'],
    transmissionVectors: ['Saliva (Bite)'],
    animalManifestation: 'Furious or dumb form, behavior change, hypersalivation, paralysis, death.',
    humanManifestation: 'Fever, headache, hydrophobia, hallucinations, paralysis, nearly 100% fatal once symptomatic.',
    baselineR0: 1.2,
    oneHealthInterventions: ['Mass dog vaccination (70% coverage)', 'Wildlife oral vaccination', 'Human PEP (Post-exposure prophylaxis)'],
    fatalityRate: '>99% (without PEP)'
  },
  {
    id: 'anthrax',
    pathogenName: 'Bacillus anthracis',
    type: 'Bacterial',
    reservoirHosts: ['Soil', 'Herbivores (Cattle, Sheep)'],
    transmissionVectors: ['Spores (Inhalation, Ingestion, Cutaneous)'],
    animalManifestation: 'Sudden death, bloody exudate from orifices, incomplete rigor mortis.',
    humanManifestation: 'Cutaneous eschar, respiratory failure (inhalation), severe GI distress.',
    baselineR0: 0,
    oneHealthInterventions: ['Livestock vaccination in endemic areas', 'Proper carcass disposal (incineration/deep burial)', 'PPE for at-risk workers'],
    fatalityRate: '20% (Cutaneous, untreated) - >85% (Inhalation, untreated)'
  },
  {
    id: 'brucellosis',
    pathogenName: 'Brucella abortus',
    type: 'Bacterial',
    reservoirHosts: ['Cattle', 'Bison', 'Elk'],
    transmissionVectors: ['Raw milk', 'Placental fluids'],
    animalManifestation: 'Late-term abortions, retained placenta, epididymitis.',
    humanManifestation: 'Undulant fever, night sweats, arthralgia, osteomyelitis.',
    baselineR0: 0.5,
    oneHealthInterventions: ['Calfhood vaccination (Strain 19 or RB51)', 'Milk pasteurization', 'Test-and-slaughter programs'],
    fatalityRate: '<2% (treated)'
  },
  {
    id: 'leptospirosis',
    pathogenName: 'Leptospira interrogans',
    type: 'Bacterial',
    reservoirHosts: ['Rodents', 'Dogs', 'Livestock', 'Wildlife'],
    transmissionVectors: ['Urine-contaminated water'],
    animalManifestation: 'Acute renal failure, hepatic disease, abortion, uveitis (horses).',
    humanManifestation: "Weil's disease, fever, jaundice, renal failure, pulmonary hemorrhage.",
    baselineR0: 0.8,
    oneHealthInterventions: ['Rodent control', 'Animal vaccination', 'Avoiding contaminated water bodies'],
    fatalityRate: '5-15% (severe cases)'
  },
  {
    id: 'avian_flu',
    pathogenName: 'Avian Influenza H5N1',
    type: 'Viral',
    reservoirHosts: ['Wild waterfowl'],
    transmissionVectors: ['Direct contact with infected poultry or secretions'],
    animalManifestation: 'High mortality in poultry, respiratory distress, cyanosis.',
    humanManifestation: 'Severe viral pneumonia, acute respiratory distress syndrome (ARDS).',
    baselineR0: 0.3,
    oneHealthInterventions: ['Poultry culling', 'Biosecurity on farms', 'Global surveillance (WHO/OIE)'],
    fatalityRate: '~50%'
  },
  {
    id: 'bovine_tb',
    pathogenName: 'Bovine Tuberculosis (Mycobacterium bovis)',
    type: 'Bacterial',
    reservoirHosts: ['Cattle', 'Badgers', 'White-tailed deer'],
    transmissionVectors: ['Aerosol', 'Unpasteurized milk'],
    animalManifestation: 'Chronic debilitating disease, respiratory signs, enlarged lymph nodes.',
    humanManifestation: 'Pulmonary tuberculosis, cervical lymphadenitis (scrofula).',
    baselineR0: 1.1,
    oneHealthInterventions: ['Test-and-slaughter of cattle', 'Milk pasteurization', 'Wildlife reservoir management'],
    fatalityRate: 'High (if untreated)'
  }
];

export function calculateAdjustedR0(baselineR0: number, interventions: { vaccination: boolean; ppe: boolean; quarantine: boolean; vectorControl: boolean }): number {
  let adjustedR0 = baselineR0;
  if (interventions.vaccination) adjustedR0 *= 0.3;
  if (interventions.ppe) adjustedR0 *= 0.7;
  if (interventions.quarantine) adjustedR0 *= 0.5;
  if (interventions.vectorControl) adjustedR0 *= 0.6;
  return Math.max(0, parseFloat(adjustedR0.toFixed(2)));
}
