import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useUser} from '../context/UserContext';
import {useAuth} from './useAuth';

export function useAuthPage() {
    const [id, setId] = useState('');
    const [username, setUsername] = useState('');
    const [showIdModal, setShowIdModal] = useState(false);
    const [createdId, setCreatedId] = useState('');
    const [copied, setCopied] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [showInfo, setShowInfo] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    const navigate = useNavigate();
    const { user, loading } = useUser();
    const { login, register } = useAuth();

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);
        try {
            await login(id);
            navigate('/app');
        } catch (err: any) {
            console.error(err);
            setFormError(err?.message ?? 'Einloggen fehlgeschlagen');
        }
    };

    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);
        try {
            const newId = await register(username);
            setId(newId);
            setCreatedId(newId);
            setShowIdModal(true);
            setCopied(false);
        } catch (err: any) {
            console.error(err);
            setFormError(err?.message ?? 'Registrierung fehlgeschlagen');
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

    return {
        user,
        loading,

        id,
        setId,
        username,
        setUsername,

        showIdModal,
        setShowIdModal,
        createdId,
        copied,
        isRegisterOpen,
        setIsRegisterOpen,
        showInfo,
        setShowInfo,
        formError,

        handleLoginSubmit,
        handleRegisterSubmit,
        handleCopy,
    };
}
