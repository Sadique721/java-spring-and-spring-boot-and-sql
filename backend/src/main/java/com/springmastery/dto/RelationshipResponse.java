package com.springmastery.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RelationshipResponse {
    private Long id;
    private Long fromTopicId;
    private String fromTopicTitle;
    private String fromTopicSlug;
    private Long toTopicId;
    private String toTopicTitle;
    private String toTopicSlug;
    private String relationshipType;
    private String description;
    private Integer weight;
}
