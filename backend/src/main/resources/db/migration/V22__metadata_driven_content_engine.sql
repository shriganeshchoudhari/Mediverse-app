-- 1. Create Lessons Table
CREATE TABLE lessons (
    id UUID PRIMARY KEY,
    concept_id UUID NOT NULL REFERENCES concepts(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PUBLISHED',
    version INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create Content Blocks Table
CREATE TABLE content_blocks (
    id UUID PRIMARY KEY,
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- EXPLANATION, SUMMARY, DIAGRAM, THREE_D, ANIMATION, FLOWCHART, Video, QUIZ, FLASHCARD_SET
    order_index INT NOT NULL,
    content_ref VARCHAR(512),
    metadata JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create Clinical Cases Table
CREATE TABLE clinical_cases (
    id UUID PRIMARY KEY,
    concept_id UUID NOT NULL REFERENCES concepts(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    scenario_text TEXT NOT NULL,
    difficulty VARCHAR(50) NOT NULL DEFAULT 'MEDIUM',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create Curriculum References Table
CREATE TABLE curriculum_references (
    id UUID PRIMARY KEY,
    concept_id UUID NOT NULL REFERENCES concepts(id) ON DELETE CASCADE,
    citation_text TEXT NOT NULL,
    source_type VARCHAR(100) NOT NULL,
    url VARCHAR(512)
);

-- 5. Create User Bookmarks Table
CREATE TABLE user_bookmarks (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
    content_block_id UUID REFERENCES content_blocks(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, lesson_id, content_block_id)
);

-- 6. Create Revision Plans Table
CREATE TABLE revision_plans (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    schedule JSONB NOT NULL,
    next_review_dates JSONB NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 7. Opportunistic Backfill
-- Create a Lesson for each Concept that currently has Learning Objects
INSERT INTO lessons (id, concept_id, title, status, version)
SELECT 
    gen_random_uuid(), 
    c.id, 
    c.title, 
    'PUBLISHED', 
    1
FROM concepts c
WHERE EXISTS (SELECT 1 FROM learning_objects lo WHERE lo.concept_id = c.id);

-- Create Content Blocks from the legacy learning_objects payload (type TEXT -> EXPLANATION)
INSERT INTO content_blocks (id, lesson_id, type, order_index, content_ref, metadata)
SELECT 
    gen_random_uuid(), 
    l.id, 
    'EXPLANATION', 
    lo.sort_order, 
    NULL, 
    jsonb_build_object('text', lo.content_payload)
FROM learning_objects lo
JOIN lessons l ON l.concept_id = lo.concept_id
WHERE lo.object_type = 'TEXT';
