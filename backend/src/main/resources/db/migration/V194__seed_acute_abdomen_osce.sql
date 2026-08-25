INSERT INTO osce_scores (id, user_id, username, scenario_id, score_percentage, completion_time_seconds, achieved_at) VALUES 
(gen_random_uuid(), '00000000-0000-0000-0001-000000000001', 'Alice Smith', 'osce-acute-abdomen', 98.50, 420, CURRENT_TIMESTAMP - INTERVAL '2 hours'),
(gen_random_uuid(), '00000000-0000-0000-0001-000000000002', 'Bob Jones', 'osce-acute-abdomen', 88.00, 500, CURRENT_TIMESTAMP - INTERVAL '1 day'),
(gen_random_uuid(), '00000000-0000-0000-0001-000000000003', 'Charlie Davis', 'osce-acute-abdomen', 100.00, 310, CURRENT_TIMESTAMP - INTERVAL '5 mins'),
(gen_random_uuid(), '00000000-0000-0000-0001-000000000004', 'Diana Evans', 'osce-acute-abdomen', 75.50, 600, CURRENT_TIMESTAMP - INTERVAL '3 days'),
(gen_random_uuid(), '00000000-0000-0000-0001-000000000005', 'Ethan Ford', 'osce-acute-abdomen', 95.00, 480, CURRENT_TIMESTAMP - INTERVAL '1 hour');
