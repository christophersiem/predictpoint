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
                <div className="evaluated-list">
                    {items.length > 0 ? (
                        items.map((item) => {
                            const isPending = item.result === 'pending';

                            return (
                                <article
                                    key={item.id}
                                    className={`eval-item eval-item--${item.result}`}
                                >
                                    <div className="eval-head">
                                        <p className="eval-title">{item.title}</p>
                                        <span className={`eval-badge eval-badge--${item.result}`}>
                      {item.result === 'win'
                          ? 'richtig'
                          : item.result === 'loss'
                              ? 'falsch'
                              : 'ausstehend'}
                    </span>
                                    </div>

                                    <p className="eval-meta">{item.meta}</p>
                                    <p className={`eval-result eval-result--${item.result}`}>
                                        {item.resultText}
                                    </p>

                                    {isAdmin && isPending && item.options && item.options.length > 0 && (
                                        <div className="eval-resolve-box">
                                            <p className="eval-resolve-label">
                                                Als richtige Antwort festlegen:
                                            </p>
                                            <div className="eval-resolve-buttons">
                                                {item.options.map((opt, idx) => (
                                                    <button
                                                        key={opt + idx}
                                                        type="button"
                                                        className="eval-resolve-btn"
                                                        onClick={() => handleResolve(item.id, idx)}
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
                        <p className="empty-hint">
                            Für dieses Turnier wurden noch keine Wetten ausgewertet.
                        </p>
                    )}
                </div>
            )}
        </section>
    );
}
