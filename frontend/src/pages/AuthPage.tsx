import {Navigate} from 'react-router-dom';
import '../App.css';
import AuthLayout from '../components/auth/AuthLayout';
import LoginCard from '../components/auth/LoginCard';
import RegisterCard from '../components/auth/RegisterCard';
import InfoBanner from '../components/auth/InfoBanner';
import IdModal from '../components/auth/IdModal';
import {useAuthPage} from "../hooks/useAuhPage.ts";

function AuthPage() {
    const {
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
    } = useAuthPage();

    if (loading) {
        return <div style={{padding: 24}}>Lade …</div>;
    }

    if (user) {
        return <Navigate to="/app" replace/>;
    }

    return (
        <AuthLayout>
            <InfoBanner open={showInfo} onToggle={() => setShowInfo((p) => !p)}/>

            <div className="auth-card">
                <LoginCard id={id} onIdChange={setId} onSubmit={handleLoginSubmit}/>

                <div className="divider" aria-hidden/>

                <RegisterCard
                    username={username}
                    onUsernameChange={setUsername}
                    onSubmit={handleRegisterSubmit}
                    isOpen={isRegisterOpen}
                    onToggle={() => setIsRegisterOpen((p) => !p)}
                />
            </div>
            <>
                {formError && (
                    <p style={{color: 'salmon', marginTop: '0.75rem', fontSize: '0.8rem'}}>
                        {formError}
                    </p>
                )}

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
