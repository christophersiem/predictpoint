package de.csiem.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

    @Data
    public class LoginRequest {
        @NotBlank(message = "ID cannot be blank")
        private String id;
    }

