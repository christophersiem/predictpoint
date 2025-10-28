package de.csiem.backend.service;

import de.csiem.backend.model.Bet;
import de.csiem.backend.model.Status;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
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
        List<String> options = List.of("yellow", "blue", "red");
        LocalDateTime openUntil = LocalDateTime.now().plusDays(1);
        String youtubeUrl = "https://youtube.com/watch?v=test";

        // WHEN
        Bet result = betService.createBet(question, options, openUntil, youtubeUrl);

        // THEN
        assertThat(result.getId()).isNotNull();
        assertThat(result.getOptions()).isEqualTo(options);
        assertThat(result.getStatus()).isEqualTo(Status.OPEN);
        assertThat(result.getCorrectOptionIndex()).isEqualTo(-1);
        assertThat(result.isResolved()).isEqualTo(false);
        assertThat(result.getOpenUntil()).isEqualTo(openUntil);
        assertThat(result.getYoutubeUrl()).isEqualTo(youtubeUrl);
    }


    @Test
    void createBet_defensiveCopy_preventsExternalModifications() {
        String question = "What is the color of Mikes tshirt?";
        List<String> options = List.of("yellow", "blue", "red");
        LocalDateTime openUntil = LocalDateTime.now().plusDays(1);
        String youtubeUrl = "https://youtube.com/watch?v=test";
        Bet bet = betService.createBet(question, options, openUntil, youtubeUrl);

        options.add("black");

        assertThat(bet.getOptions()).hasSize(2);
    }

    @Test
    void getBetById_withExistingId_returnsBet() {
        // GIVEN
        String question = "What is the color of Mikes tshirt?";
        List<String> options = List.of("yellow", "blue", "red");
        LocalDateTime openUntil = LocalDateTime.now().plusDays(1);
        String youtubeUrl = "https://youtube.com/watch?v=test";
        Bet createdBet = betService.createBet(question, options, openUntil, youtubeUrl);
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