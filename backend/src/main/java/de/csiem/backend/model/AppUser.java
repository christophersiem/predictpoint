package de.csiem.backend.model;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AppUser {

    @Id
    private String id;
    @Column(unique = true)
    private String hashedLoginId;

    private String name;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(mappedBy = "admin")
    @Builder.Default
    private List<Tournament> administeredTournaments = new ArrayList<>();

    @ManyToMany(mappedBy = "participants")
    @Builder.Default
    private List<Tournament> myTournaments = new ArrayList<>();
}
