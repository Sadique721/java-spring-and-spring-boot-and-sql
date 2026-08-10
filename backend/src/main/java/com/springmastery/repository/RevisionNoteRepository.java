package com.springmastery.repository;

import com.springmastery.domain.RevisionNote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RevisionNoteRepository extends JpaRepository<RevisionNote, Long> {
    Optional<RevisionNote> findByTopicId(Long topicId);
    Optional<RevisionNote> findByTopicSlug(String slug);
}
