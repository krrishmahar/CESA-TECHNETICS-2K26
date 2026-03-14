import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, ShieldCheck, Clock, RefreshCw, CheckCircle2, Hourglass } from 'lucide-react';
import { useCompetitionStore } from '@/store/competitionStore';
import { supabase } from '@/lib/supabaseClient';

export const WaitingArea = () => {
  const { email, userId, syncSession, currentRound } = useCompetitionStore();
  const [checking, setChecking] = useState(false);

  const handleManualRefresh = async () => {
    if (!userId) return;
    setChecking(true);
    try {
        const { data } = await supabase
            .from('exam_sessions')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (data) {
            console.log("Manual Refresh Sync:", data);
            syncSession(data);
        }
    } catch (e) {
        console.error("Refresh failed", e);
    }
    setTimeout(() => setChecking(false), 1000);
  };

  // Dynamic Content based on which waiting room we are in
  const getContent = () => {
    const { isDarkMark } = useCompetitionStore.getState();

    switch (currentRound) {
        case 'waiting':
            if (isDarkMark) {
                return {
                    title: "Authorized Access",
                    icon: <ShieldCheck className="w-12 h-12 text-red-500" />,
                    bg: "bg-red-500/10",
                    desc: "Identity verified. You are in the secure queue for the Dark Mark Bounty.",
                    status: "WAITING FOR EXTRACTION"
                };
            }
            return {
                title: "Rules Accepted",
                icon: <ShieldCheck className="w-12 h-12 text-green-500" />,
                bg: "bg-green-500/10",
                desc: "You are in the secure lobby. Round 1 will start shortly.",
                status: "WAITING FOR ROUND 1"
            };
        case 'waiting_r2':
            return {
                title: "Round 1 Submitted",
                icon: <CheckCircle2 className="w-12 h-12 text-blue-500" />,
                bg: "bg-blue-500/10",
                desc: "Your MCQ responses have been recorded. Please wait for the results processing.",
                status: "WAITING FOR ROUND 2"
            };
        case 'waiting_r3':
            return {
                title: "Flowchart Submitted",
                icon: <Hourglass className="w-12 h-12 text-yellow-500" />,
                bg: "bg-yellow-500/10",
                desc: "Your Logic design is saved. Get ready for the final coding challenge.",
                status: "WAITING FOR ROUND 3"
            };
        default:
            return {
                title: "Please Wait",
                icon: <Clock className="w-12 h-12 text-zinc-500" />,
                bg: "bg-zinc-500/10",
                desc: "Synchronizing with server status...",
                status: "CONNECTING..."
            };
    }
  };

  const content = getContent();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 relative overflow-hidden pointer-events-auto">
      {/* Ambient particles background */}
      <div className="absolute inset-0 opacity-10 mix-blend-screen pointer-events-none bg-teal-500/5 blur-3xl rounded-full animate-pulse" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center w-full max-w-2xl bg-[#051112]/90 p-8 md:p-12 border-2 border-[#d4af37] rounded-xl shadow-[0_0_40px_rgba(212,175,55,0.3)] backdrop-blur-sm z-10"
      >
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-5xl md:text-6xl mb-6 drop-shadow-[0_0_15px_rgba(212,175,55,0.8)] font-wizard text-[#d4af37]"
        >
          {content.title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="text-lg md:text-xl text-gray-300 font-sans mb-10 leading-relaxed"
        >
          {content.desc}
          <br />
          <span className="text-sm text-gray-500 mt-4 block italic uppercase tracking-[0.2em]">{content.status}</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex justify-center mb-10"
        >
          {/* Simple magic ring loader */}
          <div className="w-20 h-20 relative">
            <div className="absolute inset-0 border-4 border-[#d4af37]/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-4 border-[#FFD700] border-b-transparent rounded-full animate-[spin_1.5s_linear_infinite_reverse]"></div>
          </div>
        </motion.div>

        <div className="flex flex-col items-center gap-4">
            <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "#d4af37", color: "black", boxShadow: "0 0 20px rgba(212,175,55,0.6)" }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                onClick={handleManualRefresh}
                disabled={checking}
                className="bg-transparent border-2 border-[#d4af37] text-[#d4af37] px-10 py-3 rounded-lg transition-colors font-bold tracking-wider font-wizard text-xl flex items-center gap-3 disabled:opacity-50"
            >
                {checking ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
                {checking ? "SYNCHRONIZING..." : "REFRESH STATUS"}
            </motion.button>
            <div className="flex items-center gap-2 text-[#d4af37]/50 text-[10px] uppercase font-bold tracking-widest">
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>Live connection established</span>
            </div>
        </div>
      </motion.div>
    </div>
  );
};