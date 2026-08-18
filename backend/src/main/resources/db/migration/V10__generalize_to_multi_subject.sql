-- Generalize tables to support multiple subjects and semesters
ALTER TABLE quiz_questions ADD COLUMN subject_id VARCHAR(255) DEFAULT 'physiology';
ALTER TABLE quiz_questions ADD COLUMN semester_id INT DEFAULT 1;

ALTER TABLE progress_tracks ADD COLUMN subject_id VARCHAR(255) DEFAULT 'physiology';
ALTER TABLE progress_tracks ADD COLUMN semester_id INT DEFAULT 1;

ALTER TABLE flashcards ADD COLUMN subject_id VARCHAR(255) DEFAULT 'physiology';
ALTER TABLE flashcards ADD COLUMN semester_id INT DEFAULT 1;
