package com.springmastery.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TopicResponse {
    private Long id;
    private String slug;
    private String title;
    private String subtitle;
    private Long moduleId;
    private String moduleTitle;
    private String difficulty;
    private Integer estimatedMinutes;
    private Integer displayOrder;
    private String contentStatus;
    private Integer completionPercentage;
}
