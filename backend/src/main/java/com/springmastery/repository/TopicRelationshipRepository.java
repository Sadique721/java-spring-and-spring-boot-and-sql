package com.springmastery.repository;

import com.springmastery.domain.TopicRelationship;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TopicRelationshipRepository extends JpaRepository<TopicRelationship, Long> {
    List<TopicRelationship> findByFromTopicId(Long fromTopicId);
    List<TopicRelationship> findByToTopicId(Long toTopicId);
    
    @Query("SELECT r FROM TopicRelationship r WHERE r.fromTopic.slug = :slug OR r.toTopic.slug = :slug")
    List<TopicRelationship> findActiveGraphEdgesByTopicSlug(@Param("slug") String slug);

    @Query("SELECT r FROM TopicRelationship r JOIN FETCH r.fromTopic JOIN FETCH r.toTopic")
    List<TopicRelationship> findAllWithTopics();
}
