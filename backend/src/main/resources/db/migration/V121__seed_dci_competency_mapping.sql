-- =============================================================================
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
