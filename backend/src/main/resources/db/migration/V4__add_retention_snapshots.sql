CREATE TABLE IF NOT EXISTS retention_snapshots (
    id UUID PRIMARY KEY,
    snapshot_date DATE NOT NULL,
    total_users BIGINT NOT NULL,
    active_users_today BIGINT NOT NULL,
    average_xp DOUBLE PRECISION NOT NULL,
    average_streak DOUBLE PRECISION NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
