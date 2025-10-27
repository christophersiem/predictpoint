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

import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
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

        // GIVEN
        String question = "Valid long question?";
        List<String> options = List.of("Option1", "Option2");
        CreateBetRequest request = new CreateBetRequest();
        request.setQuestion(question);
        request.setOptions(options);
        Bet mockedBet = Bet.builder()
                .id("test-id")
                .question(question)
                .options(options)
                .build();
        when(betService.createBet(any(String.class), any(List.class))).thenReturn(mockedBet);

        // WHEN:
        mockMvc.perform(MockMvcRequestBuilders.post("/bets")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))

                // THEN
                .andExpect(status().isCreated())
                .andExpect(header().string("Location", "http://localhost/bets/test-id"))
                .andExpect(jsonPath("$.id").value("test-id"))
                .andExpect(jsonPath("$.question").value(question));
    }

    @Test
    void createBet_withInvalidRequest_returnsBadRequest() throws Exception {

        // GIVEN
        CreateBetRequest invalidRequest = new CreateBetRequest();
        invalidRequest.setQuestion("short");
        invalidRequest.setOptions(List.of("only one"));

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
        // GIVEN
        String id = "non-existing-id";
        when(betService.getBetById(id)).thenReturn(Optional.empty());

        // WHEN: Perform GET
        mockMvc.perform(MockMvcRequestBuilders.get("/bets/{id}", id))
                // THEN
                .andExpect(status().isNotFound());
    }
}
