type RegisterCardProps = {
    username: string;
    onUsernameChange: (v: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    isOpen: boolean;
    onToggle: () => void;
};

export default function RegisterCard({
                                         username,
                                         onUsernameChange,
                                         onSubmit,
                                         isOpen,
                                         onToggle,
                                     }: RegisterCardProps) {
    return (
        <div className={`auth-right ${isOpen ? 'is-open' : ''}`}>
            {/* Mobile toggle */}
            <button type="button" className="mobile-register-toggle" onClick={onToggle}>
                Neu hier?
                <span className={`chevron ${isOpen ? 'rotated' : ''}`}>⌃</span>
            </button>

            <div className="register-content">
                <div className="section-head">
                    <h2>Neu hier?</h2>
                    <p className="subtext">Dann schnapp dir zunächst einen Usernamen.</p>
                </div>

                <form onSubmit={onSubmit} className="form">
                    <label htmlFor="username">Username</label>
                    <input
                        id="username"
                        type="text"
                        onChange={(e) => onUsernameChange(e.target.value)}
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
                        Es wird eine eindeutige ID für dich erzeugt. Speichere sie und gib sie nicht weiter – ohne die ID kannst du dich nicht wieder einloggen.
                    </p>
                </div>
            </div>
        </div>
    );
}
