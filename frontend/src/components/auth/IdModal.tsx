type IdModalProps = {
    id: string;
    copied: boolean;
    onCopy: () => void;
    onClose: () => void;
};

export default function IdModal({ id, copied, onCopy, onClose }: IdModalProps) {
    return (
        <div className="id-modal-backdrop" onClick={onClose}>
            <div className="id-modal" onClick={(e) => e.stopPropagation()}>
                <h3>Deine neue ID</h3>
                <p className="id-modal-text">
                    Diese ID brauchst du jedes Mal zum Einloggen. Bitte sicher abspeichern.
                </p>
                <div className="id-box">
                    <span className="id-value">{id}</span>
                    <button type="button" className="copy-btn" onClick={onCopy}>
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
                <button type="button" className="primary-btn modal-close-btn" onClick={onClose}>
                    Verstanden
                </button>
            </div>
        </div>
    );
}
