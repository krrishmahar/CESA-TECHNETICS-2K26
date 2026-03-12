import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { API_BASE_URL } from "../api/auth";

const WaitingListPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const eventSlug = queryParams.get('event') || "the-order-of-obscure-code";

    const [isAdmin, setIsAdmin] = useState(false);
    const [counts, setCounts] = useState({ total: 0, checkedIn: 0, waiting: 0 });
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const adminData = localStorage.getItem("admin_data");
        const participantDataStr = localStorage.getItem("participant_data");

        if (adminData) setIsAdmin(true);

        // Check in participant
        if (participantDataStr && !adminData) {
            const participantData = JSON.parse(participantDataStr);
            fetch(`${API_BASE_URL}/auth/checkin`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ registrationId: participantData.registrationId })
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
                    // Start event triggered
                    if (data.redirectTo && data.redirectTo.includes("obscure-code")) {
                        navigate("/aptitude-round");
                    } else if (data.redirectTo && data.redirectTo.includes("dark-mark")) {
                        navigate("/dark-mark-bounty");
                    } else {
                        // fallback based on slug
                        navigate(eventSlug.includes("obscure") ? "/aptitude-round" : "/dark-mark-bounty");
                    }
                }
            } catch (err) {
                console.error("SSE parse error", err);
            }
        };

        eventSource.onerror = () => {
             // Fallback to polling or quiet failure
        };

        // Fallback polling for admin counts if SSE doesn't broadcast counts immediately
        let interval: ReturnType<typeof setInterval>;
        if (adminData) {
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
        };
    }, [eventSlug, navigate]);

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

                {isAdmin ? (
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
                            className="flex justify-center mb-12"
                        >
                            <div className="w-20 h-20 relative">
                                <div className="absolute inset-0 border-4 border-[#d4af37]/20 rounded-full"></div>
                                <div className="absolute inset-0 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin"></div>
                                <div className="absolute inset-2 border-4 border-[#FFD700] border-b-transparent rounded-full animate-[spin_1.5s_linear_infinite_reverse]"></div>
                            </div>
                        </motion.div>
                    </>
                )}
            </motion.div>
        </div>
    );
};

export default WaitingListPage;
