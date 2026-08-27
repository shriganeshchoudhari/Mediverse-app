CREATE TABLE study_groups (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP NOT NULL
);

CREATE TABLE study_group_members (
    study_group_id UUID NOT NULL,
    user_id UUID NOT NULL,
    PRIMARY KEY (study_group_id, user_id),
    CONSTRAINT fk_sgm_study_group FOREIGN KEY (study_group_id) REFERENCES study_groups(id) ON DELETE CASCADE,
    CONSTRAINT fk_sgm_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
