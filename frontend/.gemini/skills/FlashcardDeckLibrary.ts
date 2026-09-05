/**
 * Mediverse High-Yield Medical Flashcard Library
 * 60 evidence-based cards across 12 healthcare domains.
 * Types: "cloze" | "standard" | "image" | "basic"
 * Regulatory coverage: NMC CBME, USMLE Step 1/2, CCIM, INC, PCI, VCI
 */

export interface FlashcardItem {
  id: number;
  deck: string;
  front: string;
  back: string;
  interval: number; // days
  repetition: number;
  ef: number; // easiness factor
  type?: "standard" | "cloze" | "image" | "basic";
  imageUrl?: string;
  audioPrompt?: string;
  mnemonic?: string;
  lapses?: number;
  nextReviewDate?: string | Date;
  lastReviewDate?: string | Date | null;
  totalReviews?: number;
  retentionHistory?: number[];
}

export const FLASHCARD_DOMAINS = [
  "All Decks",
  "Cardiovascular",
  "Renal",
  "Respiratory",
  "Pharmacology",
  "Neuroanatomy",
  "Clinical High-Yield",
  "Ayurveda (BAMS)",
  "Dental (BDS)",
  "Pharmacy (BPharm)",
  "Nursing",
  "Physiotherapy (BPT)",
  "Veterinary (BVSc)"
] as const;

export type FlashcardDomain = (typeof FLASHCARD_DOMAINS)[number];

export const FLASHCARD_DECK_LIBRARY: FlashcardItem[] = [
  // ============================================================
  // CARDIOVASCULAR (8 cards)
  // ============================================================
  {
    id: 1,
    deck: "Cardiovascular",
    type: "cloze",
    front: "In cardiac muscle contraction, the {{c1::A band}} remains constant in length, while the {{c2::I band}} and {{c3::H zone}} shorten.",
    back: "In cardiac muscle contraction, the {{c1::A band}} remains constant in length, while the {{c2::I band}} and {{c3::H zone}} shorten.",
    mnemonic: "HIZ shrink, A stays: H-zone, I-band, and Z-lines move closer during sarcomere shortening; A-band is Always the same length.",
    audioPrompt: "In cardiac muscle contraction, which sarcomere band remains constant in length, and which bands shorten?",
    interval: 1, repetition: 0, ef: 2.5, lapses: 0
  },
  {
    id: 2,
    deck: "Cardiovascular",
    type: "cloze",
    front: "STEMI is localized to the {{c1::inferior wall}} when ST elevation appears in leads {{c2::II, III, and aVF}}, and the culprit artery is usually the {{c3::Right Coronary Artery (RCA)}}.",
    back: "STEMI is localized to the {{c1::inferior wall}} when ST elevation appears in leads {{c2::II, III, and aVF}}, and the culprit artery is usually the {{c3::Right Coronary Artery (RCA)}}.",
    mnemonic: "II, III, aVF → Look DOWN at inferior wall → RCA territory (80-85% right-dominant hearts).",
    audioPrompt: "Which ECG leads and coronary artery are implicated in inferior wall STEMI?",
    interval: 1, repetition: 0, ef: 2.5, lapses: 0
  },
  {
    id: 3,
    deck: "Cardiovascular",
    type: "cloze",
    front: "The 4-pillar evidence-based GDMT for HFrEF includes: {{c1::Beta-blocker}} (carvedilol/metoprolol succinate), {{c2::ARNI/ACEi/ARB}} (sacubitril-valsartan), {{c3::MRA}} (spironolactone/eplerenone), and {{c4::SGLT2 inhibitor}} (dapagliflozin/empagliflozin).",
    back: "The 4-pillar evidence-based GDMT for HFrEF includes: {{c1::Beta-blocker}}, {{c2::ARNI/ACEi/ARB}}, {{c3::MRA}}, and {{c4::SGLT2 inhibitor}}.",
    mnemonic: "BAMS: Beta-blocker, ARNI, MRA, SGLT2i — each confers independent incremental all-cause mortality reduction in HFrEF.",
    audioPrompt: "Name the four pillars of guideline-directed medical therapy for heart failure with reduced ejection fraction.",
    interval: 1, repetition: 0, ef: 2.5, lapses: 0
  },
  {
    id: 4,
    deck: "Cardiovascular",
    type: "cloze",
    front: "Aortic stenosis classic triad: {{c1::Syncope}}, {{c2::Angina}}, and {{c3::Dyspnea}} (SAD). Once dyspnea develops, median survival without valve replacement is approximately {{c4::2 years}}.",
    back: "Aortic stenosis classic triad: {{c1::Syncope}}, {{c2::Angina}}, and {{c3::Dyspnea (SAD)}}. Median survival without AVR after dyspnea is {{c4::2 years}}.",
    mnemonic: "SAD timeline: Angina = 5 yr, Syncope = 3 yr, Dyspnea = 2 yr median survival without intervention.",
    audioPrompt: "What is the classic triad of aortic stenosis symptoms and what is the prognosis if untreated?",
    interval: 1, repetition: 0, ef: 2.5, lapses: 0
  },
  {
    id: 5,
    deck: "Cardiovascular",
    type: "cloze",
    front: "Torsades de Pointes is a polymorphic ventricular tachycardia preceded by a prolonged {{c1::QTc interval}} (typically > 500 ms). Acute emergency drug of choice is IV {{c2::Magnesium Sulfate 2g}}.",
    back: "Torsades de Pointes: preceded by prolonged {{c1::QTc interval}} → treated acutely with IV {{c2::Magnesium Sulfate 2g}} over 1-2 minutes.",
    mnemonic: "Twisting of the points along the isoelectric baseline; hypokalemia/hypomagnesemia precipitate; Magnesium stabilizes cardiac membrane.",
    audioPrompt: "What electrophysiological substrate underlies Torsades de Pointes and what is the acute treatment?",
    interval: 1, repetition: 0, ef: 2.5, lapses: 0
  },
  {
    id: 6,
    deck: "Cardiovascular",
    type: "cloze",
    front: "Cardiogenic shock hemodynamic profile: SBP < {{c1::90 mmHg}}, Cardiac Index (CI) < {{c2::2.2 L/min/m²}}, Pulmonary Capillary Wedge Pressure (PCWP) > {{c3::15-18 mmHg}}, and Systemic Vascular Resistance (SVR) is {{c4::elevated}}.",
    back: "Cardiogenic shock: SBP < {{c1::90 mmHg}}, CI < {{c2::2.2}}, PCWP > {{c3::15-18 mmHg}}, with high {{c4::SVR}} compensatory vasoconstriction.",
    mnemonic: "Pump failure: Low output (CI down), high back-up pressure (PCWP up), vascular clamp-down (SVR up).",
    audioPrompt: "State the hemodynamic criteria for cardiogenic shock.",
    interval: 1, repetition: 0, ef: 2.5, lapses: 0
  },
  {
    id: 7,
    deck: "Cardiovascular",
    type: "standard",
    front: "What is the physiological mechanism of an S3 heart sound, and what clinical conditions does a pathological S3 indicate?",
    back: "Caused by sudden deceleration of rapid ventricular passive filling into an overcompliant or volume-overloaded ventricle during early diastole. Pathological in systolic heart failure (dilated cardiomyopathy, mitral/aortic regurgitation).",
    mnemonic: "S3 = Ken-tuck-y (SLOSH'-ing-in, early diastole volume overload). S4 = Ten-nes-see (STIFF'-wall, late diastole atrial kick against hypertrophy).",
    audioPrompt: "What is the physiological mechanism of an S3 heart sound and what does it indicate?",
    interval: 1, repetition: 0, ef: 2.5, lapses: 0
  },
  {
    id: 8,
    deck: "Cardiovascular",
    type: "cloze",
    front: "In chronic severe Aortic Regurgitation, the Left Ventricle undergoes {{c1::eccentric hypertrophy}} due to chronic volume overload. Physical exam displays a {{c2::widened pulse pressure}} and {{c3::Corrigan (water-hammer) pulse}}.",
    back: "Aortic Regurgitation: chronic volume overload causes {{c1::eccentric hypertrophy}}, {{c2::widened pulse pressure}}, and {{c3::Corrigan water-hammer pulse}}.",
    mnemonic: "Large regurgitant volume flows back in diastole → low diastolic BP (e.g., 140/40) → wide pulse pressure → hyperdynamic peripheral pulses.",
    audioPrompt: "Describe the ventricular remodeling and peripheral signs of chronic severe aortic regurgitation.",
    interval: 1, repetition: 0, ef: 2.5, lapses: 0
  },

  // ============================================================
  // RENAL (6 cards)
  // ============================================================
  {
    id: 9,
    deck: "Renal",
    type: "standard",
    front: "Which nephron segment and transporter are inhibited by Loop Diuretics (e.g. Furosemide), and what metabolic derangement do they induce?",
    back: "Loop diuretics inhibit the Na+/K+/2Cl- (NKCC2) cotransporter in the Thick Ascending Limb (TAL) of Henle's loop. They induce Hypokalemic Hypochloremic Metabolic Alkalosis and hypercalciuria.",
    mnemonic: "Loops Lose Calcium (hypercalciuria), Thiazides Take Calcium (hypercalcemia/hypocalciuria).",
    audioPrompt: "Which nephron segment and transporter are inhibited by loop diuretics, and what metabolic derangement do they induce?",
    interval: 1, repetition: 0, ef: 2.5, lapses: 0
  },
  {
    id: 10,
    deck: "Renal",
    type: "cloze",
    front: "Renin is synthesized and released by {{c1::Juxtaglomerular (JG) cells}} in response to afferent arteriolar hypoperfusion, renal sympathetic beta-1 activation, and decreased {{c2::NaCl delivery}} sensed by the {{c3::Macula Densa}}.",
    back: "Renin is released by {{c1::Juxtaglomerular (JG) cells}} in response to afferent hypoperfusion, beta-1 discharge, and decreased {{c2::NaCl delivery}} at {{c3::Macula Densa}}.",
    mnemonic: "Macula Densa = Sodium/Chloride Chemosensor in early DCT; JG Cells = Modified vascular smooth muscle baroreceptors producing active renin.",
    audioPrompt: "What anatomical structures and physiologic signals stimulate the release of renin?",
    interval: 1, repetition: 0, ef: 2.5, lapses: 0
  },
  {
    id: 11,
    deck: "Renal",
    type: "cloze",
    front: "Nephrotic syndrome is characterized by heavy proteinuria (> {{c1::3.5 g/24 hours}}), hypoalbuminemia (< 3.0 g/dL), generalized edema, and hyperlipidemia. In pediatric patients, the most frequent etiology is {{c2::Minimal Change Disease}}.",
    back: "Nephrotic syndrome: proteinuria > {{c1::3.5 g/24h}}, hypoalbuminemia, edema, hyperlipidemia. Most common pediatric etiology: {{c2::Minimal Change Disease}} (podocyte effacement).",
    mnemonic: "MCD = Minimal Change Disease = effacement of foot processes on EM with normal LM; dramatic response to corticosteroids.",
    audioPrompt: "State the diagnostic criteria for nephrotic syndrome and its commonest pediatric cause.",
    interval: 1, repetition: 0, ef: 2.5, lapses: 0
  },
  {
    id: 12,
    deck: "Renal",
    type: "cloze",
    front: "Causes of High Anion Gap Metabolic Acidosis are summarized by {{c1::MUDPILES}}: Methanol, {{c2::Uremia}}, DKA, Propylene glycol, {{c3::Isoniazid/Iron}}, Lactic acidosis, Ethylene glycol, Salicylates.",
    back: "High Anion Gap Acidosis: {{c1::MUDPILES}} — Methanol, {{c2::Uremia}}, DKA, Propylene glycol, {{c3::Isoniazid/Iron}}, Lactic acidosis, Ethylene glycol, Salicylates.",
    mnemonic: "Anion Gap = Na+ - (Cl- + HCO3-); normal is 8-12 mEq/L. Elevation indicates unmeasured endogenous or exogenous organic acids.",
    audioPrompt: "Recall the MUDPILES mnemonic for high anion gap metabolic acidosis causes.",
    interval: 1, repetition: 0, ef: 2.5, lapses: 0
  },
  {
    id: 13,
    deck: "Renal",
    type: "cloze",
    front: "Post-Streptococcal Glomerulonephritis (PSGN) develops 1-4 weeks after Group A Strep pharyngitis or impetigo, presenting with smoky/cola-colored urine ({{c1::RBC casts}}), periorbital edema, hypertension, and transiently {{c2::depressed serum C3 complement}}.",
    back: "PSGN: Cola-colored urine with {{c1::dysmorphic RBCs and RBC casts}}, hypertension, periorbital edema, and low {{c2::serum C3}} (normalizes in 6-8 weeks).",
    mnemonic: "Subepithelial 'humps' on electron microscopy and starry-sky granular IgG/C3 on immunofluorescence.",
    audioPrompt: "Describe the clinical presentation, urinary findings, and complement kinetics of PSGN.",
    interval: 1, repetition: 0, ef: 2.5, lapses: 0
  },
  {
    id: 14,
    deck: "Renal",
    type: "cloze",
    front: "Fractional Excretion of Sodium (FeNa) < {{c1::1%}} with Urine Osmolality > 500 mOsm/kg and BUN/Cr ratio > 20:1 diagnosticates {{c2::Prerenal Azotemia}}, whereas FeNa > {{c3::2%}} indicates Acute Tubular Necrosis (ATN).",
    back: "FeNa < {{c1::1%}} indicates {{c2::Prerenal Azotemia}} (intact tubular reabsorption). FeNa > {{c3::2%}} indicates intrinsic ATN.",
    mnemonic: "Prerenal tubules are healthy and reabsorb sodium greedily (<1%); dead tubules in ATN spill sodium (>2%).",
    audioPrompt: "How does Fractional Excretion of Sodium distinguish prerenal azotemia from acute tubular necrosis?",
    interval: 1, repetition: 0, ef: 2.5, lapses: 0
  },

  // ============================================================
  // RESPIRATORY (5 cards)
  // ============================================================
  {
    id: 15,
    deck: "Respiratory",
    type: "cloze",
    front: "Pulmonary surfactant is synthesized by {{c1::Type II pneumocytes}} starting around week 24-26 of gestation, composed primarily of {{c2::dipalmitoylphosphatidylcholine (DPPC)}}.",
    back: "Pulmonary surfactant is synthesized by {{c1::Type II pneumocytes}} starting around week 24-26 of gestation, composed primarily of {{c2::dipalmitoylphosphatidylcholine (DPPC)}}.",
    mnemonic: "Type II cells have 2 crucial roles: produce surfactant to decrease alveolar surface tension, and act as progenitor stem cells for Type I pneumocytes.",
    audioPrompt: "What cells synthesize pulmonary surfactant and what is its primary phospholipid constituent?",
    interval: 1, repetition: 0, ef: 2.5, lapses: 0
  },
  {
    id: 16,
    deck: "Respiratory",
    type: "cloze",
    front: "Berlin ARDS Definition requires acute onset within 1 week of insult, bilateral infiltrates on chest imaging not explained by heart failure, and PaO2/FiO2 ratio ≤ {{c1::300 mmHg}} with PEEP ≥ 5 cmH2O. Severe ARDS is classified at PaO2/FiO2 ≤ {{c2::100 mmHg}}.",
    back: "ARDS Berlin definition: P/F ratio ≤ {{c1::300 mmHg}} with PEEP ≥ 5. Mild (201-300), Moderate (101-200), Severe (≤ {{c2::100 mmHg}}).",
    mnemonic: "ARDSNet lung-protective ventilation: 6 mL/kg ideal body weight tidal volume, plateau pressure ≤ 30 cmH2O, permissive hypercapnia.",
    audioPrompt: "State the Berlin definition of ARDS and its severity thresholds based on P/F ratio.",
    interval: 1, repetition: 0, ef: 2.5, lapses: 0
  },
  {
    id: 17,
    deck: "Respiratory",
    type: "cloze",
    front: "In Tension Pneumothorax, one-way valve effect builds intrathoracic pressure causing ipsilateral absent breath sounds, hyperresonance, and tracheal deviation {{c1::away from the affected side}}. Immediate intervention is {{c2::needle decompression}} without waiting for imaging.",
    back: "Tension Pneumothorax: Trachea deviates {{c1::away from affected side}}. Immediate bedside {{c2::needle thoracostomy}} in 2nd intercostal space MCL or 5th ICS anterior axillary line.",
    mnemonic: "Clinical diagnosis! Never delay emergency decompression for chest radiograph in suspected tension pneumothorax.",
    audioPrompt: "What physical signs diagnose tension pneumothorax and what is the mandatory immediate management?",
    interval: 1, repetition: 0, ef: 2.5, lapses: 0
  },
  {
    id: 18,
    deck: "Respiratory",
    type: "cloze",
    front: "Alveolar Gas Equation calculates PAO2 = (FiO2 × (Patm - PH2O)) - (PaCO2 / R). At sea level breathing room air: PAO2 = (0.21 × (760 - 47)) - (PaCO2 / 0.8) ≈ {{c1::150 - (PaCO2 / 0.8)}}. Normal A-a gradient is < {{c2::10-15 mmHg}}.",
    back: "PAO2 ≈ {{c1::150 - (PaCO2 / 0.8)}}. Normal alveolar-arterial oxygen gradient is < {{c2::10-15 mmHg}} in young healthy individuals.",
    mnemonic: "Elevated A-a gradient indicates V/Q mismatch, diffusion defect, or right-to-left shunt (intrinsic pulmonary pathology).",
    audioPrompt: "State the simplified alveolar gas equation and the normal room-air A-a oxygen gradient.",
    interval: 1, repetition: 0, ef: 2.5, lapses: 0
  },
  {
    id: 19,
    deck: "Respiratory",
    type: "cloze",
    front: "Pancoast tumor (superior pulmonary sulcus carcinoma) typically invades the lower brachial plexus (C8-T1) and cervical sympathetic chain, producing {{c1::Horner syndrome}} (triad: {{c2::ptosis, miosis, anhidrosis}}) and ulnar-distribution upper extremity pain.",
    back: "Pancoast tumor: causes {{c1::Horner syndrome}} with classic triad of {{c2::ptosis, miosis, anhidrosis}} and hand muscle atrophy.",
    mnemonic: "PAM is Horny: Ptosis (superior tarsal muscle), Anhidrosis, Miosis (pupillodilator loss) due to sympathetic trunk destruction.",
    audioPrompt: "What local structures are compressed by a Pancoast tumor and what clinical triad results?",
    interval: 1, repetition: 0, ef: 2.5, lapses: 0
  },

  // ============================================================
  // PHARMACOLOGY (6 cards)
  // ============================================================
  {
    id: 20,
    deck: "Pharmacology",
    type: "standard",
    front: "What are the classic clinical manifestations of Anticholinergic Toxicity (e.g., Atropine or Scopolamine toxicity)?",
    back: "Tachycardia, anhidrosis (dry mouth/skin), mydriasis with cycloplegia, fever/hyperthermia, flushed skin, urinary retention, and acute delirium or hallucinations.",
    mnemonic: "Hot as a hare (fever), Blind as a bat (cycloplegia/mydriasis), Dry as a bone (anhidrosis), Red as a beet (vasodilation), Mad as a hatter (delirium), Full as a flask (urinary retention).",
    audioPrompt: "What are the classic clinical manifestations of anticholinergic toxicity?",
    interval: 1, repetition: 0, ef: 2.5, lapses: 0
  },
  {
    id: 21,
    deck: "Pharmacology",
    type: "cloze",
    front: "Warfarin inhibits {{c1::VKOR (Vitamin K epoxide reductase)}}, depleting active clotting factors {{c2::II, VII, IX, X, Protein C, Protein S}}, monitored via {{c3::PT / INR}}.",
    back: "Warfarin inhibits {{c1::VKOR (Vitamin K epoxide reductase)}}, depleting active clotting factors {{c2::II, VII, IX, X, Protein C, Protein S}}, monitored via {{c3::PT / INR}}.",
    mnemonic: "Vitamin K-dependent clotting factors: 1972 (10, 9, 7, 2) + anticoagulant Proteins C & S. Factor VII has the shortest half-life (6 hrs), so PT/INR prolongs first.",
    audioPrompt: "What enzyme is inhibited by Warfarin and which coagulation factors are depleted?",
    interval: 1, repetition: 0, ef: 2.5, lapses: 0
  },
  {
    id: 22,
    deck: "Pharmacology",
    type: "cloze",
    front: "Vaughan Williams Class III antiarrhythmic agent Amiodarone prolongs phase 3 cardiac repolarization by blocking {{c1::outward K+ channels}}. Long-term toxicities include {{c2::pulmonary fibrosis}}, thyroid dysfunction (hypo/hyper), hepatotoxicity, and blue-gray corneal microdeposits.",
    back: "Amiodarone: blocks {{c1::K+ channels}} to prolong action potential duration. Monitoring required for {{c2::pulmonary toxicity}}, thyroid labs, and liver enzymes.",
    mnemonic: "Check PFTs (pulmonary fibrosis), TFTs (40% iodine by weight inhibits 5'-deiodinase), and LFTs regularly on chronic amiodarone.",
    audioPrompt: "Describe the primary electrophysiologic mechanism of amiodarone and list three systemic toxicities.",
    interval: 1, repetition: 0, ef: 2.5, lapses: 0
  },
  {
    id: 23,
    deck: "Pharmacology",
    type: "cloze",
    front: "The classic triad of Serotonin Syndrome consists of: {{c1::Autonomic instability}} (hyperthermia, diaphoresis, tachycardia), {{c2::Neuromuscular hyperactivity}} (tremor, hyperreflexia, ocular clonus), and {{c3::Altered mental status}}. The antidote of choice is {{c4::Cyproheptadine}}.",
    back: "Serotonin syndrome: {{c1::Autonomic hyperactivity}}, {{c2::Neuromuscular excitability with clonus}}, {{c3::Altered sensorium}}. Antidote: {{c4::Cyproheptadine}} (5-HT2A antagonist).",
    mnemonic: "Hunter Serotonin Toxicity Criteria: Clonus (spontaneous, inducible, or ocular) is the most specific hallmark distinguishing SS from NMS (which features lead-pipe rigidity).",
    audioPrompt: "What clinical features characterize serotonin syndrome and what specific 5-HT antagonist is used for therapy?",
    interval: 1, repetition: 0, ef: 2.5, lapses: 0
  },
  {
    id: 24,
    deck: "Pharmacology",
    type: "cloze",
    front: "Pharmacokinetic equation for Loading Dose is: LD = (Target Plasma Concentration × {{c1::Volume of Distribution (Vd)}}) / Bioavailability (F). Maintenance Dose rate is: MD = (Target Concentration × {{c2::Systemic Clearance (CL)}}) / F.",
    back: "LD depends upon {{c1::Volume of Distribution (Vd)}}. Maintenance dose depends upon {{c2::Clearance (CL)}}.",
    mnemonic: "To fill the tank fast (Loading Dose), know how big the tank is (Vd). To keep it at level (Maintenance), know how fast it leaks (Clearance).",
    audioPrompt: "State the pharmacokinetic equations for calculating drug loading dose and maintenance dose.",
    interval: 1, repetition: 0, ef: 2.5, lapses: 0
  },
  {
    id: 25,
    deck: "Pharmacology",
    type: "cloze",
    front: "ACE inhibitors are contraindicated in {{c1::pregnancy}} (fetal renal dysgenesis / oligohydramnios), history of {{c2::hereditary or ACEi angioedema}} (bradykinin accumulation), and {{c3::bilateral renal artery stenosis}} (causes acute drop in GFR).",
    back: "ACE inhibitors contraindicated in: {{c1::pregnancy}}, {{c2::angioedema}}, and {{c3::bilateral renal artery stenosis}}.",
    mnemonic: "Efferent arteriolar dilation induced by ACEi reduces glomerular transcapillary hydraulic pressure when afferent inflow is already stenosed.",
    audioPrompt: "Name three absolute contraindications to ACE inhibitor therapy and explain the hemodynamics in bilateral renal artery stenosis.",
    interval: 1, repetition: 0, ef: 2.5, lapses: 0
  },

  // ============================================================
  // NEUROANATOMY (5 cards)
  // ============================================================
  {
    id: 26,
    deck: "Neuroanatomy",
    type: "image",
    front: "Identify the vascular anatomy of the Circle of Willis and explain the presentation of an Anterior Communicating Artery (ACom) aneurysm rupture vs compression.",
    back: "ACom aneurysm rupture causes Subarachnoid Hemorrhage ('worst headache of life'). Compression of the central optic chiasm leads to Bitemporal Hemianopsia without motor deficits.",
    imageUrl: "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=1200&q=80",
    mnemonic: "ACom = Anterior optic chiasm compression (Bitemporal visual field loss). PCom = Posterior CN III palsy (blown pupil, 'down and out' eye).",
    audioPrompt: "What are the clinical consequences of an anterior communicating artery aneurysm rupture and compression?",
    interval: 1, repetition: 0, ef: 2.5, lapses: 0
  },
  {
    id: 27,
    deck: "Neuroanatomy",
    type: "cloze",
    front: "Brown-Séquard Syndrome (spinal cord hemisection) produces: ipsilateral loss of motor function ({{c1::corticospinal tract}}) and fine touch/vibration ({{c2::dorsal columns}}), with contralateral loss of pain and temperature sensation ({{c3::spinothalamic tract}}, which decussates 1-2 levels above entry).",
    back: "Brown-Séquard: Ipsilateral {{c1::motor and dorsal column}} deficit; Contralateral {{c3::spinothalamic (pain/temperature)}} deficit beginning 1-2 segments below the lesion level.",
    mnemonic: "Same-side motor and proprioception (cross high in medulla); opposite-side pain and temp (cross immediately in anterior white commissure).",
    audioPrompt: "Describe the sensory and motor deficit pattern in Brown-Séquard hemicord syndrome.",
    interval: 1, repetition: 0, ef: 2.5, lapses: 0
  },
  {
    id: 28,
    deck: "Neuroanatomy",
    type: "cloze",
    front: "Epidural hematoma is caused by laceration of the {{c1::middle meningeal artery}} following trauma to the pterion. Head CT demonstrates a {{c2::hyperdense biconvex (lenticular) collection}} that {{c3::does not cross cranial suture lines}}.",
    back: "Epidural hematoma: laceration of {{c1::middle meningeal artery}}, {{c2::biconvex lens-shaped}} hematoma on CT, bounded by {{c3::suture lines}} (adherent dura mater).",
    mnemonic: "Classic lucid interval: brief loss of consciousness, apparent full recovery, then rapid deterioration from uncal herniation as arterial hematoma expands.",
    audioPrompt: "Which artery is lacerated in epidural hematoma and what is its classic CT morphology?",
    interval: 1, repetition: 0, ef: 2.5, lapses: 0
  },
  {
    id: 29,
    deck: "Neuroanatomy",
    type: "cloze",
    front: "Oculomotor nerve (CN III) palsy presents with ptosis, an eye positioned {{c1::'down and out'}} due to unopposed actions of CN IV (Superior Oblique) and CN VI (Lateral Rectus), and a {{c2::mydriatic unreactive pupil}} if parasympathetic fibers are compressed.",
    back: "CN III palsy: {{c1::down and out}} resting eye position, ptosis (levator palpebrae), and {{c2::dilated pupil}} (compressive lesions, e.g. PCom aneurysm or uncal herniation).",
    mnemonic: "Rule of pupil: Microvascular ischemic CN III palsy (diabetes) spares the peripherally situated pupillomotor parasympathetic fibers; surgical aneurysmal compression blows the pupil.",
    audioPrompt: "Explain the resting ocular position in oculomotor palsy and the significance of pupillary involvement.",
    interval: 1, repetition: 0, ef: 2.5, lapses: 0
  },
  {
    id: 30,
    deck: "Neuroanatomy",
    type: "cloze",
    front: "Broca's aphasia involves the posterior inferior frontal gyrus (Brodmann 44/45), causing {{c1::non-fluent expressive speech}} with preserved comprehension. Wernicke's aphasia involves the posterior superior temporal gyrus (Brodmann 22), causing {{c2::fluent, paraphasic speech with severely impaired comprehension}}.",
    back: "Broca: {{c1::non-fluent, telegraphic, intact comprehension}} (frustrated patient). Wernicke: {{c2::fluent word salad, impaired comprehension}} (unaware of deficit).",
    mnemonic: "Broca = Broken speech; Wernicke = Wordy speech but lacks sense. Conduction aphasia = arcuate fasciculus damage with intact comprehension and fluency but impaired repetition.",
    audioPrompt: "Contrast Broca's and Wernicke's aphasia in terms of fluency and comprehension.",
    interval: 1, repetition: 0, ef: 2.5, lapses: 0
  },

  // ============================================================
  // CLINICAL HIGH-YIELD (6 cards)
  // ============================================================
  {
    id: 31,
    deck: "Clinical High-Yield",
    type: "standard",
    front: "What constitutes Beck's Triad, and what acute life-threatening cardiovascular emergency does it diagnose?",
    back: "Beck's Triad diagnoses Acute Cardiac Tamponade. The triad consists of: 1) Hypotension / Decreased arterial BP, 2) Distended jugular veins (Elevated JVP), 3) Muffled / Distant heart sounds.",
    mnemonic: "3 D's of Beck: Distant heart sounds, Distended jugular veins, Decreased arterial blood pressure (plus pulsus paradoxus).",
    audioPrompt: "What is Beck's Triad and what condition does it diagnose?",
    interval: 1, repetition: 0, ef: 2.5, lapses: 0
  },
  {
    id: 32,
    deck: "Clinical High-Yield",
    type: "image",
    front: "What clinical findings define Charcot's Triad and Reynolds' Pentad in Acute Ascending Cholangitis?",
    back: "Charcot's Triad: 1) RUQ abdominal pain, 2) Fever/chills, 3) Jaundice.\nReynolds' Pentad: Charcot's Triad + 4) Hypotension/Septic shock + 5) Altered mental status.",
    imageUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80",
    mnemonic: "Charcot = Pain + Fever + Jaundice. Reynolds adds Shock + Confusion (indicates suppurative cholangitis requiring emergent biliary decompression).",
    audioPrompt: "What clinical findings define Charcot's Triad and Reynolds' Pentad for acute cholangitis?",
    interval: 1, repetition: 0, ef: 2.5, lapses: 0
  },
  {
    id: 33,
    deck: "Clinical High-Yield",
    type: "cloze",
    front: "Surviving Sepsis Campaign 1-Hour Bundle mandates: (1) Measure serum {{c1::lactate}}, (2) Obtain blood cultures {{c2::prior to antibiotic administration}}, (3) Administer broad-spectrum antibiotics, (4) Rapid infusion of {{c3::30 mL/kg crystalloid}} for hypotension or lactate ≥ 4 mmol/L, and (5) Initiate {{c4::Norepinephrine}} if MAP remains < 65 mmHg.",
    back: "SSC 1-Hour Bundle: (1) {{c1::Lactate}}, (2) Blood cultures {{c2::before antibiotics}}, (3) Broad-spectrum antibiotics, (4) {{c3::30 mL/kg}} crystalloids, (5) {{c4::Norepinephrine vasopressor}} to maintain MAP ≥ 65.",
    mnemonic: "Every hour of delayed antimicrobials in septic shock increases mortality by approximately 7.6%.",
    audioPrompt: "State the five mandatory elements of the Surviving Sepsis Campaign 1-Hour Bundle.",
    interval: 1, repetition: 0, ef: 2.5, lapses: 0
  },
  {
    id: 34,
    deck: "Clinical High-Yield",
    type: "cloze",
    front: "The diagnostic triad of Diabetic Ketoacidosis (DKA) comprises: blood glucose > {{c1::250 mg/dL}}, arterial pH < {{c2::7.30}} with serum bicarbonate < {{c3::18 mEq/L}}, and positive urine or serum {{c4::ketones (beta-hydroxybutyrate)}} with elevated anion gap.",
    back: "DKA criteria: Glucose > {{c1::250 mg/dL}}, arterial pH < {{c2::7.30}}, HCO3- < {{c3::18 mEq/L}}, positive {{c4::ketones}} with high anion gap.",
    mnemonic: "Do not start insulin if serum potassium is < 3.3 mEq/L; rehydrate and replete potassium first to avert fatal arrhythmias.",
    audioPrompt: "State the diagnostic laboratory thresholds defining diabetic ketoacidosis.",
    interval: 1, repetition: 0, ef: 2.5, lapses: 0
  },
  {
    id: 35,
    deck: "Clinical High-Yield",
    type: "cloze",
    front: "Postpartum Hemorrhage etiologies follow the 4Ts: {{c1::Tone}} (uterine atony, 70-80%), {{c2::Trauma}} (cervical/vaginal lacerations, 20%), {{c3::Tissue}} (retained placenta/membranes, 10%), and {{c4::Thrombin}} (coagulopathy, 1%). First-line medical uterotonic is {{c5::Oxytocin}}.",
    back: "PPH 4Ts: {{c1::Tone}}, {{c2::Trauma}}, {{c3::Tissue}}, {{c4::Thrombin}}. First-line agent: {{c5::Oxytocin 10-40 IU infusion or 10 IU IM}}.",
    mnemonic: "Active management of the third stage of labor (AMTSL) reduces PPH risk by over 60%.",
    audioPrompt: "Recall the 4Ts mnemonic for postpartum hemorrhage causes and name the first-line uterotonic.",
    interval: 1, repetition: 0, ef: 2.5, lapses: 0
  },
  {
    id: 36,
    deck: "Clinical High-Yield",
    type: "cloze",
    front: "CURB-65 pneumonia severity score: {{c1::Confusion}} (AMTS ≤ 8), {{c2::Urea > 7 mmol/L (BUN > 19 mg/dL)}}, {{c3::Respiratory rate ≥ 30/min}}, {{c4::Blood pressure (SBP < 90 or DBP ≤ 60)}}, and {{c5::Age ≥ 65 years}}. Score ≥ 3 indicates consideration for ICU care.",
    back: "CURB-65: {{c1::Confusion}}, {{c2::Urea > 7 mmol/L}}, {{c3::RR ≥ 30}}, {{c4::BP < 90/60}}, {{c5::Age ≥ 65}}. Score 0-1 = outpatient; 2 = inpatient ward; ≥ 3 = severe pneumonia.",
    mnemonic: "Each letter is 1 point. Rapid, validated tool to stratify 30-day mortality risk in community-acquired pneumonia.",
    audioPrompt: "State the five clinical criteria composing the CURB-65 pneumonia severity score.",
    interval: 1, repetition: 0, ef: 2.5, lapses: 0
  },

  // ============================================================
  // AYURVEDA (BAMS) — 5 cards
  // ============================================================
  {
    id: 37,
    deck: "Ayurveda (BAMS)",
    type: "cloze",
    front: "The foundational Tri-Dosha framework comprises: {{c1::Vata}} (Ether + Air, controlling kinetic and nervous impulses), {{c2::Pitta}} (Fire + Water, governing metabolism and enzymatic digestion), and {{c3::Kapha}} (Water + Earth, providing structural stability and anabolism).",
    back: "Tri-Dosha: {{c1::Vata}} (Air/Space - movement), {{c2::Pitta}} (Fire/Water - transformation/Agni), {{c3::Kapha}} (Earth/Water - lubrication/structure).",
    mnemonic: "Dosha equilibrium represents Prakriti (physiologic homeostasis); disequilibrium represents Vikriti (pathophysiologic state).",
    audioPrompt: "Explain the elemental composition and physiological governance of the three Ayurvedic Doshas.",
    interval: 1, repetition: 0, ef: 2.5, lapses: 0
  },
  {
    id: 38,
    deck: "Ayurveda (BAMS)",
    type: "cloze",
    front: "Panchakarma five bio-purification procedures include: {{c1::Vamana}} (therapeutic emesis for Kapha), {{c2::Virechana}} (therapeutic purgation for Pitta), {{c3::Basti}} (medicated enema therapy, the master therapy for Vata), {{c4::Nasya}} (errhine nasal administration for supraclavicular diseases), and {{c5::Raktamokshana}} (bloodletting).",
    back: "Panchakarma: {{c1::Vamana}} (Kapha), {{c2::Virechana}} (Pitta), {{c3::Basti}} (Vata), {{c4::Nasya}} (Urdhva Jatrugata), and {{c5::Raktamokshana}} (Rakta/Pitta vitiation).",
    mnemonic: "Purvakarma (Snehana oleation and Svedana fomentation) liquefies doshas before Pradhanakarma (Panchakarma elimination).",
    audioPrompt: "List the five classical Panchakarma therapies and their predominant Dosha targets.",
    interval: 1, repetition: 0, ef: 2.5, lapses: 0
  },
  {
    id: 39,
    deck: "Ayurveda (BAMS)",
    type: "cloze",
    front: "In Ayurvedic pathogenesis, {{c1::Ama}} is the toxic, antigenic, macromolecular byproduct of impaired Agni (hypofunctioning digestive fire). It obstructs Srotas (micro-channels), and in Amavata (correlated to {{c2::Rheumatoid Arthritis}}), Ama combines with vitiated Vata to lodge in synovial joints.",
    back: "Ama: {{c1::undigested toxic metabolite}} resulting from Agnimandya. In Amavata ({{c2::Rheumatoid Arthritis}}), Ama-Vata complex deposits in Sandhi (joints).",
    mnemonic: "Langhana (therapeutic fasting) and Deepana-Pachana herbs (Trikatu, Shunthi) digest Ama before any oleation or tonification.",
    audioPrompt: "Define Ama in Ayurvedic pathophysiology and state its role in Amavata.",
    interval: 1, repetition: 0, ef: 2.5, lapses: 0
  },
  {
    id: 40,
    deck: "Ayurveda (BAMS)",
    type: "cloze",
    front: "Ayurveda defines {{c1::107 Marma points}} as vital anatomical junctions of Mamsa (muscle), Sira (vessels), Snayu (ligaments), Asthi (bone), and Sandhi (joints). The 19 {{c2::Sadhyo Pranahara Marmas}} (e.g., Sringataka, Hridaya, Nabhi) produce immediate mortality upon trauma.",
    back: "{{c1::107 Marma points}} anatomically mapped; the {{c2::Sadhyo Pranahara Marmas}} cause fatal collapse within 1-7 days if severely injured.",
    mnemonic: "Marma classification by structural prognosis: Sadhyo Pranahara (fatal), Kalantara (delayed death), Vishalyaghna, Vaikalyakara (disabling), Rujakara (painful).",
    audioPrompt: "How many Marma points are described in Sushruta Samhita and what characterizes Sadhyo Pranahara Marmas?",
    interval: 1, repetition: 0, ef: 2.5, lapses: 0
  },
  {
    id: 41,
    deck: "Ayurveda (BAMS)",
    type: "cloze",
    front: "Nadi Pariksha (Ayurvedic pulse diagnosis) is examined over the radial artery using three fingers: the index finger senses {{c1::Vata (Sarpa/serpentine motion)}}, the middle finger senses {{c2::Pitta (Manduka/frog-like bounding pulse)}}, and the ring finger senses {{c3::Kapha (Hamsa/swan-like slow, steady pulse)}}.",
    back: "Nadi Pariksha: Index = {{c1::Vata (serpentine/fast)}}, Middle = {{c2::Pitta (bounding/jumping)}}, Ring = {{c3::Kapha (slow/swan-like)}}.",
    mnemonic: "Best evaluated in early morning on an empty stomach (Pratah Kaala) when bodily humors reflect baseline constitution.",
    audioPrompt: "Which finger positions and animal movements correspond to Vata, Pitta, and Kapha in Nadi Pariksha?",
    interval: 1, repetition: 0, ef: 2.5, lapses: 0
  },

  // ============================================================
  // DENTAL (BDS) — 5 cards
  // ============================================================
  {
    id: 42,
    deck: "Dental (BDS)",
    type: "cloze",
    front: "In pulpal diagnostics, {{c1::Reversible Pulpitis}} exhibits sharp transient pain with cold that subsides within 5-10 seconds of stimulus removal, whereas {{c2::Symptomatic Irreversible Pulpitis}} is characterized by lingering pain > 30 seconds, unprovoked nocturnal throbbing, and requires {{c3::endodontic therapy (pulpectomy)}}.",
    back: "Reversible: pain subsides in {{c1::< 10s}} post-stimulus. Irreversible: lingering pain > {{c2::30 seconds}} or spontaneous, requiring {{c3::root canal treatment}}.",
    mnemonic: "Lingering cold response is pathognomonic of C-fiber activation in unmyelinated pulpal tissue under ischemic strangulation.",
    audioPrompt: "How do reversible and irreversible pulpitis differ clinically on thermal testing?",
    interval: 1, repetition: 0, ef: 2.5, lapses: 0
  },
  {
    id: 43,
    deck: "Dental (BDS)",
    type: "cloze",
    front: "In the 2017 AAP/EFP Periodontal Classification, Staging (Stages I-IV) is based upon {{c1::severity and complexity of interdental clinical attachment loss (CAL)}}, while Grading (Grades A, B, C) measures the {{c2::biologic rate of progression and systemic risk factors}} (e.g. smoking, HbA1c).",
    back: "Periodontitis Staging = {{c1::Severity/CAL extent}}; Grading = {{c2::Rate of progression and systemic modifiers (Grade C = rapid)}}.",
    mnemonic: "Stage IV represents severe periodontitis with potential loss of dentition requiring complex multidisciplinary rehabilitation.",
    audioPrompt: "Explain what Staging and Grading reflect in the 2017 World Workshop periodontal classification.",
    interval: 1, repetition: 0, ef: 2.5, lapses: 0
  },
  {
    id: 44,
    deck: "Dental (BDS)",
    type: "cloze",
    front: "Inferior Alveolar Nerve Block (IANB) targets the pterygomandibular space near the mandibular foramen. Landmarks include the {{c1::coronoid notch}} on anterior ramus border, {{c2::pterygomandibular raphe}}, and the occlusal plane of mandibular molars with needle entry from the {{c3::contralateral premolar}} area.",
    back: "IANB landmarks: {{c1::coronoid notch}}, {{c2::pterygomandibular raphe}}, needle advanced parallel to occlusal plane from {{c3::contralateral premolars}}.",
    mnemonic: "Premature bone contact means needle is too anterior on ramus; no bone contact after 25mm means needle is too posterior into parotid gland (risk of transient facial palsy).",
    audioPrompt: "Identify the anatomic landmarks and injection path for an Inferior Alveolar Nerve Block.",
    interval: 1, repetition: 0, ef: 2.5, lapses: 0
  },
  {
    id: 45,
    deck: "Dental (BDS)",
    type: "cloze",
    front: "In Fixed Partial Denture (FPD) mechanics, {{c1::Ante's Law}} dictates that the combined pericemental root surface area of all abutment teeth must be {{c2::equal to or greater than}} the pericemental surface area of the teeth being replaced.",
    back: "Ante's Law: Combined pericemental area of abutments must be {{c2::≥ area of replaced teeth}}.",
    mnemonic: "Deflecting force increases with the cube of the span length (Span length doubled = 8x deflection; tripled = 27x deflection).",
    audioPrompt: "State Ante's Law in prosthodontics and explain its significance in bridge design.",
    interval: 1, repetition: 0, ef: 2.5, lapses: 0
  },
  {
    id: 46,
    deck: "Dental (BDS)",
    type: "cloze",
    front: "Oral Submucous Fibrosis (OSMF) is a chronic, insidious premalignant disorder driven by {{c1::areca nut (betel nut)}} chewing. Characterized by progressive trismus, burning sensation with spicy food, blanching of buccal mucosa, and histopathologic {{c2::juxta-epithelial dense collagen hyalinization}}.",
    back: "OSMF is caused by {{c1::areca nut}} alkaloids (arecoline); exhibits {{c2::dense submucosal collagen hyalinization}} with 7-13% lifetime malignant transformation risk.",
    mnemonic: "Arecoline upregulates collagen synthesis while downregulating collagenase; copper in areca nut stimulates lysyl oxidase crosslinking.",
    audioPrompt: "What is the primary etiology and histopathologic hallmark of Oral Submucous Fibrosis?",
    interval: 1, repetition: 0, ef: 2.5, lapses: 0
  },

  // ============================================================
  // PHARMACY (BPharm) — 4 cards
  // ============================================================
  {
    id: 47,
    deck: "Pharmacy (BPharm)",
    type: "cloze",
    front: "Volume of Distribution (Vd = Dose / C0) reflects the apparent fluid volume required to contain total body drug at plasma concentration. Highly lipophilic drugs (e.g., {{c1::Amiodarone, Chloroquine}}) exhibit enormous Vd exceeding {{c2::several hundred liters}}, indicating extensive tissue sequestration.",
    back: "Vd = Dose / C0. Lipophilic drugs like {{c1::Amiodarone or Chloroquine}} have Vd > {{c2::100-500 L}}, binding tightly into adipose and organ parenchyma.",
    mnemonic: "Drugs with huge Vd cannot be effectively removed by hemodialysis because only a negligible fraction resides in circulating plasma.",
    audioPrompt: "Define apparent volume of distribution and explain why lipophilic drugs display massive Vd.",
    interval: 1, repetition: 0, ef: 2.5, lapses: 0
  },
  {
    id: 48,
    deck: "Pharmacy (BPharm)",
    type: "cloze",
    front: "The Beer-Lambert Law establishes that Absorbance A = {{c1::ε × c × l}}, where ε is molar absorptivity, c is solute concentration, and l is optical path length. Deviations occur at high concentrations due to {{c2::solute-solute molecular interactions}} or polychromatic light scattering.",
    back: "Beer-Lambert: A = {{c1::ε × c × l}}. Deviations from linearity happen at high concentrations due to {{c2::molecular association/dissociation or refractive index changes}}.",
    mnemonic: "Basis for quantitative UV-Vis spectrophotometric assays of pharmacopoeial active pharmaceutical ingredients (APIs).",
    audioPrompt: "State the Beer-Lambert Law equation and conditions that cause deviations from linearity.",
    interval: 1, repetition: 0, ef: 2.5, lapses: 0
  },
  {
    id: 49,
    deck: "Pharmacy (BPharm)",
    type: "cloze",
    front: "Common tablet manufacturing compression defects: {{c1::Capping}} is partial or complete separation of the top or bottom crown from tablet body, frequently caused by {{c2::air entrapment}} or excessive fine powders; {{c3::Lamination}} is separation into two or more distinct layers.",
    back: "{{c1::Capping}} is detachment of tablet top/bottom due to {{c2::air entrapment or high compression speed}}; {{c3::Lamination}} is splitting into parallel distinct layers.",
    mnemonic: "Remedies for capping: use tapered dies, pre-compression deaeration, slow compression speed, optimize binder and moisture content.",
    audioPrompt: "Define capping and lamination in pharmaceutical tablet manufacturing and their primary mechanical causes.",
    interval: 1, repetition: 0, ef: 2.5, lapses: 0
  },
  {
    id: 50,
    deck: "Pharmacy (BPharm)",
    type: "cloze",
    front: "In Griffin's Hydrophile-Lipophile Balance (HLB) scale, surfactants with low HLB values ({{c1::3-6}}) are lipophilic and stabilize {{c2::Water-in-Oil (W/O)}} emulsions (e.g. Span 80), whereas high HLB surfactants ({{c3::8-16}}) are hydrophilic and stabilize {{c4::Oil-in-Water (O/W)}} emulsions (e.g. Tween 80).",
    back: "Low HLB ({{c1::3-6}}) = lipophilic → {{c2::W/O emulsions}}. High HLB ({{c3::8-16}}) = hydrophilic → {{c4::O/W emulsions}}.",
    mnemonic: "Low HLB loves lipids (lipophilic); High HLB holds hydrophilic heads into continuous aqueous phase.",
    audioPrompt: "How does the HLB value dictate whether a surfactant stabilizes an O/W or a W/O emulsion?",
    interval: 1, repetition: 0, ef: 2.5, lapses: 0
  },

  // ============================================================
  // NURSING — 4 cards
  // ============================================================
  {
    id: 51,
    deck: "Nursing",
    type: "cloze",
    front: "The SBAR structured clinical communication tool comprises: {{c1::Situation}} (immediate patient concern and baseline vitals), {{c2::Background}} (clinical history, admitting diagnosis, recent interventions), {{c3::Assessment}} (nurse's evaluation of hemodynamic status), and {{c4::Recommendation}} (specific proposed action or physician order).",
    back: "SBAR: {{c1::Situation}}, {{c2::Background}}, {{c3::Assessment}}, {{c4::Recommendation}} — standardized JCI handover tool mitigating verbal handoff errors.",
    mnemonic: "Used in urgent escalations: 'Dr. Jones, this is Nurse Sarah on 4-East. Situation: Mr. Patel's BP dropped to 82/50...'",
    audioPrompt: "Explain the four components of the SBAR clinical communication framework.",
    interval: 1, repetition: 0, ef: 2.5, lapses: 0
  },
  {
    id: 52,
    deck: "Nursing",
    type: "cloze",
    front: "The Braden Scale evaluates pressure injury risk across 6 domains: Sensory Perception, Moisture, Activity, Mobility, Nutrition, and Friction/Shear. Total scores range from 6 to 23, with scores ≤ {{c1::18}} indicating clinical risk requiring a {{c2::q2h repositioning protocol}} and pressure redistribution surface.",
    back: "Braden Scale: score ≤ {{c1::18}} denotes pressure injury risk; mandates {{c2::q2h patient repositioning}} and barrier skin care.",
    mnemonic: "Lower number = Higher risk! Score 15-18 (mild risk), 13-14 (moderate), 10-12 (high), ≤ 9 (very high risk).",
    audioPrompt: "What score on the Braden Scale defines pressure injury risk and what standard nursing protocol is triggered?",
    interval: 1, repetition: 0, ef: 2.5, lapses: 0
  },
  {
    id: 53,
    deck: "Nursing",
    type: "cloze",
    front: "Active Management of the Third Stage of Labor (AMTSL) includes three routine interventions: prophylactic administration of an intramuscular uterotonic ({{c1::Oxytocin 10 IU IM}} within 1 minute of fetal delivery), {{c2::Controlled Cord Traction (CCT)}} with counter-traction, and immediate postpartum {{c3::uterine fundal massage}}.",
    back: "AMTSL components: {{c1::Oxytocin 10 IU IM}}, {{c2::Controlled Cord Traction (Brandt-Andrews maneuver)}}, and {{c3::fundal massage}}.",
    mnemonic: "AMTSL halves the incidence of life-threatening postpartum hemorrhage compared to expectant physiologic management.",
    audioPrompt: "State the three core steps of Active Management of the Third Stage of Labor.",
    interval: 1, repetition: 0, ef: 2.5, lapses: 0
  },
  {
    id: 54,
    deck: "Nursing",
    type: "cloze",
    front: "National Early Warning Score 2 (NEWS2) aggregates six physiologic parameters: Respiration Rate, SpO2, Systolic BP, Pulse, Consciousness (ACVPU), and {{c1::Temperature}}. An aggregate score ≥ {{c2::7}} (or single parameter score of 3) mandates urgent evaluation by a {{c3::Medical Emergency / Rapid Response Team}}.",
    back: "NEWS2 assesses 6 vitals including {{c1::Temperature}}. An aggregate score ≥ {{c2::7}} triggers an emergency {{c3::Rapid Response Team (RRT)}} bedside response.",
    mnemonic: "NEWS2 standardizes track-and-trigger deterioration systems across emergency departments and inpatient wards.",
    audioPrompt: "What trigger score on the NEWS2 system warrants emergency Medical Emergency Team call-out?",
    interval: 1, repetition: 0, ef: 2.5, lapses: 0
  },

  // ============================================================
  // PHYSIOTHERAPY (BPT) — 4 cards
  // ============================================================
  {
    id: 55,
    deck: "Physiotherapy (BPT)",
    type: "cloze",
    front: "Brunnstrom's Stages of Motor Recovery following stroke progress through 6 phases: Stage 1 = {{c1::Flaccidity}}; Stage 2 = Development of spasticity and basic limb synergies; Stage 3 = {{c2::Peak spasticity and full voluntary synergy control}}; Stage 4 = Spasticity begins to decline with initial out-of-synergy movement; Stage 5 = Complex isolated combinations; Stage 6 = {{c3::Disappearance of spasticity with isolated coordinated movement}}.",
    back: "Brunnstrom: Stage 1 = {{c1::Flaccidity}}, Stage 3 = {{c2::Peak spasticity with marked synergies}}, Stage 6 = {{c3::Near-normal coordination}}.",
    mnemonic: "Synergies must be initially facilitated in early stages (1-3) before training active isolation out of synergy in stages 4-6.",
    audioPrompt: "Describe the progression of spasticity and voluntary control across Brunnstrom's 6 recovery stages.",
    interval: 1, repetition: 0, ef: 2.5, lapses: 0
  },
  {
    id: 56,
    deck: "Physiotherapy (BPT)",
    type: "cloze",
    front: "In the McKenzie Method (MDT), the phenomenon of {{c1::Centralization}} occurs when distal referred radicular pain progressively moves proximally toward the spinal midline in response to repeated directional movements. Its occurrence is a robust positive prognostic marker indicating {{c2::Directional Preference}} (usually lumbar extension).",
    back: "{{c1::Centralization}} of pain toward the spinal midline confirms favorable prognosis and identifies {{c2::Directional Preference}}.",
    mnemonic: "Peripheralization (pain spreading further into distal limb) indicates worsening mechanical nuclear displacement and contraindicates that direction of movement.",
    audioPrompt: "Define the McKenzie centralization phenomenon and its prognostic significance in spinal radiculopathy.",
    interval: 1, repetition: 0, ef: 2.5, lapses: 0
  },
  {
    id: 57,
    deck: "Physiotherapy (BPT)",
    type: "cloze",
    front: "Conventional High-Frequency TENS operates at {{c1::80-120 Hz}} with low sensory intensity, mediating analgesia via the {{c2::Gate Control Theory}} by stimulating large-diameter A-beta cutaneous afferents to inhibit dorsal horn transmission. Low-Frequency (Acupuncture-like) TENS ({{c3::2-10 Hz}}) stimulates A-delta and C fibers to trigger {{c4::endogenous opioid (endorphin) release}}.",
    back: "High-frequency TENS ({{c1::80-120 Hz}}) acts via {{c2::Gate Control}}; Low-frequency TENS ({{c3::2-10 Hz}}) activates {{c4::endogenous opioid release}}.",
    mnemonic: "High-frequency gives immediate fast pain relief that dissipates quickly; low-frequency produces delayed onset with prolonged post-treatment carryover analgesia.",
    audioPrompt: "Differentiate the neurophysiologic mechanisms of high-frequency versus low-frequency TENS.",
    interval: 1, repetition: 0, ef: 2.5, lapses: 0
  },
  {
    id: 58,
    deck: "Physiotherapy (BPT)",
    type: "cloze",
    front: "The Medical Research Council (MRC) Muscle Power Scale grades: Grade 0 = No contraction; Grade 1 = Trace flicker; Grade 2 = Movement with {{c1::gravity eliminated}}; Grade 3 = Active movement {{c2::against gravity only without resistance}}; Grade 4 = Movement against gravity and moderate resistance; Grade 5 = Normal power.",
    back: "MRC: Grade 2 = {{c1::gravity eliminated}}, Grade 3 = {{c2::against gravity only (antigravity)}}, Grade 5 = normal strength.",
    mnemonic: "Grade 3 is the critical functional milestone separating non-antigravity from antigravity functional mobility.",
    audioPrompt: "Define MRC muscle power grades 2 and 3 and explain their functional distinction.",
    interval: 1, repetition: 0, ef: 2.5, lapses: 0
  },

  // ============================================================
  // VETERINARY (BVSc) — 4 cards
  // ============================================================
  {
    id: 59,
    deck: "Veterinary (BVSc)",
    type: "cloze",
    front: "In male domestic felines, acute urethral obstruction secondary to FLUTD (Feline Lower Urinary Tract Disease) causes post-renal azotemia and severe life-threatening {{c1::hyperkalemia}} (> 7.0 mEq/L). Immediate emergency cardioprotection is achieved with slow IV {{c2::10% Calcium Gluconate (0.5-1.5 mL/kg)}} prior to urethral desobstruction.",
    back: "FLUTD urethral blockage causes fatal {{c1::hyperkalemia}}. IV {{c2::Calcium Gluconate}} stabilizes myocardial cell membranes without lowering serum potassium.",
    mnemonic: "Calcium gluconate does not reduce serum potassium concentration; it normalizes the cardiac resting membrane-threshold potential difference to avert asystole.",
    audioPrompt: "What metabolic electrolyte emergency develops in obstructive feline FLUTD and what provides immediate cardioprotection?",
    interval: 1, repetition: 0, ef: 2.5, lapses: 0
  },
  {
    id: 60,
    deck: "Veterinary (BVSc)",
    type: "cloze",
    front: "Left Displaced Abomasum (LDA) in dairy cattle typically develops in the first 4 weeks postpartum due to abomasal atony and gas distension. Auscultation and simultaneous percussion of the left paralumbar fossa between the 8th and 13th ribs produces a pathognomonic {{c1::high-pitched resonant 'ping'}}. Definitive surgical correction includes {{c2::right flank omentopexy}} or left paralumbar abomasopexy.",
    back: "LDA: produces pathognomonic {{c1::left flank tympanic 'ping'}} on percussion. Corrected surgically by {{c2::omentopexy or abomasopexy}}.",
    mnemonic: "Postpartum hypocalcemia and high-concentrate/low-roughage diets lead to abomasal hypomotility, gaseous dilation, and leftward displacement under the rumen.",
    audioPrompt: "What physical examination finding is pathognomonic for Left Displaced Abomasum in cows and how is it corrected?",
    interval: 1, repetition: 0, ef: 2.5, lapses: 0
  }
];
