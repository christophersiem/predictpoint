package de.csiem.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tournaments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Tournament {

    @Id
    private String id;

    @ManyToOne
    @JoinColumn(name = "admin_id", nullable = false)
    private AppUser admin;
    private String name;
    private String inviteCode;
    private LocalDateTime start;
    private int durationDays;

    @OneToMany(mappedBy = "tournament", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Bet> bets = new ArrayList<>();

    @ManyToMany
    @JoinTable(
            name = "tournament_participants",
            joinColumns = @JoinColumn(name = "tournament_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    @Builder.Default
    private List<AppUser> participants = new ArrayList<>();
}
