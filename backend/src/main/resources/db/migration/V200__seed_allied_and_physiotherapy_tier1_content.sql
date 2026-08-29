-- V200: Seed Rich Tier 1 Curriculum Content for Physiotherapy (BPT/MPT) and Allied Health (BSc Allied Sciences / Technology)

-- 1. Ensure all concepts across Physiotherapy and Allied Health have associated Lessons
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

-- 2. Seed Rich Clinical Content Blocks for Physiotherapy Core Topics
-- Physiotherapy: Gait Cycle Biomechanics & Kinematic Subdivisions (IAP CBME PT-GAIT1)
INSERT INTO content_blocks (id, lesson_id, type, order_index, status, metadata)
SELECT 
    '60000000-0000-0000-0009-000000000001',
    l.id,
    'EXPLANATION',
    1,
    'PUBLISHED',
    jsonb_build_object(
        'title', 'Gait Cycle Biomechanics: Rancho Los Amigos Kinematics & Ground Reaction Force Vectors',
        'text', '# Gait Kinematics & Ground Reaction Force Biomechanics (IAP CBME PT-GAIT1)\n\n## 1. The Rancho Los Amigos Gait Subdivisions\nThe human gait cycle (stride) is divided into **Stance Phase (60%)** and **Swing Phase (40%)**.\n\n```mermaid\ngraph TD\n  A[Gait Cycle: 100%] --> B[Stance Phase: 60%]\n  A --> C[Swing Phase: 40%]\n  B --> B1[Initial Contact: 0-2%]\n  B --> B2[Loading Response: 2-12%]\n  B --> B3[Mid Stance: 12-31%]\n  B --> B4[Terminal Stance: 31-50%]\n  B --> B5[Pre-Swing: 50-60%]\n  C --> C1[Initial Swing: 60-75%]\n  C --> C2[Mid Swing: 75-87%]\n  C --> C3[Terminal Swing: 87-100%]\n```\n\n### Critical Kinematic Determinants:\n1. **Loading Response**: Ground reaction force passes posterior to the knee axis $\\rightarrow$ Extensor moment resisted by eccentric contraction of the **Quadriceps femoris** to prevent knee buckling.\n2. **Terminal Stance**: Heel rises while the forefoot remains in contact; the ground reaction force moves anterior to the knee and ankle $\\rightarrow$ Resisted by **Gastrocnemius-soleus complex** (plantarflexors) providing push-off power.\n3. **Initial Swing**: Requires 60° of active knee flexion and 15° hip flexion driven by **Iliopsoas, Rectus femoris, and Hamstrings** to ensure foot clearance.\n\n:::pearl\n**Pathological Gait Pearls**:\n- **Trendelenburg Gait**: Weakness of Gluteus Medius/Minimus (Superior Gluteal Nerve) causes pelvis to drop on the *contralateral* (unsupported) swing side during unilateral stance.\n- **Steppage Gait**: Deep peroneal nerve injury with Tibialis Anterior paralysis causes foot drop, requiring excessive hip/knee flexion to clear the toe during swing.\n:::'
    )
FROM concepts c
JOIN lessons l ON l.concept_id = c.id
WHERE c.title ILIKE '%Gait%' OR c.title ILIKE '%Biomechanics%' OR c.title ILIKE '%Physiotherapy%'
LIMIT 1
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata, status = 'PUBLISHED';

-- Physiotherapy Clinical MCQ Quiz
INSERT INTO content_blocks (id, lesson_id, type, order_index, status, metadata)
SELECT 
    '60000000-0000-0000-0009-000000000002',
    l.id,
    'QUIZ',
    2,
    'PUBLISHED',
    jsonb_build_object(
        'title', 'Gait Biomechanics & Neuromuscular Impairment Clinical Quiz',
        'questions', jsonb_build_array(
            jsonb_build_object(
                'question', 'During which phase of the normal gait cycle is peak eccentric quadriceps muscle activity required to absorb impact shock and control knee flexion to 15 degrees?',
                'options', jsonb_build_array(
                    'Loading Response (Foot flat)',
                    'Initial Contact (Heel strike)',
                    'Mid Stance',
                    'Terminal Swing'
                ),
                'correctIndex', 0,
                'explanation', 'During Loading Response (2% to 12% of the gait cycle), the heel contacts the ground and the body weight is rapidly transferred onto the limb. The ground reaction force vector passes posterior to the knee joint center, generating a strong flexion moment that must be checked by active eccentric contraction of the quadriceps to prevent sudden buckling.',
                'clinicalPearl', 'Quadriceps weakness causes the patient to thrust the knee into hyperextension (genu recurvatum) or lean the trunk anteriorly during loading response.'
            ),
            jsonb_build_object(
                'question', 'Which special test has the highest diagnostic sensitivity (approx. 95%) for an acute Anterior Cruciate Ligament (ACL) rupture?',
                'options', jsonb_build_array(
                    'Lachman Test at 20-30° knee flexion',
                    'Anterior Drawer Test at 90° knee flexion',
                    'McMurray Test with external rotation',
                    'Apley Grind Test'
                ),
                'correctIndex', 0,
                'explanation', 'The Lachman test performed at 20° to 30° of knee flexion isolates the anterior cruciate ligament while eliminating the stabilizing constraint of the posterior meniscal horns and hamstrings (which often cause false negatives in the anterior drawer test at 90° flexion).',
                'clinicalPearl', 'A soft or absent endpoint during anterior tibial translation at 30° flexion indicates a complete ACL tear.'
            )
        )
    )
FROM concepts c
JOIN lessons l ON l.concept_id = c.id
WHERE c.title ILIKE '%Gait%' OR c.title ILIKE '%Biomechanics%' OR c.title ILIKE '%Physiotherapy%'
LIMIT 1
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata, status = 'PUBLISHED';

-- 3. Seed Rich Clinical Content Blocks for Allied Health Core Topics
-- Allied Health: Computed Tomography Hounsfield Units & Windowing (NCAHP CBME RT-CT1)
INSERT INTO content_blocks (id, lesson_id, type, order_index, status, metadata)
SELECT 
    '70000000-0000-0000-0009-000000000001',
    l.id,
    'EXPLANATION',
    1,
    'PUBLISHED',
    jsonb_build_object(
        'title', 'Computed Tomography: Hounsfield Unit Attenuation Scale, Window Width & Window Level Settings',
        'text', '# CT Physics: Hounsfield Units & Clinical Windowing (NCAHP CBME RT-CT1)\n\n## 1. The Hounsfield Unit (HU) Attenuation Scale\nCT numbers (Hounsfield Units) represent the linear attenuation coefficient of tissues relative to pure water.\n\n$$ HU = 1000 \\times \\frac{\\mu_{\\text{tissue}} - \\mu_{\\text{water}}}{\\mu_{\\text{water}}} $$\n\n| Tissue / Substance | Typical HU Range | Visual Radiodensity |\n|---|---|---|\n| **Air** | -1000 HU | Pure Black |\n| **Lung Parenchyma** | -700 to -500 HU | Dark Gray |\n| **Fat (Subcutaneous / Retroperitoneal)** | -100 to -50 HU | Dark Gray / Black |\n| **Pure Water** | **0 HU** (Reference) | Mid-Gray |\n| **CSF / Simple Renal Cyst** | +5 to +15 HU | Mid-Gray |\n| **Soft Tissue / Liver / Muscle** | +30 to +50 HU | Light Gray |\n| **Acute Clotted Blood / Hematoma** | **+60 to +85 HU** | Hyperdense (Bright White) |\n| **Intravenous Contrast** | +150 to +300 HU | Bright White |\n| **Cortical Bone** | **+1000 to +3000 HU** | Dense White |\n\n:::pearl\n**Clinical Windowing Formula**:\n- **Window Level (WL)**: Sets the center brightness of the display.\n- **Window Width (WW)**: Determines the dynamic contrast range across grayscale levels.\n- **Brain Window**: $WL = +35\\text{ HU}, WW = 80\\text{ HU}$ (Optimized to detect hyperdense acute ischemic/hemorrhagic stroke and loss of gray-white differentiation).\n- **Bone Window**: $WL = +500\\text{ HU}, WW = 2000\\text{ HU}$ (Optimized for cortical fractures).\n:::'
    )
FROM concepts c
JOIN lessons l ON l.concept_id = c.id
WHERE c.title ILIKE '%Radiology%' OR c.title ILIKE '%Imaging%' OR c.title ILIKE '%Allied%'
LIMIT 1
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata, status = 'PUBLISHED';

-- Allied Health Flashcard Mastery Deck
INSERT INTO content_blocks (id, lesson_id, type, order_index, status, metadata)
SELECT 
    '70000000-0000-0000-0009-000000000002',
    l.id,
    'FLASHCARD_SET',
    2,
    'PUBLISHED',
    jsonb_build_object(
        'title', 'Radiology Physics, Dialysis & ECMO Critical Technology Deck',
        'cards', jsonb_build_array(
            jsonb_build_object(
                'front', 'What is the characteristic CT Hounsfield Unit (HU) range for acute uncoagulated intracranial hemorrhage?',
                'back', '+60 to +85 HU due to the high electron density of concentrated globin proteins in hemoglobin.',
                'cloze', 'Acute intracranial hemorrhage exhibits high attenuation on non-contrast CT in the range of {{c1::+60 to +85 HU}}.',
                'difficulty', 'Core'
            ),
            jsonb_build_object(
                'front', 'What is the minimal single-pool Kt/V (spKt/V) target recommended by KDOQI for thrice-weekly hemodialysis adequacy?',
                'back', 'A single-pool Kt/V of at least 1.2 per session (target 1.4) or Urea Reduction Ratio (URR) ≥ 65%.',
                'cloze', 'The target single-pool hemodialysis clearance adequacy metric is spKt/V {{c1::≥ 1.2 (target 1.4)}}.',
                'difficulty', 'High-Yield'
            ),
            jsonb_build_object(
                'front', 'In Veno-Arterial (VA) ECMO with peripheral femoral cannulation, what life-threatening complication occurs when poorly oxygenated blood from recovering native lungs perfuses the coronary and carotid arteries?',
                'back', 'Harlequin Syndrome (also termed North-South Syndrome or Differential Hypoxemia).',
                'cloze', 'Differential upper-body hypoxemia occurring during femoral VA-ECMO is known as {{c1::Harlequin Syndrome (North-South Syndrome)}}.',
                'difficulty', 'High-Yield'
            )
        )
    )
FROM concepts c
JOIN lessons l ON l.concept_id = c.id
WHERE c.title ILIKE '%Radiology%' OR c.title ILIKE '%Imaging%' OR c.title ILIKE '%Allied%'
LIMIT 1
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata, status = 'PUBLISHED';
