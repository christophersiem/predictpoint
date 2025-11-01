package de.csiem.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tips")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Tip {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private AppUser user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bet_id", nullable = false)
    private Bet bet;

    private int selectedOptionIndex;

    private String selectedAnswer;

    @Builder.Default
    private int points = 0;
}
