package com.springmastery.repository;

import com.springmastery.domain.TopicSection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TopicSectionRepository extends JpaRepository<TopicSection, Long> {
    List<TopicSection> findByTopicIdOrderBySectionNumberAsc(Long topicId);
    List<TopicSection> findByTopicSlugOrderBySectionNumberAsc(String slug);
    Optional<TopicSection> findByTopicIdAndSectionNumber(Long topicId, Integer sectionNumber);
    Optional<TopicSection> findByTopicSlugAndSectionNumber(String slug, Integer sectionNumber);
    long countByTopicId(Long topicId);
}
