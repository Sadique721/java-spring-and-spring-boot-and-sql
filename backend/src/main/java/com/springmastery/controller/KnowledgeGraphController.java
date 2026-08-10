package com.springmastery.controller;

import com.springmastery.dto.GraphData;
import com.springmastery.service.KnowledgeGraphService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/graph")
@RequiredArgsConstructor
@Slf4j
public class KnowledgeGraphController {

    private final KnowledgeGraphService graphService;

    @GetMapping
    public ResponseEntity<GraphData> getFullGraph() {
        log.info("REST request to get full knowledge graph");
        return ResponseEntity.ok(graphService.getFullGraph());
    }

    @GetMapping("/full")
    public ResponseEntity<GraphData> getFullGraphAlias() {
        log.info("REST request to get full knowledge graph (full)");
        return ResponseEntity.ok(graphService.getFullGraph());
    }

    @GetMapping("/topic/{slug}")
    public ResponseEntity<GraphData> getTopicSubGraph(@PathVariable String slug) {
        log.info("REST request to get subgraph for topic: {}", slug);
        return ResponseEntity.ok(graphService.getTopicSubGraph(slug));
    }
}
