package de.csiem.backend.controller;


import de.csiem.backend.dto.BetResponse;
import de.csiem.backend.dto.CreateBetRequest;
import de.csiem.backend.dto.ResolveBetRequest;
import de.csiem.backend.service.BetService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/bets")
public class BetController {

    private final BetService betService;

    @PostMapping
    public ResponseEntity<BetResponse> createBet(@RequestBody @Valid CreateBetRequest betRequest, UriComponentsBuilder uriBuilder, String tournamentId, HttpSession session) {
        String userId = (String) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        BetResponse createdBet = betService.createBet(betRequest.getQuestion(), betRequest.getOptions(), betRequest.getOpenUntil(), betRequest.getYoutubeUrl(),tournamentId, userId);
        URI location = uriBuilder.path("/api/bets/{id}").buildAndExpand(createdBet.getId()).toUri();
        return ResponseEntity.created(location).body(createdBet);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BetResponse> getById(@PathVariable String id) {
        return ResponseEntity.of(betService.getBetById(id));
    }

    @PutMapping("/{id}/resolve")
    public ResponseEntity<BetResponse> resolveBet(
            @PathVariable("id") String betId,
            @RequestBody ResolveBetRequest req,
            HttpSession session
    ) {
        String userId = (String) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        try {
            BetResponse resp = betService.resolveBet(betId, userId, req.getCorrectOptionIndex());
            return ResponseEntity.ok(resp);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }
}
