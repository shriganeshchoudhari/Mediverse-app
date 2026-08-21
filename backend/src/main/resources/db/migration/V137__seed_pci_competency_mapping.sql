-- V137__seed_pci_competency_mapping.sql

CREATE TABLE IF NOT EXISTS pci_competency_mapping (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(20) NOT NULL UNIQUE,
    subject_code VARCHAR(20) NOT NULL,
    domain VARCHAR(150) NOT NULL,
    title TEXT NOT NULL,
    competency_level VARCHAR(30) NOT NULL CHECK (competency_level IN ('KNOWS', 'KNOWS_HOW', 'SHOWS_HOW', 'PERFORMS')),
    vertical_integration TEXT[] DEFAULT '{}',
    horizontal_integration TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO pci_competency_mapping (code, subject_code, domain, title, competency_level)
VALUES
    ('PCI.HA.1', 'PHARM-HA', 'Human Anatomy', 'Describe the structure and function of the human heart.', 'KNOWS'),
    ('PCI.HA.2', 'PHARM-HA', 'Human Anatomy', 'Identify major bones of the skeletal system.', 'KNOWS'),
    ('PCI.PC.1', 'PHARM-PC', 'Pharmaceutics', 'Formulate a liquid oral dosage form.', 'SHOWS_HOW'),
    ('PCI.PC.2', 'PHARM-PC', 'Pharmaceutics', 'Evaluate the physical stability of suspensions.', 'KNOWS_HOW'),
    ('PCI.PCOL1.1', 'PHARM-PCOL1', 'Pharmacology', 'Explain the mechanism of action of beta-blockers.', 'KNOWS'),
    ('PCI.PCOL1.2', 'PHARM-PCOL1', 'Pharmacology', 'Describe the pharmacokinetics of paracetamol.', 'KNOWS'),
    ('PCI.CHEM.1', 'PHARM-CHEM', 'Chemistry', 'Draw the structure of penicillin.', 'KNOWS'),
    ('PCI.CHEM.2', 'PHARM-CHEM', 'Chemistry', 'Explain SAR of sulfonamides.', 'KNOWS'),
    ('PCI.PAT1.1', 'PHARM-PAT1', 'Pharmacotherapeutics', 'Develop a treatment plan for a patient with essential hypertension.', 'SHOWS_HOW'),
    ('PCI.PAT1.2', 'PHARM-PAT1', 'Pharmacotherapeutics', 'Recommend appropriate step-up therapy for asthma.', 'SHOWS_HOW'),
    ('PCI.CP.1', 'PHARM-CP', 'Clinical Pharmacy', 'Perform medication reconciliation upon admission.', 'PERFORMS'),
    ('PCI.CP.2', 'PHARM-CP', 'Clinical Pharmacy', 'Identify potential drug-drug interactions in a patient profile.', 'PERFORMS'),
    ('PCI.BJ.1', 'PHARM-BJ', 'Biopharmaceutics', 'Calculate bioavailability from AUC data.', 'KNOWS_HOW'),
    ('PCI.BJ.2', 'PHARM-BJ', 'Biopharmaceutics', 'Determine half-life and elimination rate constant.', 'KNOWS_HOW'),
    ('PCI.TDM.1', 'PHARM-TDM', 'Therapeutic Drug Monitoring', 'Recommend dose adjustment for phenytoin based on serum levels.', 'PERFORMS'),
    ('PCI.TDM.2', 'PHARM-TDM', 'Therapeutic Drug Monitoring', 'Interpret vancomycin trough levels.', 'PERFORMS'),
    ('PCI.PV.1', 'PHARM-PV', 'Pharmacovigilance', 'Report an adverse drug reaction to the regulatory authority.', 'PERFORMS'),
    ('PCI.PV.2', 'PHARM-PV', 'Pharmacovigilance', 'Apply the Naranjo algorithm to assess causality.', 'SHOWS_HOW'),
    ('PCI.HA.3', 'PHARM-HA', 'Human Anatomy', 'Describe the physiology of the respiratory system.', 'KNOWS'),
    ('PCI.PC.3', 'PHARM-PC', 'Pharmaceutics', 'Prepare sterile ointments.', 'SHOWS_HOW'),
    ('PCI.PCOL1.3', 'PHARM-PCOL1', 'Pharmacology', 'Discuss the adverse effects of NSAIDs.', 'KNOWS'),
    ('PCI.CHEM.3', 'PHARM-CHEM', 'Chemistry', 'Synthesize aspirin in the laboratory.', 'SHOWS_HOW'),
    ('PCI.PAT1.3', 'PHARM-PAT1', 'Pharmacotherapeutics', 'Manage a patient with type 2 diabetes mellitus.', 'SHOWS_HOW'),
    ('PCI.CP.3', 'PHARM-CP', 'Clinical Pharmacy', 'Provide patient counseling on inhaler technique.', 'PERFORMS'),
    ('PCI.BJ.3', 'PHARM-BJ', 'Biopharmaceutics', 'Explain the concept of volume of distribution.', 'KNOWS'),
    ('PCI.TDM.3', 'PHARM-TDM', 'Therapeutic Drug Monitoring', 'Calculate creatinine clearance using the Cockcroft-Gault equation.', 'PERFORMS'),
    ('PCI.PV.3', 'PHARM-PV', 'Pharmacovigilance', 'Identify safety signals from a pharmacovigilance database.', 'KNOWS_HOW'),
    ('PCI.HA.4', 'PHARM-HA', 'Human Anatomy', 'Explain the process of urine formation.', 'KNOWS'),
    ('PCI.PC.4', 'PHARM-PC', 'Pharmaceutics', 'Perform quality control tests on tablets.', 'PERFORMS'),
    ('PCI.PCOL1.4', 'PHARM-PCOL1', 'Pharmacology', 'Classify anti-epileptic drugs.', 'KNOWS')
ON CONFLICT (code) DO NOTHING;
