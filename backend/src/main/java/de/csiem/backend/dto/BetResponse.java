package de.csiem.backend.dto;

import de.csiem.backend.model.Status;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class BetResponse {
    private String id;
    private String question;
    private List<String> options;
    private boolean resolved;
    private int correctOptionIndex;
    private LocalDateTime openUntil;
    private Status status;
    private TipResponse myTip;
}