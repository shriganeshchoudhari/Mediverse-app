-- V59: Seed Hospital Administration & Healthcare Quality (HADM-401) Full Curriculum

-- Ensure Subject: HADM-401 exists with correct title and category
INSERT INTO subjects (id, semester_id, code, title, category)
VALUES ('f1f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a17', 'c9d0e1f2-b3c4-5d6e-7f8a-9b0c1d2e3f4b', 'HADM-401', 'Hospital Administration & Healthcare Quality', 'CLINICAL')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, category = EXCLUDED.category;

-- Unit 1: Biomedical Waste Management Rules 2016 & Environmental Safety
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa210001-0000-0000-0000-000000000001', 'f1f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a17', 'Biomedical Waste Management Rules 2016 & Environmental Safety', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa210002-0000-0000-0000-000000000001', 'fa210001-0000-0000-0000-000000000001', 'Color-Coded Segregation & Disposal Matrix (Yellow, Red, White, Blue)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa210003-0000-0000-0000-000000000001', 'fa210002-0000-0000-0000-000000000001', 'Treatment Technologies: Incineration, Autoclaving, Shredding & Encapsulation', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa210004-0000-0000-0000-000000000001', 'fa210003-0000-0000-0000-000000000001', 'Hospital Spill Protocols: Blood (Hypochlorite) & Mercury (Sulfur)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa210005-0000-0000-0000-000000000001', 'fa210004-0000-0000-0000-000000000001', 'Biomedical Waste Segregation at Source, Barcode GPS Tracking, Incineration Standards, and Chemical Spill Management', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa210006-0000-0000-0000-000000000001', 'fa210005-0000-0000-0000-000000000001', 'EXPLANATION', 1, 
'{"text": "### Biomedical Waste Management Rules 2016\n\nYellow Bag: Non-chlorinated for human anatomical, placenta, soiled dressings, expired drugs, blood bags -> Incineration (>1050°C in secondary chamber) or plasma pyrolysis. Red Bag: Non-chlorinated for contaminated flexible recyclable plastics (IV tubing, catheters, urine bags, gloves) -> Autoclaving/Microwaving + Shredding. White Translucent Container: Puncture-proof, tamper-proof for sharps (needles, scalpels) -> Autoclave/Dry heat + Encapsulation. Blue Box: Puncture-resistant for glassware, ampoules, metallic implants -> 1-2% Sodium Hypochlorite + Recycling. Blood spill: 1% Sodium Hypochlorite (10,000 ppm) with 20-30 min contact time. Mercury spill: Evacuate, collect droplets with cardboard, cover with sulfur powder/zinc dust."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 2: Hospital Infection Control, Surveillance & Evidence-Based Care Bundles
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa210001-0000-0000-0000-000000000002', 'f1f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a17', 'Hospital Infection Control, Surveillance & Evidence-Based Care Bundles', 2)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa210002-0000-0000-0000-000000000002', 'fa210001-0000-0000-0000-000000000002', 'HAI Prevention Bundles: CLABSI, VAP, CAUTI & SSI', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa210003-0000-0000-0000-000000000002', 'fa210002-0000-0000-0000-000000000002', 'WHO 5 Moments for Hand Hygiene & Scrubbing Standards', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa210004-0000-0000-0000-000000000002', 'fa210003-0000-0000-0000-000000000002', 'Operation Theatre Air Quality: Positive Pressure, Laminar Flow & HEPA', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa210005-0000-0000-0000-000000000002', 'fa210004-0000-0000-0000-000000000002', 'Healthcare-Associated Infection Bundles, Chlorhexidine Antisepsis, Hand Hygiene Moments, and Operating Room Air Exchange Rules', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa210006-0000-0000-0000-000000000002', 'fa210005-0000-0000-0000-000000000002', 'EXPLANATION', 1, 
'{"text": "### Hospital Infection Control Bundles\n\nCLABSI Bundle: Maximal sterile barriers (cap, mask, gown, gloves, full drape), >0.5% chlorhexidine alcohol prep, subclavian site preferred (femoral avoided), daily line review. VAP Bundle: Head of bed 30-45°, daily sedation vacation, subglottic secretion drainage (CASS ETT), oral chlorhexidine. CAUTI Bundle: Aseptic insertion, closed drainage below bladder, avoid dependent loops, prompt removal. SSI Bundle: Pre-op bath, clippers only (no razors), IV antibiotic within 60 min before incision, normothermia (>=36°C), euglycemia (<180 mg/dL). WHO 5 Moments: Before patient, Before clean procedure, After body fluid risk, After patient, After patient surroundings. OT environment: Positive pressure (>2.5 Pa), laminar flow, 20-25 air changes/hour, HEPA filters (99.97% at 0.3 um)."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 3: Healthcare Quality Frameworks, Accreditation & Clinical Audits
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa210001-0000-0000-0000-000000000003', 'f1f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a17', 'Healthcare Quality Frameworks, Accreditation & Clinical Audits', 3)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa210002-0000-0000-0000-000000000003', 'fa210001-0000-0000-0000-000000000003', 'Donabedian Quality Model: Structure, Process & Outcome', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa210003-0000-0000-0000-000000000003', 'fa210002-0000-0000-0000-000000000003', 'NABH (5th Edition) & JCI Healthcare Accreditation Frameworks', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa210004-0000-0000-0000-000000000003', 'fa210003-0000-0000-0000-000000000003', 'Clinical Audit 5-Stage Cycle & Hospital Bed Analytics (BOR, ALOS, BTI)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa210005-0000-0000-0000-000000000003', 'fa210004-0000-0000-0000-000000000003', 'Donabedian Quality Triad, 5-Stage Closed-Loop Clinical Auditing, NABH Compliance Chapters, and Bed Occupancy Formulas', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa210006-0000-0000-0000-000000000003', 'fa210005-0000-0000-0000-000000000003', 'EXPLANATION', 1, 
'{"text": "### Healthcare Quality & Accreditation\n\nDonabedian Model: Structure (facilities, ICU 1:1 nurse ratio), Process (guidelines, door-to-balloon <90 min), Outcome (30-day mortality, HAIs, patient satisfaction). Clinical Audit 5-Stage Cycle: Define standards -> Measure baseline -> Compare with standard -> Implement change -> Re-audit (close the loop). NABH 5th Ed: 10 chapters (5 patient-centered: AAC, COP, MOM, PRE, HIC; 5 management: CQI, ROM, FMS, HRM, IMS). Hospital Bed Metrics: Bed Occupancy Rate BOR = (Occupied Bed-Days / Available Bed-Days)*100% (target 75-85%); Average Length of Stay ALOS = Inpatient Days / Discharges+Deaths (target 4-5.5d); Bed Turnover Interval BTI = Vacant Bed-Days / Discharges (target 1-2d); Net Death Rate NDR = Deaths >48h / Discharges+Deaths >48h (<2%)."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 4: Patient Safety, Risk Management & Root Cause Analysis
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa210001-0000-0000-0000-000000000004', 'f1f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a17', 'Patient Safety, Risk Management & Root Cause Analysis', 4)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa210002-0000-0000-0000-000000000004', 'fa210001-0000-0000-0000-000000000004', 'International Patient Safety Goals (IPSG 1-6)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa210003-0000-0000-0000-000000000004', 'fa210002-0000-0000-0000-000000000004', 'WHO Surgical Safety Checklist: Sign In, Time Out & Sign Out', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa210004-0000-0000-0000-000000000004', 'fa210003-0000-0000-0000-000000000004', 'Root Cause Analysis (Ishikawa 6Ms & 5-Whys) for Sentinel Events', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa210005-0000-0000-0000-000000000004', 'fa210004-0000-0000-0000-000000000004', 'Patient Identification Protocols, Read-Back Communication, High-Alert Medications, Surgical Time Out, and Ishikawa Fishbone Investigation', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa210006-0000-0000-0000-000000000004', 'fa210005-0000-0000-0000-000000000004', 'EXPLANATION', 1, 
'{"text": "### Patient Safety & Root Cause Analysis\n\nIPSG 1: Identify patients with >=2 identifiers (Name, UHID; NEVER room/bed #). IPSG 2: Write down, read back, confirm verbal orders/panic values within 30 min. IPSG 3: Concentrated electrolytes removed from wards; LASA Tall-Man lettering. IPSG 4: WHO Surgical Safety Checklist (Sign In before induction, Time Out before incision briefing, Sign Out before leaving OT). IPSG 5: Hand hygiene & HAI bundles. IPSG 6: Fall prevention (Morse scale). Sentinel Events: Unexpected occurrence involving death/serious injury (wrong-site surgery, ABO mismatch, suicide). Root Cause Analysis (RCA): Retrospective system failure investigation. Ishikawa Fishbone (6Ms): Manpower, Machine, Material, Method, Measurement, Milieu + 5-Whys technique to identify latent organizational failures."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;
