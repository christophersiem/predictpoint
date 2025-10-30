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
                                <p className="bet-title">Liverpool vs. Chelsea</p>
                                <p className="bet-meta">Wette: Über 2,5 Tore • Einsatz: 10</p>
                                <p className="bet-status bet-status-open">läuft …</p>
                            </article>
                            <article className="bet-card">
                                <p className="bet-title">Bayern vs. Dortmund</p>
                                <p className="bet-meta">Wette: Sieg Bayern • Einsatz: 5</p>
                                <p className="bet-status bet-status-open">läuft …</p>
                            </article>
                            <article className="bet-card">
                                <p className="bet-title">Real Madrid vs. Girona</p>
                                <p className="bet-meta">Wette: Beide treffen • Einsatz: 7</p>
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
                                    <p className="eval-title">PSG vs. Lyon</p>
                                    <p className="eval-meta">Tipp: Sieg PSG • Einsatz: 10</p>
                                    <p className="eval-result win">gewonnen +14</p>
                                </article>
                                <article className="eval-item">
                                    <p className="eval-title">Inter vs. Milan</p>
                                    <p className="eval-meta">Tipp: Unentschieden • Einsatz: 5</p>
                                    <p className="eval-result loss">verloren</p>
                                </article>
                                <article className="eval-item">
                                    <p className="eval-title">Leipzig vs. Köln</p>
                                    <p className="eval-meta">Tipp: Über 1,5 Tore • Einsatz: 7</p>
                                    <p className="eval-result win">gewonnen +5</p>
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
