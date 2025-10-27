package com.scrabble_backend.controller;

import com.scrabble_backend.model.ScoreSubmission;
import com.scrabble_backend.service.ScoreSubmissionService;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/score-submission")
@Validated
public class ScoreSubmissionController {
    private final ScoreSubmissionService service;

    public ScoreSubmissionController(ScoreSubmissionService service) {
        this.service = service;
    }

    /**
     * Retrieves score submissions based on search criteria.
     * Currently, it is only used for top 10 score entries, but can be customised greatly.
     * @param pageNumber starts at 0
     * @param pageSize number of entries per page
     * @param sortKey must follow the exact naming of the model attributes
     * @param isAscending whether the values should increase or decrease
     * @return list of results for the query
     */
    @GetMapping
    public List<ScoreSubmission> getLeaderboard(
            @RequestParam(required = false, defaultValue = "0") @Min(0) int pageNumber,
            @RequestParam(required = false, defaultValue = "10") @Min(1) @Max(100) int pageSize,
            @RequestParam(required = false, defaultValue = "score") String sortKey,
            @RequestParam(required = false, defaultValue = "false") boolean isAscending
            // default values follow the current requirements
    ) {
        // custom validation that does not have a directive for it
        Set<String> validSortKeys = Set.of("score", "word", "submittedAt");
        if (!validSortKeys.contains(sortKey)) {
            throw new IllegalArgumentException("Invalid sort key. Allowed: " + validSortKeys);
        }

        return service.getLeaderboard(pageNumber, pageSize, sortKey, isAscending);
    }

    /**
     * Creates a new submission record.
     * Note that we are accepting duplicate words, as we will always have the datetime as different
     * @param submission record of mainly word and score, auto-augmented with creation datetime
     * @return the resulting submission record
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ScoreSubmission insert(@RequestBody @Validated ScoreSubmission submission) {
        return service.insert(submission);
    }

    /**
     * Deletes a submission record.
     * Reasoning is that users may want to declutter their leaderboard.
     * Basic CRUD gives the user more freedom.
     * We are not returning anything, so be careful of res => res.json()
     * @param id id of the submission record to be deleted
     */
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
