type Props = { kind: 'win' | 'loss' | 'pending' | 'neutral'; children: React.ReactNode };

export function ResultChip({ kind, children }: Props) {
    const cls =
        kind === 'win' ? 'eval-chip is-win'
            : kind === 'loss' ? 'eval-chip is-loss'
                : kind === 'pending' ? 'eval-chip is-pending'
                    : 'eval-chip';
    return <span className={cls}>{children}</span>;
}
