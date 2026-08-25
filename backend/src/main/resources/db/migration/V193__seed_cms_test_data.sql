-- Seed 5 Mock Students for Global Medical University (Tenant 1)
INSERT INTO users (id, email, password_hash, first_name, last_name, role, current_xp, daily_streak) VALUES 
('00000000-0000-0000-0001-000000000001', 'student1@gmu.edu', '$2a$10$tZptE6xQ7F9P.41Z9G81gOuO36pGle8q2k/p7sJp3NnC1R.N3K0D2', 'Alice', 'Smith', 'STUDENT', 1200, 5),
('00000000-0000-0000-0001-000000000002', 'student2@gmu.edu', '$2a$10$tZptE6xQ7F9P.41Z9G81gOuO36pGle8q2k/p7sJp3NnC1R.N3K0D2', 'Bob', 'Jones', 'STUDENT', 850, 2),
('00000000-0000-0000-0001-000000000003', 'student3@gmu.edu', '$2a$10$tZptE6xQ7F9P.41Z9G81gOuO36pGle8q2k/p7sJp3NnC1R.N3K0D2', 'Charlie', 'Davis', 'STUDENT', 2100, 12),
('00000000-0000-0000-0001-000000000004', 'student4@gmu.edu', '$2a$10$tZptE6xQ7F9P.41Z9G81gOuO36pGle8q2k/p7sJp3NnC1R.N3K0D2', 'Diana', 'Evans', 'STUDENT', 400, 1),
('00000000-0000-0000-0001-000000000005', 'student5@gmu.edu', '$2a$10$tZptE6xQ7F9P.41Z9G81gOuO36pGle8q2k/p7sJp3NnC1R.N3K0D2', 'Ethan', 'Ford', 'STUDENT', 3400, 21)
ON CONFLICT (id) DO NOTHING;

-- Map the students to the 'Global Medical University' Tenant
INSERT INTO tenant_users (tenant_id, user_id, role) VALUES 
('60000000-0000-0000-0000-000000000001', '00000000-0000-0000-0001-000000000001', 'STUDENT'),
('60000000-0000-0000-0000-000000000001', '00000000-0000-0000-0001-000000000002', 'STUDENT'),
('60000000-0000-0000-0000-000000000001', '00000000-0000-0000-0001-000000000003', 'STUDENT'),
('60000000-0000-0000-0000-000000000001', '00000000-0000-0000-0001-000000000004', 'STUDENT'),
('60000000-0000-0000-0000-000000000001', '00000000-0000-0000-0001-000000000005', 'STUDENT')
ON CONFLICT (tenant_id, user_id) DO NOTHING;

-- Seed Mock OSCE Scores for analytics
INSERT INTO osce_scores (id, user_id, username, scenario_id, score_percentage, completion_time_seconds, achieved_at) VALUES 
(gen_random_uuid(), '00000000-0000-0000-0001-000000000001', 'Alice Smith', 'Sepsis_Protocol_01', 92.50, 450, CURRENT_TIMESTAMP - INTERVAL '2 days'),
(gen_random_uuid(), '00000000-0000-0000-0001-000000000002', 'Bob Jones', 'Sepsis_Protocol_01', 65.00, 600, CURRENT_TIMESTAMP - INTERVAL '1 day'),
(gen_random_uuid(), '00000000-0000-0000-0001-000000000003', 'Charlie Davis', 'Sepsis_Protocol_01', 98.00, 320, CURRENT_TIMESTAMP - INTERVAL '5 hours'),
(gen_random_uuid(), '00000000-0000-0000-0001-000000000001', 'Alice Smith', 'Trauma_MTP_02', 88.00, 500, CURRENT_TIMESTAMP - INTERVAL '1 day'),
(gen_random_uuid(), '00000000-0000-0000-0001-000000000005', 'Ethan Ford', 'Trauma_MTP_02', 95.50, 410, CURRENT_TIMESTAMP - INTERVAL '3 days');
