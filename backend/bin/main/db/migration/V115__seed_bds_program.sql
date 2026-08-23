-- =============================================================================
-- Migration: V115__seed_bds_program.sql
-- Description: Seeds the BDS (Bachelor of Dental Surgery) program under the
--              Dental domain. Creates BDS program row, BDS curriculum, and
--              seeds all 10 semesters across 5 academic years.
-- Regulatory Body: Dental Council of India (DCI)
-- =============================================================================

-- 1. Seed BDS Program
INSERT INTO programs (id, code, name, description, duration_years, is_active, created_at)
VALUES (
    '10000000-0000-0000-0000-000000000001',
    'BDS',
    'Bachelor of Dental Surgery',
    'DCI-recognized 5-year undergraduate dental surgery program covering basic dental sciences, applied oral biology, and advanced clinical dentistry with compulsory 1-year rotatory internship.',
    5,
    TRUE,
    NOW()
) ON CONFLICT (code) DO NOTHING;

-- 2. Seed BDS Curriculum
INSERT INTO curricula (id, code, name, description, program_id, created_at)
VALUES (
    '20000000-0000-0000-0000-000000000001',
    'bds-dci-2024',
    'BDS DCI 2024 Curriculum',
    'Complete Dental Council of India (DCI) competency-based curriculum for Bachelor of Dental Surgery.',
    '10000000-0000-0000-0000-000000000001',
    NOW()
) ON CONFLICT (code) DO NOTHING;

-- 3. Seed BDS Curriculum Years (1-5)
INSERT INTO curriculum_years (id, curriculum_id, year_number) VALUES
    ('20000000-0000-0000-0001-000000000001', '20000000-0000-0000-0000-000000000001', 1),
    ('20000000-0000-0000-0001-000000000002', '20000000-0000-0000-0000-000000000001', 2),
    ('20000000-0000-0000-0001-000000000003', '20000000-0000-0000-0000-000000000001', 3),
    ('20000000-0000-0000-0001-000000000004', '20000000-0000-0000-0000-000000000001', 4),
    ('20000000-0000-0000-0001-000000000005', '20000000-0000-0000-0000-000000000001', 5)
ON CONFLICT (curriculum_id, year_number) DO NOTHING;

-- 4. Seed BDS Semesters (10 semesters across 5 years)
-- Year 1: Semesters 1-2
INSERT INTO semesters (id, year_id, semester_number) VALUES
    ('20000000-0000-0000-0002-000000000001', '20000000-0000-0000-0001-000000000001', 1),
    ('20000000-0000-0000-0002-000000000002', '20000000-0000-0000-0001-000000000001', 2)
ON CONFLICT (year_id, semester_number) DO NOTHING;

-- Year 2: Semesters 3-4
INSERT INTO semesters (id, year_id, semester_number) VALUES
    ('20000000-0000-0000-0002-000000000003', '20000000-0000-0000-0001-000000000002', 3),
    ('20000000-0000-0000-0002-000000000004', '20000000-0000-0000-0001-000000000002', 4)
ON CONFLICT (year_id, semester_number) DO NOTHING;

-- Year 3: Semesters 5-6
INSERT INTO semesters (id, year_id, semester_number) VALUES
    ('20000000-0000-0000-0002-000000000005', '20000000-0000-0000-0001-000000000003', 5),
    ('20000000-0000-0000-0002-000000000006', '20000000-0000-0000-0001-000000000003', 6)
ON CONFLICT (year_id, semester_number) DO NOTHING;

-- Year 4: Semesters 7-8
INSERT INTO semesters (id, year_id, semester_number) VALUES
    ('20000000-0000-0000-0002-000000000007', '20000000-0000-0000-0001-000000000004', 7),
    ('20000000-0000-0000-0002-000000000008', '20000000-0000-0000-0001-000000000004', 8)
ON CONFLICT (year_id, semester_number) DO NOTHING;

-- Year 5: Semesters 9-10
INSERT INTO semesters (id, year_id, semester_number) VALUES
    ('20000000-0000-0000-0002-000000000009', '20000000-0000-0000-0001-000000000005', 9),
    ('20000000-0000-0000-0002-000000000010', '20000000-0000-0000-0001-000000000005', 10)
ON CONFLICT (year_id, semester_number) DO NOTHING;

-- 5. Update healthcare_domain column on BDS program (V114 added this column to programs)
UPDATE programs SET healthcare_domain = 'DENTAL', domain_tier = 1 WHERE code = 'BDS';
