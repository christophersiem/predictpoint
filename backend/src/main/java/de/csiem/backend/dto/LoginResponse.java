package de.csiem.backend.dto;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class LoginResponse {
    private String id;
    private String name;
}
