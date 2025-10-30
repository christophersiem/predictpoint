import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useUser} from '../UserContext';
import '../App.css';
import AuthLayout from '../components/auth/AuthLayout';
import LoginCard from '../components/auth/LoginCard';
import RegisterCard from '../components/auth/RegisterCard';
import InfoBanner from '../components/auth/InfoBanner';
import IdModal from '../components/auth/IdModal';

function AuthPage() {
    const [id, setId] = useState('');
    const [username, setUsername] = useState('');
    const [showIdModal, setShowIdModal] = useState(false);
    const [createdId, setCreatedId] = useState('');
    const [copied, setCopied] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [showInfo, setShowInfo] = useState(false);

    const navigate = useNavigate();
    const {setUser} = useUser();

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/user', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({name: username}),
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
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({id}),
            });
            if (!response.ok) {
                throw new Error('Fehler beim Einloggen');
            }

            const data = await response.json();
            setUser({id: data.id, name: data.name});
            navigate('/dashboard');
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
        <AuthLayout>
            <InfoBanner open={showInfo} onToggle={() => setShowInfo((p) => !p)}/>
            <>
                <div className="auth-card">
                    <LoginCard
                        id={id}
                        onIdChange={setId}
                        onSubmit={handleLogin}
                    />

                    <div className="divider" aria-hidden/>

                    <RegisterCard
                        username={username}
                        onUsernameChange={setUsername}
                        onSubmit={handleCreateUser}
                        isOpen={isRegisterOpen}
                        onToggle={() => setIsRegisterOpen((p) => !p)}
                    />
                </div>

                {showIdModal && (
                    <IdModal
                        id={createdId}
                        copied={copied}
                        onCopy={handleCopy}
                        onClose={() => setShowIdModal(false)}
                    />
                )}
            </>
        </AuthLayout>
    );
}

export default AuthPage;
