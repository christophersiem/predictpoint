package de.csiem.backend.service;

import de.csiem.backend.model.AppUser;
import de.csiem.backend.model.Bet;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
@AllArgsConstructor
public class BetService {

    private final AppUserService appUserService;
    private final Map<String, Bet> bets = new HashMap<>();

    public Bet createBet(String question, List<String> options, LocalDateTime openUntil, String youtubeUrl, String userId) {
        AppUser user = appUserService.getUserById(userId).orElseThrow(() -> new IllegalArgumentException("User not found"));
        String id = UUID.randomUUID().toString();

        Bet bet = Bet.builder()
                .id(id)
                .question(question)
                .options(new ArrayList<>(options))
                .openUntil(openUntil)
                .youtubeUrl(youtubeUrl)
                .build();
        user.addBet(bet);
        bets.put(id, bet);
        return bet;
    }

    public Optional<Bet> getBetById(String id) {
        if (id == null || id.isBlank()) {
            throw new IllegalArgumentException("ID cannot be null or blank");
        }
        return Optional.ofNullable(bets.get(id));
    }

    public List<Bet> getTippableBets() {
        LocalDateTime now = LocalDateTime.now();
        return bets.values().stream()
                .filter(bet -> bet.getOpenUntil().isAfter(now) && !bet.isResolved())
                .toList();
    }


}
