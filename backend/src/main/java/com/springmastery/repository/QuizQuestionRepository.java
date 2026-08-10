package com.springmastery.repository;

import com.springmastery.domain.QuizQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuizQuestionRepository extends JpaRepository<QuizQuestion, Long> {
    List<QuizQuestion> findByTopicIdOrderByDisplayOrderAsc(Long topicId);
    List<QuizQuestion> findByTopicSlugOrderByDisplayOrderAsc(String slug);
}
