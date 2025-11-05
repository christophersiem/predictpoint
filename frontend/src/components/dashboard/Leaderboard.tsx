import React, {useEffect, useState} from 'react';
import type {LeaderboardEntry, UiTournament} from "../../types/tournament.ts";
import './Leaderboard.css';
import {fetchLeaderboard} from "../../services/leaderboardService.ts";

type LeaderboardProps = {
    tournament: UiTournament | undefined;
};

export function Leaderboard({ tournament,refreshTick = 0  }: LeaderboardProps) {

    const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    useEffect(() => {
        if (!tournament?.id) return;
        const ac = new AbortController();
        setLoading(true);
        setErr(null);
        fetchLeaderboard(tournament.id, ac.signal)
            .then(setEntries)
            .catch((e) => !ac.signal.aborted && setErr(e.message ?? 'Fehler beim Laden'))
            .finally(() => !ac.signal.aborted && setLoading(false));
        return () => ac.abort();
    }, [tournament?.id, refreshTick]);

    const list = entries.length ? entries : (tournament?.leaderboard ?? []);
    return (
        <div className="card-block sidebar-block">
            <h2>Leaderboard</h2>
            <p className="sub">Top Spieler – {tournament ? tournament.name : '–'}</p>

            {err && <p className="error-hint">{err}</p>}
            {loading && <p className="loading-hint">Lade Leaderboard…</p>}

            <ul className="leader-list">
                {list.length > 0 ? (
                    list.map((entry, idx) => (
                        <li key={entry.name + idx}>
                            <span className="rank">{idx + 1}</span>
                            <span className="name">{entry.name}</span>
                            <span className="score">{entry.score}</span>
                        </li>
                    ))
                ) : (
                    !loading && <li className="empty-hint">Noch keine Spieler für dieses Turnier.</li>
                )}
            </ul>
        </div>
    );
}
