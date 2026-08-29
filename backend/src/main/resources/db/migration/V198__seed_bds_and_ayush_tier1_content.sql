-- V198: Seed Rich Tier 1 Curriculum Content for BDS (Dental) and AYUSH (BAMS, BHMS, BUMS, BNYS, BSMS)

-- 1. Ensure all concepts across BDS and AYUSH programs have associated Lessons
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

-- 2. Seed Rich Clinical Content Blocks for BDS Core Topics (Conservative Dentistry, Endodontics, Oral Surgery, Orthodontics)
-- BDS-GA: Head & Neck Osteology
INSERT INTO content_blocks (id, lesson_id, type, order_index, status, metadata)
SELECT 
    '20000000-0000-0000-0009-000000000001',
    l.id,
    'EXPLANATION',
    1,
    'PUBLISHED',
    jsonb_build_object(
        'title', 'Maxillofacial Osteology, Pterygopalatine Fossa & Craniofacial Sutures',
        'text', '# Maxillofacial Osteology & Surgical Anatomy (DCI CBME DA-1.1)\n\n## 1. Surgical Landmarks of the Maxilla & Mandible\nThe adult craniofacial skeleton consists of 14 facial bones and 8 cranial bones. In dental surgery, understanding the buttress systems of the face is paramount for managing maxillofacial trauma and orthognathic surgery.\n\n### Primary Vertical Buttresses:\n- **Nasomaxillary (Medial) Buttress**: Transmits occlusal loads from anterior maxillary teeth through the canine ridge, piriform aperture margin, and frontal process of maxilla to the frontal bone.\n- **Zygomaticomaxillary (Lateral) Buttress**: Strongest buttress; directs masticatory forces from the maxillary molars across the zygomatic process to the zygomatic arch and temporal bone.\n- **Pterygomaxillary (Posterior) Buttress**: Relays posterior occlusal forces via the pyramidal process of the palatine bone and pterygoid plates of the sphenoid to the skull base.\n\n:::pearl\n**Surgical Pearl**: Le Fort I osteotomy fractures along the low horizontal plane above the nasal floor and through the lateral nasal wall, maxillary sinus walls, and pterygomaxillary junction without violating the pterygoid plexus.\n:::\n\n## 2. Pterygopalatine Fossa Anatomy & Anesthetic Block\nThe pterygopalatine fossa (PPF) is an inverted pyramidal space located below the apex of the orbit between the posterior surface of the maxilla and the pterygoid process of the sphenoid.\n- **Contents**: Maxillary nerve (V2), Pterygopalatine ganglion, Third part of maxillary artery.\n- **Greater Palatine Canal Approach**: Used for maxillary nerve block during quadrant surgeries. The needle enters the greater palatine foramen (located lingual to the second/third molar, ~3-4 mm anterior to the junction of hard and soft palate) and advances 25-30 mm into the PPF.'
    )
FROM concepts c
JOIN lessons l ON l.concept_id = c.id
WHERE c.id = '20000000-0000-0000-0007-000000000001'
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata, status = 'PUBLISHED';

-- BDS-GA: Muscles of Mastication & Trigeminal Motor Supply
INSERT INTO content_blocks (id, lesson_id, type, order_index, status, metadata)
SELECT 
    '20000000-0000-0000-0009-000000000002',
    l.id,
    'EXPLANATION',
    1,
    'PUBLISHED',
    jsonb_build_object(
        'title', 'Muscles of Mastication: Biomechanics, Innervation & TMJ Dynamics',
        'text', '# Muscles of Mastication (DCI CBME DA-1.2)\n\n## 1. Primary Masticatory Muscles (Branchial Arch 1 Derivatives)\nAll four primary muscles of mastication are derived from the 1st pharyngeal (mandibular) arch and innervated by the mandibular division of the trigeminal nerve (CN V3).\n\n| Muscle | Origin | Insertion | Primary Action |\n|---|---|---|---|\n| **Masseter** (Superficial & Deep) | Zygomatic arch (anterior 2/3 and posterior 1/3) | Lateral surface of mandibular ramus & angle | Powerful mandibular elevator (crushing bite force up to 700 N) |\n| **Temporalis** | Temporal fossa below inferior temporal line | Coronoid process & anterior border of ramus | Mandibular elevator; posterior horizontal fibers retract the mandible |\n| **Medial Pterygoid** | Medial surface of lateral pterygoid plate & maxillary tuberosity | Medial surface of mandibular ramus & angle | Mandibular elevator; forms pterygomasseteric sling with masseter |\n| **Lateral Pterygoid** (Superior & Inferior heads) | Infratemporal crest (Superior) / Lateral surface of lateral pterygoid plate (Inferior) | Pterygoid fovea on neck of mandible & TMJ articular disc/capsule | **Only muscle that depresses (opens) the mandible**; initiates protrusion & lateral excursions |\n\n:::trap\n**Exam Trap**: Spasm of the *lateral pterygoid* causes deviation of the chin to the contralateral side during jaw opening; acute TMJ closed lock occurs when the articular disc displaces anteriorly relative to the condylar head.\n:::'
    )
FROM concepts c
JOIN lessons l ON l.concept_id = c.id
WHERE c.id = '20000000-0000-0000-0007-000000000002'
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata, status = 'PUBLISHED';

-- BDS Grounded Quiz Block
INSERT INTO content_blocks (id, lesson_id, type, order_index, status, metadata)
SELECT 
    '20000000-0000-0000-0009-000000000003',
    l.id,
    'QUIZ',
    2,
    'PUBLISHED',
    jsonb_build_object(
        'title', 'Muscles of Mastication & TMJ Biomechanics Clinical Quiz',
        'questions', jsonb_build_array(
            jsonb_build_object(
                'question', 'A 26-year-old patient presents following a facial blow. On active mouth opening, the mandible shifts noticeably to the left side. Which muscle on the left is most likely injured or functionally impaired?',
                'options', jsonb_build_array(
                    'Lateral pterygoid muscle',
                    'Medial pterygoid muscle',
                    'Superficial head of masseter',
                    'Posterior fibers of temporalis'
                ),
                'correctIndex', 0,
                'explanation', 'The lateral pterygoid muscle is the prime mover for mandibular protrusion and depression. Unilateral contraction pulls the ipsilateral condyle forward, rotating the mandible toward the opposite side. Consequently, left lateral pterygoid weakness prevents left condyle translation, causing the chin to deviate TOWARD the affected (left) side upon opening.',
                'clinicalPearl', 'Remember: In unilateral CN V3 or lateral pterygoid lesions, the jaw deviates TOWARD the side of the lesion.'
            ),
            jsonb_build_object(
                'question', 'Which masticatory muscle forms a continuous muscular sling around the angle of the mandible with the masseter muscle to elevate the jaw?',
                'options', jsonb_build_array(
                    'Medial pterygoid muscle',
                    'Lateral pterygoid muscle',
                    'Digastric posterior belly',
                    'Mylohyoid muscle'
                ),
                'correctIndex', 0,
                'explanation', 'The masseter (on the lateral ramus/angle) and the medial pterygoid (on the medial ramus/angle) form the powerful "pterygomasseteric sling", stabilizing and forcefully elevating the mandible during the chewing cycle.',
                'clinicalPearl', 'The pterygomasseteric sling is exposed and reflected during bilateral sagittal split osteotomy (BSSO) procedures.'
            )
        )
    )
FROM concepts c
JOIN lessons l ON l.concept_id = c.id
WHERE c.id = '20000000-0000-0000-0007-000000000002'
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata, status = 'PUBLISHED';

-- 3. Seed Rich Clinical Content Blocks for AYUSH (BAMS - Dravyaguna & Panchakarma)
INSERT INTO content_blocks (id, lesson_id, type, order_index, status, metadata)
SELECT 
    '30000000-0000-0000-0009-000000000001',
    l.id,
    'EXPLANATION',
    1,
    'PUBLISHED',
    jsonb_build_object(
        'title', 'Dravyaguna Vijnana: The 5 Principles of Herbology (Rasa Panchaka)',
        'text', '# Dravyaguna Vijnana: Rasa Panchaka Framework (NCISM CBME AY-DG1)\n\n## 1. The Five Pharmacodynamic Principles (Rasa Panchaka)\nIn Ayurvedic pharmacology, the action of every medicinal substance (*Dravya*) on the human organism is governed by five fundamental parameters (*Rasa Panchaka*):\n\n1. **Rasa (Taste perception upon lingual contact)**: 6 primary tastes (Madhura, Amla, Lavana, Katu, Tikta, Kashaya).\n2. **Guna (Physical & qualitative attributes)**: 20 Gurvadi Gunas (e.g. Guru/Laghu, Sheeta/Ushna, Snigdha/Ruksha, Manda/Teekshna).\n3. **Virya (Potency / metabolic action principle)**: Ushna (heating) vs Sheeta (cooling).\n4. **Vipaka (Post-digestive transformation)**: Madhura (anabolic/Kapha-increasing), Amla (Pitta-stimulating), Katu (Vata-stimulating/catabolic).\n5. **Prabhava (Specific unaccountable pharmacological action)**: Actions that override normal Rasa-Virya logic (e.g. Madana Phala specifically induces Vamana emesis).\n\n```mermaid\ngraph LR\n  A[Dravya Ingestion] --> B[Rasa: Tongue Stage]\n  B --> C[Virya: Gastric/Metabolic Stage]\n  C --> D[Vipaka: Post-Digestive Tissue Level]\n  D --> E[Karma: Final Therapeutic Effect]\n```\n\n:::pearl\n**Clinical Pearl (Ashwagandha - Withania somnifera)**:\n- **Rasa**: Tikta, Kashaya, Madhura\n- **Guna**: Laghu, Snigdha\n- **Virya**: Ushna (Hot potency)\n- **Vipaka**: Madhura\n- **Karma**: Vata-Kapha Shamaka, Rasayana (Adaptogenic), Balya (Strength-promoting), Medhya (Neuroprotective).\n:::'
    )
FROM concepts c
JOIN lessons l ON l.concept_id = c.id
WHERE c.id = '30000000-0000-0000-0007-000000000001'
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata, status = 'PUBLISHED';

-- AYUSH BAMS Flashcards Deck
INSERT INTO content_blocks (id, lesson_id, type, order_index, status, metadata)
SELECT 
    '30000000-0000-0000-0009-000000000002',
    l.id,
    'FLASHCARD_SET',
    2,
    'PUBLISHED',
    jsonb_build_object(
        'title', 'Dravyaguna Herbology & Rasa Panchaka Mastery Deck',
        'cards', jsonb_build_array(
            jsonb_build_object(
                'front', 'What are the 6 Rasas in order of strength to mitigate Vata Dosha?',
                'back', 'Madhura (Sweet), Amla (Sour), and Lavana (Salty) pacify Vata dosha most effectively.',
                'cloze', 'The three Rasas that pacify Vata dosha are {{c1::Madhura, Amla, and Lavana}}.',
                'difficulty', 'High-Yield'
            ),
            jsonb_build_object(
                'front', 'What is the pharmacological definition of Vipaka in Dravyaguna?',
                'back', 'Vipaka is the post-digestive transformation of ingested food/herb occurring after assimilation by Jatharagni at the Dhatu level.',
                'cloze', 'The final biological transformation of Rasa after digestion is termed {{c1::Vipaka}}.',
                'difficulty', 'Core'
            ),
            jsonb_build_object(
                'front', 'What is the Rasa Panchaka of Guduchi (Tinospora cordifolia)?',
                'back', 'Rasa: Tikta, Kashaya | Guna: Guru, Snigdha | Virya: Ushna | Vipaka: Madhura | Karma: Tridosha Shamaka, Jwaraghna, Rasayana.',
                'cloze', 'Guduchi possesses {{c1::Ushna}} Virya and {{c1::Madhura}} Vipaka despite its bitter (Tikta) taste.',
                'difficulty', 'High-Yield'
            )
        )
    )
FROM concepts c
JOIN lessons l ON l.concept_id = c.id
WHERE c.id = '30000000-0000-0000-0007-000000000001'
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata, status = 'PUBLISHED';
