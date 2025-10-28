package de.csiem.backend.model;


import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import org.hibernate.validator.constraints.URL;


import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
public class Bet {

    private final String id;
    @Builder.Default
    private final Status status = Status.OPEN;
    private final String question;
    private final List<String> options;
    @Builder.Default
    private final int correctOptionIndex = -1;
    private final boolean resolved;
    @NotNull(message = "Open until timestamp must not be null")
    @Future(message = "Open until must be in the future")
    private final LocalDateTime openUntil;
    @URL(message = "Invalid YouTube URL")
    private final String youtubeUrl;
}


