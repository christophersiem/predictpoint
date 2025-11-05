package de.csiem.backend.repository;

import de.csiem.backend.dto.LeaderboardRow;
import de.csiem.backend.model.Tournament;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import java.util.List;

public interface LeaderboardRepository extends Repository<Tournament, String> {

    @Query("""
            select new de.csiem.backend.dto.LeaderboardRow(
                  u.id,
                  u.name,
                  coalesce(sum(t.points), 0),
                  coalesce(sum(case when t.points > 0 then 1 else 0 end), 0)
                )
                from Tournament tour
                  join tour.participants u
                  left join Tip t
                    on t.user = u
                   and t.bet.tournament = tour
                   and t.bet.resolved = true
                where tour.id = :tournamentId
                group by u.id, u.name
                order by
                  coalesce(sum(t.points),0) desc,
                  coalesce(sum(case when t.points > 0 then 1 else 0 end),0) desc,
                  u.name asc
              """)
    List<LeaderboardRow> leaderboardForTournament(String tournamentId);

    @Query("""
    select coalesce(sum(t.points), 0)
    from Tip t
      join t.bet b
    where b.tournament.id = :tournamentId
      and t.user.id = :userId
      and b.resolved = true
  """)
    long userScoreInTournament(String tournamentId, String userId);
}
