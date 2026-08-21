CREATE TABLE IF NOT EXISTS ccim_competency_mapping (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(20) NOT NULL UNIQUE,
    subject_code VARCHAR(20) NOT NULL,
    domain VARCHAR(150) NOT NULL,
    title TEXT NOT NULL,
    competency_level VARCHAR(30) NOT NULL CHECK (competency_level IN ('KNOWS', 'KNOWS_HOW', 'SHOWS_HOW', 'PERFORMS')),
    vertical_integration TEXT[] DEFAULT '{}',
    horizontal_integration TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO ccim_competency_mapping (code, subject_code, domain, title, competency_level, vertical_integration, horizontal_integration) VALUES
('CCIM-SS-01', 'BAMS-SS', 'Padartha Vigyana', 'Understand the basic principles of Tridosha Theory', 'KNOWS', ARRAY['BAMS-KC', 'BAMS-PK'], ARRAY['BAMS-RS', 'BAMS-KS']),
('CCIM-SS-02', 'BAMS-SS', 'Padartha Vigyana', 'Demonstrate knowledge of Panchamahabhuta', 'KNOWS_HOW', ARRAY['BAMS-DG'], ARRAY['BAMS-RS']),
('CCIM-RS-01', 'BAMS-RS', 'Rachana Sharira', 'Identify 107 Marma Points', 'SHOWS_HOW', ARRAY['BAMS-ST', 'BAMS-SKT'], ARRAY['BAMS-KS']),
('CCIM-KS-01', 'BAMS-KS', 'Kriya Sharira', 'Explain Dhatu Poshana Nyaya', 'KNOWS', ARRAY['BAMS-KC'], ARRAY['BAMS-RS']),
('CCIM-DG-01', 'BAMS-DG', 'Dravyaguna Vigyana', 'Identify 50 Important Medicinal Plants', 'SHOWS_HOW', ARRAY['BAMS-RSBK'], ARRAY['BAMS-KS']),
('CCIM-CS-01', 'BAMS-CS', 'Charaka Samhita', 'Apply Sutra Sthana Fundamentals in diagnosis', 'KNOWS_HOW', ARRAY['BAMS-KC'], ARRAY['BAMS-DG']),
('CCIM-RSBK-01', 'BAMS-RSBK', 'Rasa Shastra', 'Prepare Bhasma & Kupipakwa Kalpana', 'PERFORMS', ARRAY['BAMS-KC'], ARRAY['BAMS-DG']),
('CCIM-KC-01', 'BAMS-KC', 'Kayachikitsa', 'Manage Prameha (Diabetes)', 'PERFORMS', ARRAY['BAMS-PK'], ARRAY['BAMS-CS']),
('CCIM-ST-01', 'BAMS-ST', 'Shalya Tantra', 'Perform Ksharasutra Therapy in Fistula', 'PERFORMS', ARRAY[], ARRAY['BAMS-RS']),
('CCIM-PT-01', 'BAMS-PT', 'Prasuti Tantra', 'Conduct Garbhini Paricharya', 'SHOWS_HOW', ARRAY['BAMS-KB'], ARRAY['BAMS-ST']),
('CCIM-SKT-01', 'BAMS-SKT', 'Shalakya Tantra', 'Perform Kriya Kalpa Ocular Therapies', 'PERFORMS', ARRAY[], ARRAY['BAMS-ST']),
('CCIM-PK-01', 'BAMS-PK', 'Panchakarma', 'Perform Vamana & Virechana Protocols', 'PERFORMS', ARRAY[], ARRAY['BAMS-KC']),
('CCIM-KB-01', 'BAMS-KB', 'Kaumarbhritya', 'Perform Navajata Shishu Paricharya', 'SHOWS_HOW', ARRAY[], ARRAY['BAMS-PT'])
ON CONFLICT (code) DO NOTHING;
