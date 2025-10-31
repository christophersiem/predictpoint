// src/ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from './context/UserContext.tsx';

type ProtectedRouteProps = {
    element: React.ReactNode; // nicht JSX.Element
};

export function ProtectedRoute({ element }: ProtectedRouteProps): React.ReactNode {
    const { user, loading } = useUser();

    if (loading) {
        return <div style={{ padding: 24 }}>Lade …</div>;
    }

    if (!user) {
        return <Navigate to="/" replace />;
    }

    // React.ReactNode wird zurückgegeben -> passt zum Router
    return element;
}
