package de.csiem.backend.controller;


import de.csiem.backend.dto.CreateBetRequest;
import de.csiem.backend.model.Bet;
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
@RequestMapping("/bets")
public class BetController {

    private final BetService betService;

    @PostMapping
    public ResponseEntity<Bet> createBet(@RequestBody @Valid CreateBetRequest betRequest, UriComponentsBuilder uriBuilder, HttpSession session) {
        String userId = (String) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        Bet createdBet = betService.createBet(betRequest.getQuestion(), betRequest.getOptions(), betRequest.getOpenUntil(), betRequest.getYoutubeUrl(), userId);
        URI location = uriBuilder.path("/bets/{id}").buildAndExpand(createdBet.getId()).toUri();
        return ResponseEntity.created(location).body(createdBet);
    }

    @GetMapping("{id}")
    public ResponseEntity<Bet> getById(@PathVariable String id) {
        return ResponseEntity.of(betService.getBetById(id));
    }
}
