import { ResultChip } from './ResultChip';

type Item = {
    id: string;
    title: string;
    meta: string;
    result: 'win' | 'loss' | 'pending';
    options?: string[];
    myTip?: { selectedOptionIndex: number | null } | null;
    correctOptionIndex?: number | null;
};

type Props = {
    item: Item;
    isAdmin: boolean;
    resolving: boolean;
    onResolve?: (idx: number) => void;
};

export function EvaluatedCard({ item, isAdmin, resolving, onResolve }: Props) {
    const myIdx = item.myTip?.selectedOptionIndex ?? null;
    const correctIdx =
        item.correctOptionIndex != null && item.correctOptionIndex >= 0 ? item.correctOptionIndex : null;

    const myLabel = myIdx != null && item.options ? item.options[myIdx] : '–';
    const correctLabel = correctIdx != null && item.options ? item.options[correctIdx] : '–';

    return (
        <article className={`eval-card eval-card--${item.result}`}>
            <div className="eval-card__head">
                <h4 className="eval-card__title">{item.title}</h4>
                <span className="eval-card__meta">{item.meta}</span>
            </div>

            <div className="eval-card__rows">
                <div className="eval-row">
                    <span className="eval-row__label">Dein Tipp</span>
                    <ResultChip kind={item.result === 'pending' ? 'pending' : item.result}>{myLabel}</ResultChip>
                </div>

                {item.result !== 'pending' && (
                    <div className="eval-row">
                        <span className="eval-row__label">Lösung</span>
                        <ResultChip kind="neutral">{correctLabel}</ResultChip>
                    </div>
                )}
            </div>

            {isAdmin && item.result === 'pending' && item.options && item.options.length > 0 && onResolve && (
                <div className="eval-resolve-box">
                    <p className="eval-resolve-label">Als richtige Antwort festlegen:</p>
                    <div className="eval-resolve-buttons">
                        {item.options.map((opt, idx) => (
                            <button
                                key={opt + idx}
                                type="button"
                                className="eval-resolve-btn"
                                onClick={() => onResolve?.(idx)}
                                disabled={resolving}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </article>
    );
}
