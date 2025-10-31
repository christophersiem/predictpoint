package de.csiem.backend.repository;

import de.csiem.backend.model.Tip;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TipRepository extends JpaRepository<Tip, String> {

    Optional<Tip> findByUser_IdAndBet_Id(String userId, String betId);
}
