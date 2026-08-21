-- V147__seed_physiotherapy_programs.sql
INSERT INTO programs (id, code, name, description, duration_years, is_active, created_at, healthcare_domain, domain_tier)
VALUES
('10000000-0000-0000-0000-000000000007', 'BPT', 'Bachelor of Physiotherapy', 'IAP-recognized 4.5-year undergraduate physical therapy program covering anatomy, biomechanics, exercise therapy, electrotherapy, orthopedics, neurorehab, cardiopulmonary, and sports PT with 6-month internship.', 4, TRUE, CURRENT_TIMESTAMP, 'PHYSIOTHERAPY', 2),
('10000000-0000-0000-0000-000000000008', 'MPT', 'Master of Physiotherapy', 'IAP-recognized 2-year postgraduate specialization in Musculoskeletal / Orthopedics, Neurology, Sports, Cardiopulmonary, and Pediatric Physiotherapy.', 2, TRUE, CURRENT_TIMESTAMP, 'PHYSIOTHERAPY', 2)
ON CONFLICT(code) DO UPDATE SET
name = EXCLUDED.name, description = EXCLUDED.description, duration_years = EXCLUDED.duration_years, is_active = EXCLUDED.is_active, healthcare_domain = EXCLUDED.healthcare_domain, domain_tier = EXCLUDED.domain_tier;

INSERT INTO curricula (id, code, name, description, program_id, created_at)
VALUES
('20000000-0000-0000-0000-000000000005', 'bpt-iap-2024', 'BPT IAP 2024 Curriculum', 'Indian Association of Physiotherapists (IAP) competency-based curriculum.', '10000000-0000-0000-0000-000000000007', CURRENT_TIMESTAMP)
ON CONFLICT(code) DO NOTHING;

INSERT INTO curriculum_years (id, curriculum_id, year_number) VALUES
('20000000-0000-0000-0001-000000000041', '20000000-0000-0000-0000-000000000005', 1),
('20000000-0000-0000-0001-000000000042', '20000000-0000-0000-0000-000000000005', 2),
('20000000-0000-0000-0001-000000000043', '20000000-0000-0000-0000-000000000005', 3),
('20000000-0000-0000-0001-000000000044', '20000000-0000-0000-0000-000000000005', 4)
ON CONFLICT(curriculum_id, year_number) DO NOTHING;

INSERT INTO semesters (id, year_id, semester_number) VALUES
('20000000-0000-0000-0002-000000000051', '20000000-0000-0000-0001-000000000041', 1),
('20000000-0000-0000-0002-000000000052', '20000000-0000-0000-0001-000000000041', 2),
('20000000-0000-0000-0002-000000000053', '20000000-0000-0000-0001-000000000042', 3),
('20000000-0000-0000-0002-000000000054', '20000000-0000-0000-0001-000000000042', 4),
('20000000-0000-0000-0002-000000000055', '20000000-0000-0000-0001-000000000043', 5),
('20000000-0000-0000-0002-000000000056', '20000000-0000-0000-0001-000000000043', 6),
('20000000-0000-0000-0002-000000000057', '20000000-0000-0000-0001-000000000044', 7),
('20000000-0000-0000-0002-000000000058', '20000000-0000-0000-0001-000000000044', 8)
ON CONFLICT(year_id, semester_number) DO NOTHING;

UPDATE programs SET healthcare_domain = 'PHYSIOTHERAPY', domain_tier = 2 WHERE code IN ('BPT', 'MPT');
