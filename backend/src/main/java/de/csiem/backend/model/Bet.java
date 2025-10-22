package de.csiem.backend.model;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class Bet {

    private String id;
    private String question;
    private List<String> options = new ArrayList<>();
    private int correctOptionIndex = -1;
    private boolean resolved = false;
}


