package de.csiem.backend.service;

import de.csiem.backend.model.Bet;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class BetService {

    public Bet createBet(String question, List<String> options) {

        String id = UUID.randomUUID().toString();

        return Bet.builder()
                .id(id)
                .question(question)
                .options(options)
                .build();
    }

}
