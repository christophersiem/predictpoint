package de.csiem.backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CreateTournamentRequest {
    @NotBlank(message = "Name cannot be blank")
    private String name;
    @NotNull(message = "Start date must not be null")
    private LocalDateTime start;
    @Min(value = 1, message = "Duration must be at least 1 day")
    private int durationDays;
}
