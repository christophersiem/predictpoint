import React from 'react';
import './DashboardHeader.css';
import { useUser } from '../../context/UserContext';
import type {UiTournament} from "../../types/tournament.ts";

type DashboardHeaderProps = {
    tournaments: UiTournament[];
    activeTournamentId: string;
    onSelect: (id: string) => void;
    loading: boolean;
    onLogout: () => void;
};

export function DashboardHeader({
                                    tournaments,
                                    activeTournamentId,
                                    onSelect,
                                    loading,
                                    onLogout,
                                }: DashboardHeaderProps) {
    const { user } = useUser();

    return (
        <header className="dash-topbar">
            <div className="dash-top-inner">
                <div className="dash-top-left">
                    <p className="dash-hello">Hallo {user?.name ?? 'Spieler'} 👋</p>
                    <p className="dash-sub">Willkommen zurück bei predictpoint</p>
                </div>

                <div className="dash-top-center">
                    <div className="tournament-tabs">
                        {tournaments.map((t) => (
                            <button
                                key={t.id}
                                type="button"
                                onClick={() => onSelect(t.id)}
                                className={
                                    t.id === activeTournamentId
                                        ? 'tournament-btn is-active'
                                        : 'tournament-btn'
                                }
                            >
                                {t.name}
                            </button>
                        ))}
                        {loading && <span className="loading-hint">lädt…</span>}
                    </div>
                </div>

                <button
                    type="button"
                    className="logout-btn"
                    onClick={onLogout}
                    aria-label="Logout"
                    title="Logout"
                >
                    ⏻
                </button>
            </div>
        </header>
    );
}
