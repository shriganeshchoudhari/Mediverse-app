-- Drop basic hierarchy tables from V11
DROP TABLE IF EXISTS learning_objects CASCADE;
DROP TABLE IF EXISTS curriculum_chapters CASCADE;
DROP TABLE IF EXISTS curriculum_subjects CASCADE;
DROP TABLE IF EXISTS curricula CASCADE;

-- 1. Curricula Table
CREATE TABLE curricula (
    id UUID PRIMARY KEY,
    code VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Years Table
CREATE TABLE curriculum_years (
    id UUID PRIMARY KEY,
    curriculum_id UUID NOT NULL REFERENCES curricula(id) ON DELETE CASCADE,
    year_number INT NOT NULL,
    UNIQUE(curriculum_id, year_number)
);

-- 3. Semesters Table
CREATE TABLE semesters (
    id UUID PRIMARY KEY,
    year_id UUID NOT NULL REFERENCES curriculum_years(id) ON DELETE CASCADE,
    semester_number INT NOT NULL,
    UNIQUE(year_id, semester_number)
);

-- 4. Subjects Table
CREATE TABLE subjects (
    id UUID PRIMARY KEY,
    semester_id UUID NOT NULL REFERENCES semesters(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    code VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL
);

-- 5. Units Table
CREATE TABLE units (
    id UUID PRIMARY KEY,
    subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    sort_order INT NOT NULL
);

-- 6. Chapters Table
CREATE TABLE chapters (
    id UUID PRIMARY KEY,
    unit_id UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    sort_order INT NOT NULL
);

-- 7. Topics Table
CREATE TABLE topics (
    id UUID PRIMARY KEY,
    chapter_id UUID NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    sort_order INT NOT NULL
);

-- 8. Concepts Table
CREATE TABLE concepts (
    id UUID PRIMARY KEY,
    topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    sort_order INT NOT NULL
);

-- 9. Learning Objects Table
CREATE TABLE learning_objects (
    id UUID PRIMARY KEY,
    concept_id UUID NOT NULL REFERENCES concepts(id) ON DELETE CASCADE,
    object_type VARCHAR(50) NOT NULL,
    content_payload TEXT NOT NULL,
    sort_order INT NOT NULL
);
