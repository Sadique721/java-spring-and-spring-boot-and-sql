package com.springmastery.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CodeExampleResponse {
    private Long id;
    private String level;
    private String title;
    private String code;
    private String language;
    private String explanation;
}
