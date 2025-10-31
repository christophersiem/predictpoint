package de.csiem.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class Tip {
    private final String id;
    private final AppUser user;
    private final Bet bet;
    private final int selectedOptionIndex;
    private final String selectedAnswer;
    @Builder.Default
    private int points = 0;
}