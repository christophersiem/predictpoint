package de.csiem.backend.service;

import de.csiem.backend.dto.TournamentResponse;
import de.csiem.backend.model.AppUser;
import de.csiem.backend.model.Bet;
import de.csiem.backend.model.Tip;
import de.csiem.backend.model.Tournament;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TournamentService {

    private final AppUserService appUserService;
    private final Map<String, Tournament> tournaments = new HashMap<>();


    public TournamentResponse createTournament(String name, LocalDateTime start, int durationDays, String userId) {
        AppUser user = appUserService.getUserById(userId).orElseThrow();

        int totalTournaments = user.getMyTournaments().size() + user.getAdministeredTournaments().size();
        if (totalTournaments >= 2) {
            throw new IllegalStateException("User can be member of at most 2 tournaments (as admin or participant)");
        }
        String id = UUID.randomUUID().toString();
        String inviteCode = generateInviteCode();

        Tournament tournament = Tournament.builder()
                .id(id)
                .admin(user)
                .name(name)
                .inviteCode(inviteCode)
                .start(start)
                .durationDays(durationDays)
                .build();
        tournament.getParticipants().add(user);
        appUserService.addAdministeredTournament(userId, tournament);
        tournaments.put(id, tournament);
        return getTournamentResponse(tournament.getId());
    }

    public void addBet(String tournamentId, Bet bet, String userId) {
        Tournament tournament = getTournamentById(tournamentId).orElseThrow(() -> new IllegalArgumentException("Tournament not found"));
        AppUser user = appUserService.getUserById(userId).orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (!tournament.getAdmin().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Only admin can add bets");
        }

        tournament.getBets().add(bet);
    }

    public void resolveBet(String tournamentId, String betId, int correctOptionIndex, String userId) {
        Tournament tournament = getTournamentById(tournamentId).orElseThrow(() -> new IllegalArgumentException("Tournament not found"));
        AppUser user = appUserService.getUserById(userId).orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (!tournament.getAdmin().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Only admin can resolve bets");
        }

        Bet bet = tournament.getBets().stream()
                .filter(b -> b.getId().equals(betId))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Bet not found in tournament"));

        if (bet.isResolved()) {
            throw new IllegalStateException("Bet already resolved");
        }

        if (correctOptionIndex < 0 || correctOptionIndex >= bet.getOptions().size()) {
            throw new IllegalArgumentException("Invalid correct option index");
        }
        bet.setCorrectOptionIndex(correctOptionIndex);

        for (Tip tip : bet.getTips()) {
            if (tip.getSelectedOptionIndex() == correctOptionIndex) {
                tip.setPoints(1);
            }
        }

        bet.setResolved(true);
    }

    public void addParticipant(String tournamentId, String userId, String code) {
        Tournament tournament = getTournamentById(tournamentId).orElseThrow(() -> new IllegalArgumentException("Tournament not found"));
        AppUser user = appUserService.getUserById(userId).orElseThrow(() -> new IllegalArgumentException("User not found"));

        long activeCount = getActiveTournamentsCountForUser(user);
        if (activeCount >= 3) {
            throw new IllegalStateException("User can be member of at most 3 active tournaments");
        }
        if (!tournament.getInviteCode().equals(code)) {
            throw new IllegalArgumentException("Invalid invite code");
        }

        tournament.getParticipants().add(user);
        user.getMyTournaments().add(tournament);
    }

    public Optional<Tournament> getTournamentById(String id) {
        return Optional.ofNullable(tournaments.get(id));
    }

    private String generateInviteCode() {
        return UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    public TournamentResponse getTournamentResponse(String id) {
        Tournament tournament = getTournamentById(id).orElse(null);
        if (tournament == null) {
            return null;
        }

        return TournamentResponse.builder()
                .id(tournament.getId())
                .adminName(tournament.getAdmin().getName())
                .name(tournament.getName())
                .inviteCode(tournament.getInviteCode())
                .start(tournament.getStart())
                .durationDays(tournament.getDurationDays())
                .participantNames(tournament.getParticipants().stream().map(AppUser::getName).toList())
                .build();
    }

    private long getActiveTournamentsCountForUser(AppUser user) {
        LocalDateTime now = LocalDateTime.now();
        long activeMyTournaments = user.getMyTournaments().stream()
                .filter(t -> isActive(t, now))
                .count();
        long activeAdministered = user.getAdministeredTournaments().stream()
                .filter(t -> isActive(t, now))
                .count();
        return activeMyTournaments + activeAdministered;
    }

    private boolean isActive(Tournament tournament, LocalDateTime now) {
        LocalDateTime end = tournament.getStart().plusDays(tournament.getDurationDays());
        return end.isAfter(now);
    }


}