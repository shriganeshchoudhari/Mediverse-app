-- V112: Seed Postgraduate Advanced Physical Medicine, Rehabilitation & Neurotrauma (PG-611) Full Curriculum

-- Ensure Subject: PG-611 exists with correct title and category
INSERT INTO subjects (id, semester_id, code, title, category)
VALUES ('f9f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a37', 'd0e1f2a3-c4d5-6e7f-8a9b-0c1d2e3f4a5b', 'PG-611', 'Postgraduate Advanced Physical Medicine, Rehabilitation & Neurotrauma', 'CLINICAL')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, category = EXCLUDED.category;

-- Unit 1: Spinal Cord Injury, ISNCSCI ASIA Staging & Autonomic Dysreflexia
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa760001-0000-0000-0000-000000000001', 'f9f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a37', 'Spinal Cord Injury, ISNCSCI ASIA Staging & Autonomic Dysreflexia', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa760002-0000-0000-0000-000000000001', 'fa760001-0000-0000-0000-000000000001', 'ISNCSCI Neurological Classification, Motor Levels & Sacral Sparing', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa760003-0000-0000-0000-000000000001', 'fa760002-0000-0000-0000-000000000001', 'Incomplete SCI Syndromes: Central Cord, Anterior Cord & Brown-Sequard', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa760004-0000-0000-0000-000000000001', 'fa760003-0000-0000-0000-000000000001', 'Autonomic Dysreflexia Sympathetic Storming & Emergency Management', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa760005-0000-0000-0000-000000000001', 'fa760004-0000-0000-0000-000000000001', 'ISNCSCI ASIA Impairment Scale Classification, Incomplete Cord Syndromes, and Autonomic Dysreflexia Emergency Resuscitation', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa760006-0000-0000-0000-000000000001', 'fa760005-0000-0000-0000-000000000001', 'EXPLANATION', 1, 
'{"text": "### Spinal Cord Injury & Autonomic Dysreflexia\n\nISNCSCI Classification: Neurological Level of Injury (NLI) is the lowest segment with normal sensory (pinprick/light touch score 2) and motor (grade >=3 with grade 5 above) function bilaterally. ASIA Impairment Scale (AIS): Grade A = Complete (no motor or sensory in S4-S5; absent DAP/VAC); Grade B = Sensory Incomplete (sensory preserved S4-S5, no motor >3 levels below motor level); Grade C = Motor Incomplete (>50% key muscles below NLI grade <3); Grade D = Motor Incomplete (>=50% key muscles below NLI grade >=3); Grade E = Normal.\n\nIncomplete Cord Syndromes: (1) Central Cord Syndrome: Upper > lower extremity weakness, hyperextension injury in stenotic cervical spines; (2) Anterior Cord Syndrome: Bilateral loss of motor and pain/temperature, dorsal columns preserved; (3) Brown-Sequard Syndrome: Ipsilateral motor loss and proprioception deficit with contralateral pain/temperature loss 1-2 segments below lesion.\n\nAutonomic Dysreflexia (AD): Occurs in spinal cord injuries at or above T6. Triggered by noxious stimuli below lesion (85% bladder distension/blocked Foley, 10% bowel impaction). Massive uninhibited sympathetic storming below lesion causes intense arteriolar vasoconstriction with severe hypertension (SBP >20-40 mmHg above baseline, often 180-220 mmHg), pounding headache, and flushing/sweating above lesion. Parasympathetic vagal response above lesion causes relative/profound bradycardia (HR 40-50 bpm). Emergency Management: (1) Sit patient upright at 90 degrees with legs dangling (induces orthostatic venous pooling); (2) Loosen constrictive garments; (3) Decompress bladder with lidocaine-lubricated catheter and check for blocked tubing; (4) If SBP remains >150 mmHg: apply 1-2 inches of 2% Nitropaste above the lesion level (can be rapidly wiped off if hypotension ensues)."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 2: Traumatic Brain Injury, Rancho Cognitive Staging & Concussion Protocols
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa760001-0000-0000-0000-000000000002', 'f9f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a37', 'Traumatic Brain Injury, Rancho Cognitive Staging & Concussion Protocols', 2)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa760002-0000-0000-0000-000000000002', 'fa760001-0000-0000-0000-000000000002', 'Rancho Los Amigos Levels of Cognitive Functioning (RLAS I-X)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa760003-0000-0000-0000-000000000002', 'fa760002-0000-0000-0000-000000000002', 'Disorders of Consciousness: Coma, VS/UWS, MCS & Amantadine Therapy', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa760004-0000-0000-0000-000000000002', 'fa760003-0000-0000-0000-000000000002', 'Sports Concussion Assessment Tool (SCAT-6) & Graduated Return-to-Play', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa760005-0000-0000-0000-000000000002', 'fa760004-0000-0000-0000-000000000002', 'Rancho Los Amigos Cognitive Staging, Rancho IV Agitation Management, Amantadine Neuro-Stimulation, and SCAT-6 Return-to-Play Protocols', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa760006-0000-0000-0000-000000000002', 'fa760005-0000-0000-0000-000000000002', 'EXPLANATION', 1, 
'{"text": "### Traumatic Brain Injury, Rancho Staging & Concussion\n\nRancho Los Amigos Levels of Cognitive Functioning (RLAS): Level I = No Response; Level II = Generalized Response; Level III = Localized Response; Level IV = Confused-Agitated (Heightened activity, severe agitation, aggression, absence of short-term memory -> manage with quiet environment, dim lights, minimal visitors, avoidance of physical restraints, and structured redirection); Level V = Confused-Inappropriate, Non-Agitated; Level VI = Confused-Appropriate; Level VII = Automatic-Appropriate; Level VIII = Purposeful-Appropriate (Stand-By Assistance); Levels IX-X = Modified/Full Independence.\n\nDisorders of Consciousness (DoC): (1) Coma: No wakefulness (eyes closed), no awareness; (2) Vegetative State / Unresponsive Wakefulness Syndrome (VS/UWS): Wakefulness present (spontaneous eye-opening, sleep-wake cycles), but no reproducible purposeful awareness; (3) Minimally Conscious State (MCS): Inconsistent but reproducible purposeful behaviors (visual pursuit, command following, object localization); (4) Locked-In Syndrome: Intact consciousness and cognitive capacity with complete quadriplegia and anarthria due to ventral pontine lesion (vertical eye movements and blinking preserved). Evidence-based Neuro-Stimulation: Amantadine (100-200 mg BID PO/NG) significantly accelerates recovery rate of functional emergence in post-traumatic DoC (Giacino et al., NEJM).\n\nConcussion & SCAT-6 Graduated Return-to-Play: 6-stage protocol (minimum 24 hours per stage without symptom recurrence): Stage 1 = Symptom-limited activity; Stage 2 = Light aerobic exercise (walking/stationary cycle); Stage 3 = Sport-specific drills without head impact; Stage 4 = Non-contact training drills; Stage 5 = Full contact practice after medical clearance; Stage 6 = Return to competition."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 3: Stroke Rehabilitation, Spasticity Interventions & Intrathecal Baclofen
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa760001-0000-0000-0000-000000000003', 'f9f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a37', 'Stroke Rehabilitation, Spasticity Interventions & Intrathecal Baclofen', 3)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa760002-0000-0000-0000-000000000003', 'fa760001-0000-0000-0000-000000000003', 'Upper Motor Neuron Syndrome, Modified Ashworth & Tardieu Scales', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa760003-0000-0000-0000-000000000003', 'fa760002-0000-0000-0000-000000000003', 'Botulinum Toxin A (Botox) Chemodenervation & Guidance Modalities', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa760004-0000-0000-0000-000000000003', 'fa760003-0000-0000-0000-000000000003', 'Intrathecal Baclofen (ITB) Pump Management & ITB Withdrawal Emergencies', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa760005-0000-0000-0000-000000000003', 'fa760004-0000-0000-0000-000000000003', 'Modified Ashworth Tone Assessment, Botulinum Toxin Infiltration Techniques, and Intrathecal Baclofen Hyperthermia Withdrawal Resuscitation', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa760006-0000-0000-0000-000000000003', 'fa760005-0000-0000-0000-000000000003', 'EXPLANATION', 1, 
'{"text": "### Stroke Spasticity & Intrathecal Baclofen\n\nSpasticity Assessment: Velocity-dependent resistance to passive stretch due to hyper-excitable stretch reflex. Modified Ashworth Scale (MAS): Grade 0 = No tone increase; Grade 1 = Catch and release or minimal resistance at end ROM; Grade 1+ = Catch followed by minimal resistance through <50% of ROM; Grade 2 = Marked tone increase through most of ROM, but limb easily flexed; Grade 3 = Considerable tone increase, passive movement difficult; Grade 4 = Affected part rigid in flexion or extension. Tardieu Scale: Evaluates dynamic spasticity angle (R2 - R1) at slow (V1) vs fast (V3) velocities.\n\nChemodenervation with Botulinum Toxin A (onabotulinumtoxinA): Cleaves SNAP-25 protein in presynaptic cholinergic terminals, blocking vesicular acetylcholine release at neuromuscular junctions. Typical dosages: Biceps brachii 100-200 U, Gastrocnemius/Soleus 150-300 U, Flexor digitorum profundus 50-100 U. Maximum recommended cumulative adult dose: <=400-600 Units per 3-month session. Precision guidance via ultrasound and electromyography (EMG) is gold standard.\n\nIntrathecal Baclofen (ITB) Pump: Delivers GABA-B agonist directly into lumbar cerebrospinal fluid, achieving 100-fold higher CSF concentrations than oral dosing with minimal systemic sedation. ITB Withdrawal Emergency: Abrupt discontinuation (pump failure, catheter migration, kink, or empty reservoir) causes life-threatening GABA-B rebound excitation: severe hyperthermia (>39.5C), profound rebound spasticity/rigidity, delirium, hallucinations, rhabdomyolysis, seizures, disseminated intravascular coagulation (DIC), and cardiovascular collapse mimicking NMS/malignant hyperthermia. Emergency Management: Immediate high-dose intravenous Benzodiazepines (GABA-A agonism), urgent restoration of intrathecal baclofen infusion (or continuous IV propofol infusion in ICU)."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- Unit 4: Pediatric Cerebral Palsy, Gait Kinematics & Prosthetic Biomechanics
INSERT INTO units (id, subject_id, title, sort_order)
VALUES ('fa760001-0000-0000-0000-000000000004', 'f9f9a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a37', 'Pediatric Cerebral Palsy, Gait Kinematics & Prosthetic Biomechanics', 4)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO chapters (id, unit_id, title, sort_order)
VALUES ('fa760002-0000-0000-0000-000000000004', 'fa760001-0000-0000-0000-000000000004', 'Gross Motor Function Classification System (GMFCS I-V)', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO topics (id, chapter_id, title, sort_order)
VALUES ('fa760003-0000-0000-0000-000000000004', 'fa760002-0000-0000-0000-000000000004', 'Pathological Gait Kinematics: Crouch, Equinus, Jump Knee & Stiff Knee', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO concepts (id, topic_id, title, sort_order)
VALUES ('fa760004-0000-0000-0000-000000000004', 'fa760003-0000-0000-0000-000000000004', 'Orthotic Prescriptions (GRAFO) & Transtibial Prosthetic Pressure Zones', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order;

INSERT INTO lessons (id, concept_id, title, status, version)
VALUES ('fa760005-0000-0000-0000-000000000004', 'fa760004-0000-0000-0000-000000000004', 'GMFCS Functional Stratification, Crouch Gait Ground Reaction AFO Mechanics, and Transtibial Prosthetic Pressure-Tolerant Load Distributions', 'PUBLISHED', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;

INSERT INTO content_blocks (id, lesson_id, type, order_index, metadata)
VALUES ('fa760006-0000-0000-0000-000000000004', 'fa760005-0000-0000-0000-000000000004', 'EXPLANATION', 1, 
'{"text": "### Pediatric Cerebral Palsy, Gait & Prosthetics\n\nGross Motor Function Classification System (GMFCS): Level I = Walks without limitations; climbs stairs without railing; Level II = Walks with limitations; holds railing on stairs; Level III = Walks with handheld mobility devices (crutches/walkers); Level IV = Self-mobility with limitations; uses powered wheelchair; Level V = Transported in manual wheelchair; severe trunk and head control limitations.\n\nPathological Gait Patterns in Spastic Diplegia: (1) Crouch Gait: Excessive knee and hip flexion throughout stance phase, combined with excessive ankle dorsiflexion. Biomechanical treatment: Ground Reaction Ankle-Foot Orthosis (GRAFO / Floor Reaction AFO) with rigid anterior shell restricting ankle dorsiflexion, thereby directing the ground reaction force vector anterior to the knee joint center to generate an external knee extension moment during midstance (requires >=3+/5 quadriceps strength and no knee flexion contracture >10-15 degrees); (2) Equinus Gait: Primary ankle plantarflexion (toe-walking) -> Solid or Hinged AFO with plantarflexion stop; (3) Jump Knee Gait: Equinus + excessive knee/hip flexion in early stance followed by late stance extension; (4) Stiff Knee Gait: Inadequate swing phase knee flexion (<40 degrees) due to rectus femoris overactivity -> Rectus Femoris Transfer to gracilis/semitendinosus.\n\nTranstibial (Below-Knee Amputation BKA) Prosthetic Biomechanics: Patellar-Tendon-Bearing (PTB) socket design balances load across specific residual limb zones: (1) Pressure-Tolerant Areas (designed to bear load): Patellar tendon bar, medial tibial flare, pretibial muscle belly, gastrocnemius-soleus muscle belly, and shaft of fibula; (2) Pressure-Sensitive Areas (require relief/clearance): Anterior distal tibial cut end, tibial tuberosity, anterior tibial crest, fibular head (peroneal nerve compression risk), and hamstring tendons."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;
