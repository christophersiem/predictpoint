// src/components/dashboard/Leaderboard.tsx
import React from 'react';
import type {UiTournament} from "../../tournament.ts";
import './Leaderboard.css';

type LeaderboardProps = {
    tournament: UiTournament | undefined;
};

export function Leaderboard({ tournament }: LeaderboardProps) {
    return (
        <div className="card-block sidebar-block">
            <h2>Leaderboard</h2>
            <p className="sub">
                Top Spieler – {tournament ? tournament.name : '–'}
            </p>
            <ul className="leader-list">
                {tournament && tournament.leaderboard.length > 0 ? (
                    tournament.leaderboard.map((entry, idx) => (
                        <li key={entry.name + idx}>
                            <span className="rank">{idx + 1}</span>
                            <span className="name">{entry.name}</span>
                            <span className="score">{entry.score}</span>
                        </li>
                    ))
                ) : (
                    <li className="empty-hint">Noch keine Spieler für dieses Turnier.</li>
                )}
            </ul>
        </div>
    );
}
