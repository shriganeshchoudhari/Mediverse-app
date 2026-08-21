import os
import time

base_dir = r"F:\Mediverse-app\backend\src\main\resources\db\migration"
os.makedirs(base_dir, exist_ok=True)

# V115
v115 = """-- =============================================================================
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
"""
with open(os.path.join(base_dir, 'V115__seed_bds_program.sql'), 'w', encoding='utf-8') as f:
    f.write(v115)


def generate_curriculum(migration_num, year, file_desc, subjects, start_idx):
    sql = f'''-- =============================================================================
-- Migration: V{migration_num}__seed_bds_year{year}_curriculum.sql
-- Description: {file_desc}
-- =============================================================================
'''
    
    idx = start_idx
    for sub in subjects:
        sub_id = f'20000000-0000-0000-0003-{sub["sub_id_idx"]:012d}'
        sem_id = f'20000000-0000-0000-0002-{sub["sem_id_idx"]:012d}'
        
        sql += f"\n-- Subject: {sub['code']} ({sub['name']})\n"
        sql += f"INSERT INTO subjects (id, semester_id, code, name, description) VALUES ('{sub_id}', '{sem_id}', '{sub['code']}', '{sub['name']}', '') ON CONFLICT (code) DO NOTHING;\n\n"
        
        for ch in sub['chapters']:
            unit_id = f'20000000-0000-0000-0004-{idx:012d}'
            ch_id = f'20000000-0000-0000-0005-{idx:012d}'
            top_id = f'20000000-0000-0000-0006-{idx:012d}'
            con_id = f'20000000-0000-0000-0007-{idx:012d}'
            lo_id = f'20000000-0000-0000-0008-{idx:012d}'
            
            clean_ch = ch.replace("'", "''")
            sql += f"-- Chapter: {clean_ch}\n"
            sql += f"INSERT INTO units (id, subject_id, name) VALUES ('{unit_id}', '{sub_id}', '{clean_ch} Unit') ON CONFLICT DO NOTHING;\n"
            sql += f"INSERT INTO chapters (id, unit_id, name) VALUES ('{ch_id}', '{unit_id}', '{clean_ch}') ON CONFLICT DO NOTHING;\n"
            sql += f"INSERT INTO topics (id, chapter_id, name) VALUES ('{top_id}', '{ch_id}', '{clean_ch} Topic') ON CONFLICT DO NOTHING;\n"
            sql += f"INSERT INTO concepts (id, topic_id, name) VALUES ('{con_id}', '{top_id}', '{clean_ch} Concept') ON CONFLICT DO NOTHING;\n"
            sql += f"INSERT INTO learning_objects (id, concept_id, object_type, content_payload) VALUES ('{lo_id}', '{con_id}', 'TEXT', '{clean_ch} details') ON CONFLICT DO NOTHING;\n\n"
            
            idx += 1
            
    with open(os.path.join(base_dir, f'V{migration_num}__seed_bds_year{year}_curriculum.sql'), 'w', encoding='utf-8') as f:
        f.write(sql)
    return idx

# V116
idx = generate_curriculum(116, 1, 'Seeds Year 1 (Semesters 1-2) subjects/units/chapters/topics', [
    { 'code': 'BDS-GA', 'name': 'General Anatomy including Embryology & Histology', 'sub_id_idx': 1, 'sem_id_idx': 1,
      'chapters': ['Head & Neck Osteology', 'Muscles of Mastication', 'TMJ Structure & Biomechanics', 'Oral Histology (Enamel/Dentine/Cementum/Pulp)', 'Tooth Development (Odontogenesis & Amelogenesis)', 'Trigeminal Nerve branches & Dental Anesthesia Anatomy'] },
    { 'code': 'BDS-GP', 'name': 'General Human Physiology & Biochemistry', 'sub_id_idx': 2, 'sem_id_idx': 1,
      'chapters': ['Blood Coagulation Cascade & Haemostasis', 'Local Anaesthetic Pharmacodynamics (Na+ Channel Blockade)', 'Salivary Glands (Composition, Control & Xerostomia)'] },
    { 'code': 'BDS-DM', 'name': 'Dental Materials', 'sub_id_idx': 3, 'sem_id_idx': 2,
      'chapters': ['Composite Resins (Polymerization Shrinkage)', 'Dental Ceramics (Feldspathic/Zirconia/E-max)', 'Impression Materials (Elastomers & Dimensional Accuracy)', 'Dental Cements (Luting Agents & Bond Strength)'] }
], 1)

# V117
idx = generate_curriculum(117, 2, 'Seeds Year 2 (Semesters 3-4)', [
    { 'code': 'BDS-OP', 'name': 'Oral Pathology & Oral Microbiology', 'sub_id_idx': 4, 'sem_id_idx': 3,
      'chapters': ['Dental Caries (Keyes Tetrad & Stephan pH Curve)', 'Oral Cancer (Stages, Histology & Risk Factors)', 'Odontogenic Cysts & Tumours (Classification & Radiological Features)', 'Periodontal Pathogens (Biofilm & Host Immune Response)'] },
    { 'code': 'BDS-PE', 'name': 'Periodontology', 'sub_id_idx': 5, 'sem_id_idx': 4,
      'chapters': ['Periodontal Assessment (Probing Depths, BOP & Furcation Involvement)', 'Scaling & Root Planing (Instrumentation & Technique)', 'Osseous Surgery (Resective & Regenerative Approaches)'] }
], idx)

# V118
idx = generate_curriculum(118, 3, 'Seeds Year 3 (Semesters 5-6)', [
    { 'code': 'BDS-CD', 'name': 'Conservative Dentistry & Endodontics', 'sub_id_idx': 6, 'sem_id_idx': 5,
      'chapters': ['Root Canal Anatomy (Canal Configurations & Vertucci Classification)', 'Biomechanical Preparation (Working Length & Rotary Instrumentation)', 'Obturation (Cold Lateral Condensation & Warm Vertical Compaction)'] },
    { 'code': 'BDS-OS', 'name': 'Oral & Maxillofacial Surgery', 'sub_id_idx': 7, 'sem_id_idx': 6,
      'chapters': ['Local Anaesthesia (IAN Block, Buccal & Lingual Infiltration)', 'Impacted Third Molars (Classification & Surgical Protocol - Winter/Pell-Gregory)', 'Orthognathic Surgery (Le Fort Osteotomies & BSSO)'] }
], idx)

# V119
idx = generate_curriculum(119, 4, 'Seeds Year 4 (Semesters 7-8)', [
    { 'code': 'BDS-PR', 'name': 'Prosthodontics including Crown & Bridge', 'sub_id_idx': 8, 'sem_id_idx': 7,
      'chapters': ['Complete Dentures (Jaw Relations & Occlusal Vertical Dimension)', 'Dental Implants (Osseointegration, Planning & Surgical Protocol)', 'Fixed Prosthodontics (Crown Preparation & Marginal Design)'] },
    { 'code': 'BDS-OR', 'name': 'Orthodontics & Dentofacial Orthopaedics', 'sub_id_idx': 9, 'sem_id_idx': 8,
      'chapters': ['Angle Classification & Skeletal Malocclusion Assessment', 'Cephalometric Analysis (Landmarks, Planes & ANB Interpretation)', 'Fixed Appliance Mechanics (Bracket Systems & Arch Wire Sequences)'] }
], idx)

# V120
idx = generate_curriculum(120, 5, 'Seeds Year 5 (Semesters 9-10)', [
    { 'code': 'BDS-PD', 'name': 'Pedodontics & Preventive Dentistry', 'sub_id_idx': 10, 'sem_id_idx': 9,
      'chapters': ['Primary Dentition (Chronology of Eruption & Occlusion)', 'Pulp Therapy (Pulpotomy & Pulpectomy in Primary Teeth)', 'Fluoride Therapy (Systemic vs Topical & Optimal Dosing)'] },
    { 'code': 'BDS-OM', 'name': 'Oral Medicine & Radiology', 'sub_id_idx': 11, 'sem_id_idx': 10,
      'chapters': ['Periapical Radiography (Technique & Radiographic Interpretation)', 'CBCT in Dentistry (Applications & Radiation Dose Justification)', 'Oral Manifestations of Systemic Diseases (Diagnostic Protocol)'] }
], idx)

v121 = """-- =============================================================================
-- Migration: V121__seed_dci_competency_mapping.sql
-- Description: Creates the dci_competency_mapping table and seeds all 26 BDS
--              DCI competency codes with Miller's pyramid levels and integration links.
-- =============================================================================

CREATE TABLE IF NOT EXISTS dci_competency_mapping (
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

CREATE INDEX IF NOT EXISTS idx_dci_competency_subject ON dci_competency_mapping(subject_code);

INSERT INTO dci_competency_mapping (code, subject_code, domain, title, competency_level, vertical_integration, horizontal_integration) VALUES
-- General Anatomy (BDS-GA)
('GA1.1', 'BDS-GA', 'Head & Neck Osteology', 'Identify and describe skull bones, sutures, foramina, and cranial nerve exits on 3D model', 'SHOWS_HOW', ARRAY['BDS-OS', 'BDS-OM'], ARRAY['BDS-GP']),
('GA1.2', 'BDS-GA', 'Masticatory Muscles', 'Demonstrate origin, insertion, and action of muscles of mastication and their role in jaw biomechanics', 'SHOWS_HOW', ARRAY['BDS-OR', 'BDS-OS'], ARRAY['BDS-GP']),
('GA1.3', 'BDS-GA', 'Temporomandibular Joint', 'Analyze TMJ structure, disc position, and biomechanical movements relevant to TMD', 'KNOWS_HOW', ARRAY['BDS-OS', 'BDS-OR'], ARRAY[]::TEXT[]),
('GA2.1', 'BDS-GA', 'Oral Histology', 'Describe microscopic structure of enamel, dentine, cementum, and pulp with clinical implications', 'KNOWS_HOW', ARRAY['BDS-CD', 'BDS-OP'], ARRAY[]::TEXT[]),
('GA3.1', 'BDS-GA', 'Tooth Development', 'Explain odontogenesis stages (bud, cap, bell) and developmental anomalies', 'KNOWS', ARRAY['BDS-PD', 'BDS-OP'], ARRAY[]::TEXT[]),
('GA1.8', 'BDS-GA', 'Trigeminal Nerve', 'Map branches of trigeminal nerve (V1, V2, V3) and identify target points for dental anesthesia', 'SHOWS_HOW', ARRAY['BDS-OS', 'BDS-OM'], ARRAY['BDS-GP']),
-- General Physiology (BDS-GP)
('GP1.1', 'BDS-GP', 'Haemostasis', 'Explain coagulation cascade and predict bleeding risks in oral surgical patients on anticoagulants', 'KNOWS_HOW', ARRAY['BDS-OS'], ARRAY['BDS-GA']),
('GP2.1', 'BDS-GP', 'Local Anaesthetic Pharmacodynamics', 'Describe Na+ channel blockade mechanism of lidocaine/articaine and factors affecting block success', 'KNOWS_HOW', ARRAY['BDS-OS', 'BDS-PE'], ARRAY['BDS-GA']),
('GP3.1', 'BDS-GP', 'Salivary Gland Physiology', 'Describe composition and autonomic control of major salivary glands and manage xerostomia', 'KNOWS_HOW', ARRAY['BDS-OM', 'BDS-OP'], ARRAY[]::TEXT[]),
-- Dental Materials (BDS-DM)
('DM1.1', 'BDS-DM', 'Composite Resins', 'Select appropriate composite system and apply incremental technique to minimize polymerization shrinkage', 'PERFORMS', ARRAY['BDS-CD'], ARRAY[]::TEXT[]),
('DM2.1', 'BDS-DM', 'Dental Ceramics', 'Compare optical and mechanical properties of feldspathic, zirconia, and e.max ceramics for crown selection', 'KNOWS_HOW', ARRAY['BDS-PR'], ARRAY[]::TEXT[]),
('DM3.1', 'BDS-DM', 'Impression Materials', 'Select appropriate elastomeric impression material and technique for fixed/removable prosthodontic procedures', 'PERFORMS', ARRAY['BDS-PR'], ARRAY[]::TEXT[]),
('DM4.1', 'BDS-DM', 'Dental Cements', 'Select appropriate luting agent (GIC, RMGIC, resin cement) based on restoration type and bond strength requirements', 'PERFORMS', ARRAY['BDS-PR', 'BDS-CD'], ARRAY[]::TEXT[]),
-- Oral Pathology (BDS-OP)
('OP1.1', 'BDS-OP', 'Dental Caries', 'Explain Keyes tetrad pathogenesis and apply Stephan pH curve to caries prevention counseling', 'KNOWS_HOW', ARRAY['BDS-PD', 'BDS-CD'], ARRAY['BDS-GP']),
('OP2.1', 'BDS-OP', 'Oral Cancer', 'Stage oral squamous cell carcinoma (TNM) and counsel patients on tobacco/alcohol risk factors', 'SHOWS_HOW', ARRAY['BDS-OM', 'BDS-OS'], ARRAY[]::TEXT[]),
('OP3.1', 'BDS-OP', 'Odontogenic Cysts & Tumours', 'Apply WHO classification and interpret CBCT radiological features for odontogenic lesion diagnosis', 'KNOWS_HOW', ARRAY['BDS-OM', 'BDS-OS'], ARRAY[]::TEXT[]),
('OP4.1', 'BDS-OP', 'Periodontal Microbiology', 'Explain red complex bacteria role in bone loss and describe host immune response in periodontal disease', 'KNOWS_HOW', ARRAY['BDS-PE'], ARRAY['BDS-GP']),
-- Periodontology (BDS-PE)
('PE1.1', 'BDS-PE', 'Periodontal Assessment', 'Perform clinical periodontal charting including probing depths, BOP, furcation classification, and recession', 'PERFORMS', ARRAY['BDS-OS'], ARRAY[]::TEXT[]),
('PE2.1', 'BDS-PE', 'Scaling & Root Planing', 'Select appropriate Gracey curette and perform subgingival debridement with correct angulation', 'PERFORMS', ARRAY[]::TEXT[], ARRAY[]::TEXT[]),
('PE3.1', 'BDS-PE', 'Osseous Surgery', 'Design periodontal flap and classify bone defects for resective vs regenerative treatment decision', 'SHOWS_HOW', ARRAY['BDS-OS'], ARRAY[]::TEXT[]),
-- Conservative Dentistry (BDS-CD)
('CD1.1', 'BDS-CD', 'Root Canal Anatomy', 'Identify root canal configurations using Vertucci classification across all tooth types', 'KNOWS_HOW', ARRAY['BDS-OM'], ARRAY['BDS-GA']),
('CD2.1', 'BDS-CD', 'Biomechanical Preparation', 'Determine working length using EAL and perform NiTi rotary instrumentation following crown-down technique', 'PERFORMS', ARRAY[]::TEXT[], ARRAY[]::TEXT[]),
('CD3.1', 'BDS-CD', 'Obturation', 'Perform cold lateral condensation and warm vertical compaction with radiographic quality assessment', 'PERFORMS', ARRAY[]::TEXT[], ARRAY[]::TEXT[]),
-- Oral Surgery (BDS-OS)
('OS1.1', 'BDS-OS', 'Local Anaesthesia', 'Administer IAN block, buccal infiltration, and lingual infiltration using correct anatomical landmarks', 'PERFORMS', ARRAY[]::TEXT[], ARRAY['BDS-GA', 'BDS-GP']),
('OS2.1', 'BDS-OS', 'Impacted Third Molars', 'Classify impacted third molars (Winter/Pell-Gregory) and plan surgical extraction protocol', 'SHOWS_HOW', ARRAY[]::TEXT[], ARRAY['BDS-GA']),
-- Prosthodontics (BDS-PR)
('PR1.1', 'BDS-PR', 'Complete Dentures', 'Register jaw relations (centric relation, OVD) and mount casts on articulator for complete denture fabrication', 'PERFORMS', ARRAY[]::TEXT[], ARRAY[]::TEXT[]),
-- Orthodontics (BDS-OR)
('OR2.1', 'BDS-OR', 'Cephalometric Analysis', 'Trace lateral cephalogram, identify landmarks, and compute Steiner analysis (SNA, SNB, ANB, SN-GoGn)', 'SHOWS_HOW', ARRAY[]::TEXT[], ARRAY['BDS-GA'])
ON CONFLICT (code) DO UPDATE SET
    title = EXCLUDED.title,
    competency_level = EXCLUDED.competency_level;
"""
with open(os.path.join(base_dir, 'V121__seed_dci_competency_mapping.sql'), 'w', encoding='utf-8') as f:
    f.write(v121)

v122 = """-- =============================================================================
-- Migration: V122__link_healthcare_domain_to_programs.sql
-- Description: Fixes GAP-C3 — links healthcare_domains table to programs table
--              via FK bridge and creates domain curriculum statistics view.
-- =============================================================================

-- 1. Ensure programs table has healthcare_domain column (defensive, V114 adds it)
ALTER TABLE programs ADD COLUMN IF NOT EXISTS healthcare_domain VARCHAR(50) DEFAULT 'ALLOPATHIC';
ALTER TABLE programs ADD COLUMN IF NOT EXISTS domain_tier INTEGER DEFAULT 1;

-- 2. Update all known program domain mappings
UPDATE programs SET healthcare_domain = 'ALLOPATHIC', domain_tier = 1 WHERE code = 'MBBS';
UPDATE programs SET healthcare_domain = 'DENTAL', domain_tier = 1 WHERE code = 'BDS';
UPDATE programs SET healthcare_domain = 'DENTAL', domain_tier = 1 WHERE code = 'MDS';
UPDATE programs SET healthcare_domain = 'AYUSH', domain_tier = 1 WHERE code = 'BAMS';

-- 3. Create domain curriculum statistics view (bridges healthcare_domains → programs → subjects → learning_objects)
CREATE OR REPLACE VIEW healthcare_domain_curriculum_stats AS
SELECT
    hd.id                                   AS domain_id,
    hd.name                                 AS domain_name,
    hd.tier                                 AS domain_tier,
    COUNT(DISTINCT p.id)                    AS program_count,
    COUNT(DISTINCT c.id)                    AS curriculum_count,
    COUNT(DISTINCT s.id)                    AS subject_count,
    COUNT(DISTINCT ch.id)                   AS chapter_count,
    COUNT(DISTINCT lo.id)                   AS lesson_count
FROM healthcare_domains hd
LEFT JOIN programs p
    ON UPPER(p.healthcare_domain) = UPPER(hd.id)
    AND p.is_active = TRUE
LEFT JOIN curricula c ON c.program_id = p.id
LEFT JOIN curriculum_years cy ON cy.curriculum_id = c.id
LEFT JOIN semesters sem ON sem.year_id = cy.id
LEFT JOIN subjects sub ON sub.semester_id = sem.id
LEFT JOIN units u ON u.subject_id = sub.id
LEFT JOIN chapters ch ON ch.unit_id = u.id
LEFT JOIN topics t ON t.chapter_id = ch.id
LEFT JOIN concepts con ON con.topic_id = t.id
LEFT JOIN learning_objects lo ON lo.concept_id = con.id
GROUP BY hd.id, hd.name, hd.tier;

-- 4. Update lesson_count in healthcare_domains from the view
UPDATE healthcare_domains hd
SET lesson_count = (
    SELECT COALESCE(s.lesson_count, 0)
    FROM healthcare_domain_curriculum_stats s
    WHERE s.domain_id = hd.id
)
WHERE EXISTS (
    SELECT 1 FROM healthcare_domain_curriculum_stats s WHERE s.domain_id = hd.id
);
"""
with open(os.path.join(base_dir, 'V122__link_healthcare_domain_to_programs.sql'), 'w', encoding='utf-8') as f:
    f.write(v122)

print('Done')
