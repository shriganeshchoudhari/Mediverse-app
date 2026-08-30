/**
 * HighYieldClinicalPearls.ts
 * Medical Licensing Exam (USMLE, NEXT, INI-CET, NCLEX, NBDE) High-Yield Pearls & Examiner Traps
 * Part of Mediverse Frontend Skills
 */

export interface ClinicalPearl {
  id: string;
  topic: string;
  domain: string;
  buzzword: string;
  pathophysiology: string;
  firstLineDiagnostic: string;
  firstLineTreatment: string;
  examinerTrap: string; // Common MCQ distractor pitfall
  clinicalMnemonics?: string;
}

export const HIGH_YIELD_PEARL_REGISTRY: Record<string, ClinicalPearl[]> = {
  cardiovascular: [
    {
      id: 'pearl-cardio-01',
      topic: 'Acute Coronary Syndrome (STEMI vs NSTEMI)',
      domain: 'ALLOPATHIC_MBBS',
      buzzword: 'Crushing substernal chest pain radiating to left arm/jaw, diaphoresis, levine sign.',
      pathophysiology: 'Rupture of atherosclerotic fibrous cap with acute occlusive coronary thrombosis (Transmural ischemia).',
      firstLineDiagnostic: '12-Lead ECG within 10 minutes of arrival (ST elevation >= 1mm in 2 contiguous leads).',
      firstLineTreatment: 'Aspirin 325mg chewable + P2Y12 inhibitor + Emergency Primary Percutaneous Coronary Intervention (PCI) within 90 mins.',
      examinerTrap: 'Giving Nitrates or Beta-Blockers in Inferior/Right Ventricular STEMI (Leads II, III, aVF) — causes catastrophic preload drop and profound hypotension.',
      clinicalMnemonics: 'MONA (Morphine, Oxygen, Nitrates, Aspirin) — but avoid nitrates in RV infarct!',
    },
    {
      id: 'pearl-cardio-02',
      topic: 'Infective Endocarditis',
      domain: 'ALLOPATHIC_MBBS',
      buzzword: 'New regurgitant murmur + fever in IV drug user; Osler nodes, Janeway lesions, Roth spots.',
      pathophysiology: 'Bacterial colonization on damaged endocardial surface/valves forming friable vegetations.',
      firstLineDiagnostic: '3 sets of blood cultures from separate venipuncture sites + Transthoracic/Transesophageal Echocardiogram (TTE/TEE).',
      firstLineTreatment: 'Empiric IV Vancomycin + Gentamicin (adjust post culture sensitivities).',
      examinerTrap: 'Osler nodes are PAINFUL on finger pads (immune complex deposition), whereas Janeway lesions are NON-PAINFUL on palms/soles (microemboli).',
      clinicalMnemonics: 'FROM JANE (Fever, Roth spots, Osler nodes, Murmur, Janeway lesions, Anemia, Nail hemorrhage, Emboli)',
    },
  ],
  dental: [
    {
      id: 'pearl-dent-01',
      topic: 'Irreversible Pulpitis vs Reversible Pulpitis',
      domain: 'DENTAL_BDS',
      buzzword: 'Spontaneous, lingering thermal pain lasting >30 seconds after stimulus removal, nocturnal pain.',
      pathophysiology: 'Intense pulpal inflammation causing microvascular strangulation inside rigid dentin chamber.',
      firstLineDiagnostic: 'Electric Pulp Test (EPT) + Cold thermal test (Endo-Ice) + Periapical radiograph.',
      firstLineTreatment: 'Root Canal Treatment (Pulpectomy) or Extraction.',
      examinerTrap: 'Prescribing systemic antibiotics alone for irreversible pulpitis without mechanical debridement/pulpectomy — antibiotics cannot penetrate necrotic/non-perfused pulp.',
    },
  ],
  ayush: [
    {
      id: 'pearl-ayush-01',
      topic: 'Amavata (Rheumatoid Arthritis Equivalent)',
      domain: 'AYUSH_BAMS',
      buzzword: 'Symmetrical morning stiffness in small joints, Vrishchika damshavat vedana (scorpion-bite pain).',
      pathophysiology: 'Aggravated Vata transporting undigested toxic metabolic endotoxins (Ama) to the Shleshma Sthana (synovial joints).',
      firstLineDiagnostic: 'Prakriti & Dashavidha Pareeksha + Serum RA factor / Anti-CCP antibody.',
      firstLineTreatment: 'Langhana (Fasting), Swedana (Deep heat fomentation), and Rasnadwadasaka Kwatha / Shunthi formulations.',
      examinerTrap: 'Administering Snigdha (oily/heavy) therapies during acute Ama stage — worsens metabolic obstruction and synovial inflammation.',
    },
  ],
  pharmacology: [
    {
      id: 'pearl-pharm-01',
      topic: 'Vancomycin Dosing & Red Man Syndrome',
      domain: 'PHARMACY_PHARMD',
      buzzword: 'Flushing, pruritus, and erythematous rash over face and upper torso during rapid intravenous infusion.',
      pathophysiology: 'Direct, non-IgE mediated mast cell degranulation and histamine release (rate-dependent pseudoallergy).',
      firstLineDiagnostic: 'Clinical observation during infusion; monitor therapeutic trough levels (15-20 mcg/mL for severe MRSA).',
      firstLineTreatment: 'Slow infusion rate to >= 60-120 minutes + Pre-treat with H1-antihistamine (Diphenhydramine).',
      examinerTrap: 'Confusing Red Man Syndrome with true IgE-mediated anaphylaxis and permanently discontinuing Vancomycin. It is NOT an absolute contraindication.',
    },
  ],
};
