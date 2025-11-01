package de.csiem.backend.controller;



import de.csiem.backend.dto.TipResponse;
import de.csiem.backend.dto.TipRequest;
import de.csiem.backend.service.TipService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tips")
@RequiredArgsConstructor
public class TipController {

    private final TipService tipService;

    @PostMapping
    public ResponseEntity<?> submitTip(@RequestBody TipRequest request, HttpSession session) {
        String userId = (String) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        try {
            TipResponse resp = tipService.submitTip(userId, request);
            return ResponseEntity.ok(resp);
        } catch (IllegalArgumentException | IllegalStateException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }
}
