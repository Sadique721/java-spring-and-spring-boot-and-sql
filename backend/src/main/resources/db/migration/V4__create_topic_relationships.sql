-- V4: Create topic_relationships table (knowledge graph edges)
CREATE TABLE IF NOT EXISTS topic_relationships (
    id BIGSERIAL PRIMARY KEY,
    from_topic_id BIGINT NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    to_topic_id BIGINT NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    relationship_type VARCHAR(30) NOT NULL,
    description VARCHAR(300),
    weight INTEGER NOT NULL DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_rel_from ON topic_relationships(from_topic_id);
CREATE INDEX IF NOT EXISTS idx_rel_to ON topic_relationships(to_topic_id);
CREATE INDEX IF NOT EXISTS idx_rel_type ON topic_relationships(relationship_type);
