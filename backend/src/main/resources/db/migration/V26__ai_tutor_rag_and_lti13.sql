-- V26: AI Socratic Tutor Sessions & IMS Global LTI 1.3 Advantage Registry

CREATE TABLE IF NOT EXISTS ai_socratic_chat_sessions (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    topic_title VARCHAR(200) NOT NULL,
    current_chapter_id VARCHAR(100),
    total_tokens_consumed INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ai_chat_sessions_user ON ai_socratic_chat_sessions(user_id);

CREATE TABLE IF NOT EXISTS ai_socratic_chat_messages (
    id UUID PRIMARY KEY,
    session_id UUID NOT NULL REFERENCES ai_socratic_chat_sessions(id) ON DELETE CASCADE,
    sender VARCHAR(20) NOT NULL, -- USER, ASSISTANT, SYSTEM
    message_content TEXT NOT NULL,
    citations_json JSONB,
    tokens_used INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ai_chat_messages_session ON ai_socratic_chat_messages(session_id);

CREATE TABLE IF NOT EXISTS lti_platforms (
    id UUID PRIMARY KEY,
    platform_issuer VARCHAR(500) UNIQUE NOT NULL, -- e.g. https://canvas.instructure.com
    client_id VARCHAR(255) NOT NULL,
    auth_login_url VARCHAR(500) NOT NULL,
    jwks_url VARCHAR(500) NOT NULL,
    deployment_id VARCHAR(255),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS lti_grade_sync_logs (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    platform_id UUID NOT NULL REFERENCES lti_platforms(id) ON DELETE CASCADE,
    assignment_id VARCHAR(255) NOT NULL,
    score_given NUMERIC(5, 2) NOT NULL,
    score_maximum NUMERIC(5, 2) NOT NULL,
    sync_status VARCHAR(50) NOT NULL, -- PENDING, SUCCESS, FAILED
    error_message TEXT,
    synced_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_lti_grade_sync_user ON lti_grade_sync_logs(user_id);
CREATE INDEX idx_lti_grade_sync_platform ON lti_grade_sync_logs(platform_id);
