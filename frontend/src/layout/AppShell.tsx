import {Outlet} from 'react-router-dom';
import {DashboardHeader} from '../components/dashboard/DashboardHeader';
import {useMyTournaments} from '../hooks/useMyTournaments';
import '../styles/dashboard-layout.css';
import {useAuth} from "../hooks/useAuth.ts";

export type AppOutletCtx = {
    tournaments: ReturnType<typeof useMyTournaments>['tournaments'];
    activeId: string;
    setActiveId: (id: string) => void;
    loading: boolean;
    error: string | null;
    markTip: (tournamentId: string, betId: string, optionIndex: number) => void;
    applyResolvedBet: (
        tournamentId: string,
        betId: string,
        updated: { id: string; title: string; result: 'win'|'loss'|'pending'; resultText: string; options?: string[] }
    ) => void;
};

export default function AppShell() {
    const { tournaments, activeId, setActiveId, loading, error, markTip, applyResolvedBet } = useMyTournaments();
const {logout} = useAuth();


    return (
        <div className="dash-page">
            <DashboardHeader
                tournaments={tournaments}
                activeTournamentId={activeId}
                onSelect={setActiveId}
                loading={loading}
                onLogout={logout}
            />
            <div className="dash-layout">
                <div className="dash-container">
                    <main className="dash-main">
                        <Outlet context={{ tournaments, activeId, setActiveId, loading, error, markTip, applyResolvedBet } satisfies AppOutletCtx} />
                    </main>
                </div>
            </div>
        </div>
    );
}
