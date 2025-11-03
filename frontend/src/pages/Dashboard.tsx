import { useState } from 'react';
import { OpenBetsSection } from '../components/dashboard/OpenBetsSection';
import { EvaluatedSection } from '../components/dashboard/EvaluatedSection';
import { Leaderboard } from '../components/dashboard/Leaderboard';
import './Dashboard.css';
import {useOutletContext} from "react-router-dom";
import type {AppOutletCtx} from "../layout/AppShell.tsx";

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

    const activeTournament =
        tournaments.find((t) => t.id === activeId) ?? tournaments[0];

    if (error) return <p className="error-hint">{error}</p>;
    if (!activeTournament && !loading)
        return <p className="empty-hint">Du bist in noch keiner Runde.</p>;

    if (!activeTournament) return null;

    return (
        <div className="dash-two-cols">
            <div className="dash-left-col">
                <OpenBetsSection
                    tournament={activeTournament}
                    onTipSaved={(betId, optionIndex) =>
                        markTip?.(activeId, betId, optionIndex)
                    }
                />

                <EvaluatedSection
                    tournament={activeTournament}
                    open={showEvaluated}
                    onToggle={() => setShowEvaluated((p) => !p)}
                    onBetResolved={(betId, updated) =>
                        applyResolvedBet?.(activeId, betId, updated)
                    }
                />
            </div>

            <div className="dash-right-col">
                <Leaderboard tournament={activeTournament} />
            </div>
        </div>
    );
}
