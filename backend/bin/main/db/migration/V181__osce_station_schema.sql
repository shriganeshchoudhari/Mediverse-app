-- V181: OSCE station schema and exam_type support

-- Add exam_type to exam_sessions (MCQ default, OSCE, VIVA)
ALTER TABLE exam_sessions ADD COLUMN IF NOT EXISTS exam_type VARCHAR(20) NOT NULL DEFAULT 'MCQ';
ALTER TABLE exam_sessions ADD COLUMN IF NOT EXISTS domain VARCHAR(50);

COMMENT ON COLUMN exam_sessions.exam_type IS 'Exam format: MCQ, OSCE, VIVA';
COMMENT ON COLUMN exam_sessions.domain IS 'Healthcare domain this exam session belongs to';

-- OSCE stations table
CREATE TABLE IF NOT EXISTS osce_stations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    domain VARCHAR(50) NOT NULL,
    description TEXT,
    scenario_json JSONB NOT NULL DEFAULT '{}',
    checklist_json JSONB NOT NULL DEFAULT '[]',
    time_limit_minutes INT NOT NULL DEFAULT 10,
    passing_score_pct INT NOT NULL DEFAULT 70,
    difficulty VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_osce_stations_domain ON osce_stations(domain);

-- Seed core OSCE stations for Nursing (INC), Surgery (NMC), and Emergency Medicine
INSERT INTO osce_stations (id, title, domain, description, scenario_json, checklist_json, time_limit_minutes, passing_score_pct, difficulty) VALUES
(
  gen_random_uuid(), 'IV Cannulation & Fluid Resuscitation', 'NURSING',
  'Demonstrate safe IV cannulation technique with correct site selection, aseptic technique, and documentation for a dehydrated patient.',
  '{"patient": "45-year-old with vomiting × 3 days, HR 110 bpm, BP 90/60, dry mucous membranes", "task": "Insert IV cannula and initiate fluid resuscitation", "resources": ["IV cannula 18G", "NS 500mL", "IV tubing", "tourniquet", "gloves", "dressing"]}',
  '[{"item": "Performs hand hygiene before procedure", "marks": 5}, {"item": "Selects appropriate vein (antecubital/forearm)", "marks": 10}, {"item": "Applies tourniquet correctly", "marks": 5}, {"item": "Cleans site with alcohol swab in circular motion", "marks": 5}, {"item": "Inserts cannula at 15-30° angle bevel up", "marks": 15}, {"item": "Confirms blood flashback before advancing", "marks": 10}, {"item": "Secures cannula with transparent dressing", "marks": 10}, {"item": "Connects IV tubing and sets correct drip rate", "marks": 15}, {"item": "Documents time, site, cannula size", "marks": 10}, {"item": "Disposes sharps safely in sharps bin", "marks": 15}]',
  10, 70, 'INTERMEDIATE'
),
(
  gen_random_uuid(), 'Abdominal Examination — Acute Abdomen', 'ALLOPATHIC',
  'Perform a structured abdominal examination on a standardized patient presenting with right iliac fossa pain.',
  '{"patient": "22-year-old presenting with 24h RIF pain, nausea, low-grade fever 37.8°C, anorexia", "task": "Complete abdominal examination and state your clinical diagnosis", "position": "Patient supine, arms by side"}',
  '[{"item": "Introduces self and obtains verbal consent", "marks": 5}, {"item": "Positions patient correctly (supine, exposure groin to nipples)", "marks": 5}, {"item": "Inspects: scars, distension, visible peristalsis, hernias", "marks": 10}, {"item": "Percusses all 4 quadrants systematically", "marks": 10}, {"item": "Auscultates before palpation", "marks": 10}, {"item": "Light palpation away from site of pain first", "marks": 10}, {"item": "Elicits rebound tenderness (Blumberg sign)", "marks": 10}, {"item": "Elicits Rovsing sign (RIF pain on LIF pressure)", "marks": 10}, {"item": "Checks for psoas sign and obturator sign", "marks": 10}, {"item": "States clinical diagnosis: Acute Appendicitis with McBurney point tenderness", "marks": 20}]',
  10, 70, 'INTERMEDIATE'
),
(
  gen_random_uuid(), 'Spirometry Interpretation Station', 'ALLOPATHIC',
  'Interpret spirometry results and classify the pattern as obstructive, restrictive, or mixed.',
  '{"patient": "55-year-old smoker, 30 pack-years, presents with progressive dyspnea and chronic productive cough", "results": {"FVC": "3.1L (82% predicted)", "FEV1": "1.7L (55% predicted)", "FEV1/FVC": "0.55", "TLC": "7.2L (115% predicted)"}, "task": "Classify spirometry pattern and recommend management"}',
  '[{"item": "Correctly identifies FEV1/FVC < 0.70 → obstructive pattern", "marks": 20}, {"item": "Identifies severity: FEV1 55% = GOLD 2 Moderate COPD", "marks": 20}, {"item": "Notes hyperinflation: TLC 115% predicted", "marks": 10}, {"item": "States bronchodilator reversibility test needed", "marks": 10}, {"item": "Recommends SABA + LAMA for GOLD 2", "marks": 15}, {"item": "Counsels smoking cessation as priority", "marks": 15}, {"item": "Mentions pulmonary rehabilitation", "marks": 10}]',
  8, 70, 'ADVANCED'
),
(
  gen_random_uuid(), 'Braden Scale Pressure Injury Risk Assessment', 'NURSING',
  'Perform a Braden Scale assessment for a bedridden patient and implement prevention interventions.',
  '{"patient": "78-year-old post-hip replacement, bed-bound, incontinent, diabetic, mild confusion, eating <50% meals", "task": "Complete Braden Scale assessment and initiate pressure injury prevention protocol"}',
  '[{"item": "Assesses sensory perception correctly (1-4 scale)", "marks": 10}, {"item": "Assesses moisture (1-4 scale)", "marks": 10}, {"item": "Assesses activity level (bed-bound = 1)", "marks": 10}, {"item": "Assesses mobility (completely immobile = 1)", "marks": 10}, {"item": "Assesses nutrition (<50% meals eaten = 2)", "marks": 10}, {"item": "Assesses friction and shear", "marks": 10}, {"item": "Calculates total score (≤12 = High Risk)", "marks": 15}, {"item": "Initiates 2-hourly repositioning protocol", "marks": 10}, {"item": "Recommends pressure-relieving mattress", "marks": 10}, {"item": "Documents care plan in nursing notes", "marks": 5}]',
  10, 70, 'INTERMEDIATE'
),
(
  gen_random_uuid(), 'Gait Analysis — Post-Stroke Hemiplegia', 'PHYSIOTHERAPY',
  'Observe and analyze gait of a post-stroke hemiplegic patient and plan a rehabilitation intervention.',
  '{"patient": "60-year-old, 3 months post left MCA stroke, right hemiplegia, walks with cane", "observation": "Video or standardized patient with right circumduction gait, foot drop, decreased arm swing, shortened step length right", "task": "Describe gait deviations and plan PNF rehabilitation program"}',
  '[{"item": "Identifies circumduction of right lower limb", "marks": 15}, {"item": "Identifies foot drop (weak dorsiflexors)", "marks": 15}, {"item": "Notes reduced right arm swing", "marks": 10}, {"item": "Measures cadence and stride length", "marks": 10}, {"item": "Plans PNF diagonal pattern D1 extension for hip", "marks": 15}, {"item": "Recommends ankle-foot orthosis (AFO)", "marks": 10}, {"item": "Plans task-specific gait training (treadmill)", "marks": 15}, {"item": "Sets measurable goal: 10MWT improvement", "marks": 10}]',
  12, 70, 'ADVANCED'
)
ON CONFLICT DO NOTHING;
