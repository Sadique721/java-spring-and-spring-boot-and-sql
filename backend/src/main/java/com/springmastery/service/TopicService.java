package com.springmastery.service;

import com.springmastery.domain.*;
import com.springmastery.dto.*;
import com.springmastery.exception.ResourceNotFoundException;
import com.springmastery.mapper.ObjectMapper;
import com.springmastery.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class TopicService {

    private final TopicRepository topicRepository;
    private final TopicSectionRepository sectionRepository;
    private final CodeExampleRepository codeExampleRepository;
    private final InterviewQuestionRepository interviewQuestionRepository;
    private final QuizQuestionRepository quizQuestionRepository;
    private final RevisionNoteRepository revisionNoteRepository;
    private final TopicRelationshipRepository relationshipRepository;
    private final KnowledgeGraphService knowledgeGraphService;
    private final ObjectMapper objectMapper;

    public List<TopicResponse> getAllTopics() {
        log.info("Fetching all topics");
        return objectMapper.toTopicResponseList(topicRepository.findAll());
    }

    public List<TopicResponse> getTopicsByModuleSlug(String moduleSlug) {
        log.info("Fetching topics for module slug: {}", moduleSlug);
        List<Topic> topics = topicRepository.findByModuleSlug(moduleSlug);
        return objectMapper.toTopicResponseList(topics);
    }

    public TopicDetailResponse getTopicDetails(String slug) {
        log.info("Fetching complete topic details for slug: {}", slug);
        Topic topic = findTopic(slug);

        List<SectionResponse> sections = sectionRepository.findByTopicIdOrderBySectionNumberAsc(topic.getId())
                .stream().map(objectMapper::toResponse).collect(Collectors.toList());

        List<CodeExampleResponse> codeExamples = codeExampleRepository.findByTopicIdOrderByDisplayOrderAsc(topic.getId())
                .stream().map(objectMapper::toResponse).collect(Collectors.toList());

        List<InterviewQuestionResponse> interviewQuestions = interviewQuestionRepository.findByTopicIdOrderByDisplayOrderAsc(topic.getId())
                .stream().map(objectMapper::toResponse).collect(Collectors.toList());

        List<QuizQuestionResponse> quizQuestions = quizQuestionRepository.findByTopicIdOrderByDisplayOrderAsc(topic.getId())
                .stream().map(objectMapper::toResponse).collect(Collectors.toList());

        RevisionNoteResponse revisionNotes = revisionNoteRepository.findByTopicId(topic.getId())
                .map(objectMapper::toResponse).orElse(null);

        List<RelationshipResponse> relationships = relationshipRepository.findActiveGraphEdgesByTopicSlug(slug)
                .stream().map(objectMapper::toResponse).collect(Collectors.toList());

        List<TopicResponse> prerequisites = relationshipRepository.findByToTopicId(topic.getId()).stream()
                .filter(r -> r.getRelationshipType() == TopicRelationship.RelationshipType.PREREQUISITE)
                .map(r -> objectMapper.toResponse(r.getFromTopic()))
                .collect(Collectors.toList());

        TopicResponse previousTopic = getPreviousTopic(slug);
        TopicResponse nextTopic = getNextTopic(slug);

        return TopicDetailResponse.builder()
                .id(topic.getId())
                .slug(topic.getSlug())
                .title(topic.getTitle())
                .subtitle(topic.getSubtitle())
                .moduleId(topic.getModule() != null ? topic.getModule().getId() : null)
                .moduleSlug(topic.getModule() != null ? topic.getModule().getSlug() : null)
                .moduleTitle(topic.getModule() != null ? topic.getModule().getTitle() : null)
                .difficulty(topic.getDifficulty().name())
                .estimatedMinutes(topic.getEstimatedMinutes())
                .displayOrder(topic.getDisplayOrder())
                .contentStatus(topic.getContentStatus().name())
                .completionPercentage(topic.getCompletionPercentage())
                .sections(sections)
                .codeExamples(codeExamples)
                .interviewQuestions(interviewQuestions)
                .quizQuestions(quizQuestions)
                .revisionNotes(revisionNotes)
                .relationships(relationships)
                .prerequisites(prerequisites)
                .previousTopic(previousTopic)
                .nextTopic(nextTopic)
                .build();
    }

    public List<SectionResponse> getSections(String slug) {
        log.info("Fetching sections for topic: {}", slug);
        Topic topic = findTopic(slug);
        return sectionRepository.findByTopicIdOrderBySectionNumberAsc(topic.getId())
                .stream().map(objectMapper::toResponse).collect(Collectors.toList());
    }

    public List<RelationshipResponse> getRelationships(String slug) {
        log.info("Fetching relationships for topic: {}", slug);
        findTopic(slug);
        return relationshipRepository.findActiveGraphEdgesByTopicSlug(slug)
                .stream().map(objectMapper::toResponse).collect(Collectors.toList());
    }

    public GraphData getTopicGraph(String slug) {
        log.info("Fetching knowledge graph for topic: {}", slug);
        findTopic(slug);
        return knowledgeGraphService.getTopicSubGraph(slug);
    }

    public List<InterviewQuestionResponse> getInterviewQuestions(String slug) {
        log.info("Fetching interview questions for topic: {}", slug);
        Topic topic = findTopic(slug);
        return interviewQuestionRepository.findByTopicIdOrderByDisplayOrderAsc(topic.getId())
                .stream().map(objectMapper::toResponse).collect(Collectors.toList());
    }

    public List<QuizQuestionResponse> getQuizQuestions(String slug) {
        log.info("Fetching quiz questions for topic: {}", slug);
        Topic topic = findTopic(slug);
        return quizQuestionRepository.findByTopicIdOrderByDisplayOrderAsc(topic.getId())
                .stream().map(objectMapper::toResponse).collect(Collectors.toList());
    }

    public RevisionNoteResponse getRevisionNotes(String slug) {
        log.info("Fetching revision notes for topic: {}", slug);
        Topic topic = findTopic(slug);
        return revisionNoteRepository.findByTopicId(topic.getId())
                .map(objectMapper::toResponse).orElse(null);
    }

    public List<CodeExampleResponse> getCodeExamples(String slug) {
        log.info("Fetching code examples for topic: {}", slug);
        Topic topic = findTopic(slug);
        return codeExampleRepository.findByTopicIdOrderByDisplayOrderAsc(topic.getId())
                .stream().map(objectMapper::toResponse).collect(Collectors.toList());
    }

    public List<TopicResponse> getPrerequisites(String slug) {
        log.info("Fetching prerequisites for topic: {}", slug);
        Topic topic = findTopic(slug);
        return relationshipRepository.findByToTopicId(topic.getId()).stream()
                .filter(r -> r.getRelationshipType() == TopicRelationship.RelationshipType.PREREQUISITE)
                .map(r -> objectMapper.toResponse(r.getFromTopic()))
                .collect(Collectors.toList());
    }

    public TopicResponse getPreviousTopic(String slug) {
        log.info("Fetching previous topic for: {}", slug);
        return getAdjacentTopic(slug, false);
    }

    public TopicResponse getNextTopic(String slug) {
        log.info("Fetching next topic for: {}", slug);
        return getAdjacentTopic(slug, true);
    }

    private TopicResponse getAdjacentTopic(String slug, boolean next) {
        Topic topic = findTopic(slug);
        if (topic.getModule() == null) {
            return null;
        }
        int targetOrder = topic.getDisplayOrder() + (next ? 1 : -1);
        Optional<Topic> adjacent = topicRepository.findByModuleIdAndDisplayOrder(
                topic.getModule().getId(), targetOrder);
        return adjacent.map(objectMapper::toResponse).orElse(null);
    }

    private Topic findTopic(String slug) {
        return topicRepository.findBySlugWithModule(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Topic", "slug", slug));
    }
}
