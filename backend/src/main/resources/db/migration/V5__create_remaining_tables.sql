-- V5: Code examples
CREATE TABLE IF NOT EXISTS code_examples (
    id BIGSERIAL PRIMARY KEY,
    topic_id BIGINT NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    level VARCHAR(20) NOT NULL,
    title VARCHAR(200) NOT NULL,
    code TEXT NOT NULL,
    language VARCHAR(30) NOT NULL DEFAULT 'java',
    explanation TEXT,
    display_order INTEGER DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_code_topic ON code_examples(topic_id);

-- V6: Interview questions
CREATE TABLE IF NOT EXISTS interview_questions (
    id BIGSERIAL PRIMARY KEY,
    topic_id BIGINT NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    difficulty VARCHAR(20) NOT NULL DEFAULT 'INTERMEDIATE',
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    follow_up_questions JSONB,
    interview_tip TEXT,
    category VARCHAR(30),
    display_order INTEGER DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_iq_topic ON interview_questions(topic_id);
CREATE INDEX IF NOT EXISTS idx_iq_difficulty ON interview_questions(difficulty);

-- V7: Quiz questions
CREATE TABLE IF NOT EXISTS quiz_questions (
    id BIGSERIAL PRIMARY KEY,
    topic_id BIGINT NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    options JSONB NOT NULL,
    correct_answer_index INTEGER NOT NULL,
    explanation TEXT,
    difficulty VARCHAR(20) NOT NULL DEFAULT 'INTERMEDIATE',
    display_order INTEGER DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_qq_topic ON quiz_questions(topic_id);

-- V8: Revision notes
CREATE TABLE IF NOT EXISTS revision_notes (
    id BIGSERIAL PRIMARY KEY,
    topic_id BIGINT NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    content TEXT,
    key_points JSONB,
    memory_tricks JSONB
);

CREATE INDEX IF NOT EXISTS idx_rn_topic ON revision_notes(topic_id);

-- V9: Learning progress
CREATE TABLE IF NOT EXISTS learning_progress (
    id BIGSERIAL PRIMARY KEY,
    session_id VARCHAR(100),
    topic_id BIGINT NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'NOT_STARTED',
    sections_completed INTEGER DEFAULT 0,
    quiz_score INTEGER,
    last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_lp_topic ON learning_progress(topic_id);
CREATE INDEX IF NOT EXISTS idx_lp_session ON learning_progress(session_id);
