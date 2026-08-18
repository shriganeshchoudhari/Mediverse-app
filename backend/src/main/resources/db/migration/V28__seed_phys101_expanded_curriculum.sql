-- V28: Seed Expanded Human Physiology (PHYS-101) Units (Hematology, GI, Endocrine, Neurophysiology)

-- Unit 2: Hematology & Blood Physiology
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('f1010001-0000-0000-0000-000000000002', 'd5e6f7a8-b9c0-1d2e-3f4a-5b6c7d8e9f0a', 'Hematology & Blood Physiology', 2)
ON CONFLICT DO NOTHING;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('f1010002-0000-0000-0000-000000000002', 'f1010001-0000-0000-0000-000000000002', 'Hemostasis & Coagulation Cascade', 1)
ON CONFLICT DO NOTHING;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('f1010003-0000-0000-0000-000000000002', 'f1010002-0000-0000-0000-000000000002', 'Primary and Secondary Hemostasis', 1)
ON CONFLICT DO NOTHING;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('f1010004-0000-0000-0000-000000000002', 'f1010003-0000-0000-0000-000000000002', 'Platelet Kinetics & Fibrin Clotting', 1)
ON CONFLICT DO NOTHING;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('f1010005-0000-0000-0000-000000000002', 'f1010004-0000-0000-0000-000000000002', 'Platelet Activation and Clotting Cascade', 'PUBLISHED', 1)
ON CONFLICT DO NOTHING;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('f1010006-0000-0000-0000-000000000002', 'f1010005-0000-0000-0000-000000000002', 'EXPLANATION', 1, 
'{"text": "### Hemostasis & Coagulation Cascade\n\nPrimary hemostasis involves platelet adhesion (vWF-GpIb), activation (ADP, TXA2), and aggregation (fibrinogen-GpIIb/IIIa). Secondary hemostasis generates an insoluble cross-linked fibrin meshwork via intrinsic (aPTT), extrinsic (PT/INR), and common pathways."}'::jsonb)
ON CONFLICT DO NOTHING;

-- Unit 8: Gastrointestinal Physiology
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('f1010001-0000-0000-0000-000000000008', 'd5e6f7a8-b9c0-1d2e-3f4a-5b6c7d8e9f0a', 'Gastrointestinal Physiology', 8)
ON CONFLICT DO NOTHING;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('f1010002-0000-0000-0000-000000000008', 'f1010001-0000-0000-0000-000000000008', 'Gastric Secretions & GI Hormones', 1)
ON CONFLICT DO NOTHING;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('f1010003-0000-0000-0000-000000000008', 'f1010002-0000-0000-0000-000000000008', 'Parietal Cell Acid Secretion', 1)
ON CONFLICT DO NOTHING;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('f1010004-0000-0000-0000-000000000008', 'f1010003-0000-0000-0000-000000000008', 'H+/K+ ATPase & Enteric Regulation', 1)
ON CONFLICT DO NOTHING;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('f1010005-0000-0000-0000-000000000008', 'f1010004-0000-0000-0000-000000000008', 'Gastric Acid Secretion & Peptide Hormones', 'PUBLISHED', 1)
ON CONFLICT DO NOTHING;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('f1010006-0000-0000-0000-000000000008', 'f1010005-0000-0000-0000-000000000008', 'EXPLANATION', 1, 
'{"text": "### Gastric Acid Secretion & Enteric Regulation\n\nParietal cells secrete HCl via apical H+/K+ ATPase pumps stimulated by Histamine (H2-cAMP), Acetylcholine (M3-Ca2+), and Gastrin (CCKB-Ca2+), and inhibited by Somatostatin and Prostaglandins."}'::jsonb)
ON CONFLICT DO NOTHING;

-- Unit 9: Endocrine Physiology
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('f1010001-0000-0000-0000-000000000009', 'd5e6f7a8-b9c0-1d2e-3f4a-5b6c7d8e9f0a', 'Endocrine Physiology', 9)
ON CONFLICT DO NOTHING;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('f1010002-0000-0000-0000-000000000009', 'f1010001-0000-0000-0000-000000000009', 'Hypothalamic-Pituitary & Thyroid Axis', 1)
ON CONFLICT DO NOTHING;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('f1010003-0000-0000-0000-000000000009', 'f1010002-0000-0000-0000-000000000009', 'Thyroid Kinetics & Adrenal Zonation', 1)
ON CONFLICT DO NOTHING;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('f1010004-0000-0000-0000-000000000009', 'f1010003-0000-0000-0000-000000000009', 'Thyroid Peroxidase & Feedback Loops', 1)
ON CONFLICT DO NOTHING;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('f1010005-0000-0000-0000-000000000009', 'f1010004-0000-0000-0000-000000000009', 'Thyroid Organification and Adrenal Physiology', 'PUBLISHED', 1)
ON CONFLICT DO NOTHING;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('f1010006-0000-0000-0000-000000000009', 'f1010005-0000-0000-0000-000000000009', 'EXPLANATION', 1, 
'{"text": "### Thyroid Hormone Synthesis & Adrenal Steroidogenesis\n\nThyroid Peroxidase (TPO) oxidizes iodide, organifies it onto thyroglobulin tyrosines, and couples MIT/DIT to form T3 and T4. The adrenal cortex produces Aldosterone (Glomerulosa), Cortisol (Fasciculata), and Androgens (Reticularis)."}'::jsonb)
ON CONFLICT DO NOTHING;

-- Unit 11: Neurophysiology & Special Senses
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('f1010001-0000-0000-0000-000000000011', 'd5e6f7a8-b9c0-1d2e-3f4a-5b6c7d8e9f0a', 'Neurophysiology & Special Senses', 11)
ON CONFLICT DO NOTHING;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('f1010002-0000-0000-0000-000000000011', 'f1010001-0000-0000-0000-000000000011', 'Basal Ganglia Motor Loops & Visual Pathways', 1)
ON CONFLICT DO NOTHING;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('f1010003-0000-0000-0000-000000000011', 'f1010002-0000-0000-0000-000000000011', 'Direct and Indirect Motor Pathways', 1)
ON CONFLICT DO NOTHING;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('f1010004-0000-0000-0000-000000000011', 'f1010003-0000-0000-0000-000000000011', 'D1 vs D2 Dopaminergic Modulation', 1)
ON CONFLICT DO NOTHING;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('f1010005-0000-0000-0000-000000000011', 'f1010004-0000-0000-0000-000000000011', 'Basal Ganglia Circuitry & Visual Perimetry', 'PUBLISHED', 1)
ON CONFLICT DO NOTHING;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('f1010006-0000-0000-0000-000000000011', 'f1010005-0000-0000-0000-000000000011', 'EXPLANATION', 1, 
'{"text": "### Basal Ganglia Motor Loops & Visual Field Perimetry\n\nThe direct pathway (D1) promotes movement via thalamic disinhibition, while the indirect pathway (D2) suppresses movement via subthalamic nucleus stimulation. Pituitary lesions compressing the optic chiasm produce bitemporal hemianopia."}'::jsonb)
ON CONFLICT DO NOTHING;
