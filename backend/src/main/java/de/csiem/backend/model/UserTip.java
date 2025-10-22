package de.csiem.backend.model;

import lombok.Data;

@Data
public class UserTip {
    private String id;
    private String userId;
    private Bet bet;
    private int selectedOptionIndex;
    private int points;
}
