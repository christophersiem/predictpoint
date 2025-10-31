package de.csiem.backend.repository;

import de.csiem.backend.model.Tip;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TipRepository extends JpaRepository<Tip, String> {
    Optional<Tip> findByUserIdAndBetId(String userId, String betId);
    List<Tip> findByBetId(String betId);
    List<Tip> findByUserId(String userId);
}
