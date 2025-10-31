import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import '../App.css';
import AuthLayout from '../components/auth/AuthLayout';
import LoginCard from '../components/auth/LoginCard';
import RegisterCard from '../components/auth/RegisterCard';
import InfoBanner from '../components/auth/InfoBanner';
import IdModal from '../components/auth/IdModal';
import { useAuth } from '../hooks/useAuth';

function AuthPage() {
    const [id, setId] = useState('');
    const [username, setUsername] = useState('');
    const [showIdModal, setShowIdModal] = useState(false);
    const [createdId, setCreatedId] = useState('');
    const [copied, setCopied] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [showInfo, setShowInfo] = useState(false);

    const navigate = useNavigate();
    const { user, loading } = useUser();
    const { login, register } = useAuth();

    if (loading) {
        return <div style={{ padding: 24 }}>Lade …</div>;
    }
    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(id);
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            alert('Einloggen fehlgeschlagen');
        }
    };

    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const newId = await register(username);
            setId(newId);
            setCreatedId(newId);
            setShowIdModal(true);
            setCopied(false);
        } catch (err) {
            console.error(err);
            alert('Registrierung fehlgeschlagen');
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
            <InfoBanner open={showInfo} onToggle={() => setShowInfo((p) => !p)} />

            <div className="auth-card">
                <LoginCard
                    id={id}
                    onIdChange={setId}
                    onSubmit={handleLoginSubmit}
                />

                <div className="divider" aria-hidden />

                <RegisterCard
                    username={username}
                    onUsernameChange={setUsername}
                    onSubmit={handleRegisterSubmit}
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
        </AuthLayout>
    );
}

export default AuthPage;
