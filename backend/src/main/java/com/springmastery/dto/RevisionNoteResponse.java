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
public class RevisionNoteResponse {
    private Long id;
    private String content;
    private List<String> keyPoints;
    private List<String> memoryTricks;
}
