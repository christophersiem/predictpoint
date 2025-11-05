package de.csiem.backend.controller;

import de.csiem.backend.dto.LeaderboardEntryDto;
import de.csiem.backend.service.LeaderboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class LeaderboardController {

    private final LeaderboardService leaderboardService;

    @GetMapping("/api/tournaments/{id}/leaderboard")
    public List<LeaderboardEntryDto> leaderboard(@PathVariable String id) {
        return leaderboardService.leaderboardForTournament(id);
    }

    @GetMapping("/api/tournaments/{id}/score/{userId}")
    public Map<String, Long> userScore(@PathVariable String id, @PathVariable String userId) {
        return Map.of("score", leaderboardService.userScoreInTournament(id, userId));
    }
}