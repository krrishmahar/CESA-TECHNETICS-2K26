import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { 
    Shield, AlertTriangle, Loader2, 
    ListChecks, Workflow, Code, ChevronDown,
    CheckCircle2
} from 'lucide-react';
import { useCompetitionStore } from '@/store/competitionStore';
import { supabase } from '@/lib/supabaseClient';
import { WaitingArea } from './WaitingArea';
import { cn } from '@/lib/utils';

// --- UTILITY: Highlight Important Words ---
const formatRuleText = (text: string) => {
    const dangerWords = ["immediate disqualification", "strictly prohibited", "instant elimination", "elimination", "disqualification"];
    const warningWords = ["No negative marking", "FCFS", "First Come, First Served", "Mandatory", "accuracy", "correctness", "plagiarism", "0 mark"];
    
    const parts = text.split(new RegExp(`(${dangerWords.concat(warningWords).join('|')})`, 'gi'));
    
    return (
        <span>
            {parts.map((part, i) => {
                if (dangerWords.some(w => w.toLowerCase() === part.toLowerCase())) {
                    return <span key={i} className="text-red-400 font-bold">{part}</span>;
                }
                if (warningWords.some(w => w.toLowerCase() === part.toLowerCase())) {
                    return <span key={i} className="text-yellow-500 font-semibold">{part}</span>;
                }
                return part;
            })}
        </span>
    );
};

export const RulesPage = () => {
    const [accepted, setAccepted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [verifying, setVerifying] = useState(true);
    const [groupedRules, setGroupedRules] = useState<any>({ mcq: [], flowchart: [], coding: [] });
    
    const { acceptRules, currentRound, userId, syncSession } = useCompetitionStore();

    // 1. SAFETY CHECK
    useEffect(() => {
        let isMounted = true;
        const checkRealStatus = async () => {
            if (!userId) {
                if (isMounted) setVerifying(false);
                return;
            }
            try {
                const { data, error } = await supabase
                    .from('exam_sessions')
                    .select('*')
                    .eq('user_id', userId)
                    .single();

                if (error) throw error;

                if (data && isMounted) {
                    if (data.current_round_slug !== 'rules') {
                        syncSession(data);
                        return;
                    }
                }
            } catch (err) {
                console.error("Check Failed:", err);
            } finally {
                if (isMounted) setVerifying(false);
            }
        };

        checkRealStatus();
        const safetyTimer = setTimeout(() => { if (isMounted && verifying) setVerifying(false); }, 5000);
        return () => { isMounted = false; clearTimeout(safetyTimer); };
    }, [userId, syncSession]);

    // 2. FETCH RULES
    useEffect(() => {
        const fetchRules = async () => {
            const { data } = await supabase
                .from('round_rules')
                .select('*')
                .order('order_index', { ascending: true });

            if (data && data.length > 0) {
                setGroupedRules({
                    mcq: data.filter(r => r.round_slug === 'mcq'),
                    flowchart: data.filter(r => r.round_slug === 'flowchart'),
                    coding: data.filter(r => r.round_slug === 'coding'),
                });
            } else {
                // FALLBACK
                setGroupedRules({
                    mcq: [
                        { rule_text: "The round consists of 10 MCQs which must be solved within the given time." },
                        { rule_text: "Tab switching will result in immediate disqualification." }
                    ],
                    flowchart: [{ rule_text: "Participants must draw a flowchart for the given problem." }],
                    coding: [{ rule_text: "Participants will be given two (2) coding problems to solve." }]
                });
            }
        };
        fetchRules();
    }, []);

    const handleAccept = async () => {
        setLoading(true);
        try {
            const elem = document.documentElement;
            if (elem.requestFullscreen) await elem.requestFullscreen();
            else if ((elem as any).webkitRequestFullscreen) await (elem as any).webkitRequestFullscreen();
        } catch (err) { console.log("Fullscreen denied"); }

        await acceptRules();
        setLoading(false);
    };

    if (currentRound === 'waiting') return <WaitingArea />;
    if (verifying) return <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-teal-600 w-10 h-10" /></div>;

    return (
        <div className="min-h-screen bg-[#1a1410] bg-[radial-gradient(circle,_#2c241e_0%,_#1a1410_100%)] flex items-center justify-center p-4 overflow-x-hidden pt-10 pb-20 relative z-10">
            <div className="relative w-full max-w-3xl flex flex-col items-center">

                {/* SCROLL TOP */}
                <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="scroll-top relative z-50 shadow-xl"
                />

                {/* SCROLL BODY */}
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="scroll-content flex flex-col items-center custom-scrollbar"
                >
                    {/* Main Title */}
                    <div className="text-center mb-10 w-full">
                        <h1 className="font-wizard text-3xl md:text-[46px] font-bold tracking-widest border-b-2 border-[#2c1e14]/30 pb-4 mb-4 text-[#1a0f08]">
                            PROTOCOL DECREE
                        </h1>
                        <p className="font-parchment italic text-lg opacity-80 text-[#3d2618]">
                            "Heed the laws of the digital realm, for here knowledge is the only wand."
                        </p>
                    </div>

                    {/* Rules Sections */}
                    <div className="w-full space-y-12">
                        <section className="space-y-4">
                            <div className="flex items-center gap-3 border-b border-[#2c1e14]/20 pb-2">
                                <ListChecks className="w-6 h-6 text-[#8a6e2e]" />
                                <h2 className="font-wizard text-lg md:text-[22px] font-bold text-[#1a0f08]">
                                    Round 1: Arithmancy (MCQ)
                                </h2>
                            </div>
                            <ul className="space-y-3 font-parchment text-base md:text-xl text-[#3d2618] pl-4">
                                {groupedRules.mcq.map((rule: any, i: number) => (
                                    <li key={i} className="flex gap-2">
                                        <span className="text-[#8a6e2e] font-bold">•</span>
                                        <span>{rule.rule_text}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <section className="space-y-4">
                            <div className="flex items-center gap-3 border-b border-[#2c1e14]/20 pb-2">
                                <Workflow className="w-6 h-6 text-teal-800" />
                                <h2 className="font-wizard text-lg md:text-[22px] font-bold text-[#1a0f08]">
                                    Round 2: Ancient Runes (Sync)
                                </h2>
                            </div>
                            <ul className="space-y-3 font-parchment text-base md:text-xl text-[#3d2618] pl-4">
                                {groupedRules.flowchart.map((rule: any, i: number) => (
                                    <li key={i} className="flex gap-2">
                                        <span className="text-teal-800 font-bold">•</span>
                                        <span>{rule.rule_text}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <section className="space-y-4">
                            <div className="flex items-center gap-3 border-b border-[#2c1e14]/20 pb-2">
                                <Code className="w-6 h-6 text-[#a855f7]" />
                                <h2 className="font-wizard text-lg md:text-[22px] font-bold text-[#1a0f08]">
                                    Round 3: Dark Code Defense (Quest)
                                </h2>
                            </div>
                            <ul className="space-y-3 font-parchment text-base md:text-xl text-[#3d2618] pl-4">
                                {groupedRules.coding.map((rule: any, i: number) => (
                                    <li key={i} className="flex gap-2">
                                        <span className="text-[#a855f7] font-bold">•</span>
                                        <span>{rule.rule_text}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    </div>

                    {/* Proctoring Alert */}
                    <div className="mt-12 p-6 bg-[#d4af37]/10 border border-[#d4af37]/20 rounded-lg flex gap-4 items-start shadow-sm w-full">
                        <AlertTriangle className="text-[#8a6e2e] w-8 h-8 shrink-0 animate-pulse mt-1" />
                        <div className="font-parchment text-[#1a0f08]">
                            <h4 className="font-wizard font-bold text-[#8a6e2e] mb-1 leading-tight">STRICT PROCTORING ENABLED</h4>
                            <p className="text-lg leading-relaxed">
                                Full-screen status and tab activity are strictly monitored.
                                <strong className="block mt-2 font-bold">Any violation leads to immediate magical suspension from the tournament.</strong>
                            </p>
                        </div>
                    </div>

                    {/* Acceptance and Action Area */}
                    <div className="mt-16 w-full pt-8 border-t-2 border-[#2c1e14]/30 flex flex-col items-center gap-8">
                        <div
                            className="flex items-center gap-4 cursor-pointer select-none group"
                            onClick={() => setAccepted(!accepted)}
                        >
                            <div className={`w-6 h-6 border-2 border-[#2c1e14] rounded transition-all duration-300 flex items-center justify-center
                ${accepted ? 'bg-[#2c1e14]' : 'bg-transparent'}`}>
                                {accepted && <CheckCircle2 className="w-4 h-4 text-[#e8d0a0]" />}
                            </div>
                            <span className="font-wizard font-bold text-xl text-[#1a0f08] group-hover:underline">
                                I ACKNOWLEDGE THE SACRED RULES
                            </span>
                        </div>

                        <button
                            onClick={handleAccept}
                            disabled={!accepted || loading}
                            className={`px-12 py-4 font-wizard text-2xl font-bold rounded shadow-lg border-2 border-[#2c1e14] w-full md:w-auto transition-all duration-500
                ${accepted && !loading
                                     ? 'bg-gradient-to-r from-[#8a6e2e] to-[#d4af37] text-white hover:scale-105 hover:shadow-2xl cursor-pointer'
                                     : 'bg-transparent text-[#2c1e14]/40 border-[#2c1e14]/20 cursor-not-allowed opacity-50'
                                 }`}
                        >
                            {loading ? "INITIALIZING ARENA..." : "PROCEED TO ARENA"}
                        </button>
                    </div>

                    <div className="h-20 w-full" />
                </motion.div>

                {/* SCROLL BOTTOM */}
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="scroll-bottom relative z-50 shadow-xl -mt-1"
                />

            </div>
        </div>
    );
}