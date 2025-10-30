package de.csiem.backend.service;

import de.csiem.backend.model.AppUser;
import de.csiem.backend.model.Bet;
import de.csiem.backend.model.Status;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BetServiceTest {

    @Mock
    private AppUserService appUserService;
    private BetService betService;

    @BeforeEach
    void setUp() {
        betService = new BetService(appUserService);
    }

    private AppUser getTestUser() {
        return AppUser.builder()
                .id("test-user-id")
                .name("TestUser")
                .build();
    }

    @Test
    void createBet_withValidOptions_assignsUuidAndSetsProperties() {
        // GIVEN
        String question = "What is the color of Mikes tshirt?";
        List<String> options = new ArrayList<>(List.of("yellow", "blue", "red"));
        LocalDateTime openUntil = LocalDateTime.now().plusDays(1);
        String youtubeUrl = "https://youtube.com/watch?v=test";

        AppUser mockUser = getTestUser();
        when(appUserService.getUserById(mockUser.getId())).thenReturn(Optional.of(mockUser));

        // WHEN
        Bet result = betService.createBet(question, options, openUntil, youtubeUrl, mockUser.getId());

        // THEN
        assertThat(result.getId()).isNotNull();
        assertThat(result.getOptions()).isEqualTo(options);
        assertThat(result.getStatus()).isEqualTo(Status.OPEN);
        assertThat(result.getCorrectOptionIndex()).isEqualTo(-1);
        assertThat(result.isResolved()).isEqualTo(false);
        assertThat(result.getOpenUntil()).isEqualTo(openUntil);
        assertThat(result.getYoutubeUrl()).isEqualTo(youtubeUrl);
        assertThat(mockUser.getMyBets()).contains(result);
    }

    @Test
    void createBet_withInvalidUserId_throwsException() {
        // GIVEN
        String question = "What is the color of Mikes tshirt?";
        List<String> options = new ArrayList<>(List.of("yellow", "blue", "red"));
        LocalDateTime openUntil = LocalDateTime.now().plusDays(1);
        String youtubeUrl = "https://youtube.com/watch?v=test";
        String invalidUserId = "invalid-id";

        when(appUserService.getUserById(invalidUserId)).thenReturn(Optional.empty());

        // WHEN -> THEN
        assertThatThrownBy(() -> betService.createBet(question, options, openUntil, youtubeUrl, invalidUserId))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("User not found");
    }

    @Test
    void createBet_defensiveCopy_preventsExternalModifications() {
        // GIVEN
        String question = "What is the color of Mikes tshirt?";
        List<String> originalOptions = new ArrayList<>(List.of("yellow", "blue", "red"));
        LocalDateTime openUntil = LocalDateTime.now().plusDays(1);
        String youtubeUrl = "https://youtube.com/watch?v=test";


        AppUser mockUser = getTestUser();
        when(appUserService.getUserById(mockUser.getId())).thenReturn(Optional.of(mockUser));

        // WHEN
        Bet bet = betService.createBet(question, originalOptions, openUntil, youtubeUrl, mockUser.getId());

        originalOptions.add("black");

        // THEN
        assertThat(bet.getOptions()).hasSize(3);
        assertThat(bet.getOptions()).containsExactly("yellow", "blue", "red");
    }


    @Test
    void getBetById_withExistingId_returnsBet() {
        // GIVEN
        String question = "What is the color of Mikes tshirt?";
        List<String> options = List.of("yellow", "blue", "red");
        LocalDateTime openUntil = LocalDateTime.now().plusDays(1);
        String youtubeUrl = "https://youtube.com/watch?v=test";

        AppUser mockUser = getTestUser();
        when(appUserService.getUserById(mockUser.getId())).thenReturn(Optional.of(mockUser));

        Bet createdBet = betService.createBet(question, options, openUntil, youtubeUrl, mockUser.getId());
        String existingId = createdBet.getId();

        // WHEN
        Optional<Bet> result = betService.getBetById(existingId);

        // THEN
        assertThat(result).isPresent();
        assertThat(result.get())
                .isEqualTo(createdBet)
                .extracting(Bet::getQuestion)
                .isEqualTo(question);
        assertThat(result.get().getOpenUntil()).isEqualTo(openUntil);
        assertThat(result.get().getYoutubeUrl()).isEqualTo(youtubeUrl);
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