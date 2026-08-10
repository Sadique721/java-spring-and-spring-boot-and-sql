package com.springmastery.controller;

import com.springmastery.dto.*;
import com.springmastery.service.TopicService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/topics")
@RequiredArgsConstructor
@Slf4j
public class TopicController {

    private final TopicService topicService;

    @GetMapping
    public ResponseEntity<List<TopicResponse>> getAllTopics() {
        log.info("REST request to get all topics");
        return ResponseEntity.ok(topicService.getAllTopics());
    }

    @GetMapping("/{slug}")
    public ResponseEntity<TopicDetailResponse> getTopicDetails(@PathVariable String slug) {
        log.info("REST request to get topic details for slug: {}", slug);
        return ResponseEntity.ok(topicService.getTopicDetails(slug));
    }

    @GetMapping("/{slug}/sections")
    public ResponseEntity<List<SectionResponse>> getSections(@PathVariable String slug) {
        log.info("REST request to get sections for topic: {}", slug);
        return ResponseEntity.ok(topicService.getSections(slug));
    }

    @GetMapping("/{slug}/relationships")
    public ResponseEntity<List<RelationshipResponse>> getRelationships(@PathVariable String slug) {
        log.info("REST request to get relationships for topic: {}", slug);
        return ResponseEntity.ok(topicService.getRelationships(slug));
    }

    @GetMapping("/{slug}/graph")
    public ResponseEntity<GraphData> getTopicGraph(@PathVariable String slug) {
        log.info("REST request to get knowledge graph for topic: {}", slug);
        return ResponseEntity.ok(topicService.getTopicGraph(slug));
    }

    @GetMapping("/{slug}/questions")
    public ResponseEntity<List<InterviewQuestionResponse>> getInterviewQuestions(@PathVariable String slug) {
        log.info("REST request to get interview questions for topic: {}", slug);
        return ResponseEntity.ok(topicService.getInterviewQuestions(slug));
    }

    @GetMapping("/{slug}/quiz")
    public ResponseEntity<List<QuizQuestionResponse>> getQuizQuestions(@PathVariable String slug) {
        log.info("REST request to get quiz questions for topic: {}", slug);
        return ResponseEntity.ok(topicService.getQuizQuestions(slug));
    }

    @GetMapping("/{slug}/revision")
    public ResponseEntity<RevisionNoteResponse> getRevisionNotes(@PathVariable String slug) {
        log.info("REST request to get revision notes for topic: {}", slug);
        return ResponseEntity.ok(topicService.getRevisionNotes(slug));
    }

    @GetMapping("/{slug}/code-examples")
    public ResponseEntity<List<CodeExampleResponse>> getCodeExamples(@PathVariable String slug) {
        log.info("REST request to get code examples for topic: {}", slug);
        return ResponseEntity.ok(topicService.getCodeExamples(slug));
    }

    @GetMapping("/{slug}/prerequisites")
    public ResponseEntity<List<TopicResponse>> getPrerequisites(@PathVariable String slug) {
        log.info("REST request to get prerequisites for topic: {}", slug);
        return ResponseEntity.ok(topicService.getPrerequisites(slug));
    }

    @GetMapping("/{slug}/previous")
    public ResponseEntity<TopicResponse> getPreviousTopic(@PathVariable String slug) {
        log.info("REST request to get previous topic for: {}", slug);
        TopicResponse previous = topicService.getPreviousTopic(slug);
        return previous != null ? ResponseEntity.ok(previous) : ResponseEntity.noContent().build();
    }

    @GetMapping("/{slug}/next")
    public ResponseEntity<TopicResponse> getNextTopic(@PathVariable String slug) {
        log.info("REST request to get next topic for: {}", slug);
        TopicResponse next = topicService.getNextTopic(slug);
        return next != null ? ResponseEntity.ok(next) : ResponseEntity.noContent().build();
    }
}
