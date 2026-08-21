export interface PathogenOutbreakPreset {
  id: string;
  name: string;
  r0: number;
  incubationDays: number;
  infectiousDays: number;
  fatalityRatePct: number;
  defaultBeta: number;
  defaultGamma: number;
  defaultSigma: number;
  clinicalSummary: string;
}

export const PATHOGEN_OUTBREAK_PRESETS: PathogenOutbreakPreset[] = [
  {
    id: 'covid19_omicron',
    name: 'COVID-19 (Omicron Variant)',
    r0: 8.5,
    incubationDays: 3,
    infectiousDays: 5,
    fatalityRatePct: 0.2,
    defaultBeta: 1.7,
    defaultGamma: 0.2,
    defaultSigma: 0.33,
    clinicalSummary: 'Highly transmissible variant of SARS-CoV-2 with shorter incubation period and lower intrinsic severity compared to Delta, largely due to upper respiratory tract tropism.'
  },
  {
    id: 'measles',
    name: 'Measles',
    r0: 15,
    incubationDays: 11,
    infectiousDays: 8,
    fatalityRatePct: 0.1,
    defaultBeta: 1.875,
    defaultGamma: 0.125,
    defaultSigma: 0.09,
    clinicalSummary: 'Extremely contagious viral illness transmitted via respiratory aerosols. Characterized by maculopapular rash, Koplik spots, and potential for severe complications like pneumonia and encephalitis.'
  },
  {
    id: 'pandemic_influenza',
    name: 'Pandemic Influenza (1918-like)',
    r0: 2.2,
    incubationDays: 2,
    infectiousDays: 4,
    fatalityRatePct: 2.5,
    defaultBeta: 0.55,
    defaultGamma: 0.25,
    defaultSigma: 0.5,
    clinicalSummary: 'Severe influenza strain with high morbidity and mortality, particularly affecting young adults via cytokine storm mechanisms.'
  },
  {
    id: 'nipah',
    name: 'Nipah Virus',
    r0: 0.4,
    incubationDays: 9,
    infectiousDays: 7,
    fatalityRatePct: 60.0,
    defaultBeta: 0.057,
    defaultGamma: 0.143,
    defaultSigma: 0.111,
    clinicalSummary: 'Zoonotic paramyxovirus with high case fatality rate, often presenting with acute respiratory infection and fatal encephalitis. Transmitted via bats or contaminated food, with limited human-to-human transmission.'
  },
  {
    id: 'cholera',
    name: 'Cholera',
    r0: 2.5,
    incubationDays: 2,
    infectiousDays: 7,
    fatalityRatePct: 1.5,
    defaultBeta: 0.357,
    defaultGamma: 0.143,
    defaultSigma: 0.5,
    clinicalSummary: 'Acute diarrheal infection caused by ingestion of food or water contaminated with Vibrio cholerae. Can lead to severe dehydration and death if untreated.'
  }
];

export function calculateSEIRTrajectory(
  n: number,
  initialI: number,
  beta: number,
  sigma: number,
  gamma: number,
  days: number,
  npiReductionPct: number
): Array<{ day: number; s: number; e: number; i: number; r: number; icuPeak: number }> {
  const trajectory = [];
  let s = n - initialI;
  let e = 0;
  let i = initialI;
  let r = 0;
  const effectiveBeta = beta * (1 - npiReductionPct / 100);
  const dt = 1;

  for (let day = 0; day <= days; day++) {
    trajectory.push({
      day,
      s: Math.round(s),
      e: Math.round(e),
      i: Math.round(i),
      r: Math.round(r),
      icuPeak: Math.round(i * 0.05) // Assuming 5% of infectious need ICU
    });

    const newExposed = (effectiveBeta * s * i) / n;
    const newInfectious = sigma * e;
    const newRecovered = gamma * i;

    s = s - newExposed * dt;
    e = e + (newExposed - newInfectious) * dt;
    i = i + (newInfectious - newRecovered) * dt;
    r = r + newRecovered * dt;
  }

  return trajectory;
}

export function calculateHerdImmunityThreshold(r0: number): number {
  if (r0 <= 1) return 0;
  return 1 - 1 / r0;
}
