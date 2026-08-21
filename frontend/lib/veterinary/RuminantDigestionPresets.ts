export interface RuminantChamber {
  id: 'rumen' | 'reticulum' | 'omasum' | 'abomasum';
  name: string;
  volumeCapacityPct: number;
  mucosaType: string;
  primaryFunction: string;
  motilityPattern: string;
}

export const RUMINANT_CHAMBERS: RuminantChamber[] = [
  {
    id: 'rumen',
    name: 'Rumen - Paunch',
    volumeCapacityPct: 80,
    mucosaType: 'Stratified squamous epithelium with papillae',
    primaryFunction: 'Fermentation vat, VFA absorption, mixing',
    motilityPattern: 'Primary (mixing) and Secondary (eructation) contractions'
  },
  {
    id: 'reticulum',
    name: 'Reticulum - Honeycomb',
    volumeCapacityPct: 5,
    mucosaType: 'Stratified squamous epithelium with honeycomb-like crests',
    primaryFunction: 'Particle sorting, regurgitation initiation, hardware accumulation',
    motilityPattern: 'Biphasic contraction leading to rumination'
  },
  {
    id: 'omasum',
    name: 'Omasum - Manyplies/Book',
    volumeCapacityPct: 7,
    mucosaType: 'Stratified squamous epithelium with multiple leaves (laminae)',
    primaryFunction: 'Water and VFA absorption, mechanical grinding',
    motilityPattern: 'Slow, prolonged contractions'
  },
  {
    id: 'abomasum',
    name: 'Abomasum - True Stomach',
    volumeCapacityPct: 8,
    mucosaType: 'Glandular mucosa (cardiac, fundic, pyloric)',
    primaryFunction: 'Enzymatic and acidic digestion of microbes and bypass protein',
    motilityPattern: 'Peristaltic waves'
  }
];

export function calculateRumenKinetics(foragePct: number, dmiKgDay: number): {
  rumenPH: number;
  acetatePct: number;
  propionatePct: number;
  butyratePct: number;
  vfaRatio: string;
  methaneEmissionsGDay: number;
  saraRisk: 'Low' | 'Moderate' | 'Severe (SARA Present)';
  clinicalNote: string;
} {
  const concentratePct = 100 - foragePct;
  const rumenPH = Math.max(5.0, 7.0 - (concentratePct * 0.025));
  const acetatePct = Math.max(40, 70 - (concentratePct * 0.4));
  const propionatePct = Math.min(45, 15 + (concentratePct * 0.4));
  const butyratePct = 100 - acetatePct - propionatePct;
  const methaneEmissionsGDay = dmiKgDay * 20 * (foragePct / 100 + 0.5);
  
  let saraRisk: 'Low' | 'Moderate' | 'Severe (SARA Present)' = 'Low';
  if (rumenPH < 5.5) {
    saraRisk = 'Severe (SARA Present)';
  } else if (rumenPH < 6.0) {
    saraRisk = 'Moderate';
  }

  let clinicalNote = 'Rumen environment is healthy.';
  if (saraRisk === 'Severe (SARA Present)') {
    clinicalNote = 'Subacute Ruminal Acidosis (SARA) present. Risk of ruminitis, liver abscesses, and laminitis.';
  } else if (saraRisk === 'Moderate') {
    clinicalNote = 'Borderline rumen pH. Ensure adequate physically effective NDF (peNDF) to stimulate rumination and salivary buffering.';
  }

  return {
    rumenPH: parseFloat(rumenPH.toFixed(2)),
    acetatePct: parseFloat(acetatePct.toFixed(1)),
    propionatePct: parseFloat(propionatePct.toFixed(1)),
    butyratePct: parseFloat(butyratePct.toFixed(1)),
    vfaRatio: `${acetatePct.toFixed(0)}:${propionatePct.toFixed(0)}:${butyratePct.toFixed(0)}`,
    methaneEmissionsGDay: Math.round(methaneEmissionsGDay),
    saraRisk,
    clinicalNote
  };
}
