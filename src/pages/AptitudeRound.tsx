import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
    Clock,
    ChevronLeft,
    ChevronRight,
    Flag,
    Wifi,
    Activity,
    Brain,
    Code,
    CheckCircle2,
    Lock,
    LogOut,
    AlertTriangle,
    MonitorCheck,
    RefreshCw,
    Github
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/technetics-head.svg';
import { API_BASE_URL } from '../api/auth';
import { useServerTimer } from '../hooks/useServerTimer';
import { useAntiCheat } from '../hooks/useAntiCheat';


interface Question {
    id: string;
    questionText: string;
    optionA: string;
    optionB: string;
    optionC: string;
    optionD: string;
    title?: string; // added to match old UI if missing from API
}

const ROUND_ID = "1"; // Hardcoded for Order of Obscure Code Round 1

const AptitudeRound = () => {
    const navigate = useNavigate();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(true);

    const { timerState, timeLeft, formattedTime } = useServerTimer(ROUND_ID);
    useAntiCheat(ROUND_ID);


    // --- STRANGER TECH LOGIC: ANTI-CHEAT STATE ---
    const [switchesLeft, setSwitchesLeft] = useState(() => {
        const saved = localStorage.getItem('aptitude_switches');
        return saved ? parseInt(saved) : 3;
    });
    const [isFlagged, setIsFlagged] = useState<Record<string, boolean>>(() => {
        const saved = localStorage.getItem('aptitude_flagged');
        return saved ? JSON.parse(saved) : {};
    });
    const [isFrozen, setIsFrozen] = useState(() => {
        return localStorage.getItem('aptitude_frozen') === 'true';
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Provide user auth info
    const participantDataStr = localStorage.getItem('participant_data');
    const participant = participantDataStr ? JSON.parse(participantDataStr) : null;
    const registrationId = participant?.registrationId;

    useEffect(() => {
        localStorage.setItem('aptitude_flagged', JSON.stringify(isFlagged));
    }, [isFlagged]);

    useEffect(() => {
        localStorage.setItem('aptitude_switches', switchesLeft.toString());
    }, [switchesLeft]);

    useEffect(() => {
        localStorage.setItem('aptitude_frozen', isFrozen.toString());
    }, [isFrozen]);

    // Data Fetching
    useEffect(() => {
        if (!registrationId) {
            navigate('/games');
            return;
        }

        const fetchQuestionsAndAnswers = async () => {
            try {
                // Fetch Questions
                const qRes = await fetch(`${API_BASE_URL}/questions/round/${ROUND_ID}/play?registrationId=${registrationId}`);
                if (qRes.ok) {
                    const data = await qRes.json();
                    setQuestions(data);
                }

                // Fetch Saved Answers
                const aRes = await fetch(`${API_BASE_URL}/answers/round/${ROUND_ID}?registrationId=${registrationId}`);
                if (aRes.ok) {
                    const ansData = await aRes.json();
                    const newAnswers: Record<string, string> = {};
                    ansData.forEach((ans: any) => {
                        newAnswers[ans.questionId] = ans.selectedOption;
                    });
                    setAnswers(newAnswers);
                }
            } catch (err) {
                console.error("Failed to fetch match sync", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchQuestionsAndAnswers();
    }, [registrationId, navigate]);

    // TIMER EXPIRATION EFFECT
    useEffect(() => {
        if (timerState?.timerStatus === 'expired' || timerState?.timerStatus === 'stopped') {
            if (timerState.remainingSeconds <= 0) {
                 // Auto-submit happens here or backend handles it, redirect immediately
                 navigate('/waiting-list?event=dark-mark-bounty');
            }
        }
    }, [timerState, navigate]);

    // --- SUBMISSION LOGIC ---
    const handleSubmit = useCallback(async () => {
        if (isSubmitting || !registrationId) return;
        setIsSubmitting(true);

        try {
            const res = await fetch(`${API_BASE_URL}/answers/round/${ROUND_ID}/submit`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ registrationId })
            });
            if (res.ok) {
                localStorage.removeItem('aptitude_flagged');
                localStorage.removeItem('aptitude_switches');
                navigate('/waiting-list?event=dark-mark-bounty');
            } else {
                 throw new Error("Submit failed");
            }
        } catch (e) {
            console.error(e);
            alert("Submission error, check connection!");
        } finally {
            setIsSubmitting(false);
        }
    }, [isSubmitting, registrationId, navigate]);



    const handleOptionSelect = async (optionValue: string, questionId: string) => {
        if (timerState?.timerStatus !== 'running') {
            alert("Timer is not running! Cannot submit answers.");
            return;
        }

        const previousVal = answers[questionId];
        setAnswers(prev => ({ ...prev, [questionId]: optionValue }));

        // Remote Sync
        try {
            const res = await fetch(`${API_BASE_URL}/answers/round/${ROUND_ID}/question/${questionId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ selectedOption: optionValue, registrationId })
            });
            if (!res.ok) throw new Error("Sync Failed");
        } catch (e) {
            console.error(e);
            // Revert on failure
            if (previousVal) {
                setAnswers(prev => ({ ...prev, [questionId]: previousVal }));
            } else {
                const newAns = { ...answers };
                delete newAns[questionId];
                setAnswers(newAns);
            }
        }
    };

    const toggleFlag = () => {
           if(questions.length > 0) {
               const qid = questions[currentQuestion].id;
               setIsFlagged(prev => ({ ...prev, [qid]: !prev[qid] }));
           }
    };

    const answeredCount = Object.keys(answers).length;
    const progressPercent = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;

    // --- RENDER FROZEN STATE ---
    if (isFrozen) {
        return (
            <div className="h-screen w-full bg-[#050b0b] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full bg-[#0a1515] border-2 border-[#d4af37]/30 rounded-3xl p-10 text-center shadow-[0_0_50px_rgba(212,175,55,0.1)] relative overflow-hidden"
                >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-linear-to-r from-transparent via-[#d4af37]/50 to-transparent" />
                    <div className="mb-8 relative inline-block">
                        <div className="absolute inset-0 bg-[#d4af37]/20 blur-2xl rounded-full" />
                        <div className="w-20 h-20 rounded-2xl bg-[#d4af37]/10 border-2 border-[#d4af37]/40 flex items-center justify-center relative z-10">
                            <Lock size={40} className="text-[#d4af37]" />
                        </div>
                    </div>
                    <h1 className="text-5xl font-wizard text-white mb-4 tracking-wider">Competition Frozen</h1>
                    <div className="bg-[#d4af37]/5 border border-[#d4af37]/20 rounded-xl p-4 mb-8 flex items-center gap-3 justify-center text-[#d4af37]">
                        <AlertTriangle size={20} />
                        <span className="text-sm font-bold uppercase tracking-widest">Suspicious Activity Detected</span>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed mb-10">
                        We detected multiple tab switches or unauthorized browser activity. Your exam has been <span className="text-white font-bold">temporarily locked</span> for security reasons.
                    </p>
                    <button
                        onClick={() => {
                            localStorage.setItem('aptitude_frozen', 'false');
                            localStorage.setItem('aptitude_switches', '3');
                            setIsFrozen(false);
                            setSwitchesLeft(3);
                        }}
                        className="w-full py-4 rounded-xl bg-linear-to-r from-[#8a6e2e] to-[#d4af37] text-black font-wizard font-bold text-lg hover:from-[#d4af37] hover:to-[#FFD700] transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(212,175,55,0.3)] group"
                    >
                        <RefreshCw size={20} className="group-hover:rotate-180 transition-transform duration-500" />
                        <span>Refresh Status</span>
                    </button>

                </motion.div>
            </div>
        );
    }

    if (isLoading) {
         return <div className="min-h-screen bg-[#021516] flex items-center justify-center text-[#d4af37] font-wizard text-4xl">Summoning Questions...</div>;
    }

    const currentQData = questions[currentQuestion];

    return (
        <div className="h-screen bg-[#050b0b] text-white flex flex-col font-sans overflow-hidden">
            {/* Header */}
            <header className="h-16 border-b border-[#d4af37]/20 bg-[#051112]/90 flex items-center justify-between px-6 z-10 backdrop-blur-md shrink-0">
                <div className="flex items-center gap-4">
                    <div className="shrink-0 cursor-pointer group" onClick={() => navigate('/games')}>
                        <img src={logo} alt="Technetics" className="h-10 w-auto transition-transform group-hover:scale-110" />
                    </div>
                    <div className="flex flex-col border-l border-[#d4af37]/20 pl-4 py-1">
                        <span className="text-xl text-[#d4af37] font-wizard leading-none">The Order of the Obscure Code</span>
                        <span className="text-[9px] text-gray-500 font-black uppercase tracking-[0.2em] mt-1 opacity-70">Aptitude Round</span>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-green-900/20 rounded-full border border-green-700/30">
                        <Wifi size={14} className="text-green-500" />
                        <span className="text-[10px] font-black uppercase text-green-500 tracking-wider">Connected</span>
                    </div>
                    <div className="flex items-center gap-3 pl-4 border-l border-[#d4af37]/20">
                        <div className="text-right flex flex-col">
                            <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest leading-none mb-1">Logged in as</span>
                            <span className="text-sm text-white font-bold leading-none">{participant?.email || "Unknown"}</span>
                        </div>
                        <button
                            onClick={() => navigate('/games')}
                            className="p-2 hover:bg-red-900/20 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                            title="Exit Arena"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Sidebar: Progress */}
                <aside className="w-64 border-r border-[#d4af37]/10 bg-[#051112]/40 p-6 hidden lg:block">
                    <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[#d4af37]/50 mb-8">Round Progress</h2>
                    <div className="space-y-10 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-px before:bg-[#d4af37]/10">
                        {/* Rules */}
                        <div className="relative flex gap-4">
                            <div className="z-10 w-10 h-10 rounded-full bg-green-900/30 border border-green-500/50 flex items-center justify-center text-green-500 shrink-0">
                                <CheckCircle2 size={20} />
                            </div>
                            <div>
                                <h3 className="text-xs font-black text-green-500 uppercase tracking-wider mb-1">Competition Rules</h3>
                                <p className="text-[10px] text-gray-500">Completed</p>
                            </div>
                        </div>

                        {/* Aptitude Round (Active) */}
                        <div className="relative flex gap-4">
                            <div className="z-10 w-10 h-10 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/60 flex items-center justify-center text-[#FFD700] shadow-[0_0_15px_rgba(212,175,55,0.3)] shrink-0">
                                <Brain size={20} />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-xs font-black text-[#FFD700] uppercase tracking-wider">Logic Flow</h3>
                                    <span className="text-[8px] px-1.5 py-0.5 bg-[#d4af37]/20 text-[#FFD700] rounded font-bold uppercase tracking-tighter">Active</span>
                                </div>
                                <p className="text-[10px] text-gray-400">{questions.length} Magic Riddles</p>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Center: Question Area */}
                <main className="flex-1 p-4 md:p-8 flex flex-col items-center justify-center overflow-hidden">
                    {questions.length === 0 ? (
                        <div className="text-2xl text-gray-400 font-wizard">No active questions available. Check back soon.</div>
                    ) : (
                    <div className="w-full max-w-4xl h-full flex flex-col">
                        <div className="flex justify-between items-center mb-4 shrink-0">
                            <span className="px-4 py-1.5 bg-[#d4af37]/10 text-[#FFD700] text-sm font-black rounded-full border border-[#d4af37]/20">
                                Q {currentQuestion + 1} / {questions.length}
                            </span>
                            <button
                                onClick={toggleFlag}
                                className={`flex items-center gap-2 px-4 py-1.5 rounded-full border transition-all ${isFlagged[currentQData.id]
                                    ? 'bg-red-900/20 border-red-500/50 text-red-500'
                                    : 'bg-transparent border-[#d4af37]/20 text-gray-500 hover:text-[#d4af37]'
                                    }`}
                            >
                                <Flag size={14} fill={isFlagged[currentQData.id] ? "currentColor" : "none"} />
                                <span className="text-xs font-bold uppercase tracking-widest">{isFlagged[currentQData.id] ? 'Flagged' : 'Flag'}</span>
                            </button>
                        </div>

                        <motion.div
                            key={currentQuestion}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex-1 bg-[#051112] border border-[#d4af37]/20 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden flex flex-col min-h-0"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4af37]/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />

                            <h2 className="text-xl md:text-2xl font-harry tracking-widest text-[#FFD700] mb-3 uppercase shrink-0">
                                {currentQData.title || `Mystery Enigma #${currentQuestion + 1}`}
                            </h2>

                            <div className="flex-1 overflow-hidden pr-2">
                                <div className="text-gray-300 font-sans leading-relaxed mb-4 whitespace-pre-wrap text-base">
                                    {currentQData.questionText}
                                </div>

                                <div className="space-y-2">
                                    {[
                                        { val: 'A', text: currentQData.optionA },
                                        { val: 'B', text: currentQData.optionB },
                                        { val: 'C', text: currentQData.optionC },
                                        { val: 'D', text: currentQData.optionD }
                                    ].map((opt, idx) => (
                                        <button
                                            key={opt.val}
                                            onClick={() => handleOptionSelect(opt.val, currentQData.id)}
                                            className={`w-full text-left p-3 rounded-xl border transition-all duration-300 flex items-center gap-3 group ${answers[currentQData.id] === opt.val
                                                ? 'bg-[#d4af37]/10 border-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                                                : 'bg-black/20 border-white/5 hover:border-[#d4af37]/40 hover:bg-white/5'
                                                }`}
                                        >
                                            <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center font-bold text-xs shrink-0 transition-all ${answers[currentQData.id] === opt.val
                                                ? 'bg-[#d4af37] border-[#d4af37] text-black'
                                                : 'border-[#d4af37]/30 text-[#d4af37]/50 group-hover:border-[#d4af37]'
                                                }`}>
                                                {opt.val}
                                            </div>
                                            <span className={`text-base transition-colors ${answers[currentQData.id] === opt.val ? 'text-white font-bold' : 'text-gray-400 group-hover:text-gray-200'}`}>
                                                {opt.text}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        <div className="flex justify-between items-center py-4 shrink-0">
                            <button
                                disabled={currentQuestion === 0}
                                onClick={() => setCurrentQuestion(prev => prev - 1)}
                                className="flex items-center gap-2 px-5 py-1.5 rounded-xl border-2 border-[#d4af37]/30 text-[#d4af37] font-wizard hover:bg-[#d4af37]/10 hover:border-[#d4af37]/60 disabled:opacity-20 disabled:pointer-events-none transition-all shadow-[0_0_10px_rgba(212,175,55,0.05)]"
                            >
                                <ChevronLeft size={20} />
                                <span className="text-xl">Previous</span>
                            </button>

                            <div className="md:hidden text-center text-xs font-black uppercase text-[#d4af37]/50 font-wizard tracking-tighter">
                                {currentQuestion + 1} / {questions.length}
                            </div>

                            {currentQuestion === questions.length - 1 ? (
                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="flex items-center gap-3 px-8 py-1.5 rounded-xl bg-linear-to-r from-[#8a6e2e] to-[#d4af37] text-black font-wizard hover:from-[#d4af37] hover:to-[#FFD700] shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all text-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span className="mt-1">{isSubmitting ? 'Submitting...' : 'Finish Round'}</span>
                                    {isSubmitting ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-black/20 border-t-black" /> : <CheckCircle2 size={18} />}
                                </button>
                            ) : (
                                <button
                                    onClick={() => setCurrentQuestion(prev => prev + 1)}
                                    className="flex items-center gap-3 px-8 py-1.5 rounded-xl bg-linear-to-r from-[#8a6e2e] to-[#d4af37] text-black font-wizard hover:from-[#d4af37] hover:to-[#FFD700] shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all text-xl"
                                >
                                    <span className="mt-1 px-2">Next</span>
                                    <ChevronRight size={18} />
                                </button>
                            )}
                        </div>
                    </div>
                    )}
                </main>

                {/* Right Sidebar: Status & Nav */}
                <aside className="w-80 border-l border-[#d4af37]/10 bg-[#051112]/40 p-5 hidden xl:block overflow-y-auto">
                    {/* Timer Section */}
                    <div className="mb-6 bg-black/40 rounded-xl p-4 border border-[#d4af37]/10 flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none mb-1">Time Remaining</span>
                            <span className={`text-xl font-black ${timeLeft < 300 ? 'text-red-500 animate-pulse' : 'text-[#FFD700]'}`}>
                                {formattedTime}
                            </span>
                        </div>
                        <div className="p-2.5 bg-[#d4af37]/10 rounded-lg text-[#d4af37]">
                            <Clock size={20} />
                        </div>
                    </div>

                    <div className="space-y-5">
                        <div className="flex flex-col gap-3">
                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-500">
                                <span>Current Phase</span>
                                <span className="text-[#FFD700]">MCQ ROUND</span>
                            </div>
                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-500">
                                <span>Status</span>
                                <span className="text-[#FFD700]">{timerState?.timerStatus || 'Unknown'}</span>
                            </div>
                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-500">
                                <span>Tab Switches</span>
                                <span className={`${switchesLeft === 0 ? 'text-red-500' : 'text-green-500'}`}>0{3 - switchesLeft} / 03</span>
                            </div>
                        </div>

                        <hr className="border-[#d4af37]/10" />

                        <div>
                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
                                <span>Submission Progress</span>
                                <span className="text-[#d4af37]">{answeredCount}/{questions.length}</span>
                            </div>
                            <div className="h-1 w-full bg-black/40 rounded-full overflow-hidden border border-[#d4af37]/5">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progressPercent}%` }}
                                    className="h-full bg-linear-to-r from-[#8a6e2e] to-[#d4af37] shadow-[0_0_10px_rgba(212,175,55,0.5)]"

                                />
                            </div>
                        </div>

                        <div className="pt-2">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3">Question Navigator</h3>
                            <div className="grid grid-cols-4 gap-2">
                                {questions.map((q, idx) => (
                                    <button
                                        key={q.id}
                                        onClick={() => setCurrentQuestion(idx)}
                                        className={`aspect-square rounded-lg flex items-center justify-center text-xs font-black transition-all border ${currentQuestion === idx
                                            ? 'bg-[#d4af37] text-black border-[#d4af37] shadow-[0_0_10px_rgba(212,175,55,0.4)]'
                                            : answers[q.id] !== undefined
                                                ? 'bg-green-900/40 text-green-500 border-green-500/50'
                                                : isFlagged[q.id]
                                                    ? 'bg-red-900/40 text-red-500 border-red-500/50 underline'
                                                    : 'bg-black/40 text-gray-500 border-[#d4af37]/10 hover:border-[#d4af37]/40'
                                            }`}
                                    >
                                        {idx + 1}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="pt-2">
                            <div className="p-3 bg-red-900/20 rounded-xl border border-red-500/30 flex items-start gap-2.5">
                                <AlertTriangle size={16} className="text-red-500 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-[9px] font-black text-red-500 uppercase tracking-widest mb-0.5">Attention!</p>
                                    <p className="text-[9px] text-gray-400 leading-tight">Switching tabs or minimizing the browser will lead to violation.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default AptitudeRound;
