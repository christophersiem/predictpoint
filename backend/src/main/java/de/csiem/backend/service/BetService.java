package de.csiem.backend.service;

import de.csiem.backend.model.Bet;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class BetService {

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

        return Bet.builder()
                .id(id)
                .question(question)
                .options(options)
                .build();
    }

}
