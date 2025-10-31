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
    private Status status;
    private String question;
    private List<String> options;
    private int correctOptionIndex;
    private String correctAnswer;
    private boolean resolved;
    private LocalDateTime openUntil;
    private String youtubeUrl;
}