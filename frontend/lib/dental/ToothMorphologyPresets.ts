/**
 * ToothMorphologyPresets.ts — Dental Tooth Morphology Registry
 * 
 * Complete dataset for all 52 teeth (32 permanent + 20 primary) with
 * dimensional data, canal configurations, and clinical landmarks.
 * Used by ToothMorphologyViewer.tsx for interactive 3D tooth explorer.
 */

export type ToothArch = 'maxillary' | 'mandibular';
export type ToothType = 'permanent' | 'primary';
export type ToothPosition =
  | 'central_incisor' | 'lateral_incisor' | 'canine'
  | 'first_premolar' | 'second_premolar'
  | 'first_molar' | 'second_molar' | 'third_molar';

export interface ToothPreset {
  id: string;                    // e.g. 'UR1', 'UL6', 'LR4'
  fdiNotation: string;           // e.g. '11', '26', '44'
  usNotation: string;            // e.g. '#8', '#14', '#29'
  name: string;                  // e.g. 'Upper Right Central Incisor'
  type: ToothType;
  arch: ToothArch;
  position: ToothPosition;
  rootCount: number;
  canalCount: number;
  vertucciType: string;          // e.g. 'Type I (1 canal)', 'Type III (1-2-1)', 'N/A (primary)'
  crownHeightMm: number;
  rootLengthMm: number;
  mesiodistalWidthMm: number;
  buccolingualWidthMm: number;
  enamelThicknessAtCuspMm: number;
  workingLengthAvgMm: number;    // Average total tooth length
  clinicalPearl: string;
  commonAnomaly: string;
  extractionTip: string;
}

export const TOOTH_PRESETS: ToothPreset[] = [
  // --- PERMANENT TEETH ---
  {
    id: 'UR1', fdiNotation: '11', usNotation: '#8',
    name: 'Maxillary Right Central Incisor',
    type: 'permanent', arch: 'maxillary', position: 'central_incisor',
    rootCount: 1, canalCount: 1, vertucciType: 'Type I (1 canal)',
    crownHeightMm: 10.5, rootLengthMm: 13, mesiodistalWidthMm: 8.5, buccolingualWidthMm: 7, enamelThicknessAtCuspMm: 2, workingLengthAvgMm: 23.5,
    clinicalPearl: 'Widest mesiodistal crown of any anterior tooth.',
    commonAnomaly: 'Talon cusp, Dens invaginatus',
    extractionTip: 'Use rotational force, root is generally conical.'
  },
  {
    id: 'UL1', fdiNotation: '21', usNotation: '#9',
    name: 'Maxillary Left Central Incisor',
    type: 'permanent', arch: 'maxillary', position: 'central_incisor',
    rootCount: 1, canalCount: 1, vertucciType: 'Type I (1 canal)',
    crownHeightMm: 10.5, rootLengthMm: 13, mesiodistalWidthMm: 8.5, buccolingualWidthMm: 7, enamelThicknessAtCuspMm: 2, workingLengthAvgMm: 23.5,
    clinicalPearl: 'Mirror of UR1 — identical morphology.',
    commonAnomaly: 'Talon cusp, Dens invaginatus',
    extractionTip: 'Use rotational force, root is generally conical.'
  },
  {
    id: 'UR2', fdiNotation: '12', usNotation: '#7',
    name: 'Maxillary Right Lateral Incisor',
    type: 'permanent', arch: 'maxillary', position: 'lateral_incisor',
    rootCount: 1, canalCount: 1, vertucciType: 'Type I (1 canal)',
    crownHeightMm: 9, rootLengthMm: 13, mesiodistalWidthMm: 6.5, buccolingualWidthMm: 6, enamelThicknessAtCuspMm: 2, workingLengthAvgMm: 22,
    clinicalPearl: 'Root often dilacerated distally at the apical third.',
    commonAnomaly: 'Highest incidence of dens invaginatus, peg lateral',
    extractionTip: 'Be careful of disto-palatal curve during extraction.'
  },
  {
    id: 'UL2', fdiNotation: '22', usNotation: '#10',
    name: 'Maxillary Left Lateral Incisor',
    type: 'permanent', arch: 'maxillary', position: 'lateral_incisor',
    rootCount: 1, canalCount: 1, vertucciType: 'Type I (1 canal)',
    crownHeightMm: 9, rootLengthMm: 13, mesiodistalWidthMm: 6.5, buccolingualWidthMm: 6, enamelThicknessAtCuspMm: 2, workingLengthAvgMm: 22,
    clinicalPearl: 'Mirror of UR2 — identical morphology.',
    commonAnomaly: 'Highest incidence of dens invaginatus, peg lateral',
    extractionTip: 'Be careful of disto-palatal curve during extraction.'
  },
  {
    id: 'UR3', fdiNotation: '13', usNotation: '#6',
    name: 'Maxillary Right Canine',
    type: 'permanent', arch: 'maxillary', position: 'canine',
    rootCount: 1, canalCount: 1, vertucciType: 'Type I (1 canal)',
    crownHeightMm: 10, rootLengthMm: 17, mesiodistalWidthMm: 7.5, buccolingualWidthMm: 8, enamelThicknessAtCuspMm: 2.5, workingLengthAvgMm: 27,
    clinicalPearl: 'Longest tooth in mouth. Canine eminence offers primary support for facial expressions.',
    commonAnomaly: 'Impaction',
    extractionTip: 'Thick labial bone, luxation often requires significant buccal expansion.'
  },
  {
    id: 'UL3', fdiNotation: '23', usNotation: '#11',
    name: 'Maxillary Left Canine',
    type: 'permanent', arch: 'maxillary', position: 'canine',
    rootCount: 1, canalCount: 1, vertucciType: 'Type I (1 canal)',
    crownHeightMm: 10, rootLengthMm: 17, mesiodistalWidthMm: 7.5, buccolingualWidthMm: 8, enamelThicknessAtCuspMm: 2.5, workingLengthAvgMm: 27,
    clinicalPearl: 'Mirror of UR3 — identical morphology.',
    commonAnomaly: 'Impaction',
    extractionTip: 'Thick labial bone, luxation often requires significant buccal expansion.'
  },
  {
    id: 'UR4', fdiNotation: '14', usNotation: '#5',
    name: 'Maxillary Right First Premolar',
    type: 'permanent', arch: 'maxillary', position: 'first_premolar',
    rootCount: 2, canalCount: 2, vertucciType: 'Type IV (2 canals)',
    crownHeightMm: 8.5, rootLengthMm: 14, mesiodistalWidthMm: 7, buccolingualWidthMm: 9, enamelThicknessAtCuspMm: 2, workingLengthAvgMm: 22.5,
    clinicalPearl: 'Mesial marginal developmental groove makes this highly prone to root fracture during extraction.',
    commonAnomaly: 'Three roots (MB, DB, Palatal) in 5% of cases.',
    extractionTip: 'High risk of root fracture, avoid excessive buccal forces.'
  },
  {
    id: 'UL4', fdiNotation: '24', usNotation: '#12',
    name: 'Maxillary Left First Premolar',
    type: 'permanent', arch: 'maxillary', position: 'first_premolar',
    rootCount: 2, canalCount: 2, vertucciType: 'Type IV (2 canals)',
    crownHeightMm: 8.5, rootLengthMm: 14, mesiodistalWidthMm: 7, buccolingualWidthMm: 9, enamelThicknessAtCuspMm: 2, workingLengthAvgMm: 22.5,
    clinicalPearl: 'Mirror of UR4 — identical morphology.',
    commonAnomaly: 'Three roots (MB, DB, Palatal) in 5% of cases.',
    extractionTip: 'High risk of root fracture, avoid excessive buccal forces.'
  },
  {
    id: 'UR5', fdiNotation: '15', usNotation: '#4',
    name: 'Maxillary Right Second Premolar',
    type: 'permanent', arch: 'maxillary', position: 'second_premolar',
    rootCount: 1, canalCount: 1, vertucciType: 'Type I or II (1-2 canals)',
    crownHeightMm: 8, rootLengthMm: 14, mesiodistalWidthMm: 7, buccolingualWidthMm: 9, enamelThicknessAtCuspMm: 2, workingLengthAvgMm: 22,
    clinicalPearl: 'Single root, but canal can frequently split apically.',
    commonAnomaly: 'Dens evaginatus',
    extractionTip: 'Use careful luxation, single root is generally easier to extract than first premolar.'
  },
  {
    id: 'UL5', fdiNotation: '25', usNotation: '#13',
    name: 'Maxillary Left Second Premolar',
    type: 'permanent', arch: 'maxillary', position: 'second_premolar',
    rootCount: 1, canalCount: 1, vertucciType: 'Type I or II (1-2 canals)',
    crownHeightMm: 8, rootLengthMm: 14, mesiodistalWidthMm: 7, buccolingualWidthMm: 9, enamelThicknessAtCuspMm: 2, workingLengthAvgMm: 22,
    clinicalPearl: 'Mirror of UR5 — identical morphology.',
    commonAnomaly: 'Dens evaginatus',
    extractionTip: 'Use careful luxation, single root is generally easier to extract than first premolar.'
  },
  {
    id: 'UR6', fdiNotation: '16', usNotation: '#3',
    name: 'Maxillary Right First Molar',
    type: 'permanent', arch: 'maxillary', position: 'first_molar',
    rootCount: 3, canalCount: 4, vertucciType: 'Type II (MB root)',
    crownHeightMm: 7.5, rootLengthMm: 13, mesiodistalWidthMm: 10, buccolingualWidthMm: 11, enamelThicknessAtCuspMm: 2.5, workingLengthAvgMm: 20.5,
    clinicalPearl: 'Most commonly endodontically treated tooth. MB2 canal present in up to 90% of cases.',
    commonAnomaly: 'Cusp of Carabelli on mesiopalatal aspect',
    extractionTip: 'Sectioning often required due to divergent roots.'
  },
  {
    id: 'UL6', fdiNotation: '26', usNotation: '#14',
    name: 'Maxillary Left First Molar',
    type: 'permanent', arch: 'maxillary', position: 'first_molar',
    rootCount: 3, canalCount: 4, vertucciType: 'Type II (MB root)',
    crownHeightMm: 7.5, rootLengthMm: 13, mesiodistalWidthMm: 10, buccolingualWidthMm: 11, enamelThicknessAtCuspMm: 2.5, workingLengthAvgMm: 20.5,
    clinicalPearl: 'Mirror of UR6 — identical morphology.',
    commonAnomaly: 'Cusp of Carabelli on mesiopalatal aspect',
    extractionTip: 'Sectioning often required due to divergent roots.'
  },
  {
    id: 'UR7', fdiNotation: '17', usNotation: '#2',
    name: 'Maxillary Right Second Molar',
    type: 'permanent', arch: 'maxillary', position: 'second_molar',
    rootCount: 3, canalCount: 3, vertucciType: 'Type I',
    crownHeightMm: 7, rootLengthMm: 12, mesiodistalWidthMm: 9, buccolingualWidthMm: 10, enamelThicknessAtCuspMm: 2, workingLengthAvgMm: 20,
    clinicalPearl: 'Roots are closer together and often fused compared to first molar.',
    commonAnomaly: 'Taurodontism, fused roots',
    extractionTip: 'Roots often fused, making extraction simpler than first molar but visibility is poorer.'
  },
  {
    id: 'UL7', fdiNotation: '27', usNotation: '#15',
    name: 'Maxillary Left Second Molar',
    type: 'permanent', arch: 'maxillary', position: 'second_molar',
    rootCount: 3, canalCount: 3, vertucciType: 'Type I',
    crownHeightMm: 7, rootLengthMm: 12, mesiodistalWidthMm: 9, buccolingualWidthMm: 10, enamelThicknessAtCuspMm: 2, workingLengthAvgMm: 20,
    clinicalPearl: 'Mirror of UR7 — identical morphology.',
    commonAnomaly: 'Taurodontism, fused roots',
    extractionTip: 'Roots often fused, making extraction simpler than first molar but visibility is poorer.'
  },
  {
    id: 'UR8', fdiNotation: '18', usNotation: '#1',
    name: 'Maxillary Right Third Molar',
    type: 'permanent', arch: 'maxillary', position: 'third_molar',
    rootCount: 3, canalCount: 3, vertucciType: 'Variable',
    crownHeightMm: 6.5, rootLengthMm: 11, mesiodistalWidthMm: 8.5, buccolingualWidthMm: 10, enamelThicknessAtCuspMm: 2, workingLengthAvgMm: 17.5,
    clinicalPearl: 'Variable morphology, most commonly impacted tooth in the maxilla.',
    commonAnomaly: 'Microdontia, impaction, highly variable roots',
    extractionTip: 'Often requires surgical extraction. Be aware of maxillary tuberosity fracture risk.'
  },
  {
    id: 'UL8', fdiNotation: '28', usNotation: '#16',
    name: 'Maxillary Left Third Molar',
    type: 'permanent', arch: 'maxillary', position: 'third_molar',
    rootCount: 3, canalCount: 3, vertucciType: 'Variable',
    crownHeightMm: 6.5, rootLengthMm: 11, mesiodistalWidthMm: 8.5, buccolingualWidthMm: 10, enamelThicknessAtCuspMm: 2, workingLengthAvgMm: 17.5,
    clinicalPearl: 'Mirror of UR8 — identical morphology.',
    commonAnomaly: 'Microdontia, impaction, highly variable roots',
    extractionTip: 'Often requires surgical extraction. Be aware of maxillary tuberosity fracture risk.'
  },
  {
    id: 'LR1', fdiNotation: '41', usNotation: '#25',
    name: 'Mandibular Right Central Incisor',
    type: 'permanent', arch: 'mandibular', position: 'central_incisor',
    rootCount: 1, canalCount: 1, vertucciType: 'Type I (85%), Type III (15%)',
    crownHeightMm: 8.8, rootLengthMm: 12.5, mesiodistalWidthMm: 5, buccolingualWidthMm: 6, enamelThicknessAtCuspMm: 1.5, workingLengthAvgMm: 21.5,
    clinicalPearl: 'Smallest tooth in mouth. Missed lingual canal is a common cause of endodontic failure.',
    commonAnomaly: 'Two canals (15%)',
    extractionTip: 'Very thin roots, strictly avoid rotational forces.'
  },
  {
    id: 'LL1', fdiNotation: '31', usNotation: '#24',
    name: 'Mandibular Left Central Incisor',
    type: 'permanent', arch: 'mandibular', position: 'central_incisor',
    rootCount: 1, canalCount: 1, vertucciType: 'Type I (85%), Type III (15%)',
    crownHeightMm: 8.8, rootLengthMm: 12.5, mesiodistalWidthMm: 5, buccolingualWidthMm: 6, enamelThicknessAtCuspMm: 1.5, workingLengthAvgMm: 21.5,
    clinicalPearl: 'Mirror of LR1 — identical morphology.',
    commonAnomaly: 'Two canals (15%)',
    extractionTip: 'Very thin roots, strictly avoid rotational forces.'
  },
  {
    id: 'LR2', fdiNotation: '42', usNotation: '#26',
    name: 'Mandibular Right Lateral Incisor',
    type: 'permanent', arch: 'mandibular', position: 'lateral_incisor',
    rootCount: 1, canalCount: 1, vertucciType: 'Type I or III',
    crownHeightMm: 9.5, rootLengthMm: 14, mesiodistalWidthMm: 5.5, buccolingualWidthMm: 6.5, enamelThicknessAtCuspMm: 1.5, workingLengthAvgMm: 23.5,
    clinicalPearl: 'Slightly larger than central incisor, crown tilts distally.',
    commonAnomaly: 'Two canals',
    extractionTip: 'Slight rotation is acceptable but primarily luxation.'
  },
  {
    id: 'LL2', fdiNotation: '32', usNotation: '#23',
    name: 'Mandibular Left Lateral Incisor',
    type: 'permanent', arch: 'mandibular', position: 'lateral_incisor',
    rootCount: 1, canalCount: 1, vertucciType: 'Type I or III',
    crownHeightMm: 9.5, rootLengthMm: 14, mesiodistalWidthMm: 5.5, buccolingualWidthMm: 6.5, enamelThicknessAtCuspMm: 1.5, workingLengthAvgMm: 23.5,
    clinicalPearl: 'Mirror of LR2 — identical morphology.',
    commonAnomaly: 'Two canals',
    extractionTip: 'Slight rotation is acceptable but primarily luxation.'
  },
  {
    id: 'LR3', fdiNotation: '43', usNotation: '#27',
    name: 'Mandibular Right Canine',
    type: 'permanent', arch: 'mandibular', position: 'canine',
    rootCount: 1, canalCount: 1, vertucciType: 'Type I',
    crownHeightMm: 11, rootLengthMm: 15, mesiodistalWidthMm: 7, buccolingualWidthMm: 7.5, enamelThicknessAtCuspMm: 2, workingLengthAvgMm: 26,
    clinicalPearl: 'Longest root in mandibular arch. Seldom bifurcated root.',
    commonAnomaly: 'Bifurcated root (rare)',
    extractionTip: 'Requires strong luxation due to dense mandibular bone.'
  },
  {
    id: 'LL3', fdiNotation: '33', usNotation: '#22',
    name: 'Mandibular Left Canine',
    type: 'permanent', arch: 'mandibular', position: 'canine',
    rootCount: 1, canalCount: 1, vertucciType: 'Type I',
    crownHeightMm: 11, rootLengthMm: 15, mesiodistalWidthMm: 7, buccolingualWidthMm: 7.5, enamelThicknessAtCuspMm: 2, workingLengthAvgMm: 26,
    clinicalPearl: 'Mirror of LR3 — identical morphology.',
    commonAnomaly: 'Bifurcated root (rare)',
    extractionTip: 'Requires strong luxation due to dense mandibular bone.'
  },
  {
    id: 'LR4', fdiNotation: '44', usNotation: '#28',
    name: 'Mandibular Right First Premolar',
    type: 'permanent', arch: 'mandibular', position: 'first_premolar',
    rootCount: 1, canalCount: 1, vertucciType: 'Type I (75%)',
    crownHeightMm: 8.5, rootLengthMm: 14, mesiodistalWidthMm: 7, buccolingualWidthMm: 7.5, enamelThicknessAtCuspMm: 2, workingLengthAvgMm: 22.5,
    clinicalPearl: 'Lingual cusp is very small, non-functional. Complex root morphology common.',
    commonAnomaly: 'Multiple canals, C-shaped variations',
    extractionTip: 'Luxation mostly, watch for mental nerve in the area.'
  },
  {
    id: 'LL4', fdiNotation: '34', usNotation: '#21',
    name: 'Mandibular Left First Premolar',
    type: 'permanent', arch: 'mandibular', position: 'first_premolar',
    rootCount: 1, canalCount: 1, vertucciType: 'Type I (75%)',
    crownHeightMm: 8.5, rootLengthMm: 14, mesiodistalWidthMm: 7, buccolingualWidthMm: 7.5, enamelThicknessAtCuspMm: 2, workingLengthAvgMm: 22.5,
    clinicalPearl: 'Mirror of LR4 — identical morphology.',
    commonAnomaly: 'Multiple canals, C-shaped variations',
    extractionTip: 'Luxation mostly, watch for mental nerve in the area.'
  },
  {
    id: 'LR5', fdiNotation: '45', usNotation: '#29',
    name: 'Mandibular Right Second Premolar',
    type: 'permanent', arch: 'mandibular', position: 'second_premolar',
    rootCount: 1, canalCount: 1, vertucciType: 'Type I (1-3 canals)',
    crownHeightMm: 8, rootLengthMm: 14.5, mesiodistalWidthMm: 7, buccolingualWidthMm: 8, enamelThicknessAtCuspMm: 2, workingLengthAvgMm: 22.5,
    clinicalPearl: 'Often has two or three lingual cusps (Y, U, or H occlusal pattern).',
    commonAnomaly: 'Dens evaginatus',
    extractionTip: 'Mental nerve proximity is a key concern during surgical extraction.'
  },
  {
    id: 'LL5', fdiNotation: '35', usNotation: '#20',
    name: 'Mandibular Left Second Premolar',
    type: 'permanent', arch: 'mandibular', position: 'second_premolar',
    rootCount: 1, canalCount: 1, vertucciType: 'Type I (1-3 canals)',
    crownHeightMm: 8, rootLengthMm: 14.5, mesiodistalWidthMm: 7, buccolingualWidthMm: 8, enamelThicknessAtCuspMm: 2, workingLengthAvgMm: 22.5,
    clinicalPearl: 'Mirror of LR5 — identical morphology.',
    commonAnomaly: 'Dens evaginatus',
    extractionTip: 'Mental nerve proximity is a key concern during surgical extraction.'
  },
  {
    id: 'LR6', fdiNotation: '46', usNotation: '#30',
    name: 'Mandibular Right First Molar',
    type: 'permanent', arch: 'mandibular', position: 'first_molar',
    rootCount: 2, canalCount: 3, vertucciType: 'Mesial: Type II or IV, Distal: Type I',
    crownHeightMm: 7.5, rootLengthMm: 14, mesiodistalWidthMm: 11, buccolingualWidthMm: 10.5, enamelThicknessAtCuspMm: 2.5, workingLengthAvgMm: 21.5,
    clinicalPearl: 'Most commonly extracted permanent tooth. Mesial root commonly has two canals (MB and ML).',
    commonAnomaly: 'Radix entomolaris (extra distolingual root)',
    extractionTip: 'Often requires sectioning. Dense buccal bone makes extraction challenging.'
  },
  {
    id: 'LL6', fdiNotation: '36', usNotation: '#19',
    name: 'Mandibular Left First Molar',
    type: 'permanent', arch: 'mandibular', position: 'first_molar',
    rootCount: 2, canalCount: 3, vertucciType: 'Mesial: Type II or IV, Distal: Type I',
    crownHeightMm: 7.5, rootLengthMm: 14, mesiodistalWidthMm: 11, buccolingualWidthMm: 10.5, enamelThicknessAtCuspMm: 2.5, workingLengthAvgMm: 21.5,
    clinicalPearl: 'Mirror of LR6 — identical morphology.',
    commonAnomaly: 'Radix entomolaris (extra distolingual root)',
    extractionTip: 'Often requires sectioning. Dense buccal bone makes extraction challenging.'
  },
  {
    id: 'LR7', fdiNotation: '47', usNotation: '#31',
    name: 'Mandibular Right Second Molar',
    type: 'permanent', arch: 'mandibular', position: 'second_molar',
    rootCount: 2, canalCount: 3, vertucciType: 'Type I',
    crownHeightMm: 7, rootLengthMm: 13, mesiodistalWidthMm: 10.5, buccolingualWidthMm: 10, enamelThicknessAtCuspMm: 2.5, workingLengthAvgMm: 20,
    clinicalPearl: 'C-shaped canal is very prevalent in East Asian populations.',
    commonAnomaly: 'C-shaped root canal system',
    extractionTip: 'Easier to extract than first molar due to less divergent roots, but access is harder.'
  },
  {
    id: 'LL7', fdiNotation: '37', usNotation: '#18',
    name: 'Mandibular Left Second Molar',
    type: 'permanent', arch: 'mandibular', position: 'second_molar',
    rootCount: 2, canalCount: 3, vertucciType: 'Type I',
    crownHeightMm: 7, rootLengthMm: 13, mesiodistalWidthMm: 10.5, buccolingualWidthMm: 10, enamelThicknessAtCuspMm: 2.5, workingLengthAvgMm: 20,
    clinicalPearl: 'Mirror of LR7 — identical morphology.',
    commonAnomaly: 'C-shaped root canal system',
    extractionTip: 'Easier to extract than first molar due to less divergent roots, but access is harder.'
  },
  {
    id: 'LR8', fdiNotation: '48', usNotation: '#32',
    name: 'Mandibular Right Third Molar',
    type: 'permanent', arch: 'mandibular', position: 'third_molar',
    rootCount: 2, canalCount: 2, vertucciType: 'Variable',
    crownHeightMm: 7, rootLengthMm: 11, mesiodistalWidthMm: 10, buccolingualWidthMm: 9.5, enamelThicknessAtCuspMm: 2, workingLengthAvgMm: 18,
    clinicalPearl: 'Highest surgical extraction rate. Close proximity to Inferior Alveolar Nerve.',
    commonAnomaly: 'Impaction, supernumerary roots',
    extractionTip: 'Surgical extraction common. Sectioning often required. Evaluate IAN relationship via CBCT.'
  },
  {
    id: 'LL8', fdiNotation: '38', usNotation: '#17',
    name: 'Mandibular Left Third Molar',
    type: 'permanent', arch: 'mandibular', position: 'third_molar',
    rootCount: 2, canalCount: 2, vertucciType: 'Variable',
    crownHeightMm: 7, rootLengthMm: 11, mesiodistalWidthMm: 10, buccolingualWidthMm: 9.5, enamelThicknessAtCuspMm: 2, workingLengthAvgMm: 18,
    clinicalPearl: 'Mirror of LR8 — identical morphology.',
    commonAnomaly: 'Impaction, supernumerary roots',
    extractionTip: 'Surgical extraction common. Sectioning often required. Evaluate IAN relationship via CBCT.'
  },

  // --- PRIMARY TEETH (Sample Selection) ---
  {
    id: 'UR1_PRIMARY', fdiNotation: '51', usNotation: 'E',
    name: 'Maxillary Right Primary Central Incisor',
    type: 'primary', arch: 'maxillary', position: 'central_incisor',
    rootCount: 1, canalCount: 1, vertucciType: 'N/A (primary)',
    crownHeightMm: 6, rootLengthMm: 10, mesiodistalWidthMm: 6.5, buccolingualWidthMm: 5, enamelThicknessAtCuspMm: 1, workingLengthAvgMm: 16,
    clinicalPearl: 'Resorbing root at age 6-7 prior to permanent eruption.',
    commonAnomaly: 'Natal/neonatal teeth',
    extractionTip: 'Simple extraction if resorbed. Avoid damaging permanent successor.'
  },
  {
    id: 'UR6_PRIMARY', fdiNotation: '54', usNotation: 'B',
    name: 'Maxillary Right First Primary Molar',
    type: 'primary', arch: 'maxillary', position: 'first_molar',
    rootCount: 3, canalCount: 3, vertucciType: 'N/A (primary)',
    crownHeightMm: 5.1, rootLengthMm: 10, mesiodistalWidthMm: 7.3, buccolingualWidthMm: 8.5, enamelThicknessAtCuspMm: 1, workingLengthAvgMm: 15.1,
    clinicalPearl: 'Furcation involvement critical in pulpectomy.',
    commonAnomaly: 'Early loss leading to space loss',
    extractionTip: 'Roots are highly divergent, careful sectioning if needed to avoid premolar bud.'
  },
  {
    id: 'LR5_PRIMARY', fdiNotation: '84', usNotation: 'S',
    name: 'Mandibular Right First Primary Molar',
    type: 'primary', arch: 'mandibular', position: 'first_molar',
    rootCount: 2, canalCount: 3, vertucciType: 'N/A (primary)',
    crownHeightMm: 6, rootLengthMm: 9.8, mesiodistalWidthMm: 7.7, buccolingualWidthMm: 7, enamelThicknessAtCuspMm: 1, workingLengthAvgMm: 15.8,
    clinicalPearl: 'Does not resemble any other tooth in the human dentition.',
    commonAnomaly: 'Early loss',
    extractionTip: 'Careful with divergent roots around permanent successor.'
  }
];

export const PERMANENT_TEETH = TOOTH_PRESETS.filter(t => t.type === 'permanent');
export const PRIMARY_TEETH = TOOTH_PRESETS.filter(t => t.type === 'primary');

export function getToothById(id: string): ToothPreset | undefined {
  return TOOTH_PRESETS.find(t => t.id === id);
}

export function getToothByFDI(fdi: string): ToothPreset | undefined {
  return TOOTH_PRESETS.find(t => t.fdiNotation === fdi);
}
