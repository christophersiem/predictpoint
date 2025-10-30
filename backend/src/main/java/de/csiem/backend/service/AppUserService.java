package de.csiem.backend.service;

import de.csiem.backend.model.AppUser;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class AppUserService {

    private final Map<String, AppUser> users = new HashMap<>();

    public String createAppUser(String name) {
        boolean nameExists = users.values().stream()
                .anyMatch(user -> user.getName().equalsIgnoreCase(name));
        if (nameExists) {
            throw new IllegalArgumentException("Name already taken");
        }

        String id = UUID.randomUUID().toString();
        AppUser user = AppUser.builder()
                .id(id)
                .name(name)
                .build();
        users.put(id, user);
        return id;
    }

    public Optional<AppUser> getUserById(String id) {
        return Optional.ofNullable(users.get(id));
    }

    public Optional<String> getUserNameById(String id) {
        return getUserById(id).map(AppUser::getName);
    }
}
