import {
  simulateMassiveHemoptysis,
  DEFAULT_HEMOPTYSIS_PATIENT,
  MassiveHemoptysisPatientParams
} from '../../.gemini/skills/MassiveHemoptysisEngine';

describe('MassiveHemoptysisEngine - Pulmonology, Critical Care & Thoracic Surgery', () => {
  it('1. simulates default massive hemoptysis with asphyxiation risk and hypoxemia in supine position', () => {
    const out = simulateMassiveHemoptysis(DEFAULT_HEMOPTYSIS_PATIENT);

    expect(out.activeBleedingRateMlPerHour).toBeGreaterThanOrEqual(200);
    expect(out.contralateralSpilloverPresent).toBe(true);
    expect(out.anatomicDeadSpaceFloodingPct).toBeGreaterThan(50);
    expect(out.spO2Pct).toBeLessThan(80);
    expect(out.clinicalAlerts.some(a => a.message.includes('Asphyxiation Risk'))).toBe(true);
  });

  it('2. confirms "Bad Lung Down" lateral decubitus positioning eliminates contralateral spillover', () => {
    const out = simulateMassiveHemoptysis({
      ...DEFAULT_HEMOPTYSIS_PATIENT,
      patientPosition: 'BLEEDING_LUNG_DEPENDENT_DOWN'
    });

    expect(out.contralateralSpilloverPresent).toBe(false);
    expect(out.anatomicDeadSpaceFloodingPct).toBeLessThan(50);
    expect(out.spO2Pct).toBeGreaterThanOrEqual(88);
    expect(out.clinicalAlerts.some(a => a.message.includes('Optimal Positioning: "Bad Lung Down"'))).toBe(true);
  });

  it('3. flags lethal "Bad Lung Up" positioning with massive contralateral flooding and asphyxial arrest', () => {
    const out = simulateMassiveHemoptysis({
      ...DEFAULT_HEMOPTYSIS_PATIENT,
      patientPosition: 'BLEEDING_LUNG_UP'
    });

    expect(out.contralateralSpilloverPresent).toBe(true);
    expect(out.anatomicDeadSpaceFloodingPct).toBeGreaterThanOrEqual(80);
    expect(out.spO2Pct).toBeLessThanOrEqual(65);
    expect(out.clinicalAlerts.some(a => a.message.includes('LETHAL POSITIONING ERROR: "Bad Lung Up"'))).toBe(true);
  });

  it('4. detects small-bore ETT (7.0 mm) lumen occlusion hazard during flexible bronchoscopy', () => {
    const out = simulateMassiveHemoptysis({
      ...DEFAULT_HEMOPTYSIS_PATIENT,
      airwayStrategy: 'STANDARD_ETT_7_0',
      bronchoscopyApplied: 'COLD_SALINE_LAVAGE_50ML'
    });

    expect(out.bronchoscopySuctionAdequacy).toBe('INADEQUATE_LUMEN_BLOCKED');
    expect(out.airwayPatencyScore).toBeLessThanOrEqual(25);
    expect(out.peakAirwayPressureCmH2O).toBeGreaterThan(45);
    expect(out.clinicalAlerts.some(a => a.message.includes('ETT Lumen Occlusion Hazard'))).toBe(true);
  });

  it('5. models large-bore ETT (8.5 mm) with endobronchial blocker isolation preserving ventilation', () => {
    const out = simulateMassiveHemoptysis({
      ...DEFAULT_HEMOPTYSIS_PATIENT,
      patientPosition: 'BLEEDING_LUNG_DEPENDENT_DOWN',
      airwayStrategy: 'ENDOBRONCHIAL_BLOCKER_COAXIAL',
      bronchoscopyApplied: 'BALLOON_TAMPONADE_ENDOBRONCHIAL'
    });

    expect(out.contralateralSpilloverPresent).toBe(false);
    expect(out.airwayPatencyScore).toBeGreaterThanOrEqual(85);
    expect(out.anatomicDeadSpaceFloodingPct).toBeLessThanOrEqual(10);
    expect(out.activeBleedingRateMlPerHour).toBeLessThan(50);
  });

  it('6. demonstrates rapid reduction in active bleeding with topical tranexamic acid (TXA 1000 mg)', () => {
    const out = simulateMassiveHemoptysis({
      ...DEFAULT_HEMOPTYSIS_PATIENT,
      bronchoscopyApplied: 'TOPICAL_TRANEXAMIC_ACID_1000MG'
    });

    expect(out.activeBleedingRateMlPerHour).toBeLessThan(DEFAULT_HEMOPTYSIS_PATIENT.hemoptysisRateMlPerHour * 0.5);
    expect(out.clinicalAlerts.some(a => a.message.includes('Endoscopic Topical TXA Instilled'))).toBe(true);
  });

  it('7. achieves definitive hemostasis via Interventional Radiology BAE with PVA particles', () => {
    const out = simulateMassiveHemoptysis({
      ...DEFAULT_HEMOPTYSIS_PATIENT,
      interventionalRadiologyStage: 'PARTICULATE_EMBOLIZATION_PVA_500UM'
    });

    expect(out.activeBleedingRateMlPerHour).toBeLessThan(25);
    expect(out.arteryOfAdamkiewiczRisk.spinalCordInfarctionOccurred).toBe(false);
    expect(out.arteryOfAdamkiewiczRisk.paraplegiaComplication).toBe(false);
  });

  it('8. models catastrophic Artery of Adamkiewicz embolization causing anterior spinal cord infarction and paraplegia', () => {
    const out = simulateMassiveHemoptysis({
      ...DEFAULT_HEMOPTYSIS_PATIENT,
      interventionalRadiologyStage: 'UNSAFE_EMBOLIZATION_ADAMKIEWICZ_IDENTIFIED'
    });

    expect(out.arteryOfAdamkiewiczRisk.spinalCordInfarctionOccurred).toBe(true);
    expect(out.arteryOfAdamkiewiczRisk.paraplegiaComplication).toBe(true);
    expect(out.arteryOfAdamkiewiczRisk.neurologicalDeficitSummary).toContain('ANTERIOR SPINAL CORD INFARCTION');
    expect(out.clinicalAlerts.some(a => a.message.includes('Anterior Spinal Cord Infarction'))).toBe(true);
  });

  it('9. verifies safe subselective microcatheter embolization distal to the Artery of Adamkiewicz', () => {
    const out = simulateMassiveHemoptysis({
      ...DEFAULT_HEMOPTYSIS_PATIENT,
      interventionalRadiologyStage: 'MICROCATHER_DISTAL_SUBSELECTIVE_EMBOLIZATION'
    });

    expect(out.arteryOfAdamkiewiczRisk.catheterPositionRelative).toBe('DISTAL_TO_SPINAL_BRANCH');
    expect(out.arteryOfAdamkiewiczRisk.spinalCordInfarctionOccurred).toBe(false);
    expect(out.activeBleedingRateMlPerHour).toBeLessThan(20);
  });

  it('10. verifies emergency thoracotomy indication during refractory bleeding and instant surgical hemostasis', () => {
    const outRefractory = simulateMassiveHemoptysis({
      ...DEFAULT_HEMOPTYSIS_PATIENT,
      hemoptysisRateMlPerHour: 350,
      cumulativeBloodLossMl: 1100
    });

    expect(outRefractory.emergencyThoracotomyIndicated).toBe(true);

    const outSurgical = simulateMassiveHemoptysis({
      ...DEFAULT_HEMOPTYSIS_PATIENT,
      hemoptysisRateMlPerHour: 350,
      emergencyThoracotomyPerformed: true
    });

    expect(outSurgical.activeBleedingRateMlPerHour).toBe(0);
    expect(outSurgical.hemostasisAchieved).toBe(true);
  });
});
