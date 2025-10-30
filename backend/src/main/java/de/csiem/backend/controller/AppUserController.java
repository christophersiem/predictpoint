package de.csiem.backend.controller;

import de.csiem.backend.dto.CreateAppUserRequest;
import de.csiem.backend.dto.LoginRequest;
import de.csiem.backend.model.AppUser;
import de.csiem.backend.service.AppUserService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
public class AppUserController {

    private final AppUserService appUserService;

    @PostMapping
    public ResponseEntity<String> createUser(@RequestBody @Valid CreateAppUserRequest request) {
        String id = appUserService.createAppUser(request.getName());
        return ResponseEntity.ok(id);
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest request, HttpSession session) {
        Optional<AppUser> user = appUserService.getUserById(request.getId());
        if (user.isPresent()) {
            session.setAttribute("userId", request.getId());
            return ResponseEntity.ok("Logged in as " + user.get().getName());
        } else {
            return ResponseEntity.badRequest().body("Invalid ID");
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok("Logged out successfully");
    }
}
