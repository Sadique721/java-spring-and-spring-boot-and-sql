package com.springmastery.service;

import com.springmastery.domain.Topic;
import com.springmastery.dto.TopicResponse;
import com.springmastery.mapper.ObjectMapper;
import com.springmastery.repository.TopicRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class SearchService {

    private final TopicRepository topicRepository;
    private final ObjectMapper objectMapper;

    public List<TopicResponse> search(String query) {
        if (query == null || query.trim().isEmpty()) {
            return Collections.emptyList();
        }
        log.info("Performing global search for query: {}", query);
        List<Topic> results = topicRepository.searchTopics(query.trim());
        return objectMapper.toTopicResponseList(results);
    }
}
