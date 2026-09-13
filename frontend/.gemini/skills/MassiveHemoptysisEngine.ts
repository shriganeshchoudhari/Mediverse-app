/**
 * MassiveHemoptysisEngine.ts
 * Critical Care, Pulmonology, Interventional Radiology & Thoracic Surgery Physiology Engine:
 * Massive Hemoptysis Management, Asphyxiation Risk vs Exsanguination, Lateral Decubitus ("Bad Lung Down")
 * Positioning, Large-Bore ETT vs Double-Lumen Tube (DLT) vs Endobronchial Blocker Isolation,
 * Rigid vs Flexible Bronchoscopy (Cold Saline, Topical Epinephrine, Topical TXA),
 * Interventional Radiology Bronchial Artery Embolization (BAE), Particle Sizing,
 * Artery of Adamkiewicz (Anterior Spinal Cord Paraplegia Hazard), and Emergency Thoracotomy.
 */

export type BleedingEtiology =
  | 'BRONCHIECTASIS_CYSTIC_FIBROSIS' // Hypertrophied bronchial arteries, chronic inflammation
  | 'CAVITARY_TUBERCULOSIS_ASPERGILLOMA' // Mycetoma fungus ball in pre-existing cavity
  | 'CAVITARY_LUNG_NEOPLASM' // Squamous cell carcinoma invading bronchial artery
  | 'NECROTIZING_PNEUMONIA_ABSCESS' // Acute destructive lung parenchymal necrosis
  | 'RASMUSSEN_PULMONARY_ARTERY_ANEURYSM' // Pulmonary arterial circulation (10% source)
  | 'PULMONARY_AVM_HEREDITARY_TELANGIECTASIA'; // High-flow arteriovenous malformation

export type BleedingLocation = 'RIGHT_LOWER_LOBE' | 'RIGHT_UPPER_LOBE' | 'LEFT_UPPER_LOBE' | 'LEFT_LOWER_LOBE';

export type PatientPositioning =
  | 'SUPINE' // Supine: bilateral gravitational blood spillover across carina
  | 'BLEEDING_LUNG_DEPENDENT_DOWN' // "Bad Lung Down": isolates blood to affected hemithorax, protects good lung
  | 'BLEEDING_LUNG_UP'; // "Bad Lung Up": catastrophic spillover flooding healthy dependent lung

export type AirwayIsolationStrategy =
  | 'NONE_STANDARD_O2_MASK' // No invasive airway, high risk of sudden asphyxiation
  | 'STANDARD_ETT_7_0' // Small bore ETT: bronchoscope insertion occludes lumen, impossible ventilation
  | 'LARGE_BORE_ETT_8_5' // Large bore ETT: accommodates therapeutic 6.0 mm bronchoscope with 2.8 mm channel
  | 'SELECTIVE_MAINSTEM_INTUBATION' // ETT advanced deliberately into non-bleeding mainstem
  | 'ENDOBRONCHIAL_BLOCKER_COAXIAL' // Arndt/Cohen blocker placed through large ETT under broncho guidance
  | 'DOUBLE_LUMEN_TUBE_DLT'; // Left/Right DLT: independent ventilation, but narrow lumina prone to clot occlusion

export type BronchoscopicIntervention =
  | 'NONE'
  | 'COLD_SALINE_LAVAGE_50ML' // 4 deg C cold saline aliquots causing mucosal vasoconstriction
  | 'TOPICAL_EPINEPHRINE_1_20000' // Vasoconstrictor instillation
  | 'TOPICAL_TRANEXAMIC_ACID_1000MG' // Direct topical antifibrinolytic instillation (TXA 1000 mg)
  | 'BALLOON_TAMPONADE_ENDOBRONCHIAL' // Fogarty or dedicated blocker balloon inflated in segmental bronchus
  | 'RIGID_BRONCHOSCOPY_MASSIVE_SUCTION'; // Operating room rigid scope with massive clot clearance

export type InterventionalRadiologyBAEStage =
  | 'NONE'
  | 'CTA_CHEST_VESSEL_MAPPING' // Contrast-enhanced multi-detector CTA identifying hypertrophied bronchial vessels
  | 'BRONCHIAL_ANGIOGRAM_DIAGNOSTIC' // Selective bronchial artery catheterization
  | 'PARTICULATE_EMBOLIZATION_PVA_500UM' // Polyvinyl alcohol (PVA 355-500 um) microparticles
  | 'UNSAFE_EMBOLIZATION_ADAMKIEWICZ_IDENTIFIED' // Particle injection despite Artery of Adamkiewicz takeoff!
  | 'MICROCATHER_DISTAL_SUBSELECTIVE_EMBOLIZATION'; // Coaxial microcatheter advanced distal to spinal branch

export interface MassiveHemoptysisPatientParams {
  etiology: BleedingEtiology;
  bleedingLobe: BleedingLocation;
  hemoptysisRateMlPerHour: number; // e.g. 50 to 500 mL/h (massive >= 100-200 mL/h)
  cumulativeBloodLossMl: number; // e.g. 150 to 1200 mL
  patientPosition: PatientPositioning;
  airwayStrategy: AirwayIsolationStrategy;
  bronchoscopyApplied: BronchoscopicIntervention;
  interventionalRadiologyStage: InterventionalRadiologyBAEStage;
  emergencyThoracotomyPerformed: boolean;
  systemicTranexamicAcidIvGiven: boolean; // IV TXA 1g
  coagulopathyPresentInr: number; // Normal 1.0, elevated >= 1.5
  plateletCountK: number; // Normal 250k, low < 50k
}

export interface MassiveHemoptysisSimulationOutput {
  // Respiratory mechanics & gas exchange
  paO2MmHg: number; // Severe hypoxemia (< 60 mmHg)
  spO2Pct: number;
  paCO2MmHg: number; // Hypercapnia from asphyxiation/dead space flooding
  respiratoryRateBpm: number;
  peakAirwayPressureCmH2O: number; // Dangerously high (> 45 cmH2O) when lumen obstructed
  anatomicDeadSpaceFloodingPct: number; // 0 to 100% of 150 mL tracheobronchial dead space
  contralateralSpilloverPresent: boolean; // Blood crossing carina to drown good lung
  asphyxiationSeverity: 'NONE' | 'MODERATE_HYPOXIA' | 'IMMINENT_ASPHYXIATION_DROWNING' | 'ARREST_ASPHYXIAL';

  // Hemodynamic profile
  meanArterialPressureMmHg: number;
  heartRateBpm: number;
  cardiacIndexLMinM2: number;
  arterialLactateMmolL: number;
  hemoglobinGDl: number;

  // Active Bleeding & Airway Patency
  activeBleedingRateMlPerHour: number; // Reduced by interventions
  airwayPatencyScore: number; // 0 (completely choked) to 100 (fully patent and ventilated)
  hemostasisAchieved: boolean;

  // Neurological & Angiographic Safety (Artery of Adamkiewicz)
  arteryOfAdamkiewiczRisk: {
    spinalArteryVisualizedOnAngio: boolean;
    hairpinLoopPresent: boolean;
    catheterPositionRelative: 'PROXIMAL_TRUNK' | 'DISTAL_TO_SPINAL_BRANCH' | 'NOT_ENGAGED';
    spinalCordInfarctionOccurred: boolean;
    paraplegiaComplication: boolean;
    neurologicalDeficitSummary?: string;
  };

  // Clinical Decision Support & Alerts
  bronchoscopySuctionAdequacy: 'INADEQUATE_LUMEN_BLOCKED' | 'ADEQUATE_CLEARANCE' | 'SUPERIOR_RIGID_CLEARANCE' | 'NOT_ATTEMPTED';
  emergencyThoracotomyIndicated: boolean;
  clinicalAlerts: Array<{
    level: 'CRITICAL' | 'WARNING' | 'SUCCESS' | 'INFO';
    message: string;
    rationale: string;
  }>;
  managementSummary: string;
}

export const DEFAULT_HEMOPTYSIS_PATIENT: MassiveHemoptysisPatientParams = {
  etiology: 'CAVITARY_TUBERCULOSIS_ASPERGILLOMA',
  bleedingLobe: 'RIGHT_UPPER_LOBE',
  hemoptysisRateMlPerHour: 220, // Massive hemoptysis
  cumulativeBloodLossMl: 450,
  patientPosition: 'SUPINE',
  airwayStrategy: 'NONE_STANDARD_O2_MASK',
  bronchoscopyApplied: 'NONE',
  interventionalRadiologyStage: 'NONE',
  emergencyThoracotomyPerformed: false,
  systemicTranexamicAcidIvGiven: false,
  coagulopathyPresentInr: 1.1,
  plateletCountK: 210
};

export function simulateMassiveHemoptysis(params: MassiveHemoptysisPatientParams): MassiveHemoptysisSimulationOutput {
  const {
    etiology,
    bleedingLobe,
    hemoptysisRateMlPerHour,
    cumulativeBloodLossMl,
    patientPosition,
    airwayStrategy,
    bronchoscopyApplied,
    interventionalRadiologyStage,
    emergencyThoracotomyPerformed,
    systemicTranexamicAcidIvGiven,
    coagulopathyPresentInr,
    plateletCountK
  } = params;

  const alerts: MassiveHemoptysisSimulationOutput['clinicalAlerts'] = [];

  // 1. Bleeding reduction calculation from interventions
  let activeBleedingRate = hemoptysisRateMlPerHour;

  if (coagulopathyPresentInr >= 1.5 || plateletCountK < 50) {
    activeBleedingRate *= 1.3; // Exacerbated by coagulopathy
  }

  if (systemicTranexamicAcidIvGiven) {
    activeBleedingRate *= 0.85; // Modest initial reduction with IV antifibrinolytic
  }

  // Endoscopic topical interventions
  if (bronchoscopyApplied === 'COLD_SALINE_LAVAGE_50ML') {
    activeBleedingRate *= 0.65;
  } else if (bronchoscopyApplied === 'TOPICAL_EPINEPHRINE_1_20000') {
    activeBleedingRate *= 0.5;
  } else if (bronchoscopyApplied === 'TOPICAL_TRANEXAMIC_ACID_1000MG') {
    activeBleedingRate *= 0.35; // Potent topical local clot stabilization
  } else if (bronchoscopyApplied === 'BALLOON_TAMPONADE_ENDOBRONCHIAL') {
    activeBleedingRate *= 0.15; // Mechanical pressure in lobar/segmental bronchus
  } else if (bronchoscopyApplied === 'RIGID_BRONCHOSCOPY_MASSIVE_SUCTION') {
    activeBleedingRate *= 0.25;
  }

  // Interventional Radiology BAE interventions
  let spinalCordInfarctionOccurred = false;
  let paraplegiaComplication = false;
  let neurologicalDeficitSummary: string | undefined = undefined;

  // Artery of Adamkiewicz branch presence (typically T8-T12, but can share bronchial trunk in ~5-8% cases)
  const spinalArteryVisualizedOnAngio =
    interventionalRadiologyStage === 'BRONCHIAL_ANGIOGRAM_DIAGNOSTIC' ||
    interventionalRadiologyStage === 'PARTICULATE_EMBOLIZATION_PVA_500UM' ||
    interventionalRadiologyStage === 'UNSAFE_EMBOLIZATION_ADAMKIEWICZ_IDENTIFIED' ||
    interventionalRadiologyStage === 'MICROCATHER_DISTAL_SUBSELECTIVE_EMBOLIZATION';

  if (interventionalRadiologyStage === 'PARTICULATE_EMBOLIZATION_PVA_500UM') {
    activeBleedingRate *= 0.08; // 90%+ control rate with successful BAE
  } else if (interventionalRadiologyStage === 'MICROCATHER_DISTAL_SUBSELECTIVE_EMBOLIZATION') {
    activeBleedingRate *= 0.05; // Precision subselective distal embolization
  } else if (interventionalRadiologyStage === 'UNSAFE_EMBOLIZATION_ADAMKIEWICZ_IDENTIFIED') {
    // CATASTROPHIC SPINAL INFARCTION
    activeBleedingRate *= 0.1;
    spinalCordInfarctionOccurred = true;
    paraplegiaComplication = true;
    neurologicalDeficitSummary =
      'ANTERIOR SPINAL CORD INFARCTION (ANTERIOR SPINAL ARTERY SYNDROME): PVA particles were injected into the common intercostobronchial trunk without advancing distal to the visualized Artery of Adamkiewicz hairpin loop. The patient has developed irreversible flaccid paraplegia, fecal/urinary incontinence, and dissociated loss of pain/temperature sensation with preserved dorsal column proprioception.';
  }

  // Surgical resection
  if (emergencyThoracotomyPerformed) {
    activeBleedingRate = 0; // Immediate surgical resection of bleeding lobe/segment
  }

  activeBleedingRate = Math.round(activeBleedingRate);
  const hemostasisAchieved = activeBleedingRate < 10;

  // 2. Gravitational spillover and positioning
  // Tracheobronchial dead space is 150 mL!
  let contralateralSpilloverPresent = false;
  let deadSpaceFloodingPct = 0;

  if (patientPosition === 'SUPINE') {
    // Blood pools over carina and spills into both mainstem bronchi
    contralateralSpilloverPresent = true;
    deadSpaceFloodingPct = Math.min(100, Math.round((activeBleedingRate / 150) * 60));
  } else if (patientPosition === 'BLEEDING_LUNG_UP') {
    // Disastrous: blood drains directly downhill into healthy dependent lung!
    contralateralSpilloverPresent = true;
    deadSpaceFloodingPct = Math.min(100, Math.round((activeBleedingRate / 150) * 95));
  } else if (patientPosition === 'BLEEDING_LUNG_DEPENDENT_DOWN') {
    // "Bad lung down": gravity keeps blood in bleeding side, sparing healthy lung
    contralateralSpilloverPresent = false;
    deadSpaceFloodingPct = Math.min(50, Math.round((activeBleedingRate / 150) * 25));
  }

  // Airway Isolation effect on spillover and dead space
  let airwayPatencyScore = 80;
  let bronchoscopySuctionAdequacy: MassiveHemoptysisSimulationOutput['bronchoscopySuctionAdequacy'] = 'NOT_ATTEMPTED';

  if (airwayStrategy === 'NONE_STANDARD_O2_MASK') {
    airwayPatencyScore = Math.max(10, 80 - deadSpaceFloodingPct);
  } else if (airwayStrategy === 'STANDARD_ETT_7_0') {
    // Standard 7.0 ETT is a disaster if bronchoscopy is introduced: lumen is occluded!
    if (bronchoscopyApplied !== 'NONE') {
      airwayPatencyScore = 20; // Critical airway obstruction by scope in small tube!
      bronchoscopySuctionAdequacy = 'INADEQUATE_LUMEN_BLOCKED';
      alerts.push({
        level: 'CRITICAL',
        message: 'ETT Lumen Occlusion Hazard (Size 7.0 mm ETT)',
        rationale:
          'Inserting a therapeutic flexible bronchoscope (outer diameter 5.9-6.0 mm) through a 7.0 mm ETT virtually abolishes the remaining cross-sectional lumen. This generates extreme airway resistance, inability to ventilate, severe air-trapping/auto-PEEP, and catastrophic hypoxemia. An 8.0-8.5 mm ETT is mandatory for therapeutic bronchoscopy.'
      });
    } else {
      airwayPatencyScore = 40;
    }
  } else if (airwayStrategy === 'LARGE_BORE_ETT_8_5') {
    airwayPatencyScore = 75;
    bronchoscopySuctionAdequacy = 'ADEQUATE_CLEARANCE';
  } else if (airwayStrategy === 'SELECTIVE_MAINSTEM_INTUBATION') {
    // Deliberate intubation of non-bleeding lung completely blocks spillover
    contralateralSpilloverPresent = false;
    airwayPatencyScore = 85;
    deadSpaceFloodingPct = 10;
  } else if (airwayStrategy === 'ENDOBRONCHIAL_BLOCKER_COAXIAL') {
    // Coaxial balloon blocks bleeding bronchus while allowing ventilation of all other lobes
    contralateralSpilloverPresent = false;
    airwayPatencyScore = 90;
    deadSpaceFloodingPct = 5;
  } else if (airwayStrategy === 'DOUBLE_LUMEN_TUBE_DLT') {
    // DLT isolates lungs, but narrow lumina can clot
    contralateralSpilloverPresent = false;
    airwayPatencyScore = 70;
    deadSpaceFloodingPct = 15;
  }

  if (bronchoscopyApplied === 'RIGID_BRONCHOSCOPY_MASSIVE_SUCTION') {
    bronchoscopySuctionAdequacy = 'SUPERIOR_RIGID_CLEARANCE';
    airwayPatencyScore = Math.min(100, airwayPatencyScore + 20);
  }

  // 3. Respiratory mechanics and gas exchange calculation
  // Asphyxiation is primary threat: PaO2 falls rapidly, PaCO2 rises
  let paO2 = 95;
  let paCO2 = 38;
  let spO2 = 98;
  let peakPressure = 20;

  if (contralateralSpilloverPresent) {
    paO2 -= (deadSpaceFloodingPct / 100) * 55;
    paCO2 += (deadSpaceFloodingPct / 100) * 30;
    spO2 = Math.max(50, Math.round(98 - (deadSpaceFloodingPct / 100) * 45));
    peakPressure += (deadSpaceFloodingPct / 100) * 28;
  } else {
    // Unilateral isolation spares contralateral lung
    paO2 -= (deadSpaceFloodingPct / 100) * 20;
    paCO2 += (deadSpaceFloodingPct / 100) * 8;
    spO2 = Math.max(88, Math.round(98 - (deadSpaceFloodingPct / 100) * 10));
    peakPressure += (deadSpaceFloodingPct / 100) * 12;
  }

  if (airwayStrategy === 'STANDARD_ETT_7_0' && bronchoscopyApplied !== 'NONE') {
    peakPressure += 25; // Massive obstruction
    paO2 -= 25;
    spO2 = Math.min(spO2, 68);
  }

  paO2 = Math.round(Math.max(35, Math.min(110, paO2)));
  paCO2 = Math.round(Math.max(25, Math.min(95, paCO2)));
  peakPressure = Math.round(Math.max(16, Math.min(65, peakPressure)));
  const respiratoryRateBpm = Math.round(Math.max(12, Math.min(45, 16 + (deadSpaceFloodingPct / 100) * 22)));

  // Asphyxiation severity classification
  let asphyxiationSeverity: MassiveHemoptysisSimulationOutput['asphyxiationSeverity'] = 'NONE';
  if (spO2 < 70 || paO2 < 42 || deadSpaceFloodingPct > 75) {
    asphyxiationSeverity = 'ARREST_ASPHYXIAL';
  } else if (spO2 < 85 || paO2 < 55 || deadSpaceFloodingPct > 45) {
    asphyxiationSeverity = 'IMMINENT_ASPHYXIATION_DROWNING';
  } else if (spO2 < 92 || deadSpaceFloodingPct > 20) {
    asphyxiationSeverity = 'MODERATE_HYPOXIA';
  }

  // 4. Hemodynamics
  // Hemoglobin falls with cumulative blood loss
  const hemoglobinGDl = Number(Math.max(5.5, 13.5 - (cumulativeBloodLossMl / 1000) * 4.5).toFixed(1));
  let map = 85;
  let hr = 82;
  let ci = 2.9;
  let lactate = 1.2;

  if (cumulativeBloodLossMl > 400 || activeBleedingRate > 150) {
    hr += Math.min(50, Math.round((cumulativeBloodLossMl / 1000) * 40));
    map -= Math.min(35, Math.round((cumulativeBloodLossMl / 1000) * 25));
    lactate += Number(((cumulativeBloodLossMl / 1000) * 2.8).toFixed(1));
  }

  if (asphyxiationSeverity === 'ARREST_ASPHYXIAL') {
    map = 42;
    hr = 45; // Terminal hypoxic bradycardia
    ci = 1.1;
    lactate += 4.5;
  } else if (asphyxiationSeverity === 'IMMINENT_ASPHYXIATION_DROWNING') {
    map = Math.max(50, map - 15);
    hr = Math.min(145, hr + 25);
    ci = 1.8;
    lactate += 2.0;
  }

  const meanArterialPressureMmHg = Math.round(map);
  const heartRateBpm = Math.round(hr);
  const cardiacIndexLMinM2 = Number(Math.max(0.8, ci).toFixed(2));
  const arterialLactateMmolL = Number(Math.max(0.8, lactate).toFixed(1));

  // 5. Emergency Thoracotomy Indication
  const emergencyThoracotomyIndicated =
    !hemostasisAchieved &&
    (activeBleedingRate >= 200 || cumulativeBloodLossMl >= 1000) &&
    interventionalRadiologyStage !== 'PARTICULATE_EMBOLIZATION_PVA_500UM' &&
    interventionalRadiologyStage !== 'MICROCATHER_DISTAL_SUBSELECTIVE_EMBOLIZATION';

  // 6. Clinical Alerts
  if (patientPosition === 'BLEEDING_LUNG_UP') {
    alerts.push({
      level: 'CRITICAL',
      message: 'LETHAL POSITIONING ERROR: "Bad Lung Up"',
      rationale:
        'Placing the patient with the bleeding lung up causes gravitational pooling of blood directly across the carina into the healthy dependent lung, flooding its alveolar surface and causing acute asphyxial arrest. Immediately reposition to BAD LUNG DOWN!'
    });
  } else if (patientPosition === 'BLEEDING_LUNG_DEPENDENT_DOWN') {
    alerts.push({
      level: 'SUCCESS',
      message: 'Optimal Positioning: "Bad Lung Down"',
      rationale:
        'Placing the bleeding lung in the dependent position uses gravity to confine blood to the affected hemithorax, preventing contralateral spillover and preserving gas exchange in the healthy lung.'
    });
  }

  if (contralateralSpilloverPresent && airwayStrategy === 'NONE_STANDARD_O2_MASK') {
    alerts.push({
      level: 'CRITICAL',
      message: 'Asphyxiation Risk: Anatomic Dead Space Flooding',
      rationale:
        'The tracheobronchial tree contains only ~150 mL of anatomic dead space. In massive hemoptysis, patients die from ASPHYXIATION (drowning in blood), NOT exsanguination. Secure the airway with an 8.0-8.5 mm ETT or endobronchial blocker immediately!'
    });
  }

  if (spinalCordInfarctionOccurred) {
    alerts.push({
      level: 'CRITICAL',
      message: 'CATASTROPHIC COMPLICATION: Anterior Spinal Cord Infarction',
      rationale:
        'Artery of Adamkiewicz (great anterior radiculomedullary artery) was inadvertently embolized! This produces irreversible flaccid paraplegia and loss of sphincter control. Angiographic identification of the hairpin radicular artery is mandatory prior to particulate injection.'
    });
  }

  if (bronchoscopyApplied === 'TOPICAL_TRANEXAMIC_ACID_1000MG') {
    alerts.push({
      level: 'SUCCESS',
      message: 'Endoscopic Topical TXA Instilled',
      rationale:
        'Topical instillation of tranexamic acid (500-1000 mg in 10-20 mL saline) directly into the bleeding segmental bronchus promotes rapid local fibrin stabilization and significantly accelerates hemostasis.'
    });
  }

  if (hemostasisAchieved) {
    alerts.push({
      level: 'SUCCESS',
      message: 'Hemostasis Achieved & Gas Exchange Stabilized',
      rationale:
        'Active hemoptysis reduced below 10 mL/h. Airway clearance and endovascular/endoscopic tamponade have successfully preserved pulmonary gas exchange.'
    });
  }

  // Management Summary
  let managementSummary = '';
  if (hemostasisAchieved) {
    managementSummary = 'Hemostasis successfully established. Patient stabilized in ICU with continuous airway monitoring and selective isolation.';
  } else if (asphyxiationSeverity === 'ARREST_ASPHYXIAL') {
    managementSummary = 'CRITICAL ASPHYXIAL ARREST: Tracheobronchial tree flooded with blood. Immediate rigid bronchoscopy suctioning or mainstem intubation required.';
  } else if (emergencyThoracotomyIndicated) {
    managementSummary = 'Refractory life-threatening hemoptysis failing conservative/endovascular measures. Emergency operating room thoracotomy and lung resection indicated.';
  } else {
    managementSummary = 'Active massive hemoptysis under evaluation. Prioritize bad-lung-down positioning, large-bore ETT isolation, and urgent BAE.';
  }

  return {
    paO2MmHg: paO2,
    spO2Pct: spO2,
    paCO2MmHg: paCO2,
    respiratoryRateBpm,
    peakAirwayPressureCmH2O: peakPressure,
    anatomicDeadSpaceFloodingPct: deadSpaceFloodingPct,
    contralateralSpilloverPresent,
    asphyxiationSeverity,
    meanArterialPressureMmHg,
    heartRateBpm,
    cardiacIndexLMinM2,
    arterialLactateMmolL,
    hemoglobinGDl,
    activeBleedingRateMlPerHour: activeBleedingRate,
    airwayPatencyScore,
    hemostasisAchieved,
    arteryOfAdamkiewiczRisk: {
      spinalArteryVisualizedOnAngio,
      hairpinLoopPresent: spinalArteryVisualizedOnAngio,
      catheterPositionRelative:
        interventionalRadiologyStage === 'MICROCATHER_DISTAL_SUBSELECTIVE_EMBOLIZATION'
          ? 'DISTAL_TO_SPINAL_BRANCH'
          : interventionalRadiologyStage === 'UNSAFE_EMBOLIZATION_ADAMKIEWICZ_IDENTIFIED'
          ? 'PROXIMAL_TRUNK'
          : 'NOT_ENGAGED',
      spinalCordInfarctionOccurred,
      paraplegiaComplication,
      neurologicalDeficitSummary
    },
    bronchoscopySuctionAdequacy,
    emergencyThoracotomyIndicated,
    clinicalAlerts: alerts,
    managementSummary
  };
}
