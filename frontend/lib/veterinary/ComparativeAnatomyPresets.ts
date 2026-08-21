export type SpeciesType = 'canine' | 'feline' | 'equine' | 'bovine' | 'human';

export interface ComparativeOrganSystem {
  systemId: string;
  systemName: string;
  speciesData: Record<SpeciesType, {
    description: string;
    dentalFormula: string;
    stomachType: string;
    vertebralFormula: string;
    keyAdaptation: string;
  }>;
}

export const COMPARATIVE_ANATOMY_PRESETS: ComparativeOrganSystem[] = [
  {
    systemId: 'digestive',
    systemName: 'Digestive System',
    speciesData: {
      canine: {
        description: 'Monogastric carnivore/omnivore',
        dentalFormula: '2(I 3/3, C 1/1, P 4/4, M 2/3) = 42',
        stomachType: 'Monogastric, highly distensible',
        vertebralFormula: 'C7, T13, L7, S3, Cd20-23',
        keyAdaptation: 'Short GI tract adapted for meat digestion'
      },
      feline: {
        description: 'Obligate carnivore',
        dentalFormula: '2(I 3/3, C 1/1, P 3/2, M 1/1) = 30',
        stomachType: 'Monogastric, simple',
        vertebralFormula: 'C7, T13, L7, S3, Cd21-23',
        keyAdaptation: 'No dietary requirement for carbohydrates; require preformed Vitamin A and taurine'
      },
      equine: {
        description: 'Hindgut fermenter',
        dentalFormula: '2(I 3/3, C 1(0)/1(0), P 3(4)/3, M 3/3) = 36-42',
        stomachType: 'Monogastric, small capacity',
        vertebralFormula: 'C7, T18, L6, S5, Cd15-21',
        keyAdaptation: 'Large cecum and colon for microbial fermentation of roughage'
      },
      bovine: {
        description: 'Ruminant herbivore',
        dentalFormula: '2(I 0/3, C 0/1, P 3/3, M 3/3) = 32',
        stomachType: 'Complex, 4 chambers (Rumen, Reticulum, Omasum, Abomasum)',
        vertebralFormula: 'C7, T13, L6, S5, Cd18-20',
        keyAdaptation: 'Foregut fermentation to break down cellulose before glandular digestion'
      },
      human: {
        description: 'Monogastric omnivore',
        dentalFormula: '2(I 2/2, C 1/1, P 2/2, M 3/3) = 32',
        stomachType: 'Monogastric, simple',
        vertebralFormula: 'C7, T12, L5, S5(fused), Cd4(fused)',
        keyAdaptation: 'Balanced digestion for mixed diet'
      }
    }
  },
  {
    systemId: 'skeletal_distal_limb',
    systemName: 'Skeletal Distal Limb',
    speciesData: {
      canine: { description: 'Digitigrade', dentalFormula: 'N/A', stomachType: 'N/A', vertebralFormula: 'N/A', keyAdaptation: '4 functional weight-bearing digits (II-V)' },
      feline: { description: 'Digitigrade', dentalFormula: 'N/A', stomachType: 'N/A', vertebralFormula: 'N/A', keyAdaptation: 'Retractable claws' },
      equine: { description: 'Unguligrade', dentalFormula: 'N/A', stomachType: 'N/A', vertebralFormula: 'N/A', keyAdaptation: 'Weight borne on a single digit (Digit III)' },
      bovine: { description: 'Unguligrade', dentalFormula: 'N/A', stomachType: 'N/A', vertebralFormula: 'N/A', keyAdaptation: 'Weight borne on two digits (Digits III and IV)' },
      human: { description: 'Plantigrade', dentalFormula: 'N/A', stomachType: 'N/A', vertebralFormula: 'N/A', keyAdaptation: 'Bipedalism' }
    }
  },
  {
    systemId: 'skull_dentition',
    systemName: 'Skull & Dentition',
    speciesData: {
      canine: { description: 'Meso/brachy/dolichocephalic variations', dentalFormula: '42 teeth', stomachType: 'N/A', vertebralFormula: 'N/A', keyAdaptation: 'Carnassial teeth (upper P4, lower M1)' },
      feline: { description: 'Short muzzle', dentalFormula: '30 teeth', stomachType: 'N/A', vertebralFormula: 'N/A', keyAdaptation: 'Highly specialized carnassials' },
      equine: { description: 'Long skull', dentalFormula: '36-42 teeth', stomachType: 'N/A', vertebralFormula: 'N/A', keyAdaptation: 'Hypsodont teeth for continuous eruption' },
      bovine: { description: 'No upper incisors', dentalFormula: '32 teeth', stomachType: 'N/A', vertebralFormula: 'N/A', keyAdaptation: 'Dental pad instead of upper incisors' },
      human: { description: 'Large cranium', dentalFormula: '32 teeth', stomachType: 'N/A', vertebralFormula: 'N/A', keyAdaptation: 'Orthognathic face' }
    }
  },
  {
    systemId: 'cardiovascular',
    systemName: 'Cardiovascular System',
    speciesData: {
      canine: { description: 'High aerobic capacity', dentalFormula: 'N/A', stomachType: 'N/A', vertebralFormula: 'N/A', keyAdaptation: 'Large heart relative to body size' },
      feline: { description: 'Burst speed adapted', dentalFormula: 'N/A', stomachType: 'N/A', vertebralFormula: 'N/A', keyAdaptation: 'Smaller heart size proportionally' },
      equine: { description: 'Athletic adaptation', dentalFormula: 'N/A', stomachType: 'N/A', vertebralFormula: 'N/A', keyAdaptation: 'Massive heart, splenic contraction during exercise' },
      bovine: { description: 'Steady state', dentalFormula: 'N/A', stomachType: 'N/A', vertebralFormula: 'N/A', keyAdaptation: 'Ossa cordis (bone in the heart)' },
      human: { description: 'Endurance adapted', dentalFormula: 'N/A', stomachType: 'N/A', vertebralFormula: 'N/A', keyAdaptation: 'Bipedal venous return adaptations' }
    }
  }
];

export const SPECIES_LIST: Array<{ id: SpeciesType; name: string; icon: string; category: string }> = [
  { id: 'canine', name: 'Canine (Dog)', icon: 'dog', category: 'Companion' },
  { id: 'feline', name: 'Feline (Cat)', icon: 'cat', category: 'Companion' },
  { id: 'equine', name: 'Equine (Horse)', icon: 'horse', category: 'Large Animal' },
  { id: 'bovine', name: 'Bovine (Cattle)', icon: 'cow', category: 'Livestock' },
  { id: 'human', name: 'Human', icon: 'user', category: 'Primate' }
];
