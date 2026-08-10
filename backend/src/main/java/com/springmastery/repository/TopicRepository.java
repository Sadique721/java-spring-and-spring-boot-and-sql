package com.springmastery.repository;

import com.springmastery.domain.Topic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TopicRepository extends JpaRepository<Topic, Long> {
    Optional<Topic> findBySlug(String slug);
    List<Topic> findByModuleIdOrderByDisplayOrderAsc(Long moduleId);
    
    @Query("SELECT t FROM Topic t JOIN FETCH t.module WHERE t.slug = :slug")
    Optional<Topic> findBySlugWithModule(@Param("slug") String slug);

    @Query("SELECT t FROM Topic t WHERE t.module.slug = :moduleSlug ORDER BY t.displayOrder Asc")
    List<Topic> findByModuleSlug(@Param("moduleSlug") String moduleSlug);

    @Query("SELECT t FROM Topic t WHERE t.displayOrder = :order AND t.module.id = :moduleId")
    Optional<Topic> findByModuleIdAndDisplayOrder(@Param("moduleId") Long moduleId, @Param("order") Integer order);

    @Query("SELECT t FROM Topic t WHERE t.title ILIKE %:query% OR t.subtitle ILIKE %:query%")
    List<Topic> searchTopics(@Param("query") String query);
}
