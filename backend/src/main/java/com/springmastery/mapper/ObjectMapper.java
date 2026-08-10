package com.springmastery.mapper;

import com.springmastery.domain.*;
import com.springmastery.domain.Module;
import com.springmastery.dto.*;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class ObjectMapper {

    public ModuleResponse toResponse(Module module) {
        if (module == null) return null;
        return ModuleResponse.builder()
                .id(module.getId())
                .slug(module.getSlug())
                .title(module.getTitle())
                .description(module.getDescription())
                .iconName(module.getIconName())
                .displayOrder(module.getDisplayOrder())
                .totalTopics(module.getTotalTopics())
                .isActive(module.getIsActive())
                .build();
    }

    public TopicResponse toResponse(Topic topic) {
        if (topic == null) return null;
        return TopicResponse.builder()
                .id(topic.getId())
                .slug(topic.getSlug())
                .title(topic.getTitle())
                .subtitle(topic.getSubtitle())
                .moduleId(topic.getModule() != null ? topic.getModule().getId() : null)
                .moduleTitle(topic.getModule() != null ? topic.getModule().getTitle() : null)
                .difficulty(topic.getDifficulty().name())
                .estimatedMinutes(topic.getEstimatedMinutes())
                .displayOrder(topic.getDisplayOrder())
                .contentStatus(topic.getContentStatus().name())
                .completionPercentage(topic.getCompletionPercentage())
                .build();
    }

    public SectionResponse toResponse(TopicSection section) {
        if (section == null) return null;
        return SectionResponse.builder()
                .id(section.getId())
                .sectionNumber(section.getSectionNumber())
                .sectionTitle(section.getSectionTitle())
                .content(section.getContent())
                .contentType(section.getContentType().name())
                .isApplicable(section.getIsApplicable())
                .build();
    }

    public CodeExampleResponse toResponse(CodeExample example) {
        if (example == null) return null;
        return CodeExampleResponse.builder()
                .id(example.getId())
                .level(example.getLevel().name())
                .title(example.getTitle())
                .code(example.getCode())
                .language(example.getLanguage())
                .explanation(example.getExplanation())
                .build();
    }

    public InterviewQuestionResponse toResponse(InterviewQuestion question) {
        if (question == null) return null;
        return InterviewQuestionResponse.builder()
                .id(question.getId())
                .difficulty(question.getDifficulty().name())
                .question(question.getQuestion())
                .answer(question.getAnswer())
                .followUpQuestions(question.getFollowUpQuestions())
                .interviewTip(question.getInterviewTip())
                .category(question.getCategory() != null ? question.getCategory().name() : null)
                .build();
    }

    public QuizQuestionResponse toResponse(QuizQuestion question) {
        if (question == null) return null;
        return QuizQuestionResponse.builder()
                .id(question.getId())
                .question(question.getQuestion())
                .options(question.getOptions())
                .correctAnswerIndex(question.getCorrectAnswerIndex())
                .explanation(question.getExplanation())
                .difficulty(question.getDifficulty().name())
                .build();
    }

    public RevisionNoteResponse toResponse(RevisionNote note) {
        if (note == null) return null;
        return RevisionNoteResponse.builder()
                .id(note.getId())
                .content(note.getContent())
                .keyPoints(note.getKeyPoints())
                .memoryTricks(note.getMemoryTricks())
                .build();
    }

    public RelationshipResponse toResponse(TopicRelationship relationship) {
        if (relationship == null) return null;
        return RelationshipResponse.builder()
                .id(relationship.getId())
                .fromTopicId(relationship.getFromTopic() != null ? relationship.getFromTopic().getId() : null)
                .fromTopicTitle(relationship.getFromTopic() != null ? relationship.getFromTopic().getTitle() : null)
                .fromTopicSlug(relationship.getFromTopic() != null ? relationship.getFromTopic().getSlug() : null)
                .toTopicId(relationship.getToTopic() != null ? relationship.getToTopic().getId() : null)
                .toTopicTitle(relationship.getToTopic() != null ? relationship.getToTopic().getTitle() : null)
                .toTopicSlug(relationship.getToTopic() != null ? relationship.getToTopic().getSlug() : null)
                .relationshipType(relationship.getRelationshipType().name())
                .description(relationship.getDescription())
                .weight(relationship.getWeight())
                .build();
    }

    public ProgressResponse toResponse(LearningProgress progress) {
        if (progress == null) return null;
        return ProgressResponse.builder()
                .id(progress.getId())
                .sessionId(progress.getSessionId())
                .topicId(progress.getTopic() != null ? progress.getTopic().getId() : null)
                .topicSlug(progress.getTopic() != null ? progress.getTopic().getSlug() : null)
                .topicTitle(progress.getTopic() != null ? progress.getTopic().getTitle() : null)
                .status(progress.getStatus())
                .sectionsCompleted(progress.getSectionsCompleted())
                .quizScore(progress.getQuizScore())
                .lastAccessed(progress.getLastAccessed())
                .build();
    }

    public List<ModuleResponse> toModuleResponseList(List<Module> modules) {
        if (modules == null) return Collections.emptyList();
        return modules.stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<TopicResponse> toTopicResponseList(List<Topic> topics) {
        if (topics == null) return Collections.emptyList();
        return topics.stream().map(this::toResponse).collect(Collectors.toList());
    }
}
