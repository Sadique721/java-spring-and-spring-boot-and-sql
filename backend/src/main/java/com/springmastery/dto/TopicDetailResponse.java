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
public class TopicDetailResponse {
    private Long id;
    private String slug;
    private String title;
    private String subtitle;
    private Long moduleId;
    private String moduleSlug;
    private String moduleTitle;
    private String difficulty;
    private Integer estimatedMinutes;
    private Integer displayOrder;
    private String contentStatus;
    private Integer completionPercentage;
    
    private List<SectionResponse> sections;
    private List<CodeExampleResponse> codeExamples;
    private List<InterviewQuestionResponse> interviewQuestions;
    private List<QuizQuestionResponse> quizQuestions;
    private RevisionNoteResponse revisionNotes;
    
    private List<RelationshipResponse> relationships;
    private List<TopicResponse> prerequisites;
    
    private TopicResponse previousTopic;
    private TopicResponse nextTopic;
}
