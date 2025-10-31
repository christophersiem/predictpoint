package de.csiem.backend.controller;

import de.csiem.backend.dto.CreateAppUserRequest;
import de.csiem.backend.dto.LoginRequest;
import de.csiem.backend.dto.LoginResponse;
import de.csiem.backend.model.AppUser;
import de.csiem.backend.service.AppUserService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user")
public class AppUserController {

    private final AppUserService appUserService;

    @PostMapping
    public ResponseEntity<String> createUser(@RequestBody @Valid CreateAppUserRequest request) {
        String id = appUserService.createAppUser(request.getName());
        return ResponseEntity.ok(id);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request, HttpSession session) {
        Optional<AppUser> user = appUserService.login(request.getId());
        if (user.isPresent()) {
            session.setAttribute("userId", user.get().getId());
            return ResponseEntity.ok(LoginResponse.builder().name(user.get().getName()).id(user.get().getId()).build());
        } else {
            return ResponseEntity
                    .badRequest().build();

        }
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok("Logged out successfully");
    }

    @GetMapping("/me")
    public ResponseEntity<LoginResponse> me(HttpSession session) {
        String userId = (String) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        return appUserService.getUserById(userId)
                .map(u -> ResponseEntity.ok(
                        LoginResponse.builder()
                                .id(u.getId())
                                .name(u.getName())
                                .build()
                ))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
    }

}
