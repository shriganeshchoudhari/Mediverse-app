-- V155__seed_allied_health_programs.sql

INSERT INTO programs (id, code, name, description, duration_years, is_active, created_at, healthcare_domain, domain_tier)
VALUES
('10000000-0000-0000-0000-000000000009', 'BSCPERF', 'B.Sc Cardiovascular Perfusion Technology', 'NCAHP/AACP-recognized 3-year high-tech paramedical program covering CPB, ECMO, IABP, and VAD management.', 3, TRUE, CURRENT_TIMESTAMP, 'ALLIED', 2),
('10000000-0000-0000-0000-000000000010', 'BSCRIT', 'B.Sc Radiology & Imaging Technology', 'NCAHP/AERB-recognized 3-year diagnostic imaging program covering X-Ray, CT, MRI, Ultrasound, and Nuclear Medicine.', 3, TRUE, CURRENT_TIMESTAMP, 'ALLIED', 2),
('10000000-0000-0000-0000-000000000011', 'BSCOTT', 'B.Sc Operation Theatre & Anaesthesia Technology', 'NCAHP-recognized 3-year surgical workstation, sterile processing, and anesthesia tech program.', 3, TRUE, CURRENT_TIMESTAMP, 'ALLIED', 2),
('10000000-0000-0000-0000-000000000012', 'BSCDIAL', 'B.Sc Renal Dialysis Technology', 'NCAHP-recognized 3-year renal replacement therapy, hemodialysis, and CRRT technology program.', 3, TRUE, CURRENT_TIMESTAMP, 'ALLIED', 2)
ON CONFLICT (code) DO NOTHING;

INSERT INTO curricula (id, code, name, description, program_id, created_at)
VALUES
('20000000-0000-0000-0000-000000000006', 'allied-ncahp-2024', 'Allied Health NCAHP 2024 Curriculum', 'National Commission for Allied and Healthcare Professions (NCAHP) unified curriculum.', '10000000-0000-0000-0000-000000000009', CURRENT_TIMESTAMP)
ON CONFLICT (code) DO NOTHING;

INSERT INTO curriculum_years (id, curriculum_id, year_number)
VALUES
('20000000-0000-0000-0001-000000000051', '20000000-0000-0000-0000-000000000006', 1),
('20000000-0000-0000-0001-000000000052', '20000000-0000-0000-0000-000000000006', 2),
('20000000-0000-0000-0001-000000000053', '20000000-0000-0000-0000-000000000006', 3)
ON CONFLICT (curriculum_id, year_number) DO NOTHING;

INSERT INTO semesters (id, year_id, semester_number)
VALUES
('20000000-0000-0000-0002-000000000061', '20000000-0000-0000-0001-000000000051', 1),
('20000000-0000-0000-0002-000000000062', '20000000-0000-0000-0001-000000000051', 2),
('20000000-0000-0000-0002-000000000063', '20000000-0000-0000-0001-000000000052', 3),
('20000000-0000-0000-0002-000000000064', '20000000-0000-0000-0001-000000000052', 4),
('20000000-0000-0000-0002-000000000065', '20000000-0000-0000-0001-000000000053', 5),
('20000000-0000-0000-0002-000000000066', '20000000-0000-0000-0001-000000000053', 6)
ON CONFLICT (year_id, semester_number) DO NOTHING;

UPDATE programs SET healthcare_domain = 'ALLIED', domain_tier = 2 WHERE code IN ('BSCPERF', 'BSCRIT', 'BSCOTT', 'BSCDIAL');
