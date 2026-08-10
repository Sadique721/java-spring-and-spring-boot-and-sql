package com.springmastery.repository;

import com.springmastery.domain.CodeExample;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CodeExampleRepository extends JpaRepository<CodeExample, Long> {
    List<CodeExample> findByTopicIdOrderByDisplayOrderAsc(Long topicId);
    List<CodeExample> findByTopicSlugOrderByDisplayOrderAsc(String slug);
}
