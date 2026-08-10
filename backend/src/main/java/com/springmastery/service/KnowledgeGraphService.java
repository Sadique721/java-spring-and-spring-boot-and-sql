package com.springmastery.service;

import com.springmastery.domain.Topic;
import com.springmastery.domain.TopicRelationship;
import com.springmastery.dto.GraphData;
import com.springmastery.dto.GraphEdge;
import com.springmastery.dto.GraphNode;
import com.springmastery.repository.TopicRelationshipRepository;
import com.springmastery.repository.TopicRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class KnowledgeGraphService {

    private final TopicRepository topicRepository;
    private final TopicRelationshipRepository relationshipRepository;

    public GraphData getFullGraph() {
        log.info("Generating full knowledge graph data");
        List<Topic> topics = topicRepository.findAll();
        List<TopicRelationship> relationships = relationshipRepository.findAllWithTopics();

        // Calculate node size/val based on number of connections
        Map<String, Integer> connectionCounts = new HashMap<>();
        for (TopicRelationship rel : relationships) {
            String fromSlug = rel.getFromTopic().getSlug();
            String toSlug = rel.getToTopic().getSlug();
            connectionCounts.put(fromSlug, connectionCounts.getOrDefault(fromSlug, 0) + 1);
            connectionCounts.put(toSlug, connectionCounts.getOrDefault(toSlug, 0) + 1);
        }

        List<GraphNode> nodes = topics.stream().map(t -> GraphNode.builder()
                .id(t.getSlug())
                .label(t.getTitle())
                .module(t.getModule() != null ? t.getModule().getSlug() : null)
                .difficulty(t.getDifficulty().name())
                .val(5 + connectionCounts.getOrDefault(t.getSlug(), 0) * 3)
                .build()
        ).collect(Collectors.toList());

        List<GraphEdge> edges = relationships.stream().map(r -> GraphEdge.builder()
                .source(r.getFromTopic().getSlug())
                .target(r.getToTopic().getSlug())
                .type(r.getRelationshipType().name())
                .weight(r.getWeight())
                .build()
        ).collect(Collectors.toList());

        return GraphData.builder()
                .nodes(nodes)
                .edges(edges)
                .build();
    }

    public GraphData getTopicSubGraph(String topicSlug) {
        log.info("Generating subgraph centered around topic: {}", topicSlug);
        List<TopicRelationship> relationships = relationshipRepository.findActiveGraphEdgesByTopicSlug(topicSlug);

        // Extract related topics
        Map<String, Topic> relatedTopics = new HashMap<>();
        for (TopicRelationship rel : relationships) {
            relatedTopics.put(rel.getFromTopic().getSlug(), rel.getFromTopic());
            relatedTopics.put(rel.getToTopic().getSlug(), rel.getToTopic());
        }

        List<GraphNode> nodes = relatedTopics.values().stream().map(t -> GraphNode.builder()
                .id(t.getSlug())
                .label(t.getTitle())
                .module(t.getModule() != null ? t.getModule().getSlug() : null)
                .difficulty(t.getDifficulty().name())
                .val(t.getSlug().equals(topicSlug) ? 20 : 10) // Highlight central node
                .build()
        ).collect(Collectors.toList());

        List<GraphEdge> edges = relationships.stream().map(r -> GraphEdge.builder()
                .source(r.getFromTopic().getSlug())
                .target(r.getToTopic().getSlug())
                .type(r.getRelationshipType().name())
                .weight(r.getWeight())
                .build()
        ).collect(Collectors.toList());

        return GraphData.builder()
                .nodes(nodes)
                .edges(edges)
                .build();
    }
}
