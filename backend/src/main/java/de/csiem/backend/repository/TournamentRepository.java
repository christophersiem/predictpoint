package de.csiem.backend.repository;

import de.csiem.backend.model.Tournament;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TournamentRepository extends JpaRepository<Tournament, String> {

    @Query("""
       select distinct t
       from Tournament t
       left join t.participants p
       where t.admin.id = :userId
          or p.id = :userId
       """)
    List<Tournament> findAllByUserId(@Param("userId") String userId);
}
