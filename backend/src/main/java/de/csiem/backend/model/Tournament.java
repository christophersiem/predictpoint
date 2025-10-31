package de.csiem.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
public class Tournament {
    private final String id;
    private final AppUser admin;
    private final String name;
    private final String inviteCode;
    private final LocalDateTime start;
    private final int durationDays;
    @Builder.Default
    private final List<Bet> bets = new ArrayList<>();
    @Builder.Default
    private final List<AppUser> participants = new ArrayList<>();

}