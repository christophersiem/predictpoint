type InfoBannerProps = {
    open: boolean;
    onToggle: () => void;
};

export default function InfoBanner({ open, onToggle }: InfoBannerProps) {
    return (
        <div className={`auth-info-banner ${open ? 'is-open' : ''}`}>
            <button type="button" className="auth-info-toggle" onClick={onToggle}>
                Hinweise zur Nutzung
                <span className={open ? 'info-chevron rotated' : 'info-chevron'}>⌃</span>
            </button>
            <div className="auth-info-content">
                <ul>
                    <li>Dies ist ein Spiel aus Spaß an der Freude – ohne Einsatz.</li>
                    <li>Es handelt sich um ein privates Projekt.</li>
                    <li>Es müssen keine sensiblen Daten angegeben werden .</li>
                </ul>
            </div>
        </div>
    );
}
