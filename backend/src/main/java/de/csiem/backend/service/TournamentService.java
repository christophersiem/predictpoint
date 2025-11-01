package de.csiem.backend.service;

import de.csiem.backend.dto.BetResponse;
import de.csiem.backend.dto.TournamentResponse;
import de.csiem.backend.mapper.BetMapper;
import de.csiem.backend.model.AppUser;
import de.csiem.backend.model.Bet;
import de.csiem.backend.model.Tip;
import de.csiem.backend.model.Tournament;
import de.csiem.backend.repository.TournamentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TournamentService {

    private final AppUserService appUserService;
    private final TournamentRepository tournamentRepository;
    private final BetMapper betMapper;
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

        tournamentRepository.save(tournament);

        return toResponse(tournament, userId);
    }

    public void addBet(String tournamentId, Bet bet, String userId) {
        Tournament tournament = getTournamentById(tournamentId);
        AppUser user = appUserService.getUserById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (!tournament.getAdmin().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Only admin can add bets");
        }

        bet.setTournament(tournament);
        tournament.getBets().add(bet);
        tournamentRepository.save(tournament);
    }


    public void resolveBet(String tournamentId, String betId, int correctOptionIndex, String userId) {
        Tournament tournament = getTournamentById(tournamentId);
        AppUser user = appUserService.getUserById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

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
        bet.setResolved(true);
        bet.setStatus(de.csiem.backend.model.Status.RESOLVED);

        for (Tip tip : bet.getTips()) {
            if (tip.getSelectedOptionIndex() == correctOptionIndex) {
                tip.setPoints(1);
            } else {
                tip.setPoints(0);
            }
        }

        tournamentRepository.save(tournament);
    }

    public void addParticipant(String tournamentId, String userId, String code) {
        Tournament tournament = getTournamentById(tournamentId);
        AppUser user = appUserService.getUserById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        long activeCount = getActiveTournamentsCountForUser(user);
        if (activeCount >= 3) {
            throw new IllegalStateException("User can be member of at most 3 active tournaments");
        }

        if (!tournament.getInviteCode().equals(code)) {
            throw new IllegalArgumentException("Invalid invite code");
        }

        tournament.getParticipants().add(user);
        user.getMyTournaments().add(tournament);
        tournamentRepository.save(tournament);
    }

    public Tournament getTournamentById(String id) {
        return tournamentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Tournament not found"));
    }

    public List<TournamentResponse> getTournamentsByAppUser(String userId) {
        List<Tournament> tournaments = tournamentRepository.findAllByUserId(userId);
        return tournaments.stream()
                .map(t -> toResponse(t, userId))
                .toList();
    }


    private String generateInviteCode() {
        return UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    public TournamentResponse toResponse(Tournament tournament, String currentUserId) {
        LocalDateTime now = LocalDateTime.now();

        List<BetResponse> active = new ArrayList<>();
        List<BetResponse> past = new ArrayList<>();
        List<BetResponse> resolved = new ArrayList<>();

        for (Bet bet : tournament.getBets()) {
            BetResponse betDto = betMapper.toResponse(bet, currentUserId);

            if (bet.isResolved()) {
                resolved.add(betDto);
            } else if (bet.getOpenUntil() != null && bet.getOpenUntil().isBefore(now)) {
                past.add(betDto);
            } else {
                active.add(betDto);
            }
        }

        return TournamentResponse.builder()
                .id(tournament.getId())
                .adminId(tournament.getAdmin().getId())
                .adminName(tournament.getAdmin().getName())
                .name(tournament.getName())
                .inviteCode(tournament.getInviteCode())
                .start(tournament.getStart())
                .durationDays(tournament.getDurationDays())
                .participantNames(
                        tournament.getParticipants().stream()
                                .map(AppUser::getName)
                                .toList()
                )
                .activeBets(active)
                .pastBets(past)
                .resolvedBets(resolved)
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
