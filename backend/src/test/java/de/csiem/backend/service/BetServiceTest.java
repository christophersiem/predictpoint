package de.csiem.backend.service;

import de.csiem.backend.model.Bet;
import de.csiem.backend.model.Status;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class BetServiceTest {

    private final BetService betService = new BetService();

    @Test
    void createBet_withValidOptions_assignsUuidAndSetsProperties() {
        // GIVEN
        String question = "What is the color of Mikes tshirt?";
        List<String> options = new ArrayList<>(List.of("yellow", "blue", "red"));

        // WHEN
        Bet result = betService.createBet(question, options);

        // THEN
        assertThat(result.getId()).isNotNull();
        assertThat(result.getOptions()).isEqualTo(options);
        assertThat(result.getStatus()).isEqualTo(Status.OPEN);
        assertThat(result.getCorrectOptionIndex()).isEqualTo(-1);
        assertThat(result.isResolved()).isEqualTo(false);
    }


    @Test
    void createBet_defensiveCopy_preventsExternalModifications() {
        List<String> originalOptions = new ArrayList<>(List.of("Ja", "Nein"));
        Bet bet = betService.createBet("Lange Frage?", originalOptions);

        originalOptions.add("Vielleicht");

        assertThat(bet.getOptions()).hasSize(2);
    }

    @Test
    void getBetById_withExistingId_returnsBet() {
        // GIVEN
        String question = "Valid question here?";
        List<String> options = List.of("Option1", "Option2");
        Bet createdBet = betService.createBet(question, options);
        String existingId = createdBet.getId();

        // WHEN
        Optional<Bet> result = betService.getBetById(existingId);

        // THEN
        assertThat(result).isPresent();
        assertThat(result.get())
                .isEqualTo(createdBet)
                .extracting(Bet::getQuestion)
                .isEqualTo(question);
    }

    @Test
    void getBetById_withNonExistingId_returnsEmptyOptional() {
        // GIVEN
        String nonExistingId = "invalid-id";

        // WHEN
        Optional<Bet> result = betService.getBetById(nonExistingId);

        // THEN
        assertThat(result).isEmpty();
    }

    @Test
    void getBetById_withNullId_throwsException() {
        // WHEN -> THEN
        assertThatThrownBy(() -> betService.getBetById(null))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("ID cannot be null");
    }
}