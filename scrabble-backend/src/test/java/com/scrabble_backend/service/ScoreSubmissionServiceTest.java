package com.scrabble_backend.service;

import static org.junit.jupiter.api.Assertions.*;
import com.scrabble_backend.model.ScoreSubmission;
import com.scrabble_backend.repository.ScoreSubmissionRepository;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

@SpringBootTest
@Transactional
public class ScoreSubmissionServiceTest {
    @Autowired
    private ScoreSubmissionRepository repo;

    @Autowired
    private ScoreSubmissionService service;

    @Test
    public void basicServiceTest() {
        ScoreSubmission submission1 = new ScoreSubmission("AMAZON", 3);
        ScoreSubmission submission2 = new ScoreSubmission("AMAZONAS", 6);
        ScoreSubmission submission3 = new ScoreSubmission("AMAZING", 4);

        repo.saveAll(List.of(submission1, submission2, submission3));

        List<ScoreSubmission> results = service.getLeaderboard(0, 10, "score", false);
        assertEquals(results.get(0).getWord(), "AMAZONAS");
        assertEquals(results.get(1).getWord(), "AMAZING");
        assertEquals(results.get(2).getWord(), "AMAZON");
    }

    @Test
    public void descendingScoreTest() {
        ScoreSubmission submission1 = new ScoreSubmission("AMAZON", 3);
        ScoreSubmission submission2 = new ScoreSubmission("AMAZONAS", 6);
        ScoreSubmission submission3 = new ScoreSubmission("AMAZING", 4);

        repo.saveAll(List.of(submission1, submission2, submission3));

        List<ScoreSubmission> results = service.getLeaderboard(0, 10, "score", true);
        assertEquals(results.get(0).getWord(), "AMAZON");
        assertEquals(results.get(1).getWord(), "AMAZING");
        assertEquals(results.get(2).getWord(), "AMAZONAS");
    }

    @Test
    public void shouldShowTenResults() {
        for (int i = 0; i < 15; i++) {
            ScoreSubmission submission = new ScoreSubmission("AAA", i);
            repo.save(submission);
        }

        List<ScoreSubmission> results = service.getLeaderboard(0, 10, "score", false);
        assertEquals(results.size(), 10);
        assertEquals(results.get(9).getScore(), 5);
    }

    // TODO: add more tests for the other sort keys, pageNumber, pageSize
    // but not necessary now because the requirements didn't ask for it
}
