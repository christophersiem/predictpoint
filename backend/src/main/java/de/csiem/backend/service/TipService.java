package de.csiem.backend.service;

import de.csiem.backend.dto.TipRequest;
import de.csiem.backend.dto.TipResponse;
import de.csiem.backend.model.AppUser;
import de.csiem.backend.model.Bet;
import de.csiem.backend.model.Tip;
import de.csiem.backend.repository.AppUserRepository;
import de.csiem.backend.repository.BetRepository;
import de.csiem.backend.repository.TipRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TipService {

    private final TipRepository tipRepository;
    private final BetRepository betRepository;
    private final AppUserRepository appUserRepository;

    @Transactional
    public TipResponse submitTip(String userId, TipRequest req) {
        AppUser user = appUserRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Bet bet = betRepository.findById(req.betId())
                .orElseThrow(() -> new IllegalArgumentException("Bet not found"));

        if (bet.isResolved()) {
            throw new IllegalStateException("Bet already resolved");
        }
        int idx = resolveIndex(req);
        validateIndexAgainstOptions(idx, bet);

        String answer = resolveAnswer(req, bet, idx);

        String tipId = UUID.randomUUID().toString();
        int changed = tipRepository.upsertIfOpen(tipId, bet.getId(), user.getId(), idx, answer);

        if (changed == 0) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Bet is closed");
        }

        Tip saved = tipRepository.findByUser_IdAndBet_Id(user.getId(), bet.getId())
                .orElseThrow();


        return toResponse(bet, saved);
    }

    private static int resolveIndex(TipRequest req) {
        return req.selectedOptionIndex() != null ? req.selectedOptionIndex() : -1;
    }

    private static void validateIndexAgainstOptions(int idx, Bet bet) {
        if (idx >= 0) {
            List<String> opts = bet.getOptions();
            if (opts == null || idx >= opts.size()) {
                throw new IllegalArgumentException("Option index out of range");
            }
        }
    }

    private static String resolveAnswer(TipRequest req, Bet bet, int idx) {
        if (idx >= 0) return bet.getOptions().get(idx);
        return req.selectedAnswer();
    }

    private static TipResponse toResponse(Bet bet, Tip tip ) {

        return TipResponse.builder()
                .id(tip.getId())
                .betId(bet.getId())
                .selectedOptionIndex(tip.getSelectedOptionIndex())
                .selectedAnswer(tip.getSelectedAnswer())
                .build();
    }

}