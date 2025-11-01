package de.csiem.backend.repository;

import de.csiem.backend.model.Bet;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BetRepository extends JpaRepository<Bet, String> {

}