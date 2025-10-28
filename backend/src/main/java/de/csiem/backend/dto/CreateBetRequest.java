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
    @NotNull    @Size(min = 8, message = "Question too short (minimum 8 characters)")
    private String question;
    @NotNull    @Size(min = 2, max = 4, message = "Options must be between 2 and 4")
    private List<String> options;
    @NotNull @Future
    private LocalDateTime openUntil;
    @URL
    private String youtubeUrl;
}