import { useState } from 'react';
import { useUser } from '../UserContext';
import './Dashboard.css';

const TOURNAMENTS = [
    {
        id: 'stream-01',
        name: 'Roman Stream #1',
        openBets: [
            { id: 1, title: 'Welches "', meta: 'Wette: mehr als 3x' },
            { id: 2, title: 'Zu welcher Blockzeit endet der Stream?', meta: 'Wette: 912372' },
            { id: 3, title: 'Ist der BTC Preis ($) nach dem Stream höher oder niedriger als zu Beginn?', meta: 'Wette: höher' },
        ],
        evaluated: [
            {
                id: 11,
                title: 'Wie oft sagt Roman das Wort "Scharlatan(e)?"',
                meta: 'Tipp: mind. 1x',
                result: 'win',
                resultText: 'gewonnen +14',
            },
            {
                id: 12,
                title: 'Zu welcher Blockzeit endet der Stream?',
                meta: 'Tipp: 912811',
                result: 'loss',
                resultText: 'verloren',
            },
        ],
        leaderboard: [
            { name: 'balu', score: '+128' },
            { name: 'Anna', score: '+95' },
            { name: 'Marco', score: '+72' },
            { name: 'Gast 1', score: '+61' },
            { name: 'Gast 2', score: '+43' },
        ],
    },
    {
        id: 'community-cup',
        name: 'Community Cup',
        openBets: [
            { id: 4, title: 'Wer gewinnt das Finale?', meta: 'Wette: Team Orange' },
            { id: 5, title: 'Gibt es ein Overtime Match?', meta: 'Wette: ja' },
        ],
        evaluated: [
            {
                id: 21,
                title: 'Wer erzielt das erste Tor?',
                meta: 'Tipp: Team Blau',
                result: 'win',
                resultText: 'gewonnen +22',
            },
        ],
        leaderboard: [
            { name: 'Lena', score: '+101' },
            { name: 'Nico', score: '+84' },
            { name: 'balu', score: '+69' },
            { name: 'Chris', score: '+47' },
            { name: 'Gast 2', score: '+30' },
        ],
    },
    {
        id: 'test-event',
        name: 'Test-Event',
        openBets: [],
        evaluated: [],
        leaderboard: [],
    },
];

export default function Dashboard() {
    const { user } = useUser();
    const [showEvaluated, setShowEvaluated] = useState(false);
    const [activeTournamentId, setActiveTournamentId] = useState(TOURNAMENTS[0]?.id ?? '');

    const activeTournament =
        TOURNAMENTS.find((t) => t.id === activeTournamentId) ?? TOURNAMENTS[0];

    return (
        <div className="dash-page">
            <header className="dash-topbar">
                {/* links */}
                <div className="dash-top-left">
                    <p className="dash-hello">Hallo {user?.name ?? 'Spieler'} 👋</p>
                    <p className="dash-sub">Willkommen zurück bei predictpoint</p>
                </div>

                {/* mitte – jetzt Buttons */}
                <div className="dash-top-center">
                    <div className="tournament-tabs">
                        {TOURNAMENTS.map((t) => (
                            <button
                                key={t.id}
                                type="button"
                                onClick={() => setActiveTournamentId(t.id)}
                                className={
                                    t.id === activeTournamentId
                                        ? 'tournament-btn is-active'
                                        : 'tournament-btn'
                                }
                            >
                                {t.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* rechts – Platz für später */}
                <div className="dash-top-right" />
            </header>

            <div className="dash-layout">
                <main className="dash-main">
                    <section className="card-block">
                        <div className="section-headline">
                            <h2>Offene Wetten</h2>
                            <p>
                                {activeTournament?.name
                                    ? `Diese Tipps laufen aktuell für "${activeTournament.name}".`
                                    : 'Diese Tipps laufen aktuell.'}
                            </p>
                        </div>
                        <div className="open-bets-grid">
                            {activeTournament.openBets.length > 0 ? (
                                activeTournament.openBets.map((bet) => (
                                    <article key={bet.id} className="bet-card">
                                        <p className="bet-title">{bet.title}</p>
                                        <p className="bet-meta">{bet.meta}</p>
                                        <p className="bet-status bet-status-open">läuft …</p>
                                    </article>
                                ))
                            ) : (
                                <p className="empty-hint">
                                    Für dieses Turnier gibt es gerade keine offenen Wetten.
                                </p>
                            )}
                        </div>
                    </section>

                    <section className="card-block">
                        <button
                            type="button"
                            className="collapse-trigger"
                            onClick={() => setShowEvaluated((p) => !p)}
                        >
                            Ausgewertete Wetten
                            <span className={showEvaluated ? 'chevron rotated' : 'chevron'}>⌃</span>
                        </button>

                        {showEvaluated && (
                            <div className="evaluated-list">
                                {activeTournament.evaluated.length > 0 ? (
                                    activeTournament.evaluated.map((item) => (
                                        <article key={item.id} className="eval-item">
                                            <p className="eval-title">{item.title}</p>
                                            <p className="eval-meta">{item.meta}</p>
                                            <p
                                                className={
                                                    item.result === 'win'
                                                        ? 'eval-result win'
                                                        : 'eval-result loss'
                                                }
                                            >
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

                    <section className="card-block">
                        <h2>Wettvorschlag einreichen</h2>
                        <p className="sub">
                            Schlage eine Frage vor (für {activeTournament?.name}).
                        </p>
                        <form className="proposal-form">
                            <label>
                                Frage
                                <input type="text" placeholder="z. B. Wer scoret zuerst?" />
                            </label>
                            <label>
                                Dein Tipp
                                <input type="text" placeholder="z. B. Team Orange" />
                            </label>
                            <label>
                                Begründung (optional)
                                <textarea rows={3} placeholder="Warum ist das eine gute Wette?"></textarea>
                            </label>
                            <button type="button" className="primary-btn">
                                Vorschlag senden
                            </button>
                        </form>
                    </section>
                </main>

                <aside className="dash-sidebar">
                    <div className="card-block sidebar-block">
                        <h2>Leaderboard</h2>
                        <p className="sub">Top 5 Spieler – {activeTournament?.name}</p>
                        <ul className="leader-list">
                            {activeTournament.leaderboard.length > 0 ? (
                                activeTournament.leaderboard.map((entry, idx) => (
                                    <li key={entry.name + idx}>
                                        <span className="rank">{idx + 1}</span>
                                        <span className="name">{entry.name}</span>
                                        <span className="score">{entry.score}</span>
                                    </li>
                                ))
                            ) : (
                                <li className="empty-hint">Noch keine Spieler für dieses Turnier.</li>
                            )}
                        </ul>
                    </div>
                </aside>
            </div>
        </div>
    );
}
