package de.csiem.backend.service;

import de.csiem.backend.dto.BetResponse;
import de.csiem.backend.dto.TipResponse;
import de.csiem.backend.model.*;
import de.csiem.backend.repository.BetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BetService {

    private final AppUserService appUserService;
    private final TournamentService tournamentService;
    private final BetRepository betRepository;
    private final IdService idService;

    public BetResponse createBet(
            String question,
            List<String> options,
            LocalDateTime openUntil,
            String youtubeUrl,
            String tournamentId,
            String userId
    ) {
        Tournament tournament = tournamentService.getTournamentById(tournamentId);

        AppUser user = appUserService.getUserById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (!tournament.getAdmin().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Only admin can create bets");
        }

        Bet bet = Bet.builder()
                .id(idService.createUUID())
                .status(Status.OPEN)
                .tournament(tournament)                      // 👈 wichtig
                .question(question)
                .options(options != null ? new ArrayList<>(options) : new ArrayList<>())
                .openUntil(openUntil)
                .youtubeUrl(youtubeUrl)
                .build();

        Bet saved = betRepository.save(bet);

        // bidirektional aktuell halten (optional)
        tournament.getBets().add(saved);

        // beim Anlegen gibt es noch keinen Tipp → ohne currentUserId mappen
        return toResponse(saved, null);
    }

    /**
     * Ohne User-Kontext – z.B. für Admin oder interne Aufrufe
     */
    public Optional<BetResponse> getBetById(String id) {
        if (id == null || id.isBlank()) {
            throw new IllegalArgumentException("ID cannot be null or blank");
        }
        return betRepository.findById(id)
                .map(bet -> toResponse(bet, null));
    }

    /**
     * Mit User-Kontext – z.B. Controller: /api/bets/{id}
     */
    public Optional<BetResponse> getBetByIdForUser(String id, String currentUserId) {
        if (id == null || id.isBlank()) {
            throw new IllegalArgumentException("ID cannot be null or blank");
        }
        return betRepository.findById(id)
                .map(bet -> toResponse(bet, currentUserId));
    }

    /**
     * Zentrales Mapping: Bet -> BetResponse, optional mit aktuellem Tipp des Users
     */
    public BetResponse toResponse(Bet bet, String currentUserId) {

        TipResponse tipResponse = null;

        if (currentUserId != null) {
            Tip userTip = bet.getTips().stream()
                    .filter(t -> t.getUser() != null && currentUserId.equals(t.getUser().getId()))
                    .findFirst()
                    .orElse(null);

            if (userTip != null) {
                Boolean correct = null;
                if (bet.isResolved() && bet.getCorrectOptionIndex() >= 0) {
                    correct = userTip.getSelectedOptionIndex() == bet.getCorrectOptionIndex();
                }
                tipResponse = TipResponse.builder()
                        .id(userTip.getId())
                        .betId(bet.getId())
                        .selectedOptionIndex(userTip.getSelectedOptionIndex())
                        .selectedAnswer(userTip.getSelectedAnswer())
                        .points(userTip.getPoints())
                        .correct(correct)
                        .build();
            }
        }

        return BetResponse.builder()
                .id(bet.getId())
                .question(bet.getQuestion())
                .options(bet.getOptions())
                .resolved(bet.isResolved())
                .correctOptionIndex(bet.getCorrectOptionIndex())
                .openUntil(bet.getOpenUntil())
                .status(bet.getStatus())
                .myTip(tipResponse)
                .build();
    }
}
