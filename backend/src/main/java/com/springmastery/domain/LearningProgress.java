package com.springmastery.domain;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "learning_progress", indexes = {
    @Index(name = "idx_lp_topic", columnList = "topic_id"),
    @Index(name = "idx_lp_session", columnList = "session_id")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LearningProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "session_id", length = 100)
    private String sessionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "topic_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Topic topic;

    @Column(nullable = false, length = 20)
    @Builder.Default
    private String status = "NOT_STARTED";

    @Column(name = "sections_completed")
    @Builder.Default
    private Integer sectionsCompleted = 0;

    @Column(name = "quiz_score")
    private Integer quizScore;

    @Column(name = "last_accessed")
    private LocalDateTime lastAccessed;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
