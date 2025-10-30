type LoginCardProps = {
    id: string;
    onIdChange: (v: string) => void;
    onSubmit: (e: React.FormEvent) => void;
};

export default function LoginCard({ id, onIdChange, onSubmit }: LoginCardProps) {
    return (
        <div className="auth-left">
            <div className="section-head">
                <h2>Einloggen</h2>
                <p className="subtext">Gib deine Kontonummer (ID) ein, um fortzufahren.</p>
            </div>
            <form onSubmit={onSubmit} className="form">
                <label htmlFor="id">Kontonummer / ID</label>
                <input
                    id="id"
                    type="text"
                    onChange={(e) => onIdChange(e.target.value)}
                    value={id}
                    placeholder="z.B. 38afdb25-07fb-454e-a5af-2761d..."
                    required
                />
                <button type="submit" className="primary-btn">
                    Einloggen
                </button>
            </form>
        </div>
    );
}
