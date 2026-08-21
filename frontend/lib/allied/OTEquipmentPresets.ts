export interface WHOChecklistPhase {
    phase: 'Sign In' | 'Time Out' | 'Sign Out';
    timing: string;
    keyChecks: string[];
    criticalSafetyTrap: string;
}

export const WHO_SURGICAL_CHECKLIST: WHOChecklistPhase[] = [
    {
        phase: 'Sign In',
        timing: 'Before Induction of Anesthesia',
        keyChecks: [
            'Patient has confirmed identity, site, procedure, and consent',
            'Site marked',
            'Anesthesia machine and medication check complete',
            'Pulse oximeter on patient and functioning',
            'Known allergies evaluated',
            'Difficult airway or aspiration risk evaluated',
            'Risk of >500ml blood loss evaluated'
        ],
        criticalSafetyTrap: 'Failure to confirm correct patient and operative site marking'
    },
    {
        phase: 'Time Out',
        timing: 'Before Skin Incision',
        keyChecks: [
            'All team members introduced by name and role',
            'Confirm patient\'s name, procedure, and site of incision',
            'Antibiotic prophylaxis given within last 60 minutes',
            'Anticipated critical events reviewed by surgeon, anesthesia, and nursing teams',
            'Essential imaging displayed'
        ],
        criticalSafetyTrap: 'Rushing or failing to ensure all team members pause and participate'
    },
    {
        phase: 'Sign Out',
        timing: 'Before Patient Leaves Operating Room',
        keyChecks: [
            'Name of procedure recorded',
            'Completion of instrument, sponge, and needle counts',
            'Specimen labelling confirmed (read specimen labels aloud, including patient name)',
            'Any equipment problems addressed',
            'Surgeon, anesthesia professional, and nurse review key concerns for recovery and management'
        ],
        criticalSafetyTrap: 'Incorrect surgical count or mislabelled specimens'
    }
];

export interface SterilizationMethod {
    method: string;
    parameters: string;
    suitableMaterials: string[];
    cycleDurationMin: number;
    indicatorType: string;
}

export const STERILIZATION_METHODS: SterilizationMethod[] = [
    {
        method: 'Steam Autoclave',
        parameters: '121°C for 15-20 min or 134°C for 3-4 min at 15-30 psi',
        suitableMaterials: ['Surgical instruments (stainless steel)', 'Linens', 'Glassware', 'Some plastics'],
        cycleDurationMin: 45,
        indicatorType: 'Biological (Geobacillus stearothermophilus) and Chemical tape'
    },
    {
        method: 'Ethylene Oxide (ETO)',
        parameters: '37-63°C, 40-80% humidity, gas concentration 450-1200 mg/L',
        suitableMaterials: ['Heat-sensitive plastics', 'Electronic equipment', 'Tubes and catheters', 'Endoscopes'],
        cycleDurationMin: 720,
        indicatorType: 'Biological (Bacillus atrophaeus) and Chemical indicator'
    },
    {
        method: 'Hydrogen Peroxide Gas Plasma',
        parameters: '45-50°C in vacuum chamber',
        suitableMaterials: ['Heat and moisture sensitive items', 'Cameras', 'Light cables', 'Rigid endoscopes'],
        cycleDurationMin: 45,
        indicatorType: 'Biological (Geobacillus stearothermophilus) and Chemical strip'
    }
];
