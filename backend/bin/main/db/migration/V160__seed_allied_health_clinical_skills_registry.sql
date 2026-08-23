-- V160__seed_allied_health_clinical_skills_registry.sql

CREATE TABLE IF NOT EXISTS allied_health_clinical_skills_registry (
  id VARCHAR(50) PRIMARY KEY,
  skill_name VARCHAR(150) NOT NULL,
  specialty VARCHAR(50) NOT NULL,
  target_equipment VARCHAR(150) NOT NULL,
  indication TEXT NOT NULL,
  step_by_step_protocol TEXT NOT NULL,
  critical_safety_traps TEXT NOT NULL,
  competency_level VARCHAR(30) NOT NULL
);

INSERT INTO allied_health_clinical_skills_registry (id, skill_name, specialty, target_equipment, indication, step_by_step_protocol, critical_safety_traps, competency_level) VALUES
('SKILL-PERF-01', 'CPB Priming', 'PERFUSION', 'Heart-Lung Machine', 'Pre-bypass preparation', '1. Assemble circuit. 2. CO2 flush. 3. Add crystalloid. 4. Circulate and de-air.', 'Massive air embolism if not de-aired properly.', 'PERFORMS'),
('SKILL-PERF-02', 'ECMO Sweep Gas Titration', 'PERFUSION', 'ECMO Console', 'PCO2 adjustment', '1. Check ABG. 2. Adjust sweep gas flowmeter. 3. Recheck ABG in 30 mins.', 'Accidental disconnection of gas line causing hypoxia.', 'PERFORMS'),
('SKILL-PERF-03', 'IABP Timing', 'PERFUSION', 'IABP Console', 'Cardiac assist optimization', '1. Freeze waveform. 2. Identify dicrotic notch. 3. Adjust inflation point.', 'Early inflation causing premature aortic valve closure.', 'SHOWS_HOW'),
('SKILL-PERF-04', 'Heater-Cooler Operation', 'PERFUSION', 'HCU', 'Patient temp management', '1. Connect lines. 2. Set target temp. 3. Monitor gradients.', 'Micro-bubbles from cracked heat exchanger.', 'PERFORMS'),

('SKILL-RAD-01', 'CT HU Windowing', 'RADIOLOGY', 'CT Workstation', 'Image optimization', '1. Load image. 2. Select tissue preset. 3. Adjust WW and WL manually if needed.', 'Missed pathology due to incorrect windowing.', 'PERFORMS'),
('SKILL-RAD-02', 'MRI Safety Screening', 'RADIOLOGY', 'MRI Suite', 'Pre-scan checklist', '1. Review questionnaire. 2. Ask about implants. 3. Check with metal detector.', 'Projectile effect of ferromagnetic objects.', 'PERFORMS'),
('SKILL-RAD-03', 'US Probe Selection', 'RADIOLOGY', 'Ultrasound Machine', 'Target tissue imaging', '1. Assess target depth. 2. Select linear (superficial) or curvilinear (deep).', 'Poor resolution due to wrong frequency.', 'PERFORMS'),
('SKILL-RAD-04', 'C-Arm Positioning', 'RADIOLOGY', 'Fluoroscopy C-Arm', 'Intra-op imaging', '1. Cover with sterile drape. 2. Position over patient. 3. Lock brakes.', 'Breaching sterile field.', 'PERFORMS'),

('SKILL-OTT-01', 'Anesthesia Circuit Leak Check', 'OTT', 'Anesthesia Workstation', 'Pre-use machine check', '1. Close APL valve. 2. Occlude Y-piece. 3. Press O2 flush to 30 cmH2O. 4. Observe for pressure drop.', 'Failure to identify leak leading to intra-op hypoxia.', 'PERFORMS'),
('SKILL-OTT-02', 'Surgical Scrubbing & Gowning', 'OTT', 'Scrub Sink', 'Aseptic prep', '1. Scrub fingers to elbows (5 mins). 2. Dry with sterile towel. 3. Don gown. 4. Closed gloving.', 'Contaminating hands on unsterile surfaces.', 'PERFORMS'),
('SKILL-OTT-03', 'Diathermy Pad Placement', 'OTT', 'Electrocautery Generator', 'Patient grounding', '1. Check skin integrity. 2. Place on well-perfused muscle mass close to site.', 'Burns due to poor pad contact or placed over bone.', 'PERFORMS'),
('SKILL-OTT-04', 'Vaporizer Filling', 'OTT', 'Anesthesia Vaporizer', 'Refilling agent', '1. Check agent specific bottle. 2. Connect adapter. 3. Fill to line. 4. Close firmly.', 'Mixing agents or spilling leading to OR pollution.', 'PERFORMS'),

('SKILL-DIAL-01', 'Hemodialyzer Setup', 'DIALYSIS', 'HD Machine', 'Pre-dialysis prep', '1. Attach dialyzer. 2. Connect blood lines. 3. Prime with saline. 4. Test alarms.', 'Air in venous line returning to patient.', 'PERFORMS'),
('SKILL-DIAL-02', 'AV Fistula Cannulation', 'DIALYSIS', 'Needles & Supplies', 'Vascular access', '1. Assess bruit/thrill. 2. Clean site. 3. Insert arterial needle. 4. Insert venous needle.', 'Infiltration or pseudoaneurysm formation.', 'PERFORMS'),
('SKILL-DIAL-03', 'CRRT Bag Change', 'DIALYSIS', 'CRRT Machine', 'Fluid management', '1. Silence alarm. 2. Clamp lines. 3. Swap bags. 4. Scan barcode. 5. Resume.', 'Wrong fluid type connected (dialysate vs replacement).', 'PERFORMS')
ON CONFLICT (id) DO NOTHING;
