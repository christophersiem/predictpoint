package de.csiem.backend.dto;

import de.csiem.backend.model.AppUser;
import de.csiem.backend.model.Bet;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
public class TournamentResponse {
    private String id;
    private String adminName;
    private String name;
    private String inviteCode;
    private LocalDateTime start;
    private final List<String> bets;
    private int durationDays;
    private List<String> participantNames;
}
