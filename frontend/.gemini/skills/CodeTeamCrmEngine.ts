/**
 * CodeTeamCrmEngine.ts
 * Crisis Resource Management (CRM), Anesthesiology & Multi-User Code Team Synchronization Workstation
 *
 * Models:
 * - 6 interprofessional resuscitation roles (Team Leader, Compressor, Airway, Defibrillator, Med Nurse, Scribe)
 * - Closed-loop communication verification protocol (Callout -> Readback -> Confirmation)
 * - Chest Compression Fraction (CCF target >= 80%) and CPR quality metrics
 * - 2-Minute AHA ACLS cardiac arrest cycle choreography with pre-charge hovering
 * - Cognitive overload, team stress index, and situational awareness telemetry
 * - Reversible etiology checklists (5 H's and 5 T's)
 *
 * Location: frontend/.gemini/skills/CodeTeamCrmEngine.ts
 */

export type TeamRole =
  | 'TEAM_LEADER'
  | 'COMPRESSOR'
  | 'AIRWAY_MANAGER'
  | 'DEFIBRILLATOR_OPERATOR'
  | 'MEDICATION_NURSE'
  | 'SCRIBE_RECORDER';

export interface TeamMember {
  role: TeamRole;
  title: string;
  assignedUser: string;
  avatarColor: string;
  currentAction: string;
  fatiguePercent: number; // 0-100%
  taskReadiness: 'ready' | 'active' | 'overloaded' | 'fatigued';
  activeRoleResponsibilities: string[];
}

export interface CommunicationMessage {
  id: string;
  senderRole: TeamRole;
  senderName: string;
  content: string;
  timestampSeconds: number;
  type: 'DIRECTIVE' | 'CALLOUT' | 'READBACK' | 'CONFIRMATION' | 'ALERT';
  isClosedLoop: boolean;
  closedLoopId?: string;
}

export interface CrmTelemetry {
  elapsedSeconds: number;
  cycleTimerSeconds: number; // 0-120 seconds for ACLS cycle
  cycleCount: number;
  chestCompressionFraction: number; // 0.0 - 1.0 (target >= 0.80)
  totalHandsOnSeconds: number;
  totalHandsOffSeconds: number;
  compressorRateBpm: number; // target 100-120
  compressorDepthMm: number; // target 50-60 mm (5-6 cm)
  etco2MmHg: number; // Quantitative waveform capnography
  teamStressIndex: number; // 0-100%
  closedLoopCompliancePercent: number; // 0-100%
  currentRhythm: 'VF' | 'pVT' | 'PEA' | 'ASYSTOLE' | 'ROSC';
  shocksDelivered: number;
  epinephrineDosesGiven: number;
  amiodaroneDosesGiven: number;
}

export interface ReversibleCause {
  id: string;
  name: string;
  type: 'H' | 'T';
  isIdentified: boolean;
  isTreated: boolean;
  clinicalClue: string;
  correctIntervention: string;
}

export interface CrmScenario {
  id: string;
  title: string;
  location: string;
  patientDescription: string;
  initialRhythm: 'VF' | 'pVT' | 'PEA' | 'ASYSTOLE' | 'ROSC';
  underlyingCauseId: string;
  suggestedTeamMembers: Record<TeamRole, string>;
  briefingNotes: string;
}

// ----------------------------------------------------------------------
// 1. Reference Data & Definitions
// ----------------------------------------------------------------------

export const DEFAULT_TEAM_MEMBERS: Record<TeamRole, TeamMember> = {
  TEAM_LEADER: {
    role: 'TEAM_LEADER',
    title: 'Code Team Leader (Attending / Fellow)',
    assignedUser: 'Dr. Sarah Lin, MD',
    avatarColor: '#6366f1', // Indigo
    currentAction: 'Orchestrating 2-min cycle & rhythm transition',
    fatiguePercent: 12,
    taskReadiness: 'active',
    activeRoleResponsibilities: [
      'Maintain situational awareness and stand back from hands-on tasks',
      'Enforce closed-loop communication and cycle timing',
      "Guide algorithmic diagnostic tree (H's and T's)",
      'Assign compressor rotation every 2 minutes'
    ]
  },
  COMPRESSOR: {
    role: 'COMPRESSOR',
    title: 'Primary Compressor (Critical Care RN)',
    assignedUser: 'Marcus Vance, BSN',
    avatarColor: '#f43f5e', // Rose
    currentAction: 'Delivering continuous high-performance CPR (112 cpm, 54 mm)',
    fatiguePercent: 68,
    taskReadiness: 'active',
    activeRoleResponsibilities: [
      'Rate 100-120/min, depth 5-6 cm, full chest wall recoil',
      'Minimize hands-off time (< 5 seconds during rhythm checks)',
      'Swap compressors every 2 minutes to prevent decay in quality'
    ]
  },
  AIRWAY_MANAGER: {
    role: 'AIRWAY_MANAGER',
    title: 'Airway & Ventilation Specialist (RT / Anesthesia)',
    assignedUser: 'Carlos Rivera, RRT',
    avatarColor: '#06b6d4', // Cyan
    currentAction: 'Continuous bag-mask with PEEP & ETCO2 waveform line',
    fatiguePercent: 25,
    taskReadiness: 'ready',
    activeRoleResponsibilities: [
      'Ensure tight two-person BVM mask seal or secure endotracheal tube',
      'Deliver 1 breath every 6 seconds (10 breaths/min) avoiding hyperventilation',
      'Monitor continuous quantitative waveform capnography (EtCO2 > 20 target)'
    ]
  },
  DEFIBRILLATOR_OPERATOR: {
    role: 'DEFIBRILLATOR_OPERATOR',
    title: 'Defibrillator / Monitor Specialist (Senior RN)',
    assignedUser: 'Jessica Taylor, RN',
    avatarColor: '#fbbf24', // Amber
    currentAction: 'Pre-charging biphasic unit at 115s into cycle (200J)',
    fatiguePercent: 18,
    taskReadiness: 'ready',
    activeRoleResponsibilities: [
      'Perform pre-charging during CPR 15 seconds before rhythm check',
      'Announce loud, visual clear ("All clear: I am clear, you are clear, team clear")',
      'Deliver biphasic shock within 3 seconds of rhythm confirmation'
    ]
  },
  MEDICATION_NURSE: {
    role: 'MEDICATION_NURSE',
    title: 'Medication & Vascular Access Nurse',
    assignedUser: 'Kavita Patel, PharmD',
    avatarColor: '#10b981', // Emerald
    currentAction: 'Preparing Epinephrine 1 mg (1:10,000) with 20 mL NS flush',
    fatiguePercent: 22,
    taskReadiness: 'ready',
    activeRoleResponsibilities: [
      'Establish large-bore peripheral IV or humeral/tibial IO access',
      'Administer Epinephrine 1 mg IV/IO every 3-5 minutes with immediate flush',
      'Administer Antiarrhythmic (Amiodarone 300 mg / 150 mg or Lidocaine) for refractory VF/pVT'
    ]
  },
  SCRIBE_RECORDER: {
    role: 'SCRIBE_RECORDER',
    title: 'Scribe / Timekeeper / Code Logger',
    assignedUser: 'Elena Rostova, RN',
    avatarColor: '#a855f7', // Purple
    currentAction: 'Logging shock #2 (200J), cycle #3 timer at 42s',
    fatiguePercent: 15,
    taskReadiness: 'ready',
    activeRoleResponsibilities: [
      'Call out 1-minute and 15-second cycle warnings to team leader',
      'Log exact clock times of shocks, medications, and interventions',
      'Prompt team leader on cumulative medication intervals'
    ]
  }
};

export const REVERSIBLE_CAUSES_LIST: ReversibleCause[] = [
  {
    id: 'hypovolemia',
    name: 'Hypovolemia',
    type: 'H',
    isIdentified: false,
    isTreated: false,
    clinicalClue: 'Narrow complex sinus tach prior to arrest, flat neck veins, bedside POCUS collapsed IVC',
    correctIntervention: 'Rapid IV/IO crystalloid bolus (1-2 L) or emergency uncrossed blood transfusion (MTP)'
  },
  {
    id: 'hypoxia',
    name: 'Hypoxia',
    type: 'H',
    isIdentified: false,
    isTreated: false,
    clinicalClue: 'Cyanosis, SpO2 loss prior to arrest, mucous plugging, displaced ETT',
    correctIntervention: '100% FiO2, DOPE mnemonic check, verify bilateral breath sounds, suction ETT'
  },
  {
    id: 'hydrogen_ion',
    name: 'Hydrogen Ion (Severe Acidosis)',
    type: 'H',
    isIdentified: false,
    isTreated: false,
    clinicalClue: 'Arterial blood gas pH < 7.0, profound base deficit, hyperventilation prior to arrest',
    correctIntervention: 'Adequate ventilation to clear CO2, consider IV Sodium Bicarbonate (1 mEq/kg)'
  },
  {
    id: 'hyperkalemia',
    name: 'Hypo/Hyperkalemia',
    type: 'H',
    isIdentified: false,
    isTreated: false,
    clinicalClue: 'End-stage renal disease (ESRD), missed dialysis, peaked T waves, sinusoidal QRS',
    correctIntervention: 'IV Calcium Gluconate (30 mL 10%) or Calcium Chloride (10 mL 10%), Insulin + D50'
  },
  {
    id: 'hypothermia',
    name: 'Hypothermia',
    type: 'H',
    isIdentified: false,
    isTreated: false,
    clinicalClue: 'Core esophageal temp < 30°C, accidental exposure, submersion history',
    correctIntervention: 'Active internal rewarming (warmed IV fluids, thoracic lavage, ECMO/ECLS)'
  },
  {
    id: 'tension_pneumo',
    name: 'Tension Pneumothorax',
    type: 'T',
    isIdentified: false,
    isTreated: false,
    clinicalClue: 'Unilateral absent breath sounds, tracheal deviation, high airway peak pressures',
    correctIntervention: 'Immediate needle thoracostomy (5th ICS AAL or 2nd ICS MCL) followed by tube thoracostomy'
  },
  {
    id: 'tamponade',
    name: 'Cardiac Tamponade',
    type: 'T',
    isIdentified: false,
    isTreated: false,
    clinicalClue: 'Post-cardiac surgery/trauma, distended neck veins, POCUS pericardial effusion with RV diastolic collapse',
    correctIntervention: 'Emergent ultrasound-guided pericardiocentesis or surgical subxiphoid pericardial window'
  },
  {
    id: 'toxins',
    name: 'Toxins / Overdose',
    type: 'T',
    isIdentified: false,
    isTreated: false,
    clinicalClue: 'Pupillary pinpoint (opioid), wide QRS (TCA), bradycardia/shock (CCB/Beta-blocker)',
    correctIntervention: 'Specific antidotes: Naloxone, Sodium Bicarbonate (TCA), HIET + Calcium (CCB), Lipid Emulsion'
  },
  {
    id: 'thrombosis_pe',
    name: 'Thrombosis (Pulmonary Embolism)',
    type: 'T',
    isIdentified: false,
    isTreated: false,
    clinicalClue: "Sudden PEA, DVT history, POCUS RV McConnell's sign with bowing interventricular septum",
    correctIntervention: 'Systemic thrombolysis (Alteplase 50 mg IV push, repeat 50 mg at 15 min), ECMO CPR'
  },
  {
    id: 'thrombosis_coronary',
    name: 'Thrombosis (Coronary - STEMI)',
    type: 'T',
    isIdentified: false,
    isTreated: false,
    clinicalClue: 'Ischemic chest pain prior to arrest, STEMI on prior ECG, refractory VF/pVT',
    correctIntervention: 'Mechanical CPR, emergent transport to Cardiac Catheterization Lab for primary PCI'
  }
];

export const CRM_SCENARIOS: CrmScenario[] = [
  {
    id: 'cathlab-vf-arrest',
    title: 'Cath Lab: Refractory Shockable Ventricular Fibrillation',
    location: 'Cardiac Catheterization Suite #3',
    patientDescription: '64yo male acute anterolateral STEMI undergoing primary PCI. Sudden catastrophic VF arrest on table.',
    initialRhythm: 'VF',
    underlyingCauseId: 'thrombosis_coronary',
    suggestedTeamMembers: {
      TEAM_LEADER: 'Dr. Sarah Lin, MD (Interventionalist)',
      COMPRESSOR: 'Marcus Vance, BSN (Cath Lab RN)',
      AIRWAY_MANAGER: 'Carlos Rivera, RRT (Respiratory)',
      DEFIBRILLATOR_OPERATOR: 'Jessica Taylor, RN (Scrub Nurse)',
      MEDICATION_NURSE: 'Kavita Patel, PharmD (Emergency)',
      SCRIBE_RECORDER: 'Elena Rostova, RN (Circulator)'
    },
    briefingNotes: 'High-risk refractory VF. Pre-charging defibrillator during compressions is critical to achieve < 2s hands-off pause. Consider dual sequential defibrillation (DSED) or early ECMO-CPR.'
  },
  {
    id: 'icu-massive-pe-pea',
    title: 'Medical ICU: Post-Op Massive PE with Sudden PEA Arrest',
    location: 'Medical Intensive Care Unit Room 14',
    patientDescription: '52yo female status-post bilateral total knee arthroplasty. Acute profound hypoxemia, hypotension, and PEA arrest.',
    initialRhythm: 'PEA',
    underlyingCauseId: 'thrombosis_pe',
    suggestedTeamMembers: {
      TEAM_LEADER: 'Dr. David Foster, MD (Intensivist)',
      COMPRESSOR: 'Lisa Chen, RN (ICU Staff)',
      AIRWAY_MANAGER: 'Samira Khan, MD (Anesthesia)',
      DEFIBRILLATOR_OPERATOR: 'Alex Turner, RN (Charge)',
      MEDICATION_NURSE: 'Rachel Adams, BSN (ICU)',
      SCRIBE_RECORDER: "Brian O'Connor, RN (Scribe)"
    },
    briefingNotes: 'PEA arrest algorithm. Check reversible causes immediately. Bedside echo reveals massive acute cor pulmonale with RV D-sign. Thrombolysis (tPA 50 mg IV push) indicated.'
  },
  {
    id: 'or-hyperkalemia-arrest',
    title: 'Operating Room: Acute Hyperkalemic Arrest in ESRD',
    location: 'Main Operating OR #7',
    patientDescription: '68yo male with ESRD on peritoneal dialysis presenting for emergency bowel resection. Peaked T waves, widening QRS into asystole.',
    initialRhythm: 'ASYSTOLE',
    underlyingCauseId: 'hyperkalemia',
    suggestedTeamMembers: {
      TEAM_LEADER: 'Dr. Karen White, MD (Anesthesiologist)',
      COMPRESSOR: 'Jason Brooks, CRNA',
      AIRWAY_MANAGER: 'Dr. Michael Chang, MD (Surgical Fellow)',
      DEFIBRILLATOR_OPERATOR: 'Amanda Scott, RN (Scrub)',
      MEDICATION_NURSE: 'Eric Miller, RN (Circulator)',
      SCRIBE_RECORDER: 'Hannah Davis, BSN (PACU)'
    },
    briefingNotes: 'Membrane stabilization is paramount. Immediate IV Calcium Chloride (1 g) followed by Sodium Bicarbonate, Insulin/Dextrose, and hyperventilation.'
  }
];

// ----------------------------------------------------------------------
// 2. Closed-Loop Communication Protocol Logic
// ----------------------------------------------------------------------

export function validateClosedLoopMessage(
  directive: CommunicationMessage,
  readback: CommunicationMessage
): { isValid: boolean; feedback: string } {
  if (directive.type !== 'DIRECTIVE') {
    return { isValid: false, feedback: 'Initial communication must be a formal DIRECTIVE.' };
  }
  if (readback.type !== 'READBACK') {
    return { isValid: false, feedback: 'Receiver must provide an explicit READBACK.' };
  }

  // Key keywords check (e.g. drug dose, shock energy)
  const dirWords = directive.content.toLowerCase().split(' ');
  const criticalTokens = dirWords.filter(w => !['please', 'give', 'the', 'and', 'to', 'for'].includes(w));
  const readbackText = readback.content.toLowerCase();

  const matchedTokens = criticalTokens.filter(token => readbackText.includes(token));
  const matchRatio = matchedTokens.length / Math.max(1, criticalTokens.length);

  if (matchRatio >= 0.5) {
    return {
      isValid: true,
      feedback: `Closed-loop communication verified: "${readback.senderName}" accurately read back order from "${directive.senderName}".`
    };
  } else {
    return {
      isValid: false,
      feedback: 'Incomplete readback: crucial dosage, medication, or defibrillation parameters missing.'
    };
  }
}

// ----------------------------------------------------------------------
// 3. Telemetry Simulation Step
// ----------------------------------------------------------------------

export function computeCrmStep(
  current: CrmTelemetry,
  isCompressing: boolean,
  currentCompressorFatigue: number
): CrmTelemetry {
  const nextElapsed = current.elapsedSeconds + 1;
  const nextCycleTime = (current.cycleTimerSeconds + 1) % 120;
  const nextCycleCount = current.cycleTimerSeconds + 1 >= 120 ? current.cycleCount + 1 : current.cycleCount;

  // Hands-on vs hands-off tracking
  const nextHandsOn = isCompressing ? current.totalHandsOnSeconds + 1 : current.totalHandsOnSeconds;
  const nextHandsOff = !isCompressing ? current.totalHandsOffSeconds + 1 : current.totalHandsOffSeconds;
  const ccf = nextHandsOn / Math.max(1, nextHandsOn + nextHandsOff);

  // Compressor fatigue effect on rate and depth
  let rate = 112;
  let depth = 54;
  if (currentCompressorFatigue > 60) {
    // Fatigue drops depth and increases rate jitter
    const fatigueDelta = (currentCompressorFatigue - 60) / 40;
    depth = Math.max(38, Math.round(54 - fatigueDelta * 14));
    rate = Math.round(112 - fatigueDelta * 15);
  }

  // ETCO2 reflects CPR quality & cardiac output
  let etco2 = 18;
  if (isCompressing) {
    etco2 = Math.min(32, Math.round(12 + (depth / 54) * 16));
  } else {
    etco2 = Math.max(6, Math.round(current.etco2MmHg * 0.9));
  }

  // Team stress index dynamic
  let stress = current.teamStressIndex;
  if (current.currentRhythm === 'VF' || current.currentRhythm === 'pVT') {
    stress = Math.min(95, stress + 0.2);
  }
  if (ccf < 0.75) {
    stress = Math.min(98, stress + 0.3);
  }

  return {
    ...current,
    elapsedSeconds: nextElapsed,
    cycleTimerSeconds: nextCycleTime,
    cycleCount: nextCycleCount,
    chestCompressionFraction: parseFloat(ccf.toFixed(2)),
    totalHandsOnSeconds: nextHandsOn,
    totalHandsOffSeconds: nextHandsOff,
    compressorRateBpm: isCompressing ? rate : 0,
    compressorDepthMm: isCompressing ? depth : 0,
    etco2MmHg: etco2,
    teamStressIndex: Math.round(stress)
  };
}
