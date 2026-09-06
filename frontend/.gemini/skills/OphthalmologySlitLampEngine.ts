/**
 * OphthalmologySlitLampEngine.ts
 * Mediverse — Ophthalmology Slit Lamp & Goldmann Applanation Tonometry (GAT) Biophysical Engine
 *
 * Models:
 * - Slit Lamp Biomicroscopy Optics & Optical Slices:
 *   • Beam width (0.1 mm optical slice to 14 mm broad diffuse beam)
 *   • Beam angle (0 to 60 degrees illumination angle)
 *   • Illumination filters: Cobalt Blue (fluorescein), Red-Free (green, vasculature), Diffuse White
 *   • Magnification (10x, 16x, 25x, 40x)
 * - Goldmann Applanation Tonometry (GAT) Mechanics:
 *   • Imbert-Fick Law: W = P * A (area flattened = 3.06 mm diameter circle)
 *   • Semicircle meniscus fluorescein alignment (inner edges touching is true IOP)
 *   • Central Corneal Thickness (CCT) correction (normal 540 um; thin corneas underestimate IOP, thick overestimate)
 *   • Normal IOP: 10–21 mmHg; Ocular Hypertension > 21 mmHg; Acute Angle-Closure Glaucoma > 50 mmHg
 * - Van Herick Angle Estimation:
 *   • Grade 4: Peripheral anterior chamber depth >= 100% corneal thickness (wide open)
 *   • Grade 3: 25–50% corneal thickness (open, unlikely closure)
 *   • Grade 2: 25% corneal thickness (narrow, closure possible)
 *   • Grade 1: <25% corneal thickness (critically narrow, high risk closure)
 *   • Grade 0: 0% corneal thickness (closed angle)
 * - Anterior Segment Pathologies:
 *   • Acute Angle-Closure Glaucoma (mid-dilated fixed pupil, steamy cornea, IOP 65 mmHg)
 *   • Herpes Simplex Keratitis (dendritic ulcer with terminal bulbs on cobalt blue fluorescein)
 *   • Anterior Uveitis / Iritis (anterior chamber cell & flare grading 0 to 4+)
 *   • Corneal Abrasion / Seidel Test (globe rupture aqueous leak stream)
 *   • Hypopyon (leukocytic exudate settling in inferior anterior chamber)
 *   • Nuclear Sclerotic Cataract (amber/brown lens opacification)
 */

// ─── Enums & Types ────────────────────────────────────────────────────────────

export type SlitFilter = 'DIFFUSE_WHITE' | 'COBALT_BLUE' | 'RED_FREE_GREEN';

export type VanHerickGrade = 'GRADE_4_WIDE_OPEN' | 'GRADE_3_OPEN' | 'GRADE_2_NARROW' | 'GRADE_1_CRITICAL' | 'GRADE_0_CLOSED';

export type AnteriorChamberCellGrade = 'GRADE_0_NONE' | 'GRADE_1_FEW' | 'GRADE_2_MODERATE' | 'GRADE_3_MARKED' | 'GRADE_4_INTENSE_HYPOPYON';

export type OphthalmicAlarm =
  | 'OPTIMAL'
  | 'ACUTE_ANGLE_CLOSURE_CRISIS'
  | 'GLOBE_RUPTURE_SEIDEL_POSITIVE'
  | 'OCULAR_HYPERTENSION_GLAUCOMA'
  | 'CORNEAL_DENDRITIC_ULCER_HSV'
  | 'SEVERE_UVEITIS_HYPOPYON'
  | 'CLOSED_ANGLE_VAN_HERICK_0';

export type PresetId =
  | 'ACUTE_ANGLE_CLOSURE_GLAUCOMA'
  | 'HSV_DENDRITIC_KERATITIS'
  | 'ACUTE_ANTERIOR_UVEITIS_HYPOPYON'
  | 'PENETRATING_GLOBE_SEIDEL_POSITIVE'
  | 'NORMAL_EYE_EXAM_GOLDMANN'
  | 'NUCLEAR_CATARACT_SENILE';

// ─── Interfaces ──────────────────────────────────────────────────────────────

export interface GoldmannApplanationState {
  rawDialIopMmHg: number;
  fluoresceinSemicirclesAligned: boolean;
  semicirclesOverlapMm: number; // 0 = perfectly aligned inner margins, >0 = over-applanated, <0 = under-applanated
  centralCornealThicknessUm: number; // 540 um normal
  cctCorrectionOffsetMmHg: number;
  correctedTrueIopMmHg: number;
}

export interface SlitLampBeamState {
  slitWidthMm: number; // 0.1 to 14.0 mm
  beamAngleDeg: number; // 0 to 60 deg
  filter: SlitFilter;
  magnification: '10X' | '16X' | '25X' | '40X';
  fluoresceinDyeInstilled: boolean;
}

export interface SlitLampInputParams {
  presetId: PresetId;
  slitWidthMm: number;
  beamAngleDeg: number;
  filter: SlitFilter;
  magnification: '10X' | '16X' | '25X' | '40X';
  fluoresceinDyeInstilled: boolean;
  tonometerDialMmHg: number;
  cctUm: number;
  topicalPilocarpineGiven: boolean; // 2% drops for angle closure
  ivAcetazolamideGiven: boolean; // 500 mg IV Diamox
  topicalTimololGiven: boolean; // 0.5% drops
  laserIridotomyPerformed: boolean; // Nd:YAG peripheral iridotomy
}

export interface SlitLampState {
  beam: SlitLampBeamState;
  goldmann: GoldmannApplanationState;
  vanHerick: VanHerickGrade;
  anteriorChamberCells: AnteriorChamberCellGrade;
  pathologyFindings: string;
  seidelTestPositive: boolean;
  pupilStatus: string;
  activeAlarms: OphthalmicAlarm[];
  clinicalRecommendation: string;
}

export interface PresetInfo {
  id: PresetId;
  title: string;
  chiefComplaint: string;
  opticalFinding: string;
  targetIopMmHg: number;
  initialState: Partial<SlitLampInputParams>;
}

// ─── Preset Catalog ──────────────────────────────────────────────────────────

export const OPHTHALMOLOGY_PRESETS: Record<PresetId, PresetInfo> = {
  ACUTE_ANGLE_CLOSURE_GLAUCOMA: {
    id: 'ACUTE_ANGLE_CLOSURE_GLAUCOMA',
    title: 'Acute Primary Angle-Closure Glaucoma (APACG)',
    chiefComplaint: 'Sudden severe deep periorbital brow-ache, nausea, colored haloes around lights, blurred vision.',
    opticalFinding: 'Steamy corneal microcystic edema, shallow anterior chamber (Van Herick 0), fixed mid-dilated pupil (5 mm), ciliary flush. IOP 64 mmHg.',
    targetIopMmHg: 64,
    initialState: {
      presetId: 'ACUTE_ANGLE_CLOSURE_GLAUCOMA',
      slitWidthMm: 1.0,
      beamAngleDeg: 45,
      filter: 'DIFFUSE_WHITE',
      magnification: '16X',
      fluoresceinDyeInstilled: false,
      tonometerDialMmHg: 64,
      cctUm: 540,
      topicalPilocarpineGiven: false,
      ivAcetazolamideGiven: false,
      topicalTimololGiven: false,
      laserIridotomyPerformed: false,
    },
  },
  HSV_DENDRITIC_KERATITIS: {
    id: 'HSV_DENDRITIC_KERATITIS',
    title: 'Herpes Simplex Virus (HSV) Epithelial Dendritic Keratitis',
    chiefComplaint: 'Unilateral redness, foreign body sensation, photophobia, watery discharge.',
    opticalFinding: 'Linear branching epithelial ulceration with characteristic terminal bulbous end-feet on cobalt blue fluorescein illumination. Corneal hypoesthesia on cotton wisp test.',
    targetIopMmHg: 16,
    initialState: {
      presetId: 'HSV_DENDRITIC_KERATITIS',
      slitWidthMm: 8.0,
      beamAngleDeg: 30,
      filter: 'COBALT_BLUE',
      magnification: '25X',
      fluoresceinDyeInstilled: true,
      tonometerDialMmHg: 16,
      cctUm: 535,
    },
  },
  ACUTE_ANTERIOR_UVEITIS_HYPOPYON: {
    id: 'ACUTE_ANTERIOR_UVEITIS_HYPOPYON',
    title: 'HLA-B27 Acute Anterior Uveitis with Hypopyon',
    chiefComplaint: 'Intense throbbing ocular pain, marked photophobia, ciliary injection in an ankylosing spondylitis patient.',
    opticalFinding: 'Grade 4+ anterior chamber cells and flare ("snowstorm" Tyndall effect in conical optical beam). 1.5 mm sterile white leukocytic meniscus (hypopyon) settled at inferior angle.',
    targetIopMmHg: 12,
    initialState: {
      presetId: 'ACUTE_ANTERIOR_UVEITIS_HYPOPYON',
      slitWidthMm: 0.5,
      beamAngleDeg: 45,
      filter: 'DIFFUSE_WHITE',
      magnification: '40X',
      fluoresceinDyeInstilled: false,
      tonometerDialMmHg: 12,
      cctUm: 545,
    },
  },
  PENETRATING_GLOBE_SEIDEL_POSITIVE: {
    id: 'PENETRATING_GLOBE_SEIDEL_POSITIVE',
    title: 'Penetrating Corneal Laceration — Positive Seidel Sign',
    chiefComplaint: 'Metal grinder shard projectile to eye while working without safety goggles.',
    opticalFinding: 'Under cobalt blue light with topical fluorescein, clear aqueous humor dilution stream cascades downward through yellow-green dye layer (Seidel test positive, full-thickness globe breach). Shallow AC, peaked teardrop pupil.',
    targetIopMmHg: 6,
    initialState: {
      presetId: 'PENETRATING_GLOBE_SEIDEL_POSITIVE',
      slitWidthMm: 10.0,
      beamAngleDeg: 20,
      filter: 'COBALT_BLUE',
      magnification: '16X',
      fluoresceinDyeInstilled: true,
      tonometerDialMmHg: 6,
      cctUm: 540,
    },
  },
  NORMAL_EYE_EXAM_GOLDMANN: {
    id: 'NORMAL_EYE_EXAM_GOLDMANN',
    title: 'Normal Anterior Segment & Goldmann Semicircle Alignment',
    chiefComplaint: 'Routine comprehensive optometric and ophthalmic health examination.',
    opticalFinding: 'Clear cornea, deep and quiet anterior chamber (Van Herick 4), briskly reactive 3 mm round pupil. Goldmann applanation fluorescein semicircles align perfectly at 14 mmHg.',
    targetIopMmHg: 14,
    initialState: {
      presetId: 'NORMAL_EYE_EXAM_GOLDMANN',
      slitWidthMm: 4.0,
      beamAngleDeg: 30,
      filter: 'COBALT_BLUE',
      magnification: '16X',
      fluoresceinDyeInstilled: true,
      tonometerDialMmHg: 14,
      cctUm: 540,
    },
  },
  NUCLEAR_CATARACT_SENILE: {
    id: 'NUCLEAR_CATARACT_SENILE',
    title: 'Age-Related Nuclear Sclerotic Cataract (Grade 3+)',
    chiefComplaint: 'Gradual painless decrease in distance vision, worsening glare with night driving, myopic shift ("second sight").',
    opticalFinding: 'Slit beam cross-section of the crystalline lens shows central nuclear amber-brown compaction and opacification. Clear cornea and open angle.',
    targetIopMmHg: 15,
    initialState: {
      presetId: 'NUCLEAR_CATARACT_SENILE',
      slitWidthMm: 0.2,
      beamAngleDeg: 45,
      filter: 'DIFFUSE_WHITE',
      magnification: '25X',
      fluoresceinDyeInstilled: false,
      tonometerDialMmHg: 15,
      cctUm: 540,
    },
  },
};

export const SLIT_LAMP_PRESETS = OPHTHALMOLOGY_PRESETS;

// ─── Central Corneal Thickness (CCT) Correction Solver ────────────────────────

export function calculateCCTCorrection(cctUm: number): number {
  // Dresdner / Ehlers correction rule: approximately +/- 1 mmHg per 20 um deviation from 540 um
  const deltaUm = cctUm - 540;
  const offset = Math.round((deltaUm / 20) * -1);
  return offset === 0 ? 0 : offset; // normalize -0 to 0
}

// ─── Main Solver ──────────────────────────────────────────────────────────────

export function computeSlitLampState(params: SlitLampInputParams): SlitLampState {
  const {
    presetId,
    slitWidthMm,
    beamAngleDeg,
    filter,
    magnification,
    fluoresceinDyeInstilled,
    tonometerDialMmHg,
    cctUm,
    topicalPilocarpineGiven,
    ivAcetazolamideGiven,
    topicalTimololGiven,
    laserIridotomyPerformed,
  } = params;

  // Base IOP from preset
  let trueBaseIop = OPHTHALMOLOGY_PRESETS[presetId].targetIopMmHg;

  // Acute Angle Closure Emergency Response
  if (presetId === 'ACUTE_ANGLE_CLOSURE_GLAUCOMA') {
    if (ivAcetazolamideGiven) trueBaseIop -= 18;
    if (topicalTimololGiven) trueBaseIop -= 8;
    if (topicalPilocarpineGiven) trueBaseIop -= 6;
    if (laserIridotomyPerformed) trueBaseIop = 16; // Definitive cure
  }

  // CCT Correction
  const cctCorrectionOffsetMmHg = calculateCCTCorrection(cctUm);
  const correctedTrueIopMmHg = Math.max(2, trueBaseIop + cctCorrectionOffsetMmHg);

  // Goldmann Applanation mechanics
  const dialDiff = tonometerDialMmHg - trueBaseIop;
  const semicirclesOverlapMm = parseFloat((dialDiff * 0.1).toFixed(2));
  const fluoresceinSemicirclesAligned = Math.abs(dialDiff) <= 1;

  // Van Herick angle grading
  let vanHerick: VanHerickGrade = 'GRADE_4_WIDE_OPEN';
  if (presetId === 'ACUTE_ANGLE_CLOSURE_GLAUCOMA') {
    vanHerick = laserIridotomyPerformed ? 'GRADE_3_OPEN' : 'GRADE_0_CLOSED';
  } else if (presetId === 'NORMAL_EYE_EXAM_GOLDMANN') {
    vanHerick = 'GRADE_4_WIDE_OPEN';
  }

  // Anterior chamber cells
  let anteriorChamberCells: AnteriorChamberCellGrade = 'GRADE_0_NONE';
  if (presetId === 'ACUTE_ANTERIOR_UVEITIS_HYPOPYON') {
    anteriorChamberCells = 'GRADE_4_INTENSE_HYPOPYON';
  }

  // Pupil Status
  let pupilStatus = 'Round, regular, 3.5 mm, briskly reactive to light (PERRLA)';
  if (presetId === 'ACUTE_ANGLE_CLOSURE_GLAUCOMA') {
    pupilStatus = laserIridotomyPerformed
      ? 'Round, 3.0 mm, reactive post-iridotomy'
      : 'Mid-dilated 5.5 mm, vertically oval, unreactive to direct/consensual light';
  } else if (presetId === 'PENETRATING_GLOBE_SEIDEL_POSITIVE') {
    pupilStatus = 'Peaked irregular teardrop pupil pointing toward 4 o\'clock corneal wound';
  }

  // Seidel Test
  const seidelTestPositive = presetId === 'PENETRATING_GLOBE_SEIDEL_POSITIVE';

  // Pathology Findings
  const pathologyFindings = OPHTHALMOLOGY_PRESETS[presetId].opticalFinding;

  // Alarms
  const activeAlarms: OphthalmicAlarm[] = [];
  if (correctedTrueIopMmHg >= 40 && !laserIridotomyPerformed) {
    activeAlarms.push('ACUTE_ANGLE_CLOSURE_CRISIS');
  }
  if (seidelTestPositive) {
    activeAlarms.push('GLOBE_RUPTURE_SEIDEL_POSITIVE');
  }
  if (correctedTrueIopMmHg > 21 && correctedTrueIopMmHg < 40) {
    activeAlarms.push('OCULAR_HYPERTENSION_GLAUCOMA');
  }
  if (presetId === 'HSV_DENDRITIC_KERATITIS') {
    activeAlarms.push('CORNEAL_DENDRITIC_ULCER_HSV');
  }
  if (anteriorChamberCells === 'GRADE_4_INTENSE_HYPOPYON') {
    activeAlarms.push('SEVERE_UVEITIS_HYPOPYON');
  }
  if (vanHerick === 'GRADE_0_CLOSED') {
    activeAlarms.push('CLOSED_ANGLE_VAN_HERICK_0');
  }
  if (activeAlarms.length === 0) {
    activeAlarms.push('OPTIMAL');
  }

  // Clinical Recommendation
  let clinicalRecommendation = 'Anterior segment within normal physiological parameters. Continue routine follow-up.';
  if (presetId === 'ACUTE_ANGLE_CLOSURE_GLAUCOMA' && !laserIridotomyPerformed) {
    clinicalRecommendation = 'OPHTHALMIC EMERGENCY: Acute Angle-Closure Crisis. Administer IV Acetazolamide 500mg, topical Timolol 0.5%, Pilocarpine 2%. Emergent Nd:YAG Peripheral Iridotomy indicated.';
  } else if (seidelTestPositive) {
    clinicalRecommendation = 'SURGICAL EMERGENCY: Full-thickness open globe breach (positive Seidel test). Apply rigid Fox eye shield. DO NOT apply pressure. NPO for emergent microsurgical wound repair.';
  } else if (presetId === 'HSV_DENDRITIC_KERATITIS') {
    clinicalRecommendation = 'Topical Ganciclovir 0.15% ophthalmic gel 5x/day or oral Valacyclovir. CONTRAINDICATION: Do NOT administer topical corticosteroids (causes amoebic geographic corneal melting).';
  }

  return {
    beam: {
      slitWidthMm,
      beamAngleDeg,
      filter,
      magnification,
      fluoresceinDyeInstilled,
    },
    goldmann: {
      rawDialIopMmHg: tonometerDialMmHg,
      fluoresceinSemicirclesAligned,
      semicirclesOverlapMm,
      centralCornealThicknessUm: cctUm,
      cctCorrectionOffsetMmHg,
      correctedTrueIopMmHg,
    },
    vanHerick,
    anteriorChamberCells,
    pathologyFindings,
    seidelTestPositive,
    pupilStatus,
    activeAlarms,
    clinicalRecommendation,
  };
}
