package de.csiem.backend.dto;

public record LeaderboardRow(String userId,
                             String name,
                             long score,
                             long correctCount
) {
}
