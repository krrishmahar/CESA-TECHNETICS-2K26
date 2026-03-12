// src/lib/logger.ts

export type ActivityAction =
  | 'TAB_SWITCH'
  | 'FULLSCREEN_EXIT'
  | 'COPY_PASTE'
  | 'ROUND_START'
  | 'SUBMIT'
  | 'WINDOW_BLUR'
  | 'DEVTOOLS_OPEN'
  | 'RIGHT_CLICK'
  | 'KEYBOARD_SHORTCUT';

type LogSeverity = 'info' | 'warning' | 'critical';

// ─── Participant session shape stored in localStorage after login ────────────
// Set this when participant logs in via /api/auth/login
// localStorage.setItem('participant_session', JSON.stringify({ registrationId, participantId, roundId }))
interface ParticipantSession {
  registrationId: number;
  participantId: number;
  roundId?: number;
}

const SEVERITY_MAP: Record<ActivityAction, LogSeverity> = {
  TAB_SWITCH:         'warning',
  FULLSCREEN_EXIT:    'warning',
  WINDOW_BLUR:        'warning',
  COPY_PASTE:         'warning',
  RIGHT_CLICK:        'warning',
  KEYBOARD_SHORTCUT:  'warning',
  DEVTOOLS_OPEN:      'critical',
  ROUND_START:        'info',
  SUBMIT:             'info',
};

// ─── Resolve participant session — returns null if admin or not logged in ────
const getParticipantSession = (): ParticipantSession | null => {
  try {
    const raw = localStorage.getItem('participant_session');
    if (!raw) return null;
    const session = JSON.parse(raw) as ParticipantSession;
    // Sanity check — must have at least registrationId
    if (!session.registrationId) return null;
    return session;
  } catch {
    return null;
  }
};

// ─── Core logger — silently no-ops if not a participant session ──────────────
export const logActivity = async (
  action: ActivityAction,
  details: Record<string, unknown> = {},
): Promise<void> => {
  const session = getParticipantSession();
  if (!session) return; // Admin or unauthenticated — skip logging

  try {
    await fetch('/api/activity-logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        registrationId: session.registrationId,
        participantId:  session.participantId,
        roundId:        session.roundId ?? null,
        actionType:     action,
        severity:       SEVERITY_MAP[action],
        details,
        userAgent:      navigator.userAgent,
        // IP is resolved server-side from req.ip — never trust client-sent IP
      }),
    });
  } catch {
    // Silent fail — never block the UI for a logging error
  }
};

// ─── Convenience: update roundId mid-session (call when round starts) ────────
export const setActiveRound = (roundId: number): void => {
  try {
    const raw = localStorage.getItem('participant_session');
    if (!raw) return;
    const session = JSON.parse(raw) as ParticipantSession;
    localStorage.setItem(
      'participant_session',
      JSON.stringify({ ...session, roundId }),
    );
  } catch {
    // ignore
  }
};