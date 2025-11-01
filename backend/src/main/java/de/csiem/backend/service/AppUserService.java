package de.csiem.backend.service;

import de.csiem.backend.dto.AppUserResponse;
import de.csiem.backend.model.AppUser;
import de.csiem.backend.model.Tournament;
import de.csiem.backend.repository.AppUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AppUserService {

    private final PasswordEncoder passwordEncoder;
    private final AppUserRepository appUserRepository;

    public String createAppUser(String name) {
        if (appUserRepository.existsByNameIgnoreCase(name)) {
            throw new IllegalArgumentException("Username already exists (case-insensitive)");
        }
        String loginId = UUID.randomUUID().toString();
        String hashedLoginId = passwordEncoder.encode(loginId);

        String internalId = UUID.randomUUID().toString();

        AppUser user = AppUser.builder()
                .id(internalId)
                .name(name)
                .hashedLoginId(hashedLoginId)
                .build();

        appUserRepository.save(user);
        return loginId;
    }

    public Optional<AppUser> login(String loginId) {
        return appUserRepository.findAll().stream()
                .filter(user -> passwordEncoder.matches(loginId, user.getHashedLoginId()))
                .findFirst();
    }
    public AppUserResponse getOtherUserResponse(String userId) {
        AppUser user = getUserById(userId).orElse(null);
        if (user == null) {
            return null;
        }

        return AppUserResponse.builder()
                .id(null)
                .name(user.getName())
                .createdAt(user.getCreatedAt())
                .build();
    }

    public void addAdministeredTournament(String userId, Tournament tournament) {
        AppUser user = getUserById(userId).orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (user.getAdministeredTournaments().size() >= 3) {
            throw new IllegalStateException("Max 3 administered tournaments allowed");
        }

        user.getAdministeredTournaments().add(tournament);
    }

    public Optional<AppUser> getUserById(String id) {
        return appUserRepository.findById(id);
    }

    public Optional<String> getUserNameById(String id) {
        return appUserRepository.findById(id).map(AppUser::getName);
    }
}
