-- V159__seed_ncahp_competency_mapping.sql

CREATE TABLE IF NOT EXISTS ncahp_competency_mapping (
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

INSERT INTO ncahp_competency_mapping (code, subject_code, domain, title, competency_level) VALUES
('PERF-C01', 'PERF-CPB', 'Clinical Perfusion', 'Assemble and prime CPB circuit', 'PERF'),
('PERF-C02', 'PERF-CPB', 'Clinical Perfusion', 'Identify oxygenator components', 'KNOWS'),
('PERF-C03', 'PERF-CPB', 'Clinical Perfusion', 'Calculate prime volume and hemodilution', 'KNOWS_HOW'),
('PERF-C04', 'PERF-CPB', 'Clinical Perfusion', 'Demonstrate safe air removal', 'SHOWS_HOW'),
('PERF-C05', 'PERF-ECMO', 'Clinical Perfusion', 'Manage ECMO sweep gas parameters', 'PERF'),
('PERF-C06', 'PERF-ECMO', 'Clinical Perfusion', 'Setup and monitor IABP counterpulsation', 'PERF'),
('PERF-C07', 'PERF-ECMO', 'Clinical Perfusion', 'Interpret ACT and titrate heparin', 'PERF'),
('PERF-C08', 'PERF-ECMO', 'Clinical Perfusion', 'Troubleshoot VAD flow alarms', 'SHOWS_HOW'),

('RAD-C01', 'RADIO-PHYS', 'Radiology', 'Explain thermionic emission', 'KNOWS'),
('RAD-C02', 'RADIO-PHYS', 'Radiology', 'Apply ALARA principles', 'PERF'),
('RAD-C03', 'RADIO-PHYS', 'Radiology', 'Adjust CT Window and Level', 'PERF'),
('RAD-C04', 'RADIO-PHYS', 'Radiology', 'Operate C-arm fluoroscopy safely', 'SHOWS_HOW'),
('RAD-C05', 'RADIO-MRI', 'Radiology', 'Screen patients for MRI safety', 'PERF'),
('RAD-C06', 'RADIO-MRI', 'Radiology', 'Explain T1 and T2 relaxation', 'KNOWS'),
('RAD-C07', 'RADIO-MRI', 'Radiology', 'Select appropriate ultrasound transducer', 'PERF'),
('RAD-C08', 'RADIO-MRI', 'Radiology', 'Identify spectral Doppler waveforms', 'KNOWS_HOW'),

('OTT-C01', 'OTT-ANAES', 'Operation Theatre Tech', 'Perform anesthesia machine leak check', 'PERF'),
('OTT-C02', 'OTT-ANAES', 'Operation Theatre Tech', 'Fill and calibrate vaporizers', 'SHOWS_HOW'),
('OTT-C03', 'OTT-ANAES', 'Operation Theatre Tech', 'Attach and monitor ETCO2', 'PERF'),
('OTT-C04', 'OTT-ANAES', 'Operation Theatre Tech', 'Place diathermy grounding pad safely', 'PERF'),
('OTT-C05', 'OTT-ANAES', 'Operation Theatre Tech', 'Scrub, gown, and glove for surgery', 'PERF'),
('OTT-C06', 'OTT-ANAES', 'Operation Theatre Tech', 'Prepare sterile instrument trolley', 'PERF'),
('OTT-C07', 'OTT-ANAES', 'Operation Theatre Tech', 'Maintain sterile field integrity', 'PERF'),
('OTT-C08', 'OTT-ANAES', 'Operation Theatre Tech', 'Manage biomedical waste disposal', 'PERF'),

('DIAL-C01', 'DIAL-HEMO', 'Dialysis Tech', 'Calculate Kt/V and URR', 'KNOWS_HOW'),
('DIAL-C02', 'DIAL-HEMO', 'Dialysis Tech', 'Prime and setup hemodialysis machine', 'PERF'),
('DIAL-C03', 'DIAL-HEMO', 'Dialysis Tech', 'Perform AV fistula cannulation', 'PERF'),
('DIAL-C04', 'DIAL-HEMO', 'Dialysis Tech', 'Respond to hypotension during dialysis', 'SHOWS_HOW'),
('DIAL-C05', 'DIAL-HEMO', 'Dialysis Tech', 'Setup CRRT CVVHDF modality', 'PERF'),
('DIAL-C06', 'DIAL-HEMO', 'Dialysis Tech', 'Perform CAPD bag exchange', 'PERF'),
('DIAL-C07', 'DIAL-HEMO', 'Dialysis Tech', 'Monitor RO plant parameters', 'PERF'),
('DIAL-C08', 'DIAL-HEMO', 'Dialysis Tech', 'Test for chlorine/chloramine in water', 'PERF')
ON CONFLICT (code) DO NOTHING;
