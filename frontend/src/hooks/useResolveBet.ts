import { useState } from 'react';

type Updated = {
    id: string;
    title: string;
    meta: string;
    result: 'win' | 'loss' | 'pending';
    resultText: string;
    options?: string[];
};

function resultFromCorrect(c: boolean | null | undefined): 'win' | 'loss' | 'pending' {
    return c === true ? 'win' : c === false ? 'loss' : 'pending';
}

export function useResolveBet(onBetResolved?: (betId: string, updated: Updated) => void) {
    const [resolvingId, setResolvingId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const resolveBet = async (betId: string, correctOptionIndex: number, ctx: { title: string }) => {
        setResolvingId(betId);
        setError(null);
        try {
            const res = await fetch(`/api/bets/${betId}/resolve`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ correctOptionIndex }),
            });
            if (!res.ok) {
                setError(`Resolve failed: ${res.status}`);
                return;
            }
            const data = await res.json();

            const result = resultFromCorrect(data.myTip?.correct as boolean | null | undefined);
            const updated: Updated = {
                id: String(data.id),
                title: ctx.title ?? String(data.question ?? ''),
                meta: 'Ergebnis vorhanden',
                result,
                resultText: result === 'win' ? 'richtig getippt' : result === 'loss' ? 'falsch getippt' : 'ausgewertet',
                options: (data.options ?? []) as string[],
            };

            onBetResolved?.(betId, updated);
        } catch (e: any) {
            setError(e?.message ?? 'Unbekannter Fehler');
        } finally {
            setResolvingId(null);
        }
    };

    return { resolveBet, resolvingId, error };
}
