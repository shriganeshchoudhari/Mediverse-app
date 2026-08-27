-- Phase 3: CMS content review workflow
-- Adds an audit trail for lesson review/approval decisions.
-- User.role continues to be a free-text column; valid values are now
-- documented in com.curiolearn.user.Roles (application-level contract).

CREATE TABLE content_reviews (
    id UUID PRIMARY KEY,
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    reviewer_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    decision VARCHAR(50) NOT NULL,      -- APPROVED, REJECTED
    comments TEXT,
    lesson_version_reviewed INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_content_reviews_lesson_id ON content_reviews(lesson_id);
CREATE INDEX idx_content_reviews_reviewer_id ON content_reviews(reviewer_id);
