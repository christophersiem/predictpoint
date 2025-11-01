package de.csiem.backend.model;


import jakarta.persistence.*;
import lombok.*;


import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "bets")  // Tabellen-Name
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Bet {
    @Id
    private String id;
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Status status = Status.OPEN;
    @ManyToOne
    @JoinColumn(name = "tournament_id")
    private Tournament tournament;

    private String question;
    @ElementCollection
    @CollectionTable(
            name = "bet_options",
            joinColumns = @JoinColumn(name = "bet_id")
    )
    @Column(name = "option_text")
    @Builder.Default
    private List<String> options = new ArrayList<>();
    @Builder.Default
    private int correctOptionIndex = -1;
    private boolean resolved;
    private LocalDateTime openUntil;
    private String youtubeUrl;
    @OneToMany(mappedBy = "bet", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Tip> tips = new ArrayList<>();
}
