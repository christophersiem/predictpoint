import React, {useEffect, useState} from 'react';
import type {UiTournament} from '../../types/tournament';
import './OpenBetsSection.css';

type OpenBetsSectionProps = {
    tournament: UiTournament;
    onTipSaved?: (betId: string, optionIndex: number) => void;
};

export function OpenBetsSection({ tournament, onTipSaved }: OpenBetsSectionProps) {
    const [selectedByBet, setSelectedByBet] = useState<Record<string, number>>({});
    const [savingBetId, setSavingBetId] = useState<string | null>(null);
    const [savedBetId, setSavedBetId] = useState<string | null>(null);

    useEffect(() => {
        const initial: Record<string, number> = {};
        tournament.openBets.forEach((b) => {
            const idx = b.myTip?.selectedOptionIndex;
            if (typeof idx === 'number' && idx >= 0) {
                initial[b.id] = idx;
            }
        });
        setSelectedByBet(initial);
    }, [tournament]);

    const handleSelectOption = async (betId: string, optionIndex: number) => {
        setSelectedByBet((prev) => ({ ...prev, [betId]: optionIndex }));
        setSavingBetId(betId);
        setSavedBetId(null);

        try {
            const res = await fetch('/api/tips', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    betId,
                    selectedOptionIndex: optionIndex,
                }),
            });

            if (!res.ok) {
                console.error('Tipp speichern fehlgeschlagen', await res.text());
            } else {
                onTipSaved?.(betId, optionIndex);
                setSavedBetId(betId);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setSavingBetId(null);
        }
    };

    return (
        <section className="card-block">
            <div className="section-headline">
                <h2>Gib deinen Tipp ab</h2>

            </div>

            <div className="open-bets-grid">
                {tournament.openBets.length > 0 ? (
                    tournament.openBets.map((bet) => (
                        <article key={bet.id} className="bet-card">
                            <p className="bet-title">{bet.title}</p>
                            <p className="bet-meta">läuft</p>

                            {bet.options && bet.options.length > 0 && (
                                <div className="bet-options">
                                    {bet.options.map((opt, idx) => {
                                        const isSelected = selectedByBet[bet.id] === idx;
                                        const isSaving = savingBetId === bet.id;

                                        return (
                                            <button
                                                key={opt + idx}
                                                type="button"
                                                className={isSelected ? 'bet-option is-selected' : 'bet-option'}
                                                onClick={() => handleSelectOption(bet.id, idx)}
                                                disabled={isSaving}
                                            >
                                                <span className="bet-option-label">{opt}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}

                            {savingBetId === bet.id && <p className="bet-save-hint">speichert …</p>}
                            {savedBetId === bet.id && (
                                <p className="bet-save-hint bet-save-hint-ok">Tipp gespeichert</p>
                            )}
                        </article>
                    ))
                ) : (
                    <p className="empty-hint">Für dieses Turnier gibt es gerade keine offenen Wetten.</p>
                )}

                <p className="bet-footnote">Du kannst deinen Tipp ändern, solange die Wette offen ist.</p>
            </div>
        </section>
    );
}
