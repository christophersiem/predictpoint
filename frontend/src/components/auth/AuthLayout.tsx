import {Brand} from "../../layout/Brand.tsx";

type AuthLayoutProps = {
    children: React.ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div className="page">
            <header className="topbar">
                <div className="brand">
                    <Brand size={28} />
                    <span className="sr-only">predictpoint</span>
                </div>
            </header>

            <main className="auth-wrapper">{children}</main>

            <footer className="footer">
                <p>© {new Date().getFullYear()} predictpoint</p>
            </footer>
        </div>
    );
}
