import {useEffect, useState} from 'react';
import {mapBackendToUi} from '../mappers/tournamentMapper';
import type {BackendTournament, UiEvaluatedBet, UiTournament} from '../types/tournament';

export function useMyTournaments() {
    const [tournaments, setTournaments] = useState<UiTournament[]>([]);
    const [activeId, setActiveId] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch('/api/tournaments/me', {
                    credentials: 'include',
                });
                const data: BackendTournament[] = await res.json();
                const ui = data.map(mapBackendToUi);
                setTournaments(ui);
                if (ui.length > 0) {
                    setActiveId(ui[0].id);
                }
            } catch (e: any) {
                setError(e.message ?? 'Konnte Turniere nicht laden');
            } finally {
                setLoading(false);
            }
        })();
    }, []);


    const setTournament = (id: string, updater: (t: UiTournament) => UiTournament) => {
        setTournaments((prev) => prev.map((t) => (t.id === id ? updater(t) : t)));
    };

    const markTip = (tournamentId: string, betId: string, optionIndex: number) => {
        setTournament(tournamentId, (t) => ({
            ...t,
            openBets: t.openBets.map((b) =>
                b.id === betId
                    ? { ...b, myTip: { selectedOptionIndex: optionIndex } }
                    : b
            ),
        }));
    };

    const applyResolvedBet = (
        tournamentId: string,
        betId: string,
        updated: UiEvaluatedBet
    ) => {
        setTournaments(prev =>
            prev.map(t => {
                if (t.id !== tournamentId) return t;
                return {
                    ...t,
                    openBets: t.openBets.filter(b => b.id !== betId),
                    evaluated: [
                        updated,
                        ...t.evaluated.filter(b => b.id !== betId),
                    ],
                };
            })
        );
    };


    return {
        tournaments,
        activeId,
        setActiveId,
        loading,
        error,
        markTip,
        applyResolvedBet,

    };
}
