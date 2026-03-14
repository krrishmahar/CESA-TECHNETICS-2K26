import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

import { supabase } from '@/lib/supabaseClient'; 
import { Lock, LogOut, HelpCircle, MapPin, AlertTriangle, BrainCircuit, Wand2, Code2, Sparkles } from 'lucide-react';
import MainLayout from '../layouts/technetics/MainLayout';


import { CompetitionLayout } from './competition/CompetitionLayout';
import { useCompetitionStore } from '@/store/competitionStore';


// --- ANIMATED TITLE COMPONENT ---
const WizardTitle = ({ text, className = "text-5xl md:text-7xl" }: { text: string, className?: string }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`font-wizard text-[#FFD700] tracking-widest relative z-10 drop-shadow-[0_0_20px_rgba(212,175,55,0.4)] ${className}`}
    >
      {text}
    </motion.div>
  );
};

// --- SUB-COMPONENTS ---

const LockedRules = () => {
    const navigate = useNavigate();
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-6 border border-[#d4af37]/20 bg-[#051112]/50 rounded-2xl p-8 backdrop-blur-sm animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 bg-[#d4af37]/10 rounded-full flex items-center justify-center border border-[#d4af37]/30 shadow-[0_0_30px_rgba(212,175,55,0.2)] animate-pulse">
                <Lock className="w-10 h-10 text-[#d4af37]" />
            </div>
            <div className="space-y-2">
                <h3 className="text-2xl font-wizard font-bold text-white tracking-wide">RESTRICTED ACCESS</h3>
                <p className="text-gray-400 max-w-md mx-auto leading-relaxed">
                    The competition protocols are classified. You must identify yourself to access the <span className="text-[#FFD700] font-wizard">The Order's</span> rules.
                </p>
            </div>
            <button onClick={() => navigate('/login')} className="px-8 py-3 bg-gradient-to-r from-[#8a6e2e] to-[#d4af37] hover:from-[#d4af37] hover:to-[#FFD700] text-black font-wizard font-bold rounded-lg tracking-wider transition-all shadow-lg">
                LOGIN TO UNLOCK
            </button>
        </div>
    );
};

const AboutContent = () => (
  <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">
    
    <div className="text-center space-y-6">
        <div className="relative inline-block">
            <div className="absolute inset-0 bg-[#d4af37]/10 blur-[50px] rounded-full pointer-events-none" />
            <WizardTitle text="TECHNETICS 2K26" className="text-5xl md:text-7xl" />
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-3 text-gray-400 font-mono text-sm md:text-base">
            <span className="bg-[#d4af37]/10 border border-[#d4af37]/30 px-4 py-1.5 rounded-full text-[#FFD700] shadow-[0_0_10px_rgba(212,175,55,0.1)]">MARCH 16 - 18, 2026</span>
            <span className="hidden md:inline">•</span>
            <span className="text-teal-100 tracking-wide">Vasantdada Patil Pratishthan’s College, Sion</span>
        </div>

        <div className="max-w-4xl mx-auto bg-[#051112]/40 border-l-4 border-[#d4af37] p-6 rounded-r-xl backdrop-blur-sm text-left shadow-2xl">
            <p className="text-lg text-gray-300 leading-relaxed font-light">
                <strong className="text-white">Technetics</strong> Where Code Meets Magic. 
                Hosted by the <span className="text-[#FFD700]">CESA & CSI</span> Council, we invite the brightest minds 
                to compete in a multi-round showdown and a 15-hour hackathon. Forge your digital legacy in the arena of logic.
            </p>
        </div>
    </div>

    <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-[#051112]/60 border border-[#d4af37]/10 p-6 rounded-xl hover:border-[#d4af37]/50 transition-colors group">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-[#d4af37]/10 rounded-lg text-[#d4af37] group-hover:bg-[#d4af37] group-hover:text-black transition-colors"><BrainCircuit className="w-6 h-6" /></div>
                <h3 className="text-2xl font-wizard text-white group-hover:text-[#FFD700]">The Order of Obscure code</h3>
            </div>
            <ul className="space-y-2 text-gray-400 text-sm">
                <li><span className="text-[#d4af37]">✦</span> Round 1: Arithmancy (Aptitude)</li>
                <li><span className="text-[#d4af37]">✦</span> Round 2: Ancient Runes (Flowchart)</li>
                <li><span className="text-[#d4af37]">✦</span> Round 3: Dark Code Defense (Coding)</li>
            </ul>
        </div>

        <div className="bg-[#051112]/60 border border-[#d4af37]/10 p-6 rounded-xl hover:border-teal-500/50 transition-colors group">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-teal-900/20 rounded-lg text-teal-400 group-hover:bg-teal-600 group-hover:text-black transition-colors"><Code2 className="w-6 h-6" /></div>
                <h3 className="text-2xl font-wizard text-white group-hover:text-teal-400">The Dark Mark Bounty</h3>
            </div>
            <p className="text-gray-400 text-sm">15-Hour intensive implementation marathon. Build solutions for real-world magical problems.</p>
        </div>
    </div>

    <div className="mt-16 pt-6 border-t border-gray-900 flex justify-center">
        <span className="text-xs font-mono text-gray-600">Designed & Developed by CESA-TECH TEAM</span>
    </div>
  </div>
);

const HelpContent = () => (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <WizardTitle text="Support & Protocols" className="text-4xl mb-8 text-center" />
      <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-[#051112]/50 border border-[#d4af37]/30 p-6 rounded-xl">
              <h3 className="text-xl font-wizard text-white flex items-center gap-2 mb-4"><AlertTriangle className="text-[#FFD700]" /> Assistance</h3>
              <p className="text-gray-400 text-sm">Notify an invigilator immediately if you face any issues. Do not minimize your terminal.</p>
          </div>
          <div className="bg-[#051112]/50 border border-[#d4af37]/20 p-6 rounded-xl">
              <h3 className="text-xl font-wizard text-white flex items-center gap-2 mb-4"><HelpCircle className="text-teal-400" /> General FAQ</h3>
              <p className="text-gray-400 text-sm">Dedicated secure network provided. Tab switching strictly monitored.</p>
          </div>
      </div>
    </div>
);

const HomePage = () => {

  const [activeTab, setActiveTab] = useState<'rules' | 'about' | 'help'>('rules');
  const [session, setSession] = useState<any>(null);
  const location = useLocation();
  const [showIntro, setShowIntro] = useState(location.pathname === '/');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { currentRound } = useCompetitionStore();
  
  const ADMIN_EMAILS = ["admin@technetics.com"];

  useEffect(() => {
    const checkUser = async () => {
        try {
            const { data: { session: currentSession } } = await supabase.auth.getSession();
            setSession(currentSession);
            
            // Re-sync showIntro if path changes or on initial load
            if (location.pathname === '/rules' && currentSession) {
              setShowIntro(false);
            } else if (location.pathname === '/') {
              setShowIntro(true);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    checkUser();
  }, [location.pathname]);




  const handleLogout = async () => {
    await supabase.auth.signOut();
    setShowIntro(true);
    navigate('/login');
  };

  if (loading) return <div className="min-h-screen bg-[#021516]" />;

  const showNavbar = !session || (session && currentRound === 'rules');

  return (
    <div className="min-h-screen bg-[#021516] text-white selection:bg-[#d4af37] selection:text-black">

      {showIntro ? (
          <div className="relative overflow-x-hidden">
            <MainLayout />

            
          </div>

      ) : (
          <main className="w-full bg-[#021516] min-h-screen selection:bg-[#d4af37] selection:text-black animate-in fade-in duration-1000">
            {showNavbar && (
                <nav className="sticky top-0 z-50 bg-[#051112]/80 backdrop-blur-md border-b border-[#d4af37]/20 px-6 py-4">
                    <div className="container mx-auto flex justify-between items-center">
                        <div className="cursor-pointer" onClick={() => setActiveTab('rules')}>
                            <WizardTitle text="TECHNETICS" className="text-2xl md:text-3xl" />
                        </div>
                        <ul className="flex items-center space-x-4">
                            {['rules', 'about', 'help'].map((tab) => (
                                <li key={tab}>
                                    <button 
                                        onClick={() => setActiveTab(tab as any)} 
                                        className={`px-3 py-1.5 rounded transition-all capitalize text-sm font-medium ${activeTab === tab ? 'text-[#FFD700] bg-[#d4af37]/10 border border-[#d4af37]/30' : 'text-gray-400 hover:text-teal-400'}`}
                                    >
                                        {tab}
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <div className="flex items-center gap-4">
                            {session ? (
                                <button onClick={handleLogout} className="px-4 py-1.5 border border-red-900/40 text-red-500 rounded hover:bg-red-950/20 transition-all text-xs font-bold uppercase">Exit</button>
                            ) : (
                                <button onClick={() => navigate('/login')} className="px-4 py-1.5 bg-[#d4af37] text-black font-wizard rounded shadow-lg">LOGIN</button>
                            )}
                        </div>
                    </div>
                </nav>
            )}

            <section className={showNavbar ? "container mx-auto px-6 py-12" : "w-full"}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="w-full"
                    >
                        {activeTab === 'rules' && (session ? <CompetitionLayout /> : <LockedRules />)}
                        {activeTab === 'about' && <AboutContent />}
                        {activeTab === 'help' && <HelpContent />}
                    </motion.div>
                </AnimatePresence>
            </section>
          </main>
      )}
    </div>
  );
};

export default HomePage;