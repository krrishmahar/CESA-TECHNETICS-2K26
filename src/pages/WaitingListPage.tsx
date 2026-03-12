import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { API_BASE_URL } from "../api/auth";
import { useGameStore } from "../store/useGameStore";
import { supabase } from "../lib/supabase";
import { RefreshCw, Sparkles } from "lucide-react";


const WaitingListPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const eventSlugFromUrl = queryParams.get('event') || "the-order-of-obscure-code";

    const { user, role, setEventContext } = useGameStore();

    const [eventSlug] = useState(eventSlugFromUrl);

    const [counts, setCounts] = useState({ total: 0, checkedIn: 0, waiting: 0 });
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        // Check in participant
        if (role === 'participant' && user?.registrationId) {
            fetch(`${API_BASE_URL}/auth/checkin`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ registrationId: user.registrationId })
            }).catch(console.error);
        }


        // Setup SSE for redirection (Listen for start events)
        const eventSource = new EventSource(`${API_BASE_URL}/admin/events/${eventSlug}/waiting-room/stream`);
        
        eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                // The stream payload for waiting room counts usually sends counts
                // If it broadcasts a start event it might look different
                if (data.total !== undefined) {
                    setCounts(data);
                }
                
                if (data.broadcasted || data.type === 'START_GAME') {
                    const targetPath = data.redirectTo || (eventSlug.includes("obscure") ? "/aptitude-round" : "/dark-mark-bounty");
                    
                    // Update store session context before navigating
                    setEventContext(eventSlug, data.roundId || null);
                    
                    navigate(targetPath);
                }

            } catch (err) {
                console.error("SSE parse error", err);
            }
        };

        eventSource.onerror = () => {
             // Fallback to polling or quiet failure
        };

        // --- SUPABASE REALTIME INTEGRATION ---
        let registrationSubscription: any = null;
        if (supabase && user?.registrationId) {
            registrationSubscription = supabase
                .channel(`registration_${user.registrationId}`)
                .on(
                    'postgres_changes',
                    {
                        event: 'UPDATE',
                        schema: 'public',
                        table: 'event_registrations',
                        filter: `id=eq.${user.registrationId}`
                    },
                    (payload) => {
                        console.log('Registration update received:', payload);
                        const { currentRound } = payload.new;
                        if (currentRound) {
                            const roundToPath: Record<number, string> = {
                                1: "/aptitude-round",
                                2: "/github-round",
                                3: "/hackathon-selection",
                                4: "/dark-mark-bounty"
                            };
                            const targetPath = roundToPath[currentRound as number];
                            if (targetPath) {
                                setEventContext(eventSlug, String(currentRound));
                                navigate(targetPath);
                            }
                        }
                    }
                )
                .subscribe();
        }

        // Fallback polling for admin counts
        let interval: ReturnType<typeof setInterval>;
        if (role === 'admin') {

            const fetchCounts = async () => {
                try {
                    const res = await fetch(`${API_BASE_URL}/admin/events/${eventSlug}/waiting-room`);
                    if (res.ok) {
                        const data = await res.json();
                        setCounts(data);
                    }
                } catch (e) {
                    console.error(e);
                }
            };
            fetchCounts();
            interval = setInterval(fetchCounts, 5000);
        }

        return () => {
            eventSource.close();
            if (interval) clearInterval(interval);
            if (registrationSubscription) {
                supabase?.removeChannel(registrationSubscription);
            }
        };
    }, [eventSlug, navigate, role, user, setEventContext]);


    const handleStartGame = async () => {
        try {
            const redirectTo = eventSlug.includes("obscure") ? "/aptitude-round" : "/dark-mark-bounty";
            const res = await fetch(`${API_BASE_URL}/admin/events/${eventSlug}/start`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ redirectTo })
            });
            if (!res.ok) throw new Error("Failed to start game");
            navigate(redirectTo);
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleManualRefresh = async () => {
        if (!user?.registrationId) return;
        setIsLoadingStatus(true);
        try {
            // Check current registration status
            const res = await fetch(`${API_BASE_URL}/participants/status/${user.registrationId}`);
            if (res.ok) {
                const data = await res.json();
                if (data.currentRound) {
                    const roundToPath: Record<number, string> = {
                        1: "/aptitude-round",
                        2: "/github-round",
                        3: "/hackathon-selection",
                        4: "/dark-mark-bounty"
                    };
                    const targetPath = roundToPath[data.currentRound];
                    if (targetPath && location.pathname !== targetPath) {
                        setEventContext(eventSlug, String(data.currentRound));
                        navigate(targetPath);
                        return;
                    }
                }
                alert("The Arena state remains unchanged. Please wait for the Ministry's call.");
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoadingStatus(false);
        }
    };

    const [isLoadingStatus, setIsLoadingStatus] = useState(false);

    return (
        <div className="min-h-screen bg-[#021516] flex flex-col items-center justify-center text-[#d4af37] p-4 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 mix-blend-screen pointer-events-none"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-center w-full max-w-3xl bg-[#051112]/90 p-12 lg:p-16 border-2 border-[#d4af37] rounded-xl shadow-[0_0_40px_rgba(212,175,55,0.3)] backdrop-blur-sm z-10"
            >
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="text-6xl md:text-8xl mb-8 drop-shadow-[0_0_15px_rgba(212,175,55,0.8)] font-wizard"
                >
                    Waiting List
                </motion.h1>

                {role === 'admin' ? (

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                    >
                        <h2 className="text-2xl text-white mb-6 uppercase tracking-widest">{eventSlug.replace(/-/g, ' ')}</h2>
                        <div className="grid grid-cols-3 gap-6 mb-12">
                            <div className="p-4 bg-black/40 border border-[#d4af37]/30 rounded-xl">
                                <div className="text-4xl text-white font-wizard mb-2">{counts.total}</div>
                                <div className="text-xs uppercase text-gray-400">Total Teams</div>
                            </div>
                            <div className="p-4 bg-green-900/20 border border-green-500/30 rounded-xl">
                                <div className="text-4xl text-green-500 font-wizard mb-2">{counts.checkedIn}</div>
                                <div className="text-xs uppercase text-green-500/70">Checked In</div>
                            </div>
                            <div className="p-4 bg-[#d4af37]/10 border border-[#d4af37]/30 rounded-xl">
                                <div className="text-4xl text-[#FFD700] font-wizard mb-2">{counts.waiting}</div>
                                <div className="text-xs uppercase text-[#d4af37]/70">Waiting</div>
                            </div>
                        </div>

                        {error && <div className="text-red-500 mb-4 font-bold">{error}</div>}

                        <button
                            onClick={handleStartGame}
                            className="w-full bg-linear-to-r from-[#8a6e2e] to-[#d4af37] text-black font-bold py-4 px-6 rounded-lg hover:from-[#d4af37] hover:to-[#FFD700] transition-colors text-2xl tracking-wide shadow-[0_0_20px_rgba(212,175,55,0.4)] font-wizard"
                        >
                            Start Round
                        </button>
                    </motion.div>
                ) : (
                    <>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1, duration: 1 }}
                            className="text-xl md:text-2xl text-gray-300 font-sans mb-12 leading-relaxed"
                        >
                            The Sorting Hat is considering your application.
                            <br />
                            Please wait for the admin to start the next round...
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.6, duration: 0.8 }}
                            className="flex flex-col items-center gap-8 mb-12"
                        >
                            <div className="w-20 h-20 relative">
                                <div className="absolute inset-0 border-4 border-[#d4af37]/20 rounded-full"></div>
                                <div className="absolute inset-0 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin"></div>
                                <div className="absolute inset-2 border-4 border-[#FFD700] border-b-transparent rounded-full animate-[spin_1.5s_linear_infinite_reverse]"></div>
                            </div>

                            <button
                                onClick={handleManualRefresh}
                                disabled={isLoadingStatus}
                                className="group relative px-8 py-3 bg-[#d4af37]/10 border border-[#d4af37]/40 rounded-full text-[#FFD700] font-wizard tracking-widest hover:bg-[#d4af37]/20 transition-all flex items-center gap-3 active:scale-95 disabled:opacity-50"
                            >
                                <Sparkles size={18} className={isLoadingStatus ? "animate-pulse" : "group-hover:rotate-12 transition-transform"} />
                                <span>{isLoadingStatus ? "Gazing into Crystal Ball..." : "Magic Refresh"}</span>
                                <RefreshCw size={14} className={isLoadingStatus ? "animate-spin" : "opacity-50"} />
                                <div className="absolute inset-0 bg-[#d4af37]/5 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                        </motion.div>
                    </>
                )}
            </motion.div>
        </div>
    );
};

export default WaitingListPage;
