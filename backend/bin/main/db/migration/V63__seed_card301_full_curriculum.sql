-- V63: Seed Cardiovascular Pathophysiology & Advanced Hemodynamics (CARD-301) Full Curriculum

-- Ensure Subject: CARD-301 exists with correct title and category
INSERT INTO subjects (id, semester_id, code, title, category)
VALUES ('f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a21', 'c7d8e9f0-b1c2-3d4e-5f6a-7b8c9d0e1f2a', 'CARD-301', 'Cardiovascular Pathophysiology & Advanced Hemodynamics', 'CLINICAL')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, category = EXCLUDED.category;

-- Unit 1: Wiggers Diagram & Valvular Pressure-Volume Loops
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa250001-0000-0000-0000-000000000001', 'f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a21', 'Wiggers Diagram & Valvular Pressure-Volume Loops', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa250002-0000-0000-0000-000000000001', 'fa250001-0000-0000-0000-000000000001', 'Normal Left Ventricular PV Loop & Loading Shifts', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa250003-0000-0000-0000-000000000001', 'fa250002-0000-0000-0000-000000000001', 'Aortic Stenosis Concentric Hypertrophy & Transvalvular Gradient', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa250004-0000-0000-0000-000000000001', 'fa250003-0000-0000-0000-000000000001', 'Aortic & Mitral Regurgitation: Loss of Isovolumetric Phases', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa250005-0000-0000-0000-000000000001', 'fa250004-0000-0000-0000-000000000001', 'Wiggers Mechanics, Stroke Work Area, Preload and Afterload Shifts, and Valvular Stenosis vs Regurgitation Pressure Gradients', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa250006-0000-0000-0000-000000000001', 'fa250005-0000-0000-0000-000000000001', 'EXPLANATION', 1, 
'{"text": "### Valvular Pressure-Volume (PV) Loops\n\nNormal PV Loop: Phases 1-4 (Isovolumetric contraction, Ejection, Isovolumetric relaxation, Diastolic filling). SV = EDV - ESV; EF = SV/EDV. Aortic Stenosis (AS): Marked increase in peak LV systolic pressure (>200 mmHg), tall narrow loop, increased afterload, decreased SV, concentric hypertrophy. Aortic Regurgitation (AR): Massive rightward shift, elevated EDV/SV, wide pulse pressure, NO TRUE ISOVOLUMETRIC PHASES (aortic valve never seals!). Mitral Stenosis (MS): Impaired diastolic LV filling -> low EDV and SV, small left-shifted loop, elevated LA pressure. Mitral Regurgitation (MR): Triangular loop, increased EDV, decreased ESV, NO true isovolumetric phases (systolic backflow into LA)."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 2: Jugular Venous Pressure Waveforms & Pericardial Dynamics
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa250001-0000-0000-0000-000000000002', 'f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a21', 'Jugular Venous Pressure Waveforms & Pericardial Dynamics', 2)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa250002-0000-0000-0000-000000000002', 'fa250001-0000-0000-0000-000000000002', 'Normal JVP Waveform Morphology (a, c, x, v, y)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa250003-0000-0000-0000-000000000002', 'fa250002-0000-0000-0000-000000000002', 'Cannon a Waves (AV Dissociation) & Giant v Waves (TR)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa250004-0000-0000-0000-000000000002', 'fa250003-0000-0000-0000-000000000002', 'Constrictive Pericarditis vs Cardiac Tamponade Hemodynamics', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa250005-0000-0000-0000-000000000002', 'fa250004-0000-0000-0000-000000000002', 'Right Atrial Waveforms, Tricuspid Regurgitation Expansion, Kussmaul Sign Paradoxical Inspiration, and Tamponade Pulsus Paradoxus', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa250006-0000-0000-0000-000000000002', 'fa250005-0000-0000-0000-000000000002', 'EXPLANATION', 1, 
'{"text": "### JVP Waveforms & Pericardial Dynamics\n\nNormal JVP: ''a'' wave (RA contraction), ''c'' wave (tricuspid bulge in RV isovolumetric contraction), ''x'' descent (atrial relaxation), ''v'' wave (passive RA filling against closed tricuspid), ''y'' descent (rapid passive ventricular filling upon tricuspid opening). Cannon ''a'' waves: AV dissociation (Complete Heart Block, VT) -> RA contracts against closed tricuspid. Absent ''a'' wave: Atrial Fibrillation. Giant ''v'' wave: Tricuspid Regurgitation. Constrictive Pericarditis: Steep ''x'' AND sharp deep ''y'' descent (dip-and-plateau / square-root sign), positive Kussmaul sign (JVP rises on inspiration), pericardial knock. Cardiac Tamponade: Steep ''x'' descent with BLUNTED or ABSENT ''y'' descent, Pulsus Paradoxus >10 mmHg, Beck triad."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 3: Heart Failure Pathophysiology & Invasive Shock Profiling
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa250001-0000-0000-0000-000000000003', 'f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a21', 'Heart Failure Pathophysiology & Invasive Shock Profiling', 3)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa250002-0000-0000-0000-000000000003', 'fa250001-0000-0000-0000-000000000003', 'HFrEF vs HFpEF & Laplace Law of Wall Stress', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa250003-0000-0000-0000-000000000003', 'fa250002-0000-0000-0000-000000000003', 'Swan-Ganz Catheterization: CVP, PCWP, CI, SVR & SvO2', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa250004-0000-0000-0000-000000000003', 'fa250003-0000-0000-0000-000000000003', 'Hypovolemic, Cardiogenic, Distributive & Obstructive Shock', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa250005-0000-0000-0000-000000000003', 'fa250004-0000-0000-0000-000000000003', 'Laplace Wall Tension, Pulmonary Capillary Wedge Pressure Profiles, SVR Calculations, Inotropic Dobutamine Protocols, and Mechanical Circulatory Support', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa250006-0000-0000-0000-000000000003', 'fa250005-0000-0000-0000-000000000003', 'EXPLANATION', 1, 
'{"text": "### Heart Failure & Shock Hemodynamics\n\nLaplace Law: Wall Stress = (P x r) / 2h. HFrEF: EF <=40%, eccentric dilation. HFpEF: EF >=50%, concentric stiff non-compliant ventricle. Shock Profiling: Hypovolemic: Low CVP, Low PCWP, Low CI, High SVR, Low SvO2 -> IV fluids. Cardiogenic: High CVP, High PCWP, Severely Low CI, High SVR, Low SvO2 -> Inotropes (Dobutamine) + IABP/Impella. Distributive (Septic): Low/Normal CVP, Low/Normal PCWP, High CI, Severely Low SVR, High SvO2 -> IV fluids + Norepinephrine. Obstructive (PE/Tamponade): High CVP, Low/Normal PCWP, Low CI, High SVR -> Relieve obstruction. SVR Formula = 80 x (MAP - CVP) / CO (Normal: 800-1200)."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 4: Advanced ACLS Arrhythmias & Resuscitation Pharmacotherapy
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa250001-0000-0000-0000-000000000004', 'f1d0a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a21', 'Advanced ACLS Arrhythmias & Resuscitation Pharmacotherapy', 4)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa250002-0000-0000-0000-000000000004', 'fa250001-0000-0000-0000-000000000004', 'Unstable Tachycardia Synchronized Cardioversion Protocols', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa250003-0000-0000-0000-000000000004', 'fa250002-0000-0000-0000-000000000004', 'Shockable Arrest (VF/pVT Defibrillation & Amiodarone)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa250004-0000-0000-0000-000000000004', 'fa250003-0000-0000-0000-000000000004', 'PEA/Asystole Reversible 5Hs & 5Ts and Symptomatic Bradycardia', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa250005-0000-0000-0000-000000000004', 'fa250004-0000-0000-0000-000000000004', 'AHA ACLS Algorithms, Biphasic 200 J Defibrillation Cycles, Epinephrine Timing, Adenosine Dosing, and Atropine Pacing Guidelines', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa250006-0000-0000-0000-000000000004', 'fa250005-0000-0000-0000-000000000004', 'EXPLANATION', 1, 
'{"text": "### ACLS Arrhythmias & Pharmacotherapy\n\nUnstable Tachycardia: Immediate Synchronized Cardioversion (Narrow regular: 50-100 J; Wide regular: 100 J). Stable SVT: Vagal maneuvers -> IV Adenosine 6 mg rapid push -> 12 mg. Shockable Arrest (VF/pVT): Unsynchronized Defibrillation 200 J biphasic -> Resume CPR 2 min -> Epinephrine 1 mg q3-5min -> Amiodarone 300 mg bolus (then 150 mg). Do NOT pause CPR immediately after shock! PEA/Asystole: CPR + Epinephrine 1 mg q3-5min + Search for 5Hs and 5Ts (Hypovolemia, Hypoxia, Hydrogen ion, Hypo/Hyperkalemia, Hypothermia; Tension PTX, Tamponade, Toxins, Thrombosis PE/coronary). Symptomatic Bradycardia: IV Atropine 1 mg q3-5min (max 3 mg) -> Transcutaneous pacing / Dopamine / Epinephrine."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;
