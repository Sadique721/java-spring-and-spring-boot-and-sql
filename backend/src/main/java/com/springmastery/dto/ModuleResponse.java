package com.springmastery.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ModuleResponse {
    private Long id;
    private String slug;
    private String title;
    private String description;
    private String iconName;
    private Integer displayOrder;
    private Integer totalTopics;
    private Boolean isActive;
}
