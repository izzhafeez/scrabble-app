package com.scrabble_backend.repository;

import static org.junit.jupiter.api.Assertions.*;
import com.scrabble_backend.model.ScoreSubmission;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.time.LocalDateTime;
import java.util.List;

@DataJpaTest
public class ScoreSubmissionRepositoryTest {
    @Autowired
    private ScoreSubmissionRepository repo;

    @Test
    void validSubmissionShouldSave() {
        ScoreSubmission submission = new ScoreSubmission("AMAZON", 3);
        ScoreSubmission savedSubmission = repo.save(submission);
        List<ScoreSubmission> allEntries = repo.findAll();
        assertEquals(allEntries.size(), 1);
        assertEquals(savedSubmission.getWord(), "AMAZON");
    }

    @Test
    void submittedAtOrderReflectsSubmissionOrder() {
        ScoreSubmission savedSubmission1 = repo.save(new ScoreSubmission("AMAZON", 3));
        ScoreSubmission savedSubmission2 = repo.save(new ScoreSubmission("APPLE", 3));
        LocalDateTime submittedAt1 = savedSubmission1.getSubmittedAt();
        LocalDateTime submittedAt2 = savedSubmission2.getSubmittedAt();

        assertTrue(submittedAt1.isBefore(submittedAt2));
    }
}
