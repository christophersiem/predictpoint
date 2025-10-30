import { useState } from 'react';
import { useUser } from '../UserContext';
import './Dashboard.css';

export default function Dashboard() {
    const { user } = useUser();
    const [showEvaluated, setShowEvaluated] = useState(false);

    return (
        <div className="dash-page">
            <header className="dash-topbar">
                <div>
                    <p className="dash-hello">Hallo {user?.name ?? 'Spieler'} 👋</p>
                    <p className="dash-sub">Willkommen zurück bei predictpoint</p>
                </div>
            </header>

            <div className="dash-layout">
                {/* MAIN LEFT */}
                <main className="dash-main">
                    {/* 1. Offene Wetten */}
                    <section className="card-block">
                        <div className="section-headline">
                            <h2>Offene Wetten</h2>
                            <p>Diese Tipps laufen aktuell.</p>
                        </div>
                        <div className="open-bets-grid">
                            <article className="bet-card">
                                <p className="bet-title">Wie oft sagt Roman das Wort "Achtung?"</p>
                                <p className="bet-meta">Wette: mehr als 3x</p>
                                <p className="bet-status bet-status-open">läuft …</p>
                            </article>
                            <article className="bet-card">
                                <p className="bet-title">Zu welcher Blockzeit endet der Stream?</p>
                                <p className="bet-meta">Wette: 912372</p>
                                <p className="bet-status bet-status-open">läuft …</p>
                            </article>
                            <article className="bet-card">
                                <p className="bet-title">Ist der BTC Preis ($) nach dem Stream höher oder niedriger als zu Beginn?</p>
                                <p className="bet-meta">Wette: höher</p>
                                <p className="bet-status bet-status-open">läuft …</p>
                            </article>
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
                                <article className="eval-item">
                                    <p className="eval-title">Wie oft sagt Roman das Wort "Scharlatan(e)?"</p>
                                    <p className="eval-meta">Tipp: mind. 1x</p>
                                    <p className="eval-result win">gewonnen +14</p>
                                </article>
                                <article className="eval-item">
                                    <p className="eval-title"> Zu welcher Blockzeit endet der Stream?</p>
                                    <p className="eval-meta">Tipp: 912811</p>
                                    <p className="eval-result loss">verloren</p>
                                </article>
                            </div>
                        )}
                    </section>

                    <section className="card-block">
                        <h2>Wettvorschlag einreichen</h2>
                        <p className="sub">
                            Schlage ein Spiel oder eine Quote vor. (Momentan Dummy-Formular)
                        </p>
                        <form className="proposal-form">
                            <label>
                                Spiel / Event
                                <input type="text" placeholder="z. B. Arsenal vs. Spurs" />
                            </label>
                            <label>
                                Dein Tipp
                                <input type="text" placeholder="z. B. Beide treffen" />
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

                {/* SIDEBAR RIGHT */}
                <aside className="dash-sidebar">
                    <div className="card-block sidebar-block">
                        <h2>Leaderboard</h2>
                        <p className="sub">Top 5 Spieler (Dummy)</p>
                        <ul className="leader-list">
                            <li>
                                <span className="rank">1</span>
                                <span className="name">balu</span>
                                <span className="score">+128</span>
                            </li>
                            <li>
                                <span className="rank">2</span>
                                <span className="name">Anna</span>
                                <span className="score">+95</span>
                            </li>
                            <li>
                                <span className="rank">3</span>
                                <span className="name">Marco</span>
                                <span className="score">+72</span>
                            </li>
                            <li>
                                <span className="rank">4</span>
                                <span className="name">Gast 1</span>
                                <span className="score">+61</span>
                            </li>
                            <li>
                                <span className="rank">5</span>
                                <span className="name">Gast 2</span>
                                <span className="score">+43</span>
                            </li>
                        </ul>
                    </div>
                </aside>
            </div>
        </div>
    );
}
