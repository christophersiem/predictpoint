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
public class AppUser {

    private final String id;
    private final String name;
    @Builder.Default
    private List<Bet> myBets = new ArrayList<>();
    @Builder.Default
    private final LocalDateTime createdAt = LocalDateTime.now();

    public void addBet(Bet bet) {
        myBets.add(bet);
    }
}
