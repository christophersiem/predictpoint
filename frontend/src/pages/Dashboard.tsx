import { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { fetchMyTournaments } from '../services/tournamentService';
import type {BackendTournament, UiTournament} from "../tournament.ts";
import {OpenBetsSection} from "../components/dashboard/OpenBetsSection.tsx";
import {EvaluatedSection} from "../components/dashboard/EvaluatedSection.tsx";
import {Leaderboard} from "../components/dashboard/Leaderboard.tsx";
import '../styles/dashboard-base.css';
import {mapBackendToUi} from "../mappers/tournamentMapper.ts";

export default function Dashboard() {
    const { setUser } = useUser();
    const [showEvaluated, setShowEvaluated] = useState(false);
    const [tournaments, setTournaments] = useState<UiTournament[]>([]);
    const [activeTournamentId, setActiveTournamentId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogout = async () => {
        try {
            await fetch('/api/user/logout', {
                method: 'POST',
                credentials: 'include',
            });
        } catch (e) {
            console.error(e);
        } finally {
            setUser(null);
        }
    };

    useEffect(() => {
        const fetchTournaments = async () => {
            const res = await fetch('/api/tournaments/me', { credentials: 'include' });
            const data: BackendTournament[] = await res.json();
            const uiData = data.map(mapBackendToUi);   // 👈 HIER benutzen
            setTournaments(uiData);
        };
        fetchTournaments();
    }, []);

    const activeTournament =
        tournaments.find((t) => t.id === activeTournamentId) ?? tournaments[0];

    return (
        <div className="dash-page">
            <DashboardHeader
                tournaments={tournaments}
                activeTournamentId={activeTournamentId}
                onSelect={setActiveTournamentId}
                loading={loading}
                onLogout={handleLogout}
            />

            <div className="dash-layout">
                <main className="dash-main">
                    {error && <p className="error-hint">{error}</p>}

                    {!activeTournament && !loading && (
                        <p className="empty-hint">Du bist in noch keiner Runde.</p>
                    )}

                    {activeTournament && (
                        <>
                            <OpenBetsSection tournament={activeTournament} />

                            <EvaluatedSection
                                tournament={activeTournament}
                                open={showEvaluated}
                                onToggle={() => setShowEvaluated((p) => !p)}
                            />
                        </>
                    )}
                </main>

                <aside className="dash-sidebar">
                    <Leaderboard tournament={activeTournament} />
                </aside>
            </div>
        </div>
    );
}
