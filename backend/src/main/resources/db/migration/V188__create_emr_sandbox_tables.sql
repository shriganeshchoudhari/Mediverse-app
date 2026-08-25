-- Create EMR Patient table
CREATE TABLE emr_patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mrn VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(20) NOT NULL,
    blood_type VARCHAR(10),
    allergies TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create EMR Clinical Notes table
CREATE TABLE emr_clinical_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES emr_patients(id) ON DELETE CASCADE,
    author_id VARCHAR(100) NOT NULL,
    note_type VARCHAR(50) NOT NULL, -- e.g., 'PROGRESS_NOTE', 'H&P', 'DISCHARGE_SUMMARY'
    subjective TEXT,
    objective TEXT,
    assessment TEXT,
    plan TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create EMR Lab Results table
CREATE TABLE emr_lab_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES emr_patients(id) ON DELETE CASCADE,
    panel_name VARCHAR(100) NOT NULL, -- e.g., 'CBC', 'BMP'
    test_name VARCHAR(100) NOT NULL, -- e.g., 'Hemoglobin', 'Sodium'
    value VARCHAR(50) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    reference_range VARCHAR(50),
    flag VARCHAR(10), -- e.g., 'HIGH', 'LOW', 'CRITICAL'
    result_time TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed Initial EMR Patient for Sandbox
INSERT INTO emr_patients (id, mrn, first_name, last_name, date_of_birth, gender, blood_type, allergies)
VALUES (
    '50000000-0000-0000-0000-000000000001',
    'MRN-102938',
    'John',
    'Doe',
    '1979-05-14',
    'Male',
    'O+',
    'Penicillin (Hives)'
);

-- Seed Initial Lab Result
INSERT INTO emr_lab_results (patient_id, panel_name, test_name, value, unit, reference_range, flag, result_time)
VALUES 
('50000000-0000-0000-0000-000000000001', 'CBC', 'WBC', '15.2', 'x10^3/uL', '4.5-11.0', 'HIGH', CURRENT_TIMESTAMP - INTERVAL '2 hours'),
('50000000-0000-0000-0000-000000000001', 'BMP', 'Sodium', '138', 'mEq/L', '135-145', NULL, CURRENT_TIMESTAMP - INTERVAL '2 hours');

