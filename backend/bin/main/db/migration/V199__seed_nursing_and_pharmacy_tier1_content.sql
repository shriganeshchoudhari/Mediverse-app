-- V199: Seed Rich Tier 1 Curriculum Content for Nursing (BSc Nursing) and Pharmacy (PharmD / BPharm)

-- 1. Ensure all concepts across Nursing and Pharmacy have associated Lessons
INSERT INTO lessons (id, concept_id, title, status, version, created_at)
SELECT 
    gen_random_uuid(),
    c.id,
    c.title,
    'PUBLISHED',
    1,
    CURRENT_TIMESTAMP
FROM concepts c
WHERE NOT EXISTS (SELECT 1 FROM lessons l WHERE l.concept_id = c.id)
ON CONFLICT (id) DO NOTHING;

-- 2. Seed Rich Clinical Content Blocks for Nursing Core Topics
-- Nursing: NEWS2 & Rapid Deterioration Triage (INC CBME NF-3.1)
INSERT INTO content_blocks (id, lesson_id, type, order_index, status, metadata)
SELECT 
    '40000000-0000-0000-0009-000000000001',
    l.id,
    'EXPLANATION',
    1,
    'PUBLISHED',
    jsonb_build_object(
        'title', 'National Early Warning Score 2 (NEWS2) & Clinical Deterioration Escalation',
        'text', '# NEWS2 Clinical Deterioration & Rapid Escalation (INC CBME NF-3.1)\n\n## 1. The Six Physiological Parameters of NEWS2\nThe National Early Warning Score (NEWS2) standardizes the assessment of acute illness severity and risk of clinical deterioration.\n\n| Parameter | 3 | 2 | 1 | 0 | 1 | 2 | 3 |\n|---|---|---|---|---|---|---|---|\n| **Respiration Rate (bpm)** | ≤8 | | 9–11 | 12–20 | | 21–24 | ≥25 |\n| **SpO2 Scale 1 (%)** | ≤91 | 92–93 | 94–95 | ≥96 | | | |\n| **SpO2 Scale 2 (Hypercapnic)** | ≤83 | 84–85 | 86–87 | 88–92 (air) | 93–94 (O2) | 95–96 (O2) | ≥97 (O2) |\n| **Air or Oxygen?** | | O2 Device | | Room Air | | | |\n| **Systolic BP (mmHg)** | ≤90 | 91–100 | 101–110 | 111–219 | | | ≥220 |\n| **Pulse (bpm)** | ≤40 | | 41–50 | 51–90 | 91–110 | 111–130 | ≥131 |\n| **Consciousness (ACVPU)** | | | | Alert | | | CVPU |\n| **Temperature (°C)** | ≤35.0 | | 35.1–36.0 | 36.1–38.0 | 38.1–39.0 | ≥39.1 | |\n\n:::pearl\n**Clinical Escalation Trigger (Sepsis Six Bundle)**:\n- **NEWS2 Score 5–6** (or 3 in a single parameter): Urgent ward nurse review + Medical registrar bedside arrival within 30 minutes.\n- **NEWS2 Score ≥7**: Immediate Medical Emergency Team (MET / Code Blue) call, continuous telemetry monitoring, and transfer to HDU/ICU consideration.\n:::'
    )
FROM concepts c
JOIN lessons l ON l.concept_id = c.id
WHERE c.title ILIKE '%Vital Signs%' OR c.title ILIKE '%Nursing%' OR c.title ILIKE '%Assessment%'
LIMIT 1
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata, status = 'PUBLISHED';

-- Nursing Clinical Quiz Block
INSERT INTO content_blocks (id, lesson_id, type, order_index, status, metadata)
SELECT 
    '40000000-0000-0000-0009-000000000002',
    l.id,
    'QUIZ',
    2,
    'PUBLISHED',
    jsonb_build_object(
        'title', 'NEWS2 Scoring & Sepsis Resuscitation Nursing Quiz',
        'questions', jsonb_build_array(
            jsonb_build_object(
                'question', 'A 68-year-old post-laparotomy patient has RR 26 bpm, SpO2 93% on room air, BP 88/54 mmHg, HR 118 bpm, Temp 38.6°C, and is drowsy but responds to Voice (V on ACVPU). What is the total NEWS2 score and mandated escalation?',
                'options', jsonb_build_array(
                    'Score 14 — Immediate MET / Rapid Response Team activation and immediate ICU review',
                    'Score 8 — Ward nurse repeat observations in 1 hour',
                    'Score 5 — Notify house officer within 60 minutes',
                    'Score 3 — Low risk routine monitoring'
                ),
                'correctIndex', 0,
                'explanation', 'Parameter breakdown: RR 26 (3) + SpO2 93% (2) + Air (0) + Systolic BP 88 (3) + HR 118 (1) + Voice (3) + Temp 38.6 (1) = Total NEWS2 of 13-14. Any score ≥7 represents critical physiological instability mandating immediate MET / ICU escalation.',
                'clinicalPearl', 'A single parameter score of 3 (e.g. CVPU or Systolic BP ≤90) warrants urgent senior clinical attendance regardless of the composite score.'
            )
        )
    )
FROM concepts c
JOIN lessons l ON l.concept_id = c.id
WHERE c.title ILIKE '%Vital Signs%' OR c.title ILIKE '%Nursing%' OR c.title ILIKE '%Assessment%'
LIMIT 1
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata, status = 'PUBLISHED';

-- 3. Seed Rich Clinical Content Blocks for Pharmacy Core Topics
-- Pharmacy: TDM of Vancomycin & Aminoglycosides (PCI CBME PH-TDM1)
INSERT INTO content_blocks (id, lesson_id, type, order_index, status, metadata)
SELECT 
    '50000000-0000-0000-0009-000000000001',
    l.id,
    'EXPLANATION',
    1,
    'PUBLISHED',
    jsonb_build_object(
        'title', 'Therapeutic Drug Monitoring: Vancomycin AUC/MIC Kinetics & Cockcroft-Gault Calculations',
        'text', '# Therapeutic Drug Monitoring & Clinical Pharmacokinetics (PCI CBME PH-TDM1)\n\n## 1. Vancomycin Pharmacodynamics & Guideline Revisions\nThe revised IDSA/ASHP consensus guidelines recommend **AUC24/MIC-guided dosing** over trough concentrations for serious MRSA infections (bacteremia, endocarditis, osteomyelitis, nosocomial pneumonia).\n\n### Key Targets:\n- **Target AUC24 / MIC ratio**: **400 to 600 mg·h/L** (assuming broth microdilution MIC of 1 mg/L).\n- **Trough Target (when AUC unavailable)**: 15–20 mcg/mL.\n- **Nephrotoxicity Threshold**: AUC24 > 600–650 mg·h/L or sustained troughs > 20 mcg/mL dramatically increases acute kidney injury (AKI) risk.\n\n## 2. Cockcroft-Gault Equation for Creatinine Clearance (CrCl)\n$$ CrCl \\text{ (mL/min)} = \\frac{(140 - \\text{Age}) \\times \\text{Weight (kg)}}{72 \\times \\text{Serum Creatinine (mg/dL)}} \\times (0.85 \\text{ if Female}) $$\n\n:::pearl\n**Weight Selection Rule in CrCl Calculations**:\n1. If Actual Body Weight (ABW) < Ideal Body Weight (IBW): Use **ABW**.\n2. If ABW is 100% to 120% of IBW: Use **IBW** ($IBW_{\\text{male}} = 50 + 2.3 \\times (\\text{Height in inches} - 60)$).\n3. If Obese (ABW > 120% IBW): Use Adjusted Body Weight ($AdjBW = IBW + 0.4 \\times (ABW - IBW)$).\n:::'
    )
FROM concepts c
JOIN lessons l ON l.concept_id = c.id
WHERE c.title ILIKE '%Pharmacokinetics%' OR c.title ILIKE '%Therapeutic%' OR c.title ILIKE '%Pharmacy%'
LIMIT 1
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata, status = 'PUBLISHED';

-- Pharmacy Active Recall Flashcards Deck
INSERT INTO content_blocks (id, lesson_id, type, order_index, status, metadata)
SELECT 
    '50000000-0000-0000-0009-000000000002',
    l.id,
    'FLASHCARD_SET',
    2,
    'PUBLISHED',
    jsonb_build_object(
        'title', 'Clinical Pharmacokinetics & Toxicological Antidotes Mastery Deck',
        'cards', jsonb_build_array(
            jsonb_build_object(
                'front', 'What is the target 24-hour Area Under the Curve to MIC (AUC24/MIC) for Vancomycin in severe MRSA bacteremia?',
                'back', '400 to 600 mg·h/L (assuming MIC ≤ 1 mg/L).',
                'cloze', 'The target Vancomycin AUC24/MIC ratio for invasive MRSA infections is {{c1::400 to 600 mg·h/L}}.',
                'difficulty', 'High-Yield'
            ),
            jsonb_build_object(
                'front', 'What is the specific pharmacological antidote for Ethylene Glycol / Methanol toxicity that inhibits alcohol dehydrogenase?',
                'back', 'Fomepizole (4-methylpyrazole) is the preferred competitive inhibitor of alcohol dehydrogenase.',
                'cloze', 'The primary antidote that prevents toxic metabolite formation in methanol ingestion is {{c1::Fomepizole}}.',
                'difficulty', 'Core'
            ),
            jsonb_build_object(
                'front', 'Which strong CYP3A4 inhibitors dramatically increase the risk of statin-induced rhabdomyolysis?',
                'back', 'Clarithromycin, Ketoconazole, Itraconazole, Ritonavir, and Grapefruit juice (>1 liter/day).',
                'cloze', 'Co-administration of Simvastatin with {{c1::Clarithromycin or Ketoconazole}} increases rhabdomyolysis risk via CYP3A4 inhibition.',
                'difficulty', 'High-Yield'
            )
        )
    )
FROM concepts c
JOIN lessons l ON l.concept_id = c.id
WHERE c.title ILIKE '%Pharmacokinetics%' OR c.title ILIKE '%Therapeutic%' OR c.title ILIKE '%Pharmacy%'
LIMIT 1
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata, status = 'PUBLISHED';
