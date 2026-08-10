package com.springmastery.controller;

import com.springmastery.dto.TopicResponse;
import com.springmastery.service.SearchService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/search")
@RequiredArgsConstructor
@Slf4j
public class SearchController {

    private final SearchService searchService;

    @GetMapping
    public ResponseEntity<List<TopicResponse>> search(@RequestParam("q") String query) {
        log.info("REST request to perform global search for query: {}", query);
        return ResponseEntity.ok(searchService.search(query));
    }
}
