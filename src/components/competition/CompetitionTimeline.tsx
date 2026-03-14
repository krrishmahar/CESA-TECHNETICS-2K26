import { motion } from 'framer-motion';
import { Check, Lock, Play, FileText, GitBranch, Code } from 'lucide-react';
import { useCompetitionStore, Round, RoundStatus } from '@/store/competitionStore';
import { cn } from '@/lib/utils';

interface TimelineStep {
  id: Round;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const steps: TimelineStep[] = [
  {
    id: 'rules',
    title: 'Competition Rules',
    description: 'Read and accept the rules',
    icon: <FileText className="w-4 h-4" />,
  },
  {
    id: 'mcq',
    title: 'Round 1: Arithmancy',
    description: 'Mental logic & numerical riddles',
    icon: <Check className="w-4 h-4" />,
  },
  {
    id: 'flowchart',
    title: 'Round 2: Ancient Runes',
    description: 'Sync and deploy the codebase',
    icon: <GitBranch className="w-4 h-4" />,
  },
  {
    id: 'coding',
    title: 'Round 3: Dark Code Defense',
    description: 'Select your hackathon quest',
    icon: <Code className="w-4 h-4" />,
  },

];

const getStatusIcon = (status: RoundStatus) => {
  switch (status) {
    case 'completed':
      return <Check className="w-3.5 h-3.5" />;
    case 'locked':
      return <Lock className="w-3.5 h-3.5" />;
    case 'active':
      return <Play className="w-3.5 h-3.5" />;
  }
};

export const CompetitionTimeline = () => {
  const { roundStatus, currentRound, isDarkMark } = useCompetitionStore();
  let currentSteps = [...steps];
  if (isDarkMark) {
    currentSteps = [{
      id: 'darkmark',
      title: 'Bonus: Dark Mark Bounty',
      description: 'The ultimate extraction challenge',
      icon: <Check className="w-4 h-4 text-red-500" />,
    }];
  }

  return (
    <div className="p-4 h-full">
      <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#d4af37]/70 mb-8 font-cinzel">
        {isDarkMark ? "Extraction Progress" : "Competition Progress"}
      </h2>

      
      <div className="space-y-10 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-px before:bg-[#d4af37]/10">
        {currentSteps.map((step) => {
          const status = roundStatus[step.id];
          const isActive = currentRound === step.id;
          const isCompleted = status === 'completed';
          const isLocked = status === 'locked';
          
          return (
            <div key={step.id} className={cn("relative flex gap-4 transition-all duration-500", !isActive && !isCompleted && "opacity-40")}>
              {/* Bullet / Icon */}
              <div 
                className={cn(
                  "z-10 w-10 h-10 rounded-full border flex items-center justify-center shrink-0 transition-all",
                  isCompleted && "bg-green-900/30 border-green-500/50 text-green-500",
                  isActive && "bg-[#d4af37]/20 border-[#d4af37]/60 text-[#FFD700] shadow-[0_0_15px_rgba(212,175,55,0.3)]",
                  isLocked && "bg-gray-900 border-gray-700 text-gray-500"
                )}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : step.icon}
              </div>

              {/* Text Content */}
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className={cn(
                    "text-xs font-bold uppercase tracking-wider font-cinzel",
                    isCompleted && "text-green-500",
                    isActive && "text-[#FFD700]",
                    isLocked && "text-gray-400"
                  )}>
                    {step.title}
                  </h3>

                  {isActive && (
                    <span className="text-[8px] px-1.5 py-0.5 bg-[#d4af37]/20 text-[#FFD700] rounded font-bold uppercase tracking-tighter">Active</span>
                  )}
                  {isLocked && <Lock className="w-2.5 h-2.5 text-gray-600" />}
                </div>
                <p className={cn(
                    "text-[10px] uppercase font-bold tracking-tight",
                    isCompleted && "text-gray-500",
                    isActive && "text-gray-400",
                    isLocked && "text-gray-600"
                )}>
                  {isCompleted ? "Completed" : step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};