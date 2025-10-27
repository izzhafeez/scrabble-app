package com.scrabble_backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

/**
 * Try to keep all the validation here as much as possible.
 * Validation errors will be sent to ConstraintViolationException, handled in the GlobalExceptionHandler.
 */
@Entity
public class ScoreSubmission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // use this for DELETE

    @NotBlank
    @Size(min = 2, max = 10, message = "word length must be between 2 and 10 letters") // no such thing as 1-letter Scrabble words
    @Pattern(regexp = "^[A-Z]+$") // please make sure in the frontend that everything is in CAPS
    private String word;

    @Min(0) // it doesn't make sense for a normal Scrabble board to have negatives
    private int score;

    // idea behind this field is to:
    // 1. give users an understanding of when they calculated this word (which is why we expose it)
    // 2. gives us as devs a way to remove old records if space is tight
    private final LocalDateTime submittedAt = LocalDateTime.now();

    // java will complain if there is no parameterless default constructor
    public ScoreSubmission() {}

    public ScoreSubmission(String word, int score) {
        this.word = word;
        this.score = score;
    }

    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }

    public String getWord() {
        return word;
    }

    public int getScore() {
        return score;
    }

    public Long getId() {
        return id;
    }

    public void setWord(String word) {
        this.word = word;
    }

    public void setScore(int score) {
        this.score = score;
    }
}
