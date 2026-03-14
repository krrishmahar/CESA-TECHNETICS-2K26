import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Code2, Users, ShieldCheck, LogOut, Wifi, WifiOff } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useCompetitionStore } from '@/store/competitionStore';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import logo from '@/assets/technetics-head.svg';

export const CompetitionHeader = () => {
  const navigate = useNavigate();
  const { email, userId, currentRound } = useCompetitionStore();
  
  // Local State for Realtime Features
  const [onlineCount, setOnlineCount] = useState(1); // Khud ko mila ke 1
  const [isNetworkOnline, setIsNetworkOnline] = useState(navigator.onLine);

  // 1. NETWORK STATUS MONITORING
  useEffect(() => {
    const handleOnline = () => setIsNetworkOnline(true);
    const handleOffline = () => setIsNetworkOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // 2. SUPABASE PRESENCE (Realtime User Count)
  useEffect(() => {
    if (!userId) return;

    // Create a presence channel
    const channel = supabase.channel('online-users', {
      config: {
        presence: {
          key: userId,
        },
      },
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        const newState = channel.presenceState();
        // Count unique connections
        setOnlineCount(Object.keys(newState).length);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            online_at: new Date().toISOString(),
            user: email,
          });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, email]);

  // 3. LOGOUT HANDLER
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <header className="h-16 border-b border-[#d4af37]/20 bg-[#051112]/90 flex items-center justify-between px-6 z-10 backdrop-blur-md shrink-0 sticky top-0">
      <div className="flex items-center gap-4">
          <div className="shrink-0 cursor-pointer group" onClick={() => navigate('/')}>
              <img src={logo} alt="Technetics" className="h-10 w-auto transition-transform group-hover:scale-110" />
          </div>
          <div className="flex flex-col border-l border-[#d4af37]/20 pl-4 py-1">
              <span className="text-lg text-[#d4af37] font-wizard leading-none">The Order of the Obscure Code</span>
              <span className="text-[9px] text-gray-500 font-black uppercase tracking-[0.2em] mt-1 opacity-70 whitespace-nowrap">
                {currentRound?.replace('_', ' ').toUpperCase() || 'Arena'}
              </span>
          </div>
      </div>

      <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-black/40 rounded-full border border-[#d4af37]/10">
              <Users size={14} className="text-[#15803d]" />
              <span className="text-xs font-bold text-gray-400">{onlineCount} Online</span>
          </div>
          <div className={cn(
              "hidden md:flex items-center gap-2 px-3 py-1 rounded-full border transition-all",
              isNetworkOnline 
                ? "bg-green-900/20 border-green-700/30 text-green-500" 
                : "bg-red-900/20 border-red-700/30 text-red-500 animate-pulse"
          )}>
              {isNetworkOnline ? <Wifi size={14} /> : <WifiOff size={14} />}
              <span className="text-[10px] font-black uppercase tracking-wider">{isNetworkOnline ? 'Connected' : 'Offline'}</span>
          </div>
          <div className="flex items-center gap-3 pl-4 border-l border-[#d4af37]/20">
              <div className="hidden md:flex flex-col text-right">
                  <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest leading-none mb-1">Logged in as</span>
                  <span className="text-xs text-white font-bold leading-none">{email}</span>
              </div>
              <button
                  onClick={handleLogout}
                  className="p-2 hover:bg-red-900/20 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                  title="Exit Arena"
              >
                  <LogOut size={20} />
              </button>
          </div>
      </div>
    </header>
  );
};