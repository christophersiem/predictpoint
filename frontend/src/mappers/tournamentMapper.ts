import type {
    BackendBet,
    BackendTournament,
    UiEvaluatedBet,
    UiOpenBet,
    UiTournament,
} from '../types/tournament';

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

    const resolved: UiEvaluatedBet[] = (t.resolvedBets ?? []).map((b: BackendBet) => {
        const hasCorrect =
            typeof b.correctOptionIndex === 'number' && b.correctOptionIndex >= 0;
        const myIdx =
            typeof b.myTip?.selectedOptionIndex === 'number'
                ? b.myTip!.selectedOptionIndex
                : null;

        let result: UiEvaluatedBet['result'] = 'pending';
        if (hasCorrect && myIdx !== null) {
            result = myIdx === b.correctOptionIndex ? 'win' : 'loss';
        } else if (typeof b.myTip?.correct === 'boolean') {
            result = b.myTip.correct ? 'win' : 'loss';
        }

        const resultText =
            result === 'win'
                ? 'richtig getippt'
                : result === 'loss'
                    ? 'falsch getippt'
                    : 'ausgewertet';

        return {
            id: b.id,
            title: b.question,
            meta: 'Ergebnis vorhanden',
            result,
            resultText,
            options: b.options ?? [],
            correctOptionIndex: hasCorrect ? b.correctOptionIndex! : null,
            myTip: { selectedOptionIndex: myIdx },
        };
    });

    const past: UiEvaluatedBet[] = (t.pastBets ?? []).map((b: BackendBet) => ({
        id: b.id,
        title: b.question,
        meta: 'geschlossen',
        result: 'pending',
        resultText: 'wartet auf Auswertung',
        options: b.options ?? [],
        correctOptionIndex: null,
        myTip: b.myTip
            ? {
                selectedOptionIndex:
                    typeof b.myTip.selectedOptionIndex === 'number'
                        ? b.myTip.selectedOptionIndex
                        : null,
            }
            : null,
    }));

    return {
        id: t.id,
        name: t.name,
        adminId: (t as any).adminId,
        openBets,
        evaluated: [...resolved, ...past],
        leaderboard: (t.participantNames ?? []).map((name) => ({
            name,
            score: '+0',
        })),
    };
}
