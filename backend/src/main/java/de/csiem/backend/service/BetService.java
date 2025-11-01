package de.csiem.backend.service;

import de.csiem.backend.dto.BetResponse;
import de.csiem.backend.model.*;
import de.csiem.backend.repository.BetRepository;
import de.csiem.backend.repository.TipRepository;
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
    private final de.csiem.backend.mapper.BetMapper betMapper;
    private final IdService idService;
    private final TipRepository tipRepository;

    public BetResponse createBet(String question,
                                 List<String> options,
                                 LocalDateTime openUntil,
                                 String youtubeUrl,
                                 String tournamentId,
                                 String userId) {

        Tournament tournament = tournamentService.getTournamentById(tournamentId);

        AppUser user = appUserService.getUserById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (!tournament.getAdmin().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Only admin can create bets");
        }

        Bet bet = Bet.builder()
                .id(idService.createUUID())
                .status(Status.OPEN)
                .tournament(tournament)
                .question(question)
                .options(options != null ? new ArrayList<>(options) : new ArrayList<>())
                .openUntil(openUntil)
                .youtubeUrl(youtubeUrl)
                .build();

        Bet saved = betRepository.save(bet);
        tournament.getBets().add(saved);

        return betMapper.toResponse(saved, null);
    }

    public BetResponse resolveBet(String betId, String currentUserId, int correctOptionIndex) {
        Bet bet = betRepository.findById(betId)
                .orElseThrow(() -> new IllegalArgumentException("Bet not found"));

        Tournament tournament = bet.getTournament();
        if (tournament == null) {
            throw new IllegalStateException("Bet has no tournament");
        }

        if (!tournament.getAdmin().getId().equals(currentUserId)) {
            throw new IllegalStateException("Only tournament admin can resolve this bet");
        }

        if (correctOptionIndex < 0 || correctOptionIndex >= bet.getOptions().size()) {
            throw new IllegalArgumentException("Correct option index out of range");
        }

        bet.setCorrectOptionIndex(correctOptionIndex);
        bet.setResolved(true);
        bet.setStatus(Status.RESOLVED);


        for (Tip tip : bet.getTips()) {
            boolean isCorrect = tip.getSelectedOptionIndex() == correctOptionIndex;
            tip.setPoints(isCorrect ? 1 : 0);
            tipRepository.save(tip);
        }

        Bet saved = betRepository.save(bet);
        return betMapper.toResponse(saved, currentUserId);
    }

    public BetResponse getBetForUser(String betId, String currentUserId) {
        Bet bet = betRepository.findById(betId)
                .orElseThrow(() -> new IllegalArgumentException("Bet not found"));
        return betMapper.toResponse(bet, currentUserId);
    }

    public Optional<BetResponse> getBetById(String id) {
        if (id == null || id.isBlank()) {
            throw new IllegalArgumentException("ID cannot be null or blank");
        }
        return betRepository.findById(id)
                .map(bet -> betMapper.toResponse(bet, null));
    }
}
