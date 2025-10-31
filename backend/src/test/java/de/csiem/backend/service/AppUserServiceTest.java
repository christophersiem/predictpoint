package de.csiem.backend.service;

import de.csiem.backend.repository.AppUserRepository;
import lombok.RequiredArgsConstructor;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@RequiredArgsConstructor
class AppUserServiceTest {

    @MockitoBean
    private final AppUserRepository appUserRepository;
    @MockitoBean
    private final AppUserService appUserService;
    @Test
    void createAppUser_withDuplicateName_throwsException() {
        String name = "klaus";
        when(appUserRepository.existsByNameIgnoreCase(name)).thenReturn(true);

        assertThatThrownBy(() -> appUserService.createAppUser(name))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Username already exists (case-insensitive)");
    }

    @Test
    void createAppUser_withUniqueName_succeeds() {
        String name = "newuser";
        when(appUserRepository.existsByNameIgnoreCase(name)).thenReturn(false);

        String result = appUserService.createAppUser(name);
        assertThat(result).isNotNull();
    }

}