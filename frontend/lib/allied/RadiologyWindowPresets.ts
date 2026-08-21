export interface CTWindowPreset {
    id: string;
    name: string;
    anatomicalRegion: string;
    windowWidthHU: number;
    windowLevelHU: number;
    tissueRangeHU: { min: number; max: number };
    clinicalPurpose: string;
}

export const CT_WINDOW_PRESETS: CTWindowPreset[] = [
    { id: 'brain', name: 'Brain', anatomicalRegion: 'Head', windowWidthHU: 80, windowLevelHU: 40, tissueRangeHU: { min: 0, max: 80 }, clinicalPurpose: 'Grey/white matter differentiation, acute stroke, hemorrhage' },
    { id: 'subdural', name: 'Subdural', anatomicalRegion: 'Head', windowWidthHU: 200, windowLevelHU: 80, tissueRangeHU: { min: -20, max: 180 }, clinicalPurpose: 'Subdural hematomas, subtle intracranial hemorrhage' },
    { id: 'bone', name: 'Bone', anatomicalRegion: 'General', windowWidthHU: 2000, windowLevelHU: 500, tissueRangeHU: { min: -500, max: 1500 }, clinicalPurpose: 'Fractures, bone lesions, cortical/medullary evaluation' },
    { id: 'lung', name: 'Lung', anatomicalRegion: 'Chest', windowWidthHU: 1500, windowLevelHU: -600, tissueRangeHU: { min: -1350, max: 150 }, clinicalPurpose: 'Lung parenchyma, nodules, interstitial disease' },
    { id: 'soft-tissue-mediastinum', name: 'Soft Tissue / Mediastinum', anatomicalRegion: 'Chest/Abdomen/Pelvis', windowWidthHU: 350, windowLevelHU: 50, tissueRangeHU: { min: -125, max: 225 }, clinicalPurpose: 'General soft tissue evaluation, solid organs, vessels' },
    { id: 'liver', name: 'Liver', anatomicalRegion: 'Abdomen', windowWidthHU: 150, windowLevelHU: 30, tissueRangeHU: { min: -45, max: 105 }, clinicalPurpose: 'Enhancing liver lesions, metastasis evaluation' }
];

export interface MRIPulseSequence {
    id: string;
    name: string;
    trMs: number;
    teMs: number;
    fluidAppearance: 'Dark (Hypointense)' | 'Bright (Hyperintense)' | 'Suppressed' | 'Variable (Restricted diffusion is Bright on DWI, Dark on ADC)' | string;
    fatAppearance: string;
    clinicalUtility: string;
}

export const MRI_PULSE_SEQUENCES: MRIPulseSequence[] = [
    { id: 't1w', name: 'T1-Weighted', trMs: 500, teMs: 15, fluidAppearance: 'Dark (Hypointense)', fatAppearance: 'Bright (Hyperintense)', clinicalUtility: 'Anatomy, post-contrast enhancement, hemorrhage staging' },
    { id: 't2w', name: 'T2-Weighted', trMs: 4000, teMs: 100, fluidAppearance: 'Bright (Hyperintense)', fatAppearance: 'Intermediate to Bright', clinicalUtility: 'Pathology detection (edema, inflammation, tumors)' },
    { id: 'flair', name: 'FLAIR', trMs: 9000, teMs: 110, fluidAppearance: 'Suppressed', fatAppearance: 'Intermediate', clinicalUtility: 'Periventricular lesions, MS plaques, subtle edema' },
    { id: 'dwi-adc', name: 'DWI/ADC', trMs: 6000, teMs: 90, fluidAppearance: 'Variable (Restricted diffusion is Bright on DWI, Dark on ADC)', fatAppearance: 'Intermediate to Suppressed', clinicalUtility: 'Acute ischemia, abscess, hypercellular tumors' }
];

export function getHUColor(hu: number, ww: number, wl: number): string {
    const minHU = wl - (ww / 2);
    const maxHU = wl + (ww / 2);
    
    if (hu <= minHU) return '#000000';
    if (hu >= maxHU) return '#ffffff';
    
    const intensity = Math.floor(((hu - minHU) / ww) * 255);
    const hex = intensity.toString(16).padStart(2, '0');
    return `#${hex}${hex}${hex}`;
}
