-- Create OSCE Scores Table
CREATE TABLE osce_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL, -- Logical reference to standard users table
    username VARCHAR(100) NOT NULL, -- Denormalized for fast leaderboard reads
    avatar_url VARCHAR(255),
    scenario_id VARCHAR(100) NOT NULL, -- e.g., 'osce-appendicitis-01'
    score_percentage NUMERIC(5,2) NOT NULL, -- 0.00 to 100.00
    completion_time_seconds INT NOT NULL,
    achieved_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for fast leaderboard querying (Highest score first, then fastest time)
CREATE INDEX idx_osce_leaderboard ON osce_scores (scenario_id, score_percentage DESC, completion_time_seconds ASC);

-- Seed Mock Leaderboard Data
INSERT INTO osce_scores (user_id, username, scenario_id, score_percentage, completion_time_seconds)
VALUES 
('11111111-1111-1111-1111-111111111111', 'Dr_House', 'osce-acute-abdomen', 98.50, 245),
('22222222-2222-2222-2222-222222222222', 'MedStudent99', 'osce-acute-abdomen', 95.00, 310),
('33333333-3333-3333-3333-333333333333', 'FutureSurgeon', 'osce-acute-abdomen', 95.00, 420),
('44444444-4444-4444-4444-444444444444', 'AnatomyGeek', 'osce-acute-abdomen', 88.00, 290),
('55555555-5555-5555-5555-555555555555', 'ClinicalNinja', 'osce-acute-abdomen', 82.50, 450);
