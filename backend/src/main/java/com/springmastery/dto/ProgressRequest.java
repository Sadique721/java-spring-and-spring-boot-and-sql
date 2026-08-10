package com.springmastery.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProgressRequest {
    private String sessionId;
    private Integer sectionNumber;
    private Integer quizScore;
    private String status; // NOT_STARTED, IN_PROGRESS, COMPLETED
}
