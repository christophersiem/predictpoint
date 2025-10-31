package de.csiem.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.csiem.backend.dto.LoginRequest;
import de.csiem.backend.model.AppUser;
import de.csiem.backend.service.AppUserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@AutoConfigureMockMvc
@SpringBootTest
class AppUserControllerTest {

    @Autowired
    private MockMvc mockMvc;
    @MockitoBean
    private AppUserService appUserService;
    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void login_withValidId_setsSessionAndReturnsOk() throws Exception {
        String id = "test-id";
        AppUser mockUser = AppUser.builder().id(id).name("TestUser").build();
        when(appUserService.login(id)).thenReturn(Optional.of(mockUser));

        LoginRequest request = new LoginRequest();
        request.setId(id);

        mockMvc.perform(post("/api/user/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(content().json("{\"id\":\"test-id\",\"name\":\"TestUser\"}"));


    }
}