package de.csiem.backend.repository;

import de.csiem.backend.model.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AppUserRepository extends JpaRepository<AppUser, String> {
    Optional<AppUser> findByHashedLoginId(String hashedLoginId);
    boolean existsByNameIgnoreCase(String name);
}

