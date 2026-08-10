-- V3: Create topic_sections table (69 sections per topic)
CREATE TABLE IF NOT EXISTS topic_sections (
    id BIGSERIAL PRIMARY KEY,
    topic_id BIGINT NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    section_number INTEGER NOT NULL,
    section_title VARCHAR(200) NOT NULL,
    content TEXT,
    content_type VARCHAR(30) DEFAULT 'MARKDOWN',
    is_applicable BOOLEAN NOT NULL DEFAULT true,
    UNIQUE(topic_id, section_number)
);

CREATE INDEX IF NOT EXISTS idx_section_topic ON topic_sections(topic_id);
CREATE INDEX IF NOT EXISTS idx_section_number ON topic_sections(topic_id, section_number);
