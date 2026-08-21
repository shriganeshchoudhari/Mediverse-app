-- V175__seed_public_health_policy_registry.sql

CREATE TABLE IF NOT EXISTS public_health_policy_registry (
    id VARCHAR(50) PRIMARY KEY,
    policy_name VARCHAR(150) NOT NULL,
    jurisdiction VARCHAR(50) NOT NULL,
    target_population TEXT NOT NULL,
    key_provisions TEXT NOT NULL,
    financing_mechanism VARCHAR(100) NOT NULL,
    kpi_metrics TEXT NOT NULL
);

INSERT INTO public_health_policy_registry (id, policy_name, jurisdiction, target_population, key_provisions, financing_mechanism, kpi_metrics) VALUES
('POL-001', 'Ayushman Bharat PMJAY', 'National', 'Low-income households', '5 Lakh health cover', 'Tax-funded', 'Number of hospitalizations'),
('POL-002', 'National Health Mission', 'National', 'Rural and urban poor', 'Strengthen health systems', 'Central and State grants', 'IMR, MMR reduction'),
('POL-003', 'NTEP TB Elimination', 'National', 'TB patients', 'Free diagnosis and treatment', 'Central budget', 'TB incidence rate'),
('POL-004', 'NVBDCP Malaria Elimination', 'National', 'Malaria endemic regions', 'Vector control, early diagnosis', 'Central budget', 'API < 1 per 1000'),
('POL-005', 'NABH 5th Edition Standards', 'National', 'Hospitals', 'Quality and safety standards', 'Self-funded by hospitals', 'Accredited hospitals count'),
('POL-006', 'WHO International Health Regulations IHR 2005', 'Global', 'Global population', 'Public health emergencies', 'Member state contributions', 'PHEIC declarations handled'),
('POL-007', 'National Digital Health Mission', 'National', 'All citizens', 'Health ID, health records', 'Central budget', 'Health IDs created'),
('POL-008', 'Maternal Benefit Programme (PMMVY)', 'National', 'Pregnant women', 'Cash incentive', 'Central and State grants', 'Beneficiaries paid'),
('POL-009', 'National Mental Health Programme', 'National', 'Mentally ill persons', 'Mental health services at district level', 'Central budget', 'District mental health clinics'),
('POL-010', 'National AIDS Control Programme', 'National', 'High-risk groups, PLHIV', 'Prevention, testing, ART', 'Central and Global Fund', 'New HIV infections'),
('POL-011', 'Pulse Polio Immunization', 'National', 'Children < 5 years', 'Oral polio vaccine', 'Central budget', 'Zero polio cases'),
('POL-012', 'National Tobacco Control Programme', 'National', 'General public', 'Tobacco cessation, awareness', 'Central budget', 'Tobacco prevalence rate'),
('POL-013', 'National Programme for Prevention and Control of Cancer, Diabetes, CVD and Stroke', 'National', 'Adults > 30 years', 'Screening and management of NCDs', 'Central budget', 'Screening coverage'),
('POL-014', 'Janani Suraksha Yojana', 'National', 'Pregnant women BPL', 'Cash assistance for institutional delivery', 'Central budget', 'Institutional delivery rate'),
('POL-015', 'Rashtriya Bal Swasthya Karyakram', 'National', 'Children 0-18 years', 'Screening for 4Ds', 'Central budget', 'Children screened and treated')
ON CONFLICT (id) DO NOTHING;
