import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Flag, CheckCircle2, AlertTriangle, Loader2, Clock, MonitorCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCompetitionStore } from '@/store/competitionStore';
import { CompetitionTimer } from './CompetitionTimer';
import { RoundTransition } from './RoundTransition';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabaseClient';

interface Question {
  id: string;
  title: string;
  description: string;
  options: string[];
  correct_answer: string;
  points?: number;
  multiCorrect?: boolean;
}

export const MCQRound = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number[]>>({});
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [roundDuration, setRoundDuration] = useState(20 * 60); // Default 20 mins

  // Store hooks
  const {
    completeRound,
    incrementTabSwitch,
    startMCQ,
    mcqStartTime,
    userId,
    email
  } = useCompetitionStore();

  const currentQuestion = questions[currentIndex];

  // 0. Fetch Questions (Randomized & Persisted) & Timer Config
  useEffect(() => {
    const initRound = async () => {
      // 1. Fetch Timer Config
      try {
        const { data: config } = await supabase
          .from('game_config')
          .select('value')
          .eq('key', 'mcq_duration')
          .single();
        
        if (config?.value) {
          setRoundDuration(parseInt(config.value) * 60);
        }
      } catch (e) {
        console.warn("Could not load timer config, using default.");
      }

      // 2. Fetch User & Questions
      const { data: { user } } = await supabase.auth.getUser();
      const currentUserId = user?.id || userId;

      if (!currentUserId) return;

      try {
        setLoadingQuestions(true);

        // A. Check for existing assigned questions in DB
        const { data: existingSub } = await supabase
          .from('mcq_submissions')
          .select('question_set, answers') 
          .eq('user_id', currentUserId)
          .maybeSingle();

        let assignedIds: string[] = [];

        if (existingSub && existingSub.question_set && existingSub.question_set.length > 0) {
          // Case 1: Returning User -> Load previously assigned questions
          console.log("Restoring assigned MCQ set...");
          assignedIds = existingSub.question_set;
          
          // Restore previous answers if they exist
          if (existingSub.answers) {
             setAnswers(existingSub.answers);
          }

        } else {
          // Case 2: New User -> Generate Random Set of 10
          console.log("Generating new MCQ set...");
          
          // Fetch ALL MCQ IDs available in the system
          const { data: allQuestions } = await supabase
            .from('questions')
            .select('id')
            .eq('round_id', 'mcq');

          if (!allQuestions || allQuestions.length === 0) {
            toast.error('No MCQ questions found in database.');
            setLoadingQuestions(false);
            return;
          }

          // Shuffle and Pick 10
          const shuffled = allQuestions.sort(() => 0.5 - Math.random());
          const selected = shuffled.slice(0, 10);
          assignedIds = selected.map(q => q.id);

          // SAVE THIS SET TO DB IMMEDIATELY (Persistence)
          await supabase.from('mcq_submissions').upsert({
            user_id: currentUserId,
            question_set: assignedIds, // This locks these 10 questions for this user
            score: 0, 
            updated_at: new Date().toISOString()
          }, { onConflict: 'user_id' });
        }

        // B. Fetch Full Question Details for the assigned IDs
        if (assignedIds.length > 0) {
          const { data: fullQuestions, error } = await supabase
            .from('questions')
            .select('*')
            .in('id', assignedIds);

          if (error) throw error;

          if (fullQuestions) {
            // Parse options if they are stored as JSON strings
            const parsedData = fullQuestions.map((q: any) => {
              let parsedOptions = q.options;
              if (typeof q.options === 'string') {
                try { parsedOptions = JSON.parse(q.options); } catch (e) { parsedOptions = []; }
              }
              return { ...q, options: parsedOptions };
            });
            
            // Optional: Sort questions to ensure consistent order (e.g. by ID or shuffled order)
            // Here we map them back to the order of assignedIds to maintain the shuffled order
            const orderedQuestions = assignedIds
                .map(id => parsedData.find(q => q.id === id))
                .filter(q => q !== undefined) as Question[];

            setQuestions(orderedQuestions);
          }
        }

      } catch (err) {
        console.error('Failed to fetch questions:', err);
        toast.error('Failed to load questions. Please refresh.');
      } finally {
        setLoadingQuestions(false);
      }
    };

    initRound();
  }, [userId]);

  // 1. Start timer on mount (if not already started)
  useEffect(() => {
    if (!mcqStartTime) {
      startMCQ();
    }
  }, [mcqStartTime, startMCQ]);

  // 2. Anti-Cheat: Tab Switch Detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        incrementTabSwitch();
        toast.warning('Tab switch detected! This has been logged.', {
          icon: <AlertTriangle className="w-4 h-4 text-orange-500" />,
          duration: 4000
        });
      }
    };

    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      toast.error('Copying is disabled!');
    };

    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      toast.error('Pasting is disabled!');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('paste', handlePaste);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('paste', handlePaste);
    };
  }, [incrementTabSwitch]);

  const handleSelectOption = (optionIndex: number) => {
    setAnswers((prev) => {
      const current = prev[currentQuestion.id] || [];

      if (currentQuestion.multiCorrect) {
        if (current.includes(optionIndex)) {
          return { ...prev, [currentQuestion.id]: current.filter(i => i !== optionIndex) };
        }
        return { ...prev, [currentQuestion.id]: [...current, optionIndex] };
      }
      return { ...prev, [currentQuestion.id]: [optionIndex] };
    });
  };

  const handleFlag = () => {
    setFlagged((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(currentQuestion.id)) {
        newSet.delete(currentQuestion.id);
      } else {
        newSet.add(currentQuestion.id);
      }
      return newSet;
    });
  };

  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return; 
    setIsSubmitting(true);

    // Calculate Score
    let score = 0;
    questions.forEach(q => {
      const userAnswers = answers[q.id] || [];
      // Note: 'correct_answer' in DB is the string value (e.g., "5 hours")
      // We need to find which index that corresponds to in q.options
      const correctOptionIndex = q.options.findIndex(opt => opt === q.correct_answer);

      if (correctOptionIndex !== -1 && userAnswers.includes(correctOptionIndex)) {
        score += (q.points || 10);
      }
    });

    console.log("🚀 Attempting Submission...", { score, userId });

    try {
      const { data: { user } } = await supabase.auth.getUser();
      const authUserId = user?.id || userId;

      if (!authUserId) throw new Error("User ID not found.");

      const timestamp = new Date().toISOString();

      // 1. Update Profile
      await supabase.from('profiles').upsert({
          id: authUserId,
          email: email,
          score: score, 
          last_active: timestamp,
          competition_status: 'active'
      }, { onConflict: 'id' });

      // 2. Submit MCQ Data
      // IMPORTANT: We use UPDATE to preserve the 'question_set' we saved earlier
      const { error: updateError } = await supabase
          .from('mcq_submissions')
          .update({
              score: score,
              answers: answers, 
              updated_at: timestamp
          })
          .eq('user_id', authUserId);

      // Fallback: If record somehow missing, insert it (but try to preserve current Qs if we have them)
      if (updateError) {
          console.error("Update failed, trying upsert", updateError);
          const assignedIds = questions.map(q => q.id); // Grab current question IDs
          await supabase.from('mcq_submissions').upsert({
             user_id: authUserId,
             question_set: assignedIds,
             score: score,
             answers: answers,
             updated_at: timestamp
          }, { onConflict: 'user_id' });
      }

      console.log(" MCQ Submission Successful");

      // 3. Update Leaderboard
      const { data: existing } = await supabase.from('leaderboard').select('*').eq('user_id', authUserId).maybeSingle();
      const r2 = existing?.round2_score || 0;
      const r3 = existing?.round3_score || 0;
      
      await supabase.from('leaderboard').upsert({
        user_id: authUserId,
        round1_score: score,
        overall_score: score + r2 + r3,
        updated_at: timestamp
      }, { onConflict: 'user_id' });

    } catch (err: any) {
      console.error("❌ CRITICAL SUBMISSION ERROR:", err.message || err);
      toast.error(`Submission Issue: ${err.message || "Please contact admin"}`);
    }

    setTimeout(() => {
      setSubmitted(true);
      setIsSubmitting(false);
      completeRound('mcq');
    }, 1000);
  }, [answers, questions, userId, completeRound, email, isSubmitting]);

  const handleTimeUp = useCallback(() => {
    toast.error("Time's up! Auto-submitting your answers...");
    handleSubmit();
  }, [handleSubmit]);

  // Show transition screen after submission
  if (submitted) {
    return <RoundTransition
      completedRound="MCQ Round"
      nextRoundName="Flowchart Round"
      nextRoundSlug="flowchart"
    />;
  }

  if (loadingQuestions) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-zinc-400">Allocating your unique question set...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No Questions Available</h3>
          <p className="text-zinc-400">Please contact the administrator.</p>
        </div>
      </div>
    );
  }

  const answeredCount = Object.keys(answers).length;
  const isCurrentAnswered = answers[currentQuestion.id]?.length > 0;
  const isCurrentFlagged = flagged.has(currentQuestion.id);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = (answeredCount / questions.length) * 100;

  return (
    <div className="flex-1 flex overflow-hidden">
        {/* Center: Question Area */}
        <main className="flex-1 p-4 md:p-8 flex flex-col items-center justify-center overflow-hidden">
            <div className="w-full max-w-4xl h-full flex flex-col">
                {/* Question Header */}
                <div className="flex justify-between items-center mb-4 shrink-0">
                    <span className="px-4 py-1.5 bg-[#d4af37]/10 text-[#FFD700] text-sm font-black rounded-full border border-[#d4af37]/20">
                        Q {currentIndex + 1} / {questions.length}
                    </span>
                    <button
                        onClick={handleFlag}
                        className={cn(
                          "flex items-center gap-2 px-4 py-1.5 rounded-full border transition-all",
                          isCurrentFlagged
                            ? 'bg-red-900/20 border-red-500/50 text-red-500'
                            : 'bg-transparent border-[#d4af37]/20 text-gray-400 hover:text-[#d4af37]'
                        )}
                    >
                        <Flag size={14} fill={isCurrentFlagged ? "currentColor" : "none"} />
                        <span className="text-xs font-bold uppercase tracking-widest">{isCurrentFlagged ? 'Flagged' : 'Flag'}</span>
                    </button>
                </div>

                {/* Question Card */}
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex-1 bg-[#051112] border border-[#d4af37]/20 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden flex flex-col min-h-0"
                >
                    {/* Card Decoration */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4af37]/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />

                    {/* Question Content */}
                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        <div className="text-gray-200 font-cinzel leading-relaxed mb-10 whitespace-pre-wrap text-xl md:text-2xl drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">

                            {currentQuestion.title}
                        </div>

                        {currentQuestion.description && (
                          <p className="text-sm text-zinc-400 mb-6 leading-relaxed italic">
                            {currentQuestion.description}
                          </p>
                        )}

                        {/* Options */}
                        <div className="space-y-3">
                            {currentQuestion.options.map((option, idx) => {
                                const isSelected = answers[currentQuestion.id]?.includes(idx);
                                return (
                                  <button
                                      key={idx}
                                      onClick={() => handleSelectOption(idx)}
                                      className={cn(
                                        "w-full text-left p-4 rounded-xl border transition-all duration-300 flex items-center gap-4 group",
                                        isSelected
                                          ? 'bg-[#d4af37]/10 border-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                                          : 'bg-black/20 border-white/5 hover:border-[#d4af37]/40 hover:bg-white/5'
                                      )}
                                  >
                                      <div className={cn(
                                        "w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-sm shrink-0 transition-all",
                                        isSelected
                                          ? 'bg-[#d4af37] border-[#d4af37] text-black'
                                          : 'border-[#d4af37]/30 text-[#d4af37]/50 group-hover:border-[#d4af37]'
                                      )}>
                                          {String.fromCharCode(65 + idx)}
                                      </div>
                                      <span className={cn(
                                        "text-base md:text-lg transition-colors",
                                        isSelected ? 'text-white font-bold' : 'text-gray-400 group-hover:text-gray-200'
                                      )}>
                                          {option}
                                      </span>
                                  </button>
                                );
                            })}
                        </div>
                    </div>
                </motion.div>

                {/* Bottom Nav */}
                <div className="flex justify-between items-center py-4 shrink-0">
                    <button
                        disabled={currentIndex === 0}
                        onClick={() => setCurrentIndex(prev => prev - 1)}
                    className="flex items-center gap-2 px-6 py-2 rounded-xl border-2 border-[#d4af37]/30 text-[#d4af37] font-cinzel hover:bg-[#d4af37]/10 hover:border-[#d4af37]/60 disabled:opacity-20 disabled:pointer-events-none transition-all shadow-[0_0_10px_rgba(212,175,55,0.05)]"

                    >
                        <ChevronLeft size={20} />
                        <span className="text-lg">Previous</span>
                    </button>

                    <div className="md:hidden text-center text-xs font-black uppercase text-[#d4af37]/50 font-wizard tracking-tighter">
                        {currentIndex + 1} / {questions.length}
                    </div>

                    {currentIndex === questions.length - 1 ? (
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="flex items-center gap-3 px-8 py-2 rounded-xl bg-gradient-to-r from-[#8a6e2e] to-[#d4af37] text-black font-cinzel hover:from-[#d4af37] hover:to-[#FFD700] shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all text-lg disabled:opacity-50 disabled:cursor-not-allowed"

                        >
                            <span className="mt-1 font-bold">{isSubmitting ? 'Summoning...' : 'Complete Round'}</span>
                            {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
                        </button>
                    ) : (
                        <button
                            onClick={() => setCurrentIndex(prev => prev + 1)}
                            className="flex items-center gap-3 px-10 py-2 rounded-xl bg-gradient-to-r from-[#8a6e2e] to-[#d4af37] text-black font-cinzel hover:from-[#d4af37] hover:to-[#FFD700] shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all text-lg"

                        >
                            <span className="text-lg mt-1 font-bold">Next</span>
                            <ChevronRight size={18} />
                        </button>
                    )}
                </div>
            </div>
        </main>

        {/* Right Sidebar: Status & Nav */}
        <aside className="w-80 border-l border-[#d4af37]/10 bg-[#051112]/40 p-5 hidden xl:block">
            {/* Timer Section */}
            <div className="mb-6 bg-black/40 rounded-xl p-4 border border-[#d4af37]/10 flex items-center justify-between">
                <CompetitionTimer 
                    totalSeconds={roundDuration} 
                    onTimeUp={handleTimeUp}
                    render={({ timeLeft, formatTime }) => (
                      <>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none mb-1 font-wizard">Time Remaining</span>

                            <span className={cn(
                                "text-lg font-black",
                                timeLeft < 300 ? 'text-red-500 animate-pulse' : 'text-[#FFD700]'
                            )}>
                                {formatTime(timeLeft)}
                            </span>
                        </div>
                        <div className="p-2.5 bg-[#d4af37]/10 rounded-lg text-[#d4af37]">
                            <Clock size={20} />
                        </div>
                      </>
                    )}
                />
            </div>

            <div className="space-y-5">
                {/* Round Metadata */}
                <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-500 font-wizard">

                        <span>Current Phase</span>
                        <span className="text-[#FFD700]">MCQ ROUND</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-500 font-wizard">

                        <span>Anticheat Status</span>
                        <div className="flex items-center gap-1 text-green-500">
                            <MonitorCheck size={12} />
                            <span>Active</span>
                        </div>
                    </div>
                </div>

                <hr className="border-[#d4af37]/10" />

                {/* Progress Section */}
                <div>
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 font-wizard">

                        <span>Submission Progress</span>
                        <span className="text-[#d4af37]">{answeredCount}/{questions.length}</span>
                    </div>
                    <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden border border-[#d4af37]/5">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercent}%` }}
                            className="h-full bg-linear-to-r from-[#8a6e2e] to-[#d4af37] shadow-[0_0_10px_rgba(212,175,55,0.5)]"
                        />
                    </div>
                </div>

                {/* Question Navigator */}
                <div className="pt-2">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3 font-wizard">Question Navigator</h3>

                    <div className="grid grid-cols-5 gap-2">
                        {questions.map((q, idx) => (
                            <button
                                key={q.id}
                                onClick={() => setCurrentIndex(idx)}
                                className={cn(
                                    "aspect-square rounded-lg flex items-center justify-center text-xs font-black transition-all border",
                                    currentIndex === idx
                                      ? 'bg-[#d4af37] text-black border-[#d4af37] shadow-[0_0_10px_rgba(212,175,55,0.4)]'
                                      : answers[q.id]?.length > 0
                                          ? 'bg-green-900/40 text-green-500 border-green-500/50'
                                          : flagged.has(q.id)
                                              ? 'bg-red-900/40 text-red-500 border-red-500/50 underline'
                                              : 'bg-black/40 text-gray-500 border-[#d4af37]/10 hover:border-[#d4af37]/40'
                                )}
                            >
                                {idx + 1}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Warnings/Status */}
                <div className="pt-2">
                    <div className="p-4 bg-red-900/20 rounded-xl border border-red-500/30 flex items-start gap-3">
                        <AlertTriangle size={18} className="text-red-500 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-1 font-wizard">Attention Agent!</p>

                            <p className="text-[10px] text-gray-400 leading-tight">Unauthorized tab switching or navigation will lead to immediate sanction. Stay within the Arena.</p>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    </div>
  );
};