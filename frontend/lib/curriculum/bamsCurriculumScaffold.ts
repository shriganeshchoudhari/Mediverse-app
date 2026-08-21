/**
 * BAMS (Bachelor of Ayurvedic Medicine & Surgery) Curriculum Scaffold
 *
 * 5.5-year / 9-semester CCIM-recognized curriculum featuring the iconic
 * 3D 107 Marma Points interactive map, Tridosha-ANS correlation modules,
 * Panchakarma procedure guides, and Dravyaguna herb pharmacology.
 *
 * Regulatory Body: Central Council of Indian Medicine (CCIM)
 * Duration: 5.5 years (4.5 years academic + 1 year compulsory internship)
 * Program Route: /healthcare/ayush
 */

export interface BAMSLesson {
  id: string;
  title: string;
  ccimCode: string;
  has3DContent: boolean;
  hasSimulation: boolean;
  hasMarmaDiagram: boolean;
  description: string;
}

export interface BAMSSubject {
  id: string;
  name: string;
  sanskritName: string;
  code: string;
  semester: number;
  year: number;
  creditHours: number;
  description: string;
  lessons: BAMSLesson[];
}

export interface BAMSYear {
  year: number;
  title: string;
  semesters: number[];
  subjects: BAMSSubject[];
}

export const BAMS_CURRICULUM: BAMSYear[] = [
  // ─── Year 1 (Semesters 1–2): Fundamental Ayurvedic Sciences ──────────────
  {
    year: 1,
    title: 'First BAMS — Fundamental Ayurvedic Sciences',
    semesters: [1, 2],
    subjects: [
      {
        id: 'bams-ss',
        name: 'Padartha Vigyana & Ayurveda Itihas (Samhita Sanskrit)',
        sanskritName: 'पदार्थ विज्ञान आयुर्वेद इतिहास',
        code: 'BAMS-SS',
        semester: 1,
        year: 1,
        creditHours: 8,
        description: 'Philosophical foundations of Ayurveda — Samkhya, Vaisheshika, Nyaya, and Mimamsa philosophies as applied to Ayurvedic epistemology.',
        lessons: [
          {
            id: 'ss-001',
            title: 'Tridosha Theory — Vata, Pitta & Kapha: Properties & Functions',
            ccimCode: 'SS1.1',
            has3DContent: false,
            hasSimulation: false,
            hasMarmaDiagram: false,
            description: 'The three biological humors (Doshas) — their Panchamahabhuta composition, Guna (properties), Karma (actions), and seat (Moolasthana).',
          },
          {
            id: 'ss-002',
            title: 'Panchamahabhuta — Five Elements & Sense Organ Correlation',
            ccimCode: 'SS1.2',
            has3DContent: false,
            hasSimulation: false,
            hasMarmaDiagram: false,
            description: 'Akasha, Vayu, Tejas, Jala, Prithvi — their sensory modalities, tissue affinities, and Dosha composition.',
          },
          {
            id: 'ss-003',
            title: 'Tridosha & ANS Correlation — Modern Biomedical Bridge',
            ccimCode: 'SS1.3',
            has3DContent: false,
            hasSimulation: true,
            hasMarmaDiagram: false,
            description: 'Correlation of Vata with Nervous System, Pitta with Metabolic-Endocrine axis, Kapha with Anabolic-Immune axis — with ANS simulation overlay.',
          },
          {
            id: 'ss-004',
            title: 'Prakriti Analysis — Constitutional Assessment & Genetic Correlation',
            ccimCode: 'SS2.1',
            has3DContent: false,
            hasSimulation: false,
            hasMarmaDiagram: false,
            description: 'Psychobiological constitution (Prakriti) — Vata, Pitta, Kapha and Dvandva Prakriti types with lifestyle implications.',
          },
        ],
      },
      {
        id: 'bams-rs',
        name: 'Rachana Sharira (Ayurvedic Anatomy)',
        sanskritName: 'रचना शरीर',
        code: 'BAMS-RS',
        semester: 2,
        year: 1,
        creditHours: 10,
        description: 'Classical Ayurvedic anatomy from Sushruta Samhita — Sira, Snayu, Asthi, Sandhi, and the 107 Marma Points with modern anatomical correlations.',
        lessons: [
          {
            id: 'rs-001',
            title: '107 Marma Points — Locations, Categories & Clinical Significance',
            ccimCode: 'RS1.1',
            has3DContent: true,
            hasSimulation: false,
            hasMarmaDiagram: true,
            description: 'Interactive 3D body map of all 107 Marma points (Mamsalantra, Sira, Sandhi, Snayu, Asthi Marmas) with vulnerability grades (Sadya Pranahara, Kalantara Pranahara, Vaikalyakara, Rujakara, Vishalyaghna).',
          },
          {
            id: 'rs-002',
            title: 'Sadya Pranahara Marmas — Instantly Fatal Points & Surgical Implications',
            ccimCode: 'RS1.2',
            has3DContent: true,
            hasSimulation: false,
            hasMarmaDiagram: true,
            description: '19 Sadya Pranahara Marmas with 3D anatomical overlay showing modern neurovascular correlations.',
          },
          {
            id: 'rs-003',
            title: 'Saptadhatu — Seven Body Tissues & Progressive Nourishment',
            ccimCode: 'RS2.1',
            has3DContent: false,
            hasSimulation: false,
            hasMarmaDiagram: false,
            description: 'Rasa, Rakta, Mamsa, Meda, Asthi, Majja, Shukra — Dhatu-Upadhatu-Mala triad with Agni-Dhatu metabolism concept.',
          },
          {
            id: 'rs-004',
            title: 'Srotas — 13 Channels & Their Moolasthana',
            ccimCode: 'RS3.1',
            has3DContent: true,
            hasSimulation: false,
            hasMarmaDiagram: false,
            description: 'Physiological channels (Srotas) with origin points and pathological disturbances — 3D channel network visualization.',
          },
          {
            id: 'rs-005',
            title: 'Asthi (Bones) & Sandhi (Joints) — Classical vs Modern Correlation',
            ccimCode: 'RS4.1',
            has3DContent: true,
            hasSimulation: false,
            hasMarmaDiagram: false,
            description: '360 bone count of Ayurveda vs 206 modern anatomy — reconciliation through developmental classification.',
          },
        ],
      },
    ],
  },

  // ─── Year 2 (Semesters 3–4): Physiology & Pharmacology ───────────────────
  {
    year: 2,
    title: 'Second BAMS — Ayurvedic Physiology & Pharmacology',
    semesters: [3, 4],
    subjects: [
      {
        id: 'bams-ks',
        name: 'Kriya Sharira (Ayurvedic Physiology)',
        sanskritName: 'क्रिया शरीर',
        code: 'BAMS-KS',
        semester: 3,
        year: 2,
        creditHours: 10,
        description: 'Ayurvedic functional physiology — Agni, Ojas, Ama theory correlated with modern physiology of digestion, metabolism, immunity, and nervous function.',
        lessons: [
          {
            id: 'ks-001',
            title: 'Agni — 13 Types & Digestive Physiology Correlation',
            ccimCode: 'KS1.1',
            has3DContent: false,
            hasSimulation: false,
            hasMarmaDiagram: false,
            description: 'Jatharagni (primary digestive fire), Bhutagni (elemental fires), Dhatvagni (tissue fires) — correlated with digestive enzymes, metabolism, and mitochondrial function.',
          },
          {
            id: 'ks-002',
            title: 'Ojas — Essence of Immunity & Modern Immunological Correlation',
            ccimCode: 'KS2.1',
            has3DContent: false,
            hasSimulation: false,
            hasMarmaDiagram: false,
            description: 'Para and Apara Ojas — correlation with immunoglobulins, NK cells, and adaptive immunity. Ojas depletion and autoimmune disease.',
          },
          {
            id: 'ks-003',
            title: 'Ama — Metabolic Toxin Theory & Oxidative Stress',
            ccimCode: 'KS3.1',
            has3DContent: false,
            hasSimulation: false,
            hasMarmaDiagram: false,
            description: 'Ama formation from Mandagni (decreased Agni) — correlation with metabolic syndrome, oxidative stress markers, and reactive oxygen species.',
          },
          {
            id: 'ks-004',
            title: 'Manas (Mind) — Satva, Rajas, Tamas & Psychoneuroimmunology',
            ccimCode: 'KS4.1',
            has3DContent: false,
            hasSimulation: false,
            hasMarmaDiagram: false,
            description: 'Three qualities of mind — correlation with limbic system, stress hormones (cortisol, catecholamines), and psychosomatic disease.',
          },
        ],
      },
      {
        id: 'bams-dg',
        name: 'Dravyaguna Vigyana (Ayurvedic Pharmacology)',
        sanskritName: 'द्रव्यगुण विज्ञान',
        code: 'BAMS-DG',
        semester: 4,
        year: 2,
        creditHours: 10,
        description: 'Pharmacological properties of Ayurvedic medicinal plants — Rasa (taste), Guna (properties), Veerya (potency), Vipaka (post-digestive effect), and Karma (actions).',
        lessons: [
          {
            id: 'dg-001',
            title: 'Rasa-Guna-Veerya-Vipaka-Prabhava Framework — Drug Action Principles',
            ccimCode: 'DG1.1',
            has3DContent: false,
            hasSimulation: false,
            hasMarmaDiagram: false,
            description: 'The five attributes of Ayurvedic drug action — how taste, properties, potency, metabolic transformation, and unique action determine clinical use.',
          },
          {
            id: 'dg-002',
            title: 'Ashwagandha (Withania somnifera) — Adaptogen & Modern Pharmacology',
            ccimCode: 'DG2.1',
            has3DContent: false,
            hasSimulation: false,
            hasMarmaDiagram: false,
            description: 'Withanolide phytochemistry, HPA axis modulation, cortisol reduction, and clinical evidence for stress, testosterone, and cognition.',
          },
          {
            id: 'dg-003',
            title: 'Turmeric (Curcuma longa) — Curcumin Bioavailability & Anti-inflammatory Mechanism',
            ccimCode: 'DG2.2',
            has3DContent: false,
            hasSimulation: false,
            hasMarmaDiagram: false,
            description: 'NF-κB pathway inhibition, COX-2 suppression, piperine enhancement of bioavailability, and clinical applications in inflammatory conditions.',
          },
          {
            id: 'dg-004',
            title: 'Shatavari (Asparagus racemosus) — Rasayana & Hormone Modulation',
            ccimCode: 'DG2.3',
            has3DContent: false,
            hasSimulation: false,
            hasMarmaDiagram: false,
            description: 'Steroidal saponins, phytoestrogen activity, galactagogue mechanism, and adaptogenic immunomodulation.',
          },
          {
            id: 'dg-005',
            title: 'Herb-Drug Interactions — Safety Matrix for Modern Polypharmacy',
            ccimCode: 'DG3.1',
            has3DContent: false,
            hasSimulation: false,
            hasMarmaDiagram: false,
            description: 'CYP450 interactions of Ayurvedic herbs with allopathic drugs — warfarin, statins, antidiabetics, and antiretrovirals.',
          },
        ],
      },
    ],
  },

  // ─── Year 3 (Semesters 5–6): Classical Texts & Rasa Shastra ──────────────
  {
    year: 3,
    title: 'Third BAMS — Classical Texts & Rasa Shastra',
    semesters: [5, 6],
    subjects: [
      {
        id: 'bams-ch',
        name: 'Charaka Samhita (Purvardha)',
        sanskritName: 'चरक संहिता (पूर्वार्ध)',
        code: 'BAMS-CH',
        semester: 5,
        year: 3,
        creditHours: 8,
        description: 'First 15 chapters of Charaka Samhita — Sutrasthana, focusing on fundamental principles of Ayurveda, dietetics, and preventive medicine.',
        lessons: [
          {
            id: 'ch-001',
            title: 'Dinacharya & Ritucharya — Daily & Seasonal Regimen for Health Maintenance',
            ccimCode: 'CH1.1',
            has3DContent: false,
            hasSimulation: false,
            hasMarmaDiagram: false,
            description: 'Circadian health routines (waking time, oral hygiene, exercise) correlated with modern chrono-biology and circadian rhythm science.',
          },
          {
            id: 'ch-002',
            title: 'Trividha Pariksha — Three Methods of Ayurvedic Examination',
            ccimCode: 'CH2.1',
            has3DContent: false,
            hasSimulation: false,
            hasMarmaDiagram: false,
            description: 'Darshana (inspection), Sparshana (palpation), Prashna (interrogation) — classical examination framework correlated with clinical SOAP format.',
          },
        ],
      },
      {
        id: 'bams-rash',
        name: 'Rasa Shastra & Bhaishajya Kalpana (Ayurvedic Pharmaceutics)',
        sanskritName: 'रस शास्त्र भैषज्य कल्पना',
        code: 'BAMS-RASH',
        semester: 6,
        year: 3,
        creditHours: 10,
        description: 'Ayurvedic metallurgy and pharmaceutical preparations — Bhasmas, Rasa Aushadhi, Asava-Arishta, Churna, Vati and their quality control standards.',
        lessons: [
          {
            id: 'rash-001',
            title: 'Shodhan & Maran — Purification & Incineration of Metals & Minerals',
            ccimCode: 'RASH1.1',
            has3DContent: false,
            hasSimulation: false,
            hasMarmaDiagram: false,
            description: 'Purification (Shodhan) and incineration (Marana) processes for mercury, gold, silver, copper, and iron — modern toxicological safety perspective.',
          },
          {
            id: 'rash-002',
            title: 'Swarna Bhasma — Gold Nanoparticle Preparation & Immunomodulation',
            ccimCode: 'RASH2.1',
            has3DContent: false,
            hasSimulation: false,
            hasMarmaDiagram: false,
            description: 'Traditional Swarna Bhasma preparation correlated with modern gold nanoparticle synthesis and immunomodulatory research evidence.',
          },
          {
            id: 'rash-003',
            title: 'Quality Control of Bhasmas — WHO & API Standards',
            ccimCode: 'RASH3.1',
            has3DContent: false,
            hasSimulation: false,
            hasMarmaDiagram: false,
            description: 'XRD, particle size analysis, heavy metal limits (AYUSH standards), and API monograph compliance for Bhasma preparations.',
          },
        ],
      },
    ],
  },

  // ─── Year 4 (Semesters 7–8): Clinical Medicine ────────────────────────────
  {
    year: 4,
    title: 'Fourth BAMS — Clinical Ayurvedic Medicine',
    semesters: [7, 8],
    subjects: [
      {
        id: 'bams-kk',
        name: 'Kayachikitsa (Internal Medicine — General)',
        sanskritName: 'कायचिकित्सा',
        code: 'BAMS-KK',
        semester: 7,
        year: 4,
        creditHours: 12,
        description: 'Ayurvedic diagnosis and treatment of general medical conditions — Jwara, Atisara, Grahani, Prameha (Diabetes), Hridroga, and Shotha.',
        lessons: [
          {
            id: 'kk-001',
            title: 'Prameha (Diabetes Mellitus) — Dosha Pathology & Therapeutic Protocol',
            ccimCode: 'KK1.1',
            has3DContent: false,
            hasSimulation: false,
            hasMarmaDiagram: false,
            description: '20 types of Prameha, Kapha-Meda-Kleda pathology, and Ayurvedic management (diet, Yoga, Gudmar, Jambu, Bitter Gourd) with glycemic evidence.',
          },
          {
            id: 'kk-002',
            title: 'Panchakarma — Vamana, Virechana, Basti, Nasya & Raktamokshana',
            ccimCode: 'KK2.1',
            has3DContent: false,
            hasSimulation: true,
            hasMarmaDiagram: false,
            description: 'Five therapeutic elimination procedures with clinical indications, contraindications, sequential protocols, and modern physiological rationale.',
          },
          {
            id: 'kk-003',
            title: 'Rasayana Therapy — Rejuvenation & Anti-aging Protocols',
            ccimCode: 'KK3.1',
            has3DContent: false,
            hasSimulation: false,
            hasMarmaDiagram: false,
            description: 'Kutipraveshika (indoor) and Vatatapika (outdoor) Rasayana regimens — Chyawanprash, Amalaki, Brahmi Rasayana with clinical evidence.',
          },
        ],
      },
      {
        id: 'bams-st',
        name: 'Shalya Tantra (Ayurvedic Surgery)',
        sanskritName: 'शल्य तन्त्र',
        code: 'BAMS-ST',
        semester: 8,
        year: 4,
        creditHours: 10,
        description: 'Sushruta\'s surgical system — Yantra, Shastra, Kshara, Agnikarma, Raktamokshana, and Vrana (wound) management.',
        lessons: [
          {
            id: 'st-001',
            title: 'Sushruta\'s 8 Shalya Karma Types — Classical Surgical Classification',
            ccimCode: 'ST1.1',
            has3DContent: false,
            hasSimulation: false,
            hasMarmaDiagram: false,
            description: 'Chedana (excision), Bhedana (incision), Lekhana (scarification), Vyadhana (puncturing), Esana (exploration), Aharana (extraction), Visravana (drainage), Seevana (suturing).',
          },
          {
            id: 'st-002',
            title: 'Ksharasutra — Medicated Thread Therapy for Ano-Rectal Disorders',
            ccimCode: 'ST2.1',
            has3DContent: true,
            hasSimulation: false,
            hasMarmaDiagram: false,
            description: 'Ksharasutra preparation (Apamarga, Haridra, Snuhi), ano-rectal anatomy, fistula-in-ano thread placement procedure with 3D sphincter anatomy.',
          },
          {
            id: 'st-003',
            title: 'Agnikarma — Thermal Cauterization & Modern Electrocautery Correlation',
            ccimCode: 'ST3.1',
            has3DContent: false,
            hasSimulation: false,
            hasMarmaDiagram: false,
            description: 'Agnikarma instruments (Shalaka), indications in musculoskeletal pain, and comparison with modern electrocautery and heat therapy.',
          },
        ],
      },
    ],
  },

  // ─── Year 5 (Semester 9 + Internship): Advanced Clinical & Internship ──────
  {
    year: 5,
    title: 'Fifth BAMS — Prasuti Tantra, Shalakya & Compulsory Internship',
    semesters: [9],
    subjects: [
      {
        id: 'bams-pt',
        name: 'Prasuti Tantra & Stri Roga (Obstetrics & Gynaecology)',
        sanskritName: 'प्रसूति तन्त्र स्त्री रोग',
        code: 'BAMS-PT',
        semester: 9,
        year: 5,
        creditHours: 10,
        description: 'Ayurvedic obstetrics and gynaecology — Antenatal care, Garbhasamskar, safe delivery, postpartum care (Sutika Paricharya), and gynaecological disorders.',
        lessons: [
          {
            id: 'pt-001',
            title: 'Garbhini Paricharya — Antenatal Care Month-by-Month',
            ccimCode: 'PT1.1',
            has3DContent: false,
            hasSimulation: false,
            hasMarmaDiagram: false,
            description: 'Month-specific diet, herbs, yoga, and lifestyle modifications during pregnancy correlated with modern obstetric guidelines.',
          },
          {
            id: 'pt-002',
            title: 'Sutika Paricharya — Postpartum Care & Lactation Support',
            ccimCode: 'PT2.1',
            has3DContent: false,
            hasSimulation: false,
            hasMarmaDiagram: false,
            description: '45-day postpartum regimen — medicated ghee, oil massage, Shatavari lactation support, and uterine involution protocols.',
          },
          {
            id: 'pt-003',
            title: 'Artava Kshaya (Amenorrhoea) & Artava Vyapat — Gynaecological Disorders',
            ccimCode: 'PT3.1',
            has3DContent: false,
            hasSimulation: false,
            hasMarmaDiagram: false,
            description: 'Ayurvedic classification of menstrual disorders correlated with PCOS, endometriosis, and hyperprolactinemia.',
          },
        ],
      },
      {
        id: 'bams-sk',
        name: 'Shalakya Tantra (ENT, Ophthalmology & Dentistry)',
        sanskritName: 'शालाक्य तन्त्र',
        code: 'BAMS-SK',
        semester: 9,
        year: 5,
        creditHours: 8,
        description: 'Urdhvanga (head-neck-sensory organ) Chikitsa — Netra Roga (eye diseases), Karna Roga (ear diseases), Nasa Roga (nasal diseases), and Mukha Roga (oral diseases).',
        lessons: [
          {
            id: 'sk-001',
            title: 'Timira & Linganasha — Cataracts & Couching Procedure (Shashtriya Chikitsa)',
            ccimCode: 'SK1.1',
            has3DContent: true,
            hasSimulation: false,
            hasMarmaDiagram: false,
            description: 'Sushruta\'s Linganasha classification, Couching (Vatahara) procedure history, and modern cataract surgery comparison.',
          },
          {
            id: 'sk-002',
            title: 'Nasya Karma — Nasal Drug Administration & CNS Delivery',
            ccimCode: 'SK2.1',
            has3DContent: false,
            hasSimulation: false,
            hasMarmaDiagram: false,
            description: 'Five types of Nasya — Pradhaman, Brumhana, Shamana, Navana, Marshya — with modern intranasal drug delivery correlations.',
          },
        ],
      },
    ],
  },
];

// ─── Summary Metadata ──────────────────────────────────────────────────────────

export const BAMS_METADATA = {
  programName: 'Bachelor of Ayurvedic Medicine & Surgery',
  abbreviation: 'BAMS',
  totalYears: 5,
  totalSemesters: 9,
  internshipMonths: 12,
  regulatoryBody: 'Central Council of Indian Medicine (CCIM)',
  competencyPrefix: 'BAMS',
  routePath: '/healthcare/ayush',
  totalSubjects: BAMS_CURRICULUM.reduce((sum, y) => sum + y.subjects.length, 0),
  totalLessons: BAMS_CURRICULUM.reduce(
    (sum, y) => sum + y.subjects.reduce((s2, sub) => s2 + sub.lessons.length, 0),
    0
  ),
  marmaLessons: BAMS_CURRICULUM.reduce(
    (sum, y) =>
      sum +
      y.subjects.reduce(
        (s2, sub) => s2 + sub.lessons.filter((l) => l.hasMarmaDiagram).length,
        0
      ),
    0
  ),
  lessonsWith3D: BAMS_CURRICULUM.reduce(
    (sum, y) =>
      sum +
      y.subjects.reduce(
        (s2, sub) => s2 + sub.lessons.filter((l) => l.has3DContent).length,
        0
      ),
    0
  ),
  lessonsWithSimulation: BAMS_CURRICULUM.reduce(
    (sum, y) =>
      sum +
      y.subjects.reduce(
        (s2, sub) => s2 + sub.lessons.filter((l) => l.hasSimulation).length,
        0
      ),
    0
  ),
};

export function getBAMSSubjectById(id: string): BAMSSubject | undefined {
  for (const year of BAMS_CURRICULUM) {
    const subject = year.subjects.find((s) => s.id === id);
    if (subject) return subject;
  }
  return undefined;
}

export function getBAMSLessonById(lessonId: string): BAMSLesson | undefined {
  for (const year of BAMS_CURRICULUM) {
    for (const subject of year.subjects) {
      const lesson = subject.lessons.find((l) => l.id === lessonId);
      if (lesson) return lesson;
    }
  }
  return undefined;
}

/** Get all lessons that have the 3D Marma Point diagram */
export function getAllMarmaLessons(): BAMSLesson[] {
  const result: BAMSLesson[] = [];
  for (const year of BAMS_CURRICULUM) {
    for (const subject of year.subjects) {
      result.push(...subject.lessons.filter((l) => l.hasMarmaDiagram));
    }
  }
  return result;
}
