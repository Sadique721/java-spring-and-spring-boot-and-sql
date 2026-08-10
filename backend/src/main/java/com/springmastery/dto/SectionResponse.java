package com.springmastery.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SectionResponse {
    private Long id;
    private Integer sectionNumber;
    private String sectionTitle;
    private String content;
    private String contentType;
    private Boolean isApplicable;
}
