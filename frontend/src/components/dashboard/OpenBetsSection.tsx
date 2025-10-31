// src/components/dashboard/OpenBetsSection.tsx
import React, { useState } from 'react';
import type {UiTournament} from "../../tournament.ts";
import './OpenBetsSection.css';

type OpenBetsSectionProps = {
    tournament: UiTournament;
};

export function OpenBetsSection({ tournament }: OpenBetsSectionProps) {
    const [selectedByBet, setSelectedByBet] = useState<Record<string, number>>({});
    const [savingBetId, setSavingBetId] = useState<string | null>(null);
    const [savedBetId, setSavedBetId] = useState<string | null>(null);

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
                // optional: zurücksetzen
            } else {
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
                <h2>Offene Wetten</h2>
                <p>
                    {tournament?.name
                        ? `Diese Tipps laufen aktuell für "${tournament.name}".`
                        : 'Diese Tipps laufen aktuell.'}
                </p>
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

                            {/* Feedback */}
                            {savingBetId === bet.id && (
                                <p className="bet-save-hint">speichert …</p>
                            )}
                            {savedBetId === bet.id && (
                                <p className="bet-save-hint bet-save-hint-ok">Tipp gespeichert</p>
                            )}
                        </article>
                    ))
                ) : (
                    <p className="empty-hint">
                        Für dieses Turnier gibt es gerade keine offenen Wetten.
                    </p>
                )}
                <p className="bet-footnote">
                    Du kannst deinen Tipp ändern, solange die Wette offen ist.
                </p>

            </div>
        </section>
    );
}
