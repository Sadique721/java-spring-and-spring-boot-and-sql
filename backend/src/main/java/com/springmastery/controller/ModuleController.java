package com.springmastery.controller;

import com.springmastery.dto.ModuleResponse;
import com.springmastery.dto.TopicResponse;
import com.springmastery.service.ModuleService;
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
@RequestMapping("/api/v1/modules")
@RequiredArgsConstructor
@Slf4j
public class ModuleController {

    private final ModuleService moduleService;
    private final TopicService topicService;

    @GetMapping
    public ResponseEntity<List<ModuleResponse>> getAllModules() {
        log.info("REST request to get all modules");
        return ResponseEntity.ok(moduleService.getAllModules());
    }

    @GetMapping("/{slug}")
    public ResponseEntity<ModuleResponse> getModuleBySlug(@PathVariable String slug) {
        log.info("REST request to get module: {}", slug);
        return ResponseEntity.ok(moduleService.getModuleBySlug(slug));
    }

    @GetMapping("/{slug}/topics")
    public ResponseEntity<List<TopicResponse>> getTopicsByModuleSlug(@PathVariable String slug) {
        log.info("REST request to get topics for module: {}", slug);
        return ResponseEntity.ok(topicService.getTopicsByModuleSlug(slug));
    }
}
