-- V171__seed_public_health_programs.sql
-- Description: Seed Public Health & Healthcare Administration programs (MPH, MHA)

INSERT INTO programs (id, code, name, description, duration_years, is_active, created_at)
VALUES 
('10000000-0000-0000-0000-000000000015', 'MPH', 'Master of Public Health', 'UGC/NMC-recognized 2-year postgraduate program covering epidemiology, biostatistics, health systems, and global health.', 2, TRUE, CURRENT_TIMESTAMP),
('10000000-0000-0000-0000-000000000016', 'MHA', 'Master of Hospital Administration', 'UGC/NABH-recognized 2-year postgraduate program covering hospital operations, quality, supply chain, and health economics.', 2, TRUE, CURRENT_TIMESTAMP)
ON CONFLICT (code) DO UPDATE SET 
    name = EXCLUDED.name,
    description = EXCLUDED.description;

INSERT INTO curricula (id, code, name, description, program_id, created_at)
VALUES 
('20000000-0000-0000-0000-000000000008', 'public-health-2024', 'Public Health & Hospital Admin 2024 Curriculum', 'Comprehensive curriculum for MPH and MHA postgraduate degrees.', '10000000-0000-0000-0000-000000000015', CURRENT_TIMESTAMP)
ON CONFLICT (code) DO NOTHING;

INSERT INTO curriculum_years (id, curriculum_id, year_number)
VALUES 
('20000000-0000-0000-0001-000000000071', '20000000-0000-0000-0000-000000000008', 1),
('20000000-0000-0000-0001-000000000072', '20000000-0000-0000-0000-000000000008', 2)
ON CONFLICT (curriculum_id, year_number) DO NOTHING;

INSERT INTO semesters (id, year_id, semester_number)
VALUES 
('20000000-0000-0000-0002-000000000081', '20000000-0000-0000-0001-000000000071', 1),
('20000000-0000-0000-0002-000000000082', '20000000-0000-0000-0001-000000000071', 2),
('20000000-0000-0000-0002-000000000083', '20000000-0000-0000-0001-000000000072', 3),
('20000000-0000-0000-0002-000000000084', '20000000-0000-0000-0001-000000000072', 4)
ON CONFLICT (year_id, semester_number) DO NOTHING;

UPDATE programs 
SET healthcare_domain = 'PUBLIC_HEALTH', domain_tier = 3 
WHERE code IN ('MPH', 'MHA');
