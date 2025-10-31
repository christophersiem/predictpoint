package de.csiem.backend.controller;

import de.csiem.backend.dto.CreateTournamentRequest;
import de.csiem.backend.dto.JoinTournamentRequest;
import de.csiem.backend.dto.TournamentResponse;
import de.csiem.backend.service.TournamentService;
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
@RequestMapping("/tournaments")
public class TournamentController {

    private final TournamentService tournamentService;

    @PostMapping
    public ResponseEntity<TournamentResponse> createTournament(@RequestBody @Valid CreateTournamentRequest request, HttpSession session, UriComponentsBuilder uriBuilder) {
        String userId = (String) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        TournamentResponse createdTournament = tournamentService.createTournament(request.getName(), request.getStart(), request.getDurationDays(), userId);
        URI location = uriBuilder.path("/tournaments/{id}").buildAndExpand(createdTournament.getId()).toUri();
        return ResponseEntity.created(location).body(createdTournament);
    }

    @PostMapping("/{id}/join")
    public ResponseEntity<String> joinTournament(@PathVariable String id, @RequestBody @Valid JoinTournamentRequest request, HttpSession session) {
        String userId = (String) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not logged in");
        }

        tournamentService.addParticipant(id, userId, request.getCode());
        return ResponseEntity.ok("Successfully joined the tournament");
    }

    @GetMapping("/{id}")
    public ResponseEntity<TournamentResponse> getTournamentById(@PathVariable String id, HttpSession session) {
        String userId = (String) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        TournamentResponse response = tournamentService.getTournamentResponse(id);
        return response != null ? ResponseEntity.ok(response) : ResponseEntity.notFound().build();
    }
}