package com.springmastery.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "topic_relationships", indexes = {
    @Index(name = "idx_rel_from", columnList = "from_topic_id"),
    @Index(name = "idx_rel_to", columnList = "to_topic_id"),
    @Index(name = "idx_rel_type", columnList = "relationship_type")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TopicRelationship {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "from_topic_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Topic fromTopic;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "to_topic_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Topic toTopic;

    @Enumerated(EnumType.STRING)
    @Column(name = "relationship_type", nullable = false, length = 30)
    private RelationshipType relationshipType;

    @Column(length = 300)
    private String description;

    @Column(nullable = false)
    @Builder.Default
    private Integer weight = 1;

    public enum RelationshipType {
        PREREQUISITE,
        RELATED_TO,
        DEPENDS_ON,
        USED_WITH,
        PART_OF,
        IMPLEMENTS,
        EXTENDS,
        ALTERNATIVE_TO,
        REPLACED_BY,
        INTERVIEW_RELATION,
        PRODUCTION_RELATION,
        COMPOSED_WITH
    }
}
