/**
 * Mediverse Healthcare Education Landscape Scaffold
 *
 * Defines all 9 Healthcare Education Domains across the full spectrum of
 * Indian and global medical education programs. Used by:
 *   - HealthcareLandscapeExplorer.tsx (domain grid UI)
 *   - DomainContext.tsx (active domain state)
 *   - /healthcare/* route pages
 *   - Backend HealthcareDomainController (domain metadata API)
 */

export type DomainTier = 1 | 2 | 3;

export interface HealthcareProgram {
  id: string;
  name: string;
  fullName: string;
  duration: string;
  description: string;
  regulatoryBody: string;
  competencyPrefix: string;
  routePath: string;
  available: boolean;
}

export interface HealthcareDomain {
  id: string;
  name: string;
  shortName: string;
  icon: string;
  color: string;              // HSL / hex token
  accentColor: string;
  description: string;
  longDescription: string;
  tier: DomainTier;
  routePath: string;
  programs: HealthcareProgram[];
  lessonCount: number;        // approximate count
  keyHighlights: string[];    // 3D features, special labs, etc.
}

// ─── Domain 1: Allopathic Medicine & Super-Specialties ────────────────────────
const allopathicDomain: HealthcareDomain = {
  id: 'allopathic',
  name: 'Allopathic Medicine & Super-Specialties',
  shortName: 'Allopathic',
  icon: '🩺',
  color: '#3B82F6',
  accentColor: '#1D4ED8',
  description: 'MBBS, MD, MS, DM, MCh — evidence-based medicine across 19 core disciplines, 12 PG residency tracks, and advanced simulation labs.',
  longDescription: 'The foundation of modern medicine. From preclinical sciences (Physiology, Anatomy, Biochemistry) through clinical rotations (Medicine, Surgery, OB/GYN) to super-specialty residency tracks (Cardiology, Neurosurgery, Critical Care). Includes 3D multi-organ dissection, physiological simulation solvers, NMC CBME vignettes, and Socratic AI tutoring.',
  tier: 1,
  routePath: '/healthcare/allopathic',
  lessonCount: 620,
  keyHighlights: [
    '3D Multi-Organ WebGL Dissection',
    'Cardiac PV-Loop & Acid-Base Solvers',
    'NMC CBME Vignette Exam Runner',
    '12 Postgraduate Residency Tracks',
    'Socratic AI Tutor with KaTeX',
  ],
  programs: [
    {
      id: 'mbbs',
      name: 'MBBS',
      fullName: 'Bachelor of Medicine, Bachelor of Surgery',
      duration: '5.5 years',
      description: '19 core disciplines across 9 semesters — preclinical, paraclinical, and clinical rotations with NMC CBME curriculum.',
      regulatoryBody: 'NMC (National Medical Commission)',
      competencyPrefix: 'PY / AN / BI / PA / MI / PH / FM / CM',
      routePath: '/healthcare/allopathic/mbbs',
      available: true,
    },
    {
      id: 'md-ms',
      name: 'MD / MS',
      fullName: 'Doctor of Medicine / Master of Surgery',
      duration: '3 years',
      description: 'Postgraduate residency across 12 super-specialties including Critical Care, Cardiology, and Neurology.',
      regulatoryBody: 'NMC',
      competencyPrefix: 'PG',
      routePath: '/healthcare/allopathic/md-ms',
      available: true,
    },
    {
      id: 'dnb',
      name: 'DNB',
      fullName: 'Diplomate of National Board',
      duration: '3 years',
      description: 'NBE-accredited residency equivalent to MD/MS across all major specialties.',
      regulatoryBody: 'NBE (National Board of Examinations)',
      competencyPrefix: 'DNB',
      routePath: '/healthcare/allopathic',
      available: false,
    },
  ],
};

// ─── Domain 2: Dental Sciences ────────────────────────────────────────────────
const dentalDomain: HealthcareDomain = {
  id: 'dental',
  name: 'Dental Sciences',
  shortName: 'Dental',
  icon: '🦷',
  color: '#10B981',
  accentColor: '#059669',
  description: 'BDS, MDS — Oral anatomy, maxillofacial surgery, orthodontics, periodontics with 3D tooth morphology models and nerve block simulators.',
  longDescription: 'Bachelor of Dental Surgery and Master of Dental Surgery programs covering the full spectrum of oral health sciences. Features 3D maxillofacial anatomy, dental material science, nerve block simulation, and specialized DCI competency-mapped clinical modules.',
  tier: 1,
  routePath: '/healthcare/dental',
  lessonCount: 80,
  keyHighlights: [
    '3D Maxillofacial Anatomy & Tooth Morphology',
    'Nerve Block Simulation (IAN, Mental, Infraorbital)',
    'Orthodontic Force System Visualizer',
    'DCI Competency-Mapped Modules',
    'Dental Materials Property Charts',
  ],
  programs: [
    {
      id: 'bds',
      name: 'BDS',
      fullName: 'Bachelor of Dental Surgery',
      duration: '5 years',
      description: '10-semester program covering oral anatomy, dental materials, oral pathology, periodontology, orthodontics, prosthodontics, oral surgery, pedodontics, endodontics, and conservative dentistry.',
      regulatoryBody: 'DCI (Dental Council of India)',
      competencyPrefix: 'BDS',
      routePath: '/healthcare/dental',
      available: true,
    },
    {
      id: 'mds',
      name: 'MDS',
      fullName: 'Master of Dental Surgery',
      duration: '3 years',
      description: 'Postgraduate specialization in orthodontics, oral surgery, periodontology, prosthodontics, or conservative dentistry.',
      regulatoryBody: 'DCI',
      competencyPrefix: 'MDS',
      routePath: '/healthcare/dental/mds',
      available: true,
    },
  ],
};

// ─── Domain 3: AYUSH Traditional & Integrative Systems ───────────────────────
const ayushDomain: HealthcareDomain = {
  id: 'ayush',
  name: 'AYUSH Traditional & Integrative Systems',
  shortName: 'AYUSH',
  icon: '🌿',
  color: '#F59E0B',
  accentColor: '#D97706',
  description: 'BAMS, BHMS, BUMS, BSMS, BNYS — Ayurveda, Homeopathy, Unani with 3D Marma Point map, Tridosha-ANS correlation, and Panchakarma guides.',
  longDescription: 'The AYUSH systems of traditional medicine — Ayurveda, Yoga, Naturopathy, Unani, Siddha, and Homeopathy. Features the iconic 3D 107 Marma Points interactive map, Tridosha-Autonomic Nervous System correlation modules, and CCIM competency-mapped clinical case studies.',
  tier: 1,
  routePath: '/healthcare/ayush',
  lessonCount: 90,
  keyHighlights: [
    '3D 107 Marma Points Interactive Map',
    'Tridosha–ANS Correlation Modules',
    'Panchakarma Procedure Guides',
    'Dravyaguna Herb-Drug Interaction Charts',
    'CCIM Competency Mapping',
  ],
  programs: [
    {
      id: 'bams',
      name: 'BAMS',
      fullName: 'Bachelor of Ayurvedic Medicine & Surgery',
      duration: '5.5 years',
      description: 'Samhita Sanskrit, Kriya Sharira, Rachana Sharira with 107 Marma Points, Dravyaguna, Rasa Shastra, Panchakarma, Kayachikitsa, and Shalya Tantra.',
      regulatoryBody: 'CCIM (Central Council of Indian Medicine)',
      competencyPrefix: 'BAMS',
      routePath: '/healthcare/ayush',
      available: true,
    },
    {
      id: 'md-ayurveda',
      name: 'MD/MS Ayurveda',
      fullName: 'Doctor of Medicine / Master of Surgery in Ayurveda',
      duration: '3 years',
      description: 'Postgraduate degree in Ayurvedic specialties.',
      regulatoryBody: 'CCIM',
      competencyPrefix: 'MD-AYU',
      routePath: '/healthcare/ayush/md-ayurveda',
      available: true,
    },
    {
      id: 'bhms',
      name: 'BHMS',
      fullName: 'Bachelor of Homeopathic Medicine & Surgery',
      duration: '5.5 years',
      description: 'Homeopathic Materia Medica, Organon of Medicine, Repertory, and clinical case-taking modules.',
      regulatoryBody: 'CCH (Central Council of Homeopathy)',
      competencyPrefix: 'BHMS',
      routePath: '/healthcare/ayush/bhms',
      available: true,
    },
    {
      id: 'bnys',
      name: 'BNYS',
      fullName: 'Bachelor of Naturopathy & Yogic Sciences',
      duration: '5.5 years',
      description: 'Naturopathic dietetics, hydrotherapy, yoga therapeutics, and lifestyle medicine.',
      regulatoryBody: 'CCYN (Central Council of Yoga & Naturopathy)',
      competencyPrefix: 'BNYS',
      routePath: '/healthcare/ayush/bnys',
      available: true,
    },
    {
      id: 'bums',
      name: 'BUMS',
      fullName: 'Bachelor of Unani Medicine & Surgery',
      duration: '5.5 years',
      description: 'CCIM-regulated undergraduate program in Unani Medicine.',
      regulatoryBody: 'CCIM',
      competencyPrefix: 'BUMS',
      routePath: '/healthcare/ayush/bums',
      available: true,
    },
    {
      id: 'bsms',
      name: 'BSMS',
      fullName: 'Bachelor of Siddha Medicine & Surgery',
      duration: '5.5 years',
      description: 'CCIM-regulated undergraduate program in Siddha Medicine.',
      regulatoryBody: 'CCIM',
      competencyPrefix: 'BSMS',
      routePath: '/healthcare/ayush/bsms',
      available: true,
    },
  ],
};

// ─── Domain 4: Pharmacy & Clinical Pharmacotherapy ───────────────────────────
const pharmacyDomain: HealthcareDomain = {
  id: 'pharmacy',
  name: 'Pharmacy & Clinical Pharmacotherapy',
  shortName: 'Pharmacy',
  icon: '💊',
  color: '#8B5CF6',
  accentColor: '#7C3AED',
  description: 'Pharm.D, B.Pharm, M.Pharm — Clinical pharmacokinetics, therapeutic drug monitoring, pharmacovigilance, and drug interaction dashboards.',
  longDescription: 'From foundational pharmaceutical sciences (organic chemistry, pharmacognosy) through clinical pharmacy practice (therapeutic drug monitoring, pharmacovigilance, clinical pharmacokinetics). Pharm.D clinical rotations and hospital pharmacy management modules.',
  tier: 1,
  routePath: '/healthcare/pharmacy',
  lessonCount: 60,
  keyHighlights: [
    'Pharmacokinetics PK/PD Simulation',
    'Therapeutic Drug Monitoring Dashboard',
    'Drug–Drug Interaction Checker',
    'Pharmacovigilance Case Reports',
    'Hospital Pharmacy Workflow Modules',
  ],
  programs: [
    {
      id: 'pharmd',
      name: 'Pharm.D',
      fullName: 'Doctor of Pharmacy',
      duration: '6 years',
      description: 'Clinical pharmacy practice with hospital rotations, patient counseling, and pharmacovigilance.',
      regulatoryBody: 'PCI (Pharmacy Council of India)',
      competencyPrefix: 'PHARMD',
      routePath: '/healthcare/pharmacy/pharmd',
      available: true,
    },
    {
      id: 'bpharm',
      name: 'B.Pharm',
      fullName: 'Bachelor of Pharmacy',
      duration: '4 years',
      description: 'Pharmaceutical chemistry, pharmacognosy, pharmaceutics, and pharmacology fundamentals.',
      regulatoryBody: 'PCI',
      competencyPrefix: 'BPHARM',
      routePath: '/healthcare/pharmacy/bpharm',
      available: true,
    },
    {
      id: 'mpharm',
      name: 'M.Pharm',
      fullName: 'Master of Pharmacy',
      duration: '2 years',
      description: 'Postgraduate specialization in Pharmaceutics, Pharmacology, Pharmaceutical Chemistry, or Pharmacy Practice.',
      regulatoryBody: 'PCI',
      competencyPrefix: 'MPHARM',
      routePath: '/healthcare/pharmacy/mpharm',
      available: true,
    },
  ],
};

// ─── Domain 5: Nursing & Advanced Practice Nursing ────────────────────────────
const nursingDomain: HealthcareDomain = {
  id: 'nursing',
  name: 'Nursing & Advanced Practice Nursing',
  shortName: 'Nursing',
  icon: '🏥',
  color: '#EC4899',
  accentColor: '#DB2777',
  description: 'B.Sc Nursing, M.Sc Nursing, NP — Fundamental nursing procedures, ICU critical care protocols, wound care, and medication administration safety.',
  longDescription: 'Comprehensive nursing education from fundamental care skills to advanced practice nursing and nurse practitioner tracks. Includes ICU critical care nursing protocols, medication safety modules, OSCE-style nursing skill stations, and clinical rotation documentation.',
  tier: 2,
  routePath: '/healthcare/nursing',
  lessonCount: 50,
  keyHighlights: [
    'ICU Critical Care Nursing Protocols',
    'Medication Administration Safety',
    'OSCE Nursing Skill Stations',
    'Wound Care & Wound Dressing Modules',
    'Patient Safety & Incident Reporting',
  ],
  programs: [
    {
      id: 'bsc-nursing',
      name: 'B.Sc Nursing',
      fullName: 'Bachelor of Science in Nursing',
      duration: '4 years',
      description: 'Fundamental nursing, medical-surgical nursing, midwifery, community health nursing, and pediatric nursing.',
      regulatoryBody: 'INC (Indian Nursing Council)',
      competencyPrefix: 'NURSING',
      routePath: '/healthcare/nursing/bscnursing',
      available: true,
    },
    {
      id: 'msc-nursing',
      name: 'M.Sc Nursing',
      fullName: 'Master of Science in Nursing',
      duration: '2 years',
      description: 'Advanced practice nursing specializations including critical care, oncology, and neonatal nursing.',
      regulatoryBody: 'INC',
      competencyPrefix: 'MNURSING',
      routePath: '/healthcare/nursing/mscnursing',
      available: true,
    },
  ],
};

// ─── Domain 6: Physiotherapy & Rehabilitation Sciences ───────────────────────
const physiotherapyDomain: HealthcareDomain = {
  id: 'physiotherapy',
  name: 'Physiotherapy & Rehabilitation Sciences',
  shortName: 'Physiotherapy',
  icon: '🦾',
  color: '#06B6D4',
  accentColor: '#0891B2',
  description: 'BPT, MPT, BOT — 3D joint biomechanics visualizer, ROM measurement, gait analysis, neurorehabilitation protocols, and sports physiotherapy.',
  longDescription: 'Bachelor and Master of Physiotherapy programs covering musculoskeletal, neurological, cardiopulmonary, and sports physiotherapy. Features 3D joint biomechanics simulation, Range of Motion (ROM) measurement tools, gait analysis modules, and evidence-based rehabilitation protocol libraries.',
  tier: 2,
  routePath: '/healthcare/physiotherapy',
  lessonCount: 45,
  keyHighlights: [
    '3D Joint Biomechanics Visualizer',
    'ROM & Gait Analysis Modules',
    'Neurorehabilitation Protocols (Bobath, PNF)',
    'Sports Physiotherapy Case Studies',
    'Cardiopulmonary Rehab Exercises',
  ],
  programs: [
    {
      id: 'bpt',
      name: 'BPT',
      fullName: 'Bachelor of Physiotherapy',
      duration: '4.5 years',
      description: 'Musculoskeletal, neurological, pediatric, cardiopulmonary, and sports physiotherapy with clinical internship.',
      regulatoryBody: 'IAP (Indian Association of Physiotherapists)',
      competencyPrefix: 'BPT',
      routePath: '/healthcare/physiotherapy/bpt',
      available: true,
    },
    {
      id: 'mpt',
      name: 'MPT',
      fullName: 'Master of Physiotherapy',
      duration: '2 years',
      description: 'Specialization in orthopedics, neurology, sports, cardiopulmonary, or pediatric physiotherapy.',
      regulatoryBody: 'IAP',
      competencyPrefix: 'MPT',
      routePath: '/healthcare/physiotherapy/mpt',
      available: true,
    },
  ],
};

// ─── Domain 7: Allied Health Sciences & High-Tech Clinical Technologies ───────
const alliedDomain: HealthcareDomain = {
  id: 'allied',
  name: 'Allied Health Sciences & High-Tech Clinical Technologies',
  shortName: 'Allied Health',
  icon: '🔬',
  color: '#F97316',
  accentColor: '#EA580C',
  description: 'B.Sc Perfusion, Radiology, OT Technology, Dialysis — ECMO/CPB circuit simulation, CT/MRI 3D slice explorer, and operating theatre workflows.',
  longDescription: 'High-technology allied health programs training the specialist paramedical workforce for modern hospitals. Covers cardiac perfusion (ECMO/CPB), diagnostic imaging (CT/MRI), operation theatre technology, renal dialysis technology, and cardiac sonography.',
  tier: 2,
  routePath: '/healthcare/allied',
  lessonCount: 40,
  keyHighlights: [
    'ECMO / CPB Circuit Simulation',
    'CT / MRI 3D Slice Explorer',
    'Operation Theatre Workflow Modules',
    'Dialysis Machine Setup Protocols',
    'Cardiac Sonography Planes',
  ],
  programs: [
    {
      id: 'perfusion',
      name: 'B.Sc Perfusion',
      fullName: 'B.Sc Cardiovascular Perfusion Technology',
      duration: '3 years',
      description: 'Cardiopulmonary bypass, ECMO, intra-aortic balloon pump, and ventricular assist device management.',
      regulatoryBody: 'NCAHP / MCI recognized',
      competencyPrefix: 'PERF',
      routePath: '/healthcare/allied/curriculum?major=BSCPERF',
      available: true,
    },
    {
      id: 'radiology-tech',
      name: 'B.Sc Radiology',
      fullName: 'B.Sc Radiology & Imaging Technology',
      duration: '3 years',
      description: 'X-ray, CT, MRI, ultrasound, nuclear medicine imaging principles and radiation protection.',
      regulatoryBody: 'NCAHP / AERB recognized',
      competencyPrefix: 'RADIO',
      routePath: '/healthcare/allied/curriculum?major=BSCRIT',
      available: true,
    },
    {
      id: 'ot-technology',
      name: 'B.Sc OT Tech',
      fullName: 'B.Sc Operation Theatre & Anaesthesia Technology',
      duration: '3 years',
      description: 'Operation theatre instrumentation, anesthesia workstations, and sterile processing.',
      regulatoryBody: 'NCAHP recognized',
      competencyPrefix: 'OTT',
      routePath: '/healthcare/allied/curriculum?major=BSCOTT',
      available: true,
    },
    {
      id: 'dialysis-tech',
      name: 'B.Sc Dialysis',
      fullName: 'B.Sc Renal Dialysis Technology',
      duration: '3 years',
      description: 'Hemodialysis, CRRT, peritoneal dialysis, and water treatment systems.',
      regulatoryBody: 'NCAHP recognized',
      competencyPrefix: 'DIAL',
      routePath: '/healthcare/allied/curriculum?major=BSCDIAL',
      available: true,
    },
  ],
};

// ─── Domain 8: Veterinary & Comparative Medicine ─────────────────────────────
const veterinaryDomain: HealthcareDomain = {
  id: 'veterinary',
  name: 'Veterinary & Comparative Medicine',
  shortName: 'Veterinary',
  icon: '🐾',
  color: '#84CC16',
  accentColor: '#65A30D',
  description: 'BVSc & AH, MVSc — Comparative anatomy, zoonotic disease modules, large and small animal surgery, and One Health epidemiology frameworks.',
  longDescription: 'Veterinary Medicine programs covering small animal, large animal, and exotic species medicine, surgery, and public health. Includes comparative anatomy with human medicine connections, zoonotic disease modules, and One Health integrated epidemiology.',
  tier: 3,
  routePath: '/healthcare/veterinary',
  lessonCount: 30,
  keyHighlights: [
    'Comparative Anatomy (Human vs Animal)',
    'Zoonotic Disease One Health Modules',
    'Large & Small Animal Surgery Guides',
    'Veterinary Pathology Case Studies',
    'Livestock Nutrition & Husbandry',
  ],
  programs: [
    {
      id: 'bvsc',
      name: 'BVSc & AH',
      fullName: 'Bachelor of Veterinary Science & Animal Husbandry',
      duration: '5.5 years',
      description: 'Comprehensive veterinary education covering companion animals, livestock, poultry, wildlife, and public veterinary health.',
      regulatoryBody: 'VCI (Veterinary Council of India)',
      competencyPrefix: 'BVSC',
      routePath: '/healthcare/veterinary/bvsc',
      available: true,
    },
    {
      id: 'mvsc',
      name: 'MVSc',
      fullName: 'Master of Veterinary Science',
      duration: '2 years',
      description: 'Postgraduate specialization in veterinary surgery, medicine, gynaecology, pathology, and public health.',
      regulatoryBody: 'VCI (Veterinary Council of India)',
      competencyPrefix: 'MVSC',
      routePath: '/healthcare/veterinary/mvsc',
      available: true,
    },
  ],
};

// ─── Domain 9: Public Health & Healthcare Administration ─────────────────────
const publicHealthDomain: HealthcareDomain = {
  id: 'public-health',
  name: 'Public Health & Healthcare Administration',
  shortName: 'Public Health',
  icon: '🌍',
  color: '#6366F1',
  accentColor: '#4F46E5',
  description: 'MPH, MHA — Epidemiology, biostatistics, health economics, hospital management, AYUSHMAN Bharat policy, and global health frameworks.',
  longDescription: 'Graduate programs in Public Health and Healthcare Administration. Covers epidemiology, biostatistics, health policy, hospital operations management, Ayushman Bharat-PMJAY policy frameworks, health economics, and global health governance.',
  tier: 3,
  routePath: '/healthcare/public-health',
  lessonCount: 35,
  keyHighlights: [
    'Epidemiology & Biostatistics Modules',
    'Ayushman Bharat / PMJAY Policy',
    'Hospital Operations Management',
    'Health Economics & Budget Analysis',
    'Global Health Governance Frameworks',
  ],
  programs: [
    {
      id: 'mph',
      name: 'MPH',
      fullName: 'Master of Public Health',
      duration: '2 years',
      description: 'Epidemiology, biostatistics, health policy, environmental health, and global health practice.',
      regulatoryBody: 'NMC / UGC recognized',
      competencyPrefix: 'MPH',
      routePath: '/healthcare/public-health/mph',
      available: true,
    },
    {
      id: 'mha',
      name: 'MHA',
      fullName: 'Master of Hospital Administration',
      duration: '2 years',
      description: 'Hospital operations, financial management, HR, quality (NABH/JCI), and healthcare technology administration.',
      regulatoryBody: 'UGC recognized',
      competencyPrefix: 'MHA',
      routePath: '/healthcare/public-health/mha',
      available: true,
    },
  ],
};

// ─── Landscape Registry ────────────────────────────────────────────────────────

export const HEALTHCARE_DOMAINS: HealthcareDomain[] = [
  allopathicDomain,
  dentalDomain,
  ayushDomain,
  pharmacyDomain,
  nursingDomain,
  physiotherapyDomain,
  alliedDomain,
  veterinaryDomain,
  publicHealthDomain,
];

/** Look up a domain by its string ID */
export function getDomainById(id: string): HealthcareDomain | undefined {
  return HEALTHCARE_DOMAINS.find((d) => d.id === id);
}

/** Get all domains for a specific tier */
export function getDomainsByTier(tier: DomainTier): HealthcareDomain[] {
  return HEALTHCARE_DOMAINS.filter((d) => d.tier === tier);
}

/** Total lesson count across all domains */
export const TOTAL_LESSON_COUNT = HEALTHCARE_DOMAINS.reduce(
  (sum, d) => sum + d.lessonCount,
  0
);

/** Domain IDs in the order they appear in the landscape grid */
export const DOMAIN_IDS = HEALTHCARE_DOMAINS.map((d) => d.id) as string[];
