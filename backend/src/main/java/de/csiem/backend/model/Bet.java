package de.csiem.backend.model;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;



import java.util.List;

@Data
@Builder
@AllArgsConstructor
public class Bet {

    private final String id;
    @Builder.Default
    private final Status status = Status.OPEN;
    private final String question;
    private final List<String> options;
    @Builder.Default
    private final int correctOptionIndex = -1;
    private final boolean resolved;
}


