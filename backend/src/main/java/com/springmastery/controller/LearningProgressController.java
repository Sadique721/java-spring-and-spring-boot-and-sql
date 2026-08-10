package com.springmastery.controller;

import com.springmastery.dto.DashboardStatsResponse;
import com.springmastery.dto.ProgressRequest;
import com.springmastery.dto.ProgressResponse;
import com.springmastery.service.LearningProgressService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/progress")
@RequiredArgsConstructor
@Slf4j
public class LearningProgressController {

    private final LearningProgressService progressService;

    @PostMapping("/{topicSlug}")
    public ResponseEntity<ProgressResponse> updateProgress(
            @PathVariable String topicSlug,
            @RequestBody ProgressRequest request) {
        log.info("REST request to update progress for topic: {}", topicSlug);
        return ResponseEntity.ok(progressService.updateProgress(topicSlug, request));
    }

    @GetMapping("/session/{sessionId}")
    public ResponseEntity<List<ProgressResponse>> getSessionProgress(@PathVariable String sessionId) {
        log.info("REST request to get progress list for session: {}", sessionId);
        return ResponseEntity.ok(progressService.getSessionProgress(sessionId));
    }

    @GetMapping("/dashboard/{sessionId}")
    public ResponseEntity<DashboardStatsResponse> getDashboardStats(@PathVariable String sessionId) {
        log.info("REST request to get dashboard stats for session: {}", sessionId);
        return ResponseEntity.ok(progressService.getDashboardStats(sessionId));
    }
}
