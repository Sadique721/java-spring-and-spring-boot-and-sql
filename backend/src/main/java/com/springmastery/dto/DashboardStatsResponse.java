package com.springmastery.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsResponse {
    private long totalModules;
    private long totalTopics;
    private long completedTopics;
    private long inProgressTopics;
    private double overallCompletionPercentage;
    private double averageQuizScore;
    private List<TopicResponse> weakTopics;
    private List<TopicResponse> recommendedTopics;
}
