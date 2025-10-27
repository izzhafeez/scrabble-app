package com.scrabble_backend.repository;

import com.scrabble_backend.model.ScoreSubmission;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Extending from Jpa gives us basic database-like methods
 */
public interface ScoreSubmissionRepository extends JpaRepository<ScoreSubmission, Long> {
}
