/**
 * VirtualOrTeamCrmEngine.ts
 * Crisis Resource Management (CRM), Closed-Loop Communication & Surgical Airway Engine
 * Location: frontend/.gemini/skills/VirtualOrTeamCrmEngine.ts
 */

export type TeamRole = 'AIRWAY_LEAD' | 'RESIDENT_ANESTHESIA' | 'CIRCULATING_RN' | 'SCRUB_TECH' | 'SURGEON';

export type DasPlanStep = 'PLAN_A_INTUBATION' | 'PLAN_B_SAD_RESCUE' | 'PLAN_C_FACEMASK' | 'PLAN_D_SURGICAL_CRIC';

export interface TeamMemberState {
  role: TeamRole;
  name: string;
  title: string;
  isReady: boolean;
  currentTask: string;
  lastCalloutReceived?: string;
  lastCallbackGiven?: string;
}

export interface PatientApneaVitals {
  elapsedApneaSec: number;
  paO2MmHg: number;
  spO2Percent: number;
  heartRateBpm: number;
  systolicBp: number;
  diastolicBp: number;
  etCo2MmHg: number;
  cardiacRhythm: 'SINUS_RHYTHM' | 'SINUS_TACHYCARDIA' | 'HYPOXIC_BRADYCARDIA' | 'PEA_ARREST' | 'RECOVERED_SINUS';
}

export interface CricothyroidotomyState {
  laryngealHandshakeDone: boolean;
  incisionType: 'NONE' | 'TRANSVERSE_STAB' | 'WRONG_ANATOMY';
  bladeTurned90Deg: boolean;
  bougieRailroaded: boolean;
  trachealClicksFelt: boolean;
  tube60Inserted: boolean;
  cuffInflated: boolean;
  capnographyConfirmed: boolean;
}

export interface CrmEventLogItem {
  id: string;
  timestampSec: number;
  actor: TeamRole;
  message: string;
  type: 'CALLOUT' | 'CHECKBACK' | 'ACTION' | 'FIXATION_PENALTY' | 'CRITICAL_ALERT';
}

export interface OrScenarioState {
  patientWeightKg: number;
  patientBmi: number;
  frcVolumeMl: number; // e.g. 1400 mL for obese vs 2500 mL normal
  oxygenConsumptionVo2MlMin: number; // e.g. 350 mL/min
  currentPlan: DasPlanStep;
  intubationAttemptsCount: number;
  sadAttemptsCount: number;
  sugammadexGiven: boolean;
  cicoDeclared: boolean;
  airwayCartAtBedside: boolean;
  cricothyroidotomy: CricothyroidotomyState;
  teamMembers: Record<TeamRole, TeamMemberState>;
  eventLog: CrmEventLogItem[];
}

export const INITIAL_TEAM_ROSTER: Record<TeamRole, TeamMemberState> = {
  AIRWAY_LEAD: {
    role: 'AIRWAY_LEAD',
    name: 'Dr. Student, MD',
    title: 'Anesthesia Airway Lead',
    isReady: true,
    currentTask: 'Leading airway crisis management',
  },
  RESIDENT_ANESTHESIA: {
    role: 'RESIDENT_ANESTHESIA',
    name: 'Dr. Marcus Vance, MD',
    title: 'Senior Anesthesia Resident',
    isReady: true,
    currentTask: 'Direct laryngoscopy / VL support',
  },
  CIRCULATING_RN: {
    role: 'CIRCULATING_RN',
    name: 'Nurse Jessica Reed, BSN, RN',
    title: 'OR Circulating Nurse',
    isReady: true,
    currentTask: 'Calling for emergency airway cart & medication prep',
  },
  SCRUB_TECH: {
    role: 'SCRUB_TECH',
    name: 'David Chen, CST',
    title: 'Certified Surgical Technologist',
    isReady: true,
    currentTask: 'Sterile surgical tray setup',
  },
  SURGEON: {
    role: 'SURGEON',
    name: 'Dr. Sarah Al-Mansoor, MD, FACS',
    title: 'General / ENT Surgeon',
    isReady: true,
    currentTask: 'Assisting front-of-neck access',
  },
};

/**
 * Computes non-linear FRC apnea desaturation curve
 * Based on Hill equation for oxyhemoglobin dissociation:
 * SpO2 = (PaO2^2.7) / (PaO2^2.7 + P50^2.7) where P50 = 26.8 mmHg
 */
export function computeApneaDesaturation(
  elapsedSec: number,
  frcVolumeMl: number = 1500, // Reduced FRC in obese/morbid state
  vo2MlMin: number = 320,
  oxygenationRestored: boolean = false
): PatientApneaVitals {
  if (oxygenationRestored) {
    return {
      elapsedApneaSec: elapsedSec,
      paO2MmHg: 98,
      spO2Percent: 99,
      heartRateBpm: 82,
      systolicBp: 122,
      diastolicBp: 78,
      etCo2MmHg: 38,
      cardiacRhythm: 'RECOVERED_SINUS',
    };
  }

  // Pre-oxygenated alveoli deplete FRC oxygen:
  // Safe plateau during early phase, then rapid drop down the steep oxyhemoglobin curve
  let paO2: number;
  if (elapsedSec <= 60) {
    paO2 = 450 - elapsedSec * 3.5;
  } else if (elapsedSec <= 120) {
    // Rapid drop into the steep portion of the curve (at 120s, paO2 ~ 48 mmHg -> SpO2 ~ 82%)
    paO2 = 240 - ((elapsedSec - 60) / 60) * 192;
  } else {
    // Severe hypoxia progressing to critical levels (at 180s, paO2 ~ 28 mmHg -> SpO2 ~ 53%)
    paO2 = Math.max(14, 48 - ((elapsedSec - 120) / 60) * 20);
  }

  // Hill equation calculation
  const n = 2.7;
  const p50 = 26.8;
  const paO2Pow = Math.pow(paO2, n);
  const p50Pow = Math.pow(p50, n);
  let spO2 = Math.min(100, Math.max(20, (paO2Pow / (paO2Pow + p50Pow)) * 100));

  // Hemodynamic coupling: initial tachycardia -> hypoxic bradycardia -> PEA arrest
  let heartRate = 85;
  let sbp = 130;
  let dbp = 82;
  let rhythm: PatientApneaVitals['cardiacRhythm'] = 'SINUS_RHYTHM';

  if (spO2 < 45) {
    // Terminal hypoxia -> PEA arrest
    heartRate = Math.max(20, 32 - (45 - spO2) * 0.8);
    sbp = Math.max(35, 55 - (45 - spO2) * 1.5);
    dbp = Math.max(15, 30 - (45 - spO2) * 1.0);
    rhythm = heartRate <= 28 ? 'PEA_ARREST' : 'HYPOXIC_BRADYCARDIA';
  } else if (spO2 < 70) {
    // Hypoxic bradycardia & vagal reflex
    heartRate = Math.max(35, 50 - (70 - spO2) * 0.65);
    sbp = Math.max(65, 95 - (70 - spO2) * 1.2);
    dbp = Math.max(38, 55 - (70 - spO2) * 0.8);
    rhythm = 'HYPOXIC_BRADYCARDIA';
  } else if (spO2 < 88) {
    // Sympathetic surge
    heartRate = Math.min(145, 95 + (88 - spO2) * 3);
    sbp = Math.min(185, 140 + (88 - spO2) * 2.5);
    dbp = Math.min(110, 85 + (88 - spO2) * 1.5);
    rhythm = 'SINUS_TACHYCARDIA';
  }

  return {
    elapsedApneaSec: elapsedSec,
    paO2MmHg: Number(paO2.toFixed(1)),
    spO2Percent: Number(spO2.toFixed(1)),
    heartRateBpm: Math.round(heartRate),
    systolicBp: Math.round(sbp),
    diastolicBp: Math.round(dbp),
    etCo2MmHg: spO2 < 50 ? 58 : 42,
    cardiacRhythm: rhythm,
  };
}

/**
 * Evaluates Closed-Loop Communication and Action Execution
 */
export function dispatchTeamCommand(
  targetRole: TeamRole,
  commandType:
    | 'DECLARE_CICO'
    | 'CALL_AIRWAY_CART'
    | 'ATTEMPT_VIDEO_LARYNGOSCOPY'
    | 'INSERT_SAD_IGEL'
    | 'TWO_PERSON_MASK_OPA'
    | 'GIVE_SUGAMMADEX_16'
    | 'PREPARE_SCALPEL_BOUGIE'
    | 'PERFORM_CRIC_INCISION'
    | 'INSERT_BOUGIE'
    | 'RAILROAD_60_TUBE'
    | 'INFLATE_CUFF_CONFIRM',
  currentState: OrScenarioState
): { updatedState: OrScenarioState; callbackMessage: string; isActionSuccess: boolean } {
  const updated = JSON.parse(JSON.stringify(currentState)) as OrScenarioState;
  const now = updated.eventLog.length * 8 + 12; // Simulated time increment

  let callbackMessage = '';
  let isActionSuccess = true;

  if (commandType === 'DECLARE_CICO') {
    updated.cicoDeclared = true;
    updated.currentPlan = 'PLAN_D_SURGICAL_CRIC';
    callbackMessage = 'Airway Lead declared Cannot Intubate Cannot Oxygenate (CICO). All hands preparing front-of-neck access!';
    updated.teamMembers.AIRWAY_LEAD.currentTask = 'Directing emergency surgical airway';
    updated.eventLog.push({
      id: `ev-${Date.now()}-1`,
      timestampSec: now,
      actor: 'AIRWAY_LEAD',
      message: 'DECLARE CICO: Cannot Intubate, Cannot Oxygenate! Transitioning to Plan D Front-of-Neck Access.',
      type: 'CALLOUT',
    });
    updated.eventLog.push({
      id: `ev-${Date.now()}-2`,
      timestampSec: now + 2,
      actor: 'CIRCULATING_RN',
      message: 'CICO acknowledged! Emergency Airway Cart at bedside. Scalpel-Bougie-Tube ready.',
      type: 'CHECKBACK',
    });
  } else if (commandType === 'CALL_AIRWAY_CART') {
    updated.airwayCartAtBedside = true;
    callbackMessage = 'Emergency Difficult Airway Cart & Surgical Cric Tray delivered to patient left.';
    updated.eventLog.push({
      id: `ev-${Date.now()}`,
      timestampSec: now,
      actor: 'CIRCULATING_RN',
      message: 'Airway Cart and Scalpel-Bougie-Tube tray positioned at patient side.',
      type: 'ACTION',
    });
  } else if (commandType === 'ATTEMPT_VIDEO_LARYNGOSCOPY') {
    updated.intubationAttemptsCount += 1;
    // Fixation check: > 3 attempts penalizes CRM score
    if (updated.intubationAttemptsCount > 3) {
      updated.eventLog.push({
        id: `ev-${Date.now()}-fix`,
        timestampSec: now,
        actor: 'AIRWAY_LEAD',
        message: 'CRM FIXATION ERROR: Persisting with repeated direct/video laryngoscopy attempts during hypoxia is contraindicated by DAS guidelines!',
        type: 'FIXATION_PENALTY',
      });
      callbackMessage = 'Laryngoscopy failed: Grade 4 view (anterior laryngeal edema, no glottic aperture visible).';
      isActionSuccess = false;
    } else {
      callbackMessage = `Plan A Attempt #${updated.intubationAttemptsCount}: Glottic aperture completely obstructed by severe edema. Intubation failed.`;
      isActionSuccess = false;
    }
  } else if (commandType === 'INSERT_SAD_IGEL') {
    updated.sadAttemptsCount += 1;
    updated.currentPlan = 'PLAN_B_SAD_RESCUE';
    if (updated.sadAttemptsCount > 2) {
      callbackMessage = 'Plan B SAD Failed: Massive pharyngeal edema prevents seal; large oropharyngeal air leak, no chest rise.';
      isActionSuccess = false;
    } else {
      callbackMessage = 'i-gel #4 inserted: Peak pressure > 40 cmH2O with severe leak; no ventilation possible.';
      isActionSuccess = false;
    }
  } else if (commandType === 'TWO_PERSON_MASK_OPA') {
    updated.currentPlan = 'PLAN_C_FACEMASK';
    callbackMessage = 'Two-person VE-grip facemask with oral airway: Complete airway obstruction. Cannot oxygenate!';
    isActionSuccess = false;
  } else if (commandType === 'GIVE_SUGAMMADEX_16') {
    updated.sugammadexGiven = true;
    callbackMessage = 'Sugammadex 16 mg/kg IV administered for complete reversal of Rocuronium neuromuscular blockade.';
    updated.eventLog.push({
      id: `ev-${Date.now()}`,
      timestampSec: now,
      actor: 'CIRCULATING_RN',
      message: 'Sugammadex 16 mg/kg given. Neuromuscular blockade reversed, but patient remains anatomically obstructed.',
      type: 'ACTION',
    });
  } else if (commandType === 'PREPARE_SCALPEL_BOUGIE') {
    updated.cricothyroidotomy.laryngealHandshakeDone = true;
    callbackMessage = 'Laryngeal handshake performed: Thyroid notch, cricoid ring, and cricothyroid membrane identified.';
  } else if (commandType === 'PERFORM_CRIC_INCISION') {
    if (!updated.cricothyroidotomy.laryngealHandshakeDone) {
      callbackMessage = 'Error: Must perform laryngeal handshake to identify cricothyroid membrane before incising!';
      isActionSuccess = false;
    } else {
      updated.cricothyroidotomy.incisionType = 'TRANSVERSE_STAB';
      updated.cricothyroidotomy.bladeTurned90Deg = true;
      callbackMessage = 'Transverse stab incision made into cricothyroid membrane; blade rotated 90 degrees caudally toward feet to open airway.';
    }
  } else if (commandType === 'INSERT_BOUGIE') {
    if (updated.cricothyroidotomy.incisionType !== 'TRANSVERSE_STAB' || !updated.cricothyroidotomy.bladeTurned90Deg) {
      callbackMessage = 'Error: Airway must be incised and blade turned 90 degrees before introducing bougie!';
      isActionSuccess = false;
    } else {
      updated.cricothyroidotomy.bougieRailroaded = true;
      updated.cricothyroidotomy.trachealClicksFelt = true;
      callbackMessage = 'Coude-tip bougie inserted 10-15 cm into trachea: Tactile clicks of tracheal rings clearly felt!';
    }
  } else if (commandType === 'RAILROAD_60_TUBE') {
    if (!updated.cricothyroidotomy.bougieRailroaded) {
      callbackMessage = 'Error: Bougie must be advanced with confirmed tracheal clicks before railroading tube!';
      isActionSuccess = false;
    } else {
      updated.cricothyroidotomy.tube60Inserted = true;
      callbackMessage = 'Cuffed 6.0 mm endotracheal tube railroaded over bougie into tracheal lumen.';
    }
  } else if (commandType === 'INFLATE_CUFF_CONFIRM') {
    if (!updated.cricothyroidotomy.tube60Inserted) {
      callbackMessage = 'Error: Tube must be in trachea before inflating cuff and confirming ventilation!';
      isActionSuccess = false;
    } else {
      updated.cricothyroidotomy.cuffInflated = true;
      updated.cricothyroidotomy.capnographyConfirmed = true;
      callbackMessage = 'Cuff inflated with 8 mL air. Bag-valve connected: Bilateral chest rise observed, EtCO2 38 mmHg square wave capnogram confirmed!';
      updated.eventLog.push({
        id: `ev-${Date.now()}`,
        timestampSec: now,
        actor: 'AIRWAY_LEAD',
        message: 'OXYGENATION RESTORED: Cricothyroidotomy successful. SpO2 rising to 99%, EtCO2 38 mmHg confirmed.',
        type: 'CRITICAL_ALERT',
      });
    }
  }

  return { updatedState: updated, callbackMessage, isActionSuccess };
}

/**
 * Computes Crisis Resource Management (CRM) and DAS Guideline Score
 */
export function computeCrmDebriefScore(state: OrScenarioState): {
  totalScore: number; // 0-100
  letterGrade: 'A+' | 'A' | 'B' | 'C' | 'FAIL';
  breakdown: {
    closedLoopCommunication: number; // max 25
    dasAlgorithmAdherence: number; // max 25
    cicoDeclarationTiming: number; // max 25
    surgicalTechnicalSkill: number; // max 25
  };
  feedbackComments: string[];
} {
  let commScore = 25;
  let dasScore = 25;
  let cicoScore = 25;
  let techScore = 25;
  const feedback: string[] = [];

  // 1. Fixation penalty
  const fixationEvents = state.eventLog.filter(e => e.type === 'FIXATION_PENALTY').length;
  if (fixationEvents > 0) {
    dasScore -= fixationEvents * 12;
    feedback.push(`Fixation error detected: ${fixationEvents} unnecessary laryngoscopy attempt(s) performed instead of advancing to rescue algorithm.`);
  }

  // 2. Closed loop check
  const checkbacks = state.eventLog.filter(e => e.type === 'CHECKBACK').length;
  if (checkbacks < 1) {
    commScore -= 10;
    feedback.push('Team communication lacked closed-loop checkbacks.');
  } else {
    feedback.push('Excellent closed-loop callouts and verbal confirmations across all team members.');
  }

  // 3. CICO Declaration
  if (!state.cicoDeclared) {
    cicoScore = 0;
    feedback.push('Critical failure: Failed to verbally declare CICO emergency to team.');
  } else {
    feedback.push('Timely CICO declaration enabled immediate team role transition.');
  }

  // 4. Surgical Airway steps
  const cric = state.cricothyroidotomy;
  if (!cric.laryngealHandshakeDone) {
    techScore -= 8;
    feedback.push('Missed laryngeal handshake anatomical palpation.');
  }
  if (cric.incisionType !== 'TRANSVERSE_STAB' || !cric.bladeTurned90Deg) {
    techScore -= 10;
    feedback.push('Improper incision technique: blade must be turned 90 degrees caudally to maintain airway patency.');
  }
  if (!cric.bougieRailroaded || !cric.trachealClicksFelt) {
    techScore -= 8;
    feedback.push('Did not confirm tactile tracheal ring clicks with coude-tip bougie.');
  }
  if (!cric.cuffInflated || !cric.capnographyConfirmed) {
    techScore -= 12;
    feedback.push('Incomplete airway confirmation: Cuff inflation and quantitative capnography are mandatory.');
  }

  commScore = Math.max(0, commScore);
  dasScore = Math.max(0, dasScore);
  cicoScore = Math.max(0, cicoScore);
  techScore = Math.max(0, techScore);

  const totalScore = commScore + dasScore + cicoScore + techScore;

  let letterGrade: 'A+' | 'A' | 'B' | 'C' | 'FAIL' = 'FAIL';
  if (totalScore >= 95) letterGrade = 'A+';
  else if (totalScore >= 85) letterGrade = 'A';
  else if (totalScore >= 70) letterGrade = 'B';
  else if (totalScore >= 60) letterGrade = 'C';

  return {
    totalScore,
    letterGrade,
    breakdown: {
      closedLoopCommunication: commScore,
      dasAlgorithmAdherence: dasScore,
      cicoDeclarationTiming: cicoScore,
      surgicalTechnicalSkill: techScore,
    },
    feedbackComments: feedback,
  };
}
