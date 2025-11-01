package de.csiem.backend.mapper;

import de.csiem.backend.dto.BetResponse;
import de.csiem.backend.dto.TipResponse;
import de.csiem.backend.model.Bet;
import de.csiem.backend.model.Tip;
import org.springframework.stereotype.Component;

@Component
public class BetMapper {

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
