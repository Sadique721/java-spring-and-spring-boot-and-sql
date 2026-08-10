package com.springmastery.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "topic_sections", indexes = {
    @Index(name = "idx_section_topic", columnList = "topic_id"),
    @Index(name = "idx_section_number", columnList = "topic_id, section_number", unique = true)
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TopicSection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "topic_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Topic topic;

    @Column(name = "section_number", nullable = false)
    private Integer sectionNumber;

    @Column(name = "section_title", nullable = false, length = 200)
    private String sectionTitle;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(name = "content_type", length = 30)
    @Builder.Default
    private ContentType contentType = ContentType.MARKDOWN;

    @Column(name = "is_applicable", nullable = false)
    @Builder.Default
    private Boolean isApplicable = true;

    public enum ContentType {
        MARKDOWN, HTML, CODE, DIAGRAM, TABLE, LIST
    }
}
