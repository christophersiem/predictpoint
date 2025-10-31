package de.csiem.backend.model;


import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import org.hibernate.validator.constraints.URL;


import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
public class Bet {

    private final String id;
    @Builder.Default
    private final Status status = Status.OPEN;
    @Getter(onMethod_ = {@NotNull(message = "Question must not be null"), @Size(min = 8, message = "Question too short (minimum 8 characters)")})
    private final String question;
    @Getter(onMethod_ = {@NotNull(message = "Options must not be null"), @Size(min = 2, max = 4, message = "Options must be between 2 and 4")})
    private final List<String> options;
    @Builder.Default
    private int correctOptionIndex = -1;
    private boolean resolved;
    @Getter(onMethod_ = {@NotNull(message = "Open until timestamp must not be null"), @Future(message = "Open until must be in the future")})
    private final LocalDateTime openUntil;
    @Getter(onMethod_ = {@URL(message = "Invalid YouTube URL")})
    private final String youtubeUrl;
    @Builder.Default
    private final List<Tip> tips = new ArrayList<>();
}

