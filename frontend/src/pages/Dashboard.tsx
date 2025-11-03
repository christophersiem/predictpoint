import {useState} from 'react';
import {useOutletContext} from 'react-router-dom';
import type {AppOutletCtx} from '../layout/AppShell';
import {OpenBetsSection} from '../components/dashboard/OpenBetsSection';
import {EvaluatedSection} from '../components/dashboard/EvaluatedSection';
import {Leaderboard} from '../components/dashboard/Leaderboard';
import '../styles/dashboard-layout.css';

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
    const activeTournament = tournaments.find((t) => t.id === activeId) ?? tournaments[0];

    if (error) return <p className="error-hint">{error}</p>;
    if (!activeTournament && !loading) return <p className="empty-hint">Du bist in noch keiner Runde.</p>;
    if (!activeTournament) return null;

    return (
        <>
            <OpenBetsSection
                tournament={activeTournament}
                onTipSaved={(betId, optionIndex) => markTip(activeId, betId, optionIndex)}
            />

            <div className="dash-two-cols" style={{ marginTop: '1.25rem' }}>
                <EvaluatedSection
                    tournament={activeTournament}
                    open={showEvaluated}
                    onToggle={() => setShowEvaluated((p) => !p)}
                    onBetResolved={(betId, updated) =>
                        applyResolvedBet?.(activeId, betId, updated)
                    }
                />
                <Leaderboard tournament={activeTournament} />
            </div>
        </>
    );
}
