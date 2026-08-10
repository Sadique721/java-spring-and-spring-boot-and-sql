package com.springmastery.repository;

import com.springmastery.domain.LearningProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LearningProgressRepository extends JpaRepository<LearningProgress, Long> {
    Optional<LearningProgress> findBySessionIdAndTopicId(String sessionId, Long topicId);
    List<LearningProgress> findBySessionId(String sessionId);
    
    @Query("SELECT lp FROM LearningProgress lp JOIN FETCH lp.topic WHERE lp.sessionId = :sessionId")
    List<LearningProgress> findBySessionIdWithTopic(@Param("sessionId") String sessionId);

    @Query("SELECT COUNT(lp) FROM LearningProgress lp WHERE lp.sessionId = :sessionId AND lp.status = 'COMPLETED'")
    long countCompletedTopicsBySessionId(@Param("sessionId") String sessionId);

    @Query("SELECT COUNT(lp) FROM LearningProgress lp WHERE lp.sessionId = :sessionId AND lp.status = 'IN_PROGRESS'")
    long countInProgressTopicsBySessionId(@Param("sessionId") String sessionId);
}
