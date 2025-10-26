package de.csiem.backend.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class CreateBetRequest {
    @NotNull(message = "Question must not be null")
    @Size(min = 8, message = "Question too short (minimum 8 characters)")
    private String question;

    @NotNull(message = "Options must not be null")
    @Size(min = 2, max = 4, message = "Options must be between 2 and 4")
    private List<String> options;
}