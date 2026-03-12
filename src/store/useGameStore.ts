import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
    id: string;
    email: string;
    username?: string;
    registrationId?: string;
}

interface GameState {
    user: User | null;
    role: 'participant' | 'admin' | null;
    currentEvent: string | null;
    currentRoundId: string | null;
    
    // Actions
    setAuth: (user: User | null, role: 'participant' | 'admin' | null) => void;
    setEventContext: (eventSlug: string | null, roundId: string | null) => void;
    logout: () => void;
}

export const useGameStore = create<GameState>()(
    persist(
        (set) => ({
            user: null,
            role: null,
            currentEvent: null,
            currentRoundId: null,

            setAuth: (user, role) => set({ user, role }),
            setEventContext: (currentEvent, currentRoundId) => set({ currentEvent, currentRoundId }),
            logout: () => set({ user: null, role: null, currentEvent: null, currentRoundId: null }),
        }),
        {
            name: 'technetics-game-storage',
        }
    )
);
