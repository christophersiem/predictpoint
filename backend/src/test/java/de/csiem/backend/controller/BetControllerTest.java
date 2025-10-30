package de.csiem.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.csiem.backend.dto.CreateBetRequest;
import de.csiem.backend.model.Bet;
import de.csiem.backend.service.BetService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


@SpringBootTest
@AutoConfigureMockMvc
class BetControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private BetService betService;

    @Test
    void createBet_withValidRequest_returnsCreatedWithLocation() throws Exception {
        String question = "Valid long question?";
        List<String> options = List.of("Option1", "Option2");
        LocalDateTime openUntil = LocalDateTime.now().plusDays(1);
        String youtubeUrl = "https://youtube.com/watch?v=test";
        String userId = "test-user-id";

        CreateBetRequest request = new CreateBetRequest();
        request.setQuestion(question);
        request.setOptions(options);
        request.setOpenUntil(openUntil);
        request.setYoutubeUrl(youtubeUrl);

        Bet mockedBet = Bet.builder()
                .id("test-id")
                .question(question)
                .options(options)
                .openUntil(openUntil)
                .youtubeUrl(youtubeUrl)
                .build();
        when(betService.createBet(any(String.class), any(List.class), any(LocalDateTime.class), any(String.class), eq(userId)))
                .thenReturn(mockedBet);

        // WHEN
        mockMvc.perform(MockMvcRequestBuilders.post("/bets")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request))
                        .sessionAttr("userId", userId))
                // THEN
                .andExpect(status().isCreated())
                .andExpect(header().string("Location", "http://localhost/bets/test-id"))
                .andExpect(jsonPath("$.id").value("test-id"))
                .andExpect(jsonPath("$.question").value(question))
                .andExpect(jsonPath("$.openUntil").exists())
                .andExpect(jsonPath("$.youtubeUrl").value(youtubeUrl));
    }
    @Test
    void createBet_withInvalidRequest_returnsBadRequest() throws Exception {

        // GIVEN
        CreateBetRequest invalidRequest = new CreateBetRequest();
        invalidRequest.setQuestion("short");
        invalidRequest.setOptions(List.of("only one"));
        invalidRequest.setOpenUntil(LocalDateTime.now().plusDays(1));
        invalidRequest.setYoutubeUrl("https://youtube.com/watch?v=test");

        // WHEN

        mockMvc.perform(MockMvcRequestBuilders.post("/bets")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                // THEN
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.question").value("Question too short (minimum 8 characters)"))
                .andExpect(jsonPath("$.errors.options").value("Options must be between 2 and 4"))
                .andExpect(jsonPath("$.status").value(400));
    }

    @Test
    void getById_withExistingId_returnsBet() throws Exception {
        // GIVEN
        String id = "test-id";
        Bet mockedBet = Bet.builder()
                .id(id)
                .question("Valid question")
                .options(List.of("A", "B"))
                .build();
        when(betService.getBetById(id)).thenReturn(Optional.of(mockedBet));

        // WHEN
        mockMvc.perform(MockMvcRequestBuilders.get("/bets/{id}", id))
                // THEN
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(id))
                .andExpect(jsonPath("$.question").value("Valid question"));
    }

    @Test
    void getById_withNonExistingId_returnsNotFound() throws Exception {
        //GIVEN
        String id = "non-existing-id";
        when(betService.getBetById(id)).thenReturn(Optional.empty());

        // WHEN
        mockMvc.perform(MockMvcRequestBuilders.get("/bets/{id}", id))
                // THEN
                .andExpect(status().isNotFound());
    }
}
