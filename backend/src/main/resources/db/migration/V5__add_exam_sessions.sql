CREATE TABLE exam_sessions (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id),
    section_ids JSONB,
    score INT NOT NULL,
    total_questions INT NOT NULL,
    time_taken_seconds INT,
    completed_at TIMESTAMP NOT NULL
);
