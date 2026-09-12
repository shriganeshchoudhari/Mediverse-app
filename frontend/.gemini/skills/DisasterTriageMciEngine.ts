/**
 * DisasterTriageMciEngine.ts
 * Mass Casualty Incident (MCI), Disaster Triage & Incident Command Engine
 * Location: frontend/.gemini/skills/DisasterTriageMciEngine.ts
 */

export type TriageCategory = 'IMMEDIATE_RED' | 'DELAYED_YELLOW' | 'MINOR_GREEN' | 'EXPECTANT_BLACK';

export type TriageAlgorithm = 'START_ADULT' | 'JUMPSTART_PEDIATRIC' | 'SALT_COMPREHENSIVE';

export type InterventionType =
  | 'TOURNIQUET'
  | 'NEEDLE_DECOMPRESSION'
  | 'AIRWAY_REPOSITION'
  | 'PEDIATRIC_RESCUE_BREATHS'
  | 'DUODOTE_AUTOINJECTOR'
  | 'PRESSURE_DRESSING';

export type DeconStatus = 'NOT_REQUIRED' | 'CONTAMINATED_HOT_ZONE' | 'DECONTAMINATED_COLD_ZONE';

export interface MciVictim {
  id: string;
  tagNumber: string;
  name: string;
  age: number;
  isPediatric: boolean;
  gender: 'M' | 'F';
  mechanism: string;
  canAmbulate: boolean;
  isBreathing: boolean;
  breathingAfterAirwayOpen: boolean;
  respiratoryRate: number;
  hasRadialPulse: boolean;
  capillaryRefillSec: number;
  mentalStatus: 'ALERT_ORIENTED' | 'CONFUSED' | 'UNRESPONSIVE' | 'POSTURING';
  avpu: 'ALERT' | 'VERBAL' | 'PAIN' | 'UNRESPONSIVE';
  bleedingType: 'NONE' | 'CONTROLLED' | 'ARTERIAL_EXSANGUINATING';
  tensionPneumothoraxPresent: boolean;
  organophosphatePoisoning: boolean;
  decontaminationStatus: DeconStatus;
  correctTriageCategory: TriageCategory;
  assignedTriageCategory?: TriageCategory;
  appliedInterventions: InterventionType[];
  clinicalSummary: string;
  evacuationPriority?: number;
}

export interface HicsLogistics {
  traumaBaysAvailable: number;
  traumaBaysTotal: number;
  orSuitesAvailable: number;
  orSuitesTotal: number;
  icuBedsAvailable: number;
  icuBedsTotal: number;
  mechanicalVentilatorsAvailable: number;
  mtpBloodUnitsAvailable: number;
  ambulancesDispatched: number;
  deconCorridorActive: boolean;
}

export interface MciScenario {
  id: string;
  title: string;
  incidentType: string;
  summary: string;
  casualtyCount: number;
  defaultDeconRequired: boolean;
  victims: MciVictim[];
}

/**
 * START Triage Algorithm (Adults > 8 years)
 * R-P-M (Respiration, Perfusion, Mental Status)
 */
export function evaluateStartTriage(
  victim: MciVictim,
  airwayRepositioned: boolean = false
): { category: TriageCategory; rationale: string } {
  // Step 1: Able to walk?
  if (victim.canAmbulate) {
    return {
      category: 'MINOR_GREEN',
      rationale: 'Able to ambulate on verbal directive (Walking Wounded).',
    };
  }

  // Step 2: Spontaneous breathing?
  if (!victim.isBreathing) {
    if (!airwayRepositioned) {
      return {
        category: 'EXPECTANT_BLACK',
        rationale: 'Apneic. Must reposition airway before declaring expectant.',
      };
    }
    if (victim.breathingAfterAirwayOpen) {
      return {
        category: 'IMMEDIATE_RED',
        rationale: 'Spontaneous breathing restored immediately upon airway repositioning.',
      };
    }
    return {
      category: 'EXPECTANT_BLACK',
      rationale: 'Remains apneic despite manual airway repositioning (non-survivable under crisis standards).',
    };
  }

  // Step 3: Respiratory Rate (> 30 /min is Immediate)
  if (victim.respiratoryRate > 30 || victim.respiratoryRate < 8) {
    return {
      category: 'IMMEDIATE_RED',
      rationale: `Tachypnea or severe bradypnea (RR ${victim.respiratoryRate}/min). Impending respiratory failure.`,
    };
  }

  // Step 4: Perfusion (Radial pulse / Cap refill > 2 sec)
  if (!victim.hasRadialPulse || victim.capillaryRefillSec > 2) {
    return {
      category: 'IMMEDIATE_RED',
      rationale: `Compromised perfusion (Radial pulse absent or Cap refill ${victim.capillaryRefillSec}s > 2s). Severe shock.`,
    };
  }

  // Step 5: Mental Status (Cannot follow simple commands)
  if (victim.mentalStatus !== 'ALERT_ORIENTED') {
    return {
      category: 'IMMEDIATE_RED',
      rationale: 'Altered mental status / unable to follow simple commands (suspected TBI or cerebral hypoperfusion).',
    };
  }

  // All intact -> Delayed
  return {
    category: 'DELAYED_YELLOW',
    rationale: 'Non-ambulatory but normal respirations (10-30), intact radial pulse, and alert mental status.',
  };
}

/**
 * JumpSTART Pediatric Triage Algorithm (Ages 1 - 8 years)
 */
export function evaluateJumpStartTriage(
  victim: MciVictim,
  airwayRepositioned: boolean = false,
  rescueBreathsGiven: boolean = false
): { category: TriageCategory; rationale: string } {
  // Step 1: Able to walk?
  if (victim.canAmbulate) {
    return {
      category: 'MINOR_GREEN',
      rationale: 'Pediatric walking wounded; able to follow parent/responder commands.',
    };
  }

  // Step 2: Breathing?
  if (!victim.isBreathing) {
    if (!airwayRepositioned) {
      return {
        category: 'EXPECTANT_BLACK',
        rationale: 'Apneic child. Must open airway and check pulse.',
      };
    }

    // Airway opened: check peripheral pulse
    if (!victim.hasRadialPulse) {
      return {
        category: 'EXPECTANT_BLACK',
        rationale: 'Apneic with no peripheral pulse following airway repositioning.',
      };
    }

    // Has pulse! JumpSTART mandates 5 rescue breaths
    if (!rescueBreathsGiven) {
      return {
        category: 'IMMEDIATE_RED',
        rationale: 'Apneic child with palpable pulse: 5 rescue breaths indicated to reverse hypoxic arrest.',
      };
    }

    if (victim.breathingAfterAirwayOpen) {
      return {
        category: 'IMMEDIATE_RED',
        rationale: 'Spontaneous breathing initiated following 5 rescue breaths (salvaged pediatric airway).',
      };
    }

    return {
      category: 'EXPECTANT_BLACK',
      rationale: 'Remains apneic despite 5 rescue breaths with airway opened.',
    };
  }

  // Step 3: Pediatric Respiratory Rate (< 15 or > 45 is Immediate)
  if (victim.respiratoryRate < 15 || victim.respiratoryRate > 45) {
    return {
      category: 'IMMEDIATE_RED',
      rationale: `Pediatric respiratory rate abnormal (< 15 or > 45/min, current ${victim.respiratoryRate}/min).`,
    };
  }

  // Step 4: Palpable Peripheral Pulse?
  if (!victim.hasRadialPulse) {
    return {
      category: 'IMMEDIATE_RED',
      rationale: 'No palpable peripheral pulse in breathing child (decompensated shock).',
    };
  }

  // Step 5: AVPU Mental Status
  if (victim.avpu === 'UNRESPONSIVE' || (victim.avpu === 'PAIN' && victim.mentalStatus === 'POSTURING')) {
    return {
      category: 'IMMEDIATE_RED',
      rationale: 'Unresponsive or inappropriate posturing to pain (severe neurologic compromise).',
    };
  }

  return {
    category: 'DELAYED_YELLOW',
    rationale: 'Stable pediatric vitals (RR 15-45, pulse palpable, appropriate AVPU), non-ambulatory.',
  };
}

/**
 * Applies immediate point-of-injury lifesaving interventions
 */
export function applyLifesavingIntervention(
  victim: MciVictim,
  intervention: InterventionType
): { updatedVictim: MciVictim; outcomeMessage: string; isAppropriate: boolean } {
  const updated: MciVictim = JSON.parse(JSON.stringify(victim));

  if (!updated.appliedInterventions.includes(intervention)) {
    updated.appliedInterventions.push(intervention);
  }

  let outcomeMessage = '';
  let isAppropriate = false;

  switch (intervention) {
    case 'TOURNIQUET':
      if (updated.bleedingType === 'ARTERIAL_EXSANGUINATING') {
        updated.bleedingType = 'CONTROLLED';
        updated.hasRadialPulse = true;
        updated.capillaryRefillSec = 2;
        outcomeMessage = 'Combat Application Tourniquet (CAT) applied high and tight. Pulsatile arterial bleeding halted!';
        isAppropriate = true;
      } else {
        outcomeMessage = 'Tourniquet placed, but no exsanguinating junctional/limb hemorrhage was present.';
        isAppropriate = false;
      }
      break;

    case 'NEEDLE_DECOMPRESSION':
      if (updated.tensionPneumothoraxPresent) {
        updated.tensionPneumothoraxPresent = false;
        updated.respiratoryRate = 22;
        updated.hasRadialPulse = true;
        outcomeMessage = '14-gauge angiocatheter placed in 2nd intercostal space midclavicular line. Immediate rush of air, hemodynamic shock relieved!';
        isAppropriate = true;
      } else {
        outcomeMessage = 'Needle thoracostomy performed without signs of tension pneumothorax (iatrogenic lung injury risk).';
        isAppropriate = false;
      }
      break;

    case 'AIRWAY_REPOSITION':
      if (!updated.isBreathing && updated.breathingAfterAirwayOpen) {
        updated.isBreathing = true;
        outcomeMessage = 'Jaw-thrust / head-tilt chin-lift cleared anatomical tongue obstruction. Spontaneous breathing restored!';
        isAppropriate = true;
      } else {
        outcomeMessage = 'Airway repositioned; victim maintains airway.';
        isAppropriate = true;
      }
      break;

    case 'PEDIATRIC_RESCUE_BREATHS':
      if (updated.isPediatric && !updated.isBreathing && updated.hasRadialPulse) {
        updated.isBreathing = true;
        updated.breathingAfterAirwayOpen = true;
        updated.respiratoryRate = 28;
        outcomeMessage = '5 rescue breaths administered via pocket mask. Spontaneous respiratory drive triggered!';
        isAppropriate = true;
      } else {
        outcomeMessage = 'Rescue breaths administered; child already has spontaneous respirations.';
        isAppropriate = false;
      }
      break;

    case 'DUODOTE_AUTOINJECTOR':
      if (updated.organophosphatePoisoning) {
        updated.organophosphatePoisoning = false;
        updated.respiratoryRate = 24;
        outcomeMessage = 'DuoDote (Atropine 2.1mg + Pralidoxime 600mg) auto-injected IM. Bronchorrhea dried and fasciculations resolved!';
        isAppropriate = true;
      } else {
        outcomeMessage = 'Antidote auto-injector administered without cholinergic SLUDGEM toxidrome.';
        isAppropriate = false;
      }
      break;

    case 'PRESSURE_DRESSING':
      if (updated.bleedingType !== 'NONE') {
        updated.bleedingType = 'CONTROLLED';
        outcomeMessage = 'Hemostatic gauze and elastic pressure dressing applied to wound.';
        isAppropriate = true;
      } else {
        outcomeMessage = 'Dressing placed over minor lacerations.';
        isAppropriate = true;
      }
      break;
  }

  return { updatedVictim: updated, outcomeMessage, isAppropriate };
}

/**
 * Calculates Disaster Triage Accuracy and HICS Surge Quality Metrics
 */
export function computeMciPerformanceMetrics(
  victims: MciVictim[],
  hics: HicsLogistics
): {
  accuracyScore: number;
  correctCount: number;
  overTriageCount: number;
  underTriageCount: number;
  preventableDeaths: number;
  unassignedCount: number;
  feedback: string[];
} {
  let correct = 0;
  let overTriage = 0;
  let underTriage = 0;
  let preventableDeaths = 0;
  let unassigned = 0;
  const feedback: string[] = [];

  const categoryRank: Record<TriageCategory, number> = {
    EXPECTANT_BLACK: 0,
    MINOR_GREEN: 1,
    DELAYED_YELLOW: 2,
    IMMEDIATE_RED: 3,
  };

  victims.forEach((victim) => {
    if (!victim.assignedTriageCategory) {
      unassigned++;
      return;
    }

    const assignedRank = categoryRank[victim.assignedTriageCategory];
    const correctRank = categoryRank[victim.correctTriageCategory];

    if (victim.assignedTriageCategory === victim.correctTriageCategory) {
      correct++;
    } else if (assignedRank > correctRank) {
      overTriage++;
      feedback.push(`Over-triage on #${victim.tagNumber} (${victim.name}): Assigned ${victim.assignedTriageCategory} when clinical status was ${victim.correctTriageCategory}.`);
    } else {
      underTriage++;
      feedback.push(`CRITICAL UNDER-TRIAGE on #${victim.tagNumber} (${victim.name}): Assigned ${victim.assignedTriageCategory} for an ${victim.correctTriageCategory} casualty!`);
      // Lethal conditions under-triaged cause preventable death
      if (victim.correctTriageCategory === 'IMMEDIATE_RED') {
        preventableDeaths++;
      }
    }

    // Check missed critical interventions
    if (victim.bleedingType === 'ARTERIAL_EXSANGUINATING' && !victim.appliedInterventions.includes('TOURNIQUET')) {
      preventableDeaths++;
      feedback.push(`Fatal hemorrhage: #${victim.tagNumber} suffered lethal exsanguination due to delayed tourniquet placement.`);
    }

    if (victim.tensionPneumothoraxPresent && !victim.appliedInterventions.includes('NEEDLE_DECOMPRESSION')) {
      preventableDeaths++;
      feedback.push(`Fatal tension pneumothorax: #${victim.tagNumber} suffered obstructive arrest without needle thoracostomy.`);
    }
  });

  const totalAssigned = victims.length - unassigned;
  const accuracyScore = totalAssigned > 0 ? Math.round((correct / victims.length) * 100) : 0;

  return {
    accuracyScore,
    correctCount: correct,
    overTriageCount: overTriage,
    underTriageCount: underTriage,
    preventableDeaths,
    unassignedCount: unassigned,
    feedback,
  };
}

/**
 * Pre-configured Mass Casualty Incident Scenarios
 */
export const MCI_SCENARIOS: MciScenario[] = [
  {
    id: 'HIGHWAY_PILEUP_BUS',
    title: 'Interstate Highway Multi-Vehicle Pileup with Tour Bus',
    incidentType: 'BLUNT_TRAUMA_MASS_CASUALTY',
    summary: 'High-speed multi-car pileup in dense fog involving a tour bus and commercial truck. 10 casualties requiring rapid primary START / JumpSTART triage.',
    casualtyCount: 10,
    defaultDeconRequired: false,
    victims: [
      {
        id: 'vic-101',
        tagNumber: '01',
        name: 'Sarah Jenkins',
        age: 34,
        isPediatric: false,
        gender: 'F',
        mechanism: 'Ejected through tour bus windshield',
        canAmbulate: false,
        isBreathing: false,
        breathingAfterAirwayOpen: false,
        respiratoryRate: 0,
        hasRadialPulse: false,
        capillaryRefillSec: 6,
        mentalStatus: 'UNRESPONSIVE',
        avpu: 'UNRESPONSIVE',
        bleedingType: 'NONE',
        tensionPneumothoraxPresent: false,
        organophosphatePoisoning: false,
        decontaminationStatus: 'NOT_REQUIRED',
        correctTriageCategory: 'EXPECTANT_BLACK',
        appliedInterventions: [],
        clinicalSummary: 'Open craniocerebral disruption with brain matter extrusion, fixed dilated pupils, apneic despite airway opening.',
      },
      {
        id: 'vic-102',
        tagNumber: '02',
        name: 'Carlos Mendez',
        age: 42,
        isPediatric: false,
        gender: 'M',
        mechanism: 'Driver pinned behind steering wheel',
        canAmbulate: false,
        isBreathing: true,
        breathingAfterAirwayOpen: true,
        respiratoryRate: 36,
        hasRadialPulse: false,
        capillaryRefillSec: 4,
        mentalStatus: 'CONFUSED',
        avpu: 'PAIN',
        bleedingType: 'NONE',
        tensionPneumothoraxPresent: true,
        organophosphatePoisoning: false,
        decontaminationStatus: 'NOT_REQUIRED',
        correctTriageCategory: 'IMMEDIATE_RED',
        appliedInterventions: [],
        clinicalSummary: 'Severe respiratory distress, tracheal deviation to left, absent right breath sounds, distended neck veins (Tension Pneumothorax).',
      },
      {
        id: 'vic-103',
        tagNumber: '03',
        name: 'Emma Watson',
        age: 6,
        isPediatric: true,
        gender: 'F',
        mechanism: 'Restrained rear passenger in sedan',
        canAmbulate: false,
        isBreathing: false,
        breathingAfterAirwayOpen: true,
        respiratoryRate: 0,
        hasRadialPulse: true,
        capillaryRefillSec: 2,
        mentalStatus: 'UNRESPONSIVE',
        avpu: 'PAIN',
        bleedingType: 'NONE',
        tensionPneumothoraxPresent: false,
        organophosphatePoisoning: false,
        decontaminationStatus: 'NOT_REQUIRED',
        correctTriageCategory: 'IMMEDIATE_RED',
        appliedInterventions: [],
        clinicalSummary: 'Apneic child with palpable brachial pulse. Repositioning airway and giving 5 rescue breaths initiates spontaneous respirations.',
      },
      {
        id: 'vic-104',
        tagNumber: '04',
        name: 'Robert Vance',
        age: 28,
        isPediatric: false,
        gender: 'M',
        mechanism: 'Passenger side impact with partial entrapment',
        canAmbulate: false,
        isBreathing: true,
        breathingAfterAirwayOpen: true,
        respiratoryRate: 26,
        hasRadialPulse: false,
        capillaryRefillSec: 4,
        mentalStatus: 'CONFUSED',
        avpu: 'VERBAL',
        bleedingType: 'ARTERIAL_EXSANGUINATING',
        tensionPneumothoraxPresent: false,
        organophosphatePoisoning: false,
        decontaminationStatus: 'NOT_REQUIRED',
        correctTriageCategory: 'IMMEDIATE_RED',
        appliedInterventions: [],
        clinicalSummary: 'Traumatic right mid-thigh amputation with spurting bright red arterial blood pooling rapidly.',
      },
      {
        id: 'vic-105',
        tagNumber: '05',
        name: 'David Miller',
        age: 55,
        isPediatric: false,
        gender: 'M',
        mechanism: 'Bus passenger thrown against seats',
        canAmbulate: false,
        isBreathing: true,
        breathingAfterAirwayOpen: true,
        respiratoryRate: 20,
        hasRadialPulse: true,
        capillaryRefillSec: 1.5,
        mentalStatus: 'ALERT_ORIENTED',
        avpu: 'ALERT',
        bleedingType: 'NONE',
        tensionPneumothoraxPresent: false,
        organophosphatePoisoning: false,
        decontaminationStatus: 'NOT_REQUIRED',
        correctTriageCategory: 'DELAYED_YELLOW',
        appliedInterventions: [],
        clinicalSummary: 'Closed left tibia-fibula fracture with deformity; neurovascularly intact distally. Alert, oriented, normal vitals.',
      },
      {
        id: 'vic-106',
        tagNumber: '06',
        name: 'Lucas Rivera',
        age: 4,
        isPediatric: true,
        gender: 'M',
        mechanism: 'Rear car seat passenger',
        canAmbulate: true,
        isBreathing: true,
        breathingAfterAirwayOpen: true,
        respiratoryRate: 24,
        hasRadialPulse: true,
        capillaryRefillSec: 1.5,
        mentalStatus: 'ALERT_ORIENTED',
        avpu: 'ALERT',
        bleedingType: 'NONE',
        tensionPneumothoraxPresent: false,
        organophosphatePoisoning: false,
        decontaminationStatus: 'NOT_REQUIRED',
        correctTriageCategory: 'MINOR_GREEN',
        appliedInterventions: [],
        clinicalSummary: 'Crying, walking towards responders holding mother\'s hand. Superficial facial abrasions only.',
      },
      {
        id: 'vic-107',
        tagNumber: '07',
        name: 'Rachel Green',
        age: 29,
        isPediatric: false,
        gender: 'F',
        mechanism: 'Walked away from bus',
        canAmbulate: true,
        isBreathing: true,
        breathingAfterAirwayOpen: true,
        respiratoryRate: 18,
        hasRadialPulse: true,
        capillaryRefillSec: 1.5,
        mentalStatus: 'ALERT_ORIENTED',
        avpu: 'ALERT',
        bleedingType: 'NONE',
        tensionPneumothoraxPresent: false,
        organophosphatePoisoning: false,
        decontaminationStatus: 'NOT_REQUIRED',
        correctTriageCategory: 'MINOR_GREEN',
        appliedInterventions: [],
        clinicalSummary: 'Walking wounded with bruised forearm and mild wrist sprain. Normal vitals.',
      },
      {
        id: 'vic-108',
        tagNumber: '08',
        name: 'Arthur Pendelton',
        age: 71,
        isPediatric: false,
        gender: 'M',
        mechanism: 'Pedestrian struck by sliding car',
        canAmbulate: false,
        isBreathing: true,
        breathingAfterAirwayOpen: true,
        respiratoryRate: 22,
        hasRadialPulse: true,
        capillaryRefillSec: 2,
        mentalStatus: 'CONFUSED',
        avpu: 'VERBAL',
        bleedingType: 'NONE',
        tensionPneumothoraxPresent: false,
        organophosphatePoisoning: false,
        decontaminationStatus: 'NOT_REQUIRED',
        correctTriageCategory: 'IMMEDIATE_RED',
        appliedInterventions: [],
        clinicalSummary: 'Large scalp hematoma, confused, unable to follow simple commands (suspected acute subdural hematoma).',
      },
      {
        id: 'vic-109',
        tagNumber: '09',
        name: 'Maya Lin',
        age: 19,
        isPediatric: false,
        gender: 'F',
        mechanism: 'Car backseat passenger',
        canAmbulate: false,
        isBreathing: true,
        breathingAfterAirwayOpen: true,
        respiratoryRate: 16,
        hasRadialPulse: true,
        capillaryRefillSec: 1.5,
        mentalStatus: 'ALERT_ORIENTED',
        avpu: 'ALERT',
        bleedingType: 'NONE',
        tensionPneumothoraxPresent: false,
        organophosphatePoisoning: false,
        decontaminationStatus: 'NOT_REQUIRED',
        correctTriageCategory: 'DELAYED_YELLOW',
        appliedInterventions: [],
        clinicalSummary: 'Pelvic tenderness without instability; normal blood pressure and heart rate. Non-ambulatory.',
      },
      {
        id: 'vic-110',
        tagNumber: '10',
        name: 'Tommy Clark',
        age: 2,
        isPediatric: true,
        gender: 'M',
        mechanism: 'Lap child ejected into footwell',
        canAmbulate: false,
        isBreathing: true,
        breathingAfterAirwayOpen: true,
        respiratoryRate: 52,
        hasRadialPulse: true,
        capillaryRefillSec: 3,
        mentalStatus: 'UNRESPONSIVE',
        avpu: 'PAIN',
        bleedingType: 'NONE',
        tensionPneumothoraxPresent: false,
        organophosphatePoisoning: false,
        decontaminationStatus: 'NOT_REQUIRED',
        correctTriageCategory: 'IMMEDIATE_RED',
        appliedInterventions: [],
        clinicalSummary: 'Severe pediatric respiratory distress (RR 52/min > 45 cutoff), prolonged capillary refill, flaccid response to pain.',
      },
    ],
  },
];

export const INITIAL_HICS_RESOURCES: HicsLogistics = {
  traumaBaysAvailable: 4,
  traumaBaysTotal: 4,
  orSuitesAvailable: 3,
  orSuitesTotal: 5,
  icuBedsAvailable: 6,
  icuBedsTotal: 12,
  mechanicalVentilatorsAvailable: 8,
  mtpBloodUnitsAvailable: 24,
  ambulancesDispatched: 5,
  deconCorridorActive: false,
};