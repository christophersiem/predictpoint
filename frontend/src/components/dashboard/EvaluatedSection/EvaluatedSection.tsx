import React from 'react';
import './EvaluatedSection.css';
import { EvaluatedCard } from './EvaluatedCard.tsx';
import {useResolveBet} from "../../../hooks/useResolveBet.ts";
import type {UiTournament} from "../../../types/tournament.ts";
import {useUser} from "../../../context/UserContext.tsx";

type Props = {
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

export function EvaluatedSection({ tournament, open, onToggle, onBetResolved }: Props) {
    const { user } = useUser();
    const isAdmin = user && tournament.adminId && user.id === tournament.adminId;
    const items = tournament.evaluated ?? [];

    const { resolveBet, resolvingId } = useResolveBet(onBetResolved);

    return (
        <section className="card-block evaluated-section">
            <button type="button" className="collapse-trigger" onClick={onToggle}>
                Ausgewertete / geschlossene Wetten
                <span className={open ? 'chevron rotated' : 'chevron'}>⌃</span>
            </button>

            {open && (
                <div className="evaluated-grid">
                    {items.length > 0 ? (
                        items.map((item) => (
                            <EvaluatedCard
                                key={item.id}
                                item={item as any}
                                isAdmin={!!isAdmin}
                                resolving={resolvingId === item.id}
                                onResolve={
                                    isAdmin
                                        ? (idx) => resolveBet(item.id, idx, { title: item.title })
                                        : undefined
                                }
                            />
                        ))
                    ) : (
                        <p className="empty-hint">Für dieses Turnier wurden noch keine Wetten ausgewertet.</p>
                    )}
                </div>
            )}
        </section>
    );
}
