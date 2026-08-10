package com.springmastery.service;

import com.springmastery.domain.LearningProgress;
import com.springmastery.domain.Topic;
import com.springmastery.dto.DashboardStatsResponse;
import com.springmastery.dto.ProgressRequest;
import com.springmastery.dto.ProgressResponse;
import com.springmastery.dto.TopicResponse;
import com.springmastery.mapper.ObjectMapper;
import com.springmastery.repository.LearningProgressRepository;
import com.springmastery.repository.ModuleRepository;
import com.springmastery.repository.TopicRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class LearningProgressService {

    private final LearningProgressRepository progressRepository;
    private final TopicRepository topicRepository;
    private final ModuleRepository moduleRepository;
    private final ObjectMapper objectMapper;

    public ProgressResponse updateProgress(String topicSlug, ProgressRequest request) {
        log.info("Updating progress for topic: {} session: {}", topicSlug, request.getSessionId());
        Topic topic = topicRepository.findBySlug(topicSlug)
                .orElseThrow(() -> new RuntimeException("Topic not found with slug: " + topicSlug));

        Optional<LearningProgress> existing = progressRepository.findBySessionIdAndTopicId(
                request.getSessionId(), topic.getId());

        LearningProgress progress;
        if (existing.isPresent()) {
            progress = existing.get();
            if (request.getStatus() != null) progress.setStatus(request.getStatus());
            if (request.getSectionNumber() != null) {
                progress.setSectionsCompleted(Math.max(progress.getSectionsCompleted(), request.getSectionNumber()));
            }
            if (request.getQuizScore() != null) {
                progress.setQuizScore(Math.max(progress.getQuizScore() != null ? progress.getQuizScore() : 0, request.getQuizScore()));
            }
            progress.setLastAccessed(LocalDateTime.now());
        } else {
            progress = LearningProgress.builder()
                    .sessionId(request.getSessionId())
                    .topic(topic)
                    .status(request.getStatus() != null ? request.getStatus() : "IN_PROGRESS")
                    .sectionsCompleted(request.getSectionNumber() != null ? request.getSectionNumber() : 1)
                    .quizScore(request.getQuizScore())
                    .lastAccessed(LocalDateTime.now())
                    .build();
        }

        LearningProgress saved = progressRepository.save(progress);
        
        // Dynamically update topic completion percentage
        int completedSectionsCount = saved.getSectionsCompleted();
        int completionPercent = (int) ((completedSectionsCount / 69.0) * 100);
        topic.setCompletionPercentage(Math.min(100, completionPercent));
        if (topic.getCompletionPercentage() == 100 && !"COMPLETED".equals(saved.getStatus())) {
            saved.setStatus("COMPLETED");
            progressRepository.save(saved);
        }
        topicRepository.save(topic);

        return objectMapper.toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<ProgressResponse> getSessionProgress(String sessionId) {
        log.info("Fetching progress list for session: {}", sessionId);
        return progressRepository.findBySessionIdWithTopic(sessionId).stream()
                .map(objectMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public DashboardStatsResponse getDashboardStats(String sessionId) {
        log.info("Generating dashboard statistics for session: {}", sessionId);
        long totalModules = moduleRepository.countAllModules();
        long totalTopics = topicRepository.count();
        long completedTopics = progressRepository.countCompletedTopicsBySessionId(sessionId);
        long inProgressTopics = progressRepository.countInProgressTopicsBySessionId(sessionId);

        double overallPercent = totalTopics > 0 ? ((double) completedTopics / totalTopics) * 100 : 0.0;

        List<LearningProgress> allProgress = progressRepository.findBySessionId(sessionId);
        double avgQuiz = allProgress.stream()
                .filter(p -> p.getQuizScore() != null)
                .mapToInt(LearningProgress::getQuizScore)
                .average()
                .orElse(0.0);

        // Identify weak topics (quiz score < 60)
        List<TopicResponse> weakTopics = allProgress.stream()
                .filter(p -> p.getQuizScore() != null && p.getQuizScore() < 60)
                .map(p -> objectMapper.toResponse(p.getTopic()))
                .collect(Collectors.toList());

        // Recommended topics: pick top 3 incomplete topics with displayOrder = 1 or next in displayOrder
        List<TopicResponse> recommendedTopics = new ArrayList<>();
        List<Topic> allDbTopics = topicRepository.findAll();
        List<Long> completedIds = allProgress.stream()
                .filter(p -> "COMPLETED".equals(p.getStatus()))
                .map(p -> p.getTopic().getId())
                .collect(Collectors.toList());

        List<Topic> recommendedRaw = allDbTopics.stream()
                .filter(t -> !completedIds.contains(t.getId()))
                .sorted((t1, t2) -> {
                    int modComp = t1.getModule().getDisplayOrder().compareTo(t2.getModule().getDisplayOrder());
                    if (modComp != 0) return modComp;
                    return t1.getDisplayOrder().compareTo(t2.getDisplayOrder());
                })
                .limit(3)
                .collect(Collectors.toList());
        recommendedTopics = objectMapper.toTopicResponseList(recommendedRaw);

        return DashboardStatsResponse.builder()
                .totalModules(totalModules)
                .totalTopics(totalTopics)
                .completedTopics(completedTopics)
                .inProgressTopics(inProgressTopics)
                .overallCompletionPercentage(overallPercent)
                .averageQuizScore(avgQuiz)
                .weakTopics(weakTopics)
                .recommendedTopics(recommendedTopics)
                .build();
    }
}
