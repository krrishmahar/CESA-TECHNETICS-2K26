import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    LayoutDashboard, 
    Database, 
    Clock, 
    Trophy, 
    Users, 
    Play, 
    Pause, 
    Square, 
    StopCircle,
    Upload,
    LogOut
} from 'lucide-react';
import { API_BASE_URL } from '../api/auth';
import { useServerTimer } from '../hooks/useServerTimer';

const ROUND_ID_APTITUDE = "1"; // order round
const ROUND_ID_DARKMARK = "4"; // boss round

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'aptitude' | 'darkmark' | 'leaderboard'>('aptitude');
    const [adminData, setAdminData] = useState<any>(null);

    // Aptitude State
    const { timerState: aptTimer, formattedTime: aptTime } = useServerTimer(ROUND_ID_APTITUDE);
    const [questions, setQuestions] = useState<any[]>([]);

    // Dark Mark State
    const { timerState: dmTimer, formattedTime: dmTime } = useServerTimer(ROUND_ID_DARKMARK);
    const [dmTeams, setDmTeams] = useState<any[]>([]);

    // Leaderboard State
    const [aptLeaderboard, setAptLeaderboard] = useState<any[]>([]);
    const [dmLeaderboard, setDmLeaderboard] = useState<any[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem('admin_data');
        if (!stored) {
            navigate('/games');
            return;
        }
        setAdminData(JSON.parse(stored));
    }, [navigate]);

    useEffect(() => {
        if (activeTab === 'aptitude') {
            fetch(`${API_BASE_URL}/questions/round/${ROUND_ID_APTITUDE}`)
                .then(res => res.json())
                .then(data => setQuestions(data || []))
                .catch(console.error);
        } else if (activeTab === 'darkmark') {
            fetch(`${API_BASE_URL}/admin/events/dark-mark-bounty/teams`)
                .then(res => res.json())
                .then(data => setDmTeams(data || []))
                .catch(console.error);
        } else if (activeTab === 'leaderboard') {
            // Initial fetches
            fetch(`${API_BASE_URL}/events/the-order-of-obscure-code/leaderboard/aptitude`)
                .then(res => res.json())
                .then(data => setAptLeaderboard(data || []))
                .catch(console.error);
            fetch(`${API_BASE_URL}/events/dark-mark-bounty/leaderboard/darkmark`)
                .then(res => res.json())
                .then(data => setDmLeaderboard(data || []))
                .catch(console.error);

            // Setup SSE streams for real-time updates
            const aptEventSource = new EventSource(`${API_BASE_URL}/events/the-order-of-obscure-code/leaderboard/aptitude/stream`);
            aptEventSource.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    setAptLeaderboard(data);
                } catch (e) {
                    console.error("Aptitude SSE Parse Error", e);
                }
            };

            const dmEventSource = new EventSource(`${API_BASE_URL}/events/dark-mark-bounty/leaderboard/darkmark/stream`);
            dmEventSource.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    setDmLeaderboard(data);
                } catch (e) {
                    console.error("Dark Mark SSE Parse Error", e);
                }
            };

            return () => {
                aptEventSource.close();
                dmEventSource.close();
            };
        }
    }, [activeTab]);

    const handleTimerAction = async (roundId: string, action: 'start' | 'pause' | 'resume' | 'stop' | 'expire') => {
        try {
            const adminId = adminData?.admin?.id || "1";
            await fetch(`${API_BASE_URL}/timer/round/${roundId}/${action}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ adminId })
            });
            // timer hook will auto-sync on next interval
        } catch (e) {
            console.error(e);
        }
    };

    const handleQualify = async (topN: number) => {
        try {
            await fetch(`${API_BASE_URL}/admin/rounds/${ROUND_ID_APTITUDE}/qualify`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ topN, adminId: adminData?.admin?.id || "1" })
            });
            alert(`Qualified top ${topN} teams`);
        } catch (e) {
            console.error(e);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('admin_data');
        navigate('/games');
    };

    return (
        <div className="min-h-screen bg-[#021516] text-[#d4af37] flex font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-[#051112] border-r border-[#d4af37]/20 p-6 flex flex-col shrink-0">
                <div className="mb-10 text-center">
                    <h1 className="text-3xl font-wizard text-[#FFD700] drop-shadow-[0_0_10px_rgba(212,175,55,0.8)]">TECHNETICS</h1>
                    <p className="text-[10px] uppercase tracking-widest text-[#d4af37]/70 mt-2 font-black">Admin Protocol</p>
                </div>

                <nav className="flex-1 space-y-4">
                    <button 
                        onClick={() => setActiveTab('aptitude')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold tracking-wider text-sm ${activeTab === 'aptitude' ? 'bg-[#d4af37]/20 border border-[#d4af37] text-[#FFD700]' : 'text-gray-400 hover:bg-[#d4af37]/5 hover:text-[#d4af37]'}`}
                    >
                        <Database size={18} /> Obscure Code
                    </button>
                    <button 
                        onClick={() => setActiveTab('darkmark')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold tracking-wider text-sm ${activeTab === 'darkmark' ? 'bg-[#d4af37]/20 border border-[#d4af37] text-[#FFD700]' : 'text-gray-400 hover:bg-[#d4af37]/5 hover:text-[#d4af37]'}`}
                    >
                        <LayoutDashboard size={18} /> Dark Mark
                    </button>
                    <button 
                        onClick={() => setActiveTab('leaderboard')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold tracking-wider text-sm ${activeTab === 'leaderboard' ? 'bg-[#d4af37]/20 border border-[#d4af37] text-[#FFD700]' : 'text-gray-400 hover:bg-[#d4af37]/5 hover:text-[#d4af37]'}`}
                    >
                        <Trophy size={18} /> Leaderboards
                    </button>
                </nav>

                <button 
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-all font-bold tracking-wider text-sm"
                >
                    <LogOut size={18} /> Terminate Session
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                <header className="flex justify-between items-center mb-8 border-b border-[#d4af37]/20 pb-4">
                    <h2 className="text-4xl font-wizard tracking-wider text-white">
                        {activeTab === 'aptitude' && 'The Order of Obscure Code'}
                        {activeTab === 'darkmark' && 'Dark Mark Bounty'}
                        {activeTab === 'leaderboard' && 'Global Leaderboards'}
                    </h2>
                    <div className="flex items-center gap-3 text-sm font-bold bg-[#d4af37]/10 px-4 py-2 rounded-lg border border-[#d4af37]/30">
                        <span className="text-gray-400">Admin:</span>
                        <span className="text-[#FFD700]">{adminData?.admin?.username || 'Root'}</span>
                    </div>
                </header>

                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {activeTab === 'aptitude' && (
                        <div className="space-y-8">
                            {/* Timer Controls */}
                            <div className="bg-[#051112] border border-[#d4af37]/30 p-6 rounded-2xl shadow-[0_0_20px_rgba(212,175,55,0.1)]">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold text-white flex items-center gap-2"><Clock /> Round Timer Control</h3>
                                    <div className="text-3xl font-wizard text-[#FFD700] bg-black/50 px-6 py-2 rounded-xl border border-[#d4af37]/30">{aptTime}</div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className={`px-3 py-1 text-xs font-black uppercase rounded border ${aptTimer?.timerStatus === 'running' ? 'bg-green-900/30 text-green-500 border-green-500' : 'bg-gray-900 border-gray-600 text-gray-400'}`}>
                                        {aptTimer?.timerStatus || 'UNKNOWN'}
                                    </span>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleTimerAction(ROUND_ID_APTITUDE, 'start')} className="p-2 bg-green-900/40 text-green-500 hover:bg-green-900/80 rounded" title="Start"><Play size={20}/></button>
                                        <button onClick={() => handleTimerAction(ROUND_ID_APTITUDE, 'pause')} className="p-2 bg-yellow-900/40 text-yellow-500 hover:bg-yellow-900/80 rounded" title="Pause"><Pause size={20}/></button>
                                        <button onClick={() => handleTimerAction(ROUND_ID_APTITUDE, 'resume')} className="p-2 bg-blue-900/40 text-blue-500 hover:bg-blue-900/80 rounded" title="Resume"><Play size={20}/></button>
                                        <button onClick={() => handleTimerAction(ROUND_ID_APTITUDE, 'stop')} className="p-2 bg-orange-900/40 text-orange-500 hover:bg-orange-900/80 rounded" title="Stop"><Square size={20}/></button>
                                        <button onClick={() => handleTimerAction(ROUND_ID_APTITUDE, 'expire')} className="p-2 bg-red-900/40 text-red-500 hover:bg-red-900/80 rounded" title="Expire"><StopCircle size={20}/></button>
                                    </div>
                                    <div className="ml-auto">
                                        <button onClick={() => handleQualify(10)} className="bg-linear-to-r from-[#8a6e2e] to-[#d4af37] text-black px-4 py-2 rounded-lg font-bold shadow-lg flex items-center gap-2">
                                            <Trophy size={16}/> Qualify Top 10
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Questions */}
                            <div className="bg-[#051112] border border-[#d4af37]/30 p-6 rounded-2xl shadow-[0_0_20px_rgba(212,175,55,0.1)]">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-bold text-white flex items-center gap-2"><Database /> Questions DB</h3>
                                    <button className="flex items-center gap-2 text-sm border border-[#d4af37] text-[#d4af37] px-4 py-1.5 rounded-lg hover:bg-[#d4af37]/10 transition-colors">
                                        <Upload size={16} /> Bulk Upload
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {questions.map((q: any) => (
                                        <div key={q.id} className="p-4 bg-black/40 border border-white/5 rounded-xl text-gray-300 flex justify-between items-start">
                                            <div>
                                                <div className="font-bold text-white mb-2">{q.questionText}</div>
                                                <div className="text-sm space-x-4">
                                                    <span className={q.correctOption === 'A' ? 'text-green-500' : ''}>A: {q.optionA}</span>
                                                    <span className={q.correctOption === 'B' ? 'text-green-500' : ''}>B: {q.optionB}</span>
                                                    <span className={q.correctOption === 'C' ? 'text-green-500' : ''}>C: {q.optionC}</span>
                                                    <span className={q.correctOption === 'D' ? 'text-green-500' : ''}>D: {q.optionD}</span>
                                                </div>
                                            </div>
                                            <span className="text-xs font-bold text-[#d4af37] border border-[#d4af37]/30 px-2 py-1 rounded bg-[#d4af37]/10">{q.points} PTS</span>
                                        </div>
                                    ))}
                                    {questions.length === 0 && <div className="text-center text-gray-500 py-8">No questions loaded</div>}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'darkmark' && (
                        <div className="space-y-8">
                             {/* Timer Controls */}
                             <div className="bg-[#051112] border border-[#d4af37]/30 p-6 rounded-2xl shadow-[0_0_20px_rgba(212,175,55,0.1)]">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold text-white flex items-center gap-2"><Clock /> Boss Round Timer</h3>
                                    <div className="text-3xl font-wizard text-[#FFD700] bg-black/50 px-6 py-2 rounded-xl border border-[#d4af37]/30">{dmTime}</div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className={`px-3 py-1 text-xs font-black uppercase rounded border ${dmTimer?.timerStatus === 'running' ? 'bg-green-900/30 text-green-500 border-green-500' : 'bg-gray-900 border-gray-600 text-gray-400'}`}>
                                        {dmTimer?.timerStatus || 'UNKNOWN'}
                                    </span>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleTimerAction(ROUND_ID_DARKMARK, 'start')} className="p-2 bg-green-900/40 text-green-500 hover:bg-green-900/80 rounded" title="Start"><Play size={20}/></button>
                                        <button onClick={() => handleTimerAction(ROUND_ID_DARKMARK, 'pause')} className="p-2 bg-yellow-900/40 text-yellow-500 hover:bg-yellow-900/80 rounded" title="Pause"><Pause size={20}/></button>
                                        <button onClick={() => handleTimerAction(ROUND_ID_DARKMARK, 'resume')} className="p-2 bg-blue-900/40 text-blue-500 hover:bg-blue-900/80 rounded" title="Resume"><Play size={20}/></button>
                                        <button onClick={() => handleTimerAction(ROUND_ID_DARKMARK, 'stop')} className="p-2 bg-orange-900/40 text-orange-500 hover:bg-orange-900/80 rounded" title="Stop"><Square size={20}/></button>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[#051112] border border-[#d4af37]/30 p-6 rounded-2xl shadow-[0_0_20px_rgba(212,175,55,0.1)]">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-6"><Users /> Team Monitoring</h3>
                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                                    {dmTeams.map((team: any) => (
                                        <div key={team.id} className="bg-black/40 border border-white/10 p-4 rounded-xl">
                                            <div className="font-wizard text-[#FFD700] text-xl mb-1">{team.teamName}</div>
                                            <div className="text-xs text-gray-500 uppercase tracking-widest mb-3">{team.teamCode}</div>
                                            <div className="space-y-1 text-sm text-gray-300">
                                                {team.members?.map((m: any) => (
                                                    <div key={m.id} className="truncate">• {m.fullName}</div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                    {dmTeams.length === 0 && <div className="col-span-full text-center py-8 text-gray-500">No active teams</div>}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'leaderboard' && (
                        <div className="space-y-8">
                            <div className="bg-[#051112] border border-[#d4af37]/30 p-6 rounded-2xl shadow-[0_0_20px_rgba(212,175,55,0.1)]">
                                <h3 className="text-xl font-bold text-white mb-6 font-wizard tracking-wider">Aptitude Leaderboard</h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead>
                                            <tr className="uppercase text-[10px] tracking-widest text-[#d4af37]/70 border-b border-[#d4af37]/20">
                                                <th className="py-3 px-4">Rank</th>
                                                <th className="py-3 px-4">Team</th>
                                                <th className="py-3 px-4">Score</th>
                                                <th className="py-3 px-4">Time</th>
                                                <th className="py-3 px-4">Accuracy</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {aptLeaderboard.map((row: any, i) => (
                                                <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                                                    <td className="py-3 px-4 font-wizard text-[#FFD700]">{row.rank}</td>
                                                    <td className="py-3 px-4 text-white font-bold">{row.teamName}</td>
                                                    <td className="py-3 px-4 text-[#FFD700]">{row.totalScore}</td>
                                                    <td className="py-3 px-4 text-gray-400">{row.completionTimeMins}m</td>
                                                    <td className="py-3 px-4">
                                                        <span className="text-green-500">{row.correctAnswers}</span> / <span className="text-red-500">{row.wrongAnswers}</span>
                                                    </td>
                                                </tr>
                                            ))}
                                            {aptLeaderboard.length === 0 && (
                                                <tr><td colSpan={5} className="py-8 text-center text-gray-500">No leaderboard data available</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="bg-[#051112] border border-[#d4af37]/30 p-6 rounded-2xl shadow-[0_0_20px_rgba(212,175,55,0.1)]">
                                <h3 className="text-xl font-bold text-white mb-6 font-wizard tracking-wider">Dark Mark Leaderboard</h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead>
                                            <tr className="uppercase text-[10px] tracking-widest text-[#d4af37]/70 border-b border-[#d4af37]/20">
                                                <th className="py-3 px-4">Rank</th>
                                                <th className="py-3 px-4">Team</th>
                                                <th className="py-3 px-4">Score</th>
                                                <th className="py-3 px-4">Bounties</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {dmLeaderboard.map((row: any, i) => (
                                                <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                                                    <td className="py-3 px-4 font-wizard text-[#FFD700]">{row.rank}</td>
                                                    <td className="py-3 px-4 text-white font-bold">{row.teamName}</td>
                                                    <td className="py-3 px-4 text-[#FFD700]">{row.totalScore}</td>
                                                    <td className="py-3 px-4 text-gray-400">{row.bountiesSolved}</td>
                                                </tr>
                                            ))}
                                            {dmLeaderboard.length === 0 && (
                                                <tr><td colSpan={4} className="py-8 text-center text-gray-500">No leaderboard data available</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>
            </main>
        </div>
    );
};

export default AdminDashboard;
