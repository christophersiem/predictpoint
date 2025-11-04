import './DashboardHeader.css';
import {useNavigate} from 'react-router-dom';
import {useUser} from '../../context/UserContext';
import type {UiTournament} from "../../types/tournament.ts";

type Props = {
    tournaments: UiTournament[];
    activeTournamentId: string;
    onSelect: (id: string) => void;
    loading: boolean;
    onLogout: () => void;
};

export function DashboardHeader({
                                    tournaments = [],
                                    activeTournamentId,
                                    onSelect,
                                    loading,
                                    onLogout,
                                }: Props) {
    const navigate = useNavigate();
    const canCreate = tournaments?.length < 3;

    return (
        <header className="dash-topbar">
            <div className="dash-top-inner">
                <div className="dash-top-left">
                    <button className="brand" onClick={() => navigate('/app')} aria-label="Start">
                        <span className="logo-circle">
                          <span className="logo-letter">p</span>
                         </span>
                        <span className="brand-text">
    <span className="brand-title">predictpoint</span>
  </span>
                    </button>

                </div>

                <div className="dash-top-center">
                    <div className="tournament-tabs">
                        {tournaments?.map((t) => (
                            <button
                                key={t.id}
                                type="button"
                                onClick={() => {
                                    if (location.pathname !== '/app') {
                                        navigate('/app');
                                    }
                                    onSelect(t.id);
                                }}
                                className={t.id === activeTournamentId ? 'tournament-btn is-active' : 'tournament-btn'}
                            >
                                {t.name}
                            </button>
                        ))}

                        {canCreate && (
                            <button
                                type="button"
                                className="tournament-btn create-btn"
                                onClick={() => navigate('/app/tournaments/new')}
                                title="Neue Runde erstellen"
                            >
                                + Neue Runde
                            </button>
                        )}

                        {loading && <span className="loading-hint">lädt…</span>}
                    </div>
                </div>

                <div className="dash-top-right">
                    <button className="logout-btn" onClick={onLogout} aria-label="Logout" title="Logout">
                        ⎋
                    </button>
                </div>
            </div>
        </header>
    );
}
