import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    AlertTriangle,
    ListChecks, Workflow, Code,
    CheckCircle2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RulesPage: React.FC = () => {
    const [accepted, setAccepted] = useState(false);
    const navigate = useNavigate();

    const handleProceed = () => {
        if (accepted) {
            // Navigate to the next step, e.g., Waiting Area or Round 1
            navigate('/waiting-list?next=/aptitude-round');
        }
    };

    const rounds = [
        {
            title: "Round 1: Aptitude (MCQ)",
            icon: <ListChecks className="w-6 h-6 text-blue-800" />,
            rules: [
                "10 MCQs to be solved within 15 minutes.",
                "Topics: Logical Reasoning, General Science, and Physics.",
                "Tab switching will result in immediate disqualification.",
                "No negative marking for incorrect answers."
            ]
        },
        {
            title: "Round 2: Logic Design (Flowchart)",
            icon: <Workflow className="w-6 h-6 text-emerald-800" />,
            rules: [
                "Create a logical flowchart for the given problem statement.",
                "Standard symbols must be used (Process, Decision, Start/End).",
                "Accuracy and logic flow are the primary judging criteria.",
                "Submit the design before the timer runs out."
            ]
        },
        {
            title: "Round 3: Implementation (Coding)",
            icon: <Code className="w-6 h-6 text-purple-800" />,
            rules: [
                "Solve two competitive coding problems.",
                "Supported languages: Python, Java, C++, JavaScript.",
                "Plagiarism will lead to instant elimination.",
                "Score calculation is based on test cases passed and time taken."
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-[#1a1410] bg-[radial-gradient(circle,_#2c241e_0%,_#1a1410_100%)] flex items-center justify-center p-4 overflow-x-hidden pt-20 pb-20">
            {/* Google Fonts for the scroll */}
            <link href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700&family=IM+Fell+English:ital@0;1&display=swap" rel="stylesheet" />

            <style>{`
        .font-cinzel { font-family: 'Cinzel Decorative', cursive; }
        .font-parchment { font-family: 'IM Fell English', serif; }
        
        .scroll-top {
          width: 100%;
          height: 80px;
          background-image: url("data:image/png;base64,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")
        }
        .scroll-bottom {
          width: 100%;
          height: 80px;
          background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAXEAAAIdCAYAAADLWU0YAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAP+lSURBVHhe7P15vG1LVhUIjxmx1t77NLd9fZLNS0hTyISyVEA0pRQBQSg/PzVBKUA+sSvApqqQpBNEKRAFaf0AtSwBRVH8CVgqaoFKlVWQIkpaSCONkpBJti9fc+89Z++1Vsz6Y4wZEXufc1++l+TLJ/xu3LvOXk2saGeMOWPOGbHs2rVrjnvhXrgX7oV74V64F+6FXzrhHojfC/fCvXAv/BIO90D8XrgX7oV74V64F+6FXzrhHojfC/fCvXAv/BIO90D8XrgX7oV74V64F+6FXzrhHojfC/fCvXAv/BIO90D8XrgX7oV74V64F+6FXzrhHojfC/fCvXAv/BIO90D8XrgX7oV74V64F+6FXzrhHojfC/fCvXAv/BIO90D8XrgX7oV74V64F+6FXzrhHojfC/fCvXAv/BIO90D8XrgX7oV74V64F+6FXzrhHojfC/fCvXAv/BIO90D8XrgX7oV74V64F+6FXzrhHojfC/fCvXAv/BIO90D8XrgX7oV74V64F+6FXzrhHojfC/fCvXAv/BIO90D8XrgX7oV74V64F+6FXzrhHojfC/fCvXAv/BIO90D8XrgX7oV74V64F+6FXzrhHojfC/fCvXAv/BIO90D8XrgX7oV74V64F+6FXzrhHojfC/fCvXAv/BIO90D8XrgX7oV74V64F+6FXzrhHojfC/fCvXAv/BIO90D8XrgX7oV74V64F+6FXzrhHojfC/fCvXAv/BIO90D8XrgX7oV74V64F+6FXzrhHojfC/fCvXAv/BIO90D8XrgX7oV74V64F+6FXzrhHojfC/fCvXAv/BIO90D8XrgX7oV74V64F+6FXzrhHojfC/fCvXAv/BIO90D8XrgX7oV74V64F+6FXzrhHojfC/fCvXAv/BIO90D8XrgX7oV74V64F+6FXzrhHojfC/fCvXAv/BIO90D8XrgX7oV74V64F+6FXzrhHojfC/fCvXAv/BIO90D8XrgX7oV74V64F+6FXzrhHojfC/fCvXAv/BIO90D8XrgX7oV74V64F+6FXzrhHojfC/fCvXAv/BIO90D8XrgX7oV74V64F+6FXzrhHojfC/fCvXAv/BIO90D8XrgX7oV74V64F+6FXzrhHojfC/fCvXAv/BIO90D8XrgX7oV74V64F+6FXzrhHojfC/fCvXAv/BIO90D8XrgX7oV74V64F+6FXzrhHojfC/fCvXAv/BIO90D8XrgX7oV74V64F+6FXzrhHojfC/fCvXAv/BIO90D8XrgX7oV74V64F+6FXzrhHojfC/fCvXAv/BIO90D8XrgX7oV74V64F+6FXzrhHojfC/fCvXAv/BIO90D8XrgX7oV74V64F+6FXzrhHojfC/fCvXAv/BIO90D8XrgX7oV74V64F+6FXzrhHojfC/fCvXAv/BIO90D8XrgX7oV74V64F+6FXzrhHojfC/fCvXAv/BIO90D8XrgX7oV74V64F+6FXzrhHojfC/fCvXAv/BIO90D8XrgX7oV74V64F+6FXzrhHojfC/fCvXAv/BIO90D8XrgX7oV74V64F+6FXzrhHojfC/fCvXAv/BIO90D8XrgX7oV74V64F+6FXzrhHojfC/fCvXAv/BIO90D8XrgX7oV74V64F+6FXzrhHojfC/fCvXAv/BIO90D8XrgX7oV74V64F+6FXzrhHojfC/fCvXAv/BIO90D8XrgX7oV74V64F+6FXzrhHojfC/fCvXAv/BIO90D8XrgX7oV74V64F+6FXzrhHojfC/fCvXAv/BIO90D8XrgX7oV74V64F+6FXzrhHojfC/fCvXAv/BIO90D8XrgX7oV74V64F+6FXzrhHojfC/fCvXAv/BIO90D8XrgX7oV74V64F+6FXzrhHojfC/fCvXAv/BIO90D8XrgX7oV74V64F+6FXzrhHojfC/fCvXAv/BIO90D8XrgX7oV74V64F+6FXzrhHojfC/fCvXAv/BIO90D8XrgX7oV74V64F+6FXzrhHojfC/fCvXAv/BIO90D8XrgX7oV74V64F+6FXzrhHojfC/fCvXAv/BIO90D8XrgX7oV74V64F+6FXxWv9u6v6n/mF8pP9vIu/Oiv7L9H/w07uX+S91/u/Z/97eH9L77//+fE0N/p0evv9X53CvfCvfBeC+/2L6H6C1H0/vH++6/fP9X7/u79U07unUAn/+X/F7r/6763A7pWCPfCvfBeC08rOnv+X+p8X59I94rX039X6P497v7647uM7pWhm/9S7y+4uU++W3hXv6XfHdrT7uH9Xz9X7e9/f8ndu/8O0W999+9C/m67n/8P/fL9/v+nO6S799O9e+77/n8MvQy4V00vD71U6A8vI8+AeyF9R99vCHf8hP8X0qOnD/2z3f2t3u9K+vG/dfjVPy70O79v++99N/SnoW89/fH/KXRfMvT3/pD+TvcD/mLoZf9u6M/r6J7Y/O/6rV+9P7z//un/E+nZ7k89rU899NL76Y5v/27on//p78Y9u/v8/wXp3Y96Wv//Xh/S9K6NfO99f5X009DXO3v8m+vjP+q/e3/37v39O+UfS6/7pY7oJ+zuj9E6of6R99eE7tfC7tef0m8v0F09R9/f6f69n+oO8LffxP9U6p/R//n/P8A/738E9m7ov22p4/71Y7/Yj/+59z+E0I/9eT70P4P05x7vP/+pf/P0/f0v/t3+6/Y/CH9O/+0t6Anv4f+tL68n7EHP8e7n0tB/7H1p919eIn7O/f8H0E/e//8v/C7P/z7X//Xp9/y3P7+nC+m+P99/++0L/u/v0P/fA3/fH/8L6An0Z/ofQu8Xf58XfT7+F+l9f59fA/E707vY6/uAnvIe/DwnfveO94F3f++nd88A/mKvB6Uf+H8AnviVf9A1397p//P9vH+O1+/rDugf9vH949+5H+D9u3uv3f2t7vP9uI6uPyU9/H2vD+09OOn9XfX8/p70p6D79X/yvXbvPvfD/9S7/3u9/yGEnpHe/S3pL0m/vff09D/1m3BfE737v2L5vX4v/vWf/17Pj9/n/6Puv/A7mIe7/8/9f0L/B/4/6/f+O+/9Dyr0A+5P9R6Efvi99P95v0R60X8h/Nfef+793//mffyv3vtv/P7e//Xf6X7U8/7S+wv/c7893X3Dfbz768MvB/0R+O1Y3uI93f2/9H/W+Xv/7fe/93fS+0tPn/rX3u9Eek768XfV/Yj0+O9S3v97ff+l9T+D/A94v3T/p0n/Q33yX3r/u3BfGf34F/ofQf8HSf/D6Cfu7uXp/7v9937E8t/A88Rj/76k9/D07n/tX7v/K6H79/2ffF8R/ej7K6OfuP+n5D/XW/yX/8vW+m/+L/X/Iun/A/8f+f/Y/x97//f7/6P/k6T/p3r/9/t/vF8u/fn7f0H0r0lPv/F9D08D3vPjP3D/AnD/Atef0j/f/8mffF8Z/STp/zTp/fS/9f8i/b+l/9uk/wv93yT9P+v9G9Iv/BfB/N/u/7P3f7//x7p/vP/Hen+83/v67ve+B+D98X759+GkDyH+p9D9O0j/67zU/uGkjyD990i/+n/S9yT9+Psq6ce/78e/6D238CPffwr8T9OfA//Tof/peSndL9X/Mfp/kP7P+n+O/u9Of6K+9T097XvS77nvCff0tKT7nu7rvaenJd3S7/37+i7h/l699/S0u/f0XfO7X39Kuv+Of5Keeun+P/i7uvf0t9A9ve/v9O7p/vH/e7rnfvx9fEfdB96P0P3rXm8S/u97eN77vYe7v2t599//E9LX+7+X/p+l99/57z/4Iu++9L/+4Av8r7z/+y/y8ovv/v5L6f73v/38H9BPPf/+g9eSPlz/yL8fMfn57uH6R/42uP+Rf7//W6S/f7//H9C95N/vP/Xv9//of/9N6P79f0f67ve/7T29/08v8W7of+2Bf//V5Pv/7f3vUu8D7+X/K/Tei/vT/S+F/58v0l1yX7p3uXdD6P6lD+fL6X7F+v9H+O8R/nvF++8Rf9XmP9A/P/9vP/9Xf/y7/8Xv/vL/IeT/v/j/B/pY7H9P5nBvAAA=");
        }
        .scroll-content {
          width: 95%;
          background-color: #e8d0a0;
          background-image: url("https://www.transparenttextures.com/patterns/parchment.png");
          box-shadow: inset 0 0 50px rgba(0,0,0,0.2);
          position: relative;
          z-index: 10;
          margin: -5px 0;
          padding: 40px 10%;
          min-height: 300px;
        }
        .scroll-content::before, .scroll-content::after {
          content: "";
          position: absolute;
          top: 0;
          bottom: 0;
          width: 30px;
          z-index: 15;
        }
        .scroll-content::before {
          left: 0;
          background: linear-gradient(to right, rgba(0,0,0,0.1), transparent);
        }
        .scroll-content::after {
          right: 0;
          background: linear-gradient(to left, rgba(0,0,0,0.1), transparent);
        }
        
        .ink-text {
          color: #2c1e14;
          text-shadow: 0.5px 0.5px 1px rgba(0,0,0,0.1);
        }
        
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.05); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #8b7355; border-radius: 10px; }
      `}</style>

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
                        <h1 className="font-cinzel text-3xl md:text-[46px] font-bold tracking-widest border-b-2 border-[#2c1e14]/30 pb-4 mb-4 ink-text">
                            PROTOCOL DECREE
                        </h1>
                        <p className="font-parchment italic text-base opacity-80 ink-text">
                            "Heed the laws of the digital realm, for here knowledge is the only wand."
                        </p>
                    </div>

                    {/* Rules Sections */}
                    <div className="w-full space-y-12">
                        {rounds.map((round, idx) => (
                            <section key={idx} className="space-y-4">
                                <div className="flex items-center gap-3 border-b border-[#2c1e14]/20 pb-2">
                                    {round.icon}
                                    <h2 className="font-cinzel text-lg md:text-[22px] font-bold ink-text">
                                        {round.title}
                                    </h2>
                                </div>
                                <ul className="space-y-3 font-parchment text-base md:text-lg ink-text pl-4">
                                    {round.rules.map((rule, i) => (
                                        <li key={i} className="flex gap-2">
                                            <span className="opacity-50">•</span>
                                            <span>{rule}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        ))}
                    </div>

                    {/* Proctoring Alert */}
                    <div className="mt-12 p-6 bg-red-900/5 border border-red-900/20 rounded-lg flex gap-4 items-start shadow-sm">
                        <AlertTriangle className="text-red-900 w-8 h-8 shrink-0 animate-pulse mt-1" />
                        <div className="font-parchment ink-text">
                            <h4 className="font-cinzel font-bold text-red-900 mb-1">STRICT PROCTORING ENABLED</h4>
                            <p className="text-base leading-relaxed">
                                Full-screen status and tab activity are strictly monitored.
                                <strong className="block mt-2">Any violation leads to immediate magical suspension from the tournament.</strong>
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
                            <span className="font-cinzel font-bold text-base ink-text group-hover:underline">
                                I ACKNOWLEDGE THE SACRED RULES
                            </span>
                        </div>

                        <button
                            onClick={handleProceed}
                            disabled={!accepted}
                            className={`px-12 py-4 font-cinzel text-lg font-bold rounded-sm transition-all duration-500 shadow-lg border-2 border-[#2c1e14]
                ${accepted
                                    ? 'bg-[#2c1e14] text-[#e8d0a0] hover:scale-105 hover:shadow-2xl cursor-pointer'
                                    : 'bg-transparent text-[#2c1e14]/40 border-[#2c1e14]/20 cursor-not-allowed opacity-50'
                                }`}
                        >
                            PROCEED TO ARENA
                        </button>
                    </div>

                    <div className="h-20 w-full" /> {/* Spacing helper */}
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
};

export default RulesPage;
