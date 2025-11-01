import { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import type {BackendTournament, UiEvaluatedBet, UiTournament} from "../types/tournament.ts";
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
            const uiData: UiTournament[] = data.map(mapBackendToUi);
            setTournaments(uiData);
            if (uiData.length > 0) {
                setActiveTournamentId(uiData[0].id);
            }
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
                            <OpenBetsSection
                                tournament={activeTournament}
                                onTipSaved={(betId, optionIndex) => {
                                    setTournaments((prev) =>
                                        prev.map((t) => {
                                            if (t.id !== activeTournamentId) return t;

                                            return {
                                                ...t,
                                                openBets: t.openBets.map((b) => {
                                                    if (b.id !== betId) return b;
                                                    return {
                                                        ...b,
                                                        myTip: {
                                                            selectedOptionIndex: optionIndex,
                                                        },
                                                    };
                                                }),
                                            };
                                        })
                                    );
                                }}
                            />


                            <EvaluatedSection
                                tournament={activeTournament}
                                open={showEvaluated}
                                onToggle={() => setShowEvaluated((p) => !p)}
                                onBetResolved={(betId, updatedBet) => {
                                    setTournaments((prev: UiTournament[]) =>
                                        prev.map((t): UiTournament => {
                                            if (t.id !== activeTournamentId) {
                                                return t;
                                            }
                                            const normalized: UiEvaluatedBet = {
                                                id: updatedBet.id,
                                                title: updatedBet.title,
                                                meta: updatedBet.meta ?? 'ausgewertet',
                                                result: updatedBet.result,
                                                resultText: updatedBet.resultText,
                                                options: updatedBet.options ?? [],
                                            };

                                            return {
                                                ...t,
                                                evaluated: [
                                                    normalized,
                                                    ...t.evaluated.filter((b) => b.id !== betId),
                                                ],
                                            };
                                        })
                                    );
                                }}
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
