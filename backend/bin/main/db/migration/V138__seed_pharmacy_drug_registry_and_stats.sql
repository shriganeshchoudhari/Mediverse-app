-- V138__seed_pharmacy_drug_registry_and_stats.sql

CREATE TABLE IF NOT EXISTS pharmacy_drug_registry (
    id VARCHAR(50) PRIMARY KEY,
    generic_name VARCHAR(150) NOT NULL,
    brand_names TEXT[] NOT NULL,
    drug_class VARCHAR(100) NOT NULL,
    therapeutic_category VARCHAR(100) NOT NULL,
    route_of_admin VARCHAR(50) NOT NULL,
    half_life_hours REAL NOT NULL,
    volume_of_distribution_l_kg REAL NOT NULL,
    clearance_ml_min_kg REAL NOT NULL,
    bioavailability_percent REAL NOT NULL,
    therapeutic_range VARCHAR(100) NOT NULL,
    toxic_threshold VARCHAR(100) NOT NULL,
    protein_binding_percent REAL NOT NULL,
    cyp_metabolism VARCHAR(100) NOT NULL,
    renal_elimination_percent REAL NOT NULL
);

INSERT INTO pharmacy_drug_registry (id, generic_name, brand_names, drug_class, therapeutic_category, route_of_admin, half_life_hours, volume_of_distribution_l_kg, clearance_ml_min_kg, bioavailability_percent, therapeutic_range, toxic_threshold, protein_binding_percent, cyp_metabolism, renal_elimination_percent)
VALUES
    ('DRUG-001', 'Vancomycin', '{"Vancocin"}', 'Glycopeptide Antibiotic', 'Antibacterial', 'IV', 6.0, 0.7, 1.0, 0.0, '10-20 mcg/mL', '>20 mcg/mL', 55.0, 'None', 90.0),
    ('DRUG-002', 'Gentamicin', '{"Garamycin"}', 'Aminoglycoside', 'Antibacterial', 'IV/IM', 2.0, 0.25, 1.2, 0.0, 'Peak: 5-10, Trough: <2 mcg/mL', '>12 mcg/mL', 10.0, 'None', 99.0),
    ('DRUG-003', 'Digoxin', '{"Lanoxin"}', 'Cardiac Glycoside', 'Antiarrhythmic/Inotropic', 'PO/IV', 36.0, 7.0, 1.1, 75.0, '0.8-2.0 ng/mL', '>2.0 ng/mL', 25.0, 'None', 70.0),
    ('DRUG-004', 'Phenytoin', '{"Dilantin"}', 'Hydantoin', 'Anticonvulsant', 'PO/IV', 22.0, 0.6, 0.0, 90.0, '10-20 mcg/mL', '>20 mcg/mL', 90.0, 'CYP2C9/2C19', 5.0),
    ('DRUG-005', 'Lithium', '{"Eskalith", "Lithobid"}', 'Alkali Metal', 'Mood Stabilizer', 'PO', 24.0, 0.9, 0.0, 100.0, '0.6-1.2 mEq/L', '>1.5 mEq/L', 0.0, 'None', 95.0),
    ('DRUG-006', 'Tacrolimus', '{"Prograf"}', 'Calcineurin Inhibitor', 'Immunosuppressant', 'PO/IV', 12.0, 1.0, 0.0, 25.0, '5-15 ng/mL', '>20 ng/mL', 99.0, 'CYP3A4', 1.0),
    ('DRUG-007', 'Carbamazepine', '{"Tegretol"}', 'Iminostilbene', 'Anticonvulsant', 'PO', 15.0, 1.4, 0.0, 80.0, '4-12 mcg/mL', '>15 mcg/mL', 75.0, 'CYP3A4', 1.0),
    ('DRUG-008', 'Theophylline', '{"Theo-Dur"}', 'Methylxanthine', 'Bronchodilator', 'PO/IV', 8.0, 0.5, 0.0, 100.0, '5-15 mcg/mL', '>20 mcg/mL', 40.0, 'CYP1A2', 10.0),
    ('DRUG-009', 'Warfarin', '{"Coumadin"}', 'Vitamin K Antagonist', 'Anticoagulant', 'PO', 40.0, 0.14, 0.0, 100.0, 'INR 2.0-3.0', 'INR > 3.0', 99.0, 'CYP2C9', 1.0),
    ('DRUG-010', 'Methotrexate', '{"Trexall"}', 'Antimetabolite', 'Antineoplastic/Immunosuppressant', 'PO/IV/IM/SC', 10.0, 0.8, 0.0, 60.0, 'Variable', '>0.1 uM', 50.0, 'Minor', 80.0),
    ('DRUG-011', 'Cyclosporine', '{"Sandimmune", "Neoral"}', 'Calcineurin Inhibitor', 'Immunosuppressant', 'PO/IV', 8.0, 4.0, 0.0, 30.0, '100-400 ng/mL', '>400 ng/mL', 90.0, 'CYP3A4', 1.0),
    ('DRUG-012', 'Valproic Acid', '{"Depakote"}', 'Carboxylic Acid', 'Anticonvulsant', 'PO/IV', 14.0, 0.2, 0.0, 100.0, '50-100 mcg/mL', '>150 mcg/mL', 90.0, 'CYP2C9/UGT', 3.0),
    ('DRUG-013', 'Amikacin', '{"Amikin"}', 'Aminoglycoside', 'Antibacterial', 'IV/IM', 2.5, 0.25, 1.2, 0.0, 'Peak: 20-30, Trough: <5 mcg/mL', '>35 mcg/mL', 10.0, 'None', 99.0),
    ('DRUG-014', 'Atorvastatin', '{"Lipitor"}', 'HMG-CoA Reductase Inhibitor', 'Antilipemic', 'PO', 14.0, 381.0, 0.0, 14.0, 'N/A', 'N/A', 98.0, 'CYP3A4', 2.0),
    ('DRUG-015', 'Metformin', '{"Glucophage"}', 'Biguanide', 'Antidiabetic', 'PO', 6.0, 654.0, 0.0, 50.0, 'N/A', 'N/A', 0.0, 'None', 90.0),
    ('DRUG-016', 'Amlodipine', '{"Norvasc"}', 'Calcium Channel Blocker', 'Antihypertensive', 'PO', 40.0, 21.0, 0.0, 64.0, 'N/A', 'N/A', 93.0, 'CYP3A4', 10.0),
    ('DRUG-017', 'Lisinopril', '{"Prinivil", "Zestril"}', 'ACE Inhibitor', 'Antihypertensive', 'PO', 12.0, 1.2, 0.0, 25.0, 'N/A', 'N/A', 0.0, 'None', 100.0),
    ('DRUG-018', 'Clopidogrel', '{"Plavix"}', 'Thienopyridine', 'Antiplatelet', 'PO', 6.0, 0.0, 0.0, 50.0, 'N/A', 'N/A', 98.0, 'CYP2C19', 50.0),
    ('DRUG-019', 'Levothyroxine', '{"Synthroid"}', 'Thyroid Hormone', 'Thyroid Replacement', 'PO/IV', 168.0, 0.0, 0.0, 80.0, 'N/A', 'N/A', 99.0, 'Hepatic', 20.0),
    ('DRUG-020', 'Omeprazole', '{"Prilosec"}', 'Proton Pump Inhibitor', 'Antiulcer', 'PO/IV', 1.0, 0.3, 0.0, 40.0, 'N/A', 'N/A', 95.0, 'CYP2C19/3A4', 77.0)
ON CONFLICT (id) DO NOTHING;

-- Update healthcare_domains table lesson counts from healthcare_domain_curriculum_stats if necessary.
-- Assuming table structures and relationships.
-- Example placeholder if healthcare_domains exists and needs update:
-- UPDATE healthcare_domains
-- SET lesson_count = (SELECT sum(lessons) FROM healthcare_domain_curriculum_stats WHERE domain = 'PHARMACY')
-- WHERE code = 'PHARMACY';
