type AuthLayoutProps = {
    children: React.ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div className="page">
            <header className="topbar">
                <div className="logo-circle">P</div>
                <div>
                    <p className="app-name">predictpoint</p>
                    <p className="app-subtitle">Was macht Roman heute?</p>
                </div>
            </header>

            <main className="auth-wrapper">{children}</main>

            <footer className="footer">
                <p>© {new Date().getFullYear()} predictpoint</p>
            </footer>
        </div>
    );
}
