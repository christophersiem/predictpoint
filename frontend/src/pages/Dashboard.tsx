import {useState} from 'react';
import {OpenBetsSection} from '../components/dashboard/OpenBetsSection';
import {EvaluatedSection} from '../components/dashboard/EvaluatedSection';
import {Leaderboard} from '../components/dashboard/Leaderboard';
import './Dashboard.css';
import {useOutletContext} from "react-router-dom";
import type {AppOutletCtx} from "../layout/AppShell.tsx";
import {useUser} from "../context/UserContext.tsx";

export default function Dashboard() {
    const {
        tournaments,
        activeId,
        loading,
        error,
        markTip,
        applyResolvedBet,
    } = useOutletContext<AppOutletCtx>();

    const [showEvaluated, setShowEvaluated] = useState(false);
    const {user} = useUser();
    const [lbTick, setLbTick] = useState(0);

    const activeTournament =
        tournaments.find((t) => t.id === activeId) ?? tournaments[0];

    if (error) return <p className="error-hint">{error}</p>;
    if (!activeTournament && !loading)
        return <p className="empty-hint">Du bist in noch keiner Runde.</p>;

    if (!activeTournament) return null;

    return (
        <>
            <section className="greet-strip card-block">
                <div className="greet-texts">
                    <h1 className="greet-title">Hallo {user?.name ?? 'Spieler'} 👋</h1>
                    <p className="greet-sub">Willkommen zurück bei predictpoint</p>
                </div>
            </section>
            <div className="dash-two-cols">
                <div className="dash-left-col">
                    <OpenBetsSection
                        tournament={activeTournament}
                        onTipSaved={async (betId, optionIndex) => {
                            await markTip?.(activeId, betId, optionIndex);
                        }}
                    />

                    <EvaluatedSection
                        tournament={activeTournament}
                        open={showEvaluated}
                        onToggle={() => setShowEvaluated((p) => !p)}
                        onBetResolved={async (betId, updated) => {
                            await applyResolvedBet?.(activeId, betId, updated);
                            setLbTick((t) => t + 1);
                        }}
                    />
                </div>

                <div className="dash-right-col">
                    <Leaderboard tournament={activeTournament} username={user?.name}/>
                </div>
            </div>
        </>
    )
        ;
}
