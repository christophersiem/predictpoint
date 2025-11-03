import {Route, Routes} from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import NewTournamentPage from './pages/NewTournamentPage';
import AppShell from './layout/AppShell';


export default function App() {
    return (
        <Routes>
            <Route path="/" element={<AuthPage />} />
            <Route path="/app" element={<AppShell />}>
                <Route index element={<Dashboard />} />
                <Route path="tournaments/new" element={<NewTournamentPage />} />
            </Route>
        </Routes>
    );
}