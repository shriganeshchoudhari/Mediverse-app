/**
 * OSCEExamSkills.ts
 * Clinical Examination State Machine, Auscultation Mapping, and Holistic Competency Rubrics
 * Used by Mediverse OSCE Exam Simulator.
 * Location: frontend/.gemini/skills/OSCEExamSkills.ts
 */

export interface AuscultationPoint {
  id: string;
  name: string;
  anatomicalLocation: string;
  xPercent: number; // 0-100% on anterior/posterior thorax map
  yPercent: number; // 0-100%
  view: 'anterior' | 'posterior';
  system: 'cardiac' | 'pulmonary';
  normalSoundDescription: string;
  pathologicalSoundDescription: string;
  audioFrequencyHz: number;
  modulationType: 'normal' | 'murmur_systolic' | 'murmur_diastolic' | 'gallop_s3' | 'wheeze' | 'crackles_fine' | 'crackles_coarse' | 'bronchial';
  clinicalSignificance: string;
}

export interface OsceStation {
  id: string;
  stationNumber: number;
  title: string;
  stationType: 'HISTORY' | 'EXAMINATION' | 'INVESTIGATION' | 'PRESCRIPTION_COUNSELING' | 'ATTENDING_VIVA';
  durationSeconds: number;
  clinicalPrompt: string;
  patientVignette: string;
  requiredActions: string[];
  contraindicatedActions: string[];
  auscultationPoints?: AuscultationPoint[];
  investigationOptions?: {
    id: string;
    name: string;
    costUnits: number;
    turnaroundSeconds: number;
    resultText: string;
    isAppropriate: boolean;
    explanation: string;
  }[];
  expectedDiagnosis: string[];
  scoringWeights: {
    communication: number; // 0-25
    diagnosticPrecision: number; // 0-25
    safetyAndContraindications: number; // 0-25
    timeManagement: number; // 0-25
  };
}

export interface OsceScenario {
  id: string;
  title: string;
  specialty: string;
  patientDemographics: {
    name: string;
    age: number;
    gender: string;
    triageCategory: 'RED' | 'YELLOW' | 'GREEN';
    chiefComplaint: string;
  };
  initialVitals: {
    heartRate: number;
    bloodPressure: string;
    respiratoryRate: number;
    spO2: number;
    temperatureCelsius: number;
  };
  stations: OsceStation[];
}

export interface OsceCandidateAction {
  stationId: string;
  timestamp: number;
  actionType: string;
  detail: string;
  isContraindicated?: boolean;
}

export interface OsceScoreReport {
  scenarioId: string;
  totalScore: number; // 0-100%
  passed: boolean;
  communicationScore: number;
  diagnosticPrecisionScore: number;
  safetyScore: number;
  timeManagementScore: number;
  stationBreakdown: {
    stationNumber: number;
    title: string;
    score: number;
    feedback: string[];
    missedCriticalActions: string[];
    safetyViolations: string[];
  }[];
  attendingSummaryFeedback: string;
}

/**
 * Standard Cardiac and Pulmonary Auscultation Landmark Points
 */
export const AUSCULTATION_POINTS: AuscultationPoint[] = [
  // Cardiac Points (Anterior)
  {
    id: 'aortic',
    name: 'Aortic Area',
    anatomicalLocation: '2nd Right Intercostal Space at Right Sternal Border',
    xPercent: 42,
    yPercent: 32,
    view: 'anterior',
    system: 'cardiac',
    normalSoundDescription: 'Crisp S2 louder than S1. No ejection murmur.',
    pathologicalSoundDescription: 'Crescendo-decrescendo harsh systolic ejection murmur radiating to right carotid.',
    audioFrequencyHz: 280,
    modulationType: 'murmur_systolic',
    clinicalSignificance: 'Classic for Aortic Stenosis (triad: angina, syncope, dyspnea).',
  },
  {
    id: 'pulmonic',
    name: 'Pulmonic Area',
    anatomicalLocation: '2nd Left Intercostal Space at Left Sternal Border',
    xPercent: 58,
    yPercent: 32,
    view: 'anterior',
    system: 'cardiac',
    normalSoundDescription: 'Physiological splitting of S2 on inspiration.',
    pathologicalSoundDescription: 'Fixed wide splitting of S2 with systolic flow murmur.',
    audioFrequencyHz: 240,
    modulationType: 'normal',
    clinicalSignificance: 'Hallmark of Atrial Septal Defect (ostium secundum type).',
  },
  {
    id: 'erbs_point',
    name: "Erb's Point",
    anatomicalLocation: '3rd Left Intercostal Space at Left Sternal Border',
    xPercent: 57,
    yPercent: 42,
    view: 'anterior',
    system: 'cardiac',
    normalSoundDescription: 'Equal intensity of S1 and S2.',
    pathologicalSoundDescription: 'Early diastolic decrescendo high-pitched murmur heard best with diaphragm while patient sits up and leans forward.',
    audioFrequencyHz: 350,
    modulationType: 'murmur_diastolic',
    clinicalSignificance: 'Characteristic for Aortic Regurgitation.',
  },
  {
    id: 'tricuspid',
    name: 'Tricuspid Area',
    anatomicalLocation: '4th & 5th Left Intercostal Space at Lower Left Sternal Border',
    xPercent: 55,
    yPercent: 54,
    view: 'anterior',
    system: 'cardiac',
    normalSoundDescription: 'Normal S1 and S2 closure.',
    pathologicalSoundDescription: 'Holosystolic blowing murmur increasing with inspiration (Carvallo sign).',
    audioFrequencyHz: 220,
    modulationType: 'murmur_systolic',
    clinicalSignificance: 'Tricuspid Regurgitation (secondary to pulmonary hypertension or IV drug use endocarditis).',
  },
  {
    id: 'mitral_apex',
    name: 'Mitral Area (Cardiac Apex)',
    anatomicalLocation: '5th Left Intercostal Space at Midclavicular Line',
    xPercent: 68,
    yPercent: 62,
    view: 'anterior',
    system: 'cardiac',
    normalSoundDescription: 'Prominent S1 followed by S2.',
    pathologicalSoundDescription: 'Blowing pansystolic murmur radiating to left axilla; prominent S3 gallop indicating volume overload.',
    audioFrequencyHz: 180,
    modulationType: 'gallop_s3',
    clinicalSignificance: 'Mitral Regurgitation and Acute Decompensated Heart Failure (HFrEF).',
  },

  // Pulmonary Points (Anterior & Posterior)
  {
    id: 'pulmonary_right_apex',
    name: 'Right Upper Lobe Apex',
    anatomicalLocation: 'Supraclavicular Fossa / 1st Anterior ICS',
    xPercent: 35,
    yPercent: 20,
    view: 'anterior',
    system: 'pulmonary',
    normalSoundDescription: 'Clear vesicular breath sounds throughout.',
    pathologicalSoundDescription: 'High-pitched monophonic wheeze and prolonged expiratory phase.',
    audioFrequencyHz: 440,
    modulationType: 'wheeze',
    clinicalSignificance: 'Asthma exacerbation or acute bronchospasm.',
  },
  {
    id: 'pulmonary_left_apex',
    name: 'Left Upper Lobe Apex',
    anatomicalLocation: 'Supraclavicular Fossa / 1st Anterior ICS',
    xPercent: 65,
    yPercent: 20,
    view: 'anterior',
    system: 'pulmonary',
    normalSoundDescription: 'Clear vesicular breath sounds.',
    pathologicalSoundDescription: 'Wheezing and air trapping.',
    audioFrequencyHz: 420,
    modulationType: 'wheeze',
    clinicalSignificance: 'Airway hyperreactivity.',
  },
  {
    id: 'pulmonary_right_base',
    name: 'Right Posterior Base',
    anatomicalLocation: 'Posterior Thorax T9-T10 Infrascapular Area',
    xPercent: 32,
    yPercent: 72,
    view: 'posterior',
    system: 'pulmonary',
    normalSoundDescription: 'Vesicular sounds, gentle rustling quality.',
    pathologicalSoundDescription: 'End-inspiratory fine "Velcro-like" crackles (crepitations) and bronchial breathing.',
    audioFrequencyHz: 320,
    modulationType: 'crackles_fine',
    clinicalSignificance: 'Right lower lobe pneumonia consolidation or pulmonary edema.',
  },
  {
    id: 'pulmonary_left_base',
    name: 'Left Posterior Base',
    anatomicalLocation: 'Posterior Thorax T9-T10 Infrascapular Area',
    xPercent: 68,
    yPercent: 72,
    view: 'posterior',
    system: 'pulmonary',
    normalSoundDescription: 'Clear vesicular breath sounds.',
    pathologicalSoundDescription: 'Bibasilar coarse inspiratory crackles.',
    audioFrequencyHz: 310,
    modulationType: 'crackles_coarse',
    clinicalSignificance: 'Congestive heart failure with alveolar exudate.',
  },
];

/**
 * Exemplar OSCE Scenarios
 */
export const SEEDED_OSCE_SCENARIOS: OsceScenario[] = [
  {
    id: 'osce-stemi-cardiology',
    title: 'Acute Coronary Syndrome — Anterior Wall STEMI',
    specialty: 'Emergency Medicine / Cardiology',
    patientDemographics: {
      name: 'Ramesh Sundaram',
      age: 56,
      gender: 'Male',
      triageCategory: 'RED',
      chiefComplaint: 'Crushing substernal chest pressure radiating to left jaw & diaphoresis for 90 minutes',
    },
    initialVitals: {
      heartRate: 104,
      bloodPressure: '88/58',
      respiratoryRate: 24,
      spO2: 93,
      temperatureCelsius: 36.8,
    },
    stations: [
      {
        id: 'station-1',
        stationNumber: 1,
        title: 'Station 1: Rapid Clinical History & Risk Stratification',
        stationType: 'HISTORY',
        durationSeconds: 360,
        clinicalPrompt: 'Conduct an urgent 5-minute focused chest pain history. Assess onset, radiation, OPQRST, cardiovascular risk factors, and rule out aortic dissection contraindications to thrombolytics.',
        patientVignette: '56-year-old heavy smoker with hypertension and type 2 diabetes. Pain is 10/10, heavy like an elephant on his chest, accompanied by cold sweats and nausea.',
        requiredActions: [
          'Introduce self & confirm patient identity',
          'Assess pain radiation to arm, neck, or jaw',
          'Ask about sudden ripping/tearing pain to back (Aortic Dissection rule-out)',
          'Check for active bleeding, peptic ulcer, or recent stroke',
          'Establish time of symptom onset (critical for PCI door-to-balloon window)'
        ],
        contraindicatedActions: [
          'Delaying workup for extensive past surgical history',
          'Dismissing pain as musculoskeletal without vitals assessment',
          'Recommending patient go home with antacids'
        ],
        expectedDiagnosis: ['Acute ST-Elevation Myocardial Infarction (STEMI)', 'Aortic Dissection', 'Pulmonary Embolism'],
        scoringWeights: { communication: 25, diagnosticPrecision: 25, safetyAndContraindications: 25, timeManagement: 25 }
      },
      {
        id: 'station-2',
        stationNumber: 2,
        title: 'Station 2: Focused Physical & Auscultatory Examination',
        stationType: 'EXAMINATION',
        durationSeconds: 360,
        clinicalPrompt: 'Perform a targeted cardiovascular and pulmonary examination using the virtual stethoscope. Auscultate for murmurs, S3/S4 gallop, and bilateral pulmonary crackles indicating cardiogenic pulmonary edema.',
        patientVignette: 'Patient appears pale, diaphoretic, and in acute distress. JVP is elevated to 4 cm above sternal angle.',
        auscultationPoints: AUSCULTATION_POINTS,
        requiredActions: [
          'Auscultate cardiac apex for S3 gallop indicating ventricular dysfunction',
          'Auscultate posterior lung bases for pulmonary edema crackles',
          'Auscultate aortic area to rule out new aortic regurgitation murmur (dissection hallmark)',
          'Assess bilateral radial pulses for radio-radial delay'
        ],
        contraindicatedActions: [
          'Omitting chest auscultation entirely',
          'Administering fluid bolus without checking lung crackles and JVP'
        ],
        expectedDiagnosis: ['Cardiogenic shock secondary to extensive anterior MI', 'Acute Pulmonary Edema'],
        scoringWeights: { communication: 20, diagnosticPrecision: 30, safetyAndContraindications: 30, timeManagement: 20 }
      },
      {
        id: 'station-3',
        stationNumber: 3,
        title: 'Station 3: Diagnostic Investigations & Emergency Orders',
        stationType: 'INVESTIGATION',
        durationSeconds: 360,
        clinicalPrompt: 'Select and interpret stat emergency diagnostic investigations. Identify the high-risk rhythm on 12-lead ECG and order appropriate biomarker and laboratory panels.',
        patientVignette: 'Immediate 12-lead ECG obtained within 10 minutes of presentation.',
        investigationOptions: [
          {
            id: 'ecg_12_lead',
            name: 'Stat 12-Lead Electrocardiogram (ECG)',
            costUnits: 15,
            turnaroundSeconds: 30,
            resultText: 'Marked ST-segment elevations (4mm) in leads V1-V4 with reciprocal ST depressions in II, III, aVF. Hyperacute T-waves.',
            isAppropriate: true,
            explanation: 'First-line mandatory diagnostic test within 10 minutes for any acute chest pain.'
          },
          {
            id: 'cardiac_troponin',
            name: 'Stat High-Sensitivity Cardiac Troponin I (hs-cTnI)',
            costUnits: 25,
            turnaroundSeconds: 60,
            resultText: 'hs-cTnI: 1,480 ng/L (Reference: <14 ng/L). Markedly elevated.',
            isAppropriate: true,
            explanation: 'Confirms myocardial necrosis, though reperfusion should NOT be delayed waiting for lab result if ECG is diagnostic.'
          },
          {
            id: 'portable_cxr',
            name: 'Stat Portable Chest Radiography (CXR)',
            costUnits: 20,
            turnaroundSeconds: 120,
            resultText: 'Mild cephalization of pulmonary vasculature, normal mediastinal width (no widening).',
            isAppropriate: true,
            explanation: 'Rules out widened mediastinum (aortic dissection) and assesses pulmonary edema.'
          },
          {
            id: 'd_dimer',
            name: 'Serum D-Dimer Quantitative Assay',
            costUnits: 30,
            turnaroundSeconds: 180,
            resultText: 'D-Dimer: 420 ng/mL (Normal <500 ng/mL). Negative.',
            isAppropriate: false,
            explanation: 'Low utility when ECG already demonstrates diagnostic ST elevations.'
          },
          {
            id: 'ct_angiography_chest',
            name: 'Stat CT Pulmonary Angiography (CTPA)',
            costUnits: 120,
            turnaroundSeconds: 600,
            resultText: 'Delays primary percutaneous coronary intervention (PPCI).',
            isAppropriate: false,
            explanation: 'Contraindicated to transport an unstable STEMI in cardiogenic shock to CT scan without clear dissection suspicion.'
          }
        ],
        requiredActions: [
          'Order Stat 12-lead ECG immediately',
          'Order High-sensitivity Troponin I',
          'Recognize ST-segment elevation in V1-V4 (LAD occlusion)',
          'Avoid unnecessary delaying imaging (CT scan) prior to cath lab activation'
        ],
        contraindicatedActions: [
          'Ordering abdominal ultrasound for chest pain',
          'Waiting for repeated troponins before cath lab activation in obvious STEMI'
        ],
        expectedDiagnosis: ['Acute Anterior Wall STEMI due to proximal LAD occlusion'],
        scoringWeights: { communication: 15, diagnosticPrecision: 35, safetyAndContraindications: 35, timeManagement: 15 }
      },
      {
        id: 'station-4',
        stationNumber: 4,
        title: 'Station 4: Emergency Pharmacotherapy & CPOE Ordering',
        stationType: 'PRESCRIPTION_COUNSELING',
        durationSeconds: 360,
        clinicalPrompt: 'Formulate stat pharmacotherapy for acute STEMI and counsel the anxious patient on emergency catheterization (PPCI).',
        patientVignette: 'Patient BP is 88/58 mmHg. Heart rate is 104 bpm. Patient is anxious about dying.',
        requiredActions: [
          'Administer Aspirin 300 mg chewable stat',
          'Administer P2Y12 inhibitor (Ticagrelor 180 mg or Clopidogrel 300-600 mg)',
          'Activate Cath Lab for Primary PCI (Door-to-Balloon <90 mins)',
          'Withhold Nitroglycerin due to hypotension (SBP <90 mmHg)',
          'Counsel patient with calm reassurance explaining emergency heart catheterization'
        ],
        contraindicatedActions: [
          'Administering sublingual or IV Nitroglycerin when SBP is <90 mmHg (risks circulatory collapse)',
          'Administering oral beta-blockers in acute cardiogenic shock / hypotension'
        ],
        expectedDiagnosis: ['Acute STEMI Management with Dual Antiplatelet Therapy (DAPT) and Cath Lab Activation'],
        scoringWeights: { communication: 25, diagnosticPrecision: 25, safetyAndContraindications: 35, timeManagement: 15 }
      },
      {
        id: 'station-5',
        stationNumber: 5,
        title: 'Station 5: Attending Viva & Differential Justification',
        stationType: 'ATTENDING_VIVA',
        durationSeconds: 360,
        clinicalPrompt: 'Defend your management choices to the Attending Cardiologist. Explain the vascular territory, justify avoiding nitrates, and identify reperfusion timeline targets.',
        patientVignette: 'Attending: "Doctor, explain why you withheld nitrates and what your door-to-balloon time goal is for this 56-year-old gentleman."',
        requiredActions: [
          'Identify Left Anterior Descending (LAD) coronary artery as culprit lesion',
          'Explain that nitrates decrease preload and precipitate profound cardiovascular collapse in SBP <90',
          'State international target: Door-to-Balloon time < 90 minutes (or Door-to-Needle < 30 mins if PCI unavailable)',
          'Mention secondary prevention (High-intensity Statin, ACEi/ARB once hemodynamically stable)'
        ],
        contraindicatedActions: [
          'Stating Right Coronary Artery for anterior leads V1-V4',
          'Claiming thrombolysis is superior to primary PCI at a tertiary PCI center'
        ],
        expectedDiagnosis: ['Anterior STEMI Viva Defense'],
        scoringWeights: { communication: 30, diagnosticPrecision: 35, safetyAndContraindications: 20, timeManagement: 15 }
      }
    ]
  }
];

/**
 * Web Audio API Pathological Sound Generator
 * Generates synthesized heart murmurs, S3 gallops, wheezes, and fine crackles directly in browser.
 */
export class AuscultationAudioSynthesizer {
  private audioCtx: AudioContext | null = null;
  private activeOscillator: OscillatorNode | null = null;
  private activeGain: GainNode | null = null;
  private noiseNode: AudioBufferSourceNode | null = null;

  public init() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
  }

  public playPointSound(point: AuscultationPoint, heartRateBpm = 75) {
    this.stop();
    this.init();
    if (!this.audioCtx) return;

    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    const ctx = this.audioCtx;
    const beatDuration = 60 / heartRateBpm;

    if (point.system === 'cardiac') {
      this.playCardiacCycle(ctx, point, beatDuration);
    } else {
      this.playPulmonaryCycle(ctx, point);
    }
  }

  private playCardiacCycle(ctx: AudioContext, point: AuscultationPoint, beatDuration: number) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(point.audioFrequencyHz, ctx.currentTime);

    // Repeating heart beat envelope (S1 - S2 - Murmur/Gallop)
    const now = ctx.currentTime;
    gain.gain.setValueAtTime(0, now);

    // S1 beat
    gain.gain.linearRampToValueAtTime(0.7, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    // If systolic murmur, generate crescendo-decrescendo between S1 and S2
    if (point.modulationType === 'murmur_systolic') {
      gain.gain.linearRampToValueAtTime(0.45, now + 0.22);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);
    }

    // S2 beat
    gain.gain.linearRampToValueAtTime(0.6, now + 0.35);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    // If S3 gallop, add low-frequency third heart sound
    if (point.modulationType === 'gallop_s3') {
      gain.gain.linearRampToValueAtTime(0.35, now + 0.52);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.60);
    }

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();

    this.activeOscillator = osc;
    this.activeGain = gain;
  }

  private playPulmonaryCycle(ctx: AudioContext, point: AuscultationPoint) {
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.4;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = point.modulationType === 'wheeze' ? 'bandpass' : 'lowpass';
    filter.frequency.setValueAtTime(point.audioFrequencyHz, ctx.currentTime);
    filter.Q.setValueAtTime(point.modulationType === 'wheeze' ? 8.0 : 1.2, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.2, ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    whiteNoise.start();

    this.noiseNode = whiteNoise;
    this.activeGain = gain;
  }

  public stop() {
    try {
      if (this.activeOscillator) {
        this.activeOscillator.stop();
        this.activeOscillator.disconnect();
        this.activeOscillator = null;
      }
      if (this.noiseNode) {
        this.noiseNode.stop();
        this.noiseNode.disconnect();
        this.noiseNode = null;
      }
      if (this.activeGain) {
        this.activeGain.disconnect();
        this.activeGain = null;
      }
    } catch {
      // ignore clean shutdown errors
    }
  }
}

/**
 * Holistic Candidate Evaluation Algorithm
 */
export function evaluateCandidateOSCEPerformance(
  scenario: OsceScenario,
  actions: OsceCandidateAction[],
  timeRemainingSeconds: number
): OsceScoreReport {
  let totalScore = 0;
  const breakdown: OsceScoreReport['stationBreakdown'] = [];

  scenario.stations.forEach((station) => {
    const stationActions = actions.filter((a) => a.stationId === station.id);
    const completedActionTexts = stationActions.map((a) => a.detail.toLowerCase());

    // 1. Required Actions Check
    const completedRequired = station.requiredActions.filter((req) =>
      completedActionTexts.some((act) => act.includes(req.toLowerCase()) || req.toLowerCase().includes(act))
    );
    const missedRequired = station.requiredActions.filter((req) => !completedRequired.includes(req));

    // 2. Contraindications Check
    const triggeredViolations = station.contraindicatedActions.filter((bad) =>
      completedActionTexts.some((act) => act.includes(bad.toLowerCase()))
    );

    // Scoring calculation
    const actionScoreRatio = station.requiredActions.length > 0 
      ? completedRequired.length / station.requiredActions.length 
      : 1;

    let stationScore = actionScoreRatio * 100;
    // Penalty for each safety violation (-25 points)
    stationScore = Math.max(0, stationScore - (triggeredViolations.length * 25));

    totalScore += stationScore;

    const feedbackList: string[] = [];
    if (completedRequired.length === station.requiredActions.length) {
      feedbackList.push('Exemplary clinical precision: Completed all core protocol checkpoints.');
    } else {
      feedbackList.push(`Completed ${completedRequired.length}/${station.requiredActions.length} required actions.`);
    }

    if (triggeredViolations.length > 0) {
      feedbackList.push(`SAFETY WARNING: Triggered ${triggeredViolations.length} critical clinical contraindication(s).`);
    }

    breakdown.push({
      stationNumber: station.stationNumber,
      title: station.title,
      score: Math.round(stationScore),
      feedback: feedbackList,
      missedCriticalActions: missedRequired,
      safetyViolations: triggeredViolations,
    });
  });

  const overallScorePercent = Math.round(totalScore / scenario.stations.length);
  const timeBonus = timeRemainingSeconds > 60 ? 5 : 0;
  const finalScore = Math.min(100, overallScorePercent + timeBonus);

  return {
    scenarioId: scenario.id,
    totalScore: finalScore,
    passed: finalScore >= 70,
    communicationScore: Math.min(100, Math.round(finalScore * 0.95)),
    diagnosticPrecisionScore: Math.min(100, Math.round(finalScore * 0.98)),
    safetyScore: breakdown.some((b) => b.safetyViolations.length > 0) ? 55 : 95,
    timeManagementScore: timeRemainingSeconds > 0 ? 90 : 65,
    stationBreakdown: breakdown,
    attendingSummaryFeedback:
      finalScore >= 85
        ? 'High Honors: Demonstrated outstanding clinical acumen, immediate life-saving triage prioritization, and rigorous avoidance of contraindicated medications.'
        : finalScore >= 70
        ? 'Satisfactory Pass: Adequately identified the culprit pathology and standard emergency therapies. Review targeted auscultatory findings and bedside communication precision.'
        : 'Remediation Advised: Critical diagnostic delay or medication safety contraindication triggered. Must repeat simulated station with emphasis on emergency ACS guidelines.',
  };
}
