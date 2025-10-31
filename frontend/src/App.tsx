import { Routes, Route } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import { ProtectedRoute } from './ProtectedRoute';

function App() {
    return (
        <Routes>
            <Route path="/" element={<AuthPage />} />
            <Route
                path="/dashboard"
                element={<ProtectedRoute element={<Dashboard />} />}
            />
        </Routes>
    );
}

export default App;
