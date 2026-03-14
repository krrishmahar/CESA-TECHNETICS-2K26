import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Lock, Loader2, RefreshCw } from 'lucide-react';
import { useCompetitionStore } from '@/store/competitionStore';
import { supabase } from '@/lib/supabaseClient';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// Components
import { CompetitionHeader } from './CompetitionHeader';
import { CompetitionTimeline } from './CompetitionTimeline';
import { AnimatedBackground } from './AnimatedBackground';
import { RulesPage } from './RulesPage';
import { WaitingArea } from './WaitingArea';
import { MCQRound } from './MCQRound';
import GithubRound from './GithubRound';
import HackerthonRound from './HackerthonRound';
import { DarkMarkBounty } from '../darkMarkBounty/DarkMarkBounty';
import { CompletionPage } from './RoundPlaceholders';

export const CompetitionLayout = () => {
  const {
    currentRound,
    competitionStatus,
    logTabSwitch,
    userId,
    syncSession
  } = useCompetitionStore();

  const [initializing, setInitializing] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Layout State for Sidebar
  const [timelineHover, setTimelineHover] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const isSidebarExpanded = timelineHover || isPinned;

  // HELPER: Smart Sync that checks for Round Completion
  // HELPER: Smart Sync that checks for Round Completion
  const smartSync = async (sessionData: any) => {
    if (!sessionData) return;

    const round = sessionData.current_round;

    if (!round) {
        syncSession(sessionData);
        return;
    }

    //  FIX: Agar Admin ne status 'frozen' ya 'active' rakha hai, toh hum 'completed' force nahi karenge.
    // Hum sirf tabhi complete manenge jab Admin ne session close kiya ho ya user ne khud submit kiya ho AUR session active na ho.
    
    if (round === 'coding' || round.startsWith('waiting')) {
      const { data: codingSub } = await supabase
        .from('coding_submissions')
        .select('status')
        .eq('user_id', userId)
        .maybeSingle();

      // CHANGE HERE: Check if session is NOT active before forcing completion
      if (codingSub?.status === 'completed' && sessionData.status !== 'active' && sessionData.status !== 'frozen') {
        console.log("✅ Detected Coding Completion. Forcing 'completed' state.");
        syncSession({ ...sessionData, current_round: 'completed' });
        return;
      }
    }

    // Default behavior
    syncSession(sessionData);
  };

  // 1. INITIAL DB SYNC
  useEffect(() => {
    const initialSync = async () => {
      if (!userId) {
        setInitializing(false);
        return;
      }
      try {
        const { data } = await supabase.from('exam_sessions').select('*').eq('user_id', userId).single();
        if (data) await smartSync(data);
      } catch (err) {
        console.error("Sync failed:", err);
      } finally {
        setInitializing(false);
      }
    };
    initialSync();
  }, [userId, syncSession]);

  // 2. REALTIME LISTENER
  useEffect(() => {
    if (!userId) return;
    const channel = supabase.channel('user-session-sync')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'exam_sessions', filter: `user_id=eq.${userId}` },
        async (payload) => {
          console.log("Realtime Update Recieved:", payload.new);
          await smartSync(payload.new);
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [userId, syncSession]);

  // 3. BACKUP POLLING
  useEffect(() => {
    if (!userId) return;
    
    // Only poll if valid round state exists to avoid unnecessary calls
    if (!currentRound) return;

    const shouldPoll = currentRound.includes('waiting') || competitionStatus === 'active';
    if (!shouldPoll) return;

    const interval = setInterval(async () => {
      const { data } = await supabase.from('exam_sessions').select('*').eq('user_id', userId).single();
      if (data) {
        await smartSync(data);
      }
    }, 3000); 
    return () => clearInterval(interval);
  }, [currentRound, userId, syncSession, competitionStatus]);

  // 4. ANTI-CHEAT LOGIC
  useEffect(() => {
    if (!currentRound) return;

    const isProctoredZone = currentRound === 'mcq' || currentRound === 'darkmark' || currentRound === 'rules' ;
    if (!isProctoredZone || competitionStatus !== 'active') return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (logTabSwitch) logTabSwitch();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [currentRound, competitionStatus, logTabSwitch]);

  const handleManualRefresh = async () => {
    if (!userId) return;
    setIsRefreshing(true);
    try {
        const { data } = await supabase.from('exam_sessions').select('*').eq('user_id', userId).single();
        if (data) {
            await smartSync(data);
            if(data.status === 'active') {
                toast.success("Competition Resumed!");
            } else {
                toast.info("Status refreshed. Still frozen.");
            }
        }
    } catch (error) {
        toast.error("Failed to refresh status");
    } finally {
        setIsRefreshing(false);
    }
  };

  const renderRound = () => {
    if (!currentRound) return <RulesPage />; // Fallback if null

    switch (currentRound) {
      case 'rules': return <RulesPage />;
      case 'waiting': 
      case 'waiting_r2': 
      case 'waiting_r3': 
        return <WaitingArea />;
      case 'mcq': return <MCQRound />;
      case 'flowchart': return <GithubRound />;
      case 'coding': return <HackerthonRound />;
      case 'darkmark': return <DarkMarkBounty />;
      case 'completed': return <CompletionPage />;
      default: return <RulesPage />;
    }
  };

  if (initializing) {
    return (
      <div className="min-h-screen bg-[#021516] flex flex-col items-center justify-center gap-4 text-gray-500">
        <Loader2 className="w-10 h-10 animate-spin text-[#d4af37]" />
        <p className="animate-pulse font-wizard text-lg tracking-widest text-[#B5FFF0]/40">Synchronizing Arena...</p>
      </div>
    );
  }

  if (competitionStatus === 'frozen') {
    return (
      <div className="h-screen w-full bg-[#050b0b] flex items-center justify-center p-4 z-50 fixed inset-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-[#0a1515] border-2 border-[#d4af37]/30 rounded-3xl p-10 text-center shadow-[0_0_50px_rgba(212,175,55,0.1)] relative overflow-hidden"
        >
          {/* Background Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-[#d4af37]/50 to-transparent" />

          <div className="mb-8 relative inline-block">
            <div className="absolute inset-0 bg-[#d4af37]/20 blur-2xl rounded-full" />
            <div className="w-20 h-20 rounded-2xl bg-[#d4af37]/10 border-2 border-[#d4af37]/40 flex items-center justify-center relative z-10">
              <Lock size={40} className="text-[#d4af37]" />
            </div>
          </div>

          <h1 className="text-[46px] font-wizard text-white mb-4 tracking-wider leading-tight">Arena Frozen</h1>

          <div className="bg-[#d4af37]/5 border border-[#d4af37]/20 rounded-xl p-4 mb-8 flex items-center gap-3 justify-center text-[#d4af37]">
            <AlertTriangle size={20} />
            <span className="text-sm font-bold uppercase tracking-widest">Suspicious Activity Detected</span>
          </div>

          <p className="text-gray-400 text-sm leading-relaxed mb-10">
            We detected multiple tab switches or unauthorized browser activity. Your exam has been <span className="text-white font-bold">temporarily locked</span> for security reasons.
            <br /><br />
            Please contact an <span className="text-[#d4af37]">invigilator</span> to verify your session and resume the test.
          </p>

          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-[#8a6e2e] to-[#d4af37] text-black font-wizard font-bold text-lg hover:from-[#d4af37] hover:to-[#FFD700] transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(212,175,55,0.3)] group disabled:opacity-50"
          >
            <RefreshCw size={20} className={cn("group-hover:rotate-180 transition-transform duration-500", isRefreshing && "animate-spin")} />
            <span>{isRefreshing ? 'Checking scrolls...' : 'Refresh Status'}</span>
          </button>
        </motion.div>
      </div>
    );
  }

  if (competitionStatus === 'disqualified') {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#021516] relative p-6 z-50">
        <div className="text-center max-w-md">
          <AlertTriangle className="w-20 h-20 text-red-600 mx-auto mb-6" />
          <h1 className="text-4xl font-wizard text-red-600 mb-4 tracking-widest uppercase">DISQUALIFIED</h1>
          <p className="text-[#B5FFF0]/40 font-medium">Your attempt has been terminated due to repeated violations of the Sacred Rules.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex flex-col bg-[#021516] text-white selection:bg-[#d4af37]/30 overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <AnimatedBackground />
      </div>

      <div className="relative z-10 shrink-0">
        <CompetitionHeader />
      </div>

      <main className="relative z-10 flex-1 flex min-h-0 overflow-hidden m-4 gap-4 transition-all duration-500">
        {/* SIDEBAR */}
        <div className="hidden lg:block h-full shrink-0">
          <motion.div
            initial={false}
            animate={{ width: currentRound === 'coding' ? (isSidebarExpanded ? 280 : 60) : 280 }}
            transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
            className="h-full relative"
          >
            {currentRound === 'coding' ? (
              <div
                className="h-full flex flex-col"
                onMouseEnter={() => setTimelineHover(true)}
                onMouseLeave={() => setTimelineHover(false)}
              >
                <div className={cn(
                  "h-full bg-[#051112]/90 backdrop-blur border border-[#d4af37]/10 rounded-xl overflow-hidden relative transition-colors duration-300",
                  isSidebarExpanded ? "shadow-2xl border-[#d4af37]/20" : "hover:border-[#d4af37]/30"
                )}>
                  <div className={cn("absolute top-3 right-3 z-10 transition-opacity duration-300", isSidebarExpanded ? "opacity-100 visible" : "opacity-0 invisible")}>
                    <button
                      onClick={() => setIsPinned(!isPinned)}
                      className={cn("p-1.5 rounded-md transition-all hover:bg-white/5", isPinned ? "text-[#d4af37] rotate-0" : "text-gray-500 -rotate-45")}
                      title={isPinned ? "Unpin Timeline" : "Pin Timeline"}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="17" y2="22" /><path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z" /></svg>
                    </button>
                  </div>

                  {isSidebarExpanded ? (
                    <div className="h-full overflow-y-auto custom-scrollbar p-4 animate-in fade-in duration-300 overscroll-y-contain">
                      <CompetitionTimeline />
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center cursor-pointer group">
                      <div className="writing-mode-vertical-rl text-xs font-wizard text-gray-500 group-hover:text-[#d4af37] uppercase tracking-widest py-2 whitespace-nowrap" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                        Competition Timeline
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full bg-[#051112]/90 backdrop-blur border border-[#d4af37]/10 rounded-xl p-4 overflow-hidden shadow-xl animate-in fade-in slide-in-from-left-4 duration-500">
                <div className="h-full overflow-y-auto custom-scrollbar overscroll-y-contain">
                  <CompetitionTimeline />
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* MAIN ROUND CONTENT */}
        <div className="flex-1 h-full min-w-0 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentRound}
              initial={{ opacity: 0, y: 10, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.99 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="h-full w-full relative" 
            >
              {renderRound()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}