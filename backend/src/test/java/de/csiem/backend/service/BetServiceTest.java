package de.csiem.backend.service;

import de.csiem.backend.dto.BetResponse;
import de.csiem.backend.model.AppUser;
import de.csiem.backend.model.Bet;
import de.csiem.backend.model.Status;
import de.csiem.backend.model.Tournament;
import de.csiem.backend.repository.BetRepository;
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

    @Mock
    private TournamentService tournamentService;
    @Mock
    private BetRepository betRepository;
    @Mock
    private IdService idService;

    private BetService betService;

    @BeforeEach
    void setUp() {
        betService = new BetService(appUserService, tournamentService, betRepository, idService);
    }

    @Test
    void createBet_withValidInput_createsBetAndAddsToTournament() {
        // GIVEN
        String question = "What is the color of Mikes tshirt?";
        List<String> options = new ArrayList<>(List.of("yellow", "blue", "red"));
        LocalDateTime openUntil = LocalDateTime.now().plusDays(1);
        String youtubeUrl = "https://youtube.com/watch?v=test";
        String tournamentId = "test-tournament-id";
        String userId = "test-user-id";

        AppUser mockUser = AppUser.builder().id(userId).name("TestAdmin").build();
        Tournament mockTournament = Tournament.builder()
                .id(tournamentId)
                .admin(mockUser)
                .name("Test Tournament")
                .bets(new ArrayList<>())
                .build();

        when(tournamentService.getTournamentById(tournamentId)).thenReturn(mockTournament);
        when(appUserService.getUserById(userId)).thenReturn(Optional.of(mockUser));

        // WHEN
        BetResponse result = betService.createBet(question, options, openUntil, youtubeUrl, tournamentId, userId);

        // THEN
        assertThat(result.getId()).isNotNull();
        assertThat(result.getQuestion()).isEqualTo(question);
        assertThat(result.getOptions()).isEqualTo(options);
        assertThat(result.getOpenUntil()).isEqualTo(openUntil);
        assertThat(result.getYoutubeUrl()).isEqualTo(youtubeUrl);
        assertThat(result.getStatus()).isEqualTo(Status.OPEN);
        assertThat(result.getCorrectOptionIndex()).isEqualTo(-1);
        assertThat(result.isResolved()).isFalse();
        //assertThat(mockTournament.getBets()).contains(result);
    }


    @Test
    void createBet_withNonAdminUser_throwsException() {
        // GIVEN
        String question = "Test Question";
        List<String> options = List.of("A", "B");
        LocalDateTime openUntil = LocalDateTime.now().plusDays(1);
        String youtubeUrl = "https://youtube.com/test";
        String tournamentId = "test-tournament";
        String userId = "non-admin-user";

        AppUser admin = AppUser.builder().id("admin-id").name("Admin").build();
        AppUser nonAdmin = AppUser.builder().id(userId).name("NonAdmin").build();
        Tournament mockTournament = Tournament.builder()
                .id(tournamentId)
                .admin(admin)
                .bets(new ArrayList<>())
                .build();

        when(tournamentService.getTournamentById(tournamentId)).thenReturn(mockTournament);
        when(appUserService.getUserById(userId)).thenReturn(Optional.of(nonAdmin));

        // WHEN / THEN
        assertThatThrownBy(() -> betService.createBet(question, options, openUntil, youtubeUrl, tournamentId, userId))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Only admin can create bets");
    }

    @Test
    void createBet_defensiveCopy_preventsExternalModifications() {
        // GIVEN
        String question = "Test Question";
        List<String> originalOptions = new ArrayList<>(List.of("A", "B"));
        LocalDateTime openUntil = LocalDateTime.now().plusDays(1);
        String youtubeUrl = "https://youtube.com/test";
        String tournamentId = "test-tournament";
        String userId = "test-user";

        AppUser mockUser = AppUser.builder().id(userId).name("TestUser").build();
        Tournament mockTournament = Tournament.builder()
                .id(tournamentId)
                .admin(mockUser)
                .bets(new ArrayList<>())
                .build();

        when(tournamentService.getTournamentById(tournamentId)).thenReturn(mockTournament);
        when(appUserService.getUserById(userId)).thenReturn(Optional.of(mockUser));

        // WHEN
        BetResponse bet = betService.createBet(question, originalOptions, openUntil, youtubeUrl, tournamentId, userId);

        // Modify original
        originalOptions.add("C");

        // THEN
        assertThat(bet.getOptions()).hasSize(2);
        assertThat(bet.getOptions()).containsExactly("A", "B");
    }

    @Test
    void getBetById_withExistingId_returnsBet() {
        // GIVEN
        String question = "Test Question";
        List<String> options = List.of("A", "B");
        LocalDateTime openUntil = LocalDateTime.now().plusDays(1);
        String youtubeUrl = "https://youtube.com/test";
        String tournamentId = "test-tournament";
        String userId = "test-user";

        AppUser mockUser = AppUser.builder().id(userId).name("TestUser").build();
        Tournament mockTournament = Tournament.builder()
                .id(tournamentId)
                .admin(mockUser)
                .bets(new ArrayList<>())
                .build();

        when(tournamentService.getTournamentById(tournamentId)).thenReturn(mockTournament);
        when(appUserService.getUserById(userId)).thenReturn(Optional.of(mockUser));
        when(idService.createUUID()).thenReturn("mock-id");
        when(betRepository.findById("mock-id")).thenReturn(Optional.of(Bet.builder().options(options).id("mock-id").question(question).build()));

        BetResponse createdBet = betService.createBet(question, options, openUntil, youtubeUrl, tournamentId, userId);
        String id = createdBet.getId();

        // WHEN
        Optional<BetResponse> result = betService.getBetById(id);

        // THEN
        assertThat(result).isPresent();
        assertThat(result.get().getId()).isEqualTo(id);
        assertThat(result.get().getQuestion()).isEqualTo(question);
    }

    @Test
    void getBetById_withNonExistingId_returnsEmpty() {
        // WHEN
        Optional<BetResponse> result = betService.getBetById("invalid");

        // THEN
        assertThat(result).isEmpty();
    }

    @Test
    void getBetById_withNullId_throwsException() {

        //  THEN
        assertThatThrownBy(() -> betService.getBetById(null))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("ID cannot be null or blank");
    }
}