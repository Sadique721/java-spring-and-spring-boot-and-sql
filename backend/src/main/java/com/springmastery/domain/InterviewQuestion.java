package com.springmastery.domain;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.List;

@Entity
@Table(name = "interview_questions", indexes = {
    @Index(name = "idx_iq_topic", columnList = "topic_id"),
    @Index(name = "idx_iq_difficulty", columnList = "difficulty"),
    @Index(name = "idx_iq_category", columnList = "category")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InterviewQuestion {

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
    @Builder.Default
    private Difficulty difficulty = Difficulty.INTERMEDIATE;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String question;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String answer;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "follow_up_questions", columnDefinition = "jsonb")
    private List<String> followUpQuestions;

    @Column(name = "interview_tip", columnDefinition = "TEXT")
    private String interviewTip;

    @Enumerated(EnumType.STRING)
    @Column(length = 30)
    private Category category;

    @Column(name = "display_order")
    @Builder.Default
    private Integer displayOrder = 1;

    public enum Difficulty {
        BEGINNER, INTERMEDIATE, ADVANCED, TRICKY, SCENARIO, ARCHITECTURE
    }

    public enum Category {
        CONCEPTUAL, CODING, SCENARIO, ARCHITECTURE, DEBUGGING, PRODUCTION, HR_TECHNICAL
    }
}
