package de.csiem.backend.service;

import de.csiem.backend.dto.LeaderboardEntryDto;
import de.csiem.backend.dto.LeaderboardRow;
import de.csiem.backend.repository.LeaderboardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class LeaderboardService {

    private final LeaderboardRepository leaderboardRepository;


    public List<LeaderboardEntryDto> leaderboardForTournament(String tournamentId) {
        List<LeaderboardRow> rows = leaderboardRepository.leaderboardForTournament(tournamentId);
        return rows.stream()
                .map(r -> new LeaderboardEntryDto(r.name(), String.valueOf(r.score())))
                .toList();
    }


    public long userScoreInTournament(String tournamentId, String userId) {
        return leaderboardRepository.userScoreInTournament(tournamentId, userId);
    }


}
