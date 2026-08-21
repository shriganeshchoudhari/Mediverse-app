/**
 * BDS (Bachelor of Dental Surgery) Curriculum Scaffold
 *
 * 5-year / 10-semester DCI-recognized curriculum with full subject breakdown,
 * DCI competency code prefixes, and flags for 3D interactive content.
 *
 * Regulatory Body: Dental Council of India (DCI)
 * Duration: 5 years (4 years academic + 1 year compulsory rotatory internship)
 * Program Route: /healthcare/dental
 */

export interface BDSLesson {
  id: string;
  title: string;
  dciCode: string;
  has3DContent: boolean;
  hasSimulation: boolean;
  description: string;
}

export interface BDSSubject {
  id: string;
  name: string;
  code: string;
  semester: number;
  year: number;
  creditHours: number;
  description: string;
  lessons: BDSLesson[];
}

export interface BDSYear {
  year: number;
  title: string;
  semesters: number[];
  subjects: BDSSubject[];
}

export const BDS_CURRICULUM: BDSYear[] = [
  // ─── Year 1 (Semesters 1–2): Basic Sciences ──────────────────────────────
  {
    year: 1,
    title: 'First BDS — Basic Dental Sciences',
    semesters: [1, 2],
    subjects: [
      {
        id: 'bds-ga',
        name: 'General Anatomy including Embryology & Histology',
        code: 'BDS-GA',
        semester: 1,
        year: 1,
        creditHours: 10,
        description: 'Gross anatomy of head, neck, and thorax; embryological development of oral structures; oral histology.',
        lessons: [
          {
            id: 'ga-001',
            title: 'Head & Neck Osteology — Skull Bones & Sutures',
            dciCode: 'GA1.1',
            has3DContent: true,
            hasSimulation: false,
            description: '3D skull model with labeled bones, foramina, and cranial nerve exits.',
          },
          {
            id: 'ga-002',
            title: 'Muscles of Mastication — Origin, Insertion & Action',
            dciCode: 'GA1.2',
            has3DContent: true,
            hasSimulation: false,
            description: 'Masseter, temporalis, medial and lateral pterygoids with jaw movement simulation.',
          },
          {
            id: 'ga-003',
            title: 'Temporomandibular Joint (TMJ) — Structure & Biomechanics',
            dciCode: 'GA1.3',
            has3DContent: true,
            hasSimulation: true,
            description: 'TMJ disc, capsule, ligaments, and movement simulation (depression, protrusion, lateral excursion).',
          },
          {
            id: 'ga-004',
            title: 'Oral Histology — Enamel, Dentine, Cementum & Pulp',
            dciCode: 'GA2.1',
            has3DContent: true,
            hasSimulation: false,
            description: 'Microscopic structure of dental hard tissues with cross-polarized enamel prism visualization.',
          },
          {
            id: 'ga-005',
            title: 'Tooth Development — Odontogenesis & Amelogenesis',
            dciCode: 'GA3.1',
            has3DContent: false,
            hasSimulation: false,
            description: 'Bud, cap, and bell stages of tooth development; enamel organ differentiation.',
          },
          {
            id: 'ga-006',
            title: 'Trigeminal Nerve — Branches & Dental Anesthesia Anatomy',
            dciCode: 'GA1.8',
            has3DContent: true,
            hasSimulation: true,
            description: 'V2 and V3 branches with nerve block target point simulation (IAN, mental, infraorbital).',
          },
        ],
      },
      {
        id: 'bds-gp',
        name: 'General Human Physiology & Biochemistry',
        code: 'BDS-GP',
        semester: 1,
        year: 1,
        creditHours: 10,
        description: 'Basic human physiology relevant to dental practice including blood, cardiovascular, respiratory, and nerve physiology.',
        lessons: [
          {
            id: 'gp-001',
            title: 'Blood — Coagulation Cascade & Haemostasis',
            dciCode: 'GP1.1',
            has3DContent: false,
            hasSimulation: false,
            description: 'Coagulation factors, platelet aggregation, and anticoagulant mechanisms relevant to oral surgery.',
          },
          {
            id: 'gp-002',
            title: 'Local Anaesthetic Pharmacodynamics — Na+ Channel Blockade',
            dciCode: 'GP2.1',
            has3DContent: false,
            hasSimulation: true,
            description: 'Mechanism of lidocaine/articaine action on voltage-gated Na+ channels with GHK membrane potential simulation.',
          },
          {
            id: 'gp-003',
            title: 'Salivary Glands — Composition, Control & Xerostomia',
            dciCode: 'GP3.1',
            has3DContent: true,
            hasSimulation: false,
            description: 'Parotid, submandibular, sublingual glands — secretion mechanism and autonomic control.',
          },
        ],
      },
      {
        id: 'bds-dm',
        name: 'Dental Materials',
        code: 'BDS-DM',
        semester: 2,
        year: 1,
        creditHours: 8,
        description: 'Science and clinical application of dental biomaterials — composites, amalgam, ceramics, cements, and impression materials.',
        lessons: [
          {
            id: 'dm-001',
            title: 'Composite Resins — Polymerization Shrinkage & Clinical Implications',
            dciCode: 'DM1.1',
            has3DContent: false,
            hasSimulation: true,
            description: 'Incremental layering technique simulation to minimize polymerization shrinkage stress.',
          },
          {
            id: 'dm-002',
            title: 'Dental Ceramics — Feldspathic, Zirconia & E-max',
            dciCode: 'DM2.1',
            has3DContent: false,
            hasSimulation: false,
            description: 'Optical, mechanical, and adhesive properties of modern dental ceramics for crown selection.',
          },
          {
            id: 'dm-003',
            title: 'Impression Materials — Elastomers & Dimensional Accuracy',
            dciCode: 'DM3.1',
            has3DContent: false,
            hasSimulation: false,
            description: 'Alginate, polyvinyl siloxane, polyether properties and impression technique selection.',
          },
          {
            id: 'dm-004',
            title: 'Dental Cements — Luting Agents & Bond Strength',
            dciCode: 'DM4.1',
            has3DContent: false,
            hasSimulation: false,
            description: 'GIC, RMGIC, resin cement selection matrix and cementation protocol guidelines.',
          },
        ],
      },
    ],
  },

  // ─── Year 2 (Semesters 3–4): Applied Sciences ─────────────────────────────
  {
    year: 2,
    title: 'Second BDS — Applied Dental Sciences',
    semesters: [3, 4],
    subjects: [
      {
        id: 'bds-op',
        name: 'Oral Pathology & Oral Microbiology',
        code: 'BDS-OP',
        semester: 3,
        year: 2,
        creditHours: 10,
        description: 'Pathological processes affecting oral tissues — caries, periodontal disease, oral cancer, cysts, and tumours.',
        lessons: [
          {
            id: 'op-001',
            title: 'Dental Caries — Keyes Tetrad & Stephan pH Curve',
            dciCode: 'OP1.1',
            has3DContent: false,
            hasSimulation: true,
            description: 'Host-microbe-substrate-time interaction and critical pH demineralization threshold simulation.',
          },
          {
            id: 'op-002',
            title: 'Oral Cancer — Stages, Histology & Risk Factors',
            dciCode: 'OP2.1',
            has3DContent: false,
            hasSimulation: false,
            description: 'Squamous cell carcinoma staging (TNM), histological grading, and tobacco/alcohol risk counseling.',
          },
          {
            id: 'op-003',
            title: 'Odontogenic Cysts & Tumours — Classification & Radiological Features',
            dciCode: 'OP3.1',
            has3DContent: false,
            hasSimulation: false,
            description: 'WHO classification, CBCT radiological features, and differential diagnosis matrix.',
          },
          {
            id: 'op-004',
            title: 'Periodontal Pathogens — Biofilm & Host Immune Response',
            dciCode: 'OP4.1',
            has3DContent: false,
            hasSimulation: false,
            description: 'Red complex bacteria (P. gingivalis, T. forsythia, T. denticola) and cytokine-mediated bone loss.',
          },
        ],
      },
      {
        id: 'bds-pe',
        name: 'Periodontology',
        code: 'BDS-PE',
        semester: 4,
        year: 2,
        creditHours: 8,
        description: 'Diseases of supporting structures of teeth — classification, assessment, non-surgical and surgical periodontal therapy.',
        lessons: [
          {
            id: 'pe-001',
            title: 'Periodontal Assessment — Probing Depths, BOP & Furcation Involvement',
            dciCode: 'PE1.1',
            has3DContent: true,
            hasSimulation: false,
            description: '3D periodontal chart visualization with probing depth mapping and furcation classification.',
          },
          {
            id: 'pe-002',
            title: 'Scaling & Root Planing — Instrumentation & Technique',
            dciCode: 'PE2.1',
            has3DContent: false,
            hasSimulation: true,
            description: 'Gracey curette selection guide and subgingival debridement angulation simulation.',
          },
          {
            id: 'pe-003',
            title: 'Osseous Surgery — Resective & Regenerative Approaches',
            dciCode: 'PE3.1',
            has3DContent: true,
            hasSimulation: false,
            description: 'Flap design, bone defect classification, and GTR membrane placement.',
          },
        ],
      },
    ],
  },

  // ─── Year 3 (Semesters 5–6): Clinical Sciences ─────────────────────────────
  {
    year: 3,
    title: 'Third BDS — Clinical Dental Sciences',
    semesters: [5, 6],
    subjects: [
      {
        id: 'bds-cd',
        name: 'Conservative Dentistry & Endodontics',
        code: 'BDS-CD',
        semester: 5,
        year: 3,
        creditHours: 10,
        description: 'Cavity preparation, composite and ceramic restorations, root canal treatment, and vital pulp therapy.',
        lessons: [
          {
            id: 'cd-001',
            title: 'Root Canal Anatomy — Canal Configurations & Vertucci Classification',
            dciCode: 'CD1.1',
            has3DContent: true,
            hasSimulation: false,
            description: '3D root canal system visualization across all teeth types with Vertucci type I-VIII mapping.',
          },
          {
            id: 'cd-002',
            title: 'Biomechanical Preparation — Working Length & Rotary Instrumentation',
            dciCode: 'CD2.1',
            has3DContent: false,
            hasSimulation: true,
            description: 'Electronic apex locator working length determination and NiTi rotary file sequence simulation.',
          },
          {
            id: 'cd-003',
            title: 'Obturation — Cold Lateral Condensation & Warm Vertical Compaction',
            dciCode: 'CD3.1',
            has3DContent: false,
            hasSimulation: false,
            description: 'Gutta-percha obturation techniques and radiographic quality assessment criteria.',
          },
        ],
      },
      {
        id: 'bds-os',
        name: 'Oral & Maxillofacial Surgery',
        code: 'BDS-OS',
        semester: 6,
        year: 3,
        creditHours: 10,
        description: 'Principles of exodontia, surgical extractions, impacted third molar surgery, local anaesthesia, and minor oral surgical procedures.',
        lessons: [
          {
            id: 'os-001',
            title: 'Local Anaesthesia — IAN Block, Buccal & Lingual Infiltration',
            dciCode: 'OS1.1',
            has3DContent: true,
            hasSimulation: true,
            description: '3D nerve block target point simulation with anatomical landmark identification for IAN, mental, and infraorbital blocks.',
          },
          {
            id: 'os-002',
            title: 'Impacted Third Molars — Classification & Surgical Protocol',
            dciCode: 'OS2.1',
            has3DContent: true,
            hasSimulation: false,
            description: 'Winter and Pell-Gregory classification with 3D CBCT impaction angulation visualization.',
          },
          {
            id: 'os-003',
            title: 'Orthognathic Surgery — Le Fort Osteotomies & BSSO',
            dciCode: 'OS3.1',
            has3DContent: true,
            hasSimulation: false,
            description: 'Le Fort I, II, III osteotomies and bilateral sagittal split osteotomy (BSSO) with 3D skeletal movement planning.',
          },
        ],
      },
    ],
  },

  // ─── Year 4 (Semesters 7–8): Advanced Clinical Sciences ───────────────────
  {
    year: 4,
    title: 'Fourth BDS — Advanced Clinical Sciences',
    semesters: [7, 8],
    subjects: [
      {
        id: 'bds-pr',
        name: 'Prosthodontics including Crown & Bridge',
        code: 'BDS-PR',
        semester: 7,
        year: 4,
        creditHours: 10,
        description: 'Complete and partial dentures, fixed prosthodontics, implant overdentures, and maxillofacial prosthetics.',
        lessons: [
          {
            id: 'pr-001',
            title: 'Complete Dentures — Jaw Relations & Occlusal Vertical Dimension',
            dciCode: 'PR1.1',
            has3DContent: true,
            hasSimulation: true,
            description: 'Centric relation registration, OVD determination, and occlusal articulation simulation.',
          },
          {
            id: 'pr-002',
            title: 'Dental Implants — Osseointegration, Planning & Surgical Protocol',
            dciCode: 'PR2.1',
            has3DContent: true,
            hasSimulation: false,
            description: '3D implant placement planning in CBCT-derived bone density maps with angulation and depth visualization.',
          },
          {
            id: 'pr-003',
            title: 'Fixed Prosthodontics — Crown Preparation & Marginal Design',
            dciCode: 'PR3.1',
            has3DContent: true,
            hasSimulation: false,
            description: '3D tooth preparation simulation with chamfer, shoulder, and knife-edge margin visualizations.',
          },
        ],
      },
      {
        id: 'bds-or',
        name: 'Orthodontics & Dentofacial Orthopaedics',
        code: 'BDS-OR',
        semester: 8,
        year: 4,
        creditHours: 10,
        description: 'Malocclusion classification, cephalometric analysis, orthodontic appliances, and growth modification.',
        lessons: [
          {
            id: 'or-001',
            title: 'Angle Classification & Skeletal Malocclusion Assessment',
            dciCode: 'OR1.1',
            has3DContent: true,
            hasSimulation: false,
            description: '3D occlusal view with Class I, II, III molar relationship visualization and skeletal pattern overlay.',
          },
          {
            id: 'or-002',
            title: 'Cephalometric Analysis — Landmarks, Planes & ANB Interpretation',
            dciCode: 'OR2.1',
            has3DContent: false,
            hasSimulation: false,
            description: 'Steiner, Tweed, and Ricketts analysis with normal range reference tables.',
          },
          {
            id: 'or-003',
            title: 'Fixed Appliance Mechanics — Bracket Systems & Arch Wire Sequences',
            dciCode: 'OR3.1',
            has3DContent: false,
            hasSimulation: true,
            description: 'Light, optimal, and heavy force threshold simulation for orthodontic tooth movement.',
          },
        ],
      },
    ],
  },

  // ─── Year 5 (Semester 9–10 + Internship): Senior Clinical ─────────────────
  {
    year: 5,
    title: 'Fifth BDS — Senior Clinical & Compulsory Rotatory Internship',
    semesters: [9, 10],
    subjects: [
      {
        id: 'bds-pd',
        name: 'Pedodontics & Preventive Dentistry',
        code: 'BDS-PD',
        semester: 9,
        year: 5,
        creditHours: 10,
        description: 'Dental management of infants, children, and adolescents — caries prevention, behaviour management, and interceptive orthodontics.',
        lessons: [
          {
            id: 'pd-001',
            title: 'Primary Dentition — Chronology of Eruption & Occlusion',
            dciCode: 'PD1.1',
            has3DContent: true,
            hasSimulation: false,
            description: '3D primary and mixed dentition eruption sequence with space maintenance visualization.',
          },
          {
            id: 'pd-002',
            title: 'Pulp Therapy — Pulpotomy & Pulpectomy in Primary Teeth',
            dciCode: 'PD2.1',
            has3DContent: false,
            hasSimulation: false,
            description: 'Ferric sulphate pulpotomy protocol and ZOE pulpectomy step-by-step guide.',
          },
          {
            id: 'pd-003',
            title: 'Fluoride Therapy — Systemic vs Topical & Optimal Dosing',
            dciCode: 'PD3.1',
            has3DContent: false,
            hasSimulation: false,
            description: 'Age-stratified fluoride dosing, varnish application protocol, and fluorosis risk management.',
          },
        ],
      },
      {
        id: 'bds-om',
        name: 'Oral Medicine & Radiology',
        code: 'BDS-OM',
        semester: 10,
        year: 5,
        creditHours: 10,
        description: 'Diagnosis of oral diseases, interpretation of intraoral and extraoral radiographs, CBCT, and special investigations.',
        lessons: [
          {
            id: 'om-001',
            title: 'Periapical Radiography — Technique & Radiographic Interpretation',
            dciCode: 'OM1.1',
            has3DContent: false,
            hasSimulation: false,
            description: 'Paralleling and bisecting angle techniques with diagnostic criteria for periapical pathology.',
          },
          {
            id: 'om-002',
            title: 'CBCT in Dentistry — Applications & Radiation Dose Justification',
            dciCode: 'OM2.1',
            has3DContent: true,
            hasSimulation: false,
            description: '3D CBCT slice explorer for implant planning, impaction assessment, and TMJ evaluation.',
          },
          {
            id: 'om-003',
            title: 'Oral Manifestations of Systemic Diseases — Diagnostic Protocol',
            dciCode: 'OM3.1',
            has3DContent: false,
            hasSimulation: false,
            description: 'Oral signs of diabetes, haematological disorders, autoimmune diseases, and HIV/AIDS.',
          },
        ],
      },
    ],
  },
];

// ─── Summary Metadata ──────────────────────────────────────────────────────────

export const BDS_METADATA = {
  programName: 'Bachelor of Dental Surgery',
  abbreviation: 'BDS',
  totalYears: 5,
  totalSemesters: 10,
  internshipMonths: 12,
  regulatoryBody: 'Dental Council of India (DCI)',
  competencyPrefix: 'BDS',
  routePath: '/healthcare/dental',
  totalSubjects: BDS_CURRICULUM.reduce((sum, y) => sum + y.subjects.length, 0),
  totalLessons: BDS_CURRICULUM.reduce(
    (sum, y) => sum + y.subjects.reduce((s2, sub) => s2 + sub.lessons.length, 0),
    0
  ),
  lessonsWith3D: BDS_CURRICULUM.reduce(
    (sum, y) =>
      sum +
      y.subjects.reduce(
        (s2, sub) => s2 + sub.lessons.filter((l) => l.has3DContent).length,
        0
      ),
    0
  ),
  lessonsWithSimulation: BDS_CURRICULUM.reduce(
    (sum, y) =>
      sum +
      y.subjects.reduce(
        (s2, sub) => s2 + sub.lessons.filter((l) => l.hasSimulation).length,
        0
      ),
    0
  ),
};

export function getBDSSubjectById(id: string): BDSSubject | undefined {
  for (const year of BDS_CURRICULUM) {
    const subject = year.subjects.find((s) => s.id === id);
    if (subject) return subject;
  }
  return undefined;
}

export function getBDSLessonById(lessonId: string): BDSLesson | undefined {
  for (const year of BDS_CURRICULUM) {
    for (const subject of year.subjects) {
      const lesson = subject.lessons.find((l) => l.id === lessonId);
      if (lesson) return lesson;
    }
  }
  return undefined;
}
