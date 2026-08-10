package com.springmastery.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GraphEdge {
    private String source;     // Slug of fromTopic
    private String target;     // Slug of toTopic
    private String type;       // PREREQUISITE, RELATED_TO, etc.
    private Integer weight;
}
