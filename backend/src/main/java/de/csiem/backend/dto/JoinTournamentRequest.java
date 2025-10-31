package de.csiem.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class JoinTournamentRequest {
    @NotBlank(message = "Invite code cannot be blank")
    private String code;
}
