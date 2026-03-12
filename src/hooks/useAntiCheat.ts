// src/hooks/useAntiCheat.ts
import { useEffect } from 'react';
import { logActivity } from '../lib/logger';
import { useGameStore } from '../store/useGameStore';


export const useAntiCheat = (roundId?: string) => {
  const { user } = useGameStore();

  useEffect(() => {
    if (!user) return;

    // 1. Detect Tab Switching
    const handleVisibilityChange = () => {
      if (document.hidden) {
        logActivity('TAB_SWITCH', { message: 'User switched tabs/minimized window', roundId });
      }
    };

    // 2. Detect Fullscreen Exit
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        logActivity('FULLSCREEN_EXIT', { message: 'User exited fullscreen mode', roundId });
      }
    };

    // 3. Detect Copy/Paste
    const handleCopy = () => logActivity('COPY_PASTE', { type: 'copy', roundId });
    const handlePaste = () => logActivity('COPY_PASTE', { type: 'paste', roundId });

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('paste', handlePaste);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('paste', handlePaste);
    };
  }, [user, roundId]);
};