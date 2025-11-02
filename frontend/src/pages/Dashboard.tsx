import { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import {OpenBetsSection} from "../components/dashboard/OpenBetsSection.tsx";
import {EvaluatedSection} from "../components/dashboard/EvaluatedSection.tsx";
import {Leaderboard} from "../components/dashboard/Leaderboard.tsx";
import '../styles/dashboard-base.css';
import {useMyTournaments} from "../hooks/useMyTournaments.ts";

export default function Dashboard() {
    const { setUser } = useUser();
    const {
        tournaments,
        activeId,
        setActiveId,
        loading,
        error,
        markTip,
        applyResolvedBet,
    } = useMyTournaments();
    const [showEvaluated, setShowEvaluated] = useState(false);


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


    const activeTournament = tournaments.find((t) => t.id === activeId);

    return (
        <div className="dash-page">
            <DashboardHeader
                tournaments={tournaments}
                activeTournamentId={activeId}
                onSelect={setActiveId}
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
                            <OpenBetsSection
                                tournament={activeTournament}
                                onTipSaved={(betId, optionIndex) => markTip(activeId, betId, optionIndex)}
                            />

                            <div className="dash-bottom-row">
                                <EvaluatedSection
                                    tournament={activeTournament}
                                    open={showEvaluated}
                                    onToggle={() => setShowEvaluated((p) => !p)}
                                    onBetResolved={(betId, updatedBet) =>
                                        applyResolvedBet(activeId, betId, updatedBet)
                                    }
                                />
                                <Leaderboard tournament={activeTournament} />
                            </div>
                        </>
                    )}
                </main>
            </div>
        </div>
    );

}
