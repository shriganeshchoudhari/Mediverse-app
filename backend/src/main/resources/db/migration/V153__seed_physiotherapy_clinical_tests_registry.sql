-- V153__seed_physiotherapy_clinical_tests_registry.sql
CREATE TABLE IF NOT EXISTS physiotherapy_clinical_tests_registry (
  id VARCHAR(50) PRIMARY KEY,
  test_name VARCHAR(150) NOT NULL,
  target_joint VARCHAR(50) NOT NULL,
  target_pathology VARCHAR(150) NOT NULL,
  patient_position TEXT NOT NULL,
  examiner_action TEXT NOT NULL,
  positive_finding TEXT NOT NULL,
  sensitivity_pct NUMERIC(5,2),
  specificity_pct NUMERIC(5,2),
  clinical_pearl TEXT NOT NULL
);

INSERT INTO physiotherapy_clinical_tests_registry (id, test_name, target_joint, target_pathology, patient_position, examiner_action, positive_finding, sensitivity_pct, specificity_pct, clinical_pearl) VALUES
('TEST-001', 'Lachman Test', 'Knee', 'ACL Tear', 'Supine, knee flexed to 20-30 degrees', 'Anterior translation of tibia on femur', 'Increased laxity or soft end feel', 85.00, 94.00, 'Gold standard for acute ACL injury.'),
('TEST-002', 'McMurray Test', 'Knee', 'Meniscal Tear', 'Supine', 'Flex and extend knee while applying rotation', 'Clicking or popping sound with pain', 70.00, 71.00, 'Specific but not very sensitive.'),
('TEST-003', 'Anterior Drawer Knee', 'Knee', 'ACL Tear', 'Supine, knee flexed 90 degrees', 'Anterior translation of tibia', 'Increased laxity', 62.00, 88.00, 'Less reliable than Lachman in acute setting.'),
('TEST-004', 'Hawkins-Kennedy', 'Shoulder', 'Subacromial Impingement', 'Sitting or standing', 'Forward flex arm to 90, internal rotation', 'Pain in subacromial space', 79.00, 59.00, 'Good screening test for impingement.'),
('TEST-005', 'Neer Test', 'Shoulder', 'Subacromial Impingement', 'Sitting or standing', 'Passive forward flexion with internal rotation', 'Pain', 75.00, 48.00, 'Compresses greater tuberosity against acromion.'),
('TEST-006', 'Empty Can Test', 'Shoulder', 'Supraspinatus Tear', 'Standing, arms 90 deg scaption', 'Resisted downward pressure', 'Weakness or pain', 74.00, 30.00, 'Also known as Jobe test.'),
('TEST-007', 'Speed Test', 'Shoulder', 'Biceps Tendinopathy', 'Standing', 'Resist shoulder forward flexion with supination', 'Pain in bicipital groove', 50.00, 67.00, 'Can also indicate SLAP lesion.'),
('TEST-008', 'Yergason Test', 'Shoulder', 'Biceps Tendinopathy', 'Sitting, elbow flexed to 90', 'Resisted supination and external rotation', 'Pain in bicipital groove', 43.00, 79.00, 'Also checks for transverse humeral ligament instability.'),
('TEST-009', 'Phalen Test', 'Wrist', 'Carpal Tunnel Syndrome', 'Sitting or standing', 'Maximal wrist flexion for 60 seconds', 'Numbness or tingling in median nerve distribution', 68.00, 73.00, 'Reverse Phalen may also be used.'),
('TEST-010', 'FABER Test', 'Hip', 'SI Joint Dysfunction / Hip Pathology', 'Supine', 'Flexion, Abduction, External Rotation of hip', 'Pain in hip or SI joint', 60.00, 18.00, 'Also known as Patrick test.'),
('TEST-011', 'Ober Test', 'Hip/Knee', 'IT Band Tightness', 'Side-lying', 'Passive extension and abduction, then let drop', 'Inability of leg to drop below horizontal', NULL, NULL, 'Stabilize pelvis to prevent compensation.'),
('TEST-012', 'Thomas Test', 'Hip', 'Hip Flexor Tightness', 'Supine', 'Bring one knee to chest', 'Opposite leg raises off table', NULL, NULL, 'Assess iliopsoas vs rectus femoris based on knee flexion.'),
('TEST-013', 'Straight Leg Raise', 'Spine/Hip', 'Sciatica / Lumbar Radiculopathy', 'Supine', 'Passive raising of extended leg', 'Radiating pain below knee', 91.00, 26.00, 'Highly sensitive for lower lumbar disc herniation.'),
('TEST-014', 'Spurling Test', 'Cervical Spine', 'Cervical Radiculopathy', 'Sitting', 'Extension, side-bending, and compression', 'Radiating pain into arm', 30.00, 93.00, 'Very specific but not sensitive.'),
('TEST-015', 'Berg Balance Scale', 'Systemic', 'Balance Impairment', 'Various', '14-item functional assessment', 'Score < 45 indicates high fall risk', 85.00, 80.00, 'Standardized test for elderly fall risk.')
ON CONFLICT(id) DO NOTHING;
