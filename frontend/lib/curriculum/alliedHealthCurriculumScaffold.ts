export interface AlliedLesson {
  id: string;
  title: string;
  ncahpCode: string;
  year: 1 | 2 | 3;
  hasSimulation: boolean;
  isHighTech: boolean;
  description: string;
}

export interface AlliedSubject {
  id: string;
  name: string;
  code: string;
  year: 1 | 2 | 3;
  creditHours: number;
  description: string;
  lessons: AlliedLesson[];
}

export interface AlliedMajor {
  id: string;
  name: string;
  code: string;
  duration: '3 years';
  description: string;
  subjects: AlliedSubject[];
}

export const ALLIED_HEALTH_MAJORS: AlliedMajor[] = [
  {
    id: 'perfusion',
    name: 'Perfusion Technology',
    code: 'BSCPERF',
    duration: '3 years',
    description: 'Cardiovascular perfusion, ECMO, and extracorporeal life support.',
    subjects: [
      {
        id: 'perf-s1',
        name: 'CPB Circuit Mechanics',
        code: 'PERF101',
        year: 1,
        creditHours: 4,
        description: 'Fundamentals of Cardiopulmonary Bypass mechanics.',
        lessons: [
          { id: 'l1', title: 'Circuit Priming', ncahpCode: 'NCAHP-PERF-1', year: 1, hasSimulation: true, isHighTech: true, description: 'Priming the circuit.' },
          { id: 'l2', title: 'Oxygenator Assembly', ncahpCode: 'NCAHP-PERF-2', year: 1, hasSimulation: false, isHighTech: true, description: 'Assembling oxygenators.' },
          { id: 'l3', title: 'Pump Control', ncahpCode: 'NCAHP-PERF-3', year: 1, hasSimulation: true, isHighTech: true, description: 'Controlling roller and centrifugal pumps.' }
        ]
      },
      {
        id: 'perf-s2',
        name: 'Advanced ECMO/VAD',
        code: 'PERF301',
        year: 3,
        creditHours: 4,
        description: 'Advanced extracorporeal membrane oxygenation.',
        lessons: [
          { id: 'l4', title: 'ECMO Cannulation', ncahpCode: 'NCAHP-PERF-4', year: 3, hasSimulation: true, isHighTech: true, description: 'Cannulation techniques.' },
          { id: 'l5', title: 'VAD Placement', ncahpCode: 'NCAHP-PERF-5', year: 3, hasSimulation: true, isHighTech: true, description: 'Ventricular assist device placement.' },
          { id: 'l6', title: 'Troubleshooting ECMO', ncahpCode: 'NCAHP-PERF-6', year: 3, hasSimulation: true, isHighTech: true, description: 'Troubleshooting alarms and issues.' }
        ]
      },
      {
        id: 'perf-s3',
        name: 'Clinical Perfusion Practice',
        code: 'PERF201',
        year: 2,
        creditHours: 4,
        description: 'Clinical perfusion during surgeries.',
        lessons: [
          { id: 'l7', title: 'Myocardial Protection', ncahpCode: 'NCAHP-PERF-7', year: 2, hasSimulation: true, isHighTech: false, description: 'Cardioplegia delivery.' },
          { id: 'l8', title: 'Coagulation Management', ncahpCode: 'NCAHP-PERF-8', year: 2, hasSimulation: true, isHighTech: false, description: 'ACT monitoring.' },
          { id: 'l9', title: 'Patient Weaning', ncahpCode: 'NCAHP-PERF-9', year: 2, hasSimulation: true, isHighTech: true, description: 'Weaning from bypass.' }
        ]
      }
    ]
  },
  {
    id: 'radiology',
    name: 'Radiology & Imaging Technology',
    code: 'BSCRIT',
    duration: '3 years',
    description: 'Advanced diagnostic imaging technology.',
    subjects: [
      {
        id: 'rad-s1',
        name: 'Radiation Physics & CT',
        code: 'RAD101',
        year: 1,
        creditHours: 4,
        description: 'Physics of radiation and computed tomography.',
        lessons: [
          { id: 'l10', title: 'X-Ray Generation', ncahpCode: 'NCAHP-RAD-1', year: 1, hasSimulation: false, isHighTech: false, description: 'X-ray tube mechanics.' },
          { id: 'l11', title: 'CT Slice Acquisition', ncahpCode: 'NCAHP-RAD-2', year: 1, hasSimulation: true, isHighTech: true, description: 'Helical CT scanning.' },
          { id: 'l12', title: 'Radiation Protection', ncahpCode: 'NCAHP-RAD-3', year: 1, hasSimulation: false, isHighTech: false, description: 'ALARA principles.' }
        ]
      },
      {
        id: 'rad-s2',
        name: 'MRI & Ultrasound',
        code: 'RAD201',
        year: 2,
        creditHours: 4,
        description: 'Magnetic resonance imaging and ultrasonography.',
        lessons: [
          { id: 'l13', title: 'MRI Sequences', ncahpCode: 'NCAHP-RAD-4', year: 2, hasSimulation: true, isHighTech: true, description: 'T1, T2, FLAIR.' },
          { id: 'l14', title: 'Ultrasound Transducers', ncahpCode: 'NCAHP-RAD-5', year: 2, hasSimulation: true, isHighTech: false, description: 'Probe selection.' },
          { id: 'l15', title: 'Doppler Imaging', ncahpCode: 'NCAHP-RAD-6', year: 2, hasSimulation: true, isHighTech: true, description: 'Color and spectral doppler.' }
        ]
      },
      {
        id: 'rad-s3',
        name: 'Interventional Radiology',
        code: 'RAD301',
        year: 3,
        creditHours: 4,
        description: 'Assisting in interventional procedures.',
        lessons: [
          { id: 'l16', title: 'Fluoroscopy Operations', ncahpCode: 'NCAHP-RAD-7', year: 3, hasSimulation: true, isHighTech: true, description: 'Operating the C-arm.' },
          { id: 'l17', title: 'Angiography Setup', ncahpCode: 'NCAHP-RAD-8', year: 3, hasSimulation: false, isHighTech: false, description: 'Cath lab preparation.' },
          { id: 'l18', title: 'Vascular Access', ncahpCode: 'NCAHP-RAD-9', year: 3, hasSimulation: true, isHighTech: true, description: 'Ultrasound guided access.' }
        ]
      }
    ]
  },
  {
    id: 'ot',
    name: 'Operation Theatre & Anaesthesia Tech',
    code: 'BSCOTT',
    duration: '3 years',
    description: 'Operation theatre workflows and anesthesia assistance.',
    subjects: [
      {
        id: 'ot-s1',
        name: 'OT Instrumentation & Sterile Processing',
        code: 'OTT101',
        year: 1,
        creditHours: 4,
        description: 'Surgical instruments and sterilization.',
        lessons: [
          { id: 'l19', title: 'Surgical Instrument ID', ncahpCode: 'NCAHP-OTT-1', year: 1, hasSimulation: false, isHighTech: false, description: 'Identifying forceps, retractors.' },
          { id: 'l20', title: 'Autoclave Operations', ncahpCode: 'NCAHP-OTT-2', year: 1, hasSimulation: true, isHighTech: false, description: 'Sterilization cycles.' },
          { id: 'l21', title: 'Scrubbing and Gowning', ncahpCode: 'NCAHP-OTT-3', year: 1, hasSimulation: true, isHighTech: false, description: 'Aseptic techniques.' }
        ]
      },
      {
        id: 'ot-s2',
        name: 'Anesthesia Workstations',
        code: 'OTT201',
        year: 2,
        creditHours: 4,
        description: 'Anesthesia delivery systems.',
        lessons: [
          { id: 'l22', title: 'Machine Checkout', ncahpCode: 'NCAHP-OTT-4', year: 2, hasSimulation: true, isHighTech: true, description: 'Pre-use checkout procedures.' },
          { id: 'l23', title: 'Vaporizer Operations', ncahpCode: 'NCAHP-OTT-5', year: 2, hasSimulation: true, isHighTech: true, description: 'Isoflurane and sevoflurane.' },
          { id: 'l24', title: 'Airway Equipment', ncahpCode: 'NCAHP-OTT-6', year: 2, hasSimulation: false, isHighTech: false, description: 'Laryngoscopes and tubes.' }
        ]
      },
      {
        id: 'ot-s3',
        name: 'Laparoscopic Technologies',
        code: 'OTT301',
        year: 3,
        creditHours: 4,
        description: 'Minimally invasive surgical tech.',
        lessons: [
          { id: 'l25', title: 'Camera Systems', ncahpCode: 'NCAHP-OTT-7', year: 3, hasSimulation: true, isHighTech: true, description: 'Setting up laparoscopes.' },
          { id: 'l26', title: 'Insufflators', ncahpCode: 'NCAHP-OTT-8', year: 3, hasSimulation: true, isHighTech: true, description: 'Pneumoperitoneum maintenance.' },
          { id: 'l27', title: 'Energy Devices', ncahpCode: 'NCAHP-OTT-9', year: 3, hasSimulation: false, isHighTech: true, description: 'Electrosurgery safety.' }
        ]
      }
    ]
  },
  {
    id: 'dialysis',
    name: 'Renal Dialysis Technology',
    code: 'BSCDIAL',
    duration: '3 years',
    description: 'Renal replacement therapies and machine maintenance.',
    subjects: [
      {
        id: 'dial-s1',
        name: 'Hemodialysis Technology',
        code: 'DIAL101',
        year: 1,
        creditHours: 4,
        description: 'Basics of hemodialysis.',
        lessons: [
          { id: 'l28', title: 'Extracorporeal Circuit', ncahpCode: 'NCAHP-DIAL-1', year: 1, hasSimulation: true, isHighTech: true, description: 'Circuit setup.' },
          { id: 'l29', title: 'Dialyzer Clearance', ncahpCode: 'NCAHP-DIAL-2', year: 1, hasSimulation: false, isHighTech: false, description: 'Clearance principles.' },
          { id: 'l30', title: 'Vascular Access Cannulation', ncahpCode: 'NCAHP-DIAL-3', year: 1, hasSimulation: true, isHighTech: false, description: 'AV fistula cannulation.' }
        ]
      },
      {
        id: 'dial-s2',
        name: 'CRRT & Peritoneal Dialysis',
        code: 'DIAL201',
        year: 2,
        creditHours: 4,
        description: 'Continuous renal replacement therapy.',
        lessons: [
          { id: 'l31', title: 'CRRT Modalities', ncahpCode: 'NCAHP-DIAL-4', year: 2, hasSimulation: true, isHighTech: true, description: 'CVVH, CVVHD, CVVHDF.' },
          { id: 'l32', title: 'PD Fluid Exchange', ncahpCode: 'NCAHP-DIAL-5', year: 2, hasSimulation: true, isHighTech: false, description: 'Peritoneal dialysis exchanges.' },
          { id: 'l33', title: 'Anticoagulation in CRRT', ncahpCode: 'NCAHP-DIAL-6', year: 2, hasSimulation: false, isHighTech: true, description: 'Citrate and heparin.' }
        ]
      },
      {
        id: 'dial-s3',
        name: 'Water Treatment & Reprocessing',
        code: 'DIAL301',
        year: 3,
        creditHours: 4,
        description: 'Water purification for dialysis.',
        lessons: [
          { id: 'l34', title: 'Reverse Osmosis Systems', ncahpCode: 'NCAHP-DIAL-7', year: 3, hasSimulation: true, isHighTech: true, description: 'RO system maintenance.' },
          { id: 'l35', title: 'Water Quality Testing', ncahpCode: 'NCAHP-DIAL-8', year: 3, hasSimulation: false, isHighTech: false, description: 'Chlorine and hardness testing.' },
          { id: 'l36', title: 'Dialyzer Reprocessing', ncahpCode: 'NCAHP-DIAL-9', year: 3, hasSimulation: true, isHighTech: false, description: 'Automated reprocessing.' }
        ]
      }
    ]
  }
];

export const ALLIED_HEALTH_METADATA = {
  programName: 'Allied Health Sciences & High-Tech Clinical Technologies',
  regulatoryBody: 'NCAHP (National Commission for Allied and Healthcare Professions)',
  totalMajors: 4
};

export function getAlliedMajorById(id: string): AlliedMajor | undefined {
  return ALLIED_HEALTH_MAJORS.find(m => m.id === id || m.code === id);
}
