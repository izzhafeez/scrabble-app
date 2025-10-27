package com.scrabble_backend.model;

import static org.junit.jupiter.api.Assertions.*;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.util.Set;

public class ScoreSubmissionTest {
    private static Validator validator;

    @BeforeAll
    static void initialiseValidator() {
        ValidatorFactory validatorFactory = Validation.buildDefaultValidatorFactory();
        validator = validatorFactory.getValidator();
    }

    @Test
    void validSubmissionShouldPassValidation() {
        ScoreSubmission submission = new ScoreSubmission("AMAZON", 3);
        Set<ConstraintViolation<ScoreSubmission>> violations = validator.validate(submission);
        assertTrue(violations.isEmpty());
    }

    @Test
    void negativeScoreShouldFailValidation() {
        ScoreSubmission submission = new ScoreSubmission("AMAZON", -1);
        Set<ConstraintViolation<ScoreSubmission>> violations = validator.validate(submission);
        assertEquals(violations.iterator().next().getMessage(), "must be greater than or equal to 0");
    }

    @Test
    void zeroScoreShouldPassValidation() {
        ScoreSubmission submission = new ScoreSubmission("AMAZON", 0);
        Set<ConstraintViolation<ScoreSubmission>> violations = validator.validate(submission);
        assertTrue(violations.isEmpty());
    }

    @Test
    void lengthTwoShouldPassValidation() {
        ScoreSubmission submission = new ScoreSubmission("AM", 3);
        Set<ConstraintViolation<ScoreSubmission>> violations = validator.validate(submission);
        assertTrue(violations.isEmpty());
    }

    @Test
    void lengthTenShouldPassValidation() {
        ScoreSubmission submission = new ScoreSubmission("AMAZONAMAZ", 3);
        Set<ConstraintViolation<ScoreSubmission>> violations = validator.validate(submission);
        assertTrue(violations.isEmpty());
    }

    @Test
    void lengthElevenShouldFailValidation() {
        ScoreSubmission submission = new ScoreSubmission("AMAZONAMAZO", 3);
        Set<ConstraintViolation<ScoreSubmission>> violations = validator.validate(submission);
        assertEquals(violations.size(), 1);
    }

    @Test
    void lengthOneShouldFailValidation() {
        ScoreSubmission submission = new ScoreSubmission("A", 3);
        Set<ConstraintViolation<ScoreSubmission>> violations = validator.validate(submission);
        assertEquals(violations.size(), 1);
    }

    @Test
    void nonAlphabetShouldFailValidation() {
        ScoreSubmission submission = new ScoreSubmission("AMA ZON", 3);
        Set<ConstraintViolation<ScoreSubmission>> violations = validator.validate(submission);
        assertEquals(violations.size(), 1);
    }
}
