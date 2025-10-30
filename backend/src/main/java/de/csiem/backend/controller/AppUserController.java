package de.csiem.backend.controller;

import de.csiem.backend.dto.CreateAppUserRequest;
import de.csiem.backend.service.AppUserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
