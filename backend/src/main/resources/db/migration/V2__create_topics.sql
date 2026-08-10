-- V2: Create topics table
CREATE TABLE IF NOT EXISTS topics (
    id BIGSERIAL PRIMARY KEY,
    slug VARCHAR(100) NOT NULL UNIQUE,
    title VARCHAR(200) NOT NULL,
    subtitle VARCHAR(300),
    module_id BIGINT NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
    difficulty VARCHAR(20) NOT NULL DEFAULT 'BEGINNER',
    estimated_minutes INTEGER,
    display_order INTEGER NOT NULL,
    content_status VARCHAR(30) DEFAULT 'DRAFT',
    completion_percentage INTEGER DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_topic_slug ON topics(slug);
CREATE INDEX IF NOT EXISTS idx_topic_module ON topics(module_id);
CREATE INDEX IF NOT EXISTS idx_topic_order ON topics(display_order);
