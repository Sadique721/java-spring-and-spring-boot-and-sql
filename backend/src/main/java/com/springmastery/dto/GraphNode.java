package com.springmastery.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GraphNode {
    private String id;        // Usually the slug
    private String label;     // Topic Title
    private String module;    // Module Slug
    private String difficulty;// Topic Difficulty
    private Integer val;      // Size value based on connections
}
