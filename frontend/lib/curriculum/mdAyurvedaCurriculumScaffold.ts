export interface MDAyurvedaLesson {
  id: string;
  title: string;
  ccimCode: string;
  year: 1 | 2 | 3;
  has3DContent: boolean;
  hasSimulation: boolean;
  isResearchBased: boolean;
  description: string;
}

export interface MDAyurvedaSubject {
  id: string;
  name: string;
  code: string;
  year: 1 | 2 | 3;
  creditHours: number;
  description: string;
  lessons: MDAyurvedaLesson[];
}

export interface MDAyurvedaSpecialty {
  id: string;
  name: string;
  shortName: string;
  code: string;
  ccimSpecialtyCode: string;
  aiapgetMdsCode: string;
  duration: '3 years';
  description: string;
  subjects: MDAyurvedaSubject[];
}

export const MD_AYURVEDA_CURRICULUM: MDAyurvedaSpecialty[] = [
  {
    id: 'md-kayachikitsa',
    name: 'MD (Ayu) Kayachikitsa',
    shortName: 'Kayachikitsa',
    code: 'MD-KC',
    ccimSpecialtyCode: 'AYU-PG-01',
    aiapgetMdsCode: 'PG-KC',
    duration: '3 years',
    description: 'Postgraduate degree in Ayurvedic Internal Medicine.',
    subjects: [
      {
        id: 'kc-sub-1',
        name: 'Fundamentals of Kayachikitsa',
        code: 'KC-01',
        year: 1,
        creditHours: 200,
        description: 'Basic principles of internal medicine.',
        lessons: [
          { id: 'kc-l1', title: 'Concept of Agni and Ama', ccimCode: 'KC-L-01', year: 1, has3DContent: false, hasSimulation: false, isResearchBased: false, description: 'Detailed study.' },
          { id: 'kc-l2', title: 'Srotas and Sroto Dushti', ccimCode: 'KC-L-02', year: 1, has3DContent: true, hasSimulation: false, isResearchBased: false, description: 'Pathology of channels.' },
          { id: 'kc-l3', title: 'Trividha Karma', ccimCode: 'KC-L-03', year: 1, has3DContent: false, hasSimulation: true, isResearchBased: false, description: 'Three folds of action.' }
        ]
      },
      {
        id: 'kc-sub-2',
        name: 'Jwara and Infectious Diseases',
        code: 'KC-02',
        year: 2,
        creditHours: 250,
        description: 'Fever and infectious pathologies.',
        lessons: [
          { id: 'kc-l4', title: 'Jwara Nidana', ccimCode: 'KC-L-04', year: 2, has3DContent: false, hasSimulation: false, isResearchBased: true, description: 'Etiopathogenesis of Jwara.' },
          { id: 'kc-l5', title: 'Vishama Jwara', ccimCode: 'KC-L-05', year: 2, has3DContent: false, hasSimulation: false, isResearchBased: false, description: 'Malarial and intermittent fevers.' },
          { id: 'kc-l6', title: 'Ojas and Vyadhikshamatva', ccimCode: 'KC-L-06', year: 2, has3DContent: true, hasSimulation: false, isResearchBased: true, description: 'Immunity in Ayurveda.' }
        ]
      },
      {
        id: 'kc-sub-3',
        name: 'Vata Vyadhi and Degenerative Diseases',
        code: 'KC-03',
        year: 3,
        creditHours: 300,
        description: 'Neurological and musculoskeletal disorders.',
        lessons: [
          { id: 'kc-l7', title: 'Pakshaghata Management', ccimCode: 'KC-L-07', year: 3, has3DContent: false, hasSimulation: true, isResearchBased: true, description: 'Stroke rehabilitation.' },
          { id: 'kc-l8', title: 'Sandhigata Vata', ccimCode: 'KC-L-08', year: 3, has3DContent: true, hasSimulation: false, isResearchBased: false, description: 'Osteoarthritis.' },
          { id: 'kc-l9', title: 'Gridhrasi', ccimCode: 'KC-L-09', year: 3, has3DContent: false, hasSimulation: true, isResearchBased: false, description: 'Sciatica management.' }
        ]
      }
    ]
  },
  {
    id: 'ms-shalya',
    name: 'MS (Ayu) Shalya Tantra',
    shortName: 'Shalya Tantra',
    code: 'MS-ST',
    ccimSpecialtyCode: 'AYU-PG-02',
    aiapgetMdsCode: 'PG-ST',
    duration: '3 years',
    description: 'Postgraduate degree in Ayurvedic General Surgery.',
    subjects: [
      {
        id: 'st-sub-1',
        name: 'Principles of Surgery (Shalya)',
        code: 'ST-01',
        year: 1,
        creditHours: 200,
        description: 'Basic surgical principles.',
        lessons: [
          { id: 'st-l1', title: 'Yantra and Shastra', ccimCode: 'ST-L-01', year: 1, has3DContent: true, hasSimulation: false, isResearchBased: false, description: 'Surgical instruments.' },
          { id: 'st-l2', title: 'Sterilization Techniques', ccimCode: 'ST-L-02', year: 1, has3DContent: false, hasSimulation: true, isResearchBased: false, description: 'Asepsis in Ayurveda.' },
          { id: 'st-l3', title: 'Vrana (Wound) Management', ccimCode: 'ST-L-03', year: 1, has3DContent: true, hasSimulation: false, isResearchBased: true, description: 'Wound healing.' }
        ]
      },
      {
        id: 'st-sub-2',
        name: 'Ksharasutra and Anorectal Surgery',
        code: 'ST-02',
        year: 2,
        creditHours: 300,
        description: 'Specialized anorectal management.',
        lessons: [
          { id: 'st-l4', title: 'Preparation of Ksharasutra', ccimCode: 'ST-L-04', year: 2, has3DContent: false, hasSimulation: true, isResearchBased: true, description: 'Alkaline thread preparation.' },
          { id: 'st-l5', title: 'Arsha (Hemorrhoids)', ccimCode: 'ST-L-05', year: 2, has3DContent: true, hasSimulation: true, isResearchBased: false, description: 'Management of Arsha.' },
          { id: 'st-l6', title: 'Bhagandara (Fistula in ano)', ccimCode: 'ST-L-06', year: 2, has3DContent: true, hasSimulation: true, isResearchBased: true, description: 'Complex fistula treatment.' }
        ]
      },
      {
        id: 'st-sub-3',
        name: 'Advanced Operative Surgery',
        code: 'ST-03',
        year: 3,
        creditHours: 300,
        description: 'Modern and integrative surgery.',
        lessons: [
          { id: 'st-l7', title: 'Laparoscopic Ayurveda Basics', ccimCode: 'ST-L-07', year: 3, has3DContent: false, hasSimulation: true, isResearchBased: false, description: 'Intro to laparoscopy.' },
          { id: 'st-l8', title: 'Marma Surgery', ccimCode: 'ST-L-08', year: 3, has3DContent: true, hasSimulation: true, isResearchBased: true, description: 'Surgery around vital points.' },
          { id: 'st-l9', title: 'Asthi Bhagna (Fractures)', ccimCode: 'ST-L-09', year: 3, has3DContent: true, hasSimulation: false, isResearchBased: false, description: 'Orthopedics in Ayurveda.' }
        ]
      }
    ]
  },
  {
    id: 'ms-shalakya',
    name: 'MS (Ayu) Shalakya Tantra',
    shortName: 'Shalakya Tantra',
    code: 'MS-SKT',
    ccimSpecialtyCode: 'AYU-PG-03',
    aiapgetMdsCode: 'PG-SKT',
    duration: '3 years',
    description: 'Postgraduate degree in Ophthalmology and ENT.',
    subjects: [
      {
        id: 'skt-sub-1',
        name: 'Netra Roga (Ophthalmology)',
        code: 'SKT-01',
        year: 1,
        creditHours: 250,
        description: 'Eye diseases.',
        lessons: [
          { id: 'skt-l1', title: 'Anatomy of Eye (Netra Sharira)', ccimCode: 'SKT-L-01', year: 1, has3DContent: true, hasSimulation: false, isResearchBased: false, description: 'Ocular anatomy.' },
          { id: 'skt-l2', title: 'Timira and Cataract', ccimCode: 'SKT-L-02', year: 1, has3DContent: false, hasSimulation: true, isResearchBased: true, description: 'Vision defects.' },
          { id: 'skt-l3', title: 'Arma (Pterygium)', ccimCode: 'SKT-L-03', year: 1, has3DContent: true, hasSimulation: false, isResearchBased: false, description: 'Conjunctival diseases.' }
        ]
      },
      {
        id: 'skt-sub-2',
        name: 'Kriya Kalpa',
        code: 'SKT-02',
        year: 2,
        creditHours: 200,
        description: 'Ocular therapeutics.',
        lessons: [
          { id: 'skt-l4', title: 'Tarpana', ccimCode: 'SKT-L-04', year: 2, has3DContent: false, hasSimulation: true, isResearchBased: false, description: 'Nourishing eye therapies.' },
          { id: 'skt-l5', title: 'Putapaka and Seka', ccimCode: 'SKT-L-05', year: 2, has3DContent: false, hasSimulation: true, isResearchBased: false, description: 'Ocular wash and drops.' },
          { id: 'skt-l6', title: 'Anjana Applications', ccimCode: 'SKT-L-06', year: 2, has3DContent: true, hasSimulation: false, isResearchBased: true, description: 'Collyrium.' }
        ]
      },
      {
        id: 'skt-sub-3',
        name: 'ENT and Dentistry',
        code: 'SKT-03',
        year: 3,
        creditHours: 250,
        description: 'Ear, Nose, Throat, and Oral Cavity.',
        lessons: [
          { id: 'skt-l7', title: 'Karna Roga', ccimCode: 'SKT-L-07', year: 3, has3DContent: true, hasSimulation: false, isResearchBased: false, description: 'Ear diseases.' },
          { id: 'skt-l8', title: 'Nasa Roga and Pratishyaya', ccimCode: 'SKT-L-08', year: 3, has3DContent: false, hasSimulation: true, isResearchBased: false, description: 'Rhinitis and nasal polyps.' },
          { id: 'skt-l9', title: 'Mukha Roga', ccimCode: 'SKT-L-09', year: 3, has3DContent: true, hasSimulation: false, isResearchBased: true, description: 'Oral and dental diseases.' }
        ]
      }
    ]
  },
  {
    id: 'md-panchakarma',
    name: 'MD (Ayu) Panchakarma',
    shortName: 'Panchakarma',
    code: 'MD-PK',
    ccimSpecialtyCode: 'AYU-PG-04',
    aiapgetMdsCode: 'PG-PK',
    duration: '3 years',
    description: 'Postgraduate degree in Bio-cleansing Therapies.',
    subjects: [
      {
        id: 'pk-sub-1',
        name: 'Purvakarma',
        code: 'PK-01',
        year: 1,
        creditHours: 200,
        description: 'Preparatory procedures.',
        lessons: [
          { id: 'pk-l1', title: 'Snehana (Oleation)', ccimCode: 'PK-L-01', year: 1, has3DContent: false, hasSimulation: true, isResearchBased: false, description: 'Internal and external oleation.' },
          { id: 'pk-l2', title: 'Swedana (Sudation)', ccimCode: 'PK-L-02', year: 1, has3DContent: true, hasSimulation: false, isResearchBased: false, description: 'Fomentation therapies.' },
          { id: 'pk-l3', title: 'Shirodhara Mechanics', ccimCode: 'PK-L-03', year: 1, has3DContent: false, hasSimulation: true, isResearchBased: true, description: 'Mechanisms of Shirodhara.' }
        ]
      },
      {
        id: 'pk-sub-2',
        name: 'Pradhana Karma',
        code: 'PK-02',
        year: 2,
        creditHours: 300,
        description: 'Main bio-cleansing therapies.',
        lessons: [
          { id: 'pk-l4', title: 'Vamana (Emesis)', ccimCode: 'PK-L-04', year: 2, has3DContent: false, hasSimulation: true, isResearchBased: true, description: 'Therapeutic emesis.' },
          { id: 'pk-l5', title: 'Virechana (Purgation)', ccimCode: 'PK-L-05', year: 2, has3DContent: false, hasSimulation: true, isResearchBased: false, description: 'Therapeutic purgation.' },
          { id: 'pk-l6', title: 'Basti (Enema)', ccimCode: 'PK-L-06', year: 2, has3DContent: true, hasSimulation: true, isResearchBased: true, description: 'Medicated enema.' }
        ]
      },
      {
        id: 'pk-sub-3',
        name: 'Advanced Bio-Cleansing and Trials',
        code: 'PK-03',
        year: 3,
        creditHours: 250,
        description: 'Clinical trials and advanced procedures.',
        lessons: [
          { id: 'pk-l7', title: 'Nasya and Raktamokshana', ccimCode: 'PK-L-07', year: 3, has3DContent: true, hasSimulation: false, isResearchBased: false, description: 'Nasal drops and bloodletting.' },
          { id: 'pk-l8', title: 'Paschat Karma', ccimCode: 'PK-L-08', year: 3, has3DContent: false, hasSimulation: false, isResearchBased: false, description: 'Post-operative care.' },
          { id: 'pk-l9', title: 'Clinical Trials in PK', ccimCode: 'PK-L-09', year: 3, has3DContent: false, hasSimulation: false, isResearchBased: true, description: 'Research methodologies.' }
        ]
      }
    ]
  },
  {
    id: 'md-dravyaguna',
    name: 'MD (Ayu) Dravyaguna Vigyana',
    shortName: 'Dravyaguna',
    code: 'MD-DG',
    ccimSpecialtyCode: 'AYU-PG-05',
    aiapgetMdsCode: 'PG-DG',
    duration: '3 years',
    description: 'Postgraduate degree in Ayurvedic Pharmacology.',
    subjects: [
      {
        id: 'dg-sub-1',
        name: 'Fundamentals of Dravyaguna',
        code: 'DG-01',
        year: 1,
        creditHours: 200,
        description: 'Principles of drug action.',
        lessons: [
          { id: 'dg-l1', title: 'Rasa, Guna, Virya, Vipaka', ccimCode: 'DG-L-01', year: 1, has3DContent: false, hasSimulation: false, isResearchBased: false, description: 'Pharmacodynamics.' },
          { id: 'dg-l2', title: 'Prabhava', ccimCode: 'DG-L-02', year: 1, has3DContent: false, hasSimulation: false, isResearchBased: false, description: 'Specific action of drugs.' },
          { id: 'dg-l3', title: 'Nighantu (Lexicons)', ccimCode: 'DG-L-03', year: 1, has3DContent: false, hasSimulation: false, isResearchBased: true, description: 'Historical texts.' }
        ]
      },
      {
        id: 'dg-sub-2',
        name: 'Phytopharmacognosy',
        code: 'DG-02',
        year: 2,
        creditHours: 300,
        description: 'Identification of drugs.',
        lessons: [
          { id: 'dg-l4', title: 'Macroscopic Identification', ccimCode: 'DG-L-04', year: 2, has3DContent: true, hasSimulation: false, isResearchBased: false, description: 'Plant morphology.' },
          { id: 'dg-l5', title: 'Microscopic Evaluation', ccimCode: 'DG-L-05', year: 2, has3DContent: true, hasSimulation: false, isResearchBased: true, description: 'Cellular structures.' },
          { id: 'dg-l6', title: 'Standardization Techniques', ccimCode: 'DG-L-06', year: 2, has3DContent: false, hasSimulation: true, isResearchBased: true, description: 'Quality control.' }
        ]
      },
      {
        id: 'dg-sub-3',
        name: 'Advanced Phytopharmacology',
        code: 'DG-03',
        year: 3,
        creditHours: 250,
        description: 'Modern analytical methods.',
        lessons: [
          { id: 'dg-l7', title: 'HPTLC and HPLC', ccimCode: 'DG-L-07', year: 3, has3DContent: false, hasSimulation: true, isResearchBased: true, description: 'Chromatographic techniques.' },
          { id: 'dg-l8', title: 'Experimental Pharmacology', ccimCode: 'DG-L-08', year: 3, has3DContent: false, hasSimulation: true, isResearchBased: true, description: 'Animal models.' },
          { id: 'dg-l9', title: 'Adverse Drug Reactions', ccimCode: 'DG-L-09', year: 3, has3DContent: false, hasSimulation: false, isResearchBased: false, description: 'Pharmacovigilance.' }
        ]
      }
    ]
  },
  {
    id: 'md-rasashastra',
    name: 'MD (Ayu) Rasa Shastra & Bhaishajya Kalpana',
    shortName: 'RSBK',
    code: 'MD-RSBK',
    ccimSpecialtyCode: 'AYU-PG-06',
    aiapgetMdsCode: 'PG-RSBK',
    duration: '3 years',
    description: 'Postgraduate degree in Iatrochemistry and Pharmaceuticals.',
    subjects: [
      {
        id: 'rs-sub-1',
        name: 'Rasa Shastra Fundamentals',
        code: 'RS-01',
        year: 1,
        creditHours: 250,
        description: 'Basics of alchemy and minerals.',
        lessons: [
          { id: 'rs-l1', title: 'Parada (Mercury)', ccimCode: 'RS-L-01', year: 1, has3DContent: true, hasSimulation: false, isResearchBased: false, description: 'Processing of Mercury.' },
          { id: 'rs-l2', title: 'Maharasa and Uparasa', ccimCode: 'RS-L-02', year: 1, has3DContent: true, hasSimulation: false, isResearchBased: false, description: 'Major and minor minerals.' },
          { id: 'rs-l3', title: 'Shodhana (Purification)', ccimCode: 'RS-L-03', year: 1, has3DContent: false, hasSimulation: true, isResearchBased: false, description: 'Toxicity reduction.' }
        ]
      },
      {
        id: 'rs-sub-2',
        name: 'Bhaishajya Kalpana',
        code: 'RS-02',
        year: 2,
        creditHours: 250,
        description: 'Herbal pharmacy.',
        lessons: [
          { id: 'rs-l4', title: 'Panchavidha Kashaya Kalpana', ccimCode: 'RS-L-04', year: 2, has3DContent: false, hasSimulation: true, isResearchBased: false, description: 'Five basic dosage forms.' },
          { id: 'rs-l5', title: 'Asava and Arishta', ccimCode: 'RS-L-05', year: 2, has3DContent: false, hasSimulation: true, isResearchBased: false, description: 'Fermented preparations.' },
          { id: 'rs-l6', title: 'Taila and Ghrita Kalpana', ccimCode: 'RS-L-06', year: 2, has3DContent: false, hasSimulation: true, isResearchBased: false, description: 'Medicated oils and ghee.' }
        ]
      },
      {
        id: 'rs-sub-3',
        name: 'Advanced Pharmaceutics',
        code: 'RS-03',
        year: 3,
        creditHours: 300,
        description: 'Modern manufacturing.',
        lessons: [
          { id: 'rs-l7', title: 'Bhasma Nanotechnology', ccimCode: 'RS-L-07', year: 3, has3DContent: true, hasSimulation: false, isResearchBased: true, description: 'Nanoparticles in Ayurveda.' },
          { id: 'rs-l8', title: 'GMP Compliance', ccimCode: 'RS-L-08', year: 3, has3DContent: false, hasSimulation: false, isResearchBased: true, description: 'Good Manufacturing Practices.' },
          { id: 'rs-l9', title: 'Quality Control of Bhasma', ccimCode: 'RS-L-09', year: 3, has3DContent: false, hasSimulation: true, isResearchBased: true, description: 'Analytical testing.' }
        ]
      }
    ]
  },
  {
    id: 'md-prasuti',
    name: 'MD (Ayu) Prasuti Tantra & Stri Roga',
    shortName: 'Prasuti & Stri Roga',
    code: 'MD-PT',
    ccimSpecialtyCode: 'AYU-PG-07',
    aiapgetMdsCode: 'PG-PT',
    duration: '3 years',
    description: 'Postgraduate degree in Obstetrics and Gynecology.',
    subjects: [
      {
        id: 'pt-sub-1',
        name: 'Prasuti Tantra (Obstetrics)',
        code: 'PT-01',
        year: 1,
        creditHours: 250,
        description: 'Care of pregnant women.',
        lessons: [
          { id: 'pt-l1', title: 'Garbha Vigyana', ccimCode: 'PT-L-01', year: 1, has3DContent: true, hasSimulation: false, isResearchBased: false, description: 'Embryology.' },
          { id: 'pt-l2', title: 'Garbhini Paricharya', ccimCode: 'PT-L-02', year: 1, has3DContent: false, hasSimulation: false, isResearchBased: false, description: 'Antenatal care.' },
          { id: 'pt-l3', title: 'High-risk Garbhini Care', ccimCode: 'PT-L-03', year: 1, has3DContent: false, hasSimulation: true, isResearchBased: true, description: 'Managing complications.' }
        ]
      },
      {
        id: 'pt-sub-2',
        name: 'Stri Roga (Gynecology)',
        code: 'PT-02',
        year: 2,
        creditHours: 250,
        description: 'Women health issues.',
        lessons: [
          { id: 'pt-l4', title: 'Artava Vyapad', ccimCode: 'PT-L-04', year: 2, has3DContent: true, hasSimulation: false, isResearchBased: false, description: 'Menstrual disorders.' },
          { id: 'pt-l5', title: 'Yonivyapad', ccimCode: 'PT-L-05', year: 2, has3DContent: false, hasSimulation: true, isResearchBased: false, description: 'Vaginal and uterine diseases.' },
          { id: 'pt-l6', title: 'Infertility (Vandhyatva)', ccimCode: 'PT-L-06', year: 2, has3DContent: false, hasSimulation: false, isResearchBased: true, description: 'Evaluation and management.' }
        ]
      },
      {
        id: 'pt-sub-3',
        name: 'Surgical Procedures in OBG',
        code: 'PT-03',
        year: 3,
        creditHours: 250,
        description: 'Operative obstetrics and gynecology.',
        lessons: [
          { id: 'pt-l7', title: 'Prasava (Delivery) Management', ccimCode: 'PT-L-07', year: 3, has3DContent: false, hasSimulation: true, isResearchBased: false, description: 'Normal and abnormal labor.' },
          { id: 'pt-l8', title: 'Sutika Paricharya', ccimCode: 'PT-L-08', year: 3, has3DContent: false, hasSimulation: false, isResearchBased: false, description: 'Postnatal care.' },
          { id: 'pt-l9', title: 'Gynecological Surgeries', ccimCode: 'PT-L-09', year: 3, has3DContent: true, hasSimulation: true, isResearchBased: false, description: 'Surgical interventions.' }
        ]
      }
    ]
  },
  {
    id: 'md-kaumarbhritya',
    name: 'MD (Ayu) Kaumarbhritya',
    shortName: 'Kaumarbhritya',
    code: 'MD-KB',
    ccimSpecialtyCode: 'AYU-PG-08',
    aiapgetMdsCode: 'PG-KB',
    duration: '3 years',
    description: 'Postgraduate degree in Pediatrics.',
    subjects: [
      {
        id: 'kb-sub-1',
        name: 'Navajata Shishu (Neonatology)',
        code: 'KB-01',
        year: 1,
        creditHours: 200,
        description: 'Newborn care.',
        lessons: [
          { id: 'kb-l1', title: 'Pranapratyagamana', ccimCode: 'KB-L-01', year: 1, has3DContent: false, hasSimulation: true, isResearchBased: false, description: 'Neonatal resuscitation.' },
          { id: 'kb-l2', title: 'Navajata Paricharya', ccimCode: 'KB-L-02', year: 1, has3DContent: false, hasSimulation: false, isResearchBased: false, description: 'Routine newborn care.' },
          { id: 'kb-l3', title: 'Neonatal Disorders', ccimCode: 'KB-L-03', year: 1, has3DContent: true, hasSimulation: true, isResearchBased: true, description: 'Jaundice, infections.' }
        ]
      },
      {
        id: 'kb-sub-2',
        name: 'Bala Roga (Pediatric Diseases)',
        code: 'KB-02',
        year: 2,
        creditHours: 250,
        description: 'Childhood illnesses.',
        lessons: [
          { id: 'kb-l4', title: 'Kuposhana (Malnutrition)', ccimCode: 'KB-L-04', year: 2, has3DContent: false, hasSimulation: false, isResearchBased: true, description: 'Nutritional disorders.' },
          { id: 'kb-l5', title: 'Respiratory Disorders', ccimCode: 'KB-L-05', year: 2, has3DContent: true, hasSimulation: true, isResearchBased: false, description: 'Asthma, pneumonia.' },
          { id: 'kb-l6', title: 'Gastrointestinal Disorders', ccimCode: 'KB-L-06', year: 2, has3DContent: true, hasSimulation: false, isResearchBased: false, description: 'Diarrhea, worms.' }
        ]
      },
      {
        id: 'kb-sub-3',
        name: 'Developmental and Preventive Pediatrics',
        code: 'KB-03',
        year: 3,
        creditHours: 300,
        description: 'Growth, development, and immunity.',
        lessons: [
          { id: 'kb-l7', title: 'Developmental Milestones', ccimCode: 'KB-L-07', year: 3, has3DContent: false, hasSimulation: false, isResearchBased: false, description: 'Normal child development.' },
          { id: 'kb-l8', title: 'Developmental Pediatrics', ccimCode: 'KB-L-08', year: 3, has3DContent: true, hasSimulation: false, isResearchBased: true, description: 'Autism, ADHD, CP.' },
          { id: 'kb-l9', title: 'Suvarnaprashana Immunology', ccimCode: 'KB-L-09', year: 3, has3DContent: false, hasSimulation: true, isResearchBased: true, description: 'Immunomodulation.' }
        ]
      }
    ]
  }
];

export function getMDAyurvedaSpecialtyById(id: string): MDAyurvedaSpecialty | undefined {
  return MD_AYURVEDA_CURRICULUM.find(s => s.id === id);
}

export const MD_AYURVEDA_METADATA = {
  totalSpecialties: MD_AYURVEDA_CURRICULUM.length,
  domain: 'AYUSH',
  programType: 'Postgraduate'
};
