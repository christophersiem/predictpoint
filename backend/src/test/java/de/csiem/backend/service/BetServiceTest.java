package de.csiem.backend.service;

import de.csiem.backend.model.Bet;
import org.junit.jupiter.api.Test;


import java.util.ArrayList;
import java.util.List;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.notNullValue;


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

}