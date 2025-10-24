package de.csiem.backend.service;

import de.csiem.backend.model.Bet;
import org.junit.jupiter.api.Test;


import java.util.ArrayList;
import java.util.List;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.assertThrows;


class BetServiceTest {

    private final BetService betService = new BetService();

    @Test
    void createBet_withValidOptions_assignsUuidAndSetsProperties() {

        //GIVEN
        String question = "What is the color of Mikes tshirt?";
        List<String> options = new ArrayList<>(List.of("yellow", "blue", "red"));

        //WHEN
        Bet result = betService.createBet(question, options);

        //THEN
        assertThat(result.getId(), notNullValue());
        assertThat(result.getOptions(), equalTo(options));
        assertThat(result.getCorrectOptionIndex(), equalTo(-1));
        assertThat(result.isResolved(), equalTo(false));
    }

    @Test
    void createBet_withNotEnoughOptions_throwsError() {

        //GIVEN
        String question = "What is the color of Mikes tshirt?";
        List<String> options = new ArrayList<>(List.of("red"));

        //WHEN -> THEN
        assertThrows(IllegalArgumentException.class, () -> betService.createBet(question, options));
    }

    @Test
    void createBet_withTooManyOptions_throwsError() {

        //GIVEN
        String question = "What is the color of Mikes tshirt?";
        List<String> options = new ArrayList<>(List.of("yellow", "blue", "red", "green", "white"));
        //WHEN -> THEN
        assertThrows(IllegalArgumentException.class, () -> betService.createBet(question, options));
    }

    @Test
    void createBet_withNoQuestion_throwsError() {

        //GIVEN
        String question = null;
        List<String> options = new ArrayList<>(List.of("yellow", "blue", "red"));
        //WHEN -> THEN
        assertThrows(IllegalArgumentException.class, () -> betService.createBet(question, options));
    }

    @Test
    void createBet_defensiveCopy_preventsExternalModifications() {
        List<String> originalOptions = new ArrayList<>(List.of("Ja", "Nein"));
        Bet bet = betService.createBet("Lange Frage?", originalOptions);

        originalOptions.add("Vielleicht");

        assertThat(bet.getOptions(), hasSize(2));

    }
}