package com.springmastery.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "code_examples", indexes = {
    @Index(name = "idx_code_topic", columnList = "topic_id"),
    @Index(name = "idx_code_level", columnList = "level")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CodeExample {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "topic_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Topic topic;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Level level;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String code;

    @Column(nullable = false, length = 30)
    @Builder.Default
    private String language = "java";

    @Column(columnDefinition = "TEXT")
    private String explanation;

    @Column(name = "display_order")
    @Builder.Default
    private Integer displayOrder = 1;

    public enum Level {
        BASIC, INTERMEDIATE, ADVANCED, PRODUCTION, BAD_PRACTICE, CORRECT_PRACTICE
    }
}
