export interface BPharmLesson {
  id: string;
  title: string;
  pciCode: string;
  hasSimulation: boolean;
  description: string;
}

export interface BPharmSubject {
  id: string;
  name: string;
  code: string;
  year: number;
  creditHours: number;
  description: string;
  lessons: BPharmLesson[];
}

export interface BPharmYear {
  year: number;
  title: string;
  description: string;
  subjects: BPharmSubject[];
}

export const BPHARM_CURRICULUM: BPharmYear[] = [
  {
    year: 1,
    title: 'Year 1: Pharmaceutical Foundation Sciences',
    description: 'Inorganic/organic chemistry, pharmaceutical mathematics, and introductory pharmacognosy as per PCI B.Pharm curriculum.',
    subjects: [
      {
        id: 'b101',
        name: 'Pharmaceutical Chemistry-I (Inorganic)',
        code: 'BPC-101',
        year: 1,
        creditHours: 4,
        description: 'Inorganic pharmaceutical chemistry covering acid-base theory, radioactivity, and official inorganic compounds used therapeutically.',
        lessons: [
          { id: 'bl-101-1', title: 'Acid-Base Theory, Buffers & pH in Pharmacy', pciCode: '1.1.1', hasSimulation: false, description: 'Henderson-Hasselbalch equation, buffer capacity calculations, and pharmaceutical applications of buffered solutions (IV fluids, eye drops, nasal sprays).' },
          { id: 'bl-101-2', title: 'Limit Tests for Heavy Metals & Impurities', pciCode: '1.1.2', hasSimulation: false, description: 'Official IP/BP limit tests for Arsenic (Marsh test, Gutzeit apparatus), Lead (Dithizone), Iron, Chlorides, and Sulfates in pharmaceutical substances.' },
          { id: 'bl-101-3', title: 'Radiopharmaceuticals — Production, Quality Control & Therapeutic Applications', pciCode: '1.1.3', hasSimulation: false, description: 'Nuclear reactor and cyclotron production of radioisotopes (Tc-99m, I-131), radiation detection Geiger-Muller counter, radiation safety, and clinical applications in diagnostic imaging and radioiodine therapy.' },
          { id: 'bl-101-4', title: 'Major Intravenous Electrolytes & Gastrointestinal Agents', pciCode: '1.1.4', hasSimulation: false, description: 'Sodium Chloride, Ringer\'s Lactate, Potassium Chloride preparations; antacids (aluminium hydroxide gel, magnesium trisilicate), and saline cathartics mechanism of action.' }
        ]
      },
      {
        id: 'b102',
        name: 'Pharmaceutics-I (Physical Pharmacy)',
        code: 'BPC-102',
        year: 1,
        creditHours: 4,
        description: 'Physicochemical principles fundamental to pharmaceutical formulation — solubility, diffusion, and surface phenomena.',
        lessons: [
          { id: 'bl-102-1', title: 'States of Matter, Phase Equilibria & Phase Rule', pciCode: '1.2.1', hasSimulation: true, description: 'Gibbs Phase Rule (F = C - P + 2), one-component systems (water phase diagram), two-component systems (Tin-Lead eutectic), and critical phenomena relevant to pharmaceutical processing.' },
          { id: 'bl-102-2', title: 'Solubility & Distribution Phenomena', pciCode: '1.2.2', hasSimulation: true, description: 'Ideal vs non-ideal solutions, Raoult\'s law, Nernst distribution law, solubility in mixed solvents (co-solvency), and pH-solubility profiles for weak acid/base drugs.' },
          { id: 'bl-102-3', title: 'Surface & Interfacial Phenomena — Surfactants & HLB', pciCode: '1.2.3', hasSimulation: false, description: 'Surface tension (du Noüy ring method), spreading and wetting coefficients, surfactant CMC, HLB system for emulsifier selection (Griffin method), and pharmaceutical emulsion stability.' },
          { id: 'bl-102-4', title: 'Complex Formation & Drug Protein Binding', pciCode: '1.2.4', hasSimulation: false, description: 'Chelation (EDTA complexes in heavy metal poisoning), inclusion complexes (beta-cyclodextrin drug solubilization), and plasma protein binding implications for drug distribution and interactions.' }
        ]
      },
      {
        id: 'b103',
        name: 'Pharmacognosy-I',
        code: 'BPC-103',
        year: 1,
        creditHours: 4,
        description: 'Biological sources, cultivation, collection, and preliminary evaluation of crude drugs of plant, animal, and mineral origin.',
        lessons: [
          { id: 'bl-103-1', title: 'Introduction to Pharmacognosy — History, Scope & Adulteration', pciCode: '1.3.1', hasSimulation: false, description: 'Evolution of pharmacognosy from Dioscorides\' De Materia Medica to modern phytochemistry, types of adulteration (substitution, sophistication, deterioration), and WHO guidelines on quality control of herbal medicines.' },
          { id: 'bl-103-2', title: 'Crude Drug Classification & Pharmacognostic Evaluation', pciCode: '1.3.2', hasSimulation: false, description: 'Morphological, sensory (organoleptic), microscopic (powder microscopy, T.S. characters), and chemical evaluation methods; moisture content, ash value, extractive value, and foreign matter determination.' },
          { id: 'bl-103-3', title: 'Carbohydrate Drugs — Starches, Gums & Mucilages', pciCode: '1.3.3', hasSimulation: false, description: 'Starch (Amylum) from wheat/rice/maize — pharmacopoeial standards, guar gum, acacia, tragacanth, agar — structure, properties, pharmaceutical applications as binders, disintegrants, and suspending agents.' },
          { id: 'bl-103-4', title: 'Lipid Drugs — Fixed Oils, Fats & Waxes', pciCode: '1.3.4', hasSimulation: false, description: 'Castor oil, olive oil, cod liver oil — fatty acid composition and therapeutic uses; beeswax, carnauba wax, lanolin — pharmaceutical applications in topical formulations and suppository bases.' }
        ]
      }
    ]
  },
  {
    year: 2,
    title: 'Year 2: Core Pharmacy & Formulation Sciences',
    description: 'Pharmaceutical analysis, physical pharmaceutics, microbiology, pharmacology fundamentals, and pharmacognosy of alkaloids and glycosides.',
    subjects: [
      {
        id: 'b201',
        name: 'Pharmaceutical Analysis-I',
        code: 'BPC-201',
        year: 2,
        creditHours: 4,
        description: 'Classical and instrumental analytical techniques for identification, purity testing, and quantification of pharmaceutical substances.',
        lessons: [
          { id: 'bl-201-1', title: 'Errors, Significant Figures & Statistical Analysis in Pharmacy', pciCode: '2.1.1', hasSimulation: true, description: 'Systematic vs random errors, significant figures in analytical data, mean/median/SD/RSD, confidence intervals, t-test, F-test, and GLP (Good Laboratory Practice) documentation.' },
          { id: 'bl-201-2', title: 'Titrimetric Analysis — Acid-Base, Redox & Complexometric', pciCode: '2.1.2', hasSimulation: true, description: 'Neutralization titrations (primary standards — KHP, Na2CO3), oxidation-reduction titrations (KMnO4, Na2S2O3/iodometry), and EDTA complexometric titrations for heavy metals and calcium.' },
          { id: 'bl-201-3', title: 'Gravimetric Analysis & Precipitation Reactions', pciCode: '2.1.3', hasSimulation: false, description: 'Principles of precipitation gravimetry, digestion and filtration of precipitates, volatile impurities by loss on drying/ignition, and pharmaceutical application in ash value determination.' },
          { id: 'bl-201-4', title: 'UV-Visible Spectrophotometry & Beer-Lambert Law', pciCode: '2.1.4', hasSimulation: true, description: 'UV absorption theory (chromophores, auxochromes, bathochromic/hypsochromic shifts), Beer-Lambert law (A = εcl), single-point and calibration curve quantitation methods in pharmacopoeial assays.' }
        ]
      },
      {
        id: 'b202',
        name: 'Pharmaceutics-II (Dosage Form Technology)',
        code: 'BPC-202',
        year: 2,
        creditHours: 4,
        description: 'Formulation science and technology for solid, liquid, and semi-solid dosage forms.',
        lessons: [
          { id: 'bl-202-1', title: 'Solid Dosage Forms — Tablets: Granulation & Compression', pciCode: '2.2.1', hasSimulation: true, description: 'Wet granulation (binder types — PVP, starch paste), dry granulation (slugging, roller compaction), direct compression, tablet defects (capping, lamination, sticking), and Heckel plot for compressibility.' },
          { id: 'bl-202-2', title: 'Tablet Coating — Film & Sugar Coating', pciCode: '2.2.2', hasSimulation: false, description: 'Sugar coating pan stages (sealing, subcoating, smoothing, coloring, polishing), film coating polymers (HPMC, Eudragit — immediate vs enteric release), Wurster fluid-bed coating, and coating defects troubleshooting.' },
          { id: 'bl-202-3', title: 'Capsules — Hard Gelatin & Soft Gelatin Capsules', pciCode: '2.2.3', hasSimulation: false, description: 'Hard gelatin capsule manufacturing (pin machine), fill formulation for HGC (powder blend, mini-tabs, pellets), softgel rotary die process, and quality evaluation (weight variation, disintegration, dissolution).' },
          { id: 'bl-202-4', title: 'Liquid Dosage Forms — Syrups, Elixirs & Suspensions', pciCode: '2.2.4', hasSimulation: false, description: 'Syrup preservation (antimicrobial preservatives — sodium benzoate, parabens), elixir co-solvent selection, suspension formulation (flocculated vs deflocculated), zeta potential and Stokes\' law for sedimentation rate.' }
        ]
      },
      {
        id: 'b203',
        name: 'Pharmacognosy-II — Alkaloids, Glycosides & Resins',
        code: 'BPC-203',
        year: 2,
        creditHours: 4,
        description: 'Phytochemistry, extraction, and pharmacological basis of major alkaloids, cardiac glycosides, anthraquinone glycosides, and resins.',
        lessons: [
          { id: 'bl-203-1', title: 'Alkaloids — Classification, Biosynthesis & Major Groups', pciCode: '2.3.1', hasSimulation: false, description: 'Alkaloid biosynthetic pathways (ornithine → pyrrolizidine, lysine → piperidine, tyrosine → isoquinoline, tryptophan → indole), general extraction methods, and classification into pyridine, quinoline, isoquinoline, and indole alkaloids.' },
          { id: 'bl-203-2', title: 'Opium Alkaloids — Morphine, Codeine & Papaverine', pciCode: '2.3.2', hasSimulation: false, description: 'Papaver somniferum — latex collection and alkaloidal content, morphine structure-activity relationship (OH groups critical for analgesia), semisynthetic opioids (heroin, oxycodone), Mayer\'s/Dragendorff\'s precipitation reactions.' },
          { id: 'bl-203-3', title: 'Cardiac Glycosides — Digitalis & Strophanthus', pciCode: '2.3.3', hasSimulation: false, description: 'Digitalis purpurea and D. lanata — official parts, glycoside constitution (genin + sugar), positive inotropic mechanism (Na+/K+ ATPase inhibition), Keller-Kiliani test, and strophanthidin comparative study.' },
          { id: 'bl-203-4', title: 'Anthraquinone Glycosides — Senna, Cascara & Rhubarb', pciCode: '2.3.4', hasSimulation: false, description: 'Cassia angustifolia (Senna) sennosides A and B — stimulant laxative mechanism (myenteric plexus stimulation, fluid secretion), Bornträger\'s test for anthracene derivatives, and cascara sagrada hydroxyanthracene content.' }
        ]
      }
    ]
  },
  {
    year: 3,
    title: 'Year 3: Applied Pharmaceutical Sciences',
    description: 'Industrial pharmacy, pharmaceutical microbiology, pharmacology of organ systems, and pharmacognosy of volatile oils and tannins.',
    subjects: [
      {
        id: 'b301',
        name: 'Industrial Pharmacy-I',
        code: 'BPC-301',
        year: 3,
        creditHours: 4,
        description: 'GMP, sterile manufacturing, packaging technology, and scale-up from laboratory to industrial production.',
        lessons: [
          { id: 'bl-301-1', title: 'Good Manufacturing Practice (GMP) — Schedule M & WHO Guidelines', pciCode: '3.1.1', hasSimulation: false, description: 'GMP principles under Drugs and Cosmetics Act Schedule M, FDA 21 CFR Part 211, WHO Technical Report Series — premises, equipment, personnel hygiene, documentation (batch manufacturing records, SOPs), and Quality Control (QC) vs Quality Assurance (QA) distinction.' },
          { id: 'bl-301-2', title: 'Sterile Dosage Form Manufacturing — Parenteral & Ophthalmic', pciCode: '3.1.2', hasSimulation: false, description: 'Terminal sterilization (autoclaving, dry heat, gamma irradiation) vs aseptic processing, LAF (Laminar Air Flow) classifications (ISO 5/6/7/8), depyrogenation of glassware, particulate matter testing, and Bacterial Endotoxins Test (BET/LAL).' },
          { id: 'bl-301-3', title: 'Packaging Technology — Primary, Secondary & Tertiary', pciCode: '3.1.3', hasSimulation: false, description: 'Blister packaging (Alu-Alu vs PVC-Alu), amber glass vs Type I borosilicate parenteral containers, child-resistant closures (CFR 16 Part 1700), container closure integrity testing, and packaging line validation.' },
          { id: 'bl-301-4', title: 'Scale-Up Technology & Technology Transfer', pciCode: '3.1.4', hasSimulation: false, description: 'Scale-up challenges for wet granulation (Dimensionless Froude number, impeller tip speed), tablet compression (punch force profiles), and technology transfer documentation (Pharmacopoeia reference standards, master formula records).' }
        ]
      },
      {
        id: 'b302',
        name: 'Pharmacology-I',
        code: 'BPC-302',
        year: 3,
        creditHours: 4,
        description: 'General pharmacology, ANS pharmacology, CVS drugs, and analgesic/anti-inflammatory agents.',
        lessons: [
          { id: 'bl-302-1', title: 'General Pharmacology — ADME, Receptor Theory & Dose-Response', pciCode: '3.2.1', hasSimulation: true, description: 'First-pass effect and bioavailability, two-compartment PK model, Kd and Bmax receptor binding, Emax and EC50, agonist/partial agonist/antagonist/inverse agonist classification, competitive vs non-competitive antagonism.' },
          { id: 'bl-302-2', title: 'Autonomic Nervous System Pharmacology', pciCode: '3.2.2', hasSimulation: true, description: 'Cholinergic drugs (muscarinic agonists — pilocarpine, bethanechol; nicotinic — succinylcholine), anticholinergics (atropine uses: bradycardia, preanesthetic, organophosphate poisoning), adrenergics (norepinephrine, epinephrine, dobutamine) and blockers (prazosin, metoprolol).' },
          { id: 'bl-302-3', title: 'Antihypertensives — Drug Classes & Treatment Algorithms', pciCode: '3.2.3', hasSimulation: true, description: 'JNC/ISH treatment algorithm — diuretics (thiazide, loop), ACE inhibitors (captopril cough — bradykinin), ARBs (valsartan, losartan), calcium channel blockers (DHP vs non-DHP), beta-blockers, and combined therapy strategies for compelling indications.' },
          { id: 'bl-302-4', title: 'NSAIDs, Opioid Analgesics & Gout Pharmacology', pciCode: '3.2.4', hasSimulation: false, description: 'COX-1 vs COX-2 inhibition (selective vs non-selective NSAIDs), GI and cardiovascular risks, opioid mu/kappa/delta receptor pharmacology, morphine equianalgesic doses, naloxone reversal, and uricosurics/xanthine oxidase inhibitors (allopurinol, febuxostat) for gout.' }
        ]
      }
    ]
  },
  {
    year: 4,
    title: 'Year 4: Advanced Clinical & Applied Pharmacy',
    description: 'Novel drug delivery, pharmaceutical biotechnology, hospital and clinical pharmacy, and regulatory affairs.',
    subjects: [
      {
        id: 'b401',
        name: 'Novel Drug Delivery Systems (NDDS)',
        code: 'BPC-401',
        year: 4,
        creditHours: 4,
        description: 'Advanced drug delivery technologies including nanoparticles, liposomes, transdermal systems, and targeted delivery.',
        lessons: [
          { id: 'bl-401-1', title: 'Controlled Release Drug Delivery — Oral Systems', pciCode: '4.1.1', hasSimulation: false, description: 'Matrix systems (HPMC erosion/diffusion), reservoir systems (osmotic pump OROS technology), enteric coated and delayed release mechanisms, IVIVC (Level A/B/C) and in vitro dissolution testing requirements.' },
          { id: 'bl-401-2', title: 'Transdermal Drug Delivery Systems (TDDS)', pciCode: '4.1.2', hasSimulation: false, description: 'Skin permeation barriers (stratum corneum lipid bilayer), passive diffusion Fick\'s law, chemical penetration enhancers (azone, propylene glycol), iontophoresis and sonophoresis, and marketed transdermal patches (nitroglycerin, fentanyl, testosterone).' },
          { id: 'bl-401-3', title: 'Nanoparticulate Drug Delivery — Liposomes, Nanoparticles & SLNs', pciCode: '4.1.3', hasSimulation: false, description: 'Liposome preparation (thin-film hydration, extrusion), EPR (Enhanced Permeability and Retention) effect in cancer, polymeric PLGA nanoparticles, solid lipid nanoparticles, and FDA-approved nanomedicines (Doxil, Abraxane).' },
          { id: 'bl-401-4', title: 'Targeted Drug Delivery — Active & Passive Targeting', pciCode: '4.1.4', hasSimulation: false, description: 'Immunoliposomes (antibody-conjugated liposomes), folate receptor targeting, prodrug activation by tumor enzymes, antibody-drug conjugates (ADCs) mechanism (trastuzumab emtansine), and blood-brain barrier penetration strategies.' }
        ]
      },
      {
        id: 'b402',
        name: 'Hospital & Clinical Pharmacy',
        code: 'BPC-402',
        year: 4,
        creditHours: 4,
        description: 'Clinical pharmacist roles in hospital settings, drug information, adverse drug reaction reporting, and patient counseling.',
        lessons: [
          { id: 'bl-402-1', title: 'Hospital Pharmacy Organization & Formulary Management', pciCode: '4.2.1', hasSimulation: false, description: 'Pharmacy and Therapeutics (P&T) Committee functions, hospital formulary development using Evidence-Based Medicine, Essential Medicines List (WHO/NLEM 2022), and drug procurement, storage, and dispensing systems (unit dose dispensing).' },
          { id: 'bl-402-2', title: 'Clinical Pharmacokinetics & Therapeutic Drug Monitoring (TDM)', pciCode: '4.2.2', hasSimulation: true, description: 'TDM rationale (narrow therapeutic index drugs: digoxin, lithium, vancomycin, aminoglycosides, phenytoin), Bayesian dosing algorithms, AUC-guided vancomycin dosing (target AUC/MIC 400-600), and dose adjustments in renal/hepatic impairment.' },
          { id: 'bl-402-3', title: 'Adverse Drug Reactions — WHO Causality Assessment & Pharmacovigilance', pciCode: '4.2.3', hasSimulation: false, description: 'Rawlins-Thompson A/B/C/D ADR classification, Naranjo Algorithm causality assessment, WHO Uppsala Monitoring Centre reporting, PvPI (Pharmacovigilance Programme of India) reporting forms, and Yellow Card scheme (MHRA, UK).' },
          { id: 'bl-402-4', title: 'Patient Counseling & Medication Adherence Strategies', pciCode: '4.2.4', hasSimulation: false, description: 'PRIME model for patient counseling, SHOW-AND-TELL technique, Health Belief Model for adherence, adherence barriers identification, pillbox organizers, blister compliance packaging, and motivational interviewing for medication reconciliation.' }
        ]
      }
    ]
  }
];

export const BPHARM_METADATA = {
  programName: 'Bachelor of Pharmacy',
  abbreviation: 'B.Pharm',
  duration: '4 Years',
  regulatoryBody: 'PCI'
};

export function getBPharmSubjectById(id: string): BPharmSubject | undefined {
  for (const year of BPHARM_CURRICULUM) {
    for (const subject of year.subjects) {
      if (subject.id === id) return subject;
    }
  }
  return undefined;
}
