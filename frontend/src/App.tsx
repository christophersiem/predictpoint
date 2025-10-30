import { useState } from 'react';
import './App.css';

function App() {
    const [id, setId] = useState('');
    const [username, setUsername] = useState('');

    // overlay / id
    const [showIdModal, setShowIdModal] = useState(false);
    const [createdId, setCreatedId] = useState('');
    const [copied, setCopied] = useState(false);

    // NEU: mobile-collapse für Registrierung
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: username }),
            });
            if (!response.ok) {
                throw new Error('Fehler beim Registrieren');
            }
            const newId = await response.text();

            setId(newId);
            setCreatedId(newId);
            setShowIdModal(true);
            setCopied(false);
        } catch (error) {
            console.error(error);
            alert('Registrierung fehlgeschlagen');
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id }),
            });
            if (!response.ok) {
                throw new Error('Fehler beim Einloggen');
            }
            const message = await response.text();
            alert(message);
        } catch (error) {
            console.error(error);
            alert('Einloggen fehlgeschlagen');
        }
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(createdId);
            setCopied(true);
            setTimeout(() => setCopied(false), 1800);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="page">
            <header className="topbar">
                <div className="logo-circle">P</div>
                <div>
                    <p className="app-name">predictpoint</p>
                    <p className="app-subtitle">Dein Dashboard für Tipps & Wetten</p>
                </div>
            </header>

            <main className="auth-wrapper">
                <div className="auth-card">
                    {/* LINKS */}
                    <div className="auth-left">
                        <div className="section-head">
                            <h2>Einloggen</h2>
                            <p className="subtext">Gib deine Kontonummer (ID) ein, um fortzufahren.</p>
                        </div>
                        <form onSubmit={handleLogin} className="form">
                            <label htmlFor="id">Kontonummer / ID</label>
                            <input
                                id="id"
                                type="text"
                                onChange={(e) => setId(e.target.value)}
                                value={id}
                                placeholder="z.B. 38afdb25-07fb-454e-a5af-2761d..."
                                required
                            />
                            <button type="submit" className="primary-btn">
                                Einloggen
                            </button>
                        </form>
                    </div>

                    <div className="divider" aria-hidden />

                    {/* RECHTS */}
                    <div className={`auth-right ${isRegisterOpen ? 'is-open' : ''}`}>
                        {/* Mobile-Toggle */}
                        <button
                            type="button"
                            className="mobile-register-toggle"
                            onClick={() => setIsRegisterOpen((prev) => !prev)}
                        >
                            Neu hier?
                            <span className={`chevron ${isRegisterOpen ? 'rotated' : ''}`}>⌃</span>
                        </button>

                        {/* Inhalt, der auf mobile einklappbar ist */}
                        <div className="register-content">
                            <div className="section-head">
                                <h2>Neu hier?</h2>
                                <p className="subtext">Erstelle nur durch die Wahl eines Usernamens ein Konto.</p>
                            </div>

                            <form onSubmit={handleCreateUser} className="form">
                                <label htmlFor="username">Username</label>
                                <input
                                    id="username"
                                    type="text"
                                    onChange={(e) => setUsername(e.target.value)}
                                    value={username}
                                    placeholder="balu"
                                    required
                                />
                                <button type="submit" className="secondary-btn">
                                    Registrieren
                                </button>
                            </form>

                            <div className="important-hint">
                                <p className="important-hint-title">Wichtig 🔐</p>
                                <p>
                                    Es wird eine eindeutige ID für dich erzeugt. Speichere sie und gib sie nicht weiter – ohne die ID
                                    kannst du dich nicht wieder einloggen.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="footer">
                <p>© {new Date().getFullYear()} predictpoint</p>
            </footer>

            {/* Overlay */}
            {showIdModal && (
                <div className="id-modal-backdrop" onClick={() => setShowIdModal(false)}>
                    <div className="id-modal" onClick={(e) => e.stopPropagation()}>
                        <h3>Deine neue ID</h3>
                        <p className="id-modal-text">
                            Diese ID brauchst du jedes Mal zum Einloggen. Bitte sicher abspeichern.
                        </p>
                        <div className="id-box">
                            <span className="id-value">{createdId}</span>
                            <button type="button" className="copy-btn" onClick={handleCopy}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                </svg>
                            </button>
                        </div>
                        {copied && <p className="copied-hint">✅ In die Zwischenablage kopiert</p>}
                        <button
                            type="button"
                            className="primary-btn modal-close-btn"
                            onClick={() => setShowIdModal(false)}
                        >
                            Verstanden
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
