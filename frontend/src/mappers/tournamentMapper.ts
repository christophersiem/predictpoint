import type {BackendBet, BackendTournament, UiEvaluatedBet, UiOpenBet, UiTournament,} from '../types/tournament';

export function mapBackendToUi(t: BackendTournament): UiTournament {
    const openBets: UiOpenBet[] = (t.activeBets ?? []).map((b: BackendBet) => ({
        id: b.id,
        title: b.question,
        meta: b.status === 'OPEN' ? 'läuft …' : b.status,
        options: b.options ?? [],
        myTip: b.myTip
            ? {
                selectedOptionIndex:
                    typeof b.myTip.selectedOptionIndex === 'number'
                        ? b.myTip.selectedOptionIndex
                        : null,
            }
            : null,
    }));

    const resolved: UiEvaluatedBet[] = (t.resolvedBets ?? []).map((b) => ({
        id: b.id,
        title: b.question,
        meta: 'Ergebnis vorhanden',
        result:
            b.myTip?.correct === true
                ? 'win'
                : b.myTip?.correct === false
                    ? 'loss'
                    : 'pending',
        resultText:
            b.myTip?.correct === true
                ? 'richtig getippt'
                : b.myTip?.correct === false
                    ? 'falsch getippt'
                    : 'ausgewertet',
        options: b.options ?? [],
    }));

    const past: UiEvaluatedBet[] = (t.pastBets ?? []).map((b) => ({
        id: b.id,
        title: b.question,
        meta: 'geschlossen',
        result: 'pending',
        resultText: 'wartet auf Auswertung',
        options: b.options ?? [],
    }));

    return {
        id: t.id,
        name: t.name,
        adminId: t.adminId,
        openBets,
        evaluated: [...resolved, ...past],
        leaderboard: (t.participantNames ?? []).map((name) => ({
            name,
            score: '+0',
        })),
    };
}
