/**
 * HospitalCommandCenterEngine.ts
 * Enterprise Hospital Operations, Patient Throughput, Bed Capacity & HAC Safety Engine.
 * Location: frontend/.gemini/skills/HospitalCommandCenterEngine.ts
 */

export type UnitType = 'ED' | 'ICU' | 'STEPDOWN' | 'SURGICAL' | 'MEDICAL';

export type BedStatus = 'AVAILABLE' | 'OCCUPIED' | 'DIRTY' | 'CLEANING';

export type SurgeLevel = 'GREEN' | 'AMBER' | 'ORANGE' | 'RED';

export interface Bed {
  id: string;
  unit: UnitType;
  bedNumber: string;
  status: BedStatus;
  cleaningMinutesRemaining?: number;
  patientId?: string;
}

export interface Patient {
  id: string;
  unit: UnitType;
  bedId: string;
  age: number;
  gender: 'M' | 'F';
  diagnosis: string;
  acuityLevel: 1 | 2 | 3 | 4 | 5; // 1 = Resuscitation / Critical, 5 = Non-urgent
  hoursInUnit: number;
  expectedLOSHours: number;
  dischargeReady: boolean;
  ventilated: boolean;
  foleyCatheter: boolean;
  centralLine: boolean;
  catheterDays: number;
  centralLineDays: number;
  ventilatorDays: number;
  bradenScore: number; // 6-23 (lower = higher pressure ulcer risk)
  fallRiskScore: number; // Morse scale 0-125
}

export interface UnitMetrics {
  unit: UnitType;
  name: string;
  totalBeds: number;
  occupiedBeds: number;
  dirtyBeds: number;
  cleaningBeds: number;
  availableBeds: number;
  occupancyPercent: number;
  assignedNurses: number;
  nursePatientRatio: number; // e.g., 0.5 = 1:2, 1.0 = 1:1, 0.25 = 1:4
  targetRatio: number;
  staffingStatus: 'OPTIMAL' | 'ACCEPTABLE' | 'UNSAFE';
}

export interface SurgeMitigationActions {
  activateOverflowBeds: boolean;      // Adds +8 surge beds across medical/surgical
  expediteDischargeLounge: boolean;   // Reduces discharge lag by 50%
  mobilizeContingencyNurses: boolean; // +6 agency / float pool nurses
  ambulanceDivertED: boolean;         // Reduces incoming ED arrivals by 60%
  cancelElectiveSurgeries: boolean;   // Freezes elective surgical admissions
}

export interface HacSurveillance {
  cautiRatePer1000Days: number;
  clabsiRatePer1000Days: number;
  vapRatePer1000Days: number;
  fallIncidentRiskPercent: number;
  highPressureInjuryRiskCount: number;
  bundleAdherencePercent: number;
}

export interface CommandCenterState {
  timestampMinutes: number;
  hospitalName: string;
  surgeLevel: SurgeLevel;
  totalOccupancyPercent: number;
  edBoardingPatients: number;
  edWaitTimeMinutes: number;
  units: Record<UnitType, UnitMetrics>;
  beds: Bed[];
  patients: Patient[];
  actions: SurgeMitigationActions;
  hac: HacSurveillance;
  activeIncidents: string[];
}

export interface MasterScenario {
  id: string;
  name: string;
  description: string;
  preset: () => CommandCenterState;
}

// Helpers
export function calculateOccupancy(occupied: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((occupied / total) * 100);
}

export function determineStaffingStatus(currentRatio: number, targetRatio: number): 'OPTIMAL' | 'ACCEPTABLE' | 'UNSAFE' {
  // Ratio is expressed as nurses/patient (e.g. 1 nurse per 2 patients = 0.5)
  if (currentRatio >= targetRatio * 0.95) return 'OPTIMAL';
  if (currentRatio >= targetRatio * 0.75) return 'ACCEPTABLE';
  return 'UNSAFE';
}

export function evaluateSurgeLevel(totalOccupancy: number, edBoarding: number, unsafeUnits: number): SurgeLevel {
  if (totalOccupancy >= 95 || edBoarding >= 15 || unsafeUnits >= 3) return 'RED';
  if (totalOccupancy >= 90 || edBoarding >= 8 || unsafeUnits >= 2) return 'ORANGE';
  if (totalOccupancy >= 82 || edBoarding >= 4 || unsafeUnits >= 1) return 'AMBER';
  return 'GREEN';
}

export function computeHACMetrics(patients: Patient[], actions: SurgeMitigationActions): HacSurveillance {
  let foleyDaysTotal = 0;
  let clDaysTotal = 0;
  let ventDaysTotal = 0;
  let highFallRisk = 0;
  let highPressureRisk = 0;

  for (const p of patients) {
    if (p.foleyCatheter) foleyDaysTotal += Math.max(1, p.catheterDays);
    if (p.centralLine) clDaysTotal += Math.max(1, p.centralLineDays);
    if (p.ventilated) ventDaysTotal += Math.max(1, p.ventilatorDays);
    if (p.fallRiskScore >= 45) highFallRisk++;
    if (p.bradenScore <= 12) highPressureRisk++;
  }

  // Baseline bundle adherence
  let bundleAdherence = 92;
  if (actions.mobilizeContingencyNurses) bundleAdherence += 4;
  if (patients.length > 50) bundleAdherence -= 6;
  bundleAdherence = Math.min(100, Math.max(65, bundleAdherence));

  const adherenceFactor = (100 - bundleAdherence) / 10; // lower adherence increases rates
  const cautiRate = Number(((foleyDaysTotal * 0.25 * adherenceFactor) / Math.max(1, foleyDaysTotal)).toFixed(1));
  const clabsiRate = Number(((clDaysTotal * 0.20 * adherenceFactor) / Math.max(1, clDaysTotal)).toFixed(1));
  const vapRate = Number(((ventDaysTotal * 0.40 * adherenceFactor) / Math.max(1, ventDaysTotal)).toFixed(1));
  const fallRiskPct = Math.min(35, Math.round((highFallRisk / Math.max(1, patients.length)) * 100));

  return {
    cautiRatePer1000Days: Math.min(12, Math.max(0.4, cautiRate)),
    clabsiRatePer1000Days: Math.min(8, Math.max(0.2, clabsiRate)),
    vapRatePer1000Days: Math.min(14, Math.max(0.5, vapRate)),
    fallIncidentRiskPercent: fallRiskPct,
    highPressureInjuryRiskCount: highPressureRisk,
    bundleAdherencePercent: bundleAdherence
  };
}

export function createInitialCommandCenterState(): CommandCenterState {
  const beds: Bed[] = [
    // ED (12 beds)
    ...Array.from({ length: 12 }, (_, i) => ({
      id: `bed-ed-${i + 1}`,
      unit: 'ED' as UnitType,
      bedNumber: `ED-${101 + i}`,
      status: (i < 9 ? 'OCCUPIED' : i === 9 ? 'DIRTY' : 'AVAILABLE') as BedStatus
    })),
    // ICU (8 beds)
    ...Array.from({ length: 8 }, (_, i) => ({
      id: `bed-icu-${i + 1}`,
      unit: 'ICU' as UnitType,
      bedNumber: `ICU-${201 + i}`,
      status: (i < 6 ? 'OCCUPIED' : i === 6 ? 'CLEANING' : 'AVAILABLE') as BedStatus,
      cleaningMinutesRemaining: i === 6 ? 15 : undefined
    })),
    // StepDown (10 beds)
    ...Array.from({ length: 10 }, (_, i) => ({
      id: `bed-step-${i + 1}`,
      unit: 'STEPDOWN' as UnitType,
      bedNumber: `STP-${301 + i}`,
      status: (i < 8 ? 'OCCUPIED' : 'AVAILABLE') as BedStatus
    })),
    // Surgical (16 beds)
    ...Array.from({ length: 16 }, (_, i) => ({
      id: `bed-surg-${i + 1}`,
      unit: 'SURGICAL' as UnitType,
      bedNumber: `SUR-${401 + i}`,
      status: (i < 13 ? 'OCCUPIED' : i === 13 ? 'DIRTY' : 'AVAILABLE') as BedStatus
    })),
    // Medical (20 beds)
    ...Array.from({ length: 20 }, (_, i) => ({
      id: `bed-med-${i + 1}`,
      unit: 'MEDICAL' as UnitType,
      bedNumber: `MED-${501 + i}`,
      status: (i < 17 ? 'OCCUPIED' : i === 17 ? 'CLEANING' : 'AVAILABLE') as BedStatus,
      cleaningMinutesRemaining: i === 17 ? 25 : undefined
    }))
  ];

  const sampleDiagnoses = [
    'Acute Coronary Syndrome', 'Septic Shock / Urosepsis', 'COPD Exacerbation',
    'Post-Op Colectomy', 'Acute Ischemic Stroke', 'DKA', 'Pneumonia (CAP)',
    'Trauma / Rib Fractures', 'Heart Failure Exacerbation', 'Post-Op Hip Arthroplasty'
  ];

  const occupiedBeds = beds.filter(b => b.status === 'OCCUPIED');
  const patients: Patient[] = occupiedBeds.map((b, idx) => {
    const isICU = b.unit === 'ICU';
    const isED = b.unit === 'ED';
    const age = 42 + ((idx * 7) % 46);
    const los = 4 + ((idx * 11) % 72);
    const vent = isICU && idx % 2 === 0;
    const foley = isICU || (idx % 3 === 0);
    const cl = isICU && idx % 3 === 0;

    return {
      id: `pat-${idx + 101}`,
      unit: b.unit,
      bedId: b.id,
      age,
      gender: idx % 2 === 0 ? 'M' : 'F',
      diagnosis: sampleDiagnoses[idx % sampleDiagnoses.length],
      acuityLevel: isICU ? 1 : isED ? 2 : 3,
      hoursInUnit: los,
      expectedLOSHours: isED ? 6 : isICU ? 72 : 96,
      dischargeReady: !isICU && !isED && los > 48 && (idx % 4 === 0),
      ventilated: vent,
      foleyCatheter: foley,
      centralLine: cl,
      catheterDays: foley ? Math.floor(los / 24) + 1 : 0,
      centralLineDays: cl ? Math.floor(los / 24) + 1 : 0,
      ventilatorDays: vent ? Math.floor(los / 24) + 1 : 0,
      bradenScore: isICU ? 11 : 16,
      fallRiskScore: isED ? 25 : 50
    };
  });

  // Link patients to beds
  patients.forEach(p => {
    const b = beds.find(x => x.id === p.bedId);
    if (b) b.patientId = p.id;
  });

  const actions: SurgeMitigationActions = {
    activateOverflowBeds: false,
    expediteDischargeLounge: false,
    mobilizeContingencyNurses: false,
    ambulanceDivertED: false,
    cancelElectiveSurgeries: false
  };

  const units: Record<UnitType, UnitMetrics> = {
    ED: {
      unit: 'ED',
      name: 'Emergency Department',
      totalBeds: 12,
      occupiedBeds: 9,
      dirtyBeds: 1,
      cleaningBeds: 0,
      availableBeds: 2,
      occupancyPercent: calculateOccupancy(9, 12),
      assignedNurses: 3,
      nursePatientRatio: Number((3 / 9).toFixed(2)),
      targetRatio: 0.33, // 1:3
      staffingStatus: 'OPTIMAL'
    },
    ICU: {
      unit: 'ICU',
      name: 'Intensive Care Unit',
      totalBeds: 8,
      occupiedBeds: 6,
      dirtyBeds: 0,
      cleaningBeds: 1,
      availableBeds: 1,
      occupancyPercent: calculateOccupancy(6, 8),
      assignedNurses: 3,
      nursePatientRatio: Number((3 / 6).toFixed(2)),
      targetRatio: 0.50, // 1:2
      staffingStatus: 'OPTIMAL'
    },
    STEPDOWN: {
      unit: 'STEPDOWN',
      name: 'Step-Down / Telemetry',
      totalBeds: 10,
      occupiedBeds: 8,
      dirtyBeds: 0,
      cleaningBeds: 0,
      availableBeds: 2,
      occupancyPercent: calculateOccupancy(8, 10),
      assignedNurses: 2,
      nursePatientRatio: Number((2 / 8).toFixed(2)),
      targetRatio: 0.33, // 1:3
      staffingStatus: 'ACCEPTABLE'
    },
    SURGICAL: {
      unit: 'SURGICAL',
      name: 'Inpatient Surgical Ward',
      totalBeds: 16,
      occupiedBeds: 13,
      dirtyBeds: 1,
      cleaningBeds: 0,
      availableBeds: 2,
      occupancyPercent: calculateOccupancy(13, 16),
      assignedNurses: 3,
      nursePatientRatio: Number((3 / 13).toFixed(2)),
      targetRatio: 0.25, // 1:4
      staffingStatus: 'ACCEPTABLE'
    },
    MEDICAL: {
      unit: 'MEDICAL',
      name: 'Inpatient Medical Ward',
      totalBeds: 20,
      occupiedBeds: 17,
      dirtyBeds: 0,
      cleaningBeds: 1,
      availableBeds: 2,
      occupancyPercent: calculateOccupancy(17, 20),
      assignedNurses: 4,
      nursePatientRatio: Number((4 / 17).toFixed(2)),
      targetRatio: 0.25, // 1:4
      staffingStatus: 'ACCEPTABLE'
    }
  };

  const totalOccupied = Object.values(units).reduce((acc, u) => acc + u.occupiedBeds, 0);
  const totalBedsCount = Object.values(units).reduce((acc, u) => acc + u.totalBeds, 0);
  const totalOccupancyPercent = calculateOccupancy(totalOccupied, totalBedsCount);
  const edBoardingPatients = 3;

  const hac = computeHACMetrics(patients, actions);
  const surgeLevel = evaluateSurgeLevel(totalOccupancyPercent, edBoardingPatients, 0);

  return {
    timestampMinutes: 0,
    hospitalName: 'Mediverse Metropolitan Academic Medical Center',
    surgeLevel,
    totalOccupancyPercent,
    edBoardingPatients,
    edWaitTimeMinutes: 45,
    units,
    beds,
    patients,
    actions,
    hac,
    activeIncidents: ['ED Boarding Advisory Active (3 patients > 4 hours)']
  };
}

export function applySurgeAction(
  currentState: CommandCenterState,
  actionKey: keyof SurgeMitigationActions,
  enabled: boolean
): CommandCenterState {
  const newActions = { ...currentState.actions, [actionKey]: enabled };
  const newUnits = { ...currentState.units };
  let newBeds = [...currentState.beds];
  const newIncidents = [...currentState.activeIncidents];

  // Overflow beds impact
  if (actionKey === 'activateOverflowBeds') {
    if (enabled) {
      newUnits.MEDICAL.totalBeds += 5;
      newUnits.SURGICAL.totalBeds += 3;
      newIncidents.push('Surge Overflow Capacity Activated (+8 beds)');
      // Add 8 surge beds
      for (let i = 1; i <= 5; i++) {
        newBeds.push({
          id: `bed-med-overflow-${i}`,
          unit: 'MEDICAL',
          bedNumber: `MED-SURGE-${i}`,
          status: 'AVAILABLE'
        });
      }
      for (let i = 1; i <= 3; i++) {
        newBeds.push({
          id: `bed-surg-overflow-${i}`,
          unit: 'SURGICAL',
          bedNumber: `SUR-SURGE-${i}`,
          status: 'AVAILABLE'
        });
      }
    } else {
      newUnits.MEDICAL.totalBeds -= 5;
      newUnits.SURGICAL.totalBeds -= 3;
      newBeds = newBeds.filter(b => !b.id.includes('overflow'));
      const idx = newIncidents.indexOf('Surge Overflow Capacity Activated (+8 beds)');
      if (idx >= 0) newIncidents.splice(idx, 1);
    }
  }

  // Contingency nurses impact
  if (actionKey === 'mobilizeContingencyNurses') {
    const nurseDelta = enabled ? 2 : -2;
    newUnits.ED.assignedNurses += enabled ? 1 : -1;
    newUnits.ICU.assignedNurses += enabled ? 1 : -1;
    newUnits.MEDICAL.assignedNurses += nurseDelta;
    newUnits.SURGICAL.assignedNurses += nurseDelta;
    if (enabled) newIncidents.push('Contingency Nursing Pool Deployed (+6 FTEs)');
  }

  // Recalculate units metrics
  let totalOcc = 0;
  let totalB = 0;
  let unsafeCount = 0;

  for (const key of (['ED', 'ICU', 'STEPDOWN', 'SURGICAL', 'MEDICAL'] as UnitType[])) {
    const u = newUnits[key];
    const unitBeds = newBeds.filter(b => b.unit === key);
    u.totalBeds = unitBeds.length;
    u.occupiedBeds = unitBeds.filter(b => b.status === 'OCCUPIED').length;
    u.dirtyBeds = unitBeds.filter(b => b.status === 'DIRTY').length;
    u.cleaningBeds = unitBeds.filter(b => b.status === 'CLEANING').length;
    u.availableBeds = unitBeds.filter(b => b.status === 'AVAILABLE').length;
    u.occupancyPercent = calculateOccupancy(u.occupiedBeds, u.totalBeds);
    u.nursePatientRatio = Number((u.assignedNurses / Math.max(1, u.occupiedBeds)).toFixed(2));
    u.staffingStatus = determineStaffingStatus(u.nursePatientRatio, u.targetRatio);
    if (u.staffingStatus === 'UNSAFE') unsafeCount++;

    totalOcc += u.occupiedBeds;
    totalB += u.totalBeds;
  }

  let edBoarding = currentState.edBoardingPatients;
  if (newActions.expediteDischargeLounge && enabled) {
    edBoarding = Math.max(0, edBoarding - 2);
  }
  if (newActions.ambulanceDivertED && enabled) {
    edBoarding = Math.max(0, edBoarding - 1);
  }

  const totalOccupancyPercent = calculateOccupancy(totalOcc, totalB);
  const surgeLevel = evaluateSurgeLevel(totalOccupancyPercent, edBoarding, unsafeCount);
  const hac = computeHACMetrics(currentState.patients, newActions);

  return {
    ...currentState,
    actions: newActions,
    units: newUnits,
    beds: newBeds,
    totalOccupancyPercent,
    edBoardingPatients: edBoarding,
    surgeLevel,
    hac,
    activeIncidents: Array.from(new Set(newIncidents))
  };
}

export function advanceSimulationStep(
  state: CommandCenterState,
  stepMinutes: number = 15
): CommandCenterState {
  const updatedMinutes = state.timestampMinutes + stepMinutes;
  let updatedBeds = [...state.beds];
  let updatedPatients = [...state.patients];
  const newIncidents = [...state.activeIncidents];

  // 1. Process cleaning beds
  updatedBeds = updatedBeds.map(b => {
    if (b.status === 'CLEANING' && b.cleaningMinutesRemaining !== undefined) {
      const rem = b.cleaningMinutesRemaining - stepMinutes;
      if (rem <= 0) {
        return { ...b, status: 'AVAILABLE', cleaningMinutesRemaining: undefined };
      }
      return { ...b, cleaningMinutesRemaining: rem };
    }
    // Dirty beds turn into cleaning automatically if EVS active
    if (b.status === 'DIRTY') {
      return { ...b, status: 'CLEANING', cleaningMinutesRemaining: 20 };
    }
    return b;
  });

  // 2. Discharges if dischargeReady and lounge or normal flow
  const readyDischarges = updatedPatients.filter(p => p.dischargeReady);
  if (readyDischarges.length > 0 && Math.random() > 0.4) {
    const discharged = readyDischarges[0];
    updatedPatients = updatedPatients.filter(p => p.id !== discharged.id);
    updatedBeds = updatedBeds.map(b => {
      if (b.id === discharged.bedId) {
        return { ...b, status: 'DIRTY', patientId: undefined };
      }
      return b;
    });
    newIncidents.push(`Patient ${discharged.id} successfully discharged from ${discharged.unit}`);
  }

  // Recalculate metrics
  let totalOcc = 0;
  let totalB = 0;
  let unsafeCount = 0;
  const newUnits = { ...state.units };

  for (const key of (['ED', 'ICU', 'STEPDOWN', 'SURGICAL', 'MEDICAL'] as UnitType[])) {
    const u = newUnits[key];
    const unitBeds = updatedBeds.filter(b => b.unit === key);
    u.totalBeds = unitBeds.length;
    u.occupiedBeds = unitBeds.filter(b => b.status === 'OCCUPIED').length;
    u.dirtyBeds = unitBeds.filter(b => b.status === 'DIRTY').length;
    u.cleaningBeds = unitBeds.filter(b => b.status === 'CLEANING').length;
    u.availableBeds = unitBeds.filter(b => b.status === 'AVAILABLE').length;
    u.occupancyPercent = calculateOccupancy(u.occupiedBeds, u.totalBeds);
    u.nursePatientRatio = Number((u.assignedNurses / Math.max(1, u.occupiedBeds)).toFixed(2));
    u.staffingStatus = determineStaffingStatus(u.nursePatientRatio, u.targetRatio);
    if (u.staffingStatus === 'UNSAFE') unsafeCount++;

    totalOcc += u.occupiedBeds;
    totalB += u.totalBeds;
  }

  const totalOccupancyPercent = calculateOccupancy(totalOcc, totalB);
  const surgeLevel = evaluateSurgeLevel(totalOccupancyPercent, state.edBoardingPatients, unsafeCount);
  const hac = computeHACMetrics(updatedPatients, state.actions);

  return {
    ...state,
    timestampMinutes: updatedMinutes,
    beds: updatedBeds,
    patients: updatedPatients,
    units: newUnits,
    totalOccupancyPercent,
    surgeLevel,
    hac,
    activeIncidents: newIncidents.slice(-8)
  };
}

// Master Pre-Configured Scenarios
export const HOSPITAL_SCENARIOS: MasterScenario[] = [
  {
    id: 'winter-viral-surge',
    name: 'Winter Viral & Influenza Surge',
    description: 'Severe ED overcrowding with 14 boarded patients, ICU at 100% capacity with multiple ventilators, and Red Surge divert conditions.',
    preset: () => {
      const base = createInitialCommandCenterState();
      base.surgeLevel = 'RED';
      base.edBoardingPatients = 14;
      base.edWaitTimeMinutes = 240;
      base.units.ICU.occupiedBeds = 8;
      base.units.ICU.availableBeds = 0;
      base.units.ICU.occupancyPercent = 100;
      base.units.ED.occupiedBeds = 12;
      base.units.ED.availableBeds = 0;
      base.units.ED.occupancyPercent = 100;
      base.totalOccupancyPercent = 96;
      base.activeIncidents = [
        'CRITICAL: Emergency Department on Full Divert',
        'ICU Zero Beds Available - Mechanical Ventilator Shortage',
        '14 Patients Boarding in ED Hallways > 6 Hours'
      ];
      return base;
    }
  },
  {
    id: 'surgical-backlog',
    name: 'Post-Holiday Surgical Backlog',
    description: 'Surgical floor at 100% capacity with 4 PACU patients holding for inpatient beds, delaying elective procedural starts.',
    preset: () => {
      const base = createInitialCommandCenterState();
      base.surgeLevel = 'ORANGE';
      base.edBoardingPatients = 5;
      base.units.SURGICAL.occupiedBeds = 16;
      base.units.SURGICAL.availableBeds = 0;
      base.units.SURGICAL.occupancyPercent = 100;
      base.activeIncidents = [
        'PACU Holdover Alert: 4 Post-Op Patients Awaiting Surgical Beds',
        'Elective Surgical Admissions Queued'
      ];
      return base;
    }
  },
  {
    id: 'nursing-staffing-crunch',
    name: 'Severe Staffing Crisis & Nursing Shortage',
    description: 'Multiple call-outs across medical and step-down units resulting in unsafe nurse-to-patient staffing ratios and elevated HAC risk.',
    preset: () => {
      const base = createInitialCommandCenterState();
      base.units.MEDICAL.assignedNurses = 2; // 2 nurses for 17 patients = 1:8.5 (critical!)
      base.units.MEDICAL.nursePatientRatio = 0.12;
      base.units.MEDICAL.staffingStatus = 'UNSAFE';
      base.units.STEPDOWN.assignedNurses = 1;
      base.units.STEPDOWN.nursePatientRatio = 0.12;
      base.units.STEPDOWN.staffingStatus = 'UNSAFE';
      base.surgeLevel = 'ORANGE';
      base.hac.bundleAdherencePercent = 68;
      base.hac.cautiRatePer1000Days = 6.4;
      base.activeIncidents = [
        'ALERT: Inpatient Medical Ward Nurse-to-Patient Ratio at 1:8.5 (Unsafe)',
        'Safe Harbor Protocol Filed in Step-Down Telemetry'
      ];
      return base;
    }
  },
  {
    id: 'optimal-flow',
    name: 'Balanced Inpatient Flow & High Efficiency',
    description: 'Optimal operational equilibrium: 78% total occupancy, zero ED boarding, rapid EVS turnover, and 98% bundle adherence.',
    preset: () => {
      const base = createInitialCommandCenterState();
      base.surgeLevel = 'GREEN';
      base.edBoardingPatients = 0;
      base.edWaitTimeMinutes = 18;
      base.totalOccupancyPercent = 76;
      base.hac.bundleAdherencePercent = 98;
      base.hac.cautiRatePer1000Days = 0.6;
      base.hac.clabsiRatePer1000Days = 0.3;
      base.activeIncidents = [
        'Operations Running at Normal Green State',
        'All Units Within Safe Staffing Ratios'
      ];
      return base;
    }
  }
];
