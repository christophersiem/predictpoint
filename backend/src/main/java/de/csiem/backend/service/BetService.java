package de.csiem.backend.service;

import de.csiem.backend.dto.BetResponse;
import de.csiem.backend.model.AppUser;
import de.csiem.backend.model.Bet;
import de.csiem.backend.model.Tournament;
import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
@AllArgsConstructor
public class BetService {

    private final AppUserService appUserService;
    private final TournamentService tournamentService;
    private final Map<String, Bet> bets = new HashMap<>();

    public BetResponse createBet(String question, List<String> options, LocalDateTime openUntil, String youtubeUrl, String tournamentId, String userId) {
        Tournament tournament = tournamentService.getTournamentById(tournamentId)
                .orElseThrow(() -> new IllegalArgumentException("Tournament not found"));

        AppUser user = appUserService.getUserById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (!tournament.getAdmin().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Only admin can create bets");
        }

        String id = UUID.randomUUID().toString();
        Bet bet = Bet.builder()
                .id(id)
                .question(question)
                .options(new ArrayList<>(options))
                .openUntil(openUntil)
                .youtubeUrl(youtubeUrl)
                .build();

        tournament.getBets().add(bet);
        bets.put(id, bet);

        return toResponse(bet);
    }

    public Optional<BetResponse> getBetById(String id) {
        if (id == null || id.isBlank()) {
            throw new IllegalArgumentException("ID cannot be null or blank");
        }
        Optional<Bet> bet = Optional.ofNullable(bets.get(id));
        return bet.map(this::toResponse);
    }

    public BetResponse toResponse(Bet bet) {
        if (bet == null) {
            throw new IllegalArgumentException("Bet cannot be null");
        }
        return BetResponse.builder()
                .id(bet.getId())
                .status(bet.getStatus())
                .question(bet.getQuestion())
                .options(bet.getOptions())
                .correctOptionIndex(bet.getCorrectOptionIndex())
                .resolved(bet.isResolved())
                .openUntil(bet.getOpenUntil())
                .youtubeUrl(bet.getYoutubeUrl())
                .build();
    }


}
