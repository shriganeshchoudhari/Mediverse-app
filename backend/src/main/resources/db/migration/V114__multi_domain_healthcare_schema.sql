-- =============================================================================
-- Migration: V114__multi_domain_healthcare_schema.sql
-- Description: Adds healthcare_domain and domain_tier columns to programs table,
--              establishes domain classifications across all medical disciplines.
-- =============================================================================

-- Add healthcare_domain and domain_tier to programs if not already present
ALTER TABLE programs ADD COLUMN IF NOT EXISTS healthcare_domain VARCHAR(50) DEFAULT 'ALLOPATHIC';
ALTER TABLE programs ADD COLUMN IF NOT EXISTS domain_tier INTEGER DEFAULT 1;

-- Create index on healthcare_domain for fast lookup
CREATE INDEX IF NOT EXISTS idx_programs_healthcare_domain ON programs(healthcare_domain);
CREATE INDEX IF NOT EXISTS idx_programs_domain_tier ON programs(domain_tier);

-- Create table for healthcare domain registry
CREATE TABLE IF NOT EXISTS healthcare_domains (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    short_name VARCHAR(50) NOT NULL,
    icon VARCHAR(10) NOT NULL,
    color VARCHAR(20) NOT NULL,
    accent_color VARCHAR(20) NOT NULL,
    description TEXT NOT NULL,
    tier INTEGER NOT NULL CHECK (tier IN (1, 2, 3)),
    route_path VARCHAR(100) NOT NULL,
    lesson_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert domain definitions
INSERT INTO healthcare_domains (id, name, short_name, icon, color, accent_color, description, tier, route_path, lesson_count)
VALUES
    ('allopathic', 'Allopathic Medicine & Super-Specialties', 'Allopathic', '🩺', '#3B82F6', '#1D4ED8', 'MBBS, MD, MS, DM, MCh — evidence-based medicine across 19 core disciplines and 12 PG residency tracks.', 1, '/healthcare/allopathic', 620),
    ('dental', 'Dental Sciences', 'Dental', '🦷', '#10B981', '#059669', 'BDS, MDS — Oral anatomy, maxillofacial surgery, orthodontics, periodontics with 3D tooth morphology.', 1, '/healthcare/dental', 80),
    ('ayush', 'AYUSH Traditional & Integrative Systems', 'AYUSH', '🌿', '#F59E0B', '#D97706', 'BAMS, BHMS, BUMS, BNYS — Ayurveda, Homeopathy with 3D 107 Marma Point map and Tridosha-ANS correlation.', 1, '/healthcare/ayush', 90),
    ('pharmacy', 'Pharmacy & Clinical Pharmacotherapy', 'Pharmacy', '💊', '#8B5CF6', '#7C3AED', 'Pharm.D, B.Pharm, M.Pharm — Clinical pharmacokinetics, therapeutic drug monitoring, and pharmacovigilance.', 1, '/healthcare/pharmacy', 60),
    ('nursing', 'Nursing & Advanced Practice Nursing', 'Nursing', '🏥', '#EC4899', '#DB2777', 'B.Sc Nursing, M.Sc Nursing — ICU critical care protocols, OSCE nursing stations, and wound care.', 2, '/healthcare/nursing', 50),
    ('physiotherapy', 'Physiotherapy & Rehabilitation Sciences', 'Physiotherapy', '🦾', '#06B6D4', '#0891B2', 'BPT, MPT — 3D joint biomechanics, ROM measurement, gait analysis, and neurorehab protocols.', 2, '/healthcare/physiotherapy', 45),
    ('allied', 'Allied Health Sciences & High-Tech Clinical Technologies', 'Allied Health', '🔬', '#F97316', '#EA580C', 'B.Sc Perfusion, Radiology, OT Tech, Dialysis — ECMO/CPB circuits, CT/MRI 3D slice explorer.', 2, '/healthcare/allied', 40),
    ('veterinary', 'Veterinary & Comparative Medicine', 'Veterinary', '🐾', '#84CC16', '#65A30D', 'BVSc & AH, MVSc — Comparative anatomy, zoonotic diseases, and One Health epidemiology.', 3, '/healthcare/veterinary', 30),
    ('public-health', 'Public Health & Healthcare Administration', 'Public Health', '🌍', '#6366F1', '#4F46E5', 'MPH, MHA — Epidemiology, biostatistics, Ayushman Bharat policy, and hospital operations.', 3, '/healthcare/public-health', 35)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    short_name = EXCLUDED.short_name,
    icon = EXCLUDED.icon,
    color = EXCLUDED.color,
    accent_color = EXCLUDED.accent_color,
    description = EXCLUDED.description,
    tier = EXCLUDED.tier,
    route_path = EXCLUDED.route_path,
    lesson_count = EXCLUDED.lesson_count,
    updated_at = CURRENT_TIMESTAMP;
