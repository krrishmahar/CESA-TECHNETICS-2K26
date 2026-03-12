// src/hooks/useAntiCheat.ts
import { useEffect } from 'react';

// src/lib/logger.ts
import { supabase } from '../api/auth';

export type LogAction = 'TAB_SWITCH' | 'FULLSCREEN_EXIT' | 'COPY_PASTE' | 'ROUND_START' | 'SUBMIT';

export const logActivity = async (action: LogAction, details: any = {}) => {
  try {
    // const { data: { user } } = await supabase.auth.getUser();
    // if (!user) return;

    await supabase.from('activity_logs').insert({
      user_id: user.id,
      action_type: action,
      details: details,
      severity: action === 'TAB_SWITCH' || action === 'FULLSCREEN_EXIT' ? 'warning' : 'info',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Failed to log activity:", error);
  }
};

export const useAntiCheat = () => {
  useEffect(() => {
    // 1. Detect Tab Switching
    const handleVisibilityChange = () => {
      if (document.hidden) {
        logActivity('TAB_SWITCH', { message: 'User switched tabs/minimized window' });
        // Optional: Trigger Warning UI here
      }
    };

    // 2. Detect Fullscreen Exit (Agar fullscreen force karwana hai)
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        logActivity('FULLSCREEN_EXIT', { message: 'User exited fullscreen mode' });
      }
    };

    // 3. Detect Copy/Paste
    const handleCopy = () => logActivity('COPY_PASTE', { type: 'copy' });
    const handlePaste = () => logActivity('COPY_PASTE', { type: 'paste' });

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
  }, []);
};