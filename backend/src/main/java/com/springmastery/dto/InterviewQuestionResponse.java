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
public class InterviewQuestionResponse {
    private Long id;
    private String difficulty;
    private String question;
    private String answer;
    private List<String> followUpQuestions;
    private String interviewTip;
    private String category;
}
