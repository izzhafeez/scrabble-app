package com.scrabble_backend.service;

import com.scrabble_backend.model.ScoreSubmission;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import com.scrabble_backend.repository.ScoreSubmissionRepository;

import java.util.List;

@Service
public class ScoreSubmissionService {
    private final ScoreSubmissionRepository repo;

    public ScoreSubmissionService(ScoreSubmissionRepository repo) {
        this.repo = repo;
    }

    /**
     * Gets the top X results from the database based on attribute.
     * @param pageNumber starts from 0
     * @param pageSize number of entries per page
     * @param sortKey validated in the controller
     * @param isAscending sort order
     * @return list of search results
     */
    public List<ScoreSubmission> getLeaderboard(
            int pageNumber,
            int pageSize,
            String sortKey,
            boolean isAscending
    ) {
        // if you can shorten this, go ahead
        Pageable request = isAscending
                ? PageRequest.of(pageNumber, pageSize, Sort.by(sortKey))
                : PageRequest.of(pageNumber, pageSize, Sort.by(sortKey).descending());

        return repo.findAll(request).getContent();
    }

    /**
     * Considered having upsert here, where we update when the word already exists.
     * But since we're using submittedAt, we we can allow duplicates.
     * @param submission to be inserted
     * @return the same submission record
     */
    public ScoreSubmission insert(ScoreSubmission submission) {
        repo.save(submission);
        return submission;
    }

    /**
     * We want to give the user more freedom, so basic CRUD is necessary.
     * @param id of the submission to be deleted
     */
    public void delete(Long id) {
        if (!repo.existsById(id)) {
            // exceptions are handled by GlobalExceptionHandler
            throw new IllegalArgumentException("Submission not found with id: " + id);
        }
        repo.deleteById(id);
    }
}
