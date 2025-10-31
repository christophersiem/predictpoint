import type {BackendTournament, UiEvaluatedBet, UiTournament} from "../tournament.ts";

export function mapBackendToUi(t: BackendTournament): UiTournament {
    const openBets = (t.activeBets ?? []).map((b): UiTournament['openBets'][number] => ({
        id: b.id,
        title: b.question,
        meta: b.status === 'OPEN' ? 'läuft' : b.status,
        options: b.options ?? [],
    }));

    const resolved = (t.resolvedBets ?? []).map((b): UiEvaluatedBet => {
        let result: 'win' | 'loss' | 'pending' = 'pending';
        let resultText = 'ausgewertet';

        if (b.myTip) {
            if (b.myTip.correct === true) {
                result = 'win';
                resultText = 'richtig getippt';
            } else if (b.myTip.correct === false) {
                result = 'loss';
                resultText = 'falsch getippt';
            } else {
                // myTip da, aber correct == null (z. B. Bet resolved, aber Option nicht zuordenbar)
                result = 'pending';
                resultText = 'ausgewertet';
            }
        } else {
            // user hat gar nicht getippt
            result = 'pending';
            resultText = 'du hast nicht getippt';
        }

        return {
            id: b.id,
            title: b.question,
            meta: `richtige Antwort: ${
                typeof b.correctOptionIndex === 'number' &&
                b.correctOptionIndex >= 0 &&
                b.options &&
                b.options[b.correctOptionIndex]
                    ? b.options[b.correctOptionIndex]
                    : 'unbekannt'
            }`,
            result,
            resultText,
        };
    });

    // geschlossene, aber noch nicht ausgewertete
    const past = (t.pastBets ?? []).map((b): UiEvaluatedBet => ({
        id: b.id,
        title: b.question,
        meta: 'geschlossen',
        result: 'pending',
        resultText: 'wartet auf Auswertung',
    }));

    const evaluated: UiEvaluatedBet[] = [...resolved, ...past];

    const leaderboard = (t.participantNames ?? []).map((name): UiTournament['leaderboard'][number] => ({
        name,
        score: '+0',
    }));

    return {
        id: t.id,
        name: t.name,
        openBets,
        evaluated,
        leaderboard,
    };
}
