CREATE TABLE curricula (
    id UUID PRIMARY KEY,
    code VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE curriculum_subjects (
    id UUID PRIMARY KEY,
    curriculum_id UUID NOT NULL REFERENCES curricula(id) ON DELETE CASCADE,
    semester_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL -- Pre-Clinical, Para-Clinical, Clinical
);

CREATE TABLE curriculum_chapters (
    id UUID PRIMARY KEY,
    subject_id UUID NOT NULL REFERENCES curriculum_subjects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    sort_order INT NOT NULL
);

CREATE TABLE learning_objects (
    id UUID PRIMARY KEY,
    chapter_id UUID NOT NULL REFERENCES curriculum_chapters(id) ON DELETE CASCADE,
    object_type VARCHAR(50) NOT NULL, -- TEXT, SIMULATION, 3D_MODEL, QUIZ, FLASHCARD
    content_payload TEXT NOT NULL,
    sort_order INT NOT NULL
);
