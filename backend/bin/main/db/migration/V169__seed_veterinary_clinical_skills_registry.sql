-- Migration: V169__seed_veterinary_clinical_skills_registry
-- Description: Creates veterinary_clinical_skills_registry table and seeds at least 15 skills

CREATE TABLE IF NOT EXISTS veterinary_clinical_skills_registry (
    id VARCHAR(50) PRIMARY KEY,
    skill_name VARCHAR(150) NOT NULL,
    species_scope VARCHAR(100) NOT NULL,
    target_equipment VARCHAR(150) NOT NULL,
    indication TEXT NOT NULL,
    step_by_step_protocol TEXT NOT NULL,
    critical_safety_traps TEXT NOT NULL,
    competency_level VARCHAR(30) NOT NULL
);

INSERT INTO veterinary_clinical_skills_registry (id, skill_name, species_scope, target_equipment, indication, step_by_step_protocol, critical_safety_traps, competency_level)
VALUES
    ('SKILL-VET-001', 'Rumen Cannulation & Centesis', 'Bovine', 'Trocar and Cannula', 'Ruminal tympany, bloat', '1. Restrain animal. 2. Prep left paralumbar fossa. 3. Insert trocar firmly.', 'Avoid major blood vessels. Ensure correct side (left).', 'PERFORMS'),
    ('SKILL-VET-002', 'Equine Nasogastric Intubation', 'Equine', 'Nasogastric Tube', 'Colic, enteral fluid therapy', '1. Restrain horse. 2. Lubricate tube. 3. Pass via ventral meatus. 4. Verify in esophagus.', 'Avoid entering trachea. Never force the tube.', 'PERFORMS'),
    ('SKILL-VET-003', 'Canine GDV Trocarization & Gastropexy', 'Canine', 'Catheter, Surgical Kit', 'Gastric Dilatation-Volvulus', '1. Trocarize right side to decompress. 2. Prep for surgery. 3. Incise and perform gastropexy.', 'Risk of splenic rupture or tearing gastric wall.', 'SHOWS_HOW'),
    ('SKILL-VET-004', 'Bovine Rectal Palpation Pregnancy Diagnosis', 'Bovine', 'Palpation sleeve, Lubricant', 'Pregnancy diagnosis', '1. Restrain in chute. 2. Lubricate arm. 3. Evacuate rectum. 4. Locate cervix and uterus.', 'Avoid rectal tears. Gentle handling is key.', 'PERFORMS'),
    ('SKILL-VET-005', 'Canine Endotracheal Intubation', 'Canine', 'ET Tube, Laryngoscope', 'General anesthesia, airway management', '1. Open mouth. 2. Depress epiglottis. 3. Insert tube into trachea. 4. Inflate cuff.', 'Over-inflation of cuff causing tracheal necrosis.', 'PERFORMS'),
    ('SKILL-VET-006', 'Avian Necropsy Protocol', 'Avian', 'Necropsy kit, shears', 'Post-mortem examination for flock health', '1. Wet carcass with soapy water. 2. Reflect skin. 3. Open coelomic cavity.', 'Zoonotic risk (e.g. Chlamydia). Wear PPE.', 'PERFORMS'),
    ('SKILL-VET-007', 'Intravenous Catheterization in Jugular', 'Equine/Bovine', 'IV Catheter, clippers, scrub', 'IV fluid therapy, medication administration', '1. Clip and prep skin. 2. Raise vein. 3. Insert catheter at 30-45 degree angle.', 'Risk of hematoma or phlebitis. Ensure sterility.', 'PERFORMS'),
    ('SKILL-VET-008', 'Feline Cystocentesis', 'Feline', 'Syringe, 22G needle', 'Sterile urine collection', '1. Restrain cat in lateral or dorsal recumbency. 2. Isolate bladder. 3. Insert needle into apex.', 'Avoid major blood vessels and bowel.', 'PERFORMS'),
    ('SKILL-VET-009', 'Bovine Epidural Anesthesia', 'Bovine', '18G needle, Lidocaine', 'Obstetrical procedures, tail amputation', '1. Locate sacrococcygeal space. 2. Clip and prep. 3. Insert needle and inject.', 'Risk of introducing infection into spinal canal.', 'PERFORMS'),
    ('SKILL-VET-010', 'Canine Ovariohysterectomy (Spay)', 'Canine', 'Surgical pack, spay hook', 'Sterilization, pyometra', '1. Ventral midline incision. 2. Locate uterine horns. 3. Ligate pedicles and body. 4. Close.', 'Hemorrhage from dropped pedicles.', 'SHOWS_HOW'),
    ('SKILL-VET-011', 'Equine Castration', 'Equine', 'Emasculators, scalpel', 'Sterilization, behavioral management', '1. Sedate and provide local block. 2. Incise scrotum. 3. Emasculate cord.', 'Evisceration or severe hemorrhage.', 'SHOWS_HOW'),
    ('SKILL-VET-012', 'Small Animal CPR', 'Canine/Feline', 'Crash cart, ET tube', 'Cardiopulmonary arrest', '1. Establish airway. 2. Chest compressions (100-120/min). 3. Administer emergency drugs.', 'Inadequate compression depth or rate.', 'PERFORMS'),
    ('SKILL-VET-013', 'Bovine Teat Surgery', 'Bovine', 'Teat instruments, local block', 'Teat lacerations, obstructions', '1. Ring block teat. 2. Probe canal. 3. Perform surgery (e.g. laceration repair).', 'Stricture formation post-surgery.', 'SHOWS_HOW'),
    ('SKILL-VET-014', 'Canine Dental Prophylaxis', 'Canine', 'Ultrasonic scaler, polisher', 'Periodontal disease', '1. General anesthesia. 2. Scale supragingival and subgingival calculus. 3. Polish.', 'Thermal damage to teeth from scaler.', 'PERFORMS'),
    ('SKILL-VET-015', 'Ophthalmic Examination (Schirmer Tear Test, Fluorescein)', 'Canine/Feline', 'STT strips, Fluorescein stain, ophthalmoscope', 'KCS, corneal ulceration', '1. Perform STT before applying any drops. 2. Apply stain and wash. 3. Examine with blue light.', 'Contaminating the tip of the stain strip.', 'PERFORMS')
ON CONFLICT (id) DO NOTHING;
