-- V145__seed_nursing_clinical_skills_registry.sql

CREATE TABLE IF NOT EXISTS nursing_clinical_skills_registry (
  id VARCHAR(50) PRIMARY KEY,
  skill_name VARCHAR(150) NOT NULL,
  category VARCHAR(100) NOT NULL,
  target_patient_group VARCHAR(100) NOT NULL,
  equipment_needed TEXT[] NOT NULL,
  critical_safety_steps TEXT[] NOT NULL,
  common_errors TEXT[] NOT NULL,
  difficulty_level VARCHAR(30) NOT NULL
);

INSERT INTO nursing_clinical_skills_registry (id, skill_name, category, target_patient_group, equipment_needed, critical_safety_steps, common_errors, difficulty_level) VALUES
('SKILL-NURS-001', 'IV Cannulation', 'Procedures', 'Adult/Pediatric', ARRAY['IV Cannula', 'Tourniquet', 'Alcohol swabs', 'Tegaderm'], ARRAY['Check patient ID', 'Aseptic technique', 'Flush to confirm patency'], ARRAY['Going through the vein', 'Contaminating site'], 'INTERMEDIATE'),
('SKILL-NURS-002', 'Central Line Dressing', 'Procedures', 'Adult/Pediatric', ARRAY['Central line dressing kit', 'Chlorhexidine', 'Sterile gloves'], ARRAY['Strict aseptic technique', 'Patient turns head away'], ARRAY['Breach of sterility', 'Air embolism risk'], 'ADVANCED'),
('SKILL-NURS-003', 'Foley Catheterization', 'Procedures', 'Adult/Pediatric', ARRAY['Foley catheter', 'Sterile gloves', 'Lubricant', 'Sterile water'], ARRAY['Maintain sterility', 'Verify placement before balloon inflation'], ARRAY['Urethral trauma', 'Contamination'], 'INTERMEDIATE'),
('SKILL-NURS-004', 'Tracheostomy Suctioning', 'Airway Management', 'Adult/Pediatric', ARRAY['Suction catheter', 'Sterile gloves', 'Suction machine', 'Normal saline'], ARRAY['Pre-oxygenate', 'Limit suction time to 10 seconds'], ARRAY['Hypoxia', 'Mucosal trauma'], 'ADVANCED'),
('SKILL-NURS-005', 'Endotracheal Suctioning', 'Airway Management', 'Intubated Patients', ARRAY['In-line suction setup', 'Sterile gloves'], ARRAY['Maintain sterility', 'Monitor SpO2'], ARRAY['Vagal stimulation', 'Hypoxia'], 'ADVANCED'),
('SKILL-NURS-006', 'ABG Sampling', 'Diagnostics', 'Adult', ARRAY['Heparinized syringe', 'Alcohol swabs', 'Ice pack'], ARRAY['Allen test', 'Apply pressure post-procedure for 5 mins'], ARRAY['Arterial spasm', 'Hematoma'], 'ADVANCED'),
('SKILL-NURS-007', 'Blood Transfusion', 'Therapeutics', 'All', ARRAY['Blood products', 'Blood tubing', 'Normal Saline'], ARRAY['Two-nurse verification', 'Monitor vital signs for first 15 mins'], ARRAY['Mismatch error', 'Fluid overload'], 'INTERMEDIATE'),
('SKILL-NURS-008', 'NG Tube Insertion', 'Procedures', 'All', ARRAY['NG tube', 'Lubricant', 'Syringe', 'Stethoscope', 'pH paper'], ARRAY['Verify placement by x-ray or pH', 'Measure length accurately'], ARRAY['Tracheal intubation', 'Coiling in mouth'], 'INTERMEDIATE'),
('SKILL-NURS-009', 'CPR & BLS', 'Emergency', 'All', ARRAY['BVM device', 'AED', 'Backboard'], ARRAY['Early compressions', 'Ensure scene safety'], ARRAY['Inadequate depth', 'Interruptions'], 'BASIC'),
('SKILL-NURS-010', 'Wound Debridement & Dressing', 'Wound Care', 'All', ARRAY['Dressing kit', 'Scalpel/Scissors', 'Saline', 'Appropriate dressing'], ARRAY['Assess wound bed', 'Sterile technique'], ARRAY['Damaging healthy tissue', 'Wrong dressing choice'], 'INTERMEDIATE'),
('SKILL-NURS-011', 'Oxygen Administration & BiPAP', 'Respiratory', 'All', ARRAY['O2 source', 'Mask/Nasal cannula', 'BiPAP machine'], ARRAY['Check flow rate', 'Ensure tight seal for BiPAP'], ARRAY['Wrong O2 flow', 'Skin breakdown from mask'], 'BASIC'),
('SKILL-NURS-012', 'Chest Tube Care', 'Procedures', 'All', ARRAY['Sterile water', 'Clamps', 'Vaseline gauze'], ARRAY['Keep system below chest level', 'Never clamp without order'], ARRAY['Accidental dislodgement', 'Tension pneumothorax'], 'ADVANCED'),
('SKILL-NURS-013', 'Lumbar Puncture Assist', 'Procedures', 'All', ARRAY['LP kit', 'Sterile gloves', 'Local anesthetic'], ARRAY['Proper patient positioning', 'Monitor for neurological changes'], ARRAY['Contamination of field', 'Patient movement'], 'INTERMEDIATE'),
('SKILL-NURS-014', 'Waterlow/Braden Assessment', 'Assessment', 'All', ARRAY['Assessment tool'], ARRAY['Accurate scoring', 'Implement prevention strategies based on score'], ARRAY['Underestimating risk', 'Delayed intervention'], 'BASIC'),
('SKILL-NURS-015', 'SBAR Handover', 'Communication', 'All', ARRAY['Patient chart', 'Handover sheet'], ARRAY['Clear identification', 'Include critical labs and events'], ARRAY['Omission of key facts', 'Rushed delivery'], 'BASIC')
ON CONFLICT (id) DO NOTHING;
