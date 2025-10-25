package de.csiem.backend.service;

import de.csiem.backend.model.Bet;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class BetService {

    private final Map<String, Bet> bets = new HashMap<>();

    public Optional<Bet> getBetById(String id) {
        if (id == null) {
            throw new IllegalArgumentException("ID cannot be null");
        }
        return Optional.ofNullable(bets.get(id));
    }

    public Bet createBet(String question, List<String> options) {

        if (question == null) {
            throw new IllegalArgumentException("Question must not be null");
        }

        if (question.length() < 8) {
            throw new IllegalArgumentException("Question too short (minimum 8 characters)");
        }

        if (options == null || options.size() < 2 || options.size() > 4) {
            throw new IllegalArgumentException("Options must not be null and between 2 and 4");
        }

        String id = UUID.randomUUID().toString();

        Bet bet = Bet.builder()
                .id(id)
                .question(question)
                .options(new ArrayList<>(options))
                .build();
        bets.put(id, bet);
        return bet;
    }


}
