package de.csiem.backend.dto;

public record TipRequest(
        String betId,
        Integer selectedOptionIndex,
        String selectedAnswer
) {}
