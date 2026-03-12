import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useGameStore } from '../store/useGameStore';

interface GameProtectedRouteProps {
    children: React.ReactNode;
    requiredRoundId: string;
    redirectTo?: string;
}

/**
 * GameProtectedRoute
 * Enforces that a user can only access a specific round if their currentRoundId 
 * in the store matches or if they are an admin.
 */
const GameProtectedRoute: React.FC<GameProtectedRouteProps> = ({ 
    children, 
    requiredRoundId, 
    redirectTo = '/waiting-list' 
}) => {
    const { role, currentRoundId } = useGameStore();
    const location = useLocation();

    // Admins have full access
    if (role === 'admin') {
        return <>{children}</>;
    }

    // Participants must have the correct round ID
    // If currentRoundId is null, they should be in the waiting room
    if (currentRoundId !== requiredRoundId) {
        console.warn(`Access denied to ${location.pathname}. Required Round: ${requiredRoundId}, Current Round: ${currentRoundId}`);
        
        // If they are ahead of where they should be, send them back
        return <Navigate to={redirectTo} replace />;
    }

    return <>{children}</>;
};

export default GameProtectedRoute;
