package de.csiem.backend.repository;

import de.csiem.backend.model.Tip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface TipRepository extends JpaRepository<Tip, String> {

    Optional<Tip> findByUser_IdAndBet_Id(String userId, String betId);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query(value = """
  WITH valid AS (
    SELECT 1
      FROM bets
     WHERE id = :betId
       AND status = 'OPEN'
       AND (open_until IS NULL OR open_until > CURRENT_TIMESTAMP)
  )
  INSERT INTO tips (id, bet_id, user_id, selected_option_index, selected_answer, points)
  SELECT :id, :betId, :userId, :idx, :answer, 0
    FROM valid
  ON CONFLICT (user_id, bet_id)
  DO UPDATE SET
    selected_option_index = EXCLUDED.selected_option_index,
    selected_answer       = EXCLUDED.selected_answer
  WHERE EXISTS (
    SELECT 1
      FROM bets b
     WHERE b.id = EXCLUDED.bet_id
       AND b.status = 'OPEN'
       AND (b.open_until IS NULL OR b.open_until > CURRENT_TIMESTAMP)
  )
  """, nativeQuery = true)
    int upsertIfOpen(@Param("id") String id,
                     @Param("betId") String betId,
                     @Param("userId") String userId,
                     @Param("idx") int idx,
                     @Param("answer") String answer);
}
