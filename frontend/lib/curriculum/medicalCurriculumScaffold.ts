/**
 * Mediverse Medical Curriculum Scaffold Framework
 * 
 * Authoritative taxonomy defining all 19 core medical subjects across Pre-Clinical,
 * Para-Clinical, Clinical, and Transversal (AETCOM / ECE) tiers according to
 * NMC CBME, USMLE Step 1/2 CK, and global undergraduate medical curricula.
 */

export type MedicalPhase = "PRE_CLINICAL" | "PARA_CLINICAL" | "CLINICAL" | "TRANSVERSAL";

export type OrganSystemCategory = 
  | "GENERAL"
  | "CARDIOVASCULAR"
  | "RESPIRATORY"
  | "RENAL"
  | "NEUROLOGY"
  | "GASTROINTESTINAL"
  | "ENDOCRINE"
  | "MUSCULOSKELETAL"
  | "HEMATOLOGY"
  | "REPRODUCTIVE"
  | "INTEGUMENTARY"
  | "IMMUNOLOGY"
  | "PUBLIC_HEALTH";

export interface SubjectCompetency {
  code: string; // e.g. "PY1.1", "AN10.1", "PA16.2", "PH1.15"
  domain: string;
  title: string;
  level: "KNOWS" | "KNOWS_HOW" | "SHOWS_HOW" | "PERFORMS"; // Miller's Prism
  verticalIntegration?: string[]; // Related clinical subjects
  horizontalIntegration?: string[]; // Related pre-clinical subjects
}

export interface SubjectChapter {
  id: string;
  title: string;
  description: string;
  estimatedMinutes: number;
  highYieldTopics: string[];
  competencies: string[];
}

export interface SubjectUnit {
  id: string;
  title: string;
  system: OrganSystemCategory;
  chapters: SubjectChapter[];
}

export interface MedicalSubject {
  id: string;
  code: string;
  title: string;
  shortDescription: string;
  phase: MedicalPhase;
  professionalYear: "1st Professional" | "2nd Professional" | "3rd Professional I" | "Final Professional II" | "Longitudinal";
  primarySystem: OrganSystemCategory;
  colorTheme: {
    accent: string;
    badgeBg: string;
    badgeText: string;
    border: string;
  };
  icon: string;
  has3DCanvas: boolean;
  hasSimulators: boolean;
  defaultSimulatorRoute?: string;
  units: SubjectUnit[];
  keyCompetencies: SubjectCompetency[];
  recommendedTextbooks: string[];
}

export const MEDICAL_CURRICULUM_SCAFFOLD: MedicalSubject[] = [
  // ==========================================
  // PRE-CLINICAL SUBJECTS (1st Professional Year)
  // ==========================================
  {
    id: "subj-physio",
    code: "PHYS-101",
    title: "Human Physiology",
    shortDescription: "Biophysical mechanisms, homeostatic feedback loops, and cellular organ functions.",
    phase: "PRE_CLINICAL",
    professionalYear: "1st Professional",
    primarySystem: "GENERAL",
    colorTheme: {
      accent: "#3b82f6",
      badgeBg: "rgba(59, 130, 246, 0.12)",
      badgeText: "#60a5fa",
      border: "rgba(59, 130, 246, 0.3)"
    },
    icon: "🫀",
    has3DCanvas: true,
    hasSimulators: true,
    defaultSimulatorRoute: "/simulators/cardiac-cycle",
    units: [
      {
        id: "phys-u1",
        title: "General & Cellular Physiology",
        system: "GENERAL",
        chapters: [
          {
            id: "phys-c1",
            title: "Cell Membrane Transport & Homeostasis",
            description: "Passive/active transport, Na+/K+ ATPase pump, Gibbs-Donnan equilibrium, and osmotic tonicity.",
            estimatedMinutes: 90,
            highYieldTopics: ["Osmosis & Staverman Reflection Coefficient", "Secondary Active Cotransport", "Feedback Control Systems"],
            competencies: ["PY1.1", "PY1.2"]
          },
          {
            id: "phys-c2",
            title: "Resting Membrane Potential & Action Potentials",
            description: "Goldman-Hodgkin-Katz voltage, Hodgkin-Huxley ionic gates, and refractory states.",
            estimatedMinutes: 110,
            highYieldTopics: ["Nernst Equilibrium Potential", "Na+ Channel Inactivation", "Saltatory Conduction"],
            competencies: ["PY1.3", "PY1.4"]
          }
        ]
      },
      {
        id: "phys-u2",
        title: "Cardiovascular Physiology",
        system: "CARDIOVASCULAR",
        chapters: [
          {
            id: "phys-c3",
            title: "Cardiac Cycle & Pressure-Volume Loops",
            description: "Suga-Sagawa time-varying elastance, Wiggers events, stroke work, and Frank-Starling mechanics.",
            estimatedMinutes: 120,
            highYieldTopics: ["Preload/Afterload/Inotropy PV Shifts", "Dicrotic Notch", "Valvular Heart Disease Murmurs"],
            competencies: ["PY5.1", "PY5.2", "PY5.3"]
          }
        ]
      },
      {
        id: "phys-u3",
        title: "Respiratory & Gas Exchange",
        system: "RESPIRATORY",
        chapters: [
          {
            id: "phys-c4",
            title: "Pulmonary Mechanics & V/Q Matching",
            description: "Alveolar gas equation, lung compliance, surfactant biophysics, and oxygen cascade diffusion.",
            estimatedMinutes: 105,
            highYieldTopics: ["Alveolar-Arterial (A-a) Gradient", "Law of Laplace", "V/Q Mismatch & Shunt"],
            competencies: ["PY6.1", "PY6.2"]
          }
        ]
      },
      {
        id: "phys-u4",
        title: "Renal & Acid-Base Physiology",
        system: "RENAL",
        chapters: [
          {
            id: "phys-c5",
            title: "Glomerular Filtration & Countercurrent Multiplication",
            description: "Starling net filtration pressure, autoregulation myogenic mechanism, clearance kinetics, and FeNa.",
            estimatedMinutes: 115,
            highYieldTopics: ["Inulin vs Creatinine GFR", "NKCC2 Loop Transport", "Tubuloglomerular Feedback"],
            competencies: ["PY7.1", "PY7.2"]
          },
          {
            id: "phys-c6",
            title: "Acid-Base Balance & Davenport Nomogram",
            description: "Henderson-Hasselbalch equations, Winter's formula compensation, and Anion Gap diagnostics.",
            estimatedMinutes: 100,
            highYieldTopics: ["High Anion Gap Metabolic Acidosis", "Davenport Buffer Slopes", "Delta Gap Dynamics"],
            competencies: ["PY7.3", "PY7.4"]
          }
        ]
      }
    ],
    keyCompetencies: [
      { code: "PY1.1", domain: "General Physiology", title: "Describe homeostatic control mechanisms and cell transport processes", level: "KNOWS_HOW", verticalIntegration: ["MED-301"], horizontalIntegration: ["BIOC-101"] },
      { code: "PY5.2", domain: "Cardiovascular", title: "Analyze Left Ventricular Pressure-Volume loops and Wiggers diagram", level: "SHOWS_HOW", verticalIntegration: ["MED-301", "SURG-301"] },
      { code: "PY6.2", domain: "Respiratory", title: "Calculate Alveolar-Arterial PO2 gradient and ventilation-perfusion ratios", level: "SHOWS_HOW", verticalIntegration: ["MED-301", "ANES-301"] },
      { code: "PY7.1", domain: "Renal Physiology", title: "Evaluate Glomerular Filtration Rate using Starling forces and clearance", level: "KNOWS_HOW", verticalIntegration: ["MED-301", "PHARM-201"] }
    ],
    recommendedTextbooks: ["Guyton and Hall Textbook of Medical Physiology (14th ed.)", "Costanzo Physiology (7th ed.)", "Ganong's Review of Medical Physiology (26th ed.)"]
  },

  {
    id: "subj-anatomy",
    code: "ANAT-101",
    title: "Human Anatomy & Histology",
    shortDescription: "Gross anatomical architecture, fascial planes, neurovascular bundles, and microscopic tissue histology.",
    phase: "PRE_CLINICAL",
    professionalYear: "1st Professional",
    primarySystem: "MUSCULOSKELETAL",
    colorTheme: {
      accent: "#ec4899",
      badgeBg: "rgba(236, 72, 153, 0.12)",
      badgeText: "#f472b6",
      border: "rgba(236, 72, 153, 0.3)"
    },
    icon: "🦴",
    has3DCanvas: true,
    hasSimulators: false,
    units: [
      {
        id: "anat-u1",
        title: "Upper & Lower Extremities",
        system: "MUSCULOSKELETAL",
        chapters: [
          {
            id: "anat-c1",
            title: "Brachial Plexus & Upper Limb Compartments",
            description: "Roots to terminal branches, Erb-Duchenne vs. Klumpke palsies, and cubital fossa boundaries.",
            estimatedMinutes: 120,
            highYieldTopics: ["Brachial Plexus C5-T1 Wiring", "Radial/Median/Ulnar Nerve Injuries", "Rotator Cuff Muscles"],
            competencies: ["AN10.1", "AN10.2"]
          }
        ]
      },
      {
        id: "anat-u2",
        title: "Thorax, Heart & Mediastinum",
        system: "CARDIOVASCULAR",
        chapters: [
          {
            id: "anat-c2",
            title: "Coronary Arteries & Cardiac Surfaces",
            description: "LAD, LCx, RCA territories, cardiac veins, fibrous skeleton, and pericardial reflections.",
            estimatedMinutes: 100,
            highYieldTopics: ["Coronary Dominance", "Transverse & Oblique Pericardial Sinuses", "Conducting System Topography"],
            competencies: ["AN22.1", "AN22.2"]
          }
        ]
      },
      {
        id: "anat-u3",
        title: "Head, Neck & Neuroanatomy",
        system: "NEUROLOGY",
        chapters: [
          {
            id: "anat-c3",
            title: "Circle of Willis & Cranial Nerve Foramina",
            description: "Cerebral arterial circle, berry aneurysms, cavernous sinus relations, and skull base exits.",
            estimatedMinutes: 130,
            highYieldTopics: ["Cranial Nerves I-XII Pathways", "Middle Meningeal Artery & Epidural Hematoma", "Brainstem Nuclei Topography"],
            competencies: ["AN30.1", "AN30.2"]
          }
        ]
      }
    ],
    keyCompetencies: [
      { code: "AN10.1", domain: "Upper Limb", title: "Describe anatomy and clinical lesions of Brachial Plexus", level: "KNOWS_HOW", verticalIntegration: ["ORTH-301", "SURG-301"] },
      { code: "AN22.1", domain: "Thorax", title: "Demonstrate coronary arterial anatomy and myocardial territories", level: "SHOWS_HOW", verticalIntegration: ["MED-301", "RAD-301"] }
    ],
    recommendedTextbooks: ["Gray's Anatomy for Students (4th ed.)", "Netter's Atlas of Human Anatomy (8th ed.)", "BD Chaurasia's Human Anatomy"]
  },

  {
    id: "subj-biochem",
    code: "BIOC-101",
    title: "Medical Biochemistry",
    shortDescription: "Molecular bioenergetics, metabolic pathways, enzymology, and clinical chemistry markers.",
    phase: "PRE_CLINICAL",
    professionalYear: "1st Professional",
    primarySystem: "GENERAL",
    colorTheme: {
      accent: "#10b981",
      badgeBg: "rgba(16, 185, 129, 0.12)",
      badgeText: "#34d399",
      border: "rgba(16, 185, 129, 0.3)"
    },
    icon: "🧪",
    has3DCanvas: false,
    hasSimulators: false,
    units: [
      {
        id: "bioc-u1",
        title: "Intermediary Carbohydrate & Lipid Metabolism",
        system: "GENERAL",
        chapters: [
          {
            id: "bioc-c1",
            title: "Glycolysis, Gluconeogenesis & Glycogen Storage",
            description: "Rate-limiting enzymes (PFK-1, FBPase-1), hormonal insulin/glucagon regulation, and inborn metabolic errors.",
            estimatedMinutes: 95,
            highYieldTopics: ["Von Gierke & Pompe Glycogenoses", "Pyruvate Dehydrogenase Deficiency", "Warburg Effect"],
            competencies: ["BI3.1", "BI3.2"]
          },
          {
            id: "bioc-c2",
            title: "Lipid Transport, Lipoproteins & Atherogenesis",
            description: "Chylomicrons, VLDL, LDL, HDL metabolism, familial hypercholesterolemias, and Apo-proteins.",
            estimatedMinutes: 85,
            highYieldTopics: ["ApoB-100 vs ApoE Receptors", "Statin HMG-CoA Reductase Inhibition", "Atherosclerotic Foam Cells"],
            competencies: ["BI4.1", "BI4.2"]
          }
        ]
      }
    ],
    keyCompetencies: [
      { code: "BI3.1", domain: "Carbohydrate Metabolism", title: "Explain enzymatic regulation of glycolysis and gluconeogenesis", level: "KNOWS_HOW", verticalIntegration: ["MED-301"] },
      { code: "BI4.1", domain: "Lipid Metabolism", title: "Analyze lipoprotein profiles and familial dyslipidemias", level: "KNOWS_HOW", verticalIntegration: ["MED-301", "PATH-201"] }
    ],
    recommendedTextbooks: ["Harper's Illustrated Biochemistry (32nd ed.)", "Lippincott Illustrated Reviews: Biochemistry (8th ed.)"]
  },

  // ==========================================
  // PARA-CLINICAL SUBJECTS (2nd Professional Year)
  // ==========================================
  {
    id: "subj-pathology",
    code: "PATH-201",
    title: "Pathology & Pathophysiology",
    shortDescription: "Cellular injury, hemodynamic disorders, neoplasia, inflammation, and organ-specific histopathology.",
    phase: "PARA_CLINICAL",
    professionalYear: "2nd Professional",
    primarySystem: "GENERAL",
    colorTheme: {
      accent: "#f59e0b",
      badgeBg: "rgba(245, 158, 11, 0.12)",
      badgeText: "#fbbf24",
      border: "rgba(245, 158, 11, 0.3)"
    },
    icon: "🔬",
    has3DCanvas: true,
    hasSimulators: false,
    units: [
      {
        id: "path-u1",
        title: "General Pathology & Neoplasia",
        system: "GENERAL",
        chapters: [
          {
            id: "path-c1",
            title: "Cell Injury, Necrosis & Apoptosis",
            description: "Coagulative/liquefactive/caseous necrosis, intrinsic vs extrinsic caspases, and free radical injury.",
            estimatedMinutes: 90,
            highYieldTopics: ["Ischemia-Reperfusion Injury", "p53 Guardian of Genome", "Dystrophic vs Metastatic Calcification"],
            competencies: ["PA1.1", "PA1.2"]
          },
          {
            id: "path-c2",
            title: "Carcinogenesis & Tumor Suppressors",
            description: "Hallmarks of cancer, oncogenes (RAS, MYC, HER2), and loss of heterozygosity (Rb, TP53, APC).",
            estimatedMinutes: 100,
            highYieldTopics: ["Knudson Two-Hit Hypothesis", "E-cadherin & Metastatic Cascade", "TNM Staging vs Grading"],
            competencies: ["PA8.1", "PA8.2"]
          }
        ]
      },
      {
        id: "path-u2",
        title: "Cardiopulmonary & Renal Pathology",
        system: "CARDIOVASCULAR",
        chapters: [
          {
            id: "path-c3",
            title: "Myocardial Infarction & Atherosclerosis Histology",
            description: "Temporal evolution of post-MI microscopic changes (0-4h wavy fibers to >2wk collagen scar) and complications.",
            estimatedMinutes: 110,
            highYieldTopics: ["Post-MI Rupture Timeline", "Dressler Syndrome", "Plaque Rupture Histopathology"],
            competencies: ["PA16.1", "PA16.2"]
          }
        ]
      }
    ],
    keyCompetencies: [
      { code: "PA1.1", domain: "Cell Injury", title: "Distinguish necrosis mechanisms and cellular adaptation patterns", level: "KNOWS_HOW", verticalIntegration: ["MED-301"] },
      { code: "PA16.2", domain: "Cardiovascular Pathology", title: "Identify histopathological stages of ischemic heart disease and infarction", level: "SHOWS_HOW", verticalIntegration: ["MED-301", "SURG-301"] }
    ],
    recommendedTextbooks: ["Robbins and Cotran Pathologic Basis of Disease (10th ed.)", "Pathoma: Fundamentals of Pathology"]
  },

  {
    id: "subj-microbiology",
    code: "MICR-201",
    title: "Medical Microbiology & Immunology",
    shortDescription: "Bacterial, viral, fungal, and parasitic pathogens, host defense mechanisms, and antimicrobial resistance.",
    phase: "PARA_CLINICAL",
    professionalYear: "2nd Professional",
    primarySystem: "IMMUNOLOGY",
    colorTheme: {
      accent: "#8b5cf6",
      badgeBg: "rgba(139, 92, 246, 0.12)",
      badgeText: "#a78bfa",
      border: "rgba(139, 92, 246, 0.3)"
    },
    icon: "🦠",
    has3DCanvas: false,
    hasSimulators: false,
    units: [
      {
        id: "micr-u1",
        title: "Immunology & Hypersensitivity",
        system: "IMMUNOLOGY",
        chapters: [
          {
            id: "micr-c1",
            title: "Innate & Adaptive Immune Responses",
            description: "MHC Class I & II antigen presentation, TCR/BCR somatic recombination, and cytokine networks.",
            estimatedMinutes: 85,
            highYieldTopics: ["Coombs Types I-IV Hypersensitivity", "Complement Activation Cascades", "Th1 vs Th2/Th17 Subsets"],
            competencies: ["MI1.1", "MI1.2"]
          }
        ]
      },
      {
        id: "micr-u2",
        title: "Systemic Bacteriology & Virology",
        system: "IMMUNOLOGY",
        chapters: [
          {
            id: "micr-c2",
            title: "Gram-Positive Cocci & Endotoxins/Exotoxins",
            description: "Staph vs Strep virulence factors, superantigens (TSST-1), beta-lactamase resistance, and Lancefield grouping.",
            estimatedMinutes: 95,
            highYieldTopics: ["MRSA PBP2a Mutation", "Streptococcus Pyogenes M-Protein", "Clostridial Neurotoxins"],
            competencies: ["MI2.1", "MI2.2"]
          }
        ]
      }
    ],
    keyCompetencies: [
      { code: "MI1.1", domain: "Immunology", title: "Categorize hypersensitivity reactions and autoimmune etiologies", level: "KNOWS_HOW", verticalIntegration: ["MED-301", "DERM-301"] },
      { code: "MI2.1", domain: "Bacteriology", title: "Demonstrate diagnostic bacteriology workflows and antibiotic susceptibility", level: "SHOWS_HOW", verticalIntegration: ["MED-301", "PHARM-201"] }
    ],
    recommendedTextbooks: ["Jawetz, Melnick, & Adelberg's Medical Microbiology (28th ed.)", "Levinson's Review of Medical Microbiology & Immunology"]
  },

  {
    id: "subj-pharmacology",
    code: "PHARM-201",
    title: "Pharmacology & Therapeutics",
    shortDescription: "Pharmacokinetics (ADME), receptor dynamics, autonomic drugs, antimicrobial regimens, and toxicology.",
    phase: "PARA_CLINICAL",
    professionalYear: "2nd Professional",
    primarySystem: "GENERAL",
    colorTheme: {
      accent: "#06b6d4",
      badgeBg: "rgba(6, 182, 212, 0.12)",
      badgeText: "#22d3ee",
      border: "rgba(6, 182, 212, 0.3)"
    },
    icon: "💊",
    has3DCanvas: false,
    hasSimulators: true,
    units: [
      {
        id: "pharm-u1",
        title: "General Pharmacokinetics & Autonomics",
        system: "GENERAL",
        chapters: [
          {
            id: "pharm-c1",
            title: "Pharmacokinetics: Clearance & Volume of Distribution",
            description: "First-order vs zero-order kinetics, loading/maintenance dose formulas, CYP450 inducers and inhibitors.",
            estimatedMinutes: 90,
            highYieldTopics: ["Half-life (t1/2) Calculation", "Steady State Concentration (Css)", "Therapeutic Window & Index"],
            competencies: ["PH1.1", "PH1.2"]
          },
          {
            id: "pharm-c2",
            title: "Autonomic Nervous System Drugs",
            description: "Adrenergic alpha/beta agonists and antagonists, cholinergic muscarinic agonists and anticholinergics.",
            estimatedMinutes: 100,
            highYieldTopics: ["Beta-Blocker Cardioselectivity", "Atropine Toxicity & Organophosphates", "Epinephrine Reversal Effect"],
            competencies: ["PH1.3", "PH1.4"]
          }
        ]
      },
      {
        id: "pharm-u2",
        title: "Cardiovascular & Renal Pharmacology",
        system: "CARDIOVASCULAR",
        chapters: [
          {
            id: "pharm-c3",
            title: "Antihypertensives, Antiarrhythmics & Diuretics",
            description: "Vaughan-Williams classes I-IV, ACE inhibitors/ARBs, loop and thiazide diuretics, and digoxin.",
            estimatedMinutes: 110,
            highYieldTopics: ["Vaughan Williams Class III Potassium Blockers", "Furosemide Ototoxicity/Hypokalemia", "Digoxin NCX Toxicity"],
            competencies: ["PH2.1", "PH2.2"]
          }
        ]
      }
    ],
    keyCompetencies: [
      { code: "PH1.1", domain: "General Pharmacology", title: "Calculate pharmacokinetic parameters (Vd, Cl, t1/2, Loading Dose)", level: "SHOWS_HOW", verticalIntegration: ["MED-301", "ANES-301"] },
      { code: "PH2.1", domain: "Cardiovascular", title: "Rationalize drug selections for hypertension, heart failure, and dysrhythmias", level: "KNOWS_HOW", verticalIntegration: ["MED-301"] }
    ],
    recommendedTextbooks: ["Katzung's Basic & Clinical Pharmacology (15th ed.)", "Goodman & Gilman's The Pharmacological Basis of Therapeutics (14th ed.)"]
  },

  {
    id: "subj-fmt",
    code: "FOR-201",
    title: "Forensic Medicine & Toxicology",
    shortDescription: "Medicolegal investigations, autopsy procedures, mechanical trauma, toxicology, and medical jurisprudence.",
    phase: "PARA_CLINICAL",
    professionalYear: "2nd Professional",
    primarySystem: "PUBLIC_HEALTH",
    colorTheme: {
      accent: "#a855f7",
      badgeBg: "rgba(168, 85, 247, 0.12)",
      badgeText: "#c084fc",
      border: "rgba(168, 85, 247, 0.3)"
    },
    icon: "⚖️",
    has3DCanvas: false,
    hasSimulators: false,
    units: [
      {
        id: "for-u1",
        title: "Medicolegal Autopsy & Traumatology",
        system: "PUBLIC_HEALTH",
        chapters: [
          {
            id: "for-c1",
            title: "Postmortem Changes & Time Since Death",
            description: "Algor, rigor, livor mortis, putrefaction stages, and entomological estimation.",
            estimatedMinutes: 75,
            highYieldTopics: ["Rigor Mortis Progression & Resolution", "Hypostasis vs Bruise", "Adipocere & Mummification"],
            competencies: ["FM2.1", "FM2.2"]
          }
        ]
      }
    ],
    keyCompetencies: [
      { code: "FM2.1", domain: "Thanatology", title: "Estimate postmortem interval from early and late postmortem changes", level: "KNOWS_HOW", verticalIntegration: ["PATH-201"] }
    ],
    recommendedTextbooks: ["Reddy's Essentials of Forensic Medicine and Toxicology", "Knight's Forensic Pathology"]
  },

  {
    id: "subj-psm",
    code: "COMM-201",
    title: "Community Medicine & Public Health",
    shortDescription: "Epidemiology, biostatistics, maternal-child health, communicable disease surveillance, and healthcare policy.",
    phase: "PARA_CLINICAL",
    professionalYear: "3rd Professional I",
    primarySystem: "PUBLIC_HEALTH",
    colorTheme: {
      accent: "#14b8a6",
      badgeBg: "rgba(20, 184, 166, 0.12)",
      badgeText: "#2dd4bf",
      border: "rgba(20, 184, 166, 0.3)"
    },
    icon: "🌐",
    has3DCanvas: false,
    hasSimulators: false,
    units: [
      {
        id: "comm-u1",
        title: "Epidemiology & Biostatistics",
        system: "PUBLIC_HEALTH",
        chapters: [
          {
            id: "comm-c1",
            title: "Study Designs, Incidence & Relative Risk",
            description: "Cohort vs case-control studies, RCTs, Odds Ratio, Relative Risk, NNT, and confounding bias.",
            estimatedMinutes: 85,
            highYieldTopics: ["Sensitivity & Specificity / Predictive Values", "Odds Ratio vs Relative Risk", "Confounding vs Effect Modification"],
            competencies: ["CM2.1", "CM2.2"]
          }
        ]
      }
    ],
    keyCompetencies: [
      { code: "CM2.1", domain: "Epidemiology", title: "Design epidemiological studies and compute statistical risk metrics", level: "SHOWS_HOW", verticalIntegration: ["MED-301"] }
    ],
    recommendedTextbooks: ["Park's Textbook of Preventive and Social Medicine (27th ed.)", "Gordis Epidemiology (6th ed.)"]
  },

  // ==========================================
  // CLINICAL SUBJECTS (3rd & Final Professional Years)
  // ==========================================
  {
    id: "subj-medicine",
    code: "MED-301",
    title: "General Medicine",
    shortDescription: "Comprehensive internal medicine: cardiology, pulmonology, nephrology, neurology, gastroenterology, and endocrinology.",
    phase: "CLINICAL",
    professionalYear: "Final Professional II",
    primarySystem: "GENERAL",
    colorTheme: {
      accent: "#2563eb",
      badgeBg: "rgba(37, 99, 235, 0.12)",
      badgeText: "#3b82f6",
      border: "rgba(37, 99, 235, 0.3)"
    },
    icon: "🩺",
    has3DCanvas: true,
    hasSimulators: true,
    defaultSimulatorRoute: "/simulators/cardiac-cycle",
    units: [
      {
        id: "med-u1",
        title: "Cardiology & Vascular Medicine",
        system: "CARDIOVASCULAR",
        chapters: [
          {
            id: "med-c1",
            title: "Acute Coronary Syndromes & Heart Failure",
            description: "STEMI vs NSTEMI guidelines, Killip classification, HFrEF vs HFpEF GDMT therapy (ARNI, SGLT2i, MRA, Beta-blockers).",
            estimatedMinutes: 130,
            highYieldTopics: ["12-Lead ECG STEMI Localization", "GDMT 4-Pillar Heart Failure Protocol", "Cardiogenic Shock Hemodynamics"],
            competencies: ["IM1.1", "IM1.2"]
          }
        ]
      },
      {
        id: "med-u2",
        title: "Endocrinology & Metabolism",
        system: "ENDOCRINE",
        chapters: [
          {
            id: "med-c2",
            title: "Diabetes Mellitus & Diabetic Ketoacidosis",
            description: "Glycemic targets, insulin regimens, DKA fluid resuscitation, potassium replacement, and hyperosmolar hyperglycemic state.",
            estimatedMinutes: 110,
            highYieldTopics: ["DKA Anion Gap Resolution Criteria", "Continuous IV Insulin Protocol", "Microvascular vs Macrovascular Complications"],
            competencies: ["IM8.1", "IM8.2"]
          }
        ]
      }
    ],
    keyCompetencies: [
      { code: "IM1.1", domain: "Cardiology", title: "Evaluate and manage Acute Coronary Syndromes and cardiogenic shock", level: "PERFORMS", horizontalIntegration: ["PHYS-101", "PHARM-201"] },
      { code: "IM8.1", domain: "Endocrinology", title: "Diagnose and manage Diabetic Ketoacidosis with electrolyte correction", level: "PERFORMS", horizontalIntegration: ["PHYS-101", "BIOC-101"] }
    ],
    recommendedTextbooks: ["Harrison's Principles of Internal Medicine (21st ed.)", "Davidson's Principles and Practice of Medicine (24th ed.)"]
  },

  {
    id: "subj-surgery",
    code: "SURG-301",
    title: "General Surgery",
    shortDescription: "Surgical oncology, trauma resuscitation, acute abdomen, wound healing, minimally invasive laparoscopic surgery.",
    phase: "CLINICAL",
    professionalYear: "Final Professional II",
    primarySystem: "GASTROINTESTINAL",
    colorTheme: {
      accent: "#dc2626",
      badgeBg: "rgba(220, 38, 38, 0.12)",
      badgeText: "#f87171",
      border: "rgba(220, 38, 38, 0.3)"
    },
    icon: "🔪",
    has3DCanvas: true,
    hasSimulators: false,
    units: [
      {
        id: "surg-u1",
        title: "Acute Abdomen & GI Surgery",
        system: "GASTROINTESTINAL",
        chapters: [
          {
            id: "surg-c1",
            title: "Acute Appendicitis, Cholecystitis & Intestinal Obstruction",
            description: "Alvarado score, laparoscopic vs open appendectomy, Calot's triangle anatomy, and strangulated bowel management.",
            estimatedMinutes: 120,
            highYieldTopics: ["Calot's Triangle Dissection", "Small vs Large Bowel Obstruction Radiographs", "Peritonitis Resuscitation"],
            competencies: ["SU14.1", "SU14.2"]
          }
        ]
      }
    ],
    keyCompetencies: [
      { code: "SU14.1", domain: "Acute Abdomen", title: "Diagnose surgical acute abdomen and indicate emergency laparotomy", level: "PERFORMS", horizontalIntegration: ["ANAT-101", "PATH-201"] }
    ],
    recommendedTextbooks: ["Bailey & Love's Short Practice of Surgery (28th ed.)", "Schwartz's Principles of Surgery (11th ed.)"]
  },

  {
    id: "subj-obgyn",
    code: "OBG-301",
    title: "Obstetrics & Gynaecology",
    shortDescription: "Maternal-fetal physiology, labor mechanics, obstetric emergencies, reproductive oncology, and infertility.",
    phase: "CLINICAL",
    professionalYear: "Final Professional II",
    primarySystem: "REPRODUCTIVE",
    colorTheme: {
      accent: "#db2777",
      badgeBg: "rgba(219, 39, 119, 0.12)",
      badgeText: "#f472b6",
      border: "rgba(219, 39, 119, 0.3)"
    },
    icon: "🤰",
    has3DCanvas: true,
    hasSimulators: false,
    units: [
      {
        id: "obg-u1",
        title: "Obstetrics & Parturition",
        system: "REPRODUCTIVE",
        chapters: [
          {
            id: "obg-c1",
            title: "Normal Labor Mechanics & Partogram",
            description: "Cardinal movements of labor (engagement, descent, flexion, internal rotation, extension, restitution, external rotation), WHO partogram.",
            estimatedMinutes: 110,
            highYieldTopics: ["Seven Cardinal Movements of Labor", "Postpartum Hemorrhage 4Ts Protocol", "Preeclampsia Magnesium Sulfate"],
            competencies: ["OG8.1", "OG8.2"]
          }
        ]
      }
    ],
    keyCompetencies: [
      { code: "OG8.1", domain: "Obstetrics", title: "Conduct normal labor, monitor partogram, and manage active 3rd stage", level: "PERFORMS", horizontalIntegration: ["ANAT-101", "PHYS-101"] }
    ],
    recommendedTextbooks: ["Williams Obstetrics (26th ed.)", "DC Dutta's Textbook of Obstetrics"]
  },

  {
    id: "subj-pediatrics",
    code: "PED-301",
    title: "Pediatrics & Neonatology",
    shortDescription: "Child growth & milestones, neonatal resuscitation (NRP), congenital defects, pediatric emergencies, and immunization.",
    phase: "CLINICAL",
    professionalYear: "Final Professional II",
    primarySystem: "GENERAL",
    colorTheme: {
      accent: "#f97316",
      badgeBg: "rgba(249, 115, 22, 0.12)",
      badgeText: "#fb923c",
      border: "rgba(249, 115, 22, 0.3)"
    },
    icon: "👶",
    has3DCanvas: false,
    hasSimulators: false,
    units: [
      {
        id: "ped-u1",
        title: "Developmental Milestones & Neonatology",
        system: "GENERAL",
        chapters: [
          {
            id: "ped-c1",
            title: "Developmental Milestones & Neonatal Jaundice",
            description: "Gross motor, fine motor, language, social milestones, physiological vs pathological unconjugated hyperbilirubinemia.",
            estimatedMinutes: 95,
            highYieldTopics: ["Red Flags in Developmental Milestones", "Phototherapy & Exchange Transfusion Indications", "Biliary Atresia vs Breast Milk Jaundice"],
            competencies: ["PE1.1", "PE1.2"]
          }
        ]
      }
    ],
    keyCompetencies: [
      { code: "PE1.1", domain: "Growth & Development", title: "Assess developmental milestones and detect developmental delay", level: "SHOWS_HOW", horizontalIntegration: ["PHYS-101"] }
    ],
    recommendedTextbooks: ["Nelson Textbook of Pediatrics (21st ed.)", "Ghai Essential Pediatrics (10th ed.)"]
  },

  {
    id: "subj-orthopedics",
    code: "ORTH-301",
    title: "Orthopedics & Traumatology",
    shortDescription: "Fractures and dislocations, joint replacements, pediatric orthopedics, bone tumors, and spine pathology.",
    phase: "CLINICAL",
    professionalYear: "Final Professional II",
    primarySystem: "MUSCULOSKELETAL",
    colorTheme: {
      accent: "#84cc16",
      badgeBg: "rgba(132, 204, 22, 0.12)",
      badgeText: "#a3e635",
      border: "rgba(132, 204, 22, 0.3)"
    },
    icon: "🦿",
    has3DCanvas: true,
    hasSimulators: false,
    units: [
      {
        id: "orth-u1",
        title: "Trauma & Fracture Management",
        system: "MUSCULOSKELETAL",
        chapters: [
          {
            id: "orth-c1",
            title: "Fractures of Long Bones & Compartment Syndrome",
            description: "ATLS principles, Gustilo-Anderson open fracture classification, 6 Ps of acute compartment syndrome, and emergent fasciotomy.",
            estimatedMinutes: 90,
            highYieldTopics: ["Acute Compartment Syndrome Delta Pressure", "Femoral Neck Fractures & Avascular Necrosis", "Colles vs Smith Fracture"],
            competencies: ["OR1.1", "OR1.2"]
          }
        ]
      }
    ],
    keyCompetencies: [
      { code: "OR1.1", domain: "Traumatology", title: "Evaluate extremity trauma, splint fractures, and diagnose compartment syndrome", level: "PERFORMS", horizontalIntegration: ["ANAT-101", "SURG-301"] }
    ],
    recommendedTextbooks: ["Apley & Solomon's System of Orthopaedics and Trauma (10th ed.)", "Maheshwari's Essential Orthopaedics"]
  },

  {
    id: "subj-ophthalmology",
    code: "OPHTH-301",
    title: "Ophthalmology",
    shortDescription: "Ocular anatomy, visual optics, cataract, glaucoma, retinal diseases, and neuro-ophthalmology.",
    phase: "CLINICAL",
    professionalYear: "3rd Professional I",
    primarySystem: "NEUROLOGY",
    colorTheme: {
      accent: "#38bdf8",
      badgeBg: "rgba(56, 189, 248, 0.12)",
      badgeText: "#7dd3fc",
      border: "rgba(56, 189, 248, 0.3)"
    },
    icon: "👁️",
    has3DCanvas: true,
    hasSimulators: false,
    units: [
      {
        id: "ophth-u1",
        title: "Anterior Segment & Glaucoma",
        system: "NEUROLOGY",
        chapters: [
          {
            id: "ophth-c1",
            title: "Cataract Surgery & Open/Closed-Angle Glaucoma",
            description: "Phacoemulsification, aqueous humor dynamics, Trabecular meshwork outflow, tonometry, and visual field defect patterns.",
            estimatedMinutes: 80,
            highYieldTopics: ["Acute Angle-Closure Glaucoma Triad", "Cup-to-Disc Ratio Progression", "Senile Cataract Morphologies"],
            competencies: ["OP1.1", "OP1.2"]
          }
        ]
      }
    ],
    keyCompetencies: [
      { code: "OP1.1", domain: "Visual System", title: "Examine anterior segment with slit lamp and assess visual acuity", level: "SHOWS_HOW", horizontalIntegration: ["ANAT-101", "PHYS-101"] }
    ],
    recommendedTextbooks: ["Kanski's Clinical Ophthalmology: A Systematic Approach (9th ed.)", "Khurana's Comprehensive Ophthalmology"]
  },

  {
    id: "subj-ent",
    code: "ENT-301",
    title: "Otorhinolaryngology (ENT)",
    shortDescription: "Diseases of ear, nose, throat, paranasal sinuses, audiometry, and head & neck oncology.",
    phase: "CLINICAL",
    professionalYear: "3rd Professional I",
    primarySystem: "NEUROLOGY",
    colorTheme: {
      accent: "#eab308",
      badgeBg: "rgba(234, 179, 8, 0.12)",
      badgeText: "#facc15",
      border: "rgba(234, 179, 8, 0.3)"
    },
    icon: "👂",
    has3DCanvas: true,
    hasSimulators: false,
    units: [
      {
        id: "ent-u1",
        title: "Otology & Hearing Mechanics",
        system: "NEUROLOGY",
        chapters: [
          {
            id: "ent-c1",
            title: "Otitis Media, Cholesteatoma & Pure Tone Audiometry",
            description: "Conductive vs sensorineural hearing loss, Rinne & Weber tuning fork tests, and tympanomastoidectomy.",
            estimatedMinutes: 80,
            highYieldTopics: ["Rinne & Weber Tuning Fork Interpretation", "CSOM Safe vs Unsafe Atticoantral Disease", "BPPV & Epley Maneuver"],
            competencies: ["EN1.1", "EN1.2"]
          }
        ]
      }
    ],
    keyCompetencies: [
      { code: "EN1.1", domain: "Otology", title: "Perform otoscopy, interpret audiograms, and execute tuning fork tests", level: "PERFORMS", horizontalIntegration: ["ANAT-101", "PHYS-101"] }
    ],
    recommendedTextbooks: ["Dhingra's Diseases of Ear, Nose and Throat (8th ed.)", "Scott-Brown's Otorhinolaryngology"]
  },

  {
    id: "subj-dermatology",
    code: "DERM-301",
    title: "Dermatology & Venereology",
    shortDescription: "Primary skin lesions, autoimmune bullous diseases, papulosquamous eruptions, and sexually transmitted infections.",
    phase: "CLINICAL",
    professionalYear: "Final Professional II",
    primarySystem: "INTEGUMENTARY",
    colorTheme: {
      accent: "#fb7185",
      badgeBg: "rgba(251, 113, 133, 0.12)",
      badgeText: "#fda4af",
      border: "rgba(251, 113, 133, 0.3)"
    },
    icon: "🧴",
    has3DCanvas: false,
    hasSimulators: false,
    units: [
      {
        id: "derm-u1",
        title: "Papulosquamous & Bullous Dermatoses",
        system: "INTEGUMENTARY",
        chapters: [
          {
            id: "derm-c1",
            title: "Psoriasis, Pemphigus Vulgaris & Bullous Pemphigoid",
            description: "Auspitz sign, desmoglein-3 vs BP180/BP230 autoantibodies, intraepidermal vs subepidermal split on biopsy.",
            estimatedMinutes: 75,
            highYieldTopics: ["Nikolsky Sign in Pemphigus vs Pemphigoid", "Psoriasis Plaque Histology", "Erythema Multiforme vs SJS/TEN"],
            competencies: ["DR1.1", "DR1.2"]
          }
        ]
      }
    ],
    keyCompetencies: [
      { code: "DR1.1", domain: "Dermatology", title: "Classify primary cutaneous morphology and diagnose immunobullous dermatoses", level: "SHOWS_HOW", horizontalIntegration: ["PATH-201", "MICR-201"] }
    ],
    recommendedTextbooks: ["Fitzpatrick's Dermatology in General Medicine", "Rook's Textbook of Dermatology"]
  },

  {
    id: "subj-psychiatry",
    code: "PSYCH-301",
    title: "Psychiatry & Behavioral Health",
    shortDescription: "Psychopathology, mood disorders, schizophrenia, substance dependence, psychopharmacology, and psychometrics.",
    phase: "CLINICAL",
    professionalYear: "Final Professional II",
    primarySystem: "NEUROLOGY",
    colorTheme: {
      accent: "#a78bfa",
      badgeBg: "rgba(167, 139, 250, 0.12)",
      badgeText: "#c4b5fd",
      border: "rgba(167, 139, 250, 0.3)"
    },
    icon: "🧠",
    has3DCanvas: false,
    hasSimulators: false,
    units: [
      {
        id: "psych-u1",
        title: "Psychoses & Affective Disorders",
        system: "NEUROLOGY",
        chapters: [
          {
            id: "psych-c1",
            title: "Major Depressive Disorder, Bipolar I & Schizophrenia",
            description: "DSM-5 criteria, positive vs negative symptoms, lithium/antipsychotic monitoring, and suicide risk stratification.",
            estimatedMinutes: 85,
            highYieldTopics: ["Extrapyramidal Symptoms & Neuroleptic Malignant Syndrome", "Lithium Toxicity Signs", "Serotonin Syndrome vs NMS"],
            competencies: ["PS1.1", "PS1.2"]
          }
        ]
      }
    ],
    keyCompetencies: [
      { code: "PS1.1", domain: "Psychiatry", title: "Conduct Mental State Examination (MSE) and evaluate suicide risk", level: "PERFORMS", horizontalIntegration: ["PHYS-101", "PHARM-201"] }
    ],
    recommendedTextbooks: ["Kaplan & Sadock's Synopsis of Psychiatry (12th ed.)", "Ahuja's A Short Textbook of Psychiatry"]
  },

  {
    id: "subj-radiology",
    code: "RAD-301",
    title: "Radiodiagnosis & Imaging",
    shortDescription: "Chest X-Ray interpretation, emergency CT/MRI physics, ultrasound ergonomics, and radiation safety.",
    phase: "CLINICAL",
    professionalYear: "Final Professional II",
    primarySystem: "GENERAL",
    colorTheme: {
      accent: "#6366f1",
      badgeBg: "rgba(99, 102, 241, 0.12)",
      badgeText: "#818cf8",
      border: "rgba(99, 102, 241, 0.3)"
    },
    icon: "☢️",
    has3DCanvas: true,
    hasSimulators: false,
    units: [
      {
        id: "rad-u1",
        title: "Emergency Diagnostic Imaging",
        system: "GENERAL",
        chapters: [
          {
            id: "rad-c1",
            title: "Systematic Chest Radiograph & Non-Contrast Head CT",
            description: "ABCDE approach to CXR, silhouette sign, acute ischemic stroke hyperdense MCA sign, and intracranial hemorrhage patterns.",
            estimatedMinutes: 90,
            highYieldTopics: ["Epidural vs Subdural vs SAH on CT", "Silhouette Sign Localization", "Pneumothorax vs Tension Pneumothorax on CXR"],
            competencies: ["RD1.1", "RD1.2"]
          }
        ]
      }
    ],
    keyCompetencies: [
      { code: "RD1.1", domain: "Diagnostic Radiology", title: "Interpret emergency chest radiographs and acute head CT scans", level: "SHOWS_HOW", horizontalIntegration: ["ANAT-101", "MED-301"] }
    ],
    recommendedTextbooks: ["Squire's Fundamentals of Radiology", "Felson's Principles of Chest Roentgenology"]
  },

  {
    id: "subj-anesthesia",
    code: "ANES-301",
    title: "Anesthesiology & Critical Care",
    shortDescription: "General/regional anesthesia, endotracheal intubation, mechanical ventilation, shock resuscitation, and ICU monitoring.",
    phase: "CLINICAL",
    professionalYear: "Final Professional II",
    primarySystem: "RESPIRATORY",
    colorTheme: {
      accent: "#0284c7",
      badgeBg: "rgba(2, 132, 199, 0.12)",
      badgeText: "#38bdf8",
      border: "rgba(2, 132, 199, 0.3)"
    },
    icon: "💨",
    has3DCanvas: true,
    hasSimulators: true,
    defaultSimulatorRoute: "/simulators/respiratory-vq",
    units: [
      {
        id: "anes-u1",
        title: "Airway Management & Mechanical Ventilation",
        system: "RESPIRATORY",
        chapters: [
          {
            id: "anes-c1",
            title: "Difficult Airway Algorithm & Ventilator Waveforms",
            description: "Mallampati scoring, rapid sequence induction, PEEP titration, driving pressure, and ARDS ventilation protocols.",
            estimatedMinutes: 95,
            highYieldTopics: ["Mallampati Class I-IV Airway Scoring", "ARDSNet Low Tidal Volume Protocol", "Capnography Waveform Analysis"],
            competencies: ["AS1.1", "AS1.2"]
          }
        ]
      }
    ],
    keyCompetencies: [
      { code: "AS1.1", domain: "Airway & Resuscitation", title: "Perform bag-valve-mask ventilation, endotracheal intubation, and CPR", level: "PERFORMS", horizontalIntegration: ["PHYS-101", "PHARM-201"] }
    ],
    recommendedTextbooks: ["Miller's Anesthesia (9th ed.)", "Morgan & Mikhail's Clinical Anesthesiology (7th ed.)"]
  },

  // ==========================================
  // TRANSVERSAL & LONGITUDINAL MODULES
  // ==========================================
  {
    id: "subj-aetcom",
    code: "AETCOM-001",
    title: "AETCOM & Medical Ethics",
    shortDescription: "Attitude, Ethics, Communication, Informed Consent, Doctor-Patient Relationship, and Medicolegal Autonomy.",
    phase: "TRANSVERSAL",
    professionalYear: "Longitudinal",
    primarySystem: "GENERAL",
    colorTheme: {
      accent: "#e11d48",
      badgeBg: "rgba(225, 29, 72, 0.12)",
      badgeText: "#fb7185",
      border: "rgba(225, 29, 72, 0.3)"
    },
    icon: "🤝",
    has3DCanvas: false,
    hasSimulators: false,
    units: [
      {
        id: "aet-u1",
        title: "Bioethics & Doctor-Patient Communication",
        system: "GENERAL",
        chapters: [
          {
            id: "aet-c1",
            title: "Informed Consent, Confidentiality & Breaking Bad News",
            description: "SPIKES protocol for breaking bad news, Beauchamp & Childress 4 principles (Autonomy, Beneficence, Non-maleficence, Justice).",
            estimatedMinutes: 80,
            highYieldTopics: ["SPIKES 6-Step Protocol", "Therapeutic Privilege & Implied Consent", "Medical Negligence & Bolam Test"],
            competencies: ["AT1.1", "AT1.2"]
          }
        ]
      }
    ],
    keyCompetencies: [
      { code: "AT1.1", domain: "Communication", title: "Demonstrate empathetic communication and apply SPIKES protocol", level: "PERFORMS", horizontalIntegration: ["MED-301", "SURG-301"] }
    ],
    recommendedTextbooks: ["NMC AETCOM Competency Modules", "Medical Ethics by Beauchamp and Childress"]
  }
];

export function getSubjectsByPhase(phase: MedicalPhase): MedicalSubject[] {
  return MEDICAL_CURRICULUM_SCAFFOLD.filter(s => s.phase === phase);
}

export function getSubjectsBySystem(system: OrganSystemCategory): MedicalSubject[] {
  return MEDICAL_CURRICULUM_SCAFFOLD.filter(
    s => s.primarySystem === system || s.units.some(u => u.system === system)
  );
}

export function getSubjectById(idOrCode: string): MedicalSubject | undefined {
  return MEDICAL_CURRICULUM_SCAFFOLD.find(
    s => s.id === idOrCode || s.code.toLowerCase() === idOrCode.toLowerCase()
  );
}
