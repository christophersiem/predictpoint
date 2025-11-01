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
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class TipService {

    private final TipRepository tipRepository;
    private final BetRepository betRepository;
    private final AppUserRepository appUserRepository;

    public TipResponse submitTip(String userId, TipRequest req) {
        AppUser user = appUserRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Bet bet = betRepository.findById(req.betId())
                .orElseThrow(() -> new IllegalArgumentException("Bet not found"));

        if (bet.isResolved()) {
            throw new IllegalStateException("Bet already resolved");
        }
        if (bet.getOpenUntil() != null && bet.getOpenUntil().isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("Bet is closed");
        }

        int idx = req.selectedOptionIndex() != null ? req.selectedOptionIndex() : -1;
        String selectedAnswer = req.selectedAnswer();

        if (idx >= 0) {
            if (bet.getOptions() == null || idx >= bet.getOptions().size()) {
                throw new IllegalArgumentException("Option index out of range");
            }
            selectedAnswer = bet.getOptions().get(idx);
        }

        Tip tip = tipRepository
                .findByUser_IdAndBet_Id(userId, bet.getId())
                .orElse(null);

        if (tip == null) {
            tip = Tip.builder()
                    .user(user)
                    .bet(bet)
                    .selectedOptionIndex(idx)
                    .selectedAnswer(selectedAnswer)
                    .points(0)
                    .build();
        } else {
            tip.setSelectedOptionIndex(idx);
            tip.setSelectedAnswer(selectedAnswer);
        }

        Tip saved = tipRepository.save(tip);

        Boolean correct = null;
        if (bet.isResolved() && bet.getCorrectOptionIndex() >= 0) {
            correct = saved.getSelectedOptionIndex() == bet.getCorrectOptionIndex();
        }

        return TipResponse.builder()
                .id(saved.getId())
                .betId(bet.getId())
                .selectedOptionIndex(saved.getSelectedOptionIndex())
                .selectedAnswer(saved.getSelectedAnswer())
                .points(saved.getPoints())
                .correct(correct)
                .build();
    }


}
