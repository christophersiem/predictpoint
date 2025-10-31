// src/components/dashboard/EvaluatedSection.tsx
import React from 'react';
import './EvaluatedSection.css';
import type {UiTournament} from "../../tournament.ts";

type EvaluatedSectionProps = {
    tournament: UiTournament;
    open: boolean;
    onToggle: () => void;
};

export function EvaluatedSection({ tournament, open, onToggle }: EvaluatedSectionProps) {
    const items = tournament.evaluated ?? [];

    return (
        <section className="card-block evaluated-section">
            <button type="button" className="collapse-trigger" onClick={onToggle}>
                Ausgewertete / geschlossene Wetten
                <span className={open ? 'chevron rotated' : 'chevron'}>⌃</span>
            </button>

            {open && (
                <div className="evaluated-list">
                    {items.length > 0 ? (
                        items.map((item) => (
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
                            </article>
                        ))
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
