// src/App.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import { useUser } from './UserContext';
import React from "react";

function App() {
    const { user } = useUser();

    return (
        <Routes>
            <Route path="/" element={<AuthPage/>} />
            <Route
                path="/dashboard"
                element={user ? <Dashboard /> : <Navigate to="/" replace />}
            />
        </Routes>
    );
}

export default App;
