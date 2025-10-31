package de.csiem.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class AppUserResponse {
    private String id;
    private String name;
    private LocalDateTime createdAt;
    private List<String> myTournaments;
}
