/**
 * AclsResuscitationEngine.ts
 * Advanced Cardiovascular Life Support (ACLS) Megacode & Resuscitation Engine
 * Location: frontend/.gemini/skills/AclsResuscitationEngine.ts
 */

export type CardiacArrestRhythm =
  | 'VENTRICULAR_FIBRILLATION'
  | 'PULSELESS_VT'
  | 'ASYSTOLE'
  | 'PEA'
  | 'ROSC_SINUS';

export type AclsMedication =
  | 'EPINEPHRINE_1MG'
  | 'AMIODARONE_300MG'
  | 'AMIODARONE_150MG'
  | 'LIDOCAINE_100MG'
  | 'CALCIUM_CHLORIDE_1G'
  | 'SODIUM_BICARB_50MEQ'
  | 'MAGNESIUM_2G'
  | 'ALTEPLASE_50MG';

export type HsAndTsCause =
  | 'HYPOVOLEMIA'
  | 'HYPOXIA'
  | 'HYDROGEN_ION'
  | 'HYPERKALEMIA'
  | 'HYPOTHERMIA'
  | 'TENSION_PNEUMO'
  | 'TAMPONADE'
  | 'TOXINS'
  | 'THROMBOSIS_PE'
  | 'THROMBOSIS_MI';

export interface CodeEventItem {
  id: string;
  timestampSec: number;
  type: 'SHOCK' | 'DRUG' | 'CPR_CYCLE' | 'HT_TREATMENT' | 'ROSC_ACHIEVED' | 'ALGORITHM_ERROR';
  message: string;
}

export interface MegacodeState {
  patientName: string;
  patientAge: number;
  initialRhythm: CardiacArrestRhythm;
  currentRhythm: CardiacArrestRhythm;
  underlyingCause: HsAndTsCause;
  underlyingCauseTreated: boolean;
  elapsedArrestSec: number;
  cprCycleRemainingSec: number; // 120 sec cycle
  shocksDeliveredCount: number;
  lastEpiSec: number | null;
  totalEpiCount: number;
  amiodaroneDoseGiven: number; // 0, 300, 450 mg
  cprCompressionRate: number; // target 100-120
  cprDepthMm: number; // target 50-60 mm
  ccfPercent: number; // target > 80%
  etCo2MmHg: number; // < 10 inadequate, 15-25 good CPR, >= 35 ROSC
  roscAchieved: boolean;
  eventLog: CodeEventItem[];
}

export const INITIAL_MEGACODE_STATE: MegacodeState = {
  patientName: 'Harold Miller',
  patientAge: 64,
  initialRhythm: 'VENTRICULAR_FIBRILLATION',
  currentRhythm: 'VENTRICULAR_FIBRILLATION',
  underlyingCause: 'THROMBOSIS_MI',
  underlyingCauseTreated: false,
  elapsedArrestSec: 0,
  cprCycleRemainingSec: 120,
  shocksDeliveredCount: 0,
  lastEpiSec: null,
  totalEpiCount: 0,
  amiodaroneDoseGiven: 0,
  cprCompressionRate: 110,
  cprDepthMm: 54,
  ccfPercent: 88,
  etCo2MmHg: 18,
  roscAchieved: false,
  eventLog: [
    {
      id: 'ev-0',
      timestampSec: 0,
      type: 'CPR_CYCLE',
      message: 'Cardiac arrest recognized: Patient pulseless and apneic. High-quality CPR initiated.',
    },
  ],
};

/**
 * Delivers defibrillation shock (biphasic 120-200J)
 */
export function deliverDefibrillation(
  state: MegacodeState,
  energyJoules: number = 200
): { updatedState: MegacodeState; outcomeMessage: string; isAppropriate: boolean } {
  const updated: MegacodeState = JSON.parse(JSON.stringify(state));
  const now = updated.elapsedArrestSec;

  if (updated.currentRhythm === 'ASYSTOLE' || updated.currentRhythm === 'PEA') {
    updated.eventLog.push({
      id: `ev-${Date.now()}`,
      timestampSec: now,
      type: 'ALGORITHM_ERROR',
      message: `CRITICAL ERROR: Shock delivered for non-shockable rhythm (${updated.currentRhythm})! Defibrillation causes myocardial necrosis in asystole/PEA.`,
    });
    return {
      updatedState: updated,
      outcomeMessage: `Defibrillation contraindicated: ${updated.currentRhythm} is non-shockable. Continue CPR and investigate H's & T's.`,
      isAppropriate: false,
    };
  }

  // Shockable rhythm: VF or Pulseless VT
  updated.shocksDeliveredCount += 1;
  const shockNum = updated.shocksDeliveredCount;

  updated.eventLog.push({
    id: `ev-${Date.now()}`,
    timestampSec: now,
    type: 'SHOCK',
    message: `Shock #${shockNum} delivered at ${energyJoules}J biphasic. Immediately resume CPR for 2 minutes!`,
  });

  // Check conversion criteria
  // If at least 2 shocks delivered and antiarrhythmic given (or MI/underlying treated)
  if (shockNum >= 2 && updated.amiodaroneDoseGiven >= 300) {
    updated.currentRhythm = 'ROSC_SINUS';
    updated.roscAchieved = true;
    updated.etCo2MmHg = 42; // Sudden surge in EtCO2 indicates ROSC
    updated.eventLog.push({
      id: `ev-${Date.now()}-rosc`,
      timestampSec: now + 1,
      type: 'ROSC_ACHIEVED',
      message: 'ROSC ACHIEVED! EtCO2 surged to 42 mmHg. Organized sinus rhythm with palpable femoral pulse.',
    });
    return {
      updatedState: updated,
      outcomeMessage: `Shock #${shockNum} successful: Ventricular fibrillation terminated. Return of Spontaneous Circulation (ROSC) achieved!`,
      isAppropriate: true,
    };
  }

  // Still shockable VF, requires continued CPR cycle
  return {
    updatedState: updated,
    outcomeMessage: `Shock #${shockNum} (${energyJoules}J) delivered. Immediately resumed 2-minute CPR cycle.`,
    isAppropriate: true,
  };
}

/**
 * Administers ACLS emergency medication
 */
export function administerAclsMedication(
  state: MegacodeState,
  medication: AclsMedication
): { updatedState: MegacodeState; outcomeMessage: string; isAppropriate: boolean } {
  const updated: MegacodeState = JSON.parse(JSON.stringify(state));
  const now = updated.elapsedArrestSec;

  switch (medication) {
    case 'EPINEPHRINE_1MG': {
      const isIntervalValid =
        updated.lastEpiSec === null || now - updated.lastEpiSec >= 180; // 3 minutes

      updated.lastEpiSec = now;
      updated.totalEpiCount += 1;

      if (!isIntervalValid) {
        updated.eventLog.push({
          id: `ev-${Date.now()}`,
          timestampSec: now,
          type: 'ALGORITHM_ERROR',
          message: 'Warning: Epinephrine administered prematurely (< 3 minutes since prior dose). AHA guidelines mandate q3-5 min dosing.',
        });
        return {
          updatedState: updated,
          outcomeMessage: 'Epinephrine 1 mg IV push given with 20 mL saline flush (warning: administered < 3 min from prior dose).',
          isAppropriate: false,
        };
      }

      updated.eventLog.push({
        id: `ev-${Date.now()}`,
        timestampSec: now,
        type: 'DRUG',
        message: `Epinephrine 1 mg IV given (Dose #${updated.totalEpiCount}). Alpha-1 vasoconstriction augment coronary perfusion pressure (CPP).`,
      });

      return {
        updatedState: updated,
        outcomeMessage: `Epinephrine 1 mg IV administered followed by 20 mL saline flush and arm elevation (Dose #${updated.totalEpiCount}).`,
        isAppropriate: true,
      };
    }

    case 'AMIODARONE_300MG': {
      if (updated.amiodaroneDoseGiven > 0) {
        return {
          updatedState: updated,
          outcomeMessage: 'First dose (300 mg) already administered. Second dose should be 150 mg IV.',
          isAppropriate: false,
        };
      }
      updated.amiodaroneDoseGiven = 300;
      updated.eventLog.push({
        id: `ev-${Date.now()}`,
        timestampSec: now,
        type: 'DRUG',
        message: 'Amiodarone 300 mg IV bolus administered for refractory shockable rhythm after 2nd shock.',
      });
      return {
        updatedState: updated,
        outcomeMessage: 'Amiodarone 300 mg IV push given for refractory VF/pVT.',
        isAppropriate: true,
      };
    }

    case 'AMIODARONE_150MG': {
      if (updated.amiodaroneDoseGiven === 0) {
        return {
          updatedState: updated,
          outcomeMessage: 'Amiodarone initial dose must be 300 mg before giving second 150 mg dose.',
          isAppropriate: false,
        };
      }
      updated.amiodaroneDoseGiven += 150;
      updated.eventLog.push({
        id: `ev-${Date.now()}`,
        timestampSec: now,
        type: 'DRUG',
        message: 'Amiodarone second dose (150 mg IV) administered.',
      });
      return {
        updatedState: updated,
        outcomeMessage: 'Amiodarone 150 mg IV bolus administered.',
        isAppropriate: true,
      };
    }

    case 'CALCIUM_CHLORIDE_1G': {
      if (updated.underlyingCause === 'HYPERKALEMIA') {
        updated.underlyingCauseTreated = true;
        updated.eventLog.push({
          id: `ev-${Date.now()}`,
          timestampSec: now,
          type: 'HT_TREATMENT',
          message: 'Calcium Chloride 1g IV administered: Myocardial membrane stabilized against severe hyperkalemia.',
        });
        return {
          updatedState: updated,
          outcomeMessage: 'Calcium Chloride 1g IV push given: Cardiac membrane stabilization achieved.',
          isAppropriate: true,
        };
      }
      return {
        updatedState: updated,
        outcomeMessage: 'Calcium administered; no hyperkalemia or calcium channel blocker toxicity present.',
        isAppropriate: false,
      };
    }

    case 'SODIUM_BICARB_50MEQ': {
      if (updated.underlyingCause === 'HYDROGEN_ION' || updated.underlyingCause === 'TOXINS') {
        updated.underlyingCauseTreated = true;
        updated.eventLog.push({
          id: `ev-${Date.now()}`,
          timestampSec: now,
          type: 'HT_TREATMENT',
          message: 'Sodium Bicarbonate 50 mEq IV push given: Severe metabolic acidosis buffered.',
        });
        return {
          updatedState: updated,
          outcomeMessage: 'Sodium Bicarbonate 50 mEq IV administered.',
          isAppropriate: true,
        };
      }
      return {
        updatedState: updated,
        outcomeMessage: 'Sodium Bicarbonate administered.',
        isAppropriate: true,
      };
    }

    default:
      return {
        updatedState: updated,
        outcomeMessage: `Administered ${medication}.`,
        isAppropriate: true,
      };
  }
}

/**
 * Treats specific reversible cause (H's and T's)
 */
export function treatReversibleCause(
  state: MegacodeState,
  cause: HsAndTsCause,
  interventionName: string
): { updatedState: MegacodeState; outcomeMessage: string; isCorrect: boolean } {
  const updated: MegacodeState = JSON.parse(JSON.stringify(state));
  const now = updated.elapsedArrestSec;

  if (updated.underlyingCause === cause) {
    updated.underlyingCauseTreated = true;
    updated.eventLog.push({
      id: `ev-${Date.now()}`,
      timestampSec: now,
      type: 'HT_TREATMENT',
      message: `Reversible cause (${cause}) treated via ${interventionName}. Hemodynamic obstruction/deficit relieved!`,
    });

    // If PEA arrest, treating the cause triggers ROSC
    if (updated.currentRhythm === 'PEA' || updated.currentRhythm === 'ASYSTOLE') {
      updated.currentRhythm = 'ROSC_SINUS';
      updated.roscAchieved = true;
      updated.etCo2MmHg = 38;
      updated.eventLog.push({
        id: `ev-${Date.now()}-rosc`,
        timestampSec: now + 2,
        type: 'ROSC_ACHIEVED',
        message: 'ROSC ACHIEVED! Etiology corrected. Carotid pulse palpable, blood pressure 110/68 mmHg.',
      });
    }

    return {
      updatedState: updated,
      outcomeMessage: `Success: ${cause.replace('_', ' ')} identified and resolved with ${interventionName}!`,
      isCorrect: true,
    };
  }

  return {
    updatedState: updated,
    outcomeMessage: `Intervention completed, but ${cause.replace('_', ' ')} is not the primary arrest etiology in this patient.`,
    isCorrect: false,
  };
}

/**
 * Advanced ACLS Code Performance Scoring
 */
export function computeAclsDebriefScore(state: MegacodeState): {
  totalScore: number;
  letterGrade: 'A+' | 'A' | 'B' | 'C' | 'FAIL';
  breakdown: {
    rhythmRecognition: number;
    shockTiming: number;
    medicationIntervals: number;
    hsAndTsIdentification: number;
    cprQuality: number;
  };
  critiqueComments: string[];
} {
  let rhythmScore = 20;
  let shockScore = 20;
  let medScore = 20;
  let htScore = 20;
  let cprScore = 20;
  const critique: string[] = [];

  const errors = state.eventLog.filter((e) => e.type === 'ALGORITHM_ERROR');
  if (errors.length > 0) {
    shockScore = Math.max(0, shockScore - errors.length * 10);
    medScore = Math.max(0, medScore - errors.length * 8);
    errors.forEach((err) => critique.push(err.message));
  }

  // Shockable vs Non-Shockable evaluation
  if (state.initialRhythm === 'VENTRICULAR_FIBRILLATION' || state.initialRhythm === 'PULSELESS_VT') {
    if (state.shocksDeliveredCount < 1) {
      shockScore = 0;
      critique.push('Critical failure: No defibrillation shocks delivered for shockable VF/pVT.');
    } else {
      critique.push(`Delivered ${state.shocksDeliveredCount} defibrillation shock(s) with minimal interruption.`);
    }

    if (state.amiodaroneDoseGiven >= 300) {
      critique.push('Amiodarone appropriately administered for refractory shockable arrest.');
    }
  }

  // CPR Quality
  if (state.cprCompressionRate < 100 || state.cprCompressionRate > 120) {
    cprScore -= 8;
    critique.push('Compression rate out of AHA target window (100-120 bpm).');
  }
  if (state.cprDepthMm < 50) {
    cprScore -= 8;
    critique.push('Inadequate chest compression depth (< 50 mm / 2 inches).');
  }
  if (state.ccfPercent < 80) {
    cprScore -= 6;
    critique.push('Chest Compression Fraction (CCF) below 80% target.');
  }

  // H's and T's
  if (state.underlyingCauseTreated) {
    critique.push(`Successfully identified and treated primary reversible cause (${state.underlyingCause}).`);
  } else if (state.initialRhythm === 'PEA' || state.initialRhythm === 'ASYSTOLE') {
    htScore -= 15;
    critique.push(`Failed to identify and reverse underlying cause (${state.underlyingCause}) in non-shockable arrest.`);
  }

  // ROSC Outcome
  if (state.roscAchieved) {
    critique.push('Return of Spontaneous Circulation (ROSC) achieved successfully!');
  }

  rhythmScore = Math.max(0, Math.min(20, rhythmScore));
  shockScore = Math.max(0, Math.min(20, shockScore));
  medScore = Math.max(0, Math.min(20, medScore));
  htScore = Math.max(0, Math.min(20, htScore));
  cprScore = Math.max(0, Math.min(20, cprScore));

  const totalScore = rhythmScore + shockScore + medScore + htScore + cprScore;

  let letterGrade: 'A+' | 'A' | 'B' | 'C' | 'FAIL' = 'FAIL';
  if (totalScore >= 95) letterGrade = 'A+';
  else if (totalScore >= 85) letterGrade = 'A';
  else if (totalScore >= 70) letterGrade = 'B';
  else if (totalScore >= 60) letterGrade = 'C';

  return {
    totalScore,
    letterGrade,
    breakdown: {
      rhythmRecognition: rhythmScore,
      shockTiming: shockScore,
      medicationIntervals: medScore,
      hsAndTsIdentification: htScore,
      cprQuality: cprScore,
    },
    critiqueComments: critique,
  };
}