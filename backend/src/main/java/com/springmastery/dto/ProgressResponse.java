package com.springmastery.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProgressResponse {
    private Long id;
    private String sessionId;
    private Long topicId;
    private String topicSlug;
    private String topicTitle;
    private String status;
    private Integer sectionsCompleted;
    private Integer quizScore;
    private LocalDateTime lastAccessed;
}
