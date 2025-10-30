type InfoBannerProps = {
    open: boolean;
    onToggle: () => void;
};

export default function InfoBanner({ open, onToggle }: InfoBannerProps) {
    return (
        <div className={`auth-info-banner ${open ? 'is-open' : ''}`}>
            <button type="button" className="auth-info-toggle" onClick={onToggle}>
                Hinweis zur Nutzung
                <span className={open ? 'info-chevron rotated' : 'info-chevron'}>⌃</span>
            </button>
            <div className="auth-info-content">
                <ul>
                    <li>Dies ist ein Spiel aus Spaß an der Freude – ohne Einsatz.</li>
                    <li>Es handelt sich um ein privates Projekt.</li>
                    <li>Es werden keine sensiblen Daten .</li>
                </ul>
            </div>
        </div>
    );
}
