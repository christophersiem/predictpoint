package de.csiem.backend.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.hibernate.validator.constraints.URL;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class CreateBetRequest {
    @NotNull @Size(min = 8)
    private String question;
    @NotNull @Size(min = 2, max = 4)
    private List<String> options;
    @NotNull @Future(message = "Open until must be in the future")
    private LocalDateTime openUntil;
    @URL(message = "Invalid YouTube URL")
    private String youtubeUrl;
}