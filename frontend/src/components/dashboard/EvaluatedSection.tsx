import React, {useState} from 'react';
import {useUser} from '../../context/UserContext';
import './EvaluatedSection.css';
import type {UiTournament} from '../../types/tournament';

type EvaluatedSectionProps = {
    tournament: UiTournament;
    open: boolean;
    onToggle: () => void;
    onBetResolved?: (
        betId: string,
        updated: {
            id: string;
            title: string;
            meta: string;
            result: 'win' | 'loss' | 'pending';
            resultText: string;
            options?: string[];
        }
    ) => void;
};

export function EvaluatedSection({
                                     tournament,
                                     open,
                                     onToggle,
                                     onBetResolved,
                                 }: EvaluatedSectionProps) {
    const { user } = useUser();
    const [resolvingId, setResolvingId] = useState<string | null>(null);

    const isAdmin = user && tournament.adminId && user.id === tournament.adminId;
    const items = tournament.evaluated ?? [];

    const handleResolve = async (betId: string, correctOptionIndex: number) => {
        setResolvingId(betId);
        try {
            const res = await fetch(`/api/bets/${betId}/resolve`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ correctOptionIndex }),
            });

            if (!res.ok) {
                console.error('resolve failed', res.status);
                return;
            }

            const data = await res.json();

            const correct = data.myTip?.correct as boolean | null | undefined;
            const result: 'win' | 'loss' | 'pending' =
                correct === true ? 'win' : correct === false ? 'loss' : 'pending';

            const options = (data.options ?? []) as string[];

            const updated = {
                id: data.id as string,
                title: data.question as string,
                result,
                resultText:
                    result === 'win'
                        ? 'richtig getippt'
                        : result === 'loss'
                            ? 'falsch getippt'
                            : 'ausgewertet',
                options,
            };

            onBetResolved?.(betId, updated);
        } catch (e) {
            console.error(e);
        } finally {
            setResolvingId(null);
        }
    };


    return (
        <section className="card-block evaluated-section">
            <button type="button" className="collapse-trigger" onClick={onToggle}>
                Ausgewertete / geschlossene Wetten
                <span className={open ? 'chevron rotated' : 'chevron'}>⌃</span>
            </button>

            {open && (
                <div className="evaluated-grid">
                    {items.length > 0 ? (
                        items.map((item) => {
                            const myIdx = item.myTip?.selectedOptionIndex ?? null;
                            const correctIdx =
                                item.correctOptionIndex != null && item.correctOptionIndex >= 0
                                    ? item.correctOptionIndex
                                    : null;

                            const myLabel = myIdx != null && item.options ? item.options[myIdx] : '–';
                            const correctLabel = correctIdx != null && item.options ? item.options[correctIdx] : '–';

                            return (
                                <article
                                    key={item.id}
                                    className={`eval-card eval-card--${item.result}`}
                                >
                                    <div className="eval-card__head">
                                        <h4 className="eval-card__title">{item.title}</h4>
                                        <span className="eval-card__meta">{item.meta}</span>
                                    </div>

                                    <div className="eval-card__rows">
                                        <div className="eval-row">
                                            <span className="eval-row__label">Dein Tipp</span>
                                            <span className={`eval-chip ${item.result === 'win' ? 'is-win' : item.result === 'loss' ? 'is-loss' : ''}`}>
                  {myLabel}
                </span>
                                        </div>

                                        {item.result !== 'pending' && (
                                            <div className="eval-row">
                                                <span className="eval-row__label">Lösung</span>
                                                <span className="eval-chip">{correctLabel}</span>
                                            </div>
                                        )}
                                    </div>

                                    {isAdmin && item.result === 'pending' && item.options && item.options.length > 0 && (
                                        <div className="eval-resolve-box">
                                            <p className="eval-resolve-label">Als richtige Antwort festlegen:</p>
                                            <div className="eval-resolve-buttons">
                                                {item.options.map((opt, idx) => (
                                                    <button
                                                        key={opt + idx}
                                                        type="button"
                                                        className="eval-resolve-btn"
                                                        onClick={() => handleResolve(item.id, idx, item.title)}
                                                        disabled={resolvingId === item.id}
                                                    >
                                                        {opt}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </article>
                            );
                        })
                    ) : (
                        <p className="empty-hint">Für dieses Turnier wurden noch keine Wetten ausgewertet.</p>
                    )}
                </div>
            )}
        </section>
    );
}
