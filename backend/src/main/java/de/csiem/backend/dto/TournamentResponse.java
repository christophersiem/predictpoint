package de.csiem.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class TournamentResponse {
    private String id;
    private String adminId;
    private String adminName;
    private String name;
    private String inviteCode;
    private LocalDateTime start;
    private int durationDays;
    private List<String> participantNames;
    private List<BetResponse> activeBets;
    private List<BetResponse> pastBets;
    private List<BetResponse> resolvedBets;

}
