CREATE TABLE IF NOT EXISTS ayush_marma_points (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    sanskrit_name VARCHAR(100) NOT NULL,
    region VARCHAR(50) NOT NULL,
    tissue_type VARCHAR(50) NOT NULL,
    prognosis VARCHAR(50) NOT NULL,
    dimension_anguli VARCHAR(50) NOT NULL,
    location_description TEXT NOT NULL,
    modern_anatomy_correlate TEXT NOT NULL,
    injury_consequences TEXT NOT NULL,
    therapeutic_application TEXT NOT NULL,
    coordinate_x REAL NOT NULL,
    coordinate_y REAL NOT NULL,
    coordinate_z REAL NOT NULL,
    view_angle VARCHAR(20) NOT NULL
);

INSERT INTO ayush_marma_points (id, name, sanskrit_name, region, tissue_type, prognosis, dimension_anguli, location_description, modern_anatomy_correlate, injury_consequences, therapeutic_application, coordinate_x, coordinate_y, coordinate_z, view_angle) VALUES
('M001', 'Adhipati', 'अधिपति', 'Head & Neck', 'Sandhi', 'Sadyah Pranahara', '1/2', 'Vertex of the head', 'Superior sagittal sinus', 'Immediate death', 'Relieves headache, stress', 0.0, 1.0, 0.0, 'Anterior'),
('M002', 'Simanta', 'सीमन्त', 'Head & Neck', 'Sandhi', 'Kalantara Pranahara', '4', 'Sutures of the skull', 'Cranial sutures', 'Death in 1-4 weeks', 'Mental disorders', 0.1, 0.9, 0.0, 'Anterior'),
('M003', 'Sthapani', 'स्थपनी', 'Head & Neck', 'Sira', 'Vishalyaghna', '1/2', 'Between eyebrows', 'Frontal vein', 'Death if foreign body is removed', 'Sinusitis, headache', 0.0, 0.8, 0.1, 'Anterior'),
('M004', 'Shringataka', 'शृङ्गाटक', 'Head & Neck', 'Sira', 'Sadyah Pranahara', '4', 'Junction of blood vessels in head', 'Cavernous sinus', 'Immediate death', 'Sensory disorders', 0.0, 0.7, 0.2, 'Anterior'),
('M005', 'Nila', 'नीला', 'Head & Neck', 'Sira', 'Vaikalyakara', '1/2', 'Sides of the neck', 'Internal jugular vein', 'Loss of voice', 'Thyroid issues', 0.1, 0.5, 0.1, 'Anterior'),
('M006', 'Manya', 'मन्या', 'Head & Neck', 'Sira', 'Vaikalyakara', '1/2', 'Sides of the neck', 'Carotid artery', 'Loss of voice', 'Thyroid issues', -0.1, 0.5, 0.1, 'Anterior'),
('M007', 'Matrika', 'मातृका', 'Head & Neck', 'Sira', 'Sadyah Pranahara', '8', 'Neck vessels', 'Major neck vessels', 'Immediate death', 'Circulatory issues', 0.0, 0.4, 0.1, 'Anterior'),
('M008', 'Hridaya', 'हृदय', 'Trunk', 'Sira', 'Sadyah Pranahara', '1', 'Heart region', 'Heart', 'Immediate death', 'Cardiac issues', 0.0, 0.1, 0.2, 'Anterior'),
('M009', 'Nabhi', 'नाभि', 'Trunk', 'Sira', 'Sadyah Pranahara', '1', 'Umbilicus', 'Umbilicus', 'Immediate death', 'Digestive issues', 0.0, -0.2, 0.3, 'Anterior'),
('M010', 'Basti', 'बस्ति', 'Trunk', 'Snayu', 'Sadyah Pranahara', '1', 'Bladder region', 'Urinary bladder', 'Immediate death', 'Urinary issues', 0.0, -0.5, 0.2, 'Anterior'),
('M011', 'Kshipra', 'क्षिप्र', 'Upper Extremity', 'Snayu', 'Kalantara Pranahara', '1/2', 'Between thumb and index finger', 'First dorsal interosseous muscle', 'Death in 1-4 weeks', 'Pain relief', 0.4, 0.2, 0.4, 'Anterior'),
('M012', 'Talahridaya', 'तलहृदय', 'Upper Extremity', 'Mamsa', 'Kalantara Pranahara', '1/2', 'Center of palm', 'Palmar aponeurosis', 'Death in 1-4 weeks', 'Hand pain', 0.4, 0.1, 0.4, 'Anterior'),
('M013', 'Kurpara', 'कूर्पर', 'Upper Extremity', 'Sandhi', 'Vaikalyakara', '1/2', 'Elbow joint', 'Elbow joint', 'Deformity of arm', 'Elbow pain', 0.3, 0.3, 0.2, 'Anterior'),
('M014', 'Urvi', 'ऊर्वी', 'Upper Extremity', 'Sira', 'Vaikalyakara', '1', 'Mid thigh/arm', 'Femoral/Brachial vessels', 'Wasting of limb', 'Circulatory issues', 0.2, 0.4, 0.1, 'Anterior'),
('M015', 'Ani', 'आणी', 'Upper Extremity', 'Snayu', 'Vaikalyakara', '1/2', 'Above knee/elbow', 'Tendons above joints', 'Swelling and stiffness', 'Joint pain', 0.2, 0.35, 0.1, 'Anterior'),
('M016', 'Guda', 'गुद', 'Trunk', 'Mamsa', 'Sadyah Pranahara', '1', 'Anal region', 'Anus', 'Immediate death', 'Constipation', 0.0, -0.6, -0.1, 'Posterior'),
('M017', 'Nitamba', 'नितम्ब', 'Trunk', 'Asthi', 'Kalantara Pranahara', '1/2', 'Pelvic region', 'Iliac crest', 'Death in 1-4 weeks', 'Hip pain', 0.2, -0.4, -0.2, 'Posterior'),
('M018', 'Kukundara', 'कुकुन्दर', 'Trunk', 'Sandhi', 'Vaikalyakara', '1/2', 'Sacroiliac region', 'Sacroiliac joint', 'Loss of sensation in lower body', 'Sciatica', 0.1, -0.4, -0.2, 'Posterior'),
('M019', 'Katikataruna', 'कटिकतरुण', 'Trunk', 'Asthi', 'Kalantara Pranahara', '1/2', 'Pelvic region', 'Ischial tuberosity', 'Death in 1-4 weeks', 'Pelvic pain', 0.1, -0.5, -0.2, 'Posterior'),
('M020', 'Gulpha', 'गुल्फ', 'Lower Extremity', 'Sandhi', 'Rujakara', '1/2', 'Ankle joint', 'Ankle joint', 'Severe pain and stiffness', 'Ankle pain', 0.1, -0.9, 0.1, 'Anterior'),
('M021', 'Janu', 'जानु', 'Lower Extremity', 'Sandhi', 'Vaikalyakara', '3', 'Knee joint', 'Knee joint', 'Limping', 'Knee pain', 0.1, -0.7, 0.1, 'Anterior'),
('M022', 'Indrabasti', 'इन्द्रबस्ति', 'Lower Extremity', 'Mamsa', 'Kalantara Pranahara', '1/2', 'Calf muscle center', 'Gastrocnemius muscle', 'Death in 1-4 weeks', 'Calf pain', 0.1, -0.8, -0.1, 'Posterior'),
('M023', 'Lohitaksha', 'लोहिताक्ष', 'Lower Extremity', 'Sira', 'Vaikalyakara', '1/2', 'Root of thigh/arm', 'Femoral/Axillary vessels', 'Paralysis', 'Circulatory issues', 0.1, -0.3, 0.1, 'Anterior'),
('M024', 'Vitapa', 'विटप', 'Lower Extremity', 'Snayu', 'Vaikalyakara', '1', 'Groin region', 'Inguinal canal', 'Impotence', 'Hernia', 0.1, -0.4, 0.1, 'Anterior'),
('M025', 'Kakshadhara', 'कक्षाधर', 'Upper Extremity', 'Snayu', 'Vaikalyakara', '1', 'Axilla', 'Brachial plexus', 'Paralysis of arm', 'Nerve issues', 0.2, 0.5, 0.1, 'Anterior')
ON CONFLICT (id) DO NOTHING;

-- Refresh healthcare_domains table lesson counts from healthcare_domain_curriculum_stats if it exists
-- Assuming a basic update pattern
-- UPDATE healthcare_domains hd
-- SET total_lessons = (SELECT SUM(lessons) FROM healthcare_domain_curriculum_stats hcs WHERE hcs.domain = hd.code)
-- WHERE EXISTS (SELECT 1 FROM healthcare_domain_curriculum_stats hcs WHERE hcs.domain = hd.code);
