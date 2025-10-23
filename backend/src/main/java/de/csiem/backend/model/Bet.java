package de.csiem.backend.model;

import lombok.Builder;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
public class Bet {

    private String id;
    private String question;
    private List<String> options;
    @Builder.Default
    private int correctOptionIndex = -1;
    private boolean resolved;
}


