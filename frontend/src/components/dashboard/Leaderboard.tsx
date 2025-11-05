import React, {useEffect, useState} from 'react';
import type {LeaderboardEntry, UiTournament} from "../../types/tournament.ts";
import './Leaderboard.css';
import {fetchLeaderboard} from "../../services/leaderboardService.ts";

type LeaderboardProps = {
    tournament: UiTournament | undefined;
    username?:String;
};

export function Leaderboard({tournament, refreshTick = 0, username}: LeaderboardProps) {

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

    const fullList: LeaderboardEntry[] = entries.length ? entries : (tournament?.leaderboard ?? []);
    const total = fullList.length;

    const selfName = username?.trim() ?? '';
    const selfIndex = selfName ? fullList.findIndex(e => e.name === selfName) : -1;

    let top: LeaderboardEntry[] = [];
    let showGap = false;
    let meEntry: LeaderboardEntry | null = null;

    if (total <= 15) {
        top = fullList.slice(0, total);
    } else if (selfIndex >= 0 && selfIndex < 15) {
        top = fullList.slice(0, 15);
    } else if (selfIndex >= 0) {
        top = fullList.slice(0, 14);
        showGap = true;
        meEntry = fullList[selfIndex]; // eigener Eintrag unten anhängen
    } else {
        top = fullList.slice(0, 15);
    }
    return (
        <div className="card-block sidebar-block">
            <h2>Leaderboard</h2>
            <p className="sub">
                Top Spieler – {tournament ? tournament.name : '–'}
                <span className="muted">({total} Teilnehmer)</span>
            </p>

            {err && <p className="error-hint">{err}</p>}
            {loading && <p className="loading-hint">Lade Leaderboard…</p>}

            <ul className="leader-list">
                {top.length > 0 ? (
                    <>
                        {top.map((entry, idx) => {
                            const isMe = selfName && entry.name === selfName;
                            const rank = idx + 1; // Top-Liste startet immer bei 1
                            return (
                                <li key={entry.name + rank} className={isMe ? 'me' : undefined}>
                                    <span className="rank">{rank}</span>
                                    <span className="name">
                    {entry.name}

                  </span>
                                    <span className="score">{entry.score}</span>
                                </li>
                            );
                        })}

                        {showGap && <li className="ellipsis-row" aria-hidden>…</li>}

                        {meEntry && (
                            <li key={meEntry.name + (selfIndex + 1)} className="me">
                                <span className="rank">{selfIndex + 1}</span>
                                <span className="name">
                  {meEntry.name}
                                    <span className="me-badge">du</span>
                </span>
                                <span className="score">{meEntry.score}</span>
                            </li>
                        )}
                    </>
                ) : (
                    !loading && <li className="empty-hint">Noch keine Spieler für dieses Turnier.</li>
                )}
            </ul>
        </div>
    );
}
