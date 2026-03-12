import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../api/auth';

export type TimerStatus = 'pending' | 'running' | 'paused' | 'stopped' | 'expired';

export interface TimerState {
    roundId: string;
    timerStatus: TimerStatus;
    remainingSeconds: number;
    durationSeconds: number;
    startedAt: string | null;
    pausedAt: string | null;
    stoppedAt: string | null;
    totalPausedSecs: number;
}

export const useServerTimer = (roundId: string | number) => {
    const [timerState, setTimerState] = useState<TimerState | null>(null);
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!roundId) return;

        let pollInterval: ReturnType<typeof setInterval>;
        let countdownInterval: ReturnType<typeof setInterval>;

        const fetchTimer = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/timer/round/${roundId}`);
                if (!res.ok) throw new Error('Failed to fetch timer');
                const data: TimerState = await res.json();
                
                setTimerState(data);
                
                // If the endpoint specifically replies remainingSeconds natively:
                setTimeLeft(data.remainingSeconds);
            } catch (err: any) {
                setError(err.message);
            }
        };

        // Initial fetch
        fetchTimer();

        // 1. Long-polling sync every 5 seconds
        pollInterval = setInterval(fetchTimer, 5000);

        // 2. Local countdown interpolation every 1 second (if running)
        countdownInterval = setInterval(() => {
            setTimerState(prev => {
                if (prev && prev.timerStatus === 'running') {
                    setTimeLeft(current => Math.max(0, current - 1));
                }
                return prev;
            });
        }, 1000);

        return () => {
            clearInterval(pollInterval);
            clearInterval(countdownInterval);
        };
    }, [roundId]);

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        
        if (h > 0) {
            return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        }
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return { 
        timerState, 
        timeLeft, 
        formattedTime: formatTime(timeLeft), 
        error 
    };
};
