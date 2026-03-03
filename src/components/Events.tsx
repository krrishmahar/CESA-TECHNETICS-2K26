import { motion } from 'framer-motion';

const eventsList = [
  { title: "The Tri-Wizard Tournament", desc: "Model-building race with magical datasets.", team: "1-3", prize: "₹15,000", tag: "AI/ML" },
  { title: "The Dark Mark Bounty", desc: "Autonomous drones battle in arcane arenas.", team: "3-4", prize: "₹12,000", tag: "ROBOTICS" },
  { title: "Half Blood Prince's Handbook", desc: "Design spellbinding interfaces under pressure.", team: "2", prize: "₹10,000", tag: "UI/UX" },
  { title: "The Gameshow", desc: "Competitive coding under enchanted constraints.", team: "2-3", prize: "₹10,000", tag: "CODING" },
  { title: "Chamber of Secrets", desc: "Cybersecurity and CTF challenge in the deep web.", team: "1-2", prize: "₹10,000", tag: "SECURITY" },
  { title: "Potions Master Class", desc: "Chemical engineering & IoT hardware integration.", team: "3", prize: "₹8,000", tag: "HARDWARE" },
  { title: "Pensieve Memories", desc: "AR/VR exploration of historical architecture.", team: "2-4", prize: "₹15,000", tag: "AR/VR" },
  { title: "Gringotts Heist", desc: "FinTech and Blockchain security challenge.", team: "3", prize: "₹12,000", tag: "BLOCKCHAIN" },
];

const Events = () => {
  return (
    <div className="py-24 px-6 md:px-12 bg-[#021516] min-h-screen" id="events">
      <motion.div 
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
        className="max-w-7xl mx-auto mb-16 text-center md:text-left"
      >
        <h2 className="text-5xl md:text-6xl text-[#d4af37] mb-4" style={{ fontFamily: "'Cinzel', serif" }}>
          The Eight Magical Trials
        </h2>
        <div className="h-1 w-32 bg-[#d4af37]/50 rounded-full mx-auto md:mx-0"></div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {eventsList.map((event, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative bg-[#031d1f]/40 backdrop-blur-sm border border-[#d4af37]/20 rounded-2xl p-6 flex flex-col hover:border-[#d4af37]/60 hover:-translate-y-2 transition-all duration-500 shadow-xl"
          >
            {/* Tag */}
            <span className="absolute top-4 right-4 text-[10px] font-bold tracking-widest text-teal-400 bg-teal-900/30 px-2 py-1 rounded border border-teal-800/50">
              {event.tag}
            </span>

            <h3 className="text-xl font-bold text-white group-hover:text-[#d4af37] transition-colors mb-4 pr-12">
              {event.title}
            </h3>
            
            {/* Poster Placeholder with Glow */}
            <div className="w-full h-40 bg-gradient-to-br from-black/60 to-[#021516] rounded-xl mb-6 border border-[#d4af37]/10 flex items-center justify-center relative overflow-hidden group-hover:border-[#d4af37]/30">
               <div className="absolute inset-0 bg-[#d4af37]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
               <span className="text-[10px] text-gray-600 uppercase tracking-tighter">Trial Image Placeholder</span>
            </div>

            <p className="text-sm text-gray-400 mb-6 flex-grow leading-relaxed">
              {event.desc}
            </p>
            
            <div className="flex justify-between items-center border-t border-[#d4af37]/10 pt-4 mb-6">
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-500 uppercase">Team Size</span>
                <span className="text-sm font-semibold text-teal-100">{event.team}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] text-gray-500 uppercase">Prize Pool</span>
                <span className="text-sm font-bold text-[#d4af37]">{event.prize}</span>
              </div>
            </div>

            <button className="w-full py-3 text-xs font-bold text-[#d4af37] border border-[#d4af37]/30 rounded-lg hover:bg-[#d4af37] hover:text-[#021516] transition-all duration-300 uppercase tracking-widest">
              View Details
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Events;